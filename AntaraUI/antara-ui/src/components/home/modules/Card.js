import React from "react";
import "../../../design/css/home/card.css";
import playIcon from "../../../design/assets/img/play_arrow_black_24dp.svg";

function Card(props) {
  const classes = "card-home " + props.addClass;
  return (
    <div className={classes}>
      <h2>{props.name}</h2>
      <img src={playIcon} alt="" />
    </div>
  );
}

export default Card;
