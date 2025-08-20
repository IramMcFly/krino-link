'use client';

import {
  FaTachometerAlt,
  FaGasPump,
  FaCogs,
  FaFan,
  FaThermometer,
  FaOilCan,
  FaShieldAlt,
  FaSync,
  FaWind,
  FaCloud,
  FaTools,
  FaSearch
} from 'react-icons/fa';

const modulos = [
  { nombre: 'Análisis Rápido', icono: FaSearch, archivo: 'AnalisisRapidoSimulador', descripcion: 'Escaneo rápido de códigos DTC del vehículo' },
  { nombre: 'Motor TDI', icono: FaCogs, archivo: 'MotorTDI', descripcion: 'Motor diésel turboalimentado de inyección directa' },
  { nombre: 'Sistema de Combustible', icono: FaGasPump, archivo: 'SistemaCombustibleDiesel', descripcion: 'Sistema de inyección diésel common rail' },
  { nombre: 'Turbocompresor', icono: FaFan, archivo: 'Turbocompresor', descripcion: 'Sistema de sobrealimentación por turbo' },
  { nombre: 'Transmisión', icono: FaTachometerAlt, archivo: 'Transmision', descripcion: 'Caja de cambios manual de 5 velocidades' },
  { nombre: 'Sistema de Escape', icono: FaCloud, archivo: 'SistemaEscape', descripcion: 'Control de emisiones y catalizador' },
  { nombre: 'Sistema de Aceite', icono: FaOilCan, archivo: 'SistemaAceite', descripcion: 'Lubricación y presión de aceite' },
  { nombre: 'Climatización', icono: FaThermometer, archivo: 'Climatizacion', descripcion: 'Sistema de aire acondicionado' },
  { nombre: 'ABS', icono: FaShieldAlt, archivo: 'ModuloABS', descripcion: 'Sistema de frenos antibloqueo' },
  { nombre: 'Airbags', icono: FaWind, archivo: 'ModuloAirbag', descripcion: 'Sistema de bolsas de aire' },
  { nombre: 'Reinicio ECU', icono: FaSync, archivo: 'ModuloECUReset', descripcion: 'Reinicio de unidades de control' },
];

export default function MenuDiesel({ vehiculo, seleccionarModulo }) {
  return (
    <div className="space-y-6">
      {/* Información específica del vehículo diésel */}
      <div className="bg-[#2e2e2e] rounded-xl p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-orange-400">
          <FaCogs />
          Vehículo Diésel - {vehiculo.nombre}
        </h2>
        
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div>
            <h3 className="font-semibold mb-2">Especificaciones Motor</h3>
            <div className="space-y-1 text-gray-300">
              <p><strong>Motor:</strong> {vehiculo.especificaciones.motor}</p>
              <p><strong>Potencia:</strong> {vehiculo.especificaciones.potencia}</p>
              <p><strong>Torque:</strong> {vehiculo.especificaciones.torque}</p>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Estado Actual</h3>
            <div className="space-y-1 text-gray-300">
              <p><strong>Temp. Motor:</strong> 92°C</p>
              <p><strong>Presión Turbo:</strong> 1.8 bar</p>
              <p><strong>Presión Aceite:</strong> 4.2 bar</p>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Eficiencia</h3>
            <div className="space-y-1 text-gray-300">
              <p><strong>Consumo:</strong> 5.8 L/100km</p>
              <p><strong>Emisiones:</strong> Euro 4</p>
              <p><strong>Mantenimiento:</strong> Al día</p>
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
                <Icono size={24} className="text-orange-400 group-hover:text-orange-300" />
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
