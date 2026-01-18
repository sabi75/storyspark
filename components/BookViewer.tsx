
import React from 'react';
import { FullBook, Feedback } from '../types';
import { Download, Share2, Star, Printer, ChevronRight, ChevronLeft } from 'lucide-react';

interface Props {
  book: FullBook;
}

const BookViewer: React.FC<Props> = ({ book }) => {
  const [activeChapter, setActiveChapter] = React.useState(0);
  const [rating, setRating] = React.useState(0);
  const [comment, setComment] = React.useState('');
  const [submitted, setSubmitted] = React.useState(false);

  const handleExport = () => {
    window.print();
  };

  const handleFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // In a real SaaS, this would save to a database
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100 flex flex-col md:flex-row min-h-[600px]">
        {/* Navigation Sidebar */}
        <aside className="w-full md:w-64 bg-slate-50 border-r border-slate-100 p-8 flex flex-col">
          <div className="mb-8">
            <h3 className="text-xs uppercase font-bold text-slate-400 tracking-widest mb-4">Chapters</h3>
            <nav className="space-y-2">
              {book.chapters.map((ch, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveChapter(idx)}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all flex justify-between items-center ${activeChapter === idx ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-slate-600 hover:bg-white hover:text-indigo-600'}`}
                >
                  Chapter {ch.chapterNumber}
                  {activeChapter === idx && <ChevronRight size={14} />}
                </button>
              ))}
            </nav>
          </div>
          
          <div className="mt-auto pt-8 border-t border-slate-200 space-y-4">
            <button
              onClick={handleExport}
              className="w-full flex items-center gap-3 px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-100 transition-all shadow-sm"
            >
              <Download size={18} /> Export PDF
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-100 transition-all shadow-sm">
              <Printer size={18} /> Print Story
            </button>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 p-8 md:p-12 overflow-y-auto">
          <header className="mb-10 text-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">{book.title}</h2>
            <div className="h-1.5 w-24 bg-indigo-500 mx-auto rounded-full"></div>
          </header>

          <article className="prose prose-slate max-w-none">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-4xl font-bold text-indigo-100 select-none">
                0{book.chapters[activeChapter].chapterNumber}
              </span>
              <h3 className="text-2xl font-bold text-slate-800 m-0">
                {book.chapters[activeChapter].title}
              </h3>
            </div>
            
            <p className="text-lg leading-relaxed text-slate-700 whitespace-pre-wrap font-serif first-letter:text-5xl first-letter:font-bold first-letter:mr-3 first-letter:float-left first-letter:text-indigo-600">
              {book.chapters[activeChapter].content}
            </p>

            {book.chapters[activeChapter].illustrationPlaceholder && (
              <div className="mt-12 p-6 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50 text-center">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Illustration Suggestion</span>
                <p className="text-sm text-slate-500 italic">
                  "{book.chapters[activeChapter].illustrationPlaceholder}"
                </p>
              </div>
            )}
          </article>

          <div className="mt-16 flex justify-between items-center pt-8 border-t border-slate-100">
            <button
              disabled={activeChapter === 0}
              onClick={() => setActiveChapter(prev => prev - 1)}
              className="flex items-center gap-2 px-6 py-2 rounded-full font-bold text-slate-500 hover:text-indigo-600 disabled:opacity-30"
            >
              <ChevronLeft size={20} /> Previous
            </button>
            <button
              disabled={activeChapter === book.chapters.length - 1}
              onClick={() => setActiveChapter(prev => prev + 1)}
              className="flex items-center gap-2 px-6 py-2 rounded-full font-bold text-indigo-600 hover:bg-indigo-50 disabled:opacity-30"
            >
              Next <ChevronRight size={20} />
            </button>
          </div>
        </main>
      </div>

      {/* Feedback Section */}
      <section className="mt-12 bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
        <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
          <Star className="text-amber-400 fill-amber-400" size={24} />
          Your Thoughts on this Story?
        </h3>
        
        {submitted ? (
          <div className="bg-emerald-50 text-emerald-700 p-4 rounded-xl font-medium text-center">
            Thank you for your feedback! We've saved it to improve future stories.
          </div>
        ) : (
          <form onSubmit={handleFeedback} className="space-y-4">
            <div className="flex gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setRating(s)}
                  className={`p-2 transition-all ${rating >= s ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`}
                >
                  <Star size={32} fill={rating >= s ? 'currentColor' : 'none'} />
                </button>
              ))}
            </div>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Any suggestions or what did you love most?"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all resize-none h-24"
            />
            <button
              type="submit"
              disabled={rating === 0}
              className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all disabled:opacity-50"
            >
              Submit Review
            </button>
          </form>
        )}
      </section>
    </div>
  );
};

export default BookViewer;
