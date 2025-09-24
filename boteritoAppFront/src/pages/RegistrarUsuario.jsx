import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import "./RegistrarUsuario.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Register() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [passwordError, setPasswordError] = useState(""); // 🔹 para mostrar error inmediato
  const navigate = useNavigate();

  // Validar la contraseña en tiempo real al salir del input
  const validatePassword = (password) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&._-])[A-Za-z\d@$!%*?&._-]{8,}$/;

    if (!passwordRegex.test(password)) {
      setPasswordError(
        "La contraseña debe tener mínimo 8 caracteres, incluir una mayúscula, una minúscula, un número y un carácter especial."
      );
    } else {
      setPasswordError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Obtener valores del formulario
    const nombre = e.target.nombre.value.trim();
    const pseudonimo = e.target.pseudonimo.value.trim();
    const email = e.target.email.value.trim();
    const password = e.target.password.value.trim();
    const confirmPassword = e.target.confirmPassword.value.trim();
    const fecha_nacimiento = e.target.fecha_nacimiento.value;

    // Validaciones básicas
    if (!nombre || !pseudonimo || !email || !password || !confirmPassword || !fecha_nacimiento) {
      setError("Por favor, completa todos los campos.");
      setSuccess("");
      return;
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("El correo electrónico no tiene un formato válido.");
      setSuccess("");
      return;
    }

    // Validar contraseña otra vez antes de enviar
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&._-])[A-Za-z\d@$!%*?&._-]{8,}$/;
    if (!passwordRegex.test(password)) {
      setError(
        "La contraseña no cumple con los requisitos de seguridad."
      );
      setSuccess("");
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      setSuccess("");
      return;
    }

    // Si todo está bien
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/usuarios/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre,
          pseudonimo,
          email,
          password,
          roles_id: "689bd2e00691edc2fc5831fd",
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
      setSuccess("✅ Usuario creado: " + data.email);
      alert("Registro exitoso ✅");
      e.target.reset();
      setTimeout(() => {
        navigate("/");
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
        {/* Mensajes de error/éxito */}
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <h2 className="title">Registrarse</h2>

        {/* Formulario */}
        <form className="register-form" onSubmit={handleSubmit}>
          <input type="text" name="nombre" placeholder="Nombre" />
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
          />
          <input type="text" name="pseudonimo" placeholder="Pseudonimo" />
          <input type="date" name="fecha_nacimiento" placeholder="Fecha de Nacimiento" />

          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            onBlur={(e) => validatePassword(e.target.value)} // 🔹 valida al salir del campo
          />
          {passwordError && <p className="error-message">{passwordError}</p>}

          <input type="password" name="confirmPassword" placeholder="Confirmar Contraseña" />

          <button type="submit" className="btn-submit">
            Registrarme
          </button>
        </form>

        {/* Enlace de inicio de sesión */}
        <p className="login-link">
          ¿Ya tienes una cuenta? <a href="/login">Iniciar Sesión</a>
        </p>

        {/* Botón Google */}
        <button type="button" className="btn-google">
          <FcGoogle size={20} /> Registrarme con Google
        </button>
      </div>
    </div>
  );
}
