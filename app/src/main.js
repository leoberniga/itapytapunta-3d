import { ProjectScene } from './scene.js';
import { CURATED_PHOTOS, ARCHITECTURAL_ROOMS, GEOTECHNICAL_DATA, STRUCTURAL_ITEMS, PRESUPUESTO_PARTIDAS, ESCENARIOS_INVERSION } from './data/projectData.js';
import { AuthManager } from './auth.js';

document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // Authentication Gate Management
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

  if (authOverlay) {
    if (authManager.isAuthenticated) {
      authOverlay.classList.add('hidden');
    } else {
      authOverlay.classList.remove('hidden');
    }
  }

  if (authForm) {
    authForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (authErrorMsg) authErrorMsg.style.display = 'none';
      const result = authManager.login(authUserInput.value, authPassInput.value, authRemember ? authRemember.checked : true);
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

  const formatGs = (num) => {
    return Number(num).toLocaleString('es-PY');
  };

  // Callback when user clicks an object in 3D
  const onSelectObject = (userData, hitPoint) => {
    if (!userData) {
      inspectorPopup.classList.remove('open');
      return;
    }

    inspectorTag.textContent = userData.type?.toUpperCase() || 'INFORMACIÓN';
    inspectorTitle.textContent = userData.name || userData.title || 'Detalle del Elemento';
    inspectorDesc.textContent = userData.desc || userData.highlights?.join(', ') || '';

    let metaHtml = '';
    if (userData.costo || userData.costoEstimado) {
      metaHtml += `<span class="badge-pill" style="border-color:var(--accent-gold); color:var(--accent-gold); font-weight:700;">Costo: ${userData.costo || userData.costoEstimado}</span><br>`;
    }
    if (userData.dimensions) {
      metaHtml += `<span class="badge-pill">Dim: ${userData.dimensions}</span> `;
    }
    if (userData.status) {
      metaHtml += `<span class="badge-pill" style="border-color:#10b981; color:#34d399;">${userData.status}</span> `;
    }
    if (userData.area) {
      metaHtml += `<span class="badge-pill">Área: ${userData.area} m²</span> `;
    } else if (userData.type === 'borehole') {
      metaHtml += `<span class="badge-pill">Cota Boca: +${userData.cota} m</span> `;
      metaHtml += `<span class="badge-pill">Prof: ${userData.prof} m</span><br>`;
      metaHtml += `<div style="margin-top:8px; font-size:11px;"><strong>Estratos (GEO-STAN #2956):</strong><br>`;
      userData.estratos.forEach(e => {
        metaHtml += `• ${e.de}m - ${e.a}m: ${e.tipo} (Nspt: ${e.nspt})<br>`;
      });
      metaHtml += `</div>`;
    } else if (userData.type === 'photoHotspot') {
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

  // Callback when measurement tool updates
  const onMeasurementUpdate = (data) => {
    if (!data) {
      measureCard.classList.remove('visible');
      return;
    }
    measureDist.textContent = `${data.distance} m`;
    measureDy.textContent = `${data.dy} m`;
    const planDist = Math.sqrt(Math.pow(parseFloat(data.dx), 2) + Math.pow(parseFloat(data.dz), 2)).toFixed(2);
    measurePlan.textContent = `${planDist} m`;
    measureCard.classList.add('visible');
  };

  // Initialize 3D Scene
  const scene = new ProjectScene(container, onSelectObject, onMeasurementUpdate);

  // Function to recalculate budget totals & KPI
  const recalculateBudget = () => {
    let total = 0;
    PRESUPUESTO_PARTIDAS.forEach(p => {
      if (selectedItemIds.has(p.id)) {
        total += p.subtotalGs;
      }
    });

    const scenario = ESCENARIOS_INVERSION[activeScenarioKey];
    const target = scenario.montoObjetivoGs;
    const diff = target - total;
    const m2Construido = 160; // Planta baja + Galeria
    const costoM2 = Math.round(total / m2Construido);

    // Update KPI Card
    kpiTotalAmount.textContent = formatGs(total);
    kpiCostoM2.textContent = `Gs. ${formatGs(costoM2)} / m²`;

    // Update Modal Summary Banner
    simTotalDisplay.textContent = `Gs. ${formatGs(total)}`;
    simTargetDisplay.textContent = `${formatGs(target)} Gs.`;
    simM2Display.textContent = `Gs. ${formatGs(costoM2)} / m²`;

    if (diff >= 0) {
      simSaldoDisplay.textContent = `+ ${formatGs(diff)} Gs.`;
      simSaldoDisplay.style.color = '#10b981';
      kpiSemaforo.className = 'kpi-status-badge ok';
      kpiSemaforo.innerHTML = '<span class="status-dot"></span><span>En Rango</span>';
    } else {
      simSaldoDisplay.textContent = `- ${formatGs(Math.abs(diff))} Gs.`;
      simSaldoDisplay.style.color = '#ef4444';
      kpiSemaforo.className = 'kpi-status-badge';
      kpiSemaforo.style.background = 'rgba(239, 68, 68, 0.2)';
      kpiSemaforo.style.color = '#f87171';
      kpiSemaforo.innerHTML = '<span class="status-dot" style="background:#ef4444;box-shadow:0 0 8px #ef4444;"></span><span>Excedido</span>';
    }

    // Refresh row classes
    document.querySelectorAll('.budget-row').forEach(row => {
      const id = row.getAttribute('data-item-id');
      const checkbox = row.querySelector('.budget-chk');
      if (selectedItemIds.has(id)) {
        row.classList.add('selected');
        if (checkbox) checkbox.checked = true;
      } else {
        row.classList.remove('selected');
        if (checkbox) checkbox.checked = false;
      }
    });
  };

  // Populate Interactive Budget Table
  const renderBudgetTable = () => {
    if (!budgetTbody) return;
    budgetTbody.innerHTML = '';

    PRESUPUESTO_PARTIDAS.forEach(p => {
      const isChecked = selectedItemIds.has(p.id);
      const tr = document.createElement('tr');
      tr.className = `budget-row ${isChecked ? 'selected' : ''}`;
      tr.setAttribute('data-item-id', p.id);

      tr.innerHTML = `
        <td style="text-align:center;">
          <input type="checkbox" class="budget-chk" ${isChecked ? 'checked' : ''}>
        </td>
        <td>
          <strong style="color:#fff; font-size:12px;">${p.item}</strong>
          <p style="font-size:10px; color:var(--text-muted); margin-top:2px;">${p.desc}</p>
        </td>
        <td><span class="badge-pill" style="font-size:10px;">${p.categoria}</span></td>
        <td>${p.cantidad} ${p.unidad}</td>
        <td>Gs. ${formatGs(p.precioUnitarioGs)}</td>
        <td style="text-align:right; font-weight:700; color:var(--accent-gold);">Gs. ${formatGs(p.subtotalGs)}</td>
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

      budgetTbody.appendChild(tr);
    });

    recalculateBudget();
  };

  renderBudgetTable();

  // Function to apply a preset scenario
  const applyScenario = (scenarioKey) => {
    activeScenarioKey = scenarioKey;
    const scenario = ESCENARIOS_INVERSION[scenarioKey];
    if (!scenario) return;

    selectedItemIds = new Set(scenario.itemsIncluidos);
    scene.setScenario(scenarioKey);

    // Update active state in pills
    document.querySelectorAll('.scenario-pill').forEach(pill => {
      pill.classList.toggle('active', pill.getAttribute('data-scenario') === scenarioKey);
    });

    // Update left KPI
    kpiScenarioName.textContent = scenario.nombre.split(':')[0];
    kpiObjectiveDesc.textContent = scenario.objetivoPrincipal;

    recalculateBudget();
  };

  // Scenario Buttons
  document.getElementById('btn-scen-300').addEventListener('click', () => applyScenario('escenario300'));
  document.getElementById('btn-scen-370').addEventListener('click', () => applyScenario('escenario370'));
  document.getElementById('btn-scen-440').addEventListener('click', () => applyScenario('escenario440'));

  document.getElementById('btn-preset-300').addEventListener('click', () => applyScenario('escenario300'));
  document.getElementById('btn-preset-370').addEventListener('click', () => applyScenario('escenario370'));
  document.getElementById('btn-preset-440').addEventListener('click', () => applyScenario('escenario440'));

  // Toggle UI visibility
  const btnToggleUi = document.getElementById('btn-toggle-ui');
  let uiVisible = true;
  btnToggleUi.addEventListener('click', () => {
    uiVisible = !uiVisible;
    leftSidebar.style.display = uiVisible ? 'flex' : 'none';
    document.querySelector('.bottom-dock').style.display = uiVisible ? 'flex' : 'none';
    document.querySelector('.scenario-selector-bar').style.display = uiVisible ? 'flex' : 'none';
    inspectorPopup.classList.remove('open');
  });

  // Layer Checkboxes
  const layerBindings = [
    { id: 'layer-muro-parking', name: 'muroEstacionamiento' },
    { id: 'layer-losa2', name: 'losaFase2' },
    { id: 'layer-techo', name: 'techo' },
    { id: 'layer-arch', name: 'architecture' },
    { id: 'layer-subsuelo', name: 'subsuelo' },
    { id: 'layer-struct', name: 'structure' },
    { id: 'layer-geotech', name: 'geotech' },
    { id: 'layer-topo', name: 'topography' }
  ];

  layerBindings.forEach(b => {
    const el = document.getElementById(b.id);
    if (el) {
      el.addEventListener('change', (e) => {
        scene.setLayerVisibility(b.name, e.target.checked);
      });
    }
  });

  // Camera Presets Buttons
  document.querySelectorAll('.view-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const cam = btn.getAttribute('data-cam');
      scene.setCameraView(cam);
    });
  });

  // Sun Slider
  const sunSlider = document.getElementById('sun-slider');
  const sunTimeDisplay = document.getElementById('sun-time-display');

  sunSlider.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value);
    const hours = Math.floor(val);
    const mins = Math.round((val - hours) * 60);
    const formatted = `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
    
    let note = '';
    if (val >= 17) note = ' (Atardecer en el Río)';
    else if (val <= 7) note = ' (Amanecer)';
    else if (val >= 11 && val <= 13) note = ' (Cenit solar)';
    
    sunTimeDisplay.textContent = `${formatted}${note}`;
    scene.setTimeOfDay(val);
  });

  // CAD Tools: X-Ray & Measure
  const btnXray = document.getElementById('btn-xray');
  let xrayActive = false;
  btnXray.addEventListener('click', () => {
    xrayActive = !xrayActive;
    btnXray.classList.toggle('active', xrayActive);
    scene.setXRayMode(xrayActive);
  });

  const btnMeasure = document.getElementById('btn-measure');
  let measureActive = false;
  btnMeasure.addEventListener('click', () => {
    measureActive = !measureActive;
    btnMeasure.classList.toggle('active', measureActive);
    scene.setMeasureMode(measureActive);
    if (!measureActive) {
      measureCard.classList.remove('visible');
    }
  });

  document.getElementById('btn-clear-measure').addEventListener('click', () => {
    scene.clearMeasurements();
  });

  document.getElementById('inspector-close').addEventListener('click', () => {
    inspectorPopup.classList.remove('open');
  });

  // Modals management
  const openModal = (id) => {
    const modal = document.getElementById(id);
    if (modal) {
      modal.classList.add('open');
      if (window.lucide) window.lucide.createIcons();
    }
  };

  const closeModal = (modal) => {
    modal.classList.remove('open');
  };

  document.querySelectorAll('.dock-item').forEach(item => {
    item.addEventListener('click', () => {
      document.querySelectorAll('.dock-item').forEach(d => d.classList.remove('active'));
      item.classList.add('active');
      const modalId = item.getAttribute('data-modal');
      openModal(modalId);
    });
  });

  document.getElementById('btn-open-cloud').addEventListener('click', () => {
    openModal('modal-cloud');
  });

  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal(overlay);
    });
    const closeBtn = overlay.querySelector('.modal-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => closeModal(overlay));
    }
  });

  // Blueprint Tabs in Modal 2
  const bpImg = document.getElementById('blueprint-img');
  const bpAcotado = document.getElementById('btn-plano-acotado');
  const bpCorte = document.getElementById('btn-plano-corte');
  const bpUbicacion = document.getElementById('btn-plano-ubicacion');
  const bpSubsuelo = document.getElementById('btn-plano-subsuelo');

  const setBpActive = (btn, src) => {
    [bpAcotado, bpCorte, bpUbicacion, bpSubsuelo].forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    bpImg.src = src;
  };

  bpAcotado.addEventListener('click', () => setBpActive(bpAcotado, '/assets/plano_acotado.svg'));
  bpCorte.addEventListener('click', () => setBpActive(bpCorte, '/assets/corte_terreno.svg'));
  bpUbicacion.addEventListener('click', () => setBpActive(bpUbicacion, '/assets/ubicacion_terreno.svg'));
  bpSubsuelo.addEventListener('click', () => setBpActive(bpSubsuelo, '/assets/subsuelo_ejecutivo_1-1.png'));

  // Populate Photo Gallery in Modal 4
  const photoContainer = document.getElementById('photo-gallery-container');
  if (photoContainer) {
    CURATED_PHOTOS.forEach((photo, idx) => {
      const card = document.createElement('div');
      card.className = 'photo-card';
      card.innerHTML = `
        <img src="${photo.url}=w600" loading="lazy" alt="${photo.title}">
        <div class="photo-card-info">
          <h4>${photo.title}</h4>
          <p>${photo.category} • ${photo.desc}</p>
        </div>
      `;
      card.addEventListener('click', () => {
        window.open(photo.url, '_blank');
      });
      photoContainer.appendChild(card);
    });
  }
});
