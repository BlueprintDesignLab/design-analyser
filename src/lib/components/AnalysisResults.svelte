<script lang="ts">
	import Card from './Card.svelte';
	import Button from './Button.svelte';
	import LoadingSpinner from './LoadingSpinner.svelte';

	let {
		summaries = [],
		generating = [],
		urls = [],
		class: className = ''
	}: {
		summaries?: string[];
		generating?: boolean[];
		urls?: string[];
		class?: string;
	} = $props();

	function copyToClipboard(text: string) {
		if (navigator.clipboard) {
			navigator.clipboard.writeText(text);
		}
	}

	function getHostname(url: string): string {
		try {
			return new URL(url).hostname;
		} catch {
			return 'Invalid URL';
		}
	}
</script>

{#if summaries.length > 0}
	<section class="results-section {className}">
		<div class="results-header">
			<h2 class="results-title">Design Analysis Results</h2>
			<p class="results-description">
				Individual site analyses with extracted design patterns and implementation details.
			</p>
		</div>

		<div class="results-grid">
			{#each summaries as summary, i}
				<Card class="result-card" padding="none">
					<div class="result-header">
						<div class="result-info">
							<div class="result-badge">{i + 1}</div>
							<div class="result-meta">
								<h3 class="result-name">Site Analysis {i + 1}</h3>
								{#if urls[i] && urls[i].trim()}
									<p class="result-url">{getHostname(urls[i])}</p>
								{/if}
							</div>
						</div>

						{#if generating[i]}
							<div class="result-status">
								<LoadingSpinner size="sm" text="Analyzing..." />
							</div>
						{/if}
					</div>

					<div class="result-content">
						{#if generating[i] && !summary.trim()}
							<div class="result-loading">
								<LoadingSpinner size="lg" text="Extracting design patterns from website..." />
							</div>
						{:else}
							<div class="result-output">
								<textarea
									readonly
									class="result-textarea"
									placeholder={generating[i]
										? 'Analyzing website design patterns...'
										: 'Analysis will appear here'}
									value={summary}
								></textarea>

								{#if summary.trim().length > 0}
									<div class="result-actions">
										<Button variant="outline" size="sm" onclick={() => copyToClipboard(summary)}>
											<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
												/>
											</svg>
											Copy Analysis
										</Button>
									</div>
								{/if}
							</div>
						{/if}
					</div>
				</Card>
			{/each}
		</div>
	</section>
{/if}

<style>
	.results-section {
		margin-bottom: var(--spacing-12);
	}

	.results-header {
		text-align: center;
		margin-bottom: var(--spacing-8);
	}

	.results-title {
		font-family: var(--font-display);
		font-size: var(--font-size-2xl);
		font-weight: 600;
		color: var(--color-text-primary);
		margin-bottom: var(--spacing-3);
	}

	.results-description {
		font-size: var(--font-size-base);
		color: var(--color-text-secondary);
		line-height: var(--line-height-relaxed);
		margin: 0;
		max-width: 42rem;
		margin-left: auto;
		margin-right: auto;
	}

	.results-grid {
		display: grid;
		gap: var(--spacing-6);
		max-width: 56rem;
		margin: 0 auto;
	}

	.result-card {
		overflow: hidden;
	}

	.result-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: var(--spacing-4);
		border-bottom: 1px solid var(--color-border-subtle);
		background-color: var(--color-bg-muted);
	}

	.result-info {
		display: flex;
		align-items: center;
		gap: var(--spacing-3);
	}

	.result-badge {
		width: 2rem;
		height: 2rem;
		border-radius: 50%;
		background-color: var(--color-accent-primary);
		color: white;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: var(--font-size-sm);
		font-weight: 600;
		flex-shrink: 0;
	}

	.result-meta {
		min-width: 0;
	}

	.result-name {
		font-size: var(--font-size-lg);
		font-weight: 600;
		color: var(--color-text-primary);
		margin: 0;
		margin-bottom: 0.25rem;
	}

	.result-url {
		font-size: var(--font-size-sm);
		color: var(--color-text-tertiary);
		margin: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.result-status {
		flex-shrink: 0;
	}

	.result-content {
		padding: var(--spacing-4);
	}

	.result-loading {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 12rem;
		text-align: center;
	}

	.result-output {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-3);
	}

	.result-textarea {
		width: 100%;
		min-height: 20rem;
		padding: var(--spacing-4);
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

	.result-textarea:focus {
		outline: none;
		border-color: var(--color-border-focus);
		box-shadow: 0 0 0 3px color-mix(in oklab, var(--color-accent-primary) 15%, transparent);
	}

	.result-textarea::placeholder {
		color: var(--color-text-tertiary);
		font-style: italic;
	}

	.result-actions {
		display: flex;
		justify-content: flex-end;
	}

	@media (max-width: 768px) {
		.result-header {
			flex-direction: column;
			align-items: flex-start;
			gap: var(--spacing-3);
		}
		
		.result-status {
			align-self: flex-end;
		}
	}
</style>
