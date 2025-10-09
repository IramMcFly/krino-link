'use client';

import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { FaArrowLeft, FaBolt, FaThermometerHalf, FaTachometerAlt, FaExclamationTriangle, FaCog, FaMicrochip } from 'react-icons/fa';
import ModuleStyles from './styles/ModuleStyles';

export default function Inversor({ vehiculo, volver }) {
  const [datosEnTiempoReal, setDatosEnTiempoReal] = useState([]);
  const [parametrosActuales, setParametrosActuales] = useState({
    voltajeEntradaDC: 386.5,
    corrienteEntradaDC: 45.2,
    voltajeSalidaAC: 240.8,
    corrienteSalidaAC: 52.1,
    frecuencia: 60.2,
    potenciaEntrada: 17.5,
    potenciaSalida: 15.8,
    eficiencia: 90.3,
    temperatura: 58,
    moduloIGBT: 'Normal',
    moduloControl: 'Operativo',
    sistemaPWM: 'Activo',
    factorPotencia: 0.96,
    THD: 2.3,
    estado: 'Operativo'
  });

  const [alertas, setAlertas] = useState([]);

  useEffect(() => {
    const intervalo = setInterval(() => {
      const nuevosDatos = {
        tiempo: new Date().toLocaleTimeString(),
        voltajeEntradaDC: Math.max(300, Math.min(450, parametrosActuales.voltajeEntradaDC + (Math.random() - 0.5) * 5)),
        corrienteEntradaDC: Math.max(20, Math.min(80, parametrosActuales.corrienteEntradaDC + (Math.random() - 0.5) * 3)),
        voltajeSalidaAC: parametrosActuales.voltajeSalidaAC + (Math.random() - 0.5) * 2,
        corrienteSalidaAC: Math.max(10, Math.min(100, parametrosActuales.corrienteSalidaAC + (Math.random() - 0.5) * 4)),
        frecuencia: Math.max(59.5, Math.min(60.5, parametrosActuales.frecuencia + (Math.random() - 0.5) * 0.1)),
        temperatura: parametrosActuales.temperatura + (Math.random() - 0.5) * 0.5,
        moduloIGBT: Math.random() > 0.98 ? 'Advertencia' : 'Normal',
        moduloControl: Math.random() > 0.99 ? 'Error' : 'Operativo',
        sistemaPWM: Math.random() > 0.995 ? 'Inactivo' : 'Activo',
        factorPotencia: Math.max(0.85, Math.min(1.0, parametrosActuales.factorPotencia + (Math.random() - 0.5) * 0.02)),
        THD: Math.max(1.5, Math.min(5.0, parametrosActuales.THD + (Math.random() - 0.5) * 0.2))
      };

      // Calcular potencias y eficiencia
      nuevosDatos.potenciaEntrada = (nuevosDatos.voltajeEntradaDC * nuevosDatos.corrienteEntradaDC) / 1000;
      nuevosDatos.potenciaSalida = (nuevosDatos.voltajeSalidaAC * nuevosDatos.corrienteSalidaAC * Math.sqrt(3) * nuevosDatos.factorPotencia) / 1000;
      nuevosDatos.eficiencia = Math.min(95, (nuevosDatos.potenciaSalida / nuevosDatos.potenciaEntrada) * 100);

      // Validar rangos y generar alertas
      const nuevasAlertas = [];
      if (nuevosDatos.temperatura > 80) nuevasAlertas.push('Temperatura inversor crítica');
      if (nuevosDatos.temperatura > 70) nuevasAlertas.push('Temperatura inversor elevada');
      if (nuevosDatos.eficiencia < 85) nuevasAlertas.push('Eficiencia inversor reducida');
      if (nuevosDatos.voltajeEntradaDC < 320) nuevasAlertas.push('Voltaje DC entrada bajo');
      if (nuevosDatos.THD > 4) nuevasAlertas.push('Distorsión armónica elevada');
      if (nuevosDatos.moduloIGBT !== 'Normal') nuevasAlertas.push('Problema en módulo IGBT');
      if (nuevosDatos.moduloControl !== 'Operativo') nuevasAlertas.push('Fallo en módulo de control');
      if (nuevosDatos.sistemaPWM !== 'Activo') nuevasAlertas.push('Sistema PWM inactivo');

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
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const datosEficiencia = [
    { nombre: 'Eficiencia Actual', valor: parametrosActuales.eficiencia, color: '#10b981' },
    { nombre: 'Pérdidas', valor: 100 - parametrosActuales.eficiencia, color: '#ef4444' }
  ];

  const parametrosBarras = [
    { nombre: 'V DC', valor: parametrosActuales.voltajeEntradaDC, maximo: 450, unidad: 'V', color: '#8884d8' },
    { nombre: 'V AC', valor: parametrosActuales.voltajeSalidaAC, maximo: 280, unidad: 'V', color: '#82ca9d' },
    { nombre: 'I DC', valor: parametrosActuales.corrienteEntradaDC, maximo: 80, unidad: 'A', color: '#ffc658' },
    { nombre: 'I AC', valor: parametrosActuales.corrienteSalidaAC, maximo: 100, unidad: 'A', color: '#ff7c7c' }
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
          <FaMicrochip className="text-purple-400" size={24} />
          <h1 className="text-xl md:text-2xl font-bold">Inversor DC/AC</h1>
        </div>
        <div className="text-right text-sm">
          <div className="text-gray-400">{vehiculo.marca} {vehiculo.modelo}</div>
          <div className="text-purple-400">IGBT Trifásico</div>
        </div>
      </ModuleStyles.Header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
        <ModuleStyles.InfoCard title={'Entrada DC'} icon={FaBolt}>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Voltaje:</span>
              <span className={`font-semibold ${
                parametrosActuales.voltajeEntradaDC < 320 ? 'text-red-400' : 'text-purple-400'
              }`}>{parametrosActuales.voltajeEntradaDC.toFixed(1)} V</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Corriente:</span>
              <span className="font-semibold text-yellow-400">{parametrosActuales.corrienteEntradaDC.toFixed(1)} A</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Potencia:</span>
              <span className="font-semibold text-blue-400">{parametrosActuales.potenciaEntrada.toFixed(1)} kW</span>
            </div>
          </div>
        </ModuleStyles.InfoCard>

        <ModuleStyles.InfoCard title={'Salida AC'} icon={FaBolt}>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Voltaje:</span>
              <span className="font-semibold text-green-400">{parametrosActuales.voltajeSalidaAC.toFixed(1)} V</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Corriente:</span>
              <span className="font-semibold text-orange-400">{parametrosActuales.corrienteSalidaAC.toFixed(1)} A</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Frecuencia:</span>
              <span className="font-semibold text-cyan-400">{parametrosActuales.frecuencia.toFixed(1)} Hz</span>
            </div>
          </div>
        </ModuleStyles.InfoCard>

        <ModuleStyles.InfoCard title={'Rendimiento'} icon={FaTachometerAlt}>
          <div className="space-y-3">
            <div className="text-center">
              <div className={`text-2xl font-bold mb-2 ${
                parametrosActuales.eficiencia < 85 ? 'text-red-400' :
                parametrosActuales.eficiencia < 90 ? 'text-yellow-400' : 'text-green-400'
              }`}>
                {parametrosActuales.eficiencia.toFixed(1)}%
              </div>
              <div className="text-sm text-gray-400">Eficiencia</div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">F.P.:</span>
                <span className="text-blue-400 font-semibold">{parametrosActuales.factorPotencia.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">THD:</span>
                <span className={`font-semibold ${
                  parametrosActuales.THD > 4 ? 'text-red-400' : 'text-green-400'
                }`}>{parametrosActuales.THD.toFixed(1)}%</span>
              </div>
            </div>
          </div>
        </ModuleStyles.InfoCard>

        <ModuleStyles.InfoCard title={'Estado del Sistema'} icon={FaCog}>
          <div className="space-y-3">
            <div className="text-center">
              <div className={`text-lg font-bold mb-2 ${getEstadoColor(parametrosActuales.estado)}`}>
                {parametrosActuales.estado}
              </div>
              <div className={`text-sm ${
                parametrosActuales.temperatura > 80 ? 'text-red-400' :
                parametrosActuales.temperatura > 70 ? 'text-yellow-400' : 'text-blue-400'
              }`}>
                {parametrosActuales.temperatura.toFixed(1)}°C
              </div>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">IGBT:</span>
                <span className={getEstadoColor(parametrosActuales.moduloIGBT)}>{parametrosActuales.moduloIGBT}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Control:</span>
                <span className={getEstadoColor(parametrosActuales.moduloControl)}>{parametrosActuales.moduloControl}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">PWM:</span>
                <span className={getEstadoColor(parametrosActuales.sistemaPWM)}>{parametrosActuales.sistemaPWM}</span>
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

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <ModuleStyles.ChartCard title={'Parámetros Eléctricos'} icon={FaBolt}>
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
              <Bar dataKey="valor" fill="#8b5cf6" isAnimationActive={false} />
            </BarChart>
          </ResponsiveContainer>
        </ModuleStyles.ChartCard>

        <ModuleStyles.ChartCard title={'Eficiencia del Sistema'} icon={FaTachometerAlt}>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={datosEficiencia}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                dataKey="valor"
                startAngle={90}
                endAngle={450}
              >
                {datosEficiencia.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value.toFixed(1)}%`, 'Porcentaje']} />
            </PieChart>
          </ResponsiveContainer>
        </ModuleStyles.ChartCard>

        <ModuleStyles.ChartCard title={'Tendencias en Tiempo Real'} icon={FaThermometerHalf}>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={datosEnTiempoReal} isAnimationActive={false} animationDuration={0}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="tiempo" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#374151', border: 'none', borderRadius: '8px' }}
                labelStyle={{ color: '#D1D5DB' }}
              />
              <Line type="monotone" dataKey="eficiencia" stroke="#10b981" strokeWidth={2} name="Eficiencia (%)" dot={false} isAnimationActive={false} />
              <Line type="monotone" dataKey="temperatura" stroke="#ef4444" strokeWidth={2} name="Temperatura (°C)" dot={false} isAnimationActive={false} />
              <Line type="monotone" dataKey="THD" stroke="#f59e0b" strokeWidth={2} name="THD (%)" dot={false} isAnimationActive={false} />
              <Line type="monotone" dataKey="factorPotencia" stroke="#06b6d4" strokeWidth={2} name="Factor Potencia" dot={false} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </ModuleStyles.ChartCard>
      </div>
    </div>
  );
}
