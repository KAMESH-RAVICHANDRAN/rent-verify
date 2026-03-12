import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth-utils';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const pincode = searchParams.get('pincode');
    const houseType = searchParams.get('houseType');
    const minRent = searchParams.get('minRent');
    const maxRent = searchParams.get('maxRent');
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');
    const radius = searchParams.get('radius') || '10'; // Default 10km

    const where: any = {};
    if (pincode) where.pincode = pincode;
    if (houseType) where.houseType = houseType;
    if (minRent || maxRent) {
      where.rent = {
        gte: minRent ? parseFloat(minRent) : undefined,
        lte: maxRent ? parseFloat(maxRent) : undefined,
      };
    }

    // Basic coordinate filtering if lat/lng provided
    // In a real production app with PostGIS, we'd use ST_DWithin
    // Here we use a simple bounding box for the prototype
    if (lat && lng) {
      const latitude = parseFloat(lat);
      const longitude = parseFloat(lng);
      const r = parseFloat(radius) / 111; // Approx conversion km to degrees

      where.latitude = {
        gte: latitude - r,
        lte: latitude + r,
      };
      where.longitude = {
        gte: longitude - r,
        lte: longitude + r,
      };
    }

    const properties = await prisma.property.findMany({
      where,
      include: {
        images: true,
        landlord: {
          include: {
            user: {
              select: { name: true, isVerified: true }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(properties);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch properties' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'LANDLORD') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();
    
    const property = await prisma.property.create({
      data: {
        landlordId: session.userId as string,
        address: data.address,
        pincode: data.pincode,
        rent: parseFloat(data.rent),
        houseType: data.houseType,
        ebBillNumber: data.ebBillNumber,
        description: data.description,
        videoUrl: data.videoUrl,
        images: {
          create: data.images.map((url: string) => ({ url }))
        }
      }
    });

    return NextResponse.json(property);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create property' }, { status: 500 });
  }
}
