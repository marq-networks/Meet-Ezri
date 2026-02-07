import { supabase } from './supabase';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

async function getHeaders() {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;

  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function handleResponse(res: Response, defaultErrorMessage: string) {
  if (res.status === 401) {
    // Session is invalid/expired on the server side
    await supabase.auth.signOut();
    throw new Error('Session expired. Please login again.');
  }

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || defaultErrorMessage);
  }

  return res.json();
}

export const api = {
  async getMe() {
    const headers = await getHeaders();
    const res = await fetch(`${API_URL}/users/me`, {
      method: 'GET',
      headers,
      cache: 'no-store',
    });
    
    if (res.status === 404) {
      throw new Error('Profile not found');
    }
    
    return handleResponse(res, 'Failed to fetch user profile');
  },

  async initProfile() {
    const headers = await getHeaders();
    const res = await fetch(`${API_URL}/users/init`, {
      method: 'POST',
      headers,
      body: JSON.stringify({}),
    });
    return handleResponse(res, 'Failed to initialize profile');
  },

  async updateProfile(data: any) {
    const headers = await getHeaders();
    const res = await fetch(`${API_URL}/users/me`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(data),
    });
    return handleResponse(res, 'Failed to update profile');
  },

  async completeOnboarding(data: any) {
    const headers = await getHeaders();
    const res = await fetch(`${API_URL}/users/onboarding`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });
    return handleResponse(res, 'Failed to complete onboarding');
  },

  async deleteAccount() {
    const headers = await getHeaders();
    const res = await fetch(`${API_URL}/users/me`, {
      method: 'DELETE',
      headers,
    });
    
    return handleResponse(res, 'Failed to delete account');
  },

  async sendEmail(to: string, subject: string, html: string, text?: string) {
    const headers = await getHeaders();
    const res = await fetch(`${API_URL}/email/send`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ to, subject, html, text }),
    });
    
    return handleResponse(res, 'Failed to send email');
  },

  async getSettings() {
    const headers = await getHeaders();
    const res = await fetch(`${API_URL}/settings`, {
      method: 'GET',
      headers,
    });
    return handleResponse(res, 'Failed to fetch settings');
  },

  async getCredits() {
    const headers = await getHeaders();
    const res = await fetch(`${API_URL}/user/credits`, {
      method: 'GET',
      headers,
    });
    return handleResponse(res, 'Failed to fetch credits');
  },

  async updateSetting(key: string, value: any, description?: string) {
    const headers = await getHeaders();
    const res = await fetch(`${API_URL}/settings`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ key, value, description }),
    });
    return handleResponse(res, 'Failed to update setting');
  },

  // Sessions API
  sessions: {
    async create(data: { type: 'instant' | 'scheduled'; duration_minutes: number; scheduled_at?: string; config?: any }) {
      const headers = await getHeaders();
      const res = await fetch(`${API_URL}/sessions`, {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
      });
      return handleResponse(res, 'Failed to create session');
    },

    async schedule(data: { duration_minutes: number; scheduled_at: string; config?: any }) {
      const headers = await getHeaders();
      const res = await fetch(`${API_URL}/sessions/schedule`, {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
      });
      return handleResponse(res, 'Failed to schedule session');
    },

    async list(params?: { status?: string }) {
      const headers = await getHeaders();
      const query = params ? '?' + new URLSearchParams(params).toString() : '';
      const res = await fetch(`${API_URL}/sessions${query}`, {
        method: 'GET',
        headers,
      });
      return handleResponse(res, 'Failed to fetch sessions');
    },

    async get(id: string) {
      const headers = await getHeaders();
      const res = await fetch(`${API_URL}/sessions/${id}`, {
        method: 'GET',
        headers,
      });
      return handleResponse(res, 'Failed to fetch session details');
    },

    async end(id: string, durationSeconds?: number) {
      const headers = await getHeaders();
      const res = await fetch(`${API_URL}/sessions/${id}/end`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ duration_seconds: durationSeconds }),
      });
      return handleResponse(res, 'Failed to end session');
    },

    async addMessage(id: string, role: 'user' | 'assistant' | 'system', content: string) {
      const headers = await getHeaders();
      const res = await fetch(`${API_URL}/sessions/${id}/messages`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ role, content }),
      });
      return handleResponse(res, 'Failed to add message');
    },

    async getTranscript(id: string) {
      const headers = await getHeaders();
      const res = await fetch(`${API_URL}/sessions/${id}/transcript`, {
        method: 'GET',
        headers,
      });
      return handleResponse(res, 'Failed to fetch transcript');
    },
  },

  // Moods API
  moods: {
    async create(data: { mood: string; intensity: number; activities: string[]; notes?: string }) {
      const headers = await getHeaders();
      const res = await fetch(`${API_URL}/moods`, {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
      });
      return handleResponse(res, 'Failed to create mood entry');
    },

    async getMyMoods() {
      const headers = await getHeaders();
      const res = await fetch(`${API_URL}/moods`, {
        method: 'GET',
        headers,
        cache: 'no-store',
      });
      return handleResponse(res, 'Failed to fetch mood history');
    },

    async getAllMoods() { // Admin only
      const headers = await getHeaders();
      const res = await fetch(`${API_URL}/moods/admin`, {
        method: 'GET',
        headers,
        cache: 'no-store',
      });
      return handleResponse(res, 'Failed to fetch all mood entries');
    }
  },

  // Admin API
  admin: {
    async getStats() {
      const headers = await getHeaders();
      const res = await fetch(`${API_URL}/admin/stats`, {
        method: 'GET',
        headers,
        cache: 'no-store',
      });
      return handleResponse(res, 'Failed to fetch admin stats');
    }
  }
};
