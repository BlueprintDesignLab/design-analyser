<script lang="ts">
	let {
		variant = 'info',
		title = '',
		dismissible = false,
		onDismiss,
		children,
		class: className = ''
	}: {
		variant?: 'info' | 'success' | 'warning' | 'danger';
		title?: string;
		dismissible?: boolean;
		onDismiss?: () => void;
		children?: any;
		class?: string;
	} = $props();

	const variants = {
		info: {
			bg: 'bg-[var(--color-accent-primary)]/10',
			border: 'border-[var(--color-accent-primary)]/20',
			text: 'text-[var(--color-accent-primary)]',
			icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>`
		},
		success: {
			bg: 'bg-[var(--color-success)]/10',
			border: 'border-[var(--color-success)]/20',
			text: 'text-[var(--color-success)]',
			icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>`
		},
		warning: {
			bg: 'bg-[var(--color-warning)]/10',
			border: 'border-[var(--color-warning)]/20',
			text: 'text-[var(--color-warning)]',
			icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/>`
		},
		danger: {
			bg: 'bg-[var(--color-danger)]/10',
			border: 'border-[var(--color-danger)]/20',
			text: 'text-[var(--color-danger)]',
			icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>`
		}
	};

	const currentVariant = variants[variant];
</script>

<div
	class="alert {currentVariant.bg} {currentVariant.border} rounded-lg border p-4 {className}"
	role="alert"
>
	<div class="flex items-start gap-3">
		<div class="flex-shrink-0 {currentVariant.text}">
			<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				{@html currentVariant.icon}
			</svg>
		</div>

		<div class="min-w-0 flex-1">
			{#if title}
				<h4 class="font-medium {currentVariant.text} mb-1">{title}</h4>
			{/if}

			<div class="text-sm {currentVariant.text}">
				{@render children?.()}
			</div>
		</div>

		{#if dismissible}
			<button
				type="button"
				class="-m-1 flex-shrink-0 p-1 {currentVariant.text} transition-opacity hover:opacity-75"
				onclick={onDismiss}
				aria-label="Dismiss alert"
			>
				<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M6 18L18 6M6 6l12 12"
					/>
				</svg>
			</button>
		{/if}
	</div>
</div>

<style>
	.alert {
		transition: all var(--duration-normal) var(--easing-standard);
	}
</style>
