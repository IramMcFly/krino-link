'use client';

import { useState, useEffect } from 'react';
import {
  FaWind,
  FaExclamationCircle,
  FaCheckCircle,
  FaTimes,
  FaUser,
  FaCar,
  FaArrowsAltH,
} from 'react-icons/fa';

const bolsas = [
  'Airbag conductor',
  'Airbag pasajero',
  'Lateral izquierdo',
  'Lateral derecho',
  'Cortina izquierda',
  'Cortina derecha',
];

export default function ModuloAirbag({ volver }) {
  const [estadoBolsas, setEstadoBolsas] = useState({});
  const [airbagActivoEnviado, setAirbagActivoEnviado] = useState(false);

  // Función para consumir API del ESP32
  const enviarEstadoAirbagESP32 = async (state, esCleanup = false) => {
    if (!process.env.NEXT_PUBLIC_API_ESP32) {
      if (!esCleanup) console.warn('API_ESP32 no configurada en variables de entorno');
      return;
    }

    try {
      const url = `${process.env.NEXT_PUBLIC_API_ESP32}/DTC?modulo=airbags&state=${state}`;
      if (!esCleanup) console.log(`Enviando estado airbags a ESP32: ${url}`);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        if (!esCleanup) console.log(`✅ Estado airbags enviado exitosamente - State: ${state}`);
      } else {
        if (!esCleanup) console.error(`❌ Error al enviar estado airbags - State: ${state}, Status: ${response.status}`);
      }
    } catch (error) {
      if (!esCleanup) {
        console.error(`❌ Error de conexión con ESP32 - Airbags ${state}:`, error);
      } else {
        console.debug(`Cleanup ESP32 - Airbags ${state} (conexión no disponible)`);
      }
    }
  };

  const detonarAirbag = (nombre) => {
    const exito = Math.random() < 0.7;
    setEstadoBolsas((prev) => ({
      ...prev,
      [nombre]: exito ? 'activo' : 'falla',
    }));
  };

  // Detectar cuando todas las bolsas están activas
  useEffect(() => {
    const todasLasBolsasActivas = bolsas.every(bolsa => estadoBolsas[bolsa] === 'activo');
    const hayBolsasActivas = bolsas.some(bolsa => estadoBolsas[bolsa] === 'activo');
    
    // Si todas las bolsas están activas y no hemos enviado el estado ON
    if (todasLasBolsasActivas && !airbagActivoEnviado) {
      enviarEstadoAirbagESP32('ON');
      setAirbagActivoEnviado(true);
    }
    // Si no todas las bolsas están activas y habíamos enviado ON, enviar OFF
    else if (!todasLasBolsasActivas && airbagActivoEnviado) {
      enviarEstadoAirbagESP32('OFF');
      setAirbagActivoEnviado(false);
    }
  }, [estadoBolsas, airbagActivoEnviado]);

  // Cleanup al desmontar componente
  useEffect(() => {
    return () => {
      if (airbagActivoEnviado) {
        enviarEstadoAirbagESP32('OFF', true); // true = es cleanup
      }
    };
  }, [airbagActivoEnviado]);

  // Detectar cambios de página/navegación para enviar OFF
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (airbagActivoEnviado) {
        navigator.sendBeacon(
          `${process.env.NEXT_PUBLIC_API_ESP32}/DTC?modulo=airbags&state=OFF`
        );
      }
    };

    const handlePopState = async () => {
      if (airbagActivoEnviado) {
        await enviarEstadoAirbagESP32('OFF', true);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [airbagActivoEnviado]);

  const getColor = (estado) => {
    if (estado === 'activo') return 'text-green-500';
    if (estado === 'falla') return 'text-red-500';
    return 'text-gray-500';
  };

  const getIcon = (estado) => {
    if (estado === 'activo') return <FaCheckCircle size={18} />;
    if (estado === 'falla') return <FaTimes size={18} />;
    return <FaWind size={18} />;
  };

  const renderEstado = (nombre) => (
    <div className={`flex items-center gap-2 font-semibold ${getColor(estadoBolsas[nombre])}`}>
      {getIcon(estadoBolsas[nombre])}
      <span className="text-sm">{nombre}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#1b1f20] text-white px-4 py-6">
      <h2 className="text-2xl font-bold mb-4 text-[#c3151b]">Simulación: Sistema de Airbags</h2>
      <p className="mb-6 text-gray-300">
        Prueba de comunicación y simulación de despliegue. Algunas unidades pueden no responder.
      </p>

      {/* Esquema con íconos */}
      <div className="flex flex-col items-center mb-10 space-y-3 text-sm">
        <div className="flex items-center gap-6">
          {renderEstado('Cortina izquierda')}
          <FaArrowsAltH className="text-gray-400" />
          {renderEstado('Cortina derecha')}
        </div>
        <div className="flex items-center gap-6">
          {renderEstado('Lateral izquierdo')}
          <FaCar size={28} className="text-gray-300" />
          {renderEstado('Lateral derecho')}
        </div>
        <div className="flex items-center gap-6">
          {renderEstado('Airbag conductor')}
          <FaUser size={24} className="text-white" />
          {renderEstado('Airbag pasajero')}
        </div>
      </div>

      {/* Botones de activación */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-10">
        {bolsas.map((nombre) => (
          <button
            key={nombre}
            onClick={() => detonarAirbag(nombre)}
            disabled={estadoBolsas[nombre] === 'activo'}
            className={`flex items-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all bg-[#2e2e2e] hover:bg-[#3e3e3e] ${
              estadoBolsas[nombre] === 'activo' ? 'opacity-60 cursor-not-allowed' : ''
            }`}
          >
            {getIcon(estadoBolsas[nombre])}
            {nombre}
          </button>
        ))}
      </div>

      <button 
        onClick={async () => {
          // Enviar OFF antes de volver si hay airbags activos
          if (airbagActivoEnviado) {
            await enviarEstadoAirbagESP32('OFF', true);
          }
          volver();
        }} 
        className="bg-gray-700 hover:bg-gray-600 px-5 py-2 rounded"
      >
        Volver
      </button>

      {Object.values(estadoBolsas).includes('falla') && (
        <div className="mt-6 bg-yellow-800 p-4 rounded border-l-4 border-yellow-500 text-yellow-200 flex items-start gap-2">
          <FaExclamationCircle size={20} />
          <p>
            Algunas unidades no respondieron a la simulación. Revise el sistema o intente nuevamente.
          </p>
        </div>
      )}
    </div>
  );
}
