
import React from 'react';
import { StoryConfig, AIMode, AgeGroup, StoryTone, Language } from '../types';
import { AGE_GROUPS, TONES, LANGUAGES, MODELS } from '../constants';
import { Sparkles, BookOpen, Settings2, BrainCircuit } from 'lucide-react';

interface Props {
  onGenerate: (config: StoryConfig) => void;
  isLoading: boolean;
}

const StoryForm: React.FC<Props> = ({ onGenerate, isLoading }) => {
  const [prompt, setPrompt] = React.useState('');
  const [ageGroup, setAgeGroup] = React.useState<AgeGroup>(AGE_GROUPS[1]);
  const [tone, setTone] = React.useState<StoryTone>(TONES[0]);
  const [language, setLanguage] = React.useState<Language>(LANGUAGES[0]);
  const [mode, setMode] = React.useState<AIMode>(AIMode.ASK);
  const [modelName, setModelName] = React.useState(MODELS[0].id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    onGenerate({ prompt, ageGroup, tone, language, mode, modelName });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 max-w-4xl mx-auto space-y-8">
      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
          <BookOpen size={16} />
          Your Story Idea
        </label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., A shy little squirrel who discovers a secret library in the hollow of an old oak tree..."
          className="w-full h-32 px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all resize-none text-lg"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-500 flex items-center gap-2 uppercase tracking-wider">
            <BrainCircuit size={16} />
            AI Brain (Model)
          </label>
          <select
            value={modelName}
            onChange={(e) => setModelName(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all appearance-none cursor-pointer font-medium text-slate-700"
          >
            {MODELS.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-500 flex items-center gap-2">
              Target Age
            </label>
            <select
              value={ageGroup}
              onChange={(e) => setAgeGroup(e.target.value as AgeGroup)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all appearance-none cursor-pointer"
            >
              {AGE_GROUPS.map(age => <option key={age} value={age}>{age}</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-500 flex items-center gap-2">
              Story Tone
            </label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value as StoryTone)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all appearance-none cursor-pointer"
            >
              {TONES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-4">
        <div className="flex bg-slate-100 p-1.5 rounded-2xl w-full md:w-auto">
          <button
            type="button"
            onClick={() => setMode(AIMode.ASK)}
            className={`flex-1 md:flex-none px-6 py-2.5 rounded-xl text-sm font-medium transition-all ${mode === AIMode.ASK ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Ask Mode (Proposal)
          </button>
          <button
            type="button"
            onClick={() => setMode(AIMode.AGENT)}
            className={`flex-1 md:flex-none px-6 py-2.5 rounded-xl text-sm font-medium transition-all ${mode === AIMode.AGENT ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Agent Mode (Full Book)
          </button>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full md:w-auto px-10 py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-bold rounded-2xl shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-3 active:scale-95"
        >
          {isLoading ? (
            <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <Sparkles size={20} />
              Generate Story
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default StoryForm;
