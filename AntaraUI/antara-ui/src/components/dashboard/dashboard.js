import React from "react";
import MenuTop from "./menu-top";
import MenuLeft from "./menu-left";
import '../../design/css/styles.css'
function Dashboard() {
  return (
    <div className="sb-nav-fixed">
      <MenuTop></MenuTop>
      <MenuLeft></MenuLeft>
    </div>
  );
}
export default Dashboard;
