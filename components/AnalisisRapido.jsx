'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaSpinner, FaExclamationTriangle, FaSquare, FaCheckCircle, FaCommentDots } from 'react-icons/fa';
import axios from 'axios';

const sistemas = ['TCM', 'ECM', 'VSA', 'ABS', 'BCM', 'ECU'];

const fallasIniciales = [
  {
    sistema: 'ABS',
    modulo: 'Sistema de frenos antibloqueo',
    codigo: 'C0035',
    descripcion: 'Sensor de velocidad de rueda frontal izquierdo defectuoso',
    color: 'bg-yellow-600',
    icono: <FaExclamationTriangle size={20} className="text-white" />,
  },
  {
    sistema: 'ECM',
    modulo: 'Controlador del motor eléctrico',
    codigo: 'P0A1F',
    descripcion: 'Fallo en el controlador de motor eléctrico',
    color: 'bg-red-700',
    icono: <FaSquare size={20} className="text-white" />,
  },
];

export default function AnalisisRapido() {
  console.log('AnalisisRapido component loaded');
  
  const router = useRouter();
  const [progreso, setProgreso] = useState(0);
  const [sistemaActual, setSistemaActual] = useState('');
  const [analisisTerminado, setAnalisisTerminado] = useState(false);
  const [eliminando, setEliminando] = useState(false);
  const [fallas, setFallas] = useState(fallasIniciales);
  const [error, setError] = useState('');

  // Función para enviar errores al ESP32
  const enviarErroresAlESP32 = async (error1, error2, error3) => {
    console.log('=== ENTRADA A enviarErroresAlESP32 ===');
    console.log('Parámetros:', { error1, error2, error3 });
    console.log('Variable entorno ESP32_API:', process.env.NEXT_PUBLIC_ESP32_API);
    
    alert('Función enviarErroresAlESP32 ejecutada!');
    
    try {
      const body = {
        error1: error1,
        error2: error2,
        error3: error3
      };

      alert('Enviando datos al ESP32:\n' + JSON.stringify(body, null, 2));

      console.log('Enviando datos al ESP32:', body);
      console.log('URL:', `${process.env.NEXT_PUBLIC_ESP32_API}/errores`);

      const response = await axios.post(`${process.env.NEXT_PUBLIC_ESP32_API}/errores`, body, {
        timeout: 5000,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('Respuesta del ESP32:', response.data);
      setError(''); // Limpiar errores previos si la conexión es exitosa
    } catch (err) {
      console.error('Error al conectar con ESP32:', err);
      if (err.code === 'ECONNABORTED') {
        setError('Timeout: No se pudo conectar con el ESP32 en 5 segundos.');
      } else if (err.response) {
        setError(`Error del servidor: ${err.response.status} - ${err.response.data}`);
      } else if (err.request) {
        setError('No se pudo conectar con el dispositivo ESP32. Verifique la dirección IP y conexión.');
      } else {
        setError('Error desconocido al conectar con ESP32.');
      }
    }
  };

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < sistemas.length) {
        setSistemaActual(sistemas[i]);
        setProgreso(Math.round(((i + 1) / sistemas.length) * 100));
        i++;
      } else {
        clearInterval(interval);
        console.log('Análisis terminado, ejecutando setTimeout...');
        setTimeout(() => {
          console.log('Dentro del setTimeout, llamando a enviarErroresAlESP32...');
          setAnalisisTerminado(true);
          // Enviar errores activos al ESP32 cuando se completa el análisis
          enviarErroresAlESP32(true, true, true);
        }, 1000);
      }
    }, 700);

    return () => clearInterval(interval);
  }, []);

  const eliminarDTCs = async () => {
    console.log('Iniciando eliminación de DTCs...');
    setEliminando(true);
    setError(''); // Limpiar errores previos

    // Enviar errores apagados al ESP32
    await enviarErroresAlESP32(false, false, false);

    /*setTimeout(() => {
      setFallas([]);
      setEliminando(false);
    }, 2000);*/
  };

  const irAAistenteIA = (codigo) => {
    router.push(`/AsistenteIA?codigo=${codigo}`);
  };

  return (
    <div className="min-h-screen bg-[#1b1f20] text-white px-4 py-10 flex flex-col items-center text-center">
      <h1 className="text-2xl font-bold text-[#c3151b] mb-6">Análisis Rápido</h1>

      {/* Mostrar error de conexión si existe */}
      {error && (
        <div className="w-full max-w-md bg-red-600 text-white p-3 rounded-lg mb-4">
          <p className="text-sm">{error}</p>
        </div>
      )}

      {!analisisTerminado ? (
        <div className="w-full max-w-md bg-[#2e2e2e] p-6 rounded-xl shadow-md">
          <div className="flex items-center justify-center gap-3 mb-4">
            <FaSpinner className="animate-spin" size={24} />
            <span className="text-lg">Comunicando con {sistemaActual}...</span>
          </div>
          <div className="w-full bg-[#444] rounded-full h-4">
            <div
              className="bg-[#c3151b] h-4 rounded-full transition-all"
              style={{ width: `${progreso}%` }}
            ></div>
          </div>
          <p className="text-sm mt-3 text-gray-300">Solicitando datos del vehículo...</p>
        </div>
      ) : (
        <div className="w-full max-w-md bg-[#2e2e2e] p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4">Fallas detectadas</h2>

          {fallas.length > 0 ? (
            <>
              {fallas.map((falla, index) => (
                <div
                  key={index}
                  className={`mb-4 text-left p-4 rounded-lg ${falla.color} shadow-inner`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {falla.icono}
                    <p className="text-white font-bold">{falla.sistema} - {falla.codigo}</p>
                    <button
                      onClick={() => irAAistenteIA(falla.codigo)}
                      className="ml-auto bg-[#1f1f1f] hover:bg-[#333] text-white px-2 py-1 rounded flex items-center gap-1 text-sm"
                    >
                      <FaCommentDots size={16} /> Asistente
                    </button>
                  </div>
                  <p className="text-sm text-gray-200 italic mb-1">{falla.modulo}</p>
                  <p className="text-sm text-white">{falla.descripcion}</p>
                </div>
              ))}
              <button
                onClick={eliminarDTCs}
                disabled={eliminando}
                className="mt-4 bg-[#c3151b] hover:bg-[#a31217] text-white font-semibold py-2 px-4 rounded-lg transition duration-300 disabled:opacity-50"
              >
                {eliminando ? 'Eliminando DTCs...' : 'Eliminar DTCs'}
              </button>
            </>
          ) : (
            <div className="text-center">
              <FaCheckCircle size={48} className="text-green-500 mx-auto mb-2" />
              <p className="text-lg font-bold">Sin códigos DTC activos</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}