// Generador Nativo OpenXML (.xlsx) — Carpeta Bancaria, Cómputo Métrico y Auditoría 360°
// Residencia Itá Pytã Punta — Ruth y Leo (2 Personas + Emma y Serafina)
// Sin dependencias externas: empaqueta en memoria [Content_Types].xml, _rels/.rels,
// xl/workbook.xml, xl/_rels/workbook.xml.rels, xl/styles.xml y xl/worksheets/sheet1..6.xml
// mediante contenedor ZIP estándar (Store + CRC32 IEEE 802.3) compatible con Excel, LibreOffice Calc y Google Sheets.

import * as ProjectDataModule from './data/projectData.js';
import {
  PRESUPUESTO_PARTIDAS,
  CONTROL_PROPIETARIO_Y_NEGOCIACION_ARQUITECTO,
  AUDITORIA_SEIS_ESPECIALISTAS,
  ESTRATEGIA_COMPRA_CHINA_DOMOTICA_ELECTRICA,
  DUCTOS_PASES_ENCHUFES_DATOS,
  PREVISION_CREDITO_NUEVO,
  REQUISITOS_BANCO_Y_CUOTAS,
  ESCENARIOS_INVERSION,
  CATALOGO_PRODUCTOS_SUGERIDOS_PARAGUAY
} from './data/projectData.js';
import { getSuggestedProductForPartida } from './domain/budgetAndSceneService.js';

// Compatibilidad con alias opcionales si existen o se agregan en projectData.js
const CREDITO_CAJA_MUTUAL =
  ProjectDataModule.CREDITO_CAJA_MUTUAL || PREVISION_CREDITO_NUEVO;
const ITEMS_CREDITO_300M =
  ProjectDataModule.ITEMS_CREDITO_300M ||
  ESCENARIOS_INVERSION?.escenario300?.itemsIncluidos ||
  [];
const ITEMS_CREDITO_350M =
  ProjectDataModule.ITEMS_CREDITO_350M ||
  ESCENARIOS_INVERSION?.escenario350?.itemsIncluidos ||
  [];
const ITEMS_CREDITO_440M =
  ProjectDataModule.ITEMS_CREDITO_440M ||
  ESCENARIOS_INVERSION?.escenario440?.itemsIncluidos ||
  [];

// ============================================================================
// UTILIDADES XML, DIRECCIONAMIENTO DE CELDAS Y EMPAQUETADO ZIP (CRC32)
// ============================================================================

function escapeXml(val) {
  if (val === null || val === undefined) return '';
  return String(val)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
    // Eliminar caracteres de control inválidos en XML 1.0
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '');
}

function colIndexToLetter(colIdx1Based) {
  let n = colIdx1Based;
  let letters = '';
  while (n > 0) {
    const rem = (n - 1) % 26;
    letters = String.fromCharCode(65 + rem) + letters;
    n = Math.floor((n - 1) / 26);
  }
  return letters;
}

function cellRef(colIdx1Based, rowIdx1Based) {
  return `${colIndexToLetter(colIdx1Based)}${rowIdx1Based}`;
}

// estilos en xl/styles.xml (índices 0..17):
// 0: Normal (Calibri 10pt)
// 1: Banner Título Principal (Fondo Azul Noche #0F172A, Texto Blanco Bold 13pt)
// 2: Subtítulo / Metadatos (Fondo #1E293B, Texto Blanco Bold 10pt)
// 3: Encabezado de Tabla (Fondo #1E3A8A, Texto Blanco Bold 10pt, centrado, bordes)
// 4: Sección / Rubro Padre (Fondo #E2E8F0, Texto #0F172A Bold 10pt, bordes)
// 5: Texto Estándar con Bordes (Alineación izquierda, wrap)
// 6: Texto Centrado con Bordes (Unidad / Código / SÍ-NO)
// 7: Número Entero Gs. `#,##0` con Bordes
// 8: Número Decimal Cantidad `#,##0.00` con Bordes
// 9: Porcentaje `0%` Centrado con Bordes
// 10: Fila Total / Resumen Texto Bold (Fondo #DBEAFE, Bordes Dobles/Medios)
// 11: Fila Total / Resumen Gs. Bold `#,##0` (Fondo #DBEAFE, Bordes Medios)
// 12: Color Banco NEGRO (Fondo #1E293B, Texto Blanco Bold)
// 13: Color Banco VERDE Hormigón (Fondo #DCFCE7, Texto #166534 Bold)
// 14: Color Banco ROJO Obra Nueva (Fondo #FEE2E2, Texto #991B1B Bold)
// 15: Color Banco AMARILLO Refacción (Fondo #FEF3C7, Texto #92400E Bold)
// 16: Moneda Gs. Destacada Verde `#,##0` (Fondo #DCFCE7, Texto #166534 Bold)
// 17: Moneda Gs. Alerta / Rojo `#,##0` (Fondo #FEE2E2, Texto #991B1B Bold)
const STYLE = {
  NORMAL: 0,
  TITLE_BANNER: 1,
  SUBTITLE_BANNER: 2,
  TABLE_HEADER: 3,
  SECTION_ROW: 4,
  TEXT: 5,
  TEXT_CENTER: 6,
  GS_INT: 7,
  DEC_QTY: 8,
  PERCENT: 9,
  TOTAL_LABEL: 10,
  TOTAL_GS: 11,
  BANCO_NEGRO: 12,
  BANCO_VERDE: 13,
  BANCO_ROJO: 14,
  BANCO_AMARILLO: 15,
  HIGHLIGHT_GREEN_GS: 16,
  HIGHLIGHT_RED_GS: 17
};

function makeStringCell(col, row, text, style = STYLE.TEXT) {
  const ref = cellRef(col, row);
  return `<c r="${ref}" s="${style}" t="inlineStr"><is><t xml:space="preserve">${escapeXml(text)}</t></is></c>`;
}

function makeNumberCell(col, row, num, style = STYLE.GS_INT) {
  const ref = cellRef(col, row);
  const safeNum = Number.isFinite(Number(num)) ? Number(num) : 0;
  return `<c r="${ref}" s="${style}"><v>${safeNum}</v></c>`;
}

function makeFormulaCell(col, row, formulaExpr, cachedVal = 0, style = STYLE.GS_INT, isStringResult = false) {
  const ref = cellRef(col, row);
  const cleanFormula = String(formulaExpr).replace(/^=/, '');
  if (isStringResult) {
    return `<c r="${ref}" s="${style}" t="str"><f>${escapeXml(cleanFormula)}</f><v>${escapeXml(cachedVal)}</v></c>`;
  }
  const safeNum = Number.isFinite(Number(cachedVal)) ? Number(cachedVal) : 0;
  return `<c r="${ref}" s="${style}"><f>${escapeXml(cleanFormula)}</f><v>${safeNum}</v></c>`;
}

function buildWorksheetXml({ rows, colWidths = [], merges = [] }) {
  const colsXml =
    colWidths.length > 0
      ? `<cols>${colWidths
          .map(
            (w, idx) =>
              `<col min="${idx + 1}" max="${idx + 1}" width="${w}" customWidth="1"/>`
          )
          .join('')}</cols>`
      : '';

  const rowsXml = rows
    .map((r) => {
      const htAttr = r.height ? ` ht="${r.height}" customHeight="1"` : '';
      return `<row r="${r.rowIdx}"${htAttr}>${r.cells.join('')}</row>`;
    })
    .join('');

  const mergesXml =
    merges.length > 0
      ? `<mergeCells count="${merges.length}">${merges
          .map((m) => `<mergeCell ref="${m}"/>`)
          .join('')}</mergeCells>`
      : '';

  return (
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n` +
    `<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" ` +
    `xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">` +
    `<sheetViews><sheetView workbookViewId="0" showGridLines="1"/></sheetViews>` +
    `<sheetFormatPr defaultRowHeight="18"/>` +
    colsXml +
    `<sheetData>${rowsXml}</sheetData>` +
    mergesXml +
    `</worksheet>`
  );
}

// ============================================================================
// HOJA 1: 1_CARPETA_BANCO_COLORES
// Planilla Oficial de Cómputo Métrico por Colores Bancarios + Producto Comercial Sugerido (Paraguay)
// ============================================================================

function buildSheet1CarpetaBanco({ scenarioKey, items, loanAmount }) {
  const activeScenario =
    ESCENARIOS_INVERSION?.[scenarioKey] ||
    ESCENARIOS_INVERSION?.escenario350 ||
    ESCENARIOS_INVERSION?.escenario300;

  const fallbackIds =
    scenarioKey === 'escenario300'
      ? ITEMS_CREDITO_300M
      : scenarioKey === 'escenario440' || scenarioKey === 'edifica460'
        ? ITEMS_CREDITO_440M
        : ITEMS_CREDITO_350M;

  const hasObjectItems =
    Array.isArray(items) &&
    items.length > 0 &&
    items.some((it) => it && typeof it === 'object' && it.id);

  const customOverridesById = new Map();
  const customExtraPartidas = [];
  const basePartidaIds = new Set(PRESUPUESTO_PARTIDAS.map((p) => p.id));

  if (hasObjectItems) {
    items.forEach((it) => {
      if (!it || typeof it !== 'object' || !it.id) return;
      customOverridesById.set(it.id, it);
      if (!basePartidaIds.has(it.id) && !String(it.id).startsWith('EXIST-') && !String(it.id).startsWith('PROPIO-')) {
        customExtraPartidas.push(it);
      }
    });
  }

  const activeSet = new Set(
    Array.isArray(items) && items.length > 0
      ? items
          .filter(
            (it) =>
              it &&
              (typeof it === 'string' ||
                (it.included !== false &&
                  it.activo !== false &&
                  it.includedInActive !== false &&
                  it.incluidoEnCredito !== false))
          )
          .map((it) => (typeof it === 'string' ? it : it.id))
      : activeScenario?.itemsIncluidos?.length
        ? activeScenario.itemsIncluidos
        : fallbackIds
  );

  const clasifMap = REQUISITOS_BANCO_Y_CUOTAS?.clasificacionPartidasBanco || {};
  const existentesNegro =
    REQUISITOS_BANCO_Y_CUOTAS?.construccionesExistentesNegro?.rubros || [
      { codigo: 'E-01', item: 'Excavación, Desmonte y Sondeos Geotécnicos SPT (GEO-STAN #2956)', unidad: 'gl', cantidad: 1, montoGs: 14850000, colorBanco: 'NEGRO', estado: 'EJECUTADO 100%' },
      { codigo: 'E-02', item: '14 Zapatas de H°A° Profundizadas a Cota +95.36m (-4.64m) y Vigas Centradoras VC.T-1', unidad: 'gl', cantidad: 1, montoGs: 42650000, colorBanco: 'NEGRO', estado: 'EJECUTADO 100%' },
      { codigo: 'E-03', item: '20 Pilares P1–P20 y Pórticos 1 a 7 en Subsuelo (+97.66m a +100.00m — PROBETI 240–265 kg/cm²)', unidad: 'gl', cantidad: 1, montoGs: 48920972, colorBanco: 'NEGRO', estado: 'EJECUTADO 100%' },
      { codigo: 'E-04', item: 'Primera Losa Maciza H°A° Visto L1–L4 (+100.00m / Galería L1 -0.45m — PROBETI 315 kg/cm²)', unidad: 'm2', cantidad: 124.42, montoGs: 46200000, colorBanco: 'NEGRO', estado: 'EJECUTADO 100%' },
      { codigo: 'E-05', item: 'Escalera 1 de H°A° Ejecutada (Conecta Subsuelo +97.66m con Planta Nivel Calle +100.00m)', unidad: 'un', cantidad: 1, montoGs: 11200000, colorBanco: 'NEGRO', estado: 'EJECUTADO 100%' },
      { codigo: 'E-06', item: 'Murallas Perimetrales Existentes alrededor del Terreno (Solo se sobreelevan 3m × 2m en un lateral)', unidad: 'gl', cantidad: 1, montoGs: 0, colorBanco: 'NEGRO', estado: 'YA EXISTENTE (Gs. 0)' },
      { codigo: 'E-07', item: 'Portón Balancín Metálico ya Instalado en Frente (Solo se compra e instala el motor)', unidad: 'un', cantidad: 1, montoGs: 0, colorBanco: 'NEGRO', estado: 'YA INSTALADO (Gs. 0)' }
    ];

  const rows = [];
  const fechaIso = new Date().toISOString().slice(0, 10);
  const scenarioTitle =
    activeScenario?.nombre ||
    `Escenario ${scenarioKey || 'Crédito 350 Millones Gs.'}`;

  // Fila 1: Título Principal (15 columnas: A..O)
  rows.push({
    rowIdx: 1,
    height: 28,
    cells: [
      makeStringCell(
        1,
        1,
        'RESIDENCIA ITÁ PYTÃ PUNTA — RUTH Y LEO (2 Personas + Emma y Serafina) | PLANILLA OFICIAL DE CÓMPUTO MÉTRICO POR COLORES BANCARIOS',
        STYLE.TITLE_BANNER
      ),
      ...Array.from({ length: 14 }, (_, i) =>
        makeStringCell(i + 2, 1, '', STYLE.TITLE_BANNER)
      )
    ]
  });

  // Fila 2: Metadatos del Escenario Activo y Fecha
  rows.push({
    rowIdx: 2,
    height: 22,
    cells: [
      makeStringCell(
        1,
        2,
        `Escenario Activo: ${scenarioTitle} | Monto Crédito Referencia: Gs. ${Number(loanAmount || activeScenario?.montoObjetivoGs || 350000000).toLocaleString('es-PY')} | Fecha de Emisión: ${fechaIso}`,
        STYLE.SUBTITLE_BANNER
      ),
      ...Array.from({ length: 14 }, (_, i) =>
        makeStringCell(i + 2, 2, '', STYLE.SUBTITLE_BANNER)
      )
    ]
  });

  // Fila 3: Leyenda Normativa del Banco
  rows.push({
    rowIdx: 3,
    height: 20,
    cells: [
      makeStringCell(
        1,
        3,
        'Código Normativo Carpeta Bancaria: ⚫ NEGRO = Ya Construido (Gs. 163,8M ejecutados) | 🟢 VERDE = Hormigón Armado | 🔴 ROJO = Obra Nueva a Construir | 🟡 AMARILLO = Adecuación / Rehabilitación Preexistencias',
        STYLE.SECTION_ROW
      ),
      ...Array.from({ length: 14 }, (_, i) =>
        makeStringCell(i + 2, 3, '', STYLE.SECTION_ROW)
      )
    ]
  });

  // Fila 4: Encabezados de las 15 Columnas (A..O, con Columna E = Producto Comercial / Marca Sugerida (Paraguay))
  const headers = [
    'Código',
    'Color Carpeta Banco (⚫ Negro / 🟢 Verde / 🔴 Rojo / 🟡 Amarillo)',
    'Categoría / Nivel',
    'Descripción Técnica del Rubro',
    'Producto Comercial / Marca Sugerida (Paraguay)',
    'Unidad',
    'Cantidad',
    'Precio Unitario (Gs.)',
    '% Materiales',
    'Costo Materiales (Gs. Fórmula)',
    '% Mano de Obra',
    'Costo Mano de Obra (Gs. Fórmula)',
    'Subtotal Rubro (Gs. Fórmula =G*H)',
    'Incluido en Escenario Activo (SÍ/NO)',
    'Monto Computado en Escenario (Gs. Fórmula)'
  ];

  rows.push({
    rowIdx: 4,
    height: 30,
    cells: headers.map((h, i) => makeStringCell(i + 1, 4, h, STYLE.TABLE_HEADER))
  });

  // Sección A: Construcciones Existentes ⚫ NEGRO (Filas 5 a 11)
  const firstNegroRow = 5;
  let currentRow = firstNegroRow;

  existentesNegro.forEach((rubro, idx) => {
    const r = currentRow++;
    const override = customOverridesById.get(`EXIST-${rubro.codigo}`) || customOverridesById.get(rubro.codigo);
    const cant = Number(override?.cantidad ?? override?.qty ?? rubro.cantidad) || 1;
    const subtotal =
      override?.subtotalGs !== undefined
        ? Number(override.subtotalGs)
        : override?.precioUnitarioGs !== undefined || override?.unitPrice !== undefined
          ? Math.round(cant * Number(override.precioUnitarioGs ?? override.unitPrice))
          : Number(rubro.montoGs) || 0;
    const pu = cant > 0 ? Math.round(subtotal / cant) : 0;
    const pctMat = 0.62;
    const pctMo = 0.38;
    const matGs = Math.round(subtotal * pctMat);
    const moGs = subtotal - matGs;
    const suggestedProd =
      override?.suggestedProduct ||
      rubro.suggestedProduct ||
      CATALOGO_PRODUCTOS_SUGERIDOS_PARAGUAY[idx + 1]?.suggestedProduct ||
      getSuggestedProductForPartida(idx + 1).suggestedProduct;

    rows.push({
      rowIdx: r,
      height: 20,
      cells: [
        makeStringCell(1, r, rubro.codigo, STYLE.TEXT_CENTER),
        makeStringCell(2, r, '⚫ NEGRO (Ya Construido)', STYLE.BANCO_NEGRO),
        makeStringCell(3, r, 'Fase 1 Ejecutada (Acta 29/12/2025)', STYLE.TEXT),
        makeStringCell(4, r, override?.item || override?.name || rubro.item, STYLE.TEXT),
        makeStringCell(5, r, suggestedProd, STYLE.TEXT),
        makeStringCell(6, r, override?.unidad || override?.unit || rubro.unidad, STYLE.TEXT_CENTER),
        makeNumberCell(7, r, cant, STYLE.DEC_QTY),
        makeNumberCell(8, r, pu, STYLE.GS_INT),
        makeNumberCell(9, r, pctMat, STYLE.PERCENT),
        makeFormulaCell(10, r, `ROUND(M${r}*I${r},0)`, matGs, STYLE.GS_INT),
        makeNumberCell(11, r, pctMo, STYLE.PERCENT),
        makeFormulaCell(12, r, `M${r}-J${r}`, moGs, STYLE.GS_INT),
        makeFormulaCell(13, r, `ROUND(G${r}*H${r},0)`, subtotal, STYLE.GS_INT),
        makeStringCell(14, r, 'YA CONSTRUIDO', STYLE.TEXT_CENTER),
        makeFormulaCell(15, r, `IF(N${r}="SÍ",M${r},0)`, 0, STYLE.GS_INT)
      ]
    });
  });
  const lastNegroRow = currentRow - 1;

  // Sección B: Partidas de Obra Nueva / Hormigón / Rehabilitación (PRESUPUESTO_PARTIDAS + Custom Items)
  const firstNewRow = currentRow;
  let sumNuevoEscenarioGs = 0;
  let sumTotalCatGs = 0;
  let sumMatAllGs = 0;
  let sumMoAllGs = 0;

  const allPartidasToExport = [...PRESUPUESTO_PARTIDAS, ...customExtraPartidas];

  allPartidasToExport.forEach((basePartida, idx) => {
    const r = currentRow++;
    const ov = customOverridesById.get(basePartida.id);
    const p = ov ? { ...basePartida, ...ov } : basePartida;

    const infoBanco = clasifMap[p.id] || {
      colorBanco: 'ROJO',
      pctMateriales: 62,
      pctManoObra: 38
    };
    const colorKey = infoBanco.colorBanco || 'ROJO';
    const colorLabel =
      colorKey === 'VERDE'
        ? '🟢 VERDE (Hormigón Armado)'
        : colorKey === 'AMARILLO'
          ? '🟡 AMARILLO (Adecuación / Rehab.)'
          : '🔴 ROJO (Obra Nueva a Construir)';
    const colorStyle =
      colorKey === 'VERDE'
        ? STYLE.BANCO_VERDE
        : colorKey === 'AMARILLO'
          ? STYLE.BANCO_AMARILLO
          : STYLE.BANCO_ROJO;

    const itemName = p.item || p.name || p.producto || `Rubro #${idx + 1}`;
    const codeMatch = String(itemName).match(/^([0-9]+(?:\.[0-9a-zA-Z]+)?)/);
    const codigo = codeMatch ? `R-${codeMatch[1]}` : `R-${idx + 1}`;
    const cant = Number(p.cantidad ?? p.qty) || 1;
    const pu = Number(p.precioUnitarioGs ?? p.unitPrice) || 0;
    const subtotal = Math.round(cant * pu);
    const pctMat = Number(infoBanco.pctMateriales || 62) / 100;
    const pctMo = Number(infoBanco.pctManoObra || 38) / 100;
    const matGs = Math.round(subtotal * pctMat);
    const moGs = subtotal - matGs;
    const isIncluded =
      ov && (ov.includedInActive !== undefined || ov.included !== undefined || ov.incluidoEnCredito !== undefined)
        ? Boolean(ov.includedInActive ?? ov.included ?? ov.incluidoEnCredito)
        : activeSet.has(p.id);
    const incText = isIncluded ? 'SÍ' : 'NO';
    const escGs = isIncluded ? subtotal : 0;

    const suggestedProductText =
      p.suggestedProduct ||
      getSuggestedProductForPartida(p).suggestedProduct;

    sumTotalCatGs += subtotal;
    sumMatAllGs += matGs;
    sumMoAllGs += moGs;
    if (isIncluded) sumNuevoEscenarioGs += subtotal;

    rows.push({
      rowIdx: r,
      height: 20,
      cells: [
        makeStringCell(1, r, codigo, STYLE.TEXT_CENTER),
        makeStringCell(2, r, colorLabel, colorStyle),
        makeStringCell(3, r, p.categoria || p.category || 'General', STYLE.TEXT),
        makeStringCell(4, r, itemName, STYLE.TEXT),
        makeStringCell(5, r, suggestedProductText, STYLE.TEXT),
        makeStringCell(6, r, p.unidad || p.unit || 'un', STYLE.TEXT_CENTER),
        makeNumberCell(7, r, cant, STYLE.DEC_QTY),
        makeNumberCell(8, r, pu, STYLE.GS_INT),
        makeNumberCell(9, r, pctMat, STYLE.PERCENT),
        makeFormulaCell(10, r, `ROUND(M${r}*I${r},0)`, matGs, STYLE.GS_INT),
        makeNumberCell(11, r, pctMo, STYLE.PERCENT),
        makeFormulaCell(12, r, `M${r}-J${r}`, moGs, STYLE.GS_INT),
        makeFormulaCell(13, r, `ROUND(G${r}*H${r},0)`, subtotal, STYLE.GS_INT),
        makeStringCell(14, r, incText, STYLE.TEXT_CENTER),
        makeFormulaCell(15, r, `IF(N${r}="SÍ",M${r},0)`, escGs, isIncluded ? STYLE.HIGHLIGHT_GREEN_GS : STYLE.GS_INT)
      ]
    });
  });
  const lastNewRow = currentRow - 1;

  // Filas de Resumen Bancario al Final con Fórmulas =SUM(...)
  const rowTotalNegro = currentRow++;
  const totalNegroCached = 163820972;
  rows.push({
    rowIdx: rowTotalNegro,
    height: 22,
    cells: [
      makeStringCell(1, rowTotalNegro, 'RES-1', STYLE.TOTAL_LABEL),
      makeStringCell(2, rowTotalNegro, '⚫ TOTAL NEGRO', STYLE.BANCO_NEGRO),
      makeStringCell(3, rowTotalNegro, 'Obra Existente Certificada', STYLE.TOTAL_LABEL),
      makeStringCell(
        4,
        rowTotalNegro,
        'TOTAL CONSTRUCCIONES EXISTENTES (⚫ NEGRO — Ya Construido s/ Acta 29/12/2025: Gs. 163,8M)',
        STYLE.TOTAL_LABEL
      ),
      makeStringCell(5, rowTotalNegro, 'INC Vallemí / Votorantim / PROBETI H25 Certificado', STYLE.TOTAL_LABEL),
      makeStringCell(6, rowTotalNegro, 'gl', STYLE.TOTAL_LABEL),
      makeNumberCell(7, rowTotalNegro, 1, STYLE.TOTAL_LABEL),
      makeStringCell(8, rowTotalNegro, '', STYLE.TOTAL_LABEL),
      makeNumberCell(9, rowTotalNegro, 0.62, STYLE.PERCENT),
      makeFormulaCell(
        10,
        rowTotalNegro,
        `SUM(J${firstNegroRow}:J${lastNegroRow})`,
        Math.round(totalNegroCached * 0.62),
        STYLE.TOTAL_GS
      ),
      makeNumberCell(11, rowTotalNegro, 0.38, STYLE.PERCENT),
      makeFormulaCell(
        12,
        rowTotalNegro,
        `SUM(L${firstNegroRow}:L${lastNegroRow})`,
        Math.round(totalNegroCached * 0.38),
        STYLE.TOTAL_GS
      ),
      makeFormulaCell(
        13,
        rowTotalNegro,
        `SUM(M${firstNegroRow}:M${lastNegroRow})`,
        totalNegroCached,
        STYLE.TOTAL_GS
      ),
      makeStringCell(14, rowTotalNegro, 'EJECUTADO', STYLE.TOTAL_LABEL),
      makeFormulaCell(
        15,
        rowTotalNegro,
        `SUM(M${firstNegroRow}:M${lastNegroRow})`,
        totalNegroCached,
        STYLE.TOTAL_GS
      )
    ]
  });

  const rowTotalNuevo = currentRow++;
  rows.push({
    rowIdx: rowTotalNuevo,
    height: 22,
    cells: [
      makeStringCell(1, rowTotalNuevo, 'RES-2', STYLE.TOTAL_LABEL),
      makeStringCell(2, rowTotalNuevo, '🔴🟢🟡 OBRA NUEVA', STYLE.BANCO_ROJO),
      makeStringCell(3, rowTotalNuevo, 'Nuevo a Financiar', STYLE.TOTAL_LABEL),
      makeStringCell(
        4,
        rowTotalNuevo,
        'TOTAL ROJO / VERDE / AMARILLO — COSTO DIRECTO NUEVO A FINANCIAR EN ESCENARIO ACTIVO',
        STYLE.TOTAL_LABEL
      ),
      makeStringCell(5, rowTotalNuevo, 'Catálogo Comercial Paraguay (Asunción / Tobatí)', STYLE.TOTAL_LABEL),
      makeStringCell(6, rowTotalNuevo, 'gl', STYLE.TOTAL_LABEL),
      makeNumberCell(7, rowTotalNuevo, 1, STYLE.TOTAL_LABEL),
      makeStringCell(8, rowTotalNuevo, '', STYLE.TOTAL_LABEL),
      makeNumberCell(9, rowTotalNuevo, 1, STYLE.PERCENT),
      makeFormulaCell(
        10,
        rowTotalNuevo,
        `SUM(J${firstNewRow}:J${lastNewRow})`,
        sumMatAllGs,
        STYLE.TOTAL_GS
      ),
      makeNumberCell(11, rowTotalNuevo, 1, STYLE.PERCENT),
      makeFormulaCell(
        12,
        rowTotalNuevo,
        `SUM(L${firstNewRow}:L${lastNewRow})`,
        sumMoAllGs,
        STYLE.TOTAL_GS
      ),
      makeFormulaCell(
        13,
        rowTotalNuevo,
        `SUM(M${firstNewRow}:M${lastNewRow})`,
        sumTotalCatGs,
        STYLE.TOTAL_GS
      ),
      makeStringCell(14, rowTotalNuevo, 'ACTIVO', STYLE.TOTAL_LABEL),
      makeFormulaCell(
        15,
        rowTotalNuevo,
        `SUM(O${firstNewRow}:O${lastNewRow})`,
        sumNuevoEscenarioGs,
        STYLE.HIGHLIGHT_GREEN_GS
      )
    ]
  });

  const rowMat62 = currentRow++;
  const mat62Esc = Math.round(sumNuevoEscenarioGs * 0.62);
  rows.push({
    rowIdx: rowMat62,
    height: 21,
    cells: [
      makeStringCell(1, rowMat62, 'RES-3', STYLE.TOTAL_LABEL),
      makeStringCell(2, rowMat62, '📦 MATERIALES (62%)', STYLE.BANCO_VERDE),
      makeStringCell(3, rowMat62, 'Compra Directa Propietario', STYLE.TOTAL_LABEL),
      makeStringCell(
        4,
        rowMat62,
        'TOTAL MATERIALES ESTIMADO (62% s/ Costo Directo — Compra Directa de Leo sin sobreprecio)',
        STYLE.TOTAL_LABEL
      ),
      makeStringCell(5, rowMat62, 'Compra Directa Proveedores Asunción / Olerías Tobatí', STYLE.TOTAL_LABEL),
      makeStringCell(6, rowMat62, '%', STYLE.TOTAL_LABEL),
      makeNumberCell(7, rowMat62, 0.62, STYLE.PERCENT),
      makeStringCell(8, rowMat62, '', STYLE.TOTAL_LABEL),
      makeNumberCell(9, rowMat62, 0.62, STYLE.PERCENT),
      makeFormulaCell(
        10,
        rowMat62,
        `SUM(J${firstNewRow}:J${lastNewRow})`,
        sumMatAllGs,
        STYLE.TOTAL_GS
      ),
      makeStringCell(11, rowMat62, '', STYLE.TOTAL_LABEL),
      makeStringCell(12, rowMat62, '', STYLE.TOTAL_LABEL),
      makeFormulaCell(
        13,
        rowMat62,
        `ROUND(M${rowTotalNuevo}*0.62,0)`,
        Math.round(sumTotalCatGs * 0.62),
        STYLE.TOTAL_GS
      ),
      makeStringCell(14, rowMat62, '62%', STYLE.TOTAL_LABEL),
      makeFormulaCell(
        15,
        rowMat62,
        `ROUND(O${rowTotalNuevo}*0.62,0)`,
        mat62Esc,
        STYLE.TOTAL_GS
      )
    ]
  });

  const rowMo38 = currentRow++;
  const mo38Esc = sumNuevoEscenarioGs - mat62Esc;
  rows.push({
    rowIdx: rowMo38,
    height: 21,
    cells: [
      makeStringCell(1, rowMo38, 'RES-4', STYLE.TOTAL_LABEL),
      makeStringCell(2, rowMo38, '👷 MANO DE OBRA (38%)', STYLE.BANCO_AMARILLO),
      makeStringCell(3, rowMo38, 'Certificación Semanal', STYLE.TOTAL_LABEL),
      makeStringCell(
        4,
        rowMo38,
        'TOTAL MANO DE OBRA ESTIMADO (38% s/ Costo Directo — Pagos por Avance Medido los Viernes)',
        STYLE.TOTAL_LABEL
      ),
      makeStringCell(5, rowMo38, 'Cuadrillas por Especialidad (Albañil / Plomero / Electricista / Herrero)', STYLE.TOTAL_LABEL),
      makeStringCell(6, rowMo38, '%', STYLE.TOTAL_LABEL),
      makeNumberCell(7, rowMo38, 0.38, STYLE.PERCENT),
      makeStringCell(8, rowMo38, '', STYLE.TOTAL_LABEL),
      makeStringCell(9, rowMo38, '', STYLE.TOTAL_LABEL),
      makeStringCell(10, rowMo38, '', STYLE.TOTAL_LABEL),
      makeNumberCell(11, rowMo38, 0.38, STYLE.PERCENT),
      makeFormulaCell(
        12,
        rowMo38,
        `SUM(L${firstNewRow}:L${lastNewRow})`,
        sumMoAllGs,
        STYLE.TOTAL_GS
      ),
      makeFormulaCell(
        13,
        rowMo38,
        `ROUND(M${rowTotalNuevo}*0.38,0)`,
        Math.round(sumTotalCatGs * 0.38),
        STYLE.TOTAL_GS
      ),
      makeStringCell(14, rowMo38, '38%', STYLE.TOTAL_LABEL),
      makeFormulaCell(
        15,
        rowMo38,
        `ROUND(O${rowTotalNuevo}*0.38,0)`,
        mo38Esc,
        STYLE.TOTAL_GS
      )
    ]
  });

  const rowSup6 = currentRow++;
  const sup6Esc = Math.round(sumNuevoEscenarioGs * 0.06);
  rows.push({
    rowIdx: rowSup6,
    height: 21,
    cells: [
      makeStringCell(1, rowSup6, 'RES-5', STYLE.TOTAL_LABEL),
      makeStringCell(2, rowSup6, '📐 SUPERVISIÓN (6%)', STYLE.TOTAL_LABEL),
      makeStringCell(3, rowSup6, 'Dirección Técnica', STYLE.TOTAL_LABEL),
      makeStringCell(
        4,
        rowSup6,
        'HONORARIOS SUPERVISIÓN TÉCNICA ARQUITECTO (6% — Visitas Semanales + Firma Carpeta Bancaria)',
        STYLE.TOTAL_LABEL
      ),
      makeStringCell(5, rowSup6, 'Dirección Técnica Arquitecto (5 Hitos Quincenales)', STYLE.TOTAL_LABEL),
      makeStringCell(6, rowSup6, '%', STYLE.TOTAL_LABEL),
      makeNumberCell(7, rowSup6, 0.06, STYLE.PERCENT),
      makeStringCell(8, rowSup6, '', STYLE.TOTAL_LABEL),
      makeStringCell(9, rowSup6, '', STYLE.TOTAL_LABEL),
      makeStringCell(10, rowSup6, '', STYLE.TOTAL_LABEL),
      makeNumberCell(11, rowSup6, 0.06, STYLE.PERCENT),
      makeFormulaCell(
        12,
        rowSup6,
        `ROUND(M${rowTotalNuevo}*0.06,0)`,
        Math.round(sumTotalCatGs * 0.06),
        STYLE.TOTAL_GS
      ),
      makeFormulaCell(
        13,
        rowSup6,
        `ROUND(M${rowTotalNuevo}*0.06,0)`,
        Math.round(sumTotalCatGs * 0.06),
        STYLE.TOTAL_GS
      ),
      makeStringCell(14, rowSup6, '6%', STYLE.TOTAL_LABEL),
      makeFormulaCell(
        15,
        rowSup6,
        `ROUND(O${rowTotalNuevo}*0.06,0)`,
        sup6Esc,
        STYLE.TOTAL_GS
      )
    ]
  });

  const rowImp3 = currentRow++;
  const imp3Esc = Math.round(sumNuevoEscenarioGs * 0.03);
  rows.push({
    rowIdx: rowImp3,
    height: 21,
    cells: [
      makeStringCell(1, rowImp3, 'RES-6', STYLE.TOTAL_LABEL),
      makeStringCell(2, rowImp3, '🛡️ IMPREVISTOS (3%)', STYLE.TOTAL_LABEL),
      makeStringCell(3, rowImp3, 'Reserva Bajo Llave de Leo', STYLE.TOTAL_LABEL),
      makeStringCell(
        4,
        rowImp3,
        'RESERVA DE IMPREVISTOS (3% — Bajo llave exclusiva del Propietario Leo)',
        STYLE.TOTAL_LABEL
      ),
      makeStringCell(5, rowImp3, 'Fondo de Reserva Control Propietario', STYLE.TOTAL_LABEL),
      makeStringCell(6, rowImp3, '%', STYLE.TOTAL_LABEL),
      makeNumberCell(7, rowImp3, 0.03, STYLE.PERCENT),
      makeStringCell(8, rowImp3, '', STYLE.TOTAL_LABEL),
      makeStringCell(9, rowImp3, '', STYLE.TOTAL_LABEL),
      makeStringCell(10, rowImp3, '', STYLE.TOTAL_LABEL),
      makeNumberCell(11, rowImp3, 0.03, STYLE.PERCENT),
      makeFormulaCell(
        12,
        rowImp3,
        `ROUND(M${rowTotalNuevo}*0.03,0)`,
        Math.round(sumTotalCatGs * 0.03),
        STYLE.TOTAL_GS
      ),
      makeFormulaCell(
        13,
        rowImp3,
        `ROUND(M${rowTotalNuevo}*0.03,0)`,
        Math.round(sumTotalCatGs * 0.03),
        STYLE.TOTAL_GS
      ),
      makeStringCell(14, rowImp3, '3%', STYLE.TOTAL_LABEL),
      makeFormulaCell(
        15,
        rowImp3,
        `ROUND(O${rowTotalNuevo}*0.03,0)`,
        imp3Esc,
        STYLE.TOTAL_GS
      )
    ]
  });

  const rowGranTotal = currentRow++;
  const granTotalEsc = sumNuevoEscenarioGs + sup6Esc + imp3Esc;
  const granTotalCat =
    sumTotalCatGs + Math.round(sumTotalCatGs * 0.06) + Math.round(sumTotalCatGs * 0.03);
  rows.push({
    rowIdx: rowGranTotal,
    height: 25,
    cells: [
      makeStringCell(1, rowGranTotal, 'TOTAL', STYLE.TOTAL_LABEL),
      makeStringCell(2, rowGranTotal, '✅ TOTAL INVERSIÓN', STYLE.BANCO_VERDE),
      makeStringCell(3, rowGranTotal, 'Cierre Carpeta Banco', STYLE.TOTAL_LABEL),
      makeStringCell(
        4,
        rowGranTotal,
        'TOTAL GENERAL OBRA NUEVA + SUPERVISIÓN (6%) + IMPREVISTOS (3%) EN ESCENARIO ACTIVO',
        STYLE.TOTAL_LABEL
      ),
      makeStringCell(5, rowGranTotal, 'Cierre Carpeta Crédito BNF', STYLE.TOTAL_LABEL),
      makeStringCell(6, rowGranTotal, 'Gs.', STYLE.TOTAL_LABEL),
      makeNumberCell(7, rowGranTotal, 1, STYLE.TOTAL_LABEL),
      makeStringCell(8, rowGranTotal, '', STYLE.TOTAL_LABEL),
      makeStringCell(9, rowGranTotal, '', STYLE.TOTAL_LABEL),
      makeFormulaCell(
        10,
        rowGranTotal,
        `J${rowMat62}`,
        sumMatAllGs,
        STYLE.TOTAL_GS
      ),
      makeStringCell(11, rowGranTotal, '', STYLE.TOTAL_LABEL),
      makeFormulaCell(
        12,
        rowGranTotal,
        `SUM(L${rowMo38}:L${rowImp3})`,
        sumMoAllGs + Math.round(sumTotalCatGs * 0.09),
        STYLE.TOTAL_GS
      ),
      makeFormulaCell(
        13,
        rowGranTotal,
        `SUM(M${rowTotalNuevo},M${rowSup6},M${rowImp3})`,
        granTotalCat,
        STYLE.TOTAL_GS
      ),
      makeStringCell(14, rowGranTotal, 'TOTAL', STYLE.TOTAL_LABEL),
      makeFormulaCell(
        15,
        rowGranTotal,
        `SUM(O${rowTotalNuevo},O${rowSup6},O${rowImp3})`,
        granTotalEsc,
        STYLE.HIGHLIGHT_GREEN_GS
      )
    ]
  });

  const rowPatrimonioTotal = currentRow++;
  rows.push({
    rowIdx: rowPatrimonioTotal,
    height: 24,
    cells: [
      makeStringCell(1, rowPatrimonioTotal, 'PATRIM.', STYLE.TOTAL_LABEL),
      makeStringCell(2, rowPatrimonioTotal, '🏛️ VALOR TOTAL OBRA', STYLE.BANCO_NEGRO),
      makeStringCell(3, rowPatrimonioTotal, 'Negro + Nuevo', STYLE.TOTAL_LABEL),
      makeStringCell(
        4,
        rowPatrimonioTotal,
        'VALOR PATRIMONIAL ACUMULADO DE LA RESIDENCIA (⚫ Negro Construido Gs. 163,8M + 🔴🟢🟡 Obra Nueva)',
        STYLE.TOTAL_LABEL
      ),
      makeStringCell(5, rowPatrimonioTotal, 'Valor Patrimonial Total Residencia', STYLE.TOTAL_LABEL),
      makeStringCell(6, rowPatrimonioTotal, 'Gs.', STYLE.TOTAL_LABEL),
      makeNumberCell(7, rowPatrimonioTotal, 1, STYLE.TOTAL_LABEL),
      makeStringCell(8, rowPatrimonioTotal, '', STYLE.TOTAL_LABEL),
      makeStringCell(9, rowPatrimonioTotal, '', STYLE.TOTAL_LABEL),
      makeStringCell(10, rowPatrimonioTotal, '', STYLE.TOTAL_LABEL),
      makeStringCell(11, rowPatrimonioTotal, '', STYLE.TOTAL_LABEL),
      makeStringCell(12, rowPatrimonioTotal, '', STYLE.TOTAL_LABEL),
      makeFormulaCell(
        13,
        rowPatrimonioTotal,
        `SUM(M${rowTotalNegro},M${rowGranTotal})`,
        totalNegroCached + granTotalCat,
        STYLE.TOTAL_GS
      ),
      makeStringCell(14, rowPatrimonioTotal, 'NEGRO+NUEVO', STYLE.TOTAL_LABEL),
      makeFormulaCell(
        15,
        rowPatrimonioTotal,
        `SUM(O${rowTotalNegro},O${rowGranTotal})`,
        totalNegroCached + granTotalEsc,
        STYLE.TOTAL_GS
      )
    ]
  });

  return buildWorksheetXml({
    rows,
    colWidths: [11, 28, 28, 52, 54, 10, 12, 18, 13, 20, 13, 20, 22, 16, 24],
    merges: ['A1:O1', 'A2:O2', 'A3:O3']
  });
}

// ============================================================================
// HOJA 2: 2_FORMATO_LG_RB_LOZARRAP
// Réplica exacta de las 66 filas de `Planilla computo LG-RB + Lozarrap.xlsx` (Hoja CHAPA)
// con todos los vacíos corregidos (incluyendo 1.4 Cerramiento con loza rap: 38.00 m² × Gs. 380.000 = Gs. 14.440.000)
// ============================================================================

function buildSheet2FormatoLgRbLozarrap() {
  // Definición exacta de las 66 filas:
  // Fila 1: Título de la Planilla Oficial LG-RB + Lozarrap (Hoja CHAPA Auditada y Completada)
  // Fila 2: Cabecera Nº | ÍTEM | UN | CANT | PU | SUBTOTAL | OBSERVACIÓN DE AUDITORÍA FORENSE
  // Filas 3 a 63:Los 13 rubros (1.0 a 13.0) y sus sub-ítems exactos con cantidades y precios unitarios completos
  // Filas 64, 65, 66: SUBTOTAL, IVA (10%) y TOTAL GENERAL con fórmulas =SUM(...)
  const rows = [];

  rows.push({
    rowIdx: 1,
    height: 26,
    cells: [
      makeStringCell(
        1,
        1,
        'PLANILLA DE CÓMPUTO Y PRESUPUESTO LG-RB + LOZARRAP (HOJA CHAPA — 66 FILAS AUDITADAS SIN CELDAS EN CERO)',
        STYLE.TITLE_BANNER
      ),
      ...Array.from({ length: 6 }, (_, i) =>
        makeStringCell(i + 2, 1, '', STYLE.TITLE_BANNER)
      )
    ]
  });

  const headers = [
    'Nº',
    'ÍTEM / DESCRIPCIÓN DE RUBRO (ESTRUCTURA OFICIAL LG-RB + LOZARRAP)',
    'UN',
    'CANT',
    'PU (Gs.)',
    'SUBTOTAL (Gs. Fórmula)',
    'ESTADO / AUDITORÍA FORENSE'
  ];
  rows.push({
    rowIdx: 2,
    height: 24,
    cells: headers.map((h, i) => makeStringCell(i + 1, 2, h, STYLE.TABLE_HEADER))
  });

  // Estructura de las filas 3 a 63 (exactamente 61 filas de datos -> llega a fila 63, y 64-66 son SUBTOTAL, IVA, TOTAL GENERAL)
  const specRows = [
    // 1.0 HORMIGÓN ARMADO (Filas 3..9)
    { r: 3, isSection: true, code: '1.0', name: 'HORMIGÓN ARMADO', sumRange: 'F4:F9', note: 'Suma de sub-rubros 1.1 a 1.6 (incluye Fila 9 Lozarrap corregida)' },
    { r: 4, code: '1.1', name: 'Zapata de H°A° y cimiento de piedra bruta / nivelación de base', un: 'm3', cant: 6.40, pu: 2200000, note: 'Ejecutado en Fase 1 + refuerzo de asiento de muro' },
    { r: 5, code: '1.2', name: 'Pilares H°A° HA-25 (Continuación de 17 pilares a Planta Alta +2.88m)', un: 'm3', cant: 6.20, pu: 2200000, note: 'Continuación sobre pelos de espera Ø12mm c/ Sikadur-32' },
    { r: 6, code: '1.3', name: 'Viga de fundación y encadenado H°A° 15x30 (Superior e Inferior)', un: 'ml', cant: 14.50, pu: 415457, note: 'Viga de fundación de muro de contención y arriostramiento' },
    { r: 7, code: '1.4', name: 'Cerramiento con loza rap: 38.00 m² (Fila omitida en blanco en Excel original)', un: 'm2', cant: 38.00, pu: 380000, note: '¡CORREGIDO! En Excel original tenía 38,00 m² pero PU = 0 Gs (Gs. 14.440.000)', highlight: 'green' },
    { r: 8, code: '1.5', name: 'Escalera H°A° (Tramo a Planta Alta +102.88m / Estructura mixta sin cabezada)', un: 'un', cant: 1.00, pu: 13500000, note: 'Desplazada al vano x=2.84..3.84m para librar 2,88m de cabezada' },
    { r: 9, code: '1.6', name: 'Losa de entrepiso Planta Alta (+102.88m) complemento viguetas y capa compresión', un: 'm2', cant: 54.00, pu: 295000, note: 'Sector Dormitorio Suite y Estudio de Ruth y Leo en 2do Piso' },

    // 2.0 MAMPOSTERÍA DE ELEVACIÓN (Filas 10..14)
    { r: 10, isSection: true, code: '2.0', name: 'MAMPOSTERÍA DE ELEVACIÓN', sumRange: 'F11:F14', note: 'Ladrillos cerámicos y macizos de Tobatí' },
    { r: 11, code: '2.1', name: 'Ladrillo común de Tobatí para nivelación y contención (30cm esp.) Dosificación 1:10', un: 'm2', cant: 46.70, pu: 273366, note: 'Muro de contención de cochera (5.150 ladrillos macizos 1ra)' },
    { r: 12, code: '2.2', name: 'Ladrillo cerámico 12x18x25 (Espesor: 15 cm) Dosificación 1:10 en PB y PA', un: 'm2', cant: 145.00, pu: 115000, note: 'Cerramiento perimetral y divisiones interiores' },
    { r: 13, code: '2.3', name: 'Sobreelevación de muralla lateral antirrobo (Tramo 3,00m × 2,00m) en ladrillo visto', un: 'm2', cant: 6.00, pu: 225000, note: 'Cierre de punto vulnerable hacia calle/vecino' },
    { r: 14, code: '2.4', name: 'Envarillado de refuerzo cada 5 hiladas (Altura 0,60m - 2Ø6 / 1Ø8)', un: 'ml', cant: 205.74, pu: 18500, note: 'Traba antisísmica y control de fisuración en mampostería' },

    // 3.0 AISLACIÓN (Filas 15..19)
    { r: 15, isSection: true, code: '3.0', name: 'AISLACIÓN (CAPAS AISLADORAS HIDRÓFUGAS ESPECIALES)', sumRange: 'F16:F19', note: 'Blindaje hidrófugo integral de barranco y subsuelo' },
    { r: 16, code: '3.1', name: 'Impermeabilización c/ pintura asfáltica y Ceresita en hilada de nivelación', un: 'm2', cant: 47.35, pu: 48000, note: 'Aislación vertical y horizontal de muros en contacto con suelo' },
    { r: 17, code: '3.2', name: 'Blindaje hidrófugo y submural en Medianera Izquierda expuesta (Eje 9)', un: 'gl', cant: 1.00, pu: 6850000, note: 'Patología #1 Informes 2 y 3 (41,21 m² expuestos en excavación)' },
    { r: 18, code: '3.3', name: 'Drenaje francés perimetral (Tubo Ø100mm ranurado + grava + geotextil Bidim)', un: 'ml', cant: 18.00, pu: 165000, note: 'Alivio de presión hidrostática tras muro de contención' },
    { r: 19, code: '3.4', name: 'Impermeabilización de Losa Galería L1 al Río (Membrana 4mm + babetas) y Polietileno 200µ', un: 'm2', cant: 42.00, pu: 110000, note: 'Protección superior de Losa L1 rebajada (-0.45m)' },

    // 4.0 REVOQUES (Filas 20..24)
    { r: 20, isSection: true, code: '4.0', name: 'REVOQUES', sumRange: 'F21:F24', note: 'Revoques exteriores hidrófugos e interiores a la cal' },
    { r: 21, code: '4.1', name: 'Revoque exterior grueso e impermeable fratachado con hidrófugo inorgánico', un: 'm2', cant: 92.84, pu: 65000, note: 'Protección intemperie en fachadas y medianeras' },
    { r: 22, code: '4.2', name: 'Revoque interior fino a la cal fratachado con fieltro', un: 'm2', cant: 197.49, pu: 52000, note: 'Terminación interior lisa en Sala, Comedor, Cocina y Suite' },
    { r: 23, code: '4.3', name: 'Revoque interior hidrófugo en áreas húmedas (Baño Suite, Toilette y Cocina)', un: 'm2', cant: 25.21, pu: 62000, note: 'Base impermeable bajo revestimiento cerámico' },
    { r: 24, code: '4.4', name: 'Mochetas en fachada, goterones cortagotas bajo losas y aristas vivas', un: 'gl', cant: 1.00, pu: 1850000, note: 'Incluye ranurado cortagotas 15x10mm en balcones y aleros' },

    // 5.0 CONTRAPISOS Y CARPETAS (Filas 25..28)
    { r: 25, isSection: true, code: '5.0', name: 'CONTRAPISOS Y CARPETAS', sumRange: 'F26:F28', note: 'Con puente de adherencia SikaLatex sobre Losa 1 expuesta' },
    { r: 26, code: '5.1', name: 'Contrapiso de cascote con hormigón pobre e = 7 cm (incluye pase de cañerías)', un: 'm2', cant: 80.00, pu: 68000, note: 'Cubre los caños corrugados eléctricos/datos sobre Losa 1 maciza' },
    { r: 27, code: '5.2', name: 'Carpeta de nivelación hidrófuga e = 2 cm con puente adherente SikaLatex', un: 'm2', cant: 80.00, pu: 52000, note: 'Evita desprendimiento sobre el hormigón reseco por el sol' },
    { r: 28, code: '5.3', name: 'Protocolo de rehabilitación de Losa 1 expuesta al sol + Sikadur-32 en 17 pilares', un: 'gl', cant: 1.00, pu: 7050000, note: 'Hidrolavado 2500 PSI + sellado Sikaflex-1A + SikaTop-107 + Sikadur-32' },

    // 6.0 PISOS Y ZÓCALOS (Filas 29..33)
    { r: 29, isSection: true, code: '6.0', name: 'PISOS Y ZÓCALOS', sumRange: 'F30:F33', note: 'Porcelanato Satinado R9-R10 Pet-Friendly para Emma' },
    { r: 30, code: '6.1', name: 'Piso Porcelanato rectificado 60x60 acabado Satinado/Mate Natural (Pet-Friendly)', un: 'm2', cant: 80.00, pu: 180000, note: 'Antideslizante R9-R10 (evita patinaje de caniche Emma)' },
    { r: 31, code: '6.2', name: 'Zócalo cerámico / porcelanato esmaltado de 7 cm', un: 'ml', cant: 58.00, pu: 38000, note: 'Perímetro completo de Sala, Comedor, Cocina y Suite' },
    { r: 32, code: '6.3', name: 'Terminación y Deck atérmico en Galería Panorámica L1 al Río (Ejes A-B)', un: 'm2', cant: 33.42, pu: 650000, note: 'Sobre Losa L1 rebajada (-0.45m) mirando al Río Paraguay' },
    { r: 33, code: '6.4', name: 'Vereda reglamentaria (19,80 m²) + Canasto basurero metálico + Camineros', un: 'gl', cant: 1.00, pu: 5312500, note: 'Vereda c/ rampa y basurero (Gs. 4,0M) + caminero peatonal (Gs. 1,31M)' },

    // 7.0 REVESTIMIENTOS (Filas 34..37)
    { r: 34, isSection: true, code: '7.0', name: 'REVESTIMIENTOS', sumRange: 'F35:F37', note: 'Áreas húmedas de Baño Suite, Toilette y Cocina' },
    { r: 35, code: '7.1', name: 'Revestimiento porcelanato/cerámico en duchero h=2,10m y baño h=1,20m', un: 'm2', cant: 22.50, pu: 145000, note: 'Pegamento impermeable Klaukol Flex y pastina antihongos' },
    { r: 36, code: '7.2', name: 'Cerámica 33x60 sobre mesada de cocina h=0,60m (incluye tapacanto metálico)', un: 'm2', cant: 4.50, pu: 140000, note: 'Salpicadero lavable en zona de cocción y bacha doble' },
    { r: 37, code: '7.3', name: 'Revestimiento impermeable en Lavadero de Subsuelo', un: 'm2', cant: 6.00, pu: 125000, note: 'Sector de pileta de lavar y lavarropas automático' },

    // 8.0 TECHOS Y CUBIERTAS (Filas 38..42)
    { r: 38, isSection: true, code: '8.0', name: 'TECHOS Y CUBIERTAS', sumRange: 'F39:F42', note: 'Cubierta en cota +105.64m con desagüe pluvial completo' },
    { r: 39, code: '8.1', name: 'Techo de chapa sándwich termoacústica (Isopanel PIR/Poliestireno 40-50mm)', un: 'm2', cant: 86.00, pu: 379500, note: 'Alternativa Teja Tobatí s/ Tejuelón visto por mismo rango de costo' },
    { r: 40, code: '8.2', name: 'Estructura portante metálica (Perfiles C 100x50x15) y vigas de coronamiento', un: 'gl', cant: 1.00, pu: 18500000, note: 'Anclada sobre los 14 pilares que llegan a cota +105.64m' },
    { r: 41, code: '8.3', name: 'Babetas perimetrales de chapa galvanizada N° 26 y sellado poliuretánico', un: 'ml', cant: 23.11, pu: 95000, note: 'Encuentros estancos contra muros de sobreelevación' },
    { r: 42, code: '8.4', name: 'Canaletas ocultas de chapa galvanizada y 4 bajadas pluviales PVC Ø100mm', un: 'gl', cant: 1.00, pu: 5604550, note: 'Corrige Rubro 30.2 que estaba en 0 Gs evitando socavación del barranco' },

    // 9.0 CARPINTERÍAS (MADERA, BLINDEX Y HERRERÍA) (Filas 43..49)
    { r: 43, isSection: true, code: '9.0', name: 'CARPINTERÍAS (MADERA, BLINDEX Y HERRERÍA)', sumRange: 'F44:F49', note: 'Aberturas exteriores, interiores, barandas y mobiliario fijo' },
    { r: 44, code: '9.1', name: 'P1 — Puerta Principal Pivotante + Puerta de Servicio independiente (Eje G)', un: 'un', cant: 2.00, pu: 4750000, note: 'Acceso social y acceso de servicio directo a Escalera 1' },
    { r: 45, code: '9.2', name: 'P2/P3 — Puertas placa interiores de madera (0,80x2,10 y 0,70x2,10) c/ marco y herrajes', un: 'un', cant: 6.00, pu: 2500000, note: 'Suite, Estudio, Baño Suite, Toilette y Lavadero (c/ gatera Serafina)' },
    { r: 46, code: '9.3', name: 'Ventanales corredizos de vidrio templado Blindex 10mm en Galería Eje B al Río', un: 'm2', cant: 24.00, pu: 750000, note: 'Visual panorámica limpia al Río Paraguay desde Sala-Comedor' },
    { r: 47, code: '9.4', name: 'Ventanas Blindex 10mm en Dormitorio Suite 2do Piso, Estudio y Subsuelo', un: 'm2', cant: 18.50, pu: 690000, note: 'Con premarcos y cierre hermético' },
    { r: 48, code: '9.5', name: 'Herrería de seguridad: Barandas Galería Eje A (caída 3,20m), Escalera 1, Rejas y Motor Portón', un: 'gl', cant: 1.00, pu: 16050000, note: 'Barandas 16ml (Gs. 11,2M) + Puerta-reja Subsuelo (Gs. 2,2M) + Motor Portón (Gs. 2,65M)' },
    { r: 49, code: '9.6', name: 'Carpintería fija: 2 Placares Dormitorios + Biblioteca 4 estantes 2m + Bajo-mesada/Alacenas', un: 'gl', cant: 1.00, pu: 30343750, note: '2 Placares (Gs. 9,6M) + Biblioteca 8ml (Gs. 3,2M) + Muebles Cocina (Gs. 17,54M)' },

    // 10.0 INSTALACIÓN SANITARIA Y CLOACAL (CON POZO CIEGO Y CÁMARA SÉPTICA) (Filas 50..54)
    { r: 50, isSection: true, code: '10.0', name: 'INSTALACIÓN SANITARIA Y CLOACAL (CON POZO CIEGO Y CÁMARA SÉPTICA)', sumRange: 'F51:F54', note: 'Agua fría/caliente PPR termofusión + Cisterna + Pozo Ciego' },
    { r: 51, code: '10.1', name: 'Red Agua Fría y Caliente PPR Termofusión PN20 + Desagües PVC + Cisterna 1000L y Presurizadora', un: 'gl', cant: 1.00, pu: 14800000, note: 'Incluye Pases Diamantados #3 (Ø115mm) y #4 (Ø63mm) en Losa 1' },
    { r: 52, code: '10.2', name: 'Artefactos sanitarios Baño Suite + Toilette + Griferías FV + Termocalefón 80L', un: 'gl', cant: 1.00, pu: 9800000, note: 'Corrige Rubros 27.3 y 28.1 que figuraban en 0 Gs' },
    { r: 53, code: '10.3', name: 'Mesada de granito c/ Bacha doble cocina + Casilla exterior GLP + Pileta Lavadero Subsuelo', un: 'gl', cant: 1.00, pu: 7687500, note: 'Mesada cocina (Gs. 4,85M) + Lavadero completo (Gs. 2,8375M)' },
    { r: 54, code: '10.4', name: 'Cámara Desgrasadora + Cámara Séptica 1.500L + Pozo Ciego Absorbente (Ø1,80×3,50m en Ejes 8-9)', un: 'gl', cant: 1.00, pu: 6800000, note: 'Solución por gravedad en fondo con toma p/ camión cisterna vía Escalera 1' },

    // 11.0 INSTALACIÓN ELÉCTRICA TRIFÁSICA + DOMÓTICA (Filas 55..58)
    { r: 55, isSection: true, code: '11.0', name: 'INSTALACIÓN ELÉCTRICA TRIFÁSICA + DOMÓTICA', sumRange: 'F56:F58', note: 'Acometida ANDE 3x40A + DPS 40kA + Señales Débiles + Domótica' },
    { r: 56, code: '11.1', name: 'Instalación eléctrica Trifásica ANDE 3x40A + Tableros TP-PB/TS-PA/TS-SUB + DPS + Circuitos 20A', un: 'gl', cant: 1.00, pu: 16500000, note: 'Incluye Pase Diamantado #1 (Ø50mm) en Losa 1 y jabalinas Copperweld' },
    { r: 57, code: '11.2', name: 'Señales Débiles: 8 Bocas Red UTP Cat6 + Portero Visor IP + Alarma Pet-Immune (Cortina Blindex)', un: 'gl', cant: 1.00, pu: 9380000, note: 'Red Cat6 (Gs. 1,48M) + Portero IP (Gs. 2,45M) + Alarma Pet-Immune (Gs. 5,45M)' },
    { r: 58, code: '11.3', name: 'Kit Domótica Riel DIN Inteligente (Medidor Trifásico + 3 Protectores ANDE + 14 Llaves Zigbee c/ Neutro)', un: 'gl', cant: 1.00, pu: 3885000, note: 'Compra directa en China (Kit 2 Prevención Activa Total c/ corte de agua/gas)' },

    // 12.0 PINTURAS (Filas 59..61)
    { r: 59, isSection: true, code: '12.0', name: 'PINTURAS', sumRange: 'F60:F61', note: 'Sellador fijador + 2 manos de látex acrílico primera marca' },
    { r: 60, code: '12.1', name: 'Pintura al látex interior (2 manos) + enduido parcial y sellador fijador', un: 'm2', cant: 227.16, pu: 58000, note: 'Ambientes interiores de Planta Nivel Calle y 2do Piso' },
    { r: 61, code: '12.2', name: 'Pintura exterior elastomérica impermeabilizante en frentes y contrafrente', un: 'm2', cant: 92.84, pu: 65748, note: 'Protección UV e hidrófuga en fachada Eje G y Eje A al Río' },

    // 13.0 GASTOS GENERALES (Filas 62..63)
    { r: 62, isSection: true, code: '13.0', name: 'GASTOS GENERALES Y DIRECCIÓN TÉCNICA', sumRange: 'F63:F63', note: 'Supervisión técnica de arquitecto, volquetes y limpieza final' },
    { r: 63, code: '13.1', name: 'Dirección técnica semanal, carpeta bancaria, alquiler de 6 volquetes y limpieza final de obra', un: 'gl', cant: 1.00, pu: 23000000, note: 'Supervisión Técnica (Gs. 18.500.000) + Volquetes y Limpieza (Gs. 4.500.000)' }
  ];

  // Calcular subtotales en memoria para inyectar valores cacheados exactos en las fórmulas XML
  const rowSubtotals = {};
  specRows.forEach((item) => {
    if (!item.isSection) {
      rowSubtotals[item.r] = Math.round(item.cant * item.pu);
    }
  });

  const sectionRowIndices = [];
  specRows.forEach((item) => {
    if (item.isSection) {
      sectionRowIndices.push(item.r);
      const [startRef, endRef] = item.sumRange.split(':');
      const startRow = parseInt(startRef.replace('F', ''), 10);
      const endRow = parseInt(endRef.replace('F', ''), 10);
      let secSum = 0;
      for (let rr = startRow; rr <= endRow; rr++) {
        secSum += rowSubtotals[rr] || 0;
      }
      rowSubtotals[item.r] = secSum;

      rows.push({
        rowIdx: item.r,
        height: 21,
        cells: [
          makeStringCell(1, item.r, item.code, STYLE.SECTION_ROW),
          makeStringCell(2, item.r, item.name, STYLE.SECTION_ROW),
          makeStringCell(3, item.r, '', STYLE.SECTION_ROW),
          makeStringCell(4, item.r, '', STYLE.SECTION_ROW),
          makeStringCell(5, item.r, '', STYLE.SECTION_ROW),
          makeFormulaCell(
            6,
            item.r,
            `SUM(${item.sumRange})`,
            secSum,
            STYLE.TOTAL_GS
          ),
          makeStringCell(7, item.r, item.note || '', STYLE.SECTION_ROW)
        ]
      });
    } else {
      const sub = rowSubtotals[item.r];
      const gsStyle =
        item.highlight === 'green' ? STYLE.HIGHLIGHT_GREEN_GS : STYLE.GS_INT;
      rows.push({
        rowIdx: item.r,
        height: 19,
        cells: [
          makeStringCell(1, item.r, item.code, STYLE.TEXT_CENTER),
          makeStringCell(2, item.r, item.name, STYLE.TEXT),
          makeStringCell(3, item.r, item.un, STYLE.TEXT_CENTER),
          makeNumberCell(4, item.r, item.cant, STYLE.DEC_QTY),
          makeNumberCell(5, item.r, item.pu, gsStyle),
          makeFormulaCell(
            6,
            item.r,
            `ROUND(D${item.r}*E${item.r},0)`,
            sub,
            gsStyle
          ),
          makeStringCell(7, item.r, item.note || '', STYLE.TEXT)
        ]
      });
    }
  });

  // Fila 64: SUBTOTAL (usando exactamente el patrón de la planilla LG-RB `=SUM(F3:F63)/2` o suma de cabeceras de rubro)
  const subtotalNeto = sectionRowIndices.reduce(
    (acc, rIdx) => acc + (rowSubtotals[rIdx] || 0),
    0
  );
  const iva10 = Math.round(subtotalNeto * 0.1);
  const totalGeneral = subtotalNeto + iva10;

  rows.push({
    rowIdx: 64,
    height: 22,
    cells: [
      makeStringCell(1, 64, '', STYLE.TOTAL_LABEL),
      makeStringCell(
        2,
        64,
        'SUBTOTAL COSTO DE OBRA COMPLETA (SUMA DE RUBROS 1.0 A 13.0 SIN OMISIONES)',
        STYLE.TOTAL_LABEL
      ),
      makeStringCell(3, 64, 'Gs.', STYLE.TOTAL_LABEL),
      makeStringCell(4, 64, '', STYLE.TOTAL_LABEL),
      makeStringCell(5, 64, 'SUBTOTAL:', STYLE.TOTAL_LABEL),
      makeFormulaCell(
        6,
        64,
        'SUM(F3:F63)/2',
        subtotalNeto,
        STYLE.TOTAL_GS
      ),
      makeStringCell(
        7,
        64,
        'Fórmula original LG-RB =SUM(F3:F63)/2 verificada al 100%',
        STYLE.TOTAL_LABEL
      )
    ]
  });

  // Fila 65: IVA (10% / Régimen Simplificado Construcción)
  rows.push({
    rowIdx: 65,
    height: 22,
    cells: [
      makeStringCell(1, 65, '', STYLE.TOTAL_LABEL),
      makeStringCell(
        2,
        65,
        'IVA REFERENCIAL (10% s/ Planilla Original LG-RB — En Gestión Supervisada ya incluido en Materiales)',
        STYLE.TOTAL_LABEL
      ),
      makeStringCell(3, 65, 'Gs.', STYLE.TOTAL_LABEL),
      makeStringCell(4, 65, '', STYLE.TOTAL_LABEL),
      makeStringCell(5, 65, 'IVA (10%):', STYLE.TOTAL_LABEL),
      makeFormulaCell(6, 65, 'ROUND(F64*0.1,0)', iva10, STYLE.TOTAL_GS),
      makeStringCell(
        7,
        65,
        'En compra directa de materiales el IVA ya viene incluido en factura',
        STYLE.TOTAL_LABEL
      )
    ]
  });

  // Fila 66: TOTAL GENERAL
  rows.push({
    rowIdx: 66,
    height: 25,
    cells: [
      makeStringCell(1, 66, 'TOTAL', STYLE.TOTAL_LABEL),
      makeStringCell(
        2,
        66,
        'TOTAL GENERAL PLANILLA LG-RB + LOZARRAP AUDITADA (CON FILA 1.4 LOZARRAP Gs. 14.440.000 INCLUIDA)',
        STYLE.TOTAL_LABEL
      ),
      makeStringCell(3, 66, 'Gs.', STYLE.TOTAL_LABEL),
      makeStringCell(4, 66, '', STYLE.TOTAL_LABEL),
      makeStringCell(5, 66, 'TOTAL GENERAL:', STYLE.TOTAL_LABEL),
      makeFormulaCell(
        6,
        66,
        'SUM(F64:F65)',
        totalGeneral,
        STYLE.HIGHLIGHT_GREEN_GS
      ),
      makeStringCell(
        7,
        66,
        '66 filas completas y auditadas',
        STYLE.TOTAL_LABEL
      )
    ]
  });

  return buildWorksheetXml({
    rows,
    colWidths: [10, 62, 10, 13, 18, 22, 48],
    merges: ['A1:G1']
  });
}

// ============================================================================
// HOJA 3: 3_CONTROL_Y_ARQUITECTO
// Control del Propietario y Negociación con Arquitecto — Gestión Supervisada vs. Llave en Mano
// ============================================================================

function buildSheet3ControlYArquitecto() {
  const rows = [];
  let r = 1;

  // Fila 1: Banner
  rows.push({
    rowIdx: r,
    height: 28,
    cells: [
      makeStringCell(
        1,
        r,
        CONTROL_PROPIETARIO_Y_NEGOCIACION_ARQUITECTO?.titulo ||
          'CONTROL DEL PROPIETARIO Y NEGOCIACIÓN CON ARQUITECTO — GESTIÓN SUPERVISADA VS. LLAVE EN MANO',
        STYLE.TITLE_BANNER
      ),
      ...Array.from({ length: 6 }, (_, i) =>
        makeStringCell(i + 2, r, '', STYLE.TITLE_BANNER)
      )
    ]
  });
  r++;

  // Fila 2: Subtítulo explicativo
  rows.push({
    rowIdx: r,
    height: 22,
    cells: [
      makeStringCell(
        1,
        r,
        'Comparativa Financiera Directa: Compra Directa de Materiales por Leo + Pago Semanal por Avance Medido vs. Administración Delegada vs. Constructora Llave en Mano',
        STYLE.SUBTITLE_BANNER
      ),
      ...Array.from({ length: 6 }, (_, i) =>
        makeStringCell(i + 2, r, '', STYLE.SUBTITLE_BANNER)
      )
    ]
  });
  r++;

  // Tabla 1: Comparativa de los 3 Modelos de Contratación
  rows.push({
    rowIdx: r,
    height: 26,
    cells: [
      makeStringCell(1, r, 'Código', STYLE.TABLE_HEADER),
      makeStringCell(2, r, 'Componente de Costo / Rubro de Gestión (Etapa Habitable 3 Niveles)', STYLE.TABLE_HEADER),
      makeStringCell(3, r, '% Incidencia Base', STYLE.TABLE_HEADER),
      makeStringCell(4, r, 'Modelo 1 (Recomendado): Gestión Supervisada c/ Control de Leo (Gs.)', STYLE.TABLE_HEADER),
      makeStringCell(5, r, 'Modelo 2: Administración Delegada «Open-Book» 12% (Gs.)', STYLE.TABLE_HEADER),
      makeStringCell(6, r, 'Modelo 3: Constructora «Llave en Mano» Cerrado (Gs.)', STYLE.TABLE_HEADER),
      makeStringCell(7, r, 'Ahorro Neto de Leo (Modelo 1 vs. Llave en Mano)', STYLE.TABLE_HEADER)
    ]
  });
  r++;

  // Filas 4 a 7: Los 4 componentes principales con los montos de referencia exactos:
  // Costo Directo Materiales (Gs. 141,2M), Costo Directo Mano de Obra (Gs. 86,5M),
  // Supervisión Técnica (Gs. 18,5M), Reserva Imprevistos bajo llave de Leo (Gs. 6,9M)
  const firstCompRow = r;
  const compData = [
    {
      code: 'MOD-01',
      label: 'Costo Directo de Materiales (62% — Compra directa de Leo en Tobatí, Construshop, Corporación Mercantil y China)',
      pct: 0.62,
      m1: 141200000,
      m2: 145500000,
      m3: 162380000
    },
    {
      code: 'MOD-02',
      label: 'Costo Directo de Mano de Obra (38% — Cuadrillas pagadas por avance medido cada viernes con 5% fondo de reparo)',
      pct: 0.38,
      m1: 86500000,
      m2: 90825000,
      m3: 99475000
    },
    {
      code: 'MOD-03',
      label: 'Honorarios de Supervisión / Dirección Técnica de Arquitecto (Visitas semanales + Firma Carpeta Bancaria)',
      pct: 0.06,
      m1: 18500000,
      m2: 27324000,
      m3: 32500000
    },
    {
      code: 'MOD-04',
      label: 'Reserva para Imprevistos bajo llave exclusiva de Leo (3% en cuenta separada vs. recargo cerrado en Llave en Mano)',
      pct: 0.03,
      m1: 6900000,
      m2: 11385000,
      m3: 11645000
    }
  ];

  compData.forEach((c) => {
    const diff = c.m3 - c.m1;
    rows.push({
      rowIdx: r,
      height: 21,
      cells: [
        makeStringCell(1, r, c.code, STYLE.TEXT_CENTER),
        makeStringCell(2, r, c.label, STYLE.TEXT),
        makeNumberCell(3, r, c.pct, STYLE.PERCENT),
        makeNumberCell(4, r, c.m1, STYLE.HIGHLIGHT_GREEN_GS),
        makeNumberCell(5, r, c.m2, STYLE.GS_INT),
        makeNumberCell(6, r, c.m3, STYLE.GS_INT),
        makeFormulaCell(7, r, `F${r}-D${r}`, diff, STYLE.HIGHLIGHT_GREEN_GS)
      ]
    });
    r++;
  });
  const lastCompRow = r - 1;

  // Fila Total por Etapa y Ahorro Neto (+Gs. 52,9M de ahorro)
  const totalM1 = 253100000;
  const totalM2 = 275034000;
  const totalM3 = 306000000;
  const ahorroNeto = totalM3 - totalM1; // 52.900.000 (+Gs. 52,9M)
  const rowTotalMod = r++;

  rows.push({
    rowIdx: rowTotalMod,
    height: 24,
    cells: [
      makeStringCell(1, rowTotalMod, 'TOTAL', STYLE.TOTAL_LABEL),
      makeStringCell(
        2,
        rowTotalMod,
        'TOTAL POR ETAPA CONSTRUCTIVA BASE Y AHORRO NETO FRENTE A LLAVE EN MANO (+Gs. 52,9M DE AHORRO)',
        STYLE.TOTAL_LABEL
      ),
      makeFormulaCell(
        3,
        rowTotalMod,
        `SUM(C${firstCompRow}:C${firstCompRow + 1})`,
        1.0,
        STYLE.PERCENT
      ),
      makeFormulaCell(
        4,
        rowTotalMod,
        `SUM(D${firstCompRow}:D${lastCompRow})`,
        totalM1,
        STYLE.HIGHLIGHT_GREEN_GS
      ),
      makeFormulaCell(
        5,
        rowTotalMod,
        `SUM(E${firstCompRow}:E${lastCompRow})`,
        totalM2,
        STYLE.TOTAL_GS
      ),
      makeFormulaCell(
        6,
        rowTotalMod,
        `SUM(F${firstCompRow}:F${lastCompRow})`,
        totalM3,
        STYLE.TOTAL_GS
      ),
      makeFormulaCell(
        7,
        rowTotalMod,
        `F${rowTotalMod}-D${rowTotalMod}`,
        ahorroNeto,
        STYLE.HIGHLIGHT_GREEN_GS
      )
    ]
  });

  // Fila Comparativa contra Presupuesto Edifica Studio Opción A (573,9M con estructura duplicada)
  const rowEdificaComp = r++;
  rows.push({
    rowIdx: rowEdificaComp,
    height: 22,
    cells: [
      makeStringCell(1, rowEdificaComp, 'AUDIT-EDIF', STYLE.TOTAL_LABEL),
      makeStringCell(
        2,
        rowEdificaComp,
        'Comparativa vs. Presupuesto Referencial Edifica Studio (que duplicaba Gs. 80,75M de H°A° ya construido por JIVESA)',
        STYLE.TOTAL_LABEL
      ),
      makeNumberCell(3, rowEdificaComp, 0.28, STYLE.PERCENT),
      makeFormulaCell(4, rowEdificaComp, `D${rowTotalMod}`, totalM1, STYLE.TOTAL_GS),
      makeNumberCell(5, rowEdificaComp, 460160000, STYLE.TOTAL_GS),
      makeNumberCell(6, rowEdificaComp, 573893750, STYLE.HIGHLIGHT_RED_GS),
      makeFormulaCell(
        7,
        rowEdificaComp,
        `E${rowEdificaComp}-D${rowEdificaComp}`,
        460160000 - totalM1,
        STYLE.HIGHLIGHT_GREEN_GS
      )
    ]
  });

  // Espacio separador
  r++;

  // Sección 2: Las 6 Reglas de Oro de Negociación con el Arquitecto
  rows.push({
    rowIdx: r,
    height: 24,
    cells: [
      makeStringCell(
        1,
        r,
        'LAS 6 REGLAS DE ORO DE NEGOCIACIÓN Y BLINDAJE CONTRACTUAL CON EL ARQUITECTO',
        STYLE.SECTION_ROW
      ),
      ...Array.from({ length: 6 }, (_, i) =>
        makeStringCell(i + 2, r, '', STYLE.SECTION_ROW)
      )
    ]
  });
  const mergeReglasTitle = `A${r}:G${r}`;
  r++;

  rows.push({
    rowIdx: r,
    height: 22,
    cells: [
      makeStringCell(1, r, 'Regla #', STYLE.TABLE_HEADER),
      makeStringCell(2, r, 'Título de la Regla de Oro Contractual', STYLE.TABLE_HEADER),
      makeStringCell(3, r, 'Impacto', STYLE.TABLE_HEADER),
      makeStringCell(4, r, 'Cláusula Operativa Obligatoria en el Contrato de Dirección de Obra', STYLE.TABLE_HEADER),
      makeStringCell(5, r, 'Responsable Pago', STYLE.TABLE_HEADER),
      makeStringCell(6, r, 'Mecanismo de Control', STYLE.TABLE_HEADER),
      makeStringCell(7, r, 'Ahorro / Blindaje (Gs.)', STYLE.TABLE_HEADER)
    ]
  });
  r++;

  const reglasDeOro = [
    {
      nro: 'Regla #1',
      titulo: 'Descuento de los Gs. 163,8M ya construidos (Prohibición de Doble Cobro)',
      impacto: 'CRÍTICO',
      texto: 'El contrato deja constancia de que las 14 zapatas (-4,64m), los 20 pilares P1–P20 hasta Losa 1, los pórticos de Subsuelo, la Escalera 1 y los 124,42 m² de Losa 1 ya están ejecutados y aprobados (PROBETI #17671). Ningún presupuesto puede volver a cotizarlos.',
      resp: 'Ya Abonado (Fase 1)',
      control: 'Acta Recepción 29/12/2025',
      ahorroGs: 80750000
    },
    {
      nro: 'Regla #2',
      titulo: 'Facturación Directa de Materiales a Nombre de Leo (Cero Comisiones Ocultas)',
      impacto: 'ALTO AHORRO',
      texto: 'Todo material superior a Gs. 1.500.000 (ladrillos Tobatí, cemento, hierro, porcelanato, sanitarios, Blindex) se cotiza en 3 proveedores y lo abona directamente Leo por transferencia bancaria contra entrega en Calle Tte. Guillermo Arias.',
      resp: 'Transferencia Directa Leo',
      control: 'Factura Legal a RUC de Leo',
      ahorroGs: 21180000
    },
    {
      nro: 'Regla #3',
      titulo: 'Pagos Semanales a Cuadrillas Solo por Ítem Medido y Aprobado',
      impacto: 'FLUJO CAJA',
      texto: 'No se entregan adelantos globales mayores al 15%. Cada viernes el arquitecto mide el avance físico real (m² de pared aplomada, m² de revoque o m² de piso) y se retiene un 5% de Fondo de Reparo hasta la recepción final libre de vicios.',
      resp: 'Leo c/ Acta del Arquitecto',
      control: 'Planilla Semanal + Fotos',
      ahorroGs: 12975000
    },
    {
      nro: 'Regla #4',
      titulo: 'Pases de Losa con Sacabocado Diamantado (Prohibido Picar Vigas o Viguetas)',
      impacto: 'ESTRUCTURAL',
      texto: 'Como la Losa 1 existente no tiene pases previstos, las 4 perforaciones verticales (eléctrica Ø50mm, datos Ø50mm, cloaca Ø115mm y agua PPR Ø63mm) se harán únicamente con máquina sacabocado de copa diamantada fuera de las vigas principales.',
      resp: 'Especialista c/ Supervisión',
      control: 'Replanteo previo en Losa 1',
      ahorroGs: 8500000
    },
    {
      nro: 'Regla #5',
      titulo: 'Honorario Fijo de Supervisión Técnica (6% — Sin Incentivo a Encarecer Materiales)',
      impacto: 'ALINEACIÓN',
      texto: 'El honorario del arquitecto se fija en un monto cerrado por hito (Gs. 18.500.000 / ~6%) y NO como porcentaje abierto del gasto de materiales, eliminando cualquier conflicto de interés al elegir marcas o proveedores.',
      resp: 'Leo en 5 Hitos (20% c/u)',
      control: 'Certificado Quincenal',
      ahorroGs: 14000000
    },
    {
      nro: 'Regla #6',
      titulo: 'Reserva de Imprevistos (3% = Gs. 6,9M) Bajo Llave Exclusiva del Propietario',
      impacto: 'RESERVA',
      texto: 'El fondo de contingencia e imprevistos permanece en la cuenta de Ruth y Leo y solo se ejecuta ante adicionales reales previamente documentados y autorizados por escrito por el propietario.',
      resp: 'Custodia Directa Ruth & Leo',
      control: 'Orden de Cambio Escrita',
      ahorroGs: 4745000
    }
  ];

  const firstReglaRow = r;
  reglasDeOro.forEach((reg) => {
    rows.push({
      rowIdx: r,
      height: 24,
      cells: [
        makeStringCell(1, r, reg.nro, STYLE.TEXT_CENTER),
        makeStringCell(2, r, reg.titulo, STYLE.TEXT),
        makeStringCell(3, r, reg.impacto, STYLE.BANCO_VERDE),
        makeStringCell(4, r, reg.texto, STYLE.TEXT),
        makeStringCell(5, r, reg.resp, STYLE.TEXT_CENTER),
        makeStringCell(6, r, reg.control, STYLE.TEXT_CENTER),
        makeNumberCell(7, r, reg.ahorroGs, STYLE.GS_INT)
      ]
    });
    r++;
  });

  // Espacio separador
  r++;

  // Sección 3: Cronograma de 5 Hitos de Certificación Quincenal (20% c/u)
  rows.push({
    rowIdx: r,
    height: 24,
    cells: [
      makeStringCell(
        1,
        r,
        'CRONOGRAMA DE 5 HITOS DE CERTIFICACIÓN QUINCENAL Y DESEMBOLSO DE HONORARIOS (20% C/U = 100%)',
        STYLE.SECTION_ROW
      ),
      ...Array.from({ length: 6 }, (_, i) =>
        makeStringCell(i + 2, r, '', STYLE.SECTION_ROW)
      )
    ]
  });
  const mergeHitosTitle = `A${r}:G${r}`;
  r++;

  rows.push({
    rowIdx: r,
    height: 22,
    cells: [
      makeStringCell(1, r, 'Hito #', STYLE.TABLE_HEADER),
      makeStringCell(2, r, 'Semanas / Plazo y Entregables Físicos Verificables en Obra', STYLE.TABLE_HEADER),
      makeStringCell(3, r, '% del Honorario', STYLE.TABLE_HEADER),
      makeStringCell(4, r, 'Honorario Supervisión a Liberar (Gs. Fórmula)', STYLE.TABLE_HEADER),
      makeStringCell(5, r, 'Desembolso Obra Directa Estimado (Gs.)', STYLE.TABLE_HEADER),
      makeStringCell(6, r, 'Total Flujo del Hito (Gs. Fórmula)', STYLE.TABLE_HEADER),
      makeStringCell(7, r, 'Condición Técnica Obligatoria para Liberar Pago', STYLE.TABLE_HEADER)
    ]
  });
  r++;

  const hitosData = [
    {
      hito: 'Hito 1 (20%)',
      desc: 'Semanas 1 a 3: Firma de Carpeta Bancaria (Colores Negro/Verde/Rojo/Amarillo) + Rehabilitación Losa 1 + Muro Contención y Drenaje',
      pct: 0.20,
      obraGs: 46800000,
      cond: 'Planos aprobados para BNF (Banco Nacional de Fomento) + Sikadur-32 en 17 pilares + Barbacanas y drenaje francés verificados'
    },
    {
      hito: 'Hito 2 (20%)',
      desc: 'Semanas 4 a 6: Hormigonado de 17 Pilares de Planta Alta + Losa de 2do Piso (+102.88m) + Escalera al 2do Piso sin cabezada',
      pct: 0.20,
      obraGs: 54200000,
      cond: 'Probetas de hormigón HA-25 verificadas + Losa 2do Piso nivelada + 2,88m libres sobre Escalera 1'
    },
    {
      hito: 'Hito 3 (20%)',
      desc: 'Semanas 7 a 10: Montaje de Techo Termoacústico (+105.64m) y Canaletas + 100% Mampostería Tobatí + 4 Pases Diamantados en Losa 1',
      pct: 0.20,
      obraGs: 58500000,
      cond: 'Cubierta estanca sin goteras + Muros aplomados c/ neutro en cajas + Pases #1 a #4 con copa diamantada'
    },
    {
      hito: 'Hito 4 (20%)',
      desc: 'Semanas 11 a 13: Cañerías PPR Agua Fría/Caliente y Eléctrica Trifásica + Revoques Hidrófugos + Contrapisos, Carpetas y Porcelanato 60x60',
      pct: 0.20,
      obraGs: 44600000,
      cond: 'Prueba hidráulica PPR a 6 bar por 24h aprobada + Porcelanato Satinado R9-R10 nivelado sin piezas huecas'
    },
    {
      hito: 'Hito 5 (20%)',
      desc: 'Semanas 14 a 16: Baño Suite y Cocina Equipados + Blindex/Puertas/Barandas + Tableros DIN/Alarma Pet-Immune + Limpieza Final Mudanza',
      pct: 0.20,
      obraGs: 23600000,
      cond: 'Acta de Recepción Definitiva firmada + Pruebas de disyuntores, presión directa ESSAP y alarma modo noche'
    }
  ];

  const firstHitoRow = r;
  const honorarioTotalRef = 18500000;
  hitosData.forEach((h) => {
    const honHito = Math.round(honorarioTotalRef * h.pct);
    const totHito = honHito + h.obraGs;
    rows.push({
      rowIdx: r,
      height: 22,
      cells: [
        makeStringCell(1, r, h.hito, STYLE.TEXT_CENTER),
        makeStringCell(2, r, h.desc, STYLE.TEXT),
        makeNumberCell(3, r, h.pct, STYLE.PERCENT),
        makeFormulaCell(
          4,
          r,
          `ROUND(D${firstCompRow + 2}*C${r},0)`,
          honHito,
          STYLE.GS_INT
        ),
        makeNumberCell(5, r, h.obraGs, STYLE.GS_INT),
        makeFormulaCell(6, r, `D${r}+E${r}`, totHito, STYLE.HIGHLIGHT_GREEN_GS),
        makeStringCell(7, r, h.cond, STYLE.TEXT)
      ]
    });
    r++;
  });
  const lastHitoRow = r - 1;

  // Fila Total Hitos
  rows.push({
    rowIdx: r,
    height: 24,
    cells: [
      makeStringCell(1, r, 'TOTAL HITOS', STYLE.TOTAL_LABEL),
      makeStringCell(
        2,
        r,
        'TOTAL CERTIFICADO EN LOS 5 HITOS QUINCENALES (16 SEMANAS DE OBRA BAJO CONTROL DE RUTH Y LEO)',
        STYLE.TOTAL_LABEL
      ),
      makeFormulaCell(
        3,
        r,
        `SUM(C${firstHitoRow}:C${lastHitoRow})`,
        1.0,
        STYLE.PERCENT
      ),
      makeFormulaCell(
        4,
        r,
        `SUM(D${firstHitoRow}:D${lastHitoRow})`,
        honorarioTotalRef,
        STYLE.TOTAL_GS
      ),
      makeFormulaCell(
        5,
        r,
        `SUM(E${firstHitoRow}:E${lastHitoRow})`,
        227700000,
        STYLE.TOTAL_GS
      ),
      makeFormulaCell(
        6,
        r,
        `SUM(F${firstHitoRow}:F${lastHitoRow})`,
        246200000,
        STYLE.HIGHLIGHT_GREEN_GS
      ),
      makeStringCell(
        7,
        r,
        'Más Reserva Imprevistos Gs. 6.900.000 en poder de Leo = Gs. 253.100.000',
        STYLE.TOTAL_LABEL
      )
    ]
  });

  return buildWorksheetXml({
    rows,
    colWidths: [14, 54, 15, 24, 24, 24, 44],
    merges: ['A1:G1', 'A2:G2', mergeReglasTitle, mergeHitosTitle]
  });
}

// ============================================================================
// HOJA 4: 4_CREDITO_BNF
// Simulador Financiero BNF (Banco Nacional de Fomento) 9,9% vs. 6,5% a 15 Años / 180 Cuotas
// ============================================================================

function buildSheet4CreditoCajaMutual({ loanAmount, loanYears, activeRateKey }) {
  const rows = [];
  let r = 1;

  rows.push({
    rowIdx: r,
    height: 28,
    cells: [
      makeStringCell(
        1,
        r,
        CREDITO_CAJA_MUTUAL?.titulo ||
          'SIMULADOR FINANCIERO: CRÉDITO VIVIENDA BNF (BANCO NACIONAL DE FOMENTO 9,9% ANUAL VS. LÍNEA PREFERENCIAL 6,5% — 15 AÑOS / 180 CUOTAS)',
        STYLE.TITLE_BANNER
      ),
      ...Array.from({ length: 10 }, (_, i) =>
        makeStringCell(i + 2, r, '', STYLE.TITLE_BANNER)
      )
    ]
  });
  r++;

  rows.push({
    rowIdx: r,
    height: 22,
    cells: [
      makeStringCell(
        1,
        r,
        `Entidad Financiera: BNF (Banco Nacional de Fomento) | Plazo ${loanYears || 15} Años (180 cuotas) | Garantía Hipotecaria / Terreno | Simulación Activa: Gs. ${Number(loanAmount || 350000000).toLocaleString('es-PY')} (${activeRateKey === 'tasa65' ? '6,5%' : '9,9%'})`,
        STYLE.SUBTITLE_BANNER
      ),
      ...Array.from({ length: 10 }, (_, i) =>
        makeStringCell(i + 2, r, '', STYLE.SUBTITLE_BANNER)
      )
    ]
  });
  r++;

  // Fila 3: Parámetros unitarios por cada Gs. 1.000.000 (para que las fórmulas de Excel referencien factores exactos)
  rows.push({
    rowIdx: r,
    height: 20,
    cells: [
      makeStringCell(
        1,
        r,
        'Factores Normativos por cada Gs. 1.000.000 a 15 Años (180 Meses): Cuota Pura 9,9% = Gs. 11.097/M | Seguro BNF = Gs. 668,91/M | Cuota Total 9,9% c/ Seguro = Gs. 11.765,91/M | Cuota Pura 6,5% = Gs. 8.982/M',
        STYLE.SECTION_ROW
      ),
      ...Array.from({ length: 10 }, (_, i) =>
        makeStringCell(i + 2, r, '', STYLE.SECTION_ROW)
      )
    ]
  });
  r++;

  // Fila 4: Encabezados de la Tabla Comparativa para 250M, 300M, 350M y 440M
  const headers = [
    'Tramo de Crédito BNF',
    'Capital Solicitado (Gs.)',
    'Cuota Pura 9,9% Anual (Gs. Fórmula)',
    'Seguro Vida / Incendio BNF (Gs. Fórmula)',
    'Cuota Total Mensual 9,9% c/ Seguros (Gs. Fórmula)',
    'Total Pagado en 180 Cuotas a 9,9% (Gs. Fórmula)',
    'Costo Financiero + Seguros 9,9% (Gs. Fórmula)',
    'Cuota Pura a 6,5% Anual (Gs. Fórmula)',
    'Cuota Total Mensual a 6,5% c/ Seguros (Gs. Fórmula)',
    'Ahorro Mensual 6,5% vs. 9,9% (Gs. Fórmula)',
    'Alcance de Obra Garantizado en los 3 Niveles (Ruth y Leo)'
  ];

  rows.push({
    rowIdx: r,
    height: 30,
    cells: headers.map((h, i) => makeStringCell(i + 1, r, h, STYLE.TABLE_HEADER))
  });
  r++;

  const tramos = CREDITO_CAJA_MUTUAL?.tramos || [
    {
      label: '250 millones',
      creditoGs: 250000000,
      cuotaMensualConSegurosGs: 2941477,
      cuotaPuraSinSeguro99Gs: 2774250,
      cuotaPuraSinSeguro65Gs: 2245500,
      alcanceObraResumen: 'Cierre Estructural 3 Niveles + Ladrillo Visto Tobatí + Carpeta Alisada'
    },
    {
      label: '300 millones',
      creditoGs: 300000000,
      cuotaMensualConSegurosGs: 3529773,
      cuotaPuraSinSeguro99Gs: 3329100,
      cuotaPuraSinSeguro65Gs: 2694600,
      alcanceObraResumen: '3 Niveles Operativos Día 1: Dormitorio Suite en 2do Piso + Sala/Comedor/Cocina/Biblioteca en Nivel Calle + Lavadero en Subsuelo'
    },
    {
      label: '350 millones',
      creditoGs: 350000000,
      cuotaMensualConSegurosGs: 4118068,
      cuotaPuraSinSeguro99Gs: 3883950,
      cuotaPuraSinSeguro65Gs: 3143700,
      alcanceObraResumen: 'Todo 300M + Cocina Full con Alacenas/Isla + Ventanales Blindex 24 m² al Río + Puerta Principal/Servicio + Jardín Césped 115 m²'
    },
    {
      label: '440 millones',
      creditoGs: 440000000,
      cuotaMensualConSegurosGs: 5177000,
      cuotaPuraSinSeguro99Gs: 4882680,
      cuotaPuraSinSeguro65Gs: 3952080,
      alcanceObraResumen: 'Todo 350M + Blindex Suite 2do Piso + Rejas Balcones 19.5 ml + Deck Galería L1 + Pintura Integral + Portón Automatizado + Cloaca Subsuelo'
    }
  ];

  const firstTramoRow = r;
  tramos.forEach((t) => {
    const cap = Number(t.creditoGs);
    const mill = cap / 1000000;
    const pura99 = Math.round(mill * 11097);
    const total99 = Math.round((cap * 5177000) / 440000000);
    const seguro = total99 - pura99;
    const pagado180 = total99 * 180;
    const costoFin = pagado180 - cap;
    const pura65 = Math.round(mill * 8982);
    const total65 = pura65 + seguro;
    const ahorroMes = total99 - total65;

    rows.push({
      rowIdx: r,
      height: 24,
      cells: [
        makeStringCell(1, r, `Crédito ${t.label}`, STYLE.TEXT_CENTER),
        makeNumberCell(2, r, cap, STYLE.GS_INT),
        makeFormulaCell(
          3,
          r,
          `ROUND((B${r}/1000000)*11097,0)`,
          pura99,
          STYLE.GS_INT
        ),
        makeFormulaCell(
          4,
          r,
          `ROUND((B${r}*5177000)/440000000,0)-C${r}`,
          seguro,
          STYLE.GS_INT
        ),
        makeFormulaCell(5, r, `C${r}+D${r}`, total99, STYLE.HIGHLIGHT_RED_GS),
        makeFormulaCell(6, r, `E${r}*180`, pagado180, STYLE.GS_INT),
        makeFormulaCell(7, r, `F${r}-B${r}`, costoFin, STYLE.GS_INT),
        makeFormulaCell(
          8,
          r,
          `ROUND((B${r}/1000000)*8982,0)`,
          pura65,
          STYLE.GS_INT
        ),
        makeFormulaCell(
          9,
          r,
          `H${r}+D${r}`,
          total65,
          STYLE.HIGHLIGHT_GREEN_GS
        ),
        makeFormulaCell(
          10,
          r,
          `E${r}-I${r}`,
          ahorroMes,
          STYLE.HIGHLIGHT_GREEN_GS
        ),
        makeStringCell(11, r, t.alcanceObraResumen || '', STYLE.TEXT)
      ]
    });
    r++;
  });
  const lastTramoRow = r - 1;

  // Fila Adicional: Escenario Personalizado en el Simulador Interactivo
  const customCap = Number(loanAmount) || 350000000;
  const customMill = customCap / 1000000;
  const customPura99 = Math.round(customMill * 11097);
  const customTotal99 = Math.round((customCap * 5177000) / 440000000);
  const customSeg = customTotal99 - customPura99;
  const customPagado180 = customTotal99 * 180;
  const customCostoFin = customPagado180 - customCap;
  const customPura65 = Math.round(customMill * 8982);
  const customTotal65 = customPura65 + customSeg;
  const customAhorroMes = customTotal99 - customTotal65;

  rows.push({
    rowIdx: r,
    height: 25,
    cells: [
      makeStringCell(1, r, 'SIMULADOR ACTIVO', STYLE.TOTAL_LABEL),
      makeNumberCell(2, r, customCap, STYLE.TOTAL_GS),
      makeFormulaCell(
        3,
        r,
        `ROUND((B${r}/1000000)*11097,0)`,
        customPura99,
        STYLE.TOTAL_GS
      ),
      makeFormulaCell(
        4,
        r,
        `ROUND((B${r}*5177000)/440000000,0)-C${r}`,
        customSeg,
        STYLE.TOTAL_GS
      ),
      makeFormulaCell(
        5,
        r,
        `C${r}+D${r}`,
        customTotal99,
        STYLE.HIGHLIGHT_RED_GS
      ),
      makeFormulaCell(6, r, `E${r}*180`, customPagado180, STYLE.TOTAL_GS),
      makeFormulaCell(7, r, `F${r}-B${r}`, customCostoFin, STYLE.TOTAL_GS),
      makeFormulaCell(
        8,
        r,
        `ROUND((B${r}/1000000)*8982,0)`,
        customPura65,
        STYLE.TOTAL_GS
      ),
      makeFormulaCell(
        9,
        r,
        `H${r}+D${r}`,
        customTotal65,
        STYLE.HIGHLIGHT_GREEN_GS
      ),
      makeFormulaCell(
        10,
        r,
        `E${r}-I${r}`,
        customAhorroMes,
        STYLE.HIGHLIGHT_GREEN_GS
      ),
      makeStringCell(
        11,
        r,
        'Monto seleccionado por el usuario en el Simulador Financiero 3D',
        STYLE.TOTAL_LABEL
      )
    ]
  });
  r += 2;

  // Matriz de Cuotas por cada Gs. 1.000.000 para 15, 20 y 30 años (6,5% vs 9,9%)
  rows.push({
    rowIdx: r,
    height: 24,
    cells: [
      makeStringCell(
        1,
        r,
        'TABLA OFICIAL DE CUOTAS PURAS POR CADA Gs. 1.000.000 DE CRÉDITO SEGÚN PLAZO (15, 20 Y 30 AÑOS)',
        STYLE.SECTION_ROW
      ),
      ...Array.from({ length: 10 }, (_, i) =>
        makeStringCell(i + 2, r, '', STYLE.SECTION_ROW)
      )
    ]
  });
  const mergePlazosTitle = `A${r}:K${r}`;
  r++;

  rows.push({
    rowIdx: r,
    height: 22,
    cells: [
      makeStringCell(1, r, 'Plazo en Años', STYLE.TABLE_HEADER),
      makeStringCell(2, r, 'Total Meses (Cuotas)', STYLE.TABLE_HEADER),
      makeStringCell(3, r, 'Cuota por Millón a 6,5% (Gs.)', STYLE.TABLE_HEADER),
      makeStringCell(4, r, 'Cuota por Millón a 9,9% (Gs.)', STYLE.TABLE_HEADER),
      makeStringCell(5, r, 'Cuota 300M a 6,5% (Gs. Fórmula)', STYLE.TABLE_HEADER),
      makeStringCell(6, r, 'Cuota 300M a 9,9% (Gs. Fórmula)', STYLE.TABLE_HEADER),
      makeStringCell(7, r, 'Cuota 350M a 6,5% (Gs. Fórmula)', STYLE.TABLE_HEADER),
      makeStringCell(8, r, 'Cuota 350M a 9,9% (Gs. Fórmula)', STYLE.TABLE_HEADER),
      makeStringCell(9, r, 'Cuota 440M a 6,5% (Gs. Fórmula)', STYLE.TABLE_HEADER),
      makeStringCell(10, r, 'Cuota 440M a 9,9% (Gs. Fórmula)', STYLE.TABLE_HEADER),
      makeStringCell(11, r, 'Observación Financiera', STYLE.TABLE_HEADER)
    ]
  });
  r++;

  const plazosList = [
    { anios: 15, meses: 180, c65: 8982, c99: 11097, obs: 'Plazo oficial BNF (180 cuotas) — Menor costo financiero total' },
    { anios: 20, meses: 240, c65: 7727, c99: 9997, obs: 'Plazo intermedio bancario BNF (240 cuotas)' },
    { anios: 30, meses: 360, c65: 6592, c99: 9114, obs: 'Plazo máximo hipotecario BNF (360 cuotas)' }
  ];

  plazosList.forEach((p) => {
    rows.push({
      rowIdx: r,
      height: 20,
      cells: [
        makeStringCell(1, r, `${p.anios} Años`, STYLE.TEXT_CENTER),
        makeNumberCell(2, r, p.meses, STYLE.GS_INT),
        makeNumberCell(3, r, p.c65, STYLE.GS_INT),
        makeNumberCell(4, r, p.c99, STYLE.GS_INT),
        makeFormulaCell(5, r, `300*C${r}`, 300 * p.c65, STYLE.GS_INT),
        makeFormulaCell(6, r, `300*D${r}`, 300 * p.c99, STYLE.GS_INT),
        makeFormulaCell(7, r, `350*C${r}`, 350 * p.c65, STYLE.GS_INT),
        makeFormulaCell(8, r, `350*D${r}`, 350 * p.c99, STYLE.GS_INT),
        makeFormulaCell(9, r, `440*C${r}`, 440 * p.c65, STYLE.GS_INT),
        makeFormulaCell(10, r, `440*D${r}`, 440 * p.c99, STYLE.GS_INT),
        makeStringCell(11, r, p.obs, STYLE.TEXT)
      ]
    });
    r++;
  });

  // Nota al pie sobre rango de 440M vs Edifica B (460,1M)
  void firstTramoRow;
  void lastTramoRow;

  return buildWorksheetXml({
    rows,
    colWidths: [18, 20, 20, 20, 22, 22, 22, 20, 22, 20, 52],
    merges: ['A1:K1', 'A2:K2', 'A3:K3', mergePlazosTitle]
  });
}

// ============================================================================
// HOJA 5: 5_AUDITORIA_6_ESPECIALISTAS
// Dictamen de los 6 Especialistas + Tabla de los 4 Pases Diamantados en Losa 1 Maciza
// ============================================================================

function buildSheet5AuditoriaEspecialistas() {
  const rows = [];
  let r = 1;

  rows.push({
    rowIdx: r,
    height: 28,
    cells: [
      makeStringCell(
        1,
        r,
        'DICTAMEN TÉCNICO MULTIDISCIPLINARIO DE LOS 6 ESPECIALISTAS + 4 PASES DIAMANTADOS EN LOSA 1 MACIZA EXISTENTE',
        STYLE.TITLE_BANNER
      ),
      ...Array.from({ length: 8 }, (_, i) =>
        makeStringCell(i + 2, r, '', STYLE.TITLE_BANNER)
      )
    ]
  });
  r++;

  rows.push({
    rowIdx: r,
    height: 22,
    cells: [
      makeStringCell(
        1,
        r,
        'Especialistas: 1) Ing. Civil Estructural | 2) Arq. Interior y Pet-Friendly | 3) Arq. Exterior y Paisajismo | 4) Seguridad Física/Electrónica | 5) Ing. Electricista ANDE | 6) Plomero ESSAP',
        STYLE.SUBTITLE_BANNER
      ),
      ...Array.from({ length: 8 }, (_, i) =>
        makeStringCell(i + 2, r, '', STYLE.SUBTITLE_BANNER)
      )
    ]
  });
  r++;

  const headers = [
    'Especialista / Área',
    'Calificación y Rol Técnico',
    'Severidad',
    'Hallazgo / Problema Detectado en Planos u Obra',
    'Solución de Ingeniería Adoptada en el Gemelo Digital 3D',
    'Materiales (Gs.)',
    'Mano de Obra (Gs.)',
    'Costo Total (Gs. Fórmula)',
    'Partida Presupuestaria Vinculada'
  ];

  rows.push({
    rowIdx: r,
    height: 28,
    cells: headers.map((h, i) => makeStringCell(i + 1, r, h, STYLE.TABLE_HEADER))
  });
  r++;

  const firstAuditRow = r;
  let totalMatAudit = 0;
  let totalMoAudit = 0;

  (AUDITORIA_SEIS_ESPECIALISTAS || []).forEach((esp) => {
    const hallazgos = esp.huecosDetectadosYSoluciones || [];
    hallazgos.forEach((h) => {
      const mat = Number(h.costoMaterialesGs) || 0;
      const mo = Number(h.costoManoObraGs) || 0;
      const sub = mat + mo;
      totalMatAudit += mat;
      totalMoAudit += mo;

      const sevStyle =
        String(h.severidad).includes('CRÍTICO')
          ? STYLE.BANCO_ROJO
          : String(h.severidad).includes('CORREGIDO')
            ? STYLE.BANCO_VERDE
            : STYLE.BANCO_AMARILLO;

      rows.push({
        rowIdx: r,
        height: 26,
        cells: [
          makeStringCell(1, r, `${esp.icono || ''} ${esp.especialidad}`.trim(), STYLE.TEXT),
          makeStringCell(2, r, `${esp.calificacionActual} — ${esp.profesionalRol}`, STYLE.TEXT),
          makeStringCell(3, r, h.severidad, sevStyle),
          makeStringCell(4, r, h.hallazgo, STYLE.TEXT),
          makeStringCell(5, r, h.solucion, STYLE.TEXT),
          makeNumberCell(6, r, mat, STYLE.GS_INT),
          makeNumberCell(7, r, mo, STYLE.GS_INT),
          makeFormulaCell(8, r, `F${r}+G${r}`, sub, STYLE.HIGHLIGHT_GREEN_GS),
          makeStringCell(9, r, h.incluidoEnPartida || '', STYLE.TEXT)
        ]
      });
      r++;
    });
  });
  const lastAuditRow = r - 1;

  // Fila Total Auditoría 6 Especialistas
  rows.push({
    rowIdx: r,
    height: 24,
    cells: [
      makeStringCell(1, r, 'TOTAL AUDITORÍA', STYLE.TOTAL_LABEL),
      makeStringCell(
        2,
        r,
        'SUMA DE INTERVENCIONES DE INGENIERÍA DE LOS 6 ESPECIALISTAS (INTEGRADAS EN LAS PARTIDAS DEL PRESUPUESTO)',
        STYLE.TOTAL_LABEL
      ),
      makeStringCell(3, r, '100% CUBIERTO', STYLE.BANCO_VERDE),
      makeStringCell(4, r, '', STYLE.TOTAL_LABEL),
      makeStringCell(5, r, '', STYLE.TOTAL_LABEL),
      makeFormulaCell(
        6,
        r,
        `SUM(F${firstAuditRow}:F${lastAuditRow})`,
        totalMatAudit,
        STYLE.TOTAL_GS
      ),
      makeFormulaCell(
        7,
        r,
        `SUM(G${firstAuditRow}:G${lastAuditRow})`,
        totalMoAudit,
        STYLE.TOTAL_GS
      ),
      makeFormulaCell(
        8,
        r,
        `SUM(H${firstAuditRow}:H${lastAuditRow})`,
        totalMatAudit + totalMoAudit,
        STYLE.HIGHLIGHT_GREEN_GS
      ),
      makeStringCell(9, r, 'Sin sobrecostos ocultos', STYLE.TOTAL_LABEL)
    ]
  });
  r += 2;

  // Tabla 2: Los 4 Pases Diamantados en Losa 1 Maciza (DUCTOS_PASES_ENCHUFES_DATOS)
  rows.push({
    rowIdx: r,
    height: 24,
    cells: [
      makeStringCell(
        1,
        r,
        'TABLA TÉCNICA DE LOS 4 PASES VERTICALES CON SACABOCADO DE COPA DIAMANTADA EN LOSA 1 MACIZA EXISTENTE (+100.00m)',
        STYLE.SECTION_ROW
      ),
      ...Array.from({ length: 8 }, (_, i) =>
        makeStringCell(i + 2, r, '', STYLE.SECTION_ROW)
      )
    ]
  });
  const mergePasesTitle = `A${r}:I${r}`;
  r++;

  rows.push({
    rowIdx: r,
    height: 24,
    cells: [
      makeStringCell(1, r, 'ID Pase', STYLE.TABLE_HEADER),
      makeStringCell(2, r, 'Código y Diámetro Copa', STYLE.TABLE_HEADER),
      makeStringCell(3, r, 'Diámetro (mm)', STYLE.TABLE_HEADER),
      makeStringCell(4, r, 'Nombre y Función del Pase Vertical en Losa 1', STYLE.TABLE_HEADER),
      makeStringCell(5, r, 'Ubicación Exacta en Planta / Eje Estructural y Coordenadas 3D', STYLE.TABLE_HEADER),
      makeStringCell(6, r, 'Conductores / Cañerías que Atraviesan el Pase', STYLE.TABLE_HEADER),
      makeStringCell(7, r, 'Método Constructivo y Sellado Normativo', STYLE.TABLE_HEADER),
      makeStringCell(8, r, 'Costo Copa + Sellado (Gs.)', STYLE.TABLE_HEADER),
      makeStringCell(9, r, 'Restricción Estructural', STYLE.TABLE_HEADER)
    ]
  });
  r++;

  const pases = DUCTOS_PASES_ENCHUFES_DATOS?.pasesLosa1Diamantados || [];
  const firstPaseRow = r;
  let sumPasesGs = 0;

  pases.forEach((p, idx) => {
    const costoPase = idx < 2 ? 420000 : 580000;
    sumPasesGs += costoPase;
    const coords = Array.isArray(p.pos3D)
      ? `(x=${p.pos3D[0]}m, y=${p.pos3D[1]}m, z=${p.pos3D[2]}m)`
      : '';
    rows.push({
      rowIdx: r,
      height: 24,
      cells: [
        makeStringCell(1, r, p.id, STYLE.TEXT_CENTER),
        makeStringCell(2, r, p.codigo, STYLE.BANCO_VERDE),
        makeNumberCell(3, r, Number(p.diametroMm) || 50, STYLE.GS_INT),
        makeStringCell(4, r, p.nombre, STYLE.TEXT),
        makeStringCell(5, r, `${p.ejeRef} ${coords}`.trim(), STYLE.TEXT),
        makeStringCell(6, r, p.conductores, STYLE.TEXT),
        makeStringCell(7, r, p.metodoEjecucion, STYLE.TEXT),
        makeNumberCell(8, r, costoPase, STYLE.GS_INT),
        makeStringCell(9, r, 'PROHIBIDO PICAR VIGAS CON MAZA', STYLE.BANCO_ROJO)
      ]
    });
    r++;
  });
  const lastPaseRow = r - 1;

  rows.push({
    rowIdx: r,
    height: 22,
    cells: [
      makeStringCell(1, r, 'TOTAL PASES', STYLE.TOTAL_LABEL),
      makeStringCell(2, r, '4 PERFORACIONES DIAMANTADAS', STYLE.TOTAL_LABEL),
      makeFormulaCell(
        3,
        r,
        `COUNT(C${firstPaseRow}:C${lastPaseRow})`,
        pases.length,
        STYLE.TOTAL_GS
      ),
      makeStringCell(
        4,
        r,
        'Total Perforaciones Limpias con Copa Diamantada + Camisas PVC + Sellado Cortafuego/Poliuretánico',
        STYLE.TOTAL_LABEL
      ),
      makeStringCell(5, r, '', STYLE.TOTAL_LABEL),
      makeStringCell(6, r, '', STYLE.TOTAL_LABEL),
      makeStringCell(7, r, '', STYLE.TOTAL_LABEL),
      makeFormulaCell(
        8,
        r,
        `SUM(H${firstPaseRow}:H${lastPaseRow})`,
        sumPasesGs,
        STYLE.HIGHLIGHT_GREEN_GS
      ),
      makeStringCell(9, r, 'Incluido en Partidas 7.1 y 7.2', STYLE.TOTAL_LABEL)
    ]
  });

  return buildWorksheetXml({
    rows,
    colWidths: [24, 28, 18, 42, 48, 22, 22, 22, 32],
    merges: ['A1:I1', 'A2:I2', mergePasesTitle]
  });
}

// ============================================================================
// HOJA 6: 6_COMPRA_CHINA_DOMOTICA
// Evaluación de Compra Directa en China: Riel DIN Inteligente + Interruptores Zigbee con Neutro + Prevención Activa
// ============================================================================

function buildSheet6CompraChinaDomotica() {
  const rows = [];
  let r = 1;

  rows.push({
    rowIdx: r,
    height: 28,
    cells: [
      makeStringCell(
        1,
        r,
        ESTRATEGIA_COMPRA_CHINA_DOMOTICA_ELECTRICA?.titulo ||
          'EVALUACIÓN DE COMPRA DIRECTA EN CHINA: RIEL DIN INTELIGENTE + INTERRUPTORES ZIGBEE CON NEUTRO + PREVENCIÓN ACTIVA DE FALLAS',
        STYLE.TITLE_BANNER
      ),
      ...Array.from({ length: 8 }, (_, i) =>
        makeStringCell(i + 2, r, '', STYLE.TITLE_BANNER)
      )
    ]
  });
  r++;

  rows.push({
    rowIdx: r,
    height: 22,
    cells: [
      makeStringCell(
        1,
        r,
        'Consolidación Aérea Shenzhen → Asunción (Courier ~USD 22/kg | T/C Ref: Gs. 7.700/USD) • Red Interna LAN / Zigbee 3.0 100% Funcional sin Depender de Internet',
        STYLE.SUBTITLE_BANNER
      ),
      ...Array.from({ length: 8 }, (_, i) =>
        makeStringCell(i + 2, r, '', STYLE.SUBTITLE_BANNER)
      )
    ]
  });
  r++;

  // Tabla 1: Comparativa Resumen de los 2 Kits
  // (Kit 1 Básico Gs. 2.365.000 vs Gs. 5.480.000 local y Kit 2 Prevención Activa Total Gs. 3.885.000 vs Gs. 9.250.000 local)
  rows.push({
    rowIdx: r,
    height: 26,
    cells: [
      makeStringCell(1, r, 'Código Kit', STYLE.TABLE_HEADER),
      makeStringCell(2, r, 'Nombre del Lote Consolidado / Kit de Domótica y Protección Eléctrica', STYLE.TABLE_HEADER),
      makeStringCell(3, r, 'Peso Total (kg)', STYLE.TABLE_HEADER),
      makeStringCell(4, r, 'Costo FOB China (USD)', STYLE.TABLE_HEADER),
      makeStringCell(5, r, 'Flete Aéreo Courier a Asunción (USD)', STYLE.TABLE_HEADER),
      makeStringCell(6, r, 'Total Puesto en Asunción (Gs. Fórmula)', STYLE.TABLE_HEADER),
      makeStringCell(7, r, 'Precio Equivalente Local en Asunción (Gs.)', STYLE.TABLE_HEADER),
      makeStringCell(8, r, 'Ahorro Neto Importación Directa (Gs. Fórmula)', STYLE.TABLE_HEADER),
      makeStringCell(9, r, 'Protocolo en Red Local (Sin Nube Obligatoria)', STYLE.TABLE_HEADER)
    ]
  });
  r++;

  const lotes =
    ESTRATEGIA_COMPRA_CHINA_DOMOTICA_ELECTRICA?.comparativaLotesChinaVsLocal || [];

  lotes.forEach((kit, idx) => {
    const peso = Number(kit.pesoEstimadoKg) || (idx === 0 ? 4.2 : 6.8);
    const fobUsd = Number(kit.costoFobChinaUsd) || (idx === 0 ? 215 : 355);
    const courierUsd =
      Number(kit.costoCourierAsuncionUsd) || (idx === 0 ? 92 : 150);
    const totalChinaGs =
      Number(kit.costoTotalPuestoAsuncionGs) ||
      (idx === 0 ? 2365000 : 3885000);
    const totalLocalGs =
      Number(kit.costoEquivalenteEnAsuncionGs) ||
      (idx === 0 ? 5480000 : 9250000);
    const ahorroGs = totalLocalGs - totalChinaGs;

    rows.push({
      rowIdx: r,
      height: 24,
      cells: [
        makeStringCell(1, r, idx === 0 ? 'KIT-1 BÁSICO' : 'KIT-2 TOTAL', STYLE.BANCO_VERDE),
        makeStringCell(2, r, kit.nombre, STYLE.TEXT),
        makeNumberCell(3, r, peso, STYLE.DEC_QTY),
        makeNumberCell(4, r, fobUsd, STYLE.GS_INT),
        makeNumberCell(5, r, courierUsd, STYLE.GS_INT),
        makeNumberCell(6, r, totalChinaGs, STYLE.HIGHLIGHT_GREEN_GS),
        makeNumberCell(7, r, totalLocalGs, STYLE.GS_INT),
        makeFormulaCell(8, r, `G${r}-F${r}`, ahorroGs, STYLE.HIGHLIGHT_GREEN_GS),
        makeStringCell(9, r, kit.protocoloRedInterna || '', STYLE.TEXT)
      ]
    });
    r++;
  });

  r++;

  // Tabla 2: Desglose Ítem por Ítem en USD, Peso kg, Flete Aéreo Courier y Precios en Gs. (Kit 1 + Adicionales Kit 2)
  rows.push({
    rowIdx: r,
    height: 24,
    cells: [
      makeStringCell(
        1,
        r,
        'DESGLOSE ÍTEM POR ÍTEM EN USD FOB, PESO (KG), FLETE COURIER AÉREO Y PRECIOS PUESTOS EN ASUNCIÓN (GS.) VS. PLAZA LOCAL',
        STYLE.SECTION_ROW
      ),
      ...Array.from({ length: 8 }, (_, i) =>
        makeStringCell(i + 2, r, '', STYLE.SECTION_ROW)
      )
    ]
  });
  const mergeDesgloseTitle = `A${r}:I${r}`;
  r++;

  rows.push({
    rowIdx: r,
    height: 26,
    cells: [
      makeStringCell(1, r, 'Kit / Etapa', STYLE.TABLE_HEADER),
      makeStringCell(2, r, 'Componente Técnico (Riel DIN / Interruptor Zigbee c/ Neutro / Sensor Activo)', STYLE.TABLE_HEADER),
      makeStringCell(3, r, 'Cantidad', STYLE.TABLE_HEADER),
      makeStringCell(4, r, 'Peso Lote (kg)', STYLE.TABLE_HEADER),
      makeStringCell(5, r, 'FOB China + Courier (USD)', STYLE.TABLE_HEADER),
      makeStringCell(6, r, 'Costo Puesto en Asunción (Gs.)', STYLE.TABLE_HEADER),
      makeStringCell(7, r, 'Precio en Casas Locales Asunción (Gs.)', STYLE.TABLE_HEADER),
      makeStringCell(8, r, 'Ahorro por Ítem (Gs. Fórmula)', STYLE.TABLE_HEADER),
      makeStringCell(9, r, 'Función de Monitoreo y Prevención Activa de Fallas', STYLE.TABLE_HEADER)
    ]
  });
  r++;

  const desgloseItems = [
    {
      kit: 'Kit 1 (Básico)',
      item: '1 Medidor Bidireccional Trifásico en Riel DIN c/ 3 Pinzas CT 80A (MatSee Plus / IAMMETER / Tongou)',
      cant: '1 un.',
      pesoKg: 0.45,
      usdTotal: 38,
      chinaGs: 295000,
      localGs: 890000,
      fn: 'Mide en vivo Voltaje (V), Corriente (A), Potencia (W) y Consumo (kWh y Gs.) de las 3 fases de ANDE (R, S, T).'
    },
    {
      kit: 'Kit 1 (Básico)',
      item: '3 Protectores Digitales de Sobre/Baja Tensión y Sobrecorriente 63A en Riel DIN con Telemetría (1 por Fase R-S-T)',
      cant: '3 un.',
      pesoKg: 0.65,
      usdTotal: 45,
      chinaGs: 345000,
      localGs: 870000,
      fn: 'Corta en 0,1s si ANDE cae a <175V o sube >250V, salvando la Heladera, los 3 Aires Split y el Motor del Portón.'
    },
    {
      kit: 'Kit 1 (Básico)',
      item: '6 Disyuntores Inteligentes Riel DIN c/ Medición de Consumo, Fuga (mA) y Temperatura de Borne (Tongou / Sonoff)',
      cant: '6 un.',
      pesoKg: 1.10,
      usdTotal: 101,
      chinaGs: 780000,
      localGs: 1860000,
      fn: 'Para Termocalefón 80L, 3 Aires Split, Cocina 20A y Bomba Subsuelo. Alerta si un borne supera 70°C o hay fuga >15mA.'
    },
    {
      kit: 'Kit 1 (Básico)',
      item: '14 Interruptores de Pared Inteligentes Zigbee 3.0 con Neutro (Tecla Física/Touch de 1, 2 y 3 canales — Aqara / Sonoff / Moes)',
      cant: '14 un.',
      pesoKg: 2.00,
      usdTotal: 123,
      chinaGs: 945000,
      localGs: 1860000,
      fn: 'Reemplaza las llaves comunes en los 3 niveles. Funcionan manualmente sin Wi-Fi y hacen 3-Way en escaleras por software.'
    },
    {
      kit: 'Adic. Kit 2 (Total)',
      item: '1 Coordinador Zigbee 3.0 PoE Industrial (SMLight SLZB-06) + Mini-Hub Local para Red Interna LAN',
      cant: '1 cjto.',
      pesoKg: 0.55,
      usdTotal: 64,
      chinaGs: 490000,
      localGs: 1350000,
      fn: 'Conectado por cable Cat6 PoE al Rack: integra todo en red interna privada sin depender de servidores en la nube.'
    },
    {
      kit: 'Adic. Kit 2 (Total)',
      item: '4 Sensores de Inundación/Fuga de Agua Zigbee (Cocina, Termocalefón 2do Piso, Baño y Lavadero/Cisterna Subsuelo)',
      cant: '4 un.',
      pesoKg: 0.35,
      usdTotal: 38,
      chinaGs: 290000,
      localGs: 760000,
      fn: 'Si pierde un flexible o el termocalefón, corta automáticamente la llave DIN de la Bomba Presurizadora en 1 segundo.'
    },
    {
      kit: 'Adic. Kit 2 (Total)',
      item: '1 Detector Inteligente de Gas GLP + 2 Detectores de Humo Fotoeléctricos Zigbee (Cocina y Caja de Escalera)',
      cant: '3 un.',
      pesoKg: 0.50,
      usdTotal: 42,
      chinaGs: 320000,
      localGs: 780000,
      fn: 'Monitorea pérdidas de garrafa GLP o humo en cocina y escalera, disparando sirena local y alerta crítica al celular.'
    },
    {
      kit: 'Adic. Kit 2 (Total)',
      item: '8 Tomacorrientes / Micromódulos Inteligentes de 20A con Medidor de Consumo (Heladera, Air Fryer, Microondas, Lavarropas)',
      cant: '8 un.',
      pesoKg: 1.20,
      usdTotal: 54,
      chinaGs: 420000,
      localGs: 880000,
      fn: 'Audita el consumo individual y avisa si la heladera pierde frío o si quedó un artefacto de potencia encendido.'
    }
  ];

  const firstItemRow = r;
  const lastKit1Row = firstItemRow + 3;
  desgloseItems.forEach((d) => {
    const diffGs = d.localGs - d.chinaGs;
    rows.push({
      rowIdx: r,
      height: 22,
      cells: [
        makeStringCell(1, r, d.kit, STYLE.TEXT_CENTER),
        makeStringCell(2, r, d.item, STYLE.TEXT),
        makeStringCell(3, r, d.cant, STYLE.TEXT_CENTER),
        makeNumberCell(4, r, d.pesoKg, STYLE.DEC_QTY),
        makeNumberCell(5, r, d.usdTotal, STYLE.GS_INT),
        makeNumberCell(6, r, d.chinaGs, STYLE.HIGHLIGHT_GREEN_GS),
        makeNumberCell(7, r, d.localGs, STYLE.GS_INT),
        makeFormulaCell(8, r, `G${r}-F${r}`, diffGs, STYLE.HIGHLIGHT_GREEN_GS),
        makeStringCell(9, r, d.fn, STYLE.TEXT)
      ]
    });
    r++;
  });
  const lastItemRow = r - 1;

  // Subtotal Kit 1 Básico (Gs. 2.365.000 vs Gs. 5.480.000)
  rows.push({
    rowIdx: r,
    height: 23,
    cells: [
      makeStringCell(1, r, 'SUBTOTAL KIT 1', STYLE.TOTAL_LABEL),
      makeStringCell(
        2,
        r,
        'TOTAL KIT 1 BÁSICO ESENCIAL (Gs. 2.365.000 Puesto en Asunción vs. Gs. 5.480.000 en Plaza Local)',
        STYLE.TOTAL_LABEL
      ),
      makeStringCell(3, r, '24 disp.', STYLE.TOTAL_LABEL),
      makeFormulaCell(
        4,
        r,
        `SUM(D${firstItemRow}:D${lastKit1Row})`,
        4.2,
        STYLE.DEC_QTY
      ),
      makeFormulaCell(
        5,
        r,
        `SUM(E${firstItemRow}:E${lastKit1Row})`,
        307,
        STYLE.TOTAL_GS
      ),
      makeFormulaCell(
        6,
        r,
        `SUM(F${firstItemRow}:F${lastKit1Row})`,
        2365000,
        STYLE.HIGHLIGHT_GREEN_GS
      ),
      makeFormulaCell(
        7,
        r,
        `SUM(G${firstItemRow}:G${lastKit1Row})`,
        5480000,
        STYLE.TOTAL_GS
      ),
      makeFormulaCell(
        8,
        r,
        `G${r}-F${r}`,
        3115000,
        STYLE.HIGHLIGHT_GREEN_GS
      ),
      makeStringCell(9, r, 'Ahorro Neto Kit 1: Gs. 3.115.000 (-56,8%)', STYLE.TOTAL_LABEL)
    ]
  });
  r++;

  // Total Kit 2 Prevención Activa Total (Gs. 3.885.000 vs Gs. 9.250.000)
  rows.push({
    rowIdx: r,
    height: 25,
    cells: [
      makeStringCell(1, r, 'TOTAL KIT 2', STYLE.TOTAL_LABEL),
      makeStringCell(
        2,
        r,
        'TOTAL KIT 2 PREVENCIÓN ACTIVA TOTAL (Gs. 3.885.000 Puesto en Asunción vs. Gs. 9.250.000 en Plaza Local)',
        STYLE.TOTAL_LABEL
      ),
      makeStringCell(3, r, '40 disp.', STYLE.TOTAL_LABEL),
      makeFormulaCell(
        4,
        r,
        `SUM(D${firstItemRow}:D${lastItemRow})`,
        6.8,
        STYLE.DEC_QTY
      ),
      makeFormulaCell(
        5,
        r,
        `SUM(E${firstItemRow}:E${lastItemRow})`,
        505,
        STYLE.TOTAL_GS
      ),
      makeFormulaCell(
        6,
        r,
        `SUM(F${firstItemRow}:F${lastItemRow})`,
        3885000,
        STYLE.HIGHLIGHT_GREEN_GS
      ),
      makeFormulaCell(
        7,
        r,
        `SUM(G${firstItemRow}:G${lastItemRow})`,
        9250000,
        STYLE.TOTAL_GS
      ),
      makeFormulaCell(
        8,
        r,
        `G${r}-F${r}`,
        5365000,
        STYLE.HIGHLIGHT_GREEN_GS
      ),
      makeStringCell(9, r, 'Ahorro Neto Kit 2: Gs. 5.365.000 (-58,0%)', STYLE.TOTAL_LABEL)
    ]
  });
  r += 2;

  // Tabla 3: Las 4 Reglas de Obra de Cero sin Costo Extra
  rows.push({
    rowIdx: r,
    height: 24,
    cells: [
      makeStringCell(
        1,
        r,
        'LAS 4 REGLAS DE OBRA DE CERO SIN COSTO EXTRA (EXIGIR AL ELECTRICISTA ANTES DE REVOCAR)',
        STYLE.SECTION_ROW
      ),
      ...Array.from({ length: 8 }, (_, i) =>
        makeStringCell(i + 2, r, '', STYLE.SECTION_ROW)
      )
    ]
  });
  const mergeReglasObraTitle = `A${r}:I${r}`;
  r++;

  const reglasObra =
    ESTRATEGIA_COMPRA_CHINA_DOMOTICA_ELECTRICA?.requisitosObraDeCeroSinCostoExtra ||
    [];
  reglasObra.forEach((ro) => {
    rows.push({
      rowIdx: r,
      height: 22,
      cells: [
        makeStringCell(1, r, `Regla Obra #${ro.nro}`, STYLE.BANCO_VERDE),
        makeStringCell(2, r, ro.regla, STYLE.TEXT),
        makeStringCell(3, r, 'Costo Extra ~Gs. 0', STYLE.TEXT_CENTER),
        makeStringCell(4, r, ro.explicacion, STYLE.TEXT),
        ...Array.from({ length: 5 }, (_, i) =>
          makeStringCell(i + 5, r, '', STYLE.TEXT)
        )
      ]
    });
    r++;
  });
  r++;

  // Tabla 4: Matriz de Prevención Activa de Fallas Eléctricas e Hidráulicas
  rows.push({
    rowIdx: r,
    height: 24,
    cells: [
      makeStringCell(
        1,
        r,
        'MATRIZ DE PREVENCIÓN ACTIVA DE FALLAS ELÉCTRICAS E HIDRÁULICAS EN RED INTERNA LOCAL',
        STYLE.SECTION_ROW
      ),
      ...Array.from({ length: 8 }, (_, i) =>
        makeStringCell(i + 2, r, '', STYLE.SECTION_ROW)
      )
    ]
  });
  const mergeMatrizTitle = `A${r}:I${r}`;
  r++;

  const alertas =
    ESTRATEGIA_COMPRA_CHINA_DOMOTICA_ELECTRICA?.alertasPrevencionActivaQueDetecta ||
    [];
  alertas.forEach((alertaTexto, idx) => {
    rows.push({
      rowIdx: r,
      height: 22,
      cells: [
        makeStringCell(1, r, `Prevención #${idx + 1}`, STYLE.BANCO_AMARILLO),
        makeStringCell(2, r, alertaTexto, STYLE.TEXT),
        ...Array.from({ length: 7 }, (_, i) =>
          makeStringCell(i + 3, r, '', STYLE.TEXT)
        )
      ]
    });
    r++;
  });

  return buildWorksheetXml({
    rows,
    colWidths: [18, 56, 12, 14, 18, 22, 22, 22, 52],
    merges: [
      'A1:I1',
      'A2:I2',
      mergeDesgloseTitle,
      mergeReglasObraTitle,
      mergeMatrizTitle
    ]
  });
}

// ============================================================================
// DOCUMENTOS DE ESTRUCTURA OPENXML (CONTENT_TYPES, RELS, WORKBOOK, STYLES)
// ============================================================================

function buildContentTypesXml() {
  return (
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n` +
    `<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">` +
    `<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>` +
    `<Default Extension="xml" ContentType="application/xml"/>` +
    `<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>` +
    `<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>` +
    `<Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>` +
    `<Override PartName="/xl/worksheets/sheet2.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>` +
    `<Override PartName="/xl/worksheets/sheet3.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>` +
    `<Override PartName="/xl/worksheets/sheet4.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>` +
    `<Override PartName="/xl/worksheets/sheet5.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>` +
    `<Override PartName="/xl/worksheets/sheet6.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>` +
    `</Types>`
  );
}

function buildRootRelsXml() {
  return (
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n` +
    `<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">` +
    `<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>` +
    `</Relationships>`
  );
}

function buildWorkbookXml() {
  return (
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n` +
    `<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" ` +
    `xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">` +
    `<sheets>` +
    `<sheet name="1_CARPETA_BANCO_COLORES" sheetId="1" r:id="rId1"/>` +
    `<sheet name="2_FORMATO_LG_RB_LOZARRAP" sheetId="2" r:id="rId2"/>` +
    `<sheet name="3_CONTROL_Y_ARQUITECTO" sheetId="3" r:id="rId3"/>` +
    `<sheet name="4_CREDITO_BNF" sheetId="4" r:id="rId4"/>` +
    `<sheet name="5_AUDITORIA_6_ESPECIALISTAS" sheetId="5" r:id="rId5"/>` +
    `<sheet name="6_COMPRA_CHINA_DOMOTICA" sheetId="6" r:id="rId6"/>` +
    `</sheets>` +
    `<calcPr calcId="171027" fullCalcOnLoad="1"/>` +
    `</workbook>`
  );
}

function buildWorkbookRelsXml() {
  return (
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n` +
    `<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">` +
    `<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>` +
    `<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet2.xml"/>` +
    `<Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet3.xml"/>` +
    `<Relationship Id="rId4" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet4.xml"/>` +
    `<Relationship Id="rId5" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet5.xml"/>` +
    `<Relationship Id="rId6" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet6.xml"/>` +
    `<Relationship Id="rId7" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>` +
    `</Relationships>`
  );
}

function buildStylesXml() {
  return (
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n` +
    `<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">` +
    `<numFmts count="3">` +
    `<numFmt numFmtId="164" formatCode="#,##0"/>` +
    `<numFmt numFmtId="165" formatCode="#,##0.00"/>` +
    `<numFmt numFmtId="166" formatCode="0%"/>` +
    `</numFmts>` +
    `<fonts count="8">` +
    `<font><sz val="10"/><color rgb="FF0F172A"/><name val="Calibri"/></font>` +
    `<font><b/><sz val="12"/><color rgb="FFFFFFFF"/><name val="Calibri"/></font>` +
    `<font><b/><sz val="10"/><color rgb="FFFFFFFF"/><name val="Calibri"/></font>` +
    `<font><b/><sz val="10"/><color rgb="FF0F172A"/><name val="Calibri"/></font>` +
    `<font><b/><sz val="10"/><color rgb="FF166534"/><name val="Calibri"/></font>` +
    `<font><b/><sz val="10"/><color rgb="FF991B1B"/><name val="Calibri"/></font>` +
    `<font><b/><sz val="10"/><color rgb="FF92400E"/><name val="Calibri"/></font>` +
    `<font><b/><sz val="10"/><color rgb="FF1E3A8A"/><name val="Calibri"/></font>` +
    `</fonts>` +
    `<fills count="11">` +
    `<fill><patternFill patternType="none"/></fill>` +
    `<fill><patternFill patternType="gray125"/></fill>` +
    `<fill><patternFill patternType="solid"><fgColor rgb="FF0F172A"/><bgColor indexed="64"/></patternFill></fill>` +
    `<fill><patternFill patternType="solid"><fgColor rgb="FF1E293B"/><bgColor indexed="64"/></patternFill></fill>` +
    `<fill><patternFill patternType="solid"><fgColor rgb="FF1E3A8A"/><bgColor indexed="64"/></patternFill></fill>` +
    `<fill><patternFill patternType="solid"><fgColor rgb="FFE2E8F0"/><bgColor indexed="64"/></patternFill></fill>` +
    `<fill><patternFill patternType="solid"><fgColor rgb="FFDBEAFE"/><bgColor indexed="64"/></patternFill></fill>` +
    `<fill><patternFill patternType="solid"><fgColor rgb="FFDCFCE7"/><bgColor indexed="64"/></patternFill></fill>` +
    `<fill><patternFill patternType="solid"><fgColor rgb="FFFEE2E2"/><bgColor indexed="64"/></patternFill></fill>` +
    `<fill><patternFill patternType="solid"><fgColor rgb="FFFEF3C7"/><bgColor indexed="64"/></patternFill></fill>` +
    `<fill><patternFill patternType="solid"><fgColor rgb="FFF8FAFC"/><bgColor indexed="64"/></patternFill></fill>` +
    `</fills>` +
    `<borders count="3">` +
    `<border><left/><right/><top/><bottom/><diagonal/></border>` +
    `<border>` +
    `<left style="thin"><color rgb="FFCBD5E1"/></left>` +
    `<right style="thin"><color rgb="FFCBD5E1"/></right>` +
    `<top style="thin"><color rgb="FFCBD5E1"/></top>` +
    `<bottom style="thin"><color rgb="FFCBD5E1"/></bottom>` +
    `<diagonal/>` +
    `</border>` +
    `<border>` +
    `<left style="thin"><color rgb="FF64748B"/></left>` +
    `<right style="thin"><color rgb="FF64748B"/></right>` +
    `<top style="medium"><color rgb="FF1E3A8A"/></top>` +
    `<bottom style="double"><color rgb="FF1E3A8A"/></bottom>` +
    `<diagonal/>` +
    `</border>` +
    `</borders>` +
    `<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>` +
    `<cellXfs count="18">` +
    // 0: NORMAL
    `<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>` +
    // 1: TITLE_BANNER
    `<xf numFmtId="0" fontId="1" fillId="2" borderId="1" xfId="0" applyFont="1" applyFill="1" applyAlignment="1"><alignment vertical="center"/></xf>` +
    // 2: SUBTITLE_BANNER
    `<xf numFmtId="0" fontId="2" fillId="3" borderId="1" xfId="0" applyFont="1" applyFill="1" applyAlignment="1"><alignment vertical="center"/></xf>` +
    // 3: TABLE_HEADER
    `<xf numFmtId="0" fontId="2" fillId="4" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center" wrapText="1"/></xf>` +
    // 4: SECTION_ROW
    `<xf numFmtId="0" fontId="3" fillId="5" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment vertical="center"/></xf>` +
    // 5: TEXT
    `<xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0" applyFont="1" applyBorder="1" applyAlignment="1"><alignment vertical="center" wrapText="1"/></xf>` +
    // 6: TEXT_CENTER
    `<xf numFmtId="0" fontId="3" fillId="10" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf>` +
    // 7: GS_INT (#,##0)
    `<xf numFmtId="164" fontId="0" fillId="0" borderId="1" xfId="0" applyNumberFormat="1" applyFont="1" applyBorder="1" applyAlignment="1"><alignment horizontal="right" vertical="center"/></xf>` +
    // 8: DEC_QTY (#,##0.00)
    `<xf numFmtId="165" fontId="0" fillId="0" borderId="1" xfId="0" applyNumberFormat="1" applyFont="1" applyBorder="1" applyAlignment="1"><alignment horizontal="right" vertical="center"/></xf>` +
    // 9: PERCENT (0%)
    `<xf numFmtId="166" fontId="3" fillId="0" borderId="1" xfId="0" applyNumberFormat="1" applyFont="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf>` +
    // 10: TOTAL_LABEL
    `<xf numFmtId="0" fontId="7" fillId="6" borderId="2" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment vertical="center"/></xf>` +
    // 11: TOTAL_GS (#,##0)
    `<xf numFmtId="164" fontId="7" fillId="6" borderId="2" xfId="0" applyNumberFormat="1" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="right" vertical="center"/></xf>` +
    // 12: BANCO_NEGRO
    `<xf numFmtId="0" fontId="2" fillId="3" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf>` +
    // 13: BANCO_VERDE
    `<xf numFmtId="0" fontId="4" fillId="7" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf>` +
    // 14: BANCO_ROJO
    `<xf numFmtId="0" fontId="5" fillId="8" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf>` +
    // 15: BANCO_AMARILLO
    `<xf numFmtId="0" fontId="6" fillId="9" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf>` +
    // 16: HIGHLIGHT_GREEN_GS (#,##0)
    `<xf numFmtId="164" fontId="4" fillId="7" borderId="1" xfId="0" applyNumberFormat="1" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="right" vertical="center"/></xf>` +
    // 17: HIGHLIGHT_RED_GS (#,##0)
    `<xf numFmtId="164" fontId="5" fillId="8" borderId="1" xfId="0" applyNumberFormat="1" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="right" vertical="center"/></xf>` +
    `</cellXfs>` +
    `<cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles>` +
    `</styleSheet>`
  );
}

// ============================================================================
// EMPAQUETADOR BINARIO ZIP (MÉTODO STORE = 0 + CRC32 IEEE 802.3)
// ============================================================================

const CRC32_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[i] = c >>> 0;
  }
  return table;
})();

function crc32(bytes) {
  let crc = 0xffffffff;
  for (let i = 0; i < bytes.length; i++) {
    crc = CRC32_TABLE[(crc ^ bytes[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function writeUint16LE(buf, offset, val) {
  buf[offset] = val & 0xff;
  buf[offset + 1] = (val >>> 8) & 0xff;
}

function writeUint32LE(buf, offset, val) {
  buf[offset] = val & 0xff;
  buf[offset + 1] = (val >>> 8) & 0xff;
  buf[offset + 2] = (val >>> 16) & 0xff;
  buf[offset + 3] = (val >>> 24) & 0xff;
}

function createZipArchive(files) {
  const encoder = new TextEncoder();
  const entries = files.map((f) => {
    const nameBytes = encoder.encode(f.path);
    const dataBytes =
      typeof f.content === 'string' ? encoder.encode(f.content) : f.content;
    const crc = crc32(dataBytes);
    return {
      nameBytes,
      dataBytes,
      crc,
      size: dataBytes.length,
      localHeaderOffset: 0
    };
  });

  let localSize = 0;
  let centralSize = 0;
  entries.forEach((e) => {
    e.localHeaderOffset = localSize;
    localSize += 30 + e.nameBytes.length + e.size;
    centralSize += 46 + e.nameBytes.length;
  });

  const totalSize = localSize + centralSize + 22;
  const out = new Uint8Array(totalSize);
  let ptr = 0;

  // Fecha/Hora DOS fija válida (2026-10-20 12:00:00)
  const dosTime = (12 << 11) | (0 << 5) | 0;
  const dosDate = ((2026 - 1980) << 9) | (10 << 5) | 20;

  // 1. Local File Headers + File Data
  entries.forEach((e) => {
    writeUint32LE(out, ptr, 0x04034b50); // Local file header signature
    writeUint16LE(out, ptr + 4, 20);     // Version needed to extract (2.0)
    writeUint16LE(out, ptr + 6, 0x0800); // General purpose bit flag (UTF-8)
    writeUint16LE(out, ptr + 8, 0);      // Compression method (0 = Store)
    writeUint16LE(out, ptr + 10, dosTime);
    writeUint16LE(out, ptr + 12, dosDate);
    writeUint32LE(out, ptr + 14, e.crc);
    writeUint32LE(out, ptr + 18, e.size);
    writeUint32LE(out, ptr + 22, e.size);
    writeUint16LE(out, ptr + 26, e.nameBytes.length);
    writeUint16LE(out, ptr + 28, 0);     // Extra field length
    ptr += 30;

    out.set(e.nameBytes, ptr);
    ptr += e.nameBytes.length;

    out.set(e.dataBytes, ptr);
    ptr += e.size;
  });

  const centralDirOffset = ptr;

  // 2. Central Directory File Headers
  entries.forEach((e) => {
    writeUint32LE(out, ptr, 0x02014b50); // Central directory signature
    writeUint16LE(out, ptr + 4, 20);     // Version made by
    writeUint16LE(out, ptr + 6, 20);     // Version needed to extract
    writeUint16LE(out, ptr + 8, 0x0800); // UTF-8 flag
    writeUint16LE(out, ptr + 10, 0);     // Store method
    writeUint16LE(out, ptr + 12, dosTime);
    writeUint16LE(out, ptr + 14, dosDate);
    writeUint32LE(out, ptr + 16, e.crc);
    writeUint32LE(out, ptr + 20, e.size);
    writeUint32LE(out, ptr + 24, e.size);
    writeUint16LE(out, ptr + 28, e.nameBytes.length);
    writeUint16LE(out, ptr + 30, 0);     // Extra field length
    writeUint16LE(out, ptr + 32, 0);     // File comment length
    writeUint16LE(out, ptr + 34, 0);     // Disk number start
    writeUint16LE(out, ptr + 36, 0);     // Internal file attributes
    writeUint32LE(out, ptr + 38, 0);     // External file attributes
    writeUint32LE(out, ptr + 42, e.localHeaderOffset);
    ptr += 46;

    out.set(e.nameBytes, ptr);
    ptr += e.nameBytes.length;
  });

  // 3. End of Central Directory Record (EOCD)
  writeUint32LE(out, ptr, 0x06054b50);
  writeUint16LE(out, ptr + 4, 0);
  writeUint16LE(out, ptr + 6, 0);
  writeUint16LE(out, ptr + 8, entries.length);
  writeUint16LE(out, ptr + 10, entries.length);
  writeUint32LE(out, ptr + 12, centralSize);
  writeUint32LE(out, ptr + 16, centralDirOffset);
  writeUint16LE(out, ptr + 20, 0);

  return out;
}

// ============================================================================
// FUNCIÓN PRINCIPAL EXPORTADA: exportProjectWorkbookXLSX
// ============================================================================

export function exportProjectWorkbookXLSX({
  scenarioKey = 'escenario350',
  items = [],
  loanAmount = 350000000,
  loanYears = 15,
  activeRateKey = 'tasa99'
} = {}) {
  const sheet1Xml = buildSheet1CarpetaBanco({ scenarioKey, items, loanAmount });
  const sheet2Xml = buildSheet2FormatoLgRbLozarrap();
  const sheet3Xml = buildSheet3ControlYArquitecto();
  const sheet4Xml = buildSheet4CreditoCajaMutual({
    loanAmount,
    loanYears,
    activeRateKey
  });
  const sheet5Xml = buildSheet5AuditoriaEspecialistas();
  const sheet6Xml = buildSheet6CompraChinaDomotica();

  const archiveEntries = [
    { path: '[Content_Types].xml', content: buildContentTypesXml() },
    { path: '_rels/.rels', content: buildRootRelsXml() },
    { path: 'xl/workbook.xml', content: buildWorkbookXml() },
    { path: 'xl/_rels/workbook.xml.rels', content: buildWorkbookRelsXml() },
    { path: 'xl/styles.xml', content: buildStylesXml() },
    { path: 'xl/worksheets/sheet1.xml', content: sheet1Xml },
    { path: 'xl/worksheets/sheet2.xml', content: sheet2Xml },
    { path: 'xl/worksheets/sheet3.xml', content: sheet3Xml },
    { path: 'xl/worksheets/sheet4.xml', content: sheet4Xml },
    { path: 'xl/worksheets/sheet5.xml', content: sheet5Xml },
    { path: 'xl/worksheets/sheet6.xml', content: sheet6Xml }
  ];

  const xlsxBytes = createZipArchive(archiveEntries);
  const filename = 'Carpeta_Bancaria_y_Computo_ItaPytaPunta_Ruth_y_Leo.xlsx';

  let blob = null;
  if (typeof Blob !== 'undefined') {
    blob = new Blob([xlsxBytes], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
  }

  if (
    typeof window !== 'undefined' &&
    typeof document !== 'undefined' &&
    blob &&
    typeof URL !== 'undefined' &&
    typeof URL.createObjectURL === 'function'
  ) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      if (link.parentNode) link.parentNode.removeChild(link);
      URL.revokeObjectURL(url);
    }, 1500);
  }

  return {
    filename,
    bytes: xlsxBytes,
    blob
  };
}

export default exportProjectWorkbookXLSX;
