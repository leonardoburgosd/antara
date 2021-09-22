import React from "react";
import BodyInfo from "./BodyInfo";
import BodyImg from "./BodyImg";
import "../../../design/css/home/body.css";

function Body() {
  return (
    <main className="home-body">
      <BodyInfo></BodyInfo>
      <BodyImg></BodyImg>
    </main>
  );
}

export default Body;
