import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [campaigns, totalActive, subscribedCount, welcomedCount] = await Promise.all([
      prisma.campaign
        ? prisma.campaign.findMany({ orderBy: { createdAt: "desc" } }).catch(() => [])
        : Promise.resolve([]),
      prisma.subscriber.count({
        where: {
          status: { in: ["SUBSCRIBED", "WELCOMED"] },
        },
      }),
      prisma.subscriber.count({
        where: { status: "SUBSCRIBED" },
      }),
      prisma.subscriber.count({
        where: { status: "WELCOMED" },
      }),
    ]);

    return NextResponse.json({
      campaigns,
      audience: {
        total: totalActive,
        subscribed: subscribedCount,
        welcomed: welcomedCount,
      },
    });
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    return NextResponse.json(
      { error: "Failed to fetch campaigns and audience." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { subject, previewText, heading, message, ctaText, ctaUrl } = body;

    if (!subject || !heading || !message) {
      return NextResponse.json(
        { error: "Subject, Heading, and Message are required." },
        { status: 400 }
      );
    }

    const campaign = await prisma.campaign.create({
      data: {
        subject: subject.trim(),
        previewText: previewText?.trim() || null,
        heading: heading.trim(),
        message: message.trim(),
        ctaText: ctaText?.trim() || null,
        ctaUrl: ctaUrl?.trim() || null,
        status: "DRAFT",
      },
    });

    return NextResponse.json({ success: true, campaign });
  } catch (error) {
    console.error("Error creating campaign draft:", error);
    return NextResponse.json(
      { error: "Failed to create campaign." },
      { status: 500 }
    );
  }
}

