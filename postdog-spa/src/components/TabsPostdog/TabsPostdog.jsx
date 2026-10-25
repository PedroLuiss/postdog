import { useState } from 'react';
import styles from './TabsPostdog.module.css';

const tabsData = [
    { id: 1, title: 'Envíos', content: 'Haz que tus paquetes salgan corriendo con solo unos clics. Cotiza, genera tu guía y mándalos a su destino.' },
    { id: 2, title: 'Órdenes', content: 'Tus pedidos, bajo control. Conecta tu tienda y deja que la manada trabaje por ti.' },
    { id: 3, title: 'Recolecciones', content: 'Pide que pasen por tu envío sin mover una pata. Nosotros ladramos y ellos recogen.' },
    { id: 4, title: 'Finanzas', content: 'Controla tus finanzas. Ve tus movimientos, abona saldo y mantén a tu manada bien organizada.' },
    { id: 5, title: 'Integraciones', content: 'Sincroniza tu tienda y que todos tus pedidos lleguen como si siguieran el mismo rastro. ¡Más fácil que enseñarle a un perro a sentarse!' }
];

const TabsPostdog = () => {
    const [activeTab, setActiveTab] = useState(1);

    const handleTabClick = (tabId) => {
        setActiveTab(tabId);
    };

    return (
        <div className={styles.wrapper}>
            <div className="col-12 d-flex align-items-center justify-content-center position-relative">
                <ul className={`${styles['tabs-postdog']} ${styles[`tabs-postdog-${activeTab}`]}`}>
                    {tabsData.map((tab) => (
                        <li key={tab.id}>
                            <button
                                className={`
                                    btn 
                                    ${styles['tabs-postdog__btn']} 
                                    ${activeTab === tab.id ? styles['tabs-postdog__btn--active'] : ''}
                                `}
                                onClick={() => handleTabClick(tab.id)}
                            >
                                {tab.title}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            <div className={styles['tabs-postdog__content-container']}>
                {tabsData.map((tab) => (
                    <div
                        key={tab.id}
                        className={`
                            ${styles['tabs-postdog__tab']} 
                            ${activeTab === tab.id ? styles['tabs-postdog__tab--active'] : ''}
                        `}
                    >
                        <p className={styles['tabs-postdog__tab-text']}>
                            {tab.content}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TabsPostdog;