
import React from 'react';
import { StoryProposal } from '../types';
import { Edit3, User, MapPin, Target, Lightbulb, CheckCircle } from 'lucide-react';

interface Props {
  proposal: StoryProposal;
  onConfirm: () => void;
}

const ProposalViewer: React.FC<Props> = ({ proposal, onConfirm }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-4xl font-bold text-slate-900 mb-2">{proposal.title}</h2>
          <p className="text-indigo-600 font-medium bg-indigo-50 px-3 py-1 rounded-full inline-block">
            {proposal.ageGroup} Proposal
          </p>
        </div>
        <button
          onClick={onConfirm}
          className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg flex items-center gap-2 transition-all active:scale-95"
        >
          <CheckCircle size={20} />
          Approve Proposal
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-indigo-600 font-bold mb-2">
            <User size={20} />
            Characters
          </div>
          <div className="space-y-4">
            {proposal.characters.map((char, idx) => (
              <div key={idx} className="border-l-4 border-indigo-100 pl-4 py-1">
                <p className="font-bold text-slate-800">{char.name}</p>
                <p className="text-slate-600 text-sm">{char.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-indigo-600 font-bold mb-2">
            <MapPin size={20} />
            Setting & Theme
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-1">Setting</h4>
            <p className="text-slate-700 leading-relaxed">{proposal.setting}</p>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-1">Theme</h4>
            <p className="text-slate-700 leading-relaxed">{proposal.theme}</p>
          </div>
        </section>
      </div>

      <section className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
        <div className="flex items-center gap-2 text-indigo-600 font-bold">
          <Target size={20} />
          Plot Outline
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-2">
            <span className="text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded font-bold uppercase tracking-tighter">Beginning</span>
            <p className="text-slate-700 text-sm leading-relaxed">{proposal.plotOutline.beginning}</p>
          </div>
          <div className="space-y-2">
            <span className="text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded font-bold uppercase tracking-tighter">Middle</span>
            <p className="text-slate-700 text-sm leading-relaxed">{proposal.plotOutline.middle}</p>
          </div>
          <div className="space-y-2">
            <span className="text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded font-bold uppercase tracking-tighter">Ending</span>
            <p className="text-slate-700 text-sm leading-relaxed">{proposal.plotOutline.ending}</p>
          </div>
        </div>
      </section>

      <div className="bg-amber-50 border-l-8 border-amber-400 p-6 rounded-2xl flex gap-4 items-start">
        <Lightbulb className="text-amber-500 shrink-0" size={28} />
        <div>
          <h4 className="font-bold text-amber-900 mb-1">The Moral or Takeaway</h4>
          <p className="text-amber-800 leading-relaxed italic">"{proposal.moral}"</p>
        </div>
      </div>
    </div>
  );
};

export default ProposalViewer;
