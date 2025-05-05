'use client';

import { useState } from 'react';
import { ShoppingCart, Info } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const productosIniciales = [
  {
    id: 1,
    nombre: 'KL-01 Diagnóstico Automotriz',
    descripcion: 'Módulo de diagnóstico Bluetooth para vehículos eléctricos e híbridos.',
    precio: 21000,
    imagen: '/images/productos/kl01.jpg', // Asegúrate de tener esta imagen en public/images/productos/
  },
  {
    id: 2,
    nombre: 'Adaptador OBD-II a USB Tipo C',
    descripcion: 'Adaptador físico para conexión directa con dispositivos modernos.',
    precio: 499,
    imagen: '/images/productos/obdusb.jpg',
  },
  {
    id: 3,
    nombre: 'K-Key',
    descripcion: 'Programador de llaves USB Tipo C compatible con Krino-Link',
    precio: 1500,
    imagen: '/images/productos/voltaje.jpg',
  },
  {
    id: 4,
    nombre: 'KL-TPMS',
    descripcion: 'Programador de TPMS USB Tipo C compatible con Krino-Link',
    precio: 1500,
    imagen: '/images/productos/voltaje.jpg',
  },
];

export default function Tienda() {
  const [productos] = useState(productosIniciales);
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#1b1f20] text-white px-4 py-8">
      <h1 className="text-3xl font-bold text-center text-[#c3151b] mb-8">KrinoStore</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {productos.map((producto) => (
          <div
            key={producto.id}
            className="bg-[#2b2b2b] p-5 rounded-xl shadow hover:shadow-lg transition-all"
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
            <button
              onClick={() => alert(`Simulación: "${producto.nombre}" añadido al carrito`)}
              className="w-full bg-[#c3151b] hover:bg-[#a31217] py-2 rounded flex items-center justify-center gap-2 font-semibold"
            >
              <ShoppingCart size={18} /> Añadir al carrito
            </button>
          </div>
        ))}
      </div>

      <div className="mt-10 text-center">
        <button
          onClick={() => router.push('/MenuDiagnostico')}
          className="bg-gray-700 hover:bg-gray-600 px-6 py-2 rounded inline-flex items-center gap-2"
        >
          <Info size={18} /> Volver al inicio
        </button>
      </div>
    </div>
  );
}
