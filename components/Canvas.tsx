'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  Pen,
  Square,
  Circle,
  MoveRight,
  Type,
  Eraser,
  RotateCcw,
  RotateCw,
  Trash2,
  Download,
  Grid,
  Sparkles,
  Layers,
  ChevronDown
} from 'lucide-react';
import { CANVAS_PRESETS, PresetTemplate } from '@/lib/canvas-presets';

export type DrawingTool = 'pen' | 'rect' | 'circle' | 'arrow' | 'text' | 'eraser';

interface CanvasProps {
  onGenerate: (canvasDataUrl: string) => void;
  isGenerating: boolean;
}

const COLOR_PALETTE = [
  { name: 'Ink Dark', value: '#0f172a', bg: 'bg-slate-900' },
  { name: 'Indigo', value: '#4f46e5', bg: 'bg-indigo-600' },
  { name: 'Sky Blue', value: '#0284c7', bg: 'bg-sky-600' },
  { name: 'Emerald', value: '#059669', bg: 'bg-emerald-600' },
  { name: 'Crimson', value: '#dc2626', bg: 'bg-rose-600' },
  { name: 'Amber', value: '#d97706', bg: 'bg-amber-600' },
];

const STROKE_WIDTHS = [
  { label: 'Fine', value: 2 },
  { label: 'Medium', value: 4 },
  { label: 'Thick', value: 8 },
  { label: 'Marker', value: 14 },
];

export default function Canvas({ onGenerate, isGenerating }: CanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Tools & Styling State
  const [currentTool, setCurrentTool] = useState<DrawingTool>('pen');
  const [strokeColor, setStrokeColor] = useState<string>('#0f172a');
  const [strokeWidth, setStrokeWidth] = useState<number>(4);
  const [isDashed, setIsDashed] = useState<boolean>(false);
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [presetDropdownOpen, setPresetDropdownOpen] = useState(false);

  // Drawing History Stack
  const [history, setHistory] = useState<ImageData[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  // In-progress Drawing State
  const isDrawing = useRef<boolean>(false);
  const startPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const snapshot = useRef<ImageData | null>(null);

  // Inline Text Input Placement
  const [textInput, setTextInput] = useState<{
    x: number;
    y: number;
    visible: boolean;
    text: string;
  }>({ x: 0, y: 0, visible: false, text: '' });

  // Get current 2D context
  const getContext = useCallback((): CanvasRenderingContext2D | null => {
    return canvasRef.current?.getContext('2d', { willReadFrequently: true }) || null;
  }, []);

  // Save current canvas state to history stack
  const saveState = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = getContext();
    if (!canvas || !ctx) return;

    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistory((prev) => {
      const updated = prev.slice(0, historyIndex + 1);
      return [...updated, imgData].slice(-30); // Max 30 undo steps
    });
    setHistoryIndex((prev) => Math.min(prev + 1, 29));
  }, [getContext, historyIndex]);

  // High-DPI canvas setup with content preservation
  const initCanvas = useCallback(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const rect = container.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    const dpr = window.devicePixelRatio || 1;

    // Snapshot existing canvas to avoid erasing drawing during layout shifts / window resizes
    let prevData: ImageData | null = null;
    const prevCtx = canvas.getContext('2d', { willReadFrequently: true });
    if (prevCtx && canvas.width > 0 && canvas.height > 0) {
      try {
        prevData = prevCtx.getImageData(0, 0, canvas.width, canvas.height);
      } catch {
        // ignore
      }
    }

    const prevWidth = canvas.width;
    const prevHeight = canvas.height;

    canvas.width = Math.floor(rect.width * dpr);
    canvas.height = Math.floor(rect.height * dpr);
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    ctx.scale(dpr, dpr);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Fill white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, rect.width, rect.height);

    if (prevData && prevWidth > 0 && prevHeight > 0) {
      ctx.putImageData(prevData, 0, 0);
    } else {
      // Initial history state
      const initialImg = ctx.getImageData(0, 0, canvas.width, canvas.height);
      setHistory([initialImg]);
      setHistoryIndex(0);
    }
  }, []);

  // Resize listener
  useEffect(() => {
    initCanvas();
    const handleResize = () => {
      initCanvas();
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [initCanvas]);

  // Undo / Redo operations
  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const nextIdx = historyIndex - 1;
      const ctx = getContext();
      if (ctx && history[nextIdx]) {
        ctx.putImageData(history[nextIdx], 0, 0);
        setHistoryIndex(nextIdx);
      }
    }
  }, [getContext, history, historyIndex]);

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextIdx = historyIndex + 1;
      const ctx = getContext();
      if (ctx && history[nextIdx]) {
        ctx.putImageData(history[nextIdx], 0, 0);
        setHistoryIndex(nextIdx);
      }
    }
  }, [getContext, history, historyIndex]);

  // Clear Canvas
  const handleClear = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = getContext();
    const container = containerRef.current;
    if (!canvas || !ctx || !container) return;

    const rect = container.getBoundingClientRect();
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, rect.width, rect.height);
    saveState();
  }, [getContext, saveState]);

  // Load Preset Wireframe
  const handleLoadPreset = (preset: PresetTemplate) => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const ctx = getContext();
    if (!container || !canvas || !ctx) return;

    const rect = container.getBoundingClientRect();
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, rect.width, rect.height);

    preset.draw(ctx, rect.width, rect.height);
    saveState();
    setPresetDropdownOpen(false);
  };

  // Pointer position relative to canvas
  const getCoordinates = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  // Drawing Event Handlers
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (textInput.visible) {
      commitText();
    }

    const coords = getCoordinates(e);
    const canvas = canvasRef.current;
    const ctx = getContext();
    if (!canvas || !ctx) return;

    if (currentTool === 'text') {
      setTextInput({
        x: coords.x,
        y: coords.y,
        visible: true,
        text: '',
      });
      return;
    }

    isDrawing.current = true;
    startPos.current = coords;

    // Cache current canvas image data for shape drag preview
    snapshot.current = ctx.getImageData(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = currentTool === 'eraser' ? '#ffffff' : strokeColor;
    ctx.lineWidth = currentTool === 'eraser' ? strokeWidth * 3.5 : strokeWidth;
    ctx.setLineDash(isDashed && currentTool !== 'eraser' ? [8, 6] : []);

    if (currentTool === 'pen' || currentTool === 'eraser') {
      ctx.beginPath();
      ctx.moveTo(coords.x, coords.y);
      ctx.lineTo(coords.x, coords.y);
      ctx.stroke();
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current) return;
    const coords = getCoordinates(e);
    const ctx = getContext();
    if (!ctx) return;

    if (currentTool === 'pen' || currentTool === 'eraser') {
      ctx.lineTo(coords.x, coords.y);
      ctx.stroke();
    } else if (snapshot.current) {
      // Restore cached state to avoid smearing while dragging shapes
      ctx.putImageData(snapshot.current, 0, 0);

      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = strokeWidth;
      ctx.setLineDash(isDashed ? [8, 6] : []);

      const x = Math.min(startPos.current.x, coords.x);
      const y = Math.min(startPos.current.y, coords.y);
      const w = Math.abs(coords.x - startPos.current.x);
      const h = Math.abs(coords.y - startPos.current.y);

      if (currentTool === 'rect') {
        ctx.strokeRect(x, y, w, h);
      } else if (currentTool === 'circle') {
        ctx.beginPath();
        const rx = w / 2;
        const ry = h / 2;
        ctx.ellipse(x + rx, y + ry, rx, ry, 0, 0, Math.PI * 2);
        ctx.stroke();
      } else if (currentTool === 'arrow') {
        // Draw line with arrowhead
        const fromX = startPos.current.x;
        const fromY = startPos.current.y;
        const toX = coords.x;
        const toY = coords.y;
        const headLength = Math.max(12, strokeWidth * 2.5);
        const angle = Math.atan2(toY - fromY, toX - fromX);

        ctx.beginPath();
        ctx.moveTo(fromX, fromY);
        ctx.lineTo(toX, toY);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(toX, toY);
        ctx.lineTo(
          toX - headLength * Math.cos(angle - Math.PI / 6),
          toY - headLength * Math.sin(angle - Math.PI / 6)
        );
        ctx.moveTo(toX, toY);
        ctx.lineTo(
          toX - headLength * Math.cos(angle + Math.PI / 6),
          toY - headLength * Math.sin(angle + Math.PI / 6)
        );
        ctx.stroke();
      }
    }
  };

  const handlePointerUp = () => {
    if (!isDrawing.current) return;
    isDrawing.current = false;
    const ctx = getContext();
    if (ctx) {
      ctx.beginPath();
    }
    saveState();
  };

  // Commit text input to canvas
  const commitText = () => {
    if (!textInput.visible || !textInput.text.trim()) {
      setTextInput({ x: 0, y: 0, visible: false, text: '' });
      return;
    }

    const ctx = getContext();
    if (ctx) {
      ctx.save();
      ctx.fillStyle = strokeColor;
      ctx.font = `bold ${Math.max(16, strokeWidth * 4)}px system-ui, -apple-system, sans-serif`;
      ctx.textBaseline = 'top';
      ctx.fillText(textInput.text, textInput.x, textInput.y);
      ctx.restore();
      saveState();
    }

    setTextInput({ x: 0, y: 0, visible: false, text: '' });
  };

  // Export clean canvas buffer as PNG Base64 data URL
  const exportCleanDataUrl = useCallback((): string => {
    const canvas = canvasRef.current;
    if (!canvas) return '';

    // Create a temporary canvas with pure white background to guarantee 0 transparency issues
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) return canvas.toDataURL('image/png');

    tempCtx.fillStyle = '#ffffff';
    tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
    tempCtx.drawImage(canvas, 0, 0);

    return tempCanvas.toDataURL('image/png');
  }, []);

  // Download sketch as PNG file
  const downloadSketch = () => {
    const dataUrl = exportCleanDataUrl();
    if (!dataUrl) return;
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `napkin-wireframe-${Date.now()}.png`;
    a.click();
  };

  // Trigger AI generation
  const handleGenerateClick = useCallback(() => {
    const dataUrl = exportCleanDataUrl();
    if (dataUrl) {
      onGenerate(dataUrl);
    }
  }, [exportCleanDataUrl, onGenerate]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input or textarea
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA'
      ) {
        return;
      }

      // Hotkey: Generate (Cmd/Ctrl + Enter or Space)
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        handleGenerateClick();
      } else if (e.code === 'Space' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        handleGenerateClick();
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          handleRedo();
        } else {
          handleUndo();
        }
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        handleRedo();
      } else if (e.key.toLowerCase() === 'c' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        handleClear();
      } else if (e.key.toLowerCase() === 'p') {
        setCurrentTool('pen');
      } else if (e.key.toLowerCase() === 'r') {
        setCurrentTool('rect');
      } else if (e.key.toLowerCase() === 'o') {
        setCurrentTool('circle');
      } else if (e.key.toLowerCase() === 't') {
        setCurrentTool('text');
      } else if (e.key.toLowerCase() === 'e') {
        setCurrentTool('eraser');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo, handleRedo, handleClear, handleGenerateClick]);

  return (
    <div className="flex flex-col h-full bg-slate-950/60 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl relative select-none">
      {/* Top Canvas Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 z-10">
        {/* Left: Tools Selection */}
        <div className="flex items-center gap-1 bg-slate-950/70 p-1 rounded-xl border border-slate-800/80">
          <button
            onClick={() => setCurrentTool('pen')}
            className={`p-1.5 rounded-lg text-xs transition-all flex items-center gap-1 ${
              currentTool === 'pen'
                ? 'bg-indigo-600 text-white font-medium shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
            title="Pen Tool (P)"
          >
            <Pen className="w-3.5 h-3.5" />
            <span className="hidden xl:inline text-[11px]">Pen</span>
          </button>

          <button
            onClick={() => setCurrentTool('rect')}
            className={`p-1.5 rounded-lg text-xs transition-all flex items-center gap-1 ${
              currentTool === 'rect'
                ? 'bg-indigo-600 text-white font-medium shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
            title="Box / Rectangle Tool (R)"
          >
            <Square className="w-3.5 h-3.5" />
            <span className="hidden xl:inline text-[11px]">Box</span>
          </button>

          <button
            onClick={() => setCurrentTool('circle')}
            className={`p-1.5 rounded-lg text-xs transition-all flex items-center gap-1 ${
              currentTool === 'circle'
                ? 'bg-indigo-600 text-white font-medium shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
            title="Circle / Avatar Tool (O)"
          >
            <Circle className="w-3.5 h-3.5" />
            <span className="hidden xl:inline text-[11px]">Circle</span>
          </button>

          <button
            onClick={() => setCurrentTool('arrow')}
            className={`p-1.5 rounded-lg text-xs transition-all flex items-center gap-1 ${
              currentTool === 'arrow'
                ? 'bg-indigo-600 text-white font-medium shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
            title="Arrow Pointer"
          >
            <MoveRight className="w-3.5 h-3.5" />
            <span className="hidden xl:inline text-[11px]">Arrow</span>
          </button>

          <button
            onClick={() => setCurrentTool('text')}
            className={`p-1.5 rounded-lg text-xs transition-all flex items-center gap-1 ${
              currentTool === 'text'
                ? 'bg-indigo-600 text-white font-medium shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
            title="Text Label (T)"
          >
            <Type className="w-3.5 h-3.5" />
            <span className="hidden xl:inline text-[11px]">Text</span>
          </button>

          <button
            onClick={() => setCurrentTool('eraser')}
            className={`p-1.5 rounded-lg text-xs transition-all flex items-center gap-1 ${
              currentTool === 'eraser'
                ? 'bg-indigo-600 text-white font-medium shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
            title="Eraser (E)"
          >
            <Eraser className="w-3.5 h-3.5" />
            <span className="hidden xl:inline text-[11px]">Eraser</span>
          </button>
        </div>

        {/* Center: Stroke Options */}
        <div className="flex items-center gap-2">
          {/* Stroke Width Selector */}
          <div className="hidden sm:flex items-center gap-1 bg-slate-950/70 p-1 rounded-xl border border-slate-800/80">
            {STROKE_WIDTHS.map((sw) => (
              <button
                key={sw.label}
                onClick={() => setStrokeWidth(sw.value)}
                className={`px-2 py-0.5 text-[11px] rounded-lg transition-all ${
                  strokeWidth === sw.value
                    ? 'bg-indigo-600 text-white font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title={`Stroke Width: ${sw.label}`}
              >
                {sw.label}
              </button>
            ))}
          </div>

          {/* Stroke Style: Dashed / Solid */}
          <button
            onClick={() => setIsDashed(!isDashed)}
            className={`px-2 py-1 rounded-lg text-[11px] border transition-all ${
              isDashed
                ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
                : 'bg-slate-950/70 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
            title="Toggle Dashed Stroke (great for wireframe bounds)"
          >
            - - -
          </button>

          {/* Color Palette */}
          <div className="flex items-center gap-1 bg-slate-950/70 px-2 py-1 rounded-xl border border-slate-800/80">
            {COLOR_PALETTE.map((col) => (
              <button
                key={col.value}
                onClick={() => setStrokeColor(col.value)}
                className={`w-4 h-4 rounded-full transition-transform ${col.bg} ${
                  strokeColor === col.value
                    ? 'ring-2 ring-indigo-400 scale-125'
                    : 'hover:scale-110 opacity-80'
                }`}
                title={col.name}
              />
            ))}
          </div>
        </div>

        {/* Right: History, Presets & Actions */}
        <div className="flex items-center gap-1.5">
          {/* Presets Dropdown */}
          <div className="relative">
            <button
              onClick={() => setPresetDropdownOpen(!presetDropdownOpen)}
              className="flex items-center gap-1 px-2.5 py-1 text-xs bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 rounded-lg border border-slate-700/60 transition-colors"
              title="Load Wireframe Sketch Presets"
            >
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden md:inline">Presets</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {presetDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-800 rounded-2xl p-2 shadow-2xl z-50 animate-fade-in backdrop-blur-xl">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1">
                  Ready-to-Use Sketches
                </div>
                <div className="space-y-1 mt-1">
                  {CANVAS_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => handleLoadPreset(preset)}
                      className="w-full text-left px-2.5 py-2 rounded-xl text-xs hover:bg-indigo-600/20 hover:border-indigo-500/30 border border-transparent transition-all group"
                    >
                      <div className="font-semibold text-slate-200 group-hover:text-white flex items-center justify-between">
                        <span>{preset.name}</span>
                        <span className="text-[10px] text-indigo-400 px-1.5 py-0.5 rounded bg-indigo-500/10">
                          {preset.category}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                        {preset.description}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Grid Toggle */}
          <button
            onClick={() => setShowGrid(!showGrid)}
            className={`p-1.5 rounded-lg transition-colors ${
              showGrid
                ? 'text-indigo-400 bg-indigo-500/10 border border-indigo-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
            title="Toggle Blueprint Grid"
          >
            <Grid className="w-3.5 h-3.5" />
          </button>

          {/* Undo / Redo */}
          <button
            onClick={handleUndo}
            disabled={historyIndex <= 0}
            className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
            title="Undo (Cmd/Ctrl + Z)"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleRedo}
            disabled={historyIndex >= history.length - 1}
            className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
            title="Redo (Cmd/Ctrl + Shift + Z)"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>

          {/* Clear */}
          <button
            onClick={handleClear}
            className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-colors"
            title="Clear Canvas (C)"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>

          {/* Download Sketch */}
          <button
            onClick={downloadSketch}
            className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors"
            title="Export Sketch as PNG"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Canvas Drawing Surface */}
      <div
        ref={containerRef}
        className={`flex-1 relative cursor-crosshair overflow-hidden ${
          showGrid ? 'bg-blueprint' : 'bg-white'
        }`}
      >
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          className="absolute inset-0 block touch-none"
        />

        {/* Inline Text Input Overlay */}
        {textInput.visible && (
          <div
            style={{
              position: 'absolute',
              left: `${textInput.x}px`,
              top: `${textInput.y}px`,
              transform: 'translateY(-50%)',
            }}
            className="z-20 flex items-center gap-1.5 bg-slate-900 border border-indigo-500/60 p-1.5 rounded-xl shadow-2xl"
          >
            <input
              type="text"
              autoFocus
              value={textInput.text}
              onChange={(e) =>
                setTextInput((prev) => ({ ...prev, text: e.target.value }))
              }
              onKeyDown={(e) => {
                if (e.key === 'Enter') commitText();
                if (e.key === 'Escape') setTextInput({ x: 0, y: 0, visible: false, text: '' });
              }}
              placeholder="Type label and press Enter..."
              className="bg-transparent text-white text-xs px-2 py-1 outline-none w-48 font-medium"
            />
            <button
              onClick={commitText}
              className="px-2 py-1 bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-semibold rounded-lg"
            >
              Add
            </button>
          </div>
        )}

        {/* AI Vision Laser Scanning Line Overlay during Generation */}
        {isGenerating && (
          <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden bg-indigo-950/15">
            {/* Animated Laser Beam */}
            <div className="w-full h-1.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_20px_6px_rgba(34,211,238,0.7)] animate-laser-scan absolute left-0" />
            
            {/* Centered Scanner Badge */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2 px-4 py-2 bg-slate-950/90 border border-cyan-500/50 rounded-full shadow-2xl backdrop-blur-md flex items-center gap-2.5 text-cyan-300 text-xs font-semibold animate-pulse">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></span>
              <span>Vision AI Inspecting Wireframe Strokes...</span>
            </div>
          </div>
        )}

        {/* Floating Action Bar: Primary Generate Action */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20">
          <button
            onClick={handleGenerateClick}
            disabled={isGenerating}
            className={`flex items-center gap-2.5 px-6 py-3 rounded-2xl text-xs sm:text-sm font-semibold tracking-wide transition-all duration-300 shadow-2xl ${
              isGenerating
                ? 'bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-700'
                : 'bg-gradient-to-r from-indigo-600 via-indigo-500 to-sky-500 hover:from-indigo-500 hover:to-sky-400 text-white shadow-indigo-600/40 hover:shadow-indigo-600/60 active:scale-95 border border-indigo-400/30'
            }`}
          >
            <Sparkles className={`w-4 h-4 ${isGenerating ? 'animate-spin text-indigo-400' : 'text-amber-300'}`} />
            <span>{isGenerating ? 'Transpiling Sketch...' : 'Generate Component'}</span>
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-black/30 rounded border border-white/20 text-white/90">
              Space / ⌘↵
            </kbd>
          </button>
        </div>
      </div>
    </div>
  );
}
