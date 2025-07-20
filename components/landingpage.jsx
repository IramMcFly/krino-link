"use client";

import React from "react";
import { ShoppingCart, Rocket, Zap, ShieldCheck, MonitorSmartphone, Eye } from "lucide-react";
import { NavLanding } from "./NavLanding";


const imagenes = [
	{
		src: '/images/store/KL-01.png'
	},
	{
		src: '/images/store/K-KEY.png'
	},
	{
		src: '/images/store/StarterKit.png'
	},
]


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

const misiones = [
	{
		icon: <Rocket size={32} className="text-green-500" />,
		title: "Mision",
		desc: "Ser la empresa desarrolladora de HW y SW referente del mercado y confiable"
	},
	{
		icon: <Eye size={32} className="text-green-500" />,
		title: "Vision",
		desc: "Tener el mejor mercado al ser los dispositivos de confianza y primera eleccion para todos los talleres"
	}
]


const LandingPage = () => (
	<div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-krino-darker via-krino-dark to-krino-panel font-sans text-white px-4 scroll-smooth">
		<NavLanding />

		<div id="top" className="h-0" />

		<header id="intro" className="w-full max-w-4xl mx-auto text-center pt-32 pb-16">
			<h1 className="text-5xl md:text-6xl font-extrabold tracking-tight leading-tight text-white">
				Krino Solutions
			</h1>
			<p className="text-lg md:text-xl text-gray-300 mt-4 leading-relaxed max-w-2xl mx-auto">
				La plataforma de diagnóstico OBD2 para vehículos eléctricos e híbridos. Lleva tu taller al siguiente nivel con tecnología, simulador y tienda especializada.
			</p>


		</header>

		<section id="imagenes" className="mb-10 mt-0">
			<div className="flex flex-wrap justify-center gap-10">
				{imagenes.map((f, i) => (
					<div
						key={i}
						className="rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
					>
						<img
							src={f.src}
							alt="imagen"
							className="w-100 h-100 object-cover rounded-xl"
						/>
					</div>
				))}
			</div>

		</section>


		<section id="nosotros" className="w-full max-w-6xl mx-auto bg-krino-panel/90 rounded-3xl shadow-xl p-10 mb-20 border border-[#2c2c2c]">
			<h2 className="text-3xl font-bold text-krino-red mb-10 text-center tracking-wide">
				¿Quiénes Somos?
			</h2>
			<p className="text-lg md:text-xl text-gray-300 mt-4 leading-relaxed max-w-2xl mx-auto text-center">
				Somos una empresa desarrolladora de Software y Hardware para diagnóstico OBDII para vehículos electricos e híbridos.
			</p>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
				{misiones.map((f, i) => (
					<div
						key={i}
						className="flex items-start gap-4 bg-krino-card rounded-2xl p-6 shadow-md hover:shadow-xl hover:scale-[1.015] transition-all duration-300"
					>

						<div className="flex flex-col items-center text-center bg-krino-card rounded-2xl p-6 shadow-md hover:shadow-xl hover:scale-[1.015] transition-all duration-300">
							<div className="mb-4 text-green-500 text-3xl">
								{f.icon}
							</div>
							<h3 className="text-lg font-semibold text-white mb-1">{f.title}</h3>
							<p className="text-gray-300 text-sm leading-relaxed">{f.desc}</p>
						</div>
					</div>
				))}
			</div>
		</section>

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