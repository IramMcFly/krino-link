'use client';

import { useState, Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import SelectorVehiculos from './componentes/SelectorVehiculos';
import SimuladorVehiculo from './componentes/SimuladorVehiculo';
import { NavLanding } from '@/components/NavLanding';
import { vehiculosDisponibles } from './data/vehiculos';

function SimuladorContent() {
  const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState(null);
  const [moduloInicial, setModuloInicial] = useState(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const vehiculoParam = searchParams.get('vehiculo');
    const moduloParam = searchParams.get('modulo');
    
    if (vehiculoParam && vehiculosDisponibles[vehiculoParam]) {
      setVehiculoSeleccionado(vehiculosDisponibles[vehiculoParam]);
      if (moduloParam) {
        setModuloInicial(moduloParam);
      }
    }
  }, [searchParams]);

  const manejarSeleccionVehiculo = (vehiculo) => {
    setVehiculoSeleccionado(vehiculo);
    setModuloInicial(null); // Limpiar módulo inicial al seleccionar nuevo vehículo
  };

  const volverASeleccion = () => {
    setVehiculoSeleccionado(null);
    setModuloInicial(null);
    // Limpiar parámetros de URL
    window.history.pushState({}, '', '/Simulador');
  };

  return (
    <>
      {vehiculoSeleccionado ? (
        <SimuladorVehiculo 
          vehiculo={vehiculoSeleccionado} 
          onVolver={volverASeleccion}
          moduloInicial={moduloInicial}
        />
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
    </>
  );
}

export default function Simulador() {
  return (
    <div className="min-h-screen bg-[#1b1f20] text-white">
      <NavLanding />
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
        </div>
      }>
        <SimuladorContent />
      </Suspense>
    </div>
  );
}
