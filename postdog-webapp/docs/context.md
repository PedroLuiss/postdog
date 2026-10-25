# React Context: `ShippingQuoteDrawer`

## Descripción General

El `ShippingQuoteDrawerContext` es un sistema de gestión de estado global diseñado para controlar la visibilidad y el contenido de los modales de tipo "Drawer" (paneles laterales) relacionados con la cotización y edición de envíos en la aplicación.

Su propósito principal es centralizar el estado, evitando el "prop drilling" (pasar props a través de múltiples niveles de componentes). Cualquier componente anidado dentro de `ShippingQuoteDrawerProvider` puede acceder y manipular el estado de los drawers y la orden en edición.

El sistema se compone de tres partes principales:

1.  **`ShippingQuoteDrawerContext`:** El objeto de contexto de React creado con `createContext`.
2.  **`ShippingQuoteDrawerProvider`:** El componente proveedor que envuelve a una parte de la aplicación y contiene toda la lógica de estado (`useState`).
3.  **`useShippingQuoteDrawer`:** El custom hook que permite a los componentes consumir el contexto de una manera limpia y segura.

## Responsabilidades Clave

- **Gestionar la Visibilidad de Múltiples Drawers:** Controla el estado de apertura/cierre de dos drawers distintos: uno para la cotización general (`isOpen`) y otro específico para la edición de una orden (`isDrawerOpenEditOrder`).
- **Almacenar la Orden Activa:** Mantiene en su estado el objeto `order` (`Shipment`) que se está editando actualmente, haciéndolo accesible a componentes como `FinalizeShippingModal`.
- **Proveer un Estado de Carga Global:** Ofrece un estado booleano (`longingBtnSend`) para manejar el estado de carga de un botón de envío principal, permitiendo que diferentes componentes puedan activarlo o consultarlo.
- **Exponer Acciones:** Proporciona funciones claras (`openDrawer`, `closeDrawer`, `setOrder`, etc.) para que los componentes consumidores puedan modificar el estado de manera controlada.

---

## Contenido del Contexto (Valor Proveído)

El hook `useShippingQuoteDrawer` retorna un objeto con las siguientes propiedades:

| Clave                   | Tipo                            | Descripción                                                                                                 |
| :---------------------- | :------------------------------ | :---------------------------------------------------------------------------------------------------------- |
| `isOpen`                | `boolean`                       | `true` si el drawer principal de cotización está abierto.                                                   |
| `isDrawerOpenEditOrder` | `boolean`                       | `true` si el drawer para editar una orden está abierto.                                                     |
| `openDrawer`            | `() => void`                    | Función para abrir el drawer de cotización principal.                                                       |
| `closeDrawer`           | `() => void`                    | Función para cerrar el drawer de cotización principal.                                                      |
| `openDrawerEditOrde`    | `() => void`                    | Función para abrir el drawer de edición de orden.                                                           |
| `closeDrawerEditOrde`   | `() => void`                    | Función para cerrar el drawer de edición de orden.                                                          |
| `longingBtnSend`        | `boolean`                       | Estado de carga para un botón de envío. **Nota:** Contiene un posible error tipográfico (`longing` vs `loading`). |
| `setLongingBtnSend`     | `(value: boolean) => void`      | Función para actualizar el estado de carga del botón.                                                       |
| `order`                 | `Shipment \| null`              | El objeto de la orden (`Shipment`) que se está editando actualmente, o `null` si no hay ninguna.            |
| `setOrder`              | `(order: Shipment) => void`     | Función para establecer la orden que se va a editar.                                                        |

---

## Uso

Para utilizar este contexto, sigue dos pasos:

### 1. Envolver la Aplicación con el `Provider`

En un componente de alto nivel (como `App.tsx` o un layout principal), envuelve los componentes que necesitarán acceso al estado del drawer con `ShippingQuoteDrawerProvider`.

```jsx
// En App.tsx o un componente de layout

import { ShippingQuoteDrawerProvider } from './context/ShippingQuoteDrawerContext';
import { MyPages } from './pages';
import { FinalizeShippingModal } from './components/FinalizeShippingModal';

function App() {
  return (
    <ShippingQuoteDrawerProvider>
      {/* El resto de tu aplicación */}
      <MyPages />
      
      {/* El modal puede estar aquí y se mostrará cuando el estado del contexto cambie */}
      <FinalizeShippingModal />
    </ShippingQuoteDrawerProvider>
  );
}
```

### 2. Consumir el Contexto en un Componente Hijo

Dentro de cualquier componente anidado en el `Provider`, usa el hook `useShippingQuoteDrawer` para acceder al estado y a las funciones.

```jsx
// En un componente que lista órdenes (ej. OrdersList.tsx)

import { useShippingQuoteDrawer } from '../context';
import { Shipment } from '../types';

const OrdersList = ({ orders }) => {
  // Obtenemos las funciones y el estado que necesitamos del contexto
  const { openDrawerEditOrde, setOrder } = useShippingQuoteDrawer();

  const handleEditClick = (orderToEdit: Shipment) => {
    // 1. Guardamos la orden a editar en el estado del contexto
    setOrder(orderToEdit);
    // 2. Abrimos el modal de edición
    openDrawerEditOrde();
  };

  return (
    <div>
      {orders.map(order => (
        <div key={order.id}>
          <span>Orden #{order.id}</span>
          <button onClick={() => handleEditClick(order)}>
            Editar
          </button>
        </div>
      ))}
    </div>
  );
};
```

---


### 2. `useShippingQuoteDrawer` (Hook Consumidor)

Es un **custom hook** que simplifica el consumo de este contexto. Cualquier componente funcional anidado dentro de `ShippingQuoteDrawerProvider` puede usar este hook para acceder y manipular el estado del drawer.

#### Retorno

El hook devuelve el objeto completo del contexto (`ShippingQuoteDrawerContextType`).

#### Uso del Hook

**Ejemplo 1: Un botón en el Header para abrir el drawer**

```jsx
// En un componente Header.tsx
import React from 'react';
import { useShippingQuoteDrawer } from './path/to/ShippingQuoteDrawerContext';

const Header = () => {
  const { openDrawer } = useShippingQuoteDrawer();

  return (
    <header>
      <button onClick={openDrawer}>Cotizar Envío</button>
    </header>
  );
};
```

**Ejemplo 2: El propio componente Drawer que se controla a sí mismo**

```jsx
// En un componente ShippingDrawer.tsx
import React from 'react';
import { useShippingQuoteDrawer } from './path/to/ShippingQuoteDrawerContext';

const ShippingDrawer = () => {
  const { isOpen, closeDrawer, longingBtnSend, setLongingBtnSend } = useShippingQuoteDrawer();

  const handleFormSubmit = async () => {
    setLongingBtnSend(true); // Inicia el estado de carga
    try {
      // await apiCall(...);
      closeDrawer(); // Cierra el drawer en caso de éxito
    } catch (error) {
      // Manejar error
    } finally {
      setLongingBtnSend(false); // Finaliza el estado de carga
    }
  };

  if (!isOpen) {
    return null; // El drawer no se renderiza si no está abierto
  }

  return (
    <div className="drawer">
      <button onClick={closeDrawer}>Cerrar</button>
      {/* Contenido del formulario del drawer */}
      <button onClick={handleFormSubmit} disabled={longingBtnSend}>
        {longingBtnSend ? 'Enviando...' : 'Enviar Cotización'}
      </button>
    </div>
  );
};
```

### Manejo de Errores

El hook `useShippingQuoteDrawer` incluye una verificación de seguridad. Si se intenta utilizar fuera de un `ShippingQuoteDrawerProvider`, lanzará un `Error` con un mensaje claro, previniendo errores en tiempo de ejecución y facilitando la depuración.