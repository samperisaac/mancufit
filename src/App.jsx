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

  // 1. CARGA INICIAL: Solo una vez al montar el componente
  useEffect(() => {
    const rutinaGuardada = localStorage.getItem("rutinaMancuFit");
    if (rutinaGuardada) {
      setRutina(JSON.parse(rutinaGuardada));
    }
  }, []);

  // 2. GUARDADO AUTOMÁTICO: Cada vez que la rutina cambie
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
    localStorage.removeItem("rutinaMancuFit");
    setRutina(null);
    setDiasSeleccionados([]);
    setPantalla("seleccionDias");
  };

  // FASE 4: Función de edición específica para objeto por días
  const actualizarEjercicio = (dia, index, campo, nuevoValor) => {
    setRutina(prevRutina => ({
      ...prevRutina,
      [dia]: prevRutina[dia].map((ej, i) => 
        i === index ? { ...ej, [campo]: nuevoValor } : ej
      )
    }));
  };

  function generarRutina() {
    let nuevaRutina = {};
    const todasCategorias = Object.values(BASE_EJERCICIOS).flat();

    diasSeleccionados.forEach((dia) => {
      let ejerciciosDia = Object.values(BASE_EJERCICIOS).map(cat => ({
        ...cat[Math.floor(Math.random() * cat.length)],
        id: crypto.randomUUID() // Añadimos ID único por si acaso
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
            <div className="w-full max-w-3xl space-y-6">
              <div className="flex justify-between items-center px-2">
                <h2 className="text-2xl font-bold">Tu Plan Semanal 💪</h2>
                <button onClick={() => setPantalla("menu")} className="text-sm text-gray-400 hover:text-white">Cerrar</button>
              </div>
              
              <div className="grid gap-6 md:grid-cols-2">
                {Object.entries(rutina).map(([dia, ejercicios]) => (
                  <div key={dia} className="bg-white/5 border border-white/10 p-5 rounded-2xl">
                    <h3 className="font-bold text-blue-400 text-lg mb-4 border-b border-white/10 pb-1">{dia}</h3>
                    <div className="space-y-4">
                      {ejercicios.map((ej, index) => (
                        <div key={index} className="flex flex-col gap-2 p-2 rounded-lg hover:bg-white/5 transition">
                          <input
                            className="bg-transparent border-none font-medium text-white focus:ring-1 focus:ring-blue-500 rounded px-1 w-full"
                            value={ej.nombre}
                            onChange={(e) => actualizarEjercicio(dia, index, 'nombre', e.target.value)}
                          />
                          <div className="flex gap-4 text-sm text-gray-400">
                            <div className="flex items-center gap-1">
                              <span>S:</span>
                              <input
                                className="bg-gray-800 w-10 text-center rounded border-none p-1 focus:ring-1 focus:ring-blue-500"
                                value={ej.series}
                                onChange={(e) => actualizarEjercicio(dia, index, 'series', e.target.value)}
                              />
                            </div>
                            <div className="flex items-center gap-1">
                              <span>R:</span>
                              <input
                                className="bg-gray-800 w-20 text-center rounded border-none p-1 focus:ring-1 focus:ring-blue-500"
                                value={ej.reps}
                                onChange={(e) => actualizarEjercicio(dia, index, 'reps', e.target.value)}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <button 
                onClick={crearNuevaRutina}
                className="w-full py-3 bg-red-900/20 text-red-400 rounded-xl border border-red-900/30 hover:bg-red-900/40 transition mt-8"
              >
                Borrar rutina y empezar de cero
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}