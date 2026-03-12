import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth-utils';

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'LANDLORD') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { panNumber } = await req.json();

    // Mock API SETU PAN Verification
    // In production, use: fetch('https://apisetu.gov.in/pan/v1/verify', { ... })
    const isMockValid = panNumber.length === 10;

    if (isMockValid) {
      await prisma.landlordProfile.update({
        where: { userId: session.userId as string },
        data: {
          panNumber,
          isPanVerified: true
        }
      });

      await prisma.verificationLog.create({
        data: {
          targetId: session.userId as string,
          type: 'PAN',
          status: 'SUCCESS',
          details: `Verified PAN: ${panNumber}`
        }
      });

      return NextResponse.json({ success: true, message: 'PAN Verified Successfully' });
    }

    return NextResponse.json({ error: 'Invalid PAN Number' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
  }
}
