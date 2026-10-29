import React, { useState, useMemo } from 'react';
import { 
  Users, Search, Filter, MapPin, 
  ExternalLink, Plus, Check, Sparkles, 
  Award, Briefcase, Globe
} from 'lucide-react';
import { CURATED_FOUNDERS } from '../data/curatedFounders';

export default function CuratedDirectory({ onAddToPipeline, onSelectFounderForPitch, pipelineItems = [] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState('All');
  const [filterAngelsOnly, setFilterAngelsOnly] = useState(false);
  const [filterYC, setFilterYC] = useState(false);

  const pipelineIds = useMemo(() => new Set(pipelineItems.map(p => p.id || p.name)), [pipelineItems]);

  const sectors = useMemo(() => {
    const list = new Set(['All']);
    CURATED_FOUNDERS.forEach(f => {
      const parts = f.sector.split('/');
      parts.forEach(p => list.add(p.trim()));
    });
    return Array.from(list);
  }, []);

  const filteredFounders = useMemo(() => {
    return CURATED_FOUNDERS.filter(f => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = !q || 
        f.name.toLowerCase().includes(q) ||
        f.company.toLowerCase().includes(q) ||
        f.location.toLowerCase().includes(q) ||
        f.sector.toLowerCase().includes(q) ||
        f.tags.some(t => t.toLowerCase().includes(q)) ||
        f.speakerTopics.some(st => st.toLowerCase().includes(q));

      const matchesSector = selectedSector === 'All' || f.sector.includes(selectedSector);
      const matchesAngels = !filterAngelsOnly || f.tags.includes('Angel Investor') || f.tags.includes('Top Angel Investor');
      const matchesYC = !filterYC || f.tags.includes('Y Combinator') || f.tags.includes('Thiel Fellow');

      return matchesSearch && matchesSector && matchesAngels && matchesYC;
    });
  }, [searchQuery, selectedSector, filterAngelsOnly, filterYC]);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-2">
            <Users className="w-3.5 h-3.5" />
            <span>Curated Executive & Founder Database</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            Pre-Vetted Founders, Operators & Investors
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Discover verified unicorn founders, active angel syndicates, YC alumni, and keynote speakers.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-2xl font-black text-indigo-400">{filteredFounders.length}</span>
            <span className="text-xs text-slate-400 block">Profiles Indexed</span>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
        
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by founder name, venture, location, or speaking topic..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs text-slate-400 font-medium">Quick Filters:</span>
            
            <button
              onClick={() => setFilterAngelsOnly(!filterAngelsOnly)}
              className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all flex items-center gap-1.5 ${
                filterAngelsOnly 
                  ? 'bg-amber-600 text-white border-amber-500 shadow-sm'
                  : 'bg-slate-950 text-slate-400 border-slate-700 hover:text-slate-200'
              }`}
            >
              <span>Angel Investors 💰</span>
            </button>

            <button
              onClick={() => setFilterYC(!filterYC)}
              className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all flex items-center gap-1.5 ${
                filterYC 
                  ? 'bg-orange-600 text-white border-orange-500 shadow-sm'
                  : 'bg-slate-950 text-slate-400 border-slate-700 hover:text-slate-200'
              }`}
            >
              <span>YC / Thiel Fellows 🚀</span>
            </button>
          </div>

          {/* Sector Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Sector:</span>
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 text-xs focus:ring-1 focus:ring-indigo-500"
            >
              {sectors.map((s, i) => (
                <option key={i} value={s}>{s}</option>
              ))}
            </select>
          </div>

        </div>

      </div>

      {/* Founders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredFounders.map((f) => {
          const isAdded = pipelineIds.has(f.id) || pipelineIds.has(f.name);
          return (
            <div 
              key={f.id} 
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 shadow-lg flex flex-col justify-between transition-all group hover:-translate-y-0.5"
            >
              <div>
                {/* Header row */}
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <h3 className="font-extrabold text-white text-base group-hover:text-indigo-400 transition-colors">
                      {f.name}
                    </h3>
                    <p className="text-xs font-semibold text-indigo-300 mt-0.5">
                      {f.role}
                    </p>
                    <p className="text-xs text-slate-300 font-medium">
                      {f.company}
                    </p>
                  </div>

                  <span className="shrink-0 px-2 py-0.5 text-[10px] font-semibold bg-slate-800 text-slate-300 rounded-md">
                    {f.location.split(',')[0]}
                  </span>
                </div>

                {/* Location */}
                <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-2">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{f.location}</span>
                </div>

                {/* Bio */}
                <p className="text-xs text-slate-300 mt-3 line-clamp-2 leading-relaxed">
                  {f.bio}
                </p>

                {/* Keynote Topics */}
                <div className="mt-3">
                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-1.5">
                    Advisory & Discussion Topics:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {f.speakerTopics.map((topic, idx) => (
                      <span 
                        key={idx}
                        className="text-[10px] px-2 py-0.5 bg-slate-950 text-slate-300 border border-slate-800 rounded-md"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Tags */}
                <div className="mt-3 flex flex-wrap gap-1">
                  {f.tags.map((t, idx) => (
                    <span key={idx} className="text-[9px] px-1.5 py-0.5 bg-slate-800/80 text-slate-400 rounded">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between gap-2">
                
                {/* Social links */}
                <div className="flex items-center gap-2">
                  {f.linkedin && (
                    <a
                      href={f.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      title="View LinkedIn Profile"
                      className="p-1.5 rounded-lg bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-500/30 text-xs font-semibold flex items-center gap-1 transition-all"
                    >
                      <span>In</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                  {f.twitter && (
                    <a
                      href={f.twitter}
                      target="_blank"
                      rel="noreferrer"
                      title="View 𝕏 / Twitter Profile"
                      className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-700 text-xs font-bold transition-all"
                    >
                      <span>𝕏</span>
                    </a>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onSelectFounderForPitch(f)}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg font-medium transition-all"
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
                      profileUrl: f.linkedin || f.twitter,
                      notes: `${f.location} • Topics: ${f.speakerTopics.join(', ')}`,
                      status: 'Identified',
                      location: f.location
                    })}
                    disabled={isAdded}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                      isAdded 
                        ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30 cursor-default'
                        : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-3 h-3" />
                        <span>In CRM</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3 h-3" />
                        <span>Add to CRM</span>
                      </>
                    )}
                  </button>
                </div>

              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
