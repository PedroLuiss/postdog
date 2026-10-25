import ChihuahuaPanel from '../../../assets/img/chihuahuapanel.png'; 
import PanelDass from '../../../assets/img/panel.png'; 

import TabsPostdog from '../../TabsPostdog/TabsPostdog'; 

import styles from './WhySection.module.css';

const WhySection = () => {
    return (
        <section className={`${styles['section-why']} text-center`}>
            <div className={styles['section-why__solapa']}>
                <img src={ChihuahuaPanel} alt="Ícono de chihuahua sobre el panel" className={styles['section-why__icono']} />
                <img src={PanelDass} alt="Panel de la aplicación Postdog" className={styles['section-why__panel-img']} />
                
                <TabsPostdog />
            </div>
        </section>
    );
};

export default WhySection; 