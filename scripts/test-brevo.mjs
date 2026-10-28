import dotenv from "dotenv";
dotenv.config();

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const BREVO_SENDER_EMAIL = process.env.BREVO_SENDER_EMAIL || "rukkymelody@gmail.com";

console.log("-----------------------------------------");
console.log("Checking Brevo Configuration...");
console.log("API Key:", BREVO_API_KEY ? `${BREVO_API_KEY.substring(0, 14)}...` : "NOT FOUND");
console.log("Sender Email:", BREVO_SENDER_EMAIL);
console.log("-----------------------------------------\n");

async function runDiagnostics() {
  // 1. Test IP & Contacts endpoint
  console.log("1. Testing Contacts / Account access...");
  try {
    const contactRes = await fetch("https://api.brevo.com/v3/contacts?limit=1", {
      headers: { "api-key": BREVO_API_KEY, "Accept": "application/json" },
    });
    const contactData = await contactRes.json();
    if (contactRes.ok) {
      console.log("✅ Contact API access: OK");
    } else {
      console.log(`❌ Contact API error (${contactRes.status}):`, contactData.message || contactData);
    }
  } catch (err) {
    console.error("❌ Network error connecting to Brevo:", err.message);
  }

  // 2. Test Transactional Email API endpoint
  console.log("\n2. Testing Transactional Email API permission...");
  try {
    const smtpRes = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": BREVO_API_KEY,
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        sender: { name: "BAABFEST Test", email: BREVO_SENDER_EMAIL },
        to: [{ email: BREVO_SENDER_EMAIL }],
        subject: "BAABFEST Test Email",
        htmlContent: "<p>If you see this, Brevo transactional email works!</p>",
      }),
    });
    const smtpData = await smtpRes.json();
    if (smtpRes.ok) {
      console.log("✅ Transactional email sent successfully! MessageId:", smtpData.messageId);
    } else {
      console.log(`❌ Transactional email rejected (${smtpRes.status}):`, smtpData.message || smtpData);
    }
  } catch (err) {
    console.error("❌ Error sending transactional email:", err.message);
  }

  console.log("\n-----------------------------------------");
}

runDiagnostics();

