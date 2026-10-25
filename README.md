# PostDog

Repositorio que reúne los dos proyectos frontend de **PostDog**, una plataforma de gestión de envíos y paquetería.

| Proyecto | Descripción | Stack principal | Puerto por defecto |
| --- | --- | --- | --- |
| [`postdog-spa`](./postdog-spa) | Sitio público / landing de PostDog (información, contacto, términos y privacidad). | React 19, Create React App, MUI, Bootstrap, Firebase | `3000` |
| [`postdog-webapp`](./postdog-webapp) | Aplicación principal: dashboard, cotizaciones, envíos, recolecciones, administración, pagos y notificaciones. | React 19 + TypeScript, Create React App, MUI, Stripe, Firebase, i18next | `3009` |

---

## Requisitos

- **Node.js 22 LTS** (los pipelines originales usan `v22.15.0`). Node 18 o 20 también deberían funcionar.
- **npm 10+** o **Yarn 1.22** (`postdog-webapp` declara `yarn@1.22.22` como package manager).
- **Git**.

Verifica tu entorno:

```bash
node --version
npm --version
```

---

## Estructura del repositorio

```text
postdog/
├── postdog-spa/          # Sitio público (landing)
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── layouts/
│   │   ├── pages/        # AboutUs, Contact, Terms
│   │   ├── services/
│   │   └── utils/
│   ├── .env.example
│   └── package.json
├── postdog-webapp/       # Aplicación principal
│   ├── public/
│   ├── scripts/          # Generación del service worker de Firebase
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── config/
│   │   ├── context/
│   │   ├── Guard/        # AuthGuard y RoleGuard
│   │   ├── hooks/
│   │   ├── layouts/
│   │   ├── pages/        # Admin, auth, Dashboard, shipping, Settings, etc.
│   │   ├── services/
│   │   ├── types/
│   │   └── utils/
│   ├── example.env
│   ├── tsconfig.json
│   └── package.json
├── .gitignore
└── README.md
```

---

## Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/PedroLuiss/postdog.git
cd postdog
```

### 2. Instalar `postdog-spa` (sitio público)

```bash
cd postdog-spa
npm install
```

Crea el archivo de variables de entorno a partir del ejemplo:

```bash
# Linux / macOS
cp .env.example .env

# Windows (PowerShell)
Copy-Item .env.example .env
```

Completa los valores en `.env` (ver [Variables de entorno](#variables-de-entorno)) y ejecuta:

```bash
npm start
```

La aplicación queda disponible en **http://localhost:3000** (o en el puerto definido en `PORT`).

### 3. Instalar `postdog-webapp` (aplicación principal)

```bash
cd ../postdog-webapp
npm install
```

> También puedes usar `yarn install` si tienes Yarn 1.22 instalado.

Crea el archivo de entorno:

```bash
# Linux / macOS
cp example.env .env

# Windows (PowerShell)
Copy-Item example.env .env
```

Completa los valores en `.env` y ejecuta:

```bash
npm start
```

La aplicación queda disponible en **http://localhost:3009** (según `PORT` en `.env`).

> **Nota:** si ejecutas ambos proyectos al mismo tiempo en la misma máquina, asegúrate de que usen puertos distintos (por ejemplo, `3000` para la SPA y `3009` para la webapp). `npm start` en `postdog-webapp` ejecuta primero `generate-sw`, que genera el service worker de Firebase.

---

## Variables de entorno

Las variables de Create React App deben empezar con `REACT_APP_` para estar disponibles en el navegador. **Nunca subas el archivo `.env` al repositorio** (ya está incluido en `.gitignore`).

### `postdog-spa`

| Variable | Requerida | Descripción |
| --- | --- | --- |
| `PORT` | No | Puerto del servidor de desarrollo. Por defecto `3000`. |
| `REACT_APP_PORT` | No | Puerto usado para construir enlaces internos. |
| `REACT_APP_API_BASE_URL` | Sí | URL base del API backend. |
| `REACT_APP_WEBAPP_BASE_URL` | Sí | URL de `postdog-webapp` (botones de acceso / registro). |
| `REACT_APP_WHATSAPP_NUMBER_CONTACT` | No | Número de WhatsApp mostrado en contacto. |
| `REACT_APP_FIREBASE_API_KEY` | Sí* | Credenciales de Firebase. |
| `REACT_APP_FIREBASE_AUTH_DOMAIN` | Sí* | |
| `REACT_APP_FIREBASE_PROJECT_ID` | Sí* | |
| `REACT_APP_FIREBASE_STORAGE_BUCKET` | Sí* | |
| `REACT_APP_FIREBASE_MESSAGING_SENDER_ID` | Sí* | |
| `REACT_APP_FIREBASE_APP_ID` | Sí* | |
| `REACT_APP_FIREBASE_MEASUREMENT_ID` | Sí* | |

\* Necesarias para las funciones de Firebase (analytics / mensajería). El `.env.example` incluido solo lista las primeras cinco; agrega manualmente las variables de Firebase si vas a usar esas funciones.

### `postdog-webapp`

| Variable | Requerida | Descripción |
| --- | --- | --- |
| `PORT` | No | Puerto del servidor de desarrollo. El valor actual es `3009`. |
| `REACT_APP_PORT` | No | Puerto de referencia para enlaces internos. |
| `REACT_APP_API_BASE_URL` | Sí | URL base del API backend. |
| `REACT_APP_WEBSITE_BASE_URL` | Sí | URL del sitio público (`postdog-spa`). |
| `REACT_APP_LANDING_URL` | No | URL de la landing usada en enlaces de navegación. |
| `REACT_APP_FIREBASE_API_KEY` | Sí* | Credenciales de Firebase. |
| `REACT_APP_FIREBASE_AUTH_DOMAIN` | Sí* | |
| `REACT_APP_FIREBASE_PROJECT_ID` | Sí* | |
| `REACT_APP_FIREBASE_STORAGE_BUCKET` | Sí* | |
| `REACT_APP_FIREBASE_MESSAGING_SENDER_ID` | Sí* | |
| `REACT_APP_FIREBASE_APP_ID` | Sí* | |
| `REACT_APP_FIREBASE_MEASUREMENT_ID` | Sí* | |
| `REACT_APP_FIREBASE_VAPID_KEY` | Sí* | Clave VAPID para notificaciones push (Firebase Cloud Messaging). |
| `REACT_APP_STRIPE_PUBLISHABLE_KEY` | No | Clave publicable de Stripe para el módulo de pagos/facturación. |

\* Necesarias si se usan autenticación, notificaciones push o analítica.

> El `example.env` no incluye `REACT_APP_FIREBASE_VAPID_KEY` ni `REACT_APP_STRIPE_PUBLISHABLE_KEY`, pero el código sí las utiliza. Añádelas a tu `.env` local.

---

## Scripts disponibles

### `postdog-spa`

| Comando | Descripción |
| --- | --- |
| `npm start` | Servidor de desarrollo con recarga en caliente. |
| `npm run build` | Compila la versión de producción en `build/`. |
| `npm test` | Ejecuta los tests en modo interactivo. |
| `npm run eject` | Expone la configuración de Create React App (irreversible). |

### `postdog-webapp`

| Comando | Descripción |
| --- | --- |
| `npm start` | Genera el service worker y levanta el servidor de desarrollo. |
| `npm run build` | Genera el service worker y compila la versión de producción en `build/`. |
| `npm run generate-sw` | Genera `public/firebase-messaging-sw.js` a partir de `firebase-messaging-sw.template.js` usando las variables de Firebase. |
| `npm test` | Ejecuta los tests en modo interactivo. |
| `npm run eject` | Expone la configuración de Create React App (irreversible). |

---

## Build para producción

```bash
# postdog-spa
cd postdog-spa
npm run build

# postdog-webapp
cd ../postdog-webapp
npm run build
```

Ambos generan una carpeta `build/` con archivos estáticos listos para servir con Nginx, Apache, Vercel, Netlify o cualquier hosting estático.

> La carpeta `build/` está ignorada por Git.

---

## Pruebas

```bash
npm test
```

Ejecuta el test runner de Create React App (Jest + Testing Library) dentro de cada proyecto.

---

## Notas de despliegue

- Cada proyecto conserva su `bitbucket-pipelines.yml` original como referencia. **Las credenciales y hosts deben reemplazarse por variables de entorno/secretos** antes de reutilizarlos.
- Este repositorio es público: no incluyas claves reales en archivos versionados. Usa secretos del proveedor de CI/CD.
- El service worker `postdog-webapp/public/firebase-messaging-sw.js` se genera automáticamente y está ignorado por Git. No lo edites a mano; modifica `firebase-messaging-sw.template.js`.

---

## Documentación adicional

Cada proyecto incluye documentación interna en su carpeta `docs/`:

- `postdog-spa/docs/`: componentes, hooks y páginas.
- `postdog-webapp/docs/`: componentes, configuración, contexto, hooks, layouts, páginas, servicios y utilidades.
