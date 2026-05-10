import React from 'react';
import { 
  CheckCircleIcon, 
  ExclamationTriangleIcon, 
  XCircleIcon, 
  InformationCircleIcon,
  XMarkIcon 
} from '@heroicons/react/24/outline';

const AlertMessage = ({ 
  type = 'info', 
  title, 
  message, 
  onDismiss, 
  className = '', 
  showIcon = true,
  dismissible = true 
}) => {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon className="alert-icon" />;
      case 'warning':
        return <ExclamationTriangleIcon className="alert-icon" />;
      case 'error':
        return <XCircleIcon className="alert-icon" />;
      default:
        return <InformationCircleIcon className="alert-icon" />;
    }
  };

  const alertClasses = [
    'alert',
    `alert-${type}`,
    dismissible ? 'alert-dismissible' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div 
      className={alertClasses}
      role="alert"
      aria-live={type === 'error' ? 'assertive' : 'polite'}
    >
      {showIcon && getIcon()}
      
      <div className="alert-content">
        {title && <div className="alert-title">{title}</div>}
        {message && <div className="alert-message">{message}</div>}
      </div>
      
      {dismissible && onDismiss && (
        <button
          type="button"
          className="alert-close"
          onClick={onDismiss}
          aria-label="Dismiss alert"
        >
          <XMarkIcon />
        </button>
      )}
    </div>
  );
};

export default AlertMessage;
