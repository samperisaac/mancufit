import React, { useState } from 'react';
import CuerpoHumano from './CuerpoHumano';
import RegistroEjercicios from './RegistroEjercicios';

export default function App() {
  const [pantalla, setPantalla] = useState(null); // null, 'registro' o 'cuerpo'
  const [musculo, setMusculo] = useState(null);

  if (!pantalla) {
    // Menú principal
    return (
      <div className="p-4 max-w-md mx-auto text-center">
        <h1 className="text-2xl font-bold mb-6">MancuFit</h1>
      <button
        className="
                bg-gradient-to-b from-gray-500 to-black 
    text-white 
    px-6 py-3 
    rounded-xl 
    m-2 
    font-bold 
    shadow-lg 
    transform 
    hover:-translate-y-1 hover:scale-105 
    transition-all duration-300
  "
  onClick={() => setPantalla('registro')}
>
  Registro de ejercicios
</button>

<button
  className="
    bg-gradient-to-b from-gray-500 to-black 
    text-white 
    px-6 py-3 
    rounded-xl 
    m-2 
    font-bold 
    shadow-lg 
    transform 
    hover:-translate-y-1 hover:scale-105 
    transition-all duration-300
  "
  onClick={() => setPantalla('cuerpo')}
>
  Seleccionar músculo
</button>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <button
        className="text-gray-500 underline mb-4"
        onClick={() => setPantalla(null)}
      >
        Volver al menú
      </button>

      {pantalla === 'registro' && <RegistroEjercicios musculo={musculo} />}
      {pantalla === 'cuerpo' && <CuerpoHumano onSeleccion={setMusculo} />}
    </div>
  );
}