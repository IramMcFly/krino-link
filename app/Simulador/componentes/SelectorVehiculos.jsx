'use client';

import { useState } from 'react';
import Image from 'next/image';
import { FaBolt, FaLeaf, FaOilCan, FaGasPump, FaArrowRight, FaInfoCircle } from 'react-icons/fa';
import { vehiculosDisponibles, tiposVehiculo } from '../data/vehiculos';

const iconosMap = {
  FaBolt,
  FaLeaf,
  FaOilCan,
  FaGasPump
};

export default function SelectorVehiculos({ onVehiculoSeleccionado }) {
  const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState(null);
  const [mostrarDetalles, setMostrarDetalles] = useState(null);

  const handleSeleccion = (vehiculoId) => {
    const vehiculo = vehiculosDisponibles[vehiculoId];
    setVehiculoSeleccionado(vehiculo);
  };

  const confirmarSeleccion = () => {
    if (vehiculoSeleccionado) {
      onVehiculoSeleccionado(vehiculoSeleccionado);
    }
  };

  const getIconoTipo = (tipo) => {
    const tipoInfo = tiposVehiculo[tipo];
    const IconoComponent = iconosMap[tipoInfo.icono];
    return <IconoComponent size={20} style={{ color: tipoInfo.color }} />;
  };

  return (
    <div className="min-h-screen bg-[#1b1f20] text-white px-4 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#c3151b] mb-4">
            Seleccionar Vehículo para Simulación
          </h1>
          <p className="text-gray-300">
            Elige el vehículo que deseas diagnosticar y simular
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {Object.values(vehiculosDisponibles).map((vehiculo) => (
            <div
              key={vehiculo.id}
              onClick={() => handleSeleccion(vehiculo.id)}
              className={`bg-[#2e2e2e] rounded-xl p-4 cursor-pointer transition-all transform hover:scale-105 border-2 ${
                vehiculoSeleccionado?.id === vehiculo.id 
                  ? 'border-[#c3151b] bg-[#2e2e2e]/80' 
                  : 'border-transparent hover:border-gray-600'
              }`}
            >
              {/* Imagen del vehículo */}
              <div className="relative w-full h-32 mb-4 bg-[#1a1a1a] rounded-lg overflow-hidden">
                <div className="flex items-center justify-center h-full text-gray-500">
                  <span className="text-xs">Imagen del vehículo</span>
                </div>
              </div>

              {/* Información básica */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {getIconoTipo(vehiculo.tipo)}
                  <h3 className="font-semibold text-sm">{vehiculo.nombre}</h3>
                </div>
                
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>{vehiculo.año}</span>
                  <span className="capitalize">{tiposVehiculo[vehiculo.tipo].nombre}</span>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setMostrarDetalles(mostrarDetalles === vehiculo.id ? null : vehiculo.id);
                  }}
                  className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300"
                >
                  <FaInfoCircle size={12} />
                  Ver especificaciones
                </button>
              </div>

              {/* Detalles expandibles */}
              {mostrarDetalles === vehiculo.id && (
                <div className="mt-4 pt-4 border-t border-gray-600">
                  <div className="space-y-2 text-xs">
                    {vehiculo.tipo === 'electrico' && (
                      <>
                        <div className="flex justify-between">
                          <span>Batería:</span>
                          <span>{vehiculo.especificaciones.bateria}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Autonomía:</span>
                          <span>{vehiculo.especificaciones.autonomia}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Potencia:</span>
                          <span>{vehiculo.especificaciones.potencia}</span>
                        </div>
                      </>
                    )}
                    
                    {vehiculo.tipo === 'hibrido' && (
                      <>
                        <div className="flex justify-between">
                          <span>Motor:</span>
                          <span>{vehiculo.especificaciones.motorGasolina}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Potencia:</span>
                          <span>{vehiculo.especificaciones.potenciaTotal}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Batería HV:</span>
                          <span>{vehiculo.especificaciones.bateria}</span>
                        </div>
                      </>
                    )}

                    {vehiculo.tipo === 'diesel' && (
                      <>
                        <div className="flex justify-between">
                          <span>Motor:</span>
                          <span>{vehiculo.especificaciones.motor}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Potencia:</span>
                          <span>{vehiculo.especificaciones.potencia}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Transmisión:</span>
                          <span>{vehiculo.especificaciones.transmision}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Vehículo seleccionado */}
        {vehiculoSeleccionado && (
          <div className="bg-[#2e2e2e] rounded-xl p-6 mb-6">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              {getIconoTipo(vehiculoSeleccionado.tipo)}
              Vehículo Seleccionado: {vehiculoSeleccionado.nombre}
            </h3>
            
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <h4 className="font-semibold mb-2">Información del vehículo</h4>
                <div className="space-y-1 text-sm text-gray-300">
                  <p><strong>Año:</strong> {vehiculoSeleccionado.año}</p>
                  <p><strong>Tipo:</strong> {tiposVehiculo[vehiculoSeleccionado.tipo].nombre}</p>
                  <p><strong>Serie:</strong> {vehiculoSeleccionado.numeroSerie}</p>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Sistemas disponibles</h4>
                <div className="flex flex-wrap gap-2">
                  {vehiculoSeleccionado.sistemas.map((sistema) => (
                    <span 
                      key={sistema}
                      className="px-2 py-1 bg-[#1a1a1a] rounded text-xs"
                    >
                      {sistema}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={confirmarSeleccion}
              className="w-full bg-[#c3151b] hover:bg-[#a31116] py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              Iniciar Simulación
              <FaArrowRight />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
