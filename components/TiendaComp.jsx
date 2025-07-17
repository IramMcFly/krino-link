'use client';

import { useState, useMemo } from 'react';
import { ShoppingCart, Info, X, CheckCircle, Trash2, Search } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const categorias = [
  { label: 'Todos', value: 'todos' },
  { label: 'Diagnóstico', value: 'diagnostico' },
  { label: 'Tablets', value: 'tablet' },
  { label: 'Llaves', value: 'llave' },
  { label: 'TPMS', value: 'tpms' },
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
    categoria: 'diagnostico',
  },
  {
    id: 7,
    nombre: 'Kit Tablet + KL-01',
    descripcion: 'Paquete especial: Tablet Android + KL-01.',
    descripcionLarga: 'La solución portátil definitiva para diagnóstico automotriz. Incluye tablet resistente y el módulo KL-01 para diagnóstico OBD2.',
    precio: 22999,
    imagen: '/images/store/KitTabletKl01.png',
    detalles: 'Ideal para talleres móviles y técnicos en campo.',
    categoria: 'tablet',
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
    categoria: 'diagnostico',
  },
  {
    id: 10,
    nombre: 'Starter Kit Krino Basico',
    descripcion: 'Kit de inicio edición  con accesorios extra.',
    descripcionLarga: 'Incluye todos los dispositivos del Starter Kit más accesorios exclusivos y soporte extendido.',
    precio: 7999,
    imagen: '/images/store/StarterKit2.png',
    detalles: 'Incluye KLM388+, K-Key y K-Tyre.',
    categoria: 'diagnostico',
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
    <div className="min-h-screen bg-gradient-to-br from-[#1b1f20] via-[#23272f] to-[#2b2b2b] text-white px-4 py-8 relative font-sans">
      <header className="flex flex-col md:flex-row items-center justify-between max-w-6xl mx-auto mb-8 gap-4">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#c3151b] tracking-tight">KrinoStore</h1>
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 bg-[#23272f] hover:bg-[#c3151b] hover:text-white text-gray-300 px-4 py-2 rounded-lg transition"
          >
            <Info size={18} /> Inicio
          </button>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Buscar producto..."
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
              className="bg-[#23272f] text-white rounded-lg px-4 py-2 w-full pl-10 outline-none border border-[#23272f] focus:border-[#c3151b] transition"
            />
            <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
          </div>
          <select
            value={categoria}
            onChange={e => setCategoria(e.target.value)}
            className="bg-[#23272f] text-white rounded-lg px-4 py-2 border border-[#23272f] focus:border-[#c3151b] transition"
          >
            {categorias.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
        </div>
      </header>

      <div className="max-w-6xl mx-auto">
        {productosFiltrados.length === 0 ? (
          <div className="text-center text-gray-400 py-20 text-lg">No se encontraron productos.</div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {productosFiltrados.map((producto) => (
              <motion.div
                key={producto.id}
                whileHover={{ scale: 1.03, boxShadow: "0 8px 32px #c3151b33" }}
                className="bg-[#23272f] rounded-2xl shadow-lg overflow-hidden flex flex-col transition-all cursor-pointer group"
              >
                <div
                  className="relative w-full h-48 bg-[#1a1a1a] flex items-center justify-center"
                  onClick={() => setSeleccionado(producto)}
                >
                  <Image
                    src={producto.imagen}
                    alt={producto.nombre}
                    layout="fill"
                    objectFit="contain"
                    className="transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="flex-1 flex flex-col p-5">
                  <h2 className="text-lg font-bold mb-1">{producto.nombre}</h2>
                  <p className="text-sm text-gray-300 mb-2">{producto.descripcion}</p>
                  <p className="text-xl font-bold text-[#facc15] mb-4">${producto.precio}</p>
                  <button
                    onClick={() => addToCart(producto)}
                    className="mt-auto bg-[#c3151b] hover:bg-[#a31217] text-white font-semibold py-2 rounded-lg flex items-center justify-center gap-2 transition"
                  >
                    <ShoppingCart size={18} /> Añadir al carrito
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Indicador de carrito */}
      <div className="fixed top-6 right-6 z-50">
        <button
          className="relative bg-[#23272f] hover:bg-[#c3151b] text-white rounded-full p-3 shadow-lg transition"
          onClick={() => setShowCart(true)}
        >
          <ShoppingCart size={24} />
          {carrito.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-[#facc15] text-[#1b1f20] text-xs font-bold rounded-full px-2 py-0.5">
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
              <CheckCircle size={18} /> Añadido al carrito
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
              className="bg-[#23272f] rounded-2xl max-w-lg w-full p-8 relative shadow-xl"
            >
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
                onClick={() => setShowCart(false)}
              >
                <X size={28} />
              </button>
              <h2 className="text-2xl font-bold mb-6 text-[#facc15] flex items-center gap-2">
                <ShoppingCart size={24} /> Carrito de compras
              </h2>
              {carrito.length === 0 ? (
                <div className="text-gray-400 text-center py-10">Tu carrito está vacío.</div>
              ) : (
                <>
                  <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
                    {carrito.map((prod, idx) => (
                      <div key={idx} className="flex items-center gap-4 bg-[#1a1a1a] rounded-lg p-3">
                        <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-[#23272f]">
                          <Image src={prod.imagen} alt={prod.nombre} layout="fill" objectFit="contain" />
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold">{prod.nombre}</div>
                          <div className="text-[#facc15] font-bold">${prod.precio}</div>
                        </div>
                        <button
                          className="text-[#c3151b] hover:text-[#a31217] transition"
                          onClick={() => removeFromCart(idx)}
                          title="Eliminar"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-[#23272f] mt-6 pt-4 flex justify-between items-center">
                    <span className="font-bold text-lg">Total:</span>
                    <span className="text-2xl font-bold text-[#facc15]">${total}</span>
                  </div>
                  <button
                    className="w-full mt-6 bg-[#facc15] hover:bg-yellow-400 text-[#1b1f20] font-bold py-3 rounded-lg flex items-center justify-center gap-2 text-lg transition"
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
              className="bg-[#23272f] rounded-2xl max-w-2xl w-full p-8 relative shadow-xl"
            >
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
                onClick={() => setSeleccionado(null)}
              >
                <X size={28} />
              </button>

              <div className="relative w-full h-64 md:h-80 mb-6 rounded-xl overflow-hidden bg-[#1a1a1a]">
                <Image
                  src={seleccionado.imagen}
                  alt={seleccionado.nombre}
                  layout="fill"
                  objectFit="contain"
                />
              </div>

              <h2 className="text-2xl font-bold mb-2">{seleccionado.nombre}</h2>
              <p className="text-base text-gray-300 mb-2">{seleccionado.descripcion}</p>
              <p className="text-sm text-gray-400 mb-4">{seleccionado.descripcionLarga}</p>
              <p className="text-sm text-gray-500 mb-4">{seleccionado.detalles}</p>
              <p className="text-2xl font-bold text-[#facc15] mb-6">${seleccionado.precio}</p>

              <button
                onClick={() => {
                  addToCart(seleccionado);
                  setSeleccionado(null);
                }}
                className="w-full bg-[#c3151b] hover:bg-[#a31217] py-3 rounded-lg flex items-center justify-center gap-2 font-semibold text-lg transition"
              >
                <ShoppingCart size={22} /> Añadir al carrito
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
