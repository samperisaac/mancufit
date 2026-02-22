import React, { useState } from 'react';

export default function CuerpoHumano({ alSeleccionarMusculo }) {
  const [vistaActiva, setVistaActiva] = useState('frontal');

  // COORDENADAS PRECISAS PARA TUS IMÁGENES RECORTADAS
  const zonasFrontal = [
    { id: 'pecho', nombre: 'PECHO', top: '25%', left: '40%', side: 'left' },
    { id: 'brazos', nombre: 'BÍCEPS', top: '30%', left: '72%', side: 'right' },
    { id: 'abdomen', nombre: 'ABDOMEN', top: '40%', left: '50%', side: 'center' },
    { id: 'piernas', nombre: 'CUÁDRICEPS', top: '55%', left: '43%', side: 'center' },
  ];

  const zonasTrasera = [
    { id: 'espalda', nombre: 'ESPALDA', top: '22%', left: '40%', side: 'left' },
    { id: 'gemelos', nombre: 'GEMELOS', top: '80%', left: '65%', side: 'right' },
    { id: 'piernas', nombre: 'GLÚTEO', top: '50%', left: '55%', side: 'center' },
    { id: 'brazos', nombre: 'TRÍCEPS', top: '30%', left: '70%', side: 'center' },
    { id: 'piernas', nombre: 'CUÁDRICEPS', top: '62%', left: '40%', side: 'center' },
  ];

  const zonasActuales = vistaActiva === 'frontal' ? zonasFrontal : zonasTrasera;
  const imagenActual = vistaActiva === 'frontal' ? '/humano_delante.png' : '/humano_detras.png';

  return (
    <div className="flex flex-col items-center w-full animate-in fade-in duration-500">
      
      {/* SELECTOR DE VISTA */}
      <div className="flex bg-[#13131a] p-1.5 rounded-full border border-white/10 mb-8 shadow-2xl">
        <button
          onClick={() => setVistaActiva('frontal')}
          className={`px-8 py-2 rounded-full text-xs font-black uppercase italic transition-all duration-300 ${
            vistaActiva === 'frontal' ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]' : 'text-slate-500 hover:text-white'
          }`}
        >
          Frontal
        </button>
        <button
          onClick={() => setVistaActiva('trasera')}
          className={`px-8 py-2 rounded-full text-xs font-black uppercase italic transition-all duration-300 ${
            vistaActiva === 'trasera' ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]' : 'text-slate-500 hover:text-white'
          }`}
        >
          Trasera
        </button>
      </div>

      {/* CONTENEDOR DE IMAGEN Y PUNTOS */}
      <div className="relative w-full max-w-sm mx-auto">
        <img 
          key={imagenActual}
          src={imagenActual} 
          alt="Anatomía"
          className="w-full h-auto object-contain drop-shadow-[0_0_20px_rgba(59,130,246,0.15)]"
        />

        {/* MAPEO DE PUNTOS Y NOMBRES */}
        {zonasActuales.map((zona) => (
          <div
            key={zona.id + vistaActiva + zona.nombre}
            style={{ top: zona.top, left: zona.left }}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 flex items-center group pointer-events-none"
          >
            {/* Etiqueta Izquierda */}
            {zona.side === 'left' && (
              <span className="mr-3 text-[11px] font-black text-white italic tracking-tighter drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                {zona.nombre}
              </span>
            )}

            {/* Punto interactivo */}
            <button
              onClick={() => alSeleccionarMusculo(zona.id)}
              className="pointer-events-auto relative w-8 h-8 flex items-center justify-center"
            >
              <div className="absolute inset-0 bg-blue-500/30 rounded-full animate-ping opacity-75"></div>
              <div className="w-5 h-5 bg-[#0d0d12] border-2 border-blue-400 rounded-full shadow-[0_0_10px_#3b82f6] flex items-center justify-center group-hover:scale-125 transition-transform duration-300">
                <div className="w-1 h-1 bg-white rounded-full"></div>
              </div>
            </button>

            {/* Etiqueta Derecha */}
            {zona.side === 'right' && (
              <span className="ml-3 text-[11px] font-black text-white italic tracking-tighter drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                {zona.nombre}
              </span>
            )}
            
            {/* Etiqueta Central (Abajo) */}
            {zona.side === 'center' && (
              <span className="absolute top-7 left-1/2 -translate-x-1/2 text-[11px] font-black text-white italic tracking-tighter drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                {zona.nombre}
              </span>
            )}
          </div>
        ))}
      </div>

      <p className="mt-10 text-[9px] text-slate-500 font-bold uppercase tracking-[0.4em] opacity-40">
        SELECCIONA UNA ZONA MUSCULAR
      </p>
    </div>
  );
}