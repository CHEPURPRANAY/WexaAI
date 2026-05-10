const db = require('../config/db');

const getSettings = async (req, res) => {
  try {
    const organizationId = req.user.organization_id;
    
    const [settings] = await db.query(
      'SELECT id, default_low_stock_threshold FROM settings WHERE organization_id = ?',
      [organizationId]
    );
    
    if (settings.length === 0) {
      // Create default settings if they don't exist
      await db.query(
        'INSERT INTO settings (organization_id, default_low_stock_threshold) VALUES (?, ?)',
        [organizationId, 5]
      );
      
      const [newSettings] = await db.query(
        'SELECT id, default_low_stock_threshold FROM settings WHERE organization_id = ?',
        [organizationId]
      );
      
      return res.json({
        success: true,
        data: {
          settings: newSettings[0]
        }
      });
    }
    
    res.json({
      success: true,
      data: {
        settings: settings[0]
      }
    });
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

const updateSettings = async (req, res) => {
  try {
    const { defaultLowStockThreshold } = req.body;
    const organizationId = req.user.organization_id;
    
    // Validate threshold
    if (typeof defaultLowStockThreshold !== 'number' || defaultLowStockThreshold < 0) {
      return res.status(400).json({
        success: false,
        message: 'Default low stock threshold must be a non-negative number'
      });
    }
    
    // First, check if settings exist
    const [existingSettings] = await db.query(
      'SELECT id FROM settings WHERE organization_id = ?',
      [organizationId]
    );
    
    if (existingSettings.length > 0) {
      // Update existing settings
      await db.query(
        'UPDATE settings SET default_low_stock_threshold = ? WHERE organization_id = ?',
        [defaultLowStockThreshold, organizationId]
      );
    } else {
      // Insert new settings
      await db.query(
        'INSERT INTO settings (organization_id, default_low_stock_threshold) VALUES (?, ?)',
        [organizationId, defaultLowStockThreshold]
      );
    }
    
    // Get updated settings
    const [updatedSettings] = await db.query(
      'SELECT id, default_low_stock_threshold FROM settings WHERE organization_id = ?',
      [organizationId]
    );
    
    res.json({
      success: true,
      message: 'Settings updated successfully',
      data: {
        settings: updatedSettings[0]
      }
    });
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  getSettings,
  updateSettings
};
