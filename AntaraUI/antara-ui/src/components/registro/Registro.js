import React from "react";
import "../../design/css/registro.css";
import Header from "./Header";
import Form from "./Form";

function Registro() {
  return (
    <div className="container">
      <Header></Header>
      <hr className="styled-hr" />
      <Form></Form>
    </div>
  );
}
export default Registro;
