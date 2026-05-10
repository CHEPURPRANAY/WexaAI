import React from 'react';
import Sidebar from './Sidebar';
import '../../styles/components/layout-enhanced.css';

const MainLayout = ({ children }) => {
  return (
    <div className="app-enhanced">
      <Sidebar />
      <main className="main-content-enhanced">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
