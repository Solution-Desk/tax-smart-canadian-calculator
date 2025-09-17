import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    base: env.VITE_BASE_URL || '/',
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:3001',
          changeOrigin: true,
          secure: false,
        },
      },
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/test/setup.ts',
    },
    define: {
      'process.env': {},
      'import.meta.env': {
        ...env,
        VITE_CLERK_PUBLISHABLE_KEY: JSON.stringify(env.VITE_CLERK_PUBLISHABLE_KEY || ''),
        VITE_LEMON_SQUEEZY_STORE_ID: JSON.stringify(env.VITE_LEMON_SQUEEZY_STORE_ID || ''),
        VITE_LEMON_SQUEEZY_MONTHLY_VARIANT: JSON.stringify(env.VITE_LEMON_SQUEEZY_MONTHLY_VARIANT || ''),
        VITE_LEMON_SQUEEZY_YEARLY_VARIANT: JSON.stringify(env.VITE_LEMON_SQUEEZY_YEARLY_VARIANT || '')
      }
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
      },
    },
    server: {
      port: 5173,
      open: true,
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: true,
      emptyOutDir: true,
    },
  };
});
