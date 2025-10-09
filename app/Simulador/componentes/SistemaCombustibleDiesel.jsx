'use client';

import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { FaArrowLeft, FaGasPump, FaThermometerHalf, FaTachometerAlt, FaExclamationTriangle, FaCog, FaTools } from 'react-icons/fa';
import ModuleStyles from './styles/ModuleStyles';

const DTC_LIST = [
  { code: 'P0087', desc: 'Presión de combustible/raíl demasiado baja' },
  { code: 'P0191', desc: 'Rango/rendimiento del sensor de presión de raíl' },
  { code: 'P0251', desc: 'Mal funcionamiento del regulador de bomba de inyección' },
  { code: 'P0263', desc: 'Cilindro 1 – contribución/desequilibrio' },
  { code: 'P0628', desc: 'Circuito de control de la bomba de combustible bajo' }
];

export default function SistemaCombustibleDiesel({ vehiculo, volver }) {
  const [datosEnTiempoReal, setDatosEnTiempoReal] = useState([]);
  const [parametrosActuales, setParametrosActuales] = useState({
    nivelCombustible: 62.5,
    presionCombustible: 4.2,
    temperatura: 28,
    flujo: 14.2,
    presionVapor: 0.75,
    consumo: 7.2,
    estadoBomba: 'Operativa',
    estadoFiltro: 'Normal',
    estadoInyectores: 'Óptimo',
    estadoTanque: 'Normal',
    kmRestantes: 520
  });

  const [alertas, setAlertas] = useState([]);
  const [dtcs, setDtcs] = useState([]);
  const [simularFallo, setSimularFallo] = useState(false);

  useEffect(() => {
    const intervalo = setInterval(() => {
      setParametrosActuales(prev => {
        // Simulación de fallo: fuerza valores fuera de rango y DTCs
        let fallo = simularFallo;
        const nuevosDatos = {
          tiempo: new Date().toLocaleTimeString(),
          nivelCombustible: Math.max(5, prev.nivelCombustible - Math.random() * 0.03 - (fallo ? 0.1 : 0)),
          presionCombustible: fallo
            ? Math.max(2.5, prev.presionCombustible - Math.random() * 0.2)
            : Math.max(3.2, Math.min(4.8, prev.presionCombustible + (Math.random() - 0.5) * 0.1)),
          temperatura: prev.temperatura + (Math.random() - 0.5) * 0.4 + (fallo ? 0.5 : 0),
          flujo: fallo
            ? Math.max(6, prev.flujo - Math.random() * 1.5)
            : Math.max(8, Math.min(18, prev.flujo + (Math.random() - 0.5) * 0.8)),
          presionVapor: Math.max(0.5, Math.min(1.2, prev.presionVapor + (Math.random() - 0.5) * 0.05)),
          consumo: fallo
            ? Math.min(15, prev.consumo + Math.random() * 0.6)
            : Math.max(4.5, Math.min(12, prev.consumo + (Math.random() - 0.5) * 0.3)),
          estadoBomba: fallo
            ? 'Advertencia'
            : (Math.random() > 0.98 ? 'Advertencia' : 'Operativa'),
          estadoFiltro: Math.random() > 0.99 ? 'Saturado' : 'Normal',
          estadoInyectores: fallo
            ? 'Advertencia'
            : (Math.random() > 0.97 ? 'Advertencia' : 'Óptimo'),
          estadoTanque: 'Normal',
          kmRestantes: Math.max(0, prev.kmRestantes - Math.random() * 0.6 - (fallo ? 0.2 : 0))
        };

        // Diagnóstico y alertas
        const nuevasAlertas = [];
        const nuevosDTCs = [];
        if (nuevosDatos.nivelCombustible < 15) nuevasAlertas.push('Nivel de combustible bajo');
        if (nuevosDatos.presionCombustible < 3.5) {
          nuevasAlertas.push('Presión de combustible insuficiente');
          nuevosDTCs.push('P0087');
        }
        if (nuevosDatos.temperatura > 50) nuevasAlertas.push('Temperatura combustible elevada');
        if (nuevosDatos.estadoBomba !== 'Operativa') {
          nuevasAlertas.push('Problema en bomba de combustible');
          nuevosDTCs.push('P0628');
        }
        if (nuevosDatos.estadoFiltro !== 'Normal') nuevasAlertas.push('Filtro de combustible requiere atención');
        if (nuevosDatos.estadoInyectores !== 'Óptimo') {
          nuevasAlertas.push('Inyectores requieren servicio');
          nuevosDTCs.push('P0263');
        }
        if (nuevosDatos.consumo > 10) nuevasAlertas.push('Consumo de combustible elevado');
        if (fallo) {
          nuevosDTCs.push('P0191', 'P0251');
        }

        setAlertas(nuevasAlertas);
        setDtcs([...new Set(nuevosDTCs)]);

        setDatosEnTiempoReal(prevDatos => {
          const nuevosRegistros = [...prevDatos, nuevosDatos];
          return nuevosRegistros.slice(-20);
        });

        return nuevosDatos;
      });
    }, 1500);

    return () => clearInterval(intervalo);
  }, [simularFallo]);

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'Operativa':
      case 'Normal':
      case 'Óptimo':
        return 'text-green-400';
      case 'Advertencia':
      case 'Saturado':
        return 'text-yellow-400';
      default:
        return 'text-red-400';
    }
  };

  const parametrosBarras = [
    { nombre: 'Presión', valor: parametrosActuales.presionCombustible, maximo: 5, unidad: 'bar', color: '#8884d8' },
    { nombre: 'Flujo', valor: parametrosActuales.flujo, maximo: 20, unidad: 'L/h', color: '#82ca9d' },
    { nombre: 'Temperatura', valor: parametrosActuales.temperatura, maximo: 60, unidad: '°C', color: '#ffc658' },
    { nombre: 'Consumo', valor: parametrosActuales.consumo, maximo: 15, unidad: 'L/100km', color: '#ff7c7c' }
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
          <h1 className="text-xl md:text-2xl font-bold">Sistema de Combustible Diesel</h1>
        </div>
        <div className="text-right text-sm">
          <div className="text-gray-400">{vehiculo?.marca} {vehiculo?.modelo}</div>
          <div className="text-blue-400">Diagnóstico Diesel</div>
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
        <ModuleStyles.InfoCard title={'Nivel de Combustible'} icon={FaGasPump}>
          <div className="space-y-4">
            <div className="text-center">
              <div className={`text-3xl font-bold mb-2 ${
                parametrosActuales.nivelCombustible < 15 ? 'text-red-400' :
                  parametrosActuales.nivelCombustible < 30 ? 'text-yellow-400' : 'text-green-400'
              }`}>
                {parametrosActuales.nivelCombustible.toFixed(1)}%
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3 mb-2">
                <div
                  className={`h-3 rounded-full transition-all duration-1000 ${
                    parametrosActuales.nivelCombustible < 15 ? 'bg-red-400' :
                      parametrosActuales.nivelCombustible < 30 ? 'bg-yellow-400' : 'bg-green-400'
                  }`}
                  style={{ width: `${parametrosActuales.nivelCombustible}%` }}
                ></div>
              </div>
              <div className="text-sm text-gray-400">
                ~{parametrosActuales.kmRestantes.toFixed(0)} km restantes
              </div>
            </div>
          </div>
        </ModuleStyles.InfoCard>

        <ModuleStyles.InfoCard title={'Parámetros Operativos'} icon={FaTachometerAlt}>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Presión:</span>
              <span className={`font-semibold ${
                parametrosActuales.presionCombustible < 3.5 ? 'text-red-400' : 'text-blue-400'
              }`}>{parametrosActuales.presionCombustible.toFixed(1)} bar</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Flujo:</span>
              <span className="font-semibold text-green-400">{parametrosActuales.flujo.toFixed(1)} L/h</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Consumo:</span>
              <span className={`font-semibold ${
                parametrosActuales.consumo > 10 ? 'text-red-400' : 'text-yellow-400'
              }`}>{parametrosActuales.consumo.toFixed(1)} L/100km</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">P. Vapor:</span>
              <span className="font-semibold text-purple-400">{parametrosActuales.presionVapor.toFixed(2)} bar</span>
            </div>
          </div>
        </ModuleStyles.InfoCard>

        <ModuleStyles.InfoCard title={'Estado Componentes'} icon={FaCog}>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Bomba:</span>
              <span className={`font-semibold ${getEstadoColor(parametrosActuales.estadoBomba)}`}>
                {parametrosActuales.estadoBomba}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Filtro:</span>
              <span className={`font-semibold ${getEstadoColor(parametrosActuales.estadoFiltro)}`}>
                {parametrosActuales.estadoFiltro}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Inyectores:</span>
              <span className={`font-semibold ${getEstadoColor(parametrosActuales.estadoInyectores)}`}>
                {parametrosActuales.estadoInyectores}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Temperatura:</span>
              <span className={`font-semibold ${
                parametrosActuales.temperatura > 50 ? 'text-red-400' :
                  parametrosActuales.temperatura > 40 ? 'text-yellow-400' : 'text-blue-400'
              }`}>{parametrosActuales.temperatura.toFixed(1)}°C</span>
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
        <ModuleStyles.ChartCard title={'Tendencia Parámetros'} icon={FaTachometerAlt}>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={datosEnTiempoReal} isAnimationActive={false} animationDuration={0}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="tiempo" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{ backgroundColor: '#374151', border: 'none', borderRadius: '8px' }}
                labelStyle={{ color: '#D1D5DB' }}
              />
              <Line type="monotone" dataKey="presionCombustible" stroke="#8884d8" strokeWidth={2} name="Presión (bar)" dot={false} isAnimationActive={false} />
              <Line type="monotone" dataKey="flujo" stroke="#82ca9d" strokeWidth={2} name="Flujo (L/h)" dot={false} isAnimationActive={false} />
              <Line type="monotone" dataKey="temperatura" stroke="#ffc658" strokeWidth={2} name="Temperatura (°C)" dot={false} isAnimationActive={false} />
              <Line type="monotone" dataKey="consumo" stroke="#ff7c7c" strokeWidth={2} name="Consumo (L/100km)" dot={false} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </ModuleStyles.ChartCard>

        <ModuleStyles.ChartCard title={'Parámetros Actuales'} icon={FaThermometerHalf}>
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