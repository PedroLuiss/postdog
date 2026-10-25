import styles from './HelpSection.module.scss';
import mascotIllustration from '../../../assets/img/about/dog_contact_red.png'; 

const HelpSection = () => {
  return (
    <section className={styles['help-section']}>
      <div className={styles['help-section__container']}>
        
        <div className={styles['help-section__content']}>
          <h2 className={styles['help-section__title']}>
            ¿Necesitas una{' '}
            <span className={styles['help-section__text--highlight']}>
              pata
            </span>
            ?
          </h2>
          <p className={styles['help-section__description']}>
            Estamos aquí para ayudarte en lo que necesites.
          </p>
          <a
            href={`https://wa.me/${process.env.REACT_APP_WHATSAPP_NUMBER_CONTACT}`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles['help-section__cta-button']}
          >
            Contáctanos por Whatsapp
          </a>
        </div>

        <div className={styles['help-section__image-wrapper']}>
          <img 
            src={mascotIllustration} 
            alt="Ilustración de la mascota de Postdog con un walkie-talkie" 
            className={styles['help-section__image']} 
          />
        </div>

      </div>
    </section>
  );
};

export default HelpSection;