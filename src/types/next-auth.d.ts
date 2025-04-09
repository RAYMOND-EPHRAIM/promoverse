import 'next-auth';
import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      username: string;
      walletBalance: number;
      cosmicPoints: number;
      cosmicRank: string;
    } & DefaultSession['user'];
  }

  interface User {
    id: string;
    username: string;
    walletBalance: number;
    cosmicPoints: number;
    cosmicRank: string;
  }
} 