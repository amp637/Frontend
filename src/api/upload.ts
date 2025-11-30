import api from '../lib/api';
import type { UploadResponse, UploadResponseItem } from '../types/upload';

export const uploadFile = async (file: File): Promise<UploadResponseItem> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    console.log('📤 업로드 요청 시작:', file.name);
    
    const response = await api.post<UploadResponse>('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    console.log('✅ 업로드 성공:', response.data);
    
    // 응답은 배열이므로 첫 번째 요소를 반환
    const result = response.data[0];
    
    if (!result) {
      throw new Error('업로드 응답이 비어있습니다.');
    }
    
    return result;
  } catch (err: any) {
    if (err.response) {
      const data = err.response.data;
      const dataStr = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
      console.error(`❌ 업로드 실패 [${err.response.status}]:`, dataStr);
    } else {
      console.error('❌ 업로드 실패 (네트워크 에러):', err.message);
    }
    throw err;
  }
};

