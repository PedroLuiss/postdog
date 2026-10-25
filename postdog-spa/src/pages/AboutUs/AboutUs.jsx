import AboutSection from '../../components/AboutUs/AboutSection/AboutSection'; 
import MissionVisionSection from '../../components/AboutUs/MissionVisionSection/MissionVisionSection';
import WhoWeAreSection from '../../components/AboutUs/WhoWeAreSection/WhoWeAreSection';
import styles from './AboutUs.module.scss';
const AboutUsPage = () => {
    return (
        <div className={styles['page-about']}>
            <AboutSection />
            <WhoWeAreSection />
            <MissionVisionSection />
        </div>
    );
};

export default AboutUsPage;