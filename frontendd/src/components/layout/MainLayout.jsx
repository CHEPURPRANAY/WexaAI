import React, { useState, useEffect } from 'react';
import SidebarFresh from './SidebarFresh';
import '../../styles/components/layout-fresh.css';

const MainLayout = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    // Listen for sidebar collapse state changes
    const handleSidebarCollapse = (event) => {
      setSidebarCollapsed(event.detail.collapsed);
    };

    window.addEventListener('sidebarCollapse', handleSidebarCollapse);
    return () => window.removeEventListener('sidebarCollapse', handleSidebarCollapse);
  }, []);

  return (
    <div className="fresh-app">
      <SidebarFresh onCollapseChange={setSidebarCollapsed} />
      <main className={`fresh-main ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="fresh-main-content">
          {children}
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
