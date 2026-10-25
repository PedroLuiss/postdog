import { useNavigate } from 'react-router-dom';
import PostDogLogin from '../../../assets/Logos/ChihuahuaWhite.png';
import ImgCs1 from "../../../assets/img/Home/CarruselLogos/paqueteexpresslogoWhite.png";
import ImgCs2 from "../../../assets/img/Home/CarruselLogos/estagetalogoWhite.png";
import ImgCs3 from "../../../assets/img/Home/CarruselLogos/fedexlogoS.png"; 
import ImgCs4 from "../../../assets/img/Home/CarruselLogos/jytlogoWhite.png";
import ImgCs5 from "../../../assets/img/Home/CarruselLogos/dhllogoWhite.png";
import ImgCs6 from "../../../assets/img/Home/CarruselLogos/shopifylogoWhite.png";
import ImgCs7 from "../../../assets/img/Home/CarruselLogos/woologoWhite.png";
import ImgCs8 from "../../../assets/img/Home/CarruselLogos/tiendanubelogoWhite.png";

import styles from './BannerHomeSection.module.css';

const BannerHomeSection = ({ title, subtitle, buttonText, buttonOnClick, logoSrc = PostDogLogin, logoOnClick }) => {
    const navigate = useNavigate();

    const baseSlides = [ImgCs1, ImgCs2, ImgCs3, ImgCs4, ImgCs5, ImgCs6, ImgCs7, ImgCs8];
   const slides = [...baseSlides, ...baseSlides]; 

    return (
        <>
            <section className={styles['banner-home']}>
                <div className={styles['banner-home__main']}>

                <div className={styles['banner-home__content']}>
                    <h1 className={styles['banner-home__title']}>{title}</h1>
                    <h2 className={styles['banner-home__subtitle']}>{subtitle}</h2>

                    <div className='w-100'>
                        <button 
                            onClick={buttonOnClick} 
                            className={`${styles['banner-home__button']} mx-auto mt-5 d-flex justify-content-center`}>
                            {buttonText}
                        </button>
                    </div>

                </div>
                <div>
                    <img 
                        onClick={logoOnClick || (() => navigate("/"))} 
                        src={logoSrc} 
                        alt="PostDog Logo" 
                        className={styles['banner-home__logo']} 
                    />
                </div>
                </div>
                 <div className={styles['banner-home__slider']}>
                    <div className={styles['banner-home__slide-track']}> 
                        {slides.map((src, index) => (
                            <div className={styles['banner-home__slide']} key={index}>
                                <img src={src} alt={`slide-${index}`} />
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
};

export default BannerHomeSection;