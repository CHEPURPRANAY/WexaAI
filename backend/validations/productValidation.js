const { body, validationResult } = require('express-validator');

const validateProduct = [
  body('name')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Product name is required'),
  body('sku')
    .trim()
    .isLength({ min: 1 })
    .withMessage('SKU is required'),
  body('quantity')
    .isInt({ min: 0 })
    .withMessage('Quantity must be a non-negative integer'),
  body('costPrice')
    .isFloat({ min: 0 })
    .withMessage('Cost price must be a non-negative number'),
  body('sellingPrice')
    .isFloat({ min: 0 })
    .withMessage('Selling price must be a non-negative number'),
  body('lowStockThreshold')
    .isInt({ min: 0 })
    .withMessage('Low stock threshold must be a non-negative integer'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    next();
  }
];

const validateProductUpdate = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage('Product name cannot be empty'),
  body('sku')
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage('SKU cannot be empty'),
  body('quantity')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Quantity must be a non-negative integer'),
  body('costPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Cost price must be a non-negative number'),
  body('sellingPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Selling price must be a non-negative number'),
  body('lowStockThreshold')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Low stock threshold must be a non-negative integer'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    next();
  }
];

module.exports = {
  validateProduct,
  validateProductUpdate
};
