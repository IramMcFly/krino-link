'use client';

import {
  FaTachometer,
  FaCar,
  FaBatteryHalf,
  FaFan,
  FaThermometer,
  FaCog,
  FaShieldAlt,
  FaExclamationTriangle,
  FaSync,
  FaWind,
} from 'react-icons/fa';

const modulos = [
  { nombre: 'ABS', icono: FaShieldAlt, archivo: 'ModuloABS' },
  { nombre: 'Airbags', icono: FaWind, archivo: 'ModuloAirbag' },
  { nombre: 'Reinicio ECU', icono: FaSync, archivo: 'ModuloECUReset' },
  { nombre: 'Transmisión', icono: FaCar, archivo: 'Transmision' },
  { nombre: 'Sistema eléctrico', icono: FaBatteryHalf, archivo: 'SistemaElectrico' },
  { nombre: 'Sistema de enfriamiento', icono: FaFan, archivo: 'Enfriamiento' },
  { nombre: 'Climatización', icono: FaThermometer, archivo: 'Climatizacion' },
  { nombre: 'Otros sistemas', icono: FaCog, archivo: 'OtrosSistemas' },
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
