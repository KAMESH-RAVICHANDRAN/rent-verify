import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { phone } = await req.json();
    
    if (!phone || phone.length !== 10) {
      return NextResponse.json({ error: 'Invalid phone number' }, { status: 400 });
    }

    // In a real app, integrate with an SMS gateway like Twilio or Firebase Auth
    // For this production-ready prototype, we'll mock the OTP sending
    console.log(`[MOCK OTP] Sending 123456 to +91${phone}`);

    return NextResponse.json({ success: true, message: 'OTP sent successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
