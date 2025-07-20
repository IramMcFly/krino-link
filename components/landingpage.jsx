"use client";

import React from "react";
import { ShoppingCart, Rocket, Zap, ShieldCheck, MonitorSmartphone } from "lucide-react";

const features = [
  {
    icon: <Rocket size={32} className="text-krino-red" />,
    title: "Tecnología de Punta",
    desc: "Equipos OBD2 diseñados para el diagnóstico avanzado de vehículos eléctricos e híbridos.",
  },
  {
    icon: <MonitorSmartphone size={32} className="text-krino-yellow" />,
    title: "Simulador Interactivo",
    desc: "Experimenta el diagnóstico antes de comprar con nuestro simulador web.",
  },
  {
    icon: <ShoppingCart size={32} className="text-sky-400" />,
    title: "Tienda Especializada",
    desc: "Compra dispositivos certificados y recibe asesoría personalizada para tu taller.",
  },
  {
    icon: <ShieldCheck size={32} className="text-green-500" />,
    title: "Soporte y Garantía",
    desc: "Atención postventa, actualizaciones y garantía directa con nuestro equipo técnico.",
  },
];

const testimonios = [
  {
    nombre: "Taller EV Pro",
    texto: "Krino Link nos ayudó a modernizar nuestro taller. El simulador es ideal para capacitar al personal.",
  },
  {
    nombre: "AutoElectro MX",
    texto: "El KL-01 es fácil de usar y el soporte técnico es excelente. ¡Recomendado para talleres que quieren crecer!",
  },
];

const LandingPage = () => (
  <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-krino-darker via-krino-dark to-krino-panel font-sans text-white px-4 scroll-smooth">
    <nav className="w-full fixed top-0 bg-krino-panel/95 backdrop-blur-md shadow z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between py-4 px-6">
        <img src="/images/logoKR.png" alt="Krino Logo" className="w-20" />
        <ul className="flex gap-6 text-sm md:text-base font-medium">
          <li><a href="#nosotros" className="hover:text-krino-yellow transition">Nosotros</a></li>
          <li><a href="#tienda" className="hover:text-krino-yellow transition">Tienda</a></li>
          <li><a href="#simulador" className="hover:text-krino-yellow transition">Simulador</a></li>
          <li><a href="#contacto" className="hover:text-krino-yellow transition">Contacto</a></li>
        </ul>
      </div>
    </nav>

    <header id="nosotros" className="w-full max-w-4xl mx-auto text-center pt-32 pb-16">
      <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight leading-tight text-white">
        Krino Solutions
      </h1>
      <p className="text-lg md:text-xl text-gray-300 mt-4 leading-relaxed max-w-2xl mx-auto">
        La plataforma de diagnóstico OBD2 para vehículos eléctricos e híbridos. Lleva tu taller al siguiente nivel con tecnología, simulador y tienda especializada.
      </p>
    </header>

    <section id="tienda" className="w-full max-w-6xl mx-auto bg-krino-panel/90 rounded-3xl shadow-xl p-10 mb-20 border border-[#2c2c2c]">
      <h2 className="text-3xl font-bold text-krino-red mb-10 text-center tracking-wide">
        ¿Por qué elegir Krino Solutions?
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {features.map((f, i) => (
          <div
            key={i}
            className="flex items-start gap-4 bg-krino-card rounded-2xl p-6 shadow-md hover:shadow-xl hover:scale-[1.015] transition-all duration-300"
          >
            <div>{f.icon}</div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">{f.title}</h3>
              <p className="text-gray-300 text-sm leading-relaxed">{f.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>

    <section id="simulador" className="w-full max-w-4xl mx-auto mb-24 px-4">
      <h3 className="text-2xl font-bold text-krino-yellow mb-8 text-center tracking-wide">
        Testimonios
      </h3>
      <div className="flex flex-col md:flex-row gap-6 justify-center">
        {testimonios.map((t, i) => (
          <div
            key={i}
            className="bg-krino-panel rounded-2xl p-6 shadow-md text-left flex-1 hover:shadow-lg transition"
          >
            <p className="text-gray-200 italic mb-3 leading-relaxed">"{t.texto}"</p>
            <span className="text-krino-red font-semibold">{t.nombre}</span>
          </div>
        ))}
      </div>
    </section>

    <section id="contacto" className="w-full max-w-xl mx-auto mb-24 px-4 text-center">
      <h3 className="text-2xl font-bold text-white mb-6">Contáctanos</h3>
      <p className="text-gray-300 mb-4">Puedes escribirnos a <a className="text-krino-yellow hover:underline" href="mailto:contacto@krinosolutions.com">contacto@krinosolutions.com</a></p>
      <p className="text-gray-400 text-sm">© {new Date().getFullYear()} Krino Solutions. Todos los derechos reservados.</p>
    </section>
  </div>
);

export default LandingPage;