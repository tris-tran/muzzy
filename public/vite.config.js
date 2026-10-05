import { sveltekit } from '@sveltejs/kit/vite';
import adapter from '@sveltejs/adapter-static';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		sveltekit({
			// Builds into ../docs, which is committed and served by GitHub Pages ("Deploy from a branch", /docs).
			// Pages are prerendered with relative paths, so the same build works at any path:
			// localhost, a project site under /<repo>/, or a custom domain.
			adapter: adapter({ pages: '../docs', assets: '../docs' })
		})
	]
});
