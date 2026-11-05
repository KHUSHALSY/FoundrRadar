import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Search, ExternalLink, Copy, Check, Filter, 
  MapPin, Briefcase, Plus, Mail, MessageSquare, 
  CheckCircle2, ArrowUpRight, Sparkles, SlidersHorizontal,
  Share2, X, Building, Globe, Award, UserCheck, ChevronRight,
  Loader2, ArrowRight
} from 'lucide-react';
import { CURATED_FOUNDERS } from '../data/curatedFounders';
import { getSafeLinkedInUrl } from '../utils/urlHelper';
import { searchExecutivesWithAI } from '../services/geminiService';

export const SECTORS = [
  'All India Leaders',
  'FinTech & Wealth',
  'Quick Commerce & D2C',
  'AI & DeepTech',
  'B2B SaaS & DevTools',
  'Shark Tank & Angels',
  'Global Pioneers'
];

export const HUBS = [
  'All India Hubs',
  'Bengaluru',
  'Delhi NCR (Gurugram / Noida)',
  'Mumbai',
  'Chennai & South India',
  'Global Pioneers'
];

export default function SearchEngine({ 
  onAddToPipeline, 
  onSelectFounderForPitch
}) {
  const [searchInput, setSearchInput] = useState('');
  const [activeQuery, setActiveQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState('All India Leaders');
  const [selectedHub, setSelectedHub] = useState('All India Hubs');
  const [sortBy, setSortBy] = useState('curated');
  const [copiedKey, setCopiedKey] = useState(null);
  const [selectedFounderModal, setSelectedFounderModal] = useState(null);
  const [modalCopied, setModalCopied] = useState(false);
  const searchInputRef = useRef(null);

  // AI live search state (seamless without key nagging)
  const [aiFounders, setAiFounders] = useState([]);
  const [isSearchingAI, setIsSearchingAI] = useState(false);
  const [aiSearchError, setAiSearchError] = useState('');

  // Global hotkeys
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (selectedFounderModal) {
          setSelectedFounderModal(null);
        } else {
          setSearchInput('');
          setActiveQuery('');
          searchInputRef.current?.blur();
        }
      }
      if (e.key === '/' && document.activeElement !== searchInputRef.current && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedFounderModal]);

  // Combined pool
  const allFoundersPool = useMemo(() => {
    return [...aiFounders, ...CURATED_FOUNDERS];
  }, [aiFounders]);

  // Quick chips for Indian startup discovery
  const popularKeywords = [
    { label: '🇮🇳 All Indian Founders', query: '' },
    { label: 'Bengaluru Hub', query: 'Bengaluru' },
    { label: 'Delhi NCR', query: 'Gurugram' },
    { label: 'Mumbai Unicorns', query: 'Mumbai' },
    { label: 'FinTech (CRED / Zerodha / Razorpay)', query: 'FinTech' },
    { label: 'Quick Commerce (Zepto / Blinkit)', query: 'Quick Commerce' },
    { label: 'Shark Tank Sharks', query: 'Shark' },
    { label: 'Bootstrapped Giants (Zoho / Zerodha)', query: 'Bootstrapped' },
    { label: 'AI & DeepTech India', query: 'AI' }
  ];

  // Execute explicit search
  const handleExecuteSearch = async (overrideTerm) => {
    const term = typeof overrideTerm === 'string' ? overrideTerm : searchInput;
    setActiveQuery(term.trim());

    // If user enters an unindexed niche or specific query, optionally trigger AI live search silently
    if (term.trim()) {
      const q = term.trim().toLowerCase();
      const localMatches = CURATED_FOUNDERS.filter(f => 
        f.name.toLowerCase().includes(q) || 
        f.company.toLowerCase().includes(q) || 
        f.sector.toLowerCase().includes(q)
      );

      // If very few local matches, automatically enrich via Gemini in the background
      if (localMatches.length <= 1 && !isSearchingAI) {
        setIsSearchingAI(true);
        setAiSearchError('');
        try {
          const results = await searchExecutivesWithAI(term.trim());
          if (results && results.length > 0) {
            setAiFounders(prev => [...results, ...prev]);
          }
        } catch (err) {
          // Silent fallback to local results without bothering the user
          console.warn('AI search background note:', err.message);
        } finally {
          setIsSearchingAI(false);
        }
      }
    }
  };

  // Filter logic
  const filteredFounders = useMemo(() => {
    const rawTerms = activeQuery.trim().toLowerCase().split(/\s+/).filter(Boolean);

    let list = allFoundersPool.filter(f => {
      // 1. Keyword search (every term must match)
      const matchesSearch = rawTerms.length === 0 || rawTerms.every(term => {
        return (
          f.name.toLowerCase().includes(term) ||
          f.company.toLowerCase().includes(term) ||
          (f.domain && f.domain.toLowerCase().includes(term)) ||
          f.sector.toLowerCase().includes(term) ||
          f.role.toLowerCase().includes(term) ||
          f.location.toLowerCase().includes(term) ||
          f.bio.toLowerCase().includes(term) ||
          (f.tags && f.tags.some(t => t.toLowerCase().includes(term))) ||
          (f.speakerTopics && f.speakerTopics.some(st => st.toLowerCase().includes(term)))
        );
      });

      // 2. Sector match
      const matchesSector = selectedSector === 'All India Leaders' ||
        (selectedSector === 'FinTech & Wealth' && (f.sector.includes('FinTech') || f.sector.includes('WealthTech') || f.sector.includes('Asset') || f.sector.includes('Payments'))) ||
        (selectedSector === 'Quick Commerce & D2C' && (f.sector.includes('Quick Commerce') || f.sector.includes('D2C') || f.sector.includes('Eyewear') || f.sector.includes('Consumer'))) ||
        (selectedSector === 'AI & DeepTech' && (f.sector.includes('AI') || f.sector.includes('CleanTech') || f.sector.includes('EV') || (f.tags && f.tags.includes('AGI')))) ||
        (selectedSector === 'B2B SaaS & DevTools' && (f.sector.includes('SaaS') || f.sector.includes('Developer') || f.sector.includes('APIs'))) ||
        (selectedSector === 'Shark Tank & Angels' && (f.tags && (f.tags.some(t => t.includes('Shark') || t.includes('Angel') || t.includes('Investor'))))) ||
        (selectedSector === 'Global Pioneers' && f.sector.includes('Global'));

      // 3. Hub match
      const matchesHub = selectedHub === 'All India Hubs' ||
        (selectedHub === 'Bengaluru' && f.location.includes('Bengaluru')) ||
        (selectedHub === 'Delhi NCR (Gurugram / Noida)' && (f.location.includes('Delhi') || f.location.includes('Gurugram') || f.location.includes('Noida'))) ||
        (selectedHub === 'Mumbai' && f.location.includes('Mumbai')) ||
        (selectedHub === 'Chennai & South India' && (f.location.includes('Chennai') || f.location.includes('Tenkasi') || f.location.includes('Bengaluru'))) ||
        (selectedHub === 'Global Pioneers' && (f.location.includes('San Francisco') || f.location.includes('CA')));

      return matchesSearch && matchesSector && matchesHub;
    });

    // Sorting
    if (sortBy === 'name-asc') {
      list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'company-asc') {
      list = [...list].sort((a, b) => a.company.localeCompare(b.company));
    }

    return list;
  }, [activeQuery, selectedSector, selectedHub, sortBy, allFoundersPool]);

  // Sector counts
  const sectorCounts = useMemo(() => {
    const counts = { 'All India Leaders': allFoundersPool.length };
    SECTORS.forEach(sec => {
      if (sec === 'All India Leaders') return;
      counts[sec] = allFoundersPool.filter(f => {
        if (sec === 'FinTech & Wealth') return f.sector.includes('FinTech') || f.sector.includes('WealthTech') || f.sector.includes('Asset') || f.sector.includes('Payments');
        if (sec === 'Quick Commerce & D2C') return f.sector.includes('Quick Commerce') || f.sector.includes('D2C') || f.sector.includes('Eyewear') || f.sector.includes('Consumer');
        if (sec === 'AI & DeepTech') return f.sector.includes('AI') || f.sector.includes('CleanTech') || f.sector.includes('EV');
        if (sec === 'B2B SaaS & DevTools') return f.sector.includes('SaaS') || f.sector.includes('Developer') || f.sector.includes('APIs');
        if (sec === 'Shark Tank & Angels') return f.tags && f.tags.some(t => t.includes('Shark') || t.includes('Angel') || t.includes('Investor'));
        if (sec === 'Global Pioneers') return f.sector.includes('Global');
        return false;
      }).length;
    });
    return counts;
  }, [allFoundersPool]);

  const copyEmail = (email, key) => {
    navigator.clipboard.writeText(email);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const copyModalCard = (founder) => {
    const text = `foundrRadar Briefing: ${founder.name} (${founder.company})\nRole: ${founder.role}\nSector: ${founder.sector}\nLocation: ${founder.location}\nLinkedIn: ${getSafeLinkedInUrl(founder)}\nEmail: ${founder.email || 'N/A'}\nKeynote Topics: ${founder.speakerTopics?.join(', ') || 'N/A'}`;
    navigator.clipboard.writeText(text);
    setModalCopied(true);
    setTimeout(() => setModalCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      
      {/* Indian Startup Ecosystem Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-[#10121a] border border-[#1e212f] rounded-xl p-3.5 flex items-center justify-between shadow-sm">
          <div>
            <div className="text-[11px] text-slate-400 font-medium">Indian Startup Leaders</div>
            <div className="text-lg font-bold text-white mt-0.5 font-heading">{allFoundersPool.length} Verified</div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs">
            🇮🇳
          </div>
        </div>

        <div className="bg-[#10121a] border border-[#1e212f] rounded-xl p-3.5 flex items-center justify-between shadow-sm">
          <div>
            <div className="text-[11px] text-slate-400 font-medium">LinkedIn Verification</div>
            <div className="text-lg font-bold text-emerald-400 mt-0.5 font-heading">100% Direct</div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-[#10121a] border border-[#1e212f] rounded-xl p-3.5 flex items-center justify-between shadow-sm">
          <div>
            <div className="text-[11px] text-slate-400 font-medium">Founder Inboxes</div>
            <div className="text-lg font-bold text-amber-400 mt-0.5 font-heading">{allFoundersPool.filter(f => f.email).length} Indexed</div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs">
            <Mail className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-[#10121a] border border-[#1e212f] rounded-xl p-3.5 flex items-center justify-between shadow-sm">
          <div>
            <div className="text-[11px] text-slate-400 font-medium">Outreach Accuracy</div>
            <div className="text-lg font-bold text-slate-200 mt-0.5 font-heading">Zero 404s</div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 flex items-center justify-center font-bold text-xs">
            <Sparkles className="w-4 h-4 text-indigo-400" />
          </div>
        </div>
      </div>

      {/* Main Search Bar & Filter Header */}
      <div className="bg-[#10121a] border border-[#1e212f] rounded-2xl p-5 sm:p-7 shadow-xl">
        
        {/* Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-heading">
                India Executive & Founder Directory
              </h1>
              <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] text-emerald-400 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-dot" />
                Live Radar Active
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Connect directly with India’s top unicorn founders, Shark Tank investors, and keynote speakers. Tap "Connect" to open verified profiles directly with zero dead links.
            </p>
          </div>
        </div>

        {/* Search Input Bar with EXPLICIT Right-Side Search Button */}
        <div className="mt-5 relative flex items-center">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          
          <input
            ref={searchInputRef}
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleExecuteSearch();
              }
            }}
            placeholder="Search founders by name, company, sector, college alum (IIT/IIM/BITS), or speaking topic..."
            className="w-full pl-11 pr-32 py-3.5 bg-[#07080c] border border-[#26293a] rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-xs sm:text-sm shadow-inner transition-all"
          />

          {/* Prominent Search Action Button on the Right */}
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
            {searchInput && (
              <button
                onClick={() => {
                  setSearchInput('');
                  setActiveQuery('');
                }}
                className="text-xs text-slate-500 hover:text-slate-300 px-1.5 py-1 rounded"
              >
                ✕
              </button>
            )}

            <button
              onClick={() => handleExecuteSearch()}
              disabled={isSearchingAI}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white text-xs font-semibold rounded-lg shadow-md transition-all shrink-0"
              title="Execute Search in this page"
            >
              {isSearchingAI ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span className="hidden sm:inline">Searching...</span>
                </>
              ) : (
                <>
                  <span>Search</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Quick Indian Ecosystem Filters */}
        <div className="mt-3.5 flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] text-slate-500 font-medium mr-1">Ecosystem:</span>
          {popularKeywords.map((kw, i) => {
            const isSelected = (kw.query === '' && activeQuery === '') || (kw.query !== '' && activeQuery.toLowerCase() === kw.query.toLowerCase());
            return (
              <button
                key={i}
                onClick={() => {
                  setSearchInput(kw.query);
                  handleExecuteSearch(kw.query);
                }}
                className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                  isSelected
                    ? 'bg-indigo-600 text-white border-indigo-500 font-semibold shadow-sm'
                    : 'bg-[#141620] text-slate-300 border-[#202332] hover:border-slate-500 hover:text-white'
                }`}
              >
                {kw.label}
              </button>
            );
          })}
        </div>

        {/* Sector Tabs Bar with Counts */}
        <div className="mt-5 pt-4 border-t border-[#1a1d29]">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            {SECTORS.map(sec => {
              const isSelected = selectedSector === sec;
              const count = sectorCounts[sec] || 0;
              return (
                <button
                  key={sec}
                  onClick={() => setSelectedSector(sec)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-all font-medium ${
                    isSelected
                      ? 'bg-[#181a26] text-white border border-indigo-500/50 font-semibold shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-[#12141e] border border-transparent'
                  }`}
                >
                  <span>{sec}</span>
                  <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                    isSelected ? 'bg-indigo-600 text-white' : 'bg-[#1e212f] text-slate-400'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Hub & Secondary Controls */}
        <div className="mt-4 pt-3 border-t border-[#181a26] flex flex-wrap items-center justify-between gap-3 text-xs">
          
          <div className="flex flex-wrap items-center gap-3">
            {/* Indian City Hub Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 font-medium">Indian Hub:</span>
              <select
                value={selectedHub}
                onChange={(e) => setSelectedHub(e.target.value)}
                className="px-2.5 py-1.5 bg-[#07080c] border border-[#26293a] rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500 text-xs"
              >
                {HUBS.map(h => <option key={h} value={h}>{h}</option>)}
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 font-medium">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-2.5 py-1.5 bg-[#07080c] border border-[#26293a] rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500 text-xs"
              >
                <option value="curated">Indian Tier-1 Priority</option>
                <option value="name-asc">Name (A-Z)</option>
                <option value="company-asc">Company (A-Z)</option>
              </select>
            </div>
          </div>

          <div className="text-xs text-slate-400 font-medium">
            Showing <span className="text-white font-bold">{filteredFounders.length}</span> Indian & Global executives
          </div>

        </div>

      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between px-1">
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
          <span>{activeQuery ? `Results for "${activeQuery}"` : `${selectedSector}`}</span>
          <span className="text-indigo-400">({filteredFounders.length})</span>
        </h2>
        <span className="text-[11px] text-slate-500 hidden sm:inline-block">
          Click "Connect" to open verified profiles directly in LinkedIn
        </span>
      </div>

      {/* Profiles Grid */}
      {filteredFounders.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFounders.map((founder, index) => {
            const domainFavicon = founder.domain 
              ? `https://www.google.com/s2/favicons?domain=${founder.domain}&sz=64` 
              : null;
            const safeLinkedInUrl = getSafeLinkedInUrl(founder);

            return (
              <div 
                key={founder.id}
                style={{ animationDelay: `${Math.min(index * 20, 250)}ms` }}
                className="bg-[#10121a] border border-[#1e212f] rounded-xl p-5 flex flex-col justify-between card-hover animate-fade-in group"
              >
                <div>
                  {/* Top Header: Initials + Company Favicon + Verification */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {/* Initials Avatar */}
                      <div className="w-11 h-11 rounded-xl bg-[#161824] border border-[#262939] text-indigo-400 flex items-center justify-center font-bold text-sm shrink-0 shadow-inner group-hover:border-indigo-500/40 transition-colors">
                        {founder.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                      </div>

                      <div>
                        <h3 className="font-bold text-white text-sm sm:text-base flex items-center gap-1.5 leading-snug font-heading">
                          <span>{founder.name}</span>
                          <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" title="Verified Profile" />
                          {founder.isAIGenerated && (
                            <span className="px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 text-[9px] font-bold">
                              AI Live
                            </span>
                          )}
                        </h3>
                        
                        {/* Company Pill with Real Favicon */}
                        <div className="flex items-center gap-1.5 mt-1">
                          {domainFavicon && (
                            <img 
                              src={domainFavicon} 
                              alt={founder.company}
                              onError={(e) => { e.currentTarget.style.display = 'none'; }}
                              className="w-3.5 h-3.5 rounded-sm object-contain shrink-0"
                            />
                          )}
                          <span className="text-xs text-indigo-300 font-semibold">{founder.company}</span>
                          <span className="text-slate-600">•</span>
                          <span className="text-xs text-slate-300 font-medium truncate max-w-[120px]">{founder.role}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Location & Sector Pills */}
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1 text-slate-300">
                      <MapPin className="w-3 h-3 text-indigo-400 shrink-0" />
                      <span>{founder.location}</span>
                    </span>
                    <span className="text-slate-600">•</span>
                    <span className="px-2 py-0.5 bg-[#161824] text-slate-300 rounded border border-[#202332] text-[10px]">
                      {founder.sector}
                    </span>
                  </div>

                  {/* Bio */}
                  <p className="mt-3 text-xs text-slate-300 leading-relaxed line-clamp-2">
                    {founder.bio}
                  </p>

                  {/* Keynote / Advisory Topics */}
                  {founder.speakerTopics && founder.speakerTopics.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {founder.speakerTopics.slice(0, 2).map((st, i) => (
                        <span key={i} className="text-[10px] px-2 py-0.5 bg-[#07080c] text-slate-400 rounded border border-[#1b1e2c]">
                          {st}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Contact Channels (Email, 𝕏, Details) */}
                  <div className="mt-4 pt-3 border-t border-[#181a26] flex items-center justify-between text-xs">
                    {/* Copy Email Button */}
                    {founder.email ? (
                      <button
                        onClick={() => copyEmail(founder.email, founder.id)}
                        className="flex items-center gap-1.5 text-[11px] text-slate-400 hover:text-slate-200 font-mono transition-colors"
                        title="Click to copy direct email"
                      >
                        {copiedKey === founder.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400 font-semibold">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Mail className="w-3.5 h-3.5 text-amber-400" />
                            <span className="truncate max-w-[140px]">{founder.email}</span>
                          </>
                        )}
                      </button>
                    ) : (
                      <span className="text-[11px] text-slate-500 font-mono">Verified Active</span>
                    )}

                    {/* Social Handles & Details Trigger */}
                    <div className="flex items-center gap-1.5">
                      {founder.twitter && (
                        <a
                          href={founder.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-slate-400 hover:text-white text-xs font-bold px-1.5 py-0.5 rounded bg-[#161824] hover:bg-[#202334] transition-colors"
                          title="Open 𝕏 handle"
                        >
                          𝕏
                        </a>
                      )}
                      <button
                        onClick={() => setSelectedFounderModal(founder)}
                        className="text-[11px] text-indigo-400 hover:text-indigo-300 px-2 py-0.5 rounded bg-[#161824] hover:bg-[#202334] transition-colors font-semibold"
                        title="Quick View Details"
                      >
                        Details
                      </button>
                    </div>
                  </div>

                </div>

                {/* Bottom Actions: Draft Pitch, Save to Pipeline, Direct Clean Connect */}
                <div className="mt-4 pt-3 border-t border-[#181a26] flex items-center justify-between gap-2">
                  
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onSelectFounderForPitch(founder)}
                      className="px-2.5 py-1.5 bg-[#161824] hover:bg-[#202334] text-slate-300 hover:text-white rounded-lg text-xs font-semibold transition-colors"
                    >
                      Draft Pitch
                    </button>

                    <button
                      onClick={() => onAddToPipeline({
                        id: founder.id,
                        name: founder.name,
                        company: founder.company,
                        role: founder.role,
                        sector: founder.sector,
                        email: founder.email,
                        profileUrl: safeLinkedInUrl,
                        notes: `${founder.location} • Topics: ${founder.speakerTopics?.join(', ')}`,
                        status: 'Identified',
                        location: founder.location
                      })}
                      className="px-2 py-1.5 bg-[#161824] hover:bg-[#202334] text-slate-400 hover:text-slate-200 rounded-lg text-xs transition-colors"
                      title="Add to Pipeline CRM"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Guaranteed Direct LinkedIn Button */}
                  <a
                    href={safeLinkedInUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow-sm transition-all group"
                    title={`Connect directly with ${founder.name} on LinkedIn`}
                  >
                    <span>Connect</span>
                    <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>

                </div>

              </div>
            );
          })}
        </div>
      ) : (
        /* Empty / Custom Query Fallback */
        <div className="bg-[#10121a] border border-[#1e212f] rounded-2xl p-8 text-center max-w-xl mx-auto space-y-4 animate-fade-in shadow-xl">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 mx-auto flex items-center justify-center">
            <Search className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white font-heading">
              No Local Profile for "{activeQuery}"
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
              You can search directly across the live Indian ecosystem on LinkedIn or 𝕏 with one click below:
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <a
              href={`https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(activeQuery + ' founder India')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md transition-all"
            >
              <span>Search LinkedIn India</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={() => {
                setActiveQuery('');
                setSearchInput('');
              }}
              className="px-4 py-2 bg-[#161824] hover:bg-[#202334] text-slate-200 border border-[#26293a] rounded-xl text-xs font-semibold transition-colors"
            >
              Reset Filters
            </button>
          </div>
        </div>
      )}

      {/* Founder Details Modal */}
      {selectedFounderModal && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in"
          onClick={() => setSelectedFounderModal(null)}
        >
          <div 
            className="bg-[#10121a] border border-[#2b3044] rounded-2xl max-w-lg w-full p-6 text-slate-100 shadow-2xl relative space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedFounderModal(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-[#181a26] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Profile Overview */}
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-[#181a26] border border-[#2b3044] text-indigo-400 flex items-center justify-center font-bold text-base shrink-0 font-heading">
                {selectedFounderModal.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
              </div>
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-1.5 font-heading">
                  <span>{selectedFounderModal.name}</span>
                  <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                </h3>
                <div className="text-xs text-indigo-300 font-semibold mt-0.5">
                  {selectedFounderModal.role} • {selectedFounderModal.company}
                </div>
                <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-1">
                  <MapPin className="w-3 h-3 text-indigo-400" />
                  <span>{selectedFounderModal.location}</span>
                  <span className="text-slate-600">•</span>
                  <span>{selectedFounderModal.sector}</span>
                </div>
              </div>
            </div>

            {/* Bio */}
            <div>
              <div className="text-[11px] uppercase tracking-wider text-slate-500 font-bold mb-1">
                Executive Background
              </div>
              <p className="text-xs text-slate-300 leading-relaxed bg-[#07080c] p-3 rounded-xl border border-[#1c1f2e]">
                {selectedFounderModal.bio}
              </p>
            </div>

            {/* Keynote & Speaking Topics */}
            {selectedFounderModal.speakerTopics && (
              <div>
                <div className="text-[11px] uppercase tracking-wider text-slate-500 font-bold mb-1.5">
                  Keynote & Speaking Topics
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedFounderModal.speakerTopics.map((topic, i) => (
                    <span key={i} className="text-xs px-2.5 py-1 bg-[#161824] text-slate-200 rounded-lg border border-[#202332]">
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Contact Channels */}
            <div className="pt-3 border-t border-[#1c1f2e] flex items-center justify-between text-xs">
              <div className="text-slate-400">
                Email: <span className="text-white font-mono">{selectedFounderModal.email || 'Verified on LinkedIn'}</span>
              </div>
              <button
                onClick={() => copyModalCard(selectedFounderModal)}
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#161824] hover:bg-[#202334] text-slate-300 hover:text-white transition-colors text-[11px] font-medium"
              >
                {modalCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{modalCopied ? 'Card Copied!' : 'Copy Briefing Card'}</span>
              </button>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                onClick={() => {
                  onSelectFounderForPitch(selectedFounderModal);
                  setSelectedFounderModal(null);
                }}
                className="px-3.5 py-2 bg-[#161824] hover:bg-[#202334] text-slate-200 rounded-xl text-xs font-semibold transition-colors"
              >
                Draft Outreach Message
              </button>

              <a
                href={getSafeLinkedInUrl(selectedFounderModal)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition-all"
              >
                <span>Connect on LinkedIn</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
