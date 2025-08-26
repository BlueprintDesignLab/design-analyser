<script lang="ts">
	import HeroSection from '$lib/components/HeroSection.svelte';
	import URLForm from '$lib/components/URLForm.svelte';
	import AnalysisResults from '$lib/components/AnalysisResults.svelte';
	import UnifiedBrief from '$lib/components/UnifiedBrief.svelte';
	import Alert from '$lib/components/Alert.svelte';
  
	import AnalysisService, { type SiteData } from '$lib/components/AnalysisService.svelte';
	import SystemPromptConfig from '$lib/components/SystemPromptConfig.svelte';
  
	import { analysisConfig } from '$lib/stores/analysisConfig.svelte';

	// State management
	let urls = $state<string[]>(['https://www.apple.com/', 'https://zen-browser.app/', 'https://svelte.dev/']);
	let generating = $state<boolean[]>([]);
	let loading = $state(false);
	let error = $state<string | null>(null);
	let summaries = $state<string[]>([]);
	let canRemix = $state(false);
	let remixing = $state(false);
	let remixText = $state('');
	let showSystemPromptModal = $state(false);

	// Analysis service instance
	let analysisService: AnalysisService;

	async function handleFormSubmit({
		urls: formUrls
	}: {
		urls: string[];
	}) {
		error = null;
		summaries = [];
		remixText = '';
		canRemix = false;
		generating = [];

		urls = [...formUrls, '', '', ''].slice(0, 3); // Ensure 3 slots

		loading = true;

		try {
			// Fetch website data
			const response = await fetch('/extract', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ urls: formUrls })
			});

			if (!response.ok) {
				const errorData = await response.text();
				throw new Error(errorData || 'Failed to extract website data');
			}

			const data = await response.json();
			const sites = data.sites as SiteData[];

			// Prepare summaries array
			summaries = sites.map(() => '');
			generating = sites.map(() => false);

			// Use analysis service
			await analysisService.analyzeSites(sites);

			// Check if any analysis succeeded
			const hasResults = summaries.some((s) => s.trim().length > 0);
			if (!hasResults) {
				throw new Error('Failed to generate any analysis. Please try again.');
			}

			canRemix = true;
		} catch (err: any) {
			error = err?.message || 'An unexpected error occurred';
		} finally {
			loading = false;
		}
	}

	async function handleRemixGeneration() {
		if (summaries.every((s) => !s.trim())) return;

		remixText = '';
		remixing = true;

		try {
			await analysisService.generateRemix(summaries);
		} catch (err: any) {
			error = err?.message || 'Failed to generate unified brief. Please try again.';
		} finally {
			remixing = false;
		}
	}

	function handleAnalysisUpdate(index: number, content: string, isComplete: boolean, isStarting: boolean = false) {
		if (index === -1) {
			// Remix update
			if (!isComplete) {
				remixText += content;
			}
		} else {
			// Individual analysis update
			if (isStarting) {
				generating[index] = true;
			} else if (!isComplete) {
				summaries[index] += content;
			} else {
				generating[index] = false;
			}
		}
	}

	function handleAnalysisError(errorMessage: string) {
		error = errorMessage;
	}

	function dismissError() {
		error = null;
	}
</script>

<div class="main-container">
	<!-- Hero Section -->
	<HeroSection
		title="CSS Design Pattern <span class='text-[var(--color-accent-primary)]'>Extractor</span>"
	/>

	<!-- System Prompt Configuration Button -->
	<div class="system-prompt-button-container">
		<button
			type="button"
			class="system-prompt-button"
			onclick={() => (showSystemPromptModal = true)}
		>
			<svg
				class="button-icon"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
				stroke-width="2"
			>
				<path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
				<path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
			</svg>
			System Prompt Configuration
		</button>
	</div>

	<!-- URL Input Form -->
	<URLForm bind:urls {loading} onSubmit={handleFormSubmit} />

	<!-- Error Display -->
	{#if error}
		<Alert
			variant="danger"
			title="Analysis Error"
			dismissible
			onDismiss={dismissError}
			class="error-alert"
		>
			{error}
		</Alert>
	{/if}

	<!-- Analysis Results -->
	<AnalysisResults {summaries} {generating} {urls} />

	<!-- Unified Brief -->
	<UnifiedBrief bind:remixText {remixing} {canRemix} onGenerate={handleRemixGeneration} />

	<!-- Analysis Service -->
	<AnalysisService
		bind:this={analysisService}
		config={analysisConfig}
		onAnalysisUpdate={handleAnalysisUpdate}
		onError={handleAnalysisError}
	/>

	<!-- System Prompt Configuration Modal -->
	<SystemPromptConfig bind:visible={showSystemPromptModal} />
</div>

<style>
	.main-container {
		max-width: 68rem;
		margin: 0 auto;
		padding: 0 var(--container-padding);
	}

	.main-container :global(.error-alert) {
		margin-bottom: var(--spacing-8);
		max-width: 42rem;
		margin-left: auto;
		margin-right: auto;
	}

	/* Ensure proper spacing between sections */
	.main-container > :global(* + *) {
		margin-top: var(--spacing-8);
	}

	.system-prompt-button-container {
		max-width: 42rem;
		margin: 0 auto;
		display: flex;
		justify-content: center;
	}

	.system-prompt-button {
		display: flex;
		align-items: center;
		gap: var(--spacing-2);
		padding: var(--spacing-3) var(--spacing-4);
		border: 1px solid var(--color-border-subtle);
		border-radius: var(--radius-md);
		background: var(--color-bg-surface);
		color: var(--color-text-secondary);
		font-size: var(--font-size-sm);
		font-weight: 500;
		cursor: pointer;
		transition: all var(--duration-normal) var(--easing-standard);
	}

	.system-prompt-button:hover {
		background: var(--color-bg-secondary);
		color: var(--color-text-primary);
		border-color: var(--color-border-muted);
	}

	.button-icon {
		width: 1rem;
		height: 1rem;
		color: inherit;
	}

	@media (max-width: 768px) {
		.main-container {
			padding: 0 var(--spacing-4);
		}

		.main-container > :global(* + *) {
			margin-top: var(--spacing-6);
		}

	}
</style>
