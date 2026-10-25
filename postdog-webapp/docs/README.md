## 🧱 DashboardLayout

`DashboardLayout` es un componente que define la estructura base de una vista tipo panel administrativo. Proporciona una distribución compuesta por:

- **Sidebar (`<Sidebar />`)**: Menú lateral persistente, con capacidad de ocultarse o mostrarse mediante el contexto `SidebarContext`.
- **Header (`<Header />`)**: Cabecera superior que recibe dinámicamente un título como prop.
- **Área de contenido principal**: Espacio central donde se renderizan los `children`, es decir, el contenido específico de cada vista.

También incluye un componente `<Backdrop />` que se muestra cuando el sidebar está abierto en dispositivos móviles, permitiendo cerrarlo al hacer clic fuera del menú.

### Props

| Prop       | Tipo               | Descripción                                        |
|------------|--------------------|----------------------------------------------------|
| `title`    | `string`           | Título que se muestra en el header.                |
| `children` | `React.ReactNode`  | Contenido principal que se renderiza en el layout. |

### 🧠 Lógica interna

- Utiliza el hook `useSidebar()` para controlar el estado de visibilidad del sidebar.
- Aplica clases condicionales para modificar el layout cuando el sidebar está cerrado.
- Encapsula estilos con módulos SCSS para mantener la separación de responsabilidades visuales.

### 📦 Ejemplo de uso

```tsx
import DashboardLayout from './layouts/DashboardLayout';

const DashboardPage = () => (
  <DashboardLayout title="Panel de control">
    <section>
      {/* Tu contenido aquí */}
    </section>
  </DashboardLayout>
);
```

## 📚 Sidebar

`Sidebar` es un componente de navegación lateral que forma parte del layout principal de la aplicación. Su diseño es responsivo y dinámico, adaptándose al estado de apertura definido por el contexto global `SidebarContext`.

### 🧩 Características principales

- **Logo adaptable**: Muestra una versión completa o compacta del logo según el estado del sidebar.
- **Botón CTA**: Incluye un botón de acción rápida para "Realizar envío", visible solo cuando el sidebar está abierto.
- **Navegación agrupada**: Renderiza grupos de navegación con subitems colapsables, definidos en `sidebar.config.ts`.
- **Estado de grupo expandido**: Controla qué grupo de navegación está abierto mediante el estado local `openGroup`.
- **Detección de ruta activa**: Resalta el grupo o subitem activo según la ruta actual (`useLocation()`).
- **Animaciones y estilos condicionales**: Usa clases dinámicas para mostrar u ocultar elementos según el estado del sidebar.

### 🧠 Lógica interna

- Utiliza el contexto `useSidebar()` para saber si el sidebar está abierto (`isSidebarOpen`).
- Usa `useState` para manejar qué grupo de navegación está expandido (`openGroup`).
- Aplica condicionales para mostrar íconos de expansión (`ExpandLessIcon`, `KeyboardArrowDownIcon`) y subitems.
- Cierra automáticamente los subitems al navegar si el sidebar está colapsado.

### 📦 Ejemplo de uso

Este componente se utiliza internamente dentro de `DashboardLayout`, por lo que no requiere props externas:

```tsx
import Sidebar from './components/Layout/Sidebar';

const Layout = () => (
  <div>
    <Sidebar />
    {/* Otros componentes */}
  </div>
);
```

## 🧭 Header

`Header` es el componente de cabecera principal del layout. Proporciona navegación contextual, accesos rápidos y menús interactivos para mejorar la experiencia del usuario en el panel administrativo.

### 🧩 Características principales

- **Botón de menú lateral**: Permite abrir o cerrar el `Sidebar` mediante el contexto `SidebarContext`.
- **Título dinámico**: Muestra el título de la vista actual recibido como prop.
- **Indicador de saldo**: Visualiza el saldo actual del usuario (en este caso, fijo en `$0 MXN`).
- **Menú de notificaciones**: Acceso a alertas del sistema, con apertura condicional.
- **Menú de ayuda**: Acceso a opciones como "Crear reporte" y contacto por WhatsApp.
- **Menú de usuario**: Muestra información de la cuenta y permite cerrar sesión.

### 🧠 Lógica interna

- Utiliza `useState` para controlar la visibilidad de cada menú (`help`, `notifications`, `user`).
- Usa `useRef` para detectar clics fuera de los menús y cerrarlos automáticamente (`handleClickOutside`).
- Integra íconos de Material UI para mejorar la interfaz visual.
- Aplica estilos condicionales y animaciones mediante módulos SCSS.

### 📦 Props

| Prop     | Tipo     | Descripción                          |
|----------|----------|--------------------------------------|
| `title`  | `string` | Título que se muestra en el header.  |

### 📦 Ejemplo de uso

Este componente se utiliza dentro de `DashboardLayout`:

```tsx
import Header from './components/Layout/Header';

<Header title="Panel de control" />
```

## 🧠 Uso del Contexto

La aplicación utiliza el contexto `SidebarContext` para controlar el estado global del menú lateral (`Sidebar`). Este contexto permite:

- Abrir/cerrar el sidebar desde cualquier componente.
- Compartir datos dinámicos para submenús (`submenuData`).
- Centralizar la lógica de navegación lateral.

### 📦 Proveedor del contexto

El contexto se define en `SidebarContext.tsx` y se expone mediante el componente `<SidebarProvider>`. Este debe envolver tu aplicación para que los componentes hijos puedan acceder al estado del sidebar.

### 🛠️ Ejemplo mínimo (`index.tsx` o `main.tsx`)

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { SidebarProvider } from "./context/SidebarContext";
import { AppProvider } from "./context/AppContext";

function App() {
  return (
    <AppProvider>
      <SidebarProvider>
      //code rutes.......
      </SidebarProvider>
    </AppProvider>
  );
}
```


## Estructura de Carpetas
La organización de los archivos del layout sigue una estructura modular para facilitar su mantenimiento.
```tsx
/
├── docs/
│   └── README.md         # Esta documentación.
└── src/
    ├── assets/
    │   └── styles/       # Archivos SCSS globales (_variables.scss, etc.).
    │   └── Logos/       # Archivos de imagenes y logos del proyecto
    ├── components/
    │   └── Layout/       # Componentes visuales genéricos del layout (Sidebar, Header).
    │       └── Sidebar/     
    │       └── Header/     
    │       └── Backdrop/     
    ├── config/
    │   └── sidebar.config.ts # Configuración de los items de navegación del Sidebar.
    ├── context/
    │   └── SidebarContext.tsx  # Lógica y proveedor del estado del sidebar.
    ├── layouts/
    │   └── Dashboard/      # Orquestador principal del layout.
    │       └── DashboardLayout.tsx
    └── pages/
        └── dashboard/      # Páginas que se renderizan dentro del layout.
```
## 🚀 Instalación

Antes de comenzar, asegúrate de tener instalado [Node.js](https://nodejs.org/) y un gestor de paquetes como **Yarn** (recomendado) o **npm**.

### 📦 Dependencias principales

Estas librerías son necesarias para renderizar la interfaz de usuario y aplicar estilos dinámicos:

| Paquete                  | Descripción                                                                 |
|--------------------------|-----------------------------------------------------------------------------|
| `@mui/material`          | Biblioteca principal de componentes UI basada en Material Design.          |
| `@mui/icons-material`    | Colección oficial de íconos para Material UI.                              |
| `styled-components`      | Librería CSS-in-JS para crear componentes con estilos encapsulados.         |

### 🛠️ Dependencias de desarrollo

Estas herramientas mejoran la experiencia de desarrollo, asegurando calidad, tipado y estilos escalables:

| Paquete                     | Descripción                                                                 |
|-----------------------------|-----------------------------------------------------------------------------|
| `sass`                      | Preprocesador que permite escribir estilos en formato SCSS.                 |
| `eslint`                    | Analizador estático para detectar errores y mantener buenas prácticas.     |
| `@types/styled-components` | Tipado para `styled-components`, útil para autocompletado en TypeScript.   |

### 📥 Instalación con Yarn (recomendado)

```bash
# Instalar dependencias de producción
yarn add @mui/material @mui/icons-material styled-components

# Instalar dependencias de desarrollo
yarn add -D sass eslint @types/styled-components
```

## 🎨 Convenciones de estilos

Para mantener la consistencia y escalabilidad en los estilos, seguimos las siguientes convenciones:

### 🧩 Uso de `styled-components`

Utilizamos `styled-components` como solución principal de estilos, aprovechando su capacidad de encapsulación y tipado con TypeScript. Se recomienda:

- **Estilos anidados al estilo SCSS** para mejorar la legibilidad.
- **Separar componentes estilizados** en archivos propios si tienen lógica o estilos complejos.
- **Evitar estilos inline** o uso excesivo de props para estilos dinámicos no reutilizables.

## 🛠️ Mantenimiento

Nota: Aqui se debe agregar el seguimiento de alguna modificacion.