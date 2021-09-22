import React from "react";
import MenuTop from "./dashboard/menu-top";
import MenuLeft from "./dashboard/menu-left";

function Dashboard() {
  return (
    <div className="sb-nav-fixed">
      <MenuTop></MenuTop>
      <MenuLeft></MenuLeft>
    </div>
  );
}
export default Dashboard;
