import React from "react"
import { useRouter } from 'next/navigation';

export const NavLanding = () => {
    const router = useRouter();
    return (<nav className="w-full fixed top-0 bg-krino-panel/95 backdrop-blur-md shadow z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between py-4 px-6">
            <img src="/images/logoKR.png" alt="Krino Logo" className="w-16 h-16 object-contain" />
            <ul className="flex gap-4 text-xs md:text-sm font-medium">
                <li><a href="#intro" className="hover:text-krino-yellow transition text-white">Inicio</a></li>
                <li><a href="#nosotros" className="hover:text-krino-yellow transition text-white">Nosotros</a></li>
                <li><a href="/Tienda" className="hover:text-krino-yellow transition text-white">Tienda</a></li>
                <li>
                    <button
                        className="hover:text-krino-yellow transition bg-transparent border-none cursor-pointer text-white"
                        style={{ background: 'none', padding: 0 }}
                        onClick={() => router.push('/Simulador')}
                    >
                        Simulador
                    </button>
                </li>
                <li><a href="#contacto" className="hover:text-krino-yellow transition text-white">Contacto</a></li>
            </ul>
        </div>
    </nav>)
}