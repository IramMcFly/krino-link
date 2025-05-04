'use client';

import {
  Gauge,
  Car,
  BatteryCharging,
  Fan,
  Thermometer,
  Settings,
  ShieldCheck,
  AlertTriangle,
  RefreshCcw,
  AirVent,
} from 'lucide-react';

const modulos = [
  { nombre: 'ABS', icono: ShieldCheck, archivo: 'ModuloABS' },
  { nombre: 'Airbags', icono: AirVent, archivo: 'ModuloAirbag' },
  { nombre: 'Reinicio ECU', icono: RefreshCcw, archivo: 'ModuloECUReset' },
  { nombre: 'Transmisión', icono: Car, archivo: 'Transmision' },
  { nombre: 'Sistema eléctrico', icono: BatteryCharging, archivo: 'SistemaElectrico' },
  { nombre: 'Sistema de enfriamiento', icono: Fan, archivo: 'Enfriamiento' },
  { nombre: 'Climatización', icono: Thermometer, archivo: 'Climatizacion' },
  { nombre: 'Otros sistemas', icono: Settings, archivo: 'OtrosSistemas' },
];

export default function MenuGeneral({ seleccionarModulo }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {modulos.map(({ nombre, icono: Icono, archivo }) => (
        <button
          key={archivo}
          onClick={() => seleccionarModulo(archivo)}
          className="flex items-center gap-3 bg-[#2a2a2a] hover:bg-[#3a3a3a] p-4 rounded-lg transition-all shadow text-left"
        >
          <Icono size={24} className="text-[#c3151b]" />
          <span className="font-semibold">{nombre}</span>
        </button>
      ))}
    </div>
  );
}
