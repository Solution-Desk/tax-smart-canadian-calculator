import React from 'react';
import { Zap } from 'lucide-react';

// Dynamically import Clerk components to avoid errors when Clerk is not configured
let ClerkComponents: any = {};

try {
  const clerk = require('@clerk/clerk-react');
  ClerkComponents = {
    SignedIn: clerk.SignedIn,
    SignedOut: clerk.SignedOut,
    SignInButton: clerk.SignInButton,
    UserButton: clerk.UserButton,
  };
} catch (error) {
  console.warn('Clerk not properly configured. Authentication features will be disabled.');
  // Create mock components for Clerk
  const MockComponent: React.FC<{ children: React.ReactNode }> = ({ children }) => <>{children}</>;
  ClerkComponents = {
    SignedIn: MockComponent,
    SignedOut: MockComponent,
    SignInButton: MockComponent,
    UserButton: () => null,
  };
}

const { SignedIn, SignedOut, SignInButton, UserButton } = ClerkComponents;

interface AuthWrapperProps {
  children: React.ReactNode;
}

export function AuthWrapper({ children }: AuthWrapperProps) {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Zap className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
              <span className="ml-2 text-xl font-semibold text-gray-900 dark:text-white">
                Canada Tax Smart Calc
              </span>
            </div>
            <div className="flex items-center gap-4">
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors">
                    Sign in
                  </button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <div className="flex items-center gap-2">
                  <UserButton afterSignOutUrl="/" />
                </div>
              </SignedIn>
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
