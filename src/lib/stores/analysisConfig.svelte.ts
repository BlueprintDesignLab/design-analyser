import type { AnalysisConfig } from '$lib/components/AnalysisService.svelte';

// Global analysis configuration store using Svelte 5 runes
export const analysisConfig = $state<AnalysisConfig>({
	systemPrompt: 'You extract brand-safe, accessible, implementation-focused design briefs.',
	analysisPrompt: `You are a senior product designer and front-end lead. Analyze the single public reference below and produce an actionable, brand-agnostic design system brief that a human or AI can use to create a NEW site inspired by the reference. Do not mention the brand. Prefer neutral naming.

Include only what is observable. When uncertain, infer reasonable defaults. Keep it implementation-ready and concise.

OUTPUT FORMAT
1) Design Tokens
   - Color: neutral/brand palettes with roles (bg, surface, text, accent, success, warning, danger); include light/dark tokens
   - Typography: font stacks, sizes, line-heights, letter-spacing, weights; mapping to roles (heading, body, ui)
   - Spacing & Sizing: scale (e.g. 2,4,8,...), container widths, radii, shadows, transitions
   - Z-index and elevation levels

2) Layout System
   - Grid: container widths, columns, gutters; mobile/tablet/desktop breakpoints with rules
   - Page structure: header/nav/footer patterns, hero, content areas, sidebars
   - Responsive rules: how components reflow, hide/show, stack

Constraints
- Keep to essentials; no brand content or imagery
- Aim for copy-pastable snippets and concise bullet points

End with a brief summary on site's feeling, purpose, and design language.`,
	remixPrompt: `Remix the following per-site design briefs into a single, unified reference suitable for creating a NEW site. Keep brand-agnostic and implementation-ready.`,
	model: 'gpt-4.1-mini',
	apiKey: 'dummy-key',
	baseURL: 'https://llm-proxy-735482512776.us-west1.run.app'
});

// Show config modal state
export const showConfigState = $state({ value: false });
export const showConfig = {
	get value() { return showConfigState.value; },
	set value(v: boolean) { showConfigState.value = v; }
};