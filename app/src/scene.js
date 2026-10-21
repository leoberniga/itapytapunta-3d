import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import {
  GEOTECHNICAL_DATA,
  ARCHITECTURAL_ROOMS,
  CURATED_PHOTOS,
  STRUCTURAL_ITEMS,
  ESCENARIOS_INVERSION
} from './data/projectData.js';
import entornoGeoData from './data/entornoGeoData.json';
import {
  buildPluvialAndHydroLayer,
  buildWeakSignalsLayer,
  buildConduitsOutletsAndPlumbingLayer,
  PLUVIAL_HYDRO_DATA,
  WEAK_SIGNALS_DATA
} from './mepSystems.js';
import {
  FIXED_STRUCTURAL_GRID,
  FIXED_COLUMNS_AND_FOOTINGS,
  WALL_CATALOG,
  OPENING_CATALOG
} from './floorplanEditor.js';
import {
  createArchVizMaterials,
  buildFacadeAndGate3D,
  buildExistingStaircase3D,
  buildHyperRealisticInterior3D,
  ROOM_CAMERA_PRESETS
} from './archVizInterior.js';

export class ProjectScene {
  constructor(container, onSelectObject, onMeasurementUpdate) {
    this.container = container;
    this.onSelectObject = onSelectObject;
    this.onMeasurementUpdate = onMeasurementUpdate;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0b1526);
    this.scene.fog = new THREE.FogExp2(0x0b1526, 0.0028);

    this.camera = new THREE.PerspectiveCamera(
      42,
      window.innerWidth / window.innerHeight,
      0.08,
      900
    );
    this.camera.position.set(16.5, 11.5, 22.0);

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: true
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.12;
    this.renderer.localClippingEnabled = true;
    this.container.appendChild(this.renderer.domElement);

    // Iluminación IBL Físicamente Basada (estilo Unity / Unreal ArchViz)
    const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
    pmremGenerator.compileEquirectangularShader();
    this.scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    this.scene.environmentIntensity = 0.65;

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.maxPolarAngle = Math.PI / 2 + 0.16;
    this.controls.minDistance = 0.8;
    this.controls.maxDistance = 160;
    this.controls.target.set(0, 1.1, 6.8);

    // Materiales PBR 1024x1024 de alta definición
    this.archVizMats = createArchVizMaterials(THREE);

    // Grupos de capas CAD / BIM / ArchViz
    this.groups = {
      topography: new THREE.Group(),
      urbanContext: new THREE.Group(),
      geotech: new THREE.Group(),
      structure: new THREE.Group(),
      losaFase1: new THREE.Group(),
      losaFase2: new THREE.Group(),
      muroEstacionamiento: new THREE.Group(),
      archSubsuelo: new THREE.Group(),
      archMain: new THREE.Group(),
      roof: new THREE.Group(),
      pluvialHydro: new THREE.Group(),
      weakSignals: new THREE.Group(),
      ductosYEnchufes: new THREE.Group(),
      photos: new THREE.Group(),
      measurements: new THREE.Group()
    };

    Object.values(this.groups).forEach((g) => this.scene.add(g));

    // Por defecto la vista inicia limpia como un render ArchViz real:
    // Las capas técnicas de conos/esferas (pluvial, senalesDebiles, geotech) inician apagadas y solo se encienden a pedido del usuario
    this.layers = {
      muroEstacionamiento: true,
      losaFase2: true,
      techo: true,
      architecture: true,
      subsuelo: true,
      structure: true,
      geotech: false,
      topography: true,
      entornoUrbano: true,
      pluvial: false,
      senalesDebiles: false,
      ductos: false,
      ductosYEnchufes: false,
      photos: false
    };

    this.groups.geotech.visible = false;
    this.groups.pluvialHydro.visible = false;
    this.groups.weakSignals.visible = false;
    this.groups.ductosYEnchufes.visible = false;
    this.groups.photos.visible = false;

    this.xrayMode = false;
    this.measureMode = false;
    this.measurePoints = [];
    this.interactableMeshes = [];
    this.currentScenario = 'edifica573';
    this.currentCutawayMode = 'full';
    this.currentHour = 16.2;

    // Estado de Modo Juego 1ra/3ra Persona (GTA VI / Sims Walk-Through) y Simuladores MEP
    this.gameMode = false;
    this.thirdPersonView = false;
    this.isPointerDraggingLook = false;
    this.keysPressed = {};
    this.playerPos = new THREE.Vector3(0.85, 0.0, -1.2);
    this.playerYaw = 0;
    this.playerPitch = 0;
    this.playerVelY = 0;
    this.isJumping = false;
    this.onGameHudUpdate = null;
    this.clock = new THREE.Clock();

    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    this.init();
  }

  init() {
    this.setupLights();
    this.buildEnvironment();
    this.buildTopography();
    this.buildUrbanContext();
    this.buildGeotechnicalLayer();
    this.buildStructure();
    this.buildMuroEstacionamiento();
    this.buildArchitecture();

    // Sistemas MEP 3D (ocultos al inicio para no ensuciar el render ArchViz; activables desde el panel de capas o simulador)
    this.pluvialSystem = buildPluvialAndHydroLayer(
      THREE,
      this.groups,
      this.getTerrainHeight.bind(this)
    );
    if (this.pluvialSystem && !this.pluvialSystem.updateRainFlow) {
      this.pluvialSystem.updateRainFlow = this.pluvialSystem.updateAnimation;
    }
    this.pluvialNetworkRefs = this.pluvialSystem;
    this.groups.pluvialHydro.visible = this.layers.pluvial;

    this.weakSignalsSystem = buildWeakSignalsLayer(
      THREE,
      this.groups,
      this.getTerrainHeight.bind(this)
    );
    if (this.weakSignalsSystem && !this.weakSignalsSystem.updateNightLighting) {
      this.weakSignalsSystem.updateNightLighting = this.weakSignalsSystem.updateDomoticLighting;
    }
    this.groups.weakSignals.visible = this.layers.senalesDebiles;

    this.conduitsOutletsSystem = buildConduitsOutletsAndPlumbingLayer(
      THREE,
      this.groups
    );
    this.conduitsOutletsRefs = this.conduitsOutletsSystem;
    this.groups.ductosYEnchufes.visible = Boolean(this.layers.ductos || this.layers.ductosYEnchufes);

    this.buildPhotoHotspots();
    this.groups.photos.visible = this.layers.photos;

    this.rebuildInteractables();
    this.setupEvents();
    this.animate();
  }

  /**
   * Reconstruye la lista de mallas interactivas para inspección en 3D
   */
  rebuildInteractables() {
    this.interactableMeshes = [];
    const targetGroups = [
      this.groups.structure,
      this.groups.losaFase1,
      this.groups.losaFase2,
      this.groups.muroEstacionamiento,
      this.groups.archSubsuelo,
      this.groups.archMain,
      this.groups.roof,
      this.groups.geotech,
      this.groups.urbanContext,
      this.groups.pluvialHydro,
      this.groups.weakSignals,
      this.groups.ductosYEnchufes,
      this.groups.photos
    ];

    targetGroups.forEach((grp) => {
      if (!grp) return;
      grp.traverse((child) => {
        if ((child.isMesh || child.isSprite) && child.userData && (child.userData.type || child.userData.name)) {
          this.interactableMeshes.push(child);
        }
      });
    });
  }

  setupLights() {
    this.ambientLight = new THREE.AmbientLight(0xfff7ed, 0.56);
    this.scene.add(this.ambientLight);

    this.hemiLight = new THREE.HemisphereLight(0xfde68a, 0x334155, 0.72);
    this.hemiLight.position.set(0, 60, 0);
    this.scene.add(this.hemiLight);

    this.sunLight = new THREE.DirectionalLight(0xfffbeb, 2.25);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.mapSize.width = 2048;
    this.sunLight.shadow.mapSize.height = 2048;
    this.sunLight.shadow.camera.near = 0.5;
    this.sunLight.shadow.camera.far = 120;
    const d = 22;
    this.sunLight.shadow.camera.left = -d;
    this.sunLight.shadow.camera.right = d;
    this.sunLight.shadow.camera.top = d;
    this.sunLight.shadow.camera.bottom = -d;
    this.sunLight.shadow.bias = -0.0004;
    this.scene.add(this.sunLight);

    // Luz cálida interior suave para realzar baños, cocina y estar en modo corte seccional
    this.interiorFillLight = new THREE.PointLight(0xffedd5, 0.85, 18, 1.2);
    this.interiorFillLight.position.set(0, 2.35, 6.8);
    this.scene.add(this.interiorFillLight);

    this.subsueloFillLight = new THREE.PointLight(0xffedd5, 0.65, 14, 1.2);
    this.subsueloFillLight.position.set(-1.2, -0.6, 7.2);
    this.scene.add(this.subsueloFillLight);

    this.setTimeOfDay(16.2);
  }

  setTimeOfDay(hour) {
    this.currentHour = hour;
    const normalized = (hour - 6) / 14;
    const angle = normalized * Math.PI;

    const radius = 52;
    const sunX = Math.cos(angle) * radius;
    const sunY = Math.max(3.0, Math.sin(angle) * radius);
    const sunZ = -14 + Math.sin(angle * 0.5) * 26;

    this.sunLight.position.set(sunX, sunY, sunZ);

    if (hour > 17.2 || hour < 6.8) {
      this.sunLight.color.setHex(0xf97316);
      this.sunLight.intensity = 1.25;
      this.ambientLight.intensity = 0.42;
      this.interiorFillLight.intensity = 1.35;
      this.scene.background.setHex(0x090f1d);
      this.scene.fog.color.setHex(0x090f1d);
    } else if (hour > 15.8 || hour < 8.0) {
      this.sunLight.color.setHex(0xfde68a);
      this.sunLight.intensity = 1.95;
      this.ambientLight.intensity = 0.58;
      this.interiorFillLight.intensity = 0.95;
      this.scene.background.setHex(0x0f1b33);
      this.scene.fog.color.setHex(0x0f1b33);
    } else {
      this.sunLight.color.setHex(0xfffbeb);
      this.sunLight.intensity = 2.25;
      this.ambientLight.intensity = 0.68;
      this.interiorFillLight.intensity = 0.75;
      this.scene.background.setHex(0x0c192e);
      this.scene.fog.color.setHex(0x0c192e);
    }

    if (this.weakSignalsSystem) {
      if (typeof this.weakSignalsSystem.updateNightLighting === 'function') {
        this.weakSignalsSystem.updateNightLighting(hour);
      } else if (typeof this.weakSignalsSystem.updateDomoticLighting === 'function') {
        this.weakSignalsSystem.updateDomoticLighting(hour);
      }
    }
  }

  buildEnvironment() {
    // Esfera celeste / horizonte de atardecer estilo GTA VI Golden Hour sobre el Río Paraguay
    const skyGeo = new THREE.SphereGeometry(420, 32, 20);
    const skyCanvas = document.createElement('canvas');
    skyCanvas.width = 512;
    skyCanvas.height = 512;
    const sCtx = skyCanvas.getContext('2d');
    const grad = sCtx.createLinearGradient(0, 0, 0, 512);
    grad.addColorStop(0.0, '#071124');
    grad.addColorStop(0.38, '#1e3a5f');
    grad.addColorStop(0.47, '#fb923c');
    grad.addColorStop(0.51, '#fde047');
    grad.addColorStop(0.56, '#1e293b');
    grad.addColorStop(1.0, '#090d16');
    sCtx.fillStyle = grad;
    sCtx.fillRect(0, 0, 512, 512);

    const skyTex = new THREE.CanvasTexture(skyCanvas);
    skyTex.colorSpace = THREE.SRGBColorSpace;
    const skyMat = new THREE.MeshBasicMaterial({ map: skyTex, side: THREE.BackSide });
    const skyDome = new THREE.Mesh(skyGeo, skyMat);
    this.scene.add(skyDome);

    // Río Paraguay hacia el Norte/Noroeste con textura procedural animada (`riverWaterShaderMat`)
    const waterGeo = new THREE.PlaneGeometry(700, 360, 48, 48);
    const waterMat = this.archVizMats.riverWaterShaderMat || new THREE.MeshPhysicalMaterial({
      color: 0x0369a1,
      roughness: 0.08,
      metalness: 0.15,
      clearcoat: 0.9,
      clearcoatRoughness: 0.1,
      reflectivity: 0.95
    });
    this.riverWaterMesh = new THREE.Mesh(waterGeo, waterMat);
    this.riverWaterMesh.rotation.x = -Math.PI / 2;
    this.riverWaterMesh.position.set(-25, -13.5, 165);
    this.scene.add(this.riverWaterMesh);
  }

  // Perfil topográfico real basado en GEO-STAN #2956 y la excavación real ejecutada en obra:
  // - Calle Tte. Guillermo Arias y explanada de cochera rellenada (z <= 1.50m) en Cota +100.00m (Y = 0.00m)
  // - Desde z = 1.50m (Muro de Contención) hasta el fondo del lote en z = 26.80m dentro de la huella del lote (|x| <= 4.95m):
  //   tanto el Subsuelo como TODO el Patio Trasero están 100% nivelados al mismo nivel de suelo del Subsuelo (Y = -2.34m),
  //   sin desnivel entre el subsuelo y el patio.
  getTerrainHeight(x, z) {
    if (Math.abs(x) <= 4.95) {
      if (z <= 1.48) {
        return 0.0;
      }
      if (z >= 1.50 && z <= 26.85) {
        return -2.34;
      }
    }
    if (z <= -1.8) {
      return 0.0;
    }
    const zn = Math.min(45, Math.max(0, z + 1.8));
    let drop = 0;
    if (zn < 5.0) {
      drop = (zn / 5.0) * 1.15;
    } else if (zn < 28.0) {
      drop = 2.34;
    } else {
      drop = 2.34 + ((zn - 28.0) / 17.0) * 3.80;
    }
    return -drop;
  }

  buildTopography() {
    this.groups.topography.clear();

    // Terreno enfocado en el lote de Leo (9.89m × 31.00m) y sus bordes colindantes
    const width = 34;
    const depth = 48;
    const segX = 72;
    const segZ = 104;

    const geo = new THREE.PlaneGeometry(width, depth, segX, segZ);
    geo.rotateX(-Math.PI / 2);

    const pos = geo.attributes.position;
    const colors = [];

    for (let i = 0; i < pos.count; i++) {
      const vx = pos.getX(i);
      const vz = pos.getZ(i) + 11;
      pos.setZ(i, vz);

      let vy = this.getTerrainHeight(vx, vz);

      if (Math.abs(vx) <= 4.95 && vz >= 1.50 && vz <= 26.85) {
        vy = -2.34;
      }
      pos.setY(i, vy);

      const c = new THREE.Color();
      if (Math.abs(vx) <= FIXED_STRUCTURAL_GRID.lot.width / 2 && vz >= -4 && vz <= 26.85) {
        if (vz >= 3.00 && vz <= 13.34) {
          // Tierra colorada compactada bajo el subsuelo
          c.setHex(0x7c3f23);
        } else if (vz > 13.34) {
          c.setHex(0x2e6f40);
        } else {
          c.setHex(0x4b5563);
        }
      } else {
        c.setHex(0x57534e);
      }
      colors.push(c.r, c.g, c.b);
    }

    geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geo.computeVertexNormals();

    const mat = new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: 0.90,
      metalness: 0.02,
      side: THREE.DoubleSide
    });

    const terrainMesh = new THREE.Mesh(geo, mat);
    terrainMesh.receiveShadow = true;
    this.groups.topography.add(terrainMesh);

    // Línea sutil demarcatoria del Lote (9.89m × 30.80m, de z=-4.00m a z=+26.80m)
    const halfW = FIXED_STRUCTURAL_GRID.lot.width / 2;
    const zStart = -4.0;
    const zEnd = 26.80;
    const borderPts = [];
    const corners = [
      [-halfW, zStart],
      [halfW, zStart],
      [halfW, zEnd],
      [-halfW, zEnd],
      [-halfW, zStart]
    ];

    for (let c = 0; c < corners.length - 1; c++) {
      const [x1, z1] = corners[c];
      const [x2, z2] = corners[c + 1];
      const steps = 28;
      for (let s = 0; s <= steps; s++) {
        const t = s / steps;
        const px = x1 + (x2 - x1) * t;
        const pz = z1 + (z2 - z1) * t;
        const py = this.getTerrainHeight(px, pz) + 0.08;
        borderPts.push(new THREE.Vector3(px, py, pz));
      }
    }

    const lotLineGeo = new THREE.BufferGeometry().setFromPoints(borderPts);
    const lotLineMat = new THREE.LineBasicMaterial({
      color: 0xf59e0b,
      transparent: true,
      opacity: 0.55
    });
    this.groups.topography.add(new THREE.Line(lotLineGeo, lotLineMat));
  }

  /**
   * Contexto Urbano Real relevado por Fotos de Obra (`media_1792502169633.jpg`, `media_1792502324664.jpg`),
   * Google Street View y Satélite:
   * - SIN árboles alrededor del terreno.
   * - A un costado (`-X`, derecha mirando desde la calle / `Eje 9`): Construcción vecina de 2 plantas de altura
   *   con una tremenda pared medianera alta hacia nuestro terreno (revoque hidrófugo oscuro y mampostería de 2 pisos).
   * - Del otro lado (`+X`, izquierda mirando desde la calle / `Eje 1`): La "Casa Topo", construida en el subsuelo
   *   de la barranca, cuyo techo de losa de hormigón parece desde fuera un piso de cemento a nivel de calle.
   * - Al frente (Sur): Calle Tte. Guillermo Arias y muralla/galpón de Molinos Harineros.
   */
  buildUrbanContext() {
    this.groups.urbanContext.clear();
    const mats = this.archVizMats || {};

    // 1. Calle Tte. Guillermo Arias al frente (z = -11.85m a -5.65m) + Veredas Norte/Sur + Cul-de-Sac
    const streetGroup = new THREE.Group();
    const streetLength = 46;
    const streetWidth = 6.2;
    const streetGeo = new THREE.BoxGeometry(streetLength, 0.16, streetWidth);
    const streetMat = mats.gtaAsphaltPBR || new THREE.MeshStandardMaterial({
      color: 0x3b4252,
      roughness: 0.82,
      metalness: 0.08
    });
    const streetMesh = new THREE.Mesh(streetGeo, streetMat);
    streetMesh.position.set(0, -0.07, -8.75);
    streetMesh.receiveShadow = true;
    streetMesh.userData = {
      type: 'urban_street',
      name: 'Calle Tte. Guillermo Arias #1950 (Empedrado Basáltico + Asfalto • Street View Verificado)',
      dimensions: 'Calzada 6,20m + Veredas Municipales (Tramo Cul-de-Sac)',
      status: 'Tramo Sin Salida (Cul-de-sac Residencial Itá Pytã Punta)',
      desc: 'Calzada de piedra basáltica paraguaya y carpeta asfáltica con cordón cuneta, postes ANDE con alumbrado público, acometida aérea directa al pilar ANDE (x=-3.85m) y muralla/galpón de Molinos Harineros en acera Sur.'
    };
    streetGroup.add(streetMesh);

    // Vereda Norte (frente a los lotes residenciales, z = -5.65m a -4.00m) y Vereda Sur (frente a Molinos, z = -13.30m a -11.85m)
    const sidewalkMat = mats.sidewalkTilePBR || mats.concreteFoundationPBR || new THREE.MeshStandardMaterial({
      color: 0x9ca3af,
      roughness: 0.85
    });
    const northSidewalkLeft = new THREE.Mesh(new THREE.BoxGeometry(18.0, 0.14, 1.62), sidewalkMat);
    northSidewalkLeft.position.set(-14.0, 0.01, -4.82);
    northSidewalkLeft.receiveShadow = true;
    streetGroup.add(northSidewalkLeft);

    const northSidewalkRight = new THREE.Mesh(new THREE.BoxGeometry(18.0, 0.14, 1.62), sidewalkMat);
    northSidewalkRight.position.set(14.0, 0.01, -4.82);
    northSidewalkRight.receiveShadow = true;
    streetGroup.add(northSidewalkRight);

    const southSidewalk = new THREE.Mesh(new THREE.BoxGeometry(streetLength, 0.14, 1.45), sidewalkMat);
    southSidewalk.position.set(0, 0.01, -12.58);
    southSidewalk.receiveShadow = true;
    streetGroup.add(southSidewalk);

    const curbMat = new THREE.MeshStandardMaterial({ color: 0xcbd5e1, roughness: 0.72 });
    const curbNorth = new THREE.Mesh(new THREE.BoxGeometry(streetLength, 0.18, 0.18), curbMat);
    curbNorth.position.set(0, 0.02, -5.65);
    streetGroup.add(curbNorth);

    const curbSouth = new THREE.Mesh(new THREE.BoxGeometry(streetLength, 0.18, 0.18), curbMat);
    curbSouth.position.set(0, 0.02, -11.85);
    streetGroup.add(curbSouth);

    // Cierre Cul-de-Sac al Oeste (+X = +22.5m) con baranda municipal sobre el barranco
    const culDeSacCurb = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.85, 9.2), curbMat);
    culDeSacCurb.position.set(22.8, 0.42, -8.75);
    culDeSacCurb.userData = {
      type: 'urban_context',
      name: 'Cierre de Calle Sin Salida (Cul-de-Sac Tte. Guillermo Arias hacia el Barranco)',
      dimensions: 'Fin de calzada vehicular a 18m del lote',
      status: 'Seguridad Urbana Natural (Un solo sentido de ingreso/egreso)',
      desc: 'El tramo final de la calle Tte. Guillermo Arias termina en un cul-de-sac sobre el barranco, reduciendo el tránsito vehicular exclusivamente a los vecinos de la cuadra.'
    };
    streetGroup.add(culDeSacCurb);

    // Acera Sur (frente a la obra): Muralla blanca con pilastras + Galpón industrial de Molinos Harineros del Paraguay
    const molinosWallMat = mats.plasterExteriorPBR || new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.86 });
    const molinosPlinthMat = mats.stoneWallPBR || new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.90 });
    const molinosWall = new THREE.Mesh(new THREE.BoxGeometry(44, 2.85, 0.28), molinosWallMat);
    molinosWall.position.set(0, 1.65, -13.35);
    molinosWall.castShadow = true;
    molinosWall.receiveShadow = true;
    molinosWall.userData = {
      type: 'urban_context',
      name: 'Muralla y Galpón Molinos Harineros del Paraguay (Acera Sur)',
      dimensions: 'Frente continuo sobre vereda Sur de Tte. Guillermo Arias',
      status: 'Colindancia Urbana Real (Google Street View)',
      desc: 'Muralla blanca con zócalo de piedra y nave industrial metálica en la vereda opuesta (Sur) de la calle Tte. Guillermo Arias.'
    };
    streetGroup.add(molinosWall);

    const molinosPlinth = new THREE.Mesh(new THREE.BoxGeometry(44, 0.55, 0.32), molinosPlinthMat);
    molinosPlinth.position.set(0, 0.28, -13.35);
    streetGroup.add(molinosPlinth);

    const molinosUpperCladdingMat = mats.isopanelRoofPBR || new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.48, metalness: 0.45 });
    const molinosUpper = new THREE.Mesh(new THREE.BoxGeometry(44, 2.4, 7.5), molinosUpperCladdingMat);
    molinosUpper.position.set(0, 4.2, -17.2);
    molinosUpper.castShadow = true;
    streetGroup.add(molinosUpper);

    // Postes de Hormigón ANDE en la Acera Norte + Luminarias LED + Bajada de Luz Directa a Pilastra ANDE (x = -3.85m, z = -4.08m)
    const poleMat = mats.concretePBR || new THREE.MeshStandardMaterial({ color: 0xd1d5db, roughness: 0.7 });
    const wireMat = new THREE.LineBasicMaterial({ color: 0x1e293b });
    const lampBulbMat = new THREE.MeshStandardMaterial({
      color: 0xfef3c7,
      emissive: 0xf59e0b,
      emissiveIntensity: 0.85,
      roughness: 0.2
    });

    [-5.8, 6.4, -17.5, 18.0].forEach((px) => {
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.16, 7.4, 10), poleMat);
      pole.position.set(px, 3.6, -5.35);
      pole.castShadow = true;
      streetGroup.add(pole);

      const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.5, 8), poleMat);
      arm.rotation.x = Math.PI / 3;
      arm.position.set(px, 6.65, -5.95);
      streetGroup.add(arm);

      const lampHead = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.10, 0.22), lampBulbMat);
      lampHead.position.set(px, 6.95, -6.45);
      streetGroup.add(lampHead);
    });

    [6.85, 6.45, 6.05].forEach((wy) => {
      const pts = [
        new THREE.Vector3(-22, wy, -5.35),
        new THREE.Vector3(-5.8, wy - 0.10, -5.35),
        new THREE.Vector3(6.4, wy - 0.08, -5.35),
        new THREE.Vector3(22, wy, -5.35)
      ];
      const lineGeo = new THREE.BufferGeometry().setFromPoints(pts);
      streetGroup.add(new THREE.Line(lineGeo, wireMat));
    });

    // Cable Preensamblado de Acometida ANDE desde el poste callejero (-5.8m) hasta el bastón de nuestra Pilastra ANDE al costado del portón (x = -3.85m, z = -4.08m)
    const serviceDropPts = [
      new THREE.Vector3(-5.80, 6.45, -5.35),
      new THREE.Vector3(-4.75, 4.55, -4.65),
      new THREE.Vector3(-3.85, 3.25, -4.08)
    ];
    const serviceDropLine = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(serviceDropPts),
      new THREE.LineBasicMaterial({ color: 0x0f172a })
    );
    streetGroup.add(serviceDropLine);

    this.groups.urbanContext.add(streetGroup);

    // 2. VECINO DE 2 PLANTAS CON TREMENDA PARED MEDIANERA (Costado Derecho mirando desde la calle: x = -5.00m a -12.00m, z = -3.80m a +14.80m)
    const tallNeighborGroup = new THREE.Group();
    const tallNeighborMeta = {
      type: 'urban_context',
      name: 'Construcción Vecina de 2 Plantas con Gran Pared Medianera (Colindancia en Eje 9 / x = -5.00m)',
      dimensions: 'Altura 2 Plantas (+6.20m sobre nivel calle / 8.54m desde subsuelo) × Profundidad 18.60m',
      status: 'Edificación Colindante Existente (Verificada en Fotos de Obra y Street View)',
      desc: 'Construcción vecina de dos plantas de altura pegada a nuestra medianera derecha (mirando desde la calle), con una gran pared ciega revocada/impermeabilizada en negro y ladrillo hacia nuestro lote y techo de tejas coloniales.'
    };

    const neighborBodyMat = mats.plasterExteriorPBR || new THREE.MeshStandardMaterial({ color: 0xe5e7eb, roughness: 0.85 });
    const neighborDarkPartyMat = new THREE.MeshStandardMaterial({ color: 0x27272a, roughness: 0.90 });
    const neighborBrickUpperMat = mats.brickWallPBR || new THREE.MeshStandardMaterial({ color: 0x9a3412, roughness: 0.88 });
    const neighborRoofTileMat = mats.clayRoofTilePBR || new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.72 });

    const neighborMainBox = new THREE.Mesh(new THREE.BoxGeometry(6.80, 6.20, 18.60), neighborBodyMat);
    neighborMainBox.position.set(-8.45, 3.10, 5.50);
    neighborMainBox.castShadow = true;
    neighborMainBox.receiveShadow = true;
    neighborMainBox.userData = tallNeighborMeta;
    tallNeighborGroup.add(neighborMainBox);

    const partyWallLower = new THREE.Mesh(new THREE.BoxGeometry(0.16, 4.20, 18.60), neighborDarkPartyMat);
    partyWallLower.position.set(-5.03, 2.10, 5.50);
    partyWallLower.castShadow = true;
    partyWallLower.receiveShadow = true;
    partyWallLower.userData = tallNeighborMeta;
    tallNeighborGroup.add(partyWallLower);

    const partyWallUpper = new THREE.Mesh(new THREE.BoxGeometry(0.16, 2.10, 14.50), neighborBrickUpperMat);
    partyWallUpper.position.set(-5.03, 5.25, 4.20);
    partyWallUpper.castShadow = true;
    partyWallUpper.userData = tallNeighborMeta;
    tallNeighborGroup.add(partyWallUpper);

    // Muralla frontal baja del vecino (-X) donde apoya el costado del portón y la bajada de luz
    const neighborFrontFence = new THREE.Mesh(new THREE.BoxGeometry(6.80, 2.10, 0.20), neighborBodyMat);
    neighborFrontFence.position.set(-8.45, 1.05, -4.00);
    neighborFrontFence.userData = tallNeighborMeta;
    tallNeighborGroup.add(neighborFrontFence);

    const neighborRoof = new THREE.Mesh(new THREE.BoxGeometry(7.10, 0.26, 19.00), neighborRoofTileMat);
    neighborRoof.position.set(-8.45, 6.32, 5.50);
    neighborRoof.rotation.z = 0.08;
    neighborRoof.castShadow = true;
    neighborRoof.userData = tallNeighborMeta;
    tallNeighborGroup.add(neighborRoof);

    this.groups.urbanContext.add(tallNeighborGroup);

    // 3. VECINO "CASA TOPO" EN SUBSUELO (Costado Izquierdo mirando desde la calle: x = +5.00m a +12.50m, z = -3.50m a +14.00m)
    const casaTopoGroup = new THREE.Group();
    const casaTopoMeta = {
      type: 'urban_context',
      name: 'Vecino "Casa Topo" en Subsuelo (Losa de Techo a Nivel de Calle parece Piso de Cemento)',
      dimensions: 'Cuerpo en Subsuelo (Y = -2.40m a 0.00m) + Techo de Losa de Cemento en Cota +100.05m (Y = +0.05m)',
      status: 'Edificación Subterránea Colindante (Despeja 100% las Vistas al Río)',
      desc: 'Vivienda vecina construida debajo del nivel de calle (en el desnivel del barranco). Desde la calle y desde nuestra Planta Baja se observa su techo de losa de hormigón como un piso de cemento con baranda baja, dejando totalmente despejada la visual hacia el Río Paraguay.'
    };

    const topoSlabMat = mats.concreteFoundationPBR || new THREE.MeshStandardMaterial({ color: 0x9ca3af, roughness: 0.86 });
    const topoSubWallMat = mats.plasterRoughPBR || new THREE.MeshStandardMaterial({ color: 0xd6d3d1, roughness: 0.85 });

    const topoSubBody = new THREE.Mesh(new THREE.BoxGeometry(7.20, 2.34, 16.50), topoSubWallMat);
    topoSubBody.position.set(8.65, -1.17, 4.75);
    topoSubBody.receiveShadow = true;
    topoSubBody.userData = casaTopoMeta;
    casaTopoGroup.add(topoSubBody);

    const topoRoofSlab = new THREE.Mesh(new THREE.BoxGeometry(7.40, 0.18, 16.80), topoSlabMat);
    topoRoofSlab.position.set(8.65, 0.02, 4.75);
    topoRoofSlab.receiveShadow = true;
    topoRoofSlab.userData = casaTopoMeta;
    casaTopoGroup.add(topoRoofSlab);

    const topoParapetFront = new THREE.Mesh(new THREE.BoxGeometry(7.40, 0.40, 0.15), topoSlabMat);
    topoParapetFront.position.set(8.65, 0.30, -3.55);
    topoParapetFront.userData = casaTopoMeta;
    casaTopoGroup.add(topoParapetFront);

    const topoParapetRear = new THREE.Mesh(new THREE.BoxGeometry(7.40, 0.40, 0.15), topoSlabMat);
    topoParapetRear.position.set(8.65, 0.30, 13.05);
    topoParapetRear.userData = casaTopoMeta;
    casaTopoGroup.add(topoParapetRear);

    this.groups.urbanContext.add(casaTopoGroup);

    // 4. ACANTILADO DE ARENISCA ROJIZA ITÁ PYTÃ PUNTA, MIRADOR Y CURVA DEL RÍO PARAGUAY AL NORTE/NOROESTE (z = 27m a 110m)
    const cliffAndRiverGroup = new THREE.Group();
    const sandstoneMat = mats.stoneWallPBR || new THREE.MeshStandardMaterial({
      color: 0x9a3412,
      roughness: 0.92,
      metalness: 0.04
    });

    // Talud escalonado de arenisca rojiza hacia el Río Paraguay (z = 27m a 52m, bajando de Y = -2.4m a Y = -9.5m)
    const cliffTerrace1 = new THREE.Mesh(new THREE.BoxGeometry(68, 3.6, 14), sandstoneMat);
    cliffTerrace1.position.set(0, -4.2, 34.0);
    cliffTerrace1.receiveShadow = true;
    cliffTerrace1.userData = {
      type: 'urban_context',
      name: 'Barranca de Arenisca Roja de Itá Pytã Punta ("Punta de Piedra Roja")',
      dimensions: 'Formación geológica natural en pendiente hacia el Río Paraguay',
      status: 'Geología Característica del Barrio Itá Pytã Punta',
      desc: 'Estrato de arenisca rojiza ferruginosa que da nombre al barrio Itá Pytã Punta y sostiene la barranca sobre la curva del Río Paraguay.'
    };
    cliffAndRiverGroup.add(cliffTerrace1);

    const cliffTerrace2 = new THREE.Mesh(new THREE.BoxGeometry(78, 4.5, 16), sandstoneMat);
    cliffTerrace2.position.set(0, -7.2, 48.0);
    cliffTerrace2.receiveShadow = true;
    cliffAndRiverGroup.add(cliffTerrace2);

    // Mirador Itá Pytã Punta (hacia el Noroeste, x = +18m, z = 44m)
    const miradorPlatform = new THREE.Mesh(new THREE.BoxGeometry(12.0, 0.45, 8.0), curbMat);
    miradorPlatform.position.set(19.0, -2.15, 42.0);
    miradorPlatform.userData = {
      type: 'urban_context',
      name: 'Mirador Público Itá Pytã Punta (Hito Urbano a ~85m NNW)',
      dimensions: 'Balcón urbano histórico sobre el acantilado de piedra roja',
      status: 'Patrimonio Urbano de Asunción',
      desc: 'Desde nuestra Galería Panorámica (PB) y el Deck del 2do Piso (+2.88m) se domina la visual abierta hacia la curva del Río Paraguay y el Mirador Itá Pytã Punta.'
    };
    cliffAndRiverGroup.add(miradorPlatform);

    // Espejo de Agua del Río Paraguay (z = 55m a 145m, Y = -8.8m) con textura animada en animate()
    const riverMat = mats.poolWaterPBR
      ? mats.poolWaterPBR.clone()
      : new THREE.MeshStandardMaterial({
          color: 0x0284c7,
          roughness: 0.14,
          metalness: 0.35
        });
    const riverGeo = new THREE.PlaneGeometry(180, 95);
    riverGeo.rotateX(-Math.PI / 2);
    const riverMesh = new THREE.Mesh(riverGeo, riverMat);
    riverMesh.position.set(0, -8.65, 98.0);
    riverMesh.receiveShadow = true;
    riverMesh.userData = {
      type: 'urban_context',
      name: 'Río Paraguay — Curva Panorámica de Itá Pytã Punta',
      dimensions: 'Cauce principal al Norte / Noroeste de la propiedad',
      status: 'Vista Panorámica Abierta desde Galería y 2do Piso 🌊',
      desc: 'Espejo de agua del Río Paraguay visible por encima de la Casa Topo y la barranca norte desde la Galería y la Terraza del 2do Piso.'
    };
    this.riverWaterMesh = riverMesh;
    cliffAndRiverGroup.add(riverMesh);

    this.groups.urbanContext.add(cliffAndRiverGroup);
  }

  buildGeotechnicalLayer() {
    this.groups.geotech.clear();

    const colorMap = {
      fill: 0x78716c,
      sand_loose: 0xfacc15,
      sand_med: 0xf97316,
      sand_dense: 0xdc2626
    };

    const boreholesList = GEOTECHNICAL_DATA.sondeos || GEOTECHNICAL_DATA.boreholes || [];
    boreholesList.forEach((s) => {
      const bhGroup = new THREE.Group();
      const bx = Array.isArray(s.pos) ? s.pos[0] : (s.xRel ?? 0);
      const bz = Array.isArray(s.pos) ? s.pos[2] : (s.yRel ?? 10);
      const surfaceY = this.getTerrainHeight(bx, bz);

      (s.estratos || []).forEach((est) => {
        const len = est.a - est.de;
        const cylGeo = new THREE.CylinderGeometry(0.28, 0.28, len, 18);
        const cylMat = new THREE.MeshStandardMaterial({
          color: est.color || colorMap[est.colorKey] || 0xc49a45,
          roughness: 0.6
        });
        const cyl = new THREE.Mesh(cylGeo, cylMat);
        const centerY = surfaceY - (est.de + len / 2);
        cyl.position.set(bx, centerY, bz);
        cyl.userData = {
          type: 'borehole',
          name: s.name || `Sondeo SPT ${s.id} (GEO-STAN #2956)`,
          cota: s.cotaBoca,
          prof: s.profundidadFinal || s.profundidad,
          estratos: s.estratos,
          desc: `Perforación geotécnica ${s.id} en Cota +${s.cotaBoca}m. Rechazo SPT en arenisca cementada de Itá Pytã Punta.`
        };
        bhGroup.add(cyl);
      });

      this.groups.geotech.add(bhGroup);
    });
  }

  /**
   * Construye con texturas PBR de Hormigón Visto (`concretePBR`) toda la estructura real de la casa:
   * - 14 Zapatas (`Z1..Z20`) en `Y = -4.64m`
   * - Vigas de fundación `VC.T-1` y Pórticos de Subsuelo 1–7 en `Y = -2.34m`
   * - Platea/Contrapiso de los 100,71 m² libres completos bajo toda la 1ra Losa (`Eje G z=3.00m` a `Eje A z=13.34m`)
   * - 20 Pilares (`P1..P20`) en sus coordenadas exactas sobre Ejes `9..1` y `G..A`
   * - Escalera 1 de H°A° real hacia el Subsuelo (`buildExistingStaircase3D`)
   * - 1ra Losa (`L2-L4` en `Y=0.00m` y `L1` Galería rebajada en `Y=-0.45m` con Viga Invertida en Eje B)
   * - 2da Losa (`Y=+2.88m` con voladizo `z=2.15m`) y Techo Termoacústico Isopanel (`Y=+5.64m`)
   */
  buildStructure() {
    this.groups.structure.clear();
    this.groups.losaFase1.clear();
    this.groups.losaFase2.clear();
    this.groups.roof.clear();

    const mats = this.archVizMats;
    const isHoyEnObra = this.currentScenario === 'hoy_en_obra';
    const isFinished = ['escenario350', 'escenario370', 'escenario440', 'edifica460', 'edifica573'].includes(this.currentScenario);

    const concreteFootMat = mats.concreteFoundationPBR;
    const concreteColMat = isFinished ? mats.plasterExteriorPBR : mats.concretePBR;
    const slabFase1Mat = mats.concretePBR;
    const fase2ColMat = isFinished ? mats.plasterExteriorPBR : mats.concretePBR;
    const fase2SlabMat = mats.concretePBR;

    const rebarMat = new THREE.MeshStandardMaterial({
      color: 0xb45309,
      roughness: 0.45,
      metalness: 0.8
    });
    const sikadurMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      roughness: 0.35,
      metalness: 0.15
    });
    const deadPillarCapMat = new THREE.MeshStandardMaterial({
      color: 0xdc2626,
      roughness: 0.4
    });

    // 1. 14 Zapatas de H°A° (Aisladas y Combinadas) en Cota Y = -4.64m
    const footingBaseY = -4.64;
    const footingH = 0.55;
    const renderedFootings = new Set();

    FIXED_COLUMNS_AND_FOOTINGS.forEach((col) => {
      const fKey = col.combinedGroup || col.zapataId;
      if (renderedFootings.has(fKey)) return;
      renderedFootings.add(fKey);

      const isCombined = Boolean(col.combinedGroup);
      const members = isCombined
        ? FIXED_COLUMNS_AND_FOOTINGS.filter((c) => c.combinedGroup === col.combinedGroup)
        : [col];
      const memberLabels = members.map((m) => `${m.pilarId} (${m.axisLabel})`).join(' + ');

      const fGroup = new THREE.Group();
      const baseGeo = new THREE.BoxGeometry(col.zapW, footingH, col.zapD);
      const baseMesh = new THREE.Mesh(baseGeo, concreteFootMat);
      baseMesh.position.set(col.zapCenterX, footingBaseY + footingH / 2, col.zapCenterZ);
      baseMesh.castShadow = true;
      baseMesh.receiveShadow = true;

      const metaFoot = {
        type: 'structure',
        name: isCombined
          ? `Zapata Combinada ${col.zapataId} — Pilares ${memberLabels}`
          : `Zapata Aislada ${col.zapataId} — Pilar ${col.pilarId} (Eje ${col.axisLabel})`,
        dimensions: `${col.zapW.toFixed(2)}m × ${col.zapD.toFixed(2)}m × ${footingH.toFixed(2)}m (Cota -4.64m)`,
        status: 'Ejecutado 100% (H°A° HA-25)',
        costo: isCombined ? 'Gs. 6.850.000 (Ejecutado)' : 'Gs. 3.450.000 (Ejecutado)',
        desc: `Fundación directa sobre arenisca densa (GEO-STAN #2956). Soporta ${memberLabels}.`
      };
      baseMesh.userData = metaFoot;
      fGroup.add(baseMesh);

      const trunkGeo = new THREE.BoxGeometry(col.zapW * 0.62, 0.30, col.zapD * 0.62);
      const trunkMesh = new THREE.Mesh(trunkGeo, concreteFootMat);
      trunkMesh.position.set(col.zapCenterX, footingBaseY + footingH + 0.15, col.zapCenterZ);
      trunkMesh.userData = metaFoot;
      fGroup.add(trunkMesh);

      this.groups.structure.add(fGroup);
    });

    // 2. Vigas de Fundación VC.T-1 (40×50cm) y Vigas Pórticos de Subsuelo (Y = -2.34m)
    const addTieBeam = (x1, z1, x2, z2, yLevel, w, h, name, desc) => {
      const len = Math.hypot(x2 - x1, z2 - z1);
      if (len < 0.1) return;
      const geo = new THREE.BoxGeometry(len, h, w);
      const mesh = new THREE.Mesh(geo, concreteFootMat);
      mesh.position.set((x1 + x2) / 2, yLevel, (z1 + z2) / 2);
      mesh.rotation.y = -Math.atan2(z2 - z1, x2 - x1);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.userData = {
        type: 'structure',
        name,
        dimensions: `Sección ${(w * 100).toFixed(0)}×${(h * 100).toFixed(0)}cm • L=${len.toFixed(2)}m`,
        status: 'Ejecutado 100% 🔒',
        desc
      };
      this.groups.structure.add(mesh);
    };

    addTieBeam(-4.87, 3.00, 4.87, 3.00, -3.95, 0.40, 0.50, 'Viga de Fundación VC.T-1 (Eje G • z=3.00m)', 'Viga de equilibrio y arriostramiento de zapatas frontales (40×50cm).');
    addTieBeam(-4.87, 9.94, 4.87, 9.94, -3.95, 0.40, 0.50, 'Viga de Fundación VC.T-1 (Eje B • z=9.94m)', 'Viga de equilibrio bajo línea de transición de galería.');
    addTieBeam(-4.87, 13.34, 4.87, 13.34, -3.95, 0.40, 0.50, 'Viga de Fundación VC.T-1 (Eje A • z=13.34m)', 'Viga de arriostramiento de zapatas posteriores hacia el barranco.');
    addTieBeam(-4.87, 3.00, -4.87, 13.34, -3.95, 0.40, 0.50, 'Viga de Fundación VC.T-1 (Eje 9 • x=-4.87m)', 'Viga de arriostramiento sobre medianera Oeste Eje 9.');
    addTieBeam(4.87, 3.00, 4.87, 13.34, -3.95, 0.40, 0.50, 'Viga de Fundación VC.T-1 (Eje 1 • x=+4.87m)', 'Viga de arriostramiento sobre medianera Este Eje 1.');

    const subsueloY = -2.34;
    // NOTA DE OBRA REAL (verificada por Leo):
    // En el suelo del Subsuelo NO existen tirantes/vigas transversales sobresaliendo en el piso; hoy está todo de tierra
    // natural compactada y se prevé una lecherada de cemento alisado para todo el salón abierto.
    // Al costado de la Escalera 1 (x = +1.85m..+3.84m, z = 5.26m..7.80m) existe un encofrado de hormigón ya hecho
    // donde originalmente iba a estar el lavadero (según plano estructural E5), el cual queda integrado al gran salón
    // mientras el lavadero pasa contra la pared opuesta (x = -4.45m).

    const earthFloorMat = new THREE.MeshStandardMaterial({
      color: 0x854427,
      roughness: 0.96,
      metalness: 0.01
    });
    const lecheradaFloorMat = new THREE.MeshStandardMaterial({
      color: 0x9ca3af,
      roughness: 0.65,
      metalness: 0.05
    });

    const subSlabW = 9.74;
    const subSlabD = 13.34 - 3.00; // 10.34m -> 9.74m * 10.34m = 100.71 m²
    const subSlabMesh = new THREE.Mesh(
      new THREE.BoxGeometry(subSlabW, 0.14, subSlabD),
      isHoyEnObra ? earthFloorMat : lecheradaFloorMat
    );
    subSlabMesh.position.set(0, subsueloY - 0.07, (3.00 + 13.34) / 2);
    subSlabMesh.receiveShadow = true;
    subSlabMesh.userData = {
      type: 'structure',
      bankCategory: isHoyEnObra ? 'existente_negro' : 'nuevo_rojo',
      name: isHoyEnObra
        ? 'Suelo de Tierra Natural en Subsuelo (100,71 m² Despejados sin Tirantes en el Piso)'
        : 'Piso de Subsuelo con Lecherada de Cemento Alisado (Salón Abierto 100,71 m²)',
      dimensions: '9.74m × 10.34m (100.71 m² Libres) • Cota +97.66m (Y = -2.34m)',
      area: 100.71,
      status: isHoyEnObra
        ? 'Suelo de Tierra Natural hoy en Obra (Sin tirantes en el piso) 🔒'
        : 'Lecherada de Cemento sobre 100,71 m² de Salón de Subsuelo ✨',
      desc: 'El suelo del subsuelo no posee tirantes atravesando el piso; hoy se encuentra en tierra natural nivelada a Y = -2.34m (al mismo nivel del patio trasero) y se ejecuta una lecherada de cemento para conformar todo un gran salón continuo.'
    };
    this.groups.structure.add(subSlabMesh);

    // ENCOFRADO DE HORMIGÓN YA EJECUTADO AL COSTADO DE LA ESCALERA 1 EN SUBSUELO (donde iba a ir el lavadero según planos de obra E5)
    const encofradoGroup = new THREE.Group();
    const encofradoMeta = {
      type: 'structure',
      bankCategory: 'existente_negro',
      name: 'Encofrado de H°A° Existente al Costado de Escalera 1 (Previsto originalmente para Lavadero en Plano E5)',
      dimensions: '2.00m × 2.54m (x = +1.84m..+3.84m, z = 5.26m..7.80m • En Subsuelo Y = -2.34m)',
      status: 'Ejecutado en Obra (No se cierra: queda integrado al Salón; el Lavadero va en la pared opuesta) 🔒',
      costo: 'Patrimonio Ejecutado en Obra',
      desc: 'Estructura/encofrado de hormigón ya hormigonado al costado de la escalera de subsuelo donde el plano original ubicaba el lavadero. Se mantiene abierto sin tabiques para que todo el subsuelo sea un gran salón continuo, reubicando el lavadero contra la pared del otro lado (x = -4.45m).'
    };
    // Cordón/base y pórtico de encofrado existente al lado de la escalera 1
    const encCurbFront = new THREE.Mesh(new THREE.BoxGeometry(2.00, 0.22, 0.18), concreteColMat);
    encCurbFront.position.set(2.84, subsueloY + 0.11, 5.26);
    encCurbFront.userData = encofradoMeta;
    encofradoGroup.add(encCurbFront);

    const encCurbRear = new THREE.Mesh(new THREE.BoxGeometry(2.00, 0.22, 0.18), concreteColMat);
    encCurbRear.position.set(2.84, subsueloY + 0.11, 7.80);
    encCurbRear.userData = encofradoMeta;
    encofradoGroup.add(encCurbRear);

    const encCurbSide = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.22, 2.54), concreteColMat);
    encCurbSide.position.set(1.84, subsueloY + 0.11, 6.53);
    encCurbSide.userData = encofradoMeta;
    encofradoGroup.add(encCurbSide);

    const encUpperBeam = new THREE.Mesh(new THREE.BoxGeometry(2.00, 0.25, 0.18), concreteColMat);
    encUpperBeam.position.set(2.84, -0.22, 7.80);
    encUpperBeam.userData = encofradoMeta;
    encofradoGroup.add(encUpperBeam);

    this.groups.structure.add(encofradoGroup);

    // 3. 20 Pilares Reales (`P1..P20`) con coordenadas exactas
    const rebarOffsets = [
      [-0.045, -0.08],
      [0.045, -0.08],
      [-0.045, 0.08],
      [0.045, 0.08]
    ];

    FIXED_COLUMNS_AND_FOOTINGS.forEach((col) => {
      const isEjeA = Math.abs(col.z - 13.34) < 0.08;
      const topFase1Y = isEjeA ? -0.45 : 0.00;
      const shaftBottomY = footingBaseY + footingH;
      const shaftH1 = topFase1Y - shaftBottomY;

      const colGeo1 = new THREE.BoxGeometry(col.colW, shaftH1, col.colD);
      const colMesh1 = new THREE.Mesh(colGeo1, concreteColMat);
      colMesh1.position.set(col.x, shaftBottomY + shaftH1 / 2, col.z);
      colMesh1.castShadow = true;
      colMesh1.receiveShadow = true;
      colMesh1.userData = {
        type: 'structure',
        name: `Pilar ${col.pilarId} — Eje ${col.axisLabel} (Fuste Libre en Subsuelo de 100 m²)`,
        dimensions: `Sección ${(col.colW * 100).toFixed(0)}×${(col.colD * 100).toFixed(0)}cm • X=${col.x.toFixed(2)}m, Z=${col.z.toFixed(2)}m`,
        status: col.diesInPB
          ? '⚠️ Ejecutado hasta 1ra Losa (MUERE EN PB 0.00m)'
          : 'Ejecutado hasta 1ra Losa 🔒',
        costo: 'Ejecutado en Obra',
        desc: `Pilar ${col.pilarId} sobre ${col.zapataId} en intersección de Eje ${col.axisLabel}, bajando limpio por el subsuelo libre de 100,71 m². Armadura: ${col.rebarSpec}.`
      };
      this.groups.structure.add(colMesh1);

      if (col.diesInPB) {
        const capGeo = new THREE.BoxGeometry(col.colW + 0.04, 0.05, col.colD + 0.04);
        const capMesh = new THREE.Mesh(capGeo, deadPillarCapMat);
        capMesh.position.set(col.x, topFase1Y + 0.025, col.z);
        capMesh.userData = {
          type: 'structure',
          name: `⚠️ ${col.pilarId} (Eje ${col.axisLabel}) — MUERE EN PLANTA BAJA (0.00m)`,
          dimensions: `Sección ${(col.colW * 100).toFixed(0)}×${(col.colD * 100).toFixed(0)}cm • Termina en Cota +100.00m`,
          status: 'No continúa a Planta Alta (Según Plano E6/E9)',
          desc: `El pilar ${col.pilarId} termina en la 1ra Losa (0.00m) y no sube al 2do piso.`
        };
        this.groups.structure.add(capMesh);
      } else {
        const targetPA_Y = 2.88;
        const hPBtoPA = targetPA_Y - topFase1Y;

        const colPBGeo = new THREE.BoxGeometry(col.colW, hPBtoPA, col.colD);
        const colPBMesh = new THREE.Mesh(colPBGeo, concreteColMat);
        colPBMesh.position.set(col.x, topFase1Y + hPBtoPA / 2, col.z);
        colPBMesh.castShadow = true;
        colPBMesh.receiveShadow = true;
        colPBMesh.userData = {
          type: 'structure',
          bankCategory: 'existente_negro',
          name: `Pilar ${col.pilarId} (Eje ${col.axisLabel}) — Tramo Planta Baja Ejecutado en Obra (0.00m a +2.88m)`,
          dimensions: `${(col.colW * 100).toFixed(0)}×${(col.colD * 100).toFixed(0)}cm • Altura ${hPBtoPA.toFixed(2)}m (hasta Cota +102.88m)`,
          status: 'Ejecutado 100% en Obra (Hormigonado hasta +2.88m) 🔒',
          costo: 'Patrimonio Ejecutado en Obra',
          desc: `Tramo de Planta Baja del pilar ${col.pilarId} ya hormigonado en obra desde la 1ra Losa hasta el nivel de la 2da Losa (+2.88m), con pelos de espera superiores para Planta Alta.`
        };
        this.groups.structure.add(colPBMesh);

        if (isHoyEnObra) {
          rebarOffsets.forEach(([ox, oz]) => {
            const barGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.58, 8);
            const barMesh = new THREE.Mesh(barGeo, rebarMat);
            barMesh.position.set(col.x + ox, targetPA_Y + 0.29, col.z + oz);
            barMesh.userData = {
              type: 'structure',
              bankCategory: 'refaccion_amarillo',
              name: `Pelos de Espera Ø12/16mm en Coronamiento PB (+2.88m) — Pilar ${col.pilarId} (Eje ${col.axisLabel})`,
              dimensions: 'Longitud expuesta 0.58m en Cota +102.88m (Requiere Desoxidado + Epóxico Sikadur-32)',
              status: 'A Tratar con Desoxidante Fosfatizante + Sikadur-32 🟡',
              desc: `Arranque de armadura en espera en el coronamiento de Planta Baja (+2.88m) del pilar ${col.pilarId}. Requiere cepillado mecánico y puente epóxico Sikadur-32 antes de continuar a Planta Alta.`
            };
            this.groups.structure.add(barMesh);
          });
        } else if (!isFinished) {
          const collarGeo = new THREE.BoxGeometry(col.colW + 0.03, 0.22, col.colD + 0.03);
          const collarMesh = new THREE.Mesh(collarGeo, sikadurMat);
          collarMesh.position.set(col.x, targetPA_Y + 0.11, col.z);
          collarMesh.userData = {
            type: 'structure_fase2',
            bankCategory: 'refaccion_amarillo',
            name: `Tratamiento de Arranque en +2.88m: Desoxidado + Puente Epóxico Sikadur-32 — Pilar ${col.pilarId}`,
            dimensions: 'Junta fría en Cota +102.88m (14 Pilares continúan a Techo)',
            costo: 'Incluido en Tratamiento de Pelos Expuestos',
            status: 'Refacción / Tratamiento de Empalme Estructural (Amarillo en Banco) 🟡',
            desc: `Aplicación de pasivador y puente epóxico estructural Sikadur-32 Gel en el empalme de Cota +102.88m del pilar ${col.pilarId}.`
          };
          this.groups.losaFase2.add(collarMesh);
        }

        if (col.topLevel === 'techo') {
          const roofY = 5.64;
          const hPAtoRoof = roofY - targetPA_Y;
          const colPAGeo = new THREE.BoxGeometry(col.colW, hPAtoRoof, col.colD);
          const colPAMesh = new THREE.Mesh(colPAGeo, fase2ColMat);
          colPAMesh.position.set(col.x, targetPA_Y + hPAtoRoof / 2, col.z);
          colPAMesh.castShadow = true;
          colPAMesh.receiveShadow = true;
          colPAMesh.userData = {
            type: 'structure_fase2',
            bankCategory: 'hormigon_verde',
            name: `Pilar ${col.pilarId} (Eje ${col.axisLabel}) — Tramo Planta Alta a Techo (+2.88m a +5.64m)`,
            dimensions: `${(col.colW * 100).toFixed(0)}×${(col.colD * 100).toFixed(0)}cm • De +2.88m a +5.64m`,
            status: 'Sostén de Techo General 🎯',
            desc: `Fuste superior del pilar ${col.pilarId} en Planta Alta hasta Cota +105.64m.`
          };
          this.groups.losaFase2.add(colPAMesh);
        }
      }
    });

    // Vigas superiores de arriostramiento de Planta Baja ya hormigonadas en Y = +2.72m (`this.groups.structure`)
    addTieBeam(-4.87, 3.00, 4.87, 3.00, 2.72, 0.20, 0.34, 'Viga Superior Pórtico Eje G (z=3.00m • Y=+2.72m)', 'Viga superior de arriostramiento de los pilares frontales sobre Eje G.');
    addTieBeam(-4.87, 9.94, 4.87, 9.94, 2.72, 0.22, 0.36, 'Viga Superior Pórtico Eje B (z=9.94m • Y=+2.72m)', 'Viga superior central sobre Eje B.');
    addTieBeam(-4.87, 13.34, 4.87, 13.34, 2.72, 0.20, 0.34, 'Viga Superior Pórtico Eje A (z=13.34m • Y=+2.72m)', 'Viga superior posterior hacia el Río Paraguay sobre Eje A.');
    addTieBeam(-4.87, 3.00, -4.87, 13.34, 2.72, 0.20, 0.34, 'Viga Superior Medianera Eje 9 (x=-4.87m • Y=+2.72m)', 'Viga longitudinal superior sobre Eje 9.');
    addTieBeam(4.87, 3.00, 4.87, 13.34, 2.72, 0.20, 0.34, 'Viga Superior Medianera Eje 1 (x=+4.87m • Y=+2.72m)', 'Viga longitudinal superior sobre Eje 1.');

    // 3B. MURALLAS PERIMETRALES YA EXISTENTES ALREDEDOR DEL TERRENO (`this.groups.structure` — Color Negro en Carpeta Banco)
    // Ubicadas exactamente en los bordes del lote de 30.80m (de z = -4.00m hasta el fondo z = +26.80m, DETRÁS de la piscina)
    const perimWallMat = mats.brickWallPBR || mats.plasterRoughPBR;
    const perimExistingMeta = {
      type: 'structure',
      bankCategory: 'existente_negro',
      name: 'Murallas Perimetrales YA EXISTENTES alrededor del Terreno (Laterales y Fondo z = +26.80m)',
      dimensions: 'Perímetro Lateral 30.80m × 2 lados + Fondo 9.89m en z = +26.80m • Altura 2.00m',
      costo: 'Gs. 0 (Murallas Perimetrales Ya Construidas en el Terreno)',
      status: 'Ejecutado 100% en Sitio (Color Negro en Carpeta Banco) 🔒',
      desc: 'Murallas perimetrales del terreno de 9.89m × 31.00m cerrando ambos laterales y el fondo en z = +26.80m (detrás de la reserva de piscina y del sistema séptico).'
    };

    const westPerimExisting = new THREE.Mesh(new THREE.BoxGeometry(0.18, 2.10, 30.80), perimWallMat);
    westPerimExisting.position.set(-4.95, -2.34 + 1.05, 11.40);
    westPerimExisting.userData = perimExistingMeta;
    this.groups.structure.add(westPerimExisting);

    const eastPerimExisting = new THREE.Mesh(new THREE.BoxGeometry(0.18, 2.10, 30.80), perimWallMat);
    eastPerimExisting.position.set(4.95, -2.34 + 1.05, 11.40);
    eastPerimExisting.userData = perimExistingMeta;
    this.groups.structure.add(eastPerimExisting);

    const northPerimExisting = new THREE.Mesh(new THREE.BoxGeometry(9.90, 2.10, 0.18), perimWallMat);
    northPerimExisting.position.set(0, -2.34 + 1.05, 26.80);
    northPerimExisting.userData = perimExistingMeta;
    this.groups.structure.add(northPerimExisting);

    // 4. Escaleras en su Lado Correcto según Fotos de Obra (`media_1792502324664.jpg`) y Planos:
    //    - Escalera 1 YA CONSTRUIDA (PB -> Subsuelo) en el lado Izquierdo mirando desde el frente (`+X`, Eje 1-2: `x = +3.84m..+4.87m, z = 5.26m..9.94m`),
    //      conectada directo con la Puerta de Servicio Exterior (`x = +4.35m, z = 3.00m`) y con la Puerta Interior desde la casa (`x = +3.84m, z = 4.20m`).
    //    - Escalera 2 A CONSTRUIR (PB -> 2do Piso) del otro lado (`-X`, Eje 8-9: `x = -4.87m..-3.84m, z = 5.26m..9.94m`),
    //      subiendo directamente al Escritorio / Desk y al Pasillo Distribuidor del 2do Piso.
    buildExistingStaircase3D(THREE, this.groups.structure, this.groups.losaFase2, mats, this.currentScenario);

    // 5. PRIMERA LOSA EN NIVEL CALLE (`this.groups.losaFase1`):
    //    Tal como muestran los planos oficiales (`estructural_e3_planta_baja.png`, `subsuelo_ejecutivo_1-1.png`)
    //    y la foto real de obra (`media_1792502324664.jpg`):
    //    - Del lado de la Escalera 1 (`+X`, `x = -0.74m..+3.84m, z = 3.00m..9.94m` + desembarco de servicio `x = +3.84m..+4.87m, z = 3.00m..5.26m`):
    //      LOSA L4 MACIZA 100% HORMIGONADA HOY EN OBRA (rodeando la Escalera 1 existente en `x = +3.84m..+4.87m, z = 5.26m..9.94m` y cubriendo su encofrado inferior).
    //    - Al fondo (`z = 9.94m..13.34m, x = -4.87m..+4.87m`): Losa Galería L1–L3 MACIZA 100% HORMIGONADA en Y = -0.45m (33.12 m²).
    //    - Del lado de la medianera alta del vecino (`-X`, `x = -4.87m..-0.74m, z = 3.00m..9.94m`):
    //      SECTOR SIN LOSA / HUECO ABIERTO EN OBRA DE 38,00 m² donde solo están hormigonadas las vigas de H°A°
    //      (Eje G, Eje E, Eje C, Eje B, Eje 9, Eje 6, Eje 5) con vacío entre ellas, que se cierra con Loza Rap (`this.losaRap38m2Fill`).
    const l4Meta = {
      type: 'losa_existente',
      bankCategory: 'hormigon_verde',
      name: '1ra Losa H°A° Maciza Ejecutada — Sector L4 junto a Escalera 1 (x = -0.74m a +4.87m, z = 3.00m a 9.94m)',
      dimensions: '4.58m × 6.94m + Desembarco 1.03m × 2.26m (34.11 m²) • Espesor 18cm • Cota +100.00m (Y = 0.00m)',
      area: 34.11,
      status: 'Ejecutado 100% en Obra (Paño Macizo junto a Escalera 1 de Subsuelo) 🔒',
      costo: 'Patrimonio ejecutado Fase 1',
      desc: 'Paño de losa maciza L4 ya hormigonado entre Eje 5 (x=-0.74m) y Eje 1 (x=+4.87m), desde Eje G (z=3.00m) hasta Eje B (z=9.94m), rodeando la Escalera 1 hacia el Subsuelo tal como consta en la documentación estructural y fotos de obra.'
    };

    const l4MainMesh = new THREE.Mesh(
      new THREE.BoxGeometry(3.84 - (-0.74), 0.18, 9.94 - 3.00),
      slabFase1Mat
    );
    l4MainMesh.position.set((-0.74 + 3.84) / 2, -0.09, (3.00 + 9.94) / 2);
    l4MainMesh.castShadow = true;
    l4MainMesh.receiveShadow = true;
    l4MainMesh.userData = l4Meta;
    this.groups.losaFase1.add(l4MainMesh);

    // Desembarco macizo delante de la Escalera 1 (x = +3.84m a +4.87m, z = 3.00m a 5.26m) ya hormigonado con L4
    const l4ServiceLanding = new THREE.Mesh(
      new THREE.BoxGeometry(4.87 - 3.84, 0.18, 5.26 - 3.00),
      slabFase1Mat
    );
    l4ServiceLanding.position.set((3.84 + 4.87) / 2, -0.09, (3.00 + 5.26) / 2);
    l4ServiceLanding.castShadow = true;
    l4ServiceLanding.receiveShadow = true;
    l4ServiceLanding.userData = l4Meta;
    this.groups.losaFase1.add(l4ServiceLanding);

    // VIGAS DE H°A° YA HORMIGONADAS SOBRE LA CUADRÍCULA DEL SECTOR SIN LOSA (-X: x = -4.87m..-0.74m, z = 3.00m..9.94m)
    const addLosa1Beam = (x1, z1, x2, z2, w, h, name, desc) => {
      const len = Math.hypot(x2 - x1, z2 - z1);
      const bm = new THREE.Mesh(new THREE.BoxGeometry(len, h, w), concreteColMat);
      bm.position.set((x1 + x2) / 2, -h / 2, (z1 + z2) / 2);
      bm.rotation.y = -Math.atan2(z2 - z1, x2 - x1);
      bm.castShadow = true;
      bm.receiveShadow = true;
      bm.userData = {
        type: 'structure',
        bankCategory: 'hormigon_verde',
        name,
        dimensions: `Sección ${(w * 100).toFixed(0)}×${(h * 100).toFixed(0)}cm • L=${len.toFixed(2)}m (Cota +100.00m)`,
        status: 'Viga H°A° Ejecutada en Obra 🔒',
        desc
      };
      this.groups.losaFase1.add(bm);
    };

    addLosa1Beam(-4.87, 3.00, 4.87, 3.00, 0.22, 0.40, 'Viga Principal Eje G Nivel Calle (z=3.00m)', 'Viga frontal de H°A° ejecutada sobre Eje G.');
    addLosa1Beam(-4.87, 4.77, -0.74, 4.77, 0.20, 0.35, 'Viga Transversal Eje E sobre Sector sin Losa (z=4.77m)', 'Viga transversal de H°A° ejecutada sobre Eje E entre P19 y P13.');
    addLosa1Beam(-4.87, 7.37, -0.74, 7.37, 0.20, 0.35, 'Viga Transversal Eje C sobre Sector sin Losa (z=7.37m)', 'Viga transversal de H°A° ejecutada sobre Eje C pasando por P15 y P12.');
    addLosa1Beam(-4.87, 9.94, 4.87, 9.94, 0.22, 0.40, 'Viga Principal Eje B — Transición a Galería Rebajada (z=9.94m)', 'Viga principal sobre Eje B.');
    addLosa1Beam(-4.87, 3.00, -4.87, 9.94, 0.22, 0.38, 'Viga Longitudinal Medianera Eje 9 (x=-4.87m)', 'Viga perimetral sobre Eje 9 junto a la medianera alta del vecino.');
    addLosa1Beam(-1.64, 3.00, -1.64, 9.94, 0.20, 0.36, 'Viga Longitudinal Eje 6 sobre Sector sin Losa (x=-1.64m)', 'Viga interior expuesta en el sector sin losa (Eje 6: P14, P12, P11), lista para recibir viguetas Loza Rap.');
    addLosa1Beam(-0.74, 3.00, -0.74, 9.94, 0.22, 0.38, 'Viga Longitudinal Eje 5 — Borde entre Losa L4 y Sector sin Losa (x=-0.74m)', 'Viga portante sobre Eje 5 que divide la losa maciza L4 (+X) del sector abierto sin losa (-X).');
    addLosa1Beam(3.84, 3.00, 3.84, 9.94, 0.20, 0.36, 'Viga Longitudinal Eje 2 junto a Escalera 1 de Subsuelo (x=+3.84m)', 'Viga portante sobre Eje 2 que bordea la Escalera 1 hacia el Subsuelo.');
    addLosa1Beam(4.87, 3.00, 4.87, 9.94, 0.22, 0.38, 'Viga Longitudinal Medianera Eje 1 (x=+4.87m)', 'Viga perimetral sobre Eje 1 junto a Escalera 1.');

    // PAÑO DE CIERRE LOZA RAP DE 38,00 m² (`this.losaRap38m2Fill`) EN EL SECTOR SIN LOSA (-X: x = -4.87m..-0.74m, z = 3.00m..9.94m):
    // - En `hoy_en_obra`: `visible = false` (se ve el SECTOR SIN LOSA / HUECO ABIERTO entre vigas hacia el Subsuelo del lado de la medianera alta Eje 9)
    // - En `escenario300` en adelante: `visible = true` (cierra x=-4.87..-0.74m, z=3.00..9.94m con sistema pretensado Loza Rap)
    this.losaRap38m2Fill = new THREE.Group();
    const losaRapMeta = {
      type: 'losa_rap_38m2',
      bankCategory: 'hormigon_verde',
      name: 'Cierre de Sector sin Losa (38,00 m² en Ejes 5–9 / B–G) con Sistema Pretensado Loza Rap',
      dimensions: '38.00 m² cómputo (x = -4.87m..-0.74m, z = 3.00m..9.94m • Cuadrante Ejes 5–9 × Ejes B–G)',
      area: 38.0,
      costo: 'Gs. 13.300.000 (38,00 m² × Gs. 350.000/m² — Viguetas Pretensadas + Bovedillas + Capa Compresión HA-25)',
      status: 'Cierre Estructural Prioritario de Planta Baja 🎯',
      desc: 'Cierre definitivo del sector sin losa (38,00 m² en el cuadrante Ejes 5–9 × Ejes B–G junto a la medianera alta del vecino) con viguetas pretensadas Loza Rap, bovedillas cerámicas y capa de compresión HA-25.'
    };

    const rapMainMesh = new THREE.Mesh(
      new THREE.BoxGeometry(4.87 - 0.74, 0.18, 9.94 - 3.00),
      slabFase1Mat
    );
    rapMainMesh.position.set((-4.87 + -0.74) / 2, -0.09, (3.00 + 9.94) / 2);
    rapMainMesh.castShadow = true;
    rapMainMesh.receiveShadow = true;
    rapMainMesh.userData = losaRapMeta;
    this.losaRap38m2Fill.add(rapMainMesh);

    this.losaRap38m2Fill.visible = !isHoyEnObra;
    this.groups.losaFase1.add(this.losaRap38m2Fill);

    // Indicador 3D del SECTOR SIN LOSA / HUECO ABIERTO DE 38,00 m² en -X (visible exclusivamente en "Hoy en Obra")
    this.hueco38m2Badge = new THREE.Group();
    const voidBorderPts = [
      new THREE.Vector3(-4.87, 0.04, 3.00),
      new THREE.Vector3(-0.74, 0.04, 3.00),
      new THREE.Vector3(-0.74, 0.04, 9.94),
      new THREE.Vector3(-4.87, 0.04, 9.94),
      new THREE.Vector3(-4.87, 0.04, 3.00)
    ];
    const voidBorderLine = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(voidBorderPts),
      new THREE.LineBasicMaterial({ color: 0xef4444 })
    );
    this.hueco38m2Badge.add(voidBorderLine);

    const badgeCanvas = document.createElement('canvas');
    badgeCanvas.width = 512;
    badgeCanvas.height = 128;
    const bCtx = badgeCanvas.getContext('2d');
    bCtx.fillStyle = 'rgba(15, 23, 42, 0.90)';
    bCtx.strokeStyle = '#f59e0b';
    bCtx.lineWidth = 5;
    bCtx.strokeRect(4, 4, 504, 120);
    bCtx.fillRect(4, 4, 504, 120);
    bCtx.fillStyle = '#fde047';
    bCtx.font = 'bold 26px Inter, sans-serif';
    bCtx.textAlign = 'center';
    bCtx.fillText('⚠️ SECTOR SIN LOSA: 38,00 m² (Ejes 5–9)', 256, 52);
    bCtx.fillStyle = '#f8fafc';
    bCtx.font = '20px Inter, sans-serif';
    bCtx.fillText('Solo Vigas H°A° • A cerrar con Loza Rap (Gs. 13,3M)', 256, 92);

    const badgeTex = new THREE.CanvasTexture(badgeCanvas);
    badgeTex.colorSpace = THREE.SRGBColorSpace;
    const badgeSprite = new THREE.Sprite(
      new THREE.SpriteMaterial({ map: badgeTex, transparent: true, depthTest: false })
    );
    badgeSprite.position.set(-2.80, 0.55, 6.47);
    badgeSprite.scale.set(4.2, 1.05, 1);
    badgeSprite.userData = losaRapMeta;
    this.hueco38m2Badge.add(badgeSprite);
    this.hueco38m2Badge.visible = isHoyEnObra;
    this.groups.losaFase1.add(this.hueco38m2Badge);

    // Membrana / Capa de Tratamiento Previo de Losa 1 Expuesta al Sol e Intemperie (sobre L4 en +X)
    const sunTreatmentLayer = new THREE.Mesh(
      new THREE.BoxGeometry(4.40, 0.008, 6.80),
      new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        roughness: 0.4,
        transparent: true,
        opacity: isHoyEnObra ? 0.38 : 0.15
      })
    );
    sunTreatmentLayer.position.set(1.55, 0.003, (3.00 + 9.94) / 2);
    sunTreatmentLayer.userData = {
      type: 'tratamiento_losa_intemperie',
      bankCategory: 'refaccion_amarillo',
      name: 'Tratamiento Previo de 1ra Losa Expuesta al Sol e Intemperie (Hidrolavado + Sellado Microfisuras + SikaLatex + Sikadur-32)',
      dimensions: 'Losa 1 Existente (L4 junto a Escalera 1 + Galería L1–L3) + Arranques de Pilares',
      costo: 'Gs. 3.450.000 (SikaTop-107 Seal + SikaLatex + Sikadur-32 + Mano de Obra)',
      status: 'A Tratar / Refaccionar Antes de Levantar Paredes y Pisos (Amarillo en Banco) 🟡☀️',
      desc: 'Como la primera losa estuvo expuesta al sol directo y lluvias desde su hormigonado, se ejecuta hidrolavado industrial 2500 PSI, sellado de microfisuras térmicas por dilatación solar con SikaTop-107, imprimación SikaLatex para la carpeta y epóxico Sikadur-32 en los pelos de espera.'
    };
    this.groups.losaFase1.add(sunTreatmentLayer);

    // Sector Galería al Río (Losas L1–L3): desde Eje B (z=9.94m) hasta Eje A (z=13.34m), rebajada -0.45m en Y = -0.45m
    const l1Mesh = new THREE.Mesh(
      new THREE.BoxGeometry(9.74, 0.18, 13.34 - 9.94),
      slabFase1Mat
    );
    l1Mesh.position.set(0, -0.45 - 0.09, (9.94 + 13.34) / 2);
    l1Mesh.castShadow = true;
    l1Mesh.receiveShadow = true;
    l1Mesh.userData = {
      type: 'losa_existente',
      bankCategory: 'hormigon_verde',
      name: '1ra Losa H°A° Ejecutada — Sector Galería al Río (Losas L1–L3 Rebajadas -0.45m)',
      dimensions: '9.74m × 3.40m (33.12 m²) • Cota +99.55m (Y = -0.45m)',
      area: 33.1,
      status: 'Ejecutado 100% (Desnivel -0.45m según Plano E4) 🔒',
      costo: 'Patrimonio ejecutado Fase 1',
      desc: 'Losa L1–L3 del sector Galería Panorámica entre Eje B y Eje A, ejecutada a -0.45m respecto al nivel interior.'
    };
    this.groups.losaFase1.add(l1Mesh);

    // Viga Invertida de Transición en Eje B (z = 9.94m)
    const vigaTransMesh = new THREE.Mesh(
      new THREE.BoxGeometry(9.74, 0.65, 0.22),
      concreteColMat
    );
    vigaTransMesh.position.set(0, -0.25, 9.94);
    vigaTransMesh.castShadow = true;
    vigaTransMesh.userData = {
      type: 'structure',
      bankCategory: 'hormigon_verde',
      name: 'Viga Invertida de Transición V.Eje B (z = 9.94m • Desnivel -0.45m)',
      dimensions: 'Largo 9.74m × Sección 22×65cm',
      status: 'Ejecutado 100% 🔒',
      desc: 'Viga principal sobre el Eje B que articula el salto de nivel de 45cm entre el nivel interior (+100.00m) y la losa de Galería (+99.55m).'
    };
    this.groups.losaFase1.add(vigaTransMesh);

    // 6. LOSA DEL SEGUNDO PISO (`this.groups.losaFase2` en Y = +2.88m / Cota +102.88m)
    this.buildLosaFase2(fase2SlabMat, fase2ColMat);

    // 7. CUBIERTA GENERAL CON PENDIENTE HACIA EL FRENTE (DESAGÜE PLUVIAL HACIA LA CALLE TTE. GUILLERMO ARIAS):
    this.currentRoofStyle = this.currentRoofStyle || 'isopanel';
    const roofMinZ = 2.80;
    const roofMaxZ = 13.60;
    const roofW = 10.30;
    const roofD = roofMaxZ - roofMinZ;
    const roofCenterZ = (roofMinZ + roofMaxZ) / 2;
    const roofBaseY = 5.64;

    // --- 7A. SUBGRUPO OPCIÓN A: TECHO ISOPANEL PIR 50mm CON CAÍDA PLUVIAL HACIA DELANTE (EJE G / CALLE) ---
    this.roofIsopanelGroup = new THREE.Group();
    this.roofIsopanelGroup.name = 'roof_style_isopanel';

    const purlinMat = mats.stainlessMat;
    for (let z = roofMinZ + 0.35; z <= roofMaxZ - 0.25; z += 1.15) {
      // Pendiente hacia delante (z=2.80m más bajo que z=13.60m para que toda el agua de lluvia escurra hacia la calle frontal)
      const slopeOffset = ((z - roofMinZ) / roofD) * 0.32;
      const pMesh = new THREE.Mesh(new THREE.BoxGeometry(roofW - 0.2, 0.10, 0.06), purlinMat);
      pMesh.position.set(0, roofBaseY + slopeOffset, z);
      pMesh.userData = {
        type: 'techo',
        bankCategory: 'nuevo_rojo',
        name: 'Correas Estructurales Perfil C Galvanizado 100×50×2mm (Pendiente Pluvial hacia Calle Frontal)',
        dimensions: 'Largo 10.10m • Separación c/ 1.15m',
        status: 'Estructura Metálica Liviana 🎯',
        desc: 'Perfiles C galvanizados con pendiente del 3% hacia la fachada frontal (Eje G) para que todo el desagüe pluvial salga hacia la calle Tte. Guillermo Arias.'
      };
      this.roofIsopanelGroup.add(pMesh);
    }

    const acousticCeiling = new THREE.Mesh(
      new THREE.BoxGeometry(roofW - 0.65, 0.06, roofD - 0.80),
      mats.plasterPBR
    );
    acousticCeiling.position.set(0, roofBaseY - 0.14, roofCenterZ);
    acousticCeiling.userData = {
      type: 'techo',
      bankCategory: 'nuevo_rojo',
      name: 'Cielorraso Acústico Durlock + Lana de Vidrio 50mm bajo Isopanel (Atenuación Ruido de Lluvia)',
      dimensions: '9.65m × 10.00m • Cámara Fonoabsorbente sobre Planta Alta',
      costo: 'Gs. 14.850.000 (Recomendado si se elige Isopanel sobre Dormitorios en Planta Alta)',
      status: 'Barrera Acústica Antilluvia ✨',
      desc: 'Cielorraso suspendido con lana mineral bajo el panel metálico Isopanel para amortiguar el ruido de impacto de lluvias torrenciales.'
    };
    this.roofIsopanelGroup.add(acousticCeiling);

    const roofPanelMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      roughness: 0.32,
      metalness: 0.68
    });
    const roofPanelMesh = new THREE.Mesh(new THREE.BoxGeometry(roofW, 0.12, roofD), roofPanelMat);
    roofPanelMesh.position.set(0, roofBaseY + 0.22, roofCenterZ);
    // Inclinación negativa en X: más alto atrás (z=13.6m) y más bajo adelante (z=2.8m) para desaguar hacia la calle
    roofPanelMesh.rotation.x = -0.028;
    roofPanelMesh.castShadow = true;
    roofPanelMesh.receiveShadow = true;
    roofPanelMesh.userData = {
      type: 'techo',
      bankCategory: 'nuevo_rojo',
      name: 'Cubierta Termoacústica Sandwich Isopanel PIR 50mm (Pendiente hacia Calle Frontal)',
      dimensions: `${roofW.toFixed(2)}m × ${roofD.toFixed(2)}m (142 m² • Desagüe Pluvial Delantero)`,
      area: 142,
      status: 'Opción A: Montaje Rápido y Desagüe Pluvial Frontal 🎯',
      costo: 'Gs. 63.390.000 (Chapa Sandwich PIR 50mm + Estructura C)',
      desc: 'Cubierta metálica con núcleo PIR de 50mm e inclinación hacia la canaleta frontal (Eje G), conduciendo el 100% del agua de lluvia hacia la calle Tte. Guillermo Arias.'
    };
    this.roofIsopanelGroup.add(roofPanelMesh);

    // --- 7B. SUBGRUPO OPCIÓN B: TECHO DE TEJAS CERÁMICAS DE TOBATÍ SOBRE TIRANTES DE LAPACHO Y TEJUELONES ---
    this.roofTejasGroup = new THREE.Group();
    this.roofTejasGroup.name = 'roof_style_tejas';

    const clayTerracottaMat = new THREE.MeshStandardMaterial({
      color: 0xc2410c,
      roughness: 0.68,
      metalness: 0.04
    });
    const clayDarkRidgeMat = new THREE.MeshStandardMaterial({
      color: 0x9a3412,
      roughness: 0.72,
      metalness: 0.05
    });
    const tejuelonUnderMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      roughness: 0.75,
      metalness: 0.03
    });

    const tejasMeta = {
      type: 'techo',
      bankCategory: 'nuevo_rojo',
      name: 'Techo Tradicional de Tejas Cerámicas de Tobatí + Tejuelones y Tirantes de Lapacho/Yvyra Pytã',
      dimensions: `${roofW.toFixed(2)}m × ${roofD.toFixed(2)}m (150 m² • Pendiente hacia Canaleta Frontal Eje G)`,
      area: 150,
      status: 'Opción B: Máximo Confort Acústico ante Lluvias Torrenciales ✨',
      costo: 'Gs. 71.850.000 (Tijerales y Tirantes Madera Dura + Tejuelones + Aislación + Tejas Prensadas)',
      desc: 'Cubierta tradicional paraguaya con maderamen de Lapacho/Yvyra Pytã, tejuelones cerámicos vistos, membrana hidrófuga/térmica y tejas cerámicas coloniales de Tobatí con pendiente continua hacia la canaleta frontal.'
    };

    const tejasSlopePitch = 0.032; // Pendiente limpia hacia adelante (de Y=+5.98m en z=13.34m a Y=+5.64m en z=2.92m)
    const tejasMidY = roofBaseY + 0.16;

    for (let tx = -4.60; tx <= 4.65; tx += 0.92) {
      const rafter = new THREE.Mesh(
        new THREE.BoxGeometry(0.08, 0.16, roofD),
        mats.woodDoorPBR
      );
      rafter.position.set(tx, tejasMidY, roofCenterZ);
      rafter.rotation.x = tejasSlopePitch;
      rafter.userData = tejasMeta;
      this.roofTejasGroup.add(rafter);
    }

    const tejuelonDeck = new THREE.Mesh(
      new THREE.BoxGeometry(roofW, 0.05, roofD),
      tejuelonUnderMat
    );
    tejuelonDeck.position.set(0, tejasMidY + 0.10, roofCenterZ);
    tejuelonDeck.rotation.x = tejasSlopePitch;
    tejuelonDeck.userData = tejasMeta;
    this.roofTejasGroup.add(tejuelonDeck);

    const tileLayer = new THREE.Mesh(
      new THREE.BoxGeometry(roofW + 0.12, 0.08, roofD + 0.08),
      clayTerracottaMat
    );
    tileLayer.position.set(0, tejasMidY + 0.16, roofCenterZ);
    tileLayer.rotation.x = tejasSlopePitch;
    tileLayer.castShadow = true;
    tileLayer.receiveShadow = true;
    tileLayer.userData = tejasMeta;
    this.roofTejasGroup.add(tileLayer);

    for (let rx = -roofW / 2 + 0.20; rx <= roofW / 2 - 0.20; rx += 0.28) {
      const barrelTile = new THREE.Mesh(
        new THREE.CylinderGeometry(0.055, 0.065, roofD + 0.06, 8),
        clayDarkRidgeMat
      );
      barrelTile.rotation.x = Math.PI / 2 + tejasSlopePitch;
      barrelTile.position.set(rx, tejasMidY + 0.21, roofCenterZ);
      barrelTile.userData = tejasMeta;
      this.roofTejasGroup.add(barrelTile);
    }

    this.roofStyle = this.currentRoofStyle || 'isopanel';
    this.roofIsopanelGroup.visible = this.roofStyle === 'isopanel';
    this.roofTejasGroup.visible = this.roofStyle === 'tejas';

    this.groups.roof.add(this.roofIsopanelGroup);
    this.groups.roof.add(this.roofTejasGroup);
  }

  /**
   * Construye la Losa de Planta Alta (`Y = +2.88m` / Cota `+102.88m`) desde Eje G (`z = 3.00m`, SIN voladizo frontal)
   * hasta Eje A (`z = 13.34m`), dejando el vano de la Escalera 2 en el costado `-X` (`x = -4.87m..-3.84m, z = 5.26m..8.85m`),
   * mientras que la Escalera 1 baja al Subsuelo en el otro costado (`+X`, `x = +3.84m..+4.87m`) con losa llena encima en Y=+2.88m.
   */
  buildLosaFase2(
    fase2SlabMat = this.archVizMats.concretePBR,
    fase2ColMat = ['escenario350', 'escenario370', 'escenario440', 'edifica460', 'edifica573'].includes(this.currentScenario)
      ? this.archVizMats.plasterExteriorPBR
      : this.archVizMats.concretePBR
  ) {
    const losa2Y = 2.88;
    const losa2Meta = {
      type: 'losa_fase2',
      bankCategory: 'hormigon_verde',
      name: 'Losa de Planta Alta (Cota +102.88m • Eje G z=3.00m a Eje A z=13.34m • Vano Escalera 2 en x=-4.87..-3.84m)',
      dimensions: '9.74m × 10.34m (100.71 m² brutos) • Espesor 20cm • Sin voladizo frontal sobre Eje G',
      area: 96.0,
      status: 'Estructura Planta Alta según Plano Original 🎯',
      costo: 'Gs. 54.022.500 (Losa + Vigas Encadenado)',
      desc: 'Losa de entrepiso de Planta Alta en Cota +102.88m entre Eje G (z=3.00m) y Eje A (z=13.34m), con el vano de llegada de la Escalera 2 en el costado opuesto a la escalera de subsuelo (x=-4.87..-3.84m, z=5.26..8.85m) llegando directamente al Escritorio / Desk y al Pasillo Distribuidor.'
    };

    // 1. Paño Principal Central e Izquierdo (+X): desde x = -3.84m hasta Eje 1 x = +4.87m, z = 3.00m..13.34m (cubre encima de Escalera 1)
    const losa2MainW = 4.87 - (-3.84); // 8.71m
    const losa2FullD = 13.34 - 3.00;   // 10.34m
    const losa2Mesh = new THREE.Mesh(
      new THREE.BoxGeometry(losa2MainW, 0.20, losa2FullD),
      fase2SlabMat
    );
    losa2Mesh.position.set((-3.84 + 4.87) / 2, losa2Y + 0.10, (3.00 + 13.34) / 2);
    losa2Mesh.castShadow = true;
    losa2Mesh.receiveShadow = true;
    losa2Mesh.userData = losa2Meta;
    this.groups.losaFase2.add(losa2Mesh);

    // 2. Franja de Escalera 2 (x = -4.87m..-3.84m): Tramo Frontal bajo SSHH 2 (z = 3.00m..5.26m) y Desembarco a Escritorio/Deck 2 (z = 8.85m..13.34m)
    const stair2W = -3.84 - (-4.87); // 1.03m
    const losa2WestFront = new THREE.Mesh(
      new THREE.BoxGeometry(stair2W, 0.20, 5.26 - 3.00),
      fase2SlabMat
    );
    losa2WestFront.position.set((-4.87 + -3.84) / 2, losa2Y + 0.10, (3.00 + 5.26) / 2);
    losa2WestFront.castShadow = true;
    losa2WestFront.receiveShadow = true;
    losa2WestFront.userData = losa2Meta;
    this.groups.losaFase2.add(losa2WestFront);

    const losa2WestRear = new THREE.Mesh(
      new THREE.BoxGeometry(stair2W, 0.20, 13.34 - 8.85),
      fase2SlabMat
    );
    losa2WestRear.position.set((-4.87 + -3.84) / 2, losa2Y + 0.10, (8.85 + 13.34) / 2);
    losa2WestRear.castShadow = true;
    losa2WestRear.receiveShadow = true;
    losa2WestRear.userData = losa2Meta;
    this.groups.losaFase2.add(losa2WestRear);

    // Vigas de encadenado de Planta Alta
    const addFase2Beam = (x, y, z, w, h, d, name, desc) => {
      const bm = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), fase2ColMat);
      bm.position.set(x, y, z);
      bm.castShadow = true;
      bm.userData = {
        type: 'losa_fase2',
        bankCategory: 'hormigon_verde',
        name,
        dimensions: `${w.toFixed(2)}×${h.toFixed(2)}×${d.toFixed(2)}m`,
        status: 'Viga Estructural Planta Alta 🎯',
        desc
      };
      this.groups.losaFase2.add(bm);
    };

    addFase2Beam(-3.84, 2.72, (5.26 + 8.85) / 2, 0.18, 0.34, 8.85 - 5.26, 'Viga Borde Hueco Escalera 2 (x=-3.84m, z=5.26..8.85m)', 'Viga que bordea el vano de subida de la Escalera 2 hacia el Escritorio y Pasillo de Planta Alta.');
  }

  /**
   * Conmuta en tiempo real entre:
   * - `'isopanel'`: Techo Termoacústico Sandwich Isopanel PIR 50mm + Cielorraso Acústico Durlock
   * - `'tejas'`: Techo Tradicional de Tejas Cerámicas de Tobatí con Tirantes de Lapacho y Tejuelones
   * - `'off'`: Oculta el techo para inspeccionar el interior del 2do Piso
   */
  setRoofStyle(style = 'isopanel') {
    const raw = String(style || 'isopanel').toLowerCase().trim();
    const cleanStyle = (raw === 'off' || raw === 'none' || raw === 'oculto')
      ? 'off'
      : raw.includes('teja')
        ? 'tejas'
        : 'isopanel';

    this.currentRoofStyle = cleanStyle;
    this.roofStyle = cleanStyle;

    if (!this.roofIsopanelGroup || !this.roofTejasGroup) {
      this.buildStructure();
    }

    if (cleanStyle === 'off') {
      this.layers.techo = false;
      this.groups.roof.visible = false;
      const chk = document.getElementById('layer-techo');
      if (chk) chk.checked = false;
    } else {
      this.layers.techo = true;
      this.roofIsopanelGroup.visible = cleanStyle === 'isopanel';
      this.roofTejasGroup.visible = cleanStyle === 'tejas';
      this.groups.roof.visible = this.currentScenario !== 'hoy_en_obra';
      const chk = document.getElementById('layer-techo');
      if (chk) chk.checked = this.groups.roof.visible;
    }

    this.rebuildInteractables();
    if (this.bankColorMode) {
      this.setBankColorMode(true);
    }
    return cleanStyle;
  }

  /**
   * Construye:
   * 1) El Relleno Compactado y Explanada de Estacionamiento a Nivel Calle (`z = -4.00m` a `z = +1.50m`, `5.50m` de fondo en `Y = 0.00m`).
   * 2) El Muro de Contención del Estacionamiento en `z = +1.50m` (bajando de `Y = 0.00m` a `Y = -2.34m`).
   * 3) El Pasillo Cámara de Aire Antihumedad (`z = +1.50m` a `z = +3.00m`, ancho `1.50m × 9.74m = 14.61 m²` en `Y = -2.34m`).
   * 4) El Piso de Rejilla Electroforjada Galvanizada Transitable (`grating`) en `Y = 0.00m` sobre todo el foso `z = +1.50m..+3.00m`,
   *    protegiendo contra caídas sin bloquear el paso de aire y luz natural al Subsuelo.
   */
  buildMuroEstacionamiento() {
    this.groups.muroEstacionamiento.clear();
    const mats = this.archVizMats;

    const muroData = {
      type: 'muro_estacionamiento',
      bankCategory: 'nuevo_rojo',
      name: 'Muro de Contención del Estacionamiento en z = +1.50m (Dejado a 1,50m del Eje G para Pasillo Antihumedad)',
      dimensions: 'Frente 9.74m × Altura 2.34m × Esp. 30cm (En z = +1.50m • De Y=0.00m a Y=-2.34m)',
      status: 'Contención + Cámara Antihumedad 🎯',
      costo: 'Gs. 38.495.560',
      desc: 'Muro de contención ubicado estratégicamente en z = +1.50m (a 1,50m de distancia de la pared del Eje G en z = 3.00m) para contener el relleno de la cochera de 5,50m de fondo y generar un pasillo ventilado que evita al 100% que la humedad del terreno toque la pared de los 100 m² libres del subsuelo.'
    };

    // Muro de Contención Principal en z = +1.50m (baja desde Y=0.00m hasta Y=-2.34m)
    const retainingWall = new THREE.Mesh(new THREE.BoxGeometry(9.74, 2.34, 0.30), mats.stoneWallPBR);
    retainingWall.position.set(0, -1.17, 1.50);
    retainingWall.castShadow = true;
    retainingWall.receiveShadow = true;
    retainingWall.userData = muroData;
    this.groups.muroEstacionamiento.add(retainingWall);

    // Alas laterales de contención del relleno de cochera (z = -4.00m a z = +1.50m)
    [-4.72, 4.72].forEach((sideX) => {
      const wing = new THREE.Mesh(new THREE.BoxGeometry(0.30, 1.60, 5.50), mats.stoneWallPBR);
      wing.position.set(sideX, -0.80, -1.25);
      wing.castShadow = true;
      wing.userData = muroData;
      this.groups.muroEstacionamiento.add(wing);
    });

    // SOBREELEVACIÓN DE MURALLA LATERAL ANTIRROBO DE 3,00m × 2,00m (6,00 m²) EN EL COSTADO JUNTO A LA CALLE/VECINO
    if (this.currentScenario !== 'hoy_en_obra') {
      const sideWallRaise = new THREE.Mesh(
        new THREE.BoxGeometry(0.20, 2.00, 3.00),
        this.currentScenario === 'escenario300' ? mats.brickWallPBR : mats.plasterExteriorPBR
      );
      sideWallRaise.position.set(-4.92, 1.00 + 1.00, -2.50);
      sideWallRaise.castShadow = true;
      sideWallRaise.receiveShadow = true;
      sideWallRaise.userData = {
        type: 'sobreelevacion_muralla_seguridad',
        bankCategory: 'nuevo_rojo',
        name: 'Sobreelevación de Muralla Lateral Antirrobo 3,00m × 2,00m (6,00 m² a Construir junto a Calle/Vecino)',
        dimensions: 'Largo 3.00m × Alto Adicional 2.00m (6,00 m² • Esp. 20cm con Encadenado Superior)',
        area: 6.0,
        costo: 'Gs. 1.680.000 (Mampostería 6 m² + Revoque + Viga Cadena Superior)',
        status: 'Obra Nueva de Seguridad Perimetral (Rojo en Carpeta Banco) 🛡️🧱',
        desc: 'Sobreelevación de seguridad de 3,00m × 2,00m (6,00 m²) sobre el tramo de muralla lateral próximo a la calle.'
      };
      this.groups.muroEstacionamiento.add(sideWallRaise);
    }

    // Explanada de Estacionamiento a Nivel de Calle (Y = 0.00m, desde Línea Municipal z=-4.00m hasta Muro de Contención z=+1.50m -> 5.50m de largo)
    const slabParking = new THREE.Mesh(
      new THREE.BoxGeometry(9.44, 0.18, 5.50),
      mats.concreteFoundationPBR
    );
    slabParking.position.set(0, -0.09, -1.25);
    slabParking.receiveShadow = true;
    slabParking.userData = {
      type: 'muro_estacionamiento',
      bankCategory: 'nuevo_rojo',
      name: 'Explanada de Estacionamiento a Nivel de Calle (z = -4.00m a z = +1.50m)',
      dimensions: '9.44m × 5.50m (51.9 m² a Nivel Cota +100.00m / Y = 0.00m)',
      status: 'Plataforma Vehicular Doble a Nivel Calle 🎯',
      costo: 'Incluido en Partida 1.3',
      desc: 'Explanada vehicular sobre el relleno contenido por el muro en z = +1.50m, permitiendo estacionar cómodamente la SUV Chery Tiggo 2 Pro 2026 y un segundo vehículo a nivel de calle.'
    };
    this.groups.muroEstacionamiento.add(slabParking);

    // PASILLO CÁMARA DE AIRE ANTIHUMEDAD (entre Muro de Contención z = +1.50m y Pared Eje G z = +3.00m, en cota Y = -2.34m)
    const pasilloGroup = new THREE.Group();
    const pasilloFloor = new THREE.Mesh(
      new THREE.BoxGeometry(9.74, 0.14, 1.50),
      mats.porcelainSubsueloPBR
    );
    pasilloFloor.position.set(0, -2.34 - 0.05, 2.25);
    pasilloFloor.receiveShadow = true;
    pasilloGroup.add(pasilloFloor);

    const drainGrate = new THREE.Mesh(
      new THREE.BoxGeometry(9.40, 0.03, 0.16),
      mats.blackMetalMat
    );
    drainGrate.position.set(0, -2.34 + 0.02, 1.75);
    pasilloGroup.add(drainGrate);

    const pasilloMeta = {
      type: 'pasillo_antihumedad',
      bankCategory: 'nuevo_rojo',
      name: 'Pasillo Cámara de Aire Antihumedad y Oxigenación (Entre Muro Contención z=1.50m y Eje G z=3.00m)',
      dimensions: 'Ancho 1.50m × Largo 9.74m (14.61 m² en Cota Y = -2.34m)',
      status: 'Diseño Inteligente Antihumedad ✨',
      costo: 'Incluido en Obra de Contención y Drenaje',
      desc: 'Separa el muro de contención del relleno de cochera respecto a la pared frontal del subsuelo (Eje G), evitando al 100% que la humedad de la tierra toque la pared de los 100 m² libres del subsuelo.'
    };
    pasilloGroup.userData = pasilloMeta;
    pasilloGroup.traverse((ch) => {
      if (ch.isMesh) ch.userData = pasilloMeta;
    });
    this.groups.muroEstacionamiento.add(pasilloGroup);

    // PISO TRANSITABLE DE REJILLA ELECTROFORJADA GALVANIZADA (`GRATING`) EN Y = 0.00m SOBRE EL FOSO DE OXIGENACIÓN (z = 1.50m a 3.00m)
    const gratingGroup = new THREE.Group();
    const gratingMat = mats.galvanizedGratingPBR || mats.stainlessMat;
    const gratingMeta = {
      type: 'rejilla_electroforjada_foso',
      bankCategory: 'nuevo_rojo',
      name: 'Piso Transitable de Rejilla Electroforjada Galvanizada (Grating Anticaídas sobre Foso Antihumedad z=1.50..3.00m)',
      dimensions: '9.64m × 1.50m (14.46 m² en Cota +100.00m / Y = 0.00m • Malla 30×30mm c/ Planchuela Portante 32×3mm)',
      area: 14.46,
      costo: 'Gs. 6.950.000 (Bastidores IPN/Ángulo + Módulos Rejilla Electroforjada Galvanizada Desmontable)',
      status: 'Seguridad Peatonal 100% + Ventilación/Luz Natural al Subsuelo ✨🛡️',
      desc: 'Cubre a nivel de planta baja (Y = 0.00m) toda la trinchera/foso de oxigenación de 1,50m entre el muro de contención (z=1.50m) y la fachada Eje G (z=3.00m). Permite caminar con total seguridad sin riesgo de caída y deja pasar el 82% del aire y la luz natural hacia el Subsuelo.'
    };

    // Bastidores metálicos transversales cada 1.20m + módulos de rejilla galvanizada entre puentes peatonales
    const gratingSegments = [
      { x1: -4.82, x2: 0.02 },
      { x1: 1.68, x2: 3.74 }
    ];
    gratingSegments.forEach(({ x1, x2 }) => {
      const segW = x2 - x1;
      const segMidX = (x1 + x2) / 2;
      const gPanel = new THREE.Mesh(new THREE.BoxGeometry(segW, 0.04, 1.46), gratingMat);
      gPanel.position.set(segMidX, -0.02, 2.25);
      gPanel.receiveShadow = true;
      gPanel.userData = gratingMeta;
      gratingGroup.add(gPanel);

      // Perfiles portantes transversales bajo la rejilla
      for (let bx = x1; bx <= x2 + 0.05; bx += 0.95) {
        const bearer = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.08, 1.48), mats.blackMetalMat);
        bearer.position.set(Math.min(x2, bx), -0.06, 2.25);
        bearer.userData = gratingMeta;
        gratingGroup.add(bearer);
      }
    });

    // Baranda baja perimetral de demarcación y protección sobre el borde z = 1.50m (dejando libres los pasos peatonales)
    const railLeft = new THREE.Mesh(new THREE.BoxGeometry(4.80, 0.90, 0.04), mats.blackMetalMat);
    railLeft.position.set(-2.40, 0.45, 1.52);
    railLeft.userData = gratingMeta;
    gratingGroup.add(railLeft);

    const railMid = new THREE.Mesh(new THREE.BoxGeometry(2.00, 0.90, 0.04), mats.blackMetalMat);
    railMid.position.set(2.70, 0.45, 1.52);
    railMid.userData = gratingMeta;
    gratingGroup.add(railMid);

    this.groups.muroEstacionamiento.add(gratingGroup);

    // Pasarelas / Puentes de Acceso en Y = 0.00m salvando el pasillo de 1.50m (z = 1.50m a z = 3.00m) hacia Puerta Principal (x=+0.85m) y Puerta de Servicio (x=+4.32m)
    const bridgeMain = new THREE.Mesh(new THREE.BoxGeometry(1.65, 0.16, 1.54), mats.porcelainPBR);
    bridgeMain.position.set(0.85, -0.06, 2.25);
    bridgeMain.userData = {
      type: 'fachada_exterior',
      bankCategory: 'nuevo_rojo',
      name: 'Puente Peatonal de Acceso a Puerta Principal (Salva el Pasillo Antihumedad z=1.50..3.00m)',
      dimensions: 'Ancho 1.65m × Largo 1.50m (Cota +100.00m)',
      status: 'Ingreso Principal sobre Pasillo Antihumedad ✨',
      desc: 'Losa puente peatonal que vincula la explanada de estacionamiento (z=1.50m) con la Puerta Principal en Eje G (z=3.00m, x=+0.85m).'
    };
    this.groups.muroEstacionamiento.add(bridgeMain);

    const bridgeService = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.16, 1.54), mats.porcelainPBR);
    bridgeService.position.set(4.32, -0.06, 2.25);
    bridgeService.userData = {
      type: 'fachada_exterior',
      bankCategory: 'nuevo_rojo',
      name: 'Puente de Acceso a Puerta de Servicio y Escalera 2 (z=1.50..3.00m, x=+4.32m)',
      dimensions: 'Ancho 1.15m × Largo 1.50m (Cota +100.00m)',
      status: 'Ingreso Independiente a Escalera 2 ✨',
      desc: 'Pasarela lateral que conecta la cochera con la Puerta de Servicio (x=+4.32m, Eje G) alineada con la Escalera 2.'
    };
    this.groups.muroEstacionamiento.add(bridgeService);

    // Fachada Frontal con Muro Ciego Antirrobo, Portón Vehicular 2.30m, Portón Peatonal 0.95m y Pérgola sobre Línea Municipal (z = -4.00m)
    buildFacadeAndGate3D(THREE, this.groups.muroEstacionamiento, mats, this.currentScenario);
  }

  /**
   * Construye todo el interior hiper-realista
   */
  buildArchitecture() {
    this.patioRefs = buildHyperRealisticInterior3D(
      THREE,
      this.groups,
      this.archVizMats,
      this.currentScenario,
      Boolean(this.forcePoolQuinchoVisible)
    );
  }

  /**
   * Permite activar o desactivar bajo demanda el módulo de Piscina (4,65×2,45m) + Quincho en el Patio Trasero
   */
  setPoolQuinchoVisibility(visible) {
    this.forcePoolQuinchoVisible = Boolean(visible);
    if (this.patioRefs && this.patioRefs.poolQuinchoSubGroup) {
      this.patioRefs.poolQuinchoSubGroup.visible = Boolean(visible);
      this.rebuildInteractables();
    } else {
      this.buildArchitecture();
      this.rebuildInteractables();
    }
  }

  /**
   * Sincroniza en tiempo real los muros, aberturas y ambientes editados en el Editor 2D (`floorplanEditor.js`)
   * IMPORTANTE: Solo agrega muros adicionales creados manualmente por el usuario (`w.isCustomUserWall === true`)
   * para no duplicar ni superponer paredes sobre el modelo 3D arquitectónico (`buildHyperRealisticInterior3D`).
   */
  updateFromFloorplan(planState) {
    if (!planState || !planState.levels) return;

    this.patioRefs = buildHyperRealisticInterior3D(
      THREE,
      this.groups,
      this.archVizMats,
      this.currentScenario,
      Boolean(this.forcePoolQuinchoVisible)
    );
    if (this.currentScenario === 'hoy_en_obra') {
      this.rebuildInteractables();
      return;
    }

    const mats = this.archVizMats;
    const isBase300 = this.currentScenario === 'escenario300';

    const levelElevationMap = {
      subsuelo: -2.34,
      planta_baja: 0.00,
      planta_alta: 2.88
    };

    Object.entries(planState.levels).forEach(([levelKey, lvlData]) => {
      if (!lvlData) return;
      const targetGroup = levelKey === 'subsuelo' ? this.groups.archSubsuelo : this.groups.archMain;
      const defaultBaseY = levelElevationMap[levelKey] ?? 0.00;

      (lvlData.walls || []).forEach((w) => {
        if (!w.isCustomUserWall) return;
        const dx = w.x2 - w.x1;
        const dz = w.z2 - w.z1;
        const len = Math.hypot(dx, dz);
        if (len < 0.05) return;

        const cat = WALL_CATALOG[w.type] || WALL_CATALOG.ladrillo_15;
        const isActive = w.activeStage !== false && w.built !== false;
        if (!isActive) return;

        const midX = (w.x1 + w.x2) / 2;
        const midZ = (w.z1 + w.z2) / 2;
        const isGaleriaWall = levelKey === 'planta_baja' && midZ >= 9.94;
        const wallBaseY = isGaleriaWall ? -0.45 : defaultBaseY;
        const wallH = w.height || cat.heightDefault || (levelKey === 'subsuelo' ? 2.28 : 2.75);
        const wallThick = cat.thickness || 0.15;

        const wallGeo = new THREE.BoxGeometry(len, wallH, wallThick);
        let wallMat;

        if (cat.isGlazed) {
          wallMat = mats.glassBlindexMat;
        } else if (w.type === 'ciclopeo_30') {
          wallMat = mats.stoneWallPBR;
        } else if (isBase300) {
          wallMat = mats.plasterRoughPBR;
        } else {
          wallMat = mats.plasterPBR;
        }

        const wallMesh = new THREE.Mesh(wallGeo, wallMat);
        wallMesh.position.set(midX, wallBaseY + wallH / 2, midZ);
        wallMesh.rotation.y = -Math.atan2(dz, dx);
        wallMesh.castShadow = !cat.isGlazed;
        wallMesh.receiveShadow = true;

        const areaM2 = Number((len * wallH).toFixed(2));
        const unitCost = (cat.costPerM2Gs || 115000) + (cat.revoquePerM2Gs || 0) * 2 + (cat.pinturaPerM2Gs || 0) * 2;
        const wallCostGs = Math.round(areaM2 * unitCost).toLocaleString('es-PY');

        wallMesh.userData = {
          type: 'wall_bim',
          bankCategory: 'nuevo_rojo',
          name: `${cat.name} (${levelKey.replace('_', ' ').toUpperCase()})`,
          dimensions: `Largo ${len.toFixed(2)}m × Alto ${wallH.toFixed(2)}m (${areaM2} m²) • Esp. ${(wallThick * 100).toFixed(0)}cm`,
          area: areaM2,
          costo: `Gs. ${wallCostGs}`,
          status: 'Muro Personalizado desde Plano 2D ✨',
          desc: cat.desc
        };

        targetGroup.add(wallMesh);
      });
    });

    this.setFloorCutaway(this.currentCutawayMode);
    if (this.bankColorMode) {
      this.setBankColorMode(true);
    }
    this.rebuildInteractables();
  }

  buildPhotoHotspots() {
    this.groups.photos.clear();
    const hotSpotPhotos = CURATED_PHOTOS.filter((p) => p.pos3D);

    hotSpotPhotos.forEach((photo) => {
      const geo = new THREE.OctahedronGeometry(0.26, 0);
      const mat = new THREE.MeshStandardMaterial({
        color: 0xf43f5e,
        emissive: 0xe11d48,
        emissiveIntensity: 0.6,
        roughness: 0.2
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(...photo.pos3D);
      mesh.userData = {
        type: 'photoHotspot',
        title: photo.title,
        data: photo
      };
      this.groups.photos.add(mesh);
    });
  }

  setScenario(scenarioKey) {
    this.currentScenario = scenarioKey;
    const config = ESCENARIOS_INVERSION[scenarioKey];

    // En escenarios de crédito inferiores a 440M, si no se forzó manualmente la piscina, se muestra únicamente lo previsto en ese monto
    if (scenarioKey !== 'escenario440') {
      this.forcePoolQuinchoVisible = false;
    }

    // Reconstruir geometría PBR para reflejar texturas y equipamiento exacto de este escenario
    this.buildStructure();
    this.buildMuroEstacionamiento();
    this.buildArchitecture();

    const isHabitableScenario = scenarioKey !== 'hoy_en_obra';

    if (config && config.capas3D) {
      this.setLayerVisibility('muroEstacionamiento', config.capas3D.muroEstacionamiento ?? isHabitableScenario);
      this.setLayerVisibility('losaFase2', config.capas3D.losaFase2 ?? isHabitableScenario);
      this.setLayerVisibility('techo', (config.capas3D.techo ?? isHabitableScenario) && this.roofStyle !== 'off');
      this.setLayerVisibility('architecture', isHabitableScenario);
      this.setLayerVisibility('subsuelo', isHabitableScenario);

      const mapChk = {
        'layer-muro-parking': config.capas3D.muroEstacionamiento ?? isHabitableScenario,
        'layer-losa2': config.capas3D.losaFase2 ?? isHabitableScenario,
        'layer-techo': (config.capas3D.techo ?? isHabitableScenario) && this.roofStyle !== 'off',
        'layer-arch': isHabitableScenario,
        'layer-subsuelo': isHabitableScenario
      };

      Object.entries(mapChk).forEach(([id, state]) => {
        const el = document.getElementById(id);
        if (el) el.checked = state;
      });
    } else if (!isHabitableScenario) {
      this.setLayerVisibility('losaFase2', false);
      this.setLayerVisibility('techo', false);
      this.setLayerVisibility('architecture', false);
      this.setLayerVisibility('subsuelo', false);
    } else {
      this.setLayerVisibility('muroEstacionamiento', true);
      this.setLayerVisibility('losaFase2', true);
      this.setLayerVisibility('techo', this.roofStyle !== 'off');
      this.setLayerVisibility('architecture', true);
      this.setLayerVisibility('subsuelo', true);
    }

    this.setFloorCutaway(this.currentCutawayMode);
    if (this.bankColorMode) {
      this.setBankColorMode(true);
    }
    this.rebuildInteractables();
  }

  setFloorCutaway(mode = 'full') {
    const cleanMode = String(mode || 'full').trim();
    this.currentCutawayMode = cleanMode;

    this.renderer.clippingPlanes = [];

    this.groups.roof.visible = this.layers.techo && this.roofStyle !== 'off' && this.currentScenario !== 'hoy_en_obra';
    this.groups.losaFase2.visible = this.layers.losaFase2 && this.currentScenario !== 'hoy_en_obra';
    this.groups.losaFase1.visible = this.layers.structure;
    this.groups.archMain.visible = this.layers.architecture && this.currentScenario !== 'hoy_en_obra';
    this.groups.archSubsuelo.visible = this.layers.subsuelo && this.currentScenario !== 'hoy_en_obra';

    this.groups.archMain.children.forEach((ch) => {
      ch.visible = true;
    });

    if (cleanMode === 'cut_roof') {
      this.groups.roof.visible = false;
    } else if (cleanMode === 'cut_pa') {
      this.groups.roof.visible = false;
      this.groups.losaFase2.visible = false;
      this.groups.archMain.children.forEach((ch) => {
        if (ch.position.y > 2.75) {
          ch.visible = false;
        }
      });
    } else if (cleanMode === 'cut_pb') {
      this.groups.roof.visible = false;
      this.groups.losaFase2.visible = false;
      this.groups.losaFase1.visible = false;
      this.groups.archMain.visible = false;
      this.groups.archSubsuelo.visible = true;
    } else if (cleanMode === 'longitudinal_section') {
      const sectionPlane = new THREE.Plane(new THREE.Vector3(-1, 0, 0), 2.10);
      this.renderer.clippingPlanes = [sectionPlane];
    }
  }

  setSectionCut(mode) {
    this.setFloorCutaway(mode);
  }

  focusRoom(roomKey) {
    const preset = ROOM_CAMERA_PRESETS[roomKey];
    if (!preset) return;

    if (roomKey === 'piscina_quincho') {
      this.setPoolQuinchoVisibility(true);
      this.groups.archMain.visible = true;
    }

    if (preset.cutaway) {
      this.setFloorCutaway(preset.cutaway);
    }

    const startPos = this.camera.position.clone();
    const endPos = new THREE.Vector3(...preset.pos);
    const startTarget = this.controls.target.clone();
    const endTarget = new THREE.Vector3(...preset.target);

    let progress = 0;
    const animateFocus = () => {
      progress += 0.055;
      if (progress < 1) {
        const ease = 1 - Math.pow(1 - progress, 3);
        this.camera.position.lerpVectors(startPos, endPos, ease);
        this.controls.target.lerpVectors(startTarget, endTarget, ease);
        requestAnimationFrame(animateFocus);
      } else {
        this.camera.position.copy(endPos);
        this.controls.target.copy(endTarget);
      }
    };
    animateFocus();
  }

  setLayerVisibility(layerName, visible) {
    this.layers[layerName] = visible;
    switch (layerName) {
      case 'muroEstacionamiento':
        this.groups.muroEstacionamiento.visible = visible;
        break;
      case 'losaFase2':
        this.groups.losaFase2.visible = visible;
        break;
      case 'techo':
        if (visible && this.roofStyle === 'off') {
          this.roofStyle = 'isopanel';
          this.currentRoofStyle = 'isopanel';
          if (this.roofIsopanelGroup) this.roofIsopanelGroup.visible = true;
          if (this.roofTejasGroup) this.roofTejasGroup.visible = false;
        }
        this.groups.roof.visible = visible;
        break;
      case 'architecture':
        this.groups.archMain.visible = visible;
        break;
      case 'subsuelo':
        this.groups.archSubsuelo.visible = visible;
        break;
      case 'structure':
        this.groups.structure.visible = visible;
        this.groups.losaFase1.visible = visible;
        break;
      case 'geotech':
        this.groups.geotech.visible = visible;
        break;
      case 'topography':
        this.groups.topography.visible = visible;
        break;
      case 'entornoUrbano':
        this.groups.urbanContext.visible = visible;
        break;
      case 'pluvial':
        this.groups.pluvialHydro.visible = visible;
        break;
      case 'senalesDebiles':
        this.groups.weakSignals.visible = visible;
        break;
      case 'ductos':
      case 'ductosYEnchufes':
        this.layers.ductos = visible;
        this.layers.ductosYEnchufes = visible;
        this.groups.ductosYEnchufes.visible = visible;
        break;
      case 'photos':
        this.groups.photos.visible = visible;
        break;
    }
  }

  toggleXRay(enabled) {
    this.xrayMode = Boolean(enabled);
    const allGroups = [
      this.groups.structure,
      this.groups.losaFase1,
      this.groups.losaFase2,
      this.groups.muroEstacionamiento,
      this.groups.archMain,
      this.groups.archSubsuelo,
      this.groups.roof,
      this.groups.topography
    ];
    allGroups.forEach((grp) => {
      if (!grp) return;
      grp.traverse((child) => {
        if (child.isMesh && child.material) {
          child.material.wireframe = this.xrayMode;
        }
      });
    });
  }

  setXRayMode(enabled) {
    this.toggleXRay(enabled);
  }

  /**
   * Activa/Desactiva el Simulador Interactivo Pluvial / Tormenta y Desagües (`pluvialNetworkRefs`)
   */
  setPluvialSimulationState(state = {}) {
    const isOff = !state || state === 'off' || state === false || (
      typeof state === 'object' &&
      !state.active &&
      !state.rainStorm &&
      !state.rainstorm &&
      !state.tormenta &&
      !state.water_supply &&
      !state.presion_agua &&
      !state.sewage_flow &&
      !state.descarga_cloacal &&
      !state.flowActive
    );

    if (!isOff) {
      this._pluvialAutoOpenedLayer = !this.layers.pluvial;
      this.setLayerVisibility('pluvial', true);
      const chk = document.getElementById('layer-pluvial');
      if (chk) chk.checked = true;
    } else if (this._pluvialAutoOpenedLayer) {
      this._pluvialAutoOpenedLayer = false;
      this.setLayerVisibility('pluvial', false);
      const chk = document.getElementById('layer-pluvial');
      if (chk) chk.checked = false;
    }

    if (this.pluvialNetworkRefs && typeof this.pluvialNetworkRefs.setSimulationState === 'function') {
      return this.pluvialNetworkRefs.setSimulationState(isOff ? 'off' : state);
    }
    return state;
  }

  /**
   * Activa/Desactiva el Simulador Interactivo Eléctrico ANDE / Circuitos (`conduitsOutletsRefs`)
   */
  setElectricalSimulationState(state = {}) {
    const isOff = !state || state === 'off' || state === false || (
      typeof state === 'object' &&
      !state.active &&
      !state.energized &&
      !state.circuitFilter &&
      !state.fallaActiva
    );

    if (!isOff) {
      this._elecAutoOpenedLayer = !this.layers.ductos;
      this.setLayerVisibility('ductosYEnchufes', true);
      const chk = document.getElementById('layer-ductos');
      if (chk) chk.checked = true;
    } else if (this._elecAutoOpenedLayer) {
      this._elecAutoOpenedLayer = false;
      this.setLayerVisibility('ductosYEnchufes', false);
      const chk = document.getElementById('layer-ductos');
      if (chk) chk.checked = false;
    }

    if (this.conduitsOutletsRefs && typeof this.conduitsOutletsRefs.setSimulationState === 'function') {
      return this.conduitsOutletsRefs.setSimulationState(isOff ? 'off' : state);
    }
    return state;
  }

  /**
   * Crea el Avatar 3D para el Modo Juego en 3ra Persona (Arquitecto / Propietario recorriendo la casa)
   */
  _ensurePlayerAvatar() {
    if (this.playerAvatar) return this.playerAvatar;
    const avatar = new THREE.Group();
    const suitMat = new THREE.MeshStandardMaterial({ color: 0x1e3a8a, roughness: 0.6 });
    const skinMat = new THREE.MeshStandardMaterial({ color: 0xfed7aa, roughness: 0.5 });
    const helmetMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.25, metalness: 0.15 });

    const legs = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.14, 0.78, 12), suitMat);
    legs.position.y = 0.39;
    legs.castShadow = true;
    avatar.add(legs);

    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.58, 0.24), suitMat);
    torso.position.y = 1.07;
    torso.castShadow = true;
    avatar.add(torso);

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16, 16), skinMat);
    head.position.y = 1.52;
    head.castShadow = true;
    avatar.add(head);

    const hardHat = new THREE.Mesh(new THREE.SphereGeometry(0.165, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2), helmetMat);
    hardHat.position.y = 1.56;
    avatar.add(hardHat);

    avatar.visible = false;
    this.scene.add(avatar);
    this.playerAvatar = avatar;
    return avatar;
  }

  /**
   * Activa/Desactiva el Modo Juego (Recorrido Peatonal 1ra / 3ra Persona con Colisión de Paredes Real)
   * Controles: WASD / Flechas para caminar, Arrastrar ratón para girar la vista, Shift correr, Espacio saltar,
   * C alternar 1ra/3ra persona, 1/2/3 teletransportar a Planta Baja (0.00m), Planta Alta (+2.88m) o Subsuelo (-2.34m), E interactuar.
   */
  toggleGameMode(enabled) {
    this.gameMode = Boolean(enabled);
    const avatar = this._ensurePlayerAvatar();

    if (this.gameMode) {
      this.controls.enabled = false;
      this.thirdPersonView = false; // Inicia en 1ra persona ("Ojos") para que ninguna pared tape la cámara
      this.playerPos.set(0.85, 0.0, 0.50);
      this.playerYaw = 0;
      this.playerPitch = 0;
      this.playerVelY = 0;
      avatar.position.copy(this.playerPos);
      avatar.visible = this.thirdPersonView;
      this._notifyGameHud('Cochera / Ingreso Principal (1ra Persona • Usa WASD + Ratón; pulsa C para 3ra Persona)');
    } else {
      this.controls.enabled = true;
      avatar.visible = false;
      this.keysPressed = {};
      this.isPointerDraggingLook = false;
      if (typeof this.onGameHudUpdate === 'function') {
        this.onGameHudUpdate({ active: false });
      }
    }
    return this.gameMode;
  }

  _getFloorZoneLabel(x, y, z) {
    if (y < -1.0) {
      if (z < 3.0) return 'Pasillo Cámara Antihumedad (Subsuelo -2.34m)';
      if (z > 13.34) return 'Patio Nivelado, Parrilla y Reserva Piscina (-2.34m)';
      if (x < -3.2 && z >= 5.0 && z <= 8.2) return 'Lavadero sobre Pared Lateral (Subsuelo -2.34m)';
      return 'Gran Salón Abierto de Subsuelo 100 m² (-2.34m)';
    }
    if (y > 1.8) {
      if (x < -1.80 && z >= 6.00) return 'Escritorio / Desk Extendido hasta Galería Eje A (+2.88m)';
      if (z > 9.94) return 'Deck 2 / Terraza Panorámica al Río (+2.88m)';
      if (z >= 4.85 && z <= 6.00 && x >= -3.84 && x <= 0.60) return 'Pasillo Distribuidor de Planta Alta (+2.88m)';
      if (x >= -1.80 && x <= 0.60 && z >= 6.00) return 'Dormitorio 2 (+2.88m)';
      if (x > 0.60 && z >= 4.85) return 'Dormitorio Principal en Suite (+2.88m)';
      if (x >= -1.65 && z < 4.85) return 'Vestidor y Baño en Suite (+2.88m)';
      return 'SSHH 2 — Baño de Planta Alta (+2.88m)';
    }
    if (z < 1.5) return 'Explanada de Estacionamiento y Pérgola (0.00m)';
    if (z < 3.0) return 'Rejilla Galvanizada sobre Foso de Oxigenación (0.00m)';
    if (z > 9.94) return 'Galería Panorámica al Río Paraguay (-0.45m)';
    if (x > 3.75 && z <= 5.26) return 'Hall Puerta de Servicio (Acceso Doble a Subsuelo y Casa 0.00m)';
    if (x < -0.74) return 'Cocina, Comedor y Baño Social (0.00m)';
    return 'Estar Social / Living Principal (0.00m)';
  }

  _notifyGameHud(customInteraction = null) {
    if (typeof this.onGameHudUpdate !== 'function') return;
    const zone = this._getFloorZoneLabel(this.playerPos.x, this.playerPos.y, this.playerPos.z);
    this.onGameHudUpdate({
      active: this.gameMode,
      mode: this.thirdPersonView ? '3ra Persona (Avatar)' : '1ra Persona (Ojos)',
      position: {
        x: Number(this.playerPos.x.toFixed(2)),
        y: Number(this.playerPos.y.toFixed(2)),
        z: Number(this.playerPos.z.toFixed(2))
      },
      zone,
      interaction: customInteraction
    });
  }

  _interactNearestObject() {
    let bestObj = null;
    let bestDist = 3.2;
    const eyePos = this.playerPos.clone().add(new THREE.Vector3(0, 1.2, 0));

    this.interactableMeshes.forEach((m) => {
      if (!m.visible) return;
      const worldPos = new THREE.Vector3();
      m.getWorldPosition(worldPos);
      const d = eyePos.distanceTo(worldPos);
      if (d < bestDist && m.userData && m.userData.name) {
        bestDist = d;
        bestObj = m;
      }
    });

    if (bestObj && this.onSelectObject) {
      const worldPos = new THREE.Vector3();
      bestObj.getWorldPosition(worldPos);
      this.onSelectObject(bestObj.userData, worldPos);
      this._notifyGameHud(`Inspeccionando: ${bestObj.userData.name}`);
    }
  }

  /**
   * Resuelve colisiones 2D por nivel para evitar que el jugador atraviese paredes perimetrales o tabiques internos,
   * permitiendo el paso fluido por puertas y vanos reales.
   */
  _resolveWallCollisions(oldX, oldZ, newX, newZ, y) {
    const r = 0.28; // Radio de cuerpo del jugador
    let rx = Math.max(-4.58, Math.min(4.58, newX));
    let rz = Math.max(-5.20, Math.min(26.20, newZ));

    const collideSegmentZ = (wallZ, xMin, xMax) => {
      if (rx + r > xMin && rx - r < xMax) {
        if (oldZ <= wallZ - r && rz > wallZ - r) rz = wallZ - r;
        else if (oldZ >= wallZ + r && rz < wallZ + r) rz = wallZ + r;
      }
    };

    const collideSegmentX = (wallX, zMin, zMax) => {
      if (rz + r > zMin && rz - r < zMax) {
        if (oldX <= wallX - r && rx > wallX - r) rx = wallX - r;
        else if (oldX >= wallX + r && rx < wallX + r) rx = wallX + r;
      }
    };

    // 1. Muro Frontal de Línea Municipal (z = -4.00m): paso abierto por Portoncito Izquierdo (+X: x = +1.15..+2.25m) y Portón Balancín Derecho (-X: x = -3.50..-1.20m)
    collideSegmentZ(-4.00, -4.87, -3.50);
    collideSegmentZ(-4.00, -1.20, 1.15);
    collideSegmentZ(-4.00, 2.25, 4.87);

    if (this.currentScenario === 'hoy_en_obra') {
      return { x: rx, z: rz };
    }

    if (y > 1.8) {
      // --- COLISIONES PLANTA ALTA (+2.88m) ---
      // Fachada Frontal Eje G (z = 3.00m, ciega en PA)
      collideSegmentZ(3.00, -4.87, 4.87);
      // Muro divisorio de fila húmeda frontal con el Pasillo (z = 4.85m):
      // Puertas en x = -2.75m (SSHH 2), x = +0.10m (Baño Suite), x = +3.80m (Vestidor)
      collideSegmentZ(4.85, -3.84, -3.15);
      collideSegmentZ(4.85, -2.35, -0.30);
      collideSegmentZ(4.85, 0.50, 3.40);
      collideSegmentZ(4.85, 4.20, 4.87);
      // Muro sur de Dormitorio 2 hacia el Pasillo (z = 6.00m, entre x = -1.80m y x = +0.60m, puerta en x = -0.60m)
      collideSegmentZ(6.00, -1.80, -1.00);
      collideSegmentZ(6.00, -0.20, 0.60);
      // Muro de Dormitorio en Suite (x = +0.60m, entre z = 4.85m y z = 9.94m, puerta desde el pasillo en z = 5.42m)
      collideSegmentX(0.60, 5.85, 9.94);
      // Muro Este del Escritorio Extendido (x = -1.80m, desde z = 6.00m hasta Eje A z = 13.34m, con puerta lateral a Deck 2 en z = 10.15..10.95m)
      collideSegmentX(-1.80, 6.00, 10.15);
      collideSegmentX(-1.80, 10.95, 13.34);
      // En x = -4.87m..-1.80m (Escritorio), z = 9.94m está 100% abierto para dar lugar al desembarco de Escalera 2!
      // Baranda/Blindex hacia Deck 2 en Eje B (z = 9.94m, solo desde x = -1.80m a x = +4.87m): aberturas en Dorm 2 y Suite (x = +1.50..+3.90m)
      collideSegmentZ(9.94, -1.80, 1.50);
      collideSegmentZ(9.94, 3.90, 4.87);
      // Extremo Norte Eje A (z = 13.34m): Ventanal Blindex del Escritorio + Baranda de Deck 2
      collideSegmentZ(13.34, -4.87, 4.87);
    } else if (y >= -0.8) {
      // --- COLISIONES PLANTA BAJA (0.00m / -0.45m) ---
      // Fachada Eje G (z = 3.00m): Puerta Principal en x = +0.85m (0.30..1.40) y Puerta de Servicio Exterior en x = +4.35m (3.90..4.80)
      collideSegmentZ(3.00, -4.87, 0.30);
      collideSegmentZ(3.00, 1.40, 3.90);
      // Tabique del Hall de Servicio / Escalera 1 (x = +3.84m, de z = 3.00m a z = 9.94m):
      // Puerta Interior que comunica la casa con el Hall de Servicio y la Escalera 1 en z = 4.20m (3.75..4.65)
      collideSegmentX(3.84, 3.00, 3.75);
      collideSegmentX(3.84, 4.65, 9.94);
      // Baño Social en PB (x = -4.87..-2.80m, z = 3.00..4.77m, puerta en z = 4.77m, x = -3.45m)
      collideSegmentZ(4.77, -4.87, -3.85);
      collideSegmentZ(4.77, -3.05, -2.80);
      collideSegmentX(-2.80, 3.00, 4.77);
    } else {
      // --- COLISIONES SUBSUELO (-2.34m) ---
      // Muro de Contención del Estacionamiento en z = 1.50m
      collideSegmentZ(1.50, -4.87, 4.87);
      // Pared Frontal de Subsuelo en Eje G (z = 3.00m): vanos ventilados/puerta en x = -1.20..+1.20m
      collideSegmentZ(3.00, -4.87, -1.20);
      collideSegmentZ(3.00, 1.20, 4.87);
    }

    return { x: rx, z: rz };
  }

  _updateGameController(dt) {
    if (!this.gameMode) return;
    const moveSpeed = (this.keysPressed.ShiftLeft || this.keysPressed.ShiftRight) ? 5.2 : 2.9;
    const turnSpeed = 1.85;

    if (this.keysPressed.KeyA || this.keysPressed.ArrowLeft) {
      this.playerYaw += turnSpeed * dt;
    }
    if (this.keysPressed.KeyD || this.keysPressed.ArrowRight) {
      this.playerYaw -= turnSpeed * dt;
    }

    let forward = 0;
    if (this.keysPressed.KeyW || this.keysPressed.ArrowUp) forward += 1;
    if (this.keysPressed.KeyS || this.keysPressed.ArrowDown) forward -= 1;

    let strafe = 0;
    if (this.keysPressed.KeyQ) strafe += 1;

    const oldX = this.playerPos.x;
    const oldZ = this.playerPos.z;
    let nextX = oldX;
    let nextZ = oldZ;

    if (forward !== 0 || strafe !== 0) {
      nextX += (Math.sin(this.playerYaw) * forward + Math.cos(this.playerYaw) * strafe) * moveSpeed * dt;
      nextZ += (Math.cos(this.playerYaw) * forward - Math.sin(this.playerYaw) * strafe) * moveSpeed * dt;
    }

    const resolved = this._resolveWallCollisions(oldX, oldZ, nextX, nextZ, this.playerPos.y);
    this.playerPos.x = resolved.x;
    this.playerPos.z = resolved.z;

    // Alturas automáticas por escaleras en su lado real:
    // - Escalera 1 ya existente (PB <-> Subsuelo) en el lado +X (`x > 3.75m, z = 5.20..9.90m`)
    // - Escalera 2 (PB <-> 2do Piso) en el lado opuesto -X (`x < -3.75m, z = 5.20..8.85m`)
    let targetGroundY = this.playerPos.y;
    if (this.playerPos.x > 3.75 && this.playerPos.z >= 5.20 && this.playerPos.z <= 9.90 && this.playerPos.y <= 0.5) {
      const tStair1 = (this.playerPos.z - 5.20) / (9.90 - 5.20);
      targetGroundY = -2.34 * Math.max(0, Math.min(1, tStair1));
    } else if (this.playerPos.x < -3.75 && this.playerPos.z >= 5.20 && this.playerPos.z <= 8.85 && this.playerPos.y >= -0.2) {
      const tStair2 = (this.playerPos.z - 5.20) / (8.85 - 5.20);
      targetGroundY = 2.88 * Math.max(0, Math.min(1, tStair2));
    } else if (Math.abs(this.playerPos.y - 2.88) < 0.85 && this.playerPos.z >= 3.0 && this.playerPos.z <= 13.34) {
      targetGroundY = 2.88;
    } else if (this.playerPos.y < -1.1) {
      targetGroundY = -2.34;
    } else if (this.playerPos.z >= 9.94 && this.playerPos.z <= 13.34 && Math.abs(this.playerPos.y) < 0.8) {
      targetGroundY = -0.45;
    } else if (this.playerPos.z > 13.34 && this.playerPos.y < 1.0) {
      targetGroundY = -2.34;
    } else {
      targetGroundY = 0.0;
    }

    if (this.isJumping) {
      this.playerVelY -= 14.0 * dt;
      this.playerPos.y += this.playerVelY * dt;
      if (this.playerPos.y <= targetGroundY) {
        this.playerPos.y = targetGroundY;
        this.playerVelY = 0;
        this.isJumping = false;
      }
    } else {
      this.playerPos.y += (targetGroundY - this.playerPos.y) * Math.min(1, dt * 10);
    }

    if (this.playerAvatar) {
      this.playerAvatar.position.copy(this.playerPos);
      this.playerAvatar.rotation.y = this.playerYaw;
      this.playerAvatar.visible = this.thirdPersonView;
    }

    const lookDir = new THREE.Vector3(
      Math.sin(this.playerYaw) * Math.cos(this.playerPitch),
      Math.sin(this.playerPitch),
      Math.cos(this.playerYaw) * Math.cos(this.playerPitch)
    );
    const flatLookDir = new THREE.Vector3(Math.sin(this.playerYaw), 0, Math.cos(this.playerYaw));

    if (this.thirdPersonView) {
      // Cámara de hombro cercana (1.35m) con límite interior para que jamás atraviese paredes ni se pierda fuera de la casa
      const rawCamPos = this.playerPos.clone().add(flatLookDir.clone().multiplyScalar(-1.35)).add(new THREE.Vector3(0, 1.65, 0));
      const safeCamXZ = this._resolveWallCollisions(this.playerPos.x, this.playerPos.z, rawCamPos.x, rawCamPos.z, this.playerPos.y);
      rawCamPos.x = safeCamXZ.x;
      rawCamPos.z = safeCamXZ.z;
      this.camera.position.lerp(rawCamPos, 0.35);
      this.camera.lookAt(this.playerPos.clone().add(new THREE.Vector3(0, 1.42, 0)).add(lookDir.clone().multiplyScalar(2.5)));
    } else {
      const eye = this.playerPos.clone().add(new THREE.Vector3(0, 1.62, 0));
      this.camera.position.copy(eye);
      this.camera.lookAt(eye.clone().add(lookDir.clone().multiplyScalar(4.0)));
    }

    this._notifyGameHud();
  }

  /**
   * Activa/Desactiva el Modo de Colores Normativos del Banco en el modelo 3D
   */
  setBankColorMode(enabled) {
    this.bankColorMode = Boolean(enabled);
    if (!this._bankMats) {
      this._bankMats = {
        NEGRO: new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.55, metalness: 0.2 }),
        VERDE: new THREE.MeshStandardMaterial({ color: 0x16a34a, roughness: 0.45, metalness: 0.15 }),
        ROJO: new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.5, metalness: 0.15 }),
        AMARILLO: new THREE.MeshStandardMaterial({ color: 0xeab308, roughness: 0.38, metalness: 0.25 })
      };
    }

    const applyGroupBankMat = (grp, defaultBankKey) => {
      if (!grp) return;
      grp.traverse((child) => {
        if (!child.isMesh) return;
        const uData = child.userData || {};
        if (uData.type === 'vehiculo_propietario' || uData.type === 'mascota_familia' || uData.type === 'planta_decorativa') {
          return;
        }
        if (this.bankColorMode) {
          if (!uData._origMat) {
            uData._origMat = child.material;
          }
          const cat = uData.bankCategory;
          const nameStr = String(uData.name || '').toLowerCase();
          let key = defaultBankKey;

          if (cat === 'existente_negro') {
            key = 'NEGRO';
          } else if (cat === 'hormigon_verde') {
            key = 'VERDE';
          } else if (cat === 'nuevo_rojo') {
            key = 'ROJO';
          } else if (cat === 'refaccion_amarillo') {
            key = 'AMARILLO';
          } else if (
            nameStr.includes('sikadur') ||
            nameStr.includes('pelos') ||
            nameStr.includes('intemperie') ||
            nameStr.includes('eje 9')
          ) {
            key = 'AMARILLO';
          } else if (
            nameStr.includes('losa') ||
            nameStr.includes('viga') ||
            nameStr.includes('hormigón') ||
            nameStr.includes('hormigon')
          ) {
            key = 'VERDE';
          }
          child.material = this._bankMats[key] || this._bankMats[defaultBankKey];
        } else if (uData._origMat) {
          child.material = uData._origMat;
        }
      });
    };

    applyGroupBankMat(this.groups.structure, 'NEGRO');
    applyGroupBankMat(this.groups.losaFase1, 'VERDE');
    applyGroupBankMat(this.groups.losaFase2, 'VERDE');
    applyGroupBankMat(this.groups.muroEstacionamiento, 'ROJO');
    applyGroupBankMat(this.groups.archMain, 'ROJO');
    applyGroupBankMat(this.groups.archSubsuelo, 'ROJO');
    applyGroupBankMat(this.groups.roof, 'ROJO');
    return this.bankColorMode;
  }

  toggleMeasureMode(enabled) {
    this.measureMode = Boolean(enabled);
    if (!this.measureMode) {
      this.clearMeasurements();
    }
  }

  setMeasureMode(enabled) {
    this.toggleMeasureMode(enabled);
  }

  clearMeasurements() {
    this.measurePoints = [];
    while (this.groups.measurements.children.length > 0) {
      this.groups.measurements.remove(this.groups.measurements.children[0]);
    }
    if (this.onMeasurementUpdate) {
      this.onMeasurementUpdate(null);
    }
  }

  setCameraView(viewName) {
    if (ROOM_CAMERA_PRESETS[viewName]) {
      this.focusRoom(viewName);
      return;
    }

    const views = {
      overview: { pos: [16.5, 11.5, 22.0], target: [0, 1.1, 6.8], cutaway: 'full' },
      front: { pos: [3.2, 3.2, -12.5], target: [0, 1.0, 2.5], cutaway: 'full' },
      river: { pos: [-7.5, 5.2, 23.5], target: [0, 1.2, 8.0], cutaway: 'full' },
      side: { pos: [21.0, 4.8, 7.5], target: [0, 0.8, 7.5], cutaway: 'longitudinal_section' },
      geotech: { pos: [-15.5, 2.8, 8.5], target: [0, -2.2, 7.5], cutaway: 'full' },
      top: { pos: [0, 26.0, 7.5], target: [0, 0, 7.5], cutaway: 'cut_pa' },
      mirador: { pos: [0.0, 4.35, 11.5], target: [-12.0, 1.5, 65.0], cutaway: 'full' }
    };

    const preset = views[viewName] || views.overview;
    if (preset.cutaway) {
      this.setFloorCutaway(preset.cutaway);
    }

    const startPos = this.camera.position.clone();
    const endPos = new THREE.Vector3(...preset.pos);
    const startTarget = this.controls.target.clone();
    const endTarget = new THREE.Vector3(...preset.target);

    let progress = 0;
    const animateCam = () => {
      progress += 0.06;
      if (progress < 1) {
        const ease = 1 - Math.pow(1 - progress, 3);
        this.camera.position.lerpVectors(startPos, endPos, ease);
        this.controls.target.lerpVectors(startTarget, endTarget, ease);
        requestAnimationFrame(animateCam);
      } else {
        this.camera.position.copy(endPos);
        this.controls.target.copy(endTarget);
      }
    };
    animateCam();
  }

  setupEvents() {
    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });

    window.addEventListener('keydown', (e) => {
      if (!this.gameMode) return;
      this.keysPressed[e.code] = true;

      if (e.code === 'Space' && !this.isJumping) {
        this.isJumping = true;
        this.playerVelY = 4.8;
      } else if (e.code === 'KeyC') {
        this.thirdPersonView = !this.thirdPersonView;
        this._notifyGameHud();
      } else if (e.code === 'Digit1') {
        this.playerPos.set(0.85, 0.0, 4.2);
        this.playerYaw = 0;
        this._notifyGameHud('Teletransporte: Planta Baja (0.00m)');
      } else if (e.code === 'Digit2') {
        this.playerPos.set(-1.50, 2.88, 5.42);
        this.playerYaw = Math.PI / 2;
        this._notifyGameHud('Teletransporte: Pasillo Distribuidor Planta Alta (+2.88m)');
      } else if (e.code === 'Digit3') {
        this.playerPos.set(0.0, -2.34, 7.5);
        this.playerYaw = 0;
        this._notifyGameHud('Teletransporte: Gran Salón de Subsuelo (-2.34m)');
      } else if (e.code === 'KeyE') {
        this._interactNearestObject();
      } else if (e.code === 'Escape') {
        this.toggleGameMode(false);
      }
    });

    window.addEventListener('keyup', (e) => {
      if (this.keysPressed[e.code]) {
        delete this.keysPressed[e.code];
      }
    });

    let pointerDownPos = { x: 0, y: 0 };
    let lastLookPos = { x: 0, y: 0 };
    this.renderer.domElement.addEventListener('pointerdown', (e) => {
      pointerDownPos = { x: e.clientX, y: e.clientY };
      lastLookPos = { x: e.clientX, y: e.clientY };
      if (this.gameMode && e.button === 0) {
        this.isPointerDraggingLook = true;
      }
    });

    window.addEventListener('pointermove', (e) => {
      if (!this.gameMode || !this.isPointerDraggingLook) return;
      const dx = e.clientX - lastLookPos.x;
      const dy = e.clientY - lastLookPos.y;
      lastLookPos = { x: e.clientX, y: e.clientY };
      this.playerYaw -= dx * 0.0055;
      this.playerPitch = Math.max(-0.65, Math.min(0.65, this.playerPitch - dy * 0.0045));
    });

    window.addEventListener('pointerup', () => {
      this.isPointerDraggingLook = false;
    });

    this.renderer.domElement.addEventListener('pointerup', (e) => {
      const dist = Math.hypot(e.clientX - pointerDownPos.x, e.clientY - pointerDownPos.y);
      if (dist > 5) return;

      const rect = this.renderer.domElement.getBoundingClientRect();
      this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      this.raycaster.setFromCamera(this.mouse, this.camera);

      if (this.measureMode) {
        const allObjects = [this.groups.topography, ...this.interactableMeshes];
        const intersects = this.raycaster.intersectObjects(allObjects, true);
        if (intersects.length > 0) {
          this.handleMeasureClick(intersects[0].point);
        }
        return;
      }

      const visibleInteractables = this.interactableMeshes.filter((m) => {
        let p = m;
        while (p) {
          if (p.visible === false) return false;
          p = p.parent;
        }
        return true;
      });

      const intersects = this.raycaster.intersectObjects(visibleInteractables, true);
      if (intersects.length > 0) {
        let hitObj = intersects[0].object;
        while (hitObj && (!hitObj.userData || (!hitObj.userData.type && !hitObj.userData.name)) && hitObj.parent) {
          hitObj = hitObj.parent;
        }
        if (this.onSelectObject && hitObj && hitObj.userData) {
          this.onSelectObject(hitObj.userData, intersects[0].point);
        }
      } else if (this.onSelectObject) {
        this.onSelectObject(null);
      }
    });
  }

  handleMeasureClick(point) {
    if (this.measurePoints.length >= 2) {
      this.clearMeasurements();
    }

    this.measurePoints.push(point.clone());

    const markerGeo = new THREE.SphereGeometry(0.14, 16, 16);
    const markerMat = new THREE.MeshBasicMaterial({ color: 0xf43f5e });
    const marker = new THREE.Mesh(markerGeo, markerMat);
    marker.position.copy(point);
    this.groups.measurements.add(marker);

    if (this.measurePoints.length === 2) {
      const [p1, p2] = this.measurePoints;
      const lineGeo = new THREE.BufferGeometry().setFromPoints([p1, p2]);
      const lineMat = new THREE.LineBasicMaterial({ color: 0xf43f5e, linewidth: 3 });
      const line = new THREE.Line(lineGeo, lineMat);
      this.groups.measurements.add(line);

      const distance = p1.distanceTo(p2);
      const dx = Math.abs(p2.x - p1.x);
      const dy = Math.abs(p2.y - p1.y);
      const dz = Math.abs(p2.z - p1.z);

      if (this.onMeasurementUpdate) {
        this.onMeasurementUpdate({
          distance: distance.toFixed(2),
          dx: dx.toFixed(2),
          dy: dy.toFixed(2),
          dz: dz.toFixed(2)
        });
      }
    }
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const dt = Math.min(0.1, this.clock ? this.clock.getDelta() : 0.016);
    const t = performance.now() * 0.001;

    if (this.riverWaterMesh && this.riverWaterMesh.material && this.riverWaterMesh.material.map) {
      this.riverWaterMesh.material.map.offset.x = (t * 0.018) % 1;
      this.riverWaterMesh.material.map.offset.y = (t * 0.012) % 1;
    }

    if (this.pluvialSystem && this.layers.pluvial && this.groups.pluvialHydro.visible) {
      if (typeof this.pluvialSystem.updateRainFlow === 'function') {
        this.pluvialSystem.updateRainFlow(t);
      } else if (typeof this.pluvialSystem.updateAnimation === 'function') {
        this.pluvialSystem.updateAnimation(t);
      }
    }

    if (this.conduitsOutletsSystem && this.groups.ductosYEnchufes.visible) {
      if (typeof this.conduitsOutletsSystem.updateAnimation === 'function') {
        this.conduitsOutletsSystem.updateAnimation(t);
      }
    }

    if (this.gameMode) {
      this._updateGameController(dt);
    } else {
      this.controls.update();
    }

    this.renderer.render(this.scene, this.camera);
  }
}

