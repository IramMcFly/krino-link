'use client';

import { useState, Suspense, lazy } from 'react';
import Image from 'next/image';
import SelectorVehiculos from './componentes/SelectorVehiculos';
import SimuladorVehiculo from './componentes/SimuladorVehiculo';
import NavegadorModulos from './componentes/NavegadorModulos';
import InformacionVehiculo from './componentes/InformacionVehiculo';
import MotorCombustion from './componentes/MotorCombustion';
import MotorElectrico from './componentes/MotorElectrico';
import GestionBateria from './componentes/GestionBateria';

export default function Simulador() {
  const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState(null);
  const [moduloActivo, setModuloActivo] = useState('selector');

  const manejarSeleccionVehiculo = (vehiculo) => {
    setVehiculoSeleccionado(vehiculo);
    setModuloActivo('informacion'); // Mostrar información del vehículo al seleccionar
  };

  const volverASeleccion = () => {
    setVehiculoSeleccionado(null);
    setModuloActivo('selector');
  };

  const cambiarModulo = (modulo) => {
    if (modulo === 'selector') {
      volverASeleccion();
    } else {
      setModuloActivo(modulo);
    }
  };

  const renderizarModulo = () => {
    switch (moduloActivo) {
      case 'informacion':
        return <InformacionVehiculo vehiculo={vehiculoSeleccionado} />;
      case 'combustion':
        return <MotorCombustion isActive={true} vehiculo={vehiculoSeleccionado} />;
      case 'electrico':
        return <MotorElectrico isActive={true} vehiculo={vehiculoSeleccionado} />;
      case 'bateria':
        return <GestionBateria isActive={true} vehiculo={vehiculoSeleccionado} />;
      default:
        return (
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
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#1b1f20] text-white">
      {vehiculoSeleccionado && (
        <NavegadorModulos
          moduloActivo={moduloActivo}
          cambiarModulo={cambiarModulo}
          vehiculo={vehiculoSeleccionado}
          onVolver={volverASeleccion}
        />
      )}
      
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
        </div>
      }>
        {renderizarModulo()}
      </Suspense>
    </div>
  );
}
