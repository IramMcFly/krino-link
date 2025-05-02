'use client';

import { useEffect, useState } from 'react';
import { BatteryFull, Zap, PlugZap, Loader2 } from 'lucide-react';
import { ResponsiveContainer, RadialBarChart, RadialBar, Legend } from 'recharts';

export default function AnalisisBateria() {
  const [cargando, setCargando] = useState(true);
  const [estadoBateria, setEstadoBateria] = useState({});

  useEffect(() => {
    setTimeout(() => {
      setEstadoBateria({
        porcentaje: 78,
        capacidadTotal: 45, // kWh
        voltaje: 350, // V
        corriente: 115, // A
        estado: 'Descargando',
        temperatura: 34, // °C
        ciclosCarga: 312,
        salud: 92, // %
        autonomiaEstimada: Math.round((78 / 100) * 380),
      });
      setCargando(false);
    }, 2000);
  }, []);

  const data = [
    {
      name: 'Salud de batería',
      value: estadoBateria.salud || 0,
      fill: '#16a34a',
    },
  ];

  const style = {
    top: '50%',
    right: 0,
    transform: 'translate(0, -50%)',
    lineHeight: '24px',
    color: '#ffffff',
  };

  return (
    <div className="min-h-screen bg-[#1b1f20] text-white px-4 py-10 flex flex-col items-center text-center">
      <h1 className="text-2xl font-bold text-[#c3151b] mb-6">Análisis de Batería</h1>

      {cargando ? (
        <div className="w-full max-w-md bg-[#2e2e2e] p-6 rounded-xl shadow-md">
          <Loader2 className="animate-spin mx-auto mb-3" size={28} />
          <p className="text-gray-300">Obteniendo datos de la batería...</p>
        </div>
      ) : (
        <div className="w-full max-w-md bg-[#2e2e2e] p-6 rounded-xl shadow-md space-y-4 text-left">
          <div className="flex items-center gap-2">
            <BatteryFull size={20} className="text-green-400" />
            <p><strong>Nivel de carga:</strong> {estadoBateria.porcentaje}%</p>
          </div>
          <div className="flex items-center gap-2">
            <Zap size={20} className="text-yellow-400" />
            <p><strong>Capacidad total:</strong> {estadoBateria.capacidadTotal} kWh</p>
          </div>
          <div className="flex items-center gap-2">
            <PlugZap size={20} className="text-blue-400" />
            <p><strong>Voltaje:</strong> {estadoBateria.voltaje} V</p>
          </div>
          <p><strong>Corriente:</strong> {estadoBateria.corriente} A</p>
          <p><strong>Temperatura:</strong> {estadoBateria.temperatura} °C</p>
          <p><strong>Estado:</strong> {estadoBateria.estado}</p>
          <p><strong>Ciclos de carga:</strong> {estadoBateria.ciclosCarga}</p>
          <p><strong>Salud estimada:</strong> {estadoBateria.salud}%</p>
          <p><strong>Autonomía estimada:</strong> {estadoBateria.autonomiaEstimada} km</p>

          {/* Gráfico de salud */}
          <div className="w-full h-60 bg-[#1f1f1f] rounded-xl p-4">
            <h3 className="text-lg font-semibold mb-2 text-center">Estado de desgaste</h3>
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart
                cx="50%"
                cy="50%"
                innerRadius="70%"
                outerRadius="100%"
                barSize={15}
                data={data}
              >
                <RadialBar
                  minAngle={15}
                  background
                  clockWise
                  dataKey="value"
                />
                <Legend
                  iconSize={10}
                  width={120}
                  layout="vertical"
                  verticalAlign="middle"
                  wrapperStyle={style}
                />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
