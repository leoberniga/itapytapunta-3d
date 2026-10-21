/**
 * @file floorplanEditor.js
 * @description Editor Interactivo CAD/BIM 2D de Planos, Muros y Obra Evolutiva por Etapas
 * para Residencia Itá Pytã Punta (Calle Guillermo Arias, Asunción, Paraguay).
 *
 * BASADO AL MILÍMETRO EN `CALCULO ESTRUCTURAL L.G. FUSIONADO.pdf` + `GEO-STAN #2956` + `JIVESA S.A.`:
 * - Ejes X (`Eje 9` a `Eje 1`, ancho estructural `9.74m` centrado en lote `9.89m`):
 *   Eje 9 (-4.87m) | Eje 8 (-3.35m) | Eje 7 (-2.02m) | Eje 6 (-1.64m) | Eje 5 (-0.74m) |
 *   Eje 4 (+1.69m) | Eje 3 (+2.39m) | Eje 2 (+3.84m) | Eje 1 (+4.87m)
 * - Ejes Z (`Eje G` a `Eje A`, profundidad `3.00m` a `13.34m` = `10.34m`):
 *   Eje G (z=3.00m, Fachada Frontal) | Eje F (z=3.51m) | Eje E (z=4.77m, Inicio Subsuelo) |
 *   Eje D (z=5.26m) | Eje C (z=7.37m) | Eje B (z=9.94m, Línea Galería / Fin Subsuelo) |
 *   Eje A (z=13.34m, Borde Galería al Río)
 * - 20 Pilares (`P1`..`P20`) y 14 Zapatas (`Z1`..`Z20`, incluyendo zapatas combinadas
 *   `Z5(P8-P9)`, `Z6(P11-P12)`, `Z7(P15-P16)`, `Z11(P6-P7)`, `Z12(P10-P13)`, `Z13(P14-P19)`).
 * - Advertencia estructural crítica en Planta Alta: `P12` (Eje 6-C), `P13` (Eje 5-E) y `P15` (Eje 8-C)
 *   MUEREN EN PLANTA BAJA (`0.00m`) y no continúan en Planta Alta.
 */

import { DUCTOS_PASES_ENCHUFES_DATOS } from './data/projectData.js';

const STORAGE_KEY = 'itapytapunta_bim_floorplan_v8';

/**
 * Grilla Estructural Exacta según planos de encofrado y fundación (`CALCULO ESTRUCTURAL L.G. FUSIONADO.pdf`
 * + `estructural_e5_subsuelo_escalera.png` + `instalacion_sanitaria_agua.png`).
 */
export const FIXED_STRUCTURAL_GRID = {
  lot: {
    width: 9.89,
    depth: 31.0,
    minX: -4.945,
    maxX: 4.945,
    minZ: -4.0,
    maxZ: 27.0
  },
  xAxes: [
    { id: '9', x: -4.87, planCoordM: 0.00, label: 'Eje 9 (-4.87m | 0.00m plano)' },
    { id: '8', x: -3.35, planCoordM: 1.52, label: 'Eje 8 (-3.35m | 1.52m plano)' },
    { id: '7', x: -2.02, planCoordM: 2.85, label: 'Eje 7 (-2.02m | 2.85m plano)' },
    { id: '6', x: -1.64, planCoordM: 3.23, label: 'Eje 6 (-1.64m | 3.23m plano)' },
    { id: '5', x: -0.74, planCoordM: 4.13, label: 'Eje 5 (-0.74m | 4.13m plano)' },
    { id: '4', x: 1.69,  planCoordM: 6.56, label: 'Eje 4 (+1.69m | 6.56m plano)' },
    { id: '3', x: 2.39,  planCoordM: 7.26, label: 'Eje 3 (+2.39m | 7.26m plano)' },
    { id: '2', x: 3.84,  planCoordM: 8.71, label: 'Eje 2 (+3.84m | 8.71m plano)' },
    { id: '1', x: 4.87,  planCoordM: 9.74, label: 'Eje 1 (+4.87m | 9.74m plano)' }
  ],
  zAxes: [
    { id: 'G', z: 3.00,  planCoordM: 10.34, label: 'Eje G (Z=3.00m • 10.34m plano — Fachada Frontal)' },
    { id: 'F', z: 3.51,  planCoordM: 9.83,  label: 'Eje F (Z=3.51m • 9.83m plano)' },
    { id: 'E', z: 4.77,  planCoordM: 8.57,  label: 'Eje E (Z=4.77m • 8.57m plano — Pórtico E)' },
    { id: 'D', z: 5.26,  planCoordM: 8.08,  label: 'Eje D (Z=5.26m • 8.08m plano)' },
    { id: 'C', z: 7.37,  planCoordM: 5.97,  label: 'Eje C (Z=7.37m • 5.97m plano)' },
    { id: 'B', z: 9.94,  planCoordM: 3.40,  label: 'Eje B (Z=9.94m • 3.40m plano — Línea Galería)' },
    { id: 'A', z: 13.34, planCoordM: 0.00,  label: 'Eje A (Z=13.34m • 0.00m plano — Borde Galería al Río)' }
  ],
  retainingWallFront: {
    id: 'EJE_MURO_CONTENCION_CALLE',
    name: 'Muro de Contención del Estacionamiento en z=+1.50m (Cámara de Oxigenación 1.50m con Piso de Rejilla Metálica Electroforjada frente a Eje G)',
    x1: -4.87,
    z1: 1.50,
    x2: 4.87,
    z2: 1.50,
    thickness: 0.30,
    height: 2.34,
    locked: true
  },
  existingStaircase1: {
    id: 'ESCALERA_1_SUBSUELO',
    name: 'Escalera 1 H°A° Existente (Baja a Subsuelo 3.30×0.90m • Costado de Servicio Eje 1–2 c/ Doble Puerta 🔒)',
    x1: 3.84,
    z1: 5.26,
    x2: 4.87,
    z2: 8.80,
    w: 0.90,
    d: 3.30,
    cotaStart: '+97.66m',
    cotaEnd: '+100.00m',
    locked: true
  },
  existingStaircase2: {
    id: 'ESCALERA_2_PLANTA_ALTA',
    name: 'Escalera 2 H°A° (Sube a Planta Alta / Desk 3.90×0.80m • Costado Opuesto Eje 8–9 🔒)',
    x1: -4.87,
    z1: 5.26,
    x2: -3.84,
    z2: 8.85,
    w: 0.80,
    d: 3.90,
    cotaStart: '+100.00m',
    cotaEnd: '+102.88m',
    locked: true
  },
  voidLosa1HoyEnObra: {
    id: 'VACIO_LOSA1_38M2',
    name: 'SECTOR SIN LOSA EN OBRA: 38,00 m² (A cerrar con Loza Rap • Eje B a Eje G z=3.00..9.94m y Eje 5 a Eje 9 x=-4.87..-0.74m)',
    minX: -4.87,
    maxX: -0.74,
    minZ: 3.00,
    maxZ: 9.94,
    areaM2: 38.00
  },
  slabs: {
    subsueloBase: {
      name: 'Subsuelo (+97.66m / Ejes 9–1 y G–A) + Parrillita hacia el Patio + Lavadero + Depósito + Arranque Escalera 1 (Eje 1–2) 🔒',
      minX: -4.87,
      maxX: 4.87,
      minZ: 3.00,
      maxZ: 13.34,
      pasilloMinZ: 1.50,
      pasilloMaxZ: 3.00,
      cota: '+97.66m (Y=-2.34m • Subsuelo + Parrilla al Patio)',
      status: 'Subsuelo + Parrilla al Patio + Cámara Oxigenación 1.50m 🔒'
    },
    losaPlantaBajaExistente: {
      name: 'Losa 1 (+100.00m): Losas L1/L2/L3 (z=9.94..13.34m) y L4 (x=-0.74..+4.87m junto a Escalera 1) Macizas + Sector sin Losa 38.00 m² (Eje 5–9 / B–G a cerrar con Loza Rap) 🔒',
      minX: -4.87,
      maxX: 4.87,
      minZ: 3.00,
      maxZ: 13.34,
      galeriaMinZ: 9.94,
      galeriaMaxZ: 13.34,
      cota: '+100.00m (Galería L1 -0.45m)',
      status: 'Losas L1–L4 Hormigonadas + Sector sin Losa 38.00 m² (Ejes 5–9 a cerrar con Loza Rap) + 17 Pilares PB hasta +2.88m 🔒'
    },
    losaPlantaAltaNueva: {
      name: 'Losa 2do Piso (+102.88m • 2 Dormitorios + Escritorio/Desk al subir Escalera 2 + 2 Baños + Vestidor en Eje F–G • SIN balcón ni Blindex frontal)',
      minX: -4.87,
      maxX: 4.87,
      minZ: 3.00,
      maxZ: 13.34,
      cota: '+102.88m (Techo +105.64m)',
      status: '2do Piso: 2 Dormitorios + Desk + 2 Baños + Vestidor (Núcleo Húmedo Eje F–G) 🎯'
    }
  }
};

/**
 * 20 Pilares (`P1`..`P20`) y sus 14 Zapatas (`Z1`..`Z20`, con 6 zapatas combinadas)
 * posicionados al milímetro según `CALCULO ESTRUCTURAL L.G. FUSIONADO.pdf`.
 */
export const FIXED_COLUMNS_AND_FOOTINGS = [
  {
    index: 1,
    pilarId: 'P1',
    zapataId: 'Z1',
    combinedGroup: null,
    axisLabel: '1-A',
    x: 4.87,
    z: 13.34,
    colW: 0.15,
    colD: 0.30,
    zapW: 1.20,
    zapD: 1.20,
    zapCenterX: 4.87,
    zapCenterZ: 13.34,
    topLevel: 'techo',
    topCotaM: 5.64,
    diesInPB: false,
    rebarSpec: '6 Ø 12mm (Est. Ø6 c/16)',
    locked: true
  },
  {
    index: 2,
    pilarId: 'P2',
    zapataId: 'Z2',
    combinedGroup: null,
    axisLabel: '1-B',
    x: 4.87,
    z: 9.94,
    colW: 0.15,
    colD: 0.30,
    zapW: 1.55,
    zapD: 1.55,
    zapCenterX: 4.87,
    zapCenterZ: 9.94,
    topLevel: 'techo',
    topCotaM: 5.64,
    diesInPB: false,
    rebarSpec: '6 Ø 12mm (Est. Ø6 c/16)',
    locked: true
  },
  {
    index: 3,
    pilarId: 'P3',
    zapataId: 'Z3',
    combinedGroup: null,
    axisLabel: '1-D',
    x: 4.87,
    z: 5.26,
    colW: 0.15,
    colD: 0.30,
    zapW: 1.55,
    zapD: 1.55,
    zapCenterX: 4.87,
    zapCenterZ: 5.26,
    topLevel: 'techo',
    topCotaM: 5.64,
    diesInPB: false,
    rebarSpec: '6 Ø 12mm (Est. Ø6 c/16)',
    locked: true
  },
  {
    index: 4,
    pilarId: 'P4',
    zapataId: 'Z4',
    combinedGroup: null,
    axisLabel: '1-G',
    x: 4.87,
    z: 3.00,
    colW: 0.15,
    colD: 0.30,
    zapW: 1.10,
    zapD: 1.10,
    zapCenterX: 4.87,
    zapCenterZ: 3.00,
    topLevel: 'techo',
    topCotaM: 5.64,
    diesInPB: false,
    rebarSpec: '4 Ø 12mm (Est. Ø6 c/16)',
    locked: true
  },
  {
    index: 5,
    pilarId: 'P5',
    zapataId: 'Z10',
    combinedGroup: null,
    axisLabel: '2-B',
    x: 3.84,
    z: 9.94,
    colW: 0.20,
    colD: 0.20,
    zapW: 1.40,
    zapD: 1.40,
    zapCenterX: 3.84,
    zapCenterZ: 9.94,
    topLevel: 'planta_alta',
    topCotaM: 2.88,
    diesInPB: false,
    rebarSpec: '4 Ø 12mm (Llega a PA +2.88m)',
    locked: true
  },
  {
    index: 6,
    pilarId: 'P6',
    zapataId: 'Z11(P6-P7)',
    combinedGroup: 'Z11',
    axisLabel: '2-D',
    x: 3.84,
    z: 5.26,
    colW: 0.15,
    colD: 0.30,
    zapW: 1.35,
    zapD: 3.10,
    zapCenterX: 3.84,
    zapCenterZ: 4.13,
    topLevel: 'planta_alta',
    topCotaM: 2.88,
    diesInPB: false,
    rebarSpec: '4 Ø 12mm (Zapata Comb. Z11 P6-P7)',
    locked: true
  },
  {
    index: 7,
    pilarId: 'P7',
    zapataId: 'Z11(P6-P7)',
    combinedGroup: 'Z11',
    axisLabel: '2-G',
    x: 3.84,
    z: 3.00,
    colW: 0.15,
    colD: 0.30,
    zapW: 1.35,
    zapD: 3.10,
    zapCenterX: 3.84,
    zapCenterZ: 4.13,
    topLevel: 'techo',
    topCotaM: 5.64,
    diesInPB: false,
    rebarSpec: '4 Ø 12mm (Zapata Comb. Z11 P6-P7)',
    locked: true
  },
  {
    index: 8,
    pilarId: 'P8',
    zapataId: 'Z5(P8-P9)',
    combinedGroup: 'Z5',
    axisLabel: '4-A',
    x: 1.69,
    z: 13.34,
    colW: 0.15,
    colD: 0.30,
    zapW: 1.60,
    zapD: 4.20,
    zapCenterX: 2.04,
    zapCenterZ: 11.64,
    topLevel: 'techo',
    topCotaM: 5.64,
    diesInPB: false,
    rebarSpec: '4 Ø 12mm (Zapata Comb. Z5 P8-P9)',
    locked: true
  },
  {
    index: 9,
    pilarId: 'P9',
    zapataId: 'Z5(P8-P9)',
    combinedGroup: 'Z5',
    axisLabel: '3-B',
    x: 2.39,
    z: 9.94,
    colW: 0.20,
    colD: 0.25,
    zapW: 1.60,
    zapD: 4.20,
    zapCenterX: 2.04,
    zapCenterZ: 11.64,
    topLevel: 'techo',
    topCotaM: 5.64,
    diesInPB: false,
    rebarSpec: '4 Ø 20 + 4 Ø 12mm (Zapata Comb. Z5 P8-P9)',
    locked: true
  },
  {
    index: 10,
    pilarId: 'P10',
    zapataId: 'Z12(P10-P13)',
    combinedGroup: 'Z12',
    axisLabel: '4-F',
    x: 1.69,
    z: 3.51,
    colW: 0.20,
    colD: 0.30,
    zapW: 3.10,
    zapD: 1.90,
    zapCenterX: 0.475,
    zapCenterZ: 4.14,
    topLevel: 'techo',
    topCotaM: 5.64,
    diesInPB: false,
    rebarSpec: '8 Ø 16mm (Zapata Comb. Z12 P10-P13)',
    locked: true
  },
  {
    index: 11,
    pilarId: 'P11',
    zapataId: 'Z6(P11-P12)',
    combinedGroup: 'Z6',
    axisLabel: '6-A',
    x: -1.64,
    z: 13.34,
    colW: 0.15,
    colD: 0.30,
    zapW: 1.40,
    zapD: 6.60,
    zapCenterX: -1.64,
    zapCenterZ: 10.355,
    topLevel: 'techo',
    topCotaM: 5.64,
    diesInPB: false,
    rebarSpec: '6 Ø 12mm (Zapata Comb. Z6 P11-P12)',
    locked: true
  },
  {
    index: 12,
    pilarId: 'P12',
    zapataId: 'Z6(P11-P12)',
    combinedGroup: 'Z6',
    axisLabel: '6-C',
    x: -1.64,
    z: 7.37,
    colW: 0.15,
    colD: 0.25,
    zapW: 1.40,
    zapD: 6.60,
    zapCenterX: -1.64,
    zapCenterZ: 10.355,
    topLevel: 'planta_baja',
    topCotaM: 0.00,
    diesInPB: true,
    rebarSpec: '6 Ø 12mm (⚠️ MUERE EN PB 0.00m)',
    locked: true
  },
  {
    index: 13,
    pilarId: 'P13',
    zapataId: 'Z12(P10-P13)',
    combinedGroup: 'Z12',
    axisLabel: '5-E',
    x: -0.74,
    z: 4.77,
    colW: 0.20,
    colD: 0.20,
    zapW: 3.10,
    zapD: 1.90,
    zapCenterX: 0.475,
    zapCenterZ: 4.14,
    topLevel: 'planta_baja',
    topCotaM: 0.00,
    diesInPB: true,
    rebarSpec: '4 Ø 16mm (⚠️ MUERE EN PB 0.00m)',
    locked: true
  },
  {
    index: 14,
    pilarId: 'P14',
    zapataId: 'Z13(P14-P19)',
    combinedGroup: 'Z13',
    axisLabel: '6-F',
    x: -1.64,
    z: 3.51,
    colW: 0.15,
    colD: 0.30,
    zapW: 3.80,
    zapD: 1.95,
    zapCenterX: -3.255,
    zapCenterZ: 4.14,
    topLevel: 'techo',
    topCotaM: 5.64,
    diesInPB: false,
    rebarSpec: '6 Ø 16mm (Zapata Comb. Z13 P14-P19)',
    locked: true
  },
  {
    index: 15,
    pilarId: 'P15',
    zapataId: 'Z7(P15-P16)',
    combinedGroup: 'Z7',
    axisLabel: '8-C',
    x: -3.35,
    z: 7.37,
    colW: 0.15,
    colD: 0.25,
    zapW: 2.10,
    zapD: 3.25,
    zapCenterX: -2.685,
    zapCenterZ: 8.655,
    topLevel: 'planta_baja',
    topCotaM: 0.00,
    diesInPB: true,
    rebarSpec: '6 Ø 12mm (⚠️ MUERE EN PB 0.00m)',
    locked: true
  },
  {
    index: 16,
    pilarId: 'P16',
    zapataId: 'Z7(P15-P16)',
    combinedGroup: 'Z7',
    axisLabel: '7-B',
    x: -2.02,
    z: 9.94,
    colW: 0.20,
    colD: 0.30,
    zapW: 2.10,
    zapD: 3.25,
    zapCenterX: -2.685,
    zapCenterZ: 8.655,
    topLevel: 'planta_alta',
    topCotaM: 2.88,
    diesInPB: false,
    rebarSpec: '6 Ø 16mm (Llega a PA +2.88m)',
    locked: true
  },
  {
    index: 17,
    pilarId: 'P17',
    zapataId: 'Z8',
    combinedGroup: null,
    axisLabel: '9-A',
    x: -4.87,
    z: 13.34,
    colW: 0.15,
    colD: 0.30,
    zapW: 1.20,
    zapD: 1.20,
    zapCenterX: -4.87,
    zapCenterZ: 13.34,
    topLevel: 'techo',
    topCotaM: 5.64,
    diesInPB: false,
    rebarSpec: '4 Ø 12mm (Est. Ø6 c/16)',
    locked: true
  },
  {
    index: 18,
    pilarId: 'P18',
    zapataId: 'Z9',
    combinedGroup: null,
    axisLabel: '9-B',
    x: -4.87,
    z: 9.94,
    colW: 0.15,
    colD: 0.30,
    zapW: 1.50,
    zapD: 1.50,
    zapCenterX: -4.87,
    zapCenterZ: 9.94,
    topLevel: 'techo',
    topCotaM: 5.64,
    diesInPB: false,
    rebarSpec: '6 Ø 12mm (Est. Ø6 c/16)',
    locked: true
  },
  {
    index: 19,
    pilarId: 'P19',
    zapataId: 'Z13(P14-P19)',
    combinedGroup: 'Z13',
    axisLabel: '9-E',
    x: -4.87,
    z: 4.77,
    colW: 0.15,
    colD: 0.40,
    zapW: 3.80,
    zapD: 1.95,
    zapCenterX: -3.255,
    zapCenterZ: 4.14,
    topLevel: 'techo',
    topCotaM: 5.64,
    diesInPB: false,
    rebarSpec: '8 Ø 12mm (Sección 15x40cm • Z13)',
    locked: true
  },
  {
    index: 20,
    pilarId: 'P20',
    zapataId: 'Z14',
    combinedGroup: null,
    axisLabel: '9-G',
    x: -4.87,
    z: 3.00,
    colW: 0.15,
    colD: 0.30,
    zapW: 1.10,
    zapD: 1.10,
    zapCenterX: -4.87,
    zapCenterZ: 3.00,
    topLevel: 'techo',
    topCotaM: 5.64,
    diesInPB: false,
    rebarSpec: '4 Ø 12mm (Est. Ø6 c/16)',
    locked: true
  }
];

/**
 * Catálogo de Muros y Cerramientos Paraguayos (Propuestas editables sobre ejes reales)
 */
export const WALL_CATALOG = {
  ladrillo_15: {
    id: 'ladrillo_15',
    name: 'Ladrillo Hueco 15cm (Tabique a Construir)',
    shortName: 'Muro 15cm',
    thickness: 0.15,
    heightDefault: 2.80,
    color: '#e2e8f0',
    stroke: '#94a3b8',
    costPerM2Gs: 115000,
    revoquePerM2Gs: 55000,
    pinturaPerM2Gs: 28000,
    isGlazed: false,
    desc: 'Ladrillo cerámico hueco 6 tubos con mortero 1:5 y envarillado cada 5 hiladas.'
  },
  ladrillo_20: {
    id: 'ladrillo_20',
    name: 'Ladrillo Común 20cm (Portante/Acústico a Construir)',
    shortName: 'Muro 20cm',
    thickness: 0.20,
    heightDefault: 2.88,
    color: '#cbd5e1',
    stroke: '#64748b',
    costPerM2Gs: 165000,
    revoquePerM2Gs: 65000,
    pinturaPerM2Gs: 28000,
    isGlazed: false,
    desc: 'Mampostería de ladrillo común macizo para aislación acústica y cierre exterior.'
  },
  ciclopeo_30: {
    id: 'ciclopeo_30',
    name: 'Muro Ciclópeo / H°A° Contención 30cm',
    shortName: 'Contención 30cm',
    thickness: 0.30,
    heightDefault: 2.34,
    color: '#64748b',
    stroke: '#334155',
    costPerM2Gs: 273366,
    revoquePerM2Gs: 48000,
    pinturaPerM2Gs: 18000,
    isGlazed: false,
    desc: 'Muro de piedra bruta / mampostería armada de contención en Pórticos de Subsuelo y Cochera.'
  },
  blindex_corredizo: {
    id: 'blindex_corredizo',
    name: 'Abertura Blindex Templado 10mm Corredizo',
    shortName: 'Blindex 10mm',
    thickness: 0.08,
    heightDefault: 2.40,
    color: '#38bdf8',
    stroke: '#0284c7',
    costPerM2Gs: 750000,
    revoquePerM2Gs: 0,
    pinturaPerM2Gs: 0,
    isGlazed: true,
    desc: 'Ventanal corredizo piso-techo de vidrio templado 10mm con carpintería aluminio negro.'
  }
};

/**
 * Catálogo de Aberturas y Carpinterías (Puertas, Ventanas y Portones)
 */
export const OPENING_CATALOG = {
  puerta_madera_90: {
    id: 'puerta_madera_90',
    name: 'Puerta Placa Cedro / Lapacho 0.90×2.10m',
    width: 0.90,
    height: 2.10,
    unitCostGs: 1850000,
    category: 'Carpintería Madera'
  },
  puerta_bano_70: {
    id: 'puerta_bano_70',
    name: 'Puerta Sanitaria Hidrófuga 0.70×2.10m',
    width: 0.70,
    height: 2.10,
    unitCostGs: 1450000,
    category: 'Carpintería Madera'
  },
  blindex_galeria_340: {
    id: 'blindex_galeria_340',
    name: 'Paño Corredizo Blindex 10mm (3.40×2.40m)',
    width: 3.40,
    height: 2.40,
    unitCostGs: 6120000,
    category: 'Aluminio y Cristal'
  },
  porton_basculante_cochera: {
    id: 'porton_basculante_cochera',
    name: 'Portón Balancín Existente (2.30×2.18m Chapa Grafito Ciega) + Portoncito Peatonal Haciendo Juego (0.95×2.18m)',
    width: 2.30,
    height: 2.18,
    unitCostGs: 2650000,
    category: 'Herrería Estructural'
  }
};

/**
 * Catálogo de Nodos de Instalaciones (Hidrófugo, Pluvial y Señales Débiles)
 */
export const MEP_NODE_CATALOG = {
  cctv_poe: {
    id: 'cctv_poe',
    name: 'Cámara CCTV IP PoE 4MP',
    symbol: '📷',
    code: 'CCTV',
    color: '#ef4444',
    unitCostGs: 965000,
    category: 'Señales Débiles'
  },
  wifi_mesh: {
    id: 'wifi_mesh',
    name: 'Access Point Wi-Fi 6 Mesh Gigabit',
    symbol: '🛜',
    code: 'WIFI',
    color: '#06b6d4',
    unitCostGs: 620000,
    category: 'Señales Débiles'
  },
  cat6_rj45: {
    id: 'cat6_rj45',
    name: 'Boca de Red Cat6 RJ45 Doble / TV',
    symbol: '🔌',
    code: 'CAT6',
    color: '#3b82f6',
    unitCostGs: 185000,
    category: 'Señales Débiles'
  },
  rejilla_pluvial: {
    id: 'rejilla_pluvial',
    name: 'Rejilla Pluvial Lineal / Desagüe de Piso',
    symbol: '💧',
    code: 'REJ',
    color: '#0ea5e9',
    unitCostGs: 340000,
    category: 'Plan Hidrófugo'
  },
  bajada_pvc100: {
    id: 'bajada_pvc100',
    name: 'Caño de Bajada Pluvial PVC Ø100mm',
    symbol: '⏬',
    code: 'PVC100',
    color: '#10b981',
    unitCostGs: 290000,
    category: 'Plan Hidrófugo'
  },
  drenaje_frances: {
    id: 'drenaje_frances',
    name: 'Cámara / Tubo Drenaje Francés Ø100 + Bidim',
    symbol: '🛡️',
    code: 'DREN',
    color: '#a855f7',
    unitCostGs: 480000,
    category: 'Plan Hidrófugo'
  },
  pase_losa1_diamantado: {
    id: 'pase_losa1_diamantado',
    name: 'Pase de Losa con Sacabocado Diamantado en Losa 1 Existente (PASE #1..#4)',
    symbol: '🕳️',
    code: 'PASE',
    color: '#ec4899',
    unitCostGs: 280000,
    category: 'Pases Diamantados Losa 1'
  },
  tablero_smart_din: {
    id: 'tablero_smart_din',
    name: 'Tablero Eléctrico Inteligente Riel DIN (TP-PB 36-48 DIN / TS-PA 24 DIN / TS-SUB 12 DIN / Pilar ANDE)',
    symbol: '⚡',
    code: 'TAB-DIN',
    color: '#ef4444',
    unitCostGs: 1450000,
    category: 'Potencia y Tableros Smart'
  },
  cisterna_presurizadora: {
    id: 'cisterna_presurizadora',
    name: 'Medidor de Agua ESSAP Directo a Nivel de Calle al Costado del Portón (Sin Tanque • Buena Presión)',
    symbol: '🚰',
    code: 'M-ESSAP',
    color: '#0284c7',
    unitCostGs: 950000,
    category: 'Hidrosanitaria Directa ESSAP'
  },
  toma_20a: {
    id: 'toma_20a',
    name: 'Tomacorriente Dedicado 20A (Cable 4mm² + Tierra — AA / Air Fryer / Termocalefón / Lavarropas)',
    symbol: '🔌',
    code: '20A',
    color: '#f97316',
    unitCostGs: 165000,
    category: 'Tomacorrientes 20A'
  },
  toma_16a: {
    id: 'toma_16a',
    name: 'Tomacorriente Doble 16A Normalizado con Puesta a Tierra (Cable 2.5mm²)',
    symbol: '🔌',
    code: '16A',
    color: '#10b981',
    unitCostGs: 125000,
    category: 'Tomacorrientes 16A'
  },
  llave_zigbee_3way: {
    id: 'llave_zigbee_3way',
    name: 'Llave Inteligente Zigbee con Neutro / Conmutada 3-Way + Luz Emergencia',
    symbol: '💡',
    code: '3W-ZIG',
    color: '#38bdf8',
    unitCostGs: 135000,
    category: 'Domótica e Iluminación'
  }
};

/**
 * Normativa Municipal de Asunción (Ordenanza N° 26.104/90 - Reglamento General de Construcción)
 */
export const ASUNCION_BUILDING_CODE = {
  habitable: {
    label: 'Local Habitable (Dormitorio / Estar / Comedor / Escritorio)',
    minAreaM2: 9.0,
    minSideM: 2.50,
    minLightRatio: 0.10,
    minVentRatio: 0.05
  },
  cocina: {
    label: 'Local de Trabajo / Cocina / Kitchenette',
    minAreaM2: 5.0,
    minSideM: 1.80,
    minLightRatio: 0.08,
    minVentRatio: 0.04
  },
  bano: {
    label: 'Local Sanitario / Baño / Vestidor',
    minAreaM2: 2.20,
    minSideM: 1.10,
    minLightRatio: 0.0,
    minVentRatio: 0.04
  },
  exterior: {
    label: 'Espacio Semi-Cubierto / Cochera / Galería / Terraza',
    minAreaM2: 4.0,
    minSideM: 1.50,
    minLightRatio: 0.0,
    minVentRatio: 0.0
  }
};

/**
 * Definición de los 3 Niveles Estructurales según cotas de `CALCULO ESTRUCTURAL L.G. FUSIONADO.pdf`
 * + `estructural_e5_subsuelo_escalera.png` + `instalacion_sanitaria_agua.png`.
 */
export const LEVEL_DEFINITIONS = {
  subsuelo: {
    id: 'subsuelo',
    shortTitle: 'Nivel 0: Subsuelo (+97.66m • Parrilla al Patio + Lavadero + Depósito)',
    fullTitle: 'Nivel 0: Subsuelo (+97.66m / Y=-2.34m • Parrillita al Patio + Lavadero + Depósito + Arranque Escalera 1 Eje 8–9 🔒)',
    cota: '+97.66 m (Y = -2.34m)',
    elevationY: -2.34,
    wallHeight: 2.34,
    statusBadge: 'Parrilla en Subsuelo + Lavadero + Depósito + Escalera 1 (Eje 8–9) 🔒',
    statusColor: '#10b981',
    description: 'Subsuelo (+97.66m): Incluye la Parrillita / Quincho Inferior hacia el Patio (x=-4.87..-1.64m, z=11.50..13.34m), Lavadero, Depósito, Arranque de Escalera 1 en costado izquierdo Eje 8–9 (x=-4.87..-3.90m, z=5.26..8.56m) y Cámara de Oxigenación Frontal (z=1.50..3.00m) bajo Piso de Rejilla Metálica Electroforjada Transitable.'
  },
  planta_baja: {
    id: 'planta_baja',
    shortTitle: 'Nivel 1: Planta Baja (+100.00m • Núcleo Húmedo Eje F–G + Estar + Cocina/Comedor)',
    fullTitle: 'Nivel 1: Planta Baja (+100.00m • Baño Social y Cocina en Eje F–G + Estar Social + Escaleras 1 y 2 Opuestas + Galería L1 🔒)',
    cota: '+100.00 m (Galería +99.55m)',
    elevationY: 0.00,
    wallHeight: 2.88,
    statusBadge: '17 Pilares PB Hormigonados (+2.88m) + Hueco 38.00 m² a cerrar c/ Loza Rap 🔒',
    statusColor: '#06b6d4',
    description: 'Planta Baja (+100.00m): Cochera Frontal con Muro 100% Ciego (Portón Balancín 2.30m + Portoncito 0.95m), Pérgola de Madera con Enredadera + Techo Translúcido Antigranizo y Piso de Rejilla Metálica Electroforjada sobre cámara de oxigenación (z=1.50..3.00m). Núcleo Húmedo Frontal en Eje F–G: Baño Social (1.10×2.00m) + Cocina/Comedor (6.20×2.75m en Eje 5–9), Estar Social (4.95×4.80m en Eje 1–5), Escalera 1 (baja a Subsuelo en Eje 8–9) y Escalera 2 (sube a PA en Eje 1–2), y Galería al Río en Eje A–B sin parrilla.'
  },
  planta_alta: {
    id: 'planta_alta',
    shortTitle: 'Nivel 2: Planta Alta (+102.88m • 2 Dormitorios + Desk + 2 Baños + Vestidor)',
    fullTitle: 'Nivel 2: Planta Alta (+102.88m • Suite + Vestidor + 2 Baños sobre Eje F–G + Dormitorio 2 + Desk en Escalera 2 • SIN Balcón ni Blindex Frontal)',
    cota: '+102.88 m (Techo +105.64m)',
    elevationY: 2.88,
    wallHeight: 2.76,
    statusBadge: '2 Dormitorios + Desk + 2 Baños + Vestidor en Eje F–G (⚠️ P12/P13/P15 mueren en PB)',
    statusColor: '#f59e0b',
    description: 'Planta Alta (+102.88m): 2 Dormitorios + Escritorio/Desk al subir Escalera 2 (Eje 1–2) + 2 Baños + Vestidor. Núcleo Húmedo en Eje F–G (z=3.00..5.00m) exactamente arriba del Baño Social y Cocina de PB: Vestidor (1.55×1.80m), Baño en Suite (2.30×2.00m) y Baño 2 PA (2.30×2.00m). Frente en Eje G (z=3.00m) de mampostería SIN balcón frontal ni Blindex frontal. Hacia el río: Deck 2 / Terraza (Eje A–B).'
  }
};

/**
 * Normaliza los identificadores de presets aceptando tanto la nomenclatura nueva
 * (`hoy_en_obra`, `cierre_300m`, `opcion_1_rolon`, `opcion_2_lgrb`) como los alias previos.
 */
function normalizePresetKey(key) {
  const map = {
    hoy_en_obra: 'hoy_en_obra',
    estado_actual_obra: 'hoy_en_obra',
    cierre_300m: 'cierre_300m',
    escenario_300m: 'cierre_300m',
    opcion_1_rolon: 'opcion_1_rolon',
    opcion1_rolon: 'opcion_1_rolon',
    opcion_2_lgrb: 'opcion_2_lgrb',
    opcion2_lgrb: 'opcion_2_lgrb'
  };
  return map[key] || 'cierre_300m';
}

/**
 * Generador de Presets Arquitectónicos alineados al milímetro con los planos oficiales:
 * `CALCULO ESTRUCTURAL L.G. FUSIONADO.pdf` + `instalacion_sanitaria_agua.png` + `estructural_e5_subsuelo_escalera.png`.
 * @param {string} rawPresetKey 'hoy_en_obra' | 'cierre_300m' | 'opcion_1_rolon' | 'opcion_2_lgrb'
 */
export function createPresetPlan(rawPresetKey = 'cierre_300m') {
  const presetKey = normalizePresetKey(rawPresetKey);
  const deepClone = (obj) => JSON.parse(JSON.stringify(obj));
  const isZeroWallsState = presetKey === 'hoy_en_obra';
  const is300mStage = presetKey === 'cierre_300m';
  const activeFlag = !isZeroWallsState;
  const subsueloActive = !isZeroWallsState;
  const subsueloFullFinish = !isZeroWallsState && !is300mStage;

  // =========================================================================
  // SUBSUELO (+97.66m, Y = -2.34m):
  // - Cámara de Oxigenación Antihumedad 1.50m (z = 1.50m a 3.00m) bajo Piso de Rejilla Metálica Electroforjada Transitable
  // - Arranque Escalera 1 en costado izquierdo Eje 8–9 (x = -4.87..-3.90m, z = 5.26..8.56m)
  // - Lavadero, Depósito y Parrillita / Quincho Inferior hacia el Patio (x = -4.87..-1.64m, z = 11.50..13.34m)
  // =========================================================================
  const baseSubsuelo = {
    rooms: [
      {
        id: 'sub_pasillo_antihumedad',
        shortTitle: 'CÁMARA OXIGENACIÓN',
        subTitle: 'Rejilla Metálica • z=1.50..3.00m',
        name: 'Cámara Oxigenación Subsuelo 1.50m (Piso Rejilla Metálica Electroforjada + Rejas Laterales • z=1.50..3.00m)',
        codeType: 'exterior',
        x: -4.87,
        z: 1.50,
        w: 9.74,
        d: 1.50,
        floorCostPerM2Gs: 120000,
        equipCostGs: 2970000,
        activeStage: subsueloActive,
        color: 'rgba(16, 185, 129, 0.22)'
      },
      {
        id: 'sub_lavadero_pared_opuesta',
        shortTitle: 'LAVADERO',
        subTitle: 'Bajo Escalera 1 (+X)',
        name: 'Lavadero bajo Escalera 1 en Muro Este (Eje 1–2 x=+3.10..+4.87m, z=5.20..8.20m • Pileta + Lavarropas)',
        codeType: 'bano',
        x: 3.10,
        z: 5.20,
        w: 1.77,
        d: 3.00,
        floorCostPerM2Gs: 85000,
        equipCostGs: 2837500,
        activeStage: subsueloActive,
        color: 'rgba(6, 182, 212, 0.24)'
      },
      {
        id: 'sub_gran_salon_abierto',
        shortTitle: 'GRAN SALÓN SUBSUELO',
        subTitle: 'Planta Libre 100.7 m²',
        name: 'Gran Salón Abierto de Subsuelo ("Todo un Salón" 100.71 m² • Suelo Tierra Natural / Lecherada de Cemento)',
        codeType: 'habitable',
        x: -4.87,
        z: 3.00,
        w: 9.74,
        d: 10.34,
        floorCostPerM2Gs: 65000,
        equipCostGs: 3200000,
        activeStage: subsueloActive,
        color: 'rgba(56, 189, 248, 0.14)'
      },
      {
        id: 'sub_parrilla_quincho',
        shortTitle: 'PARRILLA / QUINCHO',
        subTitle: 'Integrada al Patio (-2.34m)',
        name: 'Parrillita / Quincho Inferior en Subsuelo hacia el Patio (x=-4.87..-1.64m, z=11.50..13.34m)',
        codeType: 'exterior',
        x: -4.87,
        z: 11.50,
        w: 3.23,
        d: 1.84,
        floorCostPerM2Gs: 125000,
        equipCostGs: 4620000,
        activeStage: subsueloActive,
        color: 'rgba(245, 158, 11, 0.24)'
      },
      {
        id: 'sub_patio_inferior',
        shortTitle: 'JARDÍN Y PATIO TRASERO',
        subTitle: 'Césped Esmeralda • Cota -2.34m',
        name: 'Patio Trasero 100% Nivelado a Suelo de Subsuelo (Y = -2.34m • Sin Desnivel • z=13.34..26.80m)',
        codeType: 'exterior',
        x: -4.87,
        z: 13.34,
        w: 9.74,
        d: 13.46,
        floorCostPerM2Gs: 58000,
        equipCostGs: 6670000,
        activeStage: subsueloActive,
        color: 'rgba(16, 185, 129, 0.14)'
      },
      {
        id: 'sub_pozo_septica_bombeo',
        shortTitle: 'CÁM. SÉPTICA + POZO',
        subTitle: '1500L + Ø1.80m (Ejes 8–9)',
        name: 'Cámara Séptica + Pozo Ciego Absorbente Autónomo (Patio Trasero Ejes 8–9 • Evita red vecinal precaria)',
        codeType: 'bano',
        x: -4.55,
        z: 14.20,
        w: 2.15,
        d: 6.50,
        floorCostPerM2Gs: 0,
        equipCostGs: 6800000,
        activeStage: subsueloActive,
        color: 'rgba(245, 158, 11, 0.28)'
      },
      {
        id: 'sub_piscina_futura',
        shortTitle: 'PISCINA 5.80×2.40m',
        subTitle: 'Reserva al Fondo (z=23.15m)',
        name: 'Piscina Transversal en el Fondo (5.80×2.40m en z=23.15..25.55m • Diseño Original Lámina 2 • Muralla al fondo en z=26.80m)',
        codeType: 'exterior',
        x: -1.25,
        z: 23.15,
        w: 5.80,
        d: 2.40,
        floorCostPerM2Gs: 0,
        equipCostGs: 0,
        activeStage: subsueloFullFinish,
        color: 'rgba(14, 165, 233, 0.28)'
      }
    ],
    walls: [
      { id: 'w_sub_muro_cont_150', type: 'ciclopeo_30', x1: -4.87, z1: 1.50, x2: 4.87, z2: 1.50, activeStage: subsueloActive, label: 'Muro Contención Estacionamiento z=+1.50m (Cámara Oxigenación 1.50m)' },
      { id: 'w_sub_frente_g', type: 'ladrillo_20', x1: -4.87, z1: 3.00, x2: 4.87, z2: 3.00, activeStage: subsueloActive, label: 'Muro Frontal Subsuelo Eje G (z=3.00m)' },
      { id: 'w_sub_cont_9', type: 'ciclopeo_30', x1: -4.87, z1: 1.50, x2: -4.87, z2: 13.34, activeStage: subsueloActive, label: 'Muro Oeste Eje 9 (Parrillita y Salida a Cámara Séptica)' },
      { id: 'w_sub_cont_1', type: 'ciclopeo_30', x1: 4.87, z1: 1.50, x2: 4.87, z2: 13.34, activeStage: subsueloActive, label: 'Muro Este Eje 1 (Junto a Escalera 1 existente y Lavadero)' },
      { id: 'w_sub_muralla_fondo', type: 'ladrillo_20', x1: -4.87, z1: 26.80, x2: 4.87, z2: 26.80, activeStage: true, label: 'Muralla de Fondo del Lote en z=26.80m (Detrás de la Piscina)' }
    ],
    mepNodes: isZeroWallsState ? [] : [
      { id: 'm_sub_dren1', type: 'drenaje_frances', x: -4.50, z: 2.75, label: 'Drenaje Francés Frontal hacia Calle Guillermo Arias' },
      { id: 'm_sub_dren2', type: 'drenaje_frances', x: 4.50,  z: 2.75, label: 'Colector Pluvial Este hacia Calle Guillermo Arias' },
      { id: 'm_sub_bomba_cloaca', type: 'bajada_pvc100', x: -3.25, z: 16.55, label: 'Cámara Séptica + Pozo Ciego Autónomo en Patio Trasero' },
      { id: 'm_sub_cctv1', type: 'cctv_poe',        x: 0.00,  z: 13.30, label: 'Cámara Contrafrente Subsuelo y Patio (Viga Eje A z=13.30m)' },
      { id: 'm_sub_wifi1', type: 'wifi_mesh',       x: 0.00,  z: 8.50,  label: 'AP Mesh Gran Salón Subsuelo' }
    ]
  };

  // =========================================================================
  // PLANTA BAJA OFICIAL (+100.00m):
  // - Lado Este (x = -0.74m..+4.87m, Losa Maciza L4):
  //   * Baño Social / SSHH (x = -0.74m..+0.95m, z = 3.00m..4.77m)
  //   * Cocina Integrada + Isla + Comedor (x = -0.74m..+3.84m, z = 3.00m..9.94m)
  //   * Acceso de Servicio y Escalera 1 a Subsuelo (x = +3.84m..+4.87m, z = 3.00m..8.80m)
  // - Lado Oeste (x = -4.87m..-0.74m, Sector sin losa 38m² Loza Rap):
  //   * Estar Social / Living Principal (x = -4.87m..-0.74m, z = 3.00m..9.94m) + Escalera 2 a PA (x = -4.87m..-3.84m)
  // =========================================================================
  const buildPlantaBajaRooms = (prefix) => [
    {
      id: `${prefix}_cochera`,
      shortTitle: 'COCHERA Y PÉRGOLA',
      subTitle: 'Portón 2.30m + Rejilla Oxig.',
      name: 'Cochera Frontal (Portoncito Peatonal 0.95m • Portón Balancín 2.30m • Pérgola Antigranizo • Rejilla Oxigenación z=1.50..3.00m)',
      codeType: 'exterior',
      x: -4.87,
      z: -4.00,
      w: 9.74,
      d: 7.00,
      floorCostPerM2Gs: 140000,
      equipCostGs: 14500000,
      activeStage: activeFlag,
      color: 'rgba(16, 185, 129, 0.20)'
    },
    {
      id: `${prefix}_acceso_servicio_esc1`,
      shortTitle: 'ESC. 1 SERVICIO',
      subTitle: 'Baja a Subsuelo (+X)',
      name: 'Acceso de Servicio y Escalera 1 a Subsuelo (Eje 1–2 x=+3.84..+4.87m • Puerta Exterior z=3.00m + Puerta Interior x=3.84m)',
      codeType: 'exterior',
      x: 3.84,
      z: 3.00,
      w: 1.03,
      d: 5.80,
      floorCostPerM2Gs: 150000,
      equipCostGs: 2400000,
      activeStage: activeFlag,
      color: 'rgba(14, 165, 233, 0.24)'
    },
    {
      id: `${prefix}_bano_social`,
      shortTitle: 'BAÑO SOCIAL',
      subTitle: 'Eje F–G (Losa L4)',
      name: 'Baño Social / SSHH (1.69m × 1.77m • Núcleo Húmedo Frontal Eje F–G sobre Losa Maciza L4 • x=-0.74..+0.95m, z=3.00..4.77m)',
      codeType: 'bano',
      x: -0.74,
      z: 3.00,
      w: 1.69,
      d: 1.77,
      floorCostPerM2Gs: 195000,
      equipCostGs: 4200000,
      activeStage: activeFlag,
      color: 'rgba(56, 189, 248, 0.26)'
    },
    {
      id: `${prefix}_cocina_comedor`,
      shortTitle: 'COCINA Y COMEDOR',
      subTitle: 'Sobre Losa Maciza L4 (Este)',
      name: 'Cocina Integrada con Isla y Comedor (4.58m × 6.94m • Sector Este Eje 2 a Eje 5 sobre Losa Maciza L4 + Pases #1..#4)',
      codeType: 'cocina',
      x: -0.74,
      z: 3.00,
      w: 4.58,
      d: 6.94,
      floorCostPerM2Gs: 185000,
      equipCostGs: 8500000,
      activeStage: activeFlag,
      color: 'rgba(245, 158, 11, 0.20)'
    },
    {
      id: `${prefix}_estar_social`,
      shortTitle: isZeroWallsState ? 'SIN LOSA: 38 m²' : 'ESTAR SOCIAL',
      subTitle: isZeroWallsState ? 'A cerrar c/ Loza Rap' : 'Sobre Loza Rap 38 m² (Oeste)',
      name: isZeroWallsState
        ? 'SECTOR SIN LOSA EN OBRA: 38,00 m² (A cerrar con Loza Rap • Cuadrante Oeste Eje 5 a Eje 9 / Eje B a Eje G)'
        : 'Estar Social / Living Principal (4.13m × 6.94m • Sector Oeste Eje 5 a Eje 9 sobre Loza Rap 38.00 m² + Escalera 2 a PA)',
      codeType: 'habitable',
      x: -4.87,
      z: 3.00,
      w: 4.13,
      d: 6.94,
      floorCostPerM2Gs: 185000,
      equipCostGs: 7800000,
      activeStage: activeFlag,
      color: 'rgba(6, 182, 212, 0.22)'
    },
    {
      id: `${prefix}_galeria_rio`,
      shortTitle: 'GALERÍA PANORÁMICA L1',
      subTitle: 'Vista al Río Paraguay (-0.45m)',
      name: 'Galería al Río (3.40m × 9.74m • Eje A–B z=9.94..13.34m • Sin Parrilla — Parrilla en Subsuelo)',
      codeType: 'exterior',
      x: -4.87,
      z: 9.94,
      w: 9.74,
      d: 3.40,
      floorCostPerM2Gs: 180000,
      equipCostGs: 4620000,
      activeStage: activeFlag,
      color: 'rgba(16, 185, 129, 0.22)'
    }
  ];

  const buildPlantaBajaWalls = (wPrefix) => [
    { id: `${wPrefix}_muro_ciego_calle`, type: 'ladrillo_20', x1: -4.87, z1: -4.00, x2: 4.87, z2: -4.00, activeStage: activeFlag, label: 'Muro Frontal Ciego (z=-4.00m • Portón Balancín 2.30m y Portoncito 0.95m)' },
    { id: `${wPrefix}_frente_g`, type: 'ladrillo_20', x1: -4.87, z1: 3.00, x2: 4.87, z2: 3.00, activeStage: activeFlag, label: 'Fachada Frontal Eje G (z=3.00m • Puerta Principal + Puerta Exterior de Servicio en x=+4.35m)' },
    { id: `${wPrefix}_oeste_9`,  type: 'ladrillo_15', x1: -4.87, z1: 3.00, x2: -4.87, z2: 9.94, activeStage: activeFlag, label: 'Muro Medianero Oeste Eje 9 (Costado Escalera 2 que sube a Planta Alta)' },
    { id: `${wPrefix}_este_1`,   type: 'ladrillo_15', x1: 4.87,  z1: 3.00, x2: 4.87,  z2: 9.94, activeStage: activeFlag, label: 'Muro Medianero Este Eje 1 (Costado Escalera 1 existente que baja a Subsuelo)' },
    { id: `${wPrefix}_bano_soc_s`, type: 'ladrillo_15', x1: -0.74, z1: 4.77, x2: 0.95, z2: 4.77, activeStage: activeFlag, label: 'Cerramiento Sur Baño Social SSHH (z=4.77m • Eje E sobre Losa Maciza L4)' },
    { id: `${wPrefix}_bano_soc_e`, type: 'ladrillo_15', x1: 0.95,  z1: 3.00, x2: 0.95, z2: 4.77, activeStage: activeFlag, label: 'Divisorio Baño Social / Cocina con PASE #3 y PASE #4 (x=+0.95m)' },
    { id: `${wPrefix}_bano_soc_o`, type: 'ladrillo_15', x1: -0.74, z1: 3.00, x2: -0.74, z2: 4.77, activeStage: activeFlag, label: 'Cerramiento Oeste Baño Social en Eje 5 (x=-0.74m)' },
    { id: `${wPrefix}_esc1_caja`,  type: 'ladrillo_15', x1: 3.84,  z1: 3.00, x2: 3.84,  z2: 8.80, activeStage: activeFlag, label: 'Tabique y Puerta Interior de Acceso a Escalera 1 de Servicio (Eje 2 x=+3.84m)' },
    { id: `${wPrefix}_esc2_caja`,  type: 'ladrillo_15', x1: -3.84, z1: 5.26, x2: -3.84, z2: 8.85, activeStage: activeFlag, label: 'Baranda Escalera 2 que sube a Planta Alta (Eje 8 x=-3.84m)' },
    { id: `${wPrefix}_blindex_b`,  type: 'blindex_corredizo', x1: -3.84, z1: 9.94, x2: 3.84, z2: 9.94, activeStage: activeFlag, label: 'Ventanal Corredizo Eje B hacia Galería al Río' },
    { id: `${wPrefix}_baranda_a`,  type: 'blindex_corredizo', x1: -4.87, z1: 13.34, x2: 4.87, z2: 13.34, activeStage: activeFlag, label: 'Baranda Borde Galería al Río Eje A' }
  ];

  // =========================================================================
  // PLANTA ALTA OFICIAL (+102.88m):
  // =========================================================================
  const buildPlantaAltaRooms = (prefix) => [
    {
      id: `${prefix}_bano_2`,
      shortTitle: 'SSHH 2 (PA)',
      subTitle: 'Baño Planta Alta',
      name: 'SSHH 2 / Baño Planta Alta (2.19m × 1.85m • Núcleo Húmedo Eje F–G • x=-3.84..-1.65m, z=3.00..4.85m)',
      codeType: 'bano',
      x: -3.84,
      z: 3.00,
      w: 2.19,
      d: 1.85,
      floorCostPerM2Gs: 195000,
      equipCostGs: 5400000,
      activeStage: activeFlag,
      color: 'rgba(6, 182, 212, 0.22)'
    },
    {
      id: `${prefix}_bano_suite`,
      shortTitle: 'BAÑO EN SUITE',
      subTitle: 'Arriba de Baño Social PB',
      name: 'Baño en Suite Privado (2.80m × 1.85m • Núcleo Húmedo Eje F–G arriba de Baño Social PB • x=-1.65..+1.15m, z=3.00..4.85m)',
      codeType: 'bano',
      x: -1.65,
      z: 3.00,
      w: 2.80,
      d: 1.85,
      floorCostPerM2Gs: 195000,
      equipCostGs: 6800000,
      activeStage: activeFlag,
      color: 'rgba(16, 185, 129, 0.22)'
    },
    {
      id: `${prefix}_vestidor_suite`,
      shortTitle: 'VESTIDOR SUITE',
      subTitle: 'Placares en U (+X)',
      name: 'Vestidor en Suite Independiente en U (3.72m × 1.85m • Eje F–G • x=+1.15..+4.87m, z=3.00..4.85m)',
      codeType: 'bano',
      x: 1.15,
      z: 3.00,
      w: 3.72,
      d: 1.85,
      floorCostPerM2Gs: 185000,
      equipCostGs: 3600000,
      activeStage: activeFlag,
      color: 'rgba(56, 189, 248, 0.20)'
    },
    {
      id: `${prefix}_pasillo_distribuidor`,
      shortTitle: 'PASILLO PA',
      subTitle: 'Circulación 1.15m',
      name: 'Pasillo Distribuidor de Planta Alta (Ancho libre 1.15m • Conecta Escalera 2, Desk, SSHH 2, Dormitorio 2 y Suite)',
      codeType: 'habitable',
      x: -3.84,
      z: 4.85,
      w: 4.14,
      d: 1.15,
      floorCostPerM2Gs: 180000,
      equipCostGs: 0,
      activeStage: activeFlag,
      color: 'rgba(148, 163, 184, 0.20)'
    },
    {
      id: `${prefix}_escritorio_desk`,
      shortTitle: 'ESCRITORIO EXTENDIDO',
      subTitle: 'Home-Office hasta Eje A (-X)',
      name: 'Escritorio / Desk Extendido hasta Galería Eje A (3.07m × 7.34m • x=-4.87..-1.80m, z=6.00..13.34m)',
      codeType: 'habitable',
      x: -4.87,
      z: 6.00,
      w: 3.07,
      d: 7.34,
      floorCostPerM2Gs: 180000,
      equipCostGs: 4800000,
      activeStage: activeFlag,
      color: 'rgba(56, 189, 248, 0.20)'
    },
    {
      id: `${prefix}_dorm_2`,
      shortTitle: 'DORMITORIO 2',
      subTitle: 'Centro PA',
      name: 'Dormitorio 2 (2.10m × 3.94m • Centro x=-1.80..+0.30m, z=6.00..9.94m)',
      codeType: 'habitable',
      x: -1.80,
      z: 6.00,
      w: 2.10,
      d: 3.94,
      floorCostPerM2Gs: 185000,
      equipCostGs: 6400000,
      activeStage: activeFlag,
      color: 'rgba(245, 158, 11, 0.20)'
    },
    {
      id: `${prefix}_master_suite`,
      shortTitle: 'SUITE PRINCIPAL',
      subTitle: 'Ruth & Leo (+X)',
      name: 'Dormitorio Principal en Suite Armado (4.57m × 5.09m • x=+0.30..+4.87m, z=4.85..9.94m + Baño en Suite + Vestidor)',
      codeType: 'habitable',
      x: 0.30,
      z: 4.85,
      w: 4.57,
      d: 5.09,
      floorCostPerM2Gs: 190000,
      equipCostGs: 9800000,
      activeStage: activeFlag,
      color: 'rgba(168, 85, 247, 0.22)'
    },
    {
      id: `${prefix}_terraza_rio`,
      shortTitle: 'TERRAZA / DECK 2',
      subTitle: 'Mirador al Río (+2.88m)',
      name: 'Deck 2 / Terraza al Río (6.67m × 3.40m • x=-1.80..+4.87m, z=9.94..13.34m)',
      codeType: 'exterior',
      x: -1.80,
      z: 9.94,
      w: 6.67,
      d: 3.40,
      floorCostPerM2Gs: 175000,
      equipCostGs: 4620000,
      activeStage: activeFlag,
      color: 'rgba(16, 185, 129, 0.20)'
    }
  ];

  const buildPlantaAltaWalls = (wPrefix) => [
    { id: `${wPrefix}_frente_g`, type: 'ladrillo_20', x1: -4.87, z1: 3.00, x2: 4.87,  z2: 3.00, activeStage: activeFlag, label: 'Muro Frontal Mampostería PA en Eje G (z=3.00m • SIN Balcón ni Blindex Frontal)' },
    { id: `${wPrefix}_oeste_9`,  type: 'ladrillo_15', x1: -4.87, z1: 3.00, x2: -4.87, z2: 13.34, activeStage: activeFlag, label: 'Muro Exterior PA Oeste Eje 9 Extendido hasta Eje A (Escalera 2 y Escritorio/Desk)' },
    { id: `${wPrefix}_este_1`,   type: 'ladrillo_15', x1: 4.87,  z1: 3.00, x2: 4.87,  z2: 9.94, activeStage: activeFlag, label: 'Muro Exterior PA Este Eje 1 (Vestidor y Dormitorio Principal en Suite)' },
    { id: `${wPrefix}_pasillo_sur`, type: 'ladrillo_15', x1: -3.84, z1: 4.85, x2: 4.87, z2: 4.85, activeStage: activeFlag, label: 'Muro Continuo z=4.85m (Cierra SSHH 2 hacia Pasillo y cierra Baño en Suite + Vestidor hacia la Suite)' },
    { id: `${wPrefix}_pasillo_norte`, type: 'ladrillo_15', x1: -1.80, z1: 6.00, x2: 0.30, z2: 6.00, activeStage: activeFlag, label: 'Muro Norte Pasillo Distribuidor (z=6.00m • Acceso a Dormitorio 2)' },
    { id: `${wPrefix}_sshh2_o`, type: 'ladrillo_15', x1: -3.84, z1: 3.00, x2: -3.84, z2: 4.85, activeStage: activeFlag, label: 'Cierre Oeste SSHH 2 junto a Escalera 2 (x=-3.84m)' },
    { id: `${wPrefix}_sshh2_suite`, type: 'ladrillo_15', x1: -1.65, z1: 3.00, x2: -1.65, z2: 4.85, activeStage: activeFlag, label: 'Divisorio SSHH 2 / Baño en Suite (x=-1.65m)' },
    { id: `${wPrefix}_bano_vestidor`, type: 'ladrillo_15', x1: 1.15, z1: 3.00, x2: 1.15, z2: 4.85, activeStage: activeFlag, label: 'Divisorio Baño en Suite / Vestidor en Suite (x=+1.15m)' },
    { id: `${wPrefix}_desk_dorm2`, type: 'ladrillo_15', x1: -1.80, z1: 6.00, x2: -1.80, z2: 13.34, activeStage: activeFlag, label: 'Muro Este Escritorio-Desk Extendido hasta Eje A (x=-1.80m • Separa Dormitorio 2 y Deck 2)' },
    { id: `${wPrefix}_dorm2_suite`, type: 'ladrillo_15', x1: 0.30, z1: 4.85, x2: 0.30, z2: 9.94, activeStage: activeFlag, label: 'Divisorio Dormitorio 2 y Pasillo / Dormitorio Principal en Suite (x=+0.30m)' },
    { id: `${wPrefix}_blindex_desk_a`, type: 'blindex_corredizo', x1: -4.87, z1: 13.34, x2: -1.80, z2: 13.34, activeStage: activeFlag, label: 'Ventanal Blindex Extremo Norte Escritorio / Desk sobre Eje A (z=13.34m)' },
    { id: `${wPrefix}_blindex_b`, type: 'blindex_corredizo', x1: -1.80, z1: 9.94, x2: 4.87, z2: 9.94, activeStage: activeFlag, label: 'Ventanal PA Eje B (Dormitorio 2 y Suite) hacia Deck 2 / Terraza al Río' },
    { id: `${wPrefix}_baranda_a`, type: 'blindex_corredizo', x1: -1.80, z1: 13.34, x2: 4.87, z2: 13.34, activeStage: activeFlag, label: 'Baranda Terraza al Río Deck 2 sobre Eje A (x=-1.80..+4.87m)' }
  ];

  // =========================================================================
  // PRESET 1 & 2: OPCIÓN 1 (ARQ. ROLÓN) Y HOY EN OBRA (0 MUROS + HUECO 38.00 m²)
  // =========================================================================
  if (presetKey === 'opcion_1_rolon' || presetKey === 'hoy_en_obra') {
    return {
      presetId: presetKey,
      presetName: isZeroWallsState
        ? 'Hoy en Obra: 17 Pilares PB Hormigonados (+2.88m) + Losas L1–L4 + Hueco Abierto 38.00 m² en Losa 1 (A cerrar c/ Loza Rap)'
        : 'Opción 1: Arq. Gabriela Rolón (Núcleo Húmedo Eje F–G + 2 Dormitorios y Desk en PA + Parrilla en Subsuelo)',
      levels: {
        subsuelo: deepClone(baseSubsuelo),
        planta_baja: {
          rooms: buildPlantaBajaRooms('pb'),
          walls: buildPlantaBajaWalls('w_pb'),
          mepNodes: isZeroWallsState ? [] : [
            { id: 'm_pb_cctv_calle', type: 'cctv_poe',        x: -4.65, z: -1.65, label: 'CCTV Portón Balancín Guillermo Arias' },
            { id: 'm_pb_cctv_gal',   type: 'cctv_poe',        x: 4.65,  z: 13.10, label: 'CCTV Galería Río (P1 Eje 1-A)' },
            { id: 'm_pb_wifi_estar', type: 'wifi_mesh',       x: 1.00,  z: 7.37,  label: 'Wi-Fi 6 Estar Social' },
            { id: 'm_pb_cat6_tv',    type: 'cat6_rj45',       x: -0.74, z: 7.37,  label: 'Boca Cat6 Smart TV Estar' },
            { id: 'm_pb_rej_coch',   type: 'rejilla_pluvial', x: 0.00,  z: 2.25,  label: 'Piso Rejilla Metálica Electroforjada Cámara Oxigenación (z=1.50..3.00m)' },
            { id: 'm_pb_pvc_gal',    type: 'bajada_pvc100',   x: -1.60, z: 3.30,  label: 'Columna Montante y Bajada Pluvial/Cloacal Núcleo Eje F–G' }
          ]
        },
        planta_alta: {
          rooms: buildPlantaAltaRooms('pa'),
          walls: buildPlantaAltaWalls('w_pa'),
          mepNodes: isZeroWallsState ? [] : [
            { id: 'm_pa_wifi',       type: 'wifi_mesh',       x: 2.40,  z: 8.20,  label: 'AP Wi-Fi 6 Escritorio / Desk PA (Desembarco Escalera 2)' },
            { id: 'm_pa_cat6_suite', type: 'cat6_rj45',       x: -3.20, z: 7.50,  label: 'Boca Red Cat6 Dormitorio Suite PA' },
            { id: 'm_pa_rej_terr',   type: 'rejilla_pluvial', x: 0.00,  z: 13.00, label: 'Desagüe Deck 2 / Terraza Eje A' },
            { id: 'm_pa_pvc_1',      type: 'bajada_pvc100',   x: -1.60, z: 3.30,  label: 'Columna Sanitaria y Pluvial Vertical Eje F–G (Baño Suite + Baño 2 PA)' }
          ]
        }
      }
    };
  }

  // =========================================================================
  // PRESET 3: OPCIÓN 2 (LG-RB ALINEADO A PLANOS OFICIALES EJE F-G + LOZA RAP 38 m²)
  // =========================================================================
  if (presetKey === 'opcion_2_lgrb') {
    return {
      presetId: 'opcion_2_lgrb',
      presetName: 'Opción 2: LG-RB (Cierre Loza Rap 38.00 m² + Núcleo Húmedo Eje F–G + 2 Dormitorios y Desk PA + Parrilla Subsuelo)',
      levels: {
        subsuelo: deepClone(baseSubsuelo),
        planta_baja: {
          rooms: buildPlantaBajaRooms('pb2'),
          walls: buildPlantaBajaWalls('w2_pb'),
          mepNodes: [
            { id: 'm2_pb_cctv1',  type: 'cctv_poe',        x: -4.65, z: -1.65, label: 'CCTV Portón Balancín 2.30m' },
            { id: 'm2_pb_cctv2',  type: 'cctv_poe',        x: 4.65,  z: 13.10, label: 'CCTV Galería Río (P1)' },
            { id: 'm2_pb_wifi1',  type: 'wifi_mesh',       x: 1.69,  z: 6.50,  label: 'AP Wi-Fi 6 Estar Social (Eje 4)' },
            { id: 'm2_pb_cat6_1', type: 'cat6_rj45',       x: -1.64, z: 3.51,  label: 'Núcleo Húmedo Eje F–G (Baño Social + Bacha Cocina)' },
            { id: 'm2_pb_cat6_2', type: 'cat6_rj45',       x: -0.74, z: 7.37,  label: 'Boca Cat6 Living/Comedor (Eje 5-C)' },
            { id: 'm2_pb_rej1',   type: 'rejilla_pluvial', x: 0.00,  z: 2.25,  label: 'Rejilla Metálica Electroforjada sobre Cámara Oxigenación (z=1.50..3.00m)' }
          ]
        },
        planta_alta: {
          rooms: buildPlantaAltaRooms('pa2'),
          walls: buildPlantaAltaWalls('w2_pa'),
          mepNodes: [
            { id: 'm2_pa_wifi', type: 'wifi_mesh',     x: 2.50, z: 8.20,  label: 'AP Mesh Escritorio / Desk PA (Escalera 2)' },
            { id: 'm2_pa_pvc',  type: 'bajada_pvc100', x: -1.60, z: 3.30, label: 'Bajadas Sanitarias y Pluviales Eje F–G (Baño Suite + Baño 2)' }
          ]
        }
      }
    };
  }

  // =========================================================================
  // PRESET 4 (DEFAULT): PROYECTO RUTH & LEO (cierre_300m ALINEADO A PLANOS OFICIALES)
  // =========================================================================
  return {
    presetId: 'cierre_300m',
    presetName: 'Proyecto Ruth & Leo: PA 2 Dormitorios + Desk + 2 Baños/Vestidor (Eje F–G) • PB Baño Social + Cocina/Comedor + Estar • Subsuelo Parrilla/Lavadero',
    levels: {
      subsuelo: deepClone(baseSubsuelo),
      planta_baja: {
        rooms: buildPlantaBajaRooms('pb3'),
        walls: buildPlantaBajaWalls('w3_pb'),
        mepNodes: [
          { id: 'm3_pb_cctv1', type: 'cctv_poe',        x: -4.65, z: -1.65, label: 'CCTV Calle Guillermo Arias (Portón Balancín 2.30m)' },
          { id: 'm3_pb_cat6',  type: 'cat6_rj45',       x: -0.74, z: 7.37,  label: 'Punto Red Cat6 TV Sala Estar' },
          { id: 'm3_pb_dren',  type: 'drenaje_frances', x: 0.00,  z: 2.25,  label: 'Piso Rejilla Metálica Electroforjada + Cámara Oxigenación (z=1.50..3.00m)' },
          { id: 'm3_pb_pvc',   type: 'bajada_pvc100',   x: -1.60, z: 3.30,  label: 'Columna Vertical Desagües Núcleo Húmedo Eje F–G' }
        ]
      },
      planta_alta: {
        rooms: buildPlantaAltaRooms('pa3'),
        walls: buildPlantaAltaWalls('w3_pa'),
        mepNodes: [
          { id: 'm3_pa_rej', type: 'rejilla_pluvial', x: 0.00,  z: 13.10, label: 'Embudo Pluvial Deck 2 / Terraza (Eje A)' },
          { id: 'm3_pa_pvc', type: 'bajada_pvc100',   x: -1.60, z: 3.30,  label: 'Columna Vertical Eje F–G (Baño Suite + Vestidor + Baño 2 PA)' }
        ]
      }
    }
  };
}

/**
 * Mapa exportado de todos los Presets Arquitectónicos (`PLAN_PRESETS`) con coordenadas exactas.
 * Incluye tanto las claves canónicas solicitadas (`hoy_en_obra`, `cierre_300m`, `opcion_1_rolon`, `opcion_2_lgrb`)
 * como sus alias de compatibilidad.
 */
export const PLAN_PRESETS = {
  hoy_en_obra: createPresetPlan('hoy_en_obra'),
  cierre_300m: createPresetPlan('cierre_300m'),
  opcion_1_rolon: createPresetPlan('opcion_1_rolon'),
  opcion_2_lgrb: createPresetPlan('opcion_2_lgrb'),
  // Alias de compatibilidad hacia atrás
  estado_actual_obra: createPresetPlan('hoy_en_obra'),
  escenario_300m: createPresetPlan('cierre_300m'),
  opcion1_rolon: createPresetPlan('opcion_1_rolon'),
  opcion2_lgrb: createPresetPlan('opcion_2_lgrb')
};

/**
 * Clase Principal: FloorplanEditor
 * Renderiza la interfaz CAD/BIM 2D de alta densidad y gestiona la sincronización en tiempo real.
 */
export class FloorplanEditor {
  /**
   * @param {HTMLElement|string} containerOrSelector Contenedor DOM donde montar el editor
   * @param {Object} options Opciones de configuración y callbacks
   * @param {Function} [options.onPlanChanged] Callback(planState) invocado en cada cambio
   * @param {Object} [options.scene] Instancia opcional de ProjectScene (scene.js) para sincronización 3D directa
   */
  constructor(containerOrSelector, options = {}) {
    this.container = typeof containerOrSelector === 'string'
      ? document.querySelector(containerOrSelector)
      : containerOrSelector;

    if (!this.container) {
      throw new Error('FloorplanEditor: No se encontró el contenedor DOM especificado.');
    }

    this.onPlanChanged = options.onPlanChanged || null;
    this.sceneRef = options.scene || options.sceneInstance || null;

    // Estado de visualización y herramientas
    this.currentLevel = 'planta_baja'; // 'subsuelo', 'planta_baja', 'planta_alta'
    this.activeTool = 'select';        // 'select', 'add_wall', 'add_mep', 'delete'
    this.selectedWallType = 'ladrillo_15';
    this.selectedMepType = 'cctv_poe';
    this.snapStep = 0.15;              // Paso de grilla magnética (0.10m o 0.15m)
    this.snapToPillars = true;         // Imán prioritario a pilares P1..P20 y ejes 1..9 / A..G
    this.theme = 'dark_cad';           // 'dark_cad', 'blueprint', 'white_paper'
    this.bankColorMode = false;        // Modo Colores Normativos del Banco (Negro / Verde / Rojo / Amarillo)
    this.showConduitsAndOutlets = true; // Mostrar por defecto los 4 Pases Diamantados en Losa 1, Tableros Smart DIN, Ductos y 26 Enchufes/Llaves

    // Costo estructural base: Losa 2do piso (+102.88m) + Techo (+105.64m) + Contención cochera + Hidrófugo base
    this.includeNewSlab2AndRoof = true;
    this.structuralCoreCostGs = 145920000;

    // Interacción en Canvas
    this.selectedElement = null; // { kind: 'wall'|'room'|'mep'|'pillar'|'stair', item: Object }
    this.dragState = null;
    this.tempWallStart = null;
    this.hoverWorldPos = { x: 0, z: 8, snappedToPillar: null };

    // Transformación de vista (Zoom y Paneo)
    this.zoom = 24;
    this.panX = 0;
    this.panY = 0;

    // Cargar desde localStorage (v4) o inicializar Preset Cierre 300M
    this.planData = this.loadFromStorage() || createPresetPlan('cierre_300m');

    this.injectStyles();
    this.buildDOM();
    this.setupCanvasEvents();
    this.resizeCanvas();

    window.addEventListener('resize', () => this.resizeCanvas());

    // Emitir estado inicial y sincronizar 3D
    this.recalculateAndNotify();
  }

  /**
   * Inyecta estilos CSS encapsulados para el editor CAD/BIM
   */
  injectStyles() {
    if (document.getElementById('bim-floorplan-editor-styles')) return;
    const style = document.createElement('style');
    style.id = 'bim-floorplan-editor-styles';
    style.textContent = `
      .fpe-root {
        display: flex;
        flex-direction: column;
        gap: 10px;
        width: 100%;
        color: #f8fafc;
        font-family: 'Inter', system-ui, sans-serif;
        user-select: none;
      }
      .fpe-reality-banner {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        padding: 10px 14px;
        border-radius: 10px;
        background: linear-gradient(90deg, rgba(6,182,212,0.16), rgba(245,158,11,0.14));
        border: 1px solid rgba(6,182,212,0.4);
        font-size: 11.5px;
      }
      .fpe-reality-steps {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        align-items: center;
      }
      .fpe-step-pill {
        padding: 3px 8px;
        border-radius: 999px;
        font-weight: 600;
        font-size: 10.5px;
        display: inline-flex;
        align-items: center;
        gap: 4px;
      }
      .fpe-step-pill.done {
        background: rgba(16,185,129,0.2);
        border: 1px solid rgba(16,185,129,0.5);
        color: #6ee7b7;
      }
      .fpe-step-pill.now {
        background: rgba(245,158,11,0.22);
        border: 1px solid rgba(245,158,11,0.6);
        color: #fde68a;
      }
      .fpe-step-pill.progressive {
        background: rgba(56,189,248,0.2);
        border: 1px solid rgba(56,189,248,0.5);
        color: #7dd3fc;
      }
      .fpe-top-controls {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        justify-content: space-between;
        align-items: center;
        background: rgba(15, 23, 42, 0.85);
        border: 1px solid rgba(148, 163, 184, 0.2);
        padding: 8px 12px;
        border-radius: 10px;
      }
      .fpe-btn-group {
        display: flex;
        flex-wrap: wrap;
        gap: 5px;
        align-items: center;
      }
      .fpe-btn {
        background: rgba(30, 41, 59, 0.9);
        color: #cbd5e1;
        border: 1px solid rgba(148, 163, 184, 0.25);
        padding: 6px 10px;
        border-radius: 7px;
        font-size: 11px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.15s ease;
        display: inline-flex;
        align-items: center;
        gap: 5px;
      }
      .fpe-btn:hover {
        background: rgba(51, 65, 85, 0.95);
        color: #fff;
        border-color: rgba(56, 189, 248, 0.5);
      }
      .fpe-btn.active {
        background: rgba(6, 182, 212, 0.25);
        color: #67e8f9;
        border-color: #06b6d4;
        box-shadow: 0 0 10px rgba(6, 182, 212, 0.25);
      }
      .fpe-btn.gold.active, .fpe-btn.gold:hover {
        background: rgba(245, 158, 11, 0.25);
        color: #fde68a;
        border-color: #f59e0b;
      }
      .fpe-select {
        background: #0f172a;
        color: #e2e8f0;
        border: 1px solid rgba(148, 163, 184, 0.35);
        border-radius: 6px;
        padding: 5px 8px;
        font-size: 11px;
        font-weight: 600;
      }
      .fpe-workspace {
        display: grid;
        grid-template-columns: 1fr 355px;
        gap: 12px;
        min-height: 540px;
      }
      @media (max-width: 980px) {
        .fpe-workspace {
          grid-template-columns: 1fr;
        }
      }
      .fpe-canvas-wrap {
        position: relative;
        background: #040914;
        border: 1px solid rgba(56, 189, 248, 0.3);
        border-radius: 12px;
        overflow: hidden;
        min-height: 520px;
        display: flex;
        flex-direction: column;
      }
      .fpe-canvas {
        width: 100%;
        height: 100%;
        min-height: 500px;
        display: block;
        cursor: crosshair;
      }
      .fpe-canvas-hud {
        position: absolute;
        top: 10px;
        left: 10px;
        right: 10px;
        display: flex;
        justify-content: space-between;
        pointer-events: none;
        gap: 8px;
      }
      .fpe-hud-pill {
        pointer-events: auto;
        background: rgba(2, 6, 23, 0.85);
        backdrop-filter: blur(8px);
        border: 1px solid rgba(148, 163, 184, 0.25);
        padding: 5px 10px;
        border-radius: 8px;
        font-size: 11px;
        color: #cbd5e1;
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .fpe-canvas-footer {
        position: absolute;
        bottom: 10px;
        left: 10px;
        right: 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        pointer-events: none;
      }
      .fpe-sidepanel {
        display: flex;
        flex-direction: column;
        gap: 10px;
        background: rgba(15, 23, 42, 0.9);
        border: 1px solid rgba(148, 163, 184, 0.2);
        border-radius: 12px;
        padding: 12px;
        max-height: 560px;
        overflow-y: auto;
      }
      .fpe-card {
        background: rgba(2, 6, 23, 0.65);
        border: 1px solid rgba(148, 163, 184, 0.16);
        border-radius: 9px;
        padding: 10px;
      }
      .fpe-card-title {
        font-size: 11px;
        text-transform: uppercase;
        letter-spacing: 0.7px;
        color: #38bdf8;
        font-weight: 700;
        margin-bottom: 8px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .fpe-stage-list {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }
      .fpe-stage-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 6px;
        padding: 6px 8px;
        border-radius: 6px;
        background: rgba(30, 41, 59, 0.55);
        border: 1px solid rgba(148, 163, 184, 0.15);
        font-size: 11px;
      }
      .fpe-stage-item.deferred {
        opacity: 0.65;
        border-style: dashed;
      }
      .fpe-metric-row {
        display: flex;
        justify-content: space-between;
        font-size: 11.5px;
        padding: 3px 0;
        border-bottom: 1px solid rgba(255,255,255,0.05);
      }
      .fpe-code-ok {
        color: #34d399;
        font-weight: 700;
      }
      .fpe-code-warn {
        color: #f87171;
        font-weight: 700;
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * Construye la estructura HTML del editor dentro de this.container
   */
  buildDOM() {
    this.container.innerHTML = `
      <div class="fpe-root">
        <!-- Banner de Realidad Estructural Verificada en CALCULO ESTRUCTURAL L.G. FUSIONADO.pdf -->
        <div class="fpe-reality-banner">
          <div>
            <strong style="color:#fff; font-size:12px;">📐 Grilla Estructural Exacta (Cálculo L.G. + Planos Sanitarios/E5):</strong>
            <span style="color:#cbd5e1; margin-left:4px;">9 Ejes X (<strong>Eje 9 a Eje 1 • 9.74m</strong>) × 7 Ejes Z (<strong>Eje G z=3.00m a Eje A z=13.34m • 10.34m</strong>).</span>
          </div>
          <div class="fpe-reality-steps">
            <span class="fpe-step-pill done">🔒 17 Pilares PB Hormigonados (+2.88m) + Losas L1–L4 + Escaleras 1 y 2</span>
            <span class="fpe-step-pill now">🕳️ Vacío Losa 1: 38.00 m² (A cerrar c/ Loza Rap) • ⚠️ P12, P13 y P15 Mueren en PB</span>
            <span class="fpe-step-pill progressive">🎯 Núcleo Húmedo Eje F–G + PA 2 Dorm/Desk/2 Baños/Vestidor</span>
          </div>
        </div>

        <!-- Barra 1: Conmutador de los 3 Niveles + Presets Arquitectónicos -->
        <div class="fpe-top-controls">
          <div class="fpe-btn-group" id="fpe-level-tabs">
            <button class="fpe-btn" data-level="subsuelo" title="Nivel 0 (+97.66m / Y=-2.34m): Parrillita hacia el Patio + Lavadero + Depósito + Arranque Escalera 1 (Eje 8-9) + Cámara Oxigenación 1.50m.">
              <span>Nivel 0: Subsuelo (+97.66m • Parrilla/Lavadero/Depósito)</span>
            </button>
            <button class="fpe-btn active" data-level="planta_baja" title="Nivel 1 (+100.00m): Cochera c/ Portón Balancín 2.30m + Rejilla Electroforjada + Núcleo Húmedo Eje F-G (Baño Social + Cocina/Comedor) + Estar + Escaleras 1 y 2 + Galería al Río.">
              <span>🔒 Nivel 1: Planta Baja (+100.00m • Eje F–G Baño/Cocina + Estar)</span>
            </button>
            <button class="fpe-btn gold" data-level="planta_alta" title="Nivel 2 (+102.88m): 2 Dormitorios + Desk al subir Escalera 2 + 2 Baños + Vestidor sobre Eje F-G (SIN balcón ni Blindex frontal).">
              <span>🎯 Nivel 2: Planta Alta (+102.88m • 2 Dorm + Desk + 2 Baños/Vestidor)</span>
            </button>
          </div>

          <div class="fpe-btn-group">
            <span style="font-size:11px; color:#94a3b8; font-weight:600;">Preset:</span>
            <button class="fpe-btn" data-preset="hoy_en_obra" title="Muestra lo construido hoy en obra: 17 Pilares PB hormigonados hasta +2.88m, Losas L1-L4 macizas y Hueco Abierto de 38.00 m² en Losa 1 (a cerrar con Loza Rap)">
              🔒 Hoy en Obra (Hueco 38m² + 17 Pilares PB)
            </button>
            <button class="fpe-btn gold active" data-preset="cierre_300m" title="Proyecto Ruth & Leo alineado a Planos Oficiales: Núcleo Húmedo Eje F-G, 2 Dormitorios + Desk en PA, Escaleras opuestas y Parrilla en Subsuelo">
              Ruth & Leo (Oficial Eje F–G)
            </button>
            <button class="fpe-btn" data-preset="opcion_1_rolon" title="Opción 1: Arq. Gabriela Rolón alineada a Planos Oficiales Eje F-G y E5">
              Opción 1 (Arq. Rolón)
            </button>
            <button class="fpe-btn" data-preset="opcion_2_lgrb" title="Opción 2: LG-RB Cierre Loza Rap 38.00 m² + Núcleo Húmedo Eje F-G + 2 Dormitorios y Desk PA">
              Opción 2 (LG-RB Loza Rap)
            </button>
          </div>
        </div>

        <!-- Barra 2: Herramientas Interactivas CAD 2D + Materiales + Snap + Modo Colores Banco + Exportación SVG/PNG/JSON -->
        <div class="fpe-top-controls">
          <div class="fpe-btn-group" id="fpe-tool-buttons">
            <button class="fpe-btn active" data-tool="select" title="Seleccionar, arrastrar muros/ambientes o redimensionar con imán a P1..P20">
              ✥ Seleccionar / Mover
            </button>
            <button class="fpe-btn" data-tool="add_wall" title="Dibujar nuevo muro o abertura haciendo clic y arrastrando entre ejes 1..9 y A..G">
              🧱 Agregar Muro / Blindex
            </button>
            <select id="fpe-wall-type" class="fpe-select" title="Tipo de Muro Paraguayo o Abertura">
              <option value="ladrillo_15">Ladrillo Hueco 15cm (Gs. 115k/m²)</option>
              <option value="ladrillo_20">Ladrillo Común 20cm Acústico (Gs. 165k/m²)</option>
              <option value="ciclopeo_30">Muro Contención 30cm (Gs. 273k/m²)</option>
              <option value="blindex_corredizo">Abertura Blindex Corredizo (Gs. 750k/m²)</option>
            </select>

            <button class="fpe-btn" data-tool="add_mep" title="Posicionar nodo de instalaciones en el plano">
              📡 Agregar Instalación
            </button>
            <select id="fpe-mep-type" class="fpe-select" title="Tipo de Nodo de Instalación">
              <option value="pase_losa1_diamantado">🕳️ Pase Diamantado Losa 1 (#1..#4)</option>
              <option value="tablero_smart_din">⚡ Tablero Smart DIN (TP-PB/TS-PA/TS-SUB)</option>
              <option value="toma_20a">🔌 Tomacorriente 20A (Naranja #f97316)</option>
              <option value="toma_16a">🔌 Tomacorriente 16A (Verde #10b981)</option>
              <option value="llave_zigbee_3way">💡 Llave Zigbee / 3-Way (#38bdf8)</option>
              <option value="cisterna_presurizadora">🚰 Cisterna 1.000L + Presurizadora</option>
              <option value="cctv_poe">📷 Cámara CCTV PoE</option>
              <option value="wifi_mesh">🛜 AP Wi-Fi 6 Mesh</option>
              <option value="cat6_rj45">🔌 Boca Red Cat6 RJ45</option>
              <option value="rejilla_pluvial">💧 Rejilla Pluvial</option>
              <option value="bajada_pvc100">⏬ Bajada PVC 100mm</option>
              <option value="drenaje_frances">🛡️ Tubo Drenaje Francés</option>
            </select>

            <button class="fpe-btn" data-tool="delete" title="Eliminar muro o nodo de instalación (Pilares P1..P20 y Escaleras 1 y 2 están protegidos 🔒)">
              🗑️ Borrar
            </button>
          </div>

          <div class="fpe-btn-group">
            <button class="fpe-btn active" id="fpe-btn-toggle-conduits" title="Mostrar/Ocultar los 4 Pases con Sacabocado Diamantado en Losa 1, Tableros Smart DIN, Electroductos en contrapiso (5cm) y los 26 Tomacorrientes (20A/16A) + Llaves 3-Way">
              🔌 Ductos y Pases (26 Tomas + 4 Pases)
            </button>
            <button class="fpe-btn gold" id="fpe-btn-split-3d" title="Dividir la pantalla para ver y editar el Plano CAD 2D al lado del Modelo 3D interactivo en vivo">
              🔀 Vista Dividida 2D + 3D en Vivo
            </button>
            <button class="fpe-btn gold" id="fpe-btn-bank-colors" title="Activar Código de Colores Normativo del Banco en Plano 2D, Exportación SVG/PNG y Escena 3D (Negro: Ya construido | Verde: Hormigón | Rojo: A construir | Amarillo: A refaccionar)">
              🏦 Colores Banco
            </button>
            <label style="font-size:11px; color:#cbd5e1; display:flex; align-items:center; gap:4px; cursor:pointer;">
              <input type="checkbox" id="fpe-chk-pillar-snap" checked>
              <span>🧲 Snap P1..P20</span>
            </label>
            <select id="fpe-snap-step" class="fpe-select" title="Paso de grilla magnética">
              <option value="0.15">Paso 0.15m</option>
              <option value="0.10">Paso 0.10m</option>
              <option value="0.05">Paso 0.05m</option>
            </select>
            <select id="fpe-theme-select" class="fpe-select" title="Contraste del Plano CAD">
              <option value="dark_cad">AutoCAD Oscuro</option>
              <option value="blueprint">Blueprint Azul</option>
              <option value="white_paper">Papel Blanco (Banco)</option>
            </select>
            <button class="fpe-btn" id="fpe-btn-save-local" title="Guardar diseño en navegador (localStorage)">
              💾 Guardar
            </button>
            <button class="fpe-btn gold" id="fpe-btn-export-svg" title="Exportar plano técnico del nivel activo en formato SVG Vectorial a escala CAD con rótulo, ejes 1..9 / A..G y leyenda del Banco">
              📐 Exportar SVG Nivel
            </button>
            <button class="fpe-btn gold" id="fpe-btn-export-pack-svg" title="Generar y descargar en tiempo real el Pack Completo de 4 Láminas Oficiales SVG (Lámina 1 PB +100.00m, Lámina 2 PA +102.88m, Lámina 3 Subsuelo +97.66m, Lámina 4 Instalaciones Eje F-G)">
              📑 Pack 4 Planos Oficiales SVG
            </button>
            <button class="fpe-btn" id="fpe-btn-export-png" title="Descargar imagen PNG de alta resolución del plano editado">
              🖼️ PNG
            </button>
            <button class="fpe-btn" id="fpe-btn-export-json" title="Exportar archivo JSON BIM con la geometría y cómputos">
              📄 JSON
            </button>
          </div>
        </div>

        <!-- Leyenda Normativa del Banco (Visible cuando Modo Colores Banco está activo) -->
        <div id="fpe-bank-legend-bar" style="display:none; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:8px; padding:8px 12px; border-radius:9px; background:rgba(15,23,42,0.95); border:1px solid rgba(239,68,68,0.45); font-size:11px;">
          <div style="font-weight:700; color:#fde68a;">🏦 CÓDIGO DE COLORES NORMATIVO EXIGIDO POR EL BANCO (Planos y Cómputo):</div>
          <div style="display:flex; flex-wrap:wrap; gap:8px; align-items:center;">
            <span style="padding:3px 8px; border-radius:6px; background:#1e293b; border:1px solid #94a3b8; color:#f8fafc; font-weight:700;">⚫ NEGRO: Ya Construido (Zapatas, 17 Pilares PB +2.88m, Losas L1–L4, Murallas, Portón Balancín)</span>
            <span style="padding:3px 8px; border-radius:6px; background:rgba(22,163,74,0.22); border:1px solid #22c55e; color:#86efac; font-weight:700;">🟢 VERDE: Hormigón Armado / Loza Rap (Cierre 38m² Losa 1, Losa PA +102.88m, Pilares PA)</span>
            <span style="padding:3px 8px; border-radius:6px; background:rgba(220,38,38,0.22); border:1px solid #ef4444; color:#fca5a5; font-weight:700;">🔴 ROJO: Obra Nueva a Construir (Mampostería, Techo, Núcleo Húmedo Eje F–G, Rejilla Electroforjada)</span>
            <span style="padding:3px 8px; border-radius:6px; background:rgba(217,119,6,0.24); border:1px solid #f59e0b; color:#fde68a; font-weight:700;">🟡 AMARILLO: A Refaccionar / Adecuar (Cuidado Losa 1 Expuesta, Sikadur-32, Medianera Eje 9)</span>
          </div>
        </div>

        <!-- Área Principal: Lienzo CAD 2D Retina + Panel Lateral de Etapas y Cómputos -->
        <div class="fpe-workspace">
          <div class="fpe-canvas-wrap">
            <div class="fpe-canvas-hud">
              <div class="fpe-hud-pill" id="fpe-level-badge">
                <strong style="color:#67e8f9;">Nivel 1: Planta Baja (+100.00m)</strong>
                <span>• Losas L1–L4 + P1..P20 🔒</span>
              </div>
              <div class="fpe-hud-pill">
                <span id="fpe-cursor-coords">X: 0.00m | Z: 8.00m</span>
                <button class="fpe-btn" id="fpe-btn-reset-view" style="padding:2px 6px; font-size:10px;">Centrar Vista</button>
              </div>
            </div>

            <canvas id="fpe-canvas" class="fpe-canvas"></canvas>

            <div class="fpe-canvas-footer">
              <div class="fpe-hud-pill" style="font-size:10.5px;">
                <span>🔒 <strong>Ejes 9..1 (9.74m) × Ejes G..A (z=3.00..13.34m)</strong> • Esc. 1 (Eje 8–9 Subsuelo) • Esc. 2 (Eje 1–2 PA)</span>
                <span>• ⚠️ P12, P13 y P15 mueren en PB • Rueda: Zoom • Clic der./Shift: Paneo</span>
              </div>
            </div>
          </div>

          <!-- Panel Lateral Derecho: Fase de Armado de Espacios + Reglamento Asunción + Presupuesto -->
          <div class="fpe-sidepanel">
            <!-- 1. Selector de Fase de Armado de Espacios según Disponibilidad de Recursos -->
            <div class="fpe-card">
              <div class="fpe-card-title">
                <span>🧩 Fase de Armado (Según Recursos)</span>
                <div style="display:flex; gap:4px;">
                  <button class="fpe-btn" id="fpe-stage-all-now" style="padding:2px 6px; font-size:9.5px;" title="Marcar todos los ambientes y muros de este nivel para cerrar ahora">Cerrar Nivel</button>
                  <button class="fpe-btn" id="fpe-stage-shell-only" style="padding:2px 6px; font-size:9.5px;" title="Dejar este nivel sin muros interiores (Planta Abierta Techada para Etapa Futura)">Dejar Abierto</button>
                </div>
              </div>
              <p style="font-size:10.5px; color:#94a3b8; margin-bottom:8px; line-height:1.35;">
                Activa o difiere cada ambiente apoyado sobre los ejes reales <strong>1..9 y A..G</strong>:
              </p>
              <div id="fpe-stage-rooms-list" class="fpe-stage-list"></div>
            </div>

            <!-- 2. Inspector del Elemento Seleccionado / Validación Municipal Asunción -->
            <div class="fpe-card">
              <div class="fpe-card-title">
                <span>📏 Inspector Estructural y Normativa</span>
                <span id="fpe-selected-tag" style="font-size:10px; color:#fde68a;">Nivel Activo</span>
              </div>
              <div id="fpe-inspector-body" style="font-size:11px; color:#cbd5e1; line-height:1.45;"></div>
            </div>

            <!-- 3. Cómputo Métrico en Vivo y Sincronización 3D -->
            <div class="fpe-card" style="border-color:rgba(245,158,11,0.35);">
              <div class="fpe-card-title" style="color:#fde68a;">
                <span>💰 Cómputo Métrico y Costo en Vivo</span>
                <span style="font-size:9.5px; color:#34d399;">● Sincronizado 3D</span>
              </div>
              <div id="fpe-metrics-summary"></div>
            </div>
          </div>
        </div>
      </div>
    `;

    this.canvas = this.container.querySelector('#fpe-canvas');
    this.ctx = this.canvas.getContext('2d');

    this.bindUIControls();
  }

  /**
   * Activa o desactiva el Modo Colores Banco en el editor 2D y sincroniza con la escena 3D
   */
  setBankColorMode(enabled, notifyScene = true) {
    this.bankColorMode = Boolean(enabled);
    const btnBank = this.container.querySelector('#fpe-btn-bank-colors');
    const legendBar = this.container.querySelector('#fpe-bank-legend-bar');
    if (btnBank) {
      btnBank.classList.toggle('active', this.bankColorMode);
      btnBank.style.borderColor = this.bankColorMode ? '#ef4444' : '';
    }
    if (legendBar) {
      legendBar.style.display = this.bankColorMode ? 'flex' : 'none';
    }
    if (notifyScene && this.sceneRef && typeof this.sceneRef.setBankColorMode === 'function') {
      this.sceneRef.setBankColorMode(this.bankColorMode);
    }
    const headerBtn = document.getElementById('btn-toggle-bank-colors');
    if (headerBtn) {
      headerBtn.classList.toggle('active', this.bankColorMode);
      headerBtn.textContent = this.bankColorMode ? '🏦 Colores Banco: ON' : '🏦 Colores Banco';
    }
    this.render();
  }

  /**
   * Conecta los botones de niveles, presets, herramientas y exportación (SVG, Pack 4 Láminas, PNG, JSON)
   */
  bindUIControls() {
    // Botón Toggle Ductos, Pases Losa 1 y Enchufes (26 Tomas + 4 Pases)
    const btnToggleConduits = this.container.querySelector('#fpe-btn-toggle-conduits');
    if (btnToggleConduits) {
      btnToggleConduits.addEventListener('click', () => {
        this.showConduitsAndOutlets = !this.showConduitsAndOutlets;
        btnToggleConduits.classList.toggle('active', this.showConduitsAndOutlets);
        if (this.sceneRef && typeof this.sceneRef.setLayerVisibility === 'function') {
          this.sceneRef.setLayerVisibility('ductos', this.showConduitsAndOutlets);
        }
        this.render();
      });
    }

    // Botón Modo Colores Banco
    const btnBankColors = this.container.querySelector('#fpe-btn-bank-colors');
    if (btnBankColors) {
      btnBankColors.addEventListener('click', () => {
        this.setBankColorMode(!this.bankColorMode, true);
      });
    }

    // Botón Vista Dividida 2D + 3D en Vivo
    const btnSplit3D = this.container.querySelector('#fpe-btn-split-3d');
    if (btnSplit3D) {
      btnSplit3D.addEventListener('click', () => {
        const modalEl = document.getElementById('modal-editor-2d');
        if (!modalEl) return;
        const isSplit = modalEl.classList.toggle('split-3d-active');
        btnSplit3D.classList.toggle('active', isSplit);
        btnSplit3D.textContent = isSplit ? '🔳 Pantalla Completa 2D' : '🔀 Vista Dividida 2D + 3D en Vivo';
        setTimeout(() => {
          this.resetCameraView();
          this.resizeCanvas();
        }, 60);
      });
    }

    // Conmutador de Niveles
    this.container.querySelectorAll('[data-level]').forEach((btn) => {
      btn.addEventListener('click', () => {
        this.currentLevel = btn.getAttribute('data-level');
        this.selectedElement = null;
        this.container.querySelectorAll('[data-level]').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        this.updateLevelHeaderBadge();
        this.recalculateAndNotify();
      });
    });

    // Botones de Presets Arquitectónicos
    this.container.querySelectorAll('[data-preset]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const presetKey = btn.getAttribute('data-preset');
        this.loadPreset(presetKey);
        this.container.querySelectorAll('[data-preset]').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });

    // Herramientas CAD
    this.container.querySelectorAll('[data-tool]').forEach((btn) => {
      btn.addEventListener('click', () => {
        this.activeTool = btn.getAttribute('data-tool');
        this.tempWallStart = null;
        this.container.querySelectorAll('[data-tool]').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        this.render();
      });
    });

    // Selectores de tipo de muro, instalación, snap y tema
    const wallSelect = this.container.querySelector('#fpe-wall-type');
    wallSelect.addEventListener('change', (e) => {
      this.selectedWallType = e.target.value;
      if (this.selectedElement?.kind === 'wall') {
        this.selectedElement.item.type = this.selectedWallType;
        this.recalculateAndNotify();
      }
    });

    const mepSelect = this.container.querySelector('#fpe-mep-type');
    mepSelect.addEventListener('change', (e) => {
      this.selectedMepType = e.target.value;
    });

    const snapChk = this.container.querySelector('#fpe-chk-pillar-snap');
    snapChk.addEventListener('change', (e) => {
      this.snapToPillars = e.target.checked;
    });

    const snapStepSel = this.container.querySelector('#fpe-snap-step');
    snapStepSel.addEventListener('change', (e) => {
      this.snapStep = parseFloat(e.target.value) || 0.15;
    });

    const themeSel = this.container.querySelector('#fpe-theme-select');
    themeSel.addEventListener('change', (e) => {
      this.theme = e.target.value;
      this.render();
    });

    this.container.querySelector('#fpe-btn-reset-view').addEventListener('click', () => {
      this.resetCameraView();
      this.render();
    });

    // Acciones rápidas de Fase de Armado por Recursos en el nivel actual
    this.container.querySelector('#fpe-stage-all-now').addEventListener('click', () => {
      const lvl = this.getActiveLevelData();
      lvl.rooms.forEach((r) => { r.activeStage = true; });
      lvl.walls.forEach((w) => { w.activeStage = true; });
      this.recalculateAndNotify();
    });

    this.container.querySelector('#fpe-stage-shell-only').addEventListener('click', () => {
      const lvl = this.getActiveLevelData();
      lvl.rooms.forEach((r) => { r.activeStage = false; });
      lvl.walls.forEach((w) => { w.activeStage = false; });
      this.recalculateAndNotify();
    });

    // Guardar y Exportar (SVG, Pack 4 Planos Oficiales SVG, PNG, JSON)
    this.container.querySelector('#fpe-btn-save-local').addEventListener('click', () => {
      this.saveToStorage();
    });

    const btnSvg = this.container.querySelector('#fpe-btn-export-svg');
    if (btnSvg) {
      btnSvg.addEventListener('click', () => {
        this.exportSVG();
      });
    }

    const btnPackSvg = this.container.querySelector('#fpe-btn-export-pack-svg');
    if (btnPackSvg) {
      btnPackSvg.addEventListener('click', () => {
        this.exportOfficialBlueprintsPackSVG();
      });
    }

    this.container.querySelector('#fpe-btn-export-png').addEventListener('click', () => {
      this.exportPNG();
    });

    this.container.querySelector('#fpe-btn-export-json').addEventListener('click', () => {
      this.exportJSON();
    });

    this.updateLevelHeaderBadge();
  }

  updateLevelHeaderBadge() {
    const def = LEVEL_DEFINITIONS[this.currentLevel];
    const badge = this.container.querySelector('#fpe-level-badge');
    if (badge && def) {
      badge.innerHTML = `
        <strong style="color:${def.statusColor};">${def.shortTitle}</strong>
        <span style="font-size:10px; color:#e2e8f0; background:rgba(255,255,255,0.08); padding:2px 6px; border-radius:4px;">Ejes 1–9 × A–G</span>
      `;
    }
  }

  loadPreset(presetKey) {
    this.planData = createPresetPlan(presetKey);
    this.selectedElement = null;
    this.recalculateAndNotify();
  }

  getActiveLevelData() {
    return this.planData.levels[this.currentLevel];
  }

  /**
   * Ajusta resolución Retina (devicePixelRatio) y centra el plano
   */
  resizeCanvas() {
    if (!this.canvas) return;
    const rect = this.canvas.parentElement.getBoundingClientRect();
    const width = Math.max(320, rect.width);
    const height = Math.max(500, rect.height);
    const dpr = Math.min(window.devicePixelRatio || 1, 2.5);

    this.canvas.width = Math.round(width * dpr);
    this.canvas.height = Math.round(height * dpr);
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;

    this.dpr = dpr;
    this.viewW = width;
    this.viewH = height;

    if (!this._userHasPanned) {
      this.resetCameraView();
    }
    this.render();
  }

  handleResize() {
    this.resizeCanvas();
  }

  resetCameraView() {
    this._userHasPanned = false;
    this.zoom = Math.min(this.viewW / 12.8, this.viewH / 16.5);
    this.panX = this.viewW / 2;
    this.panY = Math.max(54, this.viewH * 0.50 - 5.2 * this.zoom);
  }

  worldToScreen(x, z) {
    return {
      px: this.panX + x * this.zoom,
      py: this.panY + z * this.zoom
    };
  }

  screenToWorld(px, py) {
    return {
      x: (px - this.panX) / this.zoom,
      z: (py - this.panY) / this.zoom
    };
  }

  /**
   * Snap magnético a Pilares P1..P20 y a los Ejes Estructurales 1..9 y A..G
   */
  snapCoordinates(rawX, rawZ) {
    let snappedPillar = null;
    if (this.snapToPillars) {
      for (const col of FIXED_COLUMNS_AND_FOOTINGS) {
        const dist = Math.hypot(rawX - col.x, rawZ - col.z);
        if (dist <= 0.38) {
          return { x: col.x, z: col.z, snappedToPillar: col.pilarId };
        }
      }
      for (const ax of FIXED_STRUCTURAL_GRID.xAxes) {
        if (Math.abs(rawX - ax.x) <= 0.18) {
          rawX = ax.x;
          break;
        }
      }
      for (const az of FIXED_STRUCTURAL_GRID.zAxes) {
        if (Math.abs(rawZ - az.z) <= 0.18) {
          rawZ = az.z;
          break;
        }
      }
    }

    const step = this.snapStep || 0.15;
    const sx = Number((Math.round(rawX / step) * step).toFixed(2));
    const sz = Number((Math.round(rawZ / step) * step).toFixed(2));
    return { x: sx, z: sz, snappedToPillar: snappedPillar };
  }

  /**
   * Eventos de Mouse y Touch sobre el Canvas 2D
   */
  setupCanvasEvents() {
    const getPointerPos = (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      return {
        px: clientX - rect.left,
        py: clientY - rect.top
      };
    };

    this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());

    this.canvas.addEventListener('mousedown', (e) => {
      const { px, py } = getPointerPos(e);
      const rawWorld = this.screenToWorld(px, py);
      const snapped = this.snapCoordinates(rawWorld.x, rawWorld.z);

      if (e.button === 2 || e.button === 1 || e.shiftKey) {
        this.dragState = {
          mode: 'pan',
          startPx: px,
          startPy: py,
          origPanX: this.panX,
          origPanY: this.panY
        };
        return;
      }

      if (this.activeTool === 'add_mep') {
        const lvl = this.getActiveLevelData();
        const cat = MEP_NODE_CATALOG[this.selectedMepType];
        const newNode = {
          id: `mep_${Date.now()}`,
          type: this.selectedMepType,
          x: snapped.x,
          z: snapped.z,
          label: `${cat.name} (${snapped.snappedToPillar || 'Nuevo'})`
        };
        lvl.mepNodes.push(newNode);
        this.selectedElement = { kind: 'mep', item: newNode };
        this.recalculateAndNotify();
        return;
      }

      if (this.activeTool === 'add_wall') {
        this.tempWallStart = { x: snapped.x, z: snapped.z, pillar: snapped.snappedToPillar };
        this.dragState = { mode: 'draw_wall' };
        this.render();
        return;
      }

      const hit = this.hitTest(rawWorld.x, rawWorld.z);

      if (this.activeTool === 'delete') {
        if (hit && !hit.locked) {
          this.deleteHitElement(hit);
          this.recalculateAndNotify();
        } else if (hit && hit.locked) {
          this.selectedElement = hit;
          this.updateSidePanelUI(this.computeFullMetrics());
          this.render();
        }
        return;
      }

      this.selectedElement = hit;
      if (hit && !hit.locked) {
        if (hit.kind === 'mep') {
          this.dragState = { mode: 'move_mep', item: hit.item };
        } else if (hit.kind === 'wall_endpoint') {
          this.dragState = { mode: 'move_wall_point', item: hit.item, endpoint: hit.endpoint };
        } else if (hit.kind === 'wall') {
          this.dragState = {
            mode: 'move_wall',
            item: hit.item,
            startX: snapped.x,
            startZ: snapped.z,
            origX1: hit.item.x1,
            origZ1: hit.item.z1,
            origX2: hit.item.x2,
            origZ2: hit.item.z2
          };
        } else if (hit.kind === 'room_handle') {
          this.dragState = {
            mode: 'resize_room',
            item: hit.item,
            handle: hit.handle
          };
        } else if (hit.kind === 'room') {
          this.dragState = {
            mode: 'move_room',
            item: hit.item,
            startX: snapped.x,
            startZ: snapped.z,
            origX: hit.item.x,
            origZ: hit.item.z
          };
        }
      }
      this.updateSidePanelUI(this.computeFullMetrics());
      this.render();
    });

    window.addEventListener('mousemove', (e) => {
      if (!this.canvas) return;
      const rect = this.canvas.getBoundingClientRect();
      if (
        e.clientX < rect.left ||
        e.clientX > rect.right ||
        e.clientY < rect.top ||
        e.clientY > rect.bottom
      ) {
        if (!this.dragState) return;
      }

      const { px, py } = getPointerPos(e);
      const rawWorld = this.screenToWorld(px, py);
      const snapped = this.snapCoordinates(rawWorld.x, rawWorld.z);
      this.hoverWorldPos = snapped;

      const coordEl = this.container.querySelector('#fpe-cursor-coords');
      if (coordEl) {
        const snapTxt = snapped.snappedToPillar ? ` • 🧲 ${snapped.snappedToPillar}` : '';
        coordEl.textContent = `X: ${snapped.x.toFixed(2)}m | Z: ${snapped.z.toFixed(2)}m${snapTxt}`;
      }

      if (!this.dragState) {
        if (this.activeTool === 'add_wall') this.render();
        return;
      }

      if (this.dragState.mode === 'pan') {
        this.panX = this.dragState.origPanX + (px - this.dragState.startPx);
        this.panY = this.dragState.origPanY + (py - this.dragState.startPy);
        this.render();
        return;
      }

      if (this.dragState.mode === 'move_mep') {
        this.dragState.item.x = snapped.x;
        this.dragState.item.z = snapped.z;
        this.recalculateAndNotify();
        return;
      }

      if (this.dragState.mode === 'move_wall_point') {
        const w = this.dragState.item;
        if (this.dragState.endpoint === 1) {
          w.x1 = snapped.x;
          w.z1 = snapped.z;
        } else {
          w.x2 = snapped.x;
          w.z2 = snapped.z;
        }
        this.recalculateAndNotify();
        return;
      }

      if (this.dragState.mode === 'move_wall') {
        const dx = snapped.x - this.dragState.startX;
        const dz = snapped.z - this.dragState.startZ;
        const w = this.dragState.item;
        w.x1 = Number((this.dragState.origX1 + dx).toFixed(2));
        w.z1 = Number((this.dragState.origZ1 + dz).toFixed(2));
        w.x2 = Number((this.dragState.origX2 + dx).toFixed(2));
        w.z2 = Number((this.dragState.origZ2 + dz).toFixed(2));
        this.recalculateAndNotify();
        return;
      }

      if (this.dragState.mode === 'resize_room') {
        const r = this.dragState.item;
        if (this.dragState.handle === 'se') {
          r.w = Math.max(0.8, Number((snapped.x - r.x).toFixed(2)));
          r.d = Math.max(0.8, Number((snapped.z - r.z).toFixed(2)));
        }
        this.recalculateAndNotify();
        return;
      }

      if (this.dragState.mode === 'move_room') {
        const dx = snapped.x - this.dragState.startX;
        const dz = snapped.z - this.dragState.startZ;
        const r = this.dragState.item;
        r.x = Number((this.dragState.origX + dx).toFixed(2));
        r.z = Number((this.dragState.origZ + dz).toFixed(2));
        this.recalculateAndNotify();
        return;
      }

      if (this.dragState.mode === 'draw_wall') {
        this.render();
      }
    });

    window.addEventListener('mouseup', () => {
      if (this.dragState?.mode === 'draw_wall' && this.tempWallStart) {
        const end = this.hoverWorldPos;
        const length = Math.hypot(end.x - this.tempWallStart.x, end.z - this.tempWallStart.z);
        if (length >= 0.4) {
          const lvl = this.getActiveLevelData();
          const wallDef = WALL_CATALOG[this.selectedWallType];
          const newWall = {
            id: `w_${Date.now()}`,
            type: this.selectedWallType,
            x1: this.tempWallStart.x,
            z1: this.tempWallStart.z,
            x2: end.x,
            z2: end.z,
            activeStage: true,
            label: `${wallDef.shortName} (${length.toFixed(2)}m)`
          };
          lvl.walls.push(newWall);
          this.selectedElement = { kind: 'wall', item: newWall };
          this.recalculateAndNotify();
        }
        this.tempWallStart = null;
      }
      this.dragState = null;
      this.render();
    });

    this.canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      const factor = e.deltaY < 0 ? 1.1 : 0.9;
      this.zoom = Math.min(68, Math.max(11, this.zoom * factor));
      this.render();
    }, { passive: false });
  }

  /**
   * Obtiene los trazados de electroductos/tuberías y nodos de DUCTOS_PASES_ENCHUFES_DATOS filtrados para el nivel activo
   */
  getConduitsAndOutletsForLevel(levelKey = this.currentLevel) {
    const data = DUCTOS_PASES_ENCHUFES_DATOS || {};
    const pases = (data.pasesLosa1Diamantados || []).map((p, idx) => ({
      ...p,
      shortTag: `PASE #${idx + 1}`,
      x: p.pos3D[0],
      z: p.pos3D[2]
    }));

    const eqLevelMap = {
      TAB_PILASTRA_ANDE: 'planta_baja',
      TAB_TP_PB: 'planta_baja',
      HID_MEDIDOR_ESSAP: 'planta_baja',
      TAB_TS_PA: 'planta_alta',
      TAB_TS_SUB: 'subsuelo',
      HID_CISTERNA_BOMBA: 'subsuelo'
    };
    const eqDisplayCodeMap = {
      TAB_TP_PB: 'TP-PB 36-48 DIN Smart',
      TAB_TS_PA: 'TS-PA 24 DIN',
      TAB_TS_SUB: 'TS-SUB 12 DIN',
      TAB_PILASTRA_ANDE: 'Pilar ANDE Trifásico',
      HID_CISTERNA_BOMBA: 'Tanque 1.000L + Presurizadora',
      HID_MEDIDOR_ESSAP: 'M-ESSAP ¾"'
    };

    const tableros = (data.tablerosYEquiposPrincipales || [])
      .filter((eq) => (eqLevelMap[eq.id] || 'planta_baja') === levelKey)
      .map((eq) => ({
        ...eq,
        displayCode: eqDisplayCodeMap[eq.id] || eq.codigo,
        x: eq.pos3D[0],
        z: eq.pos3D[2]
      }));

    const enchufes = (data.enchufesYTomacorrientes || [])
      .filter((t) => t.nivel === levelKey)
      .map((t) => ({
        ...t,
        x: t.pos3D[0],
        z: t.pos3D[2]
      }));

    const llaves = (data.llavesYConmutadas3Way || [])
      .filter((sw) => sw.nivel === levelKey)
      .map((sw) => ({
        ...sw,
        x: sw.pos3D[0],
        z: sw.pos3D[2]
      }));

    // Trazados 100% ortogonales (90°) de electroductos y cañerías por nivel alineados a los 4 Pases en Losa Maciza L4
    let conduitRoutes = [];
    if (levelKey === 'planta_baja') {
      conduitRoutes = [
        {
          color: '#f59e0b',
          label: 'Acometida ANDE 4×10mm² Ø50mm (Pilar ANDE → TP-PB)',
          pts: [[-3.85, -4.08], [-3.85, 3.00], [-0.45, 3.00], [-0.45, 4.78]]
        },
        {
          color: '#f97316',
          label: 'Ducto 20A Cocina e Isla sobre Losa Maciza L4 (+X)',
          pts: [[-0.45, 4.78], [0.95, 4.78], [0.95, 3.12], [2.40, 3.12], [3.75, 3.12], [3.75, 5.10]]
        },
        {
          color: '#10b981',
          label: 'Ducto 16A Estar Social (Loza Rap 38m² -X) y Comedor (+X)',
          pts: [[-0.45, 4.78], [-3.80, 4.78], [-4.76, 4.78], [-4.76, 8.80]]
        },
        {
          color: '#38bdf8',
          label: 'Ducto 3-Way Escalera 1 (+X) y Escalera 2 (-X)',
          pts: [[-3.84, 5.26], [-0.45, 5.26], [-0.45, 4.78], [3.84, 4.78], [3.84, 5.26]]
        },
        {
          color: '#0284c7',
          label: 'Agua Fría PPR Ø25mm (Medidor ESSAP → PASE #4 en Losa L4)',
          pts: [[-3.85, -4.24], [-3.85, 3.28], [1.48, 3.28], [2.30, 3.28]]
        }
      ];
    } else if (levelKey === 'planta_alta') {
      conduitRoutes = [
        {
          color: '#f97316',
          label: 'Ducto 20A Termocalefón 80L + 3 Splits AA (Suite +X, Dorm 2, Estudio -X)',
          pts: [[-0.45, 4.78], [1.48, 4.78], [1.48, 3.28], [4.76, 3.28], [4.76, 7.60]]
        },
        {
          color: '#10b981',
          label: 'Ducto 16A Suite Principal (+X), Vestidor y Dormitorio 2',
          pts: [[-0.45, 4.78], [0.60, 4.78], [0.60, 8.85], [4.76, 8.85]]
        },
        {
          color: '#38bdf8',
          label: 'Ducto Escritorio Extendido (-X hasta Eje A z=13.34m) + 3-Way Escalera 2',
          pts: [[-0.45, 4.78], [-3.84, 4.78], [-3.84, 6.00], [-4.76, 6.00], [-4.76, 12.10]]
        }
      ];
    } else if (levelKey === 'subsuelo') {
      conduitRoutes = [
        {
          color: '#f97316',
          label: 'Ducto Galvanizado por Viga (PASE #1 → TS-SUB → Lavarropas 20A bajo Escalera 1)',
          pts: [[-0.45, 4.78], [3.84, 4.78], [3.84, 6.20], [4.76, 6.20]]
        },
        {
          color: '#10b981',
          label: 'Ducto Subsuelo (Salón + Parrillita al Patio z=12.40m)',
          pts: [[-0.45, 4.78], [-0.45, 11.80], [-3.20, 11.80], [-4.76, 12.40]]
        },
        {
          color: '#d97706',
          label: 'Colector Cloacal PVC Ø100mm Ortogonal (PASE #3 → Cám. Inspección → Séptica → Pozo Ciego)',
          pts: [[0.68, 3.28], [0.68, 12.20], [-3.60, 12.20], [-3.60, 17.50], [-3.60, 21.00]]
        }
      ];
    }

    return { pases, tableros, enchufes, llaves, conduitRoutes };
  }

  /**
   * Detección de colisión (Hit-Testing) incluyendo Pilares P1..P20, Escalera 1 y Pases/Ductos/Enchufes
   */
  hitTest(wx, wz) {
    const lvl = this.getActiveLevelData();

    if (this.showConduitsAndOutlets) {
      const { pases, tableros, enchufes, llaves } = this.getConduitsAndOutletsForLevel(this.currentLevel);
      for (const pase of pases) {
        if (Math.hypot(wx - pase.x, wz - pase.z) <= 0.36) {
          return { kind: 'pase_losa1', item: pase, locked: true };
        }
      }
      for (const tab of tableros) {
        if (Math.hypot(wx - tab.x, wz - tab.z) <= 0.40) {
          return { kind: 'tablero_mep', item: tab, locked: true };
        }
      }
      for (const toma of enchufes) {
        if (Math.hypot(wx - toma.x, wz - toma.z) <= 0.34) {
          return { kind: 'toma_electrica', item: toma, locked: true };
        }
      }
      for (const sw of llaves) {
        if (Math.hypot(wx - sw.x, wz - sw.z) <= 0.34) {
          return { kind: 'llave_3way', item: sw, locked: true };
        }
      }
    }

    for (const node of lvl.mepNodes) {
      if (Math.hypot(wx - node.x, wz - node.z) <= 0.42) {
        return { kind: 'mep', item: node, locked: false };
      }
    }

    for (const wall of lvl.walls) {
      if (Math.hypot(wx - wall.x1, wz - wall.z1) <= 0.35) {
        return { kind: 'wall_endpoint', item: wall, endpoint: 1, locked: false };
      }
      if (Math.hypot(wx - wall.x2, wz - wall.z2) <= 0.35) {
        return { kind: 'wall_endpoint', item: wall, endpoint: 2, locked: false };
      }
      const dist = this.pointToSegmentDistance(wx, wz, wall.x1, wall.z1, wall.x2, wall.z2);
      if (dist <= 0.25) {
        return { kind: 'wall', item: wall, locked: false };
      }
    }

    for (const col of FIXED_COLUMNS_AND_FOOTINGS) {
      if (Math.hypot(wx - col.x, wz - col.z) <= 0.38) {
        return { kind: 'pillar', item: col, locked: true };
      }
    }

    // Escalera 1 (Baja a Subsuelo en Eje 8–9) y Escalera 2 (Sube a Planta Alta en Eje 1–2)
    const st1 = FIXED_STRUCTURAL_GRID.existingStaircase1;
    if (this.currentLevel !== 'planta_alta' && wx >= st1.x1 && wx <= st1.x2 && wz >= st1.z1 && wz <= st1.z2) {
      return { kind: 'stair', item: st1, locked: true };
    }
    const st2 = FIXED_STRUCTURAL_GRID.existingStaircase2;
    if (st2 && this.currentLevel !== 'subsuelo' && wx >= st2.x1 && wx <= st2.x2 && wz >= st2.z1 && wz <= st2.z2) {
      return { kind: 'stair', item: st2, locked: true };
    }

    for (let i = lvl.rooms.length - 1; i >= 0; i--) {
      const r = lvl.rooms[i];
      const seX = r.x + r.w;
      const seZ = r.z + r.d;
      if (Math.hypot(wx - seX, wz - seZ) <= 0.45) {
        return { kind: 'room_handle', item: r, handle: 'se', locked: false };
      }
      if (wx >= r.x && wx <= r.x + r.w && wz >= r.z && wz <= r.z + r.d) {
        return { kind: 'room', item: r, locked: false };
      }
    }

    return null;
  }

  deleteHitElement(hit) {
    const lvl = this.getActiveLevelData();
    if (hit.kind === 'wall' || hit.kind === 'wall_endpoint') {
      lvl.walls = lvl.walls.filter((w) => w.id !== hit.item.id);
    } else if (hit.kind === 'mep') {
      lvl.mepNodes = lvl.mepNodes.filter((m) => m.id !== hit.item.id);
    }
    this.selectedElement = null;
  }

  pointToSegmentDistance(px, pz, x1, z1, x2, z2) {
    const A = px - x1;
    const B = pz - z1;
    const C = x2 - x1;
    const D = z2 - z1;
    const dot = A * C + B * D;
    const lenSq = C * C + D * D;
    const param = lenSq !== 0 ? Math.max(0, Math.min(1, dot / lenSq)) : 0;
    const xx = x1 + param * C;
    const zz = z1 + param * D;
    return Math.hypot(px - xx, pz - zz);
  }

  /**
   * Evalúa un ambiente según el Reglamento General de Construcción de la Municipalidad de Asunción
   */
  validateAsuncionCode(room, levelWalls) {
    const area = Number((room.w * room.d).toFixed(2));
    const minSide = Number(Math.min(room.w, room.d).toFixed(2));
    const rule = ASUNCION_BUILDING_CODE[room.codeType] || ASUNCION_BUILDING_CODE.habitable;

    let glazedAreaM2 = 0;
    levelWalls.forEach((w) => {
      if (w.type === 'blindex_corredizo' && w.activeStage !== false) {
        const midX = (w.x1 + w.x2) / 2;
        const midZ = (w.z1 + w.z2) / 2;
        if (
          midX >= room.x - 0.6 &&
          midX <= room.x + room.w + 0.6 &&
          midZ >= room.z - 0.6 &&
          midZ <= room.z + room.d + 0.6
        ) {
          const len = Math.hypot(w.x2 - w.x1, w.z2 - w.z1);
          glazedAreaM2 += len * 2.4;
        }
      }
    });

    if (glazedAreaM2 === 0) glazedAreaM2 = 1.80;

    const minAreaOk = area >= rule.minAreaM2;
    const minSideOk = minSide >= rule.minSideM;
    const minLightM2 = Number((area * rule.minLightRatio).toFixed(2));
    const lightOk = glazedAreaM2 >= minLightM2;

    return {
      area,
      minSide,
      ruleLabel: rule.label,
      requiredMinArea: rule.minAreaM2,
      requiredMinSide: rule.minSideM,
      minLightM2,
      glazedAreaM2: Number(glazedAreaM2.toFixed(2)),
      compliant: minAreaOk && minSideOk && lightOk,
      issues: [
        !minAreaOk ? `Área ${area}m² < mín. ${rule.minAreaM2}m²` : null,
        !minSideOk ? `Lado ${minSide}m < mín. ${rule.minSideM}m` : null,
        !lightOk ? `Ilum. ${glazedAreaM2.toFixed(1)}m² < mín. ${minLightM2}m²` : null
      ].filter(Boolean)
    };
  }

  /**
   * Calcula todos los cómputos métricos y presupuestos en Guaraníes
   */
  computeFullMetrics() {
    const totals = {
      mamposteria15M2: 0,
      mamposteria20M2: 0,
      ciclopeo30M2: 0,
      blindexM2: 0,
      revoqueHidrofugoM2: 0,
      pinturaM2: 0,
      porcelanatoM2: 0,
      activeRoomsAreaM2: 0,
      deferredRoomsAreaM2: 0,
      murosCostGs: 0,
      acabadosPisosCostGs: 0,
      mepCostGs: 0,
      deferredSavingsGs: 0,
      structuralCoreCostGs: this.includeNewSlab2AndRoof ? this.structuralCoreCostGs : 0,
      totalProjectCostGs: 0,
      byLevel: {}
    };

    Object.keys(LEVEL_DEFINITIONS).forEach((lvlKey) => {
      const lvl = this.planData.levels[lvlKey];
      const def = LEVEL_DEFINITIONS[lvlKey];
      let lvlActiveM2 = 0;
      let lvlDeferredM2 = 0;
      let lvlCostGs = 0;

      lvl.rooms.forEach((r) => {
        const area = r.w * r.d;
        const roomCost = area * (r.floorCostPerM2Gs || 175000) + (r.equipCostGs || 0);
        if (r.activeStage !== false) {
          totals.porcelanatoM2 += area;
          totals.activeRoomsAreaM2 += area;
          totals.acabadosPisosCostGs += roomCost;
          lvlActiveM2 += area;
          lvlCostGs += roomCost;
        } else {
          totals.deferredRoomsAreaM2 += area;
          totals.deferredSavingsGs += roomCost;
          lvlDeferredM2 += area;
        }
      });

      lvl.walls.forEach((w) => {
        const cat = WALL_CATALOG[w.type] || WALL_CATALOG.ladrillo_15;
        const len = Math.hypot(w.x2 - w.x1, w.z2 - w.z1);
        const area = len * (def.wallHeight || cat.heightDefault);
        const wallUnitTotal = cat.costPerM2Gs + cat.revoquePerM2Gs * 2 + cat.pinturaPerM2Gs * 2;
        const wallCost = area * wallUnitTotal;

        if (w.activeStage !== false) {
          if (w.type === 'ladrillo_15') totals.mamposteria15M2 += area;
          else if (w.type === 'ladrillo_20') totals.mamposteria20M2 += area;
          else if (w.type === 'ciclopeo_30') totals.ciclopeo30M2 += area;
          else if (w.type === 'blindex_corredizo') totals.blindexM2 += area;

          if (!cat.isGlazed) {
            totals.revoqueHidrofugoM2 += area * 2;
            totals.pinturaM2 += area * 2;
          }
          totals.murosCostGs += wallCost;
          lvlCostGs += wallCost;
        } else {
          totals.deferredSavingsGs += wallCost;
        }
      });

      lvl.mepNodes.forEach((node) => {
        const cat = MEP_NODE_CATALOG[node.type];
        if (cat) {
          totals.mepCostGs += cat.unitCostGs;
          lvlCostGs += cat.unitCostGs;
        }
      });

      totals.byLevel[lvlKey] = {
        activeM2: Number(lvlActiveM2.toFixed(1)),
        deferredM2: Number(lvlDeferredM2.toFixed(1)),
        costGs: Math.round(lvlCostGs)
      };
    });

    totals.mamposteria15M2 = Number(totals.mamposteria15M2.toFixed(1));
    totals.mamposteria20M2 = Number(totals.mamposteria20M2.toFixed(1));
    totals.ciclopeo30M2 = Number(totals.ciclopeo30M2.toFixed(1));
    totals.blindexM2 = Number(totals.blindexM2.toFixed(1));
    totals.revoqueHidrofugoM2 = Number(totals.revoqueHidrofugoM2.toFixed(1));
    totals.pinturaM2 = Number(totals.pinturaM2.toFixed(1));
    totals.porcelanatoM2 = Number(totals.porcelanatoM2.toFixed(1));
    totals.activeRoomsAreaM2 = Number(totals.activeRoomsAreaM2.toFixed(1));
    totals.deferredRoomsAreaM2 = Number(totals.deferredRoomsAreaM2.toFixed(1));

    totals.murosCostGs = Math.round(totals.murosCostGs);
    totals.acabadosPisosCostGs = Math.round(totals.acabadosPisosCostGs);
    totals.mepCostGs = Math.round(totals.mepCostGs);
    totals.deferredSavingsGs = Math.round(totals.deferredSavingsGs);
    totals.totalProjectCostGs = Math.round(
      totals.structuralCoreCostGs +
      totals.murosCostGs +
      totals.acabadosPisosCostGs +
      totals.mepCostGs
    );

    return totals;
  }

  /**
   * Recalcula métricas, actualiza el panel derecho, sincroniza con el modelo 3D y dispara onPlanChanged
   */
  recalculateAndNotify() {
    const metrics = this.computeFullMetrics();
    this.updateSidePanelUI(metrics);
    this.render();

    const planState = {
      presetId: this.planData.presetId,
      presetName: this.planData.presetName,
      currentLevel: this.currentLevel,
      levels: this.planData.levels,
      fixedGrid: FIXED_STRUCTURAL_GRID,
      fixedColumns: FIXED_COLUMNS_AND_FOOTINGS,
      metrics
    };

    if (this.sceneRef) {
      this.syncTo3DScene(this.sceneRef, planState);
    }

    if (typeof this.onPlanChanged === 'function') {
      this.onPlanChanged(planState);
    }
  }

  /**
   * Actualiza la lista de Fase de Armado de Espacios, el Inspector Estructural y el Resumen en Guaraníes
   */
  updateSidePanelUI(metrics) {
    const formatGs = (n) => Math.round(n).toLocaleString('es-PY');
    const lvl = this.getActiveLevelData();

    const stageListEl = this.container.querySelector('#fpe-stage-rooms-list');
    if (stageListEl) {
      stageListEl.innerHTML = '';
      lvl.rooms.forEach((r) => {
        const area = (r.w * r.d).toFixed(2);
        const isNow = r.activeStage !== false;
        const itemCost = Math.round(r.w * r.d * (r.floorCostPerM2Gs || 175000) + (r.equipCostGs || 0));

        const row = document.createElement('div');
        row.className = `fpe-stage-item ${isNow ? '' : 'deferred'}`;
        const displayTitle = r.shortTitle ? `${r.shortTitle}${r.subTitle ? ' — ' + r.subTitle : ''}` : r.name;
        row.innerHTML = `
          <label style="display:flex; align-items:center; gap:6px; cursor:pointer; flex:1;">
            <input type="checkbox" ${isNow ? 'checked' : ''}>
            <div>
              <div style="font-weight:700; color:#f8fafc; font-size:11.5px;">${displayTitle}</div>
              <div style="font-size:10px; color:#94a3b8;">${area} m² (${r.w.toFixed(2)}×${r.d.toFixed(2)}m) • Gs. ${formatGs(itemCost)}</div>
            </div>
          </label>
          <span style="font-size:9.5px; padding:2px 6px; border-radius:4px; font-weight:700; ${
            isNow
              ? 'background:rgba(16,185,129,0.2); color:#34d399;'
              : 'background:rgba(245,158,11,0.2); color:#fde68a;'
          }">
            ${isNow ? 'Cerrar Ahora' : 'Etapa Futura'}
          </span>
        `;
        const chk = row.querySelector('input');
        chk.addEventListener('change', (e) => {
          r.activeStage = e.target.checked;
          this.recalculateAndNotify();
        });
        stageListEl.appendChild(row);
      });
    }

    const inspectorEl = this.container.querySelector('#fpe-inspector-body');
    const tagEl = this.container.querySelector('#fpe-selected-tag');

    if (inspectorEl) {
      if (!this.selectedElement) {
        const def = LEVEL_DEFINITIONS[this.currentLevel];
        tagEl.textContent = def.cota;
        inspectorEl.innerHTML = `
          <div style="color:#94a3b8; margin-bottom:6px;">${def.description}</div>
          <div class="fpe-metric-row"><span>Grilla Estructural:</span><strong style="color:#67e8f9;">Ejes 9..1 (9.74m) × Ejes G..A (10.34m)</strong></div>
          <div class="fpe-metric-row"><span>Pilares que Mueren en PB:</span><strong style="color:#fbbf24;">P12 (6-C), P13 (5-E), P15 (8-C) ⚠️</strong></div>
          <div class="fpe-metric-row"><span>Área Activa en Nivel:</span><strong style="color:#34d399;">${metrics.byLevel[this.currentLevel].activeM2} m²</strong></div>
          <div class="fpe-metric-row"><span>En Etapa Futura:</span><strong style="color:#fde68a;">${metrics.byLevel[this.currentLevel].deferredM2} m²</strong></div>
        `;
      } else if (this.selectedElement.kind === 'pillar') {
        const p = this.selectedElement.item;
        tagEl.textContent = p.diesInPB ? '⚠️ MUERE EN PB (0.00m)' : `🔒 LLEGA A +${p.topCotaM.toFixed(2)}m`;
        inspectorEl.innerHTML = `
          <div style="font-weight:700; color:${p.diesInPB ? '#fbbf24' : '#67e8f9'}; margin-bottom:4px;">
            🔒 Pilar ${p.pilarId} • Eje ${p.axisLabel} (${p.zapataId})
          </div>
          <p style="font-size:10.5px; color:#cbd5e1; margin-bottom:6px;">
            ${p.diesInPB
              ? '⚠️ ADVERTENCIA ESTRUCTURAL: Este pilar nace en la zapata y MUERE en la Losa de Planta Baja (0.00m). No continúa en Planta Alta.'
              : `Pilar H°A° YA HORMIGONADO en Planta Baja hasta +2.88m. Continúa hasta cota +${p.topCotaM.toFixed(2)}m (${p.topLevel === 'techo' ? 'Techo +105.64m' : 'Losa PA +102.88m'}).`}
          </p>
          <div class="fpe-metric-row"><span>Coordenada Eje ${p.axisLabel}:</span><strong>X=${p.x.toFixed(2)}m, Z=${p.z.toFixed(2)}m</strong></div>
          <div class="fpe-metric-row"><span>Sección H°A° / Armadura:</span><strong>${(p.colW * 100).toFixed(0)}×${(p.colD * 100).toFixed(0)}cm • ${p.rebarSpec}</strong></div>
          <div class="fpe-metric-row"><span>Fundación (${p.zapataId}):</span><strong>${p.zapW.toFixed(2)}×${p.zapD.toFixed(2)}m</strong></div>
        `;
      } else if (this.selectedElement.kind === 'stair') {
        const st = this.selectedElement.item;
        tagEl.textContent = '🔒 ESCALERA H°A°';
        inspectorEl.innerHTML = `
          <div style="font-weight:700; color:#67e8f9; margin-bottom:4px;">🔒 ${st.name}</div>
          <div class="fpe-metric-row"><span>Coordenadas X / Z:</span><strong>X=${st.x1.toFixed(2)}..${st.x2.toFixed(2)}m / Z=${st.z1.toFixed(2)}..${st.z2.toFixed(2)}m</strong></div>
          <div class="fpe-metric-row"><span>Dimensiones Caja:</span><strong>${st.d.toFixed(2)}m × ${st.w.toFixed(2)}m (${(st.w * st.d).toFixed(2)} m²)</strong></div>
          <div class="fpe-metric-row"><span>Desnivel Salvado:</span><strong>${st.cotaStart} → ${st.cotaEnd}</strong></div>
        `;
      } else if (this.selectedElement.kind === 'pase_losa1') {
        const p = this.selectedElement.item;
        tagEl.textContent = '💎 PASE DIAMANTADO LOSA 1';
        inspectorEl.innerHTML = `
          <div style="font-weight:700; color:#f472b6; margin-bottom:4px;">🕳️ ${p.codigo} — ${p.nombre}</div>
          <div class="fpe-metric-row"><span>Coordenada Exacta:</span><strong>X=${p.x.toFixed(2)}m, Z=${p.z.toFixed(2)}m (${p.ejeRef})</strong></div>
          <div class="fpe-metric-row"><span>Diámetro Sacabocado:</span><strong>Ø ${p.diametroMm} mm (Cero corte de viguetas/vigas)</strong></div>
          <p style="font-size:10.5px; color:#cbd5e1; margin-top:4px;">${p.conductores} <em>${p.metodoEjecucion}</em></p>
        `;
      } else if (this.selectedElement.kind === 'tablero_mep') {
        const t = this.selectedElement.item;
        tagEl.textContent = '⚡ TABLERO / EQUIPO CENTRAL';
        inspectorEl.innerHTML = `
          <div style="font-weight:700; color:#fb7185; margin-bottom:4px;">⚡ ${t.displayCode} — ${t.nombre}</div>
          <div class="fpe-metric-row"><span>Coordenada:</span><strong>X=${t.x.toFixed(2)}m, Z=${t.z.toFixed(2)}m (${t.nivel})</strong></div>
          <p style="font-size:10.5px; color:#cbd5e1; margin-top:4px;">${t.especificacion}</p>
        `;
      } else if (this.selectedElement.kind === 'toma_electrica') {
        const tm = this.selectedElement.item;
        const is20A = tm.tipo === 'toma_20a';
        tagEl.textContent = is20A ? '🔌 TOMA 20A DEDICADO' : '🔌 TOMA 16A DOBLE';
        inspectorEl.innerHTML = `
          <div style="font-weight:700; color:${is20A ? '#fb923c' : '#34d399'}; margin-bottom:4px;">🔌 [${tm.codigo}] ${tm.label}</div>
          <div class="fpe-metric-row"><span>Coordenada:</span><strong>X=${tm.x.toFixed(2)}m, Z=${tm.z.toFixed(2)}m (h=${tm.pos3D[1].toFixed(2)}m)</strong></div>
          <div class="fpe-metric-row"><span>Conductores:</span><strong>${is20A ? 'Cable 4.0 mm² + Tierra (Circuito 20A)' : 'Cable 2.5 mm² + Tierra (Circuito 16A)'}</strong></div>
        `;
      } else if (this.selectedElement.kind === 'llave_3way') {
        const sw = this.selectedElement.item;
        tagEl.textContent = '💡 LLAVE ZIGBEE / 3-WAY';
        inspectorEl.innerHTML = `
          <div style="font-weight:700; color:#38bdf8; margin-bottom:4px;">💡 [${sw.codigo}] ${sw.label}</div>
          <div class="fpe-metric-row"><span>Coordenada:</span><strong>X=${sw.x.toFixed(2)}m, Z=${sw.z.toFixed(2)}m (h=${sw.pos3D[1].toFixed(2)}m)</strong></div>
          <div class="fpe-metric-row"><span>Especificación:</span><strong>Caja Profunda 5.5cm con Hilo Neutro Celeste + Zigbee 3.0</strong></div>
        `;
      } else if (this.selectedElement.kind === 'room' || this.selectedElement.kind === 'room_handle') {
        const r = this.selectedElement.item;
        const val = this.validateAsuncionCode(r, lvl.walls);
        tagEl.textContent = val.compliant ? '✅ ORD. ASUNCIÓN OK' : '⚠️ REVISAR LADO/ÁREA';
        inspectorEl.innerHTML = `
          <div style="font-weight:700; color:#fff; margin-bottom:4px;">${r.name}</div>
          <div class="fpe-metric-row"><span>Dimensiones:</span><strong>${r.w.toFixed(2)}m × ${r.d.toFixed(2)}m</strong></div>
          <div class="fpe-metric-row"><span>Área Útil:</span><strong>${val.area} m² (Mín. ${val.requiredMinArea} m²)</strong></div>
          <div class="fpe-metric-row"><span>Lado Mínimo:</span><strong>${val.minSide} m (Mín. ${val.requiredMinSide} m)</strong></div>
          <div class="fpe-metric-row"><span>Iluminación / Vent.:</span><strong>${val.glazedAreaM2} m² (Mín. ${val.minLightM2} m²)</strong></div>
          <div style="margin-top:6px;" class="${val.compliant ? 'fpe-code-ok' : 'fpe-code-warn'}">
            ${val.compliant
              ? '✔ Cumple Reglamento General de Construcción de Asunción.'
              : '⚠ Observación: ' + val.issues.join(' • ')}
          </div>
        `;
      } else if (this.selectedElement.kind === 'wall' || this.selectedElement.kind === 'wall_endpoint') {
        const w = this.selectedElement.item;
        const cat = WALL_CATALOG[w.type] || WALL_CATALOG.ladrillo_15;
        const len = Math.hypot(w.x2 - w.x1, w.z2 - w.z1);
        const h = LEVEL_DEFINITIONS[this.currentLevel].wallHeight;
        const area = len * h;
        tagEl.textContent = cat.shortName;
        inspectorEl.innerHTML = `
          <div style="font-weight:700; color:#fff; margin-bottom:4px;">${w.label || cat.name}</div>
          <div class="fpe-metric-row"><span>Coordenadas:</span><strong>(${w.x1.toFixed(2)}, ${w.z1.toFixed(2)}) → (${w.x2.toFixed(2)}, ${w.z2.toFixed(2)})</strong></div>
          <div class="fpe-metric-row"><span>Longitud / Área:</span><strong>${len.toFixed(2)} ml (${area.toFixed(1)} m²)</strong></div>
          <div class="fpe-metric-row"><span>Espesor:</span><strong>${(cat.thickness * 100).toFixed(0)} cm</strong></div>
          <div class="fpe-metric-row"><span>Fase Constructiva:</span><strong>${w.activeStage !== false ? 'Construir Ahora' : 'Etapa Futura'}</strong></div>
          <div style="margin-top:6px; display:flex; gap:6px;">
            <button class="fpe-btn" id="fpe-toggle-wall-stage" style="font-size:10px; padding:3px 8px;">
              Cambiar a ${w.activeStage !== false ? 'Etapa Futura' : 'Construir Ahora'}
            </button>
          </div>
        `;
        const btnToggle = inspectorEl.querySelector('#fpe-toggle-wall-stage');
        if (btnToggle) {
          btnToggle.addEventListener('click', () => {
            w.activeStage = w.activeStage === false;
            this.recalculateAndNotify();
          });
        }
      } else if (this.selectedElement.kind === 'mep') {
        const m = this.selectedElement.item;
        const cat = MEP_NODE_CATALOG[m.type];
        tagEl.textContent = cat.category;
        inspectorEl.innerHTML = `
          <div style="font-weight:700; color:#fff; margin-bottom:4px;">${cat.symbol} ${m.label}</div>
          <div class="fpe-metric-row"><span>Ubicación:</span><strong>X=${m.x.toFixed(2)}m, Z=${m.z.toFixed(2)}m</strong></div>
          <div class="fpe-metric-row"><span>Costo Unitario:</span><strong>Gs. ${formatGs(cat.unitCostGs)}</strong></div>
        `;
      }
    }

    const summaryEl = this.container.querySelector('#fpe-metrics-summary');
    if (summaryEl) {
      summaryEl.innerHTML = `
        <div class="fpe-metric-row">
          <span>Mampostería 15cm / 20cm a Levantar:</span>
          <strong>${metrics.mamposteria15M2} m² / ${metrics.mamposteria20M2} m²</strong>
        </div>
        <div class="fpe-metric-row">
          <span>Aberturas Blindex / Contención 30cm:</span>
          <strong>${metrics.blindexM2} m² / ${metrics.ciclopeo30M2} m²</strong>
        </div>
        <div class="fpe-metric-row">
          <span>Revoque Hidrófugo / Pintura:</span>
          <strong>${metrics.revoqueHidrofugoM2} m² / ${metrics.pinturaM2} m²</strong>
        </div>
        <div class="fpe-metric-row">
          <span>Piso Porcelanato Etapa Activa:</span>
          <strong style="color:#38bdf8;">${metrics.porcelanatoM2} m²</strong>
        </div>
        <div class="fpe-metric-row">
          <span>Losa 2do Piso (+102.88m) + Techo (+105.64m):</span>
          <strong>Gs. ${formatGs(metrics.structuralCoreCostGs)}</strong>
        </div>
        <div class="fpe-metric-row">
          <span>Muros + Pisos + Instalaciones Activas:</span>
          <strong>Gs. ${formatGs(metrics.murosCostGs + metrics.acabadosPisosCostGs + metrics.mepCostGs)}</strong>
        </div>
        <div class="fpe-metric-row" style="color:#34d399;">
          <span>Ahorro por Muros/Ambientes en Etapa Futura:</span>
          <strong>Gs. ${formatGs(metrics.deferredSavingsGs)}</strong>
        </div>
        <div style="margin-top:8px; padding-top:6px; border-top:1px solid rgba(245,158,11,0.3); display:flex; justify-content:space-between; align-items:baseline;">
          <span style="font-size:11px; font-weight:700; color:#fde68a;">INVERSIÓN ETAPA ACTIVA:</span>
          <strong style="font-size:15px; color:#fbbf24;">Gs. ${formatGs(metrics.totalProjectCostGs)}</strong>
        </div>
      `;
    }
  }

  /**
   * Renderizado principal en Canvas 2D de alta densidad (Retina) con Ejes 1..9, Ejes A..G,
   * Zapatas combinadas, Escalera 1 bloqueada y advertencia de pilares que mueren en PB.
   */
  render() {
    if (!this.ctx) return;
    const ctx = this.ctx;
    ctx.save();
    ctx.scale(this.dpr, this.dpr);

    const palettes = {
      dark_cad: {
        bg: '#040914',
        gridMinor: 'rgba(148, 163, 184, 0.06)',
        gridAxis: 'rgba(56, 189, 248, 0.30)',
        lotStroke: '#f59e0b',
        text: '#e2e8f0',
        slabStroke: '#0ea5e9'
      },
      blueprint: {
        bg: '#0a2540',
        gridMinor: 'rgba(255, 255, 255, 0.08)',
        gridAxis: 'rgba(125, 211, 252, 0.42)',
        lotStroke: '#fde047',
        text: '#f8fafc',
        slabStroke: '#38bdf8'
      },
      white_paper: {
        bg: '#f8fafc',
        gridMinor: 'rgba(15, 23, 42, 0.06)',
        gridAxis: 'rgba(2, 132, 199, 0.38)',
        lotStroke: '#d97706',
        text: '#0f172a',
        slabStroke: '#0284c7'
      }
    };
    const pal = palettes[this.theme] || palettes.dark_cad;

    ctx.fillStyle = pal.bg;
    ctx.fillRect(0, 0, this.viewW, this.viewH);

    // 1. Grilla métrica secundaria cada 1.00m
    ctx.lineWidth = 1;
    ctx.strokeStyle = pal.gridMinor;
    for (let x = -6; x <= 6; x += 1) {
      const p1 = this.worldToScreen(x, -5);
      const p2 = this.worldToScreen(x, 28);
      ctx.beginPath();
      ctx.moveTo(p1.px, p1.py);
      ctx.lineTo(p2.px, p2.py);
      ctx.stroke();
    }
    for (let z = -5; z <= 28; z += 1) {
      const p1 = this.worldToScreen(-6, z);
      const p2 = this.worldToScreen(6, z);
      ctx.beginPath();
      ctx.moveTo(p1.px, p1.py);
      ctx.lineTo(p2.px, p2.py);
      ctx.stroke();
    }

    // 2. Indicadores de Calle Guillermo Arias y Río Paraguay
    const streetPos = this.worldToScreen(0, -4.5);
    ctx.fillStyle = pal.text;
    ctx.font = 'bold 11px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('⬇️ CALLE GUILLERMO ARIAS (Cota +100.00m • Frente Lote 9.89m / Estructura 9.74m)', streetPos.px, streetPos.py);

    const riverPos = this.worldToScreen(0, 15.8);
    ctx.fillStyle = '#38bdf8';
    ctx.fillText('🌊 PATIO TRASERO (z=13.34..27.00m) Y BARRANCO AL RÍO PARAGUAY (Noroeste ⬆️)', riverPos.px, riverPos.py);

    // 3. Límite oficial del Lote (9.89m x 31.00m: z=-4.00 a z=27.00)
    const lotTL = this.worldToScreen(FIXED_STRUCTURAL_GRID.lot.minX, FIXED_STRUCTURAL_GRID.lot.minZ);
    const lotBR = this.worldToScreen(FIXED_STRUCTURAL_GRID.lot.maxX, FIXED_STRUCTURAL_GRID.lot.maxZ);
    ctx.save();
    ctx.strokeStyle = pal.lotStroke;
    ctx.lineWidth = 1.5;
    ctx.setLineDash([6, 4]);
    ctx.strokeRect(lotTL.px, lotTL.py, lotBR.px - lotTL.px, lotBR.py - lotTL.py);
    ctx.restore();

    // 4. Contorno de Losa según Nivel Activo (y Hueco 38.00 m² en Hoy en Obra)
    ctx.save();
    if (this.currentLevel === 'subsuelo') {
      const subTL = this.worldToScreen(-4.87, 3.00);
      const subBR = this.worldToScreen(4.87, 13.34);
      ctx.fillStyle = this.bankColorMode ? 'rgba(30, 41, 59, 0.25)' : 'rgba(16, 185, 129, 0.08)';
      ctx.fillRect(subTL.px, subTL.py, subBR.px - subTL.px, subBR.py - subTL.py);
      ctx.strokeStyle = this.bankColorMode ? '#94a3b8' : '#10b981';
      ctx.lineWidth = 1.6;
      ctx.strokeRect(subTL.px, subTL.py, subBR.px - subTL.px, subBR.py - subTL.py);
    } else if (this.currentLevel === 'planta_alta') {
      // Planta Alta sin balcón frontal ni Blindex frontal: inicia exactamente en Eje G (z=3.00m)
      const paTL = this.worldToScreen(-4.87, 3.00);
      const paBR = this.worldToScreen(4.87, 13.34);
      ctx.fillStyle = this.bankColorMode ? 'rgba(22, 163, 74, 0.22)' : 'rgba(245, 158, 11, 0.06)';
      ctx.fillRect(paTL.px, paTL.py, paBR.px - paTL.px, paBR.py - paTL.py);
      ctx.strokeStyle = this.bankColorMode ? '#22c55e' : '#f59e0b';
      ctx.lineWidth = 1.8;
      ctx.strokeRect(paTL.px, paTL.py, paBR.px - paTL.px, paBR.py - paTL.py);
    } else {
      if (this.planData.presetId === 'hoy_en_obra') {
        // En Hoy en Obra: L1/L2/L3 (z=9.94..13.34m) y L4 (x=-0.74..+4.87m junto a Escalera 1, z=3.00..9.94m) como losa maciza ya hormigonada
        const l4TL = this.worldToScreen(-0.74, 3.00);
        const l4BR = this.worldToScreen(4.87, 9.94);
        const l123TL = this.worldToScreen(-4.87, 9.94);
        const l123BR = this.worldToScreen(4.87, 13.34);

        ctx.fillStyle = this.bankColorMode ? 'rgba(30, 41, 59, 0.52)' : 'rgba(6, 182, 212, 0.16)';
        ctx.strokeStyle = this.bankColorMode ? '#94a3b8' : '#06b6d4';
        ctx.lineWidth = 1.8;
        ctx.fillRect(l4TL.px, l4TL.py, l4BR.px - l4TL.px, l4BR.py - l4TL.py);
        ctx.strokeRect(l4TL.px, l4TL.py, l4BR.px - l4TL.px, l4BR.py - l4TL.py);
        ctx.fillRect(l123TL.px, l123TL.py, l123BR.px - l123TL.px, l123BR.py - l123TL.py);
        ctx.strokeRect(l123TL.px, l123TL.py, l123BR.px - l123TL.px, l123BR.py - l123TL.py);

        ctx.fillStyle = '#a5f3fc';
        ctx.font = 'bold 9px IBM Plex Mono, monospace';
        ctx.textAlign = 'center';
        ctx.fillText('LOSA L4 MACIZA (Ejes 1–5) 🔒', (l4TL.px + l4BR.px) / 2, (l4TL.py + l4BR.py) / 2 - 14);
        ctx.fillText('LOSAS L1/L2/L3 MACIZAS 🔒', (l123TL.px + l123BR.px) / 2, (l123TL.py + l123BR.py) / 2 + 18);

        // SECTOR SIN LOSA / HUECO ABIERTO ENTRE VIGAS DE 38.00 m² en Eje B a Eje G (z=3.00..9.94m) y Eje 5 a Eje 9 (x=-4.87..-0.74m)
        const voidTL = this.worldToScreen(-4.87, 3.00);
        const voidBR = this.worldToScreen(-0.74, 9.94);
        ctx.fillStyle = 'rgba(239, 68, 68, 0.14)';
        ctx.fillRect(voidTL.px, voidTL.py, voidBR.px - voidTL.px, voidBR.py - voidTL.py);
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2.0;
        ctx.setLineDash([6, 4]);
        ctx.strokeRect(voidTL.px, voidTL.py, voidBR.px - voidTL.px, voidBR.py - voidTL.py);

        // Diagonales en X de vacío estructural (igual que en el plano E3)
        ctx.beginPath();
        ctx.moveTo(voidTL.px, voidTL.py);
        ctx.lineTo(voidBR.px, voidBR.py);
        ctx.moveTo(voidBR.px, voidTL.py);
        ctx.lineTo(voidTL.px, voidBR.py);
        ctx.stroke();
        ctx.setLineDash([]);

        const vcx = (voidTL.px + voidBR.px) / 2;
        const vcy = (voidTL.py + voidBR.py) / 2;
        ctx.fillStyle = 'rgba(15, 23, 42, 0.90)';
        ctx.fillRect(vcx - 76, vcy - 20, 152, 38);
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 1.4;
        ctx.strokeRect(vcx - 76, vcy - 20, 152, 38);
        ctx.fillStyle = '#fde047';
        ctx.font = 'bold 9px IBM Plex Mono, monospace';
        ctx.fillText('SIN LOSA: 38,00 m²', vcx, vcy - 4);
        ctx.fillStyle = '#fca5a5';
        ctx.font = 'bold 8px IBM Plex Mono, monospace';
        ctx.fillText('Cierre Loza Rap (E5–E9)', vcx, vcy + 10);
      } else {
        const pbTL = this.worldToScreen(-4.87, 3.00);
        const pbBR = this.worldToScreen(4.87, 13.34);
        ctx.fillStyle = this.bankColorMode ? 'rgba(245, 158, 11, 0.14)' : 'rgba(6, 182, 212, 0.06)';
        ctx.fillRect(pbTL.px, pbTL.py, pbBR.px - pbTL.px, pbBR.py - pbTL.py);
        ctx.strokeStyle = this.bankColorMode ? '#f59e0b' : pal.slabStroke;
        ctx.lineWidth = 1.6;
        ctx.strokeRect(pbTL.px, pbTL.py, pbBR.px - pbTL.px, pbBR.py - pbTL.py);

        // Indicador de Paño Loza Rap 38,00 m² (Eje 5–9 × Eje B–G) que cierra el sector sin losa de Losa 1 en Etapa 1
        const lrTL = this.worldToScreen(-4.87, 3.00);
        const lrBR = this.worldToScreen(-0.74, 9.94);
        ctx.save();
        ctx.strokeStyle = this.bankColorMode ? '#22c55e' : 'rgba(245, 158, 11, 0.65)';
        ctx.lineWidth = 1.4;
        ctx.setLineDash([6, 4]);
        ctx.strokeRect(lrTL.px, lrTL.py, lrBR.px - lrTL.px, lrBR.py - lrTL.py);
        ctx.fillStyle = this.bankColorMode ? '#86efac' : '#fde68a';
        ctx.font = 'bold 8px IBM Plex Mono, monospace';
        ctx.textAlign = 'left';
        ctx.fillText('LOZA RAP 38m² (Eje 5–9)', lrTL.px + 5, lrTL.py + 11);
        ctx.restore();
      }
    }
    ctx.restore();

    // 5. Ejes Estructurales Exactos: 9 Ejes en X (Eje 9 a Eje 1) y 7 Ejes en Z (Eje G a Eje A)
    ctx.save();
    ctx.strokeStyle = pal.gridAxis;
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);

    FIXED_STRUCTURAL_GRID.xAxes.forEach((ax) => {
      const p1 = this.worldToScreen(ax.x, 1.50);
      const p2 = this.worldToScreen(ax.x, 14.30);
      ctx.beginPath();
      ctx.moveTo(p1.px, p1.py);
      ctx.lineTo(p2.px, p2.py);
      ctx.stroke();

      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 9.5px IBM Plex Mono, monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`E${ax.id}`, p1.px, p1.py - 4);
    });

    FIXED_STRUCTURAL_GRID.zAxes.forEach((az) => {
      const p1 = this.worldToScreen(-5.30, az.z);
      const p2 = this.worldToScreen(5.30, az.z);
      ctx.beginPath();
      ctx.moveTo(p1.px, p1.py);
      ctx.lineTo(p2.px, p2.py);
      ctx.stroke();

      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 9px IBM Plex Mono, monospace';
      ctx.textAlign = 'right';
      ctx.fillText(`Eje ${az.id} (${az.z.toFixed(2)}m)`, p1.px - 6, p1.py + 3);
    });
    ctx.restore();

    // 6. Línea del Muro de Contención Frontal sobre Calle Guillermo Arias + Elementos de Cochera Frontal 🔒
    const rw = FIXED_STRUCTURAL_GRID.retainingWallFront;
    const rw1 = this.worldToScreen(rw.x1, rw.z1);
    const rw2 = this.worldToScreen(rw.x2, rw.z2);
    ctx.save();
    ctx.strokeStyle = this.bankColorMode ? '#dc2626' : '#64748b';
    ctx.lineWidth = Math.max(4, rw.thickness * this.zoom);
    ctx.beginPath();
    ctx.moveTo(rw1.px, rw1.py);
    ctx.lineTo(rw2.px, rw2.py);
    ctx.stroke();

    if (this.currentLevel === 'planta_baja') {
      // 6a. Piso de Rejilla Metálica Electroforjada Transitable + Rejas Laterales sobre cámara de oxigenación (z=1.50..3.00m)
      const rejTL = this.worldToScreen(-4.87, 1.50);
      const rejBR = this.worldToScreen(4.87, 3.00);
      ctx.fillStyle = 'rgba(14, 165, 233, 0.14)';
      ctx.fillRect(rejTL.px, rejTL.py, rejBR.px - rejTL.px, rejBR.py - rejTL.py);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1.2;
      ctx.strokeRect(rejTL.px, rejTL.py, rejBR.px - rejTL.px, rejBR.py - rejTL.py);
      for (let gx = -4.5; gx <= 4.5; gx += 0.6) {
        const gp1 = this.worldToScreen(gx, 1.50);
        const gp2 = this.worldToScreen(gx, 3.00);
        ctx.beginPath();
        ctx.moveTo(gp1.px, gp1.py);
        ctx.lineTo(gp2.px, gp2.py);
        ctx.stroke();
      }
      ctx.fillStyle = '#bae6fd';
      ctx.font = 'bold 8px IBM Plex Mono, monospace';
      ctx.textAlign = 'center';
      ctx.fillText(
        'REJILLA ELECTROFORJADA + MURO CONTENCIÓN (z=1.50..3.00m)',
        (rejTL.px + rejBR.px) / 2,
        (rejTL.py + rejBR.py) / 2 + 3
      );

      // 6b. Pérgola de Madera con Enredadera y Techo Translúcido Antigranizo (x=-0.50..+4.50m, z=-3.80..+2.80m)
      const pergTL = this.worldToScreen(-0.50, -3.80);
      const pergBR = this.worldToScreen(4.50, 2.80);
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 1.4;
      ctx.setLineDash([5, 3]);
      ctx.strokeRect(pergTL.px, pergTL.py, pergBR.px - pergTL.px, pergBR.py - pergTL.py);
      ctx.setLineDash([]);
      ctx.fillStyle = '#6ee7b7';
      ctx.font = 'bold 8px IBM Plex Mono, monospace';
      ctx.fillText(
        '🌿 PÉRGOLA COCHERA ANTIGRANIZO',
        (pergTL.px + pergBR.px) / 2,
        pergTL.py + 13
      );

      // 6c. Muro Frontal 100% Ciego en z=-4.00m con Portón Balancín 2.30m (x=+1.20..+3.50m) y Portoncito Peatonal 0.95m (x=-2.20..-1.25m)
      const mf1 = this.worldToScreen(-4.87, -4.00);
      const mf2 = this.worldToScreen(4.87, -4.00);
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(mf1.px, mf1.py);
      ctx.lineTo(mf2.px, mf2.py);
      ctx.stroke();

      const porton1 = this.worldToScreen(1.20, -4.00);
      const porton2 = this.worldToScreen(3.50, -4.00);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(porton1.px, porton1.py);
      ctx.lineTo(porton2.px, porton2.py);
      ctx.stroke();
      ctx.fillStyle = '#7dd3fc';
      ctx.font = 'bold 8px IBM Plex Mono, monospace';
      ctx.fillText('PORTÓN 2.30m', (porton1.px + porton2.px) / 2, porton1.py - 6);

      const peat1 = this.worldToScreen(-2.20, -4.00);
      const peat2 = this.worldToScreen(-1.25, -4.00);
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(peat1.px, peat1.py);
      ctx.lineTo(peat2.px, peat2.py);
      ctx.stroke();
      ctx.fillStyle = '#fde68a';
      ctx.fillText('PEATONAL 0.95m', (peat1.px + peat2.px) / 2, peat1.py - 6);
    }
    ctx.restore();

    const lvl = this.getActiveLevelData();

    // 7. Ambientes Propuestos (Con recorte clip() por caja y títulos cortos limpios sin solapamiento)
    lvl.rooms.forEach((room) => {
      if (this.planData.presetId === 'hoy_en_obra' && this.currentLevel === 'planta_baja' && room.id.endsWith('_estar')) {
        // El sector sin losa de 38.00 m² (Ejes 5–9) ya se dibuja con sus diagonales estructurales X en Hoy en Obra
        return;
      }
      const tl = this.worldToScreen(room.x, room.z);
      const br = this.worldToScreen(room.x + room.w, room.z + room.d);
      const rwPx = br.px - tl.px;
      const rdPx = br.py - tl.py;
      const isSelected = this.selectedElement?.item?.id === room.id;
      const isNow = room.activeStage !== false;
      const codeCheck = this.validateAsuncionCode(room, lvl.walls);

      ctx.save();
      if (this.bankColorMode) {
        const isYellowRefurb = room.id === 'sub_camara_aislacion_frontal';
        const isGreenConcrete = room.id === 'sub_piscina_futura' || this.currentLevel === 'planta_alta';
        ctx.fillStyle = isYellowRefurb
          ? 'rgba(245, 158, 11, 0.28)'
          : isGreenConcrete
            ? 'rgba(22, 163, 74, 0.22)'
            : isNow
              ? 'rgba(220, 38, 38, 0.20)'
              : 'rgba(148, 163, 184, 0.08)';
      } else {
        ctx.fillStyle = isNow ? (room.color || 'rgba(6, 182, 212, 0.18)') : 'rgba(148, 163, 184, 0.05)';
      }
      ctx.fillRect(tl.px, tl.py, rwPx, rdPx);

      ctx.strokeStyle = isSelected
        ? '#fbbf24'
        : this.bankColorMode
          ? (room.id === 'sub_camara_aislacion_frontal' ? '#f59e0b' : room.id === 'sub_piscina_futura' ? '#22c55e' : '#ef4444')
          : !codeCheck.compliant
            ? '#ef4444'
            : isNow
              ? 'rgba(56, 189, 248, 0.55)'
              : 'rgba(148, 163, 184, 0.32)';
      ctx.lineWidth = isSelected ? 2.2 : 1.4;
      if (!isNow) ctx.setLineDash([5, 4]);
      ctx.strokeRect(tl.px, tl.py, rwPx, rdPx);
      ctx.setLineDash([]);

      // Recortar texto estrictamente dentro del rectángulo del ambiente para que JAMÁS desborde a ambientes vecinos
      if (rwPx > 28 && rdPx > 20) {
        ctx.save();
        ctx.beginPath();
        ctx.rect(tl.px + 2, tl.py + 2, Math.max(1, rwPx - 4), Math.max(1, rdPx - 4));
        ctx.clip();

        const cx = tl.px + rwPx / 2;
        const cy = tl.py + rdPx / 2;
        const titleStr = room.shortTitle || String(room.name || '').split('(')[0].trim();
        const dimStr = `${codeCheck.area} m² (${room.w.toFixed(2)}×${room.d.toFixed(2)}m)`;
        const showSub = Boolean(room.subTitle && rdPx >= 54 && rwPx >= 95);

        const pillW = Math.min(rwPx - 6, Math.max(76, titleStr.length * 6.5 + 16));
        const pillH = showSub ? 38 : (rdPx >= 34 ? 26 : 16);
        ctx.fillStyle = this.theme === 'white_paper' ? 'rgba(255, 255, 255, 0.84)' : 'rgba(7, 17, 32, 0.78)';
        ctx.fillRect(cx - pillW / 2, cy - pillH / 2, pillW, pillH);

        ctx.fillStyle = pal.text;
        ctx.font = rwPx < 75 ? 'bold 8px Inter, sans-serif' : 'bold 9.5px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        if (rdPx < 34) {
          ctx.fillText(titleStr, cx, cy);
        } else if (!showSub) {
          ctx.fillText(titleStr, cx, cy - 5);
          ctx.font = '8px IBM Plex Mono, monospace';
          ctx.fillStyle = isNow ? '#67e8f9' : '#fde68a';
          ctx.fillText(dimStr, cx, cy + 6);
        } else {
          ctx.fillText(titleStr, cx, cy - 11);
          ctx.font = '8.5px IBM Plex Mono, monospace';
          ctx.fillStyle = isNow ? '#67e8f9' : '#fde68a';
          ctx.fillText(dimStr, cx, cy + 1);
          ctx.font = '7.5px Inter, sans-serif';
          ctx.fillStyle = '#cbd5e1';
          ctx.fillText(room.subTitle, cx, cy + 12);
        }
        ctx.restore();
      }

      ctx.fillStyle = isSelected ? '#fbbf24' : '#38bdf8';
      ctx.fillRect(br.px - 4, br.py - 4, 7, 7);
      ctx.restore();
    });

    // 7a-bis. Geometría explícita del Pozo Ciego Ø1.80m + Cámara Séptica + Colector Cloacal desde Núcleo Eje F–G (en Subsuelo)
    if (this.currentLevel === 'subsuelo') {
      const pozoCenter = this.worldToScreen(-3.45, 17.20);
      const pozoRadiusPx = 0.90 * this.zoom; // Ø 1.80m
      const camTL = this.worldToScreen(-4.15, 14.35);
      const camBR = this.worldToScreen(-2.75, 15.65);
      const colStart = this.worldToScreen(0.68, 3.28);
      const colMid1 = this.worldToScreen(0.68, 11.80);
      const colMid2 = this.worldToScreen(-3.45, 11.80);
      const colEnd = this.worldToScreen(-3.45, 14.35);

      ctx.save();
      ctx.fillStyle = this.bankColorMode ? 'rgba(220, 38, 38, 0.35)' : 'rgba(245, 158, 11, 0.32)';
      ctx.strokeStyle = this.bankColorMode ? '#ef4444' : '#fbbf24';
      ctx.lineWidth = 1.6;
      ctx.fillRect(camTL.px, camTL.py, camBR.px - camTL.px, camBR.py - camTL.py);
      ctx.strokeRect(camTL.px, camTL.py, camBR.px - camTL.px, camBR.py - camTL.py);

      ctx.beginPath();
      ctx.arc(pozoCenter.px, pozoCenter.py, pozoRadiusPx, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#fef08a';
      ctx.font = 'bold 8.5px IBM Plex Mono, monospace';
      ctx.textAlign = 'center';
      ctx.fillText('POZO CIEGO Ø1.80m', pozoCenter.px, pozoCenter.py + 3);

      ctx.strokeStyle = this.bankColorMode ? '#ef4444' : '#fb923c';
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 4]);
      ctx.beginPath();
      ctx.moveTo(colStart.px, colStart.py);
      ctx.lineTo(colMid1.px, colMid1.py);
      ctx.lineTo(colMid2.px, colMid2.py);
      ctx.lineTo(colEnd.px, colEnd.py);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = '#fdba74';
      ctx.fillText('⬇️ Colector Cloacal PVC Ø100mm (Pendiente >=2%)', (colMid1.px + colMid2.px) / 2, colMid1.py - 6);
      ctx.restore();
    }

    // 7b. Escaleras en Costados Opuestos:
    // - Escalera 1 (Baja a Subsuelo, -2.34m) en costado Este Eje 1–2 (x=+3.84..+4.87m, z=5.26..8.56m)
    // - Escalera 2 (Sube a Planta Alta, +2.88m) en costado Oeste Eje 8–9 (x=-4.87..-3.84m, z=5.26..9.16m)
    const drawStaircaseBox = (st, labelTop, labelBottom) => {
      if (!st) return;
      const stl = this.worldToScreen(st.x1, st.z1);
      const sbr = this.worldToScreen(st.x2, st.z2);
      const sw = sbr.px - stl.px;
      const sh = sbr.py - stl.py;

      ctx.save();
      ctx.fillStyle = this.bankColorMode ? 'rgba(15, 23, 42, 0.78)' : 'rgba(14, 165, 233, 0.24)';
      ctx.strokeStyle = this.bankColorMode ? '#94a3b8' : '#38bdf8';
      ctx.lineWidth = 1.6;
      ctx.fillRect(stl.px, stl.py, sw, sh);
      ctx.strokeRect(stl.px, stl.py, sw, sh);

      const steps = 12;
      ctx.strokeStyle = this.bankColorMode ? 'rgba(148, 163, 184, 0.55)' : 'rgba(125, 211, 252, 0.55)';
      ctx.lineWidth = 1;
      for (let i = 1; i < steps; i++) {
        const sy = stl.py + (sh * i) / steps;
        ctx.beginPath();
        ctx.moveTo(stl.px, sy);
        ctx.lineTo(sbr.px, sy);
        ctx.stroke();
      }

      ctx.fillStyle = 'rgba(7, 17, 32, 0.82)';
      ctx.fillRect(stl.px + 2, stl.py + sh / 2 - 13, Math.max(10, sw - 4), 24);
      ctx.fillStyle = '#e0f2fe';
      ctx.font = 'bold 7.5px IBM Plex Mono, monospace';
      ctx.textAlign = 'center';
      ctx.fillText(labelTop, stl.px + sw / 2, stl.py + sh / 2 - 3);
      ctx.fillStyle = '#7dd3fc';
      ctx.font = '7px IBM Plex Mono, monospace';
      ctx.fillText(labelBottom, stl.px + sw / 2, stl.py + sh / 2 + 7);
      ctx.restore();
    };

    if (this.currentLevel === 'subsuelo' || this.currentLevel === 'planta_baja') {
      drawStaircaseBox(
        FIXED_STRUCTURAL_GRID.existingStaircase1,
        'ESC. 1🔒',
        'Subsuelo'
      );
    }
    if (this.currentLevel === 'planta_baja' || this.currentLevel === 'planta_alta') {
      drawStaircaseBox(
        FIXED_STRUCTURAL_GRID.existingStaircase2,
        'ESC. 2🔒',
        'Sube PA'
      );
    }

    // 8. Muros Propuestos Editables y Ventanales Blindex
    lvl.walls.forEach((wall) => {
      const cat = WALL_CATALOG[wall.type] || WALL_CATALOG.ladrillo_15;
      const p1 = this.worldToScreen(wall.x1, wall.z1);
      const p2 = this.worldToScreen(wall.x2, wall.z2);
      const isSelected = this.selectedElement?.item?.id === wall.id;
      const isNow = wall.activeStage !== false;

      ctx.save();
      ctx.lineCap = 'round';
      ctx.lineWidth = Math.max(4, cat.thickness * this.zoom);
      ctx.strokeStyle = isSelected
        ? '#fbbf24'
        : this.bankColorMode
          ? '#dc2626' // 🔴 ROJO: Muro/cerramiento nuevo a construir
          : cat.color;
      if (!isNow) {
        ctx.setLineDash([5, 5]);
        ctx.globalAlpha = 0.45;
      }
      ctx.beginPath();
      ctx.moveTo(p1.px, p1.py);
      ctx.lineTo(p2.px, p2.py);
      ctx.stroke();

      if (cat.isGlazed && isNow) {
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = this.bankColorMode ? '#fca5a5' : '#e0f2fe';
        ctx.beginPath();
        ctx.moveTo(p1.px, p1.py);
        ctx.lineTo(p2.px, p2.py);
        ctx.stroke();
      }

      if (isSelected) {
        [p1, p2].forEach((pt) => {
          ctx.fillStyle = '#fbbf24';
          ctx.beginPath();
          ctx.arc(pt.px, pt.py, 5, 0, Math.PI * 2);
          ctx.fill();
        });
      }
      ctx.restore();
    });

    if (this.dragState?.mode === 'draw_wall' && this.tempWallStart) {
      const p1 = this.worldToScreen(this.tempWallStart.x, this.tempWallStart.z);
      const p2 = this.worldToScreen(this.hoverWorldPos.x, this.hoverWorldPos.z);
      const len = Math.hypot(
        this.hoverWorldPos.x - this.tempWallStart.x,
        this.hoverWorldPos.z - this.tempWallStart.z
      );
      ctx.save();
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 5;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(p1.px, p1.py);
      ctx.lineTo(p2.px, p2.py);
      ctx.stroke();
      ctx.fillStyle = '#fde68a';
      ctx.font = 'bold 11px IBM Plex Mono, monospace';
      ctx.fillText(`${len.toFixed(2)} m`, (p1.px + p2.px) / 2 + 8, (p1.py + p2.py) / 2 - 8);
      ctx.restore();
    }

    // 9. 14 Zapatas (incluyendo combinadas) y 20 Pilares H°A° (P1..P20)
    const drawnCombinedFootings = new Set();
    FIXED_COLUMNS_AND_FOOTINGS.forEach((col) => {
      if (!col.combinedGroup || !drawnCombinedFootings.has(col.combinedGroup)) {
        if (col.combinedGroup) drawnCombinedFootings.add(col.combinedGroup);
        const zCenter = this.worldToScreen(col.zapCenterX, col.zapCenterZ);
        const zapW = col.zapW * this.zoom;
        const zapD = col.zapD * this.zoom;

        ctx.save();
        ctx.strokeStyle = this.bankColorMode
          ? '#64748b'
          : col.combinedGroup
            ? 'rgba(56, 189, 248, 0.35)'
            : 'rgba(6, 182, 212, 0.24)';
        ctx.lineWidth = 1;
        ctx.setLineDash([2, 2]);
        ctx.strokeRect(zCenter.px - zapW / 2, zCenter.py - zapD / 2, zapW, zapD);
        ctx.restore();
      }

      const center = this.worldToScreen(col.x, col.z);
      const colW = Math.max(6, col.colW * this.zoom);
      const colD = Math.max(6, col.colD * this.zoom);
      const isHoveredSnap = this.hoverWorldPos?.snappedToPillar === col.pilarId;
      const isDeadInPA = this.currentLevel === 'planta_alta' && col.diesInPB;

      ctx.save();
      if (isDeadInPA) {
        ctx.fillStyle = 'rgba(245, 158, 11, 0.18)';
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 1.8;
        ctx.setLineDash([3, 2]);
        ctx.fillRect(center.px - colW / 2, center.py - colD / 2, colW, colD);
        ctx.strokeRect(center.px - colW / 2, center.py - colD / 2, colW, colD);
        ctx.setLineDash([]);

        ctx.fillStyle = '#fbbf24';
        ctx.font = 'bold 8px IBM Plex Mono, monospace';
        ctx.textAlign = 'left';
        ctx.fillText(`${col.pilarId}(PB)`, center.px + colW / 2 + 2, center.py + 2);
      } else {
        const isPBHormigonado288 = !col.diesInPB && this.currentLevel === 'planta_baja';
        const pillarFill = isHoveredSnap
          ? '#fbbf24'
          : this.bankColorMode
            ? (this.currentLevel === 'planta_alta' ? '#16a34a' : '#1e293b')
            : isPBHormigonado288 && this.planData.presetId === 'hoy_en_obra'
              ? '#10b981'
              : '#06b6d4';
        const pillarStroke = this.bankColorMode
          ? (this.currentLevel === 'planta_alta' ? '#86efac' : '#f8fafc')
          : '#083344';
        ctx.fillStyle = pillarFill;
        ctx.strokeStyle = pillarStroke;
        ctx.lineWidth = 1.5;
        ctx.fillRect(center.px - colW / 2, center.py - colD / 2, colW, colD);
        ctx.strokeRect(center.px - colW / 2, center.py - colD / 2, colW, colD);

        ctx.fillStyle = this.theme === 'white_paper' ? '#0f172a' : (this.bankColorMode ? '#f8fafc' : '#a5f3fc');
        ctx.font = 'bold 8px IBM Plex Mono, monospace';
        ctx.textAlign = 'left';
        ctx.fillText(col.pilarId, center.px + colW / 2 + 2, center.py - 1);
      }
      ctx.restore();
    });

    // 10. Nodos de Instalaciones editables del nivel
    lvl.mepNodes.forEach((node) => {
      const cat = MEP_NODE_CATALOG[node.type] || MEP_NODE_CATALOG.cctv_poe;
      const pt = this.worldToScreen(node.x, node.z);
      const isSelected = this.selectedElement?.item?.id === node.id;

      ctx.save();
      ctx.fillStyle = cat.color;
      ctx.strokeStyle = isSelected ? '#fbbf24' : '#ffffff';
      ctx.lineWidth = isSelected ? 2.2 : 1.1;
      ctx.beginPath();
      ctx.arc(pt.px, pt.py, 6.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.font = '8.5px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(cat.symbol, pt.px, pt.py);

      if (this.zoom >= 46 || isSelected) {
        ctx.font = 'bold 7.5px IBM Plex Mono, monospace';
        ctx.fillStyle = pal.text;
        ctx.fillText(cat.code, pt.px, pt.py + 11);
      }
      ctx.restore();
    });

    // 11. CAPA DE DUCTOS, 4 PASES DIAMANTADOS EN LOSA 1, TABLEROS SMART DIN Y 26 ENCHUFES (20A / 16A) + LLAVES 3-WAY
    if (this.showConduitsAndOutlets) {
      const { pases, tableros, enchufes, llaves, conduitRoutes } = this.getConduitsAndOutletsForLevel(this.currentLevel);
      const showDetailedCodes = this.zoom >= 48;

      ctx.save();
      conduitRoutes.forEach((route) => {
        if (!route.pts || route.pts.length < 2) return;
        ctx.strokeStyle = route.color || '#f97316';
        ctx.lineWidth = 1.8;
        ctx.setLineDash([4, 3]);
        ctx.globalAlpha = 0.85;
        ctx.beginPath();
        route.pts.forEach(([rx, rz], idx) => {
          const sp = this.worldToScreen(rx, rz);
          if (idx === 0) ctx.moveTo(sp.px, sp.py);
          else ctx.lineTo(sp.px, sp.py);
        });
        ctx.stroke();
      });
      ctx.restore();

      pases.forEach((pase, pIdx) => {
        const pt = this.worldToScreen(pase.x, pase.z);
        const isSel = this.selectedElement?.item?.id === pase.id;
        ctx.save();
        ctx.fillStyle = '#ec4899';
        ctx.strokeStyle = isSel ? '#fde047' : '#ffffff';
        ctx.lineWidth = isSel ? 2.4 : 1.5;
        ctx.beginPath();
        ctx.arc(pt.px, pt.py, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 7.5px IBM Plex Mono, monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`P${pIdx + 1}`, pt.px, pt.py);

        if (showDetailedCodes || isSel) {
          ctx.fillStyle = '#f472b6';
          ctx.font = 'bold 8px IBM Plex Mono, monospace';
          ctx.fillText(`${pase.shortTag} Ø${pase.diametroMm}`, pt.px, pt.py - 12);
        }
        ctx.restore();
      });

      tableros.forEach((tab) => {
        const pt = this.worldToScreen(tab.x, tab.z);
        const isSel = this.selectedElement?.item?.id === tab.id;
        const isWater = tab.id.startsWith('HID_');
        ctx.save();
        ctx.fillStyle = isWater ? '#0284c7' : '#ef4444';
        ctx.strokeStyle = isSel ? '#fde047' : '#ffffff';
        ctx.lineWidth = isSel ? 2.2 : 1.3;
        ctx.fillRect(pt.px - 8, pt.py - 6, 16, 12);
        ctx.strokeRect(pt.px - 8, pt.py - 6, 16, 12);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 7.5px IBM Plex Mono, monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(isWater ? '🚰' : '⚡', pt.px, pt.py);

        ctx.fillStyle = isWater ? '#38bdf8' : '#fca5a5';
        ctx.font = 'bold 7.5px IBM Plex Mono, monospace';
        ctx.fillText(tab.displayCode.split(' ')[0], pt.px, pt.py + 12);
        ctx.restore();
      });

      enchufes.forEach((toma) => {
        const pt = this.worldToScreen(toma.x, toma.z);
        const is20A = toma.tipo === 'toma_20a';
        const isSel = this.selectedElement?.item?.id === toma.id;
        ctx.save();
        ctx.fillStyle = is20A ? '#f97316' : '#10b981';
        ctx.strokeStyle = isSel ? '#fde047' : '#0f172a';
        ctx.lineWidth = isSel ? 2.2 : 1.0;
        ctx.beginPath();
        ctx.arc(pt.px, pt.py, 5.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 6.5px IBM Plex Mono, monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(is20A ? '20' : '16', pt.px, pt.py);

        if (showDetailedCodes || isSel) {
          ctx.fillStyle = is20A ? '#fdba74' : '#6ee7b7';
          ctx.font = 'bold 7px IBM Plex Mono, monospace';
          ctx.fillText(toma.codigo, pt.px, pt.py + 10);
        }
        ctx.restore();
      });

      llaves.forEach((sw) => {
        const pt = this.worldToScreen(sw.x, sw.z);
        const isSel = this.selectedElement?.item?.id === sw.id;
        ctx.save();
        ctx.fillStyle = '#38bdf8';
        ctx.strokeStyle = isSel ? '#fde047' : '#0f172a';
        ctx.lineWidth = isSel ? 2.2 : 1.0;
        ctx.beginPath();
        ctx.moveTo(pt.px, pt.py - 5.5);
        ctx.lineTo(pt.px + 5.5, pt.py);
        ctx.lineTo(pt.px, pt.py + 5.5);
        ctx.lineTo(pt.px - 5.5, pt.py);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        if (showDetailedCodes || isSel) {
          ctx.fillStyle = '#7dd3fc';
          ctx.font = 'bold 7px IBM Plex Mono, monospace';
          ctx.textAlign = 'center';
          ctx.fillText(sw.codigo, pt.px, pt.py - 8);
        }
        ctx.restore();
      });
    }

    ctx.restore();
  }

  /**
   * Sincroniza en vivo los muros, aberturas y pisos editados con el motor Three.js (scene.js)
   */
  syncTo3DScene(sceneInstance, planState = null) {
    if (!sceneInstance || !sceneInstance.scene) return;
    if (typeof sceneInstance.updateFromFloorplan === 'function') {
      sceneInstance.updateFromFloorplan(planState || {
        levels: this.planData.levels,
        metrics: this.computeFullMetrics()
      });
    }
  }

  /**
   * Guarda el estado actual en localStorage (v6)
   */
  saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.planData));
      const btn = this.container.querySelector('#fpe-btn-save-local');
      if (btn) {
        const prev = btn.textContent;
        btn.textContent = '✔ Guardado';
        setTimeout(() => { btn.textContent = prev; }, 1600);
      }
    } catch (err) {
      console.error('Error al guardar plano en localStorage:', err);
    }
  }

  /**
   * Carga el diseño guardado en localStorage (v6) si existe
   */
  loadFromStorage() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (parsed && parsed.levels && parsed.levels.planta_baja) {
        return parsed;
      }
    } catch (err) {
      console.warn('No se pudo recuperar plano previo de localStorage:', err);
    }
    return null;
  }

  /**
   * Genera el documento SVG vectorial a Escala CAD 1:50 para cualquier lámina del proyecto
   * (`planta_baja`, `planta_alta`, `subsuelo` o `instalaciones_eje_fg`).
   */
  generateSheetSVG(sheetSpec = {}) {
    const levelKey = sheetSpec.levelKey || this.currentLevel;
    const sheetTitle = sheetSpec.sheetTitle || LEVEL_DEFINITIONS[levelKey]?.fullTitle || 'Lámina CAD';
    const forceMepOverlay = Boolean(sheetSpec.forceMepOverlay);

    const scale = 50; // 1 metro = 50 unidades SVG (Escala CAD 1:50)
    const originX = 220;
    const originZ = 240;
    const svgW = 900;
    const svgH = 1220;

    const toX = (x) => Number((originX + (x + 5.0) * scale).toFixed(2));
    const toY = (z) => Number((originZ + z * scale).toFixed(2));

    const def = LEVEL_DEFINITIONS[levelKey] || LEVEL_DEFINITIONS.planta_baja;
    const lvl = this.planData.levels[levelKey] || this.getActiveLevelData();
    const metrics = this.computeFullMetrics();
    const formatGs = (n) => Math.round(n).toLocaleString('es-PY');
    const dateStr = new Date().toISOString().slice(0, 10);
    const totalMurosM2 = Number(
      (metrics.mamposteria15M2 + metrics.mamposteria20M2 + metrics.ciclopeo30M2 + metrics.blindexM2).toFixed(1)
    );

    const escXml = (str) =>
      String(str || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');

    const lines = [];
    lines.push(`<?xml version="1.0" encoding="UTF-8"?>`);
    lines.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${svgW} ${svgH}" width="${svgW}mm" height="${svgH}mm" style="background:#071120; font-family:'IBM Plex Mono', 'Inter', monospace;">`);

    // Marco exterior CAD
    lines.push(`  <rect x="15" y="15" width="${svgW - 30}" height="${svgH - 30}" fill="#071120" stroke="#38bdf8" stroke-width="2"/>`);
    lines.push(`  <rect x="22" y="22" width="${svgW - 44}" height="${svgH - 44}" fill="none" stroke="#1e293b" stroke-width="1"/>`);

    // Límite del lote (9.89m x 31.00m)
    const lotX = toX(FIXED_STRUCTURAL_GRID.lot.minX);
    const lotY = toY(FIXED_STRUCTURAL_GRID.lot.minZ);
    const lotW = Number((FIXED_STRUCTURAL_GRID.lot.width * scale).toFixed(2));
    const lotH = Number((FIXED_STRUCTURAL_GRID.lot.depth * scale).toFixed(2));
    lines.push(`  <rect x="${lotX}" y="${lotY}" width="${lotW}" height="${lotH}" fill="none" stroke="#f59e0b" stroke-width="1.5" stroke-dasharray="8,5"/>`);

    // Grilla de Ejes X (Eje 9 a Eje 1)
    FIXED_STRUCTURAL_GRID.xAxes.forEach((ax) => {
      const xPx = toX(ax.x);
      const y1 = toY(1.20);
      const y2 = toY(14.50);
      lines.push(`  <line x1="${xPx}" y1="${y1}" x2="${xPx}" y2="${y2}" stroke="#0284c7" stroke-width="0.9" stroke-dasharray="4,4"/>`);
      lines.push(`  <circle cx="${xPx}" cy="${y1 - 14}" r="11" fill="#0f172a" stroke="#38bdf8" stroke-width="1.2"/>`);
      lines.push(`  <text x="${xPx}" y="${y1 - 10}" fill="#38bdf8" font-size="10" font-weight="bold" text-anchor="middle">${ax.id}</text>`);
      lines.push(`  <text x="${xPx}" y="${y1 - 28}" fill="#94a3b8" font-size="7.5" text-anchor="middle">${ax.planCoordM.toFixed(2)}m</text>`);
    });

    // Grilla de Ejes Z (Eje G a Eje A)
    FIXED_STRUCTURAL_GRID.zAxes.forEach((az) => {
      const yPx = toY(az.z);
      const x1 = toX(-5.40);
      const x2 = toX(5.40);
      lines.push(`  <line x1="${x1}" y1="${yPx}" x2="${x2}" y2="${yPx}" stroke="#0284c7" stroke-width="0.9" stroke-dasharray="4,4"/>`);
      lines.push(`  <circle cx="${x1 - 16}" cy="${yPx}" r="11" fill="#0f172a" stroke="#38bdf8" stroke-width="1.2"/>`);
      lines.push(`  <text x="${x1 - 16}" y="${yPx + 4}" fill="#38bdf8" font-size="10" font-weight="bold" text-anchor="middle">${az.id}</text>`);
      lines.push(`  <text x="${x1 - 34}" y="${yPx + 3}" fill="#94a3b8" font-size="8" text-anchor="end">z=${az.z.toFixed(2)}m (${az.planCoordM.toFixed(2)}m)</text>`);
    });

    // En Hoy en Obra + Planta Baja: dibujar Losas L1/L2/L3 y L4 macizas (+X junto a Escalera 1) + SECTOR SIN LOSA 38.00 m² en -X (Eje 5–9) con diagonales X
    if (this.planData.presetId === 'hoy_en_obra' && levelKey === 'planta_baja') {
      const vx = toX(-4.87);
      const vy = toY(3.00);
      const vw = Number(((-0.74 - -4.87) * scale).toFixed(2));
      const vd = Number(((9.94 - 3.00) * scale).toFixed(2));
      lines.push(`  <rect x="${vx}" y="${vy}" width="${vw}" height="${vd}" fill="rgba(239,68,68,0.16)" stroke="#ef4444" stroke-width="2" stroke-dasharray="6,4"/>`);
      lines.push(`  <line x1="${vx}" y1="${vy}" x2="${vx + vw}" y2="${vy + vd}" stroke="#ef4444" stroke-width="1.8" stroke-dasharray="6,4"/>`);
      lines.push(`  <line x1="${vx + vw}" y1="${vy}" x2="${vx}" y2="${vy + vd}" stroke="#ef4444" stroke-width="1.8" stroke-dasharray="6,4"/>`);
      lines.push(`  <text x="${vx + vw / 2}" y="${vy + vd / 2 - 4}" fill="#fde047" font-size="10" font-weight="bold" text-anchor="middle">SECTOR SIN LOSA: 38,00 m² (A cerrar con Loza Rap)</text>`);
      lines.push(`  <text x="${vx + vw / 2}" y="${vy + vd / 2 + 10}" fill="#fca5a5" font-size="8.5" text-anchor="middle">Cuadrante Eje B a Eje G (z=3.00..9.94m) × Eje 5 a Eje 9 (x=-4.87..-0.74m)</text>`);
    }

    // Elementos de Cochera Frontal en Planta Baja (Muro 100% Ciego, Portón Balancín 2.30m, Portoncito 0.95m, Pérgola y Rejilla Electroforjada)
    if (levelKey === 'planta_baja') {
      const rejX = toX(-4.87);
      const rejY = toY(1.50);
      const rejW = Number((9.74 * scale).toFixed(2));
      const rejD = Number((1.50 * scale).toFixed(2));
      lines.push(`  <rect x="${rejX}" y="${rejY}" width="${rejW}" height="${rejD}" fill="rgba(14,165,233,0.16)" stroke="#38bdf8" stroke-width="1.4"/>`);
      lines.push(`  <text x="${rejX + rejW / 2}" y="${rejY + rejD / 2 + 3}" fill="#bae6fd" font-size="8.5" font-weight="bold" text-anchor="middle">PISO DE REJILLA METÁLICA ELECTROFORJADA TRANSITABLE + REJAS LATERALES (z=1.50..3.00m)</text>`);

      const pergX = toX(-0.50);
      const pergY = toY(-3.80);
      const pergW = Number((5.00 * scale).toFixed(2));
      const pergD = Number((6.60 * scale).toFixed(2));
      lines.push(`  <rect x="${pergX}" y="${pergY}" width="${pergW}" height="${pergD}" fill="none" stroke="#10b981" stroke-width="1.4" stroke-dasharray="6,4"/>`);
      lines.push(`  <text x="${pergX + pergW / 2}" y="${pergY + 14}" fill="#6ee7b7" font-size="8.5" font-weight="bold" text-anchor="middle">PÉRGOLA DE MADERA CON ENREDADERA + TECHO TRANSLÚCIDO ANTIGRANIZO</text>`);

      lines.push(`  <line x1="${toX(1.20)}" y1="${toY(-4.00)}" x2="${toX(3.50)}" y2="${toY(-4.00)}" stroke="#38bdf8" stroke-width="5"/>`);
      lines.push(`  <text x="${toX(2.35)}" y="${toY(-4.00) - 6}" fill="#7dd3fc" font-size="8" font-weight="bold" text-anchor="middle">PORTÓN BALANCÍN 2.30m (CIEGO)</text>`);
      lines.push(`  <line x1="${toX(-2.20)}" y1="${toY(-4.00)}" x2="${toX(-1.25)}" y2="${toY(-4.00)}" stroke="#fbbf24" stroke-width="5"/>`);
      lines.push(`  <text x="${toX(-1.725)}" y="${toY(-4.00) - 6}" fill="#fde68a" font-size="8" font-weight="bold" text-anchor="middle">PORTONCITO 0.95m</text>`);
    }

    // Ambientes acotados
    lvl.rooms.forEach((r) => {
      if (this.planData.presetId === 'hoy_en_obra' && levelKey === 'planta_baja' && r.id.endsWith('_estar')) {
        return;
      }
      const rx = toX(r.x);
      const ry = toY(r.z);
      const rw = Number((r.w * scale).toFixed(2));
      const rd = Number((r.d * scale).toFixed(2));
      const area = (r.w * r.d).toFixed(2);
      const isYellow = r.id === 'sub_camara_aislacion_frontal';
      const isGreen = r.id === 'sub_piscina_futura' || levelKey === 'planta_alta';
      const stroke = this.bankColorMode
        ? (isYellow ? '#f59e0b' : isGreen ? '#22c55e' : '#ef4444')
        : (r.activeStage !== false ? '#38bdf8' : '#64748b');
      const fill = this.bankColorMode
        ? (isYellow ? 'rgba(245,158,11,0.20)' : isGreen ? 'rgba(22,163,74,0.18)' : 'rgba(220,38,38,0.16)')
        : 'rgba(56,189,248,0.08)';
      const dash = r.activeStage !== false ? '' : 'stroke-dasharray="5,4"';
      const shortTitle = r.shortTitle || String(r.name || '').split('(')[0].trim();
      lines.push(`  <rect x="${rx}" y="${ry}" width="${rw}" height="${rd}" fill="${fill}" stroke="${stroke}" stroke-width="1.3" ${dash}/>`);
      lines.push(`  <text x="${rx + rw / 2}" y="${ry + rd / 2 - 4}" fill="#f8fafc" font-size="9" font-weight="bold" text-anchor="middle">${escXml(shortTitle)}</text>`);
      lines.push(`  <text x="${rx + rw / 2}" y="${ry + rd / 2 + 10}" fill="#67e8f9" font-size="8" text-anchor="middle">${area} m² (${r.w.toFixed(2)}×${r.d.toFixed(2)}m)</text>`);
    });

    // Escaleras en costados opuestos: Escalera 1 (Eje 1–2 Este) y Escalera 2 (Eje 8–9 Oeste)
    if (levelKey === 'subsuelo' || levelKey === 'planta_baja') {
      const st1 = FIXED_STRUCTURAL_GRID.existingStaircase1;
      const sx = toX(st1.x1);
      const sy = toY(st1.z1);
      const sw = Number(((st1.x2 - st1.x1) * scale).toFixed(2));
      const sd = Number(((st1.z2 - st1.z1) * scale).toFixed(2));
      lines.push(`  <rect x="${sx}" y="${sy}" width="${sw}" height="${sd}" fill="rgba(14,165,233,0.20)" stroke="#38bdf8" stroke-width="1.5"/>`);
      lines.push(`  <text x="${sx + sw / 2}" y="${sy + sd / 2}" fill="#e0f2fe" font-size="7.5" font-weight="bold" text-anchor="middle">ESC. 1 (-2.34m)</text>`);
    }
    if ((levelKey === 'planta_baja' || levelKey === 'planta_alta') && FIXED_STRUCTURAL_GRID.existingStaircase2) {
      const st2 = FIXED_STRUCTURAL_GRID.existingStaircase2;
      const sx = toX(st2.x1);
      const sy = toY(st2.z1);
      const sw = Number(((st2.x2 - st2.x1) * scale).toFixed(2));
      const sd = Number(((st2.z2 - st2.z1) * scale).toFixed(2));
      lines.push(`  <rect x="${sx}" y="${sy}" width="${sw}" height="${sd}" fill="rgba(14,165,233,0.20)" stroke="#38bdf8" stroke-width="1.5"/>`);
      lines.push(`  <text x="${sx + sw / 2}" y="${sy + sd / 2}" fill="#e0f2fe" font-size="7.5" font-weight="bold" text-anchor="middle">ESC. 2 (+2.88m)</text>`);
    }

    // Muros a escala y cotas
    lvl.walls.forEach((w) => {
      const cat = WALL_CATALOG[w.type] || WALL_CATALOG.ladrillo_15;
      const x1 = toX(w.x1);
      const y1 = toY(w.z1);
      const x2 = toX(w.x2);
      const y2 = toY(w.z2);
      const len = Math.hypot(w.x2 - w.x1, w.z2 - w.z1);
      const sw = Math.max(2.5, cat.thickness * scale);
      const dash = w.activeStage !== false ? '' : 'stroke-dasharray="6,4" opacity="0.55"';
      const wColor = this.bankColorMode ? '#dc2626' : cat.color;
      lines.push(`  <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${wColor}" stroke-width="${sw.toFixed(1)}" stroke-linecap="round" ${dash}/>`);
      lines.push(`  <text x="${((x1 + x2) / 2).toFixed(1)}" y="${((y1 + y2) / 2 - 4).toFixed(1)}" fill="#fde68a" font-size="7.5" text-anchor="middle">${len.toFixed(2)}m</text>`);
    });

    // Zapatas y 20 Pilares P1..P20
    FIXED_COLUMNS_AND_FOOTINGS.forEach((col) => {
      const cx = toX(col.x);
      const cy = toY(col.z);
      const cw = Math.max(6, col.colW * scale);
      const cd = Math.max(6, col.colD * scale);
      const isDeadPA = levelKey === 'planta_alta' && col.diesInPB;
      const fill = isDeadPA
        ? 'rgba(245,158,11,0.25)'
        : this.bankColorMode
          ? (levelKey === 'planta_alta' ? '#16a34a' : '#1e293b')
          : '#06b6d4';
      const stroke = isDeadPA ? '#f59e0b' : (this.bankColorMode ? '#f8fafc' : '#083344');
      const dash = isDeadPA ? 'stroke-dasharray="3,2"' : '';
      const label = isDeadPA ? `${col.pilarId}(Muere PB)` : `${col.pilarId} (${col.axisLabel})`;

      lines.push(`  <rect x="${(cx - cw / 2).toFixed(1)}" y="${(cy - cd / 2).toFixed(1)}" width="${cw.toFixed(1)}" height="${cd.toFixed(1)}" fill="${fill}" stroke="${stroke}" stroke-width="1.3" ${dash}/>`);
      lines.push(`  <text x="${(cx + cw / 2 + 4).toFixed(1)}" y="${(cy + 3).toFixed(1)}" fill="${isDeadPA ? '#fbbf24' : '#a5f3fc'}" font-size="8" font-weight="bold">${escXml(label)}</text>`);
    });

    // Exportación Vectorial de Instalaciones Eléctricas, Pluviales e Hidrosanitarias Superpuestas en Eje F–G
    if (this.showConduitsAndOutlets || forceMepOverlay) {
      const { pases, tableros, enchufes, llaves, conduitRoutes } = this.getConduitsAndOutletsForLevel(levelKey);

      if (forceMepOverlay) {
        // Destacar Núcleo Húmedo Vertical Eje F–G (z=3.00..5.00m) donde coinciden Baño Social + Cocina PB y Baño Suite + Vestidor + Baño 2 PA
        const fgX = toX(-4.87);
        const fgY = toY(3.00);
        const fgW = Number((8.71 * scale).toFixed(2));
        const fgD = Number((2.00 * scale).toFixed(2));
        lines.push(`  <rect x="${fgX}" y="${fgY}" width="${fgW}" height="${fgD}" fill="rgba(14,165,233,0.16)" stroke="#38bdf8" stroke-width="2" stroke-dasharray="6,3"/>`);
        lines.push(`  <text x="${fgX + fgW / 2}" y="${fgY + 14}" fill="#7dd3fc" font-size="9.5" font-weight="bold" text-anchor="middle">NÚCLEO HÚMEDO VERTICAL EJE F–G (z=3.00..5.00m): BAÑO SOCIAL + COCINA (PB) ↕ VESTIDOR + BAÑO SUITE + BAÑO 2 (PA)</text>`);
      }

      conduitRoutes.forEach((route) => {
        if (!route.pts || route.pts.length < 2) return;
        const ptsAttr = route.pts.map(([rx, rz]) => `${toX(rx)},${toY(rz)}`).join(' ');
        lines.push(`  <polyline points="${ptsAttr}" fill="none" stroke="${route.color || '#f97316'}" stroke-width="1.8" stroke-dasharray="4,3" opacity="0.9"/>`);
      });

      pases.forEach((pase) => {
        const px = toX(pase.x);
        const py = toY(pase.z);
        lines.push(`  <circle cx="${px}" cy="${py}" r="8" fill="#ec4899" stroke="#ffffff" stroke-width="1.4"/>`);
        lines.push(`  <text x="${px}" y="${py - 11}" fill="#f472b6" font-size="7.5" font-weight="bold" text-anchor="middle">${escXml(pase.shortTag)} (Ø${pase.diametroMm}mm)</text>`);
      });

      tableros.forEach((tab) => {
        const tx = toX(tab.x);
        const ty = toY(tab.z);
        const isWater = tab.id.startsWith('HID_');
        lines.push(`  <rect x="${(tx - 9).toFixed(1)}" y="${(ty - 7).toFixed(1)}" width="18" height="14" fill="${isWater ? '#0284c7' : '#ef4444'}" stroke="#ffffff" stroke-width="1.2"/>`);
        lines.push(`  <text x="${tx}" y="${(ty + 14).toFixed(1)}" fill="${isWater ? '#38bdf8' : '#fca5a5'}" font-size="7.5" font-weight="bold" text-anchor="middle">${escXml(tab.displayCode)}</text>`);
      });

      enchufes.forEach((toma) => {
        const tx = toX(toma.x);
        const ty = toY(toma.z);
        const is20A = toma.tipo === 'toma_20a';
        lines.push(`  <circle cx="${tx}" cy="${ty}" r="5.5" fill="${is20A ? '#f97316' : '#10b981'}" stroke="#0f172a" stroke-width="1"/>`);
        lines.push(`  <text x="${tx}" y="${(ty + 11).toFixed(1)}" fill="${is20A ? '#fdba74' : '#6ee7b7'}" font-size="6.8" font-weight="bold" text-anchor="middle">${escXml(toma.codigo)}</text>`);
      });

      llaves.forEach((sw) => {
        const sx = toX(sw.x);
        const sy = toY(sw.z);
        lines.push(`  <polygon points="${sx},${sy - 6} ${sx + 6},${sy} ${sx},${sy + 6} ${sx - 6},${sy}" fill="#38bdf8" stroke="#0f172a" stroke-width="1"/>`);
        lines.push(`  <text x="${sx}" y="${(sy - 8).toFixed(1)}" fill="#7dd3fc" font-size="6.8" font-weight="bold" text-anchor="middle">${escXml(sw.codigo)}</text>`);
      });
    }

    // Rótulo Técnico Oficial (abajo)
    const rotY = svgH - 165;
    lines.push(`  <rect x="30" y="${rotY}" width="${svgW - 60}" height="135" fill="#0f172a" stroke="#38bdf8" stroke-width="1.6"/>`);
    lines.push(`  <text x="48" y="${rotY + 24}" fill="#38bdf8" font-size="13" font-weight="bold">PROYECTO: RESIDENCIA ITÁ PYTÃ PUNTA — ${escXml(sheetTitle)}</text>`);
    lines.push(`  <text x="48" y="${rotY + 44}" fill="#e2e8f0" font-size="10">NIVEL: ${escXml(def.fullTitle)} | COTA: ${escXml(def.cota)} | ESCALA CAD: 1:50 | FECHA: ${dateStr}</text>`);
    lines.push(`  <text x="48" y="${rotY + 63}" fill="#cbd5e1" font-size="9.5">REALIDAD DE OBRA: 17 Pilares PB Hormigonados (+2.88m) | Hueco 38,00 m² en Losa 1 a cerrar c/ Loza Rap | Núcleo Húmedo Eje F–G</text>`);
    lines.push(`  <text x="48" y="${rotY + 84}" fill="#fde68a" font-size="10" font-weight="bold">CÓMPUTO DE MUROS: ${totalMurosM2} m² Totales (15cm: ${metrics.mamposteria15M2}m² | 20cm: ${metrics.mamposteria20M2}m² | 30cm: ${metrics.ciclopeo30M2}m² | Blindex: ${metrics.blindexM2}m²) — Costo Muros: Gs. ${formatGs(metrics.murosCostGs)}</text>`);
    lines.push(`  <text x="48" y="${rotY + 106}" fill="#34d399" font-size="10.5" font-weight="bold">SUPERFICIE ACTIVA NIVEL: ${metrics.byLevel[levelKey]?.activeM2 || 0} m² | INVERSIÓN TOTAL ETAPA ACTIVA: Gs. ${formatGs(metrics.totalProjectCostGs)}</text>`);
    lines.push(`</svg>`);

    return lines.join('\n');
  }

  /**
   * Exporta el plano técnico actual en formato SVG Vectorial a Escala CAD (1m = 50px)
   */
  exportSVG() {
    const svgContent = this.generateSheetSVG({
      levelKey: this.currentLevel,
      sheetTitle: LEVEL_DEFINITIONS[this.currentLevel]?.fullTitle
    });
    const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `plano_cad_itapytapunta_${this.currentLevel}_${Date.now()}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    return svgContent;
  }

  /**
   * Generador Dinámico de Láminas de Planos Oficiales en Tiempo Real (`exportOfficialBlueprintsPackSVG()`):
   * Produce en tiempo real desde el estado actual del modelo un juego completo de 4 láminas técnicas vectoriales SVG:
   * - Lámina 1: Planta Baja +100.00m
   * - Lámina 2: Planta Alta +102.88m
   * - Lámina 3: Subsuelo +97.66m
   * - Lámina 4: Instalaciones Eléctricas, Pluviales y Hidrosanitarias Superpuestas Eje F-G
   */
  exportOfficialBlueprintsPackSVG() {
    const sheets = [
      {
        id: 'lamina_1_planta_baja',
        sheetTitle: 'Lámina 1: Planta Baja +100.00m (Cochera + Núcleo Húmedo Eje F–G + Estar + Escaleras 1 y 2 + Galería)',
        levelKey: 'planta_baja',
        forceMepOverlay: false
      },
      {
        id: 'lamina_2_planta_alta',
        sheetTitle: 'Lámina 2: Planta Alta +102.88m (2 Dormitorios + Desk en Escalera 2 + 2 Baños + Vestidor Eje F–G • Sin Balcón Frontal)',
        levelKey: 'planta_alta',
        forceMepOverlay: false
      },
      {
        id: 'lamina_3_subsuelo',
        sheetTitle: 'Lámina 3: Subsuelo +97.66m (Parrillita hacia el Patio + Lavadero + Depósito + Arranque Escalera 1 Eje 8–9)',
        levelKey: 'subsuelo',
        forceMepOverlay: false
      },
      {
        id: 'lamina_4_instalaciones_eje_fg',
        sheetTitle: 'Lámina 4: Instalaciones Eléctricas, Pluviales y Hidrosanitarias Superpuestas Eje F-G',
        levelKey: 'planta_baja',
        forceMepOverlay: true
      }
    ].map((spec) => ({
      ...spec,
      svg: this.generateSheetSVG(spec)
    }));

    // Descargar cada lámina SVG o paquete HTML/SVG imprimible en tiempo real
    const htmlPack = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <title>Pack 4 Láminas Oficiales CAD/BIM — Residencia Itá Pytã Punta</title>
  <style>
    body { margin: 0; padding: 20px; background: #020617; color: #f8fafc; font-family: 'IBM Plex Mono', monospace; }
    .toolbar { position: sticky; top: 0; z-index: 10; background: rgba(15,23,42,0.95); padding: 12px 18px; border: 1px solid #38bdf8; border-radius: 10px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    .btn { background: #0284c7; color: #fff; border: none; padding: 8px 14px; border-radius: 6px; font-weight: 700; cursor: pointer; }
    .sheet { margin-bottom: 32px; page-break-after: always; display: flex; flex-direction: column; align-items: center; }
    .sheet h2 { color: #38bdf8; font-size: 15px; margin-bottom: 8px; }
    .sheet svg { max-width: 100%; height: auto; border: 1px solid #1e293b; border-radius: 8px; }
    @media print { .toolbar { display: none; } body { background: #fff; padding: 0; } }
  </style>
</head>
<body>
  <div class="toolbar">
    <div>
      <strong>📐 PACK OFICIAL DE 4 LÁMINAS CAD/BIM EN TIEMPO REAL — ITÁ PYTÃ PUNTA (RUTH &amp; LEO)</strong>
      <div style="font-size:12px; color:#94a3b8;">Lámina 1: PB +100.00m • Lámina 2: PA +102.88m • Lámina 3: Subsuelo +97.66m • Lámina 4: Instalaciones Superpuestas Eje F-G</div>
    </div>
    <button class="btn" onclick="window.print()">🖨️ Imprimir / Guardar PDF A3</button>
  </div>
  ${sheets.map((s) => `<div class="sheet"><h2>${s.sheetTitle}</h2>${s.svg}</div>`).join('\n')}
</body>
</html>`;

    if (typeof document !== 'undefined') {
      const blob = new Blob([htmlPack], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `pack_4_laminas_oficiales_itapytapunta_${Date.now()}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }

    return sheets;
  }

  /**
   * Exporta el lienzo CAD actual como imagen PNG de alta resolución
   */
  exportPNG() {
    if (!this.canvas) return;
    this.render();
    const dataUrl = this.canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `plano_itapytapunta_${this.currentLevel}_${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  /**
   * Exporta la geometría completa y cómputos métricos en formato JSON BIM
   */
  exportJSON() {
    const payload = {
      project: 'Residencia Itá Pytã Punta',
      location: 'Calle Guillermo Arias, Asunción, Paraguay',
      structuralSource: 'CALCULO ESTRUCTURAL L.G. FUSIONADO.pdf + GEO-STAN #2956 + Planos Sanitarios/E5',
      exportedAt: new Date().toISOString(),
      structuralGrid: FIXED_STRUCTURAL_GRID,
      columnsAndFootings: FIXED_COLUMNS_AND_FOOTINGS,
      planData: this.planData,
      metrics: this.computeFullMetrics()
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `itapytapunta_bim_plan_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

export default FloorplanEditor;
