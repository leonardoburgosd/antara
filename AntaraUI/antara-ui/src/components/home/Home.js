import React from "react";
import Header from "./modules/Header";
import Body from "./modules/Body";
import Card from "./modules/Card";
import "../../design/css/home/home.css";

class Home extends React.Component {
  render() {
    return (
      <div className="home-bg">
        <div className="home-container">
          <Header></Header>
          <Body></Body>
          <Card addClass="card-1" name="Fresh & Chill"></Card>
          <Card addClass="card-2" name="Korean Chillhop"></Card>
        </div>
      </div>
    );
  }
}
export default Home;
