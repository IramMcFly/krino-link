'use client';

import { useState, lazy, Suspense } from 'react';
import Image from 'next/image';
import { FaInfoCircle, FaBatteryFull, FaArrowLeft, FaGasPump, FaOilCan, FaCar } from 'react-icons/fa';

// Importación dinámica de menús específicos por tipo de vehículo
const MenuElectrico = lazy(() => import('./menus/MenuElectrico'));
const MenuHibrido = lazy(() => import('./menus/MenuHibrido'));
const MenuDiesel = lazy(() => import('./menus/MenuDiesel'));

// Importación dinámica de componentes de diagnóstico existentes
const ModuloABS = lazy(() => import('./ModuloABS'));
const ModuloAirbag = lazy(() => import('./ModuloAirbag'));
const ModuloECUReset = lazy(() => import('./ModuloECUReset'));
const Climatizacion = lazy(() => import('./Climatizacion'));
const SistemaElectrico = lazy(() => import('./SistemaElectrico'));
const Transmision = lazy(() => import('./Transmision'));
const Enfriamiento = lazy(() => import('./Enfriamiento'));
const OtrosSistemas = lazy(() => import('./OtrosSistemas'));

export default function SimuladorVehiculo({ vehiculo, onVolver }) {
  const [moduloActivo, setModuloActivo] = useState(null);

  const seleccionarModulo = (archivo) => {
    setModuloActivo(archivo);
  };

  const volverAlMenu = () => {
    setModuloActivo(null);
  };

  // Renderizar el menú específico según el tipo de vehículo
  const renderizarMenu = () => {
    switch(vehiculo.tipo) {
      case 'electrico':
        return <MenuElectrico vehiculo={vehiculo} seleccionarModulo={seleccionarModulo} />;
      case 'hibrido':
        return <MenuHibrido vehiculo={vehiculo} seleccionarModulo={seleccionarModulo} />;
      case 'diesel':
        return <MenuDiesel vehiculo={vehiculo} seleccionarModulo={seleccionarModulo} />;
      default:
        return <div className="text-center py-8">Tipo de vehículo no soportado</div>;
    }
  };

  // Renderizar módulo específico
  const renderizarModulo = () => {
    // Mapeo de módulos existentes y nuevos
    const componenteMap = {
      // Módulos existentes reutilizables
      'ModuloABS': ModuloABS,
      'ModuloAirbag': ModuloAirbag,
      'ModuloECUReset': ModuloECUReset,
      'Climatizacion': Climatizacion,
      'SistemaElectrico': SistemaElectrico,
      'Transmision': Transmision,
      'Enfriamiento': Enfriamiento,
      'OtrosSistemas': OtrosSistemas,
      
      // Módulos específicos por tipo de vehículo (por desarrollar)
      // Eléctricos
      'GestionBateria': null,
      'MotorElectrico': null,
      'SistemaCarga': null,
      'Inversor': null,
      'ConvertidorDC': null,
      
      // Híbridos
      'MotorCombustion': null,
      'MotorElectricoIMA': null,
      'BateriaHibrida': null,
      'SistemaCVT': null,
      'ControlHibrido': null,
      'SistemaCombustible': null,
      
      // Diésel
      'MotorTDI': null,
      'SistemaCombustibleDiesel': null,
      'Turbocompresor': null,
      'SistemaEscape': null,
      'SistemaAceite': null,
    };

    const ComponenteSeleccionado = componenteMap[moduloActivo];
    
    if (ComponenteSeleccionado) {
      return <ComponenteSeleccionado volver={volverAlMenu} />;
    } else if (componenteMap.hasOwnProperty(moduloActivo)) {
      // Módulo existe pero no está implementado
      return (
        <div className="text-center py-12 bg-[#2a2a2a] rounded-xl">
          <h2 className="text-2xl font-bold mb-4">Módulo en Desarrollo</h2>
          <p className="text-gray-400 mb-6">El módulo "{moduloActivo}" está siendo desarrollado.</p>
          <div className="bg-[#3a3a3a] p-6 rounded-lg max-w-md mx-auto">
            <h3 className="font-semibold mb-2">Características planificadas:</h3>
            <ul className="text-sm text-gray-300 space-y-1 text-left">
              <li>• Diagnóstico en tiempo real</li>
              <li>• Lectura de códigos DTC específicos</li>
              <li>• Gráficos de parámetros</li>
              <li>• Simulación de fallos</li>
            </ul>
          </div>
        </div>
      );
    } else {
      return (
        <div className="text-center py-8 bg-[#2a2a2a] rounded-xl">
          <h2 className="text-xl font-bold mb-2">Módulo no encontrado</h2>
          <p className="text-gray-400">El módulo solicitado no existe.</p>
        </div>
      );
    }
  };

  const getIconoBateria = () => {
    if (vehiculo.tipo === 'electrico' || vehiculo.tipo === 'hibrido') {
      return <FaBatteryFull size={18} />;
    } else if (vehiculo.tipo === 'diesel') {
      return <FaOilCan size={18} />;
    } else {
      return <FaGasPump size={18} />;
    }
  };

  const getNivelCombustible = () => {
    if (vehiculo.tipo === 'electrico' || vehiculo.tipo === 'hibrido') {
      return 'Batería: 78%';
    } else if (vehiculo.tipo === 'diesel') {
      return 'Diésel: 65%';
    } else {
      return 'Gasolina: 72%';
    }
  };

  return (
    <div className="min-h-screen bg-[#1b1f20] text-white px-4 py-6 flex flex-col items-center relative overflow-hidden">
      {/* Header con logo */}
      <div className="w-full max-w-5xl mb-6 flex items-center justify-between">
        <button
          onClick={onVolver}
          className="flex items-center gap-2 bg-[#2e2e2e] hover:bg-[#3a3a3a] px-4 py-2 rounded-lg transition-colors"
        >
          <FaArrowLeft size={16} />
          Cambiar Vehículo
        </button>
        
        <Image 
          src="/images/logoKR.png" 
          alt="Logo KR" 
          width={80} 
          height={80} 
          className="z-10" 
          priority 
        />
      </div>

      {/* Información del vehículo conectado */}
      <div className="bg-[#c3c3c3] text-black rounded-xl p-4 mb-6 w-full max-w-md sm:max-w-lg shadow-md z-10">
        <div className="flex flex-col gap-2 sm:gap-4 text-sm sm:text-base">
          <div className="flex items-center gap-2 overflow-hidden">
            <FaInfoCircle size={18} />
            <span className="font-semibold whitespace-nowrap">Conectado a:</span>
            <span className="truncate">{vehiculo.nombre}</span>
          </div>
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="font-semibold whitespace-nowrap">Serie:</span>
            <span className="truncate">{vehiculo.numeroSerie}</span>
          </div>
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="font-semibold whitespace-nowrap">Año:</span>
            <span className="truncate">{vehiculo.año}</span>
          </div>
          <div className="flex items-center gap-2 overflow-hidden">
            {getIconoBateria()}
            <span className="font-semibold whitespace-nowrap">{getNivelCombustible()}</span>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="w-full max-w-5xl">
        <Suspense fallback={
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
            <p>Cargando módulo...</p>
          </div>
        }>
          {moduloActivo ? (
            <div>
              <button
                onClick={volverAlMenu}
                className="mb-4 flex items-center gap-2 px-4 py-2 bg-[#3a3a3a] hover:bg-[#4a4a4a] rounded-lg transition-colors"
              >
                <FaArrowLeft />
                Volver al Menú
              </button>
              {renderizarModulo()}
            </div>
          ) : (
            renderizarMenu()
          )}
        </Suspense>
      </div>
    </div>
  );
}
