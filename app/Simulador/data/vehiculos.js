// Configuración de vehículos disponibles para simulación
export const vehiculosDisponibles = {
  'byd-dolphin': {
    id: 'byd-dolphin',
    nombre: 'BYD Dolphin Mini',
    año: 2024,
    tipo: 'electrico',
    numeroSerie: '3N1AB7AP8GY256791',
    imagen: '/images/vehicles/byd-dolphin.jpg',
    especificaciones: {
      motor: 'Eléctrico sincrónico',
      potencia: '95 kW (127 hp)',
      bateria: '44.9 kWh',
      autonomia: '405 km',
      cargaMaxima: '60 kW DC',
      transmision: 'Automática (1 velocidad)',
    },
    sistemas: ['ABS', 'Airbags', 'ECU', 'BatteryManagement', 'ElectricMotor', 'Climatizacion', 'ChargingSystem'],
    parametros: {
      bateria: { min: 0, max: 100, unidad: '%' },
      voltaje: { min: 300, max: 400, unidad: 'V' },
      corriente: { min: 0, max: 200, unidad: 'A' },
      temperatura: { min: 15, max: 85, unidad: '°C' },
      velocidad: { min: 0, max: 160, unidad: 'km/h' },
      potencia: { min: 0, max: 95, unidad: 'kW' }
    },
    modosConduccion: ['Eco', 'Normal', 'Sport'],
    codigosDTC: ['P0A1F', 'P0AA6', 'P0A0F', 'U0100']
  },
  
  'honda-accord-2005': {
    id: 'honda-accord-2005',
    nombre: '2005 Honda Accord Hybrid',
    año: 2005,
    tipo: 'hibrido',
    numeroSerie: '1HGCM66574A123456',
    imagen: '/images/vehicles/2005Accord.jpg',
    especificaciones: {
      motorGasolina: 'V6 3.0L VTEC',
      motorElectrico: 'Motor IMA',
      potenciaTotal: '255 hp',
      bateria: 'NiMH 144V',
      combustible: '64 litros',
      transmision: 'CVT',
      traccion: 'Delantera'
    },
    sistemas: ['ABS', 'Airbags', 'ECU', 'IMA', 'VTEC', 'Transmision', 'Climatizacion', 'FuelSystem'],
    parametros: {
      rpm: { min: 600, max: 7000, unidad: 'RPM' },
      velocidad: { min: 0, max: 180, unidad: 'km/h' },
      temperatura: { min: 70, max: 110, unidad: '°C' },
      combustible: { min: 0, max: 64, unidad: 'L' },
      bateriaHV: { min: 0, max: 100, unidad: '%' },
      voltajeHV: { min: 100, max: 158, unidad: 'V' }
    },
    modosConduccion: ['Eco', 'Normal'],
    codigosDTC: ['P1449', 'P1456', 'P1570', 'P1571', 'P0420']
  },

  'vw-bora-2007': {
    id: 'vw-bora-2007',
    nombre: '2007 Volkswagen Bora TDI',
    año: 2007,
    tipo: 'diesel',
    numeroSerie: '3VWSK69M47M123456',
    imagen: '/images/vehicles/vw-bora-2007.jpg',
    especificaciones: {
      motor: '1.9L TDI Turbo Diesel',
      potencia: '105 hp / 250 Nm',
      combustible: '55 litros',
      transmision: 'Automatica 5 velocidades',
      traccion: 'Delantera',
      inyeccion: 'Common Rail'
    },
    sistemas: ['ABS', 'Airbags', 'ECU', 'TurboSystem', 'DieselInjection', 'EGR', 'DPF', 'Climatizacion'],
    parametros: {
      rpm: { min: 750, max: 5000, unidad: 'RPM' },
      velocidad: { min: 0, max: 190, unidad: 'km/h' },
      temperatura: { min: 80, max: 105, unidad: '°C' },
      combustible: { min: 0, max: 55, unidad: 'L' },
      presionTurbo: { min: 0, max: 2.5, unidad: 'bar' },
      presionRail: { min: 200, max: 1600, unidad: 'bar' }
    },
    modosConduccion: ['Eco', 'Normal', 'Sport'],
    codigosDTC: ['P0234', 'P0299', 'P0401', 'P0402', 'P0471']
  },

  'vw-id4-2025': {
    id: 'vw-id4-2025',
    nombre: '2025 Volkswagen ID.4',
    año: 2025,
    tipo: 'electrico',
    numeroSerie: 'WVWZZZ7KZRP123456',
    imagen: '/images/vehicles/vw-id4-2025.jpeg',
    especificaciones: {
      motor: 'Motor eléctrico trasero',
      potencia: '150 kW (204 hp)',
      bateria: '82 kWh',
      autonomia: '520 km',
      cargaMaxima: '125 kW DC',
      transmision: 'Automática (1 velocidad)',
      traccion: 'Trasera'
    },
    sistemas: ['ABS', 'Airbags', 'ECU', 'BatteryManagement', 'ElectricMotor', 'HeatPump', 'ChargingSystem', 'Travel Assist'],
    parametros: {
      bateria: { min: 0, max: 100, unidad: '%' },
      voltaje: { min: 350, max: 420, unidad: 'V' },
      corriente: { min: 0, max: 300, unidad: 'A' },
      temperatura: { min: 10, max: 90, unidad: '°C' },
      velocidad: { min: 0, max: 180, unidad: 'km/h' },
      potencia: { min: 0, max: 150, unidad: 'kW' }
    },
    modosConduccion: ['Eco', 'Comfort', 'Sport', 'Individual'],
    codigosDTC: ['P0A1F', 'P0AA6', 'P0A0F', 'U0100', 'B10A7']
  },

  'kia-ev6-2024': {
    id: 'kia-ev6-2024',
    nombre: '2024 KIA EV6 GT-Line',
    año: 2024,
    tipo: 'electrico',
    numeroSerie: 'KNEV253A8P7123456',
    imagen: '/images/vehicles/kia-ev6-2024.jpeg',
    especificaciones: {
      motor: 'Motor dual (delantero + trasero)',
      potencia: '239 kW (320 hp)',
      bateria: '77.4 kWh',
      autonomia: '528 km',
      cargaMaxima: '240 kW DC / 11 kW AC',
      transmision: 'Automática (1 velocidad)',
      traccion: 'AWD (Tracción total)'
    },
    sistemas: ['ABS', 'Airbags', 'ECU', 'BatteryManagement', 'DualMotor', 'HeatPump', 'UltraFastCharging', 'V2L', 'Level2Autonomy'],
    parametros: {
      bateria: { min: 0, max: 100, unidad: '%' },
      voltaje: { min: 350, max: 800, unidad: 'V' },
      corriente: { min: 0, max: 350, unidad: 'A' },
      temperatura: { min: 5, max: 95, unidad: '°C' },
      velocidad: { min: 0, max: 185, unidad: 'km/h' },
      potencia: { min: 0, max: 239, unidad: 'kW' },
      torque: { min: 0, max: 605, unidad: 'Nm' }
    },
    modosConduccion: ['Eco', 'Normal', 'Sport', 'Snow', 'AWD'],
    codigosDTC: ['P0A1F', 'P0AA6', 'P0A0F', 'U0100', 'B10A7', 'C1A01', 'P0C1F']
  }
};

export const tiposVehiculo = {
  electrico: {
    nombre: 'Eléctrico',
    color: '#22c55e',
    icono: 'FaBolt',
    caracteristicas: ['bateria', 'motorElectrico', 'sistemaCarga']
  },
  hibrido: {
    nombre: 'Híbrido',
    color: '#f59e0b',
    icono: 'FaLeaf',
    caracteristicas: ['motorGasolina', 'motorElectrico', 'bateria', 'combustible']
  },
  diesel: {
    nombre: 'Diésel',
    color: '#6366f1',
    icono: 'FaOilCan',
    caracteristicas: ['motorDiesel', 'turbo', 'inyeccion', 'combustible']
  },
  gasolina: {
    nombre: 'Gasolina',
    color: '#ef4444',
    icono: 'FaGasPump',
    caracteristicas: ['motorGasolina', 'combustible', 'encendido']
  }
};
