'use client';

import { useState, useMemo } from 'react';
import { FaShoppingCart, FaInfoCircle, FaTimes, FaCheckCircle, FaTrash, FaSearch } from 'react-icons/fa';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const categorias = [
  { label: 'Todos', value: 'todos' },
  { label: 'Diagnóstico', value: 'diagnostico' },
  { label: 'Tablets', value: 'tablet' },
  { label: 'Llaves', value: 'llave' },
  { label: 'TPMS', value: 'tpms' },
  { label: 'Suscripciones', value: 'suscripciones' },
  { label: 'Paquetes', value: 'paquetes' }
];

const productosIniciales = [
  {
    id: 1,
    nombre: 'KL-01 Diagnóstico Automotriz',
    descripcion: 'Módulo de diagnóstico Bluetooth para vehículos eléctricos e híbridos.',
    descripcionLarga: 'El KL-01 permite la lectura y borrado de códigos DTC, así como monitoreo en tiempo real del sistema eléctrico y de tracción. Compatible con aplicaciones móviles y actualizable vía OTA.',
    precio: 20999,
    imagen: '/images/store/KL-01.png',
    detalles: 'Compatible con protocolo ELM327, detección automática de protocolos CAN, y conectividad Bluetooth 5.0.',
    categoria: 'diagnostico',
  },
  {
    id: 2,
    nombre: 'Tablet Certiificada Krino (Android)',
    descripcion: 'Tablet de 10.1 pulgadas con Android 15 y 8GB de RAM.',
    descripcionLarga: 'Esta tablet es ideal para talleres que buscan una solución portátil para escanear y monitorear vehículos. Incluye protección contra caídas y software preinstalado para conexión con dispositivos Krino.',
    precio: 4999,
    imagen: '/images/store/TabletAndroid.png',
    detalles: 'Ideal para usar con la app Krino-Link. Batería de larga duración y pantalla resistente a golpes.',
    categoria: 'tablet',
  },
  {
    id: 3,
    nombre: 'K-Key',
    descripcion: 'Programador de llaves USB Tipo C compatible con Krino-Link',
    descripcionLarga: 'Permite programación rápida de llaves en vehículos compatibles sin necesidad de conexión a internet. Ideal para cerrajeros automotrices y talleres especializados.',
    precio: 3499,
    imagen: '/images/store/K-KEY.png',
    detalles: 'Permite clonar, emparejar y borrar llaves codificadas en vehículos compatibles. Requiere KL-01 o KML388 para funcionar.',
    categoria: 'llave',
  },
  {
    id: 4,
    nombre: 'K-Tyre',
    descripcion: 'Programador de TPMS USB Tipo C compatible con Krino-Link',
    descripcionLarga: 'Herramienta compacta para programar y releer sensores TPMS en minutos. Compatible con sensores OEM y universales. Incluye modo automático y diagnóstico rápido.',
    precio: 3499,
    imagen: '/images/store/K-TPMS.png',
    detalles: 'Programa sensores TPMS OEM y genéricos. Lectura rápida y opciones de reprogramación. Requiere KL-01 o KML388 para funcionar.',
    categoria: 'tpms',
  },
  {
    id: 5,
    nombre: 'Tablet Certiificada Krino (Windows)',
    descripcion: 'Tablet de 10.1 pulgadas con Windows 11 y 16GB de RAM.',
    descripcionLarga: 'Pensada para usuarios que necesitan compatibilidad con software especializado como Forscan, Techstream y Krino-PC. Incluye puerto USB, HDMI y resistencia al polvo.',
    precio: 9999,
    imagen: '/images/store/TabletWindows.png',
    detalles: 'Optimizada para uso con software Krino de escritorio. Excelente para talleres profesionales.',
    categoria: 'tablet',
  },
  {
    id: 6,
    nombre: 'KIT K-Tyre + K-Key',
    descripcion: 'Kit combinado de programador TPMS y programador de llaves.',
    descripcionLarga: 'Incluye el programador de sensores TPMS y el programador de llaves K-Key, ideal para talleres que buscan ampliar sus servicios de diagnóstico y programación.',
    precio: 6499,
    imagen: '/images/store/KITPMSKEY.png',
    detalles: 'Incluye ambos dispositivos y manual de uso rápido.',
    categoria: 'paquetes',
  },
  {
    id: 7,
    nombre: 'Kit Tablet + KL-01',
    descripcion: 'Paquete especial: Tablet Android + KL-01.',
    descripcionLarga: 'La solución portátil definitiva para diagnóstico automotriz. Incluye tablet resistente y el módulo KL-01 para diagnóstico OBD2.',
    precio: 24999,
    imagen: '/images/store/KitTabletKl01.png',
    detalles: 'Ideal para talleres móviles y técnicos en campo.',
    categoria: 'paquetes',
  },
  {
    id: 8,
    nombre: 'KLM388+',
    descripcion: 'Herramienta avanzada de diagnóstico multi-marca.',
    descripcionLarga: 'Compatible con una amplia gama de vehículos eléctricos e híbridos. Permite diagnósticos rápidos y precisos.',
    precio: 1999,
    imagen: '/images/store/KML388.png',
    detalles: 'Compatible con protocolos OBD2, CAN, ELM327 y más. Ideal para técnicos que buscan una herramienta versátil.',
    categoria: 'diagnostico',
  },
  {
    id: 9,
    nombre: 'Starter Kit Krino',
    descripcion: 'Kit de inicio para diagnóstico y programación.',
    descripcionLarga: 'Incluye los dispositivos esenciales para comenzar a diagnosticar y programar vehículos eléctricos e híbridos.',
    precio: 9999,
    imagen: '/images/store/StarterKit.png',
    detalles: 'Incluye una Tablet Certificada, K-Tyre, K-Key y KLM388+.',
    categoria: 'paquetes',
  },
  {
    id: 10,
    nombre: 'Starter Kit Krino Basico',
    descripcion: 'Kit de inicio edición  con accesorios extra.',
    descripcionLarga: 'Incluye todos los dispositivos del Starter Kit más accesorios exclusivos y soporte extendido.',
    precio: 7999,
    imagen: '/images/store/StarterKit2.png',
    detalles: 'Incluye KLM388+, K-Key y K-Tyre.',
    categoria: 'paquetes',
  },
  {
    id: 11,
    nombre: 'Krino Care+',
    descripcion: 'Seguro de suscripción premium con beneficios exclusivos.',
    descripcionLarga: 'Suscripcion anual que incluye seguro contra daños accidentales, reemplazo gratuito de dispositivos y soporte técnico prioritario.',
    precio: 499,
    imagen: '/images/store/KrinoCarePlus.png',
    detalles: 'Incluye: Seguro contra daños accidentales, Reemplazo gratuito, Soporte prioritario, atención personalizada.',
    categoria: 'suscripciones',
  },
  {
    id: 12,
    nombre: 'Krino Assistant Pro',
    descripcion: 'Asistente virtual avanzado para talleres',
    descripcionLarga: 'Asistente de diagnóstico inteligente que ofrece soporte en tiempo real y acceso a información técnica especializada.',
    precio: 499,
    imagen: '/images/store/Assistant.png',
    detalles: 'Incluye: Asistente virtual avanzado para diagnóstico y soporte técnico. Diagnóstico y soporte automático. IA para resolución de problemas.',
    categoria: 'suscripciones',
  },
];

export default function Tienda() {
  const [productos] = useState(productosIniciales);
  const [seleccionado, setSeleccionado] = useState(null);
  const [carrito, setCarrito] = useState([]);
  const [showAdded, setShowAdded] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [categoria, setCategoria] = useState('todos');
  const router = useRouter();

  const addToCart = (producto) => {
    setCarrito((prev) => [...prev, producto]);
    setShowAdded(true);
    setTimeout(() => setShowAdded(false), 1200);
  };

  const removeFromCart = (id) => {
    setCarrito((prev) => prev.filter((p, i) => i !== id));
  };

  const total = useMemo(
    () => carrito.reduce((acc, prod) => acc + prod.precio, 0),
    [carrito]
  );

  const productosFiltrados = useMemo(() => {
    let filtrados = productos;
    if (categoria !== 'todos') {
      filtrados = filtrados.filter((p) => p.categoria === categoria);
    }
    if (busqueda.trim() !== '') {
      filtrados = filtrados.filter((p) =>
        p.nombre.toLowerCase().includes(busqueda.toLowerCase())
      );
    }
    return filtrados;
  }, [productos, categoria, busqueda]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-krino-darker via-krino-dark to-krino-panel text-white px-4 py-8 relative font-sans">
      {/* Ajustar el diseño del header para mejorar la alineación y el espaciado */}
      <header className="flex flex-col md:flex-row items-center justify-between max-w-6xl mx-auto mb-6 gap-4 bg-krino-panel/90 rounded-3xl shadow-xl p-4 md:p-6 border border-[#2c2c2c]">
        <div className="flex items-center gap-4">
          <img src="/images/logoKR.png" alt="Krino Logo" className="w-10 h-10 object-contain" />
          <div>
            <h1 className="text-xl md:text-2xl font-extrabold text-krino-red tracking-tight">KrinoStore</h1>
            <p className="text-gray-300 text-xs md:text-sm mt-1">Tu tienda especializada en diagnóstico automotriz</p>
          </div>
        </div>
        <div className="flex gap-4 w-full md:w-auto mt-4 md:mt-0">
          <div className="relative flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="Buscar producto..."
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
              className="bg-krino-card text-white rounded-lg px-4 py-2 w-full pl-10 outline-none border border-krino-card focus:border-krino-yellow focus:ring-2 focus:ring-krino-yellow/20 transition-all shadow-md"
            />
            <FaSearch size={18} className="absolute left-3 top-2.5 text-gray-400" />
          </div>
          <select
            value={categoria}
            onChange={e => setCategoria(e.target.value)}
            className="bg-krino-card text-white rounded-lg px-4 py-2 border border-krino-card focus:border-krino-yellow focus:ring-2 focus:ring-krino-yellow/20 transition-all shadow-md min-w-[120px]"
          >
            {categorias.map(cat => (
              <option key={cat.value} value={cat.value} className="bg-krino-panel text-black">{cat.label}</option>
            ))}
          </select>
        </div>
      </header>

      <div className="max-w-6xl mx-auto">
        {productosFiltrados.length === 0 ? (
          <div className="text-center text-gray-400 py-20 text-lg">No se encontraron productos.</div>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {productosFiltrados.map((producto) => (
              <motion.div
                key={producto.id}
                whileHover={{ scale: 1.02, boxShadow: "0 20px 40px rgba(195, 21, 27, 0.3)" }}
                className="bg-krino-card rounded-xl shadow-md overflow-hidden flex flex-col transition-all cursor-pointer group border border-[#2c2c2c] hover:border-krino-red/30 sm:rounded-lg"
              >
                <div
                  className="relative w-full h-56 bg-gradient-to-br from-krino-panel to-krino-dark flex items-center justify-center"
                  onClick={() => setSeleccionado(producto)}
                >
                  <Image
                    src={producto.imagen}
                    alt={producto.nombre}
                    fill
                    style={{ objectFit: 'contain' }}
                    className="transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="flex-1 flex flex-col p-6">
                  <h2 className="text-xl font-bold mb-2 text-white group-hover:text-krino-yellow transition-colors">{producto.nombre}</h2>
                  <p className="text-sm text-gray-300 mb-3 leading-relaxed">{producto.descripcion}</p>
                  <p className="text-2xl font-bold text-krino-yellow mb-6">
                    ${producto.precio.toLocaleString()}
                    {producto.categoria === 'suscripciones' && <span className="text-sm font-normal text-gray-400 ml-1">/mes</span>}
                  </p>
                  <button
                    onClick={() => addToCart(producto)}
                    className="mt-auto bg-krino-red hover:bg-red-700 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    <FaShoppingCart size={18} /> Añadir al carrito
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Indicador de carrito */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          className="relative bg-krino-card hover:bg-krino-red text-white rounded-full p-4 shadow-xl transition-all transform hover:scale-110 border border-krino-red/30"
          onClick={() => setShowCart(true)}
        >
          <FaShoppingCart size={24} />
          {carrito.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-krino-yellow text-krino-darker text-xs font-bold rounded-full px-2.5 py-1 shadow-lg">
              {carrito.length}
            </span>
          )}
        </button>
        <AnimatePresence>
          {showAdded && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-2 bg-[#23272f] text-[#facc15] px-4 py-2 rounded shadow flex items-center gap-2"
            >
              <FaCheckCircle size={18} /> Añadido al carrito
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Modal de carrito */}
      <AnimatePresence>
        {showCart && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-krino-panel rounded-3xl max-w-lg w-full p-8 relative shadow-2xl border border-[#2c2c2c]"
            >
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
                onClick={() => setShowCart(false)}
              >
                <FaTimes size={28} />
              </button>
              <h2 className="text-3xl font-bold mb-8 text-krino-yellow flex items-center gap-3 tracking-wide">
                <FaShoppingCart size={28} /> Carrito de compras
              </h2>
              {carrito.length === 0 ? (
                <div className="text-gray-400 text-center py-10">Tu carrito está vacío.</div>
              ) : (
                <>
                  <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
                    {carrito.map((prod, idx) => (
                      <div key={idx} className="flex items-center gap-4 bg-krino-card rounded-xl p-4 border border-[#2c2c2c] hover:border-krino-red/30 transition-all">
                        <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-krino-dark">
                          <Image src={prod.imagen} alt={prod.nombre} layout="fill" objectFit="contain" />
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-white">{prod.nombre}</div>
                          <div className="text-krino-yellow font-bold text-lg">
                            ${prod.precio.toLocaleString()}
                            {prod.categoria === 'suscripciones' && <span className="text-sm font-normal text-gray-400 ml-1">/mes</span>}
                          </div>
                        </div>
                        <button
                          className="text-krino-red hover:text-red-400 transition-colors p-2 hover:bg-krino-red/10 rounded-lg"
                          onClick={() => removeFromCart(idx)}
                          title="Eliminar"
                        >
                          <FaTrash size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-krino-card mt-8 pt-6 flex justify-between items-center">
                    <span className="font-bold text-xl text-white">Total:</span>
                    <span className="text-3xl font-bold text-krino-yellow">${total.toLocaleString()}</span>
                  </div>
                  <button
                    className="w-full mt-8 bg-krino-yellow hover:bg-yellow-400 text-krino-darker font-bold py-4 rounded-xl flex items-center justify-center gap-3 text-lg transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    onClick={() => alert('¡Gracias por tu compra! Pronto nos pondremos en contacto contigo.')}
                  >
                    Finalizar compra
                  </button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de detalles */}
      <AnimatePresence>
        {seleccionado && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-krino-panel rounded-3xl max-w-3xl w-full p-10 relative shadow-2xl border border-[#2c2c2c]"
            >
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
                onClick={() => setSeleccionado(null)}
              >
                <FaTimes size={28} />
              </button>

              <div className="relative w-full h-72 md:h-96 mb-8 rounded-2xl overflow-hidden bg-gradient-to-br from-krino-dark to-krino-card shadow-inner">
                <Image
                  src={seleccionado.imagen}
                  alt={seleccionado.nombre}
                  layout="fill"
                  objectFit="contain"
                />
              </div>

              <h2 className="text-3xl font-bold mb-4 text-white">{seleccionado.nombre}</h2>
              <p className="text-lg text-gray-300 mb-4 leading-relaxed">{seleccionado.descripcion}</p>
              <p className="text-base text-gray-400 mb-6 leading-relaxed">{seleccionado.descripcionLarga}</p>
              <div className="bg-krino-card rounded-xl p-4 mb-6">
                <h3 className="text-lg font-semibold text-krino-yellow mb-2">Detalles técnicos:</h3>
                <p className="text-sm text-gray-300 leading-relaxed">{seleccionado.detalles}</p>
              </div>
              <p className="text-4xl font-bold text-krino-yellow mb-8">
                ${seleccionado.precio.toLocaleString()}
                {seleccionado.categoria === 'suscripciones' && <span className="text-lg font-normal text-gray-400 ml-2">/mes</span>}
              </p>

              <button
                onClick={() => {
                  addToCart(seleccionado);
                  setSeleccionado(null);
                }}
                className="w-full bg-krino-red hover:bg-red-700 py-4 rounded-xl flex items-center justify-center gap-3 font-semibold text-xl transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <FaShoppingCart size={24} /> Añadir al carrito
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
