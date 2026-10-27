import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import {
  sendTransactionalEmail,
  getWelcomeEmailHTML,
  getWelcomeEmailText,
} from "@/lib/brevo";

export async function POST(req: Request) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Subscriber ID is required" }, { status: 400 });
    }

    const subscriber = await prisma.subscriber.findUnique({
      where: { id },
    });

    if (!subscriber) {
      return NextResponse.json({ error: "Subscriber not found" }, { status: 404 });
    }

    // Send the welcome email via Brevo transactional API
    const emailResult = await sendTransactionalEmail({
      to: subscriber.email,
      subject: "Welcome to BAABFEST 2026! 🎉",
      htmlContent: getWelcomeEmailHTML(),
      textContent: getWelcomeEmailText(),
    });

    if (!emailResult.success) {
      return NextResponse.json(
        { error: emailResult.error || "Failed to send email" },
        { status: 500 }
      );
    }

    // Update status to WELCOMED
    const updatedSubscriber = await prisma.subscriber.update({
      where: { id },
      data: { status: "WELCOMED" },
    });

    return NextResponse.json({
      success: true,
      subscriber: updatedSubscriber,
      messageId: emailResult.messageId,
    });
  } catch (error) {
    console.error("Error sending welcome email:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}
