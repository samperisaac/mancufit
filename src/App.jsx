import React, { useState, useEffect } from 'react';
import CuerpoHumano from './components/CuerpoHumano';
import { ejerciciosDB } from './data/ejercicios';

export default function App() {
  const [pantalla, setPantalla] = useState('menu');
  const [rutina, setRutina] = useState(null);
  const [musculoSeleccionado, setMusculoSeleccionado] = useState(null);

  // 1. BLOQUEO DE GESTO "ATRÁS" Y NAVEGACIÓN
  useEffect(() => {
    window.history.pushState(null, "", window.location.href);
    const handlePopState = () => {
      window.history.pushState(null, "", window.location.href);
      // Opcional: si quieres que el botón atrás siempre te lleve al menú:
      // setPantalla('menu');
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // 2. CARGAR RUTINA GUARDADA
  useEffect(() => {
    const guardada = localStorage.getItem('mancufit_rutina');
    if (guardada) setRutina(JSON.parse(guardada));
  }, []);

  // 3. GUARDAR AUTOMÁTICAMENTE CUANDO CAMBIE LA RUTINA
  useEffect(() => {
    if (rutina) {
      localStorage.setItem('mancufit_rutina', JSON.stringify(rutina));
    }
  }, [rutina]);

  const actualizarDato = (dia, ejId, campo, valor) => {
    const nuevaRutina = { ...rutina };
    nuevaRutina[dia] = nuevaRutina[dia].map(ej => 
      ej.id === ejId ? { ...ej, [campo]: valor } : ej
    );
    setRutina(nuevaRutina);
  };

  const agregarEjercicio = (ejercicio) => {
    const dia = "Mi Rutina"; // Puedes ampliar esto a Lunes, Martes, etc.
    const nuevaRutina = { ...rutina } || { "Mi Rutina": [] };
    if (!nuevaRutina[dia]) nuevaRutina[dia] = [];
    
    const nuevo = {
      ...ejercicio,
      id: Date.now(), // ID único
      series: "4",
      reps: "12",
      peso: "0"
    };

    nuevaRutina[dia].push(nuevo);
    setRutina(nuevaRutina);
    setPantalla('rutina');
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-blue-500/30">
      
      {/* PANTALLA: MENÚ PRINCIPAL */}
      {pantalla === 'menu' && (
        <div className="p-6 flex flex-col items-center justify-center min-h-screen">
          <h1 className="text-5xl font-black italic tracking-tighter mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-700">
            MANCUFIT
          </h1>
          <p className="text-slate-500 text-xs font-bold tracking-[0.3em] mb-12 uppercase">Ultimate Training</p>
          
          <div className="grid gap-4 w-full max-w-xs">
            <button 
              onClick={() => setPantalla('anatomia')}
              className="bg-[#111] border border-white/5 p-6 rounded-2xl hover:border-blue-500/50 transition-all group"
            >
              <span className="block text-2xl mb-1">👤</span>
              <span className="font-black italic uppercase text-sm group-hover:text-blue-400">Nueva Rutina</span>
            </button>

            <button 
              onClick={() => setPantalla('rutina')}
              className="bg-blue-600 p-6 rounded-2xl shadow-[0_10px_30px_rgba(37,99,235,0.3)] hover:scale-105 transition-all"
            >
              <span className="block text-2xl mb-1">🏋️‍♂️</span>
              <span className="font-black italic uppercase text-sm">Ver Mi Entreno</span>
            </button>
          </div>
        </div>
      )}

      {/* PANTALLA: ANATOMÍA */}
      {pantalla === 'anatomia' && (
        <div className="p-6">
          <button onClick={() => setPantalla('menu')} className="mb-8 text-slate-500 font-bold uppercase text-[10px] tracking-widest">← Volver</button>
          <CuerpoHumano alSeleccionarMusculo={(m) => {
            setMusculoSeleccionado(m);
            setPantalla('selector');
          }} />
        </div>
      )}

      {/* PANTALLA: SELECTOR DE EJERCICIOS */}
      {pantalla === 'selector' && (
        <div className="p-6">
          <button onClick={() => setPantalla('anatomia')} className="mb-6 text-slate-500 font-bold uppercase text-[10px] tracking-widest">← Anatomía</button>
          <h2 className="text-3xl font-black italic uppercase mb-8">{musculoSeleccionado}</h2>
          <div className="grid gap-3">
            {ejerciciosDB
              .filter(e => e.categoria.toLowerCase() === musculoSeleccionado.toLowerCase())
              .map(ej => (
                <button 
                  key={ej.nombre}
                  onClick={() => agregarEjercicio(ej)}
                  className="bg-[#111] p-5 rounded-2xl border border-white/5 flex justify-between items-center hover:border-blue-500"
                >
                  <span className="font-bold uppercase text-sm italic">{ej.nombre}</span>
                  <span className="text-blue-500 font-black">+</span>
                </button>
              ))}
          </div>
        </div>
      )}

      {/* PANTALLA: RUTINA (EDITABLE) */}
      {pantalla === 'rutina' && (
        <div className="p-6 pb-24">
          <button onClick={() => setPantalla('menu')} className="mb-8 text-slate-500 font-bold uppercase text-[10px] tracking-widest">← Menú</button>
          <h2 className="text-4xl font-black italic uppercase mb-8 tracking-tighter">Mi Entreno</h2>
          
          {rutina && Object.entries(rutina).map(([dia, ejercicios]) => (
            <div key={dia} className="mb-10">
              <div className="grid gap-6">
                {ejercicios.map(ej => (
                  <div key={ej.id} className="bg-[#111] rounded-3xl p-5 border border-white/5">
                    <h3 className="text-lg font-black italic uppercase mb-4 text-blue-400">{ej.nombre}</h3>
                    
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-black/40 p-3 rounded-2xl text-center">
                        <p className="text-[8px] text-slate-500 font-black uppercase mb-1">Series</p>
                        <input 
                          type="number"
                          value={ej.series}
                          onChange={(e) => actualizarDato(dia, ej.id, 'series', e.target.value)}
                          className="bg-transparent w-full text-center font-bold text-white focus:outline-none"
                        />
                      </div>
                      <div className="bg-black/40 p-3 rounded-2xl text-center">
                        <p className="text-[8px] text-slate-500 font-black uppercase mb-1">Reps</p>
                        <input 
                          type="number"
                          value={ej.reps}
                          onChange={(e) => actualizarDato(dia, ej.id, 'reps', e.target.value)}
                          className="bg-transparent w-full text-center font-bold text-white focus:outline-none"
                        />
                      </div>
                      <div className="bg-blue-600/20 p-3 rounded-2xl text-center border border-blue-500/20">
                        <p className="text-[8px] text-blue-400 font-black uppercase mb-1">Peso KG</p>
                        <input 
                          type="number"
                          value={ej.peso}
                          onChange={(e) => actualizarDato(dia, ej.id, 'peso', e.target.value)}
                          className="bg-transparent w-full text-center font-bold text-blue-400 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {!rutina && <p className="text-slate-500 italic">No hay ejercicios aún. ¡Ve a la anatomía!</p>}

          <button 
            onClick={() => { if(confirm('¿Borrar toda la rutina?')) { localStorage.clear(); setRutina(null); }}}
            className="mt-10 text-[10px] text-red-500/50 font-black uppercase tracking-widest w-full text-center"
          >
            Resetear Rutina
          </button>
        </div>
      )}

    </div>
  );
}