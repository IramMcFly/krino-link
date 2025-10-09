'use client';

import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { FaArrowLeft, FaBolt, FaPlug, FaThermometerHalf, FaTachometerAlt, FaExclamationTriangle, FaBatteryFull } from 'react-icons/fa';
import ModuleStyles from './styles/ModuleStyles';

export default function SistemaCarga({ vehiculo, volver }) {
  const [datosEnTiempoReal, setDatosEnTiempoReal] = useState([]);
  const [parametrosActuales, setParametrosActuales] = useState({
    estadoCarga: 'Desconectado',
    nivelBateria: 78.5,
    voltajeEntrada: 0,
    corrienteCarga: 0,
    potenciaCarga: 0,
    temperatura: 25,
    tiempoRestante: 0,
    eficienciaCarga: 92.5,
    tipoConector: 'Type 2',
    velocidadCarga: 'AC Lenta',
    temperaturaBMS: 28,
    estadoConector: 'Desconectado'
  });

  const [tiposCarga] = useState(['AC Lenta', 'AC Rápida', 'DC Rápida', 'DC Ultra Rápida']);
  const [alertas, setAlertas] = useState([]);

  useEffect(() => {
    const intervalo = setInterval(() => {
      // Simular conexión/desconexión aleatoria
      const conectado = Math.random() > 0.7 ? true : parametrosActuales.estadoCarga !== 'Desconectado';
      
      let nuevoEstado = parametrosActuales.estadoCarga;
      let nuevoVoltaje = 0;
      let nuevaCorriente = 0;
      let nuevaPotencia = 0;
      let nuevaVelocidad = parametrosActuales.velocidadCarga;
      let tiempoRestante = 0;

      if (conectado && parametrosActuales.nivelBateria < 95) {
        nuevoEstado = 'Cargando';
        
        // Determinar tipo de carga aleatoriamente cuando se conecta
        if (parametrosActuales.estadoCarga === 'Desconectado') {
          nuevaVelocidad = tiposCarga[Math.floor(Math.random() * tiposCarga.length)];
        }

        switch(nuevaVelocidad) {
          case 'AC Lenta':
            nuevoVoltaje = 230 + (Math.random() - 0.5) * 10;
            nuevaCorriente = 16 + (Math.random() - 0.5) * 2;
            nuevaPotencia = (nuevoVoltaje * nuevaCorriente) / 1000;
            break;
          case 'AC Rápida':
            nuevoVoltaje = 400 + (Math.random() - 0.5) * 20;
            nuevaCorriente = 32 + (Math.random() - 0.5) * 4;
            nuevaPotencia = (nuevoVoltaje * nuevaCorriente) / 1000;
            break;
          case 'DC Rápida':
            nuevoVoltaje = 400 + (Math.random() - 0.5) * 30;
            nuevaCorriente = 125 + (Math.random() - 0.5) * 15;
            nuevaPotencia = (nuevoVoltaje * nuevaCorriente) / 1000;
            break;
          case 'DC Ultra Rápida':
            nuevoVoltaje = 800 + (Math.random() - 0.5) * 50;
            nuevaCorriente = 200 + (Math.random() - 0.5) * 25;
            nuevaPotencia = (nuevoVoltaje * nuevaCorriente) / 1000;
            break;
        }

        // Calcular tiempo restante estimado
        const capacidadRestante = (100 - parametrosActuales.nivelBateria) / 100 * (vehiculo.especificaciones?.bateria || 64);
        tiempoRestante = (capacidadRestante / nuevaPotencia) * 60; // en minutos
      } else if (parametrosActuales.nivelBateria >= 95) {
        nuevoEstado = 'Completa';
      } else {
        nuevoEstado = 'Desconectado';
        nuevaVelocidad = 'AC Lenta';
      }

      const nuevosDatos = {
        tiempo: new Date().toLocaleTimeString(),
        estadoCarga: nuevoEstado,
        nivelBateria: nuevoEstado === 'Cargando' ? 
          Math.min(100, parametrosActuales.nivelBateria + Math.random() * 0.1) : 
          parametrosActuales.nivelBateria,
        voltajeEntrada: nuevoVoltaje,
        corrienteCarga: nuevaCorriente,
        potenciaCarga: nuevaPotencia,
        temperatura: parametrosActuales.temperatura + (Math.random() - 0.5) * 0.3,
        tiempoRestante: tiempoRestante,
        eficienciaCarga: Math.max(88, Math.min(95, parametrosActuales.eficienciaCarga + (Math.random() - 0.5) * 0.5)),
        tipoConector: parametrosActuales.tipoConector,
        velocidadCarga: nuevaVelocidad,
        temperaturaBMS: parametrosActuales.temperaturaBMS + (Math.random() - 0.5) * 0.2,
        estadoConector: nuevoEstado !== 'Desconectado' ? 'Conectado' : 'Desconectado'
      };

      // Validar rangos y generar alertas
      const nuevasAlertas = [];
      if (nuevosDatos.temperatura > 60) nuevasAlertas.push('Temperatura sistema de carga elevada');
      if (nuevosDatos.temperaturaBMS > 40) nuevasAlertas.push('Temperatura BMS elevada durante carga');
      if (nuevosDatos.eficienciaCarga < 90) nuevasAlertas.push('Eficiencia de carga reducida');
      if (nuevosDatos.corrienteCarga > 180 && nuevaVelocidad === 'DC Ultra Rápida') nuevasAlertas.push('Corriente de carga muy alta');
      if (nuevosDatos.voltajeEntrada > 0 && nuevosDatos.voltajeEntrada < 200) nuevasAlertas.push('Voltaje de entrada insuficiente');

      setParametrosActuales(nuevosDatos);
      setAlertas(nuevasAlertas);

      setDatosEnTiempoReal(prev => {
        const nuevosRegistros = [...prev, nuevosDatos];
        return nuevosRegistros.slice(-20);
      });
    }, 2000);

    return () => clearInterval(intervalo);
  }, [parametrosActuales, tiposCarga, vehiculo.especificaciones]);

  const getEstadoColor = (estado) => {
    switch(estado) {
      case 'Cargando': return 'text-blue-400';
      case 'Completa': return 'text-green-400';
      case 'Desconectado': return 'text-gray-400';
      default: return 'text-yellow-400';
    }
  };

  const getVelocidadColor = (velocidad) => {
    switch(velocidad) {
      case 'AC Lenta': return 'text-green-400';
      case 'AC Rápida': return 'text-blue-400';
      case 'DC Rápida': return 'text-yellow-400';
      case 'DC Ultra Rápida': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const formatTiempo = (minutos) => {
    const horas = Math.floor(minutos / 60);
    const mins = Math.floor(minutos % 60);
    return `${horas}h ${mins}m`;
  };

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
          <FaPlug className="text-green-400" size={24} />
          <h1 className="text-xl md:text-2xl font-bold">Sistema de Carga</h1>
        </div>
        <div className="text-right text-sm">
          <div className="text-gray-400">{vehiculo.marca} {vehiculo.modelo}</div>
          <div className="text-green-400">Carga AC/DC</div>
        </div>
      </ModuleStyles.Header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <ModuleStyles.InfoCard title={'Estado de Carga'} icon={FaBatteryFull}>
          <div className="space-y-4">
            <div className="text-center">
              <div className={`text-xl font-bold mb-2 ${getEstadoColor(parametrosActuales.estadoCarga)}`}>
                {parametrosActuales.estadoCarga}
              </div>
              <div className={`text-sm font-semibold ${getVelocidadColor(parametrosActuales.velocidadCarga)}`}>
                {parametrosActuales.velocidadCarga}
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Batería:</span>
                <span className="text-green-400 font-semibold">
                  {parametrosActuales.nivelBateria.toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Conector:</span>
                <span className={parametrosActuales.estadoConector === 'Conectado' ? 'text-green-400' : 'text-gray-400'}>
                  {parametrosActuales.estadoConector}
                </span>
              </div>
              {parametrosActuales.tiempoRestante > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Tiempo rest.:</span>
                  <span className="text-blue-400 font-semibold">
                    {formatTiempo(parametrosActuales.tiempoRestante)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </ModuleStyles.InfoCard>

        <ModuleStyles.InfoCard title={'Parámetros Eléctricos'} icon={FaBolt}>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Voltaje:</span>
              <span className="font-semibold text-purple-400">
                {parametrosActuales.voltajeEntrada.toFixed(0)} V
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Corriente:</span>
              <span className="font-semibold text-yellow-400">
                {parametrosActuales.corrienteCarga.toFixed(1)} A
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Potencia:</span>
              <span className="font-semibold text-green-400">
                {parametrosActuales.potenciaCarga.toFixed(1)} kW
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Eficiencia:</span>
              <span className="font-semibold text-blue-400">
                {parametrosActuales.eficienciaCarga.toFixed(1)}%
              </span>
            </div>
          </div>
        </ModuleStyles.InfoCard>

        <ModuleStyles.InfoCard title={'Gestión Térmica'} icon={FaThermometerHalf}>
          <div className="space-y-4">
            <div className="text-center">
              <div className={`text-2xl font-bold mb-2 ${
                parametrosActuales.temperatura > 60 ? 'text-red-400' :
                parametrosActuales.temperatura > 45 ? 'text-yellow-400' : 'text-blue-400'
              }`}>
                {parametrosActuales.temperatura.toFixed(1)}°C
              </div>
              <div className="text-sm text-gray-400">
                Temperatura del sistema
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">BMS:</span>
                <span className={`font-semibold ${
                  parametrosActuales.temperaturaBMS > 40 ? 'text-yellow-400' : 'text-green-400'
                }`}>
                  {parametrosActuales.temperaturaBMS.toFixed(1)}°C
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Tipo Conector:</span>
                <span className="text-blue-400 font-semibold">
                  {parametrosActuales.tipoConector}
                </span>
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
        <ModuleStyles.ChartCard title={'Perfil de Carga'} icon={FaPlug}>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart 
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
              <Area 
                type="monotone" 
                dataKey="potenciaCarga" 
                stroke="#10b981" 
                fill="#10b981" 
                fillOpacity={0.3} 
                name="Potencia (kW)"
                isAnimationActive={false}
              />
              <Area 
                type="monotone" 
                dataKey="nivelBateria" 
                stroke="#3b82f6" 
                fill="#3b82f6" 
                fillOpacity={0.3} 
                name="Batería (%)"
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ModuleStyles.ChartCard>

        <ModuleStyles.ChartCard title={'Parámetros en Tiempo Real'} icon={FaTachometerAlt}>
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
                dataKey="voltajeEntrada" 
                stroke="#a855f7" 
                strokeWidth={2} 
                name="Voltaje (V)"
                dot={false}
                isAnimationActive={false}
              />
              <Line 
                type="monotone" 
                dataKey="corrienteCarga" 
                stroke="#f59e0b" 
                strokeWidth={2} 
                name="Corriente (A)"
                dot={false}
                isAnimationActive={false}
              />
              <Line 
                type="monotone" 
                dataKey="temperatura" 
                stroke="#ef4444" 
                strokeWidth={2} 
                name="Temperatura (°C)"
                dot={false}
                isAnimationActive={false}
              />
              <Line 
                type="monotone" 
                dataKey="eficienciaCarga" 
                stroke="#06b6d4" 
                strokeWidth={2} 
                name="Eficiencia (%)"
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </ModuleStyles.ChartCard>
      </div>
    </div>
  );
}
