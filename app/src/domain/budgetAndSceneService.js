/**
 * @fileoverview Clean Code Domain Service for BNF Credit Matrix, Item-by-Item Metric Calculation,
 * and 3D Roof / MEP Simulation State Machines.
 *
 * Principles applied (Robert C. Martin — Clean Code):
 * - Single Responsibility Principle (SRP): Pure domain functions separated from DOM/WebGL side effects.
 * - Intention-Revealing Names: Explicit status enums and self-explanatory function signatures.
 * - Small Functions & Zero Magic Numbers: Deterministic, unit-testable state transitions.
 */

import {
  PRESUPUESTO_PARTIDAS,
  ESCENARIOS_INVERSION,
  REQUISITOS_BANCO_Y_CUOTAS,
  INVENTARIO_MUEBLES_ACTUALES_LEO,
  PROYECTOS_COMPUTO_DIMENSIONES
} from '../data/projectData.js';

export const ITEM_STATUS = Object.freeze({
  YA_ESTA_EN_OBRA: 'YA_ESTA_EN_OBRA',
  YA_ESTA_PROPIO: 'YA_ESTA_PROPIO',
  PREVISTO_CREDITO: 'PREVISTO_CREDITO',
  NO_INCLUIDO: 'NO_INCLUIDO'
});

export const ITEM_STATUS_META = Object.freeze({
  [ITEM_STATUS.YA_ESTA_EN_OBRA]: {
    code: ITEM_STATUS.YA_ESTA_EN_OBRA,
    shortLabel: '✅ Ya está en obra',
    badgeLabel: '✅ YA ESTÁ EN OBRA (Acta 29/12/2025)',
    cssClass: 'status-ya-obra'
  },
  [ITEM_STATUS.YA_ESTA_PROPIO]: {
    code: ITEM_STATUS.YA_ESTA_PROPIO,
    shortLabel: '🏠 Ya tienen Ruth y Leo (Gs. 0)',
    badgeLabel: '🏠 YA DISPONIBLE / PROPIO (Gs. 0)',
    cssClass: 'status-ya-propio'
  },
  [ITEM_STATUS.PREVISTO_CREDITO]: {
    code: ITEM_STATUS.PREVISTO_CREDITO,
    shortLabel: '🎯 Previsto en este Crédito BNF',
    badgeLabel: '🎯 PREVISTO EN ESTE MONTO BNF',
    cssClass: 'status-previsto'
  },
  [ITEM_STATUS.NO_INCLUIDO]: {
    code: ITEM_STATUS.NO_INCLUIDO,
    shortLabel: '⏸️ No incluido en este monto',
    badgeLabel: '⏸️ NO INCLUIDO EN ESTE MONTO',
    cssClass: 'status-no-incluido'
  }
});

export const ROOF_STYLES = Object.freeze(['isopanel', 'tejas', 'off']);

/**
 * Cycles cleanly between the 3 roof visualization states:
 * 'isopanel' -> 'tejas' -> 'off' -> 'isopanel'.
 *
 * @param {string} currentStyle
 * @returns {'isopanel' | 'tejas' | 'off'}
 */
export function cycleRoofStyle(currentStyle) {
  const normalizedIndex = ROOF_STYLES.indexOf(currentStyle);
  if (normalizedIndex === -1) {
    return 'tejas';
  }
  const nextIndex = (normalizedIndex + 1) % ROOF_STYLES.length;
  return ROOF_STYLES[nextIndex];
}

/**
 * Returns the human-readable UI label for a given roof style.
 *
 * @param {'isopanel' | 'tejas' | 'off'} style
 * @returns {string}
 */
export function getRoofStyleButtonLabel(style) {
  switch (style) {
    case 'tejas':
      return '🏺 Techo: Tejas Tobatí (Clic p/ Ocultar)';
    case 'off':
      return '👁️ Techo Oculto (Clic p/ Isopanel)';
    case 'isopanel':
    default:
      return '🏠 Techo: Chapa Isopanel (Clic p/ Tejas)';
  }
}

/**
 * Normalizes a pluvial simulation state (string or boolean flags object) into
 * a deterministic mode string ('off' | 'rainstorm' | 'water_supply' | 'sewage_flow').
 * Prevents the bug where rainstorm could never be deactivated once started.
 *
 * @param {string | object | null | undefined} state
 * @returns {'off' | 'rainstorm' | 'water_supply' | 'sewage_flow'}
 */
export function normalizePluvialSimulationMode(state) {
  if (!state || state === 'off') {
    return 'off';
  }
  if (typeof state === 'string') {
    return state;
  }
  if (typeof state === 'object') {
    if (state.tormenta || state.rainstorm) return 'rainstorm';
    if (state.presion_agua || state.water_supply) return 'water_supply';
    if (state.descarga_cloacal || state.sewage_flow) return 'sewage_flow';
  }
  return 'off';
}

/**
 * Checks whether any pluvial or electrical simulation is currently active.
 *
 * @param {object} pluvialState
 * @param {object} electricalState
 * @returns {boolean}
 */
export function isAnyMepSimulationActive(pluvialState = {}, electricalState = {}) {
  const hasPluvial = Boolean(
    pluvialState?.tormenta ||
    pluvialState?.presion_agua ||
    pluvialState?.descarga_cloacal
  );
  const hasElectrical = Boolean(
    electricalState?.nominal ||
    electricalState?.sobrecarga ||
    electricalState?.falla_tierra
  );
  return hasPluvial || hasElectrical;
}

/**
 * Resolves the included item IDs for a given BNF credit scenario key.
 *
 * @param {string} scenarioKey
 * @returns {Set<string>}
 */
export function getIncludedPartidaIdsForScenario(scenarioKey) {
  const scenario = ESCENARIOS_INVERSION[scenarioKey] || ESCENARIOS_INVERSION.escenario300;
  return new Set(scenario?.itemsIncluidos || []);
}

/**
 * Builds the complete, item-by-item Metric Calculation Breakdown for the selected
 * BNF credit scenario, combining:
 * 1) What is already built on site (Acta 29/12/2025 — ⚫ NEGRO)
 * 2) What Ruth & Leo already own at Gs. 0 (Move-in inventory & existing gates/walls)
 * 3) Every construction item from PRESUPUESTO_PARTIDAS classified as either
 *    PREVISTO_CREDITO (included in the chosen BNF credit amount) or NO_INCLUIDO.
 *
 * @param {string} scenarioKey
 * @param {Record<string, number>} [customQuantities]
 * @returns {object}
 */
export function buildMetricCalculationBreakdown(scenarioKey = 'escenario300', customQuantities = null) {
  const scenario = ESCENARIOS_INVERSION[scenarioKey] || ESCENARIOS_INVERSION.escenario300;
  const includedIds = getIncludedPartidaIdsForScenario(scenario.id);
  const defaultQuantities =
    PROYECTOS_COMPUTO_DIMENSIONES?.proy_adaptacion_pb_pa?.cantidadesPorPartida || {};
  const quantitiesMap = customQuantities || defaultQuantities;
  const bankClassification = REQUISITOS_BANCO_Y_CUOTAS?.clasificacionPartidasBanco || {};

  // 1. Existing Built Structure Rows (Ya está en obra — Acta 29/12/2025)
  const existingWorkRows = (REQUISITOS_BANCO_Y_CUOTAS?.construccionesExistentesNegro?.rubros || []).map(
    (rubro) => ({
      id: `obra_${rubro.codigo}`,
      codigo: rubro.codigo,
      categoria: '0. Obra Ya Ejecutada (Acta 29/12/2025)',
      producto: rubro.item,
      unidad: rubro.unidad || 'gl',
      cantidad: Number(rubro.cantidad) || 1,
      formulaDim: rubro.estado || 'Certificado en obra',
      precioUnitarioGs: Number(rubro.montoGs) || 0,
      precioTotalGs: Number(rubro.montoGs) || 0,
      colorBanco: 'NEGRO',
      pctMateriales: 62,
      pctManoObra: 38,
      status: ITEM_STATUS.YA_ESTA_EN_OBRA,
      statusMeta: ITEM_STATUS_META[ITEM_STATUS.YA_ESTA_EN_OBRA],
      yaEsta: true,
      incluidoEnCredito: false
    })
  );

  // 2. Budget Partidas Rows (Previsto en este Crédito BNF vs No Incluido)
  const creditPartidaRows = PRESUPUESTO_PARTIDAS.map((partida, idx) => {
    const isIncluded = includedIds.has(partida.id);
    const rawQty =
      quantitiesMap[partida.id] !== undefined ? Number(quantitiesMap[partida.id]) : Number(partida.cantidad);
    const cantidad = Number.isFinite(rawQty) && rawQty > 0 ? rawQty : Number(partida.cantidad) || 1;
    const precioUnitarioGs = Number(partida.precioUnitarioGs) || 0;
    const precioTotalGs = Math.round(cantidad * precioUnitarioGs);
    const bankMeta = bankClassification[partida.id] || {
      colorBanco: 'ROJO',
      pctMateriales: 60,
      pctManoObra: 40
    };
    const status = isIncluded ? ITEM_STATUS.PREVISTO_CREDITO : ITEM_STATUS.NO_INCLUIDO;

    return {
      id: partida.id,
      codigo: `P-${String(idx + 1).padStart(2, '0')}`,
      categoria: partida.categoria,
      producto: partida.item,
      unidad: partida.unidad,
      cantidad,
      formulaDim: partida.formulaDim || '',
      precioUnitarioGs,
      precioTotalGs,
      colorBanco: bankMeta.colorBanco,
      pctMateriales: bankMeta.pctMateriales,
      pctManoObra: bankMeta.pctManoObra,
      status,
      statusMeta: ITEM_STATUS_META[status],
      yaEsta: false,
      incluidoEnCredito: isIncluded,
      esencial: Boolean(partida.esencial),
      origenLabel: partida.origenLabel || '',
      desc: partida.desc || ''
    };
  });

  // 3. Ruth & Leo's Own Move-in Equipment & Existing Gates (Gs. 0 — Ya Disponible)
  const ownInventoryRows = (INVENTARIO_MUEBLES_ACTUALES_LEO?.itemsPropiosCostoCero || []).map((inv) => ({
    id: `propio_${inv.nro}`,
    codigo: `M-${String(inv.nro).padStart(2, '0')}`,
    categoria: `Equipamiento Propio (${inv.categoria})`,
    producto: `${inv.item} — ${inv.ubicacion3D}`,
    unidad: 'un',
    cantidad: 1,
    formulaDim: inv.medidas || 'Propio Ruth & Leo',
    precioUnitarioGs: 0,
    precioTotalGs: 0,
    colorBanco: 'NEGRO',
    pctMateriales: 0,
    pctManoObra: 0,
    status: ITEM_STATUS.YA_ESTA_PROPIO,
    statusMeta: ITEM_STATUS_META[ITEM_STATUS.YA_ESTA_PROPIO],
    yaEsta: true,
    incluidoEnCredito: false
  }));

  const allRows = [...creditPartidaRows, ...existingWorkRows, ...ownInventoryRows];

  const rowsPrevistoCredito = creditPartidaRows.filter((r) => r.status === ITEM_STATUS.PREVISTO_CREDITO);
  const rowsNoIncluido = creditPartidaRows.filter((r) => r.status === ITEM_STATUS.NO_INCLUIDO);
  const rowsYaEsta = [...existingWorkRows, ...ownInventoryRows];

  const totalPrevistoCreditoGs = rowsPrevistoCredito.reduce((acc, r) => acc + r.precioTotalGs, 0);
  const totalNoIncluidoGs = rowsNoIncluido.reduce((acc, r) => acc + r.precioTotalGs, 0);
  const totalYaEjecutadoObraGs = existingWorkRows.reduce((acc, r) => acc + r.precioTotalGs, 0);

  const totalMaterialesCreditoGs = rowsPrevistoCredito.reduce(
    (acc, r) => acc + Math.round((r.precioTotalGs * r.pctMateriales) / 100),
    0
  );
  const totalManoObraCreditoGs = totalPrevistoCreditoGs - totalMaterialesCreditoGs;

  return {
    scenarioId: scenario.id,
    scenarioNombre: scenario.nombre,
    montoObjetivoCreditoGs: scenario.montoObjetivoGs,
    totalPrevistoCreditoGs,
    totalMaterialesCreditoGs,
    totalManoObraCreditoGs,
    totalNoIncluidoGs,
    totalYaEjecutadoObraGs,
    saldoDisponibleCreditoGs: scenario.id === 'hoy_en_obra' ? 0 : scenario.montoObjetivoGs - totalPrevistoCreditoGs,
    counts: {
      totalItems: allRows.length,
      previstoCredito: rowsPrevistoCredito.length,
      yaEstaEnObra: existingWorkRows.length,
      yaEstaPropio: ownInventoryRows.length,
      noIncluido: rowsNoIncluido.length
    },
    rowsPrevistoCredito,
    rowsNoIncluido,
    rowsYaEsta,
    allRows
  };
}

/**
 * Filters metric breakdown rows by status filter and free-text query.
 *
 * @param {Array<object>} rows
 * @param {string} statusFilter ('ALL' | 'PREVISTO_CREDITO' | 'YA_ESTA' | 'NO_INCLUIDO')
 * @param {string} searchQuery
 * @returns {Array<object>}
 */
export function filterMetricRows(rows, statusFilter = 'ALL', searchQuery = '') {
  const normalizedQuery = String(searchQuery || '').trim().toLowerCase();

  return rows.filter((row) => {
    if (statusFilter === 'PREVISTO_CREDITO' && row.status !== ITEM_STATUS.PREVISTO_CREDITO) {
      return false;
    }
    if (
      statusFilter === 'YA_ESTA' &&
      row.status !== ITEM_STATUS.YA_ESTA_EN_OBRA &&
      row.status !== ITEM_STATUS.YA_ESTA_PROPIO
    ) {
      return false;
    }
    if (statusFilter === 'NO_INCLUIDO' && row.status !== ITEM_STATUS.NO_INCLUIDO) {
      return false;
    }

    if (!normalizedQuery) {
      return true;
    }

    const haystack = `${row.codigo} ${row.categoria} ${row.producto} ${row.unidad} ${row.formulaDim}`.toLowerCase();
    return haystack.includes(normalizedQuery);
  });
}
