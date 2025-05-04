'use client';

export default function Enfriamiento({ volver }) {
  return (
    <div className="text-white p-6">
      <h2 className="text-2xl font-bold mb-4 text-[#c3151b]">Simulación: Sistema de Enfriamiento</h2>
      <p className="mb-4">Monitorea ventiladores, termostato y temperatura en tiempo real del motor.</p>
      <button onClick={volver} className="bg-gray-700 hover:bg-gray-600 px-5 py-2 rounded">Volver</button>
    </div>
  );
}