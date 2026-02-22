import React, { useState, useEffect } from 'react';

export default function CronometroDescanso({ tiempoInicial = 60, alTerminar }) {
  const [segundos, setSegundos] = useState(tiempoInicial);
  const [activo, setActivo] = useState(false);

  useEffect(() => {
    let intervalo = null;
    if (activo && segundos > 0) {
      intervalo = setInterval(() => setSegundos(s => s - 1), 1000);
    } else if (segundos === 0) {
      setActivo(false);
      if (alTerminar) alTerminar();
    }
    return () => clearInterval(intervalo);
  }, [activo, segundos]);

  return (
    <div className="bg-[#13131a] p-4 rounded-3xl border border-blue-500/30 flex flex-col items-center shadow-lg shadow-blue-500/10">
      <span className="text-3xl font-black text-blue-400 font-mono tracking-widest">
        00:{segundos < 10 ? `0${segundos}` : segundos}
      </span>
      <button 
        onClick={() => setActivo(!activo)}
        className="mt-2 text-[10px] font-bold text-white uppercase tracking-widest bg-blue-600 px-4 py-1 rounded-full"
      >
        {activo ? 'Pausar' : 'Iniciar Descanso'}
      </button>
    </div>
  );
}