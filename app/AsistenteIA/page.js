// app/AsistenteIA/page.js
'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const AsistenteIA = dynamic(() => import('@/components/AsistenteIA'), { ssr: false });

export default function Page() {
  return (
    <Suspense fallback={<p className="text-white p-4">Cargando Asistente IA...</p>}>
      <AsistenteIA />
    </Suspense>
  );
}
