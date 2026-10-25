
# Custom Hook: `useUpdateShipment`

## Descripción General

El hook `useUpdateShipment` es un hook de mutación diseñado específicamente para manejar el proceso de actualización de un envío. Su principal responsabilidad es encapsular toda la lógica de estado relacionada con una operación asíncrona: el estado de carga (`isLoading`), los posibles errores (`error`) y los datos de la respuesta exitosa (`data`).

Este hook actúa como un intermediario entre la UI (que inicia la acción) y la capa de servicios (que realiza la llamada a la API), proporcionando un flujo de estado predecible y fácil de consumir para el componente que lo utiliza.

## Responsabilidades Clave

- **Gestión de Estado de la Mutación:** Mantiene tres piezas de estado clave:
    1.  `isLoading`: Un booleano que es `true` mientras la operación de actualización está en curso.
    2.  `error`: Una cadena de texto (`string`) que contiene el mensaje de error si la operación falla, o `null` en caso contrario.
    3.  `data`: Almacena la respuesta de la API en caso de una actualización exitosa.
- **Orquestación de la Llamada a la API:** Expone la función `updateShipmentModal`, que se encarga de:
    -   Resetear el estado antes de iniciar una nueva petición.
    -   Llamar a la función de servicio `updateShipmentServices`.
    -   Manejar los casos de éxito y error, actualizando el estado correspondientemente.
- **Provisión de una Función de Reseteo:** Expone una función `resetUpdateState` que permite a los componentes externos limpiar manualmente los estados de `error` y `data`. Esto es útil para limpiar mensajes de feedback cuando un modal se vuelve a abrir, por ejemplo.

---

## Valor de Retorno

El hook retorna un objeto que conforma la interfaz `ShipmentUpdateHook`, con las siguientes propiedades:

| Clave                 | Tipo                                                       | Descripción                                                                                                                                     |
| :-------------------- | :--------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------- |
| `isLoading`           | `boolean`                                                  | `true` si la petición de actualización está en curso. Ideal para deshabilitar botones o mostrar spinners.                                         |
| `error`               | `string \| null`                                           | Contiene el mensaje de error si la petición falla. Es `null` si no hay error o antes de que se realice la petición.                             |
| `data`                | `ResponseDataUpdateShipmentModal \| null`                  | Almacena el objeto de respuesta de la API si la actualización es exitosa. Es `null` si hay un error o antes de la petición.                 |
| `updateShipmentModal` | `(shipmentId: string, data: any) => Promise<boolean>`      | La función principal que se debe llamar para iniciar la actualización. Retorna una `Promise` que resuelve a `true` en caso de éxito y `false` en caso de fallo. |
| `resetUpdateState`    | `() => void`                                               | Una función `useCallback`-memorizada para resetear los estados `error` y `data` a `null`.                                                     |

---

## Dependencias

- **`updateShipmentServices` (Función de Servicio):** Este hook depende de la función `updateShipmentServices` para realizar la comunicación real con la API. El hook no sabe *cómo* se actualiza el envío, solo sabe *cuándo* y cómo manejar el resultado.

---

## Uso

Este hook está diseñado para ser utilizado dentro de otro hook de lógica más grande (como `useFinalizeShipping`) o directamente en un componente que necesite realizar una actualización.

### Ejemplo de uso en un hook contenedor:

```jsx
// En el hook useFinalizeShipping.ts

import { useUpdateShipment } from './useUpdateShipment';

export const useFinalizeShipping = (order) => {
  // 1. Invocar el hook para obtener sus funcionalidades.
  const { updateShipmentModal, isLoading, error, data } = useUpdateShipment();

  const handleSaveChanges = async () => {
    if (!order) return;

    const finalData = { /* ...recolectar datos del formulario... */ };

    // 2. Usar la función de actualización.
    const success = await updateShipmentModal(order.id, finalData);

    if (success) {
      // 3. Reaccionar al éxito (ej. cerrar modal, mostrar toast).
      console.log('Guardado con éxito:', data); // 'data' contendrá la respuesta
    } else {
      // 4. Reaccionar al error (el estado 'error' ya está poblado).
      console.error('Falló el guardado:', error);
    }
  };

  // 5. Retornar los estados para que la UI los consuma.
  return {
    handleSaveChanges,
    isLoading,
    error,
    // ...
  };
};
```

### Ejemplo de uso en un componente de UI:

```jsx
// En un componente de UI (ej. MyComponent.tsx)

import { useUpdateShipment } from '../hooks/useUpdateShipment';

const MyComponent = ({ shipmentId }) => {
  const { updateShipmentModal, isLoading, error, data } = useUpdateShipment();

  const handleUpdate = () => {
    const updatedData = { /* ... */ };
    updateShipmentModal(shipmentId, updatedData);
  };

  return (
    <div>
      <button onClick={handleUpdate} disabled={isLoading}>
        {isLoading ? 'Actualizando...' : 'Actualizar Envío'}
      </button>

      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {data && <p style={{ color: 'green' }}>{data.message}</p>}
    </div>
  );
};
```

### Reseteo del Estado

La función `resetUpdateState` es útil para limpiar el feedback visual entre operaciones.

```jsx
// En un componente que abre un modal

const ParentComponent = () => {
  const { resetUpdateState, ...updateShipmentHook } = useUpdateShipment();

  const openModal = () => {
    resetUpdateState(); // Limpia errores/éxitos anteriores antes de mostrar el modal
    // ...lógica para abrir el modal
  };

  // ...
};
```


# Custom Hook: `useFinalizeShipping`

## Descripción General

El hook `useFinalizeShipping` es el **"cerebro"** lógico detrás del componente `FinalizeShippingModal`. Su propósito es orquestar y centralizar toda la lógica de negocio necesaria para la edición de un envío existente.

Este hook agrupa la lógica de múltiples "pasos" (direcciones, paquetes, paquetería) y la gestión de la llamada a la API, proporcionando al componente de UI (`FinalizeShippingModal`) un conjunto limpio y cohesivo de estados, datos y manejadores de eventos.

## Responsabilidades Clave

- **Orquestación de Sub-Hooks:** Compone la lógica de `useStepOne`, `useStepTwo`, y `useStepThree` para manejar el estado y la validación de cada sección del formulario de manera aislada.
- **Gestión del Estado de la UI:** Mantiene estados locales que controlan los modos de edición de cada sección (`isEditingAddress`, `editingPackageId`, `isEditingCourier`).
- **Inicialización de Datos:** Utiliza un `useEffect` para poblar los formularios con los datos de la `order` que recibe como argumento cuando el modal se abre. **Nota:** Actualmente, los datos de la orden están parcialmente "hardcodeados" y deberían ser mapeados completamente desde el objeto `order`.
- **Reset de Estado:** Contiene un `useEffect` que resetea el estado de la llamada a la API (`useUpdateShipment`) cada vez que el modal se abre, asegurando que no se muestren mensajes de éxito o error de una operación anterior.
- **Provisión de Handlers:** Crea y memoriza (`useMemo`) objetos de `handlers` para cada sección (`addressHandlers`, `packageHandlers`, `courierHandlers`), que contienen todas las funciones necesarias para que la UI interactúe con la lógica del hook.
- **Lógica de Envío y Validación Final:** Implementa la función `handleSend`, que realiza una validación completa de todos los pasos del formulario, recopila los datos en un formato unificado y utiliza el hook `useUpdateShipment` para enviar la información a la API.

---

## Parámetros

El hook recibe un único objeto de configuración con las siguientes propiedades:

| Parámetro             | Tipo                | Requerido | Descripción                                                                                           |
| :-------------------- | :------------------ | :-------- | :---------------------------------------------------------------------------------------------------- |
| `order`               | `Shipment \| null`  | **Sí**    | El objeto del envío que se va a editar. Si es `null`, el hook no inicializará los datos.              |
| `isOpen`              | `boolean` (opcional)| No        | Un booleano que indica si el modal está actualmente abierto. Se usa para disparar el reseteo de estado.|
| `closeDrawerEditOrde` | `() => void`        | **Sí**    | Una función callback para cerrar el modal, que se invoca después de una actualización exitosa.       |

---

## Valor de Retorno

El hook retorna un único objeto que contiene todo lo que el componente de UI necesita para renderizarse y funcionar. Este objeto incluye:

-   **Estados de la UI:**
    -   `isEditingAddress: boolean`
    -   `editingPackageId: string | null`
    -   `isEditingCourier: boolean`
    -   `isPawSafeActive: boolean`
-   **Datos de los Formularios:**
    -   Datos y errores para direcciones (`remitterData`, `addresseeData`, etc.).
    -   Datos y errores para paquetes (`packages`, `packageErrors`).
    -   Datos y errores para paquetería y pago (`filteredAndSortedOptions`, `selectedOption`, `paymentErrors`, etc.).
-   **Setters:**
    -   `setIsPawSafeActive`: Para el toggle del seguro.
    -   `setDeclaredValue`: Para actualizar el valor declarado.
-   **Handlers Memorizados:**
    -   `addressHandlers`: Objeto con las funciones para la sección de direcciones.
    -   `packageHandlers`: Objeto con las funciones para la sección de paquetes.
    -   `courierHandlers`: Objeto con las funciones para la sección de paquetería.
-   **Función de Envío:**
    -   `handleSend: () => Promise<void>`: La función principal para validar y guardar todos los cambios.
-   **Estado de la Mutación (API):**
    -   `isUpdating: boolean`: `true` mientras la llamada a la API está en curso.
    -   `updateError: string | null`: Mensaje de error si la llamada a la API falla.
    -   `dataUpdateShipmentModal: any | null`: Datos de la respuesta si la llamada a la API es exitosa.

---

## Dependencias (Hooks)

- **`useStepOne`, `useStepTwo`, `useStepThree`:** Hooks que encapsulan la lógica de cada sección del formulario.
- **`useUpdateShipment`:** Hook dedicado a manejar el estado de la llamada a la API para actualizar el envío (carga, error, datos, reseteo).

---

## Uso

Este hook está diseñado para ser consumido por un componente de UI, como `FinalizeShippingModal`.

```jsx
// En el componente FinalizeShippingModal.tsx

import { useFinalizeShipping } from '../../hooks/useFinalizeShipping';
import { useShippingQuoteDrawer } from '../../context';

export const MyModal: React.FC = () => {
    // 1. Obtener los datos necesarios del contexto.
    const { isDrawerOpenEditOrder, closeDrawerEditOrde, order } = useShippingQuoteDrawer();

    // 2. Invocar el hook con los parámetros requeridos.
    const {
        isEditingAddress,
        remitterData,
        addressHandlers,
        handleSend,
        isUpdating,
        updateError
        // ...desestructurar el resto de las propiedades que necesites
    } = useFinalizeShipping({
        order,
        isOpen: isDrawerOpenEditOrder,
        closeDrawerEditOrde
    });

    // 3. Pasar las propiedades desestructuradas a los componentes de presentación.
    return (
        <Drawer open={isDrawerOpenEditOrder}>
            <Header onSave={handleSend} loading={isUpdating} />
            <AddressSection
                isEditing={isEditingAddress}
                remitterData={remitterData}
                handlers={addressHandlers}
            />
            {/* ...resto de la UI... */}
        </Drawer>
    );
};
```

### Posibles Mejoras a Futuro

- **Mapeo de Datos Dinámico:** El `useEffect` que inicializa los datos actualmente contiene valores fijos. Debería modificarse para mapear todos los campos posibles desde el objeto `order`, usando valores por defecto solo si es necesario.
- **Abstracción de `finalData`:** La estructura del objeto `finalData` que se envía a la API podría ser construida por una función `util` para mantener el hook más limpio.

## 🧠 Hook: `useSendReportProblem`

### 📄 Descripción General

El hook `useSendReportProblem` es un hook personalizado que **abstrae y gestiona por completo la lógica de comunicación con la API** para enviar un reporte de problema. Su propósito es mantener los componentes de la interfaz de usuario (como `ReportProblemPage`) libres de la lógica de negocio y del manejo de estado asíncrono.

Este hook es el **orquestador de la petición de red**, manejando:

-   🚀 La ejecución de la llamada al servicio `SendReportProblemServices`.
-   ⏳ El estado de carga (`isLoading`) durante la petición.
-   ✅ La captura de la respuesta exitosa (`data`).
-   ❌ El manejo de errores (`error`) en caso de que la petición falle.

Al encapsular esta lógica, se promueve la reutilización y se simplifica enormemente el componente que lo consume.

### ⚙️ Configuración (Parámetros)

Este hook **no requiere parámetros** para su inicialización. Toda la configuración necesaria está contenida dentro del propio hook.

```tsx
// El hook se invoca sin argumentos
const { data, error, isLoading, execute } = useSendReportProblem();
```

### 📦 Valores y Funciones que Retorna

El hook retorna un objeto con el estado actual de la petición y la función para ejecutarla.

#### 📦 Valores que Retorna

| Propiedad | Tipo | Descripción |
| :--- | :--- | :--- |
| `data` | `ApiResponse \| null` | Contiene la respuesta exitosa del servidor una vez que la petición se completa. Es `null` inicialmente o si ocurre un error. |
| `error` | `Error \| null` | Contiene el objeto de error si la petición a la API falla. Es `null` si la petición es exitosa o no se ha iniciado. |
| `isLoading` | `boolean` | Es `true` mientras la petición a la API está en curso, y `false` en cualquier otro momento. Ideal para mostrar loaders o deshabilitar botones. |

#### 🛠️ Funciones que Retorna

| Función | Firma | Descripción |
| :--- | :--- | :--- |
| `execute` | `(formData: FormValuesReport) => Promise<void>` | La función que **inicia la llamada a la API**. Debe ser invocada con los datos del formulario. Está memoizada con `useCallback` para optimizar el rendimiento. |

### 🔄 Flujo de Trabajo Interno

Cuando la función `execute` es llamada, el hook sigue estos pasos:

1.  **Inicio**: Inmediatamente establece `isLoading` en `true` y resetea `data` y `error` a `null`.
2.  **Ejecución**: Llama a la función `SendReportProblemServices(formData)` y espera su resolución.
3.  **Resultado**:
    -   **En caso de éxito**: Actualiza el estado con la respuesta en `data` y establece `isLoading` en `false`.
    -   **En caso de fallo**: Captura el error, lo guarda en el estado `error`, y establece `isLoading` en `false`.

### 🧪 Ejemplo de Uso

A continuación se muestra cómo el componente `ReportProblemPage` utilizaría este hook para gestionar el envío del formulario.

```tsx
// Dentro del componente ReportProblemPage.tsx

// 1. Se invoca el hook para obtener el estado y la función de ejecución.
const { data, error, isLoading, execute } = useSendReportProblem();

// 2. Se define una función manejadora que llamará a 'execute'.
const handleFormSubmit = (formData: FormValuesReport) => {
  // 3. 'execute' se llama con los datos del formulario ya validados.
  execute(formData);
};

return (
  <div>
    {/* 4. 'isLoading' se usa para mostrar feedback de carga. */}
    {isLoading && <p>Enviando reporte...</p>}
    
    {/* 5. 'data' se usa para mostrar el mensaje de éxito. */}
    {data && <Alert severity="success">{data.message}</Alert>}
    
    {/* 6. 'error' se usa para mostrar el mensaje de error. */}
    {error && <Alert severity="error">{error.message}</Alert>}
    
    {/* 7. El estado y la función se pasan al componente del formulario. */}
    <ReportProblemForm 
      onFormSubmit={handleFormSubmit} 
      loading={isLoading} 
    />
  </div>
);
```



## 🧠 Hook: `useFormReportProblem`

### 📄 Descripción General

El hook `useFormReportProblem` es un hook personalizado diseñado para **encapsular toda la lógica de estado y validación** del formulario de reporte de problemas. Su propósito es abstraer la complejidad del manejo de formularios, permitiendo que el componente que lo utiliza (`ReportProblemForm`) se mantenga limpio y enfocado únicamente en la presentación de la UI.

Este hook es el **cerebro del formulario**, gestionando:

-   📝 Los valores actuales de los campos.
-   🔄 Las actualizaciones de estado cuando el usuario escribe.
-   ❗ La ejecución de la lógica de validación.
-   📢 El estado de los mensajes de error.

La lógica de validación es **específica para este formulario** y está contenida dentro del propio hook, lo que lo hace una solución cohesiva y fácil de mantener.

### ⚙️ Configuración (Parámetros)

El hook se configura mediante un único objeto de opciones que define su comportamiento inicial y su acción al finalizar.

| Propiedad | Tipo | Descripción |
| :--- | :--- | :--- |
| `initialValues` | `FormValuesReport` | Un objeto que define los valores iniciales para los campos del formulario. |
| `onSubmit` | `(values: FormValuesReport) => void` | Una función de callback que se ejecuta **únicamente** cuando el formulario se envía y todas las validaciones son exitosas. Recibe los datos validados como argumento. |

### 📦 Valores y Funciones que Retorna

El hook retorna un objeto con el estado y los manejadores necesarios para conectar la lógica a un formulario JSX.

#### 📦 Valores que Retorna

| Propiedad | Tipo | Descripción |
| :--- | :--- | :--- |
| `values` | `FormValuesReport` | Un objeto que contiene los valores actuales de los campos (`tema`, `descripcion`). Se utiliza para vincular el estado a los `value` de los inputs. |
| `errors` | `ValidationErrors` | Un objeto que contiene los mensajes de error de validación correspondientes a cada campo. Se utiliza para mostrar feedback condicional al usuario. |

#### 🛠️ Funciones que Retorna

| Función | Firma | Descripción |
| :--- | :--- | :--- |
| `handleChange` | `(e: ChangeEvent) => void` | Manejador que actualiza el estado `values` en respuesta a los cambios en los inputs. Debe ser asignado al evento `onChange` de cada campo. |
| `handleSubmit` | `(e: FormEvent) => void` | Manejador para el evento `onSubmit` del formulario. Orquesta la validación y, si tiene éxito, invoca la función `onSubmit` pasada en la configuración. |

### 🔒 Lógica de Validación Interna

La función `validate` está definida dentro del hook y aplica las siguientes reglas:

1.  **Tema**: Debe tener un valor seleccionado (no puede estar vacío).
2.  **Descripción**:
    -   No puede estar vacía o contener solo espacios en blanco.
    -   Debe tener una longitud mínima de 10 caracteres.

### 🧪 Ejemplo de Uso

A continuación se muestra cómo el componente `ReportProblemForm` utiliza este hook:

```tsx
// Dentro del componente ReportProblemForm.tsx

const { values, errors, handleChange, handleSubmit } = useFormReportProblem({
  // 1. Se proveen los valores iniciales para el formulario.
  initialValues: {
    tema: '',
    descripcion: '',
  },
  // 2. Se pasa la función que debe ejecutarse tras una validación exitosa.
  onSubmit: onFormSubmit, // 'onFormSubmit' es la prop recibida del componente padre.
});

return (
  // 3. El manejador se conecta al evento onSubmit del formulario.
  <form onSubmit={handleSubmit}>
    <select
      name="tema"
      // 4. El estado se conecta al valor del input.
      value={values.tema}
      // 5. El manejador de cambio se conecta al evento onChange.
      onChange={handleChange}
    >
      {/* ... options ... */}
    </select>
    
    {/* 6. Los errores se muestran condicionalmente. */}
    {errors.tema && <span>{errors.tema}</span>}
    
    {/* ... otros campos del formulario siguen el mismo patrón ... */}
  </form>
);
```

-------------------------------------------------------------------------------------------------------------------------------

# Custom Hook: `useIsMobile`

El hook `useIsMobile` es una utilidad para determinar si el ancho de la ventana del navegador actual corresponde a un tamaño de pantalla móvil. Proporciona un simple indicador booleano que se actualiza automáticamente cuando el tamaño de la ventana cruza el punto de quiebre (breakpoint) definido.

Este hook es fundamental para construir componentes con lógica de renderizado responsiva directamente en JavaScript, en lugar de depender únicamente de CSS media queries.

## Responsabilidades

-   **Detección Inicial**: Comprueba el tamaño de la ventana en el momento en que el componente se monta para determinar el estado inicial.
-   **Escucha de Cambios**: Se suscribe eficientemente a los cambios en el tamaño de la ventana para actualizar el estado cuando sea necesario.
-   **Limpieza Automática**: Se encarga de limpiar sus propios event listeners cuando el componente se desmonta para prevenir fugas de memoria.

## Parámetros

El hook `useIsMobile` no acepta ningún parámetro en su invocación.
`useIsMobile()`

## Valor de Retorno

El hook retorna un único valor booleano:

| Valor   | Descripción                                                                 |
| ------- | --------------------------------------------------------------------------- |
| `true`  | Indica que el ancho de la ventana es **menor a 768px**.                       |
| `false` | Indica que el ancho de la ventana es **igual o mayor a 768px**. |

**Nota importante:** Durante el renderizado en el servidor (SSR) o en el primer instante antes de que el `useEffect` se ejecute en el cliente, el hook devolverá `false`.

## Uso

Este hook se utiliza para renderizar condicionalmente componentes o elementos JSX basados en el tamaño de la pantalla.

```jsx
import React from 'react';
import { useIsMobile } from '../hooks/useIsMobile';
import { MobileNavigation } from './MobileNavigation';
import { DesktopNavigation } from './DesktopNavigation';

const AppHeader = () => {
  // 1. Invocar el hook para obtener el estado actual
  const isMobile = useIsMobile();

  return (
    <header>
      <div className="logo">Mi App</div>
      <nav>
        {/* 2. Usar el booleano para renderizar el componente adecuado */}
        {isMobile ? <MobileNavigation /> : <DesktopNavigation />}
      </nav>
    </header>
  );
};

// Otro ejemplo para cambiar un texto
const ResponsiveButton = () => {
  const isMobile = useIsMobile();
  
  return (
    <button>
      {isMobile ? 'Ver Más' : 'Ver Todos los Detalles del Producto'}
    </button>
  );
};
```

## Lógica Interna y Comportamiento Clave

-   **Punto de Quiebre (Breakpoint)**: El hook utiliza un punto de quiebre fijo definido en la constante `MOBILE_BREAKPOINT = 768;`. Esto significa que cualquier pantalla con un ancho de `0px` a `767px` será considerada "móvil".

-   **Uso Eficiente de `window.matchMedia`**: En lugar de escuchar el evento `resize` (que puede dispararse cientos de veces durante un redimensionamiento), el hook utiliza la API moderna `window.matchMedia`. Esto es mucho más eficiente, ya que el evento `'change'` solo se dispara una vez cuando el resultado de la media query cambia (es decir, cuando el ancho de la ventana cruza el límite de `768px`).

-   **Manejo de Estado Inicial y SSR**:
    -   El estado interno `isMobile` se inicializa como `undefined`. Esto es una estrategia para evitar problemas de "hydration mismatch" en entornos de renderizado en servidor (SSR) como Next.js. El servidor no tiene acceso a `window` y no puede saber el tamaño de la pantalla del cliente.
    -   El `useEffect` se ejecuta solo en el cliente, donde establece el valor correcto de `isMobile` después del montaje.
    -   El valor de retorno `!!isMobile` convierte el `undefined` inicial en `false`, asegurando que el hook siempre devuelva un booleano y que el renderizado inicial (tanto en SSR como en el cliente) sea consistente (no-móvil).

-   **Limpieza de Efectos (`useEffect` Cleanup)**: El `useEffect` devuelve una función de limpieza que llama a `mql.removeEventListener`. Esto es crucial para un buen rendimiento y para evitar fugas de memoria, ya que asegura que el listener se elimine cuando el componente que usa el hook se desmonte.

## Dependencias

-   **`react`** (`useState`, `useEffect`): Hooks fundamentales de React.
-   No tiene otras dependencias externas; utiliza APIs nativas del navegador (`window.matchMedia`, `window.innerWidth`).


-------------------------------------------------------------------------------------------------------------------------------------------------------

# Custom Hook: `useShippingQuoteCreation`

El hook `useShippingQuoteCreation` encapsula toda la lógica y el estado necesarios para realizar la acción de **crear una nueva cotización de envío**. A diferencia de los hooks que solo obtienen datos, este se centra en ejecutar una operación.

## Responsabilidades

-   **Manejo de Estado de Creación**: Proporciona un estado de carga (`isCreating`) que se activa únicamente durante el proceso de creación.
-   **Ejecución de la Acción**: Expone una función (`createQuote`) que toma los datos finales de la cotización y los envía al servicio correspondiente.
-   **Gestión de Errores**: Captura y almacena cualquier error que ocurra durante el proceso de creación.

## Parámetros

El hook `useShippingQuoteCreation` no acepta ningún parámetro en su invocación.
`useShippingQuoteCreation()`

## Valores de Retorno

El hook retorna un objeto (`UseShippingQuoteCreationResult`) con un conjunto de estados y una función para controlar el proceso de creación:

| Nombre       | Tipo                                            | Descripción                                                                                                                                                             |
| ------------ | ----------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `isCreating` | `boolean`                                       | **Estado**: `true` mientras la petición para crear la cotización está en progreso. `false` en cualquier otro caso.                                                      |
| `error`      | `string | null`                                  | **Estado**: Contiene un mensaje de error si la creación falla. Si la operación es exitosa o no se ha iniciado, su valor es `null`.                                        |
| `createQuote`| `(data: FinalShippingQuoteData) => Promise<boolean>` | **Función**: La función asíncrona que se debe invocar para iniciar la creación. Recibe los datos finales de la cotización y devuelve una **promesa que se resuelve a `true` si la creación fue exitosa, o `false` en caso contrario**. |

### Interfaz `FinalShippingQuoteData`

Este es el tipo de objeto que espera la función `createQuote`. Contiene toda la información necesaria para finalizar la cotización.

```typescript
interface FinalShippingQuoteData {
  remitterData: any;      // Datos del remitente
  addresseeData: any;     // Datos del destinatario
  packages: any[];        // Array de paquetes a enviar
  shippingOption: any;    // La opción de envío seleccionada
  pawSafe: boolean;       // Indicador de seguro o servicio adicional
  declaredValue: string;  // Valor declarado del envío
  total: number;          // Costo total
}
// Nota: Se recomienda reemplazar los tipos 'any' por interfaces más específicas.
```

## Uso

Este hook está diseñado para ser utilizado en componentes que realizan la acción final de confirmar una cotización, como un botón en un modal de resumen o en el último paso de un flujo de creación.

```jsx
import React from 'react';
import { useShippingQuoteCreation } from '../hooks/useShippingQuoteCreation';

const QuoteConfirmationComponent = ({ finalQuoteData, onCreationSuccess }) => {
  // 1. Invocar el hook para obtener los controladores de la acción
  const { isCreating, error, createQuote } = useShippingQuoteCreation();

  // 2. Manejador para el botón de confirmación
  const handleConfirmQuote = async () => {
    // 3. Llamar a la función del hook y esperar el resultado booleano
    const success = await createQuote(finalQuoteData);

    if (success) {
      console.log('La cotización se creó con éxito.');
      onCreationSuccess(); // Ejecutar alguna acción en el padre (ej. cerrar modal, redirigir)
    } else {
      // El hook ya ha establecido el estado de error, solo necesitamos mostrarlo
      console.log('La creación de la cotización falló.');
    }
  };

  return (
    <div>
      {/* Resumen de la cotización a confirmar */}
      
      <button onClick={handleConfirmQuote} disabled={isCreating}>
        {isCreating ? 'Creando cotización...' : 'Confirmar y Crear Envío'}
      </button>

      {/* Mostrar el mensaje de error si existe */}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
    </div>
  );
};
```

## Lógica Interna y Flujo de Datos

-   **Patrón de Acción Asíncrona**: La función `createQuote` sigue un flujo robusto para manejar acciones que pueden tener éxito o fallar:
    1.  **Inicio**: Inmediatamente establece `isCreating` en `true` y limpia cualquier error previo (`setError(null)`).
    2.  **Ejecución (`try`)**: Llama al servicio `createShippingQuoteService` con los datos proporcionados.
    3.  **Manejo de Respuesta**: Evalúa la respuesta del servicio. Si es exitosa, devuelve `true`. Si el servicio indica un fallo (sin lanzar una excepción), establece un error genérico y devuelve `false`.
    4.  **Manejo de Excepciones (`catch`)**: Si el servicio lanza una excepción, la captura, establece un mensaje de error detallado y devuelve `false`.
    5.  **Finalización (`finally`)**: Sin importar si la operación tuvo éxito o falló, siempre se asegura de establecer `isCreating` en `false` para desbloquear la UI.
-   **Retorno Booleano**: Devolver `Promise<boolean>` es un patrón muy útil para hooks de acción. Permite al componente que lo consume tomar decisiones lógicas (`if (success) { ... }`) después de que la acción se completa, en lugar de depender únicamente de efectos secundarios (`useEffect`).

## Dependencias

-   **`react`** (`useState`, `useCallback`): Hooks fundamentales de React.
-   **`createShippingQuoteService` (Servicio)**: La función de servicio que se encarga de la comunicación real con la API para crear la cotización.
-   **Tipos de TypeScript**: `FinalShippingQuoteData`, `UseShippingQuoteCreationResult` para asegurar la consistencia de los datos.



---------------------------------------------------------------------------------------------------------------------------------------------------


# Custom Hook: `useSavedAddresses`

El hook `useSavedAddresses` se especializa en obtener y gestionar una lista de direcciones guardadas por el usuario. Su única responsabilidad es manejar el ciclo de vida completo de la petición de datos: la carga inicial, el almacenamiento de los datos exitosos y la captura de posibles errores.

Este es un hook de tipo "solo lectura" desde la perspectiva del consumidor, ya que obtiene los datos al montarse y no expone funciones para volver a solicitarlos o modificarlos.

## Responsabilidades

-   **Obtención de Datos**: Realiza una llamada a la API para obtener las direcciones guardadas en cuanto se utiliza.
-   **Gestión de Estado de Carga**: Proporciona un estado booleano (`isLoading`) que indica si la petición inicial está en curso.
-   **Gestión de Errores**: Proporciona un estado para almacenar un mensaje de error si la petición falla.

## Uso

Este hook es ideal para componentes que necesitan poblar un selector (`<select>`), una lista o cualquier UI con las direcciones guardadas del usuario.

```jsx
import React from 'react';
import { useSavedAddresses } from '../hooks/useSavedAddresses';

const AddressSelector = () => {
  // 1. Invocar el hook para obtener el estado y los datos
  const { addresses, isLoading, error } = useSavedAddresses();

  // 2. Renderizar condicionalmente basado en el estado del hook
  if (isLoading) {
    return <p>Cargando direcciones...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  return (
    <div>
      <label htmlFor="saved-address">Selecciona una dirección guardada:</label>
      <select id="saved-address">
        <option value="">-- Elige una dirección --</option>
        {/* 3. Mapear sobre los datos para renderizar las opciones */}
        {addresses.map(address => (
          <option key={address.value} value={address.value}>
            {address.label}
          </option>
        ))}
      </select>
    </div>
  );
};
```

## Parámetros

El hook `useSavedAddresses` no acepta ningún parámetro en su invocación.
`useSavedAddresses()`

## Valores de Retorno

El hook retorna un objeto con tres propiedades de estado:

| Nombre      | Tipo                           | Descripción                                                                                               |
| ----------- | ------------------------------ | --------------------------------------------------------------------------------------------------------- |
| `addresses` | `SelectOptionSavedAddress[]`   | **Estado**: Un array que contiene las direcciones guardadas. Cada objeto tiene un `value` y un `label`, ideal para un `<select>`. |
| `isLoading` | `boolean`                      | **Estado**: `true` mientras la petición inicial de datos está en progreso. `false` en cualquier otro caso.  |
| `error`     | `string | null`                 | **Estado**: Contiene un mensaje de error si la petición falla. Si la petición es exitosa, su valor es `null`. |

## Lógica Interna y Flujo de Datos

1.  **Función de Obtención (`fetchAddresses`)**:
    -   Se define una función asíncrona `fetchAddresses` dentro del hook, memoizada con `useCallback` para evitar recreaciones innecesarias.
    -   Esta función sigue un patrón robusto para peticiones de datos:
        1.  Establece `isLoading` en `true` y limpia cualquier error previo (`setError(null)`).
        2.  Llama al servicio `getSavedAddressesServices()` dentro de un bloque `try/catch`.
        3.  Si la llamada es exitosa, actualiza el estado `addresses` con los datos recibidos.
        4.  Si la llamada falla, captura el error y actualiza el estado `error` con un mensaje amigable para el usuario.
        5.  En el bloque `finally`, siempre establece `isLoading` en `false`, asegurando que el estado de carga se resuelva sin importar el resultado de la petición.

2.  **Efecto de Carga Inicial (`useEffect`)**:
    -   Se utiliza un `useEffect` para invocar `fetchAddresses()` exactamente una vez, cuando el componente que usa el hook se monta por primera vez.
    -   El array de dependencias `[fetchAddresses]` asegura que el efecto solo se ejecute si la función `fetchAddresses` cambia. Dado que está memoizada y no tiene dependencias, esto solo ocurre en el montaje inicial.

## Dependencias

-   **`react`** (`useState`, `useEffect`, `useCallback`): Hooks fundamentales de React para el manejo de estado y efectos secundarios.
-   **`getSavedAddressesServices` (Servicio)**: La función de servicio que se encarga de la comunicación real con la API para obtener los datos de las direcciones.
-   **`SelectOptionSavedAddress` (Tipo)**: La interfaz de TypeScript que define la estructura de cada objeto en el array de direcciones, asegurando la consistencia de los datos.


-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


# Custom Hook: `useQuoteFormValidation`

El hook `useQuoteFormValidation` es una solución integral para gestionar el estado, la captura de datos y la validación de un formulario de cotización. Encapsula toda la lógica necesaria para que un componente de formulario pueda ser "controlado", reutilizable y fácil de mantener.

## Responsabilidades

-   **Gestión de Estado**: Mantiene el estado de todos los campos del formulario (`formData`).
-   **Manejo de Cambios**: Proporciona un manejador de eventos (`handleChange`) para actualizar el estado a medida que el usuario escribe.
-   **Validación**: Incluye una función (`validate`) que comprueba que todos los campos cumplan con las reglas de negocio.
-   **Gestión de Errores**: Mantiene un estado separado (`errors`) para los mensajes de error de validación por campo.
-   **Funcionalidad de Reseteo**: Ofrece una función (`resetForm`) para limpiar el formulario a su estado inicial.

## Parámetros

El hook puede recibir un parámetro opcional:

| Parámetro      | Tipo                     | Requerido | Descripción                                                                                                                              |
| -------------- | ------------------------ | --------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `initialData`  | `Partial<QuoteFormData>` | No        | Un objeto que contiene valores iniciales para los campos del formulario. Útil para pre-llenar el formulario o para editar una cotización existente. |

## Valores de Retorno

El hook retorna un objeto con un conjunto de estados y funciones para controlar el formulario:

| Nombre         | Tipo                                                            | Descripción                                                                                                                                         |
| -------------- | --------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `formData`     | `QuoteFormData`                                                 | **Estado**: El objeto que contiene los valores actuales de todos los campos del formulario. Se debe usar para enlazar el `value` de los inputs.      |
| `errors`       | `QuoteFormErrors`                                               | **Estado**: Un objeto donde las claves son los nombres de los campos y los valores son los mensajes de error. Útil para mostrar errores en la UI.    |
| `handleChange` | `(e: React.ChangeEvent<...>) => void`                           | **Función**: El manejador de eventos que se debe enlazar al prop `onChange` de los inputs. Actualiza `formData` y limpia el error del campo modificado. |
| `validate`     | `() => boolean`                                                 | **Función**: Ejecuta todas las reglas de validación. Actualiza el estado `errors` y **devuelve `true` si el formulario es válido**, o `false` si no lo es. |
| `resetForm`    | `() => void`                                                    | **Función**: Restablece `formData` y `errors` a sus estados iniciales.                                                                              |
| `setFormData`  | `React.Dispatch<React.SetStateAction<QuoteFormData>>`           | **Función**: La función `set` de `useState` para `formData`. Se expone para permitir modificaciones programáticas del estado del formulario desde fuera. |

## Uso

Este hook se utiliza dentro de un componente de formulario para gestionar toda su lógica.

```jsx
import React from 'react';
import { useQuoteFormValidation } from '../hooks/useQuoteFormValidation';

const QuoteFormComponent = ({ onFormSubmit }) => {
  // 1. Invocar el hook para obtener los controladores del formulario
  const { 
    formData, 
    errors, 
    handleChange, 
    validate, 
    resetForm 
  } = useQuoteFormValidation({
    // Opcional: pasar datos iniciales
    originCountry: "MX",
    destinationCountry: "MX",
  });

  // 2. Manejador para el envío del formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 3. Validar el formulario antes de enviarlo
    if (validate()) {
      console.log('Formulario válido, enviando datos:', formData);
      onFormSubmit(formData);
      resetForm(); // Opcional: limpiar el formulario después del envío
    } else {
      console.log('Formulario inválido, por favor revise los errores.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Código Postal de Origen</label>
        <input
          type="text"
          name="originPostalCode"
          value={formData.originPostalCode}
          onChange={handleChange}
        />
        {errors.originPostalCode && <span className="error">{errors.originPostalCode}</span>}
      </div>

      <div>
        <label>Peso (kg)</label>
        <input
          type="number"
          name="weight"
          value={formData.weight}
          onChange={handleChange}
        />
        {errors.weight && <span className="error">{errors.weight}</span>}
      </div>
      
      {/* ... resto de los campos del formulario ... */}
      
      <button type="submit">Cotizar</button>
      <button type="button" onClick={resetForm}>Limpiar</button>
    </form>
  );
};
```

## Lógica Interna y Comportamiento

-   **Patrón de Componente Controlado**: El hook implementa este patrón, donde el estado de React es la "única fuente de verdad" para los valores del formulario.
-   **Limpieza de Errores Dinámica**: La función `handleChange` está diseñada para mejorar la experiencia de usuario. Cuando un usuario empieza a corregir un campo, el mensaje de error asociado a ese campo se borra inmediatamente.
-   **Validación Sincrónica**: La función `validate` realiza todas las comprobaciones de forma síncrona y devuelve un booleano, facilitando su uso en condicionales dentro de los manejadores de eventos.
-   **Manejo de Tipos**: En `handleChange`, se convierte explícitamente el valor a número (`parseFloat`) si el tipo de input es `'number'`, asegurando la consistencia de tipos en el estado `formData`.

## Dependencias y Tipos

-   **`react`** (`useState`, `useCallback`, `useEffect`): Hooks fundamentales de React.
-   **`QuoteFormData` (Tipo)**: La interfaz de TypeScript que define la estructura de los datos del formulario.
-   **`QuoteFormErrors` (Tipo)**: Un tipo mapeado (`Mapped Type`) de TypeScript generado localmente, que crea un tipo para el objeto de errores donde cada propiedad de `QuoteFormData` es opcional y de tipo `string`.

    ```typescript
    export type QuoteFormErrors = {
        [K in keyof QuoteFormData]?: string;
    };
    ```


-------------------------------------------------------------------------------------------------------------------------------------------------

# Custom Hook: `useProductTypes`

El hook `useProductTypes` gestiona la lógica para obtener y filtrar una lista de tipos de producto (`ProductType`). Está diseñado para casos de uso donde se necesita cargar un conjunto completo de datos una sola vez y luego realizar búsquedas o filtrados rápidos del lado del cliente, como en un componente de autocompletado.

## Responsabilidades

-   **Carga Inicial**: Obtiene todos los tipos de producto de la API al inicializarse.
-   **Manejo de Carga**: Proporciona un estado `isLoading` para indicar cuándo se están obteniendo los datos iniciales.
-   **Filtrado en Cliente**: Ofrece una función para filtrar la lista de tipos de producto basándose en un término de búsqueda, sin realizar nuevas peticiones a la red.

## Uso

Este hook es ideal para componentes de UI que requieren una lista de opciones con funcionalidad de búsqueda, como un campo de texto con sugerencias de autocompletado.

```tsx
import React, { useState } from 'react';
import { useProductTypes } from '../hooks/useProductTypes';

const ProductAutocomplete = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // 1. Invocar el hook para obtener los datos y la lógica
  const { isLoading, filteredTypes, filterTypes } = useProductTypes();

  // 2. Manejar los cambios en el input de búsqueda
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchTerm(query);
    filterTypes(query); // Llama a la función de filtrado del hook
  };

  return (
    <div>
      <input
        type="text"
        value={searchTerm}
        onChange={handleInputChange}
        placeholder="Buscar tipo de producto..."
        disabled={isLoading} // Deshabilitar input mientras carga los datos iniciales
      />

      {isLoading && <p>Cargando tipos de producto...</p>}

      {/* Renderizar la lista de resultados filtrados */}
      {filteredTypes.length > 0 && (
        <ul>
          {filteredTypes.map(type => (
            <li key={type.id}>{type.name} ({type.productNumber})</li>
          ))}
        </ul>
      )}

      {/* Opcional: Mostrar mensaje si no hay resultados y no está cargando */}
      {!isLoading && searchTerm && filteredTypes.length === 0 && (
        <p>No se encontraron resultados.</p>
      )}
    </div>
  );
};
```

## Parámetros

El hook `useProductTypes` no acepta ningún parámetro en su invocación.
`useProductTypes()`

## Valores de Retorno

El hook retorna un objeto con los siguientes estados y funciones:

| Nombre          | Tipo                          | Descripción                                                                                                                                                       |
| --------------- | ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `isLoading`     | `boolean`                     | **Estado**: `true` únicamente durante la carga inicial de todos los tipos de producto. Una vez cargados, permanece en `false`, incluso durante las operaciones de filtrado. |
| `filteredTypes` | `ProductType[]`               | **Estado**: Un array que contiene los tipos de producto que coinciden con la última consulta de búsqueda. Inicialmente y si la búsqueda está vacía, es un array vacío. |
| `filterTypes`   | `(query: string) => void`     | **Función**: La función que se debe invocar para filtrar la lista. Recibe un string de búsqueda y actualiza el estado `filteredTypes` internamente.                |

## Lógica Interna y Flujo de Datos

1.  **Carga Inicial (`useEffect`)**:
    -   Al montar el componente que usa el hook, un `useEffect` se ejecuta una sola vez.
    -   Dentro de este efecto, se llama al servicio `getProductTypes()` para obtener la lista completa de tipos de producto.
    -   Mientras la petición está en curso, `isLoading` es `true`.
    -   Al recibir los datos, estos se almacenan en el estado interno `allTypes`. Este estado **no se expone directamente** al consumidor del hook, ya que es un detalle de implementación.
    -   Una vez que la petición finaliza (con éxito o error), `isLoading` se establece en `false`.

2.  **Filtrado (`filterTypes`)**:
    -   La función `filterTypes` está memoizada con `useCallback` y depende del estado `allTypes`.
    -   Cuando se la invoca con un término de búsqueda (`query`):
        -   Si la `query` está vacía, el estado `filteredTypes` se resetea a un array vacío para ocultar los resultados.
        -   Si hay una `query`, se realiza un filtrado del lado del cliente sobre el array `allTypes`. La búsqueda es *case-insensitive* y comprueba coincidencias en:
            -   El nombre del tipo de producto (`type.name`).
            -   El número de producto (`type.productNumber`).
            -   Cualquiera de las palabras clave asociadas (`type.keywords`).
        -   El resultado del filtro se guarda en el estado `filteredTypes`, lo que provoca un re-renderizado del componente consumidor para mostrar los nuevos resultados.


---------------------------------------------------------------------------------------------------------------------------------------------------

# Custom Hook: `useQuotes`

El hook `useQuotes` es una solución completa para gestionar el ciclo de vida de las cotizaciones de envíos. Encapsula toda la lógica de estado y las interacciones con los servicios para:

1.  **Crear** una nueva solicitud de cotización a partir de datos de un formulario.
2.  **Obtener** una lista de cotizaciones existentes.
3.  **Guardar** una cotización específica seleccionada por el usuario como un envío final.

Centraliza el manejo de múltiples estados de carga (para búsqueda y guardado), errores y mensajes de éxito.

## Uso

Este hook se utiliza en componentes contenedores que necesitan orquestar el proceso de cotización, como una página que contiene tanto el formulario de cotización como la tabla de resultados.

```tsx
import React from 'react';
import { QuoteForm } from './QuoteForm';
import { QuotesTable } from './QuotesTable';
import { useQuotes } from '../hooks/useQuotes';
import { QuoteFormData, Quote } from '../types';

const QuoteProcessComponent = () => {
  // 1. Invocar el hook para obtener acceso al estado y las funciones
  const {
    quotes,
    loading,
    error,
    fetchQuotes,
    saveSelectedQuote,
    isSavingSelectedQuote,
    saveSuccessSelectedQuote,
  } = useQuotes();

  // 2. Manejador para cuando el formulario de cotización se envía
  const handleSearchQuotes = (formData: QuoteFormData) => {
    fetchQuotes(formData);
  };

  // 3. Manejador para cuando el usuario selecciona una cotización para guardarla
  const handleSaveQuote = (selectedQuote: Quote) => {
    saveSelectedQuote(selectedQuote);
  };

  // El componente se re-renderiza cuando `loading`, `error`, `isSaving`, etc. cambian,
  // y en ese momento lee el valor más reciente de `quotes`.
  return (
    <div>
      <h1>Realizar una Cotización</h1>
      <QuoteForm onSubmit={handleSearchQuotes} isLoading={loading} />

      {error && <p className="error-message">{error}</p>}
      
      {saveSuccessSelectedQuote && <p className="success-message">{saveSuccessSelectedQuote}</p>}

      <QuotesTable
        quotesData={quotes}
        isLoading={loading}
        onSelectAndSave={handleSaveQuote}
        isSavingQuoteId={isSavingSelectedQuote ? someId : null} // Lógica para mostrar spinner en una fila
      />
    </div>
  );
};
```

## Parámetros

El hook `useQuotes` no acepta ningún parámetro en su invocación.
`useQuotes()`

## Valores de Retorno

El hook retorna un objeto con el siguiente conjunto de estados y funciones:

| Nombre                   | Tipo                                  | Descripción                                                                                                                                                                                            |
| ------------------------ | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `quotes`                 | `Quote[]`                             | **Dato (de Ref)**: El array de cotizaciones resultante de la última petición. **Importante:** Este valor proviene de un `useRef`, por lo que su actualización no dispara un re-render por sí misma.       |
| `loading`                | `boolean`                             | **Estado**: `true` mientras se está creando o buscando una cotización (`fetchQuotes` o `getQuotes`).                                                                                                   |
| `error`                  | `string | null`                        | **Estado**: Contiene un mensaje de error si alguna de las operaciones asíncronas falla.                                                                                                                |
| `fetchQuotes`            | `(formData: Partial<QuoteFormData>) => Promise<void>` | **Función**: Inicia una **nueva** solicitud de cotización. Recibe los datos del formulario y llama al servicio `createQuoteRequestServices`.                                                   |
| `saveSelectedQuote`      | `(quote: Quote) => Promise<void>`     | **Función**: Guarda una cotización específica seleccionada por el usuario. Llama al servicio `saveFinalShipmentServices`.                                                                                |
| `isSavingSelectedQuote`  | `boolean`                             | **Estado**: `true` **únicamente** mientras la operación de guardado (`saveSelectedQuote`) está en progreso. Es un estado de carga separado de `loading`.                                                |
| `saveSuccessSelectedQuote` | `string | null`                        | **Estado**: Contiene un mensaje de éxito si la operación de guardado fue exitosa.                                                                                                                      |
| `getQuotes`              | `() => Promise<void>`                 | **Función**: Obtiene una lista de cotizaciones ya existentes o predeterminadas, sin necesidad de datos de un formulario. Llama a `getQuotesServices`.                                                  |

## Lógica Interna y Comportamiento Clave

### Manejo de `quotes` con `useRef` (Consideración Importante)

A diferencia de otros estados, la lista de `quotes` se almacena en un `useRef` en lugar de un `useState`. Esto tiene una consecuencia clave:
-   **La actualización de `quotesRef.current` no causa un re-renderizado del componente que usa el hook.**

Este patrón se utiliza a menudo como una optimización. El re-renderizado se delega a los cambios en otros estados como `loading` y `error`. El flujo es el siguiente:
1.  Se llama a `fetchQuotes`.
2.  `setLoading(true)` se ejecuta. Esto **dispara un re-render**, y el componente muestra un spinner.
3.  La petición a la API finaliza.
4.  `quotesRef.current` se actualiza con los nuevos datos (esto no causa un re-render).
5.  `setLoading(false)` se ejecuta. Esto **dispara otro re-render**.
6.  Durante este segundo re-render, el componente lee el valor actualizado de `quotesRef.current` (`quotes`) y muestra los nuevos datos.

### Flujo de las Funciones Asíncronas

Todas las funciones asíncronas (`fetchQuotes`, `getQuotes`, `saveSelectedQuote`) siguen un patrón robusto de manejo de estado:
1.  **Inicio**: Se activa el estado de carga correspondiente (`setLoading(true)` o `setIsSaving(true)`). Se limpian los estados de error y éxito anteriores.
2.  **Ejecución**: Se envuelve la llamada al servicio en un bloque `try/catch`.
3.  **Éxito (`try`)**: Si la promesa del servicio se resuelve, se actualiza el estado correspondiente (`quotesRef.current` o `setSaveSuccess`).
4.  **Fallo (`catch`)**: Si la promesa es rechazada, se captura el error, se formatea un mensaje legible y se actualiza el estado de `error`.
5.  **Finalización (`finally`)**: Independientemente del resultado, se desactiva el estado de carga correspondiente (`setLoading(false)` o `setIsSaving(false)`). Esto asegura que la UI nunca se quede "congelada" en un estado de carga.

## Dependencias

-   **`react`** (`useRef`, `useState`, `useCallback`): Funciones base de React para manejar estado, referencias y memoización.
-   **Servicios (`quoteService`)**:
    -   `createQuoteRequestServices`: Para crear nuevas cotizaciones.
    -   `getQuotesServices`: Para obtener cotizaciones existentes.
    -   `saveFinalShipmentServices`: Para guardar una cotización como un envío final.
-   **Tipos (`types`)**:
    -   `Quote`: Define la estructura de un objeto de cotización.
    -   `QuoteFormData`: Define la estructura de los datos del formulario de cotización.


-------------------------------------------------------------------------------------------------------------------------

# `useStepOne`

El hook personalizado `useStepOne` gestiona el **estado** y la **validación** de los formularios de dirección para dos entidades:

- **Remitente**
- **Destinatario**

Está diseñado para ser utilizado en componentes como `StepOne`, que renderizan formularios reutilizables (`AddressForm`) con lógica compartida.

## 🧠 Características principales

- Manejo centralizado del estado del formulario
- Validación dinámica para múltiples entidades
- Reutilización de lógica entre componentes

## 🧩 Uso recomendado

Este hook es ideal para flujos de formularios que requieren consistencia entre múltiples instancias, como en procesos de envío o registro de direcciones.

## 🔧 Importaciones necesarias

```ts
import { useState } from 'react';
import { AddressFormData, AddressFormErrors } from '../types';
```
### 🧾 Tipos utilizados

- **`AddressFormData`**: Tipo que define la estructura de los datos del formulario.
- **`AddressFormErrors`**: Tipo que define los posibles errores de validación por campo.


## 🏁 Estado inicial del formulario

```ts
const initialAddressState: AddressFormData = { ... };
```

## 🗂️ Estados internos

```ts
const [remitterData, setRemitterData] = useState<AddressFormData>(initialAddressState);
const [addresseeData, setAddresseeData] = useState<AddressFormData>(initialAddressState);

const [remitterErrors, setRemitterErrors] = useState<AddressFormErrors>({});
const [addresseeErrors, setAddresseeErrors] = useState<AddressFormErrors>({});
```

- **`remitterData` / `addresseeData`**: Contienen los datos del formulario para cada tipo de entidad (remitente y destinatario).
- **`remitterErrors` / `addresseeErrors`**: Almacenan los errores de validación por campo correspondientes a cada formulario.


## ✅ Función de validación
```ts
const validateFormStepOne = (data: AddressFormData): AddressFormErrors => { ... }
```
### 🧪 Lógica de validación

La función de validación se encarga de:

- Verificar que los **campos obligatorios** estén completos.
- Validar el **formato del correo electrónico**.
- Si `showAliasField` está activo, también valida el campo `alias`.

### 📋 Campos validados

- `streetAndNumber`
- `neighborhood`
- `postalCode`
- `city`
- `state`
- `country`
- `reference`
- `fullName`
- `interiorNumber`
- `company`
- `phone`
- `email`
- `alias` *(solo si `showAliasField` está activo)*

## ✍️ Manejo de cambios en inputs
```ts
const handleInputChange = (
  formType: 'remitter' | 'addressee',
  event: { target: { name: string; value: string | boolean } }
) => { ... }
```
## 🔄 Actualización de estado

Esta función actualiza el estado correspondiente (`remitterData` o `addresseeData`) según el tipo de formulario que se esté manipulando.

Se utiliza para manejar cambios en:

- Campos de texto
- Campos de teléfono
- Toggles (interruptores booleanos)

Esto permite mantener sincronizados los datos del formulario en tiempo real mientras el usuario interactúa con los campos.


## Valores retornados

```ts
return {
  remitterData,
  addresseeData,
  remitterErrors,
  addresseeErrors,
  handleInputChange,
  validateFormStepOne,
  setRemitterErrors,
  setAddresseeErrors,
  clearForm
};
```
Estos valores se pasan como props al componente StepOne, que a su vez los distribuye a los formularios `AddressForm`.

# 🧠 Custom Hook `useStepThree`

## 🧾 Retorno

| Propiedad                | Tipo                                                   | Descripción                                      |
|--------------------------|--------------------------------------------------------|--------------------------------------------------|
| `loading`                | `boolean`                                              | Estado de carga de las cotizaciones              |
| `filteredAndSortedOptions` | `ShippingOption[]`                                   | Opciones filtradas y ordenadas                   |
| `selectedOption`         | `ShippingOption \| undefined`                          | Opción seleccionada                              |
| `selectedOptionId`       | `string \| null`                                       | ID de la opción seleccionada                     |
| `handleSelectOption`     | `(id: string) => void`                                 | Selecciona una opción                            |
| `handleSort`             | `(key: "estimatedDelivery" \| "price") => void`        | Ordena por clave                                 |
| `sortConfig`             | `SortConfig`                                           | Configuración de ordenamiento                    |
| `isAccordionOpen`        | `boolean`                                              | Estado del acordeón                              |
| `setIsAccordionOpen`     | `Dispatch<SetStateAction<boolean>>`                   | Cambia el estado del acordeón                    |
| `isFilterOpen`           | `boolean`                                              | Estado del filtro                                |
| `setIsFilterOpen`        | `Dispatch<SetStateAction<boolean>>`                   | Cambia el estado del filtro                      |
| `availableCarriers`      | `string[]`                                             | Paqueterías disponibles                          |
| `selectedCarriers`       | `string[]`                                             | Paqueterías seleccionadas                        |
| `setSelectedCarriers`    | `Dispatch<SetStateAction<string[]>>`                  | Actualiza el filtro de paqueterías               |
| `isPawSafeActive`        | `boolean`                                              | Estado del seguro PawSafe                        |
| `handlePawSafeToggle`    | `(isActive: boolean) => void`                          | Activa/desactiva PawSafe                         |
| `declaredValue`          | `string`                                               | Valor declarado del paquete                      |
| `setDeclaredValue`       | `Dispatch<SetStateAction<string>>`                    | Actualiza el valor declarado                     |
| `total`                  | `number`                                               | Total calculado (envío + PawSafe)                |
| `errors`                 | `StepThreeErrors`                                      | Errores de validación                            |
| `validateStep`           | `() => boolean`                                        | Ejecuta validación de la etapa                   |

---

## ⚙️ Estado Interno

```ts
const [selectedOptionId, setSelectedOptionId] = useState<string | null>('2');
const [isAccordionOpen, setIsAccordionOpen] = useState(false);
const [isPawSafeActive, setIsPawSafeActive] = useState(false);
const [declaredValue, setDeclaredValue] = useState('');
const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: 'asc' });
const [isFilterOpen, setIsFilterOpen] = useState(false);
const [errors, setErrors] = useState<StepThreeErrors>({});
```
## 🧩 Derivaciones con useMemo
```ts
const shippingOptionsData = useMemo(() => { ... }, [quotes]);
const availableCarriers = useMemo(() => { ... }, [shippingOptionsData]);
const filteredAndSortedOptions = useMemo(() => { ... }, [sortConfig, selectedCarriers, availableCarriers.length, quotes, shippingOptionsData]);
const selectedOption = useMemo(() => { ... }, [selectedOptionId, shippingOptionsData]);
const pawSafeCost = useMemo(() => { ... }, [isPawSafeActive, declaredValue]);
const total = (selectedOption?.price || 0) + pawSafeCost;
```

## ✅ Validación
```ts
const validateStep = (): boolean => {
  const newErrors: StepThreeErrors = {};
  if (!selectedOptionId) {
    newErrors.selectedOption = 'Debes seleccionar una opción de paquetería.';
  }
  if (isPawSafeActive) {
    const numericValue = parseFloat(declaredValue);
    if (declaredValue.trim() === '') {
      newErrors.declaredValue = 'El valor declarado es requerido.';
    } else if (isNaN(numericValue)) {
      newErrors.declaredValue = 'Debe ser un número válido.';
    } else if (numericValue < 100 || numericValue > 100000) {
      newErrors.declaredValue = 'El valor debe estar entre $100 y $100,000.';
    }
  }
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};
```

## 📌 Acciones
```ts
const handleSort = (key: 'estimatedDelivery' | 'price') => { ... };
const handleSelectOption = (id: string) => { ... };
const handlePawSafeToggle = (isActive: boolean) => { ... };
```

# 📘 Hook `useStepTwo`

Este hook gestiona el **estado**, la **validación** y las **operaciones** de una colección de paquetes (`Package`) y sus respectivos productos (`Product`).

Se utiliza en la **segunda etapa** del formulario pasos, permitiendo al usuario:

- Agregar paquetes y productos
- Editar información existente
- Duplicar elementos
- Limpiar formularios
- Eliminar paquetes o productos

Este enfoque dinámico facilita la gestión modular y escalable de múltiples unidades dentro de un flujo de trabajo interactivo.

## 🧱 Estructura del Estado

```ts
const [packages, setPackages] = useState<Package[]>(initialPackages);
const [errors, setErrors] = useState<PackageFormErrors[]>([]);
```
- **`packages`**: Lista de paquetes activos en el formulario. Cada paquete puede contener múltiples productos.
- **`errors`**: Lista de errores asociados a cada paquete, incluyendo errores específicos por producto.


## 🧪 Validación

### 🔍 `validateProduct(product: Product): ProductFormErrors`

Valida los campos de un **producto individual**:

- `name`: requerido
- `price`: debe ser mayor a 0
- `quantity`: debe ser mayor a 0
- `sku`: requerido

---

### 📦 `validatePackage(pkg: Package): PackageFormErrors`

Valida los campos de un **paquete**:

- `packagingType`, `length`, `width`, `height`, `weight`, `productType`: requeridos
- `alias`: requerido **solo si** `saveToList` es `true`
- Además, valida cada producto dentro del paquete usando `validateProduct`

---

### 🧮 `validateStep(): boolean`

- Ejecuta la validación de **todos los paquetes**
- Actualiza el estado de errores (`errors`)
- Retorna `true` si **todos los paquetes y productos** están válidos

## 🧠 Inicialización

```ts
useEffect(() => {
  if (packages.length === 0) {
    setPackages([createNewPackage()]);
  }
}, []);
```
 

# Hook `useOrders`

## Resumen

El hook `useOrders` es un hook personalizado de React diseñado para encapsular toda la lógica relacionada con la obtención, filtrado y paginación de una lista de envíos de pedidos (`shipments`).

Abstrae el manejo de estados como la carga (`isLoading`), los errores (`error`), los datos de paginación y los filtros aplicados, proporcionando una interfaz limpia y reutilizable para cualquier componente que necesite mostrar y gestionar esta información.

## Características Principales

-   **Obtención de Datos**: Se conecta con un `OrderService` para buscar los envíos.
-   **Gestión de Estado**: Maneja internamente los estados de carga, error y los datos recibidos.
-   **Filtrado**: Permite filtrar los resultados mediante un objeto de filtros configurable.
-   **Paginación**: Gestiona la paginación de los resultados, incluyendo el número de página actual, el total de páginas y el tamaño de la página.
-   **Reactividad**: Re-lanza automáticamente la petición a la API cuando los filtros o el tamaño de la página cambian.

---

## Uso Básico

A continuación se muestra un ejemplo de cómo implementar el hook `useOrders` en un componente de React.

```tsx
import React from 'react';
import { useOrders } from './useOrders';

const OrdersComponent = () => {
    const {
        shipments,
        isLoading,
        error,
        paginationInfo,
        filters,
        setFilters,
        goToPage,
        refreshOrders
    } = useOrders();

    if (isLoading) {
        return <div>Cargando pedidos...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h1>Lista de Envíos</h1>

            {/* Aquí irían los componentes de filtro que usan 'filters' y 'setFilters' */}

            <ul>
                {shipments.map(shipment => (
                    <li key={shipment.id}>{/* Renderizar datos del envío */}</li>
                ))}
            </ul>

            {/* Aquí irían los componentes de paginación que usan 'paginationInfo' y 'goToPage' */}
            <div>
                Página {paginationInfo.currentPage} de {paginationInfo.totalPages}
                <button
                    onClick={() => goToPage(paginationInfo.currentPage - 1)}
                    disabled={paginationInfo.currentPage <= 1}
                >
                    Anterior
                </button>
                <button
                    onClick={() => goToPage(paginationInfo.currentPage + 1)}
                    disabled={paginationInfo.currentPage >= paginationInfo.totalPages}
                >
                    Siguiente
                </button>
            </div>
        </div>
    );
};

export default OrdersComponent;
```

# Hook `usePickups`

## Resumen

El hook `usePickups` es un hook personalizado de React análogo a `useOrders`, pero enfocado en la gestión de recogidas de pedidos (`pickups`). Su propósito es encapsular toda la lógica para obtener, filtrar y paginar una lista de recogidas.

Este hook abstrae el manejo de estados complejos como la carga (`isLoading`), los errores (`error`), la información de paginación y los filtros, ofreciendo una API sencilla y reutilizable para los componentes que necesiten interactuar con datos de recogidas.

## Características Principales

-   **Obtención de Datos**: Utiliza `OrderService` para buscar las recogidas de pedidos.
-   **Gestión de Estado**: Administra internamente los estados de carga, error y los datos de las recogidas.
-   **Filtrado**: Proporciona una interfaz para filtrar los resultados a través de un objeto de filtros.
-   **Paginación**: Maneja la paginación de los resultados, incluyendo página actual, total de páginas y tamaño de página.
-   **Reactividad**: Vuelve a solicitar los datos automáticamente cuando los filtros o el tamaño de la página son modificados.

---

## Uso Básico

A continuación, un ejemplo de cómo implementar el hook `usePickups` en un componente de React.

```tsx
import React from 'react';
import { usePickups } from './usePickups';

const PickupsComponent = () => {
    const {
        pickup,
        isLoading,
        error,
        paginationInfo,
        filters,
        setFilters,
        goToPage,
        refreshOrders
    } = usePickups();

    if (isLoading) {
        return <div>Cargando recogidas...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h1>Lista de Recogidas</h1>

            {/* Aquí irían los componentes de filtro que usan 'filters' y 'setFilters' */}

            <ul>
                {pickup.map(item => (
                    <li key={item.id}>{/* Renderizar datos de la recogida */}</li>
                ))}
            </ul>

            {/* Aquí irían los componentes de paginación que usan 'paginationInfo' y 'goToPage' */}
            <div>
                Página {paginationInfo.currentPage} de {paginationInfo.totalPages}
                <button
                    onClick={() => goToPage(paginationInfo.currentPage - 1)}
                    disabled={paginationInfo.currentPage <= 1}
                >
                    Anterior
                </button>
                <button
                    onClick={() => goToPage(paginationInfo.currentPage + 1)}
                    disabled={paginationInfo.currentPage >= paginationInfo.totalPages}
                >
                    Siguiente
                </button>
            </div>
        </div>
    );
};

export default PickupsComponent;
```



# Documentación del Custom Hook `useStripePayment`

## Índice
1. [Descripción General](#descripción-general)
2. [Responsabilidades Clave](#responsabilidades-clave)
3. [Estructura y Dependencias](#estructura-y-dependencias)
    - [Hooks de Stripe](#hooks-de-stripe)
    - [Servicios](#servicios)
4. [Parámetros y Retorno](#parámetros-y-retorno)
    - [Función `handlePayment`](#función-handlepayment)
    - [Valores de Retorno del Hook](#valores-de-retorno-del-hook)
5. [Flujo de Funcionamiento](#flujo-de-funcionamiento)
6. [Ejemplo de Uso](#ejemplo-de-uso)

---

### Descripción General

`useStripePayment` es un custom hook de React diseñado para encapsular y gestionar toda la lógica compleja del proceso de pago con tarjeta de crédito utilizando Stripe. Su propósito es abstraer la comunicación con el backend (para crear un `PaymentIntent`) y con el frontend de Stripe (para confirmar el pago), proporcionando una interfaz simple y reutilizable para cualquier componente de formulario de pago.

Al centralizar esta lógica, se logra una clara separación de responsabilidades: el componente se encarga de la UI y la captura de datos, mientras que el hook se encarga del "trabajo sucio" del procesamiento del pago.

### Responsabilidades Clave

- **Orquestación del Flujo de Pago:** Coordina la secuencia de llamadas a la API:
    1. Llama al servicio del backend para crear un `PaymentIntent`.
    2. Usa el `clientSecret` recibido para confirmar el pago del lado del cliente con Stripe.js.
- **Gestión de Estado:** Maneja los estados cruciales del proceso de pago:
    - `isProcessing`: Un booleano que indica si una transacción está en curso. Ideal para deshabilitar botones y mostrar indicadores de carga.
    - `errorMessage`: Un string que almacena cualquier mensaje de error ocurrido durante el proceso, ya sea desde el backend o desde Stripe.
- **Abstracción de Stripe.js:** Oculta los detalles de bajo nivel de la interacción con los hooks `useStripe` y `useElements`.
- **Manejo de Errores:** Captura y gestiona errores de manera centralizada, ya sean fallos de red al contactar el backend, errores de validación de tarjeta devueltos por Stripe (ej. fondos insuficientes), o cualquier otra excepción.
- **Interfaz Sencilla:** Expone una única función asíncrona, `handlePayment`, que recibe los datos necesarios y devuelve un resultado claro y predecible (`{ success: boolean, ... }`).

### Estructura y Dependencias

#### Hooks de Stripe

- **`useStripe()`**: Provee la instancia de `stripe`, el objeto principal para interactuar con la API de Stripe.js (ej. `stripe.confirmCardPayment`).
- **`useElements()`**: Provee acceso a los componentes de Stripe Elements montados en el DOM (ej. `elements.getElement(CardNumberElement)`), permitiendo al hook obtener los datos de la tarjeta de forma segura.

#### Servicios

- **`PaymentService`**: Un módulo de servicio que encapsula la llamada `fetch` o `axios` al endpoint del backend (`/api/create-payment-intent`). El hook depende de este servicio para obtener el `clientSecret` necesario para confirmar el pago.

### Parámetros y Retorno

#### Función `handlePayment`

La función principal expuesta por el hook. Es una función asíncrona que debe ser llamada por el componente cuando el usuario envía el formulario de pago.

- **Argumentos:** Acepta un único objeto con las siguientes propiedades:
    - `paymentPayload` (`IPayloadCreatePaymentIntent`): Un objeto con los datos de la orden (`orderUid`, `amount`, `currency`, `customerEmail`) que se enviarán al backend.
    - `cardholderName` (`string`): El nombre completo del titular de la tarjeta.

- **Retorno:** Devuelve una `Promise` que se resuelve en un objeto con la siguiente estructura:
    - `success` (`boolean`): `true` si el pago fue exitoso (`succeeded`), `false` en cualquier otro caso.
    - `paymentIntent` (`PaymentIntent`, opcional): El objeto `PaymentIntent` completo devuelto por Stripe si el pago fue exitoso.

#### Valores de Retorno del Hook

El hook `useStripePayment` devuelve un objeto con tres propiedades:

| Propiedad      | Tipo                                                                             | Descripción                                                                                              |
|----------------|----------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------|
| `isProcessing` | `boolean`                                                                        | `true` mientras la operación de pago está en curso. `false` de lo contrario.                              |
| `errorMessage` | `string \| null`                                                                 | Contiene el mensaje del último error ocurrido. Es `null` si no hay errores o al iniciar una nueva transacción. |
| `handlePayment`| `(args: HandlePaymentArgs) => Promise<{ success: boolean; paymentIntent?: PaymentIntent }>` | La función que inicia el proceso de pago.                                                                |

### Flujo de Funcionamiento

Cuando un componente llama a `handlePayment`, el hook ejecuta los siguientes pasos en orden:

1.  **Validación Inicial:** Comprueba si `stripe` y `elements` están cargados. Si no, establece un error y retorna `{ success: false }`.
2.  **Obtención del Elemento:** Busca el `CardNumberElement` en el DOM. Si no lo encuentra, establece un error y retorna.
3.  **Inicio del Proceso:** Establece `isProcessing` a `true` y `errorMessage` a `null` para limpiar el estado anterior.
4.  **Llamada al Backend:** Ejecuta `PaymentService.createPaymentIntent(paymentPayload)`.
    - Si esta llamada falla (ej. error de red), el `catch` captura la excepción, establece `errorMessage`, y retorna `{ success: false }`.
5.  **Confirmación con Stripe:** Si la llamada al backend es exitosa, extrae el `clientSecret` de la respuesta. Llama a `stripe.confirmCardPayment(clientSecret, ...)` con los datos de la tarjeta y el nombre del titular.
6.  **Manejo del Resultado de Stripe:**
    - Si `confirmCardPayment` devuelve un `error` (ej. tarjeta rechazada), el hook establece `errorMessage` con el mensaje de Stripe y retorna `{ success: false }`.
    - Si no hay error, comprueba el `paymentIntent.status`.
    - Si el estado es `'succeeded'`, retorna `{ success: true, paymentIntent }`.
    - Si el estado es cualquier otro (ej. `'requires_action'`), lo considera un fallo, establece un mensaje de error descriptivo y retorna `{ success: false }`.
7.  **Finalización:** En el bloque `finally`, sin importar el resultado, establece `isProcessing` a `false`.

### Ejemplo de Uso

Este hook está diseñado para ser usado dentro de un componente de formulario que esté envuelto por el proveedor `<Elements>` de Stripe.

```jsx
// En un componente como StripePaymentForm.tsx

import React, { useState } from 'react';
import { CardNumberElement } from '@stripe/react-stripe-js';
import { useStripePayment } from './useStripePayment'; // Importar el hook

const MyPaymentForm = ({ paymentPayload }) => {
    // Usar el hook para obtener el estado y la función de manejo
    const { isProcessing, errorMessage, handlePayment } = useStripePayment();
    const [name, setName] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        // Llamar a la función del hook con los datos necesarios
        const result = await handlePayment({
            paymentPayload,
            cardholderName: name
        });
        
        if (result.success) {
            console.log("¡Pago exitoso!", result.paymentIntent);
            // Aquí se podría cambiar la vista a una de éxito
        } else {
            console.error("El pago falló.");
            // El `errorMessage` ya estará actualizado y se puede mostrar en la UI
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="Nombre del titular"
            />
            
            {/* Componente seguro de Stripe */}
            <CardNumberElement />
            
            {/* Mostrar el mensaje de error si existe */}
            {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
            
            <button type="submit" disabled={isProcessing}>
                {isProcessing ? 'Procesando...' : 'Pagar'}
            </button>
        </form>
    );
};
```