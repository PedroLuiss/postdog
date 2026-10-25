### `<QuoteForm />`

**Propósito:**  
Componente de formulario que permite al usuario ingresar los datos necesarios para una cotización: origen, destino, dimensiones y peso del paquete.

**Proceso Clave:**

- Utiliza la librería `react-hook-form` para la gestión del estado del formulario y `zod` para la validación de los datos.
- Recibe una función `onSubmit` por props, la cual se ejecuta cuando el formulario es enviado exitosamente tras pasar las validaciones.
- Muestra un resumen de los pesos (masa, volumétrico y a cotizar) para informar al usuario.
- Incluye botones para **Cotizar** (enviar el formulario) y **Reiniciar** (limpiar los campos a sus valores por defecto).

**Cómo Importar y Renderizar:**

```tsx
// Dentro de un componente padre como QuotePage.tsx
import { QuoteForm } from '../../components/Quote/Form/QuoteForm';
import { QuoteFormData } from '../../utils/shemas';

const initialData = { weight: 5, length: 20 };

const handleFormSubmit = (data: QuoteFormData) => {
  console.log('Formulario enviado:', data);
  // Lógica para llamar a la API
};

<QuoteForm onSubmit={handleFormSubmit} initialData={initialData} />

```
**API de Props:**

| Nombre       | Tipo                              | Requerido | Descripción                                                                                     |
|--------------|-----------------------------------|-----------|-------------------------------------------------------------------------------------------------|
| `onSubmit`   | `(data: QuoteFormData) => void`   | Sí        | Función callback que se ejecuta con los datos del formulario cuando este es enviado y validado. |
| `initialData`| `Partial<QuoteFormData>`          | No        | Objeto con valores iniciales para pre-rellenar los campos del formulario.                       |


###  `<TablaQuote />`

**Propósito:**  
Muestra los resultados de la cotización en una tabla interactiva. Permite al usuario ordenar por precio o tiempo de entrega y filtrar por paquetería.

**Proceso Clave:**

- Recibe los resultados (`quotesData`) y el estado de carga (`loading`) como props.

**Renderizado Condicional:**

- Si `loading` es `true`, muestra un componente `SkeletonLoader`.
- Si `quotesData` está vacío y `loading` es `false`, muestra un mensaje de "estado vacío" o "sin resultados".
- Si hay datos, renderiza la tabla.

**Interactividad:**

- **Ordenamiento:** Los encabezados **Entrega estimada** y **Precio estimado** son clickeables y ordenan la tabla de forma ascendente/descendente.
- **Filtrado:** Un ícono de embudo (`<FunnelIcon />`) abre un tooltip para seleccionar/deseleccionar paqueterías.
- Cada fila contiene un botón de acción (`<MakeShipmentActions />`) para que el usuario proceda a realizar el envío con la cotización seleccionada.

**Cómo Importar y Renderizar:**

```tsx
// Dentro de un componente padre como QuotePage.tsx
import { TablaQuote } from '../../components/Quote/Tabla/TablaQuote';
import { Quote } from '../../types';

const isLoading = false;
const results: Quote[] = [
  // ...array de objetos de cotización
];

<TablaQuote loading={isLoading} quotesData={results} />
```
**API de Props:**

| Nombre      | Tipo       | Requerido | Descripción                                                                 |
|-------------|------------|-----------|------------------------------------------------------------------------------|
| `quotesData`| `Quote[]`  | Sí        | Array de objetos de cotización para mostrar en la tabla.                    |
| `loading`   | `boolean`  | No        | Si es `true`, la tabla mostrará un esqueleto de carga. Por defecto es `false`. |



 ### Componente: `TablaQuote`

##  Propósito

El componente `<TablaQuote />` es el responsable principal de mostrar los resultados de una cotización de envío en una tabla interactiva y rica en funcionalidades. Su objetivo es permitir al usuario comparar, filtrar y ordenar las diferentes opciones de paquetería para poder tomar una decisión informada.

## Características y Procesos Clave

Este componente gestiona tanto la presentación de datos como su propia interactividad a través de estado interno.

#### **Renderizado Condicional**

El componente maneja tres estados de renderizado principales:

1.  **Estado de Carga (`loading`):** Cuando la prop `loading` es `true`, el componente renderiza un `<SkeletonLoader />` para indicar al usuario que los datos se están cargando. Esto mejora la experiencia de usuario al proporcionar feedback visual inmediato.
2.  **Estado Vacío:** Si `loading` es `false` y el array `quotesData` está vacío, se muestra una vista amigable que informa al usuario que no hay resultados, animándolo a realizar una cotización.
3.  **Estado con Datos:** Si hay datos disponibles, se renderiza la tabla completa con todas sus funcionalidades.

#### **Estado Interno y Interactividad**

`TablaQuote` encapsula la lógica para que el usuario pueda manipular los datos presentados:

*   **Ordenamiento (`sortConfig`):**
    *   Mantiene un estado interno para saber por qué columna (`deliveryEstimateDays` o `price`) y en qué dirección (`ascending` o `descending`) se deben ordenar los datos.
    *   La función `requestSort` se ejecuta al hacer clic en los encabezados de columna correspondientes, actualizando el estado de ordenamiento.
    *   `getSortIcon` muestra el ícono adecuado (flecha arriba, abajo o de intercambio) según la configuración de ordenamiento actual.

*   **Filtrado (`selectedCouriers`):**
    *   Calcula la lista de paqueterías únicas (`availableCouriers`) a partir de los datos recibidos.
    *   Mantiene un estado con las paqueterías que el usuario ha seleccionado para mostrar.
    *   Al hacer clic en el ícono de embudo, se renderiza el componente `<FilterTooltip />`, que se encarga de la UI del filtrado y comunica los cambios de selección de vuelta a `TablaQuote`.

#### **Procesamiento de Datos**

Utiliza `useMemo` para optimizar el rendimiento. La variable `filteredAndSortedQuotes` se recalcula solo cuando los datos originales, la configuración de ordenamiento o la selección de filtros cambian. Este array procesado es el que finalmente se mapea para renderizar las filas de la tabla.

#### **Composición de Componentes**

`TablaQuote` actúa como un orquestador para varios componentes de UI más pequeños, delegando responsabilidades:

*   `<ImageWithFallback />`: Para mostrar los logos de las paqueterías de forma segura.
*   `<CustomTooltip />`: Para mostrar información adicional en los encabezados.
*   `<FilterTooltip />`: Para manejar la UI y lógica del filtrado.
*   `<MakeShipmentActions />`: Para encapsular la lógica del botón de acción en cada fila.


