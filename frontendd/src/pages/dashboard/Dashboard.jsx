import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import {
  CubeIcon,
  ChartBarIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardSummary();
  }, []);

  const fetchDashboardSummary = async () => {
    try {
      const response = await api.get('/dashboard/summary');
      setSummary(response.data.data.summary);
    } catch (error) {
      console.error('Error fetching dashboard summary:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="p-8">
        <div className="text-center text-gray-500">
          <p>Unable to load dashboard data</p>
        </div>
      </div>
    );
  }

  const stats = [
    {
      name: 'Total Products',
      value: summary.totalProducts,
      icon: CubeIcon,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      name: 'Total Quantity',
      value: summary.totalQuantity,
      icon: ChartBarIcon,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      name: 'Low Stock Items',
      value: summary.lowStockCount,
      icon: ExclamationTriangleIcon,
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600'
    }
  ];

  return (
    <div className="dashboard-container">
      {/* Page Header */}
      <div className="dashboard-header">
        <h1 className="dashboard-title">Dashboard</h1>
        <p className="dashboard-subtitle">Welcome to your inventory management dashboard</p>
      </div>

      {/* Summary Cards */}
      <div className="dashboard-stats">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="stat-card">
              <div className="stat-header">
                <div className={`stat-icon ${stat.color}`}>
                  <Icon />
                </div>
                <div className="stat-content">
                  <dl>
                    <dt className="stat-label">{stat.name}</dt>
                    <dd className="stat-value">
                      {stat.value.toLocaleString()}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Low Stock Alert */}
      {summary.lowStockProducts && summary.lowStockProducts.length > 0 && (
        <div className="dashboard-alerts">
          <div className="alert-card">
            <div className="alert-header">
              <h3 className="alert-title">
                <ExclamationTriangleIcon />
                Low Stock Alert
              </h3>
              <span className="alert-badge warning">
                {summary.lowStockCount} items
              </span>
            </div>
            </div>
            <div className="alert-body">
              <table className="low-stock-table">
                <thead>
                  <tr>
                    <th>Product Name</th>
                    <th>SKU</th>
                    <th>Current Quantity</th>
                    <th>Threshold</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {summary.lowStockProducts.map((product) => (
                    <tr key={product.id}>
                      <td>
                        <div className="product-name">{product.name}</div>
                        <div className="product-sku">{product.sku}</div>
                      </td>
                      <td className="stock-quantity">{product.quantity}</td>
                      <td className="stock-threshold">{product.low_stock_threshold}</td>
                      <td>
                        <span className="table-status warning">
                          Low Stock
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
       
      )}

      {/* Empty State */}
      {summary.lowStockProducts && summary.lowStockProducts.length === 0 && (
        <div className="dashboard-alerts">
          <div className="alert-card">
            <div className="alert-body">
              <div className="empty-state">
                <ExclamationTriangleIcon className="empty-state-icon" />
                <h3 className="empty-state-title">No low stock products</h3>
                <p className="empty-state-description">
                  All your products are above low stock threshold.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
