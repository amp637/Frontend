import React from 'react';
import { startGoogleLogin } from '../api/auth';
import './Login.css';

const Login: React.FC = () => {
  const handleGoogleLogin = () => {
    try {
      // Google OAuth 로그인 시작
      startGoogleLogin();
    } catch (error: any) {
      console.error('Google 로그인 시작 실패:', error);
      alert(error.message || 'Google 로그인을 시작할 수 없습니다.');
    }
  };

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
            <button className="google-login-button" onClick={handleGoogleLogin}>
              <div className="google-icon">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19.8055 10.2292C19.8055 9.55138 19.7501 8.86733 19.6323 8.19818H10.2002V12.0492H15.6014C15.377 13.2911 14.6571 14.3898 13.6073 15.0879V17.5866H16.825C18.7172 15.8449 19.8055 13.2728 19.8055 10.2292Z" fill="#4285F4"/>
                  <path d="M10.2002 20C12.9502 20 15.2645 19.1045 16.8282 17.5866L13.6105 15.0879C12.7149 15.6977 11.5614 16.0427 10.2033 16.0427C7.54769 16.0427 5.29923 14.2826 4.51548 11.9165H1.19141V14.4918C2.79029 17.659 6.30433 20 10.2002 20Z" fill="#34A853"/>
                  <path d="M4.51237 11.9165C4.08887 10.6746 4.08887 9.32982 4.51237 8.08791V5.51257H1.19141C-0.397137 8.65879 -0.397137 12.3454 1.19141 15.4918L4.51237 11.9165Z" fill="#FBBC04"/>
                  <path d="M10.2002 3.95727C11.6344 3.93567 13.0165 4.47222 14.0539 5.45722L16.8926 2.60109C15.182 0.989635 12.9287 0.0757041 10.2002 0.1003C6.30433 0.1003 2.79029 2.44145 1.19141 5.51257L4.51237 8.08792C5.29301 5.71872 7.54458 3.95727 10.2002 3.95727Z" fill="#EA4335"/>
                </svg>
              </div>
              <span className="button-text">Continue with Google</span>
            </button>
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

