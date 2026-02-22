import React, { useState, useEffect } from "react";
import CuerpoHumano from "./CuerpoHumano";

const BASE_EJERCICIOS = {
  pecho: [
    { nombre: "Flexiones", series: 3, reps: "12-15", peso: "0" },
    { nombre: "Press con mancuernas en suelo", series: 3, reps: "10-12", peso: "10" }
  ],
  espalda: [
    { nombre: "Remo con mancuerna", series: 3, reps: "10-12", peso: "10" },
    { nombre: "Superman", series: 3, reps: "15", peso: "0" }
  ],
  abdomen: [
    { nombre: "Plancha", series: 3, reps: "30-45 seg", peso: "0" },
    { nombre: "Russian twist con mancuerna", series: 3, reps: "20", peso: "5" }
  ],
  superiores: [
    { nombre: "Curl bíceps con mancuerna", series: 3, reps: "10-12", peso: "8" },
    { nombre: "Fondos en silla", series: 3, reps: "12", peso: "0" }
  ],
  inferiores: [
    { nombre: "Sentadillas", series: 3, reps: "15", peso: "0" },
    { nombre: "Peso muerto con mancuernas", series: 3, reps: "10-12", peso: "15" }
  ],
  cardio: [
    { nombre: "Saltar cuerda", series: 3, reps: "1 min", peso: "0" },
    { nombre: "Jumping jacks", series: 3, reps: "30", peso: "0" }
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
    if(confirm("¿Seguro que quieres borrar la rutina?")) {
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
      hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      ejercicios: ejerciciosLogrados
    };

    setHistorial([nuevaSesion, ...historial]);
    setModoEntreno(false);
    setCompletados([]);
    alert("¡Entrenamiento guardado con éxito! 🏆");
  };

  function generarRutina() {
    let nuevaRutina = {};
    const todasCategorias = Object.values(BASE_EJERCICIOS).flat();
    diasSeleccionados.forEach((dia) => {
      let ejerciciosDia = Object.values(BASE_EJERCICIOS).map(cat => ({
        ...cat[Math.floor(Math.random() * cat.length)],
        id: crypto.randomUUID(),
        peso: "0" // Peso inicial por defecto
      }));
      while (ejerciciosDia.length < 8) {
        let candidato = todasCategorias[Math.floor(Math.random() * todasCategorias.length)];
        if (!ejerciciosDia.some(e => e.nombre === candidato.nombre)) {
          ejerciciosDia.push({ ...candidato, id: crypto.randomUUID(), peso: "0" });
        }
      }
      nuevaRutina[dia] = ejerciciosDia;
    });
    setRutina(nuevaRutina);
    setPantalla("mostrarRutina");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#00008A] to-black text-white flex flex-col items-center p-6 font-sans">
      <h1 className="text-5xl font-extrabold mb-8 drop-shadow-2xl tracking-tight italic">MancuFit</h1>

      {verCuerpo ? (
        <div className="flex flex-col items-center">
          <CuerpoHumano />
          <button onClick={() => setVerCuerpo(false)} className="mt-6 bg-gray-700 px-6 py-2 rounded-full">Volver</button>
        </div>
      ) : (
        <>
          {pantalla === "menu" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md">
              <button className="bg-white/10 border border-white/20 rounded-2xl p-6 hover:bg-blue-600 transition text-center" onClick={() => (rutina ? setPantalla("checkRutina") : setPantalla("seleccionDias"))}>
                <span className="block text-2xl mb-1">📋</span> Rutina Actual
              </button>
              <button className="bg-white/10 border border-white/20 rounded-2xl p-6 hover:bg-blue-600 transition text-center" onClick={() => setVerCuerpo(true)}>
                <span className="block text-2xl mb-1">👤</span> Anatomía
              </button>
              <button className="bg-white/10 border border-white/20 rounded-2xl p-6 hover:bg-orange-600 transition col-span-1 sm:col-span-2 text-center" onClick={() => setPantalla("historial")}>
                <span className="block text-2xl mb-1">📈</span> Historial ({historial.length})
              </button>
            </div>
          )}

          {pantalla === "historial" && (
            <div className="w-full max-w-md space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Historial 📈</h2>
                <button onClick={() => setPantalla("menu")} className="text-sm text-gray-400 underline">Cerrar</button>
              </div>
              {historial.length === 0 ? (
                <p className="text-center text-gray-500 py-10 italic">No hay registros todavía.</p>
              ) : (
                historial.map(sesion => (
                  <div key={sesion.id} className="bg-white/5 border border-white/10 p-4 rounded-2xl">
                    <div className="flex justify-between text-blue-400 font-bold mb-2 text-sm">
                      <span>{sesion.fecha}</span>
                      <span>{sesion.hora}</span>
                    </div>
                    <ul className="text-sm space-y-1 text-gray-300">
                      {sesion.ejercicios.map((ej, i) => (
                        <li key={i}>
                          <span className="text-green-400">✓</span> {ej.nombre} 
                          <span className="text-gray-500 text-xs ml-2">({ej.series} ser. x {ej.reps} rep. | {ej.peso}kg)</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))
              )}
            </div>
          )}

          {pantalla === "seleccionDias" && (
            <div className="bg-black/50 backdrop-blur-md p-8 rounded-3xl w-full max-w-md border border-white/10">
              <h2 className="text-2xl font-bold mb-6 text-center">Configurar Plan</h2>
              <div className="grid grid-cols-2 gap-3 mb-8">
                {DIAS_SEMANA.map((dia) => (
                  <button key={dia} onClick={() => toggleDia(dia)} className={`py-3 rounded-xl font-medium transition-all ${diasSeleccionados.includes(dia) ? "bg-blue-600 shadow-lg scale-105" : "bg-gray-800/50"}`}>{dia}</button>
                ))}
              </div>
              <button disabled={diasSeleccionados.length === 0} className="w-full py-4 rounded-xl font-bold bg-blue-500" onClick={generarRutina}>Generar Rutina</button>
            </div>
          )}

          {pantalla === "checkRutina" && (
            <div className="bg-black/50 backdrop-blur-md p-8 rounded-3xl text-center border border-white/10">
              <p className="text-xl mb-6">¿Qué quieres hacer? 💪</p>
              <div className="flex flex-col gap-3">
                <button className="bg-green-600 py-4 rounded-xl font-bold" onClick={() => setPantalla("mostrarRutina")}>Continuar Rutina Guardada</button>
                <button className="bg-red-600/50 py-3 rounded-xl text-sm" onClick={crearNuevaRutina}>Empezar Nueva (Borra la actual)</button>
              </div>
            </div>
          )}

          {pantalla === "mostrarRutina" && rutina && (
            <div className="w-full max-w-4xl space-y-6 pb-10">
              <div className="flex flex-col gap-4 sticky top-0 bg-[#00008A]/90 backdrop-blur-lg p-4 rounded-2xl z-20 border border-white/10 shadow-xl">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold italic underline decoration-blue-500">ENTRENAMIENTO</h2>
                  <button onClick={() => setPantalla("menu")} className="text-gray-400 text-sm">Menú</button>
                </div>
                <button 
                  onClick={modoEntreno ? finalizarEntrenamiento : () => setModoEntreno(true)}
                  className={`w-full py-4 rounded-xl font-black uppercase transition-all shadow-lg ${modoEntreno ? "bg-red-500" : "bg-green-600"}`}
                >
                  {modoEntreno ? "🏁 Finalizar Sesión" : "▶ Empezar Entrenamiento"}
                </button>
              </div>
              
              <div className="grid gap-6 md:grid-cols-2">
                {Object.entries(rutina).map(([dia, ejercicios]) => (
                  <div key={dia} className="bg-white/5 border border-white/10 p-5 rounded-3xl">
                    <h3 className="font-black text-blue-400 text-xl mb-4 italic uppercase border-b border-white/10 pb-2">{dia}</h3>
                    <div className="space-y-5">
                      {ejercicios.map((ej, index) => {
                        const esCompletado = completados.includes(ej.id);
                        return (
                          <div key={ej.id} className={`flex flex-col gap-3 p-4 rounded-2xl transition-all border ${esCompletado ? "bg-green-500/10 border-green-500/40 opacity-50" : "bg-black/30 border-white/5 shadow-inner"}`}>
                            <div className="flex justify-between items-start gap-2">
                              <input 
                                disabled={modoEntreno} 
                                className={`bg-transparent border-none font-bold text-white w-full text-lg outline-none ${esCompletado ? "line-through text-gray-500" : ""}`} 
                                value={ej.nombre} 
                                onChange={(e) => actualizarEjercicio(dia, index, 'nombre', e.target.value)} 
                              />
                              {modoEntreno && (
                                <button onClick={() => toggleCompletado(ej.id)} className={`min-w-[44px] h-11 rounded-full flex items-center justify-center transition-transform active:scale-90 ${esCompletado ? "bg-green-500 text-black" : "bg-white/10 border border-white/20"}`}>{esCompletado ? "✓" : "○"}</button>
                              )}
                            </div>
                            
                            <div className="grid grid-cols-3 gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                              <div className="flex flex-col gap-1">
                                <span>Series</span>
                                <input disabled={modoEntreno} className="bg-gray-800 text-white w-full text-center rounded-lg py-2 text-sm border border-white/10" value={ej.series} onChange={(e) => actualizarEjercicio(dia, index, 'series', e.target.value)} />
                              </div>
                              <div className="flex flex-col gap-1">
                                <span>Reps</span>
                                <input disabled={modoEntreno} className="bg-gray-800 text-white w-full text-center rounded-lg py-2 text-sm border border-white/10" value={ej.reps} onChange={(e) => actualizarEjercicio(dia, index, 'reps', e.target.value)} />
                              </div>
                              <div className="flex flex-col gap-1">
                                <span className="text-blue-400">Peso (kg)</span>
                                <input disabled={modoEntreno} className="bg-blue-900/40 text-blue-200 w-full text-center rounded-lg py-2 text-sm border border-blue-500/30" value={ej.peso} onChange={(e) => actualizarEjercicio(dia, index, 'peso', e.target.value)} />
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