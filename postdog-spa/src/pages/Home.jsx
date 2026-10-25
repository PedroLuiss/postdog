import "animate.css";
import "swiper/css";
import "swiper/css/pagination";

import "../assets/styles/pages/Home.css";

import BannerHomeSection from "../components/home/BannerHomeSection/BannerHomeSection";
import ContactSection from "../components/home/ContactSection/ContactSection";
import FaqSection from "../components/home/FaqSection/FaqSection";
import HowItWorksSection from "../components/home/WhatIsSection/WhatIsSection";
import PostdogFeatureSection from "../components/home/PostdogFeatureSection/PostdogFeatureSection";
import WhySection from "../components/home/WhySection/WhySection";
import useScreenResolution from "../hooks/useScreenResolution";

const Home = () => {
const { is768, isMovil, is390 } = useScreenResolution();
const isMobileView = is768 || isMovil || is390;

    return (
        <div className="page-home">
            <BannerHomeSection
                title="Tu mejor amigo en envíos"
                subtitle={<>Haz tus envíos sin complicaciones. {!isMobileView ? <br />: null} Nosotros te conseguimos la mejor guía al mejor precio, ¡guau!</>}
                buttonText="Únete a la manada"
                buttonOnClick={() => { console.log("Button clicked"); }}
            />
            <WhySection />
            <PostdogFeatureSection />
            <FaqSection />
            <HowItWorksSection />
            <ContactSection />
        </div>
    );
};

export default Home;
