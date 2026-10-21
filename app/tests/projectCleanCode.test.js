import test from 'node:test';
import assert from 'node:assert/strict';

import {
  PREVISION_CREDITO_NUEVO,
  CREDITO_BNF,
  PRESUPUESTO_PARTIDAS,
  DUCTOS_PASES_ENCHUFES_DATOS,
  ESCENARIOS_INVERSION,
  ITEMS_CREDITO_300M,
  ITEMS_CREDITO_350M,
  ITEMS_CREDITO_440M,
  CATALOGO_PRODUCTOS_SUGERIDOS_PARAGUAY,
  GALLERY_ZONES_DATA,
  ARCHITECTURAL_ROOMS
} from '../src/data/projectData.js';

import {
  ITEM_STATUS,
  USER_ROLES_CATALOG,
  buildMetricCalculationBreakdown,
  computeCommercialProductBreakdownForPartida,
  filterMetricRows,
  cycleRoofStyle,
  normalizePluvialSimulationMode,
  isAnyMepSimulationActive,
  getRoleWorkspaceConfig,
  getRoleBillOfMaterials,
  generateRoleWorkOrderCsv,
  createCustomBudgetItem,
  applyItemCustomization,
  applyCustomOverridesToItems,
  serializeProjectState,
  deserializeProjectState,
  serializeProjectCustomState,
  deserializeProjectCustomState
} from '../src/domain/budgetAndSceneService.js';

import { exportProjectWorkbookXLSX } from '../src/xlsxExporter.js';

test('1. BNF Credit Entity: PREVISION_CREDITO_NUEVO and CREDITO_BNF reference Banco Nacional de Fomento (BNF)', () => {
  assert.ok(CREDITO_BNF, 'CREDITO_BNF must be exported');
  assert.equal(CREDITO_BNF.entidadFinanciera, 'BNF (Banco Nacional de Fomento)');
  assert.match(PREVISION_CREDITO_NUEVO.titulo, /BNF/);
  const hasBnfInConditions = PREVISION_CREDITO_NUEVO.condicionesCerradas.some((c) => c.includes('BNF'));
  assert.equal(hasBnfInConditions, true, 'condicionesCerradas must mention BNF');
});

test('2. No Water Tank or Pressurizer: Direct ESSAP street pressure is used without cistern tank', () => {
  const equipmentIds = DUCTOS_PASES_ENCHUFES_DATOS.tablerosYEquiposPrincipales.map((e) => e.id);
  assert.equal(
    equipmentIds.includes('HID_CISTERNA_BOMBA'),
    false,
    'HID_CISTERNA_BOMBA must be removed because ESSAP has good direct pressure'
  );

  const outletIds = DUCTOS_PASES_ENCHUFES_DATOS.enchufesYTomacorrientes.map((o) => o.id);
  assert.equal(
    outletIds.includes('TOMA_SUB_02_BOMBA'),
    false,
    'Pump outlet TOMA_SUB_02_BOMBA must not be present'
  );
});

test('3. ANDE Bajada de Luz & ESSAP Water Meter are positioned on the small wall next to the gate (x ≈ -3.85m, z ≈ -4.06m..-4.24m)', () => {
  const andePilar = DUCTOS_PASES_ENCHUFES_DATOS.tablerosYEquiposPrincipales.find(
    (e) => e.id === 'TAB_PILASTRA_ANDE'
  );
  const essapMeter = DUCTOS_PASES_ENCHUFES_DATOS.tablerosYEquiposPrincipales.find(
    (e) => e.id === 'HID_MEDIDOR_ESSAP'
  );

  assert.ok(andePilar, 'TAB_PILASTRA_ANDE must exist');
  assert.ok(essapMeter, 'HID_MEDIDOR_ESSAP must exist');

  // Must be on the small wall between the vehicular gate (-3.50m) and the -X neighbor (-4.87m)
  assert.ok(andePilar.pos3D[0] >= -4.10 && andePilar.pos3D[0] <= -3.65, `ANDE x=${andePilar.pos3D[0]} should be ~ -3.85m`);
  assert.ok(essapMeter.pos3D[0] >= -4.10 && essapMeter.pos3D[0] <= -3.65, `ESSAP x=${essapMeter.pos3D[0]} should be ~ -3.85m`);
  // ESSAP meter box must be at street level (y <= 0.25m)
  assert.ok(essapMeter.pos3D[1] <= 0.25, `ESSAP y=${essapMeter.pos3D[1]} must be at street level`);
});

test('4. Pool Orientation: Piscina is positioned transversely at the back of the lot', () => {
  const poolPartida = PRESUPUESTO_PARTIDAS.find((p) => p.id === 'piscina_patio_oficial');
  assert.ok(poolPartida, 'piscina_patio_oficial must exist');
  assert.match(poolPartida.desc, /transversal|fondo/i);
});

test('5. Strict BNF Credit Matrix Totals: 300M, 350M, and 440M tiers strictly respect their credit ceilings', () => {
  const breakdownHoy = buildMetricCalculationBreakdown('hoy_en_obra');
  assert.equal(breakdownHoy.totalPrevistoCreditoGs, 0, 'Hoy en Obra must have 0 Gs of new credit work');
  assert.equal(breakdownHoy.totalYaEjecutadoObraGs, 163820972, 'Hoy en Obra must show Gs. 163.820.972 already built');

  const breakdown300 = buildMetricCalculationBreakdown('escenario300');
  assert.ok(
    breakdown300.totalPrevistoCreditoGs > 280000000 && breakdown300.totalPrevistoCreditoGs <= 300000000,
    `300M scenario total (${breakdown300.totalPrevistoCreditoGs}) must be <= 300,000,000`
  );
  assert.equal(breakdown300.summary.totalCreditSelectedGs, breakdown300.totalPrevistoCreditoGs);

  // Also test options-object calling convention used by UI drawer
  const breakdownOpts = buildMetricCalculationBreakdown({
    scenarioKey: 'escenario350',
    partidas: PRESUPUESTO_PARTIDAS
  });
  assert.ok(
    breakdownOpts.summary.totalCreditSelectedGs > 330000000 && breakdownOpts.summary.totalCreditSelectedGs <= 350000000
  );
  const filteredPrevistos = filterMetricRows(breakdownOpts.allRows, { statusFilter: 'PREVISTOS', searchQuery: '' });
  assert.equal(filteredPrevistos.length, breakdownOpts.summary.includedItemsCount);

  const breakdown440 = buildMetricCalculationBreakdown('escenario440');
  assert.ok(
    breakdown440.totalPrevistoCreditoGs > 410000000 && breakdown440.totalPrevistoCreditoGs <= 440000000,
    `440M scenario total (${breakdown440.totalPrevistoCreditoGs}) must be <= 440,000,000`
  );

  // Every item in breakdown must have product name, unit, quantity, unitPrice, totalPrice, and valid status
  for (const row of breakdown300.allRows) {
    assert.ok(row.producto && row.producto.length > 0, 'Row must have producto');
    assert.ok(row.unidad && row.unidad.length > 0, 'Row must have unidad');
    assert.equal(typeof row.cantidad, 'number');
    assert.equal(typeof row.precioUnitarioGs, 'number');
    assert.equal(typeof row.precioTotalGs, 'number');
    assert.ok(
      [ITEM_STATUS.YA_ESTA_EN_OBRA, ITEM_STATUS.YA_ESTA_PROPIO, ITEM_STATUS.PREVISTO_CREDITO, ITEM_STATUS.NO_INCLUIDO].includes(row.status),
      `Invalid status ${row.status}`
    );
  }
});

test('6. Roof & Pluvial Simulation State Machines: Rain simulation and Tejas roof can always be deactivated', () => {
  // Roof cycling: isopanel -> tejas -> off -> isopanel
  assert.equal(cycleRoofStyle('isopanel'), 'tejas');
  assert.equal(cycleRoofStyle('tejas'), 'off');
  assert.equal(cycleRoofStyle('off'), 'isopanel');

  // Pluvial simulation state normalization: never forces rainstorm when all flags are false
  assert.equal(normalizePluvialSimulationMode('off'), 'off');
  assert.equal(normalizePluvialSimulationMode(null), 'off');
  assert.equal(
    normalizePluvialSimulationMode({ tormenta: false, presion_agua: false, descarga_cloacal: false }),
    'off'
  );
  assert.equal(
    normalizePluvialSimulationMode({ tormenta: true, presion_agua: false, descarga_cloacal: false }),
    'rainstorm'
  );
  assert.equal(
    normalizePluvialSimulationMode({ tormenta: false, presion_agua: true, descarga_cloacal: false }),
    'water_supply'
  );
  assert.equal(
    normalizePluvialSimulationMode({ tormenta: false, presion_agua: false, descarga_cloacal: true }),
    'sewage_flow'
  );

  assert.equal(
    isAnyMepSimulationActive(
      { tormenta: false, presion_agua: false, descarga_cloacal: false },
      { nominal: false, sobrecarga: false, falla_tierra: false }
    ),
    false
  );
});

test('7. Seven User Personas (Roles) Workspace & BOM Engine: Arquitecto, Ingeniero, Pareja, Plomero, Electricista, Albañil, Herrero', () => {
  const requiredRoles = ['pareja', 'arquitecto', 'ingeniero', 'plomero', 'electricista', 'albanil', 'herrero'];
  for (const roleId of requiredRoles) {
    const profile = getRoleWorkspaceConfig(roleId);
    assert.equal(profile.id, roleId, `Profile ID must match ${roleId}`);
    assert.ok(profile.nombre.length > 5, `${roleId} must have a descriptive name`);
    assert.ok(Array.isArray(profile.quickActions) && profile.quickActions.length >= 4, `${roleId} must have at least 4 quickActions`);
    assert.ok(Array.isArray(profile.checklistTecnico) && profile.checklistTecnico.length >= 4, `${roleId} must have at least 4 technical rules`);
    assert.ok(typeof profile.activeLayers === 'object', `${roleId} must define activeLayers`);

    const bom = getRoleBillOfMaterials(roleId, 'escenario350');
    assert.ok(bom.items.length > 0, `${roleId} must have mapped budget items`);
    assert.ok(bom.totalRolePrevistoBnfGs > 0, `${roleId} must have a positive previsto cost in 350M`);
    assert.equal(
      bom.totalRoleMaterialesGs + bom.totalRoleManoObraGs,
      bom.totalRolePrevistoBnfGs,
      `${roleId} Materiales + Mano de Obra must equal total previsto Gs`
    );

    const csv = generateRoleWorkOrderCsv(roleId, 'escenario350');
    assert.match(csv, /ORDEN DE TRABAJO Y CÓMPUTO MÉTRICO POR ESPECIALIDAD/);
    assert.ok(csv.includes(profile.nombre), `CSV for ${roleId} must include role name`);
  }
});

test('8. Extended Escritorio to Eje A (z=13.34m), No Floating Subsuelo Blindex & Mobile Bottom-Sheet UX', async () => {
  const fs = await import('node:fs');
  const archVizCode = fs.readFileSync(new URL('../src/archVizInterior.js', import.meta.url), 'utf8');
  const floorplanCode = fs.readFileSync(new URL('../src/floorplanEditor.js', import.meta.url), 'utf8');
  const indexHtml = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');

  // 1. Floating Subsuelo Blindex window at Eje B must NOT exist
  assert.ok(
    !archVizCode.includes('Ventanal Corredizo Blindex 10mm — Gran Salón del Subsuelo hacia Quincho Inferior'),
    'Floating Blindex window in Subsuelo must be removed'
  );

  // 2. Escritorio / Desk in Planta Alta must extend to z = 13.34m (Eje A) in both 3D and 2D
  assert.ok(
    archVizCode.includes('paFloorEscritorioExt') && archVizCode.includes('-4.87, 3.00, -4.87, 13.34'),
    '3D Planta Alta Escritorio must extend West wall and floor slab to Eje A (z=13.34m)'
  );
  assert.ok(
    floorplanCode.includes('d: 7.34') && floorplanCode.includes('_blindex_desk_a'),
    '2D Floorplan Editor Escritorio must have depth 7.34m (z=6.00..13.34m) and front Blindex at Eje A'
  );

  // 3. Mobile Bottom-Sheet Handle and GTA Touch Controls must exist in index.html
  assert.ok(
    indexHtml.includes('id="mobile-sidebar-handle"') && indexHtml.includes('id="gta-mobile-touch-controls"'),
    'index.html must include mobile bottom-sheet handle and GTA mobile touch controls'
  );
});

test('9. Paraguay Commercial Products Catalog & Enriched PRESUPUESTO_PARTIDAS', () => {
  assert.ok(CATALOGO_PRODUCTOS_SUGERIDOS_PARAGUAY, 'CATALOGO_PRODUCTOS_SUGERIDOS_PARAGUAY must be exported');
  assert.ok(CATALOGO_PRODUCTOS_SUGERIDOS_PARAGUAY.DEFAULT_FALLBACK, 'DEFAULT_FALLBACK must exist');

  for (let i = 1; i <= 28; i++) {
    const entry = CATALOGO_PRODUCTOS_SUGERIDOS_PARAGUAY[i];
    assert.ok(entry, `Catalog entry ${i} must exist`);
    assert.ok(entry.suggestedProduct && entry.suggestedProduct.length > 5, `Entry ${i} must have suggestedProduct`);
    assert.ok(entry.commercialUnit && entry.commercialUnit.length > 0, `Entry ${i} must have commercialUnit`);
    assert.equal(typeof entry.commercialUnitPrice, 'number');
    assert.ok(entry.supplierRef && entry.supplierRef.length > 2, `Entry ${i} must have supplierRef`);
    assert.ok(Array.isArray(entry.insumosUnitarios) && entry.insumosUnitarios.length >= 2, `Entry ${i} must have insumosUnitarios`);
  }

  for (const partida of PRESUPUESTO_PARTIDAS) {
    assert.ok(partida.suggestedProduct && partida.suggestedProduct.length > 5, `Partida ${partida.id} must have suggestedProduct`);
    assert.ok(partida.commercialUnit && partida.commercialUnit.length > 0, `Partida ${partida.id} must have commercialUnit`);
    assert.equal(typeof partida.commercialUnitPrice, 'number');
    assert.ok(partida.supplierRef && partida.supplierRef.length > 2, `Partida ${partida.id} must have supplierRef`);
    assert.ok(Array.isArray(partida.unitBreakdown) && partida.unitBreakdown.length >= 1, `Partida ${partida.id} must have unitBreakdown`);
  }
});

test('10. Eight Architectural Gallery Zones (GALLERY_ZONES_DATA) with Local Assets ./assets/zonas/zona_01..08.jpg', () => {
  assert.ok(Array.isArray(GALLERY_ZONES_DATA), 'GALLERY_ZONES_DATA must be an array');
  assert.equal(GALLERY_ZONES_DATA.length, 8, 'GALLERY_ZONES_DATA must contain 8 zones');

  GALLERY_ZONES_DATA.forEach((zone, idx) => {
    const numStr = String(idx + 1).padStart(2, '0');
    assert.equal(zone.zoneNumber, idx + 1);
    assert.ok(zone.id.startsWith(`zona_${numStr}_`), `Zone id ${zone.id} must start with zona_${numStr}_`);
    assert.ok(
      zone.image.includes(`/assets/zonas/zona_${numStr}_`) && zone.image.endsWith('.jpg'),
      `Zone image ${zone.image} must point to assets/zonas/zona_${numStr}_*.jpg`
    );
    assert.ok(zone.title && zone.title.length > 5);
    assert.ok(zone.level && zone.levelLabel && zone.cota && zone.dimensions);
    assert.ok(zone.cameraViewKey && zone.summary && zone.familyNotes);
    assert.ok(Array.isArray(zone.materialsAndProducts) && zone.materialsAndProducts.length >= 3);
  });
});

test('11. Custom Budget Item Creation, Overrides (including totalOverride -> unitPrice), and JSON State Serialization', () => {
  const customItem = createCustomBudgetItem({
    name: 'Portón Basculante Automatizado Peccinin',
    category: 'CARPINTERIA_Y_HERRERIA',
    unit: 'gl',
    qty: 2,
    unitPrice: 6500000,
    suggestedProduct: 'Motor Peccinin 1/2 HP + Chapa Plegada #18',
    includedInActive: true
  });

  assert.ok(customItem.id.startsWith('custom_'));
  assert.equal(customItem.isCustom, true);
  assert.equal(customItem.qty, 2);
  assert.equal(customItem.unitPrice, 6500000);
  assert.equal(customItem.total, 13000000);
  assert.equal(customItem.includedInActive, true);
  assert.ok(customItem.suggestedProduct.includes('Peccinin'));

  // Test applyItemCustomization with totalOverride recalculating unitPrice
  const customizedByTotal = applyItemCustomization(customItem, {
    qty: 4,
    totalOverride: 20000000,
    suggestedProduct: 'Motor PPA JetFlex Rápido + Estructura Galvanizada',
    includedInActive: false
  });
  assert.equal(customizedByTotal.qty, 4);
  assert.equal(customizedByTotal.unitPrice, 5000000);
  assert.equal(customizedByTotal.total, 20000000);
  assert.equal(customizedByTotal.includedInActive, false);
  assert.equal(customizedByTotal.isModified, true);

  // Test applyCustomOverridesToItems combining base items, overrides, and custom items
  const combined = applyCustomOverridesToItems(
    PRESUPUESTO_PARTIDAS.slice(0, 2),
    {
      [PRESUPUESTO_PARTIDAS[0].id]: {
        qty: 10,
        unitPrice: 500000,
        suggestedProduct: 'Hormigón Elaborado H25 Especial'
      }
    },
    [customItem]
  );
  assert.equal(combined.length, 3);
  assert.equal(combined[0].qty, 10);
  assert.equal(combined[0].unitPrice, 500000);
  assert.equal(combined[0].total, 5000000);
  assert.equal(combined[2].id, customItem.id);

  // Test serializeProjectState / deserializeProjectState
  const serializedObj = serializeProjectState({
    scenarioKey: 'escenario350',
    activeRoleId: 'arquitecto',
    items: combined,
    label: 'Versión aprobada en reunión familiar'
  });
  assert.equal(typeof serializedObj, 'object');
  assert.equal(serializedObj.scenarioKey, 'escenario350');
  assert.equal(serializedObj.activeRoleId, 'arquitecto');
  assert.equal(serializedObj.customItems.length, 1);
  assert.equal(typeof serializeProjectCustomState, 'function');
  assert.equal(typeof deserializeProjectCustomState, 'function');

  const jsonStr = JSON.stringify(serializedObj);
  const restored = deserializeProjectState(jsonStr);
  assert.equal(restored.valid, true);
  assert.equal(restored.isValid, true);
  assert.equal(restored.scenarioKey, 'escenario350');
  assert.equal(restored.activeRoleId, 'arquitecto');
  assert.ok(restored.mergedItems.some((it) => it.id === customItem.id));

  const invalidRestored = deserializeProjectState('{invalid json');
  assert.equal(invalidRestored.valid, false);
  assert.equal(invalidRestored.isValid, false);
});

test('12. XLSX Exporter includes 15 columns with "Producto Comercial / Marca Sugerida (Paraguay)" and reflects custom items', () => {
  const customItem = createCustomBudgetItem({
    id: 'custom_test_pergola_quincho',
    name: 'Pérgola Metálica Quincho Personalizada',
    category: 'ESTRUCTURA',
    unit: 'm²',
    qty: 15,
    unitPrice: 450000,
    suggestedProduct: 'Tubos Estructurales 100x50mm Chacomer + Policarbonato Alveolar',
    includedInActive: true
  });

  const customizedItems = applyCustomOverridesToItems(
    PRESUPUESTO_PARTIDAS,
    {
      losa_segunda_parte: {
        suggestedProduct: 'Losa Rap Precom + Cemento Yguazú Personalizado Test'
      }
    },
    [customItem]
  );

  const exportResult = exportProjectWorkbookXLSX({
    items: customizedItems,
    scenarioKey: 'escenario350'
  });

  const xlsxBytes = exportResult.bytes;
  assert.ok(xlsxBytes instanceof Uint8Array, 'exportProjectWorkbookXLSX must return { bytes: Uint8Array }');
  assert.ok(xlsxBytes.byteLength > 5000, 'Generated XLSX must have non-trivial size');

  const xmlText = new TextDecoder('utf-8').decode(xlsxBytes);
  assert.ok(
    xmlText.includes('Producto Comercial / Marca Sugerida (Paraguay)'),
    'Sheet 1 must contain column header "Producto Comercial / Marca Sugerida (Paraguay)"'
  );
  assert.ok(
    xmlText.includes('Losa Rap Precom + Cemento Yguazú Personalizado Test'),
    'Sheet 1 must reflect customized suggestedProduct override'
  );
  assert.ok(
    xmlText.includes('Pérgola Metálica Quincho Personalizada'),
    'Sheet 1 must include user-added custom budget item name'
  );
  assert.ok(
    xmlText.includes('Tubos Estructurales 100x50mm Chacomer + Policarbonato Alveolar'),
    'Sheet 1 must include user-added custom budget item suggestedProduct'
  );
});

test('13. Inverted Losa 1 Fix: Losa Maciza L4 is on +X (Ejes 1-5 around Escalera 1) and Sector Sin Losa (38.00 m²) is on -X (Ejes 5-9 next to Eje 9)', async () => {
  const fs = await import('node:fs');
  const sceneCode = fs.readFileSync(new URL('../src/scene.js', import.meta.url), 'utf8');
  const { FIXED_STRUCTURAL_GRID } = await import('../src/floorplanEditor.js');

  // Verify scene.js places L4 on +X (-0.74 to +3.84) and the 38m2 void on -X (-4.87 to -0.74)
  assert.ok(
    sceneCode.includes('l4MainMesh.position.set((-0.74 + 3.84) / 2, -0.09, (3.00 + 9.94) / 2)'),
    'scene.js must position L4 poured slab on +X (Ejes 1-5, x = -0.74 to +3.84)'
  );
  assert.ok(
    sceneCode.includes('rapMainMesh.position.set((-4.87 + -0.74) / 2, -0.09, (3.00 + 9.94) / 2)'),
    'scene.js must position the 38m2 Loza Rap void on -X (Ejes 5-9, x = -4.87 to -0.74)'
  );

  // Verify floorplanEditor.js voidLosa1HoyEnObra has minX: -4.87, maxX: -0.74 (Ejes 5-9)
  assert.equal(FIXED_STRUCTURAL_GRID.voidLosa1HoyEnObra.minX, -4.87);
  assert.equal(FIXED_STRUCTURAL_GRID.voidLosa1HoyEnObra.maxX, -0.74);
  assert.equal(FIXED_STRUCTURAL_GRID.voidLosa1HoyEnObra.minZ, 3.00);
  assert.equal(FIXED_STRUCTURAL_GRID.voidLosa1HoyEnObra.maxZ, 9.94);
});

test('14. Product-by-Product Desglose Unitario: Every partida has non-zero unitPriceGs, per-unit cost, and commercial shopping quantities (bolsas, barras, unidades, cajas)', () => {
  const breakdown = buildMetricCalculationBreakdown('escenario350');
  assert.ok(breakdown.allRows.length >= 45, 'Must have all budget rows');

  for (const row of breakdown.allRows) {
    if (row.id.startsWith('PROPIO-')) continue;
    const products = computeCommercialProductBreakdownForPartida(row);
    assert.ok(products.length >= 2, `Row ${row.id} (${row.item}) must have at least 2 commercial breakdown components`);

    for (const prod of products) {
      assert.ok(prod.product && prod.product.length > 2, `Component in ${row.id} must have a product name`);
      assert.ok(Number(prod.unitPriceGs) > 0, `Component "${prod.product}" in ${row.id} must have unitPriceGs > 0 (got ${prod.unitPriceGs})`);
      assert.ok(Number(prod.qtyPerUnit) > 0, `Component "${prod.product}" in ${row.id} must have qtyPerUnit > 0`);
      assert.ok(Number(prod.costPerUnitGs) > 0, `Component "${prod.product}" in ${row.id} must have costPerUnitGs > 0`);
      assert.ok(Number(prod.commercialUnitsToBuy) > 0, `Component "${prod.product}" in ${row.id} must have commercialUnitsToBuy > 0`);
      assert.ok(Number(prod.totalCommercialCostGs) > 0, `Component "${prod.product}" in ${row.id} must have totalCommercialCostGs > 0`);
    }
  }

  // Specifically verify contencion_cochera breaks down into bags of cement (Bolsa 50kg), 12m steel rebars (barra 12m), and Tobatí bricks (un)
  const muroContencion = PRESUPUESTO_PARTIDAS.find((p) => p.id === 'contencion_cochera');
  const muroBreakdown = computeCommercialProductBreakdownForPartida(muroContencion);
  assert.ok(
    muroBreakdown.some((b) => /Bolsa 50kg/i.test(b.unit) && b.commercialUnitsToBuy >= 20),
    'Muro de contención must break down into commercial 50kg cement bags to buy'
  );
  assert.ok(
    muroBreakdown.some((b) => /barra 12m/i.test(b.unit) && b.commercialUnitsToBuy >= 10),
    'Muro de contención must break down into commercial 12m steel rebar bars to buy'
  );
  assert.ok(
    muroBreakdown.some((b) => /Tobatí/i.test(b.product) && b.commercialUnitsToBuy >= 2000),
    'Muro de contención must break down into commercial Tobatí brick units to buy'
  );
});

test('15. Second Floor (Planta Alta +2.88m): Explicitly models 2 Bedrooms (Dormitorio 1 Sencillo + Dormitorio 2 En Suite with Vestidor & Baño) and Sector Escritorio', async () => {
  const { ROOM_CAMERA_PRESETS } = await import('../src/archVizInterior.js');
  const { PLAN_PRESETS } = await import('../src/floorplanEditor.js');

  assert.ok(ROOM_CAMERA_PRESETS.dormitorio_sencillo, 'ROOM_CAMERA_PRESETS must include dormitorio_sencillo');
  assert.ok(ROOM_CAMERA_PRESETS.dormitorio_suite, 'ROOM_CAMERA_PRESETS must include dormitorio_suite');
  assert.ok(ROOM_CAMERA_PRESETS.planta_alta, 'ROOM_CAMERA_PRESETS must include planta_alta (Sector Escritorio)');

  const paRooms2D = PLAN_PRESETS.cierre_300m.levels.planta_alta.rooms;
  const fullRoomLabel = (r) => `${r.shortTitle || ''} ${r.subTitle || ''} ${r.name || ''}`;
  const hasDorm1Sencillo = paRooms2D.some((r) => /DORMITORIO 1 \(SENCILLO\)|Dormitorio 1 — Sencillo/i.test(fullRoomLabel(r)));
  const hasDorm2Suite = paRooms2D.some((r) => /DORMITORIO 2 \(EN SUITE\)|Dormitorio 2 — Principal en Suite/i.test(fullRoomLabel(r)));
  const hasVestidor = paRooms2D.some((r) => /VESTIDOR EN SUITE/i.test(fullRoomLabel(r)));
  const hasEscritorio = paRooms2D.some((r) => /ESCRITORIO/i.test(fullRoomLabel(r)));

  assert.equal(hasDorm1Sencillo, true, '2D Planta Alta must include DORMITORIO 1 (SENCILLO)');
  assert.equal(hasDorm2Suite, true, '2D Planta Alta must include DORMITORIO 2 (EN SUITE)');
  assert.equal(hasVestidor, true, '2D Planta Alta must include VESTIDOR EN SUITE');
  assert.equal(hasEscritorio, true, '2D Planta Alta must include SECTOR ESCRITORIO');

  const paArchRooms = ARCHITECTURAL_ROOMS.filter((r) => r.level.includes('Planta Alta'));
  assert.ok(paArchRooms.some((r) => /Dormitorio 1/i.test(r.name)), 'ARCHITECTURAL_ROOMS must list Dormitorio 1 (Sencillo)');
  assert.ok(paArchRooms.some((r) => /Dormitorio 2/i.test(r.name)), 'ARCHITECTURAL_ROOMS must list Dormitorio 2 (En Suite)');
});

test('16. Layer Isolation Selector (Only Pipes / No House) & Hide Underground Elements Toggle', async () => {
  const fs = await import('node:fs');
  const sceneCode = fs.readFileSync(new URL('../src/scene.js', import.meta.url), 'utf8');
  const htmlCode = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');

  assert.ok(sceneCode.includes('setLayerIsolationPreset('), 'scene.js must implement setLayerIsolationPreset');
  assert.ok(sceneCode.includes("mode === 'only_pipes'"), 'scene.js must support only_pipes isolation mode');
  assert.ok(sceneCode.includes("mode === 'only_electric'"), 'scene.js must support only_electric isolation mode');
  assert.ok(sceneCode.includes("mode === 'only_all_mep'"), 'scene.js must support only_all_mep isolation mode');
  assert.ok(sceneCode.includes('setHideUnderground('), 'scene.js must implement setHideUnderground');
  assert.ok(sceneCode.includes('this.undergroundGroup'), 'scene.js must group underground foundations in this.undergroundGroup');

  assert.ok(htmlCode.includes('id="select-layer-isolation"'), 'index.html must include #select-layer-isolation');
  assert.ok(htmlCode.includes('id="btn-hide-underground"'), 'index.html must include #btn-hide-underground');
  assert.ok(htmlCode.includes('id="layer-hide-underground"'), 'index.html must include #layer-hide-underground');
});

test('17. Authentic 3D Climbing Vine Geometry & Universal Window Maximize/Minimize Controls', async () => {
  const fs = await import('node:fs');
  const archCode = fs.readFileSync(new URL('../src/archVizInterior.js', import.meta.url), 'utf8');
  const htmlCode = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');

  assert.ok(
    archCode.includes('CatmullRomCurve3') && archCode.includes('TubeGeometry') && archCode.includes('leafShape'),
    'archVizInterior.js must build organic 3D climbing vine stems with CatmullRomCurve3 + TubeGeometry and pointed leaf blades'
  );
  assert.ok(htmlCode.includes('data-win-maximize="computo-drawer"'), 'index.html must include maximize control for computo-drawer');
  assert.ok(htmlCode.includes('data-win-maximize="modal-editor-2d"'), 'index.html must include maximize control for modal-editor-2d');
  assert.ok(htmlCode.includes('id="minimized-windows-bar"'), 'index.html must include #minimized-windows-bar');
});




