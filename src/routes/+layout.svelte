<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { onMount } from 'svelte';

	let { children } = $props();
	let mobileNavOpen = $state(false);
	let isDarkMode = $state(false);

	function toggleMobileNav() {
		mobileNavOpen = !mobileNavOpen;
	}

	function closeMobileNav() {
		mobileNavOpen = false;
	}

	// Close mobile nav on escape key
	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape' && mobileNavOpen) {
			closeMobileNav();
		}
	}

	// Theme toggle functionality
	function toggleTheme() {
		isDarkMode = !isDarkMode;
		document.documentElement.style.colorScheme = isDarkMode ? 'dark' : 'light';
		localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
	}

	// Initialize theme on mount
	onMount(() => {
		const savedTheme = localStorage.getItem('theme');
		const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
		
		isDarkMode = savedTheme ? savedTheme === 'dark' : systemPrefersDark;
		document.documentElement.style.colorScheme = isDarkMode ? 'dark' : 'light';
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
</svelte:head>

<svelte:window onkeydown={handleKeydown} />

<div class="flex min-h-dvh flex-col">
	<!-- Enhanced Header with Mobile Navigation -->
	<header
		class="sticky top-0 border-b border-[var(--color-border-subtle)] backdrop-blur supports-[backdrop-filter]:bg-[var(--color-bg-primary)]/90"
		style="z-index: var(--z-nav);"
	>
		<div class="container flex items-center justify-between" style="min-height: var(--spacing-11);">
			<!-- Logo/Brand -->
			<a
				href="/"
				class="text-subheading font-semibold text-[var(--color-text-primary)] transition-colors hover:text-[var(--color-accent-primary)]"
				onclick={closeMobileNav}
			>
				CSS Extractor
			</a>

			<!-- Desktop Navigation -->
			<nav class="hidden items-center gap-6 md:flex">
				<a
					href="https://github.com"
					target="_blank"
					rel="noopener noreferrer"
					class="text-sm font-medium text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
				>
					GitHub
				</a>
				<div class="h-4 w-px bg-[var(--color-border-muted)]"></div>
				<button
					type="button"
					class="-m-2 p-2 text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
					onclick={toggleTheme}
					aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
					title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
				>
					{#if isDarkMode}
						<!-- Sun icon -->
						<svg
							class="size-5"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="2"
							stroke="currentColor"
							aria-hidden="true"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
							/>
						</svg>
					{:else}
						<!-- Moon icon -->
						<svg
							class="size-5"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="2"
							stroke="currentColor"
							aria-hidden="true"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
							/>
						</svg>
					{/if}
				</button>
			</nav>

			<!-- Mobile Menu Button -->
			<button
				type="button"
				class="-m-2 p-2 text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)] md:hidden"
				onclick={toggleMobileNav}
				aria-expanded={mobileNavOpen}
				aria-controls="mobile-nav"
				aria-label="Toggle navigation menu"
			>
				{#if mobileNavOpen}
					<svg
						class="size-6"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="2"
						stroke="currentColor"
						aria-hidden="true"
					>
						<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
					</svg>
				{:else}
					<svg
						class="size-6"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="2"
						stroke="currentColor"
						aria-hidden="true"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
						/>
					</svg>
				{/if}
			</button>
		</div>
	</header>

	<!-- Mobile Navigation Overlay -->
	<div
		class="mobile-nav-overlay {mobileNavOpen ? 'open' : ''}"
		onclick={closeMobileNav}
		aria-hidden={!mobileNavOpen}
	></div>

	<!-- Mobile Navigation Panel -->
	<nav
		id="mobile-nav"
		class="mobile-nav-panel {mobileNavOpen ? 'open' : ''}"
		aria-label="Mobile navigation"
	>
		<div class="flex h-full flex-col">
			<!-- Mobile Nav Header -->
			<div
				class="flex items-center justify-between border-b border-[var(--color-border-subtle)]"
				style="padding: var(--spacing-4); min-height: var(--spacing-11);"
			>
				<span class="font-semibold text-[var(--color-text-primary)]">Menu</span>
				<button
					type="button"
					class="-m-2 p-2 text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
					onclick={closeMobileNav}
					aria-label="Close navigation menu"
				>
					<svg
						class="size-6"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="2"
						stroke="currentColor"
						aria-hidden="true"
					>
						<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>
			</div>

			<!-- Mobile Nav Links -->
			<div class="flex-1 overflow-y-auto" style="padding: var(--spacing-6) var(--spacing-4);">
				<ul class="space-y-4">
					<li>
						<a
							href="https://github.com"
							target="_blank"
							rel="noopener noreferrer"
							class="block py-3 text-lg font-medium text-[var(--color-text-primary)] transition-colors hover:text-[var(--color-accent-primary)]"
							onclick={closeMobileNav}
						>
							GitHub
						</a>
					</li>
					<li>
						<button
							type="button"
							class="flex w-full items-center gap-3 py-3 text-left text-lg font-medium text-[var(--color-text-primary)] transition-colors hover:text-[var(--color-accent-primary)]"
							onclick={toggleTheme}
							aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
						>
							{#if isDarkMode}
								<!-- Sun icon -->
								<svg
									class="size-5"
									fill="none"
									viewBox="0 0 24 24"
									stroke-width="2"
									stroke="currentColor"
									aria-hidden="true"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
									/>
								</svg>
								Light Mode
							{:else}
								<!-- Moon icon -->
								<svg
									class="size-5"
									fill="none"
									viewBox="0 0 24 24"
									stroke-width="2"
									stroke="currentColor"
									aria-hidden="true"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
									/>
								</svg>
								Dark Mode
							{/if}
						</button>
					</li>
				</ul>
			</div>
		</div>
	</nav>

	<!-- Main Content -->
	<main class="container flex-1" style="padding-block: var(--spacing-8);">
		{@render children?.()}
	</main>

	<!-- Enhanced Footer -->
	<footer
		class="border-t border-[var(--color-border-subtle)] bg-[var(--color-bg-secondary)]"
		style="padding: var(--spacing-16) 0 var(--spacing-8) 0;"
	>
		<div class="container">
			<div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
				<!-- Brand Section -->
				<div class="space-y-4">
					<h3 class="text-lg font-semibold text-[var(--color-text-primary)]">CSS Extractor</h3>
					<p class="text-sm text-[var(--color-text-tertiary)] leading-relaxed">
						Extract and analyze CSS design patterns from any website. Get implementation-ready
						design briefs with colors, typography, spacing, and layout systems.
					</p>
				</div>

				<!-- Links Section -->
				<div class="space-y-4">
					<h4 class="text-sm font-medium text-[var(--color-text-secondary)]">Resources</h4>
					<nav class="flex flex-col gap-2">
						<a
							href="https://github.com"
							target="_blank"
							rel="noopener noreferrer"
							class="text-sm text-[var(--color-text-tertiary)] transition-colors hover:text-[var(--color-accent-primary)]"
						>
							GitHub
						</a>
					</nav>
				</div>

				<!-- Legal Section -->
				<div class="space-y-4">
					<h4 class="text-sm font-medium text-[var(--color-text-secondary)]">Legal</h4>
					<div class="flex flex-col gap-2 text-xs text-[var(--color-text-tertiary)]">
						<span>© 2025 Blueprint</span>
						<span>Built with modern web standards</span>
					</div>
				</div>
			</div>

			<!-- Bottom Border -->
			<div
				class="mt-8 pt-6 border-t border-[var(--color-border-subtle)] text-center"
			>
				<p class="text-xs text-[var(--color-text-tertiary)]">
					Crafted with attention to accessibility and performance
				</p>
			</div>
		</div>
	</footer>

</div>
