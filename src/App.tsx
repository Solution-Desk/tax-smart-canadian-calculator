import { AuthWrapper } from './components/AuthWrapper';
import TaxSmartCalculator from './components/TaxSmartCalculator';
import { ClerkProvider } from '@clerk/clerk-react';

export default function App() {
  return (
    <ClerkProvider publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}>
      <AuthWrapper>
        <TaxSmartCalculator />
      </AuthWrapper>
    </ClerkProvider>
  );
}
