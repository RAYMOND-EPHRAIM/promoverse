import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: 'epharimray@gmail.com'
      },
      select: {
        id: true,
        username: true,
        verified: true,
        createdAt: true
      }
    });

    if (!user) {
      return NextResponse.json({ 
        exists: false,
        message: "This email is not registered. You should sign up first."
      });
    }

    return NextResponse.json({
      exists: true,
      username: user.username,
      verified: user.verified,
      message: "Email is registered. You can proceed with login."
    });

  } catch (error) {
    console.error('Error checking email:', error);
    return NextResponse.json({ error: 'Failed to check email status' }, { status: 500 });
  }
} 