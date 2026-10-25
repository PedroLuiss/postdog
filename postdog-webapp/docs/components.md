
# Componente `PickupsTable`

## Resumen

`PickupsTable` Su única responsabilidad es renderizar una lista de recogidas (`pickups`) que recibe a través de props. Está diseñado para manejar y mostrar de manera clara los diferentes estados del proceso de carga de datos: carga en curso (`isLoading`), un error (`error`), una lista vacía, o la lista de resultados exitosa.

No contiene lógica de negocio para la obtención de datos, sino que se limita a mostrarlos y a delegar las acciones del usuario (como editar un envío) a través de un contexto de React.

## Props (`PickupsTableProps`)

El componente recibe las siguientes props para funcionar:

| Prop      | Tipo             | Opcional | Valor por Defecto | Descripción                                                                                               |
| --------- | ---------------- | -------- | ----------------- | --------------------------------------------------------------------------------------------------------- |
| `pickups` | `OrderPickups[]` | No       | -                 | Un array de objetos, donde cada objeto contiene la información de una recogida a ser mostrada.             |
| `isLoading` | `boolean`        | Sí       | `false`           | Un booleano que, si es `true`, indica al componente que muestre un esqueleto de carga (`SkeletonLoader`).  |
| `error`   | `string \| null` | Sí       | `null`            | Si se proporciona un string de error, el componente mostrará un mensaje de error (`ErrorMessage`).        |

---

## Gestión de Estados de Renderizado

Una de las principales responsabilidades de este componente es gestionar qué se muestra en la UI según el estado de los datos. Sigue este orden de prioridad:

1.  **Estado de Carga (`isLoading: true`)**: Si `isLoading` es `true`, el componente renderizará un componente `SkeletonLoader` para indicar al usuario que los datos se están cargando.
2.  **Estado de Error (`error: string`)**: Si `error` contiene un mensaje, se renderizará el componente `ErrorMessage`, mostrando dicho mensaje.
3.  **Estado Vacío (`pickups.length === 0`)**: Si no está cargando ni hay error, pero el array `pickups` está vacío, se mostrará un mensaje indicando que no se encontraron registros.
4.  **Estado Exitoso (`pickups.length > 0`)**: Si hay elementos en el array `pickups`, el componente procederá a mapear el array y renderizar la lista completa de recogidas.

---

## Lógica Interna y Helpers

El componente utiliza funciones internas para procesar y formatear los datos antes de renderizarlos:

-   **`getStatusTagModifier(status)`**: Recibe el `status` de una recogida (ej. `'GENERATED'`) y devuelve la clase CSS correspondiente desde el archivo de estilos (`.scss`). Esto permite aplicar estilos visuales diferentes a cada estado (ej. colores).
-   **`getStatusText(status)`**: Recibe el `status` y devuelve un texto legible para el usuario (ej. `'GENERATED'` se convierte en `'Generado'`).
-   **`handleOpenDrawerEditOrder(order)`**: Es el manejador de eventos para la acción de "Continuar envío". No implementa la lógica directamente, sino que llama a la función `openDrawerEditOrde` obtenida del contexto `useShippingQuoteDrawer`.

## Interacciones y Contexto

-   **`useShippingQuoteDrawer`**: El componente utiliza este custom hook para obtener acceso a la función `openDrawerEditOrde`. Esto es un buen ejemplo de inversión de control: `PickupsTable` no necesita saber *cómo* se abre o funciona el drawer de edición, simplemente invoca la función que el contexto le provee.
-   **Acciones Condicionales**: Los botones de acción para cada recogida se renderizan de forma condicional basados en el `pickup.status`.
    -   Si el estado es `PENDING`, se muestra un botón de edición (`EditIcon`) que, al ser presionado, abre el drawer para continuar con el envío.
    -   Si el estado es `GENERATED`, se muestran botones para otras acciones como ver detalles.

## Estructura del Renderizado (JSX)

-   El componente mapea el array `pickups` para crear un `div` por cada recogida, usando `pickup.uid` como `key`.
-   La información de cada recogida se organiza usando un layout de CSS Grid (`styles['table-list-pickups__grid']`).
-   Se muestra información detallada de cada recogida, incluyendo:
    -   **Remitente**: Nombre y dirección.
    -   **Paquete**: Tipo y dimensiones.
    -   **Productos**: Cantidad.
    -   **Paquetería**: Logo y nombre del transportista.
    -   **Fecha**: Se utiliza una utilidad `FormattedDateUtils` para formatear la fecha de creación.
-   Maneja casos donde los datos pueden ser nulos o estar pendientes, mostrando el texto "Pendiente" y aplicando estilos específicos.
-   Utiliza el componente `CustomTooltipUi` para añadir tooltips informativos a los botones de acción.

## Dependencias

-   **`react`**: Librería principal de React.
-   **`PickupsTable.module.scss`**: Estilos locales del componente.
-   **Componentes de UI**: `CustomTooltipUi`, `SkeletonLoader`, `ErrorMessage`.
-   **Componentes de Iconos**: `BuildingIcon`, `EditIcon`.
-   **Contexto**: `useShippingQuoteDrawer` para interactuar con el estado global de la aplicación (el drawer de edición).
-   **Tipos**: `OrderPickups` de `../../types`.
-   **Utilidades**: `FormattedDateUtils` para el formateo de fechas.
-   **Assets**: Imágenes estáticas como `shopify.png`.

#  Componente `PickupsSearchBar`

## Resumen

`PickupsSearchBar` es un componente de React presentacional y controlado, diseñado para proporcionar una interfaz de usuario completa para buscar, filtrar y realizar acciones sobre una lista de recogidas.

Su principal responsabilidad es renderizar los controles de la UI (campo de búsqueda, botones de acción) y delegar todos los eventos y cambios de estado a un componente padre a través de un conjunto de props (callbacks). No contiene lógica de negocio ni realiza peticiones a la API por sí mismo.

## Props (`PickupsSearchBarProps`)

Este componente es "controlado", lo que significa que recibe tanto los datos a mostrar como las funciones a ejecutar desde su padre.

| Prop             | Tipo                                   | Descripción                                                                                                                              |
| ---------------- | -------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `currentFilters` | `FilterValues`                         | Un objeto que contiene los valores actuales de los filtros. El componente utiliza este prop para poblar sus campos (ej. el valor del input de búsqueda). |
| `onFiltersChange`| `(newFilters: FilterValues) => void`   | Callback que se invoca cada vez que un valor de filtro cambia (ej. al escribir en el input). Su propósito es actualizar el estado "borrador" en el padre. |
| `onApplyFilters` | `(filters: FilterValues) => void`      | Callback que se ejecuta cuando el usuario confirma los filtros (generalmente desde el `FilterModal`). Esto debería disparar la búsqueda real. |
| `onClearFilters` | `() => void`                           | Callback que se invoca para resetear todos los filtros a su estado inicial.                                                              |
| `onRefresh`      | `() => void`                           | Callback que se ejecuta al presionar el botón "Actualizar" para volver a cargar los datos de la vista actual.                          |
| `onSearch`       | `() => void`                           | Callback que se ejecuta al presionar el botón de búsqueda o la tecla "Enter" en el input.                                              |

---

## Estado Interno

El componente maneja un único estado interno para controlar su propia UI.

-   **`isFilterOpen (boolean)`**: Un estado booleano que determina si el componente `FilterModal` está visible o no. Se inicializa en `false`.

---

## Comportamiento y Flujo de Interacción

### 1. Búsqueda por Texto
-   El `input` de búsqueda es un componente controlado. Su valor está ligado a `currentFilters.searchTerm`.
-   Cuando el usuario escribe en el campo (`onChange`), se dispara la función `handleSearchInputChange`.
-   `handleSearchInputChange` crea una nueva copia del objeto `currentFilters`, actualiza la propiedad `searchTerm` y llama al prop `onFiltersChange` con este nuevo objeto. Esto permite al componente padre tener un estado "borrador" de los filtros sin ejecutar una búsqueda en cada pulsación de tecla.
-   Si el usuario presiona la tecla `Enter` (`onKeyDown`) o hace clic en el botón de la lupa (`onClick`), se invoca la función `onSearch` del padre para ejecutar la búsqueda.

### 2. Filtrado Avanzado
-   El botón "Filtrar" con el ícono de embudo (`FunnelIcon`) controla el estado `isFilterOpen`. Al hacer clic, cambia el valor booleano, mostrando u ocultando el modal.
-   Cuando `isFilterOpen` es `true`, se renderiza el componente `FilterModal`.
-   `PickupsSearchBar` pasa sus propios props de control directamente a `FilterModal` (`onApply`, `onClear`, `currentFilters`, `onChange`), actuando como un intermediario entre la página principal (`PickupsPage`) y el modal de filtros.
-   El `FilterModal` se cierra llamando a la función `onClose` que simplemente establece `isFilterOpen` a `false`.

### 3. Acciones Adicionales
-   El botón "Actualizar" tiene un evento `onClick` que invoca directamente la función `onRefresh` pasada por props, permitiendo al padre recargar los datos.

## Componentes Hijos Utilizados

-   **`FilterModal`**: Un componente modal que encapsula los filtros avanzados (fechas, estados, etc.). Es controlado por `PickupsSearchBar` a través de props.
-   **Iconos**: Se utilizan varios componentes de iconos para mejorar la interfaz visual, como `SearchIcon`, `FunnelIcon` y `RefreshIcon`.

## Dependencias

-   **`react`**: Para el hook `useState`.
-   **`PickupsSearchBar.module.scss`**: Archivo de estilos CSS Modules para el componente.
-   **Componentes de Iconos**: Componentes SVG para la renderización de iconos.
-   **`types`**: Para la definición del tipo `FilterValues`.


# Componente: `ParcelSection`

## Descripción General

El componente `ParcelSection` es un componente de presentación diseñado para gestionar la selección de la empresa de paquetería (courier) dentro del modal de envío. Al igual que otros componentes de sección en el modal, opera en dos modos distintos controlados por la prop `isEditing`.

1.  **Modo de Visualización (por defecto):** Muestra un resumen detallado de la opción de envío actualmente seleccionada, incluyendo el logo de la empresa, el nombre del servicio, los tiempos de entrega y el precio. Si no hay ninguna opción seleccionada, no muestra nada.
2.  **Modo de Edición:** Renderiza el componente `ShippingOptions`, que presenta una tabla interactiva con todas las opciones de envío disponibles, permitiendo al usuario filtrar, ordenar y seleccionar una nueva opción.

Este componente actúa como un contenedor contextual, decidiendo si mostrar un resumen simple o la interfaz de selección completa, mientras delega toda la lógica de estado y manipulación de datos a su componente padre a través de props.

Ruta: src\components\FinalizeShippingModal\ParcelSection.tsx

## Responsabilidades Clave

- **Renderizado Condicional:** Su función principal es alternar entre la vista de resumen y la vista de edición basándose en la prop `isEditing`.
- **Mostrar Resumen de la Selección:** En modo de visualización, si hay una `selectedOption`, renderiza una tarjeta con toda la información relevante de la paquetería elegida.
- **Activar Modo de Edición:** Provee un botón "Editar" que invoca la función `handlers.onEdit` para cambiar a la vista de selección.
- **Delegar la Interfaz de Selección:** En modo de edición, delega completamente la renderización y la lógica de la tabla de opciones al componente hijo `ShippingOptions`, pasándole todas las props necesarias para su funcionamiento (opciones, filtros, ordenamiento, etc.).

---

## Props

El componente `ParcelSection` recibe un objeto de props con la siguiente estructura:

| Prop             | Tipo                                           | Requerido | Valor por Defecto | Descripción                                                                                                     |
| :--------------- | :--------------------------------------------- | :-------- | :---------------- | :---------------------------------------------------------------------------------------------------------------- |
| `isEditing`      | `boolean`                                      | **Sí**    | N/A               | Controla si el componente se muestra en modo de edición (`true`) o de visualización (`false`).                  |
| `options`        | `ShippingOption[]`                             | **Sí**    | N/A               | Un array con todas las opciones de envío disponibles para mostrar en la tabla de edición.                       |
| `selectedOption` | `ShippingOption` (opcional)                    | No        | `undefined`       | El objeto de la opción de envío actualmente seleccionada. Se usa para la vista de resumen.                        |
| `sortConfig`     | `SortConfig`                                   | **Sí**    | N/A               | Un objeto que define la configuración actual de ordenamiento de la tabla (clave y dirección).                   |
| `handlers`       | `object`                                       | **Sí**    | N/A               | Un objeto que agrupa todas las funciones callback y estados relacionados con la interacción del usuario. (Ver detalle) |

### Detalle del Objeto `handlers`:

Este objeto provee la interactividad completa para la sección, especialmente para el modo de edición a través del componente `ShippingOptions`:

- `onEdit: () => void`: Función para activar el modo de edición.
- `onSelect: (id: string) => void`: Función que se llama cuando se selecciona una nueva opción de envío.
- `onSort: (key: 'estimatedDelivery' \| 'price') => void`: Función para cambiar el criterio de ordenamiento de la tabla.
- **Estado y Manejadores del Filtro:**
    - `isFilterOpen: boolean`: Estado que controla la visibilidad del panel de filtros.
    - `setIsFilterOpen: React.Dispatch<React.SetStateAction<boolean>>`: Función para abrir o cerrar el panel de filtros.
    - `availableCarriers: string[]`: Array de todas las paqueterías disponibles para el filtro.
    - `selectedCarriers: string[]`: Array de las paqueterías actualmente seleccionadas en el filtro.
    - `setSelectedCarriers: React.Dispatch<React.SetStateAction<string[]>>`: Función para actualizar las paqueterías seleccionadas en el filtro.

---

## Dependencias

- **`ShippingOptions` (Componente):** Es la dependencia más importante. `ParcelSection` delega toda la complejidad de la vista de edición (tabla, filtros, ordenamiento) a este componente hijo.

---

## Uso

Este componente se debe usar dentro de un contenedor que gestione el estado de edición y los datos de las paqueterías, típicamente a través de un custom hook como `useStepThree` o `useFinalizeShipping`.

```jsx
// En el componente padre (ej. FinalizeShippingModal.tsx)

import { ParcelSection } from './ParcelSection';

const ParentComponent = () => {
  const [isEditingCourier, setIsEditingCourier] = useState(false);
  
  // 'options', 'selectedOption' y los handlers vendrían de un hook como useStepThree
  const { 
    options, 
    selectedOption, 
    sortConfig,
    handleSelectOption,
    handleSort,
    isFilterOpen,
    setIsFilterOpen,
    // ...resto de los datos y funciones del filtro
  } = useStepThree();

  const courierHandlers = {
    onEdit: () => setIsEditingCourier(true),
    onSelect: (id) => {
      handleSelectOption(id);
      setIsEditingCourier(false); // Cierra la +edición al seleccionar
    },
    onSort: handleSort,
    isFilterOpen,
    setIsFilterOpen,
    // ...resto de los handlers del filtro
  };

  return (
    <ParcelSection
      isEditing={isEditingCourier}
      options={options}
      selectedOption={selectedOption}
      sortConfig={sortConfig}
      handlers={courierHandlers}
    />
  );
};
```

### Posibles Mejoras a Futuro

- **Manejo del Estado "No Seleccionado":** En la vista de resumen, si `selectedOption` es `undefined`, el componente no renderiza nada. Se podría añadir un estado visual que indique "Por favor, seleccione una paquetería".
- **Transiciones Suaves:** Añadir animaciones al cambiar entre el modo de visualización y el de edición podría mejorar la experiencia del usuario.

# Componente: `PackagesSection`

## Descripción General

El componente `PackagesSection` es responsable de renderizar una lista de todos los paquetes asociados a un envío. Es un componente altamente dinámico que itera sobre un array de `packages` y muestra una sección individual para cada uno.

Cada sección de paquete puede existir en uno de dos estados:

1.  **Modo de Visualización:** Muestra un resumen de las dimensiones y tipo de paquete. Incluye un área desplegable para ver los productos contenidos dentro de ese paquete.
2.  **Modo de Edición:** Reemplaza la vista de resumen con el formulario de edición `PackageForm`, permitiendo al usuario modificar todos los detalles del paquete y sus productos.

El estado de edición se controla a nivel de paquete individual a través de la prop `editingPackageId`, lo que permite que solo un paquete esté en modo de edición a la vez.

Ruta: src\components\FinalizeShippingModal\PackagesSection.tsx

## Responsabilidades Clave

- **Renderizar una Lista de Paquetes:** Mapea el array `packages` para crear una sección visual para cada objeto de paquete.
- **Gestionar el Modo de Edición por Paquete:** Utiliza `editingPackageId` para determinar qué paquete específico debe renderizarse en modo de edición (`PackageForm`) mientras los demás permanecen en modo de visualización.
- **Gestionar Estado Interno de UI:** Mantiene un estado local (`expandedPackages`) para controlar qué listas de productos están expandidas o colapsadas en el modo de visualización. Este estado es puramente visual y no afecta los datos del envío.
- **Delegar la Renderización del Formulario:** Cuando un paquete está en modo de edición, delega la renderización completa del formulario al componente hijo `PackageForm`.
- **Delegar Todas las Acciones:** No contiene lógica de negocio. Todas las interacciones del usuario (editar, guardar, cancelar, actualizar campos, añadir/eliminar productos, etc.) son delegadas al componente padre a través del objeto `handlers`.

---

## Props

El componente `PackagesSection` recibe las siguientes props:

| Prop               | Tipo                   | Requerido | Valor por Defecto | Descripción                                                                                              |
| :----------------- | :--------------------- | :-------- | :---------------- | :------------------------------------------------------------------------------------------------------- |
| `packages`         | `Package[]`            | **Sí**    | N/A               | Un array de objetos `Package` que contiene toda la información de los paquetes a renderizar.             |
| `editingPackageId` | `string \| null`       | **Sí**    | N/A               | El `id` del paquete que se está editando actualmente. Si es `null`, todos los paquetes están en modo de visualización. |
| `packageErrors`    | `PackageFormErrors[]`  | **Sí**    | N/A               | Un array que contiene los objetos de error de validación para cada paquete.                              |
| `handlers`         | `object`               | **Sí**    | N/A               | Un objeto que agrupa todas las funciones callback para manejar las interacciones del usuario. (Ver detalle) |

### Detalle del Objeto `handlers`:

Este objeto contiene todas las funciones necesarias para manipular los datos de los paquetes y productos:

- **Acciones de Edición:**
    - `onEdit: (pkg: Package) => void`: Inicia el modo de edición para un paquete específico.
    - `onCancel: () => void`: Cancela el modo de edición, volviendo a la vista de resumen.
    - `onSave: () => void`: Guarda los cambios realizados en el formulario.
- **Acciones a Nivel de Paquete:**
    - `onUpdatePackage: (packageId, field, value) => void`: Actualiza un campo específico del paquete.
    - `onDeletePackage: (packageId) => void`: Elimina un paquete completo.
    - `onClearPackage: (packageId) => void`: Resetea los campos de un paquete a sus valores por defecto.
- **Acciones a Nivel de Producto:**
    - `onAddProduct: (packageId) => void`: Añade un nuevo producto vacío al paquete.
    - `onDeleteProduct: (packageId, productId) => void`: Elimina un producto de un paquete.
    - `onUpdateProduct: (packageId, productId, field, value) => void`: Actualiza un campo específico de un producto.
    - `onDuplicateProduct: (packageId, productId) => void`: Duplica un producto dentro de un paquete.
    - `onClearProduct: (packageId, productId) => void`: Resetea los campos de un producto a sus valores por defecto.

---

## Lógica Interna y Estado

A diferencia de otros componentes puramente presentacionales, `PackagesSection` gestiona un pequeño estado interno:

-   **`expandedPackages: Record<string, boolean>`:** Un objeto que funciona como un mapa para rastrear el estado de expansión de la lista de productos de cada paquete en modo de visualización. La clave es el `id` del paquete y el valor es `true` (expandido) o `false` (colapsado). Este estado es manejado por la función local `togglePackageProducts`.

## Dependencias

- **`PackageForm` (Componente):** Es una dependencia crucial, ya que se utiliza para renderizar la vista de edición completa de un paquete. `PackagesSection` actúa como su contenedor contextual, añadiendo los botones de "Guardar" y "Cancelar".

---

## Uso

Este componente se integra en un componente padre que gestiona el estado de todos los paquetes y el ID del paquete en edición, típicamente a través de un custom hook como `useStepTwo` o `useFinalizeShipping`.

```jsx
// En el componente padre (ej. FinalizeShippingModal.tsx)

import { PackagesSection } from './PackagesSection';

const ParentComponent = () => {
  const [editingPackageId, setEditingPackageId] = useState<string | null>(null);

  // 'packages' y los handlers vendrían de un hook como useStepTwo
  const { packages, packageErrors, ...stepTwoHandlers } = useStepTwo();

  const packageHandlers = {
    ...stepTwoHandlers,
    onEdit: (pkg) => setEditingPackageId(pkg.id),
    onCancel: () => setEditingPackageId(null),
    onSave: () => {
      // Lógica de validación y guardado
      const isValid = stepTwoHandlers.validateStep();
      if (isValid) {
        setEditingPackageId(null);
      }
    },
  };

  return (
    <PackagesSection
      packages={packages}
      editingPackageId={editingPackageId}
      packageErrors={packageErrors}
      handlers={packageHandlers}
    />
  );
};
```


# Componente: `AddressSection`

## Descripción General

El componente `AddressSection` es un componente de presentación dual que gestiona la visualización y edición de las direcciones de remitente y destinatario dentro del modal de envío.

Su comportamiento principal está controlado por la prop `isEditing`, que le permite alternar entre dos modos:

1.  **Modo de Visualización (por defecto):** Muestra un resumen claro y conciso de las direcciones del remitente y destinatario, junto con un botón para activar el modo de edición.
2.  **Modo de Edición:** Renderiza el componente de formulario `StepOne` y proporciona los botones de acción "Guardar Cambios" y "Cancelar" para gestionar el estado de edición.

Este componente encapsula toda la UI relacionada con las direcciones, delegando la gestión del estado y la lógica de los eventos a su componente padre a través de un objeto de `handlers`.

Ruta: src\components\FinalizeShippingModal\AddressSection.tsx

## Responsabilidades Clave

- **Renderizado Condicional:** Su principal responsabilidad es renderizar una de dos vistas diferentes basándose en el valor booleano de la prop `isEditing`.
- **Mostrar Resumen de Direcciones:** En modo de visualización, presenta la información clave del `remitterData` y `addresseeData` de forma legible.
- **Activar el Modo de Edición:** Provee un botón "Editar" que, al ser presionado, invoca el callback `handlers.onEdit`.
- **Renderizar el Formulario de Edición:** En modo de edición, delega la renderización de los campos del formulario al componente hijo `StepOne`, pasándole los datos y errores necesarios.
- **Manejar las Acciones del Formulario:** Muestra los botones "Guardar Cambios" y "Cancelar", que invocan las funciones `handlers.onSave` y `handlers.onCancel` respectivamente.

---

## Props

El componente `AddressSection` recibe un objeto de props con la siguiente estructura:

| Prop              | Tipo                               | Requerido | Valor por Defecto | Descripción                                                                                                |
| :---------------- | :--------------------------------- | :-------- | :---------------- | :--------------------------------------------------------------------------------------------------------- |
| `isEditing`       | `boolean`                          | **Sí**    | N/A               | Controla si el componente se muestra en modo de edición (`true`) o de visualización (`false`).             |
| `remitterData`    | `AddressFormData`                  | **Sí**    | N/A               | Objeto con los datos del formulario de la dirección del remitente.                                         |
| `addresseeData`   | `AddressFormData`                  | **Sí**    | N/A               | Objeto con los datos del formulario de la dirección del destinatario.                                      |
| `remitterErrors`  | `AddressFormErrors`                | **Sí**    | N/A               | Objeto con los errores de validación para el formulario del remitente.                                     |
| `addresseeErrors` | `AddressFormErrors`                | **Sí**    | N/A               | Objeto con los errores de validación para el formulario del destinatario.                                  |
| `handlers`        | `object`                           | **Sí**    | N/A               | Un objeto que agrupa todas las funciones callback para manejar las interacciones del usuario. (Ver detalle abajo) |

### Detalle del Objeto `handlers`:

-   `onEdit: () => void`: Función para cambiar `isEditing` a `true`.
-   `onCancel: () => void`: Función para cancelar la edición y cambiar `isEditing` a `false`.
-   `onSave: () => void`: Función para guardar los cambios y cambiar `isEditing` a `false`.
-   `onInputChange: (formType, event) => void`: Función para manejar los cambios en los inputs del formulario. Se pasa directamente a `StepOne`.
-   `onClearForm: (formType) => void`: Función para limpiar los campos de un formulario. Se pasa directamente a `StepOne`.

---

## Dependencias

- **`StepOne` (Componente):** En modo de edición, `AddressSection` depende completamente del componente `StepOne` para renderizar los campos del formulario. `AddressSection` actúa como un contenedor para `StepOne`, añadiéndole los botones de acción contextuales.

---

## Uso

Este componente se utiliza dentro de un componente padre (como `FinalizeShippingModal`) que gestiona el estado de edición y provee la lógica a través del objeto `handlers`.

```jsx
// En el componente padre (ej. FinalizeShippingModal.tsx)

import { AddressSection } from './AddressSection';

const ParentComponent = () => {
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  
  // Datos y errores provenientes de un hook (ej. useStepOne)
  const { remitterData, addresseeData, remitterErrors, addresseeErrors, handleInputChange, validateFormStepOne, clearForm } = useStepOne();

  const addressHandlers = {
    onEdit: () => setIsEditingAddress(true),
    onCancel: () => setIsEditingAddress(false),
    onSave: () => {
      // Lógica de validación y guardado
      const isValid = validateFormStepOne();
      if (isValid) {
        setIsEditingAddress(false);
      }
    },
    onInputChange: handleInputChange,
    onClearForm: clearForm,
  };

  return (
    <AddressSection
      isEditing={isEditingAddress}
      remitterData={remitterData}
      addresseeData={addresseeData}
      remitterErrors={remitterErrors}
      addresseeErrors={addresseeErrors}
      handlers={addressHandlers}
    />
  );
};
```

### Posibles Mejoras a Futuro

- **Dinamizar Resumen:** La vista de resumen contiene texto estático (ej: `"Casa | 88776 - Villas de Imaq"`) que podría ser reemplazado por datos dinámicos provenientes de `remitterData` o `addresseeData` para una representación más precisa.
- **Animaciones/Transiciones:** Se podrían agregar transiciones suaves al cambiar entre el modo de visualización y el de edición para mejorar la experiencia de usuario.


# Componente: `FinalizeShippingHeader`

## Descripción General

El componente `FinalizeShippingHeader` es un componente de presentación puro, cuya única responsabilidad es renderizar el encabezado del modal de edición de envíos (`FinalizeShippingModal`).

Muestra el título del modal, detalles estáticos de la orden (como el número de orden y la fecha), y proporciona las acciones principales: "Guardar" y "Cerrar". También gestiona el estado visual del botón "Guardar" para indicar si una operación está en curso (estado de carga).

Al ser un componente de presentación, no contiene lógica de negocio. Recibe todas las funciones y datos que necesita a través de sus props.

Ruta: src\components\FinalizeShippingModal\FinalizeShippingHeader.tsx

## Responsabilidades Clave

- **Renderizar la Información del Encabezado:** Muestra un título (`"Finaliza tu envío"`) y detalles de la orden como el icono de la plataforma (Shopify), número, fecha y estado. **Nota:** Actualmente, esta información es estática y está "hardcodeada" en el componente.
- **Mostrar Acciones del Usuario:** Provee un botón para guardar los cambios y otro para cerrar el modal.
- **Manejar el Estado de Carga:** El botón "Guardar" se deshabilita y muestra un indicador `CircularProgress` cuando la prop `loading` es `true`, proporcionando feedback visual inmediato al usuario durante una operación asíncrona.
- **Delegar Eventos:** No implementa la lógica de guardado o cierre. En su lugar, invoca las funciones `onSave` y `onClose` que recibe como props cuando los botones correspondientes son presionados.

---

## Props

Este componente recibe un objeto de props con la siguiente estructura:

| Prop     | Tipo       | Requerido | Valor por Defecto | Descripción                                                                                               |
| :------- | :--------- | :-------- | :---------------- | :-------------------------------------------------------------------------------------------------------- |
| `onSave` | `() => void` | **Sí**    | N/A               | Una función callback que se ejecuta cuando el usuario hace clic en el botón "Guardar".                    |
| `onClose`| `() => void` | **Sí**    | N/A               | Una función callback que se ejecuta cuando el usuario hace clic en el botón de cerrar (`<CloseIcon />`). |
| `loading`| `boolean`  | No        | `false`           | Un booleano que indica si una operación de guardado está en curso. Si es `true`, el botón se deshabilita y muestra un spinner. |

---

## Estructura y Flujo de Datos

- **Entrada (Input):** Recibe las funciones `onSave` y `onClose`, y el estado `loading` de su componente padre (`FinalizeShippingModal`).
- **Lógica Interna:** Utiliza una renderización condicional para cambiar el contenido y el estado `disabled` del botón "Guardar" basándose en la prop `loading`.
- **Salida (Output):** No retorna ningún dato. Su salida son los eventos de clic que invocan las funciones `onSave` y `onClose` pasadas por el padre.

---

## Uso

Este componente está diseñado para ser utilizado dentro de un componente contenedor, como `FinalizeShippingModal`, que le proveerá la lógica necesaria a través de las props.

```jsx
// En el componente padre (ej. FinalizeShippingModal.tsx)

import { FinalizeShippingHeader } from './FinalizeShippingHeader';

const ParentComponent = () => {
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveChanges = () => {
    setIsSaving(true);
    // ...lógica para guardar los datos...
    // al finalizar, setIsSaving(false);
  };

  const handleCloseModal = () => {
    // ...lógica para cerrar el modal...
  };

  return (
    <FinalizeShippingHeader
      onSave={handleSaveChanges}
      onClose={handleCloseModal}
      loading={isSaving}
    />
  );
};
```

### Posibles Mejoras a Futuro

- **Dinamizar los Datos de la Orden:** Actualmente, el número de orden, la fecha y el estado están fijos. Estos podrían ser pasados como props para que el encabezado muestre la información de la orden que se está editando realmente.
- **Internacionalización (i18n):** Los textos como "Finaliza tu envío" o "Pendiente" podrían extraerse para soportar múltiples idiomas.

# Componente: `FinalizeShippingModal`

## Descripción General

El componente `FinalizeShippingModal` es un modal de tipo "Drawer" (panel lateral) de Material-UI, diseñado para **editar y finalizar los detalles de un envío existente**.

Actúa como un contenedor principal que orquesta varias sub-secciones del formulario de envío (Direcciones, Paquetes, Paquetería y Pago), presentando una interfaz unificada para que el usuario pueda modificar una orden previamente seleccionada.

Este componente sigue un patrón de diseño **"Contenedor Presentacional"**, donde su única responsabilidad es renderizar la UI, mientras que toda la lógica de estado, manejo de eventos y comunicación con la API es delegada a hooks personalizados, principalmente a `useFinalizeShipping`.

## Responsabilidades Clave

- **Renderizar la Estructura del Modal:** Dibuja el `Drawer` de Material-UI y organiza el layout principal con un encabezado y un cuerpo.
- **Orquestar los Componentes Hijos:** Renderiza y provee los datos y manejadores necesarios a los componentes de sección: `AddressSection`, `PackagesSection`, `ParcelSection`, y `PaymentDetails`.
- **Obtener Datos del Contexto:** Utiliza el hook `useShippingQuoteDrawer` para saber cuándo debe mostrarse (`isDrawerOpenEditOrder`) y qué orden editar (`order`).
- **Delegar la Lógica de Negocio:** Toda la lógica compleja se extrae al custom hook `useFinalizeShipping`. El componente simplemente consume los valores y funciones que este hook le provee.
- **Mostrar Feedback al Usuario:** Renderiza mensajes de éxito (`Alert`) o error (`ErrorMessage`) basados en el resultado de la operación de guardado.

---

## Dependencias

Este componente tiene dos dependencias externas cruciales que definen su comportamiento:

1.  **`useShippingQuoteDrawer` (Contexto):**
    -   **Propósito:** Provee el estado global que controla el modal.
    -   **Valores Clave Utilizados:**
        -   `isDrawerOpenEditOrder`: `(boolean)` - Determina si el modal está visible.
        -   `closeDrawerEditOrde`: `(function)` - Función para cerrar el modal.
        -   `order`: `(object)` - El objeto de la orden que contiene todos los datos a editar.

2.  **`useFinalizeShipping` (Custom Hook):**
    -   **Propósito:** Es el **"cerebro"** del componente. Centraliza toda la lógica de estado de los formularios, validaciones, manejadores de eventos (handlers) y la comunicación con la API para la edición del envío.
    -   **Argumentos que Recibe:**
        -   Un objeto con `{ order, isOpen, closeDrawerEditOrde }` para poder reaccionar a los cambios y resetear su estado interno.

---

## Estructura y Flujo de Datos

El componente sigue un flujo de datos unidireccional y claro:

1.  **Contexto (`useShippingQuoteDrawer`):** El contexto informa al componente que debe abrirse y le entrega la `order` a editar.
2.  **Hook Principal (`useFinalizeShipping`):**
    -   Recibe la `order` y el estado `isOpen`.
    -   Utiliza `useEffect` para poblar los estados internos de los formularios (`useStepOne`, `useStepTwo`, etc.) con los datos de la `order`.
    -   Prepara todos los datos, estados de UI (`isEditing...`), errores y manejadores de eventos.
    -   Retorna un único objeto con todo lo que la UI necesita para renderizarse y funcionar.
3.  **Componente (`FinalizeShippingModal`):**
    -   Desestructura el objeto retornado por `useFinalizeShipping`.
    -   Pasa las props correspondientes a cada componente hijo.
4.  **Componentes Hijos:**
    -   **`FinalizeShippingHeader`:** Recibe `onSave`, `onClose` y `loading` para manejar el guardado y el estado de carga.
    -   **`AddressSection`:** Recibe `isEditingAddress`, los datos de las direcciones, los errores y el objeto `addressHandlers`.
    -   **`PackagesSection`:** Recibe los paquetes, el ID del paquete en edición, los errores y `packageHandlers`.
    -   **`ParcelSection`:** Recibe las opciones de paquetería, la opción seleccionada y `courierHandlers`.
    -   **`PaymentDetails`:** Recibe los detalles del costo, el seguro y el estado de carga (`loading`).

---

## Uso

Este componente no recibe props directamente. Su estado y comportamiento son controlados por el contexto `ShippingQuoteDrawerProvider`. Se debe renderizar en un layout principal de la aplicación que esté envuelto por dicho proveedor.

```jsx
// En un layout principal o página (ej. App.tsx)

import { FinalizeShippingModal } from './components/FinalizeShippingModal';
import { ShippingQuoteDrawerProvider } from './context';

const App = () => {
  return (
    <ShippingQuoteDrawerProvider>
      {/* ... Otro contenido de la aplicación ... */}

      {/* El modal se renderiza aquí y espera a que el contexto le indique abrirse */}
      <FinalizeShippingModal />
    </ShippingQuoteDrawerProvider>
  );
};
```

## 🧩 Componente: `ReportProblemForm`

### 📄 Descripción General

El componente `ReportProblemForm` es un **componente presentacional o "tonto"**, diseñado específicamente para **renderizar la interfaz del formulario**, capturar la entrada del usuario y gestionar su validación interna.

Su principal responsabilidad es la **presentación y la validación de campos**, delegando la lógica de envío y el manejo del estado de carga a su componente padre. Utiliza el hook `useFormReportProblem` para manejar su estado interno de manera limpia y aislada.

No realiza llamadas a la API directamente, sino que **emite los datos validados** a su componente padre a través de la prop `onFormSubmit`.

### 🧱 Estructura y Elementos Clave

El componente `ReportProblemForm` se compone de los siguientes elementos de UI:

#### 🏷️ **Campo de Tema (`select`)**
- Un menú desplegable para que el usuario seleccione el motivo del reporte.
- Muestra un error de validación si no se selecciona una opción.

#### 📝 **Campo de Descripción (`textarea`)**
- Un área de texto de múltiples líneas para que el usuario detalle la situación.
- Valida que el campo no esté vacío y que cumpla con una longitud mínima.

#### ❗ **Mensajes de Validación**
- Textos de error que aparecen dinámicamente debajo de cada campo si las reglas de validación no se cumplen.

#### 🚀 **Botón de Envío (`button`)**
- El botón que dispara la validación y el envío del formulario.
- Cambia su contenido para mostrar un indicador de carga (`CircularProgress`) cuando la prop `loading` es `true`, proporcionando feedback visual al usuario.

### 🧪 Ejemplo de Uso

A continuación se muestra cómo un componente padre (como `ReportProblemPage`) utilizaría `ReportProblemForm`:

```tsx
// En el componente padre (ej: ReportProblemPage.tsx)

const { isLoading, execute } = useSendReportProblem();

const handleFormSubmit = (formData) => {
  // Lógica para enviar los datos a la API
  execute(formData);
};

return (
  <ReportProblemForm 
    // Se pasa la función que se ejecutará con los datos validados
    onFormSubmit={handleFormSubmit} 
    // Se pasa el estado de carga para actualizar la UI del botón
    loading={isLoading} 
  />
);
```

### ⚙️ Gestión de Estado y Props

La lógica del formulario se divide entre el **hook interno `useFormReportProblem`** y las **props** que recibe del componente padre.

---

#### 🧠 Hook Interno: `useFormReportProblem`

Este hook es el **cerebro interno del formulario**. Encapsula toda la lógica relacionada con el estado de los campos y su validación, manteniendo el componente JSX limpio.

##### 📦 Valores que provee

| Propiedad | Tipo | Descripción |
| :--- | :--- | :--- |
| `values` | `FormValuesReport` | Objeto que contiene los valores actuales de los campos del formulario. |
| `errors` | `ValidationErrors` | Objeto que contiene los mensajes de error de validación para cada campo. |

##### 🛠️ Funciones que provee

| Función | Firma | Descripción |
| :--- | :--- | :--- |
| `handleChange` | `(e: ChangeEvent) => void` | Manejador para actualizar el estado de los campos a medida que el usuario escribe. |
| `handleSubmit` | `(e: FormEvent) => void` | Manejador que se ejecuta al enviar el formulario. Realiza la validación y, si es exitosa, llama a `onSubmit`. |

---

#### 🔌 Props del Componente

Estas son las propiedades que definen la API pública del componente y permiten su comunicación con el exterior.

| Prop | Tipo | Descripción |
| :--- | :--- | :--- |
| `onFormSubmit` | `(data: FormValuesReport) => void` | **(Requerida)** Función de callback que se ejecuta cuando el formulario se envía y pasa la validación. Recibe los datos del formulario como argumento. |
| `loading` | `boolean` | **(Opcional)** Un booleano que indica si una operación externa (como una llamada a la API) está en curso. Se usa para mostrar el estado de carga en el botón de envío. Valor por defecto: `false`. |


# Componente: `CustomTooltip`

ruta: src\components\Quote\Form\QuoteForm.tsx

El `CustomTooltip` es un componente de UI reutilizable y sencillo que envuelve a otro elemento (`children`) para mostrar información adicional (`content`) cuando el usuario pasa el cursor sobre él.

Es un componente de "envoltura" (wrapper) puramente presentacional, cuya visibilidad se controla mediante eventos del mouse.

## Props

| Prop        | Tipo             | Requerido              | Descripción                                                                                                                   |
| ----------- | ---------------- | ---------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `children`  | `ReactNode`      | Sí                     | El elemento JSX que activará el tooltip al pasar el cursor sobre él (por ejemplo, un botón, un ícono, un texto).             |
| `content`   | `ReactNode`      | Sí                     | El contenido que se mostrará dentro del tooltip. Puede ser un string simple, un número o un bloque de JSX más complejo.     |
| `placement` | `TooltipPlacement` | No (default: `'top'`)  | La posición del tooltip en relación con el `children`.                                                                        |
| `className` | `string`         | No (default: `''`)     | Una clase CSS adicional para aplicar al `div` contenedor principal del tooltip, permitiendo estilos personalizados desde fuera. |

### Tipo `TooltipPlacement`

Este tipo define las posiciones válidas para el tooltip:

```typescript
export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';
```

## Uso

El componente `CustomTooltip` se utiliza envolviendo el elemento que se desea que tenga un tooltip.

**Ejemplo 1: Tooltip simple con texto**

```tsx
import { CustomTooltip } from './CustomTooltip';
import SaveIcon from '@mui/icons-material/Save';

const SaveButton = () => {
  return (
    <CustomTooltip content="Guardar documento">
      <button aria-label="Guardar">
        <SaveIcon />
      </button>
    </CustomTooltip>
  );
};
``` 

**Ejemplo 2: Tooltip con contenido complejo y posicionamiento a la derecha**

```tsx
import { CustomTooltip } from './CustomTooltip';
import InfoIcon from '@mui/icons-material/Info';

const InfoField = () => {
  const richContent = (
    <div>
      <strong>Campo Obligatorio</strong>
      <p>Por favor, ingrese su nombre de usuario.</p>
    </div>
  );

  return (
    <label>
      Nombre de Usuario:
      <CustomTooltip content={richContent} placement="right">
        <InfoIcon style={{ marginLeft: '8px', verticalAlign: 'middle', cursor: 'help' }} />
      </CustomTooltip>
    </label>
  );
};
```

## Lógica Interna y Comportamiento Clave

### 1. Gestión de Visibilidad (Estado Local)

-   El componente utiliza un estado interno `isVisible` (un booleano gestionado con `useState`) para controlar si el contenido del tooltip se renderiza en el DOM.
-   Este estado se activa (`true`) con el evento `onMouseEnter` y se desactiva (`false`) con `onMouseLeave`, que están aplicados al `div` contenedor.

### 2. Manejo de Posicionamiento (Styling Dinámico)

-   La prop `placement` no contiene lógica de posicionamiento en JavaScript. En su lugar, se utiliza para construir dinámicamente una clase CSS (ej. `custom-tooltip--top`, `custom-tooltip--right`).
-   Toda la lógica de posicionamiento (usando `position: absolute`, `top`, `left`, `transform`, etc.) y el estilo de la "flecha" del tooltip deben ser manejados en el archivo SCSS (`CustomTooltip.module.scss`) correspondiendo a estas clases. Esto mantiene la lógica de presentación separada de la lógica del componente.

### 3. Patrón de Wrapper

-   El componente funciona envolviendo el `children` en un `<div>` contenedor. Este contenedor es el que realmente escucha los eventos del mouse.
-   Es importante tener en cuenta esta envoltura, ya que puede afectar a selectores CSS o al comportamiento de Flexbox/Grid del layout padre si no se espera. El uso de `display: inline-block` o similar en la clase `tooltip-container` puede ayudar a mitigar esto.

## Dependencias

-   **`react`** (`useState`, `ReactNode`, `FC`): Biblioteca principal y tipos de React.
-   **`CustomTooltip.module.scss`**: Un módulo de SCSS que debe contener las clases `.custom-tooltip`, `.tooltip-container` y las variantes de posicionamiento (ej. `.custom-tooltip--top`) para que el componente funcione visualmente.


--------------------------------------------------------------------------------------------------------------------


# Componente: `FilterTooltip`

Ruta: src/components/Quote/Tooltips/FilterTooltip.tsx

El `FilterTooltip` es un componente de UI que renderiza un pequeño panel flotante (tooltip/pop-up) que permite al usuario realizar una selección múltiple de una lista de opciones a través de checkboxes. Incluye una funcionalidad de búsqueda integrada para filtrar las opciones en tiempo real.

Es un **componente controlado**, lo que significa que el estado de las opciones seleccionadas es gestionado por un componente padre. También es responsable de notificar a su padre cuándo debe cerrarse.

## Props

| Prop                | Tipo                          | Requerido | Descripción                                                                                                                                                              |
| ------------------- | ----------------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `onClose`           | `() => void`                  | Sí        | Función callback que se invoca cuando el tooltip debe cerrarse (por ejemplo, cuando el usuario hace clic fuera del componente).                                            |
| `couriers`          | `string[]`                    | Sí        | Un array con la lista completa de todas las opciones (nombres de paqueterías) disponibles para mostrar.                                                                  |
| `selectedCouriers`  | `string[]`                    | Sí        | Un array que contiene las opciones actualmente seleccionadas. El componente utiliza este array para determinar qué checkboxes deben estar marcados.                      |
| `onSelectionChange` | `(selected: string[]) => void`| Sí        | Función callback que se invoca **cada vez** que el usuario marca o desmarca un checkbox. Recibe el nuevo array completo de opciones seleccionadas para actualizar el estado padre. |

## Uso

El `FilterTooltip` debe ser renderizado y controlado por un componente padre. El padre es responsable de gestionar tanto la visibilidad del tooltip como el estado de la selección.

```tsx
import React, { useState } from 'react';
import { FilterTooltip } from './FilterTooltip';

const CourierFilterComponent = () => {
  const allCouriers = ['DHL', 'FedEx', 'Estafeta', 'Redpack', 'UPS'];
  
  // 1. Estado para controlar la visibilidad del tooltip
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  
  // 2. Estado para almacenar la selección, gestionado por el padre
  const [selected, setSelected] = useState<string[]>(['DHL']);

  const handleSelection = (newSelection: string[]) => {
    setSelected(newSelection);
  };

  return (
    <div>
      <button onClick={() => setIsTooltipOpen(prev => !prev)}>
        Filtrar Paquetería ({selected.length})
      </button>

      {/* 3. Renderizar el tooltip condicionalmente */}
      {isTooltipOpen && (
        <FilterTooltip
          couriers={allCouriers}
          selectedCouriers={selected}
          onSelectionChange={handleSelection}
          onClose={() => setIsTooltipOpen(false)}
        />
      )}
    </div>
  );
};
```

## Lógica Interna y Comportamiento Clave

### 1. Patrón de Componente Controlado

El flujo de datos para la selección es estrictamente unidireccional:
1.  El componente padre pasa `selectedCouriers` como prop.
2.  El `FilterTooltip` utiliza esta prop para marcar los checkboxes correspondientes.
3.  Cuando el usuario hace clic en un checkbox, la función `handleCheckboxChange` calcula el nuevo array de selección.
4.  Esta función invoca `onSelectionChange(newSelection)`, notificando al padre del cambio.
5.  El padre actualiza su propio estado, lo que provoca un nuevo renderizado del `FilterTooltip` con las props actualizadas.

### 2. Búsqueda y Filtrado en Cliente

-   El componente mantiene un estado local `searchTerm` para el valor del campo de búsqueda. Esto es un detalle de implementación interno y no necesita ser controlado desde fuera.
-   La lista de `couriers` se filtra en tiempo real basándose en el `searchTerm`. La búsqueda es *case-insensitive*.
-   Si la búsqueda no arroja resultados, se muestra un mensaje informativo al usuario.

### 3. Cierre Automático ("Click Outside")

-   Para una buena experiencia de usuario, el tooltip se cierra automáticamente si el usuario hace clic en cualquier lugar fuera de él.
-   Esta funcionalidad se logra a través del hook personalizado `useClickOutside`.
-   Se asigna un `useRef` (`tooltipRef`) al elemento contenedor principal del tooltip.
-   El hook `useClickOutside` recibe esta referencia y la función `onClose`. Internamente, el hook añade un event listener que comprueba si los clics ocurren fuera del elemento referenciado y, de ser así, llama a `onClose`.

### 4. Manejo de Selección Eficiente

-   Dentro de `handleCheckboxChange`, se utiliza un `Set` para gestionar la adición o eliminación de elementos de la selección. Esto es más eficiente que usar `filter` e `includes` en arrays grandes, especialmente si la lista de opciones crece.

## Dependencias

-   **`react`** (`useState`, `useRef`): Hooks fundamentales de React.
-   **`useClickOutside` (Hook Personalizado)**: Dependencia clave para la funcionalidad de cierre automático del tooltip.
-   **`@mui/icons-material/Search`**: Para el ícono en la barra de búsqueda.


---------------------------------------------------------------------------------------------------------------------------------------------

# Componente: `QuotePage`

El componente `QuotePage` actúa como la vista principal o la página para la funcionalidad de cotización. Es un **componente contenedor** (container component), lo que significa que su principal responsabilidad no es la apariencia, sino la orquestación de la lógica y el flujo de datos entre sus componentes hijos.

Conecta el formulario de cotización (`QuoteForm`) con la tabla que muestra los resultados (`TablaQuote`), utilizando el custom hook `useQuotes` para manejar todo el estado y la comunicación con la capa de servicios.

Ruta: src\pages\Quote\QuotePage.tsx

## Props

Este componente **no recibe props**. Es una vista de nivel superior que gestiona su propio estado y el de sus hijos a través de un hook.

| Prop | Tipo | Requerido | Descripción |
| :--- | :--- | :--- | :--- |
| N/A  | N/A  | N/A  | Este componente es autónomo y no espera props. |

## Uso

Generalmente, un componente de página como `QuotePage` no se utiliza dentro de otro componente, sino que se asigna a una ruta en el sistema de enrutamiento de la aplicación (como React Router).

```tsx
// Ejemplo en un archivo de rutas (ej. App.tsx o Routes.tsx)
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QuotePage } from './pages/QuotePage/QuotePage';
import { HomePage } from './pages/HomePage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* Aquí se renderiza la página de cotizaciones en la ruta /quote */}
        <Route path="/quote" element={<QuotePage />} />
      </Routes>
    </Router>
  );
};
```

## Flujo de Datos y Lógica Interna

`QuotePage` es el punto de encuentro de toda la lógica de cotizaciones. El flujo de trabajo es el siguiente:

1.  **Inicialización**: Al montarse, el componente invoca el hook `useQuotes()`. Este hook le proporciona:
    *   `quotes`: El estado actual de los datos de las cotizaciones.
    *   `loading`: Un booleano que indica si se está realizando una petición.
    *   `fetchQuotes`: La función para iniciar una nueva búsqueda de cotizaciones.

2.  **Envío del Formulario**:
    *   El usuario interactúa con el componente hijo `QuoteForm` e introduce los datos para una nueva cotización.
    *   Al enviar el formulario, `QuoteForm` invoca su prop `onSubmit` con los datos del formulario (de tipo `QuoteFormData`).
    *   La función `handleQuoteSubmit` de `QuotePage` recibe estos datos.

3.  **Ejecución de la Búsqueda**:
    *   `handleQuoteSubmit` llama a la función `fetchQuotes(data)` que obtuvo del hook `useQuotes`.
    *   Esto activa la lógica dentro del hook para realizar la llamada a la API, actualizando su estado interno de `loading` a `true`.

4.  **Visualización de Resultados**:
    *   El componente `TablaQuote` recibe los estados `loading` y `quotes` como props.
    *   Cuando `loading` es `true`, `TablaQuote` muestra un indicador de carga.
    *   Una vez que la petición en `useQuotes` finaliza, el hook actualiza su estado `quotes` con los nuevos datos y `loading` a `false`.
    *   Como el estado del hook cambia, `QuotePage` se vuelve a renderizar, pasando los nuevos valores de `quotes` y `loading` a `TablaQuote`.
    *   `TablaQuote` ahora muestra la nueva lista de cotizaciones.

En resumen, `QuotePage` actúa como un **mediador** que conecta la acción del usuario en `QuoteForm` con la actualización de datos visualizada en `TablaQuote`.

## Dependencias

-   **`react`**: Biblioteca principal.
-   **`useQuotes` (Hook)**: Es la dependencia más crítica. Contiene toda la lógica de estado, peticiones a la API y manejo de errores para las cotizaciones.
-   **`QuoteForm` (Componente)**: Componente hijo que renderiza el formulario de entrada de datos y notifica al padre cuando se envía.
-   **`TablaQuote` (Componente)**: Componente hijo que se encarga de mostrar los datos de las cotizaciones y el estado de carga.
-   **`QuoteFormData` (Tipo)**: La interfaz de TypeScript que define el contrato de datos entre `QuoteForm` y la lógica de negocio.

------------------------------------------------------------------------------------------------------------------------------------------


# Documentación del Componente `ShippingQuoteDrawer`

## Índice
1. [Descripción General](#descripción-general)
2. [Responsabilidades Clave](#responsabilidades-clave)
3. [Estructura y Dependencias](#estructura-y-dependencias)
    - [Componentes Hijos](#componentes-hijos)
    - [Custom Hooks](#custom-hooks)
    - [Contextos](#contextos)
    - [Librerías Externas](#librerías-externas)
4. [Flujo de Funcionamiento](#flujo-de-funcionamiento)
    - [Gestión de Pasos (Wizard)](#gestión-de-pasos-wizard)
    - [Persistencia de Estado](#persistencia-de-estado)
    - [Validación de Datos](#validación-de-datos)
    - [Creación de la Cotización y Flujo de Pago](#creación-de-la-cotización-y-flujo-de-pago)
    - [Guardado de Borrador](#guardado-de-borrador)
5. [Ejemplo de Uso](#ejemplo-de-uso)

---

### Descripción General

El componente `ShippingQuoteDrawer` es un "drawer" (panel lateral deslizable) de Material-UI que encapsula un flujo de cotización de envíos multi-paso (wizard). Su propósito es guiar al usuario a través de la recopilación de datos necesarios para generar una orden de envío, desde las direcciones de origen y destino, pasando por los detalles de los paquetes, hasta la selección de una paquetería y el pago final.

Este componente actúa como un **orquestador central**, gestionando el estado global del flujo, la navegación entre pasos y la comunicación entre los diferentes hooks y componentes que conforman la experiencia.

### Responsabilidades Clave

- **Gestión del Estado del Drawer:** Controla si el panel está abierto o cerrado a través del `useShippingQuoteDrawer` context.
- **Navegación Multi-paso:** Gestiona el paso actual (`currentStep`) en el que se encuentra el usuario, permitiendo avanzar y retroceder.
- **Orquestación de Datos:** Integra la lógica de múltiples hooks (`useStepOne`, `useStepTwo`, `useStepThree`) para recopilar, validar y combinar los datos de cada paso.
- **Persistencia de Sesión:** Utiliza `localStorage` o `sessionStorage` para guardar el progreso del usuario (paso actual y datos de los formularios), permitiéndole continuar donde lo dejó si recarga la página.
- **Lanzamiento del Flujo de Pago:** Al finalizar la cotización, prepara los datos necesarios para el pago (`paymentPayload`) y abre el `PaymentModal` para que el usuario complete la transacción.
- **Manejo de Acciones Principales:** Proporciona funciones para cerrar el drawer, guardar la cotización como borrador y manejar el cierre completo del flujo post-pago.

### Estructura y Dependencias

#### Componentes Hijos

- **`<StepOne>`**: Formulario para introducir los datos del remitente y destinatario.
- **`<StepTwo>`**: Formulario para añadir uno o más paquetes, especificando sus dimensiones y peso.
- **`<StepThree>`**: Muestra las opciones de paquetería y precios obtenidos, permitiendo al usuario seleccionar una.
- **`<PaymentModal>`**: Modal que se abre para gestionar el proceso de pago con tarjeta a través de Stripe.

#### Custom Hooks

- **`useStepOne()`**: Encapsula toda la lógica del primer paso: estado de los formularios de dirección, validaciones, y manejo de cambios.
- **`useStepTwo()`**: Gestiona la lógica del segundo paso: añadir, editar o eliminar paquetes de la lista.
- **`useStepThree()`**: Maneja la lógica del tercer paso: realiza la petición a la API para obtener cotizaciones, gestiona la selección del usuario y calcula el total.
- **`useShippingQuoteCreation()`**: Contiene la lógica para enviar la cotización finalizada al backend para crear la orden de envío.

#### Contextos

- **`useAppContext()`**: Provee acceso a datos globales de la aplicación, como la información del usuario logueado (`user`).
- **`useShippingQuoteDrawer()`**: Controla el estado de visibilidad (abierto/cerrado) del drawer desde cualquier parte de la aplicación.

#### Librerías Externas

- **`@mui/material`**: Utilizado para renderizar el componente `Drawer` y `Box`.
- **`react-router-dom`**: (Implícitamente) El componente puede ser parte de un flujo que utiliza enrutamiento, pero no lo controla directamente.

### Flujo de Funcionamiento

#### Gestión de Pasos (Wizard)

El estado `currentStep` es el corazón del wizard.
- La función `changeStep(nextStep)` se encarga de la transición entre pasos. Utiliza un estado `animationClass` para aplicar una animación de "fade-out" antes de cambiar el contenido, creando una transición suave.
- `handleNextStep()` contiene la lógica principal. Utiliza un `switch` sobre `currentStep` para ejecutar la validación correspondiente a cada paso antes de permitir avanzar.
- `handlePreviousStep()` permite retroceder al paso anterior.

#### Persistencia de Estado

El componente utiliza `useEffect` junto con funciones de `storage.utils` para mantener el estado a través de recargas de página:
- `CURRENT_STEP_STORAGE_KEY`: Guarda el número del paso actual.
- `DRAWER_OPEN_STORAGE_KEY`: Guarda si el drawer estaba abierto o cerrado.
- `stepOneData`, `stepTwoData`: Guarda los datos de los formularios de cada paso a medida que se completan.
- Al montar el componente, lee estos valores del storage para restaurar el estado.

#### Validación de Datos

Antes de avanzar de un paso a otro, `handleNextStep` invoca las funciones de validación de los hooks correspondientes:
- **Paso 1:** Llama a `validateFormStepOne` del hook `useStepOne`.
- **Paso 2:** Llama a `validateStep` del hook `useStepTwo`.
- **Paso 3:** Llama a `validateStep` del hook `useStepThree`.
Si la validación falla, el avance se detiene y se muestran los errores correspondientes en la UI.

#### Creación de la Cotización y Flujo de Pago

1.  **En el Paso 3,** una vez que el usuario ha seleccionado una paquetería y la validación es exitosa, la función `handleNextStep` llama a `createQuote`.
2.  `createQuote` (del hook `useShippingQuoteCreation`) envía todos los datos recopilados (direcciones, paquetes, paquetería seleccionada) al backend.
3.  Si la creación de la orden en el backend es exitosa (`success === true`), el componente procede a:
    - Construir el objeto `paymentPayload` con los datos requeridos por la API de pagos (ID de la orden, monto total, moneda, email del cliente).
    - Actualizar el estado `paymentPayload` y `finalQuoteAmount`.
    - Abrir el `PaymentModal` estableciendo `setIsPaymentModalOpen(true)`.
4.  El `PaymentModal` recibe el `paymentPayload` y se lo pasa al `StripePaymentForm` para procesar el pago.
5.  Se pasa la función `handlePaymentCompletion` al modal. Esta función se ejecuta cuando el pago finaliza (con éxito o error) y el usuario decide salir del flujo, asegurando que tanto el modal como el drawer se cierren.

#### Guardado de Borrador

La función `handleSave` permite al usuario guardar su progreso sin completar la orden.
- Recopila los datos de los pasos que se hayan completado.
- Crea un payload con `status: 'pending'`.
- Llama a la función `createQuote` para enviar este borrador al backend.

### Ejemplo de Uso

Este componente está diseñado para ser colocado en un layout principal de la aplicación, de modo que pueda ser controlado globalmente por el `ShippingQuoteDrawerProvider`.

```jsx
// En App.js o un layout principal

import { ShippingQuoteDrawerProvider } from './context/ShippingQuoteDrawerContext';
import { ShippingQuoteDrawer } from './components/ShippingQuote/ShippingQuoteDrawer';

function AppLayout() {
  return (
    <ShippingQuoteDrawerProvider>
      {/* El resto de la aplicación */}
      <div id="page-content">
        {/* Un botón en alguna parte de la UI puede abrir el drawer */}
        <MyButtonToOpenDrawer />
      </div>
      
      {/* El Drawer se renderiza aquí, pero está oculto hasta que se active su contexto */}
      <ShippingQuoteDrawer />
    </ShippingQuoteDrawerProvider>
  );
}

// Un componente que abre el drawer
const MyButtonToOpenDrawer = () => {
  const { openDrawer } = useShippingQuoteDrawer();

  return <button onClick={openDrawer}>Crear Nuevo Envío</button>;
}
```
De esta forma, el drawer es un componente desacoplado cuya visibilidad se gestiona a través de un contexto, permitiendo que cualquier parte de la aplicación pueda invocarlo.
------------------------------------------------------------------------------------------------------------------------------------------


# 📮 StepOne Component

Componente que representa el **primer paso** del flujo de cotización de envío. Este paso recopila los datos del **remitente** y del **destinatario** mediante formularios reutilizables.

Ruta: src\components\ShippingQuote\Steps\One\StepOne.tsx

##  Código del componente

```tsx
import { AddressForm } from './Form/AddressForm';
import PlaceIcon from '@mui/icons-material/Place';
import React from 'react';
import { HouseIcon } from '../../../icons';
import { AddressFormData, AddressFormErrors } from '../../../../types';

interface StepOneProps {
    remitterData: AddressFormData;
    addresseeData: AddressFormData;
    remitterErrors: AddressFormErrors;
    addresseeErrors: AddressFormErrors;
    handleInputChange: (formType: 'remitter' | 'addressee', 
                        event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | { target: { name: string; value: string | boolean } }) => void;
    handleClearForm: (formType: 'remitter' | 'addressee') => void;
}

export const StepOne: React.FC<StepOneProps> = ({
    remitterData,
    addresseeData,
    remitterErrors,
    addresseeErrors,
    handleInputChange,
    handleClearForm 
}) => (
    <div>
        
        <div className='mb-3'>
            
            <AddressForm 
                formType="remitter"
                title="Remitente"
                icon={<HouseIcon />}
                formData={remitterData}
                errors={remitterErrors}
                handleInputChange={(e) => {handleInputChange('remitter', e)}}
                handlePhoneChange={(phone) => handleInputChange('remitter', { target: { name: 'phone', value: phone } })}
                handleToggleChange={(e) => handleInputChange('remitter', { target: { name: 'showAliasField', value: e.target.checked }})}
                 handleClearForm={() => handleClearForm('remitter')}
            />
        </div>
        <div>
            
            <AddressForm 
                formType="addressee"
                title="Destinatario"
                icon={<PlaceIcon />}
                formData={addresseeData}
                errors={addresseeErrors}
                handleInputChange={(e) => handleInputChange('addressee', e)}
                handlePhoneChange={(phone) => handleInputChange('addressee', { target: { name: 'phone', value: phone } })}
                handleToggleChange={(e) => handleInputChange('addressee', { target: { name: 'showAliasField', value: e.target.checked }})}
                handleClearForm={() => handleClearForm('addressee')}
            />
        </div>
    </div>
);
```

---

## 🧩 Propósito

Renderiza dos formularios (`AddressForm`) para capturar la información de:

- **Remitente** (`remitter`)
- **Destinatario** (`addressee`)

Cada formulario incluye campos como nombre, dirección, teléfono, alias, etc., y permite validación y limpieza de datos.

---

## 🧠 Props

```ts
interface StepOneProps {
  remitterData: AddressFormData;
  addresseeData: AddressFormData;
  remitterErrors: AddressFormErrors;
  addresseeErrors: AddressFormErrors;
  handleInputChange: (
    formType: 'remitter' | 'addressee',
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | { target: { name: string; value: string | boolean } }
  ) => void;
  handleClearForm: (formType: 'remitter' | 'addressee') => void;
}
```

## ✨ Descripción de Props

| Prop               | Tipo                  | Descripción                                                                 |
|--------------------|-----------------------|------------------------------------------------------------------------------|
| `remitterData`     | `AddressFormData`     | Datos actuales del formulario del remitente                                 |
| `addresseeData`    | `AddressFormData`     | Datos actuales del formulario del destinatario                              |
| `remitterErrors`   | `AddressFormErrors`   | Errores de validación del formulario del remitente                          |
| `addresseeErrors`  | `AddressFormErrors`   | Errores de validación del formulario del destinatario                       |
| `handleInputChange`| `function`            | Función que gestiona cambios en los campos de ambos formularios. Recibe el tipo de formulario y el evento |
| `handleClearForm`  | `function`            | Función que limpia los datos del formulario especificado. Recibe `'remitter'` o `'addressee'` como argumento |


## 🧰 Funcionalidades clave

### 🔄 Manejo de cambios

Permite actualizar los datos del formulario según el tipo (`remitter` o `addressee`).

#### 📌 Ejemplos de código

```tsx
handleInputChange('remitter', e)
handleInputChange('addressee', e)
```

## 📞 Manejo de teléfono

Para campos personalizados como el número de teléfono, se puede adaptar la función `handleInputChange` para recibir valores directamente.

### 📌 Ejemplo de código

```tsx
handlePhoneChange={(phone) =>
  handleInputChange('remitter', {
    target: { name: 'phone', value: phone }
  })
}
```
------------------------------------------------------------------------------------------------------------------------------------------

# Componente `AddressForm`

El componente `AddressForm` es un formulario **reutilizable y controlado**, diseñado para capturar y gestionar direcciones.  
Es altamente configurable y puede ser utilizado tanto para direcciones de **remitente** (`remitter`) como de **destinatario** (`addressee`).

Su diseño se basa en el patrón de **componente controlado**, lo que significa que todo el estado del formulario (valores y errores de validación) es gestionado por un componente padre.  
Esto le otorga gran flexibilidad para integrarse en flujos complejos como procesos de compra, creación de envíos o gestión de perfiles de usuario.

Ruta: src\components\ShippingQuote\Steps\One\Form\AddressForm.tsx
---

## 2. ✨ Características Principales

- **Reutilizable:** Configurable como formulario de remitente o destinatario mediante la prop `formType`.
- **Controlado:** El estado se gestiona vía props `formData` y `errors`, y se actualiza mediante handlers como `handleInputChange`.
- **Integración con Direcciones Guardadas:** Usa el hook `useSavedAddresses` para autocompletar el formulario con direcciones previamente guardadas.
- **Manejo de Errores Visual:** Muestra mensajes y estilos de error cuando se proporciona el objeto `errors`.
- **Campos Condicionales:**
  - Campo **RFC** solo si `formType` es `'remitter'`.
  - Campo **Alias** visible si el usuario activa el interruptor correspondiente.
- **Estructura Modular:** Utiliza componentes como `CardLayoutForm` y `CustomPhoneInputUi` para mantener consistencia visual.
- **Acciones Rápidas:** Incluye botón para limpiar el formulario, controlado por el componente padre.

---

## 3. 📦 Props (Propiedades)

El componente recibe las siguientes props:

| Prop                | Tipo                                      | Requerido | Descripción                                                                 |
|---------------------|-------------------------------------------|-----------|------------------------------------------------------------------------------|
| `formType`          | `'remitter'` \| `'addressee'`             | Sí        | Define el tipo de formulario. Muestra campo "RFC" si es `'remitter'`.       |
| `title`             | `string`                                  | Sí        | Título que se muestra en la cabecera del `CardLayoutForm`.                  |
| `icon`              | `React.ReactNode`                         | Sí        | Ícono que acompaña al título.                                               |
| `formData`          | `AddressFormData`                         | Sí        | Objeto con los valores actuales de los campos del formulario.               |
| `errors`            | `AddressFormErrors`                       | Sí        | Objeto con los errores de validación por campo.                             |
| `handleInputChange` | `(e: React.ChangeEvent<...>) => void`     | Sí        | Maneja cambios en inputs y selects.                                         |
| `handlePhoneChange` | `(phone: string) => void`                 | Sí        | Maneja cambios en el campo de teléfono (`CustomPhoneInputUi`).              |
| `handleToggleChange`| `(e: React.ChangeEvent<HTMLInputElement>) => void` | Sí | Maneja el estado del interruptor "Guardar en lista de direcciones".         |
| `handleClearForm`   | `() => void`                              | Sí        | Limpia el formulario al hacer clic en el botón correspondiente.             |

---

## 4. 🧱 Estructura y Dependencias

### 🧩 Componentes UI

- `CardLayoutForm`: Layout tipo tarjeta con título, ícono y acciones.
- `CustomPhoneInputUi`: Input especializado para números de teléfono.
- `MenuIcon`: Ícono usado en el botón de limpieza.

### 🧠 Hooks

- `useSavedAddresses`: Hook personalizado para obtener direcciones guardadas desde una API.  
  Gestiona estados de carga (`isLoadingAddresses`) y error (`error`).

### 🧾 Tipos (TypeScript)

- `AddressFormData`: Estructura de datos del formulario.
- `AddressFormErrors`: Estructura de errores por campo.

### 🎨 Estilos

- `AddressForm.module.scss`: Módulos SCSS para estilos encapsulados y sin colisiones.

---

## 5. 🔄 Flujo de Funcionamiento

### 🛠️ Montaje y Carga de Datos

- Al renderizarse, el componente invoca `useSavedAddresses`.
- Mientras se cargan las direcciones, el select muestra `"Cargando..."`.

### 📝 Rellenado de Datos

- `formData` y `errors` se reciben del componente padre.
- Cada input usa `formData` como `value`.
- Si hay errores, se aplica la clase `styles['input--error']` y se muestra el mensaje correspondiente.

### 👤 Interacción del Usuario

- Al escribir o seleccionar, se dispara `onChange`, que llama a `handleInputChange`.
- Para teléfono, se usa `handlePhoneChange`.
- Para el interruptor de guardar dirección, se usa `handleToggleChange`.

### 📍 Selección de Dirección Guardada

- Al seleccionar una dirección, se invoca `handleInputChange`.
- El padre usa el `value` para buscar detalles y actualizar `formData`.

### 🧹 Limpieza del Formulario

- Al hacer clic en el ícono del menú, se llama a `handleClearForm`.
- El componente padre resetea `formData` a sus valores iniciales.

------------------------------------------------------------------------------------------------------------------------------------------

# 📘 Componente `StepThree`


`StepThree` representa la **tercera etapa** del flujo.

Su función principal es permitir al usuario:

- Seleccionar una **opción de envío**
- Aplicar **filtros** y **ordenamientos**
- Visualizar un **resumen** de la opción seleccionada
- Completar los **detalles de pago**
- Enviar la **solicitud final**

Este componente cierra el flujo de interacción del formulario, combinando selección logística con confirmación de datos y procesamiento de pago.

Ruta: src\components\ShippingQuote\Steps\Three\StepThree.tsx

## 🧾 Props (`StepThreeProps`)

| Propiedad               | Tipo                                                   | Descripción                                                                 |
|-------------------------|--------------------------------------------------------|-----------------------------------------------------------------------------|
| `filteredAndSortedOptions` | `ShippingOption[]`                                 | Lista de opciones de envío filtradas y ordenadas.                          |
| `selectedOption`        | `ShippingOption \| undefined`                         | Opción de envío actualmente seleccionada.                                  |
| `selectedOptionId`      | `string \| null`                                      | ID de la opción seleccionada.                                              |
| `handleSelectOption`    | `(id: string) => void`                                | Función para seleccionar una opción de envío.                              |
| `handleSort`            | `(key: "estimatedDelivery" \| "price") => void`       | Ordena las opciones por entrega estimada o precio.                         |
| `sortConfig`            | `SortConfig`                                          | Configuración actual de ordenamiento.                                      |
| `isAccordionOpen`       | `boolean`                                             | Estado de apertura del acordeón.                                           |
| `setIsAccordionOpen`    | `Dispatch<SetStateAction<boolean>>`                  | Función para cambiar el estado del acordeón.                               |
| `isFilterOpen`          | `boolean`                                             | Estado de apertura del filtro de paqueterías.                              |
| `setIsFilterOpen`       | `Dispatch<SetStateAction<boolean>>`                  | Función para cambiar el estado del filtro.                                 |
| `availableCarriers`     | `string[]`                                            | Lista de paqueterías disponibles.                                          |
| `selectedCarriers`      | `string[]`                                            | Paqueterías seleccionadas para filtrar.                                    |
| `setSelectedCarriers`   | `Dispatch<SetStateAction<string[]>>`                 | Función para actualizar el filtro de paqueterías.                          |
| `isPawSafeActive`       | `boolean`                                             | Estado del seguro PawSafe.                                                 |
| `handlePawSafeToggle`   | `(isActive: boolean) => void`                         | Activa o desactiva el seguro PawSafe.                                      |
| `declaredValue`         | `string`                                              | Valor declarado del paquete.                                               |
| `setDeclaredValue`      | `Dispatch<SetStateAction<string>>`                   | Actualiza el valor declarado.                                              |
| `errors`                | `StepThreeErrors`                                     | Errores de validación en esta etapa.                                       |
| `handleSend`            | `() => void`                                          | Función para enviar los datos al siguiente paso.                           |


## 🧠 Estructura del Componente

### 1. 📦 Resumen del Acordeón (`AccordionSummary`)

Si hay una opción seleccionada, se muestra un resumen con los siguientes elementos:

- **Logo de la paquetería**
- **Nombre del servicio**
- **Fecha de recolección y entrega estimada**
- **Precio** en formato **MXN**

Este resumen permite al usuario visualizar rápidamente los detalles clave de la opción de envío seleccionada.

---

### 2. 📂 Acordeón de Paquetería

Contiene la lista completa de opciones de envío disponibles, filtradas y ordenadas según la configuración actual (`sortConfig`, `selectedCarriers`, etc.).  
Cada opción se presenta como un ítem interactivo que el usuario puede seleccionar para ver más detalles o confirmar su elección.

Este acordeón puede expandirse o contraerse según el estado de `isAccordionOpen`, ofreciendo una experiencia de navegación clara y flexible.

### 🧪 Ejemplo de uso del acordeón

```tsx
<Accordion title="Paquetería" ... >
  {errors.selectedOption && !isAccordionOpen && (
    <p className={styles['error-message']}>{errors.selectedOption}</p>
  )}
  <ShippingOptions ... />
</Accordion>
```

### 3. 💳 Detalles de Pago

```tsx
<PaymentDetails
  shippingCost={selectedOption?.price || 0}
  error={errors.declaredValue}
  isPawSafeActive={isPawSafeActive}
  onPawSafeToggle={handlePawSafeToggle}
  declaredValue={declaredValue}
  onDeclaredValueChange={setDeclaredValue}
  handleSend={handleSend}
/>
```

El componente `PaymentDetails` se encarga de gestionar los aspectos finales del proceso de envío.

### 🧩 Propiedades clave

- **`shippingCost`**: Muestra el costo de envío basado en la opción seleccionada.
- **`isPawSafeActive`**: Permite activar o desactivar el seguro **PawSafe**.
- **`declaredValue`**: Captura el valor declarado del paquete.
- **`error`**: Muestra errores si el valor declarado es inválido.
- **`handleSend`**: Botón para continuar al siguiente paso del flujo.

### 🎯 Función

Esta sección cierra el proceso de selección y validación, asegurando que el usuario tenga control sobre los detalles **logísticos** y **financieros** antes de enviar la solicitud.

## 🔌 Integración en el flujo

El componente `StepThree` se renderiza en el **paso 3** del flujo principal del formulario.

### 🧪 Ejemplo de integración

```tsx
case 3:
  return <StepThree handleSend={handleNextStep} {...stepThreeLogic} />;
```

------------------------------------------------------------------------------------------------------------------------------------------

# 📦 Componente `ShippingOptions`

## 🎯 Propósito

Renderiza una tabla interactiva con opciones de envío, permitiendo seleccionar, ordenar y filtrar paqueterías.

Ruta: src\components\ShippingQuote\Steps\Three\Table\ShippingOptions.tsx
---

## 🧾 Props (`ShippingOptionsProps`)

| Propiedad           | Tipo                                                   | Descripción                                                                 |
|---------------------|--------------------------------------------------------|-----------------------------------------------------------------------------|
| `options`           | `ShippingOption[]`                                     | Lista de opciones de envío disponibles.                                    |
| `selectedOptionId`  | `string`                                               | ID de la opción actualmente seleccionada.                                  |
| `onSelectOption`    | `(id: string) => void`                                 | Función para seleccionar una opción.                                       |
| `onSort`            | `(key: "estimatedDelivery" \| "price") => void`       | Función para ordenar las opciones.                                         |
| `sortConfig`        | `{ key: string; direction: "asc" \| "desc" }`         | Configuración actual de ordenamiento.                                      |
| `isFilterOpen`      | `boolean`                                              | Estado de visibilidad del filtro de paqueterías.                           |
| `onFilterToggle`    | `() => void`                                           | Alterna la visibilidad del filtro.                                         |
| `onFilterClose`     | `() => void`                                           | Cierra el filtro.                                                          |
| `availableCarriers` | `string[]`                                             | Lista de paqueterías disponibles para filtrar.                             |
| `selectedCarriers`  | `string[]`                                             | Paqueterías seleccionadas en el filtro.                                    |
| `onFilterChange`    | `(selected: string[]) => void`                         | Actualiza la selección de paqueterías en el filtro.                        |

---

## 🧠 Estructura

```tsx
<div className={styles['shipping-options']}>
  <p className={styles['shipping-options__subtitle']}>
    Elige la paquetería que mejor acompañe tu envío
  </p>

  <table className={styles['shipping-options__table']}>
    <thead className='shipping-options__table__thead'>
      <tr>
        <th className={styles['shipping-options__table__filter-header']}>
          <div className={styles['shipping-options__table__header-filter-wrapper']}>
            Paqueterías
            <span onClick={onFilterToggle} className={styles['shipping-options__table__filter-icon']}>
              <FunnelIcon />
            </span>
            {isFilterOpen && (
              <FilterTooltip
                onClose={onFilterClose}
                couriers={availableCarriers}
                selectedCouriers={selectedCarriers}
                onSelectionChange={onFilterChange}
              />
            )}
          </div>
        </th>
        <th>Servicio</th>
        <th>
          Recolección
          <CustomTooltipUi
            title="Déjalo en sucursal o pide que pase el cartero en Recolecciones"
            placement="top"
          >
            <span className={styles['shipping-options__table__info-icon']}><AlertIcon /></span>
          </CustomTooltipUi>
        </th>
        <th
          className={styles['shipping-options__table__sortable-header']}
          onClick={() => onSort('estimatedDelivery')}
        >
          Entrega estimada <span>{getSortIndicator('estimatedDelivery')}</span>
        </th>
        <th
          className={styles['shipping-options__table__sortable-header']}
          onClick={() => onSort('price')}
        >
          Precio estimado <span>{getSortIndicator('price')}</span>
        </th>
      </tr>
    </thead>

    <tbody>
      {options.map((option) => (
        <tr
          key={option.id}
          className={`${styles['shipping-option']} ${selectedOptionId === option.id ? styles['shipping-option--selected'] : ''}`}
          onClick={() => onSelectOption(option.id)}
        >
          <td><img src={option.logo} alt={`${option.carrier} logo`} /></td>
          <td>{option.service}</td>
          <td>{option.collection}</td>
          <td>{option.estimatedDelivery}</td>
          <td>${option.price.toFixed(2)} MXN</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
```
## 🔧 Función auxiliar

```tsx
const getSortIndicator = (key: 'estimatedDelivery' | 'price') => {
  if (sortConfig.key !== key) {
    return <SwapIcon />;
  }
  if (sortConfig.direction === 'asc') {
    return <ArrowUpIcon />;
  }
  return <ArrowDownIcon />;
};
```
------------------------------------------------------------------------------------------------------------------------------------------

# 💳 Componente `PaymentDetails`

## 🧾 Props (`PaymentDetailsProps`)

| Propiedad             | Tipo                                 | Descripción                                           |
|-----------------------|--------------------------------------|-------------------------------------------------------|
| `shippingCost`        | `number`                             | Costo base del envío.                                 |
| `isPawSafeActive`     | `boolean`                            | Estado del seguro PawSafe.                            |
| `onPawSafeToggle`     | `(isActive: boolean) => void`        | Activa o desactiva el seguro PawSafe.                |
| `declaredValue`       | `string`                             | Valor declarado del paquete.                          |
| `onDeclaredValueChange` | `(value: string) => void`          | Actualiza el valor declarado.                         |
| `error`               | `string` *(opcional)*                | Mensaje de error de validación.                       |
| `handleSend`          | `() => void`                         | Función para enviar los datos al siguiente paso.      |


Ruta: src\components\ShippingQuote\Steps\Three\PaymentDetails\PaymentDetails.tsx
---

## 🧠 Estructura

```tsx
<div className={styles['payment-details']}>
  <h3 className={styles['payment-details__title']}>
    <BarcodeIcon /> Detalles de pago
  </h3>

  <div className={styles['pawsafe-toggle']}>
    <div className={styles['pawsafe-toggle__box-checkbox']}>
      <input
        type="checkbox"
        id="pawsafe-checkbox"
        checked={isPawSafeActive}
        onChange={(e) => onPawSafeToggle(e.target.checked)}
        className={styles['pawsafe-toggle__checkbox']}
      />
      <label htmlFor="pawsafe-checkbox" className={styles['pawsafe-toggle__label']}>
        PawSafe
      </label>
    </div>
    <div className={styles['pawsafe-toggle__box-descripcion']}>
      <PetsIcon className={styles['pawsafe-toggle__box-descripcion__icon']} />
      <p className={styles['pawsafe-toggle__description']}>
        Activa PawSafe y te daremos la pata si algo sale mal. Te apoyamos en caso de pérdida, daño o robo durante el envío.
      </p>
    </div>
  </div>

  <div className={styles['summary-wrapper']}>
    {isPawSafeActive && (
      <div className={styles['declared-value']}>
        <label htmlFor="declared-value" className={styles['declared-value__label']}>Valor declarado</label>
        <div className={`${styles['declared-value__input-wrapper']} ${error ? styles['input-wrapper--error'] : ''}`}>
          <span>$</span>
          <input
            type="text"
            id="declared-value"
            value={declaredValue}
            onChange={(e) => onDeclaredValueChange(e.target.value)}
          />
          <span>MXN</span>
        </div>
        {error ? (
          <p className={styles['error-message']}>{error}</p>
        ) : (
          <p className={styles['declared-value__helper']}>Especifica un monto de $100 MXN a $100,000 MXN.</p>
        )}
      </div>
    )}

    <div className={styles['summary']}>
      <div className={styles['summary__item']}>
        <span>Envío</span>
        <span>${shippingCost.toFixed(2)} MXN</span>
      </div>
      {isPawSafeActive && (
        <div className={styles['summary__item']}>
          <span>PawSafe</span>
          <span>${(isPawSafeActive && declaredValue !== "" ? parseFloat(declaredValue) : 0).toFixed(2)} MXN</span>
        </div>
      )}
      <div className={`${styles['summary__item']} ${styles['summary__item--total']}`}>
        <span>Total:</span>
        <span>${(shippingCost + (isPawSafeActive && declaredValue !== "" ? parseFloat(declaredValue) : 0)).toFixed(2)} MXN</span>
      </div>
      <p className={styles['summary__iva']}>(Incluye IVA)</p>
    </div>
  </div>

  <div className={styles['footer']}>
    <p className={styles['footer__terms']}>
      Al generar el envío, confirmo que he leído y acepto los <span>términos y políticas</span>.
    </p>
    <button type='button' onClick={handleSend} className={styles['footer__button']}>
      Enviar
    </button>
  </div>
</div>

```


------------------------------------------------------------------------------------------------------------------------------------------


# 📮 componente StepTwo 

`StepTwo` este componete representa la **segunda etapa** de un formulario dinámico, donde el usuario puede gestionar múltiples **paquetes** y los **productos** que contiene cada uno.

### ✨ Funcionalidades principales

Permite al usuario:

- Agregar paquetes y productos
- Editar información existente
- Duplicar elementos
- Limpiar formularios
- Eliminar paquetes o productos

Este enfoque facilita la gestión flexible de múltiples unidades dentro de un flujo de trabajo complejo.

Ruta: src\components\ShippingQuote\Steps\Two\StepTwo.tsx

## 🧾 Props (`StepTwoProps`)

El componente `StepTwo` recibe las siguientes propiedades:

## 🧾 Props (`StepTwoProps`)

| Propiedad              | Tipo                                                                 | Descripción                                                                 |
|------------------------|----------------------------------------------------------------------|-----------------------------------------------------------------------------|
| `packages`             | `Package[]`                                                          | Lista de paquetes a renderizar. Cada paquete contiene productos.           |
| `errors`               | `PackageFormErrors[]`                                                | Lista de errores asociados a cada paquete. Se emparejan por ID.            |
| `handleAddPackage`     | `() => void`                                                         | Agrega un nuevo paquete vacío.                                             |
| `handleDeletePackage`  | `(packageId: string) => void`                                        | Elimina un paquete por su ID.                                              |
| `handleUpdatePackage`  | `(packageId: string, field: keyof Package, value: any) => void`      | Actualiza un campo específico de un paquete.                               |
| `handleAddProduct`     | `(packageId: string) => void`                                        | Agrega un nuevo producto dentro de un paquete.                             |
| `handleDeleteProduct`  | `(packageId: string, productId: string) => void`                     | Elimina un producto dentro de un paquete.                                  |
| `handleUpdateProduct`  | `(packageId: string, productId: string, field: keyof Product, value: any) => void` | Actualiza un campo específico de un producto.         |
| `handleDuplicatePackage` | `(packageId: string) => void`                                      | Duplica un paquete completo.                                               |
| `handleClearPackage`   | `(packageId: string) => void`                                        | Limpia los datos de un paquete.                                            |
| `handleDuplicateProduct` | `(packageId: string, productId: string) => void`                   | Duplica un producto dentro de un paquete.                                  |
| `handleClearProduct`   | `(packageId: string, productId: string) => void`                     | Limpia los datos de un producto.                                           |


## 🧾 Estructura del Componente
```tsx
<div className={styles['step-two']}>
  {packages.map((pkg, index) => {
    const packageErrors = errors.find(e => e.id === pkg.id);
    return (
      <PackageForm
        key={pkg.id}
        packageData={pkg}
        packageIndex={index}
        errors={packageErrors}
        onDelete={handleDeletePackage}
        onUpdatePackage={handleUpdatePackage}
        onAddProduct={handleAddProduct}
        onDeleteProduct={handleDeleteProduct}
        onUpdateProduct={handleUpdateProduct}
        onDuplicate={handleDuplicatePackage}
        onClear={handleClearPackage}
        onDuplicateProduct={handleDuplicateProduct}
        onClearProduct={handleClearProduct}
      />
    );
  })}
  <div className={styles['step-two__add-package-btn']}>
    <button onClick={handleAddPackage} className={styles['btn']}>
      + Añadir paquete
    </button>
  </div>
</div>
```

## 🧪 ¿Cómo se usa?

Este componente se utiliza dentro de una **lógica condicional**, como parte de un **flujo de pasos** en un formulario dinámico.  
Se renderiza cuando el usuario ha completado la etapa anterior (`StepOne`) y necesita gestionar paquetes y productos en la siguiente fase del proceso.

Ejemplo típico de uso:

```tsx
{currentStep === 2 && (
    return <StepTwo {...stepTwoLogic} />;
)}
```

Donde **stepTwoLogic** proviene del hook personalizado:

```tsx
const stepTwoLogic = useStepTwo();
```

## 🔧 Utilidad: `generateUniqueId`

### 🎯 Propósito

La función `generateUniqueId` genera un **identificador único** en formato de cadena (`string`) que combina:

- Un componente **aleatorio**
- Una **marca de tiempo**

### 🧩 Aplicaciones comunes

Es útil para asignar IDs únicos a objetos como:

- Paquetes
- Productos


------------------------------------------------------------------------------------------------------------------------------------------

# 📮 componente PackageForm 

`PackageForm` es  para **crear o editar** un paquete individual.  
Cada paquete contiene información sobre:

- Sus **dimensiones**
- El **tipo de embalaje**
- Una lista de **productos** que van dentro de él

Ruta: src\components\ShippingQuote\Steps\Two\Form\PackageForm.tsx

### ⚙️ Componente controlado

Este componente **no gestiona su propio estado**.  
En lugar de eso:

- Recibe los datos del paquete a través de la prop `packageData`
- Utiliza funciones de callback como `onUpdatePackage`, `onDelete`, etc., proporcionadas por el componente padre

## 1. 🧾 Propiedades (`PackageFormProps`)

El componente `PackageForm` recibe un objeto de propiedades con la siguiente estructura:

| Propiedad            | Tipo                                                                 | Obligatorio | Descripción                                                                 |
|----------------------|----------------------------------------------------------------------|-------------|-----------------------------------------------------------------------------|
| `packageData`        | `Package`                                                            | Sí          | El objeto que contiene todos los datos del paquete (ID, dimensiones, productos, etc.). |
| `packageIndex`       | `number`                                                             | Sí          | Índice del paquete (ej. 0, 1, 2...). Se usa para mostrar el número de paquete (ej. "Paquete 1"). |
| `onDelete`           | `(id: string) => void`                                               | Sí          | Función para eliminar este paquete. Recibe el ID del paquete.              |
| `onUpdatePackage`    | `(id: string, field: keyof Package, value: any) => void`             | Sí          | Actualiza un campo específico del paquete (ej. `packagingType`, `length`, etc.). |
| `onDuplicate`        | `(id: string) => void`                                               | Sí          | Duplica el paquete completo.                                               |
| `onClear`            | `(id: string) => void`                                               | Sí          | Limpia (resetea) los campos del formulario.                                |
| `onAddProduct`       | `(packageId: string) => void`                                        | Sí          | Añade un nuevo producto a la lista de productos del paquete.               |
| `onDeleteProduct`    | `(packageId: string, productId: string) => void`                     | Sí          | Elimina un producto específico dentro del paquete.                         |
| `onUpdateProduct`    | `(packageId: string, productId: string, field: keyof Product, value: any) => void` | Sí | Actualiza un campo de un producto específico. Se pasa al componente `ProductForm`. |
| `onDuplicateProduct` | `(packageId: string, productId: string) => void`                     | Sí          | Duplica un producto. Se pasa al componente `ProductForm`.                  |
| `onClearProduct`     | `(packageId: string, productId: string) => void`                     | Sí          | Limpia los campos de un producto. Se pasa al componente `ProductForm`.     |
| `errors`             | `PackageFormErrors` *(opcional)*                                     | No          | Objeto con los mensajes de error de validación para los campos del paquete. |


## 2. ⚙️ Estado Interno y Hooks

El componente utiliza varios hooks de React para gestionar su comportamiento interno:

### 🧠 `useState`

- `isProductsVisible`: Booleano que controla si la sección de productos está expandida o contraída.
- `isDropdownVisible`: Booleano que controla la visibilidad del menú desplegable de búsqueda para el **Tipo de producto**.

### 📌 `useRef`

- `searchContainerRef`: Referencia al `div` que contiene el campo de búsqueda de tipo de producto.  
  Se utiliza para detectar si el usuario hace clic fuera de este campo y cerrar el menú desplegable.

### 🔁 `useEffect`

- Añade un **event listener** que escucha los clics en cualquier parte del documento (`mousedown`).
- Si el clic ocurre fuera del contenedor de búsqueda (`searchContainerRef.current.contains(...)`), se oculta el menú desplegable (`setDropdownVisible(false)`).
- Incluye una función de limpieza (`return` dentro del `useEffect`) para evitar **fugas de memoria** al desmontar el componente.

### 🧩 `useProductTypes` (Hook personalizado)

Este hook abstrae la lógica de búsqueda de tipos de producto.

- `filteredTypes`: Lista de tipos de producto que coinciden con la búsqueda del usuario.
- `filterTypes(query)`: Función que ejecuta la búsqueda según el texto ingresado.

Este conjunto de hooks permite que el componente sea interactivo, accesible y modular, mejorando la experiencia del usuario en formularios dinámicos.


## 3. ⚙️ Funcionamiento Detallado

### a. 🧩 Encabezado y Acciones del Paquete

- Muestra el título `"Paquete"` junto con su número (`packageIndex + 1`).
- Contiene tres botones de acción:
  - **Eliminar** (`DeleteOutlineIcon`): llama a `onDelete(packageData.id)`
  - **Duplicar** (`ContentCopyIcon`): llama a `onDuplicate(packageData.id)`
  - **Limpiar** (`MenuIcon`): llama a `onClear(packageData.id)`
- Utiliza el componente `CustomTooltipUi` para mostrar una descripción emergente al pasar el ratón sobre los íconos.

---

### b. 📝 Campos del Formulario del Paquete

- **Tipo de embalaje**: input de texto simple. Su cambio es manejado por `handlePackageChange`.
- **Dimensiones** (`Largo`, `Alto`, `Ancho`, `Peso`): grupo de cuatro inputs de tipo `number`, todos manejados por `handlePackageChange`.  
  Se muestra un único mensaje de error si alguna dimensión falta.

#### 🔍 Tipo de producto (Buscador)

- Campo de búsqueda interactivo.
- Al escribir (`onChange`), se llama a `handleProductTypeChange`, que:
  - Actualiza el valor en el estado del padre (`onUpdatePackage`)
  - Filtra la lista de tipos de productos (`filterTypes(query)`)
  - Muestra el menú desplegable (`setDropdownVisible(true)`)
- El menú desplegable (`search-input__results`) se muestra condicionalmente si `isDropdownVisible` es `true`.
- Al hacer clic en un resultado, se llama a `handleSelectProductType`, que actualiza el valor y cierra el desplegable.

#### 🏷️ Guardar en lista y Alias

- Interruptor (`toggle-switch`) que controla el booleano `saveToList`.
- Si `saveToList` es `true`, se muestra condicionalmente (`{packageData.saveToList && ...}`) un campo de texto para el alias del paquete.

---

### c. 🔄 Manejo de Cambios en los Inputs (`handlePackageChange`)

- Función genérica que maneja los cambios en la mayoría de los inputs.
- Extrae `name`, `value` y `type` del evento.
- Si el input es un `checkbox`, utiliza la propiedad `checked` en lugar de `value`.
- Llama a `onUpdatePackage` con:
  - ID del paquete
  - Nombre del campo (`name`)
  - Nuevo valor

---

### d. ❗ Manejo de Errores

- El componente recibe un objeto `errors` (opcional).
- Las funciones `getInputClassName` y `getDimensionInputClassName` añaden la clase CSS de error (`styles['input--error']`) si existe un error en el campo.
- Los mensajes de error se muestran condicionalmente debajo de cada campo correspondiente.

---

### e. 📦 Sección de Productos

- Sección colapsable. El encabezado (`package__products-header`) tiene un `onClick` que invierte el valor de `isProductsVisible`.
- Si `isProductsVisible` es `true`:
  - Se itera sobre el array `packageData.products` usando `.map()`
  - Por cada `product`, se renderiza el componente hijo `ProductForm`
  - Se le pasan:
    - Datos del producto (`product`)
    - Funciones callback para gestionar actualizaciones, eliminaciones, etc. (`onDeleteProduct`, `onUpdateProduct`, etc.)
    - Errores específicos del producto (si existen)
- Al final de la lista, hay un botón **"+ Añadir producto"** que llama a `onAddProduct(packageData.id)`


------------------------------------------------------------------------------------------------------------------------------------------


# 📮 componente ProductForm 

## 📦 Documentación del Componente `ProductForm`

`ProductForm` es un componente para **mostrar y editar** los datos de un único producto.

A diferencia de `PackageForm`, que gestiona un paquete completo y su lista de productos, este componente se enfoca exclusivamente en los siguientes campos de un solo producto:

- `nombre`
- `SKU`
- `precio`
- `cantidad`

Ruta: src\components\ShippingQuote\Steps\Two\Form\ProductForm.tsx

## 1. 🧾 Propiedades (`ProductFormProps`)

El componente `ProductForm` recibe un objeto de propiedades con la siguiente estructura:

| Propiedad     | Tipo                                                                 | Obligatorio | Descripción                                                                 |
|---------------|----------------------------------------------------------------------|-------------|-----------------------------------------------------------------------------|
| `product`     | `Product`                                                            | Sí          | Objeto que contiene todos los datos del producto (ID, nombre, precio, etc.). |
| `onDelete`    | `(id: string) => void`                                               | Sí          | Función que se llama para eliminar este producto. Recibe el ID del producto. |
| `onUpdate`    | `(id: string, field: keyof Product, value: any) => void`             | Sí          | Función para actualizar un campo específico del producto (ej. `name`, `price`, etc.). |
| `onDuplicate` | `(id: string) => void`                                               | Sí          | Función para duplicar este producto.                                        |
| `onClear`     | `(id: string) => void`                                               | Sí          | Función para limpiar (resetear) los campos del formulario de producto.      |
| `errors`      | `ProductFormErrors` *(opcional)*                                     | No          | Objeto que contiene los mensajes de error de validación para los campos del producto. |


## ⚙️ Funcionamiento Detallado 

### a. 🧩 Encabezado y Acciones del Producto

En la parte superior de cada formulario de producto hay una barra de acciones con tres botones:

- **Eliminar** (`DeleteOutlineIcon`): llama a `onDelete(product.id)`
- **Duplicar** (`ContentCopyIcon`): llama a `onDuplicate(product.id)`
- **Limpiar** (`MenuIcon`): llama a `onClear(product.id)`

Cada botón está envuelto en el componente `CustomTooltipUi`, que muestra una descripción amigable al pasar el cursor sobre el ícono.

---

### b. 📝 Campos del Formulario

El formulario contiene cuatro campos para los datos del producto:

- **Nombre del producto**: input de texto
- **SKU**: input de texto para el código de referencia (Stock Keeping Unit)
- **Precio**: input de tipo `number` con estilo especial (`input-with-addon`) que añade un prefijo `$` y un sufijo `MXN`
- **Cantidad**: input de tipo `number`

Todos los campos son **controlados**, lo que significa que:

- El `value` de cada input está enlazado a la propiedad correspondiente del objeto `product` (ej. `value={product.name}`)
- El evento `onChange` de cada input es gestionado por la función `handleChange`

---

### c. 🔄 Manejo de Cambios (`handleChange`)

Esta función permite que el componente sea controlado:

- Se ejecuta cada vez que el usuario escribe en un input
- Extrae `name` y `value` del evento
- Llama a `onUpdate` (prop recibida) con:
  - `product.id`: para identificar el producto
  - `name`: campo a actualizar
  - `value`: nuevo valor

De esta forma, `ProductForm` **no modifica los datos directamente**, sino que delega la actualización al componente padre.

---

### d. ❗ Manejo de Errores

- Recibe un objeto `errors` (opcional) desde el componente padre
- La función auxiliar `getInputClassName` construye dinámicamente el `className` para los inputs
  - Si existe un error para un campo (`errors?.[fieldName]`), se añade la clase `styles['input--error']`
- Debajo de cada campo, se muestra un `<span>` con el mensaje de error correspondiente si existe  
  (ej. `{errors?.name && <span>{errors.name}</span>}`)


------------------------------------------------------------------------------------------------------------------------------------------

# Componente: `OrdersSearchBar`

El componente `OrdersSearchBar` es para buscar, filtrar y realizar acciones sobre una lista de órdenes. Incluye un campo de búsqueda principal, un botón para abrir un modal de filtros avanzados, y botones de acción para refrescar datos y subir archivos.

Este es un **componente controlado**, lo que significa que el estado de los filtros es gestionado por un componente padre y se le pasa a través de props.

Ruta: src\components\Orders\OrdersSearchBar.tsx

## Vista Previa

(Aquí podrías colocar una imagen del componente si lo deseas)

```
[ Escribe número de orden o destinatario  ] [🔍]  [▽ Filtrar]      [↑ Subir órdenes] [↻ Actualizar]
```

## Props

Este componente recibe las siguientes props:

| Prop             | Tipo                                        | Requerido | Descripción                                                                                                                              |
| ---------------- | ------------------------------------------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `currentFilters` | `FilterValues`                              | Sí        | Un objeto que contiene los valores actuales de todos los filtros aplicados. Debe ser manejado por el componente padre.                 |
| `onFiltersChange`| `(newFilters: FilterValues) => void`        | Sí        | Función callback que se invoca cada vez que un valor de filtro cambia (ej. al escribir en la barra de búsqueda). Recibe el nuevo objeto de filtros. |
| `onApplyFilters` | `(filters: FilterValues) => void`           | Sí        | Función callback que se invoca cuando el usuario aplica los filtros desde el `FilterModal`. Recibe el estado final de los filtros a aplicar. |
| `onClearFilters` | `() => void`                                | Sí        | Función callback que se invoca para limpiar o resetear todos los filtros, generalmente desde el `FilterModal`.                         |
| `onRefresh`      | `() => void`                                | Sí        | Función callback que se invoca al hacer clic en el botón "Actualizar". Ideal para volver a cargar los datos.                             |
| `onSearch`       | `() => void`                                | Sí        | Función callback que se invoca al hacer clic en el botón de búsqueda (lupa) o al presionar la tecla `Enter` en el campo de texto.        |

### Tipo `FilterValues`

Este es un tipo de TypeScript que define la estructura del objeto de filtros.

```typescript
// Ejemplo de la estructura del tipo FilterValues
interface FilterValues {
    searchTerm?: string; 
    startDate: string;
    endDate: string;
    statuses: string[];
    stores: string[];
    integrations: string[];
}
```

## Uso

Para usar este componente, debes manejar el estado de los filtros en un componente padre y pasarle las funciones callback correspondientes.

```tsx
import React, { useState } from 'react';
import { OrdersSearchBar } from './OrdersSearchBar';
import { FilterValues } from '../../types';

const OrdersPage = () => {
  const [filters, setFilters] = useState<FilterValues>({
    searchTerm: '',
    // ...otros valores iniciales de filtros
  });

  const handleFiltersChange = (newFilters: FilterValues) => {
    console.log('Filtros cambiando:', newFilters);
    setFilters(newFilters);
  };

  const handleApplyFilters = (appliedFilters: FilterValues) => {
    console.log('Aplicando filtros:', appliedFilters);
    // Lógica para buscar/filtrar datos con los filtros aplicados
    // fetchOrders(appliedFilters);
  };

  const handleClearFilters = () => {
    console.log('Limpiando filtros');
    const clearedFilters = { searchTerm: '' }; 
    setFilters(clearedFilters);
  };

  const handleSearch = () => {
    console.log('Buscando con término:', filters.searchTerm);
    // Lógica para buscar específicamente con el `searchTerm`
    // fetchOrders(filters);
  };
  
  const handleRefresh = () => {
    console.log('Refrescando datos...');
    // Lógica para volver a cargar los datos con los filtros actuales
    // fetchOrders(filters);
  };

  return (
    <div>
      <h1>Mis Órdenes</h1>
      <OrdersSearchBar
        currentFilters={filters}
        onFiltersChange={handleFiltersChange}
        onApplyFilters={handleApplyFilters}
        onClearFilters={handleClearFilters}
        onSearch={handleSearch}
        onRefresh={handleRefresh}
      />
      {/* ... Aquí iría la lista de órdenes ... */}
    </div>
  );
};
```

## Estado Interno

- **`isFilterOpen (boolean)`**: Controla la visibilidad del componente `FilterModal`. Se activa o desactiva al hacer clic en el botón "Filtrar".

## Comportamiento Adicional

- La búsqueda principal se puede activar de dos maneras: haciendo clic en el botón de la lupa o presionando la tecla **`Enter`** en el campo de búsqueda.
- El botón "Subir órdenes" es actualmente visual. Para añadirle funcionalidad, se debería implementar una función y pasarla como prop (ej. `onUploadOrders`).


------------------------------------------------------------------------------------------------------------------------------------------

# Componente: `OrdersTable`

El componente `OrdersTable` se encarga de renderizar una lista de envíos u órdenes. No es una tabla HTML tradicional (`<table>`), sino una lista de tarjetas que muestran la información detallada de cada envío.

Este componente está diseñado para manejar de forma interna los estados de **carga**, **error** y **lista vacía**, mostrando la interfaz adecuada para cada caso.

Ruta: src\components\Orders\OrdersTable.tsx

## Props

Este componente recibe las siguientes props:

| Prop        | Tipo          | Requerido              | Descripción                                                                                                                |
| ----------- | ------------- | ---------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `shipments` | `Shipment[]`  | Sí                     | Un array de objetos `Shipment`, que contiene toda la información de las órdenes a mostrar.                                 |
| `isLoading` | `boolean`     | No (default: `false`)  | Si es `true`, el componente mostrará un `SkeletonLoader` en lugar de la tabla, indicando que los datos se están cargando.   |
| `error`     | `string | null` | No (default: `null`) | Si se proporciona un string de error, el componente mostrará un `ErrorMessage` en lugar de la tabla.                       |

### Tipo `Shipment`

A continuación se muestra un ejemplo de la estructura de datos que espera el componente para cada objeto en el array `shipments`.

```typescript
// Ejemplo de la estructura del tipo Shipment
interface Shipment {
  id: string | number;
  sender: {
    name: string;
    address: string;
  };
  recipient: {
    name: string;
    address: string;
  };
  package: {
    type: string;
    dimensions: string;
    weight?: string;
  };
  productsCount: number | string;
  carrier: {
    logo?: string;
    name: string;
    service?: string;
  };
  services: {
    logo: string;
    code?: string;
  };
  date: string;
  time: string;
  status: 'Generada' | 'Pendiente';
}
```

## Uso

Para usar este componente, necesitas gestionar el estado de los datos (`shipments`), el estado de carga (`isLoading`) y el de error (`error`) en un componente padre, típicamente mientras realizas una llamada a una API.

```jsx
import React, { useState, useEffect } from 'react';
import { OrdersTable } from './OrdersTable';
import { Shipment } from '../../types';
import { fetchOrdersAPI } from './api'; 

const OrdersListPage = () => {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchOrdersAPI();
        setShipments(data);
      } catch (err) {
        setError('Hubo un problema al cargar las órdenes. Inténtalo de nuevo.');
      } finally {
        setIsLoading(false);
      }
    };

    loadOrders();
  }, []);

  return (
    <div>
      <OrdersTable
        shipments={shipments}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
};
```

## Comportamiento y Renderizado Condicional

El componente gestiona su visualización según las props `isLoading`, `error` y la longitud del array `shipments`. El orden de prioridad es el siguiente:

1.  **Estado de Carga**: Si `isLoading` es `true`, el componente renderizará un `SkeletonLoader`. Esto tiene la máxima prioridad.
2.  **Estado de Error**: Si `isLoading` es `false` pero `error` contiene un string, el componente renderizará `ErrorMessage` con el mensaje de error.
3.  **Estado Vacío**: Si no hay carga ni error, y el array `shipments` está vacío (`length === 0`), se mostrará un mensaje indicando que no se encontraron órdenes.
4.  **Estado Exitoso**: Si ninguna de las condiciones anteriores se cumple, el componente mapeará el array `shipments` y renderizará la lista de órdenes.

## Lógica Interna

-   **`getStatusTagModifier(status)`**: Es una función interna que devuelve una clase CSS específica (`styles['...']`) basada en el valor de `shipment.status`. Esto permite colorear las etiquetas de estado de manera diferente (ej. 'Generada' en verde, 'Pendiente' en amarillo, etc.).
-   **Estilos para "Pendiente"**: El componente aplica una clase CSS especial (`styles['table-list-orders--pending-text']`) a ciertos campos si su valor es la cadena `"Pendiente"`.
-   **Tooltips**: Usa el componente `CustomTooltipUi` para mostrar información adicional al pasar el cursor sobre los botones de acción.


------------------------------------------------------------------------------------------------------------------------------------------

# Componente: `PaginationTable`

El componente `PaginationTable` es un *wrapper* estilizado y simplificado sobre el componente `TablePagination` de Material-UI. Su propósito es proporcionar un control de paginación estandarizado y reutilizable para listas o tablas de datos en la aplicación.

La principal abstracción que ofrece es el manejo de páginas con un **índice basado en 1** (la primera página es `1`), lo cual es más intuitivo para la lógica de la aplicación, mientras que internamente se comunica con el componente de MUI usando el índice basado en 0 que este requiere.

Ruta: src\components\ui\PaginationTable.tsx


## Props

Este componente recibe las siguientes props:

| Prop               | Tipo                                  | Requerido | Descripción                                                                                                                              |
| ------------------ | ------------------------------------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `totalItems`       | `number`                              | Sí        | El número total de elementos en el conjunto de datos completo (sin paginar).                                                             |
| `pageSize`         | `number`                              | Sí        | El número de elementos que se muestran por página. Debe coincidir con uno de los valores en `rowsPerPageOptions` (ej. 5, 10, 25...).      |
| `currentPage`      | `number`                              | Sí        | El número de la página actual que se está mostrando. **Importante: este componente utiliza un índice basado en 1 (la primera página es 1)**. |
| `onPageChange`     | `(newPage: number) => void`           | Sí        | Función callback que se invoca cuando el usuario navega a otra página. Recibe el nuevo número de página (también basado en 1).               |
| `onPageSizeChange` | `(newPageSize: number) => void`       | Sí        | Función callback que se invoca cuando el usuario selecciona un nuevo tamaño de página en el desplegable.                                |

## Uso

Este es un **componente controlado**. Debes gestionar el estado de la paginación (`currentPage` y `pageSize`) en un componente padre y pasar los valores y las funciones de callback como props.

```jsx
import React, { useState } from 'react';
import { PaginationTable } from './PaginationTable';

const MyDataList = () => {
  const totalItemsAvailable = 87;

  const [currentPage, setCurrentPage] = useState(1); // Empezamos en la página 1
  const [pageSize, setPageSize] = useState(10);

  const handlePageChange = (newPage: number) => {
    console.log(`Cambiando a la página: ${newPage}`);
    setCurrentPage(newPage);
    // Aquí normalmente harías una llamada a la API con la nueva página:
    // fetchMyData({ page: newPage, size: pageSize });
  };

  const handlePageSizeChange = (newPageSize: number) => {
    console.log(`Nuevo tamaño de página: ${newPageSize}`);
    setPageSize(newPageSize);
    setCurrentPage(1); // Es buena práctica volver a la primera página al cambiar el tamaño
    // Y volver a llamar a la API:
    // fetchMyData({ page: 1, size: newPageSize });
  };

  return (
    <div>
      {/* ... Tu lista de datos renderizada ... */}

      {/* Componente de paginación */}
      <PaginationTable
        totalItems={totalItemsAvailable}
        pageSize={pageSize}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />
    </div>
  );
};
```

## Lógica Interna y Abstracción Clave

### Manejo de Índice de Página (1-based vs 0-based)

Para simplificar la gestión del estado en los componentes padres, `PaginationTable` expone una interfaz que trabaja con páginas numeradas a partir de 1. Sin embargo, el componente subyacente de Material-UI (`TablePagination`) utiliza un índice basado в 0.

Nuestro componente se encarga de esta conversión automáticamente:

-   **Al recibir la prop `currentPage`**: La convierte a un índice 0 antes de pasarla a `TablePagination`.
    ```jsx
    page={currentPage - 1} 
    ```
-   **Al emitir el evento `onPageChange`**: Recibe el nuevo índice 0 de `TablePagination` y le suma 1 antes de llamar al callback del padre.
    ```javascript
    const handlePageChange = (event, newPage) => { // newPage es 0-based
      onPageChange(newPage + 1); // Se notifica al padre con un valor 1-based
    };
    ```

## Estilo y Personalización

-   El componente utiliza la prop `sx` de Material-UI para aplicar estilos personalizados y asegurar una apariencia coherente con el resto de la aplicación.
-   Los textos (labels) del componente están preconfigurados en español (`"Registros por página:"`, `"de"`).
-   Las opciones para el tamaño de página están fijadas en `[5, 10, 25, 50, 100]`.

## Dependencias

-   **`react`**: Biblioteca principal.
-   **`@mui/material/TablePagination`**: Componente base de Material-UI sobre el cual se construye este wrapper.


------------------------------------------------------------------------------------------------------------------------------------------


# Componente: `FilterModal`

El componente `FilterModal` proporciona un modal para que los usuarios puedan seleccionar y aplicar filtros avanzados a la lista de ordenes. Es un **componente controlado**, lo que significa que no gestiona su propio estado de filtros, sino que lo recibe y lo modifica a través de props.

Incluye selectores de rango de fechas y múltiples dropdowns con checkboxes para selecciones múltiples.

Ruta: src\components\Orders\FilterModal.tsx

## Props

Este componente recibe las siguientes props:

| Prop             | Tipo                                  | Requerido | Descripción                                                                                                                                                             |
| ---------------- | ------------------------------------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `onClose`        | `() => void`                          | Sí        | Función callback que se invoca para cerrar el modal (ej. al hacer clic en el botón de cerrar).                                                                          |
| `onApply`        | `(filters: FilterValues) => void`     | Sí        | Función callback que se invoca cuando el usuario hace clic en el botón "Aplicar". Recibe el objeto final de filtros para ser procesado por el componente padre.          |
| `onClear`        | `() => void`                          | Sí        | Función callback que se invoca cuando el usuario hace clic en el botón "Limpiar filtros".                                                                               |
| `currentFilters` | `FilterValues`                        | Sí        | Un objeto que representa el estado actual de los filtros. El modal utiliza este objeto para poblar sus campos (inputs de fecha, checkboxes, etc.).                     |
| `onChange`       | `(newFilters: FilterValues) => void`  | Sí        | Función callback que se invoca **cada vez que un valor de filtro cambia** dentro del modal. Permite que el estado del padre se mantenga sincronizado en tiempo real.     |

## Uso

El `FilterModal` debe ser controlado por un componente padre. Este padre es responsable de gestionar el estado de visibilidad del modal y el estado de los filtros.

```jsx
import React, { useState } from 'react';
import { FilterModal } from './FilterModal';
import { FilterValues } from '../../types';

const ParentComponent = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // El estado de los filtros vive en el componente padre
  const [filters, setFilters] = useState<FilterValues>({
    startDate: '',
    endDate: '',
    statuses: [],
    stores: [],
    integrations: []
  });

  // Función para aplicar los filtros (ej. llamar a una API)
  const handleApplyFilters = (appliedFilters: FilterValues) => {
    console.log('Filtros a aplicar:', appliedFilters);
    // Lógica para recargar datos con los nuevos filtros...
    // fetchOrders(appliedFilters);
  };

  // Función para limpiar los filtros
  const handleClearFilters = () => {
    console.log('Limpiando filtros...');
    const initialFilters = { /*...estado inicial de filtros...*/ };
    setFilters(initialFilters);
  };
  
  return (
    <div>
      <button onClick={() => setIsModalOpen(true)}>Abrir Filtros</button>

      {isModalOpen && (
        <FilterModal
          currentFilters={filters}
          onChange={setFilters} // Pasa la función `setFilters` directamente
          onApply={handleApplyFilters}
          onClear={handleClearFilters}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};
```

## Lógica Interna y Comportamiento

### Patrón de Componente Controlado

El modal sigue un estricto patrón de componente controlado. El flujo de datos es unidireccional:
1.  El padre pasa `currentFilters` al modal.
2.  El modal muestra los valores de `currentFilters`.
3.  Cuando el usuario modifica un filtro (ej. marca un checkbox), el modal no actualiza su propio estado. En su lugar, construye un nuevo objeto de filtros y llama a la prop `onChange(newFilters)`.
4.  El componente padre recibe los nuevos filtros a través de `onChange` y actualiza su propio estado, lo que provoca un nuevo renderizado del modal con los valores actualizados.

### Manejo de la Opción "Todos"

Para los dropdowns de "Tienda en línea" e "Integración", existe una lógica especial para manejar la opción `"Todos"`:
-   **Seleccionar "Todos"**: Si el usuario marca la casilla "Todos", todas las demás opciones en ese dropdown se seleccionan automáticamente.
-   **Deseleccionar "Todos"**: Si el usuario desmarca la casilla "Todos", todas las opciones se deseleccionan.
-   **Selección Manual Completa**: Si el usuario selecciona manualmente todas las opciones individuales (excepto "Todos"), la opción "Todos" se marca automáticamente.

### Limpieza de Filtros al Aplicar

Cuando el usuario hace clic en "Aplicar", la función `handleApplyClick` realiza una limpieza final antes de llamar a `onApply`:
-   Elimina el valor `"Todos"` de los arrays `stores` e `integrations`. Esto asegura que el objeto de filtros enviado a la API o a la lógica de filtrado no contenga este valor, que es solo un auxiliar de la UI.

### Activación del Calendario (Date Picker)

-   El componente utiliza `useRef` para obtener una referencia a los elementos `<input type="date">`.
-   Al hacer clic en el icono del calendario, se invoca el método `.showPicker()` en el input correspondiente, lo que abre el selector de fechas nativo del navegador para una mejor experiencia de usuario.



------------------------------------------------------------------------------------------------------------------------------------------


# Componente: `CustomCheckboxDropdown`

El `CustomCheckboxDropdown` es un componente de formulario reutilizable que renderiza un campo de selección desplegable con opciones de tipo checkbox. Permite la selección múltiple de ítems de una lista.

Es un **componente controlado**, lo que significa que el estado de las opciones seleccionadas es gestionado por un componente padre.

Ruta: src\components\Orders\CheckboxDropdown\CustomCheckboxDropdown.tsx

## Vista Previa

(Aquí podrías colocar una imagen del componente en estado cerrado y abierto)

```
[ Label                    ]
[ Opción 1, Opción 3     ▼ ]
----------------------------
| [✓] Opción 1             |
| [ ] Opción 2             |
| [✓] Opción 3             |
----------------------------
```

## Props

Este componente recibe las siguientes props:

| Prop              | Tipo                       | Requerido | Descripción                                                                                                                              |
| ----------------- | -------------------------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `label`           | `string`                   | Sí        | El texto que se muestra como etiqueta (label) flotante encima del campo de selección.                                                    |
| `options`         | `string[]`                 | Sí        | Un array de strings que representa todas las opciones disponibles para ser mostradas en la lista desplegable.                          |
| `selectedOptions` | `string[]`                 | Sí        | Un array de strings que contiene las opciones actualmente seleccionadas. El componente utiliza este array para marcar los checkboxes.        |
| `onChange`        | `(selected: string[]) => void` | Sí        | Función callback que se invoca cada vez que el usuario marca o desmarca un checkbox. Recibe el **nuevo** array completo de opciones seleccionadas. |

## Uso

Para usar este componente, debes manejar el estado de la selección en un componente padre y pasar los valores y la función de callback correspondientes.

```jsx
import React, { useState } from 'react';
import { CustomCheckboxDropdown } from './CustomCheckboxDropdown';

const MyFormComponent = () => {
  const availableStatuses = ['Pendiente', 'Generada', 'En Camino', 'Entregada'];
  
  // 1. Estado para almacenar las opciones seleccionadas en el componente padre
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(['Pendiente']);

  // 2. Función manejadora que actualiza el estado
  const handleStatusChange = (newSelection: string[]) => {
    console.log('Nueva selección:', newSelection);
    setSelectedStatuses(newSelection);
  };

  return (
    <form>
      <h2>Filtrar por Estatus</h2>
      <CustomCheckboxDropdown
        label="Estatus"
        options={availableStatuses}
        selectedOptions={selectedStatuses}
        onChange={handleStatusChange}
      />
      {/* ... otros campos del formulario ... */}
      <p>Seleccionado actualmente: {selectedStatuses.join(', ')}</p>
    </form>
  );
};
```

## Lógica Interna y Comportamiento

### Estado de Visibilidad (`isOpen`)

-   El componente utiliza un estado interno `isOpen` (`boolean`) para controlar si la lista de opciones está visible o no.
-   Este estado se alterna al hacer clic en el área principal del control del dropdown.

### Detección de Clics Externos (`useRef` y `useEffect`)

-   Para una mejor experiencia de usuario, el dropdown se cierra automáticamente si el usuario hace clic en cualquier lugar fuera del componente.
-   Esto se logra utilizando un `useRef` (`dropdownRef`) para obtener una referencia al elemento `div` principal del componente.
-   Un `useEffect` añade un event listener (`mousedown`) al `document`. Si el evento de clic ocurre fuera del elemento referenciado, el estado `isOpen` se establece en `false`.
-   El `useEffect` también incluye una función de limpieza para remover el event listener cuando el componente se desmonta, evitando fugas de memoria.

### Manejo de la Selección (`handleCheckboxChange`)

-   Cuando un usuario interactúa con un checkbox, la función `handleCheckboxChange` se activa.
-   Esta función determina si la opción seleccionada ya existe en el array `selectedOptions`.
    -   Si existe, la elimina del array (deselección).
    -   Si no existe, la añade al array (selección).
-   Finalmente, invoca la prop `onChange` pasándole el nuevo array de selecciones, permitiendo que el componente padre actualice su estado.

### Texto de Visualización (`getDisplayText`)

-   Una función auxiliar `getDisplayText` se encarga de generar el string que se muestra en el control del dropdown cuando está cerrado.
-   Concatena los valores de `selectedOptions` separados por una coma y un espacio. Si no hay nada seleccionado, no muestra texto.



# Documentación del Componente `PaymentModal`

## Índice
1. [Descripción General](#descripción-general)
2. [Responsabilidades Clave](#responsabilidades-clave)
3. [Props (Propiedades)](#props-propiedades)
4. [Estructura y Dependencias](#estructura-y-dependencias)
    - [Componentes Hijos](#componentes-hijos)
    - [Librerías Externas](#librerías-externas)
5. [Flujo de Funcionamiento](#flujo-de-funcionamiento)
    - [Renderizado Condicional](#renderizado-condicional)
    - [Selección de Método de Pago](#selección-de-método-de-pago)
    - [Integración con Stripe](#integración-con-stripe)
6. [Ejemplo de Uso](#ejemplo-de-uso)

---

### Descripción General

El componente `PaymentModal` es un modal de UI que presenta al usuario diferentes métodos de pago para completar una transacción. Actúa como un contenedor que puede mostrar información detallada para cada método de pago (Tarjeta, SPEI, PayPal) y, en el caso del pago con tarjeta, delega la lógica del formulario a un componente hijo especializado (`StripePaymentForm`).

Su diseño está pensado para ser flexible, mostrando primero las opciones y luego, si se elige tarjeta, cambiando su vista para mostrar el formulario de pago.

### Responsabilidades Clave

- **Control de Visibilidad:** Se renderiza o no en función de la prop `isOpen`.
- **Gestión de Pestañas (Tabs):** Permite al usuario navegar entre los diferentes métodos de pago disponibles (`card`, `spei`, `paypal`).
- **Presentación de Información:** Muestra detalles relevantes para cada método de pago, como comisiones, montos mínimos e instrucciones.
- **Cálculos de Comisiones:** Utiliza `useMemo` para calcular y mostrar de forma eficiente el desglose de comisiones y el monto final a recibir para los pagos con tarjeta y PayPal.
- **Orquestación del Flujo de Pago con Tarjeta:**
    - Al seleccionar "Tarjeta" y hacer clic en "Continuar", oculta las pestañas y renderiza el componente `StripePaymentForm`.
    - Envuelve `StripePaymentForm` con el proveedor `<Elements>` de Stripe, que es esencial para que los componentes de la tarjeta funcionen.
    - Actúa como intermediario, pasando los datos de pago (`paymentPayload`) y las funciones de control (`onPaymentComplete`) desde su componente padre (`ShippingQuoteDrawer`) hacia `StripePaymentForm`.

### Props (Propiedades)

| Prop               | Tipo                               | Obligatorio | Descripción                                                                                               |
|--------------------|------------------------------------|-------------|-----------------------------------------------------------------------------------------------------------|
| `isOpen`           | `boolean`                          | Sí          | Controla si el modal es visible o no.                                                                     |
| `onClose`          | `() => void`                       | Sí          | Función que se ejecuta para cerrar el modal (ej. al hacer clic en el overlay o en el botón de cerrar). |
| `quoteAmount`      | `number`                           | Sí          | El monto base de la cotización o pago que se va a procesar. Se usa para mostrar en la UI y para cálculos. |
| `paymentPayload`   | `IPayloadCreatePaymentIntent`      | Sí          | Un objeto que contiene todos los datos necesarios para crear el `PaymentIntent` en el backend (ej. `orderUid`, `amount`, `currency`). |
| `onPaymentComplete`| `() => void`                       | Sí          | Función de callback que se ejecuta cuando el flujo de pago ha terminado (éxito o error) y el usuario decide salir, permitiendo al componente padre cerrar el modal y el drawer. |

### Estructura y Dependencias

#### Componentes Hijos

- **`<StripePaymentForm>`**: Un componente especializado que contiene todos los campos de entrada (`CardNumberElement`, etc.) y la lógica para interactuar con la API de Stripe a través del hook `useStripePayment`.

#### Librerías Externas

- **`@stripe/react-stripe-js`**: Utilizado para el componente `<Elements>`, que es el proveedor de contexto indispensable para cualquier formulario de pago de Stripe.
- **`@stripe/stripe-js`**: (Indirectamente) La promesa `stripePromise` se carga usando esta librería.

### Flujo de Funcionamiento

#### Renderizado Condicional

El componente tiene dos vistas principales controladas por el estado `showStripeForm`:

1.  **Vista de Selección de Pago (`showStripeForm` es `false`):**
    - Muestra un encabezado, un subtítulo y las pestañas de los métodos de pago.
    - El contenido debajo de las pestañas cambia dinámicamente según el `activeTab` seleccionado.
    - Para el pago con tarjeta, muestra un botón "Continuar". Al hacer clic, `handleContinueToCardPayment` cambia `showStripeForm` a `true`.

2.  **Vista de Formulario de Pago (`showStripeForm` es `true`):**
    - El modal oculta la vista de selección.
    - En su lugar, renderiza el componente `<StripePaymentForm>`, pasándole todas las props necesarias (`amount`, `paymentPayload`, `onPaymentComplete`, etc.).

#### Selección de Método de Pago

- El estado `activeTab` (`'card'`, `'spei'`, `'paypal'`) controla qué información se muestra.
- Los botones de las pestañas actualizan este estado con `setActiveTab`, lo que provoca que la función `renderContent` devuelva el JSX correspondiente al método de pago seleccionado.
- El `useEffect` principal del componente se asegura de que cada vez que el modal se abre (`isOpen` cambia a `true`), se reinicie a la vista de selección de pago (`setShowStripeForm(false)`).

#### Integración con Stripe

- **Proveedor `<Elements>`:** El `PaymentModal` es responsable de envolver al `StripePaymentForm` con `<Elements stripe={stripePromise}>`. Esto es crucial, ya que `<Elements>` crea el contexto que permite a los componentes de tarjeta de Stripe funcionar y comunicarse entre sí.
- **Paso de Props (Prop Drilling):** Actúa como un puente, recibiendo `paymentPayload` y `onPaymentComplete` de su padre y pasándolos directamente al `StripePaymentForm`, asegurando que el formulario tenga los datos y las funciones de control que necesita para operar correctamente.

### Ejemplo de Uso

El `PaymentModal` está diseñado para ser utilizado por un componente padre que gestiona un flujo más grande, como el `ShippingQuoteDrawer`. El padre es responsable de controlar su estado de apertura y de proporcionarle los datos de la transacción.

```jsx
// Dentro de un componente padre como ShippingQuoteDrawer.tsx

import { useState } from 'react';
import { PaymentModal } from './PaymentModal';
import { IPayloadCreatePaymentIntent } from '../types';

const ParentComponent = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // Este payload se construiría con datos reales de la aplicación
    const paymentData: IPayloadCreatePaymentIntent = {
        orderUid: 'order-12345',
        amount: 1500.50,
        currency: 'MXN',
        customerEmail: 'cliente@example.com'
    };

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    // Esta función se pasaría para limpiar la UI después del pago
    const handleFlowCompletion = () => {
        handleCloseModal();
        // También podría cerrar otros componentes, como un drawer.
        console.log("Flujo de pago completado, cerrando todo.");
    };

    return (
        <div>
            <button onClick={handleOpenModal}>Pagar Cotización</button>

            {/* Renderizado condicional para eficiencia */}
            {isModalOpen && (
                <PaymentModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    quoteAmount={paymentData.amount}
                    paymentPayload={paymentData}
                    onPaymentComplete={handleFlowCompletion}
                />
            )}
        </div>
    );
};
```

# Documentación del Componente `StripePaymentForm` (Versión Mejorada)

## Índice
1. [Descripción General](#descripción-general)
2. [Nuevas Características](#nuevas-características)
3. [Responsabilidades Clave](#responsabilidades-clave)
4. [Props (Propiedades)](#props-propiedades)
5. [Estructura y Dependencias](#estructura-y-dependencias)
    - [Custom Hooks](#custom-hooks)
    - [Librerías Externas](#librerías-externas)
6. [Flujo de Funcionamiento (Máquina de Estados Interna)](#flujo-de-funcionamiento-máquina-de-estados-interna)
    - [Estado de los Campos de Tarjeta](#estado-de-los-campos-de-tarjeta)
    - [Validación del Formulario](#validación-del-formulario)
    - [Estados de Pago](#estados-de-pago)
7. [Ejemplo de Uso](#ejemplo-de-uso)

---

### Descripción General

Esta es una versión mejorada del componente `StripePaymentForm`. Además de sus responsabilidades originales de capturar datos de pago de forma segura, ahora incluye **validación en tiempo real del lado del cliente** para los campos de la tarjeta.

El componente sigue siendo el paso final en el flujo de pago, pero ahora proporciona una experiencia de usuario más robusta al verificar que todos los campos de la tarjeta estén completos y sean válidos *antes* de intentar enviar la solicitud de pago al servidor. Esto reduce las solicitudes fallidas y proporciona retroalimentación inmediata al usuario.

### Nuevas Características

- **Validación de Completitud en Tiempo Real:** El formulario ahora escucha los eventos `onChange` de los campos de Stripe (`CardNumberElement`, `CardExpiryElement`, `CardCvcElement`).
- **Estado de Campos de Tarjeta:** Mantiene un estado (`cardElementsComplete`) que rastrea si cada uno de los campos de la tarjeta está "completo" según las validaciones de Stripe (ej. el número de tarjeta tiene la longitud correcta, el CVC tiene 3-4 dígitos, etc.).
- **Validación Front-end Pre-envío:** La función `handleSubmit` ahora comprueba el estado `cardElementsComplete` y los campos de nombre antes de permitir que se ejecute la llamada al hook `handlePayment`.
- **Mensajes de Error Locales:** Introduce un nuevo estado de error (`formError`) para mostrar mensajes de validación locales (ej. "Por favor, completa todos los campos") sin depender del `errorMessage` del hook, que está reservado para errores de API.

### Responsabilidades Clave

- **(Heredado)** Renderizado de campos seguros de Stripe y captura del nombre del titular.
- **(Nuevo) Rastreo de Validez de Campos:** Escucha activamente los eventos de los elementos de Stripe para saber si los datos introducidos son válidos y completos.
- **(Nuevo) Bloqueo de Envío Inválido:** Previene que el usuario envíe el formulario si algún campo está incompleto, mejorando la UX y reduciendo llamadas innecesarias a la API.
- **Gestión de Estado Visual:** Mantiene su máquina de estados (`idle`, `success`, `error`) para mostrar la vista correcta después de un intento de pago.
- **Orquestación del Envío de Pago:** Sigue delegando la lógica de pago al hook `useStripePayment` una vez que las validaciones del cliente pasan.
- **Manejo de Navegación y Cierre:** Conserva la lógica para navegar y notificar a los componentes padres que se cierren después de que el flujo de pago concluya.

### Props (Propiedades)

Las propiedades de este componente no han cambiado.

| Prop                | Tipo                               | Obligatorio | Descripción                                                                                                                              |
|---------------------|------------------------------------|-------------|------------------------------------------------------------------------------------------------------------------------------------------|
| `amount`            | `number`                           | Sí          | El monto total del pago. Se utiliza principalmente para mostrarlo en el botón de "Pagar".                                                 |
| `onBack`            | `() => void`                       | Sí          | Función de callback que se ejecuta cuando el usuario hace clic en el botón de retroceso.                                                 |
| `paymentPayload`    | `IPayloadCreatePaymentIntent`      | Sí          | Objeto que contiene todos los datos de la orden que se enviarán al backend.                                                              |
| `onPaymentComplete` | `() => void`                       | Sí          | Función de callback que se ejecuta justo antes de la navegación post-pago para cerrar componentes padres.                                |

### Estructura y Dependencias

La estructura de dependencias sigue siendo la misma.

#### Custom Hooks
- **`useStripePayment()`**: Sigue siendo el responsable de la lógica de comunicación con el backend y la API de Stripe.

#### Librerías Externas
- **`@stripe/react-stripe-js`**: Además de los componentes, ahora se utilizan sus eventos (`onChange`) y tipos de eventos (`StripeCardNumberElementChangeEvent`, etc.).
- **`react-router-dom`**: Se utiliza `useNavigate` para la redirección.

### Flujo de Funcionamiento (Máquina de Estados Interna)

El flujo se ha enriquecido con la validación del lado del cliente.

#### Estado de los Campos de Tarjeta

- El estado `cardElementsComplete` es un objeto que actúa como un checklist: `{ cardNumber: false, cardExpiry: false, cardCvc: false }`.
- La función `handleCardElementChange` es un manejador de eventos genérico. Se asigna al `onChange` de cada `Card...Element`.
- Cuando el usuario escribe en un campo, el evento de Stripe incluye una propiedad `complete`. `handleCardElementChange` actualiza la propiedad correspondiente en el estado `cardElementsComplete` a `true` o `false`.

#### Validación del Formulario

- La función `handleSubmit` ahora tiene una guarda de validación al principio.
- Comprueba dos cosas:
    1. Que `fullName` no esté vacío.
    2. Que todos los valores en el objeto `cardElementsComplete` sean `true`.
- Si alguna de estas condiciones no se cumple, establece el `formError` con un mensaje para el usuario y detiene la ejecución, **evitando así la llamada a la API**.

#### Estados de Pago

La máquina de estados principal (`paymentStatus`) funciona igual que antes, pero solo se activa después de que la validación del formulario del lado del cliente haya sido exitosa.

- **`idle`**: El estado inicial, donde se muestra el formulario. El usuario recibe retroalimentación inmediata sobre la validez de los campos a través de los estilos de Stripe (`invalid`) y ahora a través del `formError` si intenta enviar un formulario incompleto.
- **`success` / `error`**: Estos estados se alcanzan únicamente después de que `handlePayment` se haya ejecutado y haya devuelto un resultado, comportándose de la misma manera que en la versión anterior (mostrando vistas de resultado con opciones para reintentar o navegar).

### Ejemplo de Uso

El uso de este componente desde su padre no cambia, ya que la nueva lógica de validación es interna y está completamente encapsulada. El componente padre solo necesita proporcionar las mismas props que antes.

```jsx
// Dentro de un componente padre como PaymentModal.tsx

import { Elements } from '@stripe/react-stripe-js';
import { stripePromise } from '../../App';
import { StripePaymentForm } from './StripePaymentForm';

const PaymentModal = ({ onPaymentComplete, paymentPayload, quoteAmount, onBack }) => {
    
    // ... lógica del modal ...

    return (
        <div className="modal-content">
            {/* 
              El padre no necesita saber sobre la validación interna.
              Simplemente renderiza el componente con las props requeridas.
            */}
            <Elements stripe={stripePromise}>
                <StripePaymentForm
                    amount={quoteAmount}
                    onBack={onBack}
                    paymentPayload={paymentPayload}
                    onPaymentComplete={onPaymentComplete}
                />
            </Elements>
        </div>
    );
};
```
