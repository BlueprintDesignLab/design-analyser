# Design Analyser (Svelte 5 + SvelteKit + OpenAI)

Analyse and generate design insights from up to three public reference websites. The app server-side fetches and summarises HTML/CSS, merges design signals, and produces a brand-safe, accessibility-minded analysis using OpenAI.

## Features

- Input up to 3 public URLs
- Server-side fetching of HTML and linked stylesheets (first-level)
- Summarization into design tokens, layout landmarks, and component patterns
- Design analysis generation using OpenAI gpt-5
- Copy-to-clipboard and Download as .md
- Guardrails to avoid copying proprietary assets/branding
- No persistence; API key never exposed to the client

## Tech Stack

- Svelte 5 (Runes) + SvelteKit
- TypeScript
- OpenAI SDK (server-side only)
- Vite (dev/build)

## Architecture

- UI (Svelte 5): single page with three URL inputs and “Generate” button
- Server endpoint:
  - Validates URLs (http/https), enforces timeouts and size caps
  - Fetches HTML and first-level rel="stylesheet" CSS (absolute/relative, capped)
  - Strips scripts, normalizes and truncates payloads
  - Extracts summarized design signals:
    - Design tokens: colors, typography, spacing, radii, shadows
    - Layout: landmarks, grids, content width, breakpoints, section rhythm
    - Components: buttons, cards, forms, navs, footers
    - Accessibility cues: focus states, contrast hints, landmarks
  - Calls OpenAI gpt-5 to produce a comprehensive design analysis focused on code generation
  - Explicit constraints to avoid branding and copying; “inspired-by” framing

## Prerequisites

- Node 18+
- OpenAI API key with access to model: gpt-5

## Setup

1. Install dependencies
   - npm install

2. Environment
   - Create a .env file in the project root:
     - OPENAI_API_KEY=your_api_key_here

   Also include a .env.example (not required to run):
   - OPENAI_API_KEY=sk-...

3. Run dev server
   - npm run dev
   - Open http://localhost:5173

## Usage

1. Enter up to three public URLs (http/https).
2. Click “Generate”.
3. Review the resulting design analysis; use Copy or Download .md.

Fetching behavior:

- Fetches each URL’s HTML (no JS execution).
- Resolves and fetches first-level rel="stylesheet" links (absolute/relative; limited count).
- If a URL fails, the app proceeds with the rest and annotates limitations in the result.

## What is extracted (best effort)

- Colors (hex/rgb/hsl), fonts, font sizes/weights/line-heights
- Spacing scale, border radii, shadows
- Layout landmarks and grid patterns, content width and breakpoints
- Common component patterns (buttons, cards, forms, navs, footers)
- Accessibility signals (landmarks, focus outlines, contrast)

Notes:

- Heuristic extraction; heavy CSR/CSS-in-JS may reduce visibility via HTTP fetch alone.
- The app does not run a headless browser.

## OpenAI Output

The design analysis:

- Consolidates signals from all references into a coherent, code-focused guide
- Emphasizes accessibility (WCAG AA), focus states, ARIA landmarks
- Avoids brand assets, logos, and proprietary copy
- Gives concrete implementation direction (e.g., tokens, layout rules, component styles)

## Guardrails and Legal Considerations

- Do not copy brand assets, logos, or proprietary content
- Do not reproduce unique protected designs verbatim
- The analysis is framed as "inspired by" public references
- You are responsible for compliance with applicable laws/terms

## Limits and Reliability

- Some sites may block or throttle server-side requests
- Large pages/styles are truncated for safety and cost control
- Only first-level rel=stylesheet links are fetched (no JS bundle parsing)
- No persistence; data is processed per request only

## Scripts

- npm run dev: Start dev server
- npm run build: Build for production
- npm run preview: Preview production build
- npm run lint: Lint (if configured)
- npm run check: Typecheck (if configured)

## Project Structure (key files you’ll have)

- src/routes/+page.svelte: UI (Svelte 5 runes)
- src/routes/generate/+server.ts: POST endpoint (fetch/summarize/generate)
- src/lib/openai.ts: Server-side OpenAI client helper
- .env.example: OPENAI_API_KEY placeholder

## Environment Variables

- OPENAI_API_KEY (required, server only; never sent to the client)

## Security

- API key read only on server; never exposed to client
- URL validation (http/https), timeouts, size caps
- Basic SSRF mitigations (protocol allowlist, host and length checks)

## Roadmap

- Optional headless browser screenshots + vision models
- User-provided HTML/CSS snippets or uploads
- Export summarized tokens as JSON/CSS variables
- Advanced reconciliation controls for conflicting tokens

## License

MIT
