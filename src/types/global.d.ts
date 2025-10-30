// Extend the Window interface to include gtag and adsbygoogle
declare interface Window {
  gtag: (
    command: string,
    eventName: string,
    params?: Record<string, any>
  ) => void;
  adsbygoogle: any[];
}

declare module 'virtual:pwa-register' {
  type RegisterSWOptions = {
    immediate?: boolean;
    onNeedRefresh?: () => void;
    onOfflineReady?: () => void;
  };

  export function registerSW(options?: RegisterSWOptions): () => void;
}
