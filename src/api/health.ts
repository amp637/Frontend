import api from '../lib/api';

/**
 * 서버 상태 확인 (Health Check)
 * @returns Promise<{ status: string }>
 */
export const checkHealth = async () => {
  try {
    const response = await api.get('/health');
    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    console.error('Health check failed:', error);
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Server is not responding',
    };
  }
};

