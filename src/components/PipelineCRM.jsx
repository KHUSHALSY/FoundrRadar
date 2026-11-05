import React, { useState } from 'react';
import { 
  ClipboardList, Download, Trash2, Edit3, 
  ExternalLink, Send, MessageSquare, 
  PartyPopper, Search, Mail, Check
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const PIPELINE_STATUSES = [
  { id: 'Identified', label: '1. Identified', color: 'bg-[#171922] text-slate-300 border-[#272a38]' },
  { id: 'Contacted (LinkedIn)', label: '2. Contacted (LinkedIn)', color: 'bg-blue-500/10 text-blue-400 border-blue-500/30' },
  { id: 'Email Sent', label: '3. Email Sent', color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30' },
  { id: 'Follow-up Sent', label: '4. Follow-up Sent', color: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
  { id: 'Call Scheduled', label: '5. Meeting Booked', color: 'bg-purple-500/10 text-purple-400 border-purple-500/30' },
  { id: 'Confirmed', label: '6. Confirmed / Closed 🎉', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold' },
  { id: 'Passed', label: 'Passed / Inactive', color: 'bg-red-500/10 text-red-400 border-red-500/30' },
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

  const exportToJSON = () => {
    if (pipeline.length === 0) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(pipeline, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute("download", `foundrRadar_Pipeline_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    dlAnchor.remove();
  };

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
    link.setAttribute('download', `foundrRadar_Pipeline_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
    <div className="space-y-6 max-w-6xl mx-auto">
      
      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-[#111218] border border-[#232634] rounded-xl p-4">
          <span className="text-xs text-slate-500 font-medium uppercase tracking-wider block">Total Pipeline</span>
          <span className="text-2xl font-bold text-white mt-1 block">{totalLeads}</span>
        </div>

        <div className="bg-[#111218] border border-[#232634] rounded-xl p-4">
          <span className="text-xs text-slate-500 font-medium uppercase tracking-wider block">Outreach Sent</span>
          <span className="text-2xl font-bold text-blue-400 mt-1 block">{contactedCount}</span>
        </div>

        <div className="bg-[#111218] border border-[#232634] rounded-xl p-4">
          <span className="text-xs text-slate-500 font-medium uppercase tracking-wider block">Meetings Booked</span>
          <span className="text-2xl font-bold text-purple-400 mt-1 block">{meetingCount}</span>
        </div>

        <div className="bg-[#111218] border border-emerald-500/30 rounded-xl p-4">
          <span className="text-xs text-emerald-400 font-medium uppercase tracking-wider block">Confirmed 🎉</span>
          <span className="text-2xl font-bold text-emerald-300 mt-1 block">{confirmedCount}</span>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-[#111218] border border-[#232634] rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-60">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by name, company..."
              className="w-full pl-8 pr-3 py-1.5 bg-[#090a0f] border border-[#272a38] rounded-lg text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <span>Stage:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-2.5 py-1.5 bg-[#090a0f] border border-[#272a38] rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500 text-xs"
            >
              <option value="All">All Stages ({totalLeads})</option>
              {PIPELINE_STATUSES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={exportToCSV}
            disabled={pipeline.length === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#171922] hover:bg-[#232634] disabled:opacity-40 text-slate-200 border border-[#2c3042] rounded-lg text-xs font-medium"
          >
            <Download className="w-3.5 h-3.5 text-indigo-400" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={exportToJSON}
            disabled={pipeline.length === 0}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-[#171922] hover:bg-[#232634] disabled:opacity-40 text-slate-300 border border-[#2c3042] rounded-lg text-xs font-medium"
            title="Export as JSON"
          >
            <span>JSON</span>
          </button>

          {pipeline.length > 0 && (
            <button
              onClick={() => {
                if (window.confirm('Clear all leads from pipeline?')) onClearPipeline();
              }}
              className="p-1.5 text-slate-500 hover:text-red-400 rounded-lg"
              title="Clear Pipeline"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Pipeline Table */}
      {pipeline.length === 0 ? (
        <div className="bg-[#111218] border border-[#232634] rounded-xl p-10 text-center text-slate-400 text-xs">
          No leads in your pipeline yet. Search founders and tap "+ Save" to add contacts!
        </div>
      ) : (
        <div className="bg-[#111218] border border-[#232634] rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#090a0f] border-b border-[#1c1e28] text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Contact & Venture</th>
                  <th className="py-3 px-4">Direct Email / Channel</th>
                  <th className="py-3 px-4">Stage</th>
                  <th className="py-3 px-4">Outreach Log</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1c1e28]">
                {filteredItems.map((item) => {
                  const currentStatus = PIPELINE_STATUSES.find(s => s.id === item.status) || PIPELINE_STATUSES[0];
                  const safeLinkedIn = (item.profileUrl && item.profileUrl.includes('/search/results/people/'))
                    ? item.profileUrl
                    : `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent((item.name + ' ' + (item.company || '')).trim())}`;

                  return (
                    <tr key={item.id} className="hover:bg-[#151720]">
                      {/* Name & Company */}
                      <td className="py-3 px-4">
                        <div className="font-semibold text-white flex items-center gap-1.5">
                          <span>{item.name}</span>
                          <a 
                            href={safeLinkedIn} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-indigo-400 hover:text-indigo-300"
                            title={`Search & Connect with ${item.name} on LinkedIn`}
                          >
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                        <div className="text-slate-400 text-[11px] mt-0.5">{item.company} • {item.role}</div>
                      </td>

                      {/* Email */}
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-300">
                        {item.email || <span className="text-slate-600 font-sans italic">LinkedIn</span>}
                      </td>

                      {/* Stage Dropdown */}
                      <td className="py-3 px-4">
                        <select
                          value={item.status}
                          onChange={(e) => handleStatusChange(item.id, e.target.value)}
                          className={`px-2 py-1 rounded text-xs font-medium border ${currentStatus.color} bg-[#090a0f] focus:outline-none`}
                        >
                          {PIPELINE_STATUSES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                        </select>
                      </td>

                      {/* Log / Notes */}
                      <td className="py-3 px-4 max-w-xs">
                        {editingNotesId === item.id ? (
                          <div className="flex gap-1.5 items-center">
                            <input
                              type="text"
                              value={noteDraft}
                              onChange={(e) => setNoteDraft(e.target.value)}
                              placeholder="Notes..."
                              className="px-2 py-1 bg-[#090a0f] border border-[#272a38] rounded text-xs text-white flex-1"
                              autoFocus
                            />
                            <button
                              onClick={() => saveNotes(item.id)}
                              className="px-2 py-1 bg-indigo-600 text-white rounded text-[10px] font-bold"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingNotesId(null)}
                              className="px-1 text-slate-400 text-[10px]"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <div 
                            onClick={() => startEditNotes(item)}
                            className="cursor-pointer text-slate-400 hover:text-slate-200 line-clamp-1 flex items-center gap-1 group"
                          >
                            <span>{item.notes || <span className="italic text-slate-600">+ Add log...</span>}</span>
                            <Edit3 className="w-3 h-3 text-slate-600 group-hover:text-slate-400 opacity-0 group-hover:opacity-100" />
                          </div>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => onSelectFounderForPitch(item)}
                            className="px-2 py-1 bg-[#1c1e2a] hover:bg-[#252837] text-slate-200 rounded text-xs font-medium"
                          >
                            Pitch
                          </button>
                          <button
                            onClick={() => onRemoveItem(item.id)}
                            className="p-1 text-slate-500 hover:text-red-400"
                            title="Remove"
                          >
                            <Trash2 className="w-3 h-3" />
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
