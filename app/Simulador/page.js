'use client';
import { useState, Suspense, lazy } from 'react';
import MenuGeneral from './componentes/MenuGeneral';

export default function Simulador() {
  const [moduloActivo, setModuloActivo] = useState(null);
  const ModuloDinamico = moduloActivo ? lazy(() => import(`./componentes/${moduloActivo}`)) : null;

  return (
    <div className="min-h-screen p-4 bg-[#1b1f20] text-white">
      {!moduloActivo ? (
        <MenuGeneral seleccionarModulo={setModuloActivo} />
      ) : (
        <Suspense fallback={<p className="text-white">Cargando módulo...</p>}>
          <ModuloDinamico volver={() => setModuloActivo(null)} />
        </Suspense>
      )}
    </div>
  );
}