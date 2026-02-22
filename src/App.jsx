import React, { useState, useEffect } from "react";
import CuerpoHumano from "./CuerpoHumano";

// Base de ejercicios optimizada para MANCUERNAS Y PESO CORPORAL
const BASE_EJERCICIOS = {
  pecho: [
    { nombre: "Flexiones (Suelo)", series: 3, reps: "12-15", peso: "0" },
    { nombre: "Press con mancuernas (Suelo)", series: 3, reps: "10-12", peso: "10" },
    { nombre: "Aperturas con mancuernas (Suelo)", series: 3, reps: "12", peso: "8" }
  ],
  espalda: [
    { nombre: "Remo con mancuerna a una mano", series: 3, reps: "10-12", peso: "12" },
    { nombre: "Remo con dos mancuernas (Inclinado)", series: 3, reps: "12", peso: "10" },
    { nombre: "Superman (Peso corporal)", series: 3, reps: "15", peso: "0" }
  ],
  abdomen: [
    { nombre: "Plancha abdominal", series: 3, reps: "45 seg", peso: "0" },
    { nombre: "Russian Twist con mancuerna", series: 3, reps: "20", peso: "5" },
    { nombre: "Elevación de piernas", series: 3, reps: "15", peso: "0" }
  ],
  brazos: [
    { nombre: "Curl de bíceps (Mancuernas)", series: 3, reps: "12", peso: "8" },
    { nombre: "Press francés con mancuernas", series: 3, reps: "10", peso: "6" },
    { nombre: "Fondos en silla/sofá", series: 3, reps: "12", peso: "0" }
  ],
  piernas: [
    { nombre: "Sentadillas (Mancuernas)", series: 3, reps: "15", peso: "15" },
    { nombre: "Zancadas (Mancuernas)", series: 3, reps: "12", peso: "10" },
    { nombre: "Puente de glúteo (Con peso)", series: 3, reps: "15", peso: "10" }
  ],
  cardio: [
    { nombre: "Saltar cuerda", series: 3, reps: "1 min", peso: "0" },
    { nombre: "Burpees", series: 3, reps: "10", peso: "0" },
    { nombre: "Jumping Jacks", series: 3, reps: "30", peso: "0" }
  ]
};

const DIAS_SEMANA = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

export default function App() {
  const [pantalla, setPantalla] = useState("menu");
  const [rutina, setRutina] = useState(null);
  const [diasSeleccionados, setDiasSeleccionados] = useState([]);
  const [verCuerpo, setVerCuerpo] = useState(false);
  const [modoEntreno, setModoEntreno] = useState(false);
  const [completados, setCompletados] = useState([]);
  const [historial, setHistorial] = useState([]);
  const [musculoSeleccionado, setMusculoSeleccionado] = useState(null);

  useEffect(() => {
    const rutinaG = localStorage.getItem("rutinaMancuFit");
    const historialG = localStorage.getItem("historialMancuFit");
    if (rutinaG) setRutina(JSON.parse(rutinaG));
    if (historialG) setHistorial(JSON.parse(historialG));
  }, []);

  useEffect(() => {
    if (rutina) localStorage.setItem("rutinaMancuFit", JSON.stringify(rutina));
    localStorage.setItem("historialMancuFit", JSON.stringify(historial));
  }, [rutina, historial]);

  const toggleDia = (dia) => {
    setDiasSeleccionados(prev => 
      prev.includes(dia) ? prev.filter(d => d !== dia) : [...prev, dia]
    );
  };

  const crearNuevaRutina = () => {
    if(confirm("¿Quieres borrar la rutina actual y generar una nueva para casa?")) {
        localStorage.removeItem("rutinaMancuFit");
        setRutina(null);
        setDiasSeleccionados([]);
        setPantalla("seleccionDias");
        setModoEntreno(false);
    }
  };

  const actualizarEjercicio = (dia, index, campo, nuevoValor) => {
    setRutina(prevRutina => ({
      ...prevRutina,
      [dia]: prevRutina[dia].map((ej, i) => 
        i === index ? { ...ej, [campo]: nuevoValor } : ej
      )
    }));
  };

  const toggleCompletado = (id) => {
    setCompletados(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const finalizarEntrenamiento = () => {
    const ejerciciosLogrados = [];
    Object.values(rutina).forEach(lista => {
      const hechos = lista.filter(ej => completados.includes(ej.id));
      ejerciciosLogrados.push(...hechos);
    });

    if (ejerciciosLogrados.length === 0) {
      setModoEntreno(false);
      return;
    }

    const nuevaSesion = {
      id: crypto.randomUUID(),
      fecha: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'long' }),
      ejercicios: ejerciciosLogrados
    };

    setHistorial([nuevaSesion, ...historial]);
    setModoEntreno(false);
    setCompletados([]);
    alert("¡Entrenamiento guardado! 🏆");
  };

  // NUEVO: Función para manejar el clic en el cuerpo
  const manejarSeleccionMusculo = (idMusculo) => {
    setMusculoSeleccionado(idMusculo);
  };

  function generarRutina() {
    let nuevaRutina = {};
    const todasCategorias = Object.values(BASE_EJERCICIOS).flat();

    diasSeleccionados.forEach((dia) => {
      let ejerciciosDia = Object.values(BASE_EJERCICIOS).map(cat => ({
        ...cat[Math.floor(Math.random() * cat.length)],
        id: crypto.randomUUID()
      }));

      while (ejerciciosDia.length < 6) { // 6 ejercicios por día es ideal para casa
        let candidato = todasCategorias[Math.floor(Math.random() * todasCategorias.length)];
        if (!ejerciciosDia.some(e => e.nombre === candidato.nombre)) {
          ejerciciosDia.push({ ...candidato, id: crypto.randomUUID() });
        }
      }
      nuevaRutina[dia] = ejerciciosDia;
    });

    setRutina(nuevaRutina);
    setPantalla("mostrarRutina");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1e1e2e] to-black text-white flex flex-col items-center p-6 font-sans">
      <h1 className="text-5xl font-extrabold mb-8 italic tracking-tighter text-blue-500">MancuFit</h1>

{/* VISTA: CUERPO HUMANO INTERACTIVO */}
      {verCuerpo ? (
        <div className="w-full max-w-md flex flex-col items-center gap-6">
          <div className="flex justify-between w-full items-center">
              <h2 className="text-2xl font-black italic text-blue-500">ANATOMÍA</h2>
              <button 
                onClick={() => {setVerCuerpo(false); setMusculoSeleccionado(null);}} 
                className="text-gray-400 text-sm border border-white/10 px-4 py-1 rounded-full"
              >
                Cerrar
              </button>
          </div>

          {!musculoSeleccionado ? (
            /* Si no hay músculo seleccionado, mostramos el mapa del cuerpo */
            <CuerpoHumano alSeleccionarMusculo={manejarSeleccionMusculo} />
          ) : (
            /* Si el usuario tocó un músculo, mostramos la lista de ejercicios de casa */
            <div className="w-full">
              <button 
                onClick={() => setMusculoSeleccionado(null)}
                className="mb-4 text-blue-400 text-sm flex items-center gap-2 font-bold"
              >
                ← Volver al cuerpo
              </button>
              
              <div className="bg-white/5 border border-white/10 rounded-3xl p-6 shadow-2xl">
                <h3 className="text-2xl font-black text-blue-400 uppercase mb-4 italic">
                  {musculoSeleccionado}
                </h3>
                <div className="space-y-3">
                  {BASE_EJERCICIOS[musculoSeleccionado]?.map((ej, i) => (
                    <div key={i} className="bg-black/40 p-4 rounded-2xl border border-white/5">
                      <p className="font-bold text-white text-lg">{ej.nombre}</p>
                      <div className="flex gap-4 mt-2">
                        <span className="text-[10px] text-gray-500 font-bold uppercase">Series: {ej.series}</span>
                        <span className="text-[10px] text-gray-500 font-bold uppercase">Reps: {ej.reps}</span>
                        {ej.peso !== "0" && <span className="text-[10px] text-blue-400 font-bold uppercase">Sugerido: {ej.peso}kg</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (

        <>
          {pantalla === "menu" && (
            <div className="grid grid-cols-1 gap-4 w-full max-w-sm">
              <button className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-blue-600 transition" onClick={() => (rutina ? setPantalla("checkRutina") : setPantalla("seleccionDias"))}>📋 MI RUTINA</button>
              <button className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-blue-600 transition" onClick={() => setVerCuerpo(true)}>👤 ANATOMÍA</button>
              <button className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-orange-600 transition" onClick={() => setPantalla("historial")}>📈 HISTORIAL ({historial.length})</button>
            </div>
          )}

          {pantalla === "historial" && (
            <div className="w-full max-w-md space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Registro 📈</h2>
                <button onClick={() => setPantalla("menu")} className="text-blue-400">Volver</button>
              </div>
              {historial.length === 0 ? <p className="text-gray-500 text-center">Sin entrenos aún.</p> : 
                historial.map(sesion => (
                  <div key={sesion.id} className="bg-white/5 border border-white/10 p-4 rounded-2xl">
                    <p className="text-blue-400 font-bold mb-2">{sesion.fecha}</p>
                    <ul className="text-xs space-y-1 text-gray-400">
                      {sesion.ejercicios.map((ej, i) => (
                        <li key={i}>✓ {ej.nombre} ({ej.series} ser. | {ej.peso}kg)</li>
                      ))}
                    </ul>
                  </div>
                ))
              }
            </div>
          )}

          {pantalla === "checkRutina" && (
            <div className="bg-black/40 backdrop-blur-xl p-8 rounded-3xl text-center border border-white/10">
              <p className="text-xl mb-6">¿Continuamos, campeón? 💪</p>
              <div className="flex flex-col gap-3">
                <button className="bg-green-600 py-4 rounded-2xl font-bold" onClick={() => setPantalla("mostrarRutina")}>CONTINUAR PLAN</button>
                <button className="text-red-400 text-sm" onClick={crearNuevaRutina}>Reiniciar Plan Semanal</button>
              </div>
            </div>
          )}

          {pantalla === "seleccionDias" && (
            <div className="bg-white/5 p-8 rounded-3xl w-full max-w-md border border-white/10">
              <h2 className="text-2xl font-bold mb-6 text-center italic">PLANIFICA TU SEMANA</h2>
              <div className="grid grid-cols-2 gap-3 mb-8">
                {DIAS_SEMANA.map((dia) => (
                  <button key={dia} onClick={() => toggleDia(dia)} className={`py-4 rounded-2xl font-bold transition-all ${diasSeleccionados.includes(dia) ? "bg-blue-600" : "bg-white/5 border border-white/5"}`}>{dia}</button>
                ))}
              </div>
              <button disabled={diasSeleccionados.length === 0} className="w-full py-5 rounded-2xl font-black bg-blue-500 shadow-lg shadow-blue-500/20" onClick={generarRutina}>GENERAR ENTRENAMIENTO</button>
            </div>
          )}

          {pantalla === "mostrarRutina" && rutina && (
            <div className="w-full max-w-4xl space-y-6">
              <div className="sticky top-4 bg-[#1e1e2e]/90 backdrop-blur-xl p-4 rounded-3xl z-30 border border-white/10 shadow-2xl">
                <div className="flex justify-between items-center mb-4 px-2">
                  <h2 className="text-xl font-black italic">HOGAR DULCE GYM 🏠</h2>
                  <button onClick={() => setPantalla("menu")} className="text-gray-400 text-xs">CERRAR</button>
                </div>
                <button 
                  onClick={modoEntreno ? finalizarEntrenamiento : () => setModoEntreno(true)}
                  className={`w-full py-4 rounded-2xl font-black transition-all ${modoEntreno ? "bg-red-500" : "bg-green-500"}`}
                >
                  {modoEntreno ? "TERMINAR Y GUARDAR 🏁" : "EMPEZAR AHORA ▶"}
                </button>
              </div>
              
              <div className="grid gap-6 md:grid-cols-2">
                {Object.entries(rutina).map(([dia, ejercicios]) => (
                  <div key={dia} className="bg-white/5 border border-white/10 p-5 rounded-3xl">
                    <h3 className="text-blue-400 font-black mb-4 border-b border-white/10 pb-2">{dia}</h3>
                    <div className="space-y-4">
                      {ejercicios.map((ej, index) => {
                        const esCompletado = completados.includes(ej.id);
                        return (
                          <div key={ej.id} className={`p-4 rounded-2xl border transition-all ${esCompletado ? "bg-green-500/10 border-green-500/30 opacity-40" : "bg-black/40 border-white/5"}`}>
                            <div className="flex justify-between items-center mb-3">
                              <input disabled={modoEntreno} className="bg-transparent border-none font-bold text-white w-full outline-none" value={ej.nombre} onChange={(e) => actualizarEjercicio(dia, index, 'nombre', e.target.value)} />
                              {modoEntreno && (
                                <button onClick={() => toggleCompletado(ej.id)} className={`min-w-[44px] h-11 rounded-full flex items-center justify-center ${esCompletado ? "bg-green-500 text-black" : "bg-white/10 border border-white/10"}`}>{esCompletado ? "✓" : "○"}</button>
                              )}
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                              <div className="text-center">
                                <p className="text-[10px] text-gray-500 font-bold mb-1 uppercase">Series</p>
                                <input disabled={modoEntreno} className="bg-gray-800 text-white w-full text-center rounded-lg py-1 text-sm" value={ej.series} onChange={(e) => actualizarEjercicio(dia, index, 'series', e.target.value)} />
                              </div>
                              <div className="text-center">
                                <p className="text-[10px] text-gray-500 font-bold mb-1 uppercase">Reps</p>
                                <input disabled={modoEntreno} className="bg-gray-800 text-white w-full text-center rounded-lg py-1 text-sm" value={ej.reps} onChange={(e) => actualizarEjercicio(dia, index, 'reps', e.target.value)} />
                              </div>
                              <div className="text-center">
                                <p className="text-[10px] text-blue-400 font-bold mb-1 uppercase">Peso kg</p>
                                <input disabled={modoEntreno} className="bg-blue-900/40 text-blue-200 w-full text-center rounded-lg py-1 text-sm" value={ej.peso} onChange={(e) => actualizarEjercicio(dia, index, 'peso', e.target.value)} />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}