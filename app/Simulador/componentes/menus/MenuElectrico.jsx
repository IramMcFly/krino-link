'use client';

import {
  FaTachometerAlt,
  FaBatteryFull,
  FaBolt,
  FaFan,
  FaThermometer,
  FaCog,
  FaShieldAlt,
  FaSync,
  FaWind,
  FaPlug,
  FaChargingStation,
  FaSearch,
  FaKey
} from 'react-icons/fa';

const modulos = [
  { nombre: 'Análisis Rápido', icono: FaSearch, archivo: 'AnalisisRapidoSimulador', descripcion: 'Escaneo rápido de códigos DTC del vehículo' },
  { nombre: 'Gestión de Batería', icono: FaBatteryFull, archivo: 'GestionBateria', descripcion: 'Monitor y control de la batería de alta tensión' },
  { nombre: 'Motor Eléctrico', icono: FaBolt, archivo: 'MotorElectrico', descripcion: 'Diagnóstico del motor de tracción eléctrica' },
  { nombre: 'Sistema de Carga', icono: FaChargingStation, archivo: 'SistemaCarga', descripcion: 'Control y monitoreo de carga AC/DC' },
  { nombre: 'Inversor', icono: FaTachometerAlt, archivo: 'Inversor', descripcion: 'Diagnóstico del inversor de potencia' },
  { nombre: 'Convertidor DC/DC', icono: FaPlug, archivo: 'ConvertidorDCDC', descripcion: 'Convertidor de alta a baja tensión' },
  { nombre: 'Climatización', icono: FaThermometer, archivo: 'Climatizacion', descripcion: 'Bomba de calor y climatización eficiente' },
  { nombre: 'ABS', icono: FaShieldAlt, archivo: 'ModuloABS', descripcion: 'Sistema de frenos antibloqueo regenerativo' },
  { nombre: 'Airbags', icono: FaWind, archivo: 'ModuloAirbag', descripcion: 'Sistema de bolsas de aire' },
  { nombre: 'Inmovilizador', icono: FaKey, archivo: 'Inmovilizador', descripcion: 'Sistema IMMO - Programador K-Key' },
  { nombre: 'Reinicio ECU', icono: FaSync, archivo: 'ModuloECUReset', descripcion: 'Reinicio de unidades de control' },
];

export default function MenuElectrico({ vehiculo, seleccionarModulo }) {
  return (
    <div className="space-y-6">
      {/* Información específica del vehículo eléctrico */}
      <div className="bg-[#2e2e2e] rounded-xl p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-green-400">
          <FaBolt />
          Vehículo Eléctrico - {vehiculo.nombre}
        </h2>
        
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div>
            <h3 className="font-semibold mb-2">Especificaciones Eléctricas</h3>
            <div className="space-y-1 text-gray-300">
              <p><strong>Batería:</strong> {vehiculo.especificaciones.bateria}</p>
              <p><strong>Potencia:</strong> {vehiculo.especificaciones.potencia}</p>
              <p><strong>Autonomía:</strong> {vehiculo.especificaciones.autonomia}</p>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Estado Actual</h3>
            <div className="space-y-1 text-gray-300">
              <p><strong>Carga:</strong> 78%</p>
              <p><strong>Temp. Batería:</strong> 23°C</p>
              <p><strong>Estado:</strong> Listo</p>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Modos Disponibles</h3>
            <div className="flex flex-wrap gap-2">
              {vehiculo.modosConduccion.map((modo) => (
                <span key={modo} className="px-2 py-1 bg-green-600/20 text-green-300 rounded text-xs">
                  {modo}
                </span>
              ))}
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
                <Icono size={24} className="text-green-400 group-hover:text-green-300" />
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
