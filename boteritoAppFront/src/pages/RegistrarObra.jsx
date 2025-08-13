import React, { useState, useEffect } from 'react';
import './RegistrarObra.css';

const API_BASE_URL = "http://localhost:8080";

const RegistrarObra = () => {
  const [step, setStep] = useState(1);

  // Estado para la obra
  const [obra, setObra] = useState({
    titulo: '',
    autor_name: '',
    tecnica: '',
    fecha: '',
    descripcion: '',
    imagen: null,
    alto: '',
    ancho: '',
    mensajeObra: '',
    tipoMural: '',
    estadoConservacionId: '',
    superficieId: '',
    lat: '',
    lng:'',
    direccion: '',
    estadoRegistradoId: '689b8fbd591b9c7ffe07d47e'
  });

  // Estados para catálogos
  const [tecnicas, setTecnicas] = useState([]);
  const [tiposMural, setTiposMural] = useState([]);
  const [estadosConservacion, setEstadosConservacion] = useState([]);
  const [superficiesMural, setSuperficiesMural] = useState([]);

  // Cargar catálogos desde backend
  useEffect(() => {
    const fetchCatalogos = async () => {
      try {
        const [resTecnicas, resTipos, resConservacion, resSuperficies] = await Promise.all([
          fetch(`${API_BASE_URL}/api/tecnicas`),
          fetch(`${API_BASE_URL}/api/tipos`),
          fetch(`${API_BASE_URL}/api/conservacion`),
          fetch(`${API_BASE_URL}/api/superficies`)
        ]);

        if (!resTecnicas.ok || !resTipos.ok || !resConservacion.ok || !resSuperficies.ok) {
          throw new Error("Error al obtener catálogos del backend");
        }

        const dataTecnicas = await resTecnicas.json();
        const dataTipos = await resTipos.json();
        const dataConservacion = await resConservacion.json();
        const dataSuperficies = await resSuperficies.json();

        setTecnicas(dataTecnicas);
        setTiposMural(dataTipos);
        setEstadosConservacion(dataConservacion);
        setSuperficiesMural(dataSuperficies);
      } catch (error) {
        console.error("Error al cargar catálogos:", error);
      }
    };

    fetchCatalogos();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setObra({ ...obra, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setObra({ ...obra, imagen: file });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const formData = new FormData();

    // 1) Agregar la imagen
    if (obra.imagen) {
      formData.append("imagen", obra.imagen);
    }

    // 2) Agregar los demás campos como JSON
    const obraData = { ...obra };
    delete obraData.imagen; // eliminamos la imagen del objeto JSON
    formData.append("obra", new Blob([JSON.stringify(obraData)], { type: "application/json" }));

    // Imprimir contenido de FormData
    const data2 = {};
for (let [key, value] of formData.entries()) {
  if (value instanceof File) {
    data2[key] = value.name; // solo nombre del archivo, no el contenido
  } else {
    data2[key] = value;
  }
}
console.log(JSON.stringify(data2, null, 2));
const obraBlob = formData.get("obra");
obraBlob.text().then(text => console.log("Contenido obra:", text));



    const response = await fetch(`${API_BASE_URL}/api/obras/guardarObra`, {
      method: "POST",
      body: formData
    });

    if (!response.ok) throw new Error("Error al registrar la obra");

    const data = await response.json();
    console.log("✅ Obra creada:", data);

    alert("Obra registrada correctamente.");
    
    setObra({
      titulo: '',
    autor_name: '',
    tecnica: '',
    fecha: '',
    descripcion: '',
    imagen: null,
    alto: '',
    ancho: '',
    mensajeObra: '',
    tipoMural: '',
    estadoConservacionId: '',
    superficieId: '',
    lat: '',
    lng:'',
    direccion: '',
    estadoRegistradoId: '689b8fbd591b9c7ffe07d47e'
    });
    setStep(1);

  } catch (error) {
    console.error("❌ Error:", error);
    alert("Hubo un problema al registrar la obra");
  }
};


  return (
    <div className="registro-obra-container">
      <div className="form-box">
        <h2>Registrar Obra</h2>
        <div className="step-indicator">
          <span className={step === 1 ? 'active' : ''}>•</span>
          <span className={step === 2 ? 'active' : ''}>•</span>
          <span className={step === 3 ? 'active' : ''}>•</span>
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
                name="autor_name"
                placeholder="Autor"
                value={obra.autor_name}
                onChange={handleChange}
                required
              />
              <select
                name="tecnica"
                value={obra.tecnica}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione técnica</option>
                {tecnicas.map((t) => (
                  <option key={t.id} value={t.id}>{t.tecnica}</option>
                ))}
              </select>

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
              />

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

              {obra.imagen && <p className="file-info">📸 Imagen lista: {obra.imagen.name}</p>}

              <button type="button" onClick={() => setStep(2)}>Siguiente</button>
            </>
          )}

          {step === 2 && (
            <>
              <input type="text" name="alto" placeholder="Alto" value={obra.alto} onChange={handleChange} />
              <input type="text" name="ancho" placeholder="Ancho" value={obra.ancho} onChange={handleChange} />
              <textarea name="mensajeObra" placeholder="Mensaje de la obra" value={obra.mensajeObra} onChange={handleChange} />

              <select name="tipoMural" value={obra.tipoMural} onChange={handleChange} required>
                <option value="">Seleccione tipo de mural</option>
                {tiposMural.map((tm) => (
                  <option key={tm.id} value={tm.id}>{tm.tipo_mural}</option>
                ))}
              </select>

              <select name="estadoConservacionId" value={obra.estadoConservacionId} onChange={handleChange} required>
                <option value="">Seleccione estado de conservación</option>
                {estadosConservacion.map((ec) => (
                  <option key={ec.id} value={ec.id}>{ec.estado}</option>
                ))}
              </select>

              <select name="superficieId" value={obra.superficieId} onChange={handleChange} required>
                <option value="">Seleccione superficie del mural</option>
                {superficiesMural.map((sm) => (
                  <option key={sm.id} value={sm.id}>{sm.superficie}</option>
                ))}
              </select>

              <div className="button-group">
                <button type="button" onClick={() => setStep(1)}>Anterior</button>
                <button type="button" onClick={() => setStep(3)}>Siguiente</button>
              </div>
            </>
          )}
          {step === 3 && (
            <>
              <input type="text" name="lat" placeholder="latitus" value={obra.lat} onChange={handleChange} />
              <input type="text" name="lng" placeholder="Longitud" value={obra.lng} onChange={handleChange} />
              <textarea name="direccion" placeholder="Direccion" value={obra.direccion} onChange={handleChange} />

              <div className="button-group">
                <button type="button" onClick={() => setStep(2)}>Anterior</button>
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
