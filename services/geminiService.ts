import { GoogleGenAI, Type } from "@google/genai";
import { VideoAnalysis } from "../types";

// Helper to convert File to Base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the data URL prefix (e.g., "data:video/mp4;base64,")
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });
};

export const analyzeVideoStyle = async (file: File, context?: string): Promise<VideoAnalysis> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error("API_KEY is missing in environment variables.");
    }

    const ai = new GoogleGenAI({ apiKey });
    const base64Data = await fileToBase64(file);

    // Determine mime type (default to mp4 if unknown, though file.type should exist)
    const mimeType = file.type || 'video/mp4';

    const promptText = `
      You are an expert film scholar and AI prompt engineer. 
      Analyze the attached video clip meticulously. 
      Your goal is to reverse-engineer the style so I can recreate a similar video using a generative AI model (like Veo, Sora, or Runway).
      
      ${context ? `Additional user context: ${context}` : ''}

      Please provide a JSON response with the following fields:
      1. visualStyle: Describe the color palette, lighting (e.g., natural, studio, neon, low-key), and texture (e.g., film grain, sharp digital).
      2. cinematography: Describe camera angles, movement (e.g., handheld shake, smooth gimbal, static), and framing.
      3. pacingAndMood: Describe the editing speed, rhythm, and emotional atmosphere.
      4. technicalDetails: Mention aspect ratio, potential lens types (e.g., wide angle, telephoto), and depth of field.
      5. generatedPrompt: A highly detailed, optimized text prompt that I can paste into a video generation tool to create a NEW video with this EXACT style. The prompt should include subject placeholders like [SUBJECT] where appropriate.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Data,
            },
          },
          {
            text: promptText,
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            visualStyle: { type: Type.STRING },
            cinematography: { type: Type.STRING },
            pacingAndMood: { type: Type.STRING },
            technicalDetails: { type: Type.STRING },
            generatedPrompt: { type: Type.STRING },
          },
          required: ["visualStyle", "cinematography", "pacingAndMood", "technicalDetails", "generatedPrompt"],
        },
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini.");

    return JSON.parse(text) as VideoAnalysis;

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};