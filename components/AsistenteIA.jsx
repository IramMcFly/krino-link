// components/AsitenteIA.jsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { FaPaperPlane, FaArrowLeft } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';

export default function AsistenteIA() {
  const router = useRouter();
  const [userMessage, setUserMessage] = useState('');
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const searchParams = useSearchParams();
  const codigoInicial = searchParams.get('codigo');
  const vehiculoId = searchParams.get('vehiculo');
  const desdeParam = searchParams.get('desde');
  const [codigoProcesado, setCodigoProcesado] = useState(false);

  // Detectar si viene desde el simulador
  const vieneDesdeSimulador = vehiculoId && codigoInicial;

  const volverAlSimulador = () => {
    if (desdeParam === 'analisis-rapido' && vehiculoId) {
      // Si viene del análisis rápido, navegar de vuelta al simulador con el vehículo seleccionado
      router.push(`/Simulador?vehiculo=${vehiculoId}&modulo=AnalisisRapidoSimulador`);
    } else {
      // Fallback: usar router.back()
      router.back();
    }
  };

  useEffect(() => {
    if (codigoInicial && !codigoProcesado) {
      const mensajeInicial = `¿Qué significa el código DTC ${codigoInicial} en un vehículo eléctrico o híbrido?`;
      setCodigoProcesado(true);
      enviarConsulta(mensajeInicial, true);
    }
  }, [codigoInicial, codigoProcesado]);

  const enviarConsulta = async (mensaje, esInicial = false) => {
    setLoading(true);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'mistralai/mistral-small-3.2-24b-instruct:free',
          messages: [
            {
              role: 'system',
              content:
                'Eres un asistente técnico experto en diagnóstico automotriz. Tu objetivo es interpretar códigos DTC (Diagnostic Trouble Codes) y explicar su origen, implicaciones técnicas y posibles soluciones en autos híbridos y eléctricos. Sé claro, conciso y profesional. Usa lenguaje técnico si es apropiado.',
            },
            { role: 'user', content: mensaje },
          ],
        }),
      });

      const data = await response.json();
      const respuesta = data.choices?.[0]?.message?.content || 'No pude procesar tu solicitud.';

      setChat((prev) => {
        const nuevaConversacion = esInicial
          ? [...prev, { role: 'user', content: mensaje }, { role: 'assistant', content: respuesta }]
          : [...prev, { role: 'user', content: mensaje }, { role: 'assistant', content: respuesta }];

        // Elimina duplicados exactos si ocurren
        const vistos = new Set();
        return nuevaConversacion.filter((msg) => {
          const clave = msg.role + msg.content;
          if (vistos.has(clave)) return false;
          vistos.add(clave);
          return true;
        });
      });
    } catch (error) {
      setChat((prev) => [
        ...prev,
        { role: 'assistant', content: 'Hubo un error al contactar al asistente. Intenta más tarde.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = () => {
    if (!userMessage.trim()) return;
    enviarConsulta(userMessage);
    setUserMessage('');
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat]);

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white flex flex-col">
      <div className="max-w-2xl w-full mx-auto flex flex-col flex-1 bg-[#1E1E1E] rounded-lg shadow-md border border-[#333] overflow-hidden">
        <div className="p-4 border-b border-[#333] text-center relative">
          {vieneDesdeSimulador && (
            <button 
              onClick={volverAlSimulador}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
            >
              <FaArrowLeft size={16} />
              Volver
            </button>
          )}
          <h1 className="text-xl font-bold">Asistente Técnico IA</h1>
          <p className="text-gray-400 text-sm">Resuelve dudas sobre códigos DTC en vehículos eléctricos</p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-24">
          {chat.map((msg, i) => (
            <div
              key={i}
              className={`p-3 rounded-lg text-sm ${msg.role === 'user' ? 'bg-red-600/20 text-right self-end ml-auto' : 'bg-[#333] text-left'}`}
            >
              <ReactMarkdown
                components={{
                  strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
                  p: ({ children }) => <p className="whitespace-pre-wrap text-sm text-white mb-2">{children}</p>,
                  ul: ({ children }) => <ul className="list-disc pl-5 mb-2">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal pl-5 mb-2">{children}</ol>,
                  li: ({ children }) => <li className="mb-1">{children}</li>,
                }}
              >
                {msg.content}
              </ReactMarkdown>
            </div>
          ))}
          {loading && (
            <div className="p-3 rounded-lg bg-[#333] text-left animate-pulse text-sm text-gray-400">
              Analizando código DTC...
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="p-4 flex items-center gap-2 bg-[#1a1a1a] border-t border-[#333]">
          <input
            type="text"
            placeholder="Haz una nueva consulta..."
            className="flex-1 bg-[#333] text-white py-2 px-4 rounded-md focus:outline-none"
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button
            onClick={handleSend}
            disabled={!userMessage.trim()}
            className="bg-[#c3151b] hover:bg-[#a31217] text-white p-2 rounded-full disabled:bg-gray-600"
          >
            <FaPaperPlane size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}