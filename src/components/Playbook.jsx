import React, { useState } from 'react';
import { 
  BookOpen, Clock, Sparkles, Award, Send, 
  ShieldAlert, CheckSquare, Square, ChevronRight, 
  Lightbulb
} from 'lucide-react';
import { PLAYBOOK_SECTIONS } from '../data/playbookData';

export default function Playbook() {
  const [activeSectionId, setActiveSectionId] = useState(PLAYBOOK_SECTIONS[0].id);

  // Professional Outreach Pre-Flight Checklist
  const [checklist, setChecklist] = useState([
    { id: 'c1', text: 'Verified contact name and venture spelling with zero typos', checked: true },
    { id: 'c2', text: 'Subject line follows the [Executive Name x Topic] or [Honorific] format', checked: true },
    { id: 'c3', text: 'Sent from an official company domain with verified email authentication (DKIM/SPF)', checked: true },
    { id: 'c4', text: 'Stated concrete timeline, duration, format (virtual/in-person), and value proposition', checked: false },
    { id: 'c5', text: 'NO heavy 15MB PDF attachments on touchpoint #1 (linked via view-only Drive or offered upon reply)', checked: false },
    { id: 'c6', text: 'Clear call to action with a 10-minute micro-commitment instead of asking for an open-ended meeting', checked: false },
    { id: 'c7', text: 'Calendar reminder set for low-friction Follow-up #1 exactly 3 business days later at 8:45 AM', checked: false },
  ]);

  const toggleChecklist = (id) => {
    setChecklist(prev => prev.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  const completedCount = checklist.filter(c => c.checked).length;
  const activeSection = PLAYBOOK_SECTIONS.find(s => s.id === activeSectionId) || PLAYBOOK_SECTIONS[0];

  return (
    <div className="space-y-8">
      
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-3">
          <BookOpen className="w-3.5 h-3.5" />
          <span>The Executive Outreach Blueprint</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
          The Science of Reaching & Landing Top 1% Leaders
        </h2>
        <p className="text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
          Tactics and behavioral frameworks tested across thousands of cold outreach sequences for summits, podcasts, strategic partnerships, and venture backing.
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Nav (4 cols) */}
        <div className="lg:col-span-4 space-y-2">
          {PLAYBOOK_SECTIONS.map((sec) => {
            const isActive = sec.id === activeSectionId;
            return (
              <button
                key={sec.id}
                onClick={() => setActiveSectionId(sec.id)}
                className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between ${
                  isActive
                    ? 'bg-indigo-600/15 border-indigo-500/40 text-white shadow-md shadow-indigo-500/10'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <div>
                  <h4 className="font-bold text-sm">{sec.title}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{sec.summary}</p>
                </div>
                <ChevronRight className={`w-4 h-4 shrink-0 ${isActive ? 'text-indigo-400' : 'text-slate-600'}`} />
              </button>
            );
          })}

          {/* Checklist Card */}
          <div className="mt-6 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
                <CheckSquare className="w-3.5 h-3.5 text-emerald-400" />
                <span>Pre-Flight Outreach Checklist</span>
              </h4>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                completedCount === checklist.length
                  ? 'bg-emerald-500 text-slate-950 font-black'
                  : 'bg-slate-800 text-slate-300'
              }`}>
                {completedCount} / {checklist.length}
              </span>
            </div>

            <p className="text-[11px] text-slate-400 mb-3">
              Verify these 7 checkpoints before hitting send on high-stakes outreach:
            </p>

            <div className="space-y-2">
              {checklist.map((item) => (
                <div
                  key={item.id}
                  onClick={() => toggleChecklist(item.id)}
                  className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-slate-800/50 cursor-pointer transition-colors"
                >
                  <div className="mt-0.5 text-emerald-400">
                    {item.checked ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4 text-slate-600" />}
                  </div>
                  <span className={`text-xs select-none ${item.checked ? 'text-slate-300 line-through opacity-70' : 'text-slate-200'}`}>
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Detail Pane (8 cols) */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              {activeSection.title}
            </h3>
            <p className="text-xs sm:text-sm text-indigo-300 mt-1">
              {activeSection.summary}
            </p>
          </div>

          <div className="space-y-4">
            {activeSection.rules.map((rule, idx) => (
              <div 
                key={idx}
                className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-4 sm:p-5 hover:border-slate-700 transition-colors"
              >
                <h4 className="font-bold text-slate-100 text-sm flex items-center gap-2 mb-2">
                  <span className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-bold">
                    {idx + 1}
                  </span>
                  <span>{rule.heading}</span>
                </h4>
                <p className="text-xs sm:text-sm text-slate-300 whitespace-pre-line leading-relaxed pl-8">
                  {rule.content}
                </p>
              </div>
            ))}
          </div>

          {/* Executive takeaway */}
          <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
            <div className="text-xs text-indigo-200 leading-relaxed">
              <strong className="text-white block mb-0.5">Core Outreach Principle:</strong>
              High-profile founders and operators receive dozens of cold messages every single day. The single differentiator is <strong>hyper-concise clarity + zero entitlement + clear logistical respect</strong>. Make saying "yes" take fewer than 30 seconds of their cognitive load.
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
