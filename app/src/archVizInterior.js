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
    label: 'Fachada Ciega, Portón Balancín 2.30m, Pérgola Antigranizo y Rejilla Oxigenación',
    pos: [4.8, 2.8, -10.5],
    target: [1.2, 0.8, 1.0],
    cutaway: 'full'
  },
  escalera_subsuelo: {
    label: 'Escaleras en Costados Opuestos (Escalera 1 Sur Eje 8–9 ↔ Escalera 2 Norte Eje 1–2)',
    pos: [0.0, 2.8, 3.4],
    target: [0.0, 0.2, 7.2],
    cutaway: 'cut_roof'
  },
  estar_comedor: {
    label: 'Planta Baja (0.00m): Estar (Eje 1–5) + Cocina/Comedor (Eje 5–9) + SSHH Social (Eje F–G)',
    pos: [0.6, 3.1, 3.3],
    target: [1.2, 0.85, 7.2],
    cutaway: 'cut_pa'
  },
  cocina_isla: {
    label: 'Planta Baja (0.00m): Cocina/Comedor (6.20×2.75m s/ Eje F–G) + SSHH Social',
    pos: [-0.8, 2.7, 8.8],
    target: [-2.8, 0.95, 3.8],
    cutaway: 'cut_pa'
  },
  bano_suite: {
    label: '2do Piso (+2.88m): Núcleo Húmedo Eje F–G (Vestidor + Baño en Suite + SSHH 2)',
    pos: [-0.5, 5.5, 6.8],
    target: [-1.5, 3.65, 3.8],
    cutaway: 'cut_roof'
  },
  dormitorio_suite: {
    label: '2do Piso (+2.88m): Suite Principal (Eje 5–9) + Dormitorio 2 (Eje 2–5) + Desk (Eje 1–2)',
    pos: [3.8, 5.8, 4.5],
    target: [-1.2, 3.55, 8.2],
    cutaway: 'cut_roof'
  },
  galeria_parrilla: {
    label: 'Galería Panorámica al Río (Losa L1 Limpia) + Parrillita Inferior en Subsuelo',
    pos: [0.5, 1.65, 16.8],
    target: [-1.5, -0.6, 11.8],
    cutaway: 'cut_pa'
  },
  piscina_quincho: {
    label: 'Piscina (4.65×2.45m) + Parrillita Subsuelo y Jardín con Césped',
    pos: [-5.2, 3.2, 24.8],
    target: [0.2, -1.8, 16.2],
    cutaway: 'full',
    forceShowPoolQuincho: true
  },
  subsuelo_depto: {
    label: 'Subsuelo Libre 100 m² (-2.34m): Parrillita al Patio + Lavadero + Depósito + Rejilla Oxigenación',
    pos: [-2.2, 0.8, 15.8],
    target: [-2.8, -1.6, 10.5],
    cutaway: 'cut_pb'
  },
  planta_alta: {
    label: '2do Piso Completo (+2.88m): 2 Dormitorios + Desk + 2 Baños + Vestidor + Terraza al Río',
    pos: [5.6, 6.4, 15.8],
    target: [-0.4, 3.6, 8.2],
    cutaway: 'cut_roof'
  },
  corte_estructural: {
    label: 'Corte Longitudinal Estructural Completo (3 Niveles + Núcleo Húmedo Eje F–G)',
    pos: [19.5, 4.8, 7.5],
    target: [0.0, 0.8, 7.5],
    cutaway: 'longitudinal_section'
  }
};

/**
 * Crea un trío de texturas Canvas 1024x1024 (diffuse map + bumpMap + roughnessMap) con repetición PBR estilo GTA VI
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

  const roughCanvas = document.createElement('canvas');
  roughCanvas.width = size;
  roughCanvas.height = size;
  const roughCtx = roughCanvas.getContext('2d');
  roughCtx.fillStyle = '#b0b0b0';
  roughCtx.fillRect(0, 0, size, size);

  drawFn(diffCtx, bumpCtx, size, roughCtx);

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

  const roughnessMap = new THREE.CanvasTexture(roughCanvas);
  roughnessMap.wrapS = THREE.RepeatWrapping;
  roughnessMap.wrapT = THREE.RepeatWrapping;
  roughnessMap.repeat.set(repeatX, repeatY);
  roughnessMap.anisotropy = 8;

  return { map, bumpMap, roughnessMap };
}

/**
 * Textura PBR Procedural Estilo GTA VI #1: Asfalto Húmedo con Charcos Sutiles y Desgaste Vehicular (`createGtaAsphaltTexture`)
 */
export function createGtaAsphaltTexture(THREE, repeatX = 4, repeatY = 2) {
  return makeProceduralTexturePair(
    THREE,
    (ctx, bCtx, s, rCtx) => {
      // Base: mortero de asiento y tierra colorada asuncena entre piedras basálticas
      ctx.fillStyle = '#5c493e';
      ctx.fillRect(0, 0, s, s);
      bCtx.fillStyle = '#404040';
      bCtx.fillRect(0, 0, s, s);
      rCtx.fillStyle = '#d4d4d4';
      rCtx.fillRect(0, 0, s, s);

      // Empedrado tradicional paraguayo de piedra basáltica hexagonal/irregular (visto en Street View 1950 Tte. Guillermo Arias)
      const rows = 22;
      const cols = 18;
      const cellW = s / cols;
      const cellH = s / rows;

      for (let r = 0; r < rows; r++) {
        const shift = (r % 2) * (cellW * 0.48);
        for (let c = -1; c <= cols; c++) {
          const seed = (r * 37 + c * 73 + 101) % 97;
          const cx = c * cellW + shift + ((seed % 7) - 3) * 1.8;
          const cy = r * cellH + (((seed * 3) % 7) - 3) * 1.8;
          const rw = cellW * (0.37 + (seed % 5) * 0.015);
          const rh = cellH * (0.36 + ((seed * 2) % 5) * 0.015);

          // Tono de basalto gris-azulado con pátina de polvo rojizo de Itá Pytã Punta
          const baseGray = 52 + (seed % 34);
          const warmTint = (seed % 15);
          ctx.fillStyle = `rgb(${baseGray + warmTint}, ${baseGray + Math.floor(warmTint * 0.5)}, ${baseGray})`;
          ctx.beginPath();
          ctx.ellipse(cx, cy, rw, rh, ((seed % 11) - 5) * 0.06, 0, Math.PI * 2);
          ctx.fill();

          // Relieve 3D pronunciado de cada piedra basáltica en el bumpMap
          const bGrad = bCtx.createRadialGradient(cx - 3, cy - 3, 2, cx, cy, rw);
          bGrad.addColorStop(0, '#f0f0f0');
          bGrad.addColorStop(0.75, '#a8a8a8');
          bGrad.addColorStop(1, '#282828');
          bCtx.fillStyle = bGrad;
          bCtx.beginPath();
          bCtx.ellipse(cx, cy, rw, rh, 0, 0, Math.PI * 2);
          bCtx.fill();
        }
      }

      // Franjas laterales de arena rojiza de Itá Pytã Punta lavada junto a los cordones (tal como en Street View)
      const sandTop = ctx.createLinearGradient(0, 0, 0, s * 0.22);
      sandTop.addColorStop(0, 'rgba(176, 112, 82, 0.88)');
      sandTop.addColorStop(0.6, 'rgba(164, 105, 76, 0.45)');
      sandTop.addColorStop(1, 'rgba(164, 105, 76, 0)');
      ctx.fillStyle = sandTop;
      ctx.fillRect(0, 0, s, s * 0.22);

      const sandBot = ctx.createLinearGradient(0, s, 0, s * 0.76);
      sandBot.addColorStop(0, 'rgba(176, 112, 82, 0.90)');
      sandBot.addColorStop(0.6, 'rgba(164, 105, 76, 0.50)');
      sandBot.addColorStop(1, 'rgba(164, 105, 76, 0)');
      ctx.fillStyle = sandBot;
      ctx.fillRect(0, s * 0.76, s, s * 0.24);

      // Huellas de rodadura pulidas en el centro de la calzada
      ctx.fillStyle = 'rgba(30, 35, 44, 0.28)';
      ctx.fillRect(0, s * 0.26, s, s * 0.14);
      ctx.fillRect(0, s * 0.58, s, s * 0.14);

      // Charcos sutiles reflectivos estilo GTA VI entre el empedrado
      const puddles = [
        [220, 340, 135, 65],
        [680, 660, 165, 75],
        [490, 260, 105, 50],
        [820, 390, 120, 60]
      ];
      puddles.forEach(([px, py, rx, ry]) => {
        const pGrad = ctx.createRadialGradient(px, py, 10, px, py, rx);
        pGrad.addColorStop(0, 'rgba(22, 30, 44, 0.72)');
        pGrad.addColorStop(0.7, 'rgba(38, 45, 58, 0.35)');
        pGrad.addColorStop(1, 'rgba(30, 41, 59, 0)');
        ctx.fillStyle = pGrad;
        ctx.beginPath();
        ctx.ellipse(px, py, rx, ry, 0.15, 0, Math.PI * 2);
        ctx.fill();

        const rGrad = rCtx.createRadialGradient(px, py, 8, px, py, rx);
        rGrad.addColorStop(0, '#101010');
        rGrad.addColorStop(0.75, '#353535');
        rGrad.addColorStop(1, '#d4d4d4');
        rCtx.fillStyle = rGrad;
        rCtx.beginPath();
        rCtx.ellipse(px, py, rx, ry, 0.15, 0, Math.PI * 2);
        rCtx.fill();

        bCtx.fillStyle = '#808080';
        bCtx.beginPath();
        bCtx.ellipse(px, py, rx * 0.85, ry * 0.85, 0.15, 0, Math.PI * 2);
        bCtx.fill();
      });
    },
    repeatX,
    repeatY
  );
}

/**
 * Textura PBR Procedural Estilo GTA VI #2: Ladrillo Cerámico Paraguayo de Tobatí (`createParaguayanBrickTexture`)
 */
export function createParaguayanBrickTexture(THREE, repeatX = 3, repeatY = 2) {
  return makeProceduralTexturePair(
    THREE,
    (ctx, bCtx, s, rCtx) => {
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(0, 0, s, s);
      bCtx.fillStyle = '#262626';
      bCtx.fillRect(0, 0, s, s);
      rCtx.fillStyle = '#dcdcdc';
      rCtx.fillRect(0, 0, s, s);

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
          rCtx.fillStyle = '#b4b4b4';
          rCtx.fillRect(bx, by, bw, bh);
        }
      }
    },
    repeatX,
    repeatY
  );
}

/**
 * Textura PBR Procedural Estilo GTA VI #3: Hormigón Visto Encofrado en Tablas (`createBoardFormedConcreteTexture`)
 */
export function createBoardFormedConcreteTexture(THREE, repeatX = 2, repeatY = 2) {
  return makeProceduralTexturePair(
    THREE,
    (ctx, bCtx, s, rCtx) => {
      ctx.fillStyle = '#949ca6';
      ctx.fillRect(0, 0, s, s);
      bCtx.fillStyle = '#808080';
      bCtx.fillRect(0, 0, s, s);
      rCtx.fillStyle = '#a8a8a8';
      rCtx.fillRect(0, 0, s, s);

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
          rCtx.fillStyle = i % 2 === 0 ? '#909090' : '#c0c0c0';
          rCtx.fillRect(rx, ry, 20, 2);
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
    repeatX,
    repeatY
  );
}

/**
 * Textura PBR Procedural Estilo GTA VI #4: Follaje Subtropical Denso y Enredaderas (`createLushFoliageTexture`)
 */
export function createLushFoliageTexture(THREE, repeatX = 4, repeatY = 4) {
  return makeProceduralTexturePair(
    THREE,
    (ctx, bCtx, s, rCtx) => {
      ctx.fillStyle = '#14532d';
      ctx.fillRect(0, 0, s, s);
      bCtx.fillStyle = '#505050';
      bCtx.fillRect(0, 0, s, s);
      rCtx.fillStyle = '#909090';
      rCtx.fillRect(0, 0, s, s);

      const leafColors = ['#166534', '#15803d', '#16a34a', '#22c55e', '#4ade80'];
      for (let i = 0; i < 3800; i++) {
        const lx = (i * 83 + Math.floor(i / 19) * 29) % s;
        const ly = (i * 59 + Math.floor(i / 17) * 41) % s;
        const angle = ((i * 37) % 360) * (Math.PI / 180);
        ctx.save();
        ctx.translate(lx, ly);
        ctx.rotate(angle);
        ctx.fillStyle = leafColors[i % leafColors.length];
        ctx.beginPath();
        ctx.ellipse(0, 0, 14, 7, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        bCtx.fillStyle = i % 2 === 0 ? '#d8d8d8' : '#787878';
        bCtx.fillRect(lx - 5, ly - 5, 10, 10);
      }
    },
    repeatX,
    repeatY
  );
}

/**
 * Textura PBR Procedural Estilo GTA VI #5: Superficie de Agua y Ondas del Río Paraguay (`createWaterShaderTexture`)
 */
export function createWaterShaderTexture(THREE, repeatX = 8, repeatY = 8) {
  return makeProceduralTexturePair(
    THREE,
    (ctx, bCtx, s, rCtx) => {
      ctx.fillStyle = '#0369a1';
      ctx.fillRect(0, 0, s, s);
      bCtx.fillStyle = '#808080';
      bCtx.fillRect(0, 0, s, s);
      rCtx.fillStyle = '#181818';
      rCtx.fillRect(0, 0, s, s);

      for (let i = 0; i < 1400; i++) {
        const wx = (i * 79) % s;
        const wy = (i * 47 + Math.floor(i / 14) * 23) % s;
        const rw = 36 + (i % 45);
        const rh = 8 + (i % 10);
        ctx.fillStyle = i % 3 === 0 ? 'rgba(56, 189, 248, 0.16)' : 'rgba(12, 74, 110, 0.22)';
        ctx.beginPath();
        ctx.ellipse(wx, wy, rw, rh, 0.08, 0, Math.PI * 2);
        ctx.fill();

        bCtx.fillStyle = i % 2 === 0 ? '#c8c8c8' : '#404040';
        bCtx.beginPath();
        bCtx.ellipse(wx, wy, rw * 0.8, rh * 0.8, 0.08, 0, Math.PI * 2);
        bCtx.fill();
      }
    },
    repeatX,
    repeatY
  );
}

/**
 * Genera el catálogo completo de materiales PBR de alta definición para estructura, muros, pisos, jardín, piscina y mobiliario
 */
export function createArchVizMaterials(THREE) {
  // 1. Hormigón Visto Encofrado (concretePBR)
  const concreteTex = createBoardFormedConcreteTexture(THREE, 2, 2);

  // 2. Mampostería de Ladrillo Cerámico Paraguayo (brickPBR)
  const brickTex = createParaguayanBrickTexture(THREE, 3, 2);

  // 2B. Asfalto Húmedo GTA VI con Charcos Sutiles + Follaje Subtropical + Agua Río
  const gtaAsphaltTex = createGtaAsphaltTexture(THREE, 5, 2);
  const lushFoliageTex = createLushFoliageTexture(THREE, 4, 4);
  const riverWaterTex = createWaterShaderTexture(THREE, 10, 10);

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

  // 10. Rejilla Metálica Electroforjada Galvanizada Antideslizante (`gratingTex`) para Trinchera de Oxigenación z=1.50..3.00m
  const gratingTex = makeProceduralTexturePair(
    THREE,
    (ctx, bCtx, s, rCtx) => {
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(0, 0, s, s);
      bCtx.fillStyle = '#101010';
      bCtx.fillRect(0, 0, s, s);
      rCtx.fillStyle = '#707070';
      rCtx.fillRect(0, 0, s, s);

      const step = 32;
      ctx.fillStyle = '#94a3b8';
      bCtx.fillStyle = '#e5e5e5';
      rCtx.fillStyle = '#383838';
      for (let x = 0; x < s; x += step) {
        ctx.fillRect(x, 0, 8, s);
        bCtx.fillRect(x, 0, 8, s);
        rCtx.fillRect(x, 0, 8, s);
      }
      ctx.fillStyle = '#cbd5e1';
      for (let y = 0; y < s; y += step * 2) {
        ctx.fillRect(0, y, s, 6);
        bCtx.fillRect(0, y, s, 6);
      }
    },
    10,
    3
  );

  return {
    concretePBR: new THREE.MeshStandardMaterial({
      map: concreteTex.map,
      bumpMap: concreteTex.bumpMap,
      roughnessMap: concreteTex.roughnessMap,
      bumpScale: 0.015,
      roughness: 0.68,
      metalness: 0.08
    }),
    concreteFoundationPBR: new THREE.MeshStandardMaterial({
      map: concreteTex.map,
      bumpMap: concreteTex.bumpMap,
      roughnessMap: concreteTex.roughnessMap,
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
      roughnessMap: brickTex.roughnessMap,
      bumpScale: 0.025,
      roughness: 0.85,
      metalness: 0.04
    }),
    brickWallPBR: new THREE.MeshStandardMaterial({
      map: brickTex.map,
      bumpMap: brickTex.bumpMap,
      roughnessMap: brickTex.roughnessMap,
      bumpScale: 0.025,
      roughness: 0.85,
      metalness: 0.04
    }),
    gtaAsphaltPBR: new THREE.MeshStandardMaterial({
      map: gtaAsphaltTex.map,
      bumpMap: gtaAsphaltTex.bumpMap,
      roughnessMap: gtaAsphaltTex.roughnessMap,
      bumpScale: 0.018,
      roughness: 0.72,
      metalness: 0.14
    }),
    lushFoliagePBR: new THREE.MeshStandardMaterial({
      map: lushFoliageTex.map,
      bumpMap: lushFoliageTex.bumpMap,
      roughnessMap: lushFoliageTex.roughnessMap,
      bumpScale: 0.022,
      roughness: 0.65,
      metalness: 0.04
    }),
    riverWaterShaderMat: new THREE.MeshPhysicalMaterial({
      map: riverWaterTex.map,
      bumpMap: riverWaterTex.bumpMap,
      bumpScale: 0.025,
      color: 0x0369a1,
      roughness: 0.08,
      metalness: 0.15,
      clearcoat: 0.95,
      clearcoatRoughness: 0.08,
      reflectivity: 0.95
    }),
    galvanizedGratingPBR: new THREE.MeshStandardMaterial({
      map: gratingTex.map,
      bumpMap: gratingTex.bumpMap,
      roughnessMap: gratingTex.roughnessMap,
      bumpScale: 0.025,
      metalness: 0.78,
      roughness: 0.34
    }),
    graphiteSheetGatePBR: new THREE.MeshStandardMaterial({
      color: 0x27272a,
      roughness: 0.34,
      metalness: 0.76
    }),
    polycarbonateRoofMat: new THREE.MeshPhysicalMaterial({
      color: 0xe0f2fe,
      roughness: 0.15,
      metalness: 0.08,
      transmission: 0.68,
      transparent: true,
      opacity: 0.52,
      ior: 1.58,
      clearcoat: 0.8
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
 * 1. FACHADA FRONTAL CIEGA, PORTÓN VEHICULAR ANGOSTO (2.30m) + PUERTA PEATONAL (0.95m) Y PÉRGOLA CON ENREDADERA Y POLICARBONATO (z = -4.00m)
 */
export function buildFacadeAndGate3D(THREE, targetGroup, mats, scenarioKey = 'escenario300') {
  const facadeGroup = new THREE.Group();
  facadeGroup.name = 'fachada_y_porton';

  const isUpgradedGate = ['escenario350', 'escenario370', 'escenario440', 'edifica460', 'edifica573'].includes(scenarioKey);
  const isAdvancedExterior = ['escenario440', 'edifica460', 'edifica573'].includes(scenarioKey);
  const isFullExterior573 = scenarioKey === 'edifica573';

  // 1A. Vereda Reglamentaria (9.89m × 2.00m) + Canasto Basurero Metálico Elevado sobre Calle Tte. Guillermo Arias
  if (scenarioKey !== 'hoy_en_obra') {
    const sidewalkGroup = new THREE.Group();
    const sidewalkMat = isFullExterior573 ? mats.porcelainPBR : mats.concretePBR;

    const sidewalk = new THREE.Mesh(new THREE.BoxGeometry(9.89, 0.16, 2.00), sidewalkMat);
    sidewalk.position.set(0, -0.02, -5.00);
    sidewalk.receiveShadow = true;
    sidewalkGroup.add(sidewalk);

    const curb = new THREE.Mesh(new THREE.BoxGeometry(9.89, 0.18, 0.15), mats.concreteFoundationPBR);
    curb.position.set(0, -0.01, -5.95);
    sidewalkGroup.add(curb);

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

  // 1B. MURALLA FRONTAL CIEGA (100% OPACA HACIA LA CALLE) SOBRE LÍNEA MUNICIPAL (z = -4.00m)
  const wallMat = isFullExterior573
    ? mats.stoneWallPBR
    : isAdvancedExterior
      ? mats.plasterExteriorPBR
      : mats.plasterRoughPBR;

  const murallaData = {
    type: 'fachada_exterior',
    bankCategory: 'existente_negro',
    name: 'Muralla Frontal Ciega de Mampostería Revocada (100% Privacidad Visual desde la Calle • z = -4.00m)',
    dimensions: 'Frente 9.89m × Altura 2.25m + Pilar Central de Mampostería entre Portón Vehicular y Peatonal',
    costo: isFullExterior573 ? 'Gs. 10.677.500 (Ítem 20 Presupuesto Completo)' : 'Gs. 0 (Muralla Existente en Obra)',
    status: 'Privacidad 100% Opaca desde Calle Tte. Guillermo Arias 🔒🛡️',
    desc: 'Muralla perimetral ciega sobre línea municipal (z = -4.00m) con paño izquierdo ciego (x = -4.95..-2.20m), pilar central de mampostería revocada (x = -1.25..+1.20m) con medidor ANDE y portero eléctrico, y machón derecho (x = +3.50..+4.95m).'
  };

  // Tramo izquierdo ciego (x = -4.95m a -2.20m, ancho 2.75m)
  const leftBlindWall = new THREE.Mesh(new THREE.BoxGeometry(2.75, 2.25, 0.25), wallMat);
  leftBlindWall.position.set(-3.575, 1.125, -4.00);
  leftBlindWall.userData = murallaData;
  facadeGroup.add(leftBlindWall);

  // Pilar central / machón de mampostería entre puerta peatonal y portón vehicular (x = -1.25m a +1.20m, ancho 2.45m)
  const centerMasonryWall = new THREE.Mesh(new THREE.BoxGeometry(2.45, 2.35, 0.28), wallMat);
  centerMasonryWall.position.set(-0.025, 1.175, -4.00);
  centerMasonryWall.userData = murallaData;
  facadeGroup.add(centerMasonryWall);

  // Pilar derecho de mampostería (x = +3.50m a +4.95m, ancho 1.45m)
  const rightMasonryWall = new THREE.Mesh(new THREE.BoxGeometry(1.45, 2.35, 0.28), wallMat);
  rightMasonryWall.position.set(4.225, 1.175, -4.00);
  rightMasonryWall.userData = murallaData;
  facadeGroup.add(rightMasonryWall);

  // Viga dintel superior corrida sobre toda la fachada frontal (z = -4.00m)
  const frontLintel = new THREE.Mesh(new THREE.BoxGeometry(9.89, 0.26, 0.34), mats.concretePBR);
  frontLintel.position.set(0, 2.42, -4.00);
  frontLintel.userData = murallaData;
  facadeGroup.add(frontLintel);

  // Caja de Medidor ANDE + Portero Eléctrico sobre el pilar central de mampostería
  const meterBox = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.38, 0.12), mats.blackMetalMat);
  meterBox.position.set(-0.65, 1.55, -4.15);
  facadeGroup.add(meterBox);

  const intercom = new THREE.Mesh(new THREE.BoxGeometry(0.10, 0.16, 0.05), mats.stainlessMat);
  intercom.position.set(-0.98, 1.42, -4.15);
  facadeGroup.add(intercom);

  const gateMat = mats.graphiteSheetGatePBR || mats.blackMetalMat;

  // 1C. PUERTA PEATONAL CIEGA EN CHAPA PLEGADA HORIZONTAL GRAFITO (x = -2.20m a -1.25m, ancho 0.95m × alto 2.10m)
  const pedGateGroup = new THREE.Group();
  const pedW = 0.95;
  const pedH = 2.15;
  const pedX = -1.725;

  const pedPanel = new THREE.Mesh(new THREE.BoxGeometry(pedW - 0.04, pedH - 0.32, 0.05), gateMat);
  pedPanel.position.set(pedX, (pedH - 0.32) / 2 + 0.02, -4.00);
  pedGateGroup.add(pedPanel);

  // Celosía superior de ventilación en puerta peatonal
  for (let l = 0; l < 3; l++) {
    const louver = new THREE.Mesh(new THREE.BoxGeometry(pedW - 0.08, 0.035, 0.06), gateMat);
    louver.position.set(pedX, pedH - 0.24 + l * 0.08, -4.00);
    louver.rotation.x = 0.35;
    pedGateGroup.add(louver);
  }

  const pedHandle = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.65, 12), mats.stainlessMat);
  pedHandle.position.set(pedX + 0.34, 1.05, -4.05);
  pedGateGroup.add(pedHandle);

  tagGroupUserData(pedGateGroup, {
    type: 'fachada_exterior',
    bankCategory: 'existente_negro',
    name: 'Puerta Peatonal Ciega en Chapa Plegada Horizontal Gris Grafito Oscuro (0.95m × 2.15m)',
    dimensions: '0.95m × 2.15m (x = -2.20m a -1.25m • Línea Municipal z = -4.00m)',
    costo: 'Gs. 0 (Puerta Peatonal Existente en Obra)',
    status: 'Chapa Plegada Horizontal Ciega + Celosía Superior de Ventilación 🔒',
    desc: 'Puerta peatonal haciendo juego con el portón vehicular en chapa plegada horizontal color gris grafito oscuro (#1f242b), garantizando privacidad total hacia el interior.'
  });
  facadeGroup.add(pedGateGroup);

  // 1D. PORTÓN VEHICULAR BASCULANTE ANGOSTO DE 1 VEHÍCULO EN CHAPA PLEGADA HORIZONTAL CIEGA (x = +1.20m a +3.50m, ancho 2.30m × alto 2.15m)
  const gateGroup = new THREE.Group();
  const gateW = 2.30;
  const gateH = 2.15;
  const gateX = 2.35;

  const frameLeft = new THREE.Mesh(new THREE.BoxGeometry(0.09, gateH, 0.10), mats.blackMetalMat);
  frameLeft.position.set(gateX - gateW / 2, gateH / 2, -4.00);
  gateGroup.add(frameLeft);

  const frameRight = new THREE.Mesh(new THREE.BoxGeometry(0.09, gateH, 0.10), mats.blackMetalMat);
  frameRight.position.set(gateX + gateW / 2, gateH / 2, -4.00);
  gateGroup.add(frameRight);

  // Hoja ciega de chapa plegada horizontal (sin barrotes abiertos)
  const blindSheet = new THREE.Mesh(new THREE.BoxGeometry(gateW - 0.12, gateH - 0.34, 0.055), gateMat);
  blindSheet.position.set(gateX, (gateH - 0.34) / 2 + 0.03, -4.00);
  gateGroup.add(blindSheet);

  // Costillas horizontales de chapa plegada para relieve arquitectónico realista
  for (let r = 0; r < 9; r++) {
    const rib = new THREE.Mesh(new THREE.BoxGeometry(gateW - 0.14, 0.028, 0.072), gateMat);
    rib.position.set(gateX, 0.16 + r * 0.19, -4.00);
    gateGroup.add(rib);
  }

  // Celosía horizontal de ventilación únicamente en la franja superior del portón
  for (let l = 0; l < 3; l++) {
    const louver = new THREE.Mesh(new THREE.BoxGeometry(gateW - 0.16, 0.04, 0.065), gateMat);
    louver.position.set(gateX, gateH - 0.24 + l * 0.08, -4.00);
    louver.rotation.x = 0.35;
    gateGroup.add(louver);
  }

  tagGroupUserData(gateGroup, {
    type: 'fachada_exterior',
    bankCategory: 'existente_negro',
    name: 'Portón Vehicular Basculante Ciego en Chapa Plegada Horizontal Gris Grafito (2.30m × 2.15m • 1 Vehículo)',
    dimensions: 'Ancho 2.30m × Alto 2.15m (x = +1.20m a +3.50m • Paso para 1 vehículo con privacidad 100% ciega)',
    costo: 'Gs. 0 (Portón Vehicular Existente en Obra — Color Negro en Carpeta Banco)',
    status: isUpgradedGate
      ? 'Chapa Plegada Horizontal Grafito Oscuro (#1f242b) + Motor Automatizador ✨'
      : 'Portón Basculante Ciego YA EXISTENTE en Obra 🔒',
    desc: 'Portón vehicular basculante angosto de 2,30m de ancho en chapa plegada horizontal ciega color gris grafito oscuro con celosía superior de ventilación, brindando 100% de privacidad visual desde la calle.'
  });
  facadeGroup.add(gateGroup);

  // 1D-Bis. Motor Automatizador para el Portón Basculante (x = +3.45m)
  if (scenarioKey !== 'hoy_en_obra') {
    const motorKitGroup = new THREE.Group();

    const driveRail = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.55, 0.08), mats.stainlessMat);
    driveRail.position.set(3.45, 1.25, -3.91);
    motorKitGroup.add(driveRail);

    const motorHead = new THREE.Mesh(
      new THREE.BoxGeometry(0.22, 0.34, 0.20),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.35, metalness: 0.6 })
    );
    motorHead.position.set(3.36, 1.62, -3.86);
    motorKitGroup.add(motorHead);

    const actuatorArm = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.58, 0.05), mats.chromeMat);
    actuatorArm.position.set(3.43, 1.38, -3.95);
    actuatorArm.rotation.x = 0.22;
    motorKitGroup.add(actuatorArm);

    tagGroupUserData(motorKitGroup, {
      type: 'automatizacion_porton',
      bankCategory: 'nuevo_rojo',
      name: 'Motor Automatizador Rápido para Portón Basculante (2.30m) + Traba Eléctrica y Fotocélula',
      dimensions: 'Riel 1.55m + Motor Electromecánico JetFlex + Central + 2 Controles',
      costo: 'Gs. 2.450.000 (Kit Motor Portón Basculante Instalado)',
      status: 'Equipamiento Nuevo a Instalar sobre Portón Existente ⚡🚪',
      desc: 'Kit de motorización rápida acoplado al parante derecho del portón vehicular de 2,30m.'
    });
    facadeGroup.add(motorKitGroup);
  }

  // 1E. PÉRGOLA DE MADERA DURA CON ENREDADERA VERDE TUPIDA (SANTA RITA / JAZMÍN) + CHAPA TRANSLÚCIDA DE POLICARBONATO ANTIGRANIZO
  //     Cubre la cochera y el acceso peatonal (x = -0.50m..+4.50m, z = -3.80m..+2.80m, Y = +2.55m..+2.75m)
  const pergolaGroup = new THREE.Group();
  const pMinX = -0.50;
  const pMaxX = 4.50;
  const pMinZ = -3.80;
  const pMaxZ = 2.80;
  const pW = pMaxX - pMinX; // 5.00m
  const pD = pMaxZ - pMinZ; // 6.60m
  const pCenterX = (pMinX + pMaxX) / 2; // +2.00m
  const pCenterZ = (pMinZ + pMaxZ) / 2; // -0.50m
  const pY = 2.55;

  // Columnas de soporte de madera dura / acero en los bordes del estacionamiento
  [
    [pMinX + 0.12, -3.65],
    [pMaxX - 0.12, -3.65],
    [pMinX + 0.12, 1.35],
    [pMaxX - 0.12, 1.35]
  ].forEach(([cx, cz]) => {
    const col = new THREE.Mesh(new THREE.BoxGeometry(0.14, pY, 0.14), mats.woodDoorPBR);
    col.position.set(cx, pY / 2, cz);
    col.castShadow = true;
    pergolaGroup.add(col);
  });

  // Vigas maestras longitudinales de madera dura (Lapacho/Ybyrapytã)
  [pMinX + 0.12, pCenterX, pMaxX - 0.12].forEach((bx) => {
    const mainBeam = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.18, pD), mats.woodDoorPBR);
    mainBeam.position.set(bx, pY + 0.04, pCenterZ);
    mainBeam.castShadow = true;
    pergolaGroup.add(mainBeam);
  });

  // 14 Cabios transversales de madera dura
  const numRafters = 14;
  for (let i = 0; i < numRafters; i++) {
    const rz = pMinZ + 0.20 + i * ((pD - 0.40) / (numRafters - 1));
    const rafter = new THREE.Mesh(new THREE.BoxGeometry(pW + 0.20, 0.11, 0.065), mats.woodDeckPBR);
    rafter.position.set(pCenterX, pY + 0.15, rz);
    rafter.castShadow = true;
    pergolaGroup.add(rafter);
  }

  // Chapa Translúcida de Policarbonato Alveolar Antigranizo sobre los cabios (Y = +2.68m)
  const polyRoof = new THREE.Mesh(
    new THREE.BoxGeometry(pW + 0.24, 0.025, pD + 0.15),
    mats.polycarbonateRoofMat || mats.glassBlindexMat
  );
  polyRoof.position.set(pCenterX, pY + 0.22, pCenterZ);
  pergolaGroup.add(polyRoof);

  // Enredadera Verde Tupida (Santa Rita / Jazmín del Paraguay) entrelazada sobre la pérgola
  const vineMat = mats.lushFoliagePBR || mats.grassPBR;
  const flowerMat = new THREE.MeshStandardMaterial({ color: 0xdb2777, roughness: 0.55 }); // Flores fucsia Santa Rita
  for (let vx = 0; vx < 6; vx++) {
    for (let vz = 0; vz < 8; vz++) {
      if ((vx + vz) % 2 === 0 || vx === 0 || vz < 2) {
        const fx = pMinX + 0.45 + vx * 0.82;
        const fz = pMinZ + 0.45 + vz * 0.80;
        const foliageCluster = new THREE.Mesh(
          new THREE.SphereGeometry(0.46 + ((vx * 3 + vz) % 3) * 0.08, 10, 8),
          vineMat
        );
        foliageCluster.scale.set(1.25, 0.32, 1.25);
        foliageCluster.position.set(fx, pY + 0.27, fz);
        foliageCluster.castShadow = true;
        pergolaGroup.add(foliageCluster);

        if ((vx + vz) % 3 === 0) {
          const bloom = new THREE.Mesh(new THREE.SphereGeometry(0.14, 8, 8), flowerMat);
          bloom.scale.set(1.2, 0.5, 1.2);
          bloom.position.set(fx + 0.12, pY + 0.34, fz - 0.08);
          pergolaGroup.add(bloom);
        }
      }
    }
  }

  tagGroupUserData(pergolaGroup, {
    type: 'pergola_cochera',
    bankCategory: 'existente_negro',
    name: 'Pérgola de Madera Dura con Enredadera Tupida (Santa Rita / Jazmín) y Policarbonato Antigranizo',
    dimensions: '5.00m × 6.60m (33.0 m² • x = -0.50..+4.50m, z = -3.80..+2.80m, Y = +2.55..+2.75m)',
    costo: 'Incluida en Cubierta de Cochera y Acceso Frontal',
    status: 'Sombra Fresca Natural + Protección Pluvial de Policarbonato 🌿🚗',
    desc: 'Pérgola de madera dura que cubre la cochera y el acceso peatonal, combinando enredadera natural tupida con chapa translúcida de policarbonato antigranizo para proteger la SUV y el ingreso en días de tormenta.'
  });
  facadeGroup.add(pergolaGroup);

  // 1F. Solado de Cochera y Caminero Peatonal (z = -4.00m a +1.50m) + SUV Chery Tiggo 2 Pro 2026 alineada con el portón de 2.30m (x = +2.35m)
  if (scenarioKey !== 'hoy_en_obra') {
    const walkwayMat = isFullExterior573 ? mats.porcelainPBR : mats.concretePBR;

    // Huella vehicular principal (alineada con portón en x = +2.35m)
    const carTrack = new THREE.Mesh(new THREE.BoxGeometry(2.60, 0.04, 5.30), walkwayMat);
    carTrack.position.set(2.35, 0.015, -1.25);
    carTrack.userData = {
      type: 'fachada_exterior',
      bankCategory: 'nuevo_rojo',
      name: 'Explanada Vehicular de Cochera Cubierta por Pérgola (z = -4.00m a +1.50m)',
      dimensions: '51.90 m² (Entre Línea Municipal y Rejilla Peatonal de Foso de Oxigenación en z = +1.50m)',
      costo: isFullExterior573 ? 'Gs. 7.320.000 (Terminación Completa)' : 'Contrapiso Armado de Cochera',
      status: 'Cochera Operativa bajo Pérgola de Madera y Enredadera 🎯',
      desc: 'Superficie de estacionamiento vehicular a nivel de calle contenida por el muro en z = +1.50m.'
    };
    facadeGroup.add(carTrack);

    // Caminero peatonal desde la puerta peatonal (x = -1.72m) hacia el puente de rejilla y la Puerta Principal
    const pedWalk = new THREE.Mesh(new THREE.BoxGeometry(1.35, 0.04, 5.30), walkwayMat);
    pedWalk.position.set(-1.35, 0.015, -1.25);
    facadeGroup.add(pedWalk);

    // Topes de rueda (Wheel Stops) en z = +0.65m antes del Foso de Oxigenación con Rejilla (z = +1.50m)
    [1.80, 2.90].forEach((wx) => {
      const wheelStop = new THREE.Mesh(
        new THREE.BoxGeometry(0.55, 0.11, 0.16),
        new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.6, metalness: 0.1 })
      );
      wheelStop.position.set(wx, 0.055, 0.65);
      wheelStop.userData = {
        type: 'fachada_exterior',
        bankCategory: 'nuevo_rojo',
        name: 'Topes de Rueda Vehiculares antes de Rejilla de Oxigenación (z = +0.65m)',
        dimensions: 'Topes de H°A°/Caucho 0.55×0.16×0.11m anclados a 0.85m del borde del Muro de Contención',
        costo: 'Incluido en Seguridad de Cochera',
        status: 'Protección Vehicular Chery T2 Pro 2026 Instalada 🛡️',
        desc: 'Detiene las ruedas traseras de la SUV Chery Tiggo 2 Pro 2026 en z = +0.65m antes de la rejilla peatonal del foso de oxigenación.'
      };
      facadeGroup.add(wheelStop);
    });
  }

  // SUV Chery Tiggo 2 Pro 2026 estacionada bajo la pérgola (alineada con el portón vehicular x = +2.35m)
  facadeGroup.add(createCheryTiggo2Pro2026_3D(THREE, mats, 2.35, 0.03, -1.25, 0));

  targetGroup.add(facadeGroup);
}

/**
 * 2. ESCALERAS EN LADOS OPUESTOS DE LA CASA SEGÚN PLANO ORIGINAL:
 *    - ESCALERA 1 (PB ↔ SUBSUELO): Lado Sur/Izquierdo (Ejes 8–9, x = -4.87m..-3.90m, z = 5.26m..8.60m, de Y = 0.00m a Y = -2.34m)
 *    - ESCALERA 2 (PB ↔ PLANTA ALTA): Lado Norte/Derecho (Ejes 1–2, x = +3.84m..+4.87m, z = 5.26m..9.16m, de Y = 0.00m a Y = +2.88m)
 */
export function buildExistingStaircase3D(THREE, structureGroup, fase2Group, mats, scenarioKey = 'escenario300') {
  const isFinished = ['escenario350', 'escenario370', 'escenario440', 'edifica460', 'edifica573'].includes(scenarioKey);

  // ==========================================================================
  // 2A. ESCALERA 1 DE H°A° (PB Y=0.00m ↔ SUBSUELO Y=-2.34m) EN LADO SUR/IZQUIERDO (Ejes 8–9: x = -4.87m..-3.90m, z = 5.26m..8.60m)
  // ==========================================================================
  const stairSubGroup = new THREE.Group();
  stairSubGroup.name = 'escalera_1_pb_subsuelo_sur';

  const stX1 = (-4.87 + -3.90) / 2; // -4.385m (Lado Sur/Izquierdo, junto a Cocina/Comedor)
  const stW1 = 0.97;
  const zStart1 = 5.26;
  const zEnd1 = 8.60;
  const runZ1 = zEnd1 - zStart1; // 3.34m
  const dropY1 = 2.34;
  const numSteps1 = 14;

  const waistLen1 = Math.hypot(runZ1, dropY1);
  const waistAngle1 = Math.atan2(dropY1, runZ1);
  const waistGeo1 = new THREE.BoxGeometry(stW1 - 0.04, 0.16, waistLen1);
  const waistMesh1 = new THREE.Mesh(waistGeo1, mats.concretePBR);
  waistMesh1.position.set(stX1, -dropY1 / 2 - 0.10, (zStart1 + zEnd1) / 2);
  waistMesh1.rotation.x = waistAngle1;
  stairSubGroup.add(waistMesh1);

  const landingGeo1 = new THREE.BoxGeometry(stW1 + 0.12, 0.18, 1.05);
  const landingMesh1 = new THREE.Mesh(landingGeo1, isFinished ? mats.porcelainPBR : mats.concretePBR);
  landingMesh1.position.set(stX1, -2.34 + 0.02, zEnd1 + 0.48);
  stairSubGroup.add(landingMesh1);

  for (let i = 0; i < numSteps1; i++) {
    const t = i / numSteps1;
    const stepZ = zStart1 + runZ1 * t + (runZ1 / numSteps1) * 0.5;
    const stepY = -dropY1 * t - (dropY1 / numSteps1) * 0.5;
    const stepDepth = runZ1 / numSteps1 + 0.025;
    const stepHeight = dropY1 / numSteps1;

    const riserMesh = new THREE.Mesh(
      new THREE.BoxGeometry(stW1, stepHeight, stepDepth),
      mats.concretePBR
    );
    riserMesh.position.set(stX1, stepY, stepZ);
    stairSubGroup.add(riserMesh);

    if (isFinished) {
      const treadMesh = new THREE.Mesh(
        new THREE.BoxGeometry(stW1 + 0.02, 0.035, stepDepth + 0.02),
        mats.woodDeckPBR
      );
      treadMesh.position.set(stX1, stepY + stepHeight / 2 + 0.018, stepZ);
      stairSubGroup.add(treadMesh);
    }
  }

  if (scenarioKey !== 'hoy_en_obra') {
    const railGroup1 = new THREE.Group();
    [0, 0.33, 0.66, 1.0].forEach((pt) => {
      const pz = zStart1 + runZ1 * pt;
      const py = -dropY1 * pt + 0.48;
      const post = new THREE.Mesh(
        new THREE.CylinderGeometry(0.02, 0.02, 0.95, 12),
        mats.stainlessMat
      );
      post.position.set(-3.92, py, pz);
      railGroup1.add(post);
    });

    const handrailGeo1 = new THREE.CylinderGeometry(0.025, 0.025, waistLen1, 14);
    handrailGeo1.rotateX(Math.PI / 2 + waistAngle1);
    const handrail1 = new THREE.Mesh(handrailGeo1, mats.stainlessMat);
    handrail1.position.set(-3.92, -dropY1 / 2 + 0.92, (zStart1 + zEnd1) / 2);
    railGroup1.add(handrail1);
    stairSubGroup.add(railGroup1);
  }

  tagGroupUserData(stairSubGroup, {
    type: 'structure',
    bankCategory: 'existente_negro',
    name: 'Escalera 1 de H°A° (PB ↔ Subsuelo) en Lado Sur/Izquierdo (Ejes 8–9 • x = -4.87m..-3.90m, z = 5.26m..8.60m)',
    dimensions: 'Ancho 0.97m × Largo 3.34m • 14 Peldaños (De Y=0.00m a Y=-2.34m)',
    costo: isFinished ? 'Revestida en Lapacho + Baranda Inox' : 'Ejecutada en H°A° en Obra 🔒',
    status: 'Ubicada en Lado Sur/Izquierdo (Opuesta a Escalera 2) 🔒',
    desc: 'Escalera 1 en el extremo Sur/Izquierdo (Ejes 8–9) junto al sector de Cocina/Comedor que desciende al Subsuelo (-2.34m) y a la Parrillita / Quincho Inferior.'
  });
  structureGroup.add(stairSubGroup);

  // ==========================================================================
  // 2B. ESCALERA 2 (PB Y=0.00m ↔ PLANTA ALTA Y=+2.88m) EN LADO NORTE/DERECHO (Ejes 1–2: x = +3.84m..+4.87m, z = 5.26m..9.16m)
  //     Desembarca directamente en el ESCRITORIO / DESK (3.50m × 2.30m) de Planta Alta
  // ==========================================================================
  const stairPAGroup = new THREE.Group();
  stairPAGroup.name = 'escalera_2_pb_pa_norte';

  const stX2 = (3.84 + 4.87) / 2; // +4.355m (Lado Norte/Derecho, opuesta a Escalera 1)
  const stW2 = 1.00;
  const zStart2 = 5.26;
  const zEnd2 = 9.16;
  const runZ2 = zEnd2 - zStart2; // 3.90m
  const risePA = 2.88;
  const stepsPA = 16;
  const waistLenPA = Math.hypot(runZ2, risePA);
  const waistAnglePA = -Math.atan2(risePA, runZ2);

  // Losa inclinada / limones de H°A° y acero en Ejes 1–2
  [-stW2 / 2 + 0.04, stW2 / 2 - 0.04].forEach((lx) => {
    const stringerMesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.06, 0.20, waistLenPA),
      mats.blackMetalMat
    );
    stringerMesh.position.set(stX2 + lx, risePA / 2 - 0.06, (zStart2 + zEnd2) / 2);
    stringerMesh.rotation.x = waistAnglePA;
    stairPAGroup.add(stringerMesh);
  });

  for (let i = 0; i < stepsPA; i++) {
    const t = i / stepsPA;
    const stepZ = zStart2 + runZ2 * t + (runZ2 / stepsPA) * 0.5;
    const stepY = risePA * t + (risePA / stepsPA) * 0.5;
    const stepDepth = runZ2 / stepsPA + 0.02;

    const stepMesh = new THREE.Mesh(
      new THREE.BoxGeometry(stW2, 0.055, stepDepth),
      mats.woodDeckPBR
    );
    stepMesh.position.set(stX2, stepY + 0.06, stepZ);
    stairPAGroup.add(stepMesh);
  }

  if (scenarioKey !== 'hoy_en_obra') {
    const railPAGroup = new THREE.Group();
    [0, 0.33, 0.66, 1.0].forEach((pt) => {
      const pz = zStart2 + runZ2 * pt;
      const py = risePA * pt + 0.48;
      const post = new THREE.Mesh(
        new THREE.CylinderGeometry(0.02, 0.02, 0.95, 12),
        mats.stainlessMat
      );
      post.position.set(3.86, py, pz);
      railPAGroup.add(post);
    });

    const handrailPAGeo = new THREE.CylinderGeometry(0.025, 0.025, waistLenPA, 14);
    handrailPAGeo.rotateX(Math.PI / 2 + waistAnglePA);
    const handrailPA = new THREE.Mesh(handrailPAGeo, mats.stainlessMat);
    handrailPA.position.set(3.86, risePA / 2 + 0.92, (zStart2 + zEnd2) / 2);
    railPAGroup.add(handrailPA);
    stairPAGroup.add(railPAGroup);
  }

  tagGroupUserData(stairPAGroup, {
    type: 'structure_fase2',
    bankCategory: 'nuevo_rojo',
    name: 'Escalera 2 (PB ↔ Planta Alta) en Lado Norte/Derecho (Ejes 1–2 • x = +3.84m..+4.87m, z = 5.26m..9.16m)',
    dimensions: 'Ancho 1.00m × Largo 3.90m • 16 Peldaños de Lapacho (De Y=0.00m a +2.88m)',
    costo: 'Gs. 9.800.000 (Escalera 2 hacia Escritorio / Desk en Planta Alta)',
    status: 'Desembarco Directo en ESCRITORIO / DESK (3.50m × 2.30m) de Planta Alta ✨',
    desc: 'Escalera 2 ubicada en el lado Norte/Derecho (Ejes 1–2, opuesta a la Escalera 1 del Subsuelo), subiendo desde el Estar en PB hasta el Escritorio / Desk de Planta Alta (+2.88m).'
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
 * Construye la PARRILLITA / QUINCHO INFERIOR EN SUBSUELO HACIA EL PATIO (`Y = -2.34m`, `x = -4.50m..-2.00m`, `z = 12.20m..13.34m`):
 * En la Galería de Planta Baja NO hay parrilla; la parrillita con mesada de apoyo y bacha está en el Subsuelo mirando al patio y al río.
 */
function buildSubsueloParilla3D(THREE, mats, ySub, scenarioKey) {
  const isBuiltInMasonryBBQ = ['escenario440', 'edifica460', 'edifica573'].includes(scenarioKey);
  const bbqGroup = new THREE.Group();

  // Mesada de apoyo parrillera y bacha auxiliar en Subsuelo (x = -3.85m..-2.10m, z = 12.65m)
  const counterCab = new THREE.Mesh(new THREE.BoxGeometry(1.70, 0.84, 0.62), mats.woodDeckPBR);
  counterCab.position.set(-2.90, ySub + 0.44, 12.80);
  bbqGroup.add(counterCab);

  const counterGranite = new THREE.Mesh(new THREE.BoxGeometry(1.76, 0.04, 0.66), mats.granitePBR);
  counterGranite.position.set(-2.90, ySub + 0.88, 12.80);
  bbqGroup.add(counterGranite);

  const auxSink = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.025, 0.38), mats.stainlessMat);
  auxSink.position.set(-2.45, ySub + 0.905, 12.80);
  bbqGroup.add(auxSink);

  const auxTap = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.28, 12), mats.chromeMat);
  auxTap.position.set(-2.45, ySub + 1.04, 12.60);
  bbqGroup.add(auxTap);

  if (!isBuiltInMasonryBBQ) {
    const chulengoX = -4.18;
    const chulengoZ = 12.75;

    const drumGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.92, 24);
    drumGeo.rotateZ(Math.PI / 2);
    const drum = new THREE.Mesh(drumGeo, mats.blackMetalMat);
    drum.position.set(chulengoX, ySub + 0.86, chulengoZ);
    bbqGroup.add(drum);

    const stack = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.34, 14), mats.blackMetalMat);
    stack.position.set(chulengoX - 0.28, ySub + 1.24, chulengoZ);
    bbqGroup.add(stack);

    [[-0.36, -0.18], [0.36, -0.18], [-0.36, 0.18], [0.36, 0.18]].forEach(([lx, lz]) => {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.68, 10), mats.blackMetalMat);
      leg.position.set(chulengoX + lx, ySub + 0.36, chulengoZ + lz);
      bbqGroup.add(leg);
    });

    tagGroupUserData(bbqGroup, {
      type: 'quincho_subsuelo',
      name: 'Parrillita / Quincho Inferior en Subsuelo hacia el Patio + Mesada con Bacha (Y = -2.34m)',
      dimensions: 'Sector 2.50m × 1.14m (x = -4.50m..-2.00m, z = 12.20m..13.34m • Subsuelo)',
      costo: 'Parrilla Portátil Gs. 0 + Mesada Apoyo Subsuelo',
      status: 'Quincho Inferior en Subsuelo Conectado Directo al Jardín y Piscina 🔥🥩',
      desc: 'Ubicada en el Subsuelo (Y = -2.34m) en la salida hacia el patio posterior, dejando la Galería de Planta Baja 100% limpia como mirador social al Río Paraguay.'
    });
  } else {
    const bbqBase = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.90, 0.78), mats.brickPBR);
    bbqBase.position.set(-4.22, ySub + 0.47, 12.78);
    bbqGroup.add(bbqBase);

    const bbqFirebox = new THREE.Mesh(new THREE.BoxGeometry(1.10, 0.78, 0.74), mats.brickPBR);
    bbqFirebox.position.set(-4.22, ySub + 1.31, 12.78);
    bbqGroup.add(bbqFirebox);

    const bbqInoxFront = new THREE.Mesh(new THREE.BoxGeometry(0.98, 0.70, 0.04), mats.stainlessMat);
    bbqInoxFront.position.set(-4.22, ySub + 1.31, 12.40);
    bbqGroup.add(bbqInoxFront);

    const bbqHood = new THREE.Mesh(new THREE.BoxGeometry(1.14, 0.56, 0.76), mats.plasterExteriorPBR);
    bbqHood.position.set(-4.22, ySub + 1.98, 12.78);
    bbqGroup.add(bbqHood);

    tagGroupUserData(bbqGroup, {
      type: 'quincho_subsuelo',
      name: 'Parrillita de Obra en Ladrillo Refractario y Mesada de Granito en Subsuelo (Y = -2.34m)',
      dimensions: '2.50m × 1.14m (x = -4.50m..-2.00m, z = 12.20m..13.34m • Salida al Patio)',
      costo: 'Gs. 7.500.000 (Parrillita de Obra + Mesada Granito en Subsuelo)',
      status: 'Quincho Inferior Integrado al Patio y Piscina ✨🔥',
      desc: 'Parrillita de mampostería refractaria con frente inoxidable y mesada de granito con bacha en el Subsuelo hacia el patio trasero.'
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
  // B. PLANTA BAJA A NIVEL DE CALLE (Y = 0.00m):
  //    - ESTAR (4.95m × 4.80m) en sector centro-derecho/Norte (x = -0.74..+3.84m, z = 5.26..9.94m)
  //    - SSHH / BAÑO SOCIAL (1.10m × 2.00m) sobre núcleo húmedo frontal Eje F–G (x = -1.64..-0.40m, z = 3.00..5.00m)
  //    - COCINA / COMEDOR INTEGRADO (6.20m × 2.75m) en ala izquierda/Sur (x = -4.87..-0.74m, z = 3.00..9.94m)
  //    - ESCALERA 1 (PB ↔ Subsuelo) en lado Sur/Izquierdo (x = -4.87..-3.90m, z = 5.26..8.60m)
  //    - ESCALERA 2 (PB ↔ Planta Alta) en lado Norte/Derecho (x = +3.84..+4.87m, z = 5.26..9.16m)
  // ============================================================================
  const hPB = 2.82;

  addWallSegment(
    groups.archMain,
    -4.87, 3.00, -4.87, 9.94,
    0.00, hPB, 0.20, extWallMat,
    'Muro Medianero Sur/Izquierdo Nivel Calle (Eje 9 • x = -4.87m)',
    'Cerramiento portante/acústico de 20cm sobre Eje 9 (lado Cocina/Comedor y Escalera 1 al Subsuelo).'
  );

  addWallSegment(
    groups.archMain,
    4.87, 3.00, 4.87, 9.94,
    0.00, hPB, 0.20, extWallMat,
    'Muro Medianero Norte/Derecho Nivel Calle (Eje 1 • x = +4.87m)',
    'Cerramiento lateral derecho sobre Eje 1 que protege el núcleo de la Escalera 2 (PB → PA).'
  );

  // Fachada Eje G (z = 3.00m): Cocina Húmeda (x = -4.87m a -1.64m) + SSHH Social (x = -1.64m a -0.40m) + Acceso Principal y Estar
  addWallSegment(
    groups.archMain,
    -4.87, 3.00, -1.64, 3.00,
    0.00, 1.05, 0.20, extWallMat,
    'Muro Frontal Eje G — Bajo Mesada Cocina (x = -4.87m a -1.64m, z = 3.00m)',
    'Muro frontal en el sector húmedo de Cocina sobre Eje G.'
  );
  groups.archMain.add(
    createBlindexWindow3D(
      THREE, mats, -3.25, 1.55, 3.00, 1.95, 0.95, 0,
      'Ventana Corrediza Blindex sobre Bacha de Cocina (Fachada Eje G • z = 3.00m)',
      'Ventana corrediza sobre la mesada húmeda de la cocina mirando hacia el foso de oxigenación y cochera.'
    )
  );
  addWallSegment(
    groups.archMain,
    -4.87, 3.00, -1.64, 3.00,
    2.02, 0.80, 0.20, extWallMat,
    'Dintel Frontal Eje G — Sector Cocina (z = 3.00m)',
    'Dintel superior sobre la ventana de cocina.'
  );

  // Muro frontal Eje G del SSHH / Baño Social (x = -1.64m a -0.40m, z = 3.00m) con ventiluz alto
  addWallSegment(
    groups.archMain,
    -1.64, 3.00, -0.40, 3.00,
    0.00, 1.85, 0.20, extWallMat,
    'Muro Frontal Eje G — SSHH / Baño Social (1.10m × 2.00m • x = -1.64m a -0.40m)',
    'Cerramiento frontal del SSHH Social en el núcleo húmedo Eje F–G.'
  );
  groups.archMain.add(
    createBlindexWindow3D(
      THREE, mats, -1.02, 2.12, 3.00, 0.75, 0.45, 0,
      'Ventiluz Superior de Aluminio y Vidrio — SSHH Social PB (Eje G • z = 3.00m)',
      'Ventilación natural cruzada del baño social hacia la cámara de aire frontal.'
    )
  );
  addWallSegment(
    groups.archMain,
    -1.64, 3.00, -0.40, 3.00,
    2.36, 0.46, 0.20, extWallMat,
    'Dintel Eje G — SSHH Social PB',
    'Dintel sobre ventiluz del SSHH Social.'
  );

  // 1) PUERTA PRINCIPAL JERARQUIZADA en x = +0.55m, z = 3.00m (Ingreso al Recibidor y Estar 4.95m × 4.80m)
  const mainDoor = createWoodenDoor3D(
    THREE,
    mats,
    0.55,
    0.00,
    3.00,
    1.10,
    2.20,
    0,
    0.38,
    'Puerta Principal Jerarquizada en Madera Maciza Lapacho (x = +0.55m, Eje G • Ingreso a Estar)',
    {
      type: 'puerta_principal',
      hasSidelight: true,
      longPullBar: true,
      dimensionsExtra: 'Pivotante 1.10×2.20m + Paño Fijo Vidrio 0.32m + Manijón Inox 1.20m',
      costo: 'Gs. 4.850.000 (Puerta Principal Maciza Pivotante + Cerradura Multianclaje)',
      status: 'Acceso Social Principal desde Puente de Rejilla Galvanizada ✨',
      desc: 'Ubicada sobre el Eje G (z=3.00m, x=+0.55m). Da ingreso directo al Recibidor, Estar (4.95m × 4.80m) y Cocina/Comedor (6.20m × 2.75m).'
    }
  );
  groups.archMain.add(mainDoor);

  // Ventanal Frontal del Estar entre la Puerta Principal y el Eje 2 (x = +1.20m a +3.84m, z = 3.00m)
  addWallSegment(
    groups.archMain,
    1.20, 3.00, 3.84, 3.00,
    0.00, 0.85, 0.20, extWallMat,
    'Antepecho Frontal Estar (Eje G • x = +1.20m a +3.84m)',
    'Muro bajo ventana frontal del Estar.'
  );
  groups.archMain.add(
    createBlindexWindow3D(
      THREE, mats, 2.52, 1.78, 3.00, 2.45, 1.85, 0,
      'Ventanal Frontal Blindex Templado 10mm — Estar Social (Eje G)',
      'Ventanal corredizo Blindex con carpintería de aluminio negro junto a la Puerta Principal.'
    )
  );

  // 2) PUERTA DE SERVICIO / CIRCULACIÓN VERTICAL en x = +4.35m, z = 3.00m (Ejes 1–2, alineada con Escalera 2 PB→PA)
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
    'Puerta Lateral de Acceso a Caja de Escalera 2 (x = +4.35m, Eje G • Ejes 1–2)',
    {
      type: 'puerta_servicio',
      isServiceDoor: true,
      dimensionsExtra: '0.85×2.10m + Reja Exterior • Alineada con Escalera 2 (PB → Escritorio PA)',
      costo: 'Gs. 2.350.000 (Puerta Reforzada + Reja Protectora)',
      status: 'Acceso Directo a Escalera 2 Norte/Derecha ✨',
      desc: 'Ubicada entre Ejes 1 y 2 sobre Eje G (z=3.00m), alineada con la Escalera 2 que sube al Escritorio / Desk de Planta Alta (+2.88m).'
    }
  );
  groups.archMain.add(serviceDoor);

  addWallSegment(
    groups.archMain,
    -0.40, 3.00, 4.87, 3.00,
    2.22, 0.60, 0.20, extWallMat,
    'Viga Dintel Frontal sobre Puerta Principal y Acceso Lateral (Eje G)',
    'Cierre superior de mampostería sobre los vanos de acceso en Eje G.'
  );

  // SSHH / BAÑO SOCIAL EN PLANTA BAJA (1.10m × 2.00m) EN NÚCLEO HÚMEDO FRONTAL EJE F–G (x = -1.64m a -0.40m, z = 3.00m a 5.00m)
  addWallSegment(
    groups.archMain,
    -1.64, 3.00, -1.64, 5.00,
    0.00, hPB, 0.15, intWallMat,
    'Muro Húmedo Divisorio Cocina / SSHH Social PB (Eje 6 • x = -1.64m, z = 3.00..5.00m)',
    'Muro sanitario vertical en Eje F–G que comparte columna de agua y desagüe con la Cocina y los baños de Planta Alta.'
  );
  addWallSegment(
    groups.archMain,
    -0.40, 3.00, -0.40, 5.00,
    0.00, hPB, 0.15, intWallMat,
    'Muro Este SSHH / Baño Social PB (x = -0.40m, z = 3.00..5.00m)',
    'Separa el SSHH Social del recibidor de la Puerta Principal.'
  );
  addWallSegment(
    groups.archMain,
    -1.64, 5.00, -1.32, 5.00,
    0.00, hPB, 0.15, intWallMat,
    'Mocheta Oeste SSHH Social PB (Eje F • z = 5.00m)',
    'Cierre frontal del SSHH Social.'
  );
  addWallSegment(
    groups.archMain,
    -0.62, 5.00, -0.40, 5.00,
    0.00, hPB, 0.15, intWallMat,
    'Mocheta Este SSHH Social PB (Eje F • z = 5.00m)',
    'Cierre frontal del SSHH Social.'
  );
  groups.archMain.add(
    createWoodenDoor3D(
      THREE, mats, -0.97, 0.00, 5.00, 0.72, 2.10, 0, 0.50,
      'Puerta de Madera — SSHH / Baño Social PB (1.10m × 2.00m • Eje F–G)'
    )
  );
  groups.archMain.add(createToilet3D(THREE, mats, -1.02, 0.03, 3.48, 0, 'SSHH / Baño Social PB (1.10×2.00m)'));
  groups.archMain.add(createVanity3D(THREE, mats, -1.32, 0.03, 4.30, 0.65, Math.PI / 2, 'SSHH / Baño Social PB (1.10×2.00m)'));

  // Baranda interior de protección en PB junto al hueco de la Escalera 1 (Sur/Izquierda: x = -3.90m, z = 5.26..8.60m)
  groups.archMain.add(
    createBalconyGrille3D(
      THREE, mats, -3.88, 5.26, -3.88, 8.60, 0.02, 0.96,
      'Baranda Interior de Seguridad sobre Escalera 1 hacia Subsuelo (Lado Sur/Izquierdo • x = -3.88m)'
    )
  );

  // Tabique de acompañamiento de Escalera 2 en Eje 2 (x = +3.84m, z = 3.85..5.26m)
  addWallSegment(
    groups.archMain,
    3.84, 3.85, 3.84, 5.26,
    0.00, hPB, 0.15, intWallMat,
    'Tabique Lateral Caja de Escalera 2 en Eje 2 (x = +3.84m)',
    'Acompaña el arranque de la Escalera 2 (Lado Norte/Derecho) que sube al Escritorio de Planta Alta (+2.88m).'
  );

  // Gran Ventanal Panorámico Blindex de Punta a Punta en Eje B (z = 9.94m): Estar y Cocina/Comedor hacia la Galería al Río
  addWallSegment(
    groups.archMain,
    -4.87, 9.94, -4.15, 9.94,
    0.00, hPB, 0.20, extWallMat,
    'Mocheta Sur/Oeste Eje B (z = 9.94m)',
    'Mocheta de cierre sobre Eje B junto al pilar P18.'
  );
  groups.archMain.add(
    createBlindexWindow3D(
      THREE, mats, -2.55, 1.225, 9.94, 3.10, 2.45, 0,
      'Ventanal Corredizo Blindex 10mm — Cocina / Comedor (6.20m × 2.75m) hacia Galería al Río (Eje B)',
      'Puerta-ventana corrediza Blindex que vincula el Comedor directamente con la Galería al Río.'
    )
  );
  groups.archMain.add(
    createBlindexWindow3D(
      THREE, mats, 1.40, 1.225, 9.94, 4.80, 2.45, 0,
      'Gran Ventanal Panorámico Blindex 4 Hojas — Estar (4.95m × 4.80m) hacia Galería al Río (Eje B)',
      'Cerramiento vidriado corredizo de 4 hojas sobre el Eje B (z=9.94m) que integra el Estar con la Galería al Río.'
    )
  );

  // ============================================================================
  // C. COCINA / COMEDOR INTEGRADO (6.20m × 2.75m) EN ALA SUR/IZQUIERDA (x = -4.87m..-0.74m, z = 3.00m..9.94m)
  //    Mesada húmeda en Eje F–G (z = 3.00..5.00m) + Mesa de Comedor de 6 Sillas en z = 7.40..9.40m
  // ============================================================================
  const kitchenEssentialGroup = new THREE.Group();
  const baseCabFront = new THREE.Mesh(new THREE.BoxGeometry(2.15, 0.84, 0.60), mats.woodDeckPBR);
  baseCabFront.position.set(-2.85, 0.44, 3.42);
  kitchenEssentialGroup.add(baseCabFront);

  const graniteTopFront = new THREE.Mesh(new THREE.BoxGeometry(2.20, 0.04, 0.64), mats.granitePBR);
  graniteTopFront.position.set(-2.85, 0.88, 3.42);
  kitchenEssentialGroup.add(graniteTopFront);

  const sinkBasin = new THREE.Mesh(new THREE.BoxGeometry(0.76, 0.025, 0.44), mats.stainlessMat);
  sinkBasin.position.set(-3.10, 0.905, 3.42);
  kitchenEssentialGroup.add(sinkBasin);

  const kitchenTap = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.34, 12), mats.chromeMat);
  kitchenTap.position.set(-3.10, 1.06, 3.22);
  kitchenEssentialGroup.add(kitchenTap);

  const kitchenSpout = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.02, 0.18), mats.chromeMat);
  kitchenSpout.position.set(-3.10, 1.22, 3.30);
  kitchenEssentialGroup.add(kitchenSpout);

  tagGroupUserData(kitchenEssentialGroup, {
    type: 'equipamiento_cocina',
    name: 'Mesada Húmeda de Granito con Bacha Doble Inox en Cocina/Comedor (6.20m × 2.75m • Eje F–G)',
    dimensions: '2.20m × 0.64m × 0.90m • Conectada a Núcleo Húmedo Eje F–G',
    costo: 'Incluida en Núcleo Básico de Habitabilidad (300M)',
    status: 'Cocina Operativa en Ala Sur/Izquierda ✨',
    desc: 'Mesada húmeda principal de granito con bacha doble de acero inoxidable y grifería mezcladora sobre Eje G (z=3.42m), adosada al núcleo húmedo del SSHH Social.'
  });
  groups.archMain.add(kitchenEssentialGroup);

  // 1) 1 Cocina con Garrafa (Propia de Ruth y Leo — Gs. 0, en z = 3.92m antes del arranque de Escalera 1 en z = 5.26m)
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

  const lpgCabinet = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.78, 0.42), mats.blackMetalMat);
  lpgCabinet.position.set(-4.45, 0.39, 2.74);
  stoveWithGasGroup.add(lpgCabinet);

  const gasCylinder = new THREE.Mesh(
    new THREE.CylinderGeometry(0.16, 0.16, 0.52, 20),
    new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.45, metalness: 0.35 })
  );
  gasCylinder.position.set(-4.45, 0.28, 2.78);
  stoveWithGasGroup.add(gasCylinder);

  const hoodEssential = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.12, 0.58), mats.stainlessMat);
  hoodEssential.position.set(-4.42, 1.66, 3.92);
  stoveWithGasGroup.add(hoodEssential);

  const hoodDuct = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.85, 0.20), mats.stainlessMat);
  hoodDuct.position.set(-4.58, 2.14, 3.92);
  stoveWithGasGroup.add(hoodDuct);

  tagGroupUserData(stoveWithGasGroup, {
    type: 'electrodomestico_propio',
    name: '1 Cocina a Gas (Propia Ruth y Leo) + Campana Extractora y Nicho Exterior GLP (Eje F–G)',
    dimensions: 'Cocina 0.56×0.60×0.86m + Campana Inox + Nicho GLP Exterior',
    costo: 'Cocina Gs. 0 (Propia) • Campana + Nicho GLP: Gs. 2.150.000',
    status: 'Ubicada en Sector Cocina (x = -4.42m, z = 3.92m) 🛡️📦',
    desc: 'Cocina propia de Ruth y Leo en el sector húmedo Eje F–G antes del arranque de la Escalera 1.'
  });
  groups.archMain.add(stoveWithGasGroup);

  // 2) 1 Heladera (Propia de Ruth y Leo — Gs. 0, adosada al muro húmedo del SSHH Social en x = -1.98m, z = 4.55m)
  const fridgeGroup = new THREE.Group();
  const fridgeBody = new THREE.Mesh(new THREE.BoxGeometry(0.68, 1.75, 0.65), mats.stainlessMat);
  fridgeBody.position.set(-1.98, 0.90, 4.55);
  fridgeGroup.add(fridgeBody);

  const fridgeHandleTop = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.32, 10), mats.chromeMat);
  fridgeHandleTop.position.set(-2.33, 1.48, 4.32);
  fridgeGroup.add(fridgeHandleTop);

  const fridgeHandleBot = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.68, 10), mats.chromeMat);
  fridgeHandleBot.position.set(-2.33, 0.82, 4.32);
  fridgeGroup.add(fridgeHandleBot);

  tagGroupUserData(fridgeGroup, {
    type: 'electrodomestico_propio',
    name: '1 Heladera con Freezer en Cocina/Comedor (Inventario Propio Ruth y Leo)',
    dimensions: '0.65m × 0.68m × 1.75m • Junto a Núcleo Húmedo Eje F–G',
    costo: 'Gs. 0 (Propio de Ruth y Leo — A trasladar)',
    status: 'Propio del Propietario (Gs. 0 — A trasladar) 📦',
    desc: 'Heladera propia de Ruth y Leo en la Cocina/Comedor (6.20m × 2.75m), liberando el paso hacia la Escalera 1.'
  });
  groups.archMain.add(fridgeGroup);

  // 3) 1 Mueble de cocina para microondas, horno y guardar pequeñas cosas + 1 Microondas (Propios — Gs. 0)
  const mwRackGroup = new THREE.Group();
  const rackX = -4.48;
  const rackZ = 4.68;
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
    name: '1 Mueble Organizador de Cocina + 1 Microondas (Inventario Propio Ruth y Leo)',
    dimensions: '0.75m × 0.45m × 1.70m + Microondas 0.48m × 0.36m × 0.28m',
    costo: 'Gs. 0 (Propio de Ruth y Leo — A trasladar)',
    status: 'Propio del Propietario (Gs. 0 — A trasladar) 📦',
    desc: 'Mueble organizador vertical de cocina con el microondas propio de Ruth y Leo.'
  });
  groups.archMain.add(mwRackGroup);

  // 4) 1 Air Fryer de 6L Xiaomi (Propia — Gs. 0) sobre la mesada
  const airFryerGroup = new THREE.Group();
  const afX = -2.15;
  const afZ = 3.42;
  const afBody = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.30, 0.32), mats.ceramicSanitaryMat);
  afBody.position.set(afX, 1.05, afZ);
  airFryerGroup.add(afBody);

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
    desc: 'Freidora de aire inteligente Xiaomi de 6 litros sobre la mesada de cocina.'
  });
  groups.archMain.add(airFryerGroup);

  if (isAtLeast350) {
    const budgetedKitchenGroup = new THREE.Group();

    const upperCabFront = new THREE.Mesh(new THREE.BoxGeometry(2.15, 0.68, 0.36), mats.woodDeckPBR);
    upperCabFront.position.set(-2.85, 2.05, 3.28);
    budgetedKitchenGroup.add(upperCabFront);

    const islandBase = new THREE.Mesh(new THREE.BoxGeometry(1.75, 0.90, 0.78), mats.woodDeckPBR);
    islandBase.position.set(-2.55, 0.47, 5.45);
    budgetedKitchenGroup.add(islandBase);

    const islandTop = new THREE.Mesh(new THREE.BoxGeometry(1.85, 0.045, 0.88), mats.granitePBR);
    islandTop.position.set(-2.55, 0.94, 5.45);
    budgetedKitchenGroup.add(islandTop);

    tagGroupUserData(budgetedKitchenGroup, {
      type: 'adicional_a_presupuestar',
      name: 'Amoblamiento de Cocina Bajo-Mesada, Alacenas Superiores y Barra Desayunadora (Adicional a Presupuestar)',
      dimensions: 'Alacenas a Medida + Bajo-Mesada + Barra de Granito 1.85m × 0.88m en Cocina/Comedor (6.20×2.75m)',
      costo: 'Gs. 17.543.750 (A Presupuestar — No incluido en mudanza actual)',
      status: 'Adicional Clave a Presupuestar 🛠️',
      desc: 'Muebles fijos de cocina y barra desayunadora dividiendo virtualmente la Cocina del Comedor en el ala izquierda (x = -4.87..-0.74m).'
    });
    groups.archMain.add(budgetedKitchenGroup);
  }

  // ============================================================================
  // D. COMEDOR (en ala Sur/Izquierda x = -2.25m, z = 8.15m) + ESTAR (4.95m × 4.80m en sector Centro-Derecho x = -0.74..+3.84m, z = 5.26..9.94m)
  // ============================================================================
  // D1. Mesa y Sillas de Comedor (6 Sillas, Propia — Gs. 0) en el sector Comedor de COCINA/COMEDOR (6.20m × 2.75m)
  const diningSetGroup = new THREE.Group();
  const dX = -2.25;
  const dZ = 8.15;

  const diningTop = new THREE.Mesh(new THREE.BoxGeometry(1.70, 0.045, 0.90), mats.woodDeckPBR);
  diningTop.position.set(dX, 0.76, dZ);
  diningSetGroup.add(diningTop);

  [[-0.75, -0.38], [0.75, -0.38], [-0.75, 0.38], [0.75, 0.38]].forEach(([lx, lz]) => {
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.74, 0.06), mats.woodDoorPBR);
    leg.position.set(dX + lx, 0.38, dZ + lz);
    diningSetGroup.add(leg);
  });

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
    name: 'Mesa y 6 Sillas de Comedor en Sector COCINA / COMEDOR (6.20m × 2.75m • Inventario Propio)',
    dimensions: 'Mesa 1.70m × 0.90m × 0.76m + 6 Sillas Tapizadas (x = -2.25m, z = 8.15m)',
    costo: 'Gs. 0 (Propio de Ruth y Leo — A trasladar)',
    status: 'Propio del Propietario en Cocina/Comedor 📦',
    desc: 'Juego de comedor de 6 sillas ubicado en el sector Comedor (ala izquierda x=-3.80..-0.74m, z=6.80..9.60m) frente al ventanal de la Galería.'
  });
  groups.archMain.add(diningSetGroup);

  // D2. ESTAR (4.95m × 4.80m en x = -0.74..+3.84m, z = 5.26..9.94m): Sofá de 4 Piezas + Mesa Ratona (Propios — Gs. 0)
  const sofaSetGroup = new THREE.Group();
  const sCenterX = 1.65;
  const sCenterZ = 7.25;

  const sofa3Seat = new THREE.Mesh(new THREE.BoxGeometry(2.00, 0.40, 0.85), mats.linenSofaMat);
  sofa3Seat.position.set(sCenterX - 0.10, 0.23, sCenterZ - 1.15);
  sofaSetGroup.add(sofa3Seat);

  const sofa3Back = new THREE.Mesh(new THREE.BoxGeometry(2.00, 0.44, 0.16), mats.linenSofaMat);
  sofa3Back.position.set(sCenterX - 0.10, 0.60, sCenterZ - 1.49);
  sofaSetGroup.add(sofa3Back);

  [-0.94, 0.94].forEach((ax) => {
    const arm = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.32, 0.85), mats.linenSofaMat);
    arm.position.set(sCenterX - 0.10 + ax, 0.44, sCenterZ - 1.15);
    sofaSetGroup.add(arm);
  });

  const singleChairsCoords = [
    { x: sCenterX - 1.35, z: sCenterZ, rotY: Math.PI / 2 },
    { x: sCenterX - 0.55, z: sCenterZ + 1.05, rotY: Math.PI },
    { x: sCenterX + 0.45, z: sCenterZ + 1.05, rotY: Math.PI }
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
    name: 'Sofá de 4 Piezas en ESTAR (4.95m × 4.80m • Sector Centro-Derecho PB)',
    dimensions: '1 Sofá 3 Cuerpos (2.00m × 0.85m) + 3 Sillones Individuales (0.80m × 0.80m c/u)',
    costo: 'Gs. 0 (Propio de Ruth y Leo — A trasladar)',
    status: 'Propio del Propietario en Estar Social 📦',
    desc: 'Juego de living de 4 piezas perteneciente a Ruth y Leo en el Estar (4.95m × 4.80m, x = -0.74..+3.84m, z = 5.26..9.94m).'
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
    name: 'Mesa Ratona de Sala en ESTAR (4.95m × 4.80m) — Inventario Propio Ruth y Leo',
    dimensions: '1.10m × 0.60m × 0.42m • En Centro del Estar',
    costo: 'Gs. 0 (Propio de Ruth y Leo — A trasladar)',
    status: 'Propio del Propietario (Gs. 0 — A trasladar) 📦',
    desc: 'Mesa ratona central de sala trasladada por Ruth y Leo.'
  });
  groups.archMain.add(coffeeTableGroup);

  // D4. Mesa de Patas de Máquina de Coser con Tabla Arriba + Televisor de 32" (Propios — Gs. 0)
  const tvAndSewingTableGroup = new THREE.Group();
  const stX = 3.40;
  const stZ = 7.25;

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
    name: 'Mesa de Patas de Máquina de Coser con Tabla Arriba + Televisor de 32" en ESTAR',
    dimensions: 'Mesa Hierro/Madera 1.05m × 0.50m × 0.76m + TV 32" (0.73m × 0.44m)',
    costo: 'Gs. 0 (Propio de Ruth y Leo — A trasladar)',
    status: 'Propio del Propietario (Gs. 0 — A trasladar) 📦',
    desc: 'Mesa con base de hierro de máquina de coser antigua y tapa de madera para el TV de 32" en el Estar.'
  });
  groups.archMain.add(tvAndSewingTableGroup);

  // D5. Mesa de Florero y Libros Cuadrada (0.55m × 0.55m × 0.62m) + 1 Vaporizador Xiaomi en el Recibidor del Estar
  const bookFlowerTableGroup = new THREE.Group();
  const bfX = 0.25;
  const bfZ = 3.65;

  const sqTop = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.035, 0.55), mats.woodDeckPBR);
  sqTop.position.set(bfX, 0.62, bfZ);
  bookFlowerTableGroup.add(sqTop);

  [[-0.22, -0.22], [0.22, -0.22], [-0.22, 0.22], [0.22, 0.22]].forEach(([lx, lz]) => {
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.60, 0.04), mats.woodDoorPBR);
    leg.position.set(bfX + lx, 0.31, bfZ + lz);
    bookFlowerTableGroup.add(leg);
  });

  const xiaomiHumidifier = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.30, 20), mats.ceramicSanitaryMat);
  xiaomiHumidifier.position.set(bfX + 0.12, 0.78, bfZ + 0.14);
  bookFlowerTableGroup.add(xiaomiHumidifier);

  tagGroupUserData(bookFlowerTableGroup, {
    type: 'mobiliario_propio',
    name: 'Mesa Cuadrada de Florero y Libros + 1 Vaporizador de Agua Xiaomi (Recibidor Estar)',
    dimensions: 'Mesa Cuadrada 0.55m × 0.55m × 0.62m + Vaporizador Xiaomi Ø0.18m × 0.30m',
    costo: 'Gs. 0 (Propio de Ruth y Leo — A trasladar)',
    status: 'Propio del Propietario (Gs. 0 — A trasladar) 📦',
    desc: 'Mesa cuadrada auxiliar con libros, florero y vaporizador Xiaomi en el ingreso al Estar.'
  });
  groups.archMain.add(bookFlowerTableGroup);

  // D6. 1 Purificador de Aire Xiaomi (0.24m × 0.24m × 0.52m, Propio — Gs. 0)
  const airPurifierGroup = new THREE.Group();
  const apX = 3.42;
  const apZ = 3.65;
  const purifierTower = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.52, 0.24), mats.ceramicSanitaryMat);
  purifierTower.position.set(apX, 0.28, apZ);
  airPurifierGroup.add(purifierTower);

  const purifierTopVent = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.015, 18), mats.blackMetalMat);
  purifierTopVent.position.set(apX, 0.545, apZ);
  airPurifierGroup.add(purifierTopVent);

  tagGroupUserData(airPurifierGroup, {
    type: 'electrodomestico_propio',
    name: '1 Purificador de Aire Xiaomi Smart Air Purifier (Inventario Propio Ruth y Leo)',
    dimensions: '0.24m × 0.24m × 0.52m • Display OLED Frontal',
    costo: 'Gs. 0 (Propio de Ruth y Leo — A trasladar)',
    status: 'Propio del Propietario (Gs. 0 — A trasladar) 📦',
    desc: 'Purificador de aire Xiaomi en el Estar de Planta Baja.'
  });
  groups.archMain.add(airPurifierGroup);

  if (isAtLeast440) {
    const ceilingPlate = new THREE.Mesh(
      new THREE.BoxGeometry(4.40, 0.06, 4.40),
      mats.plasterPBR
    );
    ceilingPlate.position.set(1.55, 2.68, 7.25);
    ceilingPlate.userData = {
      type: 'cielorraso_led',
      name: 'Cielorraso de Yeso con Garganta LED en ESTAR (4.95m × 4.80m • Ítem 12 Edifica Studio)',
      dimensions: '4.40m × 4.40m • Cota +2.68m',
      costo: 'Gs. 5.937.500',
      status: 'Iluminación Indirecta LED 3000K ✨',
      desc: 'Cielorraso suspendido con garganta luminosa LED cálida en el Estar Social.'
    };
    groups.archMain.add(ceilingPlate);

    const ledCove = new THREE.Mesh(
      new THREE.BoxGeometry(4.52, 0.025, 4.52),
      mats.ledWarmMat
    );
    ledCove.position.set(1.55, 2.71, 7.25);
    groups.archMain.add(ledCove);
  }

  // ============================================================================
  // E. GALERÍA AL RÍO (3.50m × 9.55m en Eje A–B, Losa L1–L3 Y = -0.45m) SIN PARRILLA ARRIBA
  //    La Parrillita está abajo en el Subsuelo hacia el patio posterior
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
      'Reja Lateral Norte de Seguridad en Galería (Eje 1 • z = 9.94m a 13.34m)'
    )
  );
  groups.archMain.add(
    createBalconyGrille3D(
      THREE, mats, -4.82, 9.94, -4.82, 13.30, yGal, 1.05,
      'Reja Lateral Sur de Seguridad en Galería (Eje 9 • z = 9.94m a 13.34m)'
    )
  );

  if (isAtLeast350) {
    const outdoorTable = new THREE.Mesh(new THREE.BoxGeometry(2.20, 0.76, 1.00), mats.woodDeckPBR);
    outdoorTable.position.set(0.85, yGal + 0.40, 11.75);
    galGroup.add(outdoorTable);
  }

  tagGroupUserData(galGroup, {
    type: 'galeria_mirador',
    name: 'Galería Panorámica al Río Paraguay (3.50m × 9.55m • Losa L1–L3 Y = -0.45m • Sin Parrilla Arriba)',
    dimensions: '9.55m × 3.50m (33.4 m² • Cota +99.55m / Y=-0.45m)',
    status: 'Terraza Mirador Limpia al Río Paraguay ✨',
    desc: 'Galería social cubierta sobre Eje A–B con vista abierta al Río Paraguay. Siguiendo el proyecto original, no lleva parrilla arriba (la parrillita está en el Subsuelo hacia el patio).'
  });
  groups.archMain.add(galGroup);

  // ============================================================================
  // F. SUBSUELO REAL DE 100,71 m² LIBRES BAJO TODA LA PRIMERA LOSA (Y = -2.34m):
  //    - PARRILLITA / QUINCHO INFERIOR HACIA EL PATIO (x = -4.50m..-2.00m, z = 12.20m..13.34m)
  //    - LAVADERO OPERATIVO + DEPÓSITO CERRADO (z = 3.00m..5.20m)
  // ============================================================================
  const ySub = -2.34;
  const hSub = 2.28;
  const subWallMat = isAtLeast440 ? mats.plasterPBR : mats.plasterRoughPBR;

  // Muro frontal del Subsuelo en Eje G (z = 3.00m), frente al Foso de Oxigenación (z = 1.50m..3.00m)
  addWallSegment(
    groups.archSubsuelo,
    -4.87, 3.00, 2.75, 3.00,
    ySub, hSub, 0.20, subWallMat,
    'Muro Frontal Subsuelo sobre Eje G (z = 3.00m • Frente a Foso de Oxigenación z = +1.50m..+3.00m)',
    'Cerramiento frontal del Subsuelo sobre Eje G ventilado e iluminado por la zanja de oxigenación cubierta con rejilla electroforjada.'
  );
  groups.archSubsuelo.add(
    createWoodenDoor3D(
      THREE, mats, 3.30, ySub, 3.00, 0.80, 2.05, 0, 0.35,
      'Puerta de Inspección y Ventilación hacia Foso de Oxigenación Antihumedad (Eje G • z = 3.00m)'
    )
  );

  addWallSegment(
    groups.archSubsuelo,
    -4.87, 3.00, -4.87, 13.34,
    ySub, hSub, 0.20, subWallMat,
    'Muro Lateral Sur/Izquierdo Subsuelo (Eje 9 • x = -4.87m • Junto a Escalera 1)',
    'Cerramiento lateral Sur/Izquierdo del Subsuelo donde desembarca la Escalera 1.'
  );
  addWallSegment(
    groups.archSubsuelo,
    4.87, 3.00, 4.87, 13.34,
    ySub, hSub, 0.20, subWallMat,
    'Muro Lateral Norte/Derecho Subsuelo (Eje 1 • x = +4.87m)',
    'Cerramiento lateral Norte/Derecho del Subsuelo.'
  );

  // Núcleo de Depósito y Lavadero en Subsuelo (x = -3.80m a -0.80m, z = 3.00m a 5.20m), dejando libre x = -4.87..-3.90m (z = 5.26..8.60m) para el desembarco de Escalera 1
  addWallSegment(
    groups.archSubsuelo,
    -0.80, 3.00, -0.80, 5.20,
    ySub, hSub, 0.15, subWallMat,
    'Tabique Divisorio Subsuelo — Depósito y Lavadero (x = -0.80m, z = 3.00..5.20m)',
    'Cierra el núcleo de Depósito y Lavadero bajo la columna húmeda Eje F–G.'
  );
  addWallSegment(
    groups.archSubsuelo,
    -4.87, 5.20, -0.80, 5.20,
    ySub, hSub, 0.15, subWallMat,
    'Tabique Frontal Depósito y Lavadero en Subsuelo (Eje F • z = 5.20m)',
    'Separa el Depósito y Lavadero del salón principal del Subsuelo y del pie de la Escalera 1.'
  );

  groups.archSubsuelo.add(
    createWoodenDoor3D(
      THREE, mats, -1.65, ySub, 5.20, 0.82, 2.05, 0, 0.45,
      'Puerta de Madera — Depósito y Lavadero en Subsuelo (Núcleo Húmedo Eje F–G)'
    )
  );

  // F1. Lavadero Operativo en Subsuelo bajo el núcleo húmedo Eje F–G
  groups.archSubsuelo.add(
    createLaundryModule3D(THREE, mats, -1.85, ySub + 0.03, 3.65, 0, 'Lavadero en Subsuelo • Núcleo Húmedo Eje F–G (300M)')
  );

  // F2. Estanterías de Depósito en Subsuelo (x = -4.35..-3.15m, z = 3.40..4.60m)
  const storageRoomGroup = new THREE.Group();
  [-4.35, -3.25].forEach((sx, idx) => {
    const rackFrame = new THREE.Group();
    [0.25, 0.75, 1.25, 1.75].forEach((shY) => {
      const shelfPlate = new THREE.Mesh(
        new THREE.BoxGeometry(0.50, 0.03, 1.45),
        mats.woodDeckPBR
      );
      shelfPlate.position.set(sx, ySub + shY, 4.00);
      rackFrame.add(shelfPlate);
    });
    [[-0.22, -0.68], [0.22, -0.68], [-0.22, 0.68], [0.22, 0.68]].forEach(([px, pz]) => {
      const post = new THREE.Mesh(
        new THREE.BoxGeometry(0.035, 1.85, 0.035),
        mats.blackMetalMat
      );
      post.position.set(sx + px, ySub + 0.95, 4.00 + pz);
      rackFrame.add(post);
    });
    [0.38, 0.88, 1.38].forEach((by, bIdx) => {
      const box = new THREE.Mesh(
        new THREE.BoxGeometry(0.38, 0.24, 0.42),
        new THREE.MeshStandardMaterial({
          color: (idx + bIdx) % 2 === 0 ? 0xd97706 : 0x475569,
          roughness: 0.65
        })
      );
      box.position.set(sx, ySub + by, 3.75 + bIdx * 0.30);
      rackFrame.add(box);
    });
    storageRoomGroup.add(rackFrame);
  });

  tagGroupUserData(storageRoomGroup, {
    type: 'ambiente_equipado',
    name: 'Depósito Cerrado y Organizado en Subsuelo con Estanterías de Guardado (Eje F–G)',
    dimensions: '4.07m × 2.20m (8.95 m² cerrados • Cota +97.66m / Y=-2.34m)',
    costo: 'Incluido en Subsuelo Habitable (300M)',
    status: 'Depósito Seco y Ventilado desde el Día 1 🎯',
    desc: 'Depósito cerrado y lavadero en el Subsuelo alineados bajo el núcleo húmedo Eje F–G.'
  });
  groups.archSubsuelo.add(storageRoomGroup);

  // F3. PARRILLITA / QUINCHO INFERIOR EN SUBSUELO HACIA EL PATIO (x = -4.50m..-2.00m, z = 12.20m..13.34m, Y = -2.34m)
  groups.archSubsuelo.add(buildSubsueloParilla3D(THREE, mats, ySub, scenarioKey));

  // Ventanal Corredizo Blindex del Subsuelo mirando al Jardín y Piscina (Eje B z=9.94m)
  groups.archSubsuelo.add(
    createBlindexWindow3D(
      THREE, mats, 0.45, ySub + 1.12, 9.94, 6.40, 2.15, 0,
      'Ventanal Corredizo Blindex 10mm — Subsuelo hacia Quincho Inferior, Jardín y Piscina (Eje B)',
      'Cerramiento de vidrio templado Blindex con salida directa a la Parrillita del Subsuelo y al patio con piscina.'
    )
  );

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

  // G1. Solado Interior Cubierto de Planta Alta (z = 3.00m..9.94m) + Deck 2 / Terraza al Río (z = 9.94m..13.34m)
  const paFloorInterior = new THREE.Mesh(
    new THREE.BoxGeometry(9.54, 0.03, 6.94),
    isAtLeast350 ? mats.porcelainPBR : mats.plasterRoughPBR
  );
  paFloorInterior.position.set(0, localFloorY, 6.47);
  paFloorInterior.receiveShadow = true;
  paFloorInterior.userData = {
    type: 'piso_terminado',
    name: isAtLeast350
      ? 'Piso Porcelanato Rectificado 60×60cm en Planta Alta — Suite, Vestidor, Dormitorio 2, Escritorio y 2 Baños (+102.88m)'
      : 'Solado Nivelado en Planta Alta + Cerámico Impermeable en Baño en Suite y SSHH 2 (Base 300M)',
    dimensions: '9.54m × 6.94m cubiertos (z = 3.00m..9.94m en Cota +102.88m / Y=+2.88m)',
    status: isAtLeast350 ? 'Porcelanato 60×60 en Planta Alta ✨' : 'Planta Alta Habitable desde 300M 🎯',
    desc: 'Piso interior de Planta Alta según plano original: Vestidor + Baño en Suite + SSHH 2 sobre Eje F–G (z=3.00..5.00m), Dormitorio Principal en Suite (5.00×3.95m), Dormitorio 2 (3.85×3.00m) y Escritorio/Desk (3.50×2.30m).'
  };
  plantaAltaArchGroup.add(paFloorInterior);

  const paDeck2Floor = new THREE.Mesh(
    new THREE.BoxGeometry(9.54, 0.03, 3.40),
    isAtLeast350 ? mats.woodDeckPBR : mats.plasterRoughPBR
  );
  paDeck2Floor.position.set(0, localFloorY - 0.01, 11.64);
  paDeck2Floor.receiveShadow = true;
  paDeck2Floor.userData = {
    type: 'piso_terminado',
    name: 'DECK 2 / TERRAZA MIRADOR AL RÍO EN PLANTA ALTA (z = 9.94m..13.34m • Ejes A–B)',
    dimensions: '9.54m × 3.40m (32.4 m² de Terraza Panorámica al Río Paraguay en Cota +102.88m)',
    status: isAtLeast350 ? 'Deck / Porcelanato Exterior Antideslizante ✨' : 'Terraza Mirador Impermeabilizada 🎯',
    desc: 'Deck 2 / Terraza Panorámica al Río Paraguay en Planta Alta (z = 9.94m a 13.34m sobre la Galería de PB), con acceso directo desde el Dormitorio Principal en Suite, Dormitorio 2 y Escritorio.'
  };
  plantaAltaArchGroup.add(paDeck2Floor);

  // G2. Cerramientos Perimetrales y Fachada Frontal CIEGA con Ventiluces Altos sobre Eje G (z = 3.00m, SIN balcón frontal)
  addWallSegment(
    plantaAltaArchGroup,
    -4.87, 3.00, -4.87, 9.94,
    0.00, hPA, 0.20, extWallMat,
    'Muro Medianero Oeste Planta Alta (Eje 9 • z = 3.00m..9.94m)',
    'Cerramiento lateral Oeste de Planta Alta que protege el Vestidor y el Dormitorio Principal en Suite.'
  );
  addWallSegment(
    plantaAltaArchGroup,
    4.87, 3.00, 4.87, 9.94,
    0.00, hPA, 0.20, extWallMat,
    'Muro Medianero Este Planta Alta (Eje 1 • z = 3.00m..9.94m)',
    'Cerramiento lateral Este de Planta Alta junto al desembarco de la Escalera 2 y el Escritorio.'
  );

  // Fachada Frontal de Planta Alta sobre Eje G (z = 3.00m): Muro de mampostería revocada con ventiluces altos horizontales (SIN balcón frontal ni Blindex de piso a techo)
  addWallSegment(
    plantaAltaArchGroup,
    -4.87, 3.00, 4.87, 3.00,
    0.00, 1.90, 0.20, extWallMat,
    'Muro Frontal de Mampostería Revocada en Planta Alta (Eje G • z = 3.00m — Sin Balcón Frontal)',
    'Muro frontal sólido sobre la Línea de Edificación (Eje G z = 3.00m) que resguarda la privacidad del Vestidor, Baño en Suite y SSHH 2 hacia la calle.'
  );
  addWallSegment(
    plantaAltaArchGroup,
    -4.87, 3.00, 4.87, 3.00,
    2.38, hPA, 0.20, extWallMat,
    'Dintel Superior Fachada Frontal Planta Alta (Eje G • z = 3.00m)',
    'Viga dintel superior sobre la faja de ventiluces altos de los núcleos húmedos y vestidor en Eje G.'
  );
  // Mochetas entre ventiluces altos en Eje G (z = 3.00m)
  addWallSegment(plantaAltaArchGroup, -4.87, 3.00, -4.35, 3.00, 1.90, 2.38, 0.20, extWallMat, 'Mocheta Frontal Oeste Eje G', 'Mocheta de mampostería en fachada frontal PA.');
  addWallSegment(plantaAltaArchGroup, -3.25, 3.00, -2.05, 3.00, 1.90, 2.38, 0.20, extWallMat, 'Mocheta Frontal Central-Oeste Eje G', 'Mocheta entre ventiluz de Vestidor y ventiluz de Baño en Suite.');
  addWallSegment(plantaAltaArchGroup, -0.45, 3.00, 1.95, 3.00, 1.90, 2.38, 0.20, extWallMat, 'Mocheta Frontal Central-Este Eje G', 'Muro ciego sobre hall de escalera y separación con SSHH 2.');
  addWallSegment(plantaAltaArchGroup, 3.55, 3.00, 4.87, 3.00, 1.90, 2.38, 0.20, extWallMat, 'Mocheta Frontal Este Eje G', 'Mocheta sobre el cajón de Escalera 2 en Eje G.');

  // 3 Ventiluces Altos Horizontales (Clerestory Windows) sobre Eje G (z = 3.00m) para Vestidor, Baño en Suite y SSHH 2
  plantaAltaArchGroup.add(
    createBlindexWindow3D(
      THREE, mats, -3.80, 2.14, 3.00, 1.10, 0.46, 0,
      'Ventiluz Alto Horizontal — Vestidor en Suite (Fachada Eje G z = 3.00m)',
      'Ventiluz superior tipo balancín en aluminio negro y vidrio traslúcido sobre Eje G para iluminación cenital del Vestidor.'
    )
  );
  plantaAltaArchGroup.add(
    createBlindexWindow3D(
      THREE, mats, -1.25, 2.14, 3.00, 1.60, 0.46, 0,
      'Ventiluz Alto Horizontal — Baño en Suite (Fachada Eje G z = 3.00m)',
      'Ventiluz superior horizontal de ventilación cruzada e iluminación natural del Baño en Suite sobre Eje G.'
    )
  );
  plantaAltaArchGroup.add(
    createBlindexWindow3D(
      THREE, mats, 2.75, 2.14, 3.00, 1.60, 0.46, 0,
      'Ventiluz Alto Horizontal — SSHH 2 / Baño de Planta Alta (Fachada Eje G z = 3.00m)',
      'Ventiluz superior horizontal en fachada frontal Eje G para el segundo baño de Planta Alta (SSHH 2).'
    )
  );

  // G3. Tabiquería Interior de Planta Alta según Plano Original:
  //     - Franja Sur Eje F–G (z = 3.00m..5.00m): VESTIDOR (x=-4.87..-2.80m), BAÑO EN SUITE (x=-2.80..+0.50m), Hall, SSHH 2 (x=+1.69..+3.84m)
  addWallSegment(
    plantaAltaArchGroup,
    -2.80, 3.00, -2.80, 5.00,
    0.00, hPA, 0.15, intWallMat,
    'Tabique Divisorio Vestidor / Baño en Suite (x = -2.80m, z = 3.00..5.00m)',
    'Divide el Vestidor (1.55m × 1.80m) del Baño en Suite (2.30m × 2.00m) sobre el núcleo húmedo de Eje F–G.'
  );
  addWallSegment(
    plantaAltaArchGroup,
    0.50, 3.00, 0.50, 5.00,
    0.00, hPA, 0.15, intWallMat,
    'Muro Este del Baño en Suite (x = +0.50m, z = 3.00..5.00m)',
    'Cierra el Baño en Suite respecto del pasillo distribuidor de Planta Alta.'
  );
  addWallSegment(
    plantaAltaArchGroup,
    1.69, 3.00, 1.69, 5.00,
    0.00, hPA, 0.15, intWallMat,
    'Muro Oeste de SSHH 2 / Baño de Planta Alta (x = +1.69m, z = 3.00..5.00m)',
    'Cierra el segundo baño de Planta Alta (SSHH 2 • 2.30m × 2.00m) sobre Eje F–G.'
  );
  addWallSegment(
    plantaAltaArchGroup,
    3.84, 3.00, 3.84, 5.00,
    0.00, hPA, 0.15, intWallMat,
    'Muro Este de SSHH 2 junto a Escalera 2 (x = +3.84m, z = 3.00..5.00m)',
    'Separa el baño SSHH 2 de la caja de la Escalera 2 (PB -> PA).'
  );

  // Muro transversal en Eje F (z = 5.00m) que separa Vestidor + Baño Suite + SSHH 2 respecto de los Dormitorios y Circulación
  addWallSegment(
    plantaAltaArchGroup,
    -4.87, 5.00, -3.95, 5.00,
    0.00, hPA, 0.15, intWallMat,
    'Muro Eje F — Cierre de Vestidor hacia Suite (z = 5.00m)',
    'Tabique con vano de acceso directo entre el Dormitorio Principal en Suite y su Vestidor.'
  );
  addWallSegment(
    plantaAltaArchGroup,
    -3.10, 5.00, -1.85, 5.00,
    0.00, hPA, 0.15, intWallMat,
    'Muro Eje F — Divisoria Vestidor y Baño en Suite / Dormitorio Principal (z = 5.00m)',
    'Muro sanitario sobre Eje F (plomada directa con el núcleo húmedo de Planta Baja).'
  );
  addWallSegment(
    plantaAltaArchGroup,
    -1.05, 5.00, 0.50, 5.00,
    0.00, hPA, 0.15, intWallMat,
    'Muro Eje F — Cierre Norte Baño en Suite (z = 5.00m)',
    'Cierre del Baño Principal en Suite hacia el Dormitorio Principal.'
  );
  addWallSegment(
    plantaAltaArchGroup,
    1.69, 5.00, 2.35, 5.00,
    0.00, hPA, 0.15, intWallMat,
    'Muro Eje F — Cierre Oeste SSHH 2 (z = 5.00m)',
    'Mocheta de acceso al segundo baño de Planta Alta (SSHH 2).'
  );
  addWallSegment(
    plantaAltaArchGroup,
    3.15, 5.00, 3.84, 5.00,
    0.00, hPA, 0.15, intWallMat,
    'Muro Eje F — Cierre Este SSHH 2 (z = 5.00m)',
    'Cierre del baño SSHH 2 junto al desembarco de Escalera 2.'
  );

  // Tabique Longitudinal en Eje 5 (x = -0.74m, z = 5.00m..9.94m) que separa DORMITORIO PRINCIPAL EN SUITE (Oeste) de DORMITORIO 2 (Centro)
  addWallSegment(
    plantaAltaArchGroup,
    -0.74, 5.00, -0.74, 5.40,
    0.00, hPA, 0.15, intWallMat,
    'Mocheta Sur Eje 5 — Acceso a Dormitorio Principal en Suite (x = -0.74m)',
    'Mocheta de arranque del muro divisorio de la Suite Principal.'
  );
  addWallSegment(
    plantaAltaArchGroup,
    -0.74, 6.26, -0.74, 9.94,
    0.00, hPA, 0.15, intWallMat,
    'Tabique Divisorio Eje 5 — Dormitorio Principal en Suite / Dormitorio 2 (x = -0.74m, z = 6.26..9.94m)',
    'Divide el Dormitorio Principal en Suite (5.00m × 3.95m al Oeste) respecto del Dormitorio 2 (3.85m × 3.00m al Centro).'
  );

  // Cerramiento de DORMITORIO 2 (x = -0.74m..+1.80m, z = 5.26m..9.94m) respecto del Pasillo y del ESCRITORIO / DESK (x = +1.80m..+4.87m)
  addWallSegment(
    plantaAltaArchGroup,
    -0.74, 5.26, 0.35, 5.26,
    0.00, hPA, 0.15, intWallMat,
    'Muro Sur Dormitorio 2 hacia Pasillo Distribuidor (z = 5.26m)',
    'Cerramiento del Dormitorio 2 hacia el hall distribuidor de Planta Alta.'
  );
  addWallSegment(
    plantaAltaArchGroup,
    1.17, 5.26, 1.80, 5.26,
    0.00, hPA, 0.15, intWallMat,
    'Mocheta Este Puerta Dormitorio 2 (z = 5.26m)',
    'Mocheta de puerta de acceso al Dormitorio 2.'
  );
  addWallSegment(
    plantaAltaArchGroup,
    1.80, 5.26, 1.80, 9.94,
    0.00, hPA, 0.15, intWallMat,
    'Tabique Divisorio Dormitorio 2 / Escritorio-Desk (x = +1.80m, z = 5.26..9.94m)',
    'Separa el Dormitorio 2 (3.85m × 3.00m) del sector abierto de Escritorio / Desk (3.50m × 2.30m) en el desembarco de la Escalera 2.'
  );

  // Puertas Interiores de Madera en Planta Alta (Vestidor, Baño en Suite, SSHH 2, Dormitorio Principal y Dormitorio 2)
  plantaAltaArchGroup.add(
    createWoodenDoor3D(
      THREE, mats, -3.52, localFloorY, 5.00, 0.80, 2.10, 0, 0.50,
      'Puerta Placa de Madera — Acceso a Vestidor (1.55m × 1.80m) desde Dormitorio en Suite'
    )
  );
  plantaAltaArchGroup.add(
    createWoodenDoor3D(
      THREE, mats, -1.45, localFloorY, 5.00, 0.80, 2.10, 0, 0.55,
      'Puerta de Madera Hidrófuga — Baño Principal en Suite (2.30m × 2.00m en Eje F–G)'
    )
  );
  plantaAltaArchGroup.add(
    createWoodenDoor3D(
      THREE, mats, 2.75, localFloorY, 5.00, 0.80, 2.10, 0, -0.55,
      'Puerta de Madera Hidrófuga — SSHH 2 / Baño de Planta Alta (2.30m × 2.00m en Eje F–G)'
    )
  );
  plantaAltaArchGroup.add(
    createWoodenDoor3D(
      THREE, mats, -0.74, localFloorY, 5.83, 0.86, 2.10, Math.PI / 2, 0.65,
      'Puerta Principal de Madera — Acceso a Dormitorio Principal en Suite (5.00m × 3.95m)'
    )
  );
  plantaAltaArchGroup.add(
    createWoodenDoor3D(
      THREE, mats, 0.76, localFloorY, 5.26, 0.82, 2.10, 0, 0.60,
      'Puerta Placa de Madera — Acceso a Dormitorio 2 (3.85m × 3.00m)'
    )
  );

  // Cerramiento Vidriado sobre Eje B (z = 9.94m) con Salida a DECK 2 / TERRAZA AL RÍO (z = 9.94m..13.34m)
  plantaAltaArchGroup.add(
    createBlindexWindow3D(
      THREE, mats, -2.80, 1.25, 9.94, 3.80, 2.30, 0,
      'Gran Ventanal Corredizo Blindex — Dormitorio Principal en Suite hacia Deck 2 / Terraza al Río (Eje B z = 9.94m)',
      'Puerta-ventana corrediza Blindex 10mm del Dormitorio Principal en Suite con salida directa a la Terraza Panorámica al Río Paraguay.'
    )
  );
  plantaAltaArchGroup.add(
    createBlindexWindow3D(
      THREE, mats, 0.53, 1.25, 9.94, 2.30, 2.30, 0,
      'Puerta-Ventana Corrediza Blindex — Dormitorio 2 hacia Deck 2 / Terraza al Río (Eje B z = 9.94m)',
      'Ventanal corredizo de piso a dintel en el Dormitorio 2 con vista y salida a la terraza mirador Norte.'
    )
  );
  plantaAltaArchGroup.add(
    createBlindexWindow3D(
      THREE, mats, 3.33, 1.25, 9.94, 2.85, 2.30, 0,
      'Ventanal Panorámico Blindex — Escritorio / Desk hacia Deck 2 / Terraza al Río (Eje B z = 9.94m)',
      'Cerramiento vidriado del Escritorio / Home-Office de Ruth y Leo con luz natural Norte y salida al Deck 2.'
    )
  );

  // Barandas Perimetrales de Seguridad en DECK 2 / TERRAZA MIRADOR AL RÍO (z = 9.94m..13.34m, SIN balcón frontal en Eje G)
  plantaAltaArchGroup.add(
    createBalconyGrille3D(
      THREE, mats, -4.82, 13.30, 4.82, 13.30, 0.18, 1.08,
      'Baranda y Reja de Seguridad en Deck 2 / Terraza Mirador al Río (Eje A z = 13.34m)'
    )
  );
  plantaAltaArchGroup.add(
    createBalconyGrille3D(
      THREE, mats, -4.82, 9.94, -4.82, 13.30, 0.18, 1.08,
      'Baranda Lateral Oeste Deck 2 / Terraza Mirador (z = 9.94m..13.30m)'
    )
  );
  plantaAltaArchGroup.add(
    createBalconyGrille3D(
      THREE, mats, 4.82, 9.94, 4.82, 13.30, 0.18, 1.08,
      'Baranda Lateral Este Deck 2 / Terraza Mirador (z = 9.94m..13.30m)'
    )
  );

  // G4. Equipamiento de VESTIDOR (x = -4.87..-2.80m, z = 3.00..5.00m), BAÑO EN SUITE (x = -2.80..+0.50m, z = 3.00..5.00m) y SSHH 2 (x = +1.69..+3.84m, z = 3.00..5.00m)
  // Baño Principal en Suite (2.30m × 2.00m sobre Eje F–G, apilado sobre el núcleo húmedo de PB)
  plantaAltaArchGroup.add(createToilet3D(THREE, mats, -2.15, localFloorY + 0.02, 3.42, 0, 'Baño Principal en Suite (Eje F–G)'));
  plantaAltaArchGroup.add(createBidet3D(THREE, mats, -1.45, localFloorY + 0.02, 3.42, 0, 'Baño Principal en Suite (Eje F–G)'));
  plantaAltaArchGroup.add(createVanity3D(THREE, mats, -0.35, localFloorY + 0.02, 3.48, 0.90, 0, 'Baño Principal en Suite (Eje F–G)'));
  plantaAltaArchGroup.add(createShowerBox3D(THREE, mats, -2.22, localFloorY + 0.02, 4.35, 1.05, 1.15, 0, 'Baño Principal en Suite (Eje F–G)'));

  // SSHH 2 / Segundo Baño Completo de Planta Alta (2.30m × 2.00m en x = +1.69..+3.84m, z = 3.00..5.00m)
  plantaAltaArchGroup.add(createToilet3D(THREE, mats, 2.15, localFloorY + 0.02, 3.42, 0, 'SSHH 2 / Baño de Planta Alta (Eje F–G)'));
  plantaAltaArchGroup.add(createVanity3D(THREE, mats, 2.95, localFloorY + 0.02, 3.48, 0.85, 0, 'SSHH 2 / Baño de Planta Alta (Eje F–G)'));
  plantaAltaArchGroup.add(createShowerBox3D(THREE, mats, 3.32, localFloorY + 0.02, 4.35, 0.95, 1.15, 0, 'SSHH 2 / Baño de Planta Alta (Eje F–G)'));

  // G5. DORMITORIO PRINCIPAL EN SUITE (5.00m × 3.95m en x = -4.87..-0.74m, z = 5.00..9.94m):
  //     1 Sommier de 1,40m + 2 Mesas de Luz + Tocador #1 con Espejo (Propios — Gs. 0)
  const suiteOwnFurnitureGroup = new THREE.Group();

  const headboard = new THREE.Mesh(new THREE.BoxGeometry(0.10, 1.10, 1.44), mats.woodDeckPBR);
  headboard.position.set(-4.72, localFloorY + 0.56, 7.55);
  suiteOwnFurnitureGroup.add(headboard);

  const sommierBase = new THREE.Mesh(new THREE.BoxGeometry(1.90, 0.28, 1.40), mats.linenSofaMat);
  sommierBase.position.set(-3.75, localFloorY + 0.15, 7.55);
  suiteOwnFurnitureGroup.add(sommierBase);

  const sommierMattress = new THREE.Mesh(new THREE.BoxGeometry(1.90, 0.24, 1.40), mats.bedSheetMat);
  sommierMattress.position.set(-3.75, localFloorY + 0.40, 7.55);
  suiteOwnFurnitureGroup.add(sommierMattress);

  const duvet = new THREE.Mesh(new THREE.BoxGeometry(1.30, 0.25, 1.42), mats.bedDuvetMat);
  duvet.position.set(-3.44, localFloorY + 0.41, 7.55);
  suiteOwnFurnitureGroup.add(duvet);

  [-0.34, 0.34].forEach((pz) => {
    const pillow = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.12, 0.52), mats.bedSheetMat);
    pillow.position.set(-4.42, localFloorY + 0.56, 7.55 + pz);
    suiteOwnFurnitureGroup.add(pillow);
  });

  // 2 Mesas de Luz (0.45m × 0.40m × 0.52m c/u, Propias — Gs. 0)
  [-0.96, 0.96].forEach((nz) => {
    const nightStand = new THREE.Mesh(new THREE.BoxGeometry(0.40, 0.52, 0.45), mats.woodDoorPBR);
    nightStand.position.set(-4.52, localFloorY + 0.26, 7.55 + nz);
    suiteOwnFurnitureGroup.add(nightStand);

    const lamp = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.11, 0.22, 14), mats.ledWarmMat);
    lamp.position.set(-4.52, localFloorY + 0.63, 7.55 + nz);
    suiteOwnFurnitureGroup.add(lamp);
  });

  // Tocador de Dormitorio #1 con Espejo y Cajones en la Suite (0.85m × 0.42m × 1.45m, Propio — Gs. 0)
  const dresser1Base = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.76, 0.85), mats.woodDoorPBR);
  dresser1Base.position.set(-1.05, localFloorY + 0.38, 7.85);
  suiteOwnFurnitureGroup.add(dresser1Base);

  const dresser1Mirror = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.68, 0.65), mats.mirrorMat);
  dresser1Mirror.position.set(-0.85, localFloorY + 1.10, 7.85);
  suiteOwnFurnitureGroup.add(dresser1Mirror);

  tagGroupUserData(suiteOwnFurnitureGroup, {
    type: 'mobiliario_propio',
    name: 'Dormitorio Principal en Suite (5.00m × 3.95m): 1 Sommier de 1,40m + 2 Mesas de Luz + Tocador #1 con Espejo (Inventario Propio)',
    dimensions: 'Sommier 1.40m × 1.90m + 2 Mesas de Luz (0.45×0.40m) + Tocador #1 (0.85×0.42m) en Suite PA',
    costo: 'Gs. 0 (Propio de Ruth y Leo — A trasladar)',
    status: 'Propio del Propietario en Suite PA (Gs. 0 — A trasladar) 📦',
    desc: 'Equipamiento propio de Ruth y Leo instalado en el Dormitorio Principal en Suite (5.00m × 3.95m, z=5.00..9.94m) con Vestidor independiente, Baño en Suite y salida a Deck 2 / Terraza al Río.'
  });
  plantaAltaArchGroup.add(suiteOwnFurnitureGroup);

  // G6. ESCRITORIO / DESK (3.50m × 2.30m en x = +1.80m..+4.87m, z = 7.37m..9.94m, al desembarco de Escalera 2):
  //     2 Escritorios pequeños de Ruth y Leo + 2 Sillas de oficina + Máquina de coser antigua
  const homeOfficePAGroup = new THREE.Group();

  [2.45, 3.60].forEach((dxOffset) => {
    const deskTop = new THREE.Mesh(new THREE.BoxGeometry(1.00, 0.035, 0.52), mats.woodDeckPBR);
    deskTop.position.set(dxOffset, localFloorY + 0.75, 8.85);
    homeOfficePAGroup.add(deskTop);

    [[-0.45, -0.22], [0.45, -0.22], [-0.45, 0.22], [0.45, 0.22]].forEach(([lx, lz]) => {
      const dLeg = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.73, 0.04), mats.blackMetalMat);
      dLeg.position.set(dxOffset + lx, localFloorY + 0.37, 8.85 + lz);
      homeOfficePAGroup.add(dLeg);
    });

    const laptop = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.22, 0.02), mats.blackMetalMat);
    laptop.position.set(dxOffset, localFloorY + 0.88, 8.95);
    homeOfficePAGroup.add(laptop);
  });

  // 2 Sillas Ergonómicas de Oficina en Escritorio / Desk (x = 2.45m y 3.60m)
  [2.45, 3.60].forEach((chairX) => {
    const chairZ = 8.32;
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
    officeBack.position.set(chairX, localFloorY + 0.72, chairZ - 0.22);
    homeOfficePAGroup.add(officeBack);
  });

  tagGroupUserData(homeOfficePAGroup, {
    type: 'mobiliario_propio',
    name: 'Escritorio / Desk en Planta Alta (3.50m × 2.30m • Desembarco Escalera 2): 2 Escritorios de Ruth y Leo + 2 Sillas Ergonómicas',
    dimensions: 'Ambiente Escritorio 3.50m × 2.30m (x=+1.80..+4.87m, z=7.37..9.94m) • 2 Escritorios 1.00×0.52m',
    costo: '2 Escritorios + 1 Silla Gs. 0 (Propios) • 2da Silla Ergonómica: Gs. 850.000',
    status: 'Escritorio / Home-Office Doble de Ruth y Leo 📦✨',
    desc: 'Sector de Escritorio / Desk (3.50m × 2.30m) ubicado al desembarco de la Escalera 2 en Planta Alta según el plano original, con vista directa al Río Paraguay y salida al Deck 2.'
  });
  plantaAltaArchGroup.add(homeOfficePAGroup);

  // Máquina de Coser Antigua en el sector Escritorio / Desk (x = 2.15m, z = 7.75m, contra tabique x = +1.80m)
  const antiqueSewingGroup = new THREE.Group();
  const asmX = 2.15;
  const asmZ = 7.75;

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
    name: 'Máquina de Coser Antigua Completa en Escritorio / Desk de Planta Alta (x = 2.15m, z = 7.75m)',
    dimensions: '0.78m × 0.46m × 1.05m • Pedestal de Hierro Fundido + Gabinete y Cabezal Antiguo',
    costo: 'Gs. 0 (Propio de Ruth y Leo — A trasladar)',
    status: 'Propio del Propietario en Escritorio PA (Gs. 0 — A trasladar) 📦',
    desc: 'Máquina de coser antigua clásica con pedestal de hierro forjado, pedal, gabinete de madera y cabezal original ubicada en el ambiente Escritorio / Desk (3.50m × 2.30m) de Planta Alta.'
  });
  plantaAltaArchGroup.add(antiqueSewingGroup);

  // G7. DORMITORIO 2 (3.85m × 3.00m en x = -0.74m..+1.80m, z = 5.26m..9.94m):
  //     1 Cama de 1 Plaza (0.90m × 1.90m, Propia — Gs. 0) + Tocador de Dormitorio #2 con Espejo (Propio — Gs. 0)
  const secondRoomOwnFurniture = new THREE.Group();
  const sbX = 1.15;
  const sbZ = 7.65;

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
  dresser2Base.position.set(-0.42, localFloorY + 0.38, 7.45);
  secondRoomOwnFurniture.add(dresser2Base);

  const dresser2Mirror = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.68, 0.65), mats.mirrorMat);
  dresser2Mirror.position.set(-0.60, localFloorY + 1.10, 7.45);
  secondRoomOwnFurniture.add(dresser2Mirror);

  tagGroupUserData(secondRoomOwnFurniture, {
    type: 'mobiliario_propio',
    name: 'Dormitorio 2 en Planta Alta (3.85m × 3.00m): 1 Cama de 1 Plaza (0.90×1.90m) + Tocador de Dormitorio #2 con Espejo',
    dimensions: 'Dormitorio 2 (x=-0.74..+1.80m, z=5.26..9.94m) • Cama 1 Plaza 0.90×1.90m + Tocador #2 0.85×0.42m',
    costo: 'Gs. 0 (Propio de Ruth y Leo — A trasladar)',
    status: 'Propio del Propietario en Dormitorio 2 PA (Gs. 0 — A trasladar) 📦',
    desc: 'Segundo dormitorio independiente de Planta Alta (3.85m × 3.00m) con salida al Deck 2 / Terraza al Río y acceso directo al baño SSHH 2, equipado con la cama de 1 plaza y el tocador #2 con espejo.'
  });
  plantaAltaArchGroup.add(secondRoomOwnFurniture);

  // G8. ADICIONAL CLAVE A PRESUPUESTAR EN PLANTA ALTA: Placares de Vestidor (1.55m × 1.80m) y Placares de Dormitorio 2
  if (isAtLeast350) {
    const budgetedClosetsGroup = new THREE.Group();

    const closetVestidorWest = new THREE.Mesh(new THREE.BoxGeometry(0.55, 2.40, 1.75), mats.woodDoorPBR);
    closetVestidorWest.position.set(-4.48, localFloorY + 1.22, 3.95);
    budgetedClosetsGroup.add(closetVestidorWest);

    const closetSecond = new THREE.Mesh(new THREE.BoxGeometry(1.45, 2.40, 0.56), mats.woodDoorPBR);
    closetSecond.position.set(0.55, localFloorY + 1.22, 5.62);
    budgetedClosetsGroup.add(closetSecond);

    if (isAtLeast440) {
      const acSplit = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.28, 0.92), mats.ceramicSanitaryMat);
      acSplit.position.set(-4.65, localFloorY + 2.18, 7.55);
      budgetedClosetsGroup.add(acSplit);
    }

    tagGroupUserData(budgetedClosetsGroup, {
      type: 'adicional_a_presupuestar',
      name: 'Módulos de Vestidor en Suite (1.55m × 1.80m) + Placar Empotrado en Dormitorio 2 (Adicional a Presupuestar)',
      dimensions: 'Vestidor Piso-Techo en Eje F–G (1.75×2.40m) + Placar Dormitorio 2 (1.45×2.40m)',
      costo: 'Gs. 9.600.000 (Vestidor + Placar Dormitorio 2 — A Presupuestar)',
      status: 'Adicional Clave a Presupuestar 🛠️',
      desc: 'Equipamiento de carpintería a medida para el Vestidor independiente (1.55m × 1.80m en Eje F–G) del Dormitorio en Suite y placar piso-techo para el Dormitorio 2.'
    });
    plantaAltaArchGroup.add(budgetedClosetsGroup);
  }

  // ============================================================================
  // G9. ELEMENTOS ESPECIALES SOLICITADOS POR RUTH Y LEO:
  //     - BIBLIOTECA DE 4 ESTANTES DE 2,00 METROS CADA UNO (8,00+ METROS LINEALES)
  //     - EMMA (CANICHE / POODLE) Y SERAFINA (GATA CALICÓ TRICOLOR)
  //     - MACETAS / FLOREROS CHICOS CON PLANTAS "ESPADA DE SAN JORGE" (Sansevieria)
  //     - SISTEMA DE ALARMA PET-IMMUNE (INMUNE A EMMA Y SERAFINA)
  // ============================================================================
  // 1) Biblioteca #1 de 4 estantes de 2,00m cada uno en el Estar / Living Social (sobre muro firme x = -0.95m, z = 8.45m)
  groups.archMain.add(
    createLibrary4Shelves2m3D(THREE, mats, -0.95, 0.03, 8.45, -Math.PI / 2, 'Estar / Living Social Nivel Calle (Muro Eje 5 x=-0.74m)')
  );
  // 2) Biblioteca #2 de 4 estantes de 2,00m cada uno en el Escritorio / Desk de Planta Alta (sobre tabique x = +1.98m, z = 8.55m)
  plantaAltaArchGroup.add(
    createLibrary4Shelves2m3D(THREE, mats, 1.98, localFloorY, 8.55, Math.PI / 2, 'Escritorio / Desk Planta Alta (Tabique x=+1.80m)')
  );

  // 2) Las Mascotas de Ruth y Leo: Emma (Caniche) y Serafina (Gata Calicó) en el Estar / Living Social
  groups.archMain.add(createEmmaPoodle3D(THREE, mats, 0.72, 0.03, 5.15, 0.45));
  groups.archMain.add(createSerafinaCalicoCat3D(THREE, mats, 2.55, 0.03, 6.45, -0.65));

  // 3) Floreros / Macetas Chicas con Plantas "Espada de San Jorge" (Sansevieria trifasciata) en distintos puntos de la casa
  groups.archMain.add(createSansevieriaPot3D(THREE, mats, 0.12, 0.64, 3.42, 0.72, 'Mesa Cuadrada de Florero y Libros'));
  groups.archMain.add(createSansevieriaPot3D(THREE, mats, 1.75, 0.44, 5.45, 0.68, 'Mesa Ratona de Sala'));
  groups.archMain.add(createSansevieriaPot3D(THREE, mats, 1.65, 0.03, 3.35, 1.05, 'Recibidor Puerta Principal'));
  groups.archMain.add(createSansevieriaPot3D(THREE, mats, -1.85, -0.42, 10.45, 1.15, 'Galería Panorámica al Río'));
  plantaAltaArchGroup.add(createSansevieriaPot3D(THREE, mats, -1.05, localFloorY + 0.76, 7.85, 0.70, 'Tocador Dormitorio Suite PA'));
  plantaAltaArchGroup.add(createSansevieriaPot3D(THREE, mats, 2.55, localFloorY + 0.76, 8.85, 0.68, 'Escritorio / Desk PA'));

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


