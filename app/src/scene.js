import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { PROJECT_METADATA, GEOTECHNICAL_DATA, ARCHITECTURAL_ROOMS, STRUCTURAL_ITEMS, CURATED_PHOTOS, CAMERA_VIEWS } from './data/projectData.js';

export class ProjectScene {
  constructor(canvasContainer, onSelectObject, onMeasurementUpdate) {
    this.container = canvasContainer;
    this.onSelectObject = onSelectObject;
    this.onMeasurementUpdate = onMeasurementUpdate;

    this.layers = {
      architecture: true,
      subsuelo: true,
      structure: true,
      geotech: true,
      topography: true,
      photos: true,
      measurements: true
    };

    this.currentOption = 'opcion1'; // 'opcion1', 'opcion2', 'subsuelo'
    this.xRayMode = false;
    this.measureMode = false;
    this.measurePoints = [];
    this.measureMeshes = [];

    this.init();
    this.buildTerrain();
    this.buildRiver();
    this.buildGeotech();
    this.buildStructure();
    this.buildArchitecture();
    this.buildPhotoHotspots();
    this.setupInteractions();
    this.animate();
  }

  init() {
    this.width = this.container.clientWidth;
    this.height = this.container.clientHeight;

    // Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0e131f);
    this.scene.fog = new THREE.FogExp2(0x0e131f, 0.008);

    // Camera
    this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 0.1, 1000);
    this.camera.position.set(18, 24, 28);

    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: "high-performance",
      logarithmicDepthBuffer: true
    });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.1;
    this.container.appendChild(this.renderer.domElement);

    // Controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.maxPolarAngle = Math.PI / 2 + 0.05; // allow slight low-angle view
    this.controls.minDistance = 3;
    this.controls.maxDistance = 150;
    this.controls.target.set(0, 2, 8);

    // Groups
    this.groups = {
      terrain: new THREE.Group(),
      river: new THREE.Group(),
      geotech: new THREE.Group(),
      structure: new THREE.Group(),
      archMain: new THREE.Group(),
      archSubsuelo: new THREE.Group(),
      photos: new THREE.Group(),
      measure: new THREE.Group(),
      hotspots: new THREE.Group()
    };

    Object.values(this.groups).forEach(g => this.scene.add(g));

    // Lights
    this.ambientLight = new THREE.AmbientLight(0xd9e5ff, 0.6);
    this.scene.add(this.ambientLight);

    this.hemiLight = new THREE.HemisphereLight(0xfff4e6, 0x3d352e, 0.5);
    this.scene.add(this.hemiLight);

    this.sunLight = new THREE.DirectionalLight(0xfff0dd, 2.2);
    this.sunLight.position.set(25, 35, -20);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.mapSize.width = 2048;
    this.sunLight.shadow.mapSize.height = 2048;
    this.sunLight.shadow.camera.near = 0.5;
    this.sunLight.shadow.camera.far = 120;
    const d = 30;
    this.sunLight.shadow.camera.left = -d;
    this.sunLight.shadow.camera.right = d;
    this.sunLight.shadow.camera.top = d;
    this.sunLight.shadow.camera.bottom = -d;
    this.sunLight.shadow.bias = -0.0005;
    this.scene.add(this.sunLight);

    // Sun sphere indicator
    const sunGeom = new THREE.SphereGeometry(1.5, 16, 16);
    const sunMat = new THREE.MeshBasicMaterial({ color: 0xffdd88 });
    this.sunMesh = new THREE.Mesh(sunGeom, sunMat);
    this.sunMesh.position.copy(this.sunLight.position);
    this.scene.add(this.sunMesh);

    // Raycaster for interactions
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    // Resize listener
    window.addEventListener('resize', this.onResize.bind(this));
  }

  // Terrain generation based on real survey elevations
  // Z = -6 (Street RN +100.00m) -> Z = 2 (P1 +99.84m) -> Z = 16 (P2 +97.15m) -> Z = 28 (P3 +96.20m) -> Z = 45 (Slope to river)
  buildTerrain() {
    this.groups.terrain.clear();

    const nx = 40;
    const nz = 60;
    const width = 28; // X span (-14 to +14)
    const depth = 65; // Z span (-12 to +53)

    const geom = new THREE.PlaneGeometry(width, depth, nx - 1, nz - 1);
    geom.rotateX(-Math.PI / 2);

    const pos = geom.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      const elevation = this.getTerrainHeight(x, z);
      pos.setY(i, elevation);
    }
    geom.computeVertexNormals();

    // Natural soil / red clay & grass material
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#6a4a35'; // Red clay of Asunción / Itá Pytã Punta
    ctx.fillRect(0, 0, 512, 512);
    // Subtle procedural noise
    for (let i = 0; i < 6000; i++) {
      const px = Math.random() * 512;
      const py = Math.random() * 512;
      ctx.fillStyle = Math.random() > 0.5 ? '#7a553e' : '#573d2a';
      ctx.fillRect(px, py, 2, 2);
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(6, 12);

    const mat = new THREE.MeshStandardMaterial({
      color: 0x8a6348,
      roughness: 0.85,
      metalness: 0.05,
      map: texture,
      flatShading: false
    });

    this.terrainMesh = new THREE.Mesh(geom, mat);
    this.terrainMesh.receiveShadow = true;
    this.terrainMesh.castShadow = false;
    this.terrainMesh.userData = { type: 'terrain', name: 'Terreno Natural (Pendiente Itá Pytã Punta)' };
    this.groups.terrain.add(this.terrainMesh);

    // Lot boundary outline (9.89m width x 31m depth)
    const lotPoints = [
      new THREE.Vector3(-4.95, this.getTerrainHeight(-4.95, -4) + 0.05, -4),
      new THREE.Vector3(4.95, this.getTerrainHeight(4.95, -4) + 0.05, -4),
      new THREE.Vector3(4.95, this.getTerrainHeight(4.95, 27) + 0.05, 27),
      new THREE.Vector3(-4.95, this.getTerrainHeight(-4.95, 27) + 0.05, 27),
      new THREE.Vector3(-4.95, this.getTerrainHeight(-4.95, -4) + 0.05, -4)
    ];
    const lotLineGeom = new THREE.BufferGeometry().setFromPoints(lotPoints);
    const lotLineMat = new THREE.LineDashedMaterial({
      color: 0xf59e0b,
      dashSize: 0.8,
      gapSize: 0.4,
      linewidth: 2
    });
    const lotLine = new THREE.Line(lotLineGeom, lotLineMat);
    lotLine.computeLineDistances();
    this.groups.terrain.add(lotLine);

    // Contour lines (Curvas de nivel CAD every 1m)
    this.buildContourLines();

    // Street curb and pavement (Calle Guillermo Arias)
    const streetGeom = new THREE.BoxGeometry(26, 0.4, 6);
    const streetMat = new THREE.MeshStandardMaterial({ color: 0x22262d, roughness: 0.7 });
    const streetMesh = new THREE.Mesh(streetGeom, streetMat);
    streetMesh.position.set(0, 0 - 0.2, -7);
    streetMesh.receiveShadow = true;
    streetMesh.userData = { name: "Calle Guillermo Arias (Cota +100.00m)" };
    this.groups.terrain.add(streetMesh);
  }

  getTerrainHeight(x, z) {
    // Reference: RN (Z = -4) = 0m (representing +100.00m)
    // S1 (Z = 2) = -0.16m (+99.84m)
    // S2 (Z = 16) = -2.85m (+97.15m)
    // S3 (Z = 27) = -3.80m (+96.20m)
    // Beyond Z = 28: steep natural cliff/ravine down towards the river
    let baseH = 0;
    if (z <= -4) {
      baseH = 0;
    } else if (z <= 2) {
      const t = (z - (-4)) / 6;
      baseH = -0.16 * t;
    } else if (z <= 16) {
      const t = (z - 2) / 14;
      baseH = -0.16 - (2.69 * t);
    } else if (z <= 27) {
      const t = (z - 16) / 11;
      baseH = -2.85 - (0.95 * t);
    } else {
      // Steep slope / barranco down to river
      const t = (z - 27) / 26;
      baseH = -3.80 - (18.0 * Math.pow(t, 1.4));
    }

    // Lot flattening where house foundation sits (excavation and backfill plateau)
    if (x >= -4.8 && x <= 4.8 && z >= 2 && z <= 15) {
      // Plataforma nivelada para la vivienda
      const houseT = Math.min(1, Math.max(0, (z - 2) / 13));
      const targetPlat = -0.5 - (1.2 * houseT);
      baseH = baseH * 0.4 + targetPlat * 0.6;
    }

    // Slight organic variation outside the lot
    const noise = Math.sin(x * 0.3) * Math.cos(z * 0.2) * 0.15;
    return baseH + noise;
  }

  buildContourLines() {
    // Generate 3D contour lines at integer elevations (+100m, +99m, +98m, +97m, +96m)
    const contourLevels = [
      { y: 0.0, label: "+100.00 m (Calle Guillermo Arias)" },
      { y: -1.0, label: "+99.00 m" },
      { y: -2.0, label: "+98.00 m" },
      { y: -3.0, label: "+97.00 m (Nivel Subsuelo)" },
      { y: -4.0, label: "+96.00 m (Fondo Terreno)" }
    ];

    contourLevels.forEach(lvl => {
      const points = [];
      for (let x = -12; x <= 12; x += 0.5) {
        // Approximate Z where elevation matches lvl.y
        let matchedZ = -4;
        for (let testZ = -4; testZ <= 30; testZ += 0.2) {
          if (this.getTerrainHeight(x, testZ) <= lvl.y) {
            matchedZ = testZ;
            break;
          }
        }
        points.push(new THREE.Vector3(x, lvl.y + 0.03, matchedZ));
      }
      const geom = new THREE.BufferGeometry().setFromPoints(points);
      const mat = new THREE.LineBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.55
      });
      const line = new THREE.Line(geom, mat);
      line.userData = { type: 'contour', label: lvl.label };
      this.groups.terrain.add(line);
    });
  }

  buildRiver() {
    this.groups.river.clear();

    // River Paraguay in the distance (Z = 45 to 140)
    const riverGeom = new THREE.PlaneGeometry(160, 90, 32, 32);
    riverGeom.rotateX(-Math.PI / 2);

    const riverMat = new THREE.MeshStandardMaterial({
      color: 0x1d4ed8,
      roughness: 0.15,
      metalness: 0.8,
      transparent: true,
      opacity: 0.88
    });

    const riverMesh = new THREE.Mesh(riverGeom, riverMat);
    riverMesh.position.set(0, -22, 85);
    riverMesh.userData = { name: "Río Paraguay", desc: "Vista panorámica Noroeste desde la galería" };
    this.groups.river.add(riverMesh);

    // Distant island / Chaco bank
    const bankGeom = new THREE.BoxGeometry(160, 4, 30);
    const bankMat = new THREE.MeshStandardMaterial({ color: 0x1b382b, roughness: 0.9 });
    const bankMesh = new THREE.Mesh(bankGeom, bankMat);
    bankMesh.position.set(0, -20, 135);
    this.groups.river.add(bankMesh);
  }

  // Geotechnical boreholes and 3D soil stratigraphy
  buildGeotech() {
    this.groups.geotech.clear();

    GEOTECHNICAL_DATA.boreholes.forEach((bh) => {
      const bhGroup = new THREE.Group();
      const mouthY = this.getTerrainHeight(bh.xRel, bh.yRel);
      bhGroup.position.set(bh.xRel, mouthY, bh.yRel);

      // Strata cylinders
      let currentDepth = 0;
      bh.estratos.forEach((estrato) => {
        const thickness = estrato.a - estrato.de;
        const radius = 0.28;
        const geom = new THREE.CylinderGeometry(radius, radius, thickness, 20);
        const mat = new THREE.MeshStandardMaterial({
          color: new THREE.Color(estrato.color),
          roughness: 0.7,
          metalness: 0.1
        });
        const mesh = new THREE.Mesh(geom, mat);
        // Center cylinder vertically in its depth interval
        mesh.position.y = - (estrato.de + thickness / 2);
        mesh.userData = {
          type: 'estrato',
          borehole: bh.name,
          estrato: estrato.tipo,
          desc: estrato.desc,
          nspt: estrato.nspt,
          interval: `${estrato.de.toFixed(1)}m a ${estrato.a.toFixed(1)}m`
        };
        bhGroup.add(mesh);
      });

      // Drilling casing / borehole ring at surface
      const ringGeom = new THREE.TorusGeometry(0.35, 0.08, 12, 24);
      ringGeom.rotateX(Math.PI / 2);
      const ringMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.8, roughness: 0.2 });
      const ringMesh = new THREE.Mesh(ringGeom, ringMat);
      bhGroup.add(ringMesh);

      // Pulsing 3D Pin / Marker on top
      const pinGeom = new THREE.ConeGeometry(0.35, 0.9, 16);
      pinGeom.rotateX(Math.PI);
      const pinMat = new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0x7f1d1d, roughness: 0.3 });
      const pinMesh = new THREE.Mesh(pinGeom, pinMat);
      pinMesh.position.y = 1.0;
      pinMesh.userData = {
        type: 'borehole',
        id: bh.id,
        name: bh.name,
        cota: bh.cotaBoca,
        prof: bh.profundidad,
        estratos: bh.estratos
      };
      bhGroup.add(pinMesh);

      this.groups.geotech.add(bhGroup);
    });
  }

  // Reinforced Concrete Foundations (Z1..Z20, pilares, vigas)
  buildStructure() {
    this.groups.structure.clear();

    const concreteMat = new THREE.MeshStandardMaterial({
      color: 0x9ca3af,
      roughness: 0.65,
      metalness: 0.1
    });

    const highlightMat = new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      roughness: 0.3,
      metalness: 0.5,
      emissive: 0x083344
    });

    // 4 rows x 5 columns grid of footings and columns (Z1 to Z20)
    // Front to back (Z from 3m to 23m), left to right (X from -3.6m to +3.6m)
    const zPositions = [3, 9, 15, 21];
    const xPositions = [-3.8, -1.9, 0, 1.9, 3.8];

    let count = 1;
    zPositions.forEach((z) => {
      xPositions.forEach((x) => {
        const footingGroup = new THREE.Group();

        const groundY = this.getTerrainHeight(x, z);
        const footingDepth = -1.2; // 1.2m below local ground
        const footingY = groundY + footingDepth;

        // Zapata (Footing) 1.2m x 1.2m x 0.4m
        const zapataGeom = new THREE.BoxGeometry(1.2, 0.4, 1.2);
        const zapataMesh = new THREE.Mesh(zapataGeom, concreteMat.clone());
        zapataMesh.position.set(x, footingY, z);
        zapataMesh.castShadow = true;
        zapataMesh.receiveShadow = true;
        zapataMesh.userData = {
          type: 'zapata',
          name: `Zapata Z${count}`,
          desc: `Fundación aislada H°A° (1.20 x 1.20 x 0.40m). Apoyo en arena densa SM.`,
          cota: (100 + footingY).toFixed(2) + " m",
          status: "Ejecutado al 100% (Verificado en Acta JIVESA)"
        };
        footingGroup.add(zapataMesh);

        // Pilar (Column 15x30cm) rising to ground floor level (+100.00m = Y: 0)
        const colTopY = 0.1; // Planta baja slab bottom
        const colHeight = colTopY - (footingY + 0.2);
        if (colHeight > 0.3) {
          const colGeom = new THREE.BoxGeometry(0.3, colHeight, 0.15);
          const colMesh = new THREE.Mesh(colGeom, concreteMat.clone());
          colMesh.position.set(x, footingY + 0.2 + colHeight / 2, z);
          colMesh.castShadow = true;
          colMesh.userData = {
            type: 'pilar',
            name: `Pilar P${count}`,
            dimensions: "15cm x 30cm",
            height: colHeight.toFixed(2) + " m",
            status: "Hormigonado y verificado"
          };
          footingGroup.add(colMesh);
        }

        this.groups.structure.add(footingGroup);
        count++;
      });
    });

    // Encadenado beams linking columns at subsuelo / ground level
    zPositions.forEach((z) => {
      const beamGeom = new THREE.BoxGeometry(8.2, 0.3, 0.2);
      const beamMesh = new THREE.Mesh(beamGeom, concreteMat);
      beamMesh.position.set(0, -0.1, z);
      beamMesh.castShadow = true;
      beamMesh.userData = { name: `Viga de Encadenado Z=${z}m (15x30cm)` };
      this.groups.structure.add(beamMesh);
    });

    xPositions.forEach((x) => {
      const beamGeom = new THREE.BoxGeometry(0.2, 0.3, 19);
      const beamMesh = new THREE.Mesh(beamGeom, concreteMat);
      beamMesh.position.set(x, -0.1, 12);
      beamMesh.castShadow = true;
      this.groups.structure.add(beamMesh);
    });

    // Losa Alivianada (Loza Rap 38m2)
    const losaGeom = new THREE.BoxGeometry(8.2, 0.2, 18.5);
    const losaMesh = new THREE.Mesh(losaGeom, concreteMat);
    losaMesh.position.set(0, 0.0, 12);
    losaMesh.receiveShadow = true;
    losaMesh.castShadow = true;
    losaMesh.userData = {
      name: "Losa Alivianada (Loza Rap)",
      area: "38.00 m2",
      type: "Viguetas pretensadas + Bovedillas + Capa de compresión 5cm"
    };
    this.groups.structure.add(losaMesh);
  }

  // Architectural Model (Planta Baja, Galería, Subsuelo, Techos, Aberturas)
  buildArchitecture() {
    this.groups.archMain.clear();
    this.groups.archSubsuelo.clear();

    const wallMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.8,
      metalness: 0.05
    });

    const woodDeckMat = new THREE.MeshStandardMaterial({
      color: 0x92400e,
      roughness: 0.45,
      metalness: 0.1
    });

    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x93c5fd,
      transmission: 0.85,
      opacity: 0.35,
      transparent: true,
      roughness: 0.1,
      ior: 1.5
    });

    const roofMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      roughness: 0.5,
      metalness: 0.4
    });

    // --- PLANTA BAJA (Level +100.00m, Y = 0) ---
    // Floor finished slab
    const floorGeom = new THREE.BoxGeometry(8.0, 0.15, 14.0);
    const floorMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.3 });
    const floorMesh = new THREE.Mesh(floorGeom, floorMat);
    floorMesh.position.set(0, 0.1, 7.5);
    floorMesh.receiveShadow = true;
    this.groups.archMain.add(floorMesh);

    // GALERÍA PANORÁMICA (3.50m x 9.55m) at Z = 14.5 to 18.0
    // Cantilevered deck extending towards the river
    const deckGeom = new THREE.BoxGeometry(9.55, 0.2, 3.5);
    const deckMesh = new THREE.Mesh(deckGeom, woodDeckMat);
    deckMesh.position.set(0, 0.1, 16.25);
    deckMesh.receiveShadow = true;
    deckMesh.castShadow = true;
    deckMesh.userData = ARCHITECTURAL_ROOMS.find(r => r.id === 'galeria');
    this.groups.archMain.add(deckMesh);

    // Galería Pergola / Roof cover
    const pergolaGeom = new THREE.BoxGeometry(9.55, 0.1, 3.5);
    const pergolaMesh = new THREE.Mesh(pergolaGeom, roofMat);
    pergolaMesh.position.set(0, 3.2, 16.25);
    pergolaMesh.castShadow = true;
    this.groups.archMain.add(pergolaMesh);

    // Slender steel columns supporting pergola
    [-4.5, 0, 4.5].forEach(x => {
      const colGeom = new THREE.CylinderGeometry(0.06, 0.06, 3.1, 16);
      const colMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8, roughness: 0.2 });
      const col = new THREE.Mesh(colGeom, colMat);
      col.position.set(x, 1.65, 17.8);
      col.castShadow = true;
      this.groups.archMain.add(col);
    });

    // Glass safety railing along the gallery edge facing the river
    const railGeom = new THREE.BoxGeometry(9.4, 1.0, 0.04);
    const railMesh = new THREE.Mesh(railGeom, glassMat);
    railMesh.position.set(0, 0.7, 17.95);
    this.groups.archMain.add(railMesh);

    // Barbecue Grill / Parrilla block
    const parrillaGeom = new THREE.BoxGeometry(1.6, 2.8, 1.0);
    const brickMat = new THREE.MeshStandardMaterial({ color: 0x9a3412, roughness: 0.8 });
    const parrillaMesh = new THREE.Mesh(parrillaGeom, brickMat);
    parrillaMesh.position.set(3.8, 1.5, 16.2);
    parrillaMesh.castShadow = true;
    parrillaMesh.userData = { name: "Parrilla Tradicional de Ladrillo Refractario", desc: "Campana y ducto de salida integrada" };
    this.groups.archMain.add(parrillaMesh);

    // EXTERIOR WALLS
    // Back wall with large sliding glass opening (Z = 14.5)
    this.createWallWithOpening(this.groups.archMain, 8.0, 2.9, 0.2, 0, 1.55, 14.5, 5.0, 2.4, wallMat, glassMat);

    // Front wall (Guillermo Arias entrance at Z = 0.5)
    this.createWallWithOpening(this.groups.archMain, 8.0, 2.9, 0.2, 0, 1.55, 0.5, 1.2, 2.2, wallMat, glassMat);

    // Left lateral wall (X = -4.0)
    const wallLeft = new THREE.Mesh(new THREE.BoxGeometry(0.2, 2.9, 14.0), wallMat);
    wallLeft.position.set(-4.0, 1.55, 7.5);
    wallLeft.castShadow = true;
    this.groups.archMain.add(wallLeft);

    // Right lateral wall (X = 4.0)
    const wallRight = new THREE.Mesh(new THREE.BoxGeometry(0.2, 2.9, 14.0), wallMat);
    wallRight.position.set(4.0, 1.55, 7.5);
    wallRight.castShadow = true;
    this.groups.archMain.add(wallRight);

    // INTERIOR PARTITIONS (Based on Option 1 / Option 2)
    // Master suite partition
    const suiteWall = new THREE.Mesh(new THREE.BoxGeometry(4.0, 2.8, 0.15), wallMat);
    suiteWall.position.set(-2.0, 1.5, 6.0);
    suiteWall.castShadow = true;
    this.groups.archMain.add(suiteWall);

    // Bathroom partition (SSHH 1.25 x 2.22m)
    const bathWall = new THREE.Mesh(new THREE.BoxGeometry(0.15, 2.8, 2.4), wallMat);
    bathWall.position.set(-1.8, 1.5, 3.5);
    this.groups.archMain.add(bathWall);

    // Kitchen island and counter
    const kitchenIsland = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.9, 0.9), new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.3 }));
    kitchenIsland.position.set(2.2, 0.55, 8.0);
    kitchenIsland.castShadow = true;
    kitchenIsland.userData = ARCHITECTURAL_ROOMS.find(r => r.id === 'cocina');
    this.groups.archMain.add(kitchenIsland);

    // Dining table & chairs
    const tableMesh = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.75, 1.0), new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.5 }));
    tableMesh.position.set(2.0, 0.45, 11.5);
    tableMesh.castShadow = true;
    this.groups.archMain.add(tableMesh);

    // Living sofa
    const sofaMesh = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.8, 1.2), new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.9 }));
    sofaMesh.position.set(-1.8, 0.5, 11.5);
    sofaMesh.castShadow = true;
    sofaMesh.userData = ARCHITECTURAL_ROOMS.find(r => r.id === 'estar_comedor');
    this.groups.archMain.add(sofaMesh);

    // Main Master Bed
    const bedMesh = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.6, 2.0), new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.7 }));
    bedMesh.position.set(-2.2, 0.4, 3.0);
    bedMesh.castShadow = true;
    bedMesh.userData = ARCHITECTURAL_ROOMS.find(r => r.id === 'suite');
    this.groups.archMain.add(bedMesh);

    // Modern roof with hidden parapet (techo escondido)
    const mainRoof = new THREE.Mesh(new THREE.BoxGeometry(8.4, 0.25, 14.4), roofMat);
    mainRoof.position.set(0, 3.1, 7.5);
    mainRoof.castShadow = true;
    mainRoof.userData = { name: "Cubierta Termoacústica y Losa Rap", desc: "Aislación hidrófuga y desagüe pluvial" };
    this.groups.archMain.add(mainRoof);

    // Parapet borders
    const parapetGeom = new THREE.BoxGeometry(8.4, 0.6, 0.2);
    const frontParapet = new THREE.Mesh(parapetGeom, wallMat);
    frontParapet.position.set(0, 3.4, 0.4);
    this.groups.archMain.add(frontParapet);

    // --- SUBSUELO (Level +97.00m, Y = -3.0m) ---
    // Taking full advantage of the 3.5m natural slope!
    const subFloorGeom = new THREE.BoxGeometry(7.6, 0.15, 8.0);
    const subFloor = new THREE.Mesh(subFloorGeom, floorMat);
    subFloor.position.set(0, -2.9, 18.0);
    subFloor.receiveShadow = true;
    this.groups.archSubsuelo.add(subFloor);

    // Stone Retaining wall holding upper earth
    const stoneMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.95 });
    const retainingWall = new THREE.Mesh(new THREE.BoxGeometry(8.0, 3.0, 0.4), stoneMat);
    retainingWall.position.set(0, -1.5, 14.0);
    retainingWall.castShadow = true;
    retainingWall.userData = { name: "Muro de Contención de Piedra Bruta", desc: "Contiene el desnivel de 3 metros entre planta baja y subsuelo" };
    this.groups.archSubsuelo.add(retainingWall);

    // Subsuelo walls and window facing lower river garden
    this.createWallWithOpening(this.groups.archSubsuelo, 7.6, 2.6, 0.2, 0, -1.6, 22.0, 3.0, 2.0, wallMat, glassMat);

    // Lateral walls for subsuelo
    [-3.8, 3.8].forEach(x => {
      const sw = new THREE.Mesh(new THREE.BoxGeometry(0.2, 2.6, 8.0), wallMat);
      sw.position.set(x, -1.6, 18.0);
      sw.castShadow = true;
      this.groups.archSubsuelo.add(sw);
    });

    // Subsuelo furniture / room marker
    const subBed = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.5, 1.8), new THREE.MeshStandardMaterial({ color: 0x64748b }));
    subBed.position.set(-2.0, -2.6, 16.5);
    subBed.userData = ARCHITECTURAL_ROOMS.find(r => r.id === 'subsuelo_depto');
    this.groups.archSubsuelo.add(subBed);

    // Independent exterior access staircase from ground level to subsuelo
    this.buildExteriorStairs();
  }

  createWallWithOpening(parent, totalW, totalH, thickness, cx, cy, cz, openW, openH, wallMat, glassMat) {
    const wallGroup = new THREE.Group();
    wallGroup.position.set(cx, cy, cz);

    const sideW = (totalW - openW) / 2;
    // Left part
    const leftMesh = new THREE.Mesh(new THREE.BoxGeometry(sideW, totalH, thickness), wallMat);
    leftMesh.position.set(-totalW / 2 + sideW / 2, 0, 0);
    leftMesh.castShadow = true;
    wallGroup.add(leftMesh);

    // Right part
    const rightMesh = new THREE.Mesh(new THREE.BoxGeometry(sideW, totalH, thickness), wallMat);
    rightMesh.position.set(totalW / 2 - sideW / 2, 0, 0);
    rightMesh.castShadow = true;
    wallGroup.add(rightMesh);

    // Top lintel above opening
    const topH = totalH - openH;
    if (topH > 0) {
      const topMesh = new THREE.Mesh(new THREE.BoxGeometry(openW, topH, thickness), wallMat);
      topMesh.position.set(0, totalH / 2 - topH / 2, 0);
      topMesh.castShadow = true;
      wallGroup.add(topMesh);
    }

    // Glass panel in the opening
    const glassMesh = new THREE.Mesh(new THREE.BoxGeometry(openW, openH, thickness * 0.4), glassMat);
    glassMesh.position.set(0, -totalH / 2 + openH / 2, 0);
    wallGroup.add(glassMesh);

    parent.add(wallGroup);
  }

  buildExteriorStairs() {
    const numSteps = 16;
    const stepH = 3.0 / numSteps;
    const stepD = 0.35;
    const stepW = 1.0;
    const concreteMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.7 });

    for (let i = 0; i < numSteps; i++) {
      const stepMesh = new THREE.Mesh(new THREE.BoxGeometry(stepW, stepH, stepD), concreteMat);
      stepMesh.position.set(4.5, - (i * stepH) - stepH / 2, 14.2 + (i * stepD));
      stepMesh.castShadow = true;
      this.groups.archSubsuelo.add(stepMesh);
    }
  }

  // Interactive 3D Photo Hotspots from the Google Photos album
  buildPhotoHotspots() {
    this.groups.photos.clear();

    const photoPositions = [
      { x: 0, y: 1.0, z: -2, index: 0, title: "Vista Panorámica del Terreno" },
      { x: 0, y: 0.8, z: 4, index: 1, title: "Replanteo y Sondeo Geotécnico" },
      { x: 2, y: 0.5, z: 9, index: 2, title: "Excavación y Movimiento de Suelo" },
      { x: -1, y: -0.5, z: 14, index: 3, title: "Armaduras y Carga de Zapatas" },
      { x: 3, y: -1.2, z: 18, index: 4, title: "Muros de Contención de Piedra" },
      { x: -2, y: 0.6, z: 11, index: 5, title: "Pilares Hormigonados" },
      { x: 0, y: 2.0, z: 16, index: 6, title: "Atardecer hacia el Río Paraguay" },
      { x: 0, y: 1.5, z: 23, index: 7, title: "Perspectiva General de Obra" }
    ];

    photoPositions.forEach(p => {
      const group = new THREE.Group();
      const realY = this.getTerrainHeight(p.x, p.z) + 1.2;
      group.position.set(p.x, realY, p.z);

      // Camera icon badge
      const badgeGeom = new THREE.CylinderGeometry(0.35, 0.35, 0.08, 24);
      badgeGeom.rotateX(Math.PI / 2);
      const badgeMat = new THREE.MeshStandardMaterial({
        color: 0x3b82f6,
        emissive: 0x1d4ed8,
        emissiveIntensity: 0.4,
        roughness: 0.2
      });
      const badge = new THREE.Mesh(badgeGeom, badgeMat);
      group.add(badge);

      // Inner lens
      const lensGeom = new THREE.CylinderGeometry(0.18, 0.18, 0.1, 16);
      lensGeom.rotateX(Math.PI / 2);
      const lensMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const lens = new THREE.Mesh(lensGeom, lensMat);
      lens.position.z = 0.02;
      group.add(lens);

      group.userData = {
        type: 'photoHotspot',
        index: p.index,
        data: CURATED_PHOTOS[p.index]
      };

      this.groups.photos.add(group);
    });
  }

  // CAD Measurement Tool
  handleClick(event) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.scene.children, true);

    if (this.measureMode) {
      if (intersects.length > 0) {
        const hit = intersects[0].point;
        this.addMeasurePoint(hit);
      }
      return;
    }

    if (intersects.length > 0) {
      // Find highest ancestor with userData
      let obj = intersects[0].object;
      while (obj && !obj.userData?.type && !obj.userData?.name && obj.parent !== this.scene) {
        obj = obj.parent;
      }
      if (obj && (obj.userData?.type || obj.userData?.name)) {
        if (this.onSelectObject) this.onSelectObject(obj.userData, intersects[0].point);
      }
    }
  }

  addMeasurePoint(point) {
    this.measurePoints.push(point);

    // Marker sphere
    const marker = new THREE.Mesh(
      new THREE.SphereGeometry(0.15, 16, 16),
      new THREE.MeshBasicMaterial({ color: 0x10b981 })
    );
    marker.position.copy(point);
    this.groups.measure.add(marker);
    this.measureMeshes.push(marker);

    if (this.measurePoints.length === 2) {
      const p1 = this.measurePoints[0];
      const p2 = this.measurePoints[1];
      const dist = p1.distanceTo(p2);

      // Line
      const geom = new THREE.BufferGeometry().setFromPoints([p1, p2]);
      const line = new THREE.Line(geom, new THREE.LineBasicMaterial({ color: 0x10b981, linewidth: 3 }));
      this.groups.measure.add(line);
      this.measureMeshes.push(line);

      const deltaX = Math.abs(p2.x - p1.x);
      const deltaY = Math.abs(p2.y - p1.y);
      const deltaZ = Math.abs(p2.z - p1.z);

      if (this.onMeasurementUpdate) {
        this.onMeasurementUpdate({
          distance: dist.toFixed(2),
          dx: deltaX.toFixed(2),
          dy: deltaY.toFixed(2),
          dz: deltaZ.toFixed(2)
        });
      }

      this.measurePoints = [];
    }
  }

  clearMeasurements() {
    this.measureMeshes.forEach(m => this.groups.measure.remove(m));
    this.measureMeshes = [];
    this.measurePoints = [];
    if (this.onMeasurementUpdate) this.onMeasurementUpdate(null);
  }

  setMeasureMode(enabled) {
    this.measureMode = enabled;
    if (!enabled) this.clearMeasurements();
  }

  // Layer Visibility Management
  setLayerVisibility(layerName, visible) {
    this.layers[layerName] = visible;
    switch (layerName) {
      case 'architecture':
        this.groups.archMain.visible = visible;
        break;
      case 'subsuelo':
        this.groups.archSubsuelo.visible = visible;
        break;
      case 'structure':
        this.groups.structure.visible = visible;
        break;
      case 'geotech':
        this.groups.geotech.visible = visible;
        break;
      case 'topography':
        this.groups.terrain.visible = visible;
        break;
      case 'photos':
        this.groups.photos.visible = visible;
        break;
    }
  }

  // X-Ray / Blueprint Structure Inspection Mode
  setXRayMode(enabled) {
    this.xRayMode = enabled;
    this.groups.archMain.traverse(child => {
      if (child.isMesh && child.material) {
        if (enabled) {
          child.material.transparent = true;
          child.material.opacity = 0.22;
          child.material.wireframe = false;
        } else {
          child.material.transparent = child.userData?.type === 'glass';
          child.material.opacity = child.userData?.type === 'glass' ? 0.35 : 1.0;
          child.material.wireframe = false;
        }
      }
    });

    this.groups.structure.traverse(child => {
      if (child.isMesh && child.material) {
        if (enabled) {
          child.material.color.setHex(0x06b6d4);
          child.material.emissive.setHex(0x083344);
        } else {
          child.material.color.setHex(0x9ca3af);
          child.material.emissive.setHex(0x000000);
        }
      }
    });
  }

  // Time of day sun orbit simulation (Hours 6 to 19)
  setTimeOfDay(hour) {
    // 6 = sunrise, 12 = noon, 18 = sunset over Paraguay river
    const angle = ((hour - 6) / 12) * Math.PI;
    const radius = 45;
    const x = Math.cos(angle) * radius;
    const y = Math.max(1, Math.sin(angle) * radius);
    const z = (hour >= 16) ? 35 : -15; // sunset is in the west/northwest over the river

    this.sunLight.position.set(x, y, z);
    this.sunMesh.position.copy(this.sunLight.position);

    if (hour >= 17) {
      // Golden Hour / Sunset
      this.sunLight.color.setHex(0xff7733);
      this.sunLight.intensity = 2.8;
      this.ambientLight.color.setHex(0xffaa77);
      this.ambientLight.intensity = 0.45;
      this.scene.background.setHex(0x1a0f1c);
      this.scene.fog.color.setHex(0x1a0f1c);
    } else if (hour <= 7) {
      // Early Morning
      this.sunLight.color.setHex(0xffc077);
      this.sunLight.intensity = 1.8;
      this.ambientLight.color.setHex(0x93c5fd);
      this.ambientLight.intensity = 0.5;
      this.scene.background.setHex(0x0d1b2a);
      this.scene.fog.color.setHex(0x0d1b2a);
    } else {
      // Daylight / Noon
      this.sunLight.color.setHex(0xfff6ea);
      this.sunLight.intensity = 2.2;
      this.ambientLight.color.setHex(0xd9e5ff);
      this.ambientLight.intensity = 0.6;
      this.scene.background.setHex(0x0e131f);
      this.scene.fog.color.setHex(0x0e131f);
    }
  }

  // Camera preset view transitions
  setCameraView(viewKey) {
    const view = CAMERA_VIEWS[viewKey];
    if (!view) return;

    this.animateCamera(
      new THREE.Vector3(...view.pos),
      new THREE.Vector3(...view.target),
      1200
    );
  }

  animateCamera(targetPos, targetLookAt, duration = 1000) {
    const startPos = this.camera.position.clone();
    const startTarget = this.controls.target.clone();
    const startTime = performance.now();

    const updateCam = () => {
      const elapsed = performance.now() - startTime;
      const progress = Math.min(1, elapsed / duration);
      // Ease in-out cubic
      const ease = progress < 0.5 ? 4 * progress * progress * progress : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      this.camera.position.lerpVectors(startPos, targetPos, ease);
      this.controls.target.lerpVectors(startTarget, targetLookAt, ease);
      this.controls.update();

      if (progress < 1) {
        requestAnimationFrame(updateCam);
      }
    };
    requestAnimationFrame(updateCam);
  }

  setupInteractions() {
    this.renderer.domElement.addEventListener('click', this.handleClick.bind(this));
  }

  onResize() {
    this.width = this.container.clientWidth;
    this.height = this.container.clientHeight;
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.width, this.height);
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));

    // Subtle gentle bobbing on photo hotspots
    const time = performance.now() * 0.002;
    this.groups.photos.children.forEach((hotspot, i) => {
      hotspot.position.y += Math.sin(time + i) * 0.0015;
      hotspot.rotation.y = time * 0.5;
    });

    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }
}
