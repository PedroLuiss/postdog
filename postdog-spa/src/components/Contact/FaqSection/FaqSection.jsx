import { useState } from 'react';
import styles from './FaqSection.module.scss';

const faqData = [
    {
        title: '1. Uso de la plataforma',
        content: [
            {
                question: '¿Puedo enviar aunque tenga pocos pedidos?',
                answer: 'Sí, Postdog está pensado para emprendedores y negocios de cualquier tamaño, incluso si envías pocos paquetes.',
            },
            {
                question: '¿Cómo creo una cuenta en Postdog?',
                answer: 'Solo ingresa a la web, haz clic en "Regístrate" y sigue los pasos. Es rápido y gratis.',
            },
            {
                question: '¿Puedo usar Postdog si vendo por redes sociales?',
                answer: '¡Claro! Funciona con cualquier canal de ventas: tiendas en línea, redes sociales o marketplaces.',
            },
        ],
    },
    {
        title: '2. Integraciones y tiendas',
        content: [
            {
                question: '¿Puedo conectar mi tienda en línea?',
                answer: 'Sí, Postdog se integra con varias plataformas de e-commerce para sincronizar pedidos automáticamente.',
            }
            , {
                question: '¿Qué pasa si mi tienda no está en la lista de integraciones?',
                answer: 'Puedes registrar tus pedidos manualmente en la plataforma sin problemas.',
            }
        ],
    },
    {
        title: '3. Envíos y paqueterías',
        content: [
            {
                question: '¿Qué paqueterías están disponibles?',
                answer: 'Trabajamos con las principales paqueterías nacionales, con opciones de precio, tiempo de entrega y cobertura.',
            },
            {
                question: '¿Ofrecen recolección a domicilio?',
                answer: 'Sí, puedes programar la recolección en tu domicilio o negocio para ahorrar tiempo.',
            },
            {
                question: '¿Hay límite de tamaño o peso de los paquetes?',
                answer: 'Cada paquetería tiene sus propias restricciones; Postdog te mostrará las opciones disponibles según tu paquete.',
            },
            {
                question: '¿Puedo rastrear mis envíos?',
                answer: 'Sí, cada envío tiene seguimiento en tiempo real dentro de la plataforma de cada paquetería.',
            }
        ],
    },
    {
        title: '4. Costos y pagos',
        content: [
            {
                question: '¿Cuánto cuesta usar Postdog?',
                answer: 'Crear tu cuenta y cotizar envíos es gratis. Solo pagas por los envíos que realices, sin tarifas ocultas.',
            },
            {
                question: '¿Hay descuentos por volumen de envíos?',
                answer: 'Sí, Postdog ofrece tarifas preferenciales para quienes envían grandes volúmenes.',
            }
        ],
    },
    {
        title: '5. Seguridad y privacidad',
        content: [
            {
                question: '¿Mi información está segura?',
                answer: 'Sí, Postdog protege tus datos con tecnología segura y cumplimiento de normas de privacidad.',
            },
            {
                question: '¿Qué pasa si hay un problema con un envío?',
                answer: 'Nuestro equipo te ayudará a resolver cualquier incidencia con rapidez y seguimiento completo.',
            }
        ],
    },
];

const FaqSection = () => {
    const [openIndex, setOpenIndex] = useState(0);

    const handleToggle = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className={styles['faq-section']}>
            <h2 className={styles['faq-section__title']}>
                ¿Cómo podemos <span className={styles['faq-section__title--highlight']}>ayudarte?</span>
            </h2>

            <div className={styles['faq-section__accordion']}>
                {faqData.map((item, index) => (
                    <div className={styles['faq-section__accordion-item']} key={index}>
                        <div
                            className={styles['faq-section__accordion-header']}
                            onClick={() => handleToggle(index)}
                        >
                            {item.title}
                        </div>
                        <div
                            className={`${styles['faq-section__accordion-content']} ${openIndex === index ? styles['faq-section__accordion-content--open'] : ''
                                }`}
                        >
                            <div className={styles['faq-section__accordion-content-inner']}>
                                <div className={styles['faq-section__qa-list']}>
                                    {item.content.map((qa, qaIndex) => (
                                        <div className={styles['faq-section__qa-item']} key={qaIndex}>
                                            <p className={styles['faq-section__question']}>{qa.question}</p>
                                            <p className={styles['faq-section__answer']}>{qa.answer}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className={styles['faq-section__contact-info']}>
                <p className={styles['faq-section__contact-info__schedule']}>Horario de atención: Lunes a Viernes, 9:00 – 18:00</p>
                <p className='mb-0'>
                    Escríbenos a <a href="mailto:soporte@mypostdog.com" className={styles['faq-section__contact-email']}>soporte@mypostdog.com</a>
                </p>
            </div>
        </section>
    );
};

export default FaqSection;