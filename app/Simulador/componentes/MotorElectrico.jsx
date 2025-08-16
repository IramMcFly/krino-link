import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { FaBolt, FaThermometerHalf, FaTachometerAlt, FaExclamationTriangle, FaCheckCircle, FaChargingStation } from 'react-icons/fa';

const MotorElectrico = ({ isActive = false }) => {
  const [datos, setDatos] = useState([]);
  const [parametros, setParametros] = useState({
    potencia: 85.5,
    voltaje: 380,
    corriente: 120,
    temperatura: 42,
    rpm: 2500,
    eficiencia: 94.2,
    estado: 'operativo'
  });

  const [codigosDTC, setCodigosDTC] = useState([
    { codigo: 'P0A1F', descripcion: 'Fallo sensor temperatura motor', estado: 'resuelto' },
    { codigo: 'P0AA6', descripcion: 'Circuito inversor alto voltaje', estado: 'activo' }
  ]);

  useEffect(() => {
    if (isActive) {
      const interval = setInterval(() => {
        // Simular datos en tiempo real del motor eléctrico
        setParametros(prev => ({
          ...prev,
          potencia: Math.max(0, Math.min(150, prev.potencia + (Math.random() - 0.5) * 10)),
          voltaje: Math.max(300, Math.min(420, prev.voltaje + (Math.random() - 0.5) * 20)),
          corriente: Math.max(0, Math.min(300, prev.corriente + (Math.random() - 0.5) * 30)),
          temperatura: Math.max(25, Math.min(80, prev.temperatura + (Math.random() - 0.5) * 3)),
          rpm: Math.max(0, Math.min(8000, prev.rpm + (Math.random() - 0.5) * 200)),
          eficiencia: Math.max(85, Math.min(98, prev.eficiencia + (Math.random() - 0.5) * 2))
        }));

        // Actualizar gráfico
        setDatos(prev => {
          const nuevoDato = {
            tiempo: new Date().toLocaleTimeString(),
            potencia: parametros.potencia,
            temperatura: parametros.temperatura,
            eficiencia: parametros.eficiencia
          };
          return [...prev.slice(-19), nuevoDato];
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isActive, parametros.potencia, parametros.temperatura, parametros.eficiencia]);

  if (!isActive) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-800 text-white flex items-center justify-center">
        <div className="text-center max-w-2xl mx-auto px-6">
          <FaBolt className="text-6xl text-blue-300 mx-auto mb-6 animate-pulse" />
          <h2 className="text-3xl font-bold mb-4">Módulo en Desarrollo</h2>
          <p className="text-blue-100 text-lg mb-8">
            El módulo <span className="text-blue-300 font-semibold">"MotorElectrico"</span> está siendo desarrollado.
          </p>
          <div className="bg-blue-800/50 rounded-xl p-6 backdrop-blur-sm border border-blue-600">
            <h3 className="text-xl font-semibold mb-4 text-blue-300">Características planificadas:</h3>
            <ul className="text-left space-y-3 text-blue-100">
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
          <FaBolt className="text-3xl text-blue-400" />
          <h1 className="text-3xl font-bold">Motor Eléctrico - Diagnóstico</h1>
        </div>

        {/* Panel de parámetros principales */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <FaBolt className="text-yellow-400 text-sm" />
              <span className="text-xs text-gray-400">Potencia</span>
            </div>
            <div className="text-xl font-bold">{parametros.potencia.toFixed(1)} kW</div>
          </div>

          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <FaChargingStation className="text-blue-400 text-sm" />
              <span className="text-xs text-gray-400">Voltaje</span>
            </div>
            <div className="text-xl font-bold">{Math.round(parametros.voltaje)} V</div>
          </div>

          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <FaBolt className="text-green-400 text-sm" />
              <span className="text-xs text-gray-400">Corriente</span>
            </div>
            <div className="text-xl font-bold">{Math.round(parametros.corriente)} A</div>
          </div>

          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <FaThermometerHalf className="text-red-400 text-sm" />
              <span className="text-xs text-gray-400">Temperatura</span>
            </div>
            <div className="text-xl font-bold">{Math.round(parametros.temperatura)}°C</div>
          </div>

          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <FaTachometerAlt className="text-purple-400 text-sm" />
              <span className="text-xs text-gray-400">RPM</span>
            </div>
            <div className="text-xl font-bold">{Math.round(parametros.rpm)}</div>
          </div>

          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              <span className="text-xs text-gray-400">Eficiencia</span>
            </div>
            <div className="text-xl font-bold">{parametros.eficiencia.toFixed(1)}%</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Gráfico de potencia y temperatura */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Potencia y Temperatura en Tiempo Real</h3>
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
                    dataKey="potencia" 
                    stroke="#3B82F6" 
                    strokeWidth={2}
                    name="Potencia kW"
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

          {/* Gráfico de eficiencia */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Eficiencia del Motor</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={datos}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="tiempo" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" domain={[80, 100]} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px'
                    }} 
                  />
                  <Area
                    type="monotone"
                    dataKey="eficiencia"
                    stroke="#10B981"
                    fill="#10B981"
                    fillOpacity={0.3}
                    name="Eficiencia %"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Códigos DTC */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FaExclamationTriangle className="text-yellow-400" />
            Códigos de Diagnóstico (DTC) - Motor Eléctrico
          </h3>
          <div className="space-y-3">
            {codigosDTC.map((codigo, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-700 rounded-lg p-3">
                <div>
                  <span className="font-mono text-lg text-blue-400">{codigo.codigo}</span>
                  <p className="text-gray-300 text-sm">{codigo.descripcion}</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  codigo.estado === 'activo' ? 'bg-red-500 text-white' : 
                  codigo.estado === 'resuelto' ? 'bg-green-500 text-white' : 'bg-yellow-500 text-gray-900'
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

export default MotorElectrico;
