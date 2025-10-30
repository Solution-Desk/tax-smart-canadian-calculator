import InstallPrompt from '../../common/InstallPrompt';

export default function AppBar({ onToggleTheme }: { onToggleTheme: () => void }) {
  return (
    <header className="ts-appbar">
      <button className="icon" aria-label="Home" onClick={() => (location.href = '/')}>⌂</button>
      <h1 className="title">TaxSmart</h1>
      <div className="spacer" />
      <InstallPrompt />
      <details className="menu">
        <summary aria-label="Open menu">☰</summary>
        <nav>
          <a href="/references">References</a>
          <button onClick={onToggleTheme}>Light/Dark</button>
          <a href="/sponsor">Sponsor</a>
          <a href="/pro">Go Premium</a>
          <a href="/privacy">Privacy</a>
        </nav>
      </details>
    </header>
  );
}
