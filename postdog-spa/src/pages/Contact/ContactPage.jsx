import FaqSection from '../../components/Contact/FaqSection/FaqSection';
import HelpSection from '../../components/Contact/HelpSection/HelpSection'; 
import styles from './ContactPage.module.scss';
const ContactPage = () => {
    return (
        <div className={styles['page-contact']} >
          <HelpSection />
          <FaqSection />
        </div>
    );
};

export default ContactPage;