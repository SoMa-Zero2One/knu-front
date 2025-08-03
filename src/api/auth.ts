const API_BASE_URL = 'https://api.knu.soma.wibaek.com';

export interface LoginResponse {
  accessToken: string;
  token_type: string;
  id: string;
  nickname: string;
}

export const authAPI = {
  async loginWithUUID(uuid: string): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ uuid }),
    });
    
    if (!response.ok) {
      throw new Error(`Authentication failed: ${response.status}`);
    }
    
    return response.json();
  }
};