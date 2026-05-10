const db = require('../config/db');

const getDashboardSummary = async (req, res) => {
  try {
    const organizationId = req.user.organization_id;
    
    // Get total products
    const [totalProductsResult] = await db.query(
      'SELECT COUNT(*) as total FROM products WHERE organization_id = ?',
      [organizationId]
    );
    
    // Get total quantity
    const [totalQuantityResult] = await db.query(
      'SELECT SUM(quantity) as total FROM products WHERE organization_id = ?',
      [organizationId]
    );
    
    // Get low stock items
    const [lowStockResult] = await db.query(
      `SELECT COUNT(*) as lowStockCount 
       FROM products 
       WHERE organization_id = ? AND quantity <= low_stock_threshold`,
      [organizationId]
    );
    
    // Get low stock products details
    const [lowStockProducts] = await db.query(
      `SELECT id, name, sku, quantity, low_stock_threshold
       FROM products 
       WHERE organization_id = ? AND quantity <= low_stock_threshold
       ORDER BY quantity ASC
       LIMIT 10`,
      [organizationId]
    );
    
    const summary = {
      totalProducts: totalProductsResult[0].total || 0,
      totalQuantity: totalQuantityResult[0].total || 0,
      lowStockCount: lowStockResult[0].lowStockCount || 0,
      lowStockProducts: lowStockProducts
    };
    
    res.json({
      success: true,
      data: {
        summary
      }
    });
  } catch (error) {
    console.error('Dashboard summary error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  getDashboardSummary
};
