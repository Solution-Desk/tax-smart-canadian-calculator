import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

export function Success() {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState('Processing your subscription...');
  const navigate = useNavigate();

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    
    if (!sessionId) {
      setMessage('No session ID found. Please check your email for confirmation.');
      return;
    }

    // Here you would typically verify the session with your backend
    // and update the user's subscription status
    const verifySession = async () => {
      try {
        // Simulate API call to verify the session
        await new Promise(resolve => setTimeout(resolve, 2000));
        setMessage('Subscription successful! Thank you for upgrading to Pro.');
        
        // Redirect to dashboard after a delay
        setTimeout(() => {
          navigate('/');
        }, 3000);
      } catch (error) {
        console.error('Error verifying session:', error);
        setMessage('There was an error processing your subscription. Please contact support.');
      }
    };

    verifySession();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full">
            <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Thank you!
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          {message}
        </p>
        <button
          onClick={() => navigate('/')}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  );
}
