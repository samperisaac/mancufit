import React, { useState } from "react";
import CuerpoHumano from "./CuerpoHumano";

export default function App() {
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [selectedMuscle, setSelectedMuscle] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#00008A] to-black text-white flex flex-col items-center p-6">
      <h1 className="text-4xl font-bold mb-6 drop-shadow-lg">MancuFit</h1>

      {/* Menú */}
      <div className="flex gap-4 mb-6">
        {["registro", "musculos"].map((menu) => (
          <button
            key={menu}
            className={`
              bg-gradient-to-b from-gray-700 to-black text-white
              rounded-xl px-6 py-3 shadow-lg
              transform transition-all duration-300
              hover:scale-105 hover:shadow-2xl
              ${selectedMenu === menu ? "ring-2 ring-blue-500" : ""}
            `}
            onClick={() => {
              setSelectedMenu(menu);
              setSelectedMuscle(null); // reset músculo al cambiar menú
            }}
          >
            {menu === "registro" ? "Registro de ejercicios" : "Cuerpo humano"}
          </button>
        ))}
      </div>

      {/* Contenido según menú */}
      {selectedMenu === "registro" && (
        <div className="w-full max-w-md p-6 bg-black/30 rounded-xl shadow-inner animate-fadeIn">
          <p>Aquí puedes anotar tus ejercicios y pesos.</p>
        </div>
      )}

      {selectedMenu === "musculos" && (
        <div className="w-full max-w-md p-6 bg-black/30 rounded-xl shadow-inner animate-fadeIn flex flex-col items-center">
          <p className="mb-4 text-center">Selecciona un músculo haciendo click en el cuerpo:</p>
          
          <CuerpoHumano
            onSelectMuscle={(muscle) => setSelectedMuscle(muscle)}
          />

          {selectedMuscle && (
            <p className="mt-4 font-semibold text-lg animate-pulse">
              Has seleccionado: {selectedMuscle}
            </p>
          )}
        </div>
      )}
    </div>
  );
}