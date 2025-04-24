import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const count = await prisma.user.count();
    return NextResponse.json({ userCount: count });
  } catch (error) {
    console.error('Error connecting to database:', error);
    return NextResponse.json({ error: 'Database connection error' }, { status: 500 });
  }
} 