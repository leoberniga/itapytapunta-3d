/**
 * @file archVizInterior.js
 * @description Motor ArchViz / PBR de Alta Fidelidad (estilo Unity / Unreal) para la Residencia Itá Pytã Punta.
 *
 * REGLAS RECTORES DE HABITABILIDAD Y PLANIFICACIÓN DE LEO:
 * 1. Desde `escenario300` (Gs. 300M) en adelante (incluyendo `escenario350`, `escenario370`, `escenario440`, `edifica460`, `edifica573`),
 *    SIEMPRE están construidos y equipados los 3 núcleos básicos para habitar la casa:
 *    - BAÑO COMPLETO HABITABLE (inodoro con mochila dual, bidet, vanitory con espejo, box de ducha y termocalefón 80L).
 *    - COCINA FUNCIONAL HABITABLE (mesada de granito, bacha doble inox con grifería, anafe/horno y heladera desde 300M;
 *      y desde 350M suma alacenas superiores, campana extractora e Isla Central Desayunadora con 3 banquetas).
 *    - LAVADERO OPERATIVO (pileta profunda de lavar con grifería + lavarropas automático de carga frontal desde 300M).
 * 2. Puerta Principal Jerarquizada (`x = +0.85m, z = 3.00m`, entre P14 y P10) y Puerta de Servicio Independiente
 *    (`x = +4.35m, z = 3.00m`, entre P7 y P4, alineada con la Escalera 1 al subsuelo y el acceso de servicio/cocina).
 * 3. Ventanales Blindex con carpintería de aluminio negro en todas las habitaciones (Suite PB, Dormitorios PA y Subsuelo)
 *    + Rejas de Seguridad en herrería tubular negra en los balcones de Planta Alta (`z = 2.15m` y `z = 13.34m`) y Galería (`Eje A`).
 * 4. Jardín con Césped Esmeralda (`grassPBR`), Piscina de `4.65m × 2.45m` (según Plano Oficial Pág. 2) con solárium y reposeras,
 *    y Quincho Semicubierto en el patio posterior (`z = 13.50m..26.00m`).
 * 5. Parrilla Portátil del Propietario (`Gs. 0`) en `300M..460M` vs. Parrilla fija de obra en `edifica573`.
 */

export const ROOM_CAMERA_PRESETS = {
  fachada_porton: {
    label: 'Fachada, Portón, Pasillo Antihumedad y Puertas (Eje G)',
    pos: [5.2, 2.8, -10.8],
    target: [1.5, 0.5, 2.0],
    cutaway: 'full'
  },
  escalera_subsuelo: {
    label: 'Puerta de Servicio + Escalera (Subsuelo ↔ PB ↔ 2do Piso)',
    pos: [1.4, 2.4, 3.6],
    target: [4.35, 0.2, 7.8],
    cutaway: 'cut_roof'
  },
  estar_comedor: {
    label: 'Nivel Calle (0.00m): Gran Sala de Estar y Comedor (Muebles Propios)',
    pos: [-0.4, 3.1, 3.2],
    target: [1.8, 0.85, 6.8],
    cutaway: 'cut_pa'
  },
  cocina_isla: {
    label: 'Nivel Calle (0.00m): Cocina Amplia Integrada + Equipos Propios',
    pos: [0.6, 2.8, 7.6],
    target: [-3.2, 0.95, 4.2],
    cutaway: 'cut_pa'
  },
  bano_suite: {
    label: '2do Piso (+2.88m): Baño Principal Completo en Suite',
    pos: [0.4, 5.4, 5.2],
    target: [-3.2, 3.65, 6.8],
    cutaway: 'cut_roof'
  },
  dormitorio_suite: {
    label: '2do Piso (+2.88m): Dormitorio Ruth y Leo + Estudio y Costura',
    pos: [4.2, 5.8, 4.4],
    target: [-1.4, 3.55, 9.6],
    cutaway: 'cut_roof'
  },
  galeria_parrilla: {
    label: 'Galería al Río + Parrilla Portátil y Rejas (Losa L1)',
    pos: [0.5, 1.85, 16.5],
    target: [-0.5, 0.45, 11.4],
    cutaway: 'cut_pa'
  },
  piscina_quincho: {
    label: 'Piscina (4.65×2.45m) + Quincho y Jardín con Césped',
    pos: [-5.2, 3.2, 24.8],
    target: [0.2, -1.8, 16.2],
    cutaway: 'full',
    forceShowPoolQuincho: true
  },
  subsuelo_depto: {
    label: 'Subsuelo Libre 100 m² (-2.34m): Lavadero + Depósito + Pasillo Antihumedad',
    pos: [2.8, 1.1, 2.2],
    target: [-1.5, -1.8, 7.8],
    cutaway: 'cut_pb'
  },
  planta_alta: {
    label: '2do Piso Completo (+2.88m): Suite Ruth y Leo, Estudio y Balcones al Río',
    pos: [5.6, 6.4, 15.8],
    target: [-0.4, 3.6, 8.2],
    cutaway: 'cut_roof'
  },
  corte_estructural: {
    label: 'Corte Longitudinal Estructural Completo (3 Niveles)',
    pos: [19.5, 4.8, 7.5],
    target: [0.0, 0.8, 7.5],
    cutaway: 'longitudinal_section'
  }
};

/**
 * Crea un par de texturas Canvas 1024x1024 (diffuse map + bump/roughness map) con repetición PBR
 */
function makeProceduralTexturePair(THREE, drawFn, repeatX = 2, repeatY = 2) {
  const size = 1024;
  const diffCanvas = document.createElement('canvas');
  diffCanvas.width = size;
  diffCanvas.height = size;
  const diffCtx = diffCanvas.getContext('2d');

  const bumpCanvas = document.createElement('canvas');
  bumpCanvas.width = size;
  bumpCanvas.height = size;
  const bumpCtx = bumpCanvas.getContext('2d');

  drawFn(diffCtx, bumpCtx, size);

  const map = new THREE.CanvasTexture(diffCanvas);
  map.colorSpace = THREE.SRGBColorSpace;
  map.wrapS = THREE.RepeatWrapping;
  map.wrapT = THREE.RepeatWrapping;
  map.repeat.set(repeatX, repeatY);
  map.anisotropy = 8;

  const bumpMap = new THREE.CanvasTexture(bumpCanvas);
  bumpMap.wrapS = THREE.RepeatWrapping;
  bumpMap.wrapT = THREE.RepeatWrapping;
  bumpMap.repeat.set(repeatX, repeatY);
  bumpMap.anisotropy = 8;

  return { map, bumpMap };
}

/**
 * Genera el catálogo completo de materiales PBR de alta definición para estructura, muros, pisos, jardín, piscina y mobiliario
 */
export function createArchVizMaterials(THREE) {
  // 1. Hormigón Visto Encofrado (concretePBR)
  const concreteTex = makeProceduralTexturePair(
    THREE,
    (ctx, bCtx, s) => {
      ctx.fillStyle = '#949ca6';
      ctx.fillRect(0, 0, s, s);
      bCtx.fillStyle = '#808080';
      bCtx.fillRect(0, 0, s, s);

      const plankH = 128;
      for (let y = 0; y < s; y += plankH) {
        const shade = 140 + ((y * 7) % 18) - 9;
        ctx.fillStyle = `rgb(${shade}, ${shade + 4}, ${shade + 10})`;
        ctx.fillRect(0, y, s, plankH - 2);

        ctx.fillStyle = 'rgba(51, 65, 85, 0.45)';
        ctx.fillRect(0, y, s, 3);
        bCtx.fillStyle = '#303030';
        bCtx.fillRect(0, y, s, 4);

        for (let i = 0; i < 450; i++) {
          const rx = (i * 73 + y * 19) % s;
          const ry = y + ((i * 29) % (plankH - 4));
          const alpha = (i % 5) * 0.025;
          ctx.fillStyle = i % 2 === 0 ? `rgba(255,255,255,${alpha})` : `rgba(30,41,59,${alpha})`;
          ctx.fillRect(rx, ry, 28, 2);
          bCtx.fillStyle = i % 2 === 0 ? '#969696' : '#686868';
          bCtx.fillRect(rx, ry, 18, 2);
        }
      }

      [256, 768].forEach((cx) => {
        [192, 448, 704, 960].forEach((cy) => {
          ctx.beginPath();
          ctx.arc(cx, cy, 10, 0, Math.PI * 2);
          ctx.fillStyle = '#64748b';
          ctx.fill();
          bCtx.beginPath();
          bCtx.arc(cx, cy, 10, 0, Math.PI * 2);
          bCtx.fillStyle = '#202020';
          bCtx.fill();
        });
      });
    },
    2,
    2
  );

  // 2. Mampostería de Ladrillo Cerámico Paraguayo (brickPBR)
  const brickTex = makeProceduralTexturePair(
    THREE,
    (ctx, bCtx, s) => {
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(0, 0, s, s);
      bCtx.fillStyle = '#262626';
      bCtx.fillRect(0, 0, s, s);

      const rows = 16;
      const cols = 8;
      const rowH = s / rows;
      const colW = s / cols;
      const mortar = 6;

      for (let r = 0; r < rows; r++) {
        const offset = (r % 2) * (colW / 2);
        for (let c = -1; c <= cols; c++) {
          const bx = c * colW + offset + mortar / 2;
          const by = r * rowH + mortar / 2;
          const bw = colW - mortar;
          const bh = rowH - mortar;

          const tone = ((r * 13 + c * 7) % 26) - 13;
          const red = Math.min(220, Math.max(150, 184 + tone));
          const green = Math.min(110, Math.max(65, 84 + Math.floor(tone * 0.5)));
          const blue = Math.min(80, Math.max(42, 56 + Math.floor(tone * 0.3)));

          ctx.fillStyle = `rgb(${red}, ${green}, ${blue})`;
          ctx.fillRect(bx, by, bw, bh);

          ctx.fillStyle = 'rgba(124, 45, 18, 0.18)';
          ctx.fillRect(bx + 4, by + 4, bw - 8, bh / 3);

          bCtx.fillStyle = '#dcdcdc';
          bCtx.fillRect(bx, by, bw, bh);
        }
      }
    },
    3,
    2
  );

  // 3. Muro Revocado y Pintado al Látex Marfil Cálido (plasterPBR)
  const plasterTex = makeProceduralTexturePair(
    THREE,
    (ctx, bCtx, s) => {
      ctx.fillStyle = '#f8f6f0';
      ctx.fillRect(0, 0, s, s);
      bCtx.fillStyle = '#808080';
      bCtx.fillRect(0, 0, s, s);

      for (let i = 0; i < 4000; i++) {
        const x = (i * 97) % s;
        const y = (i * 53 + Math.floor(i / 12) * 31) % s;
        ctx.fillStyle = i % 2 === 0 ? 'rgba(226, 232, 240, 0.35)' : 'rgba(255, 255, 255, 0.45)';
        ctx.fillRect(x, y, 4, 4);
        bCtx.fillStyle = i % 2 === 0 ? '#8a8a8a' : '#767676';
        bCtx.fillRect(x, y, 3, 3);
      }
    },
    3,
    2
  );

  // 4. Piso Porcelanato Rectificado 60x60cm Marfil / Piedra Clara (porcelainPBR)
  const porcelainTex = makeProceduralTexturePair(
    THREE,
    (ctx, bCtx, s) => {
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(0, 0, s, s);
      bCtx.fillStyle = '#303030';
      bCtx.fillRect(0, 0, s, s);

      const tiles = 4;
      const tileSize = s / tiles;
      const grout = 3;

      for (let r = 0; r < tiles; r++) {
        for (let c = 0; c < tiles; c++) {
          const tx = c * tileSize + grout;
          const ty = r * tileSize + grout;
          const tw = tileSize - grout * 2;
          const th = tileSize - grout * 2;

          const grad = ctx.createLinearGradient(tx, ty, tx + tw, ty + th);
          grad.addColorStop(0, '#f5f3ef');
          grad.addColorStop(0.5, '#ede9e0');
          grad.addColorStop(1, '#f3f0e8');
          ctx.fillStyle = grad;
          ctx.fillRect(tx, ty, tw, th);

          ctx.strokeStyle = 'rgba(148, 163, 184, 0.22)';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(tx + 20, ty + ((r * 47 + c * 31) % (th - 40)));
          ctx.bezierCurveTo(
            tx + tw * 0.35,
            ty + th * 0.2,
            tx + tw * 0.65,
            ty + th * 0.8,
            tx + tw - 16,
            ty + ((r * 23 + c * 67) % (th - 30))
          );
          ctx.stroke();

          bCtx.fillStyle = '#f2f2f2';
          bCtx.fillRect(tx, ty, tw, th);
        }
      }
    },
    4,
    4
  );

  // 5. Deck de Madera Lapacho Paraguayo (woodDeckPBR)
  const woodDeckTex = makeProceduralTexturePair(
    THREE,
    (ctx, bCtx, s) => {
      ctx.fillStyle = '#27170e';
      ctx.fillRect(0, 0, s, s);
      bCtx.fillStyle = '#202020';
      bCtx.fillRect(0, 0, s, s);

      const planks = 12;
      const pH = s / planks;
      const gap = 4;

      for (let p = 0; p < planks; p++) {
        const py = p * pH + gap / 2;
        const ph = pH - gap;
        const v = ((p * 17) % 24) - 12;
        ctx.fillStyle = `rgb(${132 + v}, ${76 + Math.floor(v * 0.6)}, ${42 + Math.floor(v * 0.4)})`;
        ctx.fillRect(0, py, s, ph);

        for (let g = 0; g < 18; g++) {
          const gy = py + ((g * 19) % ph);
          ctx.fillStyle = g % 2 === 0 ? 'rgba(67, 20, 7, 0.16)' : 'rgba(254, 215, 170, 0.08)';
          ctx.fillRect(0, gy, s, 2);
        }

        const jointX = ((p * 317) % (s - 200)) + 100;
        ctx.fillStyle = '#27170e';
        ctx.fillRect(jointX, py, 3, ph);

        bCtx.fillStyle = '#e0e0e0';
        bCtx.fillRect(0, py, s, ph);
        bCtx.fillStyle = '#202020';
        bCtx.fillRect(jointX, py, 3, ph);
      }
    },
    3,
    3
  );

  // 6. Muro de Piedra Basáltica / Arenisca Ciclópea (stoneWallPBR)
  const stoneWallTex = makeProceduralTexturePair(
    THREE,
    (ctx, bCtx, s) => {
      ctx.fillStyle = '#475569';
      ctx.fillRect(0, 0, s, s);
      bCtx.fillStyle = '#222222';
      bCtx.fillRect(0, 0, s, s);

      const rows = 8;
      const rowH = s / rows;
      for (let r = 0; r < rows; r++) {
        let xCursor = (r % 2) * -60;
        while (xCursor < s) {
          const sw = 140 + ((r * 37 + xCursor) % 90);
          const sh = rowH - 8;
          const sy = r * rowH + 4;
          const shade = 95 + ((r * 19 + xCursor) % 38);
          ctx.fillStyle = `rgb(${shade + 8}, ${shade + 4}, ${shade - 2})`;
          ctx.roundRect(xCursor + 4, sy, sw - 8, sh, 10);
          ctx.fill();

          bCtx.fillStyle = '#dadada';
          bCtx.roundRect(xCursor + 4, sy, sw - 8, sh, 10);
          bCtx.fill();

          xCursor += sw;
        }
      }
    },
    3,
    1.5
  );

  // 7. Granito Negro Brasil Pulido (granitePBR)
  const graniteTex = makeProceduralTexturePair(
    THREE,
    (ctx, bCtx, s) => {
      ctx.fillStyle = '#18181b';
      ctx.fillRect(0, 0, s, s);
      bCtx.fillStyle = '#ececec';
      bCtx.fillRect(0, 0, s, s);

      for (let i = 0; i < 6000; i++) {
        const gx = (i * 89) % s;
        const gy = (i * 61 + Math.floor(i / 16) * 17) % s;
        const c = i % 4 === 0 ? 'rgba(161, 161, 170, 0.28)' : i % 3 === 0 ? 'rgba(63, 63, 70, 0.45)' : 'rgba(24, 24, 27, 0.6)';
        ctx.fillStyle = c;
        ctx.fillRect(gx, gy, 3, 3);
      }
    },
    2,
    2
  );

  // 8. Césped Esmeralda Paraguayo (grassPBR) para el Jardín Posterior y Solárium
  const grassTex = makeProceduralTexturePair(
    THREE,
    (ctx, bCtx, s) => {
      ctx.fillStyle = '#15803d';
      ctx.fillRect(0, 0, s, s);
      bCtx.fillStyle = '#707070';
      bCtx.fillRect(0, 0, s, s);

      for (let i = 0; i < 9000; i++) {
        const gx = (i * 67 + Math.floor(i / 19) * 13) % s;
        const gy = (i * 43 + Math.floor(i / 23) * 29) % s;
        if (i % 3 === 0) {
          ctx.fillStyle = '#16a34a';
          bCtx.fillStyle = '#a0a0a0';
        } else if (i % 3 === 1) {
          ctx.fillStyle = '#166534';
          bCtx.fillStyle = '#555555';
        } else {
          ctx.fillStyle = '#22c55e';
          bCtx.fillStyle = '#b8b8b8';
        }
        ctx.fillRect(gx, gy, 3, 7);
        bCtx.fillRect(gx, gy, 3, 6);
      }
    },
    6,
    6
  );

  // 9. Revestimiento Venecita / Mosaico Turquesa de Piscina (poolTilePBR)
  const poolTileTex = makeProceduralTexturePair(
    THREE,
    (ctx, bCtx, s) => {
      ctx.fillStyle = '#e0f2fe';
      ctx.fillRect(0, 0, s, s);
      bCtx.fillStyle = '#303030';
      bCtx.fillRect(0, 0, s, s);

      const n = 16;
      const cell = s / n;
      for (let r = 0; r < n; r++) {
        for (let c = 0; c < n; c++) {
          const shade = ((r * 7 + c * 11) % 30) - 15;
          ctx.fillStyle = `rgb(${14 + Math.max(0, shade)}, ${155 + shade}, ${215 + Math.min(35, shade)})`;
          ctx.fillRect(c * cell + 2, r * cell + 2, cell - 4, cell - 4);
          bCtx.fillStyle = '#ececec';
          bCtx.fillRect(c * cell + 2, r * cell + 2, cell - 4, cell - 4);
        }
      }
    },
    4,
    4
  );

  return {
    concretePBR: new THREE.MeshStandardMaterial({
      map: concreteTex.map,
      bumpMap: concreteTex.bumpMap,
      bumpScale: 0.015,
      roughness: 0.68,
      metalness: 0.08
    }),
    concreteFoundationPBR: new THREE.MeshStandardMaterial({
      map: concreteTex.map,
      bumpMap: concreteTex.bumpMap,
      bumpScale: 0.02,
      color: 0x7c8594,
      roughness: 0.78,
      metalness: 0.06
    }),
    concreteNewTargetPBR: new THREE.MeshStandardMaterial({
      map: concreteTex.map,
      bumpMap: concreteTex.bumpMap,
      bumpScale: 0.014,
      color: 0xd1fae5,
      roughness: 0.55,
      metalness: 0.1
    }),
    brickPBR: new THREE.MeshStandardMaterial({
      map: brickTex.map,
      bumpMap: brickTex.bumpMap,
      bumpScale: 0.025,
      roughness: 0.85,
      metalness: 0.04
    }),
    plasterRoughPBR: new THREE.MeshStandardMaterial({
      map: plasterTex.map,
      bumpMap: plasterTex.bumpMap,
      bumpScale: 0.012,
      color: 0xd6d3d1,
      roughness: 0.72,
      metalness: 0.04
    }),
    plasterPBR: new THREE.MeshStandardMaterial({
      map: plasterTex.map,
      bumpMap: plasterTex.bumpMap,
      bumpScale: 0.006,
      color: 0xf8f6f0,
      roughness: 0.48,
      metalness: 0.03
    }),
    plasterExteriorPBR: new THREE.MeshStandardMaterial({
      map: plasterTex.map,
      bumpMap: plasterTex.bumpMap,
      bumpScale: 0.009,
      color: 0xe2e8f0,
      roughness: 0.56,
      metalness: 0.04
    }),
    porcelainPBR: new THREE.MeshPhysicalMaterial({
      map: porcelainTex.map,
      bumpMap: porcelainTex.bumpMap,
      bumpScale: 0.004,
      roughness: 0.16,
      metalness: 0.06,
      clearcoat: 0.35,
      clearcoatRoughness: 0.15
    }),
    porcelainSubsueloPBR: new THREE.MeshPhysicalMaterial({
      map: porcelainTex.map,
      bumpMap: porcelainTex.bumpMap,
      bumpScale: 0.005,
      color: 0xe2e8f0,
      roughness: 0.22,
      metalness: 0.05,
      clearcoat: 0.25
    }),
    woodDeckPBR: new THREE.MeshStandardMaterial({
      map: woodDeckTex.map,
      bumpMap: woodDeckTex.bumpMap,
      bumpScale: 0.016,
      roughness: 0.38,
      metalness: 0.06
    }),
    woodDoorPBR: new THREE.MeshStandardMaterial({
      map: woodDeckTex.map,
      bumpMap: woodDeckTex.bumpMap,
      bumpScale: 0.008,
      color: 0xb45309,
      roughness: 0.32,
      metalness: 0.08
    }),
    stoneWallPBR: new THREE.MeshStandardMaterial({
      map: stoneWallTex.map,
      bumpMap: stoneWallTex.bumpMap,
      bumpScale: 0.035,
      roughness: 0.78,
      metalness: 0.08
    }),
    granitePBR: new THREE.MeshPhysicalMaterial({
      map: graniteTex.map,
      bumpMap: graniteTex.bumpMap,
      bumpScale: 0.004,
      roughness: 0.12,
      metalness: 0.15,
      clearcoat: 0.55,
      clearcoatRoughness: 0.1
    }),
    grassPBR: new THREE.MeshStandardMaterial({
      map: grassTex.map,
      bumpMap: grassTex.bumpMap,
      bumpScale: 0.025,
      roughness: 0.88,
      metalness: 0.02
    }),
    poolTilePBR: new THREE.MeshPhysicalMaterial({
      map: poolTileTex.map,
      bumpMap: poolTileTex.bumpMap,
      bumpScale: 0.005,
      roughness: 0.14,
      metalness: 0.05,
      clearcoat: 0.6
    }),
    poolWaterMat: new THREE.MeshPhysicalMaterial({
      color: 0x06b6d4,
      roughness: 0.05,
      metalness: 0.08,
      transmission: 0.78,
      transparent: true,
      opacity: 0.72,
      ior: 1.333,
      clearcoat: 1.0,
      clearcoatRoughness: 0.04
    }),
    ceramicSanitaryMat: new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      roughness: 0.07,
      metalness: 0.04,
      clearcoat: 0.85,
      clearcoatRoughness: 0.06
    }),
    chromeMat: new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      metalness: 0.95,
      roughness: 0.08
    }),
    stainlessMat: new THREE.MeshStandardMaterial({
      color: 0xdbeafe,
      metalness: 0.86,
      roughness: 0.22
    }),
    blackMetalMat: new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.78,
      roughness: 0.28
    }),
    glassBlindexMat: new THREE.MeshPhysicalMaterial({
      color: 0xe0f2fe,
      roughness: 0.06,
      metalness: 0.05,
      transmission: 0.72,
      transparent: true,
      opacity: 0.48,
      ior: 1.52
    }),
    mirrorMat: new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      metalness: 0.98,
      roughness: 0.03
    }),
    linenSofaMat: new THREE.MeshStandardMaterial({
      color: 0xd6d3d1,
      roughness: 0.85,
      metalness: 0.02
    }),
    bedSheetMat: new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.75,
      metalness: 0.02
    }),
    bedDuvetMat: new THREE.MeshStandardMaterial({
      color: 0x475569,
      roughness: 0.78,
      metalness: 0.04
    }),
    ledWarmMat: new THREE.MeshStandardMaterial({
      color: 0xffedd5,
      emissive: 0xfbbf24,
      emissiveIntensity: 1.4,
      roughness: 0.2
    }),
    ledPoolCyanMat: new THREE.MeshStandardMaterial({
      color: 0x67e8f9,
      emissive: 0x06b6d4,
      emissiveIntensity: 1.8,
      roughness: 0.1
    })
  };
}

/**
 * Helper para asignar userData recursivamente a todos los hijos de un grupo 3D
 */
function tagGroupUserData(group, userData) {
  group.userData = userData;
  group.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
      if (!child.userData || !child.userData.name) {
        child.userData = userData;
      }
    }
  });
}

/**
 * Construye una Ventana / Puerta-Ventana Corrediza Blindex con Carpintería Perimetral de Aluminio Negro y Hojas Divididas
 */
function createBlindexWindow3D(THREE, mats, x, centerY, z, width, height, rotY = 0, name = 'Ventanal Corredizo Blindex Templado 10mm', desc = 'Carpintería de aluminio anodizado negro con hojas corredizas de cristal templado Blindex 10mm.') {
  const g = new THREE.Group();
  g.position.set(x, centerY, z);
  g.rotation.y = rotY;

  const frameThick = 0.045;
  const frameDepth = 0.09;

  // Marco perimetral de aluminio negro
  const topFrame = new THREE.Mesh(new THREE.BoxGeometry(width, frameThick, frameDepth), mats.blackMetalMat);
  topFrame.position.set(0, height / 2 - frameThick / 2, 0);
  g.add(topFrame);

  const botFrame = new THREE.Mesh(new THREE.BoxGeometry(width, frameThick, frameDepth), mats.blackMetalMat);
  botFrame.position.set(0, -height / 2 + frameThick / 2, 0);
  g.add(botFrame);

  const leftFrame = new THREE.Mesh(new THREE.BoxGeometry(frameThick, height, frameDepth), mats.blackMetalMat);
  leftFrame.position.set(-width / 2 + frameThick / 2, 0, 0);
  g.add(leftFrame);

  const rightFrame = new THREE.Mesh(new THREE.BoxGeometry(frameThick, height, frameDepth), mats.blackMetalMat);
  rightFrame.position.set(width / 2 - frameThick / 2, 0, 0);
  g.add(rightFrame);

  // Parantes divisorios de hojas corredizas (2 o 4 hojas según ancho)
  const numLeaves = width > 3.2 ? 4 : 2;
  for (let i = 1; i < numLeaves; i++) {
    const mx = -width / 2 + (width / numLeaves) * i;
    const mullion = new THREE.Mesh(new THREE.BoxGeometry(0.032, height - frameThick * 2, frameDepth * 0.85), mats.blackMetalMat);
    mullion.position.set(mx, 0, 0);
    g.add(mullion);
  }

  // Paños de cristal templado Blindex
  const glass = new THREE.Mesh(
    new THREE.BoxGeometry(width - frameThick * 2, height - frameThick * 2, 0.018),
    mats.glassBlindexMat
  );
  g.add(glass);

  tagGroupUserData(g, {
    type: 'abertura_blindex',
    name,
    dimensions: `${width.toFixed(2)}m × ${height.toFixed(2)}m (${numLeaves} Hojas Corredizas Blindex 10mm)`,
    costo: 'Incluido en Carpintería de Aluminio y Vidrios Templados',
    status: 'Abertura Blindex en Habitación ✨',
    desc
  });

  return g;
}

/**
 * Construye Rejas / Barandas de Seguridad de Balcones en Herrería de Perfiles Tubulares Negros + Cristal Templado
 * (`createBalconyGrille3D`)
 */
function createBalconyGrille3D(THREE, mats, x1, z1, x2, z2, baseY, height = 1.05, name = 'Reja y Baranda de Seguridad en Balcón') {
  const g = new THREE.Group();
  const dx = x2 - x1;
  const dz = z2 - z1;
  const len = Math.hypot(dx, dz);
  if (len < 0.1) return g;

  g.position.set((x1 + x2) / 2, baseY, (z1 + z2) / 2);
  g.rotation.y = -Math.atan2(dz, dx);

  // Pasamanos superior tubular rectangular negro (60×40mm) y solera inferior
  const topRail = new THREE.Mesh(new THREE.BoxGeometry(len, 0.045, 0.065), mats.blackMetalMat);
  topRail.position.set(0, height, 0);
  g.add(topRail);

  const bottomRail = new THREE.Mesh(new THREE.BoxGeometry(len, 0.035, 0.05), mats.blackMetalMat);
  bottomRail.position.set(0, 0.06, 0);
  g.add(bottomRail);

  // 4 Traviesas horizontales de seguridad + Parantes verticales cada 1.15m y barrotes cada 0.14m
  [0.26, 0.48, 0.70, 0.88].forEach((hy) => {
    const hBar = new THREE.Mesh(new THREE.BoxGeometry(len, 0.018, 0.025), mats.blackMetalMat);
    hBar.position.set(0, hy, 0);
    g.add(hBar);
  });

  const numPosts = Math.max(2, Math.round(len / 1.15) + 1);
  for (let i = 0; i < numPosts; i++) {
    const px = -len / 2 + (len / (numPosts - 1)) * i;
    const post = new THREE.Mesh(new THREE.BoxGeometry(0.045, height + 0.04, 0.045), mats.blackMetalMat);
    post.position.set(px, height / 2, 0);
    g.add(post);
  }

  // Barrotes verticales de protección anticaída cada 0.22m
  const numPickets = Math.floor(len / 0.22);
  for (let k = 1; k < numPickets; k++) {
    const bx = -len / 2 + k * 0.22;
    const picket = new THREE.Mesh(new THREE.CylinderGeometry(0.007, 0.007, height - 0.08, 8), mats.blackMetalMat);
    picket.position.set(bx, height / 2 + 0.02, 0);
    g.add(picket);
  }

  // Paño interior de vidrio laminado/templado de seguridad
  const safetyGlass = new THREE.Mesh(
    new THREE.BoxGeometry(len - 0.08, height - 0.12, 0.012),
    mats.glassBlindexMat
  );
  safetyGlass.position.set(0, height / 2 + 0.02, -0.02);
  g.add(safetyGlass);

  tagGroupUserData(g, {
    type: 'reja_balcon',
    name,
    dimensions: `Largo ${len.toFixed(2)}m × Altura ${height.toFixed(2)}m • Perfiles Tubulares + Barrotes Seguridad`,
    costo: 'Gs. 680.000 / ml (Herrería de Seguridad con Pintura Epoxi Negra)',
    status: 'Protección y Seguridad en Balcón Instalada ✨',
    desc: 'Reja y baranda de seguridad en herrería tubular de acero con barrotes anticaída y paño de vidrio templado para protección total en balcones de Planta Alta y Galería.'
  });

  return g;
}

/**
 * SUV CHERY TIGGO 2 PRO 2026 DE RUTH Y LEO EN EL ESTACIONAMIENTO A NIVEL DE CALLE (Y = 0.00m)
 */
function createCheryTiggo2Pro2026_3D(THREE, mats, x, y, z, rotY = 0) {
  const carGroup = new THREE.Group();
  carGroup.position.set(x, y, z);
  carGroup.rotation.y = rotY;

  const bodyPaintMat = new THREE.MeshStandardMaterial({
    color: 0x2563eb, // Azul Titanio Metalizado Chery Tiggo 2 Pro 2026
    roughness: 0.18,
    metalness: 0.72
  });
  const claddingMat = new THREE.MeshStandardMaterial({
    color: 0x18181b,
    roughness: 0.65,
    metalness: 0.15
  });
  const glassTintMat = new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    roughness: 0.08,
    metalness: 0.85,
    transparent: true,
    opacity: 0.84
  });
  const ledDrlMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0xe0f2fe,
    emissiveIntensity: 0.95,
    roughness: 0.15
  });
  const tailLedMat = new THREE.MeshStandardMaterial({
    color: 0xef4444,
    emissive: 0xdc2626,
    emissiveIntensity: 0.85,
    roughness: 0.2
  });
  const tireMat = new THREE.MeshStandardMaterial({
    color: 0x111827,
    roughness: 0.85,
    metalness: 0.1
  });

  // 1. Zócalo crossover negro inferior + Skid plates delantero y trasero
  const lowerSkirt = new THREE.Mesh(new THREE.BoxGeometry(1.74, 0.22, 4.16), claddingMat);
  lowerSkirt.position.set(0, 0.31, 0);
  lowerSkirt.castShadow = true;
  carGroup.add(lowerSkirt);

  const frontSkid = new THREE.Mesh(new THREE.BoxGeometry(1.18, 0.12, 0.10), mats.stainlessMat);
  frontSkid.position.set(0, 0.26, 2.06);
  carGroup.add(frontSkid);

  const rearSkid = new THREE.Mesh(new THREE.BoxGeometry(1.22, 0.14, 0.10), mats.stainlessMat);
  rearSkid.position.set(0, 0.27, -2.06);
  carGroup.add(rearSkid);

  // 2. Cuerpo principal de la carrocería SUV (Largo 4.20m × Ancho 1.76m × Alto 1.57m)
  const mainBody = new THREE.Mesh(new THREE.BoxGeometry(1.76, 0.54, 4.12), bodyPaintMat);
  mainBody.position.set(0, 0.68, 0);
  mainBody.castShadow = true;
  mainBody.receiveShadow = true;
  carGroup.add(mainBody);

  const hood = new THREE.Mesh(new THREE.BoxGeometry(1.68, 0.12, 1.18), bodyPaintMat);
  hood.position.set(0, 0.96, 1.42);
  hood.rotation.x = 0.06;
  carGroup.add(hood);

  // 3. Habitáculo vidriado + Techo con Barras Longitudinales (Roof Rails) y antena Shark-Fin
  const cabinCore = new THREE.Mesh(new THREE.BoxGeometry(1.52, 0.50, 2.35), glassTintMat);
  cabinCore.position.set(0, 1.18, -0.25);
  carGroup.add(cabinCore);

  const roofPanel = new THREE.Mesh(new THREE.BoxGeometry(1.48, 0.06, 2.15), bodyPaintMat);
  roofPanel.position.set(0, 1.45, -0.28);
  carGroup.add(roofPanel);

  [-0.62, 0.62].forEach((rx) => {
    const roofRail = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.05, 1.75), mats.stainlessMat);
    roofRail.position.set(rx, 1.50, -0.30);
    carGroup.add(roofRail);
  });

  const sharkFin = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.10, 0.16), bodyPaintMat);
  sharkFin.position.set(0, 1.52, -1.15);
  carGroup.add(sharkFin);

  const rearSpoiler = new THREE.Mesh(new THREE.BoxGeometry(1.46, 0.06, 0.24), claddingMat);
  rearSpoiler.position.set(0, 1.44, -1.42);
  carGroup.add(rearSpoiler);

  // 4. Parrilla Frontal Hexagonal "Galaxy" Diamantada de Chery Tiggo 2 Pro 2026 + Faros DRL LED rasgados
  const grilleFrame = new THREE.Mesh(new THREE.BoxGeometry(1.12, 0.34, 0.05), claddingMat);
  grilleFrame.position.set(0, 0.72, 2.06);
  carGroup.add(grilleFrame);

  for (let gx = -0.44; gx <= 0.441; gx += 0.11) {
    for (let gy = 0.62; gy <= 0.821; gy += 0.07) {
      const diamondDot = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.02, 0.02), mats.chromeMat);
      diamondDot.position.set(gx, gy, 2.085);
      carGroup.add(diamondDot);
    }
  }
  const cheryLogoRing = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.025, 18), mats.chromeMat);
  cheryLogoRing.rotation.x = Math.PI / 2;
  cheryLogoRing.position.set(0, 0.76, 2.09);
  carGroup.add(cheryLogoRing);

  [-0.68, 0.68].forEach((hx) => {
    const drlStrip = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.055, 0.08), ledDrlMat);
    drlStrip.position.set(hx, 0.92, 2.04);
    drlStrip.rotation.z = hx > 0 ? -0.10 : 0.10;
    carGroup.add(drlStrip);

    const lowBeamHousing = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.16, 0.06), claddingMat);
    lowBeamHousing.position.set(hx, 0.66, 2.05);
    carGroup.add(lowBeamHousing);

    const projectorLens = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.03, 14), ledDrlMat);
    projectorLens.rotation.x = Math.PI / 2;
    projectorLens.position.set(hx, 0.66, 2.075);
    carGroup.add(projectorLens);
  });

  // 5. Barra LED Trasera Continua + Espejos retrovisores
  const rearLightBar = new THREE.Mesh(new THREE.BoxGeometry(1.56, 0.08, 0.05), tailLedMat);
  rearLightBar.position.set(0, 0.92, -2.06);
  carGroup.add(rearLightBar);

  [-0.94, 0.94].forEach((mx) => {
    const mirrorHousing = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.11, 0.14), bodyPaintMat);
    mirrorHousing.position.set(mx, 0.98, 0.62);
    carGroup.add(mirrorHousing);
  });

  // 6. 4 Ruedas SUV con Llantas Deportivas Bitono Aro 17"
  [
    [-0.84, 0.33, 1.28],
    [0.84, 0.33, 1.28],
    [-0.84, 0.33, -1.28],
    [0.84, 0.33, -1.28]
  ].forEach(([wx, wy, wz]) => {
    const wheel = new THREE.Group();
    wheel.position.set(wx, wy, wz);

    const tire = new THREE.Mesh(new THREE.CylinderGeometry(0.33, 0.33, 0.22, 24), tireMat);
    tire.rotation.z = Math.PI / 2;
    wheel.add(tire);

    const alloyRim = new THREE.Mesh(new THREE.CylinderGeometry(0.21, 0.21, 0.23, 18), mats.chromeMat);
    alloyRim.rotation.z = Math.PI / 2;
    wheel.add(alloyRim);

    const hubCap = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.24, 12), claddingMat);
    hubCap.rotation.z = Math.PI / 2;
    wheel.add(hubCap);

    carGroup.add(wheel);
  });

  tagGroupUserData(carGroup, {
    type: 'vehiculo_propietario',
    name: 'SUV Chery Tiggo 2 Pro 2026 de Ruth y Leo (Estacionada a Nivel de Calle)',
    dimensions: '4.20m × 1.76m × 1.57m • SUV Crossover en Cochera Nivel Calle (+100.00m)',
    costo: 'Vehículo Propio de Ruth y Leo (Gs. 0 en Obra)',
    status: 'Estacionada en Cochera Frontal (Delante del Muro de Contención z=+1.50m) 🚙✨',
    desc: 'SUV Chery Tiggo 2 Pro modelo 2026 con parrilla frontal diamantada Galaxy, faros DRL LED superiores, barra trasera LED continua y llantas deportivas bitono, estacionada cómodamente sobre la explanada a nivel de calle.'
  });

  return carGroup;
}

/**
 * FLOREROS / MACETAS CHICAS CON PLANTAS "ESPADA DE SAN JORGE" (`Sansevieria trifasciata`)
 */
export function createSansevieriaPot3D(THREE, mats, x, y, z, scale = 1.0, locationLabel = 'Sala') {
  const potGroup = new THREE.Group();
  potGroup.position.set(x, y, z);
  potGroup.scale.setScalar(scale);

  const potMesh = new THREE.Mesh(
    new THREE.CylinderGeometry(0.105, 0.082, 0.18, 18),
    mats.ceramicSanitaryMat
  );
  potMesh.position.set(0, 0.09, 0);
  potMesh.castShadow = true;
  potGroup.add(potMesh);

  const soilMesh = new THREE.Mesh(
    new THREE.CylinderGeometry(0.098, 0.098, 0.02, 16),
    new THREE.MeshStandardMaterial({ color: 0x292524, roughness: 0.9 })
  );
  soilMesh.position.set(0, 0.175, 0);
  potGroup.add(soilMesh);

  const leafGreenMat = new THREE.MeshStandardMaterial({
    color: 0x14532d,
    roughness: 0.42,
    metalness: 0.05
  });
  const leafYellowEdgeMat = new THREE.MeshStandardMaterial({
    color: 0xfacc15,
    roughness: 0.45,
    metalness: 0.05
  });

  const blades = [
    { ox: 0.00, oz: 0.00, h: 0.42, w: 0.048, rotY: 0.1, tiltX: 0.03, tiltZ: -0.02 },
    { ox: -0.035, oz: 0.02, h: 0.36, w: 0.044, rotY: 0.8, tiltX: -0.06, tiltZ: 0.05 },
    { ox: 0.038, oz: -0.015, h: 0.38, w: 0.045, rotY: -0.6, tiltX: 0.05, tiltZ: -0.06 },
    { ox: -0.02, oz: -0.038, h: 0.31, w: 0.040, rotY: 1.5, tiltX: -0.08, tiltZ: -0.04 },
    { ox: 0.025, oz: 0.035, h: 0.34, w: 0.042, rotY: -1.3, tiltX: 0.07, tiltZ: 0.06 },
    { ox: -0.048, oz: -0.01, h: 0.27, w: 0.036, rotY: 2.2, tiltX: -0.09, tiltZ: 0.08 },
    { ox: 0.045, oz: 0.018, h: 0.29, w: 0.038, rotY: -2.0, tiltX: 0.08, tiltZ: -0.07 }
  ];

  blades.forEach((b) => {
    const bladeHolder = new THREE.Group();
    bladeHolder.position.set(b.ox, 0.17, b.oz);
    bladeHolder.rotation.set(b.tiltX, b.rotY, b.tiltZ);

    const yellowOuter = new THREE.Mesh(new THREE.BoxGeometry(b.w, b.h, 0.008), leafYellowEdgeMat);
    yellowOuter.position.set(0, b.h / 2, 0);
    bladeHolder.add(yellowOuter);

    const greenCore = new THREE.Mesh(new THREE.BoxGeometry(b.w * 0.72, b.h * 0.98, 0.010), leafGreenMat);
    greenCore.position.set(0, b.h / 2, 0);
    bladeHolder.add(greenCore);

    const tip = new THREE.Mesh(new THREE.ConeGeometry(b.w * 0.48, 0.065, 4), leafGreenMat);
    tip.position.set(0, b.h + 0.03, 0);
    tip.rotation.y = Math.PI / 4;
    bladeHolder.add(tip);

    potGroup.add(bladeHolder);
  });

  tagGroupUserData(potGroup, {
    type: 'planta_decorativa',
    name: `Florero / Maceta Chica con Planta "Espada de San Jorge" (${locationLabel})`,
    dimensions: 'Maceta Cerámica Ø20cm + Hojas Verticales Sansevieria (Altura total ~55cm)',
    costo: 'Gs. 0 (Plantas y Macetas de Ruth y Leo)',
    status: 'Purificadora Natural de Aire y Decoración Viva 🌿✨',
    desc: 'Maceta cerámica chica con planta Espada de San Jorge (Sansevieria trifasciata de hojas verticales verdes con bordes amarillos), resistente, purificadora de aire e ideal para el interior y galería de Ruth y Leo.'
  });

  return potGroup;
}

/**
 * MASCOTA 1: EMMA (CANICHE / POODLE DE RUTH Y LEO)
 */
export function createEmmaPoodle3D(THREE, mats, x, y, z, rotY = 0) {
  const emmaGroup = new THREE.Group();
  emmaGroup.position.set(x, y, z);
  emmaGroup.rotation.y = rotY;

  const curlyWhiteMat = new THREE.MeshStandardMaterial({
    color: 0xfefce8,
    roughness: 0.88,
    metalness: 0.02
  });
  const collarPinkMat = new THREE.MeshStandardMaterial({
    color: 0xf43f5e,
    roughness: 0.4,
    metalness: 0.2
  });
  const eyeNoseMat = new THREE.MeshStandardMaterial({
    color: 0x09090b,
    roughness: 0.15,
    metalness: 0.3
  });

  const torsoMain = new THREE.Mesh(new THREE.SphereGeometry(0.115, 16, 14), curlyWhiteMat);
  torsoMain.scale.set(0.95, 0.92, 1.45);
  torsoMain.position.set(0, 0.22, 0);
  emmaGroup.add(torsoMain);

  const chestPuff = new THREE.Mesh(new THREE.SphereGeometry(0.105, 16, 14), curlyWhiteMat);
  chestPuff.position.set(0, 0.24, 0.11);
  emmaGroup.add(chestPuff);

  [
    [-0.065, 0.11],
    [0.065, 0.11],
    [-0.065, -0.11],
    [0.065, -0.11]
  ].forEach(([lx, lz]) => {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.026, 0.022, 0.18, 12), curlyWhiteMat);
    leg.position.set(lx, 0.09, lz);
    emmaGroup.add(leg);

    const pawPuff = new THREE.Mesh(new THREE.SphereGeometry(0.034, 12, 10), curlyWhiteMat);
    pawPuff.position.set(lx, 0.035, lz + 0.01);
    emmaGroup.add(pawPuff);
  });

  const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.068, 0.072, 0.024, 16), collarPinkMat);
  collar.position.set(0, 0.31, 0.14);
  collar.rotation.x = 0.35;
  emmaGroup.add(collar);

  const goldTag = new THREE.Mesh(
    new THREE.SphereGeometry(0.016, 10, 10),
    new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.2, metalness: 0.85 })
  );
  goldTag.position.set(0, 0.29, 0.21);
  emmaGroup.add(goldTag);

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.092, 16, 14), curlyWhiteMat);
  head.position.set(0, 0.38, 0.17);
  emmaGroup.add(head);

  const topKnot = new THREE.Mesh(new THREE.SphereGeometry(0.068, 14, 12), curlyWhiteMat);
  topKnot.position.set(0, 0.45, 0.16);
  emmaGroup.add(topKnot);

  const snout = new THREE.Mesh(new THREE.SphereGeometry(0.048, 12, 10), curlyWhiteMat);
  snout.scale.set(0.9, 0.8, 1.25);
  snout.position.set(0, 0.36, 0.25);
  emmaGroup.add(snout);

  const nose = new THREE.Mesh(new THREE.SphereGeometry(0.016, 10, 10), eyeNoseMat);
  nose.position.set(0, 0.375, 0.305);
  emmaGroup.add(nose);

  [-0.034, 0.034].forEach((ex) => {
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.013, 10, 10), eyeNoseMat);
    eye.position.set(ex, 0.40, 0.248);
    emmaGroup.add(eye);
  });

  [-0.088, 0.088].forEach((earX) => {
    const ear = new THREE.Mesh(new THREE.SphereGeometry(0.048, 12, 10), curlyWhiteMat);
    ear.scale.set(0.55, 1.55, 0.85);
    ear.position.set(earX, 0.35, 0.16);
    ear.rotation.z = earX > 0 ? -0.18 : 0.18;
    emmaGroup.add(ear);
  });

  const tailStem = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.018, 0.09, 10), curlyWhiteMat);
  tailStem.position.set(0, 0.30, -0.16);
  tailStem.rotation.x = -0.45;
  emmaGroup.add(tailStem);

  const tailPom = new THREE.Mesh(new THREE.SphereGeometry(0.046, 12, 12), curlyWhiteMat);
  tailPom.position.set(0, 0.35, -0.19);
  emmaGroup.add(tailPom);

  tagGroupUserData(emmaGroup, {
    type: 'mascota_familia',
    name: 'Emma — Caniche (Poodle) de Ruth y Leo 🐩💛',
    dimensions: 'Altura 46cm × Largo 48cm • En la Gran Sala Social',
    costo: 'Incalculable ❤️ (Miembro de la Familia Ruth y Leo)',
    status: 'Explorando su Nueva Casa en Itá Pytã Punta (Protegida por Alarma Pet-Immune) 🐾✨',
    desc: 'Emma, la caniche de Ruth y Leo, con su pelaje blanco/crema enrulado, pompón y collarcito coral, disfrutando de la amplitud de la Gran Sala Social.'
  });

  return emmaGroup;
}

/**
 * MASCOTA 2: SERAFINA (GATA CALICÓ TRICOLOR DE RUTH Y LEO)
 */
export function createSerafinaCalicoCat3D(THREE, mats, x, y, z, rotY = 0) {
  const catGroup = new THREE.Group();
  catGroup.position.set(x, y, z);
  catGroup.rotation.y = rotY;

  const whiteFurMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.75,
    metalness: 0.02
  });
  const gingerPatchMat = new THREE.MeshStandardMaterial({
    color: 0xea580c,
    roughness: 0.75,
    metalness: 0.02
  });
  const blackPatchMat = new THREE.MeshStandardMaterial({
    color: 0x18181b,
    roughness: 0.75,
    metalness: 0.02
  });
  const greenEyeMat = new THREE.MeshStandardMaterial({
    color: 0x22c55e,
    emissive: 0x15803d,
    emissiveIntensity: 0.35,
    roughness: 0.15
  });

  const body = new THREE.Mesh(new THREE.SphereGeometry(0.095, 16, 14), whiteFurMat);
  body.scale.set(0.85, 0.82, 1.55);
  body.position.set(0, 0.16, 0);
  catGroup.add(body);

  const patchGingerBack = new THREE.Mesh(new THREE.SphereGeometry(0.068, 12, 10), gingerPatchMat);
  patchGingerBack.scale.set(1.05, 0.75, 1.15);
  patchGingerBack.position.set(0.025, 0.195, 0.03);
  catGroup.add(patchGingerBack);

  const patchBlackRear = new THREE.Mesh(new THREE.SphereGeometry(0.064, 12, 10), blackPatchMat);
  patchBlackRear.scale.set(1.02, 0.78, 1.10);
  patchBlackRear.position.set(-0.022, 0.19, -0.065);
  catGroup.add(patchBlackRear);

  [
    [-0.048, 0.095],
    [0.048, 0.095],
    [-0.048, -0.095],
    [0.048, -0.095]
  ].forEach(([lx, lz]) => {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.015, 0.14, 10), whiteFurMat);
    leg.position.set(lx, 0.07, lz);
    catGroup.add(leg);
  });

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.072, 16, 14), whiteFurMat);
  head.position.set(0, 0.27, 0.15);
  catGroup.add(head);

  const headGingerSpot = new THREE.Mesh(new THREE.SphereGeometry(0.045, 12, 10), gingerPatchMat);
  headGingerSpot.position.set(-0.025, 0.30, 0.155);
  catGroup.add(headGingerSpot);

  const headBlackSpot = new THREE.Mesh(new THREE.SphereGeometry(0.042, 12, 10), blackPatchMat);
  headBlackSpot.position.set(0.028, 0.295, 0.145);
  catGroup.add(headBlackSpot);

  const leftEar = new THREE.Mesh(new THREE.ConeGeometry(0.028, 0.06, 4), gingerPatchMat);
  leftEar.position.set(-0.045, 0.345, 0.145);
  leftEar.rotation.z = 0.22;
  catGroup.add(leftEar);

  const rightEar = new THREE.Mesh(new THREE.ConeGeometry(0.028, 0.06, 4), blackPatchMat);
  rightEar.position.set(0.045, 0.345, 0.145);
  rightEar.rotation.z = -0.22;
  catGroup.add(rightEar);

  [-0.026, 0.026].forEach((ex) => {
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.011, 10, 10), greenEyeMat);
    eye.position.set(ex, 0.28, 0.212);
    catGroup.add(eye);
  });

  const pinkNose = new THREE.Mesh(
    new THREE.SphereGeometry(0.009, 8, 8),
    new THREE.MeshStandardMaterial({ color: 0xfb7185, roughness: 0.4 })
  );
  pinkNose.position.set(0, 0.262, 0.222);
  catGroup.add(pinkNose);

  const tailBase = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.016, 0.14, 10), blackPatchMat);
  tailBase.position.set(0, 0.24, -0.15);
  tailBase.rotation.x = -0.35;
  catGroup.add(tailBase);

  const tailTip = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.014, 0.10, 10), gingerPatchMat);
  tailTip.position.set(0, 0.34, -0.185);
  tailTip.rotation.x = -0.15;
  catGroup.add(tailTip);

  tagGroupUserData(catGroup, {
    type: 'mascota_familia',
    name: 'Serafina — Gata Calicó Tricolor de Ruth y Leo 🐈🧡🖤',
    dimensions: 'Altura 35cm × Largo 42cm • Junto al Sofá y la Biblioteca',
    costo: 'Incalculable ❤️ (Miembro de la Familia Ruth y Leo)',
    status: 'Dueña Oficial del Sofá y de la Biblioteca (Protegida por Alarma Pet-Immune) 🐱✨',
    desc: 'Serafina, la gata calicó tricolor (blanca con manchas naranjas y negras) de Ruth y Leo, vigilando la sala junto a la biblioteca de 4 estantes y el sofá.'
  });

  return catGroup;
}

/**
 * BIBLIOTECA INSTALADA CON AL MENOS 4 ESTANTES DE 2,00 METROS CADA UNO (8,00+ METROS LINEALES DE ESTANTES)
 */
export function createLibrary4Shelves2m3D(THREE, mats, x, y, z, rotY = 0, locationLabel = 'Gran Sala Social') {
  const libGroup = new THREE.Group();
  libGroup.position.set(x, y, z);
  libGroup.rotation.y = rotY;

  const shelfLen = 2.00;
  const shelfDepth = 0.34;
  const totalHeight = 2.10;

  [-0.96, 0.00, 0.96].forEach((px) => {
    [-0.14, 0.14].forEach((pz) => {
      const upright = new THREE.Mesh(
        new THREE.BoxGeometry(0.035, totalHeight, 0.035),
        mats.blackMetalMat
      );
      upright.position.set(px, totalHeight / 2, pz);
      upright.castShadow = true;
      libGroup.add(upright);
    });
  });

  const shelfHeights = [0.18, 0.64, 1.10, 1.56, 2.02];
  const bookPalette = [
    0x991b1b, 0x1e40af, 0x065f46, 0xd97706, 0x4c1d95, 0x0f766e, 0xbe123c, 0x334155, 0xb45309
  ];

  shelfHeights.forEach((sy, sIdx) => {
    const plank = new THREE.Mesh(
      new THREE.BoxGeometry(shelfLen, 0.038, shelfDepth),
      mats.woodDeckPBR
    );
    plank.position.set(0, sy, 0);
    plank.castShadow = true;
    plank.receiveShadow = true;
    libGroup.add(plank);

    if (sIdx < 4) {
      let curX = -0.88;
      let bookIndex = sIdx * 7;
      while (curX < 0.82) {
        if (Math.abs(curX) < 0.06) {
          curX += 0.12;
          continue;
        }
        const bThick = 0.032 + ((bookIndex * 13) % 5) * 0.007;
        const bHeight = 0.22 + ((bookIndex * 17) % 6) * 0.022;
        const bDepth = 0.20 + ((bookIndex * 7) % 3) * 0.02;
        const bColor = bookPalette[bookIndex % bookPalette.length];

        const bookMesh = new THREE.Mesh(
          new THREE.BoxGeometry(bThick, bHeight, bDepth),
          new THREE.MeshStandardMaterial({ color: bColor, roughness: 0.55, metalness: 0.05 })
        );
        bookMesh.position.set(curX + bThick / 2, sy + 0.019 + bHeight / 2, -0.02);
        libGroup.add(bookMesh);

        curX += bThick + 0.004;
        bookIndex++;
        if (bookIndex % 9 === 0) curX += 0.14;
      }
    }
  });

  tagGroupUserData(libGroup, {
    type: 'mobiliario_propio',
    name: `Biblioteca Instalada de 4 Estantes de 2,00m cada uno (${locationLabel})`,
    dimensions: 'Ancho 2.00m × Alto 2.10m × Prof. 0.34m • 4 Estantes Principales de 2,00m c/u (8,00+ metros lineales)',
    costo: 'Incluida en Equipamiento de Sala y Estudio 📚',
    status: 'Biblioteca de 4 Estantes × 2,00m Instalada con Colección de Libros ✨',
    desc: 'Biblioteca estructural de madera maciza y parantes de hierro negro con 4 amplios estantes de 2,00 metros de largo cada uno (más base inferior), ofreciendo más de 8,00 metros lineales para toda la biblioteca de Ruth y Leo.'
  });

  return libGroup;
}

/**
 * SISTEMA COMPLETO DE ALARMA PET-IMMUNE (PARA EMMA Y SERAFINA) EN 3D
 */
export function createPetImmuneAlarmSystem3D(THREE, mats) {
  const alarmGroup = new THREE.Group();

  const ledArmedGreen = new THREE.MeshStandardMaterial({
    color: 0x22c55e,
    emissive: 0x16a34a,
    emissiveIntensity: 0.9
  });
  const sirenStrobeRed = new THREE.MeshStandardMaterial({
    color: 0xef4444,
    emissive: 0xdc2626,
    emissiveIntensity: 0.9
  });

  // 1. Central de Alarma + Teclado Digital LCD junto a la Puerta Principal (x = +0.18m, y = 1.42m, z = 3.12m)
  const keypadHousing = new THREE.Mesh(
    new THREE.BoxGeometry(0.18, 0.14, 0.035),
    mats.ceramicSanitaryMat
  );
  keypadHousing.position.set(0.18, 1.42, 3.12);
  alarmGroup.add(keypadHousing);

  const lcdScreen = new THREE.Mesh(
    new THREE.BoxGeometry(0.12, 0.045, 0.01),
    ledArmedGreen
  );
  lcdScreen.position.set(0.18, 1.45, 3.14);
  alarmGroup.add(lcdScreen);

  // 2. Sirenas Exteriores Estroboscópicas con Flash LED (en Fachada Eje G y junto a la Sobreelevación Lateral 3.00m × 2.00m)
  [
    { x: 0.35, y: 2.52, z: 2.88 },
    { x: -4.72, y: 2.85, z: -1.50 }
  ].forEach((sp) => {
    const sirenBox = new THREE.Mesh(
      new THREE.BoxGeometry(0.20, 0.28, 0.09),
      mats.ceramicSanitaryMat
    );
    sirenBox.position.set(sp.x, sp.y, sp.z);
    alarmGroup.add(sirenBox);

    const strobeLens = new THREE.Mesh(
      new THREE.BoxGeometry(0.16, 0.07, 0.025),
      sirenStrobeRed
    );
    strobeLens.position.set(sp.x, sp.y - 0.08, sp.z - 0.04);
    alarmGroup.add(strobeLens);
  });

  // 3. Sensores PIR Pet-Immune (Inmunes a Mascotas hasta 25kg para que Emma y Serafina caminen libres sin falsas alarmas)
  [
    { x: -4.74, y: 2.35, z: -1.20 }, // Vigilando Cochera y Sobreelevación Lateral 3x2m
    { x: 3.68, y: 2.45, z: 3.18 },   // Vigilando Acceso y Gran Sala Social
    { x: -4.74, y: 2.45, z: 9.65 },  // Vigilando Ventanales Blindex hacia Galería
    { x: 4.72, y: 2.05, z: 10.25 }   // Vigilando Galería Panorámica L1
  ].forEach((pir) => {
    const sensorBody = new THREE.Mesh(
      new THREE.BoxGeometry(0.07, 0.11, 0.06),
      mats.ceramicSanitaryMat
    );
    sensorBody.position.set(pir.x, pir.y, pir.z);
    alarmGroup.add(sensorBody);

    const pirLed = new THREE.Mesh(
      new THREE.SphereGeometry(0.012, 8, 8),
      ledArmedGreen
    );
    pirLed.position.set(pir.x, pir.y + 0.03, pir.z);
    alarmGroup.add(pirLed);
  });

  tagGroupUserData(alarmGroup, {
    type: 'seguridad_alarma',
    name: 'Sistema Completo de Alarma Pet-Immune (Inmune a Emma y Serafina) + Barrera Perimetral',
    dimensions: 'Central WiFi/GSM + Teclado LCD + 2 Sirenas Estroboscópicas + Sensores Magnéticos y PIR Pet-Immune',
    costo: 'Gs. 3.850.000 (Instalación Completa de Seguridad)',
    status: 'Protección Activa 24/7 Calibrada para Emma y Serafina 🛡️🐾',
    desc: 'Sistema integral de alarma domiciliaria y perimetral con sensores de movimiento PIR de doble tecnología Pet-Immune (calibrados para que Emma la caniche y Serafina la gata calicó circulen libremente sin disparar falsas alarmas), sensores magnéticos en puertas/Blindex y barrera infrarroja sobre el muro lateral sobreelevado de 3,00m × 2,00m.'
  });

  return alarmGroup;
}

/**
 * 1. FACHADA FRONTAL Y PORTÓN EXISTENTE SOBRE CALLE TTE. GUILLERMO ARIAS (z = -4.00m)
 */
export function buildFacadeAndGate3D(THREE, targetGroup, mats, scenarioKey = 'escenario300') {
  const facadeGroup = new THREE.Group();
  facadeGroup.name = 'fachada_y_porton';

  const isUpgradedGate = ['escenario350', 'escenario370', 'escenario440', 'edifica460', 'edifica573'].includes(scenarioKey);
  const isAdvancedExterior = ['escenario440', 'edifica460', 'edifica573'].includes(scenarioKey);
  const isFullExterior573 = scenarioKey === 'edifica573';

  // 1A. Vereda Reglamentaria (9.89m × 2.00m) + Canasto Basurero Metálico Elevado sobre Calle Tte. Guillermo Arias
  // Leo aclara: "Vereda no hay, ni basurero" -> En `'hoy_en_obra'` NO se dibuja vereda ni basurero;
  // en los escenarios de obra (`300M` en adelante) se construye la Vereda Reglamentaria + Canasto Basurero Metálico Elevado.
  if (scenarioKey !== 'hoy_en_obra') {
    const sidewalkGroup = new THREE.Group();
    const sidewalkMat = isFullExterior573 ? mats.porcelainPBR : mats.concretePBR;

    const sidewalk = new THREE.Mesh(new THREE.BoxGeometry(9.89, 0.16, 2.00), sidewalkMat);
    sidewalk.position.set(0, -0.02, -5.00);
    sidewalk.receiveShadow = true;
    sidewalkGroup.add(sidewalk);

    // Cordón cuneta de hormigón sobre la calzada (z = -6.00m)
    const curb = new THREE.Mesh(new THREE.BoxGeometry(9.89, 0.18, 0.15), mats.concreteFoundationPBR);
    curb.position.set(0, -0.01, -5.95);
    sidewalkGroup.add(curb);

    // Canasto Basurero Metálico Elevado Reglamentario en la vereda (x = -3.85m, z = -5.55m)
    const trashPost = new THREE.Mesh(
      new THREE.CylinderGeometry(0.032, 0.032, 1.35, 12),
      mats.blackMetalMat
    );
    trashPost.position.set(-3.85, 0.68, -5.55);
    sidewalkGroup.add(trashPost);

    const trashBasket = new THREE.Mesh(
      new THREE.BoxGeometry(0.68, 0.42, 0.46),
      mats.blackMetalMat
    );
    trashBasket.position.set(-3.85, 1.32, -5.55);
    sidewalkGroup.add(trashBasket);

    tagGroupUserData(sidewalkGroup, {
      type: 'obra_nueva_vereda',
      bankCategory: 'nuevo_rojo',
      name: 'Vereda Reglamentaria (9,89m × 2,00m) + Canasto Basurero Metálico Elevado (A Construir)',
      dimensions: 'Vereda 9.89m × 2.00m (19,78 m²) con Rampa Vehicular + Basurero Metálico Elevado',
      costo: 'Gs. 3.650.000 (Vereda Reglamentaria + Cordón + Canasto Basurero Elevado)',
      status: 'Obra Exterior Nueva a Construir (Hoy no hay vereda ni basurero) 🛠️✨',
      desc: 'Construcción de vereda municipal reglamentaria de 9,89m de frente con rampa vehicular reforzada para la Chery Tiggo 2 Pro 2026 y canasto basurero metálico elevado sobre Calle Tte. Guillermo Arias.'
    });
    facadeGroup.add(sidewalkGroup);
  }

  // 1B. Pilares y Muralla Frontal YA EXISTENTE sobre Línea Municipal (z = -4.00m)
  const wallMat = isFullExterior573
    ? mats.stoneWallPBR
    : isAdvancedExterior
      ? mats.plasterExteriorPBR
      : mats.plasterRoughPBR;

  const murallaData = {
    type: 'fachada_exterior',
    bankCategory: 'existente_negro',
    name: isFullExterior573
      ? 'Muralla Perimetral Frontal Existente Renovada en Piedra Basáltica y Herrería (Ítem 20 Edifica)'
      : 'Muralla y Fachada Frontal YA EXISTENTE (Línea Municipal z = -4.00m)',
    dimensions: 'Frente 9.89m × Altura 2.25m',
    costo: isFullExterior573 ? 'Gs. 10.677.500 (Ítem 20 Presupuesto Completo)' : 'Gs. 0 (Muralla Existente en Obra)',
    status: isFullExterior573
      ? 'Revestimiento Piedra + Iluminación LED ✨'
      : isAdvancedExterior
        ? 'Revocada y Pintada 🎯'
        : 'Muralla Existente en Obra (Color Negro en Carpeta Banco) 🔒',
    desc: 'Cerramiento frontal ya existente sobre línea municipal con acceso peatonal y portón vehicular para 2 vehículos.'
  };

  const leftWall = new THREE.Mesh(new THREE.BoxGeometry(1.64, 2.20, 0.25), wallMat);
  leftWall.position.set(-4.12, 1.05, -4.00);
  leftWall.userData = murallaData;
  facadeGroup.add(leftWall);

  const centerPillar = new THREE.Mesh(new THREE.BoxGeometry(0.38, 2.45, 0.38), wallMat);
  centerPillar.position.set(-2.15, 1.18, -4.00);
  centerPillar.userData = murallaData;
  facadeGroup.add(centerPillar);

  const rightPillar = new THREE.Mesh(new THREE.BoxGeometry(0.38, 2.45, 0.38), wallMat);
  rightPillar.position.set(4.75, 1.18, -4.00);
  rightPillar.userData = murallaData;
  facadeGroup.add(rightPillar);

  if (isUpgradedGate) {
    const lintel = new THREE.Mesh(new THREE.BoxGeometry(9.89, 0.28, 0.42), mats.concretePBR);
    lintel.position.set(0, 2.38, -4.00);
    lintel.userData = murallaData;
    facadeGroup.add(lintel);
  }

  // Puerta Peatonal sobre Línea Municipal (entre x = -3.30m y x = -2.34m)
  const pedGateGroup = new THREE.Group();
  const pedFrame = new THREE.Mesh(
    new THREE.BoxGeometry(0.96, 2.15, 0.08),
    isFullExterior573 ? mats.woodDoorPBR : mats.blackMetalMat
  );
  pedFrame.position.set(-2.82, 1.05, -4.00);
  pedGateGroup.add(pedFrame);

  const pedHandle = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.55, 12), mats.chromeMat);
  pedHandle.position.set(-2.48, 1.05, -4.06);
  pedGateGroup.add(pedHandle);
  tagGroupUserData(pedGateGroup, {
    type: 'fachada_exterior',
    bankCategory: 'existente_negro',
    name: 'Portón Peatonal Exterior Existente (Línea Municipal)',
    dimensions: '0.96m × 2.15m (Calle Tte. Guillermo Arias)',
    status: isFullExterior573 ? 'Terminación Madera Lapacho + Acero ✨' : 'Acceso Peatonal Existente',
    desc: 'Puerta peatonal existente sobre línea municipal.'
  });
  facadeGroup.add(pedGateGroup);

  // 1C. Portón Vehicular (entre x = -1.96m y x = +4.56m, ancho libre 6.50m para 2 vehículos)
  const gateGroup = new THREE.Group();
  const gateW = 6.50;
  const gateH = 2.18;
  const gateX = 1.30;

  const frameLeft = new THREE.Mesh(new THREE.BoxGeometry(0.10, gateH, 0.10), mats.blackMetalMat);
  frameLeft.position.set(gateX - gateW / 2, gateH / 2, -4.00);
  gateGroup.add(frameLeft);

  const frameRight = new THREE.Mesh(new THREE.BoxGeometry(0.10, gateH, 0.10), mats.blackMetalMat);
  frameRight.position.set(gateX + gateW / 2, gateH / 2, -4.00);
  gateGroup.add(frameRight);

  const slatMat = isFullExterior573
    ? mats.woodDeckPBR
    : isUpgradedGate
      ? mats.blackMetalMat
      : mats.concreteFoundationPBR;

  const numSlats = 11;
  for (let i = 0; i < numSlats; i++) {
    const sy = 0.16 + i * (gateH / numSlats);
    const slat = new THREE.Mesh(new THREE.BoxGeometry(gateW - 0.16, 0.13, 0.05), slatMat);
    slat.position.set(gateX, sy, -4.00);
    gateGroup.add(slat);
  }

  tagGroupUserData(gateGroup, {
    type: 'fachada_exterior',
    bankCategory: 'existente_negro',
    name: 'Portón Balancín (Basculante) Vehicular YA EXISTENTE sobre Calle Guillermo Arias',
    dimensions: '6.50m × 2.18m (Paso libre para 2 vehículos • Ya instalado hoy en obra)',
    costo: 'Gs. 0 (Portón Balancín Existente en Obra — Color Negro en Carpeta Banco)',
    status: isFullExterior573
      ? 'Portón Balancín Existente + Revestimiento Lapacho ✨'
      : isUpgradedGate
        ? 'Portón Balancín Existente Repintado Grafito 🎯'
        : 'Portón Balancín YA EXISTENTE en Obra 🔒',
    desc: 'Portón balancín (basculante) ya instalado en el frente sobre Calle Tte. Guillermo Arias. Se conserva íntegro y solo se le adiciona el kit de motorización.'
  });
  facadeGroup.add(gateGroup);

  // 1C-Bis. Motor Automatizador para el Portón Balancín Existente (A comprar e instalar desde 300M — Rojo en modo banco)
  if (scenarioKey !== 'hoy_en_obra') {
    const motorKitGroup = new THREE.Group();

    // Riel accionador vertical de aluminio/acero (L=1.55m) sobre el parante derecho del portón balancín (x = +4.48m, z = -3.92m)
    const driveRail = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 1.55, 0.08),
      mats.stainlessMat
    );
    driveRail.position.set(4.48, 1.25, -3.91);
    motorKitGroup.add(driveRail);

    // Cabezal electromecánico PPA / Peccinin JetFlex acoplado al riel
    const motorHead = new THREE.Mesh(
      new THREE.BoxGeometry(0.22, 0.34, 0.20),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.35, metalness: 0.6 })
    );
    motorHead.position.set(4.38, 1.62, -3.86);
    motorKitGroup.add(motorHead);

    // Brazo articulado de empuje conectado a la hoja del portón balancín
    const actuatorArm = new THREE.Mesh(
      new THREE.BoxGeometry(0.05, 0.58, 0.05),
      mats.chromeMat
    );
    actuatorArm.position.set(4.46, 1.38, -3.95);
    actuatorArm.rotation.x = 0.22;
    motorKitGroup.add(actuatorArm);

    // Central electrónica estanca + Traba electromagnética inferior + Fotocélulas antiaplastamiento
    const controlBox = new THREE.Mesh(
      new THREE.BoxGeometry(0.18, 0.24, 0.11),
      mats.blackMetalMat
    );
    controlBox.position.set(4.68, 1.45, -3.82);
    motorKitGroup.add(controlBox);

    const electricLock = new THREE.Mesh(
      new THREE.BoxGeometry(0.14, 0.12, 0.10),
      mats.blackMetalMat
    );
    electricLock.position.set(1.30, 0.16, -3.94);
    motorKitGroup.add(electricLock);

    tagGroupUserData(motorKitGroup, {
      type: 'automatizacion_porton',
      bankCategory: 'nuevo_rojo',
      name: 'Motor Automatizador Rápido para Portón Balancín Existente + Traba Eléctrica y Fotocélula (A Instalar)',
      dimensions: 'Riel 1.55m + Motor Electromecánico + Central + 2 Controles + Fotocélula',
      costo: 'Gs. 2.450.000 (Kit Motor Portón Balancín Instalado)',
      status: 'Equipamiento Nuevo a Instalar sobre Portón Existente ⚡🚪',
      desc: 'Como el portón balancín ya existe hoy en obra (Negro en plano bancario), solo se adquiere e instala el motor automatizador torsionador con traba eléctrica y fotocélulas de seguridad.'
    });
    facadeGroup.add(motorKitGroup);
  }

  // 1D. Caminero Peatonal hacia Puerta Principal (x=+0.85m) y Puerta de Servicio (x=+4.35m) + Huellas Vehiculares a Nivel Calle (Y=0.00m)
  if (scenarioKey !== 'hoy_en_obra') {
    const walkwayMat = isFullExterior573 ? mats.porcelainPBR : mats.concretePBR;

    [-0.45, 2.65].forEach((cx) => {
      const track = new THREE.Mesh(new THREE.BoxGeometry(2.35, 0.05, 5.15), walkwayMat);
      track.position.set(cx, 0.015, -1.25);
      track.userData = {
        type: 'fachada_exterior',
        bankCategory: 'nuevo_rojo',
        name: 'Huellas Vehiculares Dobles a Nivel de Calle (2 Vehículos • z = -4.00m a +1.50m)',
        dimensions: '51.90 m² (Entre Línea Municipal y Muro de Contención en z=+1.50m)',
        costo: isFullExterior573 ? 'Gs. 7.320.000 (Terminación Completa)' : 'Contrapiso Armado de Cochera',
        status: isFullExterior573 ? 'Terminación Hormigón Peinado / Porcelanato ✨' : 'Cochera Operativa a Nivel Calle 🎯',
        desc: 'Superficie de estacionamiento vehicular a nivel de calle contenida por el muro en z=+1.50m (dejando el pasillo antihumedad de 1,50m antes de Eje G).'
      };
      facadeGroup.add(track);
    });

    // Topes de rueda (Wheel Stops) en z = +0.65m recomendados por Auditoría de Exterior y Seguridad (evitan que el paragolpes de la Chery T2 Pro asome al vacío del Pasillo Antihumedad en z=+1.50m)
    [-0.95, 0.05, 2.15, 3.15].forEach((wx) => {
      const wheelStop = new THREE.Mesh(
        new THREE.BoxGeometry(0.55, 0.11, 0.16),
        new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.6, metalness: 0.1 })
      );
      wheelStop.position.set(wx, 0.055, 0.65);
      wheelStop.userData = {
        type: 'fachada_exterior',
        bankCategory: 'nuevo_rojo',
        name: 'Topes de Rueda Vehiculares + Baranda de Coronamiento en z = +0.65m / +1.50m (Auditoría Exterior)',
        dimensions: 'Topes de H°A°/Caucho 0.55×0.16×0.11m anclados a 0.85m del borde del Muro de Contención',
        costo: 'Incluido en Terminación Segura de Cochera',
        status: 'Protección Vehicular Chery T2 Pro 2026 Instalada 🛡️',
        desc: 'Detiene las ruedas traseras de la SUV Chery Tiggo 2 Pro 2026 en z=+0.65m para que el paragolpes quede 100% dentro de la explanada antes del Pasillo Cámara de Aire Antihumedad (z=+1.50m).'
      };
      facadeGroup.add(wheelStop);
    });
  }

  // 1E. SUV Chery Tiggo 2 Pro 2026 de Ruth y Leo estacionada en la cochera a nivel de calle (Y = 0.02m, z = -1.25m)
  facadeGroup.add(createCheryTiggo2Pro2026_3D(THREE, mats, -0.45, 0.03, -1.25, 0));

  if (isFullExterior573) {
    [-4.12, -2.15, 4.75].forEach((lx) => {
      const sconce = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.26, 0.12), mats.ledWarmMat);
      sconce.position.set(lx, 1.75, -4.16);
      facadeGroup.add(sconce);
    });
  }

  targetGroup.add(facadeGroup);
}

/**
 * 2. ESCALERA 1 DE H°A° EXISTENTE HACIA EL SUBSUELO (Ejes 1-2: x = 3.84m..4.87m, entre Eje D z=5.26m y Eje B z=9.94m)
 *    + ESCALERA 2 LIVIANA DESPLAZADA A x = 2.84m..3.84m (Paralela a Eje 2, garantizando Paso de Cabeza > 2,25m sobre Escalera 1)
 */
export function buildExistingStaircase3D(THREE, structureGroup, fase2Group, mats, scenarioKey = 'escenario300') {
  const stairSubGroup = new THREE.Group();
  stairSubGroup.name = 'escalera_subsuelo_real';

  const isFinished = ['escenario350', 'escenario370', 'escenario440', 'edifica460', 'edifica573'].includes(scenarioKey);
  const stX = (3.84 + 4.87) / 2; // 4.355m
  const stW = 4.87 - 3.84;       // 1.03m
  const zStart = 5.26;           // Eje D (Arranque en PB Y = 0.00m)
  const zEnd = 9.94;             // Eje B (Llegada a Subsuelo Y = -2.34m)
  const runZ = zEnd - zStart;    // 4.68m
  const dropY = 2.34;
  const numSteps = 14;

  const waistLen = Math.hypot(runZ, dropY);
  const waistAngle = Math.atan2(dropY, runZ);
  const waistGeo = new THREE.BoxGeometry(stW - 0.04, 0.16, waistLen);
  const waistMesh = new THREE.Mesh(waistGeo, mats.concretePBR);
  waistMesh.position.set(stX, -dropY / 2 - 0.10, (zStart + zEnd) / 2);
  waistMesh.rotation.x = waistAngle;
  stairSubGroup.add(waistMesh);

  const landingGeo = new THREE.BoxGeometry(stW + 0.15, 0.18, 1.10);
  const landingMesh = new THREE.Mesh(landingGeo, isFinished ? mats.porcelainPBR : mats.concretePBR);
  landingMesh.position.set(stX, -2.34 + 0.02, zEnd + 0.45);
  stairSubGroup.add(landingMesh);

  for (let i = 0; i < numSteps; i++) {
    const t = i / numSteps;
    const stepZ = zStart + runZ * t + (runZ / numSteps) * 0.5;
    const stepY = -dropY * t - (dropY / numSteps) * 0.5;
    const stepDepth = runZ / numSteps + 0.03;
    const stepHeight = dropY / numSteps;

    const riserMesh = new THREE.Mesh(
      new THREE.BoxGeometry(stW, stepHeight, stepDepth),
      mats.concretePBR
    );
    riserMesh.position.set(stX, stepY, stepZ);
    stairSubGroup.add(riserMesh);

    if (isFinished) {
      const treadMesh = new THREE.Mesh(
        new THREE.BoxGeometry(stW + 0.02, 0.035, stepDepth + 0.025),
        mats.woodDeckPBR
      );
      treadMesh.position.set(stX, stepY + stepHeight / 2 + 0.018, stepZ);
      stairSubGroup.add(treadMesh);
    }
  }

  if (scenarioKey !== 'hoy_en_obra') {
    const railGroup = new THREE.Group();
    const postPositions = [0, 0.33, 0.66, 1.0];
    postPositions.forEach((pt) => {
      const pz = zStart + runZ * pt;
      const py = -dropY * pt + 0.48;
      const post = new THREE.Mesh(
        new THREE.CylinderGeometry(0.02, 0.02, 0.95, 12),
        mats.stainlessMat
      );
      post.position.set(3.86, py, pz);
      railGroup.add(post);
    });

    const handrailGeo = new THREE.CylinderGeometry(0.025, 0.025, waistLen, 14);
    handrailGeo.rotateX(Math.PI / 2 + waistAngle);
    const handrail = new THREE.Mesh(handrailGeo, mats.stainlessMat);
    handrail.position.set(3.86, -dropY / 2 + 0.92, (zStart + zEnd) / 2);
    railGroup.add(handrail);

    // Puerta-Reja de Seguridad al Pie de la Escalera 1 en Subsuelo (z = 9.90m, Auditoría de Seguridad Física)
    const stairGateGroup = new THREE.Group();
    const gateFrame = new THREE.Mesh(new THREE.BoxGeometry(stW, 2.05, 0.04), mats.blackMetalMat);
    gateFrame.position.set(stX, -2.34 + 1.02, zEnd - 0.04);
    stairGateGroup.add(gateFrame);
    tagGroupUserData(stairGateGroup, {
      type: 'seguridad_fisica',
      bankCategory: 'nuevo_rojo',
      name: 'Puerta-Reja de Seguridad con Cerrojo al Pie de Escalera 1 en Subsuelo (Eje B • z = 9.94m)',
      dimensions: '1.03m × 2.05m en Perfiles Tubulares 40×40mm + Cerradura Doble Paleta',
      costo: 'Gs. 1.650.000 (Auditoría Técnico de Seguridad — Bloquea intrusión desde el patio inferior)',
      status: 'Esclusa Física de Seguridad Subsuelo ↔ Vivienda 🔒🛡️',
      desc: 'Impide que cualquier intruso que ingrese al jardín trasero pueda subir por la Escalera 1 hacia la Planta Nivel Calle o el 2do Piso, permitiendo a la vez el paso de la manguera del camión cisterna cuando se abre con llave.'
    });
    stairSubGroup.add(stairGateGroup);

    if (isFinished) {
      const glassPanelGeo = new THREE.BoxGeometry(0.015, 0.72, waistLen - 0.15);
      const glassPanel = new THREE.Mesh(glassPanelGeo, mats.glassBlindexMat);
      glassPanel.position.set(3.86, -dropY / 2 + 0.52, (zStart + zEnd) / 2);
      glassPanel.rotation.x = waistAngle;
      railGroup.add(glassPanel);
    }
    stairSubGroup.add(railGroup);
  }

  tagGroupUserData(stairSubGroup, {
    type: 'structure',
    name: 'Escalera 1 de H°A° Existente hacia el Subsuelo Libre de 100 m² (Ejes 1–2 / D–B 🔒)',
    dimensions: 'Ancho 1.03m × Largo 4.68m • 14 Peldaños (De Y=0.00m a Y=-2.34m)',
    costo: isFinished ? 'Revestida en Lapacho + Baranda Inox/Blindex' : 'Ejecutada en H°A° en Obra 🔒',
    status: isFinished ? 'Terminada con Baranda y Peldaños ✨' : 'Ejecutada en Obra Hoy 🔒',
    desc: 'Escalera principal de hormigón armado ya construida entre los Ejes 1 y 2 que vincula la Puerta de Servicio y la Planta Social (+100.00m) con el Lavadero y Depósito en el Subsuelo de 100 m² libres (-2.34m).'
  });
  structureGroup.add(stairSubGroup);

  // Tramo Superior de Escalera (Escalera 2: Planta Nivel Calle Y=0.00m hacia Dormitorio en 2do Piso Y=+2.88m)
  // CORRECCIÓN DE INGENIERÍA CIVIL: Desplazada a x = 2.84m..3.84m (stX_PA = 3.34m, paralela a Eje 2 al Oeste de Escalera 1)
  // para dejar 100% libre el vano vertical sobre la Escalera 1 (Paso de Cabeza > 2,25m en lugar de 0,00m).
  const stairPAGroup = new THREE.Group();
  const stX_PA = 3.34;
  const stW_PA = 0.96;
  const risePA = 2.88;
  const stepsPA = 16;
  const waistLenPA = Math.hypot(runZ, risePA);
  const waistAnglePA = -Math.atan2(risePA, runZ);

  // Dos limones metálicos laterales UPN 200 en acero negro (estructura liviana s/ Losa 1 existente)
  [-stW_PA / 2 + 0.04, stW_PA / 2 - 0.04].forEach((lx) => {
    const stringerMesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.06, 0.20, waistLenPA),
      mats.blackMetalMat
    );
    stringerMesh.position.set(stX_PA + lx, risePA / 2 - 0.06, (zStart + zEnd) / 2);
    stringerMesh.rotation.x = waistAnglePA;
    stairPAGroup.add(stringerMesh);
  });

  for (let i = 0; i < stepsPA; i++) {
    const t = i / stepsPA;
    const stepZ = zStart + runZ * t + (runZ / stepsPA) * 0.5;
    const stepY = risePA * t + (risePA / stepsPA) * 0.5;
    const stepDepth = runZ / stepsPA + 0.02;

    const stepMesh = new THREE.Mesh(
      new THREE.BoxGeometry(stW_PA, 0.055, stepDepth),
      mats.woodDeckPBR
    );
    stepMesh.position.set(stX_PA, stepY + 0.06, stepZ);
    stairPAGroup.add(stepMesh);
  }

  // Baranda de seguridad del Tramo Superior hacia el Dormitorio de Ruth y Leo en el 2do Piso (activa desde 300M)
  if (scenarioKey !== 'hoy_en_obra') {
    const railPAGroup = new THREE.Group();
    [0, 0.33, 0.66, 1.0].forEach((pt) => {
      const pz = zStart + runZ * pt;
      const py = risePA * pt + 0.48;
      const post = new THREE.Mesh(
        new THREE.CylinderGeometry(0.02, 0.02, 0.95, 12),
        mats.stainlessMat
      );
      post.position.set(stX_PA - stW_PA / 2 + 0.03, py, pz);
      railPAGroup.add(post);
    });

    const handrailPAGeo = new THREE.CylinderGeometry(0.025, 0.025, waistLenPA, 14);
    handrailPAGeo.rotateX(Math.PI / 2 + waistAnglePA);
    const handrailPA = new THREE.Mesh(handrailPAGeo, mats.stainlessMat);
    handrailPA.position.set(stX_PA - stW_PA / 2 + 0.03, risePA / 2 + 0.92, (zStart + zEnd) / 2);
    railPAGroup.add(handrailPA);
    stairPAGroup.add(railPAGroup);
  }

  tagGroupUserData(stairPAGroup, {
    type: 'structure_fase2',
    bankCategory: 'nuevo_rojo',
    name: 'Escalera 2 Metálica/Madera Liviana hacia 2do Piso (x = 2.84m..3.84m • Paso de Cabeza > 2.25m s/ Escalera 1)',
    dimensions: 'Ancho 0.96m × 16 Peldaños de Lapacho sobre Limones Metálicos UPN 200 (De Y=0.00m a +2.88m)',
    costo: 'Gs. 9.800.000 (Estructura Metálica Liviana + Peldaños Lapacho + Baranda — Corrección Ing. Civil)',
    status: 'Circulación Diaria al Dormitorio en 2do Piso sin Choque de Cabeza ✨',
    desc: 'Desplazada a la franja paralela x=2.84m..3.84m (al Oeste del Eje 2, apoyada en viga sobre P6 y P5) para dejar libre la altura de paso sobre la Escalera 1 existente que baja al Subsuelo.'
  });
  fase2Group.add(stairPAGroup);
}

/**
 * Construye una Puerta de Madera completa (marco cajón, hoja entreabierta, bisagras y picaporte/manijón)
 */
function createWoodenDoor3D(THREE, mats, x, baseY, z, width = 0.82, height = 2.10, rotY = 0, openAngle = 0.42, label = 'Puerta Placa de Madera Cedro/Lapacho', extraOptions = {}) {
  const doorGroup = new THREE.Group();
  doorGroup.position.set(x, baseY, z);
  doorGroup.rotation.y = rotY;

  const frameThick = 0.045;
  const frameDepth = 0.17;
  const leftJamb = new THREE.Mesh(new THREE.BoxGeometry(frameThick, height, frameDepth), mats.woodDoorPBR);
  leftJamb.position.set(-width / 2 + frameThick / 2, height / 2, 0);
  doorGroup.add(leftJamb);

  const rightJamb = new THREE.Mesh(new THREE.BoxGeometry(frameThick, height, frameDepth), mats.woodDoorPBR);
  rightJamb.position.set(width / 2 - frameThick / 2, height / 2, 0);
  doorGroup.add(rightJamb);

  const topJamb = new THREE.Mesh(new THREE.BoxGeometry(width, frameThick, frameDepth), mats.woodDoorPBR);
  topJamb.position.set(0, height - frameThick / 2, 0);
  doorGroup.add(topJamb);

  // Si es la Puerta Principal Jerarquizada, añade paño fijo lateral de vidrio templado y manijón largo vertical de acero inoxidable
  if (extraOptions.hasSidelight) {
    const sideGlass = new THREE.Mesh(new THREE.BoxGeometry(0.32, height - frameThick, 0.025), mats.glassBlindexMat);
    sideGlass.position.set(-width / 2 - 0.16, height / 2, 0);
    doorGroup.add(sideGlass);

    const sideFrame = new THREE.Mesh(new THREE.BoxGeometry(0.04, height, frameDepth), mats.blackMetalMat);
    sideFrame.position.set(-width / 2 - 0.33, height / 2, 0);
    doorGroup.add(sideFrame);
  }

  // Si es la Puerta de Servicio Independiente, añade visor óptico y reja de seguridad exterior
  if (extraOptions.isServiceDoor) {
    for (let b = -2; b <= 2; b++) {
      const grilleBar = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, height - 0.12, 8), mats.blackMetalMat);
      grilleBar.position.set(b * 0.14, height / 2, -0.075);
      doorGroup.add(grilleBar);
    }
    [-0.5, 0.0, 0.5].forEach((hy) => {
      const crossBar = new THREE.Mesh(new THREE.BoxGeometry(width - 0.08, 0.018, 0.018), mats.blackMetalMat);
      crossBar.position.set(0, height / 2 + hy, -0.075);
      doorGroup.add(crossBar);
    });
  }

  const leafPivot = new THREE.Group();
  leafPivot.position.set(-width / 2 + frameThick, 0, 0);
  leafPivot.rotation.y = openAngle;

  const leafW = width - frameThick * 2;
  const leafH = height - frameThick;
  const leafMesh = new THREE.Mesh(new THREE.BoxGeometry(leafW, leafH, 0.048), mats.woodDoorPBR);
  leafMesh.position.set(leafW / 2, leafH / 2, 0);
  leafPivot.add(leafMesh);

  if (extraOptions.longPullBar) {
    // Manijón vertical de acero inoxidable de 1.20m en Puerta Principal
    const pullFront = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 1.20, 14), mats.stainlessMat);
    pullFront.position.set(leafW - 0.10, 1.15, 0.048);
    leafPivot.add(pullFront);

    const pullBack = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 1.20, 14), mats.stainlessMat);
    pullBack.position.set(leafW - 0.10, 1.15, -0.048);
    leafPivot.add(pullBack);
  } else {
    const handleRosette = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.028, 0.06, 12), mats.chromeMat);
    handleRosette.rotation.x = Math.PI / 2;
    handleRosette.position.set(leafW - 0.08, 1.00, 0);
    leafPivot.add(handleRosette);

    const leverFront = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.018, 0.018), mats.chromeMat);
    leverFront.position.set(leafW - 0.12, 1.00, 0.042);
    leafPivot.add(leverFront);

    const leverBack = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.018, 0.018), mats.chromeMat);
    leverBack.position.set(leafW - 0.12, 1.00, -0.042);
    leafPivot.add(leverBack);
  }

  doorGroup.add(leafPivot);

  tagGroupUserData(doorGroup, {
    type: extraOptions.type || 'abertura_madera',
    name: label,
    dimensions: `${width.toFixed(2)}m × ${height.toFixed(2)}m • ${extraOptions.dimensionsExtra || 'Marco Cajón 15cm + Herrajes Cromados'}`,
    costo: extraOptions.costo || 'Incluido en Carpintería de Habitabilidad',
    status: extraOptions.status || 'Carpintería de Madera Instalada ✨',
    desc: extraOptions.desc || 'Puerta de madera estacionada con marco cajón, contramarcos perimetrales y herrajes de primera calidad.'
  });

  return doorGroup;
}

/**
 * Construye un Inodoro Cerámico 3D de alta fidelidad (base curva, taza, tapa, mochila de descarga y botón dual cromado)
 */
function createToilet3D(THREE, mats, x, baseY, z, rotY = 0, roomLabel = 'Baño Principal PB') {
  const g = new THREE.Group();
  g.position.set(x, baseY, z);
  g.rotation.y = rotY;

  const pedestal = new THREE.Mesh(
    new THREE.CylinderGeometry(0.16, 0.13, 0.38, 20),
    mats.ceramicSanitaryMat
  );
  pedestal.scale.set(0.85, 1, 1.35);
  pedestal.position.set(0, 0.19, 0.08);
  g.add(pedestal);

  const bowl = new THREE.Mesh(
    new THREE.SphereGeometry(0.21, 24, 16),
    mats.ceramicSanitaryMat
  );
  bowl.scale.set(0.88, 0.62, 1.28);
  bowl.position.set(0, 0.34, 0.11);
  g.add(bowl);

  const seat = new THREE.Mesh(
    new THREE.CylinderGeometry(0.19, 0.19, 0.025, 24),
    mats.ceramicSanitaryMat
  );
  seat.scale.set(0.88, 1, 1.26);
  seat.position.set(0, 0.42, 0.11);
  g.add(seat);

  const tank = new THREE.Mesh(
    new THREE.BoxGeometry(0.38, 0.38, 0.17),
    mats.ceramicSanitaryMat
  );
  tank.position.set(0, 0.59, -0.16);
  g.add(tank);

  const tankLid = new THREE.Mesh(
    new THREE.BoxGeometry(0.40, 0.03, 0.19),
    mats.ceramicSanitaryMat
  );
  tankLid.position.set(0, 0.79, -0.16);
  g.add(tankLid);

  const flushBtn = new THREE.Mesh(
    new THREE.CylinderGeometry(0.028, 0.028, 0.015, 16),
    mats.chromeMat
  );
  flushBtn.position.set(0, 0.81, -0.16);
  g.add(flushBtn);

  tagGroupUserData(g, {
    type: 'artefacto_sanitario',
    name: `Inodoro Cerámico con Mochila Dual-Flush (${roomLabel})`,
    dimensions: '0.38m × 0.66m × 0.81m • Loza Sanitaria Vitrificada',
    costo: 'Gs. 1.650.000 (Incluido desde Escenario Base 300M)',
    status: 'Núcleo Básico de Habitabilidad ✨',
    desc: 'Inodoro sifónico con mochila de descarga dual 3L/6L, asiento con caída amortiguada y conexión a red cloacal PVC Ø100mm.'
  });

  return g;
}

/**
 * Construye un Bidet Cerámico 3D con grifería monocomando cromada
 */
function createBidet3D(THREE, mats, x, baseY, z, rotY = 0, roomLabel = 'Baño Principal PB') {
  const g = new THREE.Group();
  g.position.set(x, baseY, z);
  g.rotation.y = rotY;

  const body = new THREE.Mesh(
    new THREE.CylinderGeometry(0.18, 0.13, 0.38, 20),
    mats.ceramicSanitaryMat
  );
  body.scale.set(0.85, 1, 1.25);
  body.position.set(0, 0.19, 0.04);
  g.add(body);

  const rim = new THREE.Mesh(
    new THREE.CylinderGeometry(0.19, 0.18, 0.04, 20),
    mats.ceramicSanitaryMat
  );
  rim.scale.set(0.86, 1, 1.26);
  rim.position.set(0, 0.39, 0.04);
  g.add(rim);

  const faucet = new THREE.Mesh(
    new THREE.CylinderGeometry(0.018, 0.022, 0.09, 12),
    mats.chromeMat
  );
  faucet.position.set(0, 0.44, -0.12);
  g.add(faucet);

  tagGroupUserData(g, {
    type: 'artefacto_sanitario',
    name: `Bidet Cerámico Monocomando (${roomLabel})`,
    dimensions: '0.36m × 0.54m × 0.40m • Grifería Cromada',
    costo: 'Gs. 1.250.000 (Incluido desde Escenario Base 300M)',
    status: 'Núcleo Básico de Habitabilidad ✨',
    desc: 'Bidet de loza sanitaria blanca vitrificada con grifería mezcladora monocomando de agua fría y caliente.'
  });

  return g;
}

/**
 * Construye un Vanitory Flotante con Bacha de Apoyo, Grifería Monocomando y Espejo Retroiluminado LED
 */
function createVanity3D(THREE, mats, x, baseY, z, width = 0.85, rotY = 0, roomLabel = 'Baño Principal PB') {
  const g = new THREE.Group();
  g.position.set(x, baseY, z);
  g.rotation.y = rotY;

  const cab = new THREE.Mesh(new THREE.BoxGeometry(width, 0.42, 0.48), mats.woodDeckPBR);
  cab.position.set(0, 0.64, 0);
  g.add(cab);

  const top = new THREE.Mesh(new THREE.BoxGeometry(width + 0.02, 0.04, 0.50), mats.ceramicSanitaryMat);
  top.position.set(0, 0.87, 0);
  g.add(top);

  const vessel = new THREE.Mesh(
    new THREE.CylinderGeometry(0.20, 0.15, 0.13, 24),
    mats.ceramicSanitaryMat
  );
  vessel.scale.set(1.15, 1, 0.85);
  vessel.position.set(0, 0.95, 0.02);
  g.add(vessel);

  const tapStem = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.22, 12), mats.chromeMat);
  tapStem.position.set(0, 0.99, -0.14);
  g.add(tapStem);

  const tapSpout = new THREE.Mesh(new THREE.BoxGeometry(0.022, 0.022, 0.13), mats.chromeMat);
  tapSpout.position.set(0, 1.08, -0.08);
  g.add(tapSpout);

  const ledHalo = new THREE.Mesh(new THREE.BoxGeometry(width - 0.04, 0.88, 0.015), mats.ledWarmMat);
  ledHalo.position.set(0, 1.56, -0.23);
  g.add(ledHalo);

  const mirror = new THREE.Mesh(new THREE.BoxGeometry(width - 0.08, 0.84, 0.02), mats.mirrorMat);
  mirror.position.set(0, 1.56, -0.215);
  g.add(mirror);

  tagGroupUserData(g, {
    type: 'artefacto_sanitario',
    name: `Vanitory Suspendido con Bacha de Apoyo y Espejo LED (${roomLabel})`,
    dimensions: `${width.toFixed(2)}m × 0.50m • Espejo con Halo LED 3000K`,
    costo: 'Gs. 2.450.000 (Incluido desde Escenario Base 300M)',
    status: 'Núcleo Básico de Habitabilidad ✨',
    desc: 'Mueble vanitory flotante en madera tratada antihumedad, mesada blanca, bacha cerámica de apoyo, monocomando alto y espejo retroiluminado.'
  });

  return g;
}

/**
 * Construye un Box de Ducha Blindex con Columna de Ducha Cuadrada Tipo Lluvia, Rejilla Lineal y Termocalefón 80L
 */
function createShowerBox3D(THREE, mats, x, baseY, z, w = 1.20, d = 0.90, rotY = 0, roomLabel = 'Baño Principal PB') {
  const g = new THREE.Group();
  g.position.set(x, baseY, z);
  g.rotation.y = rotY;

  const tray = new THREE.Mesh(new THREE.BoxGeometry(w, 0.04, d), mats.porcelainPBR);
  tray.position.set(0, 0.02, 0);
  g.add(tray);

  const drain = new THREE.Mesh(new THREE.BoxGeometry(w * 0.75, 0.045, 0.06), mats.stainlessMat);
  drain.position.set(0, 0.025, -d / 2 + 0.14);
  g.add(drain);

  const glass = new THREE.Mesh(new THREE.BoxGeometry(w, 2.05, 0.015), mats.glassBlindexMat);
  glass.position.set(0, 1.04, d / 2);
  g.add(glass);

  const topRail = new THREE.Mesh(new THREE.BoxGeometry(w, 0.035, 0.035), mats.blackMetalMat);
  topRail.position.set(0, 2.06, d / 2);
  g.add(topRail);

  const doorHandle = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.42, 12), mats.chromeMat);
  doorHandle.position.set(w * 0.18, 1.05, d / 2 + 0.02);
  g.add(doorHandle);

  const showerPipe = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 1.15, 12), mats.chromeMat);
  showerPipe.position.set(-w / 2 + 0.08, 1.55, 0);
  g.add(showerPipe);

  const showerArm = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.02, 0.02), mats.chromeMat);
  showerArm.position.set(-w / 2 + 0.26, 2.12, 0);
  g.add(showerArm);

  const rainHead = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.018, 0.26), mats.chromeMat);
  rainHead.position.set(-w / 2 + 0.42, 2.10, 0);
  g.add(rainHead);

  const heater = new THREE.Mesh(
    new THREE.CylinderGeometry(0.21, 0.21, 0.72, 20),
    mats.ceramicSanitaryMat
  );
  heater.position.set(w / 2 - 0.28, 2.15, -d / 2 + 0.24);
  g.add(heater);

  tagGroupUserData(g, {
    type: 'artefacto_sanitario',
    name: `Box de Ducha Blindex Templado + Flor Lluvia + Termocalefón 80L (${roomLabel})`,
    dimensions: `${w.toFixed(2)}m × ${d.toFixed(2)}m × 2.05m`,
    costo: 'Gs. 3.850.000 (Incluido desde Escenario Base 300M)',
    status: 'Agua Fría/Caliente Habitable ✨',
    desc: 'Cabina de ducha con mampara de cristal templado 10mm, columna mezcladora con duchador lluvia cuadrado, desagüe lineal inoxidable y termocalefón de 80L.'
  });

  return g;
}

/**
 * Construye un módulo de Lavadero Operativo (Pileta profunda de lavar con grifería + 1 Lavarropas propio de Ruth y Leo)
 */
function createLaundryModule3D(THREE, mats, x, baseY, z, rotY = 0, labelSuffix = 'Planta Baja / Subsuelo') {
  const laundryGroup = new THREE.Group();
  laundryGroup.position.set(x, baseY, z);
  laundryGroup.rotation.y = rotY;

  // 1 Lavarropas Propio de Ruth y Leo (0.60m × 0.60m × 0.85m — Gs. 0)
  const washerGroup = new THREE.Group();
  const washerBody = new THREE.Mesh(new THREE.BoxGeometry(0.60, 0.85, 0.60), mats.ceramicSanitaryMat);
  washerBody.position.set(-0.34, 0.43, 0);
  washerGroup.add(washerBody);

  const controlDial = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.02, 14), mats.chromeMat);
  controlDial.rotation.x = Math.PI / 2;
  controlDial.position.set(-0.34, 0.76, 0.31);
  washerGroup.add(controlDial);

  const washerRing = new THREE.Mesh(new THREE.CylinderGeometry(0.21, 0.21, 0.03, 24), mats.blackMetalMat);
  washerRing.rotation.x = Math.PI / 2;
  washerRing.position.set(-0.34, 0.44, 0.305);
  washerGroup.add(washerRing);

  const washerGlass = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.035, 24), mats.glassBlindexMat);
  washerGlass.rotation.x = Math.PI / 2;
  washerGlass.position.set(-0.34, 0.44, 0.308);
  washerGroup.add(washerGlass);

  tagGroupUserData(washerGroup, {
    type: 'electrodomestico_propio',
    name: `1 Lavarropas Automático Carga Frontal (${labelSuffix})`,
    dimensions: '0.60m × 0.60m × 0.85m • Conectado a Red Fría/Caliente y Desagüe',
    costo: 'Gs. 0 (Propio de Ruth y Leo — A trasladar)',
    status: 'Propio del Propietario (Gs. 0 — A trasladar) 📦',
    desc: 'Lavarropas propio del inventario actual de Ruth y Leo, instalado junto a la batea profunda del lavadero operativo.'
  });
  laundryGroup.add(washerGroup);

  // Pileta profunda de lavar + mesada de granito e instalación hidrosanitaria
  const sinkSubGroup = new THREE.Group();
  const sinkCab = new THREE.Mesh(new THREE.BoxGeometry(0.64, 0.82, 0.58), mats.woodDeckPBR);
  sinkCab.position.set(0.32, 0.41, 0);
  sinkSubGroup.add(sinkCab);

  const sinkCounter = new THREE.Mesh(new THREE.BoxGeometry(0.70, 0.035, 0.62), mats.granitePBR);
  sinkCounter.position.set(0.32, 0.84, 0);
  sinkSubGroup.add(sinkCounter);

  const deepBasin = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.04, 0.44), mats.ceramicSanitaryMat);
  deepBasin.position.set(0.32, 0.865, 0.02);
  sinkSubGroup.add(deepBasin);

  const laundryTap = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.26, 12), mats.chromeMat);
  laundryTap.position.set(0.32, 0.98, -0.22);
  sinkSubGroup.add(laundryTap);

  const laundrySpout = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.02, 0.16), mats.chromeMat);
  laundrySpout.position.set(0.32, 1.10, -0.15);
  sinkSubGroup.add(laundrySpout);

  tagGroupUserData(sinkSubGroup, {
    type: 'lavadero_operativo',
    name: `Pileta de Lavar Profunda + Instalación Hidrosanitaria de Lavadero (${labelSuffix})`,
    dimensions: '0.70m × 0.62m × 0.88m • Agua Fría/Caliente y Desagüe Sifonado',
    costo: 'Gs. 2.837.500 (Incluido SIEMPRE desde Escenario Base 300M)',
    status: 'Núcleo Básico de Habitabilidad Operativo ✨',
    desc: 'Batea profunda de lavado con mesada de granito, grifería mezcladora y llaves de paso/desagüe para el lavarropas de Ruth y Leo.'
  });
  laundryGroup.add(sinkSubGroup);

  laundryGroup.userData = sinkSubGroup.userData;
  return laundryGroup;
}

/**
 * Construye la Parrilla en la Galería L1 (`buildGalleryParilla3D`):
 * - En `escenario300`, `escenario350`, `escenario370`, `escenario440` y `edifica460`:
 *   Modela la **Parrilla Portátil / Chulengo Metálico Rodante del Propietario (Gs. 0)**.
 * - Solo en `edifica573`: Modela la Parrilla de Obra en mampostería refractaria e inox.
 */
function buildGalleryParilla3D(THREE, mats, yGal, scenarioKey) {
  const isBuiltInMasonryBBQ = scenarioKey === 'edifica573';
  const bbqGroup = new THREE.Group();

  if (!isBuiltInMasonryBBQ) {
    const chulengoX = -4.15;
    const chulengoZ = 11.45;

    const drumGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.92, 24);
    drumGeo.rotateX(Math.PI / 2);
    const drum = new THREE.Mesh(drumGeo, mats.blackMetalMat);
    drum.position.set(chulengoX, yGal + 0.86, chulengoZ);
    bbqGroup.add(drum);

    const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.46, 12), mats.woodDoorPBR);
    handle.rotation.x = Math.PI / 2;
    handle.position.set(chulengoX + 0.29, yGal + 0.98, chulengoZ);
    bbqGroup.add(handle);

    const stack = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.34, 14), mats.blackMetalMat);
    stack.position.set(chulengoX - 0.05, yGal + 1.24, chulengoZ - 0.28);
    bbqGroup.add(stack);

    const stackCap = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.05, 14), mats.blackMetalMat);
    stackCap.position.set(chulengoX - 0.05, yGal + 1.43, chulengoZ - 0.28);
    bbqGroup.add(stackCap);

    [[-0.18, -0.36], [0.18, -0.36], [-0.18, 0.36], [0.18, 0.36]].forEach(([lx, lz]) => {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.68, 10), mats.blackMetalMat);
      leg.position.set(chulengoX + lx, yGal + 0.36, chulengoZ + lz);
      bbqGroup.add(leg);
    });

    [-0.22, 0.22].forEach((wx) => {
      const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.04, 18), mats.blackMetalMat);
      wheel.rotation.z = Math.PI / 2;
      wheel.position.set(chulengoX + wx, yGal + 0.11, chulengoZ - 0.36);
      bbqGroup.add(wheel);
    });

    const sideTray = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.03, 0.38), mats.woodDeckPBR);
    sideTray.position.set(chulengoX, yGal + 0.84, chulengoZ + 0.66);
    bbqGroup.add(sideTray);

    tagGroupUserData(bbqGroup, {
      type: 'mobiliario_interior',
      name: 'Parrilla Portátil del Propietario (Sin Costo de Obra)',
      dimensions: '1.25m × 0.65m × 1.15m • Chulengo Metálico Rodante en Galería L1',
      costo: 'Gs. 0 (Ya disponible — Se prioriza inversión en habitabilidad interior)',
      status: 'Propio del Propietario (Gs. 0 — A trasladar) 📦',
      desc: 'Por decisión estratégica de Ruth y Leo se utiliza su parrilla portátil en la Galería al Río, destinando esos Gs. 7.500.000 a completar baño, cocina, lavadero y terminaciones interiores.'
    });
  } else {
    const bbqBase = new THREE.Mesh(new THREE.BoxGeometry(0.88, 0.92, 1.55), mats.brickPBR);
    bbqBase.position.set(-4.32, yGal + 0.48, 11.35);
    bbqGroup.add(bbqBase);

    const bbqFirebox = new THREE.Mesh(new THREE.BoxGeometry(0.82, 0.85, 1.45), mats.brickPBR);
    bbqFirebox.position.set(-4.35, yGal + 1.36, 11.35);
    bbqGroup.add(bbqFirebox);

    const bbqInoxFront = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.78, 1.32), mats.stainlessMat);
    bbqInoxFront.position.set(-3.92, yGal + 1.36, 11.35);
    bbqGroup.add(bbqInoxFront);

    const bbqHood = new THREE.Mesh(new THREE.BoxGeometry(0.86, 0.95, 1.48), mats.plasterExteriorPBR);
    bbqHood.position.set(-4.34, yGal + 2.25, 11.35);
    bbqGroup.add(bbqHood);

    const bbqCounter = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.88, 1.05), mats.woodDeckPBR);
    bbqCounter.position.set(-4.38, yGal + 0.46, 12.58);
    bbqGroup.add(bbqCounter);

    const bbqGranite = new THREE.Mesh(new THREE.BoxGeometry(0.76, 0.04, 1.10), mats.granitePBR);
    bbqGranite.position.set(-4.38, yGal + 0.92, 12.58);
    bbqGroup.add(bbqGranite);

    tagGroupUserData(bbqGroup, {
      type: 'galeria_quincho',
      name: 'Parrilla de Obra en Ladrillo Refractario y Acero Inoxidable (Última Etapa 573,9M)',
      dimensions: '1.55m × 0.88m + Mesada Parrillera Granito 1.10m',
      costo: 'Gs. 7.500.000 (Solo incluida en Presupuesto Completo 573,9M)',
      status: 'Obra Exterior Final Completada ✨',
      desc: 'Parrilla fija de mampostería refractaria con guillotina de acero inoxidable y campana de extracción.'
    });
  }

  return bbqGroup;
}

/**
 * 3. JARDÍN CON CÉSPED ESMERALDA (`grassPBR`), PISCINA (`4.65m × 2.45m` según Plano Oficial Pág. 2)
 *    Y QUINCHO SEMICUBIERTO EN EL PATIO POSTERIOR (`z = 13.40m..25.80m`)
 */
export function buildPatioPoolAndQuincho3D(THREE, targetGroup, mats, scenarioKey = 'escenario300', forceShowPoolQuincho = false) {
  const patioGroup = new THREE.Group();
  patioGroup.name = 'patio_jardin_piscina_quincho';

  const patioY = -3.15; // Terraza nivelada de jardín posterior al pie de la salida del Subsuelo

  // 3A. Jardín con Césped Esmeralda Paraguayo (`grassPBR`, visible siempre desde `escenario300`)
  const lawnGroup = new THREE.Group();

  // Muro de contención perimetral de nivelación del jardín posterior (z = 13.40m a 25.60m, x = -4.85m a +4.85m)
  const terraceBase = new THREE.Mesh(
    new THREE.BoxGeometry(9.68, 1.45, 12.20),
    mats.stoneWallPBR
  );
  terraceBase.position.set(0, patioY - 0.725, 19.50);
  lawnGroup.add(terraceBase);

  // Alfombra de Césped Esmeralda natural (9.50m × 12.00m)
  const grassLawn = new THREE.Mesh(
    new THREE.BoxGeometry(9.50, 0.08, 12.00),
    mats.grassPBR
  );
  grassLawn.position.set(0, patioY + 0.04, 19.50);
  grassLawn.receiveShadow = true;
  lawnGroup.add(grassLawn);

  // Escalera exterior de jardín vinculando el Subsuelo (Y=-2.34m, z=9.94m..13.34m) con el Jardín de la Piscina (Y=-3.15m)
  for (let s = 0; s < 5; s++) {
    const gStep = new THREE.Mesh(
      new THREE.BoxGeometry(1.65, 0.16, 0.38),
      mats.porcelainPBR
    );
    gStep.position.set(3.45, -2.38 - s * 0.16, 13.40 + s * 0.38);
    lawnGroup.add(gStep);
  }

  // Caminero de losetas atérmicas sobre el césped
  for (let p = 0; p < 7; p++) {
    const paver = new THREE.Mesh(
      new THREE.BoxGeometry(0.95, 0.04, 0.55),
      mats.porcelainPBR
    );
    paver.position.set(0.45, patioY + 0.09, 14.30 + p * 0.95);
    lawnGroup.add(paver);
  }

  // Canteros perimetrales con arbustos ornamentales
  [-4.40, 4.40].forEach((px) => {
    [15.5, 18.5, 21.5, 24.0].forEach((pz) => {
      const shrub = new THREE.Mesh(
        new THREE.SphereGeometry(0.42, 12, 10),
        mats.grassPBR
      );
      shrub.scale.set(1, 0.75, 1.2);
      shrub.position.set(px, patioY + 0.32, pz);
      lawnGroup.add(shrub);
    });
  });

  tagGroupUserData(lawnGroup, {
    type: 'jardin_cesped',
    name: 'Jardín Posterior Nivelado con Césped Esmeralda y Camineros Atérmicos',
    dimensions: '9.50m × 12.00m (114.0 m² de Parque y Solárium hacia el Río)',
    costo: 'Gs. 4.850.000 (Nivelación de Tierra Negra + Empastado Grama Esmeralda)',
    status: 'Jardín con Césped Esmeralda Activo ✨',
    desc: 'Parque posterior empastado con grama esmeralda paraguaya, camineros de losetas atérmicas y canteros vegetales.'
  });
  patioGroup.add(lawnGroup);

  // 3B. SISTEMA SANITARIO Y CLOACAL AUTÓNOMO EN MARGEN IZQUIERDO/OESTE DEL PATIO (Ejes 8–9: x = -3.25m, z = 14.55m..20.20m)
  //     100% libre de la huella de la Piscina proyectada (4.65m × 2.45m ubicada en x = +0.50m, centro-derecho) y con retiro > 1,50m de la medianera Oeste.
  //     Activo desde `escenario300` porque es indispensable para habitar la casa en una zona con desnivel hacia el río.
  if (scenarioKey !== 'hoy_en_obra') {
    const sewageSystemGroup = new THREE.Group();
    sewageSystemGroup.name = 'sistema_cloacal_patio_trasero';
    const sewX = -3.25;

    const pvcSewerMat = new THREE.MeshStandardMaterial({ color: 0xc2410c, roughness: 0.35, metalness: 0.10 });
    const pvcPressureMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.30, metalness: 0.15 });
    const cutConcreteMat = new THREE.MeshStandardMaterial({
      color: 0x64748b,
      roughness: 0.75,
      metalness: 0.08,
      transparent: true,
      opacity: 0.86
    });

    // 1) Cámara Desgrasadora y Cámara de Inspección Principal (0.65m × 0.65m, z = 14.55m)
    const greaseTrapGroup = new THREE.Group();
    const gtBody = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.75, 0.68), cutConcreteMat);
    gtBody.position.set(sewX, patioY - 0.26, 14.55);
    greaseTrapGroup.add(gtBody);

    const gtLid = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.06, 0.72), mats.concretePBR);
    gtLid.position.set(sewX, patioY + 0.14, 14.55);
    greaseTrapGroup.add(gtLid);

    const gtHandle = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.03, 0.04), mats.blackMetalMat);
    gtHandle.position.set(sewX, patioY + 0.18, 14.55);
    greaseTrapGroup.add(gtHandle);

    tagGroupUserData(greaseTrapGroup, {
      type: 'instalacion_cloacal',
      bankCategory: 'nuevo_rojo',
      name: 'Cámara Desgrasadora Exclusiva Cocina/Lavadero + Cámara de Inspección Principal (x = -3.25m, z = 14.55m)',
      dimensions: '0.68m × 0.68m × 0.75m prof. con Tapa Hermética de H°A° (z = 14.55m)',
      costo: 'Incluida en Red Sanitaria Primaria y Tratamiento Cloacal',
      status: 'Instalación Sanitaria Esencial Activa desde 300M 🚰',
      desc: 'Retiene jabones del Lavadero y grasas de la Cocina antes de la Cámara Séptica para que no impermeabilicen las paredes filtrantes del Pozo Ciego de ladrillo Tobatí.'
    });
    sewageSystemGroup.add(greaseTrapGroup);

    // 2) Cámara Séptica Impermeable Bicameral de H°A° (1.60m × 1.20m × 1.40m prof., z = 16.55m)
    const septicGroup = new THREE.Group();
    const septicShell = new THREE.Mesh(new THREE.BoxGeometry(1.20, 1.35, 1.60), cutConcreteMat);
    septicShell.position.set(sewX, patioY - 0.56, 16.55);
    septicGroup.add(septicShell);

    const septicTopSlab = new THREE.Mesh(new THREE.BoxGeometry(1.26, 0.08, 1.66), mats.concretePBR);
    septicTopSlab.position.set(sewX, patioY + 0.14, 16.55);
    septicGroup.add(septicTopSlab);

    // Dos tapas de inspección herméticas sobre la Cámara Séptica
    [-0.42, 0.42].forEach((sz) => {
      const manholeLid = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.05, 20), mats.blackMetalMat);
      manholeLid.position.set(sewX, patioY + 0.19, 16.55 + sz);
      septicGroup.add(manholeLid);
    });

    tagGroupUserData(septicGroup, {
      type: 'instalacion_cloacal',
      bankCategory: 'nuevo_rojo',
      name: 'Cámara Séptica Impermeable Bicameral de H°A° (1.60m × 1.20m • x = -3.25m, z = 16.55m)',
      dimensions: '1.60m × 1.20m × 1.40m prof. (Capacidad ~2.700 Litros • 2 Tapas Herméticas)',
      costo: 'Gs. 4.800.000 (Mampostería Armada Impermeabilizada con Sika-1 + Losa Tapa H°A°)',
      status: 'Tratamiento Primario de Efluentes (Sin chocar con Piscina) ♻️',
      desc: 'Cámara séptica bicameral de decantación y digestión anaeróbica ubicada en el margen izquierdo del patio (x=-3.25m, z=16.55m), dejando libre el sector central/derecho para la Piscina de 4.65×2.45m.'
    });
    sewageSystemGroup.add(septicGroup);

    // 3) Pozo Ciego Absorbente Calzado en Ladrillo Tobatí (Ø 1.80m × 3.50m prof., x = -3.25m, z = 20.20m)
    const wellGroup = new THREE.Group();
    const wellCylinder = new THREE.Mesh(
      new THREE.CylinderGeometry(0.90, 0.85, 2.20, 24),
      mats.brickPBR
    );
    wellCylinder.position.set(sewX, patioY - 0.98, 20.20);
    wellGroup.add(wellCylinder);

    const wellCapSlab = new THREE.Mesh(
      new THREE.CylinderGeometry(0.96, 0.96, 0.10, 24),
      mats.concretePBR
    );
    wellCapSlab.position.set(sewX, patioY + 0.15, 20.20);
    wellGroup.add(wellCapSlab);

    const wellInspectionPlug = new THREE.Mesh(
      new THREE.CylinderGeometry(0.28, 0.28, 0.06, 20),
      mats.blackMetalMat
    );
    wellInspectionPlug.position.set(sewX, patioY + 0.21, 20.20);
    wellGroup.add(wellInspectionPlug);

    // Caño de ventilación superior con sombrerete
    const ventPipe = new THREE.Mesh(new THREE.CylinderGeometry(0.038, 0.038, 2.10, 12), pvcSewerMat);
    ventPipe.position.set(sewX - 0.78, patioY + 1.15, 20.20);
    wellGroup.add(ventPipe);

    tagGroupUserData(wellGroup, {
      type: 'instalacion_cloacal',
      bankCategory: 'nuevo_rojo',
      name: 'Pozo Ciego Absorbente Calzado en Ladrillo Tobatí (Ø 1.80m × 3.50m prof. • x = -3.25m, z = 20.20m)',
      dimensions: 'Diámetro Ø 1.80m × 3.50m prof. • Retiro > 1.50m de Medianera y > 2.50m de Piscina',
      costo: 'Gs. 5.600.000 (Excavación + Calzado en Ladrillo + Tapa de H°A° + Ventilación)',
      status: 'Absorción Sanitaria Autónoma Auditada en Patio Trasero 🛠️',
      desc: 'Pozo absorbente calzado en mampostería de ladrillo en aparejo cribado con tapa superior de hormigón armado en x=-3.25m, z=20.20m, cumpliendo distancia reglamentaria >1.50m a medianera y >2.50m al vaso de la piscina.'
    });
    sewageSystemGroup.add(wellGroup);

    // 4) Boca de Acople Rápido p/ Manguera de Camión Cisterna Atmosférico (Desagote vía Puerta de Servicio Eje G -> Escalera Lateral 1 -> Subsuelo -> Patio, sin motor de bombeo propio)
    const suctionAccessGroup = new THREE.Group();

    // Cañería gravitatoria PVC Ø110mm entre Cámara Desgrasadora -> Cámara Séptica -> Pozo Ciego Absorbente
    const gravityPipe = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 6.20, 14), pvcSewerMat);
    gravityPipe.rotation.x = Math.PI / 2;
    gravityPipe.position.set(sewX, patioY + 0.06, 17.35);
    sewageSystemGroup.add(gravityPipe);

    // Toma rápida de bronce/acero Ø100mm (4") sobre tapa del Pozo Ciego y Cámara Séptica para manguera de succión del Camión Cisterna
    const suctionCoupling = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.09, 0.14, 16), mats.chromeMat);
    suctionCoupling.position.set(sewX, patioY + 0.28, 20.20);
    suctionAccessGroup.add(suctionCoupling);

    tagGroupUserData(suctionAccessGroup, {
      type: 'instalacion_cloacal',
      bankCategory: 'nuevo_rojo',
      name: 'Boca de Desagote Rápido Ø100mm p/ Camión Cisterna Atmosférico (Vía Escalera Lateral 1 — Sin Motor Eléctrico)',
      dimensions: 'Acople Rápido Ø 100mm (4") en Pozo Ciego + Ruta Directa ~27m por Escalera Lateral de Servicio',
      costo: 'Gs. 0 en Motor Eléctrico (Ahorra Gs. 2.600.000 — El Camión Cisterna trae su propia bomba)',
      status: 'Desagote Limpio por Escalera Lateral de Servicio sin Pisar la Vivienda ✨🚛',
      desc: 'Siguiendo el criterio práctico de Leo y la validación del Maestro Plomero, no se instala motor de bombeo cloacal eléctrico: cuando se requiera desagotar el pozo ciego o la cámara séptica, el camión cisterna utiliza su propia bomba de vacío bajando 27m de manguera por la Puerta de Servicio (Eje G) y la Escalera Lateral 1.'
    });
    sewageSystemGroup.add(suctionAccessGroup);

    patioGroup.add(sewageSystemGroup);
  }

  // 3C. PISCINA DE H°A° (4.65m × 2.45m según Plano Oficial IE-IS-IH-ISD-IAA Pág. 2) + SOLÁRIUM CON REPOSERAS
  //     Ubicada en x = +0.50m (sector central-derecho), garantizando > 2.50m de separación libre al Pozo Ciego (x = -3.25m).
  const showPoolAndQuincho = forceShowPoolQuincho || ['escenario440', 'edifica460', 'edifica573'].includes(scenarioKey);
  const poolQuinchoSubGroup = new THREE.Group();
  poolQuinchoSubGroup.name = 'pool_and_quincho_sub';
  poolQuinchoSubGroup.visible = showPoolAndQuincho;

  const poolX = 0.50;
  const poolZ = 18.80;
  const poolL = 4.65; // Largo exacto plano oficial Pág. 2
  const poolW = 2.45; // Ancho exacto plano oficial Pág. 2

  const poolGroup = new THREE.Group();

  // Solárium y Borde Perimetral Atérmico Blanco alrededor de la piscina (5.65m × 3.45m)
  const copingDeck = new THREE.Mesh(
    new THREE.BoxGeometry(poolW + 0.90, 0.12, poolL + 0.90),
    mats.ceramicSanitaryMat
  );
  copingDeck.position.set(poolX, patioY + 0.10, poolZ);
  poolGroup.add(copingDeck);

  // Interior revestido en venecita turquesa (`poolTilePBR`)
  const poolBasin = new THREE.Mesh(
    new THREE.BoxGeometry(poolW, 0.08, poolL),
    mats.poolTilePBR
  );
  poolBasin.position.set(poolX, patioY + 0.13, poolZ);
  poolGroup.add(poolBasin);

  // Escalones romanos sumergidos en el extremo Norte de la piscina
  for (let rs = 0; rs < 3; rs++) {
    const rStep = new THREE.Mesh(
      new THREE.BoxGeometry(poolW - 0.16, 0.06, 0.34),
      mats.poolTilePBR
    );
    rStep.position.set(poolX, patioY + 0.15 - rs * 0.02, poolZ - poolL / 2 + 0.22 + rs * 0.32);
    poolGroup.add(rStep);
  }

  // Espejo de agua turquesa cristalino reflectivo (`poolWaterMat`)
  const waterSurface = new THREE.Mesh(
    new THREE.BoxGeometry(poolW - 0.06, 0.04, poolL - 0.06),
    mats.poolWaterMat
  );
  waterSurface.position.set(poolX, patioY + 0.165, poolZ);
  poolGroup.add(waterSurface);

  // 2 Luminarias LED subacuáticas cian
  [-0.95, 0.95].forEach((lz) => {
    const poolLight = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.08, 0.03, 16),
      mats.ledPoolCyanMat
    );
    poolLight.rotation.z = Math.PI / 2;
    poolLight.position.set(poolX + poolW / 2 - 0.05, patioY + 0.14, poolZ + lz);
    poolGroup.add(poolLight);
  });

  // Deck Solárium de Madera Lapacho con 2 Reposeras al Sur de la Piscina mirando al Río (z = 22.35m)
  const solariumDeck = new THREE.Mesh(
    new THREE.BoxGeometry(poolW + 0.90, 0.08, 1.85),
    mats.woodDeckPBR
  );
  solariumDeck.position.set(poolX, patioY + 0.09, poolZ + poolL / 2 + 1.40);
  poolGroup.add(solariumDeck);

  [-0.65, 0.65].forEach((lx) => {
    const loungerBase = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.22, 1.65), mats.woodDeckPBR);
    loungerBase.position.set(poolX + lx, patioY + 0.22, poolZ + poolL / 2 + 1.40);
    poolGroup.add(loungerBase);

    const loungerPad = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.07, 1.58), mats.bedSheetMat);
    loungerPad.position.set(poolX + lx, patioY + 0.36, poolZ + poolL / 2 + 1.40);
    poolGroup.add(loungerPad);
  });

  tagGroupUserData(poolGroup, {
    type: 'piscina_planificada',
    bankCategory: 'nuevo_rojo',
    name: 'Piscina de H°A° (4.65m × 2.45m según Plano Oficial Pág. 2) + Solárium Mirador al Río',
    dimensions: '4.65m × 2.45m (11.40 m² Espejo de Agua + Borde Atérmico y Deck Solárium Sur)',
    costo: 'Gs. 34.500.000 (Vaso H°A° + Venecita + Filtro + Borde Atérmico + Luces LED)',
    status: 'Planificación de Patio y Recreación (Cero Colisión con Pozo Ciego y Cámara Séptica) ✨',
    desc: 'Piscina proyectada en el plano oficial de instalaciones (Lámina Pág. 2) desplazada al eje central-derecho (x=-0.35m), dejando el margen izquierdo libre para la Cámara Séptica, el Pozo Ciego Absorbente y la Cámara de Bombeo.'
  });
  poolQuinchoSubGroup.add(poolGroup);

  // 3D. QUINCHO SEMICUBIERTO EN EL JARDÍN (`x = +2.85m`, `z = 17.60m`)
  const quinchoGroup = new THREE.Group();
  const qX = 2.85;
  const qZ = 17.60;
  const qW = 3.20;
  const qD = 4.40;
  const qH = 2.65;

  // Plataforma de piso de madera Lapacho / porcelanato del Quincho
  const qFloor = new THREE.Mesh(new THREE.BoxGeometry(qW, 0.10, qD), mats.woodDeckPBR);
  qFloor.position.set(qX, patioY + 0.09, qZ);
  quinchoGroup.add(qFloor);

  // 4 Columnas pergoladas de acero negro y madera + Viga perimetral + Pérgola de listones de Lapacho
  [[-qW / 2 + 0.15, -qD / 2 + 0.15], [qW / 2 - 0.15, -qD / 2 + 0.15], [-qW / 2 + 0.15, qD / 2 - 0.15], [qW / 2 - 0.15, qD / 2 - 0.15]].forEach(([cx, cz]) => {
    const col = new THREE.Mesh(new THREE.BoxGeometry(0.14, qH, 0.14), mats.blackMetalMat);
    col.position.set(qX + cx, patioY + qH / 2 + 0.10, qZ + cz);
    quinchoGroup.add(col);
  });

  // Vigas perimetrales y 9 cabios de madera Lapacho de la pérgola del Quincho
  const pergolaRing = new THREE.Mesh(new THREE.BoxGeometry(qW, 0.16, qD), mats.blackMetalMat);
  pergolaRing.position.set(qX, patioY + qH + 0.12, qZ);
  quinchoGroup.add(pergolaRing);

  for (let b = -4; b <= 4; b++) {
    const beam = new THREE.Mesh(new THREE.BoxGeometry(qW + 0.25, 0.12, 0.08), mats.woodDeckPBR);
    beam.position.set(qX, patioY + qH + 0.24, qZ + b * 0.46);
    quinchoGroup.add(beam);
  }

  // Barra desayunadora y mesada de granito con bacha en el Quincho
  const qBarBase = new THREE.Mesh(new THREE.BoxGeometry(0.60, 0.92, 2.60), mats.stoneWallPBR);
  qBarBase.position.set(qX + qW / 2 - 0.40, patioY + 0.56, qZ);
  quinchoGroup.add(qBarBase);

  const qBarTop = new THREE.Mesh(new THREE.BoxGeometry(0.70, 0.045, 2.70), mats.granitePBR);
  qBarTop.position.set(qX + qW / 2 - 0.40, patioY + 1.04, qZ);
  quinchoGroup.add(qBarTop);

  // Mesa de Quincho para 6 personas frente a la Piscina
  const qTable = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.76, 2.10), mats.woodDeckPBR);
  qTable.position.set(qX - 0.40, patioY + 0.48, qZ);
  quinchoGroup.add(qTable);

  tagGroupUserData(quinchoGroup, {
    type: 'quincho_jardin',
    bankCategory: 'nuevo_rojo',
    name: 'Quincho Semicubierto Pergolado en Jardín junto a la Piscina',
    dimensions: '3.20m × 4.40m (14.08 m²) • Pérgola en Lapacho + Barra de Granito y Mesa',
    costo: 'Gs. 16.800.000 (Estructura Pergolada + Deck + Mesada Granito con Bacha)',
    status: 'Planificación de Quincho y Piscina ✨',
    desc: 'Quincho exterior semicubierto en el jardín posterior, integrado directamente con la Piscina de 4.65×2.45m y con la salida del Subsuelo.'
  });
  poolQuinchoSubGroup.add(quinchoGroup);

  patioGroup.add(poolQuinchoSubGroup);
  targetGroup.add(patioGroup);
  return { patioGroup, poolQuinchoSubGroup };
}

/**
 * 4. DETALLE INTERIOR MINUCIOSO EN TODOS LOS AMBIENTES Y NIVELES (`buildHyperRealisticInterior3D`)
 */
export function buildHyperRealisticInterior3D(THREE, groups, mats, scenarioKey = 'escenario300', forceShowPoolQuincho = false) {
  groups.archMain.clear();
  groups.archSubsuelo.clear();

  // En `'hoy_en_obra'` solo se muestra el esqueleto H°A° real ejecutado hoy (0 muros)
  if (scenarioKey === 'hoy_en_obra') {
    return null;
  }

  const isBase300 = scenarioKey === 'escenario300';
  const isAtLeast350 = ['escenario350', 'escenario370', 'escenario440', 'edifica460', 'edifica573'].includes(scenarioKey);
  const isAtLeast440 = ['escenario440', 'edifica460', 'edifica573'].includes(scenarioKey);

  const extWallMat = isBase300 ? mats.plasterRoughPBR : mats.plasterExteriorPBR;
  const intWallMat = isBase300 ? mats.plasterRoughPBR : mats.plasterPBR;

  const addWallSegment = (targetGrp, x1, z1, x2, z2, baseY, height, thickness, mat, name, desc, costo = 'Incluido en Cerramiento Habitable') => {
    const len = Math.hypot(x2 - x1, z2 - z1);
    if (len < 0.05) return;
    const geo = new THREE.BoxGeometry(len, height, thickness);
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set((x1 + x2) / 2, baseY + height / 2, (z1 + z2) / 2);
    mesh.rotation.y = -Math.atan2(z2 - z1, x2 - x1);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.userData = {
      type: 'muro_arquitectonico',
      name,
      dimensions: `L=${len.toFixed(2)}m × H=${height.toFixed(2)}m • Esp. ${(thickness * 100).toFixed(0)}cm`,
      costo,
      status: isBase300
        ? 'Muro Cerrado y Revocado para Habitar (Ruth y Leo) 🎯'
        : 'Muro Revocado, Enduido y Pintado al Látex Marfil ✨',
      desc
    };
    targetGrp.add(mesh);
    return mesh;
  };

  // ============================================================================
  // A. PISOS TERMINADOS POR NIVEL SEGÚN PRESUPUESTO (3 NIVELES ACTIVOS DESDE EL DÍA 1)
  // ============================================================================
  // A1. Planta a Nivel de Calle (Y = 0.00m / Cota +100.00m): Gran Planta Social Abierta (Sala, Comedor, Cocina y Toilette)
  const pbFloor = new THREE.Mesh(
    new THREE.BoxGeometry(9.54, 0.03, 6.84),
    isAtLeast350 ? mats.porcelainPBR : mats.plasterRoughPBR
  );
  pbFloor.position.set(0, 0.015, (3.00 + 9.94) / 2);
  pbFloor.receiveShadow = true;
  pbFloor.userData = {
    type: 'piso_terminado',
    name: isAtLeast350
      ? 'Piso Porcelanato Rectificado 60×60cm en Planta Social a Nivel de Calle + Zócalos'
      : 'Carpeta Hidrófuga Alisada + Cerámico en Cocina y Toilette (Base 300M)',
    dimensions: '9.54m × 6.84m (65.2 m² de Gran Planta Social Abierta sin tabiques de dormitorios)',
    costo: isAtLeast350 ? 'Gs. 38.497.000 (Porcelanato 60×60 Completo)' : 'Gs. 14.200.000 (Base Habitable)',
    status: isAtLeast350 ? 'Porcelanato 60×60 Pulido Instalado ✨' : 'Habitable Etapa Inicial 🎯',
    desc: 'Solado interior a Nivel de Calle (Cota +100.00m) entre Eje G y Eje B: al estar el Dormitorio en Suite y el Estudio arriba en el 2do Piso (+2.88m), toda esta planta queda libre como un gran salón social de Sala, Comedor de 6 sillas, Cocina integrada y Toilette.'
  };
  groups.archMain.add(pbFloor);

  if (isBase300) {
    const wetCoreFloorPB = new THREE.Mesh(
      new THREE.BoxGeometry(3.20, 0.035, 4.35),
      mats.porcelainPBR
    );
    wetCoreFloorPB.position.set(-3.25, 0.018, 5.18);
    wetCoreFloorPB.userData = {
      type: 'piso_terminado',
      name: 'Piso Cerámico / Porcelanato Impermeable en Cocina y Toilette Social PB (Incluido en 300M)',
      dimensions: '3.20m × 4.35m (13.9 m²)',
      status: 'Incluido en Habitabilidad Básica 300M ✨',
      desc: 'Revestimiento impermeable en el sector de Cocina y Toilette Social de la Planta a Nivel de Calle.'
    };
    groups.archMain.add(wetCoreFloorPB);
  }

  // A2. Galería Panorámica al Río (Losa L1 en Y = -0.45m / Cota +99.55m)
  const galFloor = new THREE.Mesh(
    new THREE.BoxGeometry(9.64, 0.04, 3.32),
    isAtLeast350 ? mats.woodDeckPBR : mats.concretePBR
  );
  galFloor.position.set(0, -0.45 + 0.02, (9.94 + 13.34) / 2);
  galFloor.receiveShadow = true;
  galFloor.userData = {
    type: 'piso_terminado',
    name: isAtLeast350
      ? 'Deck de Madera Lapacho en Galería Panorámica al Río (Losa L1)'
      : 'Losa L1 de Galería Alisada con Pendiente Pluvial (Base 300M)',
    dimensions: '9.64m × 3.32m (32.0 m² • Cota +99.55m / Y=-0.45m)',
    status: isAtLeast350 ? 'Deck de Madera Lapacho ✨' : 'Galería Operativa 🎯',
    desc: 'Solado de la Galería sobre la Losa L1 rebajada -0.45m con vista al Río Paraguay.'
  };
  groups.archMain.add(galFloor);

  for (let s = 0; s < 3; s++) {
    const stepGal = new THREE.Mesh(
      new THREE.BoxGeometry(3.60, 0.15, 0.32),
      isAtLeast350 ? mats.porcelainPBR : mats.concretePBR
    );
    stepGal.position.set(1.15, -0.075 - s * 0.15, 9.94 + 0.16 + s * 0.32);
    stepGal.userData = {
      type: 'estructura_arquitectura',
      name: 'Escalones de Transición Gran Sala → Galería (Salva Desnivel -0.45m en Eje B)',
      dimensions: 'Ancho 3.60m × 3 Peldaños de 15cm',
      status: 'Transición Interior / Galería ✨',
      desc: 'Tres peldaños amplios sobre el Eje B (z=9.94m) que conectan la Gran Sala/Comedor (+100.00m) con la Galería (+99.55m).'
    };
    groups.archMain.add(stepGal);
  }

  // A3. Subsuelo Real de 100,71 m² Libres bajo toda la Primera Losa (Y = -2.34m / Cota +97.66m, de Eje G z=3.00m a Eje A z=13.34m)
  const subFloor = new THREE.Mesh(
    new THREE.BoxGeometry(9.54, 0.03, 10.24),
    isAtLeast440 ? mats.porcelainSubsueloPBR : mats.concretePBR
  );
  subFloor.position.set(0, -2.34 + 0.02, (3.00 + 13.34) / 2);
  subFloor.receiveShadow = true;
  subFloor.userData = {
    type: 'piso_subsuelo',
    name: isAtLeast440
      ? 'Piso Porcelanato Completo en los 100,71 m² del Subsuelo (Lavadero, Depósito y Planta Libre / Depto.)'
      : 'Piso Alisado Impermeabilizado en los 100,71 m² Libres bajo toda la Primera Losa (Lavadero + Depósito desde 300M)',
    dimensions: '9.74m × 10.34m (100,71 m² libres entre Eje G z=3.00m y Eje A z=13.34m • Cota +97.66m / Y=-2.34m)',
    status: isAtLeast440 ? 'Subsuelo 100,71 m² Terminado en Porcelanato ✨' : '100,71 m² Libres con Lavadero y Depósito Operativos 🎯',
    desc: 'Los 100,71 m² debajo de toda la primera losa están 100% libres y aprovechables en Y=-2.34m, protegidos adelante por el Pasillo Cámara de Aire Antihumedad (z=+1.50m a +3.00m) y el Muro de Contención del Estacionamiento en z=+1.50m.'
  };
  groups.archSubsuelo.add(subFloor);

  // ============================================================================
  // B. PLANTA A NIVEL DE CALLE (Y = 0.00m): FACHADA EJE G (z = 3.00m), GRAN SALA ABIERTA, COCINA Y TOILETTE
  // ============================================================================
  const hPB = 2.82;

  addWallSegment(
    groups.archMain,
    -4.87, 3.00, -4.87, 9.94,
    0.00, hPB, 0.20, extWallMat,
    'Muro Medianero Oeste Nivel Calle (Eje 9 • x = -4.87m)',
    'Cerramiento portante/acústico de 20cm sobre Eje 9 con impermeabilización hidrófuga exterior.'
  );

  addWallSegment(
    groups.archMain,
    4.87, 3.00, 4.87, 9.94,
    0.00, hPB, 0.20, extWallMat,
    'Muro Medianero Este Nivel Calle (Eje 1 • x = +4.87m)',
    'Cerramiento lateral derecho sobre Eje 1 que protege el núcleo de la Escalera 1.'
  );

  // Tramo Oeste de Fachada Eje G: Cocina (x = -4.87m a +0.02m) con ventana horizontal sobre bacha de cocina
  addWallSegment(
    groups.archMain,
    -4.87, 3.00, 0.02, 3.00,
    0.00, 1.05, 0.20, extWallMat,
    'Muro Frontal Eje G — Bajo Mesada Cocina (z = 3.00m)',
    'Muro frontal en el sector de cocina.'
  );
  groups.archMain.add(
    createBlindexWindow3D(
      THREE, mats, -2.65, 1.55, 3.00, 2.10, 0.95, 0,
      'Ventana Corrediza Blindex sobre Mesada de Cocina (Fachada Eje G)',
      'Ventana corrediza de vidrio templado Blindex sobre la bacha de la cocina mirando hacia el acceso.'
    )
  );
  addWallSegment(
    groups.archMain,
    -4.87, 3.00, 0.02, 3.00,
    2.02, 0.80, 0.20, extWallMat,
    'Dintel Frontal Eje G — Sector Cocina (z = 3.00m)',
    'Dintel superior sobre la ventana de cocina.'
  );

  // 1) PUERTA PRINCIPAL JERARQUIZADA en x = +0.85m, z = 3.00m (entre P14 x=-1.64m y P10 x=+1.69m)
  const mainDoor = createWoodenDoor3D(
    THREE,
    mats,
    0.85,
    0.00,
    3.00,
    1.10,
    2.20,
    0,
    0.38,
    'Puerta Principal Jerarquizada en Madera Maciza Lapacho (x = +0.85m, Eje G • Entre P14 y P10)',
    {
      type: 'puerta_principal',
      hasSidelight: true,
      longPullBar: true,
      dimensionsExtra: 'Pivotante 1.10×2.20m + Paño Fijo Vidrio 0.32m + Manijón Inox 1.20m',
      costo: 'Gs. 4.850.000 (Puerta Principal Maciza Pivotante + Cerradura Multianclaje)',
      status: 'Acceso Social Principal a la Gran Sala y Comedor de Ruth y Leo ✨',
      desc: 'Ubicada sobre el Eje G (z=3.00m, x=+0.85m entre los pilares P14 y P10). Da ingreso jerarquizado directamente a la Gran Sala Social, Comedor y Cocina integrada.'
    }
  );
  groups.archMain.add(mainDoor);

  // Ventanal Frontal del Estar entre la Puerta Principal y el Eje 2 (x = +1.45m a +3.84m, z = 3.00m)
  addWallSegment(
    groups.archMain,
    1.45, 3.00, 3.84, 3.00,
    0.00, 0.85, 0.20, extWallMat,
    'Antepecho Frontal Gran Sala Social (Eje G • x = +1.45m a +3.84m)',
    'Muro bajo ventana frontal del Estar Social.'
  );
  groups.archMain.add(
    createBlindexWindow3D(
      THREE, mats, 2.64, 1.78, 3.00, 2.34, 1.85, 0,
      'Ventanal Frontal Blindex Templado 10mm — Gran Sala Social (Eje G)',
      'Ventanal corredizo Blindex con carpintería de aluminio negro junto a la Puerta Principal.'
    )
  );

  // 2) PUERTA DE SERVICIO INDEPENDIENTE en x = +4.35m, z = 3.00m (entre P7 en x=3.84m y P4 en x=4.87m, alineada con Escalera 1)
  const serviceDoor = createWoodenDoor3D(
    THREE,
    mats,
    4.355,
    0.00,
    3.00,
    0.85,
    2.10,
    0,
    0.45,
    'Puerta de Servicio y Circulación Vertical (x = +4.35m, Eje G • Entre P7 y P4)',
    {
      type: 'puerta_servicio',
      isServiceDoor: true,
      dimensionsExtra: '0.85×2.10m + Reja Exterior • Conecta directo con Escalera 1 (2do Piso y Subsuelo)',
      costo: 'Gs. 2.350.000 (Puerta de Servicio Reforzada + Reja Protectora)',
      status: 'Acceso Directo a Escalera 1 (Subsuelo Lavadero/Depósito y 2do Piso) ✨',
      desc: 'Ubicada entre P7 (x=3.84m) y P4 (x=4.87m) sobre Eje G (z=3.00m), alineada con la Escalera 1 que comunica con el Lavadero/Depósito en Subsuelo (-2.34m) y el Dormitorio en Suite en 2do Piso (+2.88m).'
    }
  );
  groups.archMain.add(serviceDoor);

  // Dintel sobre Puerta Principal y Puerta de Servicio
  addWallSegment(
    groups.archMain,
    0.02, 3.00, 4.87, 3.00,
    2.22, 0.60, 0.20, extWallMat,
    'Viga Dintel Frontal sobre Puerta Principal y Puerta de Servicio (Eje G)',
    'Cierre superior de mampostería sobre los vanos de acceso en Eje G.'
  );

  // Toilette Social Compacto en Planta a Nivel de Calle (x = -4.87m a -3.10m, z = 5.85m a 7.37m)
  // Deja todo el resto de la planta (x = -3.10m a +3.84m, z = 3.00m a 9.94m) como un GRAN SALÓN SOCIAL ABIERTO
  addWallSegment(
    groups.archMain,
    -4.87, 5.85, -3.10, 5.85,
    0.00, hPB, 0.15, intWallMat,
    'Muro Divisorio Cocina / Toilette Social (z = 5.85m)',
    'Muro sanitario interno que aloja las cañerías de agua fría/caliente entre la Cocina y el Toilette Social de PB.'
  );
  addWallSegment(
    groups.archMain,
    -4.87, 7.37, -3.10, 7.37,
    0.00, hPB, 0.15, intWallMat,
    'Muro Sur Toilette Social PB (Eje C • z = 7.37m)',
    'Cierre del Toilette Social liberando el sector Oeste hacia el ventanal del Río.'
  );
  addWallSegment(
    groups.archMain,
    -3.10, 5.85, -3.10, 6.22,
    0.00, hPB, 0.15, intWallMat,
    'Mocheta Norte Toilette Social PB (x = -3.10m)',
    'Cerramiento lateral del Toilette Social.'
  );
  addWallSegment(
    groups.archMain,
    -3.10, 7.00, -3.10, 7.37,
    0.00, hPB, 0.15, intWallMat,
    'Mocheta Sur Toilette Social PB (x = -3.10m)',
    'Cerramiento lateral del Toilette Social.'
  );
  groups.archMain.add(
    createWoodenDoor3D(
      THREE, mats, -3.10, 0.00, 6.61, 0.76, 2.10, Math.PI / 2, 0.50,
      'Puerta de Madera — Toilette Social de Recepción (Nivel Calle)'
    )
  );
  groups.archMain.add(createToilet3D(THREE, mats, -4.15, 0.03, 6.25, 0, 'Toilette Social Nivel Calle'));
  groups.archMain.add(createVanity3D(THREE, mats, -4.05, 0.03, 7.08, 0.80, Math.PI, 'Toilette Social Nivel Calle'));

  // Tabique de Caja de Escalera en Eje 2 (x = +3.84m)
  addWallSegment(
    groups.archMain,
    3.84, 3.85, 3.84, 5.26,
    0.00, hPB, 0.15, intWallMat,
    'Tabique Lateral Caja de Escalera Eje 2 (x = +3.84m)',
    'Acompaña el arranque de la Escalera 1 hacia el 2do Piso (+2.88m) y el descenso al Subsuelo (-2.34m).'
  );

  // Gran Ventanal Panorámico Blindex de Punta a Punta en Eje B (z = 9.94m): Gran Sala y Comedor integrados con la Galería al Río
  addWallSegment(
    groups.archMain,
    -4.87, 9.94, -4.15, 9.94,
    0.00, hPB, 0.20, extWallMat,
    'Mocheta Oeste Eje B (z = 9.94m)',
    'Mocheta de cierre sobre Eje B junto al pilar P18.'
  );
  groups.archMain.add(
    createBlindexWindow3D(
      THREE, mats, -2.55, 1.225, 9.94, 3.10, 2.45, 0,
      'Ventanal Corredizo Blindex 10mm — Sector Oeste Gran Sala / Comedor hacia Galería (Eje B)',
      'Ventanal corredizo Blindex de piso a dintel que abre toda la visual Oeste del salón social hacia la Galería y el Río Paraguay.'
    )
  );
  groups.archMain.add(
    createBlindexWindow3D(
      THREE, mats, 1.40, 1.225, 9.94, 4.80, 2.45, 0,
      'Gran Ventanal Panorámico Blindex 4 Hojas — Sala de Estar y Comedor hacia Galería (Eje B)',
      'Cerramiento vidriado corredizo de 4 hojas sobre el Eje B (z=9.94m) que integra la Gran Sala de Estar y Comedor con la Galería al Río.'
    )
  );

  // ============================================================================
  // C. COCINA AMPLIA E INTEGRADA EN NIVEL CALLE (Y = 0.00m): MUEBLES PROPIOS DE RUTH Y LEO vs. A PRESUPUESTAR
  // ============================================================================
  const kitchenEssentialGroup = new THREE.Group();
  const baseCabFront = new THREE.Mesh(new THREE.BoxGeometry(1.95, 0.84, 0.60), mats.woodDeckPBR);
  baseCabFront.position.set(-2.95, 0.44, 3.42);
  kitchenEssentialGroup.add(baseCabFront);

  const graniteTopFront = new THREE.Mesh(new THREE.BoxGeometry(2.00, 0.04, 0.64), mats.granitePBR);
  graniteTopFront.position.set(-2.95, 0.88, 3.42);
  kitchenEssentialGroup.add(graniteTopFront);

  const sinkBasin = new THREE.Mesh(new THREE.BoxGeometry(0.76, 0.025, 0.44), mats.stainlessMat);
  sinkBasin.position.set(-3.15, 0.905, 3.42);
  kitchenEssentialGroup.add(sinkBasin);

  const kitchenTap = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.34, 12), mats.chromeMat);
  kitchenTap.position.set(-3.15, 1.06, 3.22);
  kitchenEssentialGroup.add(kitchenTap);

  const kitchenSpout = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.02, 0.18), mats.chromeMat);
  kitchenSpout.position.set(-3.15, 1.22, 3.30);
  kitchenEssentialGroup.add(kitchenSpout);

  tagGroupUserData(kitchenEssentialGroup, {
    type: 'equipamiento_cocina',
    name: 'Mesada Húmeda de Granito con Bacha Doble Inox y Grifería Monocomando (Incluida desde 300M)',
    dimensions: '2.00m × 0.64m × 0.90m • Agua Fría/Caliente y Desagüe Sifonado',
    costo: 'Incluida en Núcleo Básico de Habitabilidad (300M)',
    status: 'Núcleo Básico de Habitabilidad Operativo ✨',
    desc: 'Mesada húmeda principal de granito con bacha doble de acero inoxidable y grifería mezcladora bajo la ventana frontal.'
  });
  groups.archMain.add(kitchenEssentialGroup);

  // 1) 1 Cocina con Garrafa (Propia de Ruth y Leo — Gs. 0)
  const stoveWithGasGroup = new THREE.Group();
  const stoveBody = new THREE.Mesh(new THREE.BoxGeometry(0.60, 0.86, 0.56), mats.ceramicSanitaryMat);
  stoveBody.position.set(-4.42, 0.45, 3.92);
  stoveWithGasGroup.add(stoveBody);

  const stoveTop = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.02, 0.54), mats.blackMetalMat);
  stoveTop.position.set(-4.42, 0.89, 3.92);
  stoveWithGasGroup.add(stoveTop);

  [[-0.12, -0.13], [0.12, -0.13], [-0.12, 0.13], [0.12, 0.13]].forEach(([bx, bz]) => {
    const burner = new THREE.Mesh(
      new THREE.CylinderGeometry(0.055, 0.055, 0.015, 16),
      mats.blackMetalMat
    );
    burner.position.set(-4.42 + bx, 0.91, 3.92 + bz);
    stoveWithGasGroup.add(burner);
  });

  const ovenGlass = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.44, 0.44), mats.blackMetalMat);
  ovenGlass.position.set(-4.11, 0.44, 3.92);
  stoveWithGasGroup.add(ovenGlass);

  // Nicho Exterior Ventilado p/ Garrafa GLP 13kg sobre Eje G (x = -4.45m, z = 2.78m) + Cañería de Cobre y Llave de Paso (Auditoría Arq. Interior y Seguridad)
  const lpgCabinet = new THREE.Mesh(
    new THREE.BoxGeometry(0.52, 0.78, 0.42),
    mats.blackMetalMat
  );
  lpgCabinet.position.set(-4.45, 0.39, 2.74);
  stoveWithGasGroup.add(lpgCabinet);

  const gasCylinder = new THREE.Mesh(
    new THREE.CylinderGeometry(0.16, 0.16, 0.52, 20),
    new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.45, metalness: 0.35 })
  );
  gasCylinder.position.set(-4.45, 0.28, 2.78);
  stoveWithGasGroup.add(gasCylinder);

  const gasCollar = new THREE.Mesh(
    new THREE.CylinderGeometry(0.11, 0.11, 0.10, 16),
    new THREE.MeshStandardMaterial({ color: 0x0369a1, roughness: 0.45, metalness: 0.35 })
  );
  gasCollar.position.set(-4.45, 0.58, 2.78);
  stoveWithGasGroup.add(gasCollar);

  const gasRegulator = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.04, 12), mats.chromeMat);
  gasRegulator.position.set(-4.45, 0.64, 2.78);
  stoveWithGasGroup.add(gasRegulator);

  // Campana Extractora de Humos Inox c/ Salida al Exterior activa desde 300M (protege la Gran Sala y la Biblioteca de 8ml de libros)
  const hoodEssential = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.12, 0.58), mats.stainlessMat);
  hoodEssential.position.set(-4.42, 1.66, 3.92);
  stoveWithGasGroup.add(hoodEssential);

  const hoodDuct = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.85, 0.20), mats.stainlessMat);
  hoodDuct.position.set(-4.58, 2.14, 3.92);
  stoveWithGasGroup.add(hoodDuct);

  tagGroupUserData(stoveWithGasGroup, {
    type: 'electrodomestico_propio',
    name: '1 Cocina a Gas (Propia Ruth y Leo) + Campana Extractora al Exterior y Nicho Exterior Ventilado GLP (Eje G z=2.78m)',
    dimensions: 'Cocina 0.56×0.60×0.86m + Campana Inox c/ Ducto Exterior + Nicho Exterior Garrafa GLP 13kg',
    costo: 'Cocina Gs. 0 (Propia) • Campana + Nicho Exterior GLP: Gs. 2.150.000 (Auditoría Arq. Interior)',
    status: 'Cocina Segura con Garrafa Exterior Ventilada y Extracción de Humos 🛡️📦',
    desc: 'Cocina propia de Ruth y Leo alimentada por caño de cobre desde el nicho metálico ventilado en el exterior de Eje G (z=2.78m), con campana extractora al exterior para no ahumar la Gran Sala ni la Biblioteca.'
  });
  groups.archMain.add(stoveWithGasGroup);

  // 2) 1 Heladera (Propia de Ruth y Leo — Gs. 0)
  const fridgeGroup = new THREE.Group();
  const fridgeBody = new THREE.Mesh(new THREE.BoxGeometry(0.68, 1.75, 0.65), mats.stainlessMat);
  fridgeBody.position.set(-4.42, 0.90, 5.25);
  fridgeGroup.add(fridgeBody);

  const fridgeHandleTop = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.32, 10), mats.chromeMat);
  fridgeHandleTop.position.set(-4.06, 1.48, 5.47);
  fridgeGroup.add(fridgeHandleTop);

  const fridgeHandleBot = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.68, 10), mats.chromeMat);
  fridgeHandleBot.position.set(-4.06, 0.82, 5.47);
  fridgeGroup.add(fridgeHandleBot);

  tagGroupUserData(fridgeGroup, {
    type: 'electrodomestico_propio',
    name: '1 Heladera con Freezer (Inventario Propio Ruth y Leo)',
    dimensions: '0.65m × 0.68m × 1.75m • Ubicada en Sector Cocina Nivel Calle',
    costo: 'Gs. 0 (Propio de Ruth y Leo — A trasladar)',
    status: 'Propio del Propietario (Gs. 0 — A trasladar) 📦',
    desc: 'Heladera propia de Ruth y Leo trasladada en la mudanza, con toma eléctrica dedicada.'
  });
  groups.archMain.add(fridgeGroup);

  // 3) 1 Mueble de cocina para microondas, horno y guardar pequeñas cosas + 1 Microondas (Propios de Ruth y Leo — Gs. 0)
  const mwRackGroup = new THREE.Group();
  const rackX = -4.48;
  const rackZ = 4.55;
  const rackLower = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.72, 0.75), mats.woodDeckPBR);
  rackLower.position.set(rackX, 0.38, rackZ);
  mwRackGroup.add(rackLower);

  [-0.35, 0.35].forEach((rz) => {
    const rackPost = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.98, 0.03), mats.woodDeckPBR);
    rackPost.position.set(rackX, 1.23, rackZ + rz);
    mwRackGroup.add(rackPost);
  });
  [1.18, 1.68].forEach((ry) => {
    const shelf = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.03, 0.75), mats.woodDeckPBR);
    shelf.position.set(rackX, ry, rackZ);
    mwRackGroup.add(shelf);
  });

  const mwBody = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.28, 0.48), mats.ceramicSanitaryMat);
  mwBody.position.set(rackX + 0.02, 0.90, rackZ);
  mwRackGroup.add(mwBody);

  const mwWindow = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.20, 0.32), mats.blackMetalMat);
  mwWindow.position.set(rackX + 0.205, 0.90, rackZ - 0.05);
  mwRackGroup.add(mwWindow);

  tagGroupUserData(mwRackGroup, {
    type: 'mobiliario_propio',
    name: '1 Mueble de Cocina para Microondas, Horno y Guardar Pequeñas Cosas + 1 Microondas (Inventario Propio Ruth y Leo)',
    dimensions: 'Mueble Organizador 0.75m × 0.45m × 1.70m + Microondas 0.48m × 0.36m × 0.28m',
    costo: 'Gs. 0 (Propio de Ruth y Leo — A trasladar)',
    status: 'Propio del Propietario (Gs. 0 — A trasladar) 📦',
    desc: 'Mueble organizador vertical de cocina con espacio de guardado para pequeñas cosas, nicho para horno y el microondas propio de Ruth y Leo instalado en el estante principal.'
  });
  groups.archMain.add(mwRackGroup);

  // 4) 1 Air Fryer de 6L Xiaomi (Propia de Ruth y Leo — Gs. 0) sobre la mesada
  const airFryerGroup = new THREE.Group();
  const afX = -2.32;
  const afZ = 3.42;
  const afBody = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.30, 0.32), mats.ceramicSanitaryMat);
  afBody.position.set(afX, 1.05, afZ);
  airFryerGroup.add(afBody);

  const afBasketLine = new THREE.Mesh(new THREE.BoxGeometry(0.285, 0.008, 0.325), mats.blackMetalMat);
  afBasketLine.position.set(afX, 1.02, afZ);
  airFryerGroup.add(afBasketLine);

  const afHandle = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.11, 0.06), mats.ceramicSanitaryMat);
  afHandle.position.set(afX, 0.98, afZ + 0.17);
  airFryerGroup.add(afHandle);

  const afOledDial = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.032, 0.02, 16), mats.blackMetalMat);
  afOledDial.rotation.x = Math.PI / 2;
  afOledDial.position.set(afX, 1.12, afZ + 0.165);
  airFryerGroup.add(afOledDial);

  tagGroupUserData(airFryerGroup, {
    type: 'electrodomestico_propio',
    name: '1 Air Fryer de 6L Xiaomi con Dial OLED (Inventario Propio Ruth y Leo)',
    dimensions: '0.28m × 0.32m × 0.30m • Capacidad 6 Litros sobre Mesada',
    costo: 'Gs. 0 (Propio de Ruth y Leo — A trasladar)',
    status: 'Propio del Propietario (Gs. 0 — A trasladar) 📦',
    desc: 'Freidora de aire inteligente Xiaomi de 6 litros blanca minimalista con pantalla OLED circular, ya perteneciente al equipamiento de Ruth y Leo.'
  });
  groups.archMain.add(airFryerGroup);

  // ADICIONAL CLAVE A PRESUPUESTAR EN COCINA: Amoblamiento Bajo-Mesada Completo, Alacenas Superiores e Isla Desayunadora
  if (isAtLeast350) {
    const budgetedKitchenGroup = new THREE.Group();

    const upperCabFront = new THREE.Mesh(new THREE.BoxGeometry(1.95, 0.68, 0.36), mats.woodDeckPBR);
    upperCabFront.position.set(-2.95, 2.05, 3.28);
    budgetedKitchenGroup.add(upperCabFront);

    const upperCabWest = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.68, 2.15), mats.woodDeckPBR);
    upperCabWest.position.set(-4.58, 2.05, 4.40);
    budgetedKitchenGroup.add(upperCabWest);

    const hoodBase = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.08, 0.58), mats.stainlessMat);
    hoodBase.position.set(-4.42, 1.68, 3.92);
    budgetedKitchenGroup.add(hoodBase);

    const islandBase = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.90, 2.10), mats.woodDeckPBR);
    islandBase.position.set(-2.15, 0.47, 4.65);
    budgetedKitchenGroup.add(islandBase);

    const islandTop = new THREE.Mesh(new THREE.BoxGeometry(1.00, 0.045, 2.20), mats.granitePBR);
    islandTop.position.set(-2.10, 0.94, 4.65);
    budgetedKitchenGroup.add(islandTop);

    [-0.65, 0.0, 0.65].forEach((oz) => {
      const cord = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.005, 0.85, 8), mats.blackMetalMat);
      cord.position.set(-2.10, 2.35, 4.65 + oz);
      budgetedKitchenGroup.add(cord);

      const pendant = new THREE.Mesh(new THREE.SphereGeometry(0.09, 16, 16), mats.ledWarmMat);
      pendant.position.set(-2.10, 1.90, 4.65 + oz);
      budgetedKitchenGroup.add(pendant);
    });

    tagGroupUserData(budgetedKitchenGroup, {
      type: 'adicional_a_presupuestar',
      name: 'Amoblamiento de Cocina Bajo-Mesada, Alacenas Superiores e Isla (Adicional Clave a Presupuestar)',
      dimensions: 'Alacenas a Medida + Bajo-Mesada + Isla Desayunadora de Granito 2.20m × 1.00m',
      costo: 'Gs. 17.543.750 (A Presupuestar — No incluido en mudanza actual)',
      status: 'Adicional Clave a Presupuestar 🛠️',
      desc: 'Como Ruth y Leo cuentan solo con el mueble organizador para microondas/horno, los muebles fijos de cocina (bajo-mesada completo, alacenas aéreas e isla desayunadora) se cotizan aparte como adicional clave (Ref. Edifica Studio Equip. #1).'
    });
    groups.archMain.add(budgetedKitchenGroup);
  }

  // ============================================================================
  // D. GRAN SALA DE ESTAR Y COMEDOR EN NIVEL DE CALLE (Y = 0.00m) CON EL INVENTARIO EXACTO DE RUTH Y LEO (Gs. 0)
  // ============================================================================
  // D1. Mesa y Sillas de Sala — Comedor de 6 Sillas (Propia — Gs. 0, siempre visible desde 300M en el amplio sector Sur/Oeste frente al Río)
  const diningSetGroup = new THREE.Group();
  const dX = -0.85;
  const dZ = 8.15;

  const diningTop = new THREE.Mesh(new THREE.BoxGeometry(1.70, 0.045, 0.90), mats.woodDeckPBR);
  diningTop.position.set(dX, 0.76, dZ);
  diningSetGroup.add(diningTop);

  [[-0.75, -0.38], [0.75, -0.38], [-0.75, 0.38], [0.75, 0.38]].forEach(([lx, lz]) => {
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.74, 0.06), mats.woodDoorPBR);
    leg.position.set(dX + lx, 0.38, dZ + lz);
    diningSetGroup.add(leg);
  });

  // 6 Sillas de Comedor (3 a cada lado largo)
  [-0.54, 0.0, 0.54].forEach((ox) => {
    [-0.58, 0.58].forEach((oz) => {
      const chairSeat = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.05, 0.44), mats.linenSofaMat);
      chairSeat.position.set(dX + ox, 0.46, dZ + oz);
      diningSetGroup.add(chairSeat);

      const chairBack = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.44, 0.05), mats.woodDoorPBR);
      chairBack.position.set(dX + ox, 0.70, dZ + oz + (oz > 0 ? 0.19 : -0.19));
      diningSetGroup.add(chairBack);
    });
  });

  tagGroupUserData(diningSetGroup, {
    type: 'mobiliario_propio',
    name: 'Mesa y Sillas de Sala (6 Sillas) — Inventario Propio Ruth y Leo',
    dimensions: 'Mesa 1.70m × 0.90m × 0.76m + 6 Sillas Tapizadas en Gran Salón Social',
    costo: 'Gs. 0 (Propio de Ruth y Leo — A trasladar)',
    status: 'Propio del Propietario (Gs. 0 — A trasladar) 📦',
    desc: 'Juego de comedor de 6 sillas perteneciente a Ruth y Leo, ubicado con total amplitud en la Gran Sala-Comedor de Nivel Calle frente a los ventanales hacia la Galería y el Río.'
  });
  groups.archMain.add(diningSetGroup);

  // D2. Sofá de 4 Piezas (1 de 3 asientos + 3 individuales) + Mesa Ratona de Sala (Propios — Gs. 0)
  const sofaSetGroup = new THREE.Group();
  const sCenterX = 1.85;
  const sCenterZ = 5.45;

  // Pieza 1: Sofá de 3 asientos (2.00m × 0.85m)
  const sofa3Seat = new THREE.Mesh(new THREE.BoxGeometry(2.00, 0.40, 0.85), mats.linenSofaMat);
  sofa3Seat.position.set(sCenterX - 0.15, 0.23, sCenterZ - 1.10);
  sofaSetGroup.add(sofa3Seat);

  const sofa3Back = new THREE.Mesh(new THREE.BoxGeometry(2.00, 0.44, 0.16), mats.linenSofaMat);
  sofa3Back.position.set(sCenterX - 0.15, 0.60, sCenterZ - 1.44);
  sofaSetGroup.add(sofa3Back);

  [-0.94, 0.94].forEach((ax) => {
    const arm = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.32, 0.85), mats.linenSofaMat);
    arm.position.set(sCenterX - 0.15 + ax, 0.44, sCenterZ - 1.10);
    sofaSetGroup.add(arm);
  });

  // Piezas 2, 3 y 4: 3 Sillones Individuales (0.80m × 0.80m c/u)
  const singleChairsCoords = [
    { x: sCenterX - 1.35, z: sCenterZ, rotY: Math.PI / 2 },
    { x: sCenterX - 0.60, z: sCenterZ + 1.05, rotY: Math.PI },
    { x: sCenterX + 0.40, z: sCenterZ + 1.05, rotY: Math.PI }
  ];
  singleChairsCoords.forEach((sc) => {
    const armChair = new THREE.Group();
    armChair.position.set(sc.x, 0, sc.z);
    armChair.rotation.y = sc.rotY;

    const seat = new THREE.Mesh(new THREE.BoxGeometry(0.80, 0.40, 0.80), mats.linenSofaMat);
    seat.position.set(0, 0.23, 0);
    armChair.add(seat);

    const back = new THREE.Mesh(new THREE.BoxGeometry(0.80, 0.42, 0.16), mats.linenSofaMat);
    back.position.set(0, 0.58, -0.32);
    armChair.add(back);

    [-0.34, 0.34].forEach((ax) => {
      const arm = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.30, 0.78), mats.linenSofaMat);
      arm.position.set(ax, 0.43, 0);
      armChair.add(arm);
    });

    sofaSetGroup.add(armChair);
  });

  tagGroupUserData(sofaSetGroup, {
    type: 'mobiliario_propio',
    name: 'Sofá de 4 Piezas (1 de 3 Asientos + 3 Sillones Individuales) — Inventario Propio Ruth y Leo',
    dimensions: '1 Sofá 3 Cuerpos (2.00m × 0.85m) + 3 Individuales (0.80m × 0.80m c/u)',
    costo: 'Gs. 0 (Propio de Ruth y Leo — A trasladar)',
    status: 'Propio del Propietario (Gs. 0 — A trasladar) 📦',
    desc: 'Juego de living de 4 piezas perteneciente a Ruth y Leo ubicado con gran holgura en la Gran Sala Social a Nivel de Calle.'
  });
  groups.archMain.add(sofaSetGroup);

  // D3. Mesa Ratona de Sala (1.10m × 0.60m, Propia — Gs. 0)
  const coffeeTableGroup = new THREE.Group();
  const ctTop = new THREE.Mesh(new THREE.BoxGeometry(1.10, 0.04, 0.60), mats.woodDeckPBR);
  ctTop.position.set(sCenterX - 0.10, 0.42, sCenterZ);
  coffeeTableGroup.add(ctTop);

  [[-0.48, -0.24], [0.48, -0.24], [-0.48, 0.24], [0.48, 0.24]].forEach(([lx, lz]) => {
    const ctLeg = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.40, 0.05), mats.woodDoorPBR);
    ctLeg.position.set(sCenterX - 0.10 + lx, 0.21, sCenterZ + lz);
    coffeeTableGroup.add(ctLeg);
  });

  tagGroupUserData(coffeeTableGroup, {
    type: 'mobiliario_propio',
    name: 'Mesa Ratona de Sala — Inventario Propio Ruth y Leo',
    dimensions: '1.10m × 0.60m × 0.42m • En Centro de Juego de Sofá de 4 Piezas',
    costo: 'Gs. 0 (Propio de Ruth y Leo — A trasladar)',
    status: 'Propio del Propietario (Gs. 0 — A trasladar) 📦',
    desc: 'Mesa ratona central de sala trasladada por Ruth y Leo.'
  });
  groups.archMain.add(coffeeTableGroup);

  // D4. Mesa de Patas de Máquina de Coser con Tabla Arriba + Televisor de 32" (Propios — Gs. 0)
  const tvAndSewingTableGroup = new THREE.Group();
  const stX = 3.45;
  const stZ = 5.45;

  [-0.38, 0.38].forEach((lz) => {
    const ironLeg = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.72, 0.04), mats.blackMetalMat);
    ironLeg.position.set(stX, 0.38, stZ + lz);
    tvAndSewingTableGroup.add(ironLeg);
  });
  const treadleWheel = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.03, 18), mats.blackMetalMat);
  treadleWheel.position.set(stX, 0.42, stZ + 0.28);
  tvAndSewingTableGroup.add(treadleWheel);

  const treadlePedal = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.02, 0.36), mats.blackMetalMat);
  treadlePedal.position.set(stX, 0.12, stZ);
  tvAndSewingTableGroup.add(treadlePedal);

  const woodSlabTop = new THREE.Mesh(new THREE.BoxGeometry(0.50, 0.045, 1.05), mats.woodDoorPBR);
  woodSlabTop.position.set(stX, 0.76, stZ);
  tvAndSewingTableGroup.add(woodSlabTop);

  const tvStandBase = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.02, 0.38), mats.blackMetalMat);
  tvStandBase.position.set(stX, 0.79, stZ);
  tvAndSewingTableGroup.add(tvStandBase);

  const tv32Screen = new THREE.Mesh(
    new THREE.BoxGeometry(0.04, 0.44, 0.73),
    new THREE.MeshStandardMaterial({ color: 0x090d16, roughness: 0.12, metalness: 0.82 })
  );
  tv32Screen.position.set(stX, 1.04, stZ);
  tvAndSewingTableGroup.add(tv32Screen);

  tagGroupUserData(tvAndSewingTableGroup, {
    type: 'mobiliario_propio',
    name: 'Mesa de Patas de Máquina de Coser con Tabla Arriba + Televisor de 32" (Inventario Propio Ruth y Leo)',
    dimensions: 'Mesa Hierro/Madera 1.05m × 0.50m × 0.76m + TV 32" (0.73m × 0.44m)',
    costo: 'Gs. 0 (Propio de Ruth y Leo — A trasladar)',
    status: 'Propio del Propietario (Gs. 0 — A trasladar) 📦',
    desc: 'Mesa artesanal con base de hierro forjado de máquina de coser antigua y tapa de madera maciza arriba, utilizada como mueble de apoyo para el Televisor de 32 pulgadas de Ruth y Leo en la Sala.'
  });
  groups.archMain.add(tvAndSewingTableGroup);

  // D5. Mesa de Florero y Libros Cuadrada (0.55m × 0.55m × 0.62m, Propia — Gs. 0) + 1 Vaporizador Xiaomi
  const bookFlowerTableGroup = new THREE.Group();
  const bfX = 0.25;
  const bfZ = 3.55;

  const sqTop = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.035, 0.55), mats.woodDeckPBR);
  sqTop.position.set(bfX, 0.62, bfZ);
  bookFlowerTableGroup.add(sqTop);

  [[-0.22, -0.22], [0.22, -0.22], [-0.22, 0.22], [0.22, 0.22]].forEach(([lx, lz]) => {
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.60, 0.04), mats.woodDoorPBR);
    leg.position.set(bfX + lx, 0.31, bfZ + lz);
    bookFlowerTableGroup.add(leg);
  });

  const book1 = new THREE.Mesh(
    new THREE.BoxGeometry(0.24, 0.035, 0.18),
    new THREE.MeshStandardMaterial({ color: 0x991b1b, roughness: 0.6 })
  );
  book1.position.set(bfX - 0.10, 0.655, bfZ + 0.06);
  bookFlowerTableGroup.add(book1);

  const book2 = new THREE.Mesh(
    new THREE.BoxGeometry(0.22, 0.03, 0.16),
    new THREE.MeshStandardMaterial({ color: 0x1e40af, roughness: 0.6 })
  );
  book2.position.set(bfX - 0.10, 0.688, bfZ + 0.06);
  bookFlowerTableGroup.add(book2);

  const vase = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.075, 0.22, 16), mats.ceramicSanitaryMat);
  vase.position.set(bfX + 0.10, 0.74, bfZ - 0.06);
  bookFlowerTableGroup.add(vase);

  const bouquet = new THREE.Mesh(new THREE.SphereGeometry(0.11, 12, 10), mats.grassPBR);
  bouquet.position.set(bfX + 0.10, 0.90, bfZ - 0.06);
  bookFlowerTableGroup.add(bouquet);

  const xiaomiHumidifier = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.30, 20), mats.ceramicSanitaryMat);
  xiaomiHumidifier.position.set(bfX + 0.12, 0.78, bfZ + 0.14);
  bookFlowerTableGroup.add(xiaomiHumidifier);

  tagGroupUserData(bookFlowerTableGroup, {
    type: 'mobiliario_propio',
    name: 'Mesa Cuadrada de Florero y Libros + 1 Vaporizador de Agua Xiaomi (Inventario Propio Ruth y Leo)',
    dimensions: 'Mesa Cuadrada 0.55m × 0.55m × 0.62m + Vaporizador Xiaomi Ø0.18m × 0.30m',
    costo: 'Gs. 0 (Propio de Ruth y Leo — A trasladar)',
    status: 'Propio del Propietario (Gs. 0 — A trasladar) 📦',
    desc: 'Mesa cuadrada auxiliar con libros, florero decorativo y el vaporizador/humidificador de agua blanco Xiaomi del inventario de Ruth y Leo.'
  });
  groups.archMain.add(bookFlowerTableGroup);

  // D6. 1 Purificador de Aire Xiaomi (0.24m × 0.24m × 0.52m, Propio — Gs. 0)
  const airPurifierGroup = new THREE.Group();
  const apX = 3.42;
  const apZ = 3.55;
  const purifierTower = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.52, 0.24), mats.ceramicSanitaryMat);
  purifierTower.position.set(apX, 0.28, apZ);
  airPurifierGroup.add(purifierTower);

  const purifierTopVent = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.015, 18), mats.blackMetalMat);
  purifierTopVent.position.set(apX, 0.545, apZ);
  airPurifierGroup.add(purifierTopVent);

  const purifierOled = new THREE.Mesh(new THREE.CylinderGeometry(0.042, 0.042, 0.015, 18), mats.blackMetalMat);
  purifierOled.rotation.z = Math.PI / 2;
  purifierOled.position.set(apX - 0.122, 0.38, apZ);
  airPurifierGroup.add(purifierOled);

  tagGroupUserData(airPurifierGroup, {
    type: 'electrodomestico_propio',
    name: '1 Purificador de Aire Xiaomi Smart Air Purifier (Inventario Propio Ruth y Leo)',
    dimensions: '0.24m × 0.24m × 0.52m • Display OLED Frontal',
    costo: 'Gs. 0 (Propio de Ruth y Leo — A trasladar)',
    status: 'Propio del Propietario (Gs. 0 — A trasladar) 📦',
    desc: 'Purificador de aire Xiaomi en torre blanca minimalista ubicado en la Gran Sala Social de Ruth y Leo.'
  });
  groups.archMain.add(airPurifierGroup);

  // Cielorraso con Garganta LED en Gran Sala/Comedor (desde 440M)
  if (isAtLeast440) {
    const ceilingPlate = new THREE.Mesh(
      new THREE.BoxGeometry(6.20, 0.06, 6.20),
      mats.plasterPBR
    );
    ceilingPlate.position.set(0.45, 2.68, 6.45);
    ceilingPlate.userData = {
      type: 'cielorraso_led',
      name: 'Cielorraso de Yeso con Garganta LED en Gran Sala / Comedor (Ítem 12 Edifica Studio)',
      dimensions: '6.20m × 6.20m • Cota +2.68m',
      costo: 'Gs. 5.937.500',
      status: 'Iluminación Indirecta LED 3000K ✨',
      desc: 'Cielorraso suspendido con bandeja perimetral luminosa LED cálida en la Gran Sala y Comedor Social.'
    };
    groups.archMain.add(ceilingPlate);

    const ledCove = new THREE.Mesh(
      new THREE.BoxGeometry(6.32, 0.025, 6.32),
      mats.ledWarmMat
    );
    ledCove.position.set(0.45, 2.71, 6.45);
    groups.archMain.add(ledCove);
  }

  // ============================================================================
  // E. GALERÍA AL RÍO CON REJAS DE SEGURIDAD Y PARRILLA (Losa L1, Y = -0.45m)
  // ============================================================================
  const galGroup = new THREE.Group();
  const yGal = -0.45;

  groups.archMain.add(
    createBalconyGrille3D(
      THREE, mats, -4.82, 13.30, 4.82, 13.30, yGal, 1.05,
      'Reja y Baranda de Seguridad en Borde de Galería al Río (Eje A • z = 13.34m)'
    )
  );
  groups.archMain.add(
    createBalconyGrille3D(
      THREE, mats, 4.82, 9.94, 4.82, 13.30, yGal, 1.05,
      'Reja Lateral Este de Seguridad en Galería (Eje 1 • z = 9.94m a 13.34m)'
    )
  );

  if (isAtLeast350) {
    const outdoorTable = new THREE.Mesh(new THREE.BoxGeometry(2.40, 0.76, 1.10), mats.woodDeckPBR);
    outdoorTable.position.set(0.85, yGal + 0.40, 11.75);
    galGroup.add(outdoorTable);
  }

  tagGroupUserData(galGroup, {
    type: 'galeria_quincho',
    name: 'Galería Panorámica al Río Paraguay (Losa L1 Rebajada -0.45m)',
    dimensions: '9.74m × 3.40m (33.1 m² • Cota +99.55m / Y=-0.45m)',
    status: 'Mirador al Río Paraguay ✨',
    desc: 'Galería cubierta sobre la Losa L1 entre Eje B y Eje A con rejas y baranda de seguridad hacia el barranco.'
  });
  groups.archMain.add(galGroup);

  // Parrilla Portátil (Gs. 0) en 300M..460M o Parrilla de Obra en 573M
  groups.archMain.add(buildGalleryParilla3D(THREE, mats, yGal, scenarioKey));

  // ============================================================================
  // F. SUBSUELO REAL DE 100,71 m² LIBRES BAJO TODA LA PRIMERA LOSA (Y = -2.34m):
  //    MURO FRONTAL EN EJE G (z = 3.00m) FRENTE AL PASILLO ANTIHUMEDAD (z = +1.50m..+3.00m),
  //    LAVADERO CON LAVARROPAS PROPIO + DEPÓSITO CON ESTANTERÍAS DESDE EL DÍA 1 (300M)
  // ============================================================================
  const ySub = -2.34;
  const hSub = 2.28;
  const subWallMat = isAtLeast440 ? mats.plasterPBR : mats.plasterRoughPBR;

  // Muro frontal del Subsuelo en Eje G (z = 3.00m), separado de la tierra del estacionamiento por el Pasillo Antihumedad (z = 1.50m..3.00m)
  addWallSegment(
    groups.archSubsuelo,
    -4.87, 3.00, 2.75, 3.00,
    ySub, hSub, 0.20, subWallMat,
    'Muro Frontal Subsuelo sobre Eje G (z = 3.00m • Protegido por Pasillo Cámara de Aire Antihumedad z = +1.50m..+3.00m)',
    'Cerramiento frontal de los 100,71 m² del Subsuelo sobre Eje G. No toca la tierra del estacionamiento gracias al Pasillo Cámara de Aire Antihumedad de 1.50m de ancho (z=+1.50m a +3.00m).'
  );
  // Puerta de acceso desde el Subsuelo hacia el Pasillo Cámara de Aire Antihumedad para inspección y mantenimiento
  groups.archSubsuelo.add(
    createWoodenDoor3D(
      THREE, mats, 3.30, ySub, 3.00, 0.80, 2.05, 0, 0.35,
      'Puerta de Inspección y Ventilación hacia Pasillo Cámara de Aire Antihumedad (Eje G • z = 3.00m)'
    )
  );

  addWallSegment(
    groups.archSubsuelo,
    -4.87, 3.00, -4.87, 13.34,
    ySub, hSub, 0.20, subWallMat,
    'Muro Lateral Oeste Subsuelo (Eje 9 • x = -4.87m • Largo total 10.34m)',
    'Cerramiento lateral Oeste de los 100,71 m² bajo toda la primera losa.'
  );
  addWallSegment(
    groups.archSubsuelo,
    4.87, 3.00, 4.87, 13.34,
    ySub, hSub, 0.20, subWallMat,
    'Muro Lateral Este Subsuelo (Eje 1 • x = +4.87m • Largo total 10.34m)',
    'Cerramiento lateral Este del Subsuelo junto a la Escalera 1.'
  );

  // Sector Lavadero y Depósito Cerrado en Subsuelo (x = -4.87m a -1.64m, z = 3.00m a 7.37m) — OPERATIVO DESDE 300M
  addWallSegment(
    groups.archSubsuelo,
    -1.64, 3.00, -1.64, 7.37,
    ySub, hSub, 0.15, subWallMat,
    'Tabique Divisorio Subsuelo — Núcleo de Depósito y Lavadero (Eje 6 • x = -1.64m)',
    'Divide el Depósito cerrado y el Lavadero respecto de la gran planta libre del Subsuelo.'
  );
  addWallSegment(
    groups.archSubsuelo,
    -4.87, 5.20, -1.64, 5.20,
    ySub, hSub, 0.15, subWallMat,
    'Tabique Divisorio entre Depósito Cerrado (z = 3.00..5.20m) y Lavadero (z = 5.20..7.37m)',
    'Separa el Depósito seco de guardado del sector húmedo de Lavadero en Subsuelo.'
  );
  addWallSegment(
    groups.archSubsuelo,
    -4.87, 7.37, -1.64, 7.37,
    ySub, hSub, 0.15, subWallMat,
    'Divisoria Transversal Subsuelo (Eje C • z = 7.37m)',
    'Separa el Lavadero de la gran planta libre / departamento del Subsuelo.'
  );

  // Puerta del Depósito Cerrado en Subsuelo (SIEMPRE desde 300M)
  groups.archSubsuelo.add(
    createWoodenDoor3D(
      THREE, mats, -1.64, ySub, 4.10, 0.82, 2.05, Math.PI / 2, 0.45,
      'Puerta de Madera — Depósito Cerrado de Guardado en Subsuelo (Incluido desde 300M)'
    )
  );
  // Puerta del Lavadero en Subsuelo (SIEMPRE desde 300M)
  groups.archSubsuelo.add(
    createWoodenDoor3D(
      THREE, mats, -1.64, ySub, 6.25, 0.82, 2.05, Math.PI / 2, 0.45,
      'Puerta de Madera Hidrófuga — Lavadero Operativo en Subsuelo (Incluido desde 300M)'
    )
  );

  // F1. Lavadero Operativo en Subsuelo con el 1 Lavarropas Propio de Ruth y Leo (Gs. 0) + Pileta de Lavar (SIEMPRE desde 300M)
  groups.archSubsuelo.add(
    createLaundryModule3D(THREE, mats, -2.85, ySub + 0.03, 6.90, Math.PI, 'Lavadero en Subsuelo • Operativo desde el Día 1 (300M)')
  );

  // F2. Depósito Cerrado en Subsuelo con Estanterías de Guardado (z = 3.00m..5.20m, SIEMPRE desde 300M)
  const storageRoomGroup = new THREE.Group();
  [-4.50, -3.15].forEach((sx, idx) => {
    const rackFrame = new THREE.Group();
    [0.25, 0.75, 1.25, 1.75].forEach((shY) => {
      const shelfPlate = new THREE.Mesh(
        new THREE.BoxGeometry(0.50, 0.03, 1.65),
        mats.woodDeckPBR
      );
      shelfPlate.position.set(sx, ySub + shY, 4.10);
      rackFrame.add(shelfPlate);
    });
    [[-0.22, -0.78], [0.22, -0.78], [-0.22, 0.78], [0.22, 0.78]].forEach(([px, pz]) => {
      const post = new THREE.Mesh(
        new THREE.BoxGeometry(0.035, 1.85, 0.035),
        mats.blackMetalMat
      );
      post.position.set(sx + px, ySub + 0.95, 4.10 + pz);
      rackFrame.add(post);
    });
    // Cajas organizadoras sobre los estantes
    [0.38, 0.88, 1.38].forEach((by, bIdx) => {
      const box = new THREE.Mesh(
        new THREE.BoxGeometry(0.38, 0.24, 0.46),
        new THREE.MeshStandardMaterial({
          color: (idx + bIdx) % 2 === 0 ? 0xd97706 : 0x475569,
          roughness: 0.65
        })
      );
      box.position.set(sx, ySub + by, 3.85 + bIdx * 0.35);
      rackFrame.add(box);
    });
    storageRoomGroup.add(rackFrame);
  });

  tagGroupUserData(storageRoomGroup, {
    type: 'ambiente_equipado',
    name: 'Depósito Cerrado y Organizado en Subsuelo con Estanterías de Guardado (Operativo desde 300M)',
    dimensions: '3.23m × 2.20m (7.1 m² cerrados • Cota +97.66m / Y=-2.34m)',
    costo: 'Incluido en Subsuelo Habitable (300M)',
    status: 'Depósito Seco y Ventilado desde el Día 1 🎯',
    desc: 'Depósito cerrado en el Subsuelo (protegido de la humedad por el pasillo cámara de aire de 1.50m) con estanterías para herramientas, valijas, cajas e insumos de Ruth y Leo.'
  });
  groups.archSubsuelo.add(storageRoomGroup);

  // Ventanal Corredizo Blindex del Subsuelo mirando al Jardín y Piscina (Eje B z=9.94m)
  groups.archSubsuelo.add(
    createBlindexWindow3D(
      THREE, mats, -0.35, ySub + 1.12, 9.94, 6.40, 2.15, 0,
      'Ventanal Corredizo Blindex 10mm — Subsuelo Libre (100,71 m²) hacia Jardín y Piscina (Eje B)',
      'Cerramiento de vidrio templado Blindex con carpintería de aluminio negro en el Subsuelo con salida directa al jardín con césped, piscina y quincho.'
    )
  );

  if (isAtLeast440) {
    groups.archSubsuelo.add(createToilet3D(THREE, mats, -4.25, ySub + 0.03, 5.65, 0, 'Baño y Lavadero Subsuelo'));
    groups.archSubsuelo.add(createVanity3D(THREE, mats, -3.55, ySub + 0.03, 5.65, 0.70, 0, 'Baño y Lavadero Subsuelo'));
    groups.archSubsuelo.add(createShowerBox3D(THREE, mats, -4.25, ySub + 0.03, 6.65, 1.00, 1.05, 0, 'Baño y Lavadero Subsuelo'));
  }

  // ============================================================================
  // G. 2DO PISO / PLANTA ALTA (Cota +102.88m / Y = +2.88m — ACTIVO DESDE EL DÍA 1):
  //    DORMITORIO EN SUITE DE RUTH Y LEO (Sommier 1.40m + 2 Mesas de Luz + Tocador #1 + Placares)
  //    + BAÑO COMPLETO EN SUITE
  //    + ESTUDIO / COSTURA / HUÉSPEDES (2 Escritorios + 1 Silla Oficina + Máquina de Coser Antigua + Cama 1 Plaza + Tocador #2)
  // ============================================================================
  // Agrupamos todo el 2do piso en `plantaAltaArchGroup` con `position.y = 2.88` para que el corte `'cut_pa'`
  // (`ch.position.y > 2.75`) oculte limpiamente el 2do piso cuando se inspecciona la Gran Sala de Nivel Calle.
  const plantaAltaArchGroup = new THREE.Group();
  plantaAltaArchGroup.position.set(0, 2.88, 0);
  groups.archMain.add(plantaAltaArchGroup);

  const localFloorY = 0.20; // Sobre la losa de viguetas pretensadas (2.88 + 0.20 = +3.08m)
  const hPA = 2.68;

  // G1. Solado del 2do Piso (Presente desde 300M porque allí está el Dormitorio de Ruth y Leo)
  const paFloor = new THREE.Mesh(
    new THREE.BoxGeometry(9.54, 0.03, 11.05),
    isAtLeast350 ? mats.porcelainPBR : mats.plasterRoughPBR
  );
  paFloor.position.set(0, localFloorY, 7.75);
  paFloor.receiveShadow = true;
  paFloor.userData = {
    type: 'piso_terminado',
    name: isAtLeast350
      ? 'Piso Porcelanato Rectificado 60×60cm en 2do Piso — Dormitorio Ruth y Leo, Estudio y Baño (+102.88m)'
      : 'Solado Nivelado en 2do Piso + Cerámico Impermeable en Baño en Suite (Base 300M)',
    dimensions: '9.54m × 11.05m (105.4 m² en Cota +102.88m / Y=+2.88m)',
    status: isAtLeast350 ? 'Porcelanato 60×60 en 2do Piso ✨' : 'Dormitorio y Baño de Ruth y Leo Habitables desde 300M 🎯',
    desc: 'Piso terminado del 2do Piso (Planta Alta), donde se ubican desde el primer día el Dormitorio Principal en Suite de Ruth y Leo, el Baño Completo y el Sector de Estudio/Costura/Huéspedes.'
  };
  plantaAltaArchGroup.add(paFloor);

  // G2. Cerramientos Perimetrales y Divisorias del 2do Piso
  addWallSegment(
    plantaAltaArchGroup,
    -4.87, 3.00, -4.87, 12.15,
    0.00, hPA, 0.20, extWallMat,
    'Muro Medianero Oeste 2do Piso (Eje 9 • Y = +2.88m a +5.56m)',
    'Cerramiento lateral Oeste del 2do piso que protege el Dormitorio en Suite y el Baño Principal.'
  );
  addWallSegment(
    plantaAltaArchGroup,
    4.87, 3.00, 4.87, 12.15,
    0.00, hPA, 0.20, extWallMat,
    'Muro Medianero Este 2do Piso (Eje 1 • Y = +2.88m a +5.56m)',
    'Cerramiento lateral Este del 2do piso junto al desembarco de la Escalera 1.'
  );

  // Divisoria central Longitudinal en x = -0.55m (separa Suite + Baño al Oeste de Estudio/Costura/Huéspedes al Este)
  addWallSegment(
    plantaAltaArchGroup,
    -0.55, 3.00, -0.55, 6.20,
    0.00, hPA, 0.15, intWallMat,
    'Tabique Divisorio 2do Piso — Baño en Suite / Estudio (x = -0.55m)',
    'Separa el Baño Principal en Suite respecto del Sector Estudio y Costura en el 2do piso.'
  );
  addWallSegment(
    plantaAltaArchGroup,
    -0.55, 7.10, -0.55, 10.10,
    0.00, hPA, 0.15, intWallMat,
    'Tabique Divisorio 2do Piso — Dormitorio en Suite de Ruth y Leo / Estudio (x = -0.55m)',
    'Otorga privacidad acústica y visual al Dormitorio Principal en Suite de Ruth y Leo en el 2do piso.'
  );
  addWallSegment(
    plantaAltaArchGroup,
    -0.55, 11.00, -0.55, 12.15,
    0.00, hPA, 0.15, intWallMat,
    'Mocheta Norte Divisoria 2do Piso (x = -0.55m)',
    'Remate del tabique divisorio contra el ventanal mirador al Río.'
  );

  // Divisoria transversal entre el Baño en Suite (z = 5.10m..7.55m) y el Dormitorio de Ruth y Leo (z = 7.55m..12.15m)
  addWallSegment(
    plantaAltaArchGroup,
    -4.87, 5.10, -0.55, 5.10,
    0.00, hPA, 0.15, intWallMat,
    'Muro Norte Baño Principal en 2do Piso (z = 5.10m)',
    'Cierre del núcleo húmedo del Baño Principal en Planta Alta.'
  );
  addWallSegment(
    plantaAltaArchGroup,
    -4.87, 7.55, -0.55, 7.55,
    0.00, hPA, 0.15, intWallMat,
    'Divisoria Baño en Suite / Dormitorio Principal Ruth y Leo en 2do Piso (z = 7.55m)',
    'Muro sanitario del 2do piso que separa el Baño Completo del Dormitorio Principal de Ruth y Leo.'
  );

  // Puertas Interiores de Madera en 2do Piso (Dormitorio Suite + Baño Completo)
  plantaAltaArchGroup.add(
    createWoodenDoor3D(
      THREE, mats, -0.55, localFloorY, 6.65, 0.80, 2.10, Math.PI / 2, 0.55,
      'Puerta de Madera Hidrófuga — Baño Completo en 2do Piso (Operativo desde 300M)'
    )
  );
  plantaAltaArchGroup.add(
    createWoodenDoor3D(
      THREE, mats, -0.55, localFloorY, 10.55, 0.86, 2.10, Math.PI / 2, 0.65,
      'Puerta Placa de Madera — Acceso a Dormitorio en Suite de Ruth y Leo en 2do Piso (+102.88m)'
    )
  );

  // Ventanales Corredizos Blindex en Fachada Frontal del 2do Piso (sobre Eje G z = 3.00m, saliendo al balcón frontal z = 2.15..3.00m)
  plantaAltaArchGroup.add(
    createBlindexWindow3D(
      THREE, mats, -2.65, 1.25, 3.00, 3.80, 2.25, 0,
      'Puerta-Ventana Corrediza Blindex — Sector Frontal Oeste 2do Piso hacia Balcón (Eje G)',
      'Ventanal corredizo Blindex con marco de aluminio negro y salida al balcón sobre Calle Guillermo Arias.'
    )
  );
  plantaAltaArchGroup.add(
    createBlindexWindow3D(
      THREE, mats, 1.65, 1.25, 3.00, 3.80, 2.25, 0,
      'Puerta-Ventana Corrediza Blindex — Estudio / Huéspedes 2do Piso hacia Balcón Frontal (Eje G)',
      'Ventanal corredizo Blindex en el sector de Estudio y Costura de Ruth y Leo con salida al balcón frontal.'
    )
  );

  // Ventanales Corredizos Blindex en Fachada Mirador al Río del 2do Piso (en z = 12.15m, saliendo al balcón terraza Norte z = 12.15..13.34m)
  plantaAltaArchGroup.add(
    createBlindexWindow3D(
      THREE, mats, -2.65, 1.25, 12.15, 4.10, 2.30, 0,
      'Gran Ventanal Blindex — Dormitorio en Suite de Ruth y Leo Mirador al Río en 2do Piso (Salida a Balcón Terraza)',
      'Puerta-ventana corrediza Blindex 10mm del Dormitorio Principal de Ruth y Leo en el 2do piso con vista panorámica directa al Río Paraguay y a la Piscina.'
    )
  );
  plantaAltaArchGroup.add(
    createBlindexWindow3D(
      THREE, mats, 2.15, 1.25, 12.15, 4.30, 2.30, 0,
      'Ventanal Corredizo Blindex — Sector Estudio y Huéspedes 2do Piso hacia Balcón Río',
      'Cerramiento Blindex de piso a dintel con salida al balcón terraza mirador de Planta Alta.'
    )
  );

  // Rejas de Seguridad Perimetrales en ambos Balcones del 2do Piso
  plantaAltaArchGroup.add(
    createBalconyGrille3D(
      THREE, mats, -4.82, 2.18, 4.82, 2.18, 0.18, 1.08,
      'Reja y Baranda de Seguridad en Balcón Frontal de 2do Piso (Voladizo z = 2.15m)'
    )
  );
  plantaAltaArchGroup.add(
    createBalconyGrille3D(
      THREE, mats, -4.82, 2.18, -4.82, 3.00, 0.18, 1.08,
      'Reja Lateral Oeste Balcón Frontal 2do Piso'
    )
  );
  plantaAltaArchGroup.add(
    createBalconyGrille3D(
      THREE, mats, 4.82, 2.18, 4.82, 3.00, 0.18, 1.08,
      'Reja Lateral Este Balcón Frontal 2do Piso'
    )
  );
  plantaAltaArchGroup.add(
    createBalconyGrille3D(
      THREE, mats, -4.82, 13.30, 4.82, 13.30, 0.18, 1.08,
      'Reja y Baranda de Seguridad en Balcón Terraza Mirador al Río — 2do Piso (Eje A z = 13.34m)'
    )
  );
  plantaAltaArchGroup.add(
    createBalconyGrille3D(
      THREE, mats, -4.82, 12.15, -4.82, 13.30, 0.18, 1.08,
      'Reja Lateral Oeste Balcón Mirador 2do Piso'
    )
  );
  plantaAltaArchGroup.add(
    createBalconyGrille3D(
      THREE, mats, 4.82, 12.15, 4.82, 13.30, 0.18, 1.08,
      'Reja Lateral Este Balcón Mirador 2do Piso'
    )
  );

  // G3. Baño Principal Completo en Suite en 2do Piso (Operativo desde 300M)
  plantaAltaArchGroup.add(createToilet3D(THREE, mats, -3.15, localFloorY + 0.02, 5.55, 0, 'Baño Principal en Suite 2do Piso'));
  plantaAltaArchGroup.add(createBidet3D(THREE, mats, -2.35, localFloorY + 0.02, 5.55, 0, 'Baño Principal en Suite 2do Piso'));
  plantaAltaArchGroup.add(createVanity3D(THREE, mats, -2.65, localFloorY + 0.02, 7.22, 0.95, Math.PI, 'Baño Principal en Suite 2do Piso'));
  plantaAltaArchGroup.add(createShowerBox3D(THREE, mats, -4.22, localFloorY + 0.02, 6.32, 1.15, 1.85, 0, 'Baño Principal en Suite 2do Piso'));

  // G4. DORMITORIO EN SUITE DE RUTH Y LEO EN 2DO PISO (+102.88m):
  //     1 Sommier de 1,40m + 2 Mesas de Luz + Tocador #1 con Espejo (Propios — Gs. 0, siempre desde 300M)
  const suiteOwnFurnitureGroup = new THREE.Group();

  const headboard = new THREE.Mesh(new THREE.BoxGeometry(0.10, 1.10, 1.44), mats.woodDeckPBR);
  headboard.position.set(-4.72, localFloorY + 0.56, 9.85);
  suiteOwnFurnitureGroup.add(headboard);

  const sommierBase = new THREE.Mesh(new THREE.BoxGeometry(1.90, 0.28, 1.40), mats.linenSofaMat);
  sommierBase.position.set(-3.75, localFloorY + 0.15, 9.85);
  suiteOwnFurnitureGroup.add(sommierBase);

  const sommierMattress = new THREE.Mesh(new THREE.BoxGeometry(1.90, 0.24, 1.40), mats.bedSheetMat);
  sommierMattress.position.set(-3.75, localFloorY + 0.40, 9.85);
  suiteOwnFurnitureGroup.add(sommierMattress);

  const duvet = new THREE.Mesh(new THREE.BoxGeometry(1.30, 0.25, 1.42), mats.bedDuvetMat);
  duvet.position.set(-3.44, localFloorY + 0.41, 9.85);
  suiteOwnFurnitureGroup.add(duvet);

  [-0.34, 0.34].forEach((pz) => {
    const pillow = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.12, 0.52), mats.bedSheetMat);
    pillow.position.set(-4.42, localFloorY + 0.56, 9.85 + pz);
    suiteOwnFurnitureGroup.add(pillow);
  });

  // 2 Mesas de Luz (0.45m × 0.40m × 0.52m c/u, Propias — Gs. 0)
  [-0.96, 0.96].forEach((nz) => {
    const nightStand = new THREE.Mesh(new THREE.BoxGeometry(0.40, 0.52, 0.45), mats.woodDoorPBR);
    nightStand.position.set(-4.52, localFloorY + 0.26, 9.85 + nz);
    suiteOwnFurnitureGroup.add(nightStand);

    const lamp = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.11, 0.22, 14), mats.ledWarmMat);
    lamp.position.set(-4.52, localFloorY + 0.63, 9.85 + nz);
    suiteOwnFurnitureGroup.add(lamp);
  });

  // Tocador de Dormitorio #1 con Espejo y Cajones en la Suite del 2do Piso (0.85m × 0.42m × 1.45m, Propio — Gs. 0)
  const dresser1Base = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.76, 0.85), mats.woodDoorPBR);
  dresser1Base.position.set(-0.90, localFloorY + 0.38, 8.85);
  suiteOwnFurnitureGroup.add(dresser1Base);

  const dresser1Mirror = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.68, 0.65), mats.mirrorMat);
  dresser1Mirror.position.set(-0.70, localFloorY + 1.10, 8.85);
  suiteOwnFurnitureGroup.add(dresser1Mirror);

  tagGroupUserData(suiteOwnFurnitureGroup, {
    type: 'mobiliario_propio',
    name: 'Dormitorio en Suite de Ruth y Leo en 2do Piso (+2.88m): 1 Sommier de 1,40m + 2 Mesas de Luz + Tocador #1 con Espejo (Inventario Propio)',
    dimensions: 'Sommier 1.40m × 1.90m + 2 Mesas de Luz (0.45×0.40m) + Tocador #1 (0.85×0.42m) en Planta Alta',
    costo: 'Gs. 0 (Propio de Ruth y Leo — A trasladar)',
    status: 'Propio del Propietario en 2do Piso (Gs. 0 — A trasladar) 📦',
    desc: 'Equipamiento propio de Ruth y Leo instalado en su Dormitorio Principal en Suite del 2do Piso (+102.88m) con balcón mirador al Río Paraguay: sommier de 1,40m, 2 mesas de luz y el primer tocador con espejo.'
  });
  plantaAltaArchGroup.add(suiteOwnFurnitureGroup);

  // G5. SECTOR ESTUDIO / HOME-OFFICE / COSTURA Y HUÉSPEDES EN 2DO PISO (+102.88m):
  //     2 Escritorios pequeños + 1 Silla de oficina + Máquina de coser antigua + 1 Cama de 1 plaza + Tocador #2
  const homeOfficePAGroup = new THREE.Group();

  [0.35, 1.45].forEach((dxOffset) => {
    const deskTop = new THREE.Mesh(new THREE.BoxGeometry(1.00, 0.035, 0.52), mats.woodDeckPBR);
    deskTop.position.set(dxOffset, localFloorY + 0.75, 6.40);
    homeOfficePAGroup.add(deskTop);

    [[-0.45, -0.22], [0.45, -0.22], [-0.45, 0.22], [0.45, 0.22]].forEach(([lx, lz]) => {
      const dLeg = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.73, 0.04), mats.blackMetalMat);
      dLeg.position.set(dxOffset + lx, localFloorY + 0.37, 6.40 + lz);
      homeOfficePAGroup.add(dLeg);
    });

    const laptop = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.22, 0.02), mats.blackMetalMat);
    laptop.position.set(dxOffset, localFloorY + 0.88, 6.30);
    homeOfficePAGroup.add(laptop);
  });

  // 2 Sillas Ergonómicas de Oficina (una para cada escritorio de Ruth y Leo: 1 propia Gs. 0 + 1 adicional Gs. 850.000)
  [0.35, 1.45].forEach((chairX) => {
    const chairZ = 6.90;
    const chairStarBase = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.04, 5), mats.blackMetalMat);
    chairStarBase.position.set(chairX, localFloorY + 0.04, chairZ);
    homeOfficePAGroup.add(chairStarBase);

    const chairPiston = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.38, 12), mats.chromeMat);
    chairPiston.position.set(chairX, localFloorY + 0.23, chairZ);
    homeOfficePAGroup.add(chairPiston);

    const officeSeat = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.06, 0.48), mats.blackMetalMat);
    officeSeat.position.set(chairX, localFloorY + 0.44, chairZ);
    homeOfficePAGroup.add(officeSeat);

    const officeBack = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.52, 0.05), mats.blackMetalMat);
    officeBack.position.set(chairX, localFloorY + 0.72, chairZ + 0.22);
    homeOfficePAGroup.add(officeBack);
  });

  tagGroupUserData(homeOfficePAGroup, {
    type: 'mobiliario_propio',
    name: 'Estudio en 2do Piso (+2.88m): 2 Escritorios Pequeños (Ruth y Leo) + 2 Sillas Ergonómicas de Oficina',
    dimensions: '2 Escritorios de 1.00m × 0.52m × 0.75m c/u + 2 Sillas Ergonómicas Giratorias en Planta Alta',
    costo: '2 Escritorios + 1 Silla Gs. 0 (Propios) • 2da Silla Ergonómica: Gs. 850.000',
    status: 'Home-Office Doble de Ruth y Leo en 2do Piso 📦✨',
    desc: 'Sector de Home-Office y Estudio en el 2do Piso (+102.88m) equipado con los dos escritorios pequeños y dos sillas ergonómicas para trabajo simultáneo de Ruth y Leo.'
  });
  plantaAltaArchGroup.add(homeOfficePAGroup);

  // Máquina de Coser Antigua con Pedestal de Hierro y Cabezal Clásico en 2do Piso (Propia — Gs. 0)
  // Reubicada en x = 2.45m, z = 4.65m (con luz natural Norte y totalmente libre del desembarco de la Escalera 2)
  const antiqueSewingGroup = new THREE.Group();
  const asmX = 2.45;
  const asmZ = 4.65;

  [-0.32, 0.32].forEach((lz) => {
    const sLeg = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.72, 0.035), mats.blackMetalMat);
    sLeg.position.set(asmX, localFloorY + 0.36, asmZ + lz);
    antiqueSewingGroup.add(sLeg);
  });
  const sFlywheel = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.025, 18), mats.blackMetalMat);
  sFlywheel.position.set(asmX, localFloorY + 0.40, asmZ + 0.24);
  antiqueSewingGroup.add(sFlywheel);

  const sCabinet = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.08, 0.78), mats.woodDoorPBR);
  sCabinet.position.set(asmX, localFloorY + 0.74, asmZ);
  antiqueSewingGroup.add(sCabinet);

  const sewingHeadBase = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.04, 0.38), mats.blackMetalMat);
  sewingHeadBase.position.set(asmX, localFloorY + 0.80, asmZ);
  antiqueSewingGroup.add(sewingHeadBase);

  const sewingArmVert = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.055, 0.22, 14), mats.blackMetalMat);
  sewingArmVert.position.set(asmX, localFloorY + 0.90, asmZ + 0.13);
  antiqueSewingGroup.add(sewingArmVert);

  const sewingArmHoriz = new THREE.Mesh(new THREE.CylinderGeometry(0.038, 0.045, 0.28, 14), mats.blackMetalMat);
  sewingArmHoriz.rotation.x = Math.PI / 2;
  sewingArmHoriz.position.set(asmX, localFloorY + 0.99, asmZ);
  antiqueSewingGroup.add(sewingArmHoriz);

  const handWheel = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.065, 0.025, 16), mats.chromeMat);
  handWheel.rotation.x = Math.PI / 2;
  handWheel.position.set(asmX, localFloorY + 0.94, asmZ + 0.20);
  antiqueSewingGroup.add(handWheel);

  tagGroupUserData(antiqueSewingGroup, {
    type: 'mobiliario_propio',
    name: 'Máquina de Coser Antigua Completa en 2do Piso (Inventario Propio Ruth y Leo • x = 2.45m, z = 4.65m)',
    dimensions: '0.78m × 0.46m × 1.05m • Pedestal de Hierro Fundido + Gabinete y Cabezal Antiguo',
    costo: 'Gs. 0 (Propio de Ruth y Leo — A trasladar)',
    status: 'Propio del Propietario en 2do Piso (Gs. 0 — A trasladar) 📦',
    desc: 'Máquina de coser antigua clásica con pedestal de hierro forjado, pedal, gabinete de madera y cabezal original ubicada en el sector Norte del Estudio del 2do Piso con excelente luz natural y libre del desembarco de escalera.'
  });
  plantaAltaArchGroup.add(antiqueSewingGroup);

  // 1 Cama de 1 Plaza (0.90m × 1.90m, Propia — Gs. 0) + Tocador de Dormitorio #2 con Espejo (Propio — Gs. 0) en 2do Piso
  const secondRoomOwnFurniture = new THREE.Group();
  const sbX = 2.45;
  const sbZ = 10.65;

  const singleBedFrame = new THREE.Mesh(new THREE.BoxGeometry(0.92, 0.26, 1.92), mats.woodDeckPBR);
  singleBedFrame.position.set(sbX, localFloorY + 0.14, sbZ);
  secondRoomOwnFurniture.add(singleBedFrame);

  const singleMattress = new THREE.Mesh(new THREE.BoxGeometry(0.90, 0.20, 1.90), mats.bedSheetMat);
  singleMattress.position.set(sbX, localFloorY + 0.34, sbZ);
  secondRoomOwnFurniture.add(singleMattress);

  const singlePillow = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.10, 0.32), mats.bedSheetMat);
  singlePillow.position.set(sbX, localFloorY + 0.48, sbZ - 0.72);
  secondRoomOwnFurniture.add(singlePillow);

  const dresser2Base = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.76, 0.85), mats.woodDoorPBR);
  dresser2Base.position.set(0.05, localFloorY + 0.38, 5.45);
  secondRoomOwnFurniture.add(dresser2Base);

  const dresser2Mirror = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.68, 0.65), mats.mirrorMat);
  dresser2Mirror.position.set(-0.15, localFloorY + 1.10, 5.45);
  secondRoomOwnFurniture.add(dresser2Mirror);

  tagGroupUserData(secondRoomOwnFurniture, {
    type: 'mobiliario_propio',
    name: '2do Ambiente en Planta Alta (+2.88m): 1 Cama de 1 Plaza (0.90×1.90m) + Tocador de Dormitorio #2 con Espejo (Inventario Propio Ruth y Leo)',
    dimensions: 'Cama 1 Plaza 0.90m × 1.90m + Tocador con Cajones y Espejo 0.85m × 0.42m',
    costo: 'Gs. 0 (Propio de Ruth y Leo — A trasladar)',
    status: 'Propio del Propietario en 2do Piso (Gs. 0 — A trasladar) 📦',
    desc: 'Cama de 1 plaza para huéspedes/descanso y el segundo tocador de dormitorio con espejo instalados en el 2do Piso.'
  });
  plantaAltaArchGroup.add(secondRoomOwnFurniture);

  // G6. ADICIONAL CLAVE A PRESUPUESTAR EN 2DO PISO: Placares Empotrados Piso-Techo (No disponibles en mudanza)
  if (isAtLeast350) {
    const budgetedClosetsGroup = new THREE.Group();

    const closetSuite = new THREE.Mesh(new THREE.BoxGeometry(2.10, 2.40, 0.58), mats.woodDoorPBR);
    closetSuite.position.set(-2.35, localFloorY + 1.22, 7.90);
    budgetedClosetsGroup.add(closetSuite);

    const closetSecond = new THREE.Mesh(new THREE.BoxGeometry(1.65, 2.40, 0.56), mats.woodDoorPBR);
    closetSecond.position.set(1.15, localFloorY + 1.22, 11.75);
    budgetedClosetsGroup.add(closetSecond);

    if (isAtLeast440) {
      const acSplit = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.28, 0.92), mats.ceramicSanitaryMat);
      acSplit.position.set(-4.65, localFloorY + 2.18, 9.85);
      budgetedClosetsGroup.add(acSplit);
    }

    tagGroupUserData(budgetedClosetsGroup, {
      type: 'adicional_a_presupuestar',
      name: 'Placares Empotrados de Dormitorio en 2do Piso (Adicional a Presupuestar — No disponible en mudanza)',
      dimensions: '2 Placares Piso-Techo en Melamina Texturada (2.10×2.40m en Suite + 1.65×2.40m en 2do Ambiente PA)',
      costo: 'Gs. 9.600.000 (2 Placares completos — A Presupuestar)',
      status: 'Adicional Clave a Presupuestar 🛠️',
      desc: 'Como Ruth y Leo no cuentan con placares ni roperos en su mudanza actual (solo 2 tocadores y 2 mesas de luz), se prevé e incluye en el presupuesto de terminación la carpintería de 2 placares piso-techo en el 2do Piso.'
    });
    plantaAltaArchGroup.add(budgetedClosetsGroup);
  }

  // ============================================================================
  // G7. ELEMENTOS ESPECIALES SOLICITADOS POR RUTH Y LEO:
  //     - BIBLIOTECA DE 4 ESTANTES DE 2,00 METROS CADA UNO (8,00+ METROS LINEALES)
  //     - EMMA (CANICHE / POODLE) Y SERAFINA (GATA CALICÓ TRICOLOR)
  //     - MACETAS / FLOREROS CHICOS CON PLANTAS "ESPADA DE SAN JORGE" (Sansevieria)
  //     - SISTEMA DE ALARMA PET-IMMUNE (INMUNE A EMMA Y SERAFINA)
  // ============================================================================
  // 1) Biblioteca #1 de 4 estantes de 2,00m cada uno en la Gran Sala Social (sobre el muro Oeste firme x = -4.66m, z = 8.65m — Corrección Arq. Interior)
  groups.archMain.add(
    createLibrary4Shelves2m3D(THREE, mats, -4.66, 0.03, 8.65, Math.PI / 2, 'Gran Sala Social Nivel Calle (Muro Oeste z=7.55..9.60m)')
  );
  // 2) Biblioteca #2 de 4 estantes de 2,00m cada uno en el Sector Estudio / Home-Office del 2do Piso (sobre tabique divisorio sólido x = -0.35m, z = 8.55m — Corrección Arq. Interior)
  plantaAltaArchGroup.add(
    createLibrary4Shelves2m3D(THREE, mats, -0.35, localFloorY, 8.55, Math.PI / 2, 'Sector Estudio / Home-Office 2do Piso (Tabique Sólido x=-0.55m)')
  );

  // 2) Las Mascotas de Ruth y Leo: Emma (Caniche) y Serafina (Gata Calicó) en la Gran Sala Social
  groups.archMain.add(createEmmaPoodle3D(THREE, mats, 0.72, 0.03, 5.15, 0.45));
  groups.archMain.add(createSerafinaCalicoCat3D(THREE, mats, 2.55, 0.03, 6.45, -0.65));

  // 3) Floreros / Macetas Chicas con Plantas "Espada de San Jorge" (Sansevieria trifasciata) en distintos puntos de la casa
  // Sobre la Mesa Cuadrada de Florero y Libros (reemplaza/complementa con Sansevieria real)
  groups.archMain.add(createSansevieriaPot3D(THREE, mats, 0.12, 0.64, 3.42, 0.72, 'Mesa Cuadrada de Florero y Libros'));
  // Sobre la Mesa Ratona de la Sala
  groups.archMain.add(createSansevieriaPot3D(THREE, mats, 1.75, 0.44, 5.45, 0.68, 'Mesa Ratona de Sala'));
  // Junto al Recibidor / Ventanal Frontal de la Gran Sala
  groups.archMain.add(createSansevieriaPot3D(THREE, mats, 1.65, 0.03, 3.35, 1.05, 'Recibidor Puerta Principal'));
  // En la Galería Panorámica al Río (Losa L1)
  groups.archMain.add(createSansevieriaPot3D(THREE, mats, -1.85, -0.42, 10.45, 1.15, 'Galería Panorámica al Río'));
  // En el Dormitorio en Suite y Estudio del 2do Piso (+2.88m)
  plantaAltaArchGroup.add(createSansevieriaPot3D(THREE, mats, -0.90, localFloorY + 0.76, 8.60, 0.70, 'Tocador Dormitorio Suite 2do Piso'));
  plantaAltaArchGroup.add(createSansevieriaPot3D(THREE, mats, 0.45, localFloorY + 0.76, 6.40, 0.68, 'Escritorio Estudio 2do Piso'));

  // 4) Sistema Completo de Alarma Pet-Immune (Central + Teclado, Sirenas Estroboscópicas y Sensores PIR Pet-Immune)
  groups.archMain.add(createPetImmuneAlarmSystem3D(THREE, mats));

  // ============================================================================
  // H. JARDÍN CON CÉSPED ESMERALDA, PISCINA (4.65×2.45m) Y QUINCHO EN EL PATIO
  // ============================================================================
  const patioRefs = buildPatioPoolAndQuincho3D(
    THREE,
    groups.archMain,
    mats,
    scenarioKey,
    forceShowPoolQuincho
  );

  return patioRefs;
}

