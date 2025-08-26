import OpenAI from 'openai';

import { SECRET_OPENAI } from '$env/static/private';

export function getOpenAI() {
	const apiKey = SECRET_OPENAI;
	if (!apiKey) throw new Error('Missing OPENAI_API_KEY');

	return new OpenAI({ apiKey, dangerouslyAllowBrowser: true });
}

export const MODEL = 'gpt-4.1';
