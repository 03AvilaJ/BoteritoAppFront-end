import { Menu, User, Filter, Image, Plus, LogIn } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const API_BASE_URL = "http://localhost:8080"

const HomePage = () => {


  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showFilterOptions, setShowFilterOptions] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('');
  const [filterValue, setFilterValue] = useState('');
  const [allImages, setAllImages] = useState([]);
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const getFilterField = (img, filterType) => {
    switch (filterType) {
      case "tipo":
        return img.tipo?.tipo_mural || "";
      case "tecnica":
        return img.tecnica?.tecnica || "";
      case "estadoConservacion":
        return img.estadoConservacion?.estado || "";
      default:
        return "";
    }
  }
  const getFilteredImages = () => {
    if (!selectedFilter || !filterValue) return allImages;
    return allImages.filter((img) => getFilterField(img, selectedFilter) === filterValue);
  };
  const getFilterOptions = (filterType) => {
    const options = allImages.map(img => getFilterField(img, filterType));
    return [...new Set(options)]; // eliminamos duplicados
  };


  const filteredImages = getFilteredImages();
  const groups = [];
  for (let i = 0; i < filteredImages.length; i += 4) {
    groups.push(filteredImages.slice(i, i + 4));
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % groups.length);
    }, 10000);
    return () => clearInterval(interval);
  }, [groups.length]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/obras/listaObras`)
      .then(res => res.json())
      .then(data => {
        console.log("Respuesta completa del backend:", data);
        setAllImages(data)
      })
      .catch(err => console.error(err));
  }, []);

  


  return (
    <div className="home-container">
      <header className="navbar">
        <div className="left-section">
          <Menu className="menu-icon" onClick={toggleMenu} />
          <nav>
            <ul>
              <li className="active">Mapa</li>
            </ul>
          </nav>
        </div>

        {/* 🔹 Botón de ingresar decente */}
        <div className="right-section">
          <span className="app-title">Boterito APP</span>
          <button
            className="btn-ingresar"
            onClick={() => navigate('/login')}
          >
            <LogIn size={18} style={{ marginRight: '6px' }} />
            Ingresar
          </button>
        </div>
      </header>

      {isMenuOpen && (
        <div className="menu-overlay" onClick={closeMenu}>
          <aside className="sidebar" onClick={(e) => e.stopPropagation()}>
            <ul>
              <li onClick={closeMenu}><User size={20} /> <span>Perfil</span></li>
              <li onClick={() => setShowFilterOptions(!showFilterOptions)}>
                <Filter size={20} /> <span>Filtros</span>
              </li>
              {showFilterOptions && (
                <div className="filter-section">
                  <label htmlFor="filterType">Tipo de filtro:</label>
                  <select
                    id="filterType"
                    value={selectedFilter}
                    onChange={(e) => {
                      setSelectedFilter(e.target.value);
                      setFilterValue('');
                    }}
                  >
                    <option value="">-- Tipo --</option>
                    <option value="tipo">Tipo de mural</option>
                    <option value="tecnica">Técnica</option>
                    <option value="estadoConservacion">Estado de conservación</option>
                  </select>


                  {selectedFilter && (
                    <>
                      <label htmlFor="filterValue">Valor:</label>
                      <select
                        id="filterValue"
                        value={filterValue}
                        onChange={(e) => setFilterValue(e.target.value)}
                      >
                        <option value="">-- Valor --</option>
                        {getFilterOptions(selectedFilter).map((val, i) => (
                          <option key={i} value={val}>{val}</option>
                        ))}
                      </select>
                    </>
                  )}
                </div>
              )}
              <li onClick={closeMenu}><Image size={20} /> <span>Galería</span></li>

              {/* 🔹 NUEVO BOTÓN: Registrar usuario */}
              <li onClick={() => { closeMenu(); navigate('/registrarusuario'); }}>
                <User size={20} /> <span>Registrar usuario</span>
              </li>

              <li onClick={() => { closeMenu(); navigate('/registrar'); }}>
                <Plus size={20} /> <span>Registrar obra</span>
              </li>
            </ul>
          </aside>
        </div>
      )}

      <main className="main">
        <MapContainer center={[5.538, -73.367]} zoom={13} scrollWheelZoom={false} className="map-background">
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="© OpenStreetMap contributors"
          />
        </MapContainer>

        <section className="info-card">
          <h1>Mural Tunjano</h1>
          <img src="/imagen5.jpeg" alt="Mural" />
          <p>Descripción breve de la obra</p>
        </section>

        <div className="carousel-fixed">
          <div className="slider" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
            {groups.map((group, groupIndex) => (
              <div key={groupIndex} className="slide-group">
                {group.map((img, index) => (
                  <img
                    key={index}
                    src={img.link_obra} // 👈 Aquí usas el campo correcto del backend
                    alt={`Obra ${index}`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
};

export default HomePage;
