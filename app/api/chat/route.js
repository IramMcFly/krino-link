// /app/api/chat/route.js
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();

    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY || process.env.GROQ_API_KEY}`,
        "HTTP-Referer": "http://localhost:3000", // Site URL for rankings on openrouter.ai
        "X-Title": "Krino Link Assistant", // Site title for rankings on openrouter.ai
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "model": body.model || "openai/gpt-oss-20b:free",
        "messages": body.messages,
        "temperature": 0.7,
        "max_tokens": 800
      })
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("❌ Error response from OpenRouter:", res.status, errorText);
      return NextResponse.json({ 
        error: `Error from OpenRouter API: ${res.status} - ${errorText}` 
      }, { status: 500 });
    }

    const data = await res.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("❌ Error al conectar con OpenRouter:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}