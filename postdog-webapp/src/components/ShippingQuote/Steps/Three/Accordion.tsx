import React from 'react';
import styles from './Accordion.module.scss';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { TruckIcon } from '../../../icons';
interface AccordionProps {
    title: string;
    summaryContent: React.ReactNode;
    isOpen: boolean;
    onToggle: () => void;
    children: React.ReactNode;
    loading?: boolean;
}

export const Accordion: React.FC<AccordionProps> = ({ title, summaryContent, isOpen, onToggle, children, loading = false }) => {
    return (
        <div className={`${styles.accordion} ${isOpen ? styles['accordion--open'] : ''}`}>
            <header className={styles.accordion__header} onClick={onToggle}>
                <div className={styles.accordion__titleContainer}>
                    {isOpen ? (
                        <h3 className={styles.accordion__title}><TruckIcon/> {title}</h3>
                    ) : (
                        summaryContent
                    )}
                </div>
                <KeyboardArrowDownIcon className={styles.accordion__icon} />
            </header>
            {isOpen && (
                <main className={styles.accordion__content}>
                    {children}
                </main>
            )}
        </div>
    );
};