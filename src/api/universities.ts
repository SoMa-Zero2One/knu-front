import { University, UniversityDetail } from '@/types';

const API_BASE_URL = 'https://api.knu.soma.wibaek.com';

const getAuthHeaders = () => {
  const token = localStorage.getItem('auth_token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

const getAuthHeadersWithToken = (token: string) => {
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

export const universitiesAPI = {
  async getUniversities(): Promise<University[]> {
    const response = await fetch(`${API_BASE_URL}/universities`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch universities: ${response.status}`);
    }

    return response.json();
  },

  async getUniversityById(id: string): Promise<UniversityDetail> {
    const response = await fetch(`${API_BASE_URL}/universities/${id}`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`${response.status}: Failed to fetch university`);
    }

    return response.json();
  },

  // 토큰을 직접 받는 버전 (서버 사이드용)
  async getUniversityByIdWithToken(id: string, token: string): Promise<UniversityDetail> {
    const response = await fetch(`${API_BASE_URL}/universities/${id}`, {
      headers: getAuthHeadersWithToken(token),
    });

    if (!response.ok) {
      throw new Error(`${response.status}: Failed to fetch university`);
    }

    return response.json();
  },

  async getUniversitiesWithToken(token: string): Promise<University[]> {
    const response = await fetch(`${API_BASE_URL}/universities`, {
      headers: getAuthHeadersWithToken(token),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch universities: ${response.status}`);
    }

    return response.json();
  }
};