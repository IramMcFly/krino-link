'use client';

import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { FaArrowLeft, FaBatteryFull, FaThermometerHalf, FaBolt, FaExclamationTriangle, FaCog } from 'react-icons/fa';
import ModuleStyles from './styles/ModuleStyles';

export default function BateriaHibrida({ vehiculo, volver }) {
  const [datosEnTiempoReal, setDatosEnTiempoReal] = useState([]);
  const [parametrosActuales, setParametrosActuales] = useState({
    carga: 76.5,
    voltaje: 201.6,
    corriente: 12.8,
    temperatura: 28,
    potencia: 2.58,
    ciclos: 12453,
    capacidadDisponible: 98.2,
    estado: 'Normal',
    modulosActivos: 20,
    modulosInactivos: 0
  });

  const [alertas, setAlertas] = useState([]);

  useEffect(() => {
    const intervalo = setInterval(() => {
      const nuevosDatos = {
        tiempo: new Date().toLocaleTimeString(),
        carga: Math.max(5, Math.min(100, parametrosActuales.carga + (Math.random() - 0.5) * 0.3)),
        voltaje: parametrosActuales.voltaje + (Math.random() - 0.5) * 1.5,
        corriente: parametrosActuales.corriente + (Math.random() - 0.5) * 2,
        temperatura: parametrosActuales.temperatura + (Math.random() - 0.5) * 0.2,
        potencia: parametrosActuales.potencia + (Math.random() - 0.5) * 0.1,
        capacidadDisponible: Math.max(85, Math.min(100, parametrosActuales.capacidadDisponible + (Math.random() - 0.5) * 0.1)),
        ciclos: parametrosActuales.ciclos,
        modulosActivos: Math.random() > 0.95 ? 19 : 20,
        modulosInactivos: Math.random() > 0.95 ? 1 : 0
      };

      // Validar rangos y generar alertas
      const nuevasAlertas = [];
      if (nuevosDatos.temperatura > 45) nuevasAlertas.push('Temperatura batería híbrida elevada');
      if (nuevosDatos.carga < 20) nuevasAlertas.push('Nivel de carga batería híbrida bajo');
      if (nuevosDatos.voltaje < 180) nuevasAlertas.push('Voltaje batería híbrida insuficiente');
      if (nuevosDatos.capacidadDisponible < 90) nuevasAlertas.push('Capacidad batería híbrida reducida');
      if (nuevosDatos.modulosInactivos > 0) nuevasAlertas.push('Módulos de batería inactivos detectados');

      setParametrosActuales({
        ...nuevosDatos,
        estado: nuevasAlertas.length > 0 ? 'Advertencia' : 'Normal'
      });
      setAlertas(nuevasAlertas);

      setDatosEnTiempoReal(prev => {
        const nuevosRegistros = [...prev, nuevosDatos];
        return nuevosRegistros.slice(-20);
      });
    }, 1500);

    return () => clearInterval(intervalo);
  }, [parametrosActuales]);

  const datosTorta = [
    { nombre: 'Carga Disponible', valor: parametrosActuales.carga, color: '#4ade80' },
    { nombre: 'Carga Usada', valor: 100 - parametrosActuales.carga, color: '#6b7280' }
  ];

  const datosModulos = [
    { nombre: 'Activos', valor: parametrosActuales.modulosActivos, color: '#10b981' },
    { nombre: 'Inactivos', valor: parametrosActuales.modulosInactivos, color: '#ef4444' }
  ];

  return (
    <div className="p-4 md:p-6 bg-[#1b1f20] min-h-screen">
      <ModuleStyles.Header>
        <button 
          onClick={volver}
          className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
        >
          <FaArrowLeft size={16} />
          Volver
        </button>
        <div className="flex items-center gap-3">
          <FaBatteryFull className="text-green-400" size={24} />
          <h1 className="text-xl md:text-2xl font-bold">Batería Híbrida</h1>
        </div>
        <div className="text-right text-sm">
          <div className="text-gray-400">{vehiculo.marca} {vehiculo.modelo}</div>
          <div className="text-green-400">Sistema Ni-MH</div>
        </div>
      </ModuleStyles.Header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <ModuleStyles.InfoCard title="Estado de Carga" icon={FaBatteryFull}>
          <div className="space-y-4">
            <div className="text-center">
              <div className={`text-3xl font-bold mb-2 ${
                parametrosActuales.carga > 60 ? 'text-green-400' :
                parametrosActuales.carga > 30 ? 'text-yellow-400' : 'text-red-400'
              }`}>
                {parametrosActuales.carga.toFixed(1)}%
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full transition-all duration-1000 ${
                    parametrosActuales.carga > 60 ? 'bg-green-400' :
                    parametrosActuales.carga > 30 ? 'bg-yellow-400' : 'bg-red-400'
                  }`}
                  style={{ width: `${parametrosActuales.carga}%` }}
                ></div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-gray-400">Capacidad</div>
                <div className="font-semibold text-blue-400">{parametrosActuales.capacidadDisponible.toFixed(1)}%</div>
              </div>
              <div>
                <div className="text-gray-400">Ciclos</div>
                <div className="font-semibold">{parametrosActuales.ciclos}</div>
              </div>
            </div>
          </div>
        </ModuleStyles.InfoCard>

        <ModuleStyles.InfoCard title="Parámetros Eléctricos" icon={FaBolt}>
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Voltaje:</span>
                <span className="font-semibold text-purple-400">{parametrosActuales.voltaje.toFixed(1)} V</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Corriente:</span>
                <span className="font-semibold text-yellow-400">{parametrosActuales.corriente.toFixed(1)} A</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Potencia:</span>
                <span className="font-semibold text-green-400">{parametrosActuales.potencia.toFixed(2)} kW</span>
              </div>
            </div>
          </div>
        </ModuleStyles.InfoCard>

        <ModuleStyles.InfoCard title="Sistema Térmico" icon={FaThermometerHalf}>
          <div className="space-y-4">
            <div className="text-center">
              <div className={`text-2xl font-bold mb-2 ${
                parametrosActuales.temperatura > 45 ? 'text-red-400' :
                parametrosActuales.temperatura > 35 ? 'text-yellow-400' : 'text-blue-400'
              }`}>
                {parametrosActuales.temperatura.toFixed(1)}°C
              </div>
              <div className="text-sm text-gray-400">
                Rango óptimo: 20-35°C
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-sm text-gray-400">Estado Térmico</div>
              <div className={`font-semibold ${
                parametrosActuales.temperatura > 45 ? 'text-red-400' :
                parametrosActuales.temperatura > 35 ? 'text-yellow-400' : 'text-green-400'
              }`}>
                {parametrosActuales.temperatura > 45 ? 'Alto' :
                 parametrosActuales.temperatura > 35 ? 'Moderado' : 'Óptimo'}
              </div>
            </div>
          </div>
        </ModuleStyles.InfoCard>
      </div>

      {alertas.length > 0 && (
        <ModuleStyles.WarningCard title="Alertas del Sistema">
          <ul className="space-y-2">
            {alertas.map((alerta, index) => (
              <li key={index} className="flex items-center gap-2">
                <FaExclamationTriangle className="text-yellow-400" size={14} />
                {alerta}
              </li>
            ))}
          </ul>
        </ModuleStyles.WarningCard>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <ModuleStyles.ChartCard title="Tendencia Parámetros" icon={FaCog}>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart 
              data={datosEnTiempoReal}
              isAnimationActive={false}
              animationDuration={0}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="tiempo" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#374151', border: 'none', borderRadius: '8px' }}
                labelStyle={{ color: '#D1D5DB' }}
              />
              <Line 
                type="monotone" 
                dataKey="carga" 
                stroke="#4ade80" 
                strokeWidth={2} 
                name="Carga (%)"
                dot={false}
                isAnimationActive={false}
              />
              <Line 
                type="monotone" 
                dataKey="voltaje" 
                stroke="#a855f7" 
                strokeWidth={2} 
                name="Voltaje (V)"
                dot={false}
                isAnimationActive={false}
              />
              <Line 
                type="monotone" 
                dataKey="temperatura" 
                stroke="#f59e0b" 
                strokeWidth={2} 
                name="Temperatura (°C)"
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </ModuleStyles.ChartCard>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ModuleStyles.ChartCard title="Estado de Carga" icon={FaBatteryFull}>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={datosTorta}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  dataKey="valor"
                  startAngle={90}
                  endAngle={450}
                >
                  {datosTorta.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value.toFixed(1)}%`, 'Porcentaje']} />
              </PieChart>
            </ResponsiveContainer>
          </ModuleStyles.ChartCard>

          <ModuleStyles.ChartCard title="Módulos de Batería" icon={FaCog}>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={datosModulos}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  dataKey="valor"
                  startAngle={90}
                  endAngle={450}
                >
                  {datosModulos.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}`, 'Módulos']} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 text-center">
              <div className="text-sm text-gray-400">
                Total: {parametrosActuales.modulosActivos + parametrosActuales.modulosInactivos} módulos
              </div>
            </div>
          </ModuleStyles.ChartCard>
        </div>
      </div>
    </div>
  );
}
