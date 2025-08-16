import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { FaBatteryHalf, FaThermometerHalf, FaBolt, FaExclamationTriangle, FaCheckCircle, FaChargingStation } from 'react-icons/fa';

const GestionBateria = ({ isActive = false }) => {
  const [datos, setDatos] = useState([]);
  const [parametros, setParametros] = useState({
    cargaBateria: 78.5,
    voltaje: 385,
    corriente: -45, // Negativo indica descarga
    temperatura: 35,
    potencia: 17.3,
    estadoSalud: 94.2,
    ciclos: 1247,
    estado: 'descargando'
  });

  const [celdas, setCeldas] = useState(
    Array.from({ length: 12 }, (_, i) => ({
      id: i + 1,
      voltaje: 3.2 + Math.random() * 0.4,
      temperatura: 32 + Math.random() * 8,
      estado: Math.random() > 0.9 ? 'advertencia' : 'normal'
    }))
  );

  const [codigosDTC, setCodigosDTC] = useState([
    { codigo: 'P0A0F', descripcion: 'Batería HV desconectada', estado: 'resuelto' },
    { codigo: 'P0AA6', descripcion: 'Sensor temperatura batería', estado: 'intermitente' }
  ]);

  const COLORES = ['#22C55E', '#EF4444', '#F59E0B', '#6366F1'];

  useEffect(() => {
    if (isActive) {
      const interval = setInterval(() => {
        // Simular datos en tiempo real de la batería
        setParametros(prev => ({
          ...prev,
          cargaBateria: Math.max(5, Math.min(100, prev.cargaBateria + (Math.random() - 0.52) * 0.5)), // Tendencia a descargar
          voltaje: Math.max(300, Math.min(420, prev.voltaje + (Math.random() - 0.5) * 10)),
          corriente: -80 + Math.random() * 160, // Entre -80A y +80A
          temperatura: Math.max(15, Math.min(60, prev.temperatura + (Math.random() - 0.5) * 2)),
          potencia: Math.abs(prev.voltaje * prev.corriente / 1000),
          estadoSalud: Math.max(80, Math.min(100, prev.estadoSalud + (Math.random() - 0.51) * 0.1))
        }));

        // Actualizar gráfico
        setDatos(prev => {
          const nuevoDato = {
            tiempo: new Date().toLocaleTimeString(),
            carga: parametros.cargaBateria,
            temperatura: parametros.temperatura,
            voltaje: parametros.voltaje,
            corriente: parametros.corriente
          };
          return [...prev.slice(-19), nuevoDato];
        });

        // Actualizar estado de celdas ocasionalmente
        if (Math.random() > 0.7) {
          setCeldas(prev => prev.map(celda => ({
            ...celda,
            voltaje: Math.max(2.8, Math.min(4.2, celda.voltaje + (Math.random() - 0.5) * 0.1)),
            temperatura: Math.max(20, Math.min(50, celda.temperatura + (Math.random() - 0.5) * 1))
          })));
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isActive, parametros.cargaBateria, parametros.temperatura, parametros.voltaje, parametros.corriente]);

  if (!isActive) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-900 to-green-800 text-white flex items-center justify-center">
        <div className="text-center max-w-2xl mx-auto px-6">
          <FaBatteryHalf className="text-6xl text-green-300 mx-auto mb-6 animate-bounce" />
          <h2 className="text-3xl font-bold mb-4">Módulo en Desarrollo</h2>
          <p className="text-green-100 text-lg mb-8">
            El módulo <span className="text-green-300 font-semibold">"GestionBateria"</span> está siendo desarrollado.
          </p>
          <div className="bg-green-800/50 rounded-xl p-6 backdrop-blur-sm border border-green-600">
            <h3 className="text-xl font-semibold mb-4 text-green-300">Características planificadas:</h3>
            <ul className="text-left space-y-3 text-green-100">
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

  const datosEstadoBateria = [
    { name: 'Buena', value: parametros.estadoSalud, color: '#22C55E' },
    { name: 'Degradada', value: 100 - parametros.estadoSalud, color: '#EF4444' }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <FaBatteryHalf className="text-3xl text-green-400" />
          <h1 className="text-3xl font-bold">Gestión de Batería - Diagnóstico</h1>
        </div>

        {/* Panel de parámetros principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <FaBatteryHalf className="text-green-400" />
              <span className="text-sm text-gray-400">Carga</span>
            </div>
            <div className="text-2xl font-bold">{parametros.cargaBateria.toFixed(1)}%</div>
            <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
              <div 
                className="bg-green-400 h-2 rounded-full transition-all duration-300"
                style={{ width: `${parametros.cargaBateria}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <FaBolt className="text-blue-400" />
              <span className="text-sm text-gray-400">Voltaje</span>
            </div>
            <div className="text-2xl font-bold">{Math.round(parametros.voltaje)} V</div>
          </div>

          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <FaChargingStation className={parametros.corriente > 0 ? "text-green-400" : "text-orange-400"} />
              <span className="text-sm text-gray-400">Corriente</span>
            </div>
            <div className="text-2xl font-bold">{parametros.corriente.toFixed(1)} A</div>
            <div className="text-xs text-gray-400 mt-1">
              {parametros.corriente > 0 ? 'Cargando' : 'Descargando'}
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <FaThermometerHalf className="text-red-400" />
              <span className="text-sm text-gray-400">Temperatura</span>
            </div>
            <div className="text-2xl font-bold">{Math.round(parametros.temperatura)}°C</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Gráfico principal */}
          <div className="lg:col-span-2 bg-gray-800 rounded-lg p-6">
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
                    dataKey="carga" 
                    stroke="#22C55E" 
                    strokeWidth={2}
                    name="Carga %"
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

          {/* Estado de salud */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Estado de Salud</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={datosEstadoBateria}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {datosEstadoBateria.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{parametros.estadoSalud.toFixed(1)}%</div>
              <div className="text-sm text-gray-400">Ciclos: {parametros.ciclos}</div>
            </div>
          </div>
        </div>

        {/* Estado de celdas */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Estado de Celdas Individuales</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {celdas.map((celda) => (
              <div 
                key={celda.id} 
                className={`bg-gray-700 rounded-lg p-3 text-center border-2 ${
                  celda.estado === 'advertencia' ? 'border-yellow-400' : 'border-gray-600'
                }`}
              >
                <div className="text-xs text-gray-400 mb-1">Celda {celda.id}</div>
                <div className="text-sm font-bold">{celda.voltaje.toFixed(2)}V</div>
                <div className="text-xs text-gray-400">{celda.temperatura.toFixed(1)}°C</div>
              </div>
            ))}
          </div>
        </div>

        {/* Códigos DTC */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FaExclamationTriangle className="text-yellow-400" />
            Códigos de Diagnóstico (DTC) - Gestión de Batería
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

export default GestionBateria;
