import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FaCog, FaThermometerHalf, FaTachometerAlt, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';

const MotorCombustion = ({ isActive = false }) => {
  const [datos, setDatos] = useState([]);
  const [parametros, setParametros] = useState({
    rpm: 850,
    temperatura: 85,
    presion: 1.2,
    combustible: 75,
    estado: 'normal'
  });

  const [codigosDTC, setCodigosDTC] = useState([
    { codigo: 'P0171', descripcion: 'Mezcla pobre banco 1', estado: 'activo' },
    { codigo: 'P0420', descripcion: 'Eficiencia catalizador', estado: 'intermitente' }
  ]);

  useEffect(() => {
    if (isActive) {
      const interval = setInterval(() => {
        // Simular datos en tiempo real
        setParametros(prev => ({
          ...prev,
          rpm: prev.rpm + (Math.random() - 0.5) * 100,
          temperatura: Math.max(70, Math.min(110, prev.temperatura + (Math.random() - 0.5) * 5)),
          presion: Math.max(0.8, Math.min(2.0, prev.presion + (Math.random() - 0.5) * 0.2))
        }));

        // Actualizar gráfico
        setDatos(prev => {
          const nuevoDato = {
            tiempo: new Date().toLocaleTimeString(),
            rpm: parametros.rpm,
            temperatura: parametros.temperatura
          };
          return [...prev.slice(-19), nuevoDato];
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isActive, parametros.rpm, parametros.temperatura]);

  if (!isActive) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 text-white flex items-center justify-center">
        <div className="text-center max-w-2xl mx-auto px-6">
          <FaCog className="text-6xl text-blue-400 mx-auto mb-6 animate-spin-slow" />
          <h2 className="text-3xl font-bold mb-4">Módulo en Desarrollo</h2>
          <p className="text-gray-300 text-lg mb-8">
            El módulo <span className="text-blue-400 font-semibold">"MotorCombustion"</span> está siendo desarrollado.
          </p>
          <div className="bg-gray-800/50 rounded-xl p-6 backdrop-blur-sm border border-gray-700">
            <h3 className="text-xl font-semibold mb-4 text-blue-400">Características planificadas:</h3>
            <ul className="text-left space-y-3 text-gray-300">
              <li className="flex items-center gap-3">
                <FaCheckCircle className="text-green-400 text-sm" />
                Diagnóstico en tiempo real
              </li>
              <li className="flex items-center gap-3">
                <FaCheckCircle className="text-green-400 text-sm" />
                Lectura de códigos DTC específicos
              </li>
              <li className="flex items-center gap-3">
                <FaCheckCircle className="text-green-400 text-sm" />
                Gráficos de parámetros
              </li>
              <li className="flex items-center gap-3">
                <FaCheckCircle className="text-green-400 text-sm" />
                Simulación de fallos
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <FaCog className="text-3xl text-blue-400" />
          <h1 className="text-3xl font-bold">Motor de Combustión - Diagnóstico</h1>
        </div>

        {/* Panel de parámetros principales */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <FaTachometerAlt className="text-blue-400" />
              <span className="text-sm text-gray-400">RPM</span>
            </div>
            <div className="text-2xl font-bold">{Math.round(parametros.rpm)}</div>
          </div>

          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <FaThermometerHalf className="text-red-400" />
              <span className="text-sm text-gray-400">Temperatura</span>
            </div>
            <div className="text-2xl font-bold">{Math.round(parametros.temperatura)}°C</div>
          </div>

          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <FaCog className="text-green-400" />
              <span className="text-sm text-gray-400">Presión</span>
            </div>
            <div className="text-2xl font-bold">{parametros.presion.toFixed(1)} bar</div>
          </div>

          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              <span className="text-sm text-gray-400">Estado</span>
            </div>
            <div className="text-2xl font-bold capitalize">{parametros.estado}</div>
          </div>
        </div>

        {/* Gráfico en tiempo real */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Parámetros en Tiempo Real</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={datos}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="tiempo" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="rpm" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  name="RPM"
                />
                <Line 
                  type="monotone" 
                  dataKey="temperatura" 
                  stroke="#EF4444" 
                  strokeWidth={2}
                  name="Temperatura °C"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Códigos DTC */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FaExclamationTriangle className="text-yellow-400" />
            Códigos de Diagnóstico (DTC)
          </h3>
          <div className="space-y-3">
            {codigosDTC.map((codigo, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-700 rounded-lg p-3">
                <div>
                  <span className="font-mono text-lg text-blue-400">{codigo.codigo}</span>
                  <p className="text-gray-300 text-sm">{codigo.descripcion}</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  codigo.estado === 'activo' ? 'bg-red-500 text-white' : 'bg-yellow-500 text-gray-900'
                }`}>
                  {codigo.estado}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MotorCombustion;
