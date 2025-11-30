// src/api/myuploads.ts
import api from "../lib/api";

// 백엔드 /myuploads API 응답 타입 (실제 백엔드 구조에 맞춤)
export interface MyUploadItem {
  id: number;
  user_id: string;
  s3_key: string;
  s3_url: string;
  predicted_label: string | null;
  confidence: number | null;
  score1: number;
  score2: number;
  score3: number;
  score4: number;
  created_at: string; // ISO date string (e.g., "2025-11-30T05:32:12")
  debug_image_url: string | null;
}

export const getMyUploads = async (): Promise<MyUploadItem[]> => {
  const res = await api.get("/myuploads");
  return res.data;
};
