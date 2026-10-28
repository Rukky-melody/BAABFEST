import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentAdmin, verifyPassword, hashPassword } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized. Please log in first." }, { status: 401 });
    }

    const { currentPassword, newPassword, confirmPassword } = await req.json();

    if (!currentPassword || !newPassword || !confirmPassword) {
      return NextResponse.json(
        { error: "Current password, new password, and confirmation are required." },
        { status: 400 }
      );
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { error: "New password and confirmation do not match." },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "New password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    // Retrieve user with password hash
    const userRecord = await prisma.adminUser.findUnique({
      where: { id: admin.id },
    });

    if (!userRecord) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    // Check current password
    const isCurrentValid = verifyPassword(currentPassword, userRecord.password);
    if (!isCurrentValid) {
      return NextResponse.json(
        { error: "The current password you entered is incorrect." },
        { status: 400 }
      );
    }

    // Hash new password and save
    const newHashedPassword = hashPassword(newPassword);
    await prisma.adminUser.update({
      where: { id: admin.id },
      data: { password: newHashedPassword },
    });

    return NextResponse.json({
      success: true,
      message: "Password changed successfully! Please remember your new password.",
    });
  } catch (error) {
    console.error("Change password error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while changing password." },
      { status: 500 }
    );
  }
}

