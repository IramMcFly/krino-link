'use client';

import { useState } from 'react';
import {
  FaSpinner,
  FaCheckCircle,
  FaTimes,
  FaMicrochip,
  FaCar,
  FaTachometerAlt,
  FaFan,
  FaBatteryHalf,
  FaServer,
} from 'react-icons/fa';

const sistemas = [
  { nombre: 'Motor', icono: FaTachometerAlt },
  { nombre: 'Transmisión', icono: FaCar },
  { nombre: 'Sistema eléctrico', icono: FaBatteryHalf },
  { nombre: 'Sistema de enfriamiento', icono: FaFan },
  { nombre: 'Módulo central ECU', icono: FaMicrochip },
];

export default function ModuloECUReset({ volver }) {
  const [estado, setEstado] = useState('idle');
  const [resultados, setResultados] = useState({});

  const iniciarReinicio = () => {
    setEstado('reiniciando');
    setResultados({});
    let index = 0;

    const intervalo = setInterval(() => {
      const sistema = sistemas[index];

      // Fuerza respuesta positiva para todos los sistemas
      setResultados((prev) => ({
        ...prev,
        [sistema.nombre]: 'ok',
      }));

      index++;
      if (index >= sistemas.length) {
        clearInterval(intervalo);
        setEstado('completo');
      }
    }, 700);
  };

  const getIconoEstado = (nombre) => {
    const estadoSistema = resultados[nombre];
    if (estadoSistema === 'ok')
      return <FaCheckCircle className="text-green-500" size={20} />;
    if (estadoSistema === 'fail')
      return <FaTimes className="text-red-500" size={20} />;
    return <FaSpinner className="animate-spin text-gray-400" size={20} />;
  };

  return (
    <div className="min-h-screen bg-[#1b1f20] text-white px-4 py-6 flex flex-col items-center">
      <h2 className="text-2xl font-bold text-[#c3151b] mb-4">Reinicio de ECU</h2>
      <p className="mb-6 text-gray-300 text-center max-w-xl">
        Simula el reinicio de la unidad de control electrónica (ECU) y verifica la respuesta de los módulos del sistema automotriz.
      </p>

      <button
        disabled={estado === 'reiniciando'}
        onClick={iniciarReinicio}
        className={`mb-6 px-6 py-3 rounded text-white font-semibold transition ${
          estado === 'reiniciando'
            ? 'bg-gray-600 cursor-not-allowed'
            : 'bg-[#c3151b] hover:bg-[#a31116]'
        }`}
      >
        {estado === 'reiniciando' ? 'Reiniciando...' : 'Reiniciar ECU'}
      </button>

      <div className="w-full max-w-md space-y-4 mb-10">
        {sistemas.map(({ nombre, icono: Icon }) => (
          <div
            key={nombre}
            className="flex items-center justify-between bg-[#2b2b2b] px-4 py-3 rounded shadow"
          >
            <div className="flex items-center gap-3">
              <Icon size={22} className="text-white" />
              <span>{nombre}</span>
            </div>
            {estado !== 'idle' && getIconoEstado(nombre)}
          </div>
        ))}
      </div>

      {estado === 'completo' && (
        <div className="flex items-center gap-2 bg-green-700 text-white px-4 py-3 rounded shadow text-center">
          <FaServer size={20} className="text-white" />
          <span>Reinicio completado. Todos los sistemas han sido verificados correctamente.</span>
        </div>
      )}

      <button
        onClick={volver}
        className="mt-8 bg-gray-700 hover:bg-gray-600 px-5 py-2 rounded"
      >
        Volver
      </button>
    </div>
  );
}
