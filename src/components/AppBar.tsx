import { lazy } from 'react';

export default function AppBar({ onToggleTheme }: { onToggleTheme: () => void }) {
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'TaxSmart',
          text: 'Calculate Canadian taxes with ease',
          url: location.href,
        });
      } else {
        await navigator.clipboard.writeText(location.href);
        alert('Link copied to clipboard!');
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  return (
    <header className="appbar">
      <button className="icon" aria-label="Home" onClick={() => window.location.href = '/'}>
        ⌂
      </button>
      <h1 className="title">TaxSmart</h1>
      <div className="spacer" />
      <button className="icon" aria-label="Share" onClick={handleShare}>
        ⇪
      </button>
      <details className="menu">
        <summary aria-label="Open menu">☰</summary>
        <nav>
          <button onClick={() => window.location.href = '/references'}>References</button>
          <button onClick={onToggleTheme}>Light/Dark</button>
          <button onClick={() => window.location.href = '/sponsor'}>Sponsor</button>
          <button onClick={() => window.location.href = '/pro'}>Go Premium</button>
          <button onClick={() => window.location.href = '/privacy'}>Privacy</button>
        </nav>
      </details>
    </header>
  );
}
