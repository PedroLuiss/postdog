import React, { useState, useEffect, useRef } from 'react';
import styles from './HowItWorksSection.module.css';

import DogFaceIcon from '../../../assets/img/Home/logo_red.png';
import footprintLogo from '../../../assets/img/Home/Vector.png';
import busLogo from '../../../assets/img/Home/iconBus.png';
import imprintIcon from '../../../assets/img/Home/imprintIcon.png';

const stepsData = [
    {
        number: 1,
        title: 'Postdoguéate fácil',
        description: 'Abre tu cuenta en segundos y empieza a enviar sin complicaciones.',
        icon: DogFaceIcon,
        alt: 'Icono de cara de perro',
        align: 'left',
    },
    {
        number: 2,
        title: 'Deja tu huella',
        description: 'Registra los datos de tu paquete: origen, destino, peso y medidas.',
        icon: footprintLogo,
        alt: 'Icono de huella de perro',
        align: 'right',
    },
    {
        number: 3,
        title: 'Sigue el mejor rastro',
        description: 'Compara precios y tiempos de entrega; elige la ruta ideal para ti.',
        icon: busLogo,
        alt: 'Icono de camión de reparto',
        align: 'left',
    },
    {
        number: 4,
        title: 'Ponle placa a tu paquete',
        description: 'Descarga tu guía, imprime tu etiqueta y deja que Postdog haga el resto.',
        icon: imprintIcon,
        alt: 'Icono de guía de envío',
        align: 'right',
    },
];


const HowItWorksSection = () => {
    const [activeStep, setActiveStep] = useState(0);
    const [progressHeight, setProgressHeight] = useState('0%');
    const timelineRef = useRef(null);
    const stepRefs = useRef([]);

    useEffect(() => {
        const handleScroll = () => {
            if (!timelineRef.current) return;

            const triggerPoint = window.scrollY + window.innerHeight / 2;
            let currentActiveStep = -1;

            stepRefs.current.forEach((stepEl, index) => {
                if (stepEl) {
                    const stepTop = stepEl.offsetTop + timelineRef.current.offsetTop;

                    if (triggerPoint >= stepTop) {
                        currentActiveStep = index;
                    }
                }
            });

            setActiveStep(currentActiveStep);
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll(); 

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);


    useEffect(() => {
        let progressPercent = "0%";
        switch (activeStep) {
            case 0:
                progressPercent = "25%";
                break;
            case 1:
                progressPercent = "50%";
                break;
            case 2:
                progressPercent = "75%";
                break;
            case 3:
                progressPercent = "100%";
                break;
            default:
                progressPercent = "0%";
                break;
        }
        setProgressHeight(progressPercent);
    }, [activeStep]);

    return (
        <section className={styles['how-it-works-section']}>
            <div className={styles['how-it-works-section__container']}>
                <h2 className={styles['how-it-works__title']}>
                    ¿Cómo empiezo a enviar con <span className={styles['how-it-works__title--accent']}>Postdog</span>?
                </h2>

                <div className={styles['how-it-works__timeline']} ref={timelineRef}>
                    <div
                        className={styles['how-it-works__divider']}
                        style={{ '--progress-height': progressHeight }}
                    ></div>

                    {stepsData.map((step, index) => {
                        const isLeft = step.align === 'left';
                        const StepContent = (
                            <>
                                <div className={styles['step-item__content']}>
                                    <div className={styles['step-item__header']}>
                                        <span className={styles['step-item__number']}>{step.number}</span>
                                        <h3 className={styles['step-item__title']}>{step.title}</h3>
                                    </div>
                                    <p className={styles['step-item__description']}>{step.description}</p>
                                </div>
                                <div className={styles[isLeft ? 'wrapper-img' : '']}>
                                    <div className={styles['step-item__img-wrapper']}>
                                        <img src={step.icon} alt={step.alt} className={'step-item__img-icon-'+step.number} />
                                    </div>
                                </div>
                            </>
                        );

                        return (
                            <div
                                key={step.number}
                                ref={el => stepRefs.current[index] = el}
                                className={`${styles['step-item']} ${isLeft ? styles['step-item--left'] : styles['step-item--right']} ${activeStep >= index ? styles['step-item--active'] : ''}`}
                            >
                                {isLeft ? StepContent :
                                    <>
                                        {StepContent.props.children[1]}
                                        {StepContent.props.children[0]}
                                    </>
                                }
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default HowItWorksSection;