import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Try to count users as a simple database test
    const userCount = await prisma.user.count();
    
    return NextResponse.json({ 
      status: 'connected',
      message: 'Database is connected',
      userCount 
    });
  } catch (error: any) {
    console.error('Database connection error:', error);
    return NextResponse.json({ 
      status: 'error',
      message: 'Database connection failed',
      error: error.message 
    }, { status: 500 });
  }
} 