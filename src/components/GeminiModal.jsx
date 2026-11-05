import React, { useState } from 'react';
import { Sparkles, X, Check, Key, ShieldCheck, ExternalLink, AlertCircle, Loader2 } from 'lucide-react';
import { 
  getStoredGeminiKey, setStoredGeminiKey, 
  getStoredGeminiModel, setStoredGeminiModel,
  testGeminiApiKey, AVAILABLE_MODELS 
} from '../services/geminiService';

export default function GeminiModal({ isOpen, onClose, onKeyUpdated }) {
  const [apiKey, setApiKey] = useState(() => getStoredGeminiKey());
  const [selectedModel, setSelectedModel] = useState(() => getStoredGeminiModel());
  const [isTesting, setIsTesting] = useState(false);
  const [testStatus, setTestStatus] = useState(null); // { success: boolean, message: string }
  const [showKey, setShowKey] = useState(false);

  if (!isOpen) return null;

  const handleSave = async () => {
    if (!apiKey.trim()) {
      setStoredGeminiKey('');
      setTestStatus(null);
      onKeyUpdated(false);
      onClose();
      return;
    }

    setIsTesting(true);
    setTestStatus(null);
    try {
      await testGeminiApiKey(apiKey.trim());
      setStoredGeminiKey(apiKey.trim());
      setStoredGeminiModel(selectedModel);
      setTestStatus({ success: true, message: 'Connected to Gemini successfully!' });
      onKeyUpdated(true);
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err) {
      setTestStatus({ success: false, message: err.message || 'Failed to authenticate API key' });
    } finally {
      setIsTesting(false);
    }
  };

  const handleDisconnect = () => {
    setStoredGeminiKey('');
    setApiKey('');
    setTestStatus(null);
    onKeyUpdated(false);
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-[#111218] border border-[#2c3042] rounded-2xl max-w-md w-full p-6 text-slate-100 shadow-2xl relative space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-[#1a1c26] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span>Gemini Pro Intelligence</span>
              <span className="px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-400 text-[10px] font-bold">
                PRO AI
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Supercharge executive search & custom outreach pitches
            </p>
          </div>
        </div>

        {/* Security badge */}
        <div className="p-3 bg-[#090a0f] border border-[#1e202b] rounded-xl flex items-start gap-2.5 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <span className="text-slate-200 font-medium">Local Client-Side Storage: </span>
            Your Gemini API key is stored only in your browser's local storage and communicated directly to Google's official API endpoints.
          </div>
        </div>

        {/* API Key Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
            <span>Gemini API Key</span>
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="text-[11px] text-indigo-400 hover:text-indigo-300 font-normal"
            >
              {showKey ? 'Hide Key' : 'Show Key'}
            </button>
          </label>
          <div className="relative">
            <Key className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type={showKey ? 'text' : 'password'}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full pl-9 pr-3 py-2 bg-[#090a0f] border border-[#272a38] rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 text-xs font-mono"
            />
          </div>
          <div className="flex items-center justify-between pt-1 text-[11px]">
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-400 hover:underline flex items-center gap-1"
            >
              <span>Get a free key on Google AI Studio</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Model Selection */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300">
            Model Engine
          </label>
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="w-full px-3 py-2 bg-[#090a0f] border border-[#272a38] rounded-xl text-slate-200 focus:outline-none focus:border-indigo-500 text-xs"
          >
            {AVAILABLE_MODELS.map(m => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
        </div>

        {/* Test / Status Feedback */}
        {testStatus && (
          <div className={`p-2.5 rounded-xl border flex items-center gap-2 text-xs ${
            testStatus.success 
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' 
              : 'bg-red-500/10 border-red-500/30 text-red-300'
          }`}>
            {testStatus.success ? <Check className="w-4 h-4 text-emerald-400 shrink-0" /> : <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />}
            <span className="truncate">{testStatus.message}</span>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-[#1c1e28]">
          {apiKey ? (
            <button
              onClick={handleDisconnect}
              className="text-xs text-red-400 hover:text-red-300 transition-colors"
            >
              Disconnect Key
            </button>
          ) : <div />}

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 bg-[#171922] hover:bg-[#232634] text-slate-400 hover:text-slate-200 rounded-lg text-xs"
            >
              Cancel
            </button>

            <button
              onClick={handleSave}
              disabled={isTesting}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold shadow-md transition-all"
            >
              {isTesting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Save & Connect</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
