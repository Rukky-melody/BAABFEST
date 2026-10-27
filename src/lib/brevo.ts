/**
 * Brevo (Sendinblue) API utility functions.
 * Uses the Brevo REST API directly — no SDK dependency needed.
 */

const BREVO_API_URL = "https://api.brevo.com/v3";

function getApiKey(): string {
  const key = process.env.BREVO_API_KEY;
  if (!key) {
    throw new Error("BREVO_API_KEY is not configured in environment variables.");
  }
  return key;
}

function headers() {
  return {
    "api-key": getApiKey(),
    "Content-Type": "application/json",
    Accept: "application/json",
  };
}

// ─── Contact Management ──────────────────────────────────────────

export interface CreateContactResult {
  success: boolean;
  alreadyExists: boolean;
  error?: string;
}

/**
 * Creates or updates a contact in Brevo.
 * If the contact already exists and `updateEnabled` is true, it updates silently.
 */
export async function createBrevoContact(email: string): Promise<CreateContactResult> {
  const listId = process.env.BREVO_LIST_ID;
  const listIds = listId ? [parseInt(listId, 10)].filter((n) => !isNaN(n)) : [];

  const response = await fetch(`${BREVO_API_URL}/contacts`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({
      email,
      updateEnabled: true,
      ...(listIds.length > 0 ? { listIds } : {}),
    }),
  });

  // 201 = created, 204 = updated (updateEnabled)
  if (response.ok || response.status === 204) {
    return { success: true, alreadyExists: false };
  }

  const errorData = await response.json().catch(() => null);

  // "Contact already exist" is Brevo's duplicate response
  if (
    errorData?.message?.toLowerCase().includes("already exist") ||
    errorData?.code === "duplicate_parameter"
  ) {
    return { success: true, alreadyExists: true };
  }

  console.error("Brevo createContact error:", errorData);
  return {
    success: false,
    alreadyExists: false,
    error: errorData?.message || "Failed to add contact to Brevo.",
  };
}

// ─── Transactional Email ──────────────────────────────────────────

export interface SendEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Sends a transactional email via Brevo's SMTP API.
 * This uses the /v3/smtp/email endpoint (not campaigns).
 *
 * IMPORTANT: The sender email must be verified in your Brevo account.
 * Go to: Brevo Dashboard → Settings → Senders, Domains & Dedicated IPs
 */
export async function sendTransactionalEmail({
  to,
  subject,
  htmlContent,
  textContent,
  senderName = "BAABFEST",
  senderEmail,
}: {
  to: string;
  subject: string;
  htmlContent: string;
  textContent?: string;
  senderName?: string;
  senderEmail?: string;
}): Promise<SendEmailResult> {
  // Use the configured sender email or fall back to env var
  const fromEmail =
    senderEmail ||
    process.env.BREVO_SENDER_EMAIL ||
    "hello@baabfest.com";

  const response = await fetch(`${BREVO_API_URL}/smtp/email`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({
      sender: { name: senderName, email: fromEmail },
      to: [{ email: to }],
      subject,
      htmlContent,
      ...(textContent ? { textContent } : {}),
    }),
  });

  if (response.ok) {
    const data = await response.json().catch(() => ({}));
    return { success: true, messageId: data.messageId };
  }

  const errorData = await response.json().catch(() => null);
  console.error("Brevo sendEmail error:", errorData);

  return {
    success: false,
    error: errorData?.message || "Failed to send email via Brevo.",
  };
}

// ─── Welcome Email Template ──────────────────────────────────────

/**
 * Returns the HTML content for the BAABFEST welcome email.
 * Branded, responsive, and ready to send.
 */
export function getWelcomeEmailHTML(): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Welcome to BAABFEST!</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F4EFE8; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #F4EFE8; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">
          
          <!-- Header Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #1F2A44 0%, #841014 100%); padding: 40px 32px; text-align: center;">
              <h1 style="margin: 0; font-family: Georgia, serif; font-size: 28px; color: #F0C823; letter-spacing: 0.06em;">
                BAABFEST
              </h1>
              <p style="margin: 8px 0 0; font-size: 13px; color: #E8DABB; letter-spacing: 0.15em; text-transform: uppercase;">
                Benin Arts &amp; Books Festival
              </p>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding: 40px 32px 24px;">
              <h2 style="margin: 0 0 16px; font-family: Georgia, serif; font-size: 22px; color: #841014;">
                Welcome to the BAABFEST family! 🎉
              </h2>
              <p style="margin: 0 0 16px; font-size: 15px; line-height: 1.7; color: #2B2B2B;">
                Thank you for subscribing to our newsletter. You're now part of a growing community celebrating Benin's rich cultural heritage through literature, visual art, and ancient craft.
              </p>
              <p style="margin: 0 0 24px; font-size: 15px; line-height: 1.7; color: #2B2B2B;">
                As a subscriber, you'll be the <strong>first to know</strong> about:
              </p>
              
              <!-- Benefits List -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 28px;">
                <tr>
                  <td style="padding: 10px 16px; background-color: #FDF8F0; border-left: 3px solid #C45A2A; margin-bottom: 8px; border-radius: 0 6px 6px 0;">
                    <p style="margin: 0; font-size: 14px; color: #2B2B2B;">📅 Full program drops &amp; schedule releases</p>
                  </td>
                </tr>
                <tr><td style="height: 8px;"></td></tr>
                <tr>
                  <td style="padding: 10px 16px; background-color: #FDF8F0; border-left: 3px solid #C45A2A; border-radius: 0 6px 6px 0;">
                    <p style="margin: 0; font-size: 14px; color: #2B2B2B;">🎨 Featured artist &amp; author announcements</p>
                  </td>
                </tr>
                <tr><td style="height: 8px;"></td></tr>
                <tr>
                  <td style="padding: 10px 16px; background-color: #FDF8F0; border-left: 3px solid #C45A2A; border-radius: 0 6px 6px 0;">
                    <p style="margin: 0; font-size: 14px; color: #2B2B2B;">🎟️ Early-bird ticket access &amp; exclusive offers</p>
                  </td>
                </tr>
                <tr><td style="height: 8px;"></td></tr>
                <tr>
                  <td style="padding: 10px 16px; background-color: #FDF8F0; border-left: 3px solid #C45A2A; border-radius: 0 6px 6px 0;">
                    <p style="margin: 0; font-size: 14px; color: #2B2B2B;">📖 Behind-the-scenes stories from the festival</p>
                  </td>
                </tr>
              </table>

              <!-- CTA Button -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding: 8px 0 16px;">
                    <a href="https://bit.ly/471rmhn" target="_blank" rel="noopener noreferrer" style="display: inline-block; padding: 14px 36px; background-color: #A8471F; color: #ffffff; font-size: 15px; font-weight: 600; text-decoration: none; border-radius: 8px; letter-spacing: 0.02em;">
                      Register for BAABFEST 2026
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding: 0 32px;">
              <hr style="border: none; border-top: 1px solid #E8DABB; margin: 0;" />
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 32px 32px; text-align: center;">
              <p style="margin: 0 0 8px; font-size: 13px; color: #888;">
                📍 Victor Uwaifo Creative Hub, Benin City, Edo State
              </p>
              <p style="margin: 0 0 8px; font-size: 13px; color: #888;">
                🗓️ November 12–14, 2026
              </p>
              <p style="margin: 16px 0 0; font-size: 11px; color: #aaa;">
                © 2026 Benin Arts and Books Festival. All Rights Reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function getWelcomeEmailText(): string {
  return `Welcome to BAABFEST!

Thank you for subscribing to our newsletter. You're now part of a growing community celebrating Benin's rich cultural heritage through literature, visual art, and ancient craft.

As a subscriber, you'll be the first to know about:
• Full program drops & schedule releases
• Featured artist & author announcements
• Early-bird ticket access & exclusive offers
• Behind-the-scenes stories from the festival

Register for BAABFEST 2026: https://bit.ly/471rmhn

📍 Victor Uwaifo Creative Hub, Benin City, Edo State
🗓️ November 12–14, 2026

© 2026 Benin Arts and Books Festival. All Rights Reserved.`;
}
