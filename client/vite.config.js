import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { loadEnv } from 'vite';
import envCompatible from 'vite-plugin-env-compatible';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, path.resolve(dirname, '../'));

  console.log('Loaded from .env variables:', env);

  return {
    envPrefix: 'ACCOUNTING_',
    plugins: [react(), envCompatible({ path: '../' })],
    server: {
      port: parseInt(env.VITE_PORT) || 3000,
      strictPort: true,
      host: true,
      open: true,
    },
  };
});
