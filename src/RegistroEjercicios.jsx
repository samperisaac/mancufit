import React, { useState, useEffect } from 'react';

export default function RegistroEjercicios({ musculo }) {
  const [ejercicio, setEjercicio] = useState('');
  const [registro, setRegistro] = useState({});

  // Guardar en localStorage para que persista al recargar
  useEffect(() => {
    const data = localStorage.getItem('registroEjercicios');
    if (data) setRegistro(JSON.parse(data));
  }, []);

  useEffect(() => {
    localStorage.setItem('registroEjercicios', JSON.stringify(registro));
  }, [registro]);

  const handleAgregar = () => {
    if (!musculo) return alert('Selecciona un músculo primero');
    if (!ejercicio.trim()) return;
    
    setRegistro(prev => ({
      ...prev,
      [musculo]: [...(prev[musculo] || []), ejercicio.trim()]
    }));
    setEjercicio('');
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">
        {musculo ? `Ejercicios para ${musculo}` : 'Selecciona un músculo'}
      </h2>

      {musculo && (
        <div className="flex mb-2 gap-2">
          <input
            type="text"
            placeholder="Nuevo ejercicio"
            value={ejercicio}
            onChange={e => setEjercicio(e.target.value)}
            className="flex-1 border rounded px-2 py-1"
          />
          <button
            onClick={handleAgregar}
            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
          >
            Agregar
          </button>
        </div>
      )}

      {musculo && registro[musculo]?.length > 0 && (
        <ul className="list-disc pl-5 mt-2">
          {registro[musculo].map((ej, idx) => (
            <li key={idx}>{ej}</li>
          ))}
        </ul>
      )}
    </div>
  );
}