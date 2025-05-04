'use client';

import { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export default function ABS() {
  const [speed, setSpeed] = useState(50);
  const [brake, setBrake] = useState(30);
  const [dtc, setDtc] = useState(true);

  const data = Array.from({ length: 10 }).map((_, i) => {
    const base = speed * (1 - brake / 100);
    return {
      time: i,
      FL: Math.max(0, base - Math.random() * 10),
      FR: Math.max(0, base - Math.random() * 10),
      RL: Math.max(0, base - Math.random() * 10),
      RR: Math.max(0, base - Math.random() * 10),
    };
  });

  return (
    <div className="p-4 text-white">
      <h2 className="text-2xl font-bold mb-4">Simulador ABS (Frenos Antibloqueo)</h2>
      <p className="mb-2 text-gray-300">
        Controla la velocidad y presión del freno para observar el comportamiento del sistema ABS en las cuatro ruedas.
      </p>

      <div className="mb-6">
        <label className="block mb-2 text-sm font-semibold">
          Velocidad del vehículo: {speed} km/h
        </label>
        <input
          type="range"
          min="0"
          max="200"
          value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
          className="w-full"
        />
      </div>

      <div className="mb-6">
        <label className="block mb-2 text-sm font-semibold">
          Presión del freno: {brake}%
        </label>
        <input
          type="range"
          min="0"
          max="100"
          value={brake}
          onChange={(e) => setBrake(Number(e.target.value))}
          className="w-full"
        />
      </div>

      <div className="mb-6 h-64 bg-white rounded p-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="FL" stroke="#c3151b" dot={false} />
            <Line type="monotone" dataKey="FR" stroke="#ff9900" dot={false} />
            <Line type="monotone" dataKey="RL" stroke="#0088FE" dot={false} />
            <Line type="monotone" dataKey="RR" stroke="#00C49F" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {dtc && (
        <div className="bg-yellow-700 text-white p-4 rounded mb-4">
          <strong>Código DTC:</strong> C0035 - Sensor de velocidad de rueda frontal izquierdo defectuoso.
          <button
            className="mt-2 ml-4 px-3 py-1 bg-gray-800 rounded text-sm"
            onClick={() => setDtc(false)}
          >
            Borrar DTC
          </button>
        </div>
      )}
    </div>
  );
}
