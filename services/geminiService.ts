import { GoogleGenAI, Type, Schema } from "@google/genai";
import { fileToBase64 } from "../utils/fileUtils";
import { AIAnalysisResult } from "../types";

const ANALYSIS_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    summary: {
      type: Type.STRING,
      description: "A concise summary of the file content (visual description for images, text summary for documents).",
    },
    keywords: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of 5-7 relevant keywords or tags describing the content.",
    },
    suggestedFilename: {
      type: Type.STRING,
      description: "A clean, SEO-friendly, professional filename suggestion (including extension).",
    },
    detectedMimeType: {
      type: Type.STRING,
      description: "The detected specific MIME type of the content.",
    },
  },
  required: ["summary", "keywords", "suggestedFilename", "detectedMimeType"],
};

export const analyzeFileWithGemini = async (file: File): Promise<AIAnalysisResult> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const base64Data = await fileToBase64(file);

    // Determine the prompt based on file type roughly
    let promptText = "Analyze this file's metadata and content.";
    if (file.type.startsWith('image/')) {
      promptText = "Analyze this image. Provide a visual description, generate relevant tags, and suggest a descriptive filename.";
    } else if (file.type.startsWith('text/') || file.type === 'application/pdf' || file.type === 'application/json') {
      promptText = "Analyze this document text. Summarize the content, extract keywords, and suggest a filename.";
    } else {
      promptText = "Analyze this file if possible. Suggest a clean filename and keywords based on what you can perceive.";
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: file.type,
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
        responseSchema: ANALYSIS_SCHEMA,
        systemInstruction: "You are a specialized file archivist. Your goal is to analyze files to generate accurate metadata, descriptions, and organized naming conventions.",
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response from AI");
    }

    return JSON.parse(text) as AIAnalysisResult;

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};
