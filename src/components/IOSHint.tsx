import { useEffect, useState } from 'react';

export default function IOSHint() {
  const [show, setShow] = useState(false);
  
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
    const standalone = (window.navigator as any).standalone || 
                      window.matchMedia('(display-mode: standalone)').matches;
    
    setShow(isIOS && !standalone);
  }, []);

  if (!show) return null;
  
  return (
    <div className="ios-hint">
      Install: Share → Add to Home Screen
    </div>
  );
}
