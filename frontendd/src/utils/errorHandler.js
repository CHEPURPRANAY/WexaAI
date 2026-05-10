// Error handling utilities for frontend

export const handleApiError = (error) => {
  console.error('API Error:', error);

  if (error.response) {
    const status = error.response.status;
    const data = error.response.data;

    switch (status) {
      case 400:
        return {
          message: data.message || 'Bad Request',
          type: 'validation',
          details: data.errors || []
        };
      
      case 401:
        return {
          message: data.message || 'Unauthorized',
          type: 'auth',
          action: 'redirect_to_login'
        };
      
      case 403:
        return {
          message: data.message || 'Forbidden',
          type: 'permission'
        };
      
      case 404:
        return {
          message: data.message || 'Resource not found',
          type: 'not_found'
        };
      
      case 422:
        return {
          message: data.message || 'Unprocessable Entity',
          type: 'validation',
          details: data.errors || []
        };
      
      case 429:
        return {
          message: 'Too many requests. Please try again later.',
          type: 'rate_limit'
        };
      
      case 500:
        return {
          message: data.message || 'Internal server error',
          type: 'server'
        };
      
      default:
        return {
          message: data.message || `Request failed with status ${status}`,
          type: 'unknown'
        };
    }
  } else if (error.request) {
    // Network error
    return {
      message: 'Network error. Please check your connection.',
      type: 'network'
    };
  } else {
    // Other errors
    return {
      message: error.message || 'An unexpected error occurred',
      type: 'unknown'
    };
  }
};

export const getErrorMessage = (error) => {
  if (typeof error === 'string') {
    return error;
  }
  
  if (error && error.message) {
    return error.message;
  }
  
  return 'An unexpected error occurred';
};

export const isErrorOfType = (error, type) => {
  const errorInfo = handleApiError(error);
  return errorInfo.type === type;
};

export const shouldRedirectToLogin = (error) => {
  const errorInfo = handleApiError(error);
  return errorInfo.action === 'redirect_to_login';
};

// Retry logic for failed requests
export const shouldRetry = (error) => {
  const errorInfo = handleApiError(error);
  return ['network', 'server', 'rate_limit'].includes(errorInfo.type);
};

export const getRetryDelay = (attempt = 1) => {
  // Exponential backoff: 1s, 2s, 4s, 8s, max 30s
  return Math.min(1000 * Math.pow(2, attempt - 1), 30000);
};
