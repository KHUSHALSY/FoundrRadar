import React from 'react';
import { Search, ClipboardList, PenTool, BookOpen, Compass, Share2 } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, pipelineCount = 0, confirmedCount = 0 }) {
  const navItems = [
    { id: 'search', label: 'Finder', icon: Search },
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
    <header className="sticky top-0 z-50 bg-[#090a0f]/95 backdrop-blur-md border-b border-[#1c1e28]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          
          {/* Logo & Product Name */}
          <div 
            className="flex items-center gap-2.5 cursor-pointer" 
            onClick={() => setActiveTab('search')}
          >
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-xs">
              <Compass className="w-4 h-4 text-white" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-base font-bold text-white tracking-tight">
                FounderRadar
              </span>
              <span className="text-[10px] font-semibold px-1.5 py-0.2 bg-[#171922] text-slate-400 border border-[#232634] rounded">
                v1.0
              </span>
            </div>
          </div>

          {/* Clean Minimalist Nav Tabs */}
          <nav className="flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-[#1c1e2a] text-white border border-[#2c3042]'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-[#12131a] border border-transparent'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-400' : 'text-slate-500'}`} />
                  <span>{item.label}</span>

                  {/* Badge */}
                  {item.count !== undefined && item.count > 0 && (
                    <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                      item.confirmed > 0 
                        ? 'bg-emerald-500 text-slate-950' 
                        : 'bg-[#232634] text-slate-300'
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
