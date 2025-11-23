import React from 'react';
import LoginButton from '../components/LoginButton';
import './Login.css';

interface LoginProps {
  onLogin?: () => void;
}

const Login: React.FC<LoginProps> = () => {

  return (
    <div className="login-page">
      <div className="login-container">
        {/* Logo */}
        <div className="login-logo-wrapper">
          <div className="login-logo-text">
            <span className="login-logo-sketch">Sketch</span>
            <span className="login-logo-check">Check</span>
          </div>
        </div>

        {/* Heading */}
        <div className="heading-container">
          <h1 className="heading-title">Get started with accessibility testing</h1>
        </div>

        {/* Description */}
        <div className="description-container">
          <p className="description-text">
            Quickly check and improve the accessibility of your hand-drawn UI sketches
          </p>
        </div>

        {/* Login Card */}
        <div className="login-card">
          <div className="card-content">
            <div className="signin-header">
              <h2 className="signin-title">Sign in</h2>
              <p className="signin-description">
                Sign in with your Google account to continue
              </p>
            </div>

            {/* Google Login Button */}
            <LoginButton />
          </div>
        </div>

        {/* Terms */}
        <div className="terms-container">
          <p className="terms-text">
            By signing in, you agree to our{' '}
            <a href="/terms" className="terms-link">Terms of Service</a>
            {' '}and{' '}
            <a href="/privacy" className="terms-link">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

