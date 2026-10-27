import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const archives = await prisma.festivalArchive.findMany({
      orderBy: { year: 'desc' },
    });
    return NextResponse.json(archives);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch archives' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const archive = await prisma.festivalArchive.create({
      data: {
        year: json.year,
        theme: json.theme,
        images: json.images || [],
        driveLink: json.driveLink || null,
      },
    });
    return NextResponse.json(archive);
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'An archive for this year already exists' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to create archive' },
      { status: 500 }
    );
  }
}
