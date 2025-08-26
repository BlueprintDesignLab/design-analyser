<script lang="ts">
	// Analysis service component that handles OpenAI API calls
	// This component doesn't render anything but provides analysis functionality

	export interface AnalysisConfig {
		systemPrompt: string;
		analysisPrompt: string;
		remixPrompt: string;
		model: string;
		apiKey: string;
		baseURL: string;
	}

	export interface SiteData {
		url: string;
		title: string;
		metaDesc: string;
		html: string;
		css: string;
		textSample: string;
	}

	let {
		config = $bindable({
			systemPrompt: 'You extract brand-safe, accessible, implementation-focused design briefs.',
			analysisPrompt: createDefaultAnalysisPrompt(),
			remixPrompt: createDefaultRemixPrompt(),
			model: 'gpt-4.1-mini',
			apiKey: 'dummy-key',
			baseURL: 'https://llm-proxy-735482512776.us-west1.run.app'
		}),
		onAnalysisUpdate,
		onError
	}: {
		config?: AnalysisConfig;
		onAnalysisUpdate?: (index: number, content: string, isComplete: boolean, isStarting?: boolean) => void;
		onError?: (error: string) => void;
	} = $props();

	function createDefaultAnalysisPrompt(): string {
		return `You are a senior product designer and front-end lead. Analyze the single public reference below and produce an actionable, brand-agnostic design system brief that a human or AI can use to create a NEW site inspired by the reference. Do not mention the brand. Prefer neutral naming.

Include only what is observable. When uncertain, infer reasonable defaults. Keep it implementation-ready and concise.

OUTPUT FORMAT
1) Design Tokens
   - Color: neutral/brand palettes with roles (bg, surface, text, accent, success, warning, danger); include light/dark tokens
   - Typography: font stacks, sizes, line-heights, letter-spacing, weights; mapping to roles (heading, body, ui)
   - Spacing & Sizing: scale (e.g. 2,4,8,...), container widths, radii, shadows, transitions
   - Z-index and elevation levels

2) Layout System
   - Grid: container widths, columns, gutters; mobile/tablet/desktop breakpoints with rules
   - Page structure: header/nav/footer patterns, hero, content areas, sidebars
   - Responsive rules: how components reflow, hide/show, stack

Constraints
- Keep to essentials; no brand content or imagery
- Aim for copy-pastable snippets and concise bullet points

End with a brief summary on site's feeling, purpose, and design language.`;
	}

	function createDefaultRemixPrompt(): string {
		return `Remix the following per-site design briefs into a single, unified reference suitable for creating a NEW site. Keep brand-agnostic and implementation-ready.`;
	}

	function createAnalysisPrompt(site: SiteData): string {
		const referenceSection = `

REFERENCE
- URL: ${site.url}
- Title: ${site.title}
- Meta: ${site.metaDesc}
- HTML sample: ${site.html.replace(/\s+/g, ' ').slice(0, 40000)}
- CSS sample: ${site.css.replace(/\s+/g, ' ').slice(0, 40000)}
- Text sample: ${site.textSample}`;
		
		return config.analysisPrompt + referenceSection;
	}

	export async function analyzeSites(sites: SiteData[]): Promise<void> {
		try {
			const { OpenAI } = await import('openai');
			const openai = new OpenAI({
				apiKey: config.apiKey,
				baseURL: config.baseURL,
				dangerouslyAllowBrowser: true
			});

			// Signal start of analysis for each site
			sites.forEach((_, index) => {
				onAnalysisUpdate?.(index, '', false, true); // true = starting
			});

			const analysisPromises = sites.map(async (site, index) => {
				try {
					const prompt = createAnalysisPrompt(site);
					const stream = await openai.chat.completions.create({
						model: config.model,
						messages: [
							{
								role: 'system',
								content: config.systemPrompt
							},
							{ role: 'user', content: prompt }
						],
						stream: true
					});

					for await (const chunk of stream) {
						const delta = chunk.choices?.[0]?.delta?.content || '';
						if (delta) {
							onAnalysisUpdate?.(index, delta, false);
						}
					}

					onAnalysisUpdate?.(index, '', true);
				} catch (err) {
					console.error(`Analysis failed for site ${index + 1}:`, err);
					onError?.(`Analysis failed for site ${index + 1}`);
				}
			});

			await Promise.allSettled(analysisPromises);
		} catch (err: any) {
			onError?.(err?.message || 'Failed to initialize analysis service');
		}
	}

	export async function generateRemix(summaries: string[]): Promise<void> {
		try {
			const { OpenAI } = await import('openai');
			const openai = new OpenAI({
				apiKey: config.apiKey,
				baseURL: config.baseURL,
				dangerouslyAllowBrowser: true
			});

			const inputSection = `

INPUT:
${summaries.map((s, i) => `--- Summary ${i + 1} ---\n${s}`).join('\n\n')}`;

			const fullRemixPrompt = config.remixPrompt + inputSection;

			const stream = await openai.chat.completions.create({
				model: config.model,
				messages: [
					{
						role: 'system',
						content: 'You generate brand-safe, accessible, implementation-ready design prompts and briefs.'
					},
					{ role: 'user', content: fullRemixPrompt }
				],
				stream: true
			});

			for await (const chunk of stream) {
				const delta = chunk.choices?.[0]?.delta?.content || '';
				if (delta) {
					onAnalysisUpdate?.(-1, delta, false); // Use -1 to indicate remix
				}
			}

			onAnalysisUpdate?.(-1, '', true);
		} catch (err: any) {
			onError?.(err?.message || 'Failed to generate unified brief');
		}
	}
</script>

<!-- This component doesn't render anything -->