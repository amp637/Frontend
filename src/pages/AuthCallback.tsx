import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { decodeJWT } from '../utils/jwt';

const AuthCallback: React.FC = () => {
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [processed, setProcessed] = useState<boolean>(false); // 중복 실행 방지 플래그
  const { login, setError } = useAuthStore();

  // 참고 App.tsx의 useEffect - /callback?token=... 처리
  useEffect(() => {
    // 이미 처리했으면 다시 실행하지 않음 (무한 루프 방지)
    if (processed) {
      return;
    }

    const processCallback = async () => {
      try {
        console.log('🔄 OAuth Callback 처리 시작');
        
        // URL에서 파라미터 추출 (참고 App.tsx와 동일)
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');

        // Token 확인 (참고 App.tsx와 동일)
        if (!token) {
          console.error('❌ Token이 없습니다.');
          throw new Error('인증 토큰이 없습니다. 다시 로그인해주세요.');
        }

        console.log('✅ Token 수신:', token.substring(0, 20) + '...');

        // JWT 토큰을 localStorage에 저장 (참고 App.tsx: localStorage.setItem("jwt", token))
        localStorage.setItem('jwt', token);
        console.log('💾 localStorage에 JWT 저장 완료');
        
        // 저장 확인
        const savedToken = localStorage.getItem('jwt');
        console.log('✅ 저장된 JWT 확인:', savedToken ? savedToken.substring(0, 20) + '...' : 'null');
        
        if (!savedToken) {
          throw new Error('JWT 저장 실패');
        }

        // JWT 토큰에서 사용자 정보 디코딩
        const userInfo = decodeJWT(token);
        
        if (!userInfo) {
          throw new Error('유효하지 않은 토큰입니다.');
        }

        console.log('✅ 사용자 정보:', {
          email: userInfo.email,
          name: userInfo.name,
        });

        // Zustand 스토어에 사용자 정보 저장
        login({
          id: userInfo.sub || userInfo.user_id || 'unknown',
          email: userInfo.email || '',
          name: userInfo.name || userInfo.email || 'User',
          picture: userInfo.picture,
        });

        setProcessed(true); // 처리 완료 플래그 설정
        
        console.log('✅ 로그인 완료! 업로드 페이지로 이동합니다...');
        console.log('✅ Zustand login() 호출 완료');
        
        // localStorage에 JWT가 있는지 최종 확인
        const finalCheck = localStorage.getItem('jwt');
        console.log('🔍 최종 JWT 확인:', finalCheck ? '있음' : '없음');
        
        if (!finalCheck) {
          throw new Error('JWT 최종 확인 실패 - localStorage에 저장되지 않음');
        }
        
        // 성공 후 바로 업로드 페이지로 이동 (success 화면 건너뛰기)
        const beforeMove = localStorage.getItem('jwt');
        console.log('🔄 이동 직전 JWT 확인:', beforeMove ? '있음 (' + beforeMove.substring(0, 20) + '...)' : '없음');
        console.log('🔄 window.location.href = "/" 실행');
        window.location.href = '/';

      } catch (err: any) {
        console.error('❌ 인증 처리 실패:', err);
        const message = err.message || '로그인 처리 중 오류가 발생했습니다.';
        setErrorMessage(message);
        setError(message);
        setProcessed(true); // 처리 완료 플래그 설정

        // JWT 저장 실패 시 localStorage에서 제거
        localStorage.removeItem('jwt');
        console.log('❌ JWT 제거됨');

        // 에러 메시지 표시
        alert(`로그인에 실패했습니다. 다시 시도해 주세요.\n\n${message}`);

        // 에러 후 즉시 로그인 페이지로 복귀
        console.log('🔄 에러 발생 - 로그인 페이지로 이동');
        window.location.replace('/login');
      }
    };

    processCallback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 빈 dependency array로 한 번만 실행

  // UI를 렌더링하지 않고 바로 리다이렉트 처리
  // 에러가 있을 때만 간단한 메시지 표시
  if (errorMessage) {
    return null; // 에러 시에도 alert으로 처리하고 바로 리다이렉트하므로 UI 불필요
  }

  return null; // 아무것도 렌더링하지 않음
};

export default AuthCallback;
