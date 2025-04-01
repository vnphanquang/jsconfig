import { includeIgnoreFile } from '@eslint/compat';
import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import importX from 'eslint-plugin-import-x';
import svelte from 'eslint-plugin-svelte';
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
 * @returns {import('typescript-eslint').ConfigArray}
 */
export function defineConfig(options = {}) {
	let { gitignorePath = [] } = options;
	if (typeof gitignorePath === 'string') {
		gitignorePath = [gitignorePath];
	}

	const useSvelte = options.svelte === true || typeof options.svelte === 'object';

	return ts.config(
		js.configs.recommended,
		...ts.configs.recommended,
		...(useSvelte ? svelte.configs['flat/recommended'] : []),
		prettier,
		...(useSvelte ? svelte.configs['flat/prettier'] : []),
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
