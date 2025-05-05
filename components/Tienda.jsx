'use client';

import { useState } from 'react';
import { ShoppingCart, Info, X } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const productosIniciales = [
  {
    id: 1,
    nombre: 'KL-01 Diagnóstico Automotriz',
    descripcion: 'Módulo de diagnóstico Bluetooth para vehículos eléctricos e híbridos.',
    descripcionLarga: 'El KL-01 permite la lectura y borrado de códigos DTC, así como monitoreo en tiempo real del sistema eléctrico y de tracción. Compatible con aplicaciones móviles y actualizable vía OTA.',
    precio: 20999,
    imagen: '/images/store/KL-01.png',
    detalles: 'Compatible con ELM327, detección automática de protocolos CAN, y conectividad Bluetooth 5.0.',
  },
  {
    id: 2,
    nombre: 'Tablet Certiificada Krino (Android)',
    descripcion: 'Tablet de 10.1 pulgadas con Android 13 y 4GB de RAM.',
    descripcionLarga: 'Esta tablet es ideal para talleres que buscan una solución portátil para escanear y monitorear vehículos. Incluye protección contra caídas y software preinstalado para conexión con dispositivos Krino.',
    precio: 4999,
    imagen: '/images/store/TabletAndroid.png',
    detalles: 'Ideal para usar con la app Krino-Link. Batería de larga duración y pantalla resistente a golpes.',
  },
  {
    id: 3,
    nombre: 'K-Key',
    descripcion: 'Programador de llaves USB Tipo C compatible con Krino-Link',
    descripcionLarga: 'Permite programación rápida de llaves en vehículos compatibles sin necesidad de conexión a internet. Ideal para cerrajeros automotrices y talleres especializados.',
    precio: 3499,
    imagen: '/images/store/K-Key.png',
    detalles: 'Permite clonar, emparejar y borrar llaves codificadas en vehículos compatibles.',
  },
  {
    id: 4,
    nombre: 'KL-TPMS',
    descripcion: 'Programador de TPMS USB Tipo C compatible con Krino-Link',
    descripcionLarga: 'Herramienta compacta para programar y releer sensores TPMS en minutos. Compatible con sensores OEM y universales. Incluye modo automático y diagnóstico rápido.',
    precio: 3499,
    imagen: '/images/store/K-TPMS.png',
    detalles: 'Programa sensores TPMS OEM y genéricos. Lectura rápida y opciones de reprogramación.',
  },
  {
    id: 5,
    nombre: 'Tablet Certiificada Krino (Windows)',
    descripcion: 'Tablet de 10.1 pulgadas con Windows 11 y 8GB de RAM.',
    descripcionLarga: 'Pensada para usuarios que necesitan compatibilidad con software especializado como Forscan, Techstream y Krino-PC. Incluye puerto USB, HDMI y resistencia al polvo.',
    precio: 9999,
    imagen: '/images/store/TabletWindows.png',
    detalles: 'Optimizada para uso con software Krino de escritorio. Excelente para talleres profesionales.',
  },
];

export default function Tienda() {
  const [productos] = useState(productosIniciales);
  const [seleccionado, setSeleccionado] = useState(null);
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#1b1f20] text-white px-4 py-8 relative">
      <h1 className="text-3xl font-bold text-center text-[#c3151b] mb-8">KrinoStore</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {productos.map((producto) => (
          <div
            key={producto.id}
            className="bg-[#2b2b2b] p-5 rounded-xl shadow hover:shadow-lg transition-all cursor-pointer"
            onClick={() => setSeleccionado(producto)}
          >
            <div className="relative w-full h-40 mb-4 rounded overflow-hidden bg-[#1a1a1a]">
              <Image
                src={producto.imagen}
                alt={producto.nombre}
                layout="fill"
                objectFit="cover"
              />
            </div>
            <h2 className="text-xl font-semibold mb-1">{producto.nombre}</h2>
            <p className="text-sm text-gray-300 mb-2">{producto.descripcion}</p>
            <p className="text-lg font-bold text-[#facc15] mb-4">${producto.precio}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 text-center">
        <button
          onClick={() => router.push('/')}
          className="bg-gray-700 hover:bg-gray-600 px-6 py-2 rounded inline-flex items-center gap-2"
        >
          <Info size={18} /> Volver al inicio
        </button>
      </div>

      <AnimatePresence>
        {seleccionado && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-[#2b2b2b] rounded-xl max-w-2xl w-full p-6 relative shadow-lg"
            >
              <button
                className="absolute top-3 right-3 text-gray-300 hover:text-white"
                onClick={() => setSeleccionado(null)}
              >
                <X size={24} />
              </button>

              <div className="relative w-full h-64 md:h-80 mb-4 rounded overflow-hidden bg-[#1a1a1a]">
                <Image
                  src={seleccionado.imagen}
                  alt={seleccionado.nombre}
                  layout="fill"
                  objectFit="contain"
                />
              </div>

              <h2 className="text-2xl font-bold mb-1">{seleccionado.nombre}</h2>
              <p className="text-sm text-gray-300 mb-2">{seleccionado.descripcion}</p>
              <p className="text-sm text-gray-400 mb-4">{seleccionado.descripcionLarga}</p>
              <p className="text-sm text-gray-500 mb-4">{seleccionado.detalles}</p>
              <p className="text-xl font-bold text-[#facc15] mb-5">${seleccionado.precio}</p>

              <button
                onClick={() => alert(`Simulación: "${seleccionado.nombre}" añadido al carrito`)}
                className="w-full bg-[#c3151b] hover:bg-[#a31217] py-2 rounded flex items-center justify-center gap-2 font-semibold"
              >
                <ShoppingCart size={18} /> Añadir al carrito
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
