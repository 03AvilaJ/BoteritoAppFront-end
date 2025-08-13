import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import "./RegistrarUsuario.css";


export default function Register() {
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const email = e.target.email.value.trim();
    const password = e.target.password.value.trim();
    const confirmPassword = e.target.confirmPassword.value.trim();

    // Validaciones básicas
    if (!email || !password || !confirmPassword) {
      setError("Por favor, completa todos los campos.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    // Si todo está bien
    setError("");
    alert("Registro exitoso ✅");
  };

  return (
    <div className="register-page">
      <div className="overlay"></div>

      <div className="register-container">
        {/* Mensaje de error */}
        {error && <div className="error-message">{error}</div>}

        <h2 className="title">Registrarse</h2>

        {/* Formulario */}
        <form className="register-form" onSubmit={handleSubmit}>
          <input type="email" name="email" placeholder="Email" />
          <input type="password" name="password" placeholder="Contraseña" />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirmar Contraseña"
          />

          <button type="submit" className="btn-submit">
            Registrarme
          </button>
        </form>

        {/* Enlace de inicio de sesión */}
        <p className="login-link">
          Ya tienes una cuenta?{" "}
          <a href="/login">Iniciar Sesión</a>
        </p>

        {/* Botón Google */}
        <button type="button" className="btn-google">
          <FcGoogle size={20} /> Registrarme con Google
        </button>
      </div>
    </div>
  );
}
