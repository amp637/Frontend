import api from '../lib/api';

// 타입 정의
export interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
}

export interface AuthResponse {
  user: User;
  accessToken?: string;
  token?: string;
  message?: string;
}

/**
 * Google OAuth 로그인 URL로 리다이렉트
 * 사용자를 Google 로그인 페이지로 이동시킵니다.
 */
export const startGoogleLogin = (): void => {
  const googleURL =
    `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=133050396922-856c4qtiu21ta4h3s9j2tbua02kk1c23.apps.googleusercontent.com` +
    `&redirect_uri=https://sketchcheck.shop/auth/callback` +
    `&response_type=code` +
    `&scope=openid%20email%20profile`;
  
  window.location.href = googleURL;
};

/**
 * 백엔드에 authorization code를 전달하여 JWT 토큰 획득
 * @param code - Google OAuth authorization code
 * @returns AuthResponse - 사용자 정보 및 토큰
 */
export const handleGoogleCallback = async (code: string): Promise<AuthResponse> => {
  try {
    // GET https://sketchcheck.shop/auth/callback?code=XXXX
    const response = await api.get<AuthResponse>('/auth/callback', {
      params: { code },
      withCredentials: true, // 쿠키 전송/수신 허용
    });
    
    const data = response.data;
    
    // localStorage에 토큰 저장
    if (data.accessToken) {
      localStorage.setItem('accessToken', data.accessToken);
    } else if (data.token) {
      localStorage.setItem('accessToken', data.token);
    }
    
    // 사용자 정보 저장
    if (data.user) {
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    
    return data;
  } catch (error: any) {
    console.error('Google OAuth 콜백 처리 실패:', error);
    
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    
    throw new Error('로그인 처리 중 오류가 발생했습니다.');
  }
};

/**
 * 로그아웃 (선택적으로 백엔드에 로그아웃 요청)
 */
export const logout = async (): Promise<void> => {
  try {
    // 백엔드에 로그아웃 API가 있다면 호출
    await api.post('/api/auth/logout', {}, { withCredentials: true });
  } catch (error) {
    console.error('로그아웃 요청 실패:', error);
    // 로그아웃은 클라이언트에서도 가능하므로 에러를 무시할 수 있음
  }
};

