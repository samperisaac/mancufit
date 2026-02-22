import React, { useState, useEffect } from "react";
import CuerpoHumano from "./components/CuerpoHumano";
import CronometroDescanso from "./components/CronometroDescanso";
import { BASE_EJERCICIOS } from "./data/ejercicios";

const DIAS_SEMANA = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

export default function App() {
  const [pantalla, setPantalla] = useState("menu");
  const [rutina, setRutina] = useState(null);
  const [diasSeleccionados, setDiasSeleccionados] = useState([]);
  const [musculoSeleccionado, setMusculoSeleccionado] = useState(null);
  const [modoEntreno, setModoEntreno] = useState(false);
  const [completados, setCompletados] = useState([]);
  const [historial, setHistorial] = useState([]);
  const [ejercicioDetalle, setEjercicioDetalle] = useState(null);

  // --- PERSISTENCIA ---
  useEffect(() => {
    const rutinaG = localStorage.getItem("rutinaMancuFit");
    const historialG = localStorage.getItem("historialMancuFit");
    if (rutinaG) setRutina(JSON.parse(rutinaG));
    if (historialG) setHistorial(JSON.parse(historialG));
  }, []);

  useEffect(() => {
    if (rutina) localStorage.setItem("rutinaMancuFit", JSON.stringify(rutina));
    else localStorage.removeItem("rutinaMancuFit"); // Limpiar si se borra
    localStorage.setItem("historialMancuFit", JSON.stringify(historial));
  }, [rutina, historial]);

  // --- FUNCIONES ---
  const toggleDia = (dia) => {
    setDiasSeleccionados(prev => prev.includes(dia) ? prev.filter(d => d !== dia) : [...prev, dia]);
  };

  const generarRutina = () => {
    let nueva = {};
    diasSeleccionados.forEach(dia => {
      let ejs = Object.values(BASE_EJERCICIOS).map(cat => ({ 
        ...cat[Math.floor(Math.random() * cat.length)], 
        id: Math.random().toString(36).substr(2, 9) 
      }));
      nueva[dia] = ejs;
    });
    setRutina(nueva);
    setPantalla("mostrarRutina");
  };

  const finalizarEntrenamiento = () => {
    const logrados = [];
    Object.values(rutina).forEach(lista => logrados.push(...lista.filter(ej => completados.includes(ej.id))));
    if (logrados.length > 0) {
      setHistorial([{ id: Date.now(), fecha: new Date().toLocaleDateString('es-ES'), ejercicios: logrados }, ...historial]);
    }
    setModoEntreno(false);
    setCompletados([]);
    setPantalla("menu");
  };

  // Buscador de info técnica para el modal
  const abrirDetalle = (ej) => {
    const infoCompleta = Object.values(BASE_EJERCICIOS).flat().find(e => e.nombre === ej.nombre);
    setEjercicioDetalle(infoCompleta || ej);
  };

  return (
    <div className="min-h-screen bg-transparent text-slate-100 flex flex-col items-center p-4 font-sans">
      
      {/* HEADER LOGO */}
      <header className="w-full max-w-md flex flex-col items-center pt-10 mb-12 text-center">
        <h1 className="text-5xl font-black italic tracking-tighter text-white drop-shadow-[0_0_15px_rgba(37,99,235,0.4)]">
          MANCU<span className="text-blue-500">FIT</span>
        </h1>
        <div className="h-1 w-20 bg-blue-600 rounded-full mt-2 shadow-[0_0_10px_#2563eb]"></div>
      </header>

      <main className="w-full max-w-md">
        
        {/* 1. MENÚ PRINCIPAL */}
        {pantalla === "menu" && (
          <div className="flex flex-col gap-6 animate-in fade-in zoom-in duration-500">
            <button 
              onClick={() => rutina ? setPantalla("mostrarRutina") : setPantalla("seleccionDias")}
              className="relative w-full py-8 border-2 border-white/20 rounded-[40px] bg-white/5 backdrop-blur-sm group active:scale-95 transition-all duration-300 hover:border-blue-500/50 hover:bg-blue-500/10 hover:shadow-[0_0_30px_rgba(37,99,235,0.2)] overflow-hidden"
            >
              <span className="text-2xl font-black italic uppercase tracking-[0.2em] relative z-10 group-hover:text-blue-400">Mi Rutina</span>
              <div className="absolute right-[-5%] bottom-[-10%] text-6xl opacity-5 italic font-black group-hover:opacity-20 transition-all">PLAN</div>
            </button>

            <button onClick={() => setPantalla("anatomia")} className="relative w-full py-8 border-2 border-white/20 rounded-[40px] bg-white/5 backdrop-blur-sm group active:scale-95 transition-all duration-300 hover:border-white/50 overflow-hidden">
              <span className="text-2xl font-black italic uppercase tracking-[0.2em] relative z-10">Anatomía</span>
              <div className="absolute right-[-5%] bottom-[-10%] text-6xl opacity-5 italic font-black group-hover:opacity-20 transition-all">BODY</div>
            </button>

            <button onClick={() => setPantalla("historial")} className="relative w-full py-8 border-2 border-orange-400/30 rounded-[40px] bg-orange-500/5 backdrop-blur-sm group active:scale-95 transition-all duration-300 hover:border-orange-500/60 overflow-hidden">
              <span className="text-2xl font-black italic uppercase tracking-[0.2em] text-orange-400 relative z-10">Progreso</span>
              <div className="absolute right-[-5%] bottom-[-10%] text-6xl opacity-5 italic font-black text-orange-400 group-hover:opacity-20 transition-all">STATS</div>
            </button>
          </div>
        )}

        {/* 2. CONFIGURACIÓN DÍAS */}
        {pantalla === "seleccionDias" && (
          <div className="bg-black/40 border border-white/10 p-8 rounded-[2.5rem] backdrop-blur-3xl relative animate-in slide-in-from-bottom-10">
            <button onClick={() => setPantalla("menu")} className="absolute top-6 right-6 text-slate-500 uppercase text-[10px] font-black">✕ Cancelar</button>
            <h2 className="text-2xl font-black italic mb-8 uppercase text-blue-500">Configura tu plan</h2>
            <div className="grid grid-cols-2 gap-3 mb-8">
              {DIAS_SEMANA.map(dia => (
                <button key={dia} onClick={() => toggleDia(dia)} className={`py-4 rounded-2xl font-black transition-all border ${diasSeleccionados.includes(dia) ? "bg-blue-600 border-blue-400 shadow-lg" : "bg-white/5 border-white/5 text-slate-500"}`}>
                  {dia}
                </button>
              ))}
            </div>
            <button onClick={generarRutina} disabled={diasSeleccionados.length === 0} className="w-full py-5 rounded-2xl bg-blue-500 font-black uppercase italic shadow-xl active:scale-95 transition-all">Generar Entrenamiento</button>
          </div>
        )}

        {/* 3. MOSTRAR RUTINA + BOTÓN REINICIAR */}
        {pantalla === "mostrarRutina" && rutina && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="sticky top-0 z-50 bg-black/60 backdrop-blur-xl p-4 border border-white/10 rounded-3xl mb-4 shadow-2xl">
              <div className="flex justify-between items-center mb-3 px-2">
                <div className="flex items-center gap-4">
                  <h2 className="font-black italic text-blue-500 uppercase text-xs tracking-widest">Sesión Activa</h2>
                  {/* BOTÓN REINICIAR AQUÍ */}
                  {!modoEntreno && (
                    <button 
                      onClick={() => { if(confirm("¿Borrar rutina y cambiar los días?")) { setRutina(null); setPantalla("seleccionDias"); } }}
                      className="text-[9px] font-black text-red-500/60 hover:text-red-500 uppercase border border-red-500/20 px-2 py-1 rounded-lg transition-all"
                    >
                      Reiniciar Plan
                    </button>
                  )}
                </div>
                <button onClick={() => setPantalla("menu")} className="text-[10px] font-black text-slate-500 hover:text-white uppercase transition-colors">✕ Menú</button>
              </div>
              <button onClick={modoEntreno ? finalizarEntrenamiento : () => setModoEntreno(true)} className={`w-full py-4 rounded-2xl font-black transition-all uppercase italic ${modoEntreno ? "bg-red-500 text-white" : "bg-green-500 text-black shadow-[0_0_20px_rgba(34,197,94,0.3)]"}`}>
                {modoEntreno ? "Finalizar y Guardar" : "Empezar Entreno"}
              </button>
              {modoEntreno && <div className="mt-4"><CronometroDescanso tiempoInicial={60} /></div>}
            </div>

            {Object.entries(rutina).map(([dia, ejercicios]) => (
              <div key={dia} className="bg-black/30 border border-white/10 p-6 rounded-[2.5rem] backdrop-blur-md mb-6 shadow-xl">
                <h3 className="text-xl font-black text-blue-400 mb-6 italic uppercase border-b border-white/10 pb-2">{dia}</h3>
                <div className="space-y-4">
                  {ejercicios.map((ej) => {
                    const done = completados.includes(ej.id);
                    return (
                      <div key={ej.id} className={`p-4 rounded-3xl border transition-all duration-300 ${done ? "bg-green-500/10 border-green-500/30 opacity-40 scale-[0.98]" : "bg-white/5 border-white/10 shadow-inner"}`}>
                        <div className="flex justify-between items-center mb-4">
                          <div onClick={() => abrirDetalle(ej)} className="flex flex-col cursor-pointer group flex-1">
                            <span className="font-bold text-lg text-white group-hover:text-blue-400 transition-colors flex items-center gap-2 uppercase tracking-tighter italic">
                              {ej.nombre} 
                              <span className="text-[9px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full border border-blue-500/30">INFO</span>
                            </span>
                          </div>
                          {modoEntreno && (
                            <button onClick={() => setCompletados(p => p.includes(ej.id) ? p.filter(id => id !== ej.id) : [...p, ej.id])} className={`min-w-[48px] h-12 rounded-2xl border-2 flex items-center justify-center transition-all ${done ? "bg-green-500 border-green-400 text-black shadow-lg" : "border-white/20 text-slate-500"}`}>
                              {done ? "✓" : ""}
                            </button>
                          )}
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                          <div className="bg-black/40 p-2 rounded-xl text-center"><p className="text-[8px] text-slate-500 font-black uppercase">Series</p><p className="font-bold">{ej.series}</p></div>
                          <div className="bg-black/40 p-2 rounded-xl text-center"><p className="text-[8px] text-slate-500 font-black uppercase">Reps</p><p className="font-bold">{ej.reps}</p></div>
                          <div className="bg-blue-900/20 p-2 rounded-xl text-center border border-blue-500/30"><p className="text-[8px] text-blue-400 font-black uppercase">Peso KG</p><p className="font-bold text-blue-300">{ej.peso}</p></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 4. ANATOMÍA */}
        {pantalla === "anatomia" && (
          <div className="animate-in fade-in duration-300">
            <div className="flex justify-between items-center mb-6 px-2">
              <h2 className="text-2xl font-black italic text-blue-500 uppercase">Anatomía</h2>
              <button onClick={() => {setPantalla("menu"); setMusculoSeleccionado(null)}} className="bg-white/5 border border-white/10 px-4 py-1 rounded-full text-xs uppercase font-bold">Cerrar</button>
            </div>
            {!musculoSeleccionado ? (
              <CuerpoHumano alSeleccionarMusculo={setMusculoSeleccionado} />
            ) : (
              <div className="space-y-4 animate-in zoom-in duration-300">
                <button onClick={() => setMusculoSeleccionado(null)} className="text-blue-400 font-black text-[10px] mb-4 tracking-widest uppercase flex items-center gap-2">← VOLVER AL CUERPO</button>
                <div className="bg-black/40 border border-white/10 p-6 rounded-[2rem] backdrop-blur-xl">
                  <h3 className="text-3xl font-black text-blue-500 mb-6 italic uppercase tracking-tighter">{musculoSeleccionado}</h3>
                  {BASE_EJERCICIOS[musculoSeleccionado.toLowerCase()]?.map((ej, i) => (
                    <div key={i} onClick={() => abrirDetalle(ej)} className="border-l-4 border-blue-500 p-4 bg-white/5 mb-3 rounded-r-2xl cursor-pointer hover:bg-white/10 transition-all group">
                      <p className="font-bold text-lg group-hover:text-blue-400 transition-colors uppercase italic tracking-tighter">{ej.nombre}</p>
                      <p className="text-[10px] text-slate-500 font-black uppercase mt-1 tracking-widest">Ver técnica e instrucciones</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 5. HISTORIAL */}
        {pantalla === "historial" && (
          <div className="animate-in slide-in-from-right duration-500">
            <div className="flex justify-between items-center mb-8 px-2">
              <h2 className="text-3xl font-black italic uppercase text-orange-400 tracking-tighter">Progreso</h2>
              <button onClick={() => setPantalla("menu")} className="bg-white/5 border border-white/10 px-4 py-2 rounded-full text-[10px] font-black uppercase">✕ Volver</button>
            </div>
            {historial.length === 0 ? (
              <p className="text-center text-slate-500 italic py-20 border-2 border-dashed border-white/10 rounded-[2rem]">Registra tu primer entreno para ver estadísticas.</p>
            ) : (
              historial.map(item => (
                <div key={item.id} className="bg-black/30 backdrop-blur-md p-6 rounded-[2rem] border border-white/5 mb-4 shadow-xl">
                  <div className="flex justify-between items-center mb-3">
                    <p className="text-orange-400 font-black italic uppercase text-sm tracking-widest">{item.fecha}</p>
                    <span className="text-[8px] bg-orange-500/20 text-orange-300 px-2 py-1 rounded-md font-black uppercase border border-orange-500/20">Registrado</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {item.ejercicios.map((e, idx) => (
                      <span key={idx} className="text-[9px] text-slate-400 bg-white/5 px-2 py-1 rounded-lg border border-white/5">{e.nombre}</span>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>

      {/* --- MODAL DE DETALLE --- */}
      {ejercicioDetalle && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/85 backdrop-blur-md" onClick={() => setEjercicioDetalle(null)}></div>
          <div className="relative bg-[#111112] border border-white/10 w-full max-w-sm rounded-[3rem] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden animate-in zoom-in duration-300">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-600 to-blue-400"></div>
            <button onClick={() => setEjercicioDetalle(null)} className="absolute top-6 right-6 text-slate-600 hover:text-white transition-colors">✕</button>
            <h3 className="text-2xl font-black italic text-blue-500 uppercase mb-6 leading-tight pr-4 tracking-tighter">{ejercicioDetalle.nombre}</h3>
            <div className="space-y-6">
              <div>
                <p className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] mb-3 border-b border-white/5 pb-1">Instrucciones</p>
                <p className="text-slate-300 leading-relaxed text-sm antialiased">{ejercicioDetalle.instrucciones || "Próximamente..."}</p>
              </div>
              {ejercicioDetalle.tips && (
                <div className="bg-blue-500/5 border border-blue-500/20 p-4 rounded-2xl italic">
                  <p className="text-[9px] font-black uppercase text-blue-400 mb-2 flex items-center gap-1"><span>💡</span> Consejo Técnico</p>
                  <p className="text-blue-200/80 text-xs">"{ejercicioDetalle.tips}"</p>
                </div>
              )}
            </div>
            <button onClick={() => setEjercicioDetalle(null)} className="w-full mt-10 py-4 bg-white/5 border border-white/10 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-white/10 transition-all active:scale-95">Cerrar Guía</button>
          </div>
        </div>
      )}
    </div>
  );
}