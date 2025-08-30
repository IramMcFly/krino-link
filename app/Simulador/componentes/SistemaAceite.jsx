'use client';

import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { FaArrowLeft, FaOilCan, FaExclamationTriangle, FaTachometerAlt, FaTools } from 'react-icons/fa';
import ModuleStyles from './styles/ModuleStyles';

const DTC_LIST = [
  { code: 'P0520', desc: 'Sensor de presión de aceite del motor - circuito defectuoso' },
  { code: 'P0522', desc: 'Sensor de presión de aceite del motor - entrada baja' },
  { code: 'P0523', desc: 'Sensor de presión de aceite del motor - entrada alta' },
  { code: 'P250F', desc: 'Nivel de aceite del motor bajo' }
];

export default function SistemaAceite({ vehiculo, volver }) {
  const [datosEnTiempoReal, setDatosEnTiempoReal] = useState([]);
  const [parametrosActuales, setParametrosActuales] = useState({
    presionAceite: 2.2, // bar
    tempAceite: 85, // °C
    nivelAceite: 78, // %
    calidadAceite: 92, // %
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
          presionAceite: fallo
            ? Math.max(0.5, prev.presionAceite - Math.random() * 0.4)
            : Math.max(1.2, Math.min(3.5, prev.presionAceite + (Math.random() - 0.5) * 0.08)),
          tempAceite: prev.tempAceite + (Math.random() - 0.5) * 1.5 + (fallo ? 2 : 0),
          nivelAceite: fallo
            ? Math.max(10, prev.nivelAceite - Math.random() * 2)
            : Math.max(30, Math.min(100, prev.nivelAceite + (Math.random() - 0.5) * 0.3)),
          calidadAceite: fallo
            ? Math.max(50, prev.calidadAceite - Math.random() * 1.5)
            : Math.min(100, Math.max(80, prev.calidadAceite + (Math.random() - 0.5) * 0.2)),
          estado: 'Operativo'
        };

        // Diagnóstico y alertas
        const nuevasAlertas = [];
        const nuevosDTCs = [];
        if (nuevosDatos.presionAceite < 1.2) {
          nuevasAlertas.push('Presión de aceite baja');
          nuevosDTCs.push('P0522');
        }
        if (nuevosDatos.presionAceite > 3.2) {
          nuevasAlertas.push('Presión de aceite alta');
          nuevosDTCs.push('P0523');
        }
        if (nuevosDatos.nivelAceite < 30) {
          nuevasAlertas.push('Nivel de aceite bajo');
          nuevosDTCs.push('P250F');
        }
        if (nuevosDatos.tempAceite > 110) nuevasAlertas.push('Temperatura de aceite elevada');
        if (nuevosDatos.calidadAceite < 70) nuevasAlertas.push('Calidad de aceite deficiente');
        if (fallo) nuevosDTCs.push('P0520');

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
    }, 1300);

    return () => clearInterval(intervalo);
  }, [simularFallo]);

  const parametrosBarras = [
    { nombre: 'Presión Aceite', valor: parametrosActuales.presionAceite, maximo: 4, unidad: 'bar', color: '#8884d8' },
    { nombre: 'Temp. Aceite', valor: parametrosActuales.tempAceite, maximo: 130, unidad: '°C', color: '#ffc658' },
    { nombre: 'Nivel Aceite', valor: parametrosActuales.nivelAceite, maximo: 100, unidad: '%', color: '#ff7c7c' },
    { nombre: 'Calidad Aceite', valor: parametrosActuales.calidadAceite, maximo: 100, unidad: '%', color: '#82ca9d' }
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
          <FaOilCan className="text-yellow-400" size={24} />
          <h1 className="text-xl md:text-2xl font-bold">Sistema de Aceite Diesel</h1>
        </div>
        <div className="text-right text-sm">
          <div className="text-gray-400">{vehiculo?.marca} {vehiculo?.modelo}</div>
          <div className="text-blue-400">Diagnóstico Aceite</div>
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
        <ModuleStyles.InfoCard title={'Presión y Temperatura'} icon={FaTachometerAlt}>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-400">Presión Aceite:</span>
              <span className={`font-semibold ${
                parametrosActuales.presionAceite < 1.2 || parametrosActuales.presionAceite > 3.2 ? 'text-red-400' : 'text-blue-400'
              }`}>{parametrosActuales.presionAceite.toFixed(2)} bar</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Temp. Aceite:</span>
              <span className={`font-semibold ${
                parametrosActuales.tempAceite > 110 ? 'text-red-400' :
                  parametrosActuales.tempAceite > 95 ? 'text-yellow-400' : 'text-blue-400'
              }`}>{parametrosActuales.tempAceite.toFixed(1)}°C</span>
            </div>
          </div>
        </ModuleStyles.InfoCard>

        <ModuleStyles.InfoCard title={'Nivel y Calidad'} icon={FaOilCan}>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-400">Nivel Aceite:</span>
              <span className={`font-semibold ${
                parametrosActuales.nivelAceite < 30 ? 'text-red-400' : 'text-green-400'
              }`}>{parametrosActuales.nivelAceite.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Calidad Aceite:</span>
              <span className={`font-semibold ${
                parametrosActuales.calidadAceite < 70 ? 'text-red-400' : 'text-blue-400'
              }`}>{parametrosActuales.calidadAceite.toFixed(1)}%</span>
            </div>
          </div>
        </ModuleStyles.InfoCard>

        <ModuleStyles.InfoCard title={'Estado'} icon={FaOilCan}>
          <div className="space-y-4">
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
        <ModuleStyles.ChartCard title={'Tendencia Aceite'} icon={FaTachometerAlt}>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={datosEnTiempoReal}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="tiempo" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{ backgroundColor: '#374151', border: 'none', borderRadius: '8px' }}
                labelStyle={{ color: '#D1D5DB' }}
              />
              <Line type="monotone" dataKey="presionAceite" stroke="#8884d8" strokeWidth={2} name="Presión Aceite (bar)" />
              <Line type="monotone" dataKey="tempAceite" stroke="#ffc658" strokeWidth={2} name="Temp. Aceite (°C)" />
              <Line type="monotone" dataKey="nivelAceite" stroke="#ff7c7c" strokeWidth={2} name="Nivel Aceite (%)" />
              <Line type="monotone" dataKey="calidadAceite" stroke="#82ca9d" strokeWidth={2} name="Calidad Aceite (%)" />
            </LineChart>
          </ResponsiveContainer>
        </ModuleStyles.ChartCard>

        <ModuleStyles.ChartCard title={'Parámetros Actuales'} icon={FaOilCan}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={parametrosBarras}>
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
              <Bar dataKey="valor" fill="#4f46e5" />
            </BarChart>
          </ResponsiveContainer>
        </ModuleStyles.ChartCard>
      </div>
    </div>
  );
}