'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Key,
  SlidersHorizontal,
  Zap,
  HelpCircle,
  ExternalLink,
  Check,
  X
} from 'lucide-react';

interface HeaderProps {
  promptModifier: string;
  setPromptModifier: (val: string) => void;
  customApiKey: string;
  setCustomApiKey: (val: string) => void;
}

export default function Header({
  promptModifier,
  setPromptModifier,
  customApiKey,
  setCustomApiKey,
}: HeaderProps) {
  const [isPromptModalOpen, setIsPromptModalOpen] = useState(false);
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);
  const [tempKey, setTempKey] = useState(customApiKey);

  const handleSaveKey = () => {
    setCustomApiKey(tempKey);
    setIsKeyModalOpen(false);
  };

  return (
    <>
      <header className="h-16 px-4 sm:px-6 bg-slate-950/80 border-b border-slate-800/80 backdrop-blur-xl flex items-center justify-between z-20">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-400 p-0.5 shadow-lg shadow-indigo-600/30 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-indigo-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-extrabold tracking-tight text-white">
                Napkin
              </span>
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 rounded-full">
                Canvas-to-Code
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Draw wireframes • Instant AI vision transpilation • Live React sandbox
            </p>
          </div>
        </div>

        {/* Center / Right controls: Model status, Prompt Modifier, API Key */}
        <div className="flex items-center gap-2">
          {/* Active Model Indicator */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-slate-900/90 border border-slate-800 rounded-xl text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-slate-400">Model:</span>
            <span className="font-semibold text-slate-200">Groq LPU Vision</span>
            <span className="px-1.5 py-0.5 bg-indigo-500/20 text-indigo-300 text-[10px] rounded font-mono font-medium">
              Sub-second
            </span>
          </div>

          {/* Prompt Modifier Button */}
          <button
            onClick={() => setIsPromptModalOpen(true)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-xl border transition-all ${
              promptModifier.trim()
                ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500/50 shadow-sm'
                : 'bg-slate-900/90 hover:bg-slate-800 text-slate-300 border-slate-800'
            }`}
            title="Custom Design Instructions (e.g., Color theme, dark mode)"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Prompt Modifiers</span>
            {promptModifier.trim() && (
              <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
            )}
          </button>

          {/* API Key Settings Button */}
          <button
            onClick={() => {
              setTempKey(customApiKey);
              setIsKeyModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors"
            title="Configure Groq API Key"
          >
            <Key className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">API Key</span>
          </button>
        </div>
      </header>

      {/* Prompt Modifier Modal */}
      {isPromptModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-fade-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-indigo-400" />
                <h3 className="text-sm font-bold text-white">Design Directives & Prompt Modifiers</h3>
              </div>
              <button
                onClick={() => setIsPromptModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Guide the Vision AI engine with specific aesthetic preferences, theme colors, or layout rules:
            </p>

            <textarea
              rows={3}
              value={promptModifier}
              onChange={(e) => setPromptModifier(e.target.value)}
              placeholder="e.g. Modern dark theme, Linear app aesthetic, emerald accents, subtle borders, high interactivity..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans"
            />

            {/* Quick Presets */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-slate-400">Quick Directives:</span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  'Dark mode, neon violet accents',
                  'Clean Stripe-like minimalist light UI',
                  'Add smooth interactive counters and toggles',
                  'Glassmorphic blur cards with gradients'
                ].map((directive) => (
                  <button
                    key={directive}
                    onClick={() => setPromptModifier(directive)}
                    className="text-[11px] px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700/80 transition-colors"
                  >
                    {directive}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  setPromptModifier('');
                  setIsPromptModalOpen(false);
                }}
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
              >
                Clear
              </button>
              <button
                onClick={() => setIsPromptModalOpen(false)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold"
              >
                Save Directives
              </button>
            </div>
          </div>
        </div>
      )}

      {/* API Key Modal */}
      {isKeyModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-fade-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Key className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-bold text-white">Groq API Key Settings</h3>
              </div>
              <button
                onClick={() => setIsKeyModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-400">
              The project is pre-configured with the default Groq key. You can also provide your own personal key to prevent rate limits:
            </p>

            <input
              type="password"
              value={tempKey}
              onChange={(e) => setTempKey(e.target.value)}
              placeholder="gsk_..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
            />

            <div className="flex items-center justify-between text-[11px] text-slate-500">
              <span>Keys are saved locally in session memory.</span>
              <a
                href="https://console.groq.com/keys"
                target="_blank"
                rel="noreferrer"
                className="text-indigo-400 hover:underline flex items-center gap-1"
              >
                Get Groq Key <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setIsKeyModalOpen(false)}
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveKey}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                Apply Key
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
