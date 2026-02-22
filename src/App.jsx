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

  // FASE 5: Estados de entrenamiento
  const [modoEntreno, setModoEntreno] = useState(false);
  const [completados, setCompletados] = useState([]);

  // Carga inicial
  useEffect(() => {
    const rutinaGuardada = localStorage.getItem("rutinaMancuFit");
    if (rutinaGuardada) {
      setRutina(JSON.parse(rutinaGuardada));
    }
  }, []);

  // Guardado automático
  useEffect(() => {
    if (rutina) {
      localStorage.setItem("rutinaMancuFit", JSON.stringify(rutina));
    }
  }, [rutina]);

  const toggleDia = (dia) => {
    setDiasSeleccionados(prev => 
      prev.includes(dia) ? prev.filter(d => d !== dia) : [...prev, dia]
    );
  };

  const entrarRegistro = () => {
    rutina ? setPantalla("checkRutina") : setPantalla("seleccionDias");
  };

  const crearNuevaRutina = () => {
    if(confirm("¿Seguro que quieres borrar todo y empezar de cero?")) {
        localStorage.removeItem("rutinaMancuFit");
        setRutina(null);
        setDiasSeleccionados([]);
        setPantalla("seleccionDias");
        setModoEntreno(false);
    }
  };

  // FASE 4: Editar
  const actualizarEjercicio = (dia, index, campo, nuevoValor) => {
    setRutina(prevRutina => ({
      ...prevRutina,
      [dia]: prevRutina[dia].map((ej, i) => 
        i === index ? { ...ej, [campo]: nuevoValor } : ej
      )
    }));
  };

  // FASE 5: Marcar como hecho
  const toggleCompletado = (id) => {
    setCompletados(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
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
      <h1 className="text-5xl font-extrabold mb-8 drop-shadow-2xl tracking-tight">MancuFit</h1>

      {verCuerpo ? (
        <div className="flex flex-col items-center">
          <CuerpoHumano />
          <button 
            onClick={() => setVerCuerpo(false)}
            className="mt-6 bg-gray-700 px-6 py-2 rounded-full hover:bg-gray-600 transition"
          >
            Volver al Menú
          </button>
        </div>
      ) : (
        <>
          {pantalla === "menu" && (
            <div className="flex flex-col sm:flex-row gap-6">
              <button
                className="bg-gradient-to-b from-gray-700 to-black border border-gray-600 rounded-2xl px-8 py-4 shadow-xl hover:scale-105 transition-transform"
                onClick={entrarRegistro}
              >
                Registro de ejercicios
              </button>
              <button
                className="bg-gradient-to-b from-gray-700 to-black border border-gray-600 rounded-2xl px-8 py-4 shadow-xl hover:scale-105 transition-transform"
                onClick={() => setVerCuerpo(true)}
              >
                Cuerpo humano
              </button>
            </div>
          )}

          {pantalla === "checkRutina" && (
            <div className="bg-black/50 backdrop-blur-md p-8 rounded-3xl text-center border border-white/10">
              <p className="text-xl mb-6 font-light">Ya tienes una rutina guardada 💪</p>
              <div className="flex gap-4">
                <button
                  className="bg-green-600 px-6 py-3 rounded-xl font-bold hover:bg-green-500 transition"
                  onClick={() => setPantalla("mostrarRutina")}
                >
                  Continuar
                </button>
                <button
                  className="bg-red-600/80 px-6 py-3 rounded-xl font-bold hover:bg-red-500 transition"
                  onClick={crearNuevaRutina}
                >
                  Reiniciar
                </button>
              </div>
            </div>
          )}

          {pantalla === "seleccionDias" && (
            <div className="bg-black/50 backdrop-blur-md p-8 rounded-3xl w-full max-w-md border border-white/10">
              <h2 className="text-2xl font-bold mb-6 text-center">¿Qué días entrenas?</h2>
              <div className="grid grid-cols-2 gap-3 mb-8">
                {DIAS_SEMANA.map((dia) => (
                  <button
                    key={dia}
                    onClick={() => toggleDia(dia)}
                    className={`py-3 rounded-xl font-medium transition-all ${
                      diasSeleccionados.includes(dia)
                        ? "bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.5)] scale-105"
                        : "bg-gray-800/50 hover:bg-gray-700"
                    }`}
                  >
                    {dia}
                  </button>
                ))}
              </div>
              <button
                disabled={diasSeleccionados.length === 0}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
                  diasSeleccionados.length === 0
                    ? "bg-gray-600 opacity-50 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-400"
                }`}
                onClick={generarRutina}
              >
                Generar mi rutina
              </button>
            </div>
          )}

          {pantalla === "mostrarRutina" && rutina && (
            <div className="w-full max-w-4xl space-y-6">
              <div className="flex flex-col gap-4 sticky top-0 bg-[#00008A]/80 backdrop-blur-lg p-4 rounded-2xl z-10 border border-white/10">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold italic">TU PLAN SEMANAL</h2>
                  <button onClick={() => setPantalla("menu")} className="text-gray-400 hover:text-white underline text-sm">Menú</button>
                </div>
                
                {/* BOTÓN MODO ENTRENO */}
                <button 
                  onClick={() => {
                    setModoEntreno(!modoEntreno);
                    if (!modoEntreno) setCompletados([]);
                  }}
                  className={`w-full py-3 rounded-xl font-black uppercase tracking-widest transition-all ${
                    modoEntreno 
                      ? "bg-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.4)]" 
                      : "bg-green-500 shadow-[0_0_20px_rgba(34,197,94,0.4)]"
                  }`}
                >
                  {modoEntreno ? "⏹ Detener Entrenamiento" : "▶ Empezar a Entrenar"}
                </button>
              </div>
              
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
                {Object.entries(rutina).map(([dia, ejercicios]) => (
                  <div key={dia} className={`bg-white/5 border border-white/10 p-5 rounded-3xl transition-opacity ${modoEntreno ? "opacity-100" : "opacity-90"}`}>
                    <h3 className="font-black text-blue-400 text-xl mb-4 italic uppercase tracking-wider border-b border-white/10 pb-2">{dia}</h3>
                    <div className="space-y-4">
                      {ejercicios.map((ej, index) => {
                        const esCompletado = completados.includes(ej.id);
                        return (
                          <div key={ej.id || index} className={`flex flex-col gap-2 p-3 rounded-2xl transition-all border ${
                            esCompletado ? "bg-green-500/20 border-green-500/50 opacity-50" : "bg-black/20 border-white/5"
                          }`}>
                            <div className="flex justify-between items-start gap-2">
                              <input
                                disabled={modoEntreno}
                                className={`bg-transparent border-none font-bold text-white focus:ring-2 focus:ring-blue-500 rounded px-1 w-full ${esCompletado ? "line-through text-gray-500" : ""}`}
                                value={ej.nombre}
                                onChange={(e) => actualizarEjercicio(dia, index, 'nombre', e.target.value)}
                              />
                              {modoEntreno && (
                                <button 
                                  onClick={() => toggleCompletado(ej.id)}
                                  className={`min-w-[40px] h-10 rounded-full flex items-center justify-center transition-all ${
                                    esCompletado ? "bg-green-500 text-black scale-90" : "bg-white/10 text-white"
                                  }`}
                                >
                                  {esCompletado ? "✓" : "○"}
                                </button>
                              )}
                            </div>
                            <div className="flex gap-4 text-sm font-mono">
                              <div className="flex items-center gap-2">
                                <span className="text-gray-500">SERIES</span>
                                <input
                                  disabled={modoEntreno}
                                  className="bg-gray-900/50 w-10 text-center rounded border border-white/10 py-1"
                                  value={ej.series}
                                  onChange={(e) => actualizarEjercicio(dia, index, 'series', e.target.value)}
                                />
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-gray-500">REPS</span>
                                <input
                                  disabled={modoEntreno}
                                  className="bg-gray-900/50 w-20 text-center rounded border border-white/10 py-1"
                                  value={ej.reps}
                                  onChange={(e) => actualizarEjercicio(dia, index, 'reps', e.target.value)}
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              <button 
                onClick={crearNuevaRutina}
                className="w-full py-4 text-gray-500 hover:text-red-400 transition-colors text-xs uppercase tracking-widest mt-12"
              >
                Resetear aplicación por completo
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}