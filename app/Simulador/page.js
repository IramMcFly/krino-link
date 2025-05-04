'use client';

import { useState, Suspense, lazy } from 'react';
import MenuGeneral from './componentes/MenuGeneral';
import { Info, BatteryFull } from 'lucide-react';

const vehiculo = {
  nombre: 'BYD Dolphin Mini',
  numeroSerie: '3N1AB7AP8GY256791',
  bateria: '78%',
};

export default function Simulador() {
  const [moduloActivo, setModuloActivo] = useState(null);
  const ModuloDinamico = moduloActivo ? lazy(() => import(`./componentes/${moduloActivo}`)) : null;

  return (
    <div className="min-h-screen bg-[#1b1f20] text-white px-4 py-6 flex flex-col items-center relative overflow-hidden">
      <img src="images/logoKR.png" alt="Logo KR" className="w-20 md:w-24 mb-4 z-10" />

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

      <div className="w-full max-w-5xl">
        {!moduloActivo ? (
          <MenuGeneral seleccionarModulo={setModuloActivo} />
        ) : (
          <Suspense fallback={<p className="text-white">Cargando módulo...</p>}>
            <ModuloDinamico volver={() => setModuloActivo(null)} />
          </Suspense>
        )}
      </div>
    </div>
  );
}
