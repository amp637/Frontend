import axios from 'axios';

// 백엔드 베이스 URL (참고 App.tsx의 BACKEND 상수)
const BACKEND = import.meta.env.VITE_API_BASE_URL || 'https://sketchcheck.shop';

const api = axios.create({
  baseURL: BACKEND,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// axios 요청 시 JWT 자동 삽입 (참고 App.tsx의 axios.interceptors.request.use 로직)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwt');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

