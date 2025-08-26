import type { RequestHandler } from '@sveltejs/kit';
import { JSDOM } from 'jsdom';

const MAX_BYTES = 800_000;
const REQ_TIMEOUT_MS = 15000;
const MAX_STYLESHEETS = 6;

function isValidUrl(u: string) {
	try {
		const url = new URL(u);
		return url.protocol === 'http:' || url.protocol === 'https:';
	} catch {
		return false;
	}
}

async function fetchWithLimit(url: string): Promise<string | null> {
	const controller = new AbortController();
	const timeout = setTimeout(() => controller.abort(), REQ_TIMEOUT_MS);
	try {
		const res = await fetch(url, { signal: controller.signal, redirect: 'follow' });
		if (!res.ok) return null;
		const reader = res.body?.getReader();
		if (!reader) return await res.text();
		const chunks: Uint8Array[] = [];
		let total = 0;
		while (true) {
			const { done, value } = await reader.read();
			if (done) break;
			if (value) {
				total += value.byteLength;
				if (total > MAX_BYTES) break;
				chunks.push(value);
			}
		}
		const buf = new Uint8Array(chunks.reduce((sum, c) => sum + c.length, 0));
		let offset = 0;
		for (const c of chunks) {
			buf.set(c, offset);
			offset += c.length;
		}
		return new TextDecoder('utf-8').decode(buf);
	} catch {
		return null;
	} finally {
		clearTimeout(timeout);
	}
}

function sanitizeHtml(html: string) {
	return html
		.replace(/<script[\s\S]*?<\/script>/gi, '')
		.replace(/<style[\s\S]*?<\/style>/gi, '')
		.replace(/<!--([\s\S]*?)-->/g, '')
		.slice(0, MAX_BYTES);
}

async function extract(url: string) {
	const base = new URL(url);
	const htmlRaw = await fetchWithLimit(url);
	if (!htmlRaw) return null;
	const html = sanitizeHtml(htmlRaw);
	const dom = new JSDOM(html);
	const doc = dom.window.document;

	const title = doc.querySelector('title')?.textContent?.trim() || '';
	const metaDesc = doc.querySelector('meta[name="description"]')?.getAttribute('content') || '';

	const links = Array.from(doc.querySelectorAll('link[rel="stylesheet"]'))
		.map((l) => l.getAttribute('href'))
		.filter(Boolean)
		.slice(0, MAX_STYLESHEETS) as string[];

	const cssContents: string[] = [];
	for (const href of links) {
		try {
			const abs = new URL(href!, base).toString();
			const css = await fetchWithLimit(abs);
			if (css) cssContents.push(css.slice(0, MAX_BYTES / 3));
		} catch {}
	}

	const textSample = doc.body?.textContent?.replace(/\s+/g, ' ').trim().slice(0, 5000) || '';

	return {
		url,
		title,
		metaDesc,
		html,
		css: cssContents.join('\n\n/* --- next stylesheet --- */\n\n'),
		textSample
	};
}

export const POST: RequestHandler = async ({ request }) => {
	const { urls } = await request.json().catch(() => ({ urls: [] }));
	if (!Array.isArray(urls) || urls.length === 0) {
		return new Response(JSON.stringify({ error: 'No URLs provided' }), { status: 400 });
	}
	const list = urls.filter((u: string) => typeof u === 'string' && isValidUrl(u)).slice(0, 3);
	if (list.length === 0)
		return new Response(JSON.stringify({ error: 'Invalid URLs' }), { status: 400 });

	const results = await Promise.all(list.map((u) => extract(u)));
	const sites = results.filter(Boolean);
	if (sites.length === 0) {
		return new Response(JSON.stringify({ error: 'Failed to fetch all URLs' }), { status: 502 });
	}

	return new Response(JSON.stringify({ sites }), {
		headers: { 'content-type': 'application/json', 'cache-control': 'no-cache' }
	});
};
