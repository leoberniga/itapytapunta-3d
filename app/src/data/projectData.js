// Project Data for Ita Pyta Punta Residential Project
// Location: Calle Guillermo Arias, Barrio Itá Pytã Punta, Asunción, Paraguay
// Geotechnical Project: 2956 (GEO-STAN S.R.L.)
// Client: Leonardo Gómez | Architecture: Arq. Gabriela Rolón | Structure: JIVESA S.A.

export const PROJECT_METADATA = {
  title: "Residencia Itá Pytã Punta",
  subtitle: "Visualizador BIM / CAD 3D de Proyecto Arquitectónico y Geotécnico",
  location: "Calle Guillermo Arias, B° Itá Pytã Punta, Asunción, Paraguay",
  coordinates: {
    lat: -25.2796,
    lng: -57.6635,
    utmZone: "21S",
    datum: "WGS84 / SIRGAS"
  },
  client: "Leonardo Gómez",
  architect: "Arq. Gabriela Rolón",
  engineering: "JIVESA S.A. Ingeniería",
  soilSurvey: "GEO-STAN S.R.L. (Estudio Geotécnico Nº 2956)",
  lotDimensions: {
    frontWidth: 9.89, // meters along Guillermo Arias
    depth: 31.00,     // meters from street to rear slope
    totalArea: 306.59 // m2
  },
  benchmarks: {
    RN: { name: "RN (Referencia Nivel)", cota: 100.00, x: 433024, y: 7203554, desc: "Cota de calle Guillermo Arias" },
    P1: { name: "Sondeo P1 (Frente)", cota: 99.84, x: 433018, y: 7203560, desc: "Jardín frontal / Acceso (+99.84 m)" },
    P2: { name: "Sondeo P2 (Medio)", cota: 97.15, x: 433020, y: 7203579, desc: "Sector central / Losa (+97.15 m, desnivel -2.69 m)" },
    P3: { name: "Sondeo P3 (Fondo)", cota: 96.20, x: 433017, y: 7203591, desc: "Fondo del terreno / Barranco (+96.20 m, desnivel -3.64 m)" }
  }
};

export const GEOTECHNICAL_DATA = {
  summary: "Macizo de arenisca con estrato superior de arena limosa. Terreno sumamente estable y firme con rechazo SPT > 50 golpes a partir de los 5.0m de profundidad. No se detectó nivel freático hasta los 10.05m.",
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

export const ARCHITECTURAL_ROOMS = [
  {
    id: "galeria",
    name: "Galería Panorámica y Parrilla",
    level: "Planta Baja (+100.00m)",
    dimensions: "3.50m x 9.55m",
    area: 33.42,
    desc: "Balcón y galería voladiza con vista directa al Río Paraguay, parrilla integrada, mesada de granito y deck de madera.",
    highlights: ["Orientación Noroeste hacia el río", "Parrilla y bacha", "Conexión directa con Estar/Comedor"]
  },
  {
    id: "estar_comedor",
    name: "Estar / Living Room",
    level: "Planta Baja (+100.00m)",
    dimensions: "4.80m x 5.00m",
    area: 24.00,
    desc: "Área social principal con grandes ventanales corredizos vidriados de piso a techo conectados a la galería panorámica.",
    highlights: ["Iluminación natural cruzada", "Techo con losa vista o yeso", "Piso porcelanato 60x60"]
  },
  {
    id: "cocina",
    name: "Cocina y Desayunador",
    level: "Planta Baja (+100.00m)",
    dimensions: "3.20m x 3.80m",
    area: 12.16,
    desc: "Cocina moderna con isla central / desayunador, muebles altos y bajos, mesada de cuarzo o granito.",
    highlights: ["Isla central", "Ventilación al patio", "Conexión fluida con comedor"]
  },
  {
    id: "suite",
    name: "Dormitorio Principal en Suite",
    level: "Planta Baja (+100.00m)",
    dimensions: "3.45m x 4.20m",
    area: 14.49,
    desc: "Habitación master con vestidor privado y baño ensuite.",
    highlights: ["Baño privado 1.25m x 2.22m", "Vestidor independiente", "Privacidad acústica"]
  },
  {
    id: "bano_social",
    name: "Baño Social",
    level: "Planta Baja (+100.00m)",
    dimensions: "1.25m x 1.80m",
    area: 2.25,
    desc: "Sanitario de cortesía ubicado junto al hall de acceso.",
    highlights: ["Fácil acceso desde el estar", "Ventilación natural"]
  },
  {
    id: "subsuelo_depto",
    name: "Departamento Autónomo Subsuelo",
    level: "Nivel Inferior (+97.00m)",
    dimensions: "6.50m x 8.00m",
    area: 52.00,
    desc: "Unidad independiente aprovechando la pendiente natural del terreno. Dormitorio, estar/comedor, kitchenette, baño y lavadero.",
    highlights: ["Acceso independiente por escalera lateral", "Patio privado inferior", "Ideal para renta o visitas"]
  }
];

export const STRUCTURAL_ITEMS = [
  { id: "Z1_Z4", name: "Zapatas Frontales (Z1 - Z4)", type: "Zapata Aislada H°A°", desc: "Apoyadas sobre suelo SM firme a cota +98.50m", status: "Ejecutado 100%" },
  { id: "Z5_Z12", name: "Zapatas Intermedias (Z5 - Z12)", type: "Zapata Aislada H°A°", desc: "Zapatas centrales con pilares de 15x30 cm", status: "Ejecutado 100%" },
  { id: "Z13_Z20", name: "Zapatas de Fondo (Z13 - Z20)", type: "Zapata Aislada H°A°", desc: "Zapatas sobre fustes y cimiento ciclópeo hacia barranco", status: "Ejecutado 100%" },
  { id: "pilares", name: "Pilares P1 a P20", type: "Hormigón Armado", desc: "Secciones 12x30 y 15x30 cm dosificación 300 kg/m3", status: "Ejecutado 100%" },
  { id: "vigas", name: "Vigas de Encadenado", type: "Vigas 15x30 cm", desc: "Viga inferior y viga superior perimetral e intermedia", status: "Planificado" },
  { id: "losa", name: "Losa Alivianada Loza Rap", type: "Viguetas + bovedillas", desc: "38 m2 de cubierta / entrepiso con capa de compresión de 5cm", status: "Planificado" }
];

export const CURATED_PHOTOS = [
  {
    url: "https://lh3.googleusercontent.com/pw/AP1GczOjESKh4AsBhs0wVjFREcNrkjrEFqy6dADizyzQz-FrdSCASGm3b_OfFWf0EIyn2XZ7LyqSgA2cEZA1gbT-GOo5Fvc5CHSt8R9m642iZqYwQ2vZrVVH",
    title: "Vista Panorámica del Terreno",
    category: "Terreno e Implantación",
    desc: "Vista hacia el Río Paraguay desde el sector alto del lote en Itá Pytã Punta."
  },
  {
    url: "https://lh3.googleusercontent.com/pw/AP1GczOOxN4VFTddOduR_4fuyJNy5W-5_dNURUO-QhfqWFeTRTnI_X3KgzBH0lEY3XDcAK6mQtKvLdHxa7qXyq1KEIPkB1Hdx0uHQG-ubiPd1fnL4rkmGB-e",
    title: "Replanteo y Perforaciones",
    category: "Geotecnia",
    desc: "Equipo de sondeo SPT y replanteo de niveles de GEO-STAN S.R.L."
  },
  {
    url: "https://lh3.googleusercontent.com/pw/AP1GczNFUKh9qjFBTYl0Atk7bib1KCNilDpFJu2g7bBpnCMmJSaehctrVyuurkmZhAWfTfeEhWSrLLrTRzYtqMNui-JqWJWm3Zs75mmMSgYGbSonujH-Y0Fs",
    title: "Movimiento de Suelo y Nivelación",
    category: "Obra",
    desc: "Cortes del desnivel y preparación del plano para fundaciones."
  },
  {
    url: "https://lh3.googleusercontent.com/pw/AP1GczND72HRziSrT_Qv-aIenOMZRMQlOJ4c4RKSfzLJ-zJktlYquC-HxDdePL9t7zqettZdRkIgQG-kF6RUgfbwm0P_l1pTK0oDMOCGp5xnoW2WpjXKvU4c",
    title: "Armaduras y Carga de Zapatas",
    category: "Estructura H°A°",
    desc: "Armado de parrillas de hierro para zapatas y arranque de pilares P13..P20."
  },
  {
    url: "https://lh3.googleusercontent.com/pw/AP1GczOULmpfeKVAk8S-TLHx8QPJ80qQzdJtpXtk7NXe1ivL_hve3LgazPQqeX_xWTlULoZKTf1W6A_VVLRzjR5EP_2fnlhr9A91lahlHr75pVXiLwr_DdLW",
    title: "Muros de Contención de Piedra",
    category: "Contención",
    desc: "Ejecución de muros ciclópeos de piedra bruta para contención del desnivel."
  },
  {
    url: "https://lh3.googleusercontent.com/pw/AP1GczM0ScwV4uEy8JWWyjzzkaxiTHnrIAfaSeUUfgffLu2qGGxdjDSRpHP4FZ4u7dh7TKbE_zP4kzvZSX4Mm45tA4d3dZhSPsSZ6IUk5usqvgdd9tyzq-qP",
    title: "Pilares Hormigonados",
    category: "Estructura H°A°",
    desc: "Fustes y pilares desencofrados listos para vigas de encadenado."
  },
  {
    url: "https://lh3.googleusercontent.com/pw/AP1GczNVtTVaDBbftL8FWqtovhlJIQUkM_uYGzZTF4cdV0RwEKaaACaAeLg4_gNrgALnkKX6gkE7Els47gWaKJcvDh-mqG5sk3xddEpvmhWDW_uWrLyiGQPH",
    title: "Atardecer hacia el Río",
    category: "Paisaje y Vista",
    desc: "Puesta de sol sobre el Río Paraguay desde la futura galería panorámica."
  },
  {
    url: "https://lh3.googleusercontent.com/pw/AP1GczOQDAjlOkyfgZFcMbru1LUMTxIkpBApkmaSs0223lbBVbECPD7Xood-ya44oxhG808Z4knf4FNmFFY29MkiKwm7cl08fbU07xjDG1MgnpT0LN1uM2Sn",
    title: "Perspectiva General de Obra",
    category: "Obra",
    desc: "Avance estructural y visualización del entorno barrial de Itá Pytã Punta."
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
    desc: "Aproximación peatonal y vehicular desde la calle."
  },
  gallery: {
    name: "Galería Panorámica al Río",
    pos: [0, 4.5, 12],
    target: [0, 3, 35],
    desc: "Vista directa hacia el río Paraguay desde el deck voladizo."
  },
  soil: {
    name: "Corte Geotécnico",
    pos: [-22, 1, 10],
    target: [0, -1, 10],
    desc: "Perfil transversal mostrando los estratos de suelo y sondeos S1, S2, S3."
  },
  structure: {
    name: "Radiografía Estructural H°A°",
    pos: [12, 10, 14],
    target: [0, 0, 8],
    desc: "Aislamiento de zapatas Z1..Z20 y pilares ejecutados."
  },
  walk: {
    name: "Recorrido en Primera Persona",
    pos: [0, 2.5, -4],
    target: [0, 2.5, 8],
    desc: "Paseo a escala humana por el interior de la residencia."
  }
};
