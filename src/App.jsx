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

  // --- PERSISTENCIA (LocalStorage) ---
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

  // --- FUNCIONES DE RUTINA ---
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
      setHistorial([{ id: Date.now(), fecha: new Date().toLocaleDateString('es-ES'), ejercicios: logrados }, ...historial]);
    }
    setModoEntreno(false);
    setCompletados([]);
    setPantalla("menu");
  };

  return (
    <div className="min-h-screen bg-transparent text-slate-100 flex flex-col items-center p-4 font-sans selection:bg-blue-500/30">
      
      {/* HEADER LOGO */}
      <header className="w-full max-w-md flex flex-col items-center pt-10 mb-12">
        <h1 className="text-5xl font-black italic tracking-tighter text-white drop-shadow-[0_0_15px_rgba(37,99,235,0.4)]">
          MANCU<span className="text-blue-500">FIT</span>
        </h1>
        <div className="h-1 w-20 bg-blue-600 rounded-full mt-2 shadow-[0_0_10px_#2563eb]"></div>
      </header>

      <main className="w-full max-w-md">
        
        {/* 1. MENÚ PRINCIPAL CON ANIMACIONES */}
        {pantalla === "menu" && (
          <div className="flex flex-col gap-6 animate-in fade-in zoom-in duration-500">
            <button 
              onClick={() => rutina ? setPantalla("mostrarRutina") : setPantalla("seleccionDias")}
              className="relative w-full py-8 border-2 border-white/20 rounded-[40px] bg-white/5 backdrop-blur-sm group active:scale-95 transition-all duration-300 hover:border-blue-500/50 hover:bg-blue-500/10 hover:shadow-[0_0_30px_rgba(37,99,235,0.2)] overflow-hidden"
            >
              <span className="text-2xl font-black italic uppercase tracking-[0.2em] relative z-10 group-hover:text-blue-400 transition-colors">Mi Rutina</span>
              <div className="absolute right-[-5%] bottom-[-10%] text-6xl opacity-5 italic font-black group-hover:opacity-20 group-hover:scale-110 transition-all duration-500">PLAN</div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </button>

            <button 
              onClick={() => setPantalla("anatomia")}
              className="relative w-full py-8 border-2 border-white/20 rounded-[40px] bg-white/5 backdrop-blur-sm group active:scale-95 transition-all duration-300 hover:border-white/50 hover:bg-white/10 hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] overflow-hidden"
            >
              <span className="text-2xl font-black italic uppercase tracking-[0.2em] relative z-10 transition-colors">Anatomía</span>
              <div className="absolute right-[-5%] bottom-[-10%] text-6xl opacity-5 italic font-black group-hover:opacity-20 group-hover:scale-110 transition-all duration-500">BODY</div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </button>

            <button 
              onClick={() => setPantalla("historial")}
              className="relative w-full py-8 border-2 border-orange-400/30 rounded-[40px] bg-orange-500/5 backdrop-blur-sm group active:scale-95 transition-all duration-300 hover:border-orange-500/60 hover:bg-orange-500/10 hover:shadow-[0_0_30px_rgba(251,146,60,0.2)] overflow-hidden"
            >
              <span className="text-2xl font-black italic uppercase tracking-[0.2em] text-orange-400/80 group-hover:text-orange-400 relative z-10 transition-colors">Progreso</span>
              <div className="absolute right-[-5%] bottom-[-10%] text-6xl opacity-5 italic font-black text-orange-400 group-hover:opacity-20 group-hover:scale-110 transition-all duration-500">STATS</div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-500/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </button>
          </div>
        )}

        {/* 2. CONFIGURACIÓN DE DÍAS */}
        {pantalla === "seleccionDias" && (
          <div className="bg-black/40 border border-white/10 p-8 rounded-[2.5rem] backdrop-blur-3xl relative animate-in slide-in-from-bottom-10">
            <button onClick={() => setPantalla("menu")} className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors uppercase text-[10px] font-black">✕ Cancelar</button>
            <h2 className="text-2xl font-black italic mb-8 uppercase text-blue-500">Configura tu plan</h2>
            <div className="grid grid-cols-2 gap-3 mb-8">
              {DIAS_SEMANA.map(dia => (
                <button key={dia} onClick={() => toggleDia(dia)} className={`py-4 rounded-2xl font-black transition-all border ${diasSeleccionados.includes(dia) ? "bg-blue-600 border-blue-400 shadow-lg" : "bg-white/5 border-white/5 text-slate-500"}`}>
                  {dia}
                </button>
              ))}
            </div>
            <button onClick={generarRutina} disabled={diasSeleccionados.length === 0} className="w-full py-5 rounded-2xl bg-blue-500 font-black uppercase italic disabled:opacity-20 shadow-xl active:scale-95 transition-transform">
              Generar Entrenamiento
            </button>
          </div>
        )}

        {/* 3. MOSTRAR RUTINA */}
        {pantalla === "mostrarRutina" && rutina && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="sticky top-0 z-50 bg-black/60 backdrop-blur-xl p-4 border border-white/10 rounded-3xl mb-4 shadow-2xl">
              <div className="flex justify-between items-center mb-3 px-2">
                <h2 className="font-black italic text-blue-500 uppercase">Sesión Activa</h2>
                <button onClick={() => setPantalla("menu")} className="text-[10px] font-black text-slate-500 hover:text-white uppercase">✕ Menú</button>
              </div>
              <button onClick={modoEntreno ? finalizarEntrenamiento : () => setModoEntreno(true)} className={`w-full py-4 rounded-2xl font-black transition-all uppercase italic ${modoEntreno ? "bg-red-500" : "bg-green-500 text-black"}`}>
                {modoEntreno ? "Finalizar y Guardar" : "Empezar Entreno"}
              </button>
              {modoEntreno && <div className="mt-4"><CronometroDescanso tiempoInicial={60} /></div>}
            </div>

            {Object.entries(rutina).map(([dia, ejercicios]) => (
              <div key={dia} className="bg-black/30 border border-white/10 p-6 rounded-[2.5rem] backdrop-blur-md mb-6">
                <h3 className="text-xl font-black text-blue-400 mb-6 italic uppercase border-b border-white/10 pb-2">{dia}</h3>
                <div className="space-y-4">
                  {ejercicios.map((ej, index) => {
                    const done = completados.includes(ej.id);
                    return (
                      <div key={ej.id} className={`p-4 rounded-3xl border transition-all ${done ? "bg-green-500/10 border-green-500/30 opacity-40 scale-[0.98]" : "bg-white/5 border-white/5 shadow-inner"}`}>
                        <div className="flex justify-between items-center mb-4">
                          <input disabled={modoEntreno} className="bg-transparent font-bold text-lg text-white w-full outline-none focus:text-blue-400" value={ej.nombre} onChange={(e) => actualizarEjercicio(dia, index, 'nombre', e.target.value)} />
                          {modoEntreno && (
                            <button onClick={() => setCompletados(p => p.includes(ej.id) ? p.filter(id => id !== ej.id) : [...p, ej.id])} className={`min-w-[48px] h-12 rounded-2xl border-2 flex items-center justify-center transition-all ${done ? "bg-green-500 border-green-400 text-black" : "border-white/20"}`}>
                              {done ? "✓" : ""}
                            </button>
                          )}
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                          <div className="bg-black/40 p-2 rounded-xl text-center"><p className="text-[8px] text-slate-500 font-black uppercase text-center">Series</p>
                          <input disabled={modoEntreno} className="bg-transparent w-full text-center font-bold" value={ej.series} onChange={(e) => actualizarEjercicio(dia, index, 'series', e.target.value)} /></div>
                          <div className="bg-black/40 p-2 rounded-xl text-center"><p className="text-[8px] text-slate-500 font-black uppercase text-center">Reps</p>
                          <input disabled={modoEntreno} className="bg-transparent w-full text-center font-bold" value={ej.reps} onChange={(e) => actualizarEjercicio(dia, index, 'reps', e.target.value)} /></div>
                          <div className="bg-blue-900/20 p-2 rounded-xl text-center border border-blue-500/30"><p className="text-[8px] text-blue-400 font-black uppercase text-center">Peso KG</p>
                          <input disabled={modoEntreno} className="bg-transparent w-full text-center font-bold text-blue-300" value={ej.peso} onChange={(e) => actualizarEjercicio(dia, index, 'peso', e.target.value)} /></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 4. PANTALLA: ANATOMÍA */}
        {pantalla === "anatomia" && (
          <div className="animate-in fade-in duration-300">
            <div className="flex justify-between items-center mb-6 px-2">
              <h2 className="text-2xl font-black italic text-blue-500 uppercase">Anatomía</h2>
              <button onClick={() => {setPantalla("menu"); setMusculoSeleccionado(null)}} className="bg-white/5 border border-white/10 px-4 py-1 rounded-full text-xs uppercase font-bold hover:bg-white/10">Cerrar</button>
            </div>
            {!musculoSeleccionado ? (
              <CuerpoHumano alSeleccionarMusculo={setMusculoSeleccionado} />
            ) : (
              <div className="space-y-4 animate-in zoom-in">
                <button onClick={() => setMusculoSeleccionado(null)} className="text-blue-400 font-bold text-sm mb-4 flex items-center gap-2">← VOLVER AL MAPA</button>
                <div className="bg-black/40 border border-white/10 p-6 rounded-[2rem] backdrop-blur-xl">
                  <h3 className="text-3xl font-black text-blue-500 mb-6 italic uppercase">{musculoSeleccionado}</h3>
                  {BASE_EJERCICIOS[musculoSeleccionado.toLowerCase()]?.map((ej, i) => (
                    <div key={i} className="border-l-4 border-blue-500 p-4 bg-white/5 mb-3 rounded-r-2xl">
                      <p className="font-bold text-lg">{ej.nombre}</p>
                      <p className="text-[10px] text-slate-500 font-black uppercase mt-1">{ej.series} SERIES • {ej.reps} REPS</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 5. PANTALLA: HISTORIAL */}
        {pantalla === "historial" && (
          <div className="animate-in slide-in-from-right duration-500">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-black italic uppercase text-orange-400">Progreso</h2>
              <button onClick={() => setPantalla("menu")} className="bg-white/5 border border-white/10 px-4 py-2 rounded-full text-[10px] font-black uppercase">✕ Volver</button>
            </div>
            {historial.length === 0 ? (
              <p className="text-center text-slate-500 italic py-20 border-2 border-dashed border-white/5 rounded-[2rem]">Aún no hay entrenamientos registrados.</p>
            ) : (
              historial.map(item => (
                <div key={item.id} className="bg-black/30 backdrop-blur-md p-6 rounded-[2rem] border border-white/5 mb-4">
                  <p className="text-orange-400 font-black italic uppercase">{item.fecha}</p>
                  <p className="text-[10px] text-slate-400 mt-2">{item.ejercicios.length} ejercicios completados</p>
                </div>
              ))
            )}
          </div>
        )}

      </main>
    </div>
  );
}