
# `HttpService`

## Resumen

Este módulo proporciona un servicio genérico y centralizado para gestionar todas las comunicaciones HTTP con la API de la aplicación, utilizando la librería `axios`.

Su propósito es encapsular la configuración de `axios`, automatizar tareas repetitivas como la inyección de tokens de autenticación, y centralizar el manejo de respuestas y errores comunes (como la expiración de sesión), ofreciendo una interfaz simple y reutilizable para el resto de la aplicación.

## Características Principales

-   **Instancia Centralizada**: Crea una única instancia de `axios` (`apiClient`) con una configuración base (URL de la API, cabeceras).
-   **Inyección Automática de Token**: Utiliza un interceptor de peticiones para añadir automáticamente el `Bearer Token` de autenticación a cada solicitud saliente.
-   **Manejo Global de Errores**: Emplea un interceptor de respuestas para gestionar errores globales, especialmente el código de estado `401` (No Autorizado), que indica una sesión expirada.
-   **Métodos Simplificados**: Exporta un objeto `HttpService` con métodos (`get`, `post`, `put`, `delete`) que abstraen la complejidad de `axios` y devuelven directamente los datos (`data`) de la respuesta.

---

## Configuración Principal

-   **`API_BASE_URL`**: Se obtiene de una variable de entorno `process.env.REACT_APP_API_BASE_URL`. Si no está definida, utiliza `http://localhost:3005/` como valor por defecto.

---

## Instancia de Axios (`apiClient`)

Es una instancia pre-configurada de `axios` con las siguientes propiedades:

-   `baseURL`: Establecida con el valor de `API_BASE_URL`. Todas las peticiones relativas (ej. `/users`) se harán a esta URL base.
-   `headers`: Establece por defecto el `Content-Type` a `application/json`.

---

## Interceptores

Los interceptores son funciones que `axios` ejecuta para cada petición o respuesta.

### 1. Interceptor de Peticiones (Request)

-   **Propósito**: Añadir el token de autenticación a las cabeceras de cada petición.
-   **Flujo**:
    1.  Se ejecuta **antes** de que cada petición sea enviada al servidor.
    2.  Intenta leer los datos del usuario desde el `localStorage`.
    3.  Si encuentra un objeto de usuario con una propiedad `access_token`, lo añade a la cabecera `Authorization` de la petición con el formato `Bearer <token>`.
    4.  Si no hay usuario o token, la petición continúa sin la cabecera de autorización.
    5.  Devuelve el objeto de configuración modificado para que `axios` continúe con el envío.

### 2. Interceptor de Respuestas (Response)

-   **Propósito**: Manejar centralizadamente las respuestas de la API, especialmente los errores.
-   **Flujo**:
    1.  Se ejecuta **después** de recibir una respuesta del servidor, pero **antes** de que la promesa de la petición se resuelva.
    2.  **Caso de Éxito**: Si la respuesta es exitosa (código 2xx), simplemente la devuelve sin modificarla.
    3.  **Caso de Error**:
        -   Si el error contiene una respuesta del servidor (`error.response`) con un código de estado `401` (No Autorizado), significa que el token es inválido o la sesión ha expirado.
        -   En este caso, imprime un mensaje de error en la consola. (Nota: La lógica para desloguear al usuario está comentada, pero aquí sería el lugar ideal para implementarla).
        -   Finalmente, la promesa es rechazada (`Promise.reject(error)`) para que el error pueda ser capturado y manejado localmente en el componente o servicio que originó la llamada (usando `.catch()` o `try...catch`).

---

## Función Auxiliar (`responseBody`)

-   **Propósito**: Simplificar el acceso a los datos de la respuesta.
-   **Funcionamiento**: Es una función genérica `<T>` que toma un objeto `AxiosResponse<T>` completo y devuelve únicamente su propiedad `data`.
-   **Beneficio**: Evita tener que escribir `.then(response => response.data)` repetidamente en cada llamada a la API.

---

## Objeto Exportado (`HttpService`)

Este es el objeto que otros módulos de la aplicación importarán para interactuar con la API. Proporciona los siguientes métodos:

| Método         | Descripción                                                                                               | Parámetros                                                                                                                              | Retorno         |
| -------------- | --------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- | --------------- |
| `get<T>`       | Realiza una petición `GET`.                                                                               | - `path (string)`: La ruta del endpoint (ej. `/orders`).<br>- `<T>`: El tipo esperado para los datos de la respuesta.                      | `Promise<T>`    |
| `post<T, U>`   | Realiza una petición `POST`.                                                                              | - `path (string)`: La ruta del endpoint.<br>- `body (U)`: El cuerpo de la petición.<br>- `<T>`: El tipo de la respuesta.<br>- `<U>`: El tipo del cuerpo. | `Promise<T>`    |
| `put<T, U>`    | Realiza una petición `PUT`.                                                                               | - `path (string)`: La ruta del endpoint.<br>- `body (U)`: El cuerpo de la petición.<br>- `<T>`: El tipo de la respuesta.<br>- `<U>`: El tipo del cuerpo. | `Promise<T>`    |
| `delete<T>`    | Realiza una petición `DELETE`.                                                                            | - `path (string)`: La ruta del endpoint.<br>- `<T>`: El tipo esperado para los datos de la respuesta.                                    | `Promise<T>`    |

### Ejemplo de Uso

```typescript
import { HttpService } from './HttpService';
import { User } from '../types';

async function fetchUser(userId: string): Promise<User> {
  try {
    const user = await HttpService.get<User>(`/users/${userId}`);
    return user;
  } catch (error) {
    console.error("Error al obtener el usuario:", error);
    throw error;
  }
}
```

# Servicio de API: `shipmentServices`

## Descripción General

El módulo de servicios de envío (`shipmentServices`) encapsula la lógica de comunicación con la API del backend para todas las operaciones relacionadas con los envíos. Este archivo agrupa funciones asíncronas que realizan peticiones HTTP.

Actualmente, este módulo contiene la función `updateShipmentServices` para actualizar un envío existente.

## Funciones

### `updateShipmentServices(shipmentId, data)`

Esta función asíncrona es responsable de enviar una solicitud para actualizar los detalles de un envío específico en el servidor.

**Actualmente, la función simula una llamada a la API** con una latencia de 1.5 segundos para imitar el comportamiento de una red real y contiene una lógica de validación básica.

---

## Parámetros

La función `updateShipmentServices` acepta dos argumentos:

| Parámetro     | Tipo                | Requerido | Descripción                                                                                           |
| :------------ | :------------------ | :-------- | :---------------------------------------------------------------------------------------------------- |
| `shipmentId`  | `string`            | **Sí**    | El identificador único del envío que se desea actualizar. Este valor se usaría en la URL de la petición (ej. `/api/shipments/{shipmentId}`). |
| `data`        | `ShipmentUpdateData`| **Sí**    | Un objeto que contiene todos los datos actualizados del envío, estructurado según la interfaz `ShipmentUpdateData`. |

### Detalle de la Interfaz `ShipmentUpdateData`

El objeto `data` debe tener la siguiente estructura:

-   **`addresses`**: `object`
    -   `remitterData`: `AddressFormData` - Los datos actualizados de la dirección del remitente.
    -   `addresseeData`: `AddressFormData` - Los datos actualizados de la dirección del destinatario.
-   **`packages`**: `Package[]` - Un array con la lista actualizada de paquetes y sus productos.
-   **`selectedCourier`**: `ShippingOption` - El objeto de la opción de paquetería seleccionada.
-   **`pawSafe`**: `object`
    -   `active`: `boolean` - Si el seguro está activado.
    -   `value`: `string` - El valor declarado para el seguro.

---

## Valor de Retorno

-   **Tipo:** `Promise<any>`

-   **En caso de éxito (Success):**
    La promesa se resuelve con un objeto que confirma que la operación fue exitosa.
    ```json
    {
      "success": true,
      "message": "Envío actualizado correctamente."
    }
    ```

-   **En caso de fallo (Failure):**
    La promesa es rechazada (`rejects`) y lanza un `Error`. Esto puede ocurrir si falta un dato requerido (como `selectedCourier` en la simulación actual) o si la petición a la API falla (ej. error de red, respuesta 4xx/5xx).
    ```javascript
    // Ejemplo de error lanzado
    throw new Error('No se ha seleccionado una paquetería.');
    ```

---

## Uso

Esta función está diseñada para ser llamada desde un hook de mutación (como `useUpdateShipment`), que manejará los estados de carga y error, en lugar de ser llamada directamente desde un componente de UI.

```jsx
// En un hook como useUpdateShipment.ts

import { updateShipmentServices } from '../services/shipmentServices';

// ...

const performUpdate = async (id, data) => {
  try {
    setIsLoading(true);
    const response = await updateShipmentServices(id, data);
    setData(response); // Guardar la respuesta exitosa
    return true;
  } catch (err) {
    setError(err.message); // Guardar el mensaje de error
    return false;
  } finally {
    setIsLoading(false);
  }
};
```

### Implementación Real (Ejemplo con `fetch`)

Para conectar esta función a una API real, la simulación debería reemplazarse por una llamada `fetch` o `axios`:

```javascript
// Ejemplo de implementación real
export const updateShipmentServices = async (shipmentId, data) => {
  const response = await fetch(`/api/shipments/${shipmentId}`, {
    method: 'PUT', // o 'PATCH'
    headers: {
      'Content-Type': 'application/json',
      // 'Authorization': `Bearer ${token}` // Si se requiere autenticación
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error al actualizar el envío.');
  }

  return await response.json();
};
```

# Función de Servicio: `createShippingQuoteService`

La función `createShippingQuoteService` es responsable de la operación final en el flujo de cotización: enviar el conjunto completo de datos de una cotización para que sea creada y guardada en el backend.

Esta es una función de "escritura" o "mutación", y su implementación actual está diseñada como un *mock* para simular tanto el éxito como el fallo de una petición de red.

## Parámetros

La función acepta un único argumento:

| Parámetro | Tipo                  | Descripción                                                                                                |
| --------- | --------------------- | ---------------------------------------------------------------------------------------------------------- |
| `data`    | `ShippingQuotePayload`| El objeto de datos final que contiene toda la información necesaria para crear la cotización de envío.     |

## Tipo de Retorno

Devuelve una `Promise` que se resuelve a un valor booleano.

`Promise<boolean>`

-   **En caso de éxito**: La promesa se **resuelve** con `true`.
-   **En caso de fallo**: La promesa es **rechazada** con un objeto `Error`. No se resuelve con `false`. Este comportamiento es clave para el manejo de errores con `try/catch`.

## Uso

Esta función debe ser invocada desde una capa de lógica de negocio (como un custom hook, ej. `useShippingQuoteCreation`) utilizando `async/await` dentro de un bloque `try/catch` para manejar adecuadamente tanto los casos de éxito como los de error.

```javascript
import { createShippingQuoteService } from './shippingQuoteService';

async function finalizeQuote(quotePayload) {
  try {
    const success = await createShippingQuoteService(quotePayload);
    
    if (success) {
      console.log('La operación fue exitosa.');
      // Lógica para ejecutar después de una creación exitosa
      // (ej. mostrar mensaje, redirigir, limpiar formulario)
    }
  } catch (error) {
    // El bloque catch se ejecuta porque la promesa fue rechazada
    console.error('La creación de la cotización falló:', error.message);
    // Lógica para manejar el error
    // (ej. mostrar un mensaje de error al usuario)
  }
}
```

## Implementación Actual (Mock)

La implementación actual no realiza una llamada de red real. En su lugar, simula el comportamiento de una API para facilitar el desarrollo y las pruebas de la UI.

-   **Simulación de Red**: Utiliza `setTimeout` con un retardo de **1500ms (1.5 segundos)** para imitar el tiempo de respuesta de una petición de creación.

-   **Simulación de Fallo Aleatorio**: Para permitir probar los estados de error en la UI, la función tiene una probabilidad de fallar:
    -   Utiliza `Math.random() > 0.1` para determinar el resultado.
    -   Hay un **90% de probabilidad de éxito**, en cuyo caso la promesa se resuelve con `true`.
    -   Hay un **10% de probabilidad de fallo**, en cuyo caso la promesa es **rechazada** con un `Error` que contiene el mensaje `"Error de red o del servidor al intentar crear la cotización."`.

## Implementación Futura (Producción)

En un entorno de producción, el cuerpo de esta función se reemplazaría por una llamada a una API real, probablemente usando `axios` o `fetch`. El resultado booleano se derivaría del código de estado de la respuesta HTTP.

```javascript
// Ejemplo de implementación futura con axios
import axios from 'axios';
import { ShippingQuotePayload } from "../types";

export const createShippingQuoteService = async (data: ShippingQuotePayload): Promise<boolean> => {
  try {
    const response = await axios.post('/api/shipping-quotes', data);
    
    // Asumir que un estado 201 (Created) significa éxito
    return response.status === 201; 
  } catch (error) {
    // Re-lanzar el error para que la capa superior lo maneje
    throw new Error(error.response?.data?.message || "Error al crear la cotización.");
  }
};
```

## Dependencias

-   **`ShippingQuotePayload` (Tipo)**: La interfaz de TypeScript que define la estructura del objeto de datos que se envía.

---------------------------------------------------------------------------------------------------------------------------------

# Función de Servicio: `getProductTypes`

La función `getProductTypes` es la responsable de obtener la lista completa de todos los tipos de productos disponibles en el sistema.

Actualmente, esta función opera con datos *mockeados* para facilitar el desarrollo del frontend, pero está diseñada para ser reemplazada fácilmente por una llamada a una API real.

## Parámetros

Esta función no recibe ningún parámetro.
`getProductTypes()`

## Tipo de Retorno

Devuelve una `Promise` que, si se resuelve con éxito, entrega un array de objetos de tipo `ProductType`.

`Promise<ProductType[]>`

### Interfaz `ProductType`

Cada objeto en el array devuelto sigue la siguiente estructura:

```typescript
interface ProductType {
  id: string;             // Identificador único del tipo de producto.
  name: string;           // Nombre descriptivo y oficial del tipo de producto.
  keywords: string[];     // Un array de palabras clave asociadas para facilitar la búsqueda.
  productNumber: string;  // Un código o número de producto, posiblemente para clasificación.
}
```

## Uso

Esta función se invoca para poblar componentes que necesitan mostrar o permitir la búsqueda de tipos de producto, como un campo de autocompletado. Generalmente se llama desde un custom hook (como `useProductTypes`) para gestionar el estado de carga y los datos.

```javascript
import { getProductTypes } from './ProductTypeService';

async function loadAllProductTypes() {
  try {
    const types = await getProductTypes();
    console.log('Tipos de producto cargados:', types);
    // Aquí se actualizaría el estado global o local con los datos recibidos
  } catch (error) {
    console.error('Error al obtener los tipos de producto:', error);
  }
}
```

## Implementación Actual (Mock)

-   **Simulación de Red**: La función utiliza `new Promise` y `setTimeout` con un retardo de **300ms** para simular la latencia de una petición de red.
-   **Datos de Prueba (`mockProductTypes`)**: En lugar de hacer una llamada HTTP, la promesa se resuelve con un array de datos de prueba (`mockProductTypes`) que está definido en el mismo archivo. Esto permite un desarrollo rápido y predecible de la UI.
-   **Implementación Futura**: Para una implementación de producción, el cuerpo de esta función se reemplazaría con una llamada a una API real usando `fetch` o una librería como `axios`. Por ejemplo:

    ```javascript
    // Ejemplo de implementación futura con axios
    import axios from 'axios';
    
    export const getProductTypes = async (): Promise<ProductType[]> => {
        const response = await axios.get<ProductType[]>('/api/product-types');
        return response.data;
    };
    ```

------------------------------------------------------------------------------------------------------------------------------------------

# Capa de Servicio: `quoteService`

Este archivo contiene las funciones responsables de interactuar con la API para todo lo relacionado con las cotizaciones (`Quote`). Cada función encapsula una única operación de red.

---

## Función: `getQuotesServices`

Recupera una lista de cotizaciones preexistentes o predeterminadas. No requiere ningún parámetro de entrada.

### Parámetros

Esta función no recibe parámetros.
`getQuotesServices()`

### Tipo de Retorno

Devuelve una `Promise` que, si se resuelve con éxito, entrega un array de objetos de tipo `Quote`.

`Promise<Quote[]>`

### Uso

Se utiliza para cargar una lista inicial de cotizaciones, por ejemplo, al cargar la página por primera vez.

```javascript
import { getQuotesServices } from './quoteService';

async function loadInitialQuotes() {
  try {
    const quotes = await getQuotesServices();
    console.log('Cotizaciones obtenidas:', quotes);
    // Lógica para actualizar el estado de la aplicación con los datos
  } catch (error) {
    console.error('Error al cargar cotizaciones:', error);
  }
}
```

### Implementación Actual (Mock)

-   **Simulación de Red**: Utiliza `setTimeout` con un retardo de **1000ms (1 segundo)** para simular la latencia de una petición a la API.
-   **Datos de Prueba**: Resuelve la promesa devolviendo un conjunto de datos mock importados desde `mockQuotesData`.
-   **Implementación Futura**: El código comentado muestra cómo se haría la llamada real a la API utilizando `axios.get`.

---

## Función: `createQuoteRequestServices`

Envía los datos de un formulario de cotización para generar una nueva lista de cotizaciones basadas en esos criterios.

### Parámetros

| Parámetro  | Tipo                  | Descripción                                                                   |
| ---------- | --------------------- | ----------------------------------------------------------------------------- |
| `formData` | `Partial<QuoteFormData>` | Un objeto que contiene los datos del formulario de cotización.                |

### Tipo de Retorno

Devuelve una `Promise` que, si se resuelve con éxito, entrega un array de objetos `Quote` que coinciden con los criterios del formulario. Si falla, la promesa es rechazada con un `Error`.

`Promise<Quote[]>`

### Uso

Se invoca típicamente después de que un usuario llena y envía un formulario de cotización.

```javascript
import { createQuoteRequestServices } from './quoteService';

async function searchForQuotes(formData) {
  try {
    const newQuotes = await createQuoteRequestServices(formData);
    console.log('Nuevas cotizaciones disponibles:', newQuotes);
    // Actualizar la UI con los nuevos resultados
  } catch (error) {
    console.error('Error en la cotización:', error.message);
    // Mostrar un mensaje de error al usuario
  }
}
```

### Implementación Actual (Mock)

-   **Simulación de Red**: Utiliza `setTimeout` con un retardo de **1500ms (1.5 segundos)**.
-   **Validación Simple**: Incluye una lógica de validación básica para simular un requisito del backend. Si `originPostalCode` o `destinationPostalCode` no están presentes en `formData`, la promesa es **rechazada** con un `Error`.
-   **Datos de Prueba**: Si la validación pasa, resuelve la promesa con los datos mock de `mockQuotesData`.
-   **Implementación Futura**: El código comentado indica que la llamada real se haría a través de `axios.post`, enviando `formData` en el cuerpo de la petición.

---

## Función: `saveFinalShipmentServices`

Confirma y guarda una cotización específica seleccionada por el usuario, convirtiéndola en un envío final.

### Parámetros

| Parámetro       | Tipo    | Descripción                                                   |
| --------------- | ------- | ------------------------------------------------------------- |
| `selectedQuote` | `Quote` | El objeto completo de la cotización que el usuario seleccionó. |

### Tipo de Retorno

Devuelve una `Promise` que, si se resuelve con éxito, entrega un objeto con un mensaje de confirmación.

`Promise<{ message: string }>`

### Uso

Se llama cuando el usuario realiza la acción final de "Confirmar Envío" o "Seleccionar Cotización" desde una lista de opciones.

```javascript
import { saveFinalShipmentServices } from './quoteService';

async function confirmShipment(quoteToSave) {
  try {
    const response = await saveFinalShipmentServices(quoteToSave);
    console.log('Respuesta del servidor:', response.message);
    // Mostrar un mensaje de éxito al usuario y/o redirigir
  } catch (error) {
    console.error('No se pudo guardar el envío:', error);
  }
}
```

### Implementación Actual (Mock)

-   **Simulación de Red**: Utiliza `setTimeout` con un retardo de **2000ms (2 segundos)** para simular un proceso de guardado más largo.
-   **Logging**: Imprime en la consola el objeto `selectedQuote` para facilitar la depuración y verificar qué datos se están "enviando".
-   **Respuesta de Éxito**: Resuelve la promesa con un objeto `{ message: "Envío creado exitosamente." }` para simular una respuesta exitosa del servidor.
-   **Implementación Futura**: La llamada real probablemente sería un `axios.post` a un endpoint como `/api/shipments`, enviando `selectedQuote`.


--------------------------------------------------------------------------------------------------------------------------------------------------------------------

# Función de Servicio: `getShipmentsServices`

`getShipmentsServices` es una función asíncrona que actúa como la capa de servicio para obtener una lista paginada y filtrada de ordenes o envios (`shipments`). Su responsabilidad es comunicarse con la fuente de datos (actualmente un mock, pero diseñada para una API REST) y devolver los datos en un formato estructurado.

## Parámetros

La función acepta tres argumentos:

| Parámetro | Tipo           | Descripción                                                                                                 |
| --------- | -------------- | ----------------------------------------------------------------------------------------------------------- |
| `filters`   | `FilterValues` | Un objeto que contiene todos los criterios de búsqueda y filtrado que se aplicarán a la consulta.           |
| `page`      | `number`       | El número de la página que se desea obtener. **Utiliza un índice basado en 1** (la primera página es 1).    |
| `limit`     | `number`       | El número máximo de registros que se deben devolver por página.                                             |

## Tipo de Retorno

La función devuelve una `Promise` que, si se resuelve con éxito, entrega un objeto de tipo `PaginatedShipmentsResponse`.

`Promise<PaginatedShipmentsResponse>`

### Interfaz `PaginatedShipmentsResponse`

Esta es la estructura del objeto que se recibe cuando la promesa se resuelve:

```typescript
interface PaginatedShipmentsResponse {
  data: Shipment[];         // Un array con los envíos de la página actual.
  totalPages: number;       // El número total de páginas disponibles con los filtros aplicados.
  currentPage: number;      // El número de la página actual que se está devolviendo.
  totalItems: number;       // El número total de envíos que coinciden con los filtros (sin paginar).
}
```

## Uso

Esta función está diseñada para ser llamada desde un custom hook (como `useOrders`) o cualquier otra lógica asíncrona que necesite obtener datos de envíos. Se debe invocar usando `async/await` dentro de un bloque `try/catch` para un manejo de errores adecuado.

```javascript
import { getShipmentsServices } from './services/OrdersService';
import { FilterValues } from './types';

// Dentro de una función async, por ejemplo en un hook
const fetchMyData = async () => {
  const currentFilters: FilterValues = {
    searchTerm: 'Juan Perez',
    statuses: ['Generada'],
    startDate: '2023-01-01',
    endDate: '2023-01-31'
  };
  const pageNumber = 1;
  const itemsPerPage = 10;

  try {
    const response = await getShipmentsServices(currentFilters, pageNumber, itemsPerPage);
    console.log('Datos recibidos:', response.data);
    console.log(`Página ${response.currentPage} de ${response.totalPages}`);
    // Actualizar el estado con response.data, response.totalPages, etc.
  } catch (error) {
    console.error('Error al obtener los envíos:', error);
    // Actualizar el estado de error
  }
};
```

## Lógica Interna y Comportamiento

### Implementación Actual (Mock)

Actualmente, la función **no realiza una llamada de red real**. En su lugar, simula una llamada a la API para facilitar el desarrollo y las pruebas del frontend sin necesidad de un backend funcional.

-   **Simulación de Latencia**: Utiliza `new Promise` y `setTimeout` con un retardo de 500ms para imitar el tiempo de respuesta de una red.
-   **Fuente de Datos Local**: Opera sobre un array de datos local llamado `allShipmentsFromDB` (no visible en el fragmento de código, pero se asume que existe en el mismo ámbito).
-   **Lógica de Filtrado**:
    -   **Estatus**: Filtra los envíos si su estatus está incluido en el array `filters.statuses`.
    -   **Rango de Fechas**: Convierte las fechas de string (`dd/mm/yyyy` del mock y `yyyy-mm-dd` del filtro) a objetos `Date` para comparar si la fecha del envío está dentro del rango `startDate` y `endDate`.
    -   **Término de Búsqueda (`searchTerm`)**: Realiza una búsqueda case-insensitive y sin espacios en los bordes sobre el nombre del destinatario (`recipient.name`) y el ID del envío (`shipment.id`).
-   **Lógica de Paginación**:
    -   Después de aplicar todos los filtros, calcula el total de ítems y páginas.
    -   Utiliza el método `slice()` para extraer el "trozo" de datos que corresponde a la página solicitada.

### Implementación Futura (Producción)

El código comentado dentro de la función revela la **implementación final prevista**:

-   **Construcción de Parámetros**: Utiliza `URLSearchParams` para construir dinámicamente una cadena de consulta (query string) a partir del objeto `filters`.
    -   Los filtros como `startDate`, `endDate` y `searchTerm` se añaden como parámetros individuales.
    -   El array `statuses` se convierte en un string separado por comas (ej. `statuses=Generada,Pendiente`).
-   **Endpoint de API**: Construye la URL final para la petición GET, por ejemplo: `/shipments?statuses=Generada&page=1&limit=10&q=Juan`.
-   **Llamada HTTP**: En producción, esta sección contendría una llamada a la API usando `fetch` o una librería como `axios` para ejecutar la petición al backend.

## Dependencias

-   **`allShipmentsFromDB`**: Un array local de objetos `Shipment` que sirve como base de datos mock.
-   **`FilterValues` (type)**: Interfaz de TypeScript que define la estructura del objeto de filtros.
-   **`PaginatedShipmentsResponse` (type)**: Interfaz de TypeScript que define la estructura de la respuesta de la función.



# Documentación del `OrderService`

Este documento detalla el funcionamiento del módulo `OrderService`, diseñado para gestionar las interacciones con la API relacionadas con las órdenes (pedidos) en un proyecto de React con TypeScript.

## Resumen General

El `OrderService` es un objeto que encapsula toda la lógica para comunicarse con los endpoints de la API de órdenes (`/orders`). Su propósito es centralizar las llamadas a la API, facilitando la obtención y creación de órdenes desde diferentes componentes de la aplicación. Utiliza un `HttpService` genérico para realizar las peticiones HTTP.

## Dependencias Clave

-   **`HttpService`**: Un cliente HTTP personalizado (probablemente un wrapper sobre `axios` ) que se encarga de realizar las peticiones (`GET`, `POST`, etc.) a la API, manejando posiblemente la autenticación y la URL base.
-   **`../types`**: Archivo que define las interfaces de TypeScript utilizadas en el servicio:
    -   `ApiResponseItems<T>`: Define la estructura estándar de una respuesta de API paginada, conteniendo un array de `items` y un objeto `meta` con información de paginación.
    -   `FilterValues`: Define la estructura de los filtros que se pueden aplicar al solicitar listas de órdenes.
    -   `OrderPickups`: Define la estructura de un objeto de tipo "recolección de orden".
    -   `ShipmentOrder`: Define la estructura de los datos necesarios para crear una nueva orden de envío.

---

## Métodos del Servicio

El servicio expone los siguientes métodos:

### 1. `getOrderShipments(filters, page, limit)`

Este método asíncrono se utiliza para obtener una lista paginada y filtrada de los **envíos de órdenes**.

#### Descripción

Construye una URL con parámetros de consulta (query params) basados en los filtros, la página y el límite proporcionados. Luego, realiza una petición `GET` al endpoint `/orders` para recuperar los datos. Incluye un manejo de errores que, en caso de fallo, devuelve una estructura de datos vacía para evitar que la aplicación se rompa.

#### Parámetros

-   **`filters`** (`FilterValues`): Un objeto que contiene los criterios de filtrado.
    -   `startDate` (opcional, `string`): Fecha de inicio para el filtro de rango de fechas.
    -   `endDate` (opcional, `string`): Fecha de fin para el filtro de rango de fechas.
    -   `statuses` (opcional, `string[]`): Un array de estados por los cuales filtrar las órdenes.
    -   `searchTerm` (opcional, `string`): Un término de búsqueda libre (se envía como el parámetro `q`).
-   **`page`** (`number`): El número de la página que se desea obtener.
-   **`limit`** (`number`): La cantidad de registros a devolver por página.

#### Retorno

-   **`Promise<ApiResponseItems<OrderPickups>>`**: Devuelve una promesa que se resuelve con un objeto que contiene:
    -   `items`: Un array de objetos `OrderPickups`.
    -   `meta`: Un objeto con los detalles de la paginación (`total`, `totalPages`, `hasNext`, etc.).
-   **En caso de error**: Devuelve un objeto `ApiResponseItems` con un array `items` vacío y metadatos de paginación por defecto, además de registrar el error en la consola.

#### Lógica Interna

1.  Crea un objeto `URLSearchParams`.
2.  Añade los parámetros `page` y `limit` obligatoriamente.
3.  Añade condicionalmente los parámetros `startDate`, `endDate`, `statuses` (unidos por comas) y `q` (para `searchTerm`) si existen en el objeto `filters`.
4.  Construye la URL final: `/orders?param1=value1&param2=value2...`.
5.  Realiza la llamada `GET` usando `HttpService.get`.

---

### 2. `getOrderPickups(filters, page, limit)`

Este método es funcionalmente casi idéntico a `getOrderShipments`, pero se dirige a un endpoint diferente para obtener las **recolecciones de órdenes**.

#### Descripción

Construye una URL con parámetros de consulta (filtros, paginación) y realiza una petición `GET` al endpoint específico `/orders/pickups`. Al igual que el método anterior, gestiona los errores devolviendo una respuesta vacía y segura.

#### Parámetros

Los parámetros son exactamente los mismos que en `getOrderShipments`:
-   **`filters`** (`FilterValues`)
-   **`page`** (`number`)
-   **`limit`** (`number`)

#### Retorno

-   **`Promise<ApiResponseItems<OrderPickups>>`**: Devuelve una promesa que se resuelve con la lista paginada de recolecciones de órdenes.
-   **En caso de error**: Devuelve una estructura `ApiResponseItems` vacía por defecto.

#### Lógica Interna

La lógica es idéntica a `getOrderShipments`, con la única diferencia de que la URL base para el servicio es `/orders/pickups`.

---

### 3. `CreateOrderShipment(dataOrder)`

Este método se encarga de crear un nuevo envío de orden.

#### Descripción

Realiza una petición `POST` al endpoint `/orders`, enviando los datos de la nueva orden en el cuerpo (body) de la petición.

#### Parámetros

-   **`dataOrder`** (`ShipmentOrder`): Un objeto que contiene todos los datos necesarios para crear la nueva orden de envío, conforme a la interfaz `ShipmentOrder`.

#### Retorno

-   **`Promise<ShipmentOrder>`**: Devuelve una promesa que, si se resuelve con éxito, contiene el objeto de la orden recién creada, tal como lo devuelve la API.

#### Lógica Interna

1.  Invoca directamente a `HttpService.post`.
2.  El primer argumento es el endpoint (`/orders`).
3.  El segundo argumento es el `dataOrder`, que se enviará como el cuerpo de la petición en formato JSON.

> **Nota Importante:** A diferencia de los métodos `get...`, este método no tiene un bloque `try...catch` explícito. Esto significa que el manejo de errores (por ejemplo, si la API devuelve un error 400 o 500) debe ser gestionado en el lugar donde se llame a esta función (por ejemplo, en el componente que envía el formulario de creación).

### Ejemplo de Uso en un Componente React

```typescript
import React, { useState, useEffect } from 'react';
import OrderService from './OrderService'; // Ajusta la ruta
import { OrderPickups, ShipmentOrder } from '../types'; // Ajusta la ruta

const OrdersComponent = () => {
    const [orders, setOrders] = useState<OrderPickups[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Ejemplo de cómo obtener órdenes
    useEffect(() => {
        const fetchOrders = async () => {
            setIsLoading(true);
            const response = await OrderService.getOrderShipments({ searchTerm: 'cliente' }, 1, 10);
            setOrders(response.items);
            setIsLoading(false);
        };
        fetchOrders();
    }, []);

    // Ejemplo de cómo crear una orden
    const handleCreateOrder = async () => {
        const newOrderData: ShipmentOrder = {
            // ...datos del formulario
        };

        try {
            const createdOrder = await OrderService.CreateOrderShipment(newOrderData);
            console.log('Orden creada con éxito:', createdOrder);
            // Actualizar la lista de órdenes o mostrar una notificación
        } catch (error) {
            console.error('Error al crear la orden:', error);
            // Mostrar un mensaje de error al usuario
        }
    };

};
```


 # Documentación del Módulo `PaymentService`

## Índice
1. [Descripción General](#descripción-general)
2. [Responsabilidades Clave](#responsabilidades-clave)
3. [Estructura y Dependencias](#estructura-y-dependencias)
4. [Métodos del Servicio](#métodos-del-servicio)
    - [`createPaymentIntent(payload)`](#createpaymentintentpayload)
5. [Manejo de Errores](#manejo-de-errores)
6. [Ejemplo de Uso](#ejemplo-de-uso)

---

### Descripción General

El `PaymentService` es un módulo de servicio dedicado, diseñado para actuar como una capa de abstracción entre la aplicación cliente y el endpoint del backend responsable de interactuar con la API de Stripe para crear un `PaymentIntent`.

Su propósito principal es encapsular la lógica de la llamada HTTP, incluyendo la preparación de los datos y el manejo básico de errores de comunicación. Al centralizar esta lógica, se promueve un código más limpio, reutilizable y fácil de mantener, ya que cualquier cambio en el endpoint o en la estructura del payload solo necesita ser actualizado en este único lugar.

### Responsabilidades Clave

- **Abstracción de la API:** Oculta los detalles de la implementación de la llamada a la API (endpoint, método HTTP) del resto de la aplicación (como los custom hooks).
- **Preparación de Datos:** Realiza transformaciones necesarias en los datos antes de enviarlos al backend. Específicamente, convierte el monto del pago de una unidad principal (ej. pesos, dólares) a la unidad más pequeña (centavos), que es el formato requerido por la API de Stripe.
- **Manejo de Tipos:** Utiliza TypeScript para garantizar que los datos enviados (`IPayloadCreatePaymentIntent`) y recibidos (`PaymentIntentResponse`) se adhieran a los contratos de datos definidos, previniendo errores en tiempo de ejecución.
- **Gestión de Errores de Comunicación:** Captura cualquier error que ocurra durante la solicitud HTTP (ej. errores de red, respuestas 4xx/5xx del servidor) y lo transforma en una excepción estandarizada y legible para el consumidor del servicio.

### Estructura y Dependencias

- **`HttpService` (de `./apiClient`)**: Este es un wrapper genérico para el cliente HTTP de la aplicación (probablemente `axios` o `fetch`). `PaymentService` depende de él para realizar la solicitud `POST`. Esta dependencia permite mantener una configuración centralizada para todas las llamadas a la API (como `baseURL`, `headers`, interceptores, etc.).
- **`types`**: Importa las definiciones de tipo `IPayloadCreatePaymentIntent` y `PaymentIntentResponse` para asegurar la consistencia de los datos a lo largo de la aplicación.

### Métodos del Servicio

#### `createPaymentIntent(payload)`

Esta es la única función expuesta por el servicio. Es una función asíncrona responsable de solicitar la creación de un `PaymentIntent` en el backend.

- **Parámetros:**
    - `payload` (`IPayloadCreatePaymentIntent`): Un objeto que contiene los detalles de la orden necesarios para que el backend cree la intención de pago.
        - `orderUid`: `string`
        - `amount`: `number` (en unidad principal, ej. `150.50`)
        - `currency`: `'MXN' | 'USD' | 'EUR'`
        - `customerEmail`: `string` (opcional)

- **Lógica Interna:**
    1.  Crea una copia del `payload` original (`payloadForApi`) para evitar la mutación del objeto de entrada (una buena práctica de programación funcional).
    2.  Convierte el `amount` del `payloadForApi` a centavos, multiplicándolo por 100 y redondeándolo para evitar problemas con puntos flotantes.
    3.  Utiliza `HttpService.post` para enviar el `payloadForApi` al endpoint `/api/create-payment-intent`.
    4.  Espera la respuesta del servidor.

- **Retorno:**
    - Devuelve una `Promise` que se resuelve con el objeto `PaymentIntentResponse` tal como lo devuelve el `HttpService`. Este objeto, según la definición de tipo, contiene `statusCode`, `message` y un objeto `data` con el `clientSecret`.

### Manejo de Errores

El método está envuelto en un bloque `try...catch`.
- **`try`**: Contiene la lógica principal de preparación de datos y la llamada a la API.
- **`catch`**: Si `HttpService.post` lanza una excepción (por un error de red o una respuesta no exitosa del servidor), el bloque `catch` la intercepta.
    - Imprime el error original en la consola para fines de depuración (`console.error`).
    - Lanza una nueva `Error` con un mensaje genérico y amigable para el usuario (`'No se pudo iniciar el proceso de pago. Intente de nuevo.'`). Esto permite que el consumidor del servicio (el hook `useStripePayment`) pueda capturar este error y mostrar un mensaje consistente en la interfaz de usuario, sin exponer detalles técnicos del fallo.

### Ejemplo de Uso

Este servicio no está diseñado para ser usado directamente por los componentes de la UI, sino por una capa de lógica como un custom hook.

```jsx
// Dentro de un custom hook como useStripePayment.ts

import PaymentService from './services/paymentService';
import { IPayloadCreatePaymentIntent } from './types';

// ...

const handlePayment = async (paymentData: IPayloadCreatePaymentIntent) => {
    try {
        // El hook simplemente llama al método del servicio,
        // pasándole los datos requeridos.
        const response = await PaymentService.createPaymentIntent(paymentData);
        
        // Ahora puede usar la respuesta, por ejemplo, el clientSecret.
        const clientSecret = response.data.clientSecret;
        console.log("Client Secret obtenido:", clientSecret);
        
        // ... continuar con la confirmación del pago ...

    } catch (error) {
        // El hook puede capturar el error estandarizado que lanza el servicio.
        console.error(error.message); // -> "No se pudo iniciar el proceso de pago. Intente de nuevo."
        // Y usar este mensaje para actualizar el estado de la UI.
    }
};

// Ejemplo de cómo se llamaría esta función:
const payload: IPayloadCreatePaymentIntent = {
    orderUid: 'xyz-123',
    amount: 2500,
    currency: 'MXN',
    customerEmail: 'test@example.com'
};
handlePayment(payload);
```
