import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import SearchEngine from './components/SearchEngine';
import PipelineCRM from './components/PipelineCRM';
import PitchGenerator from './components/PitchGenerator';
import Playbook from './components/Playbook';
import SplashScreen from './components/SplashScreen';

const STORAGE_KEY = 'foundrradar_pipeline_v3';

const INITIAL_PIPELINE = [
  {
    id: 'f-in-kunal',
    name: 'Kunal Shah',
    company: 'CRED',
    role: 'Founder & CEO',
    sector: 'FinTech & Payments',
    location: 'Bengaluru, India',
    email: 'kunal@cred.club',
    status: 'Call Scheduled',
    profileUrl: 'https://www.linkedin.com/search/results/people/?keywords=Kunal%20Shah%20CRED',
    notes: 'Keynote discussion on Delta 4 framework and Indian consumer moats.'
  },
  {
    id: 'f-in-aman',
    name: 'Aman Gupta',
    company: 'boAt Lifestyle',
    role: 'Co-Founder & CMO',
    sector: 'D2C / Consumer Electronics',
    location: 'New Delhi, India',
    email: 'aman@boat-lifestyle.com',
    status: 'Contacted (LinkedIn)',
    profileUrl: 'https://www.linkedin.com/search/results/people/?keywords=Aman%20Gupta%20boAt%20Lifestyle',
    notes: 'Sent personalized connect note. Reached out regarding annual growth fireside chat.'
  },
  {
    id: 'f-in-deepinder',
    name: 'Deepinder Goyal',
    company: 'Zomato',
    role: 'Founder & CEO',
    sector: 'Consumer Tech / Quick Commerce',
    location: 'Gurugram, India',
    email: 'deepinder@zomato.com',
    status: 'Confirmed',
    profileUrl: 'https://www.linkedin.com/search/results/people/?keywords=Deepinder%20Goyal%20Zomato',
    notes: 'Confirmed 35-min keynote address on hyperlocal quick commerce logistics.'
  }
];

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState('search');
  const [pipeline, setPipeline] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_PIPELINE;
    } catch {
      return INITIAL_PIPELINE;
    }
  });

  const [selectedFounderForPitch, setSelectedFounderForPitch] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(pipeline));
    } catch (e) {
      console.error("Failed to save pipeline", e);
    }
  }, [pipeline]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleAddToPipeline = (lead) => {
    const exists = pipeline.some(p => p.id === lead.id || (p.name && p.name.toLowerCase() === lead.name.toLowerCase()));
    if (exists) {
      showToast(`${lead.name} is already in your pipeline!`);
      return;
    }

    const updated = [lead, ...pipeline];
    setPipeline(updated);
    showToast(`Added ${lead.name} to CRM pipeline`);
  };

  const handleUpdateStatus = (id, newStatus) => {
    setPipeline(prev => prev.map(p => p.id === id ? { ...p, status: newStatus } : p));
    showToast(`Stage updated to ${newStatus}`);
  };

  const handleUpdateNotes = (id, notes) => {
    setPipeline(prev => prev.map(p => p.id === id ? { ...p, notes } : p));
    showToast('Outreach log saved');
  };

  const handleRemoveItem = (id) => {
    setPipeline(prev => prev.filter(p => p.id !== id));
    showToast('Removed from pipeline');
  };

  const handleClearPipeline = () => {
    setPipeline([]);
    showToast('Pipeline cleared');
  };

  const handleSelectFounderForPitch = (founder) => {
    setSelectedFounderForPitch(founder);
    setActiveTab('generator');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast(`Loaded ${founder.name} in Message Crafter`);
  };

  const confirmedCount = pipeline.filter(p => p.status === 'Confirmed').length;

  return (
    <div className="min-h-screen bg-[#07080c] text-slate-100 flex flex-col font-sans selection:bg-indigo-600 selection:text-white">
      
      {/* Bold Smooth Splash Screen on Initial Load */}
      {showSplash && (
        <SplashScreen onComplete={() => setShowSplash(false)} />
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#141622] border border-[#262a3e] text-white px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-2xl">
          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage('')} className="ml-1 text-slate-400 hover:text-white text-xs">✕</button>
        </div>
      )}

      {/* Main Interface (Rolls out smoothly) */}
      <div className={`flex flex-col min-h-screen transition-opacity duration-700 ${showSplash ? 'opacity-0' : 'opacity-100 animate-fade-in'}`}>
        {/* Top Navbar */}
        <Navbar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
          pipelineCount={pipeline.length}
          confirmedCount={confirmedCount}
        />

        {/* Main Content View */}
        <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
          {activeTab === 'search' && (
            <SearchEngine 
              onAddToPipeline={handleAddToPipeline} 
              onSelectFounderForPitch={handleSelectFounderForPitch}
            />
          )}

          {activeTab === 'pipeline' && (
            <PipelineCRM 
              pipeline={pipeline} 
              onUpdateStatus={handleUpdateStatus} 
              onUpdateNotes={handleUpdateNotes} 
              onRemoveItem={handleRemoveItem} 
              onClearPipeline={handleClearPipeline}
              onSelectFounderForPitch={handleSelectFounderForPitch}
            />
          )}

          {activeTab === 'generator' && (
            <PitchGenerator 
              selectedFounder={selectedFounderForPitch} 
              pipeline={pipeline}
            />
          )}

          {activeTab === 'playbook' && (
            <Playbook />
          )}
        </main>

        {/* Minimalist Footer */}
        <footer className="mt-auto border-t border-[#161824] py-6 px-4 sm:px-6 text-xs text-slate-500">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-slate-300 font-bold font-heading">foundrRadar</span>
              <span>•</span>
              <span>India's Executive Outreach & Founder Intelligence Engine</span>
            </div>
            <div className="flex items-center gap-4">
              <a 
                href="https://github.com/KHUSHALSY/FoundrRadar" 
                target="_blank" 
                rel="noreferrer"
                className="text-slate-400 hover:text-white font-medium transition-colors"
              >
                GitHub Repository (KHUSHALSY/FoundrRadar)
              </a>
            </div>
          </div>
        </footer>
      </div>

    </div>
  );
}
