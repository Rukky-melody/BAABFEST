import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import {
  sendTransactionalEmail,
  getCampaignEmailHTML,
  getCampaignEmailText,
} from "@/lib/brevo";

export const dynamic = "force-dynamic";

// Simple sleep helper to avoid overwhelming API rate limits
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { campaignId, subject, previewText, heading, message, ctaText, ctaUrl } = body;

    let campaign = null;

    if (campaignId) {
      campaign = await prisma.campaign.findUnique({
        where: { id: campaignId },
      });
    }

    const finalSubject = subject?.trim() || campaign?.subject;
    const finalHeading = heading?.trim() || campaign?.heading;
    const finalMessage = message?.trim() || campaign?.message;
    const finalPreviewText = previewText !== undefined ? previewText?.trim() : campaign?.previewText;
    const finalCtaText = ctaText !== undefined ? ctaText?.trim() : campaign?.ctaText;
    const finalCtaUrl = ctaUrl !== undefined ? ctaUrl?.trim() : campaign?.ctaUrl;

    if (!finalSubject || !finalHeading || !finalMessage) {
      return NextResponse.json(
        { error: "Subject, Heading, and Message are required to send a campaign." },
        { status: 400 }
      );
    }

    // Fetch all active subscribers (both SUBSCRIBED and WELCOMED)
    const subscribers = await prisma.subscriber.findMany({
      where: {
        status: { in: ["SUBSCRIBED", "WELCOMED"] },
      },
      select: {
        id: true,
        email: true,
        status: true,
      },
    });

    if (subscribers.length === 0) {
      return NextResponse.json(
        { error: "No active subscribers found in the database to broadcast to." },
        { status: 400 }
      );
    }

    // Create or update campaign record in database
    if (!campaign) {
      campaign = await prisma.campaign.create({
        data: {
          subject: finalSubject,
          previewText: finalPreviewText || null,
          heading: finalHeading,
          message: finalMessage,
          ctaText: finalCtaText || null,
          ctaUrl: finalCtaUrl || null,
          recipientCount: subscribers.length,
          status: "SENDING",
        },
      });
    } else {
      campaign = await prisma.campaign.update({
        where: { id: campaign.id },
        data: {
          subject: finalSubject,
          previewText: finalPreviewText || null,
          heading: finalHeading,
          message: finalMessage,
          ctaText: finalCtaText || null,
          ctaUrl: finalCtaUrl || null,
          recipientCount: subscribers.length,
          status: "SENDING",
        },
      });
    }

    // Pre-generate HTML and plain text
    const htmlContent = getCampaignEmailHTML({
      heading: finalHeading,
      message: finalMessage,
      previewText: finalPreviewText,
      ctaText: finalCtaText,
      ctaUrl: finalCtaUrl,
    });

    const textContent = getCampaignEmailText({
      heading: finalHeading,
      message: finalMessage,
      ctaText: finalCtaText,
      ctaUrl: finalCtaUrl,
    });

    let sentCount = 0;
    let failedCount = 0;
    const errors: string[] = [];

    // Send emails sequentially with small delay to ensure high delivery rate
    for (const sub of subscribers) {
      try {
        const result = await sendTransactionalEmail({
          to: sub.email,
          subject: finalSubject,
          htmlContent,
          textContent,
        });

        if (result.success) {
          sentCount++;
        } else {
          failedCount++;
          if (result.error && !errors.includes(result.error)) {
            errors.push(result.error);
          }
        }
      } catch (err: any) {
        failedCount++;
        if (err?.message && !errors.includes(err.message)) {
          errors.push(err.message);
        }
      }

      // Small throttle pause between requests
      await sleep(75);
    }

    // Finalize campaign record in MongoDB
    const updatedCampaign = await prisma.campaign.update({
      where: { id: campaign.id },
      data: {
        recipientCount: subscribers.length,
        sentCount,
        failedCount,
        status: "SENT",
        sentAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      campaign: updatedCampaign,
      sentCount,
      failedCount,
      recipientCount: subscribers.length,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error("Error executing broadcast campaign:", error);
    return NextResponse.json(
      { error: "Internal server error broadcasting campaign." },
      { status: 500 }
    );
  }
}

