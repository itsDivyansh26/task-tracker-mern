import React, { useState } from 'react';
import { LogIn, UserPlus, AlertCircle, Eye, EyeOff } from 'lucide-react';
import api from '../services/api';

export const Auth = ({ onAuthSuccess }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const newErrors = {};
    const cleanUsername = username.trim();

    if (!cleanUsername) {
      newErrors.username = 'Username is required';
    } else if (cleanUsername.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    } else if (cleanUsername.length > 30) {
      newErrors.username = 'Username cannot exceed 30 characters';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (isRegister) {
      if (!confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (password !== confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      let data;
      if (isRegister) {
        data = await api.register({ username, password });
      } else {
        data = await api.login({ username, password });
      }
      
      // Save token & user
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({ _id: data._id, username: data.username }));
      
      // Success callback
      onAuthSuccess(data);
    } catch (err) {
      console.error(err);
      const errMsg = err.response?.data?.error || 'Authentication failed. Please try again.';
      setErrors({ submit: errMsg });
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleAuthMode = () => {
    setIsRegister(!isRegister);
    setUsername('');
    setPassword('');
    setConfirmPassword('');
    setErrors({});
  };

  return (
    <div className="auth-wrapper">
      <div className="glass auth-card">
        <div className="auth-header">
          <div className="logo-icon">⚡</div>
          <h2 className="auth-title">{isRegister ? 'Create Account' : 'Welcome Back'}</h2>
          <p className="auth-subtitle">
            {isRegister ? 'Join TaskFlow and stay organized' : 'Sign in to access your task dashboard'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {errors.submit && (
            <div className="submit-error">
              <AlertCircle size={16} />
              <span>{errors.submit}</span>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              className={`form-control ${errors.username ? 'is-invalid' : ''}`}
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isSubmitting}
            />
            {errors.username && (
              <span className="error-text">
                <AlertCircle size={12} />
                {errors.username}
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                placeholder="Enter password (min 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isSubmitting}
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <span className="error-text">
                <AlertCircle size={12} />
                {errors.password}
              </span>
            )}
          </div>

          {isRegister && (
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                id="confirmPassword"
                className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isSubmitting}
              />
              {errors.confirmPassword && (
                <span className="error-text">
                  <AlertCircle size={12} />
                  {errors.confirmPassword}
                </span>
              )}
            </div>
          )}

          <button type="submit" className="btn btn-primary btn-block" disabled={isSubmitting}>
            {isSubmitting ? (
              <span className="spinner"></span>
            ) : (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                {isRegister ? <UserPlus size={18} /> : <LogIn size={18} />}
                {isRegister ? 'Register' : 'Login'}
              </span>
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button type="button" className="auth-link-btn" onClick={toggleAuthMode} disabled={isSubmitting}>
              {isRegister ? 'Sign In' : 'Create Account'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
