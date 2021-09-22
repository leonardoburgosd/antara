import React from "react";
import "../../../design/css/home/bodyImg.css";
import imgSrc from "../../../design/assets/img/undraw_happy_music_g6wc.svg";

function BodyImg() {
  return (
    <section className="img">
      <img src={imgSrc} alt="imagen" />
    </section>
  );
}

export default BodyImg;
