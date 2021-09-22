import React from "react";
import Navbar from "./Navbar";
import "../../../design/css/home/header.css";
import logo from "../../../design/assets/img/logo.svg";

function Header() {
  return (
    <header className="home-header">
      <img className="logo" src={logo} alt="" />
      <Navbar></Navbar>
    </header>
  );
}

export default Header;
