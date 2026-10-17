import React from 'react';
import { Search, Users, ClipboardList, PenTool, BookOpen, Sparkles, Compass } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, pipelineCount = 0, confirmedCount = 0 }) {
  const navItems = [
    { id: 'search', label: 'Search Engine', icon: Search },
    { id: 'directory', label: 'Curated Directory', icon: Users },
    { 
      id: 'pipeline', 
      label: 'Outreach Pipeline', 
      icon: ClipboardList, 
      count: pipelineCount,
      confirmed: confirmedCount 
    },
    { id: 'generator', label: 'Message Crafter', icon: PenTool },
    { id: 'playbook', label: 'Executive Playbook', icon: BookOpen },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Product Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('search')}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-rose-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <Compass className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                  FounderRadar
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 rounded-full tracking-wide uppercase">
                  Pro
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Multi-Platform Executive Outreach & Intelligence Engine
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center gap-1 sm:gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative flex items-center gap-2 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-600/15 text-indigo-300 border border-indigo-500/30 shadow-sm shadow-indigo-500/10'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                  <span className="hidden md:inline">{item.label}</span>
                  {item.id === 'search' && <span className="md:hidden">Search</span>}
                  {item.id === 'directory' && <span className="md:hidden">Directory</span>}
                  {item.id === 'pipeline' && <span className="md:hidden">CRM</span>}
                  {item.id === 'generator' && <span className="md:hidden">Pitch</span>}
                  {item.id === 'playbook' && <span className="md:hidden">Playbook</span>}

                  {/* Badge */}
                  {item.count !== undefined && item.count > 0 && (
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                      item.confirmed > 0 
                        ? 'bg-emerald-500 text-slate-950 font-black' 
                        : 'bg-indigo-500/30 text-indigo-300'
                    }`}>
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

        </div>
      </div>
    </header>
  );
}
