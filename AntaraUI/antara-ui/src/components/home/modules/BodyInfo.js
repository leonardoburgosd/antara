import React from "react";
import "../../../design/css/home/bodyInfo.css";
import playStoreImg from "../../../design/assets/img/play-store.png";
import appStoreImg from "../../../design/assets/img/app-store.png";

function BodyInfo() {
  return (
    <section className="home-body-info">
      <div>
        <h1 className="home-body-info-title">
          Trae tu pasión y nosotros ponemos la música.
        </h1>
        <p className="home-body-info-text">
          Crea playlists y álbumes inspirados en los artistas y generos que más
          te identifican.
        </p>
        <div className="disponible-en">
          <img src={playStoreImg} alt="play_store" />
          <img src={appStoreImg} alt="app_store" />
        </div>
      </div>
    </section>
  );
}

export default BodyInfo;
