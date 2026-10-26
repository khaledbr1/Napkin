# ✏️ Napkin — AI Wireframe to Live React Sandbox

<p align="center">
  <b>Turn hand-drawn UI sketches and wireframes into interactive, live-rendered React components with Tailwind CSS in sub-second inference speed.</b>
</p>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#️-keyboard-shortcuts">Shortcuts</a> •
  <a href="#️-tech-stack">Tech Stack</a> •
  <a href="#-project-structure">Architecture</a>
</p>

---

## ✨ Features

- 🎨 **Interactive Drawing Canvas:**
  - Multi-tool sketching suite: **Pen (`P`)**, **Rectangle (`R`)**, **Circle (`O`)**, **Arrow**, **Text (`T`)**, and **Eraser (`E`)**.
  - Stroke weight presets: Fine (2px), Medium (4px), Thick (8px), Marker (16px).
  - Curated color palette (Slate, Sky, Emerald, Amber, Rose, Violet).
  - DPI Retina scaling with aspect-ratio preserving window resize.
  - Full Undo / Redo history stack and one-click Clear.

- ⚡ **Groq LPU Vision Inference:**
  - Powered by Groq's vision models (`qwen/qwen3.8-27b`) via the official `groq-sdk`.
  - Near-instantaneous (sub-second) turnaround from hand sketch to functional React component.
  - Custom prompt modifier drawer to request specific themes, color schemes, or functionality.

- 📦 **Pre-built Wireframe Presets:**
  - **Modern Auth Card:** Login card with social auth, email/password inputs, and toggleable password visibility.
  - **SaaS Pricing Grid:** 3-tier pricing comparison with Popular badge, feature checklists, and CTA buttons.
  - **Analytics Dashboard:** KPI statistics cards, sparkline graphs, and activity list.
  - **Hero Landing Section:** SaaS headline, dual CTA buttons, trust badges, and app mockup.
  - **E-Commerce Product Card:** Product showcase with image placeholder, star ratings, color swatches, and cart button.

- 🖥️ **Live Sandbox Preview:**
  - Isolated client `<iframe>` runner with Tailwind CSS CDN, React 18, and `@babel/standalone`.
  - **Responsive Viewport Modes:** Desktop (100%), Tablet (768px), and Mobile (375px with simulated smartphone notch and bezel).
  - Self-healing JSX engine that gracefully recovers and balances unclosed tags and braces.
  - Built-in global React hooks (`useState`, `useEffect`, `useMemo`, `useCallback`, `useRef`, `useContext`, `useReducer`, `useId`) and Lucide icon mocks.
  - "Open in New Window" support with synced session storage.

- 💻 **Monaco Code Editor:**
  - Embedded VS Code Monaco Editor (`@monaco-editor/react`) with TypeScript JSX syntax highlighting.
  - Live two-way debounced synchronization between code edits and the live preview.
  - One-click **Copy Code** and **Download Component (`GeneratedComponent.tsx`)**.

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18.17 or later)
- [pnpm](https://pnpm.io/) or `npm`
- A [Groq Cloud](https://console.groq.com/) API Key

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/khaledbr1/Napkin.git
   cd Napkin
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Configure Environment Variables:**
   Create a `.env.local` file in the root directory (or copy from `.env.example`):
   ```bash
   cp .env.example .env.local
   ```
   Add your Groq API key:
   ```env
   GROQ_API_KEY=groq api key here
   ```
   *(Alternatively, you can provide your API key directly inside the app using the **API Key** button in the top navigation bar).*

4. **Start the development server:**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

5. **Open the app:**
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| `P` | Select **Pen** tool |
| `R` | Select **Box / Rectangle** tool |
| `O` | Select **Circle** tool |
| `T` | Select **Text** tool |
| `E` | Select **Eraser** tool |
| `Ctrl + Z` / `⌘Z` | **Undo** last stroke |
| `Ctrl + Shift + Z` / `⌘⇧Z` | **Redo** undone stroke |
| `C` | **Clear** entire canvas |
| `Space` or `Ctrl + Enter` / `⌘↵` | **Generate Component** |

---

## 🛠️ Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router, Turbopack)
- **Language:** TypeScript
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **AI Backend:** [Groq SDK](https://github.com/groq/groq-typescript) (`qwen/qwen3.8-27b`)
- **Code Editor:** [Monaco Editor](https://microsoft.github.io/monaco-editor/) (`@monaco-editor/react`)
- **Client Sandbox:** Custom standalone runner (`public/sandbox-runner.html`) powered by `@babel/standalone` and Tailwind CDN

---

## 📁 Project Structure

```
napkin/
├── app/
│   ├── api/
│   │   └── generate/
│   │       └── route.ts         # Groq Vision inference route handler
│   ├── globals.css              # Global styles & Tailwind v4 theme
│   ├── layout.tsx               # Root application layout
│   └── page.tsx                 # Main dual-pane application workspace
├── components/
│   ├── Canvas.tsx               # High-DPI HTML5 canvas with drawing tools
│   ├── CodeEditor.tsx           # Monaco code editor with live debounced sync
│   ├── Header.tsx               # App header, model badge, API settings modal
│   ├── PreviewSandbox.tsx       # Live preview sandbox with viewport frames
│   └── Toast.tsx                # Floating status notifications
├── lib/
│   ├── canvas-presets.ts        # Pre-built wireframe sketches
│   └── default-code.ts          # Starter component shown on launch
├── public/
│   └── sandbox-runner.html      # Isolated sandbox iframe runner with Babel & Tailwind
├── .env.example                 # Example environment variables template
├── .env.local                   # Local environment variables
└── README.md
```

---

## 📄 License

This project is licensed under the MIT License.
