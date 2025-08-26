<script lang="ts">
	let {
		title,

	}: {
		title: string;
	} = $props();
</script>

<section class="hero-section">
	<div class="hero-content">
		<h1 class="hero-title">
			{@html title}
		</h1>

		<p class="hero-subtitle">
			Get implementation-ready design briefs with colors, typography, spacing, and layout systems.
			 Then remix the styles for a unique blend to add to your own site.
		</p>
	</div>
</section>

<style>
	.hero-section {
		text-align: center;
		margin-bottom: var(--spacing-16);
	}

	.hero-content {
		margin-bottom: var(--spacing-12);
	}

	.hero-title {
		font-family: var(--font-display);
		font-size: clamp(2.5rem, 6vw, 5rem);
		font-weight: 700;
		letter-spacing: var(--letter-spacing-tight);
		line-height: var(--line-height-tight);
		color: var(--color-text-primary);
		margin-bottom: var(--spacing-6);
		background: linear-gradient(135deg, var(--color-text-primary) 0%, var(--color-accent-primary) 100%);
		background-clip: text;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-size: 200% 200%;
		animation: gradientShift 6s ease-in-out infinite;
	}

	@keyframes gradientShift {
		0%, 100% {
			background-position: 0% 50%;
		}
		50% {
			background-position: 100% 50%;
		}
	}

	.hero-subtitle {
		font-size: var(--font-size-xl);
		line-height: var(--line-height-relaxed);
		color: var(--color-text-secondary);
		max-width: 44rem;
		margin: 0 auto;
		opacity: 0;
		animation: fadeInUp 1s ease-out 0.5s forwards;
	}

	@keyframes fadeInUp {
		from {
			opacity: 0;
			transform: translateY(20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	/* Add responsive scaling for mobile */
	@media (max-width: 768px) {
		.hero-section {
			margin-bottom: var(--spacing-12);
		}

		.hero-content {
			margin-bottom: var(--spacing-8);
		}

		.hero-title {
			margin-bottom: var(--spacing-4);
		}

		.hero-subtitle {
			font-size: var(--font-size-lg);
			padding: 0 var(--spacing-2);
		}
	}
</style>
