import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

//Este es el Hook del menu hamburguesa 
// import useScreenResolution from "../hooks/useScreenResolution";

import PostDogLogin from "../assets/Logos/LogoHeaderWhite.png";

import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';

import "animate.css";
import { TikTokIcon } from "../components/icons/TikTokIcon";

const Header = ({ isStickyProps = false, logo }) => {
  const navigate = useNavigate();
  const [isSticky, setIsSticky] = useState(isStickyProps);
  // const { isMovil, is390, is768, is1024 } = useScreenResolution();

  useEffect(() => {
    const handleScroll = () => {
      if (isStickyProps) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
        if (window.scrollY > 300) {
          setIsSticky(true);
        } else {
          setIsSticky(false);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);

  }, [isStickyProps]);

  return (
    <header
      className={`header recovery-password__header${isSticky ? " sticky" : ""}`}
    >
      <div className="header__container ">
        <img onClick={() => navigate("/")} src={logo} alt="PostDog Logo" className="header__logo" />

        <div className="header-actions__container-responsive">

          <div className="header__actions_responsive">
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate("/login");
              }}
              className="header__menu-item header__menu-item--login"
            >
              Inicia sesión
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate("/register");
              }}
              className="header__menu-item header__menu-item--register"
            >
              Regístrate
            </button>
          </div>

        </div>

        <nav className="header__menu">
          <ul className="header__menu-list">
            <li>
              <a className="header__menu-item" onClick={() => navigate("/about-us")} href="#">
                Nosotros
              </a>
            </li>
            <li>
              <a className="header__menu-item" onClick={() => navigate("/contact")} href="#">
                Contacto
              </a>
            </li>
            <li>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate("/login");
                }}
                className="header__menu-item header__menu-item--login"
              >
                Inicia sesión
              </button>
            </li>
            <li>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate("/register");
                }}
                className="header__menu-item header__menu-item--register"
              >
                Regístrate
              </button>
            </li>
          </ul>
        </nav>


      </div>
    </header>
  );
};

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="footer-postdog">
      <div className="  footer-postdog__container">
        <div className="row w-100 m-0 footer-postdog__top">
          <div className="col-md-8 col-12 footer-postdog__main">
            <Link to="/" className="footer-postdog__logo-link">
              <h2 className="footer-postdog__brand mb-2">POSTDOG</h2>
            </Link>
            <p className="footer-postdog__desc mb-md-1 mb-3">Únete a la manada más rápida del envío</p>
            <p className="footer-postdog__desc mb-0">Recibe promos especiales, alertas de tarifas bajas y novedades que harán mover la cola de felicidad.</p>
            <form className="footer-postdog__newsletter g-2 align-items-end">
              <div className=" mt-0">
                <label className="footer-postdog__label" htmlFor="footer-email">Correo electrónico<span className="text-danger">*</span></label>
                <input
                  id="footer-email"
                  type="email"
                  className="form-control footer-postdog__input"
                  required
                  aria-required="true"
                />
              </div>
              <div className=" mt-0">
                <button type="submit" className="footer-postdog__newsletter-btn w-100">
                  Suscribirme al boletín perruno
                </button>
              </div>
            </form>
          </div>
          <div className="col-md-4 col-12 footer-postdog__links d-flex flex-column align-items-md-end align-items-start mt-4 mt-md-0">
            <nav className="footer-postdog__nav">
              <ul className="footer-postdog__nav-list">
                <li><a href="#" className="footer-postdog__nav-link bold">Empresa</a></li>
                <li><a href="#" onClick={() => navigate("/about-us")} className="footer-postdog__nav-link h">Nosotros</a></li>
                <li><a href="#" onClick={() => navigate("/contact")} className="footer-postdog__nav-link h">Contacto</a></li>
              </ul>
            </nav>
          </div>
        </div>
        <hr className="footer-postdog__divider my-4" />
        <div className="footer-postdog__bottom d-flex w-100 m-0 align-items-center justify-content-md-between justify-content-center flex-column flex-md-row">
          <div className="text-md-start text-center mb-2 mb-md-0">
            <span className="footer-postdog__copyright">© 2025 Postdog. Todos los derechos reservados.</span>
          </div>
          <div className="d-flex gap-5 contact-footer ">

            <div className="d-flex justify-content-center mb-2 mb-md-0">
              <nav className="footer-postdog__legal-nav">
                <ul className="footer-postdog__legal-list d-flex justify-content-center gap-5 mb-0">
                  <li><a onClick={() => navigate("/terms-conditions")} className="footer-postdog__legal-link">Términos y condiciones</a></li>
                  <li><a onClick={() => navigate("/policy-privacy")} className="footer-postdog__legal-link">Aviso de privacidad</a></li>
                </ul>
              </nav>
            </div>
            <div className="d-flex justify-content-md-end justify-content-center footer-postdog__social">
              <nav className="footer-postdog__social-nav">
                <ul className="footer-postdog__social-list d-flex gap-5 mb-0">
                  <li>
                    <a href="#" className="footer-postdog__social-link">
                      <TikTokIcon />
                    </a>
                  </li>
                  <li><a href="#" className="footer-postdog__social-link"><FacebookIcon className=" footer-postdog__social-link-icon" /></a></li>
                  {/* <li><a href="#" className="footer-postdog__social-link"><WhatsAppIcon /></a></li> */}

                  <li><a href="#" className="footer-postdog__social-link"><InstagramIcon className=" footer-postdog__social-link-icon " /></a></li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

const MainLayout = ({ children, isStickyPropsHeader = false, logoHeader = PostDogLogin }) => {
  return (
    <div>
      <Header isStickyProps={isStickyPropsHeader} logo={logoHeader} />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default MainLayout;