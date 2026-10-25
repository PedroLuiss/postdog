# Componente: `BannerHomeSection`

## Descripción General

El componente `BannerHomeSection` es una sección de "héroe" (hero banner) reutilizable y altamente configurable, diseñada para ser la pieza central en la parte superior de una página, como la página de inicio. Muestra un título, un subtítulo, un botón de llamada a la acción, un logo principal y un carrusel de logos animados.

Rutas: src\components\home\BannerHomeSection\BannerHomeSection.jsx

## Características Clave

1.  **Contenido Personalizable**: A través de las props, se puede definir el `title`, `subtitle` y `buttonText`.
2.  **Acciones Configurables**: Acepta funciones `buttonOnClick` y `logoOnClick` para manejar la interacción del usuario.
3.  **Valores por Defecto**: Proporciona una imagen (`PostDogLogin`) y una acción de clic (`navigate("/")`) predeterminadas para el logo, lo que lo hace fácil de usar con una configuración mínima.
4.  **Carrusel de Logos Infinito**: Muestra un carrusel de logos de partners o clientes. El componente repite la lista de logos varias veces para crear un efecto de desplazamiento continuo y fluido.
5.  **Estilo Encapsulado**: Utiliza CSS Modules (`.module.css`) para aplicar estilos BEM de forma segura, evitando colisiones de nombres de clases con otros componentes de la aplicación.

## Dependencias

-   **`react-router-dom`**: Utiliza el hook `useNavigate` para la acción de navegación por defecto del logo.
-   **`BannerHomeSection.module.css`**: Archivo de estilos CSS local y encapsulado para el componente.
-   **Imágenes**: Importa múltiples imágenes para el logo principal y el carrusel.

## Props (Propiedades)

| Prop            | Tipo               | Valor por Defecto              | Descripción                                                                                                                                      |
| --------------- | ------------------ | ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `title`         | `string`           | `undefined`                    | **(Requerido)** El título principal que se mostrará en el banner.                                                                                |
| `subtitle`      | `JSX \| string`    | `undefined`                    | **(Requerido)** El subtítulo del banner. Puede ser texto simple o un elemento JSX para un formato más complejo (ej. con `<br />` o `<strong>`). |
| `buttonText`    | `string`           | `undefined`                    | **(Requerido)** El texto que se mostrará en el botón de llamada a la acción.                                                                     |
| `buttonOnClick` | `function`         | `undefined`                    | **(Requerido)** La función que se ejecutará cuando el usuario haga clic en el botón.                                                             |
| `logoSrc`       | `string (import)`  | `PostDogLogin`                 | **(Opcional)** La fuente de la imagen para el logo principal. Por defecto, usa el logo de Postdog.                                               |
| `logoOnClick`   | `function`         | `() => navigate("/")`          | **(Opcional)** La función que se ejecutará al hacer clic en el logo. Si no se proporciona, redirigirá al usuario a la página de inicio (`/`).      |

## Uso

A continuación se muestra un ejemplo de cómo implementar el componente `BannerHomeSection` en una página.

```jsx
import BannerHomeSection from './components/home/BannerHomeSection/BannerHomeSection';

const MiPagina = () => {
  const handleRegisterClick = () => {
    console.log('Navegando a la página de registro...');
    // Lógica para redirigir al usuario
  };

  return (
    <div>
      <BannerHomeSection
        title="Tu Solución Completa de Envíos"
        subtitle={<>Conecta, cotiza y envía.<br/>Todo desde un solo lugar.</>}
        buttonText="Comenzar Ahora"
        buttonOnClick={handleRegisterClick}
      />
      {/* ... resto del contenido de la página ... */}
    </div>
  );
};

```
# Componente: `ContactSection`

## Descripción General

El componente `ContactSection` es una sección de llamada a la acción (CTA - Call to Action) final, diseñada para ser colocada típicamente al final de una página. Su propósito principal es motivar al usuario a realizar una acción clave, como registrarse, presentando un mensaje claro y un botón prominente.

Rutas:  src\components\home\ContactSection\ContactSection.jsx

## Características Clave

1.  **Diseño de Dos Columnas**: Presenta el contenido de manera visualmente atractiva, con el texto y el botón de CTA en una columna izquierda y una imagen representativa en la columna derecha.
2.  **Llamada a la Acción Clara**: Utiliza un título con texto acentuado, un subtítulo conciso y un botón con un texto directo (`Postdoguéate`) para guiar al usuario.
3.  **Redirección Dinámica**: El botón de CTA redirige al usuario a la página de registro. La URL de destino se construye dinámicamente utilizando una variable de entorno (`REACT_APP_WEBAPP_BASE_URL`), lo que permite configurar la ruta fácilmente para diferentes entornos (desarrollo, producción, etc.).
4.  **Manejo de Errores**: Incluye una verificación para asegurar que la variable de entorno esté definida, mostrando un error en la consola si no se encuentra, lo que facilita la depuración.
5.  **Estilo Encapsulado**: Emplea CSS Modules (`.module.css`) para aplicar estilos BEM de forma segura, garantizando que las clases no entren en conflicto con otros componentes en la aplicación.

## Dependencias

-   **`ContactSection.module.css`**: Archivo de estilos local que define la apariencia del componente.
-   **`PostDogContact` (Imagen)**: Recurso de imagen estático que se muestra en la sección.
-   **Variable de Entorno**: Requiere que `REACT_APP_WEBAPP_BASE_URL` esté definida en el archivo `.env` del proyecto para que la redirección del botón funcione correctamente.

## Props (Propiedades)

Este componente no acepta ninguna prop. Su contenido y comportamiento están completamente definidos internamente, lo que lo convierte en un componente estático y reutilizable "tal cual".

## Uso

El componente `ContactSection` está diseñado para ser insertado directamente en el layout de una página, usualmente antes del pie de página (footer).

```jsx
import ContactSection from './components/home/ContactSection/ContactSection';
import Footer from './components/Footer';

const MiPagina = () => {
  return (
    <div>
      {/* ... Otro contenido de la página ... */}
      
      <ContactSection />
      
      <Footer />
    </div>
  );
};


# Componente: `FaqSection`

## Descripción General

El componente `FaqSection` es una sección de Preguntas Frecuentes (FAQ) interactiva y animada. Presenta una lista de preguntas en un formato de acordeón, donde los usuarios pueden hacer clic en una pregunta para revelar suavemente la respuesta. Está diseñado para ser visualmente atractivo y funcional, utilizando la librería GSAP para animaciones fluidas.

## Características Clave

1.  **Acordeón Interactivo**: Solo una respuesta puede estar abierta a la vez. Al hacer clic en una nueva pregunta, la anterior se cierra automáticamente antes de que la nueva se abra.
2.  **Animaciones Fluidas con GSAP**: En lugar de depender de transiciones CSS, el componente utiliza la librería de animación GreenSock (GSAP) para controlar con precisión la animación de la propiedad `height`. Esto permite un efecto de despliegue y repliegue suave y de alto rendimiento.
3.  **Contenido Basado en Datos**: Todas las preguntas y respuestas se gestionan a través de un array local (`faqData`), lo que facilita enormemente la adición, eliminación o modificación del contenido sin tocar la lógica del JSX.
4.  **Diseño Responsivo**: Utiliza un hook personalizado (`useScreenResolution`) para adaptar su diseño a diferentes tamaños de pantalla, mostrando u ocultando elementos como el enlace "Contáctanos" según el dispositivo.
5.  **Hooks de React**:
    -   **`useState` (`openFaq`)**: Mantiene un registro de qué elemento del acordeón está actualmente abierto.
    -   **`useRef` (`faqBodyRefs`)**: Almacena referencias directas a los elementos DOM que contienen las respuestas. Esto es esencial para que GSAP pueda medir y animar su altura de forma dinámica.
6.  **Estilo Encapsulado**: Utiliza CSS Modules (`.module.css`) con una estructura BEM, asegurando que los estilos del componente no entren en conflicto con otros en la aplicación.

## Dependencias

-   **Librerías Externas**:
    -   `react`: Para la lógica del componente.
    -   `gsap`: Para las animaciones de apertura y cierre del acordeón.
-   **Hooks**:
    -   `useState`, `useRef` (React).
    -   `useScreenResolution` (Hook personalizado).
-   **Recursos**:
    -   `FaqSection.module.css`: Archivo de estilos local.
    -   `PostDogFaq` (Imagen): Ilustración que acompaña al acordeón.
    -   `ArrowRightIcon` (Componente): Icono utilizado en el enlace "Contáctanos".

## Props (Propiedades)

Este componente es autónomo y no acepta ninguna prop. Todo su contenido y comportamiento están definidos internamente.

## Uso

El componente `FaqSection` está diseñado para ser una sección "plug-and-play". Simplemente impórtalo y colócalo en el layout de la página donde necesites mostrar las preguntas frecuentes.

```jsx
import FaqSection from './components/home/FaqSection/FaqSection';

const HomePage = () => {
  return (
    <div>
      {/* ... otras secciones de la página ... */}
      
      <FaqSection />
      
      {/* ... más secciones ... */}
    </div>
  );
};
```
# Componente: `PostdogFeatureSection`

## Descripción General

El componente `PostdogFeatureSection` es una sección de características clave, diseñada para mostrar los principales beneficios o funcionalidades del servicio "Postdog" de una manera interactiva y visualmente atractiva. Utiliza un carrusel (slider) responsive para presentar la información en formato de tarjetas.

Rutas: src\components\home\PostdogFeatureSection\PostdogFeatureSection.jsx

## Características Clave

1.  **Carrusel de Características**: El núcleo del componente es un slider implementado con la librería **Swiper.js**. Permite a los usuarios deslizar o navegar a través de diferentes tarjetas de características.

2.  **Diseño Altamente Responsivo**:
    -   Utiliza un hook personalizado (`useScreenResolution`) para detectar el tamaño de la pantalla.
    -   En vistas de escritorio, el carrusel muestra múltiples tarjetas y utiliza botones de navegación (`<` y `>`).
    -   En vistas móviles, cambia a un modo de una sola tarjeta y utiliza paginación con puntos (`...`) para la navegación, ofreciendo una experiencia de usuario optimizada para pantallas táctiles.

3.  **Contenido Basado en Datos**: La información de cada tarjeta (título, texto, imagen, etc.) se gestiona a través de un array de objetos (`cardData`) definido fuera del componente. Esto desacopla el contenido de la lógica de presentación, facilitando las actualizaciones.

4.  **Configuración de Swiper Limpia**: Las complejas opciones de configuración de Swiper se agrupan en un objeto (`swiperConfig`) que se pasa al componente `<Swiper>`. Esta práctica mantiene el JSX limpio y legible.

5.  **Seguridad y Claridad en el Renderizado**: Evita el uso de `dangerouslySetInnerHTML`. En su lugar, el array `cardData` separa el texto normal (`title`) del texto que necesita un estilo especial (`accentedTitle`), que luego se renderizan de forma segura dentro de un `<span>`.

6.  **Estilo Encapsulado**: Aplica estilos BEM a través de CSS Modules (`.module.css`), lo que garantiza que las clases como `card-postdog` y `postdog-feature-section` sean locales y no causen conflictos con otros componentes.

## Dependencias

-   **Librerías Externas**:
    -   `react`: Para la lógica del componente.
    -   `swiper`: Para la funcionalidad del carrusel.
-   **Hooks**:
    -   `useScreenResolution` (Hook personalizado).
-   **Recursos**:
    -   `PostdogFeatureSection.module.css`: Archivo de estilos local.
    -   Imágenes (`Card1`, `Card2`, `Card3`): Recursos visuales para las tarjetas.

## Estructura de Datos (`cardData`)

El contenido de las tarjetas se define en un array donde cada objeto tiene la siguiente estructura:

| Clave           | Tipo     | Descripción                                                                 |
| --------------- | -------- | --------------------------------------------------------------------------- |
| `title`         | `string` | La primera parte del título de la tarjeta.                                  |
| `accentedTitle` | `string` | La parte del título que se mostrará con un color de acento. Puede ser `null`. |
| `text`          | `string` | El cuerpo del texto o descripción de la característica.                     |
| `linkText`      | `string` | El texto para el enlace de la tarjeta.                                      |
| `logo`          | `import` | La imagen importada que se mostrará en la tarjeta.                          |
| `bgColor`       | `string` | El color de fondo para el contenedor de la imagen de la tarjeta.            |

## Props (Propiedades)

Este componente es autónomo y no acepta ninguna prop. Su configuración se gestiona internamente.

## Uso

El componente `PostdogFeatureSection` se puede importar y utilizar directamente en cualquier página o layout que requiera una sección de características.

```jsx
import PostdogFeatureSection from './components/home/PostdogFeatureSection/PostdogFeatureSection';

const HomePage = () => {
  return (
    <div>
      {/* ... otras secciones ... */}
      <PostdogFeatureSection />
      {/* ... más secciones ... */}
    </div>
  );
};


```

# Componente: `HowItWorksSection`

## Descripción General

El componente `HowItWorksSection` es una sección visual e interactiva diseñada para explicar un proceso en una serie de pasos. Utiliza un diseño de línea de tiempo vertical (timeline) que alterna los pasos a izquierda y derecha, guiando al usuario a través del flujo de trabajo de "cómo empezar".

Rutas: src\components\home\WhatIsSection\WhatIsSection.jsx

## Características Clave

1.  **Línea de Tiempo Interactiva**: La sección es interactiva. Cuando el usuario pasa el cursor (`onMouseEnter`) sobre un paso, este se resalta visualmente, cambiando el color del número del paso y del título.

2.  **Animación de Divisor Dinámico**: Una característica central es la línea vertical que conecta los pasos. Su color cambia dinámicamente para resaltar el segmento correspondiente al paso activo. Esto se logra calculando un `linear-gradient` en JavaScript y aplicándolo como un estilo en línea, lo que permite una transición suave y visualmente atractiva.

3.  **Gestión de Estado Simple**: Utiliza el hook `useState` (`activeStep`) para mantener un registro del paso sobre el cual el usuario está posicionado. Este estado controla qué paso está "activo" y se utiliza para aplicar clases condicionales y calcular el gradiente del divisor.

4.  **Diseño Responsivo**: Aunque la lógica principal es para la vista de escritorio con la línea de tiempo, el CSS está preparado para colapsar en un diseño de una sola columna en dispositivos móviles, donde la línea de tiempo vertical se oculta para una mejor legibilidad.

5.  **Estilo Encapsulado y BEM**: Emplea CSS Modules (`.module.css`) para aplicar una nomenclatura BEM estricta. Esto asegura que los estilos de bloques como `how-it-works` y `step-item` sean locales y no interfieran con otros componentes.

## Lógica Interna y Funcionamiento

### Estado `activeStep`
-   `const [activeStep, setActiveStep] = useState(0);`
-   Inicializa el componente con el primer paso (`0`) como activo.
-   El evento `onMouseEnter` en cada `div` de paso actualiza este estado al índice del paso correspondiente.

### Función `getDividerGradient()`
-   Esta función es el corazón de la animación de la línea de tiempo.
-   Calcula los porcentajes de inicio y fin para el segmento de color basado en el `activeStep` actual.
-   Genera una cadena de CSS para un `linear-gradient`. Por ejemplo, si el `activeStep` es `1` (el segundo paso de 4), el gradiente coloreará la línea desde el 25% hasta el 50%.
-   Esta cadena se aplica al estilo en línea del `div` del divisor. La propiedad `transition` en el CSS se encarga de que el cambio de gradiente sea suave.

## Dependencias

-   **Librerías Externas**:
    -   `react` (específicamente el hook `useState`).
-   **Recursos**:
    -   `HowItWorksSection.module.css`: Archivo de estilos local del componente.
    -   Imágenes: `DogFaceIcon`, `footprintLogo`, `busLogo`, `imprintIcon`.

## Props (Propiedades)

Este componente es autónomo y no acepta ninguna prop. Su contenido y lógica están completamente definidos internamente.

## Uso

El componente `HowItWorksSection` se puede importar y colocar directamente en el layout de cualquier página que necesite explicar un proceso paso a paso.

```jsx
import HowItWorksSection from './components/home/HowItWorksSection/HowItWorksSection';

const HomePage = () => {
  return (
    <div>
      {/* ... otras secciones de la página ... */}
      
      <HowItWorksSection />
      
      {/* ... más secciones ... */}
    </div>
  );
};

```

# Componente: `WhySection`

## Descripción General

El componente `WhySection` es un componente visual y estructural diseñado para mostrar una característica clave de la interfaz de la aplicación de una manera atractiva. Su principal función es componer varias imágenes (un panel de fondo y un ícono superpuesto) para crear un escenario visual sobre el cual se renderiza el componente interactivo `TabsPostdog`.

El nombre "Why Section" sugiere que su propósito es responder a la pregunta "¿Por qué elegirnos?", mostrando una vista previa del producto en acción.

Rutas: src\components\home\WhySection\WhySection.jsx

## Características Clave

1.  **Composición Visual**: Combina múltiples assets visuales (`PanelDass` como fondo y `ChihuahuaPanel` como un ícono superpuesto) para crear un único elemento cohesivo y rico en detalles. El nombre de la clase `section-why__solapa` (solapa) sugiere un diseño que se superpone a otras secciones de la página.

2.  **Composición de Componentes**: Actúa como un contenedor o "escenario" para el componente `TabsPostdog`. En lugar de incluir la lógica de los tabs directamente, delega esa responsabilidad al componente hijo. Este patrón de diseño promueve la reusabilidad y la separación de preocupaciones.

3.  **Componente Presentacional**: Es un componente puramente presentacional. No gestiona ningún estado (`useState`), no tiene efectos secundarios (`useEffect`) ni contiene lógica compleja. Su única responsabilidad es la maquetación y la presentación visual.

4.  **Estilo Encapsulado**: Utiliza CSS Modules (`.module.css`) para aplicar estilos BEM, asegurando que sus clases (`section-why`, `section-why__solapa`, etc.) son locales y no causarán conflictos con otros estilos en la aplicación.

## Dependencias

-   **Componentes Internos**:
    -   `TabsPostdog/TabsPostdog.js`: Es una dependencia crucial, ya que este componente renderiza la funcionalidad principal de la sección.
-   **Estilos**:
    -   `WhySection.module.css`: Archivo de estilos local para el componente.
-   **Recursos (Imágenes)**:
    -   `ChihuahuaPanel`: Imagen del ícono.
    -   `PanelDass`: Imagen del panel de fondo.

## Props (Propiedades)

Este componente es autónomo y no acepta ninguna prop. Su contenido y estructura están definidos internamente.

## Uso

El componente `WhySection` está diseñado para ser importado y utilizado directamente en el layout de una página, como la página de inicio, donde se quiera mostrar una vista previa de la interfaz de la aplicación.

```jsx
import WhySection from './components/home/WhySection/WhySection';

const HomePage = () => {
  return (
    <div>
      {/* ... otras secciones ... */}
      
      <WhySection />
      
      {/* ... más secciones ... */}
    </div>
  );
};