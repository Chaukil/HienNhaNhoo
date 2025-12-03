import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { PlacedItem } from '../types';

let genAI: GoogleGenAI | null = null;

const getAIClient = () => {
  if (!genAI) {
    const apiKey = process.env.API_KEY;
    if (apiKey) {
      genAI = new GoogleGenAI({ apiKey });
    }
  }
  return genAI;
};

export const getDesignAdvice = async (
  currentItems: PlacedItem[], 
  userQuery: string
): Promise<string> => {
  const ai = getAIClient();
  if (!ai) {
    return "Please configure your API Key to use the AI Interior Designer.";
  }

  const roomDescription = currentItems.map(item => 
    `- ${item.name} (${item.color}) at position ${item.x},${item.y}`
  ).join('\n');

  const prompt = `
    You are an expert interior designer named "CozyBot". 
    The user is designing a room in a game.
    
    Current Room Layout:
    ${roomDescription || "The room is currently empty."}

    User Question: "${userQuery}"

    Provide a short, friendly, and creative piece of advice (max 2 sentences). 
    Suggest specific items or color combinations if relevant.
    Focus on aesthetics, mood, and practical layout.
  `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "I couldn't think of anything right now, try moving some furniture!";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm having trouble seeing your room right now. Please try again later.";
  }
};
