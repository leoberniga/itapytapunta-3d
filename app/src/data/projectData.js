// Project Data for Ita Pyta Punta Residential Project
// Location: Calle Tte. Guillermo Arias (cul-de-sac), Barrio Itá Pytã Punta, Asunción, Paraguay
// Geotechnical Project: 2956 (GEO-STAN S.R.L.) — UTM Zona 21S (RN: 433024E, 7203554N)
// Structural Calculation: Ing. Gustavo Velázquez (Reg. MOPC N° 3135) — HA-25 / B 500 S
// Client: Leonardo Gómez | Architecture: Arq. Gabriela Rolón | Construction Phase 1: JIVESA S.A.
// Pricing benchmarks: JIVESA S.A. Acta de Recepción (29/12/2025), Planillas LG-RB & CAPACO 2026

export const PROJECT_METADATA = {
  title: "Residencia Itá Pytã Punta",
  subtitle: "Gemelo Digital BIM / CAD 3D, Ingeniería Estructural y Auditoría Forense de Obra",
  location: "Calle Tte. Guillermo Arias (tramo sin salida al Oeste de Pedro Melo de Portugal), B° Itá Pytã Punta, Asunción, Paraguay",
  coordinates: {
    lat: -25.282799,
    lng: -57.665301,
    utmZone: "21S",
    utmEasting: 433024,
    utmNorthing: 7203554,
    datum: "WGS84 / SIRGAS"
  },
  urbanContextSummary:
    "Implantada en el tramo sin salida (cul-de-sac) de la Calle Tte. Guillermo Arias (pasando Pedro Melo de Portugal hacia el Oeste). Linda al Sur con el galpón de Molinos Harineros del Paraguay, al Este/Oeste/Norte con viviendas barriales bajas de techos de tejas, y a ~85–96 m al Noroeste con el Mirador Itá Pytã Punta y la curva del Río Paraguay. Elevar el Segundo Piso a cota +102.88m (+2.88m s/calle) y la Cubierta a +105.64m (+5.64m s/calle) permite superar las cumbreras vecinas y ganar una visual panorámica limpia hacia el río.",
  client: "Leonardo Gómez",
  architect: "Arq. Gabriela Rolón",
  structuralEngineer: "Ing. Gustavo Velázquez (Reg. N° 3135 M.O.P.C.)",
  engineering: "JIVESA S.A. Ingeniería (Fase 1 Ejecutada) / Ing. Gustavo Velázquez (Cálculo)",
  soilSurvey: "GEO-STAN S.R.L. (Estudio Geotécnico Nº 2956)",
  materialsLab: "PROBETI S.R.L. (Informe de Ensayo N° 17671)",
  lotDimensions: {
    frontWidth: 9.89,      // meters along Calle Guillermo Arias
    structuralWidth: 9.74, // meters between Eje 9 (Sur) and Eje 1 (Norte)
    depth: 31.00,          // meters from street to rear slope
    structuralDepth: 10.34,// meters between Eje G (frente) and Eje A (galería)
    totalArea: 306.59      // m2
  },
  benchmarks: {
    RN: { name: "RN (Referencia Nivel)", cota: 100.00, x: 433024, y: 7203554, desc: "Cota de calle Tte. Guillermo Arias (+0.00m local / +2.34m estructural)" },
    P1: { name: "Sondeo P1 (Frente)", cota: 99.84, x: 433018, y: 7203560, desc: "Sector cochera frontal / Acceso (+99.84 m, -0.16 m)" },
    P2: { name: "Sondeo P2 (Medio)", cota: 97.15, x: 433020, y: 7203579, desc: "Sector central / Subsuelo (+97.15 m, desnivel -2.85 m)" },
    P3: { name: "Sondeo P3 (Fondo)", cota: 96.20, x: 433017, y: 7203591, desc: "Patio inferior / Barranco (+96.20 m, desnivel -3.80 m)" }
  }
};

// Exact Structural Grid (Ing. Gustavo Velázquez — CALCULO ESTRUCTURAL L.G. FUSIONADO.pdf + Acta de Recepción)
// Coordinate System in 3D Scene:
// - X axis (width): South/Left (Eje 9, x = -4.87m) to North/Right (Eje 1, x = +4.87m). Formula: x = y_plano - 4.87
// - Z axis (depth): Street/East front (z = -4.00m street edge, Eje G facade at z = +3.00m) to River/Northwest rear (Eje A gallery edge at z = +13.34m, lot end at z = +27.00m)
// - Y axis (elevation): Street level Cota +100.00m is Y = 0.00m (which corresponds to structural level +2.34m)
export const EXACT_STRUCTURAL_GRID = {
  metadata: {
    sourceDocument: "CALCULO ESTRUCTURAL L.G. FUSIONADO.pdf (Láminas E1 a E9) + Planos IS/IH + Acta de Recepción 29/12/2025",
    calculator: "Ing. Gustavo Velázquez — Reg. N° 3135 M.O.P.C.",
    concreteSpec: "HA-25 (fck = 250 kg/cm² en diseño; 240.3 a 325.75 kg/cm² verificado por PROBETI S.R.L.)",
    steelSpec: "Acero en barras y estribos B 500 S (fy = 5000 kg/cm², Ys = 1.15)",
    structuralWidth: 9.74,
    structuralDepth: 10.34,
    frontParkingRangeZ: [-4.00, 3.00],
    rearPatioRangeZ: [13.34, 27.00],
    upperFloorCantileverFrontZ: 3.00
  },
  xAxes: [
    { id: "Eje 9", x: -4.87, yPlano: 0.00, pillars: ["P17", "P18", "P19", "P20"], desc: "Medianera izquierda (Sur, 0.00m en plano) — Escalera 1 a Subsuelo entre Ejes 8 y 9" },
    { id: "Eje 8", x: -3.35, yPlano: 1.52, pillars: ["P15"], desc: "Alineación interior P15 (1.52m en plano, muere en PB) y borde interior de Escalera 1" },
    { id: "Eje 7", x: -2.02, yPlano: 2.85, pillars: ["P16"], desc: "Alineación interior P16 (2.85m en plano, ya hormigonado hasta +2.88m)" },
    { id: "Eje 6", x: -1.64, yPlano: 3.23, pillars: ["P11", "P12", "P14"], desc: "Pórtico longitudinal central-izquierdo (3.23m en plano; P11 y P14 a +2.88m, P12 muere en PB)" },
    { id: "Eje 5", x: -0.74, yPlano: 4.13, pillars: ["P13"], desc: "Borde entre Losa maciza L4 y Vacío de 38,00 m² a cerrar con Loza Rap (P13 muere en PB)" },
    { id: "Eje 4", x: 1.69, yPlano: 6.56, pillars: ["P8", "P10"], desc: "Pórtico longitudinal central-derecho (6.56m en plano; P8 y P10 ya hormigonados hasta +2.88m)" },
    { id: "Eje 3", x: 2.39, yPlano: 7.26, pillars: ["P9"], desc: "Apoyo central P9 en línea de galería (7.26m en plano, ya hormigonado hasta +2.88m)" },
    { id: "Eje 2", x: 3.84, yPlano: 8.71, pillars: ["P5", "P6", "P7"], desc: "Pórtico interior derecho y borde de Escalera 2 que sube a Planta Alta (8.71m en plano)" },
    { id: "Eje 1", x: 4.87, yPlano: 9.74, pillars: ["P1", "P2", "P3", "P4"], desc: "Medianera derecha (Norte, 9.74m en plano) — Escalera 2 a Planta Alta entre Ejes 1 y 2" }
  ],
  zAxes: [
    { id: "Eje G", z: 3.00, xPlano: 10.34, pillars: ["P4", "P7", "P20"], desc: "Fachada Frontal hacia cochera (10.34m en plano; muro frontal sin balcón ni Blindex en PA)" },
    { id: "Eje F", z: 3.51, xPlano: 9.83, pillars: ["P10", "P14"], desc: "Núcleo Húmedo Frontal Pluvial/Sanitario Eje F–G (Baño Social y Cocina en PB; Vestidor, Baño Suite y Baño 2 en PA)" },
    { id: "Eje E", z: 4.77, xPlano: 8.57, pillars: ["P13", "P19"], desc: "Cierre interior del Núcleo Húmedo Frontal y transición a Estar / Dormitorios (8.57m en plano)" },
    { id: "Eje D", z: 5.26, xPlano: 8.08, pillars: ["P3", "P6"], desc: "Arranque de Escalera 1 (Eje 8–9 baja a Subsuelo) y Escalera 2 (Eje 1–2 sube a PA)" },
    { id: "Eje C", z: 7.37, xPlano: 5.97, pillars: ["P12", "P15"], desc: "Eje de apeo en Subsuelo / Losa PB (5.97m en plano; P12 y P15 mueren en PB)" },
    { id: "Eje B", z: 9.94, xPlano: 3.40, pillars: ["P2", "P5", "P9", "P16", "P18"], desc: "Línea divisoria principal Interior / Galería con ventanales Blindex al Río (3.40m en plano)" },
    { id: "Eje A", z: 13.34, xPlano: 0.00, pillars: ["P1", "P8", "P11", "P17"], desc: "Borde de Galería hacia el barranco y Río Paraguay (0.00m en plano)" }
  ],
  elevations: {
    footings: {
      y: -4.64,
      cotaAbsoluta: 95.36,
      cotaEstructural: -2.30,
      status: "EJECUTADO 100%",
      desc: "Plano de asiento de zapatas (+95.36m / -2.30m bajo subsuelo), profundizado 1.00m adicional respecto al plano original por estrato blando superior según Acta de Recepción."
    },
    subsuelo: {
      y: -2.34,
      cotaAbsoluta: 97.66,
      cotaEstructural: 0.00,
      status: "EJECUTADO 100%",
      desc: "Nivel de Subsuelo (+97.66m / +0.00m estructural). Vigas de pórticos 1 a 7, encadenados inferiores y Escalera 1 en Eje 8–9 ejecutados."
    },
    galeriaL1: {
      y: -0.45,
      cotaAbsoluta: 99.55,
      cotaEstructural: 1.89,
      status: "EJECUTADO 100%",
      desc: "Losa L1 de Galería rebajada -0.45m (+99.55m / +1.89m estructural) entre Ejes A y B, ejecutada en H°A° visto."
    },
    plantaBaja: {
      y: 0.00,
      cotaAbsoluta: 100.00,
      cotaEstructural: 2.34,
      status: "LOSA L1/L4 + 17 PILARES EJECUTADOS (VACÍO 38,00 m² A CERRAR CON LOZA RAP)",
      desc: "Nivel Calle (+100.00m / +2.34m est.): Losa L1 (Galería), Losa L4 (ala derecha/Sur Eje 5–9) y los 17 pilares de PB hasta +2.88m ya están hormigonados; resta cerrar en Etapa 1 el hueco abierto entre vigas de 38.00 m² (Eje B–G × Eje 1–5) con Loza Rap."
    },
    plantaAlta: {
      y: 2.88,
      cotaAbsoluta: 102.88,
      cotaEstructural: 5.22,
      status: "17 PILARES PB YA EN +2.88m • LOSA PA A CONSTRUIR",
      desc: "Nivel 2do Piso / Planta Alta (+102.88m / +5.22m est.): los 17 pilares de PB ya llegan a +2.88m. Aloja 2 Dormitorios + Escritorio/Desk al desembarcar de Escalera 2 + 2 Baños y Vestidor sobre Eje F–G (sin balcón ni Blindex frontal)."
    },
    techoCumbrera: {
      y: 5.64,
      cotaAbsoluta: 105.64,
      cotaEstructural: 7.98,
      status: "A CONSTRUIR",
      desc: "Elevación de 14 pilares a techo, vigas de coronamiento y cubierta termoacústica (+105.64m / +7.98m estructural)."
    }
  },
  pillars: [
    {
      id: "P1",
      ejeX: "Eje 1",
      ejeZ: "Eje A",
      x: 4.87,
      z: 13.34,
      sectionW: 0.30,
      sectionD: 0.20,
      zapataId: "Z-P1",
      zapataSize: "130x70x50/40 cm",
      rebar: "4Ø12 + Est. Ø6 c/15 cm",
      builtTopY: 2.88,
      designTopY: 5.64,
      notes: "Esquina Noroeste de Galería al Río; ya hormigonado en PB hasta +2.88m."
    },
    {
      id: "P2",
      ejeX: "Eje 1",
      ejeZ: "Eje B",
      x: 4.87,
      z: 9.94,
      sectionW: 0.30,
      sectionD: 0.20,
      zapataId: "Z-(P2-P5)",
      zapataSize: "230x160x50/35 cm (combinada P2-P5)",
      rebar: "4Ø12 + Est. Ø6 c/15 cm",
      builtTopY: 2.88,
      designTopY: 5.64,
      notes: "Medianera Norte sobre línea divisoria Interior / Galería; ya hormigonado en PB hasta +2.88m."
    },
    {
      id: "P3",
      ejeX: "Eje 1",
      ejeZ: "Eje D",
      x: 4.87,
      z: 5.26,
      sectionW: 0.30,
      sectionD: 0.20,
      zapataId: "Z-(P3-P6)",
      zapataSize: "170x160x35/25 cm (combinada P3-P6)",
      rebar: "4Ø12 + Est. Ø6 c/15 cm",
      builtTopY: 2.88,
      designTopY: 5.64,
      notes: "Medianera Norte junto a arranque de Escalera 2 (Eje 1–2); ya hormigonado en PB hasta +2.88m."
    },
    {
      id: "P4",
      ejeX: "Eje 1",
      ejeZ: "Eje G",
      x: 4.87,
      z: 3.00,
      sectionW: 0.30,
      sectionD: 0.20,
      zapataId: "Z-(P4-P7)",
      zapataSize: "100x160x30/25 cm (combinada P4-P7)",
      rebar: "4Ø12 + Est. Ø6 c/15 cm",
      builtTopY: 2.88,
      designTopY: 5.64,
      notes: "Esquina Noreste de Fachada Frontal (Eje G); ya hormigonado en PB hasta +2.88m."
    },
    {
      id: "P5",
      ejeX: "Eje 2",
      ejeZ: "Eje B",
      x: 3.84,
      z: 9.94,
      sectionW: 0.30,
      sectionD: 0.15,
      zapataId: "Z-(P2-P5)",
      zapataSize: "230x160x50/35 cm (combinada P2-P5)",
      rebar: "4Ø12 + Est. Ø6 c/10-15 cm",
      builtTopY: 2.88,
      designTopY: 2.88,
      notes: "Pilar interior en línea de Galería y llegada de Escalera 2; ya hormigonado hasta Losa de Planta Alta (+2.88m)."
    },
    {
      id: "P6",
      ejeX: "Eje 2",
      ejeZ: "Eje D",
      x: 3.84,
      z: 5.26,
      sectionW: 0.30,
      sectionD: 0.15,
      zapataId: "Z-(P3-P6)",
      zapataSize: "170x160x35/25 cm (combinada P3-P6)",
      rebar: "4Ø12 + Est. Ø6 c/10-15 cm",
      builtTopY: 2.88,
      designTopY: 2.88,
      notes: "Pilar interior en Eje D junto a arranque de Escalera 2; ya hormigonado hasta Losa de Planta Alta (+2.88m)."
    },
    {
      id: "P7",
      ejeX: "Eje 2",
      ejeZ: "Eje G",
      x: 3.84,
      z: 3.00,
      sectionW: 0.15,
      sectionD: 0.30,
      zapataId: "Z-(P4-P7)",
      zapataSize: "100x160x30/25 cm (combinada P4-P7)",
      rebar: "4Ø12 + Est. Ø6 c/10-15 cm",
      builtTopY: 2.88,
      designTopY: 5.64,
      notes: "Pilar de Fachada Frontal (Eje G); ya hormigonado en PB hasta +2.88m y continúa a Techo (+5.64m)."
    },
    {
      id: "P8",
      ejeX: "Eje 4",
      ejeZ: "Eje A",
      x: 1.69,
      z: 13.34,
      sectionW: 0.30,
      sectionD: 0.15,
      zapataId: "Z-P8",
      zapataSize: "110x95x50/40 cm",
      rebar: "6Ø12 (Subsuelo) / 4Ø12 (PB-PA) + Est. Ø6",
      builtTopY: 2.88,
      designTopY: 5.64,
      notes: "Borde frontal de Galería al Río; ya hormigonado en PB hasta +2.88m."
    },
    {
      id: "P9",
      ejeX: "Eje 3",
      ejeZ: "Eje B",
      x: 2.39,
      z: 9.94,
      sectionW: 0.15,
      sectionD: 0.30,
      zapataId: "Z-P9",
      zapataSize: "165x180x40/25 cm",
      rebar: "8Ø12 (Subsuelo) / 4Ø12 (PB-PA) + Est. Ø6",
      builtTopY: 2.88,
      designTopY: 5.64,
      notes: "Pilar central de gran carga en Eje B; ya hormigonado en PB hasta +2.88m."
    },
    {
      id: "P10",
      ejeX: "Eje 4",
      ejeZ: "Eje F",
      x: 1.69,
      z: 3.51,
      sectionW: 0.20,
      sectionD: 0.20,
      zapataId: "Z-P10",
      zapataSize: "150x150x35/25 cm",
      rebar: "4Ø12 + Est. Ø6 c/10-15 cm",
      builtTopY: 2.88,
      designTopY: 5.64,
      notes: "Pilar cuadrado 20x20 cm en Núcleo Húmedo Frontal (Eje F); ya hormigonado en PB hasta +2.88m."
    },
    {
      id: "P11",
      ejeX: "Eje 6",
      ejeZ: "Eje A",
      x: -1.64,
      z: 13.34,
      sectionW: 0.30,
      sectionD: 0.15,
      zapataId: "Z-P11",
      zapataSize: "120x105x50/40 cm",
      rebar: "4Ø12 + Est. Ø6 c/10-15 cm",
      builtTopY: 2.88,
      designTopY: 5.64,
      notes: "Borde de Galería al Río; ya hormigonado en PB hasta +2.88m."
    },
    {
      id: "P12",
      ejeX: "Eje 6",
      ejeZ: "Eje C",
      x: -1.64,
      z: 7.37,
      sectionW: 0.25,
      sectionD: 0.40,
      zapataId: "Z-P12",
      zapataSize: "100x100x30/25 cm",
      rebar: "6Ø12 + Est. Ø6 c/10-15 cm",
      builtTopY: 0.00,
      designTopY: 0.00,
      notes: "RESTRICCIÓN CRÍTICA: Muere en Losa de Planta Baja (+0.00m). No continúa a Planta Alta."
    },
    {
      id: "P13",
      ejeX: "Eje 5",
      ejeZ: "Eje E",
      x: -0.74,
      z: 4.77,
      sectionW: 0.25,
      sectionD: 0.40,
      zapataId: "Z-(P13-P14)",
      zapataSize: "230x230x50/40 cm (combinada P13-P14)",
      rebar: "6Ø12 + Est. Ø6 c/10-15 cm",
      builtTopY: 0.00,
      designTopY: 0.00,
      notes: "RESTRICCIÓN CRÍTICA: Muere en Losa de Planta Baja (+0.00m) en el borde del vacío de 38,00 m²."
    },
    {
      id: "P14",
      ejeX: "Eje 6",
      ejeZ: "Eje F",
      x: -1.64,
      z: 3.51,
      sectionW: 0.20,
      sectionD: 0.20,
      zapataId: "Z-(P13-P14)",
      zapataSize: "230x230x50/40 cm (combinada P13-P14)",
      rebar: "4Ø12 + Est. Ø6 c/10-15 cm",
      builtTopY: 2.88,
      designTopY: 5.64,
      notes: "Pilar cuadrado 20x20 cm en Núcleo Húmedo Frontal (Eje 6-F); ya hormigonado en PB hasta +2.88m."
    },
    {
      id: "P15",
      ejeX: "Eje 8",
      ejeZ: "Eje C",
      x: -3.35,
      z: 7.37,
      sectionW: 0.40,
      sectionD: 0.25,
      zapataId: "Z-P15",
      zapataSize: "120x120x30/25 cm",
      rebar: "6Ø12 + Est. Ø6 c/10-15 cm",
      builtTopY: 0.00,
      designTopY: 0.00,
      notes: "RESTRICCIÓN CRÍTICA: Muere en Losa de Planta Baja (+0.00m) junto a Escalera 1. Prohibido cargar muros pesados encima en 2do piso."
    },
    {
      id: "P16",
      ejeX: "Eje 7",
      ejeZ: "Eje B",
      x: -2.02,
      z: 9.94,
      sectionW: 0.25,
      sectionD: 0.40,
      zapataId: "Z-(P16-P18)",
      zapataSize: "240x215x50/40 cm (combinada P16-P18)",
      rebar: "6Ø12 (Subsuelo) / 4Ø12 (PB) + Est. Ø6",
      builtTopY: 2.88,
      designTopY: 2.88,
      notes: "Pilar robusto 25x40 en subsuelo y 15x30 en PB; ya hormigonado hasta Losa de Planta Alta (+2.88m)."
    },
    {
      id: "P17",
      ejeX: "Eje 9",
      ejeZ: "Eje A",
      x: -4.87,
      z: 13.34,
      sectionW: 0.30,
      sectionD: 0.15,
      zapataId: "Z-P17",
      zapataSize: "130x70x50/40 cm",
      rebar: "4Ø12 + Est. Ø6 c/10-15 cm",
      builtTopY: 2.88,
      designTopY: 5.64,
      notes: "Esquina Suroeste de Galería al Río sobre medianera Sur; ya hormigonado en PB hasta +2.88m."
    },
    {
      id: "P18",
      ejeX: "Eje 9",
      ejeZ: "Eje B",
      x: -4.87,
      z: 9.94,
      sectionW: 0.40,
      sectionD: 0.25,
      zapataId: "Z-(P16-P18)",
      zapataSize: "240x215x50/40 cm (combinada P16-P18)",
      rebar: "6Ø12 (Subsuelo) / 4Ø12 (PB-PA) + Est. Ø6",
      builtTopY: 2.88,
      designTopY: 5.64,
      notes: "Medianera Izquierda (Eje 9) línea Galería; ya hormigonado en PB hasta +2.88m."
    },
    {
      id: "P19",
      ejeX: "Eje 9",
      ejeZ: "Eje E",
      x: -4.87,
      z: 4.77,
      sectionW: 0.40,
      sectionD: 0.20,
      zapataId: "Z-(P19-P20)",
      zapataSize: "355x105x50/40 cm (combinada P19-P20)",
      rebar: "6Ø12 (Subsuelo) / 4Ø12 (PB-PA) + Est. Ø6",
      builtTopY: 2.88,
      designTopY: 5.64,
      notes: "Medianera Izquierda (Eje 9); ya hormigonado en PB hasta +2.88m."
    },
    {
      id: "P20",
      ejeX: "Eje 9",
      ejeZ: "Eje G",
      x: -4.87,
      z: 3.00,
      sectionW: 0.30,
      sectionD: 0.15,
      zapataId: "Z-(P19-P20)",
      zapataSize: "355x105x50/40 cm (combinada P19-P20)",
      rebar: "4Ø12 + Est. Ø6 c/10-15 cm",
      builtTopY: 2.88,
      designTopY: 5.64,
      notes: "Esquina Sureste Fachada Frontal sobre medianera Sur; ya hormigonado en PB hasta +2.88m."
    }
  ]
};

// Acta de Recepción de Obra (29/12/2025) & Informes Técnicos 2 y 3 (JIVESA S.A. / PROBETI S.R.L.)
export const ACTA_RECEPCION_SUMMARY = {
  fechaActa: "2025-12-29",
  contratista: "JIVESA S.A.",
  propietario: "Leonardo Gómez",
  estadoRealObraHoy: {
    resumen: "Zapatas, Subsuelo, Escalera 1 (Eje 8–9), Losas macizas L1/L4 y los 17 Pilares de PB hasta +2.88m ya hormigonados. Hueco abierto de 38,00 m² en Losa 1 (Eje B–G × Eje 1–5) a cerrar con Loza Rap. 0 m² de ladrillos.",
    avanceEsqueletoPB: 100,
    mamposteriaEjecutadaM2: 0,
    itemsCompletados: [
      "Excavación y profundización adicional de fundaciones (+1.00 m por estrato superior suelto) hasta cota +95.36m.",
      "100% de Zapatas aisladas/combinadas y vigas centradoras de equilibrio VC.T-1 (40x50 cm).",
      "100% de los 20 Pilares en Subsuelo (P1 a P20) y 100% de los 17 Pilares de Planta Baja ya hormigonados hasta cota +2.88m (+102.88m).",
      "100% de Vigas de Subsuelo (Pórticos 1 a 7 en cota -2.34m / +97.66m) y vigas perimetrales/interiores de Losa 1.",
      "Losa 1 en hormigón visto ejecutada en Galería L1 (-0.45m / +99.55m, Eje A–B) y Losa L4 maciza (+0.00m / +100.00m, Eje B–G × Eje 5–9), quedando el vacío estructural entre vigas de 38.00 m² (Eje B–G × Eje 1–5) listo para cerrar con Loza Rap.",
      "100% de Escalera 1 de H°A° en Eje 8–9 vinculando Subsuelo y Planta Baja.",
      "Portón Balancín de 2.30m y Portoncito Peatonal de 0.95m haciendo juego en chapa gris grafito (100% ciegos hacia adentro) instalados sobre el frente municipal."
    ],
    itemsNoEjecutadosAun: [
      "Cerramiento con Loza Rap de 38.00 m² en el hueco abierto de Losa 1 (cuadrante Eje B–G × Eje 1–5, Fila 9 Planilla LG-RB).",
      "0 m² de mampostería de ladrillos (ni en subsuelo ni en planta baja/alta).",
      "Muro de contención frontal en z=+1.50m para relleno de cochera + Piso de Rejilla Metálica Electroforjada y Rejas Laterales sobre el hueco de oxigenación (z=1.50m..3.00m) + Pérgola de madera para enredadera y techo translúcido antigranizo.",
      "Aislación hidrófuga del muro vecino en Medianera Izquierda (Eje 9) expuesto por la excavación.",
      "Escalera 2 (Eje 1–2 que sube a Planta Alta), Losa de 2do Piso (+2.88m), continuación de 14 pilares a Techo y Cubierta (+5.64m)."
    ]
  },
  ensayosCompresionProbeti: {
    laboratorio: "PROBETI S.R.L.",
    informeNumero: "17671",
    resistenciaDisenoFckKgCm2: 250,
    resultados: [
      {
        sector: "Pilares P1 a P8",
        resistenciaMediaKgCm2: 264.85,
        edadDias: 28,
        cumpleEspecificacion: true,
        observacion: "Supera fck = 250 kg/cm² (HA-25)"
      },
      {
        sector: "Pilares P9 a P20",
        resistenciaMediaKgCm2: 240.30,
        edadDias: 28,
        cumpleEspecificacion: true,
        observacion: "Supera ampliamente fck = 210 kg/cm² admisible de obra"
      },
      {
        sector: "Losa Planta Baja (L1-L4) + Escalera 1",
        resistenciaRangoKgCm2: [305.60, 325.75],
        resistenciaMediaKgCm2: 315.68,
        edadDias: 28,
        cumpleEspecificacion: true,
        observacion: "Resistencia sobresaliente (+26% a +30% por encima de HA-25), apta para acabado de hormigón visto"
      }
    ]
  },
  liquidacionFinancieraJivesa: {
    moneda: "PYG",
    contratoOriginalGs: 130692541,
    adicionalProfundizacionYLosaVistaGs: 33128431,
    totalEjecutadoGs: 163820972,
    totalAbonadoGs: 142313711,
    saldoPendienteRetenidoGs: 21507261,
    detalleAdicional: "Profundización extra de zapatas (-1.00m adicional hasta suelo firme) y terminación en hormigón visto de Losa 1."
  }
};

// 10 Omisiones y Patologías Críticas detectadas en las planillas Excel/PDF originales (Auditoría Forense)
export const OMISIONES_CRITICAS_PRESUPUESTO = [
  {
    id: "omision_medianera_eje9",
    numero: 1,
    severidad: "CRÍTICA",
    titulo: "Patología en Medianera Izquierda (Eje 9 sin aislación hidrófuga al excavar)",
    origenDetectado: "Informe Técnico N° 2 y N° 3 / Inspección visual de excavación en Eje 9",
    problema: "Al excavar el subsuelo hasta cota -2.34m sobre el Eje 9, el cimiento y muro del vecino izquierdo quedaron descalzados/expuestos sin pantalla hidrófuga ni drenaje, generando ingreso directo de agua de lluvia y humedad lateral hacia el futuro departamento del subsuelo.",
    solucionTecnica: "Ejecutar tabique de submural / azotado hidrófugo con aditivo cristalizante, membrana asfáltica líquida poliuretánica y canaleta de drenaje al pie del Eje 9 antes de levantar paredes interiores.",
    costoEstimadoGs: 6850000,
    partidaVinculadaId: "forense_aislacion_medianera_eje9"
  },
  {
    id: "omision_cloaca_subsuelo",
    numero: 2,
    severidad: "CRÍTICA",
    titulo: "Imposibilidad Física de Desagüe Cloacal por Gravedad en Subsuelo (Cota -2.34m vs Calle +0.00m)",
    origenDetectado: "Cruce de cotas topográficas (Subsuelo +97.66m vs Colector Calle Guillermo Arias +100.00m) y Plano IS/IH",
    problema: "El Excel presupuestó únicamente las cañerías internas del subsuelo, pero omitió que el subsuelo está 2.34 metros por debajo del nivel de la calle. El efluente cloacal no puede subir por gravedad hacia la red pública de ESSAP sobre Guillermo Arias.",
    solucionTecnica: "Construir Cámara Séptica + Pozo Absorbente calzado en ladrillo Tobatí en el corredor izquierdo del patio inferior (cota +96.20m, Ejes 8–9) como indica el plano sanitario, con acceso de manguera de camión cisterna por Escalera 1.",
    costoEstimadoGs: 6800000,
    partidaVinculadaId: "forense_cloaca_subsuelo_bombeo"
  },
  {
    id: "omision_puente_epoxico_pilares",
    numero: 3,
    severidad: "ALTA",
    titulo: "Rehabilitación de Losa 1 Expuesta y Puente de Adherencia Epóxico (Sikadur-32 Gel) en Nudos y Arranques",
    origenDetectado: "Estado actual de Losa 1 y 17 pilares de PB (hormigonados en dic-2025 y expuestos a la intemperie)",
    problema: "La Losa 1 y los 17 pilares de PB (hormigonados hasta +2.88m) estuvieron meses expuestos al sol e intemperie, presentando microfisuras de retracción térmica y oxidación superficial en pelos de espera. Las planillas de continuación no incluyeron hidrolavado, sellado Sikaflex ni puente epóxico estructural.",
    solucionTecnica: "Hidrolavado 2.500 PSI, sellado Sikaflex-1A/SikaTop-107, limpieza con desoxidante fosfatizante en barras de espera y aplicación de puente epóxico Sikadur-32 Gel en juntas frías de vigas/losa PA y puente SikaLatex en carpeta.",
    costoEstimadoGs: 7050000,
    partidaVinculadaId: "forense_puente_adherencia_epoxico"
  },
  {
    id: "omision_fila9_lozarrap",
    numero: 4,
    severidad: "CRÍTICA",
    titulo: "Omisión de Precio en Fila 9 del Excel 'Planilla computo LG-RB + Lozarrap.xlsx' (Vacío de 38,00 m² en Losa 1)",
    origenDetectado: "Auditoría de fórmulas en 'Planilla computo LG-RB + Lozarrap.xlsx', PDF 'PPTO LG-RB-1.pdf' y verificación del hueco abierto en obra",
    problema: "En Planta Baja hoy existe un hueco abierto entre vigas de 38.00 m² (cuadrante Eje B a Eje G y Eje 1 a Eje 5, donde irá el Estar Social). En la planilla LG-RB la Fila 9 ('Cerramiento con loza rap: 38.00 m²') tiene cargada la cantidad exacta (38.00 m²) pero la celda de Precio Unitario quedó vacía (0 Gs), subestimando la Etapa 1 en Gs. 14.440.000.",
    solucionTecnica: "Incorporar como ESENCIAL de Etapa 1 (Crédito 300M) los 38.00 m² de cerramiento horizontal con viguetas pretensadas Lozarrap, bovedillas, malla Ø5mm y capa de compresión H°A° a razón de Gs. 380.000/m² para completar el piso del Estar en PB.",
    costoEstimadoGs: 14440000,
    partidaVinculadaId: "forense_omision_fila9_lozarrap"
  },
  {
    id: "omision_pilares_apeados_pb",
    numero: 5,
    severidad: "CRÍTICA ESTRUCTURAL",
    titulo: "Restricción Estructural de Pilares que Mueren en Planta Baja (P12, P13 y P15)",
    origenDetectado: "Plano Estructural E4 (Planta Alta) y E9 (Cuadro de Pilares — Ing. Gustavo Velázquez)",
    problema: "Los pilares P12 (Eje 6-C), P13 (Eje 5-E) y P15 (Eje 8-C) nacen en las zapatas para sostener la Losa sobre Subsuelo pero MUEREN en el nivel de Planta Baja (Y = 0.00m), mientras que los otros 17 pilares ya están hormigonados hasta +2.88m. Si se levantan muros pesados de ladrillo macizo sobre P12/P13/P15 en el 2do piso sin apeo, se sobrecargará la losa.",
    solucionTecnica: "En Planta Alta, alinear los cerramientos portantes sobre los ejes principales y ejecutar las divisiones interiores entre Dormitorio Principal, Dormitorio 2, Escritorio y Baños sobre la vertical de P12, P13 y P15 mediante tabiquería liviana (Durlock W112 / ladrillo hueco cerámico no portante con viga chata de reparto).",
    costoEstimadoGs: 4200000,
    partidaVinculadaId: "forense_tabiqueria_liviana_apeo"
  },
  {
    id: "omision_rubro_30_2_canaletas",
    numero: 6,
    severidad: "ALTA",
    titulo: "Rubro 30.2 en 0 Gs en PRESUPUESTO COMPLETO: Canaletas y Bajadas Pluviales (Núcleo Eje F–G y Eje A)",
    origenDetectado: "Planilla 'PRESUPUESTO COMPLETO' (Rubro 30.2 con subtotal Gs. 0) vs. Plano IAA",
    problema: "El presupuesto general dejó en 0 Gs las canaletas y bajadas pluviales (Rubro 30.2). Descargar libremente el agua de 86 m² de cubierta sobre el talud arenoso (estrato SM) provocará erosión regresiva y socavación de las zapatas del Eje A.",
    solucionTecnica: "Instalar canaletas ocultas de chapa galvanizada N° 24/26 y bajadas pluviales de PVC Ø100mm alineadas al Núcleo Húmedo Eje F–G y Eje A encauzadas hasta el pie del barranco con disipador de energía (incluido en partida 3.3).",
    costoEstimadoGs: 7800000,
    partidaVinculadaId: "desagues_canaletas"
  },
  {
    id: "omision_rubro_29_4_29_5_datos",
    numero: 7,
    severidad: "MEDIA",
    titulo: "Rubros 29.4 y 29.5 en 0 Gs: Señales Débiles, Red de Datos e Internet",
    origenDetectado: "Planilla 'PRESUPUESTO COMPLETO' (Rubros 29.4 y 29.5 en 0 Gs vs Plano ISD)",
    problema: "Pese a existir el plano ejecutivo 'ISD - Instalación de Señales Débiles', el presupuesto dejó en 0 Gs los rubros 29.4 y 29.5. Si no se embuten los caños corrugados independientes antes del revoque, habrá que picar muros terminados.",
    solucionTecnica: "Ejecutar canalización embutida independiente, cajas de pase, cableado UTP Cat6 100% cobre y puntos Wi-Fi Mesh (cubierto en partidas 12.1 y 12.4).",
    costoEstimadoGs: 3330000,
    partidaVinculadaId: "debil_cableado_cat6"
  },
  {
    id: "omision_rubro_28_1_sanitarios",
    numero: 8,
    severidad: "MEDIA",
    titulo: "Rubro 28.1 en 0 Gs: Artefactos Sanitarios y Griferías (Núcleo Húmedo Vertical Eje F–G)",
    origenDetectado: "Planilla 'PRESUPUESTO COMPLETO' (Rubro 28.1 en 0 Gs)",
    problema: "Se cotizó la red de cañerías en el Eje F–G pero se dejó en 0 Gs la provisión y colocación de inodoros, lavatorios, duchas y griferías necesarias para habilitar el Baño en Suite, Baño 2 PA y Baño Social PB.",
    solucionTecnica: "Provisión e instalación de artefactos sanitarios, griferías monocomando y accesorios de baño sobre el Núcleo Húmedo Eje F–G (integrado en partida 10.1).",
    costoEstimadoGs: 7300000,
    partidaVinculadaId: "bano_suite_sanitarios"
  },
  {
    id: "omision_rubro_27_3_termocalefon",
    numero: 9,
    severidad: "MEDIA",
    titulo: "Rubro 27.3 en 0 Gs: Termocalefón y Conexión de Agua Caliente en Eje F–G",
    origenDetectado: "Planilla 'PRESUPUESTO COMPLETO' (Rubro 27.3 en 0 Gs)",
    problema: "La red de agua caliente en PPR termofusión sobre la montante vertical del Eje F–G fue presupuestada, pero el equipo termocalefón quedó en 0 Gs.",
    solucionTecnica: "Provisión y montaje de termocalefón de 80 litros en el núcleo húmedo del Eje F–G para abastecer en vertical corta Baño en Suite, Baño 2 PA y Cocina PB (integrado en partida 10.1).",
    costoEstimadoGs: 2500000,
    partidaVinculadaId: "bano_suite_sanitarios"
  },
  {
    id: "omision_rubro_33_1_barandas",
    numero: 10,
    severidad: "CRÍTICA SEGURIDAD",
    titulo: "Rubro 33.1 en 0 Gs: Barandas de Escaleras 1 y 2 y Galería/Terraza al Río (Caída libre de 3.20m)",
    origenDetectado: "Planilla 'PRESUPUESTO COMPLETO' (Rubro 33.1 en 0 Gs) y verificación de desnivel en Eje A",
    problema: "La Losa L1 de la Galería (+99.55m) tiene una caída libre de más de 3.20 metros hacia el terreno natural en pendiente y las Escaleras 1 (Eje 8–9) y 2 (Eje 1–2) requieren barandas. El rubro 33.1 quedó en 0 Gs.",
    solucionTecnica: "Instalar barandas de protección definitivas de hierro galvanizado pintado al horno en todo el borde del Eje A (9.74m), en las Escaleras 1 y 2 y rejas laterales sobre el foso de oxigenación frontal.",
    costoEstimadoGs: 11200000,
    partidaVinculadaId: "forense_barandas_seguridad"
  }
];

// Geotechnical Boreholes & Stratigraphy (GEO-STAN #2956)
export const GEOTECHNICAL_DATA = {
  summary: "Macizo de arenisca con estrato superior de arena limosa. Terreno sumamente estable y firme con rechazo SPT > 50 golpes a partir de los 5.0m de profundidad. No se detectó nivel freático hasta los 10.05m. Durante la excavación (Acta 29/12/2025) se profundizaron las zapatas 1.00m adicional hasta cota +95.36m para apoyar directamente sobre el estrato compacto.",
  boreholes: [
    {
      id: "S1",
      name: "Sondeo S-1 (Frente)",
      cotaBoca: 99.84,
      profundidad: 10.05,
      xRel: 0,
      yRel: 3,
      estratos: [
        { de: 0.0, a: 4.0, tipo: "SM", desc: "Arena limosa marrón claro, compacidad media a densa", nspt: "16-20", color: "#C49A45" },
        { de: 4.0, a: 5.0, tipo: "SP-SM", desc: "Arena mal graduada algo limosa, densa", nspt: "20", color: "#9E782F" },
        { de: 5.0, a: 10.05, tipo: "Roca Blanda / Arenisca", desc: "Arenisca cementada (Rechazo SPT > 50, Nb 4.2 - 8.3)", nspt: ">50", color: "#6E5421" }
      ]
    },
    {
      id: "S2",
      name: "Sondeo S-2 (Centro)",
      cotaBoca: 97.15,
      profundidad: 10.04,
      xRel: 0.5,
      yRel: 18,
      estratos: [
        { de: 0.0, a: 3.5, tipo: "SM", desc: "Arena limosa marrón claro, compacidad media", nspt: "11-18", color: "#C49A45" },
        { de: 3.5, a: 5.0, tipo: "SP-SM", desc: "Arena densa algo cementada", nspt: "18-20", color: "#9E782F" },
        { de: 5.0, a: 10.04, tipo: "Roca Blanda / Arenisca", desc: "Arenisca cementada firme (Rechazo SPT > 50, Nb 4.8 - 8.3)", nspt: ">50", color: "#6E5421" }
      ]
    },
    {
      id: "S3",
      name: "Sondeo S-3 (Fondo/Barranco)",
      cotaBoca: 96.20,
      profundidad: 10.05,
      xRel: -0.2,
      yRel: 29,
      estratos: [
        { de: 0.0, a: 1.5, tipo: "Relleno/SM", desc: "Material de relleno y arena limosa suelta", nspt: "7-9", color: "#D1A75C" },
        { de: 1.5, a: 4.5, tipo: "SM", desc: "Arena limosa marrón claro", nspt: "9-12", color: "#C49A45" },
        { de: 4.5, a: 10.05, tipo: "Arenisca", desc: "Arenisca maciza (Rechazo SPT > 50, Nb 4.8 - 8.3)", nspt: ">50", color: "#6E5421" }
      ]
    }
  ]
};

// Architectural spaces aligned 100% with Official Blueprints (instalacion_sanitaria_agua.png & estructural_e5_subsuelo_escalera.png)
export const ARCHITECTURAL_ROOMS = [
  {
    id: "galeria",
    name: "Galería Panorámica al Río (Losa L1 — Sin Parrilla Fija en PB)",
    level: "Planta Baja Rebajada (+99.55m / -0.45m)",
    dimensions: "3.50m x 9.55m (Eje A a Eje B)",
    area: 33.42,
    desc: "Galería mirador sobre Losa L1 rebajada -0.45m (ya hormigonada en H°A° visto) con orientación Noroeste hacia el Río Paraguay. Queda 100% libre como expansión social (la parrillita fija se ubica abajo en el Subsuelo hacia el patio).",
    highlights: ["Losa L1 ya ejecutada en H°A° visto", "Orientación Noroeste al Río Paraguay (85-96m)", "Ventanales Blindex en Eje B"]
  },
  {
    id: "estar_comedor",
    name: "Estar Social Principal (Sector Loza Rap 38.00 m² + Escalera 2 en Eje 1–2)",
    level: "Planta Baja (+100.00m / +2.34m est.)",
    dimensions: "4.95m x 4.80m (Eje 1–5 × Eje B–E)",
    area: 23.76,
    desc: "Área social principal en el cuadrante izquierdo/Norte (x = -0.74m a +3.84m, z = 5.00m a 9.94m) sobre el paño de 38.00 m² que se cierra con viguetas Loza Rap en Etapa 1, vinculada a la Escalera 2 (Eje 1–2, 3.90×0.80m) que sube a Planta Alta.",
    highlights: ["Cierre con Loza Rap 38.00 m² en Etapa 1", "Escalera 2 en Eje 1–2 sube a Planta Alta", "Ventanales corredizos Blindex en Eje B al Río"]
  },
  {
    id: "cocina",
    name: "Cocina / Comedor Integrado (Sobre Losa L4 Ejecutada + Escalera 1 en Eje 8–9)",
    level: "Planta Baja (+100.00m / +2.34m est.)",
    dimensions: "6.20m x 2.75m (Eje 5–9 × Eje B–G)",
    area: 17.05,
    desc: "Cocina y comedor en el ala derecha/Sur (x = -4.87m a -0.74m, z = 3.00m a 9.94m) sobre la Losa maciza L4 ya hormigonada, alineada al Núcleo Húmedo Frontal del Eje F–G y contigua a la Escalera 1 (Eje 8–9, 3.30×0.90m) que baja al Subsuelo.",
    highlights: ["Sobre Losa maciza L4 (315 kg/cm²) ya ejecutada", "Núcleo húmedo vertical en Eje F–G", "Escalera 1 en Eje 8–9 baja a Subsuelo"]
  },
  {
    id: "bano_social",
    name: "Baño Social / SSHH (Núcleo Húmedo Frontal Eje F–G)",
    level: "Planta Baja (+100.00m)",
    dimensions: "1.10m x 2.00m (Eje 5–6 × Eje F–G)",
    area: 2.20,
    desc: "Sanitario social ubicado en el frente (x = -1.64m a -0.40m, z = 3.00m a 5.00m) sobre el Eje F–G, compartiendo columna montante de agua PPR, desagüe cloacal y pluvial con la Cocina y los 2 baños de Planta Alta.",
    highlights: ["Alineado al Núcleo Húmedo Vertical Eje F–G", "Ventilación alta hacia fachada Eje G", "Unifica bajadas con los 2 baños de Planta Alta"]
  },
  {
    id: "suite",
    name: "Planta Alta Completa: 2 Dormitorios + Escritorio/Desk + 2 Baños + Vestidor (Sin Balcón Frontal)",
    level: "Planta Alta (+102.88m / +5.22m est.)",
    dimensions: "9.74m x 6.94m interior + Terraza al Río Eje A–B",
    area: 67.59,
    desc: "Al desembarcar de la Escalera 2 (Eje 1–2) se ubica el Escritorio / Desk (x=+1.80..+4.87m, z=7.37..9.94m), seguido del Dormitorio 2 (x=-0.74..+1.80m, z=5.26..9.94m) y el Dormitorio Principal en Suite (x=-4.87..-0.74m, z=5.00..9.94m). Sobre el frente Eje F–G (z=3.00..5.00m) se alinean el Vestidor, el Baño en Suite y el Baño 2 PA, con muro frontal cerrado en Eje G (sin balcón ni Blindex frontal) y Terraza al Río en Eje A–B.",
    highlights: ["2 Dormitorios + Escritorio/Desk al subir Escalera 2", "Vestidor + Baño Suite + Baño 2 alineados en Eje F–G", "Frente Eje G cerrado sin balcón ni Blindex frontal"]
  },
  {
    id: "cochera_muro",
    name: "Cochera Frontal: Portón Balancín 2.30m + Peatonal, Pérgola Antigranizo y Piso de Rejilla Metálica",
    level: "Nivel Calle (+100.00m, z = -4.00m a +3.00m)",
    dimensions: "9.89m x 7.00m",
    area: 69.23,
    desc: "Cochera frontal con Muro Frontal 100% Ciego, Portón Balancín existente de 2.30m (x=+1.20..+3.50m) y Portoncito Peatonal haciendo juego de 0.95m (x=-2.20..-1.25m) en chapa gris grafito (100% ciegos hacia adentro). Incorpora Pérgola de Madera para Enredadera + Techo Translúcido Antigranizo sobre el vehículo y Piso de Rejilla Metálica Electroforjada Transitable + Rejas Laterales sobre el hueco de oxigenación del subsuelo (z=1.50m..3.00m).",
    highlights: ["Portón Balancín 2.30m + Portoncito 0.95m gris grafito 100% ciego", "Piso de Rejilla Metálica Electroforjada en z=1.50m..3.00m", "Pérgola de madera p/ enredadera + techo translúcido antigranizo"]
  },
  {
    id: "subsuelo_depto",
    name: "Subsuelo (+97.66m): Lavadero, Depósito y Parrillita / Quincho Inferior hacia el Patio",
    level: "Nivel Subsuelo (+97.66m / -2.34m)",
    dimensions: "9.74m x 10.34m (100.71 m² bajo Losa 1)",
    area: 100.71,
    desc: "Nivel inferior con vigas de Pórticos 1 a 7 y llegada de Escalera 1 en Eje 8–9 ya ejecutadas, ventilado e iluminado por el foso de oxigenación frontal (z=1.50m..3.00m bajo el piso de rejilla metálica). Aloja el Lavadero, el Depósito, la Cisterna de 1.000L y la Parrillita / Quincho Inferior hacia el patio (x=-4.87..-1.64m, z=11.50..13.34m).",
    highlights: ["Parrillita / Quincho ubicada abajo hacia el patio", "Escalera 1 en Eje 8–9 ya ejecutada", "Oxigenación natural bajo piso de rejilla metálica en z=1.50..3.00m"]
  }
];

// Structural Foundation & Slab Registry (Updated with Forensic Audit & Acta 29/12/2025)
export const STRUCTURAL_ITEMS = [
  { id: "Z1_Z4", name: "Zapatas Ejes F-G y Medianeras (P1 a P20)", type: "Zapatas Aisladas/Combinadas + VC.T-1", desc: "Fundadas a cota +95.36m (-4.64m, profundizadas 1.00m extra) con vigas centradoras 40x50cm", status: "Ejecutado 100%" },
  { id: "Z5_Z12", name: "Vigas de Subsuelo (Pórticos 1 a 7) + Escalera 1 (Eje 8–9)", type: "Vigas H°A° HA-25 (Cota +97.66m)", desc: "Arriostramiento completo en nivel -2.34m y Escalera 1 en Eje 8–9 ejecutada al 100%", status: "Ejecutado 100%" },
  { id: "Z13_Z20", name: "20 Pilares en Subsuelo + 17 Pilares de PB ya Hormigonados hasta +2.88m", type: "Hormigón Armado HA-25 (240-265 kg/cm²)", desc: "P12, P13 y P15 mueren en PB (+0.00m); los otros 17 pilares de PB ya están hormigonados hasta +2.88m (+102.88m)", status: "Ejecutado 100%" },
  { id: "pilares", name: "Losa 1: Galería L1 (-0.45m) + Losa Maciza L4 (+0.00m) + Vacío 38.00 m²", type: "Losa H°A° Visto (305-325 kg/cm²) + Hueco entre Vigas", desc: "L1 y L4 hormigonadas; cuadrante Eje B–G × Eje 1–5 (38.00 m²) abierto entre vigas para cerrar con Loza Rap en Etapa 1", status: "L1/L4 Ejecutadas • 38 m² A Cerrar" },
  { id: "losa_fase1", name: "Cerramiento Loza Rap 38.00 m² en Losa 1 (PB) + Escalera 2 (Eje 1–2)", type: "Viguetas Pretensadas Loza Rap + H°A°", desc: "Cierre obligatorio en Etapa 1 del hueco de 38.00 m² en Planta Baja (Estar Social) y Escalera 2 hacia Planta Alta", status: "Próxima Etapa Crítica" },
  { id: "muro_cochera", name: "Muro Contención Cochera (z=+1.50m) + Rejilla Metálica + Pérgola Antigranizo", type: "Mampostería Armada 30cm + Rejilla Electroforjada", desc: "Muro en z=+1.50m, piso de rejilla metálica transitable sobre foso de oxigenación (z=1.50..3.00m) y pérgola de madera", status: "Próxima Etapa Crítica" },
  { id: "losa_fase2", name: "Losa 2do Piso / Planta Alta (Cota +102.88m — Sin Balcón Frontal)", type: "Losa H°A° / Loza Rap (+2.88m) s/ 17 Pilares Existentes", desc: "Entrepiso de Planta Alta apoyado sobre los 17 pilares de PB ya hormigonados hasta +2.88m (frente en Eje G sin voladizo)", status: "Próxima Etapa Crítica" },
  { id: "techo", name: "Elevación 14 Pilares a +5.64m, Vigas de Coronamiento y Cubierta (+105.64m)", type: "Isopanel PIR / Tejas Tobatí + Estructura Portante", desc: "Coronamiento en cota +5.64m s/calle con canaletas y bajadas pluviales por Eje F–G y Eje A", status: "Próxima Etapa Crítica" }
];

// Transcripción Íntegra y Exacta (0 omisiones) de los 2 Presupuestos de EDIFICA STUDIO E.A.S. — Arquitectura y Construcción
// Profesionales firmantes: Arq. Lissie Amarilla (C.I. 4.688.741, R.P.N° 4.688) y Arq. Roque León (C.I. 3.950.629, R.P.N° 4.598)
// Nota: En las planillas originales de Edifica Studio, las columnas "Unid.", "Cantidad" y "Precio Unitario" vienen en blanco, consignando el "Precio Total" global (Materiales + Mano de Obra).
export const EDIFICA_STUDIO_BUDGETS = {
  estudio: "EDIFICA STUDIO E.A.S. — Arquitectura y Construcción",
  profesionales: [
    { nombre: "Arq. Lissie Amarilla", ci: "4.688.741", rp: "4.688" },
    { nombre: "Arq. Roque León", ci: "3.950.629", rp: "4.598" }
  ],
  notaMetodologica:
    "Presupuesto estrictamente REFERENCIAL (NO es un escalón de crédito). Cotizaba únicamente 1 nivel principal (Planta Nivel Calle + Subsuelo, SIN 2do Piso), con columnas 'Unid.', 'Cantidad' y 'Precio Unitario' en blanco. Su elevado monto (Gs. 460,1M a 573,9M por solo 1 nivel) se explica porque duplicaba Gs. 80,75M de estructura hoy ya construida e incluía un recargo global de constructora 'Llave en Mano' (+25% a +32% por gestión, riesgo e imprevistos). Desglosarlo permitió tomar el control directo de costos.",
  laminasEscaneadas: [
    "./assets/planos/edifica_studio_573m_pag1.png",
    "./assets/planos/edifica_studio_573m_pag2.png",
    "./assets/planos/edifica_studio_460m_completo.png"
  ],
  opcionACompletaTotalGs: 573893750,
  opcionBReducidaTotalGs: 460160000,
  diferenciaAhorroOpcionBGs: 113733750,
  secciones: [
    {
      id: "planta_nivel_calle",
      titulo: "1. PLANTA A NIVEL DE CALLE (Planta Baja Cota +100.00m)",
      subtotalOpcionAGs: 341288750,
      subtotalOpcionBGs: 325826250,
      items: [
        { nro: "1", rubro: "TRABAJOS PRELIMINARES", unidOrig: "", cantOrig: "", puOrig: "", opcionAGs: 625000, opcionBGs: 625000, diffGs: 0, obs: "Igual en ambas opciones" },
        { nro: "2", rubro: "ESTRUCTURAS (PLANTA BAJA)", unidOrig: "", cantOrig: "", puOrig: "", opcionAGs: 45750000, opcionBGs: 45750000, diffGs: 0, obs: "Hoy ya ejecutado al 100% por JIVESA S.A." },
        { nro: "3", rubro: "ALBAÑILERIA", unidOrig: "", cantOrig: "", puOrig: "", opcionAGs: 40585000, opcionBGs: 40585000, diffGs: 0, obs: "Mampostería de cierre y divisiones PB" },
        { nro: "4", rubro: "AISLACIONES HIDRÓFUGAS", unidOrig: "", cantOrig: "", puOrig: "", opcionAGs: 2812500, opcionBGs: 2812500, diffGs: 0, obs: "Aislación horizontal base en PB" },
        { nro: "5", rubro: "TECHO DE CHAPAS", unidOrig: "", cantOrig: "", puOrig: "", opcionAGs: 47850000, opcionBGs: 47850000, diffGs: 0, obs: "Cubierta superior completa" },
        { nro: "6", rubro: "REVOQUES", unidOrig: "", cantOrig: "", puOrig: "", opcionAGs: 33737500, opcionBGs: 33737500, diffGs: 0, obs: "Revoques interiores y exteriores PB" },
        { nro: "7", rubro: "CONTRAPISOS", unidOrig: "", cantOrig: "", puOrig: "", opcionAGs: 4312500, opcionBGs: 4312500, diffGs: 0, obs: "Contrapisos sobre losa PB" },
        { nro: "8", rubro: "CARPETA PARA BASE DE PISO", unidOrig: "", cantOrig: "", puOrig: "", opcionAGs: 5031250, opcionBGs: 5031250, diffGs: 0, obs: "Carpeta hidrófuga/niveladora PB" },
        { nro: "9", rubro: "PISOS", unidOrig: "", cantOrig: "", puOrig: "", opcionAGs: 18937500, opcionBGs: 15937500, diffGs: -3000000, obs: "Recorte de Gs. 3.000.000 en Opción B" },
        { nro: "10", rubro: "REVESTIMIENTOS", unidOrig: "", cantOrig: "", puOrig: "", opcionAGs: 5900000, opcionBGs: 5900000, diffGs: 0, obs: "Revestimiento cerámico áreas húmedas PB" },
        { nro: "11", rubro: "PINTURAS", unidOrig: "", cantOrig: "", puOrig: "", opcionAGs: 19280000, opcionBGs: 19280000, diffGs: 0, obs: "Pintura general Planta Baja" },
        { nro: "12", rubro: "CIELORRASO (ÁREA DE ESTAR COMEDOR)", unidOrig: "", cantOrig: "", puOrig: "", opcionAGs: 5937500, opcionBGs: 0, diffGs: -5937500, obs: "Omitido en Opción B (queda hormigón visto)" },
        { nro: "13", rubro: "VIDRIO", unidOrig: "", cantOrig: "", puOrig: "", opcionAGs: 16617500, opcionBGs: 16617500, diffGs: 0, obs: "Paños vidriados / Blindex PB" },
        { nro: "14", rubro: "HERRERIA Y HOJALATERIA", unidOrig: "", cantOrig: "", puOrig: "", opcionAGs: 17150000, opcionBGs: 17150000, diffGs: 0, obs: "Herrería, barandas y zinguería PB" },
        { nro: "15", rubro: "ABERTURAS DE MADERA", unidOrig: "", cantOrig: "", puOrig: "", opcionAGs: 12312500, opcionBGs: 12312500, diffGs: 0, obs: "Puertas placa y marcos de madera PB" },
        { nro: "16", rubro: "INSTALACIÓN HIDROSANITARIA - ÁREAS HÚMEDAS (BAÑO SOCIAL)", unidOrig: "", cantOrig: "", puOrig: "", opcionAGs: 8212500, opcionBGs: 8212500, diffGs: 0, obs: "Baño social / suite PB" },
        { nro: "16b", rubro: "INSTALACIÓN HIDROSANITARIA - ÁREAS HÚMEDAS (COCINA)", unidOrig: "", cantOrig: "", puOrig: "", opcionAGs: 2837500, opcionBGs: 2837500, diffGs: 0, obs: "Instalación húmeda de cocina PB" },
        { nro: "17", rubro: "INSTALACIÓN DE AGUA CORRIENTE (solo frío) - EXTENSIÓN DE ALIMENTACIÓN", unidOrig: "", cantOrig: "", puOrig: "", opcionAGs: 2500000, opcionBGs: 2500000, diffGs: 0, obs: "Solo agua fría (sin red de agua caliente)" },
        { nro: "18", rubro: "INSTALACIÓN DE DESAGÜE CLOACAL - EXTENSIÓN DE CAÑERÍAS DE DESAGÜE", unidOrig: "", cantOrig: "", puOrig: "", opcionAGs: 8062500, opcionBGs: 8062500, diffGs: 0, obs: "Extensión cloacal nivel calle" },
        { nro: "19", rubro: "INSTALACIÓN DESAGÜE PLUVIAL - EXTENSIÓN DE CAÑERÍAS DE DESAGÜE", unidOrig: "", cantOrig: "", puOrig: "", opcionAGs: 5000000, opcionBGs: 5000000, diffGs: 0, obs: "Desagüe pluvial PB" },
        { nro: "20", rubro: "INSTALACIÓN ELÉCTRICA", unidOrig: "", cantOrig: "", puOrig: "", opcionAGs: 31525000, opcionBGs: 25000000, diffGs: -6525000, obs: "Recorte de Gs. 6.525.000 en Opción B" },
        { nro: "21", rubro: "TERMINACIONES", unidOrig: "", cantOrig: "", puOrig: "", opcionAGs: 6312500, opcionBGs: 6312500, diffGs: 0, obs: "Zócalos, limpieza y detalles finales PB" }
      ]
    },
    {
      id: "planta_nivel_terreno",
      titulo: "2. PLANTA A NIVEL DE TERRENO / SUBSUELO (Cota +97.66m / -2.34m)",
      subtotalOpcionAGs: 167543750,
      subtotalOpcionBGs: 103281250,
      items: [
        { nro: "1", rubro: "TRABAJOS PRELIMINARES", unidOrig: "", cantOrig: "", puOrig: "", opcionAGs: 625000, opcionBGs: 625000, diffGs: 0, obs: "Replanteo y preliminares subsuelo" },
        { nro: "2", rubro: "ESTRUCTURAS (CONTENCION)", unidOrig: "", cantOrig: "", puOrig: "", opcionAGs: 18750000, opcionBGs: 18750000, diffGs: 0, obs: "Contención en nivel inferior" },
        { nro: "3", rubro: "ESTRUCTURAS (FUNDACIONES)", unidOrig: "", cantOrig: "", puOrig: "", opcionAGs: 16250000, opcionBGs: 16250000, diffGs: 0, obs: "Hoy ya ejecutado al 100% por JIVESA S.A." },
        { nro: "4", rubro: "ALBAÑILERIA", unidOrig: "", cantOrig: "", puOrig: "", opcionAGs: 22550000, opcionBGs: 12775000, diffGs: -9775000, obs: "Recorte de Gs. 9.775.000 en Opción B" },
        { nro: "5", rubro: "AISLACIONES HIDRÓFUGAS", unidOrig: "", cantOrig: "", puOrig: "", opcionAGs: 1718750, opcionBGs: 1718750, diffGs: 0, obs: "Insuficiente para medianera Eje 9 descalzada" },
        { nro: "6", rubro: "REVOQUES", unidOrig: "", cantOrig: "", puOrig: "", opcionAGs: 28093750, opcionBGs: 10187500, diffGs: -17906250, obs: "Recorte de Gs. 17.906.250 en Opción B" },
        { nro: "7", rubro: "CONTRAPISOS", unidOrig: "", cantOrig: "", puOrig: "", opcionAGs: 4312500, opcionBGs: 4312500, diffGs: 0, obs: "Contrapiso sobre terreno natural en subsuelo" },
        { nro: "8", rubro: "CARPETA PARA BASE DE PISO", unidOrig: "", cantOrig: "", puOrig: "", opcionAGs: 5031250, opcionBGs: 5031250, diffGs: 0, obs: "Carpeta niveladora en subsuelo" },
        { nro: "9", rubro: "PISOS", unidOrig: "", cantOrig: "", puOrig: "", opcionAGs: 17968750, opcionBGs: 0, diffGs: -17968750, obs: "Omitido en Opción B (queda en carpeta)" },
        { nro: "10", rubro: "REVESTIMIENTOS", unidOrig: "", cantOrig: "", puOrig: "", opcionAGs: 262500, opcionBGs: 262500, diffGs: 0, obs: "Salpicadero mínimo en lavadero" },
        { nro: "11", rubro: "PINTURAS", unidOrig: "", cantOrig: "", puOrig: "", opcionAGs: 17081250, opcionBGs: 9418750, diffGs: -7662500, obs: "Recorte de Gs. 7.662.500 en Opción B" },
        { nro: "12", rubro: "VIDRIO", unidOrig: "", cantOrig: "", puOrig: "", opcionAGs: 3262500, opcionBGs: 0, diffGs: -3262500, obs: "Omitido en Opción B (subsuelo abierto)" },
        { nro: "13", rubro: "HERRERIA Y HOJALATERIA", unidOrig: "", cantOrig: "", puOrig: "", opcionAGs: 5925000, opcionBGs: 5925000, diffGs: 0, obs: "Herrería en subsuelo" },
        { nro: "14", rubro: "ABERTURAS DE MADERA", unidOrig: "", cantOrig: "", puOrig: "", opcionAGs: 2687500, opcionBGs: 0, diffGs: -2687500, obs: "Omitido en Opción B" },
        { nro: "15", rubro: "INSTALACIÓN HIDROSANITARIA - ÁREAS HÚMEDAS (LAVADERO)", unidOrig: "", cantOrig: "", puOrig: "", opcionAGs: 2837500, opcionBGs: 2837500, diffGs: 0, obs: "Área húmeda lavadero subsuelo" },
        { nro: "16", rubro: "INSTALACIÓN DE AGUA CORRIENTE (solo frío) - EXTENSIÓN DE ALIMENTACIÓN", unidOrig: "", cantOrig: "", puOrig: "", opcionAGs: 1250000, opcionBGs: 1250000, diffGs: 0, obs: "Bajada de agua fría al subsuelo" },
        { nro: "17", rubro: "INSTALACIÓN DE DESAGÜE CLOACAL - EXTENSIÓN DE CAÑERÍAS DE DESAGÜE", unidOrig: "", cantOrig: "", puOrig: "", opcionAGs: 2687500, opcionBGs: 2687500, diffGs: 0, obs: "ALERTA IA: No incluye pozo absorbente ni bombeo (-2.34m)" },
        { nro: "18", rubro: "INSTALACIÓN DESAGÜE PLUVIAL - EXTENSIÓN DE CAÑERÍAS DE DESAGÜE", unidOrig: "", cantOrig: "", puOrig: "", opcionAGs: 1250000, opcionBGs: 1250000, diffGs: 0, obs: "Pluvial en patio inferior" },
        { nro: "19", rubro: "INSTALACIÓN ELÉCTRICA", unidOrig: "", cantOrig: "", puOrig: "", opcionAGs: 15000000, opcionBGs: 10000000, diffGs: -5000000, obs: "Recorte de Gs. 5.000.000 en Opción B" }
      ]
    },
    {
      id: "construccion_exterior_frente",
      titulo: "3. CONSTRUCCIÓN EXTERIOR (FRENTE DE VIVIENDA — Calle Guillermo Arias)",
      subtotalOpcionAGs: 47517500,
      subtotalOpcionBGs: 31052500,
      items: [
        { nro: "1", rubro: "RELLENO Y COMPACTACIÓN", unidOrig: "", cantOrig: "", puOrig: "", opcionAGs: 18000000, opcionBGs: 18000000, diffGs: 0, obs: "Relleno compactado de cochera frontal" },
        { nro: "2", rubro: "MURALLA PERIMETRAL (FRONTAL)", unidOrig: "", cantOrig: "", puOrig: "", opcionAGs: 5500000, opcionBGs: 0, diffGs: -5500000, obs: "Omitida en Opción B" },
        { nro: "3", rubro: "PORTÓN", unidOrig: "", cantOrig: "", puOrig: "", opcionAGs: 11740000, opcionBGs: 11740000, diffGs: 0, obs: "Portón frontal sobre línea municipal" },
        { nro: "4", rubro: "VEREDA", unidOrig: "", cantOrig: "", puOrig: "", opcionAGs: 6750000, opcionBGs: 0, diffGs: -6750000, obs: "Omitida en Opción B" },
        { nro: "5", rubro: "CAMINERO PEATONAL", unidOrig: "", cantOrig: "", puOrig: "", opcionAGs: 1312500, opcionBGs: 1312500, diffGs: 0, obs: "Acceso peatonal desde calle" },
        { nro: "6", rubro: "CAMINERO VEHICULAR", unidOrig: "", cantOrig: "", puOrig: "", opcionAGs: 4215000, opcionBGs: 0, diffGs: -4215000, obs: "Huellas / piso vehicular omitido en Opción B" }
      ]
    },
    {
      id: "equipamiento_cocina",
      titulo: "4. EQUIPAMIENTO DE COCINA (Amoblamiento Interior)",
      subtotalOpcionAGs: 17543750,
      subtotalOpcionBGs: 0,
      items: [
        { nro: "1", rubro: "COCINA (Muebles bajo mesada / alacena)", unidOrig: "", cantOrig: "", puOrig: "", opcionAGs: 17543750, opcionBGs: 0, diffGs: -17543750, obs: "Omitido íntegramente en Opción B" }
      ]
    }
  ]
};

// Comparador Multi-Presupuesto Lado a Lado (6 Fuentes Oficiales + Auditoría IA)
export const COMPARADOR_MULTI_PRESUPUESTO = [
  {
    id: "jivesa_acta_hoy",
    fuente: "1. JIVESA S.A. — Ejecutado Hoy en Obra (Acta 29/12/2025)",
    profesional: "Ing. Gustavo Velázquez / JIVESA S.A. / PROBETI #17671",
    montoTotalGs: 163820972,
    estado: "100% Ejecutado (Abonado Gs. 142.313.711 | Saldo Gs. 21.507.261)",
    alcance: "Zapatas profundizadas (-4.64m), vigas VC.T-1, 20 pilares hasta PB, pórticos Subsuelo 1-7, Losa 1 vista (315 kg/cm²) y Escalera 1. 0 m² de ladrillos.",
    observacionIA: "Base real verificada en obra. No debe volver a pagarse en presupuestos de terminación.",
    badgeColor: "#f59e0b"
  },
  {
    id: "jivesa_lgrb_etapa1",
    fuente: "2. JIVESA / LG-RB — Muro Contención + Adaptación Cierre PB",
    profesional: "Planillas Excel 'Muro de Contención' + 'PPTO LG-RB-1.pdf'",
    montoTotalGs: 124192038,
    estado: "Cotización Parcial (Contención Gs. 38.017.878 + Cerramiento LG-RB Gs. 86.174.160)",
    alcance: "Muro contención cochera frontal + cierre básico en Planta Baja con viguetas Lozarrap.",
    observacionIA: "Omite el precio de la Fila 9 (38 m² Lozarrap = Gs. 14.440.000 en blanco) y no incluye 2do piso completo ni pozo cloacal subsuelo.",
    badgeColor: "#10b981"
  },
  {
    id: "jivesa_completo_285m",
    fuente: "3. JIVESA S.A. — Presupuesto Completo Original (Con Rubros en 0 Gs)",
    profesional: "Planilla General JIVESA S.A. (Rubros 1 al 35)",
    montoTotalGs: 285946238,
    estado: "Presupuesto Base Desglosado (Contiene 5 rubros críticos en 0 Gs)",
    alcance: "Obra general, pero deja en 0 Gs: Canaletas (30.2), Barandas (33.1), Termocalefón (27.3), Artefactos Sanitarios (28.1) y Señales Débiles (29.4/29.5).",
    observacionIA: "Al sumar las partidas dejadas en 0 Gs y las patologías forenses, el costo real asciende al rango de Gs. 335M–350M.",
    badgeColor: "#06b6d4"
  },
  {
    id: "edifica_opcion_b_460m",
    fuente: "4. REF. EDIFICA STUDIO Opción B (Solo 1 Nivel + Subsuelo Bruto)",
    profesional: "Arq. Lissie Amarilla (R.P. 4688) & Arq. Roque León (R.P. 4598)",
    montoTotalGs: 460160000,
    estado: "Solo Referencial • Cotizó 1 Solo Nivel (SIN 2do Piso ni P.U.)",
    alcance: "SOLO 1 NIVEL: Planta Calle (Gs. 325,8M) + Subsuelo en bruto sin piso/vidrio/puertas (Gs. 103,3M) + Exterior sin vereda (Gs. 31,0M) + Cocina Gs. 0. NO incluía el 2do Piso.",
    observacionIA: "¿Por qué era tan caro por solo 1 nivel? 1) Duplicaba Gs. 80,75M de estructura ya hecha; 2) Cargaba ~28% de margen 'Llave en Mano' sin abrir precios unitarios.",
    badgeColor: "#3b82f6"
  },
  {
    id: "edifica_opcion_a_573m",
    fuente: "5. REF. EDIFICA STUDIO Opción A (Solo 1 Nivel + Subsuelo Term.)",
    profesional: "Arq. Lissie Amarilla (R.P. 4688) & Arq. Roque León (R.P. 4598)",
    montoTotalGs: 573893750,
    estado: "Solo Referencial • Llave en Mano de 1 Nivel (SIN 2do Piso)",
    alcance: "SOLO 1 NIVEL: Planta Calle (Gs. 341,3M) + Subsuelo terminado (Gs. 167,5M) + Frente exterior (Gs. 47,5M) + Muebles Cocina (Gs. 17,5M). NO incluía Losa ni Dormitorio en 2do Piso.",
    observacionIA: "Sirvió como auditoría forense para detectar dónde estaba el sobreprecio (Gs. 80,75M duplicados + ~Gs. 115M de margen empresarial/imprevistos cerrados) y tomar control directo.",
    badgeColor: "#6366f1"
  },
  {
    id: "tabla_maestra_ia",
    fuente: "6. Previsión Bajo Control de Leo (3 Niveles + Negociación Arq.)",
    profesional: "Base para Banco y Negociación con Arquitecto (300M / 350M / 440M)",
    montoTotalGs: 350000000,
    estado: "Control Directo de Materiales + Mano de Obra + Fee Arquitecto",
    alcance: "Aprovecha el 100% del H°A° ya construido, levanta el 2do Piso (+102.88m) + Techo (+105.64m) logrando 3 niveles operativos y separa el honorario del Arquitecto e Imprevistos.",
    observacionIA: "Permite a Leo negociar con cualquier arquitecto sobre números abiertos: pagando gestión supervisada (~6-8%) o llave en mano auditado sin sobreprecios ocultos.",
    badgeColor: "#a855f7"
  }
];

// Partidas Presupuestarias y Rubros (Unificación Sin Omisiones: JIVESA + LG-RB + EDIFICA STUDIO + Auditoría IA)
// Cada ítem incluye:
// - origenTipo: 'PLANILLA_JIVESA_LGRB' | 'EDIFICA_STUDIO' | 'IA_AUDITORIA'
// - origenLabel: Etiqueta visual de fuente
// - camposEstimadosIA: Detalle explícito de qué campos fueron estimados o desglosados por IA según análisis
export const PRESUPUESTO_PARTIDAS = [
  // Prioridad 1: Muro de Contención Estacionamiento y Cochera
  {
    id: "contencion_cochera",
    categoria: "Contención y Estacionamiento",
    item: "1.1 Muro de Contención Estacionamiento (Calle Guillermo Arias)",
    unidad: "m2",
    cantidad: 46.70,
    formulaDim: "9.74m frente × 2.80m h + alas laterales = 46.70 m²",
    precioUnitarioGs: 273366,
    puJivesaGs: 273366,
    puLgrbGs: 273366,
    puEdificaRefGs: 401499,
    puIaGs: 273366,
    fuenteRecomendada: "JIVESA",
    subtotalGs: 12767308,
    esencial: true,
    origenTipo: "PLANILLA_JIVESA_LGRB",
    origenLabel: "📄 Planilla JIVESA / LG-RB",
    camposEstimadosIA: ["Ninguno en JIVESA (46.70 m² × Gs. 273.366); Ref. Edifica Studio Subsuelo #2 (Gs. 18.750.000 ÷ 46.70 m² = Gs. 401.499/m²) desglosada por IA"],
    desc: "Mampostería común de 0.30m con refuerzo de varillas 2Ø6mm cada 0.80m para retener rampa de estacionamiento (En Edifica Studio Subsuelo #2 figura global Gs. 18.750.000)."
  },
  {
    id: "viga_fundacion_muro",
    categoria: "Contención y Estacionamiento",
    item: "1.2 Viga de Fundación y Encadenado para Muro",
    unidad: "ml",
    cantidad: 14.50,
    formulaDim: "9.74m frente + 4.76m retorno cochera = 14.50 ml",
    precioUnitarioGs: 415457,
    puJivesaGs: 415457,
    puLgrbGs: 415457,
    puEdificaRefGs: 465000,
    puIaGs: 415457,
    fuenteRecomendada: "JIVESA",
    subtotalGs: 6024126,
    esencial: true,
    origenTipo: "PLANILLA_JIVESA_LGRB",
    origenLabel: "📄 Planilla JIVESA / LG-RB",
    camposEstimadosIA: ["Desglose en ml (14.50 ml) a partir de cómputo de H°A° de Planilla Muro Contención JIVESA"],
    desc: "Viga armada H°A° para asiento y amarre del muro frontal contra la calle."
  },
  {
    id: "aislacion_relleno_cochera",
    categoria: "Contención y Estacionamiento",
    item: "1.3 Aislación Hidrófuga y Relleno Compactado de Cochera",
    unidad: "gl",
    cantidad: 1,
    formulaDim: "Caja cochera 9.74m × 7.00m (z = -4.00m a +3.00m)",
    precioUnitarioGs: 14500000,
    puJivesaGs: 14500000,
    puLgrbGs: 14500000,
    puEdificaRefGs: 18000000,
    puIaGs: 14500000,
    fuenteRecomendada: "LGRB",
    subtotalGs: 14500000,
    esencial: true,
    origenTipo: "PLANILLA_JIVESA_LGRB",
    origenLabel: "📄 Planilla JIVESA / LG-RB",
    camposEstimadosIA: ["P.U. optimizado en planilla técnica (Gs. 14.500.000) vs. Edifica Studio Exterior #1 (Relleno y Compactación: Gs. 18.000.000)"],
    desc: "Revoque impermeable con aditivo cristalizante y relleno de tierra roja compactada entre z = -4.00m y z = +3.00m."
  },

  // Prioridad 2: Segunda Parte de la Losa (Planta Alta +102.88m / +2.88m)
  {
    id: "losa_segunda_parte",
    categoria: "Estructura Losa",
    item: "2.1 Losa de Planta Alta (+102.88m) Alivianada / Loza Rap y Capa Compresión",
    unidad: "m2",
    cantidad: 54.00,
    formulaDim: "9.74m ancho × 5.55m desarrollo PA = 54.00 m²",
    precioUnitarioGs: 295000,
    puJivesaGs: 340000,
    puLgrbGs: 295000,
    puEdificaRefGs: 355000,
    puIaGs: 295000,
    fuenteRecomendada: "LGRB",
    subtotalGs: 15930000,
    esencial: true,
    origenTipo: "PLANILLA_JIVESA_LGRB",
    origenLabel: "📄 Planilla JIVESA / LG-RB",
    camposEstimadosIA: ["Superficie ajustada por IA (54.00 m²) según Plano Estructural E4 (+102.88m) con viguetas pretensadas Lozarrap"],
    desc: "Entrepiso de 2do piso (+2.88m) con viguetas pretensadas, bovedillas y malla electrosoldada Ø5mm."
  },
  {
    id: "hormigon_vigas_losa",
    categoria: "Estructura Losa",
    item: "2.2 Vigas de Planta Alta (+2.88m), Escalera 2 (Eje 1–2) y Elevación de 14 Pilares a Techo (+5.64m)",
    unidad: "m3",
    cantidad: 11.50,
    formulaDim: "Vigas PA V201–V214 + Escalera 2 (Eje 1–2) + 14 pilares (+2.88m a +5.64m) = 11.50 m³",
    precioUnitarioGs: 2200000,
    puJivesaGs: 2450000,
    puLgrbGs: 2200000,
    puEdificaRefGs: 3978260,
    puIaGs: 2200000,
    fuenteRecomendada: "IA",
    subtotalGs: 25300000,
    esencial: true,
    origenTipo: "IA_AUDITORIA",
    origenLabel: "🤖 Incluido por IA (17 Pilares PB ya en +2.88m • Vigas PA + Escalera 2 + Pilares a Techo)",
    camposEstimadosIA: ["Volumen (11.50 m³) y P.U. (Gs. 2.200.000/m³) calculados por IA: los 17 pilares de PB ya están hormigonados hasta +2.88m; cubre vigas de PA, Escalera 2 (Eje 1–2) y elevación a +5.64m"],
    desc: "Los 17 pilares de Planta Baja ya están hormigonados hasta +2.88m. Esta partida cubre el hormigón estructural de las vigas de Planta Alta (+2.88m), la Escalera 2 en Eje 1–2 (que sube a PA) y la elevación de los 14 pilares hasta el techo (+5.64m)."
  },

  // Prioridad 3: Techo y Cubierta Termoacústica (+105.64m / +5.64m)
  {
    id: "cubierta_metalica",
    categoria: "Cubierta y Techo",
    item: "3.1 Techo Metálico Termoacústico en Cota +105.64m (Isopanel / Poliuretano)",
    unidad: "m2",
    cantidad: 86.00,
    formulaDim: "9.74m frente × 8.83m faldón c/ aleros = 86.00 m²",
    precioUnitarioGs: 379500,
    puJivesaGs: 379500,
    puLgrbGs: 379500,
    puEdificaRefGs: 356000,
    puIaGs: 379500,
    fuenteRecomendada: "LGRB",
    subtotalGs: 32637000,
    esencial: true,
    origenTipo: "PLANILLA_JIVESA_LGRB",
    origenLabel: "📄 Planilla JIVESA / LG-RB",
    camposEstimadosIA: ["Metraje (86.00 m²) y P.U. de planilla técnica (En Edifica Studio PB #5 Techo de Chapas + Estructura suma Gs. 47.850.000 global)"],
    desc: "Chapa trapezoidal superior con aislación de poliuretano inyectado PIR de 30-50mm y chapa inferior blanca vista."
  },
  {
    id: "estructura_metalica_techo",
    categoria: "Cubierta y Techo",
    item: "3.2 Estructura Portante Metálica y Vigas de Coronamiento (+5.64m)",
    unidad: "gl",
    cantidad: 1,
    formulaDim: "Correas C 100×50×15 + Apoyos s/ 14 pilares (+5.64m)",
    precioUnitarioGs: 18500000,
    puJivesaGs: 18500000,
    puLgrbGs: 18500000,
    puEdificaRefGs: 17234000,
    puIaGs: 18500000,
    fuenteRecomendada: "JIVESA",
    subtotalGs: 18500000,
    esencial: true,
    origenTipo: "PLANILLA_JIVESA_LGRB",
    origenLabel: "📄 Planilla JIVESA / LG-RB",
    camposEstimadosIA: ["Desglosado de estructura de cubierta para apoyar sobre los 14 pilares que llegan a +5.64m"],
    desc: "Perchas y correas metálicas tratadas con anticorrosivo sobre los 14 pilares que llegan al nivel de techo (+5.64m)."
  },
  {
    id: "desagues_canaletas",
    categoria: "Cubierta y Techo",
    item: "3.3 Canaletas de Chapa Galvanizada N° 26 y Bajadas Pluviales (Omitido 0 Gs en Rubro 30.2)",
    unidad: "gl",
    cantidad: 1,
    formulaDim: "19.50 ml canaleta pecho paloma + 4 bajadas Ø100mm",
    precioUnitarioGs: 7800000,
    puJivesaGs: 0,
    puLgrbGs: 7800000,
    puEdificaRefGs: 6250000,
    puIaGs: 7800000,
    fuenteRecomendada: "IA",
    subtotalGs: 7800000,
    esencial: true,
    origenTipo: "IA_AUDITORIA",
    origenLabel: "🤖 Incluido por IA (Análisis Técnico)",
    camposEstimadosIA: ["P. Unitario estimado por IA (Gs. 7.800.000): En JIVESA Rubro 30.2 figuraba en 0 Gs; en Edifica Studio PB #19 + Sub #18 suma Gs. 6.250.000"],
    desc: "Canaleta perimetral y bajadas PVC Ø100mm (Rubro 30.2 que figuraba en 0 Gs en el Presupuesto Completo original)."
  },

  // Prioridad 4: Cerramiento Perimetral ("Cerrar Todo" — hoy 0 m² de ladrillos en obra)
  {
    id: "mamposteria_exterior",
    categoria: "Albañilería y Cierre",
    item: "4.1 Mampostería Exterior Cerámica Hueca 15cm y Capas Aisladoras (Hoy 0 m²)",
    unidad: "m2",
    cantidad: 145.00,
    formulaDim: "Perímetro PB + PA (54.2m × 2.88m - vanos) = 145.00 m²",
    precioUnitarioGs: 115000,
    puJivesaGs: 132000,
    puLgrbGs: 115000,
    puEdificaRefGs: 279896,
    puIaGs: 115000,
    fuenteRecomendada: "LGRB",
    subtotalGs: 16675000,
    esencial: true,
    origenTipo: "PLANILLA_JIVESA_LGRB",
    origenLabel: "📄 Planilla JIVESA / LG-RB",
    camposEstimadosIA: ["Basado en Planilla LG-RB (Gs. 115.000/m²); En Edifica Studio Albañilería PB #3 = Gs. 40.585.000 (Gs. 279.896/m² implícito)"],
    desc: "Levantamiento de muros perimetrales sobre Losa 1 (actualmente 100% esqueleto sin paredes) con ladrillos 12x18x25."
  },
  {
    id: "revoque_exterior_impermeable",
    categoria: "Albañilería y Cierre",
    item: "4.2 Revoque Exterior e Interior Hidrófugo Monocapa",
    unidad: "m2",
    cantidad: 145.00,
    formulaDim: "145.00 m² de muros perimetrales e interiores clave",
    precioUnitarioGs: 65000,
    puJivesaGs: 74500,
    puLgrbGs: 65000,
    puEdificaRefGs: 232672,
    puIaGs: 65000,
    fuenteRecomendada: "LGRB",
    subtotalGs: 9425000,
    esencial: true,
    origenTipo: "PLANILLA_JIVESA_LGRB",
    origenLabel: "📄 Planilla JIVESA / LG-RB",
    camposEstimadosIA: ["Basado en Planilla LG-RB (Gs. 65.000/m²); En Edifica Studio Revoques PB #6 = Gs. 33.737.500 (incluye doble cara interior/exterior)"],
    desc: "Azotado impermeable con Ceresita + revoque fratasado para protección total de la intemperie."
  },
  {
    id: "puertas_seguridad_provisoria",
    categoria: "Albañilería y Cierre",
    item: "4.3 Cerramientos de Seguridad y Puertas de Acceso Exterior",
    unidad: "gl",
    cantidad: 1,
    formulaDim: "1 Puerta Principal Eje G + 2 Accesos Exteriores",
    precioUnitarioGs: 8500000,
    puJivesaGs: 9200000,
    puLgrbGs: 8500000,
    puEdificaRefGs: 9500000,
    puIaGs: 8500000,
    fuenteRecomendada: "LGRB",
    subtotalGs: 8500000,
    esencial: true,
    origenTipo: "PLANILLA_JIVESA_LGRB",
    origenLabel: "📄 Planilla JIVESA / LG-RB",
    camposEstimadosIA: ["Agrupado en global para cierre de seguridad exterior desde el primer escalón de crédito"],
    desc: "Cierre hermético de vanos exteriores, cerraduras multianclaje y puertas de seguridad para habitabilidad inmediata."
  },

  // Partidas de Galería, Aberturas e Instalaciones Esenciales de Habitabilidad
  {
    id: "galeria_voladizo_deck",
    categoria: "Galería y Exterior",
    item: "5.1 Terminación y Deck de Galería Panorámica al Río (Losa L1 Ejes A-B)",
    unidad: "m2",
    cantidad: 33.42,
    formulaDim: "9.74m ancho × 3.43m voladizo Ejes A-B = 33.42 m²",
    precioUnitarioGs: 650000,
    puJivesaGs: 685000,
    puLgrbGs: 650000,
    puEdificaRefGs: 690000,
    puIaGs: 650000,
    fuenteRecomendada: "LGRB",
    subtotalGs: 21723000,
    esencial: false,
    origenTipo: "PLANILLA_JIVESA_LGRB",
    origenLabel: "📄 Planilla JIVESA / LG-RB",
    camposEstimadosIA: ["Superficie exacta (33.42 m²) verificada por IA en Plano Estructural E3 (Losa L1 rebajada -0.45m)"],
    desc: "Terminación sobre Losa L1 rebajada (-0.45m), deck atérmico/madera y detalles de borde hacia el Río Paraguay."
  },
  {
    id: "parrilla_ducto",
    categoria: "Galería y Exterior",
    item: "5.2 Parrillita / Quincho Inferior Fijo hacia el Patio en Subsuelo (ÚLTIMA PRIORIDAD / OPCIONAL — Galería PB al Río va sin parrilla fija)",
    unidad: "un",
    cantidad: 1,
    formulaDim: "3.23m × 1.84m en Subsuelo hacia Patio (x = -4.87m..-1.64m, z = 11.50m..13.34m) — Galería PB limpia",
    precioUnitarioGs: 7500000,
    puJivesaGs: 8200000,
    puLgrbGs: 7500000,
    puEdificaRefGs: 8500000,
    puIaGs: 7500000,
    fuenteRecomendada: "LGRB",
    subtotalGs: 7500000,
    esencial: false,
    origenTipo: "PLANILLA_JIVESA_LGRB",
    origenLabel: "📄 Planilla JIVESA / LG-RB (Opcional — En Subsuelo hacia el Patio)",
    camposEstimadosIA: ["Según plano original de Instalación Sanitaria, la Galería PB al Río (Eje A-B) NO lleva parrilla fija; la parrillita fija con mesada húmeda se ubica abajo en el Subsuelo mirando al patio"],
    desc: "De acuerdo con los planos originales, la Galería PB al Río (Eje A–B) queda 100% despejada sin parrilla de material (allí puede usarse parrilla portátil), mientras que la Parrillita / Quincho fijo con bacha se ubica en el Subsuelo (+97.66m) vinculada directamente al patio e integrada al núcleo húmedo."
  },
  {
    id: "vidrios_templados_galeria",
    categoria: "Aberturas y Terminaciones",
    item: "6.1 Ventanales Corredizos de Vidrio Templado (Blindex) en Eje B al Río",
    unidad: "m2",
    cantidad: 24.00,
    formulaDim: "8.35m frente vidriado Eje B × 2.88m h = 24.00 m²",
    precioUnitarioGs: 750000,
    puJivesaGs: 790000,
    puLgrbGs: 750000,
    puEdificaRefGs: 692396,
    puIaGs: 750000,
    fuenteRecomendada: "EDIFICA",
    subtotalGs: 18000000,
    esencial: false,
    origenTipo: "EDIFICA_STUDIO",
    origenLabel: "📐 Edifica Studio (Arq. Amarilla & León)",
    camposEstimadosIA: ["Unid. (m²), Cant. (24.00) y P.U. (Gs. 750.000) desglosados por IA (En Edifica Studio PB #13 Vidrio = Gs. 16.617.500 = Gs. 692.396/m²)"],
    desc: "Cerramiento vidriado sobre Eje B (entre P2, P5, P9, P16 y P18) con perfiles de aluminio negro y rieles empotrados."
  },
  {
    id: "instalaciones_electricas_embutidas",
    categoria: "Instalaciones",
    item: "7.1 Red Eléctrica Embutida (Cañerías, Cajas y Tablero Principal — Plano IE)",
    unidad: "gl",
    cantidad: 1,
    formulaDim: "Tablero General + 42 bocas luz/tomas + circuitos AA y Cocina",
    precioUnitarioGs: 16500000,
    puJivesaGs: 28400000,
    puLgrbGs: 16500000,
    puEdificaRefGs: 25000000,
    puIaGs: 16500000,
    fuenteRecomendada: "LGRB",
    subtotalGs: 16500000,
    esencial: true,
    origenTipo: "PLANILLA_JIVESA_LGRB",
    origenLabel: "📄 Planilla JIVESA / LG-RB (Esencial Habitabilidad)",
    camposEstimadosIA: ["En LG-RB etapa habitable Gs. 16.500.000 (En Edifica Studio PB #20 = Gs. 31.525.000 Opción A / Gs. 25.000.000 Opción B)"],
    desc: "Caños corrugados reforzados, cajas octogonales/rectangulares, circuitos de tomas, cocina, baño, lavadero, AA e iluminación y puesta a tierra."
  },
  {
    id: "instalaciones_sanitarias_desagues",
    categoria: "Instalaciones",
    item: "7.2 Instalación Hidráulica Directa ESSAP (Sin Tanque, Buena Presión de Red) + PPR Frío/Caliente y Desagüe Cloacal en Núcleo Húmedo Eje F-G",
    unidad: "gl",
    cantidad: 1,
    formulaDim: "Acometida Directa Medidor ESSAP al costado del portón (x=-3.85m) + Pleno Vertical Eje F-G (PPR Fría/Caliente + PVC Cloacal 100/50/40mm — Sin Tanque)",
    precioUnitarioGs: 12600000,
    puJivesaGs: 19200000,
    puLgrbGs: 12600000,
    puEdificaRefGs: 21612500,
    puIaGs: 12600000,
    fuenteRecomendada: "LGRB",
    subtotalGs: 12600000,
    esencial: true,
    origenTipo: "PLANILLA_JIVESA_LGRB",
    origenLabel: "📄 Planilla JIVESA / LG-RB (Directo de Red ESSAP — Sin Tanque)",
    camposEstimadosIA: ["Ahorra Gs. 2.200.000 al eliminar tanque/bomba: aprovecha la buena presión de agua corriente ESSAP desde la caja de medidor a nivel de calle al costado del portón (x=-3.85m, z=-4.24m) hacia el Núcleo Húmedo vertical Eje F-G"],
    desc: "Alimentación directa desde el medidor ESSAP a nivel de calle al costado del portón (sin tanque de agua, aprovechando la buena presión de red de la zona), montantes PPR termofusión agua fría/caliente y bajadas PVC cloacal 100/50/40mm concentradas en el Núcleo Húmedo vertical del frente (Eje F–G, z = 3.00m..5.00m)."
  },
  {
    id: "pisos_porcelanato",
    categoria: "Aberturas y Terminaciones",
    item: "8.1 Contrapiso, Carpeta y Piso Porcelanato 60x60 en Planta Habitable",
    unidad: "m2",
    cantidad: 80.00,
    formulaDim: "80.00 m² interiores (Estar Social, Cocina/Comedor, Baño Social, Suite, Dormitorio 2 y Escritorio)",
    precioUnitarioGs: 180000,
    puJivesaGs: 215000,
    puLgrbGs: 180000,
    puEdificaRefGs: 199219,
    puIaGs: 180000,
    fuenteRecomendada: "LGRB",
    subtotalGs: 14400000,
    esencial: true,
    origenTipo: "PLANILLA_JIVESA_LGRB",
    origenLabel: "📄 Planilla JIVESA / LG-RB (Esencial Habitabilidad)",
    camposEstimadosIA: ["Metraje (80.00 m²) verificado en plano PB (En Edifica Studio PB #9 Pisos = Gs. 18.937.500 en Opción A / Gs. 15.937.500 en Opción B = Gs. 199.219/m²)"],
    desc: "Carpeta niveladora sobre Losa 1 (incluyendo los 38.00 m² cerrados con Loza Rap) y colocación de porcelanato rectificado 60x60 con pastina y zócalos."
  },
  {
    id: "porton_cochera_automatizado",
    categoria: "Contención y Estacionamiento",
    item: "9.1 Motorización de Portón Balancín Existente (2.30m en Chapa Grafito Ciega) + Portoncito Peatonal Haciendo Juego (0.95m × 2.18m c/ Cerradura Eléctrica) + Pérgola de Madera p/ Enredadera y Techo Antigranizo",
    unidad: "kit",
    cantidad: 1,
    formulaDim: "Motor Portón Balancín 2.30m (x=+1.20..+3.50m) + Portoncito Peatonal 0.95m en chapa grafito ciega (x=-2.20..-1.25m) + Pérgola Madera/Policarbonato Antigranizo",
    precioUnitarioGs: 2650000,
    puJivesaGs: 2850000,
    puLgrbGs: 2650000,
    puEdificaRefGs: 11740000,
    puIaGs: 2650000,
    fuenteRecomendada: "IA",
    subtotalGs: 2650000,
    esencial: true,
    origenTipo: "IA_AUDITORIA",
    origenLabel: "🤖 Incluido por IA según Análisis — Portón Balancín 2.30m ya instalado + Portoncito Peatonal 0.95m haciendo juego",
    camposEstimadosIA: ["El Portón Balancín de 2.30m de ancho (x=+1.20m a +3.50m, z=-4.00m) en chapa plegada grafito oscuro 100% ciega hacia adentro ya está instalado en obra (⚫ Negro Gs. 0); se presupuesta el Kit de Motorización Rápida PPA/Peccinin + Traba + Fotocélula y la integración con el Portoncito Peatonal haciendo juego de 0.95m (x=-2.20m a -1.25m) en la misma chapa grafito ciega sobre muralla frontal 100% ciega"],
    desc: "Sobre la muralla frontal 100% ciega (z = -4.00m), el Portón Balancín existente de 2.30m de ancho (x = +1.20m..+3.50m) en chapa plegada color grafito oscuro (100% opaco/ciego hacia el interior) se equipa con motor basculante rápido 1/2 HP PPA JetFlex, traba electromagnética y fotocélula, acompañado del Portoncito Peatonal haciendo juego de 0.95m de ancho (x = -2.20m..-1.25m) en la misma chapa grafito ciega y pérgola de madera para enredadera con techo translúcido antigranizo sobre la cochera."
  },
  {
    id: "bano_suite_sanitarios",
    categoria: "Aberturas y Terminaciones",
    item: "10.1 Baño Completo Habitable: Sanitarios, Ducha, Griferías FV y Termocalefón 80L (Omitido 0 Gs en 27.3/28.1)",
    unidad: "gl",
    cantidad: 1,
    formulaDim: "Inodoro + Bidet + Bacha + Mampara + Ducha + Termo 80L",
    precioUnitarioGs: 9800000,
    puJivesaGs: 0,
    puLgrbGs: 9800000,
    puEdificaRefGs: 10500000,
    puIaGs: 9800000,
    fuenteRecomendada: "IA",
    subtotalGs: 9800000,
    esencial: true,
    origenTipo: "IA_AUDITORIA",
    origenLabel: "🤖 Prioridad Habitabilidad (Baño Completo desde 300M)",
    camposEstimadosIA: ["P.U. estimado por IA (Gs. 9.800.000): En JIVESA rubros 27.3 y 28.1 estaban en 0 Gs, y Edifica Studio solo cotizó 'agua corriente solo frío'"],
    desc: "Baño 100% equipado y funcional desde el Crédito de 300M: inodoro con mochila, bidet, lavatorio con mesada, ducha mezcladora FV y termocalefón 80L."
  },
  {
    id: "cocina_mesada_bacha_esencial",
    categoria: "Aberturas y Terminaciones",
    item: "10.2 Mesada Húmeda de Cocina con Bacha Doble, Grifería FV, Nicho Garrafa y Tomas 20A (Esencial Mudanza Ruth & Leo)",
    unidad: "gl",
    cantidad: 1,
    formulaDim: "Mesada 2.40 ml × 0.62m + Bacha doble + Grifería FV + Circuito 20A (Air Fryer 6L / Microondas)",
    precioUnitarioGs: 4850000,
    puJivesaGs: 0,
    puLgrbGs: 4850000,
    puEdificaRefGs: 5400000,
    puIaGs: 4850000,
    fuenteRecomendada: "LGRB",
    subtotalGs: 4850000,
    esencial: true,
    origenTipo: "IA_AUDITORIA",
    origenLabel: "🤖 Prioridad Habitabilidad (Cocina Esencial según Inventario Mudanza)",
    camposEstimadosIA: ["Desglosado por IA (Gs. 4.850.000): Ruth y Leo ya llevan cocina con garrafa, heladera, mueble de microondas y Air Fryer 6L, por lo que esta mesada húmeda con bacha doble y tomas 20A es indispensable desde 300M"],
    desc: "Mesada de granito/hormigón con bacha doble de acero inoxidable, grifería monocomando FV, desagüe sifónico, nicho seguro para cocina con garrafa y circuito dedicado 20A para Air Fryer 6L Xiaomi (1500W), microondas y horno."
  },
  {
    id: "lavadero_habitable",
    categoria: "Aberturas y Terminaciones",
    item: "10.3 Lavadero Operativo Completo: Pileta de Lavar, Grifería y Conexiones Lavarropas (Edifica Studio PB #15)",
    unidad: "gl",
    cantidad: 1,
    formulaDim: "1 Pileta lavadero + Grifería + Carga PPR + Desagüe Ø50mm + Toma Lavarropas propio",
    precioUnitarioGs: 2837500,
    puJivesaGs: 0,
    puLgrbGs: 2950000,
    puEdificaRefGs: 2837500,
    puIaGs: 2837500,
    fuenteRecomendada: "EDIFICA",
    subtotalGs: 2837500,
    esencial: true,
    origenTipo: "EDIFICA_STUDIO",
    origenLabel: "📐 Edifica Studio (Rubro #15 Lavadero — Esencial 300M)",
    camposEstimadosIA: ["Unid. (gl) y Cant. (1) asignadas por IA; Precio Total exacto de Edifica Studio Planta Nivel Calle Rubro #15 Instalación de Lavadero (Gs. 2.837.500) listo para conectar el lavarropas propio"],
    desc: "Lavadero 100% funcional desde el Crédito de 300M según Rubro #15 de Edifica Studio (Gs. 2.837.500): pileta de lavar, grifería, alimentación de agua y desagüe embutido para el lavarropas que ya tienen Ruth y Leo."
  },
  {
    id: "placares_dormitorios_adicional",
    categoria: "Aberturas y Terminaciones",
    item: "10.4 Placares / Guardarropas Empotrados en Dormitorios (Suite Sommier 1.40m + Habitación Cama 1 Plaza)",
    unidad: "un",
    cantidad: 2,
    formulaDim: "1 Placard Suite Ruth & Leo (2.40×2.60m) + 1 Placard Dorm. 2 (1.60×2.60m) = 2 un",
    precioUnitarioGs: 4800000,
    puJivesaGs: 0,
    puLgrbGs: 4950000,
    puEdificaRefGs: 5200000,
    puIaGs: 4800000,
    fuenteRecomendada: "IA",
    subtotalGs: 9600000,
    esencial: true,
    origenTipo: "IA_AUDITORIA",
    origenLabel: "🤖 Incluido por IA según Inventario de Mudanza",
    camposEstimadosIA: ["Presupuestado obligatoriamente por IA (2 un × Gs. 4.800.000 = Gs. 9.600.000): el inventario actual de Ruth y Leo incluye 2 tocadores y 2 mesas de luz pero 0 placares/roperos"],
    desc: "Adicional clave detectado al auditar el inventario de mudanza: provisión y montaje de 2 placares piso-techo en melamina texturada 18mm con cajoneras, barrales de colgado y maletero superior para la Suite de Ruth y Leo (Sommier 1.40m) y el segundo ambiente (Cama 1 plaza)."
  },

  // Plan Hidrófugo y Aislaciones (Crucial para Terreno en Barranco y Río)
  {
    id: "hidro_muro_vertical",
    categoria: "Plan Hidrófugo",
    item: "11.1 Aislación Vertical Muro Contención (Ceresita + Pintura Asfáltica)",
    unidad: "m2",
    cantidad: 46.70,
    formulaDim: "46.70 m² de trasdós de muro en contacto con tierra",
    precioUnitarioGs: 48000,
    puJivesaGs: 52000,
    puLgrbGs: 48000,
    puEdificaRefGs: 36804,
    puIaGs: 48000,
    fuenteRecomendada: "LGRB",
    subtotalGs: 2241600,
    esencial: true,
    origenTipo: "PLANILLA_JIVESA_LGRB",
    origenLabel: "📄 Planilla JIVESA / LG-RB",
    camposEstimadosIA: ["Desglosado por m² (46.70 m²) a partir de Planilla Muro Contención y Edifica Studio Subsuelo #5 (Gs. 1.718.750 ÷ 46.70 m² = Gs. 36.804/m²)"],
    desc: "Revoque hidrófugo con hidrófugo inorgánico 1:3 y doble mano de emulsión asfáltica al solvente en trasdós de muro."
  },
  {
    id: "hidro_drenaje_frances",
    categoria: "Plan Hidrófugo",
    item: "11.2 Drenaje Francés Perimetral (Tubo Ø100 Ranurado + Geotextil Bidim)",
    unidad: "ml",
    cantidad: 18.00,
    formulaDim: "9.74m frente + 8.26m laterales subsuelo = 18.00 ml",
    precioUnitarioGs: 165000,
    puJivesaGs: 0,
    puLgrbGs: 175000,
    puEdificaRefGs: 180000,
    puIaGs: 165000,
    fuenteRecomendada: "IA",
    subtotalGs: 2970000,
    esencial: true,
    origenTipo: "IA_AUDITORIA",
    origenLabel: "🤖 Incluido por IA (Análisis Técnico)",
    camposEstimadosIA: ["Partida, Cant. (18.00 ml) y P.U. (Gs. 165.000) incluidos por IA según recomendación del Estudio Geotécnico GEO-STAN #2956"],
    desc: "Tubo corrugado ranurado Ø100mm envuelto en grava y manta geotextil para aliviar empuje hidrostático hacia el barranco."
  },
  {
    id: "hidro_capa_horizontal",
    categoria: "Plan Hidrófugo",
    item: "11.3 Capa Aisladora Horizontal Doble bajo Mampostería",
    unidad: "ml",
    cantidad: 28.50,
    formulaDim: "28.50 ml de arranque de muros sobre vigas y losa",
    precioUnitarioGs: 55000,
    puJivesaGs: 62000,
    puLgrbGs: 55000,
    puEdificaRefGs: 98684,
    puIaGs: 55000,
    fuenteRecomendada: "LGRB",
    subtotalGs: 1567500,
    esencial: true,
    origenTipo: "EDIFICA_STUDIO",
    origenLabel: "📐 Edifica Studio (Arq. Amarilla & León)",
    camposEstimadosIA: ["Unid. (ml) y Cant. (28.50 ml) desglosadas por IA (En Edifica Studio PB #4 Aislaciones Hidrófugas = Gs. 2.812.500 sin unidad ni metraje)"],
    desc: "Doble cajón hidrófugo continuo con pintura asfáltica en el arranque de paredes sobre Losa 1 y vigas de subsuelo."
  },
  {
    id: "hidro_membrana_terraza",
    categoria: "Plan Hidrófugo",
    item: "11.4 Impermeabilización Losa Galería L1 al Río (Membrana 4mm + Babetas)",
    unidad: "m2",
    cantidad: 42.00,
    formulaDim: "33.42 m² Losa L1 + 8.58 m² babetas y encuentros = 42.00 m²",
    precioUnitarioGs: 110000,
    puJivesaGs: 0,
    puLgrbGs: 115000,
    puEdificaRefGs: 125000,
    puIaGs: 110000,
    fuenteRecomendada: "IA",
    subtotalGs: 4620000,
    esencial: true,
    origenTipo: "IA_AUDITORIA",
    origenLabel: "🤖 Incluido por IA (Análisis Técnico)",
    camposEstimadosIA: ["Partida, Cant. (42.00 m²) y P.U. (Gs. 110.000) incluidos por IA para proteger Losa L1 rebajada (-0.45m) sobre el barranco"],
    desc: "Membrana asfáltica/poliuretánica sobre Losa L1 (-0.45m) con babetas perimetrales y sellador elástico."
  },
  {
    id: "hidro_barrera_vapor",
    categoria: "Plan Hidrófugo",
    item: "11.5 Barrera de Vapor con Polietileno 200 Micrones bajo Contrapisos Subsuelo",
    unidad: "m2",
    cantidad: 85.00,
    formulaDim: "9.74m × 8.73m huella subsuelo = 85.00 m²",
    precioUnitarioGs: 12500,
    puJivesaGs: 0,
    puLgrbGs: 14000,
    puEdificaRefGs: 15000,
    puIaGs: 12500,
    fuenteRecomendada: "IA",
    subtotalGs: 1062500,
    esencial: true,
    origenTipo: "IA_AUDITORIA",
    origenLabel: "🤖 Incluido por IA (Análisis Técnico)",
    camposEstimadosIA: ["Partida, Cant. (85.00 m²) y P.U. (Gs. 12.500) incluidos por IA para contrapiso en contacto con suelo natural en Subsuelo (-2.34m)"],
    desc: "Film continuo con solapes de 20cm termosellados en subsuelo (-2.34m) para impedir ascensión capilar."
  },

  // Señales Débiles, Telecomunicaciones y Domótica (Lámina ISD en 0 Gs en presupuestos tradicionales)
  {
    id: "debil_cableado_cat6",
    categoria: "Señales Débiles y Redes",
    item: "12.1 Cableado Estructurado UTP Cat6 y Puntos de Red / TV 32\" (Omitido 0 Gs en 29.4/29.5)",
    unidad: "bocas",
    cantidad: 8,
    formulaDim: "8 bocas RJ45/Coaxial (TV 32\" Estar, 2 Escritorios Home-Office, Suite y PA)",
    precioUnitarioGs: 185000,
    puJivesaGs: 0,
    puLgrbGs: 195000,
    puEdificaRefGs: 210000,
    puIaGs: 185000,
    fuenteRecomendada: "IA",
    subtotalGs: 1480000,
    esencial: true,
    origenTipo: "IA_AUDITORIA",
    origenLabel: "🤖 Incluido por IA (Análisis Técnico)",
    camposEstimadosIA: ["Cant. (8 bocas) y P.U. (Gs. 185.000) completados por IA a partir del Plano Oficial ISD (figuraba en 0 Gs en JIVESA 29.4/29.5 y omitido en Edifica)"],
    desc: "Ductos independientes de tensión, cable UTP 100% cobre Cat6 y tomas RJ45/TV para el TV de 32\" y los 2 escritorios de trabajo de Ruth y Leo."
  },
  {
    id: "debil_cctv_ip",
    categoria: "Señales Débiles y Redes",
    item: "12.2 Sistema CCTV 6 Cámaras IP PoE 4MP + NVR 2TB",
    unidad: "kit",
    cantidad: 1,
    formulaDim: "6 cámaras IP PoE + NVR 8ch + Disco 2TB Surveillance",
    precioUnitarioGs: 5800000,
    puJivesaGs: 0,
    puLgrbGs: 6200000,
    puEdificaRefGs: 6500000,
    puIaGs: 5800000,
    fuenteRecomendada: "IA",
    subtotalGs: 5800000,
    esencial: false,
    origenTipo: "IA_AUDITORIA",
    origenLabel: "🤖 Incluido por IA (Análisis Técnico)",
    camposEstimadosIA: ["Partida y P.U. (Gs. 5.800.000) incluidos por IA según puntos de cámara del Plano ISD"],
    desc: "Cámaras con infrarrojo nocturno cubriendo cul-de-sac Guillermo Arias, cochera, medianera Eje 9 y barranco al río."
  },
  {
    id: "debil_portero_visor",
    categoria: "Señales Débiles y Redes",
    item: "12.3 Portero Visor IP Gran Angular y Apertura Remota Smartphone",
    unidad: "kit",
    cantidad: 1,
    formulaDim: "1 Frente calle IP sobre Eje G + Monitor 7\" + Cerradura",
    precioUnitarioGs: 2450000,
    puJivesaGs: 0,
    puLgrbGs: 2650000,
    puEdificaRefGs: 2800000,
    puIaGs: 2450000,
    fuenteRecomendada: "IA",
    subtotalGs: 2450000,
    esencial: true,
    origenTipo: "IA_AUDITORIA",
    origenLabel: "🤖 Incluido por IA (Análisis Técnico)",
    camposEstimadosIA: ["Partida y P.U. (Gs. 2.450.000) completados por IA según símbolo de portero en Plano ISD"],
    desc: "Frente de calle antivandálico con cámara HD, audio bidireccional y módulo de relé para portón peatonal y vehicular."
  },
  {
    id: "debil_wifi_mesh",
    categoria: "Señales Débiles y Redes",
    item: "12.4 Red Wi-Fi Mesh de Cobertura Total (Subsuelo, PB, PA y Galería)",
    unidad: "kit",
    cantidad: 1,
    formulaDim: "3 Nodos Mesh Wi-Fi 6 Gigabit con backhaul cableado Cat6",
    precioUnitarioGs: 1850000,
    puJivesaGs: 0,
    puLgrbGs: 1980000,
    puEdificaRefGs: 2150000,
    puIaGs: 1850000,
    fuenteRecomendada: "IA",
    subtotalGs: 1850000,
    esencial: false,
    origenTipo: "IA_AUDITORIA",
    origenLabel: "🤖 Incluido por IA (Análisis Técnico)",
    camposEstimadosIA: ["Partida y P.U. (Gs. 1.850.000) incluidos por IA para vencer la atenuación de las losas macizas de H°A°"],
    desc: "3 nodos Gigabit Wi-Fi 6 para atravesar las losas macizas de H°A° y conectar los equipos inteligentes Xiaomi (Purificador, Vaporizador, Air Fryer) y Home-Office."
  },
  {
    id: "debil_alarma_barreras",
    categoria: "Señales Débiles y Redes",
    item: "12.5 Instalación Completa de Sistema de Alarma de Intrusión (Central App + 5 PIR Pet-Immune 25kg + 6 Sensores Puertas + Barrera IR + Sirenas)",
    unidad: "kit",
    cantidad: 1,
    formulaDim: "Central Híbrida/App (Gs. 1,65M) + 5 PIR Pet-Immune (Gs. 1,15M) + 6 Magnéticos (Gs. 720k) + Barrera IR/Sirenas (Gs. 980k) + Instalación Asunción (Gs. 950k)",
    precioUnitarioGs: 5450000,
    puJivesaGs: 0,
    puLgrbGs: 5600000,
    puEdificaRefGs: 5850000,
    puIaGs: 5450000,
    fuenteRecomendada: "IA",
    subtotalGs: 5450000,
    esencial: true,
    origenTipo: "IA_AUDITORIA",
    origenLabel: "🤖 Incluido por IA según Análisis (Costos de Mercado Asunción)",
    camposEstimadosIA: ["Presupuesto llave en mano en Asunción (Gs. 5.450.000 = Materiales Gs. 4.500.000 + Instalación y Programación Gs. 950.000): incluye sensores PIR Pet-Immune aptos para Emma (Caniche) y Serafina (Gata Calicó), 6 magnéticos en puertas/ventanales y barrera IR en el costado de 3m × 2m"],
    desc: "Sistema integral de alarma instalado según precios de mercado en Asunción: Central Hikvision AX PRO / Paradox / DSC con App móvil + batería 12V 7Ah (Gs. 1.650.000), 5 detectores de movimiento PIR doble tecnología Pet-Immune hasta 25kg por Emma y Serafina (Gs. 1.150.000), 6 sensores magnéticos en puertas y Blindex (Gs. 720.000), 1 barrera infrarroja doble haz para el costado vulnerable + 2 sirenas (Gs. 980.000) y Mano de Obra de instalación y configuración en Asunción (Gs. 950.000)."
  },
  {
    id: "debil_domotica_luces",
    categoria: "Señales Débiles y Redes",
    item: "12.6 Domótica de Iluminación Exterior y Escenas Atardecer",
    unidad: "un",
    cantidad: 6,
    formulaDim: "6 módulos inteligentes Wi-Fi/Zigbee en tablero y cajas",
    precioUnitarioGs: 320000,
    puJivesaGs: 0,
    puLgrbGs: 350000,
    puEdificaRefGs: 380000,
    puIaGs: 320000,
    fuenteRecomendada: "IA",
    subtotalGs: 1920000,
    esencial: false,
    origenTipo: "IA_AUDITORIA",
    origenLabel: "🤖 Incluido por IA (Análisis Técnico)",
    camposEstimadosIA: ["Partida, Cant. (6 circuitos) y P.U. (Gs. 320.000) incluidos por IA"],
    desc: "Microcontroladores inteligentes para encendido automático al atardecer en galería, escalera y fachada."
  },

  // Partidas Correctivas de la Auditoría Forense (Omisiones Críticas Detectadas por IA)
  {
    id: "forense_aislacion_medianera_eje9",
    categoria: "Auditoría Forense (Omisiones)",
    item: "13.1 Blindaje Hidrófugo y Submural en Medianera Izquierda Expuesta (Eje 9)",
    unidad: "gl",
    cantidad: 1,
    formulaDim: "15.85m largo Eje 9 × 2.60m desnivel expuesto = 41.21 m²",
    precioUnitarioGs: 6850000,
    puJivesaGs: 0,
    puLgrbGs: 7200000,
    puEdificaRefGs: 7500000,
    puIaGs: 6850000,
    fuenteRecomendada: "IA",
    subtotalGs: 6850000,
    esencial: true,
    origenTipo: "IA_AUDITORIA",
    origenLabel: "🤖 Incluido por IA (Análisis Técnico)",
    camposEstimadosIA: ["Partida completa y costo (Gs. 6.850.000) incluidos por IA a partir de los Informes Técnicos N° 2 y N° 3"],
    desc: "Solución a Patología #1 (Informes 2 y 3): sellado cristalizante, revoque hidrófugo y drenaje del muro vecino en Eje 9 expuesto al excavar el subsuelo."
  },
  {
    id: "forense_cloaca_subsuelo_bombeo",
    categoria: "Auditoría Forense (Omisiones)",
    item: "13.2 Pozo Ciego Absorbente (Ø 1,80m × 3,50m) + Cámara Séptica en Fondo (Ejes 8–9, libre de Piscina) c/ Acceso p/ Camión Cisterna por Escalera Lateral de Servicio",
    unidad: "gl",
    cantidad: 1,
    formulaDim: "Cámara Desgrasadora + Cámara Séptica 1.500L + Pozo Ciego Absorbente Ø1,80×3,50m en Ejes 8–9 (Sin motor eléctrico • Desagote con bomba de camión cisterna vía Escalera Lateral 1)",
    precioUnitarioGs: 6800000,
    puJivesaGs: 0,
    puLgrbGs: 7200000,
    puEdificaRefGs: 7600000,
    puIaGs: 6800000,
    fuenteRecomendada: "IA",
    subtotalGs: 6800000,
    esencial: true,
    origenTipo: "IA_AUDITORIA",
    origenLabel: "🤖 Cámara Séptica + Pozo Ciego en Fondo s/ Leo (🔴 Rojo Banco • Gs. 6.800.000 — Sin Motor Eléctrico)",
    camposEstimadosIA: ["Ajustado según criterio técnico de Leo (Gs. 6.800.000 = Materiales Gs. 3.900.000 + Mano de Obra Gs. 2.900.000, ahorrando Gs. 2.600.000 al descartar el motor de bombeo eléctrico): Cámara Séptica + Pozo Ciego Absorbente Ø 1,80m × 3,50m en corredor izquierdo del fondo (Ejes 8–9, sin chocar con Piscina). Para desagotar, el camión cisterna trae su propia bomba de vacío y baja su manguera por la Puerta de Servicio (Eje G) y la Escalera Lateral 1 hasta el pozo"],
    desc: "Solución Cloacal por Gravedad 100% Autónoma (Cero motor de bombeo eléctrico): En el jardín trasero sobre el corredor lateral izquierdo (Ejes 8–9, alejado >1,80m de la futura Piscina de 4,65m × 2,45m) se construyen la Cámara Desgrasadora, la Cámara Séptica Impermeable de 1.500L y el Pozo Ciego Absorbente Ø 1,80m × 3,50m calzado con ladrillos de Tobatí (Gs. 6.800.000). No se gasta en motor de bombeo propio porque cuando se requiera desagotar, los camiones cisterna traen su propia bomba industrial y bajan la manguera directamente desde la calle por la Puerta de Servicio (Eje G) y la Escalera Lateral 1 hasta el pozo."
  },
  {
    id: "forense_puente_adherencia_epoxico",
    categoria: "Auditoría Forense (Omisiones)",
    item: "13.3 Protocolo de Rehabilitación de Losa 1 Expuesta al Sol/Intemperie (100,71 m²) + Desoxidado y Puente Epóxico Sikadur-32 en 17 Pilares",
    unidad: "gl",
    cantidad: 1,
    formulaDim: "Hidrolavado 2500 PSI (Gs. 850k) + Sellado Sikaflex/SikaTop-107 (Gs. 2,65M) + Desoxidado/Sikadur-32 en 17 pilares (Gs. 2,40M) + Puente SikaLatex carpeta (Gs. 1,15M)",
    precioUnitarioGs: 7050000,
    puJivesaGs: 0,
    puLgrbGs: 7350000,
    puEdificaRefGs: 7600000,
    puIaGs: 7050000,
    fuenteRecomendada: "IA",
    subtotalGs: 7050000,
    esencial: true,
    origenTipo: "IA_AUDITORIA",
    origenLabel: "🤖 Cuidado Previo Losa 1 Expuesta al Sol e Intemperie (🟡 Amarillo Banco)",
    camposEstimadosIA: ["Incluido según advertencia de Leo (Gs. 7.050.000 = Materiales Gs. 4.050.000 + Mano de Obra Gs. 3.000.000): la Losa 1 estuvo ~10 meses expuesta al sol extremo de Asunción y lluvias; incluye hidrolavado 2.500 PSI, sellado de microfisuras térmicas Sikaflex-1A/SikaTop-107, desoxidado Sika Rustoff + Sikadur-32 en 17 pilares y puente SikaLatex"],
    desc: "Cuidado indispensable antes de avanzar sobre la Losa 1 expuesta al sol y la intemperie: 1) Hidrolavado industrial 2.500 PSI y decapado de verdín/lechada quemada (Gs. 850.000); 2) Sellado elastomérico de microfisuras térmicas Sikaflex-1A Plus + SikaTop-107 Seal (Gs. 2.650.000); 3) Desoxidado fosfatizante Sika Rustoff + puente epóxico Sikadur-32 Gel en los 17 arranques de pilares (Gs. 2.400.000); 4) Puente adherente SikaLatex para que la carpeta de porcelanato no se despegue sobre la losa reseca (Gs. 1.150.000)."
  },
  {
    id: "forense_omision_fila9_lozarrap",
    categoria: "Auditoría Forense (Omisiones)",
    item: "13.4 Cerramiento del Vacío Estructural de 38,00 m² en Losa 1 con Loza Rap (Eje 1–5 × Eje B–G, Fila 9 sin precio en Excel LG-RB)",
    unidad: "m2",
    cantidad: 38.00,
    formulaDim: "5.61m (Eje 1-5: x=-0.74..+4.87m) × 6.94m (Eje B-G: z=3.00..9.94m) = 38.00 m² netos",
    precioUnitarioGs: 380000,
    puJivesaGs: 410000,
    puLgrbGs: 0,
    puEdificaRefGs: 420000,
    puIaGs: 380000,
    fuenteRecomendada: "IA",
    subtotalGs: 14440000,
    esencial: true,
    origenTipo: "IA_AUDITORIA",
    origenLabel: "🤖 Esencial Etapa 1 — Cierra el Vacío Estructural de 38,00 m² en Losa 1",
    camposEstimadosIA: ["Precio Unitario (Gs. 380.000/m²) y Subtotal (Gs. 14.440.000) completados por IA (la Fila 9 del Excel LG-RB traía 38.00 m² pero precio en blanco). Hoy en obra ese paño de 38.00 m² sobre el Estar Social y Escalera 2 está abierto entre vigas"],
    desc: "Solución a Omisión #4 (Esencial Etapa 1): En la Losa 1 (+0.00m) actualmente solo están hormigonadas la Losa L1 (Galería) y la Losa L4 (Cocina/Comedor), quedando un vacío abierto entre vigas de 38.00 m² (x = -0.74m..+4.87m, z = 3.00m..9.94m). Esta partida ejecuta su cerramiento con viguetas pretensadas Loza Rap, bovedillas y capa de compresión HA-25 para conformar el piso del Estar Social."
  },
  {
    id: "forense_tabiqueria_liviana_apeo",
    categoria: "Auditoría Forense (Omisiones)",
    item: "13.5 Tabiquería Liviana en Planta Alta sobre Ejes de Pilares P12, P13 y P15 (Mueren en 0.00m)",
    unidad: "m2",
    cantidad: 28.00,
    formulaDim: "9.72 ml tabique Durlock W112 × 2.88m h = 28.00 m²",
    precioUnitarioGs: 150000,
    puJivesaGs: 0,
    puLgrbGs: 165000,
    puEdificaRefGs: 175000,
    puIaGs: 150000,
    fuenteRecomendada: "IA",
    subtotalGs: 4200000,
    esencial: false,
    origenTipo: "IA_AUDITORIA",
    origenLabel: "🤖 Incluido por IA (Análisis Técnico)",
    camposEstimadosIA: ["Partida, Cant. (28.00 m²) y P.U. (Gs. 150.000) incluidos por IA tras verificar en Planos E4 y E9 que P12, P13 y P15 mueren en 0.00m mientras los otros 17 pilares ya están hormigonados hasta +2.88m"],
    desc: "Solución a Restricción #5: P12, P13 y P15 terminan en cota +0.00m (los 17 pilares restantes ya están hormigonados hasta +2.88m); las divisiones de Planta Alta fuera de los pórticos principales se ejecutan en tabiquería liviana."
  },
  {
    id: "forense_barandas_seguridad",
    categoria: "Auditoría Forense (Omisiones)",
    item: "13.6 Barandas en Galería Eje A, Escaleras 1 y 2 + Piso de Rejilla Metálica Electroforjada Transitable y Rejas Laterales sobre Foso de Ventilación (z=1.50..3.00m)",
    unidad: "ml",
    cantidad: 16.00,
    formulaDim: "9.74m Eje A + Escaleras 1 y 2 + Rejilla Electroforjada Transitable y Rejas Laterales en Foso z=1.50..3.00m",
    precioUnitarioGs: 700000,
    puJivesaGs: 0,
    puLgrbGs: 740000,
    puEdificaRefGs: 780000,
    puIaGs: 700000,
    fuenteRecomendada: "IA",
    subtotalGs: 11200000,
    esencial: true,
    origenTipo: "IA_AUDITORIA",
    origenLabel: "🤖 Incluido por IA (Seguridad Galería, Escaleras y Rejilla Electroforjada sobre Foso)",
    camposEstimadosIA: ["Incluye barandas de Galería Eje A, Escalera 1 (Eje 8-9), Escalera 2 (Eje 1-2) y el Piso de Rejilla Metálica Electroforjada Transitable con Rejas Laterales de Seguridad sobre el foso de ventilación del subsuelo (z = 1.50m..3.00m)"],
    desc: "Solución integral de seguridad (Rubro 33.1 en 0 Gs en JIVESA): 1) Baranda de seguridad en Galería L1 (desnivel 3.20m al barranco) y en Escalera 1 (Eje 8–9) y Escalera 2 (Eje 1–2); 2) Piso de Rejilla Metálica Electroforjada Transitable a nivel +0.00m con Rejas Laterales de Seguridad cubriendo el foso de oxigenación/ventilación del subsuelo entre el Muro de Contención (z = +1.50m) y el Eje G (z = +3.00m)."
  },

  // Rubros Específicos de EDIFICA STUDIO E.A.S. y Ajustes Reales de Frente (Vereda + Basurero + Sobreelevación Lateral 3m×2m)
  {
    id: "edifica_vereda_frontal",
    categoria: "Exteriores y Equipamiento (Edifica Studio)",
    item: "14.1 Construcción de Vereda Reglamentaria (9,89m × 2,00m = 19,80 m²) + Canasto Basurero Metálico Elevado en Frente",
    unidad: "gl",
    cantidad: 1,
    formulaDim: "Vereda 9,89m × 2,00m = 19,80 m² c/ contrapiso y rampa (Gs. 3.450.000) + Canasto Basurero Metálico Elevado (Gs. 550.000)",
    precioUnitarioGs: 4000000,
    puJivesaGs: 4500000,
    puLgrbGs: 4200000,
    puEdificaRefGs: 6750000,
    puIaGs: 4000000,
    fuenteRecomendada: "IA",
    subtotalGs: 4000000,
    esencial: true,
    origenTipo: "IA_AUDITORIA",
    origenLabel: "🤖 Ajuste Real de Obra s/ Leo (Hoy no hay Vereda ni Basurero • Gs. 4.000.000)",
    camposEstimadosIA: ["Ajustado según indicación de Leo ('Vereda no hay, ni basurero'): Vereda reglamentaria 9,89m × 2,00m = 19,80 m² con contrapiso H°, solado antideslizante, cordón y rampa vehicular (Gs. 3.450.000) + Canasto basurero metálico elevado anticorrosivo amurado en dado de H° (Gs. 550.000) = Gs. 4.000.000 (Materiales Gs. 2.300.000 + Mano de Obra Gs. 1.700.000)"],
    desc: "Construcción de vereda municipal sobre el frente de 9.89m en Calle Guillermo Arias (19,80 m² con contrapiso, baldosa calcárea/alisado antideslizante y rampa de cochera: Gs. 3.450.000) más canasto basurero metálico elevado en vereda (Gs. 550.000)."
  },
  {
    id: "edifica_caminero_vehicular",
    categoria: "Exteriores y Equipamiento (Edifica Studio)",
    item: "14.2 Caminero Vehicular en Acceso de Cochera (Edifica Studio Ext. #6)",
    unidad: "m2",
    cantidad: 21.00,
    formulaDim: "2 huellas H°A° × 7.00m largo × 1.50m = 21.00 m²",
    precioUnitarioGs: 200714,
    puJivesaGs: 220000,
    puLgrbGs: 210000,
    puEdificaRefGs: 200714,
    puIaGs: 200714,
    fuenteRecomendada: "EDIFICA",
    subtotalGs: 4215000,
    esencial: false,
    origenTipo: "EDIFICA_STUDIO",
    origenLabel: "📐 Edifica Studio (Arq. Amarilla & León)",
    camposEstimadosIA: ["Unid. (m²), Cant. (21.00 m²) y P.U. (Gs. 200.714) desglosados por IA; Precio Total exacto de Edifica Studio Opción A (Gs. 4.215.000)"],
    desc: "Huellas y solado reforzado para rodamiento de vehículos en rampa/cochera frontal (Incluido en Edifica Studio Opción A por Gs. 4.215.000; omitido en Opción B)."
  },
  {
    id: "edifica_caminero_peatonal",
    categoria: "Exteriores y Equipamiento (Edifica Studio)",
    item: "14.3 Caminero Peatonal de Acceso (Edifica Studio Ext. #5)",
    unidad: "m2",
    cantidad: 7.50,
    formulaDim: "6.25m largo × 1.20m ancho hacia Eje G = 7.50 m²",
    precioUnitarioGs: 175000,
    puJivesaGs: 190000,
    puLgrbGs: 182000,
    puEdificaRefGs: 175000,
    puIaGs: 175000,
    fuenteRecomendada: "EDIFICA",
    subtotalGs: 1312500,
    esencial: false,
    origenTipo: "EDIFICA_STUDIO",
    origenLabel: "📐 Edifica Studio (Arq. Amarilla & León)",
    camposEstimadosIA: ["Unid. (m²), Cant. (7.50 m²) y P.U. (Gs. 175.000) desglosados por IA; Precio Total exacto de Edifica Studio Opción A y B (Gs. 1.312.500)"],
    desc: "Sendero peatonal de ingreso desde línea municipal hasta puerta principal en Eje G (Gs. 1.312.500 en Edifica Studio Opción A y B)."
  },
  {
    id: "sobreelevacion_muralla_lateral_3x2",
    categoria: "Albañilería y Cierre",
    item: "14.4 Sobreelevación de Muralla Lateral Antirrobo (Tramo 3,00m × 2,00m = 6,00 m² en costado expuesto hacia calle/vecino)",
    unidad: "m2",
    cantidad: 6.00,
    formulaDim: "3,00m largo × 2,00m alto = 6,00 m² (~350 ladrillos Tobatí + pilarete + viga cadena + revoque)",
    precioUnitarioGs: 225000,
    puJivesaGs: 240000,
    puLgrbGs: 225000,
    puEdificaRefGs: 250000,
    puIaGs: 225000,
    fuenteRecomendada: "IA",
    subtotalGs: 1350000,
    esencial: true,
    origenTipo: "IA_AUDITORIA",
    origenLabel: "🤖 Ajuste Real de Obra s/ Leo (Murallas Perimetrales Ya Existen • Solo subir 3m × 2m)",
    camposEstimadosIA: ["Las murallas alrededor del lote YA EXISTEN (⚫ Negro Gs. 0); solo se debe levantar 3,00m × 2,00m (6,00 m²) en el costado donde el nivel del vecino queda abierto hacia la calle (Materiales Gs. 780.000 + Mano de Obra Gs. 570.000 = Gs. 1.350.000)"],
    desc: "El lote ya cuenta con murallas perimetrales construidas (Gs. 0). Únicamente se requiere levantar un tramo de 3,00m × 2,00m (6,00 m²) en el costado hacia el vecino/calle para impedir intrusiones saltando por el desnivel."
  },
  {
    id: "edifica_muralla_frontal",
    categoria: "Exteriores y Equipamiento (Edifica Studio)",
    item: "14.4b Referencia Edifica Studio: Muralla Perimetral Frontal Nueva (NO NECESARIA: lote ya tiene murallas perimetrales)",
    unidad: "ml",
    cantidad: 9.89,
    formulaDim: "9.89 ml de frente (En obra ya existen murallas perimetrales; ver ítem 14.4 de 3m×2m)",
    precioUnitarioGs: 556117,
    puJivesaGs: 590000,
    puLgrbGs: 575000,
    puEdificaRefGs: 556117,
    puIaGs: 556117,
    fuenteRecomendada: "EDIFICA",
    subtotalGs: 5500000,
    esencial: false,
    origenTipo: "EDIFICA_STUDIO",
    origenLabel: "📐 Edifica Studio (Referencia — Ya existe muralla perimetral en obra)",
    camposEstimadosIA: ["Desmarcada por defecto porque el terreno ya tiene murallas alrededor; reemplazada en la práctica por la sobreelevación lateral de 3m × 2m (Gs. 1.350.000)"],
    desc: "Partida original de Edifica Studio Opción A (Gs. 5.500.000). No se requiere ejecutar en los tramos de 300M–440M ya que el lote posee murallas perimetrales y solo necesita elevar 3m × 2m en un lateral (ítem 14.4)."
  },
  {
    id: "edifica_cielorraso_estar",
    categoria: "Exteriores y Equipamiento (Edifica Studio)",
    item: "14.5 Cielorraso en Área de Estar-Comedor (Edifica Studio PB #12)",
    unidad: "m2",
    cantidad: 38.00,
    formulaDim: "6.50m × 5.85m área social integrada = 38.00 m²",
    precioUnitarioGs: 156250,
    puJivesaGs: 175000,
    puLgrbGs: 162000,
    puEdificaRefGs: 156250,
    puIaGs: 156250,
    fuenteRecomendada: "EDIFICA",
    subtotalGs: 5937500,
    esencial: false,
    origenTipo: "EDIFICA_STUDIO",
    origenLabel: "📐 Edifica Studio (Arq. Amarilla & León)",
    camposEstimadosIA: ["Unid. (m²), Cant. (38.00 m²) y P.U. (Gs. 156.250) desglosados por IA; Precio Total exacto de Edifica Studio Opción A (Gs. 5.937.500)"],
    desc: "Cielorraso de junta tomada / enduido con garganta LED en área social (Opcional dado que la Losa 1 fue entregada en hormigón visto de 315 kg/cm²; omitido en Opción B)."
  },
  {
    id: "edifica_aberturas_madera",
    categoria: "Exteriores y Equipamiento (Edifica Studio)",
    item: "14.6 Puertas Interiores de Madera (Baño, Suite, Dormitorios y Lavadero — Edifica PB #15)",
    unidad: "un",
    cantidad: 6,
    formulaDim: "6 puertas placa de cedro/enchapadas 0.80×2.10m c/ marco 15cm",
    precioUnitarioGs: 2500000,
    puJivesaGs: 2750000,
    puLgrbGs: 2450000,
    puEdificaRefGs: 2500000,
    puIaGs: 2500000,
    fuenteRecomendada: "EDIFICA",
    subtotalGs: 15000000,
    esencial: true,
    origenTipo: "EDIFICA_STUDIO",
    origenLabel: "📐 Edifica Studio (Esencial Privacidad y Habitabilidad)",
    camposEstimadosIA: ["Unid. (un), Cant. (6 puertas interiores) y P.U. (Gs. 2.500.000) desglosados por IA; Suma exacta de Edifica Studio Opción A (PB Gs. 12.312.500 + Sub Gs. 2.687.500 = Gs. 15.000.000)"],
    desc: "Puertas placa de madera para privacidad de Baño, Suite, Dormitorios y Lavadero, con marcos de 15cm, herrajes y cerraduras."
  },
  {
    id: "edifica_pintura_integral",
    categoria: "Exteriores y Equipamiento (Edifica Studio)",
    item: "14.7 Pintura Integral Látex/Acrílica en Planta Baja y Fachada (Edifica Studio PB #11)",
    unidad: "m2",
    cantidad: 320.00,
    formulaDim: "290.00 m² muros dos caras + 30.00 m² detalles = 320.00 m²",
    precioUnitarioGs: 60250,
    puJivesaGs: 68000,
    puLgrbGs: 62000,
    puEdificaRefGs: 60250,
    puIaGs: 60250,
    fuenteRecomendada: "EDIFICA",
    subtotalGs: 19280000,
    esencial: false,
    origenTipo: "EDIFICA_STUDIO",
    origenLabel: "📐 Edifica Studio (Arq. Amarilla & León)",
    camposEstimadosIA: ["Unid. (m²), Cant. (320.00 m²) y P.U. (Gs. 60.250) desglosados por IA; Precio Total exacto de Edifica Studio PB #11 (Gs. 19.280.000)"],
    desc: "Sellador fijador y pintura látex/elastomérica en muros de Planta Baja (En Edifica Studio además se cotiza Subsuelo #11 por Gs. 17.081.250 en Opción A / Gs. 9.418.750 en Opción B)."
  },
  {
    id: "edifica_equipamiento_cocina",
    categoria: "Exteriores y Equipamiento (Edifica Studio)",
    item: "14.8 Amoblamiento Adicional de Cocina: Bajo-Mesada, Alacenas Superiores e Isla (Edifica Equip. #1)",
    unidad: "gl",
    cantidad: 1,
    formulaDim: "Alacenas + Bajo mesada melamina 18mm + Isla (Complementa mueble de microondas propio)",
    precioUnitarioGs: 17543750,
    puJivesaGs: 19800000,
    puLgrbGs: 16900000,
    puEdificaRefGs: 17543750,
    puIaGs: 17543750,
    fuenteRecomendada: "EDIFICA",
    subtotalGs: 17543750,
    esencial: false,
    origenTipo: "EDIFICA_STUDIO",
    origenLabel: "📐 Edifica Studio (Adicional Clave s/ Inventario Mudanza — Desde 350M)",
    camposEstimadosIA: ["Unid. (gl) y Cant. (1) asignadas por IA; Precio Total exacto de Edifica Studio Opción A (Gs. 17.543.750): completa el guardado de cocina más allá del mueble auxiliar de microondas/horno que ya tienen Ruth y Leo"],
    desc: "Amoblamiento adicional clave de cocina (bajo-mesada, alacenas superiores con pistones a gas e isla desayunadora) para completar la cocina junto al mueble auxiliar de microondas/horno que Ruth y Leo llevan en su mudanza."
  },

  // Planificación Integral: Accesos Principal/Servicio, Blindex Habitaciones, Rejas Balcones, Jardín, Quincho y Piscina
  {
    id: "puertas_acceso_principal_servicio",
    categoria: "Aberturas y Terminaciones",
    item: "15.1 Puerta Principal Pivotante + Puerta de Servicio Independiente sobre Eje G (Pasando sobre Piso de Rejilla Electroforjada)",
    unidad: "un",
    cantidad: 2,
    formulaDim: "1 Pivotante 1.20×2.20m (Eje G Estar Social) + 1 Servicio 0.90×2.10m (Eje G hacia Cocina/Escalera 1)",
    precioUnitarioGs: 4750000,
    puJivesaGs: 5100000,
    puLgrbGs: 4750000,
    puEdificaRefGs: 4900000,
    puIaGs: 4750000,
    fuenteRecomendada: "LGRB",
    subtotalGs: 9500000,
    esencial: false,
    origenTipo: "EDIFICA_STUDIO",
    origenLabel: "📐 Edifica Studio / Planos Arq. (Clave Etapas Futuras)",
    camposEstimadosIA: ["Ubicación estratégica sobre Eje G (z=3.00m): acceso desde la cochera cruzando el Piso de Rejilla Metálica Electroforjada Transitable (z=1.50m..3.00m) hacia el Estar Social (Escalera 2 en Eje 1-2 sube a PA) y hacia Cocina/Escalera 1 (Eje 8-9 baja a Subsuelo)"],
    desc: "Puerta principal pivotante + Puerta de Servicio independiente sobre Eje G (z = 3.00m), con ingreso seguro sobre el Piso de Rejilla Metálica Electroforjada Transitable del foso de ventilación."
  },
  {
    id: "blindex_habitaciones",
    categoria: "Aberturas y Terminaciones",
    item: "15.2 Aberturas de Vidrio Templado (Blindex) hacia el Río en Planta Alta (Dormitorio en Suite, Dormitorio 2 y Escritorio en Eje B — Frente Eje G sin Blindex)",
    unidad: "m2",
    cantidad: 18.50,
    formulaDim: "Dormitorio Suite PA + Dormitorio 2 PA + Escritorio PA sobre Eje B al Río + Subsuelo = 18.50 m² (Frente PA Eje G es muro ciego con banderolas)",
    precioUnitarioGs: 690000,
    puJivesaGs: 740000,
    puLgrbGs: 690000,
    puEdificaRefGs: 692396,
    puIaGs: 690000,
    fuenteRecomendada: "LGRB",
    subtotalGs: 12765000,
    esencial: false,
    origenTipo: "EDIFICA_STUDIO",
    origenLabel: "📐 Edifica Studio / Planilla LG-RB",
    camposEstimadosIA: ["Metraje desglosado por IA (18.50 m²) para puertas-ventana corredizas Blindex 10mm hacia el Río Paraguay (Eje B: salida a Deck 2 desde Suite, Dormitorio 2 y Escritorio). En el frente de PA (Eje G, z=3.00m) NO hay Blindex ni balcón, sino muro de mampostería con ventilaciones altas de baños y vestidor"],
    desc: "Puertas-ventana corredizas de vidrio templado 10mm sobre el Eje B (z = 9.94m) que conectan el Dormitorio en Suite, el Dormitorio 2 y el Escritorio con el Deck 2 / Terraza al Río. En la fachada frontal de Planta Alta (Eje G, z = 3.00m) NO lleva Blindex sino pared de mampostería con banderolas altas para Vestidor, Baño en Suite y Baño 2."
  },
  {
    id: "rejas_balcones_seguridad",
    categoria: "Aberturas y Terminaciones",
    item: "15.3 Barandas Metálicas de Seguridad en Deck 2 / Terraza al Río (PA Eje A-B) y Rejas Laterales de Seguridad en Foso Frontal (z=1.50..3.00m)",
    unidad: "ml",
    cantidad: 19.50,
    formulaDim: "9.74m Deck 2 contrafrente al Río PA + 9.76m Rejas Laterales de Seguridad en Foso Frontal y vanos = 19.50 ml (Sin balcón frontal en PA)",
    precioUnitarioGs: 620000,
    puJivesaGs: 0,
    puLgrbGs: 640000,
    puEdificaRefGs: 620000,
    puIaGs: 620000,
    fuenteRecomendada: "EDIFICA",
    subtotalGs: 12090000,
    esencial: false,
    origenTipo: "EDIFICA_STUDIO",
    origenLabel: "📐 Edifica Studio Herrería #14 / Rubro 33.1",
    camposEstimadosIA: ["Desglosado en ml (19.50 ml × Gs. 620.000): incluye baranda del Deck 2 al Río en PA (en el frente de PA NO hay balcón) y las Rejas Laterales de Seguridad del foso de ventilación frontal (z=1.50m..3.00m)"],
    desc: "Barandas de protección en el Deck 2 / Terraza al Río de Planta Alta (+2.88m, Eje A–B) y Rejas Laterales de Seguridad en los bordes del Piso de Rejilla Metálica Electroforjada Transitable sobre el foso de ventilación frontal (z = 1.50m..3.00m). En el frente de Planta Alta (Eje G) no existe balcón en voladizo."
  },
  {
    id: "jardin_cesped_patio",
    categoria: "Exteriores y Equipamiento (Edifica Studio)",
    item: "15.4 Jardín Parquizado con Césped Esmeralda y Nivelación de Patio Inferior (+96.20m)",
    unidad: "m2",
    cantidad: 115.00,
    formulaDim: "9.89m ancho × 11.63m patio norte libre = 115.00 m²",
    precioUnitarioGs: 58000,
    puJivesaGs: 0,
    puLgrbGs: 62000,
    puEdificaRefGs: 65000,
    puIaGs: 58000,
    fuenteRecomendada: "IA",
    subtotalGs: 6670000,
    esencial: false,
    origenTipo: "IA_AUDITORIA",
    origenLabel: "🤖 Incluido por IA según Planificación",
    camposEstimadosIA: ["Superficie de patio libre (115.00 m²) y P.U. con tierra negra abonada + panes de césped Esmeralda estimados por IA"],
    desc: "Perfilado de talud suave, aporte de 10cm de tierra negra vegetal, colocación de panes de césped Esmeralda y drenaje superficial hacia el jardín norte."
  },
  {
    id: "quincho_patio_subsuelo",
    categoria: "Galería y Exterior",
    item: "15.5 Quincho Integrado en Nivel Patio/Subsuelo con Mesada, Bacha y Pérgola (Variante Subsuelo)",
    unidad: "m2",
    cantidad: 24.00,
    formulaDim: "6.00m × 4.00m expansión social hacia jardín y piscina = 24.00 m²",
    precioUnitarioGs: 680000,
    puJivesaGs: 720000,
    puLgrbGs: 680000,
    puEdificaRefGs: 710000,
    puIaGs: 680000,
    fuenteRecomendada: "LGRB",
    subtotalGs: 16320000,
    esencial: false,
    origenTipo: "PLANILLA_JIVESA_LGRB",
    origenLabel: "📄 Variante Subsuelo / 🤖 Desglose IA",
    camposEstimadosIA: ["Metraje (24.00 m²) y P.U. desglosados según Plano 'Variante Subsuelo' (Estar/Quincho vinculado directo al patio y piscina)"],
    desc: "Sector de quincho y expansión social en nivel inferior (-2.34m / patio +96.20m) con solado antideslizante, mesada de apoyo con bacha e iluminación cálida."
  },
  {
    id: "piscina_patio_oficial",
    categoria: "Galería y Exterior",
    item: "15.6 Piscina de H°A° en el Fondo con Orientación Transversal (5.80m × 2.40m, z=23.15..25.55m — Lámina 2 PDF Instalaciones — Etapa Opcional)",
    unidad: "m2",
    cantidad: 11.40,
    formulaDim: "Orientación transversal en el fondo del patio (z = 23.15m..25.55m, x = -1.25m..+4.55m, Prof. 1.40m / ~16.000 L) = 11.40 m²",
    precioUnitarioGs: 2850000,
    puJivesaGs: 0,
    puLgrbGs: 2950000,
    puEdificaRefGs: 3100000,
    puIaGs: 2850000,
    fuenteRecomendada: "IA",
    subtotalGs: 32490000,
    esencial: false,
    origenTipo: "IA_AUDITORIA",
    origenLabel: "📄 Plano Oficial Instalaciones Pág. 2 + 🤖 Costeo IA",
    camposEstimadosIA: ["Orientación transversal original en el fondo del terreno (z = 23.15m..25.55m, x = -1.25m..+4.55m) medida en Lámina 2 del PDF IE-IS-IH-ISD-IAA; P.U. de vaso H°A° + venecitas + filtro + bomba estimado por IA (Opcional en planificación)"],
    desc: "Piscina proyectada en el fondo del patio norte con orientación transversal (paralela al muro de fondo, z = 23.15m..25.55m, x = -1.25m..+4.55m) según el diseño original de la Lámina 2 del PDF de Instalaciones: vaso de hormigón armado impermeable, solárium con borde atérmico, casilla de filtro y reflectores LED subacuáticos."
  },
  {
    id: "cielorraso_acustico_2dopiso",
    categoria: "Cubierta y Techo",
    item: "15.7 Cielorraso Acústico Durlock con Lana de Vidrio 50mm en 2do Piso (Dormitorio y Estudio Ruth & Leo)",
    unidad: "m2",
    cantidad: 54.00,
    formulaDim: "9.74m × 5.55m Dormitorio Suite + Estudio PA = 54.00 m²",
    precioUnitarioGs: 155000,
    puJivesaGs: 0,
    puLgrbGs: 165000,
    puEdificaRefGs: 165208,
    puIaGs: 155000,
    fuenteRecomendada: "IA",
    subtotalGs: 8370000,
    esencial: false,
    origenTipo: "IA_AUDITORIA",
    origenLabel: "🤖 Incluido por IA (Aislación Acústica Lluvia 2do Piso)",
    camposEstimadosIA: ["54.00 m² × Gs. 155.000/m² = Gs. 8.370.000 calculado por IA: reduce el ruido de impacto de lluvia torrencial bajo techo de chapa de ~59 dB a ~39 dB (-18 dB) en el dormitorio del 2do Piso (innecesario si se opta por Techo de Tejas Cerámicas de Tobatí s/ Tejuelón Visto)"],
    desc: "Cielorraso suspendido de placas de roca de yeso con manta de lana de vidrio aluminizada de 50mm sobre el Dormitorio en Suite y Estudio del 2do Piso (+102.88m) para atenuar el tamborileo de lluvia torrencial sobre cubierta metálica."
  },
  {
    id: "biblioteca_4_estantes_2m",
    categoria: "Aberturas y Terminaciones",
    item: "15.8 Biblioteca Instalada de 4 Estantes de 2,00 Metros c/u (8,00 ml en Madera Lapacho / Melamina 25mm c/ Ménsulas)",
    unidad: "un",
    cantidad: 1,
    formulaDim: "4 estantes × 2.00m largo × 0.30m prof. = 8.00 ml instalados",
    precioUnitarioGs: 3200000,
    puJivesaGs: 0,
    puLgrbGs: 3450000,
    puEdificaRefGs: 3600000,
    puIaGs: 3200000,
    fuenteRecomendada: "IA",
    subtotalGs: 3200000,
    esencial: true,
    origenTipo: "IA_AUDITORIA",
    origenLabel: "🤖 Incluido por IA según Pedido de Leo (4 Estantes de 2m)",
    camposEstimadosIA: ["Presupuestado explícitamente por IA (Gs. 3.200.000 instalada): 4 estantes de 2.00 metros cada uno (8.00 metros lineales totales) con tablas de 25mm, soportes invisibles/ménsulas reforzadas y fijación en muro para los libros y floreros de Espada de San Jorge"],
    desc: "Biblioteca empotrada e instalada con al menos 4 estantes de 2,00 metros de largo cada uno (8,00 metros lineales de estantería reforzada) para la colección de libros de Ruth y Leo y sus floreros con plantas Espada de San Jorge."
  },
  {
    id: "supervision_direccion_tecnica_banco",
    categoria: "Dirección Técnica y Previsiones Bancarias",
    item: "16.1 Honorarios de Supervisión / Dirección Técnica de Obra y Carpeta Bancaria (Visitas Semanales + Certificaciones)",
    unidad: "gl",
    cantidad: 1,
    formulaDim: "Supervisión 16 semanas + Planos Color Banco + Certificados Desembolso (~8%)",
    precioUnitarioGs: 18500000,
    puJivesaGs: 24500000,
    puLgrbGs: 19500000,
    puEdificaRefGs: 22000000,
    puIaGs: 18500000,
    fuenteRecomendada: "IA",
    subtotalGs: 18500000,
    esencial: false,
    origenTipo: "IA_AUDITORIA",
    origenLabel: "🤖 Previsión Dirección Técnica y Carpeta Bancaria",
    camposEstimadosIA: ["Desglosado explícitamente por IA (Gs. 18.500.000 tarifa pactada / ~8%): cubre firma profesional de planos y planilla con código de colores del Banco (Negro/Verde/Rojo/Amarillo), control semanal de calidad y certificaciones de avance de obra"],
    desc: "Previsión explícita de honorarios profesionales por Dirección Técnica independiente, control de dosificación de hormigón y aislaciones hidrófugas, y firma de planillas/planos exigidos por el Banco para cada desembolso."
  },
  {
    id: "limpieza_volquetes_contingencia_obra",
    categoria: "Dirección Técnica y Previsiones Bancarias",
    item: "16.2 Limpieza Periódica de Obra, Retiro de Escombros en Volquetes, Seguro y Contingencias",
    unidad: "gl",
    cantidad: 1,
    formulaDim: "6 volquetes de 5m³ + Limpieza final ácida/fina + Seguro",
    precioUnitarioGs: 4500000,
    puJivesaGs: 5200000,
    puLgrbGs: 4800000,
    puEdificaRefGs: 4950000,
    puIaGs: 4500000,
    fuenteRecomendada: "IA",
    subtotalGs: 4500000,
    esencial: false,
    origenTipo: "IA_AUDITORIA",
    origenLabel: "🤖 Previsión Logística y Limpieza de Obra",
    camposEstimadosIA: ["Incluido por IA (Gs. 4.500.000): alquiler de contenedores/volquetes sobre Calle Guillermo Arias, acarreo vertical por desnivel y limpieza final de obra para mudanza inmediata"],
    desc: "Alquiler de volquetes para retiro de escombros, limpieza periódica durante las 16 semanas de ejecución y limpieza fina de final de obra lista para la mudanza de Ruth, Leo, Emma y Serafina."
  }
];

// ============================================================================
// CATÁLOGO EXHAUSTIVO DE PRODUCTOS COMERCIALES SUGERIDOS EN PARAGUAY (ID 1..28 + STRING IDS + FALLBACK)
// ============================================================================
export const CATALOGO_PRODUCTOS_SUGERIDOS_PARAGUAY = {
  // 1..6: Rubros ya ejecutados en obra (Acta 29/12/2025 — ⚫ NEGRO)
  1: {
    id: 1,
    code: 'E-01',
    partidaId: 'EXIST-E-01',
    suggestedProduct: 'Sondeo Geotécnico SPT GEO-STAN + Cemento Compuesto INC Vallemí / Yguazú Tipo CP II-F 32 (Bolsa 50kg)',
    brand: 'INC Vallemí / Yguazú / GEO-STAN S.R.L.',
    commercialUnit: 'Bolsa 50kg / Gl',
    commercialUnitPrice: 62000,
    supplierRef: 'GEO-STAN S.R.L. / Emporio de la Construcción (Asunción)',
    insumosUnitarios: [
      { product: 'Cemento Compuesto Tipo CP II-F 32', brand: 'INC Vallemí / Yguazú', unit: 'Bolsa 50kg', unitPrice: 62000, qtyPerUnit: 25 },
      { product: 'Piedra Bruta de Cantera Emboscada', brand: 'Cantera Emboscada', unit: 'm³', unitPrice: 135000, qtyPerUnit: 12 },
      { product: 'Ensayo SPT Sondeos S1-S3 y Movimiento de Suelo', brand: 'GEO-STAN S.R.L.', unit: 'gl', unitPrice: 11680000, qtyPerUnit: 1 }
    ]
  },
  2: {
    id: 2,
    code: 'E-02',
    partidaId: 'EXIST-E-02',
    suggestedProduct: 'Hormigón Elaborado H25 PROBETI / Pretec + Varilla Acero Conformado ADN 420 Votorantim / Acepar Ø12mm (Barra 12m)',
    brand: 'PROBETI / Pretec / Votorantim / Acepar',
    commercialUnit: 'm³ / Barra 12m',
    commercialUnitPrice: 890000,
    supplierRef: 'PROBETI S.R.L. / Aceros Asunción / Emporio de la Construcción',
    insumosUnitarios: [
      { product: 'Hormigón Elaborado H25 (fck 250 kg/cm²)', brand: 'PROBETI / Pretec', unit: 'm³', unitPrice: 890000, qtyPerUnit: 24 },
      { product: 'Varilla Acero Conformado ADN 420 Ø12mm barra 12m', brand: 'Votorantim / Acepar', unit: 'barra 12m', unitPrice: 89000, qtyPerUnit: 145 },
      { product: 'Cemento Compuesto CP II-F 32', brand: 'INC Vallemí / Yguazú', unit: 'Bolsa 50kg', unitPrice: 62000, qtyPerUnit: 65 },
      { product: 'Piedra Bruta de Cantera Emboscada', brand: 'Cantera Emboscada', unit: 'm³', unitPrice: 135000, qtyPerUnit: 18 }
    ]
  },
  3: {
    id: 3,
    code: 'E-03',
    partidaId: 'EXIST-E-03',
    suggestedProduct: 'Acero Conformado ADN 420 Votorantim / Acepar Ø12mm + Hormigón Elaborado H25 PROBETI (20 Pilares Subsuelo + 17 Pilares PB)',
    brand: 'Votorantim / Acepar / PROBETI',
    commercialUnit: 'Barra 12m / m³',
    commercialUnitPrice: 89000,
    supplierRef: 'Aceros Asunción / PROBETI S.R.L.',
    insumosUnitarios: [
      { product: 'Varilla de Acero Conformado ADN 420 Ø12mm barra 12m', brand: 'Votorantim / Acepar', unit: 'barra 12m', unitPrice: 89000, qtyPerUnit: 190 },
      { product: 'Hormigón Elaborado H25 Certificado', brand: 'PROBETI / Pretec', unit: 'm³', unitPrice: 890000, qtyPerUnit: 22 },
      { product: 'Cemento Compuesto CP II-F 32', brand: 'INC Vallemí / Yguazú', unit: 'Bolsa 50kg', unitPrice: 62000, qtyPerUnit: 80 }
    ]
  },
  4: {
    id: 4,
    code: 'E-04',
    partidaId: 'EXIST-E-04',
    suggestedProduct: 'Hormigón Elaborado H25 Visto PROBETI (315 kg/cm²) + Fenólico Plastificado 18mm + Acero ADN 420 Votorantim',
    brand: 'PROBETI / Votorantim / INC Vallemí',
    commercialUnit: 'm³ / Placa',
    commercialUnitPrice: 890000,
    supplierRef: 'PROBETI S.R.L. / Construshop Asunción',
    insumosUnitarios: [
      { product: 'Hormigón Elaborado H25 Visto (315 kg/cm²)', brand: 'PROBETI / Pretec', unit: 'm³', unitPrice: 890000, qtyPerUnit: 26 },
      { product: 'Varilla de Acero Conformado ADN 420 Ø12mm/Ø10mm', brand: 'Votorantim / Acepar', unit: 'barra 12m', unitPrice: 89000, qtyPerUnit: 135 },
      { product: 'Cemento Compuesto CP II-F 32', brand: 'INC Vallemí / Yguazú', unit: 'Bolsa 50kg', unitPrice: 62000, qtyPerUnit: 60 }
    ]
  },
  5: {
    id: 5,
    code: 'E-05',
    partidaId: 'EXIST-E-05',
    suggestedProduct: 'Hormigón Armado H25 PROBETI + Varilla ADN 420 Votorantim Ø12mm + Piedra Bruta Cantera Emboscada (Escalera 1 Eje 8–9)',
    brand: 'PROBETI / Votorantim / Cantera Emboscada',
    commercialUnit: 'm³ / Barra 12m',
    commercialUnitPrice: 890000,
    supplierRef: 'PROBETI S.R.L. / Emporio de la Construcción',
    insumosUnitarios: [
      { product: 'Hormigón Elaborado H25', brand: 'PROBETI / Pretec', unit: 'm³', unitPrice: 890000, qtyPerUnit: 5.5 },
      { product: 'Varilla Acero Conformado ADN 420 Ø12mm', brand: 'Votorantim / Acepar', unit: 'barra 12m', unitPrice: 89000, qtyPerUnit: 38 },
      { product: 'Piedra Bruta de Cantera Emboscada', brand: 'Cantera Emboscada', unit: 'm³', unitPrice: 135000, qtyPerUnit: 6 }
    ]
  },
  6: {
    id: 6,
    code: 'E-06',
    partidaId: 'contencion_cochera',
    suggestedProduct: 'Piedra Bruta de Cantera Emboscada + Ladrillo Macizo Tobatí 1ra + Cemento INC Vallemí CP II-F 32 + Varilla ADN 420 Ø12mm',
    brand: 'Cantera Emboscada / INC Vallemí / Votorantim',
    commercialUnit: 'Bolsa 50kg / m³ / Barra 12m',
    commercialUnitPrice: 62000,
    supplierRef: 'Emporio de la Construcción / Olerías Tobatí Directo',
    insumosUnitarios: [
      { product: 'Cemento Compuesto Tipo CP II-F 32 (Bolsa 50kg)', brand: 'INC Vallemí / Yguazú', unit: 'Bolsa 50kg', unitPrice: 62000, qtyPerUnit: 0.85 },
      { product: 'Varilla de Acero Conformado ADN 420 Ø12mm barra 12m', brand: 'Votorantim / Acepar', unit: 'barra 12m', unitPrice: 89000, qtyPerUnit: 0.45 },
      { product: 'Piedra Bruta de Cantera Emboscada', brand: 'Cantera Emboscada', unit: 'm³', unitPrice: 135000, qtyPerUnit: 0.35 },
      { product: 'Ladrillo Común Macizo 1ra Calidad Tobatí', brand: 'Olería Tobatí', unit: 'un', unitPrice: 550, qtyPerUnit: 110 }
    ]
  },
  7: {
    id: 7,
    code: '13.4',
    partidaId: 'forense_omision_fila9_lozarrap',
    suggestedProduct: 'Vigueta Pretensada Loza Rap Serie 12 + Ladrillo Sapo Cerámico 12×25×40 + Malla SIMA Ø4.2mm 15×15cm + Hormigón Compresión 5cm',
    brand: 'Loza Rap / Cerámica Itaipú / Acindar-Votorantim / PROBETI',
    commercialUnit: 'm² instalado (Vigueta ml + Sapo un + Malla paño)',
    commercialUnitPrice: 350000,
    supplierRef: 'Loza Rap Paraguay / Emporio de la Construcción (Asunción)',
    insumosUnitarios: [
      { product: 'Vigueta pretensada Serie 12', brand: 'Loza Rap', unit: 'ml', unitPrice: 42000, qtyPerUnit: 2.0 },
      { product: 'Bovedilla cerámica / Ladrillo Sapo 12×25×40', brand: 'Cerámica Itaipú / Tobatí', unit: 'un', unitPrice: 6800, qtyPerUnit: 8.0 },
      { product: 'Malla electrosoldada SIMA Ø4.2mm 15×15cm', brand: 'Votorantim / Acindar', unit: 'paño', unitPrice: 185000, qtyPerUnit: 0.12 },
      { product: 'Hormigón H25 capa compresión 5cm', brand: 'PROBETI / Pretec', unit: 'm²', unitPrice: 95000, qtyPerUnit: 1.0 },
      { product: 'Mano de obra montaje, apuntalamiento y colado', brand: 'Cuadrilla Especializada', unit: 'm²', unitPrice: 115000, qtyPerUnit: 1.0 }
    ]
  },
  8: {
    id: 8,
    code: '2.1',
    partidaId: 'losa_segunda_parte',
    suggestedProduct: 'Sistema Loza Rap Pretensado c/ Viga Encadenado Perimetral HA-25 + Acero ADN 420 Ø12mm/Ø8mm',
    brand: 'Loza Rap / Votorantim / INC Vallemí',
    commercialUnit: 'm²',
    commercialUnitPrice: 324873,
    supplierRef: 'Loza Rap Paraguay / Aceros Asunción / Emporio de la Construcción',
    insumosUnitarios: [
      { product: 'Vigueta pretensada Loza Rap + Bovedilla cerámica', brand: 'Loza Rap', unit: 'm²', unitPrice: 112000, qtyPerUnit: 1.0 },
      { product: 'Varilla Acero ADN 420 Ø12mm y Ø8mm p/ vigas encadenado', brand: 'Votorantim / Acepar', unit: 'barra 12m', unitPrice: 89000, qtyPerUnit: 0.65 },
      { product: 'Hormigón HA-25 capa compresión y vigas', brand: 'PROBETI / INC Vallemí', unit: 'm²', unitPrice: 98000, qtyPerUnit: 1.0 },
      { product: 'Mano de obra encofrado, apuntalamiento y hormigonado (+102.88m)', brand: 'Cuadrilla Estructura', unit: 'm²', unitPrice: 114873, qtyPerUnit: 1.0 }
    ]
  },
  9: {
    id: 9,
    code: '13.6',
    partidaId: 'forense_barandas_seguridad',
    suggestedProduct: 'Rejilla Electroforjada Galvanizada 30×3mm + Escalera H°A° 14 Peldaños c/ Baranda Tubo 40×40mm',
    brand: 'Aceros Asunción / PROBETI / Herrería Industrial',
    commercialUnit: 'gl / m²',
    commercialUnitPrice: 5900000,
    supplierRef: 'Aceros Asunción / Chacomer Industrial / Emporio',
    insumosUnitarios: [
      { product: 'Rejilla grating electroforjada galvanizada 30×3mm transitable', brand: 'Aceros Asunción', unit: 'm²', unitPrice: 420000, qtyPerUnit: 6.0 },
      { product: 'Hormigón y acero escalera 2 (14 peldaños Eje 1–2) y barandas tubo 40×40mm', brand: 'PROBETI / Votorantim', unit: 'gl', unitPrice: 3400000, qtyPerUnit: 1.0 }
    ]
  },
  10: {
    id: 10,
    code: '3.1',
    partidaId: 'cubierta_metalica',
    suggestedProduct: 'Panel Sándwich Termoacústico Isopanel PIR/EPS 50mm Cal. 26 Prepintado Gris Grafito (Chacomer / Aceros Asunción) + Correas Perfil C Galvanizado 100×50×2mm + Canaleta Oculta Chapa N°24',
    brand: 'Chacomer / Aceros Asunción / Ternium',
    commercialUnit: 'm²',
    commercialUnitPrice: 311607,
    supplierRef: 'Chacomer S.A.E. / Aceros Asunción',
    insumosUnitarios: [
      { product: 'Panel Sándwich Termoacústico Isopanel PIR/EPS 50mm Cal. 26 Gris Grafito', brand: 'Chacomer / Aceros Asunción', unit: 'm²', unitPrice: 185000, qtyPerUnit: 1.0 },
      { product: 'Correas Perfil C Galvanizado 100×50×15×2mm', brand: 'Aceros Asunción', unit: 'barra 6m', unitPrice: 145000, qtyPerUnit: 0.25 },
      { product: 'Canaleta oculta Chapa Galvanizada N°24 y Zinguería babetas', brand: 'Zinguería Asunción', unit: 'ml', unitPrice: 85000, qtyPerUnit: 0.22 },
      { product: 'Montaje en altura (+105.64m) con tornillos autoperforantes y sellador PU', brand: 'Montajes Metálicos PY', unit: 'm²', unitPrice: 78000, qtyPerUnit: 1.0 }
    ]
  },
  11: {
    id: 11,
    code: '4.1',
    partidaId: 'mamposteria_exterior',
    suggestedProduct: 'Ladrillo Común Macizo de Tobatí 1ra Calidad (5,5×12×25cm) + Mortero con Hidrófugo Sika-1 / Ceresita + Envarillado Ø6mm c/ 5 hiladas',
    brand: 'Olería Tobatí 1ra / INC Vallemí / Sika-1 / Ceresita',
    commercialUnit: 'm² (Millar Ladrillo + Bolsa Cemento + Bidón 20L)',
    commercialUnitPrice: 151282,
    supplierRef: 'Materiales Tobatí (@materialesdec_tobati) / Construshop Paraguay',
    insumosUnitarios: [
      { product: 'Ladrillo Común Macizo de Tobatí 1ra Calidad (5,5×12×25cm)', brand: 'Olerías Tobatí Directo', unit: 'un', unitPrice: 1150, qtyPerUnit: 55 },
      { product: 'Cemento Compuesto CP II-F 32', brand: 'INC Vallemí / Yguazú', unit: 'Bolsa 50kg', unitPrice: 62000, qtyPerUnit: 0.35 },
      { product: 'Hidrófugo Inorgánico Sika-1 / Ceresita', brand: 'Sika / Weber Ceresita', unit: 'bidón 20L', unitPrice: 145000, qtyPerUnit: 0.04 },
      { product: 'Arena lavada de río puesta en obra', brand: 'Arenera Villa Hayes', unit: 'm³', unitPrice: 95000, qtyPerUnit: 0.05 }
    ]
  },
  12: {
    id: 12,
    code: '13.5',
    partidaId: 'forense_tabiqueria_liviana_apeo',
    suggestedProduct: 'Ladrillo Hueco Cerámico 6 Tubos Tobatí / Itaipú (12×18×25cm) revocado a 2 caras',
    brand: 'Cerámica Itaipú / Tobatí / INC Vallemí',
    commercialUnit: 'm²',
    commercialUnitPrice: 122034,
    supplierRef: 'Materiales de Construcción Tobatí / Emporio de la Construcción',
    insumosUnitarios: [
      { product: 'Ladrillo hueco cerámico 6 tubos (12×18×25cm)', brand: 'Cerámica Itaipú / Tobatí', unit: 'un', unitPrice: 2100, qtyPerUnit: 20 },
      { product: 'Mortero de asiento y revoque 2 caras c/ Cemento Vallemí', brand: 'INC Vallemí', unit: 'm²', unitPrice: 35000, qtyPerUnit: 1.0 },
      { product: 'Mano de obra tabiquería interior y revocado 2 caras', brand: 'Cuadrilla Albañilería', unit: 'm²', unitPrice: 45034, qtyPerUnit: 1.0 }
    ]
  },
  13: {
    id: 13,
    code: '13.3',
    partidaId: 'forense_puente_adherencia_epoxico',
    suggestedProduct: 'Membrana Cementicia Flexible SikaTop-107 Seal (Caja 25kg) + Puente Adherencia SikaLatex + Puente Epóxico Sikadur-32 Gel en Pelos de Pilares',
    brand: 'Sika Paraguay (SikaTop-107 / Sikadur-32 Gel / SikaLatex)',
    commercialUnit: 'm² (Caja 25kg / Kit 1kg / Bidón 4L)',
    commercialUnitPrice: 70952,
    supplierRef: 'Construshop Paraguay / Centro Sika Asunción',
    insumosUnitarios: [
      { product: 'Membrana Cementicia Flexible SikaTop-107 Seal', brand: 'Sika', unit: 'caja 25kg', unitPrice: 245000, qtyPerUnit: 0.14 },
      { product: 'Puente de Adherencia Epóxico Estructural Sikadur-32 Gel', brand: 'Sika', unit: 'kit 1kg', unitPrice: 195000, qtyPerUnit: 0.08 },
      { product: 'Emulsión Acrílica Puente Adherencia SikaLatex', brand: 'Sika', unit: 'bidón 4L', unitPrice: 165000, qtyPerUnit: 0.06 }
    ]
  },
  14: {
    id: 14,
    code: '6.1',
    partidaId: 'vidrios_templados_galeria',
    suggestedProduct: 'Vidrio Templado Blindex 10mm Incoloro/Gris Control Solar + Perfilería Aluminio Negro Línea Pesada Módena/Aluar c/ Rodamientos Dobles',
    brand: 'Blindex / VASA / Aluar Línea Módena Negra',
    commercialUnit: 'm² instalado',
    commercialUnitPrice: 573913,
    supplierRef: 'Cristalería Asunción / Glasstec Paraguay / Vilux',
    insumosUnitarios: [
      { product: 'Vidrio Templado Blindex 10mm certificado INTN', brand: 'Blindex / VASA', unit: 'm²', unitPrice: 365000, qtyPerUnit: 1.0 },
      { product: 'Perfilería Aluminio Negro Anodizado Línea Pesada Módena/Aluar + Rodamientos Dobles', brand: 'Aluar / Módena', unit: 'm²', unitPrice: 128913, qtyPerUnit: 1.0 },
      { product: 'Instalación, sellado silicona neutra y herrajes', brand: 'Cristalería Especializada', unit: 'm²', unitPrice: 80000, qtyPerUnit: 1.0 }
    ]
  },
  15: {
    id: 15,
    code: '14.6',
    partidaId: 'edifica_aberturas_madera',
    suggestedProduct: 'Kit Motor Basculante Rápido PPA JetFlex 1/2 HP (<6 seg) + Traba Electromagnética + Puertas Placa Enchapadas en Cedro/Paraíso c/ Marco Ybyraró y Cerradura Papaiz',
    brand: 'PPA JetFlex / Carpintería Ybyraró-Cedro / Papaiz',
    commercialUnit: 'un / kit',
    commercialUnitPrice: 1088889,
    supplierRef: 'PPA Paraguay / Maderera Asunción / Ferretería Americana',
    insumosUnitarios: [
      { product: 'Kit Motor Basculante Rápido PPA JetFlex 1/2 HP (<6 seg) + 2 Controles + Traba Dog Steel', brand: 'PPA Brasil', unit: 'kit', unitPrice: 2150000, qtyPerUnit: 1.0 },
      { product: 'Puerta interior placa enchapada en Cedro/Paraíso 0.80×2.10m c/ Marco Ybyraró y Cerradura Papaiz', brand: 'Carpintería Nacional / Papaiz', unit: 'un', unitPrice: 920000, qtyPerUnit: 1.0 }
    ]
  },
  16: {
    id: 16,
    code: '7.2',
    partidaId: 'instalaciones_sanitarias_desagues',
    suggestedProduct: 'Tubería Termofusión PPR PN20 Tigre/Saladillo Ø25mm y Ø20mm + Desagüe PVC Reforzado Tigre Ø100mm + Termocalefón Tokyo/James 80L + Cámara Séptica 1.500L + Pozo Absorbente Ladrillo Tobatí Ø1.80×3.50m c/ Acople Camión Cisterna',
    brand: 'Tigre / Saladillo / Tokyo-James / Olería Tobatí',
    commercialUnit: 'gl',
    commercialUnitPrice: 12600000,
    supplierRef: 'Construshop Paraguay / Corporación Mercantil / NGO (Tokyo)',
    insumosUnitarios: [
      { product: 'Tubería y accesorios Termofusión PPR PN20 Ø25mm y Ø20mm (Agua Directa ESSAP Sin Tanque)', brand: 'Tigre / Saladillo', unit: 'lote', unitPrice: 2850000, qtyPerUnit: 1.0 },
      { product: 'Tubería Desagüe Cloacal PVC Serie Reforzada Ø100mm, Ø50mm y Ø40mm', brand: 'Tigre', unit: 'lote', unitPrice: 2450000, qtyPerUnit: 1.0 },
      { product: 'Termocalefón 80 Litros Tanque Esmaltado / Inox', brand: 'Tokyo / James', unit: 'un', unitPrice: 1650000, qtyPerUnit: 1.0 },
      { product: 'Cámara Séptica 1.500L + Pozo Absorbente Ø1.80×3.50m en Ladrillo Tobatí c/ Acople Cisterna', brand: 'Tigre / Tobatí', unit: 'gl', unitPrice: 5650000, qtyPerUnit: 1.0 }
    ]
  },
  17: {
    id: 17,
    code: '10.1',
    partidaId: 'bano_suite_sanitarios',
    suggestedProduct: 'Inodoro One-Piece Doble Descarga Deca/Incepa + Bacha c/ Grifería Monocomando FV/Docol + Mesada Granito Negro San Gabriel + Campana Extractora Inox 60cm',
    brand: 'Deca / Incepa / FV / Docol / Marmolería San Gabriel',
    commercialUnit: 'jgo',
    commercialUnitPrice: 5600000,
    supplierRef: 'Corporación Mercantil S.A. / Marmolería Asunción / Tienda Naranja',
    insumosUnitarios: [
      { product: 'Inodoro One-Piece Doble Descarga + Lavatorio c/ Pedestal/Vanitory', brand: 'Deca / Incepa', unit: 'jgo', unitPrice: 1850000, qtyPerUnit: 1.0 },
      { product: 'Grifería Monocomando Ducha, Lavatorio y Cocina Cromo', brand: 'FV / Docol', unit: 'jgo', unitPrice: 1450000, qtyPerUnit: 1.0 },
      { product: 'Mesada Granito Natural Negro San Gabriel c/ Bacha Doble Inox Tramontina', brand: 'San Gabriel / Tramontina', unit: 'ml', unitPrice: 1550000, qtyPerUnit: 1.0 },
      { product: 'Campana Extractora Acero Inoxidable 60cm c/ Filtro Carbón y Ducto Exterior', brand: 'Tokyo / Tramontina', unit: 'un', unitPrice: 750000, qtyPerUnit: 1.0 }
    ]
  },
  18: {
    id: 18,
    code: '7.1',
    partidaId: 'instalaciones_electricas_embutidas',
    suggestedProduct: 'Cable Unipolar Antillama Inpaco 6mm² / 4mm² / 2.5mm² (Norma INTN) + Tablero Embutir 36-48 DIN Puerta Fumée + Disyuntores Schneider/Steck + Protector Sobretensión DPS Clase II + Jabalina Copperweld Ø5/8"×2.40m',
    brand: 'Inpaco / Schneider Electric / Steck / Copperweld',
    commercialUnit: 'gl (Rollos 100m + Tablero DIN)',
    commercialUnitPrice: 13800000,
    supplierRef: 'Electropar S.A. / Luminotecnia / Record Electric (Asunción)',
    insumosUnitarios: [
      { product: 'Cable Unipolar Antillama Inpaco 6mm², 4mm² (Tomas 20A) y 2.5mm² Norma INTN', brand: 'Inpaco Paraguay', unit: 'rollo 100m', unitPrice: 410000, qtyPerUnit: 12 },
      { product: 'Tablero Embutir 36-48 DIN Puerta Fumée + Disyuntores TM y Diferenciales 30mA', brand: 'Schneider Electric / Steck', unit: 'cjto', unitPrice: 3450000, qtyPerUnit: 1 },
      { product: 'Protector Sobretensión Atmosférica DPS Tetrapolar Clase II 40kA + 2 Jabalinas Copperweld Ø5/8"×2.40m', brand: 'Schneider / Copperweld', unit: 'cjto', unitPrice: 1450000, qtyPerUnit: 1 },
      { product: 'Mano de obra electricista matriculado ANDE Cat. A (3 niveles + acometida x=-3.85m)', brand: 'Técnico ANDE', unit: 'gl', unitPrice: 3980000, qtyPerUnit: 1 }
    ]
  },
  19: {
    id: 19,
    code: '14.7',
    partidaId: 'edifica_pintura_integral',
    suggestedProduct: 'Pintura Acrílica Exterior Impermeabilizante Suvinil / Amanecer Frente Total (Balde 18L: Gs. 395.000) + Enduido Interior + Sellador Acrílico',
    brand: 'Suvinil / Pinturas Amanecer (Frente Total)',
    commercialUnit: 'm² (Balde 18L Gs. 395.000)',
    commercialUnitPrice: 20000,
    supplierRef: 'Construshop Paraguay / Amanecer Pinturas / Suvinil Center',
    insumosUnitarios: [
      { product: 'Pintura Acrílica Exterior Impermeabilizante Frente Total (Balde 18L)', brand: 'Suvinil / Amanecer', unit: 'balde 18L', unitPrice: 395000, qtyPerUnit: 0.025 },
      { product: 'Enduido Plástico Interior + Sellador Fijador Acrílico Concentrado', brand: 'Amanecer / Suvinil', unit: 'balde 18L', unitPrice: 245000, qtyPerUnit: 0.015 },
      { product: 'Mano de obra lijado, imprimación y 2 manos de pintura', brand: 'Pintor de Obra', unit: 'm²', unitPrice: 6450, qtyPerUnit: 1.0 }
    ]
  },
  20: {
    id: 20,
    code: '14.1',
    partidaId: 'edifica_vereda_frontal',
    suggestedProduct: 'Vigas Madera Dura Lapacho/Ybyraró 3"×6" + Policarbonato Alveolar Antigranizo 10mm Bronce/Cristal + Piso Canto Rodado/Loseta Colonial en Vereda',
    brand: 'Maderera Lapacho-Ybyraró / Policarbonato Makrolon / Cerámica Colonial',
    commercialUnit: 'gl (Vereda 9.89×2.00m + Pérgola Cochera)',
    commercialUnitPrice: 5400000,
    supplierRef: 'Maderera Asunción / Construshop / Emporio de la Construcción',
    insumosUnitarios: [
      { product: 'Vigas Madera Dura Lapacho / Ybyraró cepillado 3"×6" impregnado Cetol', brand: 'Maderera Nacional', unit: 'ml', unitPrice: 95000, qtyPerUnit: 22 },
      { product: 'Placas Policarbonato Alveolar Antigranizo 10mm c/ Perfil H y Cinta Aluminio', brand: 'Makrolon / DVP', unit: 'm²', unitPrice: 135000, qtyPerUnit: 12 },
      { product: 'Piso Canto Rodado Desactivado / Loseta Colonial Antideslizante en Vereda 9.89×2.00m + Canasto Basurero', brand: 'Pretec / Colonial', unit: 'm²', unitPrice: 85000, qtyPerUnit: 19.8 }
    ]
  },
  21: {
    id: 21,
    code: '8.1',
    partidaId: 'pisos_porcelanato',
    suggestedProduct: 'Porcelanato Satinado Rectificado 60×60cm Eliane/Portobello (Gs. 95.000/m² material + Gs. 55.000/m² colocación c/ argamasa AC-III Votorantim)',
    brand: 'Eliane / Portobello / Argamasa Votorantim AC-III',
    commercialUnit: 'm² (Cajas 1.44 m² + Bolsa AC-III 20kg)',
    commercialUnitPrice: 180000,
    supplierRef: 'Corporación Mercantil S.A. / Construshop Paraguay',
    insumosUnitarios: [
      { product: 'Porcelanato Satinado Rectificado 60×60cm Antideslizante R9 (Apto Mascotas Emma)', brand: 'Eliane / Portobello', unit: 'm²', unitPrice: 95000, qtyPerUnit: 1.08 },
      { product: 'Pegamento Flexible Porcelanato Argamasa AC-III + Pastina Antihongos', brand: 'Votorantim / Weber', unit: 'bolsa 20kg', unitPrice: 48000, qtyPerUnit: 0.35 },
      { product: 'Mano de obra colocación nivelada con clips autonivelantes y zócalos', brand: 'Colocador Especializado', unit: 'm²', unitPrice: 55000, qtyPerUnit: 1.0 }
    ]
  },
  22: {
    id: 22,
    code: '14.8',
    partidaId: 'edifica_equipamiento_cocina',
    suggestedProduct: 'Muebles de Cocina Bajo-Mesada, Alacena e Isla en MDF Melamina 18mm Masisa/Faplac Hidrófugo c/ Herrajes Cierre Suave',
    brand: 'Masisa / Faplac Hidrófugo 18mm / Blum-Hafele',
    commercialUnit: 'gl / ml',
    commercialUnitPrice: 17543750,
    supplierRef: 'Tienda Naranja (#235614) / Achon / Carpintería Industrial Asunción',
    insumosUnitarios: [
      { product: 'Placas MDF Melamina Texturada 18mm Hidrófuga Verde en Bajo-Mesada y Alacena', brand: 'Masisa / Faplac', unit: 'placa', unitPrice: 440000, qtyPerUnit: 16 },
      { product: 'Bisagras Cierre Suave (Soft-Close), Correderas Telescópicas Pesadas y Pistones a Gas', brand: 'Hafele / Ducasse', unit: 'lote', unitPrice: 2850000, qtyPerUnit: 1 },
      { product: 'Fabricación a medida e instalación de Bajo-Mesada, Alacenas Superiores e Isla', brand: 'Carpintería Amoblamientos', unit: 'gl', unitPrice: 7653750, qtyPerUnit: 1 }
    ]
  },
  23: {
    id: 23,
    code: '10.4',
    partidaId: 'placares_dormitorios_adicional',
    suggestedProduct: 'Placares Piso-Techo en MDF Melamina 18mm Masisa/Faplac c/ Rieles Aluminio, Cajoneras Telescópicas y Herrajes Cierre Suave',
    brand: 'Masisa / Faplac 18mm / Ducasse',
    commercialUnit: 'un (2 Placares Dormitorios 2do Piso)',
    commercialUnitPrice: 4800000,
    supplierRef: 'Tienda Naranja (Seller #235614) / Carpintería a Medida Asunción',
    insumosUnitarios: [
      { product: 'Placas MDF Melamina 18mm Roble/Lino + Cantos ABS 2mm', brand: 'Masisa / Faplac', unit: 'placa', unitPrice: 410000, qtyPerUnit: 6.5 },
      { product: 'Kit Rieles Aluminio Corredizos, Barrales Cromados y Correderas Cierre Suave', brand: 'Ducasse / Hafele', unit: 'kit', unitPrice: 890000, qtyPerUnit: 1 },
      { product: 'Armado y montaje empotrado en Suite Ruth & Leo y Dormitorio 2', brand: 'Carpintería', unit: 'un', unitPrice: 1245000, qtyPerUnit: 1 }
    ]
  },
  24: {
    id: 24,
    code: '5.1',
    partidaId: 'galeria_voladizo_deck',
    suggestedProduct: 'Deck WPC Ecológico Libre Mantenimiento / Madera Dura Lapacho Cepillado Impregnado Cetol Deck + Alfajías PVC/Ybyraró',
    brand: 'Deck WPC / Lapacho Paraguayo / Cetol',
    commercialUnit: 'm² (33.42 m² en Galería L1 al Río)',
    commercialUnitPrice: 650000,
    supplierRef: 'Maderera Asunción / Construshop / Shopping Británico',
    insumosUnitarios: [
      { product: 'Tablas Deck WPC / Lapacho Cepillado 1"×4" secado en horno', brand: 'Lapacho / WPC', unit: 'm²', unitPrice: 385000, qtyPerUnit: 1.0 },
      { product: 'Protector Impregnante Cetol Deck Balance + Fijaciones Inoxidables Ocultas', brand: 'Cetol AkzoNobel', unit: 'lata 4L', unitPrice: 320000, qtyPerUnit: 0.25 },
      { product: 'Bastidor de alfajías niveladas sobre membrana Losa L1 y mano de obra', brand: 'Carpintería Deck', unit: 'm²', unitPrice: 185000, qtyPerUnit: 1.0 }
    ]
  },
  25: {
    id: 25,
    code: '12.5',
    partidaId: 'debil_alarma_barreras',
    suggestedProduct: 'Kit Domótica China Riel DIN Tongou/MatSee Plus Zigbee 3.0 + Interruptores Cristal Templado Con Neutro + 6 Cámaras IP PoE Hikvision/Dahua 4MP + Alarma Pet-Immune Paradox/Hikvision Dual-SIM',
    brand: 'Tongou / MatSee Plus / Aqara / Hikvision / Paradox',
    commercialUnit: 'kit integral',
    commercialUnitPrice: 5450000,
    supplierRef: 'Importación Directa Shenzhen (AliExpress/Alibaba) + Protek / Electropar Asunción',
    insumosUnitarios: [
      { product: 'Central Alarma Híbrida App + 5 Sensores PIR Doble Tecnología Pet-Immune 25kg (Emma y Serafina) + Barrera IR', brand: 'Hikvision AX PRO / Paradox', unit: 'kit', unitPrice: 3800000, qtyPerUnit: 1.0 },
      { product: 'Kit Domótica China Riel DIN (Medidor Trifásico CT MatSee Plus + Disyuntores Tongou Zigbee 3.0 + Llaves Cristal c/ Neutro)', brand: 'Tongou / MatSee Plus / Sonoff', unit: 'kit', unitPrice: 2365000, qtyPerUnit: 1.0 },
      { product: 'Sistema 6 Cámaras IP PoE 4MP Visión Nocturna ColorVu + NVR 2TB', brand: 'Hikvision / Dahua', unit: 'kit', unitPrice: 5800000, qtyPerUnit: 1.0 }
    ]
  },
  26: {
    id: 26,
    code: '15.7',
    partidaId: 'cielorraso_acustico_2dopiso',
    suggestedProduct: 'Aire Acondicionado Split Inverter 12.000/18.000 BTU Carrier/Midea/Goodweather + Cielorraso Acústico Durlock c/ Lana de Vidrio Isover 50mm',
    brand: 'Carrier / Midea / Goodweather / Durlock / Isover',
    commercialUnit: 'm² / un',
    commercialUnitPrice: 155000,
    supplierRef: 'NGO S.A. / Bristol / González Giménez / Construshop',
    insumosUnitarios: [
      { product: 'Aire Acondicionado Split Inverter 12.000 / 18.000 BTU Frío/Calor R410A c/ Kit Cañería Cobre', brand: 'Carrier / Midea / Goodweather', unit: 'un', unitPrice: 3450000, qtyPerUnit: 1.0 },
      { product: 'Placa Roca de Yeso Durlock 12.5mm + Perfilería Solera/Montante Galvanizada + Lana de Vidrio Isover 50mm', brand: 'Durlock / Isover Saint-Gobain', unit: 'm²', unitPrice: 95000, qtyPerUnit: 1.0 },
      { product: 'Mano de obra montaje acústico con junta tomada en 2do Piso', brand: 'Instalador Seco', unit: 'm²', unitPrice: 60000, qtyPerUnit: 1.0 }
    ]
  },
  27: {
    id: 27,
    code: '15.6',
    partidaId: 'piscina_patio_oficial',
    suggestedProduct: 'Piscina de Hormigón Armado 5.80×2.40m c/ Revestimiento Venecita/Pintura Epoxi + Filtro y Bomba Vulcano 3/4 HP + Solárium Atérmico Travertino',
    brand: 'PROBETI HA-25 / Vulcano / Cerámica Travertino Atérmico',
    commercialUnit: 'm² (Espejo de agua 5.80×2.40m transversal en fondo)',
    commercialUnitPrice: 2850000,
    supplierRef: 'Syopar / Piscinas Paraguay / Construshop Asunción',
    insumosUnitarios: [
      { product: 'Vaso Monolítico Hormigón Armado H25 Impermeable c/ Sika-1 y Doble Malla Acero ADN 420', brand: 'PROBETI / Votorantim / Sika', unit: 'gl', unitPrice: 18500000, qtyPerUnit: 1.0 },
      { product: 'Filtro Rotomoldeado Vulcano VC-30 + Bomba Autocebante Vulcano 3/4 HP + 2 Luces LED RGB Subacuáticas', brand: 'Vulcano', unit: 'kit', unitPrice: 5400000, qtyPerUnit: 1.0 },
      { product: 'Revestimiento Interior Venecita / Epoxi + Borde Solárium Atérmico Travertino Antideslizante', brand: 'Eliane / Syopar', unit: 'lote', unitPrice: 8590000, qtyPerUnit: 1.0 }
    ]
  },
  28: {
    id: 28,
    code: '5.2',
    partidaId: 'parrilla_ducto',
    suggestedProduct: 'Parrilla de Ladrillo Refractario c/ Campana y Herraje Inox (Emparrillado Levadizo Acero Inoxidable AISI 304 + Ladrillo Refractario 22×11×3cm)',
    brand: 'Refractarios Tobatí/Brasil + Herraje Inox AISI 304',
    commercialUnit: 'un (Quincho Subsuelo hacia Patio)',
    commercialUnitPrice: 7500000,
    supplierRef: 'Parrillas Inox Asunción / Materiales Tobatí / Construshop',
    insumosUnitarios: [
      { product: 'Ladrillo Refractario Alta Temperatura (120 un) + Mortero Refractario', brand: 'Refractarios Mercosur', unit: 'lote', unitPrice: 1950000, qtyPerUnit: 1.0 },
      { product: 'Herraje Emparrillado en V Acero Inoxidable AISI 304 c/ Manivela Criolla, Grasera y Luz Interior', brand: 'Herrajes Inox PY', unit: 'kit', unitPrice: 2850000, qtyPerUnit: 1.0 },
      { product: 'Mampostería base Ladrillo Visto Tobatí, Losa de apoyo, Campana y Sombrerete Spiro', brand: 'Maestro Parrillero', unit: 'un', unitPrice: 2700000, qtyPerUnit: 1.0 }
    ]
  },

  // Mapeo directo por ID string para todas las partidas restantes de PRESUPUESTO_PARTIDAS
  contencion_cochera: {
    id: 6,
    partidaId: 'contencion_cochera',
    suggestedProduct: 'Piedra Bruta de Cantera Emboscada + Ladrillo Macizo Tobatí 1ra + Cemento INC Vallemí CP II-F 32 (Bolsa 50kg: Gs. 62.000) + Varilla ADN 420 Ø12mm',
    brand: 'Cantera Emboscada / INC Vallemí / Votorantim',
    commercialUnit: 'm² (Bolsa 50kg / Millar Ladrillos)',
    commercialUnitPrice: 273366,
    supplierRef: 'Olería Tobatí Directo (@materialesdec_tobati) / Emporio de la Construcción',
    insumosUnitarios: [
      { product: 'Ladrillo Común Macizo 1ra Tobatí (5.5×12×25cm)', brand: 'Olería Tobatí', unit: 'un', unitPrice: 550, qtyPerUnit: 110 },
      { product: 'Cemento Compuesto Tipo CP II-F 32', brand: 'INC Vallemí / Yguazú', unit: 'Bolsa 50kg', unitPrice: 62000, qtyPerUnit: 0.65 },
      { product: 'Varilla Acero Conformado ADN 420 Ø12mm / Ø6mm', brand: 'Votorantim / Acepar', unit: 'barra 12m', unitPrice: 89000, qtyPerUnit: 0.35 }
    ]
  },
  viga_fundacion_muro: {
    id: 2,
    partidaId: 'viga_fundacion_muro',
    suggestedProduct: 'Hormigón Elaborado H25 PROBETI / Pretec (Gs. 890.000/m³) + Varilla Acero Conformado ADN 420 Votorantim / Acepar Ø12mm (Gs. 89.000/barra)',
    brand: 'PROBETI / Votorantim / INC Vallemí',
    commercialUnit: 'ml (m³ H25 / Barra 12m)',
    commercialUnitPrice: 415457,
    supplierRef: 'PROBETI S.R.L. / Aceros Asunción / Emporio de la Construcción',
    insumosUnitarios: [
      { product: 'Hormigón Elaborado H25', brand: 'PROBETI / Pretec', unit: 'm³', unitPrice: 890000, qtyPerUnit: 0.18 },
      { product: 'Varilla de Acero Conformado ADN 420 Ø12mm barra 12m', brand: 'Votorantim / Acepar', unit: 'barra 12m', unitPrice: 89000, qtyPerUnit: 1.15 },
      { product: 'Cemento Compuesto CP II-F 32', brand: 'INC Vallemí', unit: 'Bolsa 50kg', unitPrice: 62000, qtyPerUnit: 0.9 }
    ]
  },
  aislacion_relleno_cochera: {
    id: 1,
    partidaId: 'aislacion_relleno_cochera',
    suggestedProduct: 'Tierra Roja Seleccionada Compactada por Capas + Hidrófugo Sika-1 / Ceresita + Emulsión Asfáltica Sika Igol Denso + Piedra Bruta Emboscada',
    brand: 'Sika Paraguay / Cantera Emboscada / Movimiento de Suelo PY',
    commercialUnit: 'gl (Camionadas 6m³ + Tambor 200L)',
    commercialUnitPrice: 14500000,
    supplierRef: 'Construshop Paraguay / Transporte de Áridos Gran Asunción',
    insumosUnitarios: [
      { product: 'Tierra roja seleccionada compactada con vibroapisonador', brand: 'Cantera Limpio / Emboscada', unit: 'm³', unitPrice: 85000, qtyPerUnit: 95 },
      { product: 'Piedra Bruta de Cantera Emboscada p/ base drenante', brand: 'Cantera Emboscada', unit: 'm³', unitPrice: 135000, qtyPerUnit: 14 },
      { product: 'Pintura Asfáltica Sika Igol Denso + Hidrófugo Sika-1', brand: 'Sika', unit: 'balde 18L', unitPrice: 285000, qtyPerUnit: 6 }
    ]
  },
  hormigon_vigas_losa: {
    id: 8,
    partidaId: 'hormigon_vigas_losa',
    suggestedProduct: 'Hormigón Elaborado H25 PROBETI / Pretec (Gs. 890.000/m³) + Varilla Acero ADN 420 Votorantim / Acepar Ø12mm (Gs. 89.000/barra) + Cemento INC Vallemí',
    brand: 'PROBETI / Pretec / Votorantim / INC Vallemí',
    commercialUnit: 'm³',
    commercialUnitPrice: 2200000,
    supplierRef: 'PROBETI S.R.L. / Aceros Asunción / Emporio de la Construcción',
    insumosUnitarios: [
      { product: 'Hormigón Elaborado H25 bombeado', brand: 'PROBETI / Pretec', unit: 'm³', unitPrice: 890000, qtyPerUnit: 1.0 },
      { product: 'Varilla Acero Conformado ADN 420 Ø12mm y Estribos Ø6mm', brand: 'Votorantim / Acepar', unit: 'barra 12m', unitPrice: 89000, qtyPerUnit: 6.5 },
      { product: 'Encofrado fenólico y mano de obra especializada en altura', brand: 'Cuadrilla H°A°', unit: 'm³', unitPrice: 731500, qtyPerUnit: 1.0 }
    ]
  },
  estructura_metalica_techo: {
    id: 10,
    partidaId: 'estructura_metalica_techo',
    suggestedProduct: 'Correas Perfil C Galvanizado 100×50×15×2mm (Gs. 145.000/barra 6m) + Anclajes Químicos / Mecánicos sobre 14 Pilares (+5.64m)',
    brand: 'Aceros Asunción / Chacomer / Sika AnchorFix',
    commercialUnit: 'gl (Barras 6m Perfil C Galvanizado)',
    commercialUnitPrice: 18500000,
    supplierRef: 'Aceros Asunción / Chacomer / Emporio de la Construcción',
    insumosUnitarios: [
      { product: 'Perfil C Galvanizado Estructural 100×50×15×2mm (Barra 6m)', brand: 'Aceros Asunción', unit: 'barra 6m', unitPrice: 145000, qtyPerUnit: 58 },
      { product: 'Planchuelas de anclaje, electrodos 6013/7018 y pintura epoxi anticorrosiva', brand: 'Conarco / Amanecer', unit: 'lote', unitPrice: 2850000, qtyPerUnit: 1 },
      { product: 'Mano de obra herrería pesada e izaje a cota +105.64m', brand: 'Taller Herrería', unit: 'gl', unitPrice: 7240000, qtyPerUnit: 1 }
    ]
  },
  desagues_canaletas: {
    id: 10,
    partidaId: 'desagues_canaletas',
    suggestedProduct: 'Canaleta Oculta Chapa Galvanizada N°24 Prepintada + Caños Pluviales PVC Tigre Ø100mm Reforzado hacia Calle Tte. Guillermo Arias',
    brand: 'Ternium Chapa N°24 / Tigre PVC Ø100mm',
    commercialUnit: 'gl (19.50 ml Canaleta + 4 Bajadas Ø100mm)',
    commercialUnitPrice: 7800000,
    supplierRef: 'Zinguería Asunción / Construshop Paraguay (Tigre)',
    insumosUnitarios: [
      { product: 'Canaleta Oculta Chapa Galvanizada N°24 c/ Babetas y Embaparaguas', brand: 'Ternium / Zinguería', unit: 'ml', unitPrice: 85000, qtyPerUnit: 20 },
      { product: 'Caño PVC Pluvial Reforzado Ø100mm + Codos y Registros', brand: 'Tigre', unit: 'tira 4m', unitPrice: 92000, qtyPerUnit: 18 },
      { product: 'Mano de obra zinguería, sellado PU Sikaflex y encauzado a vereda frontal', brand: 'Plomero / Zinguería', unit: 'gl', unitPrice: 4444000, qtyPerUnit: 1 }
    ]
  },
  revoque_exterior_impermeable: {
    id: 11,
    partidaId: 'revoque_exterior_impermeable',
    suggestedProduct: 'Mortero Cemento INC Vallemí CP II-F 32 (Gs. 62.000/bolsa) + Hidrófugo Inorgánico Sika-1 / Ceresita (Gs. 145.000/bidón 20L) + Arena Lavada',
    brand: 'INC Vallemí / Sika-1 / Weber Ceresita',
    commercialUnit: 'm²',
    commercialUnitPrice: 65000,
    supplierRef: 'Construshop Paraguay / Emporio de la Construcción',
    insumosUnitarios: [
      { product: 'Cemento Compuesto CP II-F 32', brand: 'INC Vallemí / Yguazú', unit: 'Bolsa 50kg', unitPrice: 62000, qtyPerUnit: 0.25 },
      { product: 'Hidrófugo Sika-1 / Ceresita para azotado impermeable', brand: 'Sika / Weber', unit: 'bidón 20L', unitPrice: 145000, qtyPerUnit: 0.05 },
      { product: 'Arena lavada tamizada + Mano de obra revocado fratasado al fieltro', brand: 'Cuadrilla Albañilería', unit: 'm²', unitPrice: 42250, qtyPerUnit: 1.0 }
    ]
  },
  puertas_seguridad_provisoria: {
    id: 15,
    partidaId: 'puertas_seguridad_provisoria',
    suggestedProduct: 'Puerta Exterior Metálica / Madera Maciza Ybyraró + Puerta-Reja Seguridad Escalera Subsuelo Eje 8–9 c/ Cerradura Multianclaje Papaiz/Stam',
    brand: 'Papaiz / Stam / Herrería Seguridad Asunción',
    commercialUnit: 'gl (3 Accesos Exteriores + Puerta-Reja Subsuelo)',
    commercialUnitPrice: 8500000,
    supplierRef: 'Ferretería Americana / Taller Herrería Asunción',
    insumosUnitarios: [
      { product: 'Puerta exterior reforzada + Marco chapa N°16 / Ybyraró c/ Cerradura Multianclaje', brand: 'Papaiz / Stam', unit: 'un', unitPrice: 2450000, qtyPerUnit: 2 },
      { product: 'Puerta-Reja Seguridad Hierro Macizo en Pie de Escalera 1 Subsuelo (Eje 8–9)', brand: 'Herrería Seguridad', unit: 'un', unitPrice: 2200000, qtyPerUnit: 1 },
      { product: 'Amurado con concreto, bisagras munición y colocación', brand: 'Herrero / Albañil', unit: 'gl', unitPrice: 1400000, qtyPerUnit: 1 }
    ]
  },
  porton_cochera_automatizado: {
    id: 15,
    partidaId: 'porton_cochera_automatizado',
    suggestedProduct: 'Kit Motor Basculante Rápido PPA JetFlex 1/2 HP (<6 seg, Gs. 2.150.000/kit) + Traba Electromagnética Dog Steel + Cerradura Eléctrica en Portoncito 0.95m',
    brand: 'PPA Brasil (JetFlex Brushless) / Dog Steel',
    commercialUnit: 'kit instalado',
    commercialUnitPrice: 2650000,
    supplierRef: 'PPA Paraguay / Electropar / Protek',
    insumosUnitarios: [
      { product: 'Kit Motor Basculante Rápido PPA JetFlex 1/2 HP + Central Triflex + 2 Controles', brand: 'PPA Brasil', unit: 'kit', unitPrice: 2150000, qtyPerUnit: 1.0 },
      { product: 'Traba Electromagnética PPA Dog Steel + Fotocélula anti-aplastamiento + Instalación', brand: 'PPA', unit: 'cjto', unitPrice: 500000, qtyPerUnit: 1.0 }
    ]
  },
  cocina_mesada_bacha_esencial: {
    id: 17,
    partidaId: 'cocina_mesada_bacha_esencial',
    suggestedProduct: 'Mesada Granito Natural Negro San Gabriel (2.40m) + Bacha Doble Acero Inox Tramontina + Grifería Monocomando FV/Docol + Campana Extractora Inox 60cm',
    brand: 'Granito San Gabriel / Tramontina / FV / Docol',
    commercialUnit: 'gl',
    commercialUnitPrice: 4850000,
    supplierRef: 'Marmolería Asunción / Corporación Mercantil / Tienda Naranja',
    insumosUnitarios: [
      { product: 'Mesada Granito Natural Negro San Gabriel 2.40×0.62m c/ zócalo y trasfaro', brand: 'Marmolería San Gabriel', unit: 'gl', unitPrice: 2450000, qtyPerUnit: 1.0 },
      { product: 'Bacha Doble Acero Inox AISI 304 + Grifería Monocomando Alta Cocina', brand: 'Tramontina / FV-Docol', unit: 'cjto', unitPrice: 1450000, qtyPerUnit: 1.0 },
      { product: 'Nicho exterior ventilado GLP + Cañería Cobre/Sigas y conexión sifónica', brand: 'Sigas / Tigre', unit: 'gl', unitPrice: 950000, qtyPerUnit: 1.0 }
    ]
  },
  lavadero_habitable: {
    id: 16,
    partidaId: 'lavadero_habitable',
    suggestedProduct: 'Pileta de Lavar Loza/Granito Deca/Tramontina + Grifería Pared FV + Conexiones PPR/PVC Tigre p/ Lavarropas en Pared Izquierda Subsuelo',
    brand: 'Deca / Tramontina / FV / Tigre',
    commercialUnit: 'gl',
    commercialUnitPrice: 2837500,
    supplierRef: 'Corporación Mercantil / Construshop Paraguay',
    insumosUnitarios: [
      { product: 'Pileta de Lavar Fregadero Profundo + Sifón y Grifería Metálica', brand: 'Deca / FV', unit: 'cjto', unitPrice: 1250000, qtyPerUnit: 1.0 },
      { product: 'Conexión Agua Fría PPR Ø20mm + Desagüe PVC Ø50mm + Toma 20A IP55 p/ Lavarropas', brand: 'Tigre / Schneider', unit: 'gl', unitPrice: 1587500, qtyPerUnit: 1.0 }
    ]
  },
  hidro_muro_vertical: {
    id: 13,
    partidaId: 'hidro_muro_vertical',
    suggestedProduct: 'Hidrófugo Inorgánico Sika-1 / Ceresita (Bidón 20L: Gs. 145.000) + Emulsión Asfáltica Sika Igol Denso / Megafalto en Trasdós Muro Contención',
    brand: 'Sika Paraguay (Sika-1 + Igol Denso) / Weber Ceresita',
    commercialUnit: 'm²',
    commercialUnitPrice: 48000,
    supplierRef: 'Construshop Paraguay / Centro Sika Asunción',
    insumosUnitarios: [
      { product: 'Hidrófugo Sika-1 / Ceresita en mortero 1:3', brand: 'Sika / Weber', unit: 'bidón 20L', unitPrice: 145000, qtyPerUnit: 0.08 },
      { product: 'Pintura Asfáltica Impermeabilizante Sika Igol Denso (Balde 18L)', brand: 'Sika', unit: 'balde 18L', unitPrice: 285000, qtyPerUnit: 0.06 },
      { product: 'Mano de obra azotado hidrófugo y 2 manos cruzadas de betún asfáltico', brand: 'Albañil Impermeabilizador', unit: 'm²', unitPrice: 19300, qtyPerUnit: 1.0 }
    ]
  },
  hidro_drenaje_frances: {
    id: 16,
    partidaId: 'hidro_drenaje_frances',
    suggestedProduct: 'Tubo Corrugado Perforado PVC Drenaje Ø100mm Tigre + Manta Geotextil NT 200g/m² Bidim + Grava Lavada Piedra Triturada 4ta',
    brand: 'Tigre / Mexichem Bidim / Cantera Ñemby',
    commercialUnit: 'ml',
    commercialUnitPrice: 165000,
    supplierRef: 'Construshop Paraguay / Geosistemas Asunción',
    insumosUnitarios: [
      { product: 'Tubo Corrugado Ranurado Drenaje Ø100mm', brand: 'Tigre', unit: 'ml', unitPrice: 48000, qtyPerUnit: 1.0 },
      { product: 'Manta Geotextil No Tejida Bidim 200 g/m² + Grava filtrante', brand: 'Bidim / Cantera', unit: 'ml', unitPrice: 62000, qtyPerUnit: 1.0 },
      { product: 'Mano de obra zanjeo, pendiente y empalme pluvial', brand: 'Cuadrilla Sanitaria', unit: 'ml', unitPrice: 55000, qtyPerUnit: 1.0 }
    ]
  },
  hidro_capa_horizontal: {
    id: 13,
    partidaId: 'hidro_capa_horizontal',
    suggestedProduct: 'Doble Cajón Hidrófugo con Sika-1 / Ceresita + Pintura Asfáltica Sika Igol + Film Polietileno en Arranque de Mampostería Tobatí',
    brand: 'Sika Paraguay / INC Vallemí',
    commercialUnit: 'ml',
    commercialUnitPrice: 55000,
    supplierRef: 'Construshop Paraguay',
    insumosUnitarios: [
      { product: 'Mortero impermeable 1:3 c/ Sika-1 + Pintura Asfáltica Igol', brand: 'Sika / INC Vallemí', unit: 'ml', unitPrice: 31000, qtyPerUnit: 1.0 },
      { product: 'Mano de obra nivelación láser de cajón hidrófugo doble', brand: 'Albañil', unit: 'ml', unitPrice: 24000, qtyPerUnit: 1.0 }
    ]
  },
  hidro_membrana_terraza: {
    id: 13,
    partidaId: 'hidro_membrana_terraza',
    suggestedProduct: 'Membrana Cementicia Flexible SikaTop-107 Seal + Membrana Líquida Poliuretánica SikaFill / Suvinil + Sellador PU Sikaflex-1A en Galería L1',
    brand: 'Sika Paraguay (SikaTop-107 / SikaFill / Sikaflex-1A)',
    commercialUnit: 'm²',
    commercialUnitPrice: 110000,
    supplierRef: 'Construshop Paraguay / Centro Sika Asunción',
    insumosUnitarios: [
      { product: 'Membrana Cementicia SikaTop-107 Seal (Caja 25kg)', brand: 'Sika', unit: 'caja 25kg', unitPrice: 245000, qtyPerUnit: 0.22 },
      { product: 'Sellador Poliuretánico Sikaflex-1A en babetas y juntas', brand: 'Sika', unit: 'cartucho 300ml', unitPrice: 78000, qtyPerUnit: 0.25 },
      { product: 'Mano de obra aplicación en 3 manos cruzadas con velo geotextil', brand: 'Impermeabilizador', unit: 'm²', unitPrice: 36600, qtyPerUnit: 1.0 }
    ]
  },
  hidro_barrera_vapor: {
    id: 13,
    partidaId: 'hidro_barrera_vapor',
    suggestedProduct: 'Film Polietileno Negro Virgen 200 Micrones + Cinta Asfáltica Sika MultiSeal + Lecherada de Cemento INC Vallemí en Subsuelo',
    brand: 'Plásticos Paraguay 200μ / Sika / INC Vallemí',
    commercialUnit: 'm²',
    commercialUnitPrice: 12500,
    supplierRef: 'Construshop / Ferretería Americana',
    insumosUnitarios: [
      { product: 'Film Polietileno Negro 200 Micrones c/ solape 20cm', brand: 'Plásticos PY', unit: 'm²', unitPrice: 7500, qtyPerUnit: 1.15 },
      { product: 'Tendido y sellado de solapes bajo contrapiso/lecherada Subsuelo', brand: 'Albañil', unit: 'm²', unitPrice: 3875, qtyPerUnit: 1.0 }
    ]
  },
  debil_cableado_cat6: {
    id: 18,
    partidaId: 'debil_cableado_cat6',
    suggestedProduct: 'Cable UTP Cat6 100% Cobre Furukawa / Hikvision SohoPlus + Caño Corrugado Ignífugo Tigre Ø3/4" + Jacks RJ45 Schneider',
    brand: 'Furukawa / Hikvision / Tigre / Schneider Electric',
    commercialUnit: 'bocas (8 Puntos Red Gigabit Home-Office y TV)',
    commercialUnitPrice: 185000,
    supplierRef: 'Electropar S.A. / PS Line / Compulandia (Asunción)',
    insumosUnitarios: [
      { product: 'Cable UTP Cat6 100% Cobre Puro (Bobina 305m)', brand: 'Furukawa / Hikvision', unit: 'ml', unitPrice: 6500, qtyPerUnit: 14 },
      { product: 'Bastidor + Módulo Jack RJ45 Cat6 + Caño Corrugado', brand: 'Schneider / Tigre', unit: 'un', unitPrice: 48000, qtyPerUnit: 1 },
      { product: 'Tendido, grimpeado y certificación de boca de red', brand: 'Técnico Redes', unit: 'boca', unitPrice: 46000, qtyPerUnit: 1 }
    ]
  },
  debil_cctv_ip: {
    id: 25,
    partidaId: 'debil_cctv_ip',
    suggestedProduct: 'Kit 6 Cámaras IP PoE Hikvision/Dahua 4MP ColorVu Metálicas IP67 + NVR 8 Canales PoE + Disco WD Purple 2TB Surveillance',
    brand: 'Hikvision / Dahua / Western Digital Purple',
    commercialUnit: 'kit instalado',
    commercialUnitPrice: 5800000,
    supplierRef: 'Electropar / Microcom / Tecnoga (Asunción)',
    insumosUnitarios: [
      { product: 'Cámara Bullet/Domo IP PoE 4MP ColorVu Audio Integrado IP67', brand: 'Hikvision / Dahua', unit: 'un', unitPrice: 485000, qtyPerUnit: 6 },
      { product: 'Grabador NVR 8 Canales PoE Integrado + Disco Duro WD Purple 2TB', brand: 'Hikvision / WD Purple', unit: 'cjto', unitPrice: 1890000, qtyPerUnit: 1 },
      { product: 'Instalación, conectores RJ45 blindados y configuración App', brand: 'Instalador CCTV', unit: 'gl', unitPrice: 1000000, qtyPerUnit: 1 }
    ]
  },
  debil_portero_visor: {
    id: 25,
    partidaId: 'debil_portero_visor',
    suggestedProduct: 'Videoportero IP Hikvision / Dahua Frente Calle Metálico Antivandálico Gran Angular + Pantalla Touch 7" Interior + Apertura desde App',
    brand: 'Hikvision / Dahua IP Intercom',
    commercialUnit: 'kit',
    commercialUnitPrice: 2450000,
    supplierRef: 'Electropar / Protek / Tecnoga Asunción',
    insumosUnitarios: [
      { product: 'Kit Videoportero IP PoE Monitor Touch 7" + Frente Calle HD IP65', brand: 'Hikvision', unit: 'kit', unitPrice: 1950000, qtyPerUnit: 1 },
      { product: 'Integración con cerradura eléctrica de portón peatonal 0.95m y configuración móvil', brand: 'Técnico Seguridad', unit: 'gl', unitPrice: 500000, qtyPerUnit: 1 }
    ]
  },
  debil_wifi_mesh: {
    id: 25,
    partidaId: 'debil_wifi_mesh',
    suggestedProduct: 'Pack 3 Nodos Wi-Fi 6 Mesh Gigabit TP-Link Deco X50 / Xiaomi Mesh AX3000 con Backhaul Cableado Cat6 entre Losas H°A°',
    brand: 'TP-Link Deco X50 / Xiaomi AX3000',
    commercialUnit: 'kit (3 Nodos: Subsuelo, PB y 2do Piso)',
    commercialUnitPrice: 1850000,
    supplierRef: 'Nissei Asunción / Compulandia / Tienda Naranja',
    insumosUnitarios: [
      { product: 'Sistema Mesh Wi-Fi 6 AX3000 Dual-Band Gigabit (Pack × 3 unidades)', brand: 'TP-Link Deco / Xiaomi', unit: 'pack 3', unitPrice: 1650000, qtyPerUnit: 1 },
      { product: 'Configuración de Roaming Continuo y VLAN IoT Domótica', brand: 'Técnico Redes', unit: 'gl', unitPrice: 200000, qtyPerUnit: 1 }
    ]
  },
  debil_domotica_luces: {
    id: 25,
    partidaId: 'debil_domotica_luces',
    suggestedProduct: 'Kit Domótica China Riel DIN Tongou/MatSee Plus Zigbee 3.0 + Interruptores Cristal Templado Con Neutro (Sonoff SwitchMan M5 / Aqara / Moes)',
    brand: 'Tongou / MatSee Plus / Sonoff / Aqara (Zigbee 3.0)',
    commercialUnit: 'un / módulo',
    commercialUnitPrice: 320000,
    supplierRef: 'Compra Directa Shenzhen China / Nissei Asunción',
    insumosUnitarios: [
      { product: 'Interruptor Pared Inteligente Zigbee 3.0 con Neutro + Disyuntor Smart Riel DIN', brand: 'Sonoff / Tongou / Aqara', unit: 'un', unitPrice: 245000, qtyPerUnit: 1 },
      { product: 'Instalación con hilo Neutro y vinculación local Zigbee', brand: 'Electricista Domótica', unit: 'un', unitPrice: 75000, qtyPerUnit: 1 }
    ]
  },
  forense_aislacion_medianera_eje9: {
    id: 13,
    partidaId: 'forense_aislacion_medianera_eje9',
    suggestedProduct: 'Mortero Cristalizante SikaTop-107 Seal / Xypex + Revoque Hidrófugo Sika-1 + Pintura Poliuretánica en Medianera Izquierda Eje 9 (41.21 m²)',
    brand: 'Sika Paraguay (SikaTop-107 + Sika-1) / INC Vallemí',
    commercialUnit: 'gl (41.21 m² Submuración Hidrófuga Eje 9)',
    commercialUnitPrice: 6850000,
    supplierRef: 'Construshop Paraguay / Centro Sika Asunción',
    insumosUnitarios: [
      { product: 'Membrana Cementicia SikaTop-107 Seal (Caja 25kg)', brand: 'Sika', unit: 'caja 25kg', unitPrice: 245000, qtyPerUnit: 8 },
      { product: 'Cemento Compuesto CP II-F 32 + Hidrófugo Sika-1', brand: 'INC Vallemí / Sika', unit: 'lote', unitPrice: 1465000, qtyPerUnit: 1 },
      { product: 'Mano de obra sellado de filtraciones, azotado y canaleta de pie en Eje 9', brand: 'Albañil Especializado', unit: 'gl', unitPrice: 3425000, qtyPerUnit: 1 }
    ]
  },
  forense_cloaca_subsuelo_bombeo: {
    id: 16,
    partidaId: 'forense_cloaca_subsuelo_bombeo',
    suggestedProduct: 'Cámara Séptica Prefabricada/Mampostería 1.500L + Pozo Absorbente Calzado en Ladrillo Común Tobatí Ø1.80×3.50m + Caño Camisa PVC Tigre Ø100mm p/ Camión Cisterna',
    brand: 'Olería Tobatí 1ra / Tigre PVC / INC Vallemí',
    commercialUnit: 'gl (Sin Motor Eléctrico — Autónomo por Gravedad)',
    commercialUnitPrice: 6800000,
    supplierRef: 'Materiales Tobatí (@materialesdec_tobati) / Construshop Paraguay',
    insumosUnitarios: [
      { product: 'Ladrillo Común Macizo 1ra Calidad Tobatí p/ bóveda cribada de pozo ciego', brand: 'Olería Tobatí', unit: 'un', unitPrice: 550, qtyPerUnit: 1200 },
      { product: 'Cámara Séptica Impermeable 1.500L + Tubos PVC Reforzado Ø100mm y Acople Camión Cisterna', brand: 'Tigre / Sika', unit: 'lote', unitPrice: 3240000, qtyPerUnit: 1 },
      { product: 'Mano de obra excavación manual Ø1.80×3.50m, calzado y tapa H°A° en Ejes 8–9', brand: 'Cuadrilla Pocero/Albañil', unit: 'gl', unitPrice: 2900000, qtyPerUnit: 1 }
    ]
  },
  edifica_caminero_vehicular: {
    id: 20,
    partidaId: 'edifica_caminero_vehicular',
    suggestedProduct: 'Hormigón Armado H25 c/ Malla SIMA Ø6mm 15×15cm + Terminación Canto Rodado / Piedra Laja Antideslizante en Huellas Cochera (21 m²)',
    brand: 'PROBETI / Votorantim / Cantera Emboscada',
    commercialUnit: 'm²',
    commercialUnitPrice: 200714,
    supplierRef: 'Emporio de la Construcción / Construshop Paraguay',
    insumosUnitarios: [
      { product: 'Cemento Compuesto CP II-F 32 + Malla SIMA Ø6mm + Canto Rodado', brand: 'INC Vallemí / Votorantim', unit: 'm²', unitPrice: 120428, qtyPerUnit: 1.0 },
      { product: 'Mano de obra nivelación de huellas para SUV Chery Tiggo 2 Pro', brand: 'Cuadrilla Albañilería', unit: 'm²', unitPrice: 80286, qtyPerUnit: 1.0 }
    ]
  },
  edifica_caminero_peatonal: {
    id: 20,
    partidaId: 'edifica_caminero_peatonal',
    suggestedProduct: 'Loseta atérmica / Piedra Laja Paraguaya sobre Contrapiso de Hormigón c/ Junta Tomada (7.50 m²)',
    brand: 'Cantera Paraguaya / INC Vallemí',
    commercialUnit: 'm²',
    commercialUnitPrice: 175000,
    supplierRef: 'Emporio de la Construcción / Piedras Paraguay',
    insumosUnitarios: [
      { product: 'Piedra Laja / Loseta Colonial Antideslizante + Mortero de asiento', brand: 'Cantera Nacional / INC Vallemí', unit: 'm²', unitPrice: 98000, qtyPerUnit: 1.0 },
      { product: 'Mano de obra colocación en caminero peatonal hacia Eje G', brand: 'Albañil', unit: 'm²', unitPrice: 77000, qtyPerUnit: 1.0 }
    ]
  },
  sobreelevacion_muralla_lateral_3x2: {
    id: 11,
    partidaId: 'sobreelevacion_muralla_lateral_3x2',
    suggestedProduct: 'Ladrillo Común Macizo Tobatí 1ra (350 un) + Cemento INC Vallemí CP II-F 32 + Varilla Acero ADN 420 Votorantim Ø8mm en Pilarete y Viga Cadena (6.00 m²)',
    brand: 'Olería Tobatí / INC Vallemí / Votorantim',
    commercialUnit: 'm²',
    commercialUnitPrice: 225000,
    supplierRef: 'Materiales Tobatí / Emporio de la Construcción',
    insumosUnitarios: [
      { product: 'Ladrillo Común Macizo 1ra Calidad Tobatí', brand: 'Olería Tobatí', unit: 'un', unitPrice: 550, qtyPerUnit: 58 },
      { product: 'Cemento Vallemí CP II-F 32 + Varilla ADN 420 Ø8mm + Arena', brand: 'INC Vallemí / Votorantim', unit: 'm²', unitPrice: 98100, qtyPerUnit: 1.0 },
      { product: 'Mano de obra elevación de muralla lateral antirrobo y revocado', brand: 'Albañil', unit: 'm²', unitPrice: 95000, qtyPerUnit: 1.0 }
    ]
  },
  edifica_muralla_frontal: {
    id: 11,
    partidaId: 'edifica_muralla_frontal',
    suggestedProduct: 'Mampostería Ladrillo Macizo Tobatí + Pilaretes H°A° (Referencial: Ya Existe en Obra — Costo BNF Gs. 0)',
    brand: 'Olería Tobatí / INC Vallemí (Ya Existente en Lote)',
    commercialUnit: 'ml',
    commercialUnitPrice: 556117,
    supplierRef: 'Preexistente en Lote (Verificado en Obra)',
    insumosUnitarios: [
      { product: 'Mampostería y cimiento muralla frontal (Preexistente en obra)', brand: 'Obra Existente', unit: 'ml', unitPrice: 556117, qtyPerUnit: 1.0 }
    ]
  },
  edifica_cielorraso_estar: {
    id: 26,
    partidaId: 'edifica_cielorraso_estar',
    suggestedProduct: 'Cielorraso Junta Tomada Placa Roca de Yeso Durlock 12.5mm + Perfilería Galvanizada Barbieri + Garganta Perimetral LED Cálida 3000K',
    brand: 'Durlock / Barbieri / Iluminación LED Philips-Macroled',
    commercialUnit: 'm²',
    commercialUnitPrice: 156250,
    supplierRef: 'Construshop Paraguay / Luminotecnia',
    insumosUnitarios: [
      { product: 'Placa Durlock 12.5mm + Perfiles Solera/Montante Galvanizados + Masilla y Cinta', brand: 'Durlock / Barbieri', unit: 'm²', unitPrice: 90625, qtyPerUnit: 1.0 },
      { product: 'Mano de obra montaje nivelado y garganta difusora en Estar-Comedor', brand: 'Instalador Durlock', unit: 'm²', unitPrice: 65625, qtyPerUnit: 1.0 }
    ]
  },
  puertas_acceso_principal_servicio: {
    id: 15,
    partidaId: 'puertas_acceso_principal_servicio',
    suggestedProduct: 'Puerta Principal Pivotante Madera Maciza Lapacho/Cedro 1.20×2.20m c/ Barral Inox 80cm + Puerta Servicio Independiente Chapa/Madera Dura c/ Cerradura Seguridad Papaiz',
    brand: 'Carpintería Lapacho-Cedro / Papaiz / Acero Inox',
    commercialUnit: 'un (2 Accesos sobre Eje G)',
    commercialUnitPrice: 4750000,
    supplierRef: 'Maderera Asunción / Ferretería Americana',
    insumosUnitarios: [
      { product: 'Hoja y Marco Madera Maciza Estacionada + Pivot Acero Inox Pesado y Barral 80cm', brand: 'Carpintería Alta Gama / Papaiz', unit: 'un', unitPrice: 3610000, qtyPerUnit: 1.0 },
      { product: 'Colocación aplomada sobre Eje G, lustre poliuretánico UV y cerradura multianclaje', brand: 'Carpintero Instalador', unit: 'un', unitPrice: 1140000, qtyPerUnit: 1.0 }
    ]
  },
  blindex_habitaciones: {
    id: 14,
    partidaId: 'blindex_habitaciones',
    suggestedProduct: 'Vidrio Templado Blindex 10mm Incoloro/Gris Control Solar + Perfilería Aluminio Negro Línea Pesada Módena/Aluar c/ Rodamientos Dobles (Suite, Dorm. 2 y Escritorio al Río)',
    brand: 'Blindex / VASA / Aluar Línea Módena Negra',
    commercialUnit: 'm²',
    commercialUnitPrice: 690000,
    supplierRef: 'Cristalería Asunción / Glasstec Paraguay / Vilux',
    insumosUnitarios: [
      { product: 'Puerta-Ventana Corrediza Vidrio Templado Blindex 10mm Certificado', brand: 'Blindex / VASA', unit: 'm²', unitPrice: 420000, qtyPerUnit: 1.0 },
      { product: 'Perfilería Aluminio Negro Línea Pesada + Rieles + Cierres Bate-Fecha', brand: 'Aluar / Módena', unit: 'm²', unitPrice: 165000, qtyPerUnit: 1.0 },
      { product: 'Montaje en 2do Piso (+102.88m) sobre Eje B y Eje A (Escritorio)', brand: 'Cristalería', unit: 'm²', unitPrice: 105000, qtyPerUnit: 1.0 }
    ]
  },
  rejas_balcones_seguridad: {
    id: 9,
    partidaId: 'rejas_balcones_seguridad',
    suggestedProduct: 'Barandas Metálicas Tubo Estructural 40×40×2mm y Planchuela Maciza Galvanizada Pintada al Horno Negro Mate + Rejas Laterales Foso Frontal',
    brand: 'Aceros Asunción / Pintura Epoxi Electrostática',
    commercialUnit: 'ml (19.50 ml en Terraza PA y Foso Frontal)',
    commercialUnitPrice: 620000,
    supplierRef: 'Aceros Asunción / Taller Herrería Arquitectónica',
    insumosUnitarios: [
      { product: 'Tubo estructural 40×40×2mm + Planchuelas verticales c/ separación <=10cm (Seguridad Mascotas)', brand: 'Aceros Asunción', unit: 'ml', unitPrice: 409200, qtyPerUnit: 1.0 },
      { product: 'Soldadura MIG, tratamiento anticorrosivo y amurado químico en borde de losa', brand: 'Maestro Herrero', unit: 'ml', unitPrice: 210800, qtyPerUnit: 1.0 }
    ]
  },
  jardin_cesped_patio: {
    id: 20,
    partidaId: 'jardin_cesped_patio',
    suggestedProduct: 'Panes de Césped Esmeralda Seleccionado + Tierra Negra Abonada Vegetal (Espesor 10cm) en Patio Inferior (+96.20m, 115 m²)',
    brand: 'Vivero Asunción / Césped Esmeralda Premium',
    commercialUnit: 'm²',
    commercialUnitPrice: 58000,
    supplierRef: 'Viveros Ruta Luque-San Bernardino / Agroshopping Asunción',
    insumosUnitarios: [
      { product: 'Césped Esmeralda en panes tupidos + Tierra negra abonada', brand: 'Vivero Nacional', unit: 'm²', unitPrice: 34000, qtyPerUnit: 1.0 },
      { product: 'Nivelación de talud, compactación suave y plantación', brand: 'Paisajista / Jardinero', unit: 'm²', unitPrice: 24000, qtyPerUnit: 1.0 }
    ]
  },
  quincho_patio_subsuelo: {
    id: 28,
    partidaId: 'quincho_patio_subsuelo',
    suggestedProduct: 'Solado Porcelanato Rústico Antideslizante 60×60 + Mesada Granito c/ Bacha Inox Tramontina y Grifería FV en Expansión Subsuelo al Patio (24 m²)',
    brand: 'Eliane Exterior / Tramontina / FV / INC Vallemí',
    commercialUnit: 'm²',
    commercialUnitPrice: 680000,
    supplierRef: 'Corporación Mercantil / Marmolería Asunción',
    insumosUnitarios: [
      { product: 'Piso Cerámico/Porcelanato Antideslizante Exterior + Contrapiso H° y Mesada de Apoyo', brand: 'Eliane / Tramontina / FV', unit: 'm²', unitPrice: 408000, qtyPerUnit: 1.0 },
      { product: 'Mano de obra albañilería, plomería e iluminación cálida de quincho inferior', brand: 'Cuadrilla Integral', unit: 'm²', unitPrice: 272000, qtyPerUnit: 1.0 }
    ]
  },
  biblioteca_4_estantes_2m: {
    id: 23,
    partidaId: 'biblioteca_4_estantes_2m',
    suggestedProduct: 'Tablas Madera Dura Lapacho Cepillado / MDF Melamina 25mm Masisa (4 Estantes × 2.00m = 8.00 ml) + Ménsulas Invisibles Acero Macizo',
    brand: 'Maderera Lapacho / Masisa 25mm / Hafele',
    commercialUnit: 'un (8.00 ml instalados)',
    commercialUnitPrice: 3200000,
    supplierRef: 'Tienda Naranja (#235614) / Maderera Asunción',
    insumosUnitarios: [
      { product: '4 Tablones de 2.00m × 0.30m en Madera Lapacho / Melamina 25mm', brand: 'Masisa / Maderera Nacional', unit: 'estante 2m', unitPrice: 575000, qtyPerUnit: 4.0 },
      { product: 'Soportes ocultos de acero macizo + Fijación química e instalación nivelada', brand: 'Hafele / Carpintero', unit: 'gl', unitPrice: 900000, qtyPerUnit: 1.0 }
    ]
  },
  supervision_direccion_tecnica_banco: {
    id: 20,
    partidaId: 'supervision_direccion_tecnica_banco',
    suggestedProduct: 'Servicio Profesional de Dirección Técnica de Obra (16 Semanas) + Firma de Planos Municipales/Bancarios y Certificaciones de Avance BNF (~6%–8%)',
    brand: 'Arquitecto / Ingeniero Matriculado MOPC-CAP',
    commercialUnit: 'gl (5 Hitos Quincenales Certificados)',
    commercialUnitPrice: 18500000,
    supplierRef: 'Gestión Supervisada Directa con Arquitecto Director de Obra',
    insumosUnitarios: [
      { product: 'Visitas técnicas semanales de control de plomo, dosificación H°A° e impermeabilización', brand: 'Dirección de Obra', unit: 'hito', unitPrice: 3700000, qtyPerUnit: 5.0 }
    ]
  },
  limpieza_volquetes_contingencia_obra: {
    id: 1,
    partidaId: 'limpieza_volquetes_contingencia_obra',
    suggestedProduct: 'Servicio de Alquiler de 6 Contenedores Volquetes de 5m³ + Limpieza Fina Post-Obra y Seguro Operativo en Calle Tte. Guillermo Arias',
    brand: 'Volquetes Asunción / Limpieza Final Profesional',
    commercialUnit: 'gl (6 Volquetes 5m³ + Limpieza Final)',
    commercialUnitPrice: 4500000,
    supplierRef: 'Volquetes Asunción / Servicios Logísticos Gran Asunción',
    insumosUnitarios: [
      { product: 'Alquiler y retiro de contenedor volquete de 5m³ para escombros', brand: 'Volquetes Asunción', unit: 'servicio', unitPrice: 420000, qtyPerUnit: 6.0 },
      { product: 'Limpieza final fina de obra (vidrios Blindex, porcelanato y sanitarios) p/ mudanza', brand: 'Cuadrilla Limpieza', unit: 'gl', unitPrice: 1980000, qtyPerUnit: 1.0 }
    ]
  },
  DEFAULT_FALLBACK: {
    id: 0,
    code: 'CUSTOM',
    partidaId: 'DEFAULT_FALLBACK',
    suggestedProduct: 'Materiales de Construcción Certificados Norma INTN Paraguay (Cemento INC Vallemí / Acero Votorantim / Cerámica Tobatí / Sika / Tigre)',
    brand: 'INC Vallemí / Votorantim / Tobatí / Sika / Tigre',
    commercialUnit: 'un / gl / m²',
    commercialUnitPrice: 150000,
    supplierRef: 'Construshop Paraguay / Corporación Mercantil / Emporio de la Construcción (Asunción)',
    insumosUnitarios: [
      { product: 'Insumo principal de obra (Calidad 1ra Norma INTN)', brand: 'Vallemí / Sika / Tigre', unit: 'un', unitPrice: 93000, qtyPerUnit: 1.0 },
      { product: 'Mano de obra calificada certificada en Asunción', brand: 'Cuadrilla Especializada', unit: 'un', unitPrice: 57000, qtyPerUnit: 1.0 }
    ]
  }
};

// Enriquecer cada partida de PRESUPUESTO_PARTIDAS con suggestedProduct, commercialUnit, commercialUnitPrice, supplierRef y unitBreakdown
const PARTIDA_ID_TO_CATALOG_NUM = {
  contencion_cochera: 6,
  viga_fundacion_muro: 2,
  aislacion_relleno_cochera: 1,
  losa_segunda_parte: 8,
  hormigon_vigas_losa: 8,
  cubierta_metalica: 10,
  estructura_metalica_techo: 10,
  desagues_canaletas: 10,
  mamposteria_exterior: 11,
  revoque_exterior_impermeable: 11,
  puertas_seguridad_provisoria: 15,
  galeria_voladizo_deck: 24,
  parrilla_ducto: 28,
  vidrios_templados_galeria: 14,
  instalaciones_electricas_embutidas: 18,
  instalaciones_sanitarias_desagues: 16,
  pisos_porcelanato: 21,
  porton_cochera_automatizado: 15,
  bano_suite_sanitarios: 17,
  cocina_mesada_bacha_esencial: 17,
  lavadero_habitable: 16,
  placares_dormitorios_adicional: 23,
  hidro_muro_vertical: 13,
  hidro_drenaje_frances: 16,
  hidro_capa_horizontal: 13,
  hidro_membrana_terraza: 13,
  hidro_barrera_vapor: 13,
  debil_cableado_cat6: 18,
  debil_cctv_ip: 25,
  debil_portero_visor: 25,
  debil_wifi_mesh: 25,
  debil_alarma_barreras: 25,
  debil_domotica_luces: 25,
  forense_aislacion_medianera_eje9: 13,
  forense_cloaca_subsuelo_bombeo: 16,
  forense_puente_adherencia_epoxico: 13,
  forense_omision_fila9_lozarrap: 7,
  forense_tabiqueria_liviana_apeo: 12,
  forense_barandas_seguridad: 9,
  edifica_vereda_frontal: 20,
  edifica_caminero_vehicular: 20,
  edifica_caminero_peatonal: 20,
  sobreelevacion_muralla_lateral_3x2: 11,
  edifica_muralla_frontal: 11,
  edifica_cielorraso_estar: 26,
  edifica_aberturas_madera: 15,
  edifica_pintura_integral: 19,
  edifica_equipamiento_cocina: 22,
  puertas_acceso_principal_servicio: 15,
  blindex_habitaciones: 14,
  rejas_balcones_seguridad: 9,
  jardin_cesped_patio: 20,
  quincho_patio_subsuelo: 28,
  piscina_patio_oficial: 27,
  cielorraso_acustico_2dopiso: 26,
  biblioteca_4_estantes_2m: 23,
  supervision_direccion_tecnica_banco: 20,
  limpieza_volquetes_contingencia_obra: 1
};

PRESUPUESTO_PARTIDAS.forEach((partida) => {
  const numCatalogKey = PARTIDA_ID_TO_CATALOG_NUM[partida.id];
  const specificEntry =
    CATALOGO_PRODUCTOS_SUGERIDOS_PARAGUAY[partida.id] ||
    (numCatalogKey ? CATALOGO_PRODUCTOS_SUGERIDOS_PARAGUAY[numCatalogKey] : null) ||
    CATALOGO_PRODUCTOS_SUGERIDOS_PARAGUAY.DEFAULT_FALLBACK;
  const primaryNumericEntry = numCatalogKey ? CATALOGO_PRODUCTOS_SUGERIDOS_PARAGUAY[numCatalogKey] : specificEntry;

  partida.catalogNumericId = numCatalogKey || specificEntry.id || 0;
  partida.suggestedProduct = specificEntry.suggestedProduct || primaryNumericEntry.suggestedProduct;
  partida.commercialUnit = specificEntry.commercialUnit || partida.unidad || 'un';
  partida.commercialUnitPrice = Number(specificEntry.commercialUnitPrice || partida.precioUnitarioGs || 0);
  partida.supplierRef = specificEntry.supplierRef || primaryNumericEntry.supplierRef;
  partida.insumosUnitarios = Array.isArray(specificEntry.insumosUnitarios)
    ? specificEntry.insumosUnitarios
    : primaryNumericEntry.insumosUnitarios;
  partida.unitBreakdown = partida.insumosUnitarios;
});

// ============================================================================
// GALERÍA DE LAS 8 ZONAS ULTRA-REALISTAS DE LA CASA (GALLERY_ZONES_DATA)
// ============================================================================
export const GALLERY_ZONES_DATA = [
  {
    id: 'zona_01_fachada_cochera',
    zoneNumber: 1,
    title: 'Zona 1 — Fachada Frontal Ciega, Portones Grafito, Vereda y Cochera con Pérgola Antigranizo',
    level: 'frente_exterior',
    levelLabel: 'Frente Exterior y Cochera (+100.00m)',
    cota: '+100.00m (Calle Tte. Guillermo Arias, z = -4.00m a +3.00m)',
    dimensions: '9.89m frente × 7.00m fondo (69.23 m²)',
    image: './assets/zonas/zona_01_fachada_cochera.jpg',
    cameraViewKey: 'fachada_porton',
    includedInCredit: '300M',
    summary:
      'Acceso sobre el cul-de-sac de Calle Tte. Guillermo Arias con muralla frontal 100% ciega para máxima privacidad, portón vehicular balancín existente de 2.30m (+X) con motor rápido PPA JetFlex (<6s), portoncito peatonal haciendo juego de 0.95m (-X), bajada trifásica ANDE y medidor ESSAP en la muralla pequeña (x = -3.85m), pérgola de madera con policarbonato antigranizo y piso de rejilla electroforjada sobre el foso de ventilación (z = 1.50m..3.00m).',
    materialsAndProducts: [
      'Motor Basculante Rápido PPA JetFlex 1/2 HP + Traba Electromagnética Dog Steel en portón de 2.30m',
      'Vigas de Madera Dura Lapacho/Ybyraró 3"×6" + Policarbonato Alveolar Antigranizo 10mm sobre cochera',
      'Rejilla Metálica Electroforjada Galvanizada 30×3mm transitable sobre foso de oxigenación (z = 1.50..3.00m)',
      'Pilar Trifásico ANDE 3×40A + Caja Medidor ESSAP directa en muralla pequeña (x = -3.85m, z = -4.08m..-4.24m)'
    ],
    familyNotes:
      'Ruth y Leo ingresan en menos de 6 segundos con su SUV Chery Tiggo 2 Pro 2026 protegida del sol y granizo; Emma y Serafina caminan seguras sobre la rejilla metálica de malla cerrada sin riesgo de caída al subsuelo.'
  },
  {
    id: 'zona_02_estar_social_pb',
    zoneNumber: 2,
    title: 'Zona 2 — Gran Sala de Estar Social, Sofá Familiar y Biblioteca de 4 Estantes de 2m',
    level: 'planta_baja',
    levelLabel: 'Planta Baja Nivel Calle (+100.00m)',
    cota: '+100.00m (Ejes 1–5 × Ejes B–G, sobre Losa Maciza L4 ejecutada junto a Escalera 1)',
    dimensions: '4.95m × 4.80m Estar Social integrado (35.58 m² sobre Losa L4)',
    image: './assets/zonas/zona_02_estar_social_pb.jpg',
    cameraViewKey: 'estar_comedor',
    includedInCredit: '300M',
    summary:
      'Corazón social de la Planta Baja apoyado sobre la Losa Maciza L4 ya hormigonada en obra (Ejes 1–5 × B–G, rodeando la Escalera 1). Integra el juego de sofá de 4 piezas con Ruth, Leo, Emma y Serafina, el rack con TV de 32" y la Biblioteca empotrada de 4 estantes de 2.00m (8.00 ml) con conexión visual franca hacia la Galería y el Río Paraguay.',
    materialsAndProducts: [
      'Losa Maciza L4 H°A° ya ejecutada (315 kg/cm² certificada por PROBETI #17671 en Ejes 1–5 × B–G)',
      'Piso Porcelanato Satinado Rectificado 60×60cm Eliane/Portobello Antideslizante R9 con Argamasa AC-III Votorantim',
      'Biblioteca de 4 estantes de 2.00m (8.00 ml) en madera Lapacho / Melamina 25mm Masisa con ménsulas ocultas',
      'Muros de Ladrillo Tobatí revocados y pintados en tono arena cálido Suvinil/Amanecer + Losa H°A° vista'
    ],
    familyNotes:
      'Espacio diario donde Ruth y Leo comparten lecturas frente a su biblioteca de 8 metros lineales adornada con Espadas de San Jorge, mientras Emma descansa sobre el porcelanato satinado antideslizante y Serafina toma sol junto al ventanal.'
  },
  {
    id: 'zona_03_cocina_comedor_pb',
    zoneNumber: 3,
    title: 'Zona 3 — Cocina Integrada con Isla, Comedor de 6 Sillas y Núcleo Húmedo Frontal (Baño Social)',
    level: 'planta_baja',
    levelLabel: 'Planta Baja Nivel Calle (+100.00m)',
    cota: '+100.00m (Sector Ejes 5–9 × Ejes B–G cerrado con Viguetas Loza Rap 38.00 m²)',
    dimensions: '6.20m × 2.75m Cocina/Comedor + Baño Social 1.10m × 2.00m (sobre cierre Loza Rap 38.00 m²)',
    image: './assets/zonas/zona_03_cocina_comedor_pb.jpg',
    cameraViewKey: 'cocina_isla',
    includedInCredit: '300M',
    summary:
      'Conformado al cerrar el sector sin losa de 38.00 m² (Ejes 5–9 × Ejes B–G, junto a la medianera Eje 9) con viguetas pretensadas Loza Rap. Concentra sobre el Núcleo Húmedo Vertical del Eje F–G (z = 3.00m..5.00m) el Baño Social y la Cocina con mesada de granito Negro San Gabriel, isla desayunadora, comedor para 6 sillas y tomas dedicados de 20A (cable 4mm²).',
    materialsAndProducts: [
      'Cerramiento con Viguetas Pretensadas Loza Rap Serie 12 + Bovedillas Cerámicas + Capa Compresión H25 (38.00 m² en Ejes 5–9)',
      'Mesada de Granito Natural Negro San Gabriel + Bacha Doble Inox Tramontina + Grifería Monocomando FV/Docol',
      'Amoblamiento Bajo-Mesada, Alacenas Superiores e Isla en MDF Melamina 18mm Hidrófuga Masisa/Faplac c/ Cierre Suave',
      'Tubería Termofusión PPR PN20 Tigre/Saladillo directa desde ESSAP + Circuito dedicado 20A (Cable Inpaco 4mm²) p/ Air Fryer y Microondas'
    ],
    familyNotes:
      'Diseñada a medida del inventario real de Ruth y Leo: aloja su mesa de comedor de 6 sillas, heladera, cocina con garrafa (en casilla exterior segura), microondas y Air Fryer Xiaomi de 6L sin sobrecargar térmicamente ningún enchufe.'
  },
  {
    id: 'zona_04_galeria_rio_pb',
    zoneNumber: 4,
    title: 'Zona 4 — Galería Panorámica Rebajada L1 (-0.45m) y Ventanales Blindex al Río Paraguay',
    level: 'planta_baja',
    levelLabel: 'Galería Panorámica PB (+99.55m / -0.45m)',
    cota: '+99.55m (-0.45m rebajada, Ejes A–B × Ejes 1–9)',
    dimensions: '9.74m ancho × 3.43m voladizo (33.42 m²)',
    image: './assets/zonas/zona_04_galeria_rio_pb.jpg',
    cameraViewKey: 'galeria_rio',
    includedInCredit: '350M',
    summary:
      'Balcón-galería mirador sobre la Losa L1 ya ejecutada en hormigón visto, orientada al Noroeste hacia el Mirador Itá Pytã Punta y la curva del Río Paraguay (~85–96m). Queda 100% despejada de humo (sin parrilla de material fija) e incorpora impermeabilización SikaTop-107, deck WPC/Lapacho, ventanales Blindex 10mm en Eje B y baranda de seguridad sobre el desnivel de 3.20m.',
    materialsAndProducts: [
      'Ventanales Corredizos Vidrio Templado Blindex 10mm + Perfilería Aluminio Negro Línea Pesada Módena/Aluar (24 m²)',
      'Deck WPC Ecológico / Madera Dura Lapacho Cepillado Impregnado Cetol sobre Membrana SikaTop-107 Seal',
      'Baranda de Protección en Tubo Estructural 40×40mm Galvanizado Negro Mate con barrotes cada <=10cm (9.74 ml)',
      'Sensores PIR de Cortina Doble Tecnología rasantes al Blindex + Iluminación Exterior Domótica Zigbee'
    ],
    familyNotes:
      'El rincón favorito de Ruth y Leo para contemplar el atardecer sobre el Río Paraguay con su parrilla portátil rodante, mientras Emma y Serafina disfrutan de la brisa del río protegidas por la baranda y malla anticaídas.'
  },
  {
    id: 'zona_05_escritorio_extendido_pa',
    zoneNumber: 5,
    title: 'Zona 5 — Escritorio / Home-Office Doble Extendido hasta Galería (Eje A z=13.34m) y Dormitorio 2',
    level: 'planta_alta',
    levelLabel: 'Planta Alta / 2do Piso (+102.88m)',
    cota: '+102.88m (x = -4.87m..-1.80m extendido hasta Eje A z = 13.34m + Dormitorio 2 Central)',
    dimensions: 'Escritorio extendido 3.07m × 7.34m (z = 6.00..13.34m) + Dormitorio 2 (2.54m × 3.40m)',
    image: './assets/zonas/zona_05_escritorio_extendido_pa.jpg',
    cameraViewKey: 'planta_alta',
    includedInCredit: '300M',
    summary:
      'Al desembarcar de la Escalera 2 se accede libremente al amplio Escritorio / Home-Office Doble y Rincón de Costura, cuyo volumen se extiende hasta el borde mismo de la Galería en el Eje A (z = 13.34m) con ventanal Blindex panorámico al río, acompañado del Dormitorio 2 central ejecutado con tabiquería liviana sobre los ejes donde P12, P13 y P15 mueren en PB.',
    materialsAndProducts: [
      'Tabiquería Interior Liviana Durlock W112 / Ladrillo Hueco Cerámico 6 Tubos Itaipú (respetando apeo de P12, P13 y P15)',
      'Ventanal Frontal y Lateral en Vidrio Templado Blindex 10mm sobre Eje A (z = 13.34m) con visual panorámica al Río',
      'Cableado Estructurado UTP Cat6 100% Cobre Furukawa (2 Bocas RJ45 Gigabit) + Nodo Wi-Fi 6 Mesh Deco X50 + Cuádruple Toma 16A',
      'Escalera 2 de H°A° de 14 peldaños con baranda metálica de seguridad y llaves conmutadas inteligentes 3-Way Zigbee'
    ],
    familyNotes:
      'Espacio de teletrabajo e inspiración para Ruth y Leo con sus 2 escritorios, silla ergonómica, cama de 1 plaza para visitas y la máquina de coser antigua frente a la luz natural del río, dejando el desembarco de la Escalera 2 totalmente cómodo.'
  },
  {
    id: 'zona_06_suite_master_terraza_pa',
    zoneNumber: 6,
    title: 'Zona 6 — Dormitorio Principal en Suite, Vestidor, Baños Superpuestos y Terraza Deck 2 al Río',
    level: 'planta_alta',
    levelLabel: 'Planta Alta / 2do Piso (+102.88m)',
    cota: '+102.88m (+2.88m s/calle, bajo cubierta termoacústica +105.64m)',
    dimensions: 'Suite 4.13m × 4.94m + Vestidor 2.07m × 2.00m + 2 Baños en Eje F–G + Deck 2',
    image: './assets/zonas/zona_06_suite_master_terraza_pa.jpg',
    cameraViewKey: 'dormitorio_suite',
    includedInCredit: '300M',
    summary:
      'Nivel privado superior apoyado sobre los 17 pilares de PB que ya están hormigonados hasta +2.88m. Aloja el Dormitorio Principal en Suite con salida al Deck 2 hacia el río, placares piso-techo en melamina 18mm y el bloque húmedo frontal sobre el Eje F–G (Vestidor, Baño en Suite y Baño 2 PA) con muro frontal cerrado en Eje G y banderolas altas.',
    materialsAndProducts: [
      'Cubierta Sándwich Termoacústica Isopanel PIR 50mm Cal. 26 + Cielorraso Acústico Durlock c/ Lana de Vidrio 50mm (-18 dB lluvia)',
      'Placares Empotrados Piso-Techo en MDF Melamina 18mm Masisa/Faplac con cajoneras y puertas corredizas suaves',
      'Inodoros One-Piece Deca/Incepa + Griferías Monocomando FV/Docol + Termocalefón Tokyo/James 80L en Eje F–G',
      'Aberturas Corredizas Blindex 10mm en Eje B mirando al Río Paraguay + Split Inverter 12.000 BTU Carrier/Midea'
    ],
    familyNotes:
      'Al elevar el dormitorio a +102.88m, Ruth y Leo superan los techos de tejas vecinos y despiertan mirando el Río Paraguay en silencio total (39 dB aun en tormenta tropical), alojando su sommier de 1.40m, mesas de luz, tocadores y vaporizador Xiaomi.'
  },
  {
    id: 'zona_07_subsuelo_salon_parrilla',
    zoneNumber: 7,
    title: 'Zona 7 — Gran Salón del Subsuelo (+97.66m), Lavadero en Pared Lateral y Parrillita al Patio',
    level: 'subsuelo',
    levelLabel: 'Nivel Subsuelo (+97.66m / -2.34m)',
    cota: '+97.66m (-2.34m bajo calle, 100.71 m² libres bajo Losa 1)',
    dimensions: '9.74m × 10.34m (100.71 m² cubiertos + Foso ventilación 1.50m)',
    image: './assets/zonas/zona_07_subsuelo_salon_parrilla.jpg',
    cameraViewKey: 'subsuelo_depto',
    includedInCredit: '300M',
    summary:
      'Aprovecha los 100.71 m² libres debajo de la Losa 1 (retirando el encofrado viejo junto a la Escalera 1) con ventilación cruzada natural por el foso frontal (z = 1.50m..3.00m) y blindaje hidrófugo en la medianera Eje 9. Integra el Gran Salón abierto sin mamparas intermedias, el Lavadero lateral y la Parrillita / Quincho inferior mirando al patio.',
    materialsAndProducts: [
      'Submuración Hidrófuga Medianera Eje 9 con Membrana Cementicia SikaTop-107 Seal + Revoque Sika-1 + Drenaje Francés Bidim',
      'Barrera de Vapor Polietileno 200 Micrones + Contrapiso y Lecherada Alisada de Cemento INC Vallemí CP II-F 32',
      'Lavadero Operativo (Pileta Deca/FV + Toma 20A IP55 p/ Lavarropas) + Puerta-Reja de Seguridad al pie de Escalera 1',
      'Parrilla de Ladrillo Refractario c/ Campana y Herraje Inox AISI 304 vinculada directamente al patio'
    ],
    familyNotes:
      'Desde el Día 1 Ruth y Leo tienen su lavarropas automático funcionando bajo techo en el subsuelo fresco y seco, un gran salón multiuso de 100 m² y el sector de asado abajo conectado directo al jardín sin ensuciar la sala ni la galería superior.'
  },
  {
    id: 'zona_08_patio_piscina_fondo',
    zoneNumber: 8,
    title: 'Zona 8 — Jardín Esmeralda (+96.20m), Piscina Transversal en el Fondo y Cloaca Autónoma',
    level: 'patio_piscina',
    levelLabel: 'Patio Inferior y Piscina (+96.20m / -3.80m)',
    cota: '+96.20m (z = 13.34m a 27.00m, Piscina en z = 23.15m..25.55m)',
    dimensions: '115.00 m² Jardín + Piscina Transversal 5.80m × 2.40m (Prof. 1.40m)',
    image: './assets/zonas/zona_08_patio_piscina_fondo.jpg',
    cameraViewKey: 'exterior_hero',
    includedInCredit: '440M',
    summary:
      'Expansión paisajística en el nivel inferior del terreno (+96.20m) con 115 m² de césped Esmeralda. Ubica en el corredor izquierdo (Ejes 8–9) la Cámara Séptica de 1.500L y el Pozo Ciego Absorbente (Ø1.80×3.50m) con acople para camión cisterna por la Escalera 1, liberando el fondo para la Piscina de H°A° en orientación transversal (5.80m × 2.40m, paralela al muro trasero).',
    materialsAndProducts: [
      'Piscina de Hormigón Armado HA-25 5.80×2.40m c/ Venecita/Epoxi + Filtro y Bomba Vulcano 3/4 HP + Solárium Atérmico Travertino',
      'Cámara Séptica 1.500L + Pozo Absorbente calzado con 1.200 Ladrillos Comunes de Tobatí Ø1.80×3.50m (Cero bomba eléctrica)',
      '115 m² de Panes de Césped Esmeralda sobre 10cm de Tierra Negra Vegetal Abonada con pendiente pluvial controlada',
      'Cámaras IP PoE Hikvision 4MP ColorVu + Reflectores LED Solares/IP65 cubriendo patio y medianeras'
    ],
    familyNotes:
      'El oasis privado de la familia en Asunción: Emma corre feliz por los 115 m² de césped Esmeralda, Serafina explora el jardín seguro amurallado y Ruth y Leo disfrutan de la piscina de 5.80×2.40m sabiendo que el sistema cloacal es 100% autónomo.'
  }
];


// Directorio de Casas de Materiales, Olerías Directas de Tobatí y Equipamiento de Paraguay indicadas por Leo para Cotización Directa
export const PROVEEDORES_PARAGUAY_REFERENCIA = [
  {
    id: "materiales_tobati_ig",
    nombre: "Materiales de Construcción Tobatí (@materialesdec_tobati)",
    url: "https://www.instagram.com/materialesdec_tobati/",
    whatsappUrl: "https://wa.me/595976203135",
    telefono: "+595 976 203135",
    icono: "🧱",
    especialidad: "Fábrica y entrega directa de Tobatí a obra en Asunción: Ladrillo común 1ra (Gs. 550/u), Ladrillo 6 agujeros/laminado (Gs. 1.250–1.300/u), Tejuelones y Tejas Cerámicas Coloniales/Prensadas",
    rubrosRecomendados: ["4.1 Mampostería Ladrillo Tobatí (18.000 u)", "1.1 Muro Contención 0.30m (5.150 u)", "3.1 Opción Tejas Cerámicas + Tejuelones Tobatí"]
  },
  {
    id: "hendyla_ladrillos_tobati",
    nombre: "Olería Tobatí Directo — Lote 10.000 Ladrillos 1ra (Hendyla / 0971-189199)",
    url: "https://www.hendyla.com/anuncios/ladrillos-comunes-de-tobati-de-primera-calidad-10-000-unidades-5500000-gs_264809.html",
    whatsappUrl: "https://wa.me/595971189199",
    telefono: "0971-189199",
    icono: "🚛",
    especialidad: "Lotes cerrados por camionada de 10.000 ladrillos comunes de Tobatí de 1ra calidad a Gs. 5.500.000 (Gs. 550/unidad) + flete directo a Itá Pytã Punta",
    rubrosRecomendados: ["Camionada 10.000 u = Gs. 5.500.000 (Gs. 550/u)", "1,8 Camionadas (18.000 u) p/ toda la casa = Gs. 9.900.000 + flete"]
  },
  {
    id: "clasipar_materiales_tobati",
    nombre: "Clasipar — Proveedores de Ladrillos, Tejas y Tejuelones de Tobatí",
    url: "https://clasipar.paraguay.com/servicios/construccion-reformas/materiales-de-construccion-de-tobati-ladrillos-comunes-huecos-prensados-tejas-tejuelones-1269529",
    icono: "🏺",
    especialidad: "Comparativa mayorista de ladrillos comunes (Gs. 550–700/u), ladrillos 3 agujeros (Gs. 950–1.000/u), huecos 6 agujeros (Gs. 1.250–1.300/u), tejas y tejuelones de Tobatí",
    rubrosRecomendados: ["Comparativa Ladrillo Común Visto vs. Hueco 6 Agujeros", "Tejas Coloniales y Tejuelones Cerámicos de Tobatí"]
  },
  {
    id: "tienda_naranja",
    nombre: "Tienda Naranja (Seller #235614 / Itaú Marketplace)",
    url: "https://tiendanaranja.com.py/marketplace/seller/profile/shop/seller_235614.com",
    icono: "🟠",
    especialidad: "Placares/Roperos, Muebles de Cocina/Alacenas, Biblioteca 4 estantes, Termocalefón 80L, Griferías e Iluminación (con financiación en cuotas)",
    rubrosRecomendados: ["10.4 Placares Dormitorios", "15.8 Biblioteca 4 Estantes 2m", "14.8 Alacenas y Muebles Cocina"]
  },
  {
    id: "corporacion_mercantil",
    nombre: "Corporación Mercantil S.A.",
    url: "https://corporacionmercantil.com.py/",
    icono: "🏛️",
    especialidad: "Porcelanatos 60×60 rectificados, Revestimientos Cerámicos, Loza Sanitaria (Inodoros Deca/Incepa, Bidets, Bachas) y Griferías FV/Docol",
    rubrosRecomendados: ["8.1 Piso Porcelanato 60×60", "10.1 Artefactos Sanitarios y Ducha", "10.2 Bacha y Grifería Monocomando Cocina"]
  },
  {
    id: "construshop",
    nombre: "Construshop Paraguay",
    url: "https://www.construshop.com.py/",
    icono: "🛠️",
    especialidad: "Impermeabilizantes Sika (Sikadur-32 epóxico, Sika-1 hidrófugo, membranas), Pinturas látex/acrílicas, Cemento, Tubos PVC Tigre y Ferretería técnica",
    rubrosRecomendados: ["13.3 Puente Epóxico Sikadur-32", "11.1–11.5 Plan Hidrófugo y Drenaje", "14.7 Pintura Integral Látex/Acrílica"]
  },
  {
    id: "emporio_construccion",
    nombre: "Emporio de la Construcción",
    url: "https://www.emporiodelaconstruccion.com/",
    icono: "🏗️",
    especialidad: "Materiales gruesos de obra: Varillas de hierro conformadas B500S, Cemento Vallemí/Yguazú, Piedra triturada, Arena lavada y Perfiles metálicos C de techo",
    rubrosRecomendados: ["1.2 Viga Fundación Muro", "2.1–2.2 Losa y Pilares 2do Piso", "3.2 Perfiles Metálicos y Cielorrasos"]
  }
];

// Inventario Real de Muebles, Electrodomésticos, Vehículo y Mascotas que Ruth y Leo YA TIENEN (Costo Gs. 0)
// + Distribución Vertical en los 3 Niveles desde el Día 1 y Adicionales Clave que SE DEBEN PRESUPUESTAR
export const INVENTARIO_MUEBLES_ACTUALES_LEO = {
  ocupantes: "Ruth y Leo + Emma (Caniche 🐩) y Serafina (Gata Calicó 🐈)",
  filosofiaMudanza:
    "Distribución Vertical Inteligente desde el Día 1 para Ruth y Leo (junto a Emma y Serafina): 1) En el 2do Piso (+102.88m) se ubican el Dormitorio en Suite y el Estudio/Costura con vista al Río Paraguay; 2) En la Planta Nivel Calle (+100.00m) queda una Gran Sala de Estar, Comedor, Biblioteca de 4 estantes de 2m y Cocina Integrada, más la explanada de estacionamiento para la SUV Chery T2 Pro 2026; 3) En el Subsuelo (+97.66m, con 100.71 m² libres debajo de la Losa 1 y protegido por el Pasillo Antihumedad de 1.50m) funcionan desde el primer día el Lavadero y el Depósito con salida al jardín.",
  itemsPropiosCostoCero: [
    { nro: 1, categoria: "Nivel Calle (Sala/Comedor)", item: "Mesa y sillas de sala (6 sillas)", medidas: "1.60m × 0.90m (área con sillas: 2.60m × 1.90m)", ubicacion3D: "Nivel Calle (+100.00m): Comedor Principal amplio", costoGs: 0 },
    { nro: 2, categoria: "Nivel Calle (Sala/Estar)", item: "Sofá de 4 piezas (1 de 3 asientos + 3 sillones individuales)", medidas: "Sofá 3 cuerpos 2.10m × 0.90m + 3 sillones de 0.80m × 0.80m", ubicacion3D: "Nivel Calle (+100.00m): Gran Sala de Estar mirando a Galería L1", costoGs: 0 },
    { nro: 3, categoria: "Nivel Calle (Sala/Estar)", item: "Mesa ratona de sala", medidas: "1.00m × 0.60m × 0.42m h", ubicacion3D: "Nivel Calle (+100.00m): Centro del living entre sofá 3 cuerpos y sillones", costoGs: 0 },
    { nro: 4, categoria: "Nivel Calle (Multimedia)", item: "Televisor de 32 pulgadas", medidas: "0.73m × 0.43m (con toma RJ45 Cat6 + energía)", ubicacion3D: "Nivel Calle (+100.00m): Sobre mesa con patas de máquina de coser en Sala", costoGs: 0 },
    { nro: 5, categoria: "2do Piso (Estudio/Costura)", item: "Máquina de coser antigua", medidas: "0.85m × 0.45m × 0.78m h", ubicacion3D: "2do Piso (+102.88m): Área de Estudio y Costura con luz natural", costoGs: 0 },
    { nro: 6, categoria: "Nivel Calle (Recibidor)", item: "Mesa de florero y libros cuadrada", medidas: "0.60m × 0.60m × 0.70m h", ubicacion3D: "Nivel Calle (+100.00m): Recibidor junto a Puerta Principal Eje G", costoGs: 0 },
    { nro: 7, categoria: "Nivel Calle (Sala)", item: "Mesa de patas de máquina de coser con tabla arriba", medidas: "0.95m × 0.50m × 0.76m h", ubicacion3D: "Nivel Calle (+100.00m): Mueble de apoyo para TV 32\" / Arrime en Sala", costoGs: 0 },
    { nro: 8, categoria: "2do Piso (Dormitorio Suite)", item: "Dos tocadores de dormitorio", medidas: "2 unidades de 0.90m × 0.45m c/u", ubicacion3D: "2do Piso (+102.88m): Dormitorio en Suite de Ruth y Leo", costoGs: 0 },
    { nro: 9, categoria: "2do Piso (Dormitorio Suite)", item: "Dos mesas de luz", medidas: "2 unidades de 0.45m × 0.40m c/u", ubicacion3D: "2do Piso (+102.88m): A ambos lados del Sommier de 1.40m en Suite", costoGs: 0 },
    { nro: 10, categoria: "2do Piso (Dormitorio Suite)", item: "1 Sommier de 1,40m (Matrimonial Ruth & Leo)", medidas: "1.40m ancho × 1.90m largo", ubicacion3D: "2do Piso (+102.88m): Suite Principal con balcón y vista al Río Paraguay", costoGs: 0 },
    { nro: 11, categoria: "2do Piso (Estudio/Huéspedes)", item: "1 Cama de 1 plaza", medidas: "0.90m ancho × 1.90m largo", ubicacion3D: "2do Piso (+102.88m): Sector Estudio / Descanso en Planta Alta", costoGs: 0 },
    { nro: 12, categoria: "2do Piso (Home-Office)", item: "Dos escritorios pequeños", medidas: "2 unidades de 1.00m × 0.50m c/u", ubicacion3D: "2do Piso (+102.88m): Home-Office Doble de Ruth y Leo con red Cat6", costoGs: 0 },
    { nro: 13, categoria: "2do Piso (Home-Office)", item: "1 Silla de oficina ergonómica", medidas: "0.60m × 0.60m", ubicacion3D: "2do Piso (+102.88m): Escritorio principal en Planta Alta", costoGs: 0 },
    { nro: 14, categoria: "Nivel Calle (Cocina)", item: "1 Mueble de cocina para microondas, horno y guardar pequeñas cosas", medidas: "0.70m × 0.45m × 1.65m h", ubicacion3D: "Nivel Calle (+100.00m): Columna auxiliar en Cocina Integrada", costoGs: 0 },
    { nro: 15, categoria: "Nivel Calle (Cocina)", item: "1 Heladera", medidas: "0.65m × 0.70m × 1.75m h", ubicacion3D: "Nivel Calle (+100.00m): Cocina Integrada con circuito independiente", costoGs: 0 },
    { nro: 16, categoria: "Subsuelo (Lavadero)", item: "1 Lavarropas automático", medidas: "0.60m × 0.60m × 0.85m h", ubicacion3D: "Subsuelo (+97.66m): Lavadero y Depósito bajo Losa 1 (100 m² libres)", costoGs: 0 },
    { nro: 17, categoria: "Nivel Calle (Cocina)", item: "1 Cocina con garrafa", medidas: "0.60m × 0.60m + espacio p/ garrafa 10/13kg", ubicacion3D: "Nivel Calle (+100.00m): Junto a Mesada Húmeda en Cocina", costoGs: 0 },
    { nro: 18, categoria: "Climatización / Salud", item: "1 Purificador de aire Xiaomi", medidas: "0.24m × 0.24m × 0.52m h (Wi-Fi)", ubicacion3D: "Nivel Calle (Sala) / 2do Piso (Suite Ruth & Leo)", costoGs: 0 },
    { nro: 19, categoria: "Climatización / Salud", item: "1 Vaporizador / Humidificador de agua Xiaomi", medidas: "0.20m × 0.20m × 0.35m h", ubicacion3D: "2do Piso (+102.88m): Dormitorio en Suite Ruth & Leo", costoGs: 0 },
    { nro: 20, categoria: "Nivel Calle (Cocina)", item: "1 Microondas", medidas: "0.48m × 0.36m × 0.29m h", ubicacion3D: "Nivel Calle (+100.00m): En el mueble auxiliar propio de cocina (toma 20A)", costoGs: 0 },
    { nro: 21, categoria: "Nivel Calle (Cocina)", item: "1 Air Fryer de 6L Xiaomi", medidas: "0.30m × 0.35m × 0.32m h (1500W)", ubicacion3D: "Nivel Calle (+100.00m): Sobre Mesada de Granito en Cocina (toma 20A)", costoGs: 0 },
    { nro: 22, categoria: "Nivel Calle (Galería L1)", item: "1 Parrilla portátil (ya disponible)", medidas: "0.95m × 0.55m rodante", ubicacion3D: "Nivel Calle (+99.55m): Galería Panorámica L1 al Río (ahorra Gs. 7,5M)", costoGs: 0 },
    { nro: 23, categoria: "Cochera Frontal (Nivel Calle)", item: "SUV Chery T2 Pro 2026 (Vehículo de Ruth y Leo)", medidas: "4.78m largo × 2.00m ancho × 1.88m alto", ubicacion3D: "Cochera Frontal (+100.00m, z=-4.00m a +1.50m sobre Muro de Contención)", costoGs: 0 },
    { nro: 24, categoria: "Mascotas de la Casa", item: "Emma (Caniche 🐩) y Serafina (Gata Calicó 🐈)", medidas: "Habitantes ilustres de los 3 niveles y del jardín", ubicacion3D: "Sala de Estar / Galería L1 / Jardín con Césped", costoGs: 0 },
    { nro: 25, categoria: "Decoración / Botánica", item: "Floreros chicos con plantas Espada de San Jorge (Sansevieria)", medidas: "Macetas y floreros cerámicos de 0.20m a 0.45m h", ubicacion3D: "Mesa cuadrada recibidor, Biblioteca de 4 estantes de 2m y Galería L1", costoGs: 0 }
  ],
  adicionalesClavePresupuestados: [
    {
      idPartida: "cocina_mesada_bacha_esencial",
      nombre: "1. Mesada Húmeda de Cocina en Nivel Calle con Bacha Doble, Grifería FV y Tomas 20A",
      montoGs: 4850000,
      escalonIncluido: "Incluido SIEMPRE desde Crédito 300M (Esencial)",
      motivo: "Aunque Ruth y Leo llevan cocina con garrafa, heladera, microondas, Air Fryer 6L y 1 mueble auxiliar pequeño, necesitan obligatoriamente la mesada de granito con bacha doble y desagüe en Nivel Calle."
    },
    {
      idPartida: "placares_dormitorios_adicional",
      nombre: "2. Placares / Guardarropas Empotrados en 2do Piso (Suite Sommier 1.40m + Estudio/Cama 1 Plaza)",
      montoGs: 9600000,
      escalonIncluido: "Incluido SIEMPRE desde Crédito 300M (Esencial • Ref. compacta Gs. 7.800.000)",
      motivo: "En el inventario de mudanza hay 2 tocadores y 2 mesas de luz para el 2do piso, pero 0 placares o roperos (Cotizable en Tienda Naranja #235614 o carpintería a medida)."
    },
    {
      idPartida: "biblioteca_4_estantes_2m",
      nombre: "3. Biblioteca Instalada con 4 Estantes de 2,00 Metros cada uno (8,00 ml en Madera / Melamina 25mm)",
      montoGs: 3200000,
      escalonIncluido: "Incluido SIEMPRE desde Crédito 300M (Pedido explícito de Leo)",
      motivo: "4 estantes de 2.00 metros de largo cada uno instalados en Sala / Estudio para todos los libros y floreros con plantas Espada de San Jorge."
    },
    {
      idPartida: "edifica_equipamiento_cocina",
      nombre: "4. Amoblamiento Adicional de Cocina en Nivel Calle: Bajo-Mesada, Alacenas e Isla (Edifica Equip. #1 / Compacto Gs. 8,5M)",
      montoGs: 17543750,
      escalonIncluido: "Incluido desde Crédito 350M y 440M (Opción compacta Gs. 8.500.000)",
      motivo: "Amplía la capacidad de guardado de la gran cocina integrada de Planta Baja complementando el mueble pequeño de microondas/horno que ya tienen."
    }
  ]
};

// Plan Maestro Evolutivo por Etapas para Ruth y Leo (2 Personas) — 3 Niveles Funcionales desde el Día 1
export const PLAN_MAESTRO_RUTH_Y_LEO = {
  titulo: "Plan Maestro Ruth y Leo (2 Personas): 2do Piso Dormitorio/Estudio • Nivel Calle Sala/Comedor/Cocina • Subsuelo Lavadero/Depósito",
  reglaDeOro:
    "Desde el Día 1 se aprovechan los 3 niveles sin obras estructurales futuras: 1) En el 2do Piso (+102.88m) va el Dormitorio en Suite de Ruth y Leo + Estudio con vista al Río Paraguay; 2) En Planta Nivel Calle (+100.00m) queda una Gran Sala de Estar (Sofá 4 piezas), Comedor (6 sillas) y Cocina Integrada amplia; 3) En el Subsuelo (+97.66m, donde hoy están 100% libres los 100.71 m² bajo la Losa 1 y protegidos por el Pasillo Antihumedad de 1.50m detrás del Muro de Contención en z=+1.50m) se instalan el Lavadero y el Depósito.",
  accesoIndependienteFuturo:
    "El Muro de Contención de Cochera en z=+1.50m deja un Pasillo / Cámara de Aire de 1.50m (z=+1.50m a +3.00m frente al Eje G) que evita al 100% que la humedad del relleno toque la pared del subsuelo, mientras que la Puerta de Servicio sobre Eje G conecta directo con la Escalera 1 hacia el Lavadero/Depósito en Subsuelo y el 2do Piso.",
  etapasPorCredito: [
    {
      credito: "Crédito 300 Millones Gs.",
      foco: "3 Niveles Operativos Día 1: Dormitorio en 2do Piso + Sala/Comedor/Cocina en Nivel Calle + Lavadero/Depósito en Subsuelo",
      detalle: "Levanta la 2da Losa (+102.88m) y el Techo (+105.64m), ejecuta el Muro de Contención con su Pasillo Antihumedad de 1.50m, y habilita el Dormitorio con Baño y Placares en 2do Piso, la Sala-Comedor-Cocina en Nivel Calle y el Lavadero/Depósito en los 100.71 m² libres del Subsuelo."
    },
    {
      credito: "Crédito 350 Millones Gs.",
      foco: "+ Cocina Full con Alacenas/Isla + Ventanales Blindex al Río + Puerta Principal/Servicio + Jardín Césped",
      detalle: "Suma el Amoblamiento Completo de Cocina (Gs. 17,5M) en Nivel Calle, los 24 m² de Ventanales Blindex mirando al Río Paraguay, la Puerta Principal Pivotante + Puerta de Servicio en Eje G, el Jardín Parquizado con Césped Esmeralda (115 m²) y las divisiones interiores de PA."
    },
    {
      credito: "Crédito 440 Millones Gs.",
      foco: "+ Blindex Suite 2do Piso + Rejas Balcones + Deck Galería L1 + Pintura Integral + Portón Automatizado + Cloaca Subsuelo",
      detalle: "Completa los ventanales Blindex del Dormitorio/Estudio en 2do Piso, las Rejas de seguridad de los balcones (19.5 ml), el Deck de la Galería Panorámica L1, la Pintura Integral (320 m²), el Portón Automatizado y el sistema cloacal completo del Subsuelo."
    }
  ]
};

// Selector de Proyectos Arquitectónicos para Cálculo Métrico por Dimensión Real
export const PROYECTOS_COMPUTO_DIMENSIONES = {
  proy_adaptacion_pb_pa: {
    id: "proy_adaptacion_pb_pa",
    nombre: "1. Proyecto Ruth & Leo (2do Piso: Dormitorio y Estudio | Nivel Calle: Sala, Comedor y Cocina | Subsuelo: Lavadero y Depósito • Recomendado)",
    superficieTotalM2: 178.42,
    resumenDimensiones: "2do Piso Dormitorio/Estudio (54.0 m²) + Nivel Calle Sala/Comedor/Cocina (91.0 m² + Galería 33.42 m²) + Subsuelo Libre 100.71 m² (Lavadero/Depósito + Pasillo Antihumedad 1.50m)",
    descripcion: "Distribución ideal definida por Leo para 2 personas (Ruth y Leo): Dormitorio en Suite y Estudio desde el primer día en el 2do Piso (+102.88m con vista al Río); Sala de Estar (sofá 4 pzas), Comedor (6 sillas) y Cocina amplia en Nivel Calle (+100.00m); y Lavadero + Depósito en los 100.71 m² libres del Subsuelo (+97.66m) protegidos por el Pasillo Antihumedad de 1.50m detrás del muro de contención.",
    cantidadesPorPartida: {
      contencion_cochera: 46.70,
      viga_fundacion_muro: 14.50,
      aislacion_relleno_cochera: 1,
      losa_segunda_parte: 54.00,
      hormigon_vigas_losa: 11.50,
      cubierta_metalica: 86.00,
      estructura_metalica_techo: 1,
      desagues_canaletas: 1,
      mamposteria_exterior: 145.00,
      revoque_exterior_impermeable: 145.00,
      puertas_seguridad_provisoria: 1,
      galeria_voladizo_deck: 33.42,
      parrilla_ducto: 1,
      vidrios_templados_galeria: 24.00,
      instalaciones_electricas_embutidas: 1,
      instalaciones_sanitarias_desagues: 1,
      pisos_porcelanato: 80.00,
      porton_cochera_automatizado: 1,
      bano_suite_sanitarios: 1,
      cocina_mesada_bacha_esencial: 1,
      lavadero_habitable: 1,
      placares_dormitorios_adicional: 2,
      hidro_muro_vertical: 46.70,
      hidro_drenaje_frances: 18.00,
      hidro_capa_horizontal: 28.50,
      hidro_membrana_terraza: 42.00,
      hidro_barrera_vapor: 85.00,
      debil_cableado_cat6: 8,
      debil_cctv_ip: 1,
      debil_portero_visor: 1,
      debil_wifi_mesh: 1,
      debil_alarma_barreras: 1,
      debil_domotica_luces: 6,
      forense_aislacion_medianera_eje9: 1,
      forense_cloaca_subsuelo_bombeo: 1,
      forense_puente_adherencia_epoxico: 1,
      forense_omision_fila9_lozarrap: 38.00,
      forense_tabiqueria_liviana_apeo: 28.00,
      forense_barandas_seguridad: 16.00,
      edifica_vereda_frontal: 1,
      edifica_caminero_vehicular: 21.00,
      edifica_caminero_peatonal: 7.50,
      sobreelevacion_muralla_lateral_3x2: 6.00,
      edifica_muralla_frontal: 9.89,
      edifica_cielorraso_estar: 38.00,
      edifica_aberturas_madera: 6,
      edifica_pintura_integral: 320.00,
      edifica_equipamiento_cocina: 1,
      puertas_acceso_principal_servicio: 2,
      blindex_habitaciones: 18.50,
      rejas_balcones_seguridad: 19.50,
      jardin_cesped_patio: 115.00,
      quincho_patio_subsuelo: 24.00,
      piscina_patio_oficial: 11.40,
      cielorraso_acustico_2dopiso: 54.00,
      biblioteca_4_estantes_2m: 1,
      supervision_direccion_tecnica_banco: 1,
      limpieza_volquetes_contingencia_obra: 1
    }
  },
  proy_lgrb_lozarrap: {
    id: "proy_lgrb_lozarrap",
    nombre: "2. Variante LG-RB Compacta (Dormitorio en Nivel Calle + Entrepiso Lozarrap 34 m² • 152 m²)",
    superficieTotalM2: 152.00,
    resumenDimensiones: "PB Compacta (84.5 m²) + Galería L1 (33.42 m²) + Entrepiso Lozarrap (34.0 m²) + Subsuelo Lavadero",
    descripcion: "Alternativa basada en la planilla LG-RB original con entrepiso Lozarrap reducido de 34 m² y menor metraje de mampostería y pintura.",
    cantidadesPorPartida: {
      contencion_cochera: 46.70,
      viga_fundacion_muro: 14.50,
      aislacion_relleno_cochera: 1,
      losa_segunda_parte: 34.00,
      hormigon_vigas_losa: 8.80,
      cubierta_metalica: 72.00,
      estructura_metalica_techo: 1,
      desagues_canaletas: 1,
      mamposteria_exterior: 122.00,
      revoque_exterior_impermeable: 122.00,
      puertas_seguridad_provisoria: 1,
      galeria_voladizo_deck: 33.42,
      parrilla_ducto: 1,
      vidrios_templados_galeria: 20.50,
      instalaciones_electricas_embutidas: 1,
      instalaciones_sanitarias_desagues: 1,
      pisos_porcelanato: 68.00,
      porton_cochera_automatizado: 1,
      bano_suite_sanitarios: 1,
      cocina_mesada_bacha_esencial: 1,
      lavadero_habitable: 1,
      placares_dormitorios_adicional: 2,
      hidro_muro_vertical: 46.70,
      hidro_drenaje_frances: 18.00,
      hidro_capa_horizontal: 24.00,
      hidro_membrana_terraza: 38.00,
      hidro_barrera_vapor: 75.00,
      debil_cableado_cat6: 6,
      debil_cctv_ip: 1,
      debil_portero_visor: 1,
      debil_wifi_mesh: 1,
      debil_alarma_barreras: 1,
      debil_domotica_luces: 4,
      forense_aislacion_medianera_eje9: 1,
      forense_cloaca_subsuelo_bombeo: 1,
      forense_puente_adherencia_epoxico: 1,
      forense_omision_fila9_lozarrap: 38.00,
      forense_tabiqueria_liviana_apeo: 22.00,
      forense_barandas_seguridad: 16.00,
      edifica_vereda_frontal: 1,
      edifica_caminero_vehicular: 21.00,
      edifica_caminero_peatonal: 7.50,
      sobreelevacion_muralla_lateral_3x2: 6.00,
      edifica_muralla_frontal: 9.89,
      edifica_cielorraso_estar: 32.00,
      edifica_aberturas_madera: 5,
      edifica_pintura_integral: 265.00,
      edifica_equipamiento_cocina: 1,
      puertas_acceso_principal_servicio: 2,
      blindex_habitaciones: 14.00,
      rejas_balcones_seguridad: 16.00,
      jardin_cesped_patio: 115.00,
      quincho_patio_subsuelo: 20.00,
      piscina_patio_oficial: 11.40,
      cielorraso_acustico_2dopiso: 34.00,
      biblioteca_4_estantes_2m: 1,
      supervision_direccion_tecnica_banco: 1,
      limpieza_volquetes_contingencia_obra: 1
    }
  },
  proy_completo_subsuelo: {
    id: "proy_completo_subsuelo",
    nombre: "3. Proyecto General Completo (100 m² de Subsuelo + Nivel Calle + 2do Piso 100% Cerrados • 255 m²)",
    superficieTotalM2: 255.13,
    resumenDimensiones: "Subsuelo Completo Libre (100.71 m²) + Nivel Calle (91.0 m²) + Galería (33.42 m²) + 2do Piso (54.0 m²)",
    descripcion: "Aprovecha el 100% de los 100.71 m² libres debajo de la Losa 1 (protegidos por el Pasillo Antihumedad de 1.50m) para sumar, además de Lavadero y Depósito, el Quincho y Departamento de Huéspedes completo en Subsuelo.",
    cantidadesPorPartida: {
      contencion_cochera: 46.70,
      viga_fundacion_muro: 14.50,
      aislacion_relleno_cochera: 1,
      losa_segunda_parte: 54.00,
      hormigon_vigas_losa: 11.50,
      cubierta_metalica: 86.00,
      estructura_metalica_techo: 1,
      desagues_canaletas: 1,
      mamposteria_exterior: 210.00,
      revoque_exterior_impermeable: 210.00,
      puertas_seguridad_provisoria: 1,
      galeria_voladizo_deck: 33.42,
      parrilla_ducto: 1,
      vidrios_templados_galeria: 28.50,
      instalaciones_electricas_embutidas: 1.35,
      instalaciones_sanitarias_desagues: 1.35,
      pisos_porcelanato: 128.00,
      porton_cochera_automatizado: 1,
      bano_suite_sanitarios: 1.5,
      cocina_mesada_bacha_esencial: 1,
      lavadero_habitable: 1,
      placares_dormitorios_adicional: 3,
      hidro_muro_vertical: 46.70,
      hidro_drenaje_frances: 24.00,
      hidro_capa_horizontal: 42.00,
      hidro_membrana_terraza: 42.00,
      hidro_barrera_vapor: 85.00,
      debil_cableado_cat6: 12,
      debil_cctv_ip: 1,
      debil_portero_visor: 1,
      debil_wifi_mesh: 1,
      debil_alarma_barreras: 1,
      debil_domotica_luces: 8,
      forense_aislacion_medianera_eje9: 1,
      forense_cloaca_subsuelo_bombeo: 1,
      forense_puente_adherencia_epoxico: 1,
      forense_omision_fila9_lozarrap: 38.00,
      forense_tabiqueria_liviana_apeo: 36.00,
      forense_barandas_seguridad: 21.00,
      edifica_vereda_frontal: 1,
      edifica_caminero_vehicular: 21.00,
      edifica_caminero_peatonal: 7.50,
      sobreelevacion_muralla_lateral_3x2: 6.00,
      edifica_muralla_frontal: 9.89,
      edifica_cielorraso_estar: 52.00,
      edifica_aberturas_madera: 8,
      edifica_pintura_integral: 460.00,
      edifica_equipamiento_cocina: 1,
      puertas_acceso_principal_servicio: 2,
      blindex_habitaciones: 24.00,
      rejas_balcones_seguridad: 24.00,
      jardin_cesped_patio: 115.00,
      quincho_patio_subsuelo: 28.00,
      piscina_patio_oficial: 11.40,
      cielorraso_acustico_2dopiso: 54.00,
      biblioteca_4_estantes_2m: 1,
      supervision_direccion_tecnica_banco: 1,
      limpieza_volquetes_contingencia_obra: 1
    }
  },
  proy_editor_cad_vivo: {
    id: "proy_editor_cad_vivo",
    nombre: "4. Diseño Personalizado desde tu Editor CAD 2D en Vivo (Metraje Dinámico)",
    superficieTotalM2: 178.42,
    resumenDimensiones: "Sincronizado en tiempo real con las medidas (Ancho × Largo) de tus ambientes en el Editor CAD 2D",
    descripcion: "Calcula automáticamente los m² de pisos, mampostería, revoques, pintura y losa leyendo las dimensiones exactas que modifiques o arrastres en el Editor Interactivo de Planos 2D.",
    esDinamicoCAD: true,
    cantidadesPorPartida: {}
  }
};

// Cuadro Resumen de Garantía de Ejecución por Escalón de Crédito Bancario (300M / 350M / 440M) — Plan Ruth & Leo
export const GARANTIA_EJECUCION_CREDITOS = [
  {
    id: "escenario300",
    creditoLabel: "Crédito 300 Millones Gs. (Cuota: Gs. 3.529.773/mes c/ seguros)",
    montoCreditoGs: 300000000,
    cuotaMensualConSegurosGs: 3529773,
    totalPagado15AniosGs: 635000000,
    costoFinancieroGs: 335000000,
    inversionBaseGs: 311337534,
    inversionOptimizadaGs: 294885034,
    ahorroCombinadoGs: 16452500,
    habitabilidadGarantizada: "✅ 2do Piso: Dormitorio Suite + Placares | Nivel Calle: Sala, Comedor, Biblioteca 4 Estantes 2m y Cocina | Subsuelo: Lavadero y Depósito + Alarma Pet-Immune + Vereda/Basurero + Muralla 3m×2m",
    alcanceEstructural: "100% Estructura Pesada Terminada: 2da Losa (+102.88m) + Techo (+105.64m) + Muro Contención c/ Pasillo Antihumedad de 1.50m + Rehabilitación Losa 1 Expuesta",
    estrategiaPresupuesto: "Incluye Rehabilitación de Losa 1 Expuesta al Sol, Sobreelevación de Muralla 3m×2m, Vereda + Basurero y Alarma Completa Pet-Immune dentro de los 300M."
  },
  {
    id: "escenario350",
    creditoLabel: "Crédito 350 Millones Gs. (Cuota: Gs. 4.118.068/mes c/ seguros)",
    montoCreditoGs: 350000000,
    cuotaMensualConSegurosGs: 4118068,
    totalPagado15AniosGs: 741000000,
    costoFinancieroGs: 391000000,
    inversionBaseGs: 367251284,
    inversionOptimizadaGs: 345818784,
    ahorroCombinadoGs: 21432500,
    habitabilidadGarantizada: "✅ + Alacenas/Isla de Cocina + Ventanales Blindex al Río + Puerta Principal y de Servicio + Jardín Césped",
    alcanceEstructural: "Todo el Crédito 300M + Cocina Full Edifica + Blindex Eje B + Puerta Principal y de Servicio (Eje G) + Jardín 115 m² + Tabiquería PA",
    estrategiaPresupuesto: "Suma el Amoblamiento Completo de Cocina, la Puerta de Servicio alineada a Escalera 1 y el Jardín de césped."
  },
  {
    id: "escenario440",
    creditoLabel: "Crédito 440 Millones Gs. (Cuota: Gs. 5.177.000/mes c/ seguros)",
    montoCreditoGs: 440000000,
    cuotaMensualConSegurosGs: 5177000,
    totalPagado15AniosGs: 932000000,
    costoFinancieroGs: 492000000,
    inversionBaseGs: 456009284,
    inversionOptimizadaGs: 432576784,
    ahorroCombinadoGs: 23432500,
    habitabilidadGarantizada: "✅ + Blindex Suite 2do Piso + Rejas Balcones + Deck Galería L1 + Pintura Integral + Portón Automatizado + Cloaca Subsuelo",
    alcanceEstructural: "Todo el Crédito 350M + Blindex Dormitorios + Rejas Balcones + Portón Automatizado + Deck L1 + Pintura + Cloaca Subsuelo",
    estrategiaPresupuesto: "Completa las aberturas Blindex del 2do Piso, rejas de balcones, deck panorámico y pintura integral dentro del rango del crédito de 440M Gs."
  }
];

// Metadatos Urbanos y Satelitales Exactos (WGS84 desde UTM 21S 433024E, 7203554N — GEO-STAN #2956)
export const CONTEXTO_URBANO_SATELITAL = {
  direccion: "Calle Tte. Guillermo Arias (cul-de-sac al Oeste de Pedro Melo de Portugal)",
  barrio: "Itá Pytã Punta",
  ciudad: "Asunción, Paraguay",
  coordenadasDecimales: { lat: -25.282799, lng: -57.665301 },
  coordenadasUTM: { zone: "21S", easting: 433024, northing: 7203554, datum: "WGS84" },
  dimensionesLote: "9.89 metros de frente (9.74m estructural) x 31.00 metros de fondo (306.59 m²)",
  implantacionUrbanaReal:
    "Ubicada en el tramo sin salida (cul-de-sac) de la Calle Tte. Guillermo Arias pasando Pedro Melo de Portugal hacia el Oeste. Al Sur colinda con el galpón industrial de Molinos Harineros; al Este, Oeste y Norte está rodeada de casas barriales bajas con techos de tejas coloniales; y entre 85 y 96 metros al Noroeste se abren el Mirador Itá Pytã Punta y la curva del Río Paraguay. Por esta razón, levantar la Losa de Segundo Piso a +102.88m (+2.88m) y el Techo a +105.64m (+5.64m) permite que el Dormitorio en Suite de Ruth y Leo en el 2do Piso supere los techos vecinos y capture la visual panorámica limpia hacia el río.",
  streetViewUrl: "https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=-25.282799,-57.665301&heading=315&pitch=5",
  mapsUrl: "https://www.google.com/maps/place/25%C2%B016'58.1%22S+57%C2%B039'55.1%22W/@-25.282799,-57.665301,19z/data=!3m1!1e3",
  osmUrl: "https://www.openstreetmap.org/#map=19/-25.282799/-57.665301",
  caracteristicasEntorno: [
    "Tramo sin salida (cul-de-sac) de Calle Tte. Guillermo Arias al Oeste de Pedro Melo de Portugal, con tránsito local tranquilo.",
    "Subsuelo con los 100.71 m² (9.74m × 10.34m) totalmente libres debajo de la Losa 1 + Pasillo Antihumedad de 1.50m entre el Muro de Contención (z=+1.50m) y la pared frontal (Eje G z=+3.00m).",
    "Mirador Itá Pytã Punta y curva del Río Paraguay a ~85–96m al Noroeste: el Dormitorio de Ruth y Leo en el 2do Piso (+102.88m) supera las cumbreras vecinas logrando vista limpia al río.",
    "Desnivel topográfico real de -3.80m desde la calle (+100.00m) hasta el patio inferior (+96.20m), con zapatas fundadas a +95.36m (-4.64m)."
  ]
};

// Escenarios Progresivos por Escalón de Crédito BNF (Banco Nacional de Fomento) — Plan Maestro Ruth y Leo
export const ITEMS_CREDITO_300M = [
  "contencion_cochera",
  "viga_fundacion_muro",
  "aislacion_relleno_cochera",
  "losa_segunda_parte",
  "hormigon_vigas_losa",
  "cubierta_metalica",
  "estructura_metalica_techo",
  "desagues_canaletas",
  "mamposteria_exterior",
  "revoque_exterior_impermeable",
  "puertas_seguridad_provisoria",
  "sobreelevacion_muralla_lateral_3x2",
  "edifica_vereda_frontal",
  "porton_cochera_automatizado",
  "instalaciones_electricas_embutidas",
  "instalaciones_sanitarias_desagues",
  "bano_suite_sanitarios",
  "cocina_mesada_bacha_esencial",
  "lavadero_habitable",
  "biblioteca_4_estantes_2m",
  "hidro_muro_vertical",
  "hidro_drenaje_frances",
  "hidro_capa_horizontal",
  "hidro_membrana_terraza",
  "hidro_barrera_vapor",
  "debil_cableado_cat6",
  "debil_portero_visor",
  "debil_alarma_barreras",
  "forense_aislacion_medianera_eje9",
  "forense_cloaca_subsuelo_bombeo",
  "forense_puente_adherencia_epoxico",
  "forense_omision_fila9_lozarrap",
  "forense_tabiqueria_liviana_apeo",
  "forense_barandas_seguridad"
];

export const ITEMS_CREDITO_350M = [
  ...ITEMS_CREDITO_300M,
  "pisos_porcelanato",
  "placares_dormitorios_adicional",
  "edifica_aberturas_madera",
  "jardin_cesped_patio",
  "edifica_caminero_vehicular"
];

export const ITEMS_CREDITO_440M = [
  ...ITEMS_CREDITO_350M,
  "edifica_equipamiento_cocina",
  "puertas_acceso_principal_servicio",
  "vidrios_templados_galeria",
  "blindex_habitaciones",
  "rejas_balcones_seguridad",
  "galeria_voladizo_deck"
];

export const ESCENARIOS_INVERSION = {
  hoy_en_obra: {
    id: "hoy_en_obra",
    nombre: "Hoy en Obra (163,8M): 17 Pilares PB hasta +2.88m + Losa L1/L4 (c/ Vacío 38 m²) + Escalera 1 Eje 8–9",
    montoObjetivoGs: 163820972,
    montoAbonadoGs: 142313711,
    montoEstimadoGs: 163820972,
    costoM2ConstruidoGs: 1590495,
    semaforo: "ok",
    objetivoPrincipal: "Estado real certificado s/ Acta 29/12/2025 (JIVESA S.A. / PROBETI #17671): 20 pilares en Subsuelo y 17 pilares de PB ya hormigonados hasta +2.88m (+102.88m), 14 zapatas (-4.64m), vigas VC.T-1, Losa L1 (Galería) y Losa L4 (Cocina/Comedor) hormigonadas dejando el vacío abierto de 38.00 m² entre vigas sobre el Estar Social (a cerrar con Loza Rap), y Escalera 1 terminada en Eje 8–9.",
    itemsIncluidos: [],
    ventajas: [
      "Los 17 pilares principales de Planta Baja ya están hormigonados hasta +2.88m (+102.88m), listos para recibir las vigas y la Losa de Planta Alta",
      "Escalera 1 de H°A° sobre pared derecha Eje 8–9 (x = -4.87m..-3.90m) ya construida conectando Subsuelo (-2.34m) y Planta Baja (+0.00m)",
      "Losa L1 (Galería 33.42 m²) y Losa L4 (Cocina/Comedor 28.66 m²) ya hormigonadas con resistencia PROBETI 315 kg/cm² (resta cerrar el vacío de 38.00 m² con Loza Rap en Etapa 1)"
    ]
  },
  escenario300: {
    id: "escenario300",
    nombre: "Crédito BNF 300 Millones: Cierre 3 Niveles + 2do Piso + Sala/Cocina PB + Subsuelo c/ Lecherada y Lavadero",
    montoObjetivoGs: 300000000,
    montoEstimadoGs: 298227534,
    costoM2ConstruidoGs: 1671491,
    semaforo: "ok",
    objetivoPrincipal: "Crédito BNF de Gs. 300 Millones (Gs. 298,23M presupuestados): 1) Cierra el vacío de 38 m² con Loza Rap en Losa 1, construye la Losa del 2do Piso (+102.88m), la Escalera 2 (Eje 1–2) y el Techo (+105.64m) con canaletas que desaguan hacia el frente; 2) Levanta la mampostería perimetral, Muro de Contención con Piso de Rejilla Electroforjada y Cámara Séptica + Pozo Ciego en el fondo; 3) Habilita Baño, Cocina con Mesada/Bacha, Biblioteca 4 estantes, Lavadero en pared izquierda del Subsuelo y Salón con lecherada.",
    itemsIncluidos: ITEMS_CREDITO_300M,
    ventajas: [
      "Cierra el 100% de la estructura pesada de los 3 niveles (incluyendo los 38 m² de Loza Rap, Losa 2do Piso, Escalera 2 y Techo con desagüe pluvial hacia el frente)",
      "Conexión directa de agua corriente ESSAP desde el medidor al costado del portón (x = -3.85m, sin gasto en tanque) + Cámara Séptica y Pozo Ciego en el fondo",
      "Subsuelo nivelado con piso de lecherada de cemento, Gran Salón abierto y Lavadero instalado contra la pared izquierda (+X)",
      "Cierra exactamente en Gs. 298.227.534 (dentro del tope del Crédito BNF de Gs. 300.000.000)"
    ]
  },
  escenario350: {
    id: "escenario350",
    nombre: "Crédito BNF 350 Millones: + Piso Porcelanato 60×60 + Puertas Madera + Placares + Pérgola Cochera + Jardín Césped",
    montoObjetivoGs: 350000000,
    montoEstimadoGs: 348112534,
    costoM2ConstruidoGs: 1951085,
    semaforo: "ok",
    objetivoPrincipal: "Crédito BNF de Gs. 350 Millones (Gs. 348,11M presupuestados): Suma a todo el alcance de 300M los 80 m² de Piso Porcelanato 60×60 rectificado, las 6 Puertas Interiores de Madera, los 2 Placares Empotrados piso-techo en 2do Piso, el Caminero/Pérgola de Estacionamiento y los 115 m² de Jardín Parquizado con Césped Esmeralda.",
    itemsIncluidos: ITEMS_CREDITO_350M,
    ventajas: [
      "Incorpora los 80 m² de Piso Porcelanato 60×60 en Estar Social, Comedor/Cocina y Planta Alta",
      "Equipa los dormitorios con los 2 Placares empotrados piso-techo y las 6 puertas placa interiores de madera con herrajes",
      "Suma el caminero vehicular con pérgola antigranizo en la cochera y los 115 m² de jardín nivelado con césped Esmeralda",
      "Cierra exactamente en Gs. 348.112.534 (bajo el tope del Crédito BNF de Gs. 350.000.000)"
    ]
  },
  escenario370: {
    id: "escenario370",
    nombre: "Crédito BNF 350 Millones: + Piso Porcelanato 60×60 + Puertas Madera + Placares + Pérgola Cochera + Jardín Césped",
    montoObjetivoGs: 350000000,
    montoEstimadoGs: 348112534,
    costoM2ConstruidoGs: 1951085,
    semaforo: "ok",
    objetivoPrincipal: "Alias de compatibilidad para el escalón de Crédito BNF de 350 Millones Gs.",
    itemsIncluidos: ITEMS_CREDITO_350M,
    ventajas: [
      "Incluye Porcelanato 60×60, Placares, Puertas de Madera y Jardín dentro de los 350M Gs. del BNF"
    ]
  },
  escenario440: {
    id: "escenario440",
    nombre: "Crédito BNF 440 Millones: + Alacenas/Isla Cocina + Ventanales Blindex PB/PA al Río + Deck Galería + Rejas Balcones",
    montoObjetivoGs: 440000000,
    montoEstimadoGs: 439734284,
    costoM2ConstruidoGs: 2464602,
    semaforo: "ok",
    objetivoPrincipal: "Crédito BNF de Gs. 440 Millones (Gs. 439,73M presupuestados): Todo el Crédito de 350M + Amoblamiento Completo de Cocina (bajo-mesada, alacenas e isla de Gs. 17,54M) + Ventanales Blindex en Galería PB (24 m²) y en Dormitorios/Escritorio PA (18.5 m²) + Puerta Principal Pivotante y de Servicio + Barandas de Seguridad en Terraza (19.5 ml) + Deck de Galería Panorámica L1 (33.42 m²).",
    itemsIncluidos: ITEMS_CREDITO_440M,
    ventajas: [
      "Suma el Amoblamiento Completo de Cocina (bajo-mesada, alacenas superiores e isla desayunadora)",
      "Instala todos los ventanales corredizos Blindex de Planta Baja (24 m²) y Planta Alta (18.5 m²) mirando al Río Paraguay",
      "Termina el Deck de 33.42 m² en la Galería L1, las puertas de acceso definitivas y las barandas de terraza",
      "Cierra exactamente en Gs. 439.734.284 (dentro del tope del Crédito BNF de Gs. 440.000.000)"
    ]
  },
  edifica460: {
    id: "edifica460",
    nombre: "Crédito BNF 440 Millones (Comparativa Edifica B 460,1M Optimizada)",
    montoObjetivoGs: 440000000,
    montoEstimadoGs: 439734284,
    costoM2ConstruidoGs: 2464602,
    semaforo: "ok",
    objetivoPrincipal: "Equivalente optimizado a Edifica Studio Opción B pero incluyendo los 3 niveles operativos dentro del Crédito BNF de 440 Millones Gs.",
    itemsIncluidos: ITEMS_CREDITO_440M,
    ventajas: [
      "Logra por Gs. 439,7M los 3 niveles operativos que en Edifica Studio Opción B costaban Gs. 460,1M por un solo nivel"
    ]
  },
  edifica573: {
    id: "edifica573",
    nombre: "Referencia Total (573,9M): 3 Niveles + Quincho en Subsuelo + CCTV/Wi-Fi + Vereda + Parrilla Construida",
    montoObjetivoGs: 573893750,
    montoEstimadoGs: 547146784,
    costoM2ConstruidoGs: 3066622,
    semaforo: "ok",
    objetivoPrincipal: "Alcance máximo de referencia (Edifica Studio Opción A — Gs. 573.893.750): incluye todas las partidas de 440M más Quincho en los 100 m² libres del Subsuelo (24 m²), Cielorraso LED, CCTV/Wi-Fi/Alarma, Vereda/Muralla/Camineros y, como ÚLTIMA INVERSIÓN OPCIONAL, la Parrilla Construida (dejando la Piscina 4.65×2.45m lista para marcar opcionalmente en la tabla).",
    itemsIncluidos: [
      ...ITEMS_CREDITO_440M,
      "quincho_patio_subsuelo",
      "forense_omision_fila9_lozarrap",
      "edifica_cielorraso_estar",
      "debil_cctv_ip",
      "debil_wifi_mesh",
      "debil_alarma_barreras",
      "debil_domotica_luces",
      "edifica_vereda_frontal",
      "edifica_caminero_vehicular",
      "edifica_caminero_peatonal",
      "edifica_muralla_frontal",
      "parrilla_ducto"
    ],
    ventajas: [
      "Completa el Quincho en los 100.71 m² libres del Subsuelo, Vereda, Muralla frontal, CCTV 6 cámaras, Wi-Fi Mesh y Cielorraso LED",
      "Único escalón donde se incorpora la Parrilla Construida de ladrillo refractario (Gs. 7.500.000) como última prioridad opcional",
      "La Piscina Oficial de 4.65m × 2.45m (Lámina 2 PDF Instalaciones) puede activarse con 1 clic en la tabla para simular la Etapa Recreativa Completa"
    ]
  }
};

export const CURATED_PHOTOS = [
  {
    url: "https://lh3.googleusercontent.com/pw/AP1GczOjESKh4AsBhs0wVjFREcNrkjrEFqy6dADizyzQz-FrdSCASGm3b_OfFWf0EIyn2XZ7LyqSgA2cEZA1gbT-GOo5Fvc5CHSt8R9m642iZqYwQ2vZrVVH",
    title: "Vista Panorámica del Terreno y Río Paraguay",
    category: "1. Terreno, Vistas y Sondeos",
    desc: "Visual hacia la curva del Río Paraguay (85-96m al Noroeste) desde el lote en Calle Guillermo Arias."
  },
  {
    url: "https://lh3.googleusercontent.com/pw/AP1GczOOxN4VFTddOduR_4fuyJNy5W-5_dNURUO-QhfqWFeTRTnI_X3KgzBH0lEY3XDcAK6mQtKvLdHxa7qXyq1KEIPkB1Hdx0uHQG-ubiPd1fnL4rkmGB-e",
    title: "Replanteo y Perforaciones SPT (GEO-STAN #2956)",
    category: "1. Terreno, Vistas y Sondeos",
    desc: "Equipo de ensayo SPT y nivelación respecto a RN (+100.00m, UTM 433024E 7203554N)."
  },
  {
    url: "https://lh3.googleusercontent.com/pw/AP1GczNFUKh9qjFBTYl0Atk7bib1KCNilDpFJu2g7bBpnCMmJSaehctrVyuurkmZhAWfTfeEhWSrLLrTRzYtqMNui-JqWJWm3Zs75mmMSgYGbSonujH-Y0Fs",
    title: "Excavación y Desmonte de Subsuelo (-2.34m)",
    category: "2. Excavación y Movimiento de Suelo",
    desc: "Corte del talud natural y exposición de la medianera izquierda (Eje 9)."
  },
  {
    url: "https://lh3.googleusercontent.com/pw/AP1GczND72HRziSrT_Qv-aIenOMZRMQlOJ4c4RKSfzLJ-zJktlYquC-HxDdePL9t7zqettZdRkIgQG-kF6RUgfbwm0P_l1pTK0oDMOCGp5xnoW2WpjXKvU4c",
    title: "Parrillas de Zapatas y Vigas Centradoras VC.T-1",
    category: "3. Zapatas, Fundaciones y Muros de Piedra",
    desc: "Armado de zapatas profundizadas a cota +95.36m (-4.64m) y arranque de pilares P1 a P20."
  },
  {
    url: "https://lh3.googleusercontent.com/pw/AP1GczOULmpfeKVAk8S-TLHx8QPJ80qQzdJtpXtk7NXe1ivL_hve3LgazPQqeX_xWTlULoZKTf1W6A_VVLRzjR5EP_2fnlhr9A91lahlHr75pVXiLwr_DdLW",
    title: "Fundaciones Ciclópeas y Vigas de Subsuelo",
    category: "3. Zapatas, Fundaciones y Muros de Piedra",
    desc: "Ejecución de bases y pórticos inferiores 1 a 7 en cota +97.66m."
  },
  {
    url: "https://lh3.googleusercontent.com/pw/AP1GczM0ScwV4uEy8JWWyjzzkaxiTHnrIAfaSeUUfgffLu2qGGxdjDSRpHP4FZ4u7dh7TKbE_zP4kzvZSX4Mm45tA4d3dZhSPsSZ6IUk5usqvgdd9tyzq-qP",
    title: "Pilares P1-P20 y Encofrado de Losa 1",
    category: "4. Pilares y Encofrado de Losa 1",
    desc: "Elevación de los 20 pilares de H°A° HA-25 (240-265 kg/cm²) y preparación del encofrado de Losa PB."
  },
  {
    url: "https://lh3.googleusercontent.com/pw/AP1GczNVtTVaDBbftL8FWqtovhlJIQUkM_uYGzZTF4cdV0RwEKaaACaAeLg4_gNrgALnkKX6gkE7Els47gWaKJcvDh-mqG5sk3xddEpvmhWDW_uWrLyiGQPH",
    title: "Atardecer sobre el Río Paraguay desde Galería",
    category: "1. Terreno, Vistas y Sondeos",
    desc: "Orientación Noroeste hacia el Río Paraguay desde la cota de la obra."
  },
  {
    url: "https://lh3.googleusercontent.com/pw/AP1GczOQDAjlOkyfgZFcMbru1LUMTxIkpBApkmaSs0223lbBVbECPD7Xood-ya44oxhG808Z4knf4FNmFFY29MkiKwm7cl08fbU07xjDG1MgnpT0LN1uM2Sn",
    title: "Esqueleto H°A° Losa 1 Terminado y Pelos de Espera",
    category: "5. Hormigonado Losa 1 y Estado Actual",
    desc: "Estado actual según Acta 29/12/2025: Losa 1 (305-325 kg/cm²) y Escalera 1 ejecutadas al 100%, 0 m² de ladrillos y arranques para los 17 pilares de PA."
  }
];

// Catálogo Completo de los 118 Registros Fotográficos Reales de Obra (photos.json)
const RAW_PHOTO_URLS = [
  "https://lh3.googleusercontent.com/pw/AP1GczOjESKh4AsBhs0wVjFREcNrkjrEFqy6dADizyzQz-FrdSCASGm3b_OfFWf0EIyn2XZ7LyqSgA2cEZA1gbT-GOo5Fvc5CHSt8R9m642iZqYwQ2vZrVVH",
  "https://lh3.googleusercontent.com/pw/AP1GczOOxN4VFTddOduR_4fuyJNy5W-5_dNURUO-QhfqWFeTRTnI_X3KgzBH0lEY3XDcAK6mQtKvLdHxa7qXyq1KEIPkB1Hdx0uHQG-ubiPd1fnL4rkmGB-e",
  "https://lh3.googleusercontent.com/pw/AP1GczNFUKh9qjFBTYl0Atk7bib1KCNilDpFJu2g7bBpnCMmJSaehctrVyuurkmZhAWfTfeEhWSrLLrTRzYtqMNui-JqWJWm3Zs75mmMSgYGbSonujH-Y0Fs",
  "https://lh3.googleusercontent.com/pw/AP1GczND72HRziSrT_Qv-aIenOMZRMQlOJ4c4RKSfzLJ-zJktlYquC-HxDdePL9t7zqettZdRkIgQG-kF6RUgfbwm0P_l1pTK0oDMOCGp5xnoW2WpjXKvU4c",
  "https://lh3.googleusercontent.com/pw/AP1GczOULmpfeKVAk8S-TLHx8QPJ80qQzdJtpXtk7NXe1ivL_hve3LgazPQqeX_xWTlULoZKTf1W6A_VVLRzjR5EP_2fnlhr9A91lahlHr75pVXiLwr_DdLW",
  "https://lh3.googleusercontent.com/pw/AP1GczNdpfjrkX668CW2-G9JZDnk50DQuuZFQ41mi-cDZdfy6ES5hkW16dsJYs8mOMCzrcn0EX5wOZ35jDcBtfnI5UHH5-Ai0A45-tBxrBPVMMqC3d92PrPk",
  "https://lh3.googleusercontent.com/pw/AP1GczMTVSDNUU1gbGqH03f0lFzrOGN_r1_wAcrqATt_Yl4q5p72mQTRZm2_v_VklusxEIOTDM4Pol52zcPe9-4dNT-RhuVmonQedbbhl7OEyfuXBDPRSXib",
  "https://lh3.googleusercontent.com/pw/AP1GczMQxNMiCTewLlRA3g71Z4G7A9YxoW48rn679lD28eT4A4Vfl8s26uknp3gbLdBtI9ba-YGok48XyFVVn0CmW2m31n_RQ4ppM9Ak5MVKpCeachyGsQwg",
  "https://lh3.googleusercontent.com/pw/AP1GczPanbV8nTrLiFQtrT0J-KfT666-diykgBXyzEwediLL5WGobecqthedj5q69ofRjSWr-5RLDsmzWMY2n2UzrJLS-myfIDLfNJAlwm1-Sr64YpOSO52S",
  "https://lh3.googleusercontent.com/pw/AP1GczNql94u-yHSIQ2jEcFFAsPRjQnpxnu2OxPpeMlo1k2GV4pWVZYr8cSZfxTOyl_YQvkntttCXlQg7D45BY18oVqnZKWFF3ZReK3v7nAhlE5mDgB6Cmln",
  "https://lh3.googleusercontent.com/pw/AP1GczOIH0_DMuYraKVA1HnHelMf9Xcs19s4L6yLriJTiCSDfqkbEphtwmf4fFA-ql_tMp1rg0Gznq767FHKz3N3hZ88mVmfcXlU-GDon23hyh1PnbGwq37n",
  "https://lh3.googleusercontent.com/pw/AP1GczPdwAqKaj-AR4X4W9X815yK5vSXXINvtM5VRgvlzDRiTPbyNgCSbLVnE0-LJFx87i6YxI7iwHez66jnKMB_n_50GUYa-U9odsR_IvNaKeDhqEUorAkB",
  "https://lh3.googleusercontent.com/pw/AP1GczNY1BSW3h5t0ceR_k9bm9cLhT7gbH7dfwcOEwK0KOrSZ-TPQN3MsN8VOqGRUB4iYY7eUXGrvui4DD8J4VkCVkWxcIZLTK1IYhAgtznP-9jSEf0Y7zcE",
  "https://lh3.googleusercontent.com/pw/AP1GczM0ScwV4uEy8JWWyjzzkaxiTHnrIAfaSeUUfgffLu2qGGxdjDSRpHP4FZ4u7dh7TKbE_zP4kzvZSX4Mm45tA4d3dZhSPsSZ6IUk5usqvgdd9tyzq-qP",
  "https://lh3.googleusercontent.com/pw/AP1GczOPWTrPrskQiQHK3xyk0y_WDA3dN-9ndL3HXgqJ_w8J62uxMpF4x5xKezXqQMKjhfLXE9NYB1YUj7ihTZhRKNJozoW2Po37UBx2_zGEXWGZQsMNhO-c",
  "https://lh3.googleusercontent.com/pw/AP1GczO-8G2gqGDOEqnzRi2EMcfbnVzFrrdtukvWcgXkJtdHa7oCOlpa8TZYNJvRaLtD-shkPVerNCojcfzYDCtUyoQHMxRgWBHyiFbzc8NLcqktJifrlkpy",
  "https://lh3.googleusercontent.com/pw/AP1GczPL3rlDZsbqjPQM-Y4LzTNYBrgU6LXh6HGUIB-V3U0VFwD3E_XqzSTtjj9fc84hSOk0A6mFUeIDpL2dwegqYafOujrW5LiQ4gotoX2qyyKtIEzuxLG3",
  "https://lh3.googleusercontent.com/pw/AP1GczNaY5ki6t2EDRGKxCeQ1iu_LUcE4eYPOoE04L0aZFeXxGqTRKGUFXM1KSxins_aAZs-AgPQLqSDyXUt9GxNZyG-RRy9gtE5kmgzNEdK1N2jHxWlosTq",
  "https://lh3.googleusercontent.com/pw/AP1GczO8Zg-nhoSkaA57215uowt1VAHk9VxW7lzjiVQAXrCMAPOzkzrm_GWF23q3bfz5I_iAS9fEasvAkHnBmz5jYc6fguWoYne8c4xg8zc7puq7KbKsV0NH",
  "https://lh3.googleusercontent.com/pw/AP1GczPEezClcoaMdzugobyytE2XeVLaD74XAS9nJhKS24ORmbplSInbUNGwpPA3-jW_umFdnCWwb3HKnv_6V13EAJg7XygMCtPvOn-SwbggTqSXzPJ__cs4",
  "https://lh3.googleusercontent.com/pw/AP1GczMh1g8Sn0JmmwiSRyrCXvSSlnWtR9r26zPDWxM0tKt6eRNauE3GRCX6lfsLAuAv5w1Gznv3VJoztYEjVCerCPNtgaxghAK6gZllDMSEJtaJjuoT92oR",
  "https://lh3.googleusercontent.com/pw/AP1GczOYmy86wYnSyZH9GI-eE6D_DPrN_g9JPsADBCEWOc43NStopavU47ajHhYl40BxImrzhuTj0a9zVtaVvaRzbTG8onHeU7FShXR-BZQpIAHS_iMEjkHw",
  "https://lh3.googleusercontent.com/pw/AP1GczNqx6l29iSF5iZl-OAUAKtulON0vEmghMmwC3lQgJeF_o58shulaf664UlKuLZeuQedYbNRbJhwjLbj_NeMJZOFPwLQ7DuElwUwo-gnlsREp_WDx-AC",
  "https://lh3.googleusercontent.com/pw/AP1GczNFCdwoB3fFveWWVzA1-muUzzZFgtqgSjWIw7-20dJVkbCaSs64iHzq3JFnvhh0ZBD-AY8414SADIKogbUjsmvjrf_yl2dbnKPB2Ia3WtSzgM9jcaEw",
  "https://lh3.googleusercontent.com/pw/AP1GczMJbcFPjpXp4Pl1CjpvmzXASIn_y3CgrFrObwYXpMB5-4G8WylcO1flC4T71jqydxWEZRhfQPijOIZ-f7dAF2rMImFQhhizWdNztbc6QoXh4t2te3iz",
  "https://lh3.googleusercontent.com/pw/AP1GczPLVCB8_oxsx4JPVCFxtWYUNWcp1mt8g_feeFl4VQdFRDECBOyKA8v8pkmO4pePdW3KS2TfaMr4uLp4GG76FrRqNTvGp85KQ1eoITrLXTvILuFMkRRz",
  "https://lh3.googleusercontent.com/pw/AP1GczN8PkV1gJtJ0nl-BuQ0vV5rPsyagH5MxBo_x1dm9qvnlM4Z05yGBuWjBWoDnS2dlZBkrrfqrlULJP_6wNM6RHoSw3h0HU6BQy0G8YMquB5DaSl_oZJh",
  "https://lh3.googleusercontent.com/pw/AP1GczPQt_R2NlkMJwme4mIT4T8Jq17f5KxuMXTToSKBliHjhUqSPz25uMTGpHc3FwYFP-7jBGfGGn3H_F9wQE-crVKT3AQkZoqVklNqB35l2vDY2pS5yh0w",
  "https://lh3.googleusercontent.com/pw/AP1GczPKKz1MEUdjUvbwL4mFCgjNCjk_LRMrELW7iedL86j6ZtqSvHWSbTQ5SCx-oLUN7lWaTNdCDL_I6rfIGYi1n4g-z0Mu8p9Snl7KZ2xbSOFYjepOqOY7",
  "https://lh3.googleusercontent.com/pw/AP1GczMkDUhkBJR4-StfRRhKmvLH8-aKS1lcnpVJ97EEjhVmQGTuYJwpkv5Wt0j78JI1iDBCGP1P3HWBIV4soD90jCB4EdGl86gO6hHw6YTsLmgqr-oXy0H5",
  "https://lh3.googleusercontent.com/pw/AP1GczMMaatm7oPTSdChCjNyVsex_dHIDFN4v15lpq58HXugTUrTjE7KRTvZSTtizmywkjo98l3pbGby6MQV47KLiQc9WTTabbFkCyb8MGWjC0wTjHQSd9bT",
  "https://lh3.googleusercontent.com/pw/AP1GczN-SC4a39hwEsX2yRlE1qKwxbvHAsSh-HkrxpNNY7OGwIulFW0iSe2e9ccEHMOtuL_UJN4segVSplJJsSUiv3H6KBxtfRAzRXzbQ7SRpMqp_0z72hw",
  "https://lh3.googleusercontent.com/pw/AP1GczMbc-ck-k2apxBhARHazoYoSZf_7HAip32VrEloEC7Rv8oTcAwtiCUrg3fpEJfkZTi5XRq-7YOJHMmNvy9c1GzbXhzxbjKtWRmV6KZNvDjn9ABWpcRN",
  "https://lh3.googleusercontent.com/pw/AP1GczPVRKDp58ZMt-C6s2rUYy1si92KEs0L91joadfgWE5Lo5Ld0Iz_4YR7YFhdf9u_2nRk8DxWO2rCUt3zKnauuBWWf5x5okRMowMoBm4R2RaUT-uFEpRd",
  "https://lh3.googleusercontent.com/pw/AP1GczMi3WU9v4QvEPKOTDQuvrP0k24NrXDLIvVbhqAhHeLNw9gy7KVu-sn2Wx2oEkoTPPEDp5KOBqUh3IvHTKr13mAuUxUoB0CNWxxCioJ_US3lhrr6xH0K",
  "https://lh3.googleusercontent.com/pw/AP1GczNgkIs_xcaDpY_HbfL41TnUV249lvIBm_RbfF6E5qyVVOC-TbzOYuG3TLqEc1N169My1_w_JFbnBoDKC-bdLrEjXN0RyFw6ggNkEzda7ZvMCudbod28",
  "https://lh3.googleusercontent.com/pw/AP1GczOKsbwk0eQUst99YmbdLIkau8CaNzHDKdMONhM6ZksJsSeUMSgMag75eRrV4f6gzFXwrvdFf2JlE_cYmai5Q7xcKQDk6-oMykQmYbvDoFn3My2o1WuB",
  "https://lh3.googleusercontent.com/pw/AP1GczM2CgCwVcJjy60FI_dRU-KzziAob9mX9BFNi6ag3pq0GkTCWniRhg8setp8xPZTWU1n1lIUXF7XWHc-XuK45My1mBX-EER7HYjV2M5QqaEbi7FMTulJ",
  "https://lh3.googleusercontent.com/pw/AP1GczOPDEGKezO8xMEQPd7VnZV8SG3ouaR8AvYgmedrh55HhwLhQQFVu9h2Yox0OcCLhQsfmnLQRPTptxt4Fh3MaoAdyfzMT6rgsWvSZBmnV4kkus2pQaYP",
  "https://lh3.googleusercontent.com/pw/AP1GczMykqD1EwcKoI4iYuuhMuK7R7DMfrA5nm8LBB8hvGdvR9f-SfuLiq2sJxxg3jOqX7im-6qu7Ysl5hqEFXG_p-OYdoLwmkD11DndsMuQgeMNZ3XbTA-c",
  "https://lh3.googleusercontent.com/pw/AP1GczNaeLeewd8IF_779-OpirBB8HK68n-e7ApRYC82u_cYc-Pt0ieQBVBITSoY9fl-ek28SjqbVCFEMMXgYhZ3i1_RRRRqje4QXO65L3jRH2vLyze6AkHo",
  "https://lh3.googleusercontent.com/pw/AP1GczNgqdtc5Ve9yj1RQ_0HJ9LlG-HvjbIxpTn9vb5Scx_GO0Lu-vdxUDqA4B0UQ01lLRPZ4IK7cq2behfmXIZKudfB3vFN8NK_O1o1KbfxBcfnMMMBucI",
  "https://lh3.googleusercontent.com/pw/AP1GczPSOus_shd8gvYGvD_HWj21cr-AC3PNkJz-RnzZT1O-mDkJmtiCpPEldD03oqVCwxWHqWBEiB-RPavHprKCfzD6SQ3y3mD0jXmh3t_-J5xCymUhdhQ",
  "https://lh3.googleusercontent.com/pw/AP1GczOXSRjOCFPbcSOPSs3r7667x4SPOswRkS1Ka8wYUjJYIo-evsnX5YkdZW35j6euGRK2F5wq3mvg7kzmLELRQ7uRsf13wqORJo_tBUgotQ-pGV5xh60",
  "https://lh3.googleusercontent.com/pw/AP1GczMnUn_FNMimQVx_GOO5u9SPiFJ82UiYkSC4nlkOTsNA_tEKjwq2f2T1X7kWlRFScEQrslkfmCx7O0ihsXjD8U5U_MLutXi_KwrFmVhe-erV5UHoxyk",
  "https://lh3.googleusercontent.com/pw/AP1GczPRRiJprhI-2a_srmnmTjfd_4LcqolWZI22fRiVOO-Ydc8fql2GIAf52RJEZ6QhHADeg6k8huMEedG2aXpBLdvW80EUAfH5YU0pE9z63N008iwU-f6M",
  "https://lh3.googleusercontent.com/pw/AP1GczPc2L_ub6YtGQ2NfrRm4JHNEYIns4meBXJCMjj0MTtx21R3wiqNdQGHL9qTBKI6lDGGH6YhUwIXnhfVaL4YagFSMz1o9X567hHHdvfyDUjgeee86fOR",
  "https://lh3.googleusercontent.com/pw/AP1GczNegvBtA1yXm5heur309ZkuM1NG8eMhXMqVCAOgvbY7CEZ15APxOpAetBn3sxjeeE3YsaaZ0ijZax8bAYYIyhX7sAa1rNteyjFzTs-x1t7K8aiz3LKH",
  "https://lh3.googleusercontent.com/pw/AP1GczPowqcw406Kyx1J6nKHjbg7q04XjCCYiVwXHmSjSB2sBduQVImAIQz9Ml5t-AD950iR0gHJLziIQhNT8jG-r7idGqVYxfXwOZncPIo5YCCGQseG62-x",
  "https://lh3.googleusercontent.com/pw/AP1GczNHzjKE_fqXC2ZGktukYYr_F9bve9hlXEXswEeTfhlwylj5Wh5xJagHGoTdAXLeLP97S6ljTiym6UFBDghlfiRuB1CSKKOf68jf76ZjoFoGNMH5nm4",
  "https://lh3.googleusercontent.com/pw/AP1GczN-akWtVFCJ_a6brWWWr9ybp9oHm5SM6sXrFKAhNuvBhM7qLgWCLOqWrffk0DRxlUHhNkTXqh7Ev50bLYGqbTvz4ixJ-AaOsj2Ruio5_Na3L4r0qqg",
  "https://lh3.googleusercontent.com/pw/AP1GczM8qU9D4Oemh-6WdqbREhvmwVBmO7iY38J3zqNAqr0fcaapSYtpBWWqJLKut8I0BVR6S9nxUr0nonfTYaWnfJl4gzS8d6kU2UWtTLmwxO0fBxOIMRQ",
  "https://lh3.googleusercontent.com/pw/AP1GczOHTFMUYyZVYzDpItfQWA17ManHiY40muYH8zJJgXG7UKuiOAL-V5aKHX8QasbEpBy84Unx_y-R_AD6j_X89GXdT0iTWNvfw8MiFb-BWhqGe0mgtDA",
  "https://lh3.googleusercontent.com/pw/AP1GczM_vFnRjze0U8bnxlhKAQOkcwpT9HEAftEkbXau0NCL-r65zFUYn4fn-f-W4uMngcFfcgUD9rMCw65SV7Zmm3Q4jCky8rQsxB9-40rpeGUNJIrTQDw",
  "https://lh3.googleusercontent.com/pw/AP1GczOs6KhVFbgUv4FbRTwFwB1XKOJJfeZaTjUFBe5ZVqWwI32tQNWU2c_drdGJppNW_zz9bZQuzahAiAo9V8hOGb_5hLZXE2ColUHkIljVq1o1i7nbSJU",
  "https://lh3.googleusercontent.com/pw/AP1GczO3IGhXnP8hdLN-1CjH7ci61M3L_6c3YQOy-0xgASkM6Cdsm88u9A__PQ-ffDLXLSnvDuvIUwG0JTx8EkGfUPSke7InaZxZOEFApjzA_w9re0kggPad",
  "https://lh3.googleusercontent.com/pw/AP1GczPtdz55OkqFLGwPxAwAIsptRHROPqQj74Xd398O1n6IzXLWIL2G-tucFe5oi7Ii08RBhvEwoReno3YBr0DgmBuGvyaIjyo8IS18mqzOL09_drvAuNBq",
  "https://lh3.googleusercontent.com/pw/AP1GczMLCCd2sOsQUoPc78vK8Do6SsvNyFntd3B9VZ37sOENVAwh4A2vYUGnNPpo3Gi8zVm6Boc5NKvfITj-sdJ8omNVM9XzPtVkj9KsDXhp2p9JGp--GN5M",
  "https://lh3.googleusercontent.com/pw/AP1GczNWLY2-pd8X3dYiyp7oCcfrfIyLKQzJ1wy97qdz9OvhoPT1jvz9ko3H7zDO4qiJ09m6S8V47T1DrUP6WmKkS3-SFy25V8YbDqa1W8NpgKtXgcsxH7GC",
  "https://lh3.googleusercontent.com/pw/AP1GczMCKJm93Mg7uLJk9INY9LjYvltCAjJUO0zy9nOdvfjSgVjm2Qo7F-Ozp9u-VJI4We79LZGTJr1oXrQ0YubiNhm6lMT1FimIV7Jjd9VNE4CZ6Ti62ER6",
  "https://lh3.googleusercontent.com/pw/AP1GczOte1WNW_gEW9NqGemCmgnZSB0t0DYSBkudFHmWzyVEwWf9fhNr5aPNuaVBScTYVLFW1w-NbB1qcA3d1aav_sXlYWGzjAH9VHzNwFwAKhuJrV4nSI71",
  "https://lh3.googleusercontent.com/pw/AP1GczMptUGu9YKwCXuGuck42k1Hw_8d8D6J4Cp_Q9ZPts8jVmMDifXsoQruvBZaVUDN2ZbtQBqvxT-fSUtLKZm4hpmsATNXfRxExEkzvt5rn_hk_XfqG8fH",
  "https://lh3.googleusercontent.com/pw/AP1GczNArLw6YwtBkD6wdoLdMJVnDqX-iGmLNDz-67iuKpo8JH4s37bnQFOdzvlkiOVXZoDamNad6r8ZyguuKelZqH5lJcKQx7V9H5uVBC8EcfJ_hy3e0tfV",
  "https://lh3.googleusercontent.com/pw/AP1GczNiMRC4iILdIe-wNtGkmQUNlsl8iZMhGvCXx2UB4-qIdKDI2N8VYikFKWV1TcnlP_5gMO7aq8FFp0KT_o2w_ZtHIYFY1ncaw87zZ7UgeoZzfkpIpHmC",
  "https://lh3.googleusercontent.com/pw/AP1GczMveI23mEz6CJC2hOw0ELwztlnNQWqlhdgeRamEVzTn59DCHa8CMjvjQVf19OzljH1y1AdT429LB4POS7GBvJOvWn4tQTSWm1b4GW6IHS5zf14VAAD9",
  "https://lh3.googleusercontent.com/pw/AP1GczPSX2T67s_McqlhPNnTXJfq2Xhba4f4YTPbCsNbUlK61hLHWopiSSZHrWeG-7GIylfgWp43QTKfgTO5WK_0TbtG2UcmJljZcq8M639cqpB2Nm1TYb39",
  "https://lh3.googleusercontent.com/pw/AP1GczPWQI-6Evi0l1Lx9zPU5WMkr7_RvXABF-IEcSiXQ4OcIkLTdXzh6uuV1SXSp3iuhF24164-m7vx8QvXeiJwMdNgEYNwMmQE58u88rOEmX72Et1yaa9R",
  "https://lh3.googleusercontent.com/pw/AP1GczM_1VbTBm9qOK7GOl2X20BOrYAx_Al3k3FIiQNnGXeujnZPD6aVyhMbYP84aUaffdvOIDz7EZ6uMOTa0P8Zo0bmm27FaZUfsaVlwSjBdWSjrgYQ6EbB",
  "https://lh3.googleusercontent.com/pw/AP1GczPyUz2qT9RXYTM96fS4n3zojrFWD-MWat8TACElFxsr8lQdaOAErbFgyP3LlijVlWIraCd_cSYlUyKBSh_qDfhW2fCBMvewyKGPM-lY2FIjyp2dSbJw",
  "https://lh3.googleusercontent.com/pw/AP1GczOP8jEro1vympS61xgQGUDflNIQhnyH0hgcj0CSZjppFdgdmacFVOqHqGSeVu0q_EIMUZVW9g0OGWuh7lt6q4imnI04jTd2aE7BURxm5AZB_SZHQorI",
  "https://lh3.googleusercontent.com/pw/AP1GczPE_4k6zUyw4HV8ZHd6FH58OvjJM1q_FAagtlamjhbV9AI0j6XezVKdkP38I8aN-1b07ut3Utoq0GdauzMmAc7reqmASI1IfY8xRQVqrdWs_8H75Sf6",
  "https://lh3.googleusercontent.com/pw/AP1GczMRvV77rH6NZbLdxKSuL8QH03QY9LChbVagmFLbxV0D_HKUyxiVDH2-XNesnIwNsyFY_AVbb4ADVCohDFbQhtXjY3A_DRfmWTwAZIq0aJln7j64oqV8",
  "https://lh3.googleusercontent.com/pw/AP1GczNVtTVaDBbftL8FWqtovhlJIQUkM_uYGzZTF4cdV0RwEKaaACaAeLg4_gNrgALnkKX6gkE7Els47gWaKJcvDh-mqG5sk3xddEpvmhWDW_uWrLyiGQPH",
  "https://lh3.googleusercontent.com/pw/AP1GczPB0NB45kFSP8LXP7-QZeF3E3hflwi0p2sAlo8LttbxLWnVRMt8tURske8PtvALnloGAjvvPFljQE0Avqaee5vwkT7SUYWidd0bja8BkYkxng0d2HoH",
  "https://lh3.googleusercontent.com/pw/AP1GczOr6TCU3SVzD7ewPoMTHNH-clxFk83FcbHWr7jOHTQOuJLp53cKHidz2YBmbqprbqUNz61qefsLgF90oo8Ragi1uLmrT_LRozJQw-sawz11YqCt6Kgl",
  "https://lh3.googleusercontent.com/pw/AP1GczPSmLRrU7HR9sWPS1lXvxNGrD9xOq6On85hqZ3KzTJogqVYd_f-gDDHLw45Dyn4EWNNnxEpW_ic7jTIpOfc83w1sY1LV-4nRvbxcddZ0QQ9jQ3yScmA",
  "https://lh3.googleusercontent.com/pw/AP1GczN9NpnyL7eENofb5QgDSdrVdyKn5d2WHTxnarX3CPRW7pKpopQcIEbAsenNODvGQYoi7oYn3t_ieEw7wDBEaRSJ56bX8o-Fl7_UvZPqzQBvMzYQ4IS-",
  "https://lh3.googleusercontent.com/pw/AP1GczOQDAjlOkyfgZFcMbru1LUMTxIkpBApkmaSs0223lbBVbECPD7Xood-ya44oxhG808Z4knf4FNmFFY29MkiKwm7cl08fbU07xjDG1MgnpT0LN1uM2Sn",
  "https://lh3.googleusercontent.com/pw/AP1GczNVbkXbm9zoVmdJPvUDBTMAt3TbDHcGfIw4f42kCoA2ahJ6GQLIJaVHxl0xZLjvNCDadEAHRh0UH7taxhESU-dCI32CiE-R_oCj3VIRbl06KRq4dr8B",
  "https://lh3.googleusercontent.com/pw/AP1GczMI_h4lidYLLLI24JAz00S193mpN0HHo0JnyW-p98x0fDU3rZyFdd3Y6OWci0fMzipfSQprk2GfWdjZBy9ffu6OIFP42hd7dv_F9JAccNRMEVP-HvE3",
  "https://lh3.googleusercontent.com/pw/AP1GczMRfr4qc-Ve5TXhSLG9AT-2V6hFcXhChSFjfQoeQf_88u6B57_95I0dhOXn1FkmZEeHybPjgB3xTEtbN-5rYfYD8N_wEbg3rVQ-FceO6RYkTn-CodHx",
  "https://lh3.googleusercontent.com/pw/AP1GczOsULW3bY5eC_LQZLCxZWSZYFMs_rPznAfkwFfZXosMkQM-oXeuwv6CihF5yN27W_-oXZWpzt9vtNRQLnGtHYgSbQPcCs14rS0YDwlYfcc3TtDLSiut",
  "https://lh3.googleusercontent.com/pw/AP1GczPu_ovw17W4CmLT6wDIKW4vtqo17J0huhMx9J9Jj9Nv6SNb_dtJgohzWqAfIMXaIvV5Okr4JWW2qsw_TCvbKs0X-yssF0DSKH_5PB-8MaMhLqLR5dCq",
  "https://lh3.googleusercontent.com/pw/AP1GczMGUtrBp6FzaP5Dys-vcmWcYHNHeJ2bytMBYDrhHOsGI_JdQDfkEecWTPVDlGYVmkjRBRu6OIFSZXt2mtxwlBDSmV7Z5_PSHhX77hJg99jAA7ynQwSP",
  "https://lh3.googleusercontent.com/pw/AP1GczOqX_FH_IYWxq21CM7ZmshuUTC1F6oVoIoVO0nsSL9aZV1zu2hcRR5gly602pHVrgPUdFvXl8C_9HD1uPwfW8psXavsHOvgeY9-Qu1ybwIY5JYaZ_1k",
  "https://lh3.googleusercontent.com/pw/AP1GczMOk2OWiGWQThCuDFLYqSVi21H3umsQ8OAGNYXggS3Dsm1yLNxhcCMlNmgxkkwwj6AD2DSYavrpItJCeeRdGeE7pA3IFDxtuMj8LrIRKle81XYNstnV",
  "https://lh3.googleusercontent.com/pw/AP1GczOaL_kv1leqHXFH6VfLp6Lk0lqHxgHuhI5koehTkOvq4nXNHUmcgnOVxvI8vP4A8GYy0QbrUTbtPTbaThGWvA0dXCSpsbHWZvQCTO16bLpKKiOK42Ta",
  "https://lh3.googleusercontent.com/pw/AP1GczPgdxk7UtozRG3kmyhrQ3Lt17wasupo_XBfD4zaK2Y0HnkbB1Ig92VB23hQ9vO0mOiSK1BARO9sqaL_djeXLsZMYey2vMN9kDY2hJ1LngHMYsGhG42x",
  "https://lh3.googleusercontent.com/pw/AP1GczM_vOai88b0xbEB036dLHgRJwDrVg6mLDQ1CdHqcl3-8UQ0FV7202fivkfwLP5_TNjT0PNJ1W4kKPMSx88kft2JYzSv3baVYk6en_x-DLKoVLjrT7HY",
  "https://lh3.googleusercontent.com/pw/AP1GczOeMsYL7aqsHwiUeR6bLEJIq7dyO02dK6TBCaZ39-t5t-BNR_HySfV2Z1V1TFgq1AttZ1pYC-78d8Zz7_JwbG9U6r7TKztysYfddlyIlBH_hVm4nB9G",
  "https://lh3.googleusercontent.com/pw/AP1GczM2D6OG2aeBUlSNuGyENgnfK13LTdkBLLR3mazS6Iyl8bMkFq7515hV1o8-GDvx1Os4zrVG4zGWabQwjbnAkn15tvkZjmkZ8p8gwOiQiHsqxTUnfgkn",
  "https://lh3.googleusercontent.com/pw/AP1GczNRafaTOqa_8cs2moeyZI4drKNhrMP2Ms746Tu2bK1iKdVjv8PwzQP3w1ZOd8K2Q6km6kjVV-zCv6gVC6rTmv8Kap6o5h80A-DD4V-RNwvBVgjA_4Fs",
  "https://lh3.googleusercontent.com/pw/AP1GczOy9wfrMTagRMsPIQMGxYVgEut5Wa0WIlu_EOCSMD6HwZCo4EYMF8vE9Vfg-HWZSOBC2Hpmu28uFuPAFs1xXNYXZkU0fLfKTc1_UxplsgQyhG9cmC7-",
  "https://lh3.googleusercontent.com/pw/AP1GczMSJylLkDnm8JywdNx0r74H5IQJZeo8_nNDQNlKurhNYhGYSRHLXkIjAuzh57S4HvSPrNgfkZ0dv6fAbwv7qHPsUOPWHLDqWHH2KNMeKoHpJAuMBOMA",
  "https://lh3.googleusercontent.com/pw/AP1GczPE5PDMm16Y5yZcKP6tzsEMseAVGIR6z_Y42IhsPhqS_OFIrxEE6vVr_0AUb5icdQ6BGk9nYocLWKUnoJ0LqF90OpsmD2eIXD9dypqKC8z-2MF0WHCN",
  "https://lh3.googleusercontent.com/pw/AP1GczPwvFKOJiep7y0ar_2JceDMsAzecYxo4lOYrJlx_RMhZ_uuARpR-kX-nxaf2gWSY4aWmh1aawSDAkCjHb_TLq4Uv-DQUk7iY-94jl4xnNNDwJGTNuk5",
  "https://lh3.googleusercontent.com/pw/AP1GczPJtalB2HO16t0SbTSXRzMc0wrbtGnPYoyuMC1C0vBs9XenkcBXcX8PdjPCZxR62gNZ5N2DCV2q6HvjQsCnSyenkDantHearuJvNH_VIlricFxe_H_E",
  "https://lh3.googleusercontent.com/pw/AP1GczNItCLO6YrtGDZ5u_iMeXcfEeuCo1-1FAHJ9SgXBQMLTEwtlNOXfrfRmBbqXn6gU7eLDAAnkuNIscY9KeqHo-dm1gadjY6tnefG5_lHP7VWTE6pE-EK",
  "https://lh3.googleusercontent.com/pw/AP1GczObrpwIwBGg7rm2bpFeDVr8rVlyX34Ay2i24mLDDJmQmm-Trbrgw7IT8a_Rz87MHcLDPG8mTdaOmWaSlAkEB3hVbY3fx3sJ2zt-91sqkjcX_4Rrffks",
  "https://lh3.googleusercontent.com/pw/AP1GczMjGS7AjKUztPMU10CEOo8Y29clKfFqga52ETJCaiijaki42I3InJ3ZULFmZ0ZBeJ-Om0z964krrdo5CQ2X_E2gPvnewYXLu2AKjEMFJYhEzsYoA51K",
  "https://lh3.googleusercontent.com/pw/AP1GczPOivqLFIEWjBkeUbO57nIojhHseQDXTpT6MtdvLbb3Hzc4TDQn93FRyHlc71OzLpjZDW9w4ogEEUvcYQHNt-vQjfhDzCwGYJTyF5cEciU_p27jyUVP",
  "https://lh3.googleusercontent.com/pw/AP1GczMItYy8ErTyYJT0aZXUIzMxSz_0nWd888YAd6qjDNV14oathNM_soU8JXVfhDQ8T9SpLZj-9y6C7jT2ESHTx5w7EiP6TIF6BMk2vggk4fPpEKZERFt_",
  "https://lh3.googleusercontent.com/pw/AP1GczOeLPYSAqSeJrt3bBgaTV4sZq1DmHuHlIxp_4ipX65vHzFS4f9CUa38ELrugse2fhidGa1mEy1e-pwuEUYr_qj43bORxyjB9HJS4EbkFn4VRhJnoFgo",
  "https://lh3.googleusercontent.com/pw/AP1GczNw9nihi7_Md2AWQvlbUFdjSFY7f0WRLHM1tof90j15RxGWPcUYzYt8E5GQktINJR2NDcXjm47XjGdFudi1Lsqr9rQvZVxZPM2Y5HOXdG60HaJxLPj3",
  "https://lh3.googleusercontent.com/pw/AP1GczPIWKO7RDJ33Fw1ovmrr6wFinxh9d-Nj_vkXm1SQI9SdWmshk_EZZWXmFDV66VipU49AGUnkoSl8Q8Z1U9PMsh0HDCfOLWd7bGZH9GSS3b1U-qJiUlH",
  "https://lh3.googleusercontent.com/pw/AP1GczOGQPmcXOVh2bhkmhc50kLmunSYBW8GdCZFvaORKBtEsHsxQhBdAv_t2tMGYwzsEj_-nmCCDYSqYxKjnEPLQfHGAjEW1Hbz8hzxeD7C1VjnxTCTYcN3",
  "https://lh3.googleusercontent.com/pw/AP1GczOIry9PeqFLeti2ega_aCBbncqcq_GB1jlMW8tXLrYtr06YdM70Ilnwcp7MGSfRGgkmCnpwOu1xVxBSRopwQTocA5KrlBoe5m-WQr5QlMUL_AeswEj4",
  "https://lh3.googleusercontent.com/pw/AP1GczM1551KJHDDiVWqoYvNFAOiSvfsuukvJhgQ1CckGtodFIyinhLC-PJQdWYQCxxH8bkKB1AOF0a3YKNXW3X2p2fvCXyF_VBbaTZb21LescS0TQpIngNL",
  "https://lh3.googleusercontent.com/pw/AP1GczNDnQBfhBEMMihlQZEzCw7e2azzcyO-SuydeJlPhaI_GgWlVIZC3MV4CtyorHWq72wRhnRueR_atxPrLUOTWhj6_QXVevb5V17w1e1J-dhNTomql07a",
  "https://lh3.googleusercontent.com/pw/AP1GczOK1cSwNRAHM_JuzopXSpgJA6tcvbhpZ8NgHxFkKA0MX4ErCaBRz9L_5ejcKMlksTAzt_LoNnidYRBzJQ0pQ1bp6bvDFoS6P3CjbFZxsloYujAPcegh",
  "https://lh3.googleusercontent.com/pw/AP1GczO0EhUKinLxnww67daBx0cUDK40vGDTF4poo6SUaMgktj7SEHkwJJsRTkUzsH4043bVEH8g67m_QI2pbu6ijiN4Dw8EKiTwUwBO5k_mia9sgOs3zTYX",
  "https://lh3.googleusercontent.com/pw/AP1GczN9a0G2c7m_HTUv8kt85xnZeBulQFaZ972NcLVb3wTKlM-ll86lVYZ5jydRco-5dEHxgX-zTyadqjXUPcc3qAQILafYV222TrW5lingCmnv5Pws-kYU",
  "https://lh3.googleusercontent.com/pw/AP1GczNJXqSgeVYpQVnIWLH3VAQKS0SuqeMvtwr9fmJ-t2e5J98tAeLFvVdqAJXDyAiElIlyncT3tZESii39BepE_1ZEISx8GTh0PL51XQxisGnJmOyLB5Ca",
  "https://lh3.googleusercontent.com/pw/AP1GczNRlRWYqGKddmz049D4ZDbgfFj6n2S1QQ5dEEM49HwjpUlWHceKQ90AnuOCcZA3BaktAUKzxLaHXy9yycIAhn4I3ZDwI7JdyvPTdRAguENkBeVQROfC",
  "https://lh3.googleusercontent.com/pw/AP1GczPDr_Di3Eh4VPpUFSabG90XxkzvV9qDrJNi4mhxPjGRETsqSUnt1b2BgFdWyMqdU2-F1eMoIPM2DL0vuhCIynQwtyJKmddqoAUBq4DzMVtTFtuqC8tq",
  "https://lh3.googleusercontent.com/pw/AP1GczMKOSUu5NvFOkGh7ZqM5CZkJqvBqjs9PgSFAyUvMYP2728DTcn-zKUmsdRr-r9BtWvFg2l37oVbZIfy3f759YQTBtW5RBhSTx1qFEWN3lvJh7I2nTmg",
  "https://lh3.googleusercontent.com/pw/AP1GczOcmHHbz0hCZp6pWqeWqHYZe1qWvmFrOcG46RpYTVSEgGWFpZrMWpvoOI-Gzq_Df0UyEt0uPeveIoio5a6rS2cMcW4JpQXMGqBlYe8jS4mYAsm_9M07",
  "https://lh3.googleusercontent.com/pw/AP1GczOUoJGct8aJ3fUqalvwvQYefxzT7SQfGPJD2CX1RQQojYHAQUyK-F6xYIfkjMT9dPRIp_vV_U7R9_yZ1ktFLGi2mAetI084asXNrcyzVO5z7TOUUGJI"
];

export const ALL_PROJECT_PHOTOS = RAW_PHOTO_URLS.map((url, idx) => {
  const num = idx + 1;
  let stage = "";
  let stageShort = "";
  let techFocus = "";

  if (num <= 24) {
    stage = "1. Terreno, Vistas y Sondeos (#1-#24)";
    stageShort = "Terreno y Sondeos";
    techFocus = "Topografía inicial (+100.00m a +96.20m), sondeos SPT S1-S3 (GEO-STAN #2956) y visual hacia el Río Paraguay.";
  } else if (num <= 48) {
    stage = "2. Excavación y Movimiento de Suelo (#25-#48)";
    stageShort = "Excavación Subsuelo";
    techFocus = "Desmonte para subsuelo (-2.34m), perfilado de taludes en arena limosa SM y exposición de medianera Eje 9.";
  } else if (num <= 78) {
    stage = "3. Zapatas, Fundaciones y Muros de Piedra (#49-#78)";
    stageShort = "Zapatas y Fundaciones";
    techFocus = "Profundización de zapatas a cota +95.36m (-4.64m), vigas de equilibrio VC.T-1 (40x50) y vigas de pórticos 1-7.";
  } else if (num <= 102) {
    stage = "4. Pilares y Encofrado de Losa 1 (#79-#102)";
    stageShort = "Pilares y Encofrado";
    techFocus = "Hormigonado de los 20 pilares P1-P20 (HA-25, 240.3 a 264.85 kg/cm²) y armado de encofrado para Losa 1 y Escalera 1.";
  } else {
    stage = "5. Hormigonado Losa 1 y Estado Actual (#103-#118)";
    stageShort = "Losa 1 y Estado Actual";
    techFocus = "Carga y desencofrado de Losa 1 en hormigón visto (305.6 a 325.75 kg/cm²), Escalera 1 y pelos de arranque para 17 pilares de PA.";
  }

  return {
    id: `photo_${String(num).padStart(3, "0")}`,
    number: num,
    url,
    stage,
    category: stageShort,
    title: `Registro de Obra #${num} — ${stageShort}`,
    desc: techFocus
  };
});

// Catálogo Completo de los Planos Disponibles en /assets/planos/ y /assets/
export const ALL_BLUEPRINTS_CATALOG = [
  // Estructurales (Ing. Gustavo Velázquez — Reg. MOPC N° 3135)
  {
    id: "E1",
    code: "E1",
    category: "Estructurales",
    title: "E1 — Planta de Fundación y Ejes de Replanteo",
    author: "Ing. Gustavo Velázquez (Reg. N° 3135 M.O.P.C.)",
    url: "./assets/planos/estructural_e1_replanteo.png",
    scale: "1:50",
    status: "Ejecutado 100%",
    desc: "Cuadrícula exacta de Ejes 1 a 9 (ancho 9.74m) y Ejes A a G (largo 10.34m), cuadro de elementos de cimentación y vigas centradoras VC.T-1 (40x50 cm)."
  },
  {
    id: "E2",
    code: "E2",
    category: "Estructurales",
    title: "E2 — Detalle de Zapatas y Vigas de Equilibrio",
    author: "Ing. Gustavo Velázquez (Reg. N° 3135 M.O.P.C.)",
    url: "./assets/planos/estructural_e2_zapatas.png",
    scale: "1:50",
    status: "Ejecutado 100%",
    desc: "Despiece de armaduras B 500 S de zapatas aisladas y combinadas (P2-P5, P3-P6, P4-P7, P13-P14, P16-P18, P19-P20) y vigas centradoras VC.T-1."
  },
  {
    id: "E3",
    code: "E3",
    category: "Estructurales",
    title: "E3 — Encofrado Losa sobre Subsuelo / Planta Baja (+2.34m est.)",
    author: "Ing. Gustavo Velázquez (Reg. N° 3135 M.O.P.C.)",
    url: "./assets/planos/estructural_e3_planta_baja.png",
    scale: "1:50",
    status: "Ejecutado 100%",
    desc: "Planta de vigas y losas macizas L1 (Galería rebajada -0.45m), L2, L3 y L4 en Cota +100.00m (+2.34m estructural). Ensayo PROBETI: 305.6 a 325.75 kg/cm²."
  },
  {
    id: "E4",
    code: "E4",
    category: "Estructurales",
    title: "E4 — Encofrado Losa Planta Alta / 2do Piso (+102.88m / +2.88m)",
    author: "Ing. Gustavo Velázquez (Reg. N° 3135 M.O.P.C.)",
    url: "./assets/planos/estructural_e4_planta_alta.png",
    scale: "1:50",
    status: "A Construir (17 Pilares ya en +2.88m)",
    desc: "Losa de Planta Alta (L1 a L11 en cota +102.88m / +2.88m s/calle) alineada al frente sobre Eje G (z = 3.00m, sin balcón frontal) y con Deck 2 al Río. Muestra que P12, P13 y P15 mueren en 0.00m mientras los otros 17 pilares ya están hormigonados hasta +2.88m."
  },
  {
    id: "E5",
    code: "E5",
    category: "Estructurales",
    title: "E5 — Vigas de Subsuelo (Pórticos 1-7) y Escalera 1",
    author: "Ing. Gustavo Velázquez (Reg. N° 3135 M.O.P.C.)",
    url: "./assets/planos/estructural_e5_subsuelo_escalera.png",
    scale: "1:50",
    status: "Ejecutado 100%",
    desc: "Despiece de vigas de nivel Subsuelo (+97.66m / -2.34m) y armadura de Escalera 1 de hormigón armado."
  },
  {
    id: "E9",
    code: "E9",
    category: "Estructurales",
    title: "E9 — Cuadro de Pilares P1 a P20 y Despiece Vertical",
    author: "Ing. Gustavo Velázquez (Reg. N° 3135 M.O.P.C.)",
    url: "./assets/planos/estructural_e9_cuadro_pilares.png",
    scale: "1:50",
    status: "Ejecutado hasta PB / A Construir PA-Techo",
    desc: "Secciones, armaduras longitudinales Ø12 y estribos Ø6 por nivel (Cimentación, Subsuelo, Planta Baja y Planta Alta) para los 20 pilares."
  },

  // Instalaciones
  {
    id: "IS_IH",
    code: "IS/IH",
    category: "Instalaciones",
    title: "IS/IH — Instalación Sanitaria Cloacal y Agua Fría/Caliente",
    author: "Equipo Técnico / Arq. Gabriela Rolón",
    url: "./assets/planos/instalacion_sanitaria_agua.png",
    scale: "1:50",
    status: "Proyecto Ejecutivo",
    desc: "Trazado de agua fría/caliente PPR, cámaras de inspección y desagüe cloacal (incluye cámara séptica y pozo absorbente para el subsuelo)."
  },
  {
    id: "IAA",
    code: "IAA",
    category: "Instalaciones",
    title: "IAA — Instalación de Desagüe Pluvial y Canaletas",
    author: "Equipo Técnico / Arq. Gabriela Rolón",
    url: "./assets/planos/instalacion_desague_pluvial.png",
    scale: "1:50",
    status: "Proyecto Ejecutivo",
    desc: "Evacuación pluvial de cubiertas, canaletas perimetrales, bajadas Ø100mm y drenaje de terrazas hacia zona baja."
  },
  {
    id: "ISD",
    code: "ISD",
    category: "Instalaciones",
    title: "ISD — Instalación de Señales Débiles (Datos, TV, CCTV y Portero)",
    author: "Equipo Técnico / Arq. Gabriela Rolón",
    url: "./assets/planos/instalacion_senales_debiles.png",
    scale: "1:50",
    status: "Proyecto Ejecutivo",
    desc: "Bocas de red RJ45 Cat6, TV, cámaras de seguridad y portero eléctrico (omitido en 0 Gs en rubros 29.4/29.5 del presupuesto general)."
  },
  {
    id: "IE_PLANTAS",
    code: "IE-1",
    category: "Instalaciones",
    title: "IE-1 — Instalación Eléctrica: Plantas de Iluminación, Tomas y AA",
    author: "Equipo Técnico / Arq. Gabriela Rolón",
    url: "./assets/planos/instalacion_electrica_plantas.png",
    scale: "1:50",
    status: "Proyecto Ejecutivo",
    desc: "Distribución de circuitos de iluminación, tomacorrientes, puntos de aire acondicionado Split y tableros seccionales."
  },
  {
    id: "IE_UNIFILAR",
    code: "IE-2",
    category: "Instalaciones",
    title: "IE-2 — Esquema Unifilar, Cuadro de Cargas y Climatización",
    author: "Equipo Técnico / Arq. Gabriela Rolón",
    url: "./assets/planos/instalacion_electrica_unifilar_aa.png",
    scale: "S/E",
    status: "Proyecto Ejecutivo",
    desc: "Diagrama unifilar de tableros, llaves termomagnéticas, disyuntores diferenciales y equilibrio de fases ANDE."
  },

  // Arquitectura
  {
    id: "ARQ_ACOTADO_SVG",
    code: "ARQ-1",
    category: "Arquitectura",
    title: "Planta Arquitectónica Acotada Vectorial (SVG / PNG)",
    author: "Arq. Gabriela Rolón",
    url: "./assets/plano_acotado.svg",
    pngUrl: "./assets/plano_acotado-1.png",
    scale: "1:50",
    status: "Proyecto Ejecutivo",
    desc: "Planta acotada de alta precisión con dimensiones interiores, galería al río, estar-comedor, cocina y suite."
  },
  {
    id: "ARQ_GA_LEO",
    code: "ARQ-2",
    category: "Arquitectura",
    title: "Lámina General de Arquitectura (Modelo Ga-Leo)",
    author: "Arq. Gabriela Rolón",
    url: "./assets/planos/arquitectura_ga_leo_modelo.png",
    scale: "1:50 / 1:100",
    status: "Proyecto Integral",
    desc: "Plantas arquitectónicas completas, cortes longitudinales/transversales y fachadas del proyecto original."
  },
  {
    id: "ARQ_LG_RB",
    code: "ARQ-3",
    category: "Arquitectura",
    title: "Proyecto de Adecuación y Cerramiento (LG-RB)",
    author: "Arq. Gabriela Rolón",
    url: "./assets/planos/arquitectura_lg_rb.png",
    scale: "1:50",
    status: "Adecuación de Etapa",
    desc: "Plano vinculado a la planilla de cómputo LG-RB + Lozarrap para cierre habitable de primera etapa."
  },
  {
    id: "SUB_EJEC_1",
    code: "SUB-1",
    category: "Arquitectura",
    title: "Subsuelo Ejecutivo — Planta de Distribución (Lámina 1)",
    author: "Arq. Gabriela Rolón",
    url: "./assets/subsuelo_ejecutivo_1-1.png",
    scale: "1:50",
    status: "Proyecto Ejecutivo",
    desc: "Distribución arquitectónica del departamento autónomo en subsuelo (cota +97.66m / -2.34m)."
  },
  {
    id: "SUB_EJEC_2",
    code: "SUB-2",
    category: "Arquitectura",
    title: "Subsuelo Ejecutivo — Cortes y Detalles (Lámina 2)",
    author: "Arq. Gabriela Rolón",
    url: "./assets/planos/subsuelo_ejecutivo_2.png",
    scale: "1:50",
    status: "Proyecto Ejecutivo",
    desc: "Detalles constructivos, carpinterías y niveles del departamento inferior y escalera lateral."
  },

  // Geotecnia y Entorno
  {
    id: "GEO_CORTE_SVG",
    code: "GEO-1",
    category: "Geotecnia y Entorno",
    title: "Corte Geotécnico y Perfil Topográfico del Barranco (SVG)",
    author: "GEO-STAN S.R.L. (Estudio N° 2956)",
    url: "./assets/corte_terreno.svg",
    pngUrl: "./assets/corte-1.png",
    scale: "1:100",
    status: "Verificado en Obra",
    desc: "Perfil longitudinal mostrando cotas +100.00m (RN), +99.84m (S1), +97.15m (S2) y +96.20m (S3) y estratos de arena limosa sobre arenisca."
  },
  {
    id: "GEO_UBICACION_SVG",
    code: "GEO-2",
    category: "Geotecnia y Entorno",
    title: "Croquis de Ubicación de Sondeos S1, S2, S3 y Coordenadas UTM",
    author: "GEO-STAN S.R.L. (Estudio N° 2956)",
    url: "./assets/ubicacion_terreno.svg",
    pngUrl: "./assets/ubicacion_01-1.png",
    scale: "1:200",
    status: "Verificado en Obra",
    desc: "Ubicación planimétrica de las perforaciones SPT y punto de referencia RN (UTM 21S 433024E, 7203554N)."
  },
  {
    id: "ENT_SATELITAL",
    code: "URB-1",
    category: "Geotecnia y Entorno",
    title: "Contexto Satelital Anotado e Implantación hacia el Río Paraguay",
    author: "Relevamiento Satelital / Fotogrametría",
    url: "./assets/entorno/contexto_satelital_anotado.png",
    scale: "Zoom 19",
    status: "Relevamiento Real",
    desc: "Implantación en el cul-de-sac de Calle Guillermo Arias, galpón de Molinos Harineros al Sur y distancia de ~85-96m a la curva del Río Paraguay."
  },
  {
    id: "ENT_OSM",
    code: "URB-2",
    category: "Geotecnia y Entorno",
    title: "Mapa Urbano Catastral y Vial (OpenStreetMap)",
    author: "Cartografía Urbana Asunción",
    url: "./assets/entorno/mapa_urbano_osm.png",
    scale: "1:2000",
    status: "Relevamiento Real",
    desc: "Trama urbana del Barrio Itá Pytã Punta, Mirador, Pedro Melo de Portugal y tramo sin salida de Tte. Guillermo Arias."
  },

  // Presupuestos Escaneados Edifica Studio E.A.S. (Arq. Lissie Amarilla & Arq. Roque León)
  {
    id: "EDIF_573_P1",
    code: "EDIF-A1",
    category: "Presupuestos",
    title: "EDIF-A1 — Presupuesto Edifica Studio Opción A (Gs. 573.893.750) — Hoja 1",
    author: "Arq. Lissie Amarilla (R.P. 4.688) & Arq. Roque León (R.P. 4.598)",
    url: "./assets/planos/edifica_studio_573m_pag1.png",
    scale: "Planilla Original",
    status: "Presupuesto Estimativo (Mano de Obra + Mat.)",
    desc: "Planta a Nivel de Calle (Gs. 341.288.750) y Planta a Nivel de Terreno / Subsuelo (Gs. 167.543.750) con columnas Unid., Cantidad y P.U. en blanco."
  },
  {
    id: "EDIF_573_P2",
    code: "EDIF-A2",
    category: "Presupuestos",
    title: "EDIF-A2 — Presupuesto Edifica Studio Opción A (Gs. 573.893.750) — Hoja 2 y Firmas",
    author: "Arq. Lissie Amarilla (C.I. 4.688.741) & Arq. Roque León (C.I. 3.950.629)",
    url: "./assets/planos/edifica_studio_573m_pag2.png",
    scale: "Planilla Original",
    status: "Presupuesto Estimativo (Mano de Obra + Mat.)",
    desc: "Construcción Exterior Frente de Vivienda (Gs. 47.517.500), Equipamiento de Cocina (Gs. 17.543.750), Total General Gs. 573.893.750 y firmas profesionales."
  },
  {
    id: "EDIF_460_COMP",
    code: "EDIF-B1",
    category: "Presupuestos",
    title: "EDIF-B1 — Presupuesto Edifica Studio Opción B Reducida (Gs. 460.160.000)",
    author: "Arq. Lissie Amarilla (R.P. 4.688) & Arq. Roque León (R.P. 4.598)",
    url: "./assets/planos/edifica_studio_460m_completo.png",
    scale: "Planilla Original",
    status: "Presupuesto Reducido (-Gs. 113.733.750)",
    desc: "Opción B con recortes en Subsuelo (Gs. 103.281.250: sin piso, vidrio ni puertas de madera), Exterior (Gs. 31.052.500: sin muralla, vereda ni caminero vehicular) y sin muebles de cocina."
  },
  {
    id: "BANCO_REQ_CUOTAS",
    code: "BANCO-01",
    category: "Presupuestos",
    title: "BANCO-01 — Requisitos Técnicos del Banco (Código de Colores Negro/Verde/Rojo/Amarillo) y Tabla Oficial de Cuotas por Millón (6,5% y 9,9%)",
    author: "Entidad Bancaria / Caja Mutual",
    url: "./assets/planos/requisitos_banco_cuotas.png",
    scale: "Documento Oficial",
    status: "Normativa Bancaria Vigente",
    desc: "Exigencia de planilla de cómputo métrico y planos indicando: Negro lo ya construido, Verde hormigón, Rojo a construir y Amarillo a demoler o refaccionar; más tabla de cuotas por millón a 15, 20 y 30 años."
  },
  {
    id: "CREDITO_NUEVO_PREVISION",
    code: "BANCO-02",
    category: "Presupuestos",
    title: "BANCO-02 — El Crédito Nuevo (Caja Mutual 9,9% anual · 15 años / 180 cuotas · A sola firma · Con Seguros Incluidos)",
    author: "Previsión Financiera Ruth & Leo (Caja Mutual)",
    url: "./assets/planos/prevision_credito_nuevo.png",
    scale: "Tabla Oficial Cerrada",
    status: "Condiciones Cerradas",
    desc: "Cuotas mensuales reales con seguros incluidos a 15 años (180 cuotas) sin período de gracia y a sola firma: 250M (Gs. 2.941.477/mes), 300M (Gs. 3.529.773/mes), 350M (Gs. 4.118.068/mes) y 440M (Gs. 5.177.000/mes)."
  }
];

export const CAMERA_VIEWS = {
  aerial: {
    name: "Vista Aérea General",
    pos: [18, 26, 28],
    target: [0, 2, 5],
    desc: "Visión global del lote, pendientes y volumen arquitectónico."
  },
  street: {
    name: "Entrada Calle Guillermo Arias",
    pos: [0, 4, -14],
    target: [0, 2, 0],
    desc: "Aproximación peatonal y vehicular desde el cul-de-sac de Guillermo Arias."
  },
  parking: {
    name: "Muro de Estacionamiento Frontal",
    pos: [-8, 2, -6],
    target: [0, 0, -2],
    desc: "Inspección del muro de contención de 30cm para la cochera (z = -4.00m a +3.00m)."
  },
  gallery: {
    name: "Galería Panorámica al Río",
    pos: [0, 4.5, 12],
    target: [0, 3, 35],
    desc: "Vista directa hacia el río Paraguay desde la Galería Eje A-B y Planta Alta (+102.88m)."
  },
  losa2: {
    name: "Segunda Parte de la Losa (+2.88m) y Techo (+5.64m)",
    pos: [14, 12, 10],
    target: [0, 3, 8],
    desc: "Detalle de los 17 pilares que continúan a Planta Alta, losa +102.88m y cubierta +105.64m."
  },
  soil: {
    name: "Corte Geotécnico y Zapatas (-4.64m)",
    pos: [-22, 1, 10],
    target: [0, -1, 10],
    desc: "Perfil transversal mostrando los estratos SPT S1-S3 y zapatas profundizadas a +95.36m."
  },
  structure: {
    name: "Radiografía Estructural Exacta (Ejes 1-9 / A-G)",
    pos: [12, 10, 14],
    target: [0, 0, 8],
    desc: "Cuadrícula exacta de los 20 pilares P1..P20, vigas VC.T-1, Losa 1 ejecutada y niveles a construir."
  },
  walk: {
    name: "Recorrido en Primera Persona",
    pos: [0, 2.5, -4],
    target: [0, 2.5, 8],
    desc: "Paseo a escala humana por el interior de la residencia."
  }
};

// Renders 3D Ilustrados Fotorrealistas de Alta Definición
export const REALISTIC_RENDERS = [
  {
    id: "rio_atardecer",
    title: "Vista Panorámica al Río Paraguay (Atardecer)",
    subtitle: "Galería Voladiza (Ejes A-B) y Planta Alta a +102.88m",
    category: "Vista al Río",
    imgUrl: "./assets/render_rio_atardecer.jpg",
    desc: "Ilustración fotorrealista del remate hacia el Río Paraguay (~85-96m al Noroeste): Losa L1 rebajada (-0.45m) con barandas de seguridad sobre el barranco, ventanales corredizos en Eje B y Planta Alta (+102.88m) superando los techos vecinos.",
    stage: "Proyecto Terminado / Horizonte de Inversión",
    specs: {
      orientacion: "Noroeste hacia curva del Río Paraguay",
      materialidad: "Hormigón Visto HA-25 (315 kg/cm²), Vidrio Templado y Deck",
      espacio: "Galería L1 de 33.1 m² + Estar de 24 m² + PA a +102.88m"
    }
  },
  {
    id: "fachada_calle",
    title: "Acceso Cul-de-Sac Calle Guillermo Arias y Cochera",
    subtitle: "Muro de Contención Frontal (z = -4m a +3m) y Fachada Eje G",
    category: "Fachada Urbana",
    imgUrl: "./assets/render_fachada_calle.jpg",
    desc: "Ilustración de la etapa prioritaria sobre el tramo sin salida de Calle Tte. Guillermo Arias: muro de contención para nivelar el estacionamiento frontal hasta el Eje G (z = +3.00m), portón vehicular automatizado y voladizo de Planta Alta (z = +2.15m).",
    stage: "Etapa Inmediata a Ejecutar",
    specs: {
      cotaAcceso: "+100.00 m (Nivel Calle RN)",
      contencion: "Muro ciclópeo de piedra y H°A° (46.7 m²) con drenaje francés",
      acceso: "2 Vehículos (z = -4m a +3m) + Acceso Peatonal"
    }
  },
  {
    id: "corte_obra",
    title: "Corte 3D Estructural y Etapas Constructivas Reales",
    subtitle: "Esqueleto Ejecutado hasta Losa 1 + Continuación 17 Pilares + Techo +105.64m",
    category: "Corte Pedagógico",
    imgUrl: "./assets/render_corte_obra.jpg",
    desc: "Muestra las zapatas profundizadas a cota +95.36m (-4.64m) sobre arenisca firme (GEO-STAN #2956), el subsuelo (-2.34m) y la Losa 1 (0.00m) ya ejecutados por JIVESA S.A., junto con los 17 pilares que continúan a Planta Alta (+2.88m) y Techo (+5.64m).",
    stage: "Esquema Constructivo de Inversión",
    specs: {
      suelo: "Arenisca Cementada (Nspt > 50) con zapatas a -4.64m",
      hormigon: "HA-25 verificado por PROBETI (240 a 325 kg/cm²)",
      cubierta: "Isopanel Termoacústico en cota +105.64m (+5.64m)"
    }
  },
  {
    id: "implantacion_aerea",
    title: "Implantación Aérea en el Barranco de Itá Pytã Punta",
    subtitle: "Relación con Casas Vecinas, Molinos Harineros y el Río Paraguay",
    category: "Entorno Urbano",
    imgUrl: "./assets/render_implantacion_aerea.jpg",
    desc: "Perspectiva aérea mostrando cómo el segundo nivel (+102.88m) y la cubierta (+105.64m) emergen por encima de los techos bajos de tejas linderos para dominar el paisaje hacia la curva del Río Paraguay.",
    stage: "Implantación Urbana Real",
    specs: {
      coordenadas: "25°16'58.1\"S 57°39'55.1\"W (UTM 21S 433024E 7203554N)",
      distanciaRio: "~85 a 96 metros al Noroeste",
      cotaCumbrera: "+105.64 m (+5.64 m sobre calle Guillermo Arias)"
    }
  },
  {
    id: "interior_estar_rio",
    title: "Interior Estar-Comedor Integrado a la Galería L1",
    subtitle: "Visual Franca al Río sobre el Eje B (Pilares P2, P5, P9, P16, P18)",
    category: "Interiorismo",
    imgUrl: "./assets/render_interior_estar_rio.jpg",
    desc: "Vista desde el estar social en cota +100.00m hacia la Galería rebajada (-0.45m), aprovechando la losa de hormigón visto ya ejecutada y los paños corredizos de vidrio templado.",
    stage: "Escenario 3 (440M Gs)",
    specs: {
      losaExistente: "Hormigón visto 315 kg/cm² (Losa L1-L4 ejecutada)",
      aberturas: "Blindex templado 8-10mm sobre línea de Eje B",
      piso: "Porcelanato rectificado 60x60 cm"
    }
  },
  {
    id: "subsuelo_barranco",
    title: "Departamento Autónomo en Subsuelo y Patio Inferior",
    subtitle: "Pórticos 1-7 en Cota +97.66m (-2.34m) y Escalera 1 Ejecutada",
    category: "Subsuelo",
    imgUrl: "./assets/render_subsuelo_barranco.jpg",
    desc: "Vista desde el patio trasero (+96.20m) hacia el subsuelo (-2.34m) y el voladizo de la Galería L1 (-0.45m), destacando la necesidad de barandas de seguridad (caída de 3.20m) y cámara séptica/pozo absorbente en el nivel inferior.",
    stage: "Potencial de Renta / Huéspedes",
    specs: {
      nivelSubsuelo: "Cota +97.66m (-2.34m respecto a calle)",
      estructuraActual: "Vigas Pórticos 1-7, Pilares y Escalera 1 al 100%",
      requisitosForenses: "Aislación Medianera Eje 9 + Pozo Cloacal / Bombeo"
    }
  },
  {
    id: "etapa_300m_habitable",
    title: "Etapa 1 (Crédito Gs. 300M) — Casa 3 Niveles Cerrada y Habitable",
    subtitle: "Envolvente Tobatí + Techo Isopanel +105.64m + Cochera SUV Chery Tiggo 2 Pro",
    category: "Etapa 1 (300M)",
    imgUrl: "./assets/render_etapa_300m_habitable.jpg",
    desc: "Visualización de cómo queda la vivienda al finalizar la Etapa 1 (Crédito Gs. 300M): 3 niveles cerrados y revocados, techo termoacústico Isopanel PIR 50mm en +105.64m, aberturas Blindex, portón balancín motorizado con la SUV Chery Tiggo 2 Pro 2026 estacionada y mudanza inmediata con equipamiento propio (Gs. 0).",
    stage: "Etapa 1 — Crédito Gs. 300 Millones",
    specs: {
      superficieCubierta: "313,5 m² en 3 niveles (Subsuelo + PB + 2do Piso)",
      mudanzaInmediata: "Gs. 0 en muebles/electrodomésticos (inventario propio Ruth y Leo)",
      cochera: "Explanada +100.00m con topes de rueda para Chery Tiggo 2 Pro 2026"
    }
  },
  {
    id: "suite_estudio_2do_piso",
    title: "Suite Principal + Home-Office Doble + Costura en 2do Piso (+102.88m)",
    subtitle: "Sommier 1,40m, 2 Escritorios, Biblioteca #2 (8 ml) y Máquina de Coser Antigua",
    category: "2do Piso (+102.88m)",
    imgUrl: "./assets/render_suite_estudio_2do_piso.jpg",
    desc: "Interior del 2do Piso (+102.88m) diseñado para Ruth y Leo: Suite con sommier propio de 1,40m, mesas de luz, tocadores, placares empotrados, baño en suite, Home-Office doble con 2 sillas ergonómicas, rincón de costura y vista panorámica al Río Paraguay.",
    stage: "Etapa 1 (300M) a Etapa 2 (350M)",
    specs: {
      nivel: "Planta Alta +102.88m (bajo cubierta Isopanel +105.64m)",
      equipamientoPropio: "Sommier 1,40m + 2 Escritorios + Máquina de Coser + Biblioteca 4x2m",
      seguridadMascotas: "Porcelanato satinado R9 (Emma) + Mallas en balcón (Serafina)"
    }
  },
  {
    id: "tablero_domotica_china_mep",
    title: "Tablero Inteligente Riel DIN (36-48 Módulos) + Domótica Zigbee China",
    subtitle: "Medidor Trifásico CT + 3 DPS/relés con Display + RCBOs por Circuito + Pases Losa 1",
    category: "Domótica & MEP",
    imgUrl: "./assets/render_tablero_domotica_china_mep.jpg",
    desc: "Equipamiento de compra directa en China (Kit 1 Gs. 2,36M / Kit 2 Gs. 3,88M): gabinete embutido de 36-48 módulos DIN con puerta fumée, telemetría trifásica ANDE en LAN local, corte automático por fuga mA o temperatura °C (>65°C), llaves táctiles Zigbee con cable Neutro y pases diamantados encamisados.",
    stage: "Obra Eléctrica de Cero (Sin Costo Extra de Tendido)",
    specs: {
      kit1Basico: "Gs. 2.365.000 importado vs Gs. 5.480.000 local (-57%)",
      kit2PrevencionTotal: "Gs. 3.885.000 importado vs Gs. 9.250.000 local (-58%)",
      pasesLosa1: "4 perforaciones diamantadas (Ø50mm / Ø63mm / Ø115mm) sin picar losa"
    }
  }
];

// Fórmulas paramétricas de insumos para no arquitectos (CAPACO / JIVESA S.A.)
export const PARAMETROS_INSUMOS = {
  losa: {
    cementoBolsasPorM2: 0.85,    // bolsas de 50 kg por m² de losa Rap + capa compresión
    hierroKgPorM2: 11.2,         // kg de varilla conformada por m²
    arenaM3PorM2: 0.07,          // m³ arena lavada
    piedraM3PorM2: 0.085,        // m³ piedra triturada 4ta
    costoM2BaseGs: 395000        // Costo por m² de losa (hormigón + armadura + apuntalamiento)
  },
  muroContencion: {
    piedraM3PorM2: 0.35,         // m³ piedra bruta por m² de muro
    cementoBolsasPorM2: 0.48,    // bolsas cemento
    arenaM3PorM2: 0.14,          // m³ arena
    hierroKgPorMl: 9.5,          // hierro en viga y pilaretes por metro lineal
    rellenoM3PorMl: 2.2,         // m³ relleno compactado por metro lineal
    costoM2MuroGs: 420000,       // Costo por m² de muro
    costoM3RellenoGs: 85000      // Costo por m³ relleno
  },
  techo: {
    isopanel: {
      nombre: "Isopanel Termoacústico 50mm (PIR)",
      costoM2Gs: 380000,
      desc: "Excelente aislación térmica y acústica contra el calor de Asunción. Rápido montaje y cero goteras."
    },
    chapaCincalum: {
      nombre: "Chapa Trapezoidal Cincalum N°25",
      costoM2Gs: 245000,
      desc: "Económico y duradero, requiere cielorraso con lana de vidrio para aislación térmica."
    },
    tejaColonial: {
      nombre: "Tejas y Tejuelones Cerámicos con Maderamen",
      costoM2Gs: 340000,
      desc: "Estética tradicional paraguaya, mayor peso estructural y tiempo de montaje."
    }
  },
  cerramiento: {
    basico: {
      nombre: "Cierre Básico (Mampostería revocada + aberturas estándar)",
      factorCosto: 1.0,
      costoM2Gs: 750000
    },
    confort: {
      nombre: "Cierre Confort (Ventanales Blindex templado + aislación)",
      factorCosto: 1.35,
      costoM2Gs: 1012500
    },
    premium: {
      nombre: "Cierre Premium (Vidrios DVH doble vidriado + pisos porcelanato)",
      factorCosto: 1.80,
      costoM2Gs: 1350000
    }
  }
};

// Comparativa Técnica, Acústica y de Costos del Techo (Chapa Termoacústica vs. Tejas de Tobatí)
// Especialmente enfocada en que el Dormitorio en Suite y Estudio de Ruth y Leo están en el 2do Piso (+102.88m) bajo la cubierta (+105.64m)
export const COMPARATIVA_TECHO_ACUSTICA_COSTOS = {
  contextoDormitorio2doPiso:
    "Dado que el Dormitorio Principal en Suite y el Estudio de Ruth y Leo se ubican en el 2do Piso (+102.88m) directamente debajo de la cubierta (+105.64m), el aislamiento acústico frente a las tormentas subtropicales de Asunción (>100 mm/h) y el aislamiento térmico al sol del Noroeste sobre el Río Paraguay son factores decisivos.",
  opciones: [
    {
      id: "opcion_a1_isopanel_solo",
      codigo: "Opción A1",
      style3D: "isopanel",
      titulo: "Chapa Termoacústica Sándwich (Isopanel PIR/EPS 50mm) a la Vista",
      aislacionTermica: "Muy Buena (U = 0.44 W/m²K — Núcleo PIR 50mm)",
      aislacionAcusticaLluvia: "Media-Baja frente a tormenta tropical (~56 a 62 dB en Dormitorio 2do Piso)",
      ruidoLluviaDb: "58 dB (Alto tamborileo metálico)",
      pesoPropioKgM2: "11.5 kg/m² (Ultraliviano)",
      pendienteMinima: "7% a 10% (86 m² de faldón)",
      requiereCielorrasoDormitorio: "Sí, altamente recomendado para dormir sin ruido de lluvia intensa",
      costoEstructuraGs: 12100000,
      costoCubiertaGs: 30800000,
      costoCanaletasGs: 4950000,
      costoCielorrasoAcusticoGs: 0,
      costoTotalGs: 47850000,
      fuenteReferencia: "📐 Edifica Studio PB #2 (Gs. 12,1M) + #5 Techo Chapas (Gs. 30,8M) + #19 Pluvial (Gs. 4,95M)",
      veredictoIA: "Rápido montaje y estanco, pero en lluvias torrenciales de verano el golpe de gota sobre la chapa superior transmite vibración (~58 dB) al dormitorio si no lleva cielorraso acústico."
    },
    {
      id: "opcion_a2_isopanel_mas_cielorraso",
      codigo: "Opción A2",
      style3D: "isopanel",
      titulo: "Chapa Termoacústica Isopanel 50mm + Cielorraso Acústico Durlock c/ Lana de Vidrio 50mm en 2do Piso",
      aislacionTermica: "Excelente (U = 0.26 W/m²K — Doble barrera + cámara de aire)",
      aislacionAcusticaLluvia: "Excelente (~39 a 41 dB en Dormitorio 2do Piso • Reducción de -18 dB)",
      ruidoLluviaDb: "39 dB (Silencio de dormitorio)",
      pesoPropioKgM2: "21.0 kg/m² (Liviano)",
      pendienteMinima: "7% a 10% (86 m² de faldón + 54 m² cielorraso PA)",
      requiereCielorrasoDormitorio: "Incluido (54 m² sobre Suite y Estudio en 2do Piso)",
      costoEstructuraGs: 12100000,
      costoCubiertaGs: 30800000,
      costoCanaletasGs: 4950000,
      costoCielorrasoAcusticoGs: 8370000,
      costoTotalGs: 56220000,
      fuenteReferencia: "📐 Edifica Studio (Gs. 47.850.000) + 🤖 Cielorraso Acústico 54 m² × Gs. 155.000/m² (Gs. 8.370.000)",
      veredictoIA: "Soluciona al 100% el ruido de lluvia en la chapa metálica, pero eleva la inversión del techo + cielorraso de PA a Gs. 56.220.000."
    },
    {
      id: "opcion_b_tejas_tobati",
      codigo: "Opción B (Recomendada Confort/Precio)",
      style3D: "tejas",
      titulo: "Tejas Cerámicas de Tobatí (Coloniales/Prensadas) sobre Tejuelones Vistos + Membrana Aislante + Tijerales",
      aislacionTermica: "Muy Buena / Inercia Térmica Cerámica + Membrana Aluminizada 10mm",
      aislacionAcusticaLluvia: "Excelente por Naturaleza (~38 a 42 dB en Dormitorio • Sin efecto tambor)",
      ruidoLluviaDb: "38 dB (Sonido sordo y cálido)",
      pesoPropioKgM2: "~70 kg/m² (Soportado con holgura por los 14 pilares de H°A° que suben a +105.64m)",
      pendienteMinima: "28% a 30% (~96 m² de faldón inclinado)",
      requiereCielorrasoDormitorio: "No requiere cielorraso adicional: el tejuelón cerámico + maderamen cepillado queda visto y cálido desde el Día 1",
      costoEstructuraGs: 16800000,
      costoCubiertaGs: 27650000,
      costoCanaletasGs: 4950000,
      costoCielorrasoAcusticoGs: 0,
      costoTotalGs: 49400000,
      fuenteReferencia: "🏺 Olerías Tobatí Directo + 🤖 Cómputo 96 m² × Gs. 514.583/m² (Solo +Gs. 1.550.000 vs. Chapa sola y ahorra Gs. 6.820.000 vs. Chapa + Cielorraso)",
      veredictoIA: "La mejor relación confort acústico / precio para el Dormitorio del 2do Piso: absorbe naturalmente el ruido de tormentas (38 dB) sin gastar Gs. 8,37M en cielorraso acústico, dejando un interior cálido de tejuelón visto y madera."
    }
  ]
};

// Calculadora Exacta de Ladrillos de Tobatí por Nivel y Tipo de Muro + Enlaces Directos de Compra
export const CALCULADORA_LADRILLOS_TOBATI = {
  resumenEjecutivo:
    "Hoy la obra tiene 0 m² de ladrillos (100% esqueleto H°A°). Comprando directo de olerías de Tobatí por camionada cerrada de 10.000 unidades (Gs. 550/u = Gs. 5.500.000), toda la casa de 3 niveles + el Muro de Contención se levanta con 18.000 ladrillos comunes de 1ra (1,8 camionadas = Gs. 9.900.000 en fábrica + ~Gs. 1.700.000 de 2 fletes = Gs. 11.600.000 puestos en Itá Pytã Punta).",
  preciosReferenciaTobati: [
    {
      tipoId: "comun_1ra_tobati",
      nombre: "Ladrillo Común de 1ra Calidad Tobatí (Macizo cocido parejo — Ideal Muro Visto y Contención)",
      medidasCm: "5.5 × 12 × 25 cm",
      precioUnitarioGs: 550,
      precioLote10kGs: 5500000,
      unidadesPorM2Soga15: 58,
      unidadesPorM2Muro30: 110,
      usoRecomendado: "Muro de Contención 0.30m (alta resistencia a compresión/humedad) + Paredes vistas/rústicas o revocadas en Nivel Calle, 2do Piso y Subsuelo",
      fuenteUrl: "https://www.hendyla.com/anuncios/ladrillos-comunes-de-tobati-de-primera-calidad-10-000-unidades-5500000-gs_264809.html"
    },
    {
      tipoId: "comun_economico_tobati",
      nombre: "Ladrillo Común Estándar / Económico Tobatí (Para muros revocados ambas caras)",
      medidasCm: "5.5 × 12 × 25 cm",
      precioUnitarioGs: 700,
      precioLote10kGs: 7000000,
      unidadesPorM2Soga15: 58,
      unidadesPorM2Muro30: 110,
      usoRecomendado: "Mampostería interior a revocar por puchadas menores en depósitos de Asunción",
      fuenteUrl: "https://clasipar.paraguay.com/servicios/construccion-reformas/materiales-de-construccion-de-tobati-ladrillos-comunes-huecos-prensados-tejas-tejuelones-1269529"
    },
    {
      tipoId: "tres_agujeros_tobati",
      nombre: "Ladrillo Semiprensado 3 Agujeros Tobatí",
      medidasCm: "7 × 12 × 25 cm",
      precioUnitarioGs: 980,
      precioLote10kGs: 9800000,
      unidadesPorM2Soga15: 46,
      unidadesPorM2Muro30: 92,
      usoRecomendado: "Fachadas de ladrillo visto calibrado y muros exteriores de Planta Baja",
      fuenteUrl: "https://www.instagram.com/materialesdec_tobati/"
    },
    {
      tipoId: "hueco_6_agujeros_tobati",
      nombre: "Ladrillo Cerámico Hueco 6 Agujeros (12×18×25 cm — Liviano p/ Planta Alta)",
      medidasCm: "12 × 18 × 25 cm",
      precioUnitarioGs: 1280,
      precioLote10kGs: 12800000,
      unidadesPorM2Soga15: 22,
      unidadesPorM2Muro30: 44,
      usoRecomendado: "Elevación rápida y liviana en Nivel Calle y 2do Piso (+102.88m) con cámara de aire térmica en celdas",
      fuenteUrl: "https://www.instagram.com/materialesdec_tobati/"
    }
  ],
  computoPorSector: [
    {
      sectorId: "muro_contencion_pasillo",
      sector: "1. Muro de Contención Estacionamiento (z=+1.50m) y Cabezales Pasillo Antihumedad",
      espesor: "0.30 m (Doble soga armada 2Ø6mm)",
      areaNetaM2: 46.70,
      ladrillosComunesUn: 5150,
      ladrillosHuecos6AgUn: 0,
      subtotalLadrillosComunGs: 2832500,
      notaTecnica: "Bajo tierra y empuje vehicular se exige ladrillo macizo común de 1ra (110 u/m² × 46.70 m² = 5.137 u → 5.150 u). Nunca usar ladrillo hueco en contención."
    },
    {
      sectorId: "planta_nivel_calle",
      sector: "2. Planta a Nivel de Calle (+100.00m): Gran Sala de Estar, Comedor, Cocina y Toilette",
      espesor: "0.15 m (Soga exterior e interior)",
      areaNetaM2: 112.00,
      ladrillosComunesUn: 6496,
      ladrillosHuecos6AgUn: 2464,
      subtotalLadrillosComunGs: 3572800,
      subtotalLadrillosHuecoGs: 3153920,
      notaTecnica: "Descontados los 24 m² de ventanal Blindex al Río en Eje B y las puertas Principal y de Servicio en Eje G."
    },
    {
      sectorId: "planta_alta_2dopiso",
      sector: "3. Segundo Piso (+102.88m): Dormitorio en Suite Ruth & Leo, Baño Principal y Estudio",
      espesor: "0.15 m (Perímetro PA + Divisorias)",
      areaNetaM2: 68.00,
      ladrillosComunesUn: 3944,
      ladrillosHuecos6AgUn: 1496,
      subtotalLadrillosComunGs: 2169200,
      subtotalLadrillosHuecoGs: 1914880,
      notaTecnica: "Incluye muros exteriores del 2do Piso y cerramiento de Suite y Baño (tabique sobre losa sin viga lleva Durlock liviano en partida 13.5)."
    },
    {
      sectorId: "subsuelo_lavadero_deposito",
      sector: "4. Subsuelo (+97.66m): Cerramiento de Lavadero, Depósito y Cámara Técnica (en los 100.71 m² libres)",
      espesor: "0.15 m (Con cajón hidrófugo Sika-1)",
      areaNetaM2: 28.00,
      ladrillosComunesUn: 1624,
      ladrillosHuecos6AgUn: 620,
      subtotalLadrillosComunGs: 893200,
      subtotalLadrillosHuecoGs: 793600,
      notaTecnica: "Cerramiento puntual del núcleo de Lavadero y Depósito desde el Día 1 dejando libre el resto de los 100.71 m² bajo Losa 1."
    }
  ],
  alternativasCompraTotal: [
    {
      id: "alt_todo_comun_tobati",
      titulo: "Alternativa 1: Todo con Ladrillo Común 1ra de Tobatí (Ideal si se deja Ladrillo Visto/Bolseado en Etapa 1)",
      detalleUnidades: "5.150 u (Contención 0.30m) + 12.064 u (208 m² muros 0.15m) + 5% merma = 18.000 Ladrillos Comunes (1,8 camionadas de 10.000)",
      totalUnidades: 18000,
      costoFabricaGs: 9900000,
      costoFleteAsuncionGs: 1700000,
      costoTotalPuestoEnObraGs: 11600000,
      ahorroConPalancaVistoGs: 31500000,
      ventaja: "Permite habitar con paredes interiores de ladrillo visto junta enrasada + hidrofugado transparente en Etapa 1, postergando ~Gs. 31,5M de revoque fino interior y pintura látex para que los Gs. 350M rindan al máximo en Porcelanato 60×60 y Cocina."
    },
    {
      id: "alt_combinada_comun_y_hueco",
      titulo: "Alternativa 2: Combinada Técnica (Común Macizo en Contención + Hueco 6 Agujeros en Elevación)",
      detalleUnidades: "5.150 Ladrillos Comunes 1ra (Gs. 2.832.500) + 4.580 Ladrillos Huecos 6 Agujeros c/ 5% merma (Gs. 5.862.400)",
      totalUnidades: 9730,
      costoFabricaGs: 8694900,
      costoFleteAsuncionGs: 1500000,
      costoTotalPuestoEnObraGs: 10194900,
      ahorroConPalancaVistoGs: 0,
      ventaja: "Ahorra Gs. 1.405.100 en compra de ladrillos, reduce en un 38% el consumo de mortero de asiento y aligera la carga muerta sobre el 2do Piso (+102.88m), aunque exige revoque para tapar el ladrillo hueco."
    }
  ],
  proveedoresDirectosTobati: [
    {
      nombre: "Materiales de Construcción Tobatí (@materialesdec_tobati)",
      contacto: "WhatsApp +595 976 203135",
      whatsappUrl: "https://wa.me/595976203135",
      instagramUrl: "https://www.instagram.com/materialesdec_tobati/",
      productos: "Ladrillos comunes 1ra, huecos 6 agujeros, laminados, tejuelones y tejas coloniales/prensadas con camión propio a Asunción."
    },
    {
      nombre: "Hendyla — Lote 10.000 Ladrillos Comunes 1ra de Tobatí",
      contacto: "Tel. / WhatsApp 0971-189199",
      whatsappUrl: "https://wa.me/595971189199",
      webUrl: "https://www.hendyla.com/anuncios/ladrillos-comunes-de-tobati-de-primera-calidad-10-000-unidades-5500000-gs_264809.html",
      productos: "Oferta mayorista publicada: 10.000 unidades de ladrillo común de 1ra calidad a Gs. 5.500.000 (Gs. 550 c/u)."
    },
    {
      nombre: "Clasipar — Materiales Cerámicos Directos de Tobatí",
      contacto: "Catálogo Online Clasipar Paraguay",
      webUrl: "https://clasipar.paraguay.com/servicios/construccion-reformas/materiales-de-construccion-de-tobati-ladrillos-comunes-huecos-prensados-tejas-tejuelones-1269529",
      productos: "Ladrillos comunes, huecos, prensados, tejas y tejuelones puestos en obra en Gran Asunción."
    }
  ]
};

// DATOS OFICIALES DEL CRÉDITO VIVIENDA BNF (Banco Nacional de Fomento — Condiciones Ruth y Leo)
// Fuente: /assets/planos/prevision_credito_nuevo.png
export const PREVISION_CREDITO_NUEVO = {
  entidadFinanciera: "BNF (Banco Nacional de Fomento)",
  titulo: "Crédito Vivienda BNF (Banco Nacional de Fomento — Condiciones Ruth & Leo)",
  documentoImgUrl: "./assets/planos/prevision_credito_nuevo.png",
  tasaAnualPct: 9.9,
  plazoAnios: 15,
  plazoCuotas: 180,
  factorCuotaConSegurosPorMillonGs: 11765.9090909, // 440M -> Gs. 5.177.000/mes exactos
  condicionesCerradas: [
    "Entidad Financiera: BNF (Banco Nacional de Fomento) — Línea de Crédito para Construcción/Terminación de Vivienda.",
    "Tasa de referencia: 9,9 % anual (y comparativa línea preferencial BNF 6,5% / 7,9%), a 15 años (180 cuotas).",
    "Desembolsos por etapas certificadas sobre carpeta técnica BNF (planos y planilla de cómputo métrico con código de colores).",
    "El terreno y los Gs. 163,8M ya construidos respaldan la garantía real ante el BNF.",
    "La cuota mensual incluye seguros (calculado en proporción a los tramos de Gs. 300M, Gs. 350M y Gs. 440M)."
  ],
  tramos: [
    {
      id: "tramo_250m",
      creditoMillones: 250,
      creditoGs: 250000000,
      label: "250 millones (BNF)",
      cuotaMensualConSegurosGs: 2941477,
      totalPagado15AniosGs: 529000000,
      totalPagado15AniosLabel: "529 M",
      costoCreditoGs: 279000000,
      costoCreditoLabel: "279 M",
      cuotaPuraSinSeguro99Gs: 2774250,
      cuotaPuraSinSeguro65Gs: 2245500,
      destacado: false,
      alcanceObraResumen: "Cierre Estructural 3 Niveles + Ladrillo Visto Tobatí + Carpeta Alisada (sin revoque fino ni porcelanato)"
    },
    {
      id: "tramo_300m",
      creditoMillones: 300,
      creditoGs: 300000000,
      label: "300 millones (BNF)",
      cuotaMensualConSegurosGs: 3529773,
      totalPagado15AniosGs: 635000000,
      totalPagado15AniosLabel: "635 M",
      costoCreditoGs: 335000000,
      costoCreditoLabel: "335 M",
      cuotaPuraSinSeguro99Gs: 3329100,
      cuotaPuraSinSeguro65Gs: 2694600,
      destacado: true,
      badge: "Escalón Base BNF",
      alcanceObraResumen: "3 Niveles Operativos Día 1: 2do Piso (2 Dormitorios + Vestidor + Desk + 2 Baños) + Nivel Calle (Sala, Comedor, Cocina, Baño Social) + Subsuelo (Salón c/ Lecherada + Lavadero en Pared Izquierda)"
    },
    {
      id: "tramo_350m",
      creditoMillones: 350,
      creditoGs: 350000000,
      label: "350 millones (BNF)",
      cuotaMensualConSegurosGs: 4118068,
      totalPagado15AniosGs: 741000000,
      totalPagado15AniosLabel: "741 M",
      costoCreditoGs: 391000000,
      costoCreditoLabel: "391 M",
      cuotaPuraSinSeguro99Gs: 3883950,
      cuotaPuraSinSeguro65Gs: 3143700,
      destacado: true,
      badge: "Equilibrio Óptimo BNF",
      alcanceObraResumen: "Todo 300M + Cocina Full con Alacenas/Isla + Ventanales Blindex 24 m² al Río + Puerta Principal/Servicio + Pérgola Cochera + Jardín Césped 115 m²"
    },
    {
      id: "tramo_440m",
      creditoMillones: 440,
      creditoGs: 440000000,
      label: "440 millones (BNF)",
      cuotaMensualConSegurosGs: 5177000,
      totalPagado15AniosGs: 932000000,
      totalPagado15AniosLabel: "932 M",
      costoCreditoGs: 492000000,
      costoCreditoLabel: "492 M",
      cuotaPuraSinSeguro99Gs: 4882680,
      cuotaPuraSinSeguro65Gs: 3952080,
      destacado: false,
      badge: "Tope Completo BNF",
      alcanceObraResumen: "Todo 350M + Blindex 2do Piso al Río + Rejas Terraza y Foso 19.5 ml + Deck Galería L1 + Pintura Integral + Parrillita Subsuelo"
    }
  ]
};
export const CREDITO_BNF = PREVISION_CREDITO_NUEVO;
export const CREDITO_CAJA_MUTUAL = PREVISION_CREDITO_NUEVO;

// REQUISITOS TÉCNICOS OFICIALES DEL BANCO Y TABLA DE CUOTAS POR MILLÓN
// Fuente: /assets/planos/requisitos_banco_cuotas.png
export const REQUISITOS_BANCO_Y_CUOTAS = {
  documentoImgUrl: "./assets/planos/requisitos_banco_cuotas.png",
  textoLiteralBanco:
    "Para casos de Refacciones menores o terminaciones: 1) Planilla cómputo métrico y presupuesto de las construcciones a ser realizadas que deberá indicar las construcciones existentes y aquellas que serán nuevas (Ej.: rojo a construir, amarillo a demoler o refaccionar, negro lo ya construido y verde hormigón); 2) Planos de la obra.",
  coloresNormativosBanco: {
    NEGRO: {
      codigo: "NEGRO",
      nombre: "⚫ NEGRO — Lo Ya Construido (Ejecutado 100%)",
      hex: "#1e293b",
      badgeBg: "rgba(30, 41, 59, 0.9)",
      badgeBorder: "#94a3b8",
      badgeText: "#f8fafc",
      stroke2D: "#111827",
      fill2D: "rgba(30, 41, 59, 0.32)",
      descripcion: "Construcciones existentes certificadas en obra (Acta 29/12/2025 JIVESA S.A. / PROBETI #17671): Cimientos y 14 Zapatas (-4.64m), Vigas VC.T-1, 20 Pilares P1–P20 hasta Nivel Calle, Pórticos Subsuelo 1–7, Escalera 1 y Primera Losa L1–L4 (Gs. 163.820.972 ya invertidos)."
    },
    VERDE: {
      codigo: "VERDE",
      nombre: "🟢 VERDE — Hormigón Armado (Estructura H°A°)",
      hex: "#16a34a",
      badgeBg: "rgba(22, 163, 74, 0.22)",
      badgeBorder: "#22c55e",
      badgeText: "#86efac",
      stroke2D: "#16a34a",
      fill2D: "rgba(22, 163, 74, 0.28)",
      descripcion: "Estructuras de Hormigón Armado: Viga de fundación y encadenado de muro (1.2), Losa de 2do Piso +102.88m (2.1), Continuación de 17 Pilares HA-25 y Vigas de Planta Alta (2.2), Cerramiento Loza Rap (13.4) y Contrapisos/Vaso de H°A°."
    },
    ROJO: {
      codigo: "ROJO",
      nombre: "🔴 ROJO — Obra Nueva a Construir (Con el Crédito)",
      hex: "#dc2626",
      badgeBg: "rgba(220, 38, 38, 0.22)",
      badgeBorder: "#ef4444",
      badgeText: "#fca5a5",
      stroke2D: "#dc2626",
      fill2D: "rgba(220, 38, 38, 0.22)",
      descripcion: "Construcciones nuevas a ejecutar con el crédito: Muro de contención y pasillo antihumedad, Mampostería de ladrillos Tobatí, Techo (Isopanel o Tejas), Revoques, Pisos Porcelanato, Baño Suite, Cocina, Lavadero en Subsuelo, Aberturas Blindex, Rejas, Instalaciones y Mobiliario fijo (Placares y Biblioteca 4 estantes 2m)."
    },
    AMARILLO: {
      codigo: "AMARILLO",
      nombre: "🟡 AMARILLO — A Demoler, Refaccionar o Adecuar",
      hex: "#d97706",
      badgeBg: "rgba(217, 119, 6, 0.24)",
      badgeBorder: "#f59e0b",
      badgeText: "#fde68a",
      stroke2D: "#d97706",
      fill2D: "rgba(245, 158, 11, 0.28)",
      descripcion: "Trabajos de refacción, adecuación o tratamiento sobre preexistencias: Desoxidado y puente epóxico Sikadur-32 en pelos de arranque de 17 pilares (13.3), Submuración y blindaje hidrófugo de medianera vecina expuesta en Eje 9 (13.1), Drenaje y adecuación de talud/acceso frontal."
    }
  },
  construccionesExistentesNegro: {
    montoTotalEjecutadoGs: 163820972,
    montoAbonadoGs: 142313711,
    saldoPendienteActaGs: 21507261,
    rubros: [
      { codigo: "E-01", item: "Excavación, Desmonte y Sondeos Geotécnicos SPT (GEO-STAN #2956)", unidad: "gl", cantidad: 1, montoGs: 14850000, colorBanco: "NEGRO", estado: "EJECUTADO 100%" },
      { codigo: "E-02", item: "14 Zapatas de H°A° Profundizadas a Cota +95.36m (-4.64m) y Vigas Centradoras VC.T-1", unidad: "gl", cantidad: 1, montoGs: 42650000, colorBanco: "NEGRO", estado: "EJECUTADO 100%" },
      { codigo: "E-03", item: "20 Pilares en Subsuelo (-2.34m a 0.00m) + 17 Pilares de Planta Baja ya Hormigonados hasta +2.88m (+102.88m; P12/P13/P15 mueren en 0.00m — PROBETI 240–265 kg/cm²)", unidad: "gl", cantidad: 1, montoGs: 48920972, colorBanco: "NEGRO", estado: "EJECUTADO 100%" },
      { codigo: "E-04", item: "Primera Losa Maciza H°A° Visto L1 (Galería -0.45m, 33.42 m²) y L4 (Cocina/Comedor +0.00m, 28.66 m²) + Pórticos 1 a 7 (Queda vacío abierto de 38.00 m² a cerrar con Loza Rap — PROBETI 315 kg/cm²)", unidad: "m2", cantidad: 62.08, montoGs: 46200000, colorBanco: "NEGRO", estado: "EJECUTADO (Resta cerrar vacío 38 m² con Loza Rap)" },
      { codigo: "E-05", item: "Escalera 1 de H°A° Ejecutada sobre Pared Derecha Eje 8–9 (x = -4.87m..-3.90m, conecta Subsuelo +97.66m con PB +100.00m)", unidad: "un", cantidad: 1, montoGs: 11200000, colorBanco: "NEGRO", estado: "EJECUTADO 100%" },
      { codigo: "E-06", item: "Murallas Perimetrales Existentes alrededor del Terreno (Frente 100% ciego; solo se sobreelevan 3m × 2m en un lateral)", unidad: "gl", cantidad: 1, montoGs: 0, colorBanco: "NEGRO", estado: "YA EXISTENTE (Gs. 0 a solicitar)" },
      { codigo: "E-07", item: "Portón Balancín Metálico de 2.30m (Chapa Grafito Ciega, x=+1.20..+3.50m) + Portoncito Peatonal Haciendo Juego de 0.95m (x=-2.20..-1.25m)", unidad: "cjto", cantidad: 1, montoGs: 0, colorBanco: "NEGRO", estado: "YA INSTALADO (Solo se motoriza)" }
    ]
  },
  tablaCuotasPorMillon: {
    tasa65: {
      tasaAnualPct: 6.5,
      nombre: "Tasa 6,5% Anual (Línea Vivienda Preferencial)",
      plazos: {
        15: { anios: 15, meses: 180, cuotaPorMillonGs: 8982 },
        20: { anios: 20, meses: 240, cuotaPorMillonGs: 7727 },
        30: { anios: 30, meses: 360, cuotaPorMillonGs: 6592 }
      }
    },
    tasa99: {
      tasaAnualPct: 9.9,
      nombre: "Tasa 9,9% Anual (Línea Estándar / Caja Mutual)",
      plazos: {
        15: { anios: 15, meses: 180, cuotaPorMillonGs: 11097, cuotaConSegurosCajaMutualPorMillonGs: 11765.9090909 },
        20: { anios: 20, meses: 240, cuotaPorMillonGs: 9997 },
        30: { anios: 30, meses: 360, cuotaPorMillonGs: 9114 }
      }
    }
  },
  clasificacionPartidasBanco: {
    contencion_cochera: { colorBanco: "ROJO", pctMateriales: 58, pctManoObra: 42 },
    viga_fundacion_muro: { colorBanco: "VERDE", pctMateriales: 62, pctManoObra: 38 },
    aislacion_relleno_cochera: { colorBanco: "AMARILLO", pctMateriales: 52, pctManoObra: 48 },
    losa_segunda_parte: { colorBanco: "VERDE", pctMateriales: 60, pctManoObra: 40 },
    hormigon_vigas_losa: { colorBanco: "VERDE", pctMateriales: 62, pctManoObra: 38 },
    cubierta_metalica: { colorBanco: "ROJO", pctMateriales: 70, pctManoObra: 30 },
    estructura_metalica_techo: { colorBanco: "ROJO", pctMateriales: 65, pctManoObra: 35 },
    desagues_canaletas: { colorBanco: "ROJO", pctMateriales: 60, pctManoObra: 40 },
    mamposteria_exterior: { colorBanco: "ROJO", pctMateriales: 55, pctManoObra: 45 },
    revoque_exterior_impermeable: { colorBanco: "ROJO", pctMateriales: 48, pctManoObra: 52 },
    puertas_seguridad_provisoria: { colorBanco: "ROJO", pctMateriales: 75, pctManoObra: 25 },
    galeria_voladizo_deck: { colorBanco: "ROJO", pctMateriales: 65, pctManoObra: 35 },
    parrilla_ducto: { colorBanco: "ROJO", pctMateriales: 58, pctManoObra: 42 },
    vidrios_templados_galeria: { colorBanco: "ROJO", pctMateriales: 78, pctManoObra: 22 },
    instalaciones_electricas_embutidas: { colorBanco: "ROJO", pctMateriales: 56, pctManoObra: 44 },
    instalaciones_sanitarias_desagues: { colorBanco: "ROJO", pctMateriales: 58, pctManoObra: 42 },
    pisos_porcelanato: { colorBanco: "ROJO", pctMateriales: 62, pctManoObra: 38 },
    porton_cochera_automatizado: { colorBanco: "ROJO", pctMateriales: 74, pctManoObra: 26 },
    bano_suite_sanitarios: { colorBanco: "ROJO", pctMateriales: 72, pctManoObra: 28 },
    cocina_mesada_bacha_esencial: { colorBanco: "ROJO", pctMateriales: 70, pctManoObra: 30 },
    lavadero_habitable: { colorBanco: "ROJO", pctMateriales: 64, pctManoObra: 36 },
    placares_dormitorios_adicional: { colorBanco: "ROJO", pctMateriales: 72, pctManoObra: 28 },
    hidro_muro_vertical: { colorBanco: "ROJO", pctMateriales: 55, pctManoObra: 45 },
    hidro_drenaje_frances: { colorBanco: "ROJO", pctMateriales: 60, pctManoObra: 40 },
    hidro_capa_horizontal: { colorBanco: "ROJO", pctMateriales: 54, pctManoObra: 46 },
    hidro_membrana_terraza: { colorBanco: "AMARILLO", pctMateriales: 62, pctManoObra: 38 },
    hidro_barrera_vapor: { colorBanco: "ROJO", pctMateriales: 58, pctManoObra: 42 },
    debil_cableado_cat6: { colorBanco: "ROJO", pctMateriales: 60, pctManoObra: 40 },
    debil_cctv_ip: { colorBanco: "ROJO", pctMateriales: 75, pctManoObra: 25 },
    debil_portero_visor: { colorBanco: "ROJO", pctMateriales: 72, pctManoObra: 28 },
    debil_wifi_mesh: { colorBanco: "ROJO", pctMateriales: 80, pctManoObra: 20 },
    debil_alarma_barreras: { colorBanco: "ROJO", pctMateriales: 83, pctManoObra: 17 },
    debil_domotica_luces: { colorBanco: "ROJO", pctMateriales: 76, pctManoObra: 24 },
    forense_aislacion_medianera_eje9: { colorBanco: "AMARILLO", pctMateriales: 50, pctManoObra: 50 },
    forense_cloaca_subsuelo_bombeo: { colorBanco: "ROJO", pctMateriales: 62, pctManoObra: 38 },
    forense_puente_adherencia_epoxico: { colorBanco: "AMARILLO", pctMateriales: 57, pctManoObra: 43 },
    forense_omision_fila9_lozarrap: { colorBanco: "VERDE", pctMateriales: 60, pctManoObra: 40 },
    forense_tabiqueria_liviana_apeo: { colorBanco: "ROJO", pctMateriales: 62, pctManoObra: 38 },
    forense_barandas_seguridad: { colorBanco: "ROJO", pctMateriales: 66, pctManoObra: 34 },
    edifica_vereda_frontal: { colorBanco: "ROJO", pctMateriales: 58, pctManoObra: 42 },
    edifica_caminero_vehicular: { colorBanco: "VERDE", pctMateriales: 60, pctManoObra: 40 },
    edifica_caminero_peatonal: { colorBanco: "ROJO", pctMateriales: 56, pctManoObra: 44 },
    sobreelevacion_muralla_lateral_3x2: { colorBanco: "ROJO", pctMateriales: 58, pctManoObra: 42 },
    edifica_muralla_frontal: { colorBanco: "ROJO", pctMateriales: 58, pctManoObra: 42 },
    edifica_cielorraso_estar: { colorBanco: "ROJO", pctMateriales: 58, pctManoObra: 42 },
    edifica_aberturas_madera: { colorBanco: "ROJO", pctMateriales: 74, pctManoObra: 26 },
    edifica_pintura_integral: { colorBanco: "ROJO", pctMateriales: 46, pctManoObra: 54 },
    edifica_equipamiento_cocina: { colorBanco: "ROJO", pctMateriales: 75, pctManoObra: 25 },
    puertas_acceso_principal_servicio: { colorBanco: "ROJO", pctMateriales: 76, pctManoObra: 24 },
    blindex_habitaciones: { colorBanco: "ROJO", pctMateriales: 78, pctManoObra: 22 },
    rejas_balcones_seguridad: { colorBanco: "ROJO", pctMateriales: 66, pctManoObra: 34 },
    jardin_cesped_patio: { colorBanco: "ROJO", pctMateriales: 55, pctManoObra: 45 },
    quincho_patio_subsuelo: { colorBanco: "ROJO", pctMateriales: 60, pctManoObra: 40 },
    piscina_patio_oficial: { colorBanco: "VERDE", pctMateriales: 64, pctManoObra: 36 },
    cielorraso_acustico_2dopiso: { colorBanco: "ROJO", pctMateriales: 62, pctManoObra: 38 },
    biblioteca_4_estantes_2m: { colorBanco: "ROJO", pctMateriales: 72, pctManoObra: 28 },
    supervision_direccion_tecnica_banco: { colorBanco: "ROJO", pctMateriales: 0, pctManoObra: 100 },
    limpieza_volquetes_contingencia_obra: { colorBanco: "AMARILLO", pctMateriales: 30, pctManoObra: 70 }
  }
};

// DESGLOSE DETALLADO DEL SISTEMA DE ALARMA DE INTRUSIÓN PET-IMMUNE (COSTOS DE MERCADO EN ASUNCIÓN)
export const PRESUPUESTO_SISTEMA_ALARMA_ASUNCION = {
  titulo: "Presupuesto Completo de Sistema de Alarma de Intrusión con Instalación en Asunción (Pet-Immune para Emma y Serafina)",
  etiquetaOrigen: "🤖 Incluido por IA según Análisis — Costos de mercado Asunción",
  totalMaterialesGs: 4500000,
  totalManoObraInstalacionGs: 950000,
  totalGeneralInstaladoGs: 5450000,
  items: [
    {
      nro: 1,
      componente: "Central de Alarma Híbrida/Inalámbrica (tipo Hikvision AX PRO / Paradox SP5500 / DSC PowerSeries Neo) + Teclado LCD + Batería Gel 12V 7Ah + Módulo IP/GPRS App Celular",
      cantidad: "1 kit",
      precioUnitarioGs: 1650000,
      subtotalGs: 1650000,
      tipo: "Materiales / Equipos",
      ubicacion: "Gabinete técnico oculto + App en celulares de Leo y Ruth"
    },
    {
      nro: 2,
      componente: "Detectores de Movimiento PIR Doble Tecnología Pet-Immune (Inmunes a mascotas hasta 25 kg — esenciales por Emma y Serafina)",
      cantidad: "5 un.",
      precioUnitarioGs: 230000,
      subtotalGs: 1150000,
      tipo: "Materiales / Equipos",
      ubicacion: "Cochera, Sala/Comedor, Galería L1, Subsuelo y Pasillo Escalera"
    },
    {
      nro: 3,
      componente: "Sensores Magnéticos de Apertura cableados/inalámbricos de alta sensibilidad",
      cantidad: "6 un.",
      precioUnitarioGs: 120000,
      subtotalGs: 720000,
      tipo: "Materiales / Equipos",
      ubicacion: "Puerta Principal, Puerta de Servicio, Puerta Subsuelo y Ventanales Blindex"
    },
    {
      nro: 4,
      componente: "Barrera Infrarroja Perimetral Doble Haz + 1 Sirena Exterior 120 dB c/ Flash y Gabinete Antidesarme + 1 Sirena Interior",
      cantidad: "1 cjto.",
      precioUnitarioGs: 980000,
      subtotalGs: 980000,
      tipo: "Materiales / Equipos",
      ubicacion: "Costado vulnerable de 3m × 2m hacia vecino/calle + Fachada"
    },
    {
      nro: 5,
      componente: "Mano de Obra de Instalación Completa en Asunción (cableado, fijación, programación de zonas en App móvil para Leo y Ruth y pruebas de disparo)",
      cantidad: "1 gl",
      precioUnitarioGs: 950000,
      subtotalGs: 950000,
      tipo: "Mano de Obra Especializada",
      ubicacion: "Instalación llave en mano y puesta en marcha en Itá Pytã Punta"
    }
  ]
};

// PROTOCOLO DE REHABILITACIÓN PREVIA DE LA LOSA 1 EXPUESTA AL SOL Y LA INTEMPERIE (🟡 AMARILLO BANCO)
export const PROTOCOLO_CUIDADO_LOSA_EXPUESTA = {
  titulo: "Protocolo Técnico de Cuidado y Rehabilitación Previa de Losa 1 Expuesta al Sol e Intemperie (100,71 m²)",
  colorBanco: "AMARILLO",
  totalMaterialesGs: 4050000,
  totalManoObraGs: 3000000,
  totalGeneralGs: 7050000,
  pasos: [
    {
      paso: 1,
      tarea: "Hidrolavado industrial (2.500 PSI) y decapado biológico/químico de los 100,71 m² de Losa 1",
      objetivo: "Eliminar verdín, hollín, polvo calcinado y lechada superficial quemada por el sol antes de aplicar carpetas o levantar muros.",
      montoGs: 850000
    },
    {
      paso: 2,
      tarea: "Sellado elastomérico de microfisuras de retracción térmica solar (Sikaflex-1A Plus) + membrana cementicia flexible (SikaTop-107 Seal) en sectores húmedos",
      objetivo: "Sellar las microfisuras provocadas por la dilatación/contracción solar de ~10 meses a la intemperie para que jamás filtre humedad a los 100 m² del Subsuelo.",
      montoGs: 2650000
    },
    {
      paso: 3,
      tarea: "Desoxidado mecánico/fosfatizante (Sika Rustoff) + Puente de Adherencia Epóxico (Sikadur-32 Gel) en los 17 arranques de pilares",
      objetivo: "Convertir el óxido superficial de los pelos de espera Ø12mm y asegurar unión estructural monolítica con el hormigón nuevo de los pilares que suben al 2do Piso.",
      montoGs: 2400000
    },
    {
      paso: 4,
      tarea: "Puente de adherencia acrílico (SikaLatex) previo a la carpeta niveladora del piso porcelanato",
      objetivo: "Evitar que la carpeta nueva se deshidrate o se despegue ('suene hueca/cajón') al colarse sobre el hormigón viejo reseco por el sol.",
      montoGs: 1150000
    }
  ]
};

// SOLUCIÓN CLOACAL POR GRAVEDAD EN SUBSUELO/FONDO (SIN CHOCAR CON PISCINA) + DESAGOTE POR CAMIÓN CISTERNA VÍA ESCALERA LATERAL DE SERVICIO
export const SISTEMA_CLOACAL_DUAL_SUBSUELO = {
  titulo: "Sistema Cloacal en Fondo (Pozo Ciego + Cámara Séptica sin chocar con Piscina) + Desagote por Camión Cisterna vía Escalera Lateral de Servicio",
  colorBanco: "ROJO",
  totalMaterialesGs: 3900000,
  totalManoObraGs: 2900000,
  totalGeneralGs: 6800000,
  ubicacionPlanta: "Corredor lateral izquierdo del jardín trasero (Ejes 8–9, x = -4,20m a -2,30m, z = 15,00m a 20,50m), separado >1,80m de la futura Piscina (4,65m × 2,45m en Ejes 5–1, x = -0,80m a +3,85m).",
  componentes: [
    {
      nro: 1,
      sistema: "Cámara Desgrasadora + Cámara Séptica Impermeable (1.500 L) + Pozo Ciego Absorbente (Ø 1,80m × 3,50m) en Fondo (Ejes 8–9)",
      detalle: "Ubicados en el sector izquierdo del patio posterior (Ejes 8–9) para dejar 100% libre el sector central/derecho donde irá la Piscina de 4,65m × 2,45m. El pozo absorbente se calza con ~1.100 ladrillos comunes de Tobatí en aparejo cribado y tapa de H°A° con contratapa de inspección rápida.",
      materialesGs: 3900000,
      manoObraGs: 2900000,
      subtotalGs: 6800000
    },
    {
      nro: 2,
      sistema: "Operación de Desagote por Camión Cisterna Atmosférico vía Puerta y Escalera Lateral de Servicio (Sin Motor de Bombeo Propio — Ahorra Gs. 2.600.000)",
      detalle: "Se descarta el motor de bombeo eléctrico doméstico porque para desagotar barros/lodos del pozo ciego los camiones cisterna traen su propia bomba de vacío industrial y bajan la manguera directamente desde Calle Tte. Guillermo Arias por la Puerta de Servicio (Eje G) y la Escalera Lateral 1 (Ejes 1–2) a través del Subsuelo libre hasta el pozo, sin pisar la vivienda ni requerir mantenimiento electromecánico.",
      materialesGs: 0,
      manoObraGs: 0,
      subtotalGs: 0
    }
  ]
};

// ============================================================================
// MODELO DE CONTROL DEL PROPIETARIO Y NEGOCIACIÓN CON ARQUITECTO
// (Gestión Supervisada vs. Administración Delegada vs. Llave en Mano)
// ============================================================================
export const CONTROL_PROPIETARIO_Y_NEGOCIACION_ARQUITECTO = {
  titulo: "Panel de Control del Propietario y Negociación con Arquitecto (Por qué Edifica Studio parecía tan caro y cómo ahorrar Gs. 95M–135M)",
  diagnosticoPorQueEdificaEraTanCaro: [
    "1. Cotizaba SOLO 1 NIVEL + Subsuelo (SIN el 2do Piso de Dormitorio/Estudio): Edifica Studio (Gs. 460,1M y Gs. 573,9M) era un presupuesto referencial de adaptación de Planta Nivel Calle + Subsuelo, sin construir la Losa del 2do Piso (+102.88m).",
    "2. Duplicaba Gs. 80.750.000 de estructura YA CONSTRUIDA: Incluía Pilares PB (Gs. 24,2M), Vigas/Losas Subsuelo (Gs. 24,2M), Pilares Subsuelo (Gs. 12,1M), Zapatas (Gs. 13,5M) y Escalera H°A° (Gs. 6,75M) que ya están pagados y certificados en el Acta del 29/12/2025.",
    "3. Columnas de Unidad, Cantidad y Precio Unitario EN BLANCO: Al cotizar por «Precio Global Cerrado (Llave en Mano)», el constructor le cargó un margen de riesgo e intermediación del +25% al +32% sobre materiales y cuadrillas.",
    "4. Conclusión estratégica de Leo: Tomando el control directo de la compra de materiales clave (ladrillos Tobatí, cemento, hierro, porcelanato, griferías) y contratando al arquitecto bajo «Gestión Supervisada» o «Administración Transparente (Open-Book)», con Gs. 300M–350M construís los 3 NIVELES (incluyendo el 2do Piso) en lugar de pagar Gs. 460M–573M por 1 solo nivel."
  ],
  modalidadesContratacion: [
    {
      id: "gestion_supervisada",
      nombre: "Opción 1 (Recomendada): Gestión Supervisada con Control del Propietario",
      badge: "MÁXIMO AHORRO Y CONTROL",
      color: "#10b981",
      honorarioArquitectoPct: 7.0,
      imprevistosPct: 3.0,
      recargoMaterialesPct: 0.0,
      recargoManoObraPct: 0.0,
      descripcion: "Leo compra directamente los materiales principales (transferencia directa a olerías de Tobatí, ferreterías, casas de sanitarios y electricidad sin sobreprecio) y paga semanalmente por avance medido a las cuadrillas (albañil, plomero, electricista, herrero). El arquitecto cobra un honorario fijo o porcentual (~6% a 8%, Gs. 18,5M ya previsto en partida 16.1) por Dirección Técnica, visitas de control de calidad, replanteo y certificaciones para el Banco.",
      ventajas: [
        "Cero sobreprecio (0% markup) en compra de materiales (~60% del presupuesto).",
        "Control total del flujo de caja de Caja Mutual por avance real medido en obra.",
        "Ya está cubierto dentro del Crédito de 300M (Partidas 16.1 Supervisión Técnica Gs. 18,5M + 16.2 Imprevistos Gs. 6,9M)."
      ],
      cuidados: [
        "Exige dedicar 2 a 3 horas semanales para aprobar compras y liberar pagos de certificaciones semanales con el visto bueno del arquitecto."
      ]
    },
    {
      id: "administracion_delegada",
      nombre: "Opción 2: Administración Delegada «Open-Book» (Libro Abierto)",
      badge: "EQUILIBRIO TIEMPO / COSTO",
      color: "#38bdf8",
      honorarioArquitectoPct: 12.0,
      imprevistosPct: 5.0,
      recargoMaterialesPct: 0.0,
      recargoManoObraPct: 5.0,
      descripcion: "El arquitecto o ingeniero residente gestiona todas las compras (presentando 3 presupuestos comparativos y facturas originales a nombre de Leo) y coordina a todos los gremios en obra, cobrando un 10% a 12% de honorarios por Administración + Dirección de Obra.",
      ventajas: [
        "Leo recibe las facturas originales al costo real de proveedor (con los descuentos profesionales del arquitecto).",
        "El arquitecto absorbe la gestión operativa diaria de cuadrillas y entregas de materiales."
      ],
      cuidados: [
        "Pactar por contrato una cláusula de tope máximo (Cap) de honorarios para que el arquitecto no tenga incentivo a encarecer materiales."
      ]
    },
    {
      id: "llave_en_mano_auditado",
      nombre: "Opción 3: Llave en Mano a Precio Cerrado (Con Cómputo Métrico Auditado)",
      badge: "PRECIO FIJO (+22% a +28% RECARGO)",
      color: "#f59e0b",
      honorarioArquitectoPct: 18.0,
      imprevistosPct: 8.0,
      recargoMaterialesPct: 15.0,
      recargoManoObraPct: 15.0,
      descripcion: "Una empresa constructora (como Edifica Studio o JIVESA) asume el riesgo total de inflación de materiales, desperdicios e imprevistos laborales a cambio de un recargo empresarial combinado del +22% al +28% sobre el costo directo.",
      ventajas: [
        "Precio único congelado por contrato y un solo responsable legal de principio a fin."
      ],
      cuidados: [
        "Nunca firmar un Llave en Mano con cantidades en blanco (como la planilla original de Edifica): exigir que coticen sobre nuestra Planilla Excel de 66 filas con marcas, espesores y metrajes exactos."
      ]
    }
  ],
  clausulasNegociacionArquitecto: [
    {
      nro: 1,
      titulo: "Descuento de los Gs. 163,8M ya construidos (Prohibición de Doble Cobro)",
      texto: "El contrato deja constancia de que las 14 zapatas, los 20 pilares P1–P20 hasta Losa 1, los pórticos de Subsuelo, la Escalera 1 y los 124,42 m² de Losa 1 ya están ejecutados y aprobados (PROBETI #17671)."
    },
    {
      nro: 2,
      titulo: "Facturación Directa de Materiales a Nombre de Leo (Cero Comisiones Ocultas)",
      texto: "Todo material superior a Gs. 1.500.000 se cotiza en 3 proveedores y lo abona directamente Leo por transferencia contra entrega en Calle Tte. Guillermo Arias."
    },
    {
      nro: 3,
      titulo: "Pagos Semanales a Cuadrillas Solo por Ítem Medido y Aprobado",
      texto: "No se entregan adelantos globales mayores al 15%. Cada viernes se mide el avance físico real (m² de pared aplomada, m² de revoque o m² de piso) y se retiene un 5% de Fondo de Reparo hasta la recepción final."
    },
    {
      nro: 4,
      titulo: "Pases de Losa con Sacabocado Diamantado (Prohibido Picar Vigas)",
      texto: "Como la Losa 1 existente no tiene pases previstos, las 4 perforaciones verticales (eléctrica, datos, cloaca Ø115mm y agua PPR Ø63mm) se harán únicamente con máquina sacabocado de copa diamantada fuera de las vigas principales."
    }
  ]
};

// ============================================================================
// AUDITORÍA MULTIDISCIPLINARIA DE LOS 6 ESPECIALISTAS (SIN DEJAR HUECOS)
// ============================================================================
export const AUDITORIA_SEIS_ESPECIALISTAS = [
  {
    id: "esp_civil",
    icono: "🏗️",
    especialidad: "1. Ingeniero Civil y Estructural (MOPC / Reg. Asunción)",
    profesionalRol: "Auditoría de 17 Pilares ya a +2.88m, Vacío 38 m² en Losa 1 (Loza Rap), Escalera 1 (Eje 8–9) vs. Escalera 2 (Eje 1–2) y Contención",
    calificacionActual: "96/100 (Alineado 100% con planos estructurales E3/E4/E5)",
    resumenDictamen: "La estructura basal ejecutada por JIVESA S.A. es sobresaliente: los 20 pilares en Subsuelo y los 17 pilares principales de Planta Baja ya están hormigonados hasta +2.88m (+102.88m), mientras que P12, P13 y P15 mueren en 0.00m. En Losa 1 (+0.00m) están hormigonadas L1 (Galería) y L4 (Cocina/Comedor), quedando el vacío abierto de 38.00 m² entre vigas sobre el Estar Social para cerrar con Loza Rap:",
    huecosDetectadosYSoluciones: [
      {
        severidad: "CRÍTICO RESUELTO EN PLANO E5",
        hallazgo: "Escaleras en Lados Opuestos sin Superposición (Escalera 1 en Eje 8–9 y Escalera 2 en Eje 1–2) + Cerramiento 38 m² Loza Rap",
        solucion: "Conforme al plano estructural original (estructural_e5_subsuelo_escalera.png) y sanitario (instalacion_sanitaria_agua.png), las dos escaleras NO se superponen: la Escalera 1 (baja al Subsuelo, ya construida en H°A°) va recostada sobre la pared derecha entre Eje 8 y Eje 9 (x = -4.87m..-3.90m, z = 5.26m..8.56m, 3.30m × 0.90m), mientras que la Escalera 2 (sube a Planta Alta y desemboca en el Escritorio) va en el extremo opuesto sobre la pared izquierda entre Eje 1 y Eje 2 (x = +3.84m..+4.87m, z = 5.26m..9.16m, 3.90m × 0.80m). El vacío abierto de 38.00 m² en Losa 1 (Eje 1–5 × Eje B–G) se cierra con Loza Rap.",
        costoMaterialesGs: 8200000,
        costoManoObraGs: 5300000,
        subtotalGs: 13500000,
        incluidoEnPartida: "forense_omision_fila9_lozarrap / hormigon_vigas_losa"
      },
      {
        severidad: "ALTO (INCLUIDO EN 300M)",
        hallazgo: "Pilares P12 (Eje 6-C), P13 (Eje 5-E) y P15 (Eje 8-C) mueren en 0.00m (los otros 17 pilares ya llegan a +2.88m)",
        solucion: "Prohibido levantar paredes pesadas de ladrillo macizo en Planta Alta fuera de los pórticos de los 17 pilares que ya llegan a +2.88m. Se incorpora desde el escalón de 300M la partida 13.5 (Tabiquería liviana Durlock W112 c/ lana mineral sobre los ejes donde P12, P13 y P15 mueren en PB).",
        costoMaterialesGs: 2850000,
        costoManoObraGs: 1740000,
        subtotalGs: 4590000,
        incluidoEnPartida: "forense_tabiqueria_liviana_apeo (13.5)"
      },
      {
        severidad: "ALTO (INCLUIDO EN 300M)",
        hallazgo: "Muro de Contención de Cochera (z=+1.50m) + Foso de Ventilación (z=1.50..3.00m) con Piso de Rejilla Metálica Electroforjada Transitable",
        solucion: "El muro de contención en z=+1.50m sostiene el relleno compactado de la cochera para la SUV Chery T2 Pro 2026 (2.150 kg), dejando entre z=+1.50m y el Eje G (z=+3.00m) el foso de ventilación/oxigenación del subsuelo cubierto a nivel +0.00m por un Piso de Rejilla Metálica Electroforjada Transitable con Rejas Laterales de Seguridad.",
        costoMaterialesGs: 1450000,
        costoManoObraGs: 950000,
        subtotalGs: 2400000,
        incluidoEnPartida: "viga_fundacion_muro (1.2) / forense_barandas_seguridad (13.6)"
      }
    ],
    checklistControlPropietario: [
      "Verificar el apuntalamiento y hormigonado de la capa de compresión de los 38.00 m² de Loza Rap sobre el Estar Social en Losa 1.",
      "Prohibir terminantemente picar viguetas pretensadas de Loza Rap ni vigas principales para pasar caños.",
      "Exigir compactación del relleno de cochera hasta z=+1.50m en capas de 20 cm y montaje nivelado de la Rejilla Metálica Electroforjada Transitable entre z=1.50m y z=3.00m."
    ]
  },
  {
    id: "esp_interior",
    icono: "🛋️",
    especialidad: "2. Arquitecta de Interiores y Confort Bioclimático",
    profesionalRol: "Auditoría de Distribución Fiel al Plano Original (PB Social + PA 2 Dormitorios, Escritorio, 2 Baños y Vestidor)",
    calificacionActual: "97/100 (Distribución 100% fiel a planos originales)",
    resumenDictamen: "La zonificación respeta rigurosamente el plano original de arquitectura e instalación sanitaria: en Planta Baja (+0.00m) Estar Social (4.95×4.80m), Cocina/Comedor (6.20×2.75m), Baño Social en Eje F–G y Galería al Río sin parrilla fija; y en Planta Alta (+2.88m) Escritorio al llegar de Escalera 2, Dormitorio 2, Dormitorio Principal en Suite con Vestidor y 2 Baños sobre el núcleo húmedo Eje F–G.",
    huecosDetectadosYSoluciones: [
      {
        severidad: "CORREGIDO EN 3D Y 2D (COSTO Gs. 0)",
        hallazgo: "Alineación exacta de Planta Alta: 2 Dormitorios + Escritorio + Vestidor + 2 Baños (Sin balcón ni Blindex frontal en Eje G)",
        solucion: "En Planta Alta (+2.88m), al subir por la Escalera 2 (Eje 1–2) se llega al Escritorio / Estudio (2.50×3.05m) con salida al Deck 2; al centro se ubica el Dormitorio 2 (2.54×3.40m) con su Baño 2 PA enfrente; y a la derecha el Dormitorio Principal en Suite (4.13×4.94m) con Vestidor (2.07×2.00m) y Baño en Suite (3.30×2.00m). La fachada frontal Eje G (z=3.00m) es pared de mampostería con banderolas altas (sin balcón frontal ni Blindex).",
        costoMaterialesGs: 0,
        costoManoObraGs: 0,
        subtotalGs: 0,
        incluidoEnPartida: "Ajuste de Diseño 3D/2D (Gs. 0)"
      },
      {
        severidad: "CRÍTICO DE SEGURIDAD (GLP + CAMPANA)",
        hallazgo: "Garrafa de Gas GLP (13 kg) en Cocina/Comedor junto a Escalera 1 (Eje 8–9) hacia el Subsuelo",
        solucion: "El gas GLP (propano/butano) es más pesado que el aire: ante una pérdida en el interior, fluiría por la Escalera 1 (Eje 8–9) acumulándose en el Subsuelo (-2.34m). Se instala una Casilla Exterior Ventilada para 2 garrafas de 13 kg hacia el foso ventilado frontal (Eje G, x=-4.45m, z=2.78m) con caño de cobre/Sigas embutido y llave de corte interior + Campana Extractora Inox.",
        costoMaterialesGs: 2150000,
        costoManoObraGs: 950000,
        subtotalGs: 3100000,
        incluidoEnPartida: "cocina_mesada_bacha_esencial"
      },
      {
        severidad: "CONFORT PET-FRIENDLY (EMMA Y SERAFINA)",
        hallazgo: "Resbaladicidad de pisos para Emma (caniche) y protección anticaída en Deck 2 al Río para Serafina (gata calicó)",
        solucion: "1) Especificar al comprar el Porcelanato 60×60 acabado Satinado/Mate Natural R9–R10 (Gs. 0 de diferencia vs. pulido espejo) para evitar patinaje de Emma; 2) Malla de protección UV traslúcida en el Deck 2 al Río (+2.88m) y barrotes cada <=10 cm en las rejas laterales del foso frontal.",
        costoMaterialesGs: 1150000,
        costoManoObraGs: 650000,
        subtotalGs: 1800000,
        incluidoEnPartida: "forense_barandas_seguridad"
      }
    ],
    checklistControlPropietario: [
      "Pedir en tienda Porcelanato 60×60 Rectificado Satinado/Natural (nunca Pulido Brillante en zonas de circulación y escaleras).",
      "Exigir que la garrafa de 13 kg quede en el nicho ventilado exterior hacia el foso de 1,50m antes de revocar el muro Eje G.",
      "Dejar caños de desagüe de condensado PVC Ø25mm embutidos hacia pluvial para los aires acondicionados Split."
    ]
  },
  {
    id: "esp_exterior",
    icono: "🌿",
    especialidad: "3. Arquitecto de Exterior, Envolvente y Paisajismo Urbano",
    profesionalRol: "Auditoría de Portón Balancín 2.30m + Portoncito Peatonal 0.95m (Chapa Grafito Ciega), Pérgola Madera c/ Techo Antigranizo y Rejilla Electroforjada",
    calificacionActual: "96/100 (Frente y Subsuelo 100% alineados)",
    resumenDictamen: "Sobre la línea municipal (z=-4.00m) la muralla frontal es 100% ciega con el Portón Balancín existente de 2.30m y el Portoncito Peatonal haciendo juego de 0.95m (ambos en chapa plegada grafito oscuro 100% ciega hacia adentro). La cochera cuenta con Pérgola de Madera para enredadera + Techo Translúcido Antigranizo y Piso de Rejilla Metálica Electroforjada Transitable sobre el foso (z=1.50..3.00m):",
    huecosDetectadosYSoluciones: [
      {
        severidad: "CORREGIDO EN 3D Y 2D (COSTO Gs. 0)",
        hallazgo: "Portón Balancín de 2.30m (x=+1.20..+3.50m) + Portoncito Peatonal Haciendo Juego de 0.95m (x=-2.20..-1.25m) en Chapa Grafito Ciega",
        solucion: "1) El Portón Balancín existente tiene 2,30m de ancho libre (x=+1.20m a +3.50m, z=-4.00m) en chapa plegada grafito oscuro 100% ciega hacia el interior, acompañado del Portoncito Peatonal de 0,95m (x=-2.20m a -1.25m) en la misma chapa grafito ciega; 2) Sobre la cochera (x=-0.50m..+4.50m, z=-3.80m..+2.80m) se proyecta la Pérgola de Madera para enredadera con Techo Translúcido Antigranizo protegiendo la SUV Chery T2 Pro.",
        costoMaterialesGs: 220000,
        costoManoObraGs: 130000,
        subtotalGs: 350000,
        incluidoEnPartida: "porton_cochera_automatizado"
      },
      {
        severidad: "RECOMENDADO EXTERIOR",
        hallazgo: "Piso de Rejilla Metálica Electroforjada Transitable + Rejas Laterales sobre Foso de Ventilación (z=1.50..3.00m) y Parrillita en Subsuelo al Patio",
        solucion: "1) Entre el muro de contención (z=+1.50m) y el frente Eje G (z=+3.00m) se instala a nivel +0.00m un Piso de Rejilla Metálica Electroforjada Transitable con Rejas Laterales de Seguridad, permitiendo caminar con total seguridad sobre el foso mientras ventila e ilumina el Subsuelo; 2) En el Subsuelo (+97.66m, x=-4.87m..-1.64m, z=11.50m..13.34m) se ubica la Parrillita / Quincho fijo mirando al patio trasero.",
        costoMaterialesGs: 3400000,
        costoManoObraGs: 2100000,
        subtotalGs: 5500000,
        incluidoEnPartida: "forense_barandas_seguridad / jardin_cesped_patio"
      }
    ],
    checklistControlPropietario: [
      "Verificar el perfil de rampa en la vereda de 2,00m frente al Portón Balancín de 2,30m (x=+1.20..+3.50m) para ingreso suave de la Chery T2 Pro.",
      "Exigir perfil goterón plástico o ranura cortagotas a 3 cm del borde inferior de las losas de Galería L1 y Deck 2."
    ]
  },
  {
    id: "esp_seguridad",
    icono: "🛡️",
    especialidad: "4. Técnico en Seguridad Física y Electrónica Residencial",
    profesionalRol: "Auditoría Antirrobo en Frente Ciego, Sensores Anti-Serafina, Cierre de Escalera 1 (Eje 8–9) y Backup 4G",
    calificacionActual: "97/100 (Blindaje físico + electrónico completo)",
    resumenDictamen: "La muralla frontal 100% ciega con el Portón Balancín de 2.30m y el Portoncito Peatonal de 0.95m en chapa grafito ciega brinda máxima privacidad desde la calle. En el interior se asegura el pie de la Escalera 1 en el Subsuelo (Eje 8–9) y se calibran sensores de cortina aptos para Emma y Serafina.",
    huecosDetectadosYSoluciones: [
      {
        severidad: "CRÍTICO FÍSICO (INCLUIDO EN 3D)",
        hallazgo: "Bloqueo de Intrusión desde el Subsuelo hacia la Escalera 1 (Pared Derecha Eje 8–9)",
        solucion: "Mientras el Subsuelo esté vinculado al jardín trasero, se instala una Puerta-Reja de Seguridad en hierro negro con cerradura doble paleta al pie de la Escalera 1 en el Subsuelo (Eje 8–9, x=-4.87m..-3.90m, z=8.56m), creando un anillo blindado hacia la Planta Baja y Planta Alta.",
        costoMaterialesGs: 1450000,
        costoManoObraGs: 750000,
        subtotalGs: 2200000,
        incluidoEnPartida: "puertas_seguridad_provisoria / forense_barandas_seguridad"
      },
      {
        severidad: "CRÍTICO ELECTRÓNICO (CALIBRACIÓN SERAFINA)",
        hallazgo: "Falsas Alarmas por Serafina (Gata Calicó) al trepar a >1,20m de altura sobre muebles y biblioteca",
        solucion: "Se instalan Sensores PIR de Cortina Doble Tecnología (PIR + Microondas) rasantes al vidrio de los ventanales Blindex del Eje B: así Emma y Serafina pueden circular libremente por el Estar Social, Escritorio y Dormitorios toda la noche con la alarma activada en Modo Noche sin dispararla.",
        costoMaterialesGs: 350000,
        costoManoObraGs: 0,
        subtotalGs: 350000,
        incluidoEnPartida: "debil_alarma_barreras (12.5)"
      },
      {
        severidad: "ALTO (PORTONES GRAFITO CIEGOS Y RESPALDO 4G)",
        hallazgo: "Doble Traba Electromecánica en Portón Balancín de 2,30m + Cerradura Electromagnética en Portoncito Peatonal 0,95m + Mini-UPS",
        solucion: "El Portón Balancín de 2,30m (chapa grafito ciega) lleva traba electromecánica Dog Steel y el Portoncito Peatonal haciendo juego de 0,95m lleva cerradura eléctrica vinculada al Portero Visor IP + Reflector LED 50W en calle + Mini-UPS DC LiFePO4 para el router.",
        costoMaterialesGs: 1280000,
        costoManoObraGs: 420000,
        subtotalGs: 1700000,
        incluidoEnPartida: "porton_cochera_automatizado / debil_alarma_barreras"
      }
    ],
    checklistControlPropietario: [
      "Probar el Modo Noche («Stay») verificando que los sensores de cortina en los Blindex del Eje B no se activen con las mascotas.",
      "Cerrar con llave la Puerta-Reja del pie de la Escalera 1 (Eje 8–9) en el Subsuelo cada noche."
    ]
  },
  {
    id: "esp_electricista",
    icono: "⚡",
    especialidad: "5. Ingeniero Electricista Categoría A (Norma ANDE BT / INTN NP 2 028 96)",
    profesionalRol: "Auditoría de Acometida Trifásica, Pleno Vertical en Eje F–G (z=3.00..5.00m), Tableros con DPS y Circuitos 20A",
    calificacionActual: "98/100 (Todos los ductos, pases de losa y enchufes modelados en 3D y 2D)",
    resumenDictamen: "Con 3 Aires Split, Termocalefón 80L (2.000W), Air Fryer Xiaomi 6L (1.500W), Microondas (1.400W), Lavarropas (2.200W) y Motor de Portón, la carga instalada supera los 16,8 kW. Se proyecta Acometida Trifásica ANDE 3×40A (380/220V) y troncales verticales concentrados en el Núcleo Eje F–G.",
    huecosDetectadosYSoluciones: [
      {
        severidad: "CRÍTICO CONSTRUCTIVO (VISUALIZADO EN 3D/2D)",
        hallazgo: "Pleno Vertical Eléctrico y de Datos en Eje F–G (z=3.00..5.00m) + Aprovechamiento del Cerramiento Loza Rap 38 m²",
        solucion: "Se ejecutan 2 Pases Verticales con Sacabocado de Copa Diamantada Ø50mm en el pleno del Eje F–G junto a P14 (x=-1.64m): Pase #1 (x=-1.64m, z=4.65m) para el troncal eléctrico 5×6mm² (TP-PB ↔ TS-PA y TS-SUB) y Pase #2 (x=-1.64m, z=5.35m) para Fibra/UTP Cat6/Alarma. Además, al cerrar los 38.00 m² del Estar Social con Loza Rap, los caños corrugados de iluminación y tomas de ese sector se tienden directamente en la capa de compresión antes de hormigonar.",
        costoMaterialesGs: 1950000,
        costoManoObraGs: 1450000,
        subtotalGs: 3400000,
        incluidoEnPartida: "instalaciones_electricas_embutidas (7.1)"
      },
      {
        severidad: "CRÍTICO DE PROTECCIÓN (TORMENTAS EN EL RÍO)",
        hallazgo: "Protector de Sobretensiones atmosféricas (DPS Clase II 40kA) + 3 Disyuntores Diferenciales 30mA + 2 Jabalinas Copperweld",
        solucion: "Se instala en el Tablero Principal TP-PB (36 módulos DIN, en Eje F) un DPS Tetrapolar Clase II 40kA + 3 Diferenciales de 30mA + Subtablero TS-PA (Planta Alta, 18 DIN) + Subtablero TS-SUB (Subsuelo IP65, 12 DIN) + 2 Jabalinas Copperweld.",
        costoMaterialesGs: 3200000,
        costoManoObraGs: 1300000,
        subtotalGs: 4500000,
        incluidoEnPartida: "instalaciones_electricas_embutidas (7.1)"
      },
      {
        severidad: "FUNCIONALIDAD DIARIA",
        hallazgo: "Circuito Dedicado 20A (4 mm²) en Mesada Cocina + Llaves Combinadas (3-Way) en Escalera 1 (Eje 8–9) y Escalera 2 (Eje 1–2)",
        solucion: "Se tiende línea dedicada de 4 mm² con tomas de 20A rojos sobre la mesada de Cocina/Comedor (Eje 6–9) para Air Fryer Xiaomi 6L y Microondas. Se instalan llaves conmutadas (3-Way) al pie y cabezal de la Escalera 1 (Eje 8–9) y de la Escalera 2 (Eje 1–2) con luces autónomas LED de emergencia.",
        costoMaterialesGs: 1100000,
        costoManoObraGs: 650000,
        subtotalGs: 1750000,
        incluidoEnPartida: "instalaciones_electricas_embutidas (7.1)"
      }
    ],
    checklistControlPropietario: [
      "Enterrar los 2 caños camisa PVC Ø50mm (ANDE) y Ø32mm (Fibra) bajo la cochera ANTES de compactar el relleno y hacer el contrapiso.",
      "Verificar el cable Verde-Amarillo de 2,5 mm² conectado al tercer borne de todos los enchufes de los 3 niveles."
    ]
  },
  {
    id: "esp_plomero",
    icono: "🚰",
    especialidad: "6. Maestro Plomero e Ingeniero Hidrosanitario (Norma ESSAP / NP)",
    profesionalRol: "Auditoría del Núcleo Húmedo Vertical en Eje F–G (z=3.00..5.00m), Conexión Directa ESSAP (Sin Tanque), PPR Frío/Caliente y Desagües Pluviales",
    calificacionActual: "99/100 (Núcleo Húmedo Eje F–G 100% alineado con plano instalacion_sanitaria_agua.png)",
    resumenDictamen: "Tal como establece el plano original 'instalacion_sanitaria_agua.png', todos los ambientes húmedos están alineados verticalmente sobre el frente en el Eje F–G (z = 3.00m..5.00m): en Planta Baja el Baño Social (1.10×2.00m) y la cabecera de Cocina; en Planta Alta el Vestidor, el Baño en Suite y el Baño 2 PA; y en el Subsuelo la conexión al Lavadero en pared izquierda. Al contar con agua corriente de buena presión en la zona, se alimenta directamente desde el medidor ESSAP (a nivel de calle al costado del portón, x = -3.85m) sin necesidad de tanque ni bomba.",
    huecosDetectadosYSoluciones: [
      {
        severidad: "OPTIMIZACIÓN DE COSTO (SIN TANQUE NI BOMBA)",
        hallazgo: "Alimentación Directa desde Caja de Medidor ESSAP al Costado del Portón (x = -3.85m, z = -4.24m) sin Tanque Cisterna",
        solucion: "Dado que la zona cuenta con agua corriente de ESSAP con buena presión constante, se elimina el gasto adicional de tanque cisterna y bomba presurizadora (ahorrando Gs. 4.100.000). La acometida PPR Ø25mm parte directamente desde la caja del medidor ESSAP a nivel de calle (al costado del portón en la muralla pequeña hacia el vecino, x = -3.85m, z = -4.24m) hacia el pleno vertical del Eje F–G.",
        costoMaterialesGs: 950000,
        costoManoObraGs: 550000,
        subtotalGs: 1500000,
        incluidoEnPartida: "instalaciones_sanitarias_desagues (7.2)"
      },
      {
        severidad: "CRÍTICO CONSTRUCTIVO (PASES #3 Y #4 EN NÚCLEO HÚMEDO EJE F–G)",
        hallazgo: "Pleno Hidrosanitario Unificado en Eje F–G (z=3.00..5.00m): Bajada Cloacal Ø100mm, Montantes PPR Fría/Caliente y Bajadas Pluviales Hacia el Frente",
        solucion: "Concentrar los baños de Planta Alta (Baño en Suite x=-2.80..+0.50m y Baño 2 PA x=+1.69..+3.84m) y el Baño Social de PB (x=-1.64..-0.40m) en la franja frontal Eje F–G (z=3.00m..5.00m) permite que el Pase #3 (Cloaca Ø115mm en x=-1.64m, z=3.45m) y el Pase #4 (Agua PPR Fría/Caliente Ø63mm en x=-1.64m, z=3.95m) resuelvan los 3 niveles con mínimo recorrido de cañerías, mientras las canaletas y bajadas pluviales desaguan hacia el frente (Calle Guillermo Arias).",
        costoMaterialesGs: 1850000,
        costoManoObraGs: 1250000,
        subtotalGs: 3100000,
        incluidoEnPartida: "instalaciones_sanitarias_desagues (7.2)"
      },
      {
        severidad: "AUTONOMÍA SANITARIA EN EL FONDO",
        hallazgo: "Ventilación Sanitaria Ø75mm a los 4 Vientos (+106.15m) + Colector Cloacal a Cámara Séptica y Pozo Ciego en Fondo",
        solucion: "Se prolonga la columna cloacal del Eje F–G con caño de ventilación PVC Ø75mm sobre el techo (+106.15m). En el Subsuelo, el colector cloacal recibe también el Lavadero (pared izquierda) y la bacha de la Parrillita inferior y corre con pendiente >=2% hacia la Cámara Séptica y el Pozo Ciego del patio posterior (evitando la precaria red vecinal).",
        costoMaterialesGs: 680000,
        costoManoObraGs: 420000,
        subtotalGs: 1100000,
        incluidoEnPartida: "forense_cloaca_subsuelo_bombeo (13.2)"
      }
    ],
    checklistControlPropietario: [
      "Exigir prueba hidráulica manométrica a 6 kg/cm² (6 bar) durante 24 horas en todas las cañerías verdes PPR del núcleo húmedo Eje F–G antes de tapar canaletas.",
      "Verificar pendiente mínima del 2% (2 cm por metro) en el colector PVC Ø100mm desde el Eje F–G hacia la Cámara Séptica en el fondo."
    ]
  }
];

// ============================================================================
// INVENTARIO EXACTO Y COORDENADAS 3D/2D DE DUCTOS, PASES EN LOSA 1 EXISTENTE,
// TABLEROS, ENCHUFES (16A/20A), LLAVES Y CAÑERÍAS HIDROSANITARIAS
// ============================================================================
export const DUCTOS_PASES_ENCHUFES_DATOS = {
  resumenTecnico:
    "De acuerdo con el plano original 'instalacion_sanitaria_agua.png', todos los ambientes húmedos están concentrados verticalmente en el Núcleo Húmedo del frente (Eje F–G, z = 3.00m..5.00m): Baño Social y cabecera de Cocina en Planta Baja; Vestidor, Baño en Suite y Baño 2 en Planta Alta; y conexión al Lavadero en el Subsuelo. La bajada de luz ANDE y la caja del medidor de agua ESSAP a nivel de calle se ubican exactamente al costado del portón vehicular sobre la muralla más pequeña que da al vecino (x = -3.85m, z = -4.08m..-4.24m), alimentando la casa con presión directa de red (sin tanque).",
  pasesLosa1Diamantados: [
    {
      id: "PASE_LOSA1_01_ELECTRICO",
      codigo: "PASE #1 (Ø 50 mm)",
      nombre: "Pase Diamantado #1 en Losa 1 — Troncal Eléctrico Principal en Núcleo Eje F–G (TP-PB ↔ Subsuelo y Planta Alta)",
      diametroMm: 50,
      pos3D: [-1.64, 0.0, 4.65],
      ejeRef: "Pleno Eje F / Eje 6 (x = -1.64m, z = 4.65m — Junto a Pilar P14)",
      colorHex: 0xf97316,
      conductores: "Cable subterráneo NYY 4×10 mm² + PE 10 mm² desde Bajada ANDE al costado del portón (x=-3.85m) y alimentador 5×6 mm² hacia TS-SUB y TS-PA + Sellado Cortafuego Intumescente.",
      metodoEjecucion: "Perforación vertical con máquina sacabocado de copa diamantada Ø 50mm húmeda, a 18 cm de la cara del pilar P14 y fuera del alma de la viga."
    },
    {
      id: "PASE_LOSA1_02_DATOS",
      codigo: "PASE #2 (Ø 50 mm)",
      nombre: "Pase Diamantado #2 en Losa 1 — Señales Débiles, Fibra Óptica, UTP Cat6 y Alarma en Eje F–G",
      diametroMm: 50,
      pos3D: [-1.64, 0.0, 5.35],
      ejeRef: "Eje 6 (x = -1.64m, z = 5.35m — Separado 70 cm del Pase Eléctrico s/ Norma ANDE/INTN)",
      colorHex: 0xa855f7,
      conductores: "Fibra óptica + 6 cables UTP Cat6 100% cobre (CCTV PoE / Wi-Fi 6 Mesh / Escritorio PA) + Bus de sensores de Alarma Pet-Immune.",
      metodoEjecucion: "Perforación con sacabocado de copa diamantada Ø 50mm con camisa PVC pesada y boquilla anti-filo."
    },
    {
      id: "PASE_LOSA1_03_CLOACA",
      codigo: "PASE #3 (Ø 115 mm)",
      nombre: "Pase Diamantado #3 en Losa 1 — Columna de Bajada Cloacal Vertical PVC Ø 100mm en Núcleo Húmedo Eje F–G",
      diametroMm: 115,
      pos3D: [-1.64, 0.0, 3.45],
      ejeRef: "Núcleo Húmedo Eje F–G / Eje 6 (x = -1.64m, z = 3.45m — Pleno Baño Social PB y Baño en Suite / Baño 2 PA)",
      colorHex: 0xd97706,
      conductores: "Columna montante cloacal PVC reforzado Ø 100mm (unifica descargas de Baño en Suite PA, Baño 2 PA y Baño Social PB hacia Subsuelo y Cámara Séptica en el fondo).",
      metodoEjecucion: "Perforación con copa diamantada Ø 115mm en pleno técnico del Eje F–G, sellada con mástic poliuretánico Sikaflex-1A."
    },
    {
      id: "PASE_LOSA1_04_AGUA_PPR",
      codigo: "PASE #4 (Ø 63 mm)",
      nombre: "Pase Diamantado #4 en Losa 1 — Montantes de Agua Fría Directa ESSAP (PPR Ø25mm) y Caliente (PPR Ø20mm) en Eje F–G",
      diametroMm: 63,
      pos3D: [-1.64, 0.0, 3.95],
      ejeRef: "Núcleo Húmedo Eje F–G / Eje 6 (x = -1.64m, z = 3.95m — Entre Cocina y Baño Social PB)",
      colorHex: 0x0284c7,
      conductores: "Subida de Agua Fría Directa ESSAP PPR PN20 Ø 25mm desde la Caja de Medidor a nivel de calle (x=-3.85m, z=-4.24m, sin tanque) hacia PB, PA y Subsuelo + distribución de Agua Caliente PPR PN20 Ø 20mm aislada para Baño en Suite, Baño 2, Baño Social y Cocina.",
      metodoEjecucion: "Perforación con copa diamantada Ø 63mm encamisada con caño PVC Ø 63mm en pleno Eje F–G."
    }
  ],
  tablerosYEquiposPrincipales: [
    {
      id: "TAB_PILASTRA_ANDE",
      codigo: "M-ANDE 3×40A",
      nombre: "Bajada de Luz y Medidor Trifásico ANDE al Costado del Portón (en la Muralla Pequeña hacia el Vecino, x = -3.85m)",
      nivel: "Muralla Pequeña al Costado del Portón (x = -3.85m, z = -4.08m)",
      pos3D: [-3.85, 1.35, -4.08],
      colorHex: 0xf59e0b,
      especificacion: "Caño galvanizado de bajada c/ pipeta + Caja homologada ANDE p/ medidor electrónico trifásico + Llave TM 3×40A ubicada exactamente al costado del portón en la muralla pequeña hacia el vecino."
    },
    {
      id: "TAB_TP_PB",
      codigo: "TP-PB (36 DIN)",
      nombre: "Tablero Principal Planta Baja en Núcleo Eje F–G (36 Módulos DIN + DPS Clase II 40kA + 3 Diferenciales 30mA)",
      nivel: "Planta Baja (+100.00m)",
      pos3D: [-1.55, 1.55, 4.65],
      colorHex: 0xef4444,
      especificacion: "Corte general 4×40A + Protector de Sobretensiones DPS Tetrapolar Clase II 40kA + 3 Disyuntores Diferenciales 30mA + 12 llaves termomagnéticas sectorizadas."
    },
    {
      id: "TAB_TS_PA",
      codigo: "TS-PA (18 DIN)",
      nombre: "Subtablero Seccional Planta Alta (+102.88m — Suite, Dormitorio 2, Escritorio, 2 Baños, Splits AA y Termocalefón 80L)",
      nivel: "Planta Alta (+102.88m)",
      pos3D: [-0.55, 4.45, 4.65],
      colorHex: 0xef4444,
      especificacion: "Gabinete embutido 18 DIN en Eje F con Diferencial 2×40A 30mA dedicado para Dormitorio en Suite, Dormitorio 2, Escritorio y Termocalefón 80L."
    },
    {
      id: "TAB_TS_SUB",
      codigo: "TS-SUB (12 DIN IP65)",
      nombre: "Subtablero Seccional Estanco Subsuelo (+97.66m — Lavarropas en Pared Izquierda, Salón, Parrillita y Exterior)",
      nivel: "Subsuelo (+97.66m)",
      pos3D: [-1.64, -0.85, 4.65],
      colorHex: 0xef4444,
      especificacion: "Gabinete estanco IP65 de 12 DIN con Diferencial 30mA dedicado para Lavarropas en pared izquierda, Salón Subsuelo, Parrillita inferior y patio."
    },
    {
      id: "HID_MEDIDOR_ESSAP",
      codigo: "M-ESSAP ¾\"",
      nombre: "Caja del Medidor de Agua Potable ESSAP a Nivel de Calle (al Costado del Portón bajo Bajada ANDE, x = -3.85m)",
      nivel: "Nivel de Calle / Vereda al Costado del Portón (x = -3.85m, z = -4.24m)",
      pos3D: [-3.85, 0.08, -4.24],
      colorHex: 0x0284c7,
      especificacion: "Caja de medidor ESSAP a nivel de calle en la muralla más pequeña al costado del portón (x = -3.85m, z = -4.24m) con llave de paso esférica y válvula de retención. Alimenta directamente la vivienda con buena presión de red (sin tanque)."
    }
  ],
  enchufesYTomacorrientes: [
    // Planta Baja (Y = 0.00m): Tomas de 20A (Rojos) y 16A (Azules)
    { id: "TOMA_PB_01_AF_MW", codigo: "20A-COC-1", tipo: "toma_20a", nivel: "planta_baja", pos3D: [-2.32, 1.12, 3.08], label: "Doble Toma 20A (Cable 4mm²) sobre Mesada Eje G — Air Fryer Xiaomi 6L (1500W)" },
    { id: "TOMA_PB_02_MW_RACK", codigo: "20A-COC-2", tipo: "toma_20a", nivel: "planta_baja", pos3D: [-4.76, 1.05, 4.55], label: "Doble Toma 20A (Cable 4mm²) — Mueble de Microondas y Horno en Cocina" },
    { id: "TOMA_PB_03_HELADERA", codigo: "16A-HEL", tipo: "toma_16a", nivel: "planta_baja", pos3D: [-4.76, 0.65, 5.10], label: "Toma 16A Dedicado — Heladera con Freezer de Ruth y Leo" },
    { id: "TOMA_PB_04_CAMPANA", codigo: "16A-EXT", tipo: "toma_16a", nivel: "planta_baja", pos3D: [-4.76, 1.85, 3.92], label: "Toma 16A Alto (h=1.85m) — Campana Extractora de Cocina y Chispero" },
    { id: "TOMA_PB_05_ISLA", codigo: "16A-ISLA", tipo: "toma_16a", nivel: "planta_baja", pos3D: [-2.10, 0.82, 4.85], label: "Doble Toma 16A + USB-C en Isla / Comedor (Ducto por Carpeta Losa L4)" },
    { id: "TOMA_PB_06_TV32", codigo: "16A-TV", tipo: "toma_16a", nivel: "planta_baja", pos3D: [3.75, 0.55, 5.45], label: "Doble Toma 16A + Boca RJ45 Cat6 — Estar Social (4.95×4.80m) TV 32\"" },
    { id: "TOMA_PB_07_VAPOR", codigo: "16A-SALA-1", tipo: "toma_16a", nivel: "planta_baja", pos3D: [0.25, 0.35, 5.12], label: "Toma 16A — Estar Social y Vaporizador Xiaomi" },
    { id: "TOMA_PB_08_PURIF", codigo: "16A-SALA-2", tipo: "toma_16a", nivel: "planta_baja", pos3D: [3.42, 0.35, 5.12], label: "Toma 16A — Purificador de Aire Xiaomi Smart Air Purifier" },
    { id: "TOMA_PB_09_BIBLIO_PB", codigo: "16A-BIB-PB", tipo: "toma_16a", nivel: "planta_baja", pos3D: [-4.76, 0.35, 9.10], label: "Doble Toma 16A — Comedor / Lectura junto a Biblioteca de 4 Estantes" },
    { id: "TOMA_PB_10_AA_SALA", codigo: "20A-AA-PB", tipo: "toma_20a", nivel: "planta_baja", pos3D: [4.76, 2.35, 7.20], label: "Toma 20A Alto — Split Aire Acondicionado 18.000 BTU Estar Social" },
    { id: "TOMA_PB_11_GALERIA", codigo: "16A-GAL-IP55", tipo: "toma_16a", nivel: "planta_baja", pos3D: [-4.76, 0.45, 11.45], label: "Doble Toma Estanco IP55 en Galería al Río (-0.45m, sin parrilla fija)" },
    { id: "TOMA_PB_12_PORTON", codigo: "20A-PORTON", tipo: "toma_20a", nivel: "planta_baja", pos3D: [-2.35, 1.45, -3.85], label: "Alimentación 20A Estanca — Motor Portón Balancín 2.30m (x=-3.50..-1.20m) y Cerradura Portoncito Peatonal 0.95m (x=+1.25..+2.20m)" },

    // Planta Alta (Y = +2.88m): Dormitorio en Suite + Vestidor + Dormitorio 2 + Escritorio + 2 Baños en Eje F-G
    { id: "TOMA_PA_01_MESALUZ_N", codigo: "16A-ML-1", tipo: "toma_16a", nivel: "planta_alta", pos3D: [-4.76, 3.65, 6.80], label: "Doble Toma 16A + Llave Conmutada — Mesa de Luz #1 en Suite Principal (4.13×4.94m)" },
    { id: "TOMA_PA_02_MESALUZ_S", codigo: "16A-ML-2", tipo: "toma_16a", nivel: "planta_alta", pos3D: [-4.76, 3.65, 8.60], label: "Doble Toma 16A + Botón S.O.S. — Mesa de Luz #2 en Suite Principal" },
    { id: "TOMA_PA_03_VESTIDOR", codigo: "16A-VEST", tipo: "toma_16a", nivel: "planta_alta", pos3D: [-3.80, 3.85, 3.12], label: "Doble Toma 16A — Vestidor (2.07×2.00m en Eje F–G) y Tocador" },
    { id: "TOMA_PA_04_AA_SUITE", codigo: "20A-AA-SUITE", tipo: "toma_20a", nivel: "planta_alta", pos3D: [-4.76, 5.15, 7.70], label: "Toma 20A Dedicado — Split Aire Acondicionado 12.000 BTU Dormitorio en Suite" },
    { id: "TOMA_PA_05_TERMOCAL", codigo: "20A-TERMO-80L", tipo: "toma_20a", nivel: "planta_alta", pos3D: [-1.64, 4.95, 3.15], label: "Conexión 20A Dedicada — Termocalefón 80L en Núcleo Húmedo Eje F–G (Baño Suite / Baño 2)" },
    { id: "TOMA_PA_06_VANITORY_PA", codigo: "16A-BANO-PA", tipo: "toma_16a", nivel: "planta_alta", pos3D: [-1.20, 4.05, 3.15], label: "Toma 16A c/ Tapa Húmeda + Luz Espejo LED — Baño en Suite y Baño 2 PA (Eje F–G)" },
    { id: "TOMA_PA_07_DORM2", codigo: "16A-DORM2", tipo: "toma_16a", nivel: "planta_alta", pos3D: [0.50, 3.55, 5.40], label: "Doble Toma 16A + Boca RJ45 Cat6 — Dormitorio 2 Central (2.54×3.40m)" },
    { id: "TOMA_PA_08_ESCRITORIO", codigo: "16A-DESK-PA", tipo: "toma_16a", nivel: "planta_alta", pos3D: [3.20, 3.55, 7.50], label: "Cuádruple Toma 16A + 2 Bocas RJ45 Cat6 — Escritorio / Estudio PA (2.50×3.05m al llegar de Escalera 2)" },
    { id: "TOMA_PA_09_COSTURA", codigo: "16A-COSER", tipo: "toma_16a", nivel: "planta_alta", pos3D: [4.76, 3.55, 8.20], label: "Doble Toma 16A — Rincón de Estudio y Máquina de Coser en Escritorio PA" },
    { id: "TOMA_PA_10_AA_DORM2_EST", codigo: "20A-AA-EST", tipo: "toma_20a", nivel: "planta_alta", pos3D: [1.80, 5.15, 7.50], label: "Toma 20A Dedicado — Split Aire Acondicionado 12.000 BTU Dormitorio 2 / Escritorio" },

    // Subsuelo (Y = -2.34m): Lavadero en Pared Izquierda (+X), Salón y Parrillita hacia el Patio
    { id: "TOMA_SUB_01_LAVARROPAS", codigo: "20A-LAV-SUB", tipo: "toma_20a", nivel: "subsuelo", pos3D: [4.62, -1.25, 6.20], label: "Toma 20A Estanco IP55 (Cable 4mm²) — Lavarropas Automático en Lavadero contra Pared Izquierda (Eje 1)" },
    { id: "TOMA_SUB_03_DEPOSITO", codigo: "16A-SALON-SUB", tipo: "toma_16a", nivel: "subsuelo", pos3D: [1.50, -1.25, 4.20], label: "Doble Toma 16A Estanco IP55 — Gran Salón Abierto en Subsuelo (con piso de lecherada)" },
    { id: "TOMA_SUB_04_PARRILLITA", codigo: "16A-QUINCHO-SUB", tipo: "toma_16a", nivel: "subsuelo", pos3D: [-3.20, -1.25, 12.20], label: "Doble Toma Estanco IP55 — Parrillita / Quincho Inferior hacia el Patio (x=-4.87..-1.64m, z=11.50..13.34m)" }
  ],
  llavesYConmutadas3Way: [
    { id: "LLAVE_3W_ESC1_PB", codigo: "3W-ESC1-PB", pos3D: [-3.90, 1.15, 5.26], nivel: "planta_baja", label: "Llave Combinada 3-Way + Luz Emergencia LED #1 — Arranque Escalera 1 al Subsuelo (Pared Derecha Eje 8–9)" },
    { id: "LLAVE_3W_ESC1_SUB", codigo: "3W-ESC1-SUB", pos3D: [-3.90, -1.15, 8.56], nivel: "subsuelo", label: "Llave Combinada 3-Way + Luz Emergencia LED #2 — Pie de Escalera 1 en Subsuelo (Eje 8–9)" },
    { id: "LLAVE_3W_ESCPA_PB", codigo: "3W-ESC2-PB", pos3D: [3.84, 1.15, 5.26], nivel: "planta_baja", label: "Llave Combinada 3-Way — Arranque Escalera 2 a Planta Alta (Pared Izquierda Eje 1–2)" },
    { id: "LLAVE_3W_ESCPA_PA", codigo: "3W-ESC2-PA", pos3D: [3.84, 4.05, 7.37], nivel: "planta_alta", label: "Llave Combinada 3-Way + Luz Emergencia LED #3 — Llegada Escalera 2 al Escritorio en Planta Alta (Eje 1–2)" },
    { id: "LLAVE_ACCESO_PB", codigo: "LL-ACCESO", pos3D: [0.85, 1.15, 3.12], nivel: "planta_baja", label: "Llave Triple Encendido — Puerta Principal Eje G, Estar Social y Rejilla Frontal" },
    { id: "LLAVE_COCINA_PB", codigo: "LL-COCINA", pos3D: [-1.64, 1.15, 5.00], nivel: "planta_baja", label: "Llave Doble — Iluminación Cocina/Comedor y Baño Social (Núcleo Eje F–G)" },
    { id: "LLAVE_SUITE_PA", codigo: "LL-SUITE-PA", pos3D: [-0.74, 4.05, 5.20], nivel: "planta_alta", label: "Llave Combinada 3-Way — Acceso a Dormitorio en Suite, Vestidor y Baño Suite" }
  ]
};

// ============================================================================
// EVALUACIÓN DE COMPRA DIRECTA EN CHINA: EQUIPAMIENTO ELÉCTRICO INTELIGENTE (RIEL DIN)
// + INTERRUPTORES DOMÓTICOS DE HABITACIÓN + MONITOREO Y PREVENCIÓN ACTIVA EN RED LOCAL
// ============================================================================
export const ESTRATEGIA_COMPRA_CHINA_DOMOTICA_ELECTRICA = {
  titulo: "Estrategia de Compra Directa en China: Tablero Inteligente en Riel DIN, Interruptores de Habitación y Prevención Activa de Fallas (Red Local LAN/Zigbee)",
  resumenEjecutivo:
    "Como la instalación eléctrica de los 3 niveles se ejecutará 100% de cero, importar un lote consolidado desde China (Shenzhen vía courier aéreo a Asunción ~USD 22/kg, peso total del lote ~6,5 kg) permite equipar toda la casa con Llaves Generales Inteligentes en Riel DIN (medición activa de kWh/Gs., corte por alta/baja tensión de ANDE, detección de fugas mA y temperatura de bornes) e Interruptores Inteligentes de Habitación por prácticamente el mismo costo —o incluso menos— que comprar llaves ciegas tradicionales en casas de electricidad locales.",
  requisitosObraDeCeroSinCostoExtra: [
    {
      nro: 1,
      regla: "Bajar Cable Neutro (Celeste) a TODAS las cajas de interruptores de luz",
      explicacion: "En Paraguay los electricistas suelen bajar solo Fase y Retorno a la llave de pared. Como la obra es de cero, exigir por contrato que llegue el hilo Neutro a las 14 cajas de interruptores: cuesta apenas ~Gs. 135.000 adicionales de cable y permite instalar cualquier interruptor inteligente con Neutro (más estable, sin parpadeo LED y funciona como repetidor de red Zigbee Mesh)."
    },
    {
      nro: 2,
      regla: "Instalar Cajas Embutidas Profundas (5×10×5,5 cm o 6 cm) en Mampostería Tobatí",
      explicacion: "Las cajas estándar chatas de 3,5 cm aprietan los cables detrás de un interruptor inteligente o micromódulo. Usar cajas plásticas reforzadas de 5,5–6,0 cm de profundidad cuesta lo mismo y deja espacio limpio para disipación térmica."
    },
    {
      nro: 3,
      regla: "Tablero TP-PB de 36 a 48 Módulos DIN con Puerta Acrílica Fumée (No Chapa Ciega)",
      explicacion: "Las llaves generales inteligentes en riel DIN transmiten por Zigbee 3.0 / Wi-Fi local. Un gabinete con frente de policarbonato fumée permite ver los displays digitales de Voltaje/Amperaje/Temperatura sin abrir el tablero y no apantalla la señal inalámbrica hacia la red interna."
    },
    {
      nro: 4,
      regla: "Conmutación 3-Way de Escaleras por Escena Local (Ahorro de Cableado en Losa 1)",
      explicacion: "Con interruptores inteligentes de 2/3 canales, los botones secundarios pueden vincularse por software local (binding Zigbee directo) con la llave del otro extremo de la escalera sin necesidad de pasar 2 cables puentes adicionales entre pisos."
    }
  ],
  comparativaLotesChinaVsLocal: [
    {
      id: "kit_basico_tablero_interruptores",
      nombre: "Kit 1 (Básico Esencial): Llaves Generales Inteligentes DIN + 14 Interruptores de Habitación",
      enfoque: "Monitoreo Trifásico en Tablero + Protección Alta/Baja Tensión ANDE + Llaves Inteligentes en todos los ambientes",
      pesoEstimadoKg: 4.2,
      costoFobChinaUsd: 215,
      costoCourierAsuncionUsd: 92,
      costoTotalPuestoAsuncionGs: 2365000,
      costoEquivalenteEnAsuncionGs: 5480000,
      ahorroNetoGs: 3115000,
      protocoloRedInterna: "Zigbee 3.0 / LAN Local (Compatible 100% con Xiaomi Home / Home Assistant / Alexa sin depender de internet)",
      componentes: [
        {
          item: "1 Medidor Bidireccional Trifásico en Riel DIN c/ 3 Pinzas CT 80A (MatSee Plus / IAMMETER / Tongou)",
          cant: "1 un.",
          costoChinaGs: 295000,
          precioLocalGs: 890000,
          funcionPreventiva: "Mide en vivo Voltaje (V), Corriente (A), Potencia (W) y Consumo (kWh y Gs.) de cada una de las 3 fases de ANDE (R, S, T). Detecta desbalance de fases."
        },
        {
          item: "3 Protectores Digitales de Sobre/Baja Tensión y Sobrecorriente 63A en Riel DIN con Telemetría (1 por Fase R-S-T)",
          cant: "3 un.",
          costoChinaGs: 345000,
          precioLocalGs: 870000,
          funcionPreventiva: "En verano en Asunción la tensión de ANDE cae a <175V o sube de golpe tras un corte: corta en 0,1s protegiendo la Heladera, los 3 Aires Split y el Motor del Portón, y reconecta solo cuando la red se estabiliza."
        },
        {
          item: "6 Disyuntores Inteligentes Riel DIN c/ Medición de Consumo, Fuga (mA) y Temperatura de Borne (Tongou / Tuya Zigbee / Sonoff)",
          cant: "6 un.",
          costoChinaGs: 780000,
          precioLocalGs: 1860000,
          funcionPreventiva: "Para Termocalefón 80L (programación horaria automática), 3 Aires Split, Circuito Cocina 20A y Bomba/Lavadero Subsuelo. Alerta al celular si un borne supera 70°C (falso contacto antes de que se queme el cable) o si hay fuga a tierra (>15 mA)."
        },
        {
          item: "14 Interruptores de Pared Inteligentes Zigbee 3.0 con Neutro (Tecla Física/Touch de 1, 2 y 3 canales — Aqara / Sonoff SwitchMan M5 / Moes)",
          cant: "14 un.",
          costoChinaGs: 945000,
          precioLocalGs: 1860000,
          funcionPreventiva: "Reemplaza las llaves comunes en Sala, Comedor, Cocina, Galería, Escaleras (3-Way), Dormitorio Suite, Estudio y Subsuelo. Funcionan manualmente aunque se corte el Wi-Fi y permiten apagar toda la casa desde la cama o programar simulación de presencia."
        }
      ]
    },
    {
      id: "kit_avanzado_prevencion_activa",
      nombre: "Kit 2 (Prevención Activa Total): + Hub LAN PoE + Corte Automático de Agua/Gas + Monitoreo por Enchufe",
      enfoque: "Automatización Predictiva 100% Local (Home Assistant PoE) + Prevención de Incendio Eléctrico, Inundación y Fuga de Gas",
      pesoEstimadoKg: 6.8,
      costoFobChinaUsd: 355,
      costoCourierAsuncionUsd: 150,
      costoTotalPuestoAsuncionGs: 3885000,
      costoEquivalenteEnAsuncionGs: 9250000,
      ahorroNetoGs: 5365000,
      protocoloRedInterna: "Servidor Local + Coordinador Zigbee PoE SMLight SLZB-06 en el Rack 6U (Funciona 100% en Red Interna LAN aunque corten la fibra óptica)",
      componentes: [
        {
          item: "Todo el Kit 1 (Medidor Trifásico DIN + 3 Protectores Tensión + 6 Llaves DIN Inteligentes + 14 Interruptores de Habitación)",
          cant: "1 lote",
          costoChinaGs: 2365000,
          precioLocalGs: 5480000,
          funcionPreventiva: "Control total de tableros e iluminación en los 3 niveles."
        },
        {
          item: "1 Coordinador Zigbee 3.0 PoE Industrial (SMLight SLZB-06) + Mini-Hub Local para Red Interna",
          cant: "1 cjto.",
          costoChinaGs: 490000,
          precioLocalGs: 1350000,
          funcionPreventiva: "Se conecta por cable UTP Cat6 al Switch PoE del Rack principal: crea una red interna privada de ultra baja latencia que integra los equipos Xiaomi de Ruth y Leo sin depender de servidores externos."
        },
        {
          item: "4 Sensores de Inundación/Fuga de Agua Zigbee (Cocina, Termocalefón 2do Piso, Baño y Lavadero/Cisterna Subsuelo)",
          cant: "4 un.",
          costoChinaGs: 290000,
          precioLocalGs: 760000,
          funcionPreventiva: "Si se rompe un flexible de noche o pierde el termocalefón, el sensor detecta la primera gota y corta automáticamente la llave general de la Bomba Presurizadora en el tablero DIN, evitando inundar el piso."
        },
        {
          item: "1 Detector Inteligente de Gas GLP + 2 Detectores de Humo Fotoeléctricos Zigbee (Cocina y Caja de Escalera)",
          cant: "3 un.",
          costoChinaGs: 320000,
          precioLocalGs: 780000,
          funcionPreventiva: "Monitorea pérdidas de garrafa GLP o humo en cocina y escalera, disparando sirena local y notificación crítica al celular de Leo y Ruth."
        },
        {
          item: "8 Tomacorrientes / Micromódulos Inteligentes de 20A con Medidor de Consumo (Heladera, Air Fryer, Microondas, Lavarropas, Escritorios)",
          cant: "8 un.",
          costoChinaGs: 420000,
          precioLocalGs: 880000,
          funcionPreventiva: "Permite auditar el consumo individual de cada electrodoméstico y avisa si la heladera pierde frío o si quedó un artefacto encendido."
        }
      ]
    }
  ],
  alertasPrevencionActivaQueDetecta: [
    "⚡ Baja Tensión Severa de ANDE (< 185V en siestas de verano): Corta la fase afectada en 0,1s antes de que se queme el compresor de la heladera o el motor del portón balancín.",
    "🔥 Falso Contacto / Recalentamiento de Bornes (> 70°C en Tablero): Los disyuntores DIN inteligentes tienen sensor NTC interno y envían alerta preventiva antes de que se derrita el aislante.",
    "💧 Pérdida Silenciosa de Agua o Cisterna Vacía: Si la Bomba Presurizadora del Subsuelo arranca cada 5 minutos de madrugada (canilla o inodoro perdiendo), el medidor de corriente de la llave DIN lo detecta y avisa al celular.",
    "🛡️ Fuga Progresiva a Tierra (10 a 25 mA antes del disparo de 30 mA): Permite detectar humedad en un circuito exterior o resistencia de termocalefón envejecida antes de que deje la casa sin luz."
  ]
};

// ============================================================================
// REPOSITORIO ESTRUCTURADO DE ARCHIVOS ORIGINALES, PLANOS, INFORMES Y GITHUB
// ============================================================================
export const REPOSITORIO_ARCHIVOS_PROYECTO = {
  titulo: "Repositorio Documental Oficial — Residencia Itá Pytã Punta (Planos Originales, Informes Técnicos y Código 3D)",
  githubRepoUrl: "https://github.com/leoberniga/itapytapunta-3d",
  githubPagesUrl: "https://leoberniga.github.io/itapytapunta-3d/",
  categorias: [
    {
      id: "planos_arquitectura",
      nombre: "📐 Planos Originales de Arquitectura y Adecuación",
      archivos: [
        {
          id: "arq_ga_leo",
          codigo: "ARQ-GA-LEO",
          titulo: "Lámina General de Arquitectura Original (Modelo Ga-Leo: PB, PA y Cortes)",
          autor: "Arq. Gabriela Rolón",
          tipo: "PNG / CAD",
          url: "./assets/planos/arquitectura_ga_leo_modelo.png",
          descripcion: "Plantas originales con PB social (Estar 4.95×4.80m, Cocina/Comedor 6.20×2.75m, Baño Social 1.10×2.00m y Galería al Río) y PA (Escritorio, Dormitorio 2, Suite con Vestidor y 2 Baños sobre Eje F–G)."
        },
        {
          id: "arq_lg_rb",
          codigo: "ARQ-LG-RB",
          titulo: "Proyecto de Adecuación y Cerramiento Primera Etapa (LG-RB + Loza Rap)",
          autor: "Arq. Gabriela Rolón",
          tipo: "PNG / CAD",
          url: "./assets/planos/arquitectura_lg_rb.png",
          descripcion: "Lámina de adecuación vinculada al cerramiento del vacío de 38.00 m² con Loza Rap en Losa 1."
        },
        {
          id: "arq_acotado_svg",
          codigo: "ARQ-VEC-1",
          titulo: "Planta Arquitectónica Acotada Vectorial (SVG / PNG)",
          autor: "Arq. Gabriela Rolón",
          tipo: "SVG / PNG",
          url: "./assets/plano_acotado.svg",
          urlAlternativa: "./assets/plano_acotado-1.png",
          descripcion: "Relevamiento acotado de ejes estructurales 1–9 y A–G (9.74m × 10.34m)."
        },
        {
          id: "sub_ejec_1",
          codigo: "SUB-1 / SUB-2",
          titulo: "Subsuelo Ejecutivo — Planta y Cortes (+97.66m / -2.34m)",
          autor: "Arq. Gabriela Rolón",
          tipo: "PNG",
          url: "./assets/subsuelo_ejecutivo_1-1.png",
          urlAlternativa: "./assets/planos/subsuelo_ejecutivo_2.png",
          descripcion: "Planta de Subsuelo con llegada de Escalera 1 en Eje 8–9, Lavadero, Depósito y Parrillita hacia el patio."
        }
      ]
    },
    {
      id: "planos_estructurales",
      nombre: "🏗️ Planos Estructurales Oficiales (Ing. Gustavo Velázquez — Reg. MOPC N° 3135)",
      archivos: [
        {
          id: "est_e1_e2",
          codigo: "E1 / E2",
          titulo: "E1 y E2 — Replanteo de Cimentación, 14 Zapatas (-4.64m) y Vigas Centradoras VC.T-1",
          autor: "Ing. Gustavo Velázquez",
          tipo: "PNG",
          url: "./assets/planos/estructural_e1_cimentacion.png",
          urlAlternativa: "./assets/planos/estructural_e2_fundaciones.png",
          descripcion: "Fundaciones ejecutadas al 100% en estrato de arenisca cementada (Nspt > 50)."
        },
        {
          id: "est_e3",
          codigo: "E3",
          titulo: "E3 — Encofrado Primera Losa sobre Subsuelo (+100.00m / Galería L1 -0.45m)",
          autor: "Ing. Gustavo Velázquez",
          tipo: "PNG",
          url: "./assets/planos/estructural_e3_losa_planta_baja.png",
          descripcion: "Muestra Losa L1 (Galería 33.42 m²) y Losa L4 (Ejes 1–5 junto a Escalera 1) hormigonadas y el sector sin losa de 38.00 m² entre vigas en Ejes 5–9 (-X)."
        },
        {
          id: "est_e4",
          codigo: "E4",
          titulo: "E4 — Encofrado Losa Planta Alta (+102.88m / +2.88m) y 17 Pilares que Suben",
          autor: "Ing. Gustavo Velázquez",
          tipo: "PNG",
          url: "./assets/planos/estructural_e4_planta_alta.png",
          descripcion: "Losa de Planta Alta alineada al frente en Eje G (z=3.00m) y verifica que P12, P13 y P15 mueren en 0.00m mientras los otros 17 pilares ya están hormigonados hasta +2.88m."
        },
        {
          id: "est_e5_e9",
          codigo: "E5 / E9",
          titulo: "E5 (Pórticos 1–7 y Escalera 1 en Eje 8–9) + E9 (Cuadro de 20 Pilares P1–P20)",
          autor: "Ing. Gustavo Velázquez",
          tipo: "PNG",
          url: "./assets/planos/estructural_e5_subsuelo_escalera.png",
          urlAlternativa: "./assets/planos/estructural_e9_cuadro_pilares.png",
          descripcion: "Geometría exacta de la Escalera 1 en Eje 8–9 y armaduras de los 20 pilares."
        }
      ]
    },
    {
      id: "planos_instalaciones",
      nombre: "🚰⚡ Planos de Instalaciones (Hidrosanitaria Eje F–G, Pluvial, Eléctrica y Señales Débiles)",
      archivos: [
        {
          id: "inst_sanitaria",
          codigo: "IS / IH",
          titulo: "Instalación Sanitaria Cloacal y Agua Fría/Caliente (Núcleo Húmedo Eje F–G)",
          autor: "Arq. Gabriela Rolón / Equipo Técnico",
          tipo: "PNG",
          url: "./assets/planos/instalacion_sanitaria_agua.png",
          descripcion: "Plano rector que alinea verticalmente el Baño Social y Cocina (PB) con el Vestidor, Baño en Suite y Baño 2 (PA) sobre el Eje F–G, las escaleras opuestas (Escalera 1 en Eje 8–9 y Escalera 2 en Eje 1–2) y la Parrillita en el Subsuelo mirando al patio."
        },
        {
          id: "inst_pluvial",
          codigo: "IAA",
          titulo: "Instalación de Desagüe Pluvial y Canaletas",
          autor: "Arq. Gabriela Rolón / Equipo Técnico",
          tipo: "PNG",
          url: "./assets/planos/instalacion_desague_pluvial.png",
          descripcion: "Evacuación pluvial de cubiertas, bajadas verticales y drenaje del foso frontal."
        },
        {
          id: "inst_electrica",
          codigo: "IE-1 / IE-2 / ISD",
          titulo: "Instalación Eléctrica (Plantas y Unifilar Trifásico) + Señales Débiles (ISD)",
          autor: "Arq. Gabriela Rolón / Equipo Técnico",
          tipo: "PNG",
          url: "./assets/planos/instalacion_electrica_plantas.png",
          urlAlternativa: "./assets/planos/instalacion_senales_debiles.png",
          descripcion: "Circuitos de iluminación, tomas, AA Split, esquema unifilar ANDE y red de datos/CCTV."
        }
      ]
    },
    {
      id: "informes_certificaciones_presupuestos",
      nombre: "📋 Estudio Geotécnico, Ensayos PROBETI, Acta de Recepción y Planillas de Presupuesto",
      archivos: [
        {
          id: "geo_stan_2956",
          codigo: "GEO-STAN #2956",
          titulo: "Estudio Geotécnico SPT (Sondeos S1, S2 y S3) y Perfil del Barranco",
          autor: "GEO-STAN S.R.L.",
          tipo: "SVG / PNG",
          url: "./assets/corte_terreno.svg",
          urlAlternativa: "./assets/ubicacion_terreno.svg",
          descripcion: "Certifica el rechazo SPT (Nspt > 50) en arenisca a -4.64m y las cotas reales del terreno (+100.00m a +96.20m)."
        },
        {
          id: "probeti_acta_jivesa",
          codigo: "PROBETI #17671 / ACTA",
          titulo: "Ensayos de Rotura de Hormigón PROBETI (315 kg/cm² en Losa 1) y Acta de Recepción JIVESA (29/12/2025)",
          autor: "Laboratorio PROBETI / JIVESA S.A.",
          tipo: "Certificación Oficial",
          url: "https://github.com/leoberniga/itapytapunta-3d",
          descripcion: "Certifica la resistencia característica fck >= 305–325 kg/cm² en Losa 1 y 240–265 kg/cm² en los 17 pilares de PB ya hormigonados hasta +2.88m (Total ejecutado Gs. 163.820.972)."
        },
        {
          id: "edifica_studio_planillas",
          codigo: "EDIFICA A/B",
          titulo: "Presupuestos Escaneados Edifica Studio E.A.S. (Opción A Gs. 573,9M y Opción B Gs. 460,1M)",
          autor: "Arq. Lissie Amarilla & Arq. Roque León",
          tipo: "PNG",
          url: "./assets/planos/edifica_studio_573m_pag1.png",
          urlAlternativa: "./assets/planos/edifica_studio_460m_completo.png",
          descripcion: "Planillas comparativas referenciales desglosadas ítem por ítem en el simulador."
        }
      ]
    }
  ]
};
