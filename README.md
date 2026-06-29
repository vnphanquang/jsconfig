# `@vnphanquang/eslint-config`

Common Eslint config for my personal projects.

```bash
pnpm add -D @vnphanquang/eslint-config
```

```js
import { fileURLToPath } from 'node:url';
import { defineConfig } from '@vnphanquang/eslint-config';

const gitignorePath = fileURLToPath(new URL('.gitignore', import.meta.url));
const prettierignorePath = fileURLToPath(new URL('.prettierignore', import.meta.url));

export default await defineConfig({
	additionalIgnoreFiles: [gitignorePath, prettierignorePath],
});
```

For projects using Svelte, install:

```bash
pnpm add -D eslint-plugin-svelte

```

...and pass the path to `svelte.config.js`:

```js
import { fileURLToPath } from 'node:url';
import { defineConfig } from '@vnphanquang/eslint-config';

const gitignorePath = fileURLToPath(new URL('.gitignore', import.meta.url));
const prettierignorePath = fileURLToPath(new URL('.prettierignore', import.meta.url));
const svelteConfigPath = fileURLToPath(new URL('./svelte.config.js', import.meta.url));

export default await defineConfig({
	additionalIgnoreFiles: [gitignorePath, prettierignorePath],
	svelte: { config: svelteConfigPath },
});
```
