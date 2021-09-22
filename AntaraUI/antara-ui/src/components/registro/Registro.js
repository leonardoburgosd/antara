import React from "react";
import "../../design/css/registro.css";
import Header from "./Header";
import Form from "./Form";

function Registro() {
  return (
    <div className="registro-bg">
      <div className="contenedor">
        <Header></Header>
        <div className="styled-hr" />
        <Form></Form>
      </div>
    </div>
  );
}
export default Registro;
