import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import AlertMessage from '../../components/common/AlertMessage';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    setAlert(null);
    
    try {
      const result = await login(data);
      if (result.success) {
        setAlert({
          type: 'success',
          title: 'Login Successful!',
          message: 'Welcome back! Redirecting to your dashboard...'
        });
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      } else {
        const userNotFoundKeywords = ['not found', 'does not exist', 'no account', 'invalid email', 'user not', 'sign up'];
        const isUserNotFound = userNotFoundKeywords.some(keyword => 
          result.message.toLowerCase().includes(keyword)
        );
        
        if (isUserNotFound) {
          setAlert({
            type: 'warning',
            title: 'Account Not Found',
            message: `${result.message} Would you like to create a new account?`
          });
        } else {
          setAlert({
            type: 'error',
            title: 'Invalid Credentials',
            message: result.message || 'Please check your email and password and try again.'
          });
        }
      }
    } catch (error) {
      setAlert({
        type: 'error',
        title: 'Login Failed',
        message: 'An unexpected error occurred. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h1 className="auth-title">Sign in to StockFlow</h1>
          <p className="auth-subtitle">
            Or{' '}
            <Link to="/signup" className="auth-link">
              create a new account
            </Link>
          </p>
        </div>
        
        {alert && (
          <AlertMessage
            type={alert.type}
            title={alert.title}
            message={alert.message}
            onDismiss={() => setAlert(null)}
            className="auth-alert"
          />
        )}
        
        <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
          <div className="auth-form-group">
            <label htmlFor="email" className="form-label">Email address</label>
            <input
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: 'Invalid email address',
                },
              })}
              type="email"
              autoComplete="email"
              className={`form-input ${errors.email ? 'error' : ''}`}
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="auth-form-error">{errors.email.message}</p>
            )}
          </div>

          <div className="auth-form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              {...register('password', {
                required: 'Password is required',
              })}
              type="password"
              autoComplete="current-password"
              className={`form-input ${errors.password ? 'error' : ''}`}
              placeholder="Enter your password"
            />
            {errors.password && (
              <p className="auth-form-error">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`btn btn-primary btn-full ${loading ? 'loading' : ''}`}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
