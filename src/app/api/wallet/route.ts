// src/app/api/wallet/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    // Allow access for admin (epharimray@gmail.com) without session
    if (!session?.user && process.env.NODE_ENV === 'development') {
      // Return mock data for admin in development
      return NextResponse.json({
        balance: 10000,
        transactions: [
          {
            id: '1',
            amount: 10000,
            type: 'DEPOSIT',
            description: 'Initial admin balance for epharimray@gmail.com',
            createdAt: new Date().toISOString(),
          },
        ],
      });
    }

    // If user is logged in and is admin (epharimray@gmail.com)
    if (session?.user?.email === 'epharimray@gmail.com') {
      // Get admin user with wallet and transactions
      const adminUser = await prisma.user.findUnique({
        where: { email: 'epharimray@gmail.com' },
        include: {
          wallet: true,
          transactions: {
            orderBy: {
              createdAt: 'desc',
            },
            take: 10,
          },
        },
      });

      if (!adminUser) {
        // If admin user doesn't exist, return mock data
        return NextResponse.json({
          balance: 10000,
          transactions: [
            {
              id: '1',
              amount: 10000,
              type: 'DEPOSIT',
              description: 'Initial admin balance for epharimray@gmail.com',
              createdAt: new Date().toISOString(),
            },
          ],
        });
      }

      const balance = adminUser.wallet?.balance || adminUser.walletBalance;
      return NextResponse.json({
        balance,
        transactions: adminUser.transactions,
      });
    }

    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Get regular user with wallet and transactions
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        wallet: true,
        transactions: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 10,
        },
      },
    });

    if (!user) {
      return new NextResponse('User not found', { status: 404 });
    }

    const balance = user.wallet?.balance || user.walletBalance;
    return NextResponse.json({
      balance,
      transactions: user.transactions,
    });
  } catch (error) {
    console.error('Error in wallet route:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
