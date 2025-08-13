import React, { useState, useEffect } from 'react';
import './RegistrarObra.css';

const RegistrarObra = () => {
  const [step, setStep] = useState(1);

  // Estado para la obra
  const [obra, setObra] = useState({
    titulo: '',
    autor: '',
    tecnica: '',
    fecha: '',
    descripcion: '',
    imagen: null,
    alto: '',
    ancho: '',
    mensajeObra: '',
    tipoMural: '',
    estadoConservacion: '',
    superficieMural: ''
  });

  // Estados para catálogos
  const [tecnicas, setTecnicas] = useState([]);
  const [tiposMural, setTiposMural] = useState([]);
  const [estadosConservacion, setEstadosConservacion] = useState([]);
  const [superficiesMural, setSuperficiesMural] = useState([]);

  useEffect(() => {
    // Simulación de llamadas API (reemplaza por tus endpoints reales)
    fetch('/api/catalogos/tecnicas')
      .then(res => res.json())
      .then(data => setTecnicas(data));

    fetch('/api/catalogos/tiposMural')
      .then(res => res.json())
      .then(data => setTiposMural(data));

    fetch('/api/catalogos/estadosConservacion')
      .then(res => res.json())
      .then(data => setEstadosConservacion(data));

    fetch('/api/catalogos/superficiesMural')
      .then(res => res.json())
      .then(data => setSuperficiesMural(data));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setObra({ ...obra, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setObra({ ...obra, imagen: file });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Obra registrada:', obra);
    alert('Obra registrada correctamente.');
    // Lógica de envío a backend
    setObra({
      titulo: '',
      autor: '',
      tecnica: '',
      fecha: '',
      descripcion: '',
      imagen: null,
      alto: '',
      ancho: '',
      mensajeObra: '',
      tipoMural: '',
      estadoConservacion: '',
      superficieMural: ''
    });
    setStep(1);
  };

  return (
    <div className="registro-obra-container">
      <div className="form-box">
        <h2>Registrar Obra</h2>

        {/* Indicador de pasos */}
        <div className="step-indicator">
          <span className={step === 1 ? 'active' : ''}>•</span>
          <span className={step === 2 ? 'active' : ''}>•</span>
        </div>

        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <>
              <input
                type="text"
                name="titulo"
                placeholder="Título"
                value={obra.titulo}
                onChange={handleChange}
                required
              />

              <input
                type="text"
                name="autor"
                placeholder="Autor"
                value={obra.autor}
                onChange={handleChange}
                required
              />

              {/* Select de técnicas desde Mongo */}
              <select
                name="tecnica"
                value={obra.tecnica}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione técnica</option>
                {tecnicas.map((t, idx) => (
                  <option key={idx} value={t.valor}>
                    {t.nombre}
                  </option>
                ))}
              </select>

              {/* >>> ÚNICO CAMBIO: etiqueta clara para la fecha <<< */}
              <label htmlFor="fecha" className="input-label">
                Fecha de creación del mural
              </label>
              <input
                type="date"
                id="fecha"
                name="fecha"
                value={obra.fecha}
                onChange={handleChange}
                required
                aria-label="Fecha de creación del mural"
                title="Fecha de creación del mural"
              />
              {/* >>> FIN DEL CAMBIO <<< */}

              <textarea
                name="descripcion"
                placeholder="Descripción"
                value={obra.descripcion}
                onChange={handleChange}
              />

              <label className="file-label">
                Cargar Imagen
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleImageChange}
                />
              </label>

              {obra.imagen && (
                <p className="file-info">📸 Imagen lista: {obra.imagen.name}</p>
              )}

              <button type="button" onClick={() => setStep(2)}>
                Siguiente
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <input
                type="text"
                name="alto"
                placeholder="Alto"
                value={obra.alto}
                onChange={handleChange}
              />

              <input
                type="text"
                name="ancho"
                placeholder="Ancho"
                value={obra.ancho}
                onChange={handleChange}
              />

              <textarea
                name="mensajeObra"
                placeholder="Mensaje de la obra"
                value={obra.mensajeObra}
                onChange={handleChange}
              />

              {/* Select tipo mural */}
              <select
                name="tipoMural"
                value={obra.tipoMural}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione tipo de mural</option>
                {tiposMural.map((tm, idx) => (
                  <option key={idx} value={tm.valor}>
                    {tm.nombre}
                  </option>
                ))}
              </select>

              {/* Select estado de conservación */}
              <select
                name="estadoConservacion"
                value={obra.estadoConservacion}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione estado de conservación</option>
                {estadosConservacion.map((ec, idx) => (
                  <option key={idx} value={ec.valor}>
                    {ec.nombre}
                  </option>
                ))}
              </select>

              {/* Select superficie mural */}
              <select
                name="superficieMural"
                value={obra.superficieMural}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione superficie del mural</option>
                {superficiesMural.map((sm, idx) => (
                  <option key={idx} value={sm.valor}>
                    {sm.nombre}
                  </option>
                ))}
              </select>

              <div className="button-group">
                <button type="button" onClick={() => setStep(1)}>
                  Anterior
                </button>
                <button type="submit">Registrar</button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default RegistrarObra;

