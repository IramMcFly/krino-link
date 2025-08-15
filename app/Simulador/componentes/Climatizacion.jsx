// Componente: Climatizacion.jsx
'use client';

import { useState, useEffect } from 'react';
import { FaThermometer, FaFan, FaFire, FaSnowflake } from 'react-icons/fa';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

export default function Climatizacion({ volver }) {
  const [temperatura, setTemperatura] = useState(22);
  const [velocidad, setVelocidad] = useState(1);
  const [historial, setHistorial] = useState([]);

  useEffect(() => {
    const intervalo = setInterval(() => {
      let consumo = velocidad * 5;
      if (temperatura < 20) consumo += 20; // A/C encendido
      if (temperatura > 24) consumo += 15; // Calefacción encendida

      const nuevo = {
        tiempo: new Date().toLocaleTimeString().slice(0, 5),
        consumo: +consumo.toFixed(1),
      };

      setHistorial((prevHist) => {
        const datos = [...prevHist, nuevo];
        return datos.length > 20 ? datos.slice(datos.length - 20) : datos;
      });
    }, 1000);

    return () => clearInterval(intervalo);
  }, [temperatura, velocidad]);

  const estado = temperatura < 20 ? 'compresor' : temperatura > 24 ? 'calentador' : 'off';

  return (
    <div className="min-h-screen bg-[#1b1f20] text-white px-4 py-10 flex flex-col items-center">
      <h2 className="text-2xl font-bold text-[#c3151b] mb-4">Simulación: Climatización</h2>

      <div className="bg-[#2e2e2e] p-6 rounded-xl shadow-md w-full max-w-3xl">
        <p className="mb-4 text-gray-300">Controla la temperatura y velocidad del ventilador para ver el estado del sistema y consumo eléctrico.</p>

        <div className="mb-6">
          <label className="block mb-1 font-semibold">Temperatura seleccionada: {temperatura}°C</label>
          <input
            type="range"
            min="16"
            max="30"
            value={temperatura}
            onChange={(e) => setTemperatura(Number(e.target.value))}
            className="w-full"
          />
        </div>

        <div className="mb-6">
          <label className="block mb-1 font-semibold">Velocidad del ventilador: {velocidad}</label>
          <input
            type="range"
            min="0"
            max="5"
            value={velocidad}
            onChange={(e) => setVelocidad(Number(e.target.value))}
            className="w-full"
          />
        </div>

        <div className="mb-6 text-center text-sm">
          {estado === 'compresor' && (
            <div className="text-blue-400 flex items-center justify-center gap-2"><FaSnowflake size={18} /> Compresor A/C activo</div>
          )}
          {estado === 'calentador' && (
            <div className="text-orange-400 flex items-center justify-center gap-2"><FaFire size={18} /> Calentador activo</div>
          )}
          {estado === 'off' && (
            <div className="text-gray-400">Sistema en espera</div>
          )}
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2 text-center">Consumo eléctrico (W)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={historial} isAnimationActive={false}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="tiempo" tick={{ fill: 'white', fontSize: 10 }} />
              <YAxis tick={{ fill: 'white', fontSize: 10 }} />
              <Tooltip contentStyle={{ backgroundColor: '#333', color: 'white' }} />
              <Line type="monotone" dataKey="consumo" stroke="#22d3ee" strokeWidth={2} dot={false} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <button onClick={volver} className="mt-8 bg-gray-700 hover:bg-gray-600 px-5 py-2 rounded">
        Volver
      </button>
    </div>
  );
}
