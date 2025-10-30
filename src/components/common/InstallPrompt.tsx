import { useEffect, useState } from 'react';

export default function InstallPrompt() {
  const [evt, setEvt] = useState<any>(null);
  const installed =
    (window.navigator as any).standalone ||
    window.matchMedia('(display-mode: standalone)').matches;

  useEffect(() => {
    const onBefore = (e: any) => { 
      e.preventDefault(); 
      setEvt(e); 
    };
    
    const onInstalled = () => setEvt(null);
    
    window.addEventListener('beforeinstallprompt', onBefore);
    window.addEventListener('appinstalled', onInstalled);
    
    return () => {
      window.removeEventListener('beforeinstallprompt', onBefore);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  if (installed || !evt) return null;
  
  return (
    <button 
      className="btn install" 
      onClick={async () => { 
        await evt.prompt(); 
        setEvt(null); 
      }}
    >
      Download
    </button>
  );
}
