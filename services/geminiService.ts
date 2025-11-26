import { GoogleGenAI } from "@google/genai";
import { AIRequestOptions } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_TEXT = 'gemini-2.5-flash';

export const processTextWithAI = async (options: AIRequestOptions): Promise<string> => {
  let prompt = "";
  
  switch (options.task) {
    case 'fix_grammar':
      prompt = `Fix the grammar and spelling in the following text. Do not change the tone or meaning. Return only the corrected text:\n\n${options.text}`;
      break;
    case 'rewrite':
      prompt = `Rewrite the following text to be more clear, concise, and professional. Return only the rewritten text:\n\n${options.text}`;
      break;
    case 'summarize':
      prompt = `Summarize the following text into a few bullet points. Return only the bullet points:\n\n${options.text}`;
      break;
    case 'expand':
      prompt = `Expand upon the ideas in the following text, adding relevant details and maintaining the flow. Return only the expanded text:\n\n${options.text}`;
      break;
  }

  try {
    const response = await ai.models.generateContent({
      model: MODEL_TEXT,
      contents: prompt,
    });
    return response.text || "Could not generate response.";
  } catch (error) {
    console.error("AI Text Error:", error);
    throw new Error("Failed to process text.");
  }
};

export const extractTextFromImage = async (base64Image: string): Promise<string> => {
  try {
    // Remove header if present (data:image/png;base64,)
    const cleanBase64 = base64Image.split(',')[1] || base64Image;

    const response = await ai.models.generateContent({
      model: MODEL_TEXT,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/png', // Assuming PNG or JPEG, GenAI handles common types
              data: cleanBase64
            }
          },
          {
            text: "Extract all the text from this image. Keep the layout if possible. Correct any obvious OCR errors."
          }
        ]
      }
    });
    return response.text || "No text found.";
  } catch (error) {
    console.error("OCR Error:", error);
    throw new Error("Failed to recognize text.");
  }
};

export const getSmartSuggestions = async (context: string): Promise<string[]> => {
    // Determine next probable words or short phrases
    const prompt = `Given the text: "${context.slice(-100)}", suggest 3 short continuations (max 5 words each). Return them as a JSON array of strings.`;
    
    try {
        const response = await ai.models.generateContent({
            model: MODEL_TEXT,
            contents: prompt,
            config: { responseMimeType: 'application/json' }
        });
        const json = JSON.parse(response.text || "[]");
        return Array.isArray(json) ? json : [];
    } catch (e) {
        return [];
    }
}
