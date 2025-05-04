'use client';

import { useState } from 'react';
import {
  AirVent,
  AlertCircle,
  CheckCircle,
  XCircle,
  User,
  Car,
  ArrowLeftRight,
} from 'lucide-react';

const bolsas = [
  'Airbag conductor',
  'Airbag pasajero',
  'Lateral izquierdo',
  'Lateral derecho',
  'Cortina izquierda',
  'Cortina derecha',
];

export default function ModuloAirbag({ volver }) {
  const [estadoBolsas, setEstadoBolsas] = useState({});

  const detonarAirbag = (nombre) => {
    const exito = Math.random() < 0.7;
    setEstadoBolsas((prev) => ({
      ...prev,
      [nombre]: exito ? 'activo' : 'falla',
    }));
  };

  const getColor = (estado) => {
    if (estado === 'activo') return 'text-green-500';
    if (estado === 'falla') return 'text-red-500';
    return 'text-gray-500';
  };

  const getIcon = (estado) => {
    if (estado === 'activo') return <CheckCircle size={18} />;
    if (estado === 'falla') return <XCircle size={18} />;
    return <AirVent size={18} />;
  };

  const renderEstado = (nombre) => (
    <div className={`flex items-center gap-2 font-semibold ${getColor(estadoBolsas[nombre])}`}>
      {getIcon(estadoBolsas[nombre])}
      <span className="text-sm">{nombre}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#1b1f20] text-white px-4 py-6">
      <h2 className="text-2xl font-bold mb-4 text-[#c3151b]">Simulación: Sistema de Airbags</h2>
      <p className="mb-6 text-gray-300">
        Prueba de comunicación y simulación de despliegue. Algunas unidades pueden no responder.
      </p>

      {/* Esquema con íconos */}
      <div className="flex flex-col items-center mb-10 space-y-3 text-sm">
        <div className="flex items-center gap-6">
          {renderEstado('Cortina izquierda')}
          <ArrowLeftRight className="text-gray-400" />
          {renderEstado('Cortina derecha')}
        </div>
        <div className="flex items-center gap-6">
          {renderEstado('Lateral izquierdo')}
          <Car size={28} className="text-gray-300" />
          {renderEstado('Lateral derecho')}
        </div>
        <div className="flex items-center gap-6">
          {renderEstado('Airbag conductor')}
          <User size={24} className="text-white" />
          {renderEstado('Airbag pasajero')}
        </div>
      </div>

      {/* Botones de activación */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-10">
        {bolsas.map((nombre) => (
          <button
            key={nombre}
            onClick={() => detonarAirbag(nombre)}
            disabled={estadoBolsas[nombre] === 'activo'}
            className={`flex items-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all bg-[#2e2e2e] hover:bg-[#3e3e3e] ${
              estadoBolsas[nombre] === 'activo' ? 'opacity-60 cursor-not-allowed' : ''
            }`}
          >
            {getIcon(estadoBolsas[nombre])}
            {nombre}
          </button>
        ))}
      </div>

      <button onClick={volver} className="bg-gray-700 hover:bg-gray-600 px-5 py-2 rounded">
        Volver
      </button>

      {Object.values(estadoBolsas).includes('falla') && (
        <div className="mt-6 bg-yellow-800 p-4 rounded border-l-4 border-yellow-500 text-yellow-200 flex items-start gap-2">
          <AlertCircle size={20} />
          <p>
            Algunas unidades no respondieron a la simulación. Revise el sistema o intente nuevamente.
          </p>
        </div>
      )}
    </div>
  );
}
