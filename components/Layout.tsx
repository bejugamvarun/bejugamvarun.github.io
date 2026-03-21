import React, { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => (
  <div
    style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      zIndex: 1,
    }}
  >
    <Header />
    <main style={{ flex: 1, paddingTop: 'var(--nav-height)' }}>{children}</main>
    <Footer />
  </div>
);

export default Layout;
