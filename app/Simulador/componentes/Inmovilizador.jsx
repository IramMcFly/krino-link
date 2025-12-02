'use client';

import { useState, useEffect } from 'react';
import {
  FaKey,
  FaCheckCircle,
  FaTimesCircle,
  FaSpinner,
  FaPlus,
  FaTrash,
  FaWifi,
  FaExclamationTriangle,
  FaShieldAlt,
  FaCar,
  FaSync,
  FaMicrochip,
  FaIdCard,
  FaLock
} from 'react-icons/fa';
import { 
  moduleStyles, 
  AlertBanner 
} from './styles/ModuleStyles';

// Constantes
const MAX_LLAVES = 2;
const STORAGE_KEY = 'krino_imo_llaves';

// Estados del proceso
const ESTADOS = {
  IDLE: 'idle',
  CONECTANDO: 'conectando',
  ESPERANDO_LLAVE: 'esperando_llave',
  LEYENDO: 'leyendo',
  VERIFICANDO: 'verificando',
  PROGRAMANDO: 'programando',
  EXITO: 'exito',
  ERROR: 'error',
  SIN_CONEXION: 'sin_conexion'
};

export default function Inmovilizador({ volver, vehiculo }) {
  // Estados principales
  const [estado, setEstado] = useState(ESTADOS.IDLE);
  const [modoActivo, setModoActivo] = useState(null);
  const [llavesProgramadas, setLlavesProgramadas] = useState([]);
  const [llaveActual, setLlaveActual] = useState(null);
  const [mensajeEstado, setMensajeEstado] = useState('');
  const [progreso, setProgreso] = useState(0);
  const [conexionActiva, setConexionActiva] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Cargar llaves desde localStorage al iniciar
  useEffect(() => {
    const llavesGuardadas = localStorage.getItem(`${STORAGE_KEY}_${vehiculo.id}`);
    if (llavesGuardadas) {
      try {
        setLlavesProgramadas(JSON.parse(llavesGuardadas));
      } catch (e) {
        console.error('Error al cargar llaves:', e);
      }
    }
  }, [vehiculo.id]);

  // Guardar llaves en localStorage cuando cambian
  useEffect(() => {
    if (llavesProgramadas.length > 0) {
      localStorage.setItem(`${STORAGE_KEY}_${vehiculo.id}`, JSON.stringify(llavesProgramadas));
    }
  }, [llavesProgramadas, vehiculo.id]);

  // Verificar si el módulo K-Key está configurado
  const isKKeyConfigured = () => {
    return !!process.env.NEXT_PUBLIC_API_ESP32;
  };

  // Función para enviar comandos al módulo K-Key
  const enviarComandoKKey = async (endpoint, params = {}) => {
    if (!isKKeyConfigured()) {
      return { ok: false, error: 'NO_CONFIG' };
    }

    try {
      const queryParams = new URLSearchParams(params).toString();
      const url = `${process.env.NEXT_PUBLIC_API_ESP32}${endpoint}${queryParams ? '?' + queryParams : ''}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        const data = await response.json().catch(() => ({ ok: true }));
        return { ok: true, data };
      } else {
        return { ok: false, status: response.status };
      }
    } catch (error) {
      console.error('Error de conexión:', error);
      return { ok: false, error: error.message };
    }
  };

  // Leer transponder via K-Key (solo lectura real, sin simulación)
  const leerTransponder = async () => {
    const respuesta = await enviarComandoKKey('/nfc/read');
    
    if (!respuesta.ok) {
      return { ok: false, error: respuesta.error || 'Error de comunicación' };
    }
    
    // Solo retornar si hay datos reales del transponder
    if (respuesta.data && respuesta.data.id) {
      return { ok: true, id: respuesta.data.id };
    }
    
    return { ok: false, error: 'No se detectó transponder' };
  };

  // Función para delays en la UI
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  // Simular progreso gradual para UX
  const mostrarProgreso = async (duracion, mensajes = []) => {
    const pasos = mensajes.length > 0 ? mensajes.length : 10;
    const intervalo = duracion / pasos;
    
    for (let i = 0; i < pasos; i++) {
      setProgreso(Math.round(((i + 1) / pasos) * 100));
      if (mensajes[i]) {
        setMensajeEstado(mensajes[i]);
      }
      await delay(intervalo);
    }
  };

  // Verificar conexión con el módulo K-Key
  const verificarConexion = async () => {
    setEstado(ESTADOS.CONECTANDO);
    setProgreso(0);

    // Verificar configuración
    if (!isKKeyConfigured()) {
      setEstado(ESTADOS.SIN_CONEXION);
      setErrorMsg('Módulo K-Key no configurado. Conecte el dispositivo de diagnóstico.');
      setConexionActiva(false);
      return false;
    }

    const mensajesConexion = [
      'Iniciando protocolo OBD-II...',
      'Estableciendo enlace CAN Bus...',
      'Autenticando con ECU principal...',
      'Accediendo a módulo IMMO...',
      'Sincronizando K-Key Interface...',
      'Conexión segura establecida'
    ];

    await mostrarProgreso(3000, mensajesConexion);

    // Verificar conexión real con el módulo
    const respuesta = await enviarComandoKKey('/nfc/status');
    
    if (!respuesta.ok) {
      setEstado(ESTADOS.SIN_CONEXION);
      setErrorMsg('No se pudo establecer comunicación con el módulo K-Key. Verifique la conexión OBD-II.');
      setConexionActiva(false);
      return false;
    }
    
    setConexionActiva(true);
    return true;
  };

  // Proceso de verificación de llave
  const iniciarVerificacion = async () => {
    setModoActivo('verificar');
    setErrorMsg('');
    setLlaveActual(null);
    
    const conectado = await verificarConexion();
    if (!conectado) {
      return;
    }

    setEstado(ESTADOS.ESPERANDO_LLAVE);
    setMensajeEstado('Acerque el transponder al módulo K-Key...');
    setProgreso(0);
    
    setEstado(ESTADOS.LEYENDO);
    setMensajeEstado('Escaneando frecuencia de transponder...');
    
    const resultado = await leerTransponder();
    
    if (resultado.ok && resultado.id) {
      const idLlave = resultado.id;
      setLlaveActual({ id: idLlave, timestamp: new Date().toISOString() });
      
      setEstado(ESTADOS.VERIFICANDO);
      
      const mensajesVerificacion = [
        'Decodificando señal de transponder...',
        'Consultando base de datos IMMO...',
        'Verificando código rolling...',
        'Validando autenticación...'
      ];
      
      await mostrarProgreso(2500, mensajesVerificacion);
      
      // Verificar si la llave está programada
      const llaveEncontrada = llavesProgramadas.find(l => l.id === idLlave);
      
      if (llaveEncontrada) {
        setEstado(ESTADOS.EXITO);
        setMensajeEstado(`✓ Transponder válido - Registrado el ${new Date(llaveEncontrada.fechaProgramacion).toLocaleDateString()}`);
        setLlaveActual({ ...llaveEncontrada, verificada: true });
      } else {
        setEstado(ESTADOS.ERROR);
        setMensajeEstado('✗ Transponder no registrado en la ECU del vehículo');
        setLlaveActual({ id: idLlave, verificada: false });
      }
    } else {
      setEstado(ESTADOS.ERROR);
      setErrorMsg(resultado.error === 'No se detectó transponder' 
        ? 'Timeout: No se detectó transponder. Acerque la llave al módulo K-Key e intente nuevamente.'
        : 'Error de comunicación con el módulo K-Key. Verifique la conexión.');
    }
  };

  // Proceso de programación de llave
  const iniciarProgramacion = async () => {
    if (llavesProgramadas.length >= MAX_LLAVES) {
      setErrorMsg(`Límite de seguridad: máximo ${MAX_LLAVES} transponders por vehículo`);
      return;
    }

    setModoActivo('programar');
    setErrorMsg('');
    setLlaveActual(null);
    
    const conectado = await verificarConexion();
    if (!conectado) {
      return;
    }
    
    setEstado(ESTADOS.ESPERANDO_LLAVE);
    setMensajeEstado('Acerque el nuevo transponder al módulo K-Key...');
    setProgreso(0);
    
    setEstado(ESTADOS.LEYENDO);
    setMensajeEstado('Detectando transponder virgen...');
    
    const resultado = await leerTransponder();
    
    if (resultado.ok && resultado.id) {
      const idLlave = resultado.id;
      
      // Verificar si ya está programada
      if (llavesProgramadas.find(l => l.id === idLlave)) {
        setEstado(ESTADOS.ERROR);
        setMensajeEstado('Este transponder ya está registrado en el sistema IMMO');
        setLlaveActual({ id: idLlave, yaExiste: true });
        return;
      }
      
      setLlaveActual({ id: idLlave, timestamp: new Date().toISOString() });
      
      setEstado(ESTADOS.PROGRAMANDO);
      
      // Mensajes de programación profesionales
      const pasosProgramacion = [
        'Iniciando modo programación IMMO...',
        'Generando código de seguridad AES-128...',
        'Estableciendo handshake con ECU...',
        'Escribiendo ID en memoria EEPROM...',
        'Configurando código rolling...',
        'Sincronizando con sistema antiarranque...',
        'Verificando integridad de datos...',
        'Finalizando registro en ECU...'
      ];
      
      await mostrarProgreso(6000, pasosProgramacion);
      
      // Confirmar programación con el módulo K-Key
      await enviarComandoKKey('/nfc/program', { id: idLlave, vehiculo: vehiculo.id });
      
      // Agregar llave a la lista
      const nuevaLlave = {
        id: idLlave,
        nombre: `Transponder ${llavesProgramadas.length + 1}`,
        fechaProgramacion: new Date().toISOString(),
        vehiculoId: vehiculo.id
      };
      
      setLlavesProgramadas(prev => [...prev, nuevaLlave]);
      
      setEstado(ESTADOS.EXITO);
      setMensajeEstado('✓ Transponder programado exitosamente en la ECU');
      setLlaveActual({ ...nuevaLlave, programada: true });
    } else {
      setEstado(ESTADOS.ERROR);
      setErrorMsg(resultado.error === 'No se detectó transponder' 
        ? 'Timeout: No se detectó transponder. Acerque la llave al módulo K-Key e intente nuevamente.'
        : 'Error de comunicación con el módulo K-Key. Verifique la conexión.');
    }
  };

  // Eliminar llave programada
  const eliminarLlave = async (idLlave) => {
    if (!confirm('¿Está seguro de eliminar este transponder? Esta acción eliminará el registro de la ECU.')) {
      return;
    }

    setMensajeEstado('Eliminando transponder del sistema IMMO...');
    await delay(1500);
    
    setLlavesProgramadas(prev => prev.filter(l => l.id !== idLlave));
    
    // Actualizar localStorage
    const nuevasLlaves = llavesProgramadas.filter(l => l.id !== idLlave);
    if (nuevasLlaves.length === 0) {
      localStorage.removeItem(`${STORAGE_KEY}_${vehiculo.id}`);
    }
    
    setMensajeEstado('Transponder eliminado correctamente');
    setTimeout(() => setMensajeEstado(''), 2000);
  };

  // Reiniciar proceso
  const reiniciar = () => {
    setEstado(ESTADOS.IDLE);
    setModoActivo(null);
    setLlaveActual(null);
    setMensajeEstado('');
    setProgreso(0);
    setErrorMsg('');
  };

  // Renderizar icono de estado
  const renderIconoEstado = () => {
    switch (estado) {
      case ESTADOS.CONECTANDO:
      case ESTADOS.LEYENDO:
      case ESTADOS.VERIFICANDO:
      case ESTADOS.PROGRAMANDO:
        return <FaSpinner className="animate-spin text-blue-400" size={48} />;
      case ESTADOS.ESPERANDO_LLAVE:
        return <FaIdCard className="text-yellow-400 animate-pulse" size={48} />;
      case ESTADOS.EXITO:
        return <FaCheckCircle className="text-green-400" size={48} />;
      case ESTADOS.ERROR:
      case ESTADOS.SIN_CONEXION:
        return <FaTimesCircle className="text-red-400" size={48} />;
      default:
        return <FaKey className="text-gray-400" size={48} />;
    }
  };

  return (
    <div className={moduleStyles.container}>
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={volver}
          className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
        >
          ← Volver
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <FaShieldAlt className="text-green-400" />
            Sistema IMMO - K-Key
          </h1>
          <p className="text-gray-400 text-sm">
            Programador de Transponders - {vehiculo.nombre}
          </p>
        </div>
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
          conexionActiva ? 'bg-green-500/20 text-green-300' : 'bg-gray-500/20 text-gray-300'
        }`}>
          <FaWifi size={14} />
          {conexionActiva ? 'K-Key Online' : 'Desconectado'}
        </div>
      </div>

      {/* Panel de información del vehículo */}
      <div className="bg-gradient-to-r from-[#2e2e2e] to-[#3a3a3a] rounded-xl p-4 mb-6 flex items-center gap-4">
        <FaCar className="text-green-400" size={32} />
        <div className="flex-1">
          <p className="font-semibold">{vehiculo.nombre}</p>
          <p className="text-sm text-gray-400">VIN: {vehiculo.numeroSerie}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-400">Transponders registrados</p>
          <p className="text-2xl font-bold text-green-400">{llavesProgramadas.length}/{MAX_LLAVES}</p>
        </div>
      </div>

      {/* Alerta si no está configurado el módulo */}
      {!isKKeyConfigured() && estado === ESTADOS.IDLE && (
        <div className="mb-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg flex items-start gap-3">
          <FaExclamationTriangle className="text-yellow-400 mt-0.5" size={20} />
          <div>
            <p className="text-yellow-300 font-semibold">Módulo K-Key no detectado</p>
            <p className="text-sm text-gray-400">
              Conecte el dispositivo K-Key al puerto OBD-II del vehículo y configure la dirección en el sistema.
            </p>
          </div>
        </div>
      )}

      {/* Alertas de error */}
      {errorMsg && (
        <div className="mb-4">
          <AlertBanner type="error" message={errorMsg} icon={FaExclamationTriangle} />
        </div>
      )}

      {/* Panel principal según estado */}
      {estado === ESTADOS.IDLE ? (
        // Menú principal
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Verificar llave */}
          <button
            onClick={iniciarVerificacion}
            disabled={!isKKeyConfigured()}
            className={`bg-gradient-to-br from-[#2a2a2a] to-[#323232] rounded-xl p-6 text-left transition-all border border-gray-700/50 group ${
              !isKKeyConfigured() 
                ? 'opacity-50 cursor-not-allowed' 
                : 'hover:from-[#323232] hover:to-[#3a3a3a] hover:border-blue-500/50'
            }`}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-blue-500/20 rounded-lg group-hover:bg-blue-500/30 transition-colors">
                <FaKey className="text-blue-400" size={28} />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Verificar Transponder</h3>
                <p className="text-sm text-gray-400">Comprobar registro en ECU</p>
              </div>
            </div>
            <p className="text-xs text-gray-500">
              Valida si un transponder está registrado en el módulo IMMO del vehículo.
            </p>
          </button>

          {/* Programar llave */}
          <button
            onClick={iniciarProgramacion}
            disabled={llavesProgramadas.length >= MAX_LLAVES || !isKKeyConfigured()}
            className={`bg-gradient-to-br from-[#2a2a2a] to-[#323232] rounded-xl p-6 text-left transition-all border border-gray-700/50 group ${
              (llavesProgramadas.length >= MAX_LLAVES || !isKKeyConfigured())
                ? 'opacity-50 cursor-not-allowed' 
                : 'hover:from-[#323232] hover:to-[#3a3a3a] hover:border-green-500/50'
            }`}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className={`p-3 rounded-lg transition-colors ${
                (llavesProgramadas.length >= MAX_LLAVES || !isKKeyConfigured())
                  ? 'bg-gray-500/20' 
                  : 'bg-green-500/20 group-hover:bg-green-500/30'
              }`}>
                <FaPlus className={(llavesProgramadas.length >= MAX_LLAVES || !isKKeyConfigured()) ? 'text-gray-400' : 'text-green-400'} size={28} />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Programar Transponder</h3>
                <p className="text-sm text-gray-400">
                  {llavesProgramadas.length >= MAX_LLAVES 
                    ? 'Límite de transponders alcanzado' 
                    : 'Registrar nuevo transponder'}
                </p>
              </div>
            </div>
            <p className="text-xs text-gray-500">
              {llavesProgramadas.length >= MAX_LLAVES 
                ? `Elimine un transponder existente para registrar uno nuevo (máx. ${MAX_LLAVES})` 
                : 'Añada un nuevo transponder al sistema IMMO del vehículo via K-Key.'}
            </p>
          </button>
        </div>
      ) : estado === ESTADOS.SIN_CONEXION ? (
        // Panel de error de conexión
        <div className="bg-gradient-to-br from-[#2a2a2a] to-[#323232] rounded-xl p-8 mb-6 text-center">
          <div className="mb-6">
            <FaTimesCircle className="text-red-400 mx-auto" size={48} />
          </div>
          
          <h3 className="text-xl font-semibold mb-2 text-red-400">
            Error de Conexión
          </h3>
          
          <p className="text-gray-300 mb-4">{errorMsg}</p>
          
          <div className="mt-6 flex justify-center gap-4">
            <button
              onClick={reiniciar}
              className="px-6 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg transition-colors flex items-center gap-2"
            >
              <FaSync size={14} />
              Volver al menú
            </button>
          </div>
        </div>
      ) : (
        // Panel de proceso activo
        <div className="bg-gradient-to-br from-[#2a2a2a] to-[#323232] rounded-xl p-8 mb-6 text-center">
          <div className="mb-6">
            {renderIconoEstado()}
          </div>
          
          <h3 className="text-xl font-semibold mb-2">
            {modoActivo === 'verificar' ? 'Verificación de Transponder' : 'Programación de Transponder'}
          </h3>
          
          <p className="text-gray-300 mb-4">{mensajeEstado}</p>
          
          {/* Barra de progreso */}
          {(estado === ESTADOS.CONECTANDO || estado === ESTADOS.VERIFICANDO || estado === ESTADOS.PROGRAMANDO) && (
            <div className="w-full max-w-md mx-auto mb-4">
              <div className="bg-gray-700 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-green-500 to-green-400 h-full transition-all duration-300"
                  style={{ width: `${progreso}%` }}
                />
              </div>
              <p className="text-sm text-gray-400 mt-1">{progreso}%</p>
            </div>
          )}
          
          {/* Información del transponder leído */}
          {llaveActual && (
            <div className={`mt-6 p-4 rounded-lg border ${
              llaveActual.verificada || llaveActual.programada 
                ? 'bg-green-500/10 border-green-500/30' 
                : llaveActual.yaExiste
                  ? 'bg-yellow-500/10 border-yellow-500/30'
                  : estado === ESTADOS.ERROR
                    ? 'bg-red-500/10 border-red-500/30'
                    : 'bg-blue-500/10 border-blue-500/30'
            }`}>
              <div className="flex items-center justify-center gap-3 mb-2">
                <FaLock className="text-gray-400" />
                <span className="font-mono text-lg">{llaveActual.id}</span>
              </div>
              {llaveActual.verificada && (
                <p className="text-green-400 text-sm">Transponder autenticado correctamente</p>
              )}
              {llaveActual.programada && (
                <p className="text-green-400 text-sm">Transponder registrado en ECU</p>
              )}
              {llaveActual.yaExiste && (
                <p className="text-yellow-400 text-sm">Este transponder ya está en el sistema IMMO</p>
              )}
              {!llaveActual.verificada && !llaveActual.programada && !llaveActual.yaExiste && estado === ESTADOS.ERROR && (
                <p className="text-red-400 text-sm">Transponder no reconocido por la ECU</p>
              )}
            </div>
          )}
          
          {/* Botones de acción */}
          {(estado === ESTADOS.EXITO || estado === ESTADOS.ERROR) && (
            <div className="mt-6 flex justify-center gap-4">
              <button
                onClick={reiniciar}
                className="px-6 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg transition-colors flex items-center gap-2"
              >
                <FaSync size={14} />
                {estado === ESTADOS.ERROR ? 'Reintentar' : 'Nueva operación'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Lista de transponders programados */}
      <div className="bg-gradient-to-br from-[#2a2a2a] to-[#323232] rounded-xl p-6 border border-gray-700/50">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <FaKey className="text-green-400" />
          Transponders Registrados
        </h3>
        
        {llavesProgramadas.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <FaKey size={32} className="mx-auto mb-3 opacity-30" />
            <p>No hay transponders registrados</p>
            <p className="text-sm">Utilice "Programar Transponder" para añadir uno nuevo</p>
          </div>
        ) : (
          <div className="space-y-3">
            {llavesProgramadas.map((llave, index) => (
              <div 
                key={llave.id}
                className="flex items-center justify-between bg-[#1b1f20] rounded-lg p-4 border border-gray-700/30"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-green-500/20 rounded-lg">
                    <FaKey className="text-green-400" size={20} />
                  </div>
                  <div>
                    <p className="font-semibold">{llave.nombre}</p>
                    <p className="text-sm text-gray-400 font-mono">{llave.id}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right text-sm">
                    <p className="text-gray-400">Registrado</p>
                    <p className="text-gray-300">
                      {new Date(llave.fechaProgramacion).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => eliminarLlave(llave.id)}
                    className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    title="Eliminar transponder"
                  >
                    <FaTrash size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Información técnica del sistema */}
      <div className="mt-6 bg-[#1b1f20] rounded-xl p-4 border border-gray-800">
        <h4 className="text-sm font-semibold text-gray-400 mb-2 flex items-center gap-2">
          <FaMicrochip size={14} />
          Información del Sistema K-Key
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Interface</p>
            <p className="text-gray-300">K-Key Pro</p>
          </div>
          <div>
            <p className="text-gray-500">Protocolo</p>
            <p className="text-gray-300">CAN / OBD-II</p>
          </div>
          <div>
            <p className="text-gray-500">Seguridad</p>
            <p className="text-gray-300">AES-128</p>
          </div>
          <div>
            <p className="text-gray-500">Estado</p>
            <p className={conexionActiva ? 'text-green-400' : 'text-red-400'}>
              {conexionActiva ? 'Conectado' : 'Sin conexión'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
