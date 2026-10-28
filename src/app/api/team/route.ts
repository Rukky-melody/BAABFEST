import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const team = await prisma.teamMember.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json(team);
  } catch (error) {
    console.error("Public team fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch team." }, { status: 500 });
  }
}

