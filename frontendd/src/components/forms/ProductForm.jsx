import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { XMarkIcon } from '@heroicons/react/24/outline';

const ProductForm = ({ product, onSuccess, onCancel }) => {
  const [loading, setLoading] = useState(false);
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
    try {
      if (isEditing) {
        const response = await api.put(`/products/${product.id}`, data);
        toast.success('Product updated successfully');
        // Pass the updated product back for instant UI update
        onSuccess(response.data.data.product);
      } else {
        const response = await api.post('/products', data);
        toast.success('Product created successfully');
        // Pass the new product back for instant UI update
        onSuccess(response.data.data.product);
      }
    } catch (error) {
      console.error('Error saving product:', error);
      const message =
        error.response?.data?.message ||
        `Failed to ${isEditing ? 'update' : 'create'} product`;
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal modal-lg modal-form">
        <div className="modal-header">
          <h3 className="modal-title">
            {isEditing ? 'Edit Product' : 'Add New Product'}
          </h3>
          <button onClick={onCancel} className="modal-close">
            <XMarkIcon />
          </button>
        </div>

        <div className="modal-body">
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Product Name */}
            <div className="form-group">
              <label htmlFor="name" className="form-label required">
                Product Name
              </label>
              <input
                type="text"
                id="name"
                {...register('name', { required: 'Product name is required' })}
                className={`form-input ${errors.name ? 'error' : ''}`}
                placeholder="Enter product name"
              />
              {errors.name && <p className="form-error">{errors.name.message}</p>}
            </div>

            {/* SKU */}
            <div className="form-group">
              <label htmlFor="sku" className="form-label required">
                SKU
              </label>
              <input
                type="text"
                id="sku"
                {...register('sku', { required: 'SKU is required' })}
                className={`form-input ${errors.sku ? 'error' : ''}`}
                placeholder="Enter SKU"
              />
              {errors.sku && <p className="form-error">{errors.sku.message}</p>}
            </div>

            {/* Description */}
            <div className="form-group">
              <label htmlFor="description" className="form-label">
                Description
              </label>
              <textarea
                id="description"
                rows={3}
                {...register('description')}
                className="form-input form-textarea"
                placeholder="Enter product description (optional)"
              />
            </div>

            {/* Quantity & Low Stock Threshold */}
            <div className="form-row form-row-2">
              <div className="form-group">
                <label htmlFor="quantity" className="form-label">
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
                  className={`form-input ${errors.quantity ? 'error' : ''}`}
                  placeholder="0"
                />
                {errors.quantity && (
                  <p className="form-error">{errors.quantity.message}</p>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="lowStockThreshold" className="form-label">
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
                  className={`form-input ${errors.lowStockThreshold ? 'error' : ''}`}
                  placeholder="5"
                />
                {errors.lowStockThreshold && (
                  <p className="form-error">{errors.lowStockThreshold.message}</p>
                )}
              </div>
            </div>

            {/* Cost & Selling Price */}
            <div className="form-row form-row-2">
              <div className="form-group">
                <label htmlFor="costPrice" className="form-label">
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
                  className={`form-input ${errors.costPrice ? 'error' : ''}`}
                  placeholder="0.00"
                />
                {errors.costPrice && (
                  <p className="form-error">{errors.costPrice.message}</p>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="sellingPrice" className="form-label">
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
                  className={`form-input ${errors.sellingPrice ? 'error' : ''}`}
                  placeholder="0.00"
                />
                {errors.sellingPrice && (
                  <p className="form-error">{errors.sellingPrice.message}</p>
                )}
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                onClick={onCancel}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`btn btn-primary ${loading ? 'loading' : ''}`}
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