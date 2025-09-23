// Extend the Window interface to include gtag and adsbygoogle
declare interface Window {
  gtag: (
    command: string,
    eventName: string,
    params?: Record<string, any>
  ) => void;
  adsbygoogle: any[];
}
