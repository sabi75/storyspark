
import { AgeGroup, StoryTone, Language } from './types';

export const AGE_GROUPS: AgeGroup[] = ['0-3 years', '4-6 years', '7-9 years', '10-12 years'];
export const TONES: StoryTone[] = ['Magical', 'Educational', 'Adventurous', 'Calming'];
export const LANGUAGES: Language[] = ['English', 'Spanish', 'French', 'German', 'Chinese'];

export const MODELS = [
  { id: 'gemini-3-flash-preview', name: 'Gemini 3 Flash (Fast & Modern)' },
  { id: 'gemini-3-pro-preview', name: 'Gemini 3 Pro (Deep Reasoning)' },
  { id: 'gemini-flash-latest', name: 'Gemini Flash (Stable)' },
  { id: 'gemini-flash-lite-latest', name: 'Gemini Flash Lite (Efficient)' },
  { id: 'gemini-2.5-flash-preview-09-2025', name: 'Gemini 2.5 Flash (Latest)' },
  { id: 'gemini-3-pro-image-preview', name: 'Gemini 3 Pro Image (Visual Focus)' },
  { id: 'gemini-2.5-flash-native-audio-preview-12-2025', name: 'Gemini 2.5 Native Audio' },
  { id: 'gemini-2.5-flash-preview-tts', name: 'Gemini TTS Optimized' },
  { id: 'gemini-3-pro-preview-012025', name: 'Gemini 3 Pro v01.25' },
  { id: 'gemini-3-flash-preview-experimental', name: 'Gemini 3 Flash (Experimental)' }
];

export const SYSTEM_PROMPT_BASE = `You are an expert children's story writer and educator. 
Your goal is to create high-quality, age-appropriate, and safe content. 
Always ensure a positive tone and a constructive ending. 
The language used should be strictly tailored to the target age group.`;
