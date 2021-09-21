import React from "react";
import "../../design/css/header.css";
import logo from "../../design/assets/img/Antara_logo.png";

const Header = () => {
  return (
    <header>
      <img src={logo} alt="antara_logo" />
      <h1 className="title">Regístrate gratis para escuchar</h1>
    </header>
  );
};

export default Header;
