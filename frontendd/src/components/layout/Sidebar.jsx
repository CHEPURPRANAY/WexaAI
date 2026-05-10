import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  HomeIcon,
  CubeIcon,
  CogIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const Sidebar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Products', href: '/products', icon: CubeIcon },
    { name: 'Settings', href: '/settings', icon: CogIcon },
  ];

  const handleLogout = () => {
    logout();
  };

  const isActive = (href) => {
    return location.pathname === href;
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <>
      {/* Mobile sidebar backdrop */}
      <div className={`sidebar-backdrop ${sidebarOpen ? 'active' : ''}`} onClick={() => setSidebarOpen(false)} />
      
      {/* Mobile sidebar */}
      <div className={`sidebar ${sidebarOpen ? 'active' : ''} collapsed`}>
        <SidebarContent navigation={navigation} user={user} onLogout={handleLogout} isActive={isActive} />
      </div>

      {/* Desktop sidebar */}
      <div className="sidebar hidden-desktop">
        <SidebarContent navigation={navigation} user={user} onLogout={handleLogout} isActive={isActive} />
      </div>

      {/* Mobile menu button */}
      <button className={`sidebar-toggle ${sidebarOpen ? 'active' : ''}`} onClick={toggleSidebar}>
        <Bars3Icon />
      </button>
    </>
  );
};

const SidebarContent = ({ navigation, user, onLogout, isActive }) => {
  return (
    <>
      {/* Sidebar Header */}
      <div className="sidebar-header">
        <Link to="/dashboard" className="sidebar-logo">
          <div className="sidebar-logo-icon">
            <CubeIcon />
          </div>
          <span className="sidebar-logo-text">StockFlow</span>
        </Link>
      </div>
      
      {/* Sidebar Navigation */}
      <div className="sidebar-nav">
        <div className="sidebar-nav-section">
          <div className="sidebar-nav-title">Main Menu</div>
          <ul className="sidebar-nav-list">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className={`sidebar-nav-item ${isActive(item.href) ? 'active' : ''}`}
                  >
                    <Icon className="sidebar-nav-icon" />
                    <span className="sidebar-nav-text">{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      
      {/* Sidebar Footer */}
      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-user-avatar">
            {user?.email?.charAt(0).toUpperCase()}
          </div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">{user?.email}</div>
            <div className="sidebar-user-email">{user?.organization_name}</div>
          </div>
        </div>
        <button onClick={onLogout} className="sidebar-logout">
          <ArrowRightOnRectangleIcon />
          <span>Logout</span>
        </button>
      </div>
    </>
  );
};

export default Sidebar;
