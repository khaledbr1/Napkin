'use client';

import React, { useState, useCallback, useRef } from 'react';
import Header from '@/components/Header';
import Canvas from '@/components/Canvas';
import PreviewSandbox from '@/components/PreviewSandbox';
import CodeEditor from '@/components/CodeEditor';
import Toast, { ToastMessage } from '@/components/Toast';
import { DEFAULT_STARTER_CODE } from '@/lib/default-code';
import { Eye, Code, Columns, Sparkles, Copy, Check } from 'lucide-react';

export default function Home() {
  const [code, setCode] = useState<string>(DEFAULT_STARTER_CODE);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'preview' | 'code' | 'split'>('preview');
  const [promptModifier, setPromptModifier] = useState<string>('');
  const [customApiKey, setCustomApiKey] = useState<string>('');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [copied, setCopied] = useState<boolean>(false);

  // Debounce ref for Monaco editor live typing
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  const addToast = useCallback(
    (type: 'success' | 'error' | 'info', title: string, description?: string) => {
      const id = `${Date.now()}-${Math.random()}`;
      setToasts((prev) => [...prev, { id, type, title, description }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 5000);
    },
    []
  );

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Handle generation from Canvas
  const handleGenerate = async (canvasDataUrl: string) => {
    if (isGenerating) return;

    setIsGenerating(true);
    addToast('info', 'Analyzing Wireframe...', 'Sending sketch to Groq Vision AI model');

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: canvasDataUrl,
          promptModifier: promptModifier.trim() || undefined,
          customApiKey: customApiKey.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || 'Failed to generate React component.');
      }

      if (data.code) {
        setCode(data.code);
        const modelNote = data.model ? ` (${data.model})` : '';
        addToast(
          'success',
          'Component Generated!',
          `Wireframe transformed into interactive React JSX${modelNote}.`
        );
      }
    } catch (err: any) {
      console.error('Generation Error:', err);
      addToast(
        'error',
        'Generation Failed',
        err.message || 'An error occurred while calling the Groq Vision API.'
      );
    } finally {
      setIsGenerating(false);
    }
  };

  // Debounced editor code change to prevent excessive recompilation
  const handleCodeChange = (newCode: string) => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    debounceTimer.current = setTimeout(() => {
      setCode(newCode);
    }, 250);
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      addToast('success', 'Code Copied!', 'React JSX copied to clipboard.');
    } catch (err) {
      console.error('Copy Error:', err);
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-[#070a11] text-slate-100 overflow-hidden select-none">
      {/* Top Application Header */}
      <Header
        promptModifier={promptModifier}
        setPromptModifier={setPromptModifier}
        customApiKey={customApiKey}
        setCustomApiKey={setCustomApiKey}
      />

      {/* Main Dual-Pane Workspace */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-3 p-3 overflow-hidden">
        {/* Left Pane: Interactive Drawing Canvas */}
        <section className="h-full flex flex-col min-h-0">
          <Canvas onGenerate={handleGenerate} isGenerating={isGenerating} />
        </section>

        {/* Right Pane: Split Preview / Monaco Code Editor */}
        <section className="h-full flex flex-col min-h-0">
          <div className="flex flex-col h-full bg-slate-950/60 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
            {/* View Tab Switcher Header */}
            <div className="flex items-center justify-between px-4 py-2 bg-slate-900/90 border-b border-slate-800">
              {/* Tab Selector */}
              <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800/80">
                <button
                  onClick={() => setActiveTab('preview')}
                  className={`flex items-center gap-1.5 px-3 py-1 text-xs rounded-lg font-medium transition-all ${
                    activeTab === 'preview'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Live Preview</span>
                </button>

                <button
                  onClick={() => setActiveTab('code')}
                  className={`flex items-center gap-1.5 px-3 py-1 text-xs rounded-lg font-medium transition-all ${
                    activeTab === 'code'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <Code className="w-3.5 h-3.5" />
                  <span>JSX Code</span>
                </button>

                <button
                  onClick={() => setActiveTab('split')}
                  className={`hidden sm:flex items-center gap-1.5 px-3 py-1 text-xs rounded-lg font-medium transition-all ${
                    activeTab === 'split'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <Columns className="w-3.5 h-3.5" />
                  <span>Split View</span>
                </button>
              </div>

              {/* Quick Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyCode}
                  className={`flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-lg border transition-all ${
                    copied
                      ? 'bg-emerald-600/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 border-slate-700/60'
                  }`}
                  title="Copy Component JSX"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="hidden sm:inline">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                      <span className="hidden sm:inline">Copy Code</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Pane Body */}
            <div className="flex-1 relative min-h-0 overflow-hidden">
              {activeTab === 'preview' && (
                <div className="w-full h-full p-2">
                  <PreviewSandbox code={code} isGenerating={isGenerating} />
                </div>
              )}

              {activeTab === 'code' && (
                <div className="w-full h-full p-2">
                  <CodeEditor
                    code={code}
                    onChange={handleCodeChange}
                    onReset={() => setCode(DEFAULT_STARTER_CODE)}
                  />
                </div>
              )}

              {activeTab === 'split' && (
                <div className="w-full h-full grid grid-cols-2 gap-2 p-2">
                  <div className="h-full min-h-0 overflow-hidden">
                    <PreviewSandbox code={code} isGenerating={isGenerating} />
                  </div>
                  <div className="h-full min-h-0 overflow-hidden">
                    <CodeEditor
                      code={code}
                      onChange={handleCodeChange}
                      onReset={() => setCode(DEFAULT_STARTER_CODE)}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Floating Notifications */}
      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
