import React, { useState, useRef } from "react"
import { useRouter } from 'next/navigation';

export const NavLanding = () => {
    const router = useRouter();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const timeoutRef = useRef();

    // Evita que el dropdown se cierre inmediatamente al mover el mouse entre el botón y el menú
    const handleMouseEnter = () => {
        clearTimeout(timeoutRef.current);
        setDropdownOpen(true);
    };

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => setDropdownOpen(false), 120);
    };

    return (
        <nav className="w-full fixed top-0 bg-krino-panel/95 backdrop-blur-md shadow z-50">
            <div className="max-w-6xl mx-auto flex items-center justify-between py-4 px-6">
                <img src="/images/logoKR.png" alt="Krino Logo" className="w-16 h-16 object-contain" />
                <ul className="flex gap-4 text-xs md:text-sm font-medium relative">
                    <li>
                        <a href="#intro" className="hover:text-krino-yellow transition text-white">Inicio</a>
                    </li>
                    <li
                        className="relative"
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                    >
                        <button
                            className="hover:text-krino-yellow transition bg-transparent border-none cursor-pointer text-white"
                            style={{ background: 'none', padding: 0 }}
                            tabIndex={0}
                            onFocus={handleMouseEnter}
                            onBlur={handleMouseLeave}
                        >
                            Nosotros
                        </button>
                        {dropdownOpen && (
                            <ul
                                className="absolute left-0 top-full mt-2 rounded-xl shadow-lg py-2 px-4 min-w-[180px] z-50 flex flex-col gap-2"
                                style={{
                                    background: "linear-gradient(135deg, #232323 80%, #2c2c2c 100%)",
                                    border: "1px solid #333",
                                    boxShadow: "0 8px 24px 0 #0008"
                                }}
                                onMouseEnter={handleMouseEnter}
                                onMouseLeave={handleMouseLeave}
                            >
                                <li>
                                    <a href="/#nosotros" className="block py-1 px-2 hover:text-krino-yellow transition text-white">¿Quiénes Somos?</a>
                                </li>
                                <li>
                                    <a href="/#valores" className="block py-1 px-2 hover:text-krino-yellow transition text-white">Valores Krino</a>
                                </li>
                                <li>
                                    <a href="/#nosotros" className="block py-1 px-2 hover:text-krino-yellow transition text-white">Nuestro Equipo</a>
                                </li>
                                <li>
                                    <a href="/#tienda" className="block py-1 px-2 hover:text-krino-yellow transition text-white">¿Por qué elegir Krino?</a>
                                </li>
                                <li>
                                    <a href="/#simulador" className="block py-1 px-2 hover:text-krino-yellow transition text-white">Testimonios</a>
                                </li>
                                <li>
                                    <a href="/#sponsors" className="block py-1 px-2 hover:text-krino-yellow transition text-white">Sponsors</a>
                                </li>
                            </ul>
                        )}
                    </li>
                    <li>
                        <a href="/Tienda" className="hover:text-krino-yellow transition text-white">Tienda</a>
                    </li>
                    <li>
                        <button
                            className="hover:text-krino-yellow transition bg-transparent border-none cursor-pointer text-white"
                            style={{ background: 'none', padding: 0 }}
                            onClick={() => router.push('/Simulador')}
                        >
                            Simulador
                        </button>
                    </li>
                    <li>
                        <a href="#contacto" className="hover:text-krino-yellow transition text-white">Contacto</a>
                    </li>
                </ul>
            </div>
        </nav>
    )
}