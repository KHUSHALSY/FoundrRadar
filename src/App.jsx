import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import SearchEngine from './components/SearchEngine';
import CuratedDirectory from './components/CuratedDirectory';
import PipelineCRM from './components/PipelineCRM';
import PitchGenerator from './components/PitchGenerator';
import Playbook from './components/Playbook';
import { Sparkles, Share2, Compass } from 'lucide-react';
import confetti from 'canvas-confetti';

const STORAGE_KEY = 'founderradar_pro_pipeline_v1';

const INITIAL_PIPELINE_SAMPLE = [
  {
    id: 'f-3',
    name: 'Kunal Shah',
    company: 'CRED',
    role: 'Founder & CEO',
    sector: 'FinTech / High-Trust Networks',
    location: 'Bengaluru, India',
    email: 'kunal@cred.club',
    status: 'Call Scheduled',
    profileUrl: 'https://www.linkedin.com/in/kunalshah1/',
    notes: 'Keynote discussion on Delta 4 framework. Meeting with Chief of Staff booked.'
  },
  {
    id: 'f-4',
    name: 'Aman Gupta',
    company: 'boAt Lifestyle',
    role: 'Co-Founder & CMO',
    sector: 'D2C / Consumer Electronics',
    location: 'New Delhi, India',
    email: 'aman@boat-lifestyle.com',
    status: 'Contacted (LinkedIn)',
    profileUrl: 'https://www.linkedin.com/in/amangupta1/',
    notes: 'Sent personalized connect note. Reached out regarding annual growth fireside chat.'
  },
  {
    id: 'f-1',
    name: 'Sanjeev Bikhchandani',
    company: 'Info Edge',
    role: 'Founder & Vice Chairman',
    sector: 'Enterprise Tech / VC',
    location: 'Delhi NCR / Global',
    email: 'sanjeev@infoedge.com',
    status: 'Confirmed',
    profileUrl: 'https://www.linkedin.com/in/sanjeev-bikhchandani-4279581/',
    notes: 'Confirmed 35-min keynote address. VIP travel logistics aligned.'
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('search');
  const [pipeline, setPipeline] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_PIPELINE_SAMPLE;
    } catch {
      return INITIAL_PIPELINE_SAMPLE;
    }
  });

  const [selectedFounderForPitch, setSelectedFounderForPitch] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [copiedShare, setCopiedShare] = useState(false);

  // Sync with localStorage
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
      showToast(`${lead.name} is already in your Outreach Pipeline!`);
      return;
    }

    const updated = [lead, ...pipeline];
    setPipeline(updated);
    showToast(`Added ${lead.name} (${lead.company}) to Outreach Pipeline! 📋`);
  };

  const handleUpdateStatus = (id, newStatus) => {
    setPipeline(prev => prev.map(p => p.id === id ? { ...p, status: newStatus } : p));
    showToast(`Status updated to ${newStatus}`);
  };

  const handleUpdateNotes = (id, notes) => {
    setPipeline(prev => prev.map(p => p.id === id ? { ...p, notes } : p));
    showToast('Outreach log updated');
  };

  const handleRemoveItem = (id) => {
    setPipeline(prev => prev.filter(p => p.id !== id));
    showToast('Lead removed from pipeline');
  };

  const handleClearPipeline = () => {
    setPipeline([]);
    showToast('Pipeline cleared');
  };

  const handleSelectFounderForPitch = (founder) => {
    setSelectedFounderForPitch(founder);
    setActiveTab('generator');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast(`Loaded details for ${founder.name} in Message Crafter! ✍️`);
  };

  const handleShareApp = () => {
    if (navigator.share) {
      navigator.share({
        title: 'FounderRadar Pro',
        text: 'The Universal Multi-Platform Outreach & Intelligence Engine for Founders, Investors & Operators',
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
      showToast('App link copied to clipboard!');
    }
  };

  const confirmedCount = pipeline.filter(p => p.status === 'Confirmed').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-600 selection:text-white">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce bg-slate-900 border border-indigo-500/40 shadow-2xl shadow-indigo-500/20 text-white px-4 py-3 rounded-2xl text-xs sm:text-sm font-semibold flex items-center gap-2.5 backdrop-blur-md">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        pipelineCount={pipeline.length}
        confirmedCount={confirmedCount}
      />

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {activeTab === 'search' && (
          <SearchEngine 
            onAddToPipeline={handleAddToPipeline} 
            onSelectFounderForPitch={handleSelectFounderForPitch} 
          />
        )}

        {activeTab === 'directory' && (
          <CuratedDirectory 
            onAddToPipeline={handleAddToPipeline} 
            onSelectFounderForPitch={handleSelectFounderForPitch}
            pipelineItems={pipeline}
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

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800 bg-slate-900/50 py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">FounderRadar Pro</span>
            <span>•</span>
            <span>Multi-Platform Executive Outreach & Intelligence Engine</span>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setActiveTab('playbook')} 
              className="hover:text-slate-300 transition-colors"
            >
              Executive Playbook
            </button>
            <button 
              onClick={() => setActiveTab('pipeline')} 
              className="hover:text-slate-300 transition-colors"
            >
              Pipeline CRM ({pipeline.length})
            </button>
            <button 
              onClick={handleShareApp} 
              className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share Application</span>
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
}
