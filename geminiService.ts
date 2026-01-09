
import { GoogleGenAI, Type } from "@google/genai";
import { HRDocument, RAGResponse } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const queryHRAssistant = async (
  query: string,
  documents: HRDocument[]
): Promise<RAGResponse> => {
  const model = 'gemini-3-flash-preview';
  
  // Construct the context from documents
  const context = documents
    .map(doc => `[Document: ${doc.name}]\n${doc.content}`)
    .join('\n\n---\n\n');

  const systemInstruction = `
    You are an HR Onboarding Assistant. Your goal is to answer employee queries using ONLY the provided document context.
    
    CRITICAL RULES:
    1. Answer only based on the provided documents. If the answer is not in the documents, say "I'm sorry, I don't have information on that in our current policy manual."
    2. Provide specific citations or snippets from the documents to back your claims.
    3. Categorize the query into one of: "Benefits", "Legal", "Internal Culture", "Technical/IT", or "General".
    4. Return your response in JSON format.

    Context:
    ${context}
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: query,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            answer: { type: Type.STRING },
            citations: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Relevant snippets or direct quotes from the provided context."
            },
            category: { type: Type.STRING }
          },
          required: ["answer", "citations", "category"]
        }
      },
    });

    const result = JSON.parse(response.text || '{}');
    return {
      answer: result.answer || "I'm sorry, I couldn't process that query.",
      citations: result.citations || [],
      category: result.category || "General"
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      answer: "An error occurred while contacting the HR Intelligence module.",
      citations: [],
      category: "Error"
    };
  }
};
