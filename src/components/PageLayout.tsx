import React, { ReactNode } from 'react';
import AppBar from './AppBar';
import { Footer } from './Footer';

interface PageLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
  onToggleTheme: () => void;
}

export const PageLayout: React.FC<PageLayoutProps> = ({ 
  children, 
  title, 
  description,
  onToggleTheme 
}) => {
  return (
    <div className="app">
      <AppBar onToggleTheme={onToggleTheme} />
      <main className="wrap">
        <div className="container">
          <h1>{title}</h1>
          {description && <p className="page-description">{description}</p>}
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PageLayout;
