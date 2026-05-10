import React from 'react';
import SidebarFresh from './SidebarFresh';
import '../styles/components/layout-fresh.css';

const MainLayoutFresh = ({ children }) => {
  return (
    <div className="fresh-app">
      <SidebarFresh />
      <main className="fresh-main">
        {children}
      </main>
    </div>
  );
};

export default MainLayoutFresh;
