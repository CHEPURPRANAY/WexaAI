import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { CogIcon } from '@heroicons/react/24/outline';

const Settings = () => {
  const [settings, setSettings] = useState({
    defaultLowStockThreshold: 5
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await api.get('/settings');
      setSettings(response.data.data.settings);
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await api.put('/settings', {
        defaultLowStockThreshold: settings.defaultLowStockThreshold
      });
      toast.success('Settings updated successfully');
    } catch (error) {
      console.error('Error updating settings:', error);
      toast.error('Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: parseInt(value) || 0
    }));
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-10 bg-gray-200 rounded w-1/3"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="mt-2 text-gray-600">Manage your application settings</p>
      </div>

      <div className="max-w-2xl">
        {/* Settings Card */}
        <div className="card">
          <div className="card-header">
            <div className="flex items-center">
              <CogIcon className="text-gray-400 mr-3" />
              <div>
                <h3 className="card-title">Inventory Settings</h3>
                <p className="card-description">
                  Configure default values for your inventory management
                </p>
              </div>
            </div>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="defaultLowStockThreshold" className="form-label">
                  Default Low Stock Threshold
                </label>
                <p className="form-description">
                  This value will be used as default low stock threshold for new products.
                  Products with quantity at or below this value will be marked as low stock.
                </p>
                <input
                  type="number"
                  id="defaultLowStockThreshold"
                  min="0"
                  value={settings.defaultLowStockThreshold}
                  onChange={(e) => handleChange(e)}
                  className="form-input"
                  placeholder="5"
                />
              </div>

              <div className="mt-6">
                <button
                  type="submit"
                  disabled={saving}
                  className={`btn btn-primary ${saving ? 'loading' : ''}`}
                >
                  {saving ? 'Saving...' : 'Save Settings'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Account Information Card */}
        <div className="card mt-8">
          <div className="card-header">
            <h3 className="card-title">Account Information</h3>
          </div>
          <div className="card-body">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Organization</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  <span className="alert-badge info">
                    {JSON.parse(localStorage.getItem('user') || '{}')?.organization_name || 'Loading...'}
                  </span>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {JSON.parse(localStorage.getItem('user') || '{}')?.email || 'Loading...'}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
