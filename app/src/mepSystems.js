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
    canaletas: "Canaleta oculta en cenefa de chapa galvanizada N°24/26 plegada (sección 18x15cm) en el borde del Techo General (Y = +5.80m / Cota +105.80m), con pendiente longitudinal 3.0% hacia embudos colectores con rejilla atrapahojas.",
    bajadas: "4 Bajadas pluviales verticales continuas de PVC reforzado Junta Elástica Ø100mm (Tigre / Titan línea pesada), que descienden desde el Techo General (Y = +5.80m), atraviesan los pases de la Losa del 2do Piso (Y = +3.00m) y Losa de Planta Baja (Y = 0.00m), hasta las cámaras desarenadoras y drenaje del barranco.",
    drenajeFrancesCochera: "Drenaje Francés Superior (Trasdós Muro Cochera Cota +98.50m): Tubo PVC cribado/ranurado Ø100mm con pendiente 2%, envuelto en lecho de piedra triturada 4ta (40x40cm) y manta geotextil no tejida Bidim RT-16 (200 g/m²).",
    drenajeFrancesSubsuelo: "Drenaje Francés Inferior (Trasdós Muro Contención Subsuelo Cota +96.80m): Tubo cribado Ø100mm + grava graduada + geotextil Bidim + lámina drenante nodular para interceptar agua subsuperficial de la arena limosa SM.",
    barbacanas: "Barbacanas de alivio hidrostático en PVC Ø50mm cada 1.50m (pendiente 5% hacia afuera, con tapón de geotextil y grava en el trasdós para evitar lavado de finos del estrato SM).",
    camaras: "5 Cámaras de inspección y desarenadoras de mampostería revocada con hidrófugo (40x40x50cm) con contratapa hermética y decantador de arena de 10cm de fondo.",
    disipadorBarranco: "Disipador de energía escalonado en gaviones / piedra bruta cementada en el talud posterior (Cota +95.80m) para entregar el caudal pluvial sin velocidades erosivas (< 1.5 m/s) y prevenir erosión regresiva en el estrato de arena limosa SM (Nspt 7-9 en S3)."
  },
  elementos3D: [
    {
      id: "canaleta_norte",
      type: "pluvial_canaleta",
      name: "Canaleta Oculta Chapa Galvanizada N°24 (Techo 2do Piso Y=+5.80m)",
      dimensions: "8.80m x 0.18m x 0.15m (Pendiente 3%)",
      cota: "+105.80 m (Y = +5.80m)",
      costo: "Incluido en Partida 3.3 (7.800.000 Gs.)",
      status: "Crítico para Cierre de Techo en 2do Piso",
      desc: "Ubicada arriba del Segundo Piso. Recoge el 100% de las aguas del techo Isopanel (86 m²) con pendiente del 3% hacia los 4 embudos laterales para evitar desborde en tormentas de >150 mm/h."
    },
    {
      id: "drenaje_frances_cochera",
      type: "hidrofugo_drenaje",
      name: "Drenaje Francés Trasdós Muro Cochera (Cota +98.50m)",
      dimensions: "Long. 9.50m • Tubo Cribado Ø100mm + Piedra 4ta + Geotextil Bidim",
      cota: "+98.50 m (Y = -1.50m)",
      costo: "2.970.000 Gs. (Partida 11.2)",
      status: "Obligatorio antes de rellenar cochera",
      desc: "Elimina el empuje hidrostático sobre el muro de contención de calle Guillermo Arias. Envuelto en manta geotextil Bidim para impedir colmatación por tierra roja compactada."
    },
    {
      id: "drenaje_frances_subsuelo",
      type: "hidrofugo_drenaje",
      name: "Drenaje Francés Trasdós Muro Subsuelo (Cota +96.80m)",
      dimensions: "Long. 8.00m • Tubo Cribado Ø100mm + Grava + Geotextil Bidim",
      cota: "+96.80 m (Y = -3.20m)",
      costo: "2.241.600 Gs. (Aislación Vertical Partida 11.1)",
      status: "Protección Departamento Subsuelo Construido",
      desc: "Combinado con azotado hidrófugo Ceresita 1:3 y doble mano de emulsión asfáltica en el muro de contención central. Garantiza humedad 0% en el nivel inferior."
    },
    {
      id: "disipador_energia_barranco",
      type: "pluvial_disipador",
      name: "Disipador de Energía Hidráulica en Barranco (Cota +95.80m)",
      dimensions: "1.80m x 1.50m • Piedra Bruta Basáltica y Deflectores",
      cota: "+95.80 m (Y = -4.20m)",
      status: "Protección Geotécnica Sondeo S-3",
      desc: "Amortigua la velocidad del agua pluvial que cae desde los +5.85m de altura del techo general antes de verter al barranco natural, protegiendo el estrato SM contra socavación."
    }
  ]
};

export const WEAK_SIGNALS_DATA = {
  normativaReferencia: "Plano Ejecutivo 'PLANO DE SEÑALES DEBILES' (Lámina 3/5 IE-IS-IH-ISD-IAA) + Estándar ANSI/TIA-568-C.2 Cat6 + Norma ANDE BT.",
  rackPrincipal: {
    id: "rack_onu_nvr",
    type: "telecom_rack",
    name: "Gabinete Principal de Telecomunicaciones (Rack 6U Pared)",
    ubicacion: "Área Técnica en Planta Baja Construida (Cota +100.00m / Y = +1.50m)",
    pos3D: [-1.8, 1.5, 5.2],
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
      name: "Cámara IP PoE #1 — Calle Guillermo Arias (Vista Oriente)",
      ubicacion: "Pilar Frontal Izquierdo Cochera (Nivel Calle)",
      especificacion: "Bullet IP PoE 4MP (2560x1440), Lente 2.8mm (FOV 104°), IR ColorVu 30m, IP67",
      pos: [-4.4, 2.5, -1.8],
      lookAt: [4.5, 0.2, -7.5],
      fovDeg: 62,
      range: 9.5,
      color: 0x38bdf8,
      desc: "Vigila la vereda, acceso peatonal y aproximación vehicular desde el Este por Calle Guillermo Arias."
    },
    {
      id: "cam_2_poniente",
      numero: 2,
      name: "Cámara IP PoE #2 — Calle Guillermo Arias (Vista Poniente)",
      ubicacion: "Pilar Frontal Derecho Cochera (Nivel Calle)",
      especificacion: "Bullet IP PoE 4MP, Lente 2.8mm, Detección Humana/Vehicular IA, IP67",
      pos: [4.4, 2.5, -1.8],
      lookAt: [-4.5, 0.2, -7.5],
      fovDeg: 62,
      range: 9.5,
      color: 0x38bdf8,
      desc: "Cubre el frente urbano hacia el Oeste y cruce de acceso vehicular sobre la cota +100.00m."
    },
    {
      id: "cam_3_cochera",
      numero: 3,
      name: "Cámara IP PoE #3 — Interior Estacionamiento y Portón",
      ubicacion: "Bajo Viga de Losa 2do Piso (Fachada Frontal Y = +2.85m)",
      especificacion: "Domo Antivandálico IK10 PoE 4MP, WDR 120dB contra contraluz, Audio Integrado",
      pos: [0.0, 2.85, 2.85],
      lookAt: [0.0, 0.1, -4.5],
      fovDeg: 70,
      range: 8.0,
      color: 0x22d3ee,
      desc: "Monitorea los 2 vehículos estacionados sobre la platea, la puerta principal de seguridad y el portón basculante."
    },
    {
      id: "cam_4_pasillo",
      numero: 4,
      name: "Cámara IP PoE #4 — Pasillo y Escalera Lateral al Subsuelo",
      ubicacion: "Muro Lateral Derecho (Bajo Losa 2do Piso Y = +2.75m)",
      especificacion: "Bullet IP PoE 4MP, Visión Nocturna Smart IR 25m, IP67",
      pos: [4.15, 2.75, 13.5],
      lookAt: [4.5, -1.8, 19.5],
      fovDeg: 55,
      range: 8.0,
      color: 0x06b6d4,
      desc: "Controla la circulación peatonal independiente por la escalera lateral que baja desde Planta Baja (+100.00m) hacia el Subsuelo (+97.00m)."
    },
    {
      id: "cam_5_galeria",
      numero: 5,
      name: "Cámara IP PoE #5 — Galería Panorámica al Río y Terraza Superior",
      ubicacion: "Alero Superior de Galería / Segundo Piso (Y = +5.45m)",
      especificacion: "Domo IP PoE 4MP Gran Angular 110°, Sirena y Estrobo disuasivo activo",
      pos: [-3.9, 5.45, 16.2],
      lookAt: [2.2, 0.8, 19.8],
      fovDeg: 68,
      range: 8.5,
      color: 0x38bdf8,
      desc: "Ubicada bajo la estructura superior para cubrir en picado tanto la galería/terraza panorámica como los cerramientos hacia el Río Paraguay."
    },
    {
      id: "cam_6_barranco",
      numero: 6,
      name: "Cámara IP PoE #6 — Contrafrente Subsuelo y Barranco al Río",
      ubicacion: "Bajo Losa de Planta Baja hacia Patio Inferior (Y = -0.35m)",
      especificacion: "Bullet IP PoE 4MP Térmica/Perimetral con cruce de línea virtual, IR 40m",
      pos: [0.0, -0.35, 22.1],
      lookAt: [0.0, -3.8, 28.5],
      fovDeg: 65,
      range: 8.5,
      color: 0x0ea5e9,
      desc: "Vigilancia perimetral del nivel inferior construido (+97.00m) y talud posterior hacia el Río Paraguay en conjunto con las barreras infrarrojas."
    }
  ],
  nodosWifiMesh: [
    {
      id: "wifi_node_1_pb",
      name: "Nodo Wi-Fi 6 Mesh #1 — Planta Baja Construida (Y = +1.80m)",
      ubicacion: "Estar / Cocina Integrada Planta Baja (Cota +101.80m)",
      pos: [-1.2, 1.8, 8.5],
      radius: 6.5,
      banda: "Dual Band AX3000 (2.4 GHz + 5 GHz 160MHz) • Master Router Gigabit",
      desc: "Vinculado directo al Rack Principal en Planta Baja. Cubre el Estar/Comedor, Cocina, Galería y Cochera."
    },
    {
      id: "wifi_node_2_pa",
      name: "Nodo Wi-Fi 6 Mesh #2 — Segundo Piso / Planta Alta (Y = +4.60m)",
      ubicacion: "Sobre Nueva Losa del Segundo Piso y Bajo Techo Isopanel (Cota +104.60m)",
      pos: [0.5, 4.6, 13.5],
      radius: 6.5,
      banda: "Wi-Fi 6 Gigabit PoE • Backhaul Cableado Cat6 por Boquete de Losa 2do Piso",
      desc: "Garantiza cobertura total en toda la nueva planta alta a levantar (Y = +3.00m a +5.85m) y terraza/mirador superior al Río Paraguay."
    },
    {
      id: "wifi_node_3_sub",
      name: "Nodo Wi-Fi 6 Mesh #3 — Departamento Subsuelo (Y = -1.50m)",
      ubicacion: "Estar / Kitchenette Nivel Inferior Construido (Cota +98.50m)",
      pos: [0.0, -1.5, 18.0],
      radius: 5.5,
      banda: "Wi-Fi 6 Gigabit conectado por pase de Losa PB con UTP Cat6",
      desc: "Supera el blindaje de la primera losa de hormigón armado ya construida bajando por el boquete técnico hacia el subsuelo."
    }
  ],
  pasesLosaBoquetes: [
    {
      id: "pase_losa_sub_pb",
      name: "Boquete / Pase en 1ra Losa Existente Ø2\" (Planta Baja Y=0.00m ↔ Subsuelo)",
      pos: [-1.8, 0.0, 14.3],
      dimensions: "Camisa PVC Ø50mm + Sellado Cortafuego/Hidrófugo Sikaflex",
      desc: "Atraviesa la losa ya construida de Planta Baja (Y = 0.00m) para bajar UTP Cat6 al Nodo Wi-Fi #3 (Y = -1.50m) y Cámara #6."
    },
    {
      id: "pase_losa_pb_pa",
      name: "Boquete / Pase en Nueva Losa 2do Piso Ø2\" (Planta Baja ↔ 2do Piso Y=+3.00m)",
      pos: [-1.8, 3.0, 11.5],
      dimensions: "Camisa PVC Ø50mm dejada prevista antes de hormigonar Losa Fase 2",
      desc: "Paso vertical clave en la nueva Losa de Segundo Piso (Y = +3.00m) para subir UTP Cat6 al Nodo Wi-Fi #2 (Y = +4.60m), Cámara #5 y futuras divisiones."
    }
  ],
  porteroYPorton: {
    portero: {
      id: "portero_visor_ip",
      type: "domotica_acceso",
      name: "Portero Visor IP Antivandálico con Apertura desde Celular",
      pos: [-4.55, 1.45, -1.95],
      costo: "2.450.000 Gs. (Partida 12.3)",
      desc: "Frente de calle IP PoE con cámara Gran Angular 160° WDR, lector RFID y notificación en vivo en app móvil (Hik-Connect / Ezviz) para abrir portón peatonal y vehicular a distancia."
    },
    motorPorton: {
      id: "motor_porton_cochera",
      type: "domotica_acceso",
      name: "Automatización Portón Basculante Rápido + Módulo Domótico Wi-Fi",
      pos: [4.3, 1.1, -1.9],
      costo: "13.500.000 Gs. (Partida 9.1 Portón Completo)",
      desc: "Motor torsional de 1/2 HP con destrabe rápido de apertura en 6 segundos (seguridad en vía pública en Asunción) y relé inteligente vinculado a las cámaras #1 y #2."
    }
  },
  lucesDomoticasNocturnas: [
    {
      id: "luz_dom_1",
      name: "Luminaria Domótica Cálida 3000K — Fachada Cochera Oeste (Bajo Losa 2do Piso)",
      pos: [-3.2, 2.85, 2.7],
      target: [-3.2, 0.0, -1.5],
      intensity: 3.5,
      distance: 11
    },
    {
      id: "luz_dom_2",
      name: "Luminaria Domótica Cálida 3000K — Fachada Cochera Este (Bajo Losa 2do Piso)",
      pos: [3.2, 2.85, 2.7],
      target: [3.2, 0.0, -1.5],
      intensity: 3.5,
      distance: 11
    },
    {
      id: "luz_dom_3",
      name: "Bañador LED 3000K — Muro de Contención Calle Guillermo Arias",
      pos: [0.0, 0.4, -2.0],
      target: [0.0, -1.0, -3.5],
      intensity: 2.8,
      distance: 8
    },
    {
      id: "luz_dom_4",
      name: "Iluminación Escénica 3000K — Galería Planta Baja al Río (Y = +2.85m)",
      pos: [-2.8, 2.85, 16.5],
      target: [-2.8, 0.1, 16.5],
      intensity: 4.0,
      distance: 11
    },
    {
      id: "luz_dom_5",
      name: "Iluminación Escénica 3000K — Segundo Piso y Alero Techo General (Y = +5.60m)",
      pos: [2.2, 5.6, 16.5],
      target: [2.2, 3.0, 16.5],
      intensity: 4.5,
      distance: 12
    },
    {
      id: "luz_dom_6",
      name: "Baliza LED Automatizada 3000K — Escalera Exterior y Subsuelo (Y = -0.30m)",
      pos: [4.4, -0.3, 17.5],
      target: [4.4, -2.8, 19.5],
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
 * Ajustado a la geometría real de 3 niveles:
 * - Canaletas ocultas N°24/26 en el Techo General arriba del 2do Piso (Y = +5.80m)
 * - 4 Bajadas verticales Ø100mm que bajan desde Y = +5.80m pasando por la Losa del 2do Piso (Y = +3.00m) y Planta Baja (Y = 0.00m)
 * - Drenajes franceses con geotextil Bidim en Muro Cochera (+98.50m) y Muro Subsuelo (+96.80m) con barbacanas Ø50mm c/ 1.50m
 * - Cámaras desarenadoras 40x40cm, colectores troncales y disipador de energía en el barranco.
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

  // 1. CANALETA OCULTA DE CHAPA GALVANIZADA N°24/26 EN BORDE DEL TECHO DEL SEGUNDO PISO (Y = +5.80m, Pendiente 3%)
  const gutterRearGeom = new THREE.BoxGeometry(8.8, 0.22, 0.24);
  const gutterRear = new THREE.Mesh(gutterRearGeom, galvMat);
  gutterRear.position.set(0, 5.55, 20.25);
  gutterRear.rotation.z = -0.015; // Pendiente longitudinal 3% hacia extremos colectores
  gutterRear.userData = PLUVIAL_HYDRO_DATA.elementos3D[0];
  group.add(gutterRear);

  const gutterFrontGeom = new THREE.BoxGeometry(8.8, 0.18, 0.20);
  const gutterFront = new THREE.Mesh(gutterFrontGeom, galvMat);
  gutterFront.position.set(0, 6.15, 3.05);
  gutterFront.userData = {
    type: "pluvial_canaleta",
    name: "Babeta y Canaleta Superior Frontal Chapa Galvanizada N°24 (Arriba 2do Piso)",
    dimensions: "8.80m x 0.18m (Pendiente 3%)",
    cota: "+106.15 m (Y = +6.15m)",
    desc: "Cierre superior estanco del techo Isopanel sobre el Segundo Piso con caída hacia las 4 bajadas pluviales."
  };
  group.add(gutterFront);

  // Canaleta auxiliar en borde de Losa de 2do Piso / Galería (Y = +3.00m)
  const gutterMidGeom = new THREE.BoxGeometry(9.55, 0.14, 0.16);
  const gutterMid = new THREE.Mesh(gutterMidGeom, galvMat);
  gutterMid.position.set(0, 3.0, 20.05);
  gutterMid.userData = {
    type: "pluvial_canaleta",
    name: "Canaleta Colectora de Losa 2do Piso / Galería (Y = +3.00m)",
    dimensions: "9.55m x 0.14m • Conectada a Bajadas Ø100mm",
    cota: "+103.00 m",
    desc: "Evacúa el agua de lluvia de la nueva losa de planta alta / terraza hacia los caños verticales Ø100mm."
  };
  group.add(gutterMid);

  // 2. 4 BAJADAS PLUVIALES VERTICALES DE PVC REFORZADO Ø100mm (Desde Techo Y=+5.80m pasando por Losa 2do Piso Y=+3.00m y PB Y=0.00m)
  const downspoutsConfig = [
    { id: "BP-1", name: "Bajada Pluvial #1 (PVC Ø100mm - Pilar Frontal Oeste)", x: -4.12, z: 3.1, topY: 6.15, botY: -0.25 },
    { id: "BP-2", name: "Bajada Pluvial #2 (PVC Ø100mm - Pilar Frontal Este)", x: 4.12, z: 3.1, topY: 6.15, botY: -0.25 },
    { id: "BP-3", name: "Bajada Pluvial #3 (PVC Ø100mm - Pilar Posterior Oeste)", x: -4.12, z: 20.1, topY: 5.55, botY: -2.75 },
    { id: "BP-4", name: "Bajada Pluvial #4 (PVC Ø100mm - Pilar Posterior Este)", x: 4.12, z: 20.1, topY: 5.55, botY: -2.75 }
  ];

  downspoutsConfig.forEach((ds) => {
    const h = ds.topY - ds.botY;
    const pipeGeom = new THREE.CylinderGeometry(0.065, 0.065, h, 16);
    const pipeMesh = new THREE.Mesh(pipeGeom, pvcPluvialMat);
    pipeMesh.position.set(ds.x, ds.botY + h / 2, ds.z);
    pipeMesh.userData = {
      type: "pluvial_bajada",
      name: `${ds.id}: ${ds.name}`,
      dimensions: `PVC Reforzado Ø100mm • Altura Total ${h.toFixed(2)}m (Techo 2do Piso → Barranco)`,
      costo: "Incluido en Partida 3.3",
      status: "Crítico Evacuación Tormentas >150mm/h",
      desc: "Tubería vertical continua desde el Techo General (Y=+5.80m), pasando por la Losa del 2do Piso (Y=+3.00m) y Planta Baja (Y=0.00m) hasta cámara desarenadora."
    };
    group.add(pipeMesh);

    // Embudo colector superior en el techo del 2do piso
    const hopperGeom = new THREE.ConeGeometry(0.16, 0.25, 16);
    hopperGeom.rotateX(Math.PI);
    const hopperMesh = new THREE.Mesh(hopperGeom, galvMat);
    hopperMesh.position.set(ds.x, ds.topY + 0.05, ds.z);
    group.add(hopperMesh);

    // Abrazadera / Pase en Losa de 2do Piso (Y = +3.00m) y Losa Planta Baja (Y = 0.00m)
    [3.0, 0.0].forEach((slabY) => {
      const collarGeom = new THREE.TorusGeometry(0.085, 0.02, 10, 20);
      collarGeom.rotateX(Math.PI / 2);
      const collarMesh = new THREE.Mesh(collarGeom, galvMat);
      collarMesh.position.set(ds.x, slabY, ds.z);
      group.add(collarMesh);
    });
  });

  // 3. DRENAJE FRANCÉS PERIMETRAL (MURO COCHERA +98.50m Y MURO SUBSUELO +96.80m) CON BARBACANAS Ø50mm CADA 1.50m
  const buildFrenchDrain = (centerX, centerY, centerZ, lengthX, metaData, weepYOffset) => {
    const drainGroup = new THREE.Group();

    // Envolvente de piedra triturada 4ta + Manta Geotextil Bidim RT-16 (Sección 45x45cm)
    const gravelBedGeom = new THREE.BoxGeometry(lengthX, 0.42, 0.45);
    const gravelBed = new THREE.Mesh(gravelBedGeom, geotextilMat);
    gravelBed.position.set(centerX, centerY, centerZ);
    gravelBed.userData = metaData;
    drainGroup.add(gravelBed);

    // Tubo interior cribado/ranurado Ø100mm
    const cribadoGeom = new THREE.CylinderGeometry(0.075, 0.075, lengthX - 0.2, 20);
    cribadoGeom.rotateZ(Math.PI / 2);
    const cribadoMesh = new THREE.Mesh(cribadoGeom, perforatedPipeMat);
    cribadoMesh.position.set(centerX, centerY - 0.05, centerZ);
    cribadoMesh.userData = metaData;
    drainGroup.add(cribadoMesh);

    // Anillos visuales de ranurado del tubo
    for (let x = -lengthX / 2 + 0.6; x <= lengthX / 2 - 0.6; x += 0.8) {
      const ringGeom = new THREE.TorusGeometry(0.08, 0.015, 8, 16);
      ringGeom.rotateY(Math.PI / 2);
      const ring = new THREE.Mesh(ringGeom, pvcPluvialMat);
      ring.position.set(centerX + x, centerY - 0.05, centerZ);
      drainGroup.add(ring);
    }

    // Barbacanas de alivio Ø50mm cada 1.50m atravesando el muro de contención
    for (let x = -3.75; x <= 3.75; x += 1.5) {
      const weepGeom = new THREE.CylinderGeometry(0.035, 0.035, 0.55, 12);
      weepGeom.rotateX(Math.PI / 2 + 0.05); // Pendiente 5% hacia el exterior
      const weepMesh = new THREE.Mesh(weepGeom, weepHoleMat);
      weepMesh.position.set(centerX + x, centerY + weepYOffset, centerZ - 0.25);
      weepMesh.userData = {
        type: "hidrofugo_barbacana",
        name: "Barbacana de Alivio Hidrostático PVC Ø50mm (c/ 1.50m)",
        dimensions: "Ø50mm • Separación 1.50m • Pendiente 5%",
        status: "Alivio de Presión Hidrostática",
        desc: "Pasa-muro de PVC Ø50mm con filtro geotextil interior. Evita que el agua de lluvia acumulada detrás del muro genere empuje hidrostático o fisuras."
      };
      drainGroup.add(weepMesh);
    }

    group.add(drainGroup);
  };

  // Drenaje Francés Muro Cochera (Cota +98.50m -> Y = -1.25 en escena, Z = -1.52 detrás del muro en Z = -1.8)
  buildFrenchDrain(0, -1.25, -1.52, 9.5, PLUVIAL_HYDRO_DATA.elementos3D[1], 0.25);

  // Drenaje Francés Muro Contención Subsuelo (Cota +96.80m -> Y = -2.55 en escena, Z = 13.75 detrás del muro en Z = 14.0)
  buildFrenchDrain(0, -2.55, 13.75, 8.0, PLUVIAL_HYDRO_DATA.elementos3D[2], 0.35);

  // 4. CÁMARAS DESARENADORAS / REGISTROS DE INSPECCIÓN PLUVIAL (40x40cm) Y COLECTORES LATERALES
  const chambersConfig = [
    { id: "CI-1", name: "Cámara de Inspección y Desarenadora #1 (Noroeste Frente)", x: -4.25, z: 3.1 },
    { id: "CI-2", name: "Cámara de Inspección y Desarenadora #2 (Noreste Frente)", x: 4.25, z: 3.1 },
    { id: "CI-3", name: "Cámara de Inspección y Desarenadora #3 (Oeste Barranco)", x: -4.25, z: 20.1 },
    { id: "CI-4", name: "Cámara de Inspección y Desarenadora #4 (Este Barranco)", x: 4.25, z: 20.1 },
    { id: "CI-5", name: "Cámara Colectora Final pre-Disipador (Fondo Barranco)", x: 0.0, z: 25.0 }
  ];

  chambersConfig.forEach((ch) => {
    const groundY = getTerrainHeight ? getTerrainHeight(ch.x, ch.z) : -2.0;
    const boxGeom = new THREE.BoxGeometry(0.5, 0.55, 0.5);
    const boxMesh = new THREE.Mesh(boxGeom, chamberMat);
    boxMesh.position.set(ch.x, groundY - 0.15, ch.z);

    const lidGeom = new THREE.BoxGeometry(0.54, 0.06, 0.54);
    const lidMesh = new THREE.Mesh(lidGeom, chamberLidMat);
    lidMesh.position.y = 0.28;
    boxMesh.add(lidMesh);

    boxMesh.userData = {
      type: "pluvial_camara",
      name: `${ch.id}: ${ch.name}`,
      dimensions: "0.40m x 0.40m x 0.50m (Mampostería Hidrófuga)",
      cota: `${(100 + groundY).toFixed(2)} m`,
      status: "Inspección y Decantación de Arena SM",
      desc: "Registro pluvial con fondo decantador de 10cm para retener sedimentos y arena limosa antes de conducir el agua hacia el barranco."
    };
    group.add(boxMesh);
  });

  // Colectores enterrados Ø100mm laterales (de Z = -1.52 hasta Z = 25.0 y al Disipador en Z = 27.2)
  const createCollectorTube = (points, label) => {
    const curve = new THREE.CatmullRomCurve3(points);
    const tubeGeom = new THREE.TubeGeometry(curve, 32, 0.06, 12, false);
    const tubeMesh = new THREE.Mesh(tubeGeom, pvcPluvialMat);
    tubeMesh.userData = {
      type: "pluvial_colector",
      name: label,
      dimensions: "PVC Cloacal/Pluvial Pesado Ø100mm • Pendiente > 2%",
      desc: "Conducto troncal subterráneo que recoge el drenaje francés y las bajadas pluviales conduciéndolas de forma hermética fuera de la zona de zapatas."
    };
    group.add(tubeMesh);
    return curve;
  };

  const westCurve = createCollectorTube([
    new THREE.Vector3(-4.25, -1.25, -1.52),
    new THREE.Vector3(-4.25, -0.45, 3.1),
    new THREE.Vector3(-4.25, -2.55, 13.75),
    new THREE.Vector3(-4.25, -2.85, 20.1),
    new THREE.Vector3(0.0, -3.65, 25.0),
    new THREE.Vector3(0.0, -4.15, 27.2)
  ], "Colector Pluvial Troncal Oeste (PVC Ø100mm)");

  const eastCurve = createCollectorTube([
    new THREE.Vector3(4.25, -1.25, -1.52),
    new THREE.Vector3(4.25, -0.45, 3.1),
    new THREE.Vector3(4.25, -2.55, 13.75),
    new THREE.Vector3(4.25, -2.85, 20.1),
    new THREE.Vector3(0.0, -3.65, 25.0),
    new THREE.Vector3(0.0, -4.15, 27.2)
  ], "Colector Pluvial Troncal Este (PVC Ø100mm)");

  // 5. DISIPADOR DE ENERGÍA HIDRÁULICA EN EL BARRANCO (Z = 27.2, Cota +95.80m)
  const dissipatorGroup = new THREE.Group();
  const disY = getTerrainHeight ? getTerrainHeight(0, 27.2) : -3.85;
  dissipatorGroup.position.set(0, disY, 27.2);

  const stoneBasinMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.9, metalness: 0.1 });
  const basinBase = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.25, 1.5), stoneBasinMat);
  dissipatorGroup.add(basinBase);

  [-0.5, 0, 0.5].forEach((bx) => {
    const baffle = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.35, 0.25), galvMat);
    baffle.position.set(bx, 0.25, 0.2);
    dissipatorGroup.add(baffle);
  });

  dissipatorGroup.userData = PLUVIAL_HYDRO_DATA.elementos3D[3];
  group.add(dissipatorGroup);

  // 6. SIMULADOR INTERACTIVO PLUVIAL / HIDROSANITARIO POR CAPAS:
  //    (a) 'rainstorm': Lluvia torrencial 165 mm/h con cortina de gotas 3D sobre techo Isopanel y pérgola antigranizo de cochera + escurrimiento por canaletas y 4 bajadas Ø100mm hacia drenaje francés y barranco.
  //    (b) 'water_supply': Flujo presurizado azul (fría) y rojo (caliente) desde Cisterna 1.000L + Bomba Rowa subiendo por el núcleo húmedo Eje F–G (z=3.00..5.26m) hacia Cocina, Baño Social, Baño en Suite, Baño 2 y Parrillita Subsuelo.
  //    (c) 'sewage_flow': Descarga cloacal ámbar vertical por la columna Ø100mm desde los baños superpuestos en Eje F–G hacia Cámara Séptica y Pozo Ciego.
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

  // Cortina de gotas de lluvia 3D (Tormenta Asuncena 165 mm/h sobre Techo General y Pérgola Antigranizo de Cochera)
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
      ? -0.4 + ((i * 37) % 100) * 0.048 // Cochera x = -0.40..+4.40m
      : -4.8 + ((i * 53) % 100) * 0.096; // Techo casa x = -4.80..+4.80m
    const rz = isOverPergola
      ? -3.7 + ((i * 29) % 100) * 0.064 // Pérgola z = -3.70..+2.70m
      : 2.2 + ((i * 71) % 100) * 0.115; // Casa z = 2.20..13.70m
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

  // Esferas de flujo pluvial por canaletas, pérgola de cochera, 4 bajadas Ø100mm y colectores hacia el barranco
  const dropGeom = new THREE.SphereGeometry(0.09, 10, 10);
  const dropRainMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
  const roofWestPath = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-2.5, 6.05, 4.0),
    new THREE.Vector3(-4.12, 5.65, 3.1),
    new THREE.Vector3(-4.12, 2.88, 3.1),
    new THREE.Vector3(-4.12, 0.0, 3.1),
    new THREE.Vector3(-4.25, -0.45, 3.1)
  ]);
  const roofEastPath = new THREE.CatmullRomCurve3([
    new THREE.Vector3(2.5, 6.05, 4.0),
    new THREE.Vector3(4.12, 5.65, 3.1),
    new THREE.Vector3(4.12, 2.88, 3.1),
    new THREE.Vector3(4.12, 0.0, 3.1),
    new THREE.Vector3(4.25, -0.45, 3.1)
  ]);
  const pergolaDrainPath = new THREE.CatmullRomCurve3([
    new THREE.Vector3(2.0, 2.72, -3.5),
    new THREE.Vector3(3.8, 2.62, -1.0),
    new THREE.Vector3(4.12, 2.55, 2.6),
    new THREE.Vector3(4.12, 0.0, 3.1),
    new THREE.Vector3(4.25, -0.45, 3.1)
  ]);

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
        speed: pathIdx >= 2 ? 0.0065 : 0.0042,
        mode: 'rainstorm'
      });
    }
  });

  // (b) 'water_supply': Flujo presurizado Azul (Fría) y Rojo (Caliente) por el Núcleo Húmedo Superpuesto Eje F–G (z = 3.00m..5.00m)
  const coldFlowMat = new THREE.MeshBasicMaterial({ color: 0x0ea5e9 });
  const hotFlowMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
  const supplyColdCurveMain = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-4.25, -1.65, 3.65), // Cisterna 1000L + Bomba Rowa en Subsuelo
    new THREE.Vector3(-2.20, -1.50, 3.20),
    new THREE.Vector3(-2.20, 0.00, 3.20),  // Sube por Núcleo Húmedo Eje F-G a Planta Baja
    new THREE.Vector3(-3.15, 0.85, 3.42),  // Bacha Doble Cocina PB (Eje F-G)
    new THREE.Vector3(-1.10, 0.80, 3.45),  // SSHH / Baño Social PB (Eje F-G)
    new THREE.Vector3(-1.80, 2.95, 3.35),  // Sube a Planta Alta (Baño en Suite sobre Eje F-G)
    new THREE.Vector3(-1.20, 3.70, 3.45),  // Lavatorio / Inodoro / Ducha Baño en Suite PA
    new THREE.Vector3(2.65, 3.70, 3.45)    // SSHH 2 / Baño Planta Alta (Eje F-G)
  ]);
  const supplyColdCurveSub = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-4.25, -1.65, 3.65),
    new THREE.Vector3(-3.20, -1.45, 6.90), // Lavadero Subsuelo
    new THREE.Vector3(-3.20, -1.45, 12.65) // Bacha de Parrillita / Quincho Inferior en Subsuelo
  ]);
  const supplyHotCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-2.40, 4.65, 3.35),  // Termocalefón 80L en Núcleo Húmedo Eje F-G PA
    new THREE.Vector3(-1.50, 3.85, 3.45),  // Ducha y Vanitory Baño en Suite PA
    new THREE.Vector3(2.55, 3.85, 3.45),   // Ducha y Vanitory SSHH 2 PA
    new THREE.Vector3(-2.20, 0.88, 3.42),  // Baja directo a Bacha Cocina PB y Baño Social PB
    new THREE.Vector3(-3.15, 0.88, 3.42)
  ]);

  // Dibujar tuberías guía semitransparentes en el subgrupo water_supply para que se vean aun con sólo Pluvial activo
  [
    { curve: supplyColdCurveMain, mat: coldFlowMat, r: 0.024 },
    { curve: supplyColdCurveSub, mat: coldFlowMat, r: 0.020 },
    { curve: supplyHotCurve, mat: hotFlowMat, r: 0.020 }
  ].forEach(({ curve, mat, r }) => {
    const pipe = new THREE.Mesh(
      new THREE.TubeGeometry(curve, 32, r, 10, false),
      new THREE.MeshStandardMaterial({
        color: mat.color,
        transparent: true,
        opacity: 0.45,
        roughness: 0.25
      })
    );
    simSubGroups.water_supply.add(pipe);
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

  // (c) 'sewage_flow': Descarga cloacal ámbar vertical por columna Ø100mm desde los baños superpuestos en Eje F–G hacia Cámara Séptica y Pozo Ciego
  const sewageFlowMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b });
  const sewageStackCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(2.60, 3.10, 3.65),   // Descarga SSHH 2 Planta Alta (Eje F-G)
    new THREE.Vector3(-1.45, 3.05, 3.65),  // Descarga Baño en Suite Planta Alta (Eje F-G)
    new THREE.Vector3(-1.45, 0.05, 3.65),  // Recibe SSHH / Baño Social PB + Cocina PB (Eje F-G)
    new THREE.Vector3(-2.85, -2.25, 3.85), // Baja vertical al colector de Subsuelo
    new THREE.Vector3(-3.25, -2.35, 6.90), // Recibe Lavadero Subsuelo
    new THREE.Vector3(-3.25, -2.42, 12.65),// Recibe Bacha de Parrillita en Subsuelo
    new THREE.Vector3(-3.25, -2.95, 14.55),// Cámara Desgrasadora e Inspección
    new THREE.Vector3(-3.25, -3.25, 16.55),// Cámara Séptica Bicameral
    new THREE.Vector3(-3.25, -3.45, 20.20) // Pozo Ciego Absorbente
  ]);
  const sewageGuidePipe = new THREE.Mesh(
    new THREE.TubeGeometry(sewageStackCurve, 36, 0.045, 12, false),
    new THREE.MeshStandardMaterial({
      color: 0xb45309,
      transparent: true,
      opacity: 0.48,
      roughness: 0.35
    })
  );
  simSubGroups.sewage_flow.add(sewageGuidePipe);
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

  let currentPluvialSimMode = 'all';

  const setPluvialSimMode = (state = 'all') => {
    if (!state || state === 'off' || state === false) {
      currentPluvialSimMode = 'off';
      simSubGroups.rainstorm.visible = false;
      simSubGroups.water_supply.visible = false;
      simSubGroups.sewage_flow.visible = false;
      return currentPluvialSimMode;
    }
    if (typeof state === 'object') {
      currentPluvialSimMode = 'custom';
      simSubGroups.rainstorm.visible = Boolean(state.rainstorm ?? true);
      simSubGroups.water_supply.visible = Boolean(state.water_supply ?? false);
      simSubGroups.sewage_flow.visible = Boolean(state.sewage_flow ?? false);
      group.visible = true;
      return currentPluvialSimMode;
    }
    const modeStr = String(state).toLowerCase().trim();
    currentPluvialSimMode = modeStr;
    group.visible = true;
    simSubGroups.rainstorm.visible = modeStr === 'all' || modeStr === 'rainstorm';
    simSubGroups.water_supply.visible = modeStr === 'all' || modeStr === 'water_supply';
    simSubGroups.sewage_flow.visible = modeStr === 'all' || modeStr === 'sewage_flow';
    return currentPluvialSimMode;
  };

  // Por defecto inicia mostrando lluvia pluvial cuando se enciende la capa
  setPluvialSimMode('rainstorm');

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

  // Columna Montante UTP Cat6 uniendo Subsuelo (Y=-1.5m) ↔ Rack PB (Y=+1.5m) ↔ Losa 2do Piso (Y=+3.0m) ↔ Nodo 2do Piso (Y=+4.6m)
  const cat6Points = [
    new THREE.Vector3(0.0, -1.5, 18.0),
    new THREE.Vector3(-1.8, 0.0, 14.3),
    new THREE.Vector3(...rackInfo.pos3D),
    new THREE.Vector3(-1.2, 1.8, 8.5),
    new THREE.Vector3(-1.8, 3.0, 11.5),
    new THREE.Vector3(0.5, 4.6, 13.5)
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
 * Construye la Capa 3D Interactiva de:
 * 1) LOS 4 PASES CON SACABOCADO DIAMANTADO EN LA LOSA 1 EXISTENTE (Y = 0.00m, en el Núcleo Húmedo Eje F–G z=3.00..5.26m):
 * 2) TABLEROS ELÉCTRICOS CON EQUIPAMIENTO INTELIGENTE RIEL DIN (COMPRA CHINA / ANDE)
 * 3) ELECTRODUCTOS POR CONTRAPISO/CARPETA (SOBRE LOSA 1 SIN PICAR), MUROS Y VIGAS DE SUBSUELO
 * 4) TODOS LOS ENCHUFES DE 20A (ROJOS) Y 16A (AZULES) + INTERRUPTORES INTELIGENTES ZIGBEE CON NEUTRO Y 3-WAY (VERDES)
 * 5) RED HIDROSANITARIA COMPLETA SUPERPUESTA VERTICALMENTE SOBRE EL NÚCLEO HÚMEDO EJE F–G (z = 3.00m..5.00m)
 * 6) SIMULADOR FUNCIONAL ELÉCTRICO Y DE FALLAS EN VIVO (phase_R_ac, phase_S_kitchen, phase_T_lights, fault_leak_30ma, fault_overtemp_65c, fault_flood_subsuelo)
 */
export function buildConduitsOutletsAndPlumbingLayer(THREE, sceneGroups) {
  const group = (sceneGroups && sceneGroups.ductosYEnchufes) ? sceneGroups.ductosYEnchufes : new THREE.Group();
  group.clear();

  let mainBoardDinLedMesh = null;
  let mainBoardBoxMesh = null;

  const addTubePath = (pointsVec3, radius, colorHex, meta, targetSubGroup = group) => {
    if (!pointsVec3 || pointsVec3.length < 2) return null;
    const curve = new THREE.CatmullRomCurve3(pointsVec3, false, 'catmullrom', 0.08);
    const geom = new THREE.TubeGeometry(curve, Math.max(12, pointsVec3.length * 6), radius, 10, false);
    const mat = new THREE.MeshStandardMaterial({
      color: colorHex,
      roughness: 0.32,
      metalness: 0.25
    });
    const mesh = new THREE.Mesh(geom, mat);
    mesh.userData = meta;
    targetSubGroup.add(mesh);
    return { mesh, curve };
  };

  // ==========================================================================
  // 1. LOS 4 PASES DE LOSA CON SACABOCADO DIAMANTADO EN LA LOSA 1 EXISTENTE (Y = 0.00m)
  // ==========================================================================
  (DUCTOS_PASES_ENCHUFES_DATOS.pasesLosa1Diamantados || []).forEach((pase) => {
    const paseGroup = new THREE.Group();
    paseGroup.position.set(...pase.pos3D);

    const outerRadius = Math.max(0.065, (pase.diametroMm / 1000) * 1.15);
    const sleeveMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(outerRadius, outerRadius, 0.56, 24),
      new THREE.MeshStandardMaterial({
        color: pase.colorHex,
        emissive: pase.colorHex,
        emissiveIntensity: 0.55,
        roughness: 0.25,
        metalness: 0.35
      })
    );
    paseGroup.add(sleeveMesh);

    [0.02, -0.19].forEach((ry) => {
      const collarRing = new THREE.Mesh(
        new THREE.TorusGeometry(outerRadius * 1.45, 0.018, 12, 24),
        new THREE.MeshBasicMaterial({ color: 0xfef08a })
      );
      collarRing.rotation.x = Math.PI / 2;
      collarRing.position.y = ry;
      paseGroup.add(collarRing);
    });

    const paseMeta = {
      type: 'pase_losa1_diamantado',
      bankCategory: 'refaccion_amarillo',
      name: `${pase.codigo} — ${pase.nombre}`,
      dimensions: `Diámetro Perforación: Ø ${pase.diametroMm} mm • Ubicación: ${pase.ejeRef}`,
      costo: 'Incluido en Perforaciones con Copa Diamantada (Gs. 280.000 c/u)',
      status: 'A Perforar con Sacabocado Diamantado en Losa 1 Existente (Cero Corte de Vigas) 💎🕳️',
      desc: `${pase.conductores} Método: ${pase.metodoEjecucion}`
    };
    paseGroup.userData = paseMeta;
    paseGroup.traverse((ch) => {
      if (ch.isMesh) ch.userData = paseMeta;
    });
    group.add(paseGroup);
  });

  // ==========================================================================
  // 2. TABLEROS ELÉCTRICOS (CON MONITOREO INTELIGENTE RIEL DIN CHINA), MEDIDOR ESSAP Y CISTERNA + PRESURIZADORA
  // ==========================================================================
  (DUCTOS_PASES_ENCHUFES_DATOS.tablerosYEquiposPrincipales || []).forEach((eq) => {
    const eqGroup = new THREE.Group();
    eqGroup.position.set(...eq.pos3D);

    if (eq.id === 'HID_CISTERNA_BOMBA') {
      const tankMesh = new THREE.Mesh(
        new THREE.CylinderGeometry(0.55, 0.55, 1.35, 24),
        new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.35, metalness: 0.15 })
      );
      eqGroup.add(tankMesh);

      const tankLid = new THREE.Mesh(
        new THREE.CylinderGeometry(0.24, 0.24, 0.08, 18),
        new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.5 })
      );
      tankLid.position.set(0, 0.70, 0);
      eqGroup.add(tankLid);

      const pumpBody = new THREE.Mesh(
        new THREE.BoxGeometry(0.34, 0.28, 0.26),
        new THREE.MeshStandardMaterial({ color: 0x16a34a, emissive: 0x15803d, emissiveIntensity: 0.35, roughness: 0.3 })
      );
      pumpBody.position.set(0.68, -0.45, 0);
      eqGroup.add(pumpBody);
    } else {
      const isMainBoard = eq.id === 'TAB_TP_PB';
      const boxW = isMainBoard ? 0.42 : 0.32;
      const boxH = isMainBoard ? 0.54 : 0.38;
      const boxD = 0.14;

      const boardBox = new THREE.Mesh(
        new THREE.BoxGeometry(boxW, boxH, boxD),
        new THREE.MeshStandardMaterial({
          color: 0x1e293b,
          emissive: eq.colorHex,
          emissiveIntensity: 0.35,
          roughness: 0.25,
          metalness: 0.6
        })
      );
      eqGroup.add(boardBox);

      const dinLed = new THREE.Mesh(
        new THREE.BoxGeometry(boxW * 0.72, 0.06, 0.02),
        new THREE.MeshBasicMaterial({ color: 0x22c55e })
      );
      dinLed.position.set(0, boxH * 0.22, boxD / 2 + 0.01);
      eqGroup.add(dinLed);

      if (isMainBoard) {
        mainBoardDinLedMesh = dinLed;
        mainBoardBoxMesh = boardBox;
      }
    }

    const eqMeta = {
      type: 'tablero_o_equipo_mep',
      bankCategory: 'nuevo_rojo',
      name: `${eq.codigo} — ${eq.nombre}`,
      dimensions: `Nivel: ${eq.nivel}`,
      costo: eq.id.startsWith('TAB_')
        ? 'Compatible con Kit Compra China Riel DIN Zigbee/LAN (Gs. 2.365.000 lote completo)'
        : 'Incluido en Instalaciones Hidrosanitarias (Partida 7.2)',
      status: 'Monitoreo Activo y Prevención de Fallas ⚡💧',
      desc: eq.especificacion
    };
    eqGroup.userData = eqMeta;
    eqGroup.traverse((ch) => {
      if (ch.isMesh) ch.userData = eqMeta;
    });
    group.add(eqGroup);
  });

  // ==========================================================================
  // 3. TRAZADO 3D DE ELECTRODUCTOS Y CIRCUITOS POR FASE (R: A/C, S: COCINA 20A, T: ILUMINACIÓN/TOMAS)
  // ==========================================================================
  const trunkRoute = addTubePath(
    [
      new THREE.Vector3(-4.72, 1.35, -3.95),
      new THREE.Vector3(-4.72, -0.55, -3.95),
      new THREE.Vector3(-1.64, -0.55, 1.40),
      new THREE.Vector3(-1.64, -0.25, 4.65),
      new THREE.Vector3(-1.55, 1.55, 4.65)
    ],
    0.032,
    0xf59e0b,
    {
      type: 'ducto_electrico_troncal',
      bankCategory: 'nuevo_rojo',
      name: 'Ducto Troncal Subterráneo ANDE (Caño PVC Pesado Ø 50mm + Cable Sintenax NYY 4×10 mm²)',
      dimensions: 'Tramo Pilastra Calle (z=-3.95m) → Bajo Relleno Cochera → Pase Diamantado #1 (z=4.65m) → TP-PB',
      costo: 'Incluido en Partida 7.1 (Debe enterrarse ANTES de compactar la cochera)',
      status: 'Alimentador Trifásico Principal 3×380/220V ⚡',
      desc: 'Ingresa subterráneo a -0.55m bajo el estacionamiento, cruza el Pasillo Antihumedad engrapado bajo viga y sube por el Pase Diamantado #1 (x=-1.64m, z=4.65m) directo al Tablero Principal TP-PB.'
    }
  );

  const riserRoute = addTubePath(
    [
      new THREE.Vector3(-1.64, -0.85, 4.65),
      new THREE.Vector3(-1.64, 0.00, 4.65),
      new THREE.Vector3(-1.55, 1.55, 4.65),
      new THREE.Vector3(-1.55, 2.92, 4.65),
      new THREE.Vector3(-0.55, 2.92, 4.65),
      new THREE.Vector3(-0.55, 4.45, 4.65)
    ],
    0.028,
    0xef4444,
    {
      type: 'ducto_electrico_montante',
      bankCategory: 'nuevo_rojo',
      name: 'Columna Montante Eléctrica 3 Niveles (TS-SUB ↔ Pase Diamantado #1 Losa 1 ↔ TP-PB ↔ TS-PA 2do Piso)',
      dimensions: 'Conductores Antiflama 5×6 mm² en Caño Ø 1" (3 Niveles Conectados)',
      status: 'Columna Vertebral Eléctrica c/ Monitoreo Riel DIN 🎯',
      desc: 'Une el Tablero Principal TP-PB con el Subtablero del Subsuelo (atravesando el Pase Diamantado #1 en la Losa 1 existente) y sube hacia el Subtablero TS-PA del 2do Piso.'
    }
  );

  // Ramales Planta Baja (Fase S Cocina/Comedor en Eje 5..9 y Fase T Estar/Escaleras en Eje 1..5)
  const pbKitchenRoute1 = addTubePath(
    [
      new THREE.Vector3(-1.55, 1.55, 4.65),
      new THREE.Vector3(-1.55, 0.035, 4.65),
      new THREE.Vector3(-2.10, 0.035, 4.65),
      new THREE.Vector3(-2.32, 0.035, 3.12),
      new THREE.Vector3(-2.32, 1.12, 3.08)
    ],
    0.018,
    0xf97316,
    {
      type: 'ducto_carpeta_pb',
      bankCategory: 'nuevo_rojo',
      name: 'Electroducto Fase S (Cocina 20A) — Mesada Húmeda Eje F–G y Air Fryer',
      dimensions: 'Caño Corrugado ¾" en Carpeta de 5cm sobre Losa 1 (Cero Picado)',
      status: 'Circuito 20A Cocina sobre Muro Húmedo Eje F–G ✨',
      desc: 'Alimenta los tomacorrientes de 20A sobre la mesada de granito en Eje F–G.'
    }
  );

  const pbKitchenRoute2 = addTubePath(
    [
      new THREE.Vector3(-2.10, 0.035, 4.65),
      new THREE.Vector3(-4.72, 0.035, 4.55),
      new THREE.Vector3(-4.72, 1.05, 4.55),
      new THREE.Vector3(-4.72, 1.85, 3.92)
    ],
    0.018,
    0xf97316,
    {
      type: 'ducto_carpeta_pb',
      bankCategory: 'nuevo_rojo',
      name: 'Electroducto Fase S (Cocina 20A) — Heladera, Microondas y Campana Extractora',
      dimensions: 'Caño Corrugado ¾" + Cable 4 mm²',
      status: 'Circuito Dedicado Electrodomésticos Cocina ✨',
      desc: 'Alimenta la heladera, el horno microondas y la campana en el sector Sur/Izquierdo (Eje 5 a 9).'
    }
  );

  const pbLightsRoute1 = addTubePath(
    [
      new THREE.Vector3(-1.55, 1.55, 4.65),
      new THREE.Vector3(0.25, 0.035, 3.15),
      new THREE.Vector3(3.42, 0.035, 3.15),
      new THREE.Vector3(3.75, 0.035, 5.45),
      new THREE.Vector3(3.75, 0.55, 5.45)
    ],
    0.018,
    0x38bdf8,
    {
      type: 'ducto_carpeta_pb',
      bankCategory: 'nuevo_rojo',
      name: 'Electroducto Fase T — Estar (Eje 1–5), TV 32" y Escalera 2 (Costado Norte/Derecho)',
      dimensions: 'Caño Corrugado ¾" en Carpeta PB',
      status: 'Iluminación Zigbee + Tomas Estar ✨',
      desc: 'Recorre el Estar en el sector Norte/Derecho (x=-0.74..+3.84m) y alimenta la Escalera 2.'
    }
  );

  const pbAcRoute = addTubePath(
    [
      new THREE.Vector3(-1.55, 1.55, 4.65),
      new THREE.Vector3(1.80, 0.035, 5.26),
      new THREE.Vector3(3.80, 0.035, 7.50),
      new THREE.Vector3(3.80, 2.35, 7.50)
    ],
    0.018,
    0xa855f7,
    {
      type: 'ducto_carpeta_pb',
      bankCategory: 'nuevo_rojo',
      name: 'Electroducto Fase R (Climatización Split Inverter) — Estar y Comedor PB',
      dimensions: 'Caño ¾" + Conductores 4 mm² Independientes p/ Aire Acondicionado',
      status: 'Fase R Dedicada a Climatización Inverter ❄️⚡',
      desc: 'Circuito exclusivo en Fase R para evitar parpadeos luminosos durante el arranque de compresores.'
    }
  );

  // Ramales 2do Piso (Y = +2.92m): Suite, Vestidor/Baño en Suite, Dormitorio 2, SSHH 2 y Desk
  const paAcSuiteRoute = addTubePath(
    [
      new THREE.Vector3(-0.55, 4.45, 4.65),
      new THREE.Vector3(-0.55, 2.92, 4.65),
      new THREE.Vector3(-4.72, 2.92, 7.50),
      new THREE.Vector3(-4.72, 5.05, 7.50),
      new THREE.Vector3(0.55, 5.05, 7.50)
    ],
    0.018,
    0xa855f7,
    {
      type: 'ducto_2dopiso',
      bankCategory: 'nuevo_rojo',
      name: 'Electroducto Fase R (Climatización 2do Piso) — Splits Dormitorio en Suite y Dormitorio 2',
      dimensions: 'Caño Ø ¾" + Cable Antiflama 4 mm² en Planta Alta',
      status: 'Climatización Inverter 2do Piso ❄️⚡',
      desc: 'Alimenta las unidades Split Inverter del Dormitorio Principal en Suite (Eje 5–9) y del Dormitorio 2 (Eje 2–5).'
    }
  );

  const paWetCoreRoute = addTubePath(
    [
      new THREE.Vector3(-0.55, 4.45, 4.65),
      new THREE.Vector3(-1.80, 2.92, 3.45),
      new THREE.Vector3(-1.80, 4.65, 3.45),
      new THREE.Vector3(2.65, 4.25, 3.45)
    ],
    0.018,
    0xf97316,
    {
      type: 'ducto_2dopiso',
      bankCategory: 'nuevo_rojo',
      name: 'Electroducto 20A Núcleo Húmedo 2do Piso (Eje F–G) — Termocalefón 80L, Baño en Suite y SSHH 2',
      dimensions: 'Caño Ø ¾" sobre Muro Húmedo Frontal Eje F–G (z=3.00..5.00m)',
      status: 'Potencia 20A Baños Superpuestos Eje F–G 🔥⚡',
      desc: 'Alimenta el Termocalefón de 80L y los tomacorrientes de 20A de los dos baños de Planta Alta sobre el Eje F–G.'
    }
  );

  const paDeskLightsRoute = addTubePath(
    [
      new THREE.Vector3(-0.55, 4.45, 4.65),
      new THREE.Vector3(1.80, 2.92, 7.50),
      new THREE.Vector3(3.45, 2.92, 8.65),
      new THREE.Vector3(3.45, 3.75, 8.65)
    ],
    0.018,
    0x38bdf8,
    {
      type: 'ducto_2dopiso',
      bankCategory: 'nuevo_rojo',
      name: 'Electroducto Fase T — Escritorio / Desk (Al Subir Escalera 2 en Eje 1–2) e Iluminación PA',
      dimensions: 'Caño Ø ¾" con Hilo Neutro Celeste para Llaves Zigbee',
      status: 'Alimentación Home-Office / Desk y Luces PA 💡💻',
      desc: 'Alimenta los escritorios, biblioteca y máquina de coser ubicados inmediatamente al subir la Escalera 2.'
    }
  );

  // Ramales Subsuelo (Y = -0.32m bajo viga)
  const subPumpRoute = addTubePath(
    [
      new THREE.Vector3(-1.64, -0.85, 4.65),
      new THREE.Vector3(-1.64, -0.32, 4.65),
      new THREE.Vector3(-4.25, -0.32, 3.65),
      new THREE.Vector3(-4.25, -1.65, 3.65)
    ],
    0.018,
    0x94a3b8,
    {
      type: 'ducto_subsuelo_viga',
      bankCategory: 'nuevo_rojo',
      name: 'Electroducto Galvanizado Daisa por Lateral de Viga en Subsuelo (Hacia Bomba Presurizadora y Depósito)',
      dimensions: 'Caño Galvanizado Ø ¾" engrapado al costado de vigas existentes',
      status: 'Instalación Industrial Prolija en Subsuelo 🎯',
      desc: 'Lleva energía por caño galvanizado visto adosado al lateral de las vigas sin picar la Losa 1.'
    }
  );

  const subLaundryAndBbqRoute = addTubePath(
    [
      new THREE.Vector3(-1.64, -0.85, 4.65),
      new THREE.Vector3(-3.25, -0.32, 6.90),
      new THREE.Vector3(-3.25, -1.35, 6.90),
      new THREE.Vector3(-3.25, -1.35, 12.65)
    ],
    0.018,
    0x94a3b8,
    {
      type: 'ducto_subsuelo_viga',
      bankCategory: 'nuevo_rojo',
      name: 'Electroducto 20A Subsuelo — Lavadero y Parrillita / Quincho Inferior hacia el Patio (z=12.65m)',
      dimensions: 'Caño Ø ¾" + Conductores 4 mm² + Tierra',
      status: 'Circuito Lavadero + Quincho Subsuelo 🎯',
      desc: 'Alimenta el Lavarropas en el Subsuelo y la iluminación/extractor de la Parrillita mirando al patio trasero.'
    }
  );

  // ==========================================================================
  // 4. RED HIDROSANITARIA 3D SUPERPUESTA VERTICALMENTE SOBRE EL NÚCLEO HÚMEDO EJE F–G (z = 3.00m..5.00m)
  // ==========================================================================
  // 4A. Agua Fría Presurizada PPR PN20 Ø25mm (Azul): Cisterna Subsuelo → Núcleo Húmedo Eje F–G (Cocina PB, Baño Social PB, Baño en Suite PA, SSHH 2 PA y Parrillita Subsuelo)
  addTubePath(
    [
      new THREE.Vector3(-3.40, 0.15, -4.15),
      new THREE.Vector3(-3.40, -0.50, -4.15),
      new THREE.Vector3(-4.25, -0.50, 2.80),
      new THREE.Vector3(-4.25, -1.65, 3.65),
      new THREE.Vector3(-2.20, -1.65, 3.25),
      new THREE.Vector3(-2.20, 0.00, 3.25),
      new THREE.Vector3(-3.15, 0.85, 3.25),
      new THREE.Vector3(-1.05, 0.85, 3.25),
      new THREE.Vector3(-1.80, 3.65, 3.25),
      new THREE.Vector3(2.65, 3.65, 3.25)
    ],
    0.022,
    0x0284c7,
    {
      type: 'tuberia_agua_fria_ppr',
      bankCategory: 'nuevo_rojo',
      name: 'Columna Montante Única de Agua Fría Presurizada PPR PN20 Ø 25mm sobre Núcleo Húmedo Eje F–G (z=3.25m)',
      dimensions: 'Tubo PPR Tricapa Ø 25mm (¾") • 100% Vertical en Eje F–G (Subsuelo ↔ PB ↔ PA)',
      status: 'Núcleo Húmedo Superpuesto según Plano Sanitario Original 💧',
      desc: 'Al estar el Baño en Suite PA y el SSHH 2 PA exactamente superpuestos sobre el Baño Social PB y la Cocina PB en el Eje F–G (z=3.00..5.00m), toda la distribución de agua fría presurizada sube por una única montante vertical.'
    }
  );

  // 4B. Agua Caliente Termofusión PPR PN20 Ø20mm (Rojo) en Núcleo Húmedo Eje F–G
  addTubePath(
    [
      new THREE.Vector3(-2.35, 4.65, 3.32), // Termocalefón 80L en Baño Suite Eje F-G
      new THREE.Vector3(-1.45, 3.80, 3.32), // Ducha y Vanitory Baño en Suite PA
      new THREE.Vector3(2.55, 3.80, 3.32),  // Ducha y Vanitory SSHH 2 PA
      new THREE.Vector3(-2.20, 0.88, 3.32), // Baja directo a Bacha de Cocina PB en Eje F-G
      new THREE.Vector3(-3.15, 0.88, 3.32)
    ],
    0.019,
    0xdc2626,
    {
      type: 'tuberia_agua_caliente_ppr',
      bankCategory: 'nuevo_rojo',
      name: 'Red de Agua Caliente Termofusión PPR PN20 Ø 20mm sobre Núcleo Húmedo Eje F–G',
      dimensions: 'Tramo Corto de Alta Eficiencia Térmica en Eje F–G (Baño Suite + SSHH 2 + Cocina PB)',
      status: 'Agua Caliente Instantánea sin Pérdida Térmica 🔥🚿',
      desc: 'Conecta el Termocalefón en el Eje F–G con el Baño en Suite, el SSHH 2 de Planta Alta y baja verticalmente a la Bacha Doble de la Cocina en Planta Baja.'
    }
  );

  // 4C. Columna Cloacal Vertical Única PVC Ø100mm en Eje F–G + Colector hacia Cámara Séptica y Pozo Ciego
  addTubePath(
    [
      new THREE.Vector3(-1.45, 6.15, 3.65),  // Ventilación Ø75mm a los 4 vientos sobre el techo
      new THREE.Vector3(2.60, 3.10, 3.65),   // Inodoro/Ducha SSHH 2 PA (Eje F-G)
      new THREE.Vector3(-1.45, 3.05, 3.65),  // Inodoro/Bidet/Ducha Baño en Suite PA (Eje F-G)
      new THREE.Vector3(-1.45, 0.05, 3.65),  // Inodoro SSHH / Baño Social PB + Bacha Cocina PB (Eje F-G)
      new THREE.Vector3(-2.85, -2.25, 3.85), // Pie de columna en Subsuelo
      new THREE.Vector3(-3.25, -2.35, 6.90), // Lavadero Subsuelo
      new THREE.Vector3(-3.25, -2.42, 12.65),// Bacha Parrillita Subsuelo
      new THREE.Vector3(-3.25, -2.95, 14.55),// Cámara Desgrasadora
      new THREE.Vector3(-3.25, -3.25, 16.55),// Cámara Séptica Bicameral
      new THREE.Vector3(-3.25, -3.45, 20.20) // Pozo Ciego Absorbente
    ],
    0.045,
    0xb45309,
    {
      type: 'columna_cloacal_y_ventilacion',
      bankCategory: 'nuevo_rojo',
      name: 'Columna Montante Cloacal Vertical Única PVC Ø 100mm en Núcleo Húmedo Eje F–G + Colector a Cámara Séptica y Pozo Ciego',
      dimensions: 'Caño PVC Pesado Ø 100mm 100% Vertical en Eje F–G + Colector Subsuelo Pendiente >2%',
      status: 'Desagüe 100% Vertical Alineado al Plano Sanitario Original ♻️',
      desc: 'Todos los núcleos húmedos de Planta Alta (Vestidor/Baño en Suite y SSHH 2) y Planta Baja (SSHH Social y Cocina) descargan verticalmente sobre el Eje F–G (z=3.00..5.00m) hacia el colector del subsuelo y la Cámara Séptica / Pozo Ciego.'
    }
  );

  // ==========================================================================
  // 5. CAJAS DE ENCHUFES 20A (ROJOS) Y 16A (AZULES) + INTERRUPTORES ZIGBEE 3-WAY (VERDES)
  // ==========================================================================
  const mat20A = new THREE.MeshStandardMaterial({
    color: 0xef4444,
    emissive: 0xdc2626,
    emissiveIntensity: 0.55,
    roughness: 0.25
  });
  const mat16A = new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    emissive: 0x0284c7,
    emissiveIntensity: 0.5,
    roughness: 0.25
  });

  (DUCTOS_PASES_ENCHUFES_DATOS.enchufesYTomacorrientes || []).forEach((toma) => {
    const is20A = toma.tipo === 'toma_20a';
    const boxGroup = new THREE.Group();
    boxGroup.position.set(...toma.pos3D);

    const plate = new THREE.Mesh(
      new THREE.BoxGeometry(0.11, 0.08, 0.065),
      is20A ? mat20A : mat16A
    );
    boxGroup.add(plate);

    [-0.024, 0, 0.024].forEach((ox) => {
      const pinHole = new THREE.Mesh(
        new THREE.CylinderGeometry(0.008, 0.008, 0.07, 8),
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
    group.add(boxGroup);
  });

  const switchMat = new THREE.MeshStandardMaterial({
    color: 0x10b981,
    emissive: 0x059669,
    emissiveIntensity: 0.6,
    roughness: 0.2
  });

  (DUCTOS_PASES_ENCHUFES_DATOS.llavesYConmutadas3Way || []).forEach((sw) => {
    const swGroup = new THREE.Group();
    swGroup.position.set(...sw.pos3D);

    const swPlate = new THREE.Mesh(
      new THREE.BoxGeometry(0.10, 0.10, 0.06),
      switchMat
    );
    swGroup.add(swPlate);

    if (sw.label.includes('Emergencia')) {
      const emLight = new THREE.Mesh(
        new THREE.BoxGeometry(0.22, 0.08, 0.05),
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
      status: 'Interruptor Inteligente Conectado a Red Interna LAN/Zigbee 🟢💡',
      desc: 'Al hacerse la instalación de cero, todas las cajas de interruptores reciben hilo Neutro (Celeste), permitiendo usar llaves inteligentes Zigbee 3.0 con tecla física, estado en tiempo real y conmutación 3-Way en escaleras y dormitorio.'
    };
    swGroup.userData = swMeta;
    swGroup.traverse((ch) => {
      if (ch.isMesh) ch.userData = swMeta;
    });
    group.add(swGroup);
  });

  // ==========================================================================
  // 6. SIMULADOR INTERACTIVO ELÉCTRICO Y DE FALLAS EN VIVO:
  //    - Circuitos animados por fase: 'phase_R_ac', 'phase_S_kitchen', 'phase_T_lights'
  //    - Simulación de fallas: 'fault_leak_30ma', 'fault_overtemp_65c', 'fault_flood_subsuelo'
  //      con destellos de alerta en el punto de falla y corte automático en Tablero DIN (TP-PB)
  // ==========================================================================
  const elecSimSubGroups = {
    phase_R_ac: new THREE.Group(),
    phase_S_kitchen: new THREE.Group(),
    phase_T_lights: new THREE.Group(),
    fault_leak_30ma: new THREE.Group(),
    fault_overtemp_65c: new THREE.Group(),
    fault_flood_subsuelo: new THREE.Group()
  };
  Object.values(elecSimSubGroups).forEach((sg) => group.add(sg));

  const animatedCurrentPulses = [];
  const registerCircuitPulses = (routeObj, phaseKey, colorHex) => {
    if (!routeObj || !routeObj.curve) return;
    const pulseMat = new THREE.MeshBasicMaterial({ color: colorHex });
    for (let i = 0; i < 8; i++) {
      const pMesh = new THREE.Mesh(new THREE.SphereGeometry(0.052, 8, 8), pulseMat);
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
  registerCircuitPulses(paDeskLightsRoute, 'phase_T_lights', 0x38bdf8);
  registerCircuitPulses(subPumpRoute, 'phase_T_lights', 0x38bdf8);

  // Marcadores 3D de Falla en Vivo + Alerta de Corte en Tablero Principal DIN (TP-PB en x=-1.55, y=1.55, z=4.65)
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

    // Línea de disparo directo hacia el Tablero Inteligente DIN TP-PB (-1.55, 1.55, 4.65)
    const tripCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(...pos),
      new THREE.Vector3(-1.55, pos[1], 4.65),
      new THREE.Vector3(-1.55, 1.55, 4.65)
    ]);
    const tripTube = new THREE.Mesh(
      new THREE.TubeGeometry(tripCurve, 20, 0.025, 8, false),
      new THREE.MeshBasicMaterial({ color: 0xef4444 })
    );
    fGroup.add(tripTube);

    // Halo de corte automático en el Tablero TP-PB
    const boardAlertHalo = new THREE.Mesh(
      new THREE.BoxGeometry(0.54, 0.66, 0.22),
      new THREE.MeshBasicMaterial({ color: 0xef4444, wireframe: true })
    );
    boardAlertHalo.position.set(-1.55, 1.55, 4.65);
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
    [-1.45, 3.65, 3.45],
    0xef4444,
    '🚨 Falla Simulada: Fuga a Tierra > 30mA en Termocalefón / Ducha Baño Suite (Eje F–G)',
    'El disyuntor diferencial electrónico Riel DIN detecta una corriente diferencial > 30 mA en menos de 25 ms y corta automáticamente el circuito en el Tablero TP-PB, protegiendo la vida de Ruth y Leo.'
  );
  createFaultBeacon(
    'fault_overtemp_65c',
    [-2.32, 1.12, 3.25],
    0xf97316,
    '🚨 Falla Simulada: Sobretemperatura > 65°C en Toma 20A de Cocina (Eje F–G)',
    'La llave térmica inteligente Zigbee Riel DIN detecta sobreconsumo y temperatura > 65°C en el circuito de Cocina 20A, abriendo el relé en el Tablero TP-PB y enviando alerta al celular.'
  );
  createFaultBeacon(
    'fault_flood_subsuelo',
    [-3.25, -2.20, 6.90],
    0x38bdf8,
    '🚨 Falla Simulada: Sensor de Inundación Activo en Subsuelo (Lavadero / Cisterna)',
    'El sensor Zigbee de agua en el piso del Subsuelo detecta pérdida hidráulica, cierra la válvula motorizada de la Bomba Rowa y corta el circuito del Subsuelo en TP-PB.'
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

  group.userData.updateElectricalAnimation = (t = performance.now() * 0.001) => {
    if (!group.visible || currentElecSimState === 'off') return;

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


