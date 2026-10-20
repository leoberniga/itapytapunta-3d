// Project Data for Ita Pyta Punta Residential Project
// Location: Calle Guillermo Arias, Barrio Itá Pytã Punta, Asunción, Paraguay
// Geotechnical Project: 2956 (GEO-STAN S.R.L.)
// Client: Leonardo Gómez | Architecture: Arq. Gabriela Rolón | Structure: JIVESA S.A.
// Pricing benchmarks inspired by Osanna.app, JIVESA S.A. contract sheets, and CAPACO 2026

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

// Geotechnical Boreholes & Stratigraphy (GEO-STAN #2956)
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

// Architectural spaces
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
    id: "cochera_muro",
    name: "Estacionamiento y Muro Frontal",
    level: "Nivel Calle (+100.00m)",
    dimensions: "9.89m x 5.50m",
    area: 54.40,
    desc: "Cochera para 2 vehículos con muro de contención armado de piedra bruta y hormigón sobre calle Guillermo Arias.",
    highlights: ["Muro de contención de 30cm con armadura", "Relleno compactado con tierra roja", "Portón de acceso seguro"]
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

// Structural Foundation & Slab Registry
export const STRUCTURAL_ITEMS = [
  { id: "Z1_Z4", name: "Zapatas Frontales (Z1 - Z4)", type: "Zapata Aislada H°A°", desc: "Apoyadas sobre suelo SM firme a cota +98.50m", status: "Ejecutado 100%" },
  { id: "Z5_Z12", name: "Zapatas Intermedias (Z5 - Z12)", type: "Zapata Aislada H°A°", desc: "Zapatas centrales con pilares de 15x30 cm", status: "Ejecutado 100%" },
  { id: "Z13_Z20", name: "Zapatas de Fondo (Z13 - Z20)", type: "Zapata Aislada H°A°", desc: "Zapatas sobre fustes y cimiento ciclópeo hacia barranco", status: "Ejecutado 100%" },
  { id: "pilares", name: "Pilares P1 a P20", type: "Hormigón Armado", desc: "Secciones 12x30 y 15x30 cm dosificación 300 kg/m3", status: "Ejecutado 100%" },
  { id: "losa_fase1", name: "Primera Parte de la Losa", type: "Loza Rap + H°A°", desc: "Sector cargado de entrepiso y arranque", status: "Ejecutado (~50%)" },
  { id: "muro_cochera", name: "Muro Contención Estacionamiento", type: "Mampostería Armada 30cm", desc: "Muro de retención calle Guillermo Arias con vigas de fundación y drenaje", status: "Próxima Etapa Crítica" },
  { id: "losa_fase2", name: "Segunda Parte de la Losa", type: "Loza Rap + H°A°", desc: "Completamiento de la losa superior de planta baja / segundo piso", status: "Próxima Etapa Crítica" },
  { id: "techo", name: "Cubierta Termoacústica", type: "Chapa sándwich + estructura metálica", desc: "Techo escondido con desagües pluviales hacia el río", status: "Próxima Etapa Crítica" }
];

// Partidas Presupuestarias y Rubros (Metodología Osanna.app + JIVESA + CAPACO 2026)
export const PRESUPUESTO_PARTIDAS = [
  // Prioridad 1: Muro de Contención Estacionamiento y Cochera
  {
    id: "contencion_cochera",
    categoria: "Contención y Estacionamiento",
    item: "1.1 Muro de Contención Estacionamiento (Calle Guillermo Arias)",
    unidad: "m2",
    cantidad: 46.70,
    precioUnitarioGs: 273366,
    subtotalGs: 12767308,
    esencial: true,
    desc: "Mampostería común de 0.30m con refuerzo de varillas 2Ø6mm cada 0.80m para retener rampa de estacionamiento."
  },
  {
    id: "viga_fundacion_muro",
    categoria: "Contención y Estacionamiento",
    item: "1.2 Viga de Fundación y Encadenado para Muro",
    unidad: "ml",
    cantidad: 14.50,
    precioUnitarioGs: 415457,
    subtotalGs: 6024126,
    esencial: true,
    desc: "Viga armada H°A° para asiento y amarre del muro frontal contra la calle."
  },
  {
    id: "aislacion_relleno_cochera",
    categoria: "Contención y Estacionamiento",
    item: "1.3 Aislación Hidrófuga y Relleno Compactado de Cochera",
    unidad: "gl",
    cantidad: 1,
    precioUnitarioGs: 14500000,
    subtotalGs: 14500000,
    esencial: true,
    desc: "Revoque impermeable con aditivo cristalizante descal y relleno de tierra roja compactada para soporte de vehículos."
  },

  // Prioridad 2: Segunda Parte de la Losa (Planta Baja / Segundo Piso)
  {
    id: "losa_segunda_parte",
    categoria: "Estructura Losa",
    item: "2.1 Losa Alivianada (Loza Rap) y Capa de Compresión H°A°",
    unidad: "m2",
    cantidad: 54.00,
    precioUnitarioGs: 295000,
    subtotalGs: 15930000,
    esencial: true,
    desc: "Viguetas pretensadas de alta resistencia, bovedillas de hormigón/arcilla y malla electrosoldada Ø5mm."
  },
  {
    id: "hormigon_vigas_losa",
    categoria: "Estructura Losa",
    item: "2.2 Hormigón Elaborado H21 y Vigas Superiores de Encadenado",
    unidad: "m3",
    cantidad: 11.50,
    precioUnitarioGs: 2200000,
    subtotalGs: 25300000,
    esencial: true,
    desc: "Hormigón estructural cargado con bomba, armaduras de refuerzo y apuntalamiento completo."
  },

  // Prioridad 3: Techo y Cubierta Termoacústica
  {
    id: "cubierta_metalica",
    categoria: "Cubierta y Techo",
    item: "3.1 Techo Metálico Termoacústico (Isopanel / Poliuretano)",
    unidad: "m2",
    cantidad: 86.00,
    precioUnitarioGs: 379500,
    subtotalGs: 32637000,
    esencial: true,
    desc: "Chapa trapezoidal superior con aislación de poliuretano inyectado de 30mm y chapa inferior blanca vista."
  },
  {
    id: "estructura_metalica_techo",
    categoria: "Cubierta y Techo",
    item: "3.2 Estructura Portante Metálica (Tubos y Perfiles C)",
    unidad: "gl",
    cantidad: 1,
    precioUnitarioGs: 18500000,
    subtotalGs: 18500000,
    esencial: true,
    desc: "Perchas y cabriadas metálicas tratadas con fondo anticorrosivo, anclajes a vigas coronamiento."
  },
  {
    id: "desagues_canaletas",
    categoria: "Cubierta y Techo",
    item: "3.3 Canaletas de Chapa Galvanizada N° 26 y Bajadas Pluviales",
    unidad: "gl",
    cantidad: 1,
    precioUnitarioGs: 7800000,
    subtotalGs: 7800000,
    esencial: true,
    desc: "Canaleta perimetral de desagüe pluvial con bajadas de PVC 100mm canalizadas hacia el desagüe natural."
  },

  // Prioridad 4: Cerramiento Perimetral ("Cerrar Todo" / Shell & Core)
  {
    id: "mamposteria_exterior",
    categoria: "Albañilería y Cierre",
    item: "4.1 Mampostería Exterior Cerámica Hueca 15cm y Capas Aisladoras",
    unidad: "m2",
    cantidad: 145.00,
    precioUnitarioGs: 115000,
    subtotalGs: 16675000,
    esencial: true,
    desc: "Ladrillos cerámicos 12x18x25 con envarillados cada 5 hiladas y doble capa aisladora hidrófuga en base."
  },
  {
    id: "revoque_exterior_impermeable",
    categoria: "Albañilería y Cierre",
    item: "4.2 Revoque Exterior Hidrófugo Monocapa",
    unidad: "m2",
    cantidad: 145.00,
    precioUnitarioGs: 65000,
    subtotalGs: 9425000,
    esencial: true,
    desc: "Azotado impermeable con Ceresita + revoque fratasado para protección total de la intemperie."
  },
  {
    id: "puertas_seguridad_provisoria",
    categoria: "Albañilería y Cierre",
    item: "4.3 Cerramientos de Seguridad y Puertas de Acceso Provisorio",
    unidad: "gl",
    cantidad: 1,
    precioUnitarioGs: 8500000,
    subtotalGs: 8500000,
    esencial: true,
    desc: "Cierre hermético de vanos exteriores, candados y puertas metálicas de seguridad para custodia de obra."
  },

  // Partidas de Escenario Extendido (Inversión 370M a 440M Gs.)
  {
    id: "galeria_voladizo_deck",
    categoria: "Galería y Exterior",
    item: "5.1 Estructura Voladiza de Galería Panorámica al Río (3.5x9.55m)",
    unidad: "m2",
    cantidad: 33.42,
    precioUnitarioGs: 650000,
    subtotalGs: 21723000,
    esencial: false,
    desc: "Estructura metálica suspendida en voladizo, deck rústico de piso y anclajes estructurales."
  },
  {
    id: "parrilla_ducto",
    categoria: "Galería y Exterior",
    item: "5.2 Parrilla Tradicional de Ladrillo Refractario y Campana",
    unidad: "un",
    cantidad: 1,
    precioUnitarioGs: 7500000,
    subtotalGs: 7500000,
    esencial: false,
    desc: "Parrilla con mesada de granito, bacha de acero inoxidable y ducto de salida a 4 vientos."
  },
  {
    id: "vidrios_templados_galeria",
    categoria: "Aberturas y Terminaciones",
    item: "6.1 Ventanales Corredizos de Vidrio Templado (Blindex) al Río",
    unidad: "m2",
    cantidad: 24.00,
    precioUnitarioGs: 750000,
    subtotalGs: 18000000,
    esencial: false,
    desc: "Línea europea / Blindex 8mm templado con perfiles de aluminio negro y rieles empotrados."
  },
  {
    id: "instalaciones_electricas_embutidas",
    categoria: "Instalaciones",
    item: "7.1 Red Eléctrica Embutida (Cañerías, Cajas y Tablero Principal)",
    unidad: "gl",
    cantidad: 1,
    precioUnitarioGs: 16500000,
    subtotalGs: 16500000,
    esencial: false,
    desc: "Caños corrugados reforzados, cajas octogonales/rectangulares, circuitos de tomas e iluminación y puesta a tierra."
  },
  {
    id: "instalaciones_sanitarias_desagues",
    categoria: "Instalaciones",
    item: "7.2 Instalación Hidráulica (PPR termofusión) y Desagüe Cloacal",
    unidad: "gl",
    cantidad: 1,
    precioUnitarioGs: 14800000,
    subtotalGs: 14800000,
    esencial: false,
    desc: "Cañerías tigre PVC cloacal 100/50/40mm, cámaras de inspección y distribución de agua fría/caliente."
  },
  {
    id: "pisos_porcelanato",
    categoria: "Aberturas y Terminaciones",
    item: "8.1 Contrapiso y Piso Porcelanato 60x60 en Planta Baja",
    unidad: "m2",
    cantidad: 80.00,
    precioUnitarioGs: 180000,
    subtotalGs: 14400000,
    esencial: false,
    desc: "Contrapiso de cascote 8cm, carpeta niveladora y colocación de porcelanato rectificado con pastina."
  },
  {
    id: "porton_cochera_automatizado",
    categoria: "Contención y Estacionamiento",
    item: "9.1 Portón Basculante Automatizado de Cochera",
    unidad: "un",
    cantidad: 1,
    precioUnitarioGs: 13500000,
    subtotalGs: 13500000,
    esencial: false,
    desc: "Estructura metálica con chapa ciega/microperforada, contrapesos, motor de 1/2 HP y 2 controles remotos."
  },
  {
    id: "bano_suite_sanitarios",
    categoria: "Aberturas y Terminaciones",
    item: "10.1 Artefactos Sanitarios, Griferías y Termocalefón 80L",
    unidad: "gl",
    cantidad: 1,
    precioUnitarioGs: 9800000,
    subtotalGs: 9800000,
    esencial: false,
    desc: "Inodoro con mochila, bidet, lavatorio con mueble flotante, griferías FV y termocalefón instalado."
  },

  // Plan Hidrófugo y Aislaciones (Crucial para Terreno en Barranco y Río)
  {
    id: "hidro_muro_vertical",
    categoria: "Plan Hidrófugo",
    item: "11.1 Aislación Vertical Muro Contención (Ceresita + Pintura Asfáltica)",
    unidad: "m2",
    cantidad: 46.70,
    precioUnitarioGs: 48000,
    subtotalGs: 2241600,
    esencial: true,
    desc: "Revoque hidrófugo con hidrófugo inorgánico 1:3 y doble mano de emulsión asfáltica al solvente en trasdós de muro."
  },
  {
    id: "hidro_drenaje_frances",
    categoria: "Plan Hidrófugo",
    item: "11.2 Drenaje Francés Perimetral (Tubo Ø100 Ranurado + Geotextil Bidim)",
    unidad: "ml",
    cantidad: 18.00,
    precioUnitarioGs: 165000,
    subtotalGs: 2970000,
    esencial: true,
    desc: "Tubo corrugado ranurado Ø100mm envuelto en grava 1ra/2da y manta geotextil no tejida para aliviar empuje hidrostático hacia el barranco."
  },
  {
    id: "hidro_capa_horizontal",
    categoria: "Plan Hidrófugo",
    item: "11.3 Capa Aisladora Horizontal Doble bajo Mampostería",
    unidad: "ml",
    cantidad: 28.50,
    precioUnitarioGs: 55000,
    subtotalGs: 1567500,
    esencial: true,
    desc: "Doble cajón hidrófugo continuo con pintura asfáltica para evitar humedad de cimientos por capilaridad."
  },
  {
    id: "hidro_membrana_terraza",
    categoria: "Plan Hidrófugo",
    item: "11.4 Impermeabilización Losa Terraza al Río (Membrana 4mm + Babetas)",
    unidad: "m2",
    cantidad: 42.00,
    precioUnitarioGs: 110000,
    subtotalGs: 4620000,
    esencial: true,
    desc: "Membrana asfáltica de 4mm con alma de poliéster adherida con soplete, babetas embutidas y sellador poliuretánico."
  },
  {
    id: "hidro_barrera_vapor",
    categoria: "Plan Hidrófugo",
    item: "11.5 Barrera de Vapor con Polietileno 200 Micrones bajo Contrapisos",
    unidad: "m2",
    cantidad: 85.00,
    precioUnitarioGs: 12500,
    subtotalGs: 1062500,
    esencial: true,
    desc: "Film continuo con solapes de 20cm termosellados para impedir ascensión de humedad del suelo arenoso."
  },

  // Señales Débiles, Telecomunicaciones y Domótica
  {
    id: "debil_cableado_cat6",
    categoria: "Señales Débiles y Redes",
    item: "12.1 Cableado Estructurado UTP Cat6 y Puntos de Red / Smart TV",
    unidad: "bocas",
    cantidad: 8,
    precioUnitarioGs: 185000,
    subtotalGs: 1480000,
    esencial: true,
    desc: "Ductos conduit ignífugos independientes de tensión, cable UTP 100% cobre Cat6 y tomas RJ45 blindadas."
  },
  {
    id: "debil_cctv_ip",
    categoria: "Señales Débiles y Redes",
    item: "12.2 Sistema CCTV 6 Cámaras IP PoE 4MP + NVR 2TB",
    unidad: "kit",
    cantidad: 1,
    precioUnitarioGs: 5800000,
    subtotalGs: 5800000,
    esencial: false,
    desc: "Cámaras con infrarrojo nocturno y detección de intrusión cubriendo calle Guillermo Arias, cochera y barranco al río."
  },
  {
    id: "debil_portero_visor",
    categoria: "Señales Débiles y Redes",
    item: "12.3 Portero Visor IP Gran Angular y Apertura Remota Smartphone",
    unidad: "kit",
    cantidad: 1,
    precioUnitarioGs: 2450000,
    subtotalGs: 2450000,
    esencial: true,
    desc: "Frente de calle antivandálico con cámara HD, audio bidireccional y módulo de relé para portón peatonal y vehicular."
  },
  {
    id: "debil_wifi_mesh",
    categoria: "Señales Débiles y Redes",
    item: "12.4 Red Wi-Fi Mesh de Cobertura Total (Interior y Galería al Río)",
    unidad: "kit",
    cantidad: 1,
    precioUnitarioGs: 1850000,
    subtotalGs: 1850000,
    esencial: false,
    desc: "3 puntos de acceso Gigabit Wi-Fi 6 para streaming 4K y videollamadas fluidas en cualquier sector de la casa."
  },
  {
    id: "debil_alarma_barreras",
    categoria: "Señales Débiles y Redes",
    item: "12.5 Alarma Perimetral con 4 Barreras Infrarrojas Exteriores",
    unidad: "kit",
    cantidad: 1,
    precioUnitarioGs: 3200000,
    subtotalGs: 3200000,
    esencial: false,
    desc: "Sensores fotoeléctricos perimetrales en frente y sobre el barranco hacia el río con notificación push celular."
  },
  {
    id: "debil_domotica_luces",
    categoria: "Señales Débiles y Redes",
    item: "12.6 Domótica de Iluminación Exterior y Escenas Atardecer",
    unidad: "un",
    cantidad: 6,
    precioUnitarioGs: 320000,
    subtotalGs: 1920000,
    esencial: false,
    desc: "Microcontroladores inteligentes para encendido automático al atardecer en terraza, escalera y fachada."
  }
];

// Metadatos Urbanos y Satelitales (Google Maps / OSM / Street View)
export const CONTEXTO_URBANO_SATELITAL = {
  direccion: "Calle Guillermo Arias e/ Avda. Carlos Antonio López y Calle Piravevé",
  barrio: "Itá Pytã Punta",
  ciudad: "Asunción, Paraguay",
  coordenadasDecimales: { lat: -25.279612, lng: -57.663548 },
  dimensionesLote: "9.89 metros de frente x 31.00 metros de fondo (306.59 m²)",
  streetViewUrl: "https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=-25.279612,-57.663548&heading=310&pitch=5",
  mapsUrl: "https://www.google.com/maps/place/25%C2%B016'46.6%22S+57%C2%B039'48.8%22W/@-25.279612,-57.663548,19z/data=!3m1!1e3",
  osmUrl: "https://www.openstreetmap.org/#map=19/-25.27961/-57.66355",
  caracteristicasEntorno: [
    "Frente sobre Calle Guillermo Arias a cota de referencia +100.00m con portón vehicular y peatonal.",
    "Desnivel topográfico pronunciado de -3.64m desde el frente (+100.00m) hasta el borde posterior (+96.20m).",
    "Visual directa sin obstrucciones hacia el Río Paraguay con orientación Noroeste (atardeceres dorados).",
    "Suelo de excelente capacidad portante: arenisca firme a partir de los 4.5m - 5.0m (GEO-STAN Nº 2956)."
  ]
};


// Escenarios de Inversión (300M a 440M Guaraníes)
export const ESCENARIOS_INVERSION = {
  escenario300: {
    id: "escenario300",
    nombre: "Escenario 1: Cierre Estructural y Techo",
    montoObjetivoGs: 300000000,
    montoEstimadoGs: 298500000,
    costoM2ConstruidoGs: 1850000,
    semaforo: "ok",
    objetivoPrincipal: "Levantar la 2da losa, muro de estacionamiento, techo termoacústico y cerrar todo el perímetro para proteger la obra.",
    itemsIncluidos: [
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
      "instalaciones_sanitarias_desagues",
      "hidro_muro_vertical",
      "hidro_drenaje_frances",
      "hidro_capa_horizontal",
      "hidro_barrera_vapor",
      "debil_cableado_cat6",
      "debil_portero_visor"
    ],
    ventajas: [
      "Obra 100% techada e impermeabilizada contra tormentas",
      "Muro de contención de cochera terminado para acceso de vehículos",
      "Plan hidrófugo completo: drenaje francés y doble capa aisladora",
      "Señales débiles esenciales: cableado Cat6 y portero visor IP instalados",
      "Permite pausar la obra con total seguridad física y patrimonial"
    ]
  },
  escenario370: {
    id: "escenario370",
    nombre: "Escenario 2: Obra Gris + Galería al Río + Redes y CCTV",
    montoObjetivoGs: 370000000,
    montoEstimadoGs: 367200000,
    costoM2ConstruidoGs: 2280000,
    semaforo: "ok",
    objetivoPrincipal: "Todo el Escenario 1 + estructura de la Galería Panorámica al Río + redes embutidas + impermeabilización de terraza + CCTV 6 cámaras + Wi-Fi Mesh + portón cochera.",
    itemsIncluidos: [
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
      "instalaciones_sanitarias_desagues",
      "hidro_muro_vertical",
      "hidro_drenaje_frances",
      "hidro_capa_horizontal",
      "hidro_barrera_vapor",
      "hidro_membrana_terraza",
      "debil_cableado_cat6",
      "debil_cctv_ip",
      "debil_portero_visor",
      "debil_wifi_mesh",
      "galeria_voladizo_deck",
      "parrilla_ducto",
      "instalaciones_electricas_embutidas",
      "porton_cochera_automatizado"
    ],
    ventajas: [
      "Disfrute inmediato de la Galería Panorámica y Parrilla hacia el Río Paraguay",
      "Terraza impermeabilizada con membrana poliéster 4mm",
      "Seguridad total con CCTV 6 cámaras IP PoE y red Wi-Fi Mesh",
      "Cochera totalmente cerrada con portón automatizado"
    ]
  },
  escenario440: {
    id: "escenario440",
    nombre: "Escenario 3: Envolvente Completa, Domótica y Terminaciones Fase 1",
    montoObjetivoGs: 440000000,
    montoEstimadoGs: 438500000,
    costoM2ConstruidoGs: 2720000,
    semaforo: "ok",
    objetivoPrincipal: "Residencia en Planta Baja completamente habitable y cerrada: ventanales Blindex al río, pisos porcelanato, baño suite operativo, alarma perimetral y domótica de luces.",
    itemsIncluidos: [
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
      "instalaciones_sanitarias_desagues",
      "hidro_muro_vertical",
      "hidro_drenaje_frances",
      "hidro_capa_horizontal",
      "hidro_barrera_vapor",
      "hidro_membrana_terraza",
      "debil_cableado_cat6",
      "debil_cctv_ip",
      "debil_portero_visor",
      "debil_wifi_mesh",
      "debil_alarma_barreras",
      "debil_domotica_luces",
      "galeria_voladizo_deck",
      "parrilla_ducto",
      "instalaciones_electricas_embutidas",
      "porton_cochera_automatizado",
      "vidrios_templados_galeria",
      "pisos_porcelanato",
      "bano_suite_sanitarios"
    ],
    ventajas: [
      "Vivienda completamente cerrada con ventanales de vidrio templado",
      "Plan hidrófugo integral y estanqueidad garantizada contra el río y lluvias",
      "Domótica con encendido automático de luces al atardecer y alarma perimetral",
      "Suite principal y baño 100% utilizables con pisos de porcelanato"
    ]
  }
};

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
    title: "Pilares y Primera Losa",
    category: "Estructura H°A°",
    desc: "Pilares hormigonados y sector de losa ejecutado sobre el cual se continuará la siguiente fase."
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
  parking: {
    name: "Muro de Estacionamiento Frontal",
    pos: [-8, 2, -6],
    target: [0, 0, -2],
    desc: "Inspección del muro de contención de 30cm para el estacionamiento."
  },
  gallery: {
    name: "Galería Panorámica al Río",
    pos: [0, 4.5, 12],
    target: [0, 3, 35],
    desc: "Vista directa hacia el río Paraguay desde el deck voladizo."
  },
  losa2: {
    name: "Segunda Parte de la Losa y Techo",
    pos: [14, 12, 10],
    target: [0, 3, 8],
    desc: "Detalle de la losa superior y cubierta metálica termoacústica."
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

// Renders 3D Ilustrados Fotorrealistas de Alta Definición
export const REALISTIC_RENDERS = [
  {
    id: "rio_atardecer",
    title: "Vista Panorámica al Río Paraguay (Atardecer)",
    subtitle: "Galería Voladiza y Living Social",
    category: "Vista al Río",
    imgUrl: "/assets/render_rio_atardecer.jpg",
    desc: "Ilustración fotorrealista del remate de la obra hacia el Río Paraguay: ventanales corredizos piso-techo, terraza voladiza con deck de madera, barandas de cristal y cubierta metálica termoacústica.",
    stage: "Proyecto Terminado / Horizonte de Inversión",
    specs: {
      orientacion: "Noroeste (Atardecer)",
      materialidad: "Hormigón Visto Encofrado de Tabla, Vidrio Templado y Madera Nativa",
      espacio: "Galería de 33.4 m² + Living de 24 m²"
    }
  },
  {
    id: "fachada_calle",
    title: "Acceso Calle Guillermo Arias y Cochera",
    subtitle: "Muro de Contención Frontal y Portón Vehicular",
    category: "Fachada Urbana",
    imgUrl: "/assets/render_fachada_calle.jpg",
    desc: "Ilustración de la etapa prioritaria: Muro de contención para nivelar el estacionamiento sobre la calle Guillermo Arias, portón vehicular automatizado grafito, escalera peatonal y volumen superior protegido.",
    stage: "Etapa Inmediata a Ejecutar",
    specs: {
      cotaAcceso: "+100.00 m (Nivel Calle)",
      contencion: "Muro ciclópeo de piedra y H°A° (46.7 m²)",
      acceso: "2 Vehículos + Acceso Peatonal Independiente"
    }
  },
  {
    id: "corte_obra",
    title: "Corte 3D Estructural y Etapas de Construcción",
    subtitle: "Fundaciones Existentes + Nueva Losa + Techo Termoacústico",
    category: "Corte Pedagógico",
    imgUrl: "/assets/render_corte_obra.jpg",
    desc: "Visualización técnica amigable para no arquitectos: muestra cómo las fundaciones descansan firmemente sobre el estrato de arenisca (GEO-STAN #2956), los pilares existentes, la nueva losa a hormigonar y el techo termoacústico que cierra la estructura.",
    stage: "Esquema Constructivo de Inversión",
    specs: {
      suelo: "Arenisca Cementada (Nspt > 50 a -5.0m)",
      hormigon: "H°A° Fck 200 kg/cm² (Pilares P1..P20 y Zapatas)",
      cubierta: "Isopanel Termoacústico de 50mm con Aislación PIR"
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

