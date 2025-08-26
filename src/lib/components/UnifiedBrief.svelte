<script lang="ts">
	import Card from './Card.svelte';
	import Button from './Button.svelte';
	import LoadingSpinner from './LoadingSpinner.svelte';

	let {
		remixText = $bindable(''),
		remixing = false,
		canRemix = false,
		onGenerate,
		class: className = ''
	}: {
		remixText?: string;
		remixing?: boolean;
		canRemix?: boolean;
		onGenerate?: () => void;
		class?: string;
	} = $props();

	function copyToClipboard() {
		if (navigator.clipboard) {
			navigator.clipboard.writeText(remixText);
		}
	}

	function exportBrief() {
		const blob = new Blob([remixText], { type: 'text/markdown' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `design-brief-${new Date().toISOString().split('T')[0]}.md`;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	}
</script>

{#if canRemix}
	<section class="brief-section {className}">
		<Card class="brief-card">
			<div class="brief-header">
				<div class="brief-info">
					<h2 class="brief-title">Unified Design Brief</h2>
					<p class="brief-description">
						Combine all analyses into a single, brand-agnostic design system ready for
						implementation.
					</p>
				</div>

				<div class="brief-actions">
					<Button
						variant={remixing ? 'outline' : 'secondary'}
						size="lg"
						loading={remixing}
						onclick={onGenerate}
						disabled={!canRemix}
					>
						{#if remixing}
							Generating Brief...
						{:else}
							<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
								/>
							</svg>
							Generate Brief
						{/if}
					</Button>
				</div>
			</div>

			<div class="brief-content">
				{#if remixing && !remixText.trim()}
					<div class="brief-loading">
						<LoadingSpinner size="lg" text="Creating unified design system from all analyses..." />
					</div>
				{:else}
					<div class="brief-output">
						<textarea
							readonly
							class="brief-textarea"
							placeholder={remixing
								? 'Generating comprehensive design brief...'
								: "Click 'Generate Brief' to create a unified design system from all analyses"}
							value={remixText}
						></textarea>

						{#if remixText.trim().length > 0}
							<div class="brief-bottom-actions">
								<div class="brief-stats">
									<span class="word-count">
										{remixText.trim().split(/\s+/).length} words
									</span>
									<span class="char-count">
										{remixText.length} characters
									</span>
								</div>

								<div class="action-buttons">
									<Button variant="outline" size="md" onclick={copyToClipboard}>
										<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
											/>
										</svg>
										Copy Brief
									</Button>

									<Button variant="secondary" size="md" onclick={exportBrief}>
										<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
											/>
										</svg>
										Export MD
									</Button>
								</div>
							</div>
						{/if}
					</div>
				{/if}
			</div>
		</Card>
	</section>
{/if}

<style>
	.brief-section {
		max-width: 56rem;
		margin: 0 auto;
	}

	.brief-card {
		overflow: hidden;
	}

	.brief-header {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-6);
		padding: var(--spacing-6);
		border-bottom: 1px solid var(--color-border-subtle);
		background: linear-gradient(135deg, var(--color-bg-surface) 0%, var(--color-bg-muted) 100%);
	}

	.brief-info {
		text-align: center;
	}

	.brief-title {
		font-family: var(--font-display);
		font-size: var(--font-size-2xl);
		font-weight: 600;
		color: var(--color-text-primary);
		margin-bottom: var(--spacing-3);
	}

	.brief-description {
		font-size: var(--font-size-base);
		color: var(--color-text-secondary);
		line-height: var(--line-height-relaxed);
		margin: 0;
		max-width: 28rem;
		margin-left: auto;
		margin-right: auto;
	}

	.brief-actions {
		display: flex;
		justify-content: center;
	}

	.brief-content {
		padding: var(--spacing-6);
	}

	.brief-loading {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 16rem;
		text-align: center;
	}

	.brief-output {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-4);
	}

	.brief-textarea {
		width: 100%;
		min-height: 24rem;
		padding: var(--spacing-6);
		border: 1px solid var(--color-border-subtle);
		border-radius: var(--radius-lg);
		background-color: var(--color-bg-surface);
		color: var(--color-text-primary);
		font-family: 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace;
		font-size: var(--font-size-sm);
		line-height: var(--line-height-relaxed);
		resize: vertical;
		transition: all var(--duration-normal) var(--easing-standard);
		box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.05);
	}

	.brief-textarea:focus {
		outline: none;
		border-color: var(--color-border-focus);
		box-shadow:
			inset 0 1px 2px rgba(0, 0, 0, 0.05),
			0 0 0 3px color-mix(in oklab, var(--color-accent-primary) 15%, transparent);
	}

	.brief-textarea::placeholder {
		color: var(--color-text-tertiary);
		font-style: italic;
	}

	.brief-bottom-actions {
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-wrap: wrap;
		gap: var(--spacing-4);
		padding-top: var(--spacing-2);
		border-top: 1px solid var(--color-border-subtle);
	}

	.brief-stats {
		display: flex;
		gap: var(--spacing-4);
		font-size: var(--font-size-sm);
		color: var(--color-text-tertiary);
	}

	.action-buttons {
		display: flex;
		gap: var(--spacing-3);
	}

	@media (max-width: 768px) {
		.brief-header {
			padding: var(--spacing-4);
		}

		.brief-content {
			padding: var(--spacing-4);
		}

		.brief-textarea {
			padding: var(--spacing-4);
			min-height: 20rem;
		}

		.brief-bottom-actions {
			flex-direction: column;
			align-items: stretch;
		}

		.action-buttons {
			justify-content: stretch;
		}

		.action-buttons :global(.btn) {
			flex: 1;
		}
	}

	@media (min-width: 640px) {
		.brief-header {
			flex-direction: row;
			align-items: center;
			justify-content: space-between;
		}

		.brief-info {
			text-align: left;
		}

		.brief-description {
			margin-left: 0;
		}
	}
</style>
