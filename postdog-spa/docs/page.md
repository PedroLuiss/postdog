# Componente: `Home`

## Descripción General

El componente `Home` actúa como la página principal o de aterrizaje (landing page) de la aplicación. Es un componente estructural o de "contenedor", cuya responsabilidad principal es ensamblar y mostrar las diferentes secciones de la página de inicio en un orden específico.

No gestiona estado interno ni lógica de negocio; su función es puramente de presentación y maquetación de la página principal.

## Estructura del Componente

El componente renderiza un `div` principal con la clase `page-home` que envuelve las siguientes secciones, cada una representada por un componente hijo:

1.  **`BannerHomeSection`**: La sección principal (hero banner) en la parte superior de la página. Se configura con un título, subtítulo y un botón de llamada a la acción.
2.  **`WhySection`**: Una sección que explica el "porqué" o la propuesta de valor del servicio.
3.  **`PostdogFeatureSection`**: Muestra las características clave del servicio, probablemente en un formato de tarjetas o slider.
4.  **`FaqSection`**: Una sección de Preguntas Frecuentes (FAQ) para resolver dudas comunes de los usuarios.
5.  **`HowItWorksSection`**: Explica el funcionamiento del servicio paso a paso.
6.  **`ContactSection`**: La sección final de la página, que incluye una llamada a la acción para contactar o registrarse.

## Dependencias

Este componente importa varios módulos para su correcto funcionamiento:

### Estilos CSS

El componente importa estilos globales que afectan tanto a la página como a los componentes hijos que utilizan ciertas librerías:

-   `animate.css`: Librería para animaciones CSS.
-   `swiper/css` y `swiper/css/pagination`: Estilos base para la librería de sliders Swiper.js.
-   `../assets/styles/pages/Home.css`: Estilos específicos y locales para la página `Home`.

### Componentes Internos

-   `BannerHomeSection`
-   `ContactSection`
-   `FaqSection`
-   `HowItWorksSection`
-   `PostdogFeatureSection`
-   `WhySection`

## Configuración de Props

El componente `Home` no recibe props directamente, pero sí **configura y pasa props** a sus componentes hijos. A continuación se detalla la configuración del componente `BannerHomeSection`:

| Prop            | Tipo        | Valor                                                                                                         | Descripción                                                                                                                              |
| --------------- | ----------- | ------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `title`         | `string`    | `"Tu mejor amigo en envíos"`                                                                                   | El título principal que se mostrará en el banner.                                                                                        |
| `subtitle`      | `JSX`       | `<>Haz tus envíos... ¡guau!</>`                                                                                | El subtítulo del banner. Se pasa como un elemento JSX para permitir saltos de línea (`<br />`) y formato especial.                     |
| `buttonText`    | `string`    | `"¡Únete a la manada!"`                                                                                        | El texto que se mostrará en el botón de llamada a la acción.                                                                             |
| `buttonOnClick` | `function`  | `() => window.location.href = ...`                                                                            | Una función que se ejecuta al hacer clic en el botón. Redirige al usuario a la página de registro, utilizando una variable de entorno. |

## Uso

Este componente está diseñado para ser utilizado como una ruta principal en el sistema de enrutamiento de la aplicación (por ejemplo, con `react-router-dom`).

```jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home'; // Asegúrate que la ruta sea correcta

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* ... otras rutas de la aplicación ... */}
      </Routes>
    </Router>
  );
}```


# Componente: `PrivacyPage`

## Descripción General

El componente `PrivacyPage` es una página de contenido estático diseñada para mostrar el Aviso de Privacidad de la aplicación. Su principal responsabilidad es renderizar texto legal y de políticas de manera clara y estructurada. El contenido se gestiona internamente a través de un array de objetos, lo que facilita su mantenimiento y actualización.

## Características Clave

1.  **Desplazamiento Automático al Inicio:** Al cargar la página, un hook `useEffect` se encarga de desplazar la ventana al punto más alto (`window.scrollTo(0, 0)`). Esto asegura que el usuario siempre comience a leer desde el principio del documento, independientemente de su posición de scroll en la página anterior.

2.  **Contenido Basado en Datos:** Todo el texto de la política de privacidad está almacenado en un array local llamado `terms`. Esto separa el contenido de la lógica de renderizado, haciendo que las actualizaciones de texto sean más sencillas sin necesidad de modificar el JSX.

3.  **Renderizado Condicional de Listas:** El componente analiza el contenido de cada párrafo. Si una línea de texto comienza con un guion (`-`), la renderiza como un elemento de lista (`<li>`) dentro de una lista no ordenada (`<ul>`). Esto permite formatear listas de manera simple directamente desde el array de datos.

## Estructura de Datos (`terms` array)

El contenido de la página se define en un array de objetos, donde cada objeto representa una sección de la política.

```javascript
const terms = [
    {
        title: "Título de la Sección", 
        content: [
            "Párrafo de texto normal.",
            "- Elemento de lista 1 (comienza con guion).",
            "- Elemento de lista 2.",
            "Otro párrafo con <a>enlaces HTML</a>."
        ],
    },
    // ... más secciones
];
```