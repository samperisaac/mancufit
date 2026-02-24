import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
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
  const [ejercicioGrafica, setEjercicioGrafica] = useState(null);

  // --- PERSISTENCIA ---
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

  // --- LÓGICA DE HISTORIAL ---
  const obtenerDatosGrafica = (nombreEjercicio) => {
    return historial
      .filter(sesion => sesion.ejercicios.some(e => e.nombre === nombreEjercicio))
      .map(sesion => {
        const datosEj = sesion.ejercicios.find(e => e.nombre === nombreEjercicio);
        return {
          fecha: sesion.fecha.split(',')[0],
          peso: parseFloat(datosEj.peso),
          reps: parseInt(datosEj.reps)
        };
      })
      .reverse();
  };

  const listaEjerciciosUnicos = [...new Set(historial.flatMap(s => s.ejercicios.map(e => e.nombre)))];

  // --- FUNCIONES DE CONTROL ---
  const alSeleccionarMusculo = (id) => {
    setMusculoSeleccionado(id.toLowerCase());
    // Si quieres que cambie de pantalla al tocar:
    // setPantalla("anatomia"); 
  };

  const generarRutina = () => {
    const nueva = {};
    const categoriasDisponibles = Object.keys(BASE_EJERCICIOS);
    diasSeleccionados.forEach(dia => {
      const ejerciciosDelDia = [];
      const cats = [...categoriasDisponibles].sort(() => 0.5 - Math.random());
      cats.slice(0, 6).forEach(cat => {
        const lista = BASE_EJERCICIOS[cat];
        if (lista?.length > 0) {
          const ej = lista[Math.floor(Math.random() * lista.length)];
          ejerciciosDelDia.push({ ...ej, id: Math.random() * Date.now(), series: "4", reps: "12", peso: "0" });
        }
      });
      nueva[dia] = ejerciciosDelDia;
    });
    setRutina(nueva);
    setPantalla("mostrarRutina");
  };

  const finalizarEntrenamiento = () => {
    const logrados = [];
    Object.values(rutina).forEach(lista => logrados.push(...lista.filter(ej => completados.includes(ej.id))));
    if (logrados.length > 0) {
      setHistorial([{ 
        id: Date.now(), 
        fecha: new Date().toLocaleString('es-ES', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }), 
        ejercicios: logrados.map(e => ({...e})) 
      }, ...historial]);
    }
    setModoEntreno(false);
    setCompletados([]);
    setPantalla("menu");
  };

  return (
    <div className="relative min-h-screen text-slate-100 font-sans overflow-x-hidden bg-black">
      {/* CAPA DE FONDO */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img src="/fondo.jpg" className="w-full h-full object-cover opacity-60" alt="bg" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/70 to-black"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center p-4 min-h-screen">
        <header className="w-full max-w-md flex flex-col items-center pt-10 mb-12 text-center text-white">
          <h1 className="text-5xl font-black italic tracking-tighter drop-shadow-[0_0_20px_rgba(37,99,235,0.6)]">
            MANCU<span className="text-blue-500">FIT</span>
          </h1>
          <p className="text-[10px] font-black tracking-[0.5em] text-blue-500/50 uppercase mt-2 italic">Elite Training</p>
        </header>

        <main className="w-full max-w-md">
          {/* MENU PRINCIPAL */}
          {pantalla === "menu" && (
            <div className="flex flex-col gap-6 animate-in fade-in zoom-in">
              <button onClick={() => rutina ? setPantalla("mostrarRutina") : setPantalla("seleccionDias")} className="relative w-full py-8 border-2 border-white/20 rounded-[40px] bg-white/5 backdrop-blur-sm active:scale-95 transition-all uppercase italic font-black text-2xl tracking-widest">Mi Rutina</button>
              <button onClick={() => setPantalla("anatomia")} className="relative w-full py-8 border-2 border-white/20 rounded-[40px] bg-white/5 backdrop-blur-sm active:scale-95 transition-all uppercase italic font-black text-2xl tracking-widest">Anatomía</button>
              <button onClick={() => setPantalla("historial")} className="relative w-full py-8 border-2 border-orange-400/30 rounded-[40px] bg-orange-500/5 backdrop-blur-sm active:scale-95 transition-all uppercase italic font-black text-2xl tracking-widest text-orange-400 text-center shadow-lg shadow-orange-500/10">Progreso</button>
            </div>
          )}

          {/* PANTALLA SELECCION DIAS */}
          {pantalla === "seleccionDias" && (
             <div className="bg-black/40 border border-white/10 p-8 rounded-[3rem] backdrop-blur-md animate-in slide-in-from-bottom">
                <h2 className="text-2xl font-black italic uppercase text-blue-500 mb-6 text-center">¿Qué días entrenas?</h2>
                <div className="grid grid-cols-1 gap-3 mb-8">
                  {DIAS_SEMANA.map(dia => (
                    <button key={dia} onClick={() => setDiasSeleccionados(prev => prev.includes(dia) ? prev.filter(d => d !== dia) : [...prev, dia])} className={`py-4 rounded-2xl font-bold transition-all ${diasSeleccionados.includes(dia) ? "bg-blue-600 text-white" : "bg-white/5 text-slate-400 border border-white/10"}`}>{dia}</button>
                  ))}
                </div>
                <button onClick={generarRutina} disabled={diasSeleccionados.length === 0} className="w-full py-5 bg-white text-black rounded-3xl font-black uppercase italic disabled:opacity-30">Crear Mi Plan</button>
             </div>
          )}

          {/* PANTALLA MOSTRAR RUTINA */}
          {pantalla === "mostrarRutina" && rutina && (
            <div className="space-y-6 animate-in fade-in pb-20">
              <div className="sticky top-0 z-50 bg-black/90 backdrop-blur-xl p-5 border border-white/10 rounded-[2.5rem] mb-4 shadow-2xl">
                <div className="flex justify-between items-center mb-5 px-1">
                  <h2 className="font-black italic text-blue-500 uppercase text-xs tracking-widest">Sesión Activa</h2>
                  <div className="flex items-center gap-3">
                    <button onClick={() => { if(confirm("¿Borrar rutina?")) { setRutina(null); setPantalla("seleccionDias"); } }} className="text-[10px] font-black text-red-500 uppercase border-2 border-red-500/30 px-4 py-2 rounded-xl bg-red-500/10">🗑 Borrar</button>
                    <button onClick={() => setPantalla("menu")} className="text-slate-500 text-sm font-bold">✕</button>
                  </div>
                </div>
                <button onClick={modoEntreno ? finalizarEntrenamiento : () => setModoEntreno(true)} className={`w-full py-4 rounded-[1.5rem] font-black transition-all uppercase italic ${modoEntreno ? "bg-red-500 text-white" : "bg-green-500 text-black"}`}>
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
                        <div key={ej.id} className={`p-4 rounded-3xl border transition-all ${done ? "bg-green-500/10 border-green-500/30 opacity-40" : "bg-white/5 border-white/10"}`}>
                          <div className="flex justify-between items-center mb-4">
                            <span onClick={() => setEjercicioDetalle(ej)} className="font-bold text-lg text-white uppercase italic cursor-pointer flex items-center gap-2">{ej.nombre}</span>
                            {modoEntreno && (
                              <button onClick={() => setCompletados(p => p.includes(ej.id) ? p.filter(id => id !== ej.id) : [...p, ej.id])} className={`min-w-[48px] h-12 rounded-2xl border-2 flex items-center justify-center ${done ? "bg-green-500 border-green-400" : "border-white/20"}`}>{done ? "✓" : ""}</button>
                            )}
                          </div>
                          <div className="grid grid-cols-3 gap-3">
                            {['series', 'reps', 'peso'].map(campo => (
                              <div key={campo} className="p-2 rounded-xl text-center bg-white/10 border border-white/20">
                                <p className="text-[8px] text-slate-500 font-black uppercase mb-1">{campo}</p>
                                <input type="number" disabled={!modoEntreno} value={ej[campo]} onChange={(e) => {
                                  const nuevaR = {...rutina};
                                  nuevaR[dia] = nuevaR[dia].map(ev => ev.id === ej.id ? {...ev, [campo]: e.target.value} : ev);
                                  setRutina(nuevaR);
                                }} className="bg-transparent w-full text-center font-bold outline-none text-white" />
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* PANTALLA ANATOMIA */}
          {pantalla === "anatomia" && (
            <div className="flex flex-col items-center animate-in fade-in">
                <div className="flex justify-between w-full mb-8">
                  <h2 className="text-2xl font-black italic uppercase text-blue-500">Mapa Muscular</h2>
                  <button onClick={() => setPantalla("menu")} className="text-slate-500 font-bold">✕</button>
                </div>
                <div className="bg-white/5 p-6 rounded-[3rem] border border-white/10 w-full flex justify-center backdrop-blur-sm">
                  <CuerpoHumano alSeleccionarMusculo={alSeleccionarMusculo} />
                </div>
                {musculoSeleccionado && (
                   <div className="mt-8 w-full p-6 bg-blue-600/20 border border-blue-500/30 rounded-3xl text-center">
                      <p className="font-black italic uppercase tracking-widest">Enfoque: {musculoSeleccionado}</p>
                   </div>
                )}
            </div>
          )}

          {/* PANTALLA HISTORIAL (GRÁFICAS) */}
          {pantalla === "historial" && (
            <div className="animate-in slide-in-from-right pb-20">
              <div className="flex justify-between items-center mb-8 px-2">
                <h2 className="text-3xl font-black italic uppercase text-orange-400 tracking-tighter">Progreso</h2>
                <button onClick={() => { setPantalla("menu"); setEjercicioGrafica(null); }} className="text-orange-400 font-bold">✕</button>
              </div>

              {!ejercicioGrafica ? (
                <div className="space-y-4">
                  {listaEjerciciosUnicos.length === 0 ? (
                    <div className="text-center py-20 border-2 border-dashed border-white/10 rounded-[3rem] opacity-50 italic">No hay datos todavía.</div>
                  ) : (
                    listaEjerciciosUnicos.map(ej => (
                      <button key={ej} onClick={() => setEjercicioGrafica(ej)} className="w-full p-6 bg-white/5 border border-white/10 rounded-3xl text-left flex justify-between items-center active:scale-95 transition-all">
                        <span className="font-black italic uppercase text-sm tracking-widest">{ej}</span>
                        <span className="text-orange-400 text-lg">→</span>
                      </button>
                    ))
                  )}
                </div>
              ) : (
                <div className="animate-in zoom-in duration-300">
                  <button onClick={() => setEjercicioGrafica(null)} className="text-orange-400 font-black text-[10px] mb-6 uppercase tracking-widest">← Volver</button>
                  <div className="bg-black/80 border border-orange-500/20 p-6 rounded-[2.5rem] backdrop-blur-xl shadow-2xl">
                    <h3 className="text-xl font-black italic text-white uppercase mb-8 text-center">{ejercicioGrafica}</h3>
                    <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={obtenerDatosGrafica(ejercicioGrafica)}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                          <XAxis dataKey="fecha" stroke="#666" fontSize={10} />
                          <YAxis stroke="#666" fontSize={10} />
                          <Tooltip contentStyle={{ backgroundColor: '#111', border: 'none', borderRadius: '15px' }} />
                          <Line type="monotone" dataKey="peso" name="Peso (kg)" stroke="#f97316" strokeWidth={4} dot={{ r: 6 }} />
                          <Line type="monotone" dataKey="reps" name="Reps" stroke="#3b82f6" strokeWidth={2} strokeDasharray="5 5" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* MODAL DETALLE GIF */}
      {ejercicioDetalle && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/95 backdrop-blur-md" onClick={() => setEjercicioDetalle(null)}></div>
          <div className="relative bg-[#0a0a0a] border border-white/10 w-full max-w-sm rounded-[3rem] p-8 animate-in zoom-in">
            <h3 className="text-2xl font-black italic text-blue-500 uppercase mb-6 text-center">{ejercicioDetalle.nombre}</h3>
            <div className="w-full aspect-square bg-white/5 rounded-[2rem] overflow-hidden mb-6 border border-white/10">
              {ejercicioDetalle.gif && <img src={ejercicioDetalle.gif} className="w-full h-full object-cover" alt="ejercicio" />}
            </div>
            <button onClick={() => setEjercicioDetalle(null)} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black uppercase text-xs">Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
}