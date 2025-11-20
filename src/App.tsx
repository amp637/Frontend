import { useState } from 'react'
import Login from './pages/Login'
import WebUpload from './pages/WebUpload'
import Analyzing from './pages/Analyzing'
import Result from './pages/Result'
import { uploadFile, getScore } from './api'
import './App.css'

type AppState = 'login' | 'upload' | 'analyzing' | 'results'

function App() {
  const [appState, setAppState] = useState<AppState>('login')
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [_taskId, setTaskId] = useState<string | null>(null)
  const [_error, setError] = useState<string | null>(null)

  const handleLogin = () => {
    // TODO: 실제 Google 로그인 로직 구현
    console.log('Login successful')
    setIsAuthenticated(true)
    setAppState('upload')
  }

  const handleUpload = async (file: File) => {
    console.log('File uploaded:', file)
    setAppState('analyzing')
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
          setAppState('results')
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
          setAppState('upload')
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
      setAppState('upload')
      alert('예상치 못한 오류가 발생했습니다.')
    }
  }

  const handleReset = () => {
    setAppState('upload')
    setTaskId(null)
    setError(null)
  }

  return (
    <>
      {appState === 'login' && <Login onLogin={handleLogin} />}
      {appState === 'upload' && isAuthenticated && <WebUpload onUpload={handleUpload} />}
      {appState === 'analyzing' && isAuthenticated && <Analyzing />}
      {appState === 'results' && isAuthenticated && <Result onReset={handleReset} />}
    </>
  )
}

export default App
