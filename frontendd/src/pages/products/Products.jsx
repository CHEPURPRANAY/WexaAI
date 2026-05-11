import React, { useState, useEffect, useCallback } from 'react';
import api from '../../api/axios';
import AlertMessage from '../../components/common/AlertMessage';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  CubeIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import ProductForm from '../../components/forms/ProductForm';
import './products-enhanced.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [alert, setAlert] = useState(null);

  const fetchProducts = useCallback(async () => {
    try {
      const response = await api.get('/products', {
        params: searchTerm ? { search: searchTerm } : {}
      });
      setProducts(response.data.data.products);
    } catch (error) {
      console.error('Error fetching products:', error);
      setAlert({
        type: 'error',
        title: 'Failed to Load Products',
        message: 'Unable to fetch your products. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    fetchProducts();
  }, [searchTerm, fetchProducts]);

  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDeleteProduct = async (productId) => {
    try {
      const response = await api.delete(`/products/${productId}`);

      if (response.data.success) {
        setProducts((prevProducts) => prevProducts.filter((p) => p.id !== productId));
        setAlert({
          type: 'success',
          title: 'Product Deleted Successfully',
          message: 'The product has been removed from your inventory.'
        });
      } else {
        setAlert({
          type: 'error',
          title: 'Delete Failed',
          message: response.data.message || 'Failed to delete product'
        });
      }

      setDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting product:', error);
      const errorMessage = error.response?.data?.message || 'Failed to delete product';
      setAlert({
        type: 'error',
        title: 'Delete Failed',
        message: errorMessage
      });
      setDeleteConfirm(null);
    }
  };

  const handleFormSuccess = (updatedProduct = null) => {
    setShowForm(false);
    setEditingProduct(null);

    if (updatedProduct) {
      setProducts((prevProducts) =>
        prevProducts.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
      );
    } else {
      fetchProducts();
    }
  };

  const getStockStatus = (product) => {
    if (product.quantity === 0) {
      return { text: 'Out of Stock', className: 'out-of-stock' };
    }
    if (product.quantity <= product.low_stock_threshold) {
      return { text: 'Low Stock', className: 'low-stock' };
    }
    return { text: 'In Stock', className: 'in-stock' };
  };

  const stats = {
    total: products.length,
    inStock: products.filter(p => p.quantity > p.low_stock_threshold).length,
    lowStock: products.filter(p => p.quantity > 0 && p.quantity <= p.low_stock_threshold).length,
    outOfStock: products.filter(p => p.quantity === 0).length
  };

  if (loading) {
    return (
      <div className="products-enhanced-container">
        <div className="products-loading">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="products-loading-card">
              <div className="products-loading-skeleton title"></div>
              <div className="products-loading-skeleton text"></div>
              <div className="products-loading-skeleton badge"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="products-enhanced-container">
      {/* Alert Messages */}
      {alert && (
        <AlertMessage
          type={alert.type}
          title={alert.title}
          message={alert.message}
          onDismiss={() => setAlert(null)}
          className="products-alert"
        />
      )}

      {/* Page Header */}
      <div className="products-enhanced-header">
        <div className="products-header-content">
          <div className="products-title-section">
            <div className="products-title-icon">
              <CubeIcon />
            </div>
            <h1 className="products-title">Products</h1>
          </div>

          <div className="products-actions">
            <div className="products-search-container">
              <MagnifyingGlassIcon className="products-search-icon" />
              <input
                type="text"
                className="products-search-input"
                placeholder="Search by product name or SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {/* FIX: Use type="button" to prevent any accidental form submission behavior */}
            <button
              type="button"
              onClick={handleAddProduct}
              className="products-btn products-btn-primary"
            >
              <PlusIcon />
              Add Product
            </button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="products-stats-grid">
        <div className="products-stat-card">
          <div className="products-stat-icon total">
            <CubeIcon />
          </div>
          <div className="products-stat-content">
            <div className="products-stat-value">{stats.total}</div>
            <div className="products-stat-label">Total Products</div>
          </div>
        </div>

        <div className="products-stat-card">
          <div className="products-stat-icon in-stock">
            <CubeIcon />
          </div>
          <div className="products-stat-content">
            <div className="products-stat-value">{stats.inStock}</div>
            <div className="products-stat-label">In Stock</div>
          </div>
        </div>

        <div className="products-stat-card">
          <div className="products-stat-icon low-stock">
            <CubeIcon />
          </div>
          <div className="products-stat-content">
            <div className="products-stat-value">{stats.lowStock}</div>
            <div className="products-stat-label">Low Stock</div>
          </div>
        </div>

        <div className="products-stat-card">
          <div className="products-stat-icon out-of-stock">
            <CubeIcon />
          </div>
          <div className="products-stat-content">
            <div className="products-stat-value">{stats.outOfStock}</div>
            <div className="products-stat-label">Out of Stock</div>
          </div>
        </div>
      </div>

      {/* Products Table / Empty State */}
      {products.length === 0 && !loading ? (
        <div className="products-empty-state">
          <CubeIcon className="products-empty-icon" />
          <h2 className="products-empty-title">No Products Found</h2>
          <p className="products-empty-description">
            {searchTerm
              ? 'No products match your search criteria. Try adjusting your search terms.'
              : 'You haven\'t added any products yet. Click "Add Product" to get started with your inventory management.'
            }
          </p>
          <button
            type="button"
            onClick={handleAddProduct}
            className="products-btn products-btn-primary"
          >
            <PlusIcon />
            Add Your First Product
          </button>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="products-table-container">
            <table className="products-table">
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>SKU</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Threshold</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => {
                  const stockStatus = getStockStatus(product);
                  return (
                    <tr key={product.id} className="products-table-row">
                      <td className="products-name-cell">
                        <div className="products-name-content">
                          {product.name}
                          <span className={`products-stock-badge ${stockStatus.className}`}>
                            {stockStatus.text}
                          </span>
                        </div>
                      </td>
                      <td>{product.sku}</td>
                      <td>{product.quantity}</td>
                      <td>${product.selling_price}</td>
                      <td>{product.low_stock_threshold}</td>
                      <td>
                        <span className={`products-status-indicator ${stockStatus.className}`}>
                          {stockStatus.text}
                        </span>
                      </td>
                      <td>
                        <div className="products-table-actions">
                          <button
                            type="button"
                            onClick={() => handleEditProduct(product)}
                            className="products-action-btn-table edit"
                            title="Edit Product"
                          >
                            <PencilIcon />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteConfirm(product.id)}
                            className="products-action-btn-table delete"
                            title="Delete Product"
                          >
                            <TrashIcon />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="products-mobile-grid">
            {products.map((product) => {
              const stockStatus = getStockStatus(product);
              return (
                <div key={product.id} className="products-mobile-card">
                  <div className="products-mobile-header">
                    <h3 className="products-mobile-title">{product.name}</h3>
                    <span className={`products-stock-badge ${stockStatus.className}`}>
                      {stockStatus.text}
                    </span>
                  </div>

                  <div className="products-mobile-body">
                    <div className="products-mobile-info">
                      <div className="products-mobile-row">
                        <span className="products-mobile-label">SKU:</span>
                        <span className="products-mobile-value">{product.sku}</span>
                      </div>
                      <div className="products-mobile-row">
                        <span className="products-mobile-label">Quantity:</span>
                        <span className="products-mobile-value">{product.quantity}</span>
                      </div>
                      <div className="products-mobile-row">
                        <span className="products-mobile-label">Price:</span>
                        <span className="products-mobile-value">${product.selling_price}</span>
                      </div>
                      <div className="products-mobile-row">
                        <span className="products-mobile-label">Threshold:</span>
                        <span className="products-mobile-value">{product.low_stock_threshold}</span>
                      </div>
                    </div>

                    {/* FIX: Use type="button" on all mobile action buttons */}
                    <div className="products-mobile-actions">
                      <button
                        type="button"
                        onClick={() => handleEditProduct(product)}
                        className="products-mobile-btn edit"
                      >
                        <PencilIcon />
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteConfirm(product.id)}
                        className="products-mobile-btn delete"
                      >
                        <TrashIcon />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Product Form Modal */}
      {showForm && (
        <ProductForm
          product={editingProduct}
          onSuccess={handleFormSuccess}
          onCancel={() => {
            setShowForm(false);
            setEditingProduct(null);
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="modal-enhanced-overlay">
          <div className="modal-enhanced">
            <div className="modal-enhanced-header">
              <h2 className="modal-enhanced-title">Confirm Delete</h2>
              <button
                type="button"
                onClick={() => setDeleteConfirm(null)}
                className="modal-enhanced-close"
              >
                <XMarkIcon />
              </button>
            </div>
            <div className="modal-enhanced-body">
              <p style={{ marginBottom: '1.5rem' }}>
                Are you sure you want to delete this product? This action cannot be undone.
              </p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setDeleteConfirm(null)}
                  className="products-btn products-btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteProduct(deleteConfirm)}
                  className="products-btn products-btn-primary"
                >
                  Delete Product
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default Products;