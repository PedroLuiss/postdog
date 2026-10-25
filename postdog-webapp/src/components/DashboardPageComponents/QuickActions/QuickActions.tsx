import { useTranslation } from 'react-i18next';

//Components
import QuickActionItem from '../QuickActionItem/QuickActionItem';

//Styles
import styles from './QuickActions.module.scss';

//Types
import { QuickActionsProps } from '../../../types/dashboard.type';

const QuickActions: React.FC<QuickActionsProps> = ({ quickActions, onAction }) => {
    const { t } = useTranslation();

    return (
        <div className={styles.sectionCard}>
            <h3 className={styles.sectionCard__title}>{t('dashboard.quickActions')}</h3>
            <div className={styles.grid}>
                {quickActions.map((action, index) => (
                    <QuickActionItem
                        key={index}
                        label={t(`dashboard.actions.${action.label}`)}
                        icon={<action.icon />}
                        onClick={() => onAction(action.label)}
                    />
                ))}
            </div>
        </div>
    );
};


export default QuickActions;
