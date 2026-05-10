import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import AlertMessage from '../../components/common/AlertMessage';
import {
  CubeIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import '../../styles/pages/dashboard-enhanced.css';

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    fetchDashboardSummary();
  }, []);

  const fetchDashboardSummary = async () => {
    try {
      const response = await api.get('/dashboard/summary');
      setSummary(response.data.data.summary);
    } catch (error) {
      console.error('Error fetching dashboard summary:', error);
      setAlert({
        type: 'error',
        title: 'Dashboard Data Unavailable',
        message: 'Unable to load your dashboard data. Please refresh the page and try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-enhanced-container">
        <div className="dashboard-wrapper">
          <div className="dashboard-enhanced-loading">
            {[1, 2, 3].map((i) => (
              <div key={i} className="loading-enhanced-card">
                <div className="loading-enhanced-skeleton icon"></div>
                <div className="loading-enhanced-skeleton title"></div>
                <div className="loading-enhanced-skeleton value"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="dashboard-enhanced-container">
        <div className="dashboard-wrapper">
          <div className="dashboard-enhanced-header">
            <h1 className="dashboard-enhanced-title">Dashboard</h1>
            <p className="dashboard-enhanced-subtitle">Welcome to your inventory management dashboard</p>
          </div>
          {alert && (
            <AlertMessage
              type={alert.type}
              title={alert.title}
              message={alert.message}
              onDismiss={() => setAlert(null)}
              className="dashboard-alert"
            />
          )}
          <div className="empty-enhanced-state">
            <ExclamationTriangleIcon />
            <h3 className="empty-enhanced-title">Unable to Load Dashboard</h3>
            <p className="empty-enhanced-description">
              We couldn't load your dashboard data. Please check your connection and try refreshing the page.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const stats = [
    {
      name: 'Total Products',
      value: summary.totalProducts,
      icon: CubeIcon,
      iconType: 'primary',
      trend: summary.totalProducts > 0 ? 'positive' : 'neutral',
      trendValue: summary.totalProducts > 0 ? '+12%' : '0%'
    },
    {
      name: 'Total Quantity',
      value: summary.totalQuantity,
      icon: ChartBarIcon,
      iconType: 'success',
      trend: summary.totalQuantity > 100 ? 'positive' : 'neutral',
      trendValue: summary.totalQuantity > 100 ? '+8%' : '0%'
    },
    {
      name: 'Low Stock Items',
      value: summary.lowStockCount,
      icon: ExclamationTriangleIcon,
      iconType: 'warning',
      trend: summary.lowStockCount > 0 ? 'negative' : 'positive',
      trendValue: summary.lowStockCount > 0 ? '-5%' : 'Good'
    }
  ];

  return (
    <div className="dashboard-enhanced-container">
      <div className="dashboard-wrapper">
        {/* Page Header */}
        <div className="dashboard-enhanced-header">
          <h1 className="dashboard-enhanced-title">Dashboard</h1>
          <p className="dashboard-enhanced-subtitle">
            Welcome to your inventory management dashboard
          </p>
        </div>

        {/* Alert Messages */}
        {alert && (
          <AlertMessage
            type={alert.type}
            title={alert.title}
            message={alert.message}
            onDismiss={() => setAlert(null)}
            className="dashboard-alert"
          />
        )}

        {/* Enhanced Summary Cards */}
        <div className="dashboard-enhanced-stats">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.name} className="stat-enhanced-card">
                <div className="stat-enhanced-header">
                  <div className="stat-enhanced-icon-wrapper">
                    <div className={`stat-enhanced-icon ${stat.iconType}`}>
                      <Icon />
                    </div>
                  </div>
                  <div className="stat-enhanced-content">
                    <span className="stat-enhanced-label">{stat.name}</span>
                    <span className="stat-enhanced-value">
                      {stat.value.toLocaleString()}
                    </span>
                    <span className={`stat-enhanced-trend ${stat.trend}`}>
                      {stat.trendValue}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Enhanced Low Stock Alert */}
        {summary.lowStockProducts && summary.lowStockProducts.length > 0 && (
          <div className="dashboard-enhanced-alerts">
            <div className="alert-enhanced-card">
              <div className="alert-enhanced-header">
                <h3 className="alert-enhanced-title">
                  <ExclamationTriangleIcon />
                  Low Stock Alert
                </h3>
                <span className="alert-enhanced-badge">
                  {summary.lowStockCount} items need attention
                </span>
              </div>
              <div className="alert-enhanced-body">
                <div className="table-responsive">
                  <table className="low-stock-enhanced-table">
                    <thead>
                      <tr>
                        <th>Product Details</th>
                        <th>Current Qty</th>
                        <th>Threshold</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {summary.lowStockProducts.map((product) => (
                        <tr key={product.id}>
                          <td>
                            <div className="product-enhanced-name">{product.name}</div>
                            <div className="product-enhanced-sku">SKU: {product.sku}</div>
                          </td>
                          <td className="stock-enhanced-quantity">{product.quantity}</td>
                          <td className="stock-enhanced-threshold">{product.low_stock_threshold}</td>
                          <td>
                            <span className="status-enhanced-badge warning">
                              {product.quantity === 0 ? 'Out of Stock' : 'Low Stock'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Empty State */}
        {summary.lowStockProducts && summary.lowStockProducts.length === 0 && (
          <div className="dashboard-enhanced-alerts">
            <div className="alert-enhanced-card">
              <div className="alert-enhanced-body">
                <div className="empty-enhanced-state">
                  <CheckCircleIcon />
                  <h3 className="empty-enhanced-title">All Stock Levels Healthy</h3>
                  <p className="empty-enhanced-description">
                    Great job! All your products are above their low stock thresholds. 
                    Your inventory is in excellent condition.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
