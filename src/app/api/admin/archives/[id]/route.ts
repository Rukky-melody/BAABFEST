import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const json = await request.json();
    const archive = await prisma.festivalArchive.update({
      where: { id },
      data: {
        year: json.year,
        theme: json.theme,
        images: json.images,
        driveLink: json.driveLink,
      },
    });
    return NextResponse.json(archive);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update archive' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.festivalArchive.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete archive' },
      { status: 500 }
    );
  }
}
