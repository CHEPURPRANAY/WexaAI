const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authMiddleware = require('../middleware/authMiddleware');
const { validateProduct, validateProductUpdate } = require('../validations/productValidation');

// All product routes require authentication
router.use(authMiddleware);

router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);
router.post('/', validateProduct, productController.createProduct);
router.put('/:id', validateProductUpdate, productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;
