import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from 'react-router-dom';
import "./RegistrarUsuario.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Register() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Obtener valores del formulario
    const nombre = e.target.nombre.value.trim();
    const pseudonimo = e.target.pseudonimo.value.trim();
    const email = e.target.email.value.trim();
    const password = e.target.password.value.trim();
    const confirmPassword = e.target.confirmPassword.value.trim();
    const fecha_nacimiento = e.target.fecha_nacimiento.value; // ya es formato yyyy-MM-dd

    // Validaciones básicas
    if (!nombre || !pseudonimo || !email || !password || !confirmPassword || !fecha_nacimiento) {
      setError("Por favor, completa todos los campos.");
      setSuccess("");
      return;
    }
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      setSuccess("");
      return;
    }

    // Si todo está bien, limpiar error
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/usuarios/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre,
          pseudonimo,
          email,
          password,
          roles_id: "689bd2e00691edc2fc5831fd", // lo defines fijo o lo sacas de otro campo
          fecha_nacimiento,
        }),
      });

      if (!response.ok) {
        const errorMsg = await response.text();
        setError(errorMsg);
        setSuccess("");
        return;
      }

      const data = await response.json();
      setSuccess("✅ Usuario creado:" + data.email);
      alert("Registro exitoso ✅");
      e.target.reset(); // limpiar form
      setTimeout(() => {
        navigate("/home");
      }, 2000);
    } catch (error) {
      console.error("Error en el registro:", error);
      setError("Ocurrió un error en el servidor.");
    }
  };

  return (
    <div className="register-page">
      <div className="overlay"></div>

      <div className="register-container">
        {/* Mensaje de error */}
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <h2 className="title">Registrarse</h2>

        {/* Formulario */}
        <form className="register-form" onSubmit={handleSubmit}>
          <input type="text" name="nombre" placeholder="Nombre" />
          <input type="email" name="email" placeholder="Email" />
          <input type="text" name="pseudonimo" placeholder="Pseudonimo" />
          <input type="date" name="fecha_nacimiento" placeholder="Fecha de Nacimiento" />
          <input type="password" name="password" placeholder="Contraseña" />
          <input type="password" name="confirmPassword" placeholder="Confirmar Contraseña" />

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
