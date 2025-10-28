import { useEffect, useState } from 'react';

export default function InstallPrompt() {
  const [evt, setEvt] = useState<any>(null);
  const [installed, setInstalled] = useState(
    typeof window !== 'undefined' && window.matchMedia('(display-mode: standalone)').matches
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const onBefore = (e: any) => { 
      e.preventDefault(); 
      setEvt(e); 
    };
    
    const onInstalled = () => setInstalled(true);
    
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
      className="btn-primary" 
      onClick={async () => { 
        await evt.prompt(); 
        setEvt(null); 
      }}
    >
      Download app
    </button>
  );
}
