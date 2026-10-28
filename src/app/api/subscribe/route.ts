import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import {
  createBrevoContact,
  sendTransactionalEmail,
  getWelcomeEmailHTML,
  getWelcomeEmailText,
} from "@/lib/brevo";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    // 1. Validate email format
    const trimmedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!trimmedEmail || !emailRegex.test(trimmedEmail)) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    // 2. Check if already subscribed in our database
    let subscriber = await prisma.subscriber.findUnique({
      where: { email: trimmedEmail },
    });

    if (subscriber && subscriber.status === "WELCOMED") {
      return NextResponse.json(
        { error: "You're already subscribed to the BAABFEST newsletter!" },
        { status: 400 }
      );
    }

    // 3. Save subscriber to MongoDB if new
    if (!subscriber) {
      subscriber = await prisma.subscriber.create({
        data: {
          email: trimmedEmail,
          status: "SUBSCRIBED",
        },
      });
    }

    // 4. Sync contact to Brevo (non-blocking — don't fail the request if Brevo is down)
    let brevoSynced = false;
    try {
      const brevoResult = await createBrevoContact(trimmedEmail);
      brevoSynced = brevoResult.success;
      if (!brevoResult.success) {
        console.warn("Brevo contact sync failed:", brevoResult.error);
      }
    } catch (brevoError) {
      console.warn("Brevo contact sync error (non-fatal):", brevoError);
    }

    // 5. Send welcome email via Brevo transactional API
    let welcomeSent = false;
    try {
      const emailResult = await sendTransactionalEmail({
        to: trimmedEmail,
        subject: "Welcome to BAABFEST 2026! 🎉",
        htmlContent: getWelcomeEmailHTML(),
        textContent: getWelcomeEmailText(),
      });

      if (emailResult.success) {
        welcomeSent = true;
        // Update status to WELCOMED
        await prisma.subscriber.update({
          where: { id: subscriber.id },
          data: { status: "WELCOMED" },
        });
      } else {
        console.warn("Welcome email failed:", emailResult.error);
      }
    } catch (emailError) {
      console.warn("Welcome email error (non-fatal):", emailError);
    }

    return NextResponse.json({
      success: true,
      message: "Thank you for subscribing to BAABFEST updates!",
      details: {
        saved: true,
        brevoSynced,
        welcomeSent,
      },
    });
  } catch (error) {
    console.error("Error subscribing:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again later." },
      { status: 500 }
    );
  }
}
