import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createToken } from '@/lib/auth-utils';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    const { phone, otp } = await req.json();

    // Mock OTP verification
    if (otp !== '123456') {
      return NextResponse.json({ error: 'Invalid OTP' }, { status: 400 });
    }

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { phone },
    });

    if (!user) {
      // Create user with default role (will be updated in next step)
      user = await prisma.user.create({
        data: {
          phone,
          name: 'New User',
          role: 'TENANT', // Default
        },
      });
    }

    const token = await createToken({
      userId: user.id,
      phone: user.phone,
      role: user.role,
    });

    const cookieStore = await cookies();
    cookieStore.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 hours
    });

    return NextResponse.json({ 
      success: true, 
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    console.error('Auth Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
