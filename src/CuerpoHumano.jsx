import React, { useState } from 'react';

export default function CuerpoHumano({ alSeleccionarMusculo }) {
  // Lista de zonas clicables
  const zonas = [
    { id: 'pecho', nombre: 'Pecho', cx: "50", cy: "30", r: "8" },
    { id: 'espalda', nombre: 'Espalda', cx: "50", cy: "40", r: "8" },
    { id: 'brazos', nombre: 'Brazos', cx: "30", cy: "35", r: "6" },
    { id: 'abdomen', nombre: 'Abdomen', cx: "50", cy: "50", r: "7" },
    { id: 'piernas', nombre: 'Piernas', cx: "45", cy: "75", r: "10" },
  ];

  return (
    <div className="flex flex-col items-center bg-black/20 p-6 rounded-3xl border border-white/10">
      <h3 className="text-xl font-bold mb-4 text-blue-400 italic">SELECCIONA UN MÚSCULO</h3>
      
      <div className="relative">
        <svg viewBox="0 0 100 150" className="w-64 h-auto fill-gray-800">
          {/* Silueta Humana Básica */}
          <path d="M50,10 L55,15 L55,25 L45,25 L45,15 Z" fill="#444" /> {/* Cabeza */}
          <path d="M35,25 L65,25 L70,60 L30,60 Z" fill="#333" /> {/* Torso */}
          <path d="M30,25 L20,60 M70,25 L80,60" stroke="#333" strokeWidth="8" /> {/* Brazos */}
          <path d="M35,60 L45,140 M65,60 L55,140" stroke="#333" strokeWidth="12" /> {/* Piernas */}

          {/* Puntos Interactivos (Zonas) */}
          {zonas.map((zona) => (
            <circle
              key={zona.id}
              cx={zona.cx}
              cy={zona.cy}
              r={zona.r}
              className="fill-blue-500/40 stroke-blue-400 cursor-pointer hover:fill-blue-400 transition-all"
              onClick={() => alSeleccionarMusculo(zona.id)}
            />
          ))}
        </svg>
        
        {/* Etiquetas flotantes para ayudar al usuario */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
            <span className="absolute top-[28%] left-[45%] text-[10px] font-bold">PECHO</span>
            <span className="absolute top-[48%] left-[42%] text-[10px] font-bold">ABDOMEN</span>
            <span className="absolute top-[32%] left-[15%] text-[10px] font-bold">BRAZOS</span>
            <span className="absolute top-[72%] left-[40%] text-[10px] font-bold">PIERNAS</span>
        </div>
      </div>
      
      <p className="mt-4 text-xs text-gray-500 italic">Toca los puntos azules para ver ejercicios</p>
    </div>
  );
}