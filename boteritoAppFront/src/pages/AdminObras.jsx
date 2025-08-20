import { useState } from "react"; 
import { Menu, CheckCircle, XCircle, BookOpen, Edit3 } from "lucide-react";
import "./AdminObras.css";

export default function AdminObras() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [obras, setObras] = useState([
    {
      titulo: "Raíces Ancestrales",
      autor: "Camilo López",
      fecha: "2018-06-12",
      tipografias: "Sans-serif",
      ilustracion: "Realista",
      tipoMural: "Mural Urbano",
      tecnica: "Aerosol",
      estadoConservacion: "Bueno",
      altura: "3.5m",
      anchura: "5m",
      descripcion: "Representación de las raíces culturales de Tunja.",
      superficie: "Ladrillo",
      mensaje: "La identidad cultural sigue viva.",
      contexto: "Homenaje a comunidades indígenas.",
      localizacion: "Centro histórico de Tunja",
      encargado: "Instituto de Cultura",
      observaciones: "Requiere limpieza anual.",
      estado: "registrado",
    },
    {
      titulo: "Colores del Alma",
      autor: "Diana Torres",
      fecha: "2020-09-25",
      tipografias: "Cursiva",
      ilustracion: "Abstracta",
      tipoMural: "Graffiti",
      tecnica: "Spray",
      estadoConservacion: "Regular",
      altura: "2m",
      anchura: "4m",
      descripcion: "Un mural que representa emociones humanas.",
      superficie: "Concreto",
      mensaje: "La diversidad es nuestra fuerza.",
      contexto: "Proyecto juvenil barrial.",
      localizacion: "Barrio San Francisco",
      encargado: "Alcaldía local",
      observaciones: "Desgaste por humedad.",
      estado: "registrado",
    },
  ]);

  const [modalAbierto, setModalAbierto] = useState(false);
  const [estado_registro, setEstadoRegistro] = useState(null);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  // 🔹 Abrir modal con datos de la obra
  const abrirModal = (obra, index) => {
    setEstadoRegistro({ ...obra, index });
    setModalAbierto(true);
  };

  // 🔹 Cerrar modal
  const cerrarModal = () => {
    setEstadoRegistro(null);
    setModalAbierto(false);
  };

  // 🔹 Manejar cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEstadoRegistro((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 🔹 Guardar cambios en modal (sin cambiar estado)
  const actualizarObra = () => {
    const nuevasObras = [...obras];
    nuevasObras[estado_registro.index] = {
      ...estado_registro,
      estado: estado_registro.estado || "registrado", 
    };
    setObras(nuevasObras);
    cerrarModal();
  };

  // 🔹 Cambiar estado directamente desde los iconos
  const cambiarEstado = (index, nuevoEstado) => {
    const nuevasObras = [...obras];
    nuevasObras[index] = { ...nuevasObras[index], estado: nuevoEstado };
    setObras(nuevasObras);
  };

  const obrasFiltradas = obras.filter((obra) =>
    obra.titulo.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-container">
      {/* Navbar */}
      <header className="navbar">
        <div className="left-section">
          <Menu className="menu-icon" onClick={toggleMenu} />
          <nav>
            <ul>
              <li className="active">Panel de Obras</li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Sidebar */}
      {isMenuOpen && (
        <div className="menu-overlay" onClick={closeMenu}>
          <aside className="sidebar" onClick={(e) => e.stopPropagation()}>
            <ul>
              <li onClick={closeMenu}>
                <BookOpen size={20} /> <span>Obras Registradas</span>
              </li>
              <li onClick={closeMenu}>
                <CheckCircle size={20} /> <span>Obras Validadas</span>
              </li>
              <li onClick={closeMenu}>
                <XCircle size={20} /> <span>Obras Rechazadas</span>
              </li>
            </ul>
          </aside>
        </div>
      )}

      {/* Card con tabla */}
      <div className="admin-card">
        <div className="card-header">
          <input
            type="text"
            placeholder="Buscar obra..."
            className="search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Título de la obra</th>
                <th>Autor</th>
                <th>Fecha</th>
                <th>Tipografías</th>
                <th>Ilustración</th>
                <th>Tipo mural</th>
                <th>Técnica</th>
                <th>Conservación</th>
                <th>Altura</th>
                <th>Anchura</th>
                <th>Descripción</th>
                <th>Superficie</th>
                <th>Mensaje</th>
                <th>Contexto</th>
                <th>Localización</th>
                <th>Encargado</th>
                <th>Observaciones</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {obrasFiltradas.map((obra, i) => (
                <tr key={i}>
                  <td>{obra.titulo}</td>
                  <td>{obra.autor}</td>
                  <td>{obra.fecha}</td>
                  <td>{obra.tipografias}</td>
                  <td>{obra.ilustracion}</td>
                  <td>{obra.tipoMural}</td>
                  <td>{obra.tecnica}</td>
                  <td>{obra.estadoConservacion}</td>
                  <td>{obra.altura}</td>
                  <td>{obra.anchura}</td>
                  <td>{obra.descripcion}</td>
                  <td>{obra.superficie}</td>
                  <td>{obra.mensaje}</td>
                  <td>{obra.contexto}</td>
                  <td>{obra.localizacion}</td>
                  <td>{obra.encargado}</td>
                  <td>{obra.observaciones}</td>
                  <td>
                    <span
                      className={`status ${
                        obra.estado === "validado"
                          ? "status-aprobado"
                          : obra.estado === "rechazado"
                          ? "status-rechazado"
                          : "status-pendiente"
                      }`}
                    >
                      {obra.estado}
                    </span>
                  </td>
                  <td className="acciones">
                    <Edit3
                      size={20}
                      className="icon-btn edit"
                      onClick={() => abrirModal(obra, i)}
                      title="Editar"
                    />
                    <CheckCircle
                      size={20}
                      className="icon-btn accept"
                      onClick={() => cambiarEstado(i, "validado")}
                      title="Aceptar"
                    />
                    <XCircle
                      size={20}
                      className="icon-btn reject"
                      onClick={() => cambiarEstado(i, "rechazado")}
                      title="Rechazar"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de edición */}
      {modalAbierto && estado_registro && (
        <div className="modal-overlay" onClick={cerrarModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Editar Obra</h2>
            <div className="modal-form">
              {Object.keys(estado_registro)
                .filter((key) => key !== "index" && key !== "estado")
                .map((campo, idx) => (
                  <div key={idx} className="form-group">
                    <label>{campo}</label>
                    <input
                      type="text"
                      name={campo}
                      value={estado_registro[campo]}
                      onChange={handleChange}
                    />
                  </div>
                ))}
            </div>
            <div className="modal-actions">
              <button className="save-btn" onClick={actualizarObra}>
                Actualizar
              </button>
              <button className="cancel-btn" onClick={cerrarModal}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
