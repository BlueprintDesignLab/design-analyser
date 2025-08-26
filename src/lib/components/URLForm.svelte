<script lang="ts">
	import Button from './Button.svelte';
	import Input from './Input.svelte';
	import Card from './Card.svelte';

	let {
		urls = $bindable(['', '', '']),
		loading = false,
		onSubmit,
		class: className = ''
	}: {
		urls?: string[];
		loading?: boolean;
		onSubmit?: (data: { urls: string[] }) => void;
		class?: string;
	} = $props();

	let formErrors: Record<string, string> = $state({});

	function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		formErrors = {};

		const cleanUrls = urls
			.map((url) => {
				const trimmed = url.trim();
				if (!trimmed) return '';
				if (/^https?:\/\//i.test(trimmed)) return trimmed;
				return `https://${trimmed}`;
			})
			.filter(Boolean);

		// Validation
		if (cleanUrls.length === 0) {
			formErrors.urls = 'Please enter at least one URL';
			return;
		}


		// Validate URLs
		for (let i = 0; i < cleanUrls.length; i++) {
			try {
				new URL(cleanUrls[i]);
			} catch {
				formErrors[`url-${i}`] = 'Please enter a valid URL';
				return;
			}
		}

		onSubmit?.({ urls: cleanUrls });
	}

	const urlIcon = `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
		<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9"/>
	</svg>`;

</script>

<Card class="form-card {className}">
	<div class="form-header">
		<h2 class="form-title">Extract from Websites</h2>
		<p class="form-description">
			Enter up to three public URLs to analyze.
		</p>
	</div>

	<form onsubmit={handleSubmit} class="form-content">
		<div class="url-inputs">
			<div class="input-section">
				<h3 class="input-section-title">Website URLs</h3>
				{#if formErrors.urls}
					<p class="section-error">{formErrors.urls}</p>
				{/if}
			</div>

			{#each urls as url, i}
				<Input
					type="url"
					bind:value={urls[i]}
					placeholder={`https://example${i + 1}.com`}
					icon={urlIcon}
					required={i === 0}
					error={formErrors[`url-${i}`] || ''}
					class="url-input"
				/>
			{/each}
		</div>


		<div class="form-actions">
			<Button type="submit" variant="primary" size="lg" {loading} fullWidth class="submit-button">
				{#if loading}
					Analyzing Websites...
				{:else}
					<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M13 10V3L4 14h7v7l9-11h-7z"
						/>
					</svg>
					Generate Analysis
				{/if}
			</Button>
		</div>
	</form>
</Card>

<style>
	.form-card {
		max-width: 42rem;
		margin: 0 auto;
		margin-bottom: var(--spacing-12);
	}

	.form-header {
		margin-bottom: var(--spacing-8);
		text-align: center;
	}

	.form-title {
		font-family: var(--font-display);
		font-size: var(--font-size-2xl);
		font-weight: 600;
		color: var(--color-text-primary);
		margin-bottom: var(--spacing-3);
	}

	.form-description {
		font-size: var(--font-size-base);
		color: var(--color-text-secondary);
		line-height: var(--line-height-relaxed);
		margin: 0;
	}

	.form-content {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-6);
	}

	.url-inputs {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-4);
	}

	.input-section {
		margin-bottom: var(--spacing-2);
	}

	.input-section-title {
		font-size: var(--font-size-lg);
		font-weight: 600;
		color: var(--color-text-primary);
		margin-bottom: var(--spacing-2);
	}

	.section-error {
		font-size: var(--font-size-sm);
		color: var(--color-danger);
		margin: 0;
	}

	.form-actions {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-3);
		padding-top: var(--spacing-4);
	}

	@media (min-width: 640px) {
		.form-actions {
			flex-direction: row;
			align-items: center;
		}

		.submit-button {
			flex: 1;
		}

		.help-button {
			flex-shrink: 0;
		}
	}
</style>
