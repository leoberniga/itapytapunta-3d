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

  // 6. ANIMACIÓN DE FLUJO DE AGUA DE LLUVIA EN 3D (Desde el Techo del 2do Piso Y=+6.15m / +5.55m hasta el Barranco)
  const dropGeom = new THREE.SphereGeometry(0.095, 10, 10);
  const dropMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });

  const roofWestPath = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-2.5, 6.1, 5.0),
    new THREE.Vector3(-3.8, 5.58, 20.2),
    new THREE.Vector3(-4.12, 3.0, 20.1),
    new THREE.Vector3(-4.12, 0.0, 20.1),
    new THREE.Vector3(-4.25, -2.85, 20.1)
  ]);
  const roofEastPath = new THREE.CatmullRomCurve3([
    new THREE.Vector3(2.5, 6.1, 5.0),
    new THREE.Vector3(3.8, 5.58, 20.2),
    new THREE.Vector3(4.12, 3.0, 20.1),
    new THREE.Vector3(4.12, 0.0, 20.1),
    new THREE.Vector3(4.25, -2.85, 20.1)
  ]);

  const allPaths = [westCurve, eastCurve, roofWestPath, roofEastPath];
  allPaths.forEach((curve, pathIdx) => {
    const count = 12;
    for (let i = 0; i < count; i++) {
      const drop = new THREE.Mesh(dropGeom, dropMat);
      const tOffset = i / count;
      const pt = curve.getPointAt(tOffset);
      drop.position.copy(pt);
      group.add(drop);
      animatedDrops.push({
        mesh: drop,
        curve,
        t: tOffset,
        speed: pathIdx >= 2 ? 0.0055 : 0.0038
      });
    }
  });

  group.userData.updateWaterAnimation = () => {
    if (!group.visible) return;
    animatedDrops.forEach((item) => {
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
 * 1) LOS 4 PASES CON SACABOCADO DIAMANTADO EN LA LOSA 1 EXISTENTE (Y = 0.00m, que hoy NO está agujereada):
 *    - Pase #1 (Ø50mm en x=-1.64, z=4.65): Troncal Eléctrico 5×6mm² / 4×10mm² (TP-PB ↔ TS-SUB y TS-PA).
 *    - Pase #2 (Ø50mm en x=-1.64, z=5.35): Fibra Óptica, 6× UTP Cat6 PoE, Coordinador Zigbee PoE y Alarma.
 *    - Pase #3 (Ø115mm en x=-4.65, z=7.20): Columna de Bajada Cloacal Vertical PVC Ø100mm insonorizada.
 *    - Pase #4 (Ø63mm en x=-4.65, z=6.65): Montantes Agua Fría Presurizada PPR Ø25mm + Agua Caliente PPR Ø20mm.
 * 2) TABLEROS ELÉCTRICOS CON EQUIPAMIENTO INTELIGENTE RIEL DIN (COMPRA CHINA / ANDE):
 *    - Pilastra Trifásica ANDE 3×40A (z=-3.95m), TP-PB 36-48 DIN (con Medidor Trifásico CT Zigbee + 3 Protectores Tensión + DPS 40kA + 6 Llaves DIN Inteligentes), TS-PA (2do Piso) y TS-SUB (Subsuelo IP65).
 * 3) ELECTRODUCTOS POR CONTRAPISO/CARPETA (SOBRE LOSA 1 SIN PICAR), MUROS Y VIGAS DE SUBSUELO.
 * 4) TODOS LOS ENCHUFES DE 20A (ROJOS) Y 16A (AZULES) + INTERRUPTORES INTELIGENTES ZIGBEE CON NEUTRO Y 3-WAY (VERDES).
 * 5) RED HIDROSANITARIA COMPLETA: Cisterna Tricapa 1.000L + Bomba Presurizadora Inteligente Rowa/Pedrollo en Subsuelo,
 *    Tuberías PPR Agua Fría (Azul) y Agua Caliente (Rojo), Columna Cloacal Ø100mm y Ventilación Ø75mm a 4 vientos (+106.15m).
 */
export function buildConduitsOutletsAndPlumbingLayer(THREE, sceneGroups) {
  const group = (sceneGroups && sceneGroups.ductosYEnchufes) ? sceneGroups.ductosYEnchufes : new THREE.Group();
  group.clear();

  const addTubePath = (pointsVec3, radius, colorHex, meta) => {
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
    group.add(mesh);
    return mesh;
  };

  // ==========================================================================
  // 1. LOS 4 PASES DE LOSA CON SACABOCADO DIAMANTADO EN LA LOSA 1 EXISTENTE (Y = 0.00m)
  // ==========================================================================
  (DUCTOS_PASES_ENCHUFES_DATOS.pasesLosa1Diamantados || []).forEach((pase) => {
    const paseGroup = new THREE.Group();
    paseGroup.position.set(...pase.pos3D);

    const outerRadius = Math.max(0.065, (pase.diametroMm / 1000) * 1.15);
    // Camisa vertical atravesando los 18cm de la Losa 1 existente (sobresale arriba y abajo para visualización clara)
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

    // Anillo de corte diamantado sobre la cara superior de Losa 1 (Y = +0.02m) y cara inferior (Y = -0.19m)
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
      // Tanque Cisterna Tricapa 1.000L en Subsuelo + Bomba Presurizadora Inteligente Rowa/Pedrollo
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

      // Bomba Presurizadora Inteligente al lado del tanque cisterna con válvula inteligente
      const pumpBody = new THREE.Mesh(
        new THREE.BoxGeometry(0.34, 0.28, 0.26),
        new THREE.MeshStandardMaterial({ color: 0x16a34a, emissive: 0x15803d, emissiveIntensity: 0.35, roughness: 0.3 })
      );
      pumpBody.position.set(0.68, -0.45, 0);
      eqGroup.add(pumpBody);
    } else {
      // Tablero Eléctrico (TP-PB, TS-PA, TS-SUB, Pilastra ANDE) con puerta acrílica fumée y LEDs de monitoreo inteligente DIN
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

      // Display digital de Voltaje / Amperaje / kWh (Llaves Generales Inteligentes DIN China)
      const dinLed = new THREE.Mesh(
        new THREE.BoxGeometry(boxW * 0.72, 0.06, 0.02),
        new THREE.MeshBasicMaterial({ color: 0x22c55e })
      );
      dinLed.position.set(0, boxH * 0.22, boxD / 2 + 0.01);
      eqGroup.add(dinLed);
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
  // 3. TRAZADO 3D DE ELECTRODUCTOS (NARANJA = POTENCIA / VIOLETA = DATOS)
  //    Y CAÑERÍAS HIDROSANITARIAS (AZUL = AGUA FRÍA PPR / ROJO = AGUA CALIENTE PPR / TERRACOTA = CLOACA Ø100mm)
  // ==========================================================================
  // 3A. Acometida Subterránea ANDE 4×10mm² en PVC Ø50mm bajo Cochera (de Pilastra z=-3.95m a Pase #1 x=-1.64, z=4.65m y TP-PB)
  addTubePath(
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

  // 3B. Columna Montante Eléctrica Vertical desde TP-PB (Y=1.55m) hacia Subtablero 2do Piso TS-PA (Y=4.45m) y Subtablero Subsuelo TS-SUB (Y=-0.85m)
  addTubePath(
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

  // 3C. Electroductos Embutidos en los 5cm de Contrapiso/Carpeta sobre la Losa 1 Existente (Y = +0.03m, CERO PICADO DE LOSA)
  const pbConduitRoutes = [
    // Circuito 20A Cocina (Air Fryer 6L + Microondas + Heladera + Isla)
    [
      new THREE.Vector3(-1.55, 1.55, 4.65),
      new THREE.Vector3(-1.55, 0.035, 4.65),
      new THREE.Vector3(-2.10, 0.035, 4.65),
      new THREE.Vector3(-2.32, 0.035, 3.12),
      new THREE.Vector3(-2.32, 1.12, 3.08)
    ],
    [
      new THREE.Vector3(-2.10, 0.035, 4.65),
      new THREE.Vector3(-4.72, 0.035, 4.55),
      new THREE.Vector3(-4.72, 1.05, 4.55),
      new THREE.Vector3(-4.72, 1.85, 3.92)
    ],
    // Circuito Sala, TV 32", Purificador Xiaomi y Llaves 3-Way Escalera
    [
      new THREE.Vector3(-1.55, 0.035, 4.65),
      new THREE.Vector3(0.25, 0.035, 3.15),
      new THREE.Vector3(3.42, 0.035, 3.15),
      new THREE.Vector3(3.75, 0.035, 5.45),
      new THREE.Vector3(3.75, 0.55, 5.45)
    ],
    // Circuito Biblioteca Nivel Calle y Galería L1
    [
      new THREE.Vector3(-4.72, 0.035, 4.55),
      new THREE.Vector3(-4.72, 0.035, 8.65),
      new THREE.Vector3(-4.72, -0.40, 11.45),
      new THREE.Vector3(-4.72, 0.45, 11.45)
    ]
  ];

  pbConduitRoutes.forEach((pts, idx) => {
    addTubePath(pts, 0.018, 0xf97316, {
      type: 'ducto_carpeta_pb',
      bankCategory: 'nuevo_rojo',
      name: `Electroducto Corrugado Pesado ¾" Embutido en Carpeta de Piso sobre Losa 1 (Ramal PB #${idx + 1})`,
      dimensions: 'Caño Corrugado Naranja Reforzado Ø ¾" dentro de los 5cm de Contrapiso/Carpeta (Cero Picado de Losa 1)',
      status: 'Tendido Horizontal Sin Debilitar Losa 1 Existente ✨',
      desc: 'Como la Losa 1 ya está hormigonada y no debe acanalarse, los caños horizontales corren ocultos dentro de los 5 cm de la carpeta niveladora antes de pegar el piso Porcelanato 60×60 y suben por las paredes nuevas de ladrillo Tobatí.'
    });
  });

  // 3D. Electroductos en 2do Piso (Y = +2.92m) desde TS-PA hacia Dormitorio Suite, Termocalefón 80L y Estudio Doble
  const paConduitRoutes = [
    [
      new THREE.Vector3(-0.55, 4.45, 4.65),
      new THREE.Vector3(-0.55, 2.92, 4.65),
      new THREE.Vector3(-4.72, 2.92, 6.10),
      new THREE.Vector3(-4.72, 4.95, 6.10)
    ],
    [
      new THREE.Vector3(-4.72, 2.92, 6.10),
      new THREE.Vector3(-4.72, 2.92, 8.89),
      new THREE.Vector3(-4.72, 3.65, 8.89),
      new THREE.Vector3(-4.72, 3.65, 10.81),
      new THREE.Vector3(-4.72, 5.15, 9.85)
    ],
    [
      new THREE.Vector3(-0.55, 2.92, 4.65),
      new THREE.Vector3(0.35, 2.92, 6.30),
      new THREE.Vector3(1.45, 2.92, 6.30),
      new THREE.Vector3(4.72, 2.92, 4.15),
      new THREE.Vector3(4.72, 3.55, 4.15)
    ]
  ];

  paConduitRoutes.forEach((pts, idx) => {
    addTubePath(pts, 0.018, 0xfb923c, {
      type: 'ducto_2dopiso',
      bankCategory: 'nuevo_rojo',
      name: `Electroducto 2do Piso (+102.88m) — Ramal Planta Alta #${idx + 1} (Con Hilo Neutro en Cajas de Luz)`,
      dimensions: 'Caño Ø ¾" en Losa Rap / Mampostería PA + Cable Antiflama INDECO/Prysmian + Neutro Celeste',
      status: 'Listo para Interruptores Inteligentes Zigbee y Aires Split ✨',
      desc: 'Distribuye energía desde el Subtablero TS-PA hacia la Suite de Ruth y Leo, el Termocalefón de 80L, los 2 Escritorios de Home-Office y el rincón de costura.'
    });
  });

  // 3E. Electroductos Galvanizados Vistos por Lateral de Vigas en Subsuelo (Y = -0.32m, sin picar fondo de Losa 1)
  addTubePath(
    [
      new THREE.Vector3(-1.64, -0.85, 4.65),
      new THREE.Vector3(-1.64, -0.32, 4.65),
      new THREE.Vector3(-4.70, -0.32, 3.65),
      new THREE.Vector3(-4.70, -1.15, 3.65)
    ],
    0.018,
    0x94a3b8,
    {
      type: 'ducto_subsuelo_viga',
      bankCategory: 'nuevo_rojo',
      name: 'Electroducto Galvanizado Daisa por Lateral de Viga en Subsuelo (Hacia Bomba Presurizadora y Depósito)',
      dimensions: 'Caño Galvanizado Ø ¾" engrapado al costado de vigas existentes (Cero Picado en Cielorraso de Losa 1)',
      status: 'Instalación Industrial Prolija en Subsuelo 🎯',
      desc: 'Evita acanalar la cara inferior de la Losa 1 existente (donde trabajan los hierros a tracción), llevando los cables por caño galvanizado visto adosado al lateral de las vigas.'
    }
  );
  addTubePath(
    [
      new THREE.Vector3(-1.64, -0.85, 4.65),
      new THREE.Vector3(-1.64, -0.32, 7.25),
      new THREE.Vector3(-3.25, -0.32, 7.25),
      new THREE.Vector3(-3.25, -1.25, 7.25)
    ],
    0.018,
    0x94a3b8,
    {
      type: 'ducto_subsuelo_viga',
      bankCategory: 'nuevo_rojo',
      name: 'Electroducto Dedicado 20A en Subsuelo hacia Lavarropas e Iluminación Lavadero',
      dimensions: 'Caño Ø ¾" + Conductores 4 mm² + Tierra Verde/Amarillo',
      status: 'Circuito 20A Lavadero Subsuelo 🎯',
      desc: 'Alimenta el Lavarropas automático de Ruth y Leo en el Subsuelo desde el Subtablero estanco TS-SUB.'
    }
  );

  // ==========================================================================
  // 4. RED HIDROSANITARIA 3D COMPLETA (AGUA FRÍA AZUL, AGUA CALIENTE ROJA Y CLOACA Ø100mm + VENTILACIÓN)
  // ==========================================================================
  // 4A. Agua Fría Presurizada PPR PN20 Ø25mm (Azul): Medidor ESSAP → Cisterna 1000L Subsuelo → Pase #4 → Cocina/Toilette PB → Baño Suite 2do Piso
  addTubePath(
    [
      new THREE.Vector3(-3.40, 0.15, -4.15),
      new THREE.Vector3(-3.40, -0.50, -4.15),
      new THREE.Vector3(-4.25, -0.50, 2.80),
      new THREE.Vector3(-4.25, -1.65, 3.65),
      new THREE.Vector3(-4.65, -1.65, 6.65),
      new THREE.Vector3(-4.65, 0.00, 6.65), // Cruza Pase Diamantado #4 en Losa 1
      new THREE.Vector3(-4.65, 0.55, 6.65),
      new THREE.Vector3(-3.15, 0.55, 3.42)  // Bacha de Cocina PB
    ],
    0.022,
    0x0284c7,
    {
      type: 'tuberia_agua_fria_ppr',
      bankCategory: 'nuevo_rojo',
      name: 'Red de Agua Fría Presurizada en Termofusión PPR PN20 Ø 25mm (Cisterna 1.000L + Presurizadora → 3 Niveles)',
      dimensions: 'Tubo PPR Tricapa Ø 25mm (¾") • Presión Constante 2,0 bar vía Pase Diamantado #4 (x=-4.65m, z=6.65m)',
      status: 'Presión Garantizada en 2do Piso aun con Baja Presión de ESSAP 💧',
      desc: 'El agua de ESSAP llena por gravedad la Cisterna de 1.000 L en el Subsuelo (-2.34m) y la Bomba Presurizadora Inteligente la impulsa por el Pase Diamantado #4 hacia el Lavadero, Cocina, Toilette y Baño en Suite del 2do Piso.'
    }
  );
  addTubePath(
    [
      new THREE.Vector3(-4.65, -1.20, 6.65),
      new THREE.Vector3(-2.85, -1.20, 6.90), // Lavadero Subsuelo
      new THREE.Vector3(-4.65, 0.55, 6.65),
      new THREE.Vector3(-4.65, 3.55, 6.65),  // Sube al Baño Suite 2do Piso
      new THREE.Vector3(-4.22, 4.85, 6.32)   // Alimenta Termocalefón 80L y Ducha 2do Piso
    ],
    0.022,
    0x0284c7,
    {
      type: 'tuberia_agua_fria_ppr',
      bankCategory: 'nuevo_rojo',
      name: 'Montante Vertical de Agua Fría Presurizada PPR Ø 25mm hacia Baño en Suite 2do Piso (+102.88m) y Termocalefón 80L',
      dimensions: 'Columna Vertical en Mocheta Eje 9 (Cruza Pase Diamantado #4 en Losa 1)',
      status: 'Alimentación Hidráulica 2do Piso 💧',
      desc: 'Sube agua presurizada hasta la cota +104.80m para alimentar el Termocalefón de 80L, la ducha lluvia, el inodoro dual-flush, el bidet y el vanitory del 2do Piso.'
    }
  );

  // 4B. Agua Caliente Termofusión PPR PN20 Ø20mm con Aislación Térmica (Rojo): Termocalefón 80L (2do Piso) → Ducha/Vanitory PA y baja por Pase #4 a Bacha de Cocina PB
  addTubePath(
    [
      new THREE.Vector3(-4.22, 4.85, 6.32), // Salida Termocalefón 80L en 2do Piso
      new THREE.Vector3(-4.60, 4.00, 6.32), // Ducha y Vanitory 2do Piso
      new THREE.Vector3(-4.60, 0.00, 6.60), // Baja por el Pase Diamantado #4 en Losa 1
      new THREE.Vector3(-4.60, 0.62, 3.42),
      new THREE.Vector3(-3.15, 0.62, 3.42)  // Bacha Doble de Cocina en Nivel Calle
    ],
    0.019,
    0xdc2626,
    {
      type: 'tuberia_agua_caliente_ppr',
      bankCategory: 'nuevo_rojo',
      name: 'Red de Agua Caliente en Termofusión PPR PN20 Ø 20mm c/ Coquilla Aislante (Corrige Omisión de Edifica «Solo Agua Fría»)',
      dimensions: 'Desde Termocalefón 80L (2do Piso) → Ducha/Vanitory Suite + Bajada por Pase #4 a Bacha de Cocina PB',
      status: 'Agua Caliente en Baño Suite y Cocina 🔥🚿',
      desc: 'Tubería de polipropileno copolímero random PN20 unida por termofusión a 260°C con funda aislante térmica para proveer agua caliente al Baño del 2do Piso y a la Bacha de Cocina en Nivel Calle.'
    }
  );

  // 4C. Columna Cloacal Vertical PVC Ø100mm Insonorizada (Terracota) + Caño de Ventilación Ø75mm a los 4 Vientos (+106.15m)
  addTubePath(
    [
      new THREE.Vector3(-4.65, 6.18, 7.20), // Sombrerete Ventilación Ø75mm a los 4 vientos sobre el Techo (+106.15m)
      new THREE.Vector3(-4.65, 3.10, 7.20), // Recibe Inodoro/Ducha Baño Suite 2do Piso
      new THREE.Vector3(-4.65, 0.00, 7.20), // Atraviesa Pase Diamantado #3 (Ø115mm) en Losa 1
      new THREE.Vector3(-4.65, -2.25, 7.20), // Recibe Toilette PB y Lavadero Subsuelo
      new THREE.Vector3(-3.65, -2.95, 14.55), // Cámara Desgrasadora / Inspección en Jardín
      new THREE.Vector3(-3.25, -3.25, 16.80), // Cámara Séptica Bicameral
      new THREE.Vector3(-3.25, -3.45, 20.20)  // Pozo Ciego Absorbente (a >1.50m de medianera Oeste y libre de la Piscina)
    ],
    0.045,
    0xb45309,
    {
      type: 'columna_cloacal_y_ventilacion',
      bankCategory: 'nuevo_rojo',
      name: 'Columna Cloacal Vertical PVC Ø 100mm (vía Pase Diamantado #3) + Ventilación Ø 75mm a 4 Vientos + Colector 2% a Cámara Séptica y Pozo Ciego',
      dimensions: 'Caño PVC Pesado Ø 100mm c/ Junta Elástica + Manta Fonoabsorbente + Pendiente 2% en Subsuelo/Patio',
      status: 'Evacuación por Gravedad en los 3 Niveles + Ventilación Anti-Olores ♻️',
      desc: 'Descarga por gravedad el Baño en Suite del 2do Piso, el Toilette/Cocina de Nivel Calle (atravesando el Pase Diamantado #3 Ø115mm en x=-4.65m, z=7.20m) y el Lavadero del Subsuelo hacia la Cámara Séptica y el Pozo Ciego Absorbente en el fondo, con ventilación superior a los 4 vientos (+106.15m).'
    }
  );

  // ==========================================================================
  // 5. CAJAS DE ENCHUFES / TOMACORRIENTES 20A (ROJOS) Y 16A (AZULES) EN LOS 3 NIVELES
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

    // 3 orificios del enchufe (Fase, Neutro y Tierra Verde-Amarillo obligatoria)
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

  // ==========================================================================
  // 6. LLAVES DE LUZ INTELIGENTES ZIGBEE CON NEUTRO Y COMBINADAS 3-WAY + LUCES DE EMERGENCIA EN ESCALERAS
  // ==========================================================================
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

    // Si incluye Luz de Emergencia Autónoma LED sobre la escalera, dibujarla a h=+2.15m
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

  if (sceneGroups) {
    sceneGroups.ductosYEnchufes = group;
  }

  return {
    group,
    data: DUCTOS_PASES_ENCHUFES_DATOS
  };
}

