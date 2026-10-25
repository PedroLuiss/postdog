import React from 'react';
import styles from './MissionVisionSection.module.scss';
import mascot from '../../../assets/img/about/dog_happy_red.png'; 

const MissionVisionSection = () => {
  return (
    <section className={styles['mission-vision']}>
      <div className={styles['mission-vision__container']}>
        
        <div className={styles['mission-vision__card']}>
          
          <h2 className={styles['mission-vision__main-title']}>Nuestra</h2>

          <div className={styles['mission-vision__content-wrapper']}>
            
            <div className={styles['mission-vision__column']}>
              <h3 className={styles['mission-vision__column-title']}>Misión</h3>
              <p className={styles['mission-vision__column-text']}>
                Hacer que enviar paquetes sea tan fácil como un clic: rápido, seguro y
                sin complicaciones, para que cada negocio se concentre en lo que mejor
                sabe hacer.
              </p>
            </div>

            <div className={styles['mission-vision__column']}>
              <h3 className={styles['mission-vision__column-title']}>Visión</h3>
              <p className={styles['mission-vision__column-text']}>
                Construir una comunidad donde cada envío sea una experiencia positiva,
                posicionando a Postdog como la forma más práctica y amigable de
                enviar en Latinoamérica.
              </p>
            </div>

          </div>
        </div>

        <img 
          src={mascot} 
          alt="Mascota de Postdog" 
          className={styles['mission-vision__mascot']} 
        />
      </div>
    </section>
  );
};

export default MissionVisionSection;