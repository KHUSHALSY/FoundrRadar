import React, { useState } from 'react';
import { BookOpen, CheckSquare, Square, ChevronRight } from 'lucide-react';
import { PLAYBOOK_SECTIONS } from '../data/playbookData';

export default function Playbook() {
  const [activeSectionId, setActiveSectionId] = useState(PLAYBOOK_SECTIONS[0].id);

  const [checklist, setChecklist] = useState([
    { id: 'c1', text: 'Verified contact name and venture spelling with zero typos', checked: true },
    { id: 'c2', text: 'Subject line follows the [Executive Name x Topic] or [Honorific] format', checked: true },
    { id: 'c3', text: 'Sent from an official company domain with verified email authentication (DKIM/SPF)', checked: true },
    { id: 'c4', text: 'Stated concrete timeline, duration, format (virtual/in-person), and value proposition', checked: false },
    { id: 'c5', text: 'NO heavy 15MB PDF attachments on touchpoint #1 (linked via view-only Drive or offered upon reply)', checked: false },
    { id: 'c6', text: 'Clear call to action with a 10-minute micro-commitment instead of an open-ended meeting', checked: false },
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
    <div className="space-y-6 max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="bg-[#111218] border border-[#232634] rounded-xl p-5">
        <h2 className="text-lg font-bold text-white tracking-tight">
          Executive Outreach Playbook
        </h2>
        <p className="text-xs text-slate-400 mt-0.5 max-w-2xl">
          Heuristics and behavioral frameworks tested across hundreds of executive outreach sequences for summits, podcasts, and strategic partnerships.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Nav (4 cols) */}
        <div className="lg:col-span-4 space-y-2">
          {PLAYBOOK_SECTIONS.map((sec) => {
            const isActive = sec.id === activeSectionId;
            return (
              <button
                key={sec.id}
                onClick={() => setActiveSectionId(sec.id)}
                className={`w-full text-left p-3.5 rounded-xl border text-xs transition-colors flex items-center justify-between ${
                  isActive
                    ? 'bg-[#1c1e2a] border-[#2c3042] text-white'
                    : 'bg-[#111218] border-[#232634] text-slate-400 hover:text-slate-200'
                }`}
              >
                <div>
                  <h4 className="font-semibold">{sec.title}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{sec.summary}</p>
                </div>
                <ChevronRight className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-indigo-400' : 'text-slate-600'}`} />
              </button>
            );
          })}

          {/* Checklist */}
          <div className="mt-4 bg-[#111218] border border-[#232634] rounded-xl p-4">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
                Pre-Flight Checklist
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#1c1e2a] text-slate-300">
                {completedCount}/{checklist.length}
              </span>
            </div>

            <div className="space-y-1.5">
              {checklist.map((item) => (
                <div
                  key={item.id}
                  onClick={() => toggleChecklist(item.id)}
                  className="flex items-start gap-2 p-1.5 rounded hover:bg-[#171922] cursor-pointer"
                >
                  <div className="mt-0.5 text-indigo-400">
                    {item.checked ? <CheckSquare className="w-3.5 h-3.5" /> : <Square className="w-3.5 h-3.5 text-slate-600" />}
                  </div>
                  <span className={`text-[11px] select-none ${item.checked ? 'text-slate-500 line-through' : 'text-slate-300'}`}>
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Detail Pane (8 cols) */}
        <div className="lg:col-span-8 bg-[#111218] border border-[#232634] rounded-xl p-6 space-y-5">
          <div>
            <h3 className="text-base font-bold text-white">{activeSection.title}</h3>
            <p className="text-xs text-indigo-300 mt-0.5">{activeSection.summary}</p>
          </div>

          <div className="space-y-3.5">
            {activeSection.rules.map((rule, idx) => (
              <div key={idx} className="bg-[#090a0f] border border-[#1e202b] rounded-lg p-3.5">
                <h4 className="font-semibold text-slate-200 text-xs mb-1">
                  {idx + 1}. {rule.heading}
                </h4>
                <p className="text-xs text-slate-400 whitespace-pre-line leading-relaxed">
                  {rule.content}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
