import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Search, ExternalLink, Copy, Check, Filter, 
  MapPin, Briefcase, Plus, Mail, MessageSquare, 
  CheckCircle2, ArrowUpRight, Sparkles, SlidersHorizontal,
  Share2, X, Building, Globe, Award, UserCheck, ChevronRight,
  Loader2, ArrowRight, ChevronLeft
} from 'lucide-react';
import { CURATED_FOUNDERS } from '../data/curatedFounders';
import { getSafeLinkedInUrl } from '../utils/urlHelper';
import { searchExecutivesWithAI, checkServerGeminiHealth } from '../services/geminiService';

const ITEMS_PER_PAGE = 5;

export default function SearchEngine({ 
  onAddToPipeline, 
  onSelectFounderForPitch
}) {
  const [searchInput, setSearchInput] = useState('');
  const [activeQuery, setActiveQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [copiedKey, setCopiedKey] = useState(null);
  const [selectedFounderModal, setSelectedFounderModal] = useState(null);
  const [modalCopied, setModalCopied] = useState(false);
  const searchInputRef = useRef(null);

  // AI Live Search state
  const [aiFounders, setAiFounders] = useState([]);
  const [isSearchingAI, setIsSearchingAI] = useState(false);
  const [aiSearchError, setAiSearchError] = useState('');

  // Diagnostic Server Status (Checks if GEMINI_API_KEY is working on Vercel)
  const [serverHealth, setServerHealth] = useState(null);

  useEffect(() => {
    checkServerGeminiHealth().then(status => {
      setServerHealth(status);
    }).catch(() => {
      setServerHealth({ ok: false });
    });
  }, []);

  // Global hotkeys & Swipe detection
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (selectedFounderModal) {
          setSelectedFounderModal(null);
        } else {
          setSearchInput('');
          setActiveQuery('');
          setCurrentPage(1);
          searchInputRef.current?.blur();
        }
      }
      if (e.key === '/' && document.activeElement !== searchInputRef.current && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      // Arrow navigation for pages
      if (e.key === 'ArrowRight' && document.activeElement.tagName !== 'INPUT') {
        setCurrentPage(prev => Math.min(prev + 1, totalPages));
      }
      if (e.key === 'ArrowLeft' && document.activeElement.tagName !== 'INPUT') {
        setCurrentPage(prev => Math.max(prev - 1, 1));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  // Handle Swipe Left / Right on mobile
  const handleTouchStart = (e) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 60) {
      // Swiped Left -> Next Page
      setCurrentPage(prev => Math.min(prev + 1, totalPages));
    } else if (diff < -60) {
      // Swiped Right -> Prev Page
      setCurrentPage(prev => Math.max(prev - 1, 1));
    }
  };

  // Execute Search
  const handleExecuteSearch = async (overrideTerm) => {
    const term = typeof overrideTerm === 'string' ? overrideTerm : searchInput;
    const cleanTerm = term.trim();
    if (!cleanTerm) {
      setActiveQuery('');
      setAiFounders([]);
      setCurrentPage(1);
      return;
    }

    setActiveQuery(cleanTerm);
    setCurrentPage(1);
    setIsSearchingAI(true);
    setAiSearchError('');

    try {
      // Trigger AI search to generate 20 targeted, relevant results
      const results = await searchExecutivesWithAI(cleanTerm);
      if (results && results.length > 0) {
        setAiFounders(results);
      }
    } catch (err) {
      console.warn('AI search notice:', err.message);
      setAiSearchError(err.message || 'AI search returned client fallback');
    } finally {
      setIsSearchingAI(false);
    }
  };

  // Combine AI results + Curated Indian directory matching the query
  const combinedFounders = useMemo(() => {
    if (!activeQuery.trim()) {
      // Initial state: show verified curated directory
      return CURATED_FOUNDERS;
    }

    const q = activeQuery.trim().toLowerCase();
    const queryWords = q.split(/\s+/).filter(Boolean);

    // Matching local founders
    const localMatches = CURATED_FOUNDERS.filter(f => {
      return queryWords.some(w => 
        f.name.toLowerCase().includes(w) ||
        f.company.toLowerCase().includes(w) ||
        f.sector.toLowerCase().includes(w) ||
        f.location.toLowerCase().includes(w) ||
        f.bio.toLowerCase().includes(w) ||
        (f.tags && f.tags.some(t => t.toLowerCase().includes(w)))
      );
    });

    // Merge AI results first, followed by matching local founders (de-duplicated by name)
    const seenNames = new Set();
    const merged = [];

    aiFounders.forEach(f => {
      const key = f.name.toLowerCase().trim();
      if (!seenNames.has(key)) {
        seenNames.add(key);
        merged.push(f);
      }
    });

    localMatches.forEach(f => {
      const key = f.name.toLowerCase().trim();
      if (!seenNames.has(key)) {
        seenNames.add(key);
        merged.push(f);
      }
    });

    return merged.length > 0 ? merged : CURATED_FOUNDERS;
  }, [activeQuery, aiFounders]);

  // Pagination calculation (Strictly 5 per page)
  const totalResults = combinedFounders.length;
  const totalPages = Math.max(1, Math.ceil(totalResults / ITEMS_PER_PAGE));
  const pageStartIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const pageEndIndex = pageStartIndex + ITEMS_PER_PAGE;
  const currentFiveFounders = combinedFounders.slice(pageStartIndex, pageEndIndex);

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
    <div 
      className="space-y-6 max-w-5xl mx-auto"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      
      {/* Search Header Banner */}
      <div className="bg-[#10121a] border border-[#1e212f] rounded-2xl p-6 sm:p-8 shadow-xl text-center space-y-4">
        
        {/* Title & Live Status */}
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2">
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center gap-1.5 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-dot" />
              <span>{serverHealth?.ok ? 'Gemini Pro AI Connected' : 'Indian Founder Intelligence Engine'}</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-heading">
            Executive & Founder Discovery
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            Type any startup topic, industry, or role. Powered by Gemini Pro to return 20–30 verified leaders with direct LinkedIn connection access.
          </p>
        </div>

        {/* Clean, Prominent Search Bar with Dedicated Right-Side Button */}
        <div className="max-w-2xl mx-auto mt-4 relative flex items-center shadow-2xl">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          
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
            placeholder="Type your prompt (e.g., 'Fintech founders in Bengaluru', 'Quick Commerce', 'Shark Tank judges')..."
            className="w-full pl-12 pr-28 sm:pr-32 py-4 bg-[#07080c] border-2 border-[#222638] focus:border-indigo-500 rounded-2xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm shadow-inner transition-all font-medium"
          />

          {/* Prominent Search Button on the Right */}
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
            {searchInput && (
              <button
                onClick={() => {
                  setSearchInput('');
                  setActiveQuery('');
                  setAiFounders([]);
                  setCurrentPage(1);
                }}
                className="text-xs text-slate-500 hover:text-slate-300 p-1.5 rounded-lg"
                title="Clear"
              >
                ✕
              </button>
            )}

            <button
              onClick={() => handleExecuteSearch()}
              disabled={isSearchingAI}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 active:scale-95 text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg transition-all shrink-0 cursor-pointer"
            >
              {isSearchingAI ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="hidden sm:inline">Searching...</span>
                </>
              ) : (
                <>
                  <span>Search</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Minimal suggestions (No cluttering buttons) */}
        <div className="text-[11px] text-slate-500 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 pt-1">
          <span>Try searching:</span>
          <button 
            onClick={() => { setSearchInput('Fintech founders in Bengaluru'); handleExecuteSearch('Fintech founders in Bengaluru'); }}
            className="text-slate-400 hover:text-indigo-400 underline decoration-slate-700 underline-offset-2"
          >
            "Fintech founders Bengaluru"
          </button>
          <span>•</span>
          <button 
            onClick={() => { setSearchInput('Quick Commerce unicorn founders'); handleExecuteSearch('Quick Commerce unicorn founders'); }}
            className="text-slate-400 hover:text-indigo-400 underline decoration-slate-700 underline-offset-2"
          >
            "Quick Commerce founders"
          </button>
          <span>•</span>
          <button 
            onClick={() => { setSearchInput('Shark Tank India investors'); handleExecuteSearch('Shark Tank India investors'); }}
            className="text-slate-400 hover:text-indigo-400 underline decoration-slate-700 underline-offset-2"
          >
            "Shark Tank judges"
          </button>
        </div>

        {/* AI Searching Progress State */}
        {isSearchingAI && (
          <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl max-w-md mx-auto text-xs text-indigo-300 flex items-center justify-center gap-2 animate-pulse">
            <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
            <span>Scanning verified ecosystem via Gemini Pro for "{activeQuery}"...</span>
          </div>
        )}

      </div>

      {/* Results Header with Page Count */}
      <div className="flex items-center justify-between px-2 pt-2">
        <div className="flex items-center gap-2">
          <h2 className="text-xs sm:text-sm font-bold text-slate-300 uppercase tracking-wider font-heading">
            {activeQuery ? `Results for "${activeQuery}"` : 'Verified Executive Directory'}
          </h2>
          <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-mono font-semibold">
            {totalResults} Found
          </span>
        </div>

        {/* Page status */}
        <div className="text-xs text-slate-400 font-mono">
          Page <span className="text-white font-bold">{currentPage}</span> of {totalPages} (5 per page)
        </div>
      </div>

      {/* 5 Results Stacked (Clean, High-Readability Card List) */}
      <div className="space-y-4">
        {currentFiveFounders.map((founder, index) => {
          const domainFavicon = founder.domain 
            ? `https://www.google.com/s2/favicons?domain=${founder.domain}&sz=64` 
            : null;
          const safeLinkedInUrl = getSafeLinkedInUrl(founder);

          return (
            <div 
              key={founder.id}
              style={{ animationDelay: `${index * 40}ms` }}
              className="bg-[#10121a] border border-[#1e212f] rounded-2xl p-5 sm:p-6 card-hover animate-fade-in group shadow-md"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                
                {/* Left Profile Info */}
                <div className="flex items-start gap-3.5 flex-1">
                  {/* Initials / Avatar */}
                  <div className="w-12 h-12 rounded-2xl bg-[#161824] border border-[#262939] text-indigo-400 flex items-center justify-center font-bold text-base shrink-0 font-heading shadow-inner group-hover:border-indigo-500/40 transition-colors">
                    {founder.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                  </div>

                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-white text-base sm:text-lg font-heading leading-snug">
                        {founder.name}
                      </h3>
                      <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" title="Verified Profile" />
                      {founder.isAIGenerated && (
                        <span className="px-2 py-0.5 rounded bg-purple-500/20 border border-purple-500/30 text-purple-300 text-[10px] font-bold font-mono">
                          AI Verified
                        </span>
                      )}
                    </div>

                    {/* Company, Role & Favicon */}
                    <div className="flex items-center gap-2 flex-wrap text-xs">
                      {domainFavicon && (
                        <img 
                          src={domainFavicon} 
                          alt={founder.company}
                          onError={(e) => { e.currentTarget.style.display = 'none'; }}
                          className="w-4 h-4 rounded-sm object-contain shrink-0"
                        />
                      )}
                      <span className="text-indigo-300 font-semibold">{founder.company}</span>
                      <span className="text-slate-600">•</span>
                      <span className="text-slate-300 font-medium">{founder.role}</span>
                      <span className="text-slate-600">•</span>
                      <span className="flex items-center gap-1 text-slate-400">
                        <MapPin className="w-3 h-3 text-indigo-400" />
                        <span>{founder.location}</span>
                      </span>
                    </div>

                    {/* Bio */}
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-1 max-w-3xl">
                      {founder.bio}
                    </p>

                    {/* Tags & Keynote Topics */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-2">
                      <span className="px-2 py-0.5 bg-[#161824] text-slate-300 rounded border border-[#202332] text-[10px] font-semibold">
                        {founder.sector}
                      </span>
                      {founder.tags && founder.tags.slice(0, 3).map((tag, i) => (
                        <span key={i} className="text-[10px] px-2 py-0.5 bg-[#07080c] text-slate-400 rounded border border-[#1b1e2c]">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Action Stack */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2.5 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#181a26] shrink-0">
                  
                  {/* Direct LinkedIn Connect Button */}
                  <a
                    href={safeLinkedInUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-md transition-all group"
                    title={`Connect directly with ${founder.name} on LinkedIn`}
                  >
                    <span>Connect</span>
                    <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>

                  {/* Secondary buttons */}
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
                      className="p-1.5 bg-[#161824] hover:bg-[#202334] text-slate-400 hover:text-slate-200 rounded-lg text-xs transition-colors"
                      title="Save to CRM Pipeline"
                    >
                      <Plus className="w-4 h-4" />
                    </button>

                    {founder.email && (
                      <button
                        onClick={() => copyEmail(founder.email, founder.id)}
                        className="p-1.5 bg-[#161824] hover:bg-[#202334] text-amber-400 rounded-lg text-xs transition-colors"
                        title={copiedKey === founder.id ? 'Copied Email!' : `Copy ${founder.email}`}
                      >
                        {copiedKey === founder.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Mail className="w-4 h-4" />}
                      </button>
                    )}
                  </div>

                </div>

              </div>
            </div>
          );
        })}
      </div>

      {/* Modern Swipe & Page Controls Bar (5 per page) */}
      {totalPages > 1 && (
        <div className="bg-[#10121a] border border-[#1e212f] rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
          
          <div className="text-xs text-slate-400 font-mono">
            Showing <span className="text-white font-bold">{pageStartIndex + 1}–{Math.min(pageEndIndex, totalResults)}</span> of {totalResults} leaders
            <span className="hidden sm:inline text-slate-500 ml-2">(Use ← / → keys or swipe on mobile)</span>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                setCurrentPage(prev => Math.max(prev - 1, 1));
                window.scrollTo({ top: 180, behavior: 'smooth' });
              }}
              disabled={currentPage === 1}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#161824] hover:bg-[#202334] disabled:opacity-30 disabled:cursor-not-allowed text-xs font-semibold text-slate-200 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            {/* Page number chips */}
            <div className="flex items-center gap-1 px-1">
              {Array.from({ length: totalPages }).map((_, i) => {
                const pageNum = i + 1;
                // Only show surrounding pages if too many
                if (totalPages > 7 && Math.abs(pageNum - currentPage) > 2 && pageNum !== 1 && pageNum !== totalPages) {
                  return null;
                }
                const isActive = pageNum === currentPage;
                return (
                  <button
                    key={pageNum}
                    onClick={() => {
                      setCurrentPage(pageNum);
                      window.scrollTo({ top: 180, behavior: 'smooth' });
                    }}
                    className={`w-7 h-7 rounded-lg text-xs font-bold font-mono transition-all ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-[#161824] text-slate-400 hover:text-white hover:bg-[#202334]'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => {
                setCurrentPage(prev => Math.min(prev + 1, totalPages));
                window.scrollTo({ top: 180, behavior: 'smooth' });
              }}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#161824] hover:bg-[#202334] disabled:opacity-30 disabled:cursor-not-allowed text-xs font-semibold text-slate-200 transition-colors"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}

      {/* Quick Bio & Contact Modal */}
      {selectedFounderModal && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in"
          onClick={() => setSelectedFounderModal(null)}
        >
          <div 
            className="bg-[#10121a] border border-[#2b3044] rounded-2xl max-w-lg w-full p-6 text-slate-100 shadow-2xl relative space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedFounderModal(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-[#181a26] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

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
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed bg-[#07080c] p-3 rounded-xl border border-[#1c1f2e]">
              {selectedFounderModal.bio}
            </p>

            <div className="pt-2 flex items-center justify-end gap-2.5">
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
