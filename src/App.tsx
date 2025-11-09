import { useState } from 'react'
import WebUpload from './pages/WebUpload'
import Analyzing from './pages/Analyzing'
import Result from './pages/Result'
import './App.css'

type AppState = 'upload' | 'analyzing' | 'results'

function App() {
  const [appState, setAppState] = useState<AppState>('upload')

  const handleUpload = (file: File) => {
    console.log('File uploaded:', file)
    setAppState('analyzing')
    
    // 3초 후 결과 페이지로 전환 (추후 실제 API 호출로 대체)
    setTimeout(() => {
      setAppState('results')
      console.log('Analysis complete')
    }, 3000)
  }

  const handleReset = () => {
    setAppState('upload')
  }

  return (
    <>
      {appState === 'upload' && <WebUpload onUpload={handleUpload} />}
      {appState === 'analyzing' && <Analyzing />}
      {appState === 'results' && <Result onReset={handleReset} />}
    </>
  )
}

export default App
