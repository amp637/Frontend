/**
 * JWT 토큰 디코딩 유틸리티
 * 백엔드에서 발급한 JWT 토큰을 디코딩하여 사용자 정보 추출
 */

interface JWTPayload {
  sub?: string;
  user_id?: string;
  email?: string;
  name?: string;
  picture?: string;
  exp?: number;
  iat?: number;
  [key: string]: any;
}

/**
 * JWT 토큰을 디코딩하여 payload 반환
 * @param token - JWT 토큰 문자열
 * @returns 디코딩된 payload 객체 또는 null
 */
export function decodeJWT(token: string): JWTPayload | null {
  try {
    // JWT는 header.payload.signature 형식
    const parts = token.split('.');
    
    if (parts.length !== 3) {
      console.error('Invalid JWT format');
      return null;
    }

    // payload는 두 번째 부분 (Base64 URL 인코딩)
    const payload = parts[1];
    
    // Base64 URL 디코딩
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    return JSON.parse(jsonPayload) as JWTPayload;
  } catch (error) {
    console.error('JWT decode error:', error);
    return null;
  }
}

/**
 * JWT 토큰이 만료되었는지 확인
 * @param token - JWT 토큰 문자열
 * @returns 만료 여부 (true: 만료됨, false: 유효함)
 */
export function isTokenExpired(token: string): boolean {
  const payload = decodeJWT(token);
  
  if (!payload || !payload.exp) {
    return true;
  }

  // exp는 초 단위 timestamp
  const currentTime = Math.floor(Date.now() / 1000);
  return payload.exp < currentTime;
}

/**
 * localStorage에서 토큰을 가져옴
 * @returns JWT 토큰 문자열 또는 null
 * 
 * 참고: 참고 App.tsx와 동일하게 "jwt" 키를 사용합니다.
 */
export function getToken(): string | null {
  return localStorage.getItem('jwt');
}

/**
 * localStorage에서 토큰 제거
 * 
 * 참고: 참고 App.tsx와 동일하게 "jwt" 키를 사용합니다.
 */
export function removeToken(): void {
  localStorage.removeItem('jwt');
}






