import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '');
  
  // Determine base URL based on environment
  let base = '/';
  
  // In production builds
  if (process.env.NODE_ENV === 'production') {
    // For GitHub Pages with custom domain or local build
    if (process.env.VITE_USE_CUSTOM_DOMAIN === 'true' || process.env.GITHUB_PAGES !== 'true') {
      base = '/';
    } 
    // For GitHub Pages without custom domain
    else {
      base = '/tax-smart-canadian-calculator/';
    }
  }
  
  return {
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        injectRegister: 'auto',
        manifest: {
          name: 'TaxSmart · Canada Sales-Tax Calculator',
          short_name: 'TaxSmart',
          description: 'GST / HST / PST & QST in one view, with per-province category rules.',
          theme_color: '#f5f7fb',
          background_color: '#f5f7fb',
          display: 'standalone',
          start_url: base,
          scope: base,
          lang: 'en-CA',
          categories: ['utilities', 'finance', 'shopping'],
          icons: [
            {
              src: '/icon.svg',
              sizes: 'any',
              type: 'image/svg+xml',
              purpose: 'any'
            }
          ],
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
          navigateFallback: base.endsWith('/') ? `${base}index.html` : `${base}/index.html`,
        },
      })
    ],
    base,
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/test/setup.ts',
    },
    define: {
      'process.env': {},
      'import.meta.env': {
        ...env,
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
      proxy: {
        '/api': {
          target: 'http://localhost:3001',
          changeOrigin: true,
          secure: false,
        },
      },
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: true,
      emptyOutDir: true,
    },
  };
});
