import React from "react";
import { Link } from "react-router-dom";
import "./explora.css";
import Tarjeta from "../../elements/tarjeta/tajeta";

function Explora() {
  return (
    <div className="container">
      <div className="row justify-content-md-center">
        <div className="col-md-auto">
          <div className="img-wrapper">
            <img
              className="img-responsive border-principal"
              src="https://www.pulsourbano.com.ar/wp-content/uploads/sia-reaper.jpg"
              alt="Sia"
            />
            <div className="img-overlay">
              <div className="texto-negro">
                <h1>
                  Ultimos hits de <span>Sia</span>
                </h1>
              </div>
              <Link className="btn-md" to="/">
                  Ir <i className="fas fa-play"></i>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <hr />
      <div className="container col-lg-12">
        <h1>Géneros mas escuchados</h1>
        <div className="row">
          <Tarjeta nombre="Pop"></Tarjeta>
          <Tarjeta nombre="Salsa"></Tarjeta>
          <Tarjeta nombre="Rock"></Tarjeta>
          <Tarjeta nombre="Rap"></Tarjeta>
          <Tarjeta nombre="Latino"></Tarjeta>
          <Tarjeta nombre="Merengue"></Tarjeta>
          <Tarjeta nombre="Instrumental"></Tarjeta>
          <Tarjeta nombre="Algo mas
          "></Tarjeta>
        </div>
        <h1>Explorar todo</h1>
        <div className="row">
          <Tarjeta nombre="Pop"></Tarjeta>
          <Tarjeta nombre="Salsa"></Tarjeta>
          <Tarjeta nombre="Rock"></Tarjeta>
          <Tarjeta nombre="Rap"></Tarjeta>
        </div>
      </div>
    </div>
  );
}
export default Explora;
