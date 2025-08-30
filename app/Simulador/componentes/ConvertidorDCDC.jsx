'use client';

import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';
import { FaArrowLeft, FaBolt, FaThermometerHalf, FaTachometerAlt, FaExclamationTriangle, FaCog, FaExchangeAlt } from 'react-icons/fa';
import ModuleStyles from './styles/ModuleStyles';

export default function ConvertidorDCDC({ vehiculo, volver }) {
  const [datosEnTiempoReal, setDatosEnTiempoReal] = useState([]);
  const [parametrosActuales, setParametrosActuales] = useState({
    voltajeEntradaHV: 386.5,
    corrienteEntradaHV: 25.4,
    voltajeSalidaLV: 13.8,
    corrienteSalidaLV: 68.5,
    potenciaEntrada: 9.8,
    potenciaSalida: 9.4,
    eficiencia: 95.9,
    temperatura: 45,
    rippleVoltaje: 0.15,
    regulacionCarga: 98.5,
    frecuenciaConmutacion: 50,
    moduloControl: 'Operativo',
    sistemaPFC: 'Activo',
    proteccionSobrecarga: 'Normal',
    estado: 'Operativo'
  });

  const [alertas, setAlertas] = useState([]);

  useEffect(() => {
    const intervalo = setInterval(() => {
      const nuevosDatos = {
        tiempo: new Date().toLocaleTimeString(),
        voltajeEntradaHV: Math.max(320, Math.min(420, parametrosActuales.voltajeEntradaHV + (Math.random() - 0.5) * 3)),
        corrienteEntradaHV: Math.max(15, Math.min(40, parametrosActuales.corrienteEntradaHV + (Math.random() - 0.5) * 1.5)),
        voltajeSalidaLV: Math.max(12.5, Math.min(14.5, parametrosActuales.voltajeSalidaLV + (Math.random() - 0.5) * 0.1)),
        corrienteSalidaLV: Math.max(40, Math.min(100, parametrosActuales.corrienteSalidaLV + (Math.random() - 0.5) * 5)),
        temperatura: parametrosActuales.temperatura + (Math.random() - 0.5) * 0.4,
        rippleVoltaje: Math.max(0.05, Math.min(0.5, parametrosActuales.rippleVoltaje + (Math.random() - 0.5) * 0.02)),
        regulacionCarga: Math.max(95, Math.min(99.5, parametrosActuales.regulacionCarga + (Math.random() - 0.5) * 0.2)),
        frecuenciaConmutacion: Math.max(45, Math.min(55, parametrosActuales.frecuenciaConmutacion + (Math.random() - 0.5) * 1)),
        moduloControl: Math.random() > 0.99 ? 'Error' : 'Operativo',
        sistemaPFC: Math.random() > 0.995 ? 'Inactivo' : 'Activo',
        proteccionSobrecarga: Math.random() > 0.98 ? 'Activada' : 'Normal'
      };

      // Calcular potencias y eficiencia
      nuevosDatos.potenciaEntrada = (nuevosDatos.voltajeEntradaHV * nuevosDatos.corrienteEntradaHV) / 1000;
      nuevosDatos.potenciaSalida = (nuevosDatos.voltajeSalidaLV * nuevosDatos.corrienteSalidaLV) / 1000;
      nuevosDatos.eficiencia = Math.min(98, (nuevosDatos.potenciaSalida / nuevosDatos.potenciaEntrada) * 100);

      // Validar rangos y generar alertas
      const nuevasAlertas = [];
      if (nuevosDatos.temperatura > 70) nuevasAlertas.push('Temperatura convertidor DC/DC crítica');
      if (nuevosDatos.temperatura > 60) nuevasAlertas.push('Temperatura convertidor elevada');
      if (nuevosDatos.eficiencia < 92) nuevasAlertas.push('Eficiencia convertidor reducida');
      if (nuevosDatos.voltajeSalidaLV < 12.8 || nuevosDatos.voltajeSalidaLV > 14.2) nuevasAlertas.push('Voltaje salida 12V fuera de rango');
      if (nuevosDatos.voltajeEntradaHV < 340) nuevasAlertas.push('Voltaje entrada alta tensión bajo');
      if (nuevosDatos.rippleVoltaje > 0.3) nuevasAlertas.push('Ripple de voltaje elevado');
      if (nuevosDatos.regulacionCarga < 96) nuevasAlertas.push('Regulación de carga deficiente');
      if (nuevosDatos.moduloControl !== 'Operativo') nuevasAlertas.push('Fallo en módulo de control');
      if (nuevosDatos.sistemaPFC !== 'Activo') nuevasAlertas.push('Sistema PFC inactivo');
      if (nuevosDatos.proteccionSobrecarga !== 'Normal') nuevasAlertas.push('Protección sobrecarga activada');

      setParametrosActuales({
        ...nuevosDatos,
        estado: nuevasAlertas.length > 0 ? 'Advertencia' : 'Operativo'
      });
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
      case 'Normal':
      case 'Operativo':
      case 'Activo':
        return 'text-green-400';
      case 'Advertencia':
        return 'text-yellow-400';
      case 'Error':
      case 'Inactivo':
      case 'Activada':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const parametrosBarras = [
    { nombre: 'HV In', valor: parametrosActuales.voltajeEntradaHV, maximo: 450, unidad: 'V', color: '#8884d8' },
    { nombre: 'LV Out', valor: parametrosActuales.voltajeSalidaLV, maximo: 15, unidad: 'V', color: '#82ca9d' },
    { nombre: 'I HV', valor: parametrosActuales.corrienteEntradaHV, maximo: 50, unidad: 'A', color: '#ffc658' },
    { nombre: 'I LV', valor: parametrosActuales.corrienteSalidaLV, maximo: 120, unidad: 'A', color: '#ff7c7c' },
    { nombre: 'Temp', valor: parametrosActuales.temperatura, maximo: 80, unidad: '°C', color: '#a855f7' },
    { nombre: 'Efic', valor: parametrosActuales.eficiencia, maximo: 100, unidad: '%', color: '#06b6d4' }
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
          <FaExchangeAlt className="text-cyan-400" size={24} />
          <h1 className="text-xl md:text-2xl font-bold">Convertidor DC/DC</h1>
        </div>
        <div className="text-right text-sm">
          <div className="text-gray-400">{vehiculo.marca} {vehiculo.modelo}</div>
          <div className="text-cyan-400">HV → 12V</div>
        </div>
      </ModuleStyles.Header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
        <ModuleStyles.InfoCard title={'Entrada Alta Tensión'} icon={FaBolt}>
          <div className="space-y-3">
            <div className="text-center">
              <div className={`text-xl font-bold mb-2 ${
                parametrosActuales.voltajeEntradaHV < 340 ? 'text-red-400' : 'text-purple-400'
              }`}>
                {parametrosActuales.voltajeEntradaHV.toFixed(1)} V
              </div>
              <div className="text-sm text-gray-400">Voltaje HV</div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Corriente:</span>
                <span className="text-yellow-400 font-semibold">{parametrosActuales.corrienteEntradaHV.toFixed(1)} A</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Potencia:</span>
                <span className="text-blue-400 font-semibold">{parametrosActuales.potenciaEntrada.toFixed(1)} kW</span>
              </div>
            </div>
          </div>
        </ModuleStyles.InfoCard>

        <ModuleStyles.InfoCard title={'Salida Baja Tensión'} icon={FaBolt}>
          <div className="space-y-3">
            <div className="text-center">
              <div className={`text-xl font-bold mb-2 ${
                parametrosActuales.voltajeSalidaLV < 12.8 || parametrosActuales.voltajeSalidaLV > 14.2 ? 'text-red-400' : 'text-green-400'
              }`}>
                {parametrosActuales.voltajeSalidaLV.toFixed(1)} V
              </div>
              <div className="text-sm text-gray-400">Voltaje 12V</div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Corriente:</span>
                <span className="text-orange-400 font-semibold">{parametrosActuales.corrienteSalidaLV.toFixed(1)} A</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Potencia:</span>
                <span className="text-cyan-400 font-semibold">{parametrosActuales.potenciaSalida.toFixed(1)} kW</span>
              </div>
            </div>
          </div>
        </ModuleStyles.InfoCard>

        <ModuleStyles.InfoCard title="Rendimiento" icon={FaTachometerAlt}>
          <div className="space-y-3">
            <div className="text-center">
              <div className={`text-2xl font-bold mb-2 ${
                parametrosActuales.eficiencia < 92 ? 'text-red-400' :
                parametrosActuales.eficiencia < 95 ? 'text-yellow-400' : 'text-green-400'
              }`}>
                {parametrosActuales.eficiencia.toFixed(1)}%
              </div>
              <div className="text-sm text-gray-400">Eficiencia</div>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Regulación:</span>
                <span className={`font-semibold ${
                  parametrosActuales.regulacionCarga < 96 ? 'text-red-400' : 'text-green-400'
                }`}>{parametrosActuales.regulacionCarga.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Ripple:</span>
                <span className={`font-semibold ${
                  parametrosActuales.rippleVoltaje > 0.3 ? 'text-red-400' : 'text-green-400'
                }`}>{parametrosActuales.rippleVoltaje.toFixed(2)} V</span>
              </div>
            </div>
          </div>
        </ModuleStyles.InfoCard>

        <ModuleStyles.InfoCard title="Estado del Sistema" icon={FaCog}>
          <div className="space-y-3">
            <div className="text-center">
              <div className={`text-lg font-bold mb-2 ${getEstadoColor(parametrosActuales.estado)}`}>
                {parametrosActuales.estado}
              </div>
              <div className={`text-sm ${
                parametrosActuales.temperatura > 70 ? 'text-red-400' :
                parametrosActuales.temperatura > 60 ? 'text-yellow-400' : 'text-blue-400'
              }`}>
                {parametrosActuales.temperatura.toFixed(1)}°C
              </div>
            </div>
            
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-400">Control:</span>
                <span className={getEstadoColor(parametrosActuales.moduloControl)}>{parametrosActuales.moduloControl}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">PFC:</span>
                <span className={getEstadoColor(parametrosActuales.sistemaPFC)}>{parametrosActuales.sistemaPFC}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Protección:</span>
                <span className={getEstadoColor(parametrosActuales.proteccionSobrecarga)}>{parametrosActuales.proteccionSobrecarga}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Frec. Conm.:</span>
                <span className="text-cyan-400 font-semibold">{parametrosActuales.frecuenciaConmutacion.toFixed(0)} kHz</span>
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
        <ModuleStyles.ChartCard title={'Parámetros del Sistema'} icon={FaBolt}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={parametrosBarras} layout="horizontal" margin={{ left: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis type="number" stroke="#9CA3AF" />
              <YAxis dataKey="nombre" type="category" stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#374151', border: 'none', borderRadius: '8px' }}
                formatter={(value, name, props) => [
                  `${value.toFixed(1)} ${props.payload.unidad}`,
                  'Valor'
                ]}
              />
              <Bar dataKey="valor" fill="#06b6d4" />
            </BarChart>
          </ResponsiveContainer>
        </ModuleStyles.ChartCard>

        <ModuleStyles.ChartCard title="Flujo de Potencia" icon={FaExchangeAlt}>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={datosEnTiempoReal}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="tiempo" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#374151', border: 'none', borderRadius: '8px' }}
                labelStyle={{ color: '#D1D5DB' }}
              />
              <Area type="monotone" dataKey="potenciaEntrada" stackId="1" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} name="Entrada (kW)" />
              <Area type="monotone" dataKey="potenciaSalida" stackId="2" stroke="#10b981" fill="#10b981" fillOpacity={0.6} name="Salida (kW)" />
            </AreaChart>
          </ResponsiveContainer>
        </ModuleStyles.ChartCard>
      </div>

      <div className="mt-6">
        <ModuleStyles.ChartCard title="Tendencias del Convertidor" icon={FaThermometerHalf}>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={datosEnTiempoReal}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="tiempo" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#374151', border: 'none', borderRadius: '8px' }}
                labelStyle={{ color: '#D1D5DB' }}
              />
              <Line type="monotone" dataKey="eficiencia" stroke="#10b981" strokeWidth={2} name="Eficiencia (%)" />
              <Line type="monotone" dataKey="temperatura" stroke="#ef4444" strokeWidth={2} name="Temperatura (°C)" />
              <Line type="monotone" dataKey="voltajeSalidaLV" stroke="#3b82f6" strokeWidth={2} name="Voltaje 12V (V)" />
              <Line type="monotone" dataKey="regulacionCarga" stroke="#f59e0b" strokeWidth={2} name="Regulación (%)" />
            </LineChart>
          </ResponsiveContainer>
        </ModuleStyles.ChartCard>
      </div>
    </div>
  );
}
