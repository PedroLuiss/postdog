import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import useScreenResolution from '../../../hooks/useScreenResolution';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import styles from './PostdogFeatureSection.module.css';
import Card1 from "../../../assets/img/Home/DogPostSlider2.png";
import Card1White from "../../../assets/img/Home/dog_box_white.png";
import Card2White from "../../../assets/img/Home/DogPostSlider1.png";
import Card2 from "../../../assets/img/Home/dog_drag_red.png";
import Card3 from "../../../assets/img/Home/DogPostSlider3.png";
import Card3White from "../../../assets/img/Home/DogPostSliderWhite.png";
import Card4 from "../../../assets/img/Home/DogPostSlider4.png";
import Card5 from "../../../assets/img/Home/dog_finances 1.png";
import CardWhite from "../../../assets/img/Home/dog_finance_white 1.png";
import Card4White from "../../../assets/img/Home/DogPostSlider4white.png";

const cardData = [
    { title: "Lleva tus finanzas de ", accentedTitle: "la correa", text: "Lleva el control de recargas, facturación y métricas de tus envíos. También gestiona sobrepesos fácilmente, porque un perrito ordenado nunca pierde la cuenta.", linkText: "Ver finanzas", logo: Card5, logoWhite: CardWhite },
    { title: "Tus pedidos están en ", accentedTitle: "patas expertas", text: "Sabemos que confiar tus paquetes es importante. Por eso, nos aseguramos de que todo esté bien cuidado desde que inicias hasta que se recoge. Tu envío en buenas patas.", linkText: "Ver historial de envíos", logo: Card1, logoWhite: Card1White },
    { title: "Precios que ", accentedTitle: "no muerden", text: "Desde el primer clic, tu perrito guía se lanza directo a conseguirte la tarifa más baja. Cotiza, genera tu guía y listo: puro ahorro colmilludo.", linkText: "Cotiza tu envío", logo: Card2, logoWhite: Card2White },
    { title: <>¡Corre, <span className={styles['postdog-feature-section__text--accent']}>perrito</span> corre!</>, accentedTitle: null, text: "Recolectamos, rastreamos y entregamos con velocidad canina, gracias a nuestras alianzas con las paqueterías más confiables. Porque un buen perrito siempre tiene energía.", linkText: "Programa una recolección", logo: Card3, logoWhite: Card3White },
    { title: "Integraciones que ", accentedTitle: "dan la pata", text: "Conecta tu tienda en línea con Postdog y olvídate de capturar datos manualmente. Importa pedidos, genera guías y gestiona tus envíos en un solo lugar.", linkText: "Configura tu integración", logo: Card4, logoWhite: Card4White },
];

const PostdogFeatureSection = () => {
    const { is768, isMovil, is390 } = useScreenResolution();
    const navigate = useNavigate();

    const isMobileView = is768 || isMovil || is390;

    const swiperConfig = {
        modules: [Pagination, Navigation],
        pagination: isMobileView ? { dynamicBullets: true } : false,
        navigation: !isMobileView ? {
            nextEl: '.swiper-button-next--custom',
            prevEl: '.swiper-button-prev--custom',
        } : false,

        breakpoints: {
            300: {
                slidesPerView: 1,
                spaceBetween: 50,
                centeredSlides: false,
                loop: true
            },
            768: {
                slidesPerView: 1,
                spaceBetween: 5,
                centeredSlides: false,
                loop: true
            },
            1024: {
                slidesPerView: 3,
                spaceBetween: 50,
                centeredSlides: false,
                loop: true
            },
            1440: {
                slidesPerView: 3,
                spaceBetween: 100,
                centeredSlides: false,
                loop: true
            },
            1800: {
                slidesPerView: 3,
                spaceBetween: 50,
                centeredSlides: false,
                loop: true
            }
        }
    };

    const handleCardClick = () => {
        navigate(`/`);
    };

    return (
        <section className={styles['postdog-feature-section']}>
            <div className={styles['postdog-feature-section__container']}>
                <h3 className={styles['postdog-feature-section__title']}>
                    Postdoguéate con <span className={styles['postdog-feature-section__text--accent']}>Postdog</span>
                </h3>
                <p className={styles['postdog-feature-section__subtitle']}>Simplifica tus envíos</p>
            </div>

            <div className={styles['postdog-feature-section__slider-wrapper']}>
                <Swiper {...swiperConfig} key={isMobileView ? 'mobile' : 'desktop'} className={styles['postdog-feature-section__slider']}>
                    {cardData.map((card, index) => (
                        <SwiperSlide key={index}>
                            <div className={styles['card-postdog']} onClick={() => handleCardClick()}>
                                <div className={styles['card-postdog__image-container']} >
                                    <img
                                        src={card.logo}
                                        alt={card.title}
                                        className={`${styles['card-postdog__image']} ${styles['card-postdog__image--original']}`}
                                    />
                                    <img
                                        src={card.logoWhite}
                                        alt={card.title}
                                        className={`${styles['card-postdog__image']} ${styles['card-postdog__image--hover']}`}
                                    />
                                </div>
                                <div className={styles['card-postdog__body']}>
                                    <div>
                                        <h4 className={styles['card-postdog__title']}>
                                            {card.title}
                                            {card.accentedTitle && <span className={styles['postdog-feature-section__text--accent']}>{card.accentedTitle}</span>}
                                        </h4>
                                        <p className={styles['card-postdog__text']}>{card.text}</p>
                                    </div>
                                    <a href="#" className={styles['card-postdog__link']}>
                                        {card.linkText}
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                            <path fillRule="evenodd" d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8" />
                                        </svg>
                                    </a>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>

                {!isMobileView && (
                    <div className={styles['postdog-feature-section__nav']}>
                        <div className="swiper-button-prev swiper-button-prev--custom"></div>
                        <div className="swiper-button-next swiper-button-next--custom"></div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default PostdogFeatureSection;