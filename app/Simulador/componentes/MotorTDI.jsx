'use client';

import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { FaArrowLeft, FaCogs, FaBolt, FaGasPump, FaThermometerHalf, FaTachometerAlt, FaOilCan } from 'react-icons/fa';
import ModuleStyles from './styles/ModuleStyles';

export default function MotorTDI({ vehiculo, volver }) {
  const [datosEnTiempoReal, setDatosEnTiempoReal] = useState([]);
  const [parametrosActuales, setParametrosActuales] = useState({
    presionInyeccion: 1450, // bar
    temperatura: 85, // °C
    rpm: 1800,
    presionTurbo: 1.2, // bar
    nivelAceite: 78, // %
    eficiencia: 88.5, // %
    estado: 'Operativo'
  });

  const [alertas, setAlertas] = useState([]);

  useEffect(() => {
    const intervalo = setInterval(() => {
      const nuevosDatos = {
        tiempo: new Date().toLocaleTimeString(),
        presionInyeccion: parametrosActuales.presionInyeccion + (Math.random() - 0.5) * 30,
        temperatura: parametrosActuales.temperatura + (Math.random() - 0.5) * 1.5,
        rpm: parametrosActuales.rpm + (Math.random() - 0.5) * 120,
        presionTurbo: parametrosActuales.presionTurbo + (Math.random() - 0.5) * 0.08,
        nivelAceite: Math.max(0, Math.min(100, parametrosActuales.nivelAceite + (Math.random() - 0.5) * 0.5)),
        eficiencia: Math.min(100, Math.max(80, parametrosActuales.eficiencia + (Math.random() - 0.5) * 0.4))
      };

      // Validar rangos y generar alertas
      const nuevasAlertas = [];
      if (nuevosDatos.temperatura > 105) nuevasAlertas.push('Temperatura del motor elevada');
      if (nuevosDatos.nivelAceite < 30) nuevasAlertas.push('Nivel de aceite bajo');
      if (nuevosDatos.presionTurbo > 1.8) nuevasAlertas.push('Presión de turbo excesiva');
      if (nuevosDatos.presionTurbo < 0.7) nuevasAlertas.push('Presión de turbo baja');
      if (nuevosDatos.presionInyeccion < 1100) nuevasAlertas.push('Presión de inyección baja');
      if (nuevosDatos.eficiencia < 83) nuevasAlertas.push('Eficiencia del motor reducida');

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
    { nombre: 'Presión Inyección', valor: parametrosActuales.presionInyeccion, maximo: 1800, unidad: 'bar', color: '#8884d8' },
    { nombre: 'Presión Turbo', valor: parametrosActuales.presionTurbo, maximo: 2.0, unidad: 'bar', color: '#82ca9d' },
    { nombre: 'Temperatura', valor: parametrosActuales.temperatura, maximo: 120, unidad: '°C', color: '#ffc658' },
    { nombre: 'Nivel Aceite', valor: parametrosActuales.nivelAceite, maximo: 100, unidad: '%', color: '#ff7c7c' }
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
          <FaGasPump className="text-yellow-400" size={24} />
          <h1 className="text-xl md:text-2xl font-bold">Motor TDI (Diésel)</h1>
        </div>
        <div className="text-right text-sm">
          <div className="text-gray-400">{vehiculo?.marca} {vehiculo?.modelo}</div>
          <div className="text-blue-400">Sistema TDI</div>
        </div>
      </ModuleStyles.Header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ModuleStyles.InfoCard title="Estado del Motor TDI" icon={FaCogs}>
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
                <div className="text-sm text-gray-400">Nivel Aceite</div>
                <div className={`font-semibold ${
                  parametrosActuales.nivelAceite < 30 ? 'text-red-400' : 'text-green-400'
                }`}>
                  {parametrosActuales.nivelAceite.toFixed(1)}%
                </div>
              </div>
            </div>
          </div>
        </ModuleStyles.InfoCard>

        <ModuleStyles.InfoCard title="Parámetros Diesel" icon={FaOilCan}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-400">Presión Inyección</div>
                <div className="font-semibold text-purple-400">{parametrosActuales.presionInyeccion.toFixed(0)} bar</div>
              </div>
              <div>
                <div className="text-sm text-gray-400">Presión Turbo</div>
                <div className={`font-semibold ${
                  parametrosActuales.presionTurbo > 1.8 || parametrosActuales.presionTurbo < 0.7 ? 'text-red-400' : 'text-green-400'
                }`}>
                  {parametrosActuales.presionTurbo.toFixed(2)} bar
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-400">Temperatura</div>
                <div className={`font-semibold ${
                  parametrosActuales.temperatura > 105 ? 'text-red-400' : 
                  parametrosActuales.temperatura > 95 ? 'text-yellow-400' : 'text-blue-400'
                }`}>
                  {parametrosActuales.temperatura.toFixed(1)}°C
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-400">Eficiencia</div>
                <div className="font-semibold text-blue-400">{parametrosActuales.eficiencia.toFixed(1)}%</div>
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
            <LineChart data={datosEnTiempoReal} isAnimationActive={false} animationDuration={0}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="tiempo" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#374151', border: 'none', borderRadius: '8px' }}
                labelStyle={{ color: '#D1D5DB' }}
              />
              <Line type="monotone" dataKey="presionInyeccion" stroke="#8884d8" strokeWidth={2} name="Presión Inyección (bar)" dot={false} isAnimationActive={false} />
              <Line type="monotone" dataKey="presionTurbo" stroke="#82ca9d" strokeWidth={2} name="Presión Turbo (bar)" dot={false} isAnimationActive={false} />
              <Line type="monotone" dataKey="temperatura" stroke="#ffc658" strokeWidth={2} name="Temperatura (°C)" dot={false} isAnimationActive={false} />
              <Line type="monotone" dataKey="rpm" stroke="#ff7c7c" strokeWidth={2} name="RPM" dot={false} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </ModuleStyles.ChartCard>

        <ModuleStyles.ChartCard title="Parámetros Actuales" icon={FaCogs}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={parametrosBarra} layout="horizontal" isAnimationActive={false} animationDuration={0}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis type="number" stroke="#9CA3AF" />
              <YAxis dataKey="nombre" type="category" stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#374151', border: 'none', borderRadius: '8px' }}
                formatter={(value, name) => [`${value.toFixed(1)}${parametrosBarra.find(p => p.color === name)?.unidad || ''}`, 'Valor']}
              />
              <Bar dataKey="valor" fill={(entry) => entry.color} isAnimationActive={false} />
            </BarChart>
            </ResponsiveContainer>
        </ModuleStyles.ChartCard>
      </div>
    </div>
  );
}