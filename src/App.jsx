import React, { useState, useEffect } from 'react';
import CuerpoHumano from './components/CuerpoHumano';
import CronometroDescanso from './components/CronometroDescanso';
import { ejerciciosDB as BASE_EJERCICIOS } from './data/ejercicios';

const DIAS_SEMANA = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

export default function App() {
  const [pantalla, setPantalla] = useState('menu');
  const [rutina, setRutina] = useState(null);
  const [diasSeleccionados, setDiasSeleccionados] = useState([]);
  const [musculoSeleccionado, setMusculoSeleccionado] = useState(null);
  const [ejercicioDetalle, setEjercicioDetalle] = useState(null);
  const [modoEntreno, setModoEntreno] = useState(false);
  const [completados, setCompletados] = useState([]);
  const [historial, setHistorial] = useState([]);

  // --- PERSISTENCIA ---
  useEffect(() => {
    const rutinaG = localStorage.getItem("rutinaMancuFit");
    const historialG = localStorage.getItem("historialMancuFit");
    if (rutinaG) setRutina(JSON.parse(rutinaG));
    if (historialG) setHistorial(JSON.parse(historialG));

    window.history.pushState(null, "", window.location.href);
    const handlePopState = () => window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    if (rutina) localStorage.setItem("rutinaMancuFit", JSON.stringify(rutina));
    else localStorage.removeItem("rutinaMancuFit");
    localStorage.setItem("historialMancuFit", JSON.stringify(historial));
  }, [rutina, historial]);

  // --- FUNCIONES ---
  const toggleDia = (dia) => {
    setDiasSeleccionados(prev => prev.includes(dia) ? prev.filter(d => d !== dia) : [...prev, dia]);
  };

  const generarRutina = () => {
    const nueva = {};
    diasSeleccionados.forEach(dia => { nueva[dia] = []; });
    setRutina(nueva);
    setPantalla("menu");
  };

  const agregarEjercicio = (ej) => {
    if (!rutina) return;
    const diaActivo = Object.keys(rutina)[0]; // Añade al primer día disponible por defecto
    const nueva = { ...rutina };
    nueva[diaActivo].push({ ...ej, id: Date.now(), series: "4", reps: "12", peso: "0" });
    setRutina(nueva);
    setPantalla("mostrarRutina");
  };

  const actualizarEjercicio = (dia, id, campo, valor) => {
    setRutina(prev => ({
      ...prev,
      [dia]: prev[dia].map(ej => ej.id === id ? { ...ej, [campo]: valor } : ej)
    }));
  };

  const abrirDetalle = (ej) => {
    const info = Object.values(BASE_EJERCICIOS).flat().find(e => e.nombre === ej.nombre);
    setEjercicioDetalle(info || ej);
  };

  const finalizarEntrenamiento = () => {
    const logrados = [];
    Object.values(rutina).forEach(lista => logrados.push(...lista.filter(ej => completados.includes(ej.id))));
    if (logrados.length > 0) {
      const nuevoRegistro = {
        id: Date.now(),
        fecha: new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }),
        ejercicios: logrados
      };
      setHistorial([nuevoRegistro, ...historial]);
    }
    setModoEntreno(false);
    setCompletados([]);
    setPantalla("menu");
  };

  return (
    <div className="relative min-h-screen text-slate-100 font-sans overflow-x-hidden bg-black">
      
{/* 1. CAPA DE FONDO (MÁS CLARA) */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img 
          src="/fondo.jpg" 
          className="w-full h-full object-cover opacity-60 transition-opacity duration-700" 
          alt="background" 
        />
        {/* Degradado más suave para que la foto respire mejor */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/60 to-black"></div>
      </div>

      {/* 2. CONTENIDO (Z-10 PARA ESTAR ENCIMA) */}
      <div className="relative z-10 flex flex-col items-center p-4 min-h-screen">
        
        <header className="w-full max-w-md flex flex-col items-center pt-10 mb-12 text-center">
          <h1 className="text-5xl font-black italic tracking-tighter text-white drop-shadow-[0_0_20px_rgba(37,99,235,0.6)]">
            MANCU<span className="text-blue-500">FIT</span>
          </h1>
          <p className="text-[10px] font-black tracking-[0.5em] text-blue-500/50 uppercase mt-2 italic">Elite Training</p>
        </header>

        <main className="w-full max-w-md">
          {/* PANTALLA: MENÚ */}
          {pantalla === "menu" && (
            <div className="flex flex-col gap-6 animate-in fade-in zoom-in duration-500">
              <button onClick={() => rutina ? setPantalla("mostrarRutina") : setPantalla("seleccionDias")} className="relative w-full py-8 border-2 border-white/20 rounded-[40px] bg-white/5 backdrop-blur-sm active:scale-95 transition-all overflow-hidden">
                <span className="text-2xl font-black italic uppercase tracking-[0.2em] relative z-10">Mi Rutina</span>
                <div className="absolute right-[-5%] bottom-[-10%] text-6xl opacity-5 italic font-black">PLAN</div>
              </button>
              <button onClick={() => setPantalla("anatomia")} className="relative w-full py-8 border-2 border-white/20 rounded-[40px] bg-white/5 backdrop-blur-sm active:scale-95 transition-all overflow-hidden">
                <span className="text-2xl font-black italic uppercase tracking-[0.2em] relative z-10">Anatomía</span>
                <div className="absolute right-[-5%] bottom-[-10%] text-6xl opacity-5 italic font-black">BODY</div>
              </button>
              <button onClick={() => setPantalla("historial")} className="relative w-full py-8 border-2 border-orange-400/30 rounded-[40px] bg-orange-500/5 backdrop-blur-sm active:scale-95 transition-all overflow-hidden">
                <span className="text-2xl font-black italic uppercase tracking-[0.2em] text-orange-400 relative z-10">Progreso</span>
                <div className="absolute right-[-5%] bottom-[-10%] text-6xl opacity-5 italic font-black text-orange-400">STATS</div>
              </button>
            </div>
          )}

          {/* PANTALLA: SELECCIÓN DÍAS */}
          {pantalla === "seleccionDias" && (
            <div className="bg-black/60 border border-white/10 p-8 rounded-[2.5rem] backdrop-blur-3xl animate-in slide-in-from-bottom-10">
              <h2 className="text-2xl font-black italic mb-8 uppercase text-blue-500">Configura tu plan</h2>
              <div className="grid grid-cols-2 gap-3 mb-8">
                {DIAS_SEMANA.map(dia => (
                  <button key={dia} onClick={() => toggleDia(dia)} className={`py-4 rounded-2xl font-bold uppercase text-[10px] ${diasSeleccionados.includes(dia) ? "bg-blue-600 shadow-lg shadow-blue-500/40 text-white" : "bg-white/5 text-slate-400 border border-white/5"}`}>
                    {dia}
                  </button>
                ))}
              </div>
              <button onClick={generarRutina} className="w-full py-5 rounded-2xl bg-blue-500 font-black uppercase italic shadow-xl active:scale-95 transition-all">Generar Entrenamiento</button>
              <button onClick={() => setPantalla("menu")} className="w-full mt-4 text-[10px] font-black text-slate-500 uppercase">Volver</button>
            </div>
          )}

          {/* PANTALLA: MOSTRAR RUTINA */}
          {pantalla === "mostrarRutina" && rutina && (
            <div className="space-y-6 animate-in fade-in pb-20">
              <div className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl p-4 border border-white/10 rounded-3xl mb-4 shadow-2xl">
                <div className="flex justify-between items-center mb-4 px-2">
                  <h2 className="font-black italic text-blue-500 uppercase text-xs tracking-widest">Sesión Activa</h2>
                  <button onClick={() => setPantalla("menu")} className="text-[10px] font-black text-slate-500 uppercase">✕ Menú</button>
                </div>
                <button onClick={modoEntreno ? finalizarEntrenamiento : () => setModoEntreno(true)} className={`w-full py-4 rounded-2xl font-black transition-all uppercase italic ${modoEntreno ? "bg-red-500 text-white" : "bg-green-500 text-black shadow-lg"}`}>
                  {modoEntreno ? "Finalizar y Guardar" : "Empezar Entreno"}
                </button>
                {modoEntreno && <div className="mt-4"><CronometroDescanso tiempoInicial={60} /></div>}
              </div>

              {Object.entries(rutina).map(([dia, ejercicios]) => (
                <div key={dia} className="bg-black/40 border border-white/10 p-6 rounded-[2.5rem] backdrop-blur-md mb-6 shadow-xl">
                  <h3 className="text-xl font-black text-blue-400 mb-6 italic uppercase border-b border-white/10 pb-2">{dia}</h3>
                  <div className="space-y-4">
                    {ejercicios.map((ej) => {
                      const done = completados.includes(ej.id);
                      return (
                        <div key={ej.id} className={`p-4 rounded-3xl border transition-all duration-300 ${done ? "bg-green-500/10 border-green-500/30 opacity-40 scale-[0.98]" : "bg-white/5 border-white/10 shadow-inner"}`}>
                          <div className="flex justify-between items-center mb-4">
                            <span onClick={() => abrirDetalle(ej)} className="font-bold text-lg text-white uppercase italic tracking-tighter cursor-pointer">
                              {ej.nombre} <span className="text-[9px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full border border-blue-500/30 ml-2 uppercase">Info</span>
                            </span>
                            {modoEntreno && (
                              <button onClick={() => setCompletados(p => p.includes(ej.id) ? p.filter(id => id !== ej.id) : [...p, ej.id])} className={`min-w-[48px] h-12 rounded-2xl border-2 flex items-center justify-center transition-all ${done ? "bg-green-500 border-green-400 text-black shadow-lg" : "border-white/20 text-slate-500"}`}>
                                {done ? "✓" : ""}
                              </button>
                            )}
                          </div>
                          <div className="grid grid-cols-3 gap-3">
                            <div className="bg-black/40 p-2 rounded-xl text-center">
                              <p className="text-[8px] text-slate-500 font-black uppercase mb-1">Series</p>
                              <input type="number" disabled={modoEntreno} value={ej.series} onChange={(e) => actualizarEjercicio(dia, ej.id, 'series', e.target.value)} className="bg-transparent w-full text-center font-bold outline-none text-white" />
                            </div>
                            <div className="bg-black/40 p-2 rounded-xl text-center">
                              <p className="text-[8px] text-slate-500 font-black uppercase mb-1">Reps</p>
                              <input type="number" disabled={modoEntreno} value={ej.reps} onChange={(e) => actualizarEjercicio(dia, ej.id, 'reps', e.target.value)} className="bg-transparent w-full text-center font-bold outline-none text-white" />
                            </div>
                            <div className="bg-blue-900/20 p-2 rounded-xl text-center border border-blue-500/30">
                              <p className="text-[8px] text-blue-400 font-black uppercase mb-1">Peso KG</p>
                              <input type="number" disabled={modoEntreno} value={ej.peso} onChange={(e) => actualizarEjercicio(dia, ej.id, 'peso', e.target.value)} className="bg-transparent w-full text-center font-bold outline-none text-blue-300" />
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

          {/* PANTALLA: ANATOMÍA */}
          {pantalla === "anatomia" && (
            <div className="animate-in fade-in duration-300 pb-20">
              <div className="flex justify-between items-center mb-6 px-2">
                <h2 className="text-2xl font-black italic text-blue-500 uppercase">Anatomía</h2>
                <button onClick={() => {setPantalla("menu"); setMusculoSeleccionado(null)}} className="bg-white/5 border border-white/10 px-4 py-1 rounded-full text-xs uppercase font-bold">Cerrar</button>
              </div>
              {!musculoSeleccionado ? (
                <CuerpoHumano alSeleccionarMusculo={setMusculoSeleccionado} />
              ) : (
                <div className="space-y-4 animate-in zoom-in duration-300">
                  <button onClick={() => setMusculoSeleccionado(null)} className="text-blue-400 font-black text-[10px] mb-4 tracking-widest uppercase flex items-center gap-2">← VOLVER AL CUERPO</button>
                  <div className="bg-black/60 border border-white/10 p-6 rounded-[2rem] backdrop-blur-xl">
                    <h3 className="text-3xl font-black text-blue-500 mb-6 italic uppercase tracking-tighter">{musculoSeleccionado}</h3>
                    {BASE_EJERCICIOS[musculoSeleccionado.toLowerCase()]?.map((ej, i) => (
                      <div key={i} className="border-l-4 border-blue-500 p-4 bg-white/5 mb-3 rounded-r-2xl flex justify-between items-center">
                        <div onClick={() => abrirDetalle(ej)} className="flex-1 cursor-pointer">
                          <p className="font-bold text-lg uppercase italic tracking-tighter">{ej.nombre}</p>
                          <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Técnica</p>
                        </div>
                        <button onClick={() => agregarEjercicio(ej)} className="bg-blue-500 w-10 h-10 rounded-full font-black text-white active:scale-90 transition-transform">+</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* PANTALLA: HISTORIAL */}
          {pantalla === "historial" && (
            <div className="animate-in slide-in-from-right duration-500 pb-20">
              <div className="flex justify-between items-center mb-8 px-2">
                <h2 className="text-3xl font-black italic uppercase text-orange-400 tracking-tighter">Progreso</h2>
                <button onClick={() => setPantalla("menu")} className="bg-white/5 border border-white/10 px-4 py-2 rounded-full text-[10px] font-black uppercase text-orange-400">✕ Volver</button>
              </div>
              {historial.length === 0 ? (
                <p className="text-center text-slate-500 italic py-20 border-2 border-dashed border-white/10 rounded-[2rem]">Aún no hay registros.</p>
              ) : (
                historial.map(item => (
                  <div key={item.id} className="bg-black/40 backdrop-blur-md p-6 rounded-[2rem] border border-white/5 mb-4">
                    <p className="text-orange-400 font-black italic uppercase text-sm mb-3">{item.fecha}</p>
                    <div className="flex flex-wrap gap-2">
                      {item.exercises?.map((e, idx) => (
                        <span key={idx} className="text-[9px] text-slate-400 bg-white/5 px-2 py-1 rounded-lg">{e.nombre}</span>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </main>
      </div>

      {/* MODAL TÉCNICO */}
      {ejercicioDetalle && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={() => setEjercicioDetalle(null)}></div>
          <div className="relative bg-[#111] border border-white/10 w-full max-w-sm rounded-[3rem] p-8 animate-in zoom-in shadow-2xl">
            <h3 className="text-2xl font-black italic text-blue-500 uppercase mb-6 tracking-tighter">{ejercicioDetalle.nombre}</h3>
            <p className="text-[10px] font-black uppercase text-slate-500 mb-2">Instrucciones</p>
            <p className="text-slate-300 text-sm mb-6">{ejercicioDetalle.instrucciones || "Próximamente..."}</p>
            <button onClick={() => setEjercicioDetalle(null)} className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl font-black uppercase text-[10px]">Cerrar</button>
          </div>
        </div>
      )}

    </div>
  );
}