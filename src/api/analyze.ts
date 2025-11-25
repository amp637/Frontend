import api from '../lib/api';

/**
 * 파일 업로드 및 분석 요청
 * @param file - 업로드할 파일 (이미지 또는 디자인 파일)
 * @returns Promise<분석 결과>
 */
export const analyzeFile = async (file: File) => {
  try {
    // FormData 생성
    const formData = new FormData();
    formData.append('file', file);
    
    // 추가 메타데이터가 필요한 경우
    // formData.append('options', JSON.stringify({ ... }));

    const response = await api.post('/analyze', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      // 업로드 진행률 추적 (선택사항)
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          console.log(`Upload progress: ${percentCompleted}%`);
        }
      },
    });

    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    console.error('File analysis failed:', error);
    
    // 에러 메시지 추출
    let errorMessage = 'Failed to analyze file';
    
    if (error.response) {
      // 서버에서 반환한 에러 메시지
      errorMessage = error.response.data?.message || error.response.data?.detail || errorMessage;
    } else if (error.request) {
      // 네트워크 에러
      errorMessage = 'Network error. Please check your connection.';
    } else {
      // 기타 에러
      errorMessage = error.message || errorMessage;
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
};

/**
 * 분석 상태 확인
 * @param taskId - 분석 작업 ID
 * @returns Promise<분석 상태>
 */
export const getAnalysisStatus = async (taskId: string) => {
  try {
    const response = await api.get(`/analyze/${taskId}/status`);
    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    console.error('Failed to get analysis status:', error);
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Failed to check status',
    };
  }
};

