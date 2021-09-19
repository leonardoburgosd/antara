import React from "react";
import { Link } from "react-router-dom";
import './tarjeta.css';
function Tarjeta(elemento) {
    let colores = ['bg-primary', 'bg-danger', 'bg-success', 'bg-secondary', 'bg-warning', 'bg-info', 'bg-indigo', 'bg-purple'];
    let valor = Math.floor(0 + Math.random() * (7 - 0));
    return (
        <div className="col-sm-3 mb-3 ">
            <div className={'card ' + colores[valor]}>
                <div classNames="card-body">
                    <h5 className="card-title texto-centrado">
                        <Link className="clear-link" to="/">{elemento.nombre}</Link>
                    </h5>
                </div>
            </div>
        </div>
    )
}
export default Tarjeta
