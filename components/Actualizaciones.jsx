'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  FaCode,
  FaMicrochip,
  FaCheckCircle,
  FaSync,
  FaSpinner,
  FaInfoCircle,
  FaExclamationTriangle,
  FaDownload,
  FaTimes,
} from 'react-icons/fa';

export default function Actualizaciones() {
  const appVersion = '0.2.6';
  const firmwareActual = '1.0.0';
  const firmwareNuevo = '1.1.2';
  const [buscando, setBuscando] = useState(false);
  const [hayUpdate, setHayUpdate] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);

  const router = useRouter();

  const buscarActualizaciones = () => {
    setBuscando(true);
    setTimeout(() => {
      setBuscando(false);
      setHayUpdate(true);
      setMostrarModal(true);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#1b1f20] text-white px-4 py-10 flex flex-col items-center">
      <h2 className="text-2xl font-bold text-[#c3151b] mb-4">Información de Actualizaciones</h2>

      <div className="bg-[#2e2e2e] p-6 rounded-xl shadow-md w-full max-w-lg space-y-6">
        <div className="flex items-center gap-4">
          <FaCode size={32} className="text-[#facc15]" />
          <div>
            <p className="text-lg font-semibold">Versión de la App</p>
            <p className="text-gray-300">Krino-Link v{appVersion}</p>
          </div>
          <FaCheckCircle size={20} className="text-green-500 ml-auto" />
        </div>

        <div className="flex items-center gap-4">
          <FaMicrochip size={32} className="text-[#38bdf8]" />
          <div>
            <p className="text-lg font-semibold">Firmware del módulo KL-01</p>
            <p className="text-gray-300">
              Versión {firmwareActual}
              {hayUpdate && <span className="ml-2 text-yellow-400">→ {firmwareNuevo}</span>}
            </p>
          </div>
          <FaExclamationTriangle size={20} className="text-yellow-500 ml-auto" />
        </div>
      </div>

      <button
        onClick={buscarActualizaciones}
        disabled={buscando}
        className={`mt-6 flex items-center gap-2 px-5 py-2 rounded transition ${
          buscando
            ? 'bg-gray-600 cursor-not-allowed'
            : 'bg-[#c3151b] hover:bg-[#a31116]'
        }`}
      >
        {buscando ? (
          <>
            <FaSpinner className="animate-spin" size={18} />
            Buscando actualizaciones...
          </>
        ) : (
          <>
            <FaSync size={18} />
            Buscar actualizaciones
          </>
        )}
      </button>

      {mostrarModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-[#2a2a2a] rounded-lg shadow-lg max-w-md w-full p-6 relative">
            <button
              onClick={() => setMostrarModal(false)}
              className="absolute top-3 right-3 text-white hover:text-red-400"
            >
              <FaTimes size={20} />
            </button>
            <div className="flex items-center gap-3 mb-4">
              <FaMicrochip size={24} className="text-cyan-400" />
              <h3 className="text-xl font-bold text-white">Actualización disponible</h3>
            </div>
            <p className="text-sm text-gray-300 mb-4">
              Se ha encontrado una nueva versión del firmware para el KL-01.
            </p>
            <div className="bg-[#1e1e1e] rounded-md p-4 border border-gray-600 text-sm mb-4">
              <p><strong>Versión nueva:</strong> {firmwareNuevo}</p>
              <p><strong>Changelog:</strong></p>
              <ul className="list-disc list-inside text-gray-300 mt-1">
                <li>Soporte para vehículos anteriores al 2013</li>
                <li>Optimización de velocidad de lectura</li>
                <li>Mejoras de estabilidad menores</li>
              </ul>
            </div>
            <button
              className="flex items-center justify-center gap-2 bg-green-700 hover:bg-green-600 w-full py-2 rounded text-white font-semibold transition"
              onClick={() => setMostrarModal(false)}
            >
              <FaDownload size={18} />
              Descargar actualización
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => router.push('/MenuDiagnostico')}
        className="mt-10 bg-gray-700 hover:bg-gray-600 px-5 py-2 rounded"
      >
        Volver
      </button>
    </div>
  );
}
