import { toast } from 'react-hot-toast';

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

async function handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'An error occurred');
  }
  const data = await response.json();
  return { data };
}

export const api = {
  // Promotions
  async getPromotions(params?: { category?: string; verse?: string }) {
    try {
      const queryString = params ? new URLSearchParams(params).toString() : '';
      const response = await fetch(`/api/promotions?${queryString}`);
      return handleResponse(response);
    } catch (error) {
      toast.error('Failed to fetch promotions');
      return { error: 'Failed to fetch promotions' };
    }
  },

  async createPromotion(formData: FormData) {
    try {
      const response = await fetch('/api/promotions', {
        method: 'POST',
        body: formData,
      });
      return handleResponse(response);
    } catch (error) {
      toast.error('Failed to create promotion');
      return { error: 'Failed to create promotion' };
    }
  },

  // Analytics
  async trackAnalytics(id: string, data: { type: 'view' | 'click'; verseId?: string; latitude?: number; longitude?: number }) {
    try {
      const response = await fetch(`/api/analytics/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return handleResponse(response);
    } catch (error) {
      console.warn('Analytics tracking failed:', error);
      return { error: 'Failed to track analytics' };
    }
  },

  async getAnalytics(id: string) {
    try {
      const response = await fetch(`/api/analytics/${id}`);
      return handleResponse(response);
    } catch (error) {
      console.warn('Failed to fetch analytics:', error);
      return { error: 'Failed to fetch analytics' };
    }
  },

  // Wallet
  async getWallet() {
    try {
      const response = await fetch('/api/wallet');
      return handleResponse(response);
    } catch (error) {
      toast.error('Failed to fetch wallet');
      return { error: 'Failed to fetch wallet' };
    }
  },

  async createTransaction(data: { amount: number; type: string }) {
    try {
      const response = await fetch('/api/wallet/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return handleResponse(response);
    } catch (error) {
      toast.error('Transaction failed');
      return { error: 'Transaction failed' };
    }
  },

  // Verses
  async getVerses() {
    try {
      const response = await fetch('/api/verses');
      return handleResponse(response);
    } catch (error) {
      toast.error('Failed to fetch verses');
      return { error: 'Failed to fetch verses' };
    }
  },
}; 