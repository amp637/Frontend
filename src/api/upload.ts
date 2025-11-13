import api from '../lib/api';

export const uploadFile = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    console.log('📤 업로드 요청 시작:', file.name);
    
    const response = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    console.log('✅ 업로드 성공:', response.data);
    return response.data;
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

// 사용 예시:
// const handleUpload = async (file: File) => {
//   try {
//     const result = await uploadFile(file);
//     console.log('업로드 결과:', result);
//   } catch (error) {
//     console.error('업로드 처리 중 에러:', error);
//   }
// };

