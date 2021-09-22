import React from "react";
import { Link } from "react-router-dom";
import MenuRight from "./menu-right";
import Container from "./container";

const MenuLeft = () => {
  return (
    <div id="layoutSidenav">
      <div id="layoutSidenav_nav">
        <nav
          className="sb-sidenav accordion sb-sidenav-dark"
          id="sidenavAccordion">
          <div className="sb-sidenav-menu">
            <div className="nav">
              <div className="sb-sidenav-menu-heading">MENU</div>
              <Link className="nav-link" to="/dashboard">
                <div className="sb-nav-link-icon">
                  <i className="fas fa-location-arrow"></i>
                </div>
                Explora
              </Link>
              <Link className="nav-link" to="/dashboard/playlist">
                <div className="sb-nav-link-icon">
                  <i className="fas fa-play"></i>
                </div>
                Playlist
              </Link>
            </div>
          </div>
        </nav>
      </div>
      <main className="bg-dark color-blanco" id="layoutSidenav_content">
        <div className="col-12">
          <div className="container-fluid ">
            <Container></Container>
          </div>
        </div>
      </main>
    </div>
  );
};
export default MenuLeft;
