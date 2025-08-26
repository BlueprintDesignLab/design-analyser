<script lang="ts">
	let {
		size = 'md',
		text = '',
		class: className = ''
	}: {
		size?: 'sm' | 'md' | 'lg' | 'xl';
		text?: string;
		class?: string;
	} = $props();

	const sizeClasses = {
		sm: 'w-4 h-4',
		md: 'w-6 h-6',
		lg: 'w-8 h-8',
		xl: 'w-12 h-12'
	};
</script>

<div class="loading-container {className}">
	<div class="loading-spinner">
		<svg
			class="animate-spin {sizeClasses[size]} text-[var(--color-accent-primary)]"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
		>
			<circle class="opacity-25" cx="12" cy="12" r="10" stroke-width="4" />
			<path class="opacity-75" d="M4 12a8 8 0 018-8" stroke-width="4" stroke-linecap="round" />
		</svg>
	</div>
	{#if text}
		<p class="loading-text">{text}</p>
	{/if}
</div>

<style>
	.loading-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 0.75rem;
	}

	.loading-spinner {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.loading-text {
		font-size: var(--font-size-sm);
		color: var(--color-text-secondary);
		margin: 0;
		text-align: center;
	}
</style>
