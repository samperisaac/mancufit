import React, { useState, useEffect } from "react";
import CuerpoHumano from "./CuerpoHumano";

const BASE_EJERCICIOS = {
  pecho: [
    { nombre: "Flexiones", series: 3, reps: "12-15" },
    { nombre: "Press con mancuernas en suelo", series: 3, reps: "10-12" }
  ],
  espalda: [
    { nombre: "Remo con mancuerna", series: 3, reps: "10-12" },
    { nombre: "Superman", series: 3, reps: "15" }
  ],
  abdomen: [
    { nombre: "Plancha", series: 3, reps: "30-45 seg" },
    { nombre: "Russian twist con mancuerna", series: 3, reps: "20" }
  ],
  superiores: [
    { nombre: "Curl bíceps con mancuerna", series: 3, reps: "10-12" },
    { nombre: "Fondos en silla", series: 3, reps: "12" }
  ],
  inferiores: [
    { nombre: "Sentadillas", series: 3, reps: "15" },
    { nombre: "Peso muerto con mancuernas", series: 3, reps: "10-12" }
  ],
  cardio: [
    { nombre: "Saltar cuerda", series: 3, reps: "1 min" },
    { nombre: "Jumping jacks", series: 3, reps: "30" }
  ]
};

const DIAS_SEMANA = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

export default function App() {
  const [pantalla, setPantalla] = useState("menu");
  const [rutina, setRutina] = useState(null);
  const [diasSeleccionados, setDiasSeleccionados] = useState([]);
  const [verCuerpo, setVerCuerpo] = useState(false);

  // FASE 5 & 6: Estados de entrenamiento e historial
  const [modoEntreno, setModoEntreno] = useState(false);
  const [completados, setCompletados] = useState([]);
  const [historial, setHistorial] = useState([]);

  // Carga inicial (Unificada para evitar conflictos)
  useEffect(() => {
    const rutinaG = localStorage.getItem("rutinaMancuFit");
    const historialG = localStorage.getItem("historialMancuFit");
    
    if (rutinaG) setRutina(JSON.parse(rutinaG));
    if (historialG) setHistorial(JSON.parse(historialG));
  }, []);

  // Guardado automático
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
    if(confirm("¿Seguro que quieres borrar la rutina? El historial se mantendrá.")) {
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

  // FASE 6: Finalizar y Guardar en Historial
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
    alert("¡Entrenamiento guardado! Revisa tu historial. 🏆");
  };

  function generarRutina() {
    let nuevaRutina = {};
    const todasCategorias = Object.values(BASE_EJERCICIOS).flat();

    diasSeleccionados.forEach((dia) => {
      let ejerciciosDia = Object.values(BASE_EJERCICIOS).map(cat => ({
        ...cat[Math.floor(Math.random() * cat.length)],
        id: crypto.randomUUID() 
      }));

      while (ejerciciosDia.length < 8) {
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
    <div className="min-h-screen bg-gradient-to-br from-[#00008A] to-black text-white flex flex-col items-center p-6 font-sans">
      <h1 className="text-5xl font-extrabold mb-8 drop-shadow-2xl tracking-tight italic">MancuFit</h1>

      {verCuerpo ? (
        <div className="flex flex-col items-center">
          <CuerpoHumano />
          <button onClick={() => setVerCuerpo(false)} className="mt-6 bg-gray-700 px-6 py-2 rounded-full">Volver</button>
        </div>
      ) : (
        <>
          {/* MENU PRINCIPAL */}
          {pantalla === "menu" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md">
              <button className="bg-white/10 border border-white/20 rounded-2xl p-6 hover:bg-blue-600 transition" onClick={() => (rutina ? setPantalla("checkRutina") : setPantalla("seleccionDias"))}>
                <span className="block text-2xl mb-1">📋</span> Registro Rutina
              </button>
              <button className="bg-white/10 border border-white/20 rounded-2xl p-6 hover:bg-blue-600 transition" onClick={() => setVerCuerpo(true)}>
                <span className="block text-2xl mb-1">👤</span> Cuerpo Humano
              </button>
              <button className="bg-white/10 border border-white/20 rounded-2xl p-6 hover:bg-orange-600 transition col-span-1 sm:col-span-2" onClick={() => setPantalla("historial")}>
                <span className="block text-2xl mb-1">📈</span> Ver Historial ({historial.length})
              </button>
            </div>
          )}

          {/* VISTA HISTORIAL */}
          {pantalla === "historial" && (
            <div className="w-full max-w-md space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Historial 📈</h2>
                <button onClick={() => setPantalla("menu")} className="text-sm text-gray-400">Volver</button>
              </div>
              {historial.length === 0 ? (
                <p className="text-center text-gray-500 py-10">Aún no has guardado entrenamientos.</p>
              ) : (
                historial.map(sesion => (
                  <div key={sesion.id} className="bg-white/5 border border-white/10 p-4 rounded-2xl">
                    <div className="flex justify-between text-blue-400 font-bold mb-2">
                      <span>{sesion.fecha}</span>
                      <span>{sesion.hora}</span>
                    </div>
                    <ul className="text-sm space-y-1 text-gray-300">
                      {sesion.ejercicios.map((ej, i) => (
                        <li key={i}>✓ {ej.nombre} ({ej.series}x{ej.reps})</li>
                      ))}
                    </ul>
                  </div>
                ))
              )}
              <button onClick={() => {if(confirm("¿Borrar historial?")) setHistorial([])}} className="w-full text-xs text-red-500/50 pt-4">Borrar todo el historial</button>
            </div>
          )}

          {/* ... (Resto de pantallas: seleccionDias, checkRutina se mantienen igual) ... */}
          {pantalla === "checkRutina" && (
            <div className="bg-black/50 backdrop-blur-md p-8 rounded-3xl text-center border border-white/10">
              <p className="text-xl mb-6 font-light">Ya tienes una rutina guardada 💪</p>
              <div className="flex gap-4">
                <button className="bg-green-600 px-6 py-3 rounded-xl font-bold" onClick={() => setPantalla("mostrarRutina")}>Continuar</button>
                <button className="bg-red-600/80 px-6 py-3 rounded-xl font-bold" onClick={crearNuevaRutina}>Reiniciar</button>
              </div>
            </div>
          )}

          {pantalla === "seleccionDias" && (
            <div className="bg-black/50 backdrop-blur-md p-8 rounded-3xl w-full max-w-md border border-white/10">
              <h2 className="text-2xl font-bold mb-6 text-center">¿Qué días entrenas?</h2>
              <div className="grid grid-cols-2 gap-3 mb-8">
                {DIAS_SEMANA.map((dia) => (
                  <button key={dia} onClick={() => toggleDia(dia)} className={`py-3 rounded-xl font-medium transition-all ${diasSeleccionados.includes(dia) ? "bg-blue-600 scale-105" : "bg-gray-800/50"}`}>{dia}</button>
                ))}
              </div>
              <button disabled={diasSeleccionados.length === 0} className="w-full py-4 rounded-xl font-bold bg-blue-500" onClick={generarRutina}>Generar mi rutina</button>
            </div>
          )}

          {/* MOSTRAR RUTINA CON FASE 5 & 6 */}
          {pantalla === "mostrarRutina" && rutina && (
            <div className="w-full max-w-4xl space-y-6">
              <div className="flex flex-col gap-4 sticky top-0 bg-[#00008A]/90 backdrop-blur-lg p-4 rounded-2xl z-10 border border-white/10 shadow-xl">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">MI PLAN</h2>
                  <button onClick={() => setPantalla("menu")} className="text-gray-400 text-sm">Cerrar</button>
                </div>
                <button 
                  onClick={modoEntreno ? finalizarEntrenamiento : () => setModoEntreno(true)}
                  className={`w-full py-4 rounded-xl font-black uppercase tracking-tighter transition-all ${modoEntreno ? "bg-red-500 animate-pulse" : "bg-green-500 shadow-[0_0_20px_rgba(34,197,94,0.4)]"}`}
                >
                  {modoEntreno ? "🏁 Finalizar y Guardar" : "▶ Empezar Entreno"}
                </button>
              </div>
              
              <div className="grid gap-6 md:grid-cols-2">
                {Object.entries(rutina).map(([dia, ejercicios]) => (
                  <div key={dia} className="bg-white/5 border border-white/10 p-5 rounded-3xl">
                    <h3 className="font-black text-blue-400 text-xl mb-4 italic uppercase border-b border-white/10 pb-2">{dia}</h3>
                    <div className="space-y-4">
                      {ejercicios.map((ej, index) => {
                        const esCompletado = completados.includes(ej.id);
                        return (
                          <div key={ej.id} className={`flex flex-col gap-2 p-3 rounded-2xl transition-all border ${esCompletado ? "bg-green-500/20 border-green-500/50 opacity-50" : "bg-black/20 border-white/5"}`}>
                            <div className="flex justify-between items-center gap-2">
                              <input disabled={modoEntreno} className={`bg-transparent border-none font-bold text-white w-full ${esCompletado ? "line-through text-gray-500" : ""}`} value={ej.nombre} onChange={(e) => actualizarEjercicio(dia, index, 'nombre', e.target.value)} />
                              {modoEntreno && (
                                <button onClick={() => toggleCompletado(ej.id)} className={`min-w-[40px] h-10 rounded-full flex items-center justify-center ${esCompletado ? "bg-green-500 text-black" : "bg-white/10"}`}>{esCompletado ? "✓" : "○"}</button>
                              )}
                            </div>
                            <div className="flex gap-4 text-xs font-mono text-gray-400">
                              <span>S: <input disabled={modoEntreno} className="bg-gray-900 w-8 text-center rounded" value={ej.series} onChange={(e) => actualizarEjercicio(dia, index, 'series', e.target.value)} /></span>
                              <span>R: <input disabled={modoEntreno} className="bg-gray-900 w-16 text-center rounded" value={ej.reps} onChange={(e) => actualizarEjercicio(dia, index, 'reps', e.target.value)} /></span>
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