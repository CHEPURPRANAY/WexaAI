const db = require('../config/db');

const getProducts = async (req, res) => {
  try {
    const { search } = req.query;
    const organizationId = req.user.organization_id;
    
    let query = `
      SELECT id, name, sku, description, quantity, cost_price, selling_price, low_stock_threshold, created_at, updated_at
      FROM products 
      WHERE organization_id = ?
    `;
    let params = [organizationId];
    
    if (search) {
      query += ` AND (name LIKE ? OR sku LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`);
    }
    
    query += ` ORDER BY created_at DESC`;
    
    const [products] = await db.query(query, params);
    
    res.json({
      success: true,
      data: {
        products
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const organizationId = req.user.organization_id;
    
    const [products] = await db.query(
      `SELECT id, name, sku, description, quantity, cost_price, selling_price, low_stock_threshold, created_at, updated_at
       FROM products 
       WHERE id = ? AND organization_id = ?`,
      [id, organizationId]
    );
    
    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    res.json({
      success: true,
      data: {
        product: products[0]
      }
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, sku, description, quantity, costPrice, sellingPrice, lowStockThreshold } = req.body;
    const organizationId = req.user.organization_id;
    
    // Check if SKU already exists for this organization
    const [existingProducts] = await db.query(
      'SELECT id FROM products WHERE sku = ? AND organization_id = ?',
      [sku, organizationId]
    );
    
    if (existingProducts.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Product with this SKU already exists'
      });
    }
    
    const [result] = await db.query(
      `INSERT INTO products (name, sku, description, quantity, cost_price, selling_price, low_stock_threshold, organization_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, sku, description || null, quantity || 0, costPrice || 0, sellingPrice || 0, lowStockThreshold || 5, organizationId]
    );
    
    // Get the created product
    const [newProduct] = await db.query(
      `SELECT id, name, sku, description, quantity, cost_price, selling_price, low_stock_threshold, created_at, updated_at
       FROM products WHERE id = ?`,
      [result.insertId]
    );
    
    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: {
        product: newProduct[0]
      }
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, sku, description, quantity, costPrice, sellingPrice, lowStockThreshold } = req.body;
    const organizationId = req.user.organization_id;
    
    // Check if product exists and belongs to organization
    const [existingProducts] = await db.query(
      'SELECT id FROM products WHERE id = ? AND organization_id = ?',
      [id, organizationId]
    );
    
    if (existingProducts.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    // Check if SKU already exists for another product in the same organization
    if (sku) {
      const [skuCheck] = await db.query(
        'SELECT id FROM products WHERE sku = ? AND organization_id = ? AND id != ?',
        [sku, organizationId, id]
      );
      
      if (skuCheck.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Product with this SKU already exists'
        });
      }
    }
    
    // Build dynamic update query
    const updateFields = [];
    const updateValues = [];
    
    if (name !== undefined) {
      updateFields.push('name = ?');
      updateValues.push(name);
    }
    if (sku !== undefined) {
      updateFields.push('sku = ?');
      updateValues.push(sku);
    }
    if (description !== undefined) {
      updateFields.push('description = ?');
      updateValues.push(description);
    }
    if (quantity !== undefined) {
      updateFields.push('quantity = ?');
      updateValues.push(quantity);
    }
    if (costPrice !== undefined) {
      updateFields.push('cost_price = ?');
      updateValues.push(costPrice);
    }
    if (sellingPrice !== undefined) {
      updateFields.push('selling_price = ?');
      updateValues.push(sellingPrice);
    }
    if (lowStockThreshold !== undefined) {
      updateFields.push('low_stock_threshold = ?');
      updateValues.push(lowStockThreshold);
    }
    
    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No fields to update'
      });
    }
    
    updateFields.push('updated_at = CURRENT_TIMESTAMP');
    updateValues.push(id, organizationId);
    
    await db.query(
      `UPDATE products SET ${updateFields.join(', ')} WHERE id = ? AND organization_id = ?`,
      updateValues
    );
    
    // Get the updated product
    const [updatedProduct] = await db.query(
      `SELECT id, name, sku, description, quantity, cost_price, selling_price, low_stock_threshold, created_at, updated_at
       FROM products WHERE id = ?`,
      [id]
    );
    
    res.json({
      success: true,
      message: 'Product updated successfully',
      data: {
        product: updatedProduct[0]
      }
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const organizationId = req.user.organization_id;
    
    // Check if product exists and belongs to organization
    const [existingProducts] = await db.query(
      'SELECT id FROM products WHERE id = ? AND organization_id = ?',
      [id, organizationId]
    );
    
    if (existingProducts.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    await db.query(
      'DELETE FROM products WHERE id = ? AND organization_id = ?',
      [id, organizationId]
    );
    
    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
