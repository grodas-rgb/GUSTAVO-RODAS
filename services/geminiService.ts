import { GoogleGenAI, Type } from "@google/genai";
import { ProblemCategory } from "../types";

const apiKey = process.env.API_KEY || '';

// Create a safe instance wrapper to handle missing keys gracefully in UI
const getAIClient = () => {
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
};

export const analyzeObservation = async (observation: string): Promise<{ category: string; reasoning: string } | null> => {
  const ai = getAIClient();
  if (!ai) {
    console.warn("Gemini API Key missing");
    return null;
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Analiza la siguiente descripción de un reclamo de cliente sobre productos de empaque: "${observation}".
      
      Clasifica el problema en una de las siguientes categorías basándote en la causa raíz más probable:
      1. ERROR DE DESPACHO / BODEGA (Producto cruzado, faltante, sobrante)
      2. CALIDAD DEL PRODUCTO (Defecto de fábrica, medidas incorrectas, falla sellado, apariencia, olor/contaminación)
      3. TRANSPORTE / ENTREGA (Daño físico, pedido incompleto por ruta)
      4. ERROR COMERCIAL (Ventas, error de captura)
      
      Responde en JSON.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            category: {
              type: Type.STRING,
              enum: [
                ProblemCategory.DISPATCH,
                ProblemCategory.QUALITY,
                ProblemCategory.TRANSPORT,
                ProblemCategory.COMMERCIAL,
                ProblemCategory.UNSPECIFIED
              ]
            },
            reasoning: {
              type: Type.STRING,
              description: "Breve explicación de por qué se eligió esa categoría."
            }
          }
        }
      }
    });

    if (response.text) {
        return JSON.parse(response.text);
    }
    return null;

  } catch (error) {
    console.error("Error analyzing text with Gemini:", error);
    return null;
  }
};