'use client';

import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  FaCogs, 
  FaArrowLeft, 
  FaPlay, 
  FaStop, 
  FaOilCan, 
  FaThermometer, 
  FaGasPump,
  FaExclamationTriangle,
  FaCheckCircle,
  FaTachometerAlt,
  FaFire
} from 'react-icons/fa';
import { 
  moduleStyles, 
  ModuleHeader, 
  ParameterCard, 
  AlertBanner, 
  ChartContainer 
} from './styles/ModuleStyles';

export default function MotorCombustion({ volver, vehiculo }) {
  const [diagnosticoActivo, setDiagnosticoActivo] = useState(false);
  const [modoMotor, setModoMotor] = useState('normal');

  // Usar datos del vehículo para inicialización
  const getParametrosIniciales = () => {
    return {
      rpm: 0, // Motor apagado
      temperatura: 25, // Temperatura ambiente
      presionAceite: 0, // Sin presión
      flujoAire: 0, // Sin flujo
      consumoCombustible: 0, // Sin consumo
      lambda: 1.0, // Valor neutro
      avanceEncendido: 0, // Sin avance
      presionAdmision: 0.8, // Presión atmosférica
      mapaSensor: 20 // Valor base
    };
  };

  const [parametros, setParametros] = useState(getParametrosIniciales());
  const [alertas, setAlertas] = useState([]);
  const [datosGrafico, setDatosGrafico] = useState([]);

  // Inicializar datos del gráfico
  useEffect(() => {
    const datosIniciales = [];
    for (let i = 0; i < 10; i++) {
      datosIniciales.push({
        tiempo: new Date(Date.now() - (9 - i) * 1000).toLocaleTimeString(),
        rpm: 0,
        temperatura: 25,
        lambda: 100,
        consumo: 0
      });
    }
    setDatosGrafico(datosIniciales);
  }, []);

  const iniciarDiagnostico = () => {
    setDiagnosticoActivo(true);
  };

  const detenerDiagnostico = () => {
    setDiagnosticoActivo(false);
    setParametros(getParametrosIniciales());
    setAlertas([]);
  };

  // Simulación de datos en tiempo real
  useEffect(() => {
    if (!diagnosticoActivo) return;

    const intervalo = setInterval(() => {
      setParametros(prev => {
        let factorRpm = 1;
        let factorConsumo = 1;
        
        // Ajustar comportamiento según modo
        if (modoMotor === 'sport') {
          factorRpm = 1.3;
          factorConsumo = 1.4;
        } else if (modoMotor === 'eco') {
          factorRpm = 0.8;
          factorConsumo = 0.7;
        }

        // Valores base cuando el motor está funcionando
        const baseRpm = diagnosticoActivo ? 800 + Math.random() * 2000 : 0;
        const baseTemp = diagnosticoActivo ? 85 + Math.random() * 8 : 25; // Temperatura más estable: 85-93°C

        const nuevosParametros = {
          rpm: Math.max(0, baseRpm + (Math.random() - 0.5) * 80 * factorRpm),
          temperatura: Math.max(25, prev.temperatura + (Math.random() - 0.5) * 0.5), // Cambio gradual muy pequeño
          presionAceite: diagnosticoActivo ? Math.max(1.5, 2.5 + Math.random() * 1.5) : 0,
          flujoAire: diagnosticoActivo ? Math.max(80, 120 + Math.random() * 60) : 0,
          consumoCombustible: diagnosticoActivo ? Math.max(2, (4 + Math.random() * 4) * factorConsumo) : 0,
          lambda: diagnosticoActivo ? Math.max(0.9, Math.min(1.1, 1.0 + (Math.random() - 0.5) * 0.1)) : 1.0,
          avanceEncendido: diagnosticoActivo ? Math.max(10, 15 + (Math.random() - 0.5) * 8) : 0,
          presionAdmision: Math.max(0.8, 1.0 + (Math.random() - 0.5) * 0.3),
          mapaSensor: diagnosticoActivo ? Math.max(30, 60 + Math.random() * 30) : 20
        };

        // Actualizar gráfico
        setDatosGrafico(prevDatos => {
          const nuevoDato = {
            tiempo: new Date().toLocaleTimeString(),
            rpm: nuevosParametros.rpm,
            temperatura: nuevosParametros.temperatura,
            lambda: nuevosParametros.lambda * 100, // Para visualización
            consumo: nuevosParametros.consumoCombustible
          };
          return [...prevDatos.slice(-19), nuevoDato];
        });

        return nuevosParametros;
      });

      // Generar alertas
      const nuevasAlertas = [];
      if (parametros.temperatura > 110) {
        nuevasAlertas.push({ tipo: 'error', mensaje: 'Temperatura crítica del motor' });
      } else if (parametros.temperatura > 100 && diagnosticoActivo) {
        nuevasAlertas.push({ tipo: 'warning', mensaje: 'Temperatura alta del motor' });
      }
      
      if (parametros.presionAceite < 2.0 && diagnosticoActivo) {
        nuevasAlertas.push({ tipo: 'error', mensaje: 'Presión de aceite baja' });
      }
      
      if ((parametros.lambda < 0.9 || parametros.lambda > 1.1) && diagnosticoActivo) {
        nuevasAlertas.push({ tipo: 'warning', mensaje: 'Mezcla aire/combustible fuera de rango' });
      }

      if (parametros.consumoCombustible > 8 && diagnosticoActivo) {
        nuevasAlertas.push({ tipo: 'info', mensaje: 'Consumo elevado de combustible' });
      }
      
      setAlertas(nuevasAlertas);
    }, 1000);

    return () => clearInterval(intervalo);
  }, [diagnosticoActivo, modoMotor, parametros.temperatura, parametros.presionAceite, parametros.lambda, parametros.consumoCombustible]);

  const modos = [
    { id: 'eco', nombre: 'Eco', color: 'text-green-400', desc: 'Eficiencia óptima' },
    { id: 'normal', nombre: 'Normal', color: 'text-blue-400', desc: 'Rendimiento equilibrado' },
    { id: 'sport', nombre: 'Sport', color: 'text-red-400', desc: 'Máximo rendimiento' }
  ];

  return (
    <div className={moduleStyles.container}>
      <div className={moduleStyles.layout.centered}>
        {/* Header del módulo */}
        <ModuleHeader
          title={`Motor de Combustión - ${vehiculo?.nombre || 'Vehículo Híbrido'}`}
          subtitle={`${vehiculo?.especificaciones?.motorCombustion || 'Motor IMA Hybrid'} | Sistema de combustión interna`}
          status={diagnosticoActivo ? 'active' : 'inactive'}
          statusText={diagnosticoActivo ? 'Motor Encendido' : 'Motor Apagado'}
        >
          <div className="flex flex-wrap gap-4 mt-4">
            <button
              onClick={volver}
              className={moduleStyles.buttons.secondary}
            >
              <FaArrowLeft className="mr-2" />
              Volver
            </button>
            
            <button
              onClick={diagnosticoActivo ? detenerDiagnostico : iniciarDiagnostico}
              className={diagnosticoActivo ? moduleStyles.buttons.danger : moduleStyles.buttons.success}
            >
              {diagnosticoActivo ? <FaStop className="mr-2" /> : <FaPlay className="mr-2" />}
              {diagnosticoActivo ? 'Apagar' : 'Encender'} Motor
            </button>
          </div>
        </ModuleHeader>

        {/* Selector de modo de motor */}
        <div className={moduleStyles.cards.primary}>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FaCogs className="text-orange-400" />
            Modo de Motor
          </h3>
          <div className={moduleStyles.modeControls.container}>
            {modos.map(modo => (
              <button
                key={modo.id}
                onClick={() => setModoMotor(modo.id)}
                className={`${moduleStyles.modeControls.button} ${
                  modoMotor === modo.id 
                    ? moduleStyles.modeControls.active 
                    : moduleStyles.modeControls.inactive
                }`}
              >
                <div className="text-center">
                  <div className={`font-semibold ${modo.color}`}>{modo.nombre}</div>
                  <div className="text-xs text-gray-400">{modo.desc}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Alertas */}
        {alertas.length > 0 && (
          <div className={moduleStyles.alerts.container}>
            {alertas.map((alerta, index) => (
              <AlertBanner
                key={index}
                type={alerta.tipo}
                message={alerta.mensaje}
                icon={alerta.tipo === 'error' ? FaExclamationTriangle : 
                      alerta.tipo === 'warning' ? FaExclamationTriangle : 
                      FaCheckCircle}
              />
            ))}
          </div>
        )}

        {/* Grid de parámetros principales */}
        <div className={moduleStyles.parameterGrid.container}>
          <ParameterCard
            label="RPM"
            value={parametros.rpm.toFixed(0)}
            unit="rpm"
          />
          <ParameterCard
            label="Temperatura"
            value={parametros.temperatura.toFixed(1)}
            unit="°C"
            className={parametros.temperatura > 95 ? moduleStyles.cards.warning : 
                       parametros.temperatura > 105 ? moduleStyles.cards.danger : ''}
          />
          <ParameterCard
            label="Presión de Aceite"
            value={parametros.presionAceite.toFixed(1)}
            unit="bar"
            className={parametros.presionAceite < 2.0 && diagnosticoActivo ? moduleStyles.cards.danger : ''}
          />
          <ParameterCard
            label="Flujo de Aire"
            value={parametros.flujoAire.toFixed(0)}
            unit="g/s"
          />
          <ParameterCard
            label="Consumo Combustible"
            value={parametros.consumoCombustible.toFixed(1)}
            unit="L/h"
            className={parametros.consumoCombustible > 8 ? moduleStyles.cards.warning : ''}
          />
          <ParameterCard
            label="Lambda (λ)"
            value={parametros.lambda.toFixed(3)}
            unit=""
            className={(parametros.lambda < 0.9 || parametros.lambda > 1.1) && diagnosticoActivo ? moduleStyles.cards.warning : ''}
          />
        </div>

        {/* Segunda fila de parámetros */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <ParameterCard
            label="Avance de Encendido"
            value={parametros.avanceEncendido.toFixed(1)}
            unit="°"
          />
          <ParameterCard
            label="Presión Admisión"
            value={parametros.presionAdmision.toFixed(2)}
            unit="bar"
          />
          <ParameterCard
            label="MAP Sensor"
            value={parametros.mapaSensor.toFixed(0)}
            unit="kPa"
          />
        </div>

        <div className={moduleStyles.layout.twoColumn}>
          {/* Gráfico de parámetros */}
          <ChartContainer title="Parámetros del Motor en Tiempo Real">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={datosGrafico}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="tiempo" stroke="#9CA3AF" fontSize={12} />
                <YAxis stroke="#9CA3AF" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px' 
                  }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="rpm" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  name="RPM (÷10)"
                  dot={false}
                />
                <Line 
                  type="monotone" 
                  dataKey="temperatura" 
                  stroke="#F59E0B" 
                  strokeWidth={2}
                  name="Temperatura (°C)"
                  dot={false}
                />
                <Line 
                  type="monotone" 
                  dataKey="lambda" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  name="Lambda (×100)"
                  dot={false}
                />
                <Line 
                  type="monotone" 
                  dataKey="consumo" 
                  stroke="#EF4444" 
                  strokeWidth={2}
                  name="Consumo (L/h)"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>

          {/* Información técnica */}
          <div className={moduleStyles.cards.primary}>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FaFire className="text-orange-400" />
              Sistema IMA Honda
            </h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2 text-gray-300">Especificaciones</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Motor:</span>
                    <span>{vehiculo?.especificaciones?.motorCombustion || '1.3L i-VTEC IMA'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Tecnología:</span>
                    <span>VTEC + IMA Hybrid</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Combustible:</span>
                    <span>Gasolina Regular</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Modo Activo:</span>
                    <span className={modos.find(m => m.id === modoMotor)?.color}>
                      {modos.find(m => m.id === modoMotor)?.nombre}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2 text-gray-300">Estado Operacional</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Estado Motor:</span>
                    <span className={diagnosticoActivo ? 'text-green-400' : 'text-gray-400'}>
                      {diagnosticoActivo ? 'Funcionando' : 'Apagado'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">VTEC Activo:</span>
                    <span className={parametros.rpm > 2500 && diagnosticoActivo ? 'text-green-400' : 'text-gray-400'}>
                      {parametros.rpm > 2500 && diagnosticoActivo ? 'SÍ' : 'NO'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Mezcla A/C:</span>
                    <span className={
                      Math.abs(parametros.lambda - 1.0) < 0.05 ? 'text-green-400' :
                      Math.abs(parametros.lambda - 1.0) < 0.1 ? 'text-yellow-400' : 'text-red-400'
                    }>
                      {Math.abs(parametros.lambda - 1.0) < 0.05 ? 'Óptima' :
                       Math.abs(parametros.lambda - 1.0) < 0.1 ? 'Aceptable' : 'Fuera de rango'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Eficiencia:</span>
                    <span className={
                      parametros.consumoCombustible < 5 && diagnosticoActivo ? 'text-green-400' :
                      parametros.consumoCombustible < 8 ? 'text-yellow-400' : 'text-red-400'
                    }>
                      {!diagnosticoActivo ? 'N/A' :
                       parametros.consumoCombustible < 5 ? 'Excelente' :
                       parametros.consumoCombustible < 8 ? 'Buena' : 'Baja'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Indicador de temperatura */}
              <div>
                <h4 className="font-medium mb-2 text-gray-300 flex items-center gap-2">
                  <FaThermometer className={
                    parametros.temperatura < 70 ? 'text-blue-400' :
                    parametros.temperatura < 95 ? 'text-green-400' :
                    parametros.temperatura < 105 ? 'text-yellow-400' : 'text-red-400'
                  } />
                  Temperatura del Motor
                </h4>
                <div className="relative bg-gray-700 rounded-lg h-8 overflow-hidden border border-gray-600">
                  <div 
                    className={`h-full transition-all duration-1000 ${
                      parametros.temperatura < 70 ? 'bg-gradient-to-r from-blue-500 to-blue-400' :
                      parametros.temperatura < 95 ? 'bg-gradient-to-r from-green-500 to-green-400' :
                      parametros.temperatura < 105 ? 'bg-gradient-to-r from-yellow-500 to-yellow-400' :
                      'bg-gradient-to-r from-red-500 to-red-400'
                    }`}
                    style={{ width: `${Math.max(5, Math.min(100, (parametros.temperatura - 20) / 100 * 100))}%` }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center text-sm font-medium text-white drop-shadow-lg">
                    {parametros.temperatura.toFixed(1)}°C
                  </div>
                </div>
                <div className="text-xs text-gray-400 mt-1 flex justify-between">
                  <span>20°C</span>
                  <span>120°C</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
