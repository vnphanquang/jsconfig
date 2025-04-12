import { includeIgnoreFile } from '@eslint/compat';
import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import importX from 'eslint-plugin-import-x';
import globals from 'globals';
import ts from 'typescript-eslint';

/**
 * @typedef SvelteOptions
 * @property {import('@sveltejs/kit').Config} [config]
 */

/**
 * @typedef Options
 * @property {string | string[]} [gitignorePath]
 * @property {SvelteOptions | boolean} [svelte]
 */

/**
 * @param {Options} [options]
 * @returns {Promise<import('typescript-eslint').ConfigArray>}
 */
export async function defineConfig(options = {}) {
	let { gitignorePath = [] } = options;
	if (typeof gitignorePath === 'string') {
		gitignorePath = [gitignorePath];
	}

	const useSvelte = options.svelte === true || typeof options.svelte === 'object';
	/** @type {import('eslint-plugin-svelte').default | undefined} */
	let svelte = undefined;
	if (useSvelte) {
		svelte = (await import('eslint-plugin-svelte')).default;
	}

	return ts.config(
		js.configs.recommended,
		...ts.configs.recommended,
		...(useSvelte && svelte ? svelte.configs['flat/recommended'] : []),
		prettier,
		...(useSvelte && svelte ? svelte.configs['flat/prettier'] : []),
		{
			languageOptions: {
				globals: {
					...globals.browser,
					...globals.node,
					...(useSvelte && {
						App: 'readonly',
					}),
				},
			},
		},
		...(useSvelte
			? [
					{
						files: ['**/*.svelte', '**/*.svelte.ts', '**/*.svelte.js'],

						languageOptions: {
							parserOptions: {
								projectService: true,
								extraFileExtensions: ['.svelte'],
								parser: ts.parser,
								...(typeof options.svelte === 'object' &&
									options.svelte.config && { svelteConfig: options.svelte.config }),
							},
						},
					},
				]
			: []),
		{
			plugins: {
				'import-x': importX,
			},
			rules: {
				'import-x/order': [
					'error',
					{
						groups: [
							'builtin',
							'external',
							'internal',
							'parent',
							'sibling',
							'index',
							'object',
							'unknown',
						],
						pathGroups: [
							{
								pattern: '$*/**',
								group: 'internal',
							},
							{
								pattern: '$*',
								group: 'internal',
							},
						],
						'newlines-between': 'always',
						pathGroupsExcludedImportTypes: [],
						alphabetize: {
							order: 'asc',
							caseInsensitive: false,
						},
						warnOnUnassignedImports: true,
					},
				],
			},
		},
		...gitignorePath.map((path) => includeIgnoreFile(path)),
	);
}
