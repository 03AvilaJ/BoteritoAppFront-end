import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import "./Login.css";

export default function Login() {
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const email = e.target.email.value.trim();
    const password = e.target.password.value.trim();

    if (!email || !password) {
      setError("Por favor, completa todos los campos.");
      return;
    }

    setError("");
    alert("Inicio de sesión exitoso ✅");
  };

  return (
    <div className="login-page">
      <div className="overlay"></div>

      <div className="login-container">
        {error && <div className="error-message">{error}</div>}

        <h2 className="title">Iniciar Sesión</h2>

        <form className="login-form" onSubmit={handleSubmit}>
          <input type="email" name="email" placeholder="Email" />
          <input type="password" name="password" placeholder="Contraseña" />
          <button type="submit" className="btn-submit">
            Ingresar
          </button>
        </form>

        <p className="register-link">
          No tienes una cuenta? <a href="/RegistrarUsuario">Regístrate</a>
        </p>

        <button type="button" className="btn-google">
          <FcGoogle size={20} /> Iniciar con Google
        </button>
      </div>
    </div>
  );
}
