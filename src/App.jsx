import React, { useState, useEffect } from "react";
import CuerpoHumano from "./CuerpoHumano";

const BASE_EJERCICIOS = {
  pecho: [
    { nombre: "Flexiones (Suelo)", series: 3, reps: "12-15", peso: "0" },
    { nombre: "Press con mancuernas", series: 3, reps: "10-12", peso: "10" },
    { nombre: "Aperturas con mancuernas", series: 3, reps: "12", peso: "8" }
  ],
  espalda: [
    { nombre: "Remo con mancuerna", series: 3, reps: "10-12", peso: "12" },
    { nombre: "Remo inclinado", series: 3, reps: "12", peso: "10" },
    { nombre: "Pullover con mancuerna", series: 3, reps: "15", peso: "8" }
  ],
  abdomen: [
    { nombre: "Plancha abdominal", series: 3, reps: "45 seg", peso: "0" },
    { nombre: "Russian Twist", series: 3, reps: "20", peso: "5" },
    { nombre: "Elevación de piernas", series: 3, reps: "15", peso: "0" }
  ],
  brazos: [
    { nombre: "Curl de bíceps", series: 3, reps: "12", peso: "8" },
    { nombre: "Press francés", series: 3, reps: "10", peso: "6" },
    { nombre: "Fondos en silla", series: 3, reps: "12", peso: "0" }
  ],
  piernas: [
    { nombre: "Sentadillas", series: 3, reps: "15", peso: "15" },
    { nombre: "Zancadas", series: 3, reps: "12", peso: "10" },
    { nombre: "Puente de glúteo", series: 3, reps: "15", peso: "10" }
  ],
  gemelos: [
    { nombre: "Elevación talones de pie", series: 4, reps: "20", peso: "10" },
    { nombre: "Elevación talón a una pierna", series: 3, reps: "15", peso: "0" }
  ]
};

const DIAS_SEMANA = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

export default function App() {
  const [pantalla, setPantalla] = useState("menu");
  const [rutina, setRutina] = useState(null);
  const [diasSeleccionados, setDiasSeleccionados] = useState([]);
  const [musculoSeleccionado, setMusculoSeleccionado] = useState(null);
  const [modoEntreno, setModoEntreno] = useState(false);
  const [completados, setCompletados] = useState([]);
  const [historial, setHistorial] = useState([]);

  // Cargar datos al iniciar
  useEffect(() => {
    const rutinaG = localStorage.getItem("rutinaMancuFit");
    const historialG = localStorage.getItem("historialMancuFit");
    if (rutinaG) setRutina(JSON.parse(rutinaG));
    if (historialG) setHistorial(JSON.parse(historialG));
  }, []);

  // Guardar datos al cambiar
  useEffect(() => {
    if (rutina) localStorage.setItem("rutinaMancuFit", JSON.stringify(rutina));
    localStorage.setItem("historialMancuFit", JSON.stringify(historial));
  }, [rutina, historial]);

  const toggleDia = (dia) => {
    setDiasSeleccionados(prev => prev.includes(dia) ? prev.filter(d => d !== dia) : [...prev, dia]);
  };

  const actualizarEjercicio = (dia, index, campo, nuevoValor) => {
    setRutina(prev => ({
      ...prev,
      [dia]: prev[dia].map((ej, i) => i === index ? { ...ej, [campo]: nuevoValor } : ej)
    }));
  };

  const finalizarEntrenamiento = () => {
    const logrados = [];
    Object.values(rutina).forEach(lista => logrados.push(...lista.filter(ej => completados.includes(ej.id))));
    if (logrados.length > 0) {
      setHistorial([{ id: crypto.randomUUID(), fecha: new Date().toLocaleDateString('es-ES'), ejercicios: logrados }, ...historial]);
    }
    setModoEntreno(false);
    setCompletados([]);
    setPantalla("menu");
  };

  function generarRutina() {
    let nueva = {};
    diasSeleccionados.forEach(dia => {
      let ejs = Object.values(BASE_EJERCICIOS).map(cat => ({ ...cat[Math.floor(Math.random() * cat.length)], id: crypto.randomUUID() }));
      nueva[dia] = ejs;
    });
    setRutina(nueva);
    setPantalla("mostrarRutina");
  }

  return (
    <div className="min-h-screen bg-[#0d0d12] text-slate-100 flex flex-col items-center p-4 font-sans selection:bg-blue-500/30">
      
      {/* HEADER TIPO LOGO */}
      <header className="w-full max-w-md flex flex-col items-center my-10">
        <h1 className="text-5xl font-black italic tracking-tighter uppercase text-white drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]">
          Mancu<span className="text-blue-500">Fit</span>
        </h1>
        <div className="h-1 w-32 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full mt-2 shadow-[0_0_15px_#3b82f6]"></div>
      </header>

      <main className="w-full max-w-md space-y-6">
        
        {/* === PANTALLA: MENÚ PRINCIPAL === */}
        {pantalla === "menu" && (
          <div className="flex flex-col gap-6 w-full px-2">
            
            {/* Botón Mi Rutina */}
            <button onClick={() => rutina ? setPantalla("mostrarRutina") : setPantalla("seleccionDias")} 
              className="relative overflow-hidden w-full h-28 rounded-[3rem] border-2 border-white shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(59,130,246,0.5)] hover:border-blue-400 transition-all flex items-center justify-center group bg-[#13131a]">
              <span className="relative z-10 text-2xl font-black italic text-white tracking-widest uppercase">
                Mi Rutin<span className="text-blue-400">a</span>
              </span>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-6xl font-black italic text-white/5 uppercase tracking-tighter group-hover:scale-110 transition-transform duration-500">Plan</span>
              </div>
            </button>

            {/* Botón Anatomía */}
            <button onClick={() => setPantalla("anatomia")} 
              className="relative overflow-hidden w-full h-28 rounded-[3rem] border-2 border-white shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.4)] transition-all flex items-center justify-center group bg-[#13131a]">
              <span className="relative z-10 text-2xl font-black italic text-white tracking-widest uppercase">
                Anatomí<span className="text-slate-300">a</span>
              </span>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-6xl font-black italic text-white/5 uppercase tracking-tighter group-hover:scale-110 transition-transform duration-500">Body</span>
              </div>
            </button>

            {/* Botón Progreso */}
            <button onClick={() => setPantalla("historial")} 
              className="relative overflow-hidden w-full h-28 rounded-[3rem] border-2 border-orange-400/80 shadow-[0_0_15px_rgba(249,115,22,0.2)] hover:shadow-[0_0_25px_rgba(249,115,22,0.6)] hover:border-orange-400 transition-all flex items-center justify-center group bg-[#13131a]">
              <span className="relative z-10 text-2xl font-black italic text-orange-400 tracking-widest uppercase group-hover:text-orange-300">
                Progres<span className="text-orange-200">o</span>
              </span>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-6xl font-black italic text-orange-500/5 uppercase tracking-tighter group-hover:scale-110 transition-transform duration-500">Stats</span>
              </div>
            </button>

          </div>
        )}

        {/* === PANTALLA: ANATOMÍA === */}
        {pantalla === "anatomia" && (
          <div className="animate-in fade-in zoom-in duration-300">
            <div className="flex justify-between items-center mb-6 px-2">
              <h2 className="text-2xl font-black italic text-blue-400 uppercase tracking-tight">Anatomía</h2>
              <button onClick={() => {setPantalla("menu"); setMusculoSeleccionado(null)}} className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full text-xs uppercase font-bold transition-all">✕ Cerrar</button>
            </div>
            
            {!musculoSeleccionado ? (
              <CuerpoHumano alSeleccionarMusculo={setMusculoSeleccionado} />
            ) : (
              <div className="space-y-4">
                <button onClick={() => setMusculoSeleccionado(null)} className="text-blue-400 font-bold flex items-center gap-2 text-sm mb-4 bg-blue-500/10 px-4 py-2 rounded-full hover:bg-blue-500/20 transition-all">
                  ← Volver al cuerpo
                </button>
                <div className="bg-[#13131a] border border-white/10 p-6 rounded-[2rem] shadow-2xl">
                  <h3 className="text-3xl font-black text-blue-500 mb-6 italic uppercase tracking-tighter">{musculoSeleccionado}</h3>
                  {BASE_EJERCICIOS[musculoSeleccionado]?.map((ej, i) => (
                    <div key={i} className="bg-gradient-to-r from-white/5 to-transparent border-l-4 border-blue-500 p-4 rounded-r-2xl mb-3 hover:bg-white/5 transition-all">
                      <p className="font-bold text-lg text-white">{ej.nombre}</p>
                      <p className="text-[10px] text-blue-400 font-black uppercase tracking-widest mt-1">
                        {ej.series} Series • {ej.reps} Reps • {ej.peso} kg
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* === PANTALLA: SELECCIÓN DE DÍAS === */}
        {pantalla === "seleccionDias" && (
          <div className="bg-[#13131a] border border-white/10 p-8 rounded-[2.5rem] shadow-2xl relative animate-in slide-in-from-bottom-4 duration-300">
            <button onClick={() => setPantalla("menu")} className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors uppercase text-[10px] font-black tracking-widest bg-white/5 px-3 py-1 rounded-full">✕ Volver</button>
            <h2 className="text-2xl font-black italic mb-8 uppercase text-blue-400">Días de Entreno</h2>
            
            <div className="grid grid-cols-2 gap-3 mb-8">
              {DIAS_SEMANA.map(dia => (
                <button key={dia} onClick={() => toggleDia(dia)} 
                  className={`py-4 rounded-2xl font-black transition-all border ${diasSeleccionados.includes(dia) ? "bg-blue-600 border-blue-400 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)] scale-105" : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10"}`}>
                  {dia}
                </button>
              ))}
            </div>
            
            <button onClick={generarRutina} disabled={diasSeleccionados.length === 0} 
              className="w-full py-5 rounded-[2rem] bg-blue-500 text-white font-black uppercase italic tracking-tighter shadow-[0_0_20px_rgba(59,130,246,0.5)] hover:bg-blue-400 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-20 disabled:shadow-none">
              Crear Rutina
            </button>
          </div>
        )}

        {/* === PANTALLA: MOSTRAR RUTINA === */}
        {pantalla === "mostrarRutina" && rutina && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="sticky top-4 z-50 bg-[#13131a]/90 backdrop-blur-xl border border-white/10 p-4 rounded-[2rem] shadow-2xl">
              <div className="flex justify-between items-center mb-4 px-2">
                <h2 className="font-black italic text-blue-400 uppercase tracking-tighter text-xl">Tu Plan Semanal</h2>
                <button onClick={() => setPantalla("menu")} className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full text-[10px] uppercase font-bold transition-all">Menú</button>
              </div>
              <button onClick={modoEntreno ? finalizarEntrenamiento : () => setModoEntreno(true)}
                className={`w-full py-4 rounded-[1.5rem] font-black transition-all uppercase italic tracking-wider text-white ${modoEntreno ? "bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.4)]" : "bg-green-500 shadow-[0_0_20px_rgba(34,197,94,0.4)]"}`}>
                {modoEntreno ? "Terminar y Guardar" : "▶ Empezar Sesión"}
              </button>
            </div>

            {Object.entries(rutina).map(([dia, ejercicios]) => (
              <div key={dia} className="bg-[#13131a] border border-white/10 p-6 rounded-[2.5rem] shadow-xl">
                <h3 className="text-2xl font-black text-white mb-6 italic border-b border-white/10 pb-3 uppercase tracking-tighter">
                  <span className="text-blue-500 mr-2">/</span>{dia}
                </h3>
                
                <div className="space-y-4">
                  {ejercicios.map((ej, index) => {
                    const done = completados.includes(ej.id);
                    return (
                      <div key={ej.id} className={`p-5 rounded-[2rem] border transition-all duration-300 ${done ? "bg-green-500/10 border-green-500/30 opacity-60 scale-[0.98]" : "bg-[#0d0d12] border-white/10 shadow-inner"}`}>
                        <div className="flex justify-between items-center mb-4">
                          <input disabled={modoEntreno} className={`bg-transparent border-none font-bold text-lg w-full outline-none transition-colors ${done ? "text-green-400" : "text-white focus:text-blue-400"}`} value={ej.nombre} onChange={(e) => actualizarEjercicio(dia, index, 'nombre', e.target.value)} />
                          
                          {modoEntreno && (
                            <button onClick={() => setCompletados(p => p.includes(ej.id) ? p.filter(id => id !== ej.id) : [...p, ej.id])} 
                              className={`ml-4 min-w-[50px] h-[50px] rounded-[1.2rem] flex items-center justify-center border-2 transition-all duration-300 ${done ? "bg-green-500 border-green-400 text-black scale-110 shadow-[0_0_15px_rgba(34,197,94,0.5)]" : "bg-white/5 border-white/20 text-white hover:bg-white/10"}`}>
                              {done ? "✓" : ""}
                            </button>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-3 gap-3">
                          <div className="bg-white/5 p-2 rounded-2xl border border-white/5">
                            <p className="text-[9px] text-slate-400 font-black uppercase text-center mb-1 tracking-wider">Series</p>
                            <input disabled={modoEntreno} className="bg-transparent w-full text-center font-bold text-white text-sm outline-none" value={ej.series} onChange={(e) => actualizarEjercicio(dia, index, 'series', e.target.value)} />
                          </div>
                          <div className="bg-white/5 p-2 rounded-2xl border border-white/5">
                            <p className="text-[9px] text-slate-400 font-black uppercase text-center mb-1 tracking-wider">Reps</p>
                            <input disabled={modoEntreno} className="bg-transparent w-full text-center font-bold text-white text-sm outline-none" value={ej.reps} onChange={(e) => actualizarEjercicio(dia, index, 'reps', e.target.value)} />
                          </div>
                          <div className="bg-blue-500/10 p-2 rounded-2xl border border-blue-500/20">
                            <p className="text-[9px] text-blue-400 font-black uppercase text-center mb-1 tracking-wider">Peso KG</p>
                            <input disabled={modoEntreno} className="bg-transparent w-full text-center font-bold text-blue-300 text-sm outline-none" value={ej.peso} onChange={(e) => actualizarEjercicio(dia, index, 'peso', e.target.value)} />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* === PANTALLA: HISTORIAL === */}
        {pantalla === "historial" && (
          <div className="bg-[#13131a] border border-orange-500/20 p-8 rounded-[2.5rem] shadow-2xl relative animate-in fade-in">
             <button onClick={() => setPantalla("menu")} className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors uppercase text-[10px] font-black tracking-widest bg-white/5 px-3 py-1 rounded-full">✕ Volver</button>
             <h2 className="text-2xl font-black italic mb-6 uppercase text-orange-400">Progreso</h2>
             
             {historial.length === 0 ? (
               <p className="text-slate-500 text-center italic mt-10">Aún no hay entrenamientos guardados. ¡Empieza hoy!</p>
             ) : (
               <div className="space-y-4">
                 {historial.map(sesion => (
                   <div key={sesion.id} className="bg-black/40 border border-white/5 p-4 rounded-2xl">
                     <p className="text-orange-400 font-bold mb-2">{sesion.fecha}</p>
                     <p className="text-sm text-slate-300">{sesion.ejercicios.length} ejercicios completados</p>
                   </div>
                 ))}
               </div>
             )}
          </div>
        )}

      </main>
    </div>
  );
}