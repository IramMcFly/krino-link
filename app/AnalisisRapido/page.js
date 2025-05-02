'use client';

import { useEffect, useState } from 'react';
import { Loader2, AlertTriangle, ActivitySquare } from 'lucide-react';

const sistemas = ['TCM', 'ECM', 'VSA', 'ABS', 'Batería', 'ETC'];

const fallas = [
  {
    sistema: 'ABS',
    modulo: 'Sistema de frenos antibloqueo',
    codigo: 'C0035',
    descripcion: 'Sensor de velocidad de rueda frontal izquierdo defectuoso',
    color: 'bg-yellow-600',
    icono: <AlertTriangle size={20} className="text-white" />,
  },
  {
    sistema: 'ECM',
    modulo: 'Controlador del motor eléctrico',
    codigo: 'P0A1F',
    descripcion: 'Fallo en el controlador de motor eléctrico',
    color: 'bg-red-700',
    icono: <ActivitySquare size={20} className="text-white" />,
  },
];

export default function AnalisisRapido() {
  const [progreso, setProgreso] = useState(0);
  const [sistemaActual, setSistemaActual] = useState('');
  const [analisisTerminado, setAnalisisTerminado] = useState(false);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < sistemas.length) {
        setSistemaActual(sistemas[i]);
        setProgreso(Math.round(((i + 1) / sistemas.length) * 100));
        i++;
      } else {
        clearInterval(interval);
        setTimeout(() => setAnalisisTerminado(true), 1000);
      }
    }, 700);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#1b1f20] text-white px-4 py-10 flex flex-col items-center text-center">
      <h1 className="text-2xl font-bold text-[#c3151b] mb-6">Análisis Rápido</h1>

      {!analisisTerminado ? (
        <div className="w-full max-w-md bg-[#2e2e2e] p-6 rounded-xl shadow-md">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Loader2 className="animate-spin" size={24} />
            <span className="text-lg">Comunicando con {sistemaActual}...</span>
          </div>
          <div className="w-full bg-[#444] rounded-full h-4">
            <div
              className="bg-[#c3151b] h-4 rounded-full transition-all"
              style={{ width: `${progreso}%` }}
            ></div>
          </div>
          <p className="text-sm mt-3 text-gray-300">Solicitando datos del vehículo...</p>
        </div>
      ) : (
        <div className="w-full max-w-md bg-[#2e2e2e] p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4">Fallas detectadas</h2>
          {fallas.map((falla, index) => (
            <div
              key={index}
              className={`mb-4 text-left p-4 rounded-lg ${falla.color} shadow-inner`}
            >
              <div className="flex items-center gap-2 mb-1">
                {falla.icono}
                <p className="text-white font-bold">{falla.sistema} - {falla.codigo}</p>
              </div>
              <p className="text-sm text-gray-200 italic mb-1">{falla.modulo}</p>
              <p className="text-sm text-white">{falla.descripcion}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}