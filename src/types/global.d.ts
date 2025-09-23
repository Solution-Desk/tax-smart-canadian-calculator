// Extend the Window interface to include gtag
declare interface Window {
  gtag: (
    command: string,
    eventName: string,
    params?: Record<string, any>
  ) => void;
}
