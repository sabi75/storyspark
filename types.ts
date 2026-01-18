
export enum AIMode {
  ASK = 'ASK',
  AGENT = 'AGENT'
}

export type AgeGroup = '0-3 years' | '4-6 years' | '7-9 years' | '10-12 years';
export type StoryTone = 'Magical' | 'Educational' | 'Adventurous' | 'Calming';
export type Language = 'English' | 'Spanish' | 'French' | 'German' | 'Chinese';

export interface StoryConfig {
  prompt: string;
  ageGroup: AgeGroup;
  tone: StoryTone;
  language: Language;
  mode: AIMode;
  modelName: string;
}

export interface Character {
  name: string;
  description: string;
}

export interface StoryProposal {
  title: string;
  ageGroup: string;
  characters: Character[];
  setting: string;
  theme: string;
  plotOutline: {
    beginning: string;
    middle: string;
    ending: string;
  };
  moral: string;
}

export interface Chapter {
  chapterNumber: number;
  title: string;
  content: string;
  illustrationPlaceholder?: string;
}

export interface FullBook {
  title: string;
  chapters: Chapter[];
  summary: string;
}

export interface Feedback {
  rating: number;
  comment: string;
  timestamp: number;
}
