import { FC } from 'react';
import { useNavigate } from "react-router-dom";
import styles from "./NotFoundPage.module.scss";
import img404 from "../../assets/img/404.png";

const NotFoundPage: FC = () => {
  const navigate = useNavigate();
  return (
    <div className={styles["notfound-page"]}>
      <div className={styles["notfound-page__container"]}>
        <h1 className={styles["notfound-page__title"]}>404 Not Found</h1>
        <img src={img404} alt="404" className={styles["notfound-page__img"]} />
        <h2 className={styles["notfound-page__subtitle"]}>Guau... aquí no hay nada.</h2>
        <p className={styles["notfound-page__desc"]}>Mejor regresemos antes de que se canse de esperar.</p>
        <button className={`btn ${styles["notfound-page__btn"]}`} onClick={() => navigate("/")}>Volver a casa</button>
      </div>
    </div>
  );
};

export default NotFoundPage;
