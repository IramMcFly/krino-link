'use client';

import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  FaBolt, 
  FaArrowLeft, 
  FaPlay, 
  FaStop, 
  FaTachometerAlt, 
  FaThermometer, 
  FaCog,
  FaExclamationTriangle,
  FaCheckCircle 
} from 'react-icons/fa';
import { 
  moduleStyles, 
  ModuleHeader, 
  ParameterCard, 
  AlertBanner, 
  ChartContainer 
} from './styles/ModuleStyles';

export default function MotorElectrico({ volver, vehiculo }) {
  const [diagnosticoActivo, setDiagnosticoActivo] = useState(false);
  const [modoConduccion, setModoConduccion] = useState('normal');

  const getParametrosIniciales = () => {
    const potenciaMaxima = parseFloat(vehiculo?.especificaciones?.potencia?.replace(/[^\d.]/g, '')) || 150;
    
    return {
      rpm: 0,
      torque: 0,
      potencia: 0,
      temperatura: 25,
      eficiencia: 95.0,
      voltajeMotor: 0,
      corrienteMotor: 0,
      velocidad: 0,
      potenciaMaxima: potenciaMaxima
    };
  };

  const [parametros, setParametros] = useState(getParametrosIniciales());
  const [alertas, setAlertas] = useState([]);
  const [datosGrafico, setDatosGrafico] = useState([]);

  useEffect(() => {
    const datosIniciales = [];
    for (let i = 0; i < 10; i++) {
      datosIniciales.push({
        tiempo: new Date(Date.now() - (9 - i) * 1000).toLocaleTimeString(),
        rpm: 0,
        torque: 0,
        potencia: 0,
        temperatura: 25
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

  useEffect(() => {
    if (!diagnosticoActivo) return;

    const intervalo = setInterval(() => {
      setParametros(prev => {
        let factorRpm = 1;
        let factorTorque = 1;
        let factorEficiencia = 1;

        if (modoConduccion === 'sport') {
          factorRpm = 1.4;
          factorTorque = 1.3;
          factorEficiencia = 0.92;
        } else if (modoConduccion === 'eco') {
          factorRpm = 0.7;
          factorTorque = 0.8;
          factorEficiencia = 1.05;
        }

        const baseRpm = 1500 + Math.random() * 3000; // Rango reducido
        const baseTorque = 200 + Math.random() * 300; // Rango reducido
        const baseTemp = 50 + Math.random() * 15; // Rango más pequeño: 50-65°C
        const basePotencia = (baseRpm * baseTorque) / 9549;

        const nuevosParametros = {
          rpm: Math.max(0, baseRpm * factorRpm + (Math.random() - 0.5) * 100), // Variación reducida
          torque: Math.max(0, baseTorque * factorTorque + (Math.random() - 0.5) * 30), // Variación reducida
          potencia: Math.max(0, Math.min(prev.potenciaMaxima, basePotencia * factorRpm + (Math.random() - 0.5) * 8)),
          temperatura: Math.max(25, Math.min(90, prev.temperatura + (Math.random() - 0.5) * 0.5)), // Cambio gradual
          eficiencia: Math.max(85, Math.min(98, 95 * factorEficiencia + (Math.random() - 0.5) * 2)),
          voltajeMotor: Math.max(300, Math.min(450, 380 + (Math.random() - 0.5) * 30)),
          corrienteMotor: Math.max(0, Math.min(300, 150 + (Math.random() - 0.5) * 100)),
          velocidad: Math.max(0, Math.min(200, (baseRpm / 100) + (Math.random() - 0.5) * 10)),
          potenciaMaxima: prev.potenciaMaxima
        };

        setDatosGrafico(prevDatos => {
          const nuevoDato = {
            tiempo: new Date().toLocaleTimeString(),
            rpm: nuevosParametros.rpm / 100,
            torque: nuevosParametros.torque / 10,
            potencia: nuevosParametros.potencia,
            temperatura: nuevosParametros.temperatura
          };
          return [...prevDatos.slice(-19), nuevoDato];
        });

        return nuevosParametros;
      });

      const nuevasAlertas = [];
      if (parametros.temperatura > 90) {
        nuevasAlertas.push({ tipo: 'warning', mensaje: 'Temperatura del motor elevada' });
      }
      if (parametros.temperatura > 105) {
        nuevasAlertas.push({ tipo: 'error', mensaje: 'Temperatura crítica - Motor en riesgo' });
      }
      if (parametros.rpm > 8000) {
        nuevasAlertas.push({ tipo: 'warning', mensaje: 'RPM elevadas detectadas' });
      }
      if (parametros.eficiencia < 90) {
        nuevasAlertas.push({ tipo: 'warning', mensaje: 'Eficiencia del motor reducida' });
      }
      if (parametros.corrienteMotor > 250) {
        nuevasAlertas.push({ tipo: 'warning', mensaje: 'Alta corriente de motor' });
      }

      setAlertas(nuevasAlertas);
    }, 1200);

    return () => clearInterval(intervalo);
  }, [diagnosticoActivo, modoConduccion, parametros.temperatura, parametros.rpm, parametros.eficiencia, parametros.corrienteMotor]);

  const modos = [
    { id: 'eco', nombre: 'Eco', color: 'text-green-400', desc: 'Máxima eficiencia' },
    { id: 'normal', nombre: 'Normal', color: 'text-blue-400', desc: 'Rendimiento equilibrado' },
    { id: 'sport', nombre: 'Sport', color: 'text-red-400', desc: 'Máxima potencia' }
  ];

  return (
    <div className={moduleStyles.container}>
      <div className={moduleStyles.layout.centered}>
        <ModuleHeader
          title={`Motor Eléctrico - ${vehiculo?.nombre || 'Vehículo Eléctrico'}`}
          subtitle={`Potencia: ${vehiculo?.especificaciones?.potencia || 'N/A'} | Diagnóstico del sistema de propulsión eléctrica`}
          status={diagnosticoActivo ? 'active' : 'inactive'}
          statusText={diagnosticoActivo ? 'Motor Activo' : 'Motor Detenido'}
        >
          <div className="flex flex-wrap gap-4 mt-4">
            <button onClick={volver} className={moduleStyles.buttons.secondary}>
              <FaArrowLeft className="mr-2" />
              Volver
            </button>
            
            <button
              onClick={diagnosticoActivo ? detenerDiagnostico : iniciarDiagnostico}
              className={diagnosticoActivo ? moduleStyles.buttons.danger : moduleStyles.buttons.success}
            >
              {diagnosticoActivo ? <FaStop className="mr-2" /> : <FaPlay className="mr-2" />}
              {diagnosticoActivo ? 'Detener' : 'Iniciar'} Motor
            </button>
          </div>
        </ModuleHeader>

        <div className={moduleStyles.cards.primary}>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FaCog className="text-blue-400" />
            Modo de Conducción
          </h3>
          <div className={moduleStyles.modeControls.container}>
            {modos.map(modo => (
              <button
                key={modo.id}
                onClick={() => setModoConduccion(modo.id)}
                className={`${moduleStyles.modeControls.button} ${
                  modoConduccion === modo.id 
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

        <div className={moduleStyles.parameterGrid.container}>
          <ParameterCard label="RPM" value={parametros.rpm.toFixed(0)} unit="rpm" />
          <ParameterCard label="Torque" value={parametros.torque.toFixed(1)} unit="Nm" />
          <ParameterCard label="Potencia" value={parametros.potencia.toFixed(1)} unit="kW" />
          <ParameterCard label="Temperatura" value={parametros.temperatura.toFixed(1)} unit="°C" />
          <ParameterCard label="Eficiencia" value={parametros.eficiencia.toFixed(1)} unit="%" />
          <ParameterCard label="Velocidad" value={parametros.velocidad.toFixed(1)} unit="km/h" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <ParameterCard label="Voltaje del Motor" value={parametros.voltajeMotor.toFixed(1)} unit="V" />
          <ParameterCard label="Corriente del Motor" value={parametros.corrienteMotor.toFixed(1)} unit="A" />
        </div>

        <div className={moduleStyles.layout.twoColumn}>
          <ChartContainer title="Rendimiento del Motor en Tiempo Real">
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
                <Line type="monotone" dataKey="potencia" stroke="#10B981" strokeWidth={2} name="Potencia (kW)" dot={false} />
                <Line type="monotone" dataKey="rpm" stroke="#3B82F6" strokeWidth={2} name="RPM (÷100)" dot={false} />
                <Line type="monotone" dataKey="temperatura" stroke="#F59E0B" strokeWidth={2} name="Temperatura (°C)" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>

          <div className={moduleStyles.cards.primary}>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FaBolt className="text-yellow-400" />
              Información Técnica
            </h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2 text-gray-300">Especificaciones del Motor</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Tipo:</span>
                    <span>PMSM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Potencia Máxima:</span>
                    <span>{vehiculo?.especificaciones?.potencia || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Modo Activo:</span>
                    <span className={modos.find(m => m.id === modoConduccion)?.color}>
                      {modos.find(m => m.id === modoConduccion)?.nombre}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2 text-gray-300 flex items-center gap-2">
                  <FaTachometerAlt className="text-blue-400" />
                  Potencia Actual
                </h4>
                <div className="relative bg-gray-700 rounded-lg h-8 overflow-hidden border border-gray-600">
                  <div 
                    className="h-full transition-all duration-1000 bg-gradient-to-r from-blue-500 to-purple-500"
                    style={{ width: `${Math.max(2, (parametros.potencia / parametros.potenciaMaxima) * 100)}%` }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center text-sm font-medium text-white drop-shadow-lg">
                    {((parametros.potencia / parametros.potenciaMaxima) * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}