// Componente: Transmision.jsx
'use client';

import { useState } from 'react';
import { FaCheckCircle, FaCar } from 'react-icons/fa';

const modosTransmision = ['P', 'R', 'N', 'D', 'S', 'L'];

export default function Transmision({ volver }) {
  const [modo, setModo] = useState('P');

  const getColorForMode = (m) => {
    if (['P', 'R', 'N'].includes(m)) return 'bg-red-600';
    if (['D', 'S'].includes(m)) return 'bg-green-600';
    if (m === 'L') return 'bg-yellow-500';
    return 'bg-[#c3151b]';
  };

  return (
    <div className="min-h-screen bg-[#1b1f20] text-white px-4 py-10 flex flex-col items-center">
      <h1 className="text-2xl font-bold text-[#c3151b] mb-4">Simulación de Transmisión</h1>

      <div className="bg-[#2e2e2e] p-6 rounded-xl shadow-md w-full max-w-2xl space-y-6">
        <div>
          <label className="text-sm text-gray-300 mb-2 block">Modo de transmisión</label>
          <div className="flex justify-between items-center gap-1 bg-[#1a1a1a] p-2 rounded-lg border border-[#444]">
            {modosTransmision.map((m) => (
              <button
                key={m}
                onClick={() => setModo(m)}
                className={`w-10 h-10 rounded-md text-sm font-bold flex items-center justify-center transition-all duration-200
                  ${modo === m ? getColorForMode(m) + ' text-white' : 'bg-[#333] text-gray-300 hover:bg-[#444]'}`}
              >
                {m}
              </button>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-2 text-green-400 text-sm">
            <FaCheckCircle size={18} /> Todos los modos de transmisión responden correctamente.
          </div>
        </div>
      </div>

      <button
        onClick={volver}
        className="mt-8 bg-gray-700 hover:bg-gray-600 px-5 py-2 rounded"
      >
        Volver
      </button>
    </div>
  );
}
