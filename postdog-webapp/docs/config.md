# Archivo de Configuración: `sidebar.config.ts`

Este archivo centraliza la estructura y los datos de la navegación principal de la aplicación, que se muestra en el componente `Sidebar`. Al mantener esta configuración en un solo lugar, se facilita enormemente la gestión de los enlaces de navegación sin necesidad de modificar la lógica del componente `Sidebar`.

## Variable Exportada

### `navItems`

Una constante que exporta un array de objetos, donde cada objeto representa un elemento de navegación de primer nivel en el sidebar.

-   **Tipo**: `NavItem[]`
-   **Propósito**: Servir como la única "fuente de verdad" para la estructura de la navegación del sidebar.

## Estructura de Datos (`NavItem`)

Cada elemento en el array `navItems` sigue la interfaz `NavItem`. Esta interfaz soporta dos tipos de elementos de navegación:

1.  **Enlace Directo**: Un elemento de navegación de nivel superior que enlaza directamente a una página.
2.  **Grupo de Enlaces**: Un elemento de nivel superior que actúa como un encabezado para un grupo de sub-enlaces desplegables.

### Interfaz `NavItem`

A continuación se detalla la estructura del tipo `NavItem` y sus sub-tipos.

```typescript
// Asumiendo que esta es la definición del tipo NavItem en ../types
interface NavSubItem {
  name: string; // El texto que se muestra para el sub-enlace.
  path: string; // La ruta a la que navega el sub-enlace.
}

interface NavItem {
  name: string;             // El texto que se muestra para el elemento de nivel superior.
  icon: React.ReactNode;    // El componente de icono que se muestra junto al nombre.
  path?: string;            // La ruta a la que navega. Es OBLIGATORIO para enlaces directos.
  subItems?: NavSubItem[];  // Un array de sub-enlaces. OBLIGATORIO para grupos de enlaces.
}
```

-   `name`: (string, Requerido) El texto visible del enlace o del grupo.
-   `icon`: (React.ReactNode, Requerido) El componente de icono que se muestra. Puede ser de una librería como Material-UI o un icono personalizado.
-   `path`: (string, Opcional) La URL a la que navega el enlace. **Debe estar presente si `subItems` no lo está**.
-   `subItems`: (NavSubItem[], Opcional) Un array de objetos que representan los enlaces dentro de un grupo desplegable. **Debe estar presente si `path` no lo está**.
    -   Cada `NavSubItem` tiene su propio `name` y `path`.

## Uso

El array `navItems` es importado y consumido directamente por el componente `Sidebar` para renderizar dinámicamente la lista de navegación.

```jsx
// Dentro del componente Sidebar.tsx
import { navItems } from '../../../config/sidebar.config';

// ...

<ul className={styles['sidebar__nav']}>
  {navItems.map((navItem) => (
    // Lógica para renderizar un enlace directo o un grupo con sub-enlaces
    // basado en la presencia de la propiedad `subItems`.
  ))}
</ul>
```

## Cómo Modificar la Navegación

Para realizar cambios en la navegación del sidebar, solo se necesita editar el array `navItems` en este archivo.

### Ejemplo: Añadir un nuevo enlace directo

Para añadir un enlace a una página de "Soporte", simplemente agrega un nuevo objeto al array:

```javascript
// ... (otros items)
{
  name: 'Soporte',
  icon: <SupportIcon />, // Asumiendo que tienes un SupportIcon
  path: '/support', 
},
// ... (otros items)
```

### Ejemplo: Añadir un sub-enlace a un grupo existente

Para añadir un enlace de "Direcciones" al grupo de "Ajustes":

```javascript
// ...
{
  name: 'Ajustes',
  icon: <SettingsIcon />,
  subItems: [
    { name: 'Perfil', path: '/#' },
    { name: 'Notificaciones', path: '/#' },
    { name: 'Direcciones', path: '/settings/addresses' }, // Nuevo sub-enlace
  ],
},
// ...
```

## Dependencias

-   **`NavItem` (Tipo)**: La interfaz de TypeScript que define el contrato de datos para cada elemento de navegación.
-   **Iconos**: Componentes de iconos importados de librerías (`@mui/icons-material`) o de archivos locales (`../components/icons`) para la representación visual de cada elemento.


---------------------------------------------------------------------------------------------