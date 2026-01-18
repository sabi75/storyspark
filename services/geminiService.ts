
import { GoogleGenAI, Type } from "@google/genai";
import { StoryConfig, StoryProposal, FullBook, AIMode } from "../types";
import { SYSTEM_PROMPT_BASE } from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateStoryProposal = async (config: StoryConfig): Promise<StoryProposal> => {
  const response = await ai.models.generateContent({
    model: config.modelName,
    contents: `Expand this children's story idea into a structured proposal: "${config.prompt}". 
    Target age: ${config.ageGroup}. 
    Tone: ${config.tone}. 
    Language: ${config.language}. 
    Provide character names/descriptions, setting details, a three-act plot outline, and a moral lesson.`,
    config: {
      systemInstruction: SYSTEM_PROMPT_BASE,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          ageGroup: { type: Type.STRING },
          characters: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                description: { type: Type.STRING }
              },
              required: ["name", "description"]
            }
          },
          setting: { type: Type.STRING },
          theme: { type: Type.STRING },
          plotOutline: {
            type: Type.OBJECT,
            properties: {
              beginning: { type: Type.STRING },
              middle: { type: Type.STRING },
              ending: { type: Type.STRING }
            },
            required: ["beginning", "middle", "ending"]
          },
          moral: { type: Type.STRING }
        },
        required: ["title", "ageGroup", "characters", "setting", "theme", "plotOutline", "moral"]
      }
    }
  });

  return JSON.parse(response.text);
};

export const generateFullBook = async (config: StoryConfig): Promise<FullBook> => {
  const response = await ai.models.generateContent({
    model: config.modelName,
    contents: `Write a full children's book based on: "${config.prompt}". 
    Target age: ${config.ageGroup}. 
    Tone: ${config.tone}. 
    Language: ${config.language}. 
    Structure it into exactly 5 chapters. Each chapter should be 150-300 words. 
    Maintain consistent character development and a clear narrative arc.`,
    config: {
      systemInstruction: SYSTEM_PROMPT_BASE,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          summary: { type: Type.STRING },
          chapters: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                chapterNumber: { type: Type.NUMBER },
                title: { type: Type.STRING },
                content: { type: Type.STRING },
                illustrationPlaceholder: { type: Type.STRING, description: "A visual description for an illustrator." }
              },
              required: ["chapterNumber", "title", "content"]
            }
          }
        },
        required: ["title", "summary", "chapters"]
      },
      thinkingConfig: { thinkingBudget: 4000 }
    }
  });

  return JSON.parse(response.text);
};
