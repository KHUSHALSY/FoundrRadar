import React, { useState, useMemo } from 'react';
import { 
  Search, ExternalLink, Copy, Check, Sparkles, Filter, 
  MapPin, Award, Briefcase, Plus, ArrowRight, 
  Globe, Share2, Mail, MessageSquare, Terminal
} from 'lucide-react';
import { generateDorkQueries } from '../utils/searchDorks';
import { 
  PROFESSIONAL_TOPICS, 
  TARGET_ROLES, 
  BACKGROUND_FILTERS, 
  GEOGRAPHY_PRESETS 
} from '../data/categories';
import { CURATED_FOUNDERS } from '../data/curatedFounders';

export const PLATFORMS_CONFIG = [
  { id: 'linkedin', label: 'LinkedIn (Dork)', icon: '💼', color: 'bg-blue-600/15 text-blue-400 border-blue-500/30' },
  { id: 'emailFinder', label: 'Direct Email Dork', icon: '✉️', color: 'bg-amber-500/15 text-amber-400 border-amber-500/30' },
  { id: 'twitter', label: '𝕏 (Twitter)', icon: '𝕏', color: 'bg-neutral-800 text-neutral-200 border-neutral-700' },
  { id: 'reddit', label: 'Reddit Communities', icon: '🤖', color: 'bg-orange-500/15 text-orange-400 border-orange-500/30' },
  { id: 'startupMedia', label: 'TechCrunch & Media', icon: '📰', color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' },
  { id: 'producthunt', label: 'Product Hunt Makers', icon: '🚀', color: 'bg-red-500/15 text-red-400 border-red-500/30' },
  { id: 'github', label: 'GitHub / Devs', icon: '🐙', color: 'bg-purple-500/15 text-purple-400 border-purple-500/30' },
  { id: 'youtube', label: 'Podcasts & Keynotes', icon: '🎥', color: 'bg-rose-500/15 text-rose-400 border-rose-500/30' },
];

export default function SearchEngine({ onAddToPipeline, onSelectFounderForPitch }) {
  const [topic, setTopic] = useState('AI & Autonomous Agents');
  const [selectedRoleId, setSelectedRoleId] = useState('founder');
  const [selectedGeoId, setSelectedGeoId] = useState('global');
  const [selectedBgId, setSelectedBgId] = useState('any');
  const [customKeywords, setCustomKeywords] = useState('');
  
  // Selected platforms
  const [selectedPlatforms, setSelectedPlatforms] = useState([
    'linkedin', 'emailFinder', 'twitter', 'reddit', 'startupMedia'
  ]);

  // Copied state indicator
  const [copiedKey, setCopiedKey] = useState(null);

  // Quick manual lead add form
  const [showManualAdd, setShowManualAdd] = useState(false);
  const [manualName, setManualName] = useState('');
  const [manualCompany, setManualCompany] = useState('');
  const [manualUrl, setManualUrl] = useState('');
  const [manualEmail, setManualEmail] = useState('');
  const [manualNotes, setManualNotes] = useState('');
  const [addFeedback, setAddFeedback] = useState('');

  // Toggle platform
  const togglePlatform = (id) => {
    setSelectedPlatforms(prev => 
      prev.includes(id) 
        ? prev.filter(p => p !== id) 
        : [...prev, id]
    );
  };

  const currentRole = TARGET_ROLES.find(r => r.id === selectedRoleId) || TARGET_ROLES[0];
  const currentGeo = GEOGRAPHY_PRESETS.find(g => g.id === selectedGeoId) || GEOGRAPHY_PRESETS[0];
  const currentBg = BACKGROUND_FILTERS.find(b => b.id === selectedBgId) || BACKGROUND_FILTERS[0];

  // Generate dorks
  const queries = useMemo(() => {
    return generateDorkQueries({
      topic: topic || 'Startups',
      roleQuery: currentRole.query,
      geographyQuery: currentGeo.query,
      backgroundQuery: currentBg.query,
      customKeywords
    });
  }, [topic, currentRole, currentGeo, currentBg, customKeywords]);

  // Matching curated founders based on search topic
  const matchingFounders = useMemo(() => {
    const q = (topic || '').toLowerCase();
    if (!q) return [];
    return CURATED_FOUNDERS.filter(f => 
      f.sector.toLowerCase().includes(q) ||
      f.company.toLowerCase().includes(q) ||
      f.bio.toLowerCase().includes(q) ||
      f.tags.some(t => t.toLowerCase().includes(q)) ||
      f.speakerTopics.some(st => st.toLowerCase().includes(q))
    ).slice(0, 6);
  }, [topic]);

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleOpenAllSelected = () => {
    const urlsToOpen = [];
    if (selectedPlatforms.includes('linkedin')) urlsToOpen.push(queries.linkedin.primaryUrl);
    if (selectedPlatforms.includes('emailFinder')) urlsToOpen.push(queries.emailFinder.primaryUrl);
    if (selectedPlatforms.includes('twitter')) urlsToOpen.push(queries.twitter.primaryUrl);
    if (selectedPlatforms.includes('reddit')) urlsToOpen.push(queries.reddit.primaryUrl);
    if (selectedPlatforms.includes('startupMedia')) urlsToOpen.push(queries.startupMedia.primaryUrl);
    if (selectedPlatforms.includes('producthunt')) urlsToOpen.push(queries.producthunt.primaryUrl);
    if (selectedPlatforms.includes('github')) urlsToOpen.push(queries.github.primaryUrl);
    if (selectedPlatforms.includes('youtube')) urlsToOpen.push(queries.youtube.primaryUrl);

    urlsToOpen.forEach(url => {
      window.open(url, '_blank');
    });
  };

  const handleManualAddSubmit = (e) => {
    e.preventDefault();
    if (!manualName.trim() || !manualCompany.trim()) return;

    onAddToPipeline({
      id: `lead-${Date.now()}`,
      name: manualName.trim(),
      company: manualCompany.trim(),
      role: currentRole.label,
      sector: topic || 'Tech',
      profileUrl: manualUrl.trim() || '#',
      email: manualEmail.trim(),
      notes: manualNotes.trim() || `Discovered via ${topic} search on ${new Date().toLocaleDateString()}`,
      status: 'Identified',
      location: currentGeo.label
    });

    setManualName('');
    setManualCompany('');
    setManualUrl('');
    setManualEmail('');
    setManualNotes('');
    setAddFeedback('Prospect saved to Outreach Pipeline!');
    setTimeout(() => setAddFeedback(''), 3000);
  };

  return (
    <div className="space-y-8">
      
      {/* Hero / Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800/80 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Universal Search & Intelligence Engine</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white mb-3">
            Find Founders, Investors & Leaders Across the Web
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Target high-profile executives across LinkedIn, 𝕏 (Twitter), Reddit, and venture databases with precision Google Dorks that uncover direct profiles, connection handles, and public emails.
          </p>

          {/* Quick Vertical Topics */}
          <div className="mt-6 flex flex-wrap gap-2 items-center">
            <span className="text-xs font-medium text-slate-400">High-Interest Verticals:</span>
            {PROFESSIONAL_TOPICS.map((pt, idx) => (
              <button
                key={idx}
                onClick={() => setTopic(pt.label)}
                className={`text-xs px-3 py-1 rounded-lg border transition-all ${
                  topic === pt.label
                    ? 'bg-indigo-600 text-white border-indigo-500 font-semibold shadow-md shadow-indigo-600/20'
                    : 'bg-slate-900/80 text-slate-300 border-slate-700/80 hover:border-slate-500 hover:bg-slate-800'
                }`}
              >
                {pt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Parameters Configuration */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
        <h2 className="text-base font-bold text-white flex items-center gap-2 mb-6">
          <Filter className="w-4 h-4 text-indigo-400" />
          <span>Step 1: Define Target Niche & Executive Parameters</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Topic Input */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5 text-indigo-400" />
              <span>Target Topic / Domain</span>
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. AI Agents, Fintech, D2C, SaaS..."
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
          </div>

          {/* Target Role */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-rose-400" />
              <span>Role / Title</span>
            </label>
            <select
              value={selectedRoleId}
              onChange={(e) => setSelectedRoleId(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            >
              {TARGET_ROLES.map(r => (
                <option key={r.id} value={r.id}>{r.label}</option>
              ))}
            </select>
          </div>

          {/* Geography Filter */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>Geography / Region</span>
            </label>
            <select
              value={selectedGeoId}
              onChange={(e) => setSelectedGeoId(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            >
              {GEOGRAPHY_PRESETS.map(g => (
                <option key={g.id} value={g.id}>{g.label}</option>
              ))}
            </select>
          </div>

          {/* Background / Pedigree Filter */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>Pedigree / Background</span>
            </label>
            <select
              value={selectedBgId}
              onChange={(e) => setSelectedBgId(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            >
              {BACKGROUND_FILTERS.map(b => (
                <option key={b.id} value={b.id}>{b.label}</option>
              ))}
            </select>
          </div>

        </div>

        {/* Step 2: Platform Selection Toggles */}
        <div className="mt-6 pt-6 border-t border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Step 2: Channels to Scan:
              </span>
              <span className="text-xs text-slate-500">
                (Click pills to toggle)
              </span>
            </div>

            {/* Launch All Button */}
            <button
              onClick={handleOpenAllSelected}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all self-start sm:self-auto"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Launch All Selected Channels ({selectedPlatforms.length})</span>
            </button>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {PLATFORMS_CONFIG.map((platform) => {
              const isSelected = selectedPlatforms.includes(platform.id);
              return (
                <button
                  key={platform.id}
                  onClick={() => togglePlatform(platform.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium border transition-all ${
                    isSelected
                      ? `${platform.color} border-current shadow-sm`
                      : 'bg-slate-950 text-slate-500 border-slate-800 hover:border-slate-700 hover:text-slate-400'
                  }`}
                >
                  <span className="text-base">{platform.icon}</span>
                  <span>{platform.label}</span>
                  {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-current" />}
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* Generated Deep-Links & Dorks */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Globe className="w-4 h-4 text-indigo-400" />
            <span>Search Dorks & Deep Query Links</span>
          </h2>
          <span className="text-xs text-slate-400">
            Click links to search directly or copy dorks to customize
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          
          {/* LinkedIn Dork */}
          {selectedPlatforms.includes('linkedin') && (
            <div className="bg-slate-900 border border-blue-500/30 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">💼</span>
                    <div>
                      <h3 className="font-bold text-slate-100 text-sm sm:text-base flex items-center gap-2">
                        {queries.linkedin.title}
                        <span className="px-2 py-0.5 text-[10px] bg-blue-500/20 text-blue-300 rounded font-semibold">
                          {queries.linkedin.badge}
                        </span>
                      </h3>
                      <p className="text-xs text-slate-400">{queries.linkedin.subtitle}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-3 p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300 font-mono break-all line-clamp-3 select-all">
                  {queries.linkedin.dork}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => copyToClipboard(queries.linkedin.dork, 'linkedin')}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium transition-all"
                  >
                    {copiedKey === 'linkedin' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'linkedin' ? 'Copied!' : 'Copy Dork'}</span>
                  </button>
                  <a
                    href={queries.linkedin.directUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 bg-slate-800/70 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium"
                  >
                    Native LinkedIn
                  </a>
                </div>

                <a
                  href={queries.linkedin.primaryUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold shadow-md shadow-blue-500/20 transition-all ml-auto"
                >
                  <span>Search on Google</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          )}

          {/* Email Finder Dork */}
          {selectedPlatforms.includes('emailFinder') && (
            <div className="bg-slate-900 border border-amber-500/30 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">✉️</span>
                    <div>
                      <h3 className="font-bold text-slate-100 text-sm sm:text-base flex items-center gap-2">
                        {queries.emailFinder.title}
                        <span className="px-2 py-0.5 text-[10px] bg-amber-500/20 text-amber-300 rounded font-semibold">
                          {queries.emailFinder.badge}
                        </span>
                      </h3>
                      <p className="text-xs text-slate-400">{queries.emailFinder.subtitle}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-3 p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300 font-mono break-all line-clamp-3 select-all">
                  {queries.emailFinder.dork}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between gap-2">
                <button
                  onClick={() => copyToClipboard(queries.emailFinder.dork, 'emailFinder')}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium transition-all"
                >
                  {copiedKey === 'emailFinder' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'emailFinder' ? 'Copied!' : 'Copy Dork'}</span>
                </button>

                <a
                  href={queries.emailFinder.primaryUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 px-4 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-bold shadow-md shadow-amber-500/20 transition-all ml-auto"
                >
                  <span>Find Contact Emails</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          )}

          {/* Twitter / X */}
          {selectedPlatforms.includes('twitter') && (
            <div className="bg-slate-900 border border-neutral-700 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">𝕏</span>
                    <div>
                      <h3 className="font-bold text-slate-100 text-sm sm:text-base flex items-center gap-2">
                        {queries.twitter.title}
                        <span className="px-2 py-0.5 text-[10px] bg-neutral-800 text-neutral-300 rounded font-semibold">
                          {queries.twitter.badge}
                        </span>
                      </h3>
                      <p className="text-xs text-slate-400">{queries.twitter.subtitle}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-3 p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300 font-mono break-all line-clamp-3 select-all">
                  {queries.twitter.dork}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between gap-2">
                <button
                  onClick={() => copyToClipboard(queries.twitter.dork, 'twitter')}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium transition-all"
                >
                  {copiedKey === 'twitter' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'twitter' ? 'Copied!' : 'Copy Dork'}</span>
                </button>

                <div className="flex items-center gap-2 ml-auto">
                  <a
                    href={queries.twitter.secondaryUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium"
                  >
                    Bio Dork
                  </a>
                  <a
                    href={queries.twitter.primaryUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 px-4 py-1.5 bg-slate-100 hover:bg-white text-slate-950 rounded-lg text-xs font-bold shadow-md transition-all"
                  >
                    <span>Search 𝕏 Users</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Reddit */}
          {selectedPlatforms.includes('reddit') && (
            <div className="bg-slate-900 border border-orange-500/30 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">🤖</span>
                    <div>
                      <h3 className="font-bold text-slate-100 text-sm sm:text-base flex items-center gap-2">
                        {queries.reddit.title}
                        <span className="px-2 py-0.5 text-[10px] bg-orange-500/20 text-orange-300 rounded font-semibold">
                          {queries.reddit.badge}
                        </span>
                      </h3>
                      <p className="text-xs text-slate-400">{queries.reddit.subtitle}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-3 p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300 font-mono break-all line-clamp-3 select-all">
                  {queries.reddit.dork}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between gap-2">
                <button
                  onClick={() => copyToClipboard(queries.reddit.dork, 'reddit')}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium transition-all"
                >
                  {copiedKey === 'reddit' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'reddit' ? 'Copied!' : 'Copy Dork'}</span>
                </button>

                <div className="flex items-center gap-2 ml-auto">
                  <a
                    href={queries.reddit.secondaryUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium"
                  >
                    Google Dork
                  </a>
                  <a
                    href={queries.reddit.primaryUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 px-4 py-1.5 bg-orange-600 hover:bg-orange-500 text-white rounded-lg text-xs font-bold shadow-md shadow-orange-500/20 transition-all"
                  >
                    <span>Search Reddit</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Startup Media / TechCrunch */}
          {selectedPlatforms.includes('startupMedia') && (
            <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">📰</span>
                    <div>
                      <h3 className="font-bold text-slate-100 text-sm sm:text-base flex items-center gap-2">
                        {queries.startupMedia.title}
                        <span className="px-2 py-0.5 text-[10px] bg-emerald-500/20 text-emerald-300 rounded font-semibold">
                          {queries.startupMedia.badge}
                        </span>
                      </h3>
                      <p className="text-xs text-slate-400">{queries.startupMedia.subtitle}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-3 p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300 font-mono break-all line-clamp-3 select-all">
                  {queries.startupMedia.dork}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-end">
                <a
                  href={queries.startupMedia.primaryUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold shadow-md shadow-emerald-500/20 transition-all"
                >
                  <span>Search TechCrunch & News</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          )}

          {/* Product Hunt */}
          {selectedPlatforms.includes('producthunt') && (
            <div className="bg-slate-900 border border-red-500/30 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">🚀</span>
                    <div>
                      <h3 className="font-bold text-slate-100 text-sm sm:text-base flex items-center gap-2">
                        {queries.producthunt.title}
                        <span className="px-2 py-0.5 text-[10px] bg-red-500/20 text-red-300 rounded font-semibold">
                          {queries.producthunt.badge}
                        </span>
                      </h3>
                      <p className="text-xs text-slate-400">{queries.producthunt.subtitle}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-3 p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300 font-mono break-all line-clamp-3 select-all">
                  Product Hunt Makers Query: {topic}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-end">
                <a
                  href={queries.producthunt.primaryUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 px-4 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-bold shadow-md shadow-red-500/20 transition-all"
                >
                  <span>Browse Product Hunt</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          )}

          {/* GitHub Maintainers & CTOs */}
          {selectedPlatforms.includes('github') && (
            <div className="bg-slate-900 border border-purple-500/30 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">🐙</span>
                    <div>
                      <h3 className="font-bold text-slate-100 text-sm sm:text-base flex items-center gap-2">
                        {queries.github.title}
                        <span className="px-2 py-0.5 text-[10px] bg-purple-500/20 text-purple-300 rounded font-semibold">
                          {queries.github.badge}
                        </span>
                      </h3>
                      <p className="text-xs text-slate-400">{queries.github.subtitle}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-3 p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300 font-mono break-all line-clamp-3 select-all">
                  {queries.github.dork}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-end">
                <a
                  href={queries.github.primaryUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 px-4 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-bold shadow-md shadow-purple-500/20 transition-all"
                >
                  <span>Find Technical Founders</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          )}

          {/* YouTube Founder Interviews */}
          {selectedPlatforms.includes('youtube') && (
            <div className="bg-slate-900 border border-rose-500/30 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">🎥</span>
                    <div>
                      <h3 className="font-bold text-slate-100 text-sm sm:text-base flex items-center gap-2">
                        {queries.youtube.title}
                        <span className="px-2 py-0.5 text-[10px] bg-rose-500/20 text-rose-300 rounded font-semibold">
                          {queries.youtube.badge}
                        </span>
                      </h3>
                      <p className="text-xs text-slate-400">{queries.youtube.subtitle}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-3 p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300 font-mono break-all line-clamp-3 select-all">
                  {queries.youtube.dork}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-end">
                <a
                  href={queries.youtube.primaryUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 px-4 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold shadow-md shadow-rose-500/20 transition-all"
                >
                  <span>Watch Founder Interviews</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Matching Verified Founders */}
      {matchingFounders.length > 0 && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Verified Industry Leaders for "{topic}"</span>
              </h3>
              <p className="text-xs text-slate-400">Pre-vetted executives & founders available in our directory</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-amber-500/15 text-amber-300 border border-amber-500/30 rounded-lg">
              {matchingFounders.length} Available
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {matchingFounders.map((f) => (
              <div key={f.id} className="bg-slate-950 border border-slate-800/80 hover:border-slate-700 rounded-xl p-4 flex flex-col justify-between transition-all">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-slate-100 text-sm">{f.name}</h4>
                      <p className="text-xs text-indigo-400 font-medium">{f.company}</p>
                    </div>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 bg-slate-800 text-slate-300 rounded">
                      {f.tags[0] || 'Executive'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-2 line-clamp-2">{f.bio}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                  <a 
                    href={f.linkedin} 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-xs text-blue-400 hover:underline flex items-center gap-1"
                  >
                    <span>LinkedIn</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onSelectFounderForPitch(f)}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-md font-medium"
                    >
                      Draft Pitch
                    </button>
                    <button
                      onClick={() => onAddToPipeline({
                        id: f.id,
                        name: f.name,
                        company: f.company,
                        role: f.role,
                        sector: f.sector,
                        profileUrl: f.linkedin,
                        notes: `Curated match: ${f.bio}`,
                        status: 'Identified',
                        location: f.location
                      })}
                      className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs rounded-md font-medium flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Pipeline</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Direct Prospect Manual Adder */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-white text-sm sm:text-base flex items-center gap-2">
              <Plus className="w-4 h-4 text-emerald-400" />
              <span>Found a Lead on LinkedIn or 𝕏? Save Directly to CRM</span>
            </h3>
            <p className="text-xs text-slate-400">Save their profile link, email, and notes for pipeline tracking</p>
          </div>
          <button
            onClick={() => setShowManualAdd(!showManualAdd)}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg font-medium transition-all"
          >
            {showManualAdd ? 'Hide Form' : '+ Add Prospect'}
          </button>
        </div>

        {addFeedback && (
          <div className="mt-3 p-2.5 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs font-semibold flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>{addFeedback}</span>
          </div>
        )}

        {showManualAdd && (
          <form onSubmit={handleManualAddSubmit} className="mt-4 pt-4 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <input
              type="text"
              required
              value={manualName}
              onChange={(e) => setManualName(e.target.value)}
              placeholder="Contact Full Name *"
              className="px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 text-xs focus:ring-1 focus:ring-indigo-500"
            />
            <input
              type="text"
              required
              value={manualCompany}
              onChange={(e) => setManualCompany(e.target.value)}
              placeholder="Company / Venture *"
              className="px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 text-xs focus:ring-1 focus:ring-indigo-500"
            />
            <input
              type="url"
              value={manualUrl}
              onChange={(e) => setManualUrl(e.target.value)}
              placeholder="LinkedIn / 𝕏 Profile URL"
              className="px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 text-xs focus:ring-1 focus:ring-indigo-500"
            />
            <input
              type="email"
              value={manualEmail}
              onChange={(e) => setManualEmail(e.target.value)}
              placeholder="Direct Email Address"
              className="px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 text-xs focus:ring-1 focus:ring-indigo-500"
            />
            <div className="flex gap-2">
              <input
                type="text"
                value={manualNotes}
                onChange={(e) => setManualNotes(e.target.value)}
                placeholder="Notes"
                className="flex-1 px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 text-xs focus:ring-1 focus:ring-indigo-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg transition-all"
              >
                Save
              </button>
            </div>
          </form>
        )}
      </div>

    </div>
  );
}
