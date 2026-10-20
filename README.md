# Residencia Itá Pytã Punta • Explorador BIM 3D & Geotécnico

Plataforma web interactiva 3D de alta precisión para la visualización, exploración arquitectónica, análisis geotécnico y seguimiento constructivo del terreno y residencia en **Itá Pytã Punta**, Asunción, Paraguay (calle Guillermo Arias con vista panorámica al Río Paraguay).

Desarrollada con **Three.js, WebGL, Vite y Vanilla CSS (Glassmorphism)**, optimizada tanto para computadoras de escritorio como para **dispositivos móviles** con controles táctiles fluidos.

---

## 1. Datos Técnicos del Proyecto

- **Ubicación:** Calle Guillermo Arias, Barrio Itá Pytã Punta, Asunción, Paraguay.
- **Coordenadas UTM (Zona 21S):** X: 433.024, Y: 7.203.554 (Lat: -25.2796°, Lon: -57.6635°).
- **Propietario / Cliente:** Leonardo Gómez.
- **Proyecto Arquitectónico:** Arq. Gabriela Rolón.
- **Cálculo Estructural y Dirección:** JIVESA S.A. Ingeniería.
- **Estudio Geotécnico:** GEO-STAN S.R.L. (Proyecto Nº 2956).

### Dimensiones y Topografía del Terreno
- **Frente:** 9.89 m sobre calle Guillermo Arias (Cota de referencia RN = +100.00 m).
- **Fondo:** 31.00 m hacia el barranco del Río Paraguay.
- **Superficie Total:** 306.59 m².
- **Desnivel Topográfico:**
  - **Sondeo P1 (Frente / Acceso):** Cota +99.84 m (desnivel -0.16 m).
  - **Sondeo P2 (Sector Medio / Residencia):** Cota +97.15 m (desnivel -2.69 m).
  - **Sondeo P3 (Fondo / Borde de pendiente):** Cota +96.20 m (desnivel -3.64 m).
  - **Barranco y Río Paraguay:** Pendiente natural hacia la planicie aluvial del río.

---

## 2. Capacidades de la Plataforma 3D

1. **Topografía Real y Curvas de Nivel:**
   - Malla 3D modelada según las cotas de los sondeos y replanteos ópticos.
   - Curvas de nivel CAD cada 1.0 metro (+100m, +99m, +98m, +97m, +96m).
2. **Geotecnia y Estratigrafía 3D:**
   - Sondeos S-1, S-2 y S-3 con cilindros tridimensionales que muestran las capas de suelo:
     - Estrato superior: Arena limosa (SM) marrón claro (Nspt 11 a 20).
     - Estrato intermedio: Arena mal graduada densa (SP-SM).
     - Estrato basal: Arenisca / roca blanda con rechazo (>50 golpes SPT) a partir de los 4.5m - 5.0m.
   - Capacidad portante admisible de 10.0 a 17.9 Tn/m² para zapatas a 1.20m de profundidad.
   - Ausencia total de nivel freático hasta los 10.05m de profundidad.
3. **Estructura de Hormigón Armado (H°A°):**
   - 20 Zapatas aisladas (Z1 a Z20) ejecutadas al 100%.
   - 20 Pilares de hormigón armado (P1 a P20) de 12x30 cm y 15x30 cm.
   - Vigas de encadenado perimetrales e intermedias (15x30 cm).
   - Losa alivianada (Loza Rap) de 38.00 m² de viguetas pretensadas.
   - Modo **Rayos X** para inspeccionar la estructura oculta bajo la arquitectura.
4. **Arquitectura y Variantes de Diseño:**
   - **Planta Baja (+100.00m):**
     - Hall de acceso desde calle Guillermo Arias.
     - Estar / Living room con grandes ventanales vidriados corredizos.
     - Cocina con isla central y comedor integrado.
     - **Galería Panorámica (3.50m x 9.55m):** Voladizo con deck de madera, pérgola, baranda de cristal y parrilla con vista directa al Río Paraguay.
     - Dormitorio principal en suite con vestidor privado y baño ensuite (1.25m x 2.22m).
     - Baño social de cortesía.
   - **Departamento Subsuelo (+97.00m):**
     - Unidad independiente con acceso por escalera exterior de hormigón.
     - Aprovecha el desnivel de 3.5 metros sin necesidad de excavar roca.
     - Dormitorio, estar, kitchenette, baño y patio inglés con vista al jardín bajo.
5. **Simulación Solar para Asunción:**
   - Control deslizante de hora solar (06:00 a 19:00).
   - Simulación precisa de la puesta de sol dorada sobre el Río Paraguay (17:30 - 18:30) con sombras arrojadas y reflejos en el agua.
6. **Herramienta de Medición CAD (Cinta Métrica 3D):**
   - Clic en dos puntos cualquiera del modelo para medir distancia tridimensional real (m), desnivel vertical ($\Delta Y$) y distancia en planta horizontal.
7. **Puntos de Interés Fotográfico (118 Fotos de Obra):**
   - Pins 3D distribuidos en el terreno que permiten ver las fotos reales de la obra (estudio de suelo, excavación, carga de hormigón, vistas) vinculadas al álbum de Google Photos.
8. **Visor de Planos Vectoriales 2D:**
   - Acceso instantáneo a los planos ejecutivos en formato SVG vectorial nítido (Planta acotada, Corte del terreno, Ubicación).

---

## 3. Arquitectura en la Nube Gratuita e Independencia de Antigravity

Esta solución está diseñada específicamente para que **no dependa de ningún servicio de pago** (puedes dar de baja tu plan de Antigravity de 100 USD sin que nada se pierda ni deje de funcionar):

```
┌─────────────────────────────────────────────────────────────┐
│                 REPOSITORIO GITHUB PERMANENTE                │
│             github.com/leoberniga/itapytapunta-3d           │
│   (Código fuente, modelos 3D, planos SVG, datos y configs)  │
└──────────────────────────────┬──────────────────────────────┘
                               │
            ┌──────────────────┴──────────────────┐
            ▼                                     ▼
┌───────────────────────────────┐   ┌───────────────────────────────┐
│     GITHUB ACTIONS CI/CD      │   │    GOOGLE CLOUD / FIREBASE    │
│    (Compilación automática)   │──▶│      (Hosting Gratuito 24/7)  │
│  Cada commit despliega a web  │   │  10 GB Almacenamiento, SSL    │
│    sin encender la laptop     │   │   CDN Global Google Cloud     │
└───────────────────────────────┘   └─────────────┬─────────────────┘
                                                  │
                                                  ▼
                                    ┌───────────────────────────────┐
                                    │      ACCESO DESDE EL MÓVIL    │
                                    │    https://itapytapunta.web.app│
                                    │  Navegación 3D táctil fluida  │
                                    │    desde cualquier lugar      │
                                    └───────────────────────────────┘
```

### ¿Por qué es 100% Gratuito y Sostenible?
1. **GitHub:** Repositorio privado o público sin costo, historial de versiones completo.
2. **Google Cloud / Firebase Hosting (Plan Spark):**
   - 10 GB de almacenamiento gratuito.
   - 360 MB/día de transferencia de datos (~10.8 GB mensuales).
   - Certificado SSL automático y dominio personalizado gratis.
   - CDN de alta velocidad en los datacenters globales de Google.
3. **Continuidad desde el Móvil o Cualquier Computadora:**
   - La aplicación es una SPA estática ultraliviana ( थ्री.js empaquetado con Vite: solo ~590 KB gzipped).
   - Funciona sin servidor backend que mantener o pagar.
   - Puedes abrirla en Chrome / Safari en tu celular y explorar el proyecto con gestos táctiles.
   - Puedes editar código directamente desde la web de GitHub (presionando `.` en el repo o mediante GitHub Codespaces) y GitHub Actions publicará los cambios automáticamente.

---

## 4. Comandos de Uso Local y Despliegue

### Modo Desarrollo Local:
```bash
cd app
npm run dev
# Acceder a http://localhost:5173
```

### Compilar para Producción:
```bash
cd app
npm run build
# Genera los archivos optimizados en app/dist/
```

### Desplegar en Google Cloud / Firebase Hosting:
```bash
npx firebase-tools login
npx firebase-tools deploy --only hosting
```

---

*Proyecto documentado y optimizado para Leonardo Gómez • Barrio Itá Pytã Punta, Asunción.*
