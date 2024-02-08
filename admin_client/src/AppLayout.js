// AppLayout.js
import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import AdminBg from './components/Assets/AdminBg.jpg'
const AppLayout = ({ children }) => {
  return (
    <div style={{
      backgroundImage: `url(${AdminBg})`, // Set background image
      backgroundSize: '60% 80%', // Make sure the image covers the entire container
      backgroundPosition: 'center', // Center the image
      minHeight: '150vh', // Ensure the layout covers the full viewport height
      position: 'relative', // Set position to relative to position the header and footer
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
