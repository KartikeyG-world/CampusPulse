import { build } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function bundleProductionModules() {
  await build({
    logLevel: 'warn',
    build: {
      ssr: path.resolve(__dirname, 'production-modules-entry.ts'),
      outDir: path.resolve(__dirname, '.cache'),
      emptyOutDir: false,
      rollupOptions: {
        output: {
          format: 'esm',
          entryFileNames: 'production-modules.mjs'
        }
      }
    }
  });
  console.log('Production modules bundled successfully!');
}

bundleProductionModules().catch(console.error);
