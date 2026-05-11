import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import AlertMessage from '../common/AlertMessage';
import { useForm } from 'react-hook-form';
import { XMarkIcon, CubeIcon, PencilIcon } from '@heroicons/react/24/outline';
import '../../styles/components/forms-enhanced.css';

const ProductForm = ({ product, onSuccess, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const isEditing = !!product;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: product || {
      name: '',
      sku: '',
      description: '',
      quantity: 0,
      costPrice: 0,
      sellingPrice: 0,
      lowStockThreshold: 5,
    },
  });

  // Reset form when product prop changes (for editing)
  useEffect(() => {
    if (product) {
      // Map database field names to form field names
      reset({
        name: product.name || '',
        sku: product.sku || '',
        description: product.description || '',
        quantity: product.quantity || 0,
        costPrice: product.cost_price || 0,
        sellingPrice: product.selling_price || 0,
        lowStockThreshold: product.low_stock_threshold || 5,
      });
    }
  }, [product, reset]);

  const onSubmit = async (data) => {
    setLoading(true);
    setAlert(null);
    try {
      if (isEditing) {
        const response = await api.put(`/products/${product.id}`, data);
        setAlert({
          type: 'success',
          title: 'Product Updated Successfully!',
          message: `${data.name} has been updated in your inventory.`
        });
        // Pass the updated product back for instant UI update
        setTimeout(() => {
          onSuccess(response.data.data.product);
        }, 1500);
      } else {
        const response = await api.post('/products', data);
        setAlert({
          type: 'success',
          title: 'Product Created Successfully!',
          message: `${data.name} has been added to your inventory.`
        });
        // Pass the new product back for instant UI update
        setTimeout(() => {
          onSuccess(response.data.data.product);
        }, 1500);
      }
    } catch (error) {
      console.error('Error saving product:', error);
      const message =
        error.response?.data?.message ||
        `Failed to ${isEditing ? 'update' : 'create'} product`;
      setAlert({
        type: 'error',
        title: `${isEditing ? 'Update' : 'Creation'} Failed`,
        message: message
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-enhanced-overlay">
      <div className="modal-enhanced modal-lg modal-form">
        <div className="modal-enhanced-header">
          <div className="modal-enhanced-title-section">
            <div className="modal-enhanced-icon">
              {isEditing ? <PencilIcon /> : <CubeIcon />}
            </div>
            <div>
              <h2 className="modal-enhanced-title">
                {isEditing ? 'Edit Product' : 'Add New Product'}
              </h2>
            </div>
          </div>
          <button onClick={onCancel} className="modal-enhanced-close">
            <XMarkIcon />
          </button>
        </div>

        <div className="modal-enhanced-body">
          {/* Alert Messages */}
          {alert && (
            <AlertMessage
              type={alert.type}
              title={alert.title}
              message={alert.message}
              onDismiss={() => setAlert(null)}
              className="form-alert"
            />
          )}

          <form className="form-enhanced" onSubmit={handleSubmit(onSubmit)}>
            {/* Product Name */}
            <div className="form-enhanced-group">
              <label htmlFor="name" className="form-enhanced-label required">
                Product Name
              </label>
              <input
                type="text"
                id="name"
                {...register('name', { required: 'Product name is required' })}
                className={`form-enhanced-input ${errors.name ? 'error' : ''}`}
                placeholder="Enter product name"
              />
              {errors.name && (
                <p className="form-enhanced-error">{errors.name.message}</p>
              )}
            </div>

            {/* SKU */}
            <div className="form-enhanced-group">
              <label htmlFor="sku" className="form-enhanced-label required">
                SKU
              </label>
              <input
                type="text"
                id="sku"
                {...register('sku', { required: 'SKU is required' })}
                className={`form-enhanced-input ${errors.sku ? 'error' : ''}`}
                placeholder="Enter SKU"
              />
              {errors.sku && (
                <p className="form-enhanced-error">{errors.sku.message}</p>
              )}
            </div>

            {/* Description */}
            <div className="form-enhanced-group">
              <label htmlFor="description" className="form-enhanced-label">
                Description
              </label>
              <textarea
                id="description"
                rows={3}
                {...register('description')}
                className="form-enhanced-input form-enhanced-textarea"
                placeholder="Enter product description (optional)"
              />
              <p className="form-enhanced-help">
                Add a detailed description to help identify this product in your inventory.
              </p>
            </div>

            {/* Quantity & Low Stock Threshold */}
            <div className="form-enhanced-row form-enhanced-row-2">
              <div className="form-enhanced-group">
                <label htmlFor="quantity" className="form-enhanced-label">
                  Quantity
                </label>
                <input
                  type="number"
                  id="quantity"
                  min="0"
                  {...register('quantity', {
                    valueAsNumber: true,
                    min: { value: 0, message: 'Quantity cannot be negative' },
                  })}
                  className={`form-enhanced-input ${errors.quantity ? 'error' : ''}`}
                  placeholder="0"
                />
                {errors.quantity && (
                  <p className="form-enhanced-error">{errors.quantity.message}</p>
                )}
              </div>

              <div className="form-enhanced-group">
                <label htmlFor="lowStockThreshold" className="form-enhanced-label">
                  Low Stock Threshold
                </label>
                <input
                  type="number"
                  id="lowStockThreshold"
                  min="0"
                  {...register('lowStockThreshold', {
                    valueAsNumber: true,
                    min: { value: 0, message: 'Threshold cannot be negative' },
                  })}
                  className={`form-enhanced-input ${errors.lowStockThreshold ? 'error' : ''}`}
                  placeholder="5"
                />
                {errors.lowStockThreshold && (
                  <p className="form-enhanced-error">{errors.lowStockThreshold.message}</p>
                )}
              </div>
            </div>

            {/* Cost & Selling Price */}
            <div className="form-enhanced-row form-enhanced-row-2">
              <div className="form-enhanced-group">
                <label htmlFor="costPrice" className="form-enhanced-label">
                  Cost Price ($)
                </label>
                <input
                  type="number"
                  id="costPrice"
                  step="0.01"
                  min="0"
                  {...register('costPrice', {
                    valueAsNumber: true,
                    min: { value: 0, message: 'Cost price cannot be negative' },
                  })}
                  className={`form-enhanced-input ${errors.costPrice ? 'error' : ''}`}
                  placeholder="0.00"
                />
                {errors.costPrice && (
                  <p className="form-enhanced-error">{errors.costPrice.message}</p>
                )}
              </div>

              <div className="form-enhanced-group">
                <label htmlFor="sellingPrice" className="form-enhanced-label">
                  Selling Price ($)
                </label>
                <input
                  type="number"
                  id="sellingPrice"
                  step="0.01"
                  min="0"
                  {...register('sellingPrice', {
                    valueAsNumber: true,
                    min: { value: 0, message: 'Selling price cannot be negative' },
                    validate: (value) =>
                      value >= 0.01 || 'Selling price must be at least $0.01',
                  })}
                  className={`form-enhanced-input ${errors.sellingPrice ? 'error' : ''}`}
                  placeholder="0.00"
                />
                {errors.sellingPrice && (
                  <p className="form-enhanced-error">{errors.sellingPrice.message}</p>
                )}
              </div>
            </div>


            <div className="modal-enhanced-footer">
              <button
                type="button"
                onClick={onCancel}
                className="btn-enhanced btn-enhanced-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`btn-enhanced btn-enhanced-primary ${loading ? 'loading' : ''}`}
              >
                {loading
                  ? 'Saving...'
                  : isEditing
                  ? 'Update Product'
                  : 'Create Product'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;