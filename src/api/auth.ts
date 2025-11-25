import api from '../lib/api';
import { removeToken } from '../utils/jwt';

/**
 * Google OAuth 로그인 시작 (참고 App.tsx의 startGoogleLogin 함수와 동일)
 * 프론트에서 직접 Google OAuth URL로 리다이렉트
 */
export const startGoogleLogin = (): void => {
  // 참고 App.tsx와 동일한 client_id 사용
  const clientId = '133050396922-856c4qtiu21ta4h3s9j2tbua02kk1c23.apps.googleusercontent.com';
  
  // 참고 App.tsx와 동일한 redirect_uri 사용
  const redirectUri = 'https://sketchcheck.shop/auth/callback';
  
  // Google OAuth URL 생성 (참고 App.tsx와 동일)
  const googleURL =
    `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${clientId}` +
    `&redirect_uri=${redirectUri}` +
    `&response_type=code&scope=openid%20email%20profile`;
  
  console.log('🔐 Google OAuth 로그인 시작');
  
  // Google 로그인 페이지로 직접 이동 (참고 App.tsx와 동일)
  window.location.href = googleURL;
};

/**
 * 로그아웃
 * localStorage에서 토큰 제거
 */
export const logout = async (): Promise<void> => {
  try {
    // localStorage에서 토큰 제거
    removeToken();
    
    // 백엔드에 로그아웃 API가 있다면 호출 (선택사항)
    await api.post('/api/auth/logout', {}, { withCredentials: true });
  } catch (error) {
    console.error('로그아웃 요청 실패:', error);
    // 로그아웃은 클라이언트에서도 가능하므로 에러를 무시
  }
};
