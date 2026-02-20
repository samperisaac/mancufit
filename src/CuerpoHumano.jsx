import React from "react";

export default function CuerpoHumano({ onSeleccion }) {
  return (
    <div className="flex justify-center mt-4">
      <svg
        viewBox="0 0 200 500"
        className="w-64 h-auto"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Cabeza */}
        <circle
          cx="100"
          cy="45"
          r="30"
          fill="#333"
          opacity={0.5}
          onClick={() => onSeleccion("Cabeza")}
          className="hover:opacity-80 cursor-pointer transition-opacity"
        />

        {/* Torso */}
        <path
          d="M70,80 L130,80 L145,160 L135,260 L65,260 L55,160 Z"
          fill="#333"
          opacity={0.5}
          onClick={() => onSeleccion("Torso")}
          className="hover:opacity-80 cursor-pointer transition-opacity"
          stroke="#333"
          strokeWidth="1"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Brazo Izquierdo */}
        <path
          d="M60,85 L25,240 L50,245 L75,110 Z"
          fill="#333"
          opacity={0.5}
          onClick={() => onSeleccion("Brazo Izquierdo")}
          className="hover:opacity-80 cursor-pointer transition-opacity"
          stroke="#333"
          strokeWidth="1"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Brazo Derecho */}
        <path
          d="M140,85 L175,240 L150,245 L125,110 Z"
          fill="#333"
          opacity={0.5}
          onClick={() => onSeleccion("Brazo Derecho")}
          className="hover:opacity-80 cursor-pointer transition-opacity"
          stroke="#333"
          strokeWidth="1"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Pierna Izquierda */}
        <path
          d="M68,265 L60,480 L85,480 L95,265 Z"
          fill="#333"
          opacity={0.5}
          onClick={() => onSeleccion("Pierna Izquierda")}
          className="hover:opacity-80 cursor-pointer transition-opacity"
          stroke="#333"
          strokeWidth="1"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Pierna Derecha */}
        <path
          d="M132,265 L140,480 L115,480 L105,265 Z"
          fill="#333"
          opacity={0.5}
          onClick={() => onSeleccion("Pierna Derecha")}
          className="hover:opacity-80 cursor-pointer transition-opacity"
          stroke="#333"
          strokeWidth="1"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}