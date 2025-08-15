// Componente: Transmision.jsx
'use client';

import { useState, useEffect } from 'react';
import { FaCheckCircle, FaCar, FaZap, FaLightbulb, FaFan, FaCog, FaExclamationTriangle } from 'react-icons/fa';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

export default function SistemaElectrico({ volver }) {
  const [actuadores, setActuadores] = useState({ luces: false, ventilador: false, modulo: false });
  const [historial, setHistorial] = useState([]);
  const [cargaActual, setCargaActual] = useState(0);

  useEffect(() => {
    const intervalo = setInterval(() => {
      const carga = Object.values(actuadores).filter(Boolean).length * 15 + 10 + Math.random() * 10;
      const cargaRedondeada = +carga.toFixed(1);
      setCargaActual(cargaRedondeada);
      const nuevo = {
        tiempo: new Date().toLocaleTimeString().slice(0, 5),
        carga: cargaRedondeada,
      };
      setHistorial((prevHist) => {
        const datos = [...prevHist, nuevo];
        return datos.length > 20 ? datos.slice(datos.length - 20) : datos;
      });
    }, 1000);

    return () => clearInterval(intervalo);
  }, [actuadores]);

  const toggleActuador = (nombre) => {
    setActuadores((prev) => ({
      ...prev,
      [nombre]: !prev[nombre],
    }));
  };

  const botones = [
    { nombre: 'luces', label: 'Luces', icono: FaLightbulb },
    { nombre: 'ventilador', label: 'Ventilador', icono: FaFan },
    { nombre: 'modulo', label: 'Módulo auxiliar', icono: FaCog },
  ];

  return (
    <div className="min-h-screen bg-[#1b1f20] text-white px-4 py-10 flex flex-col items-center">
      <h2 className="text-2xl font-bold text-[#c3151b] mb-4">Simulación: Sistema Eléctrico</h2>

      <div className="bg-[#2e2e2e] p-6 rounded-xl shadow-md w-full max-w-3xl">
        <p className="mb-4 text-gray-300">Activa o desactiva actuadores eléctricos para observar su consumo simulado.</p>

        <div className="flex flex-wrap gap-4 mb-6">
          {botones.map(({ nombre, label, icono: Icono }) => (
            <button
              key={nombre}
              onClick={() => toggleActuador(nombre)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all font-medium
                ${actuadores[nombre] ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
            >
              <Icono size={18} /> {label}
            </button>
          ))}
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2 text-center">Consumo eléctrico (W)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={historial} isAnimationActive={false}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="tiempo" tick={{ fill: 'white', fontSize: 10 }} />
              <YAxis tick={{ fill: 'white', fontSize: 10 }} />
              <Tooltip contentStyle={{ backgroundColor: '#333', color: 'white' }} />
              <Line type="monotone" dataKey="carga" stroke="#facc15" strokeWidth={2} dot={false} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>

          {cargaActual > 60 && (
            <div className="mt-4 flex items-center gap-2 text-yellow-400 justify-center text-sm">
              <FaExclamationTriangle size={18} /> Advertencia: Consumo eléctrico elevado ({cargaActual}W)
            </div>
          )}
        </div>
      </div>

      <button onClick={volver} className="mt-8 bg-gray-700 hover:bg-gray-600 px-5 py-2 rounded">
        Volver
      </button>
    </div>
  );
}
