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
    label: 'Fachada Ciega, Portón Balancín 2.30m, Portón Peatonal 0.95m y Pérgola c/ Enredadera 3D',
    pos: [4.8, 2.8, -10.5],
    target: [0.4, 0.8, 0.8],
    cutaway: 'full'
  },
  escalera_subsuelo: {
    label: 'Escalera 1 al Subsuelo (Ejes 1–2 x=+3.84..+4.87m) + Doble Puerta de Servicio + Escalera 2 a Planta Alta (x=-4.87..-3.84m)',
    pos: [1.5, 4.2, 2.2],
    target: [4.2, -0.8, 7.2],
    cutaway: 'cut_pa'
  },
  estar_comedor: {
    label: 'Planta Baja (0.00m): Sala de Estar Social, Biblioteca 4 Estantes 2m, Serafina y Ventanal Blindex',
    pos: [1.2, 2.35, 11.6],
    target: [0.4, 0.85, 6.2],
    cutaway: 'cut_pa'
  },
  cocina_isla: {
    label: 'Planta Baja (0.00m): Cocina con Isla de Granito Negro, Bacha Doble, Campana, Alacena y Escalera 2',
    pos: [-1.4, 2.45, 8.6],
    target: [-3.1, 0.95, 4.0],
    cutaway: 'cut_pa'
  },
  acceso_bano_pb: {
    label: 'Planta Baja (0.00m): Puerta Principal Jerarquizada, Cerradura Smart, Baño Social y Ventanal a Cochera',
    pos: [0.6, 2.40, 8.2],
    target: [0.6, 0.95, 3.6],
    cutaway: 'cut_pa'
  },
  galeria_rio: {
    label: 'Planta Baja (0.00m): Puerta Principal Jerarquizada, Cerradura Smart, Baño Social y Ventanal a Cochera',
    pos: [0.6, 2.40, 8.2],
    target: [0.6, 0.95, 3.6],
    cutaway: 'cut_pa'
  },
  bano_suite: {
    label: '2do Piso (+2.88m): Vestidor en U + Baño en Suite c/ Acceso Directo desde Suite + Baño 2 PA (Eje F–G)',
    pos: [1.2, 10.6, 10.2],
    target: [1.2, 3.4, 4.4],
    cutaway: 'cut_roof'
  },
  dormitorio_suite: {
    label: '2do Piso (+2.88m): 2 Dormitorios (1 Sencillo Centro + 1 En Suite c/ Acceso a Vestidor) + Sector Escritorio',
    pos: [0.2, 11.4, 14.2],
    target: [0.2, 3.3, 7.2],
    cutaway: 'cut_roof'
  },
  dormitorio_sencillo: {
    label: '2do Piso (+2.88m): Dormitorio 1 Sencillo (Centro) + Dormitorio 2 en Suite (+X) + Escritorio (-X)',
    pos: [0.0, 11.4, 14.0],
    target: [0.0, 3.3, 7.3],
    cutaway: 'cut_roof'
  },
  mep_electricista: {
    label: '⚡ Vista Ingeniero Electricista (Ghost Mode + Tableros DIN + 4 Pases Losa + 9 Cajas Octogonales + 3 Splits AA + 26 Tomas)',
    pos: [8.2, 6.2, -1.8],
    target: [0.4, 0.8, 5.2],
    cutaway: 'full'
  },
  mep_plomero: {
    label: '🚰 Vista Maestro Plomero (Ghost Mode + Núcleo Húmedo Eje F–G + Pases #3/#4 + Termofusión PPR + Cloaca Ø100mm + Pozo Ciego)',
    pos: [-7.6, 5.6, 17.5],
    target: [-0.6, -0.2, 8.8],
    cutaway: 'full'
  },
  galeria_parrilla: {
    label: 'Galería Panorámica al Río (Losa L1 Limpia) + Parrillita Inferior en Subsuelo',
    pos: [0.5, 1.65, 16.8],
    target: [-1.5, -0.6, 11.8],
    cutaway: 'cut_pa'
  },
  piscina_quincho: {
    label: 'Subsuelo Libre 100 m² (-2.34m) + Parrillita de Ladrillo + Galería Superior + Jardín, Pérgola y Cloaca Autónoma',
    pos: [-5.8, 3.8, 24.5],
    target: [0.0, -1.5, 14.5],
    cutaway: 'full',
    forceShowPoolQuincho: true
  },
  exterior_hero: {
    label: 'Subsuelo Libre 100 m² (-2.34m) + Parrillita de Ladrillo + Galería Superior + Jardín, Pérgola y Cloaca Autónoma',
    pos: [-5.8, 3.8, 24.5],
    target: [0.0, -1.5, 14.5],
    cutaway: 'full',
    forceShowPoolQuincho: true
  },
  subsuelo_depto: {
    label: 'Subsuelo Libre 100 m² (-2.34m): Parrillita al Patio + Lavadero + Depósito + Rejilla Oxigenación',
    pos: [-5.8, 3.8, 24.5],
    target: [0.0, -1.5, 14.5],
    cutaway: 'full'
  },
  planta_alta: {
    label: '2do Piso (+2.88m): Sector Escritorio Extendido (-X hasta Eje A) + Dormitorio 1 Sencillo + Dormitorio 2 en Suite c/ Vestidor',
    pos: [-0.4, 11.4, 14.4],
    target: [-0.2, 3.3, 7.6],
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
  map.anisotropy = 16;

  const bumpMap = new THREE.CanvasTexture(bumpCanvas);
  bumpMap.wrapS = THREE.RepeatWrapping;
  bumpMap.wrapT = THREE.RepeatWrapping;
  bumpMap.repeat.set(repeatX, repeatY);
  bumpMap.anisotropy = 16;

  const roughnessMap = new THREE.CanvasTexture(roughCanvas);
  roughnessMap.wrapS = THREE.RepeatWrapping;
  roughnessMap.wrapT = THREE.RepeatWrapping;
  roughnessMap.repeat.set(repeatX, repeatY);
  roughnessMap.anisotropy = 16;

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
 * Con oclusión ambiental en juntas de mortero, variación de horneado artesanal y micro-porosidad cerámica.
 */
export function createParaguayanBrickTexture(THREE, repeatX = 3, repeatY = 2) {
  return makeProceduralTexturePair(
    THREE,
    (ctx, bCtx, s, rCtx) => {
      // Junta de mortero cementicio gris arena con sombra de oclusión
      ctx.fillStyle = '#b6b0a6';
      ctx.fillRect(0, 0, s, s);
      bCtx.fillStyle = '#181818';
      bCtx.fillRect(0, 0, s, s);
      rCtx.fillStyle = '#e5e5e5';
      rCtx.fillRect(0, 0, s, s);

      const rows = 16;
      const cols = 8;
      const rowH = s / rows;
      const colW = s / cols;
      const mortar = 7;

      for (let r = 0; r < rows; r++) {
        const offset = (r % 2) * (colW / 2);
        for (let c = -1; c <= cols; c++) {
          const bx = c * colW + offset + mortar / 2;
          const by = r * rowH + mortar / 2;
          const bw = colW - mortar;
          const bh = rowH - mortar;

          const seed = (r * 19 + c * 31 + 53) % 41;
          const tone = (seed % 28) - 14;
          const kilnBurn = seed % 7 === 0 ? -18 : 0;
          const red = Math.min(225, Math.max(138, 186 + tone + kilnBurn));
          const green = Math.min(115, Math.max(54, 82 + Math.floor(tone * 0.55) + Math.floor(kilnBurn * 0.7)));
          const blue = Math.min(84, Math.max(36, 52 + Math.floor(tone * 0.35)));

          // Sombra de contacto en junta inferior/derecha (Ambient Occlusion)
          ctx.fillStyle = 'rgba(40, 32, 26, 0.35)';
          ctx.fillRect(bx - 1, by - 1, bw + 3, bh + 3);

          // Cuerpo del ladrillo de Tobatí con gradiente de cocción
          const bGrad = ctx.createLinearGradient(bx, by, bx, by + bh);
          bGrad.addColorStop(0, `rgb(${Math.min(235, red + 10)}, ${green + 6}, ${blue + 4})`);
          bGrad.addColorStop(0.55, `rgb(${red}, ${green}, ${blue})`);
          bGrad.addColorStop(1, `rgb(${Math.max(120, red - 12)}, ${Math.max(45, green - 8)}, ${Math.max(30, blue - 6)})`);
          ctx.fillStyle = bGrad;
          ctx.fillRect(bx, by, bw, bh);

          // Veta de arcilla cocida y micro-poros
          ctx.fillStyle = 'rgba(124, 45, 18, 0.16)';
          ctx.fillRect(bx + 5, by + 4, bw - 10, bh * 0.32);
          for (let p = 0; p < 14; p++) {
            const px = bx + ((p * 23 + seed * 7) % Math.max(8, bw - 6)) + 3;
            const py = by + ((p * 17 + seed * 11) % Math.max(8, bh - 6)) + 3;
            ctx.fillStyle = p % 2 === 0 ? 'rgba(60,20,10,0.22)' : 'rgba(255,215,180,0.14)';
            ctx.fillRect(px, py, 3, 2);
          }

          // Relieve biselado en bumpMap + rugosidad mate cerámica
          bCtx.fillStyle = '#9a9a9a';
          bCtx.fillRect(bx, by, bw, bh);
          bCtx.fillStyle = '#e6e6e6';
          bCtx.fillRect(bx + 3, by + 3, bw - 6, bh - 6);
          rCtx.fillStyle = '#bcbcbc';
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
 * Con veta de tablas fenólicas, juntas de colado, poros de vibrado y conos de tensores metálicos.
 */
export function createBoardFormedConcreteTexture(THREE, repeatX = 2, repeatY = 2) {
  return makeProceduralTexturePair(
    THREE,
    (ctx, bCtx, s, rCtx) => {
      ctx.fillStyle = '#929aa4';
      ctx.fillRect(0, 0, s, s);
      bCtx.fillStyle = '#808080';
      bCtx.fillRect(0, 0, s, s);
      rCtx.fillStyle = '#adadad';
      rCtx.fillRect(0, 0, s, s);

      const plankH = 128;
      for (let y = 0; y < s; y += plankH) {
        const shade = 142 + ((y * 7) % 18) - 9;
        const pGrad = ctx.createLinearGradient(0, y, 0, y + plankH);
        pGrad.addColorStop(0, `rgb(${shade + 5}, ${shade + 9}, ${shade + 14})`);
        pGrad.addColorStop(0.5, `rgb(${shade}, ${shade + 4}, ${shade + 10})`);
        pGrad.addColorStop(1, `rgb(${shade - 6}, ${shade - 2}, ${shade + 4})`);
        ctx.fillStyle = pGrad;
        ctx.fillRect(0, y, s, plankH - 2);

        // Rebaba de unión entre tablas de encofrado
        ctx.fillStyle = 'rgba(30, 41, 59, 0.52)';
        ctx.fillRect(0, y, s, 3);
        ctx.fillStyle = 'rgba(241, 245, 249, 0.22)';
        ctx.fillRect(0, y + 3, s, 2);
        bCtx.fillStyle = '#242424';
        bCtx.fillRect(0, y, s, 4);
        bCtx.fillStyle = '#b8b8b8';
        bCtx.fillRect(0, y + 4, s, 2);

        for (let i = 0; i < 520; i++) {
          const rx = (i * 73 + y * 19) % s;
          const ry = y + ((i * 29) % (plankH - 6)) + 3;
          const alpha = (i % 5) * 0.028;
          ctx.fillStyle = i % 2 === 0 ? `rgba(255,255,255,${alpha})` : `rgba(30,41,59,${alpha})`;
          ctx.fillRect(rx, ry, 32, 2);
          bCtx.fillStyle = i % 2 === 0 ? '#9c9c9c' : '#646464';
          bCtx.fillRect(rx, ry, 20, 2);
          rCtx.fillStyle = i % 2 === 0 ? '#8c8c8c' : '#c4c4c4';
          rCtx.fillRect(rx, ry, 22, 2);
        }
      }

      [256, 768].forEach((cx) => {
        [192, 448, 704, 960].forEach((cy) => {
          ctx.beginPath();
          ctx.arc(cx, cy, 12, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(30, 41, 59, 0.45)';
          ctx.fill();
          ctx.beginPath();
          ctx.arc(cx, cy, 8, 0, Math.PI * 2);
          ctx.fillStyle = '#475569';
          ctx.fill();
          bCtx.beginPath();
          ctx.arc(cx, cy, 11, 0, Math.PI * 2);
          bCtx.fillStyle = '#181818';
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
    dimensions: 'Frente 9.89m × Altura 2.25m + Pilar Central de Mampostería entre Portoncito Peatonal (Izq.) y Portón Balancín (Der.)',
    costo: isFullExterior573 ? 'Gs. 10.677.500 (Ítem 20 Presupuesto Completo)' : 'Gs. 0 (Muralla Existente en Obra)',
    status: 'Privacidad 100% Opaca desde Calle Tte. Guillermo Arias 🔒🛡️',
    desc: 'Muralla perimetral ciega sobre línea municipal (z = -4.00m) respetando el lado real de cada portón según fotografía de obra: paño izquierdo ciego (x = +2.20..+4.95m), Portoncito Peatonal a la izquierda (x = +1.25..+2.20m), pilar central (x = -1.20..+1.25m), Portón Balancín a la derecha (x = -3.50..-1.20m) y machón derecho (x = -4.95..-3.50m).'
  };

  // Tramo izquierdo ciego mirando desde la calle (+X: x = +2.20m a +4.95m, ancho 2.75m)
  const leftBlindWall = new THREE.Mesh(new THREE.BoxGeometry(2.75, 2.25, 0.25), wallMat);
  leftBlindWall.position.set(3.575, 1.125, -4.00);
  leftBlindWall.userData = murallaData;
  facadeGroup.add(leftBlindWall);

  // Pilar central / machón de mampostería entre Portoncito Peatonal (+X) y Portón Balancín (-X) (x = -1.20m a +1.25m, ancho 2.45m)
  const centerMasonryWall = new THREE.Mesh(new THREE.BoxGeometry(2.45, 2.35, 0.28), wallMat);
  centerMasonryWall.position.set(0.025, 1.175, -4.00);
  centerMasonryWall.userData = murallaData;
  facadeGroup.add(centerMasonryWall);

  // Pilar derecho de mampostería mirando desde la calle (-X: x = -4.95m a -3.50m, ancho 1.45m)
  const rightMasonryWall = new THREE.Mesh(new THREE.BoxGeometry(1.45, 2.35, 0.28), wallMat);
  rightMasonryWall.position.set(-4.225, 1.175, -4.00);
  rightMasonryWall.userData = murallaData;
  facadeGroup.add(rightMasonryWall);

  // Viga dintel superior corrida sobre toda la fachada frontal (z = -4.00m)
  const frontLintel = new THREE.Mesh(new THREE.BoxGeometry(9.89, 0.26, 0.34), mats.concretePBR);
  frontLintel.position.set(0, 2.42, -4.00);
  frontLintel.userData = murallaData;
  facadeGroup.add(frontLintel);

  // 1B-Bis. BAJADA DE LUZ ANDE (Pilastra + Caño de Acometida + Caja Medidor Trifásico) Y CAJA DEL MEDIDOR DE AGUA ESSAP A NIVEL DE CALLE
  //         Exactamente al costado del Portón Balancín, en la muralla más pequeña que da al vecino (-X: x = -3.85m, z = -4.05m)
  const serviceMetersGroup = new THREE.Group();

  // Caño vertical galvanizado de bajada de luz ANDE + pipeta curva superior
  const andeMast = new THREE.Mesh(
    new THREE.CylinderGeometry(0.028, 0.028, 2.65, 12),
    mats.stainlessMat
  );
  andeMast.position.set(-3.85, 2.55, -4.06);
  serviceMetersGroup.add(andeMast);

  const andeGooseneck = new THREE.Mesh(
    new THREE.TorusGeometry(0.09, 0.024, 10, 16, Math.PI),
    mats.stainlessMat
  );
  andeGooseneck.position.set(-3.85, 3.87, -4.15);
  andeGooseneck.rotation.y = Math.PI / 2;
  serviceMetersGroup.add(andeGooseneck);

  // Caja de Medidor Trifásico ANDE y Limitadora TM en la muralla pequeña junto al portón (x = -3.85m, y = 1.50m, z = -4.14m)
  const meterBox = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.44, 0.14), mats.blackMetalMat);
  meterBox.position.set(-3.85, 1.50, -4.14);
  serviceMetersGroup.add(meterBox);

  const meterWindow = new THREE.Mesh(
    new THREE.BoxGeometry(0.18, 0.14, 0.02),
    new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x0284c7, emissiveIntensity: 0.45, roughness: 0.2 })
  );
  meterWindow.position.set(-3.85, 1.58, -4.215);
  serviceMetersGroup.add(meterWindow);

  tagGroupUserData(serviceMetersGroup, {
    type: 'acometida_ande',
    bankCategory: 'existente_negro',
    name: 'Bajada de Luz ANDE (Caño de Acometida + Caja de Medidor al Costado del Portón en Muralla Pequeña • x = -3.85m)',
    dimensions: 'Pilastra/Muro Derecho (x = -3.85m, z = -4.06m) • Caño Galvanizado + Caja Medidor Trifásico ANDE a H=1.50m',
    costo: 'Acometida en Muralla Pequeña junto al Portón Balancín y Medianera Vecino (-X)',
    status: 'Ubicación Real Exacta al Costado del Portón ⚡',
    desc: 'Bajada de luz ANDE con caño de acometida aérea y gabinete de medidor embutido en el paño más pequeño de la muralla frontal (x = -3.85m, entre el portón vehicular balancín y el vecino -X).'
  });
  facadeGroup.add(serviceMetersGroup);

  // CAJA DEL MEDIDOR DE AGUA CORRIENTE ESSAP A NIVEL DE CALLE / VEREDA (Abajo de la bajada de luz, x = -3.85m, y = 0.06m, z = -4.22m)
  const essapMeterGroup = new THREE.Group();
  const essapBox = new THREE.Mesh(
    new THREE.BoxGeometry(0.42, 0.14, 0.30),
    mats.concreteFoundationPBR
  );
  essapBox.position.set(-3.85, 0.04, -4.24);
  essapMeterGroup.add(essapBox);

  const essapLid = new THREE.Mesh(
    new THREE.BoxGeometry(0.36, 0.03, 0.24),
    new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.4, metalness: 0.5 })
  );
  essapLid.position.set(-3.85, 0.12, -4.24);
  essapMeterGroup.add(essapLid);

  const essapPipeRiser = new THREE.Mesh(
    new THREE.CylinderGeometry(0.018, 0.018, 0.26, 10),
    new THREE.MeshStandardMaterial({ color: 0x0ea5e9, roughness: 0.3 })
  );
  essapPipeRiser.position.set(-3.85, 0.15, -4.12);
  essapMeterGroup.add(essapPipeRiser);

  tagGroupUserData(essapMeterGroup, {
    type: 'medidor_agua_essap',
    bankCategory: 'existente_negro',
    name: 'Caja del Medidor de Agua ESSAP a Nivel de Calle (Al Pie de la Muralla Pequeña junto al Portón • x = -3.85m)',
    dimensions: 'Caja de Vereda 0.40m × 0.30m (x = -3.85m, y = 0.05m, z = -4.24m) • Conexión Directa con Buena Presión (Sin Tanque)',
    costo: 'Gs. 0 en Tanque/Cisterna (Agua Corriente Directa ESSAP con Buena Presión en la Zona)',
    status: 'Conexión Directa ESSAP a Nivel de Calle (Ahorra Tanque y Presurizadora) 🚰💧',
    desc: 'Caja de medidor de agua corriente ESSAP ubicada a nivel de calle/vereda exactamente debajo de la bajada de luz en la muralla más pequeña junto al portón (x = -3.85m). Al contar la zona con buena presión de red, alimenta directamente el núcleo húmedo Eje F–G sin necesidad de tanque ni bomba presurizadora.'
  });
  facadeGroup.add(essapMeterGroup);

  // Portero Visor junto al Portoncito Peatonal (x = +1.05m)
  const intercom = new THREE.Mesh(new THREE.BoxGeometry(0.10, 0.16, 0.05), mats.stainlessMat);
  intercom.position.set(1.05, 1.42, -4.15);
  facadeGroup.add(intercom);

  const gateMat = mats.graphiteSheetGatePBR || mats.blackMetalMat;

  // 1C. PORTONCITO PEATONAL CIEGO EN CHAPA PLEGADA HORIZONTAL GRAFITO — LADO IZQUIERDO MIRANDO DESDE LA CALLE (+X: x = +1.25m a +2.20m, ancho 0.95m × alto 2.15m)
  const pedGateGroup = new THREE.Group();
  const pedW = 0.95;
  const pedH = 2.15;
  const pedX = 1.725;

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
  pedHandle.position.set(pedX - 0.34, 1.05, -4.05);
  pedGateGroup.add(pedHandle);

  tagGroupUserData(pedGateGroup, {
    type: 'fachada_exterior',
    bankCategory: 'existente_negro',
    name: 'Portoncito Peatonal Ciego en Chapa Plegada Horizontal Gris Grafito (Lado Izquierdo • 0.95m × 2.15m)',
    dimensions: '0.95m × 2.15m (x = +1.25m a +2.20m • Línea Municipal z = -4.00m)',
    costo: 'Gs. 0 (Puerta Peatonal Existente en Obra)',
    status: 'Ubicado en su Lado Real Izquierdo (+X) según Foto de Obra 🔒',
    desc: 'Portoncito peatonal ubicado a la izquierda mirando desde la calle (x = +1.25..+2.20m), haciendo juego con el portón vehicular en chapa plegada horizontal color gris grafito oscuro (#1f242b) con celosía superior.'
  });
  facadeGroup.add(pedGateGroup);

  // 1D. PORTÓN VEHICULAR BALANCÍN DE 2.30m EN CHAPA PLEGADA HORIZONTAL CIEGA — LADO DERECHO MIRANDO DESDE LA CALLE (-X: x = -3.50m a -1.20m)
  const gateGroup = new THREE.Group();
  const gateW = 2.30;
  const gateH = 2.15;
  const gateX = -2.35;

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
    name: 'Portón Vehicular Balancín Ciego en Chapa Plegada Horizontal Gris Grafito (Lado Derecho • 2.30m × 2.15m)',
    dimensions: 'Ancho 2.30m × Alto 2.15m (x = -3.50m a -1.20m • Lado Derecho mirando desde la calle)',
    costo: 'Gs. 0 (Portón Vehicular Existente en Obra — Color Negro en Carpeta Banco)',
    status: isUpgradedGate
      ? 'Ubicado en su Lado Real Derecho (-X) + Motor Automatizador ✨'
      : 'Portón Balancín Ciego YA EXISTENTE en su Lado Real Derecho (-X) 🔒',
    desc: 'Portón vehicular balancín de 2,30m ubicado a la derecha mirando desde la calle (x = -3.50..-1.20m, exactamente como en la foto real de fachada), en chapa plegada horizontal ciega gris grafito con celosía superior.'
  });
  facadeGroup.add(gateGroup);

  // 1D-Bis. Motor Automatizador para el Portón Basculante (x = -3.45m)
  if (scenarioKey !== 'hoy_en_obra') {
    const motorKitGroup = new THREE.Group();

    const driveRail = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.55, 0.08), mats.stainlessMat);
    driveRail.position.set(-3.45, 1.25, -3.91);
    motorKitGroup.add(driveRail);

    const motorHead = new THREE.Mesh(
      new THREE.BoxGeometry(0.22, 0.34, 0.20),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.35, metalness: 0.6 })
    );
    motorHead.position.set(-3.36, 1.62, -3.86);
    motorKitGroup.add(motorHead);

    const actuatorArm = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.58, 0.05), mats.chromeMat);
    actuatorArm.position.set(-3.43, 1.38, -3.95);
    actuatorArm.rotation.x = 0.22;
    motorKitGroup.add(actuatorArm);

    tagGroupUserData(motorKitGroup, {
      type: 'automatizacion_porton',
      bankCategory: 'nuevo_rojo',
      name: 'Motor Automatizador Rápido para Portón Balancín (2.30m) + Traba Eléctrica y Fotocélula',
      dimensions: 'Riel 1.55m + Motor Electromecánico JetFlex + Central + 2 Controles',
      costo: 'Gs. 2.450.000 (Kit Motor Portón Basculante Instalado)',
      status: 'Equipamiento Nuevo a Instalar sobre Portón Existente ⚡🚪',
      desc: 'Kit de motorización rápida acoplado al parante del portón vehicular de 2,30m.'
    });
    facadeGroup.add(motorKitGroup);
  }

  // 1E. PÉRGOLA DE MADERA DURA CON ENREDADERA VERDE TUPIDA + CHAPA TRANSLÚCIDA ANTIGRANIZO
  //     Visible en todos los escenarios habitables (300M, 350M y 440M)
  if (scenarioKey !== 'hoy_en_obra') {
    const pergolaGroup = new THREE.Group();
    const pMinX = -4.50;
    const pMaxX = 2.50;
    const pMinZ = -3.80;
    const pMaxZ = 2.80;
    const pW = pMaxX - pMinX; // 7.00m
    const pD = pMaxZ - pMinZ; // 6.60m
    const pCenterX = (pMinX + pMaxX) / 2; // -1.00m
    const pCenterZ = (pMinZ + pMaxZ) / 2; // -0.50m
    const pY = 2.55;

    const postCoords = [
      [pMinX + 0.12, -3.65],
      [pMaxX - 0.12, -3.65],
      [pMinX + 0.12, 1.35],
      [pMaxX - 0.12, 1.35]
    ];
    postCoords.forEach(([cx, cz]) => {
      const col = new THREE.Mesh(new THREE.BoxGeometry(0.14, pY, 0.14), mats.woodDoorPBR);
      col.position.set(cx, pY / 2, cz);
      col.castShadow = true;
      pergolaGroup.add(col);
    });

    [pMinX + 0.12, pCenterX, pMaxX - 0.12].forEach((bx) => {
      const mainBeam = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.18, pD), mats.woodDoorPBR);
      mainBeam.position.set(bx, pY + 0.04, pCenterZ);
      mainBeam.castShadow = true;
      pergolaGroup.add(mainBeam);
    });

    const numRafters = 14;
    for (let i = 0; i < numRafters; i++) {
      const rz = pMinZ + 0.20 + i * ((pD - 0.40) / (numRafters - 1));
      const rafter = new THREE.Mesh(new THREE.BoxGeometry(pW + 0.20, 0.11, 0.065), mats.woodDeckPBR);
      rafter.position.set(pCenterX, pY + 0.15, rz);
      rafter.castShadow = true;
      pergolaGroup.add(rafter);
    }

    const polyRoof = new THREE.Mesh(
      new THREE.BoxGeometry(pW + 0.24, 0.025, pD + 0.15),
      mats.polycarbonateRoofMat || mats.glassBlindexMat
    );
    polyRoof.position.set(pCenterX, pY + 0.22, pCenterZ);
    pergolaGroup.add(polyRoof);

    // Enredadera 3D Realista (Santa Rita / Bougainvillea):
    // Troncos leñosos helicoidales subiendo por los postes + guías sinuosas CatmullRomCurve3 entre cabios + hojas 3D anguladas + racimos de brácteas
    const barkMat = new THREE.MeshStandardMaterial({ color: 0x5c3a21, roughness: 0.92, metalness: 0.02 });
    const stemGreenMat = new THREE.MeshStandardMaterial({ color: 0x166534, roughness: 0.78, metalness: 0.04 });
    const leafDarkMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.68, metalness: 0.05, side: THREE.DoubleSide });
    const leafBrightMat = new THREE.MeshStandardMaterial({ color: 0x22c55e, roughness: 0.62, metalness: 0.05, side: THREE.DoubleSide });
    const bractMagentaMat = new THREE.MeshStandardMaterial({ color: 0xdb2777, roughness: 0.52, side: THREE.DoubleSide });
    const bractVioletMat = new THREE.MeshStandardMaterial({ color: 0x9d174d, roughness: 0.55, side: THREE.DoubleSide });

    // Geometría de hoja acuminada 3D (forma lanceolada/ovada natural, cero círculos planos)
    const leafShape = new THREE.Shape();
    leafShape.moveTo(0, 0);
    leafShape.quadraticCurveTo(0.045, 0.05, 0.028, 0.12);
    leafShape.lineTo(0, 0.165);
    leafShape.lineTo(-0.028, 0.12);
    leafShape.quadraticCurveTo(-0.045, 0.05, 0, 0);
    const leafGeo = new THREE.ShapeGeometry(leafShape, 4);
    const bractGeo = new THREE.ConeGeometry(0.048, 0.095, 3);

    const addLeafSprig = (pos, seed) => {
      const sprigCount = 3 + (seed % 3);
      for (let k = 0; k < sprigCount; k++) {
        const angleY = ((seed * 1.7 + k * 2.1) % (Math.PI * 2));
        const tiltX = 0.35 + ((seed + k) % 4) * 0.22;
        const leaf = new THREE.Mesh(leafGeo, (seed + k) % 2 === 0 ? leafDarkMat : leafBrightMat);
        leaf.position.set(
          pos.x + Math.cos(angleY) * 0.04,
          pos.y + ((k % 2 === 0) ? 0.02 : -0.015),
          pos.z + Math.sin(angleY) * 0.04
        );
        leaf.rotation.set(tiltX, angleY, ((seed + k) % 3 - 1) * 0.3);
        const s = 0.85 + ((seed + k) % 4) * 0.22;
        leaf.scale.set(s, s, s);
        pergolaGroup.add(leaf);
      }
      if (seed % 2 === 0) {
        const flowerGroup = new THREE.Group();
        flowerGroup.position.set(pos.x, pos.y + 0.03, pos.z);
        for (let b = 0; b < 3; b++) {
          const bract = new THREE.Mesh(bractGeo, (seed + b) % 2 === 0 ? bractMagentaMat : bractVioletMat);
          const ba = (b * Math.PI * 2) / 3 + (seed * 0.3);
          bract.position.set(Math.cos(ba) * 0.03, 0.01, Math.sin(ba) * 0.03);
          bract.rotation.set(0.65, ba, 0.3);
          flowerGroup.add(bract);
        }
        pergolaGroup.add(flowerGroup);
      }
    };

    // 1) Troncos trepadores helicoidales subiendo por los 4 postes principales de la pérgola
    postCoords.slice(0, 4).forEach(([px, pz], pIdx) => {
      const trunkPts = [];
      const turns = 2.5;
      const steps = 14;
      for (let s = 0; s <= steps; s++) {
        const t = s / steps;
        const ang = pIdx * 1.4 + t * Math.PI * 2 * turns;
        const rad = 0.095 + (1 - t) * 0.025;
        trunkPts.push(new THREE.Vector3(
          px + Math.cos(ang) * rad,
          0.04 + t * (pY + 0.14),
          pz + Math.sin(ang) * rad
        ));
      }
      const trunkCurve = new THREE.CatmullRomCurve3(trunkPts);
      const trunkMesh = new THREE.Mesh(
        new THREE.TubeGeometry(trunkCurve, 28, 0.028, 7, false),
        barkMat
      );
      trunkMesh.castShadow = true;
      pergolaGroup.add(trunkMesh);

      for (let s = 3; s <= steps; s += 2) {
        addLeafSprig(trunkPts[s], pIdx * 17 + s);
      }
    });

    // 2) Guías principales y secundarias serpenteando sobre los cabios de madera con caída natural (catenaria)
    const numRunners = 9;
    for (let r = 0; r < numRunners; r++) {
      const rxBase = pMinX + 0.45 + r * ((pW - 0.90) / (numRunners - 1));
      const runnerPts = [];
      const segs = 16;
      for (let s = 0; s <= segs; s++) {
        const tz = s / segs;
        const rz = pMinZ + 0.25 + tz * (pD - 0.50);
        const weaveX = Math.sin(tz * Math.PI * 4 + r * 1.3) * 0.28 + Math.cos(tz * Math.PI * 2 + r) * 0.12;
        const catenaryY = pY + 0.23 + Math.sin(tz * Math.PI * 7 + r * 0.7) * 0.045;
        runnerPts.push(new THREE.Vector3(rxBase + weaveX, catenaryY, rz));
      }
      const runnerCurve = new THREE.CatmullRomCurve3(runnerPts);
      const runnerMesh = new THREE.Mesh(
        new THREE.TubeGeometry(runnerCurve, 36, r % 3 === 0 ? 0.022 : 0.015, 6, false),
        r % 3 === 0 ? barkMat : stemGreenMat
      );
      runnerMesh.castShadow = true;
      pergolaGroup.add(runnerMesh);

      for (let s = 1; s < segs; s++) {
        const pt = runnerCurve.getPoint(s / segs);
        addLeafSprig(pt, r * 31 + s * 7);
      }
    }

    // 3) Ramas transversales entrelazadas y guirnaldas colgantes naturales en los bordes de la pérgola
    const crossRunners = 6;
    for (let c = 0; c < crossRunners; c++) {
      const rzBase = pMinZ + 0.55 + c * ((pD - 1.10) / (crossRunners - 1));
      const crossPts = [];
      const segs = 14;
      for (let s = 0; s <= segs; s++) {
        const tx = s / segs;
        const rx = pMinX + 0.35 + tx * (pW - 0.70);
        const weaveZ = Math.cos(tx * Math.PI * 3.5 + c * 1.5) * 0.26;
        const dropEdge = (s === 0 || s === segs) ? -0.32 : Math.sin(tx * Math.PI * 5 + c) * 0.04;
        crossPts.push(new THREE.Vector3(rx, pY + 0.22 + dropEdge, rzBase + weaveZ));
      }
      const crossCurve = new THREE.CatmullRomCurve3(crossPts);
      const crossMesh = new THREE.Mesh(
        new THREE.TubeGeometry(crossCurve, 30, 0.014, 6, false),
        stemGreenMat
      );
      pergolaGroup.add(crossMesh);

      for (let s = 0; s <= segs; s += 2) {
        const pt = crossCurve.getPoint(s / segs);
        addLeafSprig(pt, 200 + c * 23 + s * 5);
      }
    }

    tagGroupUserData(pergolaGroup, {
      type: 'pergola_cochera',
      bankCategory: 'nuevo_rojo',
      name: 'Pérgola de Madera Dura con Enredadera Natural 3D (Santa Rita) y Chapa Translúcida Antigranizo (Incluida desde BNF 350M)',
      dimensions: '7.00m × 6.60m (x = -4.50..+2.50m, z = -3.80..+2.80m, Y = +2.55..+2.75m)',
      costo: 'Gs. 7.850.000 (Prevista en Crédito BNF 350M y 440M)',
      status: 'Enredadera Botánica 3D + Protección Antigranizo para el Vehículo 🌿🚗',
      desc: 'Marco de madera dura con enredadera trepadora 3D (troncos helicoidales, guías entrelazadas, follaje lanceolado y flores de Santa Rita) más cubierta translúcida antigranizo sobre el estacionamiento.'
    });
    facadeGroup.add(pergolaGroup);
  }

  // 1F. Solado de Cochera y Caminero Peatonal (z = -4.00m a +1.50m) + SUV Chery Tiggo 2 Pro 2026 alineada con el portón de 2.30m (x = -2.35m)
  if (scenarioKey !== 'hoy_en_obra') {
    const walkwayMat = isFullExterior573 ? mats.porcelainPBR : mats.concretePBR;

    // Huella vehicular principal (alineada con el Portón Balancín en el lado derecho mirando desde la calle: x = -2.35m)
    const carTrack = new THREE.Mesh(new THREE.BoxGeometry(2.60, 0.04, 5.30), walkwayMat);
    carTrack.position.set(-2.35, 0.015, -1.25);
    carTrack.userData = {
      type: 'fachada_exterior',
      bankCategory: 'nuevo_rojo',
      name: 'Explanada Vehicular de Cochera Cubierta por Pérgola (Alineada con Portón Balancín en x = -2.35m)',
      dimensions: '51.90 m² (Entre Línea Municipal y Rejilla Peatonal de Foso de Oxigenación en z = +1.50m)',
      costo: isFullExterior573 ? 'Gs. 7.320.000 (Terminación Completa)' : 'Contrapiso Armado de Cochera',
      status: 'Cochera Operativa bajo Pérgola de Madera y Enredadera 🎯',
      desc: 'Superficie de estacionamiento vehicular a nivel de calle alineada con el portón balancín derecho (x = -2.35m).'
    };
    facadeGroup.add(carTrack);

    // Caminero peatonal desde el Portoncito Peatonal izquierdo (x = +1.725m) hacia la Puerta Principal (x = +0.85m) y la Puerta de Servicio (x = +4.35m)
    const pedWalk = new THREE.Mesh(new THREE.BoxGeometry(1.45, 0.04, 5.30), walkwayMat);
    pedWalk.position.set(1.55, 0.015, -1.25);
    facadeGroup.add(pedWalk);

    // Topes de rueda (Wheel Stops) en z = +0.65m antes del Foso de Oxigenación con Rejilla (z = +1.50m)
    [-2.90, -1.80].forEach((wx) => {
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

  // SUV Chery Tiggo 2 Pro 2026 estacionada bajo la pérgola (alineada con el Portón Balancín derecho x = -2.35m)
  facadeGroup.add(createCheryTiggo2Pro2026_3D(THREE, mats, -2.35, 0.03, -1.25, 0));

  targetGroup.add(facadeGroup);
}

/**
 * 2. ESCALERAS EN SU LADO REAL SEGÚN FOTOS DE OBRA (`media_1792502324664.jpg`) Y PLANOS:
 *    - ESCALERA 1 YA EXISTENTE EN OBRA (PB ↔ SUBSUELO): Lado Izquierdo mirando desde la calle (`+X`, Ejes 1–2: `x = +3.84m..+4.87m, z = 5.26m..8.80m`),
 *      vinculada directamente con la Puerta de Servicio Exterior (`x = +4.35m, z = 3.00m`) y con la Puerta Interior desde la casa (`x = +3.84m, z = 4.20m`).
 *    - ESCALERA 2 A CONSTRUIR (PB ↔ 2DO PISO): Del otro lado (`-X`, Ejes 8–9: `x = -4.87m..-3.84m, z = 5.26m..8.85m`),
 *      subiendo desde el área social hasta el Escritorio / Desk y el Pasillo Distribuidor del 2do Piso (+2.88m).
 */
export function buildExistingStaircase3D(THREE, structureGroup, fase2Group, mats, scenarioKey = 'escenario300') {
  const isFinished = ['escenario350', 'escenario370', 'escenario440', 'edifica460', 'edifica573'].includes(scenarioKey);

  // ==========================================================================
  // 2A. ESCALERA 1 DE H°A° YA EXISTENTE (PB Y=0.00m ↔ SUBSUELO Y=-2.34m) EN LADO +X (Ejes 1–2: x = +3.84m..+4.87m, z = 5.26m..8.80m)
  //     Acceso directo desde la Puerta de Servicio Exterior (z=3.00m) y desde la Puerta Interior de la casa (x=+3.84m, z=4.20m)
  // ==========================================================================
  const stairSubGroup = new THREE.Group();
  stairSubGroup.name = 'escalera_1_pb_subsuelo_existente';

  const stX1 = (3.84 + 4.87) / 2; // +4.355m (Lado Izquierdo mirando desde el frente, tal como en la foto de obra `media_1792502324664.jpg`)
  const stW1 = 1.00;
  const zStart1 = 5.26;
  const zEnd1 = 8.80;
  const runZ1 = zEnd1 - zStart1; // 3.54m
  const dropY1 = 2.34;
  const numSteps1 = 14;

  const waistLen1 = Math.hypot(runZ1, dropY1);
  const waistAngle1 = Math.atan2(dropY1, runZ1);
  const waistGeo1 = new THREE.BoxGeometry(stW1 - 0.04, 0.16, waistLen1);
  const waistMesh1 = new THREE.Mesh(waistGeo1, mats.concretePBR);
  waistMesh1.position.set(stX1, -dropY1 / 2 - 0.10, (zStart1 + zEnd1) / 2);
  waistMesh1.rotation.x = waistAngle1;
  stairSubGroup.add(waistMesh1);

  const landingGeo1 = new THREE.BoxGeometry(stW1 + 0.06, 0.18, 1.05);
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
      post.position.set(3.86, py, pz);
      railGroup1.add(post);
    });

    const handrailGeo1 = new THREE.CylinderGeometry(0.025, 0.025, waistLen1, 14);
    handrailGeo1.rotateX(Math.PI / 2 + waistAngle1);
    const handrail1 = new THREE.Mesh(handrailGeo1, mats.stainlessMat);
    handrail1.position.set(3.86, -dropY1 / 2 + 0.92, (zStart1 + zEnd1) / 2);
    railGroup1.add(handrail1);
    stairSubGroup.add(railGroup1);
  }

  tagGroupUserData(stairSubGroup, {
    type: 'structure',
    bankCategory: 'existente_negro',
    name: 'Escalera 1 de H°A° YA EXISTENTE (PB ↔ Subsuelo) con Acceso de Servicio Exterior e Interior (Ejes 1–2 • x = +3.84..+4.87m)',
    dimensions: 'Ancho 1.00m × Largo 3.54m • 14 Peldaños (De Y=0.00m a Y=-2.34m)',
    costo: isFinished ? 'Revestida en Lapacho + Baranda Inox' : 'Ejecutada en H°A° en Obra 🔒',
    status: 'Ubicada en su Lado Real (+X, Ejes 1–2) según Foto de Obra y Planos 🔒',
    desc: 'Escalera de hormigón armado ya construida en el lateral izquierdo mirando desde el frente (x = +3.84..+4.87m). Cuenta con doble acceso en su rellano superior: una puerta exterior de servicio desde la cochera (z=3.00m) y una puerta interior que comunica con el interior de la casa (x=+3.84m, z=4.20m).'
  });
  structureGroup.add(stairSubGroup);

  // ==========================================================================
  // 2B. ESCALERA 2 (PB Y=0.00m ↔ 2DO PISO Y=+2.88m) DEL OTRO LADO (-X, Ejes 8–9: x = -4.87m..-3.84m, z = 5.26m..8.85m)
  //     Desembarca directamente en el ESCRITORIO / DESK y en el PASILLO DISTRIBUIDOR del 2do Piso
  // ==========================================================================
  const stairPAGroup = new THREE.Group();
  stairPAGroup.name = 'escalera_2_pb_pa_opuesta';

  const stX2 = (-4.87 + -3.84) / 2; // -4.355m (Del otro lado respecto a la Escalera 1 de Subsuelo)
  const stW2 = 1.00;
  const zStart2 = 5.26;
  const zEnd2 = 8.85;
  const runZ2 = zEnd2 - zStart2; // 3.59m
  const risePA = 2.88;
  const stepsPA = 16;
  const waistLenPA = Math.hypot(runZ2, risePA);
  const waistAnglePA = -Math.atan2(risePA, runZ2);

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
      post.position.set(-3.86, py, pz);
      railPAGroup.add(post);
    });

    const handrailPAGeo = new THREE.CylinderGeometry(0.025, 0.025, waistLenPA, 14);
    handrailPAGeo.rotateX(Math.PI / 2 + waistAnglePA);
    const handrailPA = new THREE.Mesh(handrailPAGeo, mats.stainlessMat);
    handrailPA.position.set(-3.86, risePA / 2 + 0.92, (zStart2 + zEnd2) / 2);
    railPAGroup.add(handrailPA);
    stairPAGroup.add(railPAGroup);
  }

  tagGroupUserData(stairPAGroup, {
    type: 'structure_fase2',
    bankCategory: 'nuevo_rojo',
    name: 'Escalera 2 (PB ↔ 2do Piso) en el Costado Opuesto (Ejes 8–9 • x = -4.87m..-3.84m, z = 5.26m..8.85m)',
    dimensions: 'Ancho 1.00m × Largo 3.59m • 16 Peldaños de Lapacho (De Y=0.00m a +2.88m)',
    costo: 'Gs. 9.800.000 (Escalera 2 hacia Escritorio / Desk y Pasillo de Planta Alta)',
    status: 'Desembarco Directo en ESCRITORIO / DESK y PASILLO DISTRIBUIDOR de Planta Alta ✨',
    desc: 'Escalera 2 ubicada del otro lado del inmueble (x = -4.87..-3.84m, opuesta a la Escalera 1 del Subsuelo), subiendo desde la Planta Baja hasta el Escritorio / Desk y el Pasillo Distribuidor del 2do Piso (+2.88m).'
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

  const patioY = -2.34; // Patio posterior 100% nivelado a ras de suelo del Subsuelo (Y = -2.34m, sin desnivel)

  // 3A. Jardín con Césped Esmeralda Paraguayo (`grassPBR`, visible siempre desde `escenario300`)
  const lawnGroup = new THREE.Group();

  // Alfombra de Césped Esmeralda natural (9.50m × 13.00m) a ras del Subsuelo (Y = -2.34m)
  const grassLawn = new THREE.Mesh(
    new THREE.BoxGeometry(9.50, 0.06, 13.00),
    mats.grassPBR
  );
  grassLawn.position.set(0, patioY + 0.01, 19.90);
  grassLawn.receiveShadow = true;
  lawnGroup.add(grassLawn);

  // Caminero de losetas atérmicas sobre el césped al mismo nivel del Subsuelo (sin escalones de desnivel)
  for (let p = 0; p < 9; p++) {
    const paver = new THREE.Mesh(
      new THREE.BoxGeometry(0.95, 0.03, 0.55),
      mats.porcelainPBR
    );
    paver.position.set(0.45, patioY + 0.045, 13.80 + p * 0.95);
    lawnGroup.add(paver);
  }

  // Canteros perimetrales bajos con arbustos ornamentales (sin árboles altos)
  [-4.40, 4.40].forEach((px) => {
    [15.5, 18.5, 21.5, 24.5].forEach((pz) => {
      const shrub = new THREE.Mesh(
        new THREE.SphereGeometry(0.35, 12, 10),
        mats.grassPBR
      );
      shrub.scale.set(1, 0.65, 1.1);
      shrub.position.set(px, patioY + 0.24, pz);
      lawnGroup.add(shrub);
    });
  });

  tagGroupUserData(lawnGroup, {
    type: 'jardin_cesped',
    name: 'Patio Posterior 100% Nivelado a Ras del Subsuelo (Y = -2.34m • Sin Desnivel)',
    dimensions: '9.50m × 13.00m (123.5 m² nivelados a cota del Subsuelo Y = -2.34m)',
    costo: 'Gs. 4.850.000 (Nivelación + Empastado Grama Esmeralda)',
    status: 'Patio Nivelado a Ras de Subsuelo ✨',
    desc: 'El patio posterior no tiene desnivel: está 100% nivelado a la misma cota del suelo del Subsuelo (Y = -2.34m / Cota +97.66m), permitiendo salir caminando al mismo nivel hacia el jardín y la piscina.'
  });
  patioGroup.add(lawnGroup);

  // 3B. SISTEMA SANITARIO Y CLOACAL AUTÓNOMO EN EL PATIO POSTERIOR (Ejes 8–9: x = -3.25m, z = 14.55m..20.20m)
  if (scenarioKey !== 'hoy_en_obra') {
    const sewageSystemGroup = new THREE.Group();
    sewageSystemGroup.name = 'sistema_cloacal_patio_trasero';
    const sewX = -3.25;

    const pvcSewerMat = new THREE.MeshStandardMaterial({ color: 0xc2410c, roughness: 0.35, metalness: 0.10 });
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
    gtBody.position.set(sewX, patioY - 0.35, 14.55);
    greaseTrapGroup.add(gtBody);

    const gtLid = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.06, 0.72), mats.concretePBR);
    gtLid.position.set(sewX, patioY + 0.05, 14.55);
    greaseTrapGroup.add(gtLid);

    const gtHandle = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.03, 0.04), mats.blackMetalMat);
    gtHandle.position.set(sewX, patioY + 0.09, 14.55);
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
    septicShell.position.set(sewX, patioY - 0.65, 16.55);
    septicGroup.add(septicShell);

    const septicTopSlab = new THREE.Mesh(new THREE.BoxGeometry(1.26, 0.08, 1.66), mats.concretePBR);
    septicTopSlab.position.set(sewX, patioY + 0.05, 16.55);
    septicGroup.add(septicTopSlab);

    [-0.42, 0.42].forEach((sz) => {
      const manholeLid = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.05, 20), mats.blackMetalMat);
      manholeLid.position.set(sewX, patioY + 0.10, 16.55 + sz);
      septicGroup.add(manholeLid);
    });

    tagGroupUserData(septicGroup, {
      type: 'instalacion_cloacal',
      bankCategory: 'nuevo_rojo',
      name: 'Cámara Séptica Impermeable Bicameral de H°A° (1.60m × 1.20m • x = -3.25m, z = 16.55m)',
      dimensions: '1.60m × 1.20m × 1.40m prof. (Capacidad ~2.700 Litros • 2 Tapas Herméticas)',
      costo: 'Gs. 4.800.000 (Mampostería Armada Impermeabilizada con Sika-1 + Losa Tapa H°A°)',
      status: 'Tratamiento Cloacal Autónomo en Patio Trasero ♻️',
      desc: 'Cámara séptica bicameral en el patio trasero (x=-3.25m, z=16.55m) para evitar el uso de la precaria red vecinal.'
    });
    sewageSystemGroup.add(septicGroup);

    // 3) Pozo Ciego Absorbente Calzado en Ladrillo Tobatí (Ø 1.80m × 3.50m prof., x = -3.25m, z = 20.20m)
    const wellGroup = new THREE.Group();
    const wellCylinder = new THREE.Mesh(
      new THREE.CylinderGeometry(0.90, 0.85, 2.20, 24),
      mats.brickPBR
    );
    wellCylinder.position.set(sewX, patioY - 1.08, 20.20);
    wellGroup.add(wellCylinder);

    const wellCapSlab = new THREE.Mesh(
      new THREE.CylinderGeometry(0.96, 0.96, 0.10, 24),
      mats.concretePBR
    );
    wellCapSlab.position.set(sewX, patioY + 0.06, 20.20);
    wellGroup.add(wellCapSlab);

    const wellInspectionPlug = new THREE.Mesh(
      new THREE.CylinderGeometry(0.28, 0.28, 0.06, 20),
      mats.blackMetalMat
    );
    wellInspectionPlug.position.set(sewX, patioY + 0.12, 20.20);
    wellGroup.add(wellInspectionPlug);

    tagGroupUserData(wellGroup, {
      type: 'instalacion_cloacal',
      bankCategory: 'nuevo_rojo',
      name: 'Pozo Ciego Absorbente Calzado en Ladrillo Tobatí (Ø 1.80m × 3.50m prof. • x = -3.25m, z = 20.20m)',
      dimensions: 'Diámetro Ø 1.80m × 3.50m prof. • Retiro > 1.50m de Medianera y > 2.50m de Piscina',
      costo: 'Gs. 5.600.000 (Excavación + Calzado en Ladrillo + Tapa de H°A°)',
      status: 'Absorción Sanitaria Autónoma en Patio Trasero 🛠️',
      desc: 'Pozo absorbente calzado en ladrillo Tobatí con tapa de H°A° a ras del césped nivelado en x=-3.25m, z=20.20m.'
    });
    sewageSystemGroup.add(wellGroup);

    // 4) Cañería gravitatoria enterrada y Boca de Acople Rápido p/ Camión Cisterna
    const suctionAccessGroup = new THREE.Group();

    const gravityPipe = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 6.20, 14), pvcSewerMat);
    gravityPipe.rotation.x = Math.PI / 2;
    gravityPipe.position.set(sewX, patioY - 0.12, 17.35);
    sewageSystemGroup.add(gravityPipe);

    const suctionCoupling = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.09, 0.10, 16), mats.chromeMat);
    suctionCoupling.position.set(sewX, patioY + 0.16, 20.20);
    suctionAccessGroup.add(suctionCoupling);

    tagGroupUserData(suctionAccessGroup, {
      type: 'instalacion_cloacal',
      bankCategory: 'nuevo_rojo',
      name: 'Boca de Desagote Rápido Ø100mm p/ Camión Cisterna Atmosférico (Vía Puerta de Servicio y Escalera 1)',
      dimensions: 'Acople Rápido Ø 100mm (4") en Pozo Ciego + Ruta Directa ~27m por Escalera Lateral 1',
      costo: 'Gs. 0 en Motor Eléctrico (Ahorra Gs. 2.600.000 — El Camión Cisterna trae su propia bomba)',
      status: 'Desagote Limpio por Acceso de Servicio Lateral ✨🚛',
      desc: 'El camión cisterna ingresa la manguera directamente desde la calle por la Puerta de Servicio Exterior (x=+4.35m) y baja por la Escalera 1 al Subsuelo sin pisar el interior social de la casa.'
    });
    sewageSystemGroup.add(suctionAccessGroup);

    patioGroup.add(sewageSystemGroup);
  }

  // 3C. PISCINA EN EL FONDO CON SU ORIENTACIÓN ORIGINAL TRANSVERSAL (según Plano Oficial `instalacion_sanitaria_agua.png`)
  //     En los documentos originales (`PISCINA 6.40×1.90` / `5.80×2.40m`), la piscina está al fondo del patio (`z = 23.15m..25.55m`),
  //     orientada TRANSVERSALMENTE paralela a la muralla del fondo (`z = 26.80m`), desde `x = -1.25m` hasta `x = +4.55m`.
  const showPoolAndQuincho = forceShowPoolQuincho || ['escenario440', 'edifica460', 'edifica573'].includes(scenarioKey);
  const poolQuinchoSubGroup = new THREE.Group();
  poolQuinchoSubGroup.name = 'pool_and_quincho_sub';
  poolQuinchoSubGroup.visible = showPoolAndQuincho;

  const poolX = 1.65;   // Centrada entre x = -1.25m y x = +4.55m (libre del Pozo Ciego que está en x = -3.25m, z = 20.20m)
  const poolZ = 24.35;  // En el fondo del patio (z = 23.15m a 25.55m, a 1.25m de retiro de la muralla trasera z = 26.80m)
  const poolW = 5.80;   // Largo transversal en eje X (paralelo al muro de fondo, según plano sanitario original)
  const poolL = 2.40;   // Ancho en eje Z

  const poolGroup = new THREE.Group();

  const copingDeck = new THREE.Mesh(
    new THREE.BoxGeometry(poolW + 0.80, 0.08, poolL + 0.80),
    mats.ceramicSanitaryMat
  );
  copingDeck.position.set(poolX, patioY + 0.06, poolZ);
  poolGroup.add(copingDeck);

  const poolBasin = new THREE.Mesh(
    new THREE.BoxGeometry(poolW, 0.06, poolL),
    mats.poolTilePBR
  );
  poolBasin.position.set(poolX, patioY + 0.08, poolZ);
  poolGroup.add(poolBasin);

  // Escalones romanos de acceso en el extremo izquierdo (-X) de la piscina transversal
  for (let rs = 0; rs < 3; rs++) {
    const rStep = new THREE.Mesh(
      new THREE.BoxGeometry(0.34, 0.05, poolL - 0.16),
      mats.poolTilePBR
    );
    rStep.position.set(poolX - poolW / 2 + 0.22 + rs * 0.32, patioY + 0.10 - rs * 0.02, poolZ);
    poolGroup.add(rStep);
  }

  const waterSurface = new THREE.Mesh(
    new THREE.BoxGeometry(poolW - 0.06, 0.04, poolL - 0.06),
    mats.poolWaterMat
  );
  waterSurface.position.set(poolX, patioY + 0.115, poolZ);
  poolGroup.add(waterSurface);

  // Focos subacuáticos LED apuntando hacia el fondo (mirando desde la casa no encandilan)
  [-1.60, 0.0, 1.60].forEach((lx) => {
    const poolLight = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.08, 0.03, 16),
      mats.ledPoolCyanMat
    );
    poolLight.rotation.x = Math.PI / 2;
    poolLight.position.set(poolX + lx, patioY + 0.09, poolZ - poolL / 2 + 0.05);
    poolGroup.add(poolLight);
  });

  // Solárium / Deck de madera delante de la piscina (z = 21.15m..22.85m)
  const solariumDeck = new THREE.Mesh(
    new THREE.BoxGeometry(poolW + 0.80, 0.06, 1.75),
    mats.woodDeckPBR
  );
  solariumDeck.position.set(poolX, patioY + 0.05, poolZ - poolL / 2 - 1.32);
  poolGroup.add(solariumDeck);

  [-1.35, 0.0, 1.35].forEach((lx) => {
    const loungerBase = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.22, 1.55), mats.woodDeckPBR);
    loungerBase.position.set(poolX + lx, patioY + 0.18, poolZ - poolL / 2 - 1.32);
    poolGroup.add(loungerBase);

    const loungerPad = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.07, 1.48), mats.bedSheetMat);
    loungerPad.position.set(poolX + lx, patioY + 0.32, poolZ - poolL / 2 - 1.32);
    poolGroup.add(loungerPad);
  });

  tagGroupUserData(poolGroup, {
    type: 'piscina_planificada',
    bankCategory: 'nuevo_rojo',
    name: 'Piscina en el Fondo con Orientación Transversal Original (5.80m × 2.40m según Plano `instalacion_sanitaria_agua.png`)',
    dimensions: '5.80m × 2.40m (x = -1.25m..+4.55m, z = 23.15m..25.55m • Paralela a la Muralla de Fondo z = 26.80m)',
    costo: 'Gs. 34.500.000 (Incluida en Presupuesto Crédito BNF 440M)',
    status: 'Orientación Transversal en el Fondo según Documento Original ✨🏊',
    desc: 'Piscina ubicada al fondo del terreno con orientación transversal (largo en X paralelo a la muralla trasera, z = 23.15m..25.55m), respetando el diseño original de `instalacion_sanitaria_agua.png` y dejando libre el sector delantero del patio.'
  });
  poolQuinchoSubGroup.add(poolGroup);

  // 3D. PÉRGOLA / ESTAR DE JARDÍN EN EL LATERAL DERECHO DEL PATIO (`x = +2.85m`, `z = 17.20m`)
  const quinchoGroup = new THREE.Group();
  const qX = 2.85;
  const qZ = 17.20;
  const qW = 3.10;
  const qD = 3.80;
  const qH = 2.60;

  const qFloor = new THREE.Mesh(new THREE.BoxGeometry(qW, 0.08, qD), mats.woodDeckPBR);
  qFloor.position.set(qX, patioY + 0.05, qZ);
  quinchoGroup.add(qFloor);

  [[-qW / 2 + 0.15, -qD / 2 + 0.15], [qW / 2 - 0.15, -qD / 2 + 0.15], [-qW / 2 + 0.15, qD / 2 - 0.15], [qW / 2 - 0.15, qD / 2 - 0.15]].forEach(([cx, cz]) => {
    const col = new THREE.Mesh(new THREE.BoxGeometry(0.14, qH, 0.14), mats.blackMetalMat);
    col.position.set(qX + cx, patioY + qH / 2 + 0.06, qZ + cz);
    quinchoGroup.add(col);
  });

  const pergolaRing = new THREE.Mesh(new THREE.BoxGeometry(qW, 0.16, qD), mats.blackMetalMat);
  pergolaRing.position.set(qX, patioY + qH + 0.08, qZ);
  quinchoGroup.add(pergolaRing);

  for (let b = -3; b <= 3; b++) {
    const beam = new THREE.Mesh(new THREE.BoxGeometry(qW + 0.25, 0.12, 0.08), mats.woodDeckPBR);
    beam.position.set(qX, patioY + qH + 0.20, qZ + b * 0.48);
    quinchoGroup.add(beam);
  }

  const qTable = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.76, 2.00), mats.woodDeckPBR);
  qTable.position.set(qX, patioY + 0.44, qZ);
  quinchoGroup.add(qTable);

  tagGroupUserData(quinchoGroup, {
    type: 'quincho_jardin',
    bankCategory: 'nuevo_rojo',
    name: 'Pérgola / Solárium Cubierto de Jardín (Incluido en Crédito BNF 440M)',
    dimensions: '3.10m × 3.80m • Pérgola en Lapacho entre el Subsuelo y la Piscina del Fondo',
    costo: 'Gs. 16.800.000 (Previsto en Crédito BNF 440M)',
    status: 'Incluido en Crédito BNF 440M ✨',
    desc: 'Pérgola exterior en el jardín nivelado (Y = -2.34m) que vincula la Parrillita del Subsuelo con la Piscina transversal del fondo.'
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
  //     ¡IMPORTANTE!: Deja 100% ABIERTO el vano de la Escalera 1 hacia el Subsuelo en `x = +3.84m..+4.87m, z = 5.26m..8.80m`!
  const pbFloorMeta = {
    type: 'piso_terminado',
    name: isAtLeast350
      ? 'Piso Porcelanato Rectificado 60×60cm en Planta Social a Nivel de Calle + Zócalos'
      : 'Carpeta Hidrófuga Alisada + Cerámico en Cocina y Toilette (Base 300M)',
    dimensions: '9.54m × 6.84m (61.8 m² netos • Vano Escalera 1 abierto en x=+3.84..+4.87m, z=5.26..8.80m)',
    costo: isAtLeast350 ? 'Gs. 38.497.000 (Porcelanato 60×60 Completo)' : 'Gs. 14.200.000 (Base Habitable)',
    status: isAtLeast350 ? 'Porcelanato 60×60 Pulido Instalado ✨' : 'Habitable Etapa Inicial 🎯',
    desc: 'Solado interior a Nivel de Calle (Cota +100.00m) entre Eje G y Eje B con vano libre en Ejes 1–2 (x=+3.84..+4.87m, z=5.26..8.80m) para la Escalera 1 que baja al Subsuelo.'
  };

  // Paño principal del piso de Planta Baja desde x = -4.77m hasta el borde de la Escalera 1 en x = +3.84m (ancho 8.61m)
  const pbFloor = new THREE.Mesh(
    new THREE.BoxGeometry(3.84 - (-4.77), 0.03, 6.84),
    isAtLeast350 ? mats.porcelainPBR : mats.plasterRoughPBR
  );
  pbFloor.position.set((-4.77 + 3.84) / 2, 0.015, (3.00 + 9.94) / 2);
  pbFloor.receiveShadow = true;
  pbFloor.userData = pbFloorMeta;
  groups.archMain.add(pbFloor);

  // Rellano de ingreso de la Puerta de Servicio delante del arranque de la Escalera 1 (x = +3.84m..+4.77m, z = 3.05m..5.26m)
  const pbServiceLandingFloor = new THREE.Mesh(
    new THREE.BoxGeometry(4.77 - 3.84, 0.03, 5.26 - 3.05),
    isAtLeast350 ? mats.porcelainPBR : mats.plasterRoughPBR
  );
  pbServiceLandingFloor.position.set((3.84 + 4.77) / 2, 0.015, (3.05 + 5.26) / 2);
  pbServiceLandingFloor.receiveShadow = true;
  pbServiceLandingFloor.userData = pbFloorMeta;
  groups.archMain.add(pbServiceLandingFloor);

  // Paño posterior detrás de la Escalera 1 junto a Eje B (x = +3.84m..+4.77m, z = 8.80m..9.89m)
  const pbServiceRearFloor = new THREE.Mesh(
    new THREE.BoxGeometry(4.77 - 3.84, 0.03, 9.89 - 8.80),
    isAtLeast350 ? mats.porcelainPBR : mats.plasterRoughPBR
  );
  pbServiceRearFloor.position.set((3.84 + 4.77) / 2, 0.015, (8.80 + 9.89) / 2);
  pbServiceRearFloor.receiveShadow = true;
  pbServiceRearFloor.userData = pbFloorMeta;
  groups.archMain.add(pbServiceRearFloor);

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

  // 2) SISTEMA DE DOBLE PUERTA EN ACCESO DE SERVICIO AL SUBSUELO (Ejes 1–2: x = +3.84m..+4.87m, z = 3.00m..5.26m):
  //    - PUERTA EXTERIOR DE SERVICIO en x = +4.355m, z = 3.00m (acceso directo desde la cochera/calle hacia la Escalera 1 del Subsuelo)
  //    - PUERTA INTERIOR DE COMUNICACIÓN en x = +3.84m, z = 4.20m (permite salir desde adentro de la casa hacia el pasillo de servicio y la Escalera 1)
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
    'Puerta Exterior de Servicio — Acceso Directo a Escalera 1 del Subsuelo (x = +4.35m, Eje G)',
    {
      type: 'puerta_servicio',
      isServiceDoor: true,
      dimensionsExtra: '0.85×2.10m + Reja Exterior • Acceso Directo a Escalera 1 (PB ↔ Subsuelo)',
      costo: 'Gs. 2.350.000 (Puerta Exterior de Servicio Reforzada + Reja)',
      status: 'Puerta Exterior de Servicio Directa al Subsuelo ✨',
      desc: 'Puerta exterior en el costado izquierdo visto de frente (x=+4.35m, Eje G) que da acceso directo desde el exterior a la Escalera 1 hacia el Subsuelo.'
    }
  );
  groups.archMain.add(serviceDoor);

  // Tabique divisorio del Pasillo de Servicio en Eje 2 (x = +3.84m, z = 3.00m..5.26m) con la PUERTA INTERIOR hacia la casa
  addWallSegment(
    groups.archMain,
    3.84, 3.00, 3.84, 3.78,
    0.00, hPB, 0.15, intWallMat,
    'Mocheta Sur Pasillo de Servicio en Eje 2 (x = +3.84m, z = 3.00..3.78m)',
    'Separa el pasillo de acceso directo al Subsuelo respecto del Estar interior.'
  );
  addWallSegment(
    groups.archMain,
    3.84, 4.62, 3.84, 5.26,
    0.00, hPB, 0.15, intWallMat,
    'Mocheta Norte Pasillo de Servicio en Eje 2 (x = +3.84m, z = 4.62..5.26m)',
    'Cierra el pasillo de servicio junto al arranque de la Escalera 1 al Subsuelo.'
  );
  addWallSegment(
    groups.archMain,
    3.84, 3.78, 3.84, 4.62,
    2.12, 0.70, 0.15, intWallMat,
    'Dintel Puerta Interior de Servicio en Eje 2 (x = +3.84m)',
    'Dintel sobre la puerta interior que comunica el Estar con el acceso al Subsuelo.'
  );
  const serviceDoorInterior = createWoodenDoor3D(
    THREE,
    mats,
    3.84,
    0.00,
    4.20,
    0.82,
    2.10,
    Math.PI / 2,
    -0.55,
    'Puerta Interior de Acceso a Escalera 1 del Subsuelo y Salida de Servicio (x = +3.84m, z = 4.20m)',
    {
      type: 'puerta_servicio_interior',
      dimensionsExtra: '0.82×2.10m en Eje 2 • Conecta el Interior de la Casa con la Escalera al Subsuelo y la Puerta Exterior',
      costo: 'Gs. 1.450.000 (Puerta Placa Reforzada con Cerradura)',
      status: 'Doble Acceso (Exterior + Interior) al Subsuelo Activo ✨',
      desc: 'Permite pasar desde adentro de la casa hacia el pasillo de servicio para bajar al Subsuelo por la Escalera 1 o salir por la puerta exterior lateral.'
    }
  );
  groups.archMain.add(serviceDoorInterior);

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

  // Baranda interior de protección en PB junto al hueco de la Escalera 1 (+X: x = +3.84m, z = 5.26..8.80m)
  groups.archMain.add(
    createBalconyGrille3D(
      THREE, mats, 3.84, 5.26, 3.84, 8.80, 0.02, 0.96,
      'Baranda Interior de Seguridad sobre Hueco de Escalera 1 hacia Subsuelo (Eje 2 • x = +3.84m)'
    )
  );

  // Baranda de acompañamiento de la Escalera 2 (PB → 2do Piso en el otro lado -X: x = -3.84m, z = 5.26..8.85m)
  groups.archMain.add(
    createBalconyGrille3D(
      THREE, mats, -3.84, 5.26, -3.84, 8.85, 0.02, 0.96,
      'Baranda de Escalera 2 hacia 2do Piso (Lado -X • Ejes 8–9 • x = -3.84m)'
    )
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
  // F. SUBSUELO REAL DE 100,71 m² LIBRES COMO TODO UN SALÓN ABIERTO (Y = -2.34m):
  //    - Al costado de la Escalera 1 (+X: x=+1.84..+3.84m, z=5.26..7.80m) queda el encofrado existente de H°A° (donde iba a ir el lavadero y no se usará; queda integrado al salón)
  //    - Del otro lado (-X), contra la pared (Eje 9: x = -4.35m, z = 6.50m), se ubica el LAVADERO ABIERTO
  //    - PARRILLITA / QUINCHO INFERIOR HACIA EL PATIO (x = -4.50m..-2.00m, z = 12.20m..13.34m)
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
    'Muro Lateral Oeste Subsuelo (Eje 9 • x = -4.87m • Pared del Lavadero Reubicado)',
    'Cerramiento lateral del Subsuelo (del otro lado de la Escalera 1) contra el cual se ubica ahora el Lavadero.'
  );
  addWallSegment(
    groups.archSubsuelo,
    4.87, 3.00, 4.87, 13.34,
    ySub, hSub, 0.20, subWallMat,
    'Muro Lateral Este Subsuelo (Eje 1 • x = +4.87m • Junto a Escalera 1 y Encofrado Existente)',
    'Cerramiento lateral Este del Subsuelo donde desembarca la Escalera 1 existente.'
  );

  // F1. LAVADERO REUBICADO DEL OTRO LADO CONTRA LA PARED OESTE (Eje 9: x = -4.35m, z = 6.50m), dejando los 100,71 m² como TODO UN SALÓN ABIERTO
  groups.archSubsuelo.add(
    createLaundryModule3D(
      THREE,
      mats,
      -4.35,
      ySub + 0.03,
      6.50,
      Math.PI / 2,
      'Lavadero en Subsuelo Reubicado Contra la Pared Opuesta (Eje 9 • x = -4.35m, z = 6.50m — Todo el Subsuelo Queda como un Gran Salón)'
    )
  );

  // F2. PARRILLITA / QUINCHO INFERIOR EN SUBSUELO HACIA EL PATIO (x = -4.50m..-2.00m, z = 12.20m..13.34m, Y = -2.34m)
  // Nota: El Gran Salón del Subsuelo (100.71 m²) es un espacio semicubierto abierto hacia la Parrillita y el jardín (sin ventanal Blindex flotante en Eje B).
  groups.archSubsuelo.add(buildSubsueloParilla3D(THREE, mats, ySub, scenarioKey));

  // ============================================================================
  // G. 2DO PISO / PLANTA ALTA (Cota +102.88m / Y = +2.88m — ACTIVO DESDE EL DÍA 1):
  //    DORMITORIO EN SUITE DE RUTH Y LEO (Sommier 1.40m + 2 Mesas de Luz + Tocador #1 + Placares)
  //    + BAÑO COMPLETO EN SUITE
  //    + ESCRITORIO / DESK EXTENDIDO HASTA EL EXTREMO DE GALERÍA (Eje A z = 13.34m) PARA DAR LUGAR AL DESEMBARCO DE ESCALERA 2
  // ============================================================================
  // Agrupamos todo el 2do piso en `plantaAltaArchGroup` con `position.y = 2.88` para que el corte `'cut_pa'`
  // (`ch.position.y > 2.75`) oculte limpiamente el 2do piso cuando se inspecciona la Gran Sala de Nivel Calle.
  const plantaAltaArchGroup = new THREE.Group();
  plantaAltaArchGroup.position.set(0, 2.88, 0);
  groups.archMain.add(plantaAltaArchGroup);

  const localFloorY = 0.20; // Sobre la losa de viguetas pretensadas (2.88 + 0.20 = +3.08m)
  const hPA = 2.68;

  // G1. Solado Interior Cubierto de Planta Alta (z = 3.00m..9.94m) dejando 100% ABIERTO el vano de la Escalera 2 (x = -4.87m..-3.84m, z = 5.26m..8.85m)
  //     + Extensión Cubierta del Escritorio hasta Eje A (x = -4.87m..-1.80m, z = 9.94m..13.34m)
  //     + Deck 2 / Terraza al Río (x = -1.80m..+4.77m, z = 9.94m..13.34m)
  const paFloorMeta = {
    type: 'piso_terminado',
    name: isAtLeast350
      ? 'Piso Porcelanato Rectificado 60×60cm en Planta Alta — Suite, Vestidor, Dormitorio 2, Desembarco Escalera y 2 Baños (+102.88m)'
      : 'Solado Nivelado en Planta Alta + Cerámico Impermeable en Baño en Suite y SSHH 2 (Base 300M)',
    dimensions: '9.54m × 6.94m cubiertos (Vano Escalera 2 abierto en x=-4.87..-3.84m, z=5.26..8.85m • Cota +102.88m / Y=+2.88m)',
    status: isAtLeast350 ? 'Porcelanato 60×60 en Planta Alta ✨' : 'Planta Alta Habitable desde 300M 🎯',
    desc: 'Piso interior de Planta Alta según plano original: SSHH 2 + Baño en Suite + Vestidor sobre Eje F–G (z=3.00..4.85m), Dormitorio Principal en Suite (4.57×5.09m), Dormitorio 2 (2.95×3.94m) y desembarco de Escalera 2 hacia el Escritorio extendido.'
  };

  // Paño principal del piso de Planta Alta desde el borde de la Escalera 2 (x = -3.84m) hasta x = +4.77m (ancho 8.61m)
  const paFloorInterior = new THREE.Mesh(
    new THREE.BoxGeometry(4.77 - (-3.84), 0.03, 6.94),
    isAtLeast350 ? mats.porcelainPBR : mats.plasterRoughPBR
  );
  paFloorInterior.position.set((-3.84 + 4.77) / 2, localFloorY, 6.47);
  paFloorInterior.receiveShadow = true;
  paFloorInterior.userData = paFloorMeta;
  plantaAltaArchGroup.add(paFloorInterior);

  // Franja frontal del piso en x = -4.77m..-3.84m, z = 3.00m..5.26m (delante del vano de Escalera 2)
  const paFloorWestFront = new THREE.Mesh(
    new THREE.BoxGeometry(-3.84 - (-4.77), 0.03, 5.26 - 3.00),
    isAtLeast350 ? mats.porcelainPBR : mats.plasterRoughPBR
  );
  paFloorWestFront.position.set((-4.77 + -3.84) / 2, localFloorY, (3.00 + 5.26) / 2);
  paFloorWestFront.receiveShadow = true;
  paFloorWestFront.userData = paFloorMeta;
  plantaAltaArchGroup.add(paFloorWestFront);

  // Rellano de desembarco superior de la Escalera 2 en x = -4.77m..-3.84m, z = 8.85m..9.94m (conectado al Escritorio)
  const paFloorWestLanding = new THREE.Mesh(
    new THREE.BoxGeometry(-3.84 - (-4.77), 0.03, 9.94 - 8.85),
    isAtLeast350 ? mats.porcelainPBR : mats.plasterRoughPBR
  );
  paFloorWestLanding.position.set((-4.77 + -3.84) / 2, localFloorY, (8.85 + 9.94) / 2);
  paFloorWestLanding.receiveShadow = true;
  paFloorWestLanding.userData = paFloorMeta;
  plantaAltaArchGroup.add(paFloorWestLanding);

  // Extensión del solado interior del Escritorio / Desk sobre la sección de Galería hasta el extremo Eje A (x = -4.77m..-1.80m, z = 9.94m..13.34m)
  const paFloorEscritorioExt = new THREE.Mesh(
    new THREE.BoxGeometry(2.97, 0.03, 3.40),
    isAtLeast350 ? mats.porcelainPBR : mats.plasterRoughPBR
  );
  paFloorEscritorioExt.position.set(-3.285, localFloorY, 11.64);
  paFloorEscritorioExt.receiveShadow = true;
  paFloorEscritorioExt.userData = {
    type: 'piso_terminado',
    name: 'Solado Interior del Cuadrado de Escritorio / Desk Extendido hasta Extremo de Galería (Eje A z = 13.34m)',
    dimensions: '3.07m × 3.40m (x = -4.87m..-1.80m, z = 9.94m..13.34m • Total Escritorio + Desembarco = 3.07m × 7.34m)',
    status: isAtLeast350 ? 'Porcelanato 60×60 Interior en Escritorio Extendido ✨' : 'Escritorio Cubierto hasta Eje A 🎯',
    desc: 'Tal como prevé el diseño original en planos, la construcción del cuadrado de Escritorio (3.50×2.30m) se extiende hasta el extremo de la sección de galería (Eje A z = 13.34m) para dejar totalmente libre la subida y desembarco de la Escalera 2 (z = 5.26m..9.94m).'
  };
  plantaAltaArchGroup.add(paFloorEscritorioExt);

  // Deck 2 / Terraza al Río en la sección central-este de la galería (x = -1.80m..+4.77m, z = 9.94m..13.34m, 6.57m × 3.40m)
  const paDeck2Floor = new THREE.Mesh(
    new THREE.BoxGeometry(6.57, 0.03, 3.40),
    isAtLeast350 ? mats.woodDeckPBR : mats.plasterRoughPBR
  );
  paDeck2Floor.position.set(1.485, localFloorY - 0.01, 11.64);
  paDeck2Floor.receiveShadow = true;
  paDeck2Floor.userData = {
    type: 'piso_terminado',
    name: 'DECK 2 / TERRAZA MIRADOR AL RÍO EN PLANTA ALTA (x = -1.80m..+4.87m, z = 9.94m..13.34m • Ejes A–B)',
    dimensions: '6.67m × 3.40m (22.7 m² de Terraza Panorámica al Río Paraguay en Cota +102.88m)',
    status: isAtLeast350 ? 'Deck / Porcelanato Exterior Antideslizante ✨' : 'Terraza Mirador Impermeabilizada 🎯',
    desc: 'Deck 2 / Terraza Panorámica al Río Paraguay en Planta Alta (z = 9.94m a 13.34m), contigua al cuadrado extendido del Escritorio, con acceso directo desde el Dormitorio Principal en Suite, Dormitorio 2 y Escritorio.'
  };
  plantaAltaArchGroup.add(paDeck2Floor);

  // G2. Cerramientos Perimetrales y Fachada Frontal CIEGA con Ventiluces Altos sobre Eje G (z = 3.00m, SIN balcón frontal)
  // El Muro Medianero Oeste (Eje 9, x = -4.87m) se extiende desde Eje G (z = 3.00m) hasta el extremo de la galería Eje A (z = 13.34m) cerrando el Escritorio!
  addWallSegment(
    plantaAltaArchGroup,
    -4.87, 3.00, -4.87, 13.34,
    0.00, hPA, 0.20, extWallMat,
    'Muro Medianero Oeste Planta Alta Extendido hasta Galería (Eje 9 • z = 3.00m..13.34m)',
    'Cerramiento lateral Oeste continuo desde Eje G (z=3.00m) hasta el extremo de la galería en Eje A (z=13.34m), conformando el cuadrado del Escritorio luego de la subida de la Escalera 2.'
  );
  addWallSegment(
    plantaAltaArchGroup,
    4.87, 3.00, 4.87, 9.94,
    0.00, hPA, 0.20, extWallMat,
    'Muro Medianero Este Planta Alta (Eje 1 • z = 3.00m..9.94m)',
    'Cerramiento lateral Este de Planta Alta que protege el Vestidor y el Dormitorio Principal en Suite.'
  );

  // Fachada Frontal de Planta Alta sobre Eje G (z = 3.00m): Muro de mampostería revocada con ventiluces altos horizontales (SIN balcón frontal ni Blindex de piso a techo)
  addWallSegment(
    plantaAltaArchGroup,
    -4.87, 3.00, 4.87, 3.00,
    0.00, 1.90, 0.20, extWallMat,
    'Muro Frontal de Mampostería Revocada en Planta Alta (Eje G • z = 3.00m — Sin Balcón Frontal)',
    'Muro frontal sólido sobre la Línea de Edificación (Eje G z = 3.00m) que resguarda la privacidad de SSHH 2, Baño en Suite y Vestidor hacia la calle.'
  );
  addWallSegment(
    plantaAltaArchGroup,
    -4.87, 3.00, 4.87, 3.00,
    2.38, Math.max(0.22, hPA - 2.38), 0.20, extWallMat,
    'Dintel Superior Fachada Frontal Planta Alta (Eje G • z = 3.00m)',
    'Viga dintel superior sobre la faja de ventiluces altos de los núcleos húmedos y vestidor en Eje G.'
  );
  // Mochetas entre ventiluces altos en Eje G (z = 3.00m)
  addWallSegment(plantaAltaArchGroup, -4.87, 3.00, -3.55, 3.00, 1.90, 0.48, 0.20, extWallMat, 'Mocheta Frontal Oeste Eje G', 'Mocheta sobre el cajón de Escalera 2 en Eje G.');
  addWallSegment(plantaAltaArchGroup, -1.95, 3.00, -1.15, 3.00, 1.90, 0.48, 0.20, extWallMat, 'Mocheta Frontal Central-Oeste Eje G', 'Mocheta entre SSHH 2 y Baño en Suite.');
  addWallSegment(plantaAltaArchGroup, 0.45, 3.00, 2.75, 3.00, 1.90, 0.48, 0.20, extWallMat, 'Mocheta Frontal Central-Este Eje G', 'Muro ciego entre Baño en Suite y Vestidor.');
  addWallSegment(plantaAltaArchGroup, 4.35, 3.00, 4.87, 3.00, 1.90, 0.48, 0.20, extWallMat, 'Mocheta Frontal Este Eje G', 'Mocheta lateral Este en fachada frontal PA.');

  // 3 Ventiluces Altos Horizontales (Clerestory Windows) sobre Eje G (z = 3.00m) para SSHH 2, Baño en Suite y Vestidor
  plantaAltaArchGroup.add(
    createBlindexWindow3D(
      THREE, mats, -2.75, 2.14, 3.00, 1.60, 0.46, 0,
      'Ventiluz Alto Horizontal — SSHH 2 / Baño de Planta Alta (Fachada Eje G z = 3.00m)',
      'Ventiluz superior horizontal en fachada frontal Eje G para el segundo baño de Planta Alta (SSHH 2).'
    )
  );
  plantaAltaArchGroup.add(
    createBlindexWindow3D(
      THREE, mats, -0.35, 2.14, 3.00, 1.60, 0.46, 0,
      'Ventiluz Alto Horizontal — Baño en Suite (Fachada Eje G z = 3.00m)',
      'Ventiluz superior horizontal de ventilación cruzada e iluminación natural del Baño en Suite sobre Eje G.'
    )
  );
  plantaAltaArchGroup.add(
    createBlindexWindow3D(
      THREE, mats, 3.55, 2.14, 3.00, 1.60, 0.46, 0,
      'Ventiluz Alto Horizontal — Vestidor en Suite (Fachada Eje G z = 3.00m)',
      'Ventiluz superior tipo balancín en aluminio negro y vidrio traslúcido sobre Eje G para iluminación cenital del Vestidor.'
    )
  );

  // G3. DISTRIBUCIÓN INTERIOR COMPLETA Y CERRADA DE PLANTA ALTA (2do Piso +102.88m):
  //     1) Al subir la Escalera 2 (en Ejes 8-9, x = -4.87m..-3.84m, z = 5.26m..8.85m), se llega al desembarco (z = 8.85m..9.94m),
  //        al cuadrado del ESCRITORIO / DESK extendido hasta el extremo de la galería (x = -4.87m..-1.80m, z = 9.94m..13.34m),
  //        y al PASILLO DISTRIBUIDOR (z = 4.85m..6.00m, x = -3.84m..+0.30m).
  //     2) Franja Frontal Húmeda y de Guardado sobre Eje F–G (z = 3.00m..4.85m, 100% cerrada sin huecos muertos):
  //        * SSHH 2 / Baño de Planta Alta (x = -3.84m..-1.65m, z = 3.00m..4.85m — 2.19m × 1.85m): Puerta desde el Pasillo Distribuidor.
  //        * BAÑO EN SUITE PRIVADO (x = -1.65m..+1.15m, z = 3.00m..4.85m — 2.80m × 1.85m): 100% cerrado hacia el pasillo, con puerta privada exclusiva desde adentro del Dormitorio en Suite (en z = 4.85m, x = +0.72m)!
  //        * VESTIDOR EN SUITE INDEPENDIENTE (x = +1.15m..+4.87m, z = 3.00m..4.85m — 3.72m × 1.85m): 100% cerrado y continuo al lado del Baño en Suite, con doble hilera de placares y puerta privada hacia el Dormitorio en Suite (en z = 4.85m, x = +2.85m)!
  //     3) DORMITORIO 2 AMPLIO (x = -1.80m..+0.30m, z = 6.00m..9.94m — 2.10m × 3.94m): Cama de 1 Plaza, Tocador #2 con espejo, Placar y ventanal Blindex a Deck 2.
  //     4) DORMITORIO PRINCIPAL EN SUITE ARMADO Y COMPLETO (x = +0.30m..+4.87m, z = 4.85m..9.94m — 4.57m × 5.09m = 23,26 m² + Baño en Suite + Vestidor = 33,6 m² totales de Suite!):
  //        Con Sommier de 1,40m, 2 Mesas de Luz con veladores, Tocador #1 con espejo adosado al muro, acceso directo interno a su Baño en Suite y a su Vestidor, y gran ventanal Blindex a la Terraza / Deck 2.
  addWallSegment(
    plantaAltaArchGroup,
    -3.84, 3.00, -3.84, 4.85,
    0.00, hPA, 0.15, intWallMat,
    'Muro Oeste de SSHH 2 junto a Escalera 2 (x = -3.84m, z = 3.00..4.85m)',
    'Separa el baño SSHH 2 del rellano frontal de la Escalera 2 (PB -> PA).'
  );
  addWallSegment(
    plantaAltaArchGroup,
    -1.65, 3.00, -1.65, 4.85,
    0.00, hPA, 0.15, intWallMat,
    'Tabique Divisorio SSHH 2 / Baño Principal en Suite (x = -1.65m, z = 3.00..4.85m)',
    'Divide el baño general de Planta Alta (SSHH 2) respecto del Baño Principal en Suite sobre el núcleo húmedo frontal Eje F–G.'
  );
  addWallSegment(
    plantaAltaArchGroup,
    1.50, 3.00, 1.50, 4.85,
    0.00, hPA, 0.15, intWallMat,
    'Tabique Divisorio Baño en Suite / Vestidor en Suite (x = +1.50m, z = 3.00..4.85m)',
    'Divide el Baño Principal en Suite (x=-1.65..+1.50m) respecto del Vestidor en Suite (x=+1.50..+4.87m), sin dejar ningún hueco muerto.'
  );

  // Pared continua en z = 4.85m desde x = -3.84m hasta x = +4.87m que cierra SSHH 2 (hacia el Pasillo) y cierra Baño en Suite + Vestidor (hacia el Dormitorio en Suite)
  addWallSegment(
    plantaAltaArchGroup,
    -3.84, 4.85, -3.15, 4.85,
    0.00, hPA, 0.15, intWallMat,
    'Muro Sur Pasillo Distribuidor — Mocheta Oeste Puerta SSHH 2 (z = 4.85m)',
    'Mocheta izquierda de la puerta del baño SSHH 2 sobre el Pasillo Distribuidor.'
  );
  addWallSegment(
    plantaAltaArchGroup,
    -2.35, 4.85, 0.65, 4.85,
    0.00, hPA, 0.15, intWallMat,
    'Muro Sur Pasillo Distribuidor — Cierre Continuo de SSHH 2 y Baño en Suite (z = 4.85m, x = -2.35..+0.65m)',
    'Pared continua que delimita el Pasillo Distribuidor y garantiza privacidad total al Baño en Suite.'
  );
  addWallSegment(
    plantaAltaArchGroup,
    0.65, 4.85, 0.74, 4.85,
    0.00, hPA, 0.15, intWallMat,
    'Mocheta Oeste Puerta Privada Baño en Suite (z = 4.85m)',
    'Mocheta de la puerta privada que conecta el Dormitorio en Suite con su Baño en Suite.'
  );
  addWallSegment(
    plantaAltaArchGroup,
    1.50, 4.85, 2.45, 4.85,
    0.00, hPA, 0.15, intWallMat,
    'Muro Interior Suite — Entre Puerta de Baño en Suite y Puerta de Vestidor (z = 4.85m, x = +1.50..+2.45m)',
    'Cierra el frente del Baño en Suite y del Vestidor dentro del Dormitorio Principal en Suite.'
  );
  addWallSegment(
    plantaAltaArchGroup,
    3.25, 4.85, 4.87, 4.85,
    0.00, hPA, 0.15, intWallMat,
    'Muro Interior Suite — Cierre Este de Vestidor hacia el Dormitorio en Suite (z = 4.85m, x = +3.25..+4.87m)',
    'Cierra el Vestidor independiente dentro del Dormitorio Principal en Suite.'
  );
  // Dinteles sobre las puertas de SSHH 2, Baño en Suite y Vestidor en z = 4.85m
  addWallSegment(plantaAltaArchGroup, -3.15, 4.85, -2.35, 4.85, 2.12, Math.max(0.20, hPA - 2.12), 0.15, intWallMat, 'Dintel Puerta SSHH 2 (z = 4.85m)', 'Dintel sobre puerta de SSHH 2.');
  addWallSegment(plantaAltaArchGroup, 0.74, 4.85, 1.50, 4.85, 2.12, Math.max(0.20, hPA - 2.12), 0.15, intWallMat, 'Dintel Puerta Baño en Suite (z = 4.85m)', 'Dintel sobre puerta privada del Baño en Suite.');
  addWallSegment(plantaAltaArchGroup, 2.45, 4.85, 3.25, 4.85, 2.12, Math.max(0.20, hPA - 2.12), 0.15, intWallMat, 'Dintel Puerta Vestidor en Suite (z = 4.85m)', 'Dintel sobre puerta del Vestidor en Suite.');

  // Muro Norte del PASILLO DISTRIBUIDOR (z = 6.00m) y acceso limpio a DORMITORIO 1 SENCILLO (x = -1.80m..+0.65m, z = 6.00m..9.94m)
  addWallSegment(
    plantaAltaArchGroup,
    -1.80, 6.00, -1.05, 6.00,
    0.00, hPA, 0.15, intWallMat,
    'Muro Norte Pasillo Distribuidor — Cierre Oeste Dormitorio 1 Sencillo (z = 6.00m)',
    'Separa el Dormitorio 1 Sencillo del Pasillo Distribuidor de Planta Alta.'
  );
  addWallSegment(
    plantaAltaArchGroup,
    -0.21, 6.00, 0.65, 6.00,
    0.00, hPA, 0.15, intWallMat,
    'Muro Norte Pasillo Distribuidor — Cierre Este Dormitorio 1 Sencillo (z = 6.00m)',
    'Mocheta de puerta del Dormitorio 1 Sencillo en esquina con el acceso a la Suite Principal.'
  );
  addWallSegment(
    plantaAltaArchGroup,
    -1.05, 6.00, -0.21, 6.00,
    2.12, Math.max(0.20, hPA - 2.12), 0.15, intWallMat,
    'Dintel Puerta Dormitorio 1 Sencillo (z = 6.00m)',
    'Dintel sobre puerta de acceso al Dormitorio 1 Sencillo.'
  );

  // Tabique / Muro Este del ESCRITORIO / DESK (x = -1.80m) extendido desde z = 6.00m hasta el extremo de la galería Eje A (z = 13.34m), con puerta lateral de salida hacia Deck 2 (z = 10.15m..10.95m)
  addWallSegment(
    plantaAltaArchGroup,
    -1.80, 6.00, -1.80, 10.15,
    0.00, hPA, 0.15, intWallMat,
    'Tabique Divisorio Escritorio-Desk / Dormitorio 1 Sencillo (x = -1.80m, z = 6.00..10.15m)',
    'Separa el desembarco de la Escalera 2 y el Escritorio respecto del Dormitorio 1 Sencillo.'
  );
  addWallSegment(
    plantaAltaArchGroup,
    -1.80, 10.95, -1.80, 13.34,
    0.00, hPA, 0.20, extWallMat,
    'Muro Lateral Este del Cuadrado de Escritorio sobre Galería (x = -1.80m, z = 10.95..13.34m)',
    'Cierra lateralmente el cuadrado del Escritorio extendido hasta el extremo de la galería (Eje A z=13.34m), separándolo del Deck 2 / Terraza al Río.'
  );
  addWallSegment(
    plantaAltaArchGroup,
    -1.80, 10.15, -1.80, 10.95,
    2.12, Math.max(0.20, hPA - 2.12), 0.20, extWallMat,
    'Dintel Puerta Lateral Escritorio -> Deck 2 (x = -1.80m)',
    'Dintel superior sobre la puerta de salida del Escritorio hacia la terraza Deck 2.'
  );

  // Tabique Divisorio entre DORMITORIO 1 SENCILLO + PASILLO (Oeste) y DORMITORIO 2 PRINCIPAL EN SUITE (x = +0.65m..+4.87m, Este)
  addWallSegment(
    plantaAltaArchGroup,
    0.65, 4.85, 0.65, 5.02,
    0.00, hPA, 0.15, intWallMat,
    'Mocheta Sur Puerta Suite Principal (x = +0.65m)',
    'Arranque del tabique de entrada al Dormitorio Principal en Suite al final del Pasillo Distribuidor.'
  );
  addWallSegment(
    plantaAltaArchGroup,
    0.65, 5.88, 0.65, 9.94,
    0.00, hPA, 0.15, intWallMat,
    'Tabique Divisorio Dormitorio 1 Sencillo / Dormitorio 2 Principal en Suite (x = +0.65m, z = 5.88..9.94m)',
    'Divide el Dormitorio 1 Sencillo central (x=-1.80..+0.65m) respecto del Dormitorio 2 Principal en Suite (x=+0.65..+4.87m).'
  );
  addWallSegment(
    plantaAltaArchGroup,
    0.65, 5.02, 0.65, 5.88,
    2.12, Math.max(0.20, hPA - 2.12), 0.15, intWallMat,
    'Dintel Puerta Dormitorio Principal en Suite (x = +0.65m)',
    'Dintel sobre la puerta principal de entrada a la Suite.'
  );

  // Baranda de Protección Interna de la Escalera 2 en Planta Alta (x = -3.84m, z = 5.26m..8.85m + frente z = 5.26m)
  plantaAltaArchGroup.add(
    createBalconyGrille3D(
      THREE, mats, -3.84, 5.26, -3.84, 8.85, 0.05, 0.98,
      'Baranda de Seguridad del Hueco de Escalera 2 en Planta Alta (x = -3.84m, z = 5.26..8.85m)'
    )
  );
  plantaAltaArchGroup.add(
    createBalconyGrille3D(
      THREE, mats, -4.82, 5.26, -3.84, 5.26, 0.05, 0.98,
      'Baranda Cierre Frontal del Hueco de Escalera 2 en Planta Alta (z = 5.26m, x = -4.82..-3.84m)'
    )
  );

  // 6 Puertas en Planta Alta (5 interiores + 1 puerta lateral desde el Escritorio extendido hacia Deck 2)
  plantaAltaArchGroup.add(
    createWoodenDoor3D(
      THREE, mats, -2.75, localFloorY, 4.85, 0.80, 2.10, 0, -0.55,
      'Puerta de Madera Hidrófuga — SSHH 2 / Baño de Planta Alta (desde Pasillo Distribuidor z = 4.85m)'
    )
  );
  plantaAltaArchGroup.add(
    createWoodenDoor3D(
      THREE, mats, -0.63, localFloorY, 6.00, 0.84, 2.10, 0, 0.60,
      'Puerta Placa de Madera — Acceso a Dormitorio 1 Sencillo (desde Pasillo Distribuidor z = 6.00m)'
    )
  );
  plantaAltaArchGroup.add(
    createWoodenDoor3D(
      THREE, mats, 0.65, localFloorY, 5.45, 0.86, 2.10, -Math.PI / 2, 0.65,
      'Puerta Principal de Madera — Acceso a Dormitorio 2 Principal en Suite (al final del Pasillo Distribuidor x = +0.65m)'
    )
  );
  plantaAltaArchGroup.add(
    createWoodenDoor3D(
      THREE, mats, 1.12, localFloorY, 4.85, 0.76, 2.10, 0, -0.65,
      'Puerta Privada de Madera Hidrófuga — Acceso Directo desde Dormitorio en Suite al Baño en Suite (z = 4.85m, x = +1.12m)'
    )
  );
  plantaAltaArchGroup.add(
    createWoodenDoor3D(
      THREE, mats, 2.85, localFloorY, 4.85, 0.80, 2.10, 0, -0.75,
      'Puerta Placa de Madera — Acceso Directo desde Dormitorio en Suite al Vestidor Independiente (z = 4.85m, x = +2.85m)'
    )
  );
  plantaAltaArchGroup.add(
    createWoodenDoor3D(
      THREE, mats, -1.80, localFloorY, 10.55, 0.80, 2.10, -Math.PI / 2, 0.50,
      'Puerta Lateral de Salida — Escritorio / Desk hacia Deck 2 / Terraza al Río (x = -1.80m, z = 10.55m)'
    )
  );

  // Cerramiento Vidriado del ESCRITORIO / DESK en el extremo Norte de la sección de Galería (Eje A z = 13.30m) + Muro y Ventanales de Dormitorio 1 Sencillo y Suite en Eje B (z = 9.94m)
  addWallSegment(
    plantaAltaArchGroup,
    -4.87, 13.30, -1.80, 13.30,
    2.32, Math.max(0.20, hPA - 2.32), 0.20, extWallMat,
    'Dintel Superior Ventanal Escritorio sobre Eje A (z = 13.30m)',
    'Cierre superior sobre el ventanal panorámico del Escritorio en el extremo de la galería.'
  );
  plantaAltaArchGroup.add(
    createBlindexWindow3D(
      THREE, mats, -3.33, 1.25, 13.30, 2.85, 2.30, 0,
      'Ventanal Panorámico Blindex — Extremo Norte del Escritorio / Desk sobre Eje A (z = 13.34m)',
      'Cerramiento vidriado frontal del cuadrado de Escritorio extendido hasta el extremo de la galería (Eje A z=13.34m), dejando libre el Eje B (z=9.94m) para la subida y desembarco de la Escalera 2.'
    )
  );

  // Cierre en Eje B (z = 9.94m) para Dormitorio 1 Sencillo (x = -1.80..+0.65m) y Dormitorio 2 Principal en Suite (x = +0.65..+4.87m) con mochetas y dinteles reales
  addWallSegment(
    plantaAltaArchGroup,
    -1.80, 9.94, 4.87, 9.94,
    2.32, Math.max(0.20, hPA - 2.32), 0.20, extWallMat,
    'Dintel Corrido sobre Ventanales de Dormitorio 1 Sencillo y Suite hacia Terraza (Eje B z = 9.94m)',
    'Viga dintel superior sobre los ventanales Blindex que dan al Deck 2 / Terraza al Río.'
  );
  addWallSegment(
    plantaAltaArchGroup,
    0.42, 9.94, 0.88, 9.94,
    0.00, 2.32, 0.20, extWallMat,
    'Mocheta Central Eje B entre Dormitorio 1 Sencillo y Suite Principal (z = 9.94m)',
    'Pilar/mocheta de mampostería que separa el ventanal del Dormitorio 1 Sencillo respecto del ventanal de la Suite Principal.'
  );
  addWallSegment(
    plantaAltaArchGroup,
    4.45, 9.94, 4.87, 9.94,
    0.00, 2.32, 0.20, extWallMat,
    'Mocheta Este Eje B en Suite Principal (z = 9.94m)',
    'Cierre lateral Este del ventanal de la Suite Principal.'
  );
  plantaAltaArchGroup.add(
    createBlindexWindow3D(
      THREE, mats, -0.68, 1.25, 9.94, 2.15, 2.30, 0,
      'Puerta-Ventana Corrediza Blindex — Dormitorio 1 Sencillo hacia Deck 2 / Terraza al Río (Eje B z = 9.94m)',
      'Ventanal corredizo de piso a dintel en el Dormitorio 1 Sencillo con vista y salida a la terraza mirador Norte.'
    )
  );
  plantaAltaArchGroup.add(
    createBlindexWindow3D(
      THREE, mats, 2.66, 1.25, 9.94, 3.55, 2.30, 0,
      'Gran Ventanal Corredizo Blindex — Dormitorio 2 Principal en Suite hacia Deck 2 / Terraza al Río (Eje B z = 9.94m)',
      'Puerta-ventana corrediza Blindex 10mm del Dormitorio Principal en Suite con salida directa a la Terraza Panorámica.'
    )
  );

  // Barandas Perimetrales de Seguridad en DECK 2 / TERRAZA MIRADOR AL RÍO (x = -1.80m..+4.82m, z = 9.94m..13.30m)
  plantaAltaArchGroup.add(
    createBalconyGrille3D(
      THREE, mats, -1.80, 13.30, 4.82, 13.30, 0.18, 1.08,
      'Baranda y Reja de Seguridad en Deck 2 / Terraza Mirador al Río (Eje A z = 13.34m, x = -1.80..+4.82m)'
    )
  );
  plantaAltaArchGroup.add(
    createBalconyGrille3D(
      THREE, mats, 4.82, 9.94, 4.82, 13.30, 0.18, 1.08,
      'Baranda Lateral Este Deck 2 / Terraza Mirador (z = 9.94m..13.30m)'
    )
  );

  // G4. Equipamiento de SSHH 2 (x = -3.84..-1.65m, z = 3.00..4.85m), BAÑO EN SUITE (x = -1.65..+1.50m, z = 3.00..4.85m) y VESTIDOR (x = +1.50..+4.87m, z = 3.00..4.85m)
  // SSHH 2 / Segundo Baño Completo de Planta Alta (sobre Eje F–G, acceso desde Pasillo Distribuidor)
  plantaAltaArchGroup.add(createToilet3D(THREE, mats, -3.30, localFloorY + 0.02, 3.42, 0, 'SSHH 2 / Baño de Planta Alta (Eje F–G)'));
  plantaAltaArchGroup.add(createVanity3D(THREE, mats, -2.55, localFloorY + 0.02, 3.48, 0.85, 0, 'SSHH 2 / Baño de Planta Alta (Eje F–G)'));
  plantaAltaArchGroup.add(createShowerBox3D(THREE, mats, -2.10, localFloorY + 0.02, 4.25, 0.85, 1.05, 0, 'SSHH 2 / Baño de Planta Alta (Eje F–G)'));

  // Baño Principal en Suite (x = -1.65..+1.50m, z = 3.00..4.85m, apilado sobre el núcleo húmedo de PB y con acceso privado desde la Suite)
  plantaAltaArchGroup.add(createToilet3D(THREE, mats, -0.35, localFloorY + 0.02, 3.42, 0, 'Baño Principal en Suite (Eje F–G)'));
  plantaAltaArchGroup.add(createBidet3D(THREE, mats, 0.25, localFloorY + 0.02, 3.42, 0, 'Baño Principal en Suite (Eje F–G)'));
  plantaAltaArchGroup.add(createVanity3D(THREE, mats, 1.05, localFloorY + 0.02, 3.85, 0.82, -Math.PI / 2, 'Baño Principal en Suite (Eje F–G)'));
  plantaAltaArchGroup.add(createShowerBox3D(THREE, mats, -1.10, localFloorY + 0.02, 3.92, 0.95, 1.65, 0, 'Baño Principal en Suite (Eje F–G)'));

  // G5. DORMITORIO 2 — PRINCIPAL EN SUITE CON ACCESO DIRECTO AL VESTIDOR Y BAÑO EN SUITE (x = +0.65..+4.87m, z = 4.85..9.94m):
  //     1 Sommier de 1,40m con respaldo sobre Muro Este + Alfombra + 2 Mesas de Luz con veladores + Tocador #1 con Espejo adosado al tabique Oeste (x = +0.65m)
  const suiteOwnFurnitureGroup = new THREE.Group();

  // Alfombra textil cálida bajo la cama en Suite
  const suiteRug = new THREE.Mesh(
    new THREE.BoxGeometry(2.40, 0.014, 2.30),
    new THREE.MeshStandardMaterial({ color: 0xd6d3d1, roughness: 0.92 })
  );
  suiteRug.position.set(3.45, localFloorY + 0.02, 7.45);
  suiteOwnFurnitureGroup.add(suiteRug);

  // Caminero de conexión visual desde la Suite hacia la puerta del Vestidor (x = +2.85m, z = 4.85m)
  const vestidorRunner = new THREE.Mesh(
    new THREE.BoxGeometry(0.90, 0.012, 1.65),
    new THREE.MeshStandardMaterial({ color: 0xfde68a, roughness: 0.85 })
  );
  vestidorRunner.position.set(2.85, localFloorY + 0.022, 4.95);
  suiteOwnFurnitureGroup.add(vestidorRunner);

  const headboard = new THREE.Mesh(new THREE.BoxGeometry(0.10, 1.15, 2.20), mats.woodDeckPBR);
  headboard.position.set(4.72, localFloorY + 0.58, 7.45);
  suiteOwnFurnitureGroup.add(headboard);

  const sommierBase = new THREE.Mesh(new THREE.BoxGeometry(1.90, 0.28, 1.40), mats.linenSofaMat);
  sommierBase.position.set(3.75, localFloorY + 0.15, 7.45);
  suiteOwnFurnitureGroup.add(sommierBase);

  const sommierMattress = new THREE.Mesh(new THREE.BoxGeometry(1.90, 0.24, 1.40), mats.bedSheetMat);
  sommierMattress.position.set(3.75, localFloorY + 0.40, 7.45);
  suiteOwnFurnitureGroup.add(sommierMattress);

  const duvet = new THREE.Mesh(new THREE.BoxGeometry(1.30, 0.25, 1.42), mats.bedDuvetMat);
  duvet.position.set(3.44, localFloorY + 0.41, 7.45);
  suiteOwnFurnitureGroup.add(duvet);

  [-0.34, 0.34].forEach((pz) => {
    const pillow = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.12, 0.52), mats.bedSheetMat);
    pillow.position.set(4.42, localFloorY + 0.56, 7.45 + pz);
    suiteOwnFurnitureGroup.add(pillow);
  });

  // 2 Mesas de Luz (0.45m × 0.40m × 0.52m c/u, Propias — Gs. 0)
  [-0.96, 0.96].forEach((nz) => {
    const nightStand = new THREE.Mesh(new THREE.BoxGeometry(0.40, 0.52, 0.45), mats.woodDoorPBR);
    nightStand.position.set(4.52, localFloorY + 0.26, 7.45 + nz);
    suiteOwnFurnitureGroup.add(nightStand);

    const lamp = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.11, 0.22, 14), mats.ledWarmMat);
    lamp.position.set(4.52, localFloorY + 0.63, 7.45 + nz);
    suiteOwnFurnitureGroup.add(lamp);
  });

  // Tocador de Dormitorio #1 con Espejo y Cajones perfectamente adosado contra el tabique Oeste de la Suite (x = +0.65m, z = 7.45m) + Banqueta
  const dresser1Base = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.76, 1.05), mats.woodDoorPBR);
  dresser1Base.position.set(0.94, localFloorY + 0.38, 7.45);
  suiteOwnFurnitureGroup.add(dresser1Base);

  const dresser1MirrorFrame = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.82, 0.85), mats.woodDeckPBR);
  dresser1MirrorFrame.position.set(0.74, localFloorY + 1.18, 7.45);
  suiteOwnFurnitureGroup.add(dresser1MirrorFrame);

  const dresser1Mirror = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.74, 0.77), mats.mirrorMat);
  dresser1Mirror.position.set(0.75, localFloorY + 1.18, 7.45);
  suiteOwnFurnitureGroup.add(dresser1Mirror);

  const dresserStool = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.44, 16), mats.linenSofaMat);
  dresserStool.position.set(1.36, localFloorY + 0.22, 7.45);
  suiteOwnFurnitureGroup.add(dresserStool);

  tagGroupUserData(suiteOwnFurnitureGroup, {
    type: 'mobiliario_propio',
    name: 'Dormitorio 2 — Principal en Suite con Acceso al Vestidor y Baño en Suite (4.22m × 5.09m): Sommier 1,40m + 2 Mesas de Luz + Tocador #1',
    dimensions: 'Suite 21,48 m² + Vestidor 6,27 m² + Baño en Suite 5,83 m² (Total Suite = 33,6 m² en Planta Alta)',
    costo: 'Gs. 0 (Mobiliario Propio de Ruth y Leo — A trasladar)',
    status: 'Dormitorio en Suite 100% Armado con Acceso Directo al Vestidor y Baño 📦✨',
    desc: 'Dormitorio Principal en Suite de Ruth y Leo (x=+0.65..+4.87m, z=4.85..9.94m) completamente cerrado y armado con su Sommier de 1,40m, 2 mesas de luz, tocador con espejo sobre el muro oeste, puerta directa al Vestidor independiente en U (x=+1.50..+4.87m) y puerta privada al Baño en Suite (x=-1.65..+1.50m).'
  });
  plantaAltaArchGroup.add(suiteOwnFurnitureGroup);

  // G6. ESCRITORIO / DESK EXTENDIDO HASTA EL EXTREMO DE LA GALERÍA (x = -4.87m..-1.80m, z = 9.94m..13.34m):
  //     2 Escritorios de Ruth y Leo + 2 Sillas de oficina + Máquina de coser antigua + Biblioteca #2
  //     (Dejando z = 6.00m..10.20m 100% libre para el desembarco de la Escalera 2 y circulación!)
  const homeOfficePAGroup = new THREE.Group();

  [-3.65, -2.50].forEach((dxOffset) => {
    const deskTop = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.035, 0.52), mats.woodDeckPBR);
    deskTop.position.set(dxOffset, localFloorY + 0.75, 12.35);
    homeOfficePAGroup.add(deskTop);

    [[-0.42, -0.22], [0.42, -0.22], [-0.42, 0.22], [0.42, 0.22]].forEach(([lx, lz]) => {
      const dLeg = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.73, 0.04), mats.blackMetalMat);
      dLeg.position.set(dxOffset + lx, localFloorY + 0.37, 12.35 + lz);
      homeOfficePAGroup.add(dLeg);
    });

    const laptop = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.22, 0.02), mats.blackMetalMat);
    laptop.position.set(dxOffset, localFloorY + 0.88, 12.45);
    homeOfficePAGroup.add(laptop);
  });

  // 2 Sillas Ergonómicas de Oficina en el cuadrado extendido del Escritorio / Desk (x = -3.65m y -2.50m, z = 11.78m)
  [-3.65, -2.50].forEach((chairX) => {
    const chairZ = 11.78;
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
    name: 'Escritorio / Desk Extendido hasta Extremo de Galería (3.07m × 3.40m en z = 9.94..13.34m): 2 Escritorios de Ruth y Leo + 2 Sillas Ergonómicas',
    dimensions: 'Cuadrado Escritorio Extendido (x=-4.87..-1.80m, z=9.94..13.34m) • 2 Escritorios 0.95×0.52m',
    costo: '2 Escritorios + 1 Silla Gs. 0 (Propios) • 2da Silla Ergonómica: Gs. 850.000',
    status: 'Escritorio / Home-Office Doble Extendido hasta Eje A 📦✨',
    desc: 'El cuadrado del Escritorio / Desk se extiende hasta el extremo de la sección de galería (Eje A z=13.34m), dejando totalmente libre la llegada de la Escalera 2 en Eje B (z=8.85..9.94m) y ofreciendo vista panorámica en primera línea hacia el Río Paraguay.'
  });
  plantaAltaArchGroup.add(homeOfficePAGroup);

  // Máquina de Coser Antigua en el cuadrado extendido del Escritorio / Desk (x = -4.48m, z = 11.15m, contra muro Oeste Eje 9)
  const antiqueSewingGroup = new THREE.Group();
  const asmX = -4.48;
  const asmZ = 11.15;

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
    name: 'Máquina de Coser Antigua Completa en Escritorio Extendido de Planta Alta (x = -4.48m, z = 11.15m)',
    dimensions: '0.78m × 0.46m × 1.05m • Pedestal de Hierro Fundido + Gabinete y Cabezal Antiguo',
    costo: 'Gs. 0 (Propio de Ruth y Leo — A trasladar)',
    status: 'Propio del Propietario en Escritorio PA (Gs. 0 — A trasladar) 📦',
    desc: 'Máquina de coser antigua clásica con pedestal de hierro forjado, pedal, gabinete de madera y cabezal original ubicada sobre el muro Oeste del Escritorio extendido.'
  });
  plantaAltaArchGroup.add(antiqueSewingGroup);

  // G7. DORMITORIO 1 — SENCILLO (en x = -1.80m..+0.65m, z = 6.00m..9.94m — 2.45m × 3.94m = 9.65 m²):
  //     Cama Sencilla / 1½ Plaza (1.05m × 1.95m, Propia — Gs. 0) posicionada al centro con cubrecama terracota cálido,
  //     alfombra tejida, mesa de luz con velador LED, y Tocador #2 con espejo adosado al tabique Este (x = +0.65m)
  const secondRoomOwnFurniture = new THREE.Group();
  const sbX = -0.62;
  const sbZ = 8.15;

  // Alfombra cálida en Dormitorio 1 Sencillo para delimitar claramente el ambiente en 3D
  const singleRoomRug = new THREE.Mesh(
    new THREE.BoxGeometry(1.85, 0.014, 2.35),
    new THREE.MeshStandardMaterial({ color: 0xfef3c7, roughness: 0.90 })
  );
  singleRoomRug.position.set(sbX, localFloorY + 0.02, sbZ);
  secondRoomOwnFurniture.add(singleRoomRug);

  const singleHeadboard = new THREE.Mesh(new THREE.BoxGeometry(1.10, 1.05, 0.09), mats.woodDeckPBR);
  singleHeadboard.position.set(sbX, localFloorY + 0.52, sbZ - 0.96);
  secondRoomOwnFurniture.add(singleHeadboard);

  const singleBedFrame = new THREE.Mesh(new THREE.BoxGeometry(1.06, 0.28, 1.95), mats.woodDeckPBR);
  singleBedFrame.position.set(sbX, localFloorY + 0.15, sbZ);
  secondRoomOwnFurniture.add(singleBedFrame);

  const singleMattress = new THREE.Mesh(new THREE.BoxGeometry(1.02, 0.22, 1.92), mats.bedSheetMat);
  singleMattress.position.set(sbX, localFloorY + 0.36, sbZ);
  secondRoomOwnFurniture.add(singleMattress);

  const singleDuvetMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.78 });
  const singleDuvet = new THREE.Mesh(new THREE.BoxGeometry(1.04, 0.23, 1.32), singleDuvetMat);
  singleDuvet.position.set(sbX, localFloorY + 0.37, sbZ + 0.28);
  secondRoomOwnFurniture.add(singleDuvet);

  [-0.24, 0.24].forEach((pxOff) => {
    const singlePillow = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.11, 0.32), mats.bedSheetMat);
    singlePillow.position.set(sbX + pxOff, localFloorY + 0.51, sbZ - 0.70);
    secondRoomOwnFurniture.add(singlePillow);
  });

  // Mesa de luz + lámpara cálida en Dormitorio 1 Sencillo
  const singleNightStand = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.52, 0.42), mats.woodDoorPBR);
  singleNightStand.position.set(sbX - 0.78, localFloorY + 0.26, sbZ - 0.72);
  secondRoomOwnFurniture.add(singleNightStand);

  const singleLamp = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.11, 0.22, 14), mats.ledWarmMat);
  singleLamp.position.set(sbX - 0.78, localFloorY + 0.63, sbZ - 0.72);
  secondRoomOwnFurniture.add(singleLamp);

  // Tocador de Dormitorio #2 con Espejo sobre el tabique Este (x = +0.65m) sin obstaculizar la cama
  const dresser2Base = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.76, 0.88), mats.woodDoorPBR);
  dresser2Base.position.set(0.38, localFloorY + 0.38, 7.95);
  secondRoomOwnFurniture.add(dresser2Base);

  const dresser2Mirror = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.70, 0.68), mats.mirrorMat);
  dresser2Mirror.position.set(0.55, localFloorY + 1.12, 7.95);
  secondRoomOwnFurniture.add(dresser2Mirror);

  tagGroupUserData(secondRoomOwnFurniture, {
    type: 'mobiliario_propio',
    name: 'Dormitorio 1 — Sencillo en Planta Alta (2.45m × 3.94m = 9,65 m²): Cama 1½ Plaza (1.05×1.95m) + Mesa de Luz + Tocador #2 + Placar',
    dimensions: 'Dormitorio 1 Sencillo (x=-1.80..+0.65m, z=6.00..9.94m) • Cama 1.05×1.95m + Tocador #2 0.88×0.38m',
    costo: 'Gs. 0 (Propio de Ruth y Leo — A trasladar)',
    status: 'Dormitorio 1 Sencillo 100% Armado y Visible en Planta Alta 📦✨',
    desc: 'Dormitorio Sencillo independiente de Planta Alta ubicado en el sector central (entre el Escritorio al Oeste y el Dormitorio en Suite al Este), con acceso desde el Pasillo Distribuidor, salida al Deck 2 / Terraza al Río y baño SSHH 2 contiguo.'
  });
  plantaAltaArchGroup.add(secondRoomOwnFurniture);

  // G8. EQUIPAMIENTO DE VESTIDOR EN SUITE (x = +1.50..+4.87m, z = 3.00..4.85m — 3.37m × 1.85m) Y PLACAR DE DORMITORIO 1 SENCILLO:
  //     Visible desde 300M (estructura de vestidor) y terminado en melamina texturada desde 350M
  const budgetedClosetsGroup = new THREE.Group();

  // Placar Este del Vestidor en Suite (contra muro Eje 1 x = +4.87m)
  const closetVestidorEast = new THREE.Mesh(new THREE.BoxGeometry(0.55, 2.35, 1.72), mats.woodDoorPBR);
  closetVestidorEast.position.set(4.50, localFloorY + 1.18, 3.92);
  budgetedClosetsGroup.add(closetVestidorEast);

  // Placar Oeste del Vestidor en Suite (contra tabique de Baño en Suite x = +1.50m)
  const closetVestidorWest = new THREE.Mesh(new THREE.BoxGeometry(0.55, 2.35, 1.72), mats.woodDoorPBR);
  closetVestidorWest.position.set(1.85, localFloorY + 1.18, 3.92);
  budgetedClosetsGroup.add(closetVestidorWest);

  // Placar Fondo Sur del Vestidor bajo el ventiluz alto (z = 3.32m)
  const closetVestidorSouth = new THREE.Mesh(new THREE.BoxGeometry(1.95, 1.80, 0.50), mats.woodDoorPBR);
  closetVestidorSouth.position.set(3.18, localFloorY + 0.92, 3.32);
  budgetedClosetsGroup.add(closetVestidorSouth);

  // Placar de Dormitorio 1 Sencillo (adosado al rincón Sur-Oeste x = -1.42m, z = 6.32m para dejar 100% despejada la visual de la cama)
  const closetSecond = new THREE.Mesh(new THREE.BoxGeometry(0.68, 2.25, 0.52), mats.woodDoorPBR);
  closetSecond.position.set(-1.38, localFloorY + 1.13, 6.34);
  budgetedClosetsGroup.add(closetSecond);

  if (isAtLeast440) {
    const acSplit = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.28, 0.92), mats.ceramicSanitaryMat);
    acSplit.position.set(4.65, localFloorY + 2.18, 7.45);
    budgetedClosetsGroup.add(acSplit);
  }

  tagGroupUserData(budgetedClosetsGroup, {
    type: 'adicional_a_presupuestar',
    name: 'Vestidor en Suite Completo en U (3.37m × 1.85m c/ Acceso desde Suite) + Placar Empotrado en Dormitorio 1 Sencillo',
    dimensions: 'Vestidor en U sobre Eje F–G (x=+1.50..+4.87m, z=3.00..4.85m) + Placar Dormitorio 1 Sencillo',
    costo: 'Gs. 9.600.000 (Vestidor en Suite + Placar Dormitorio 1 Sencillo)',
    status: isAtLeast350 ? 'Vestidor y Placares Terminados ✨' : 'Espacio de Vestidor Cerrado y Armado 🎯',
    desc: 'Vestidor independiente en U integrado dentro del Dormitorio Principal en Suite con tres frentes de guardado y puerta directa, más placar en el Dormitorio 1 Sencillo.'
  });
  plantaAltaArchGroup.add(budgetedClosetsGroup);

  // Etiquetas Flotantes 3D de Identificación de Ambientes en Planta Alta (2 Dormitorios + Vestidor + Escritorio)
  const makeZoneBadgeSprite = (title, sub, borderHex, posX, posY, posZ) => {
    const c = document.createElement('canvas');
    c.width = 512;
    c.height = 128;
    const cx = c.getContext('2d');
    cx.fillStyle = 'rgba(15, 23, 42, 0.88)';
    cx.strokeStyle = borderHex;
    cx.lineWidth = 6;
    cx.beginPath();
    if (cx.roundRect) {
      cx.roundRect(8, 8, 496, 112, 20);
    } else {
      cx.rect(8, 8, 496, 112);
    }
    cx.fill();
    cx.stroke();
    cx.fillStyle = '#f8fafc';
    cx.font = 'bold 28px Inter, Arial, sans-serif';
    cx.textAlign = 'center';
    cx.fillText(title, 256, 54);
    cx.fillStyle = borderHex;
    cx.font = 'bold 21px Inter, Arial, sans-serif';
    cx.fillText(sub, 256, 94);
    const tex = new THREE.CanvasTexture(c);
    const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false });
    const sp = new THREE.Sprite(mat);
    sp.scale.set(2.35, 0.58, 1);
    sp.position.set(posX, posY, posZ);
    sp.renderOrder = 999;
    return sp;
  };

  plantaAltaArchGroup.add(
    makeZoneBadgeSprite('🛏️ DORMITORIO 1 (SENCILLO)', 'Cama 1½ Plaza + Placar • 9,65 m²', '#fbbf24', -0.58, localFloorY + 2.32, 8.15)
  );
  plantaAltaArchGroup.add(
    makeZoneBadgeSprite('👑 DORMITORIO 2 (EN SUITE)', 'Sommier 1.40m + Acceso a Vestidor • 21,5 m²', '#c084fc', 2.85, localFloorY + 2.32, 7.45)
  );
  plantaAltaArchGroup.add(
    makeZoneBadgeSprite('👗 VESTIDOR EN SUITE', 'Placares en U • Acceso desde Suite', '#38bdf8', 3.18, localFloorY + 2.18, 3.92)
  );
  plantaAltaArchGroup.add(
    makeZoneBadgeSprite('💻 SECTOR ESCRITORIO', 'Home-Office Doble + Costura + Biblioteca', '#34d399', -3.33, localFloorY + 2.32, 11.45)
  );

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
  // 2) Biblioteca #2 de 4 estantes de 2,00m cada uno en el Escritorio / Desk Extendido de Planta Alta (sobre tabique x = -1.98m, z = 8.45m)
  plantaAltaArchGroup.add(
    createLibrary4Shelves2m3D(THREE, mats, -1.98, localFloorY, 8.45, -Math.PI / 2, 'Escritorio / Desk Planta Alta (Tabique x=-1.80m)')
  );

  // 2) Las Mascotas de Ruth y Leo: Emma (Caniche) y Serafina (Gata Calicó) en el Estar / Living Social
  groups.archMain.add(createEmmaPoodle3D(THREE, mats, 0.72, 0.03, 5.15, 0.45));
  groups.archMain.add(createSerafinaCalicoCat3D(THREE, mats, 2.55, 0.03, 6.45, -0.65));

  // 3) Floreros / Macetas Chicas con Plantas "Espada de San Jorge" (Sansevieria trifasciata) en distintos puntos de la casa
  groups.archMain.add(createSansevieriaPot3D(THREE, mats, 0.12, 0.64, 3.42, 0.72, 'Mesa Cuadrada de Florero y Libros'));
  groups.archMain.add(createSansevieriaPot3D(THREE, mats, 1.75, 0.44, 5.45, 0.68, 'Mesa Ratona de Sala'));
  groups.archMain.add(createSansevieriaPot3D(THREE, mats, 1.65, 0.03, 3.35, 1.05, 'Recibidor Puerta Principal'));
  groups.archMain.add(createSansevieriaPot3D(THREE, mats, -1.85, -0.42, 10.45, 1.15, 'Galería Panorámica al Río'));
  plantaAltaArchGroup.add(createSansevieriaPot3D(THREE, mats, 0.59, localFloorY + 0.76, 7.45, 0.70, 'Tocador Dormitorio Suite PA'));
  plantaAltaArchGroup.add(createSansevieriaPot3D(THREE, mats, -2.75, localFloorY + 0.76, 12.35, 0.68, 'Escritorio / Desk Extendido PA'));

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


