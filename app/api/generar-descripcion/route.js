import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const datos = await req.json();

    const prompt = `
Eres un asistente inmobiliario profesional.

Con estos datos:
Tipo: ${datos.tipo}
Título: ${datos.titulo}
Precio: ${datos.precio}
Ubicación: ${datos.ubicacion}
Recámaras: ${datos.recamaras}
Baños: ${datos.banos}
Estacionamientos: ${datos.estacionamientos}
Metros: ${datos.metros}

Genera exactamente esto en español:

1. DESCRIPCIÓN WEB:
Una descripción elegante y profesional.

2. PUBLICACIÓN FACEBOOK:
Texto atractivo para vender la propiedad.

3. MENSAJE WHATSAPP:
Mensaje corto para enviar a clientes interesados.

4. HASHTAGS:
Hashtags inmobiliarios útiles.

No inventes datos que no se mencionan.
`;

    const respuesta = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 450,
      }),
    });

    const json = await respuesta.json();

    return NextResponse.json({
      resultado: json.choices?.[0]?.message?.content || "No se pudo generar el contenido.",
    });
  } catch (error) {
    return NextResponse.json({
      error: error.message,
    });
  }
}