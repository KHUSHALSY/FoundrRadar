import React, { useState } from 'react';
import { 
  ClipboardList, Download, Trash2, Edit3, 
  ExternalLink, Send, MessageSquare, 
  PartyPopper, Search, Mail
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const PIPELINE_STATUSES = [
  { id: 'Identified', label: '1. Identified', color: 'bg-slate-800 text-slate-300 border-slate-700' },
  { id: 'Contacted (LinkedIn)', label: '2. Contacted (LinkedIn)', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
  { id: 'Email Sent', label: '3. Email Sent', color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' },
  { id: 'Follow-up Sent', label: '4. Follow-up Sent', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
  { id: 'Call Scheduled', label: '5. Meeting / Call Booked', color: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
  { id: 'Confirmed', label: '6. Confirmed / Closed 🎉', color: 'bg-emerald-500/25 text-emerald-300 border-emerald-500/40 font-bold' },
  { id: 'Passed', label: 'Passed / Inactive', color: 'bg-red-500/20 text-red-300 border-red-500/30' },
];

export default function PipelineCRM({ 
  pipeline, 
  onUpdateStatus, 
  onUpdateNotes, 
  onRemoveItem, 
  onClearPipeline,
  onSelectFounderForPitch
}) {
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingNotesId, setEditingNotesId] = useState(null);
  const [noteDraft, setNoteDraft] = useState('');

  // Stats
  const totalLeads = pipeline.length;
  const contactedCount = pipeline.filter(p => p.status.includes('Contacted') || p.status.includes('Email') || p.status.includes('Follow-up')).length;
  const meetingCount = pipeline.filter(p => p.status === 'Call Scheduled').length;
  const confirmedCount = pipeline.filter(p => p.status === 'Confirmed').length;

  const triggerCelebration = () => {
    confetti({
      particleCount: 110,
      spread: 75,
      origin: { y: 0.6 }
    });
  };

  const handleStatusChange = (id, newStatus) => {
    onUpdateStatus(id, newStatus);
    if (newStatus === 'Confirmed') {
      triggerCelebration();
    }
  };

  const startEditNotes = (item) => {
    setEditingNotesId(item.id);
    setNoteDraft(item.notes || '');
  };

  const saveNotes = (id) => {
    onUpdateNotes(id, noteDraft);
    setEditingNotesId(null);
  };

  // Export to CSV
  const exportToCSV = () => {
    if (pipeline.length === 0) return;

    const headers = ['Name', 'Company', 'Role', 'Sector', 'Email', 'Status', 'Profile URL', 'Notes'];
    const rows = pipeline.map(p => [
      `"${p.name || ''}"`,
      `"${p.company || ''}"`,
      `"${p.role || ''}"`,
      `"${p.sector || ''}"`,
      `"${p.email || ''}"`,
      `"${p.status || ''}"`,
      `"${p.profileUrl || ''}"`,
      `"${(p.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `FounderRadar_Outreach_Pipeline_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter items
  const filteredItems = pipeline.filter(item => {
    const matchesStatus = filterStatus === 'All' || item.status === filterStatus;
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q || 
      item.name.toLowerCase().includes(q) ||
      item.company.toLowerCase().includes(q) ||
      (item.email || '').toLowerCase().includes(q) ||
      (item.notes || '').toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Total Pipeline</span>
            <span className="text-2xl sm:text-3xl font-black text-white mt-1 block">{totalLeads}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-800 text-slate-300">
            <ClipboardList className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Outreach Sent</span>
            <span className="text-2xl sm:text-3xl font-black text-blue-400 mt-1 block">{contactedCount}</span>
          </div>
          <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400">
            <Send className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Meetings Booked</span>
            <span className="text-2xl sm:text-3xl font-black text-purple-400 mt-1 block">{meetingCount}</span>
          </div>
          <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400">
            <MessageSquare className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-900 border border-emerald-500/40 rounded-2xl p-5 flex items-center justify-between bg-gradient-to-br from-slate-900 via-emerald-950/20 to-slate-900">
          <div>
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider block">Confirmed / Closed 🎉</span>
            <span className="text-2xl sm:text-3xl font-black text-emerald-300 mt-1 block">{confirmedCount}</span>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-300">
            <PartyPopper className="w-5 h-5" />
          </div>
        </div>

      </div>

      {/* Action Bar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Search & Filter */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, company, email..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 text-xs focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Stage:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 text-xs focus:ring-1 focus:ring-indigo-500"
            >
              <option value="All">All Stages ({totalLeads})</option>
              {PIPELINE_STATUSES.map(s => (
                <option key={s.id} value={s.id}>{s.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <button
            onClick={exportToCSV}
            disabled={pipeline.length === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold shadow-md transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export to CSV / Sheets</span>
          </button>

          {pipeline.length > 0 && (
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to clear your outreach pipeline?')) {
                  onClearPipeline();
                }
              }}
              className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg text-xs transition-all"
              title="Clear Pipeline"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>

      {/* Main Table */}
      {pipeline.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 border-dashed rounded-2xl p-12 text-center">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 mx-auto flex items-center justify-center mb-3">
            <ClipboardList className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">Your Pipeline is Empty</h3>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto mt-1">
            Search for founders using the Search Engine or browse the Curated Directory to add executives, speakers, and investors to your pipeline!
          </p>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950/80 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Contact & Venture</th>
                  <th className="py-3 px-4">Email / Profile</th>
                  <th className="py-3 px-4">Stage</th>
                  <th className="py-3 px-4">Outreach Log & Notes</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {filteredItems.map((item) => {
                  const currentStatusConfig = PIPELINE_STATUSES.find(s => s.id === item.status) || PIPELINE_STATUSES[0];
                  return (
                    <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                      
                      {/* Name & Venture */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-100 flex items-center gap-1.5">
                          <span>{item.name}</span>
                          {item.profileUrl && item.profileUrl !== '#' && (
                            <a 
                              href={item.profileUrl} 
                              target="_blank" 
                              rel="noreferrer" 
                              className="text-blue-400 hover:text-blue-300"
                              title="Open Profile"
                            >
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                        <div className="text-indigo-400 font-medium">{item.company}</div>
                        <div className="text-[10px] text-slate-400">{item.role}</div>
                      </td>

                      {/* Email / Channel */}
                      <td className="py-3.5 px-4 text-slate-300">
                        {item.email ? (
                          <div className="flex items-center gap-1 text-slate-300 font-mono text-[11px]">
                            <Mail className="w-3 h-3 text-amber-400 shrink-0" />
                            <span>{item.email}</span>
                          </div>
                        ) : (
                          <span className="text-slate-500 italic">No direct email</span>
                        )}
                        <div className="text-[10px] text-slate-400 mt-0.5">{item.sector}</div>
                      </td>

                      {/* Status Dropdown */}
                      <td className="py-3.5 px-4">
                        <select
                          value={item.status}
                          onChange={(e) => handleStatusChange(item.id, e.target.value)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${currentStatusConfig.color} bg-slate-950 cursor-pointer focus:outline-none`}
                        >
                          {PIPELINE_STATUSES.map(s => (
                            <option key={s.id} value={s.id} className="bg-slate-900 text-white">
                              {s.label}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* Notes / Log */}
                      <td className="py-3.5 px-4 max-w-xs">
                        {editingNotesId === item.id ? (
                          <div className="flex gap-1.5 items-center">
                            <input
                              type="text"
                              value={noteDraft}
                              onChange={(e) => setNoteDraft(e.target.value)}
                              placeholder="e.g. Sent invite; follow up Friday"
                              className="px-2 py-1 bg-slate-950 border border-slate-700 rounded text-xs text-white flex-1"
                              autoFocus
                            />
                            <button
                              onClick={() => saveNotes(item.id)}
                              className="px-2 py-1 bg-emerald-600 text-white rounded text-[10px] font-bold"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingNotesId(null)}
                              className="px-1 text-slate-400 hover:text-white text-[10px]"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <div 
                            onClick={() => startEditNotes(item)}
                            className="group cursor-pointer flex items-center justify-between gap-1 text-slate-400 hover:text-slate-200"
                            title="Click to edit notes"
                          >
                            <span className="line-clamp-2 text-xs">
                              {item.notes || <span className="italic text-slate-600">+ Add log...</span>}
                            </span>
                            <Edit3 className="w-3 h-3 opacity-0 group-hover:opacity-100 shrink-0 text-slate-400" />
                          </div>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onSelectFounderForPitch(item)}
                            className="px-2.5 py-1 bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white rounded-md text-[11px] font-semibold transition-all"
                            title="Draft personalized pitch"
                          >
                            Pitch
                          </button>

                          <button
                            onClick={() => onRemoveItem(item.id)}
                            className="p-1 text-slate-500 hover:text-red-400 transition-colors"
                            title="Remove lead"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
