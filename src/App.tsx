import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";

import Login from "./pages/Login";
import AuthCallback from "./pages/AuthCallback";
import WebUpload from "./pages/WebUpload";
import Analyzing from "./pages/Analyzing";
import Result from "./pages/Result";
import AccountPanel from "./components/AccountPanel";

import { uploadFile } from "./api/upload";
import { useAuthStore } from "./store/authStore";
import { logout as apiLogout } from "./api/auth";
import { getMyUploads } from "./api/myuploads";
import type { UploadResponseItem } from "./types/upload";

import "./App.css";
// -------------------------------
// Types
// -------------------------------
interface UploadHistory {
  id: string;
  fileName: string;
  uploadDate: Date;
  score: number;
}

function App() {
  const [isAccountPanelOpen, setIsAccountPanelOpen] = useState(false);
  const [uploadHistory, setUploadHistory] = useState<UploadHistory[]>([]);
  const [_, setTaskId] = useState<string | null>(null);
  const [__, setError] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  
  // Result 페이지에 전달할 업로드 결과 (백엔드 응답 전체)
  const [uploadResult, setUploadResult] = useState<UploadResponseItem | null>(null);

  const navigate = useNavigate();

  // Zustand - user 정보만 사용
  const { user, logout: storeLogout } = useAuthStore();

  // -------------------------------
  // 인증 판단 (단일 기준)
  // -------------------------------
  const hasJWT = !!localStorage.getItem("jwt");

  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (!hasJWT) return <Navigate to="/login" replace />;
    return <>{children}</>;
  };

  // -------------------------------
  // 프로필 첫 글자
  // -------------------------------
  const getUserInitial = () =>
    user?.name ? user.name.charAt(0).toUpperCase() : "U";

  // -------------------------------
  // 최초 로그인 시 서버 업로드 기록 가져오기
  // -------------------------------
  useEffect(() => {
    if (!hasJWT) return;

    const loadServerUploads = async () => {
      try {
        const serverData = await getMyUploads();

        const formatted: UploadHistory[] = serverData.map((item: any) => ({
          id: item.id,
          fileName: item.fileName,
          score: item.score,
          uploadDate: new Date(item.uploadDate),
        }));

        setUploadHistory(formatted);
      } catch (err) {
        console.error("서버 업로드 기록 불러오기 실패:", err);
      }
    };

    loadServerUploads();
  }, [hasJWT]);

  // -------------------------------
  // 로그아웃
  // -------------------------------
  const handleLogout = async () => {
    try {
      await apiLogout();
    } catch {}
    storeLogout();
    localStorage.removeItem("jwt");
    navigate("/login", { replace: true });
  };

  // -------------------------------
  // 업로드 처리
  // -------------------------------
  const handleUpload = async (file: File) => {
    setIsAnalyzing(true);
    setShowResults(false);
    setError(null);

    try {
      // /upload 호출 - 응답 배열의 첫 번째 요소를 반환받음
      const uploadRes = await uploadFile(file);
      
      console.log('📊 업로드 결과:', uploadRes);
      console.log('📊 점수:', uploadRes.score);
      console.log('📊 총 위반사항:', uploadRes.ai_result.analysis.summary.total_violations);
      
      // Task ID 저장 (필요한 경우)
      setTaskId(uploadRes.user_id);
      
      // 업로드 결과를 state에 저장
      setUploadResult(uploadRes);

      // 분석 완료 시뮬레이션 (백엔드에서 이미 분석 완료된 상태로 옴)
      setTimeout(() => {
        // 업로드 히스토리에 추가
        const newItem: UploadHistory = {
          id: uploadRes.user_id || Date.now().toString(),
          fileName: file.name,
          uploadDate: new Date(),
          score: uploadRes.score,
        };

        setUploadHistory((prev) => [newItem, ...prev]);
        setIsAnalyzing(false);
        setShowResults(true);
      }, 2000); // 2초 딜레이 (UI 전환용)
      
    } catch (err: any) {
      console.error('❌ 업로드 처리 실패:', err);
      setError("파일 업로드 오류");
      alert("업로드 중 오류 발생");
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setShowResults(false);
    setTaskId(null);
    setError(null);
    setUploadResult(null);
  };

  // -------------------------------
  // UI 렌더링
  // -------------------------------
  return (
    <>
      <Routes>
        {/* 로그인 */}
        <Route
          path="/login"
          element={hasJWT ? <Navigate to="/" replace /> : <Login />}
        />

        {/* OAuth Callback */}
        <Route path="/callback" element={<AuthCallback />} />

        {/* 메인 페이지 */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              {isAnalyzing ? (
                <Analyzing
                  userInitial={getUserInitial()}
                  onProfileClick={() => setIsAccountPanelOpen(true)}
                />
              ) : showResults ? (
                <Result
                  onReset={handleReset}
                  userInitial={getUserInitial()}
                  onProfileClick={() => setIsAccountPanelOpen(true)}
                  uploadResult={uploadResult}
                />
              ) : (
                <WebUpload
                  onUpload={handleUpload}
                  userInitial={getUserInitial()}
                  onProfileClick={() => setIsAccountPanelOpen(true)}
                />
              )}
            </ProtectedRoute>
          }
        />

        {/* 404 → 리다이렉트 */}
        <Route
          path="*"
          element={<Navigate to={hasJWT ? "/" : "/login"} replace />}
        />
      </Routes>

      {/* 계정 패널 */}
      {hasJWT && (
        <AccountPanel
          isOpen={isAccountPanelOpen}
          onClose={() => setIsAccountPanelOpen(false)}
          userName={user?.name || ""}
          userEmail={user?.email || ""}
          userInitial={getUserInitial()}
          uploadHistory={uploadHistory}
          onLogout={handleLogout}
        />
      )}
    </>
  );
}

export default App;
