'use client';

import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { FaArrowLeft, FaWind, FaExclamationTriangle, FaTachometerAlt, FaTools } from 'react-icons/fa';
import ModuleStyles from './styles/ModuleStyles';

const DTC_LIST = [
  { code: 'P0299', desc: 'Presión de sobrealimentación baja (subboost)' },
  { code: 'P0234', desc: 'Presión de sobrealimentación excesiva (overboost)' },
  { code: 'P2263', desc: 'Rendimiento del sistema de sobrealimentación/turbocompresor' },
  { code: 'P2563', desc: 'Sensor de posición de control de turbocompresor - circuito bajo' }
];

export default function Turbocompresor({ vehiculo, volver }) {
  const [datosEnTiempoReal, setDatosEnTiempoReal] = useState([]);
  const [parametrosActuales, setParametrosActuales] = useState({
    presionTurbo: 1.15, // bar
    temperatura: 110, // °C
    rpmTurbo: 120000, // rpm
    flujoAire: 320, // g/s
    eficiencia: 88, // %
    estado: 'Operativo'
  });

  const [alertas, setAlertas] = useState([]);
  const [dtcs, setDtcs] = useState([]);
  const [simularFallo, setSimularFallo] = useState(false);

  useEffect(() => {
    const intervalo = setInterval(() => {
      setParametrosActuales(prev => {
        let fallo = simularFallo;
        const nuevosDatos = {
          tiempo: new Date().toLocaleTimeString(),
          presionTurbo: fallo
            ? Math.random() > 0.5
              ? Math.max(0.6, prev.presionTurbo - Math.random() * 0.2)
              : Math.min(2.2, prev.presionTurbo + Math.random() * 0.5)
            : Math.max(0.8, Math.min(1.8, prev.presionTurbo + (Math.random() - 0.5) * 0.05)),
          temperatura: prev.temperatura + (Math.random() - 0.5) * 2 + (fallo ? 3 : 0),
          rpmTurbo: fallo
            ? Math.max(60000, Math.min(180000, prev.rpmTurbo + (Math.random() - 0.5) * 8000 + (Math.random() > 0.5 ? 20000 : -20000)))
            : Math.max(80000, Math.min(160000, prev.rpmTurbo + (Math.random() - 0.5) * 4000)),
          flujoAire: fallo
            ? Math.max(150, Math.min(400, prev.flujoAire + (Math.random() - 0.5) * 30 + (Math.random() > 0.5 ? -60 : 60)))
            : Math.max(200, Math.min(350, prev.flujoAire + (Math.random() - 0.5) * 10)),
          eficiencia: fallo
            ? Math.max(70, prev.eficiencia - Math.random() * 2)
            : Math.min(95, Math.max(80, prev.eficiencia + (Math.random() - 0.5) * 0.5)),
          estado: 'Operativo'
        };

        // Diagnóstico y alertas
        const nuevasAlertas = [];
        const nuevosDTCs = [];
        if (nuevosDatos.presionTurbo < 0.8) {
          nuevasAlertas.push('Presión de turbo baja');
          nuevosDTCs.push('P0299');
        }
        if (nuevosDatos.presionTurbo > 1.8) {
          nuevasAlertas.push('Presión de turbo excesiva');
          nuevosDTCs.push('P0234');
        }
        if (nuevosDatos.temperatura > 140) nuevasAlertas.push('Temperatura del turbo elevada');
        if (nuevosDatos.rpmTurbo > 170000) nuevasAlertas.push('RPM del turbo excesivas');
        if (nuevosDatos.eficiencia < 80) {
          nuevasAlertas.push('Eficiencia del turbo reducida');
          nuevosDTCs.push('P2263');
        }
        if (fallo) nuevosDTCs.push('P2563');

        setAlertas(nuevasAlertas);
        setDtcs([...new Set(nuevosDTCs)]);

        setDatosEnTiempoReal(prevDatos => {
          const nuevosRegistros = [...prevDatos, nuevosDatos];
          return nuevosRegistros.slice(-20);
        });

        return {
          ...nuevosDatos,
          estado: nuevasAlertas.length > 0 ? 'Advertencia' : 'Operativo'
        };
      });
    }, 1200);

    return () => clearInterval(intervalo);
  }, [simularFallo]);

  const parametrosBarras = [
    { nombre: 'Presión Turbo', valor: parametrosActuales.presionTurbo, maximo: 2.5, unidad: 'bar', color: '#8884d8' },
    { nombre: 'RPM Turbo', valor: parametrosActuales.rpmTurbo, maximo: 180000, unidad: 'rpm', color: '#82ca9d' },
    { nombre: 'Flujo Aire', valor: parametrosActuales.flujoAire, maximo: 400, unidad: 'g/s', color: '#ffc658' },
    { nombre: 'Temperatura', valor: parametrosActuales.temperatura, maximo: 180, unidad: '°C', color: '#ff7c7c' }
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
          <FaWind className="text-yellow-400" size={24} />
          <h1 className="text-xl md:text-2xl font-bold">Turbocompresor Diesel</h1>
        </div>
        <div className="text-right text-sm">
          <div className="text-gray-400">{vehiculo?.marca} {vehiculo?.modelo}</div>
          <div className="text-blue-400">Diagnóstico Turbo</div>
        </div>
      </ModuleStyles.Header>

      <div className="flex justify-end mb-4">
        <button
          onClick={() => setSimularFallo(f => !f)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-sm font-semibold
            ${simularFallo ? 'bg-red-600 text-white' : 'bg-gray-700 text-yellow-300 hover:bg-yellow-500 hover:text-white'}`}
        >
          <FaTools />
          {simularFallo ? 'Detener Simulación de Fallo' : 'Simular Fallo'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <ModuleStyles.InfoCard title={'Presión y RPM'} icon={FaTachometerAlt}>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-400">Presión Turbo:</span>
              <span className={`font-semibold ${
                parametrosActuales.presionTurbo < 0.8 || parametrosActuales.presionTurbo > 1.8 ? 'text-red-400' : 'text-blue-400'
              }`}>{parametrosActuales.presionTurbo.toFixed(2)} bar</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">RPM Turbo:</span>
              <span className={`font-semibold ${
                parametrosActuales.rpmTurbo > 170000 ? 'text-red-400' : 'text-green-400'
              }`}>{parametrosActuales.rpmTurbo.toLocaleString()} rpm</span>
            </div>
          </div>
        </ModuleStyles.InfoCard>

        <ModuleStyles.InfoCard title={'Temperatura y Flujo'} icon={FaWind}>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-400">Temperatura:</span>
              <span className={`font-semibold ${
                parametrosActuales.temperatura > 140 ? 'text-red-400' :
                  parametrosActuales.temperatura > 120 ? 'text-yellow-400' : 'text-blue-400'
              }`}>{parametrosActuales.temperatura.toFixed(1)}°C</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Flujo Aire:</span>
              <span className="font-semibold text-green-400">{parametrosActuales.flujoAire.toFixed(1)} g/s</span>
            </div>
          </div>
        </ModuleStyles.InfoCard>

        <ModuleStyles.InfoCard title={'Eficiencia y Estado'} icon={FaWind}>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-400">Eficiencia:</span>
              <span className={`font-semibold ${
                parametrosActuales.eficiencia < 80 ? 'text-red-400' : 'text-blue-400'
              }`}>{parametrosActuales.eficiencia.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Estado:</span>
              <span className={`font-semibold ${
                parametrosActuales.estado === 'Operativo' ? 'text-green-400' : 'text-yellow-400'
              }`}>{parametrosActuales.estado}</span>
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

      {dtcs.length > 0 && (
        <ModuleStyles.WarningCard title="Códigos DTC Detectados">
          <ul className="space-y-2">
            {dtcs.map((dtc, idx) => {
              const info = DTC_LIST.find(d => d.code === dtc);
              return (
                <li key={dtc} className="flex items-center gap-2">
                  <span className="font-mono font-bold text-blue-300">{dtc}</span>
                  <span className="text-gray-300">{info ? info.desc : 'Código desconocido'}</span>
                </li>
              );
            })}
          </ul>
        </ModuleStyles.WarningCard>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <ModuleStyles.ChartCard title={'Tendencia Turbo'} icon={FaTachometerAlt}>
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
                dataKey="presionTurbo" 
                stroke="#8884d8" 
                strokeWidth={2} 
                name="Presión Turbo (bar)"
                dot={false}
                isAnimationActive={false}
              />
              <Line 
                type="monotone" 
                dataKey="rpmTurbo" 
                stroke="#82ca9d" 
                strokeWidth={2} 
                name="RPM Turbo"
                dot={false}
                isAnimationActive={false}
              />
              <Line 
                type="monotone" 
                dataKey="temperatura" 
                stroke="#ffc658" 
                strokeWidth={2} 
                name="Temperatura (°C)"
                dot={false}
                isAnimationActive={false}
              />
              <Line 
                type="monotone" 
                dataKey="flujoAire" 
                stroke="#ff7c7c" 
                strokeWidth={2} 
                name="Flujo Aire (g/s)"
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </ModuleStyles.ChartCard>

        <ModuleStyles.ChartCard title={'Parámetros Actuales'} icon={FaWind}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart 
              data={parametrosBarras}
              isAnimationActive={false}
              animationDuration={0}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="nombre" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{ backgroundColor: '#374151', border: 'none', borderRadius: '8px' }}
                formatter={(value, name, props) => [
                  `${value.toFixed(1)} ${props.payload.unidad}`,
                  'Valor'
                ]}
              />
              <Bar 
                dataKey="valor" 
                fill="#4f46e5"
                isAnimationActive={false}
              />
            </BarChart>
          </ResponsiveContainer>
        </ModuleStyles.ChartCard>
      </div>
    </div>
  );
}