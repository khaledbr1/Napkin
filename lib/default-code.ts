export const DEFAULT_STARTER_CODE = `export default function GeneratedComponent() {
  const [activeTab, setActiveTab] = useState('overview');
  const [likes, setLikes] = useState(142);
  const [isLiked, setIsLiked] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
      setTimeout(() => setIsSubmitted(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-slate-100 p-6 flex items-center justify-center font-sans antialiased">
      <div className="w-full max-w-xl bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl shadow-indigo-950/50 space-y-8">
        
        {/* Header Section */}
        <div className="flex items-start justify-between">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium mb-3">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
              AI Canvas-to-Code Ready
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              Napkin Sandbox
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Draw wireframes on the left, convert to live React code in real-time.
            </p>
          </div>
          
          <button 
            onClick={handleLike}
            className={\`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium transition-all duration-200 \${
              isLiked 
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' 
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/60'
            }\`}
          >
            <span className="text-sm">{isLiked ? '❤️' : '🤍'}</span>
            <span>{likes}</span>
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex p-1 bg-slate-950/60 rounded-xl border border-slate-800/80">
          {['overview', 'features', 'metrics'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={\`flex-1 py-2 text-xs font-medium capitalize rounded-lg transition-all duration-200 \${
                activeTab === tab
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }\`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-slate-950/40 border border-slate-800/50 rounded-2xl p-5 space-y-4">
          {activeTab === 'overview' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Vision Engine</span>
                <span className="font-medium text-emerald-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  Groq High-Speed LLM
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Compilation</span>
                <span className="font-medium text-indigo-400">Babel Standalone + Tailwind</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Canvas Engine</span>
                <span className="font-medium text-sky-400">High-DPI Retina HTML5</span>
              </div>
            </div>
          )}

          {activeTab === 'features' && (
            <ul className="text-xs text-slate-300 space-y-2">
              <li className="flex items-center gap-2">
                <span className="text-emerald-400">✓</span> Freehand Pen, Box, Circle, Arrow, and Text tools
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-400">✓</span> Instant Undo/Redo history stack with hotkeys
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-400">✓</span> Monaco Editor with live debounced two-way preview
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-400">✓</span> Built-in UI presets for instant testing
              </li>
            </ul>
          )}

          {activeTab === 'metrics' && (
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                <div className="text-lg font-bold text-white">&lt; 1.5s</div>
                <div className="text-[10px] text-slate-400">Inference Speed</div>
              </div>
              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                <div className="text-lg font-bold text-emerald-400">100%</div>
                <div className="text-[10px] text-slate-400">Client Sandbox</div>
              </div>
              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                <div className="text-lg font-bold text-indigo-400">0ms</div>
                <div className="text-[10px] text-slate-400">Canvas Latency</div>
              </div>
            </div>
          )}
        </div>

        {/* Interactive Form */}
        <form onSubmit={handleSubscribe} className="space-y-3">
          <label className="block text-xs font-medium text-slate-300">
            Quick Action Newsletter
          </label>
          <div className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter developer email..."
              className="flex-1 bg-slate-950/80 border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-medium px-4 py-2.5 rounded-xl text-xs transition-all duration-200 shadow-lg shadow-indigo-600/30"
            >
              Join Beta
            </button>
          </div>
          {isSubmitted && (
            <p className="text-xs text-emerald-400 animate-fade-in flex items-center gap-1.5">
              <span>✓</span> Successfully subscribed! Check your inbox soon.
            </p>
          )}
        </form>

      </div>
    </div>
  );
}
`;
