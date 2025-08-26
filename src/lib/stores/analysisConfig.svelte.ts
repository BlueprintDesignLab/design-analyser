import type { AnalysisConfig } from '$lib/components/AnalysisService.svelte';

export const defaultConfig = {
   systemPrompt: 'You extract brand-safe, accessible, implementation-focused design briefs.',
   analysisPrompt: `You are a senior product designer and front-end lead. Analyze the single public reference below and produce an actionable, brand-agnostic design system brief that a human or AI can use`,
   remixPrompt: `Remix the following per-site design briefs into a single, unified reference suitable for creating a NEW site. Keep brand-agnostic and implementation-ready.`,
   model: 'gpt-4.1-mini',
   apiKey: 'dummy-key',
   baseURL: 'https://llm-proxy-735482512776.us-west1.run.app'
}

// Global analysis configuration store using Svelte 5 runes
export const analysisConfig = $state<AnalysisConfig>(defaultConfig);

// Show config modal state
export const showConfigState = $state({ value: false });
export const showConfig = {
	get value() { return showConfigState.value; },
	set value(v: boolean) { showConfigState.value = v; }
};