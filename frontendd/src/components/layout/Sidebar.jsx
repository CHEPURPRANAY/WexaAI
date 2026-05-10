import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  HomeIcon,
  CubeIcon,
  CogIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

const Sidebar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Products', href: '/products', icon: CubeIcon },
    { name: 'Settings', href: '/settings', icon: CogIcon },
  ];

  const handleLogout = () => {
    logout();
    setSidebarOpen(false);
  };

  const isActive = (href) => {
    return location.pathname === href;
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleCollapse = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // Close sidebar on route change (mobile)
  useEffect(() => {
    if (window.innerWidth <= 1024) {
      setSidebarOpen(false);
    }
  }, [location.pathname]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      {/* Mobile Menu Button */}
      <button 
        className={`mobile-menu-btn-enhanced ${sidebarOpen ? 'active' : ''}`} 
        onClick={toggleSidebar}
        aria-label="Toggle sidebar"
      >
        {sidebarOpen ? <XMarkIcon /> : <Bars3Icon />}
      </button>

      {/* Mobile Backdrop */}
      <div 
        className={`mobile-backdrop-enhanced ${sidebarOpen ? 'active' : ''}`} 
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside className={`sidebar-enhanced ${sidebarOpen ? 'mobile active' : ''} ${sidebarCollapsed ? 'collapsed' : ''}`}>
        {/* Sidebar Header */}
        <div className="sidebar-enhanced-header">
          <Link to="/dashboard" className="sidebar-enhanced-logo">
            <div className="sidebar-enhanced-logo-icon">
              <CubeIcon />
            </div>
            <span className="sidebar-enhanced-logo-text">StockFlow</span>
          </Link>
          
          {/* Desktop Collapse Button */}
          <button
            className="sidebar-collapse-btn"
            onClick={toggleCollapse}
            aria-label="Toggle sidebar collapse"
          >
            {sidebarCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </button>
        </div>
        
        {/* Sidebar Navigation */}
        <nav className="sidebar-enhanced-nav">
          <div className="sidebar-nav-section">
            <div className="sidebar-nav-title">Main Menu</div>
            <ul className="sidebar-nav-list">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.name} className="sidebar-nav-item">
                    <Link
                      to={item.href}
                      className={`sidebar-nav-link ${isActive(item.href) ? 'active' : ''}`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <Icon className="sidebar-nav-icon" />
                      <span className="sidebar-nav-text">{item.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>
        
        {/* Sidebar Footer */}
        <div className="sidebar-enhanced-footer">
          <div className="sidebar-user">
            <div className="sidebar-user-avatar">
              {user?.email?.charAt(0).toUpperCase()}
            </div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">{user?.email?.split('@')[0]}</div>
              <div className="sidebar-user-email">{user?.organization_name}</div>
            </div>
          </div>
          <button onClick={handleLogout} className="sidebar-logout-btn">
            <ArrowRightOnRectangleIcon className="sidebar-logout-icon" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};


export default Sidebar;
