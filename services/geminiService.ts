
import { GoogleGenAI, Chat } from "@google/genai";
import { Jurusan } from "../types";

// FIX: Directly use process.env.API_KEY as per guidelines.
// The availability of the API key is a hard requirement handled externally.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

let chatInstance: Chat | null = null;

export const startChatSession = (
    interestProfile: string | null, 
    recommendedMajors: Jurusan[] | null
): Chat => {
  let systemInstruction = `Anda adalah konsultan jurusan universitas dari 'Jurusanku' yang ramah dan berpengetahuan. Persona Anda adalah konsultan karir pribadi, bukan sebuah AI. Berinteraksilah dengan pengguna dalam gaya percakapan yang profesional namun tetap santai. Selalu berkomunikasi dengan nada yang suportif dan memotivasi dalam Bahasa Indonesia. Hindari penggunaan bahasa gaul atau terlalu informal. Tujuan Anda adalah membantu siswa SMA di Indonesia menemukan jurusan yang tepat.`;

  // Fix: Corrected variable name from 'interestResult' to 'interestProfile' to match function parameter.
  if(interestProfile) {
    systemInstruction += ` Pengguna memiliki profil minat '${interestProfile}'.`;
  }
  if (recommendedMajors && recommendedMajors.length > 0) {
    const majorNames = recommendedMajors.map(j => j.nama).join(', ');
    systemInstruction += ` Berdasarkan algoritma kami, jurusan berikut direkomendasikan untuknya: ${majorNames}. Gunakan ini sebagai titik awal pembicaraan.`;
  }
  
  systemInstruction += ` Gunakan konteks ini untuk memberikan rekomendasi yang personal dan memandu percakapan.`;


  chatInstance = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction,
    },
  });
  return chatInstance;
};

export const sendMessageToAI = async (message: string): Promise<string> => {
  if (!chatInstance) {
    startChatSession(null, null); // Start a default session if none exists
  }
  
  if (chatInstance) {
      try {
        const response = await chatInstance.sendMessage({ message });
        return response.text;
      } catch (error) {
        console.error("Error sending message to AI:", error);
        throw new Error("Failed to get a response from AI. Please try again.");
      }
  }
  throw new Error("Chat session not initialized.");
};