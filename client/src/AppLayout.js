// AppLayout.js
import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';

const AppLayout = ({ children }) => {
  return (
    <div      style={{
      
    }}>
      <Header />
      <div style={{ padding: '30px' }}>
        {/* Page content goes here */}
        {children}
      </div>
      <Footer />
    </div>
  );
};

export default AppLayout;
