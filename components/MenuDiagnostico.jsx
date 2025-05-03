'use client';

import {
  Car,
  BatteryFull,
  GaugeCircle,
  Sparkles,
  Info,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const opciones = [
  { label: 'Análisis Rápido', icon: Car, route: '/AnalisisRapido' },
  { label: 'Análisis de Batería', icon: BatteryFull, route: '/AnalisisBateria' }, // <- agregado aquí
  { label: 'Análisis de Motor', icon: GaugeCircle, route: '/AnalisisMotor'},
  { label: 'Asist IA', icon: Sparkles },
];

const vehiculo = {
  nombre: 'BYD Dolphin Mini',
  numeroSerie: '3N1AB7AP8GY256791',
  bateria: '78%',
};

export default function MenuDiagnostico() {
  const router = useRouter();
  const [transicion, setTransicion] = useState(false);

  const handleClick = (label) => {
    const opcion = opciones.find((op) => op.label === label);
    if (opcion?.route) {
      setTransicion(true);
      setTimeout(() => {
        router.push(opcion.route);
      }, 1200);
    }
  };

  return (
    <div className="min-h-screen bg-[#1b1f20] text-white px-4 py-6 flex flex-col items-center relative overflow-hidden">
      {/* Transición animada */}
      {transicion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1b1f20] animate-fadeIn">
          <div className="text-center">
            <span className="text-white text-lg mb-4 block">Iniciando análisis...</span>
            <div className="w-48 h-2 bg-gray-700 rounded-full overflow-hidden mx-auto">
              <div className="h-full w-full bg-[#c3151b] animate-pulse"></div>
            </div>
          </div>
        </div>
      )}

      {/* Logo */}
      <img src="images/logoKR.png" alt="Logo KR" className="w-20 md:w-24 mb-4 z-10" />

      {/* Panel de información */}
      <div className="bg-[#c3c3c3] text-black rounded-xl p-4 mb-6 w-full max-w-md sm:max-w-lg shadow-md z-10">
        <div className="flex flex-col gap-2 sm:gap-4 text-sm sm:text-base">
          <div className="flex items-center gap-2 overflow-hidden">
            <Info size={18} />
            <span className="font-semibold whitespace-nowrap">Conectado a:</span>
            <span className="truncate">{vehiculo.nombre}</span>
          </div>
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="font-semibold whitespace-nowrap">SN:</span>
            <span className="truncate">{vehiculo.numeroSerie}</span>
          </div>
          <div className="flex items-center gap-2 overflow-hidden">
            <BatteryFull size={18} />
            <span className="font-semibold whitespace-nowrap">Batería:</span>
            <span className="truncate">{vehiculo.bateria}</span>
          </div>
        </div>
      </div>

      {/* Menú diagnóstico */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-xs sm:max-w-2xl md:max-w-3xl px-2 md:px-4 z-10">
        {opciones.map((opcion, index) => {
          const Icon = opcion.icon;
          return (
            <div
              key={index}
              onClick={() => handleClick(opcion.label)}
              className="bg-[#c3151b] rounded-xl py-5 px-4 flex flex-col items-center justify-center text-white shadow-md hover:scale-[1.02] transition-transform cursor-pointer"
            >
              <Icon size={42} className="text-white mb-2" />
              <span className="font-bold uppercase tracking-wide text-center text-sm md:text-base">
                {opcion.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
