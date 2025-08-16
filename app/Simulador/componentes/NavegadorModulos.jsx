import React from 'react';
import { FaCog, FaBolt, FaBatteryHalf, FaArrowLeft, FaCar, FaInfoCircle } from 'react-icons/fa';

const NavegadorModulos = ({ moduloActivo, cambiarModulo, vehiculo, onVolver }) => {
  const modulos = [
    {
      id: 'selector',
      nombre: 'Selección de Vehículo',
      icono: FaCar,
      color: 'text-gray-400',
      descripcion: 'Cambiar vehículo'
    },
    {
      id: 'informacion',
      nombre: 'Información del Vehículo',
      icono: FaInfoCircle,
      color: 'text-purple-400',
      descripcion: 'Detalles técnicos'
    },
    {
      id: 'combustion',
      nombre: 'Motor Combustión',
      icono: FaCog,
      color: 'text-blue-400',
      descripcion: 'Diagnóstico motor gasolina/diésel'
    },
    {
      id: 'electrico',
      nombre: 'Motor Eléctrico',
      icono: FaBolt,
      color: 'text-blue-400',
      descripcion: 'Diagnóstico motor eléctrico'
    },
    {
      id: 'bateria',
      nombre: 'Gestión Batería',
      icono: FaBatteryHalf,
      color: 'text-green-400',
      descripcion: 'Diagnóstico sistema de batería'
    }
  ];

  return (
    <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onVolver}
              className="flex items-center gap-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
            >
              <FaArrowLeft className="text-sm" />
              <span className="text-sm">Volver</span>
            </button>
            {vehiculo && (
              <div className="text-sm text-gray-300">
                <span className="font-semibold">{vehiculo.nombre}</span>
                <span className="mx-2">•</span>
                <span className="capitalize">{vehiculo.tipo}</span>
                <span className="mx-2">•</span>
                <span>{vehiculo.año}</span>
              </div>
            )}
          </div>
        </div>

        <nav className="flex gap-2 overflow-x-auto">
          {modulos.map((modulo) => {
            const IconoComponente = modulo.icono;
            const esActivo = moduloActivo === modulo.id;
            
            return (
              <button
                key={modulo.id}
                onClick={() => cambiarModulo(modulo.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg whitespace-nowrap transition-all ${
                  esActivo
                    ? 'bg-gray-700 border border-gray-600 text-white'
                    : 'bg-gray-800/50 hover:bg-gray-700/70 text-gray-300'
                }`}
              >
                <IconoComponente className={`text-lg ${modulo.color}`} />
                <div className="text-left">
                  <div className="text-sm font-medium">{modulo.nombre}</div>
                  {modulo.descripcion && (
                    <div className="text-xs text-gray-400">{modulo.descripcion}</div>
                  )}
                </div>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default NavegadorModulos;
