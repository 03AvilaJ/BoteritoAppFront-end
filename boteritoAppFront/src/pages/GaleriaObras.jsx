import { useEffect, useState } from "react";
import { Heart, MessageCircle, X } from "lucide-react";
import "./GaleriaObras.css";

const API_BASE_URL = "http://localhost:8080";

export default function GaleriaObras() {
  const [allImages, setAllImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedObra, setSelectedObra] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/obras/listaObras`)
      .then((res) => res.json())
      .then((data) => {
        setAllImages(data || []);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleLike = (obraId) => {
    console.log("Like a:", obraId);
  };

  const handleComment = (obraId, comment) => {
    console.log("Nuevo comentario en obra:", obraId, comment);
  };

  if (loading) {
    return (
      <div className="galeria-container">
        <div className="empty">Cargando obras…</div>
      </div>
    );
  }

  return (
    <div className="galeria-container">
      <div className="cards">
        {allImages.map((obra) => (
          <div
            className="card"
            key={obra.id}
            onClick={() => setSelectedObra(obra)}
          >
            <img
              src={obra.link_obra}
              alt={`Obra ${obra.titulo || obra.id}`}
              onError={(e) => {
                e.currentTarget.src =
                  "https://via.placeholder.com/240x320?text=Sin+imagen";
              }}
            />

            <div className="card-info">
              <h4 className="title">{obra.titulo || "Obra"}</h4>
              <p className="author">{obra.autor_name || "Autor desconocido"}</p>
            </div>

            <div
              className="actions"
              onClick={(e) => e.stopPropagation()} // evita abrir modal si click en acciones
            >
              <button
                className="circle-btn"
                title="Me gusta"
                onClick={() => handleLike(obra.id)}
              >
                <Heart size={20} />
                <span className="count">
                  {Array.isArray(obra.likes) ? obra.likes.length : 0}
                </span>
              </button>

              <button
                className="circle-btn"
                title="Comentar"
                onClick={() => console.log("Abrir comentarios de:", obra.id)}
              >
                <MessageCircle size={20} />
                <span className="count">
                  {Array.isArray(obra.comentarios) ? obra.comentarios.length : 0}
                </span>
              </button>
            </div>
          </div>
        ))}

        {allImages.length === 0 && (
          <div className="empty">No hay obras para mostrar.</div>
        )}
      </div>

      <div className="arrow-down" aria-hidden></div>

      {/* --- Modal de detalle --- */}
      {selectedObra && (
        <div
          className="modal-overlay"
          onClick={() => setSelectedObra(null)}
        >
          <div
            className="modal"
            onClick={(e) => e.stopPropagation()} // evita cerrar al hacer click dentro
          >
            <button
              className="close-btn"
              onClick={() => setSelectedObra(null)}
            >
              <X size={24} />
            </button>

            <div className="modal-content">
              <div className="modal-left">
                <img
                  src={selectedObra.link_obra}
                  alt={selectedObra.titulo}
                  className="modal-img"
                />
              </div>

              <div className="modal-right">
                <h2>{selectedObra.titulo}</h2>
                <p className="author">{selectedObra.autor_name}</p>
                <p className="desc">{selectedObra.descripcion}</p>

                <div className="modal-actions">
                  <button
                    className="circle-btn"
                    onClick={() => handleLike(selectedObra.id)}
                  >
                    <Heart size={20} />
                    <span className="count">
                      {Array.isArray(selectedObra.likes)
                        ? selectedObra.likes.length
                        : 0}
                    </span>
                  </button>
                  <button className="circle-btn">
                    <MessageCircle size={20} />
                    <span className="count">
                      {Array.isArray(selectedObra.comentarios)
                        ? selectedObra.comentarios.length
                        : 0}
                    </span>
                  </button>
                </div>

                <div className="comment-box">
                  <input
                    type="text"
                    placeholder="Añade un comentario..."
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleComment(selectedObra.id, e.target.value);
                        e.target.value = "";
                      }
                    }}
                  />
                  <MessageCircle size={20} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
