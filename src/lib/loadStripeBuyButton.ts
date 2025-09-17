let loadPromise: Promise<void> | null = null;

export function loadStripeBuyButton(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();
  if (loadPromise) return loadPromise;

  const existing = document.querySelector<HTMLScriptElement>('#stripe-buy-button-js');
  if (existing) {
    loadPromise = existing.dataset.loaded ? Promise.resolve() :
      new Promise<void>((resolve, reject) => {
        existing.addEventListener('load', () => resolve());
        existing.addEventListener('error', () => reject(new Error('Failed to load Stripe Buy Button script')));
      });
    return loadPromise;
  }

  loadPromise = new Promise<void>((resolve, reject) => {
    const s = document.createElement('script');
    s.id = 'stripe-buy-button-js';
    s.async = true;
    s.src = 'https://js.stripe.com/v3/buy-button.js';
    s.addEventListener('load', () => {
      s.dataset.loaded = 'true';
      resolve();
    });
    s.addEventListener('error', () => reject(new Error('Failed to load Stripe Buy Button script')));
    document.head.appendChild(s);
  });

  return loadPromise;
}
