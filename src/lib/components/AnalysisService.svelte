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
		config = $bindable(),
		onAnalysisUpdate,
		onError
	}: {
		config?: AnalysisConfig;
		onAnalysisUpdate?: (index: number, content: string, isComplete: boolean, isStarting?: boolean) => void;
		onError?: (error: string) => void;
	} = $props();

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