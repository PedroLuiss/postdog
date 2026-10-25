## Hook Personalizado: `useScreenResolution`

Este hook personalizado de React, `useScreenResolution`, está diseñado para detectar y reaccionar a los cambios en el ancho de la ventana del navegador. Proporciona una manera sencilla y declarativa de aplicar lógica de diseño responsivo directamente en tus componentes.

### Funcionalidad Principal

-   **Seguimiento del Ancho en Tiempo Real:** Utiliza el estado de React (`useState`) para almacenar el ancho actual de la ventana (`window.innerWidth`).
-   **Escucha de Eventos `resize`:** Mediante `useEffect`, añade un `event listener` al evento `resize` del objeto `window`. Cada vez que el usuario redimensiona la ventana, el estado del ancho se actualiza, provocando que los componentes que usan el hook se vuelvan a renderizar con los nuevos valores.
-   **Limpieza Automática:** El `useEffect` retorna una función de limpieza que elimina el `event listener` cuando el componente que usa el hook se desmonta. Esto es una buena práctica crucial para prevenir fugas de memoria y errores en la aplicación.
-   **Breakpoints Predefinidos:** En lugar de trabajar con el valor numérico del ancho, el hook devuelve un conjunto de valores booleanos (`isMovil`, `is768`, etc.) que indican en qué rango de resolución (o *breakpoint*) se encuentra el ancho actual. Esto simplifica enormemente la lógica condicional en los componentes.

### Modo de Uso

Para utilizar el hook, simplemente impórtalo en tu componente y llama a la función para desestructurar los valores que necesitas.

```jsx
import React from 'react';
import useScreenResolution from './hooks/useScreenResolution'; // Ajusta la ruta a tu archivo

const MyResponsiveComponent = () => {
  const { isMovil, is768, is1024, currentWidth } = useScreenResolution();

  return (
    <div>
      <h1>Componente Responsivo</h1>
      <p>El ancho actual de la pantalla es: <strong>{currentWidth}px</strong></p>

      {isMovil && (
        <div style={{ backgroundColor: 'lightblue', padding: '10px' }}>
          <p>Estás en una vista móvil (menos de 390px).</p>
        </div>
      )}

      {is768 && (
        <div style={{ backgroundColor: 'lightgreen', padding: '10px' }}>
          <p>Estás en una vista de tablet (entre 768px y 1024px).</p>
        </div>
      )}

      {is1024 && (
        <div style={{ backgroundColor: 'lightcoral', padding: '10px' }}>
          <p>Estás en una vista de escritorio pequeña (entre 1024px y 1440px).</p>
        </div>
      )}
    </div>
  );
};

export default MyResponsiveComponent;
```

### Valores Devueltos

El hook devuelve un objeto con las siguientes propiedades:

| Propiedad    | Tipo    | Descripción                                                                 |
| :----------- | :------ | :-------------------------------------------------------------------------- |
| `isMovil`    | Boolean | `true` si el ancho de la pantalla es menor a `390px`.                       |
| `is390`      | Boolean | `true` si el ancho de la pantalla está entre `390px` y `767px`.             |
| `is768`      | Boolean | `true` si el ancho de la pantalla está entre `768px` y `1023px`.            |
| `is1024`     | Boolean | `true` si el ancho de la pantalla está entre `1024px` y `1439px`.           |
| `is1440`     | Boolean | `true` si el ancho de la pantalla está entre `1440px` y `1919px`.           |
| `is1920`     | Boolean | `true` si el ancho de la pantalla es de `1920px` o mayor.                   |
| `currentWidth` | Number  | El valor numérico exacto del ancho actual de la ventana en píxeles. |

### Código Completo del Hook

Aquí está el código fuente completo para referencia.

```javascript
// useScreenResolution.js
import { useState, useEffect } from 'react';

/**
 * Hook personalizado para detectar el ancho de la pantalla y devolver
 * breakpoints comunes para un diseño responsivo.
 *
 * @returns {object} Un objeto que contiene flags booleanos para diferentes
 * breakpoints y el ancho actual de la pantalla.
 */
const useScreenResolution = () => {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    // Función que se ejecuta cada vez que la ventana cambia de tamaño
    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    // Añadir el event listener cuando el componente se monta
    window.addEventListener('resize', handleResize);

    // Función de limpieza para remover el event listener cuando el componente se desmonta
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []); // El array vacío asegura que el efecto solo se ejecute al montar y desmontar

  // Definición de los breakpoints
  const isMovil = width < 390;
  const is390 = width >= 390 && width < 768;
  const is768 = width >= 768 && width < 1024;
  const is1024 = width >= 1024 && width < 1440;
  const is1440 = width >= 1440 && width < 1920;
  const is1920 = width >= 1920;

  return {
    isMovil,
    is390,
    is768,
    is1024,
    is1440,
    is1920,
    currentWidth: width
  };
};

export default useScreenResolution;
```