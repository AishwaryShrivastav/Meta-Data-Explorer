import { GoogleGenAI, Type, Schema } from "@google/genai";
import { fileToBase64 } from "../utils/fileUtils";
import { AIAnalysisResult } from "../types";

const ANALYSIS_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    summary: {
      type: Type.STRING,
      description: "A concise summary of the file content (visual description for images/video, text summary for documents).",
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
    technicalDetails: {
      type: Type.OBJECT,
      description: "Key-value pairs of technical details extracted from the file (e.g., {'Resolution': '1920x1080', 'Duration': '2:30', 'Camera': 'Sony A7', 'Author': 'Name'}).",
    },
  },
  required: ["summary", "keywords", "suggestedFilename", "detectedMimeType", "technicalDetails"],
};

export const analyzeFileWithGemini = async (file: File): Promise<AIAnalysisResult> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Check file size for base64 limits (approx 10MB limit for safe direct API calls via browser)
    if (file.size > 10 * 1024 * 1024) {
      throw new Error("File is too large for AI analysis in this demo (Max 10MB).");
    }

    const base64Data = await fileToBase64(file);

    // Determine the prompt based on file type
    let promptText = "Analyze this file's metadata and content.";
    
    if (file.type.startsWith('image/')) {
      promptText = "Analyze this image. Provide a visual description, generate relevant tags, extract any visible EXIF data (camera, location) as technical details, and suggest a filename.";
    } else if (file.type.startsWith('video/')) {
      promptText = "Analyze this video clip. Describe the action/scene, extract duration/resolution if possible, keywords, and suggest a filename.";
    } else if (file.type.startsWith('audio/')) {
      promptText = "Analyze this audio file. Describe the sound/speech, identifying speakers or music genre if applicable, and suggest a filename.";
    } else if (file.type.startsWith('text/') || file.type === 'application/pdf' || file.type === 'application/json') {
      promptText = "Analyze this document text. Summarize the content, extract author/date metadata if present in text, and suggest a filename.";
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
        systemInstruction: "You are a specialized file archivist. Your goal is to analyze files to generate accurate metadata, descriptions, organized naming conventions, and extract technical specifications.",
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