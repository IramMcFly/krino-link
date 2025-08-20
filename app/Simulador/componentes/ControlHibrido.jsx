'use client';

import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { FaArrowLeft, FaCogs, FaBolt, FaGasPump, FaThermometerHalf, FaTachometerAlt, FaExclamationTriangle } from 'react-icons/fa';
import ModuleStyles from './styles/ModuleStyles';

export default function ControlHibrido({ vehiculo, volver }) {
  const [datosEnTiempoReal, setDatosEnTiempoReal] = useState([]);
  const [parametrosActuales, setParametrosActuales] = useState({
    modoOperacion: 'EV Drive',
    distribucionPotencia: {
      motorElectrico: 65,
      motorCombustion: 35
    },
    regeneracion: 8.5,
    eficienciaTotal: 91.8,
    temperatura: 42,
    presionAceite: 3.2,
    rpmMotorElectrico: 1250,
    rpmMotorCombustion: 1800,
    torqueCombinado: 285,
    estado: 'Optimo'
  });

  const [modos] = useState(['EV Drive', 'Hybrid Drive', 'Engine Drive', 'Battery Charge', 'Sport Mode']);
  const [alertas, setAlertas] = useState([]);

  useEffect(() => {
    const intervalo = setInterval(() => {
      // Simular cambio de modo basado en condiciones
      const nuevoModo = Math.random() > 0.9 ? 
        modos[Math.floor(Math.random() * modos.length)] : 
        parametrosActuales.modoOperacion;

      // Ajustar distribución de potencia según el modo
      let nuevaDistribucion = { ...parametrosActuales.distribucionPotencia };
      switch(nuevoModo) {
        case 'EV Drive':
          nuevaDistribucion = { motorElectrico: 95, motorCombustion: 5 };
          break;
        case 'Engine Drive':
          nuevaDistribucion = { motorElectrico: 15, motorCombustion: 85 };
          break;
        case 'Hybrid Drive':
          nuevaDistribucion = { 
            motorElectrico: 45 + (Math.random() - 0.5) * 20, 
            motorCombustion: 55 + (Math.random() - 0.5) * 20 
          };
          break;
        case 'Battery Charge':
          nuevaDistribucion = { motorElectrico: 0, motorCombustion: 100 };
          break;
        case 'Sport Mode':
          nuevaDistribucion = { motorElectrico: 60, motorCombustion: 40 };
          break;
      }

      const nuevosDatos = {
        tiempo: new Date().toLocaleTimeString(),
        modoOperacion: nuevoModo,
        distribucionPotencia: nuevaDistribucion,
        regeneracion: Math.max(0, Math.min(15, parametrosActuales.regeneracion + (Math.random() - 0.5) * 1.5)),
        eficienciaTotal: Math.max(80, Math.min(95, parametrosActuales.eficienciaTotal + (Math.random() - 0.5) * 0.8)),
        temperatura: parametrosActuales.temperatura + (Math.random() - 0.5) * 0.4,
        presionAceite: Math.max(2.8, Math.min(4.5, parametrosActuales.presionAceite + (Math.random() - 0.5) * 0.1)),
        rpmMotorElectrico: Math.max(0, parametrosActuales.rpmMotorElectrico + (Math.random() - 0.5) * 200),
        rpmMotorCombustion: nuevoModo === 'EV Drive' ? 0 : 
          Math.max(800, parametrosActuales.rpmMotorCombustion + (Math.random() - 0.5) * 300),
        torqueCombinado: Math.max(100, Math.min(350, parametrosActuales.torqueCombinado + (Math.random() - 0.5) * 15))
      };

      // Validar rangos y generar alertas
      const nuevasAlertas = [];
      if (nuevosDatos.temperatura > 65) nuevasAlertas.push('Temperatura sistema híbrido elevada');
      if (nuevosDatos.presionAceite < 3.0) nuevasAlertas.push('Presión aceite sistema híbrido baja');
      if (nuevosDatos.eficienciaTotal < 85) nuevasAlertas.push('Eficiencia sistema híbrido reducida');
      if (nuevosDatos.regeneracion < 2 && nuevoModo !== 'Battery Charge') nuevasAlertas.push('Regeneración limitada');

      setParametrosActuales({
        ...nuevosDatos,
        estado: nuevasAlertas.length > 0 ? 'Advertencia' : 'Optimo'
      });
      setAlertas(nuevasAlertas);

      setDatosEnTiempoReal(prev => {
        const nuevosRegistros = [...prev, {
          tiempo: nuevosDatos.tiempo,
          eficiencia: nuevosDatos.eficienciaTotal,
          regeneracion: nuevosDatos.regeneracion,
          temperatura: nuevosDatos.temperatura,
          torque: nuevosDatos.torqueCombinado
        }];
        return nuevosRegistros.slice(-20);
      });
    }, 2000);

    return () => clearInterval(intervalo);
  }, [parametrosActuales, modos]);

  const getModoColor = (modo) => {
    switch(modo) {
      case 'EV Drive': return 'text-green-400';
      case 'Hybrid Drive': return 'text-blue-400';
      case 'Engine Drive': return 'text-orange-400';
      case 'Battery Charge': return 'text-purple-400';
      case 'Sport Mode': return 'text-red-400';
      default: return 'text-gray-400';
    }
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
          <FaCogs className="text-blue-400" size={24} />
          <h1 className="text-xl md:text-2xl font-bold">Control Híbrido</h1>
        </div>
        <div className="text-right text-sm">
          <div className="text-gray-400">{vehiculo.marca} {vehiculo.modelo}</div>
          <div className="text-blue-400">Sistema IMA</div>
        </div>
      </ModuleStyles.Header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <ModuleStyles.InfoCard title={'Modo de Operación'} icon={<FaCogs />}>
          <div className="space-y-4">
            <div className="text-center">
              <div className={`text-xl font-bold mb-2 ${getModoColor(parametrosActuales.modoOperacion)}`}>
                {parametrosActuales.modoOperacion}
              </div>
              <div className="text-sm text-gray-400">
                Modo actual del sistema
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Motor Eléctrico:</span>
                <span className="text-green-400 font-semibold">
                  {parametrosActuales.distribucionPotencia.motorElectrico.toFixed(0)}%
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Motor Combustión:</span>
                <span className="text-orange-400 font-semibold">
                  {parametrosActuales.distribucionPotencia.motorCombustion.toFixed(0)}%
                </span>
              </div>
            </div>
          </div>
        </ModuleStyles.InfoCard>

        <ModuleStyles.InfoCard title="Rendimiento" icon={<FaTachometerAlt />}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-400">Eficiencia</div>
                <div className="font-semibold text-blue-400">{parametrosActuales.eficienciaTotal.toFixed(1)}%</div>
              </div>
              <div>
                <div className="text-sm text-gray-400">Regeneración</div>
                <div className="font-semibold text-green-400">{parametrosActuales.regeneracion.toFixed(1)} kW</div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-2">
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm">Torque Total:</span>
                <span className="font-semibold text-yellow-400">{parametrosActuales.torqueCombinado.toFixed(0)} Nm</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm">Estado:</span>
                <span className={`font-semibold ${
                  parametrosActuales.estado === 'Optimo' ? 'text-green-400' : 'text-yellow-400'
                }`}>{parametrosActuales.estado}</span>
              </div>
            </div>
          </div>
        </ModuleStyles.InfoCard>

        <ModuleStyles.InfoCard title="Parámetros del Sistema" icon={<FaThermometerHalf />}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-400">Temperatura</div>
                <div className={`font-semibold ${
                  parametrosActuales.temperatura > 60 ? 'text-red-400' :
                  parametrosActuales.temperatura > 50 ? 'text-yellow-400' : 'text-blue-400'
                }`}>{parametrosActuales.temperatura.toFixed(1)}°C</div>
              </div>
              <div>
                <div className="text-sm text-gray-400">Presión Aceite</div>
                <div className="font-semibold text-purple-400">{parametrosActuales.presionAceite.toFixed(1)} bar</div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-2">
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm">RPM Eléctrico:</span>
                <span className="font-semibold text-green-400">{parametrosActuales.rpmMotorElectrico.toFixed(0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm">RPM Combustión:</span>
                <span className="font-semibold text-orange-400">{parametrosActuales.rpmMotorCombustion.toFixed(0)}</span>
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
        <ModuleStyles.ChartCard title="Distribución de Potencia" icon={<FaBolt />}>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={[{
              nombre: 'Actual',
              motorElectrico: parametrosActuales.distribucionPotencia.motorElectrico,
              motorCombustion: parametrosActuales.distribucionPotencia.motorCombustion
            }]}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="nombre" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#374151', border: 'none', borderRadius: '8px' }}
                formatter={(value) => [`${value.toFixed(1)}%`, 'Potencia']}
              />
              <Area type="monotone" dataKey="motorElectrico" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} name="Motor Eléctrico" />
              <Area type="monotone" dataKey="motorCombustion" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.6} name="Motor Combustión" />
            </AreaChart>
          </ResponsiveContainer>
        </ModuleStyles.ChartCard>

        <ModuleStyles.ChartCard title="Tendencias del Sistema" icon={<FaTachometerAlt />}>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={datosEnTiempoReal}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="tiempo" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#374151', border: 'none', borderRadius: '8px' }}
                labelStyle={{ color: '#D1D5DB' }}
              />
              <Line type="monotone" dataKey="eficiencia" stroke="#3b82f6" strokeWidth={2} name="Eficiencia (%)" />
              <Line type="monotone" dataKey="regeneracion" stroke="#10b981" strokeWidth={2} name="Regeneración (kW)" />
              <Line type="monotone" dataKey="temperatura" stroke="#f59e0b" strokeWidth={2} name="Temperatura (°C)" />
            </LineChart>
          </ResponsiveContainer>
        </ModuleStyles.ChartCard>
      </div>
    </div>
  );
}
