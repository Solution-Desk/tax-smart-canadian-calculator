import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { registerSW } from 'virtual:pwa-register';
import App from './App';
import './index.css';

registerSW({
  immediate: true,
  onNeedRefresh() {
    const shouldReload = window.confirm('A new version of TaxSmart is available. Reload now?');
    if (shouldReload) {
      window.location.reload();
    }
  },
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL ?? '/'}>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
