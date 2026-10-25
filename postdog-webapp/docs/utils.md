# Función de Utilidad: `generateUniqueId`

`generateUniqueId` es una función de utilidad simple del lado del cliente diseñada para generar un identificador de cadena pseudo-aleatorio y razonablemente único.

**Importante:** Esta función es ideal para generar IDs temporales en el frontend (por ejemplo, para las `key` en listas de React donde no hay un ID estable) pero **no debe ser considerada criptográficamente segura ni globalmente única** para su uso en una base de datos distribuida.

## Parámetros

Esta función no recibe ningún parámetro.
`generateUniqueId()`

## Tipo de Retorno

Devuelve un `string` que representa el identificador único generado.

`string`

El formato del string devuelto es `[randomPart]-[timePart]`, por ejemplo: `k2f4x1a-l7f5r3c`.

## Uso

Se utiliza en cualquier lugar de la aplicación donde se necesite un identificador simple y rápido sin tener que depender de librerías externas como `uuid`.

**Ejemplo 1: Generar una `key` para un elemento de lista añadido dinámicamente**

```tsx
import React, { useState } from 'react';
import { generateUniqueId } from '../utils/idGenerator';

const TodoList = () => {
  const [items, setItems] = useState([]);
  const [inputValue, setInputValue] = useState('');

  const handleAddItem = () => {
    if (!inputValue.trim()) return;

    const newItem = {
      // Usar la función para generar un ID temporal para el nuevo ítem
      id: generateUniqueId(),
      text: inputValue
    };

    setItems(prevItems => [...prevItems, newItem]);
    setInputValue('');
  };

  return (
    <div>
      <input value={inputValue} onChange={e => setInputValue(e.target.value)} />
      <button onClick={handleAddItem}>Añadir</button>
      <ul>
        {items.map(item => (
          <li key={item.id}>{item.text}</li>
        ))}
      </ul>
    </div>
  );
};
```

**Ejemplo 2: Asignar un ID a una notificación**

```javascript
import { generateUniqueId } from '../utils/idGenerator';

function showNotification(message) {
  const notification = {
    id: generateUniqueId(),
    message: message,
    type: 'info'
  };
  // Lógica para mostrar la notificación en la UI
}
```

## Algoritmo y Lógica Interna

El identificador se construye a partir de la concatenación de dos partes para aumentar su unicidad:

1.  **Parte Aleatoria (`randomPart`)**:
    -   `Math.random()`: Genera un número flotante pseudo-aleatorio entre 0 y 1.
    -   `.toString(36)`: Convierte este número a una representación en base-36. La base-36 utiliza los dígitos 0-9 y las letras a-z, lo que la hace compacta.
    -   `.substring(2, 9)`: Extrae una subcadena de 7 caracteres, omitiendo el "0." inicial.

2.  **Parte Temporal (`timePart`)**:
    -   `Date.now()`: Obtiene el número de milisegundos transcurridos desde la Época Unix (1 de enero de 1970). Este valor es altamente granular y es muy poco probable que sea el mismo en llamadas consecutivas.
    -   `.toString(36)`: También convierte este timestamp a una cadena en base-36, haciéndola más corta.

La combinación de una parte aleatoria y una parte temporal hace que la probabilidad de colisión en un entorno de un solo cliente sea extremadamente baja para casos de uso típicos en la UI.












# Módulo de Utilidades: `storageUtils`

Este módulo proporciona un conjunto de funciones de utilidad para interactuar de manera segura y estructurada con el `localStorage` del navegador. Actúa como un *wrapper* sobre la API nativa de `localStorage`, añadiendo varias mejoras clave:

-   **Seguridad en el Servidor (SSR-Safe)**: Todas las funciones comprueban si se están ejecutando en un entorno de navegador antes de intentar acceder a `localStorage`, evitando errores en entornos de renderizado del lado del servidor (SSR) como Next.js.
-   **Manejo de Tipos (Type-Safe)**: Utiliza genéricos de TypeScript (`<T>`) para proporcionar seguridad de tipos al guardar y recuperar datos, reduciendo errores en tiempo de ejecución.
-   **Abstracción de JSON**: Maneja automáticamente la serialización (`JSON.stringify`) y deserialización (`JSON.parse`) de los datos.
-   **Estructura de Datos Interna**: Guarda los datos en un objeto `{ data, timestamp? }` para permitir funcionalidades adicionales, como la gestión de caché basada en tiempo.
-   **Manejo de Errores**: Envuelve las operaciones de `localStorage` en bloques `try/catch` para manejar errores de forma segura (por ejemplo, si el almacenamiento está lleno o deshabilitado).

---

## Función: `saveToStorage<T>`

Guarda un valor en `localStorage` bajo una clave específica.

### Parámetros

| Parámetro       | Tipo                   | Requerido              | Descripción                                                                                                  |
| --------------- | ---------------------- | ---------------------- | ------------------------------------------------------------------------------------------------------------ |
| `key`           | `string`               | Sí                     | La clave con la que se almacenará el valor.                                                                  |
| `value`         | `T`                    | Sí                     | El valor a guardar. Puede ser de cualquier tipo que sea serializable a JSON (objetos, arrays, strings, etc.). |
| `withTimestamp` | `boolean`              | No (default: `false`)  | Si es `true`, se añadirá una marca de tiempo (`timestamp`) al objeto guardado, útil para invalidación de caché. |

### Retorno

`void` - No devuelve ningún valor.

### Uso

```javascript
const userProfile = { id: 123, name: 'Jane Doe', theme: 'dark' };
saveToStorage('userProfile', userProfile);

// Guardar datos de sesión con una marca de tiempo
const sessionData = { token: 'xyz-abc-123' };
saveToStorage('session', sessionData, true); 
```

---

## Función: `getFromStorage<T>`

Recupera un valor desde `localStorage` a partir de su clave.

### Parámetros

| Parámetro | Tipo     | Requerido | Descripción                     |
| --------- | -------- | --------- | ------------------------------- |
| `key`     | `string` | Sí        | La clave del valor a recuperar. |

### Retorno

`T | null` - Devuelve el valor parseado y tipado con el genérico `T` si la clave existe. Devuelve `null` si la clave no se encuentra, si el entorno no es un navegador, o si ocurre un error durante el parseo.

### Uso

```javascript
interface UserProfile {
  id: number;
  name: string;
  theme: string;
}

// Se especifica el tipo esperado para obtener un objeto tipado
const user = getFromStorage<UserProfile>('userProfile');

if (user) {
  console.log(user.name); // 'Jane Doe'
} else {
  console.log('No se encontró perfil de usuario.');
}
```

---

## Función: `removeFromStorage`

Elimina un elemento de `localStorage` por su clave.

### Parámetros

| Parámetro | Tipo     | Requerido | Descripción                       |
| --------- | -------- | --------- | --------------------------------- |
| `key`     | `string` | Sí        | La clave del elemento a eliminar. |

### Retorno

`void` - No devuelve ningún valor.

### Uso

```javascript
// Útil en una función de cierre de sesión
removeFromStorage('session');
removeFromStorage('userProfile');
```

---

## Función: `clearStorage`

Elimina **todos** los elementos del `localStorage` del dominio actual.

### Parámetros

Esta función no recibe parámetros.

### Retorno

`void` - No devuelve ningún valor.

### Uso

**¡Cuidado!** Esta acción es destructiva e irreversible y afectará a todas las claves guardadas por la aplicación. Es comúnmente utilizada en funciones de "logout" o "resetear aplicación".

```javascript
const handleLogout = () => {
  clearStorage();
  // Redirigir al usuario a la página de login
};
```

---

## Función: `hasStorageKey`

Verifica si una clave específica existe en `localStorage`.

### Parámetros

| Parámetro | Tipo     | Requerido | Descripción                     |
| --------- | -------- | --------- | ------------------------------- |
| `key`     | `string` | Sí        | La clave que se desea verificar. |

### Retorno

`boolean` - Devuelve `true` si la clave existe, `false` en caso contrario.

### Uso

```javascript
if (hasStorageKey('session')) {
  // El usuario probablemente tiene una sesión activa, intentar autenticación automática.
}
```

---

## Función: `getStorageTimestamp`

Recupera específicamente la marca de tiempo (`timestamp`) asociada a una clave, si fue guardada con una.

### Parámetros

| Parámetro | Tipo     | Requerido | Descripción                               |
| --------- | -------- | --------- | ----------------------------------------- |
| `key`     | `string` | Sí        | La clave de la cual obtener el timestamp. |

### Retorno

`number | null` - Devuelve el timestamp (un número que representa milisegundos desde la Época Unix) si fue guardado. Devuelve `null` si la clave no existe, no tiene un timestamp asociado, o si ocurre un error.

### Uso

Esta función es muy útil para implementar lógica de caché del lado del cliente.

```javascript
const CACHE_DURATION_MS = 5 * 60 * 1000; // 5 minutos
const lastFetchTime = getStorageTimestamp('api-data-cache');

if (!lastFetchTime || (Date.now() - lastFetchTime > CACHE_DURATION_MS)) {
  console.log('El caché está expirado o no existe. Realizando nueva petición a la API...');
  // fetchNewData().then(data => saveToStorage('api-data-cache', data, true));
} else {
  console.log('Usando datos desde el caché.');
  // const cachedData = getFromStorage('api-data-cache');
}
```