import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

export async function POST(req) {
    try {
        const { imagenes } = await req.json();

        if (!imagenes || imagenes.length === 0) {
            return NextResponse.json(
                { error: "No se recibieron imágenes." },
                { status: 400 }
            );
        }

        const parts = [
            {
                text: `
Eres un fotógrafo y asesor inmobiliario profesional.

Analiza TODAS las imágenes de esta propiedad.

Describe únicamente lo que realmente ves.

No inventes información.

Responde en español.

Incluye:

- Tipo de fachada
- Estilo arquitectónico
- Cocina
- Sala
- Comedor
- Recámaras
- Baños
- Jardín
- Alberca
- Cochera
- Acabados
- Iluminación
- Estado de conservación

Al final crea una descripción general de la propiedad.
`,
            },
        ];

        for (const url of imagenes) {
            parts.push({
                fileData: {
                    mimeType: "image/jpeg",
                    fileUri: url,
                },
            });
        }

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [
                {
                    role: "user",
                    parts,
                },
            ],
        });

        return NextResponse.json({
            descripcionVisual: response.text,
        });
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            {
                error: error.message,
            },
            {
                status: 500,
            }
        );
    }
}