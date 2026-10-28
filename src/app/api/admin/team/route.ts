import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";

// GET all team members (ordered)
export async function GET() {
  try {
    const team = await prisma.teamMember.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json(team);
  } catch (error) {
    console.error("Error fetching team members:", error);
    return NextResponse.json({ error: "Failed to fetch team members." }, { status: 500 });
  }
}

// POST create a team member
export async function POST(req: Request) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, role, bio, imageUrl, order } = await req.json();

    if (!name || !role) {
      return NextResponse.json(
        { error: "Name and role are required." },
        { status: 400 }
      );
    }

    // Determine default order if not provided
    let memberOrder = typeof order === "number" ? order : 0;
    if (order === undefined || order === null) {
      const highestOrder = await prisma.teamMember.findFirst({
        orderBy: { order: "desc" },
        select: { order: true },
      });
      memberOrder = (highestOrder?.order ?? -1) + 1;
    }

    const newMember = await prisma.teamMember.create({
      data: {
        name: name.trim(),
        role: role.trim(),
        bio: bio?.trim() || null,
        imageUrl: imageUrl?.trim() || null,
        order: memberOrder,
      },
    });

    return NextResponse.json(newMember, { status: 201 });
  } catch (error) {
    console.error("Error creating team member:", error);
    return NextResponse.json({ error: "Failed to create team member." }, { status: 500 });
  }
}

