import React from "react";
import { Link } from "react-router-dom";
import "../../../design/css/home/navbar.css";
import hamburgerIcon from "../../../design/assets/img/menu_black_24dp.svg";

const dropNavbar = () => {
  const navbarMenu = document.querySelector(".nav-bar-menu");
  navbarMenu.classList.toggle("active");
};

function Navbar() {
  return (
    <nav className="nav-bar">
      <img
        className="dropdown-icon"
        src={hamburgerIcon}
        alt="menu"
        onClick={dropNavbar}
      />
      <ul className="nav-bar-menu">
        <li className="nav-bar-item">
          <Link to="">Ayuda</Link>
        </li>
        <li className="nav-bar-item">
          <Link to="/registrarte">Registrarte</Link>
        </li>
        <li className="nav-bar-item">
          <Link to="">Iniciar Sesión</Link>
        </li>
        <li className="nav-bar-item button">
          <Link to="">Descargar</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
