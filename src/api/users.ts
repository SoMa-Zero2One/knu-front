import { User } from '@/types';

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

export interface UserProfile {
  id: string;
  nickname: string;
  grade: number;
  lang: string;
  applications: Array<{
    universityId: number;
    choice: number;
    universityName?: string;
    country?: string;
    slot?: number;
    totalApplicants?: number;
  }>;
}

export interface UserMeResponse {
  modifyCount: number;
}

export interface UpdateApplicationsRequest {
  applications: Array<{
    universityId: number;
    choice: number;
  }>;
}

export const usersAPI = {
  async getUserById(id: string): Promise<UserProfile> {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch user: ${response.status}`);
    }

    return response.json();
  },

  async getMe(): Promise<UserMeResponse> {
    const response = await fetch(`${API_BASE_URL}/users/me`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch user info: ${response.status}`);
    }

    return response.json();
  },

  async updateApplications(data: UpdateApplicationsRequest): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/users/me/applications`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to update applications: ${response.status}`);
    }
  },

  // 토큰을 직접 받는 버전 (서버 사이드용)
  async getUserByIdWithToken(id: string, token: string): Promise<UserProfile> {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      headers: getAuthHeadersWithToken(token),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch user: ${response.status}`);
    }

    return response.json();
  }
};