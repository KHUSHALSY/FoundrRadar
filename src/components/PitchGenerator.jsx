import React, { useState, useEffect } from 'react';
import { 
  PenTool, Copy, Check, Sparkles, Send, Mail, 
  MessageSquare, Users, Phone, Calendar, 
  Building2, Globe
} from 'lucide-react';
import { OUTREACH_TEMPLATES } from '../data/outreachTemplates';

export default function PitchGenerator({ selectedFounder, pipeline = [] }) {
  // Initiative & Organization State
  const [organizationName, setOrganizationName] = useState('Global Tech Summit');
  const [initiativeName, setInitiativeName] = useState('Executive Innovation Conclave 2026');
  const [topic, setTopic] = useState('Scaling AI Infrastructure & Category Moats');
  const [eventDate, setEventDate] = useState('October 24, 2026');
  const [eventMode, setEventMode] = useState('In-person Executive Ballroom & Global Broadcast');
  const [reach, setReach] = useState('2,500+ attendees including 400+ founders and senior executives');

  // Contact details
  const [founderName, setFounderName] = useState('Aman Gupta');
  const [company, setCompany] = useState('boAt Lifestyle');

  // Sender details
  const [senderName, setSenderName] = useState('Aarav Mehta');
  const [senderTitle, setSenderTitle] = useState('Head of Partnerships & Speaker Relations');
  const [senderPhone, setSenderPhone] = useState('+1 (555) 234-5678');
  const [senderEmail, setSenderEmail] = useState('alliances@globalsummit.io');
  const [website, setWebsite] = useState('https://globalsummit.io');

  // Selected Template
  const [activeTemplateId, setActiveTemplateId] = useState('linkedin-connect');
  const [copiedKey, setCopiedKey] = useState(null);

  // Sync when selectedFounder prop changes
  useEffect(() => {
    if (selectedFounder) {
      if (selectedFounder.name) setFounderName(selectedFounder.name);
      if (selectedFounder.company) setCompany(selectedFounder.company);
      if (selectedFounder.speakerTopics && selectedFounder.speakerTopics[0]) {
        setTopic(selectedFounder.speakerTopics[0]);
      } else if (selectedFounder.sector) {
        setTopic(selectedFounder.sector);
      }
    }
  }, [selectedFounder]);

  const currentTemplate = OUTREACH_TEMPLATES.find(t => t.id === activeTemplateId) || OUTREACH_TEMPLATES[0];

  const generatedContent = currentTemplate.generate({
    organizationName,
    initiativeName,
    eventDate,
    eventMode,
    reach,
    topic,
    founderName,
    company,
    senderName,
    senderTitle,
    senderPhone,
    senderEmail,
    website
  });

  const isEmailTemplate = typeof generatedContent === 'object' && generatedContent.subject;

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>High-Conversion Outreach Generator</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            Message Crafter & Pitch Templates
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Generate tailored LinkedIn connect notes, executive speaker invites, B2B collaboration emails, and investor teasers in seconds.
          </p>
        </div>

        {/* Load from Pipeline */}
        {pipeline.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Load from CRM:</span>
            <select
              onChange={(e) => {
                const found = pipeline.find(p => p.id === e.target.value);
                if (found) {
                  setFounderName(found.name);
                  setCompany(found.company);
                  if (found.sector) setTopic(found.sector);
                }
              }}
              className="px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 text-xs focus:ring-1 focus:ring-indigo-500"
            >
              <option value="">Select a saved prospect...</option>
              {pipeline.map(p => (
                <option key={p.id} value={p.id}>{p.name} ({p.company})</option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Form Inputs (5 cols) */}
        <div className="lg:col-span-5 space-y-4 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl">
          <h3 className="font-bold text-white text-sm flex items-center gap-2 border-b border-slate-800 pb-3">
            <Building2 className="w-4 h-4 text-indigo-400" />
            <span>Outreach Context & Variables</span>
          </h3>

          <div className="space-y-3.5 text-xs">
            
            {/* Target Contact */}
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="text-slate-400 font-semibold block mb-1">Target Contact Name</label>
                <input
                  type="text"
                  value={founderName}
                  onChange={(e) => setFounderName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="text-slate-400 font-semibold block mb-1">Target Venture / Company</label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white"
                />
              </div>
            </div>

            {/* Organization & Initiative */}
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="text-slate-400 font-semibold block mb-1">Your Organization / Brand</label>
                <input
                  type="text"
                  value={organizationName}
                  onChange={(e) => setOrganizationName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="text-slate-400 font-semibold block mb-1">Initiative / Event Name</label>
                <input
                  type="text"
                  value={initiativeName}
                  onChange={(e) => setInitiativeName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white"
                />
              </div>
            </div>

            {/* Topic */}
            <div>
              <label className="text-slate-400 font-semibold block mb-1">Discussion Focus / Pitch Topic</label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Scaling AI Infrastructure"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white"
              />
            </div>

            {/* Date & Mode */}
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="text-slate-400 font-semibold block mb-1">Target Date / Timeline</label>
                <input
                  type="text"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="text-slate-400 font-semibold block mb-1">Format / Venue</label>
                <input
                  type="text"
                  value={eventMode}
                  onChange={(e) => setEventMode(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white"
                />
              </div>
            </div>

            {/* Reach */}
            <div>
              <label className="text-slate-400 font-semibold block mb-1">Audience Reach / Impressions</label>
              <input
                type="text"
                value={reach}
                onChange={(e) => setReach(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white"
              />
            </div>

            {/* Sender Signature */}
            <div className="pt-2 border-t border-slate-800">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Sender Signature Details:
              </span>
              <div className="grid grid-cols-2 gap-2 mb-2">
                <input
                  type="text"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  placeholder="Your Full Name"
                  className="px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded text-white text-[11px]"
                />
                <input
                  type="text"
                  value={senderTitle}
                  onChange={(e) => setSenderTitle(e.target.value)}
                  placeholder="Title (e.g. Head of Growth)"
                  className="px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded text-white text-[11px]"
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="text"
                  value={senderPhone}
                  onChange={(e) => setSenderPhone(e.target.value)}
                  placeholder="Direct Phone"
                  className="px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded text-white text-[11px]"
                />
                <input
                  type="email"
                  value={senderEmail}
                  onChange={(e) => setSenderEmail(e.target.value)}
                  placeholder="Official Email"
                  className="px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded text-white text-[11px]"
                />
                <input
                  type="text"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="Website"
                  className="px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded text-white text-[11px]"
                />
              </div>
            </div>

          </div>
        </div>

        {/* Right Column: Templates & Preview (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Template Selection Pills */}
          <div className="flex flex-wrap gap-1.5 bg-slate-900 border border-slate-800 p-2 rounded-xl">
            {OUTREACH_TEMPLATES.map((tmpl) => {
              const isActive = tmpl.id === activeTemplateId;
              return (
                <button
                  key={tmpl.id}
                  onClick={() => setActiveTemplateId(tmpl.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <span>{tmpl.name}</span>
                </button>
              );
            })}
          </div>

          {/* Template Card Preview */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center justify-between gap-3 border-b border-slate-800 pb-3 mb-4">
              <div>
                <h3 className="font-bold text-white text-base flex items-center gap-2">
                  <span>{currentTemplate.name}</span>
                  <span className="text-[10px] px-2 py-0.5 bg-indigo-500/15 text-indigo-300 rounded font-semibold border border-indigo-500/20">
                    {currentTemplate.badge}
                  </span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">{currentTemplate.description}</p>
              </div>

              {/* Character Counter for LinkedIn */}
              {activeTemplateId === 'linkedin-connect' && (
                <div className="text-right shrink-0">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-md border ${
                    generatedContent.length <= 300 
                      ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                      : 'bg-red-500/20 text-red-300 border-red-500/40'
                  }`}>
                    {generatedContent.length} / 300 chars
                  </span>
                </div>
              )}
            </div>

            {/* Formatted Output */}
            {isEmailTemplate ? (
              <div className="space-y-4">
                {/* Subject Line */}
                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    <span>Subject Line:</span>
                    <button
                      onClick={() => copyToClipboard(generatedContent.subject, 'subject')}
                      className="text-indigo-400 hover:text-indigo-300 lowercase text-xs flex items-center gap-1 font-semibold"
                    >
                      {copiedKey === 'subject' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedKey === 'subject' ? 'Copied Subject!' : 'Copy Subject'}</span>
                    </button>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-200 font-mono select-all">
                    {generatedContent.subject}
                  </div>
                </div>

                {/* Email Body */}
                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    <span>Email Body:</span>
                    <button
                      onClick={() => copyToClipboard(generatedContent.body, 'body')}
                      className="text-indigo-400 hover:text-indigo-300 lowercase text-xs flex items-center gap-1 font-semibold"
                    >
                      {copiedKey === 'body' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedKey === 'body' ? 'Copied Body!' : 'Copy Email Body'}</span>
                    </button>
                  </div>
                  <pre className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-200 font-sans whitespace-pre-wrap leading-relaxed select-all max-h-96 overflow-y-auto">
                    {generatedContent.body}
                  </pre>
                </div>

                {/* Bottom Master Copy */}
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => copyToClipboard(`Subject: ${generatedContent.subject}\n\n${generatedContent.body}`, 'all')}
                    className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/25 transition-all"
                  >
                    {copiedKey === 'all' ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedKey === 'all' ? 'Entire Email Copied!' : 'Copy Entire Email & Subject'}</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Single String Content */
              <div className="space-y-4">
                <pre className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs sm:text-sm text-slate-200 font-sans whitespace-pre-wrap leading-relaxed select-all">
                  {generatedContent}
                </pre>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-slate-500">
                    Click to select text or use copy button
                  </span>
                  <button
                    onClick={() => copyToClipboard(generatedContent, 'single')}
                    className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/25 transition-all"
                  >
                    {copiedKey === 'single' ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedKey === 'single' ? 'Copied to Clipboard!' : 'Copy Message'}</span>
                  </button>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}
