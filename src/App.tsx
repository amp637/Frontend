import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";

import Login from "./pages/Login";
import AuthCallback from "./pages/AuthCallback";
import WebUpload from "./pages/WebUpload";
import Analyzing from "./pages/Analyzing";
import Result from "./pages/Result";
import AccountPanel from "./components/AccountPanel";

import { uploadFile } from "./api/upload";
import { getScore } from "./api/returnScore";
import { useAuthStore } from "./store/authStore";
import { logout as apiLogout } from "./api/auth";
import { getMyUploads } from "./api/myuploads";

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
      const uploadRes = await uploadFile(file);
      const newTaskId = uploadRes?.task_id;
      setTaskId(newTaskId);

      // 3초 후 점수 조회
      setTimeout(async () => {
        try {
          const scoreRes = await getScore();

          const newItem: UploadHistory = {
            id: newTaskId || Date.now().toString(),
            fileName: file.name,
            uploadDate: new Date(),
            score: scoreRes?.score ?? 0,
          };

          setUploadHistory((prev) => [newItem, ...prev]);
          setShowResults(true);
        } catch {
          setError("점수 조회 실패");
          alert("점수 조회 실패");
        }
        setIsAnalyzing(false);
      }, 3000);
    } catch (err) {
      setError("파일 업로드 오류");
      alert("업로드 중 오류 발생");
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setShowResults(false);
    setTaskId(null);
    setError(null);
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
