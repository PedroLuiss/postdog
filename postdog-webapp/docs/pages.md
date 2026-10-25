

## 🧩 Componente: `ReportProblemPage`

### 📄 Descripción General

El componente `ReportProblemPage` es la página designada para que los usuarios puedan **enviar reportes, dudas o comentarios** a través de un formulario.

Funciona como un **componente contenedor** o **inteligente**, cuya principal responsabilidad es orquestar el flujo de datos entre el formulario y la lógica de envío a la API. Delega la complejidad de la UI y del estado a componentes y hooks especializados.

Este componente integra:

-   📝 Un bloque de texto informativo
-   📬 Un formulario para la entrada de datos (`ReportProblemForm`)
-   📢 Alertas de feedback para el usuario (éxito o error)

Toda la lógica de comunicación con la API y la gestión de su estado es manejada por el **hook personalizado `useSendReportProblem`**.

### 🧱 Estructura y Componentes Hijos

El componente `ReportProblemPage` se compone de **tres partes principales**:

#### 📝 **Bloque Informativo**
Una sección de UI estática que contiene:
- Instrucciones para el usuario
- Información de contacto o ayuda adicional

#### 📢 **Mensajes de Feedback (`Alert`)**
Componentes de la librería Material-UI que se renderizan **condicionalmente** para comunicar el resultado de la operación al usuario:
- Mensaje de **éxito** cuando el reporte se envía correctamente
- Mensaje de **error** si ocurre un problema durante el envío

#### 📬 `ReportProblemForm`
Componente presentacional que encapsula el formulario y su lógica interna de validación, incluyendo:
- Campos de entrada (`select`, `textarea`)
- Botón de envío con estado de **carga**
- Exhibición de errores de validación por campo

### 🧪 Ejemplo de Uso

A continuación se muestra cómo se estructura el componente `ReportProblemPage` con sus partes principales:

```tsx
<div className="report-problem-page">
  {/* Bloque de texto informativo */}
  <div className="info-block">...</div>

  {/* Alertas de feedback (condicionales) */}
  <Alert severity="success">Reporte enviado con éxito.</Alert>
  <Alert severity="error">Error al enviar el reporte.</Alert>

  {/* Formulario para el reporte */}
  <ReportProblemForm onFormSubmit={...} loading={...} />
</div>
```

### ⚙️ Gestión de Estado

La lógica principal y el estado de la página son gestionados exclusivamente por el **hook personalizado `useSendReportProblem`**. Este componente no contiene estado local (`useState`).

---

#### 🧠 Hook: `useSendReportProblem`

Este hook es el **cerebro de la operación de envío**. Encapsula toda la lógica de:

-   Comunicación con la API para enviar el reporte
-   Gestión del estado de carga (`isLoading`)
-   Manejo de la respuesta exitosa (`data`)
-   Captura de errores (`error`)

##### 📦 Valores que provee

| Propiedad | Tipo | Descripción |
| :--- | :--- | :--- |
| `data` | `ApiResponse \| null` | Contiene la respuesta exitosa de la API (ej: `{ message: '...' }`) |
| `error` | `Error \| null` | Objeto de error si la petición falla |
| `isLoading` | `boolean` | `true` si la petición de envío está en curso |

##### 🛠️ Funciones que provee

| Función | Firma | Descripción |
| :--- | :--- | :--- |
| `execute` | `(formData: FormValuesReport) => void` | Inicia el proceso de envío del reporte a la API con los datos del formulario |

-------------------------------------------------------------------------------------------------------------
## 🧩 Componente: `OrdersPage`

### 📄 Descripción General

El componente `OrdersPage` es la página principal para **visualizar, buscar y filtrar** la lista de órdenes o envíos.

Actúa como un **componente contenedor** o **inteligente**, orquestando el estado y la lógica de negocio, y delegando la presentación a componentes hijos **"tontos" o "presentacionales"**.

Este componente integra:

- 🔍 Una barra de búsqueda y filtros
- 📊 Una tabla para mostrar los datos
- ⏮️ Controles de paginación

Todo esto es gestionado a través del **hook personalizado `useOrders`**, que encapsula la lógica de estado y las operaciones relacionadas con las órdenes.

### 🧱 Estructura y Componentes Hijos

El componente `OrdersPage` se compone de **tres partes principales**:

#### 🔍 `OrdersSearchBar`
Componente de UI que contiene:
- Input de búsqueda
- Botón para abrir el modal de filtros
- Acciones adicionales como **"Actualizar"**

#### 📦 `OrdersTable`
Componente encargado de renderizar la **tabla de envíos**, incluyendo:
- Estado de **carga**
- Estado de **error**
- Estado de **vacío**
- Renderizado de la **lista de datos**

#### ⏮️ `PaginationTable`
Componente que gestiona los **controles de paginación**, incluyendo:
- Botones **anterior** y **siguiente**
- Selector de **número de registros por página**
- Lógica de **navegación entre páginas**

### 🧪 Ejemplo de Uso

A continuación se muestra cómo se estructura el componente `OrdersPage` con sus hijos principales:

```tsx
<div className="orders-page">
  <OrdersSearchBar {...props} />
  <div className="content-area">
    <OrdersTable {...props} />
    <PaginationTable {...props} />
  </div>
</div>
```

### ⚙️ Gestión de Estado

La lógica principal y el estado de la página son gestionados por el **hook personalizado `useOrders`** y un **estado local adicional** para los filtros.

---

#### 🧠 Hook: `useOrders`

Este hook es el **cerebro de la página**. Encapsula toda la lógica de:

- Obtención de datos
- Estado de carga
- Manejo de errores
- Filtros aplicados
- Paginación

##### 📦 Valores que provee

| Propiedad         | Tipo                              | Descripción                                                  |
|-------------------|-----------------------------------|--------------------------------------------------------------|
| `shipments`       | `Shipment[]`                      | Array con los envíos de la página actual                     |
| `isLoading`       | `boolean`                         | `true` si se está realizando una petición a la API           |
| `error`           | `string \| null`                  | Mensaje de error si la petición falla                        |
| `paginationInfo`  | `{ currentPage, totalPages, totalItems }` | Información de la paginación actual               |
| `pageSize`        | `number`                          | Número de registros por página seleccionados                 |

##### 🛠️ Funciones que provee

| Función             | Firma                                      | Descripción                                                  |
|---------------------|--------------------------------------------|--------------------------------------------------------------|
| `setFilters`        | `(filters: FilterValues) => void`          | Aplica nuevos filtros y ejecuta la petición                  |
| `refreshOrders`     | `() => void`                               | Recarga los datos de la página actual                        |
| `goToPage`          | `(page: number) => void`                   | Navega a una página específica                               |
| `changePageSize`    | `(size: number) => void`                   | Cambia el tamaño de página y recarga los datos               |

---

#### 🗂️ Estado Local: `modalFilters`

- **Tipo**: `useState<FilterValues>`
- **Propósito**: Actúa como un **estado temporal** o "borrador" para los filtros seleccionados en el `FilterModal` y el input de búsqueda.
- **Comportamiento**:  
  - No dispara nuevas peticiones a la API automáticamente.  
  - Solo se aplica cuando el usuario hace clic en **"Aplicar"** o **"Buscar"**, momento en el que se pasa a `setFilters`.


# Documentación del Componente `PickupsPage`

## Resumen

El componente `PickupsPage` actúa como la página principal para la visualización y gestión de las recogidas de pedidos. Su función es orquestar varios sub-componentes (como la barra de búsqueda, la tabla de resultados y la paginación) para ofrecer una experiencia de usuario completa.

La lógica central de obtención de datos, filtrado y paginación se delega por completo al custom hook `usePickups`, haciendo que este componente se centre principalmente en la gestión del estado de la UI y el paso de datos y funciones a sus hijos.

## Estructura del Componente

`PickupsPage` está compuesto por las siguientes partes principales:

-   **`PickupsSearchBar`**: Componente de UI que contiene los campos de búsqueda y filtros. Permite al usuario definir los criterios para consultar las recogidas.
-   **`PickupsTable`**: Componente que renderiza la lista de recogidas (`pickup`) en formato de tabla. También gestiona la visualización de los estados de carga (`isLoading`) y error (`error`).
-   **`PaginationTable`**: Componente reutilizable para la navegación entre las páginas de resultados.
-   **`FinalizeShippingModal`**: Un componente modal que parece ser independiente del flujo principal de datos de la página, probablemente con su propia gestión de estado interna o global.

---

## Gestión de Estado y Lógica

La lógica del componente se divide en dos partes principales:

### 1. Hook `usePickups`

La mayor parte de la lógica compleja está encapsulada en el hook `usePickups`. Este componente consume el hook para obtener:

-   **Datos y Estado de la Petición**: `pickup`, `isLoading`, `error`.
-   **Información de Paginación**: `paginationInfo`, `pageSize`.
-   **Funciones de Interacción**: `setFilters`, `refreshOrders`, `goToPage`, `changePageSize`.

### 2. Estado Local (`modalFilters`)

Este componente introduce un estado local adicional llamado `modalFilters` usando `useState`.

-   **Propósito**: `modalFilters` actúa como un estado "borrador" o "intermedio" para los filtros. Esto permite al usuario modificar los valores en `PickupsSearchBar` sin disparar una nueva petición a la API con cada cambio (por ejemplo, al escribir en un campo de texto).
-   **Flujo**:
    1.  El usuario interactúa con `PickupsSearchBar`.
    2.  Los cambios se guardan en el estado `modalFilters` a través de la función `setModalFilters`.
    3.  La petición a la API solo se dispara cuando el usuario explícitamente hace clic en "Aplicar" o "Buscar", momento en el cual la función `handleApplyFilters` o `handleSearch` es llamada.

### Funciones Manejadoras (Handlers)

-   **`handleApplyFilters(appliedFilters)`**:
    -   Recibe los filtros del componente `PickupsSearchBar`.
    -   Llama a `setFilters(appliedFilters)`, lo que actualiza el estado dentro del hook `usePickups` y dispara la recarga de datos.
    -   Sincroniza el estado local `modalFilters` con los filtros aplicados.
-   **`handleClearModalFilters()`**:
    -   Resetea tanto el estado local (`modalFilters`) como el estado del hook (`setFilters`) a sus valores iniciales, limpiando todos los filtros aplicados.
-   **`handleSearch()`**:
    -   Toma los valores actuales del estado "borrador" (`modalFilters`) y los aplica llamando a `setFilters()`. Esto consolida los cambios y ejecuta la búsqueda.

---

## Props de Componentes Hijos

`PickupsPage` pasa datos y funciones a sus componentes hijos de la siguiente manera:

### `PickupsSearchBar`

-   `currentFilters`: Se le pasa `modalFilters` para que los campos de la UI siempre reflejen el estado "borrador" actual.
-   `onFiltersChange`: Se le pasa `setModalFilters` para que pueda actualizar el estado "borrador" directamente.
-   `onApplyFilters`: Se le pasa `handleApplyFilters` para manejar la acción de aplicar los filtros.
-   `onClearFilters`: Se le pasa `handleClearModalFilters` para la acción de limpiar.
-   `onRefresh`: Se le pasa `refreshOrders` del hook para refrescar los datos de la página actual.
-   `onSearch`: Se le pasa `handleSearch` para ejecutar la búsqueda.

### `PickupsTable`

-   `isLoading`: Pasa el estado de carga del hook para mostrar un indicador visual.
-   `error`: Pasa el estado de error para mostrar un mensaje si la petición falla.
-   `pickups`: Pasa el array de datos (`pickup`) para que la tabla los renderice.

### `PaginationTable`

-   `totalItems`, `pageSize`, `currentPage`: Pasa toda la información de paginación obtenida del hook.
-   `onPageChange`: Pasa la función `goToPage` del hook para manejar el cambio de página.
-   `onPageSizeChange`: Pasa la función `changePageSize` del hook para cambiar el número de items por página.

### `FinalizeShippingModal`

-   Este componente se renderiza sin pasarle props desde `PickupsPage`, lo que sugiere que su estado y lógica son completamente internos o gestionados a través de un estado global (como Context API o Redux).

---

## Flujo de Interacción del Usuario

1.  El usuario carga la página. `usePickups` se inicializa y realiza la primera petición de datos.
2.  El usuario interactúa con los filtros en `PickupsSearchBar`. Cada cambio actualiza el estado local `modalFilters`.
3.  El usuario hace clic en "Aplicar Filtros". Se llama a `handleApplyFilters`, que a su vez llama a `setFilters` en el hook `usePickups`.
4.  El hook `usePickups` detecta el cambio en `filters` y dispara una nueva petición a la API con los nuevos criterios.
5.  Los nuevos datos (`pickup`), junto con los estados `isLoading` y `error`, se propagan hacia abajo a `PickupsTable` y `PaginationTable`, actualizando la UI.

## Dependencias

-   **`react`**: Para el hook `useState`.
-   **`PickupsPage.module.scss`**: Estilos específicos del componente.
-   **`types`**: Para la definición del tipo `FilterValues`.
-   **Componentes Hijos**: `PaginationTable`, `FinalizeShippingModal`, `PickupsSearchBar`, `PickupsTable`.
-   **Hooks**: `usePickups`.