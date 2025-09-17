import React from 'react';
import { AuthWrapper } from './components/AuthWrapper';
import TaxSmartCalculator from './components/TaxSmartCalculator';

export default function App() {
  return (
    <AuthWrapper>
      <TaxSmartCalculator />
    </AuthWrapper>
  );
}
