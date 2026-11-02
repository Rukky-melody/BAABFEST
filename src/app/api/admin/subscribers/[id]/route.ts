import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

// DELETE a subscriber
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized. Please log in." }, { status: 401 });
    }

    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: "Subscriber ID is required." }, { status: 400 });
    }

    const subscriber = await prisma.subscriber.findUnique({
      where: { id },
    });

    if (!subscriber) {
      return NextResponse.json({ error: "Subscriber not found." }, { status: 404 });
    }

    await prisma.subscriber.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: `Subscriber ${subscriber.email} removed successfully.`,
    });
  } catch (error: any) {
    console.error("Error deleting subscriber:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to delete subscriber." },
      { status: 500 }
    );
  }
}

