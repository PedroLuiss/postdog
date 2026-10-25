import React from 'react';
import styles from './NotificationStatusGrid.module.scss';
import { Mail, MessageCircle } from 'lucide-react';
import SwitchUi from '../../ui/SwitchUi/SwitchUi';
import { NotificationSettings } from '../../../types/notificationSettings.type';
import { NotificationStatusGridProps } from './types';
import { templateMap } from './constant/NotificationStatusGrid.constant';

export const NotificationStatusGrid: React.FC<NotificationStatusGridProps> = React.memo(({ 
    formData, 
    handleToggleChange,
    onSelectTemplate,
    selectedTemplate
}) => {
    return (
        <section className={`${styles['notifications__card']} ${styles['notifications__card--mt']}`}>
            <div className={styles['notifications__card-header']}>
                <h2 className={styles['notifications__card-title']}>Estatus enviados por Email y WhatsApp</h2>
            </div>
            <div className={styles['notifications__form-body-status']}>
                <div className={styles['status-grid']}>
                    <div className={styles['status-grid__header']}>
                        <div className={styles['status-grid__empty']}></div>
                        <div className={styles['status-grid__icon-header']}><Mail size={20} /></div>
                        <div className={styles['status-grid__icon-header']}><MessageCircle size={20} /></div>
                    </div>

                    {[
                        { label: 'Creado', key: 'enabledCreated' },
                        { label: 'Recolectado', key: 'enabledShipped' },
                        { label: 'Entregado', key: 'enabledDelivered' },
                        { label: 'Cancelado', key: 'enabledCanceled' }
                    ].map((item) => (
                        <div 
                            key={item.key} 
                            className={`${styles['status-grid__row']} ${selectedTemplate === templateMap[item.key] ? styles['status-grid__row--active'] : ''}`}
                            onClick={() => onSelectTemplate(templateMap[item.key])}
                        >
                            <div className={styles['status-grid__label']}>{item.label}</div>
                            
                            <div className={styles['status-grid__switch']} onClick={(e) => e.stopPropagation()}>
                                <SwitchUi 
                                    className={styles['status-grid__switch-check']}
                                    checked={formData[item.key as keyof NotificationSettings] as boolean} 
                                    onChange={() => handleToggleChange(item.key as keyof NotificationSettings)} 
                                />
                            </div>
                            <div className={styles['status-grid__switch']}>
                                <SwitchUi 
                                    disabled
                                    checked={false} 
                                    onChange={() => {}} 
                                />
                            </div>

                            <div className={styles['status-grid__controls-mobile']}>
                                <div className={styles['status-grid__mobile-item']} onClick={(e) => e.stopPropagation()}>
                                    <Mail size={18} />
                                    <span>Email</span>
                                    <SwitchUi 
                                        className={styles['status-grid__switch-check']}
                                        checked={formData[item.key as keyof NotificationSettings] as boolean} 
                                        onChange={() => handleToggleChange(item.key as keyof NotificationSettings)} 
                                    />
                                </div>
                                <div className={styles['status-grid__mobile-item']}>
                                    <MessageCircle size={18} />
                                    <span>WA</span>
                                    <SwitchUi 
                                        disabled
                                        checked={false} 
                                        onChange={() => {}} 
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
});
