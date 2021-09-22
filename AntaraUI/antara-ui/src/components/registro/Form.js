import React, { Component } from "react";
import "../../design/css/form.css";
import visibility from "../../design/assets/img/visibility_icon.svg";
import { Link } from "react-router-dom";

class Form extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      emailConfirm: "",
      password: "",
      name: "",
      birthDate: "",
      gender: "X",
    };

    this.validations = {
      email: false,
      emailConfirm: false,
      password: false,
      name: false,
      birthDate: false,
    };
  }

  visibility = () => {
    const passwordField = document.getElementById("password");
    if (passwordField.type === "password") {
      passwordField.type = "text";
    } else if (passwordField.type === "text") {
      passwordField.type = "password";
    }
  };

  handleEmailChange = (event) => {
    this.setState({
      email: event.target.value,
    });
  };

  validateEmail = (event) => {
    const regexEmail =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (event.target.value) {
      if (regexEmail.test(event.target.value)) {
        this.validations.email = true;
        event.target.parentNode.classList.remove("invalido");
      } else {
        this.validations.email = false;
        event.target.parentNode.classList.add("invalido");
      }
    }
  };

  handleEmailConfirmChange = (event) => {
    this.setState({
      emailConfirm: event.target.value,
    });
  };

  validateEmailConfirm = (event) => {
    if (event.target.value) {
      if (event.target.value === this.state.email) {
        this.validations.emailConfirm = true;
        event.target.parentNode.classList.remove("invalido");
      } else {
        this.validations.emailConfirm = false;
        event.target.parentNode.classList.add("invalido");
      }
    } else {
      this.validations.emailConfirm = false;
    }
  };

  handleNameChange = (event) => {
    this.setState({
      name: event.target.value,
    });
  };

  handlePasswordChange = (event) => {
    this.setState({
      password: event.target.value,
    });
  };

  validatePassword = (event) => {
    if (event.target.value) {
      if (this.state.password.length >= 6 && this.state.password.length <= 16) {
        this.validations.password = true;
        event.target.parentNode.classList.remove("invalido");
      } else {
        this.validations.password = false;
        event.target.parentNode.classList.add("invalido");
      }
    }
  };

  handleBirthDateChange = (event) => {
    this.setState({
      birthDate: event.target.value,
    });
  };
  handleGenderChange = (event) => {
    this.setState({
      gender: event.target.value,
    });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    let error = 0;
    for (const key in this.validations) {
      if (!this.validations[key]) {
        document.getElementById(key).parentNode.classList.add("invalido");
        error += 1;
      }
    }
    if (error === 0) {
      /*
        ENVIAR DATOS AL BACKEND
      */
      alert("enviar datos");

      this.setState({
        email: "",
        emailConfirm: "",
        password: "",
        name: "",
        birthDate: "",
        gender: "",
      });
    }
  };

  validateName = (event) => {
    if (event.target.value) {
      this.validations.name = true;
      event.target.parentNode.classList.remove("invalido");
    } else {
      this.validations.name = false;
    }
  };

  validateBirthDate = (event) => {
    if (event.target.value) {
      this.validations.birthDate = true;
      event.target.parentNode.classList.remove("invalido");
    } else {
      this.validations.birthDate = false;
    }
  };

  render() {
    return (
      <main className="form">
        <form onSubmit={this.handleSubmit}>
          <div className="entrada-dato">
            <label htmlFor="email">¿Cual es tu correo electrónico?</label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Ingresa tu correo electrónico."
              autoComplete="off"
              value={this.state.email}
              onChange={this.handleEmailChange}
              onBlur={this.validateEmail}
            />
            <span className="error-message">Correo electrónico no válido.</span>
          </div>
          <div className="entrada-dato">
            <label htmlFor="emailConfirm">Confirma el correo electrónico</label>
            <input
              type="email"
              name="emailConfirm"
              id="emailConfirm"
              placeholder="Vuelve a ingresar tu correo electrónico."
              value={this.state.emailConfirm}
              onChange={this.handleEmailConfirmChange}
              onBlur={this.validateEmailConfirm}
            />
            <span className="error-message">
              No coincide con el correo electrónico
            </span>
          </div>
          <div className="entrada-dato">
            <label htmlFor="password">Crea una contraseña</label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Crea una contraseña."
              minLength="6"
              maxLength="16"
              value={this.state.password}
              onChange={this.handlePasswordChange}
              onBlur={this.validatePassword}
            />
            <button
              className="visibility"
              type="button"
              id="visibility"
              onClick={this.visibility}
            >
              <img src={visibility} alt="" />
            </button>
            <span className="error-message">
              Debe tener de 6 a 16 caracteres
            </span>
          </div>
          <div className="entrada-dato">
            <label htmlFor="name">¿Cómo quieres que te llamemos?</label>
            <input
              type="text"
              name="name"
              id="name"
              placeholder="Ingresa tu nombre de perfil"
              value={this.state.name}
              onChange={this.handleNameChange}
              onBlur={this.validateName}
            />
            <span className="error-message">Nombre de perfil requerido</span>
          </div>
          <div className="entrada-dato">
            <label htmlFor="birthDate">¿Cuál es tu fecha de nacimiento?</label>
            <input
              type="date"
              name="birthDate"
              id="birthDate"
              value={this.state.birthDate}
              onChange={this.handleBirthDateChange}
              onBlur={this.validateBirthDate}
            />
            <span className="error-message">Selecciona una fecha</span>
          </div>
          <div className="entrada-dato">
            <label htmlFor="">¿Cuál es tu sexo?</label>
            <div className="radio" id="gender">
              <div>
                <label htmlFor="radio-H">Hombre</label>
                <input
                  type="radio"
                  name="sexo"
                  id="radio-H"
                  value="H"
                  onChange={this.handleGenderChange}
                />
              </div>
              <div>
                <label htmlFor="radio-M">Mujer</label>
                <input
                  type="radio"
                  name="sexo"
                  id="radio-M"
                  value="M"
                  onChange={this.handleGenderChange}
                />
              </div>
              <div>
                <label htmlFor="radio-X">Otro</label>
                <input
                  type="radio"
                  name="sexo"
                  id="radio-X"
                  value="X"
                  onChange={this.handleGenderChange}
                />
              </div>
            </div>
          </div>
          <p className="terminos-condiciones">
            Al registrarte, aceptas los{" "}
            <Link>Terminos y Condiciones de Uso</Link> de Antara.
          </p>
          <div className="boton-container">
            <button type="submit" className="button-register">
              Registrate
            </button>
          </div>
        </form>
        <p>
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>.
        </p>
      </main>
    );
  }
}

export default Form;
