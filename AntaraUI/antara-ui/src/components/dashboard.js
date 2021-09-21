import React from "react";
import "../design/css/styles.css";
import MenuTop from "./app/menu-top";
import MenuLeft from "./app/menu-left";

function Dashboard() {
  return (
    <div className="sb-nav-fixed">
      <MenuTop></MenuTop>
      <MenuLeft></MenuLeft>
    </div>
  );
}
export default Dashboard;
