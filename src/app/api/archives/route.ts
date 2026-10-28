import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const archives = await prisma.festivalArchive.findMany({
      orderBy: { year: "desc" },
    });
    return NextResponse.json(archives);
  } catch (error) {
    console.error("Public archives fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch archives." }, { status: 500 });
  }
}

