import { useNavigate } from 'react-router-dom';

export default function ProCancel() {
  const navigate = useNavigate();

  return (
    <div className="container" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      textAlign: 'center',
      padding: '2rem'
    }}>
      <div style={{ maxWidth: '500px' }}>
        <h1>😢 Subscription Cancelled</h1>
        <p>You won't be charged. If this was a mistake, you can try again.</p>
        <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button 
            className="btn-primary" 
            onClick={() => navigate('/')}
          >
            Back to App
          </button>
          <button 
            className="btn-secondary"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
}
