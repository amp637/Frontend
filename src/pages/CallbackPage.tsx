import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleGoogleCallback } from '../api/auth';
import './AuthCallback.css'; // 기존 스타일 재사용

/**
 * Google OAuth 콜백 페이지
 * URL에서 code를 추출하여 백엔드로 전달하고 로그인 처리합니다.
 */
const CallbackPage: React.FC = () => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    const processCallback = async () => {
      try {
        // URL에서 code 파라미터 추출
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const error = urlParams.get('error');

        if (error) {
          throw new Error(`OAuth Error: ${error}`);
        }

        if (!code) {
          throw new Error('Authorization code가 없습니다.');
        }

        console.log('Google OAuth code 수신:', code);

        // 백엔드에 code 전달하여 인증 처리
        // GET https://sketchcheck.shop/auth/callback?code=XXXX
        const authResponse = await handleGoogleCallback(code);

        console.log('로그인 성공:', authResponse);

        setStatus('success');
        
        // URL에서 code 파라미터 제거
        window.history.replaceState({}, document.title, window.location.pathname);
        
        // 성공 후 1초 뒤 홈으로 이동
        setTimeout(() => {
          navigate('/');
        }, 1000);

      } catch (err: any) {
        console.error('인증 처리 실패:', err);
        const message = err.message || '로그인 처리 중 오류가 발생했습니다.';
        setErrorMessage(message);
        setStatus('error');

        // 에러 후 3초 뒤 로그인 페이지로 복귀
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    };

    processCallback();
  }, [navigate]);

  return (
    <div className="auth-callback-page">
      <div className="auth-callback-container">
        {status === 'loading' && (
          <div className="auth-callback-content">
            <div className="auth-callback-spinner"></div>
            <h2 className="auth-callback-title">로그인 중...</h2>
            <p className="auth-callback-description">
              Google 계정으로 인증하고 있습니다.
            </p>
          </div>
        )}

        {status === 'success' && (
          <div className="auth-callback-content">
            <div className="auth-callback-success-icon">✓</div>
            <h2 className="auth-callback-title">로그인 성공!</h2>
            <p className="auth-callback-description">
              잠시 후 메인 페이지로 이동합니다.
            </p>
          </div>
        )}

        {status === 'error' && (
          <div className="auth-callback-content">
            <div className="auth-callback-error-icon">✕</div>
            <h2 className="auth-callback-title">로그인 실패</h2>
            <p className="auth-callback-description auth-callback-error">
              {errorMessage}
            </p>
            <p className="auth-callback-description">
              잠시 후 로그인 페이지로 돌아갑니다.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CallbackPage;

