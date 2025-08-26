<script lang="ts">
	import Card from './Card.svelte';
	import Button from './Button.svelte';
	import type { AnalysisConfig } from './AnalysisService.svelte';

	import { analysisConfig as config } from "$lib/stores/analysisConfig.svelte"

	let {
		visible = $bindable(false),
		class: className = ''
	}: {
		visible?: boolean;
		class?: string;
	} = $props();

	// Local copy for editing
	let editConfig = $state({ ...config });

	function resetToDefaults() {
		editConfig = {
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
			model: config.model,
			apiKey: config.apiKey,
			baseURL: config.baseURL
		};
	}

	function saveConfig() {
		config.systemPrompt = editConfig.systemPrompt;
		config.analysisPrompt = editConfig.analysisPrompt;
		config.remixPrompt = editConfig.remixPrompt;
		config.model = editConfig.model;
		config.apiKey = editConfig.apiKey;
		config.baseURL = editConfig.baseURL;
		visible = false;
	}

	function cancelEdit() {
		editConfig = { ...config };
		visible = false;
	}

	// Update local copy when modal becomes visible
	$effect(() => {
		if (visible) {
			editConfig = { ...config };
		}
	});
</script>

{#if visible}
	<div class="config-overlay">
		<Card class="config-modal {className}">
			<div class="config-header">
				<h2 class="config-title">System Prompt Configuration</h2>
				<p class="config-description">
					Customize the AI prompts and system messages used for analysis.
				</p>
			</div>

			<div class="config-content">
				<div class="config-section">
					<label for="system-prompt" class="config-label">
						System Prompt
						<span class="label-description">The main instruction for the AI assistant</span>
					</label>
					<textarea
						id="system-prompt"
						class="config-textarea"
						bind:value={editConfig.systemPrompt}
						rows="3"
						placeholder="Enter the system prompt..."
					></textarea>
				</div>

				<div class="config-section">
					<label for="analysis-prompt" class="config-label">
						Analysis Prompt Template
						<span class="label-description">Instructions for analyzing individual websites</span>
					</label>
					<textarea
						id="analysis-prompt"
						class="config-textarea large"
						bind:value={editConfig.analysisPrompt}
						rows="12"
						placeholder="Enter the analysis prompt template..."
					></textarea>
				</div>

				<div class="config-section">
					<label for="remix-prompt" class="config-label">
						Remix Prompt Template
						<span class="label-description">Instructions for combining multiple analyses</span>
					</label>
					<textarea
						id="remix-prompt"
						class="config-textarea"
						bind:value={editConfig.remixPrompt}
						rows="4"
						placeholder="Enter the remix prompt template..."
					></textarea>
				</div>
			</div>

			<div class="config-actions">
				<Button variant="outline" onclick={resetToDefaults}>
					Reset to Defaults
				</Button>
				<div class="action-group">
					<Button variant="outline" onclick={cancelEdit}>
						Cancel
					</Button>
					<Button variant="primary" onclick={saveConfig}>
						Save Configuration
					</Button>
				</div>
			</div>
		</Card>
	</div>
{/if}

<style>
	.config-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		padding: var(--spacing-4);
		z-index: 1000;
		backdrop-filter: blur(4px);
	}

	.config-modal {
		width: 100%;
		max-width: 56rem;
		max-height: 90vh;
		overflow-y: auto;
	}

	.config-header {
		text-align: center;
		margin-bottom: var(--spacing-6);
	}

	.config-title {
		font-family: var(--font-display);
		font-size: var(--font-size-2xl);
		font-weight: 600;
		color: var(--color-text-primary);
		margin-bottom: var(--spacing-2);
	}

	.config-description {
		font-size: var(--font-size-base);
		color: var(--color-text-secondary);
		line-height: var(--line-height-relaxed);
		margin: 0;
	}

	.config-content {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-6);
		margin-bottom: var(--spacing-8);
	}

	.config-section {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-2);
	}

	.config-label {
		font-size: var(--font-size-sm);
		font-weight: 600;
		color: var(--color-text-primary);
		display: flex;
		flex-direction: column;
		gap: var(--spacing-1);
	}

	.label-description {
		font-weight: 400;
		font-size: var(--font-size-xs);
		color: var(--color-text-tertiary);
	}

	.config-textarea,
	.config-input {
		width: 100%;
		padding: var(--spacing-3);
		border: 1px solid var(--color-border-subtle);
		border-radius: var(--radius-md);
		background-color: var(--color-bg-surface);
		color: var(--color-text-primary);
		font-family: 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace;
		font-size: var(--font-size-sm);
		line-height: var(--line-height-relaxed);
		resize: vertical;
		transition: all var(--duration-normal) var(--easing-standard);
	}

	.config-textarea.large {
		font-size: var(--font-size-xs);
	}

	.config-input {
		font-family: var(--font-body);
		resize: none;
	}

	.config-textarea:focus,
	.config-input:focus {
		outline: none;
		border-color: var(--color-border-focus);
		box-shadow: 0 0 0 3px color-mix(in oklab, var(--color-accent-primary) 15%, transparent);
	}

	.config-textarea::placeholder,
	.config-input::placeholder {
		color: var(--color-text-tertiary);
		font-style: italic;
	}

	.config-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--spacing-4);
	}

	.config-actions {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: var(--spacing-4);
		padding-top: var(--spacing-6);
		border-top: 1px solid var(--color-border-subtle);
	}

	.action-group {
		display: flex;
		gap: var(--spacing-3);
	}

	@media (max-width: 768px) {
		.config-overlay {
			padding: var(--spacing-2);
		}

		.config-modal {
			max-height: 95vh;
		}

		.config-grid {
			grid-template-columns: 1fr;
		}

		.config-actions {
			flex-direction: column;
			align-items: stretch;
		}

		.action-group {
			justify-content: stretch;
		}

		.action-group :global(.btn) {
			flex: 1;
		}
	}
</style>