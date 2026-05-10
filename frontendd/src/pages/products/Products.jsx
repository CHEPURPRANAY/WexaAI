import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  CubeIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import ProductForm from '../../components/forms/ProductForm';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, [searchTerm]);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products', {
        params: searchTerm ? { search: searchTerm } : {}
      });
      setProducts(response.data.data.products);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

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
      await api.delete(`/products/${productId}`);
      toast.success('Product deleted successfully');
      fetchProducts();
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingProduct(null);
    fetchProducts();
  };

  const getStockStatus = (product) => {
    if (product.quantity <= product.low_stock_threshold) {
      return {
        text: 'Low Stock',
        className: 'bg-yellow-100 text-yellow-800'
      };
    }
    return {
      text: 'In Stock',
      className: 'bg-green-100 text-green-800'
    };
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-4 bg-gray-200 rounded"></div>
              ))}
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
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Products</h1>
            <p className="mt-2 text-gray-600">Manage your inventory products</p>
          </div>
          <button
            onClick={handleAddProduct}
            className="btn btn-primary"
          >
            <PlusIcon />
            Add Product
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            className="form-input pl-10"
            placeholder="Search by product name or SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Products Table */}
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Product Name</th>
              <th>SKU</th>
              <th>Quantity</th>
              <th>Selling Price</th>
              <th>Stock Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan="6">
                  <div className="table-empty">
                    <CubeIcon className="table-empty-icon" />
                    <h3 className="table-empty-title">No products found</h3>
                    <p className="table-empty-description">
                      Get started by adding your first product.
                    </p>
                    <button
                      onClick={handleAddProduct}
                      className="btn btn-primary mt-4"
                    >
                      <PlusIcon />
                      Add Your First Product
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              products.map((product) => {
                const stockStatus = getStockStatus(product);
                return (
                  <tr key={product.id}>
                    <td className="table-cell-primary">
                      <div>
                        {product.name}
                        {product.description && (
                          <div className="text-gray-500 text-sm mt-1">
                            {product.description}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="table-cell-secondary">{product.sku}</td>
                    <td className="table-cell-primary">{product.quantity}</td>
                    <td className="table-cell-primary">${product.selling_price.toFixed(2)}</td>
                    <td>
                      <span className={`table-status ${stockStatus.className}`}>
                        {stockStatus.text}
                      </span>
                    </td>
                    <td className="table-cell-actions">
                      <button
                        onClick={() => handleEditProduct(product)}
                        className="table-action-btn edit"
                        title="Edit product"
                      >
                        <PencilIcon />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(product)}
                        className="table-action-btn delete"
                        title="Delete product"
                      >
                        <TrashIcon />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

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
        <div className="modal-overlay">
          <div className="modal modal-md modal-confirmation">
            <div className="modal-header">
              <h3 className="modal-title">Delete Product</h3>
              <button
                onClick={() => setDeleteConfirm(null)}
                className="modal-close"
              >
                <XMarkIcon />
              </button>
            </div>
            <div className="modal-body">
              <div className="modal-confirmation-icon error">
                <TrashIcon />
              </div>
              <h4 className="modal-confirmation-title">Delete Product</h4>
              <p className="modal-confirmation-message">
                Are you sure you want to delete <strong>"{deleteConfirm.name}"</strong>? This action cannot be undone.
              </p>
            </div>
            <div className="modal-footer">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteProduct(deleteConfirm.id)}
                className="btn btn-error"
              >
                <TrashIcon />
                Delete Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
