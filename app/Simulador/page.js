'use client';

import { useState, Suspense } from 'react';
import Image from 'next/image';
import SelectorVehiculos from './componentes/SelectorVehiculos';
import SimuladorVehiculo from './componentes/SimuladorVehiculo';
import { NavLanding } from '@/components/NavLanding';

export default function Simulador() {
  const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState(null);

  const manejarSeleccionVehiculo = (vehiculo) => {
    setVehiculoSeleccionado(vehiculo);
  };

  const volverASeleccion = () => {
    setVehiculoSeleccionado(null);
  };

  return (
    <div className="min-h-screen bg-[#1b1f20] text-white">
      <NavLanding />
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
        </div>
      }>
        {vehiculoSeleccionado ? (
          <SimuladorVehiculo vehiculo={vehiculoSeleccionado} onVolver={volverASeleccion} />
        ) : (
          <div className="px-4 py-6 flex flex-col items-center">
            <Image 
              src="/images/logoKR.png" 
              alt="Logo KR" 
              width={96} 
              height={96} 
              className="w-20 md:w-24 mb-6 z-10" 
              priority 
            />
            
            <div className="w-full max-w-6xl">
              <SelectorVehiculos onVehiculoSeleccionado={manejarSeleccionVehiculo} />
            </div>
          </div>
        )}
      </Suspense>
    </div>
  );
}
