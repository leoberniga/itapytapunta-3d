// Módulo Especializado MEP, Ingeniería Hidráulica/Pluvial/Hidrófuga, Señales Débiles, CCTV PoE y Domótica
// Ubicación: Calle Guillermo Arias, Barrio Itá Pytã Punta, Asunción, Paraguay
// Basado en Plano Oficial "PLANO DE SEÑALES DEBILES" (Pág. 3 de IE-IS-IH-ISD-IAA), Estudio GEO-STAN #2956 y Normas Paraguayas (INTN / MOPC / ANDE / ESSAP)
//
// ESQUEMA REAL DE NIVELES (COTAS Y ALTURAS 3D):
// - Subsuelo (Nivel Inferior +97.00m -> Y = -3.00m) + 1ra Losa a Nivel Calle (Planta Baja +100.00m -> Y = 0.00m): YA CONSTRUIDOS.
// - Nueva Etapa: Levantar la Losa del Segundo Piso (Planta Alta +103.00m -> Y = +3.00m) y el Techo Termoacústico arriba del Segundo Piso (+105.85m -> Y = +5.85m).

import { DUCTOS_PASES_ENCHUFES_DATOS } from './data/projectData.js';

export const PLUVIAL_HYDRO_DATA = {
  intensidadDisenoMmH: 165, // Lluvias torrenciales subtropicales de Asunción (>150 mm/h pico de 5-15 min)
  areaCaptacionTechoM2: 86.0,
  areaCaptacionGaleriaYPatioM2: 78.0,
  caudalPicoTechoLs: 3.94, // Q = (C * I * A) / 3600 -> (0.95 * 165 * 86) / 3600 = 3.74 - 3.94 L/s
  caudalTotalLoteLs: 8.65, // Caudal combinado techo + cochera + escorrentía controlada
  pendienteTerrenoTotalM: -3.64, // De Cota +100.00m (Calle Guillermo Arias) a Cota +96.20m (Barranco S3)
  nivelesEstructurales: {
    subsueloExistente: "Cota +97.00m (Y = -3.00m) — Construido",
    losaPlantaBajaExistente: "Cota +100.00m (Y = 0.00m, Nivel Calle) — Construido",
    nuevaLosaSegundoPiso: "Cota +103.00m (Y = +3.00m, Planta Alta) — A Levantar en esta Etapa",
    nuevoTechoGeneral: "Cota +105.85m (Y = +5.85m, Arriba del 2do Piso) — A Colocar en esta Etapa"
  },
  especificaciones: {
    canaletas: "Sistema de canaletas ocultas de chapa galvanizada N°24/26 plegada (sección 18x15cm) en el frente del Techo General (Eje G z = 2.95m, Y = +5.55m), recibiendo la pendiente del techo hacia adelante para desaguar directamente hacia la Calle Tte. Guillermo Arias.",
    bajadas: "4 Bajadas pluviales verticales de PVC reforzado Junta Elástica Ø100mm adosadas a los pilares reales del edificio (2 frontales principales en Eje G z = 2.95m y 2 auxiliares de terraza en Eje B z = 9.94m), conduciendo el 100% del agua pluvial hacia el frente municipal.",
    drenajeFrancesCochera: "Drenaje Francés Superior (Trasdós Muro Cochera): Tubo PVC cribado/ranurado Ø100mm con pendiente hacia los colectores frontales, envuelto en piedra triturada 4ta y manta geotextil Bidim RT-16.",
    drenajeFrancesSubsuelo: "Drenaje Francés y Bombeo Pluvial de Subsuelo hacia el Frente: Intercepta el agua subsuperficial en Eje E/G y la conduce hacia las cámaras pluviales frontales de salida a Calle Tte. Guillermo Arias.",
    barbacanas: "Barbacanas de alivio hidrostático en PVC Ø50mm cada 1.50m con filtro geotextil en el muro frontal.",
    camaras: "Cámaras de inspección y desarenadoras pluviales (40x40x50cm) ubicadas en los retiros laterales conduciendo el caudal hacia el cordón cuneta de la Calle Tte. Guillermo Arias (z = -5.65m).",
    disipadorBarranco: "Separación Total Pluvial vs. Cloacal: El 100% del agua de lluvia desagua por delante hacia la calle, mientras que en el patio trasero (nivelado a Y = -2.34m) trabajan exclusivamente la Cámara Séptica Bicameral y el Pozo Ciego Absorbente autónomos, evitando usar la precaria red vecinal."
  },
  elementos3D: [
    {
      id: "canaleta_frontal",
      type: "pluvial_canaleta",
      name: "Canaleta Colectora Principal Frontal Chapa Galvanizada N°24 (Eje G z = 2.95m, Y = +5.55m)",
      dimensions: "9.74m x 0.18m x 0.15m (Pendiente hacia bajadas frontales)",
      cota: "+105.55 m (Y = +5.55m)",
      costo: "Incluido en Partida 3.3 (7.800.000 Gs.)",
      status: "Desagüe Pluvial Frontal hacia la Calle",
      desc: "El techo termoacústico Isopanel inclina hacia adelante (Eje G z = 2.95m), descargando toda el agua de lluvia hacia los colectores frontales que salen a la Calle Tte. Guillermo Arias."
    },
    {
      id: "drenaje_frances_cochera",
      type: "hidrofugo_drenaje",
      name: "Drenaje Francés Trasdós Muro Cochera (z = -3.80m)",
      dimensions: "Long. 9.50m • Tubo Cribado Ø100mm + Piedra 4ta + Geotextil Bidim",
      cota: "+98.75 m (Y = -1.25m)",
      costo: "2.970.000 Gs. (Partida 11.2)",
      status: "Obligatorio antes de rellenar cochera",
      desc: "Elimina el empuje hidrostático sobre el muro frontal de contención y desagua directamente hacia el cordón cuneta de la calle."
    },
    {
      id: "drenaje_frances_subsuelo",
      type: "hidrofugo_drenaje",
      name: "Drenaje Francés Trasdós Muro Subsuelo (Eje G z = 2.85m)",
      dimensions: "Long. 8.50m • Tubo Cribado Ø100mm + Grava + Geotextil Bidim",
      cota: "+97.66 m (Y = -2.34m)",
      costo: "2.241.600 Gs. (Aislación Vertical Partida 11.1)",
      status: "Protección Hidrófuga Subsuelo",
      desc: "Intercepta la humedad del terreno frontal bajo la cámara de oxigenación enrejada y la deriva hacia el colector frontal."
    },
    {
      id: "salida_pluvial_calle",
      type: "pluvial_disipador",
      name: "Bocas de Desagüe Pluvial a Cordón Cuneta (Calle Tte. Guillermo Arias • z = -5.65m)",
      dimensions: "Doble Salida PVC Pesado Ø100mm en Vereda Municipal",
      cota: "+99.82 m (Nivel Calzada Calle Tte. Guillermo Arias)",
      status: "Evacuación Pluvial 100% por Delante",
      desc: "Entrega el caudal pluvial del techo y cochera directamente a la calzada de la Calle Tte. Guillermo Arias, dejando el patio trasero exclusivamente para el sistema autónomo de Cámara Séptica y Pozo Ciego."
    }
  ]
};

export const WEAK_SIGNALS_DATA = {
  normativaReferencia: "Plano Ejecutivo 'PLANO DE SEÑALES DEBILES' (Lámina 3/5 IE-IS-IH-ISD-IAA) + Estándar ANSI/TIA-568-C.2 Cat6 + Norma ANDE BT.",
  rackPrincipal: {
    id: "rack_onu_nvr",
    type: "telecom_rack",
    name: "Gabinete Principal de Telecomunicaciones (Rack 6U Pared sobre Losa Maciza L4)",
    ubicacion: "Pleno Técnico Eje F sobre Losa Maciza L4 (x = +0.25m, Y = +1.55m, z = 4.78m)",
    pos3D: [0.25, 1.55, 4.78],
    equipamiento: [
      "ONU Fibra Óptica Gigabit (acometida subterránea desde poste calle Guillermo Arias)",
      "Switch Gigabit PoE+ de 8 puertos (802.3af/at, 120W) para alimentar las 6 cámaras IP y los 3 nodos Wi-Fi (Subsuelo, PB y 2do Piso)",
      "Grabador NVR IP 8 Canales 4K con disco rígido WD Purple 2TB (grabación continua y eventos IA)",
      "UPS Interactivo 1000VA para autonomía de 45 min de internet y cámaras ante cortes de ANDE",
      "Patch Panel 12 puertos Cat6 + Organizador horizontal"
    ],
    costo: "Incluido en Partidas 12.1 y 12.2",
    status: "Núcleo Digital de los 3 Niveles"
  },
  camarasCCTV: [
    {
      id: "cam_1_oriente",
      numero: 1,
      name: "Cámara IP PoE #1 — Calle Guillermo Arias (Vista Acceso Peatonal +X)",
      ubicacion: "Pilar Frontal Este (Nivel Calle z = -4.00m)",
      especificacion: "Bullet IP PoE 4MP (2560x1440), Lente 2.8mm (FOV 104°), IR ColorVu 30m, IP67",
      pos: [4.40, 2.35, -4.05],
      lookAt: [-2.50, 0.20, -7.50],
      fovDeg: 62,
      range: 9.0,
      color: 0x38bdf8,
      desc: "Vigila la vereda municipal, el portoncito peatonal (+X) y la aproximación vehicular por Calle Tte. Guillermo Arias."
    },
    {
      id: "cam_2_poniente",
      numero: 2,
      name: "Cámara IP PoE #2 — Calle Guillermo Arias (Vista Portón Balancín -X)",
      ubicacion: "Pilar Frontal Oeste Cochera (Nivel Calle z = -4.00m)",
      especificacion: "Bullet IP PoE 4MP, Lente 2.8mm, Detección Humana/Vehicular IA, IP67",
      pos: [-4.40, 2.35, -4.05],
      lookAt: [2.50, 0.20, -7.50],
      fovDeg: 62,
      range: 9.0,
      color: 0x38bdf8,
      desc: "Cubre el portón vehicular balancín (-X) y el tramo sin salida de Calle Tte. Guillermo Arias."
    },
    {
      id: "cam_3_cochera",
      numero: 3,
      name: "Cámara IP PoE #3 — Interior Estacionamiento y Puerta de Servicio",
      ubicacion: "Bajo Viga Frontal Fachada Eje G (Y = +2.65m, z = 2.95m)",
      especificacion: "Domo Antivandálico IK10 PoE 4MP, WDR 120dB contra contraluz, Audio Integrado",
      pos: [0.00, 2.65, 2.95],
      lookAt: [-1.50, 0.10, -3.50],
      fovDeg: 70,
      range: 7.5,
      color: 0x22d3ee,
      desc: "Monitorea el vehículo bajo la pérgola antigranizo, la puerta principal y la puerta exterior de servicio hacia el subsuelo."
    },
    {
      id: "cam_4_pasillo",
      numero: 4,
      name: "Cámara IP PoE #4 — Escalera 1 de Servicio hacia el Subsuelo (Ejes 1–2)",
      ubicacion: "Muro Lateral Este sobre Escalera 1 (x = +4.65m, z = 5.30m)",
      especificacion: "Bullet IP PoE 4MP, Visión Nocturna Smart IR 25m, IP67",
      pos: [4.65, 2.45, 5.30],
      lookAt: [4.35, -1.80, 9.20],
      fovDeg: 55,
      range: 6.5,
      color: 0x06b6d4,
      desc: "Controla el doble acceso de servicio (puerta exterior y puerta interior) que baja por la Escalera 1 existente hacia el Subsuelo."
    },
    {
      id: "cam_5_galeria",
      numero: 5,
      name: "Cámara IP PoE #5 — Galería Panorámica y Deck 2 (Eje A z = 13.30m)",
      ubicacion: "Pilar Esquinero Eje A de Planta Alta (Y = +5.25m, z = 13.30m)",
      especificacion: "Domo IP PoE 4MP Gran Angular 110°, Sirena y Estrobo disuasivo activo",
      pos: [-4.55, 5.25, 13.25],
      lookAt: [2.20, 2.88, 10.50],
      fovDeg: 68,
      range: 7.5,
      color: 0x38bdf8,
      desc: "Adosada al pilar real del Eje A (z = 13.30m) para cubrir la terraza mirador del 2do piso y los ventanales hacia el río."
    },
    {
      id: "cam_6_barranco",
      numero: 6,
      name: "Cámara IP PoE #6 — Contrafrente Subsuelo, Quincho y Patio Trasero (Eje A z = 13.30m)",
      ubicacion: "Bajo Viga de Losa 1 en Eje A (Y = -0.50m, z = 13.30m)",
      especificacion: "Bullet IP PoE 4MP Perimetral con cruce de línea virtual, IR 40m",
      pos: [0.00, -0.50, 13.30],
      lookAt: [0.00, -2.34, 21.50],
      fovDeg: 65,
      range: 8.5,
      color: 0x0ea5e9,
      desc: "Fijada bajo la viga real del Eje A (z = 13.30m), vigilando el salón del subsuelo, la parrillita y el patio nivelado con la piscina."
    }
  ],
  nodosWifiMesh: [
    {
      id: "wifi_node_1_pb",
      name: "Nodo Wi-Fi 6 Mesh #1 — Planta Baja Construida (Y = +1.80m)",
      ubicacion: "Estar / Comedor Planta Baja (x = +0.25m, z = 6.50m)",
      pos: [0.25, 1.80, 6.50],
      radius: 6.0,
      banda: "Dual Band AX3000 (2.4 GHz + 5 GHz 160MHz) • Master Router Gigabit",
      desc: "Vinculado directo al Rack Principal en Planta Baja. Cubre el Estar, Cocina/Comedor, Galería y Cochera."
    },
    {
      id: "wifi_node_2_pa",
      name: "Nodo Wi-Fi 6 Mesh #2 — Segundo Piso / Planta Alta (Y = +4.40m)",
      ubicacion: "Hall Distribuidor Central de Planta Alta (x = +0.25m, z = 5.60m)",
      pos: [0.25, 4.40, 5.60],
      radius: 6.0,
      banda: "Wi-Fi 6 Gigabit PoE • Backhaul Cableado Cat6 por Pase de Losa #2",
      desc: "Instalado en el centro de Planta Alta para cubrir el Escritorio Extendido, el Dormitorio 2 y la Suite Principal."
    },
    {
      id: "wifi_node_3_sub",
      name: "Nodo Wi-Fi 6 Mesh #3 — Salón Subsuelo y Quincho (Y = -0.55m)",
      ubicacion: "Salón Abierto del Subsuelo bajo Losa Maciza L4 (x = +0.25m, z = 8.50m)",
      pos: [0.25, -0.55, 8.50],
      radius: 5.5,
      banda: "Wi-Fi 6 Gigabit conectado por Pase Diamantado #2 en Losa 1 con UTP Cat6",
      desc: "Ubicado bajo la Losa 1 en el centro del Salón del Subsuelo (z = 8.50m), dando cobertura total al subsuelo, lavadero y patio."
    }
  ],
  pasesLosaBoquetes: [
    {
      id: "pase_losa_sub_pb",
      name: "Pase Diamantado #2 en Losa Maciza L4 Ø2\" (Planta Baja Y=0.00m ↔ Subsuelo)",
      pos: [0.25, 0.00, 4.78],
      dimensions: "Camisa PVC Ø50mm en Losa Maciza L4 (x = +0.25m, z = 4.78m)",
      desc: "Atraviesa la Losa Maciza L4 en el pleno técnico para bajar UTP Cat6 al Nodo Wi-Fi #3 del Subsuelo."
    },
    {
      id: "pase_losa_pb_pa",
      name: "Pase #2 en Losa 2do Piso Ø2\" (Planta Baja ↔ 2do Piso Y=+2.88m)",
      pos: [0.25, 2.88, 4.78],
      dimensions: "Camisa PVC Ø50mm alineada con el Rack Principal (x = +0.25m, z = 4.78m)",
      desc: "Paso vertical alineado con el Rack Principal para subir UTP Cat6 al Nodo Wi-Fi #2 y al Escritorio Extendido de Planta Alta."
    }
  ],
  porteroYPorton: {
    portero: {
      id: "portero_visor_ip",
      type: "domotica_acceso",
      name: "Portero Visor IP Antivandálico en Portoncito Peatonal (+X)",
      pos: [1.05, 1.45, -4.12],
      costo: "2.450.000 Gs. (Partida 12.3)",
      desc: "Frente de calle IP PoE instalado en el pilar central junto al Portoncito Peatonal (+X, x = +1.725m) con apertura remota desde el celular."
    },
    motorPorton: {
      id: "motor_porton_cochera",
      type: "domotica_acceso",
      name: "Automatización Portón Balancín Vehicular (-X) + Módulo Wi-Fi/Zigbee",
      pos: [-3.65, 1.15, -3.85],
      costo: "13.500.000 Gs. (Partida 9.1 Portón Completo)",
      desc: "Motor torsional de apertura rápida en el Portón Balancín de 2.30m (ubicado en el lado derecho mirando de frente, x = -2.35m)."
    }
  },
  lucesDomoticasNocturnas: [
    {
      id: "luz_dom_1",
      name: "Luminaria Domótica Cálida 3000K — Fachada Cochera Oeste (Eje G z = 2.95m)",
      pos: [-2.35, 2.65, 2.90],
      target: [-2.35, 0.00, -1.50],
      intensity: 3.5,
      distance: 11
    },
    {
      id: "luz_dom_2",
      name: "Luminaria Domótica Cálida 3000K — Acceso Peatonal y Servicio Este (Eje G z = 2.95m)",
      pos: [2.50, 2.65, 2.90],
      target: [2.50, 0.00, -1.50],
      intensity: 3.5,
      distance: 11
    },
    {
      id: "luz_dom_3",
      name: "Bañador LED 3000K — Muro Frontal Calle Tte. Guillermo Arias (z = -4.05m)",
      pos: [0.00, 1.85, -4.08],
      target: [0.00, 0.00, -5.20],
      intensity: 2.8,
      distance: 8
    },
    {
      id: "luz_dom_4",
      name: "Iluminación Escénica 3000K — Galería Planta Baja al Río (Eje A z = 12.80m)",
      pos: [-2.20, 2.75, 12.80],
      target: [-2.20, -0.45, 12.80],
      intensity: 4.0,
      distance: 11
    },
    {
      id: "luz_dom_5",
      name: "Iluminación Escénica 3000K — Deck 2do Piso bajo Alero Techo (Eje A z = 12.80m)",
      pos: [2.20, 5.45, 12.80],
      target: [2.20, 2.88, 12.80],
      intensity: 4.5,
      distance: 12
    },
    {
      id: "luz_dom_6",
      name: "Baliza LED Automatizada 3000K — Escalera 1 y Salón Subsuelo (x = +4.35m, z = 7.50m)",
      pos: [4.35, -0.35, 7.50],
      target: [4.35, -2.34, 7.50],
      intensity: 3.2,
      distance: 9
    }
  ]
};

// 3. Guía de Buenas Prácticas Arquitectónicas y Constructivas en Paraguay (Asunción - Itá Pytã Punta)
export const ARQUITECTURA_PARAGUAY_BEST_PRACTICES = {
  titulo: "Manual de Buenas Prácticas Constructivas para este Lote en Itá Pytã Punta (Asunción)",
  resumenClimaticoYGeotecnico: "El proyecto cuenta con el Subsuelo (+97.00m) y la primera Losa a nivel de calle (+100.00m) YA CONSTRUIDOS. La estrategia inteligente de inversión consiste en levantar la Losa del Segundo Piso (Y = +3.00m / Cota +103.00m) y coronar con el Techo Termoacústico en su nivel definitivo (Y = +5.85m / Cota +105.85m), ganando un paraguas estructural completo que protege los 3 niveles para ir cerrando los ambientes interiores según disponibilidad de recursos.",
  categorias: [
    {
      id: "bioclimatica_noroeste",
      categoria: "1. Control Solar Noroeste, Aleros en Doble Altura y Confort Térmico (42°C)",
      icono: "sun",
      prioridad: "Alta — Confort y Ahorro ANDE",
      recomendaciones: [
        {
          titulo: "Galería de 3.50m y Aleros Superiores (+105.85m) como Escudo Solar Noroeste",
          detalle: "En Asunción, la fachada con vista al Río Paraguay mira al Noroeste, recibiendo la radiación solar más agresiva entre las 14:00 y las 18:30 hs. Al colocar el Techo Termoacústico a su altura definitiva (Y = +5.85m) y la Losa del Segundo Piso (Y = +3.00m) con voladizo de 3.50m, ambos niveles quedan protegidos del sol directo estival, reduciendo la carga térmica de aire acondicionado en hasta un 38%."
        },
        {
          titulo: "Cubierta Termoacústica Isopanel PIR/PUR (30mm a 50mm) arriba del Segundo Piso",
          detalle: "Ubicar el techo Isopanel directamente en la cota superior definitiva (+105.85m) evita gastar dos veces en desmontar techos provisorios. El núcleo de poliuretano/poliisocianurato (PIR) de alta densidad (40 kg/m³) frena la radiación de 42°C y amortigua el ruido de impacto durante lluvias torrenciales."
        },
        {
          titulo: "Ventanales Templados con Control Solar o DVH y Ventilación Cruzada NE-SO",
          detalle: "En los cierres vidriados hacia el río (Planta Baja y futuro Segundo Piso), utilizar vidrio templado laminado con película de control solar (Low-E / Solar Neutral) o Doble Vidriado Hermético (DVH), aprovechando la brisa fresca que sube desde el canal del Río Paraguay en dirección Noreste-Suroeste."
        }
      ]
    },
    {
      id: "hidrofuga_barranco",
      categoria: "2. Ingeniería Hidrófuga, Contención y Drenaje de Barranco (>150 mm/h)",
      icono: "droplets",
      prioridad: "Crítica — Estabilidad Estructural",
      recomendaciones: [
        {
          titulo: "Drenaje Francés con Geotextil Bidim + Barbacanas cada 1.50m",
          detalle: "El error #1 en muros de contención en Asunción es omitir el drenaje posterior: el agua de lluvia satura el relleno de tierra roja y duplica el empuje contra el muro. Es obligatorio instalar tubo cribado Ø100mm envuelto en piedra triturada 4ta y manta geotextil Bidim RT-16 detrás del muro de cochera (+98.50m) y del subsuelo (+96.80m), más barbacanas Ø50mm cada 1.50m."
        },
        {
          titulo: "Cajón Hidrófugo Doble y Azotado Impermeable en Trasdós (Ceresita / Sika-1)",
          detalle: "Antes de rellenar la cochera con tierra roja compactada, revocar la cara interna del muro de contención con mortero impermeable 1:3 + hidrófugo inorgánico (Ceresita/Sika-1) y aplicar 2 manos cruzadas de emulsión asfáltica. En mamposterías de Planta Baja (+100.00m) y Segundo Piso (+103.00m), ejecutar cajón hidrófugo y babetas perimetrales."
        },
        {
          titulo: "Bajadas Pluviales Ø100mm desde Y=+5.80m hasta Disipador en Barranco (Estrato SM)",
          detalle: "El agua que cae desde casi 6 metros de altura en el techo del Segundo Piso adquiere gran energía cinética. Nunca verter caños pluviales libremente sobre la barranca (arena limosa SM Nspt 7-12 en S3): conducir las 4 bajadas Ø100mm por pases previstos en la losa hasta cámaras desarenadoras y entregar al barranco mediante un disipador de piedra bruta cementada."
        }
      ]
    },
    {
      id: "estructural_mamposteria",
      categoria: "3. Empalme de Pilares para 2da Losa (+103.00m) y Mampostería Paraguaya",
      icono: "layers",
      prioridad: "Crítica — Ejecución Inmediata",
      recomendaciones: [
        {
          titulo: "Puente de Adherencia Epóxico (Sikadur-32 Gel) en Arranques de Pilares y Vigas",
          detalle: "Para levantar los pilares desde la primera losa existente (+100.00m) hacia la nueva Losa del Segundo Piso (+103.00m), cepillar con acero los pelos de espera existentes (o anclar varillas Ø12mm con epoxi químico Sikadur-31), escarificar el hormigón viejo de contacto y aplicar puente epóxico Sikadur-32 Gel antes de hormigonar."
        },
        {
          titulo: "Envarillado Horizontal cada 5 Hiladas y Cierre Gradual por Etapas",
          detalle: "Al tener la Losa del 2do Piso (+103.00m) y el Techo General (+105.85m) ya levantados como esqueleto protector, los muros exteriores e interiores pueden cerrarse por etapas con ladrillo cerámico hueco 12x18x25cm, colocando 2 varillas Ø6mm cada 5 hiladas y trabazón elástica contra pilares H°A°."
        },
        {
          titulo: "Dejar Pases de Losa (Camisas PVC Ø50mm y Ø100mm) Antes de Cargar la 2da Losa",
          detalle: "Antes de verter el hormigón H21 de la Losa del Segundo Piso (Y = +3.00m), fijar en el encofrado las camisas de pase para las 4 bajadas pluviales Ø100mm, ventilaciones cloacales y el boquete de señales débiles Cat6, evitando picar viguetas pretensadas posteriormente."
        }
      ]
    },
    {
      id: "instalaciones_mep",
      categoria: "4. Climatización Split, Señales Débiles y Previsión Eléctrica ANDE",
      icono: "cpu",
      prioridad: "Media-Alta — Valor Patrimonial",
      recomendaciones: [
        {
          titulo: "Preinstalación Embutida de Cajas de Pre-Avance para Splits Inverter en 3 Niveles",
          detalle: "Dejar embutidas las cajas de preinstalación de aire acondicionado con cañería de cobre aislada y desagüe de condensado en PVC Ø25mm conectado directo a las columnas pluviales (evita el goteo libre desde el Segundo Piso hacia la galería o vereda)."
        },
        {
          titulo: "Columna Montante de Datos UTP Cat6 (Subsuelo ↔ Planta Baja ↔ Segundo Piso)",
          detalle: "Desde el Gabinete Principal en Planta Baja (ONU Fibra + Switch PoE + NVR), distribuir por caño conduit ignífugo independiente un nodo Wi-Fi 6 Mesh por nivel (Y = -1.50m, Y = +1.80m e Y = +4.60m), garantizando roaming sin cortes pese a las dos losas de hormigón armado."
        }
      ]
    }
  ]
};

/**
 * Construye la capa 3D del Sistema Pluvial, Drenaje Francés de Barranco y Plan Hidrófugo.
 */
export function buildPluvialAndHydroLayer(THREE, sceneGroups, getTerrainHeight) {
  const group = sceneGroups.pluvialHydro || new THREE.Group();
  group.clear();

  const animatedDrops = [];

  // Materiales técnicos
  const galvMat = new THREE.MeshStandardMaterial({
    color: 0x94a3b8,
    metalness: 0.85,
    roughness: 0.25
  });
  const pvcPluvialMat = new THREE.MeshStandardMaterial({
    color: 0x0284c7,
    roughness: 0.3,
    metalness: 0.15,
    emissive: 0x0369a1,
    emissiveIntensity: 0.2
  });
  const geotextilMat = new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.35,
    roughness: 0.8,
    depthWrite: false
  });
  const perforatedPipeMat = new THREE.MeshStandardMaterial({
    color: 0xfacc15,
    roughness: 0.4,
    metalness: 0.2,
    emissive: 0x854d0e,
    emissiveIntensity: 0.25
  });
  const weepHoleMat = new THREE.MeshStandardMaterial({
    color: 0x22d3ee,
    emissive: 0x0891b2,
    emissiveIntensity: 0.5,
    roughness: 0.2
  });
  const chamberMat = new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    roughness: 0.5,
    metalness: 0.4
  });
  const chamberLidMat = new THREE.MeshStandardMaterial({
    color: 0x0ea5e9,
    roughness: 0.3,
    metalness: 0.6
  });

  // 1. SISTEMA DE CANALETAS APUNTANDO HACIA ADELANTE (FRENTE EJE G z = 2.95m, Y = +5.55m)
  const gutterFrontGeom = new THREE.BoxGeometry(9.60, 0.22, 0.24);
  const gutterFront = new THREE.Mesh(gutterFrontGeom, galvMat);
  gutterFront.position.set(0, 5.55, 2.95);
  gutterFront.userData = PLUVIAL_HYDRO_DATA.elementos3D[0];
  group.add(gutterFront);

  // Babeta superior en el borde posterior real del techo (Eje A z = 13.34m, Y = +5.88m)
  const gutterRearGeom = new THREE.BoxGeometry(9.60, 0.16, 0.18);
  const gutterRear = new THREE.Mesh(gutterRearGeom, galvMat);
  gutterRear.position.set(0, 5.88, 13.34);
  gutterRear.userData = {
    type: "pluvial_canaleta",
    name: "Babeta y Cumbrera Superior Chapa Galvanizada N°24 (Eje A z = 13.34m • Caída hacia Adelante)",
    dimensions: "9.60m x 0.18m (Cierre superior del techo con pendiente hacia el frente)",
    cota: "+105.88 m (Y = +5.88m)",
    desc: "Coronamiento superior en Eje A desde donde el techo Isopanel baja hacia la canaleta frontal en Eje G (z = 2.95m) para desaguar hacia la calle."
  };
  group.add(gutterRear);

  // Canaleta colectora frontal en el borde de la Pérgola de Cochera (x = -2.35m, Y = +2.65m, z = -3.85m)
  const gutterMidGeom = new THREE.BoxGeometry(3.80, 0.12, 0.14);
  const gutterMid = new THREE.Mesh(gutterMidGeom, galvMat);
  gutterMid.position.set(-2.35, 2.65, -3.85);
  gutterMid.userData = {
    type: "pluvial_canaleta",
    name: "Canaleta Colectora Frontal de Pérgola Antigranizo en Cochera (z = -3.85m)",
    dimensions: "3.80m x 0.14m • Conectada a Bajada Frontal hacia la Calle",
    cota: "+102.65 m",
    desc: "Recoge el agua de lluvia de la cubierta translúcida del estacionamiento y la descarga directo al colector frontal hacia Calle Tte. Guillermo Arias."
  };
  group.add(gutterMid);

  // 2. 4 BAJADAS PLUVIALES VERTICALES DE PVC REFORZADO Ø100mm ADOSADAS A LOS PILARES REALES DE LA CASA
  const downspoutsConfig = [
    { id: "BP-1", name: "Bajada Pluvial Frontal Principal #1 (PVC Ø100mm - Pilar P20 Eje G Oeste)", x: -4.75, z: 2.92, topY: 5.55, botY: -0.35 },
    { id: "BP-2", name: "Bajada Pluvial Frontal Principal #2 (PVC Ø100mm - Pilar P4 Eje G Este)", x: 4.75, z: 2.92, topY: 5.55, botY: -0.35 },
    { id: "BP-3", name: "Bajada Pluvial Terraza Deck 2 #3 (PVC Ø100mm - Pilar P18 Eje B Oeste)", x: -4.75, z: 9.94, topY: 2.88, botY: -2.34 },
    { id: "BP-4", name: "Bajada Pluvial Terraza Deck 2 #4 (PVC Ø100mm - Pilar P2 Eje B Este)", x: 4.75, z: 9.94, topY: 2.88, botY: -2.34 }
  ];

  downspoutsConfig.forEach((ds) => {
    const h = ds.topY - ds.botY;
    const pipeGeom = new THREE.CylinderGeometry(0.065, 0.065, h, 16);
    const pipeMesh = new THREE.Mesh(pipeGeom, pvcPluvialMat);
    pipeMesh.position.set(ds.x, ds.botY + h / 2, ds.z);
    pipeMesh.userData = {
      type: "pluvial_bajada",
      name: `${ds.id}: ${ds.name}`,
      dimensions: `PVC Reforzado Ø100mm • Altura ${h.toFixed(2)}m (Hacia Colector Frontal a Calle)`,
      costo: "Incluido en Partida 3.3",
      status: "Evacuación Pluvial hacia Adelante (Calle Tte. Guillermo Arias)",
      desc: "Tubería vertical adosada a pilar estructural real que baja el agua pluvial hacia los colectores laterales que desaguan por delante hacia la calle."
    };
    group.add(pipeMesh);

    const hopperGeom = new THREE.ConeGeometry(0.15, 0.22, 16);
    hopperGeom.rotateX(Math.PI);
    const hopperMesh = new THREE.Mesh(hopperGeom, galvMat);
    hopperMesh.position.set(ds.x, ds.topY + 0.04, ds.z);
    group.add(hopperMesh);

    [2.88, 0.0].forEach((slabY) => {
      if (slabY <= ds.topY && slabY >= ds.botY) {
        const collarGeom = new THREE.TorusGeometry(0.085, 0.02, 10, 20);
        collarGeom.rotateX(Math.PI / 2);
        const collarMesh = new THREE.Mesh(collarGeom, galvMat);
        collarMesh.position.set(ds.x, slabY, ds.z);
        group.add(collarMesh);
      }
    });
  });

  // 3. DRENAJE FRANCÉS FRONTAL (MURO COCHERA Y CÁMARA DE OXIGENACIÓN SUBSUELO) CON BARBACANAS Ø50mm CADA 1.50m
  const buildFrenchDrain = (centerX, centerY, centerZ, lengthX, metaData, weepYOffset) => {
    const drainGroup = new THREE.Group();

    const gravelBedGeom = new THREE.BoxGeometry(lengthX, 0.42, 0.45);
    const gravelBed = new THREE.Mesh(gravelBedGeom, geotextilMat);
    gravelBed.position.set(centerX, centerY, centerZ);
    gravelBed.userData = metaData;
    drainGroup.add(gravelBed);

    const cribadoGeom = new THREE.CylinderGeometry(0.075, 0.075, lengthX - 0.2, 20);
    cribadoGeom.rotateZ(Math.PI / 2);
    const cribadoMesh = new THREE.Mesh(cribadoGeom, perforatedPipeMat);
    cribadoMesh.position.set(centerX, centerY - 0.05, centerZ);
    cribadoMesh.userData = metaData;
    drainGroup.add(cribadoMesh);

    for (let x = -lengthX / 2 + 0.6; x <= lengthX / 2 - 0.6; x += 0.8) {
      const ringGeom = new THREE.TorusGeometry(0.08, 0.015, 8, 16);
      ringGeom.rotateY(Math.PI / 2);
      const ring = new THREE.Mesh(ringGeom, pvcPluvialMat);
      ring.position.set(centerX + x, centerY - 0.05, centerZ);
      drainGroup.add(ring);
    }

    for (let x = -3.75; x <= 3.75; x += 1.5) {
      const weepGeom = new THREE.CylinderGeometry(0.035, 0.035, 0.55, 12);
      weepGeom.rotateX(Math.PI / 2 + 0.05);
      const weepMesh = new THREE.Mesh(weepGeom, weepHoleMat);
      weepMesh.position.set(centerX + x, centerY + weepYOffset, centerZ - 0.25);
      weepMesh.userData = {
        type: "hidrofugo_barbacana",
        name: "Barbacana de Alivio Hidrostático PVC Ø50mm (c/ 1.50m)",
        dimensions: "Ø50mm • Separación 1.50m • Pendiente 5%",
        status: "Alivio de Presión Hidrostática",
        desc: "Pasa-muro de PVC Ø50mm con filtro geotextil interior hacia el frente."
      };
      drainGroup.add(weepMesh);
    }

    group.add(drainGroup);
  };

  buildFrenchDrain(0, -0.55, -3.75, 9.4, PLUVIAL_HYDRO_DATA.elementos3D[1], 0.20);
  buildFrenchDrain(0, -2.25, 2.75, 8.8, PLUVIAL_HYDRO_DATA.elementos3D[2], 0.25);

  // 4. CÁMARAS PLUVIALES (40x40cm) Y COLECTORES QUE DESAGUAN HACIA ADELANTE (CALLE TTE. GUILLERMO ARIAS z = -5.65m)
  const chambersConfig = [
    { id: "CI-1", name: "Cámara Pluvial #1 (Recibe Bajada Eje B Oeste)", x: -4.65, z: 9.94, y: -2.34 },
    { id: "CI-2", name: "Cámara Pluvial #2 (Recibe Bajada Eje B Este)", x: 4.65, z: 9.94, y: -2.34 },
    { id: "CI-3", name: "Cámara Pluvial Frontal #3 (Recibe Bajada Principal Eje G Oeste)", x: -4.65, z: 2.85, y: -0.35 },
    { id: "CI-4", name: "Cámara Pluvial Frontal #4 (Recibe Bajada Principal Eje G Este)", x: 4.65, z: 2.85, y: -0.35 },
    { id: "CI-5", name: "Boca de Salida Pluvial a Cordón Cuneta Oeste (Calle Guillermo Arias)", x: -4.65, z: -5.55, y: -0.25 },
    { id: "CI-6", name: "Boca de Salida Pluvial a Cordón Cuneta Este (Calle Guillermo Arias)", x: 4.65, z: -5.55, y: -0.25 }
  ];

  chambersConfig.forEach((ch) => {
    const boxGeom = new THREE.BoxGeometry(0.45, 0.45, 0.45);
    const boxMesh = new THREE.Mesh(boxGeom, chamberMat);
    boxMesh.position.set(ch.x, ch.y, ch.z);

    const lidGeom = new THREE.BoxGeometry(0.49, 0.05, 0.49);
    const lidMesh = new THREE.Mesh(lidGeom, chamberLidMat);
    lidMesh.position.y = 0.24;
    boxMesh.add(lidMesh);

    boxMesh.userData = {
      type: "pluvial_camara",
      name: `${ch.id}: ${ch.name}`,
      dimensions: "0.40m x 0.40m x 0.45m (Mampostería Hidrófuga)",
      cota: `${(100 + ch.y).toFixed(2)} m`,
      status: "Conducción Pluvial hacia la Calle (Frente Sur)",
      desc: "Registro pluvial que conduce las aguas de lluvia hacia adelante hasta el cordón cuneta de la Calle Tte. Guillermo Arias."
    };
    group.add(boxMesh);
  });

  // Colectores pluviales laterales Ø100mm rectilíneos con flujo HACIA ADELANTE (desde Eje B z = 9.94m → Eje G z = 2.85m → Calle z = -5.65m)
  const createCollectorTube = (points, label) => {
    const curve = new THREE.CatmullRomCurve3(points, false, 'catmullrom', 0.01);
    const tubeGeom = new THREE.TubeGeometry(curve, 24, 0.055, 12, false);
    const tubeMesh = new THREE.Mesh(tubeGeom, pvcPluvialMat);
    tubeMesh.userData = {
      type: "pluvial_colector",
      name: label,
      dimensions: "PVC Pluvial Pesado Ø100mm • Desagüe hacia Calle Tte. Guillermo Arias",
      desc: "Conducto troncal que evacúa toda el agua de lluvia hacia adelante (Calle Tte. Guillermo Arias), dejando el fondo exclusivamente para la Cámara Séptica y Pozo Ciego."
    };
    group.add(tubeMesh);
    return curve;
  };

  const westCurve = createCollectorTube([
    new THREE.Vector3(-4.65, -2.30, 9.94),
    new THREE.Vector3(-4.65, -0.35, 2.85),
    new THREE.Vector3(-4.65, -0.38, -1.50),
    new THREE.Vector3(-4.65, -0.42, -5.65)
  ], "Colector Pluvial Troncal Oeste hacia Calle Tte. Guillermo Arias (PVC Ø100mm)");

  const eastCurve = createCollectorTube([
    new THREE.Vector3(4.65, -2.30, 9.94),
    new THREE.Vector3(4.65, -0.35, 2.85),
    new THREE.Vector3(4.65, -0.38, -1.50),
    new THREE.Vector3(4.65, -0.42, -5.65)
  ], "Colector Pluvial Troncal Este hacia Calle Tte. Guillermo Arias (PVC Ø100mm)");

  // 5. BOCAS DE DESAGÜE PLUVIAL EN CORDÓN CUNETA DE CALLE TTE. GUILLERMO ARIAS (z = -5.65m)
  const streetOutfallGroup = new THREE.Group();
  [-4.65, 4.65].forEach((ox) => {
    const outfallBox = new THREE.Mesh(
      new THREE.BoxGeometry(0.55, 0.24, 0.35),
      new THREE.MeshStandardMaterial({ color: 0x0ea5e9, roughness: 0.4, metalness: 0.5 })
    );
    outfallBox.position.set(ox, -0.35, -5.65);
    streetOutfallGroup.add(outfallBox);
  });
  streetOutfallGroup.userData = PLUVIAL_HYDRO_DATA.elementos3D[3];
  group.add(streetOutfallGroup);

  // 6. SIMULADOR INTERACTIVO PLUVIAL / HIDROSANITARIO POR CAPAS (Alineado al Núcleo Húmedo en Losa Maciza L4: x = +0.68..+2.35m, z = 3.28m)
  const simSubGroups = {
    rainstorm: new THREE.Group(),
    water_supply: new THREE.Group(),
    sewage_flow: new THREE.Group()
  };
  simSubGroups.rainstorm.name = 'sim_pluvial_rainstorm';
  simSubGroups.water_supply.name = 'sim_pluvial_water_supply';
  simSubGroups.sewage_flow.name = 'sim_pluvial_sewage_flow';

  group.add(simSubGroups.rainstorm);
  group.add(simSubGroups.water_supply);
  group.add(simSubGroups.sewage_flow);

  const rainStreakGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.55, 6);
  const rainStreakMat = new THREE.MeshBasicMaterial({
    color: 0x7dd3fc,
    transparent: true,
    opacity: 0.72
  });
  const fallingRainStreaks = [];
  for (let i = 0; i < 160; i++) {
    const streak = new THREE.Mesh(rainStreakGeo, rainStreakMat);
    const isOverPergola = i < 45;
    const rx = isOverPergola
      ? -4.4 + ((i * 37) % 100) * 0.042
      : -4.8 + ((i * 53) % 100) * 0.096;
    const rz = isOverPergola
      ? -3.7 + ((i * 29) % 100) * 0.064
      : 2.8 + ((i * 71) % 100) * 0.106;
    const minY = isOverPergola ? 2.75 : 5.75;
    const maxY = 12.5;
    const ry = minY + ((i * 19) % 100) * ((maxY - minY) / 100);
    streak.position.set(rx, ry, rz);
    simSubGroups.rainstorm.add(streak);
    fallingRainStreaks.push({
      mesh: streak,
      minY,
      maxY,
      speed: 0.22 + (i % 7) * 0.025
    });
  }

  const dropGeom = new THREE.SphereGeometry(0.09, 10, 10);
  const dropRainMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
  const roofWestPath = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-2.5, 5.92, 12.5),
    new THREE.Vector3(-3.5, 5.65, 6.5),
    new THREE.Vector3(-4.75, 5.55, 2.92),
    new THREE.Vector3(-4.75, 2.88, 2.92),
    new THREE.Vector3(-4.75, -0.35, 2.92)
  ], false, 'catmullrom', 0.02);
  const roofEastPath = new THREE.CatmullRomCurve3([
    new THREE.Vector3(2.5, 5.92, 12.5),
    new THREE.Vector3(3.5, 5.65, 6.5),
    new THREE.Vector3(4.75, 5.55, 2.92),
    new THREE.Vector3(4.75, 2.88, 2.92),
    new THREE.Vector3(4.75, -0.35, 2.92)
  ], false, 'catmullrom', 0.02);
  const pergolaDrainPath = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-2.35, 2.75, 2.2),
    new THREE.Vector3(-2.35, 2.68, -1.0),
    new THREE.Vector3(-3.80, 2.65, -3.85),
    new THREE.Vector3(-4.65, 0.0, -3.85),
    new THREE.Vector3(-4.65, -0.42, -5.65)
  ], false, 'catmullrom', 0.02);

  [westCurve, eastCurve, roofWestPath, roofEastPath, pergolaDrainPath].forEach((curve, pathIdx) => {
    const count = 12;
    for (let i = 0; i < count; i++) {
      const drop = new THREE.Mesh(dropGeom, dropRainMat);
      const tOffset = i / count;
      drop.position.copy(curve.getPointAt(tOffset));
      simSubGroups.rainstorm.add(drop);
      animatedDrops.push({
        mesh: drop,
        curve,
        t: tOffset,
        speed: pathIdx >= 2 ? 0.0065 : 0.0048,
        mode: 'rainstorm'
      });
    }
  });

  // (b) 'water_supply': Flujo ortogonal desde Caja Medidor ESSAP (x=-3.85m, z=-4.24m) → Pase #4 en Losa Maciza L4 (x=+1.48m, z=3.28m) → Baño Social PB, Cocina PB, Baño Suite PA, Termocalefón 80L y SSHH 2 PA
  const coldFlowMat = new THREE.MeshBasicMaterial({ color: 0x0ea5e9 });
  const hotFlowMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
  const supplyColdCurveMain = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-3.85, 0.05, -4.24),
    new THREE.Vector3(-3.85, -0.45, -4.24),
    new THREE.Vector3(-3.85, -0.45, 2.85),
    new THREE.Vector3(1.48, -0.45, 2.85),
    new THREE.Vector3(1.48, -0.45, 3.28),
    new THREE.Vector3(1.48, 0.00, 3.28),  // PASE #4 en Losa Maciza L4
    new THREE.Vector3(1.48, 0.85, 3.28),
    new THREE.Vector3(2.35, 0.85, 3.28),  // Bacha Doble Cocina PB (Este)
    new THREE.Vector3(1.48, 0.85, 3.28),
    new THREE.Vector3(0.75, 0.85, 3.28),  // Baño Social PB
    new THREE.Vector3(1.48, 0.85, 3.28),
    new THREE.Vector3(1.48, 2.88, 3.28),  // PASE #4 en Losa 2
    new THREE.Vector3(1.48, 3.70, 3.28),
    new THREE.Vector3(0.95, 4.75, 3.28),  // Termocalefón 80L
    new THREE.Vector3(-0.35, 3.70, 3.28), // Baño en Suite PA
    new THREE.Vector3(-2.65, 3.70, 3.28)  // SSHH 2 PA
  ], false, 'catmullrom', 0.01);

  const supplyColdCurveSub = new THREE.CatmullRomCurve3([
    new THREE.Vector3(1.48, -0.45, 3.28),
    new THREE.Vector3(4.45, -0.45, 3.28),
    new THREE.Vector3(4.45, -0.45, 6.40),
    new THREE.Vector3(4.45, -1.45, 6.40), // Lavadero Subsuelo (Muro Este Eje 1)
    new THREE.Vector3(4.45, -2.25, 11.80),
    new THREE.Vector3(-3.20, -2.25, 11.80),
    new THREE.Vector3(-3.20, -1.45, 12.40) // Bacha Parrillita Subsuelo (Oeste)
  ], false, 'catmullrom', 0.01);

  const supplyHotCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.95, 4.75, 3.22),  // Termocalefón 80L
    new THREE.Vector3(0.95, 3.82, 3.22),
    new THREE.Vector3(-0.35, 3.82, 3.22), // Ducha y Vanitory Baño en Suite PA
    new THREE.Vector3(-2.65, 3.82, 3.22), // Ducha y Vanitory SSHH 2 PA
    new THREE.Vector3(1.42, 3.82, 3.22),
    new THREE.Vector3(1.42, 2.88, 3.22),  // Baja por Pase #4 Losa 2
    new THREE.Vector3(1.42, 0.88, 3.22),
    new THREE.Vector3(2.35, 0.88, 3.22)   // Bacha Doble Cocina PB
  ], false, 'catmullrom', 0.01);

  [
    { curve: supplyColdCurveMain, mat: coldFlowMat },
    { curve: supplyColdCurveSub, mat: coldFlowMat },
    { curve: supplyHotCurve, mat: hotFlowMat }
  ].forEach(({ curve, mat }) => {
    for (let i = 0; i < 14; i++) {
      const pulse = new THREE.Mesh(new THREE.SphereGeometry(0.068, 10, 10), mat);
      const tOffset = i / 14;
      pulse.position.copy(curve.getPointAt(tOffset));
      simSubGroups.water_supply.add(pulse);
      animatedDrops.push({
        mesh: pulse,
        curve,
        t: tOffset,
        speed: 0.0055,
        mode: 'water_supply'
      });
    }
  });

  // (c) 'sewage_flow': Descarga cloacal ámbar vertical por PASE #3 (x=+0.68m, z=3.28m en Losa Maciza L4) hacia Cámara Desgrasadora, Cámara Séptica y Pozo Ciego
  const sewageFlowMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b });
  const sewageStackCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-2.15, 3.05, 3.28), // Inodoro/Ducha SSHH 2 PA
    new THREE.Vector3(-2.15, 2.68, 3.28), // Pasa Losa 2 por Pase #3B
    new THREE.Vector3(0.68, 2.62, 3.28),  // Une a Columna Principal en Pase #3
    new THREE.Vector3(0.68, 0.00, 3.28),  // Recibe Baño Social PB + Cocina PB y atraviesa Pase #3 en Losa Maciza L4
    new THREE.Vector3(0.68, -2.20, 3.28), // Pie de columna cloacal en Subsuelo
    new THREE.Vector3(0.68, -2.28, 6.40), // Recibe ramal Lavadero Subsuelo (+X)
    new THREE.Vector3(0.68, -2.35, 14.50),// Cámara de Inspección Principal en Patio
    new THREE.Vector3(-2.20, -2.55, 16.50),// Cámara Séptica Bicameral 1500L
    new THREE.Vector3(-2.20, -3.10, 19.80) // Pozo Ciego Absorbente Ø1.80m
  ], false, 'catmullrom', 0.01);

  for (let i = 0; i < 16; i++) {
    const slug = new THREE.Mesh(new THREE.SphereGeometry(0.085, 10, 10), sewageFlowMat);
    const tOffset = i / 16;
    slug.position.copy(sewageStackCurve.getPointAt(tOffset));
    simSubGroups.sewage_flow.add(slug);
    animatedDrops.push({
      mesh: slug,
      curve: sewageStackCurve,
      t: tOffset,
      speed: 0.0045,
      mode: 'sewage_flow'
    });
  }

  let currentPluvialSimMode = 'off';

  const setPluvialSimMode = (state = 'off') => {
    if (!state || state === 'off' || state === false) {
      currentPluvialSimMode = 'off';
      simSubGroups.rainstorm.visible = false;
      simSubGroups.water_supply.visible = false;
      simSubGroups.sewage_flow.visible = false;
      return currentPluvialSimMode;
    }
    if (typeof state === 'object') {
      const showRain = Boolean(state.rainstorm ?? state.rainStorm ?? state.tormenta ?? false);
      const showSupply = Boolean(state.water_supply ?? state.presion_agua ?? false);
      const showSewage = Boolean(state.sewage_flow ?? state.descarga_cloacal ?? false);

      simSubGroups.rainstorm.visible = showRain;
      simSubGroups.water_supply.visible = showSupply;
      simSubGroups.sewage_flow.visible = showSewage;

      if (!showRain && !showSupply && !showSewage) {
        currentPluvialSimMode = 'off';
        return currentPluvialSimMode;
      }
      currentPluvialSimMode = 'custom';
      group.visible = true;
      return currentPluvialSimMode;
    }
    const modeStr = String(state).toLowerCase().trim();
    currentPluvialSimMode = modeStr;
    group.visible = true;
    simSubGroups.rainstorm.visible = modeStr === 'all' || modeStr === 'rainstorm' || modeStr === 'tormenta';
    simSubGroups.water_supply.visible = modeStr === 'all' || modeStr === 'water_supply' || modeStr === 'presion_agua';
    simSubGroups.sewage_flow.visible = modeStr === 'all' || modeStr === 'sewage_flow' || modeStr === 'descarga_cloacal';
    return currentPluvialSimMode;
  };

  // Inicia apagado; solo muestra lluvia o flujos cuando el usuario activa la simulación
  setPluvialSimMode('off');

  group.userData.updateWaterAnimation = () => {
    if (!group.visible || currentPluvialSimMode === 'off') return;
    if (simSubGroups.rainstorm.visible) {
      fallingRainStreaks.forEach((r) => {
        r.mesh.position.y -= r.speed;
        if (r.mesh.position.y < r.minY) {
          r.mesh.position.y = r.maxY;
        }
      });
    }
    animatedDrops.forEach((item) => {
      if (item.mode && simSubGroups[item.mode] && !simSubGroups[item.mode].visible) return;
      item.t = (item.t + item.speed) % 1.0;
      const pos = item.curve.getPointAt(item.t);
      item.mesh.position.copy(pos);
    });
  };

  if (sceneGroups) {
    sceneGroups.pluvialHydro = group;
  }

  return {
    group,
    updateAnimation: group.userData.updateWaterAnimation,
    setSimulationState: setPluvialSimMode,
    simulatePluvialMode: setPluvialSimMode,
    data: PLUVIAL_HYDRO_DATA
  };
}

/**
 * Construye la capa 3D de Señales Débiles, CCTV PoE (6 cámaras con conos de visión 3D),
 * Red Wi-Fi 6 Mesh en los 3 niveles (Subsuelo Y=-1.5m, Planta Baja Y=+1.8m, Segundo Piso Y=+4.6m),
 * Rack Principal ONU/NVR, Portero Visor IP, Boquetes de Losa e Iluminación Nocturna Domótica 3000K.
 */
export function buildWeakSignalsLayer(THREE, sceneGroups, getTerrainHeight) {
  const group = sceneGroups.weakSignals || new THREE.Group();
  group.clear();

  const domoticLights = [];

  // 1. RACK / GABINETE PRINCIPAL (ONU Fibra + Switch PoE 8p + NVR 2TB) en Planta Baja Construida (Y = +1.50m)
  const rackInfo = WEAK_SIGNALS_DATA.rackPrincipal;
  const rackGroup = new THREE.Group();
  rackGroup.position.set(...rackInfo.pos3D);

  const rackBoxGeom = new THREE.BoxGeometry(0.6, 0.5, 0.45);
  const rackBoxMat = new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    metalness: 0.7,
    roughness: 0.3,
    emissive: 0x1e293b,
    emissiveIntensity: 0.3
  });
  const rackMesh = new THREE.Mesh(rackBoxGeom, rackBoxMat);
  rackGroup.add(rackMesh);

  const ledStripGeom = new THREE.BoxGeometry(0.42, 0.04, 0.02);
  const ledStripMat = new THREE.MeshBasicMaterial({ color: 0x10b981 });
  const ledStrip = new THREE.Mesh(ledStripGeom, ledStripMat);
  ledStrip.position.set(0, 0.1, 0.23);
  rackGroup.add(ledStrip);

  rackGroup.userData = {
    type: rackInfo.type,
    name: rackInfo.name,
    dimensions: "Gabinete Mural 6U (60x50x45cm)",
    costo: rackInfo.costo,
    status: rackInfo.status,
    desc: `${rackInfo.ubicacion}. Equipos: ${rackInfo.equipamiento.join(" + ")}.`
  };
  group.add(rackGroup);

  // 2. 6 CÁMARAS IP PoE 4MP CON CONOS DE VISIÓN 3D SEMITRANSPARENTES (FRUSTUMS)
  const camBodyMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, metalness: 0.4, roughness: 0.3 });
  const camLensMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });

  WEAK_SIGNALS_DATA.camarasCCTV.forEach((cam) => {
    const camNode = new THREE.Group();
    const posVec = new THREE.Vector3(...cam.pos);
    const targetVec = new THREE.Vector3(...cam.lookAt);

    const bodyGeom = new THREE.CylinderGeometry(0.11, 0.14, 0.32, 16);
    bodyGeom.rotateX(Math.PI / 2);
    const bodyMesh = new THREE.Mesh(bodyGeom, camBodyMat);
    camNode.add(bodyMesh);

    const irRing = new THREE.Mesh(new THREE.RingGeometry(0.06, 0.1, 16), camLensMat);
    irRing.position.z = 0.17;
    camNode.add(irRing);

    // Cono de visión 3D (Frustum piramidal semitransparente)
    const coneRadius = Math.tan((cam.fovDeg * Math.PI) / 360) * cam.range * 0.55;
    const coneGeom = new THREE.ConeGeometry(coneRadius, cam.range, 4, 1, true);
    coneGeom.translate(0, -cam.range / 2, 0);
    coneGeom.rotateX(-Math.PI / 2);
    coneGeom.rotateZ(Math.PI / 4);

    const coneMat = new THREE.MeshBasicMaterial({
      color: cam.color,
      transparent: true,
      opacity: 0.16,
      side: THREE.DoubleSide,
      depthWrite: false
    });
    const coneMesh = new THREE.Mesh(coneGeom, coneMat);
    camNode.add(coneMesh);

    const edgesGeom = new THREE.EdgesGeometry(coneGeom);
    const edgesMat = new THREE.LineBasicMaterial({
      color: cam.color,
      transparent: true,
      opacity: 0.55
    });
    const edgesLine = new THREE.LineSegments(edgesGeom, edgesMat);
    camNode.add(edgesLine);

    camNode.position.copy(posVec);
    camNode.lookAt(targetVec);

    camNode.userData = {
      type: "cctv_camara",
      name: cam.name,
      dimensions: cam.especificacion,
      costo: "Kit 6 Cámaras + NVR: 5.800.000 Gs. (Partida 12.2)",
      status: `Cámara #${cam.numero} PoE Activa`,
      desc: `${cam.ubicacion}. ${cam.desc}`
    };

    group.add(camNode);
  });

  // 3. 3 NODOS WI-FI 6 MESH EN LOS 3 NIVELES (Subsuelo Y=-1.5m, Planta Baja Y=+1.8m, Segundo Piso Y=+4.6m)
  WEAK_SIGNALS_DATA.nodosWifiMesh.forEach((node) => {
    const wifiGroup = new THREE.Group();
    wifiGroup.position.set(...node.pos);

    const apGeom = new THREE.CylinderGeometry(0.22, 0.22, 0.06, 24);
    const apMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0x10b981,
      emissiveIntensity: 0.6,
      roughness: 0.2
    });
    const apMesh = new THREE.Mesh(apGeom, apMat);
    wifiGroup.add(apMesh);

    const sphereGeom = new THREE.SphereGeometry(node.radius, 24, 16);
    const sphereMat = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      transparent: true,
      opacity: 0.08,
      wireframe: false,
      depthWrite: false
    });
    const sphereMesh = new THREE.Mesh(sphereGeom, sphereMat);
    wifiGroup.add(sphereMesh);

    const ringGeom = new THREE.RingGeometry(node.radius * 0.96, node.radius, 36);
    ringGeom.rotateX(Math.PI / 2);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x34d399,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.4
    });
    const ringMesh = new THREE.Mesh(ringGeom, ringMat);
    wifiGroup.add(ringMesh);

    wifiGroup.userData = {
      type: "wifi_mesh",
      name: node.name,
      dimensions: `Radio Cobertura Óptima: ${node.radius}m • ${node.banda}`,
      costo: "Kit 3 Nodos Mesh: 1.850.000 Gs. (Partida 12.4)",
      status: "Cobertura Gigabit en los 3 Niveles",
      desc: `${node.ubicacion}. ${node.desc}`
    };

    group.add(wifiGroup);
  });

  // 4. BOQUETES / PASES ENTRE LOSAS (PB Y=0.00m y 2do Piso Y=+3.00m) Y TRONCAL VERTICAL CAT6
  WEAK_SIGNALS_DATA.pasesLosaBoquetes.forEach((pase) => {
    const sleeveGeom = new THREE.CylinderGeometry(0.12, 0.12, 0.65, 16);
    const sleeveMat = new THREE.MeshStandardMaterial({
      color: 0xf97316,
      emissive: 0xc2410c,
      emissiveIntensity: 0.5,
      roughness: 0.3
    });
    const sleeveMesh = new THREE.Mesh(sleeveGeom, sleeveMat);
    sleeveMesh.position.set(...pase.pos);
    sleeveMesh.userData = {
      type: "pase_losa",
      name: pase.name,
      dimensions: pase.dimensions,
      status: "Previsto en Plano Señales Débiles",
      desc: pase.desc
    };
    group.add(sleeveMesh);
  });

  // Columna Montante UTP Cat6 uniendo Subsuelo (Y=-0.55m) ↔ Pase #2 Losa 1 (x=0.25, z=4.78) ↔ Rack PB (Y=+1.55m) ↔ Pase #2 Losa 2 (Y=+2.88m) ↔ Nodo 2do Piso (Y=+4.4m)
  const cat6Points = [
    new THREE.Vector3(0.25, -0.55, 8.50),
    new THREE.Vector3(0.25, -0.20, 4.78),
    new THREE.Vector3(0.25, 0.00, 4.78),
    new THREE.Vector3(...rackInfo.pos3D),
    new THREE.Vector3(0.25, 1.80, 6.50),
    new THREE.Vector3(0.25, 2.88, 4.78),
    new THREE.Vector3(0.25, 4.40, 5.60)
  ];
  const cat6Geom = new THREE.BufferGeometry().setFromPoints(cat6Points);
  const cat6Mat = new THREE.LineDashedMaterial({ color: 0x10b981, dashSize: 0.4, gapSize: 0.2 });
  const cat6Line = new THREE.Line(cat6Geom, cat6Mat);
  cat6Line.computeLineDistances();
  group.add(cat6Line);

  // 5. PORTERO VISOR IP Y AUTOMATIZACIÓN DE PORTÓN BASCULANTE
  const { portero, motorPorton } = WEAK_SIGNALS_DATA.porteroYPorton;

  const intercomMesh = new THREE.Mesh(
    new THREE.BoxGeometry(0.18, 0.28, 0.1),
    new THREE.MeshStandardMaterial({ color: 0x0284c7, emissive: 0x0369a1, emissiveIntensity: 0.6 })
  );
  intercomMesh.position.set(...portero.pos);
  intercomMesh.userData = {
    type: portero.type,
    name: portero.name,
    dimensions: "Frente IP PoE Antivandálico IP65 + Relé",
    costo: portero.costo,
    status: "Control de Acceso Smartphone",
    desc: portero.desc
  };
  group.add(intercomMesh);

  const gateMotorMesh = new THREE.Mesh(
    new THREE.BoxGeometry(0.32, 0.45, 0.25),
    new THREE.MeshStandardMaterial({ color: 0xf59e0b, emissive: 0xb45309, emissiveIntensity: 0.5 })
  );
  gateMotorMesh.position.set(...motorPorton.pos);
  gateMotorMesh.userData = {
    type: motorPorton.type,
    name: motorPorton.name,
    dimensions: "Motor 1/2 HP Apertura Rápida + Módulo Wi-Fi",
    costo: motorPorton.costo,
    status: "Automatización Vehicular",
    desc: motorPorton.desc
  };
  group.add(gateMotorMesh);

  // 6. ILUMINACIÓN NOCTURNA DOMÓTICA EN 3D (PointLight Cálidos 3000K — Automáticos >= 18:00 hs)
  const warmBulbMat = new THREE.MeshBasicMaterial({ color: 0xffd27d });

  WEAK_SIGNALS_DATA.lucesDomoticasNocturnas.forEach((luz) => {
    const lightFixtureGroup = new THREE.Group();
    lightFixtureGroup.position.set(...luz.pos);

    const bulbMesh = new THREE.Mesh(new THREE.SphereGeometry(0.13, 12, 12), warmBulbMat.clone());
    lightFixtureGroup.add(bulbMesh);

    const pointLight = new THREE.PointLight(0xffb86c, 0, luz.distance, 1.6);
    pointLight.castShadow = false;
    lightFixtureGroup.add(pointLight);

    lightFixtureGroup.userData = {
      type: "domotica_luz",
      name: luz.name,
      dimensions: "LED Cálido 3000K • Relé Domótico Astro-Timer",
      costo: "Kit 6 Microcontroladores: 1.920.000 Gs. (Partida 12.6)",
      status: "Encendido Automático >= 18:00 hs",
      desc: "Se activa automáticamente al atardecer sobre el Río Paraguay mediante programación astronómica o escena desde el smartphone."
    };

    domoticLights.push({
      pointLight,
      bulbMesh,
      maxIntensity: luz.intensity
    });

    group.add(lightFixtureGroup);
  });

  group.userData.updateDomoticLighting = (hour) => {
    const isNightOrDusk = hour >= 18.0 || hour <= 6.2;
    const isTwilight = hour >= 17.0 && hour < 18.0;
    const factor = isNightOrDusk ? 1.0 : isTwilight ? (hour - 17.0) : 0.0;

    domoticLights.forEach((item) => {
      item.pointLight.intensity = item.maxIntensity * factor;
      item.bulbMesh.material.color.setHex(factor > 0.1 ? 0xffd27d : 0x64748b);
    });
  };

  if (sceneGroups) {
    sceneGroups.weakSignals = group;
  }

  return {
    group,
    updateDomoticLighting: group.userData.updateDomoticLighting,
    data: WEAK_SIGNALS_DATA
  };
}

/**
 * Crea una etiqueta flotante 3D (Sprite Canvas de alta definición) para identificar agujeros en losa,
 * tableros, objetos eléctricos y cámaras sanitarias en los modos Electricista y Plomero.
 */
function createMepCalloutSprite(THREE, text, subtext, borderHex = '#f59e0b', bgHex = 'rgba(15, 23, 42, 0.92)') {
  if (typeof document === 'undefined') return null;
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  ctx.fillStyle = bgHex;
  ctx.strokeStyle = borderHex;
  ctx.lineWidth = 5;
  ctx.beginPath();
  if (ctx.roundRect) {
    ctx.roundRect(8, 8, 496, 112, 18);
  } else {
    ctx.rect(8, 8, 496, 112);
  }
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 26px Inter, system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(text, 256, 54);

  if (subtext) {
    ctx.fillStyle = borderHex;
    ctx.font = 'bold 20px JetBrains Mono, monospace';
    ctx.fillText(subtext, 256, 92);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  const mat = new THREE.SpriteMaterial({
    map: tex,
    transparent: true,
    depthTest: false,
    depthWrite: false
  });
  const sprite = new THREE.Sprite(mat);
  sprite.scale.set(2.35, 0.58, 1);
  sprite.renderOrder = 999;
  return sprite;
}

/**
 * Construye la Capa 3D Interactiva de Ingeniería MEP con Separación Disciplinaria:
 * - `electricalSubGroup`: Agujeros en Losa #1 y #2 (Sobre Losa Maciza L4), Pilar ANDE + Jabalina, Tableros DIN,
 *   9 Cajas Octogonales Embutidas en Losa + Luminarias LED, 3 Equipos Split AA Inverter, Termocalefón 80L (20A),
 *   26 Enchufes (20A/16A), 7 Llaves Zigbee/3-Way y Electroductos 100% Ortogonales (90°).
 * - `plumbingSubGroup`: Agujeros en Losa #3, #3B y #4 (Sobre Losa Maciza L4), Medidor ESSAP, Agua Fría PPR Ø25mm,
 *   Agua Caliente PPR Ø20mm, Termocalefón 80L, Columna Cloacal Vertical PVC Ø100mm + Ventilación Ø75mm a los 4 vientos,
 *   Cámara Desgrasadora, Cámara de Inspección, Cámara Séptica Bicameral 1500L y Pozo Ciego Absorbente Ø1.80m.
 */
export function buildConduitsOutletsAndPlumbingLayer(THREE, sceneGroups) {
  const group = (sceneGroups && sceneGroups.ductosYEnchufes) ? sceneGroups.ductosYEnchufes : new THREE.Group();
  group.clear();

  const electricalSubGroup = new THREE.Group();
  electricalSubGroup.name = 'mep_electrical_subgroup';
  const plumbingSubGroup = new THREE.Group();
  plumbingSubGroup.name = 'mep_plumbing_subgroup';
  group.add(electricalSubGroup);
  group.add(plumbingSubGroup);

  let mainBoardDinLedMesh = null;
  let mainBoardBoxMesh = null;

  // Generador de tuberías/electroductos 100% ORTOGONALES (tramos rectos con codos a 90°, cero diagonales curvas)
  const addOrthogonalPipePath = (pointsVec3, radius, colorHex, meta, targetSubGroup = electricalSubGroup) => {
    if (!pointsVec3 || pointsVec3.length < 2) return null;
    const pipeGroup = new THREE.Group();
    const mat = new THREE.MeshStandardMaterial({
      color: colorHex,
      emissive: colorHex,
      emissiveIntensity: 0.22,
      roughness: 0.28,
      metalness: 0.3
    });

    for (let i = 0; i < pointsVec3.length - 1; i++) {
      const p1 = pointsVec3[i];
      const p2 = pointsVec3[i + 1];
      const dist = p1.distanceTo(p2);
      if (dist < 0.005) continue;

      const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
      const cylGeom = new THREE.CylinderGeometry(radius, radius, dist, 10);
      const cylMesh = new THREE.Mesh(cylGeom, mat);
      cylMesh.position.copy(mid);

      const dir = new THREE.Vector3().subVectors(p2, p1).normalize();
      const up = new THREE.Vector3(0, 1, 0);
      if (Math.abs(dir.dot(up)) > 0.999) {
        if (dir.y < 0) cylMesh.rotation.x = Math.PI;
      } else {
        cylMesh.quaternion.setFromUnitVectors(up, dir);
      }
      cylMesh.userData = meta;
      pipeGroup.add(cylMesh);

      const elbowMesh = new THREE.Mesh(new THREE.SphereGeometry(radius * 1.28, 10, 10), mat);
      elbowMesh.position.copy(p2);
      elbowMesh.userData = meta;
      pipeGroup.add(elbowMesh);
    }

    const startCap = new THREE.Mesh(new THREE.SphereGeometry(radius * 1.28, 10, 10), mat);
    startCap.position.copy(pointsVec3[0]);
    startCap.userData = meta;
    pipeGroup.add(startCap);

    pipeGroup.userData = meta;
    targetSubGroup.add(pipeGroup);

    // Curva lineal de tensión 0 para que las esferas animadas sigan el ángulo recto exacto
    const curve = new THREE.CatmullRomCurve3(pointsVec3, false, 'catmullrom', 0.0);
    return { mesh: pipeGroup, curve };
  };

  // ==========================================================================
  // 1. AGUJEROS / PASES EN LOSA 1 (Y = 0.00m, Losa Maciza L4) Y LOSA 2 (Y = +2.88m)
  // ==========================================================================
  const buildSlabHoleSleeve = (
    pos,
    diametroMm,
    colorHex,
    paseMeta,
    labelTitle,
    labelSub,
    targetSubGroup,
    badgeOffset = [0, 0.58, 0]
  ) => {
    const paseGroup = new THREE.Group();
    paseGroup.position.set(...pos);

    const outerRadius = Math.max(0.085, (diametroMm / 1000) * 1.35);
    // Camisa exterior de pase en la losa
    const sleeveMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(outerRadius, outerRadius, 0.34, 24),
      new THREE.MeshStandardMaterial({
        color: colorHex,
        emissive: colorHex,
        emissiveIntensity: 0.6,
        roughness: 0.25,
        metalness: 0.35
      })
    );
    paseGroup.add(sleeveMesh);

    // Hueco interior oscuro que muestra visualmente la perforación de la losa
    const boreHole = new THREE.Mesh(
      new THREE.CylinderGeometry(outerRadius * 0.72, outerRadius * 0.72, 0.36, 20),
      new THREE.MeshBasicMaterial({ color: 0x020617 })
    );
    paseGroup.add(boreHole);

    // Anillos de sellado superior e inferior sobre las caras de la losa
    [0.14, -0.14].forEach((ry) => {
      const collarRing = new THREE.Mesh(
        new THREE.TorusGeometry(outerRadius * 1.45, 0.022, 12, 24),
        new THREE.MeshBasicMaterial({ color: 0xfef08a })
      );
      collarRing.rotation.x = Math.PI / 2;
      collarRing.position.y = ry;
      paseGroup.add(collarRing);
    });

    if (labelTitle) {
      const badge = createMepCalloutSprite(
        THREE,
        labelTitle,
        labelSub,
        '#' + colorHex.toString(16).padStart(6, '0')
      );
      if (badge) {
        badge.position.set(badgeOffset[0] || 0, badgeOffset[1] || 0.58, badgeOffset[2] || 0);
        paseGroup.add(badge);
      }
    }

    paseGroup.userData = paseMeta;
    paseGroup.traverse((ch) => {
      if (ch.isMesh) ch.userData = paseMeta;
    });
    targetSubGroup.add(paseGroup);
  };

  (DUCTOS_PASES_ENCHUFES_DATOS.pasesLosa1Diamantados || []).forEach((pase, idx) => {
    const isPlumbingPase = pase.id.includes('CLOACA') || pase.id.includes('AGUA');
    const targetSub = isPlumbingPase ? plumbingSubGroup : electricalSubGroup;
    const isEven = idx % 2 === 1;
    const badgeOffsetL1 = isEven ? [0.65, 0.30, 0] : [-0.65, 0.78, 0];
    const badgeOffsetL2 = isEven ? [0.65, 0.28, 0] : [-0.65, 0.74, 0];

    const paseMetaLosa1 = {
      type: 'pase_losa1_diamantado',
      bankCategory: 'refaccion_amarillo',
      name: `${pase.codigo} (Losa 1 PB) — ${pase.nombre}`,
      dimensions: `Perforación Diamantada Ø ${pase.diametroMm} mm en Losa Maciza L4 • ${pase.ejeRef}`,
      costo: 'Incluido en Perforaciones con Copa Diamantada (Gs. 280.000 c/u)',
      status: 'Agujero Real en Losa Maciza L4 (Cero Corte de Vigas) 💎🕳️',
      desc: `${pase.conductores} Método: ${pase.metodoEjecucion}`
    };

    buildSlabHoleSleeve(
      pase.pos3D,
      pase.diametroMm,
      pase.colorHex,
      paseMetaLosa1,
      `🕳️ ${pase.codigo} EN LOSA 1`,
      `Losa Maciza L4 (x=${pase.pos3D[0].toFixed(2)}m, z=${pase.pos3D[2].toFixed(2)}m)`,
      targetSub,
      badgeOffsetL1
    );

    if (Array.isArray(pase.posLosa2)) {
      const paseMetaLosa2 = {
        ...paseMetaLosa1,
        name: `${pase.codigo} (Losa 2 PA) — Camisa de Pase Vertical a Planta Alta (+2.88m)`,
        status: 'Camisa Prevista en Encofrado de Losa 2do Piso 🕳️⬆️'
      };
      buildSlabHoleSleeve(
        pase.posLosa2,
        pase.diametroMm,
        pase.colorHex,
        paseMetaLosa2,
        `🕳️ ${pase.codigo} EN LOSA 2`,
        `Planta Alta +2.88m (Alineado Vertical)`,
        targetSub,
        badgeOffsetL2
      );
    }
  });

  // Pase adicional #3B en Losa 2 (Y = +2.88m) para la descarga del SSHH 2 PA (x = -2.15m, z = 3.28m)
  buildSlabHoleSleeve(
    [-2.15, 2.88, 3.28],
    115,
    0xd97706,
    {
      type: 'pase_losa1_diamantado',
      bankCategory: 'nuevo_rojo',
      name: 'PASE #3B (Ø 115 mm en Losa 2) — Bajada Cloacal SSHH 2 Planta Alta',
      dimensions: 'Camisa PVC Ø 115mm en Losa 2 (x = -2.15m, z = 3.28m)',
      status: 'Desagüe Inodoro/Ducha SSHH 2 PA hacia Colector Húmedo Eje G 🕳️♻️',
      desc: 'Permite bajar el desagüe del baño secundario de Planta Alta (SSHH 2) sobre el muro húmedo frontal Eje G y unificarlo hacia la Columna Cloacal Principal en Pase #3.'
    },
    '🕳️ PASE #3B EN LOSA 2',
    'Bajada Cloacal SSHH 2 PA (x=-2.15m)',
    plumbingSubGroup
  );

  // ==========================================================================
  // 2. TABLEROS ELÉCTRICOS, PILAR ANDE + JABALINA Y MEDIDOR ESSAP
  // ==========================================================================
  (DUCTOS_PASES_ENCHUFES_DATOS.tablerosYEquiposPrincipales || []).forEach((eq) => {
    const isEssap = eq.id === 'HID_MEDIDOR_ESSAP';
    const targetSub = isEssap ? plumbingSubGroup : electricalSubGroup;
    const eqGroup = new THREE.Group();
    eqGroup.position.set(...eq.pos3D);

    if (isEssap) {
      const meterBase = new THREE.Mesh(
        new THREE.BoxGeometry(0.46, 0.24, 0.34),
        new THREE.MeshStandardMaterial({ color: 0x0284c7, emissive: 0x0369a1, emissiveIntensity: 0.45, roughness: 0.25 })
      );
      eqGroup.add(meterBase);
      const badge = createMepCalloutSprite(THREE, '💧 MEDIDOR ESSAP ¾"', 'Entrada Agua Directa (x=-3.85m)', '#38bdf8');
      if (badge) {
        badge.position.set(0, 0.65, 0);
        eqGroup.add(badge);
      }
    } else {
      const isMainBoard = eq.id === 'TAB_TP_PB';
      const boxW = isMainBoard ? 0.48 : 0.36;
      const boxH = isMainBoard ? 0.58 : 0.42;
      const boxD = 0.16;

      const boardBox = new THREE.Mesh(
        new THREE.BoxGeometry(boxW, boxH, boxD),
        new THREE.MeshStandardMaterial({
          color: 0x1e293b,
          emissive: eq.colorHex,
          emissiveIntensity: 0.4,
          roughness: 0.22,
          metalness: 0.65
        })
      );
      eqGroup.add(boardBox);

      const dinLed = new THREE.Mesh(
        new THREE.BoxGeometry(boxW * 0.76, 0.07, 0.02),
        new THREE.MeshBasicMaterial({ color: 0x22c55e })
      );
      dinLed.position.set(0, boxH * 0.22, boxD / 2 + 0.01);
      eqGroup.add(dinLed);

      if (isMainBoard) {
        mainBoardDinLedMesh = dinLed;
        mainBoardBoxMesh = boardBox;
      }

      const shortTitle = eq.id === 'TAB_PILASTRA_ANDE'
        ? '⚡ PILAR ANDE 3×40A + TIERRA'
        : eq.id === 'TAB_TP_PB'
          ? '⚡ TABLERO TP-PB (36 DIN)'
          : eq.id === 'TAB_TS_PA'
            ? '⚡ SUBTABLERO TS-PA (2do Piso)'
            : '⚡ SUBTABLERO TS-SUB (Subsuelo)';
      const shortSub = eq.id === 'TAB_PILASTRA_ANDE'
        ? 'Acometida Trifásica + Jabalina'
        : `Sobre Losa Maciza L4 (x=${eq.pos3D[0].toFixed(2)}m)`;
      const badge = createMepCalloutSprite(THREE, shortTitle, shortSub, '#f59e0b');
      if (badge) {
        badge.position.set(0, boxH / 2 + 0.42, 0);
        eqGroup.add(badge);
      }
    }

    const eqMeta = {
      type: 'tablero_o_equipo_mep',
      bankCategory: 'nuevo_rojo',
      name: `${eq.codigo} — ${eq.nombre}`,
      dimensions: `Nivel: ${eq.nivel}`,
      costo: eq.id.startsWith('TAB_')
        ? 'Compatible con Kit Compra China Riel DIN Zigbee/LAN (Gs. 2.365.000 lote completo)'
        : 'Conexión Directa ESSAP a Nivel de Calle',
      status: 'Monitoreo Activo y Prevención de Fallas ⚡💧',
      desc: eq.especificacion
    };
    eqGroup.userData = eqMeta;
    eqGroup.traverse((ch) => {
      if (ch.isMesh) ch.userData = eqMeta;
    });
    targetSub.add(eqGroup);
  });

  // Jabalina de Puesta a Tierra Copperweld Ø 5/8" × 2.40m + Cámara de Inspección junto al Pilar ANDE
  const groundRodGroup = new THREE.Group();
  groundRodGroup.position.set(-3.85, -0.45, -3.55);
  const rodMesh = new THREE.Mesh(
    new THREE.CylinderGeometry(0.025, 0.025, 1.80, 12),
    new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.85, roughness: 0.2 })
  );
  rodMesh.position.y = -0.60;
  groundRodGroup.add(rodMesh);
  const groundBox = new THREE.Mesh(
    new THREE.BoxGeometry(0.32, 0.25, 0.32),
    new THREE.MeshStandardMaterial({ color: 0x22c55e, roughness: 0.4 })
  );
  groundRodGroup.add(groundBox);
  groundRodGroup.userData = {
    type: 'puesta_a_tierra_ande',
    bankCategory: 'nuevo_rojo',
    name: 'PAT-01: Jabalina Copperweld Ø 5/8" × 2.40m + Cámara de Inspección',
    dimensions: 'Conductor Verde/Amarillo 10 mm² • R < 10 Ω s/ Norma ANDE/INTN',
    status: 'Protección de Vida y Descarga de DPS Clase II 🟢⚡',
    desc: 'Conectada directamente al borne de tierra del Pilar ANDE y del Tablero Principal TP-PB para derivar rayos/sobretensiones y habilitar el disparo de los 3 disyuntores diferenciales 30mA.'
  };
  groundRodGroup.traverse((c) => { if (c.isMesh) c.userData = groundRodGroup.userData; });
  electricalSubGroup.add(groundRodGroup);

  // ==========================================================================
  // 3. OBJETOS ELÉCTRICOS DE LA CASA EN 3D (CAJAS OCTOGONALES EN LOSA, LUMINARIAS LED, 3 SPLITS AA, TERMOCALEFÓN 80L)
  // ==========================================================================
  const octagonBoxesInSlabs = [
    // Bajo Losa 2 (Iluminación Planta Baja en Y = +2.80m)
    { id: 'OCT-PB-ESTAR', name: 'Caja Octogonal en Losa + Plafón LED Estar Social PB', pos: [-2.20, 2.80, 6.60], swPos: [-0.20, 1.15, 3.12] },
    { id: 'OCT-PB-COCINA', name: 'Caja Octogonal en Losa + Plafón LED Cocina Integrada PB (Losa L4)', pos: [2.55, 2.80, 4.25], swPos: [1.69, 1.15, 4.85] },
    { id: 'OCT-PB-COMEDOR', name: 'Caja Octogonal en Losa + Luminaria Colgante Comedor PB (Losa L4)', pos: [1.80, 2.80, 7.80], swPos: [1.69, 1.15, 4.85] },
    { id: 'OCT-PB-BANO', name: 'Caja Octogonal en Losa + Plafón LED Baño Social PB (Losa L4)', pos: [1.05, 2.80, 3.90], swPos: [1.69, 1.15, 4.85] },
    { id: 'OCT-PB-GALERIA', name: 'Caja Octogonal en Losa + Plafón LED Galería Panorámica L1', pos: [1.50, 2.80, 11.45], swPos: [-0.20, 1.15, 3.12] },
    // Bajo Techo Isopanel (Iluminación Planta Alta en Y = +5.48m)
    { id: 'OCT-PA-SUITE', name: 'Caja Octogonal + Plafón LED Dormitorio Principal en Suite PA (+X)', pos: [2.60, 5.48, 7.45], swPos: [0.30, 4.05, 5.35] },
    { id: 'OCT-PA-DORM2', name: 'Caja Octogonal + Plafón LED Dormitorio 2 Central PA', pos: [-0.75, 5.48, 7.80], swPos: [0.30, 4.05, 5.35] },
    { id: 'OCT-PA-DESK', name: 'Caja Octogonal + Panel LED Escritorio Extendido PA (-X)', pos: [-3.30, 5.48, 10.60], swPos: [-3.84, 4.05, 8.85] },
    // Bajo Losa Maciza L4 (Iluminación Subsuelo en Y = -0.08m)
    { id: 'OCT-SUB-SALON', name: 'Caja Octogonal bajo Losa 1 + Tortuga LED Subsuelo y Lavadero', pos: [1.50, -0.08, 6.40], swPos: [3.84, -1.15, 8.80] }
  ];

  octagonBoxesInSlabs.forEach((oct) => {
    const octGroup = new THREE.Group();
    octGroup.position.set(...oct.pos);

    const octBox = new THREE.Mesh(
      new THREE.CylinderGeometry(0.14, 0.14, 0.08, 8),
      new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.5, roughness: 0.3 })
    );
    octGroup.add(octBox);

    const ledDisk = new THREE.Mesh(
      new THREE.CylinderGeometry(0.24, 0.24, 0.04, 20),
      new THREE.MeshBasicMaterial({ color: 0xfef08a })
    );
    ledDisk.position.y = -0.05;
    octGroup.add(ledDisk);

    const octMeta = {
      type: 'caja_octogonal_losa_luminaria',
      bankCategory: 'nuevo_rojo',
      name: `[${oct.id}] ${oct.name}`,
      dimensions: 'Caja Octogonal Metálica Pesada 4" en Losa + Luminaria LED Cálida 3000K',
      status: 'Centro de Iluminación Embutido en Losa 💡',
      desc: 'Caja octogonal fijada al diseño de la losa que recibe los electroductos ortogonales de iluminación y baja verticalmente hacia las llaves interruptoras.'
    };
    octGroup.userData = octMeta;
    octGroup.traverse((c) => { if (c.isMesh) c.userData = octMeta; });
    electricalSubGroup.add(octGroup);
  });

  // 3 Equipos Split Aire Acondicionado Inverter (Objetos Eléctricos de Climatización Fase R)
  const splitUnits = [
    {
      id: 'SPLIT-PB-ESTAR',
      name: 'Equipo Split Inverter 18.000 BTU — Estar Social / Comedor PB (Fase R)',
      pos: [-3.68, 2.42, 6.60],
      rotY: Math.PI / 2,
      label: '❄️ SPLIT AA 18.000 BTU (Estar PB)'
    },
    {
      id: 'SPLIT-PA-SUITE',
      name: 'Equipo Split Inverter 12.000 BTU — Dormitorio Principal en Suite PA (+X, Fase R)',
      pos: [4.68, 5.18, 7.45],
      rotY: -Math.PI / 2,
      label: '❄️ SPLIT AA 12.000 BTU (Suite PA)'
    },
    {
      id: 'SPLIT-PA-DESK',
      name: 'Equipo Split Inverter 12.000 BTU — Escritorio Extendido y Dormitorio 2 PA (-X, Fase R)',
      pos: [-4.68, 5.18, 10.80],
      rotY: Math.PI / 2,
      label: '❄️ SPLIT AA 12.000 BTU (Desk PA)'
    }
  ];

  splitUnits.forEach((sp) => {
    const spGroup = new THREE.Group();
    spGroup.position.set(...sp.pos);
    spGroup.rotation.y = sp.rotY;

    const unitBody = new THREE.Mesh(
      new THREE.BoxGeometry(0.88, 0.28, 0.22),
      new THREE.MeshStandardMaterial({ color: 0xf8fafc, emissive: 0xa855f7, emissiveIntensity: 0.25, roughness: 0.2 })
    );
    spGroup.add(unitBody);

    const displayLed = new THREE.Mesh(
      new THREE.BoxGeometry(0.18, 0.05, 0.02),
      new THREE.MeshBasicMaterial({ color: 0x38bdf8 })
    );
    displayLed.position.set(0.25, -0.04, 0.12);
    spGroup.add(displayLed);

    const badge = createMepCalloutSprite(THREE, sp.label, 'Circuito Dedicado 20A (Fase R)', '#c084fc');
    if (badge) {
      badge.position.set(0, 0.45, 0);
      spGroup.add(badge);
    }

    const spMeta = {
      type: 'objeto_electrico_split_aa',
      bankCategory: 'nuevo_rojo',
      name: sp.name,
      dimensions: 'Evaporadora Interior + Caja de Pre-Avance + Toma 20A Cable 4mm² + Desagüe Condensado Ø25mm',
      status: 'Objeto Eléctrico de Climatización (Fase R Independiente) ❄️⚡',
      desc: 'Conectado a la Fase R exclusiva del Tablero DIN y con desagüe de condensado embutido hacia las columnas pluviales.'
    };
    spGroup.userData = spMeta;
    spGroup.traverse((c) => { if (c.isMesh) c.userData = spMeta; });
    electricalSubGroup.add(spGroup);
  });

  // Termocalefón Eléctrico de 80 Litros (2000W) en el Muro Húmedo Eje G (Visible tanto en Electricista como en Plomero)
  const buildWaterHeater80L = (targetSub, isElec) => {
    const whGroup = new THREE.Group();
    whGroup.position.set(0.95, 4.75, 3.25);

    const tankMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.22, 0.22, 0.78, 20),
      new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: isElec ? 0xf97316 : 0xef4444,
        emissiveIntensity: 0.3,
        roughness: 0.2,
        metalness: 0.2
      })
    );
    whGroup.add(tankMesh);

    const badge = createMepCalloutSprite(
      THREE,
      '🔥 TERMOCALEFÓN 80L (2000W)',
      isElec ? 'Circuito 20A sobre Pase #4 (x=+0.95m)' : 'Agua Caliente PPR Ø20mm a Baños y Cocina',
      '#f97316'
    );
    if (badge) {
      badge.position.set(0, 0.65, 0);
      whGroup.add(badge);
    }

    const whMeta = {
      type: 'objeto_mep_termocalefon',
      bankCategory: 'nuevo_rojo',
      name: 'Termocalefón Acumulador 80 Litros (2000W) en Muro Húmedo Eje G',
      dimensions: 'Tanque Esmaltado 80L • Alimentación Eléctrica 20A + Entrada Agua Fría Ø25mm y Salida Caliente Ø20mm',
      status: 'Objeto Eléctrico e Hidrosanitario Unificado en Núcleo Húmedo 🔥💧',
      desc: 'Ubicado en Planta Alta sobre el Muro Húmedo Eje G (x=+0.95m, z=3.25m), exactamente arriba del Pase Diamantado #4 en la Losa Maciza L4. Provee agua caliente a Baño en Suite, SSHH 2 y baja directo a la Bacha de Cocina PB.'
    };
    whGroup.userData = whMeta;
    whGroup.traverse((c) => { if (c.isMesh) c.userData = whMeta; });
    targetSub.add(whGroup);
  };
  buildWaterHeater80L(electricalSubGroup, true);
  buildWaterHeater80L(plumbingSubGroup, false);

  // ==========================================================================
  // 4. TRAZADO 100% ORTOGONAL DE ELECTRODUCTOS SIGUIENDO EL DISEÑO DE LA LOSA
  // ==========================================================================
  // 4.1 Alimentador Subterráneo ANDE (Pilar ANDE x=-3.85, z=-4.08 → PASE #1 en Losa Maciza L4 x=-0.45, z=4.78 → TP-PB)
  const trunkRoute = addOrthogonalPipePath(
    [
      new THREE.Vector3(-3.85, 1.45, -4.08),
      new THREE.Vector3(-3.85, -0.55, -4.08),
      new THREE.Vector3(-3.85, -0.55, 2.85),
      new THREE.Vector3(-0.45, -0.55, 2.85),
      new THREE.Vector3(-0.45, -0.55, 4.78),
      new THREE.Vector3(-0.45, 0.00, 4.78), // Atraviesa PASE #1 en Losa Maciza L4
      new THREE.Vector3(-0.45, 1.55, 4.78)  // Llega a Tablero Principal TP-PB
    ],
    0.032,
    0xf59e0b,
    {
      type: 'ducto_electrico_troncal',
      bankCategory: 'nuevo_rojo',
      name: 'Alimentador Subterráneo Trifásico ANDE (Pilar ANDE → Pase Diamantado #1 en Losa Maciza L4 → TP-PB)',
      dimensions: 'Cable Subterráneo NYY 4×10 mm² + Tierra 10 mm² en Caño PVC Pesado Ø 50mm',
      status: 'Acometida Principal 3×380/220V en Ángulo Recto ⚡',
      desc: 'Baja desde el Pilar ANDE junto al portón (x=-3.85m), corre ortogonalmente enterrado bajo la cochera y sube por el Pase Diamantado #1 en la Losa Maciza L4 (x=-0.45m, z=4.78m) hasta el Tablero TP-PB.'
    },
    electricalSubGroup
  );

  // 4.2 Columna Montante Eléctrica Vertical 100% Recta (TS-SUB ↔ Pase #1 Losa 1 ↔ TP-PB ↔ Pase #1 Losa 2 ↔ TS-PA)
  const riserRoute = addOrthogonalPipePath(
    [
      new THREE.Vector3(-0.45, -0.95, 4.78), // TS-SUB Subsuelo
      new THREE.Vector3(-0.45, 0.00, 4.78),  // Pase #1 Losa 1 (Losa Maciza L4)
      new THREE.Vector3(-0.45, 1.55, 4.78),  // TP-PB Planta Baja
      new THREE.Vector3(-0.45, 2.88, 4.78),  // Pase #1 Losa 2
      new THREE.Vector3(-0.45, 4.35, 4.78)   // TS-PA Planta Alta
    ],
    0.028,
    0xef4444,
    {
      type: 'ducto_electrico_montante',
      bankCategory: 'nuevo_rojo',
      name: 'Columna Montante Eléctrica 100% Vertical (TS-SUB ↔ Pase #1 Losa 1 ↔ TP-PB ↔ Pase #1 Losa 2 ↔ TS-PA)',
      dimensions: 'Conductores Antiflama 5×6 mm² en Pleno Vertical Único (x = -0.45m, z = 4.78m)',
      status: 'Columna Vertebral Eléctrica sobre Losa Maciza L4 🎯',
      desc: 'Une en línea recta vertical los 3 tableros de la casa atravesando los agujeros previstos en la Losa Maciza L4 (Y=0.00m) y en la Losa 2 (Y=+2.88m).'
    },
    electricalSubGroup
  );

  // 4.3 Circuito Fase S (Cocina 20A sobre Losa Maciza L4 Este: Mesada Eje G, Isla, Microondas y Heladera)
  const pbKitchenRoute1 = addOrthogonalPipePath(
    [
      new THREE.Vector3(-0.45, 1.55, 4.78),
      new THREE.Vector3(-0.45, 0.035, 4.78),
      new THREE.Vector3(2.15, 0.035, 4.78),
      new THREE.Vector3(2.15, 0.035, 3.12),
      new THREE.Vector3(2.15, 1.12, 3.12),  // Toma 20A Air Fryer
      new THREE.Vector3(3.35, 1.12, 3.12),  // Toma 20A Microondas/Horno
      new THREE.Vector3(3.05, 1.12, 3.12),
      new THREE.Vector3(3.05, 1.95, 3.12)   // Toma Campana Extractora
    ],
    0.018,
    0xf97316,
    {
      type: 'ducto_carpeta_pb',
      bankCategory: 'nuevo_rojo',
      name: 'Electroducto Ortogonal Fase S (Cocina 20A sobre Losa Maciza L4 Este) — Mesada, Air Fryer, Horno y Campana',
      dimensions: 'Caño Corrugado ¾" + Cable 4 mm² embutido en Carpeta de 5cm sobre Losa Maciza L4',
      status: 'Circuito Dedicado 20A Cocina (Lado Este +X) ✨',
      desc: 'Corre a 90° por la carpeta de nivelación sobre la Losa Maciza L4 hacia el muro húmedo de la Cocina Integrada (x = +1.69..+3.84m).'
    },
    electricalSubGroup
  );

  const pbKitchenRoute2 = addOrthogonalPipePath(
    [
      new THREE.Vector3(2.15, 0.035, 4.78),
      new THREE.Vector3(2.45, 0.035, 4.78),
      new THREE.Vector3(2.45, 0.035, 4.95),
      new THREE.Vector3(2.45, 0.85, 4.95),  // Isla de Cocina
      new THREE.Vector3(2.45, 0.035, 4.95),
      new THREE.Vector3(3.74, 0.035, 4.95),
      new THREE.Vector3(3.74, 0.035, 4.30),
      new THREE.Vector3(3.74, 0.65, 4.30),  // Heladera en muro Este
      new THREE.Vector3(3.74, 0.035, 4.30),
      new THREE.Vector3(3.74, 0.035, 7.80),
      new THREE.Vector3(3.74, 0.35, 7.80)   // Toma Comedor / Biblioteca #1
    ],
    0.018,
    0xf97316,
    {
      type: 'ducto_carpeta_pb',
      bankCategory: 'nuevo_rojo',
      name: 'Electroducto Ortogonal Cocina/Comedor (Losa Maciza L4) — Isla, Heladera y Comedor Principal',
      dimensions: 'Caño ¾" por Carpeta sobre Losa Maciza L4 (Cero Picado de Hormigón)',
      status: 'Distribución Ortogonal en Carpeta PB ✨',
      desc: 'Alimenta la Isla desayunadora, la Heladera y el Comedor Principal sobre el sector Este (Losa L4).'
    },
    electricalSubGroup
  );

  // 4.4 Circuito Fase T (Iluminación por Cajas Octogonales en Losa + Tomas de Estar Social y Escaleras)
  const pbLightsRoute1 = addOrthogonalPipePath(
    [
      new THREE.Vector3(-0.45, 1.55, 4.78),
      new THREE.Vector3(-0.45, 2.80, 4.78), // Sube a Losa 2 para distribuir por cajas octogonales de techo
      new THREE.Vector3(-2.20, 2.80, 4.78),
      new THREE.Vector3(-2.20, 2.80, 6.60), // Caja Octogonal Estar Social
      new THREE.Vector3(-3.74, 2.80, 6.60),
      new THREE.Vector3(-3.74, 0.60, 6.60), // Baja vertical a Toma TV 32" en Muro Oeste
      new THREE.Vector3(-3.74, 0.35, 6.60),
      new THREE.Vector3(-3.74, 0.35, 4.10)  // Toma Purificador Acceso Oeste
    ],
    0.018,
    0x38bdf8,
    {
      type: 'ducto_carpeta_pb',
      bankCategory: 'nuevo_rojo',
      name: 'Electroducto Ortogonal Fase T — Cajas Octogonales en Losa, Estar Social (Oeste) y Rack TV 32"',
      dimensions: 'Caño ¾" embutido en Losa y Muro Oeste (x = -3.74m)',
      status: 'Red de Iluminación y Tomas Estar Social 💡🔌',
      desc: 'Recorre ortogonalmente las cajas octogonales de losa y baja verticalmente por el muro del Estar Social hacia el Rack de TV 32" y las llaves 3-Way.'
    },
    electricalSubGroup
  );

  const pbCeilingLightsGrid = addOrthogonalPipePath(
    [
      new THREE.Vector3(-0.45, 2.80, 4.78),
      new THREE.Vector3(1.05, 2.80, 4.78),
      new THREE.Vector3(1.05, 2.80, 3.90),  // Caja Octogonal Baño Social
      new THREE.Vector3(2.55, 2.80, 3.90),
      new THREE.Vector3(2.55, 2.80, 4.25),  // Caja Octogonal Cocina
      new THREE.Vector3(1.80, 2.80, 4.25),
      new THREE.Vector3(1.80, 2.80, 7.80),  // Caja Octogonal Comedor
      new THREE.Vector3(1.50, 2.80, 7.80),
      new THREE.Vector3(1.50, 2.80, 11.45), // Caja Octogonal Galería L1
      new THREE.Vector3(4.72, 2.80, 11.45),
      new THREE.Vector3(4.72, 0.45, 11.45)  // Toma IP55 Galería
    ],
    0.016,
    0x38bdf8,
    {
      type: 'ducto_losa_iluminacion',
      bankCategory: 'nuevo_rojo',
      name: 'Malla Ortogonal de Iluminación en Losa 2 (Centros Octogonales Baño Social, Cocina, Comedor y Galería)',
      dimensions: 'Caño Corrugado ¾" en Losa uniendo Cajas Octogonales y Llaves Zigbee c/ Neutro',
      status: 'Trazado en Losa Alineado a Centros de Luz 💡',
      desc: 'Conecta en ángulo recto las cajas octogonales de techo de Cocina, Baño Social, Comedor y Galería con sus llaves interruptoras.'
    },
    electricalSubGroup
  );

  // 4.5 Circuito Fase R (Climatización Split AA Inverter en PB y PA)
  const pbAcRoute = addOrthogonalPipePath(
    [
      new THREE.Vector3(-0.45, 1.55, 4.78),
      new THREE.Vector3(-0.45, 2.38, 4.78),
      new THREE.Vector3(-3.74, 2.38, 4.78),
      new THREE.Vector3(-3.74, 2.38, 6.60)  // Split AA 18.000 BTU Estar Social (Oeste)
    ],
    0.018,
    0xa855f7,
    {
      type: 'ducto_carpeta_pb',
      bankCategory: 'nuevo_rojo',
      name: 'Electroducto Ortogonal Fase R (Climatización) — Split Inverter 18.000 BTU Estar Social',
      dimensions: 'Caño ¾" + Conductores 4 mm² Independientes en Fase R',
      status: 'Fase R Dedicada a Aires Acondicionados ❄️⚡',
      desc: 'Alimenta de forma exclusiva el equipo Split de 18.000 BTU del Estar Social.'
    },
    electricalSubGroup
  );

  const paAcSuiteRoute = addOrthogonalPipePath(
    [
      new THREE.Vector3(-0.45, 4.35, 4.78), // TS-PA
      new THREE.Vector3(-0.45, 5.15, 4.78),
      new THREE.Vector3(4.72, 5.15, 4.78),
      new THREE.Vector3(4.72, 5.15, 7.45),  // Split AA 12.000 BTU Suite Principal (+X)
      new THREE.Vector3(-0.45, 5.15, 4.78),
      new THREE.Vector3(-4.72, 5.15, 4.78),
      new THREE.Vector3(-4.72, 5.15, 10.80) // Split AA 12.000 BTU Escritorio Extendido (-X)
    ],
    0.018,
    0xa855f7,
    {
      type: 'ducto_2dopiso',
      bankCategory: 'nuevo_rojo',
      name: 'Electroducto Ortogonal Fase R (2do Piso) — Splits AA Suite Principal (+X) y Escritorio Extendido (-X)',
      dimensions: 'Caño Ø ¾" + Cable 4 mm² desde Subtablero TS-PA',
      status: 'Climatización Inverter 2do Piso ❄️⚡',
      desc: 'Sale del Subtablero TS-PA y alimenta ortogonalmente el Split de la Suite Principal al Este (x=+4.72m) y el Split del Escritorio Extendido al Oeste (x=-4.72m).'
    },
    electricalSubGroup
  );

  // 4.6 Circuito 20A Núcleo Húmedo 2do Piso (Termocalefón 80L + Tomas Baño Suite y SSHH 2 sobre Eje G)
  const paWetCoreRoute = addOrthogonalPipePath(
    [
      new THREE.Vector3(-0.45, 4.35, 4.78), // TS-PA
      new THREE.Vector3(-0.45, 4.35, 3.22),
      new THREE.Vector3(0.95, 4.35, 3.22),
      new THREE.Vector3(0.95, 4.75, 3.22),  // Termocalefón 80L (20A)
      new THREE.Vector3(-0.35, 4.35, 3.22),
      new THREE.Vector3(-0.35, 4.05, 3.22)  // Toma Vanitory Baño Suite / SSHH 2
    ],
    0.018,
    0xf97316,
    {
      type: 'ducto_2dopiso',
      bankCategory: 'nuevo_rojo',
      name: 'Electroducto Ortogonal 20A Núcleo Húmedo 2do Piso — Termocalefón 80L y Vanitorys Eje G',
      dimensions: 'Caño Ø ¾" + Cable 4 mm² sobre Muro Húmedo Frontal Eje G (z = 3.22m)',
      status: 'Potencia 20A Termocalefón 80L y Baños PA 🔥⚡',
      desc: 'Conecta el Subtablero TS-PA con el Termocalefón de 80L (ubicado en x=+0.95m sobre el Pase #4) y los tomacorrientes de los baños superiores.'
    },
    electricalSubGroup
  );

  // 4.7 Circuito Tomas e Iluminación 2do Piso (Suite Principal al Este +X, Dormitorio 2 al Centro, Escritorio Extendido al Oeste -X)
  const paDeskLightsRoute = addOrthogonalPipePath(
    [
      new THREE.Vector3(-0.45, 4.35, 4.78), // TS-PA
      new THREE.Vector3(-0.45, 2.92, 4.78), // Baja a carpeta de Losa 2 (+2.92m)
      new THREE.Vector3(4.72, 2.92, 4.78),
      new THREE.Vector3(4.72, 2.92, 6.25),
      new THREE.Vector3(4.72, 3.55, 6.25),  // Mesa de Luz #1 Suite (+X)
      new THREE.Vector3(4.72, 3.55, 8.65),  // Mesa de Luz #2 Suite (+X)
      new THREE.Vector3(0.38, 2.92, 7.45),
      new THREE.Vector3(0.38, 3.65, 7.45),  // Tocador #1 Suite
      new THREE.Vector3(-1.72, 2.92, 8.15),
      new THREE.Vector3(-1.72, 3.55, 8.15), // Dormitorio 2 Central
      new THREE.Vector3(-4.72, 2.92, 8.15),
      new THREE.Vector3(-4.72, 2.92, 9.45),
      new THREE.Vector3(-4.72, 3.55, 9.45), // Máquina de Coser en Escritorio Extendido (-X)
      new THREE.Vector3(-4.72, 3.55, 11.40) // Escritorio Doble Extendido hasta Galería (-X)
    ],
    0.018,
    0x38bdf8,
    {
      type: 'ducto_2dopiso',
      bankCategory: 'nuevo_rojo',
      name: 'Electroducto Ortogonal 2do Piso (Por Carpeta de Losa 2) — Suite (+X), Dormitorio 2 y Escritorio Extendido (-X)',
      dimensions: 'Caño Ø ¾" embutido en Carpeta de Losa 2 (+2.92m) y Muros de Planta Alta',
      status: 'Distribución 2do Piso Alineada a Dormitorios y Desk 💡💻',
      desc: 'Recorre en ángulo recto la carpeta de la Losa 2 hacia las mesas de luz y tocador de la Suite Principal (Este +X), el Dormitorio 2 (Centro) y el Escritorio Extendido hasta la Galería (Oeste -X).'
    },
    electricalSubGroup
  );

  // 4.8 Circuitos de Subsuelo por Lateral de Viga Bajo Losa 1 (TS-SUB → Lavadero al Este +X y Parrillita al Oeste -X)
  const subPumpRoute = addOrthogonalPipePath(
    [
      new THREE.Vector3(-0.45, -0.95, 4.78), // TS-SUB
      new THREE.Vector3(-0.45, -0.22, 4.78), // Sube al lateral de viga bajo Losa 1
      new THREE.Vector3(1.50, -0.22, 4.78),
      new THREE.Vector3(1.50, -0.08, 6.40),  // Caja Octogonal Salón Subsuelo
      new THREE.Vector3(1.50, -0.22, 3.25),
      new THREE.Vector3(1.50, -1.25, 3.25)   // Toma Salón Subsuelo
    ],
    0.018,
    0x94a3b8,
    {
      type: 'ducto_subsuelo_viga',
      bankCategory: 'nuevo_rojo',
      name: 'Electroducto Galvanizado Daisa por Lateral de Viga bajo Losa 1 (Salón Subsuelo)',
      dimensions: 'Caño Galvanizado Ø ¾" engrapado al costado de vigas existentes (Y = -0.22m)',
      status: 'Trazado Ortogonal por Vigas sin Picar Losa 1 🎯',
      desc: 'Corre engrapado por el lateral de las vigas de hormigón bajo la Losa Maciza L4.'
    },
    electricalSubGroup
  );

  const subLaundryAndBbqRoute = addOrthogonalPipePath(
    [
      new THREE.Vector3(-0.45, -0.95, 4.78), // TS-SUB
      new THREE.Vector3(-0.45, -0.22, 4.78),
      new THREE.Vector3(4.72, -0.22, 4.78),
      new THREE.Vector3(4.72, -0.22, 6.40),
      new THREE.Vector3(4.72, -1.25, 6.40),  // Toma 20A Lavarropas en Lavadero (Muro Este Eje 1)
      new THREE.Vector3(-0.45, -0.22, 4.78),
      new THREE.Vector3(-3.20, -0.22, 4.78),
      new THREE.Vector3(-3.20, -0.22, 12.40),
      new THREE.Vector3(-3.20, -1.25, 12.40) // Toma Parrillita Subsuelo (Oeste hacia el Patio)
    ],
    0.018,
    0x94a3b8,
    {
      type: 'ducto_subsuelo_viga',
      bankCategory: 'nuevo_rojo',
      name: 'Electroducto Ortogonal Subsuelo — Lavadero 20A (Muro Este +X) y Parrillita (Oeste -X)',
      dimensions: 'Caño Galvanizado Ø ¾" + Cable 4 mm² por Vigas de Subsuelo',
      status: 'Circuito Dedicado Lavarropas + Quincho Inferior 🎯',
      desc: 'Alimenta el Lavarropas en la pared Este (bajo Escalera 1) y la Parrillita del Subsuelo en el sector Oeste mirando al patio.'
    },
    electricalSubGroup
  );

  // ==========================================================================
  // 5. RED HIDROSANITARIA 3D 100% ORTOGONAL EN `plumbingSubGroup` (ALINEADA A LOSA MACIZA L4 Y NÚCLEO HÚMEDO EJE G)
  // ==========================================================================
  // 5A. Agua Fría Directa ESSAP PPR PN20 Ø25mm (Azul): Medidor ESSAP (x=-3.85, z=-4.24) → PASE #4 en Losa Maciza L4 (x=+1.48, z=3.28)
  addOrthogonalPipePath(
    [
      new THREE.Vector3(-3.85, 0.08, -4.24), // Caja Medidor ESSAP
      new THREE.Vector3(-3.85, -0.45, -4.24),
      new THREE.Vector3(-3.85, -0.45, 2.85),
      new THREE.Vector3(1.48, -0.45, 2.85),
      new THREE.Vector3(1.48, -0.45, 3.28),
      new THREE.Vector3(1.48, 0.00, 3.28),   // Atraviesa PASE #4 en Losa Maciza L4
      new THREE.Vector3(1.48, 0.85, 3.28),
      new THREE.Vector3(2.35, 0.85, 3.28),   // Ramal Este → Bacha Doble Cocina PB (Losa L4)
      new THREE.Vector3(1.48, 0.85, 3.28),
      new THREE.Vector3(0.75, 0.85, 3.28),   // Ramal Oeste → Lavatorio e Inodoro Baño Social PB (Losa L4)
      new THREE.Vector3(1.48, 0.85, 3.28),
      new THREE.Vector3(1.48, 2.88, 3.28),   // Atraviesa PASE #4 en Losa 2 (+2.88m)
      new THREE.Vector3(1.48, 3.75, 3.28),
      new THREE.Vector3(0.95, 3.75, 3.28),
      new THREE.Vector3(0.95, 4.75, 3.28),   // Alimenta Termocalefón 80L
      new THREE.Vector3(0.95, 3.75, 3.28),
      new THREE.Vector3(-0.35, 3.75, 3.28),  // Alimenta Baño en Suite PA
      new THREE.Vector3(-2.65, 3.75, 3.28)   // Alimenta SSHH 2 PA
    ],
    0.024,
    0x0284c7,
    {
      type: 'tuberia_agua_fria_ppr',
      bankCategory: 'nuevo_rojo',
      name: 'Red Ortogonal de Agua Fría Directa ESSAP PPR PN20 Ø 25mm (Medidor → Pase #4 Losa Maciza L4 → Cocina, Baño Social y 2 Baños PA)',
      dimensions: 'Tubo PPR Tricapa Ø 25mm (¾") • Montante Vertical por Pase #4 (x = +1.48m, z = 3.28m)',
      status: 'Alimentación Directa en Ángulo Recto sobre Losa L4 💧',
      desc: 'Sube verticalmente por el Pase Diamantado #4 en el tabique húmedo entre Baño Social PB y Cocina PB (sobre la Losa Maciza L4), abasteciendo Cocina, Baño Social, Termocalefón 80L, Baño en Suite y SSHH 2.'
    },
    plumbingSubGroup
  );

  // Ramal Agua Fría Subsuelo (Desde bajo Pase #4 → Lavadero en Muro Este +X y Bacha Parrillita en Oeste -X)
  addOrthogonalPipePath(
    [
      new THREE.Vector3(1.48, -0.45, 3.28),
      new THREE.Vector3(4.55, -0.45, 3.28),
      new THREE.Vector3(4.55, -0.45, 6.40),
      new THREE.Vector3(4.55, -1.35, 6.40),  // Lavadero Subsuelo en Muro Este (Eje 1)
      new THREE.Vector3(4.55, -0.45, 6.40),
      new THREE.Vector3(-3.20, -0.45, 6.40),
      new THREE.Vector3(-3.20, -0.45, 12.40),
      new THREE.Vector3(-3.20, -1.35, 12.40) // Bacha Parrillita Subsuelo
    ],
    0.020,
    0x0284c7,
    {
      type: 'tuberia_agua_fria_ppr',
      bankCategory: 'nuevo_rojo',
      name: 'Ramal Ortogonal Agua Fría Subsuelo PPR Ø 20mm (Bajo Losa 1 → Lavadero Este +X y Parrillita Oeste -X)',
      dimensions: 'Tubo PPR PN20 Ø 20mm adosado bajo vigas de Losa 1',
      status: 'Provisión de Agua a Lavadero y Quincho Inferior 💧',
      desc: 'Deriva bajo el Pase #4 hacia el Lavadero ubicado en el muro Este (bajo Escalera 1) y hacia la bacha de la Parrillita en el contrafrente.'
    },
    plumbingSubGroup
  );

  // 5B. Agua Caliente Termofusión PPR PN20 Ø20mm (Rojo): Sale del Termocalefón 80L (x=+0.95, y=4.75, z=3.22) → Baño Suite, SSHH 2 y baja por Pase #4 a Cocina PB
  addOrthogonalPipePath(
    [
      new THREE.Vector3(0.95, 4.75, 3.20),   // Salida Termocalefón 80L
      new THREE.Vector3(0.95, 3.88, 3.20),
      new THREE.Vector3(-0.35, 3.88, 3.20),  // Ducha y Vanitory Baño en Suite PA
      new THREE.Vector3(-2.65, 3.88, 3.20),  // Ducha y Vanitory SSHH 2 PA
      new THREE.Vector3(1.42, 3.88, 3.20),
      new THREE.Vector3(1.42, 2.88, 3.20),   // Baja por PASE #4 en Losa 2
      new THREE.Vector3(1.42, 0.92, 3.20),
      new THREE.Vector3(2.35, 0.92, 3.20),   // Bacha Doble Cocina PB (Losa L4 Este)
      new THREE.Vector3(0.75, 0.92, 3.20)    // Lavatorio Baño Social PB
    ],
    0.020,
    0xdc2626,
    {
      type: 'tuberia_agua_caliente_ppr',
      bankCategory: 'nuevo_rojo',
      name: 'Red Ortogonal de Agua Caliente Termofusión PPR PN20 Ø 20mm (Termocalefón 80L → Baño Suite, SSHH 2 y Bacha Cocina PB por Pase #4)',
      dimensions: 'Tubo PPR PN20 Tricapa Térmico Ø 20mm sobre Muro Húmedo Eje G',
      status: 'Agua Caliente en los 2 Baños PA y Cocina PB 🔥🚿',
      desc: 'Distribución 100% concentrada en el Muro Húmedo Eje G (z=3.20m) que baja verticalmente por el Pase #4 hacia la Cocina y el Baño Social de Planta Baja.'
    },
    plumbingSubGroup
  );

  // 5C. Columna Montante Cloacal Vertical PVC Ø100mm (PASE #3 en x=+0.68, z=3.28 sobre Losa Maciza L4) + Ventilación Ø75mm a los 4 Vientos + Colector a Cámara Séptica y Pozo Ciego
  addOrthogonalPipePath(
    [
      new THREE.Vector3(0.68, 6.25, 3.28),   // Sombrerete de Ventilación Cloacal Ø75mm sobre el Techo Isopanel (+6.25m)
      new THREE.Vector3(0.68, 2.88, 3.28),   // PASE #3 en Losa 2 (Recibe Inodoro/Ducha Baño en Suite PA)
      new THREE.Vector3(0.68, 0.00, 3.28),   // PASE #3 en Losa Maciza L4 (Recibe Inodoro Baño Social PB)
      new THREE.Vector3(0.68, -2.20, 3.28),  // Pie de Columna Cloacal en Subsuelo con Curva a 45°/90°
      new THREE.Vector3(0.68, -2.30, 14.50), // Colector Principal bajo Subsuelo (Pendiente >2%) hacia Cámara de Inspección en Patio
      new THREE.Vector3(-2.20, -2.55, 16.50),// Cámara Séptica Bicameral 1.500 L
      new THREE.Vector3(-2.20, -3.10, 19.80) // Pozo Ciego Absorbente Ø 1.80m × 3.50m
    ],
    0.048,
    0xd97706,
    {
      type: 'columna_cloacal_y_ventilacion',
      bankCategory: 'nuevo_rojo',
      name: 'Columna Cloacal Vertical Principal PVC Ø 100mm por Pase #3 (Losa Maciza L4) + Ventilación a los 4 Vientos + Colector a Cámara Séptica',
      dimensions: 'PVC Reforzado Ø 100mm en x = +0.68m, z = 3.28m • Pendiente Colector > 2%',
      status: 'Columna Cloacal 100% Vertical por Agujero #3 en Losa L4 ♻️',
      desc: 'Baja en línea recta vertical desde el Baño en Suite PA y el Baño Social PB atravesando el Pase Diamantado #3 en la Losa Maciza L4, y corre con pendiente reglamentaria del 2% hacia la Cámara Séptica y el Pozo Ciego.'
    },
    plumbingSubGroup
  );

  // Ramal Cloacal de SSHH 2 PA (por Pase #3B en x=-2.15, z=3.28) + Desagüe Graso de Cocina PB y Lavadero Subsuelo hacia Cámara Desgrasadora
  addOrthogonalPipePath(
    [
      new THREE.Vector3(-2.15, 3.05, 3.28),  // Inodoro/Ducha SSHH 2 PA
      new THREE.Vector3(-2.15, 2.88, 3.28),  // Atraviesa PASE #3B en Losa 2
      new THREE.Vector3(-2.15, 2.62, 3.28),
      new THREE.Vector3(0.68, 2.62, 3.28)    // Empalma a la Columna Principal en x=+0.68m
    ],
    0.042,
    0xd97706,
    {
      type: 'ramal_cloacal_sshh2',
      bankCategory: 'nuevo_rojo',
      name: 'Ramal Cloacal Suspendido PVC Ø 100mm de SSHH 2 PA (Pase #3B → Columna Principal Pase #3)',
      dimensions: 'PVC Ø 100mm alojado en pleno de cielorraso del núcleo húmedo Eje G',
      status: 'Unificación de Ambos Baños PA en 1 Sola Bajada por Losa 1 ♻️',
      desc: 'Permite que el SSHH 2 de Planta Alta descargue hacia la misma columna montante principal de x=+0.68m sin perforar el sector de Loza Rap de Planta Baja.'
    },
    plumbingSubGroup
  );

  // Línea de Aguas Grises/Jabón/Grasa (Bacha Cocina PB en x=+2.35 + Lavadero Subsuelo en x=+4.55 → Cámara Desgrasadora → Cámara de Inspección)
  addOrthogonalPipePath(
    [
      new THREE.Vector3(2.35, 0.75, 3.28),   // Sifón Doble Bacha Cocina PB (Losa Maciza L4)
      new THREE.Vector3(2.35, 0.00, 3.28),
      new THREE.Vector3(2.35, -2.18, 3.28),
      new THREE.Vector3(2.35, -2.24, 6.40),
      new THREE.Vector3(4.55, -1.45, 6.40),  // Recibe descarga Lavarropas y Pileta de Lavadero (Muro Este Eje 1)
      new THREE.Vector3(2.35, -2.24, 6.40),
      new THREE.Vector3(2.35, -2.32, 13.80), // Cámara Desgrasadora (60×60cm)
      new THREE.Vector3(0.68, -2.35, 14.50)  // Empalma a Cámara de Inspección Principal
    ],
    0.032,
    0xf59e0b,
    {
      type: 'ramal_desgrasador_cocina_lavadero',
      bankCategory: 'nuevo_rojo',
      name: 'Ramal Exclusivo Cocina PB + Lavadero Subsuelo PVC Ø 50/75mm → Cámara Desgrasadora',
      dimensions: 'Caño PVC Ø 75mm con Trampa de Grasa y Espuma de Jabón',
      status: 'Protección de Permeabilidad del Pozo Ciego 🛡️♻️',
      desc: 'Separa las aguas con grasa de la Cocina (Este) y el jabón del Lavarropas (Subsuelo Este) llevándolas primero a la Cámara Desgrasadora antes de entrar a la Cámara Séptica.'
    },
    plumbingSubGroup
  );

  // Cámaras Sanitarias 3D en el Patio Trasero (Cámara Desgrasadora, Cámara de Inspección, Cámara Séptica Bicameral y Pozo Ciego Absorbente)
  const sanitaryStructures = [
    {
      id: 'CAM-DESGRASADORA',
      name: 'Cámara Desgrasadora (Cocina + Lavadero)',
      badgeTitle: '🧼 CÁMARA DESGRASADORA',
      badgeSub: 'Retiene Grasa Cocina y Jabón Lavadero',
      pos: [2.35, -2.34, 13.80],
      geom: new THREE.BoxGeometry(0.65, 0.55, 0.65),
      color: 0xf59e0b
    },
    {
      id: 'CAM-INSPECCION-CLOACAL',
      name: 'Cámara de Inspección Principal Cloacal (60×60 cm)',
      badgeTitle: '🔍 CÁMARA INSPECCIÓN 60×60',
      badgeSub: 'Acceso de Desobstrucción Cloacal',
      pos: [0.68, -2.34, 14.50],
      geom: new THREE.BoxGeometry(0.72, 0.60, 0.72),
      color: 0xd97706
    },
    {
      id: 'CAM-SEPTICA-1500L',
      name: 'Cámara Séptica Bicameral Impermeable (1.500 Litros)',
      badgeTitle: '♻️ CÁMARA SÉPTICA 1.500 L',
      badgeSub: 'Decantación Anaeróbica Bicameral',
      pos: [-2.20, -2.65, 16.50],
      geom: new THREE.BoxGeometry(1.65, 1.15, 1.10),
      color: 0xb45309
    },
    {
      id: 'POZO-CIEGO-ABSORBENTE',
      name: 'Pozo Ciego Absorbente (Ø 1.80m × 3.50m) + Acople Rápido Camión Cisterna',
      badgeTitle: '🕳️ POZO CIEGO ABSORBENTE',
      badgeSub: 'Ø 1.80m × 3.50m + Caño Desagote',
      pos: [-2.20, -3.45, 19.80],
      geom: new THREE.CylinderGeometry(0.95, 0.95, 2.20, 24),
      color: 0x92400e
    }
  ];

  sanitaryStructures.forEach((st) => {
    const stGroup = new THREE.Group();
    stGroup.position.set(...st.pos);
    const mesh = new THREE.Mesh(
      st.geom,
      new THREE.MeshStandardMaterial({
        color: st.color,
        emissive: st.color,
        emissiveIntensity: 0.28,
        roughness: 0.45,
        metalness: 0.2
      })
    );
    stGroup.add(mesh);

    const badge = createMepCalloutSprite(THREE, st.badgeTitle, st.badgeSub, '#f59e0b');
    if (badge) {
      badge.position.set(0, 1.05, 0);
      stGroup.add(badge);
    }

    const stMeta = {
      type: 'estructura_sanitaria_cloacal',
      bankCategory: 'nuevo_rojo',
      name: st.name,
      dimensions: 'Sistema Autónomo en Patio Nivelado (Independiente de Red Vecinal)',
      status: 'Tratamiento Cloacal Normativo ESSAP/MOPC ♻️',
      desc: 'Ubicado en el patio trasero con acceso de manguera de camión atmosférico por la puerta lateral de servicio y la Escalera 1.'
    };
    stGroup.userData = stMeta;
    stGroup.traverse((c) => { if (c.isMesh) c.userData = stMeta; });
    plumbingSubGroup.add(stGroup);
  });

  // ==========================================================================
  // 6. CAJAS DE ENCHUFES 20A (ROJOS) Y 16A (AZULES) + INTERRUPTORES ZIGBEE 3-WAY (VERDES) EN `electricalSubGroup`
  // ==========================================================================
  const mat20A = new THREE.MeshStandardMaterial({
    color: 0xef4444,
    emissive: 0xdc2626,
    emissiveIntensity: 0.65,
    roughness: 0.22
  });
  const mat16A = new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    emissive: 0x0284c7,
    emissiveIntensity: 0.55,
    roughness: 0.22
  });

  (DUCTOS_PASES_ENCHUFES_DATOS.enchufesYTomacorrientes || []).forEach((toma) => {
    const is20A = toma.tipo === 'toma_20a';
    const boxGroup = new THREE.Group();
    boxGroup.position.set(...toma.pos3D);

    const plate = new THREE.Mesh(
      new THREE.BoxGeometry(0.14, 0.10, 0.08),
      is20A ? mat20A : mat16A
    );
    boxGroup.add(plate);

    [-0.03, 0, 0.03].forEach((ox) => {
      const pinHole = new THREE.Mesh(
        new THREE.CylinderGeometry(0.01, 0.01, 0.085, 8),
        new THREE.MeshBasicMaterial({ color: ox === 0 ? 0x22c55e : 0x0f172a })
      );
      pinHole.rotation.x = Math.PI / 2;
      pinHole.position.set(ox, 0, 0);
      boxGroup.add(pinHole);
    });

    const tomaMeta = {
      type: is20A ? 'enchufe_20a_dedicado' : 'enchufe_16a_general',
      bankCategory: 'nuevo_rojo',
      name: `[${toma.codigo}] ${toma.label}`,
      dimensions: is20A
        ? 'Caja Profunda 5×10×5,5cm • Toma Reforzado 20A • Cable 4,0 mm² + Tierra Verde/Amarillo'
        : 'Caja Profunda 5×10×5,5cm • Toma Doble 16A • Cable 2,5 mm² + Tierra Verde/Amarillo',
      costo: 'Compatible con Monitoreo de Consumo Inteligente (Kit China / Local)',
      status: is20A ? 'Circuito Especial 20A de Alta Potencia 🔴⚡' : 'Tomacorriente Normalizado c/ Puesta a Tierra 🔵🔌',
      desc: `Ubicado en ${toma.nivel.replace('_', ' ').toUpperCase()} (${toma.pos3D.map((n) => n.toFixed(2) + 'm').join(', ')}). Protegido por Disyuntor Diferencial 30mA y DPS Clase II 40kA.`
    };
    boxGroup.userData = tomaMeta;
    boxGroup.traverse((ch) => {
      if (ch.isMesh) ch.userData = tomaMeta;
    });
    electricalSubGroup.add(boxGroup);
  });

  const switchMat = new THREE.MeshStandardMaterial({
    color: 0x10b981,
    emissive: 0x059669,
    emissiveIntensity: 0.65,
    roughness: 0.2
  });

  (DUCTOS_PASES_ENCHUFES_DATOS.llavesYConmutadas3Way || []).forEach((sw) => {
    const swGroup = new THREE.Group();
    swGroup.position.set(...sw.pos3D);

    const swPlate = new THREE.Mesh(
      new THREE.BoxGeometry(0.13, 0.13, 0.075),
      switchMat
    );
    swGroup.add(swPlate);

    if (sw.label.includes('Emergencia')) {
      const emLight = new THREE.Mesh(
        new THREE.BoxGeometry(0.24, 0.09, 0.06),
        new THREE.MeshBasicMaterial({ color: 0xfef08a })
      );
      emLight.position.set(0, 1.05, 0);
      swGroup.add(emLight);
    }

    const swMeta = {
      type: 'interruptor_inteligente_3way',
      bankCategory: 'nuevo_rojo',
      name: `[${sw.codigo}] ${sw.label}`,
      dimensions: 'Caja Profunda 5×10×5,5cm con Hilo Neutro (Celeste) • Interruptor Inteligente Zigbee 3.0 / 3-Way',
      costo: 'En Kit China: ~Gs. 67.500 c/u (Aqara / Sonoff SwitchMan M5 c/ Neutro)',
      status: 'Interruptor Inteligente Conectado a Cajas Octogonales de Losa 🟢💡',
      desc: 'Al hacerse la instalación de cero, todas las cajas de interruptores reciben hilo Neutro (Celeste), permitiendo usar llaves inteligentes Zigbee 3.0 con tecla física, estado en tiempo real y conmutación 3-Way en escaleras y dormitorio.'
    };
    swGroup.userData = swMeta;
    swGroup.traverse((ch) => {
      if (ch.isMesh) ch.userData = swMeta;
    });
    electricalSubGroup.add(swGroup);
  });

  // ==========================================================================
  // 7. SIMULADOR INTERACTIVO ELÉCTRICO Y DE FALLAS EN VIVO (EN `electricalSubGroup`)
  // ==========================================================================
  const elecSimSubGroups = {
    phase_R_ac: new THREE.Group(),
    phase_S_kitchen: new THREE.Group(),
    phase_T_lights: new THREE.Group(),
    fault_leak_30ma: new THREE.Group(),
    fault_overtemp_65c: new THREE.Group(),
    fault_flood_subsuelo: new THREE.Group()
  };
  Object.values(elecSimSubGroups).forEach((sg) => electricalSubGroup.add(sg));

  const animatedCurrentPulses = [];
  const registerCircuitPulses = (routeObj, phaseKey, colorHex) => {
    if (!routeObj || !routeObj.curve) return;
    const pulseMat = new THREE.MeshBasicMaterial({ color: colorHex });
    for (let i = 0; i < 8; i++) {
      const pMesh = new THREE.Mesh(new THREE.SphereGeometry(0.056, 8, 8), pulseMat);
      const tOffset = i / 8;
      pMesh.position.copy(routeObj.curve.getPointAt(tOffset));
      elecSimSubGroups[phaseKey].add(pMesh);
      animatedCurrentPulses.push({
        mesh: pMesh,
        curve: routeObj.curve,
        t: tOffset,
        speed: 0.0085,
        phaseKey
      });
    }
  };

  registerCircuitPulses(trunkRoute, 'phase_R_ac', 0xc084fc);
  registerCircuitPulses(pbAcRoute, 'phase_R_ac', 0xc084fc);
  registerCircuitPulses(paAcSuiteRoute, 'phase_R_ac', 0xc084fc);

  registerCircuitPulses(riserRoute, 'phase_S_kitchen', 0xfb923c);
  registerCircuitPulses(pbKitchenRoute1, 'phase_S_kitchen', 0xfb923c);
  registerCircuitPulses(pbKitchenRoute2, 'phase_S_kitchen', 0xfb923c);
  registerCircuitPulses(paWetCoreRoute, 'phase_S_kitchen', 0xfb923c);
  registerCircuitPulses(subLaundryAndBbqRoute, 'phase_S_kitchen', 0xfb923c);

  registerCircuitPulses(pbLightsRoute1, 'phase_T_lights', 0x38bdf8);
  registerCircuitPulses(pbCeilingLightsGrid, 'phase_T_lights', 0x38bdf8);
  registerCircuitPulses(paDeskLightsRoute, 'phase_T_lights', 0x38bdf8);
  registerCircuitPulses(subPumpRoute, 'phase_T_lights', 0x38bdf8);

  // Marcadores 3D de Falla en Vivo + Alerta de Corte en Tablero Principal DIN (TP-PB en x=-0.45, y=1.55, z=4.78)
  const faultBeacons = [];
  const createFaultBeacon = (targetKey, pos, colorHex, title, desc) => {
    const fGroup = elecSimSubGroups[targetKey];
    const coreSphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.18, 16, 16),
      new THREE.MeshBasicMaterial({ color: colorHex })
    );
    coreSphere.position.set(...pos);
    fGroup.add(coreSphere);

    const haloRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.36, 0.03, 12, 28),
      new THREE.MeshBasicMaterial({ color: 0xfef08a })
    );
    haloRing.rotation.x = Math.PI / 2;
    haloRing.position.set(...pos);
    fGroup.add(haloRing);

    const tripCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(...pos),
      new THREE.Vector3(-0.45, pos[1], 4.78),
      new THREE.Vector3(-0.45, 1.55, 4.78)
    ], false, 'catmullrom', 0.0);
    const tripTube = new THREE.Mesh(
      new THREE.TubeGeometry(tripCurve, 16, 0.025, 8, false),
      new THREE.MeshBasicMaterial({ color: 0xef4444 })
    );
    fGroup.add(tripTube);

    const boardAlertHalo = new THREE.Mesh(
      new THREE.BoxGeometry(0.56, 0.68, 0.24),
      new THREE.MeshBasicMaterial({ color: 0xef4444, wireframe: true })
    );
    boardAlertHalo.position.set(-0.45, 1.55, 4.78);
    fGroup.add(boardAlertHalo);

    fGroup.userData = {
      type: 'simulacion_falla_mep',
      name: title,
      status: 'CORTE AUTOMÁTICO ACTIVO EN TABLERO DIN TP-PB 🚨⚡',
      desc
    };
    fGroup.traverse((c) => {
      if (c.isMesh) c.userData = fGroup.userData;
    });
    fGroup.visible = false;

    faultBeacons.push({
      key: targetKey,
      coreSphere,
      haloRing,
      boardAlertHalo
    });
  };

  createFaultBeacon(
    'fault_leak_30ma',
    [0.95, 4.75, 3.22],
    0xef4444,
    '🚨 Falla Simulada: Fuga a Tierra > 30mA en Termocalefón 80L / Baño en Suite (Eje G)',
    'El disyuntor diferencial electrónico Riel DIN detecta una corriente diferencial > 30 mA en menos de 25 ms y corta automáticamente el circuito en el Tablero TP-PB.'
  );
  createFaultBeacon(
    'fault_overtemp_65c',
    [2.15, 1.12, 3.12],
    0xf97316,
    '🚨 Falla Simulada: Sobretemperatura > 65°C en Toma 20A de Cocina Integrada (Losa L4 Este)',
    'La llave térmica inteligente Zigbee Riel DIN detecta sobreconsumo y temperatura > 65°C en el circuito de Cocina 20A, abriendo el relé en el Tablero TP-PB.'
  );
  createFaultBeacon(
    'fault_flood_subsuelo',
    [4.55, -1.35, 6.40],
    0x38bdf8,
    '🚨 Falla Simulada: Sensor de Inundación Activo en Lavadero de Subsuelo (Muro Este)',
    'El sensor Zigbee de agua en el piso del Lavadero del Subsuelo detecta pérdida hidráulica y corta preventivamente el circuito del Subsuelo en TP-PB.'
  );

  let currentElecSimState = 'all_phases';

  const setElectricalSimMode = (state = 'all_phases') => {
    if (!state || state === 'off' || state === false) {
      currentElecSimState = 'off';
      Object.values(elecSimSubGroups).forEach((sg) => {
        sg.visible = false;
      });
      if (mainBoardDinLedMesh) mainBoardDinLedMesh.material.color.setHex(0x22c55e);
      return currentElecSimState;
    }

    group.visible = true;
    const modeStr = typeof state === 'string' ? state.trim() : 'custom';
    currentElecSimState = modeStr;

    const isFault = modeStr.startsWith('fault_');
    elecSimSubGroups.phase_R_ac.visible = modeStr === 'all_phases' || modeStr === 'all' || modeStr === 'phase_R_ac';
    elecSimSubGroups.phase_S_kitchen.visible = modeStr === 'all_phases' || modeStr === 'all' || modeStr === 'phase_S_kitchen';
    elecSimSubGroups.phase_T_lights.visible = modeStr === 'all_phases' || modeStr === 'all' || modeStr === 'phase_T_lights';

    elecSimSubGroups.fault_leak_30ma.visible = modeStr === 'fault_leak_30ma';
    elecSimSubGroups.fault_overtemp_65c.visible = modeStr === 'fault_overtemp_65c';
    elecSimSubGroups.fault_flood_subsuelo.visible = modeStr === 'fault_flood_subsuelo';

    if (mainBoardDinLedMesh) {
      mainBoardDinLedMesh.material.color.setHex(isFault ? 0xef4444 : 0x22c55e);
    }
    if (mainBoardBoxMesh && mainBoardBoxMesh.material) {
      mainBoardBoxMesh.material.emissive.setHex(isFault ? 0xdc2626 : 0xf59e0b);
      mainBoardBoxMesh.material.emissiveIntensity = isFault ? 0.95 : 0.35;
    }

    return currentElecSimState;
  };

  setElectricalSimMode('all_phases');

  // Filtro disciplinario para separar Modo Electricista vs Modo Plomero
  const setSubLayerFilter = (filterMode = 'all') => {
    if (filterMode === 'electrical_only' || filterMode === 'electricista') {
      electricalSubGroup.visible = true;
      plumbingSubGroup.visible = false;
    } else if (filterMode === 'plumbing_only' || filterMode === 'plomero') {
      electricalSubGroup.visible = false;
      plumbingSubGroup.visible = true;
    } else {
      electricalSubGroup.visible = true;
      plumbingSubGroup.visible = true;
    }
  };
  group.userData.setSubLayerFilter = setSubLayerFilter;

  group.userData.updateElectricalAnimation = (t = performance.now() * 0.001) => {
    if (!group.visible || !electricalSubGroup.visible || currentElecSimState === 'off') return;

    animatedCurrentPulses.forEach((p) => {
      const sg = elecSimSubGroups[p.phaseKey];
      if (!sg || !sg.visible) return;
      p.t = (p.t + p.speed) % 1.0;
      p.mesh.position.copy(p.curve.getPointAt(p.t));
    });

    const pulseScale = 1.0 + Math.sin(t * 9.0) * 0.35;
    faultBeacons.forEach((fb) => {
      const sg = elecSimSubGroups[fb.key];
      if (!sg || !sg.visible) return;
      fb.coreSphere.scale.setScalar(pulseScale);
      fb.haloRing.scale.setScalar(1.0 + ((t * 2.2) % 1.2));
      fb.boardAlertHalo.visible = Math.floor(t * 6) % 2 === 0;
    });
  };

  if (sceneGroups) {
    sceneGroups.ductosYEnchufes = group;
  }

  return {
    group,
    electricalSubGroup,
    plumbingSubGroup,
    setSubLayerFilter,
    updateAnimation: group.userData.updateElectricalAnimation,
    setSimulationState: setElectricalSimMode,
    simulateElectricalMode: setElectricalSimMode,
    data: DUCTOS_PASES_ENCHUFES_DATOS
  };
}

export function simulatePluvialMode(pluvialSystem, mode) {
  if (pluvialSystem && typeof pluvialSystem.setSimulationState === 'function') {
    return pluvialSystem.setSimulationState(mode);
  }
  return null;
}

export function simulateElectricalMode(conduitsSystem, mode) {
  if (conduitsSystem && typeof conduitsSystem.setSimulationState === 'function') {
    return conduitsSystem.setSimulationState(mode);
  }
  return null;
}


