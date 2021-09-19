import React from "react";
import { Link } from "react-router-dom";
const MenuTop = () => {
    return (
        <nav className="sb-topnav navbar navbar-expand navbar-dark bg-dark">
            <Link className="navbar-brand ps-3" to="#">
                <h4>ANTARA</h4>
            </Link>
            <form className="d-none d-md-inline-block form-inline ms-auto me-0 me-md-3 my-2 my-md-0">
            </form>
            <ul className="navbar-nav ms-auto ms-md-0 me-3 me-lg-4">
                <li>
                    <div className="elemento">
                        <img className="miniatura"
                            src="https://us.123rf.com/450wm/thesomeday123/thesomeday1231712/thesomeday123171200008/91087328-icono-de-perfil-de-avatar-predeterminado-para-mujer-marcador-de-posici%C3%B3n-de-foto-gris-vector-de-ilus.jpg?ver=6"
                            alt="" width="40" height="40" />
                    </div>
                </li>
                <li className="nav-item dropdown ">
                    <Link className="nav-link dropdown-toggle" id="navbarDropdown" to="#" role="button" data-bs-toggle="dropdown"
                        aria-expanded="false">
                        <span className="nombre-usuario">
                            Leonardo Burgos Diaz
                        </span>
                    </Link>

                    <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                        <li><Link className="dropdown-item" to="#">Settings</Link></li>
                        <li><Link className="dropdown-item" to="#">Activity Log</Link></li>
                        <li>
                            <hr className="dropdown-divider" />
                        </li>
                        <li><Link className="dropdown-item" to="/login">Logout</Link></li>
                    </ul>
                </li>
            </ul>
        </nav>
    )
}
export default MenuTop