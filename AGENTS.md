# Proyecto Residencia Itá Pytã Punta (BIM 3D & Cómputo de Obra)
## Guía de Contexto y Operación Multi-Agente (Antigravity)

**Ubicación local del proyecto:**
`/media/carmen/Datos/Dev/itapytapunta-3d/`

**Repositorio Git remoto:**
`https://github.com/leoberniga/itapytapunta-3d` (Rama: `main`)

---

### 1. Misión del Proyecto
Plataforma web 3D interactiva (Three.js + Vite), visualizador CAD de planos vectoriales de alta precisión, y simulador de cómputo métrico y presupuestos por escenarios de inversión (300M a 440M Guaraníes) para la residencia unifamiliar en **Calle Guillermo Arias, Barrio Itá Pytã Punta, Asunción, Paraguay**, con vista franca al Río Paraguay.

### 2. Estado Real en Obra (Punto de Partida Inmutable)
- **Fundaciones y Estructura:** 100% de las zapatas $Z_1 \dots Z_{20}$ hormigonadas sobre estrato de arenisca (GEO-STAN S.R.L. Nº 2956, capacidad admisible 10 a 17.9 Tn/m²).
- **Pilares:** Pilares $P_1 \dots P_{20}$ hormigonados en planta baja.
- **Primera Losa:** Hormigonada en su primera etapa.
- **Etapa Inmediata a Desarrollar:**
  1. Muro de contención para nivelar el estacionamiento/cochera sobre Calle Guillermo Arias.
  2. Hormigonado de la 2da parte de la losa superior (Losa Rap prefabricada + capa compresión).
  3. Estructura metálica y cubierta de techo termoacústico (Isopanel 50mm PIR).
  4. Cerramiento perimetral hermético para proteger la obra ("cerrar todo").
  5. **Plan Hidrófugo:** Drenaje francés perimetral, doble capa aisladora y membrana asfáltica 4mm en terraza.
  6. **Señales Débiles:** Ductos y cableado Cat6, 6 cámaras CCTV IP PoE, portero visor IP y Wi-Fi Mesh.

---

### 3. Credenciales de Seguridad del Visualizador
- **Usuario:** `leo` (o `admin`)
- **Contraseña:** `itapytapunta2026` (o `itapyta2026`)
- **Algoritmo:** Verificación con hash SHA-256 (`crypto.subtle.digest`).
- **Comportamiento:** Si no se autentica, la aplicación WebGL y los planos no se montan en el DOM.

---

### 4. Estructura de Carpetas del Proyecto
```
itapytapunta-3d/
├── AGENTS.md                  # Este archivo de instrucciones multi-agente
├── docs/                      # Registro de estado y bitácora
│   └── ESTADO.md
├── app/                       # Aplicación Frontend Web
│   ├── index.html             # UI Glassmorphism, modales y viewer
│   ├── package.json           # Dependencias (three, lucide, vite)
│   ├── package-lock.json      # Sincronizado para CI/CD
│   ├── public/assets/         # Renders 3D fotorrealistas y planos vectoriales SVG
│   ├── dist/                  # Bundle de producción compilado
│   └── src/
│       ├── main.js            # Controlador principal y gestión de eventos
│       ├── scene.js           # Motor 3D Three.js (terreno, losas, muro, río, sol)
│       ├── auth.js            # AuthManager criptográfico (SHA-256)
│       ├── style.css          # Sistema de diseño, contrastes y responsividad
│       └── data/
│           └── projectData.js # Cotas, sondeos, partidas, fórmulas y escenarios
├── firebase.json              # Configuración de despliegue en Firebase Hosting
└── .github/workflows/         # Pipeline de despliegue continuo automático
    └── deploy.yml
```

---

### 5. Comandos de Ejecución y Desarrollo
```bash
# Entrar al directorio del proyecto en Dev
cd /media/carmen/Datos/Dev/itapytapunta-3d/app

# Instalar dependencias
npm install

# Iniciar servidor local
npm run dev

# Compilar para producción (genera app/dist/)
npm run build

# Previsualizar bundle de producción
npm run preview
```

---

### 6. Despliegue en la Nube Gratuita
- **GitHub Pages:** Activado mediante `.github/workflows/deploy.yml` (usa `npm install` + `npm run build`).
- **Firebase Hosting:** `firebase.json` apunta a `app/dist`. Para publicar:
  ```bash
  npx -y firebase-tools@latest deploy --only hosting
  ```
- **Soberanía y Costo:** 100% gratuito sin depender de suscripciones mensuales.
