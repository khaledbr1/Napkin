'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  Monitor,
  Tablet,
  Smartphone,
  RotateCw,
  ExternalLink,
  AlertTriangle,
  Sparkles
} from 'lucide-react';

interface PreviewSandboxProps {
  code: string;
  isGenerating?: boolean;
}

type ViewportMode = 'desktop' | 'tablet' | 'mobile';

export default function PreviewSandbox({ code, isGenerating = false }: PreviewSandboxProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [viewport, setViewport] = useState<ViewportMode>('desktop');
  const [renderError, setRenderError] = useState<string | null>(null);
  const [isIframeReady, setIsIframeReady] = useState(false);
  const [key, setKey] = useState(0);

  // Send code safely to the iframe
  const sendCodeToIframe = useCallback((targetCode: string) => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      try {
        iframeRef.current.contentWindow.postMessage(
          { type: 'UPDATE_CODE', code: targetCode },
          '*'
        );
      } catch (err) {
        console.warn('Failed to dispatch postMessage to sandbox iframe:', err);
      }
    }
  }, []);

  // Listen for sandbox messages (ready state, errors, success)
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (!event.data || typeof event.data !== 'object') return;

      if (event.data.type === 'IFRAME_READY') {
        setIsIframeReady(true);
        sendCodeToIframe(code);
      } else if (event.data.type === 'RENDER_ERROR') {
        setRenderError(event.data.message);
      } else if (event.data.type === 'RENDER_CLEAR_ERROR' || event.data.type === 'RENDER_SUCCESS') {
        setRenderError(null);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [code, sendCodeToIframe]);

  // Update iframe whenever code changes or iframe becomes ready
  useEffect(() => {
    if (isIframeReady) {
      sendCodeToIframe(code);
    }
  }, [code, isIframeReady, sendCodeToIframe]);

  // When iframe loads, attempt immediate code transfer
  const handleIframeLoad = () => {
    sendCodeToIframe(code);
  };

  const handleRefresh = () => {
    setIsIframeReady(false);
    setKey((prev) => prev + 1);
  };

  const openInNewTab = () => {
    try {
      sessionStorage.setItem('napkin_preview_code', code);
    } catch (e) {
      console.warn('Could not save preview code to sessionStorage:', e);
    }
    window.open('/sandbox-runner.html', '_blank');
  };

  return (
    <div className="flex flex-col h-full bg-slate-950/60 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-md">
      {/* Sandbox Sub-Header Controls */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/90 border-b border-slate-800">
        {/* Viewport Selector */}
        <div className="flex items-center gap-1 bg-slate-950/70 p-1 rounded-xl border border-slate-800/80">
          <button
            onClick={() => setViewport('desktop')}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-lg transition-all ${
              viewport === 'desktop'
                ? 'bg-indigo-600 text-white font-medium shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
            title="Desktop Viewport (100%)"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Desktop</span>
          </button>

          <button
            onClick={() => setViewport('tablet')}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-lg transition-all ${
              viewport === 'tablet'
                ? 'bg-indigo-600 text-white font-medium shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
            title="Tablet Viewport (768px)"
          >
            <Tablet className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Tablet</span>
          </button>

          <button
            onClick={() => setViewport('mobile')}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-lg transition-all ${
              viewport === 'mobile'
                ? 'bg-indigo-600 text-white font-medium shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
            title="Mobile Viewport (375px)"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Mobile</span>
          </button>
        </div>

        {/* Status and Action Buttons */}
        <div className="flex items-center gap-2">
          {renderError && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs rounded-lg">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Compilation Error</span>
            </div>
          )}

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Live Sandbox
          </div>

          <button
            onClick={handleRefresh}
            className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors"
            title="Reload Sandbox"
          >
            <RotateCw className="w-4 h-4" />
          </button>

          <button
            onClick={openInNewTab}
            className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors"
            title="Open Sandbox in New Window"
          >
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Frame Container */}
      <div className="flex-1 relative flex items-center justify-center p-3 sm:p-5 overflow-auto bg-gradient-to-b from-slate-950 to-slate-900/60">
        {/* Loading Overlay */}
        {isGenerating && (
          <div className="absolute inset-0 z-30 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center gap-4 text-center p-6">
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center animate-pulse">
                <Sparkles className="w-7 h-7 text-indigo-400 animate-spin" />
              </div>
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-indigo-500 to-sky-500 opacity-30 blur-md animate-pulse"></div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Transpiling Wireframe to React</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-xs">
                Groq Vision model is extracting layout, components, and Tailwind styling...
              </p>
            </div>
            {/* Indeterminate Skeleton Preview */}
            <div className="w-full max-w-sm mt-2 p-4 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-3">
              <div className="h-4 bg-slate-800 rounded-md w-3/4 animate-pulse"></div>
              <div className="h-3 bg-slate-800/60 rounded-md w-full animate-pulse"></div>
              <div className="grid grid-cols-2 gap-2 pt-2">
                <div className="h-16 bg-slate-800/40 rounded-xl animate-pulse"></div>
                <div className="h-16 bg-slate-800/40 rounded-xl animate-pulse"></div>
              </div>
              <div className="h-9 bg-indigo-600/30 rounded-xl w-full animate-pulse"></div>
            </div>
          </div>
        )}

        {/* Viewport Frame */}
        <div
          className={`h-full transition-all duration-300 relative flex flex-col ${
            viewport === 'desktop'
              ? 'w-full'
              : viewport === 'tablet'
              ? 'w-[768px] max-w-full rounded-2xl border-4 border-slate-800 shadow-2xl bg-slate-950'
              : 'w-[375px] max-w-full rounded-[36px] border-[8px] border-slate-800 shadow-2xl bg-slate-950'
          }`}
        >
          {/* Mobile frame speaker notch */}
          {viewport === 'mobile' && (
            <div className="w-full h-6 bg-slate-900 flex items-center justify-center rounded-t-[28px] border-b border-slate-800">
              <div className="w-16 h-1.5 rounded-full bg-slate-700/80"></div>
            </div>
          )}

          <iframe
            key={key}
            ref={iframeRef}
            src="/sandbox-runner.html"
            sandbox="allow-scripts allow-same-origin allow-modals"
            onLoad={handleIframeLoad}
            className={`w-full h-full border-0 transition-opacity ${
              viewport === 'mobile' ? 'rounded-b-[28px]' : viewport === 'tablet' ? 'rounded-xl' : 'rounded-none'
            }`}
            title="Napkin Live Component Sandbox"
          />
        </div>
      </div>
    </div>
  );
}
