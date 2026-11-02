import { NextResponse } from "next/server";
import {
  sendTransactionalEmail,
  getCampaignEmailHTML,
  getCampaignEmailText,
} from "@/lib/brevo";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { testEmail, subject, previewText, heading, message, ctaText, ctaUrl } = body;

    if (!testEmail || !testEmail.includes("@")) {
      return NextResponse.json(
        { error: "A valid test email address is required." },
        { status: 400 }
      );
    }

    if (!subject || !heading || !message) {
      return NextResponse.json(
        { error: "Subject, Heading, and Message are required to send a test email." },
        { status: 400 }
      );
    }

    const htmlContent = getCampaignEmailHTML({
      heading: heading.trim(),
      message: message.trim(),
      previewText: previewText?.trim(),
      ctaText: ctaText?.trim(),
      ctaUrl: ctaUrl?.trim(),
    });

    const textContent = getCampaignEmailText({
      heading: heading.trim(),
      message: message.trim(),
      ctaText: ctaText?.trim(),
      ctaUrl: ctaUrl?.trim(),
    });

    const emailResult = await sendTransactionalEmail({
      to: testEmail.trim(),
      subject: `[TEST] ${subject.trim()}`,
      htmlContent,
      textContent,
    });

    if (!emailResult.success) {
      return NextResponse.json(
        { error: emailResult.error || "Failed to send test email via Brevo." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      messageId: emailResult.messageId,
      recipient: testEmail.trim(),
    });
  } catch (error) {
    console.error("Error sending test campaign email:", error);
    return NextResponse.json(
      { error: "Internal server error sending test email." },
      { status: 500 }
    );
  }
}

