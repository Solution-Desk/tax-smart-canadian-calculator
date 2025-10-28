import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { setPro } from '../lib/flags';

export default function ProSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    // Set Pro flag in localStorage
    setPro(true);
    
    // Redirect to home after a short delay
    const timer = setTimeout(() => {
      navigate('/');
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [navigate]);

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
        <h1>🎉 Welcome to Pro!</h1>
        <p>Your subscription is now active. Redirecting you to the app...</p>
        <div style={{ marginTop: '2rem' }}>
          <p>Not redirected? <a href="/">Click here</a></p>
        </div>
      </div>
    </div>
  );
}
