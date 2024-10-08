import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import importX from 'eslint-plugin-import-x';
import globals from 'globals';
import ts from 'typescript-eslint';

/** @type {import('eslint').Linter.Config[]} */
export default [
	js.configs.recommended,
	...ts.configs.recommended,
	prettier,
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node,
				App: 'readonly',
			},
		},
	},
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
];
