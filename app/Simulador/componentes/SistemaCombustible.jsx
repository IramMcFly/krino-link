'use client';

import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { FaArrowLeft, FaGasPump, FaThermometerHalf, FaTachometerAlt, FaExclamationTriangle, FaCog } from 'react-icons/fa';
import ModuleStyles from './styles/ModuleStyles';

export default function SistemaCombustible({ vehiculo, volver }) {
  const [datosEnTiempoReal, setDatosEnTiempoReal] = useState([]);
  const [parametrosActuales, setParametrosActuales] = useState({
    nivelCombustible: 68.5,
    presionCombustible: 3.8,
    temperatura: 32,
    flujo: 12.5,
    presionVapor: 0.85,
    consumo: 6.8,
    estadoBomba: 'Operativa',
    estadoFiltro: 'Normal',
    estadoInyectores: 'Optimo',
    estadoTanque: 'Normal',
    kmRestantes: 425
  });

  const [alertas, setAlertas] = useState([]);

  useEffect(() => {
    const intervalo = setInterval(() => {
      const nuevosDatos = {
        tiempo: new Date().toLocaleTimeString(),
        nivelCombustible: Math.max(5, parametrosActuales.nivelCombustible - Math.random() * 0.02),
        presionCombustible: Math.max(3.2, Math.min(4.5, parametrosActuales.presionCombustible + (Math.random() - 0.5) * 0.1)),
        temperatura: parametrosActuales.temperatura + (Math.random() - 0.5) * 0.3,
        flujo: Math.max(8, Math.min(18, parametrosActuales.flujo + (Math.random() - 0.5) * 0.8)),
        presionVapor: Math.max(0.5, Math.min(1.2, parametrosActuales.presionVapor + (Math.random() - 0.5) * 0.05)),
        consumo: Math.max(4.5, Math.min(12, parametrosActuales.consumo + (Math.random() - 0.5) * 0.3)),
        estadoBomba: Math.random() > 0.98 ? 'Advertencia' : 'Operativa',
        estadoFiltro: Math.random() > 0.99 ? 'Saturado' : 'Normal',
        estadoInyectores: Math.random() > 0.97 ? 'Advertencia' : 'Optimo',
        estadoTanque: 'Normal',
        kmRestantes: Math.max(0, parametrosActuales.kmRestantes - Math.random() * 0.5)
      };

      // Validar rangos y generar alertas
      const nuevasAlertas = [];
      if (nuevosDatos.nivelCombustible < 15) nuevasAlertas.push('Nivel de combustible bajo');
      if (nuevosDatos.presionCombustible < 3.5) nuevasAlertas.push('Presión de combustible insuficiente');
      if (nuevosDatos.temperatura > 50) nuevasAlertas.push('Temperatura combustible elevada');
      if (nuevosDatos.estadoBomba !== 'Operativa') nuevasAlertas.push('Problema en bomba de combustible');
      if (nuevosDatos.estadoFiltro !== 'Normal') nuevasAlertas.push('Filtro de combustible requiere atención');
      if (nuevosDatos.estadoInyectores !== 'Optimo') nuevasAlertas.push('Inyectores requieren servicio');
      if (nuevosDatos.consumo > 10) nuevasAlertas.push('Consumo de combustible elevado');

      setParametrosActuales(nuevosDatos);
      setAlertas(nuevasAlertas);

      setDatosEnTiempoReal(prev => {
        const nuevosRegistros = [...prev, nuevosDatos];
        return nuevosRegistros.slice(-20);
      });
    }, 1500);

    return () => clearInterval(intervalo);
  }, [parametrosActuales]);

  const getEstadoColor = (estado) => {
    switch(estado) {
      case 'Operativa':
      case 'Normal':
      case 'Optimo':
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
          <FaGasPump className="text-blue-400" size={24} />
          <h1 className="text-xl md:text-2xl font-bold">Sistema de Combustible</h1>
        </div>
        <div className="text-right text-sm">
          <div className="text-gray-400">{vehiculo.marca} {vehiculo.modelo}</div>
          <div className="text-blue-400">Sistema de Inyección</div>
        </div>
      </ModuleStyles.Header>

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

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <ModuleStyles.ChartCard title={'Tendencia Parámetros'} icon={FaTachometerAlt}>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={datosEnTiempoReal}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="tiempo" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#374151', border: 'none', borderRadius: '8px' }}
                labelStyle={{ color: '#D1D5DB' }}
              />
              <Line type="monotone" dataKey="presionCombustible" stroke="#8884d8" strokeWidth={2} name="Presión (bar)" />
              <Line type="monotone" dataKey="flujo" stroke="#82ca9d" strokeWidth={2} name="Flujo (L/h)" />
              <Line type="monotone" dataKey="temperatura" stroke="#ffc658" strokeWidth={2} name="Temperatura (°C)" />
              <Line type="monotone" dataKey="consumo" stroke="#ff7c7c" strokeWidth={2} name="Consumo (L/100km)" />
            </LineChart>
          </ResponsiveContainer>
        </ModuleStyles.ChartCard>

        <ModuleStyles.ChartCard title={'Parámetros Actuales'} icon={FaThermometerHalf}>
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
