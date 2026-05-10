import React from 'react';

const LoadingSpinner = ({ size = 'md', text = 'Loading...', className = '' }) => {
  const sizeClasses = {
    sm: 'spinner-sm',
    md: 'spinner',
    lg: 'spinner-lg'
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className={`${sizeClasses[size]} ${text ? 'mr-2' : ''}`}></div>
      {text && (
        <span className="text-gray-600 text-sm">{text}</span>
      )}
    </div>
  );
};

export default LoadingSpinner;
