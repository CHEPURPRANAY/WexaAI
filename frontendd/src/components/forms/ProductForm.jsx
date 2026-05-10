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

  useEffect(() => {
    if (product) {
      reset(product);
    }
  }, [product, reset]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      if (isEditing) {
        await api.put(`/products/${product.id}`, data);
        toast.success('Product updated successfully');
      } else {
        await api.post('/products', data);
        toast.success('Product created successfully');
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving product:', error);
      const message = error.response?.data?.message || `Failed to ${isEditing ? 'update' : 'create'} product`;
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  {isEditing ? 'Edit Product' : 'Add New Product'}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {isEditing ? 'Update the product information below.' : 'Fill in the product details below.'}
                </p>
              </div>
              <button
                onClick={onCancel}
                className="text-gray-400 hover:text-gray-500"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Product Name *
                </label>
                <input
                  type="text"
                  id="name"
                  {...register('name', { required: 'Product name is required' })}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="Enter product name"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="sku" className="block text-sm font-medium text-gray-700">
                  SKU *
                </label>
                <input
                  type="text"
                  id="sku"
                  {...register('sku', { required: 'SKU is required' })}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="Enter SKU"
                />
                {errors.sku && (
                  <p className="mt-1 text-sm text-red-600">{errors.sku.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  id="description"
                  rows={3}
                  {...register('description')}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="Enter product description (optional)"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                    Quantity
                  </label>
                  <input
                    type="number"
                    id="quantity"
                    min="0"
                    {...register('quantity', {
                      valueAsNumber: true,
                      min: { value: 0, message: 'Quantity cannot be negative' }
                    })}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    placeholder="0"
                  />
                  {errors.quantity && (
                    <p className="mt-1 text-sm text-red-600">{errors.quantity.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="lowStockThreshold" className="block text-sm font-medium text-gray-700">
                    Low Stock Threshold
                  </label>
                  <input
                    type="number"
                    id="lowStockThreshold"
                    min="0"
                    {...register('lowStockThreshold', {
                      valueAsNumber: true,
                      min: { value: 0, message: 'Threshold cannot be negative' }
                    })}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    placeholder="5"
                  />
                  {errors.lowStockThreshold && (
                    <p className="mt-1 text-sm text-red-600">{errors.lowStockThreshold.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="costPrice" className="block text-sm font-medium text-gray-700">
                    Cost Price ($)
                  </label>
                  <input
                    type="number"
                    id="costPrice"
                    step="0.01"
                    min="0"
                    {...register('costPrice', {
                      valueAsNumber: true,
                      min: { value: 0, message: 'Cost price cannot be negative' }
                    })}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    placeholder="0.00"
                  />
                  {errors.costPrice && (
                    <p className="mt-1 text-sm text-red-600">{errors.costPrice.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="sellingPrice" className="block text-sm font-medium text-gray-700">
                    Selling Price ($)
                  </label>
                  <input
                    type="number"
                    id="sellingPrice"
                    step="0.01"
                    min="0"
                    {...register('sellingPrice', {
                      valueAsNumber: true,
                      min: { value: 0, message: 'Selling price cannot be negative' }
                    })}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    placeholder="0.00"
                  />
                  {errors.sellingPrice && (
                    <p className="mt-1 text-sm text-red-600">{errors.sellingPrice.message}</p>
                  )}
                </div>
              </div>

              <div className="mt-6 sm:flex sm:flex-row-reverse">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : null}
                  {loading ? 'Saving...' : (isEditing ? 'Update Product' : 'Create Product')}
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={onCancel}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;
