"use client";

import React from "react";
import { ShoppingCart, Rocket, Zap, ShieldCheck, MonitorSmartphone } from "lucide-react";

const features = [
	{
		icon: <Rocket size={32} className="text-[#c3151b]" />,
		title: "Tecnología de Punta",
		desc: "Equipos OBD2 diseñados para el diagnóstico avanzado de vehículos eléctricos e híbridos.",
	},
	{
		icon: <MonitorSmartphone size={32} className="text-[#facc15]" />,
		title: "Simulador Interactivo",
		desc: "Experimenta el diagnóstico antes de comprar con nuestro simulador web.",
	},
	{
		icon: <ShoppingCart size={32} className="text-[#38bdf8]" />,
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
	<div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#1b1f20] via-[#23272f] to-[#2b2b2b] font-sans relative">
		<header className="w-full max-w-3xl mx-auto text-center mt-12 mb-8">
			<img
				src="/images/logoKR.png"
				alt="Krino Link Logo"
				className="w-24 mx-auto mb-4 drop-shadow-lg"
			/>
			<h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
				Krino Solutions
			</h1>
			<p className="text-lg md:text-xl text-gray-300 max-w-xl mx-auto mb-6">
				La plataforma de diagnóstico OBD2 para vehículos eléctricos e híbridos. Lleva tu taller al
				siguiente nivel con tecnología, simulador y tienda especializada.
			</p>
			<div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
				<a
					href="/simulador"
					className="bg-[#c3151b] hover:bg-[#a31217] text-white font-bold px-8 py-3 rounded-lg shadow transition text-lg flex items-center gap-2 justify-center"
				>
					<Zap size={20} /> Probar Simulador
				</a>
				<a
					href="/Tienda"
					className="bg-[#facc15] hover:bg-yellow-400 text-[#1b1f20] font-bold px-8 py-3 rounded-lg shadow transition text-lg flex items-center gap-2 justify-center"
				>
					<ShoppingCart size={20} /> Ir a la Tienda
				</a>
			</div>
		</header>

		<section className="w-full max-w-5xl mx-auto bg-[#23272f]/90 rounded-2xl shadow-lg p-8 mb-12">
			<h2 className="text-2xl font-bold text-[#c3151b] mb-8 text-center">
				¿Por qué elegir Krino Solutions?
			</h2>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
				{features.map((f, i) => (
					<div
						key={i}
						className="flex items-start gap-4 bg-[#2b2b2b] rounded-xl p-6 shadow hover:scale-[1.02] transition"
					>
						<div>{f.icon}</div>
						<div>
							<h3 className="text-lg font-semibold text-white mb-1">{f.title}</h3>
							<p className="text-gray-300 text-sm">{f.desc}</p>
						</div>
					</div>
				))}
			</div>
		</section>

		<section className="w-full max-w-3xl mx-auto mb-16">
			<h3 className="text-xl font-bold text-[#facc15] mb-6 text-center">Testimonios</h3>
			<div className="flex flex-col md:flex-row gap-6 justify-center">
				{testimonios.map((t, i) => (
					<div
						key={i}
						className="bg-[#23272f] rounded-xl p-6 shadow text-left flex-1"
					>
						<p className="text-gray-200 italic mb-2">"{t.texto}"</p>
						<span className="text-[#c3151b] font-semibold">{t.nombre}</span>
					</div>
				))}
			</div>
		</section>

		<footer className="w-full text-center py-6 text-gray-500 text-sm border-t border-[#23272f]">
			© {new Date().getFullYear()} Krino Solutions. Todos los derechos reservados.
		</footer>
		<style jsx global>{`
			body {
				background: #1b1f20;
			}
		`}</style>
	</div>
);

export default LandingPage;