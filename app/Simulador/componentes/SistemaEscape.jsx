'use client';

import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { FaArrowLeft, FaCloud, FaExclamationTriangle, FaTachometerAlt, FaTools } from 'react-icons/fa';
import ModuleStyles from './styles/ModuleStyles';

const DTC_LIST = [
  { code: 'P2002', desc: 'Eficiencia del filtro de partículas diésel (DPF) por debajo del umbral' },
  { code: 'P0420', desc: 'Eficiencia del catalizador por debajo del umbral' },
  { code: 'P2459', desc: 'Frecuencia de regeneración del DPF demasiado alta' },
  { code: 'P244A', desc: 'Temperatura de gases de escape demasiado alta' }
];

export default function SistemaEscape({ vehiculo, volver }) {
  const [datosEnTiempoReal, setDatosEnTiempoReal] = useState([]);
  const [parametrosActuales, setParametrosActuales] = useState({
    tempGases: 320, // °C
    presionDPF: 0.18, // bar
    saturacionDPF: 38, // %
    eficienciaCatalizador: 92, // %
    flujoEscape: 210, // g/s
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
          tempGases: prev.tempGases + (Math.random() - 0.5) * 8 + (fallo ? 20 : 0),
          presionDPF: fallo
            ? Math.min(0.5, prev.presionDPF + Math.random() * 0.08)
            : Math.max(0.12, Math.min(0.28, prev.presionDPF + (Math.random() - 0.5) * 0.01)),
          saturacionDPF: fallo
            ? Math.min(100, prev.saturacionDPF + Math.random() * 2.5)
            : Math.max(10, Math.min(80, prev.saturacionDPF + (Math.random() - 0.5) * 0.7)),
          eficienciaCatalizador: fallo
            ? Math.max(60, prev.eficienciaCatalizador - Math.random() * 2)
            : Math.min(98, Math.max(85, prev.eficienciaCatalizador + (Math.random() - 0.5) * 0.5)),
          flujoEscape: fallo
            ? Math.max(100, Math.min(350, prev.flujoEscape + (Math.random() - 0.5) * 20 + (Math.random() > 0.5 ? -40 : 40)))
            : Math.max(150, Math.min(250, prev.flujoEscape + (Math.random() - 0.5) * 8)),
          estado: 'Operativo'
        };

        // Diagnóstico y alertas
        const nuevasAlertas = [];
        const nuevosDTCs = [];
        if (nuevosDatos.saturacionDPF > 80) {
          nuevasAlertas.push('Saturación del DPF elevada');
          nuevosDTCs.push('P2002');
        }
        if (nuevosDatos.eficienciaCatalizador < 85) {
          nuevasAlertas.push('Eficiencia del catalizador baja');
          nuevosDTCs.push('P0420');
        }
        if (nuevosDatos.tempGases > 450) {
          nuevasAlertas.push('Temperatura de gases de escape elevada');
          nuevosDTCs.push('P244A');
        }
        if (nuevosDatos.saturacionDPF > 60 && nuevosDatos.saturacionDPF < 80 && Math.random() > 0.7) {
          nuevasAlertas.push('Regeneración frecuente del DPF');
          nuevosDTCs.push('P2459');
        }

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
    }, 1400);

    return () => clearInterval(intervalo);
  }, [simularFallo]);

  const parametrosBarras = [
    { nombre: 'Temp. Gases', valor: parametrosActuales.tempGases, maximo: 600, unidad: '°C', color: '#ffc658' },
    { nombre: 'Presión DPF', valor: parametrosActuales.presionDPF, maximo: 0.5, unidad: 'bar', color: '#8884d8' },
    { nombre: 'Saturación DPF', valor: parametrosActuales.saturacionDPF, maximo: 100, unidad: '%', color: '#ff7c7c' },
    { nombre: 'Eficiencia Cat.', valor: parametrosActuales.eficienciaCatalizador, maximo: 100, unidad: '%', color: '#82ca9d' }
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
          <FaCloud className="text-yellow-400" size={24} />
          <h1 className="text-xl md:text-2xl font-bold">Sistema de Escape Diesel</h1>
        </div>
        <div className="text-right text-sm">
          <div className="text-gray-400">{vehiculo?.marca} {vehiculo?.modelo}</div>
          <div className="text-blue-400">Diagnóstico Escape</div>
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
        <ModuleStyles.InfoCard title={'DPF y Catalizador'} icon={FaCloud}>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-400">Saturación DPF:</span>
              <span className={`font-semibold ${
                parametrosActuales.saturacionDPF > 80 ? 'text-red-400' :
                parametrosActuales.saturacionDPF > 60 ? 'text-yellow-400' : 'text-green-400'
              }`}>{parametrosActuales.saturacionDPF.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Eficiencia Catalizador:</span>
              <span className={`font-semibold ${
                parametrosActuales.eficienciaCatalizador < 85 ? 'text-red-400' : 'text-blue-400'
              }`}>{parametrosActuales.eficienciaCatalizador.toFixed(1)}%</span>
            </div>
          </div>
        </ModuleStyles.InfoCard>

        <ModuleStyles.InfoCard title={'Temperatura y Presión'} icon={FaTachometerAlt}>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-400">Temp. Gases:</span>
              <span className={`font-semibold ${
                parametrosActuales.tempGases > 450 ? 'text-red-400' :
                parametrosActuales.tempGases > 400 ? 'text-yellow-400' : 'text-blue-400'
              }`}>{parametrosActuales.tempGases.toFixed(1)}°C</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Presión DPF:</span>
              <span className={`font-semibold ${
                parametrosActuales.presionDPF > 0.4 ? 'text-red-400' : 'text-green-400'
              }`}>{parametrosActuales.presionDPF.toFixed(3)} bar</span>
            </div>
          </div>
        </ModuleStyles.InfoCard>

        <ModuleStyles.InfoCard title={'Flujo y Estado'} icon={FaCloud}>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-400">Flujo Escape:</span>
              <span className="font-semibold text-green-400">{parametrosActuales.flujoEscape.toFixed(1)} g/s</span>
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
        <ModuleStyles.ChartCard title={'Tendencia Escape'} icon={FaTachometerAlt}>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={datosEnTiempoReal} isAnimationActive={false} animationDuration={0}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="tiempo" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{ backgroundColor: '#374151', border: 'none', borderRadius: '8px' }}
                labelStyle={{ color: '#D1D5DB' }}
              />
              <Line type="monotone" dataKey="tempGases" stroke="#ffc658" strokeWidth={2} name="Temp. Gases (°C)" dot={false} isAnimationActive={false} />
              <Line type="monotone" dataKey="presionDPF" stroke="#8884d8" strokeWidth={2} name="Presión DPF (bar)" dot={false} isAnimationActive={false} />
              <Line type="monotone" dataKey="saturacionDPF" stroke="#ff7c7c" strokeWidth={2} name="Saturación DPF (%)" dot={false} isAnimationActive={false} />
              <Line type="monotone" dataKey="eficienciaCatalizador" stroke="#82ca9d" strokeWidth={2} name="Eficiencia Cat. (%)" dot={false} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </ModuleStyles.ChartCard>

        <ModuleStyles.ChartCard title={'Parámetros Actuales'} icon={FaCloud}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={parametrosBarras} isAnimationActive={false} animationDuration={0}>
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
              <Bar dataKey="valor" fill="#4f46e5" isAnimationActive={false} />
            </BarChart>
          </ResponsiveContainer>
        </ModuleStyles.ChartCard>
      </div>
    </div>
  );
}