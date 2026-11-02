"use client";

import React, { useState, useEffect } from "react";
import {
  FiSend,
  FiMail,
  FiEye,
  FiCheckCircle,
  FiAlertCircle,
  FiUsers,
  FiClock,
  FiCheck,
  FiX,
  FiCopy,
  FiRefreshCw,
} from "react-icons/fi";

interface Campaign {
  id: string;
  subject: string;
  previewText?: string | null;
  heading: string;
  message: string;
  ctaText?: string | null;
  ctaUrl?: string | null;
  recipientCount: number;
  sentCount: number;
  failedCount: number;
  status: string;
  sentAt?: string | null;
  createdAt: string;
}

interface Audience {
  total: number;
  subscribed: number;
  welcomed: number;
}

export default function CampaignsAdminPage() {
  const [activeTab, setActiveTab] = useState<"compose" | "history">("compose");
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [audience, setAudience] = useState<Audience>({ total: 0, subscribed: 0, welcomed: 0 });
  const [loading, setLoading] = useState(true);

  // Form State
  const [subject, setSubject] = useState("");
  const [previewText, setPreviewText] = useState("");
  const [heading, setHeading] = useState("");
  const [message, setMessage] = useState("");
  const [includeCta, setIncludeCta] = useState(true);
  const [ctaText, setCtaText] = useState("Register for BAABFEST 2026");
  const [ctaUrl, setCtaUrl] = useState("https://bit.ly/471rmhn");

  // Interaction States
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showTestModal, setShowTestModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [testEmail, setTestEmail] = useState("");
  const [sendingTest, setSendingTest] = useState(false);
  const [broadcasting, setBroadcasting] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);

  // Notification banners
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const fetchCampaignsAndAudience = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/campaigns");
      const data = await res.json();
      if (data?.campaigns) setCampaigns(data.campaigns);
      if (data?.audience) setAudience(data.audience);
    } catch (err) {
      console.error("Error loading campaigns:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaignsAndAudience();
    // Pre-fill test email with logged-in admin email if available
    fetch("/api/admin/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user?.email) {
          setTestEmail(data.user.email);
        }
      })
      .catch(() => {});
  }, []);

  const handleSendTest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testEmail || !testEmail.includes("@")) {
      setNotification({ type: "error", message: "Please provide a valid test email address." });
      return;
    }
    if (!subject || !heading || !message) {
      setNotification({ type: "error", message: "Please fill in Subject, Heading, and Message before sending a test." });
      return;
    }

    try {
      setSendingTest(true);
      setNotification(null);
      const res = await fetch("/api/admin/campaigns/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          testEmail,
          subject,
          previewText,
          heading,
          message,
          ctaText: includeCta ? ctaText : null,
          ctaUrl: includeCta ? ctaUrl : null,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setShowTestModal(false);
        setNotification({
          type: "success",
          message: `Test email sent successfully to ${testEmail}! Check your inbox.`,
        });
      } else {
        setNotification({
          type: "error",
          message: data.error || "Failed to send test email.",
        });
      }
    } catch (err: any) {
      setNotification({ type: "error", message: err.message || "Network error sending test email." });
    } finally {
      setSendingTest(false);
    }
  };

  const handleBroadcast = async () => {
    if (!subject || !heading || !message) {
      setNotification({ type: "error", message: "Please fill in Subject, Heading, and Message." });
      setShowConfirmModal(false);
      return;
    }

    try {
      setBroadcasting(true);
      setNotification(null);
      setShowConfirmModal(false);

      const res = await fetch("/api/admin/campaigns/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject,
          previewText,
          heading,
          message,
          ctaText: includeCta ? ctaText : null,
          ctaUrl: includeCta ? ctaUrl : null,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setNotification({
          type: "success",
          message: `Campaign broadcast complete! Sent to ${data.sentCount} subscriber${data.sentCount === 1 ? "" : "s"}${data.failedCount > 0 ? ` (${data.failedCount} failed)` : ""}.`,
        });
        // Refresh campaign history
        fetchCampaignsAndAudience();
        setActiveTab("history");
      } else {
        setNotification({
          type: "error",
          message: data.error || "Failed to broadcast campaign.",
        });
      }
    } catch (err: any) {
      setNotification({ type: "error", message: err.message || "Network error broadcasting campaign." });
    } finally {
      setBroadcasting(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!subject || !heading || !message) {
      setNotification({ type: "error", message: "Please fill in at least Subject, Heading, and Message to save a draft." });
      return;
    }

    try {
      setSavingDraft(true);
      setNotification(null);
      const res = await fetch("/api/admin/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject,
          previewText,
          heading,
          message,
          ctaText: includeCta ? ctaText : null,
          ctaUrl: includeCta ? ctaUrl : null,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setNotification({ type: "success", message: "Campaign draft saved successfully!" });
        fetchCampaignsAndAudience();
      } else {
        setNotification({ type: "error", message: data.error || "Failed to save draft." });
      }
    } catch (err: any) {
      setNotification({ type: "error", message: err.message || "Error saving draft." });
    } finally {
      setSavingDraft(false);
    }
  };

  const duplicateCampaign = (camp: Campaign) => {
    setSubject(camp.subject);
    setPreviewText(camp.previewText || "");
    setHeading(camp.heading);
    setMessage(camp.message);
    if (camp.ctaText && camp.ctaUrl) {
      setIncludeCta(true);
      setCtaText(camp.ctaText);
      setCtaUrl(camp.ctaUrl);
    } else {
      setIncludeCta(false);
    }
    setActiveTab("compose");
    setNotification({ type: "success", message: `Campaign copied into editor!` });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div style={{ maxWidth: "1050px" }}>
      {/* ─── Header & Audience Summary ─────────────────────────────── */}
      <div style={{ marginBottom: "28px" }}>
        <h2
          style={{
            margin: "0 0 6px",
            fontFamily: "Georgia, serif",
            fontSize: "26px",
            color: "#1F2A44",
          }}
        >
          Email Broadcast Campaigns
        </h2>
        <p style={{ margin: 0, fontSize: "14px", color: "#64748B" }}>
          Compose and send official festival announcements and updates directly to all active subscribers.
        </p>
      </div>

      {/* Audience Banner */}
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          border: "1px solid rgba(43,43,43,0.12)",
          padding: "20px 24px",
          marginBottom: "28px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "16px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.03)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "10px",
              backgroundColor: "rgba(132, 16, 20, 0.08)",
              color: "#841014",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <FiUsers size={24} />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "18px", fontWeight: 700, color: "#1F2A44" }}>
                {audience.total} Active Subscriber{audience.total === 1 ? "" : "s"}
              </span>
            </div>
            <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#64748B" }}>
              Includes {audience.subscribed} new subscriber{audience.subscribed === 1 ? "" : "s"} and {audience.welcomed} welcomed member{audience.welcomed === 1 ? "" : "s"}.
            </p>
          </div>
        </div>

        <button
          onClick={fetchCampaignsAndAudience}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            background: "none",
            border: "1px solid #E2E8F0",
            padding: "8px 14px",
            borderRadius: "6px",
            fontSize: "12px",
            color: "#64748B",
            cursor: "pointer",
            fontWeight: 500,
          }}
          title="Refresh audience count"
        >
          <FiRefreshCw size={13} />
          <span>Refresh Audience</span>
        </button>
      </div>

      {/* Notification Banner */}
      {notification && (
        <div
          style={{
            padding: "14px 18px",
            borderRadius: "8px",
            marginBottom: "24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
            backgroundColor: notification.type === "success" ? "#ECFDF5" : "#FEF2F2",
            border: `1px solid ${notification.type === "success" ? "#A7F3D0" : "#FECACA"}`,
            color: notification.type === "success" ? "#065F46" : "#991B1B",
            fontSize: "14px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {notification.type === "success" ? <FiCheckCircle size={18} /> : <FiAlertCircle size={18} />}
            <span>{notification.message}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            style={{
              background: "none",
              border: "none",
              color: "inherit",
              cursor: "pointer",
              padding: "4px",
            }}
          >
            <FiX size={16} />
          </button>
        </div>
      )}

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          borderBottom: "1px solid #E2E8F0",
          marginBottom: "24px",
          gap: "8px",
        }}
      >
        <button
          onClick={() => setActiveTab("compose")}
          style={{
            padding: "12px 20px",
            background: "none",
            border: "none",
            borderBottom: activeTab === "compose" ? "3px solid #841014" : "3px solid transparent",
            color: activeTab === "compose" ? "#841014" : "#64748B",
            fontWeight: activeTab === "compose" ? 600 : 500,
            fontSize: "14px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            transition: "all 0.15s ease",
          }}
        >
          <FiSend size={15} />
          <span>Compose Campaign</span>
        </button>
        <button
          onClick={() => setActiveTab("history")}
          style={{
            padding: "12px 20px",
            background: "none",
            border: "none",
            borderBottom: activeTab === "history" ? "3px solid #841014" : "3px solid transparent",
            color: activeTab === "history" ? "#841014" : "#64748B",
            fontWeight: activeTab === "history" ? 600 : 500,
            fontSize: "14px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            transition: "all 0.15s ease",
          }}
        >
          <FiClock size={15} />
          <span>Campaign History</span>
          <span
            style={{
              backgroundColor: activeTab === "history" ? "#841014" : "#E2E8F0",
              color: activeTab === "history" ? "#ffffff" : "#64748B",
              fontSize: "11px",
              padding: "2px 7px",
              borderRadius: "10px",
              fontWeight: 600,
            }}
          >
            {campaigns.length}
          </span>
        </button>
      </div>

      {/* ─── TAB 1: COMPOSE CAMPAIGN ─────────────────────────────────── */}
      {activeTab === "compose" && (
        <div
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "12px",
            border: "1px solid rgba(43,43,43,0.12)",
            padding: "28px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
          }}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setShowConfirmModal(true);
            }}
          >
            {/* Subject Line */}
            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#1F2A44",
                  marginBottom: "6px",
                }}
              >
                Email Subject Line <span style={{ color: "#EF4444" }}>*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. BAABFEST 2026: Official Festival Dates Announced! 🎉"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                style={{
                  width: "100%",
                  padding: "11px 14px",
                  borderRadius: "8px",
                  border: "1px solid #CBD5E1",
                  fontSize: "14px",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
              <span style={{ fontSize: "11px", color: "#94A3B8", marginTop: "4px", display: "block" }}>
                This is what subscribers see in their inbox subject list.
              </span>
            </div>

            {/* Preview Text (Preheader) */}
            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#1F2A44",
                  marginBottom: "6px",
                }}
              >
                Preview Text / Preheader <span style={{ fontSize: "12px", color: "#94A3B8", fontWeight: 400 }}>(Optional)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Join us this November at Victor Uwaifo Creative Hub in Benin City."
                value={previewText}
                onChange={(e) => setPreviewText(e.target.value)}
                style={{
                  width: "100%",
                  padding: "11px 14px",
                  borderRadius: "8px",
                  border: "1px solid #CBD5E1",
                  fontSize: "14px",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>

            {/* Email Heading */}
            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#1F2A44",
                  marginBottom: "6px",
                }}
              >
                Main Heading in Email Body <span style={{ color: "#EF4444" }}>*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Mark Your Calendars for BAABFEST 2026"
                value={heading}
                onChange={(e) => setHeading(e.target.value)}
                style={{
                  width: "100%",
                  padding: "11px 14px",
                  borderRadius: "8px",
                  border: "1px solid #CBD5E1",
                  fontSize: "14px",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>

            {/* Message Body */}
            <div style={{ marginBottom: "24px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#1F2A44",
                  marginBottom: "6px",
                }}
              >
                Message Body <span style={{ color: "#EF4444" }}>*</span>
              </label>
              <textarea
                required
                rows={9}
                placeholder={`Dear friends,\n\nWe are thrilled to announce that the Benin Arts & Books Festival 2026 will be held from November 12–14 at the Victor Uwaifo Creative Hub.\n\nThis year's theme delves deep into ancient Edo craftsmanship, vibrant literary dialogues, and youth creative expression.\n\nStay tuned for the full lineup announcement coming soon!`}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  borderRadius: "8px",
                  border: "1px solid #CBD5E1",
                  fontSize: "14px",
                  fontFamily: "inherit",
                  lineHeight: "1.6",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
              <span style={{ fontSize: "11px", color: "#94A3B8", marginTop: "4px", display: "block" }}>
                Tip: Separate paragraphs with a blank line. They will format into clean, readable paragraphs in the email.
              </span>
            </div>

            {/* Optional Call to Action Button */}
            <div
              style={{
                backgroundColor: "#F8FAFC",
                border: "1px solid #E2E8F0",
                borderRadius: "10px",
                padding: "18px 20px",
                marginBottom: "28px",
              }}
            >
              <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={includeCta}
                  onChange={(e) => setIncludeCta(e.target.checked)}
                  style={{ width: "16px", height: "16px", accentColor: "#841014" }}
                />
                <span style={{ fontSize: "14px", fontWeight: 600, color: "#1F2A44" }}>
                  Include a Call-to-Action (CTA) Button
                </span>
              </label>

              {includeCta && (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "16px",
                    marginTop: "16px",
                  }}
                >
                  <div>
                    <label style={{ display: "block", fontSize: "12px", color: "#64748B", marginBottom: "4px" }}>
                      Button Text
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Register for BAABFEST 2026"
                      value={ctaText}
                      onChange={(e) => setCtaText(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "9px 12px",
                        borderRadius: "6px",
                        border: "1px solid #CBD5E1",
                        fontSize: "13px",
                        outline: "none",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", color: "#64748B", marginBottom: "4px" }}>
                      Button Link (URL)
                    </label>
                    <input
                      type="url"
                      placeholder="e.g. https://bit.ly/471rmhn"
                      value={ctaUrl}
                      onChange={(e) => setCtaUrl(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "9px 12px",
                        borderRadius: "6px",
                        border: "1px solid #CBD5E1",
                        fontSize: "13px",
                        outline: "none",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Action Bar */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "12px",
                borderTop: "1px solid #E2E8F0",
                paddingTop: "20px",
              }}
            >
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                {/* Live Preview Button */}
                <button
                  type="button"
                  onClick={() => setShowPreviewModal(true)}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    backgroundColor: "#F1F5F9",
                    color: "#334155",
                    border: "1px solid #CBD5E1",
                    padding: "10px 16px",
                    borderRadius: "6px",
                    fontSize: "13px",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  <FiEye size={15} />
                  <span>Preview Email</span>
                </button>

                {/* Send Test Email Button */}
                <button
                  type="button"
                  onClick={() => setShowTestModal(true)}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    backgroundColor: "#FEF3C7",
                    color: "#92400E",
                    border: "1px solid #FCD34D",
                    padding: "10px 16px",
                    borderRadius: "6px",
                    fontSize: "13px",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  <FiMail size={15} />
                  <span>Send Test Email</span>
                </button>

                {/* Save Draft Button */}
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  disabled={savingDraft}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    backgroundColor: "transparent",
                    color: "#64748B",
                    border: "1px solid #E2E8F0",
                    padding: "10px 16px",
                    borderRadius: "6px",
                    fontSize: "13px",
                    fontWeight: 500,
                    cursor: savingDraft ? "not-allowed" : "pointer",
                  }}
                >
                  <span>{savingDraft ? "Saving..." : "Save Draft"}</span>
                </button>
              </div>

              {/* Broadcast Send Button */}
              <button
                type="submit"
                disabled={broadcasting}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  backgroundColor: "#841014",
                  color: "#ffffff",
                  border: "none",
                  padding: "12px 24px",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: 600,
                  cursor: broadcasting ? "not-allowed" : "pointer",
                  boxShadow: "0 4px 12px rgba(132, 16, 20, 0.25)",
                }}
              >
                <FiSend size={16} />
                <span>{broadcasting ? "Broadcasting..." : `Send to All (${audience.total})`}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ─── TAB 2: CAMPAIGN HISTORY ─────────────────────────────────── */}
      {activeTab === "history" && (
        <div
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "12px",
            border: "1px solid rgba(43,43,43,0.12)",
            overflow: "hidden",
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          }}
        >
          {loading ? (
            <div style={{ padding: "48px", textAlign: "center", color: "#64748B" }}>
              Loading campaign history...
            </div>
          ) : campaigns.length === 0 ? (
            <div style={{ padding: "54px 24px", textAlign: "center", color: "#64748B" }}>
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "50%",
                  backgroundColor: "#F1F5F9",
                  color: "#94A3B8",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "14px",
                }}
              >
                <FiMail size={24} />
              </div>
              <h3 style={{ margin: "0 0 6px", fontSize: "16px", color: "#1F2A44" }}>No campaigns sent yet</h3>
              <p style={{ margin: "0 0 16px", fontSize: "13px", color: "#94A3B8" }}>
                Create and broadcast your first festival campaign to subscribers.
              </p>
              <button
                onClick={() => setActiveTab("compose")}
                style={{
                  backgroundColor: "#841014",
                  color: "#ffffff",
                  padding: "10px 18px",
                  borderRadius: "6px",
                  border: "none",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Compose First Campaign
              </button>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", minWidth: "750px", borderCollapse: "collapse" }}>
                <thead>
                  <tr
                    style={{
                      backgroundColor: "#F8FAFC",
                      textAlign: "left",
                      borderBottom: "1px solid #E2E8F0",
                      fontSize: "12px",
                      color: "#64748B",
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                    }}
                  >
                    <th style={{ padding: "16px 20px" }}>Campaign Subject</th>
                    <th style={{ padding: "16px 20px" }}>Heading</th>
                    <th style={{ padding: "16px 20px" }}>Recipients</th>
                    <th style={{ padding: "16px 20px" }}>Delivered</th>
                    <th style={{ padding: "16px 20px" }}>Date</th>
                    <th style={{ padding: "16px 20px" }}>Status</th>
                    <th style={{ padding: "16px 20px", textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {campaigns.map((camp) => (
                    <tr
                      key={camp.id}
                      style={{
                        borderBottom: "1px solid #F1F5F9",
                        fontSize: "14px",
                      }}
                    >
                      <td style={{ padding: "16px 20px", fontWeight: 600, color: "#1F2A44" }}>
                        {camp.subject}
                      </td>
                      <td style={{ padding: "16px 20px", color: "#475569", maxWidth: "220px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {camp.heading}
                      </td>
                      <td style={{ padding: "16px 20px", color: "#1F2A44", fontWeight: 500 }}>
                        {camp.recipientCount}
                      </td>
                      <td style={{ padding: "16px 20px" }}>
                        <span style={{ color: "#065F46", fontWeight: 600 }}>{camp.sentCount}</span>
                        {camp.failedCount > 0 && (
                          <span style={{ color: "#DC2626", fontSize: "12px", marginLeft: "4px" }}>
                            ({camp.failedCount} err)
                          </span>
                        )}
                      </td>
                      <td style={{ padding: "16px 20px", color: "#64748B", fontSize: "13px" }}>
                        {camp.sentAt
                          ? new Date(camp.sentAt).toLocaleDateString(undefined, {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })
                          : new Date(camp.createdAt).toLocaleDateString(undefined, {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                      </td>
                      <td style={{ padding: "16px 20px" }}>
                        <span
                          style={{
                            padding: "4px 10px",
                            borderRadius: "12px",
                            fontSize: "11px",
                            fontWeight: 700,
                            letterSpacing: "0.04em",
                            backgroundColor:
                              camp.status === "SENT"
                                ? "#ECFDF5"
                                : camp.status === "SENDING"
                                ? "#EFF6FF"
                                : "#FEF3C7",
                            color:
                              camp.status === "SENT"
                                ? "#065F46"
                                : camp.status === "SENDING"
                                ? "#1E40AF"
                                : "#92400E",
                          }}
                        >
                          {camp.status}
                        </span>
                      </td>
                      <td style={{ padding: "16px 20px", textAlign: "right" }}>
                        <button
                          onClick={() => duplicateCampaign(camp)}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "5px",
                            backgroundColor: "#F1F5F9",
                            color: "#334155",
                            border: "1px solid #CBD5E1",
                            padding: "6px 12px",
                            borderRadius: "6px",
                            fontSize: "12px",
                            fontWeight: 500,
                            cursor: "pointer",
                          }}
                          title="Copy content into editor"
                        >
                          <FiCopy size={13} />
                          <span>Reuse</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ─── MODAL 1: LIVE EMAIL PREVIEW ─────────────────────────────── */}
      {showPreviewModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(15, 23, 42, 0.7)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "20px",
          }}
          onClick={() => setShowPreviewModal(false)}
        >
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "14px",
              width: "100%",
              maxWidth: "640px",
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow: "0 25px 50px -12px rgba(0,0,0,0.3)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "16px 24px",
                borderBottom: "1px solid #E2E8F0",
              }}
            >
              <div>
                <h3 style={{ margin: 0, fontSize: "16px", color: "#1F2A44" }}>Email Live Preview</h3>
                <span style={{ fontSize: "12px", color: "#64748B" }}>Subject: {subject || "(No subject set)"}</span>
              </div>
              <button
                onClick={() => setShowPreviewModal(false)}
                style={{ background: "none", border: "none", color: "#94A3B8", cursor: "pointer" }}
              >
                <FiX size={20} />
              </button>
            </div>

            {/* Email Container (Styled as actual email) */}
            <div style={{ backgroundColor: "#F4EFE8", padding: "28px 20px" }}>
              <div
                style={{
                  backgroundColor: "#ffffff",
                  borderRadius: "12px",
                  overflow: "hidden",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
                  maxWidth: "580px",
                  margin: "0 auto",
                }}
              >
                {/* Header Banner */}
                <div
                  style={{
                    background: "linear-gradient(135deg, #1F2A44 0%, #841014 100%)",
                    padding: "32px 24px",
                    textAlign: "center",
                  }}
                >
                  <h1
                    style={{
                      margin: 0,
                      fontFamily: "Georgia, serif",
                      fontSize: "26px",
                      color: "#F0C823",
                      letterSpacing: "0.06em",
                    }}
                  >
                    BAABFEST
                  </h1>
                  <p
                    style={{
                      margin: "6px 0 0",
                      fontSize: "12px",
                      color: "#E8DABB",
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                    }}
                  >
                    Benin Arts &amp; Books Festival
                  </p>
                </div>

                {/* Content */}
                <div style={{ padding: "32px 28px 20px" }}>
                  <h2
                    style={{
                      margin: "0 0 16px",
                      fontFamily: "Georgia, serif",
                      fontSize: "20px",
                      color: "#841014",
                      lineHeight: "1.35",
                    }}
                  >
                    {heading || "Main Heading Title"}
                  </h2>

                  {message ? (
                    message
                      .split(/\n\s*\n/)
                      .map((para, i) => (
                        <p
                          key={i}
                          style={{
                            margin: "0 0 14px",
                            fontSize: "14px",
                            lineHeight: "1.7",
                            color: "#2B2B2B",
                            whiteSpace: "pre-line",
                          }}
                        >
                          {para}
                        </p>
                      ))
                  ) : (
                    <p style={{ color: "#94A3B8", fontStyle: "italic", fontSize: "14px" }}>
                      Your message body will appear here...
                    </p>
                  )}

                  {includeCta && ctaText && (
                    <div style={{ textAlign: "center", margin: "24px 0 10px" }}>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "12px 30px",
                          backgroundColor: "#A8471F",
                          color: "#ffffff",
                          fontSize: "14px",
                          fontWeight: 600,
                          borderRadius: "8px",
                          textDecoration: "none",
                        }}
                      >
                        {ctaText}
                      </span>
                    </div>
                  )}
                </div>

                {/* Divider */}
                <div style={{ padding: "0 28px" }}>
                  <hr style={{ border: "none", borderTop: "1px solid #E8DABB", margin: 0 }} />
                </div>

                {/* Footer */}
                <div style={{ padding: "20px 28px 28px", textAlign: "center", fontSize: "12px", color: "#888" }}>
                  <p style={{ margin: "0 0 4px" }}>📍 Victor Uwaifo Creative Hub, Benin City, Edo State</p>
                  <p style={{ margin: "0 0 8px" }}>🗓️ November 12–14, 2026</p>
                  <p style={{ margin: "10px 0 0", fontSize: "11px", color: "#aaa" }}>
                    © 2026 Benin Arts and Books Festival. All Rights Reserved.
                  </p>
                </div>
              </div>
            </div>

            <div style={{ padding: "16px 24px", textAlign: "right", borderTop: "1px solid #E2E8F0" }}>
              <button
                onClick={() => setShowPreviewModal(false)}
                style={{
                  backgroundColor: "#1F2A44",
                  color: "#ffffff",
                  padding: "9px 20px",
                  borderRadius: "6px",
                  border: "none",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL 2: SEND TEST EMAIL ────────────────────────────────── */}
      {showTestModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(15, 23, 42, 0.7)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "20px",
          }}
          onClick={() => setShowTestModal(false)}
        >
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "14px",
              width: "100%",
              maxWidth: "460px",
              padding: "24px",
              boxShadow: "0 25px 50px -12px rgba(0,0,0,0.3)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "8px",
                    backgroundColor: "#FEF3C7",
                    color: "#92400E",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <FiMail size={18} />
                </div>
                <h3 style={{ margin: 0, fontSize: "17px", color: "#1F2A44" }}>Send Test Email</h3>
              </div>
              <button
                onClick={() => setShowTestModal(false)}
                style={{ background: "none", border: "none", color: "#94A3B8", cursor: "pointer" }}
              >
                <FiX size={18} />
              </button>
            </div>

            <p style={{ margin: "0 0 16px", fontSize: "13px", color: "#64748B", lineHeight: "1.5" }}>
              Test this campaign on your own inbox first to inspect the design, layout, and copy before broadcasting to all subscribers.
            </p>

            <form onSubmit={handleSendTest}>
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#1F2A44", marginBottom: "6px" }}>
                  Destination Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. yourname@gmail.com"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "6px",
                    border: "1px solid #CBD5E1",
                    fontSize: "14px",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                <button
                  type="button"
                  onClick={() => setShowTestModal(false)}
                  style={{
                    backgroundColor: "#F1F5F9",
                    color: "#475569",
                    border: "none",
                    padding: "9px 16px",
                    borderRadius: "6px",
                    fontSize: "13px",
                    fontWeight: 500,
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={sendingTest}
                  style={{
                    backgroundColor: "#841014",
                    color: "#ffffff",
                    border: "none",
                    padding: "9px 18px",
                    borderRadius: "6px",
                    fontSize: "13px",
                    fontWeight: 600,
                    cursor: sendingTest ? "not-allowed" : "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <FiSend size={14} />
                  <span>{sendingTest ? "Sending Test..." : "Send Test Now"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL 3: BROADCAST CONFIRMATION ─────────────────────────── */}
      {showConfirmModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(15, 23, 42, 0.7)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "20px",
          }}
          onClick={() => setShowConfirmModal(false)}
        >
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "14px",
              width: "100%",
              maxWidth: "480px",
              padding: "26px",
              boxShadow: "0 25px 50px -12px rgba(0,0,0,0.3)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                backgroundColor: "#FEF2F2",
                color: "#DC2626",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "16px",
              }}
            >
              <FiSend size={22} />
            </div>

            <h3 style={{ margin: "0 0 8px", fontSize: "18px", color: "#1F2A44" }}>
              Broadcast to {audience.total} Subscribers?
            </h3>

            <p style={{ margin: "0 0 18px", fontSize: "14px", color: "#64748B", lineHeight: "1.5" }}>
              You are about to send <strong>&quot;{subject}&quot;</strong> to all{" "}
              <strong>{audience.total}</strong> active subscribers via Brevo. This action cannot be undone.
            </p>

            <div
              style={{
                backgroundColor: "#F8FAFC",
                border: "1px solid #E2E8F0",
                borderRadius: "8px",
                padding: "12px 14px",
                marginBottom: "20px",
                fontSize: "12px",
                color: "#475569",
              }}
            >
              <div><strong>Heading:</strong> {heading}</div>
              <div style={{ marginTop: "4px" }}>
                <strong>Recipients:</strong> {audience.total} ({audience.subscribed} subscribed + {audience.welcomed} welcomed)
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                style={{
                  backgroundColor: "#F1F5F9",
                  color: "#475569",
                  border: "none",
                  padding: "10px 18px",
                  borderRadius: "6px",
                  fontSize: "13px",
                  fontWeight: 500,
                  cursor: "pointer",
                }}
              >
                Go Back
              </button>
              <button
                type="button"
                onClick={handleBroadcast}
                disabled={broadcasting}
                style={{
                  backgroundColor: "#841014",
                  color: "#ffffff",
                  border: "none",
                  padding: "10px 22px",
                  borderRadius: "6px",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: broadcasting ? "not-allowed" : "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  boxShadow: "0 4px 12px rgba(132, 16, 20, 0.25)",
                }}
              >
                <FiCheck size={15} />
                <span>{broadcasting ? "Broadcasting..." : "Yes, Broadcast Now"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

