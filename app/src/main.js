import { ProjectScene } from './scene.js';
import { CURATED_PHOTOS, ARCHITECTURAL_ROOMS, GEOTECHNICAL_DATA, STRUCTURAL_ITEMS } from './data/projectData.js';

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide icons
  if (window.lucide) {
    window.lucide.createIcons();
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
    if (userData.type === 'room' || userData.area) {
      metaHtml += `<span class="badge-pill">Área: ${userData.area} m²</span> `;
      metaHtml += `<span class="badge-pill">Dim: ${userData.dimensions || userData.level}</span>`;
    } else if (userData.type === 'borehole') {
      metaHtml += `<span class="badge-pill">Cota Boca: +${userData.cota} m</span> `;
      metaHtml += `<span class="badge-pill">Prof: ${userData.prof} m</span><br>`;
      metaHtml += `<div style="margin-top:8px; font-size:11px;"><strong>Estratos:</strong><br>`;
      userData.estratos.forEach(e => {
        metaHtml += `• ${e.de}m - ${e.a}m: ${e.tipo} (Nspt: ${e.nspt})<br>`;
      });
      metaHtml += `</div>`;
    } else if (userData.type === 'zapata' || userData.type === 'pilar') {
      metaHtml += `<span class="badge-pill" style="border-color:#10b981; color:#34d399;">${userData.status}</span> `;
      if (userData.cota) metaHtml += `<span class="badge-pill">Cota: ${userData.cota}</span>`;
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

  // Initialize Scene
  const scene = new ProjectScene(container, onSelectObject, onMeasurementUpdate);

  // Toggle UI visibility
  const btnToggleUi = document.getElementById('btn-toggle-ui');
  let uiVisible = true;
  btnToggleUi.addEventListener('click', () => {
    uiVisible = !uiVisible;
    leftSidebar.style.display = uiVisible ? 'flex' : 'none';
    document.querySelector('.bottom-dock').style.display = uiVisible ? 'flex' : 'none';
    inspectorPopup.classList.remove('open');
  });

  // Layer Checkboxes
  const layerBindings = [
    { id: 'layer-arch', name: 'architecture' },
    { id: 'layer-subsuelo', name: 'subsuelo' },
    { id: 'layer-struct', name: 'structure' },
    { id: 'layer-geotech', name: 'geotech' },
    { id: 'layer-topo', name: 'topography' },
    { id: 'layer-photos', name: 'photos' }
  ];

  layerBindings.forEach(b => {
    const el = document.getElementById(b.id);
    if (el) {
      el.addEventListener('change', (e) => {
        scene.setLayerVisibility(b.name, e.target.checked);
      });
    }
  });

  // Design Options Buttons
  const opt1 = document.getElementById('opt-btn-1');
  const opt2 = document.getElementById('opt-btn-2');
  const optSub = document.getElementById('opt-btn-sub');

  const setOptionActive = (btn) => {
    [opt1, opt2, optSub].forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  };

  opt1.addEventListener('click', () => {
    setOptionActive(opt1);
    scene.setLayerVisibility('architecture', true);
    scene.setLayerVisibility('subsuelo', true);
    scene.setCameraView('aerial');
  });

  opt2.addEventListener('click', () => {
    setOptionActive(opt2);
    scene.setLayerVisibility('architecture', true);
    scene.setCameraView('gallery');
  });

  optSub.addEventListener('click', () => {
    setOptionActive(optSub);
    scene.setLayerVisibility('architecture', false);
    scene.setLayerVisibility('subsuelo', true);
    scene.setCameraView('soil');
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
