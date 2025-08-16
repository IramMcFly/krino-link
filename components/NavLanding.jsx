import React from "react"
import { useRouter } from 'next/navigation';

export const NavLanding = () => {
    const router = useRouter();
    return (<nav className="w-full fixed top-0 bg-krino-panel/95 backdrop-blur-md shadow z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between py-4 px-6">
            <img src="/images/logoKR.png" alt="Krino Logo" className="w-20" />
            <ul className="flex gap-6 text-sm md:text-base font-medium">
                <li><a href="#intro" className="hover:text-krino-yellow transition">Inicio</a></li>
                <li><a href="#nosotros" className="hover:text-krino-yellow transition">Nosotros</a></li>
                <li><a href="#tienda" className="hover:text-krino-yellow transition">Tienda</a></li>
                <li>
                    <button
                        className="hover:text-krino-yellow transition bg-transparent border-none cursor-pointer"
                        style={{ background: 'none', padding: 0 }}
                        onClick={() => router.push('/Simulador')}
                    >
                        Simulador
                    </button>
                </li>
                <li><a href="#contacto" className="hover:text-krino-yellow transition">Contacto</a></li>
            </ul>
        </div>
    </nav>)
}