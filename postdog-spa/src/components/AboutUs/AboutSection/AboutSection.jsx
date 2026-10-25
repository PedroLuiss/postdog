import styles from './AboutSection.module.scss';

import dogIllustration from '../../../assets/img/about/dog_family_red.png';

const AboutSection = () => {
  return (
    <section className={styles['about-section']}>
      <div className={styles['about-section__container']}>
        <div className={styles['about-section__image-wrapper']}>
          <img
            src={dogIllustration}
            alt="Ilustración de un grupo de perros de Postdog"
            className={styles['about-section__image']}
          />
        </div>

        <div className={styles['about-section__content']}>
          <h2 className={styles['about-section__title']}>
            Acerca de <span className={styles['about-section__title--highlight']}>Postdog</span>
          </h2>
          <p className={styles['about-section__description']}>
            <span className={styles['about-section__description--highlight']}>Postdog</span> es una plataforma pensada para
            emprendedores, negocios y personas que
            buscan enviar paquetes de forma sencilla,
            rápida y sin pagar de más. Nos enfocamos
            en hacer que cada envío sea claro, accesible
            y confiable, porque sabemos lo importante
            que es para ti que tus productos lleguen
            bien y a tiempo.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;