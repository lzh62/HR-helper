
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateTeamNames = async (count: number, theme: string = "专业与创新"): Promise<string[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `请生成 ${count} 个独特、有创意且有趣的团队名称，主题是 "${theme}"。请直接返回一个包含字符串的 JSON 数组，必须使用简体中文。`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING
          }
        }
      }
    });

    return JSON.parse(response.text.trim());
  } catch (error) {
    console.error("Gemini API 错误:", error);
    // 降级处理
    return Array.from({ length: count }, (_, i) => `小组 ${i + 1}`);
  }
};
