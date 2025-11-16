'use client';

import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  FaBatteryFull, 
  FaBatteryHalf, 
  FaBatteryEmpty,
  FaThermometerHalf,
  FaBolt,
  FaExclamationTriangle,
  FaCheckCircle,
  FaArrowLeft,
  FaPlay,
  FaStop,
  FaSyncAlt
} from 'react-icons/fa';
import { 
  moduleStyles, 
  ModuleHeader, 
  ParameterCard, 
  AlertBanner, 
  ChartContainer 
} from './styles/ModuleStyles';

export default function GestionBateria({ volver, vehiculo }) {
  const [diagnosticoActivo, setDiagnosticoActivo] = useState(false);
  
  // Usar datos del vehículo para inicialización
  const getParametrosIniciales = () => {
    const capacidadBateria = parseFloat(vehiculo?.especificaciones?.bateria?.replace(/[^\d.]/g, '')) || 82;
    const potenciaMaxima = parseFloat(vehiculo?.especificaciones?.potencia?.replace(/[^\d.]/g, '')) || 150;
    const voltajeMaximo = vehiculo?.parametros?.voltaje?.max || 400;
    
    return {
      carga: 0, // Inicia en 0
      voltaje: 0, // Inicia en 0
      corriente: 0, // Inicia en 0
      temperatura: 25, // Temperatura ambiente
      potencia: 0, // Inicia en 0
      estadoSalud: 98.5, // Estado de salud fijo
      capacidad: capacidadBateria,
      resistenciaInterna: 45.2,
      ciclos: 1247
    };
  };

  const [parametros, setParametros] = useState(getParametrosIniciales());
  const [alertas, setAlertas] = useState([]);
  const [datosGrafico, setDatosGrafico] = useState([]);

  // Función para consumir API del ESP32
  const enviarComandoESP32 = async (modulo, esCleanup = false) => {
    if (!process.env.NEXT_PUBLIC_API_ESP32) {
      if (!esCleanup) console.warn('API_ESP32 no configurada en variables de entorno');
      return;
    }

    try {
      const url = `${process.env.NEXT_PUBLIC_API_ESP32}/moduloDiag?modulo=${modulo}`;
      if (!esCleanup) console.log(`Enviando comando a ESP32: ${url}`);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        if (!esCleanup) console.log(`✅ Comando enviado exitosamente - Módulo: ${modulo}`);
      } else {
        if (!esCleanup) console.error(`❌ Error al enviar comando - Módulo: ${modulo}, Status: ${response.status}`);
      }
    } catch (error) {
      // Solo mostrar errores de cleanup si no son de conexión típicos
      if (!esCleanup) {
        console.error(`❌ Error de conexión con ESP32 - Módulo: ${modulo}:`, error);
      } else {
        // Para cleanup, solo log silencioso
        console.debug(`Cleanup ESP32 - Módulo: ${modulo} (conexión no disponible)`);
      }
    }
  };

  // Inicializar datos del gráfico
  useEffect(() => {
    const datosIniciales = [];
    for (let i = 0; i < 10; i++) {
      datosIniciales.push({
        tiempo: new Date(Date.now() - (9 - i) * 1000).toLocaleTimeString(),
        carga: 0,
        temperatura: 25,
        voltaje: 0
      });
    }
    setDatosGrafico(datosIniciales);
  }, []);

  // Cleanup al desmontar componente o al salir
  useEffect(() => {
    // Función de limpieza que se ejecuta al desmontar o cambiar de página
    const handleCleanup = async () => {
      if (diagnosticoActivo) {
        await enviarComandoESP32('exit', true); // true = es cleanup
      }
    };

    // Cleanup al desmontar el componente
    return () => {
      if (diagnosticoActivo) {
        enviarComandoESP32('exit', true); // true = es cleanup
      }
    };
  }, [diagnosticoActivo]);

  // Detectar cambios de página/navegación para enviar exit
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (diagnosticoActivo) {
        // Para cambios de página/cierre de ventana
        navigator.sendBeacon(
          `${process.env.NEXT_PUBLIC_API_ESP32}/moduloDiag?modulo=exit`
        );
      }
    };

    const handlePopState = async () => {
      if (diagnosticoActivo) {
        await enviarComandoESP32('exit', true); // true = es cleanup
      }
    };

    // Eventos para detectar navegación
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [diagnosticoActivo]);

  const iniciarDiagnostico = async () => {
    setDiagnosticoActivo(true);
    // Enviar comando de inicio al ESP32 con módulo bateria
    await enviarComandoESP32('bateria');
  };

  const detenerDiagnostico = async () => {
    setDiagnosticoActivo(false);
    // Volver a parámetros iniciales cuando se detiene
    setParametros(getParametrosIniciales());
    setAlertas([]);
    // Enviar comando de salida al ESP32
    await enviarComandoESP32('exit');
  };

  const resetearParametros = () => {
    setParametros(getParametrosIniciales());
    setAlertas([]);
    setDatosGrafico(prev => prev.map(dato => ({
      ...dato,
      carga: 0,
      temperatura: 25,
      voltaje: 0
    })));
  };

  // Simulación de datos en tiempo real solo cuando el diagnóstico está activo
  useEffect(() => {
    if (!diagnosticoActivo) return;

    const intervalo = setInterval(() => {
      setParametros(prev => {
        const capacidadBateria = parseFloat(vehiculo?.especificaciones?.bateria?.replace(/[^\d.]/g, '')) || 82;
        const potenciaMaxima = parseFloat(vehiculo?.especificaciones?.potencia?.replace(/[^\d.]/g, '')) || 150;
        const voltajeMaximo = vehiculo?.parametros?.voltaje?.max || 400;
        
        // Parámetros base cuando está funcionando - más estables
        const baseCarga = prev.carga || 78; // Usar valor anterior o 78% por defecto
        const baseVoltaje = voltajeMaximo * 0.95; // Voltaje más estable
        const baseCorriente = Math.random() * 30; // 0-30A (reducido)
        const baseTemp = 28 + Math.random() * 8; // 28-36°C (rango más pequeño)
        const basePotencia = Math.random() * potenciaMaxima * 0.5; // 0-50% potencia máxima
        
        const nuevosParametros = {
          carga: Math.max(5, Math.min(100, baseCarga + (Math.random() - 0.5) * 0.5)), // Cambio muy gradual ±0.25%
          voltaje: Math.max(300, Math.min(voltajeMaximo * 1.05, baseVoltaje + (Math.random() - 0.5) * 5)),
          corriente: Math.max(0, Math.min(50, baseCorriente + (Math.random() - 0.5) * 3)),
          temperatura: Math.max(20, Math.min(45, prev.temperatura + (Math.random() - 0.5) * 0.3)), // Cambio gradual de temperatura
          potencia: Math.max(0, Math.min(potenciaMaxima, basePotencia + (Math.random() - 0.5) * 8)),
          estadoSalud: prev.estadoSalud,
          capacidad: capacidadBateria,
          resistenciaInterna: Math.max(40, Math.min(60, prev.resistenciaInterna + (Math.random() - 0.5) * 0.1)),
          ciclos: prev.ciclos
        };

        // Actualizar gráfico
        setDatosGrafico(prevDatos => {
          const nuevoDato = {
            tiempo: new Date().toLocaleTimeString(),
            carga: nuevosParametros.carga,
            temperatura: nuevosParametros.temperatura,
            voltaje: nuevosParametros.voltaje / 10, // Escala para visualización
          };
          return [...prevDatos.slice(-19), nuevoDato];
        });

        return nuevosParametros;
      });

      // Generar alertas basadas en parámetros actuales
      const nuevasAlertas = [];
      if (parametros.temperatura > 45) {
        nuevasAlertas.push({ tipo: 'warning', mensaje: 'Temperatura de batería elevada' });
      }
      if (parametros.temperatura > 55) {
        nuevasAlertas.push({ tipo: 'error', mensaje: 'Temperatura crítica de batería' });
      }
      if (parametros.carga < 15) {
        nuevasAlertas.push({ tipo: 'warning', mensaje: 'Nivel de carga bajo' });
      }
      if (parametros.carga < 5) {
        nuevasAlertas.push({ tipo: 'error', mensaje: 'Carga crítica - Cargar inmediatamente' });
      }
      if (parametros.voltaje < vehiculo?.parametros?.voltaje?.min * 0.9) {
        nuevasAlertas.push({ tipo: 'error', mensaje: 'Voltaje bajo detectado' });
      }
      if (parametros.corriente > 80) {
        nuevasAlertas.push({ tipo: 'warning', mensaje: 'Alta corriente de descarga' });
      }
      
      setAlertas(nuevasAlertas);
    }, 1500);

    return () => clearInterval(intervalo);
  }, [diagnosticoActivo, vehiculo, parametros.temperatura, parametros.carga, parametros.voltaje, parametros.corriente]);

  const getBatteryIcon = () => {
    if (parametros.carga > 66) return FaBatteryFull;
    if (parametros.carga > 33) return FaBatteryHalf;
    return FaBatteryEmpty;
  };

  const getBatteryColor = () => {
    if (parametros.carga > 66) return 'text-green-400';
    if (parametros.carga > 33) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className={moduleStyles.container}>
      <div className={moduleStyles.layout.centered}>
        {/* Header del módulo */}
        <ModuleHeader
          title={`Gestión de Batería - ${vehiculo?.nombre || 'Vehículo Eléctrico'}`}
          subtitle={`Capacidad: ${vehiculo?.especificaciones?.bateria || 'N/A'} | Estado del sistema de batería de alto voltaje`}
          status={diagnosticoActivo ? 'active' : 'inactive'}
          statusText={diagnosticoActivo ? 'Diagnóstico Activo' : 'Sistema Inactivo'}
        >
          <div className="flex flex-wrap gap-4 mt-4">
            <button
              onClick={async () => {
                // Enviar exit antes de volver si el diagnóstico está activo
                if (diagnosticoActivo) {
                  await enviarComandoESP32('exit', true); // true = es cleanup
                }
                volver();
              }}
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
              {diagnosticoActivo ? 'Detener' : 'Iniciar'} Diagnóstico
            </button>
            
            <button
              onClick={resetearParametros}
              className={moduleStyles.buttons.primary}
            >
              <FaSyncAlt className="mr-2" />
              Reset
            </button>
          </div>
        </ModuleHeader>

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
            label="Nivel de Carga"
            value={parametros.carga.toFixed(1)}
            unit="%"
            className={parametros.carga < 15 ? moduleStyles.cards.warning : ''}
          />
          <ParameterCard
            label="Voltaje"
            value={parametros.voltaje.toFixed(1)}
            unit="V"
          />
          <ParameterCard
            label="Corriente"
            value={parametros.corriente.toFixed(1)}
            unit="A"
            className={parametros.corriente > 80 ? moduleStyles.cards.warning : ''}
          />
          <ParameterCard
            label="Temperatura"
            value={parametros.temperatura.toFixed(1)}
            unit="°C"
            className={parametros.temperatura > 45 ? moduleStyles.cards.warning : ''}
          />
          <ParameterCard
            label="Potencia"
            value={parametros.potencia.toFixed(1)}
            unit="kW"
          />
          <ParameterCard
            label="Estado de Salud"
            value={parametros.estadoSalud.toFixed(1)}
            unit="%"
          />
        </div>

        <div className={moduleStyles.layout.twoColumn}>
          {/* Gráfico de tendencias */}
          <ChartContainer title="Tendencias en Tiempo Real">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart 
                data={datosGrafico}
                isAnimationActive={false}
                animationDuration={0}
              >
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
                  dataKey="carga" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  name="Carga (%)"
                  dot={false}
                  isAnimationActive={false}
                />
                <Line 
                  type="monotone" 
                  dataKey="temperatura" 
                  stroke="#F59E0B" 
                  strokeWidth={2}
                  name="Temperatura (°C)"
                  dot={false}
                  isAnimationActive={false}
                />
                <Line 
                  type="monotone" 
                  dataKey="voltaje" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  name="Voltaje (V/10)"
                  dot={false}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>

          {/* Información detallada */}
          <div className={moduleStyles.cards.primary}>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FaBatteryFull className="text-blue-400" />
              Información Detallada
            </h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2 text-gray-300">Especificaciones del Vehículo</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Capacidad Total:</span>
                    <span>{vehiculo?.especificaciones?.bateria || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Voltaje Nominal:</span>
                    <span>{vehiculo?.parametros?.voltaje?.max || 400}V</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Potencia Máxima:</span>
                    <span>{vehiculo?.especificaciones?.potencia || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Tecnología:</span>
                    <span>Li-ion NCM</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2 text-gray-300">Estado Actual</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Resistencia Interna:</span>
                    <span>{parametros.resistenciaInterna.toFixed(1)} mΩ</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Ciclos de Carga:</span>
                    <span>{parametros.ciclos.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Tiempo Estimado:</span>
                    <span>
                      {parametros.carga > 20 
                        ? `${Math.round((parametros.carga / 100) * 8)} horas`
                        : 'Carga baja'
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Estado:</span>
                    <span className={
                      parametros.carga > 80 ? 'text-green-400' :
                      parametros.carga > 30 ? 'text-yellow-400' : 'text-red-400'
                    }>
                      {parametros.carga > 80 ? 'Óptimo' :
                       parametros.carga > 30 ? 'Normal' : 'Crítico'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Indicador visual de batería */}
              <div>
                <h4 className="font-medium mb-2 text-gray-300 flex items-center gap-2">
                  {(() => {
                    const IconComponent = getBatteryIcon();
                    return <IconComponent className={getBatteryColor()} />;
                  })()}
                  Visualización de Carga
                </h4>
                <div className="relative bg-gray-700 rounded-lg h-8 overflow-hidden border border-gray-600">
                  <div 
                    className={`h-full transition-all duration-1000 ${
                      parametros.carga > 66 ? 'bg-gradient-to-r from-green-500 to-green-400' :
                      parametros.carga > 33 ? 'bg-gradient-to-r from-yellow-500 to-yellow-400' : 
                      'bg-gradient-to-r from-red-500 to-red-400'
                    }`}
                    style={{ width: `${Math.max(5, parametros.carga)}%` }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center text-sm font-medium text-white drop-shadow-lg">
                    {parametros.carga.toFixed(1)}%
                  </div>
                </div>
              </div>

              {/* Códigos DTC simulados */}
              {alertas.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2 text-gray-300">Códigos DTC Activos</h4>
                  <div className="space-y-1 text-sm">
                    {alertas.map((alerta, index) => (
                      <div key={index} className="flex justify-between text-red-400">
                        <span>P{1000 + index}A</span>
                        <span className="text-xs">{alerta.mensaje}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
