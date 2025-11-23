import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import CallbackPage from './pages/CallbackPage'
import WebUpload from './pages/WebUpload'
import Analyzing from './pages/Analyzing'
import Result from './pages/Result'
import AccountPanel from './components/AccountPanel'
import { uploadFile, getScore } from './api'
import { useAuthStore } from './store/authStore'
import { logout as apiLogout } from './api/auth'
import './App.css'

interface UploadHistory {
  id: string;
  fileName: string;
  uploadDate: Date;
  score: number;
}

function App() {
  const [currentPage, setCurrentPage] = useState<'upload' | 'analyzing' | 'results'>('upload')
  const [isAccountPanelOpen, setIsAccountPanelOpen] = useState<boolean>(false)
  const [uploadHistory, setUploadHistory] = useState<UploadHistory[]>([])
  const [_taskId, setTaskId] = useState<string | null>(null)
  const [_error, setError] = useState<string | null>(null)

  // Zustand 스토어 또는 localStorage에서 인증 정보 가져오기
  const { user, isAuthenticated, logout: storeLogout } = useAuthStore()

  // localStorage에서 토큰 확인하여 로그인 상태 체크
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const userStr = localStorage.getItem('user');
    
    if (token && userStr && !isAuthenticated) {
      try {
        const userData = JSON.parse(userStr);
        // Zustand 스토어에도 저장 (선택사항)
        // login(userData);
        console.log('localStorage에서 로그인 상태 복원:', userData);
      } catch (error) {
        console.error('사용자 정보 파싱 실패:', error);
      }
    }
  }, [isAuthenticated]);

  const getUserInitial = () => {
    if (user?.name) {
      return user.name.charAt(0).toUpperCase();
    }
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const userData = JSON.parse(userStr);
        return userData.name?.charAt(0).toUpperCase() || 'U';
      } catch {
        return 'U';
      }
    }
    return 'U';
  }

  const getUserName = () => {
    return user?.name || JSON.parse(localStorage.getItem('user') || '{}').name || '';
  }

  const getUserEmail = () => {
    return user?.email || JSON.parse(localStorage.getItem('user') || '{}').email || '';
  }

  const handleProfileClick = () => {
    setIsAccountPanelOpen(true)
  }

  const handleCloseAccountPanel = () => {
    setIsAccountPanelOpen(false)
  }

  const handleLogout = async () => {
    try {
      await apiLogout()
    } catch (error) {
      console.error('로그아웃 API 호출 실패:', error)
    }
    // localStorage 정리
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    // Zustand 스토어 정리
    storeLogout()
    setIsAccountPanelOpen(false)
  }

  const handleUpload = async (file: File) => {
    console.log('File uploaded:', file)
    setCurrentPage('analyzing')
    setError(null)
    
    try {
      // 1. 파일 업로드
      const uploadResult = await uploadFile(file)
      
      console.log('Upload success:', uploadResult)
      const uploadedTaskId = uploadResult?.task_id
      setTaskId(uploadedTaskId)
      
      // 2. 3초 후 점수 조회 (실제로는 서버에서 완료 신호를 받거나 폴링 사용)
      setTimeout(async () => {
        try {
          const scoreResult = await getScore()
          console.log('Score retrieved:', scoreResult)
          
          // 히스토리에 추가
          const newHistoryItem: UploadHistory = {
            id: uploadedTaskId || Date.now().toString(),
            fileName: file.name,
            uploadDate: new Date(),
            score: scoreResult?.score || 0
          }
          setUploadHistory(prev => [newHistoryItem, ...prev])
          
          setCurrentPage('results')
        } catch (scoreErr: any) {
          if (scoreErr.response) {
            const data = scoreErr.response.data;
            const dataStr = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
            console.error(`❌ Failed to get score [${scoreErr.response.status}]:`, dataStr);
          } else {
            console.error('❌ Failed to get score (네트워크 에러):', scoreErr.message);
          }
          setError('Failed to get score')
          alert('점수 조회 실패')
          setCurrentPage('upload')
        }
      }, 3000)
      
    } catch (err: any) {
      if (err.response) {
        const data = err.response.data;
        const dataStr = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
        console.error(`❌ Unexpected error [${err.response.status}]:`, dataStr);
      } else {
        console.error('❌ Unexpected error (네트워크 에러):', err.message);
      }
      setError('Unexpected error occurred')
      setCurrentPage('upload')
      alert('예상치 못한 오류가 발생했습니다.')
    }
  }

  const handleReset = () => {
    setCurrentPage('upload')
    setTaskId(null)
    setError(null)
  }

  // 로그인 여부 확인 (localStorage 또는 Zustand)
  const checkAuth = () => {
    return isAuthenticated || !!localStorage.getItem('accessToken');
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* 로그인 페이지 */}
        <Route 
          path="/login" 
          element={checkAuth() ? <Navigate to="/" replace /> : <Login />} 
        />

        {/* OAuth 콜백 페이지 */}
        <Route path="/auth/callback" element={<CallbackPage />} />
        <Route path="/callback" element={<CallbackPage />} />

        {/* 메인 페이지 (로그인 필요) */}
        <Route 
          path="/" 
          element={
            checkAuth() ? (
              <>
                {currentPage === 'upload' && (
                  <WebUpload 
                    onUpload={handleUpload} 
                    userInitial={getUserInitial()} 
                    onProfileClick={handleProfileClick}
                  />
                )}
                {currentPage === 'analyzing' && (
                  <Analyzing 
                    userInitial={getUserInitial()} 
                    onProfileClick={handleProfileClick}
                  />
                )}
                {currentPage === 'results' && (
                  <Result 
                    onReset={handleReset} 
                    userInitial={getUserInitial()} 
                    onProfileClick={handleProfileClick}
                  />
                )}
                
                {/* Account Panel */}
                <AccountPanel
                  isOpen={isAccountPanelOpen}
                  onClose={handleCloseAccountPanel}
                  userName={getUserName()}
                  userEmail={getUserEmail()}
                  userInitial={getUserInitial()}
                  uploadHistory={uploadHistory}
                  onLogout={handleLogout}
                />
              </>
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />

        {/* 기타 경로는 홈으로 리다이렉트 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
