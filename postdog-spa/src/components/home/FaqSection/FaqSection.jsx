import React, { useState, useRef } from 'react';
import gsap from 'gsap';
import useScreenResolution from '../../../hooks/useScreenResolution';

import styles from './FaqSection.module.css';

import PostDogFaq from '../../../assets/img/Home/DogpostFapNew.png';
import { ArrowRightIcon } from '../../icons/ArrowRightIcon';
import { Link } from 'react-router-dom';

const FaqSection = () => {
    const { isMovil, is390 } = useScreenResolution();

    const faqData = [
        { question: "¿Puedo enviar aunque tenga pocos pedidos?", answer: "¡Guau que sí! No necesitas tener una tienda grande. Desde un solo envío ya puedes usar Postdog y aprovechar tarifas especiales." },
        { question: "¿Puedo conectar mi tienda en línea?", answer: "¡Sí! Puedes integrar tu tienda de Shopify, WooCommerce, (y más próximamente) para importar tus pedidos y generar guías automáticamente." },
        { question: "¿Qué paqueterías están disponibles?", answer: "Trabajamos con las principales: FedEx, Estafeta, J&T y DHL. Siempre buscamos sumar nuevas opciones para darte más alcance y mejores precios." },
        { question: "¿Cuánto cuesta usar Postdog?", answer: "Nada por registrarte. Solo pagas por las guías que generas, sin mensualidades ni cargos ocultos. ¡Y siempre buscamos darte el mejor precio!" },
        { question: "¿Puedo usar Postdog si vendo por alguna red social?", answer: "¡Sí! No necesitas una tienda formal. Puedes generar guías para cualquier envío, sin importar dónde vendes." },
        { question: "¿Ofrecen recolección a domicilio?", answer: "¡Guau que sí! Muchas paqueterías permiten programar recolecciones desde tu casa o negocio. Así no mueves ni una patita." },
        { question: "¿Mi información está segura?", answer: "Sí, tomamos tu seguridad muy en serio. Tus datos y guías están protegidos por perritos expertos en tecnología." }
    ];

    const [openFaq, setOpenFaq] = useState(null);
    const faqBodyRefs = useRef([]);

    const handleFaqClick = idx => {
        if (openFaq === idx) {
            const el = faqBodyRefs.current[idx];
            gsap.to(el, { height: 0, duration: 0.5, ease: 'power2.inOut', onComplete: () => setOpenFaq(null) });
        } else {
            if (openFaq !== null) {
                const prevEl = faqBodyRefs.current[openFaq];
                if (prevEl) gsap.to(prevEl, { height: 0, duration: 0.5, ease: 'power2.inOut' });
            }
            setTimeout(() => {
                setOpenFaq(idx);
                const el = faqBodyRefs.current[idx];
                el.style.height = 'auto';
                const autoHeight = el.scrollHeight;
                gsap.fromTo(el, { height: 0 }, { height: autoHeight, duration: 0.5, ease: 'power2.inOut', onComplete: () => el.style.height = 'auto' });
            }, openFaq !== null ? 10 : 0);
        }
    };

    return (
        <section className={styles['faq-postdog']}>
            <div className={styles['faq-postdog__container']}>
                <div className={styles['faq-postdog__header']}>
                    <h3 className={styles['faq-postdog__title']}>
                        Preguntas que haría cualquier <span className={styles['faq-postdog__title--accent']}>buen perrito</span> curioso:
                    </h3>
                    {!(isMovil || is390  ) && (
                        <Link to="/" className={styles['faq-postdog__link']}>
                            Contáctanos <ArrowRightIcon />
                        </Link>
                    )}
                </div>
                <div className={`row ${styles['faq-postdog__content']}`}>
                    <div className="col-md-7 col-12">
                        <div className={styles['faq-postdog__accordion']}>
                            {faqData.map((item, idx) => (
                                <div className={styles['faq-postdog__item']} key={idx}>
                                    <h2 className='mb-0'>
                                        <button
                                            type="button"
                                            onClick={() => handleFaqClick(idx)}
                                            className={`${styles['faq-postdog__button']} ${openFaq !== idx ? styles['faq-postdog__button--collapsed'] : ''}`}
                                        >
                                            {item.question}
                                            <span className={`${styles['faq-postdog__toggle']} ${openFaq === idx ? styles['faq-postdog__toggle--open'] : ''}`}>
                                                <span></span>
                                                <span></span>
                                            </span>
                                        </button>
                                    </h2>
                                    <div
                                        ref={el => faqBodyRefs.current[idx] = el}
                                        className={styles['faq-postdog__item-body']}
                                        style={{ height: 0 }}
                                    >
                                        <div className={styles['faq-postdog__item-text']}>
                                            {item.answer}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="col-md-5 col-12 d-flex justify-content-start align-items-center">
                        <img src={PostDogFaq} alt="Perro chihuahua con laptop ilustrando preguntas frecuentes" className={styles['faq-postdog__image']} />
                    </div>
                    {(isMovil || is390 ) && (
                        <a href="#" className={styles['faq-postdog__link']}>Contáctanos <ArrowRightIcon /></a>
                    )}
                </div>
            </div>
        </section>
    );
};

export default FaqSection;