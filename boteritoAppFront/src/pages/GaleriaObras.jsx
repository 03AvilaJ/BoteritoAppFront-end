import { useEffect, useState } from "react";
import { Heart, MessageCircle, X } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import "./GaleriaObras.css";

const API_BASE_URL = "http://localhost:8080";

export default function GaleriaObras() {
  const [allImages, setAllImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedObra, setSelectedObra] = useState(null);
  const [isLoggedIn] = useState(!!localStorage.getItem("role"));
  const [pseudonimo_user] = useState(localStorage.getItem("pseudonimo"));

  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/obras/listaObras`)
      .then((res) => res.json())
      .then((data) => {
        setAllImages(data || []);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleLike = async (obraId) => {

    if (!isLoggedIn) {
      navigate("/login"); // 👈 si no está logeado, lo mandamos al login
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/obras/${obraId}/like`,
        {
          method: "GET",
          credentials: "include", // 👈 importante para la cookie
        }
      );

      if (!response.ok) {
        console.error("Error al agregar like:", response.status);
        return;
      }

      const newLike = await response.json();

      // ✅ actualizar comentarios en selectedObra
      setSelectedObra((prev) =>
        prev
          ? { ...prev, likes: [...(prev.likes || []), newLike] }
          : prev
      );

      // ✅ actualizar comentarios en allImages
      setAllImages((prev) =>
        prev.map((obra) =>
          obra.id === obraId
            ? { ...obra, likes: [...(obra.likes || []), newLike] }
            : obra
        )
      );
    } catch (error) {
      console.error("Error en la petición:", error);
    }
  };


  // 🔹 Agregar comentario al backend
  const handleComment = async (obraId, texto, inputEl) => {
    if (!texto.trim()) return;

    if (!isLoggedIn) {
      navigate("/login"); // 👈 si no está logeado, lo mandamos al login
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/obras/${obraId}/comments`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include", // 👈 importante para la cookie
          body: JSON.stringify({ texto }),
        }
      );

      if (!response.ok) {
        console.error("Error al agregar comentario:", response.status);
        return;
      }

      const newComment = await response.json();
      console.log(newComment);

      // ✅ actualizar comentarios en selectedObra
      setSelectedObra((prev) =>
        prev
          ? { ...prev, comentarios: [...(prev.comentarios || []), newComment] }
          : prev
      );

      // ✅ actualizar comentarios en allImages
      setAllImages((prev) =>
        prev.map((obra) =>
          obra.id === obraId
            ? { ...obra, comentarios: [...(obra.comentarios || []), newComment] }
            : obra
        )
      );

      // ✅ limpiar el input
      if (inputEl) inputEl.value = "";
    } catch (error) {
      console.error("Error en la petición:", error);
    }
  };

  if (loading) {
    return (
      <div className="galeria-container">
        <div className="empty">Cargando obras…</div>
      </div>
    );
  }

  // función para obtener hasta 3 comentarios aleatorios
  function getRandomComments(comentarios = [], max = 3) {
    if (!Array.isArray(comentarios)) return [];
    const shuffled = [...comentarios].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, max);
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
                disabled={obra.likes?.some(like => like.user_name === pseudonimo_user)}
              >
                <Heart size={20}
                  color={obra.likes?.some(like => like.user_name === pseudonimo_user) ? "red" : "gray"}
                  fill={obra.likes?.some(like => like.user_name === pseudonimo_user) ? "red" : "none"}
                />
                <span className="count">
                  {Array.isArray(obra.likes) ? obra.likes.length : 0}
                </span>
              </button>

              <button
                className="circle-btn"
                title="Comentar"
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
        <div className="modal-overlay" onClick={() => setSelectedObra(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setSelectedObra(null)}>
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
                    disabled={selectedObra.likes?.some(like => like.user_name === pseudonimo_user)}
                  >
                    <Heart size={20}
                      color={selectedObra.likes?.some(like => like.user_name === pseudonimo_user) ? "red" : "gray"}
                      fill={selectedObra.likes?.some(like => like.user_name === pseudonimo_user) ? "red" : "none"}
                    />
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

                {/* solo 3 comentarios random */}
                <div className="comments-list">
                  {getRandomComments(selectedObra.comentarios).map((c, idx) => (
                    <div key={idx} className="comment">
                      <strong>{c.nameUser || "Usuario"}:</strong>{" "}
                      {c.texto || c}
                    </div>
                  ))}
                </div>

                {/* caja comentario */}
                <div className="comment-box">
                  <input
                    type="text"
                    placeholder="Añade un comentario..."
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleComment(
                          selectedObra.id,
                          e.target.value,
                          e.target
                        );
                      }
                    }}
                  />
                  <MessageCircle
                    size={20}
                    className="send-btn"
                    onClick={() => {
                      const input = document.querySelector(
                        ".comment-box input"
                      );
                      if (input) {
                        handleComment(selectedObra.id, input.value, input);
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
