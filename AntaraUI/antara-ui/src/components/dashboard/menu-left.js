import React from "react";
import { Link } from "react-router-dom"
import MenuRight from "./menu-right"
import Container from "../dashboard/container"
const MenuLeft = () => {
    return (
        <div id="layoutSidenav">
            <div id="layoutSidenav_nav">
                <nav className="sb-sidenav accordion sb-sidenav-dark" id="sidenavAccordion">
                    <div className="sb-sidenav-menu">
                        <div className="nav">
                            <div className="sb-sidenav-menu-heading">MENU</div>
                            <Link className="nav-link" to="/dashboard">
                                <div className="sb-nav-link-icon"><i className="fas fa-location-arrow"></i></div>
                                Explora
                            </Link>
                            <Link className="nav-link" to="/dashboard/playlist">
                                <div className="sb-nav-link-icon"><i className="fas fa-play"></i></div>
                                Playlist
                            </Link>
                        </div>
                    </div>
                </nav>
            </div> 
            <div className="bg-dark " id="layoutSidenav_content">
                <main className="color-blanco">
                    <div className="col-9 izquierda">
                        <div className="container-fluid ">
                            <Container></Container>
                        </div>
                    </div>
                    <div className="col-3 izquierda sb-sidenav sb-sidenav-dark">
                        <div className="container-fluid">
                            <MenuRight></MenuRight>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}
export default MenuLeft