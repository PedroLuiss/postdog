import React from 'react';
import { PreferentialRatesCardProps } from '../../Type/PreferentialRatesModal.Type';
import styles from '../../PreferentialRatesModal.module.scss';
import { Check } from 'lucide-react';

export const PreferentialRatesCard: React.FC<PreferentialRatesCardProps> = ({ tier }) => {
    const [isHovered, setIsHovered] = React.useState(false);
    const tierClass = styles[`tier-${tier.id}`];
    const iconClass = styles[`icon-${tier.id}`];

    return (
        <div
            className={`${styles['tarjeta-nivel']} ${tier.isCurrent ? styles['actual'] : ''} ${tierClass}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {tier.isCurrent && <span className={styles['badge-nivel']}>Tu nivel actual</span>}

            <div className={styles['contenido-card']}>
                <div className={styles['container-icon-card']}>
                    <img
                        src={tier.icon as string}
                        alt={tier.name}
                        className={iconClass}
                        style={{ filter: isHovered ? 'grayscale(100%) brightness(450%) contrast(100%)' : 'none', transition: 'filter 0.3s ease' }}
                    />
                </div>
                <h3 className={styles['nombre-nivel']}>{tier.name}</h3>

                <ul className={styles['lista-beneficios']}>
                    {tier.benefits.map((benefit, index) => (
                        <li key={index} className={styles['item-beneficio']}>
                            <Check className={tier.isCurrent ? styles['check-icon'] : styles['check-icon-green']} />
                            <span>{benefit}</span>
                        </li>
                    ))}
                </ul>
            </div>

            <div className={styles['texto-ayuda-footer']}>
                {tier.footerText}
            </div>
        </div>
    );
};
