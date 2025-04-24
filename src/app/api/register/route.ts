import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const { email, password, username } = await req.json();

    // Validate required fields
    if (!email || !password || !username) {
      return NextResponse.json({ 
        error: 'Email, password, and username are required' 
      }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ 
        error: 'Invalid email format' 
      }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }]
      }
    });

    if (existingUser) {
      return NextResponse.json({ 
        error: 'Email or username already taken' 
      }, { status: 409 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        walletBalance: 0,
        cosmicPoints: 0,
        cosmicRank: 'Novice',
        badges: [],
        verified: false,
        publicProfile: true,
        allowDMs: true,
        allowTagging: true
      }
    });

    // Create wallet for user
    await prisma.wallet.create({
      data: {
        userId: user.id,
        balance: 0,
        history: []
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Registration successful',
      user: {
        id: user.id,
        email: user.email,
        username: user.username
      }
    }, { status: 201 });

  } catch (error) {
    console.error('[REGISTER_ERROR]', error);
    return NextResponse.json({ 
      error: 'Registration failed' 
    }, { status: 500 });
  }
} 