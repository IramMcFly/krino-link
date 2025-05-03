'use client';

import { useEffect, useState } from 'react';
import { BatteryFull, Zap, PlugZap, Thermometer, Bolt } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function AnalisisBateria() {
  const [cargando, setCargando] = useState(true);
  const [estadoBateria, setEstadoBateria] = useState({});
  const [parametroSeleccionado, setParametroSeleccionado] = useState(null);
  const [historico, setHistorico] = useState([]);

  useEffect(() => {
    setTimeout(() => {
      const inicial = {
        porcentaje: 78,
        capacidadTotal: 45,
        voltaje: 350,
        corriente: 115,
        estado: 'Descargando',
        temperatura: 34,
        ciclosCarga: 312,
        salud: 92,
        autonomiaEstimada: Math.round((78 / 100) * 380),
      };
      setEstadoBateria(inicial);
      setCargando(false);
      setHistorico([{ tiempo: new Date().toLocaleTimeString().slice(0, 5), voltaje: inicial.voltaje, corriente: inicial.corriente, temperatura: inicial.temperatura }]);
    }, 2000);
  }, []);

  useEffect(() => {
    if (!cargando) {
      const intervalo = setInterval(() => {
        setEstadoBateria(prev => {
          const voltaje = +(prev.voltaje + (Math.random() * 2 - 1)).toFixed(1);
          const corriente = +(prev.corriente + (Math.random() * 4 - 2)).toFixed(1);
          const temperatura = +(prev.temperatura + (Math.random() * 1.5 - 0.7)).toFixed(1);
          const nuevoHist = [...historico.slice(-19), {
            tiempo: new Date().toLocaleTimeString().slice(0, 5),
            voltaje,
            corriente,
            temperatura
          }];
          setHistorico(nuevoHist);
          return { ...prev, voltaje, corriente, temperatura };
        });
      }, 2500);
      return () => clearInterval(intervalo);
    }
  }, [cargando, historico]);

  const graficoDatos = parametroSeleccionado ? historico.map(h => ({
    name: h.tiempo,
    valor: h[parametroSeleccionado.toLowerCase()]
  })) : [];

  const saludMensual = [
    { mes: 'Enero', salud: 100 },
    { mes: 'Feb', salud: 96 },
    { mes: 'Marzo', salud: 94 },
    { mes: 'Abril', salud: 92 },
  ];

  return (
    <div className="min-h-screen bg-[#1b1f20] text-white px-4 py-10 flex flex-col items-center text-center">
      <h1 className="text-2xl font-bold text-[#c3151b] mb-6">Análisis de Batería</h1>

      {cargando ? (
        <div className="w-full max-w-md bg-[#2e2e2e] p-6 rounded-xl shadow-md">
          <p className="text-center animate-pulse">Cargando datos...</p>
        </div>
      ) : (
        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#2e2e2e] p-6 rounded-xl shadow-md space-y-4 text-left">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setParametroSeleccionado('Voltaje')}>
              <PlugZap size={20} className="text-blue-400" />
              <p><strong>Voltaje:</strong> {estadoBateria.voltaje} V</p>
            </div>
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setParametroSeleccionado('Corriente')}>
              <Bolt size={20} className="text-yellow-300" />
              <p><strong>Corriente:</strong> {estadoBateria.corriente} A</p>
            </div>
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setParametroSeleccionado('Temperatura')}>
              <Thermometer size={20} className="text-red-400" />
              <p><strong>Temperatura:</strong> {estadoBateria.temperatura} °C</p>
            </div>
            <div className="flex items-center gap-2">
              <BatteryFull size={20} className="text-green-400" />
              <p><strong>Nivel de carga:</strong> {estadoBateria.porcentaje}%</p>
            </div>
            <div className="flex items-center gap-2">
              <Zap size={20} className="text-pink-400" />
              <p><strong>Capacidad total:</strong> {estadoBateria.capacidadTotal} kWh</p>
            </div>
            <p><strong>Estado:</strong> {estadoBateria.estado}</p>
            <p><strong>Ciclos de carga:</strong> {estadoBateria.ciclosCarga}</p>
            <p><strong>Salud estimada:</strong> {estadoBateria.salud}%</p>
            <p><strong>Autonomía estimada:</strong> {estadoBateria.autonomiaEstimada} km</p>
          </div>

          <div className="bg-[#2e2e2e] p-6 rounded-xl shadow-md">
            <h3 className="text-lg font-semibold mb-2 text-center">Salud de la batería</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={saludMensual}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="mes" stroke="#fff" />
                <YAxis domain={[80, 100]} stroke="#fff" tickFormatter={(v) => `${v}%`} />
                <Tooltip contentStyle={{ backgroundColor: '#333', color: '#fff' }} formatter={(value) => `${value}%`} />
                <Line type="monotone" dataKey="salud" stroke="#16a34a" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {parametroSeleccionado && (
            <div className="md:col-span-2 w-full bg-[#2e2e2e] p-6 rounded-xl shadow-md">
              <h3 className="text-lg font-semibold mb-2 text-center">{parametroSeleccionado} en tiempo real</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={graficoDatos}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="name" tick={{ fill: 'white', fontSize: 10 }} />
                  <YAxis tick={{ fill: 'white', fontSize: 10 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#333', color: 'white' }} />
                  <Line type="monotone" dataKey="valor" stroke="#22c55e" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
