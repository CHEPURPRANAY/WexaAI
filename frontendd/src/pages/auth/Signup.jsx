import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const Signup = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [loading, setLoading] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const result = await signup(data);
      if (result.success) {
        toast.success('Account created successfully!');
        navigate('/dashboard');
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
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
          <h1 className="auth-title">Create your StockFlow account</h1>
          <p className="auth-subtitle">
            Or{' '}
            <Link to="/login" className="auth-link">
              sign in to your existing account
            </Link>
          </p>
        </div>
        
        <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
          <div className="auth-form-group">
            <label htmlFor="organizationName" className="form-label">Organization Name</label>
            <input
              {...register('organizationName', {
                required: 'Organization name is required',
                minLength: {
                  value: 2,
                  message: 'Organization name must be at least 2 characters',
                },
              })}
              type="text"
              className={`form-input ${errors.organizationName ? 'error' : ''}`}
              placeholder="Enter your organization name"
            />
            {errors.organizationName && (
              <p className="auth-form-error">{errors.organizationName.message}</p>
            )}
          </div>

          <div className="auth-form-group">
            <label htmlFor="email" className="form-label">Email Address</label>
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
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
              })}
              type="password"
              autoComplete="new-password"
              className={`form-input ${errors.password ? 'error' : ''}`}
              placeholder="Create a password"
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
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
