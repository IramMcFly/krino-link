'use client';

import { useEffect, useState } from 'react';
import {
  GaugeCircle,
  SlidersHorizontal,
  Thermometer,
  BatteryCharging,
  AlertTriangle,
  Car
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

const modosTransmision = ['P', 'R', 'N', 'D', 'S', 'L'];

const temperaturasMedias = {
  P: 40,
  R: 45,
  N: 45,
  D: 55,
  S: 60,
  L: 50,
};

export default function AnalisisMotor() {
  const [acelerador, setAcelerador] = useState(0);
  const [modo, setModo] = useState('P');
  const [historial, setHistorial] = useState([]);
  const [logEventos, setLogEventos] = useState([]);
  const [velocidadActualizacion, setVelocidadActualizacion] = useState(500);

  useEffect(() => {
    let acumulacionCalor = 0;
    let temperatura = temperaturasMedias[modo];

    const simular = () => {
      let corriente = 0;
      let carga = 0;
      const eventos = [];

      if (modo !== 'P') {
        let factorCorriente = 1.5;
        if (modo === 'S') factorCorriente = 2.5;

        const baseCorriente = acelerador * factorCorriente;
        corriente = +(baseCorriente + (Math.random() * 0.1 - 0.05) * baseCorriente).toFixed(1);

        const calorGenerado = corriente * 0.015;
        const enfriamiento = 0.04 + (modo === 'S' ? 0.01 : 0.05);

        acumulacionCalor += calorGenerado;
        acumulacionCalor = Math.max(0, acumulacionCalor - enfriamiento);

        if ((['R', 'N', 'L'].includes(modo) && acelerador < 50) || acelerador === 0) {
          acumulacionCalor *= 0.92;
        }

        const oscilacion = Math.sin(Date.now() / 1000) * 1.5;
        const temperaturaMedia = temperaturasMedias[modo];
        temperatura = +(temperaturaMedia + acumulacionCalor + oscilacion).toFixed(1);

        carga = Math.min(100, +(acelerador + (Math.random() * 0.1 - 0.05) * acelerador).toFixed(1));

        if (temperatura >= 90) {
          eventos.push(`⚠️ Temperatura crítica detectada: ${temperatura} °C`);
        }
      } else {
        acumulacionCalor = Math.max(0, acumulacionCalor - 0.6);
        const oscilacion = Math.sin(Date.now() / 1000) * 1.5;
        temperatura = +(temperaturasMedias[modo] + acumulacionCalor + oscilacion).toFixed(1);
      }

      const nuevoPunto = {
        tiempo: new Date().toLocaleTimeString().slice(0, 5),
        corriente,
        temperatura,
        carga,
        alertaTemperatura: temperatura >= 90,
      };

      setHistorial(prev => {
        const actualizado = [...prev, nuevoPunto];
        return actualizado.length > 20 ? actualizado.slice(actualizado.length - 20) : actualizado;
      });

      setLogEventos(prev => {
        const actualizados = [...prev, ...eventos];
        return actualizados.length > 10 ? actualizados.slice(actualizados.length - 10) : actualizados;
      });
    };

    const intervalo = setInterval(simular, velocidadActualizacion);
    return () => clearInterval(intervalo);
  }, [acelerador, modo, velocidadActualizacion]);

  const getColorForMode = (m) => {
    if (['P', 'R', 'N'].includes(m)) return 'bg-red-600';
    if (['D', 'S'].includes(m)) return 'bg-green-600';
    if (m === 'L') return 'bg-yellow-500';
    return 'bg-[#c3151b]';
  };

  return (
    <div className="min-h-screen bg-[#1b1f20] text-white px-4 py-10 flex flex-col items-center">
      <h1 className="text-2xl font-bold text-[#c3151b] mb-4">Análisis de Motor</h1>

      <div className="bg-[#2e2e2e] p-6 rounded-xl shadow-md w-full max-w-5xl space-y-6">
        <div className="flex items-center gap-3">
          <GaugeCircle size={24} className="text-blue-400" />
          <p className="text-lg font-medium">
            Código DTC detectado: <span className="text-red-500 font-bold">P0A1F</span>
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm text-gray-300 flex items-center gap-2">
              <SlidersHorizontal size={18} /> Posición del acelerador: {acelerador}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={acelerador}
              onChange={(e) => setAcelerador(Number(e.target.value))}
              className="w-full mt-2"
            />
          </div>

          <div>
            <label className="text-sm text-gray-300 mb-2 block">Modo de transmisión</label>
            <div className="flex justify-between items-center gap-1 bg-[#1a1a1a] p-2 rounded-lg border border-[#444]">
              {modosTransmision.map((m) => (
                <button
                  key={m}
                  onClick={() => setModo(m)}
                  className={`w-10 h-10 rounded-md text-sm font-bold flex items-center justify-center transition-all duration-200
                    ${modo === m ? getColorForMode(m) + ' text-white' : 'bg-[#333] text-gray-300 hover:bg-[#444]'}`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <label className="text-sm text-gray-300 flex items-center gap-2">
            <BatteryCharging size={18} /> Velocidad de actualización: {velocidadActualizacion} ms
          </label>
          <input
            type="range"
            min="200"
            max="2000"
            step="100"
            value={velocidadActualizacion}
            onChange={(e) => setVelocidadActualizacion(Number(e.target.value))}
            className="w-full mt-2"
          />
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <h2 className="text-lg font-semibold mb-2 text-center">Corriente (A)</h2>
            <ResponsiveContainer width="100%" height={200} debounce={0}>
              <LineChart data={historial} isAnimationActive={false}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="tiempo" tick={{ fill: 'white', fontSize: 10 }} />
                <YAxis tick={{ fill: 'white', fontSize: 10 }} />
                <Tooltip contentStyle={{ backgroundColor: '#333', color: 'white' }} />
                <Line type="monotone" dataKey="corriente" stroke="#facc15" strokeWidth={2} dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2 text-center">Temperatura (°C)</h2>
            <ResponsiveContainer width="100%" height={200} debounce={0}>
              <LineChart data={historial} isAnimationActive={false}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="tiempo" tick={{ fill: 'white', fontSize: 10 }} />
                <YAxis tick={{ fill: 'white', fontSize: 10 }} />
                <Tooltip contentStyle={{ backgroundColor: '#333', color: 'white' }} />
                <Line type="monotone" dataKey="temperatura" stroke="#ef4444" strokeWidth={2} dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
            {historial[historial.length - 1]?.alertaTemperatura && (
              <div className="text-yellow-500 flex items-center gap-2 mt-2 text-sm justify-center">
                <AlertTriangle size={16} /> Temperatura elevada del motor
              </div>
            )}
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2 text-center">Carga (%)</h2>
            <ResponsiveContainer width="100%" height={200} debounce={0}>
              <LineChart data={historial} isAnimationActive={false}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="tiempo" tick={{ fill: 'white', fontSize: 10 }} />
                <YAxis domain={[0, 100]} tick={{ fill: 'white', fontSize: 10 }} />
                <Tooltip contentStyle={{ backgroundColor: '#333', color: 'white' }} />
                <Line type="monotone" dataKey="carga" stroke="#22c55e" strokeWidth={2} dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {logEventos.length > 0 && (
          <div className="bg-[#1b1f20] border border-yellow-600 p-4 rounded-md mt-6">
            <h3 className="text-sm text-yellow-500 font-semibold mb-2">Eventos recientes:</h3>
            <ul className="text-sm text-yellow-300 space-y-1 list-disc list-inside">
              {logEventos.map((evento, idx) => (
                <li key={idx}>{evento}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}