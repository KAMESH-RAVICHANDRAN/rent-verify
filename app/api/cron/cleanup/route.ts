import { NextResponse } from 'next/server';
import { cleanupExpiredDocuments } from '@/lib/cleanup';

export async function POST(req: Request) {
  // In production, protect this endpoint with a secret key or internal IP check
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const result = await cleanupExpiredDocuments();
  return NextResponse.json(result);
}
