import { useState } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import Login from './pages/Login'
import AuthCallback from './pages/AuthCallback'
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
  const [isAccountPanelOpen, setIsAccountPanelOpen] = useState<boolean>(false)
  const [uploadHistory, setUploadHistory] = useState<UploadHistory[]>([])
  const [_taskId, setTaskId] = useState<string | null>(null)
  const [_error, setError] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false)
  const [showResults, setShowResults] = useState<boolean>(false)

  const navigate = useNavigate()

  // Zustand 스토어에서 인증 정보 가져오기
  const { user, isAuthenticated, logout: storeLogout } = useAuthStore()

  const handleLogout = async () => {
    try {
      await apiLogout()
    } catch (error) {
      console.error('로그아웃 API 호출 실패:', error)
    }
    storeLogout()
    setIsAccountPanelOpen(false)
    navigate('/login')
  }

  const getUserInitial = () => {
    if (!user?.name) return 'U'
    return user.name.charAt(0).toUpperCase()
  }

  const handleProfileClick = () => {
    setIsAccountPanelOpen(true)
  }

  const handleCloseAccountPanel = () => {
    setIsAccountPanelOpen(false)
  }

  const handleUpload = async (file: File) => {
    console.log('File uploaded:', file)
    setIsAnalyzing(true)
    setShowResults(false)
    setError(null)
    
    try {
      // 1. 파일 업로드
      const uploadResult = await uploadFile(file)
      
      console.log('Upload success:', uploadResult)
      const uploadedTaskId = uploadResult?.task_id
      setTaskId(uploadedTaskId)
      
      // 2. 3초 후 점수 조회
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
          
          setIsAnalyzing(false)
          setShowResults(true)
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
          setIsAnalyzing(false)
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
      setIsAnalyzing(false)
      alert('예상치 못한 오류가 발생했습니다.')
    }
  }

  const handleReset = () => {
    setShowResults(false)
    setTaskId(null)
    setError(null)
  }

  // Protected Route Component
  // localStorage의 'jwt' 토큰을 직접 체크하여 인증 여부 확인
  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const hasJWT = localStorage.getItem('jwt') !== null;
    
    console.log('🔐 ProtectedRoute 체크:', { 
      hasJWT, 
      isAuthenticated,
      jwt: localStorage.getItem('jwt')?.substring(0, 20) + '...'
    });
    
    // JWT가 있으면 무조건 인증됨으로 처리 (Zustand store보다 우선)
    if (!hasJWT) {
      console.log('❌ JWT 없음 - 로그인 페이지로 리다이렉트');
      return <Navigate to="/login" replace />
    }
    
    console.log('✅ JWT 있음 - 페이지 접근 허용');
    return <>{children}</>
  }

  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={
          // Zustand store의 isAuthenticated 또는 localStorage의 jwt 토큰이 있으면 업로드 페이지로
          (isAuthenticated || localStorage.getItem('jwt')) ? <Navigate to="/" replace /> : <Login />
        } />
        
        <Route path="/callback" element={<AuthCallback />} />

        {/* Protected Routes */}
        <Route path="/" element={
          <ProtectedRoute>
            {isAnalyzing ? (
              <Analyzing 
                userInitial={getUserInitial()} 
                onProfileClick={handleProfileClick}
              />
            ) : showResults ? (
              <Result 
                onReset={handleReset} 
                userInitial={getUserInitial()} 
                onProfileClick={handleProfileClick}
              />
            ) : (
              <WebUpload 
                onUpload={handleUpload} 
                userInitial={getUserInitial()} 
                onProfileClick={handleProfileClick}
              />
            )}
          </ProtectedRoute>
        } />

        {/* Catch all - redirect to login */}
        <Route path="*" element={
          <Navigate to={
            (isAuthenticated || localStorage.getItem('jwt')) ? "/" : "/login"
          } replace />
        } />
      </Routes>
      
      {/* Account Panel */}
      {isAuthenticated && (
        <AccountPanel
          isOpen={isAccountPanelOpen}
          onClose={handleCloseAccountPanel}
          userName={user?.name || ''}
          userEmail={user?.email || ''}
          userInitial={getUserInitial()}
          uploadHistory={uploadHistory}
          onLogout={handleLogout}
        />
      )}
    </>
  )
}

export default App
