import styles from './ContactSection.module.css';

import PostDogContact from '../../../assets/img/Home/DogPostChihuahua.png'; 

const ContactSection = () => {
    
    const handleButtonClick = () => {
       console.log("Button clicked");
       
    };

    return (
        <section className={styles['section-contact']}>
            <div className={styles['section-contact__container']}>
                <div className={styles['section-contact__left']}>
                    <h2 className={styles['section-contact__title']}>
                        <span className={styles['section-contact__title--accent']}>Postdoguea</span> tus envíos
                    </h2>
                    <div className={styles['section-contact__subtitle']}>
                        Cambia tu forma de enviar, sé parte de Postdog.
                    </div>
                    <button onClick={handleButtonClick} className={styles['section-contact__cta-btn']}>
                       Postdoguéate
                    </button>
                </div>
                <div className={styles['section-contact__right']}>
                    <img src={PostDogContact} alt="Chihuahua de PostDog" className={styles['section-contact__img']} />
                </div>
            </div>
        </section>
    );
};

export default ContactSection;