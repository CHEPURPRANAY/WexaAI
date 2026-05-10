import React from 'react';
import { ExclamationTriangleIcon, XMarkIcon } from '@heroicons/react/24/outline';

const ErrorMessage = ({ 
  error, 
  onDismiss, 
  variant = 'error',
  className = '',
  showIcon = true 
}) => {
  if (!error) return null;

  const iconClasses = {
    error: 'text-error-600',
    warning: 'text-warning-600',
    info: 'text-primary-600',
    success: 'text-success-600'
  };

  const bgClasses = {
    error: 'bg-error-50 border-error-200',
    warning: 'bg-warning-50 border-warning-200',
    info: 'bg-primary-50 border-primary-200',
    success: 'bg-success-50 border-success-200'
  };

  return (
    <div className={`alert ${bgClasses[variant]} ${className}`}>
      {showIcon && (
        <div className="alert-icon">
          {variant === 'error' && <ExclamationTriangleIcon />}
          {variant === 'warning' && <ExclamationTriangleIcon />}
          {variant === 'info' && <ExclamationTriangleIcon />}
          {variant === 'success' && <ExclamationTriangleIcon />}
        </div>
      )}
      
      <div className="alert-content">
        <div className="alert-title">{error.title || 'Error'}</div>
        <div className="alert-message">{error.message}</div>
        
        {error.details && error.details.length > 0 && (
          <div className="mt-3">
            <div className="text-sm font-medium text-gray-700 mb-2">Details:</div>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
              {error.details.map((detail, index) => (
                <li key={index}>{detail}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {onDismiss && (
        <button
          onClick={onDismiss}
          className="alert-close"
          title="Dismiss error"
        >
          <XMarkIcon />
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
