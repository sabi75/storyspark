
import React, { useState, useCallback } from 'react';
import { Sparkles, Wand2, History, BookCopy, Library } from 'lucide-react';
import { StoryConfig, StoryProposal, FullBook, AIMode } from './types';
import { generateStoryProposal, generateFullBook } from './services/geminiService';
import StoryForm from './components/StoryForm';
import ProposalViewer from './components/ProposalViewer';
import BookViewer from './components/BookViewer';

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentProposal, setCurrentProposal] = useState<StoryProposal | null>(null);
  const [currentBook, setCurrentBook] = useState<FullBook | null>(null);
  const [config, setConfig] = useState<StoryConfig | null>(null);

  const handleGenerate = async (newConfig: StoryConfig) => {
    setLoading(true);
    setError(null);
    setCurrentProposal(null);
    setCurrentBook(null);
    setConfig(newConfig);

    try {
      if (newConfig.mode === AIMode.ASK) {
        const proposal = await generateStoryProposal(newConfig);
        setCurrentProposal(proposal);
      } else {
        const book = await generateFullBook(newConfig);
        setCurrentBook(book);
      }
    } catch (err: any) {
      console.error(err);
      setError('Failed to generate story. Please try again or refine your prompt.');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveProposal = async () => {
    if (!config) return;
    setLoading(true);
    try {
      const book = await generateFullBook(config);
      setCurrentBook(book);
      setCurrentProposal(null);
    } catch (err) {
      setError('Failed to transition from proposal to book.');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setCurrentProposal(null);
    setCurrentBook(null);
    setConfig(null);
    setError(null);
  };

  return (
    <div className="min-h-screen">
      {/* Navigation / Header */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={reset}
          >
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg group-hover:rotate-12 transition-transform">
              <Sparkles size={24} />
            </div>
            <span className="brand text-2xl font-bold bg-gradient-to-r from-indigo-600 to-violet-500 bg-clip-text text-transparent">
              StorySpark
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <button className="text-slate-500 font-medium hover:text-indigo-600 transition-colors">How it works</button>
            <button className="text-slate-500 font-medium hover:text-indigo-600 transition-colors">Pricing</button>
            <button className="px-6 py-2.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-indigo-600 transition-all shadow-sm">
              My Library
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Intro Section */}
        {!currentProposal && !currentBook && !loading && (
          <div className="text-center mb-16 space-y-4">
            <h1 className="text-5xl md:text-7xl font-bold text-slate-900 max-w-4xl mx-auto leading-tight">
              Bring your child's <span className="text-indigo-600">imagination</span> to life.
            </h1>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto">
              Transform simple ideas into beautiful, multi-chapter children's stories with AI. Perfect for parents, educators, and authors.
            </p>
          </div>
        )}

        {/* Loading State Overlay */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 space-y-6">
            <div className="relative">
              <div className="w-24 h-24 border-8 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
              <Wand2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-indigo-600" size={32} />
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-bold text-slate-800">Sparking new ideas...</h3>
              <p className="text-slate-500">The characters are finding their places in the story.</p>
            </div>
          </div>
        )}

        {/* Errors */}
        {error && (
          <div className="max-w-4xl mx-auto mb-8 bg-red-50 border border-red-100 p-6 rounded-2xl flex items-center gap-4 text-red-700">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center shrink-0">
              <span className="font-bold">!</span>
            </div>
            <p className="font-medium">{error}</p>
            <button 
              onClick={() => setError(null)}
              className="ml-auto underline font-bold"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Main Content Area */}
        <div className="relative">
          {!loading && !currentProposal && !currentBook && (
            <StoryForm onGenerate={handleGenerate} isLoading={loading} />
          )}

          {!loading && currentProposal && (
            <ProposalViewer 
              proposal={currentProposal} 
              onConfirm={handleApproveProposal} 
            />
          )}

          {!loading && currentBook && (
            <BookViewer book={currentBook} />
          )}
        </div>

        {/* Action Bar (When result is shown) */}
        {(currentProposal || currentBook) && !loading && (
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40">
            <button
              onClick={reset}
              className="bg-slate-900 text-white px-8 py-4 rounded-full shadow-2xl flex items-center gap-2 font-bold hover:scale-105 active:scale-95 transition-all"
            >
              <Library size={20} />
              Start a New Story
            </button>
          </div>
        )}
      </main>

      {/* Footer Decoration */}
      <div className="mt-20 border-t border-slate-100 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 text-slate-400 font-medium">
            <Sparkles size={16} />
            Built for creators and families
          </div>
          <div className="flex gap-8 text-slate-400 font-medium text-sm">
            <a href="#" className="hover:text-indigo-600">Privacy Policy</a>
            <a href="#" className="hover:text-indigo-600">Terms of Service</a>
            <a href="#" className="hover:text-indigo-600">Contact Support</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
