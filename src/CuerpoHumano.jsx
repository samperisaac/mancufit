import React, { useState } from 'react';

export default function CuerpoHumano({ alSeleccionarMusculo }) {
  // Estado para alternar entre vista frontal y trasera
  const [vistaActiva, setVistaActiva] = useState('frontal');

  // Coordenadas ajustadas para figuras centradas (humano_delante.png)
  const zonasFrontal = [
    { id: 'pecho', nombre: 'Pecho', top: '25%', left: '50%' },
    { id: 'abdomen', nombre: 'Abdomen', top: '42%', left: '50%' },
    { id: 'brazos', nombre: 'Bíceps', top: '33%', left: '32%' }, // Brazo derecho del modelo
    { id: 'piernas', nombre: 'Cuádriceps', top: '65%', left: '42%' }, // Pierna derecha del modelo
  ];

  // Coordenadas ajustadas para figuras centradas (humano_detras.png)
  const zonasTrasera = [
    { id: 'espalda', nombre: 'Espalda', top: '28%', left: '50%' },
    { id: 'brazos', nombre: 'Tríceps', top: '33%', left: '68%' }, // Brazo izquierdo del modelo
    { id: 'piernas', nombre: 'Glúteo', top: '52%', left: '50%' },
    { id: 'gemelos', nombre: 'Gemelos', top: '82%', left: '44%' }, // Pantorrilla derecha del modelo
  ];

  const zonasActuales = vistaActiva === 'frontal' ? zonasFrontal : zonasTrasera;
  const imagenActual = vistaActiva === 'frontal' ? '/humano_delante.png' : '/humano_detras.png';

  return (
    <div className="flex flex-col items-center w-full animate-in fade-in duration-500">
      
      {/* SELECTOR DE VISTA (Frontal/Trasera) */}
      <div className="flex bg-[#13131a] p-1.5 rounded-full border border-white/10 mb-8 shadow-2xl">
        <button
          onClick={() => setVistaActiva('frontal')}
          className={`px-8 py-2.5 rounded-full text-xs font-black uppercase italic tracking-widest transition-all duration-300 ${
            vistaActiva === 'frontal' 
            ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)]' 
            : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          Frontal
        </button>
        <button
          onClick={() => setVistaActiva('trasera')}
          className={`px-8 py-2.5 rounded-full text-xs font-black uppercase italic tracking-widest transition-all duration-300 ${
            vistaActiva === 'trasera' 
            ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)]' 
            : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          Trasera
        </button>
      </div>

      {/* CONTENEDOR DE ANATOMÍA "EXTRA GRANDE" */}
      <div className="relative w-full max-w-4xl flex justify-center items-center overflow-visible">
        
        {/* IMAGEN PRINCIPAL */}
        <img 
          key={imagenActual}
          src={imagenActual} 
          alt="Anatomía"
          className="h-[85vh] w-auto object-contain animate-in zoom-in-95 duration-700 drop-shadow-[0_0_30px_rgba(59,130,246,0.1)]"
        />

        {/* PUNTOS DE INTERACCIÓN (MAPA) */}
        {zonasActuales.map((zona) => (
          <button
            key={zona.id + vistaActiva}
            onClick={() => alSeleccionarMusculo(zona.id)}
            style={{ top: zona.top, left: zona.left }}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
          >
            {/* Efecto de Pulso Neón */}
            <div className="relative w-12 h-12 flex items-center justify-center">
              <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-ping"></div>
              <div className="w-8 h-8 bg-[#0d0d12]/80 backdrop-blur-md rounded-full border-2 border-blue-400 shadow-[0_0_15px_#3b82f6] flex items-center justify-center group-hover:scale-125 group-hover:bg-blue-500 group-hover:border-white transition-all duration-300">
                <div className="w-2 h-2 bg-white rounded-full shadow-[0_0_8px_white]"></div>
              </div>
            </div>

            {/* Tooltip con nombre del músculo */}
            <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-blue-600 text-white text-[10px] font-black uppercase italic rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-xl pointer-events-none whitespace-nowrap">
              {zona.nombre}
            </span>
          </button>
        ))}
      </div>

      <p className="mt-4 text-[10px] text-slate-500 font-bold uppercase tracking-[0.4em] opacity-40">
        Touch to select muscle
      </p>
    </div>
  );
}