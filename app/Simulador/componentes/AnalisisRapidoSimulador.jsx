'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaSpinner, FaExclamationTriangle, FaSquare, FaCheckCircle, FaCommentDots, FaArrowLeft, FaSearch } from 'react-icons/fa';
import ModuleStyles from './styles/ModuleStyles';

export default function AnalisisRapidoSimulador({ vehiculo, volver }) {
  const router = useRouter();
  const [progreso, setProgreso] = useState(0);
  const [sistemaActual, setSistemaActual] = useState('');
  const [analisisTerminado, setAnalisisTerminado] = useState(false);
  const [eliminando, setEliminando] = useState(false);
  const [fallas, setFallas] = useState([]);
  const [escaneoPostEliminacion, setEscaneoPostEliminacion] = useState(false);
  const [escaneando, setEscaneando] = useState(false);

  // Usar los códigos DTC específicos del vehículo
  const generarDTCsDelVehiculo = (postEliminacion = false) => {
    const codigosPosibles = vehiculo.codigosDTC || [];
    
    // Si es post-eliminación, simular menos códigos activos (solo códigos realmente activos)
    // Si es primer escaneo, mostrar más códigos (incluye códigos almacenados en memoria)
    const probabilidadFalla = postEliminacion ? 0.25 : 0.7; // 25% después de eliminación vs 70% inicial
    const dtcsActivos = [];

    // Diccionario de descripciones para códigos DTC específicos
    const descripcionesDTC = {
      // Códigos eléctricos/híbridos
      'P0A1F': 'Falla en el controlador del motor eléctrico',
      'P0AA6': 'Sistema de batería de alta tensión - voltaje insuficiente',
      'P0A0F': 'Motor/generador A - circuito de control',
      'U0100': 'Pérdida de comunicación con ECM/PCM "A"',
      'B10A7': 'Sensor de temperatura de batería - circuito abierto',
      'C1A01': 'Sistema de frenos regenerativos - falla',
      'P0C1F': 'Motor híbrido - sobrecalentamiento',
      
      // Códigos híbridos Honda IMA
      'P1449': 'Sistema IMA - falla en el paquete de baterías',
      'P1456': 'Sistema IMA - circuito de control',
      'P1570': 'Sistema IMA - sobrecalentamiento del motor eléctrico',
      'P1571': 'Sistema IMA - falla en el inversor',
      'P0420': 'Eficiencia del catalizador por debajo del umbral',
      
      // Códigos diesel
      'P0234': 'Turbocompresor/sobrealimentador "A" - condición de sobrealimentación',
      'P0299': 'Turbocompresor/sobrealimentador "A" - condición de baja alimentación',
      'P0401': 'Flujo de EGR detectado insuficiente',
      'P0402': 'Flujo de EGR detectado excesivo',
      'P0471': 'Sensor de presión de gases de escape - rango/rendimiento'
    };

    const sistemasMap = {
      'P0A1F': 'ECM', 'P0AA6': 'BMS', 'P0A0F': 'ECM', 'U0100': 'PCM',
      'P1449': 'IMA', 'P1456': 'IMA', 'P1570': 'IMA', 'P1571': 'IMA', 'P0420': 'ECM',
      'P0234': 'ECM', 'P0299': 'ECM', 'P0401': 'EGR', 'P0402': 'EGR', 'P0471': 'ECM',
      'B10A7': 'BMS', 'C1A01': 'BCM', 'P0C1F': 'HCM'
    };

    const coloresDTC = {
      'P0A1F': 'bg-red-600', 'P0AA6': 'bg-red-600', 'P0A0F': 'bg-yellow-600',
      'U0100': 'bg-red-600', 'B10A7': 'bg-yellow-600', 'C1A01': 'bg-orange-600',
      'P0C1F': 'bg-red-600', 'P1449': 'bg-red-600', 'P1456': 'bg-yellow-600',
      'P1570': 'bg-red-600', 'P1571': 'bg-orange-600', 'P0420': 'bg-yellow-600',
      'P0234': 'bg-red-600', 'P0299': 'bg-orange-600', 'P0401': 'bg-yellow-600',
      'P0402': 'bg-yellow-600', 'P0471': 'bg-orange-600'
    };

    const iconosDTC = {
      'critical': FaSquare,
      'warning': FaExclamationTriangle
    };

    // Filtrar códigos que estarán activos basado en probabilidad
    codigosPosibles.forEach(codigo => {
      // Si es primer escaneo, mostrar TODOS los códigos
      // Si es post-eliminación, usar probabilidad reducida
      const mostrarCodigo = postEliminacion ? (Math.random() < probabilidadFalla) : true; // TODOS en primer escaneo
      
      if (mostrarCodigo) {
        const severidad = coloresDTC[codigo]?.includes('red') ? 'critical' : 'warning';
        dtcsActivos.push({
          sistema: sistemasMap[codigo] || 'ECM',
          modulo: getModuloDescripcion(sistemasMap[codigo] || 'ECM'),
          codigo: codigo,
          descripcion: descripcionesDTC[codigo] || `Código ${codigo} - revisar sistema específico`,
          severidad: severidad,
          color: coloresDTC[codigo] || 'bg-gray-600',
          icono: iconosDTC[severidad] || FaSquare
        });
      }
    });

    // Si es post-eliminación y no hay códigos, asegurar que quede al menos uno (falla realmente activa)
    // Si es el primer escaneo y no hay códigos, asegurar que aparezca al menos uno
    if (dtcsActivos.length === 0 && codigosPosibles.length > 0) {
      const primerCodigo = codigosPosibles[0];
      const severidad = coloresDTC[primerCodigo]?.includes('red') ? 'critical' : 'warning';
      
      dtcsActivos.push({
        sistema: sistemasMap[primerCodigo] || 'ECM',
        modulo: getModuloDescripcion(sistemasMap[primerCodigo] || 'ECM'),
        codigo: primerCodigo,
        descripcion: descripcionesDTC[primerCodigo] || `Código ${primerCodigo} - revisar sistema específico`,
        color: coloresDTC[primerCodigo] || 'bg-yellow-600',
        icono: iconosDTC[severidad]
      });
    }

    // Si es post-eliminación, asegurar que al menos quede 1-2 códigos para mejor simulación
    if (postEliminacion && dtcsActivos.length === 0 && codigosPosibles.length > 0) {
      // Seleccionar 1-2 códigos aleatorios como "realmente activos"
      const cantidadMinima = Math.min(2, codigosPosibles.length);
      const codigosSeleccionados = [];
      
      for (let i = 0; i < cantidadMinima; i++) {
        const indiceAleatorio = Math.floor(Math.random() * codigosPosibles.length);
        const codigoSeleccionado = codigosPosibles[indiceAleatorio];
        
        if (!codigosSeleccionados.includes(codigoSeleccionado)) {
          codigosSeleccionados.push(codigoSeleccionado);
          const severidad = coloresDTC[codigoSeleccionado]?.includes('red') ? 'critical' : 'warning';
          
          dtcsActivos.push({
            sistema: sistemasMap[codigoSeleccionado] || 'ECM',
            modulo: getModuloDescripcion(sistemasMap[codigoSeleccionado] || 'ECM'),
            codigo: codigoSeleccionado,
            descripcion: descripcionesDTC[codigoSeleccionado] || `Código ${codigoSeleccionado} - revisar sistema específico`,
            color: coloresDTC[codigoSeleccionado] || 'bg-yellow-600',
            icono: iconosDTC[severidad]
          });
        }
      }
    }

    return dtcsActivos;
  };

  const getModuloDescripcion = (sistema) => {
    const descripciones = {
      'ECM': 'Módulo de control del motor',
      'BMS': 'Sistema de gestión de batería',
      'PCM': 'Módulo de control del tren motriz',
      'IMA': 'Motor asistido integrado',
      'EGR': 'Recirculación de gases de escape',
      'ABS': 'Sistema antibloqueo de frenos',
      'BCM': 'Módulo de control de carrocería',
      'HCM': 'Módulo de control híbrido'
    };
    return descripciones[sistema] || 'Módulo de control';
  };

  useEffect(() => {
    if (!escaneando) return;
    
    // Simular el proceso de escaneo usando los sistemas del vehículo
    const sistemas = vehiculo.sistemas || ['ECM', 'BCM', 'ABS', 'PCM'];
    let i = 0;
    
    const interval = setInterval(() => {
      if (i < sistemas.length) {
        setSistemaActual(sistemas[i]);
        setProgreso(Math.round(((i + 1) / sistemas.length) * 100));
        i++;
      } else {
        clearInterval(interval);
        // Usar los códigos DTC específicos del vehículo después del escaneo
        const dtcsDelVehiculo = generarDTCsDelVehiculo(escaneoPostEliminacion);
        setFallas(dtcsDelVehiculo);
        setTimeout(() => {
          setAnalisisTerminado(true);
          setEscaneando(false);
        }, 1000);
      }
    }, 800);

    return () => clearInterval(interval);
  }, [vehiculo, escaneando, escaneoPostEliminacion]);

  // Iniciar el primer escaneo automáticamente
  useEffect(() => {
    setEscaneando(true);
  }, []);

  const eliminarDTCs = () => {
    setEliminando(true);
    setTimeout(() => {
      setFallas([]);
      setEliminando(false);
      
      // Iniciar automáticamente un nuevo escaneo después de eliminar
      setTimeout(() => {
        setEscaneoPostEliminacion(true);
        setAnalisisTerminado(false);
        setProgreso(0);
        setSistemaActual('');
        setEscaneando(true);
      }, 500);
    }, 2000);
  };

  const irAAistenteIA = (codigo) => {
    router.push(`/AsistenteIA?codigo=${codigo}&vehiculo=${vehiculo.id}&desde=analisis-rapido`);
  };

  const reiniciarEscaneo = () => {
    setProgreso(0);
    setSistemaActual('');
    setAnalisisTerminado(false);
    setEliminando(false);
    setFallas([]);
    setEscaneoPostEliminacion(false);
    setEscaneando(true);
  };

  return (
    <div className="p-4 md:p-6 bg-[#1b1f20] min-h-screen">
      <ModuleStyles.Header>
        <button 
          onClick={volver}
          className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
        >
          <FaArrowLeft size={16} />
          Volver
        </button>
        <div className="flex items-center gap-3">
          <FaSearch className="text-green-400" size={24} />
          <h1 className="text-xl md:text-2xl font-bold">Análisis Rápido</h1>
        </div>
        <div className="text-right text-sm">
          <div className="text-gray-400">{vehiculo.marca} {vehiculo.modelo}</div>
          <div className="text-green-400">Escaneo DTC</div>
        </div>
      </ModuleStyles.Header>

      <div className="max-w-2xl mx-auto">
        {!analisisTerminado || escaneando ? (
          <ModuleStyles.InfoCard title={'Estado del Escaneo'} icon={FaSpinner}>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-lg font-semibold mb-2 text-blue-400">
                  {escaneando ? `Comunicando con ${sistemaActual}...` : 'Preparando escaneo...'}
                </div>
                <div className="w-full bg-gray-700 rounded-full h-4 mb-2">
                  <div
                    className="bg-green-400 h-4 rounded-full transition-all duration-500"
                    style={{ width: `${progreso}%` }}
                  ></div>
                </div>
                <div className="text-sm text-gray-400">
                  {escaneoPostEliminacion 
                    ? `Re-escaneando códigos DTC activos... ${progreso}%`
                    : `Solicitando códigos DTC del vehículo... ${progreso}%`
                  }
                </div>
                {escaneoPostEliminacion && (
                  <div className="text-xs text-yellow-400 mt-2">
                    (Verificando códigos realmente activos tras eliminación)
                  </div>
                )}
              </div>
            </div>
          </ModuleStyles.InfoCard>
        ) : (
          <ModuleStyles.InfoCard title={'Códigos DTC Detectados'} icon={FaExclamationTriangle}>
            <div className="space-y-4">
              {escaneoPostEliminacion && (
                <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-3 mb-4">
                  <div className="text-sm text-blue-300">
                    <strong>Escaneo post-eliminación completado:</strong><br/>
                    Se muestran solo los códigos DTC realmente activos. Los códigos almacenados en memoria han sido eliminados.
                  </div>
                </div>
              )}
              {fallas.length > 0 ? (
                <>
                  <div className="space-y-3">
                    {fallas.map((falla, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded-lg ${falla.color} shadow-inner`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <falla.icono size={20} className="text-white" />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-white">
                                {falla.sistema} - {falla.codigo}
                              </span>
                              <button
                                onClick={() => irAAistenteIA(falla.codigo)}
                                className="bg-[#1f1f1f] hover:bg-[#333] text-white px-3 py-1 rounded flex items-center gap-1 text-sm transition-colors"
                              >
                                <FaCommentDots size={14} />
                                Asistente IA
                              </button>
                            </div>
                            <div className="text-sm text-gray-200 italic mt-1">
                              {falla.modulo}
                            </div>
                          </div>
                        </div>
                        <div className="text-sm text-white pl-6">
                          {falla.descripcion}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex gap-3 pt-4 border-t border-gray-600">
                    <button
                      onClick={eliminarDTCs}
                      disabled={eliminando}
                      className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                    >
                      {eliminando ? 'Eliminando DTCs...' : 'Eliminar DTCs'}
                    </button>
                    <button
                      onClick={reiniciarEscaneo}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                    >
                      Nuevo Escaneo
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <FaCheckCircle size={48} className="text-green-400 mx-auto mb-4" />
                  <div className="text-xl font-bold mb-2">Sin códigos DTC activos</div>
                  <div className="text-gray-400 mb-4">
                    {escaneoPostEliminacion 
                      ? 'Los códigos DTC fueron eliminados exitosamente. Solo quedaron códigos realmente activos.'
                      : 'El vehículo no presenta fallas detectadas'
                    }
                  </div>
                  <button
                    onClick={reiniciarEscaneo}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                  >
                    Realizar Nuevo Escaneo
                  </button>
                </div>
              )}
            </div>
          </ModuleStyles.InfoCard>
        )}

        {/* Información adicional del vehículo */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <ModuleStyles.InfoCard title={'Sistemas Escaneados'} icon={FaSearch}>
            <div className="space-y-2">
              {(vehiculo.sistemas || []).map((sistema, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="text-gray-400">{sistema}:</span>
                  <span className="text-green-400 font-semibold">OK</span>
                </div>
              ))}
            </div>
          </ModuleStyles.InfoCard>

          <ModuleStyles.InfoCard title={'Información del Vehículo'} icon={FaExclamationTriangle}>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Tipo:</span>
                <span className="text-blue-400 font-semibold capitalize">{vehiculo.tipo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Serie:</span>
                <span className="text-green-400 font-semibold">{vehiculo.numeroSerie}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Códigos posibles:</span>
                <span className="text-yellow-400 font-semibold">{vehiculo.codigosDTC?.length || 0}</span>
              </div>
            </div>
          </ModuleStyles.InfoCard>
        </div>
      </div>
    </div>
  );
}
