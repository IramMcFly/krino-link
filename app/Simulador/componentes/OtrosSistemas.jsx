'use client';

export default function OtrosSistemas({ volver }) {
  return (
    <div className="text-white p-6">
      <h2 className="text-2xl font-bold mb-4 text-[#c3151b]">Simulación: Otros Sistemas</h2>
      <p className="mb-4">Módulos como dirección asistida, freno electrónico de estacionamiento, SRS y TPMS.</p>
      <button onClick={volver} className="bg-gray-700 hover:bg-gray-600 px-5 py-2 rounded">Volver</button>
    </div>
  );
}
