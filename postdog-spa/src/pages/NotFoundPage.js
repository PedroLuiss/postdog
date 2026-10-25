import React from "react";
import { useNavigate } from "react-router-dom";
import "./NotFoundPage.css";
import img404 from "../assets/img/404.png";

const NotFoundPage = () => {
  const navigate = useNavigate();
  return (
    <div className="notfound-page">
      <div className="notfound-page__container">
        <h1 className="notfound-page__title">404 Not Found</h1>
        <img src={img404} alt="404" className="notfound-page__img" />
        <h2 className="notfound-page__subtitle">Guau... aquí no hay nada.</h2>
        <p className="notfound-page__desc">Mejor regresemos antes de que se canse de esperar.</p>
        <button className="btn notfound-page__btn" onClick={() => navigate("/")}>Volver a casa</button>
      </div>
    </div>
  );
};

export default NotFoundPage;
