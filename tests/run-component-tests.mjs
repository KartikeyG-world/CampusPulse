// Bundles and executes the real React component acceptance tests via Vite SSR
import { build } from 'vite';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function run() {
  const outDir = path.resolve(__dirname, '.cache');
  const outFile = 'verify-react-components.mjs';

  // Build the SSR bundle for the component test using Vite
  await build({
    logLevel: 'warn',
    build: {
      ssr: path.resolve(__dirname, 'verify-react-components.tsx'),
      outDir: outDir,
      emptyOutDir: false,
      rollupOptions: {
        output: {
          format: 'esm',
          entryFileNames: outFile,
        },
      },
    },
  });

  // Execute the compiled bundle in Node
  const fullPath = path.resolve(outDir, outFile);
  const child = spawn('node', [fullPath], {
    stdio: 'inherit',
    shell: false,
  });

  child.on('close', (code) => {
    process.exit(code || 0);
  });
}

run().catch((err) => {
  console.error('Error running component tests:', err);
  process.exit(1);
});
