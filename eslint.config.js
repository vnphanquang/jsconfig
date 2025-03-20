import { fileURLToPath } from 'node:url';

import { defineConfig } from '@vnphanquang/eslint-config';

export default defineConfig({
	gitignorePath: fileURLToPath(new URL('./.gitignore', import.meta.url)),
});
