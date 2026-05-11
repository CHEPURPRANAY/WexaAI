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

const SidebarFresh = ({ onCollapseChange }) => {
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
    const newCollapsedState = !sidebarCollapsed;
    setSidebarCollapsed(newCollapsedState);
    onCollapseChange?.(newCollapsedState);
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
        className={`fresh-mobile-menu ${sidebarOpen ? 'active' : ''}`} 
        onClick={toggleSidebar}
        aria-label="Toggle sidebar"
      >
        {sidebarOpen ? <XMarkIcon /> : <Bars3Icon />}
      </button>

      {/* Mobile Backdrop */}
      <div 
        className={`fresh-mobile-backdrop ${sidebarOpen ? 'active' : ''}`} 
        onClick={() => setSidebarOpen(false)}
      />

      {/* Fresh Sidebar */}
      <aside className={`fresh-sidebar ${sidebarOpen ? 'mobile active' : ''} ${sidebarCollapsed ? 'collapsed' : ''}`}>
        {/* Sidebar Header */}
        <div className="fresh-sidebar-header">
          <Link to="/dashboard" className="fresh-brand">
            <div className="fresh-brand-icon">
              <CubeIcon />
            </div>
            <span className="fresh-brand-text">StockFlow</span>
          </Link>
        </div>
        
        {/* Sidebar Navigation */}
        <nav className="fresh-nav">
          <div className="fresh-nav-section">
            <div className="fresh-nav-title">Main Menu</div>
            <ul className="fresh-nav-list">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.name} className="fresh-nav-item">
                    <Link
                      to={item.href}
                      className={`fresh-nav-link ${isActive(item.href) ? 'active' : ''}`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <Icon className="fresh-nav-icon" />
                      <span className="fresh-nav-text">{item.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>
        
        {/* Sidebar Footer */}
        <div className="fresh-sidebar-footer">
          <div className="fresh-user-card">
            <div className="fresh-user-avatar">
              {user?.email?.charAt(0).toUpperCase()}
            </div>
            <div className="fresh-user-info">
              <div className="fresh-user-name truncate">{user?.email}</div>
              <div className="fresh-user-email truncate">{user?.organization_name || 'User'}</div>
            </div>
          </div>
          
          <div className="fresh-actions">
            <button onClick={handleLogout} className="fresh-action-btn">
              <ArrowRightOnRectangleIcon />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default SidebarFresh;
