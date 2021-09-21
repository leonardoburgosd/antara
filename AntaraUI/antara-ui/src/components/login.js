import React from "react";
import { Link } from "react-router-dom";
import "../design/css/styles.css";
class Login extends React.Component {
  render() {
    return (
      <main>
        <nav>
          <ul>
            <li>
              <Link to="/registrarte">Registrarte</Link>
            </li>
            <li>
              <Link to="/login">Iniciar Sesión</Link>
            </li>
          </ul>
        </nav>
        <section></section>
      </main>
    );
  }
}
export default Login;
