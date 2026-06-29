import js from '@eslint/js';
import { defineConfig as defineEslintConfig, includeIgnoreFile } from 'eslint/config';
import prettier from 'eslint-config-prettier';
import { importX } from 'eslint-plugin-import-x';
import globals from 'globals';
import ts from 'typescript-eslint';

export const IMPORT_ORDER_DEFAULTS = {
	groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object', 'unknown'],
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
	named: true,
	alphabetize: {
		order: 'asc',
		caseInsensitive: false,
	},
	warnOnUnassignedImports: true,
};

/**
 * @typedef SvelteOptions
 * @property {import('@sveltejs/kit').Config} [config]
 */

/**
 * @typedef Options
 * @property {SvelteOptions | boolean} [svelte]
 * @property {string[]} [additionalIgnoreFiles]
 */

/**
 * @param {Options} [options]
 * @returns {Promise<import('typescript-eslint').ConfigArray>}
 */
export async function defineConfig(options = {}) {
	const { additionalIgnoreFiles = [] } = options;

	const svelte =
		options.svelte === true || typeof options.svelte === 'object'
			? {
					plugin: (await import('eslint-plugin-svelte')).default,
					config:
						typeof options.svelte === 'object' && options.svelte.config
							? options.svelte.config
							: undefined,
				}
			: null;

	return defineEslintConfig([
		// ================
		// Ignore Patterns
		// ================
		...additionalIgnoreFiles.map((path) => includeIgnoreFile(path)),

		// =============
		// Base Extends
		// =============
		js.configs.recommended,
		// eslint-disable-next-line import-x/no-named-as-default-member
		...ts.configs.recommended,
		...(svelte ? [svelte.plugin.configs.recommended] : []),
		prettier,
		...(svelte ? [svelte.plugin.configs.prettier] : []),
		{
			languageOptions: {
				globals: {
					...globals.browser,
					...globals.node,
				},
			},
		},

		// =================
		// Svelte Specifics
		// =================
		...(svelte
			? [
					{
						files: ['**/*.svelte', '**/*.svelte.ts', '**/*.svelte.js'],
						languageOptions: {
							parserOptions: {
								projectService: true,
								extraFileExtensions: ['.svelte'],
								// eslint-disable-next-line import-x/no-named-as-default-member
								parser: ts.parser,
								svelteConfig: svelte.config,
							},
						},
					},
				]
			: []),

		// ========
		// Imports
		// ========
		importX.flatConfigs.recommended,
		importX.flatConfigs.typescript,
		{
			files: ['**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}'],
			languageOptions: {
				// eslint-disable-next-line import-x/no-named-as-default-member
				parser: ts.parser,
				ecmaVersion: 'latest',
				sourceType: 'module',
			},
		},
		{
			rules: {
				'import-x/order': ['error', IMPORT_ORDER_DEFAULTS],
			},
		},
	]);
}
