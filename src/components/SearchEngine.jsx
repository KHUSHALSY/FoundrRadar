import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Search, ExternalLink, Copy, Check, Filter, 
  MapPin, Briefcase, Plus, Mail, MessageSquare, 
  CheckCircle2, ArrowUpRight, Sparkles, SlidersHorizontal,
  Share2, X, Building, Globe, Award, UserCheck, ChevronRight
} from 'lucide-react';
import { CURATED_FOUNDERS } from '../data/curatedFounders';

export const SECTORS = [
  'All',
  'AI & Machine Learning',
  'FinTech & Payments',
  'D2C & Consumer',
  'B2B SaaS',
  'DeepTech & EV',
  'Venture Capital & Angels',
  'Creator Economy'
];

export const ROLES = [
  'All Roles',
  'Founder / Co-Founder',
  'CEO / President',
  'Investor / Angel',
  'Keynote Speaker',
  'Solo Builder'
];

export default function SearchEngine({ onAddToPipeline, onSelectFounderForPitch }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState('All');
  const [selectedRole, setSelectedRole] = useState('All Roles');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [sortBy, setSortBy] = useState('curated');
  const [copiedKey, setCopiedKey] = useState(null);
  const [selectedFounderModal, setSelectedFounderModal] = useState(null);
  const [modalCopied, setModalCopied] = useState(false);
  const searchInputRef = useRef(null);

  // Global hotkeys
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (selectedFounderModal) {
          setSelectedFounderModal(null);
        } else {
          setSearchQuery('');
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

  // Quick chips for 1-click discovery
  const popularKeywords = [
    { label: 'All Leaders', query: '' },
    { label: 'AI & Frontier Models', query: 'AI' },
    { label: 'FinTech & Rails', query: 'FinTech' },
    { label: 'D2C Brands', query: 'D2C' },
    { label: 'B2B SaaS', query: 'SaaS' },
    { label: 'Shark Tank & Angels', query: 'Angel' },
    { label: 'Y Combinator', query: 'Y Combinator' },
    { label: 'Bengaluru / India', query: 'Bengaluru' },
    { label: 'Silicon Valley', query: 'San Francisco' }
  ];

  // Multi-term reactive search & filter
  const filteredFounders = useMemo(() => {
    const rawTerms = searchQuery.trim().toLowerCase().split(/\s+/).filter(Boolean);

    let list = CURATED_FOUNDERS.filter(f => {
      // 1. Keyword search (every word must match at least one property)
      const matchesSearch = rawTerms.length === 0 || rawTerms.every(term => {
        return (
          f.name.toLowerCase().includes(term) ||
          f.company.toLowerCase().includes(term) ||
          (f.domain && f.domain.toLowerCase().includes(term)) ||
          f.sector.toLowerCase().includes(term) ||
          f.role.toLowerCase().includes(term) ||
          f.location.toLowerCase().includes(term) ||
          f.bio.toLowerCase().includes(term) ||
          f.tags.some(t => t.toLowerCase().includes(term)) ||
          (f.speakerTopics && f.speakerTopics.some(st => st.toLowerCase().includes(term)))
        );
      });

      // 2. Sector match
      const matchesSector = selectedSector === 'All' || 
        (selectedSector === 'AI & Machine Learning' && (f.sector.includes('AI') || f.tags.includes('AGI') || f.tags.includes('AI Safety'))) ||
        (selectedSector === 'FinTech & Payments' && (f.sector.includes('FinTech') || f.sector.includes('WealthTech') || f.sector.includes('Payment'))) ||
        (selectedSector === 'D2C & Consumer' && (f.sector.includes('D2C') || f.sector.includes('Consumer') || f.sector.includes('Eyewear') || f.sector.includes('Personal Care'))) ||
        (selectedSector === 'B2B SaaS' && (f.sector.includes('SaaS') || f.sector.includes('Developer') || f.sector.includes('Cloud'))) ||
        (selectedSector === 'DeepTech & EV' && (f.sector.includes('CleanTech') || f.sector.includes('Robotics') || f.sector.includes('BioTech') || f.sector.includes('Cybersecurity') || f.sector.includes('EV'))) ||
        (selectedSector === 'Venture Capital & Angels' && (f.sector.includes('Venture') || f.tags.some(t => t.includes('Angel') || t.includes('VC') || t.includes('Seed')))) ||
        (selectedSector === 'Creator Economy' && (f.sector.includes('Creator') || f.sector.includes('Media') || f.tags.includes('Creator Economy')));

      // 3. Role match
      const matchesRole = selectedRole === 'All Roles' ||
        (selectedRole === 'Founder / Co-Founder' && (f.role.includes('Founder') || f.role.includes('Co-Founder'))) ||
        (selectedRole === 'CEO / President' && (f.role.includes('CEO') || f.role.includes('President'))) ||
        (selectedRole === 'Investor / Angel' && (f.tags.some(t => t.includes('Angel') || t.includes('Investor') || t.includes('VC')) || f.role.includes('Investor'))) ||
        (selectedRole === 'Keynote Speaker' && (f.tags.includes('Keynote Speaker') || (f.speakerTopics && f.speakerTopics.length > 0))) ||
        (selectedRole === 'Solo Builder' && (f.tags.includes('Solo Founder') || f.tags.includes('Indie Hacker') || f.tags.includes('Bootstrapped')));

      // 4. Location match
      const matchesLocation = selectedLocation === 'All' ||
        (selectedLocation === 'India' && (f.location.includes('India') || f.location.includes('Bengaluru') || f.location.includes('Delhi') || f.location.includes('Mumbai') || f.location.includes('Chennai'))) ||
        (selectedLocation === 'US' && (f.location.includes('CA') || f.location.includes('San Francisco') || f.location.includes('WA') || f.location.includes('US') || f.location.includes('Venice'))) ||
        (selectedLocation === 'Remote' && (f.location.toLowerCase().includes('remote') || f.location.toLowerCase().includes('global')));

      return matchesSearch && matchesSector && matchesRole && matchesLocation;
    });

    // Sorting
    if (sortBy === 'name-asc') {
      list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'company-asc') {
      list = [...list].sort((a, b) => a.company.localeCompare(b.company));
    }

    return list;
  }, [searchQuery, selectedSector, selectedRole, selectedLocation, sortBy]);

  // Sector counts for category tabs
  const sectorCounts = useMemo(() => {
    const counts = { All: CURATED_FOUNDERS.length };
    SECTORS.forEach(sec => {
      if (sec === 'All') return;
      counts[sec] = CURATED_FOUNDERS.filter(f => {
        if (sec === 'AI & Machine Learning') return f.sector.includes('AI') || f.tags.includes('AGI');
        if (sec === 'FinTech & Payments') return f.sector.includes('FinTech') || f.sector.includes('WealthTech') || f.sector.includes('Payment');
        if (sec === 'D2C & Consumer') return f.sector.includes('D2C') || f.sector.includes('Consumer') || f.sector.includes('Eyewear');
        if (sec === 'B2B SaaS') return f.sector.includes('SaaS') || f.sector.includes('Developer');
        if (sec === 'DeepTech & EV') return f.sector.includes('CleanTech') || f.sector.includes('Robotics') || f.sector.includes('BioTech') || f.sector.includes('Cybersecurity') || f.sector.includes('EV');
        if (sec === 'Venture Capital & Angels') return f.sector.includes('Venture') || f.tags.some(t => t.includes('Angel') || t.includes('VC'));
        if (sec === 'Creator Economy') return f.sector.includes('Creator') || f.sector.includes('Media');
        return false;
      }).length;
    });
    return counts;
  }, []);

  const copyEmail = (email, key) => {
    navigator.clipboard.writeText(email);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const copyModalCard = (founder) => {
    const text = `Executive Briefing: ${founder.name} (${founder.company})\nRole: ${founder.role}\nSector: ${founder.sector}\nLocation: ${founder.location}\nLinkedIn: ${founder.linkedin}\nEmail: ${founder.email}\nKeynote Topics: ${founder.speakerTopics?.join(', ')}`;
    navigator.clipboard.writeText(text);
    setModalCopied(true);
    setTimeout(() => setModalCopied(false), 2000);
  };

  // Safe external search fallback links
  const customLinkedInSearchUrl = useMemo(() => {
    const term = searchQuery.trim() || 'tech founder';
    return `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(term + ' founder')}`;
  }, [searchQuery]);

  const customTwitterSearchUrl = useMemo(() => {
    const term = searchQuery.trim() || 'tech';
    return `https://x.com/search?q=${encodeURIComponent('founder ' + term)}&f=user`;
  }, [searchQuery]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      
      {/* Executive Directory Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-[#111218] border border-[#202330] rounded-xl p-3.5 flex items-center justify-between">
          <div>
            <div className="text-[11px] text-slate-400 font-medium">Verified Executives</div>
            <div className="text-lg font-bold text-white mt-0.5">{CURATED_FOUNDERS.length} Leaders</div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs">
            <UserCheck className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-[#111218] border border-[#202330] rounded-xl p-3.5 flex items-center justify-between">
          <div>
            <div className="text-[11px] text-slate-400 font-medium">LinkedIn Verification</div>
            <div className="text-lg font-bold text-emerald-400 mt-0.5">100% Direct</div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-[#111218] border border-[#202330] rounded-xl p-3.5 flex items-center justify-between">
          <div>
            <div className="text-[11px] text-slate-400 font-medium">Indexed Inboxes</div>
            <div className="text-lg font-bold text-amber-400 mt-0.5">{CURATED_FOUNDERS.filter(f => f.email).length} Direct</div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs">
            <Mail className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-[#111218] border border-[#202330] rounded-xl p-3.5 flex items-center justify-between">
          <div>
            <div className="text-[11px] text-slate-400 font-medium">Dork Garbage</div>
            <div className="text-lg font-bold text-slate-200 mt-0.5">0% (Pure Clean)</div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 flex items-center justify-center font-bold text-xs">
            <Sparkles className="w-4 h-4 text-indigo-400" />
          </div>
        </div>
      </div>

      {/* Main Search & Control Panel */}
      <div className="bg-[#111218] border border-[#202330] rounded-2xl p-5 sm:p-7 shadow-lg">
        
        {/* Header row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Executive & Founder Directory
              </h1>
              <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] text-emerald-400 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-dot" />
                Live Verified
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Connect directly with verified tech founders, investors, and keynote speakers. Tap "Connect" to open their real LinkedIn profile in one clean tab.
            </p>
          </div>
        </div>

        {/* Search Input Bar */}
        <div className="mt-5 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by executive name, company, sector, speaking topic, or alma mater... (Press / to focus)"
            className="w-full pl-11 pr-20 py-3.5 bg-[#090a0f] border border-[#272a38] rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm shadow-inner transition-all"
          />
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {searchQuery ? (
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded bg-[#171922] hover:bg-[#232634] transition-colors"
              >
                Clear
              </button>
            ) : (
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-slate-500 bg-[#171922] border border-[#272a38] rounded">
                /
              </kbd>
            )}
          </div>
        </div>

        {/* Quick Discovery Chips */}
        <div className="mt-3.5 flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] text-slate-500 font-medium mr-1">Quick Picks:</span>
          {popularKeywords.map((kw, i) => {
            const isSelected = (kw.query === '' && searchQuery === '') || (kw.query !== '' && searchQuery.toLowerCase() === kw.query.toLowerCase());
            return (
              <button
                key={i}
                onClick={() => setSearchQuery(kw.query)}
                className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                  isSelected
                    ? 'bg-indigo-600 text-white border-indigo-500 font-medium shadow-sm'
                    : 'bg-[#151720] text-slate-300 border-[#232634] hover:border-slate-600 hover:text-white'
                }`}
              >
                {kw.label}
              </button>
            );
          })}
        </div>

        {/* Sector Tabs Bar with Counts */}
        <div className="mt-5 pt-4 border-t border-[#1c1e28]">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            {SECTORS.map(sec => {
              const isSelected = selectedSector === sec;
              const count = sectorCounts[sec] || 0;
              return (
                <button
                  key={sec}
                  onClick={() => setSelectedSector(sec)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                    isSelected
                      ? 'bg-[#1c1e2a] text-white border border-indigo-500/50 font-semibold shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-[#151720] border border-transparent'
                  }`}
                >
                  <span>{sec}</span>
                  <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                    isSelected ? 'bg-indigo-600 text-white' : 'bg-[#181a24] text-slate-500'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Secondary Filters Bar */}
        <div className="mt-4 pt-3 border-t border-[#1a1c26] flex flex-wrap items-center justify-between gap-3 text-xs">
          
          <div className="flex flex-wrap items-center gap-3">
            {/* Role Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500">Role:</span>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="px-2.5 py-1.5 bg-[#090a0f] border border-[#272a38] rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500 text-xs"
              >
                {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>

            {/* Region Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500">Region:</span>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="px-2.5 py-1.5 bg-[#090a0f] border border-[#272a38] rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500 text-xs"
              >
                <option value="All">All Locations</option>
                <option value="India">India (Bengaluru / Delhi / Mumbai)</option>
                <option value="US">Silicon Valley / United States</option>
                <option value="Remote">Remote & Distributed</option>
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-2.5 py-1.5 bg-[#090a0f] border border-[#272a38] rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500 text-xs"
              >
                <option value="curated">Curated Priority</option>
                <option value="name-asc">Name (A-Z)</option>
                <option value="company-asc">Company (A-Z)</option>
              </select>
            </div>
          </div>

          <div className="text-xs text-slate-400">
            Showing <span className="text-white font-bold">{filteredFounders.length}</span> of {CURATED_FOUNDERS.length} leaders
          </div>

        </div>

      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between px-1">
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
          <span>{searchQuery ? `Matching "${searchQuery}"` : `${selectedSector} Directory`}</span>
          <span className="text-indigo-400">({filteredFounders.length})</span>
        </h2>
        <span className="text-[11px] text-slate-500 hidden sm:inline-block">
          One-tap clean navigation directly to verified profiles
        </span>
      </div>

      {/* Profiles Grid with Stagger Animation */}
      {filteredFounders.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFounders.map((founder, index) => {
            const domainFavicon = founder.domain 
              ? `https://www.google.com/s2/favicons?domain=${founder.domain}&sz=64` 
              : null;

            return (
              <div 
                key={founder.id}
                style={{ animationDelay: `${Math.min(index * 25, 300)}ms` }}
                className="bg-[#111218] border border-[#202330] rounded-xl p-5 flex flex-col justify-between card-hover animate-fade-in group"
              >
                <div>
                  {/* Top Header: Initials + Company Favicon + Verification */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {/* Initials Avatar */}
                      <div className="w-11 h-11 rounded-xl bg-[#171924] border border-[#262939] text-indigo-400 flex items-center justify-center font-bold text-sm shrink-0 shadow-inner group-hover:border-indigo-500/40 transition-colors">
                        {founder.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                      </div>

                      <div>
                        <h3 className="font-bold text-white text-sm sm:text-base flex items-center gap-1.5 leading-snug">
                          <span>{founder.name}</span>
                          <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" title="Direct LinkedIn Verified" />
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
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                      <span>{founder.location}</span>
                    </span>
                    <span className="text-slate-600">•</span>
                    <span className="px-2 py-0.5 bg-[#171922] text-slate-300 rounded border border-[#232634] text-[10px]">
                      {founder.sector}
                    </span>
                  </div>

                  {/* Bio with subtle hover clamp */}
                  <p className="mt-3 text-xs text-slate-300 leading-relaxed line-clamp-2">
                    {founder.bio}
                  </p>

                  {/* Keynote / Advisory Topics */}
                  {founder.speakerTopics && founder.speakerTopics.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {founder.speakerTopics.slice(0, 2).map((st, i) => (
                        <span key={i} className="text-[10px] px-2 py-0.5 bg-[#090a0f] text-slate-400 rounded border border-[#1e202b]">
                          {st}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Contact Channels (Email, 𝕏, Reddit, Details Modal) */}
                  <div className="mt-4 pt-3 border-t border-[#1a1c26] flex items-center justify-between text-xs">
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
                      <span className="text-[11px] text-slate-500">Direct LinkedIn Inbox</span>
                    )}

                    {/* Social Handles & Quick View */}
                    <div className="flex items-center gap-1.5">
                      {founder.twitter && (
                        <a
                          href={founder.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-slate-400 hover:text-white text-xs font-bold px-1.5 py-0.5 rounded bg-[#171922] hover:bg-[#232634] transition-colors"
                          title="Open verified 𝕏 handle"
                        >
                          𝕏
                        </a>
                      )}
                      {founder.reddit && (
                        <a
                          href={founder.reddit}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-slate-400 hover:text-orange-400 text-xs px-1.5 py-0.5 rounded bg-[#171922] hover:bg-[#232634] transition-colors"
                          title="Reddit Community"
                        >
                          🤖
                        </a>
                      )}
                      <button
                        onClick={() => setSelectedFounderModal(founder)}
                        className="text-[11px] text-indigo-400 hover:text-indigo-300 px-1.5 py-0.5 rounded bg-[#171922] hover:bg-[#232634] transition-colors font-medium"
                        title="Quick View Details"
                      >
                        Details
                      </button>
                    </div>
                  </div>

                </div>

                {/* Bottom Actions: Draft Pitch, Save to Pipeline, Direct Clean Connect */}
                <div className="mt-4 pt-3 border-t border-[#1c1e28] flex items-center justify-between gap-2">
                  
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onSelectFounderForPitch(founder)}
                      className="px-2.5 py-1.5 bg-[#171922] hover:bg-[#232634] text-slate-300 hover:text-white rounded-lg text-xs font-medium transition-colors"
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
                        profileUrl: founder.linkedin,
                        notes: `${founder.location} • Topics: ${founder.speakerTopics?.join(', ')}`,
                        status: 'Identified',
                        location: founder.location
                      })}
                      className="px-2 py-1.5 bg-[#171922] hover:bg-[#232634] text-slate-400 hover:text-slate-200 rounded-lg text-xs transition-colors"
                      title="Add to Pipeline CRM"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* THE MAIN ACTION: Direct Clean LinkedIn Navigation */}
                  <a
                    href={founder.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow-sm transition-all group"
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
        /* Empty / Custom Query Fallback Card with Direct Live Links */
        <div className="bg-[#111218] border border-[#232634] rounded-2xl p-8 text-center max-w-xl mx-auto space-y-4 animate-fade-in shadow-xl">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 mx-auto flex items-center justify-center">
            <Search className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">
              No Local Match for "{searchQuery}"
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
              Our curated directory has {CURATED_FOUNDERS.length} verified executive profiles. You can instantly run a clean direct live search on LinkedIn or 𝕏 with one click below:
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <a
              href={customLinkedInSearchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md transition-all"
            >
              <span>Search LinkedIn for "{searchQuery}"</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>

            <a
              href={customTwitterSearchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#171922] hover:bg-[#232634] text-slate-200 border border-[#272a38] rounded-xl text-xs font-semibold transition-colors"
            >
              <span>Search 𝕏 Handles</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
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
            className="bg-[#111218] border border-[#2c3042] rounded-2xl max-w-lg w-full p-6 text-slate-100 shadow-2xl relative space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedFounderModal(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-[#1a1c26] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Profile Overview */}
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-[#1c1e2a] border border-[#2c3042] text-indigo-400 flex items-center justify-center font-bold text-base shrink-0">
                {selectedFounderModal.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
              </div>
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-1.5">
                  <span>{selectedFounderModal.name}</span>
                  <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                </h3>
                <div className="text-xs text-indigo-300 font-semibold mt-0.5">
                  {selectedFounderModal.role} • {selectedFounderModal.company}
                </div>
                <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-1">
                  <MapPin className="w-3 h-3 text-slate-500" />
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
              <p className="text-xs text-slate-300 leading-relaxed bg-[#090a0f] p-3 rounded-xl border border-[#1e202b]">
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
                    <span key={i} className="text-xs px-2.5 py-1 bg-[#171922] text-slate-200 rounded-lg border border-[#232634]">
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Contact Channels */}
            <div className="pt-3 border-t border-[#1e202b] flex items-center justify-between text-xs">
              <div className="text-slate-400">
                Email: <span className="text-white font-mono">{selectedFounderModal.email || 'Via LinkedIn InMail'}</span>
              </div>
              <button
                onClick={() => copyModalCard(selectedFounderModal)}
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#171922] hover:bg-[#232634] text-slate-300 hover:text-white transition-colors text-[11px]"
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
                className="px-3.5 py-2 bg-[#171922] hover:bg-[#232634] text-slate-200 rounded-xl text-xs font-semibold transition-colors"
              >
                Draft Outreach Message
              </button>

              <a
                href={selectedFounderModal.linkedin}
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
