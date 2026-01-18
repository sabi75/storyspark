
import React, { useState, useEffect, useCallback } from 'react';
import { Sparkles, Wand2, History, BookCopy, Library, X, Trash2, Clock } from 'lucide-react';
import { StoryConfig, StoryProposal, FullBook, AIMode, HistoryItem } from './types';
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
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Load history from local storage
  useEffect(() => {
    const savedHistory = localStorage.getItem('story_spark_history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Failed to parse history', e);
      }
    }
  }, []);

  // Save history to local storage
  useEffect(() => {
    localStorage.setItem('story_spark_history', JSON.stringify(history));
  }, [history]);

  const addToHistory = (config: StoryConfig, data: StoryProposal | FullBook) => {
    const newItem: HistoryItem = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      config,
      data
    };
    setHistory(prev => [newItem, ...prev]);
  };

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
        addToHistory(newConfig, proposal);
      } else {
        const book = await generateFullBook(newConfig);
        setCurrentBook(book);
        addToHistory(newConfig, book);
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
      addToHistory(config, book);
    } catch (err) {
      setError('Failed to transition from proposal to book.');
    } finally {
      setLoading(false);
    }
  };

  const loadFromHistory = (item: HistoryItem) => {
    setConfig(item.config);
    if ('chapters' in item.data) {
      setCurrentBook(item.data as FullBook);
      setCurrentProposal(null);
    } else {
      setCurrentProposal(item.data as StoryProposal);
      setCurrentBook(null);
    }
    setIsSidebarOpen(false);
  };

  const deleteFromHistory = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setHistory(prev => prev.filter(item => item.id !== id));
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
      <nav className="no-print sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
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
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="px-6 py-2.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-indigo-600 transition-all shadow-sm flex items-center gap-2"
            >
              <Library size={18} />
              My Library
            </button>
          </div>
        </div>
      </nav>

      {/* History Sidebar */}
      <div className={`fixed inset-0 z-[60] transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />
        <div className={`absolute right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl transition-transform duration-300 flex flex-col ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <History className="text-indigo-600" size={24} />
              Story Library
            </h2>
            <button onClick={() => setIsSidebarOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <X size={24} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {history.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                  <BookCopy size={32} />
                </div>
                <p className="text-slate-500 font-medium">Your library is empty.</p>
                <p className="text-slate-400 text-sm">Generate your first story to see it here!</p>
              </div>
            ) : (
              history.map((item) => (
                <div 
                  key={item.id}
                  onClick={() => loadFromHistory(item)}
                  className="group relative p-4 bg-slate-50 border border-slate-200 rounded-2xl hover:border-indigo-400 hover:bg-white transition-all cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-slate-800 pr-8">
                      {item.data.title || 'Untitled Story'}
                    </h4>
                    <button 
                      onClick={(e) => deleteFromHistory(item.id, e)}
                      className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all absolute top-3 right-3"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter ${'chapters' in item.data ? 'bg-indigo-100 text-indigo-700' : 'bg-emerald-100 text-emerald-700'}`}>
                      {'chapters' in item.data ? 'Full Book' : 'Proposal'}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-200 text-slate-600 rounded-full uppercase tracking-tighter">
                      {item.config.ageGroup}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-slate-400">
                    <Clock size={12} />
                    {new Date(item.timestamp).toLocaleDateString()} at {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Intro Section */}
        {!currentProposal && !currentBook && !loading && (
          <div className="no-print text-center mb-16 space-y-4">
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
            <div className="no-print">
              <StoryForm onGenerate={handleGenerate} isLoading={loading} />
            </div>
          )}

          {!loading && currentProposal && (
            <div className="no-print">
              <ProposalViewer 
                proposal={currentProposal} 
                onConfirm={handleApproveProposal} 
              />
            </div>
          )}

          {!loading && currentBook && (
            <BookViewer book={currentBook} />
          )}
        </div>

        {/* Action Bar (When result is shown) */}
        {(currentProposal || currentBook) && !loading && (
          <div className="no-print fixed bottom-8 left-1/2 -translate-x-1/2 z-40">
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
      <footer className="no-print mt-20 border-t border-slate-100 py-12 px-6">
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
      </footer>
    </div>
  );
};

export default App;
