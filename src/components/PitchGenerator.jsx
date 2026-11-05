import React, { useState, useEffect } from 'react';
import { PenTool, Copy, Check, Mail, Building2, Globe } from 'lucide-react';
import { OUTREACH_TEMPLATES } from '../data/outreachTemplates';

export default function PitchGenerator({ selectedFounder, pipeline = [] }) {
  const [organizationName, setOrganizationName] = useState('Global Tech Summit');
  const [initiativeName, setInitiativeName] = useState('Executive Innovation Conclave 2026');
  const [topic, setTopic] = useState('Scaling AI Infrastructure & Category Moats');
  const [eventDate, setEventDate] = useState('October 24, 2026');
  const [eventMode, setEventMode] = useState('In-person Executive Ballroom & Global Broadcast');
  const [reach, setReach] = useState('2,500+ attendees including 400+ founders and senior executives');

  const [founderName, setFounderName] = useState('Aman Gupta');
  const [company, setCompany] = useState('boAt Lifestyle');

  const [senderName, setSenderName] = useState('Aarav Mehta');
  const [senderTitle, setSenderTitle] = useState('Head of Partnerships & Speaker Relations');
  const [senderPhone, setSenderPhone] = useState('+1 (555) 234-5678');
  const [senderEmail, setSenderEmail] = useState('alliances@globalsummit.io');
  const [website, setWebsite] = useState('https://globalsummit.io');

  const [activeTemplateId, setActiveTemplateId] = useState('linkedin-connect');
  const [copiedKey, setCopiedKey] = useState(null);

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
    <div className="space-y-6 max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="bg-[#111218] border border-[#232634] rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight">
            High-Conversion Message Crafter
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Craft targeted LinkedIn notes, formal speaker invitations, partnership intros, and investor teasers.
          </p>
        </div>

        {pipeline.length > 0 && (
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Prefill from CRM:</span>
            <select
              onChange={(e) => {
                const found = pipeline.find(p => p.id === e.target.value);
                if (found) {
                  setFounderName(found.name);
                  setCompany(found.company);
                  if (found.sector) setTopic(found.sector);
                }
              }}
              className="px-2.5 py-1.5 bg-[#090a0f] border border-[#272a38] rounded-lg text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
            >
              <option value="">Choose contact...</option>
              {pipeline.map(p => (
                <option key={p.id} value={p.id}>{p.name} ({p.company})</option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Form (5 cols) */}
        <div className="lg:col-span-5 bg-[#111218] border border-[#232634] rounded-xl p-5 space-y-3.5 text-xs">
          <h3 className="font-semibold text-white text-xs uppercase tracking-wider border-b border-[#1c1e28] pb-2.5">
            Context & Sender Variables
          </h3>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="text-slate-400 block mb-1">Target Contact</label>
              <input
                type="text"
                value={founderName}
                onChange={(e) => setFounderName(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-[#090a0f] border border-[#272a38] rounded-lg text-white"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Target Company</label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-[#090a0f] border border-[#272a38] rounded-lg text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="text-slate-400 block mb-1">Your Organization</label>
              <input
                type="text"
                value={organizationName}
                onChange={(e) => setOrganizationName(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-[#090a0f] border border-[#272a38] rounded-lg text-white"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Initiative Name</label>
              <input
                type="text"
                value={initiativeName}
                onChange={(e) => setInitiativeName(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-[#090a0f] border border-[#272a38] rounded-lg text-white"
              />
            </div>
          </div>

          <div>
            <label className="text-slate-400 block mb-1">Pitch / Discussion Focus</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-[#090a0f] border border-[#272a38] rounded-lg text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="text-slate-400 block mb-1">Date / Timeline</label>
              <input
                type="text"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-[#090a0f] border border-[#272a38] rounded-lg text-white"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Format / Venue</label>
              <input
                type="text"
                value={eventMode}
                onChange={(e) => setEventMode(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-[#090a0f] border border-[#272a38] rounded-lg text-white"
              />
            </div>
          </div>

          <div className="pt-2 border-t border-[#1c1e28]">
            <span className="text-[10px] uppercase font-bold text-slate-500 block mb-2">Sender Signature:</span>
            <div className="grid grid-cols-2 gap-2 mb-2">
              <input
                type="text"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="Name"
                className="px-2 py-1.5 bg-[#090a0f] border border-[#272a38] rounded text-white"
              />
              <input
                type="text"
                value={senderTitle}
                onChange={(e) => setSenderTitle(e.target.value)}
                placeholder="Title"
                className="px-2 py-1.5 bg-[#090a0f] border border-[#272a38] rounded text-white"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="email"
                value={senderEmail}
                onChange={(e) => setSenderEmail(e.target.value)}
                placeholder="Email"
                className="px-2 py-1.5 bg-[#090a0f] border border-[#272a38] rounded text-white"
              />
              <input
                type="text"
                value={senderPhone}
                onChange={(e) => setSenderPhone(e.target.value)}
                placeholder="Phone"
                className="px-2 py-1.5 bg-[#090a0f] border border-[#272a38] rounded text-white"
              />
            </div>
          </div>
        </div>

        {/* Right Output (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          
          {/* Template Tabs */}
          <div className="flex flex-wrap gap-1.5 bg-[#111218] border border-[#232634] p-1.5 rounded-xl">
            {OUTREACH_TEMPLATES.map((tmpl) => {
              const isActive = tmpl.id === activeTemplateId;
              return (
                <button
                  key={tmpl.id}
                  onClick={() => setActiveTemplateId(tmpl.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-400 hover:text-white hover:bg-[#1a1c26]'
                  }`}
                >
                  {tmpl.name}
                </button>
              );
            })}
          </div>

          {/* Preview Box */}
          <div className="bg-[#111218] border border-[#232634] rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[#1c1e28] pb-3">
              <div>
                <h4 className="font-bold text-white text-sm">{currentTemplate.name}</h4>
                <p className="text-xs text-slate-400 mt-0.5">{currentTemplate.description}</p>
              </div>

              {activeTemplateId === 'linkedin-connect' && (
                <span className={`text-xs font-mono px-2 py-0.5 rounded border ${
                  generatedContent.length <= 300 
                    ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10'
                    : 'text-red-400 border-red-500/30 bg-red-500/10'
                }`}>
                  {generatedContent.length}/300 chars
                </span>
              )}
            </div>

            {isEmailTemplate ? (
              <div className="space-y-3.5">
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span>Subject Line:</span>
                    <button
                      onClick={() => copyToClipboard(generatedContent.subject, 'subj')}
                      className="text-indigo-400 hover:text-indigo-300 text-xs flex items-center gap-1"
                    >
                      {copiedKey === 'subj' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedKey === 'subj' ? 'Copied' : 'Copy Subject'}</span>
                    </button>
                  </div>
                  <div className="p-2.5 bg-[#090a0f] rounded-lg border border-[#272a38] text-xs text-white font-mono select-all">
                    {generatedContent.subject}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span>Email Body:</span>
                    <button
                      onClick={() => copyToClipboard(generatedContent.body, 'body')}
                      className="text-indigo-400 hover:text-indigo-300 text-xs flex items-center gap-1"
                    >
                      {copiedKey === 'body' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedKey === 'body' ? 'Copied' : 'Copy Body'}</span>
                    </button>
                  </div>
                  <pre className="p-3.5 bg-[#090a0f] rounded-lg border border-[#272a38] text-xs text-slate-200 font-sans whitespace-pre-wrap leading-relaxed select-all max-h-80 overflow-y-auto">
                    {generatedContent.body}
                  </pre>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => copyToClipboard(`Subject: ${generatedContent.subject}\n\n${generatedContent.body}`, 'all')}
                    className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold"
                  >
                    {copiedKey === 'all' ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'all' ? 'Entire Pitch Copied!' : 'Copy Entire Email & Subject'}</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <pre className="p-3.5 bg-[#090a0f] rounded-lg border border-[#272a38] text-xs text-slate-200 font-sans whitespace-pre-wrap leading-relaxed select-all">
                  {generatedContent}
                </pre>
                <div className="flex justify-end">
                  <button
                    onClick={() => copyToClipboard(generatedContent, 'single')}
                    className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold"
                  >
                    {copiedKey === 'single' ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'single' ? 'Copied!' : 'Copy Message'}</span>
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
