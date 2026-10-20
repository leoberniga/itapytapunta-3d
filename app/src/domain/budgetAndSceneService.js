/**
 * @fileoverview Clean Code Domain Service for BNF Credit Matrix, Item-by-Item Metric Calculation,
 * 7 User Personas (Role-Driven UX/UI Workspace), and 3D Roof / MEP Simulation State Machines.
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
  const normalized = currentStyle === 'oculto' ? 'off' : currentStyle;
  const normalizedIndex = ROOF_STYLES.indexOf(normalized);
  if (normalizedIndex === -1) {
    return 'tejas';
  }
  const nextIndex = (normalizedIndex + 1) % ROOF_STYLES.length;
  return ROOF_STYLES[nextIndex];
}

/**
 * Returns the human-readable UI label for a given roof style.
 *
 * @param {'isopanel' | 'tejas' | 'off' | 'oculto'} style
 * @returns {string}
 */
export function getRoofStyleButtonLabel(style) {
  switch (style) {
    case 'tejas':
      return '🏺 Techo: Tejas Tobatí (Clic p/ Ocultar)';
    case 'off':
    case 'oculto':
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
    if (state.mode && state.active === false) return 'off';
    if (state.tormenta || state.rainstorm || (state.mode === 'tormenta' && state.active !== false)) return 'rainstorm';
    if (state.presion_agua || state.water_supply || (state.mode === 'presion_agua' && state.active !== false)) return 'water_supply';
    if (state.descarga_cloacal || state.sewage_flow || (state.mode === 'descarga_cloacal' && state.active !== false)) return 'sewage_flow';
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
    electricalState?.falla_tierra ||
    electricalState?.fuga_30ma ||
    electricalState?.sobretemp_65c ||
    electricalState?.inundacion_subsuelo
  );
  return hasPluvial || hasElectrical;
}

/**
 * Resolves the included item IDs for a given BNF credit scenario key.
 *
 * @param {string} scenarioKey
 * @param {Record<string, object>} [scenariosMap]
 * @returns {Set<string>}
 */
export function getIncludedPartidaIdsForScenario(scenarioKey, scenariosMap = ESCENARIOS_INVERSION) {
  if (scenarioKey === 'hoy_en_obra') {
    return new Set();
  }
  const scenario = scenariosMap[scenarioKey] || ESCENARIOS_INVERSION[scenarioKey] || ESCENARIOS_INVERSION.escenario300;
  return new Set(scenario?.itemsIncluidos || []);
}

/**
 * Builds the complete, item-by-item Metric Calculation Breakdown for the selected
 * BNF credit scenario, supporting both positional `(scenarioKey, customQuantities)`
 * and options-object `({ scenarioKey, partidas, scenariosMap, builtRubros, ownItemsGs0 })` calls.
 *
 * @param {string | object} scenarioKeyOrOptions
 * @param {Record<string, number>} [customQuantities]
 * @returns {object}
 */
export function buildMetricCalculationBreakdown(scenarioKeyOrOptions = 'escenario300', customQuantities = null) {
  const isOptionsObj = typeof scenarioKeyOrOptions === 'object' && scenarioKeyOrOptions !== null;
  const scenarioKey = isOptionsObj ? (scenarioKeyOrOptions.scenarioKey || 'escenario300') : scenarioKeyOrOptions;
  const scenariosMap = (isOptionsObj && scenarioKeyOrOptions.scenariosMap) || ESCENARIOS_INVERSION;
  const sourcePartidas = (isOptionsObj && scenarioKeyOrOptions.partidas) || PRESUPUESTO_PARTIDAS;

  const isHoy = scenarioKey === 'hoy_en_obra';
  const scenario = isHoy
    ? { id: 'hoy_en_obra', nombre: 'Hoy en Obra (Solo H°A° Ejecutado)', montoObjetivoGs: 0, itemsIncluidos: [] }
    : (scenariosMap[scenarioKey] || ESCENARIOS_INVERSION[scenarioKey] || ESCENARIOS_INVERSION.escenario300);

  const includedIds = getIncludedPartidaIdsForScenario(scenarioKey, scenariosMap);
  const defaultQuantities =
    PROYECTOS_COMPUTO_DIMENSIONES?.proy_adaptacion_pb_pa?.cantidadesPorPartida || {};
  const quantitiesMap = customQuantities || defaultQuantities;
  const bankClassification = REQUISITOS_BANCO_Y_CUOTAS?.clasificacionPartidasBanco || {};

  // 1. Existing Built Structure Rows (Ya está en obra — Acta 29/12/2025)
  const rawBuiltRubros =
    (isOptionsObj && scenarioKeyOrOptions.builtRubros) ||
    REQUISITOS_BANCO_Y_CUOTAS?.construccionesExistentesNegro?.rubros ||
    [];

  const existingWorkRows = rawBuiltRubros.map((rubro) => {
    const subtotalGs = Number(rubro.montoGs) || 0;
    return {
      id: `EXIST-${rubro.codigo}`,
      codigo: rubro.codigo,
      code: rubro.codigo,
      categoria: '0. Obra Ya Ejecutada (Acta 29/12/2025)',
      producto: rubro.item,
      item: rubro.item,
      unidad: rubro.unidad || 'gl',
      cantidad: Number(rubro.cantidad) || 1,
      formulaDim: rubro.estado || 'Certificado en obra',
      precioUnitarioGs: subtotalGs,
      precioTotalGs: subtotalGs,
      subtotalGs,
      colorBanco: 'NEGRO',
      pctMateriales: 62,
      pctManoObra: 38,
      status: ITEM_STATUS.YA_ESTA_EN_OBRA,
      statusMeta: ITEM_STATUS_META[ITEM_STATUS.YA_ESTA_EN_OBRA],
      statusLabel: ITEM_STATUS_META[ITEM_STATUS.YA_ESTA_EN_OBRA].badgeLabel,
      yaEsta: true,
      alreadyBuilt: true,
      incluidoEnCredito: false,
      includedInScenario: false
    };
  });

  // 2. Budget Partidas Rows (Previsto en este Crédito BNF vs No Incluido)
  const creditPartidaRows = sourcePartidas.map((partida, idx) => {
    const isIncluded = !isHoy && includedIds.has(partida.id);
    const rawQty =
      isOptionsObj && partida.cantidad !== undefined
        ? Number(partida.cantidad)
        : quantitiesMap[partida.id] !== undefined
          ? Number(quantitiesMap[partida.id])
          : Number(partida.cantidad);
    const cantidad = Number.isFinite(rawQty) && rawQty > 0 ? rawQty : Number(partida.cantidad) || 1;
    const precioUnitarioGs = Number(partida.precioUnitarioGs) || 0;
    const precioTotalGs = Math.round(cantidad * precioUnitarioGs);
    const bankMeta = bankClassification[partida.id] || {
      colorBanco: 'ROJO',
      pctMateriales: 60,
      pctManoObra: 40
    };
    const status = isIncluded ? ITEM_STATUS.PREVISTO_CREDITO : ITEM_STATUS.NO_INCLUIDO;
    const code = `P-${String(idx + 1).padStart(2, '0')}`;

    return {
      id: partida.id,
      codigo: code,
      code,
      categoria: partida.categoria,
      producto: partida.item,
      item: partida.item,
      unidad: partida.unidad,
      cantidad,
      formulaDim: partida.formulaDim || '',
      precioUnitarioGs,
      precioTotalGs,
      subtotalGs: precioTotalGs,
      colorBanco: bankMeta.colorBanco,
      pctMateriales: bankMeta.pctMateriales,
      pctManoObra: bankMeta.pctManoObra,
      status,
      statusMeta: ITEM_STATUS_META[status],
      statusLabel: ITEM_STATUS_META[status].badgeLabel,
      yaEsta: false,
      alreadyBuilt: false,
      incluidoEnCredito: isIncluded,
      includedInScenario: isIncluded,
      esencial: Boolean(partida.esencial),
      origenLabel: partida.origenLabel || '',
      desc: partida.desc || ''
    };
  });

  // 3. Ruth & Leo's Own Move-in Equipment & Existing Gates (Gs. 0 — Ya Disponible)
  const rawOwnItems =
    (isOptionsObj && scenarioKeyOrOptions.ownItemsGs0 && scenarioKeyOrOptions.ownItemsGs0.length > 0
      ? scenarioKeyOrOptions.ownItemsGs0
      : INVENTARIO_MUEBLES_ACTUALES_LEO?.itemsPropiosCostoCero) || [];

  const ownInventoryRows = rawOwnItems.map((inv, idx) => {
    const num = inv.nro || idx + 1;
    const code = `M-${String(num).padStart(2, '0')}`;
    const label = `${inv.item} — ${inv.ubicacion3D || inv.ubicacion || 'Propio'}`;
    return {
      id: `PROPIO-${num}`,
      codigo: code,
      code,
      categoria: `Equipamiento Propio (${inv.categoria || 'Mudanza Gs. 0'})`,
      producto: label,
      item: label,
      unidad: 'un',
      cantidad: 1,
      formulaDim: inv.medidas || 'Propio Ruth & Leo',
      precioUnitarioGs: 0,
      precioTotalGs: 0,
      subtotalGs: 0,
      colorBanco: 'NEGRO',
      pctMateriales: 0,
      pctManoObra: 0,
      status: ITEM_STATUS.YA_ESTA_PROPIO,
      statusMeta: ITEM_STATUS_META[ITEM_STATUS.YA_ESTA_PROPIO],
      statusLabel: ITEM_STATUS_META[ITEM_STATUS.YA_ESTA_PROPIO].badgeLabel,
      yaEsta: true,
      alreadyBuilt: true,
      incluidoEnCredito: false,
      includedInScenario: false
    };
  });

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
  const targetCreditGs = isHoy ? 0 : Number(scenario.montoObjetivoGs) || 0;
  const differenceGs = isHoy ? 0 : targetCreditGs - totalPrevistoCreditoGs;

  return {
    scenarioId: scenario.id,
    scenarioNombre: scenario.nombre,
    montoObjetivoCreditoGs: targetCreditGs,
    totalPrevistoCreditoGs,
    totalMaterialesCreditoGs,
    totalManoObraCreditoGs,
    totalNoIncluidoGs,
    totalYaEjecutadoObraGs,
    saldoDisponibleCreditoGs: differenceGs,
    summary: {
      scenarioId: scenario.id,
      scenarioNombre: scenario.nombre,
      targetCreditGs,
      totalCreditSelectedGs: totalPrevistoCreditoGs,
      differenceGs,
      totalAlreadyBuiltGs: totalYaEjecutadoObraGs,
      includedItemsCount: rowsPrevistoCredito.length,
      alreadyBuiltCount: rowsYaEsta.length,
      excludedItemsCount: rowsNoIncluido.length,
      notIncludedCount: rowsNoIncluido.length
    },
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
 * Supports both `(rows, statusFilter, searchQuery)` and `(rows, { statusFilter, searchQuery })`.
 *
 * @param {Array<object>} rows
 * @param {string | object} statusFilterOrObj
 * @param {string} [searchQueryArg]
 * @returns {Array<object>}
 */
export function filterMetricRows(rows, statusFilterOrObj = 'ALL', searchQueryArg = '') {
  const isObj = typeof statusFilterOrObj === 'object' && statusFilterOrObj !== null;
  const rawFilter = isObj ? (statusFilterOrObj.statusFilter || 'ALL') : statusFilterOrObj;
  const rawQuery = isObj ? (statusFilterOrObj.searchQuery || '') : searchQueryArg;

  const normalizedFilter =
    rawFilter === 'PREVISTOS'
      ? 'PREVISTO_CREDITO'
      : rawFilter === 'NO_INCLUIDOS'
        ? 'NO_INCLUIDO'
        : rawFilter;
  const normalizedQuery = String(rawQuery || '').trim().toLowerCase();

  return (rows || []).filter((row) => {
    if (normalizedFilter === 'PREVISTO_CREDITO' && row.status !== ITEM_STATUS.PREVISTO_CREDITO) {
      return false;
    }
    if (
      normalizedFilter === 'YA_ESTA' &&
      row.status !== ITEM_STATUS.YA_ESTA_EN_OBRA &&
      row.status !== ITEM_STATUS.YA_ESTA_PROPIO
    ) {
      return false;
    }
    if (normalizedFilter === 'NO_INCLUIDO' && row.status !== ITEM_STATUS.NO_INCLUIDO) {
      return false;
    }

    if (!normalizedQuery) {
      return true;
    }

    const haystack = `${row.codigo} ${row.categoria} ${row.producto} ${row.unidad} ${row.formulaDim}`.toLowerCase();
    return haystack.includes(normalizedQuery);
  });
}

// ============================================================================
// 7 USER PERSONAS (ROLES) WORKSPACE CATALOG & DOMAIN ENGINE
// ============================================================================
export const USER_ROLES_CATALOG = Object.freeze({
  pareja: {
    id: 'pareja',
    nombre: 'Pareja Beneficiada (Ruth y Leo)',
    shortName: '💑 Ruth y Leo',
    icono: 'heart-handshake',
    emoji: '💑',
    color: '#10b981',
    badge: 'PROPIETARIOS • CRÉDITO BNF',
    subtitulo: 'Control de inversión BNF, recorrido realista de su hogar (con Emma y Serafina) y gestión supervisada',
    resumenEjecutivo:
      'Vista integral pensada para Ruth y Leo: muestra exactamente qué incluye cada tramo del crédito BNF (300M / 350M / 440M), la cuota mensual en Gs., su inventario propio a costo Gs. 0 (muebles + SUV Chery T2 Pro) y el modo juego para caminar por los 3 niveles.',
    cameraPreset: 'exterior_hero',
    cutawayPreset: 'full',
    openDrawer: false,
    openMepSim: false,
    activeLayers: {
      muroEstacionamiento: true,
      losaFase2: true,
      techo: true,
      architecture: true,
      subsuelo: true,
      structure: true,
      entornoUrbano: true,
      pluvial: false,
      senalesDebiles: false,
      ductos: false,
      geotech: false,
      topography: true
    },
    quickActions: [
      { id: 'act_pareja_suite', label: '🛏️ Ver Suite + Vestidor (2do Piso)', type: 'focus_room', target: 'dormitorio_suite' },
      { id: 'act_pareja_estar', label: '🛋️ Ver Estar, Cocina y Baño Social (PB)', type: 'focus_room', target: 'estar_comedor' },
      { id: 'act_pareja_subsuelo', label: '🔥 Ver Salón Subsuelo, Lavadero y Parrilla', type: 'focus_room', target: 'subsuelo_depto' },
      { id: 'act_pareja_game', label: '🎮 Iniciar Recorrido Modo Juego (GTA)', type: 'toggle_game', target: 'on' },
      { id: 'act_pareja_pdf', label: '📕 Abrir Presentación Ejecutiva PDF', type: 'open_pdf', target: '/assets/Presentacion_Ejecutiva_Residencia_Ita_Pyta_Punta_Ruth_y_Leo.pdf' }
    ],
    checklistTecnico: [
      'Entidad crediticia: BNF (Banco Nacional de Fomento) — Tasa 9,9% anual a 15 años (Cuota 300M: Gs. 3.529.773/mes c/ seguros).',
      'Ahorro por Gestión Supervisada (6%–8% honorarios = Gs. 18,5M): ahorra Gs. 52,9M frente a contrato llave en mano.',
      'Equipamiento propio a Gs. 0: Sommier 1.40m, Heladera, Cocina a garrafa, Lavarropas, 2 Escritorios, SUV Chery T2 Pro y Portones actuales.',
      'Confort Emma y Serafina: Porcelanato satinado antideslizante, alarma Pet-Immune doble tecnología y rejilla segura en hueco de oxigenación.'
    ],
    partidaIds: [
      'supervision_direccion_tecnica_banco',
      'limpieza_volquetes_contingencia_obra',
      'bano_suite_sanitarios',
      'cocina_mesada_bacha_esencial',
      'lavadero_habitable',
      'placares_dormitorios_adicional',
      'edifica_equipamiento_cocina',
      'piscina_patio_oficial',
      'quincho_patio_subsuelo',
      'jardin_cesped_patio'
    ]
  },

  arquitecto: {
    id: 'arquitecto',
    nombre: 'Arquitecto Proyectista y Director de Obra',
    shortName: '📐 Arquitecto',
    icono: 'compass',
    emoji: '📐',
    color: '#38bdf8',
    badge: 'DISEÑO BIM/CAD • EJES 1–9 / A–G',
    subtitulo: 'Coordinación espacial de 3 niveles, núcleo húmedo vertical Eje F–G, cortes Dollhouse, asoleamiento y planos vivos',
    resumenEjecutivo:
      'Entorno técnico BIM/CAD: permite inspeccionar la distribución original (2 dormitorios + desk al subir la escalera + 2 baños arriba + baño social abajo), alternar el techo entre Isopanel y Tejas de Tobatí, editar tabiques en 2D y regenerar los 4 planos oficiales vivos.',
    cameraPreset: 'planta_alta',
    cutawayPreset: 'cut_roof',
    openDrawer: false,
    openMepSim: false,
    activeLayers: {
      muroEstacionamiento: true,
      losaFase2: true,
      techo: false,
      architecture: true,
      subsuelo: true,
      structure: true,
      entornoUrbano: true,
      pluvial: true,
      senalesDebiles: false,
      ductos: false,
      geotech: false,
      topography: true
    },
    quickActions: [
      { id: 'act_arq_editor2d', label: '📐 Abrir Editor CAD 2D/3D Interactivo', type: 'open_modal', target: 'modal-editor-2d' },
      { id: 'act_arq_planos_vivos', label: '📄 Regenerar 4 Planos Oficiales Vivos', type: 'open_modal', target: 'modal-planos' },
      { id: 'act_arq_cut_pa', label: '🔪 Corte Planta Alta (+102.88m: 2 Dorm + Desk + 2 Baños)', type: 'cutaway', target: 'cut_roof' },
      { id: 'act_arq_cut_pb', label: '🔪 Corte Nivel Calle (+100.00m: Estar + Cocina + Toilette)', type: 'cutaway', target: 'cut_pa' },
      { id: 'act_arq_colores_bnf', label: '🎨 Activar/Desactivar Colores Normativos BNF (⚫🟢🔴🟡)', type: 'toggle_bank_colors', target: 'toggle' }
    ],
    checklistTecnico: [
      'Núcleo húmedo 100% superpuesto sobre Eje F–G (z = 3.00m..5.00m): Baño Suite PA + Baño 2 PA descargan verticalmente sobre Toilette Social y Cocina PB.',
      'Escaleras en costados opuestos según planos: Escalera 1 al Subsuelo en Eje 8–9 (-X) y Escalera 2 a Planta Alta en Eje 1–2 (+X) desembarcando en el Desk.',
      'Fachada frontal Eje G (z = 3.00m) maciza revocada con ventiluces altos de baño (sin balcón frontal ni Blindex costoso en fachada).',
      'Piscina transversal en el fondo (5.80m × 2.40m en z = 23.15m..25.55m), liberando el margen izquierdo para cámara séptica y pozo ciego.'
    ],
    partidaIds: [
      'galeria_voladizo_deck',
      'vidrios_templados_galeria',
      'blindex_habitaciones',
      'edifica_aberturas_madera',
      'puertas_acceso_principal_servicio',
      'cielorraso_acustico_2dopiso',
      'edifica_cielorraso_estar',
      'pisos_porcelanato',
      'edifica_pintura_integral',
      'supervision_direccion_tecnica_banco'
    ]
  },

  ingeniero: {
    id: 'ingeniero',
    nombre: 'Ingeniero Calculador de Precios y Tasador BNF',
    shortName: '🧮 Ing. Precios',
    icono: 'calculator',
    emoji: '🧮',
    color: '#f59e0b',
    badge: 'CÓMPUTO MÉTRICO • CARPETA BNF',
    subtitulo: 'Auditoría de costos producto por producto, desglose Materiales (62%) vs. Mano de Obra (38%) y exportación Excel .XLSX',
    resumenEjecutivo:
      'Despliega automáticamente la Lista de Costos (Cálculo Métrico) y el modo de colores normativos BNF (⚫ Negro = Gs. 163,8M ya construido | 🟢 Verde = H°A° | 🔴 Rojo = Obra nueva | 🟡 Amarillo = Refacción), con exportación directa a Excel .XLSX de 6 hojas con fórmulas.',
    cameraPreset: 'corte_estructural',
    cutawayPreset: 'full',
    openDrawer: true,
    openMepSim: false,
    activeLayers: {
      muroEstacionamiento: true,
      losaFase2: true,
      techo: true,
      architecture: true,
      subsuelo: true,
      structure: true,
      entornoUrbano: false,
      pluvial: false,
      senalesDebiles: false,
      ductos: false,
      geotech: true,
      topography: true
    },
    quickActions: [
      { id: 'act_ing_drawer', label: '📋 Desplegar Lista de Costos Producto por Producto', type: 'open_drawer', target: 'open' },
      { id: 'act_ing_xlsx', label: '📊 Descargar Planilla Excel .XLSX (6 Hojas c/ Fórmulas)', type: 'export_xlsx', target: 'xlsx' },
      { id: 'act_ing_simulador', label: '🏦 Abrir Simulador Financiero BNF Completo', type: 'open_modal', target: 'modal-simulador' },
      { id: 'act_ing_colores', label: '🎨 Pintar Obra con Código de Colores BNF (⚫🟢🔴🟡)', type: 'toggle_bank_colors', target: 'on' }
    ],
    checklistTecnico: [
      'Obra ya ejecutada (⚫ NEGRO — Acta 29/12/2025 JIVESA S.A.): Gs. 163.820.972 (14 zapatas a -4.64m, 20 pilares, Losa 1 y Escalera 1).',
      'Tramo BNF 300M: Gs. 298.210.000 exactos (29 rubros esenciales para habitar los 3 niveles, saldo +Gs. 1.790.000).',
      'Tramo BNF 350M: Gs. 348.075.000 exactos (+Porcelanato 60×60, placares, pérgola cochera, parrilla subsuelo y domótica China).',
      'Tramo BNF 440M: Gs. 439.675.000 exactos (Obra 100% llave en mano + Blindex galería + Piscina transversal en el fondo).'
    ],
    partidaIds: PRESUPUESTO_PARTIDAS.map((p) => p.id)
  },

  plomero: {
    id: 'plomero',
    nombre: 'Maestro Plomero e Instalador Hidrosanitario / Pluvial',
    shortName: '🚰 Plomero',
    icono: 'droplets',
    emoji: '🚰',
    color: '#06b6d4',
    badge: 'ESSAP DIRECTO • PLUVIAL A CALLE',
    subtitulo: 'Agua directa desde medidor ESSAP (sin tanque), núcleo vertical Eje F–G, desagüe pluvial a calle y pozo ciego trasero',
    resumenEjecutivo:
      'Aísla en 3D toda la red hidrosanitaria y pluvial: medidor ESSAP a nivel de vereda en la muralla pequeña junto al portón (x = -3.85m), presión directa de red (sin tanque cisterna), bajada cloacal unificada por Pase #3 (Ø115mm), cámara séptica + pozo ciego en el fondo y drenaje pluvial hacia Calle Tte. Guillermo Arias.',
    cameraPreset: 'fachada_porton',
    cutawayPreset: 'cut_pa',
    openDrawer: false,
    openMepSim: true,
    activeLayers: {
      muroEstacionamiento: true,
      losaFase2: true,
      techo: true,
      architecture: false,
      subsuelo: true,
      structure: true,
      entornoUrbano: false,
      pluvial: true,
      senalesDebiles: false,
      ductos: true,
      geotech: false,
      topography: true
    },
    quickActions: [
      { id: 'act_plom_rain', label: '🌧️ Simular Lluvia Torrencial 165 mm/h (Desagüe a Calle)', type: 'sim_pluvial', target: 'tormenta' },
      { id: 'act_plom_essap', label: '🚰 Simular Agua Directa ESSAP 2.8 bar (Sin Tanque)', type: 'sim_pluvial', target: 'presion_agua' },
      { id: 'act_plom_cloaca', label: '🚽 Simular Descarga Cloacal -> Cámara Séptica y Pozo Ciego', type: 'sim_pluvial', target: 'descarga_cloacal' },
      { id: 'act_plom_stop', label: '⏹️ Detener Simulaciones Hidráulicas', type: 'stop_sims', target: 'off' },
      { id: 'act_plom_nucleo', label: '🚿 Enfocar Núcleo Húmedo Eje F–G (Baños y Cocina)', type: 'focus_room', target: 'cocina_isla' }
    ],
    checklistTecnico: [
      'PROHIBIDO TANQUE DE AGUA: Se utiliza presión directa de red ESSAP (2.8–3.2 bar) desde la caja del medidor en la muralla izquierda (x = -3.85m, z = -4.24m).',
      'Desagüe pluvial 100% hacia ADELANTE (Calle Tte. Guillermo Arias): canaleta oculta N°24 -> 4 bajadas PVC Ø100mm -> registro frontal -> cordón vereda.',
      'Pases diamantados en Losa 1 maciza (sin picar vigas): PASE #3 Ø115mm (Columna cloacal ventilada) y PASE #4 Ø63mm (Termofusión PPR agua fría/caliente).',
      'Sistema cloacal autónomo en patio trasero (x = -3.60m, z = 19.50m..22.20m): Cámara Desengrasadora + Cámara Séptica 1.500L + Pozo Ciego Ø1.80m × 3.50m con caño camisa Ø100mm p/ desagote.'
    ],
    partidaIds: [
      'instalaciones_sanitarias_desagues',
      'forense_cloaca_subsuelo_bombeo',
      'desagues_canaletas',
      'hidro_drenaje_frances',
      'bano_suite_sanitarios',
      'cocina_mesada_bacha_esencial',
      'lavadero_habitable'
    ]
  },

  electricista: {
    id: 'electricista',
    nombre: 'Ingeniero / Técnico Electricista ANDE y Domótica',
    shortName: '⚡ Electricista',
    icono: 'zap',
    emoji: '⚡',
    color: '#a855f7',
    badge: 'ANDE TRIFÁSICA • SMART DIN CHINA',
    subtitulo: 'Bajada ANDE al costado del portón (x = -3.85m), tablero 36–48 DIN con telemetría China, 26 tomas y red Zigbee con Neutro',
    resumenEjecutivo:
      'Muestra en 3D la acometida aérea trifásica ANDE sobre el pilar de la muralla pequeña junto al portón (x = -3.85m, z = -4.08m), el Tablero Principal Smart DIN (36–48 módulos), los pases diamantados #1 y #2 (Ø50mm), los 26 tomacorrientes (20A/16A) y los 6 conos de cámaras PoE.',
    cameraPreset: 'fachada_porton',
    cutawayPreset: 'cut_pa',
    openDrawer: false,
    openMepSim: true,
    activeLayers: {
      muroEstacionamiento: true,
      losaFase2: true,
      techo: false,
      architecture: false,
      subsuelo: true,
      structure: true,
      entornoUrbano: true,
      pluvial: false,
      senalesDebiles: true,
      ductos: true,
      geotech: false,
      topography: true
    },
    quickActions: [
      { id: 'act_elec_fuga', label: '⚠️ Simular Fuga Diferencial 30mA (Corte DIN)', type: 'sim_elec', target: 'fuga_30ma' },
      { id: 'act_elec_temp', label: '🔥 Simular Sobretemperatura >65°C en Toma 20A', type: 'sim_elec', target: 'sobretemp_65c' },
      { id: 'act_elec_stop', label: '⏹️ Restaurar Tablero DIN Normal (220V)', type: 'stop_sims', target: 'off' },
      { id: 'act_elec_pilar', label: '⚡ Enfocar Bajada de Luz ANDE al Costado del Portón', type: 'focus_room', target: 'fachada_porton' },
      { id: 'act_elec_china', label: '📦 Ver Kit Domótica China (Tongou/Sonoff/Aqara)', type: 'open_modal', target: 'modal-simulador' }
    ],
    checklistTecnico: [
      'Bajada de luz ANDE (3×380/220V, TM 3×40A) ubicada exactamente en la muralla frontal pequeña al costado del portón peatonal (x = -3.85m, z = -4.08m).',
      'Regla de Oro Domótica China (costo extra Gs. 0): pasar SIEMPRE cable Neutro celeste 1.5 mm² a todas las cajas de llaves de luz y usar cajas profundas de 5.5 cm.',
      'Tablero Principal de 36–48 módulos DIN con DPS Clase II contra rayos, disyuntores 30mA y medidores inteligentes Zigbee con pinzas CT por fase R-S-T.',
      'Circuitos dedicados de 20A (cable 4 mm² ininflamable) para Aires Split, Termocalefón 80L y mesada de Cocina (Microondas + Air Fryer 1500W).'
    ],
    partidaIds: [
      'instalaciones_electricas_embutidas',
      'kit_domotica_china_tablero_smart',
      'debil_cableado_cat6',
      'debil_cctv_poe',
      'debil_alarma_barreras',
      'porton_cochera_automatizado'
    ]
  },

  albanil: {
    id: 'albanil',
    nombre: 'Maestro Albañil, Hormigón Armado y Mampostería Tobatí',
    shortName: '🧱 Albañil',
    icono: 'hard-hat',
    emoji: '🧱',
    color: '#f97316',
    badge: 'OBRA CIVIL • LADRILLO TOBATÍ',
    subtitulo: 'Cierre hueco 38 m² con Lozarrap, Losa 2do Piso, protocolo Sikadur-32, mampostería Tobatí y cajón hidrófugo Eje 9',
    resumenEjecutivo:
      'Enfoca el esqueleto estructural H°A° (Ejes 1–9 y A–G), el hueco real de 38.00 m² a cerrar con viguetas Lozarrap en Planta Baja, la advertencia sobre los pilares P12, P13 y P15 (que mueren en PB), el muro de contención de cochera y la calculadora de ladrillos de Tobatí.',
    cameraPreset: 'corte_estructural',
    cutawayPreset: 'cut_roof',
    openDrawer: false,
    openMepSim: false,
    activeLayers: {
      muroEstacionamiento: true,
      losaFase2: true,
      techo: false,
      architecture: true,
      subsuelo: true,
      structure: true,
      entornoUrbano: false,
      pluvial: true,
      senalesDebiles: false,
      ductos: false,
      geotech: true,
      topography: true
    },
    quickActions: [
      { id: 'act_alb_hoy', label: '🏗️ Ver Estado «Hoy en Obra» (Hueco 38m² Abierto)', type: 'set_scenario', target: 'hoy_en_obra' },
      { id: 'act_alb_300', label: '🧱 Ver Obra con Cierre Lozarrap 38m² + 2do Piso (300M)', type: 'set_scenario', target: 'escenario300' },
      { id: 'act_alb_subsuelo', label: '🔦 Inspeccionar Subsuelo (Sin Encofrado Viejo / Suelo Tierra)', type: 'focus_room', target: 'subsuelo_depto' },
      { id: 'act_alb_planos', label: '📐 Ver Planos Estructurales E1–E9 y Detalles de Vigas', type: 'open_modal', target: 'modal-planos' }
    ],
    checklistTecnico: [
      'ALERTA ESTRUCTURAL: Los pilares P12 (Eje 6-C), P13 (Eje 5-E) y P15 (Eje 8-C) MUEREN en Planta Baja (+100.00m). Arriba solo levantar tabiquería liviana o ladrillo hueco.',
      'Hueco de 38,00 m² en Losa 1 (cuadrante derecho Estar): cerrar con viguetas pretensadas Lozarrap + bovedilla cerámica + malla Ø4.2mm y capa de compresión 5cm (Gs. 14.440.000).',
      'Continuidad de los 17 pilares a Planta Alta: cepillado de acero expuesto, desoxidante Sika Rustoff y puente epóxico Sikadur-32 Gel antes de hormigonar.',
      'Subsuelo (+97.66m): demoler encofrado viejo junto a escalera para dejar gran salón libre, ubicar lavadero contra pared opuesta y ejecutar lecherada sobre suelo natural.'
    ],
    partidaIds: [
      'contencion_cochera',
      'viga_fundacion_muro',
      'aislacion_relleno_cochera',
      'forense_cerramiento_lozarrap_38m2',
      'forense_puente_adherencia_epoxico',
      'losa_segunda_parte',
      'hormigon_vigas_losa',
      'forense_escalera_tramo_planta_alta',
      'mamposteria_exterior',
      'revoque_exterior_impermeable',
      'sobreelevacion_muralla_lateral_3x2',
      'forense_aislacion_medianera_eje9',
      'hidro_muro_vertical',
      'hidro_capa_horizontal',
      'hidro_membrana_terraza',
      'edifica_vereda_frontal',
      'pisos_porcelanato'
    ]
  },

  herrero: {
    id: 'herrero',
    nombre: 'Maestro Herrero, Estructuras Metálicas y Seguridad Física',
    shortName: '🛠️ Herrero',
    icono: 'wrench',
    emoji: '🛠️',
    color: '#ec4899',
    badge: 'HERRERÍA • REJILLA OXIGENACIÓN • TECHO',
    subtitulo: 'Portones actuales (2.30m + 0.95m), rejilla metálica transitable en hueco de subsuelo, perfiles C de techo y pérgola',
    resumenEjecutivo:
      'Enfoca todos los trabajos de herrería y carpintería metálica: motorización del portón balancín actual de 2.30m (derecha +X) y portoncito peatonal de 0.95m (izquierda -X), piso de rejilla metálica electroforjada sobre la cámara de oxigenación del subsuelo (z = 1.50m..3.00m), estructura de techo Isopanel, pérgola antigranizo y barandas.',
    cameraPreset: 'fachada_porton',
    cutawayPreset: 'full',
    openDrawer: false,
    openMepSim: false,
    activeLayers: {
      muroEstacionamiento: true,
      losaFase2: true,
      techo: true,
      architecture: true,
      subsuelo: true,
      structure: true,
      entornoUrbano: false,
      pluvial: false,
      senalesDebiles: false,
      ductos: false,
      geotech: false,
      topography: true
    },
    quickActions: [
      { id: 'act_herr_porton', label: '🚪 Enfocar Portón Balancín 2.30m (+X) y Peatonal 0.95m (-X)', type: 'focus_room', target: 'fachada_porton' },
      { id: 'act_herr_abrir', label: '🔓 Probar Apertura Animada de Portones en 3D', type: 'toggle_gates_3d', target: 'toggle' },
      { id: 'act_herr_rejilla', label: '🛡️ Ver Rejilla Metálica en Hueco de Oxigenación Subsuelo', type: 'focus_room', target: 'escalera_subsuelo' },
      { id: 'act_herr_techo', label: '🏠 Alternar Techo Isopanel / Tejas / Ver Correas C-100', type: 'cycle_roof', target: 'next' }
    ],
    checklistTecnico: [
      'Portones existentes en línea municipal (z = -4.00m): Portón vehicular balancín de 2,30m × 2,15m a la DERECHA (+X) y portoncito peatonal de 0,95m × 2,10m a la IZQUIERDA (-X), ambos en chapa plegada horizontal gris grafito 100% ciega.',
      'Seguridad anticaídas obligatoria en trinchera de oxigenación del subsuelo (z = 1.50m..3.00m): bastidor de perfil ángulo 1½" × 3/16" con piso de rejilla metálica electroforjada galvanizada transitable + baranda lateral.',
      'Estructura de cubierta (+105.64m): correas de perfil C galvanizado 100×50×15×2mm ancladas a vigas superiores con pendiente del 3% hacia el frente + zinguería y babetas.',
      'Pérgola de cochera (z = -3.80m..+2.80m): estructura combinada con cubierta translúcida antigranizo para proteger la SUV Chery Tiggo 2 Pro 2026 + barandas de escaleras y terraza (19,50 m²).'
    ],
    partidaIds: [
      'estructura_metalica_techo',
      'cubierta_metalica',
      'porton_cochera_automatizado',
      'puertas_seguridad_provisoria',
      'rejas_balcones_seguridad',
      'desagues_canaletas'
    ]
  }
});

/**
 * Returns the complete workspace profile for a given user role ID, defaulting to 'pareja'.
 *
 * @param {string} roleId
 * @returns {object}
 */
export function getRoleWorkspaceConfig(roleId) {
  return USER_ROLES_CATALOG[roleId] || USER_ROLES_CATALOG.pareja;
}

/**
 * Computes the role-specific Bill of Materials & Costs (Cómputo por Especialista)
 * for a given role and BNF credit scenario.
 *
 * @param {string} roleId
 * @param {string} [scenarioKey='escenario300']
 * @param {Array<object>} [customPartidas=null]
 * @returns {object}
 */
export function getRoleBillOfMaterials(roleId, scenarioKey = 'escenario300', customPartidas = null) {
  const role = getRoleWorkspaceConfig(roleId);
  const breakdown = buildMetricCalculationBreakdown({
    scenarioKey,
    partidas: customPartidas || PRESUPUESTO_PARTIDAS
  });

  const allowedIds = new Set(role.partidaIds || []);
  const items = breakdown.allRows.filter((row) => allowedIds.has(row.id));

  const previstoItems = items.filter((r) => r.includedInScenario);
  const totalRoleAllGs = items.reduce((acc, r) => acc + r.precioTotalGs, 0);
  const totalRolePrevistoBnfGs = previstoItems.reduce((acc, r) => acc + r.precioTotalGs, 0);
  const totalRoleMaterialesGs = previstoItems.reduce(
    (acc, r) => acc + Math.round((r.precioTotalGs * r.pctMateriales) / 100),
    0
  );
  const totalRoleManoObraGs = totalRolePrevistoBnfGs - totalRoleMaterialesGs;

  return {
    roleId: role.id,
    roleNombre: role.nombre,
    scenarioKey,
    items,
    previstoCount: previstoItems.length,
    totalCount: items.length,
    totalRoleAllGs,
    totalRolePrevistoBnfGs,
    totalRoleMaterialesGs,
    totalRoleManoObraGs
  };
}

/**
 * Generates a UTF-8 CSV work order and metric calculation sheet tailored to a specific specialist role.
 *
 * @param {string} roleId
 * @param {string} [scenarioKey='escenario300']
 * @param {Array<object>} [customPartidas=null]
 * @returns {string}
 */
export function generateRoleWorkOrderCsv(roleId, scenarioKey = 'escenario300', customPartidas = null) {
  const role = getRoleWorkspaceConfig(roleId);
  const bom = getRoleBillOfMaterials(roleId, scenarioKey, customPartidas);

  const headerLines = [
    `"ORDEN DE TRABAJO Y CÓMPUTO MÉTRICO POR ESPECIALIDAD — RESIDENCIA ITÁ PYTÃ PUNTA"`,
    `"Rol / Especialidad:";"${role.nombre}";"Escenario BNF:";"${scenarioKey}"`,
    `"Total Previsto en este Tramo BNF (Gs):";"${bom.totalRolePrevistoBnfGs}";"Materiales (Gs):";"${bom.totalRoleMaterialesGs}";"Mano de Obra (Gs):";"${bom.totalRoleManoObraGs}"`,
    `""`,
    `"ESPECIFICACIONES Y REGLAS TÉCNICAS DE OBRA PARA ${role.shortName.toUpperCase()}"`,
    ...role.checklistTecnico.map((rule, idx) => `"Regla #${idx + 1}";"${rule.replace(/"/g, '""')}"`),
    `""`,
    `"Código";"Estado en Crédito BNF";"Rubro / Producto";"Categoría";"Fórmula / Medida";"Cantidad";"Unidad";"Precio Unitario (Gs)";"Materiales (Gs)";"Mano de Obra (Gs)";"Subtotal (Gs)"`
  ];

  const itemLines = bom.items.map((r) => {
    const matGs = Math.round((r.precioTotalGs * r.pctMateriales) / 100);
    const moGs = r.precioTotalGs - matGs;
    return [
      r.codigo,
      r.includedInScenario ? 'PREVISTO_BNF' : 'ETAPA_FUTURA',
      `"${(r.producto || '').replace(/"/g, '""')}"`,
      `"${(r.categoria || '').replace(/"/g, '""')}"`,
      `"${(r.formulaDim || '').replace(/"/g, '""')}"`,
      r.cantidad,
      r.unidad,
      r.precioUnitarioGs,
      matGs,
      moGs,
      r.precioTotalGs
    ].join(';');
  });

  return '\uFEFF' + [...headerLines, ...itemLines].join('\r\n');
}
