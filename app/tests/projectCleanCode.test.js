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
  ITEMS_CREDITO_440M
} from '../src/data/projectData.js';

import {
  ITEM_STATUS,
  buildMetricCalculationBreakdown,
  cycleRoofStyle,
  normalizePluvialSimulationMode,
  isAnyMepSimulationActive
} from '../src/domain/budgetAndSceneService.js';

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

  const breakdown350 = buildMetricCalculationBreakdown('escenario350');
  assert.ok(
    breakdown350.totalPrevistoCreditoGs > 330000000 && breakdown350.totalPrevistoCreditoGs <= 350000000,
    `350M scenario total (${breakdown350.totalPrevistoCreditoGs}) must be <= 350,000,000`
  );

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
