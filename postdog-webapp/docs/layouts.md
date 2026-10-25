# Componente: `DashboardLayout`

El `DashboardLayout` es un componente de alto nivel que define la estructura visual y funcional para todas las páginas autenticadas de la aplicación. Actúa como un **componente contenedor protegido** (protected container component).

Ruta: src\layouts\Dashboard\DashboardLayout.tsx

## Responsabilidades Principales

-   **Protección de Rutas**: Asegura que solo los usuarios autenticados puedan acceder a las páginas que envuelve. Si un usuario no está autenticado, lo redirige automáticamente a la página de login.
-   **Estructura Visual**: Renderiza la disposición general de la interfaz del dashboard, incluyendo el `Sidebar` (panel lateral), el `Header` (encabezado) y el área de contenido principal.
-   **Gestión del Estado del Sidebar**: Utiliza el `SidebarContext` para controlar la visibilidad del sidebar y del `Backdrop` (fondo oscuro).
-   **Manejo de Cierre de Sesión**: Proporciona la funcionalidad de `logout` al componente `Header`.

## Props

| Prop       | Tipo              | Requerido | Descripción                                                                |
| ---------- | ----------------- | --------- | -------------------------------------------------------------------------- |
| `children` | `React.ReactNode` | Sí        | El contenido de la página específica que se renderizará dentro del layout. |
| `title`    | `string`          | Sí        | El título que se mostrará en el componente `Header` para la página actual. |

## Uso

El `DashboardLayout` está diseñado para ser utilizado en la configuración del enrutador (como `react-router-dom`) para envolver los componentes de las páginas que requieren que el usuario esté autenticado.

```tsx
// En un archivo de rutas (ej. App.tsx o Routes.tsx)
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout/DashboardLayout';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* Rutas públicas que NO usan el layout */}
        <Route path="/login" element={<LoginPage />} />

        {/* Rutas protegidas que SÍ usan el layout */}
        <Route 
          path="/" 
          element={
            <DashboardLayout title="Inicio">
              <HomePage />
            </DashboardLayout>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <DashboardLayout title="Mi Perfil">
              <ProfilePage />
            </DashboardLayout>
          }
        />
        
        {/* ...otras rutas protegidas... */}
      </Routes>
    </Router>
  );
};
```

## Flujo de Datos y Lógica Interna

### 1. Protección de Rutas (Authentication Guard)

El componente implementa la protección de rutas de dos maneras robustas:

-   **Renderizado Condicional**: La lógica principal de renderizado comprueba `!appUser`. Si no hay un usuario en el `AppContext`, el componente renderiza un `<Navigate to="/login" />` de `react-router-dom`, que realiza una redirección inmediata y declarativa sin intentar renderizar el resto del layout.
-   **Efecto de Verificación (`useEffect`)**: Como una capa adicional de seguridad y para manejar casos de borde, un `useEffect` se ejecuta en el montaje del componente. La función `validateSession` comprueba la existencia del usuario y, si no lo encuentra, utiliza `navigate("/login")` para redirigir.

### 2. Gestión del Sidebar

-   El layout obtiene `isSidebarOpen` y `toggleSidebar` del `useSidebar` context.
-   El valor `isSidebarOpen` se utiliza para aplicar condicionalmente la clase CSS `styles['layout--sidebar-closed']`, que ajusta el estilo del layout cuando el sidebar está cerrado (por ejemplo, expandiendo el área de contenido principal).
-   La función `toggleSidebar` se pasa como `onClick` al componente `Backdrop`, permitiendo que al hacer clic en el fondo oscuro se cierre el sidebar.

### 3. Autenticación y Cierre de Sesión

-   A través del `useAppContext`, el componente obtiene el objeto `user` y la función `logoutUser`.
-   El objeto `user` es la "fuente de verdad" para determinar si el usuario está autenticado.
-   El layout define una función local `logoutUser` que primero llama a `appContext?.logoutUser()` (para limpiar el estado de la sesión en el contexto) y luego redirige al usuario a `/login`.
-   Esta función `logoutUser` se pasa como prop al componente `Header`, manteniendo al `Header` como un componente de presentación "tonto" que solo notifica la intención de cerrar sesión, mientras que el `DashboardLayout` maneja la lógica real.

## Dependencias

-   **`react-router-dom`**: Utiliza `useNavigate` para la redirección programática y `Navigate` para la redirección declarativa.
-   **Contextos**:
    -   `useSidebar` (de `SidebarContext`): Para controlar el estado del panel lateral.
    -   `useAppContext` (de `AppContext`): Para acceder a la información del usuario autenticado y la función de cierre de sesión.
-   **Componentes Hijos**:
    -   `Sidebar`: El panel de navegación lateral.
    -   `Header`: El encabezado de la página.
    -   `Backdrop`: El fondo oscuro que se muestra cuando el sidebar está abierto en modo superpuesto.


    -----------------------------------------------------------------------------------------------------------------------------------------------------


# Componente: `Sidebar`

El `Sidebar` es el componente de navegación principal y persistente en la interfaz del dashboard. Es un panel lateral responsivo y data-driven que proporciona a los usuarios acceso a las diferentes secciones de la aplicación.

Ruta: src\components\Layout\Sidebar\Sidebar.tsx

## Responsabilidades Principales

-   **Navegación Principal**: Muestra los enlaces de navegación a las vistas clave de la aplicación.
-   **Comportamiento Responsivo**: Puede estar en un estado expandido (abierto) o colapsado (cerrado), mostrando u ocultando los textos de los enlaces y cambiando su logo.
-   **Navegación Jerárquica**: Soporta grupos de navegación desplegables (accordion) para organizar enlaces relacionados.
-   **Estado Activo**: Resalta visualmente tanto el enlace individual activo como el grupo de navegación al que pertenece.
-   **Acción Principal (CTA)**: Incluye un botón de llamada a la acción prominente para iniciar una acción global, como "Realizar envío".

## Props

Este componente **no recibe props**. Es un componente autónomo que obtiene todo el estado y los datos que necesita de contextos de React y archivos de configuración.

## Uso

El `Sidebar` está diseñado para ser un componente hijo de un layout principal, como `DashboardLayout`, que controla el marco general de las páginas autenticadas.

```tsx
// En un componente de layout como DashboardLayout.tsx
import Sidebar from '../../components/Layout/Sidebar/Sidebar';

const DashboardLayout = ({ children }) => {
  // ... lógica del layout ...
  return (
    <div className="layout">
      <div className="layout__sidebar">
        <Sidebar /> {/* El Sidebar se renderiza aquí */}
      </div>
      <div className="layout__main">
        {/* ... Header y contenido ... */}
      </div>
    </div>
  );
};
```

## Lógica Interna y Comportamiento Clave

### 1. Estado de Apertura (Controlado por Contexto)

-   El estado visual principal del sidebar (abierto o cerrado) **no se gestiona localmente**. Se consume del `SidebarContext` a través del hook `useSidebar`.
-   La variable `isSidebarOpen` se utiliza para aplicar condicionalmente la clase CSS `styles['sidebar--closed']`, que controla el ancho, la visibilidad de los textos y el cambio del logo.

### 2. Navegación Data-Driven

-   La estructura de la navegación no está codificada directamente en el JSX. Se lee de un archivo de configuración (`sidebar.config.ts`) importado como `navItems`.
-   Esto hace que añadir, eliminar o reorganizar los enlaces de navegación sea tan simple como modificar un array de objetos, sin tocar la lógica del componente.
-   La configuración `navItems` soporta tanto enlaces directos como grupos con sub-enlaces (`subItems`).

### 3. Grupos Desplegables (Accordion)

-   El componente utiliza un estado local `openGroup` (gestionado con `useState`) para saber qué grupo de navegación está actualmente expandido.
-   La función `handleGroupClick` actúa como un interruptor (toggle): si se hace clic en el grupo ya abierto, se cierra; si se hace clic en otro, se abre ese y se cierra el anterior (implícitamente, ya que `openGroup` solo puede tener un valor).
-   Los iconos de flecha (`ExpandLessIcon` y `KeyboardArrowDownIcon`) cambian según si el grupo está abierto o cerrado.

### 4. Resaltado de Estado Activo

El `Sidebar` implementa el resaltado del estado activo de dos maneras:

-   **Enlaces Individuales**: Utiliza el componente `<NavLink>` de `react-router-dom`. Su prop `className` recibe una función que provee el estado `isActive`, permitiendo aplicar la clase `styles['sidebar__navLink--active']` al enlace que coincide con la URL actual.
-   **Grupos de Navegación**: Para resaltar un grupo entero (ej. "Configuración") cuando el usuario está en una de sus sub-páginas, se utiliza el hook `useLocation`. La lógica `navItem.subItems.some(subItem => currentLocation.pathname.startsWith(subItem.path))` comprueba si la ruta actual comienza con la ruta de alguno de los sub-enlaces del grupo.

### 5. Llamada a la Acción Principal (CTA)

-   El botón "Realizar envío" no es un enlace de navegación. Es una acción que dispara una funcionalidad global en la aplicación.
-   Utiliza el hook `useShippingQuoteDrawer` para obtener la función `openDrawer`. Al hacer clic en el botón, se invoca esta función para abrir un panel lateral (drawer) de cotización, que es gestionado por otro contexto.

## Dependencias

-   **Contextos**:
    -   `useSidebar` (de `SidebarContext`): Para saber si el sidebar debe estar abierto o cerrado.
    -   `useShippingQuoteDrawer` (de `ShippingQuoteDrawerContext`): Para disparar la apertura del drawer de cotizaciones.
-   **`react-router-dom`**:
    -   `NavLink`: Para crear enlaces de navegación que conocen su estado activo.
    -   `useLocation`: Para obtener la ruta actual y determinar el grupo de navegación activo.
-   **Configuración**:
    -   `navItems` (de `sidebar.config.ts`): La estructura de datos que define los enlaces de navegación.
-   **Assets**:
    -   `logo`, `logoSm`: Imágenes del logo para los estados expandido y colapsado.
-   **Iconos (`@mui/icons-material`)**: Para mejorar la interfaz de usuario en el CTA y los grupos desplegables.


---------------------------------------------------------------------------------------------------------------------------

# Componente: `Header`

El `Header` es el componente que renderiza la barra de navegación superior dentro del `DashboardLayout`. Es un componente de presentación (presentational component) que muestra información contextual y proporciona acceso a acciones globales del usuario.

Ruta: src\components\Layout\Header\Header.tsx

## Responsabilidades Principales

-   **Control del Sidebar**: Muestra un botón (ícono de menú) para abrir o cerrar el panel lateral de navegación (`Sidebar`).
-   **Título de la Página**: Despliega el título de la página actual, que recibe a través de props.
-   **Acciones del Usuario**: Proporciona un conjunto de acciones rápidas, como ver el saldo, notificaciones, menú de ayuda y un menú de usuario.
-   **Cierre de Sesión**: Contiene el botón para que el usuario cierre su sesión, delegando la lógica de esta acción a su componente padre.

## Props

| Prop         | Tipo         | Requerido | Descripción                                                                                              |
| ------------ | ------------ | --------- | -------------------------------------------------------------------------------------------------------- |
| `title`      | `string`     | Sí        | El texto que se mostrará como el título principal de la página.                                          |
| `logoutUser` | `() => void` | Sí        | Función callback que se invoca cuando el usuario hace clic en la opción "Cerrar sesión" del menú de usuario. |

## Uso

El `Header` está diseñado para ser un hijo directo del `DashboardLayout`, que le proporciona el título de la página y la función de cierre de sesión.

```tsx
// En un componente de layout como DashboardLayout.tsx
import Header from '../../components/Layout/Header/Header';
import { useAppContext } from '../../context/AppContext';

const DashboardLayout = ({ children, title }) => {
  const { logoutUser } = useAppContext(); // Lógica de logout viene de un contexto

  return (
    <div className="layout">
      {/* ... Sidebar ... */}
      <div className="layout__main">
        <Header 
          title={title} 
          logoutUser={logoutUser} 
        />
        <main>{children}</main>
      </div>
    </div>
  );
};
```

## Lógica Interna y Comportamiento Clave

### 1. Gestión de Menús Desplegables

El `Header` gestiona internamente la visibilidad de tres menús desplegables distintos (Notificaciones, Ayuda y Usuario).

-   **Estado Independiente**: Cada menú tiene su propio estado booleano (`isNotificationsMenuOpen`, `isHelpMenuOpen`, `isUserMenuOpen`) gestionado con `useState`.
-   **Comportamiento Excluyente**: Para una mejor experiencia de usuario, al abrir un menú, los otros se cierran automáticamente. Las funciones `toggle...Menu` se encargan de esta lógica.
-   **Cierre al Hacer Clic Fuera ("Click Outside")**:
    -   Se utiliza un `useRef` para cada menú (`notificationsMenuRef`, `helpMenuRef`, `userMenuRef`) para obtener una referencia a su elemento DOM.
    -   Un `useEffect` añade un event listener (`mousedown`) al `document` cuando el componente se monta.
    -   Si se detecta un clic fuera del área de cualquiera de los menús abiertos, su estado de visibilidad se establece en `false`, cerrándolo.
    -   El `useEffect` incluye una función de limpieza que elimina el event listener cuando el componente se desmonta, previniendo fugas de memoria.

### 2. Interacción con el Layout

-   El componente utiliza el hook `useSidebar` para obtener la función `toggleSidebar`.
-   Esta función se enlaza al `onClick` del botón con el ícono de menú, permitiendo que el `Header` comande la apertura y cierre del `Sidebar`, aunque el estado real de este último viva en el `SidebarContext`.

### 3. Delegación de Lógica (Componente de Presentación)

-   El `Header` es un buen ejemplo de un componente de presentación o "tonto". No contiene lógica de negocio sobre cómo cerrar una sesión.
-   Recibe la función `logoutUser` como prop y simplemente la invoca cuando el usuario hace clic en el botón correspondiente.
-   Esta separación de responsabilidades hace que el `Header` sea más reutilizable y fácil de probar, ya que su única tarea es mostrar datos y notificar eventos.

## Dependencias

-   **`react`** (`useState`, `useEffect`, `useRef`): Hooks fundamentales de React.
-   **`SidebarContext`**: A través del hook `useSidebar`, para interactuar con el estado del panel lateral.
-   **Iconos (`@mui/icons-material`)**: Para proporcionar una interfaz visual clara y reconocible para las diferentes acciones.