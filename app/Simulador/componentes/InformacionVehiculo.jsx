import React from 'react';
import { FaCar, FaBolt, FaGasPump, FaOilCan, FaLeaf, FaCalendarAlt, FaCogs, FaRoad } from 'react-icons/fa';

const InformacionVehiculo = ({ vehiculo }) => {
  if (!vehiculo) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <p className="text-gray-400">No hay vehículo seleccionado</p>
      </div>
    );
  }

  const obtenerIconoTipo = (tipo) => {
    switch (tipo) {
      case 'electrico':
        return <FaBolt className="text-green-400" />;
      case 'hibrido':
        return <FaLeaf className="text-yellow-400" />;
      case 'diesel':
        return <FaOilCan className="text-blue-400" />;
      case 'gasolina':
        return <FaGasPump className="text-red-400" />;
      default:
        return <FaCar className="text-gray-400" />;
    }
  };

  const obtenerColorTipo = (tipo) => {
    switch (tipo) {
      case 'electrico':
        return 'from-green-900 to-green-800';
      case 'hibrido':
        return 'from-yellow-900 to-yellow-800';
      case 'diesel':
        return 'from-blue-900 to-blue-800';
      case 'gasolina':
        return 'from-red-900 to-red-800';
      default:
        return 'from-gray-900 to-gray-800';
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${obtenerColorTipo(vehiculo.tipo)} text-white p-6`}>
      <div className="max-w-4xl mx-auto">
        {/* Encabezado del vehículo */}
        <div className="bg-gray-800/70 rounded-xl p-8 mb-6 backdrop-blur-sm">
          <div className="flex items-center gap-4 mb-4">
            {obtenerIconoTipo(vehiculo.tipo)}
            <div>
              <h1 className="text-3xl font-bold">{vehiculo.nombre}</h1>
              <p className="text-gray-300 capitalize">{vehiculo.tipo} • {vehiculo.año}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="bg-gray-700/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <FaCogs className="text-blue-400" />
                <span className="text-sm text-gray-400">Número de Serie</span>
              </div>
              <p className="font-mono text-sm">{vehiculo.numeroSerie}</p>
            </div>
            
            <div className="bg-gray-700/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <FaCalendarAlt className="text-green-400" />
                <span className="text-sm text-gray-400">Año Modelo</span>
              </div>
              <p className="text-lg font-semibold">{vehiculo.año}</p>
            </div>
          </div>
        </div>

        {/* Especificaciones técnicas */}
        <div className="bg-gray-800/70 rounded-xl p-8 mb-6 backdrop-blur-sm">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <FaCogs className="text-blue-400" />
            Especificaciones Técnicas
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(vehiculo.especificaciones).map(([clave, valor]) => (
              <div key={clave} className="bg-gray-700/50 rounded-lg p-4">
                <div className="text-sm text-gray-400 capitalize mb-1">
                  {clave.replace(/([A-Z])/g, ' $1').trim()}
                </div>
                <div className="font-semibold">{valor}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Sistemas disponibles */}
        <div className="bg-gray-800/70 rounded-xl p-8 mb-6 backdrop-blur-sm">
          <h2 className="text-xl font-bold mb-4">Sistemas Diagnosticables</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {vehiculo.sistemas.map((sistema, index) => (
              <div key={index} className="bg-gray-700/50 rounded-lg p-3 text-center">
                <div className="text-sm font-medium">{sistema}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Parámetros disponibles */}
        <div className="bg-gray-800/70 rounded-xl p-8 mb-6 backdrop-blur-sm">
          <h2 className="text-xl font-bold mb-4">Parámetros Monitoreables</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(vehiculo.parametros).map(([parametro, config]) => (
              <div key={parametro} className="bg-gray-700/50 rounded-lg p-4">
                <div className="text-sm text-gray-400 capitalize mb-1">
                  {parametro.replace(/([A-Z])/g, ' $1').trim()}
                </div>
                <div className="text-sm font-semibold">
                  {config.min} - {config.max} {config.unidad}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modos de conducción */}
        <div className="bg-gray-800/70 rounded-xl p-8 backdrop-blur-sm">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <FaRoad className="text-purple-400" />
            Modos de Conducción
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {vehiculo.modosConduccion.map((modo, index) => (
              <div key={index} className="bg-gray-700/50 rounded-lg p-3 text-center">
                <div className="text-sm font-medium">{modo}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InformacionVehiculo;
