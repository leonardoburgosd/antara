import React from "react";
import { Link } from "react-router-dom";
import './explora.css'
function Explora() {
    return (
        <div className="container">
            <div className="row justify-content-md-center">
                <div className="col-md-auto">
                    <div className="img-wrapper">
                        <img className="img-responsive border-principal" src="https://www.pulsourbano.com.ar/wp-content/uploads/sia-reaper.jpg" alt="Sia" />
                        <div className="img-overlay">
                            <div className="btn-md texto-negro">
                                <h1>Ultimos hits de <span>Sia</span></h1>
                            </div>
                            <Link className="btn btn-md" to="/"><span className="texto-ir">Ir <i className="fas fa-play"></i></span></Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Explora