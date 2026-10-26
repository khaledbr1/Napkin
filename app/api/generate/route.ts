import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const SYSTEM_INSTRUCTION = `You are a master UI/UX frontend engineer and elite React developer.
Inspect the provided hand-drawn wireframe sketch and convert it into a high-performance, production-grade, functional React component styled with Tailwind CSS.

TECHNICAL RULES:
1. Component Definition:
   - Provide a self-contained functional component named GeneratedComponent exported as default:
     export default function GeneratedComponent() { ... }
   - Do NOT include 'import React' or other 'import ...' statements (React, useState, useEffect, useMemo, useCallback, useRef are injected globally into the sandbox runner).
2. Clean Output:
   - Return ONLY the executable component code.
   - Do NOT wrap in markdown codeblocks (no \`\`\`jsx or \`\`\`).
   - Do NOT include introductory greetings, notes, explanations, or commentary.
3. Aesthetics & Quality:
   - Modern, high-end styling: subtle borders (border-slate-800 or border-zinc-200), soft shadows, refined gradients, clean typography, rounded corners (rounded-2xl or rounded-xl).
   - Rich color palettes (slate, zinc, indigo, sky, violet, emerald).
   - Smooth hover/active transitions (transition-all duration-200 hover:scale-[1.01] active:scale-[0.98]).
   - For icons, you can use Lucide components directly (<Check />, <X />, <ArrowRight />, <Mail />, <Lock />, <User />, <Search />, <Eye />, <EyeOff />, <Star />, <Settings />, etc.) or simple inline SVGs.
   - Always ensure all JSX tags are completely closed and valid.
`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { image, promptModifier, customApiKey, model: requestedModel } = body;

    if (!image) {
      return NextResponse.json(
        { error: 'Image data is required.' },
        { status: 400 }
      );
    }

    // Determine API Key: custom key from client > environment variable
    const apiKey =
      customApiKey?.trim() ||
      (process.env.GROQ_API_KEY && process.env.GROQ_API_KEY !== 'groq api key here' ? process.env.GROQ_API_KEY : '');

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Groq API Key is missing. Please provide a key in settings.' },
        { status: 401 }
      );
    }

    const groq = new Groq({ apiKey });

    // Ensure image is clean base64 data URL
    let imageUrl = image;
    if (!imageUrl.startsWith('data:image/')) {
      imageUrl = `data:image/png;base64,${image}`;
    }

    const basePrompt = `You are an elite React frontend engineer. Analyze this hand-drawn wireframe and generate a single, complete, production-grade React component styled with Tailwind CSS.

CRITICAL RULES:
1. Export: export default function GeneratedComponent() { ... }
2. No imports. React hooks (useState, useEffect, useMemo, useCallback, useRef) are globally available.
3. Absolutely NO <svg> or <path> tags. If icons or logos are drawn (Google, GitHub, social logos, locks, checks), use Lucide components (<Lock className="w-4 h-4" />, <Mail />, <Eye />, <Check />, <User />, <ArrowRight />) or clean text like <span>G</span>.
4. Keep the component concise, focused, and under 40 lines of JSX. Focus directly on the card container, inputs, and action buttons. No heavy filler blobs.
5. Interactive UI: wire realistic useState for form controls and button actions.
6. COMPLETENESS: Every single JSX element (<input />, <div>, etc.) and function braces MUST be completely closed.`;

    const userPromptText = promptModifier
      ? `${basePrompt}\n\nAdditional user design instructions: "${promptModifier}".`
      : basePrompt;

    // Groq's active vision model is qwen/qwen3.8-27b (llama-3.2 vision preview models have been decommissioned)
    const primaryModel = requestedModel || process.env.GROQ_VISION_MODEL || 'qwen/qwen3.8-27b';
    const modelsToTry = [primaryModel, 'qwen/qwen3.8-27b'].filter(
      (m, idx, arr) => arr.indexOf(m) === idx
    );

    // Limit max_tokens to 850 on free tier to stay within Groq's 1000 OTPM rate limit while allowing full component completion
    const tokenLimit = customApiKey ? 2048 : 850;

    let completion: any = null;
    let modelUsed = primaryModel;
    let lastError: any = null;

    for (const modelCandidate of modelsToTry) {
      try {
        completion = await groq.chat.completions.create({
          model: modelCandidate,
          temperature: 0.15,
          max_tokens: tokenLimit,
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: userPromptText,
                },
                {
                  type: 'image_url',
                  image_url: {
                    url: imageUrl,
                  },
                },
              ],
            },
          ],
        });
        modelUsed = modelCandidate;
        break;
      } catch (err: any) {
        lastError = err;
        console.warn(`Groq model ${modelCandidate} failed: ${err.message}. Trying next candidate...`);
      }
    }

    if (!completion) {
      throw lastError || new Error('Failed to obtain completion from Groq Vision API.');
    }

    const rawResponse = completion.choices[0]?.message?.content || '';

    // Strip markdown code fences if model enclosed it
    let cleanCode = rawResponse.trim();
    const markdownMatch = cleanCode.match(/```(?:jsx|tsx|javascript|typescript|react)?([\s\S]*?)```/);
    if (markdownMatch) {
      cleanCode = markdownMatch[1].trim();
    } else {
      // If code fence was not closed due to length, strip leading fence
      cleanCode = cleanCode.replace(/^```[a-zA-Z]*\n/m, '');
    }

    // Clean any accidental top imports (single or multiline, with or without indentation)
    cleanCode = cleanCode.replace(/^\s*import\s+[\s\S]*?from\s+['"].*?['"];?\s*$/gm, '');
    cleanCode = cleanCode.replace(/^\s*import\s+['"].*?['"];?\s*$/gm, '');

    // Ensure it exports default function GeneratedComponent or adjust signature
    if (!cleanCode.includes('GeneratedComponent')) {
      cleanCode = cleanCode.replace(
        /export\s+default\s+function\s+([A-Za-z0-9_]+)/,
        'export default function GeneratedComponent'
      );
      if (!cleanCode.includes('export default function GeneratedComponent')) {
        cleanCode = cleanCode.replace(/export\s+default\s+([A-Za-z0-9_]+);?/, '');
        cleanCode += '\n\nexport default GeneratedComponent;';
      }
    }

    // Auto-heal any truncated JSX tags or unclosed function braces
    cleanCode = cleanCode.replace(/<[^>]*$/, '').trim();

    const tagRegex = /<\/?([A-Za-z0-9_\-]+)(?:\s+[^>]*?)?(\/?)>/g;
    const voidTags = new Set(['input', 'img', 'br', 'hr', 'meta', 'link']);
    const stack: string[] = [];
    let tagMatch: RegExpExecArray | null;

    while ((tagMatch = tagRegex.exec(cleanCode)) !== null) {
      const isClosing = tagMatch[0].startsWith('</');
      const tagName = tagMatch[1];
      const isSelfClosing = tagMatch[2] === '/' || voidTags.has(tagName.toLowerCase());

      if (isClosing) {
        const lastIdx = stack.lastIndexOf(tagName);
        if (lastIdx !== -1) {
          stack.splice(lastIdx, 1);
        }
      } else if (!isSelfClosing) {
        stack.push(tagName);
      }
    }

    while (stack.length > 0) {
      const unclosed = stack.pop();
      cleanCode += `\n</${unclosed}>`;
    }

    // Balance open parens (e.g. for unclosed `return (`)
    const openParens = (cleanCode.match(/\(/g) || []).length;
    const closeParens = (cleanCode.match(/\)/g) || []).length;
    for (let i = 0; i < openParens - closeParens; i++) {
      cleanCode += '\n);';
    }

    // Balance open braces
    const openBraces = (cleanCode.match(/\{/g) || []).length;
    const closeBraces = (cleanCode.match(/\}/g) || []).length;
    for (let i = 0; i < openBraces - closeBraces; i++) {
      cleanCode += '\n}';
    }

    cleanCode = cleanCode.trim();

    return NextResponse.json({
      success: true,
      code: cleanCode,
      model: modelUsed,
      usage: completion.usage,
    });
  } catch (error: any) {
    console.error('Groq Generation Error:', error);

    const errorMessage = error?.message || 'Failed to generate component from sketch.';
    return NextResponse.json(
      {
        error: errorMessage,
        details: error?.response?.data || error?.toString(),
      },
      { status: 500 }
    );
  }
}
