
import { GoogleGenAI, Type } from "@google/genai";
import { SERVICES } from "../constants";

// Fix: Always use the exact initialization format required by the guidelines: new GoogleGenAI({ apiKey: process.env.API_KEY })
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getBeautyAdvice = async (userPrompt: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Kullanıcı şu soruyu sordu: "${userPrompt}". 
      Lumina Beauty Salon'da şu hizmetler mevcut: ${SERVICES.map(s => s.name).join(', ')}.
      Lütfen kullanıcıya profesyonel, nazik ve bilgilendirici bir cevap ver. Mevcut hizmetlerimizden birini önerebilirsin.
      Yanıtını samimi bir güzellik uzmanı diliyle ver.`,
      config: {
        temperature: 0.7,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Şu an size yardımcı olamıyorum, lütfen daha sonra tekrar deneyiniz.";
  }
};

export const analyzeSkin = async (imageBase64: string) => {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: {
          parts: [
            { inlineData: { data: imageBase64, mimeType: 'image/jpeg' } },
            { text: "Bu cilt fotoğrafını analiz et ve genel cilt durumu hakkında (kuru, yağlı, gözenekli vb.) kısa bir yorum yap ve bizim hizmetlerimizden hangisinin uygun olacağını belirt." }
          ]
        }
      });
      return response.text;
    } catch (error) {
        console.error("Analysis Error:", error);
        return "Cilt analizi şu an gerçekleştirilemiyor.";
    }
};
