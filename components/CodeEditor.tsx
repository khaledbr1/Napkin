'use client';

import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Copy, Check, Download, RotateCcw, Code2, Sparkles } from 'lucide-react';

interface CodeEditorProps {
  code: string;
  onChange: (value: string) => void;
  onReset?: () => void;
}

export default function CodeEditor({ code, onChange, onReset }: CodeEditorProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/typescript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `GeneratedComponent-${Date.now()}.tsx`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full bg-slate-950/70 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-md">
      {/* Editor Sub-Header Toolbar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/90 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950/80 border border-slate-800 text-xs font-mono text-indigo-400">
            <Code2 className="w-3.5 h-3.5" />
            <span>GeneratedComponent.tsx</span>
          </div>
          <span className="text-[11px] text-slate-500 hidden sm:inline">
            Live editable (changes re-render instantly)
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {onReset && (
            <button
              onClick={onReset}
              className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors"
              title="Reset Code to Default"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 rounded-lg border border-slate-700/60 transition-colors"
            title="Download .tsx file"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Download</span>
          </button>

          <button
            onClick={handleCopy}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs rounded-lg font-medium transition-all ${
              copied
                ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/40'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Code</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Monaco Editor Container */}
      <div className="flex-1 relative overflow-hidden bg-[#1e1e1e]">
        <Editor
          height="100%"
          language="typescript"
          theme="vs-dark"
          value={code}
          onChange={(val) => onChange(val || '')}
          options={{
            minimap: { enabled: false },
            fontSize: 13,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            automaticLayout: true,
            tabSize: 2,
            fontFamily: 'Fira Code, Menlo, Monaco, Consolas, monospace',
            padding: { top: 16, bottom: 16 },
            cursorBlinking: 'smooth',
            smoothScrolling: true,
          }}
          loading={
            <div className="flex items-center justify-center h-full text-slate-400 text-xs gap-2">
              <Sparkles className="w-4 h-4 animate-spin text-indigo-400" />
              Loading Monaco Editor...
            </div>
          }
        />
      </div>
    </div>
  );
}
