import { ProjectScene } from './scene.js';
import {
  CURATED_PHOTOS,
  ALL_PROJECT_PHOTOS,
  ALL_BLUEPRINTS_CATALOG,
  ARCHITECTURAL_ROOMS,
  GEOTECHNICAL_DATA,
  STRUCTURAL_ITEMS,
  PRESUPUESTO_PARTIDAS,
  EDIFICA_STUDIO_BUDGETS,
  COMPARADOR_MULTI_PRESUPUESTO,
  ESCENARIOS_INVERSION,
  REALISTIC_RENDERS,
  PARAMETROS_INSUMOS,
  CONTEXTO_URBANO_SATELITAL,
  ACTA_RECEPCION_SUMMARY,
  OMISIONES_CRITICAS_PRESUPUESTO,
  PREVISION_CREDITO_NUEVO,
  REQUISITOS_BANCO_Y_CUOTAS,
  PRESUPUESTO_SISTEMA_ALARMA_ASUNCION,
  PROTOCOLO_CUIDADO_LOSA_EXPUESTA,
  SISTEMA_CLOACAL_DUAL_SUBSUELO,
  COMPARATIVA_TECHO_ACUSTICA_COSTOS,
  CALCULADORA_LADRILLOS_TOBATI,
  PROVEEDORES_PARAGUAY_REFERENCIA,
  INVENTARIO_MUEBLES_ACTUALES_LEO,
  CONTROL_PROPIETARIO_Y_NEGOCIACION_ARQUITECTO,
  AUDITORIA_SEIS_ESPECIALISTAS,
  DUCTOS_PASES_ENCHUFES_DATOS,
  ESTRATEGIA_COMPRA_CHINA_DOMOTICA_ELECTRICA
} from './data/projectData.js';
import {
  PLUVIAL_HYDRO_DATA,
  WEAK_SIGNALS_DATA,
  ARQUITECTURA_PARAGUAY_BEST_PRACTICES
} from './mepSystems.js';
import {
  buildMetricCalculationBreakdown,
  filterMetricRows,
  cycleRoofStyle,
  getRoofStyleButtonLabel,
  isAnyMepSimulationActive,
  USER_ROLES_CATALOG,
  getRoleWorkspaceConfig,
  getRoleBillOfMaterials,
  generateRoleWorkOrderCsv
} from './domain/budgetAndSceneService.js';
import { FloorplanEditor } from './floorplanEditor.js';
import { AuthManager } from './auth.js';
import { exportProjectWorkbookXLSX } from './xlsxExporter.js';

document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // =========================================================================
  // 1. AUTHENTICATION GATE MANAGEMENT
  // =========================================================================
  const authOverlay = document.getElementById('auth-overlay');
  const authForm = document.getElementById('auth-form');
  const authUserInput = document.getElementById('auth-username');
  const authPassInput = document.getElementById('auth-password');
  const authRemember = document.getElementById('auth-remember');
  const authErrorMsg = document.getElementById('auth-error-msg');
  const btnLogout = document.getElementById('btn-logout');

  const onAuthSuccess = () => {
    if (authOverlay) {
      authOverlay.classList.add('hidden');
    }
    if (window.lucide) window.lucide.createIcons();
  };

  const authManager = new AuthManager(onAuthSuccess);

  (async () => {
    const valid = await authManager.verifyExistingSession();
    if (authOverlay) {
      if (valid) {
        authOverlay.classList.add('hidden');
      } else {
        authOverlay.classList.remove('hidden');
      }
    }
  })();

  if (authForm) {
    authForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (authErrorMsg) authErrorMsg.style.display = 'none';
      const result = await authManager.login(
        authUserInput ? authUserInput.value : '',
        authPassInput ? authPassInput.value : '',
        authRemember ? authRemember.checked : true
      );
      if (!result.success) {
        if (authErrorMsg) {
          authErrorMsg.textContent = result.error;
          authErrorMsg.style.display = 'block';
        }
        if (authPassInput) {
          authPassInput.value = '';
          authPassInput.focus();
        }
      }
    });
  }

  if (btnLogout) {
    btnLogout.addEventListener('click', () => {
      if (confirm('¿Deseas cerrar sesión y bloquear la pantalla?')) {
        authManager.logout();
      }
    });
  }

  // =========================================================================
  // 2. CORE DOM REFERENCES & HELPERS
  // =========================================================================
  const container = document.getElementById('canvas-container');
  const measureCard = document.getElementById('measure-card');
  const measureDist = document.getElementById('measure-dist');
  const measureDy = document.getElementById('measure-dy');
  const measurePlan = document.getElementById('measure-plan');
  const inspectorPopup = document.getElementById('inspector-popup');
  const inspectorTag = document.getElementById('inspector-tag');
  const inspectorTitle = document.getElementById('inspector-title');
  const inspectorDesc = document.getElementById('inspector-desc');
  const inspectorMeta = document.getElementById('inspector-meta');
  const leftSidebar = document.getElementById('left-sidebar');

  // KPI elements
  const kpiScenarioName = document.getElementById('kpi-scenario-name');
  const kpiTotalAmount = document.getElementById('kpi-total-amount');
  const kpiCostoM2 = document.getElementById('kpi-costo-m2');
  const kpiSemaforo = document.getElementById('kpi-semaforo');
  const kpiObjectiveDesc = document.getElementById('kpi-objective-desc');

  // Simulation Banner elements
  const simTotalDisplay = document.getElementById('sim-total-display');
  const simTargetDisplay = document.getElementById('sim-target-display');
  const simSaldoDisplay = document.getElementById('sim-saldo-display');
  const simM2Display = document.getElementById('sim-m2-display');
  const budgetTbody = document.getElementById('budget-items-tbody');

  let activeScenarioKey = 'escenario300';
  let selectedItemIds = new Set(ESCENARIOS_INVERSION.escenario300.itemsIncluidos);
  let activeComputoCategoryFilter = 'ALL';
  let activeComputoOriginFilter = 'ALL';
  let customTargetOverrideGs = null;
  let activeUserRoleId = 'pareja';
  let renderComputoDrawer = null;
  let renderActiveRoleWorkbench = null;

  // Editable state copy of budget items so user can adjust quantities & unit prices live
  const editablePartidas = PRESUPUESTO_PARTIDAS.map((p) => ({
    ...p,
    cantidadActual: Number(p.cantidad),
    precioUnitarioActualGs: Number(p.precioUnitarioGs),
    subtotalActualGs: Math.round(Number(p.cantidad) * Number(p.precioUnitarioGs))
  }));

  const formatGs = (num) => {
    return Math.round(Number(num) || 0).toLocaleString('es-PY');
  };

  // =========================================================================
  // 3. 3D SCENE INITIALIZATION & INSPECTOR POPUP
  // =========================================================================
  const onSelectObject = (userData) => {
    if (!userData) {
      inspectorPopup.classList.remove('open');
      return;
    }

    inspectorTag.textContent = userData.type?.toUpperCase() || 'ELEMENTO BIM 3D';
    inspectorTitle.textContent = userData.name || userData.title || 'Detalle Técnico del Elemento';
    inspectorDesc.textContent = userData.desc || userData.highlights?.join(' • ') || '';

    let metaHtml = '';
    if (userData.costo || userData.costoEstimado) {
      metaHtml += `<span class="badge-pill" style="border-color:var(--accent-gold); color:var(--accent-gold); font-weight:700;">Costo: ${userData.costo || userData.costoEstimado}</span> `;
    }
    if (userData.cota) {
      metaHtml += `<span class="badge-pill" style="border-color:#38bdf8; color:#7dd3fc;">Cota: ${userData.cota}</span> `;
    }
    if (userData.dimensions) {
      metaHtml += `<span class="badge-pill">Dim: ${userData.dimensions}</span> `;
    }
    if (userData.rebar) {
      metaHtml += `<span class="badge-pill" style="border-color:#a855f7; color:#d8b4fe;">Armadura: ${userData.rebar}</span> `;
    }
    if (userData.status) {
      metaHtml += `<span class="badge-pill" style="border-color:#10b981; color:#34d399;">${userData.status}</span> `;
    }
    if (userData.area) {
      metaHtml += `<span class="badge-pill">Área: ${userData.area} m²</span> `;
    }

    if (userData.type === 'borehole' && Array.isArray(userData.estratos)) {
      metaHtml += `<span class="badge-pill">Cota Boca: +${userData.cota} m</span> `;
      metaHtml += `<span class="badge-pill">Prof: ${userData.prof} m</span><br>`;
      metaHtml += `<div style="margin-top:8px; font-size:11px;"><strong>Estratos (GEO-STAN #2956):</strong><br>`;
      userData.estratos.forEach((e) => {
        metaHtml += `• ${e.de}m - ${e.a}m: ${e.tipo} (Nspt: ${e.nspt})<br>`;
      });
      metaHtml += `</div>`;
    } else if (userData.type === 'photoHotspot' && userData.data) {
      const photo = userData.data;
      metaHtml += `
        <div style="margin-top:10px;">
          <img src="${photo.url}=w600" style="width:100%; border-radius:6px; margin-bottom:6px;" alt="Foto de Obra">
          <p style="font-size:11px; color:#cbd5e1;">${photo.desc}</p>
          <a href="${photo.url}" target="_blank" style="color:var(--accent-cyan); font-size:11px; text-decoration:underline;">Ver en Google Photos</a>
        </div>
      `;
    }

    inspectorMeta.innerHTML = metaHtml;
    inspectorPopup.classList.add('open');
  };

  const onMeasurementUpdate = (data) => {
    if (!data) {
      measureCard.classList.remove('visible');
      return;
    }
    measureDist.textContent = `${data.distance} m`;
    measureDy.textContent = `${data.dy} m`;
    const planDist = Math.sqrt(
      Math.pow(parseFloat(data.dx), 2) + Math.pow(parseFloat(data.dz), 2)
    ).toFixed(2);
    measurePlan.textContent = `${planDist} m`;
    measureCard.classList.add('visible');
  };

  const scene = new ProjectScene(container, onSelectObject, onMeasurementUpdate);
  window.projectScene = scene;

  // =========================================================================
  // 4. INTERACTIVE 2D/3D FLOORPLAN EDITOR INTEGRATION (#modal-editor-2d)
  // =========================================================================
  const editorContainer = document.getElementById('floorplan-editor-container');
  let floorplanEditor = null;
  let editorInitialized = false;

  if (editorContainer) {
    floorplanEditor = new FloorplanEditor(editorContainer, {
      sceneInstance: scene,
      onPlanChanged: (planState) => {
        if (!planState || !planState.metrics) return;
        if (!editorInitialized) return;
        const m = planState.metrics;
        const totalGs = m.totalProjectCostGs;
        const activeM2 = Math.max(1, Math.round(m.activeRoomsAreaM2 || 160));
        const costM2 = Math.round(totalGs / activeM2);

        if (kpiScenarioName) {
          kpiScenarioName.textContent = `Diseño BIM (${planState.presetId.toUpperCase()})`;
        }
        if (kpiTotalAmount) kpiTotalAmount.textContent = formatGs(totalGs);
        if (kpiCostoM2) kpiCostoM2.textContent = `Gs. ${formatGs(costM2)} / m²`;
        if (kpiObjectiveDesc) {
          kpiObjectiveDesc.textContent = `Sincronizado desde Editor CAD 2D/3D: ${m.activeRoomsAreaM2} m² activos | Muros 15cm: ${m.mamposteria15M2}m² | 20cm: ${m.mamposteria20M2}m² | Blindex: ${m.blindexM2}m².`;
        }
      }
    });
    editorInitialized = true;
    scene.setScenario('escenario300');
  }

  // =========================================================================
  // 5. BANK REQUIREMENTS, "EL CRÉDITO NUEVO" (CAJA MUTUAL), MULTI-BUDGET & FORENSIC ENGINE
  // =========================================================================
  const getPartidaBankMeta = (p) => {
    const map = REQUISITOS_BANCO_Y_CUOTAS?.clasificacionPartidasBanco || {};
    const entry = map[p.id] || {
      colorBanco: p.id.startsWith('forense_puente') || p.id.startsWith('forense_aislacion') ? 'AMARILLO' : 'ROJO',
      pctMateriales: 60,
      pctManoObra: 40
    };
    const sub = Number(p.subtotalActualGs ?? p.subtotalGs ?? 0);
    // Para Alarma y Protocolo Losa 1 usamos los montos exactos de Materiales y Mano de Obra si el subtotal no fue editado
    let matGs = Math.round((sub * entry.pctMateriales) / 100);
    let moGs = sub - matGs;
    if (p.id === 'debil_alarma_barreras' && sub === 5450000) {
      matGs = 4500000;
      moGs = 950000;
    } else if (p.id === 'forense_puente_adherencia_epoxico' && sub === 7050000) {
      matGs = 4050000;
      moGs = 3000000;
    } else if (p.id === 'forense_cloaca_subsuelo_bombeo' && sub === 9400000) {
      matGs = 5750000;
      moGs = 3650000;
    } else if (p.id === 'sobreelevacion_muralla_lateral_3x2' && sub === 1350000) {
      matGs = 780000;
      moGs = 570000;
    } else if (p.id === 'porton_cochera_automatizado' && sub === 2650000) {
      matGs = 1950000;
      moGs = 700000;
    } else if (p.id === 'edifica_vereda_frontal' && sub === 4000000) {
      matGs = 2300000;
      moGs = 1700000;
    }
    const colorDef = REQUISITOS_BANCO_Y_CUOTAS?.coloresNormativosBanco?.[entry.colorBanco] || {
      codigo: entry.colorBanco,
      nombre: entry.colorBanco,
      badgeBg: 'rgba(220,38,38,0.22)',
      badgeBorder: '#ef4444',
      badgeText: '#fca5a5'
    };
    return {
      colorBanco: entry.colorBanco,
      pctMateriales: entry.pctMateriales,
      pctManoObra: entry.pctManoObra,
      materialesGs: matGs,
      manoObraGs: moGs,
      colorDef
    };
  };

  const getBankColorBadgeHtml = (colorCode) => {
    if (colorCode === 'NEGRO') {
      return `<span class="badge-pill" style="background:rgba(15,23,42,0.95); border-color:#94a3b8; color:#f8fafc; font-weight:700; font-size:10px;">⚫ NEGRO (Construido)</span>`;
    }
    if (colorCode === 'VERDE') {
      return `<span class="badge-pill" style="background:rgba(22,163,74,0.22); border-color:#22c55e; color:#86efac; font-weight:700; font-size:10px;">🟢 VERDE (Hormigón)</span>`;
    }
    if (colorCode === 'AMARILLO') {
      return `<span class="badge-pill" style="background:rgba(217,119,6,0.24); border-color:#f59e0b; color:#fde68a; font-weight:700; font-size:10px;">🟡 AMARILLO (Refacción)</span>`;
    }
    return `<span class="badge-pill" style="background:rgba(220,38,38,0.22); border-color:#ef4444; color:#fca5a5; font-weight:700; font-size:10px;">🔴 ROJO (A Construir)</span>`;
  };

  const matchesComputoCategory = (partida, filterKey) => {
    if (!filterKey || filterKey === 'ALL') return true;
    const cat = (partida.categoria || '').toLowerCase();
    const id = (partida.id || '').toLowerCase();
    if (filterKey === 'Forense') return id.startsWith('forense_') || cat.includes('forense');
    if (filterKey === 'Edifica') return id.startsWith('edifica_') || id.includes('muralla') || id.includes('porton') || cat.includes('edifica');
    if (filterKey === 'Hidrófugo') return id.startsWith('hidro_') || cat.includes('hidrófug') || cat.includes('hidrofug') || cat.includes('pluvial');
    if (filterKey === 'Señales') return id.startsWith('debil_') || cat.includes('señales') || cat.includes('cctv') || cat.includes('domótica');
    return true;
  };

  const matchesComputoOrigin = (partida, originKey) => {
    if (!originKey || originKey === 'ALL') return true;
    if (originKey.startsWith('COLOR_')) {
      const targetColor = originKey.replace('COLOR_', '');
      return getPartidaBankMeta(partida).colorBanco === targetColor;
    }
    return partida.origenTipo === originKey;
  };

  const getOriginBadgeHtml = (p) => {
    if (p.origenTipo === 'PLANILLA_JIVESA_LGRB') {
      return `<span class="origin-pill origin-jivesa">🟢 ${p.origenLabel || '📄 Planilla JIVESA / LG-RB'}</span>`;
    }
    if (p.origenTipo === 'EDIFICA_STUDIO') {
      return `<span class="origin-pill origin-edifica">🔵 ${p.origenLabel || '📐 Edifica Studio (Arq. Amarilla & León)'}</span>`;
    }
    return `<span class="origin-pill origin-ia">🟣 ${p.origenLabel || '🤖 Incluido por IA / Ajuste Leo'}</span>`;
  };

  const recalculateBudget = () => {
    let total = 0;
    let totalMat = 0;
    let totalMo = 0;
    let totalVerde = 0;
    let totalRojo = 0;
    let totalAmarillo = 0;

    editablePartidas.forEach((p) => {
      p.subtotalActualGs = Math.round(p.cantidadActual * p.precioUnitarioActualGs);
      if (selectedItemIds.has(p.id)) {
        total += p.subtotalActualGs;
        const bm = getPartidaBankMeta(p);
        totalMat += bm.materialesGs;
        totalMo += bm.manoObraGs;
        if (bm.colorBanco === 'VERDE') totalVerde += p.subtotalActualGs;
        else if (bm.colorBanco === 'AMARILLO') totalAmarillo += p.subtotalActualGs;
        else totalRojo += p.subtotalActualGs;
      }
    });

    const isHoy = activeScenarioKey === 'hoy_en_obra';
    const scenario = ESCENARIOS_INVERSION[activeScenarioKey] || ESCENARIOS_INVERSION.escenario300;
    const target = customTargetOverrideGs
      ? customTargetOverrideGs
      : isHoy
        ? ACTA_RECEPCION_SUMMARY.liquidacionFinancieraJivesa.totalEjecutadoGs
        : scenario.montoObjetivoGs;
    const diff = target - total;
    const m2Construido = 178.42;
    const costoM2 = Math.round(total / m2Construido);

    // Cuota mensual BNF (9,9% anual a 15 años con seguros incluidos) según meta de crédito
    const factorBnf = PREVISION_CREDITO_NUEVO?.factorCuotaConSegurosPorMillonGs || 11765.9090909;
    const millonesTarget = target / 1000000;
    const cuotaBnfGs = Math.round(millonesTarget * factorBnf);

    // Update Left Sidebar KPI Card
    if (isHoy && !customTargetOverrideGs) {
      const liq = ACTA_RECEPCION_SUMMARY.liquidacionFinancieraJivesa;
      if (kpiScenarioName) kpiScenarioName.textContent = '⚫ Hoy en Obra (163,8M Gs)';
      if (kpiTotalAmount) kpiTotalAmount.textContent = formatGs(liq.totalEjecutadoGs);
      if (kpiCostoM2) kpiCostoM2.textContent = `Gs. ${formatGs(Math.round(liq.totalEjecutadoGs / 103))} / m² H°A°`;
      if (kpiSemaforo) {
        kpiSemaforo.className = 'kpi-status-badge ok';
        kpiSemaforo.style.background = 'rgba(245, 158, 11, 0.2)';
        kpiSemaforo.style.color = '#fde68a';
        kpiSemaforo.innerHTML = '<span class="status-dot" style="background:#f59e0b;box-shadow:0 0 8px #f59e0b;"></span><span>⚫ Negro: Ejecutado</span>';
      }
      if (kpiObjectiveDesc) {
        kpiObjectiveDesc.textContent = ACTA_RECEPCION_SUMMARY.estadoRealObraHoy.resumen + ' (JIVESA S.A. / PROBETI #17671).';
      }
    } else if ((activeScenarioKey === 'edifica460' || activeScenarioKey === 'edifica573') && !customTargetOverrideGs) {
      if (kpiTotalAmount) kpiTotalAmount.textContent = formatGs(scenario.montoObjetivoGs);
      if (kpiCostoM2) kpiCostoM2.textContent = `Gs. ${formatGs(Math.round(scenario.montoObjetivoGs / m2Construido))} / m²`;
      if (kpiSemaforo) {
        kpiSemaforo.className = 'kpi-status-badge ok';
        kpiSemaforo.style.background = 'rgba(59, 130, 246, 0.22)';
        kpiSemaforo.style.color = '#93c5fd';
        kpiSemaforo.innerHTML = '<span class="status-dot" style="background:#3b82f6;box-shadow:0 0 8px #3b82f6;"></span><span>Edifica Studio</span>';
      }
    } else {
      if (kpiTotalAmount) kpiTotalAmount.textContent = formatGs(total);
      if (kpiCostoM2) kpiCostoM2.textContent = `Cuota BNF: Gs. ${formatGs(cuotaBnfGs)}/mes (Gs. ${formatGs(costoM2)}/m²)`;
      if (kpiSemaforo) {
        if (diff >= 0) {
          kpiSemaforo.className = 'kpi-status-badge ok';
          kpiSemaforo.style.background = '';
          kpiSemaforo.style.color = '';
          kpiSemaforo.innerHTML = '<span class="status-dot"></span><span>En Rango</span>';
        } else {
          kpiSemaforo.className = 'kpi-status-badge';
          kpiSemaforo.style.background = 'rgba(239, 68, 68, 0.2)';
          kpiSemaforo.style.color = '#f87171';
          kpiSemaforo.innerHTML = '<span class="status-dot" style="background:#ef4444;box-shadow:0 0 8px #ef4444;"></span><span>Excedido</span>';
        }
      }
    }

    // Update Modal Summary Banner
    if (simTotalDisplay) simTotalDisplay.textContent = `Gs. ${formatGs(total)}`;
    if (simTargetDisplay) simTargetDisplay.textContent = `Gs. ${formatGs(target)}`;
    if (simM2Display) simM2Display.textContent = `Gs. ${formatGs(cuotaBnfGs)} / mes`;

    if (simSaldoDisplay) {
      if (diff >= 0) {
        simSaldoDisplay.textContent = `+ ${formatGs(diff)} Gs.`;
        simSaldoDisplay.style.color = '#10b981';
      } else {
        simSaldoDisplay.textContent = `- ${formatGs(Math.abs(diff))} Gs.`;
        simSaldoDisplay.style.color = '#ef4444';
      }
    }

    // Update live Bank Color & Mat/MO summary strip if rendered
    const elBankVerde = document.getElementById('bank-sum-verde');
    const elBankRojo = document.getElementById('bank-sum-rojo');
    const elBankAmarillo = document.getElementById('bank-sum-amarillo');
    const elBankMat = document.getElementById('bank-sum-mat');
    const elBankMo = document.getElementById('bank-sum-mo');
    if (elBankVerde) elBankVerde.textContent = `Gs. ${formatGs(totalVerde)}`;
    if (elBankRojo) elBankRojo.textContent = `Gs. ${formatGs(totalRojo)}`;
    if (elBankAmarillo) elBankAmarillo.textContent = `Gs. ${formatGs(totalAmarillo)}`;
    if (elBankMat) elBankMat.textContent = `Gs. ${formatGs(totalMat)}`;
    if (elBankMo) elBankMo.textContent = `Gs. ${formatGs(totalMo)}`;

    // Refresh row states and subtotals in table
    document.querySelectorAll('.budget-row').forEach((row) => {
      const id = row.getAttribute('data-item-id');
      if (!id || id.startsWith('E-')) return;
      const checkbox = row.querySelector('.budget-chk');
      const subCell = row.querySelector('.computo-subtotal-cell');
      const matMoCell = row.querySelector('.computo-mat-mo-cell');
      const itemObj = editablePartidas.find((item) => item.id === id);
      if (itemObj && subCell) {
        subCell.textContent = `Gs. ${formatGs(itemObj.subtotalActualGs)}`;
      }
      if (itemObj && matMoCell) {
        const bm = getPartidaBankMeta(itemObj);
        matMoCell.innerHTML = `
          <div style="font-size:10.5px; color:#93c5fd;">Mat (${bm.pctMateriales}%): Gs. ${formatGs(bm.materialesGs)}</div>
          <div style="font-size:10.5px; color:#6ee7b7;">M.O. (${bm.pctManoObra}%): Gs. ${formatGs(bm.manoObraGs)}</div>
        `;
      }
      if (selectedItemIds.has(id)) {
        row.classList.add('selected');
        if (checkbox) checkbox.checked = true;
      } else {
        row.classList.remove('selected');
        if (checkbox) checkbox.checked = false;
      }
    });

    // Sync forensic omission badges
    document.querySelectorAll('.omision-toggle-btn').forEach((btn) => {
      const pid = btn.getAttribute('data-partida-id');
      const active = selectedItemIds.has(pid);
      btn.classList.toggle('included', active);
      btn.textContent = active ? '✓ Incluida en Cómputo' : '+ Incluir Partida';
    });

    if (typeof renderComputoDrawer === 'function') {
      renderComputoDrawer();
    }
    if (typeof renderActiveRoleWorkbench === 'function') {
      renderActiveRoleWorkbench();
    }
  };

  // Render "El Crédito Nuevo" (BNF - Banco Nacional de Fomento), Bank Requirements, Color Legend & 5 Work Adjustments of Leo
  const renderBankCreditAndRequirements = () => {
    const host = document.getElementById('bank-credit-and-requirements-host');
    if (!host || !PREVISION_CREDITO_NUEVO || !REQUISITOS_BANCO_Y_CUOTAS) return;

    const t65 = REQUISITOS_BANCO_Y_CUOTAS.tablaCuotasPorMillon.tasa65;
    const t99 = REQUISITOS_BANCO_Y_CUOTAS.tablaCuotasPorMillon.tasa99;

    host.innerHTML = `
      <div class="multi-budget-box" style="margin-bottom:16px; border:1px solid rgba(16,185,129,0.45); background:linear-gradient(180deg, rgba(6,78,59,0.22) 0%, rgba(15,23,42,0.85) 100%);">
        <div class="multi-budget-header" style="margin-bottom:10px;">
          <div>
            <h3 style="color:#6ee7b7; font-size:16px; display:flex; align-items:center; gap:8px;">
              💳 ${PREVISION_CREDITO_NUEVO.titulo}
            </h3>
            <p style="font-size:11.5px; color:#cbd5e1;">
              Tasa cerrada <strong>9,9 % anual a 15 años (180 cuotas)</strong> • <strong>Sin período de gracia</strong> • <strong>A sola firma</strong> (el terreno ya garantiza el crédito) • <strong>Leo paga la cuota completa</strong> (equilibrio con la caja común) • <strong>La cuota incluye seguros</strong>.
            </p>
          </div>
          <div style="display:flex; gap:8px; flex-wrap:wrap;">
            <a href="${PREVISION_CREDITO_NUEVO.documentoImgUrl}" target="_blank" class="badge-pill" style="text-decoration:none; border-color:#10b981; color:#6ee7b7; font-weight:700;">
              📄 Ver Cuadro Original «El Crédito Nuevo»
            </a>
            <a href="${REQUISITOS_BANCO_Y_CUOTAS.documentoImgUrl}" target="_blank" class="badge-pill" style="text-decoration:none; border-color:#f59e0b; color:#fde68a; font-weight:700;">
              🏦 Ver Requisitos del Banco y Tabla 6,5% vs 9,9%
            </a>
          </div>
        </div>

        <!-- 4 Tramos Oficiales de Caja Mutual (250M / 300M / 350M / 440M) -->
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(245px, 1fr)); gap:10px; margin-bottom:14px;">
          ${PREVISION_CREDITO_NUEVO.tramos
            .map(
              (tramo) => `
            <div class="comparador-budget-card" style="border-top:3px solid ${tramo.destacado ? '#10b981' : '#38bdf8'}; background:${tramo.destacado ? 'rgba(16,185,129,0.12)' : 'rgba(15,23,42,0.75)'}; padding:12px;">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                <span style="font-size:13px; font-weight:800; color:${tramo.destacado ? '#6ee7b7' : '#7dd3fc'};">Crédito ${tramo.label}</span>
                ${tramo.badge ? `<span class="badge-pill" style="border-color:#10b981; color:#6ee7b7; font-size:9.5px; margin:0;">${tramo.badge}</span>` : ''}
              </div>
              <div style="font-size:19px; font-weight:800; color:#fff; font-family:var(--font-mono); margin:4px 0;">
                Gs. ${formatGs(tramo.cuotaMensualConSegurosGs)} <small style="font-size:11px; color:#94a3b8; font-weight:500;">/ mes (c/ seg.)</small>
              </div>
              <div style="display:flex; justify-content:space-between; font-size:11px; color:#cbd5e1; border-top:1px solid rgba(255,255,255,0.08); padding-top:6px; margin-top:4px;">
                <span>Total en 15 años (180 cuotas):</span>
                <strong style="color:#fde68a;">${tramo.totalPagado15AniosLabel} (Gs. ${formatGs(tramo.totalPagado15AniosGs)})</strong>
              </div>
              <div style="display:flex; justify-content:space-between; font-size:11px; color:#cbd5e1; margin-top:2px;">
                <span>Costo financiero del crédito:</span>
                <strong style="color:#fca5a5;">${tramo.costoCreditoLabel} (Gs. ${formatGs(tramo.costoCreditoGs)})</strong>
              </div>
              <div style="display:flex; justify-content:space-between; font-size:10.5px; color:#94a3b8; margin-top:2px;">
                <span>Ref. cuota pura s/ seguro (9,9% / 6,5%):</span>
                <span>Gs. ${formatGs(tramo.cuotaPuraSinSeguro99Gs)} / Gs. ${formatGs(tramo.cuotaPuraSinSeguro65Gs)}</span>
              </div>
              <p style="font-size:10.5px; color:#a7f3d0; margin:6px 0 8px; line-height:1.4;">${tramo.alcanceObraResumen}</p>
              <button class="comp-load-btn btn-select-tramo-credito" data-tramo-millones="${tramo.creditoMillones}" style="width:100%; padding:6px; font-size:11px; font-weight:700; cursor:pointer;">
                Simular Tramo ${tramo.label} en Cómputo y 3D
              </button>
            </div>
          `
            )
            .join('')}
        </div>

        <!-- Resumen en Vivo por Código de Colores Normativo del Banco (⚫ Negro / 🟢 Verde / 🔴 Rojo / 🟡 Amarillo) + Materiales vs Mano de Obra -->
        <div style="background:rgba(15,23,42,0.85); border:1px solid rgba(245,158,11,0.4); border-radius:10px; padding:12px; margin-bottom:12px;">
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-bottom:8px;">
            <div>
              <strong style="color:#fde68a; font-size:13px;">🏦 Código de Colores Exigido por el Banco en Planilla y Planos + Desglose Materiales vs. Mano de Obra</strong>
              <p style="font-size:11px; color:#94a3b8; margin-top:2px;">"${REQUISITOS_BANCO_Y_CUOTAS.textoLiteralBanco}"</p>
            </div>
            <button id="btn-modal-toggle-bank-colors" class="btn-primary" style="padding:7px 12px; font-size:11px; border-radius:6px; cursor:pointer;">
              🎨 Pintar Modelo 3D y Plano 2D con Colores del Banco (⚫🟢🔴🟡)
            </button>
          </div>
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(175px, 1fr)); gap:8px;">
            <div style="background:rgba(30,41,59,0.9); border:1px solid #94a3b8; border-radius:8px; padding:8px;">
              <div style="font-size:10.5px; color:#cbd5e1; font-weight:700;">⚫ NEGRO (Lo Ya Construido)</div>
              <div style="font-size:14px; font-weight:800; color:#f8fafc; font-family:var(--font-mono); margin-top:2px;">Gs. 163.820.972</div>
              <small style="font-size:9.5px; color:#94a3b8;">Esqueleto H°A° + Murallas Perim. (Gs. 0) + Portón Balancín (Gs. 0)</small>
            </div>
            <div style="background:rgba(22,163,74,0.16); border:1px solid #22c55e; border-radius:8px; padding:8px;">
              <div style="font-size:10.5px; color:#86efac; font-weight:700;">🟢 VERDE (Hormigón H°A° Nuevo)</div>
              <div id="bank-sum-verde" style="font-size:14px; font-weight:800; color:#86efac; font-family:var(--font-mono); margin-top:2px;">Gs. 0</div>
              <small style="font-size:9.5px; color:#bbf7d0;">2da Losa +102.88m, Pilares PA y Viga Fundación</small>
            </div>
            <div style="background:rgba(220,38,38,0.16); border:1px solid #ef4444; border-radius:8px; padding:8px;">
              <div style="font-size:10.5px; color:#fca5a5; font-weight:700;">🔴 ROJO (Obra Nueva a Construir)</div>
              <div id="bank-sum-rojo" style="font-size:14px; font-weight:800; color:#fca5a5; font-family:var(--font-mono); margin-top:2px;">Gs. 0</div>
              <small style="font-size:9.5px; color:#fecaca;">Muros Tobatí, Techo, Pisos, Cocina, Baño, Alarma y Cloaca</small>
            </div>
            <div style="background:rgba(217,119,6,0.18); border:1px solid #f59e0b; border-radius:8px; padding:8px;">
              <div style="font-size:10.5px; color:#fde68a; font-weight:700;">🟡 AMARILLO (Refaccionar/Adecuar)</div>
              <div id="bank-sum-amarillo" style="font-size:14px; font-weight:800; color:#fde68a; font-family:var(--font-mono); margin-top:2px;">Gs. 0</div>
              <small style="font-size:9.5px; color:#fef08a;">Rehabilitación Losa 1 Expuesta al Sol + Medianera Eje 9</small>
            </div>
            <div style="background:rgba(59,130,246,0.14); border:1px solid #3b82f6; border-radius:8px; padding:8px;">
              <div style="font-size:10.5px; color:#93c5fd; font-weight:700;">🧱 Total Materiales vs. 👷 Mano de Obra</div>
              <div style="font-size:11.5px; font-weight:700; color:#f8fafc; font-family:var(--font-mono); margin-top:2px;">
                Mat: <span id="bank-sum-mat" style="color:#93c5fd;">Gs. 0</span>
              </div>
              <div style="font-size:11.5px; font-weight:700; color:#f8fafc; font-family:var(--font-mono);">
                M.O.: <span id="bank-sum-mo" style="color:#6ee7b7;">Gs. 0</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Desglose de los 5 Ajustes Clave de Obra de Leo + Tabla Comparativa de Tasas 6,5% vs 9,9% -->
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(340px, 1fr)); gap:10px;">
          <!-- Columna 1: Protocolo Losa 1 Expuesta + Sistema Cloacal Dual sin chocar con Piscina -->
          <div style="background:rgba(15,23,42,0.78); border:1px solid rgba(245,158,11,0.35); border-radius:8px; padding:10px;">
            <h4 style="color:#fde68a; font-size:12.5px; margin-bottom:6px;">
              ☀️ 1) Cuidado Previo Losa 1 Expuesta al Sol (🟡 Gs. ${formatGs(PROTOCOLO_CUIDADO_LOSA_EXPUESTA.totalGeneralGs)}) + 🚽 2) Pozo Ciego en Fondo (Ejes 8–9, libre de Piscina) y Bombeo a Calle (🔴 Gs. ${formatGs(SISTEMA_CLOACAL_DUAL_SUBSUELO.totalGeneralGs)})
            </h4>
            <ul style="font-size:10.5px; color:#cbd5e1; line-height:1.45; padding-left:16px; margin-bottom:8px;">
              ${PROTOCOLO_CUIDADO_LOSA_EXPUESTA.pasos
                .map((p) => `<li><strong>Paso ${p.paso} (Gs. ${formatGs(p.montoGs)}):</strong> ${p.tarea}</li>`)
                .join('')}
            </ul>
            <div style="border-top:1px solid rgba(255,255,255,0.08); padding-top:6px; font-size:10.5px; color:#a7f3d0;">
              <strong>🚽 Solución Cloacal Dual (${SISTEMA_CLOACAL_DUAL_SUBSUELO.ubicacionPlanta}):</strong>
              <ul style="padding-left:16px; margin-top:4px; color:#cbd5e1;">
                ${SISTEMA_CLOACAL_DUAL_SUBSUELO.componentes
                  .map(
                    (c) =>
                      `<li><strong>${c.sistema} (Gs. ${formatGs(c.subtotalGs)} = Mat. ${formatGs(c.materialesGs)} + M.O. ${formatGs(c.manoObraGs)}):</strong> ${c.detalle}</li>`
                  )
                  .join('')}
              </ul>
            </div>
          </div>

          <!-- Columna 2: Alarma Pet-Immune Asunción + Muralla 3m×2m + Vereda/Basurero + Motor Portón + Tabla 6,5% vs 9,9% -->
          <div style="background:rgba(15,23,42,0.78); border:1px solid rgba(56,189,248,0.35); border-radius:8px; padding:10px;">
            <h4 style="color:#67e8f9; font-size:12.5px; margin-bottom:6px;">
              🚨 3) Alarma Completa Pet-Immune en Asunción (🔴 Gs. ${formatGs(PRESUPUESTO_SISTEMA_ALARMA_ASUNCION.totalGeneralInstaladoGs)}) + 🧱 4) Ajustes de Frente y Perímetro
            </h4>
            <ul style="font-size:10.5px; color:#cbd5e1; line-height:1.45; padding-left:16px; margin-bottom:8px;">
              ${PRESUPUESTO_SISTEMA_ALARMA_ASUNCION.items
                .map((it) => `<li><strong>${it.cantidad} — Gs. ${formatGs(it.subtotalGs)}:</strong> ${it.componente}</li>`)
                .join('')}
              <li><strong>⚫ Murallas Perimetrales Ya Existen (Gs. 0):</strong> Solo se levanta <strong>3,00m × 2,00m = 6,00 m² (🔴 Gs. 1.350.000)</strong> en el costado abierto hacia la calle/vecino.</li>
              <li><strong>⚫ Portón Balancín Ya Instalado (Gs. 0):</strong> Solo se compra e instala el <strong>Motor Automatizador Rápido 1/2 HP + Fotocélula (🔴 Gs. 2.650.000)</strong>.</li>
              <li><strong>🔴 Vereda Reglamentaria (9,89m × 2,00m = 19,80 m², Gs. 3.450.000) + Canasto Basurero Elevado (Gs. 550.000) = Gs. 4.000.000.</strong></li>
            </ul>
            <div style="border-top:1px solid rgba(255,255,255,0.08); padding-top:6px; font-size:10.5px; color:#cbd5e1;">
              <strong style="color:#93c5fd;">📊 Tabla Oficial del Banco — Cuota Pura por cada Gs. 1.000.000:</strong>
              <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:4px; margin-top:4px; font-family:var(--font-mono); font-size:10px;">
                <div style="background:rgba(255,255,255,0.04); padding:4px; border-radius:4px;">15 años: <strong>6,5% = Gs. ${formatGs(t65.plazos[15].cuotaPorMillonGs)}</strong> | <strong>9,9% = Gs. ${formatGs(t99.plazos[15].cuotaPorMillonGs)}</strong></div>
                <div style="background:rgba(255,255,255,0.04); padding:4px; border-radius:4px;">20 años: <strong>6,5% = Gs. ${formatGs(t65.plazos[20].cuotaPorMillonGs)}</strong> | <strong>9,9% = Gs. ${formatGs(t99.plazos[20].cuotaPorMillonGs)}</strong></div>
                <div style="background:rgba(255,255,255,0.04); padding:4px; border-radius:4px;">30 años: <strong>6,5% = Gs. ${formatGs(t65.plazos[30].cuotaPorMillonGs)}</strong> | <strong>9,9% = Gs. ${formatGs(t99.plazos[30].cuotaPorMillonGs)}</strong></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Bind buttons for the 4 credit tiers
    host.querySelectorAll('.btn-select-tramo-credito').forEach((btn) => {
      btn.addEventListener('click', () => {
        const m = Number(btn.getAttribute('data-tramo-millones'));
        if (m === 250) {
          applyScenario('escenario300');
          customTargetOverrideGs = 250000000;
          recalculateBudget();
        } else if (m === 300) {
          applyScenario('escenario300');
        } else if (m === 350) {
          applyScenario('escenario350');
        } else if (m === 440) {
          applyScenario('escenario440');
        }
      });
    });

    const btnModalBankColors = document.getElementById('btn-modal-toggle-bank-colors');
    if (btnModalBankColors) {
      btnModalBankColors.addEventListener('click', () => {
        const nextState = !scene.bankColorMode;
        setGlobalBankColorMode(nextState);
        closeModal(document.getElementById('modal-simulador'));
      });
    }
  };

  // Render Roof Acoustic/Thermal Comparison & Tobatí Brick Calculator in #modal-insumos
  const renderTobatiAndRoofComparison = () => {
    const host = document.getElementById('tobati-bricks-roof-comparison-host');
    if (!host || !COMPARATIVA_TECHO_ACUSTICA_COSTOS || !CALCULADORA_LADRILLOS_TOBATI) return;

    host.innerHTML = `
      <div class="multi-budget-box" style="margin-bottom:14px; border:1px solid rgba(245,158,11,0.4);">
        <div class="multi-budget-header">
          <div>
            <h3 style="color:#fde68a; font-size:15px;">🏠 ${COMPARATIVA_TECHO_ACUSTICA_COSTOS.titulo}</h3>
            <p style="font-size:11.5px; color:#cbd5e1;">${COMPARATIVA_TECHO_ACUSTICA_COSTOS.conclusionEjecutiva}</p>
          </div>
          <button id="btn-insumos-toggle-roof-3d" class="btn-primary" style="padding:7px 12px; font-size:11px; border-radius:6px; cursor:pointer;">
            🏠 Alternar en 3D: Isopanel vs Tejas de Tobatí
          </button>
        </div>
        <div style="overflow-x:auto; margin-top:8px;">
          <table class="budget-table" style="font-size:11px;">
            <thead>
              <tr>
                <th>Opción de Cubierta (+105.64m • 86 m²)</th>
                <th>Ruido Interior Lluvia Torrencial</th>
                <th>Aislación Térmica</th>
                <th style="text-align:right;">Estructura</th>
                <th style="text-align:right;">Cubierta</th>
                <th style="text-align:right;">Total Techo</th>
              </tr>
            </thead>
            <tbody>
              ${COMPARATIVA_TECHO_ACUSTICA_COSTOS.opciones
                .map(
                  (op) => `
                <tr>
                  <td>
                    <strong style="color:#f8fafc;">${op.nombre}</strong>
                    <div style="font-size:10px; color:#94a3b8;">${op.recomendacion}</div>
                  </td>
                  <td style="font-family:var(--font-mono); color:#67e8f9; font-weight:700;">${op.ruidoLluviaIntensaDb} (${op.confortAcustico})</td>
                  <td>${op.aislacionTermica}</td>
                  <td style="text-align:right; font-family:var(--font-mono);">Gs. ${formatGs(op.costoEstructuraGs)}</td>
                  <td style="text-align:right; font-family:var(--font-mono);">Gs. ${formatGs(op.costoCubiertaGs + op.costoAdicionalAcusticoGs)}</td>
                  <td style="text-align:right; font-family:var(--font-mono); font-weight:800; color:#fde68a;">Gs. ${formatGs(op.costoTotalSistemaGs)}</td>
                </tr>
              `
                )
                .join('')}
            </tbody>
          </table>
        </div>
      </div>

      <div class="multi-budget-box" style="border:1px solid rgba(6,182,212,0.4);">
        <div class="multi-budget-header">
          <div>
            <h3 style="color:#67e8f9; font-size:15px;">🧱 ${CALCULADORA_LADRILLOS_TOBATI.titulo}</h3>
            <p style="font-size:11.5px; color:#cbd5e1;">${CALCULADORA_LADRILLOS_TOBATI.notaDesperdicio}</p>
          </div>
          <div style="display:flex; gap:6px; flex-wrap:wrap;">
            ${CALCULADORA_LADRILLOS_TOBATI.proveedoresDirectosTobati
              .map(
                (pr) => `
              <a href="${pr.whatsappUrl || pr.webUrl}" target="_blank" rel="noopener" class="badge-pill" style="text-decoration:none; border-color:#10b981; color:#6ee7b7; font-weight:700;">
                📲 ${pr.nombre.split('—')[0]} (${pr.contacto})
              </a>
            `
              )
              .join('')}
          </div>
        </div>
        <div style="overflow-x:auto; margin-top:8px;">
          <table class="budget-table" style="font-size:11px;">
            <thead>
              <tr>
                <th>Sector / Nivel de la Casa</th>
                <th>Espesor</th>
                <th>Área Neta</th>
                <th style="text-align:right;">Ladrillo Común 1ra (Gs. 550/u)</th>
                <th style="text-align:right;">Opción Hueco 6 Ag. (Gs. 1.280/u)</th>
                <th>Criterio Técnico</th>
              </tr>
            </thead>
            <tbody>
              ${CALCULADORA_LADRILLOS_TOBATI.computoPorSector
                .map(
                  (s) => `
                <tr>
                  <td><strong style="color:#fff;">${s.sector}</strong></td>
                  <td>${s.espesor}</td>
                  <td style="font-family:var(--font-mono);">${s.areaNetaM2} m²</td>
                  <td style="text-align:right; font-family:var(--font-mono); color:#fde68a;">
                    <strong>${formatGs(s.ladrillosComunesUn)} u.</strong> (Gs. ${formatGs(s.subtotalLadrillosComunGs)})
                  </td>
                  <td style="text-align:right; font-family:var(--font-mono); color:#93c5fd;">
                    ${s.ladrillosHuecos6AgUn > 0 ? `${formatGs(s.ladrillosHuecos6AgUn)} u. (Gs. ${formatGs(s.subtotalLadrillosHuecoGs)})` : 'No aplica (Macizo obligatorio)'}
                  </td>
                  <td style="font-size:10px; color:#cbd5e1;">${s.notaTecnica}</td>
                </tr>
              `
                )
                .join('')}
            </tbody>
          </table>
        </div>
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(300px, 1fr)); gap:10px; margin-top:10px;">
          ${CALCULADORA_LADRILLOS_TOBATI.alternativasCompraTotal
            .map(
              (alt) => `
            <div style="background:rgba(15,23,42,0.8); border:1px solid rgba(56,189,248,0.35); border-radius:8px; padding:10px;">
              <strong style="color:#67e8f9; font-size:12px;">${alt.titulo}</strong>
              <div style="font-size:11px; color:#fde68a; font-family:var(--font-mono); margin:4px 0;">
                Total Puesto en Obra: Gs. ${formatGs(alt.costoTotalPuestoEnObraGs)} (Fábrica: Gs. ${formatGs(alt.costoFabricaGs)} + Flete: Gs. ${formatGs(alt.costoFleteAsuncionGs)})
              </div>
              <div style="font-size:10.5px; color:#e2e8f0; margin-bottom:4px;">${alt.detalleUnidades}</div>
              <p style="font-size:10px; color:#94a3b8;">${alt.ventaja}</p>
            </div>
          `
            )
            .join('')}
        </div>
      </div>
    `;

    const btnRoof3D = document.getElementById('btn-insumos-toggle-roof-3d');
    if (btnRoof3D) {
      btnRoof3D.addEventListener('click', () => {
        const nextStyle = scene.roofStyle === 'tejas' ? 'isopanel' : 'tejas';
        scene.setRoofStyle(nextStyle);
        const headerBtn = document.getElementById('btn-toggle-roof-style');
        if (headerBtn) {
          headerBtn.setAttribute('data-roof-style', nextStyle);
          headerBtn.innerHTML = nextStyle === 'tejas'
            ? '<span>🏺 Techo 3D: Tejas Tobatí</span>'
            : '<span>🏠 Techo 3D: Isopanel vs Tejas</span>';
        }
        closeModal(document.getElementById('modal-insumos'));
        scene.setCameraView('losa2');
      });
    }
  };

  // Render 6-Card Multi-Budget Comparator & Full Edifica Studio Transcription
  const renderMultiBudgetComparator = () => {
    const grid = document.getElementById('comparador-multi-grid');
    if (grid && Array.isArray(COMPARADOR_MULTI_PRESUPUESTO)) {
      grid.innerHTML = '';
      COMPARADOR_MULTI_PRESUPUESTO.forEach((b) => {
        const card = document.createElement('div');
        card.className = 'comparador-budget-card';
        card.style.borderTop = `3px solid ${b.badgeColor || '#38bdf8'}`;
        card.innerHTML = `
          <div class="comp-card-top">
            <span class="comp-source-title" style="color:${b.badgeColor};">${b.fuente}</span>
            <strong class="comp-amount">Gs. ${formatGs(b.montoTotalGs)}</strong>
          </div>
          <div class="comp-prof">${b.profesional}</div>
          <div class="comp-status-badge">${b.estado}</div>
          <p class="comp-scope">${b.alcance}</p>
          <div class="comp-ia-note"><strong>🤖 Análisis IA:</strong> ${b.observacionIA}</div>
          <div class="comp-card-actions">
            <button class="comp-load-btn" data-comp-id="${b.id}">Usar como Meta / Ver en 3D y Tabla</button>
          </div>
        `;
        const btn = card.querySelector('.comp-load-btn');
        if (btn) {
          btn.addEventListener('click', () => {
            if (b.id === 'jivesa_acta_hoy') {
              customTargetOverrideGs = null;
              applyScenario('hoy_en_obra');
            } else if (b.id === 'jivesa_lgrb_etapa1') {
              customTargetOverrideGs = 300000000;
              applyScenario('escenario300');
            } else if (b.id === 'jivesa_completo_285m') {
              customTargetOverrideGs = 350000000;
              applyScenario('escenario350');
            } else if (b.id === 'edifica_opcion_b_460m') {
              customTargetOverrideGs = null;
              applyScenario('edifica460');
            } else if (b.id === 'edifica_opcion_a_573m') {
              customTargetOverrideGs = null;
              applyScenario('edifica573');
            } else {
              customTargetOverrideGs = null;
              applyScenario('escenario440');
            }
          });
        }
        grid.appendChild(card);
      });
    }

    const edificaContainer = document.getElementById('edifica-sections-container');
    if (edificaContainer && EDIFICA_STUDIO_BUDGETS?.secciones) {
      let html = '';
      EDIFICA_STUDIO_BUDGETS.secciones.forEach((sec) => {
        const diffSec = sec.subtotalOpcionBGs - sec.subtotalOpcionAGs;
        html += `
          <div class="edifica-sec-block">
            <div class="edifica-sec-header">
              <strong>${sec.titulo}</strong>
              <div style="display:flex; gap:12px; font-size:11px;">
                <span style="color:#93c5fd;">Opción A Completa: <strong>Gs. ${formatGs(sec.subtotalOpcionAGs)}</strong></span>
                <span style="color:#6ee7b7;">Opción B Reducida: <strong>Gs. ${formatGs(sec.subtotalOpcionBGs)}</strong></span>
                <span style="color:#fca5a5;">Dif.: <strong>${diffSec === 0 ? '0 Gs.' : `Gs. ${formatGs(diffSec)}`}</strong></span>
              </div>
            </div>
            <div style="overflow-x:auto;">
              <table class="edifica-subtable">
                <thead>
                  <tr>
                    <th style="width:45px;">Ítem</th>
                    <th>Rubro (Transcripción Textual Edifica Studio)</th>
                    <th style="width:110px;">Unid. / Cant. / P.U. (Orig.)</th>
                    <th style="text-align:right; width:145px;">Opción A (573.8M Gs)</th>
                    <th style="text-align:right; width:145px;">Opción B (460.1M Gs)</th>
                    <th>Observación / Etiqueta IA</th>
                  </tr>
                </thead>
                <tbody>
                  ${sec.items
                    .map(
                      (it) => `
                    <tr>
                      <td style="font-family:var(--font-mono); color:#93c5fd;">${it.nro}</td>
                      <td><strong>${it.rubro}</strong></td>
                      <td><span class="ia-field-chip">En blanco en orig.</span></td>
                      <td style="text-align:right; font-family:var(--font-mono); color:#f8fafc;">Gs. ${formatGs(it.opcionAGs)}</td>
                      <td style="text-align:right; font-family:var(--font-mono); color:${it.opcionBGs === 0 ? '#f87171' : '#6ee7b7'};">
                        ${it.opcionBGs === 0 ? 'Gs. 0 (Omitido)' : `Gs. ${formatGs(it.opcionBGs)}`}
                      </td>
                      <td style="font-size:10.5px; color:#cbd5e1;">${it.obs}</td>
                    </tr>
                  `
                    )
                    .join('')}
                </tbody>
              </table>
            </div>
          </div>
        `;
      });

      html += `
        <div class="edifica-totals-footer">
          <div>
            <strong>TOTAL GENERAL EDIFICA STUDIO — OPCIÓN A COMPLETA:</strong>
            <span style="color:#93c5fd; font-size:15px; font-weight:800; margin-left:6px;">Gs. ${formatGs(EDIFICA_STUDIO_BUDGETS.opcionACompletaTotalGs)}</span>
          </div>
          <div>
            <strong>TOTAL GENERAL EDIFICA STUDIO — OPCIÓN B REDUCIDA:</strong>
            <span style="color:#6ee7b7; font-size:15px; font-weight:800; margin-left:6px;">Gs. ${formatGs(EDIFICA_STUDIO_BUDGETS.opcionBReducidaTotalGs)}</span>
          </div>
          <div>
            <strong>RECORTE ENTRE OPCIÓN A Y B:</strong>
            <span style="color:#fde68a; font-size:14px; font-weight:800; margin-left:6px;">- Gs. ${formatGs(EDIFICA_STUDIO_BUDGETS.diferenciaAhorroOpcionBGs)}</span>
          </div>
        </div>
      `;
      edificaContainer.innerHTML = html;
    }

    const btnToggleEdifica = document.getElementById('btn-toggle-edifica-table');
    const panelEdifica = document.getElementById('edifica-full-transcription-panel');
    if (btnToggleEdifica && panelEdifica) {
      btnToggleEdifica.addEventListener('click', () => {
        const isHidden = panelEdifica.style.display === 'none';
        panelEdifica.style.display = isHidden ? 'block' : 'none';
        btnToggleEdifica.textContent = isHidden
          ? '🔼 Ocultar Planillas Íntegras Edifica Studio'
          : '📐 Ver Planillas Íntegras Edifica Studio (573.8M vs 460.1M Gs)';
      });
    }
  };

  // Render 10 Forensic Omissions Cards
  const renderForensicOmissions = () => {
    const grid = document.getElementById('omisiones-criticas-grid');
    if (!grid) return;
    grid.innerHTML = '';

    OMISIONES_CRITICAS_PRESUPUESTO.forEach((om) => {
      const hasLinkedPartida = Boolean(om.partidaVinculadaId);
      const isIncluded = hasLinkedPartida && selectedItemIds.has(om.partidaVinculadaId);
      const card = document.createElement('div');
      card.className = 'omision-card';
      const sevClass = om.severidad.includes('CRÍTICA') ? 'critica' : om.severidad.includes('ALTA') ? 'alta' : 'media';

      card.innerHTML = `
        <div class="omision-card-header">
          <span class="omision-num">#${om.numero}</span>
          <span class="omision-sev-badge ${sevClass}">${om.severidad}</span>
          <span class="omision-cost">Gs. ${formatGs(om.costoEstimadoGs)}</span>
        </div>
        <h4 class="omision-title">${om.titulo}</h4>
        <div class="omision-origin"><strong>Origen:</strong> ${om.origenDetectado}</div>
        <p class="omision-problem"><strong>Problema:</strong> ${om.problema}</p>
        <p class="omision-solution"><strong>Solución Técnica:</strong> ${om.solucionTecnica}</p>
        ${
          hasLinkedPartida
            ? `<div class="omision-card-footer">
                 <button class="omision-toggle-btn ${isIncluded ? 'included' : ''}" data-partida-id="${om.partidaVinculadaId}">
                   ${isIncluded ? '✓ Incluida en Cómputo' : '+ Incluir Partida'}
                 </button>
               </div>`
            : `<div class="omision-card-footer">
                 <span style="font-size:10px; color:#34d399; font-weight:600;">✓ Cubierta en rubros Hidrófugos / MEP del simulador</span>
               </div>`
        }
      `;

      const toggleBtn = card.querySelector('.omision-toggle-btn');
      if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
          const pid = om.partidaVinculadaId;
          if (selectedItemIds.has(pid)) {
            selectedItemIds.delete(pid);
          } else {
            selectedItemIds.add(pid);
          }
          recalculateBudget();
        });
      }

      grid.appendChild(card);
    });
  };

  // Render Interactive Editable Budget Table with Bank Color Code & Materiales vs Mano de Obra
  const renderBudgetTable = () => {
    if (!budgetTbody) return;
    budgetTbody.innerHTML = '';

    // 1. Prepend the 7 Existing Constructions in ⚫ NEGRO (Lo Ya Construido = Gs. 163.820.972 + Murallas Perimetrales Gs. 0 + Portón Balancín Gs. 0)
    if (activeComputoCategoryFilter === 'ALL' && (activeComputoOriginFilter === 'ALL' || activeComputoOriginFilter === 'PLANILLA_JIVESA_LGRB')) {
      const rubrosNegro = REQUISITOS_BANCO_Y_CUOTAS?.construccionesExistentesNegro?.rubros || [];
      rubrosNegro.forEach((rn) => {
        const trNegro = document.createElement('tr');
        trNegro.className = 'budget-row';
        trNegro.style.background = 'rgba(15, 23, 42, 0.88)';
        trNegro.style.borderLeft = '3px solid #94a3b8';
        trNegro.setAttribute('data-item-id', rn.codigo);
        trNegro.innerHTML = `
          <td style="text-align:center;">
            <span title="Construcción existente en obra (Código Negro Banco)">🔒</span>
          </td>
          <td>${getBankColorBadgeHtml('NEGRO')}</td>
          <td>
            <strong style="color:#e2e8f0; font-size:11.5px;">${rn.codigo} — ${rn.item}</strong>
            <div style="font-size:10px; color:#94a3b8; margin-top:2px;">Preexistencia certificada en obra (No se solicita financiar en el crédito nuevo)</div>
          </td>
          <td>
            <span class="badge-pill" style="border-color:#94a3b8; color:#cbd5e1; font-size:9.5px;">${rn.estado}</span>
          </td>
          <td style="font-family:var(--font-mono); font-size:11px; color:#cbd5e1;">${rn.cantidad} ${rn.unidad}</td>
          <td style="font-family:var(--font-mono); font-size:11px; color:#94a3b8;">Gs. ${formatGs(rn.montoGs)}</td>
          <td style="text-align:right; font-size:10px; color:#94a3b8;">Ya ejecutado en obra</td>
          <td style="text-align:right; font-family:var(--font-mono); font-size:11.5px; color:#94a3b8; font-weight:700;">
            ${rn.montoGs > 0 ? `Gs. ${formatGs(rn.montoGs)} (Pagado)` : 'Gs. 0 (Ya existe)'}
          </td>
        `;
        budgetTbody.appendChild(trNegro);
      });
    }

    // 2. Render all Editable Partidas (🟢 VERDE / 🔴 ROJO / 🟡 AMARILLO)
    editablePartidas.forEach((p) => {
      if (!matchesComputoCategory(p, activeComputoCategoryFilter)) return;
      if (!matchesComputoOrigin(p, activeComputoOriginFilter)) return;

      const isChecked = selectedItemIds.has(p.id);
      const isForense = p.id.startsWith('forense_');
      const isEdifica = p.origenTipo === 'EDIFICA_STUDIO';
      const bm = getPartidaBankMeta(p);
      const tr = document.createElement('tr');
      tr.className = `budget-row ${isChecked ? 'selected' : ''} ${isForense ? 'forense-highlight-row' : ''} ${isEdifica ? 'edifica-highlight-row' : ''}`;
      tr.setAttribute('data-item-id', p.id);

      const iaNotes = Array.isArray(p.camposEstimadosIA) ? p.camposEstimadosIA.join(' • ') : '';
      const hasIaEstimate =
        p.origenTipo === 'IA_AUDITORIA' ||
        p.origenTipo === 'EDIFICA_STUDIO' ||
        (iaNotes && !iaNotes.startsWith('Ninguno:'));

      tr.innerHTML = `
        <td style="text-align:center;">
          <input type="checkbox" class="budget-chk" ${isChecked ? 'checked' : ''}>
        </td>
        <td>
          ${getBankColorBadgeHtml(bm.colorBanco)}
        </td>
        <td>
          <div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap;">
            <strong style="color:${isForense ? '#fca5a5' : isEdifica ? '#93c5fd' : '#fff'}; font-size:12px;">${p.item}</strong>
            <span class="badge-pill" style="font-size:9.5px; margin:0;">${p.categoria}</span>
          </div>
          ${p.formulaDim ? `<div style="font-size:10px; color:#67e8f9; font-family:var(--font-mono); margin-top:2px;">📐 Dimensión: ${p.formulaDim}</div>` : ''}
          <p style="font-size:10.5px; color:var(--text-muted); margin-top:3px;">${p.desc}</p>
        </td>
        <td>
          <div style="display:flex; flex-direction:column; gap:4px;">
            ${getOriginBadgeHtml(p)}
            <div class="ia-field-detail ${hasIaEstimate ? 'ia-active' : ''}">
              <strong>Detalle:</strong> ${iaNotes || 'Datos directos de planilla'}
            </div>
          </div>
        </td>
        <td>
          <div style="display:flex; align-items:center; gap:4px;">
            <input type="number" step="0.1" min="0" class="computo-input-qty" value="${p.cantidadActual}" title="Editar metraje / cantidad">
            <span style="font-size:10px; color:#94a3b8;">${p.unidad}</span>
          </div>
        </td>
        <td>
          <input type="number" step="5000" min="0" class="computo-input-price" value="${p.precioUnitarioActualGs}" title="Editar precio unitario (Gs.)">
        </td>
        <td class="computo-mat-mo-cell" style="text-align:right; font-family:var(--font-mono);">
          <div style="font-size:10.5px; color:#93c5fd;">Mat (${bm.pctMateriales}%): Gs. ${formatGs(bm.materialesGs)}</div>
          <div style="font-size:10.5px; color:#6ee7b7;">M.O. (${bm.pctManoObra}%): Gs. ${formatGs(bm.manoObraGs)}</div>
        </td>
        <td class="computo-subtotal-cell">Gs. ${formatGs(p.subtotalActualGs)}</td>
      `;

      const chk = tr.querySelector('.budget-chk');
      chk.addEventListener('change', (e) => {
        if (e.target.checked) {
          selectedItemIds.add(p.id);
        } else {
          selectedItemIds.delete(p.id);
        }
        recalculateBudget();
      });

      const qtyInput = tr.querySelector('.computo-input-qty');
      qtyInput.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        p.cantidadActual = Number.isFinite(val) && val >= 0 ? val : 0;
        recalculateBudget();
      });

      const priceInput = tr.querySelector('.computo-input-price');
      priceInput.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        p.precioUnitarioActualGs = Number.isFinite(val) && val >= 0 ? val : 0;
        recalculateBudget();
      });

      budgetTbody.appendChild(tr);
    });

    recalculateBudget();
  };

  // =========================================================================
  // 5B. PANEL 1: 🛡️ CONTROL DEL PROPIETARIO Y NEGOCIACIÓN CON ARQUITECTO
  // =========================================================================
  let activeContractModeId = 'gestion_supervisada';

  const renderOwnerControlAndArchitectPanel = () => {
    const host = document.getElementById('owner-control-architect-host');
    if (!host || !CONTROL_PROPIETARIO_Y_NEGOCIACION_ARQUITECTO) return;

    const data = CONTROL_PROPIETARIO_Y_NEGOCIACION_ARQUITECTO;
    // Costo directo neto de referencia sobre Escenario 300M (Gs. 299.832.034 menos Gs. 18.500.000 Supervisión y Gs. 6.915.694 Imprevistos = Gs. 274.416.340)
    const baseDirectCostGs = 274416340;
    const opcion1TotalGs = 299832034; // + Gs. 18,5M (6,7%) + Gs. 6,9M Imprevistos
    const opcion2TotalGs = Math.round(baseDirectCostGs * 1.17); // +12% Admin + 5% Imprevistos = ~Gs. 321,1M
    const opcion3TotalGs = 352732034; // +22%-28% Llave en Mano = Gs. 352,7M (Ahorro Opción 1 vs Opción 3 = Gs. 52,9M)

    const reglasDeOro6 = [
      ...(data.clausulasNegociacionArquitecto || []),
      {
        nro: 5,
        titulo: 'Retención del 5% de Fondo de Reparo por Garantía Hidrófuga y Estructural (60 Días)',
        texto: 'De cada certificación quincenal de mano de obra se retiene un 5% como garantía de buena ejecución, que se libera a los 60 días de la entrega final tras verificar cero filtraciones de lluvia en techo Isopanel/Tejas, subsuelo y baños.'
      },
      {
        nro: 6,
        titulo: 'Prohibición de Adicionales sin Orden de Cambio Escrita y Cierre a Tope (Cap)',
        texto: 'Ningún rubro adicional ni modificación se abona si no cuenta con presupuesto previo desglosado (Materiales + Mano de Obra) autorizado por escrito por Leo antes de su ejecución.'
      }
    ];

    const hitosCertificacionQuincenal = [
      {
        hito: 'Hito 1 (20%)',
        quincena: 'Semanas 1 a 3',
        montoRef300M: 'Gs. 59.966.407',
        entregable: 'Protocolo Losa 1 (Hidrolavado + Sikadur-32 en 17 pilares), Muro Contención Cochera z=+1.50m c/ Pasillo Antihumedad 1,50m y Hormigonado 17 Pilares PA.'
      },
      {
        hito: 'Hito 2 (20%)',
        quincena: 'Semanas 4 a 6',
        montoRef300M: 'Gs. 59.966.407',
        entregable: 'Losa 2do Piso (+102.88m Losa Rap + Compresión HA-25), Vigas de Coronamiento y Cubierta Termoacústica (+105.64m) c/ Canaletas y Bajadas Pluviales Ø100mm.'
      },
      {
        hito: 'Hito 3 (20%)',
        quincena: 'Semanas 7 a 9',
        montoRef300M: 'Gs. 59.966.407',
        entregable: 'Mampostería Ladrillo Tobatí en los 3 Niveles + Tabiquería Durlock s/ P12-P13-P15 + 4 Pases Diamantados en Losa 1 + Plomería PPR Frío/Caliente (probada a 6 bar) + Cañería Eléctrica c/ Cable Neutro.'
      },
      {
        hito: 'Hito 4 (20%)',
        quincena: 'Semanas 10 a 12',
        montoRef300M: 'Gs. 59.966.407',
        entregable: 'Revoques Hidrófugos + Aislación Medianera Eje 9 + Cámara Séptica y Pozo Ciego en Fondo (Ejes 8–9) + Carpetas y Pisos Porcelanato Satinado R9-R10 + Escalera al 2do Piso.'
      },
      {
        hito: 'Hito 5 (20%)',
        quincena: 'Semanas 13 a 15',
        montoRef300M: 'Gs. 59.966.406',
        entregable: 'Cerramientos Blindex y Puertas + Tableros Smart DIN + 26 Tomas + Artefactos Sanitarios/Termocalefón + Pintura + Alarma Pet-Immune (Emma/Serafina) + Recepción Final.'
      }
    ];

    host.innerHTML = `
      <div class="multi-budget-box owner-control-panel" style="margin-bottom:16px; border:1px solid rgba(16,185,129,0.5); background:linear-gradient(180deg, rgba(6,78,59,0.20) 0%, rgba(15,23,42,0.90) 100%);">
        <div class="multi-budget-header" style="margin-bottom:10px;">
          <div>
            <h3 style="color:#6ee7b7; font-size:16px; display:flex; align-items:center; gap:8px;">
              🛡️ ${data.titulo}
            </h3>
            <p style="font-size:11.5px; color:#cbd5e1; margin-top:2px;">
              Comparativa financiera y contractual entre <strong>Opción 1: Gestión Supervisada por Leo (6%–8% = Gs. 18,5M + Imprevistos Gs. 6,9M, ahorrando Gs. 52,9M frente a Llave en Mano)</strong>, <strong>Opción 2: Administración Delegada Open-Book (10%–12%)</strong> y <strong>Opción 3: Llave en Mano (+22%–28% de sobrecosto)</strong>.
            </p>
          </div>
          <span class="badge-pill" style="border-color:#10b981; color:#6ee7b7; font-weight:800; font-size:11px;">
            💰 Ahorro Directo Opción 1 vs. Llave en Mano: Gs. 52.900.000
          </span>
        </div>

        <!-- Diagnóstico Forense de por qué el presupuesto referencial de Edifica Studio parecía tan caro -->
        <div style="background:rgba(15,23,42,0.82); border:1px solid rgba(56,189,248,0.35); border-radius:8px; padding:10px 12px; margin-bottom:12px;">
          <strong style="color:#7dd3fc; font-size:12px; display:block; margin-bottom:5px;">
            🔍 ¿Por qué el presupuesto referencial de Edifica Studio (Gs. 460,1M / 573,9M) era tan caro y solo cubría 1 nivel?
          </strong>
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(260px, 1fr)); gap:8px;">
            ${(data.diagnosticoPorQueEdificaEraTanCaro || [])
              .map(
                (diag) => `
              <div style="font-size:10.5px; color:#e2e8f0; background:rgba(30,41,59,0.65); padding:7px 9px; border-radius:6px; border-left:3px solid #38bdf8; line-height:1.4;">
                ${diag}
              </div>
            `
              )
              .join('')}
          </div>
        </div>

        <!-- 3 Tarjetas Interactivas de Modalidad de Contratación -->
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(300px, 1fr)); gap:10px; margin-bottom:12px;">
          ${(data.modalidadesContratacion || [])
            .map((mod, idx) => {
              const isSelected = mod.id === activeContractModeId;
              const estTotal = idx === 0 ? opcion1TotalGs : idx === 1 ? opcion2TotalGs : opcion3TotalGs;
              const diffVsOp1 = estTotal - opcion1TotalGs;
              const feeSummary =
                idx === 0
                  ? 'Honorario 6%–8% (Gs. 18,5M) + Imprevistos Gs. 6,9M • Ahorra Gs. 52,9M'
                  : idx === 1
                    ? 'Honorario 10%–12% (~Gs. 32,9M) + Imprevistos 5% (~Gs. 13,7M)'
                    : 'Sobrecosto +22%–28% (+Gs. 78,3M s/ costo directo)';
              return `
                <div class="comparador-budget-card contract-mode-card ${isSelected ? 'selected' : ''}" data-contract-mode="${mod.id}" style="border-top:3px solid ${mod.color}; border-color:${isSelected ? mod.color : 'rgba(255,255,255,0.12)'}; background:${isSelected ? 'rgba(16,185,129,0.13)' : 'rgba(15,23,42,0.82)'}; cursor:pointer;">
                  <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:6px;">
                    <strong style="color:${mod.color}; font-size:12.5px; line-height:1.3;">${mod.nombre}</strong>
                    <span class="badge-pill" style="border-color:${mod.color}; color:${mod.color}; font-size:9px; margin:0; white-space:nowrap;">${mod.badge}</span>
                  </div>
                  <div style="font-family:var(--font-mono); font-size:16px; font-weight:800; color:#fff; margin:4px 0 2px;">
                    Gs. ${formatGs(estTotal)}
                    <small style="font-size:10px; color:${diffVsOp1 === 0 ? '#6ee7b7' : '#fca5a5'}; font-weight:700;">
                      ${diffVsOp1 === 0 ? '(Meta 300M • Ahorra Gs. 52,9M)' : `(+Gs. ${formatGs(diffVsOp1)} vs Opción 1)`}
                    </small>
                  </div>
                  <div style="font-size:10.5px; color:#fde68a; font-weight:700; margin-bottom:4px;">${feeSummary}</div>
                  <p style="font-size:10.5px; color:#cbd5e1; line-height:1.4; margin-bottom:6px;">${mod.descripcion}</p>
                  <div style="font-size:10px; color:#a7f3d0; margin-bottom:4px;">
                    ${(mod.ventajas || []).map((v) => `<div>✓ ${v}</div>`).join('')}
                  </div>
                  <div style="font-size:10px; color:#fcd34d; margin-top:auto; padding-top:4px; border-top:1px solid rgba(255,255,255,0.08);">
                    ${(mod.cuidados || []).map((c) => `<div>⚠️ ${c}</div>`).join('')}
                  </div>
                </div>
              `;
            })
            .join('')}
        </div>

        <!-- 6 Reglas de Oro + 5 Hitos de Certificación Quincenal (20% c/u) -->
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(380px, 1fr)); gap:12px;">
          <!-- 6 Reglas de Oro -->
          <div style="background:rgba(15,23,42,0.82); border:1px solid rgba(245,158,11,0.38); border-radius:8px; padding:10px 12px;">
            <h4 style="color:#fde68a; font-size:12.5px; margin-bottom:8px;">
              📜 Las 6 Reglas de Oro para el Contrato con el Arquitecto / Director de Obra
            </h4>
            <div style="display:grid; grid-template-columns:1fr; gap:6px;">
              ${reglasDeOro6
                .map(
                  (r) => `
                <div style="background:rgba(30,41,59,0.65); border-left:3px solid #f59e0b; padding:6px 9px; border-radius:5px;">
                  <strong style="color:#f8fafc; font-size:11px;">#${r.nro}. ${r.titulo}:</strong>
                  <div style="font-size:10.5px; color:#cbd5e1; line-height:1.38; margin-top:1px;">${r.texto}</div>
                </div>
              `
                )
                .join('')}
            </div>
          </div>

          <!-- 5 Hitos de Certificación Quincenal (20% c/u) -->
          <div style="background:rgba(15,23,42,0.82); border:1px solid rgba(16,185,129,0.38); border-radius:8px; padding:10px 12px;">
            <h4 style="color:#6ee7b7; font-size:12.5px; margin-bottom:8px;">
              📅 Cronograma de 5 Hitos de Certificación Quincenal (20% c/u sobre Avance Medido)
            </h4>
            <div style="overflow-x:auto;">
              <table class="budget-table" style="font-size:10.5px;">
                <thead>
                  <tr>
                    <th style="width:85px;">Hito (20%)</th>
                    <th style="width:95px;">Plazo</th>
                    <th style="width:110px; text-align:right;">Desembolso 300M</th>
                    <th>Entregable Técnico Verificable para Liberar Pago</th>
                  </tr>
                </thead>
                <tbody>
                  ${hitosCertificacionQuincenal
                    .map(
                      (h) => `
                    <tr>
                      <td><strong style="color:#6ee7b7;">${h.hito}</strong></td>
                      <td style="font-family:var(--font-mono); color:#93c5fd;">${h.quincena}</td>
                      <td style="text-align:right; font-family:var(--font-mono); color:#fde68a; font-weight:700;">${h.montoRef300M}</td>
                      <td style="color:#e2e8f0; line-height:1.35;">${h.entregable}</td>
                    </tr>
                  `
                    )
                    .join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    `;

    host.querySelectorAll('.contract-mode-card').forEach((card) => {
      card.addEventListener('click', () => {
        activeContractModeId = card.getAttribute('data-contract-mode') || 'gestion_supervisada';
        renderOwnerControlAndArchitectPanel();
      });
    });
  };

  // =========================================================================
  // 5C. PANEL 2: 📦⚡ EVALUACIÓN DE COMPRA DIRECTA EN CHINA (TABLERO DIN + ZIGBEE + PREVENCIÓN ACTIVA)
  // =========================================================================
  let selectedChinaKitId = 'kit_avanzado_prevencion_activa';

  const renderChinaSmartElectricalPanel = () => {
    const host = document.getElementById('china-smart-electrical-host');
    if (!host || !ESTRATEGIA_COMPRA_CHINA_DOMOTICA_ELECTRICA) return;

    const data = ESTRATEGIA_COMPRA_CHINA_DOMOTICA_ELECTRICA;
    const kits = data.comparativaLotesChinaVsLocal || [];
    const activeKit = kits.find((k) => k.id === selectedChinaKitId) || kits[0];

    const prevencionActivaRows = [
      {
        amenaza: '⚡ Baja Tensión Severa (<185V) o Sobretensión (>252V) de ANDE en Verano',
        sensorEquipo: '3 Protectores Digitales Riel DIN 63A (Fases R-S-T) + Medidor Trifásico CT 80A (MatSee Plus / Tongou)',
        accionAutomatica: 'Corta la fase inestable en 0,1 segundos antes de que se queme el compresor de la Heladera, los 3 Aires Split o la placa del Portón, y reconecta automáticamente cuando la tensión vuelve a 220V ±5%.',
        redLocal: '100% Autónomo en Tablero + Alerta LAN/Zigbee'
      },
      {
        amenaza: '🔥 Falso Contacto o Recalentamiento de Bornes (>70°C) en Tablero Eléctrico',
        sensorEquipo: '6 Disyuntores Inteligentes Riel DIN con Sensor Térmico NTC Interno (Tongou / Sonoff)',
        accionAutomatica: 'Monitorea en vivo la temperatura de cada llave (Termocalefón 80L, Cocina 20A, Aires Split). Si supera 70°C envía alerta preventiva al celular y a los 85°C abre el circuito evitando incendio eléctrico.',
        redLocal: 'Telemetría Zigbee 3.0 / LAN Local'
      },
      {
        amenaza: '💧 Rotura de Flexible de Agua de Noche o Pérdida Silenciosa en Cisterna Subsuelo',
        sensorEquipo: '4 Sensores de Inundación Zigbee + Medidor de Amperaje en Llave DIN de Bomba Presurizadora',
        accionAutomatica: 'Ante la primera gota en piso de Cocina/Baño o si la Bomba Presurizadora arranca repetidamente de madrugada, corta automáticamente la alimentación de la bomba en el tablero DIN.',
        redLocal: 'Automatización Directa Coordinador PoE SLZB-06'
      },
      {
        amenaza: '🛡️ Fuga Progresiva a Tierra (10 a 25 mA) o Pérdida de Gas GLP en Cocina/Escalera',
        sensorEquipo: 'Disyuntores DIN con Amperímetro de Fuga (mA) + Detector GLP y 2 Detectores de Humo Zigbee',
        accionAutomatica: 'Advierte fugas de corriente de 15 mA (resistencia de termocalefón envejecida o humedad exterior) antes de que salte el diferencial de 30 mA y dispara sirena local + alerta celular ante gas GLP.',
        redLocal: 'Red Interna LAN / PoE (Sin depender de Internet)'
      }
    ];

    host.innerHTML = `
      <div class="multi-budget-box china-smart-panel" style="margin-bottom:16px; border:1px solid rgba(168,85,247,0.5); background:linear-gradient(180deg, rgba(88,28,135,0.22) 0%, rgba(15,23,42,0.92) 100%);">
        <div class="multi-budget-header" style="margin-bottom:10px;">
          <div>
            <h3 style="color:#e9d5ff; font-size:16px; display:flex; align-items:center; gap:8px;">
              📦⚡ ${data.titulo}
            </h3>
            <p style="font-size:11.5px; color:#cbd5e1; margin-top:2px;">
              ${data.resumenEjecutivo}
            </p>
          </div>
          <div style="display:flex; gap:8px; flex-wrap:wrap;">
            <button id="btn-apply-china-kit-computo" class="btn-primary" style="padding:7px 12px; font-size:11px; border-radius:6px; cursor:pointer; background:linear-gradient(135deg, #9333ea, #7e22ce); border-color:#d8b4fe; font-weight:700;">
              ⚡ Aplicar ${activeKit?.id === 'kit_basico_tablero_interruptores' ? 'Kit 1 Básico (Gs. 2.365.000)' : 'Kit 2 Prevención Total (Gs. 3.885.000)'} al Cómputo
            </button>
          </div>
        </div>

        <!-- Comparativa Interactiva: Kit 1 Básico (Gs. 2.365.000 vs Gs. 5.480.000 local) vs Kit 2 Prevención Activa Total (Gs. 3.885.000 vs Gs. 9.250.000 local) -->
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(380px, 1fr)); gap:12px; margin-bottom:12px;">
          ${kits
            .map((k) => {
              const isAct = k.id === activeKit?.id;
              return `
                <div class="comparador-budget-card china-kit-card ${isAct ? 'selected' : ''}" data-china-kit="${k.id}" style="border-top:3px solid ${isAct ? '#c084fc' : '#38bdf8'}; border-color:${isAct ? '#c084fc' : 'rgba(255,255,255,0.12)'}; background:${isAct ? 'rgba(168,85,247,0.16)' : 'rgba(15,23,42,0.82)'}; cursor:pointer;">
                  <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:8px;">
                    <strong style="color:${isAct ? '#e9d5ff' : '#93c5fd'}; font-size:13px;">${k.nombre}</strong>
                    <span class="badge-pill" style="border-color:#10b981; color:#6ee7b7; font-weight:800; font-size:9.5px; margin:0; white-space:nowrap;">
                      Ahorra Gs. ${formatGs(k.ahorroNetoGs)}
                    </span>
                  </div>
                  <div style="display:flex; align-items:baseline; gap:10px; margin:6px 0 4px; flex-wrap:wrap;">
                    <span style="font-family:var(--font-mono); font-size:18px; font-weight:800; color:#fff;">
                      China Puesto ASÚ: Gs. ${formatGs(k.costoTotalPuestoAsuncionGs)}
                    </span>
                    <span style="font-family:var(--font-mono); font-size:12px; color:#fca5a5; text-decoration:line-through;">
                      Local en Asunción: Gs. ${formatGs(k.costoEquivalenteEnAsuncionGs)}
                    </span>
                  </div>
                  <div style="font-size:10.5px; color:#fde68a; font-family:var(--font-mono); margin-bottom:4px;">
                    ✈️ Peso lote: ${k.pesoEstimadoKg} kg • FOB Shenzhen: USD ${k.costoFobChinaUsd} + Courier Aéreo ASÚ: USD ${k.costoCourierAsuncionUsd}
                  </div>
                  <p style="font-size:10.5px; color:#cbd5e1; margin-bottom:6px;">${k.enfoque}</p>
                  <div style="font-size:10px; color:#67e8f9; background:rgba(6,182,212,0.1); padding:5px 8px; border-radius:5px; border:1px solid rgba(6,182,212,0.28);">
                    🌐 <strong>Protocolo Red Local:</strong> ${k.protocoloRedInterna}
                  </div>
                </div>
              `;
            })
            .join('')}
        </div>

        <!-- Tabla de Componentes del Kit Seleccionado (Tongou / MatSee Plus / Sonoff / Aqara / SMLight SLZB-06) -->
        <div style="background:rgba(15,23,42,0.86); border:1px solid rgba(168,85,247,0.35); border-radius:8px; padding:10px 12px; margin-bottom:12px;">
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-bottom:8px;">
            <strong style="color:#e9d5ff; font-size:12.5px;">
              📋 Desglose de Componentes — ${activeKit?.nombre || ''} (Tongou / MatSee Plus / Sonoff / Aqara)
            </strong>
            <span style="font-size:11px; color:#6ee7b7; font-family:var(--font-mono); font-weight:700;">
              Total Puesto en Asunción: Gs. ${formatGs(activeKit?.costoTotalPuestoAsuncionGs)} vs. Local Gs. ${formatGs(activeKit?.costoEquivalenteEnAsuncionGs)}
            </span>
          </div>
          <div style="overflow-x:auto;">
            <table class="budget-table" style="font-size:11px;">
              <thead>
                <tr>
                  <th>Componente / Marca de Referencia (Shenzhen Directo)</th>
                  <th style="width:70px;">Cant.</th>
                  <th style="text-align:right; width:130px;">Costo China (Gs.)</th>
                  <th style="text-align:right; width:130px;">Precio Local (Gs.)</th>
                  <th style="text-align:right; width:120px;">Ahorro (Gs.)</th>
                  <th>Función de Monitoreo y Prevención Activa</th>
                </tr>
              </thead>
              <tbody>
                ${(activeKit?.componentes || [])
                  .map(
                    (c) => `
                  <tr>
                    <td><strong style="color:#fff;">${c.item}</strong></td>
                    <td style="font-family:var(--font-mono); color:#93c5fd;">${c.cant}</td>
                    <td style="text-align:right; font-family:var(--font-mono); color:#6ee7b7; font-weight:700;">Gs. ${formatGs(c.costoChinaGs)}</td>
                    <td style="text-align:right; font-family:var(--font-mono); color:#fca5a5;">Gs. ${formatGs(c.precioLocalGs)}</td>
                    <td style="text-align:right; font-family:var(--font-mono); color:#fde68a; font-weight:700;">- Gs. ${formatGs(c.precioLocalGs - c.costoChinaGs)}</td>
                    <td style="font-size:10.5px; color:#cbd5e1; line-height:1.38;">${c.funcionPreventiva}</td>
                  </tr>
                `
                  )
                  .join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Las 4 Reglas de Obra de Cero sin Costo Extra + Tabla de Prevención Activa de Fallas en Red Local LAN/PoE -->
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(380px, 1fr)); gap:12px;">
          <!-- 4 Reglas de Obra de Cero -->
          <div style="background:rgba(15,23,42,0.84); border:1px solid rgba(56,189,248,0.38); border-radius:8px; padding:10px 12px;">
            <h4 style="color:#67e8f9; font-size:12.5px; margin-bottom:8px;">
              🛠️ Las 4 Reglas de Obra de Cero sin Costo Extra (Exigir al Electricista ANDE antes de Revocar)
            </h4>
            <div style="display:grid; grid-template-columns:1fr; gap:6px;">
              ${(data.requisitosObraDeCeroSinCostoExtra || [])
                .map(
                  (req) => `
                <div style="background:rgba(30,41,59,0.68); border-left:3px solid #06b6d4; padding:7px 9px; border-radius:5px;">
                  <strong style="color:#f8fafc; font-size:11px;">Regla #${req.nro}: ${req.regla}</strong>
                  <div style="font-size:10.5px; color:#cbd5e1; line-height:1.38; margin-top:2px;">${req.explicacion}</div>
                </div>
              `
                )
                .join('')}
            </div>
          </div>

          <!-- Tabla de Prevención Activa de Fallas en Red Local LAN/PoE -->
          <div style="background:rgba(15,23,42,0.84); border:1px solid rgba(16,185,129,0.38); border-radius:8px; padding:10px 12px;">
            <h4 style="color:#6ee7b7; font-size:12.5px; margin-bottom:8px;">
              🛡️ Prevención Activa de Fallas en Red Local LAN / PoE (Actuación en &lt; 0,1s sin Internet)
            </h4>
            <div style="overflow-x:auto;">
              <table class="budget-table" style="font-size:10.5px;">
                <thead>
                  <tr>
                    <th>Falla / Riesgo Detectado</th>
                    <th>Equipo DIN / Sensor</th>
                    <th>Acción Preventiva Automática</th>
                  </tr>
                </thead>
                <tbody>
                  ${prevencionActivaRows
                    .map(
                      (r) => `
                    <tr>
                      <td><strong style="color:#fde68a;">${r.amenaza}</strong><div style="font-size:9.5px; color:#67e8f9; margin-top:2px;">${r.redLocal}</div></td>
                      <td style="color:#e2e8f0;">${r.sensorEquipo}</td>
                      <td style="color:#a7f3d0; line-height:1.35;">${r.accionAutomatica}</td>
                    </tr>
                  `
                    )
                    .join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    `;

    host.querySelectorAll('.china-kit-card').forEach((card) => {
      card.addEventListener('click', () => {
        selectedChinaKitId = card.getAttribute('data-china-kit') || 'kit_avanzado_prevencion_activa';
        renderChinaSmartElectricalPanel();
      });
    });

    const btnApplyChina = document.getElementById('btn-apply-china-kit-computo');
    if (btnApplyChina && activeKit) {
      btnApplyChina.addEventListener('click', () => {
        const domoticaPartida = editablePartidas.find((p) => p.id === 'debil_domotica_luces');
        if (domoticaPartida) {
          domoticaPartida.cantidadActual = 1;
          domoticaPartida.precioUnitarioActualGs = activeKit.costoTotalPuestoAsuncionGs;
          domoticaPartida.subtotalActualGs = activeKit.costoTotalPuestoAsuncionGs;
          selectedItemIds.add('debil_domotica_luces');
          renderBudgetTable();
          recalculateBudget();
        }
      });
    }
  };

  // =========================================================================
  // 5D. PANEL 3: 👷‍♂️🔍 AUDITORÍA DE 6 ESPECIALISTAS + TABLA DE PASES DIAMANTADOS EN LOSA 1
  // =========================================================================
  let activeSpecialistFilterId = 'ALL';

  const buildSpecialistsAndDuctsHtml = (suffix = 'sim') => {
    const specialists = AUDITORIA_SEIS_ESPECIALISTAS || [];
    const ductosData = DUCTOS_PASES_ENCHUFES_DATOS || {};
    const pases = ductosData.pasesLosa1Diamantados || [];
    const tableros = ductosData.tablerosYEquiposPrincipales || [];
    const tomas = ductosData.enchufesYTomacorrientes || [];
    const llaves3w = ductosData.llavesYConmutadas3Way || [];

    const filteredSpecs =
      activeSpecialistFilterId === 'ALL'
        ? specialists
        : specialists.filter((s) => s.id === activeSpecialistFilterId);

    const tomas20ACount = tomas.filter((t) => t.tipo === 'toma_20a').length;
    const tomas16ACount = tomas.filter((t) => t.tipo === 'toma_16a').length;

    return `
      <div class="multi-budget-box specialists-audit-panel" style="margin-bottom:16px; border:1px solid rgba(6,182,212,0.5); background:linear-gradient(180deg, rgba(8,51,68,0.25) 0%, rgba(15,23,42,0.92) 100%);">
        <div class="multi-budget-header" style="margin-bottom:10px;">
          <div>
            <h3 style="color:#67e8f9; font-size:16px; display:flex; align-items:center; gap:8px;">
              👷‍♂️🔍 Auditoría Multidisciplinaria de 6 Especialistas + Ingeniería de 4 Pases Diamantados en Losa 1 Existente
            </h3>
            <p style="font-size:11.5px; color:#cbd5e1; margin-top:2px;">
              Revisión técnica integral sin dejar huecos: <strong>Ingeniero Civil, Arquitecta de Interior, Arquitecto de Exterior, Técnico de Seguridad, Ingeniero Electricista ANDE y Maestro Plomero ESSAP</strong> + Coordenadas exactas 3D/2D de los 4 pases en Losa 1, 6 Tableros/Equipos, ${tomas.length} Tomacorrientes (${tomas20ACount} de 20A + ${tomas16ACount} de 16A) y ${llaves3w.length} Llaves 3-Way.
            </p>
          </div>
          <div style="display:flex; gap:8px; flex-wrap:wrap;">
            <button class="btn-primary btn-focus-ductos-3d" data-source-modal="${suffix}" style="padding:8px 14px; font-size:11.5px; border-radius:7px; cursor:pointer; font-weight:700; display:inline-flex; align-items:center; gap:6px;">
              <span>🔌🚰 Enfocar los 4 Pases de Losa y Ductos en el Visor 3D</span>
            </button>
          </div>
        </div>

        <!-- Filtros por Especialista -->
        <div class="computo-filters" style="margin-bottom:12px;">
          <button class="computo-filter-btn spec-filter-btn ${activeSpecialistFilterId === 'ALL' ? 'active' : ''}" data-spec-id="ALL">
            Todos los 6 Especialistas (17 Huecos Cerrados)
          </button>
          ${specialists
            .map(
              (s) => `
            <button class="computo-filter-btn spec-filter-btn ${activeSpecialistFilterId === s.id ? 'active' : ''}" data-spec-id="${s.id}">
              ${s.icono} ${s.especialidad.split('(')[0].trim()}
            </button>
          `
            )
            .join('')}
        </div>

        <!-- Tarjetas Interactivas de los 6 Especialistas -->
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(370px, 1fr)); gap:12px; margin-bottom:14px;">
          ${filteredSpecs
            .map(
              (sp) => `
            <div class="comparador-budget-card specialist-card" style="border-top:3px solid #06b6d4; background:rgba(15,23,42,0.86); padding:12px;">
              <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:8px;">
                <div>
                  <strong style="color:#67e8f9; font-size:13px;">${sp.icono} ${sp.especialidad}</strong>
                  <div style="font-size:10.5px; color:#94a3b8; margin-top:1px;">${sp.profesionalRol}</div>
                </div>
                <span class="badge-pill" style="border-color:#10b981; color:#6ee7b7; font-size:9.5px; font-weight:800; margin:0; white-space:nowrap;">
                  ✓ ${sp.calificacionActual}
                </span>
              </div>
              <p style="font-size:10.5px; color:#e2e8f0; line-height:1.42; margin:6px 0;">${sp.resumenDictamen}</p>

              <div style="display:flex; flex-direction:column; gap:6px; margin-bottom:8px;">
                ${(sp.huecosDetectadosYSoluciones || [])
                  .map(
                    (h) => `
                  <div style="background:rgba(30,41,59,0.72); border:1px solid rgba(255,255,255,0.08); border-left:3px solid ${h.subtotalGs === 0 ? '#10b981' : '#f59e0b'}; border-radius:6px; padding:7px 9px;">
                    <div style="display:flex; justify-content:space-between; align-items:center; gap:6px; flex-wrap:wrap; margin-bottom:3px;">
                      <span style="font-size:9.5px; font-weight:800; color:#fde68a; background:rgba(245,158,11,0.18); padding:1px 6px; border-radius:4px;">${h.severidad}</span>
                      <span style="font-family:var(--font-mono); font-size:10.5px; font-weight:700; color:${h.subtotalGs === 0 ? '#6ee7b7' : '#fff'};">
                        ${h.subtotalGs === 0 ? 'Gs. 0 (Resuelto en Diseño 3D)' : `Total: Gs. ${formatGs(h.subtotalGs)} (Mat: ${formatGs(h.costoMaterialesGs)} + M.O.: ${formatGs(h.costoManoObraGs)})`}
                      </span>
                    </div>
                    <strong style="color:#f8fafc; font-size:11px; display:block; margin-bottom:2px;">• ${h.hallazgo}</strong>
                    <div style="font-size:10px; color:#cbd5e1; line-height:1.38;">${h.solucion}</div>
                    <div style="font-size:9.5px; color:#93c5fd; margin-top:3px; font-family:var(--font-mono);">🔗 Vinculado a: ${h.incluidoEnPartida}</div>
                  </div>
                `
                  )
                  .join('')}
              </div>

              <div style="background:rgba(6,182,212,0.08); border:1px solid rgba(6,182,212,0.25); border-radius:6px; padding:7px 9px; margin-top:auto;">
                <strong style="color:#67e8f9; font-size:10.5px; display:block; margin-bottom:3px;">📋 Checklist de Control de Obra para Leo:</strong>
                <ul style="padding-left:15px; font-size:10px; color:#cbd5e1; line-height:1.4; margin:0;">
                  ${(sp.checklistControlPropietario || []).map((chk) => `<li>${chk}</li>`).join('')}
                </ul>
              </div>
            </div>
          `
            )
            .join('')}
        </div>

        <!-- Tabla de los 4 Pases Diamantados en Losa 1 Existente (DUCTOS_PASES_ENCHUFES_DATOS) -->
        <div style="background:rgba(15,23,42,0.88); border:1px solid rgba(249,115,22,0.45); border-radius:8px; padding:10px 12px; margin-bottom:12px;">
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-bottom:6px;">
            <div>
              <strong style="color:#fdba74; font-size:13px;">
                🕳️💎 Tabla de los 4 Pases con Sacabocado de Copa Diamantada en Losa 1 Existente (+100.00m • Sin Picar Vigas ni Viguetas)
              </strong>
              <p style="font-size:10.5px; color:#cbd5e1; margin-top:2px;">${ductosData.resumenTecnico || ''}</p>
            </div>
            <button class="btn-header btn-primary btn-focus-ductos-3d" data-source-modal="${suffix}" style="font-size:11px; padding:6px 12px;">
              <span>🔍 Ver Pases #1 a #4 en Modelo 3D</span>
            </button>
          </div>
          <div style="overflow-x:auto;">
            <table class="budget-table" style="font-size:11px;">
              <thead>
                <tr>
                  <th style="width:120px;">Código / Ø Copa</th>
                  <th style="width:210px;">Ubicación Exacta en Grilla (3D/2D)</th>
                  <th>Función y Conductores / Cañerías que Pasan</th>
                  <th>Método de Ejecución y Sellado</th>
                </tr>
              </thead>
              <tbody>
                ${pases
                  .map(
                    (p) => `
                  <tr>
                    <td>
                      <strong style="color:#fdba74; font-family:var(--font-mono);">${p.codigo}</strong>
                      <div style="font-size:9.5px; color:#94a3b8;">Coord 3D: [${p.pos3D.join(', ')}]</div>
                    </td>
                    <td><strong style="color:#f8fafc;">${p.ejeRef}</strong><div style="font-size:10px; color:#67e8f9;">${p.nombre}</div></td>
                    <td style="color:#e2e8f0; line-height:1.38;">${p.conductores}</td>
                    <td style="color:#a7f3d0; font-size:10.5px; line-height:1.38;">${p.metodoEjecucion}</td>
                  </tr>
                `
                  )
                  .join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Resumen de los 6 Tableros/Equipos Principales y los 26 Tomacorrientes (20A Rojos / 16A Azules) + 7 Llaves 3-Way -->
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(380px, 1fr)); gap:12px;">
          <div style="background:rgba(15,23,42,0.84); border:1px solid rgba(239,68,68,0.35); border-radius:8px; padding:10px 12px;">
            <h4 style="color:#fca5a5; font-size:12px; margin-bottom:6px;">
              ⚡🚰 Los 6 Tableros Eléctricos, Acometidas y Equipos Hidrosanitarios Principales (3D/2D)
            </h4>
            <div style="display:flex; flex-direction:column; gap:5px;">
              ${tableros
                .map(
                  (tb) => `
                <div style="background:rgba(30,41,59,0.65); padding:6px 8px; border-radius:5px; border-left:3px solid #ef4444;">
                  <div style="display:flex; justify-content:space-between; font-size:10.5px;">
                    <strong style="color:#fff;">${tb.codigo} — ${tb.nombre}</strong>
                    <span style="color:#93c5fd; font-family:var(--font-mono); font-size:9.5px;">${tb.nivel}</span>
                  </div>
                  <div style="font-size:10px; color:#cbd5e1; margin-top:2px;">${tb.especificacion}</div>
                </div>
              `
                )
                .join('')}
            </div>
          </div>

          <div style="background:rgba(15,23,42,0.84); border:1px solid rgba(56,189,248,0.35); border-radius:8px; padding:10px 12px;">
            <h4 style="color:#7dd3fc; font-size:12px; margin-bottom:6px;">
              🔌 Inventario Geolocalizado: ${tomas.length} Tomacorrientes (${tomas20ACount} de 20A Rojos + ${tomas16ACount} de 16A) y ${llaves3w.length} Llaves Conmutadas
            </h4>
            <div style="max-height:245px; overflow-y:auto; padding-right:4px; display:flex; flex-direction:column; gap:4px;">
              ${tomas
                .map(
                  (tm) => `
                <div style="display:flex; justify-content:space-between; align-items:center; gap:8px; background:rgba(30,41,59,0.58); padding:4px 8px; border-radius:4px; border-left:3px solid ${tm.tipo === 'toma_20a' ? '#ef4444' : '#38bdf8'}; font-size:10px;">
                  <div>
                    <strong style="color:${tm.tipo === 'toma_20a' ? '#fca5a5' : '#93c5fd'}; font-family:var(--font-mono);">${tm.codigo}</strong>
                    <span style="color:#e2e8f0; margin-left:4px;">${tm.label}</span>
                  </div>
                  <span style="color:#94a3b8; font-family:var(--font-mono); font-size:9.5px; white-space:nowrap;">${tm.nivel.replace('_', ' ')}</span>
                </div>
              `
                )
                .join('')}
            </div>
          </div>
        </div>
      </div>
    `;
  };

  const focusDuctsAndSlabPassesIn3D = () => {
    scene.setLayerVisibility('ductos', true);
    const chkDuctos = document.getElementById('layer-ductos');
    if (chkDuctos) chkDuctos.checked = true;
    closeModal(document.getElementById('modal-simulador'));
    closeModal(document.getElementById('modal-renders'));
    if (typeof scene.setFloorCutaway === 'function') {
      scene.setFloorCutaway('cut_pa');
      document.querySelectorAll('#cutaway-mode-buttons .cutaway-btn').forEach((b) => {
        b.classList.toggle('active', b.getAttribute('data-cutaway-mode') === 'cut_pa');
      });
    }
    if (typeof scene.focusRoom === 'function') {
      scene.focusRoom('cocina_isla');
    } else {
      scene.setCameraView('structure');
    }
  };

  const renderSixSpecialistsAndDuctsPanel = () => {
    const simHost = document.getElementById('six-specialists-and-ducts-host');
    const rendersHost = document.getElementById('renders-ductos-especialistas-host');

    if (simHost) {
      simHost.innerHTML = buildSpecialistsAndDuctsHtml('sim');
    }
    if (rendersHost) {
      rendersHost.innerHTML = buildSpecialistsAndDuctsHtml('renders');
    }

    document.querySelectorAll('.spec-filter-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        activeSpecialistFilterId = btn.getAttribute('data-spec-id') || 'ALL';
        renderSixSpecialistsAndDuctsPanel();
      });
    });

    document.querySelectorAll('.btn-focus-ductos-3d').forEach((btn) => {
      btn.addEventListener('click', () => {
        focusDuctsAndSlabPassesIn3D();
      });
    });
  };

  renderBankCreditAndRequirements();
  renderOwnerControlAndArchitectPanel();
  renderChinaSmartElectricalPanel();
  renderSixSpecialistsAndDuctsPanel();
  renderTobatiAndRoofComparison();
  renderMultiBudgetComparator();
  renderForensicOmissions();
  renderBudgetTable();

  // Origin filter buttons in Cómputo Modal
  document.querySelectorAll('#computo-origin-filters .computo-filter-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#computo-origin-filters .computo-filter-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      activeComputoOriginFilter = btn.getAttribute('data-origin-filter') || 'ALL';
      renderBudgetTable();
    });
  });

  // Category filter buttons in Cómputo Modal
  document.querySelectorAll('#computo-category-filters .computo-filter-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#computo-category-filters .computo-filter-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      activeComputoCategoryFilter = btn.getAttribute('data-cat-filter') || 'ALL';
      renderBudgetTable();
    });
  });

  // Add all forensic items button
  const btnAddAllForensic = document.getElementById('btn-add-all-forensic') || document.getElementById('btn-activar-todas-omisiones');
  if (btnAddAllForensic) {
    btnAddAllForensic.addEventListener('click', () => {
      OMISIONES_CRITICAS_PRESUPUESTO.forEach((om) => {
        if (om.partidaVinculadaId) {
          selectedItemIds.add(om.partidaVinculadaId);
        }
      });
      recalculateBudget();
    });
  }

  // Export Native 6-Sheet Excel Workbook (.XLSX with live formulas + LG-RB format)
  const btnExportXlsx = document.getElementById('btn-export-computo-xlsx');
  if (btnExportXlsx) {
    btnExportXlsx.addEventListener('click', () => {
      const currentScenarioKey = activeScenarioKey;
      const scenarioObj = ESCENARIOS_INVERSION[currentScenarioKey] || ESCENARIOS_INVERSION.escenario300;
      const currentLoanAmount = customTargetOverrideGs || scenarioObj?.montoObjetivoGs || 300000000;
      const currentLoanYears = 15;
      const currentRateKey = 'tasa99';
      const currentSimItems = editablePartidas.map((p) => {
        const bm = getPartidaBankMeta(p);
        return {
          ...p,
          included: selectedItemIds.has(p.id),
          activo: selectedItemIds.has(p.id),
          cantidad: p.cantidadActual,
          precioUnitarioGs: p.precioUnitarioActualGs,
          subtotalGs: p.subtotalActualGs,
          colorBanco: bm.colorBanco,
          pctMateriales: bm.pctMateriales,
          pctManoObra: bm.pctManoObra,
          materialesGs: bm.materialesGs,
          manoObraGs: bm.manoObraGs
        };
      });

      exportProjectWorkbookXLSX({
        scenarioKey: currentScenarioKey,
        items: currentSimItems,
        loanAmount: currentLoanAmount,
        loanYears: currentLoanYears,
        activeRateKey: currentRateKey
      });
    });
  }

  // Export Bank Cómputo CSV (Excel compatible with UTF-8 BOM, including Bank Color Code and Materiales vs Mano de Obra)
  const btnExportCsv = document.getElementById('btn-export-computo-csv');
  if (btnExportCsv) {
    btnExportCsv.addEventListener('click', () => {
      const headers = [
        'Incluido en Credito',
        'Color Normativo Banco',
        'ID',
        'Partida / Rubro',
        'Categoria',
        'Formula Dimensional',
        'Cantidad',
        'Unidad',
        'Precio Unitario (Gs)',
        'Materiales (Gs)',
        'Mano de Obra (Gs)',
        'Subtotal Total (Gs)',
        'Fuente / Detalle'
      ];

      const existingRows = (REQUISITOS_BANCO_Y_CUOTAS?.construccionesExistentesNegro?.rubros || []).map((rn) => [
        'YA_CONSTRUIDO',
        'NEGRO (Construido)',
        rn.codigo,
        `"${(rn.item || '').replace(/"/g, '""')}"`,
        '"Construcciones Existentes"',
        '"Verificado en Obra"',
        rn.cantidad,
        rn.unidad,
        rn.montoGs,
        0,
        0,
        rn.montoGs,
        `"${rn.estado}"`
      ].join(';'));

      const rows = editablePartidas.map((p) => {
        const inc = selectedItemIds.has(p.id) ? 'SI' : 'NO';
        const bm = getPartidaBankMeta(p);
        const cleanItem = `"${(p.item || '').replace(/"/g, '""')}"`;
        const cleanCat = `"${(p.categoria || '').replace(/"/g, '""')}"`;
        const cleanDim = `"${(p.formulaDim || '').replace(/"/g, '""')}"`;
        const cleanOrig = `"${(p.origenLabel || p.origenTipo || '').replace(/"/g, '""')}"`;
        return [
          inc,
          bm.colorBanco,
          p.id,
          cleanItem,
          cleanCat,
          cleanDim,
          p.cantidadActual,
          p.unidad,
          p.precioUnitarioActualGs,
          bm.materialesGs,
          bm.manoObraGs,
          p.subtotalActualGs,
          cleanOrig
        ].join(';');
      });

      const csvContent = '\uFEFF' + [headers.join(';'), ...existingRows, ...rows].join('\r\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `planilla_bancaria_itapytapunta_${activeScenarioKey}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  }

  // Print Cómputo
  const btnPrintComputo = document.getElementById('btn-print-computo');
  if (btnPrintComputo) {
    btnPrintComputo.addEventListener('click', () => {
      window.print();
    });
  }

  // Apply Scenario Function (supports 'hoy_en_obra', 'escenario300', 'escenario350', 'escenario370', 'escenario440', 'edifica460', 'edifica573')
  const applyScenario = (rawKey) => {
    const scenarioKey = rawKey === 'escenario370' ? 'escenario350' : rawKey;
    activeScenarioKey = scenarioKey;
    customTargetOverrideGs = null;

    document.querySelectorAll('.scenario-pill[data-scenario]').forEach((pill) => {
      pill.classList.toggle('active', pill.getAttribute('data-scenario') === scenarioKey);
    });

    const presetButtonsMap = {
      hoy_en_obra: 'btn-preset-hoy',
      escenario300: 'btn-preset-300',
      escenario350: 'btn-preset-370',
      escenario440: 'btn-preset-440'
    };
    ['btn-preset-hoy', 'btn-preset-300', 'btn-preset-370', 'btn-preset-440'].forEach((btnId) => {
      const el = document.getElementById(btnId);
      if (el) el.classList.toggle('active', presetButtonsMap[scenarioKey] === btnId);
    });

    if (scenarioKey === 'hoy_en_obra') {
      if (floorplanEditor) {
        editorInitialized = false;
        floorplanEditor.loadPreset('hoy_en_obra');
        editorInitialized = true;
      }
      scene.setScenario('hoy_en_obra');
      recalculateBudget();
      return;
    }

    const scenario = ESCENARIOS_INVERSION[scenarioKey] || ESCENARIOS_INVERSION.escenario300;
    if (!scenario) return;

    selectedItemIds = new Set(scenario.itemsIncluidos);

    if (floorplanEditor) {
      const presetMap = {
        escenario300: 'familia_3_4',
        escenario350: 'familia_3_4',
        escenario440: 'familia_3_4',
        edifica460: 'familia_3_4',
        edifica573: 'familia_3_4'
      };
      editorInitialized = false;
      floorplanEditor.loadPreset(presetMap[scenarioKey] || 'familia_3_4');
      editorInitialized = true;
    }

    scene.setScenario(scenarioKey);

    if (kpiScenarioName) kpiScenarioName.textContent = scenario.nombre.split(':')[0];
    if (kpiObjectiveDesc) kpiObjectiveDesc.textContent = scenario.objetivoPrincipal;

    recalculateBudget();
  };

  // Top Bar & Simulador Scenario Buttons
  document.querySelectorAll('.scenario-pill[data-scenario]').forEach((pill) => {
    pill.addEventListener('click', () => {
      const key = pill.getAttribute('data-scenario');
      if (key) applyScenario(key);
    });
  });

  // Independent Top Bar Button: Toggle 3D Pool + Quincho view without switching to a distorted reference budget
  const btnTogglePoolTop = document.getElementById('btn-toggle-pool-top');
  let poolQuinchoVisible3D = false;
  if (btnTogglePoolTop) {
    btnTogglePoolTop.addEventListener('click', () => {
      poolQuinchoVisible3D = !poolQuinchoVisible3D;
      btnTogglePoolTop.setAttribute('data-pool-visible', poolQuinchoVisible3D ? 'on' : 'off');
      btnTogglePoolTop.classList.toggle('active', poolQuinchoVisible3D);
      const titleEl = btnTogglePoolTop.querySelector('.pill-title');
      const descEl = btnTogglePoolTop.querySelector('.pill-desc');
      if (titleEl) {
        titleEl.textContent = poolQuinchoVisible3D
          ? '🏊 Piscina + Quincho 3D: ON'
          : '🏊 Ver Piscina + Quincho 3D';
      }
      if (descEl) {
        descEl.textContent = poolQuinchoVisible3D
          ? 'Mostrando en Jardín (Crédito sin alterar)'
          : 'Vista Opcional Jardín (Sin alterar crédito)';
      }
      if (typeof scene.setPoolQuinchoVisibility === 'function') {
        scene.setPoolQuinchoVisibility(poolQuinchoVisible3D);
      }
      if (poolQuinchoVisible3D && typeof scene.focusRoom === 'function') {
        scene.focusRoom('piscina_quincho');
      }
    });
  }

  const scenButtons = [
    { id: 'btn-preset-hoy', key: 'hoy_en_obra' },
    { id: 'btn-preset-300', key: 'escenario300' },
    { id: 'btn-preset-370', key: 'escenario350' },
    { id: 'btn-preset-440', key: 'escenario440' }
  ];

  scenButtons.forEach(({ id, key }) => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('click', () => applyScenario(key));
    }
  });

  // Top Header Button: Cycle 3D Roof Style (Isopanel -> Tejas Tobatí -> Oculto -> Isopanel)
  const btnToggleRoofStyle = document.getElementById('btn-toggle-roof-style');
  if (btnToggleRoofStyle) {
    btnToggleRoofStyle.addEventListener('click', () => {
      const nextStyle = cycleRoofStyle(scene.roofStyle);
      scene.setRoofStyle(nextStyle);
      btnToggleRoofStyle.setAttribute('data-roof-style', nextStyle);
      btnToggleRoofStyle.innerHTML = `<span>${getRoofStyleButtonLabel(nextStyle)}</span>`;
      const chkTecho = document.getElementById('layer-techo');
      if (chkTecho) {
        chkTecho.checked = nextStyle !== 'oculto';
      }
    });
  }

  // =========================================================================
  // 5B. EXPANDABLE METRIC CALCULATION DRAWER (#computo-drawer — UX 2026)
  // =========================================================================
  const computoDrawer = document.getElementById('computo-drawer');
  const btnToggleComputoDrawer = document.getElementById('btn-toggle-computo-drawer');
  const btnKpiOpenDrawer = document.getElementById('btn-kpi-open-drawer');
  const btnCloseComputoDrawer = document.getElementById('btn-close-computo-drawer');
  const btnDrawerOpenFullModal = document.getElementById('btn-drawer-open-full-modal');
  const btnDrawerExportXlsx = document.getElementById('btn-drawer-export-xlsx');
  const computoDrawerSearch = document.getElementById('computo-drawer-search');
  const computoDrawerTbody = document.getElementById('computo-drawer-tbody');

  let activeDrawerFilter = 'PREVISTOS';
  let activeDrawerSearch = '';

  const setComputoDrawerOpen = (open) => {
    if (!computoDrawer) return;
    const isOpen = Boolean(open);
    computoDrawer.classList.toggle('open', isOpen);
    computoDrawer.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
    if (btnToggleComputoDrawer) {
      btnToggleComputoDrawer.setAttribute('data-drawer-open', isOpen ? 'on' : 'off');
      btnToggleComputoDrawer.classList.toggle('active', isOpen);
    }
    if (isOpen && typeof renderComputoDrawer === 'function') {
      renderComputoDrawer();
    }
  };

  renderComputoDrawer = () => {
    if (!computoDrawerTbody) return;

    const currentPartidas = editablePartidas.map((p) => ({
      ...p,
      cantidad: p.cantidadActual,
      precioUnitarioGs: p.precioUnitarioActualGs,
      subtotalGs: p.subtotalActualGs
    }));

    const customScenariosMap = {
      ...ESCENARIOS_INVERSION,
      [activeScenarioKey]: {
        ...(ESCENARIOS_INVERSION[activeScenarioKey] || ESCENARIOS_INVERSION.escenario300 || {}),
        itemsIncluidos:
          activeScenarioKey === 'hoy_en_obra'
            ? []
            : Array.from(selectedItemIds)
      }
    };

    const breakdown = buildMetricCalculationBreakdown({
      scenarioKey: activeScenarioKey,
      partidas: currentPartidas,
      scenariosMap: customScenariosMap,
      builtRubros: REQUISITOS_BANCO_Y_CUOTAS?.construccionesExistentesNegro?.rubros || [],
      ownItemsGs0: INVENTARIO_MUEBLES_ACTUALES_LEO?.items || []
    });

    const cdScenarioLabel = document.getElementById('cd-scenario-label');
    const cdTotalCredito = document.getElementById('cd-total-credito');
    const cdTargetCredito = document.getElementById('cd-target-credito');
    const cdDiffCredito = document.getElementById('cd-diff-credito');
    const cdTotalYaObra = document.getElementById('cd-total-ya-obra');
    const cdCountPrevistos = document.getElementById('cd-count-previstos');
    const cdCuotaBnf = document.getElementById('cd-cuota-bnf');

    const badgePrevistos = document.getElementById('cd-badge-previstos');
    const badgeYaEsta = document.getElementById('cd-badge-ya-esta');
    const badgeAll = document.getElementById('cd-badge-all');
    const badgeNoInc = document.getElementById('cd-badge-no-inc');

    if (badgePrevistos) badgePrevistos.textContent = String(breakdown.summary.includedItemsCount);
    if (badgeYaEsta) badgeYaEsta.textContent = String(breakdown.summary.alreadyBuiltCount);
    if (badgeAll) badgeAll.textContent = String(breakdown.allRows.length);
    if (badgeNoInc) badgeNoInc.textContent = String(breakdown.summary.excludedItemsCount ?? breakdown.summary.notIncludedCount ?? 0);

    const scenarioShortName =
      activeScenarioKey === 'hoy_en_obra'
        ? 'Hoy en Obra (Solo H°A° Ejecutado)'
        : activeScenarioKey === 'escenario300'
          ? 'Crédito BNF 300M (Habitable)'
          : activeScenarioKey === 'escenario350'
            ? 'Crédito BNF 350M (Confort)'
            : 'Crédito BNF 440M (Integral)';

    if (cdScenarioLabel) cdScenarioLabel.textContent = scenarioShortName;
    if (cdTotalCredito) cdTotalCredito.textContent = `Gs. ${formatGs(breakdown.summary.totalCreditSelectedGs)}`;
    if (cdTargetCredito) cdTargetCredito.textContent = `Gs. ${formatGs(breakdown.summary.targetCreditGs)}`;
    if (cdDiffCredito) {
      const diff = breakdown.summary.differenceGs;
      cdDiffCredito.textContent = `Disponible: ${diff >= 0 ? '+' : '-'}Gs. ${formatGs(Math.abs(diff))}`;
      cdDiffCredito.style.color = diff >= 0 ? '#34d399' : '#f87171';
    }
    if (cdTotalYaObra) cdTotalYaObra.textContent = `Gs. ${formatGs(breakdown.summary.totalAlreadyBuiltGs)}`;
    if (cdCountPrevistos) {
      cdCountPrevistos.textContent = `${breakdown.summary.includedItemsCount} previstos / ${breakdown.summary.alreadyBuiltCount} ya está`;
    }

    const factorBnf = PREVISION_CREDITO_NUEVO?.factorCuotaConSegurosPorMillonGs || 11765.9090909;
    const cuotaBnf = Math.round((breakdown.summary.targetCreditGs / 1000000) * factorBnf);
    if (cdCuotaBnf) {
      cdCuotaBnf.textContent =
        activeScenarioKey === 'hoy_en_obra' ? 'Gs. 0 / mes (Ya pagado)' : `Gs. ${formatGs(cuotaBnf)} / mes`;
    }

    const effectiveFilter =
      activeScenarioKey === 'hoy_en_obra' && activeDrawerFilter === 'PREVISTOS'
        ? 'YA_ESTA'
        : activeDrawerFilter;

    const rows = filterMetricRows(breakdown.allRows, {
      statusFilter: effectiveFilter,
      searchQuery: activeDrawerSearch
    });

    if (rows.length === 0) {
      computoDrawerTbody.innerHTML = `
        <tr>
          <td colspan="5" style="text-align:center; padding:24px; color:#94a3b8;">
            No se encontraron ítems para este filtro (${effectiveFilter}). Probá cambiar a «Todos» o «Ya Está».
          </td>
        </tr>
      `;
      return;
    }

    computoDrawerTbody.innerHTML = rows
      .map((r) => {
        let statusBadge = '';
        let rowClass = '';
        const isToggleable = !r.id.startsWith('EXIST-') && !r.id.startsWith('PROPIO-');

        if (r.alreadyBuilt) {
          rowClass = 'row-ya-esta';
          statusBadge = `<span class="cd-status-badge ya-esta" title="${r.statusLabel}">✅ YA ESTÁ</span>`;
        } else if (r.includedInScenario) {
          rowClass = 'row-previsto';
          statusBadge = `<span class="cd-status-badge previsto" title="${r.statusLabel}">🎯 PREVISTO BNF</span>`;
        } else {
          rowClass = 'row-no-incluido';
          statusBadge = `<span class="cd-status-badge no-incluido" title="${r.statusLabel}">⏸️ NO INCLUIDO</span>`;
        }

        const toggleCheckboxHtml = isToggleable
          ? `<input type="checkbox" class="drawer-item-chk" data-drawer-item-id="${r.id}" ${r.includedInScenario ? 'checked' : ''} title="Activar/Desactivar este rubro en el presupuesto" style="cursor:pointer; accent-color:#10b981; margin-right:5px;" />`
          : '';

        return `
          <tr class="${rowClass}">
            <td>
              <span class="cd-item-name">${r.item}</span>
              <span class="cd-item-cat">${r.categoria} • <span style="color:#64748b;">${r.code}</span></span>
            </td>
            <td class="cd-num">${Number(r.cantidad).toLocaleString('es-PY', { maximumFractionDigits: 2 })} <small style="color:#94a3b8;">${r.unidad}</small></td>
            <td class="cd-num">${r.precioUnitarioGs > 0 ? formatGs(r.precioUnitarioGs) : '<span style="color:#34d399;">Gs. 0</span>'}</td>
            <td class="cd-total" style="color:${r.alreadyBuilt ? '#34d399' : r.includedInScenario ? '#fde68a' : '#64748b'};">
              ${r.subtotalGs > 0 ? `Gs. ${formatGs(r.subtotalGs)}` : 'Gs. 0'}
            </td>
            <td>
              <div style="display:flex; align-items:center; gap:4px;">
                ${toggleCheckboxHtml}
                ${statusBadge}
              </div>
            </td>
          </tr>
        `;
      })
      .join('');

    computoDrawerTbody.querySelectorAll('.drawer-item-chk').forEach((chk) => {
      chk.addEventListener('change', (e) => {
        const itemId = e.target.getAttribute('data-drawer-item-id');
        if (!itemId) return;
        if (e.target.checked) {
          selectedItemIds.add(itemId);
        } else {
          selectedItemIds.delete(itemId);
        }
        recalculateBudget();
      });
    });
  };

  if (btnToggleComputoDrawer) {
    btnToggleComputoDrawer.addEventListener('click', () => {
      const isOpen = computoDrawer && computoDrawer.classList.contains('open');
      setComputoDrawerOpen(!isOpen);
    });
  }
  if (btnKpiOpenDrawer) {
    btnKpiOpenDrawer.addEventListener('click', () => setComputoDrawerOpen(true));
  }
  if (btnCloseComputoDrawer) {
    btnCloseComputoDrawer.addEventListener('click', () => setComputoDrawerOpen(false));
  }
  if (btnDrawerOpenFullModal) {
    btnDrawerOpenFullModal.addEventListener('click', () => {
      setComputoDrawerOpen(false);
      const modalSim = document.getElementById('modal-simulador');
      if (modalSim) modalSim.classList.add('open');
    });
  }
  if (btnDrawerExportXlsx) {
    btnDrawerExportXlsx.addEventListener('click', () => {
      if (btnExportXlsx) btnExportXlsx.click();
    });
  }

  document.querySelectorAll('.cd-filter-pill[data-cd-filter], .computo-drawer-filter-btn[data-drawer-filter]').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.cd-filter-pill[data-cd-filter], .computo-drawer-filter-btn[data-drawer-filter]').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      activeDrawerFilter = btn.getAttribute('data-cd-filter') || btn.getAttribute('data-drawer-filter') || 'ALL';
      renderComputoDrawer();
    });
  });

  if (computoDrawerSearch) {
    computoDrawerSearch.addEventListener('input', (e) => {
      activeDrawerSearch = e.target.value || '';
      renderComputoDrawer();
    });
  }

  renderComputoDrawer();

  // Top Header Button: Toggle Normative Bank Color Mode (⚫ Negro / 🟢 Verde / 🔴 Rojo / 🟡 Amarillo) in 3D & 2D
  const btnToggleBankColors = document.getElementById('btn-toggle-bank-colors');
  const setGlobalBankColorMode = (enabled) => {
    scene.setBankColorMode(enabled);
    if (floorplanEditor && typeof floorplanEditor.setBankColorMode === 'function') {
      floorplanEditor.setBankColorMode(enabled);
    }
    if (btnToggleBankColors) {
      btnToggleBankColors.setAttribute('data-bank-colors', enabled ? 'on' : 'off');
      btnToggleBankColors.innerHTML = enabled
        ? '<span>🎨 Colores Banco: ON ⚫🟢🔴🟡</span>'
        : '<span>🎨 Colores Banco: OFF</span>';
      btnToggleBankColors.style.background = enabled ? 'rgba(245, 158, 11, 0.25)' : '';
    }
  };
  if (btnToggleBankColors) {
    btnToggleBankColors.addEventListener('click', () => {
      setGlobalBankColorMode(!scene.bankColorMode);
    });
  }

  // =========================================================================
  // 6. LEFT SIDEBAR CONTROLS: ROOM TOUR, FLOOR CUTAWAY, 12 CAD LAYERS, CAMERAS, SUN & TOOLS
  // =========================================================================
  // Room-by-Room Navigation Buttons (10 interior/structural viewpoints)
  document.querySelectorAll('#room-tour-buttons [data-room-focus]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const roomKey = btn.getAttribute('data-room-focus');
      document.querySelectorAll('#room-tour-buttons .room-tour-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      if (typeof scene.focusRoom === 'function') {
        scene.focusRoom(roomKey);
      }
      // Also update cutaway buttons visual state if focusRoom auto-adjusts cutaway
      if (roomKey === 'estar_comedor' || roomKey === 'cocina_isla' || roomKey === 'bano_suite' || roomKey === 'dormitorio_suite' || roomKey === 'galeria_parrilla') {
        document.querySelectorAll('#cutaway-mode-buttons .cutaway-btn').forEach((b) => {
          b.classList.toggle('active', b.getAttribute('data-cutaway-mode') === 'cut_pa');
        });
      } else if (roomKey === 'subsuelo_depto' || roomKey === 'escalera_subsuelo') {
        document.querySelectorAll('#cutaway-mode-buttons .cutaway-btn').forEach((b) => {
          b.classList.toggle('active', b.getAttribute('data-cutaway-mode') === 'cut_pb');
        });
      } else if (roomKey === 'planta_alta') {
        document.querySelectorAll('#cutaway-mode-buttons .cutaway-btn').forEach((b) => {
          b.classList.toggle('active', b.getAttribute('data-cutaway-mode') === 'cut_roof');
        });
      } else if (roomKey === 'fachada_porton' || roomKey === 'corte_estructural') {
        document.querySelectorAll('#cutaway-mode-buttons .cutaway-btn').forEach((b) => {
          b.classList.toggle('active', b.getAttribute('data-cutaway-mode') === 'full');
        });
      }
    });
  });

  // Floor Cutaway Mode Buttons (Dollhouse slice: full, cut_roof, cut_pa, cut_pb)
  document.querySelectorAll('#cutaway-mode-buttons [data-cutaway-mode]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const mode = btn.getAttribute('data-cutaway-mode');
      document.querySelectorAll('#cutaway-mode-buttons .cutaway-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      if (typeof scene.setFloorCutaway === 'function') {
        scene.setFloorCutaway(mode);
      }
    });
  });

  const btnToggleUi = document.getElementById('btn-toggle-ui');
  let uiVisible = true;
  if (btnToggleUi) {
    btnToggleUi.addEventListener('click', () => {
      uiVisible = !uiVisible;
      leftSidebar.style.display = uiVisible ? 'flex' : 'none';
      document.querySelector('.bottom-dock').style.display = uiVisible ? 'flex' : 'none';
      document.querySelector('.scenario-selector-bar').style.display = uiVisible ? 'flex' : 'none';
      inspectorPopup.classList.remove('open');
    });
  }

  const mepSimPanel = document.getElementById('mep-sim-panel');
  const btnCloseMepSim = document.getElementById('btn-close-mep-sim');
  const btnSidebarMepSim = document.getElementById('btn-sidebar-mep-sim');

  const openMepSimPanel = (show = true) => {
    if (mepSimPanel) {
      mepSimPanel.style.display = show ? 'block' : 'none';
    }
  };

  if (btnCloseMepSim) {
    btnCloseMepSim.addEventListener('click', () => openMepSimPanel(false));
  }
  if (btnSidebarMepSim) {
    btnSidebarMepSim.addEventListener('click', () => {
      const isHidden = !mepSimPanel || mepSimPanel.style.display === 'none';
      openMepSimPanel(isHidden);
    });
  }

  const layerBindings = [
    { id: 'layer-ductos', name: 'ductos' },
    { id: 'layer-muro-parking', name: 'muroEstacionamiento' },
    { id: 'layer-losa2', name: 'losaFase2' },
    { id: 'layer-techo', name: 'techo' },
    { id: 'layer-arch', name: 'architecture' },
    { id: 'layer-subsuelo', name: 'subsuelo' },
    { id: 'layer-struct', name: 'structure' },
    { id: 'layer-entorno', name: 'entornoUrbano' },
    { id: 'layer-pluvial', name: 'pluvial' },
    { id: 'layer-senales', name: 'senalesDebiles' },
    { id: 'layer-geotech', name: 'geotech' },
    { id: 'layer-topo', name: 'topography' }
  ];

  layerBindings.forEach((b) => {
    const el = document.getElementById(b.id);
    if (el) {
      el.addEventListener('change', (e) => {
        const checked = e.target.checked;
        scene.setLayerVisibility(b.name, checked);
        // Desplegar automáticamente el Simulador Interactivo por Capas al seleccionar Eléctrica o Pluvial
        if (checked && (b.id === 'layer-ductos' || b.id === 'layer-senales' || b.id === 'layer-pluvial')) {
          openMepSimPanel(true);
        }
      });
    }
  });

  document.querySelectorAll('.view-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const cam = btn.getAttribute('data-cam');
      scene.setCameraView(cam);
    });
  });

  const sunSlider = document.getElementById('sun-slider');
  const sunTimeDisplay = document.getElementById('sun-time-display');
  if (sunSlider) {
    sunSlider.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      const hours = Math.floor(val);
      const mins = Math.round((val - hours) * 60);
      const formatted = `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;

      let note = '';
      if (val >= 17) note = ' (Atardecer en el Río)';
      else if (val <= 7) note = ' (Amanecer)';
      else if (val >= 11 && val <= 13) note = ' (Cenit solar)';

      if (sunTimeDisplay) sunTimeDisplay.textContent = `${formatted}${note}`;
      scene.setTimeOfDay(val);
    });
  }

  const btnXray = document.getElementById('btn-xray');
  let xrayActive = false;
  if (btnXray) {
    btnXray.addEventListener('click', () => {
      xrayActive = !xrayActive;
      btnXray.classList.toggle('active', xrayActive);
      scene.setXRayMode(xrayActive);
    });
  }

  const btnMeasure = document.getElementById('btn-measure');
  let measureActive = false;
  if (btnMeasure) {
    btnMeasure.addEventListener('click', () => {
      measureActive = !measureActive;
      btnMeasure.classList.toggle('active', measureActive);
      scene.setMeasureMode(measureActive);
      if (!measureActive) {
        measureCard.classList.remove('visible');
      }
    });
  }

  const btnClearMeasure = document.getElementById('btn-clear-measure');
  if (btnClearMeasure) {
    btnClearMeasure.addEventListener('click', () => {
      scene.clearMeasurements();
    });
  }

  const inspectorClose = document.getElementById('inspector-close');
  if (inspectorClose) {
    inspectorClose.addEventListener('click', () => {
      inspectorPopup.classList.remove('open');
    });
  }

  // =========================================================================
  // 7. MODALS & BOTTOM DOCK MANAGEMENT
  // =========================================================================
  const openModal = (id) => {
    const modal = document.getElementById(id);
    if (modal) {
      modal.classList.add('open');
      if (window.lucide) window.lucide.createIcons();
      if (id === 'modal-editor-2d' && floorplanEditor) {
        requestAnimationFrame(() => {
          floorplanEditor.handleResize();
          setTimeout(() => floorplanEditor.handleResize(), 80);
        });
      }
    }
  };

  const closeModal = (modal) => {
    if (modal) modal.classList.remove('open');
  };

  document.querySelectorAll('.dock-item').forEach((item) => {
    item.addEventListener('click', () => {
      document.querySelectorAll('.dock-item').forEach((d) => d.classList.remove('active'));
      item.classList.add('active');
      const modalId = item.getAttribute('data-modal');
      openModal(modalId);
    });
  });

  const btnOpenCloud = document.getElementById('btn-open-cloud');
  if (btnOpenCloud) {
    btnOpenCloud.addEventListener('click', () => openModal('modal-cloud'));
  }

  document.querySelectorAll('.modal-overlay').forEach((overlay) => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal(overlay);
    });
    const closeBtn = overlay.querySelector('.modal-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => closeModal(overlay));
    }
  });

  // =========================================================================
  // 8. MODAL SATÉLITE, INGENIERÍA MEP Y AUDITORÍA FORENSE (#modal-renders)
  // =========================================================================
  document.querySelectorAll('.tech-tab-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tech-tab-btn').forEach((b) => b.classList.remove('active'));
      document.querySelectorAll('.tech-tab-panel').forEach((p) => p.classList.remove('active'));
      btn.classList.add('active');
      const targetId = btn.getAttribute('data-tech-tab');
      const panel = document.getElementById(targetId);
      if (panel) panel.classList.add('active');
      if (window.lucide) window.lucide.createIcons();
    });
  });

  // Tab 1: Satellite image switcher & 3D urban button
  const satMainPreview = document.getElementById('sat-main-preview');
  const satMainCaption = document.getElementById('sat-main-caption');
  document.querySelectorAll('[data-sat-img]').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-sat-img]').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      if (satMainPreview) satMainPreview.src = btn.getAttribute('data-sat-img');
      if (satMainCaption) satMainCaption.textContent = btn.getAttribute('data-sat-caption') || '';
    });
  });

  const btnActivateUrban3D = document.getElementById('btn-activate-urban-3d');
  if (btnActivateUrban3D) {
    btnActivateUrban3D.addEventListener('click', () => {
      scene.setLayerVisibility('entorno', true);
      const chk = document.getElementById('layer-entorno');
      if (chk) chk.checked = true;
      closeModal(document.getElementById('modal-renders'));
      scene.setCameraView('aerial');
    });
  }

  // Tab 2: Pluvial & Hydrological specs
  const pluvialSpecsList = document.getElementById('pluvial-specs-list');
  if (pluvialSpecsList && PLUVIAL_HYDRO_DATA?.especificaciones) {
    const specLabels = {
      canaletas: 'Canaletas Ocultas N°24 (Y=+5.64m)',
      bajadas: '4 Bajadas Pluviales PVC Ø100mm',
      drenajeFrancesCochera: 'Drenaje Francés Superior (Cochera +98.50m)',
      drenajeFrancesSubsuelo: 'Drenaje Francés Inferior (Subsuelo +96.80m)',
      barbacanas: 'Barbacanas de Alivio Hidrostático Ø50mm',
      camaras: '5 Cámaras Desarenadoras y de Inspección',
      disipadorBarranco: 'Disipador de Energía en Barranco (+95.80m)'
    };
    pluvialSpecsList.innerHTML = Object.entries(PLUVIAL_HYDRO_DATA.especificaciones)
      .map(
        ([k, text]) => `
        <div class="mep-item-card" style="margin-bottom:6px;">
          <h5>${specLabels[k] || k}</h5>
          <p>${text}</p>
        </div>
      `
      )
      .join('');
  }

  const pluvialPlanImg = document.getElementById('pluvial-plan-img');
  document.querySelectorAll('[data-pluv-img]').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-pluv-img]').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      if (pluvialPlanImg) pluvialPlanImg.src = btn.getAttribute('data-pluv-img');
    });
  });

  const btnFocusPluvial = document.getElementById('btn-activate-pluvial-3d') || document.getElementById('btn-focus-pluvial-3d');
  if (btnFocusPluvial) {
    btnFocusPluvial.addEventListener('click', () => {
      scene.setLayerVisibility('pluvial', true);
      const chk = document.getElementById('layer-pluvial');
      if (chk) chk.checked = true;
      closeModal(document.getElementById('modal-renders'));
      scene.setCameraView('aerial');
    });
  }

  // Tab 3: Weak Signals, CCTV PoE & Wi-Fi 6 Mesh
  const weakSignalsDetails = document.getElementById('weak-signals-details');
  if (weakSignalsDetails && WEAK_SIGNALS_DATA) {
    const rack = WEAK_SIGNALS_DATA.rackPrincipal;
    weakSignalsDetails.innerHTML = `
      <div class="mep-item-card" style="border-color:rgba(168,85,247,0.4); background:rgba(168,85,247,0.08); margin-bottom:8px;">
        <h5 style="color:#e9d5ff;">${rack.name}</h5>
        <p style="font-size:11px; color:#cbd5e1; margin-bottom:4px;">📍 ${rack.ubicacion}</p>
        <ul style="list-style:none; font-size:10.5px; color:#e2e8f0;">
          ${rack.equipamiento.map((eq) => `<li>• ${eq}</li>`).join('')}
        </ul>
      </div>
      <div class="mep-items-list" style="max-height:290px;">
        ${WEAK_SIGNALS_DATA.camarasCCTV
          .map(
            (cam) => `
          <div class="mep-item-card">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <h5 style="color:#67e8f9; margin:0;">🎥 ${cam.name}</h5>
              <span class="badge-pill" style="font-size:9.5px; margin:0;">FOV ${cam.fovDeg}° • ${cam.range}m</span>
            </div>
            <div style="font-size:10px; color:#94a3b8; margin:2px 0;">📍 ${cam.ubicacion} | ${cam.especificacion}</div>
            <p>${cam.desc}</p>
          </div>
        `
          )
          .join('')}
        ${WEAK_SIGNALS_DATA.nodosWifiMesh
          .map(
            (node) => `
          <div class="mep-item-card">
            <h5 style="color:#34d399; margin:0 0 2px 0;">📶 ${node.name} (Radio ${node.radius}m)</h5>
            <p>${node.desc}</p>
          </div>
        `
          )
          .join('')}
      </div>
    `;
  }

  const btnFocusSenales = document.getElementById('btn-activate-cctv-3d') || document.getElementById('btn-focus-senales-3d');
  if (btnFocusSenales) {
    btnFocusSenales.addEventListener('click', () => {
      scene.setLayerVisibility('senales', true);
      const chk = document.getElementById('layer-senales');
      if (chk) chk.checked = true;
      closeModal(document.getElementById('modal-renders'));
      scene.setCameraView('structure');
    });
  }

  // Tab 4: Acta de Recepción (29/12/2025), PROBETI #17671 & Buenas Prácticas
  const actaContainer = document.getElementById('acta-probeti-container');
  if (actaContainer && ACTA_RECEPCION_SUMMARY) {
    const fin = ACTA_RECEPCION_SUMMARY.liquidacionFinancieraJivesa;
    actaContainer.innerHTML = `
      <div class="mep-tab-grid">
        <div class="mep-card">
          <h4 style="color:#34d399; font-size:13px; margin-bottom:8px;">📋 Estado Real Verificado en Obra (Acta 29/12/2025 — JIVESA S.A.)</h4>
          <ul class="sat-features-ul" style="margin-bottom:12px;">
            ${ACTA_RECEPCION_SUMMARY.estadoRealObraHoy.itemsCompletados.map((i) => `<li>✓ ${i}</li>`).join('')}
          </ul>
          <h5 style="color:#fde68a; font-size:12px; margin-bottom:6px;">⚠️ Rubros No Ejecutados Aún (0 m² de ladrillos hoy):</h5>
          <ul class="sat-features-ul" style="margin-bottom:12px;">
            ${ACTA_RECEPCION_SUMMARY.estadoRealObraHoy.itemsNoEjecutadosAun.map((i) => `<li>• ${i}</li>`).join('')}
          </ul>
          <h5 style="color:#38bdf8; font-size:12px; margin-bottom:6px;">🔬 Ensayos de Compresión PROBETI S.R.L. (Informe #17671):</h5>
          <table class="budget-table" style="font-size:11px; margin-bottom:12px;">
            <thead>
              <tr>
                <th>Sector Ensayado</th>
                <th>fck Media (28d)</th>
                <th>Dictamen</th>
              </tr>
            </thead>
            <tbody>
              ${ACTA_RECEPCION_SUMMARY.ensayosCompresionProbeti.resultados
                .map(
                  (r) => `
                <tr>
                  <td><strong>${r.sector}</strong></td>
                  <td style="color:#34d399; font-weight:700;">${r.resistenciaMediaKgCm2} kg/cm²</td>
                  <td>${r.observacion}</td>
                </tr>
              `
                )
                .join('')}
            </tbody>
          </table>
          <div class="jivesa-finance-grid">
            <div class="fin-stat-box"><span>Contrato Original</span><strong>Gs. ${formatGs(fin.contratoOriginalGs)}</strong></div>
            <div class="fin-stat-box"><span>Adicional Zapatas/Losa</span><strong style="color:#fde68a;">+ Gs. ${formatGs(fin.adicionalProfundizacionYLosaVistaGs)}</strong></div>
            <div class="fin-stat-box"><span>Total Ejecutado</span><strong style="color:#38bdf8;">Gs. ${formatGs(fin.totalEjecutadoGs)}</strong></div>
            <div class="fin-stat-box"><span>Abonado</span><strong style="color:#34d399;">Gs. ${formatGs(fin.totalAbonadoGs)}</strong></div>
            <div class="fin-stat-box"><span>Saldo Retenido</span><strong style="color:#fca5a5;">Gs. ${formatGs(fin.saldoPendienteRetenidoGs)}</strong></div>
          </div>
        </div>
        <div class="mep-card">
          <h4 style="color:var(--accent-cyan); font-size:13px; margin-bottom:8px;">🇵🇾 Manual de Buenas Prácticas Constructivas (Itá Pytã Punta)</h4>
          <div class="mep-items-list" style="max-height:420px;">
            ${(ARQUITECTURA_PARAGUAY_BEST_PRACTICES?.categorias || [])
              .map(
                (cat) => `
              <div class="mep-item-card">
                <h5 style="color:#67e8f9;">${cat.categoria}</h5>
                ${cat.recomendaciones
                  .map(
                    (rec) => `
                  <div style="margin-top:5px;">
                    <strong style="font-size:11px; color:#f8fafc;">• ${rec.titulo}:</strong>
                    <p style="font-size:10.5px; color:#94a3b8;">${rec.detalle}</p>
                  </div>
                `
                  )
                  .join('')}
              </div>
            `
              )
              .join('')}
          </div>
        </div>
      </div>
    `;
  }

  // =========================================================================
  // 9. CATÁLOGO DE 23 PLANOS CAD Y PRESUPUESTOS (#modal-planos)
  // =========================================================================
  const bpImg = document.getElementById('blueprint-img');
  const bpViewport = document.getElementById('blueprint-viewport') || document.getElementById('blueprint-viewer');
  const bpSelectorStrip = document.getElementById('blueprint-selector-strip');
  const bpMetaCode = document.getElementById('bp-meta-code');
  const bpMetaTitle = document.getElementById('bp-meta-title');
  const bpMetaDesc = document.getElementById('bp-meta-desc');
  const bpMetaAuthor = document.getElementById('bp-meta-author');
  const bpMetaScale = document.getElementById('bp-meta-scale');
  const bpMetaStatus = document.getElementById('bp-meta-status');
  const bpDownloadBtn = document.getElementById('bp-download-btn');
  const bpZoomLevel = document.getElementById('bp-zoom-level');

  let activeBpCategory = 'ALL';
  let activeBlueprintId = ALL_BLUEPRINTS_CATALOG[0]?.id || 'E1';
  let currentBpZoom = 1.0;

  const updateBlueprintZoom = (newZoom) => {
    currentBpZoom = Math.min(3.5, Math.max(0.5, Number(newZoom.toFixed(2))));
    if (bpImg) {
      bpImg.style.transform = `scale(${currentBpZoom})`;
    }
    if (bpZoomLevel) {
      bpZoomLevel.textContent = `${Math.round(currentBpZoom * 100)}%`;
    }
  };

  const selectBlueprint = (bp) => {
    if (!bp) return;
    activeBlueprintId = bp.id;
    currentBpZoom = 1.0;
    updateBlueprintZoom(1.0);

    if (bpImg) {
      bpImg.src = bp.url;
      bpImg.alt = bp.title;
    }
    if (bpMetaCode) bpMetaCode.textContent = bp.code;
    if (bpMetaTitle) bpMetaTitle.textContent = bp.title;
    if (bpMetaDesc) bpMetaDesc.textContent = bp.desc;
    if (bpMetaAuthor) bpMetaAuthor.textContent = `Autor: ${bp.author}`;
    if (bpMetaScale) bpMetaScale.textContent = `Escala: ${bp.scale}`;
    if (bpMetaStatus) bpMetaStatus.textContent = bp.status;
    if (bpDownloadBtn) {
      bpDownloadBtn.href = bp.pngUrl || bp.url;
      bpDownloadBtn.setAttribute('download', `${bp.code}_${bp.id}`);
    }

    document.querySelectorAll('.bp-pill-btn').forEach((btn) => {
      btn.classList.toggle('active', btn.getAttribute('data-bp-id') === bp.id);
    });
  };

  const renderBlueprintStrip = () => {
    if (!bpSelectorStrip) return;
    bpSelectorStrip.innerHTML = '';

    const filtered = ALL_BLUEPRINTS_CATALOG.filter(
      (bp) => activeBpCategory === 'ALL' || bp.category === activeBpCategory
    );

    filtered.forEach((bp) => {
      const btn = document.createElement('button');
      btn.className = `bp-pill-btn ${bp.id === activeBlueprintId ? 'active' : ''}`;
      btn.setAttribute('data-bp-id', bp.id);
      btn.innerHTML = `
        <span class="bp-pill-code">${bp.code}</span>
        <span class="bp-pill-name">${bp.title.replace(/^[^—]+—\s*/, '')}</span>
      `;
      btn.addEventListener('click', () => selectBlueprint(bp));
      bpSelectorStrip.appendChild(btn);
    });

    if (filtered.length > 0 && !filtered.some((b) => b.id === activeBlueprintId)) {
      selectBlueprint(filtered[0]);
    } else {
      const current = ALL_BLUEPRINTS_CATALOG.find((b) => b.id === activeBlueprintId) || filtered[0];
      if (current) selectBlueprint(current);
    }
  };

  document.querySelectorAll('#bp-category-filters .computo-filter-btn, #blueprint-category-filters .computo-filter-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#bp-category-filters .computo-filter-btn, #blueprint-category-filters .computo-filter-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      activeBpCategory = btn.getAttribute('data-bp-cat') || 'ALL';
      renderBlueprintStrip();
    });
  });

  // Contrast Themes
  const themeButtons = [
    { id: 'btn-theme-white', cls: 'theme-white' },
    { id: 'btn-theme-blueprint', cls: 'theme-blueprint' },
    { id: 'btn-theme-dark', cls: 'theme-dark' }
  ];
  themeButtons.forEach(({ id, cls }) => {
    const btn = document.getElementById(id);
    if (btn && bpViewport) {
      btn.addEventListener('click', () => {
        themeButtons.forEach((t) => {
          const b = document.getElementById(t.id);
          if (b) b.classList.remove('active');
          bpViewport.classList.remove(t.cls);
        });
        btn.classList.add('active');
        bpViewport.classList.add(cls);
      });
    }
  });

  // Zoom controls
  const btnZoomIn = document.getElementById('btn-zoom-in') || document.getElementById('bp-zoom-in');
  const btnZoomOut = document.getElementById('btn-zoom-out') || document.getElementById('bp-zoom-out');
  const btnZoomReset = document.getElementById('btn-zoom-reset') || document.getElementById('bp-zoom-reset');
  if (btnZoomIn) btnZoomIn.addEventListener('click', () => updateBlueprintZoom(currentBpZoom + 0.25));
  if (btnZoomOut) btnZoomOut.addEventListener('click', () => updateBlueprintZoom(currentBpZoom - 0.25));
  if (btnZoomReset) btnZoomReset.addEventListener('click', () => updateBlueprintZoom(1.0));

  renderBlueprintStrip();

  // =========================================================================
  // 10. PHOTO GALLERY (118 PHOTOS) + 5 STAGES + LIGHTBOX (#modal-photos)
  // =========================================================================
  const photoContainer = document.getElementById('photo-gallery-container');
  const photoCountBadge = document.getElementById('photo-count-badge');
  const lightbox = document.getElementById('photo-lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxStage = document.getElementById('lightbox-stage');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxDesc = document.getElementById('lightbox-desc');
  const lightboxExternalLink = document.getElementById('lightbox-external-link') || document.getElementById('lightbox-open-orig');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');

  let activePhotoStage = 'ALL';
  let filteredPhotosList = [...ALL_PROJECT_PHOTOS];
  let currentLightboxIndex = 0;

  const openLightboxAt = (index) => {
    if (!lightbox || filteredPhotosList.length === 0) return;
    currentLightboxIndex = (index + filteredPhotosList.length) % filteredPhotosList.length;
    const item = filteredPhotosList[currentLightboxIndex];
    if (lightboxImg) {
      lightboxImg.src = `${item.url}=w1600`;
      lightboxImg.alt = item.title;
    }
    if (lightboxStage) lightboxStage.textContent = `${item.stage} • Foto ${currentLightboxIndex + 1} de ${filteredPhotosList.length}`;
    if (lightboxTitle) lightboxTitle.textContent = item.title;
    if (lightboxDesc) lightboxDesc.textContent = item.desc;
    if (lightboxExternalLink) lightboxExternalLink.href = item.url;
    lightbox.classList.add('open');
  };

  const closeLightbox = () => {
    if (lightbox) lightbox.classList.remove('open');
  };

  const renderPhotoGallery = () => {
    if (!photoContainer) return;
    photoContainer.innerHTML = '';

    filteredPhotosList = ALL_PROJECT_PHOTOS.filter(
      (p) => activePhotoStage === 'ALL' || p.category === activePhotoStage
    );

    if (photoCountBadge) {
      photoCountBadge.textContent = `Mostrando ${filteredPhotosList.length} de ${ALL_PROJECT_PHOTOS.length} fotografías`;
    }

    filteredPhotosList.forEach((photo, idx) => {
      const card = document.createElement('div');
      card.className = 'photo-card';
      card.innerHTML = `
        <div style="position:relative;">
          <img src="${photo.url}=w500" loading="lazy" alt="${photo.title}">
          <span style="position:absolute; top:8px; left:8px; background:rgba(10,13,20,0.82); color:#67e8f9; padding:2px 7px; border-radius:4px; font-size:10px; font-weight:700; border:1px solid rgba(6,182,212,0.35);">
            #${photo.number}
          </span>
        </div>
        <div class="photo-card-info">
          <h4>${photo.title}</h4>
          <p>${photo.category} • ${photo.desc}</p>
        </div>
      `;
      card.addEventListener('click', () => openLightboxAt(idx));
      photoContainer.appendChild(card);
    });
  };

  document.querySelectorAll('#photo-stage-filters .computo-filter-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#photo-stage-filters .computo-filter-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      activePhotoStage = btn.getAttribute('data-photo-stage') || 'ALL';
      renderPhotoGallery();
    });
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxPrev) lightboxPrev.addEventListener('click', () => openLightboxAt(currentLightboxIndex - 1));
  if (lightboxNext) lightboxNext.addEventListener('click', () => openLightboxAt(currentLightboxIndex + 1));
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  window.addEventListener('keydown', (e) => {
    if (!lightbox || !lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    else if (e.key === 'ArrowLeft') openLightboxAt(currentLightboxIndex - 1);
    else if (e.key === 'ArrowRight') openLightboxAt(currentLightboxIndex + 1);
  });

  renderPhotoGallery();

  // =========================================================================
  // 11. FRIENDLY SUPPLIES & METRICS CALCULATOR (#modal-insumos)
  // =========================================================================
  const sliderLosa = document.getElementById('calc-slider-losa');
  const sliderMuro = document.getElementById('calc-slider-muro');
  const valLosaDisplay = document.getElementById('calc-val-losa');
  const valMuroDisplay = document.getElementById('calc-val-muro');
  const radioTechos = document.querySelectorAll('input[name="calc-techo"]');
  const radioCierres = document.querySelectorAll('input[name="calc-cierre"]');

  const supplyCemento = document.getElementById('supply-cemento');
  const supplyCementoTn = document.getElementById('supply-cemento-tn');
  const supplyHierro = document.getElementById('supply-hierro');
  const supplyArena = document.getElementById('supply-arena');
  const supplyArenaTruck = document.getElementById('supply-arena-truck');
  const supplyPiedra = document.getElementById('supply-piedra');
  const supplyPiedraTruck = document.getElementById('supply-piedra-truck');
  const supplyPiedraBruta = document.getElementById('supply-piedra-bruta');
  const supplyTechoM2 = document.getElementById('supply-techo-m2');
  const supplyTechoTipo = document.getElementById('supply-techo-tipo');
  const calcTotalGs = document.getElementById('calc-total-gs');
  const calcDiffDisplay = document.getElementById('calc-diff-display');
  const btnAplicarKpi = document.getElementById('btn-aplicar-kpi');
  const btnResetCalc = document.getElementById('btn-reset-calc');

  if (sliderLosa && sliderMuro) {
    const calculateSupplies = () => {
      const areaLosa = parseFloat(sliderLosa.value);
      const mlMuro = parseFloat(sliderMuro.value);
      const hMuro = 2.8;
      const areaMuro = mlMuro * hMuro;

      if (valLosaDisplay) valLosaDisplay.textContent = `${areaLosa} m²`;
      if (valMuroDisplay) valMuroDisplay.textContent = `${mlMuro} ml (${areaMuro.toFixed(1)} m²)`;

      let selectedTechoKey = 'isopanel';
      radioTechos.forEach((r) => {
        if (r.checked) selectedTechoKey = r.value;
      });
      const techoData = PARAMETROS_INSUMOS.techo[selectedTechoKey] || PARAMETROS_INSUMOS.techo.isopanel;

      let selectedCierreKey = 'basico';
      radioCierres.forEach((r) => {
        if (r.checked) selectedCierreKey = r.value;
      });
      const cierreData = PARAMETROS_INSUMOS.cerramiento[selectedCierreKey] || PARAMETROS_INSUMOS.cerramiento.basico;

      const cementoLosa = areaLosa * PARAMETROS_INSUMOS.losa.cementoBolsasPorM2;
      const cementoMuro = areaMuro * PARAMETROS_INSUMOS.muroContencion.cementoBolsasPorM2;
      const cementoRevoques = areaLosa * 1.8;
      const totalCementoBolsas = Math.round(cementoLosa + cementoMuro + cementoRevoques);
      const cementoTn = ((totalCementoBolsas * 50) / 1000).toFixed(1);

      const hierroLosa = areaLosa * PARAMETROS_INSUMOS.losa.hierroKgPorM2;
      const hierroMuro = mlMuro * PARAMETROS_INSUMOS.muroContencion.hierroKgPorMl;
      const hierroVigasAmarre = areaLosa * 12.5;
      const totalHierroKg = Math.round(hierroLosa + hierroMuro + hierroVigasAmarre);

      const arenaLosa = areaLosa * PARAMETROS_INSUMOS.losa.arenaM3PorM2;
      const arenaMuro = areaMuro * PARAMETROS_INSUMOS.muroContencion.arenaM3PorM2;
      const arenaRevoques = areaLosa * 0.12;
      const totalArenaM3 = (arenaLosa + arenaMuro + arenaRevoques).toFixed(1);
      const arenaCamiones = Math.ceil(totalArenaM3 / 6);

      const piedraLosa = areaLosa * PARAMETROS_INSUMOS.losa.piedraM3PorM2;
      const piedraVigas = areaLosa * 0.14;
      const totalPiedraM3 = (piedraLosa + piedraVigas).toFixed(1);
      const piedraCamiones = Math.ceil(totalPiedraM3 / 6);

      const totalPiedraBrutaM3 = (areaMuro * PARAMETROS_INSUMOS.muroContencion.piedraM3PorM2).toFixed(1);
      const areaTecho = Math.round(areaLosa * 1.25);

      const costoMuro =
        areaMuro * PARAMETROS_INSUMOS.muroContencion.costoM2MuroGs +
        mlMuro * PARAMETROS_INSUMOS.muroContencion.rellenoM3PorMl * PARAMETROS_INSUMOS.muroContencion.costoM3RellenoGs;
      const costoLosa = areaLosa * PARAMETROS_INSUMOS.losa.costoM2BaseGs;
      const costoTecho = areaTecho * techoData.costoM2Gs;
      const costoCierre = areaLosa * cierreData.costoM2Gs;
      const costoManoObraAdmin = (costoMuro + costoLosa + costoTecho + costoCierre) * 0.22;

      const costoTotalObra = Math.round(costoMuro + costoLosa + costoTecho + costoCierre + costoManoObraAdmin);

      if (supplyCemento) supplyCemento.textContent = formatGs(totalCementoBolsas);
      if (supplyCementoTn) supplyCementoTn.textContent = `~${cementoTn} toneladas`;
      if (supplyHierro) supplyHierro.textContent = formatGs(totalHierroKg);
      if (supplyArena) supplyArena.textContent = totalArenaM3;
      if (supplyArenaTruck) supplyArenaTruck.textContent = `~${arenaCamiones} camionadas (6m³)`;
      if (supplyPiedra) supplyPiedra.textContent = totalPiedraM3;
      if (supplyPiedraTruck) supplyPiedraTruck.textContent = `~${piedraCamiones} camionadas (6m³)`;
      if (supplyPiedraBruta) supplyPiedraBruta.textContent = totalPiedraBrutaM3;
      if (supplyTechoM2) supplyTechoM2.textContent = areaTecho;
      if (supplyTechoTipo) {
        supplyTechoTipo.textContent =
          techoData.nombre.split(' ')[0] + ' ' + (techoData.nombre.split(' ')[1] || '');
      }
      if (calcTotalGs) calcTotalGs.textContent = formatGs(costoTotalObra);

      const targetScenario = ESCENARIOS_INVERSION[activeScenarioKey] || ESCENARIOS_INVERSION.escenario300;
      const targetGs = targetScenario.montoObjetivoGs || 300000000;
      const diff = targetGs - costoTotalObra;

      if (calcDiffDisplay) {
        if (diff >= 0) {
          calcDiffDisplay.innerHTML = `<span class="badge-pill" style="border-color:#10b981; color:#34d399; font-weight:700;">● En rango para tu meta (${targetScenario.nombre.split(':')[0]}): Saldo disponible Gs. ${formatGs(diff)}</span>`;
        } else {
          calcDiffDisplay.innerHTML = `<span class="badge-pill" style="border-color:#ef4444; color:#fca5a5; font-weight:700;">▲ Excede tu meta (${targetScenario.nombre.split(':')[0]}) en Gs. ${formatGs(Math.abs(diff))}. Puedes reducir área o cambiar terminación.</span>`;
        }
      }

      return { costoTotalObra, areaLosa };
    };

    sliderLosa.addEventListener('input', calculateSupplies);
    sliderMuro.addEventListener('input', calculateSupplies);

    radioTechos.forEach((r) => {
      r.addEventListener('change', () => {
        document.querySelectorAll('input[name="calc-techo"]').forEach((i) => {
          const pill = i.closest('.calc-radio-pill');
          if (pill) pill.classList.toggle('selected', i.checked);
        });
        calculateSupplies();
      });
    });

    radioCierres.forEach((r) => {
      r.addEventListener('change', () => {
        document.querySelectorAll('input[name="calc-cierre"]').forEach((i) => {
          const pill = i.closest('.calc-radio-pill');
          if (pill) pill.classList.toggle('selected', i.checked);
        });
        calculateSupplies();
      });
    });

    if (btnResetCalc) {
      btnResetCalc.addEventListener('click', () => {
        sliderLosa.value = 65;
        sliderMuro.value = 14.5;
        const defaultTecho = document.getElementById('opt-techo-isopanel');
        const defaultCierre = document.getElementById('opt-cierre-basico');
        if (defaultTecho) defaultTecho.querySelector('input').checked = true;
        if (defaultCierre) defaultCierre.querySelector('input').checked = true;
        document.querySelectorAll('.calc-radio-pill').forEach((p) => p.classList.remove('selected'));
        if (defaultTecho) defaultTecho.classList.add('selected');
        if (defaultCierre) defaultCierre.classList.add('selected');
        calculateSupplies();
      });
    }

    if (btnAplicarKpi) {
      btnAplicarKpi.addEventListener('click', () => {
        const res = calculateSupplies();
        if (kpiTotalAmount) kpiTotalAmount.textContent = formatGs(res.costoTotalObra);
        if (kpiCostoM2) kpiCostoM2.textContent = `Gs. ${formatGs(Math.round(res.costoTotalObra / res.areaLosa))} / m²`;
        if (kpiObjectiveDesc) {
          kpiObjectiveDesc.textContent = `Ajuste personalizado: ${res.areaLosa}m² de losa + muro cochera + cubierta y cerramiento exterior.`;
        }
        closeModal(document.getElementById('modal-insumos'));
      });
    }

    calculateSupplies();
  }

  // =========================================================================
  // 12. GENERADOR DINÁMICO DE PLANOS OFICIALES VIVOS (4 LÁMINAS CAD) + VÍNCULO AL REPOSITORIO
  // =========================================================================
  const liveCadSvgHost = document.getElementById('live-cad-svg-host');
  const liveSheetStatusLabel = document.getElementById('live-sheet-status-label');
  let activeLiveSheetKey = 'sheet_pb';

  const LIVE_OFFICIAL_SHEETS = {
    sheet_pb: {
      code: 'LAM-01-PB',
      levelKey: 'planta_baja',
      title: '1. Planta Baja +100.00m con Hueco 38m² Loza Rap y Núcleo Húmedo Eje F-G',
      cota: '+100.00m (Galería L1 -0.45m)',
      highlights: [
        { x: -1.45, z: 3.10, w: 3.10, d: 1.65, color: '#0ea5e9', label: 'NÚCLEO HÚMEDO EJE F-G (Cocina + Toilette PB + Columna Ø100mm)' },
        { x: -2.00, z: 5.30, w: 6.80, d: 5.60, color: '#10b981', label: 'HUECO 38m² LOZA RAP (Estar-Comedor Integrado c/ Vista al Río)' },
        { x: -4.80, z: 1.50, w: 9.60, d: 1.50, color: '#f59e0b', label: 'PASILLO ANTIHUMEDAD 1.50m + REJILLA OXIGENACIÓN SUBSUELO' }
      ]
    },
    sheet_pa: {
      code: 'LAM-02-PA',
      levelKey: 'planta_alta',
      title: '2. Planta Alta +102.88m con 2 Dormitorios, Vestidor, 2 Baños y Desk al subir escalera',
      cota: '+102.88m (Cubierta +105.64m)',
      highlights: [
        { x: 1.80, z: 5.26, w: 2.00, d: 2.20, color: '#38bdf8', label: 'DESK / HOME-OFFICE AL SUBIR ESCALERA 1' },
        { x: -4.80, z: 7.40, w: 5.20, d: 5.80, color: '#a855f7', label: 'SUITE RUTH & LEO + VESTIDOR + BALCÓN AL RÍO' },
        { x: -4.80, z: 3.05, w: 4.10, d: 4.20, color: '#10b981', label: 'DORMITORIO 2 + 2 BAÑOS SUPERPUESTOS (EJE F-G)' }
      ]
    },
    sheet_sub: {
      code: 'LAM-03-SUB',
      levelKey: 'subsuelo',
      title: '3. Subsuelo +97.66m con Parrilla al Patio y Rejilla de Oxigenación',
      cota: '+97.66m (100.71 m² Libres bajo Losa 1)',
      highlights: [
        { x: -4.80, z: 1.50, w: 9.60, d: 1.50, color: '#22d3ee', label: 'REJILLA DE OXIGENACIÓN Y CÁMARA DE AIRE FRONTAL (z=1.50..3.00m)' },
        { x: -3.50, z: 10.10, w: 5.50, d: 3.10, color: '#f97316', label: 'PARRILLA INTEGRADA AL PATIO TRASERO Y GALERÍA INFERIOR' },
        { x: 1.20, z: 3.20, w: 3.50, d: 4.10, color: '#10b981', label: 'LAVADERO + CISTERNA 1.000L + PRESURIZADORA ROWA' }
      ]
    },
    sheet_mep: {
      code: 'LAM-04-MEP',
      levelKey: 'planta_baja',
      title: '4. Esquema Integrado Eléctrico y Pluvial/Sanitario Vertical',
      cota: 'Vertical 3 Niveles (+97.66m / +100.00m / +102.88m / +105.64m)',
      highlights: [
        { x: -1.60, z: 3.00, w: 3.20, d: 1.80, color: '#ec4899', label: 'COLUMNA VERTICAL EJE F-G (4 Pases Diamantados Losa 1 + Cloaca Ø100mm + PPR)' },
        { x: -4.85, z: 3.00, w: 9.70, d: 10.34, color: '#0284c7', label: 'RED PLUVIAL 165 mm/h (4 Bajadas Ø100mm -> Drenaje Francés -> Barranco)' },
        { x: -0.90, z: 4.80, w: 2.80, d: 2.40, color: '#ef4444', label: 'TABLERO SMART DIN TRIFÁSICO (Fases R/S/T + 26 Tomas + PoE Zigbee)' }
      ]
    }
  };

  const buildLiveOfficialSheetSvg = (sheetKey) => {
    const spec = LIVE_OFFICIAL_SHEETS[sheetKey] || LIVE_OFFICIAL_SHEETS.sheet_pb;
    const scale = 38;
    const originX = 210;
    const originZ = 75;
    const svgW = 860;
    const svgH = 740;
    const toX = (x) => Number((originX + (x + 5.0) * scale).toFixed(1));
    const toY = (z) => Number((originZ + (z + 1.0) * scale).toFixed(1));
    const dateStr = new Date().toISOString().slice(0, 10);

    const planMetrics = floorplanEditor && typeof floorplanEditor.computeFullMetrics === 'function'
      ? floorplanEditor.computeFullMetrics()
      : { activeRoomsAreaM2: 178.4, mamposteria15M2: 142, mamposteria20M2: 68, blindexM2: 24, totalProjectCostGs: 299832034 };

    const lvlData = floorplanEditor?.planData?.levels?.[spec.levelKey] || { rooms: [], walls: [] };
    const pases = DUCTOS_PASES_ENCHUFES_DATOS?.pasesLosa1Diamantados || [];
    const tableros = DUCTOS_PASES_ENCHUFES_DATOS?.tablerosYEquiposPrincipales || [];

    const out = [];
    out.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${svgW} ${svgH}" width="100%" height="100%" style="background:#071120; font-family:'IBM Plex Mono', monospace;">`);
    out.push(`<rect x="10" y="10" width="${svgW - 20}" height="${svgH - 20}" fill="#071120" stroke="#38bdf8" stroke-width="1.8"/>`);

    // Ejes X (9..1) y Ejes Z (G..A)
    const xAxes = [
      { id: '9', x: -4.87 }, { id: '8', x: -3.35 }, { id: '7', x: -2.02 },
      { id: '6', x: -1.64 }, { id: '5', x: -0.74 }, { id: '4', x: 1.69 },
      { id: '3', x: 2.39 }, { id: '2', x: 3.84 }, { id: '1', x: 4.87 }
    ];
    const zAxes = [
      { id: 'G', z: 3.00 }, { id: 'F', z: 3.51 }, { id: 'E', z: 4.77 },
      { id: 'D', z: 5.26 }, { id: 'C', z: 7.37 }, { id: 'B', z: 9.94 }, { id: 'A', z: 13.34 }
    ];

    xAxes.forEach((ax) => {
      const px = toX(ax.x);
      out.push(`<line x1="${px}" y1="${toY(0.5)}" x2="${px}" y2="${toY(14.2)}" stroke="#0284c7" stroke-width="0.7" stroke-dasharray="3,3" opacity="0.65"/>`);
      out.push(`<circle cx="${px}" cy="${toY(0.2)}" r="8" fill="#0f172a" stroke="#38bdf8" stroke-width="1"/>`);
      out.push(`<text x="${px}" y="${toY(0.2) + 3}" fill="#38bdf8" font-size="8.5" font-weight="bold" text-anchor="middle">${ax.id}</text>`);
    });

    zAxes.forEach((az) => {
      const py = toY(az.z);
      out.push(`<line x1="${toX(-5.3)}" y1="${py}" x2="${toX(5.3)}" y2="${py}" stroke="#0284c7" stroke-width="0.7" stroke-dasharray="3,3" opacity="0.65"/>`);
      out.push(`<circle cx="${toX(-5.6)}" cy="${py}" r="8" fill="#0f172a" stroke="#38bdf8" stroke-width="1"/>`);
      out.push(`<text x="${toX(-5.6)}" y="${py + 3}" fill="#38bdf8" font-size="8.5" font-weight="bold" text-anchor="middle">${az.id}</text>`);
      out.push(`<text x="${toX(-6.0)}" y="${py + 3}" fill="#94a3b8" font-size="7.5" text-anchor="end">z=${az.z.toFixed(2)}m</text>`);
    });

    // Ambientes vivos del nivel
    (lvlData.rooms || []).forEach((r) => {
      const rx = toX(r.x);
      const ry = toY(r.z);
      const rw = (r.w * scale).toFixed(1);
      const rd = (r.d * scale).toFixed(1);
      out.push(`<rect x="${rx}" y="${ry}" width="${rw}" height="${rd}" fill="rgba(56,189,248,0.08)" stroke="#38bdf8" stroke-width="1.1"/>`);
      out.push(`<text x="${rx + Number(rw) / 2}" y="${ry + Number(rd) / 2}" fill="#e2e8f0" font-size="8" font-weight="bold" text-anchor="middle">${r.name}</text>`);
    });

    // Bloques destacados del ajuste actual
    spec.highlights.forEach((hl) => {
      const hx = toX(hl.x);
      const hy = toY(hl.z);
      const hw = (hl.w * scale).toFixed(1);
      const hd = (hl.d * scale).toFixed(1);
      out.push(`<rect x="${hx}" y="${hy}" width="${hw}" height="${hd}" fill="${hl.color}22" stroke="${hl.color}" stroke-width="1.8" stroke-dasharray="5,3"/>`);
      out.push(`<text x="${hx + Number(hw) / 2}" y="${hy + Number(hd) / 2 + 3}" fill="#ffffff" font-size="8.5" font-weight="bold" text-anchor="middle">${hl.label}</text>`);
    });

    // Muros vivos del editor
    (lvlData.walls || []).forEach((w) => {
      out.push(`<line x1="${toX(w.x1)}" y1="${toY(w.z1)}" x2="${toX(w.x2)}" y2="${toY(w.z2)}" stroke="#f8fafc" stroke-width="3" stroke-linecap="round"/>`);
    });

    // Pases diamantados y tableros en lámina MEP o PB
    pases.forEach((p) => {
      const [px3, , pz3] = p.pos3D || [0, 0, 3.5];
      const cx = toX(px3);
      const cy = toY(pz3);
      out.push(`<circle cx="${cx}" cy="${cy}" r="6" fill="#ec4899" stroke="#fff" stroke-width="1.2"/>`);
      out.push(`<text x="${cx + 9}" y="${cy + 3}" fill="#f472b6" font-size="7.5" font-weight="bold">${p.codigo}</text>`);
    });

    if (sheetKey === 'sheet_mep') {
      tableros.forEach((tb) => {
        const [tx3, , tz3] = tb.pos3D || [0, 0, 4.0];
        const tx = toX(tx3);
        const ty = toY(tz3);
        out.push(`<rect x="${tx - 6}" y="${ty - 5}" width="12" height="10" fill="#ef4444" stroke="#fff" stroke-width="1"/>`);
        out.push(`<text x="${tx}" y="${ty + 13}" fill="#fde68a" font-size="7.5" font-weight="bold" text-anchor="middle">${tb.codigo}</text>`);
      });
    }

    // Rótulo oficial dinámico al pie
    const rotY = svgH - 102;
    out.push(`<rect x="20" y="${rotY}" width="${svgW - 40}" height="84" fill="#0f172a" stroke="#38bdf8" stroke-width="1.4"/>`);
    out.push(`<text x="34" y="${rotY + 20}" fill="#38bdf8" font-size="11.5" font-weight="bold">PLANO OFICIAL VIVO (${spec.code}): ${spec.title}</text>`);
    out.push(`<text x="34" y="${rotY + 38}" fill="#e2e8f0" font-size="9.5">COTA: ${spec.cota} | ESCALA CAD: 1:50 | GENERADO EN VIVO: ${dateStr} | ESCENARIO: ${activeScenarioKey.toUpperCase()}</text>`);
    out.push(`<text x="34" y="${rotY + 56}" fill="#fde68a" font-size="9.5" font-weight="bold">MÉTRICAS VIVAS: Área Activa ${planMetrics.activeRoomsAreaM2} m² · Muros 15cm: ${planMetrics.mamposteria15M2}m² · 20cm: ${planMetrics.mamposteria20M2}m² · Blindex: ${planMetrics.blindexM2}m²</text>`);
    out.push(`<text x="34" y="${rotY + 73}" fill="#34d399" font-size="9.5" font-weight="bold">PRESUPUESTO SINCRONIZADO: Gs. ${formatGs(planMetrics.totalProjectCostGs)} — Rehecho dinámicamente según ajustes de obra</text>`);
    out.push(`</svg>`);
    return out.join('\n');
  };

  const renderLiveOfficialSheet = (sheetKey) => {
    activeLiveSheetKey = sheetKey || activeLiveSheetKey;
    document.querySelectorAll('#live-sheet-tabs [data-live-sheet]').forEach((btn) => {
      btn.classList.toggle('active', btn.getAttribute('data-live-sheet') === activeLiveSheetKey);
    });
    if (liveCadSvgHost) {
      liveCadSvgHost.innerHTML = buildLiveOfficialSheetSvg(activeLiveSheetKey);
    }
    const spec = LIVE_OFFICIAL_SHEETS[activeLiveSheetKey] || LIVE_OFFICIAL_SHEETS.sheet_pb;
    if (liveSheetStatusLabel) {
      liveSheetStatusLabel.textContent = `✅ ${spec.title} — Regenerado en vivo (${new Date().toLocaleTimeString('es-PY')}).`;
    }
  };

  document.querySelectorAll('#live-sheet-tabs [data-live-sheet]').forEach((btn) => {
    btn.addEventListener('click', () => {
      renderLiveOfficialSheet(btn.getAttribute('data-live-sheet'));
    });
  });

  const downloadLiveSheetSvg = (sheetKey = activeLiveSheetKey) => {
    const spec = LIVE_OFFICIAL_SHEETS[sheetKey] || LIVE_OFFICIAL_SHEETS.sheet_pb;
    const svgContent = buildLiveOfficialSheetSvg(sheetKey);
    const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${spec.code}_itapytapunta_vivo.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const btnDownloadLiveSvg = document.getElementById('btn-download-live-svg');
  if (btnDownloadLiveSvg) {
    btnDownloadLiveSvg.addEventListener('click', () => downloadLiveSheetSvg(activeLiveSheetKey));
  }

  const btnDownloadLivePng = document.getElementById('btn-download-live-png');
  if (btnDownloadLivePng) {
    btnDownloadLivePng.addEventListener('click', () => {
      const spec = LIVE_OFFICIAL_SHEETS[activeLiveSheetKey] || LIVE_OFFICIAL_SHEETS.sheet_pb;
      const svgContent = buildLiveOfficialSheetSvg(activeLiveSheetKey);
      const img = new Image();
      const svgBlob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 1720;
        canvas.height = 1480;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#071120';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        URL.revokeObjectURL(url);
        const a = document.createElement('a');
        a.href = canvas.toDataURL('image/png');
        a.download = `${spec.code}_itapytapunta_vivo.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      };
      img.src = url;
    });
  }

  const triggerLiveCadPackGeneration = () => {
    if (floorplanEditor && typeof floorplanEditor.exportOfficialBlueprintsPackSVG === 'function') {
      floorplanEditor.exportOfficialBlueprintsPackSVG();
    } else {
      renderLiveOfficialSheet(activeLiveSheetKey);
      openModal('modal-planos');
    }
  };

  const btnLiveCadTop = document.getElementById('btn-live-cad-sheets');
  const btnModalLiveCad = document.getElementById('btn-modal-live-cad-sheets');
  const btnExportPack4 = document.getElementById('btn-export-pack-4-sheets');

  if (btnLiveCadTop) {
    btnLiveCadTop.addEventListener('click', () => {
      renderLiveOfficialSheet('sheet_pb');
      openModal('modal-planos');
      if (floorplanEditor && typeof floorplanEditor.exportOfficialBlueprintsPackSVG === 'function') {
        floorplanEditor.exportOfficialBlueprintsPackSVG();
      }
    });
  }
  if (btnModalLiveCad) {
    btnModalLiveCad.addEventListener('click', () => {
      closeModal(document.getElementById('modal-simulador'));
      renderLiveOfficialSheet('sheet_pb');
      openModal('modal-planos');
    });
  }
  if (btnExportPack4) {
    btnExportPack4.addEventListener('click', () => {
      if (floorplanEditor && typeof floorplanEditor.exportOfficialBlueprintsPackSVG === 'function') {
        floorplanEditor.exportOfficialBlueprintsPackSVG();
      } else {
        Object.keys(LIVE_OFFICIAL_SHEETS).forEach((k) => downloadLiveSheetSvg(k));
      }
    });
  }

  const btnOpen2dFromPlanos = document.getElementById('btn-open-2d-editor-from-planos');
  if (btnOpen2dFromPlanos) {
    btnOpen2dFromPlanos.addEventListener('click', () => {
      closeModal(document.getElementById('modal-planos'));
      openModal('modal-editor-2d');
    });
  }

  // Botones de acceso al Repositorio de Archivos Originales
  const openHistoricalRepository = () => {
    closeModal(document.getElementById('modal-simulador'));
    renderLiveOfficialSheet(activeLiveSheetKey);
    openModal('modal-planos');
    const drawer = document.getElementById('historical-repo-drawer');
    if (drawer) {
      drawer.style.display = 'block';
      drawer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const btnOpenRepoTop = document.getElementById('btn-open-repo-links');
  const btnModalRepoLink = document.getElementById('btn-modal-repo-link');
  const btnToggleHistoricalRepo = document.getElementById('btn-toggle-historical-repo');

  if (btnOpenRepoTop) btnOpenRepoTop.addEventListener('click', openHistoricalRepository);
  if (btnModalRepoLink) btnModalRepoLink.addEventListener('click', openHistoricalRepository);
  if (btnToggleHistoricalRepo) {
    btnToggleHistoricalRepo.addEventListener('click', () => {
      const drawer = document.getElementById('historical-repo-drawer');
      if (drawer) {
        const isHidden = drawer.style.display === 'none';
        drawer.style.display = isHidden ? 'block' : 'none';
      }
    });
  }

  renderLiveOfficialSheet('sheet_pb');

  // =========================================================================
  // 13. MODO JUEGO / RECORRIDO HIPERREALISTA ESTILO GTA VI (#gta-game-hud)
  // =========================================================================
  const btnToggleGameModeTop = document.getElementById('btn-toggle-game-mode');
  const btnSidebarGameMode = document.getElementById('btn-sidebar-game-mode');
  const btnGtaExit = document.getElementById('btn-gta-exit');
  const gtaHud = document.getElementById('gta-game-hud');
  const gtaLevelTitle = document.getElementById('gta-hud-level-title');
  const gtaCoordsText = document.getElementById('gta-hud-coords');
  const gtaPromptText = document.getElementById('gta-prompt-text');
  const gtaCamModeBadge = document.getElementById('gta-cam-mode-badge');
  const gtaRadarCanvas = document.getElementById('gta-radar-canvas');

  let gtaModeActive = false;
  let gtaThirdPerson = false;
  let gtaCurrentLevelNum = 2; // 1 = Subsuelo (+97.66m), 2 = PB (+100.00m), 3 = PA (+102.88m)
  const gtaPlayer = {
    x: 0.0,
    y: 1.65,
    z: 6.2,
    yaw: 0.0,
    pitch: 0.0
  };
  const gtaKeys = {};
  const gtaInteractStates = {
    porton_balancin: false,
    porton_peatonal: false,
    luces_domotica: true,
    griferia_ducha: false,
    parrilla_subsuelo: false
  };

  const GTA_ZONES = [
    { name: 'Cochera con Pérgola y Portón 2.30m', level: 2, cota: '+100.00m', xMin: -4.9, xMax: 4.9, zMin: -4.0, zMax: 1.5, prompt: '[E] Abrir/Cerrar Portón Balancín 2.30m', action: 'porton_balancin' },
    { name: 'Pasillo Antihumedad y Rejilla Oxigenación', level: 2, cota: '+100.00m', xMin: -4.9, xMax: 4.9, zMin: 1.5, zMax: 3.0, prompt: '[E] Abrir Portoncito Peatonal', action: 'porton_peatonal' },
    { name: 'Cocina y Baño Social (Núcleo Eje F-G)', level: 2, cota: '+100.00m', xMin: -4.9, xMax: 2.5, zMin: 3.0, zMax: 5.3, prompt: '[E] Probar Grifería/Ducha', action: 'griferia_ducha' },
    { name: 'Estar-Comedor (Hueco 38m² Losa Rap)', level: 2, cota: '+100.00m', xMin: -4.9, xMax: 3.8, zMin: 5.3, zMax: 9.94, prompt: '[E] Encender/Apagar Luces', action: 'luces_domotica' },
    { name: 'Escalera 1 y Escalera 2 (Ejes 1-2)', level: 2, cota: '+100.00m', xMin: 3.4, xMax: 4.9, zMin: 3.0, zMax: 9.94, prompt: '[1/2/3] Subir a Planta Alta o Bajar al Subsuelo', action: 'luces_domotica' },
    { name: 'Galería Panorámica al Río Paraguay', level: 2, cota: '+99.55m', xMin: -4.9, xMax: 4.9, zMin: 9.94, zMax: 14.0, prompt: '[E] Encender/Apagar Luces', action: 'luces_domotica' },
    { name: 'Escritorio / Desk al Subir Escalera', level: 3, cota: '+102.88m', xMin: 0.8, xMax: 4.9, zMin: 3.0, zMax: 7.4, prompt: '[E] Encender/Apagar Luces', action: 'luces_domotica' },
    { name: '2 Baños Superpuestos y Dormitorio 2', level: 3, cota: '+102.88m', xMin: -4.9, xMax: 0.8, zMin: 3.0, zMax: 7.4, prompt: '[E] Probar Grifería/Ducha', action: 'griferia_ducha' },
    { name: 'Suite Ruth & Leo + Vestidor al Río', level: 3, cota: '+102.88m', xMin: -4.9, xMax: 4.9, zMin: 7.4, zMax: 13.4, prompt: '[E] Encender/Apagar Luces', action: 'luces_domotica' },
    { name: 'Subsuelo — Rejilla Oxigenación y Lavadero', level: 1, cota: '+97.66m', xMin: -4.9, xMax: 4.9, zMin: 1.5, zMax: 8.5, prompt: '[E] Probar Grifería/Ducha', action: 'griferia_ducha' },
    { name: 'Subsuelo — Parrilla al Patio', level: 1, cota: '+97.66m', xMin: -4.9, xMax: 4.9, zMin: 8.5, zMax: 14.5, prompt: '[E] Encender Parrilla Subsuelo', action: 'parrilla_subsuelo' }
  ];

  const getActiveGtaZone = () => {
    const zMatch = GTA_ZONES.find(
      (zn) =>
        zn.level === gtaCurrentLevelNum &&
        gtaPlayer.x >= zn.xMin &&
        gtaPlayer.x <= zn.xMax &&
        gtaPlayer.z >= zn.zMin &&
        gtaPlayer.z <= zn.zMax
    );
    if (zMatch) return zMatch;
    if (gtaCurrentLevelNum === 1) {
      return { name: 'Subsuelo — Parrilla Patio', cota: '+97.66m', prompt: '[E] Encender Parrilla Subsuelo', action: 'parrilla_subsuelo' };
    }
    if (gtaCurrentLevelNum === 3) {
      return { name: 'Planta Alta — Escritorio y Suite', cota: '+102.88m', prompt: '[E] Encender/Apagar Luces', action: 'luces_domotica' };
    }
    return { name: 'Nivel Calle — Estar', cota: '+100.00m', prompt: '[E] Abrir/Cerrar Portón Balancín 2.30m', action: 'porton_balancin' };
  };

  const setGtaLevel = (lvlNum) => {
    gtaCurrentLevelNum = Number(lvlNum) || 2;
    if (gtaCurrentLevelNum === 1) {
      gtaPlayer.y = -0.70; // Subsuelo +97.66m
      if (scene.playerPos) scene.playerPos.set(1.2, -2.34, 8.2);
      scene.playerLevelIndex = 1;
      scene.setFloorCutaway('cut_pb');
    } else if (gtaCurrentLevelNum === 3) {
      gtaPlayer.y = 4.52; // Planta Alta +102.88m
      if (scene.playerPos) scene.playerPos.set(0.8, 2.88, 6.4);
      scene.playerLevelIndex = 3;
      scene.setFloorCutaway('cut_roof');
    } else {
      gtaPlayer.y = 1.65; // Nivel Calle +100.00m
      if (scene.playerPos) scene.playerPos.set(0.0, 0.0, 6.5);
      scene.playerLevelIndex = 2;
      scene.setFloorCutaway('cut_pa');
    }
    document.querySelectorAll('.gta-lvl-btn[data-gta-level]').forEach((b) => {
      b.classList.toggle('active', Number(b.getAttribute('data-gta-level')) === gtaCurrentLevelNum);
    });
  };

  const executeGtaContextualInteraction = (forcedAction = null) => {
    const zone = getActiveGtaZone();
    const act = forcedAction || zone.action || 'porton_balancin';
    gtaInteractStates[act] = !gtaInteractStates[act];
    const isOn = gtaInteractStates[act];

    if (typeof scene.triggerGameInteraction === 'function') {
      scene.triggerGameInteraction(act, isOn);
    }

    if (act === 'luces_domotica') {
      scene.setTimeOfDay && scene.setTimeOfDay(isOn ? 20.5 : 16.5);
    } else if (act === 'griferia_ducha') {
      scene.setLayerVisibility('pluvial', true);
      if (typeof scene.setPluvialSimulationState === 'function') {
        scene.setPluvialSimulationState({ mode: 'presion_agua', active: isOn });
      }
    }

    const labels = {
      porton_balancin: isOn ? '✅ Portón Balancín 2.30m ABIERTO' : '🔒 Portón Balancín 2.30m CERRADO',
      porton_peatonal: isOn ? '✅ Portoncito Peatonal ABIERTO' : '🔒 Portoncito Peatonal CERRADO',
      luces_domotica: isOn ? '💡 Luces Domótica Zigbee ENCENDIDAS' : '🌑 Luces Domótica APAGADAS',
      griferia_ducha: isOn ? '🚿 Grifería/Ducha Eje F-G en Prueba (3.2 bar)' : '🚰 Grifería/Ducha Cerrada',
      parrilla_subsuelo: isOn ? '🔥 Parrilla del Subsuelo ENCENDIDA' : '💨 Parrilla del Subsuelo Apagada'
    };
    if (gtaPromptText) {
      gtaPromptText.textContent = labels[act] || zone.prompt;
    }
  };

  const drawGtaRadarMinimap = () => {
    if (!gtaRadarCanvas) return;
    const ctx = gtaRadarCanvas.getContext('2d');
    const w = gtaRadarCanvas.width;
    const h = gtaRadarCanvas.height;
    ctx.clearRect(0, 0, w, h);

    // Fondo radar circular
    ctx.fillStyle = '#071120';
    ctx.fillRect(0, 0, w, h);

    const mapToRadar = (wx, wz) => ({
      rx: w / 2 + wx * 12.5,
      ry: 38 + (wz + 4.0) * 8.2
    });

    // Sectores del lote en el radar
    const radarZones = [
      { label: 'Cochera / Pérgola', x: -4.8, z: -4.0, w: 9.6, d: 5.5, color: 'rgba(148,163,184,0.22)' },
      { label: 'Rejilla Oxig.', x: -4.8, z: 1.5, w: 9.6, d: 1.5, color: 'rgba(34,211,238,0.25)' },
      { label: 'Núcleo F-G', x: -4.8, z: 3.0, w: 7.2, d: 2.2, color: 'rgba(14,165,233,0.28)' },
      { label: 'Estar / Suite', x: -4.8, z: 5.2, w: 8.2, d: 4.7, color: 'rgba(16,185,129,0.24)' },
      { label: 'Esc. 1-2', x: 3.4, z: 3.0, w: 1.4, d: 6.9, color: 'rgba(245,158,11,0.32)' },
      { label: 'Parrilla / Galería', x: -4.8, z: 9.9, w: 9.6, d: 3.5, color: 'rgba(249,115,22,0.26)' }
    ];

    radarZones.forEach((rz) => {
      const p = mapToRadar(rz.x, rz.z);
      const rw = rz.w * 12.5;
      const rd = rz.d * 8.2;
      ctx.fillStyle = rz.color;
      ctx.strokeStyle = 'rgba(56,189,248,0.45)';
      ctx.lineWidth = 1;
      ctx.fillRect(p.rx, p.ry, rw, rd);
      ctx.strokeRect(p.rx, p.ry, rw, rd);
      ctx.fillStyle = '#cbd5e1';
      ctx.font = 'bold 7.5px IBM Plex Mono, monospace';
      ctx.fillText(rz.label, p.rx + 4, p.ry + 11);
    });

    // Posición y cono de mirada del jugador
    const pl = mapToRadar(gtaPlayer.x, gtaPlayer.z);
    ctx.save();
    ctx.translate(pl.rx, pl.ry);
    ctx.rotate(gtaPlayer.yaw);

    // Cono de visión
    ctx.fillStyle = 'rgba(52, 211, 153, 0.28)';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-16, 28);
    ctx.lineTo(16, 28);
    ctx.closePath();
    ctx.fill();

    // Punto del jugador
    ctx.fillStyle = '#10b981';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, 5.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  };

  const setGtaGameMode = (enable) => {
    gtaModeActive = Boolean(enable);
    if (typeof scene.toggleGameMode === 'function') {
      scene.toggleGameMode(gtaModeActive);
    }
    if (gtaHud) {
      gtaHud.style.display = gtaModeActive ? 'block' : 'none';
    }
    if (btnToggleGameModeTop) {
      btnToggleGameModeTop.setAttribute('data-game-active', gtaModeActive ? 'on' : 'off');
      btnToggleGameModeTop.innerHTML = gtaModeActive
        ? '<span>🎮 Salir Modo GTA (ESC)</span>'
        : '<span>🎮 Modo Juego (Recorrido GTA)</span>';
    }
    if (gtaModeActive) {
      setGtaLevel(2);
      drawGtaRadarMinimap();
    } else {
      scene.setFloorCutaway('full');
    }
  };

  if (btnToggleGameModeTop) {
    btnToggleGameModeTop.addEventListener('click', () => setGtaGameMode(!gtaModeActive));
  }
  if (btnSidebarGameMode) {
    btnSidebarGameMode.addEventListener('click', () => setGtaGameMode(!gtaModeActive));
  }
  if (btnGtaExit) {
    btnGtaExit.addEventListener('click', () => setGtaGameMode(false));
  }

  document.querySelectorAll('.gta-lvl-btn[data-gta-level]').forEach((btn) => {
    btn.addEventListener('click', () => setGtaLevel(Number(btn.getAttribute('data-gta-level'))));
  });

  document.querySelectorAll('.gta-action-chip[data-gta-action]').forEach((chip) => {
    chip.addEventListener('click', () => {
      const act = chip.getAttribute('data-gta-action');
      chip.classList.toggle('active');
      executeGtaContextualInteraction(act);
    });
  });

  if (gtaCamModeBadge) {
    gtaCamModeBadge.addEventListener('click', () => {
      gtaThirdPerson = !gtaThirdPerson;
      scene.gameCameraPerson = gtaThirdPerson ? '3rd' : '1st';
      if (scene.playerAvatar) {
        scene.playerAvatar.visible = gtaModeActive && gtaThirdPerson;
      }
      gtaCamModeBadge.textContent = gtaThirdPerson ? '3ra Persona' : '1ra Persona';
    });
  }

  window.addEventListener('keydown', (e) => {
    if (!gtaModeActive) return;
    const k = e.key.toLowerCase();
    gtaKeys[k] = true;
    if (e.key === 'Escape') {
      setGtaGameMode(false);
    } else if (k === 'c') {
      gtaThirdPerson = scene.gameCameraPerson === '3rd';
      if (gtaCamModeBadge) gtaCamModeBadge.textContent = gtaThirdPerson ? '3ra Persona' : '1ra Persona';
    } else if (k === '1') {
      setGtaLevel(1);
    } else if (k === '2') {
      setGtaLevel(2);
    } else if (k === '3') {
      setGtaLevel(3);
    }
  });

  window.addEventListener('keyup', (e) => {
    gtaKeys[e.key.toLowerCase()] = false;
  });

  // Loop de sincronización del HUD Modo Juego GTA VI con la física de colisiones de scene.js
  const updateGtaWalkLoop = () => {
    if (gtaModeActive) {
      if (scene.playerPos) {
        gtaPlayer.x = scene.playerPos.x;
        gtaPlayer.y = scene.playerPos.y + 1.65;
        gtaPlayer.z = scene.playerPos.z;
      }
      if (typeof scene.playerYaw === 'number') {
        gtaPlayer.yaw = scene.playerYaw;
      }
      if (typeof scene.playerLevelIndex === 'number' && scene.playerLevelIndex !== gtaCurrentLevelNum) {
        gtaCurrentLevelNum = scene.playerLevelIndex;
        document.querySelectorAll('.gta-lvl-btn[data-gta-level]').forEach((b) => {
          b.classList.toggle('active', Number(b.getAttribute('data-gta-level')) === gtaCurrentLevelNum);
        });
      }

      const zone = getActiveGtaZone();
      const levelPrefix =
        gtaCurrentLevelNum === 1
          ? 'Subsuelo +97.66m'
          : gtaCurrentLevelNum === 3
            ? 'Planta Alta +102.88m'
            : 'Nivel Calle +100.00m';
      if (gtaLevelTitle) {
        gtaLevelTitle.textContent = `${levelPrefix} — ${zone.name}`;
      }
      if (gtaCoordsText) {
        gtaCoordsText.textContent = `X: ${gtaPlayer.x.toFixed(2)}m · Z: ${gtaPlayer.z.toFixed(2)}m · Cota: ${zone.cota}`;
      }
      if (gtaPromptText && !gtaPromptText.textContent.startsWith('✅') && !gtaPromptText.textContent.startsWith('🔒')) {
        gtaPromptText.textContent = zone.prompt;
      }

      drawGtaRadarMinimap();
    }
    requestAnimationFrame(updateGtaWalkLoop);
  };
  requestAnimationFrame(updateGtaWalkLoop);

  // =========================================================================
  // 14. SIMULADOR INTERACTIVO POR CAPAS (ELÉCTRICA + PLUVIAL/HIDROSANITARIA)
  // =========================================================================
  const pluvialSimState = {
    tormenta: false,
    presion_agua: false,
    descarga_cloacal: false
  };

  const electricalSimState = {
    fase_r: true,
    fase_s: true,
    fase_t: true,
    fuga_30ma: false,
    sobretemp_65c: false,
    inundacion_subsuelo: false
  };

  const btnStopAllSims = document.getElementById('btn-stop-all-sims');
  const btnHeaderStopSims = document.getElementById('btn-header-stop-sims');

  const syncStopSimulationsButtonState = () => {
    const anyActive = isAnyMepSimulationActive(pluvialSimState, electricalSimState);
    if (btnHeaderStopSims) {
      btnHeaderStopSims.style.display = anyActive ? 'inline-flex' : 'none';
    }
    if (btnStopAllSims) {
      btnStopAllSims.style.opacity = anyActive ? '1' : '0.65';
    }
  };

  const updatePluvialSimulationUI = () => {
    const flowEl = document.getElementById('mep-metric-flow');
    const pressEl = document.getElementById('mep-metric-pressure');
    const sewerEl = document.getElementById('mep-metric-sewer');
    const badgeEl = document.getElementById('mep-live-pluvial-badge');

    let flowLs = 0;
    if (pluvialSimState.tormenta) flowLs += 8.65;
    if (pluvialSimState.presion_agua) flowLs += 0.85;
    if (pluvialSimState.descarga_cloacal) flowLs += 1.60;

    const pressureBar = pluvialSimState.presion_agua ? 3.2 : 2.8;
    const sewerStatus = pluvialSimState.descarga_cloacal ? 'Descargando 1.6 L/s' : 'Libre OK';
    const anyActive = pluvialSimState.tormenta || pluvialSimState.presion_agua || pluvialSimState.descarga_cloacal;

    if (flowEl) flowEl.textContent = `${flowLs.toFixed(2)} L/s`;
    if (pressEl) pressEl.textContent = `${pressureBar.toFixed(1)} bar`;
    if (sewerEl) sewerEl.textContent = sewerStatus;
    if (badgeEl) {
      badgeEl.textContent = anyActive ? 'Flujo Activo 3D' : 'En Espera';
      badgeEl.style.borderColor = anyActive ? '#38bdf8' : '';
      badgeEl.style.color = anyActive ? '#7dd3fc' : '';
    }

    // Asegurar visibilidad de las capas pluvial y ductos en el modelo 3D cuando hay flujo activo
    if (anyActive) {
      scene.setLayerVisibility('pluvial', true);
      scene.setLayerVisibility('ductos', true);
      const chkPluv = document.getElementById('layer-pluvial');
      const chkDuct = document.getElementById('layer-ductos');
      if (chkPluv) chkPluv.checked = true;
      if (chkDuct) chkDuct.checked = true;
    }

    if (typeof scene.setPluvialSimulationState === 'function') {
      if (!anyActive) {
        scene.setPluvialSimulationState('off');
      } else {
        scene.setPluvialSimulationState({ ...pluvialSimState, caudalLs: flowLs, presionBar: pressureBar });
      }
    }
    syncStopSimulationsButtonState();
  };

  const updateElectricalSimulationUI = () => {
    const kwEl = document.getElementById('mep-metric-kw');
    const ampsEl = document.getElementById('mep-metric-amps');
    const breakerEl = document.getElementById('mep-metric-breaker');
    const badgeEl = document.getElementById('mep-live-elec-badge');

    const hasFault = electricalSimState.fuga_30ma || electricalSimState.sobretemp_65c || electricalSimState.inundacion_subsuelo;

    const ampR = !hasFault && electricalSimState.fase_r ? 9.2 : 0.0;
    const ampS = !hasFault && electricalSimState.fase_s ? 8.4 : 0.0;
    const ampT = !hasFault && electricalSimState.fase_t ? 4.5 : 0.0;
    const totalKw = ((ampR + ampS + ampT) * 220) / 1000;

    if (kwEl) kwEl.textContent = `${totalKw.toFixed(2)} kW`;
    if (ampsEl) ampsEl.textContent = `${ampR.toFixed(1)}A / ${ampS.toFixed(1)}A / ${ampT.toFixed(1)}A`;

    if (breakerEl && badgeEl) {
      if (electricalSimState.fuga_30ma) {
        breakerEl.textContent = 'CORTE DIF. 30mA';
        breakerEl.style.color = '#f87171';
        badgeEl.textContent = '⚠️ Fuga 30mA Cortada';
        badgeEl.style.borderColor = '#ef4444';
        badgeEl.style.color = '#fca5a5';
      } else if (electricalSimState.sobretemp_65c) {
        breakerEl.textContent = 'CORTE TÉRM. >65°C';
        breakerEl.style.color = '#fb923c';
        badgeEl.textContent = '🔥 Alerta >65°C Toma 20A';
        badgeEl.style.borderColor = '#f97316';
        badgeEl.style.color = '#fdba74';
      } else if (electricalSimState.inundacion_subsuelo) {
        breakerEl.textContent = 'BOMBA BLOQUEADA';
        breakerEl.style.color = '#38bdf8';
        badgeEl.textContent = '🌊 Inundación Subsuelo';
        badgeEl.style.borderColor = '#0284c7';
        badgeEl.style.color = '#7dd3fc';
      } else {
        breakerEl.textContent = 'Cerrado OK';
        breakerEl.style.color = '#34d399';
        badgeEl.textContent = 'DIN Normal (220V)';
        badgeEl.style.borderColor = '#10b981';
        badgeEl.style.color = '#6ee7b7';
      }
    }

    scene.setLayerVisibility('ductos', true);
    scene.setLayerVisibility('senalesDebiles', true);
    const chkDuct = document.getElementById('layer-ductos');
    const chkSen = document.getElementById('layer-senales');
    if (chkDuct) chkDuct.checked = true;
    if (chkSen) chkSen.checked = true;

    if (typeof scene.setElectricalSimulationState === 'function') {
      scene.setElectricalSimulationState({
        ...electricalSimState,
        potenciaKw: totalKw,
        amps: { R: ampR, S: ampS, T: ampT }
      });
    }
    syncStopSimulationsButtonState();
  };

  const stopAllMepSimulations = () => {
    pluvialSimState.tormenta = false;
    pluvialSimState.presion_agua = false;
    pluvialSimState.descarga_cloacal = false;

    electricalSimState.fase_r = true;
    electricalSimState.fase_s = true;
    electricalSimState.fase_t = true;
    electricalSimState.fuga_30ma = false;
    electricalSimState.sobretemp_65c = false;
    electricalSimState.inundacion_subsuelo = false;

    document.querySelectorAll('[data-pluv-sim]').forEach((btn) => {
      btn.classList.remove('active');
    });
    document.querySelectorAll('[data-elec-sim]').forEach((btn) => {
      const key = btn.getAttribute('data-elec-sim');
      const isPhase = key === 'fase_r' || key === 'fase_s' || key === 'fase_t';
      btn.classList.toggle('active', isPhase);
    });

    updatePluvialSimulationUI();
    updateElectricalSimulationUI();
    if (typeof scene.setPluvialSimulationState === 'function') {
      scene.setPluvialSimulationState('off');
    }
    if (typeof scene.setElectricalSimulationState === 'function') {
      scene.setElectricalSimulationState('off');
    }
    syncStopSimulationsButtonState();
  };

  if (btnStopAllSims) {
    btnStopAllSims.addEventListener('click', stopAllMepSimulations);
  }
  if (btnHeaderStopSims) {
    btnHeaderStopSims.addEventListener('click', stopAllMepSimulations);
  }

  document.querySelectorAll('[data-pluv-sim]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const key = btn.getAttribute('data-pluv-sim');
      if (!key) return;
      pluvialSimState[key] = !pluvialSimState[key];
      btn.classList.toggle('active', pluvialSimState[key]);
      updatePluvialSimulationUI();
    });
  });

  document.querySelectorAll('[data-elec-sim]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const key = btn.getAttribute('data-elec-sim');
      if (!key) return;
      electricalSimState[key] = !electricalSimState[key];
      btn.classList.toggle('active', electricalSimState[key]);
      updateElectricalSimulationUI();
    });
  });

  // =========================================================================
  // 15. MOTOR DE EXPERIENCIA MULTIRROL (7 PERFILES DE USUARIO + 3 PESTAÑAS SIDEBAR)
  // =========================================================================
  const switchSidebarTab = (tabId) => {
    document.querySelectorAll('.sw-tab-btn[data-sidebar-tab]').forEach((btn) => {
      btn.classList.toggle('active', btn.getAttribute('data-sidebar-tab') === tabId);
    });
    document.querySelectorAll('.sidebar-tab-pane, .sidebar-tab-panel').forEach((panel) => {
      const isMatch = panel.id === tabId;
      panel.classList.toggle('active', isMatch);
      panel.style.display = isMatch ? 'block' : 'none';
    });
  };

  document.querySelectorAll('.sw-tab-btn[data-sidebar-tab]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-sidebar-tab');
      if (targetTab) switchSidebarTab(targetTab);
    });
  });

  const executeRoleQuickAction = (actionType, target) => {
    if (actionType === 'focus_room' && target) {
      if (typeof scene.focusRoom === 'function') {
        scene.focusRoom(target);
      }
      return;
    }
    if (actionType === 'cutaway' && target) {
      scene.setFloorCutaway(target);
      document.querySelectorAll('#cutaway-mode-buttons .cutaway-btn').forEach((b) => {
        b.classList.toggle('active', b.getAttribute('data-cutaway-mode') === target);
      });
      return;
    }
    if (actionType === 'toggle_game') {
      const btnGame = document.getElementById('btn-toggle-game-mode');
      if (btnGame) btnGame.click();
      return;
    }
    if (actionType === 'open_pdf') {
      window.open('assets/Presentacion_Ejecutiva_Residencia_Ita_Pyta_Punta_Ruth_y_Leo.pdf', '_blank', 'noopener');
      return;
    }
    if (actionType === 'open_modal' && target) {
      openModal(target);
      return;
    }
    if (actionType === 'toggle_bank_colors') {
      setGlobalBankColorMode(!scene.bankColorMode);
      return;
    }
    if (actionType === 'open_drawer') {
      if (target && target !== 'open') {
        activeDrawerFilter = target;
        document.querySelectorAll('.cd-filter-pill[data-cd-filter]').forEach((b) => {
          b.classList.toggle('active', b.getAttribute('data-cd-filter') === target);
        });
      }
      setComputoDrawerOpen(true);
      return;
    }
    if (actionType === 'export_xlsx') {
      if (btnExportXlsx) btnExportXlsx.click();
      return;
    }
    if (actionType === 'sim_pluvial' && target) {
      const mepPanel = document.getElementById('mep-sim-panel');
      if (mepPanel) mepPanel.style.display = 'block';
      pluvialSimState[target] = !pluvialSimState[target];
      const btn = document.querySelector(`[data-pluv-sim="${target}"]`);
      if (btn) btn.classList.toggle('active', pluvialSimState[target]);
      updatePluvialSimulationUI();
      return;
    }
    if (actionType === 'sim_elec' && target) {
      const mepPanel = document.getElementById('mep-sim-panel');
      if (mepPanel) mepPanel.style.display = 'block';
      electricalSimState[target] = !electricalSimState[target];
      const btn = document.querySelector(`[data-elec-sim="${target}"]`);
      if (btn) btn.classList.toggle('active', electricalSimState[target]);
      updateElectricalSimulationUI();
      return;
    }
    if (actionType === 'stop_sims') {
      stopAllMepSimulations();
      return;
    }
    if (actionType === 'set_scenario' && target) {
      applyScenario(target);
      return;
    }
    if (actionType === 'toggle_gates_3d') {
      if (typeof scene.toggleInteractiveElement === 'function') {
        scene.toggleInteractiveElement('porton_cochera');
        scene.toggleInteractiveElement('puerta_peatonal');
      }
      if (typeof scene.focusRoom === 'function') {
        scene.focusRoom('fachada_porton');
      }
      return;
    }
    if (actionType === 'cycle_roof') {
      if (btnToggleRoofStyle) btnToggleRoofStyle.click();
    }
  };

  renderActiveRoleWorkbench = () => {
    const host = document.getElementById('role-workbench-host');
    if (!host) return;

    const currentPartidas = editablePartidas.map((p) => ({
      ...p,
      includedInScenario: selectedItemIds.has(p.id),
      cantidad: p.cantidadActual,
      precioUnitarioGs: p.precioUnitarioActualGs,
      subtotalGs: p.subtotalActualGs
    }));

    const role = getRoleWorkspaceConfig(activeUserRoleId);
    const bom = getRoleBillOfMaterials(activeUserRoleId, activeScenarioKey, currentPartidas);
    const accent = role.color || '#38bdf8';

    const actionsHtml = (role.quickActions || [])
      .map(
        (act) => `
        <button class="role-action-btn" data-role-action="${act.type || act.action || ''}" data-role-target="${act.target || ''}">
          ${act.label}
        </button>
      `
      )
      .join('');

    const checklistHtml = (role.checklistTecnico || [])
      .map((item) => `<li>${item}</li>`)
      .join('');

    const topItems = (bom.items || []).slice(0, 12);
    const itemsHtml = topItems
      .map((r) => {
        const isToggleable = !r.id.startsWith('EXIST-') && !r.id.startsWith('PROPIO-');
        const isIncluded = selectedItemIds.has(r.id) || Boolean(r.includedInScenario);
        const statusColor = r.alreadyBuilt
          ? '#34d399'
          : isIncluded
            ? '#fde68a'
            : '#64748b';
        const statusTag = r.alreadyBuilt
          ? '✅ Ya está'
          : isIncluded
            ? '🎯 Previsto'
            : '⏸️ No inc.';
        const itemTotal = Number(r.precioTotalGs ?? r.subtotalGs ?? 0);
        return `
          <div class="role-bom-row">
            <div style="display:flex; align-items:flex-start; gap:5px; flex:1; min-width:0;">
              ${
                isToggleable
                  ? `<input type="checkbox" class="role-bom-item-chk" data-role-item-id="${r.id}" ${isIncluded ? 'checked' : ''} style="margin-top:2px; accent-color:${accent}; cursor:pointer;" title="Activar/Desactivar en presupuesto" />`
                  : ''
              }
              <div style="min-width:0;">
                <span class="r-name">${r.item || r.producto}</span>
                <span class="r-qty">${Number(r.cantidad).toLocaleString('es-PY', { maximumFractionDigits: 2 })} ${r.unidad} • <span style="color:${statusColor};">${statusTag}</span></span>
              </div>
            </div>
            <div class="r-val" style="color:${statusColor};">
              ${itemTotal > 0 ? `Gs. ${formatGs(itemTotal)}` : 'Gs. 0'}
            </div>
          </div>
        `;
      })
      .join('');

    const mshRole = document.getElementById('mobile-sheet-role-label');
    if (mshRole) {
      mshRole.textContent = `${role.emoji || '🎯'} ${role.shortName || role.nombre}`;
    }
    const mshBudget = document.getElementById('mobile-sheet-budget-label');
    const kpiAmt = document.getElementById('kpi-total-amount');
    if (mshBudget && kpiAmt) {
      mshBudget.textContent = `Gs. ${kpiAmt.textContent}`;
    }

    host.innerHTML = `
      <div class="role-wb-card" style="border-color:${accent}55;">
        <div class="role-wb-header">
          <span class="role-wb-icon">${role.emoji || '🎯'}</span>
          <div>
            <div class="role-wb-badge" style="color:${accent};">${role.badge}</div>
            <div class="role-wb-title">${role.nombre}</div>
          </div>
        </div>
        <p class="role-wb-desc">${role.resumenEjecutivo}</p>

        <div class="panel-section-title" style="margin-bottom:5px;">
          <span>⚡ Acciones Rápidas (${role.shortName})</span>
        </div>
        <div class="role-actions-grid">
          ${actionsHtml}
        </div>

        <div class="role-checklist-box" style="border-left-color:${accent};">
          <div class="role-checklist-title" style="color:${accent};">
            📋 Especificaciones y Control en Obra (${role.shortName})
          </div>
          <ul class="role-checklist-list">
            ${checklistHtml}
          </ul>
        </div>

        <div class="role-bom-summary">
          <div class="role-bom-kpi">
            <span>Total Previsto BNF (${bom.previstoCount} rubros)</span>
            <strong>Gs. ${formatGs(bom.totalRolePrevistoBnfGs)}</strong>
          </div>
          <div class="role-bom-kpi">
            <span>Materiales / Mano Obra</span>
            <strong style="color:#7dd3fc;">${formatGs(bom.totalRoleMaterialesGs)} / ${formatGs(bom.totalRoleManoObraGs)}</strong>
          </div>
        </div>

        <div class="role-bom-items-mini">
          ${itemsHtml}
        </div>

        <div style="display:flex; gap:6px; margin-top:9px;">
          <button id="btn-export-role-csv" class="role-export-btn" style="flex:1;">
            📥 Orden de Trabajo ${role.shortName} (.CSV)
          </button>
          <button id="btn-role-open-drawer" class="role-action-btn" style="width:auto; padding:7px 9px;" title="Abrir lista completa de costos">
            🧮 Ver Todo
          </button>
        </div>
      </div>
    `;

    host.querySelectorAll('.role-action-btn[data-role-action]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const act = btn.getAttribute('data-role-action');
        const tgt = btn.getAttribute('data-role-target');
        executeRoleQuickAction(act, tgt);
      });
    });

    host.querySelectorAll('.role-bom-item-chk').forEach((chk) => {
      chk.addEventListener('change', (e) => {
        const id = e.target.getAttribute('data-role-item-id');
        if (!id) return;
        if (e.target.checked) selectedItemIds.add(id);
        else selectedItemIds.delete(id);
        recalculateBudget();
      });
    });

    const btnRoleExportCsv = document.getElementById('btn-export-role-csv');
    if (btnRoleExportCsv) {
      btnRoleExportCsv.addEventListener('click', () => {
        const csvContent = generateRoleWorkOrderCsv(
          activeUserRoleId,
          activeScenarioKey,
          currentPartidas
        );
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `orden_trabajo_${activeUserRoleId}_${activeScenarioKey}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      });
    }

    const btnRoleOpenDrawer = document.getElementById('btn-role-open-drawer');
    if (btnRoleOpenDrawer) {
      btnRoleOpenDrawer.addEventListener('click', () => {
        setComputoDrawerOpen(true);
      });
    }
  };

  const layerCheckboxMap = {
    muroEstacionamiento: 'layer-muro-parking',
    losaFase2: 'layer-losa2',
    techo: 'layer-techo',
    architecture: 'layer-arch',
    subsuelo: 'layer-subsuelo',
    structure: 'layer-struct',
    entornoUrbano: 'layer-entorno',
    ductos: 'layer-ductos',
    pluvial: 'layer-pluvial',
    senalesDebiles: 'layer-senales',
    geotech: 'layer-geotech',
    topography: 'layer-topo'
  };

  const leftSidebarEl = document.getElementById('left-sidebar');
  const mobileSidebarHandle = document.getElementById('mobile-sidebar-handle');
  const mobileSheetRoleLabel = document.getElementById('mobile-sheet-role-label');
  const mobileSheetBudgetLabel = document.getElementById('mobile-sheet-budget-label');
  const mobileSheetToggleBadge = document.getElementById('mobile-sheet-toggle-badge');

  const syncMobileSheetHeader = () => {
    const profile = getRoleWorkspaceConfig(activeUserRoleId);
    if (mobileSheetRoleLabel && profile) {
      mobileSheetRoleLabel.textContent = `${profile.emoji || '🎯'} ${profile.shortName || profile.nombre}`;
    }
    const kpiTotalEl = document.getElementById('kpi-total-amount');
    if (mobileSheetBudgetLabel && kpiTotalEl) {
      mobileSheetBudgetLabel.textContent = `Gs. ${kpiTotalEl.textContent}`;
    }
    if (mobileSheetToggleBadge && leftSidebarEl) {
      const isCollapsed = leftSidebarEl.classList.contains('mobile-collapsed');
      mobileSheetToggleBadge.textContent = isCollapsed ? '▲ Abrir Panel' : '▼ Ver 3D';
    }
  };

  const setMobileSidebarCollapsed = (collapsed) => {
    if (!leftSidebarEl) return;
    leftSidebarEl.classList.toggle('mobile-collapsed', Boolean(collapsed));
    syncMobileSheetHeader();
  };

  if (window.innerWidth <= 900) {
    setMobileSidebarCollapsed(true);
  }

  if (mobileSidebarHandle) {
    mobileSidebarHandle.addEventListener('click', () => {
      if (!leftSidebarEl) return;
      const nextCollapsed = !leftSidebarEl.classList.contains('mobile-collapsed');
      setMobileSidebarCollapsed(nextCollapsed);
    });
  }

  // Wire GTA Mobile Touch Controls (D-Pad + Sprint + Interact + Camera)
  document.querySelectorAll('#gta-mobile-touch-controls [data-touch-key]').forEach((btn) => {
    const keyCode = btn.getAttribute('data-touch-key');
    if (!keyCode) return;
    const pressKey = (e) => {
      if (e.cancelable) e.preventDefault();
      if (scene && scene.keysPressed) scene.keysPressed[keyCode] = true;
      btn.classList.add('active');
    };
    const releaseKey = (e) => {
      if (e && e.cancelable) e.preventDefault();
      if (scene && scene.keysPressed) scene.keysPressed[keyCode] = false;
      btn.classList.remove('active');
    };
    btn.addEventListener('touchstart', pressKey, { passive: false });
    btn.addEventListener('touchend', releaseKey, { passive: false });
    btn.addEventListener('touchcancel', releaseKey, { passive: false });
    btn.addEventListener('mousedown', pressKey);
    btn.addEventListener('mouseup', releaseKey);
    btn.addEventListener('mouseleave', releaseKey);
  });

  const btnGtaTouchSprint = document.getElementById('btn-gta-touch-sprint');
  if (btnGtaTouchSprint) {
    btnGtaTouchSprint.addEventListener('click', () => {
      if (!scene || !scene.keysPressed) return;
      scene.keysPressed.ShiftLeft = !scene.keysPressed.ShiftLeft;
      btnGtaTouchSprint.classList.toggle('active', Boolean(scene.keysPressed.ShiftLeft));
    });
  }

  const btnGtaTouchInteract = document.getElementById('btn-gta-touch-interact');
  if (btnGtaTouchInteract) {
    btnGtaTouchInteract.addEventListener('click', () => {
      if (scene && typeof scene._interactNearestObject === 'function') {
        scene._interactNearestObject();
      }
    });
  }

  const btnGtaTouchCam = document.getElementById('btn-gta-touch-cam');
  if (btnGtaTouchCam) {
    btnGtaTouchCam.addEventListener('click', () => {
      if (!scene) return;
      scene.thirdPersonView = !scene.thirdPersonView;
      if (scene.playerAvatar) {
        scene.playerAvatar.visible = scene.gameMode && scene.thirdPersonView;
      }
      if (typeof scene._notifyGameHud === 'function') {
        scene._notifyGameHud();
      }
    });
  }

  const applyUserRole = (roleId, { skipCamera = false, fromUserClick = false } = {}) => {
    const profile = getRoleWorkspaceConfig(roleId);
    activeUserRoleId = profile.id;

    document.querySelectorAll('.role-pill-btn[data-role-id]').forEach((btn) => {
      btn.classList.toggle('active', btn.getAttribute('data-role-id') === profile.id);
    });

    switchSidebarTab('tab-role-workbench');

    // Sync 12 CAD layers according to the role's workspace profile
    if (profile.activeLayers) {
      Object.entries(profile.activeLayers).forEach(([layerName, isVisible]) => {
        scene.setLayerVisibility(layerName, Boolean(isVisible));
        const chkId = layerCheckboxMap[layerName];
        const chk = chkId ? document.getElementById(chkId) : null;
        if (chk) chk.checked = Boolean(isVisible);
      });
    }

    // Sync floor cutaway preset
    if (profile.cutawayPreset) {
      scene.setFloorCutaway(profile.cutawayPreset);
      document.querySelectorAll('#cutaway-mode-buttons .cutaway-btn').forEach((b) => {
        b.classList.toggle('active', b.getAttribute('data-cutaway-mode') === profile.cutawayPreset);
      });
    }

    // Focus 3D camera on the role's primary zone
    if (!skipCamera && profile.cameraPreset && typeof scene.focusRoom === 'function') {
      scene.focusRoom(profile.cameraPreset);
    }

    // Open/close Cómputo Drawer if role is Cost Engineer
    if (profile.openDrawer) {
      setComputoDrawerOpen(true);
    } else if (computoDrawer && computoDrawer.classList.contains('open') && profile.id !== 'ingeniero') {
      setComputoDrawerOpen(false);
    }

    // Show/hide MEP interactive simulator panel if role is Plumber or Electrician
    const mepPanel = document.getElementById('mep-sim-panel');
    if (mepPanel) {
      mepPanel.style.display = profile.openMepSim ? 'block' : 'none';
    }

    // On mobile screens, if the role opens the Drawer or MEP Simulator, collapse the sidebar sheet so they don't overlap;
    // otherwise expand the sidebar sheet when the user explicitly taps a role pill so they see its workbench.
    if (window.innerWidth <= 900 && fromUserClick) {
      if (profile.openDrawer || profile.openMepSim) {
        setMobileSidebarCollapsed(true);
      } else {
        setMobileSidebarCollapsed(false);
      }
    }

    renderActiveRoleWorkbench();
    syncMobileSheetHeader();
  };

  document.querySelectorAll('.role-pill-btn[data-role-id]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const rId = btn.getAttribute('data-role-id');
      if (rId) applyUserRole(rId, { fromUserClick: true });
    });
  });

  // Initialize default role workbench on startup without overriding default camera
  renderActiveRoleWorkbench();
  syncMobileSheetHeader();
});



