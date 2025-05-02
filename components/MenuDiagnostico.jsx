'use client';

import { Car, Battery, GaugeCircle, Sparkles } from 'lucide-react';

const opciones = [
  { label: 'Análisis Rápido', icon: <Car size={48} /> },
  { label: 'Análisis de Batería', icon: <Battery size={48} /> },
  { label: 'Análisis de Motor', icon: <GaugeCircle size={48} /> },
  { label: 'Asistente IA', icon: <Sparkles size={48} /> },
];

export default function MenuDiagnostico() {
  return (
    <div className="min-h-screen bg-[#1b1f20] text-white px-4 py-10 text-center">
      <img src="/logo_krino.png" alt="Logo KR" className="w-24 mx-auto mb-8" />

      <div className="space-y-4 max-w-md mx-auto">
        {opciones.map((opcion, index) => (
          <div
            key={index}
            className="bg-[#c3151b] rounded-xl py-6 px-4 flex flex-col items-center justify-center text-white shadow-md"
          >
            <div className="text-black mb-2">{opcion.icon}</div>
            <span className="font-bold uppercase tracking-wide text-center">
              {opcion.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
