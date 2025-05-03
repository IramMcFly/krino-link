'use client';

import { Bluetooth } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function DeviceSelector() {
  const router = useRouter();

  const handleSelect = () => {
    console.log('Dispositivo seleccionado: KL-01');
    router.push('/MenuDiagnostico');
  };

  return (
    <div className="min-h-screen bg-[#1b1f20] text-white px-4 py-10 text-center">
      <img src="images/logoKR.png" alt="Logo KR" className="w-24 mx-auto mb-6" />

      <h1 className="text-3xl font-bold text-[#c3151b] mb-2">KL Finder</h1>
      <p className="text-sm text-gray-300 mb-6">
        Presiona sobre el dispositivo para seleccionar
      </p>

      <div className="bg-[#c3c3c3] rounded-xl max-w-md mx-auto p-5">
        <div
          onClick={handleSelect}
          className="flex items-center gap-3 bg-[#d1d1d1] text-black px-4 py-3 rounded-lg cursor-pointer hover:bg-[#bbbbbb] transition"
        >
          <Bluetooth size={24} />
          <span className="font-semibold text-lg">KL-01</span>
        </div>
      </div>
    </div>
  );
}
