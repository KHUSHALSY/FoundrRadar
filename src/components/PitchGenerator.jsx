import React, { useState, useEffect } from 'react';
import { PenTool, Copy, Check, Mail, Building2, Globe, Sparkles, Loader2, ArrowUpRight } from 'lucide-react';
import { OUTREACH_TEMPLATES } from '../data/outreachTemplates';
import { getSafeLinkedInUrl } from '../utils/urlHelper';
import { 
  generatePersonalizedPitchWithAI, 
  getStoredGeminiKey, 
  getStoredGeminiModel 
} from '../services/geminiService';

export default function PitchGenerator({ 
  selectedFounder, 
  pipeline = [],
  hasGeminiKey = false,
  onOpenGeminiModal
}) {
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

  // AI pitch state
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiCustomPitch, setAiCustomPitch] = useState('');
  const [aiPitchError, setAiPitchError] = useState('');
  const [viewMode, setViewMode] = useState('template'); // 'template' | 'ai'

  useEffect(() => {
    if (selectedFounder) {
      if (selectedFounder.name) setFounderName(selectedFounder.name);
      if (selectedFounder.company) setCompany(selectedFounder.company);
      if (selectedFounder.speakerTopics && selectedFounder.speakerTopics[0]) {
        setTopic(selectedFounder.speakerTopics[0]);
      } else if (selectedFounder.sector) {
        setTopic(selectedFounder.sector);
      }
      setAiCustomPitch('');
      setViewMode('template');
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

  const handleGenerateAIPitch = async () => {
    if (!hasGeminiKey) {
      onOpenGeminiModal();
      return;
    }

    setIsGeneratingAI(true);
    setAiPitchError('');
    try {
      const apiKey = getStoredGeminiKey();
      const model = getStoredGeminiModel();

      const founderObj = selectedFounder || {
        name: founderName,
        company: company,
        role: 'Founder / CEO',
        sector: topic,
        bio: `${founderName} is a prominent founder and executive at ${company}.`,
        speakerTopics: [topic]
      };

      const result = await generatePersonalizedPitchWithAI({
        founder: founderObj,
        initiative: {
          organizationName,
          initiativeName,
          eventDate,
          eventMode,
          reach,
          topic
        },
        sender: {
          senderName,
          senderTitle,
          senderEmail,
          senderPhone,
          website
        },
        templateType: activeTemplateId,
        apiKey,
        model
      });

      setAiCustomPitch(result);
      setViewMode('ai');
    } catch (err) {
      setAiPitchError(err.message || 'Failed to generate AI pitch');
    } finally {
      setIsGeneratingAI(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="bg-[#111218] border border-[#202330] rounded-2xl p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              High-Conversion Message Crafter
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[10px] text-indigo-400 font-semibold">
              8 Battle-Tested Formats
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Personalized psychological outreach templates engineered for 80%+ response rates.
          </p>
        </div>

        {/* AI Generator CTA */}
        <button
          onClick={handleGenerateAIPitch}
          disabled={isGeneratingAI}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-xs font-semibold shadow-lg transition-all self-start sm:self-auto shrink-0"
        >
          {isGeneratingAI ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Generating with Gemini Pro...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>{hasGeminiKey ? 'Craft Custom Pitch with Gemini Pro' : 'Enable Gemini Pro AI Pitch'}</span>
            </>
          )}
        </button>
      </div>

      {/* Grid: Left Settings (5 cols) & Right Output (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Inputs (5 cols) */}
        <div className="lg:col-span-5 bg-[#111218] border border-[#202330] rounded-2xl p-5 space-y-4 text-xs">
          <div className="flex items-center justify-between border-b border-[#1c1e28] pb-3">
            <span className="font-bold text-white uppercase tracking-wider text-[11px]">
              Campaign & Target Context
            </span>
            {selectedFounder && (
              <span className="text-emerald-400 font-medium text-[11px] flex items-center gap-1">
                <Check className="w-3 h-3" />
                <span>Auto-filled from {selectedFounder.name}</span>
              </span>
            )}
          </div>

          {/* Quick Select from Pipeline */}
          {pipeline.length > 0 && (
            <div>
              <label className="text-slate-400 block mb-1">Load from Pipeline CRM</label>
              <select
                onChange={(e) => {
                  const found = pipeline.find(p => p.id === e.target.value);
                  if (found) {
                    setFounderName(found.name);
                    setCompany(found.company);
                    setAiCustomPitch('');
                    setViewMode('template');
                  }
                }}
                className="w-full px-2.5 py-1.5 bg-[#090a0f] border border-[#272a38] rounded-lg text-slate-200"
              >
                <option value="">-- Choose lead from your CRM --</option>
                {pipeline.map(p => (
                  <option key={p.id} value={p.id}>{p.name} ({p.company})</option>
                ))}
              </select>
            </div>
          )}

          {/* Target Executive */}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="text-slate-400 block mb-1">Executive Name</label>
              <input
                type="text"
                value={founderName}
                onChange={(e) => setFounderName(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-[#090a0f] border border-[#272a38] rounded-lg text-white"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Company / Firm</label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-[#090a0f] border border-[#272a38] rounded-lg text-white"
              />
            </div>
          </div>

          {/* Organization & Initiative */}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="text-slate-400 block mb-1">Host Organization</label>
              <input
                type="text"
                value={organizationName}
                onChange={(e) => setOrganizationName(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-[#090a0f] border border-[#272a38] rounded-lg text-white"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Event / Conclave Name</label>
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

          <div>
            <label className="text-slate-400 block mb-1">Audience Reach / Scale</label>
            <input
              type="text"
              value={reach}
              onChange={(e) => setReach(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-[#090a0f] border border-[#272a38] rounded-lg text-white"
            />
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
        <div className="lg:col-span-7 space-y-4">
          
          {/* Format Tabs & Mode Switcher */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex flex-wrap gap-1.5 bg-[#111218] border border-[#232634] p-1.5 rounded-xl">
              {OUTREACH_TEMPLATES.map((tmpl) => {
                const isActive = tmpl.id === activeTemplateId;
                return (
                  <button
                    key={tmpl.id}
                    onClick={() => {
                      setActiveTemplateId(tmpl.id);
                      setViewMode('template');
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white hover:bg-[#1a1c26]'
                    }`}
                  >
                    {tmpl.name}
                  </button>
                );
              })}
            </div>

            {/* View Mode Switcher if AI draft exists */}
            {aiCustomPitch && (
              <div className="flex items-center gap-1 bg-[#111218] border border-[#232634] p-1 rounded-xl text-xs">
                <button
                  onClick={() => setViewMode('template')}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                    viewMode === 'template' ? 'bg-[#1e202b] text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Template
                </button>
                <button
                  onClick={() => setViewMode('ai')}
                  className={`px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1 transition-colors ${
                    viewMode === 'ai' ? 'bg-indigo-600 text-white' : 'text-indigo-300 hover:text-white'
                  }`}
                >
                  <Sparkles className="w-3 h-3 text-amber-300" />
                  <span>Gemini Draft</span>
                </button>
              </div>
            )}
          </div>

          {/* AI Error Notification */}
          {aiPitchError && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-300 flex items-center justify-between">
              <span>{aiPitchError}</span>
              <button onClick={() => setAiPitchError('')} className="text-red-400 hover:text-white">✕</button>
            </div>
          )}

          {/* Output Card */}
          <div className="bg-[#111218] border border-[#232634] rounded-2xl p-5 space-y-4 shadow-lg">
            
            {/* Output Header */}
            <div className="flex items-center justify-between border-b border-[#1c1e28] pb-3">
              <div>
                <h4 className="font-bold text-white text-sm flex items-center gap-2">
                  <span>{viewMode === 'ai' ? 'Gemini Pro Personalized Pitch' : currentTemplate.name}</span>
                  {viewMode === 'ai' && (
                    <span className="px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 text-[10px] font-bold">
                      PRO AI
                    </span>
                  )}
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  {viewMode === 'ai' ? `Tailored specifically for ${founderName} at ${company}` : currentTemplate.description}
                </p>
              </div>

              {activeTemplateId === 'linkedin-connect' && (
                <span className={`text-xs font-mono px-2 py-0.5 rounded border ${
                  (viewMode === 'ai' ? aiCustomPitch.length : generatedContent.length) <= 300 
                    ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10'
                    : 'text-red-400 border-red-500/30 bg-red-500/10'
                }`}>
                  {(viewMode === 'ai' ? aiCustomPitch.length : generatedContent.length)}/300 chars
                </span>
              )}
            </div>

            {/* Content Display */}
            {viewMode === 'ai' ? (
              <div className="space-y-4">
                <textarea
                  value={aiCustomPitch}
                  onChange={(e) => setAiCustomPitch(e.target.value)}
                  rows={8}
                  className="w-full p-3.5 bg-[#090a0f] rounded-xl border border-[#272a38] text-xs text-slate-100 font-sans leading-relaxed focus:outline-none focus:border-indigo-500"
                />
                
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <a
                    href={getSafeLinkedInUrl({ name: founderName, company })}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#171922] hover:bg-[#232634] text-slate-200 border border-[#272a38] rounded-lg text-xs font-semibold transition-colors"
                  >
                    <span>Connect with {founderName} on LinkedIn</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>

                  <button
                    onClick={() => copyToClipboard(aiCustomPitch, 'ai-copy')}
                    className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md transition-all"
                  >
                    {copiedKey === 'ai-copy' ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'ai-copy' ? 'Copied to Clipboard!' : 'Copy AI Pitch'}</span>
                  </button>
                </div>
              </div>
            ) : isEmailTemplate ? (
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

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <a
                    href={getSafeLinkedInUrl({ name: founderName, company })}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#171922] hover:bg-[#232634] text-slate-200 border border-[#272a38] rounded-lg text-xs font-semibold transition-colors"
                  >
                    <span>Connect on LinkedIn</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>

                  <button
                    onClick={() => copyToClipboard(`Subject: ${generatedContent.subject}\n\n${generatedContent.body}`, 'all')}
                    className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md transition-all"
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
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <a
                    href={getSafeLinkedInUrl({ name: founderName, company })}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#171922] hover:bg-[#232634] text-slate-200 border border-[#272a38] rounded-lg text-xs font-semibold transition-colors"
                  >
                    <span>Connect on LinkedIn</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>

                  <button
                    onClick={() => copyToClipboard(generatedContent, 'single')}
                    className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md transition-all"
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
