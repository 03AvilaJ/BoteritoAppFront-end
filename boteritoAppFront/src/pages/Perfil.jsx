import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import "./Perfil.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Perfil = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: "",
    fecha_nacimiento: "",
    pseudonimo: "",
    email: "",
    biografia: "",
    role: "",
  });

  // 🔹 Cargar datos del backend al iniciar
  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/usuarios/perfil`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Error al obtener perfil");
        const data = await res.json();

        setFormData({
          nombre: data.nombre || "",
          fechaNacimiento: data.fecha_nacimiento || "",
          pseudonimo: data.pseudonimo || "",
          email: data.email || "",
          biografia: data.biografia || "",
          correo: data.correo || "",
          role: data.role.rol || "",
        });
      } catch (err) {
        console.error(err);
      }
    };

    fetchPerfil();
  }, []);

  // 🔹 Cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLogout = async () => {
    try {
      // Elimina el rol del localStorage
      localStorage.removeItem("role");


      // Llamada al backend para limpiar cookie
      const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        credentials: "include", // necesario para mandar la cookie
      });

      if (response.ok) {
        console.log("Logout exitoso");
      } else {
        console.error("Error al cerrar sesión");
      }
      navigate("/");
    } catch (error) {
      console.error("Error en logout:", error);
    }
  };

  return (
    <div className="perfil-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo">🎨</div>
          <p className="description">Title <br /> Description</p>
        </div>
        <nav className="menu">
          <a onClick={() => navigate("/")}>Inicio</a>
          <a href="#" className="active">Perfil</a>
          <a onClick={() => navigate("/galeria")}>Galeria</a>
        </nav>
        <button className="logout-btn" onClick={() => handleLogout()}>Cerrar Sesión</button>
      </aside>

      {/* Contenido principal */}
      <main className="perfil-content">
        <div className="form-box">
          <form>
            <div className="form-grid">
              <div>
                <label>Nombre</label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label>Fecha de nacimiento</label>
                <input
                  type="date"
                  name="fechaNacimiento"
                  value={formData.fechaNacimiento}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label>Pseudonimo</label>
                <input
                  type="text"
                  name="pseudonimo"
                  value={formData.pseudonimo}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label>Email</label>
                <input
                  type="text"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label>Biografia</label>
                <input
                  type="text"
                  name="biografia"
                  value={formData.biografia}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label>Rol</label>
                <input
                  type="text"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                />
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Perfil;
