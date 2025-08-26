<script lang="ts">
	let {
		variant = 'default',
		padding = 'md',
		hover = false,
		children,
		class: className = '',
		...restProps
	}: {
		variant?: 'default' | 'outlined' | 'elevated' | 'danger';
		padding?: 'none' | 'sm' | 'md' | 'lg';
		hover?: boolean;
		children?: any;
		class?: string;
	} & Record<string, any> = $props();

	const paddingClasses = {
		none: '',
		sm: 'p-3',
		md: 'p-4',
		lg: 'p-6'
	};

	const variantClasses = {
		default: 'card',
		outlined: 'card border-2',
		elevated: 'card shadow-lg',
		danger: 'card border-[var(--color-danger)] bg-[var(--color-danger)]/5'
	};
</script>

<div
	class="{variantClasses[variant]} {paddingClasses[padding]} {hover
		? 'card-hover'
		: ''} {className}"
	{...restProps}
>
	{@render children?.()}
</div>

<style>
	.card-hover:hover {
		transform: translateY(-2px);
		box-shadow: var(--shadow-lg);
	}
</style>
