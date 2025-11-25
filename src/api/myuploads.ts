// src/api/myuploads.ts
import api from "../lib/api";

export interface UploadItem {
  id: string; // 백엔드에서 주는 고유 ID
  fileName: string; // 업로드 파일 이름
  score: number; // 분석 점수
  uploadDate: string; // ISO date string
}

export const getMyUploads = async (): Promise<UploadItem[]> => {
  const res = await api.get("/myuploads");
  return res.data;
};
