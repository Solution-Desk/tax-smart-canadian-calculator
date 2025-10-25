import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '');
  
  // For GitHub Pages, use the repository name as the base path
  const isProduction = process.env.NODE_ENV === 'production';
  let base = '/';
  
  // In production, use the repository name as base path for GitHub Pages
  if (isProduction) {
    // For GitHub Pages deployment
    if (process.env.GITHUB_PAGES === 'true') {
      // Use root path for custom domain, repo path for GitHub Pages
      base = process.env.VITE_USE_CUSTOM_DOMAIN === 'true' ? '/' : '/tax-smart-canadian-calculator/';
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
