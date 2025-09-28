"use client";

import React from "react";
import { FaShoppingCart, FaRocket, FaZap,  FaShieldAlt, FaMobileAlt, FaEye, FaCode, FaIndustry, FaPaintBrush, FaRobot, FaTruck, FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaLeaf, FaLightbulb, FaHandsHelping, FaBolt } from "react-icons/fa";
import { MdFactory } from "react-icons/md";
import { NavLanding } from "./NavLanding";
import { useRouter } from 'next/navigation';


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
		icon: <FaRocket size={32} className="text-krino-red" />,
		title: "Tecnología de Punta",
		desc: "Equipos OBD2 diseñados para el diagnóstico avanzado de vehículos eléctricos e híbridos.",
		link: "/" // misma página
	},
	{
		icon: <FaMobileAlt size={32} className="text-krino-yellow" />,
		title: "Simulador Interactivo",
		desc: "Experimenta el diagnóstico antes de comprar con nuestro simulador web.",
		link: "/Simulador"
	},
	{
		icon: <FaShoppingCart size={32} className="text-sky-400" />,
		title: "Tienda Especializada",
		desc: "Compra dispositivos certificados y recibe asesoría personalizada para tu taller.",
		link: "/Tienda"
	},
	{
		icon: <FaShieldAlt size={32} className="text-green-500" />,
		title: "Soporte y Garantía",
		desc: "Atención postventa, actualizaciones y garantía directa con nuestro equipo técnico.",
		link: "#contacto"
	},
];

const testimonios = [
	{
		nombre: "Maquinados Industriales Ballesteros MIB, Chihuahua.",
		texto: "Krino Link nos ayudó a modernizar nuestro taller. El simulador es ideal para capacitar al personal.",
	},
	{
		nombre: "Multiservicios Almeraz, Chihuahua.",
		texto: "El KL-01 es fácil de usar y el soporte técnico es excelente. ¡Recomendado para talleres que quieren crecer!",
	},
	{
		nombre: "Transmisiones Automáticas Julian, Chihuahua.",
		texto: "Increible soporte para vehiculos hibridos. Nos ha permitido diagnosticar y reparar facilmente.",
	},
];

const misiones = [
	{
		icon: <FaRocket size={32} className="text-green-500" />,
		title: "Mision",
		desc: "Ser la empresa desarrolladora de hardware y software para diagnostico OBDII para vehiculos electricos e hibridos mas grande de Mexico y Latinoamerica"
	},
	{
		icon: <FaEye size={32} className="text-green-500" />,
		title: "Vision",
		desc: "Ofrecer soluciones innovadoras y accesibles que impulsen la eficiencia y el crecimiento de los talleres automotrices en el emergente mercado de vehículos eléctricos e híbridos."
	}
]

const valores = [
    {
        icon: <FaLeaf size={32} className="text-green-400" />,
        title: "Sustentabilidad",
        desc: "Impulsamos soluciones tecnológicas que contribuyen al cuidado del medio ambiente y la electrificación del sector automotriz."
    },
    {
        icon: <FaLightbulb size={32} className="text-yellow-400" />,
        title: "Innovación",
        desc: "Fomentamos la creatividad y el desarrollo de nuevas tecnologías para mejorar el diagnóstico y la experiencia de nuestros clientes."
    },
    {
        icon: <FaHandsHelping size={32} className="text-blue-400" />,
        title: "Colaboración",
        desc: "Creemos en el trabajo en equipo y en el apoyo mutuo para alcanzar objetivos comunes y fortalecer la industria."
    },
    {
        icon: <FaBolt size={32} className="text-krino-yellow" />,
        title: "Electrificación",
        desc: "Apoyamos la transición hacia vehículos eléctricos e híbridos, promoviendo el acceso a tecnología avanzada en talleres."
    }
];

const equipo = [
	{
		title: "Desarrollo",
		desc: "Nuestro equipo de desarrollo está compuesto por estudiantes de ingeniería especializados en sistemas embebidos y conocimiento de protocolos de diagnóstico OBDII.",
		icon: <FaCode size={28} className="text-krino-yellow" />
	},
	{
		title: "Fabricación",
		desc: "Todos nuestros productos son diseñados y fabricados 100% en México, asegurando calidad y soporte local para nuestros clientes.",
		icon: <MdFactory size={28} className="text-green-400" />
	},
	{
		title: "Diseño",
		desc: "Nuestro equipo de diseño se encarga de crear interfaces intuitivas y atractivas para nuestros productos, asegurando una experiencia de usuario excepcional.",
		icon: <FaPaintBrush size={28} className="text-pink-400" />
	},
	{
		title: "Inteligencia Artificial",
		desc: "Nuestro equipo de desarrollo trabaja en algoritmos avanzados para mejorar el diagnóstico y la reparación de todo tipo de vehículos.",
		icon: <FaRobot size={28} className="text-blue-400" />
	},
	{
		title: "Distribución",
		desc: "Nuestros productos pueden ser adquiridos a través de nuestra tienda en línea, con envíos a todo México y Latinoamérica. Así como refaccionarias locales, nacionales e internacionales.",
		icon: <FaTruck size={28} className="text-sky-400" />
	}
];

// Información de los sponsors en formato de objeto
const sponsors = [
	{
		title: "MIB",
		desc: "Maquinados Industriales Ballesteros, Chihuahua.",
		image: "/images/sponsor/maquinadosindustriales.jpg"
	},
	{
		title: "Startup Garden",
		desc: "Incubadora de startups enfocada en tecnología e innovación.",
		image: "/images/sponsor/startupgarden.png"
	}
];

const contactos = [
    {
        icon: <FaFacebook size={32} className="text-blue-500" />,
        link: "https://facebook.com/krinosolutions"
    },
    {
        icon: <FaTwitter size={32} className="text-sky-400" />,
        link: "https://twitter.com/krinosolutions"
    },
    {
        icon: <FaInstagram size={32} className="text-pink-500" />,
        link: "https://instagram.com/krinosolutions"
    },
    {
        icon: <FaLinkedin size={32} className="text-blue-700" />,
        link: "https://linkedin.com/company/krinosolutions"
    }
];

function SimuladorButton() {
  const router = useRouter();
  return (
    <button
      onClick={() => router.push('/Simulador')}
      className="mt-6 md:mt-8 bg-yellow-500 text-black font-bold px-6 md:px-8 py-3 md:py-4 rounded-xl shadow-lg hover:bg-yellow-400 transition-all text-base md:text-lg flex items-center gap-2 md:gap-3 w-full sm:w-auto justify-center"
      style={{ visibility: 'visible' }}
    >
      <FaRocket className="text-krino-red" />
      Probar Simulador
    </button>
  );
}

const LandingPage = () => (
	<div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-krino-darker via-krino-dark to-krino-panel font-sans text-white px-4 scroll-smooth">
		<NavLanding />

		<div id="top" className="h-0" />
		<header id="intro" className="flex flex-col items-center w-full max-w-5xl mx-auto text-center pt-24 md:pt-32 pb-16 md:pb-24">
			<img 
				src="images/logoKR.png" 
				alt="KRINO" 
				className="h-20 w-20 sm:h-24 sm:w-24 md:h-32 md:w-32 mb-6 object-contain"
			/>

			<h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight text-white mb-6">
				Krino Solutions
			</h1>
			<p className="text-base sm:text-lg md:text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto px-4">
				La plataforma de diagnóstico OBD2 para vehículos eléctricos e híbridos. Lleva tu taller al siguiente nivel con tecnología, simulador y tienda especializada.
			</p>
			<SimuladorButton />
		</header>

		<section id="imagenes" className="w-full max-w-6xl mx-auto mb-16 md:mb-24">
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 px-4">
				{imagenes.map((f, i) => (
					<div
						key={i}
						className="rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
					>
						<img
							src={f.src}
							alt={`Producto ${i + 1}`}
							className="w-full h-48 sm:h-56 md:h-64 object-cover"
						/>
					</div>
				))}
			</div>
		</section>


		<section id="nosotros" className="w-full max-w-6xl mx-auto bg-krino-panel/90 rounded-3xl shadow-xl p-6 md:p-10 mb-16 md:mb-24 border border-[#2c2c2c] pt-24 md:pt-28">
			<h2 className="text-2xl md:text-3xl font-bold text-krino-red mb-8 md:mb-12 text-center tracking-wide">
				¿Quiénes Somos?
			</h2>
			<p className="text-base md:text-xl text-gray-300 leading-relaxed max-w-4xl mx-auto text-center mb-10 md:mb-12 px-4">
				Somos una empresa desarrolladora de Software y Hardware para diagnóstico OBDII para vehículos eléctricos e híbridos.
			</p>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-12 md:mb-16">
				{misiones.map((f, i) => (
					<div
						key={i}
						className="flex flex-col sm:flex-row items-start gap-4 bg-krino-card rounded-2xl p-6 shadow-md hover:shadow-xl hover:scale-[1.015] transition-all duration-300"
					>
						<div className="mb-2 sm:mb-4 text-green-500 text-2xl md:text-3xl flex-shrink-0">
							{f.icon}
						</div>
						<div className="flex-1">
							<h3 className="text-lg md:text-xl font-semibold text-white mb-2">{f.title}</h3>
							<p className="text-gray-300 text-sm md:text-base leading-relaxed">{f.desc}</p>
						</div>
					</div>
				))}
			</div>
			{/* Apartado de valores */}
			<div className="mb-12 md:mb-16">
				<h3 className="text-xl md:text-2xl font-bold text-krino-yellow mb-8 text-center tracking-wide">
					Valores Krino
				</h3>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    {valores.map((v, i) => (
        <div
            key={i}
            className="flex flex-col items-center bg-krino-card rounded-2xl p-6 shadow-md hover:shadow-xl hover:scale-[1.015] transition-all duration-300"
        >
            <div className="mb-4 text-3xl">{v.icon}</div>
            <h4 className="text-base md:text-lg font-semibold text-white mb-2 text-center">{v.title}</h4>
            <p className="text-gray-300 text-sm md:text-base leading-relaxed text-left w-full">{v.desc}</p>
        </div>
    ))}
</div>
			</div>
			{/* Fin valores */}
			<div>
				<h3 className="text-xl md:text-2xl font-bold text-krino-yellow mb-8 text-center tracking-wide">
					Nuestro Equipo
				</h3>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{equipo.map((e, i) => {
						const isLastRowCentered = equipo.length === 5 && i >= 3;
						return (
							<div
								key={i}
								className={`bg-krino-card rounded-xl p-6 shadow-md hover:shadow-xl hover:scale-[1.03] transition-all duration-300 flex flex-row items-start gap-6 min-w-[250px] md:min-w-[300px] w-full
									${isLastRowCentered ? "lg:col-span-1 lg:justify-self-center" : ""}`}
								style={isLastRowCentered ? { gridColumn: "span 1", justifySelf: "center" } : {}}
							>
								<div className="mb-2">{e.icon}</div>
								<div>
									<h4 className="text-base md:text-lg font-semibold text-white mb-3">{e.title}</h4>
									<p className="text-gray-300 text-sm md:text-base leading-relaxed">{e.desc}</p>
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</section>

		<section id="tienda" className="w-full max-w-6xl mx-auto bg-krino-panel/90 rounded-3xl shadow-xl p-6 md:p-10 mb-16 md:mb-24 border border-[#2c2c2c] pt-24 md:pt-28">
			<h2 className="text-2xl md:text-3xl font-bold text-krino-red mb-8 md:mb-12 text-center tracking-wide">
				¿Por qué elegir Krino Solutions?
			</h2>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
				{features.map((f, i) => (
					<a
						key={i}
						href={f.link}
						className="flex flex-col sm:flex-row items-start gap-4 bg-krino-card rounded-2xl p-6 shadow-md hover:shadow-xl hover:scale-[1.015] transition-all duration-300 cursor-pointer"
					>
						<div className="flex-shrink-0 mb-2 sm:mb-0">{f.icon}</div>
						<div className="flex-1">
							<h3 className="text-base md:text-lg font-semibold text-white mb-2">{f.title}</h3>
							<p className="text-gray-300 text-sm md:text-base leading-relaxed">{f.desc}</p>
						</div>
					</a>
				))}
			</div>
		</section>

		<section id="simulador" className="w-full max-w-6xl mx-auto mb-16 md:mb-24 px-4 pt-24 md:pt-28">
			<h3 className="text-xl md:text-2xl font-bold text-krino-yellow mb-8 md:mb-12 text-center tracking-wide">
				Testimonios
			</h3>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
				{testimonios.map((t, i) => (
					<div
						key={i}
						className="bg-krino-panel rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300 flex-1"
					>
						<p className="text-gray-200 italic mb-4 text-sm md:text-base leading-relaxed">"{t.texto}"</p>
						<span className="text-krino-red font-semibold text-sm md:text-base">{t.nombre}</span>
					</div>
				))}
			</div>
		</section>

		{/* Sección de Sponsors */}
		<section id="sponsors" className="w-full max-w-6xl mx-auto mb-16 md:mb-24 px-4 pt-24 md:pt-28">
			<h2 className="text-xl md:text-2xl font-bold text-white mb-8 md:mb-12 text-center">
				Sponsors
			</h2>
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-12">
				{sponsors.map((sponsor, i) => (
					<div key={i} className="flex flex-col items-center text-center">
						<div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gray-600 flex items-center justify-center mb-4 shadow-lg overflow-hidden">
							<img
								src={sponsor.image}
								alt={sponsor.title + " logo"}
								className="object-contain w-full h-full"
							/>
						</div>
						<h4 className="text-base md:text-lg font-medium text-white mb-2">{sponsor.title}</h4>
						<p className="text-gray-300 text-sm leading-relaxed">{sponsor.desc}</p>
					</div>
				))}
			</div>
		</section>

		<section id="contacto" className="w-full max-w-4xl mx-auto mb-16 md:mb-32 px-4 text-center pt-24 md:pt-28">
			<h3 className="text-xl md:text-2xl font-bold text-white mb-6 md:mb-8">Contáctanos</h3>
			<div className="flex justify-center gap-6 mb-6">
				{contactos.map((c, i) => (
					<a
						key={i}
						href={c.link}
						target="_blank"
						rel="noopener noreferrer"
						className="hover:scale-110 transition-transform duration-200"
					>
						{c.icon}
					</a>
				))}
			</div>
			<p className="text-gray-300 mb-6 text-sm md:text-base">
				Puedes escribirnos a{' '}
				<a className="text-krino-yellow hover:underline break-all" href="mailto:contactomcfly@gmail.com">
					contactomcfly@gmail.com
				</a>
			</p>
			<p className="text-gray-400 text-xs md:text-sm">
				© {new Date().getFullYear()} Krino Solutions. Todos los derechos reservados.
			</p>
		</section>
	</div>
);

export default LandingPage;