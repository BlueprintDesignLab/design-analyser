<script lang="ts">
	let {
		type = 'text',
		placeholder = '',
		value = $bindable(''),
		label = '',
		helperText = '',
		error = '',
		required = false,
		disabled = false,
		icon = '',
		class: className = '',
		id = '',
		...restProps
	}: {
		type?: string;
		placeholder?: string;
		value?: string;
		label?: string;
		helperText?: string;
		error?: string;
		required?: boolean;
		disabled?: boolean;
		icon?: string;
		class?: string;
		id?: string;
	} & Record<string, any> = $props();

	const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
</script>

<div class="input-group {className}">
	{#if label}
		<label for={inputId} class="input-label">
			{label}
			{#if required}
				<span class="text-[var(--color-danger)]">*</span>
			{/if}
		</label>
	{/if}

	<div class="input-wrapper">
		{#if icon}
			<div class="input-icon">
				{@html icon}
			</div>
		{/if}

		<input
			{type}
			{placeholder}
			bind:value
			{required}
			{disabled}
			id={inputId}
			class="input {icon ? 'pl-10' : ''} {error ? 'input-error' : ''}"
			{...restProps}
		/>
	</div>

	{#if error}
		<p class="input-error-text">{error}</p>
	{:else if helperText}
		<p class="input-helper-text">{helperText}</p>
	{/if}
</div>

<style>
	.input-group {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.input-label {
		font-size: var(--font-size-sm);
		font-weight: 500;
		color: var(--color-text-primary);
	}

	.input-wrapper {
		position: relative;
	}

	.input-icon {
		position: absolute;
		left: 0.75rem;
		top: 50%;
		transform: translateY(-50%);
		color: var(--color-text-tertiary);
		pointer-events: none;
		z-index: 1;
	}

	.input-error {
		border-color: var(--color-danger) !important;
		box-shadow: 0 0 0 3px color-mix(in oklab, var(--color-danger) 15%, transparent) !important;
	}

	.input-error-text {
		font-size: var(--font-size-sm);
		color: var(--color-danger);
		margin: 0;
	}

	.input-helper-text {
		font-size: var(--font-size-sm);
		color: var(--color-text-tertiary);
		margin: 0;
	}
</style>
