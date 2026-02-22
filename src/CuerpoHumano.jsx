import React from 'react';

export default function CuerpoHumano({ alSeleccionarMusculo }) {
  // Coordenadas precisas para la imagen de frente y espalda combinada
  const zonas = [
    // VISTA FRENTE (Izquierda de la imagen)
    { id: 'pecho', nombre: 'Pecho', top: '23%', left: '26%' },
    { id: 'abdomen', nombre: 'Abdomen', top: '35%', left: '26%' },
    { id: 'brazos', nombre: 'Bíceps', top: '30%', left: '14%' },
    { id: 'piernas', nombre: 'Cuádriceps', top: '55%', left: '20%' },
    
    // VISTA ESPALDA (Derecha de la imagen)
    { id: 'espalda', nombre: 'Espalda', top: '25%', left: '74%' },
    { id: 'brazos', nombre: 'Tríceps', top: '30%', left: '86%' },
    { id: 'piernas', nombre: 'Isquios/Glúteo', top: '55%', left: '74%' },
  ];

  return (
    <div className="flex flex-col items-center bg-[#1e1e2e]/60 p-4 rounded-3xl border border-white/10 shadow-2xl w-full max-w-xl">
      <h3 className="text-xl font-black mb-4 text-blue-400 italic uppercase tracking-tighter">Explora tus músculos</h3>
      
      <div className="relative w-full overflow-hidden rounded-2xl border border-blue-500/30 bg-black/20">
        {/* Usamos la imagen que subiste. Asegúrate de que el nombre sea exacto en tu carpeta public */}
        <img 
          src="/image_2f06a8.jpg" 
          alt="Anatomía MancuFit"
          className="w-full h-auto object-cover opacity-90"
        />

        {/* PUNTOS DE INTERACCIÓN NEÓN */}
        {zonas.map((zona, index) => (
          <button
            key={index}
            onClick={() => alSeleccionarMusculo(zona.id)}
            style={{ top: zona.top, left: zona.left }}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 group z-10"
          >
            {/* El "Aura" del punto */}
            <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center border border-blue-400/50 group-hover:scale-150 transition-all duration-300">
               {/* El núcleo brillante */}
               <div className="w-2.5 h-2.5 bg-blue-400 rounded-full animate-pulse shadow-[0_0_15px_#60a5fa]"></div>
            </div>
            
            {/* Etiqueta flotante mejorada */}
            <span className="absolute top-8 left-1/2 -translate-x-1/2 text-[10px] font-black text-white bg-blue-600 px-2 py-0.5 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity uppercase italic whitespace-nowrap">
              {zona.nombre}
            </span>
          </button>
        ))}
      </div>
      
      <p className="mt-4 text-[10px] text-gray-400 uppercase tracking-[0.2em] font-bold">
        Selecciona una zona para entrenar
      </p>
    </div>
  );
}