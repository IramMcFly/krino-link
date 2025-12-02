'use client';

import {
  FaTachometerAlt,
  FaBatteryHalf,
  FaGasPump,
  FaCogs,
  FaFan,
  FaThermometer,
  FaShieldAlt,
  FaSync,
  FaWind,
  FaBolt,
  FaLeaf,
  FaSearch,
  FaKey
} from 'react-icons/fa';

const modulos = [
  { nombre: 'Análisis Rápido', icono: FaSearch, archivo: 'AnalisisRapidoSimulador', descripcion: 'Escaneo rápido de códigos DTC del vehículo' },
  { nombre: 'Motor de Combustión', icono: FaCogs, archivo: 'MotorCombustion', descripcion: 'Sistema de combustión interna IMA' },
  { nombre: 'Motor Eléctrico IMA', icono: FaBolt, archivo: 'MotorElectricoIMA', descripcion: 'Motor eléctrico de asistencia integrado' },
  { nombre: 'Batería Híbrida', icono: FaBatteryHalf, archivo: 'BateriaHibrida', descripcion: 'Batería NiMH de alto voltaje' },
  { nombre: 'Control Híbrido', icono: FaLeaf, archivo: 'ControlHibrido', descripcion: 'Unidad de control del sistema híbrido' },
  { nombre: 'Sistema de Combustible', icono: FaGasPump, archivo: 'SistemaCombustible', descripcion: 'Inyección y alimentación de combustible' },
  { nombre: 'Sistema CVT', icono: FaTachometerAlt, archivo: 'SistemaCVT', descripcion: 'Transmisión variable continua híbrida' },
  { nombre: 'Climatización', icono: FaThermometer, archivo: 'Climatizacion', descripcion: 'Climatización con eficiencia híbrida' },
  { nombre: 'ABS', icono: FaShieldAlt, archivo: 'ModuloABS', descripcion: 'Sistema de frenos con regeneración' },
  { nombre: 'Airbags', icono: FaWind, archivo: 'ModuloAirbag', descripcion: 'Sistema de bolsas de aire' },
  { nombre: 'Inmovilizador', icono: FaKey, archivo: 'Inmovilizador', descripcion: 'Sistema IMMO - Programador K-Key' },
  { nombre: 'Reinicio ECU', icono: FaSync, archivo: 'ModuloECUReset', descripcion: 'Reinicio de unidades de control' },
];

export default function MenuHibrido({ vehiculo, seleccionarModulo }) {
  return (
    <div className="space-y-6">
      {/* Información específica del vehículo híbrido */}
      <div className="bg-[#2e2e2e] rounded-xl p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-blue-400">
          <FaLeaf />
          Vehículo Híbrido - {vehiculo.nombre}
        </h2>
        
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div>
            <h3 className="font-semibold mb-2">Especificaciones</h3>
            <div className="space-y-1 text-gray-300">
              <p><strong>Motor:</strong> {vehiculo.especificaciones.motorCombustion}</p>
              <p><strong>Motor Eléctrico:</strong> {vehiculo.especificaciones.motorElectrico}</p>
              <p><strong>Batería:</strong> {vehiculo.especificaciones.bateria}</p>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Estado Actual</h3>
            <div className="space-y-1 text-gray-300">
              <p><strong>Modo:</strong> Híbrido</p>
              <p><strong>Batería HV:</strong> 65%</p>
              <p><strong>Temp. Motor:</strong> 89°C</p>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Eficiencia</h3>
            <div className="space-y-1 text-gray-300">
              <p><strong>Consumo:</strong> 4.8 L/100km</p>
              <p><strong>Regeneración:</strong> Activa</p>
              <p><strong>Emisiones:</strong> Ultra Low</p>
            </div>
          </div>
        </div>
      </div>

      {/* Módulos de diagnóstico */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Módulos de Diagnóstico</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {modulos.map(({ nombre, icono: Icono, archivo, descripcion }) => (
            <button
              key={archivo}
              onClick={() => seleccionarModulo(archivo)}
              className="flex flex-col items-start gap-3 bg-[#2a2a2a] hover:bg-[#3a3a3a] p-4 rounded-lg transition-all shadow text-left group"
            >
              <div className="flex items-center gap-3 w-full">
                <Icono size={24} className="text-blue-400 group-hover:text-blue-300" />
                <span className="font-semibold text-sm">{nombre}</span>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">{descripcion}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
