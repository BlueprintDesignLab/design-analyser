<script lang="ts">
	type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
	type ButtonSize = 'sm' | 'md' | 'lg';

	let {
		variant = 'primary',
		size = 'md',
		loading = false,
		disabled = false,
		fullWidth = false,
		type = 'button',
		onclick,
		children,
		class: className = '',
		...restProps
	}: {
		variant?: ButtonVariant;
		size?: ButtonSize;
		loading?: boolean;
		disabled?: boolean;
		fullWidth?: boolean;
		type?: 'button' | 'submit' | 'reset';
		onclick?: () => void;
		children?: any;
		class?: string;
	} & Record<string, any> = $props();

	const sizeClasses = {
		sm: 'px-3 py-1.5 text-xs min-h-8',
		md: 'px-4 py-2 text-sm min-h-10',
		lg: 'px-6 py-3 text-base min-h-12'
	};

	const variantClasses = {
		primary: 'btn-primary',
		secondary: 'btn-secondary',
		outline: 'btn-outline',
		ghost: 'btn-ghost'
	};
</script>

<button
	{type}
	class="btn {variantClasses[variant]} {sizeClasses[size]} {fullWidth ? 'w-full' : ''} {className}"
	disabled={disabled || loading}
	{onclick}
	{...restProps}
>
	{#if loading}
		<div class="loading-spinner">
			<svg class="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor">
				<circle class="opacity-25" cx="12" cy="12" r="10" stroke-width="4" />
				<path class="opacity-75" d="M4 12a8 8 0 018-8" stroke-width="4" stroke-linecap="round" />
			</svg>
		</div>
	{/if}

	{@render children?.()}
</button>

<style>
	.btn-ghost {
		background-color: transparent;
		border: 1px solid transparent;
		color: var(--color-text-primary);
	}
	.btn-ghost:hover:not(:disabled) {
		background-color: var(--color-bg-muted);
	}

	.loading-spinner {
		display: inline-flex;
		align-items: center;
		justify-content: center;
	}
</style>
