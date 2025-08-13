import { Menu, User, Filter, Image, Plus, LogIn } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const allImages = [
  { src: '/imagen1.jpeg', tipo: 'Mural', Ilustracion_muralista: 'Realista', tecnica: 'Aerosol' },
  { src: '/imagen2.jpeg', tipo: 'Graffiti', estilo: 'Abstracto', tecnica: 'Pincel' },
  { src: '/imagen3.jpeg', tipo: 'Stencil', estilo: 'Pop Art', tecnica: 'Plantilla' },
  { src: '/imagen4.jpeg', tipo: 'Mural', estilo: 'Cubismo', tecnica: 'Aerosol' },
  { src: '/imagen5.jpeg', tipo: 'Graffiti', estilo: 'Realista', tecnica: 'Spray' },
  { src: '/imagen6.jpeg', tipo: 'Stencil', estilo: 'Surrealista', tecnica: 'Plantilla' },
  { src: '/imagen7.jpeg', tipo: 'Mural', estilo: 'Impresionista', tecnica: 'Pincel' },
  { src: '/imagen8.jpeg', tipo: 'Graffiti', estilo: 'Abstracto', tecnica: 'Aerosol' },
];

const HomePage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showFilterOptions, setShowFilterOptions] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('');
  const [filterValue, setFilterValue] = useState('');
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const getFilteredImages = () => {
    if (!selectedFilter || !filterValue) return allImages;
    return allImages.filter((img) => img[selectedFilter] === filterValue);
  };

  const getFilterOptions = (filterType) => {
    const options = [...new Set(allImages.map((img) => img[filterType]))];
    return options;
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
                    <option value="tipo">Tipo</option>
                    <option value="Ilustracion_muralista">Ilustracion muralista</option>
                    <option value="tecnica">Técnica</option>
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
                  <img key={index} src={img.src} alt={`Obra ${index}`} />
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
