'use client';

import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { FaArrowLeft, FaBolt, FaThermometerHalf, FaBatteryFull, FaTachometerAlt, FaCog } from 'react-icons/fa';
import ModuleStyles from './styles/ModuleStyles';

export default function MotorElectricoIMA({ vehiculo, volver }) {
  const [datosEnTiempoReal, setDatosEnTiempoReal] = useState([]);
  const [parametrosActuales, setParametrosActuales] = useState({
    voltaje: 144.5,
    corriente: 85.2,
    potencia: 12.3,
    temperatura: 45,
    rpm: 1200,
    torque: 95,
    eficiencia: 92.5,
    estado: 'Operativo'
  });

  const [alertas, setAlertas] = useState([]);

  useEffect(() => {
    const intervalo = setInterval(() => {
      const nuevosDatos = {
        tiempo: new Date().toLocaleTimeString(),
        voltaje: parametrosActuales.voltaje + (Math.random() - 0.5) * 2,
        corriente: parametrosActuales.corriente + (Math.random() - 0.5) * 5,
        potencia: parametrosActuales.potencia + (Math.random() - 0.5) * 0.8,
        temperatura: parametrosActuales.temperatura + (Math.random() - 0.5) * 0.3,
        rpm: parametrosActuales.rpm + (Math.random() - 0.5) * 100,
        torque: parametrosActuales.torque + (Math.random() - 0.5) * 3,
        eficiencia: Math.min(100, Math.max(85, parametrosActuales.eficiencia + (Math.random() - 0.5) * 0.5))
      };

      // Validar rangos y generar alertas
      const nuevasAlertas = [];
      if (nuevosDatos.temperatura > 80) nuevasAlertas.push('Temperatura motor IMA elevada');
      if (nuevosDatos.voltaje < 120) nuevasAlertas.push('Voltaje sistema IMA bajo');
      if (nuevosDatos.corriente > 150) nuevasAlertas.push('Corriente excesiva en motor IMA');
      if (nuevosDatos.eficiencia < 88) nuevasAlertas.push('Eficiencia motor IMA reducida');

      setParametrosActuales({
        ...nuevosDatos,
        estado: nuevasAlertas.length > 0 ? 'Advertencia' : 'Operativo'
      });
      setAlertas(nuevasAlertas);

      setDatosEnTiempoReal(prev => {
        const nuevosRegistros = [...prev, nuevosDatos];
        return nuevosRegistros.slice(-20); // Mantener últimos 20 registros
      });
    }, 1000);

    return () => clearInterval(intervalo);
  }, [parametrosActuales]);

  const parametrosBarra = [
    { nombre: 'Voltaje', valor: parametrosActuales.voltaje, maximo: 160, unidad: 'V', color: '#8884d8' },
    { nombre: 'Corriente', valor: parametrosActuales.corriente, maximo: 200, unidad: 'A', color: '#82ca9d' },
    { nombre: 'Potencia', valor: parametrosActuales.potencia, maximo: 20, unidad: 'kW', color: '#ffc658' },
    { nombre: 'Temperatura', valor: parametrosActuales.temperatura, maximo: 100, unidad: '°C', color: '#ff7c7c' }
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
          <FaBolt className="text-yellow-400" size={24} />
          <h1 className="text-xl md:text-2xl font-bold">Motor Eléctrico IMA</h1>
        </div>
        <div className="text-right text-sm">
          <div className="text-gray-400">{vehiculo.marca} {vehiculo.modelo}</div>
          <div className="text-blue-400">Sistema Honda IMA</div>
        </div>
      </ModuleStyles.Header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ModuleStyles.InfoCard title="Estado del Motor IMA" icon={FaBolt}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-400">Estado</div>
                <div className={`font-semibold ${
                  parametrosActuales.estado === 'Operativo' ? 'text-green-400' : 'text-yellow-400'
                }`}>
                  {parametrosActuales.estado}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-400">Eficiencia</div>
                <div className="font-semibold text-blue-400">{parametrosActuales.eficiencia.toFixed(1)}%</div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-400">RPM</div>
                <div className="font-semibold">{parametrosActuales.rpm.toFixed(0)}</div>
              </div>
              <div>
                <div className="text-sm text-gray-400">Torque</div>
                <div className="font-semibold">{parametrosActuales.torque.toFixed(1)} Nm</div>
              </div>
            </div>
          </div>
        </ModuleStyles.InfoCard>

        <ModuleStyles.InfoCard title="Parámetros Eléctricos" icon={FaBatteryFull}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-400">Voltaje</div>
                <div className="font-semibold text-purple-400">{parametrosActuales.voltaje.toFixed(1)} V</div>
              </div>
              <div>
                <div className="text-sm text-gray-400">Corriente</div>
                <div className="font-semibold text-green-400">{parametrosActuales.corriente.toFixed(1)} A</div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-400">Potencia</div>
                <div className="font-semibold text-yellow-400">{parametrosActuales.potencia.toFixed(1)} kW</div>
              </div>
              <div>
                <div className="text-sm text-gray-400">Temperatura</div>
                <div className={`font-semibold ${
                  parametrosActuales.temperatura > 80 ? 'text-red-400' : 
                  parametrosActuales.temperatura > 70 ? 'text-yellow-400' : 'text-blue-400'
                }`}>
                  {parametrosActuales.temperatura.toFixed(1)}°C
                </div>
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
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                {alerta}
              </li>
            ))}
          </ul>
        </ModuleStyles.WarningCard>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <ModuleStyles.ChartCard title="Tendencia en Tiempo Real" icon={FaTachometerAlt}>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={datosEnTiempoReal}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="tiempo" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#374151', border: 'none', borderRadius: '8px' }}
                labelStyle={{ color: '#D1D5DB' }}
              />
              <Line type="monotone" dataKey="voltaje" stroke="#8884d8" strokeWidth={2} name="Voltaje (V)" />
              <Line type="monotone" dataKey="corriente" stroke="#82ca9d" strokeWidth={2} name="Corriente (A)" />
              <Line type="monotone" dataKey="temperatura" stroke="#ff7c7c" strokeWidth={2} name="Temperatura (°C)" />
            </LineChart>
          </ResponsiveContainer>
        </ModuleStyles.ChartCard>

        <ModuleStyles.ChartCard title="Parámetros Actuales" icon={FaCog}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={parametrosBarra} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis type="number" stroke="#9CA3AF" />
              <YAxis dataKey="nombre" type="category" stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#374151', border: 'none', borderRadius: '8px' }}
                formatter={(value, name) => [`${value.toFixed(1)}${parametrosBarra.find(p => p.color === name)?.unidad || ''}`, 'Valor']}
              />
              <Bar dataKey="valor" fill={(entry) => entry.color} />
            </BarChart>
          </ResponsiveContainer>
        </ModuleStyles.ChartCard>
      </div>
    </div>
  );
}
