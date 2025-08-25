import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { useNavigate, useLocation } from "react-router-dom"; // 👈 Importante
import "./Login.css";

const API_BASE_URL = "http://localhost:8080"

export default function Login() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // 👈 Guardamos a dónde ir después del login (si no hay, por defecto "/")
  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value.trim();
    const password = e.target.password.value.trim();

    if (!email || !password) {
      setError("Por favor, completa todos los campos.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include", // necesario
      });

      const data = await response.json();


      if (!response.ok) {
        throw new Error("Credenciales inválidas o error en el servidor");
      }

      if (data.role) {
      localStorage.setItem("role", data.role); // 👈 Guardamos el rol
    }

      // 👈 Redirigir a la página donde estaba antes
      navigate(from, { replace: true });

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
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
          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? "Cargando..." : "Ingresar"}
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
