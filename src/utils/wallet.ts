import { apiPost, apiPut } from './api';

interface WalletTransaction {
  id: string;
  userId: string;
  amount: number;
  type: 'DEPOSIT' | 'WITHDRAW' | 'BOOST' | 'STAR';
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  createdAt: string;
}

interface BoostTransaction extends WalletTransaction {
  postId: string;
  boostLevel: number;
}

interface StarTransaction extends WalletTransaction {
  postId: string;
}

export async function depositFunds(amount: number) {
  return apiPost<WalletTransaction>('/api/wallet/deposit', { amount });
}

export async function withdrawFunds(amount: number) {
  return apiPost<WalletTransaction>('/api/wallet/withdraw', { amount });
}

export async function boostPost(postId: string, level: number) {
  return apiPost<BoostTransaction>('/api/wallet/boost', {
    postId,
    level,
  });
}

export async function starPost(postId: string) {
  return apiPost<StarTransaction>('/api/wallet/star', {
    postId,
  });
}

export async function getWalletBalance() {
  return apiPost<{ balance: number }>('/api/wallet/balance', {});
}

export async function getTransactionHistory() {
  return apiPost<WalletTransaction[]>('/api/wallet/history', {});
} 