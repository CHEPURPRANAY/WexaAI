import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import AlertMessage from '../../components/common/AlertMessage';
import { CogIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import '../../styles/pages/settings.css';

const Settings = () => {
  const [settings, setSettings] = useState({
    defaultLowStockThreshold: 5
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await api.get('/settings');
      const dbSettings = response.data.data.settings;
      
      // Map database field names to frontend field names
      setSettings({
        defaultLowStockThreshold: dbSettings.default_low_stock_threshold || 5
      });
    } catch (error) {
      console.error('Error fetching settings:', error);
      setAlert({
        type: 'error',
        title: 'Failed to Load Settings',
        message: 'Unable to load your settings. Please refresh the page and try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setAlert(null);

    try {
      const response = await api.put('/settings', {
        defaultLowStockThreshold: Number(settings.defaultLowStockThreshold)
      });
      
      if (response.data.success) {
        setAlert({
          type: 'success',
          title: 'Settings Updated Successfully',
          message: 'Your changes have been saved and applied to your inventory management.'
        });
        // Update local state with the confirmed values from backend
        const updatedSettings = response.data.data.settings;
        setSettings({
          defaultLowStockThreshold: updatedSettings.default_low_stock_threshold
        });
      } else {
        setAlert({
          type: 'error',
          title: 'Update Failed',
          message: response.data.message || 'Failed to update settings. Please try again.'
        });
      }
    } catch (error) {
      console.error('Error updating settings:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update settings';
      setAlert({
        type: 'error',
        title: 'Update Failed',
        message: errorMessage
      });
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
      <div className="settings-container">
        <div className="settings-wrapper">
          <div className="settings-loading">
            <div className="settings-loading-card">
              <div className="settings-skeleton title"></div>
              <div className="settings-skeleton text"></div>
              <div className="settings-skeleton input"></div>
              <div className="settings-skeleton button"></div>
            </div>
            <div className="settings-loading-card">
              <div className="settings-skeleton title"></div>
              <div className="settings-skeleton text"></div>
              <div className="settings-skeleton input"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="settings-container">
      <div className="settings-wrapper">
        {/* Page Header */}
        <div className="settings-header">
          <h1 className="settings-title">Settings</h1>
          <p className="settings-subtitle">
            Manage your application preferences and inventory configuration
          </p>
        </div>

        {/* Alert Messages */}
        {alert && (
          <AlertMessage
            type={alert.type}
            title={alert.title}
            message={alert.message}
            onDismiss={() => setAlert(null)}
            className="settings-alert"
          />
        )}

        <div className="settings-grid">
          {/* Inventory Settings Card */}
          <div className="settings-card">
            <div className="settings-card-header">
              <div className="settings-card-title-section">
                <div className="settings-card-icon">
                  <CogIcon />
                </div>
                <div>
                  <h2 className="settings-card-title">Inventory Settings</h2>
                  <p className="settings-card-description">
                    Configure default values for your inventory management system
                  </p>
                </div>
              </div>
            </div>
            <div className="settings-card-body">
              <form className="settings-form" onSubmit={handleSubmit}>
                <div className="settings-form-group">
                  <label htmlFor="defaultLowStockThreshold" className="settings-form-label required">
                    Default Low Stock Threshold
                  </label>
                  <p className="settings-form-description">
                    This value will be used as the default low stock threshold for new products. 
                    Products with quantity at or below this value will be marked as low stock.
                  </p>
                  <input
                    type="number"
                    id="defaultLowStockThreshold"
                    name="defaultLowStockThreshold"
                    min="0"
                    value={settings.defaultLowStockThreshold}
                    onChange={(e) => handleChange(e)}
                    className="settings-form-input"
                    placeholder="5"
                  />
                </div>

                <div className="settings-form-actions">
                  <button
                    type="submit"
                    disabled={saving}
                    className={`settings-btn settings-btn-primary ${saving ? 'loading' : ''}`}
                  >
                    {saving ? 'Saving Changes...' : 'Save Settings'}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Account Information Card */}
          <div className="settings-card">
            <div className="settings-card-header">
              <div className="settings-card-title-section">
                <div className="settings-card-icon">
                  <UserCircleIcon />
                </div>
                <div>
                  <h2 className="settings-card-title">Account Information</h2>
                  <p className="settings-card-description">
                    View your organization and account details
                  </p>
                </div>
              </div>
            </div>
            <div className="settings-card-body">
              <div className="account-info-grid">
                <div className="account-info-item">
                  <span className="account-info-label">Organization</span>
                  <div className="account-info-value">
                    <span className="account-info-badge">
                      {JSON.parse(localStorage.getItem('user') || '{}')?.organization_name || 'Loading...'}
                    </span>
                  </div>
                </div>
                <div className="account-info-item">
                  <span className="account-info-label">Email Address</span>
                  <div className="account-info-value">
                    {JSON.parse(localStorage.getItem('user') || '{}')?.email || 'Loading...'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
