import React from 'react';
import { Search, ClipboardList, PenTool, BookOpen, Compass } from 'lucide-react';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  pipelineCount = 0, 
  confirmedCount = 0
}) {
  const navItems = [
    { id: 'search', label: 'Ecosystem Finder', icon: Search },
    { 
      id: 'pipeline', 
      label: 'Pipeline CRM', 
      icon: ClipboardList, 
      count: pipelineCount,
      confirmed: confirmedCount 
    },
    { id: 'generator', label: 'Message Crafter', icon: PenTool },
    { id: 'playbook', label: 'Outreach Playbook', icon: BookOpen },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#07080c]/95 backdrop-blur-md border-b border-[#1c1f2e]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          
          {/* Brand Name: foundrRadar */}
          <div 
            className="flex items-center gap-2.5 cursor-pointer group" 
            onClick={() => setActiveTab('search')}
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-xs shadow-md group-hover:scale-105 transition-transform">
              <Compass className="w-4 h-4 text-white" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-extrabold tracking-tight font-heading">
                <span className="text-white">foundr</span>
                <span className="text-indigo-400">Radar</span>
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-md flex items-center gap-1">
                <span>🇮🇳</span>
                <span className="hidden sm:inline">India Ecosystem</span>
              </span>
            </div>
          </div>

          {/* Clean Minimalist Nav Tabs */}
          <nav className="flex items-center gap-1 sm:gap-2" aria-label="Main Navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[#181a26] text-white border border-[#2b3044] shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-[#12141d] border border-transparent'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-400' : 'text-slate-500'}`} />
                  <span className="hidden sm:inline">{item.label}</span>

                  {/* CRM Badge */}
                  {item.count !== undefined && item.count > 0 && (
                    <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                      item.confirmed > 0 
                        ? 'bg-emerald-500 text-slate-950' 
                        : 'bg-[#232638] text-slate-300'
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
