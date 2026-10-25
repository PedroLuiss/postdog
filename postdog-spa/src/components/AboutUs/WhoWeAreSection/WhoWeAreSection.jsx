import React from 'react';
import styles from './WhoWeAreSection.module.scss';
import logo from '../../../assets/img/about/logo_white.png'; 

const WhoWeAreSection = () => {
  return (
    <section className={styles['about-section']}>
      
      <div className={styles['about-section-content__logo']}>
        <img 
          src={logo} 
          alt="Logo de Postdog" 
          className={styles['about-section__logo']} 
        />

      </div>

      <h2 className={styles['about-section__title']}>
        ¿Quiénes{' '}
        <span className={styles['about-section__text--highlight']}>
          somos
        </span>
        ?
      </h2>

      <p className={styles['about-section__description']}>
        En{' '}
        <span className={styles['about-section__text--highlight']}>
          Postdog
        </span>{' '}
        somos personas como tú: emprendedores, creativos y soñadores. 
        Sabemos lo que significa enviar productos, preocuparse por los costos 
        y la experiencia de tus clientes. Por eso, diseñamos una plataforma 
        que hace que tus envíos sean fáciles, rápidos y con precios justos.
      </p>

    </section>
  );
};

export default WhoWeAreSection;