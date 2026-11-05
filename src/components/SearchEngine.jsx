import React, { useState, useMemo } from 'react';
import { 
  Search, ExternalLink, Copy, Check, Filter, 
  MapPin, Briefcase, Plus, Mail, MessageSquare, 
  CheckCircle2, ArrowUpRight, Sparkles, SlidersHorizontal,
  Share2
} from 'lucide-react';
import { CURATED_FOUNDERS } from '../data/curatedFounders';

export const SECTORS = [
  'All',
  'AI & Machine Learning',
  'FinTech & Payments',
  'D2C & Consumer',
  'B2B SaaS',
  'CleanTech & EV',
  'Creator Economy',
  'Venture Capital'
];

export const ROLES = [
  'All Roles',
  'Founder / CEO',
  'Investor / Angel',
  'Keynote Speaker',
  'Solo Builder'
];

export default function SearchEngine({ onAddToPipeline, onSelectFounderForPitch }) {
  const [searchQuery, setSearchQuery] = useState('AI');
  const [selectedSector, setSelectedSector] = useState('All');
  const [selectedRole, setSelectedRole] = useState('All Roles');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [copiedKey, setCopiedKey] = useState(null);
  const searchInputRef = React.useRef(null);

  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSearchQuery('');
        searchInputRef.current?.blur();
      }
      if (e.key === '/' && document.activeElement !== searchInputRef.current && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Quick chips
  const popularKeywords = ['AI & LLMs', 'FinTech', 'D2C Brands', 'B2B SaaS', 'Solo Builders', 'Angel Investors'];

  // Filter logic
  const filteredFounders = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return CURATED_FOUNDERS.filter(f => {
      // Keyword match
      const matchesSearch = !q ||
        f.name.toLowerCase().includes(q) ||
        f.company.toLowerCase().includes(q) ||
        f.sector.toLowerCase().includes(q) ||
        f.location.toLowerCase().includes(q) ||
        f.bio.toLowerCase().includes(q) ||
        f.tags.some(t => t.toLowerCase().includes(q)) ||
        f.speakerTopics.some(st => st.toLowerCase().includes(q));

      // Sector match
      const matchesSector = selectedSector === 'All' || 
        f.sector.toLowerCase().includes(selectedSector.toLowerCase()) ||
        (selectedSector === 'D2C & Consumer' && f.sector.includes('D2C')) ||
        (selectedSector === 'B2B SaaS' && f.sector.includes('SaaS'));

      // Role match
      const matchesRole = selectedRole === 'All Roles' ||
        (selectedRole === 'Founder / CEO' && (f.role.includes('Founder') || f.role.includes('CEO'))) ||
        (selectedRole === 'Investor / Angel' && (f.tags.includes('Angel Investor') || f.tags.includes('Top Angel Investor') || f.tags.includes('Seed Investor'))) ||
        (selectedRole === 'Keynote Speaker' && f.tags.includes('Keynote Speaker')) ||
        (selectedRole === 'Solo Builder' && f.tags.includes('Solo Founder'));

      // Location match
      const matchesLocation = selectedLocation === 'All' ||
        (selectedLocation === 'US' && (f.location.includes('CA') || f.location.includes('San Francisco') || f.location.includes('US'))) ||
        (selectedLocation === 'India' && (f.location.includes('India') || f.location.includes('Bengaluru') || f.location.includes('Delhi') || f.location.includes('Mumbai'))) ||
        (selectedLocation === 'Remote' && f.location.toLowerCase().includes('remote'));

      return matchesSearch && matchesSector && matchesRole && matchesLocation;
    });
  }, [searchQuery, selectedSector, selectedRole, selectedLocation]);

  const copyEmail = (email, key) => {
    navigator.clipboard.writeText(email);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Generate clean direct LinkedIn search URL if user searches something unique with 0 direct matches
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
      
      {/* Search Header */}
      <div className="bg-[#111218] border border-[#232634] rounded-2xl p-6 sm:p-8">
        <div className="max-w-2xl">
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Founder & Executive Directory
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Search top founders, investors, and operators. Direct access to verified LinkedIn profiles, 𝕏 handles, and contact channels.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mt-5 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            ref={searchInputRef}
          type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search founders by industry or company... (Press / to focus)"
            className="w-full pl-11 pr-4 py-3 bg-[#090a0f] border border-[#272a38] rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm shadow-inner"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 pointer-events-none">
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-slate-500 bg-[#171922] border border-[#272a38] rounded">
              /
            </kbd>
          </div>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-slate-300 px-1.5 py-0.5 rounded"
            >
              Clear
            </button>
          )}
        </div>

        {/* Popular Category Chips */}
        <div className="mt-3.5 flex flex-wrap gap-2 items-center">
          <span className="text-xs text-slate-500 font-medium">Quick filters:</span>
          {popularKeywords.map((kw, i) => (
            <button
              key={i}
              onClick={() => setSearchQuery(kw === 'AI & LLMs' ? 'AI' : kw)}
              className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                searchQuery.toLowerCase() === kw.toLowerCase() || (kw === 'AI & LLMs' && searchQuery === 'AI')
                  ? 'bg-indigo-600 text-white border-indigo-500 font-medium'
                  : 'bg-[#151720] text-slate-300 border-[#232634] hover:border-slate-600 hover:text-white'
              }`}
            >
              {kw}
            </button>
          ))}
        </div>

        {/* Filter Row */}
        <div className="mt-5 pt-4 border-t border-[#1c1e28] flex flex-wrap items-center justify-between gap-3 text-xs">
          
          <div className="flex flex-wrap items-center gap-3">
            {/* Sector */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500">Sector:</span>
              <select
                value={selectedSector}
                onChange={(e) => setSelectedSector(e.target.value)}
                className="px-2.5 py-1.5 bg-[#090a0f] border border-[#272a38] rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            {/* Role */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500">Role:</span>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="px-2.5 py-1.5 bg-[#090a0f] border border-[#272a38] rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>

            {/* Region */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500">Location:</span>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="px-2.5 py-1.5 bg-[#090a0f] border border-[#272a38] rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="All">All Regions</option>
                <option value="US">United States / Silicon Valley</option>
                <option value="India">India (Bengaluru / Delhi / Mumbai)</option>
                <option value="Remote">Remote & Distributed</option>
              </select>
            </div>
          </div>

          <div className="text-slate-400 font-medium">
            Found <span className="text-white font-bold">{filteredFounders.length}</span> profiles
          </div>

        </div>

      </div>

      {/* Results Count Banner */}
      <div className="flex items-center justify-between px-1">
        <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
          {searchQuery ? `Results for "${searchQuery}"` : 'All Verified Founders'}
        </h2>
        <span className="text-xs text-slate-500">
          Click "Connect" to open verified profiles directly
        </span>
      </div>

      {/* Profiles Grid */}
      {filteredFounders.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFounders.map((founder) => (
            <div 
              key={founder.id}
              className="bg-[#111218] border border-[#232634] hover:border-[#373c4f] rounded-xl p-5 flex flex-col justify-between transition-all duration-150 hover:-translate-y-0.5"
            >
              <div>
                {/* Profile Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {/* Initials Avatar */}
                    <div className="w-10 h-10 rounded-xl bg-[#1c1e2a] border border-[#272a38] text-indigo-400 flex items-center justify-center font-bold text-sm shrink-0">
                      {founder.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                    </div>

                    <div>
                      <h3 className="font-bold text-white text-sm sm:text-base flex items-center gap-1.5">
                        <span>{founder.name}</span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" title="Verified Profile" />
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        <span className="text-slate-200 font-medium">{founder.role}</span>
                        <span className="text-slate-500 mx-1">•</span>
                        <span className="text-indigo-300">{founder.company}</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Location & Sector */}
                <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-500" />
                    <span>{founder.location}</span>
                  </span>
                  <span className="text-slate-600">•</span>
                  <span className="px-2 py-0.5 bg-[#171922] text-slate-300 rounded border border-[#232634]">
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
                      <span key={i} className="text-[10px] px-2 py-0.5 bg-[#090a0f] text-slate-400 rounded border border-[#1e202b]">
                        {st}
                      </span>
                    ))}
                  </div>
                )}

                {/* Contact Channels (Email, 𝕏, Reddit) */}
                <div className="mt-4 pt-3 border-t border-[#1a1c26] flex items-center justify-between text-xs">
                  {/* Email */}
                  {founder.email ? (
                    <button
                      onClick={() => copyEmail(founder.email, founder.id)}
                      className="flex items-center gap-1.5 text-[11px] text-slate-400 hover:text-slate-200 font-mono"
                      title="Click to copy email"
                    >
                      <Mail className="w-3.5 h-3.5 text-amber-400" />
                      <span>{copiedKey === founder.id ? 'Copied Email!' : founder.email}</span>
                    </button>
                  ) : (
                    <span className="text-[11px] text-slate-600">LinkedIn Contact</span>
                  )}

                  {/* Social Handles */}
                  <div className="flex items-center gap-2">
                    {founder.twitter && (
                      <a
                        href={founder.twitter}
                        target="_blank"
                        rel="noreferrer"
                        className="text-slate-400 hover:text-white text-xs font-bold px-1.5 py-0.5 rounded bg-[#171922] hover:bg-[#232634]"
                        title="Open 𝕏 / Twitter"
                      >
                        𝕏
                      </a>
                    )}
                    {founder.reddit && (
                      <a
                        href={founder.reddit}
                        target="_blank"
                        rel="noreferrer"
                        className="text-slate-400 hover:text-orange-400 text-xs px-1.5 py-0.5 rounded bg-[#171922] hover:bg-[#232634]"
                        title="Reddit Community"
                      >
                        🤖
                      </a>
                    )}
                  </div>
                </div>

              </div>

              {/* Action Buttons (Connect, Pitch, Save) */}
              <div className="mt-4 pt-3 border-t border-[#1c1e28] flex items-center justify-between gap-2">
                
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onSelectFounderForPitch(founder)}
                    className="px-2.5 py-1.5 bg-[#171922] hover:bg-[#232634] text-slate-300 hover:text-white rounded-lg text-xs font-medium"
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
                    className="px-2 py-1.5 bg-[#171922] hover:bg-[#232634] text-slate-400 hover:text-slate-200 rounded-lg text-xs"
                    title="Add to Pipeline CRM"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* THE MAIN ACTION: Connect directly on LinkedIn */}
                <a
                  href={founder.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow-sm"
                >
                  <span>Connect</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>

              </div>

            </div>
          ))}
        </div>
      ) : (
        /* Empty / Custom Query Fallback Card with Direct LinkedIn Search */
        <div className="bg-[#111218] border border-[#232634] rounded-2xl p-8 text-center max-w-xl mx-auto space-y-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 mx-auto flex items-center justify-center">
            <Search className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">
              Search "{searchQuery}" on LinkedIn & 𝕏
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              No pre-indexed card directly matching this exact phrase in our directory, but you can jump straight to live results on LinkedIn or Twitter with one click.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <a
              href={customLinkedInSearchUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold"
            >
              <span>Search LinkedIn for "{searchQuery}"</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>

            <a
              href={customTwitterSearchUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#171922] hover:bg-[#232634] text-slate-200 border border-[#272a38] rounded-xl text-xs font-semibold"
            >
              <span>Search 𝕏 Users</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      )}

    </div>
  );
}
