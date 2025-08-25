import { useState, useEffect } from "react"; 
import { Menu, CheckCircle, XCircle, BookOpen, Edit3 } from "lucide-react";
import "./AdminObras.css";

const API_BASE_URL = "http://localhost:8080"

export default function AdminObras() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [obras, setObras] = useState([]);

  const [modalAbierto, setModalAbierto] = useState(false);
  const [estado_registro, setEstadoRegistro] = useState(null);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  useEffect(() => {
  fetch(`${API_BASE_URL}/api/obras`, {
    method: "GET",
    credentials: "include", // 🔥 esto envía la cookie con el JWT
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(res => res.json())
    .then(data => {
      setObras(data);
    })
    .catch(err => console.error(err));
}, []);


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
  // 🔹 Cambiar estado directamente desde los iconos
const cambiarEstado = async (obra, index, estadoRegistroId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/obras/${obra.id}/validarobra?idRegisteredStatus=${estadoRegistroId}`,
      {
        method: "PATCH",
        credentials: "include", // 👈 importante para enviar cookie JWT
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Error al actualizar la obra");
    }

    // ✅ Actualizamos el estado local
    const nuevasObras = [...obras];
    nuevasObras[index] = {
      ...obra,
      registeredStatus: {
        ...obra.registeredStatus,
        id: estadoRegistroId,  // guardamos el nuevo id del estado
      },
    };
    setObras(nuevasObras);

  } catch (err) {
    console.error("Fallo en PATCH:", err);
  }
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
                <th>Restaurador</th>
                <th>Observaciones</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
  {obrasFiltradas.map((obra, i) => (
    <tr key={i}>
      <td>{obra.titulo}</td>
      <td>{obra.autor_name}</td>
      <td>{obra.fechaCreacion}</td>
      <td>{obra.typography?.tipografia || "—"}</td>
      <td>{obra.ilustracion?.ilustracion || "—"}</td>
      <td>{obra.tipo?.tipo_mural || "—"}</td>
      <td>{obra.tecnica?.tecnica || "—"}</td>
      <td>{obra.estadoConservacion?.estado || "—"}</td>
      <td>{obra.alto}</td>
      <td>{obra.ancho}</td>
      <td>{obra.descripcion}</td>
      <td>{obra.surface?.superficie || "—"}</td>
      <td>{obra.mensaje}</td>
      <td>{obra.contexto_historico}</td>
      <td>{obra.ubicacion?.direccion || "—"}</td>
      <td>{obra.restaurador}</td>
      <td>{obra.observaciones}</td>
      <td>
        <span
          className={`status ${
            obra.registeredStatus?.estado_registro === "validado"
              ? "status-aprobado"
              : obra.registeredStatus?.estado_registro === "rechazado"
              ? "status-rechazado"
              : "status-pendiente"
          }`}
        >
          {obra.registeredStatus?.estado_registro}
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
          onClick={() => cambiarEstado(obra,i, "689b8fda591b9c7ffe07d47f")}
          title="Aceptar"
        />
        <XCircle
          size={20}
          className="icon-btn reject"
          onClick={() => cambiarEstado(obra,i, "689b8ff3591b9c7ffe07d480")}
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
