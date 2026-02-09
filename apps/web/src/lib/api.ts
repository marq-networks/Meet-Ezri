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

  // Emergency Contacts API
  emergencyContacts: {
    async getAll() {
      const headers = await getHeaders();
      const res = await fetch(`${API_URL}/emergency-contacts`, {
        method: 'GET',
        headers,
        cache: 'no-store',
      });
      return handleResponse(res, 'Failed to fetch emergency contacts');
    },

    async create(data: { name: string; relationship?: string; phone?: string; email?: string; is_trusted?: boolean }) {
      const headers = await getHeaders();
      const res = await fetch(`${API_URL}/emergency-contacts`, {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
      });
      return handleResponse(res, 'Failed to create emergency contact');
    },

    async update(id: string, data: { name?: string; relationship?: string; phone?: string; email?: string; is_trusted?: boolean }) {
      const headers = await getHeaders();
      const res = await fetch(`${API_URL}/emergency-contacts/${id}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(data),
      });
      return handleResponse(res, 'Failed to update emergency contact');
    },

    async delete(id: string) {
      const headers = await getHeaders();
      const res = await fetch(`${API_URL}/emergency-contacts/${id}`, {
        method: 'DELETE',
        headers,
      });
      if (!res.ok) {
         // handleResponse typically expects JSON, but 204 No Content has no body
         if (res.status === 204) return;
         const errorData = await res.json().catch(() => ({}));
         throw new Error(errorData.message || 'Failed to delete emergency contact');
      }
      return;
    }
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
        cache: 'no-store',
      });
      return handleResponse(res, 'Failed to fetch sessions');
    },

    async get(id: string) {
      const headers = await getHeaders();
      const res = await fetch(`${API_URL}/sessions/${id}`, {
        method: 'GET',
        headers,
        cache: 'no-store',
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

    async getUserSessions(userId: string) { // Admin only
      const headers = await getHeaders();
      const res = await fetch(`${API_URL}/sessions/admin/users/${userId}/sessions`, {
        method: 'GET',
        headers,
        cache: 'no-store',
      });
      return handleResponse(res, 'Failed to fetch user sessions');
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
    },

    async getUserMoods(userId: string) { // Admin only
      const headers = await getHeaders();
      const res = await fetch(`${API_URL}/moods/admin/users/${userId}/moods`, {
        method: 'GET',
        headers,
        cache: 'no-store',
      });
      return handleResponse(res, 'Failed to fetch user moods');
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
    },

    async getUsers() {
      const headers = await getHeaders();
      const res = await fetch(`${API_URL}/admin/users`, {
        method: 'GET',
        headers,
        cache: 'no-store',
      });
      return handleResponse(res, 'Failed to fetch users');
    },

    async getUserProfile(userId: string) {
      const headers = await getHeaders();
      const res = await fetch(`${API_URL}/admin/users/${userId}`, {
        method: 'GET',
        headers,
        cache: 'no-store',
      });
      return handleResponse(res, 'Failed to fetch user profile');
    },

    async updateUser(userId: string, data: { status?: string; role?: string }) {
      const headers = await getHeaders();
      const res = await fetch(`${API_URL}/admin/users/${userId}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(data),
      });
      return handleResponse(res, 'Failed to update user');
    },

    async deleteUser(userId: string) {
      const headers = await getHeaders();
      const res = await fetch(`${API_URL}/admin/users/${userId}`, {
        method: 'DELETE',
        headers,
      });
      return handleResponse(res, 'Failed to delete user');
    },

    async getUserAuditLogs(userId: string) {
      const headers = await getHeaders();
      const res = await fetch(`${API_URL}/admin/users/${userId}/audit-logs`, {
        method: 'GET',
        headers,
        cache: 'no-store',
      });
      return handleResponse(res, 'Failed to fetch user audit logs');
    }
  },

  // Journal API
  journal: {
    async create(data: { title?: string; content?: string; mood_tags?: string[]; is_private?: boolean; location?: string }) {
      const headers = await getHeaders();
      const res = await fetch(`${API_URL}/journal`, {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
      });
      return handleResponse(res, 'Failed to create journal entry');
    },

    async getAll() {
      const headers = await getHeaders();
      const res = await fetch(`${API_URL}/journal`, {
        method: 'GET',
        headers,
      });
      return handleResponse(res, 'Failed to fetch journal entries');
    },

    async getById(id: string) {
      const headers = await getHeaders();
      const res = await fetch(`${API_URL}/journal/${id}`, {
        method: 'GET',
        headers,
      });
      return handleResponse(res, 'Failed to fetch journal entry');
    },

    async update(id: string, data: { title?: string; content?: string; mood_tags?: string[]; is_private?: boolean; location?: string }) {
      const headers = await getHeaders();
      const res = await fetch(`${API_URL}/journal/${id}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(data),
      });
      return handleResponse(res, 'Failed to update journal entry');
    },

    async delete(id: string) {
      const headers = await getHeaders();
      const res = await fetch(`${API_URL}/journal/${id}`, {
        method: 'DELETE',
        headers,
      });
      if (res.status === 204) return true;
      return handleResponse(res, 'Failed to delete journal entry');
    },

    async getUserJournals(userId: string) { // Admin only
      const headers = await getHeaders();
      const res = await fetch(`${API_URL}/journal/admin/users/${userId}/journals`, {
        method: 'GET',
        headers,
        cache: 'no-store',
      });
      return handleResponse(res, 'Failed to fetch user journals');
    }
  },

  // Billing API
  billing: {
    async getSubscription() {
      const headers = await getHeaders();
      const res = await fetch(`${API_URL}/billing`, {
        method: 'GET',
        headers,
        cache: 'no-store',
      });
      return handleResponse(res, 'Failed to fetch subscription');
    },

    async createSubscription(data: { plan_type: 'free' | 'pro' | 'enterprise'; billing_cycle?: 'monthly' | 'yearly'; payment_method?: string }) {
      const headers = await getHeaders();
      const res = await fetch(`${API_URL}/billing`, {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
      });
      return handleResponse(res, 'Failed to create subscription');
    },

    async updateSubscription(data: { plan_type?: 'free' | 'pro' | 'enterprise'; billing_cycle?: 'monthly' | 'yearly' }) {
      const headers = await getHeaders();
      const res = await fetch(`${API_URL}/billing`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(data),
      });
      return handleResponse(res, 'Failed to update subscription');
    },

    async cancelSubscription() {
      const headers = await getHeaders();
      const res = await fetch(`${API_URL}/billing/cancel`, {
        method: 'POST',
        headers,
      });
      return handleResponse(res, 'Failed to cancel subscription');
    },

    async getHistory() {
      const headers = await getHeaders();
      const res = await fetch(`${API_URL}/billing/history`, {
        method: 'GET',
        headers,
        cache: 'no-store',
      });
      return handleResponse(res, 'Failed to fetch billing history');
    },

    async getAllSubscriptions() { // Admin only
      const headers = await getHeaders();
      const res = await fetch(`${API_URL}/billing/admin/subscriptions`, {
        method: 'GET',
        headers,
        cache: 'no-store',
      });
      return handleResponse(res, 'Failed to fetch all subscriptions');
    },

    async updateSubscriptionById(id: string, data: { plan_type?: 'free' | 'pro' | 'enterprise'; billing_cycle?: 'monthly' | 'yearly'; status?: string }) { // Admin only
      const headers = await getHeaders();
      const res = await fetch(`${API_URL}/billing/admin/subscriptions/${id}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(data),
      });
      return handleResponse(res, 'Failed to update subscription');
    },

    async getUserSubscription(userId: string) { // Admin only
      const headers = await getHeaders();
      const res = await fetch(`${API_URL}/billing/admin/users/${userId}/subscription`, {
        method: 'GET',
        headers,
        cache: 'no-store',
      });
      return handleResponse(res, 'Failed to fetch user subscription');
    }
  },

  // Wellness Tools API
  wellness: {
    async getAll(category?: string) {
      const headers = await getHeaders();
      const query = category ? `?category=${category}` : '';
      const res = await fetch(`${API_URL}/wellness${query}`, {
        method: 'GET',
        headers,
      });
      return handleResponse(res, 'Failed to fetch wellness tools');
    },

    async getById(id: string) {
      const headers = await getHeaders();
      const res = await fetch(`${API_URL}/wellness/${id}`, {
        method: 'GET',
        headers,
      });
      return handleResponse(res, 'Failed to fetch wellness tool');
    },

    async create(data: any) {
      const headers = await getHeaders();
      const res = await fetch(`${API_URL}/wellness`, {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
      });
      return handleResponse(res, 'Failed to create wellness tool');
    },

    async update(id: string, data: any) {
      const headers = await getHeaders();
      const res = await fetch(`${API_URL}/wellness/${id}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(data),
      });
      return handleResponse(res, 'Failed to update wellness tool');
    },

    async delete(id: string) {
      const headers = await getHeaders();
      const res = await fetch(`${API_URL}/wellness/${id}`, {
        method: 'DELETE',
        headers,
      });
      if (res.status === 204) return true;
      return handleResponse(res, 'Failed to delete wellness tool');
    }
  },

  // Sleep API
  sleep: {
    async getEntries() {
      const headers = await getHeaders();
      const res = await fetch(`${API_URL}/sleep`, {
        method: 'GET',
        headers,
      });
      return handleResponse(res, 'Failed to fetch sleep entries');
    },

    async createEntry(data: { bed_time: string; wake_time: string; quality_rating?: number; factors?: string[]; notes?: string }) {
      const headers = await getHeaders();
      const res = await fetch(`${API_URL}/sleep`, {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
      });
      return handleResponse(res, 'Failed to create sleep entry');
    },

    async getUserEntries(userId: string) { // Admin only
      const headers = await getHeaders();
      const res = await fetch(`${API_URL}/sleep/admin/users/${userId}/sleep`, {
        method: 'GET',
        headers,
        cache: 'no-store',
      });
      return handleResponse(res, 'Failed to fetch user sleep entries');
    }
  },

  // Habits API
  habits: {
    async getAll() {
      const headers = await getHeaders();
      const res = await fetch(`${API_URL}/habits`, {
        method: 'GET',
        headers,
      });
      return handleResponse(res, 'Failed to fetch habits');
    },

    async create(data: { name: string; category?: string; frequency?: 'daily' | 'weekly'; color?: string; icon?: string }) {
      const headers = await getHeaders();
      const res = await fetch(`${API_URL}/habits`, {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
      });
      return handleResponse(res, 'Failed to create habit');
    },

    async update(id: string, data: { name?: string; category?: string; frequency?: 'daily' | 'weekly'; color?: string; icon?: string }) {
      const headers = await getHeaders();
      const res = await fetch(`${API_URL}/habits/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(data),
      });
      return handleResponse(res, 'Failed to update habit');
    },

    async delete(id: string) {
      const headers = await getHeaders();
      const res = await fetch(`${API_URL}/habits/${id}`, {
        method: 'DELETE',
        headers,
      });
      if (res.status === 204) return true;
      return handleResponse(res, 'Failed to delete habit');
    },

    async complete(id: string, date?: string) {
      const headers = await getHeaders();
      const res = await fetch(`${API_URL}/habits/${id}/complete`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ completed_at: date }),
      });
      return handleResponse(res, 'Failed to complete habit');
    },

    async uncomplete(id: string, date: string) {
      const headers = await getHeaders();
      const res = await fetch(`${API_URL}/habits/${id}/complete?date=${date}`, {
        method: 'DELETE',
        headers,
      });
      return handleResponse(res, 'Failed to uncomplete habit');
    },

    async getUserHabits(userId: string) { // Admin only
      const headers = await getHeaders();
      const res = await fetch(`${API_URL}/habits/admin/users/${userId}/habits`, {
        method: 'GET',
        headers,
        cache: 'no-store',
      });
      return handleResponse(res, 'Failed to fetch user habits');
    }
  }
};
