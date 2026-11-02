"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  FiMail,
  FiTrash2,
  FiCheckCircle,
  FiAlertCircle,
  FiX,
  FiSend,
  FiAlertTriangle,
} from "react-icons/fi";

export interface SubscriberItem {
  id: string;
  email: string;
  status: string;
  createdAt: string | Date;
}

export default function SubscribersTable({
  initialSubscribers,
}: {
  initialSubscribers: SubscriberItem[];
}) {
  const router = useRouter();
  const [subscribers, setSubscribers] = useState<SubscriberItem[]>(initialSubscribers);

  // Modal States
  const [welcomeTarget, setWelcomeTarget] = useState<SubscriberItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<SubscriberItem | null>(null);
  const [isSendingWelcome, setIsSendingWelcome] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Custom Alert Notification
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification((curr) => (curr?.message === message ? null : curr));
    }, 6000);
  };

  // ─── SEND WELCOME HANDLER ─────────────────────────────────────────
  const handleConfirmSendWelcome = async () => {
    if (!welcomeTarget) return;

    setIsSendingWelcome(true);
    try {
      const res = await fetch("/api/admin/send-welcome", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: welcomeTarget.id }),
      });
      const data = await res.json();

      if (res.ok) {
        // Optimistically update subscriber status in UI
        setSubscribers((prev) =>
          prev.map((sub) =>
            sub.id === welcomeTarget.id ? { ...sub, status: "WELCOMED" } : sub
          )
        );
        showNotification(
          "success",
          `Welcome email sent successfully to ${welcomeTarget.email}! 🎉`
        );
        setWelcomeTarget(null);
        router.refresh();
      } else {
        showNotification(
          "error",
          data.error || "Failed to send welcome email via Brevo."
        );
      }
    } catch (err: any) {
      showNotification(
        "error",
        err?.message || "Network error while sending welcome email."
      );
    } finally {
      setIsSendingWelcome(false);
    }
  };

  // ─── DELETE SUBSCRIBER HANDLER ────────────────────────────────────
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/subscribers/${deleteTarget.id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (res.ok) {
        // Optimistically remove subscriber from UI
        setSubscribers((prev) => prev.filter((sub) => sub.id !== deleteTarget.id));
        showNotification(
          "success",
          `Subscriber "${deleteTarget.email}" was removed successfully.`
        );
        setDeleteTarget(null);
        router.refresh();
      } else {
        showNotification(
          "error",
          data.error || "Failed to delete subscriber from database."
        );
      }
    } catch (err: any) {
      showNotification(
        "error",
        err?.message || "Network error while deleting subscriber."
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      {/* ─── CUSTOM ALERT NOTIFICATION BANNER ────────────────────────── */}
      {notification && (
        <div
          style={{
            padding: "14px 18px",
            borderRadius: "10px",
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
            backgroundColor:
              notification.type === "success" ? "#ECFDF5" : "#FEF2F2",
            border: `1px solid ${
              notification.type === "success" ? "#A7F3D0" : "#FECACA"
            }`,
            color: notification.type === "success" ? "#065F46" : "#991B1B",
            fontSize: "14px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            animation: "fadeIn 0.2s ease-in-out",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {notification.type === "success" ? (
              <FiCheckCircle size={18} style={{ color: "#10B981", flexShrink: 0 }} />
            ) : (
              <FiAlertCircle size={18} style={{ color: "#EF4444", flexShrink: 0 }} />
            )}
            <span style={{ fontWeight: 500 }}>{notification.message}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            style={{
              background: "none",
              border: "none",
              color: "inherit",
              cursor: "pointer",
              padding: "4px",
              display: "flex",
              alignItems: "center",
            }}
            aria-label="Dismiss alert"
          >
            <FiX size={16} />
          </button>
        </div>
      )}

      {/* ─── SUBSCRIBERS TABLE ────────────────────────────────────────── */}
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          border: "1px solid rgba(43,43,43,0.12)",
          overflowX: "auto",
          WebkitOverflowScrolling: "touch",
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        }}
      >
        <table style={{ width: "100%", minWidth: "650px", borderCollapse: "collapse" }}>
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
              <th style={{ padding: "16px 20px" }}>Email</th>
              <th style={{ padding: "16px 20px" }}>Date Subscribed</th>
              <th style={{ padding: "16px 20px" }}>Status</th>
              <th style={{ padding: "16px 20px", textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {subscribers.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  style={{
                    padding: "48px 24px",
                    textAlign: "center",
                    color: "#94A3B8",
                    fontSize: "14px",
                  }}
                >
                  No subscribers found.
                </td>
              </tr>
            ) : (
              subscribers.map((sub) => (
                <tr
                  key={sub.id}
                  style={{
                    borderBottom: "1px solid #F1F5F9",
                    fontSize: "14px",
                  }}
                >
                  <td style={{ padding: "16px 20px", fontWeight: "500", color: "#1F2A44" }}>
                    {sub.email}
                  </td>
                  <td style={{ padding: "16px 20px", color: "#64748B", fontSize: "13px" }}>
                    {new Date(sub.createdAt).toLocaleDateString(undefined, {
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
                          sub.status === "WELCOMED" ? "#ECFDF5" : "#FEF3C7",
                        color:
                          sub.status === "WELCOMED" ? "#065F46" : "#92400E",
                      }}
                    >
                      {sub.status}
                    </span>
                  </td>
                  <td style={{ padding: "16px 20px", textAlign: "right" }}>
                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      {/* Send Welcome Action Button */}
                      <button
                        type="button"
                        onClick={() => setWelcomeTarget(sub)}
                        disabled={sub.status === "WELCOMED"}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "5px",
                          padding: "6px 12px",
                          backgroundColor:
                            sub.status === "WELCOMED" ? "#F1F5F9" : "#841014",
                          color: sub.status === "WELCOMED" ? "#94A3B8" : "#ffffff",
                          border:
                            sub.status === "WELCOMED"
                              ? "1px solid #E2E8F0"
                              : "1px solid #841014",
                          borderRadius: "6px",
                          cursor:
                            sub.status === "WELCOMED" ? "not-allowed" : "pointer",
                          fontWeight: 600,
                          fontSize: "0.82rem",
                          transition: "all 0.15s ease",
                        }}
                        title={
                          sub.status === "WELCOMED"
                            ? "Welcome email already sent"
                            : `Send welcome email to ${sub.email}`
                        }
                      >
                        <FiMail size={13} />
                        <span>{sub.status === "WELCOMED" ? "Already Sent" : "Send Welcome"}</span>
                      </button>

                      {/* Delete Action Button */}
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(sub)}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "5px",
                          padding: "6px 11px",
                          backgroundColor: "#FEF2F2",
                          color: "#DC2626",
                          border: "1px solid #FECACA",
                          borderRadius: "6px",
                          cursor: "pointer",
                          fontWeight: 600,
                          fontSize: "0.82rem",
                          transition: "all 0.15s ease",
                        }}
                        title={`Delete ${sub.email}`}
                      >
                        <FiTrash2 size={13} />
                        <span>Delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ─── CUSTOM MODAL 1: SEND WELCOME CONFIRMATION ────────────────── */}
      {welcomeTarget && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(15, 23, 42, 0.7)",
            backdropFilter: "blur(4px)",
            WebkitBackdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "20px",
          }}
          onClick={() => {
            if (!isSendingWelcome) setWelcomeTarget(null);
          }}
        >
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "14px",
              width: "100%",
              maxWidth: "460px",
              padding: "26px",
              boxShadow: "0 25px 50px -12px rgba(0,0,0,0.3)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "10px",
                  backgroundColor: "rgba(132, 16, 20, 0.08)",
                  color: "#841014",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <FiMail size={22} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: "18px", color: "#1F2A44", fontFamily: "Georgia, serif" }}>
                  Send Welcome Email?
                </h3>
                <span style={{ fontSize: "12px", color: "#64748B" }}>
                  BAABFEST 2026 Transactional Email
                </span>
              </div>
            </div>

            <p style={{ margin: "0 0 18px", fontSize: "14px", color: "#475569", lineHeight: "1.6" }}>
              Are you sure you want to send the official welcome email to{" "}
              <strong style={{ color: "#1F2A44" }}>{welcomeTarget.email}</strong>?
            </p>

            <div
              style={{
                backgroundColor: "#F8FAFC",
                border: "1px solid #E2E8F0",
                borderRadius: "8px",
                padding: "12px 14px",
                marginBottom: "22px",
                fontSize: "12px",
                color: "#64748B",
              }}
            >
              Once delivered, their status will update to <strong style={{ color: "#065F46" }}>WELCOMED</strong> and the email will arrive directly in their Gmail inbox.
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
              <button
                type="button"
                onClick={() => setWelcomeTarget(null)}
                disabled={isSendingWelcome}
                style={{
                  backgroundColor: "#F1F5F9",
                  color: "#475569",
                  border: "none",
                  padding: "10px 18px",
                  borderRadius: "6px",
                  fontSize: "13px",
                  fontWeight: 500,
                  cursor: isSendingWelcome ? "not-allowed" : "pointer",
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmSendWelcome}
                disabled={isSendingWelcome}
                style={{
                  backgroundColor: "#841014",
                  color: "#ffffff",
                  border: "none",
                  padding: "10px 22px",
                  borderRadius: "6px",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: isSendingWelcome ? "not-allowed" : "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  boxShadow: "0 4px 12px rgba(132, 16, 20, 0.25)",
                }}
              >
                <FiSend size={14} />
                <span>{isSendingWelcome ? "Sending..." : "Send Welcome"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── CUSTOM MODAL 2: DELETE SUBSCRIBER CONFIRMATION ───────────── */}
      {deleteTarget && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(15, 23, 42, 0.7)",
            backdropFilter: "blur(4px)",
            WebkitBackdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "20px",
          }}
          onClick={() => {
            if (!isDeleting) setDeleteTarget(null);
          }}
        >
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "14px",
              width: "100%",
              maxWidth: "460px",
              padding: "26px",
              boxShadow: "0 25px 50px -12px rgba(0,0,0,0.3)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "10px",
                  backgroundColor: "#FEF2F2",
                  color: "#DC2626",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <FiAlertTriangle size={22} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: "18px", color: "#1F2A44", fontFamily: "Georgia, serif" }}>
                  Delete Subscriber?
                </h3>
                <span style={{ fontSize: "12px", color: "#64748B" }}>
                  Permanent Database Action
                </span>
              </div>
            </div>

            <p style={{ margin: "0 0 18px", fontSize: "14px", color: "#475569", lineHeight: "1.6" }}>
              Are you sure you want to remove{" "}
              <strong style={{ color: "#1F2A44" }}>{deleteTarget.email}</strong> from the festival subscriber list?
            </p>

            <div
              style={{
                backgroundColor: "#FFFBEB",
                border: "1px solid #FDE68A",
                borderRadius: "8px",
                padding: "12px 14px",
                marginBottom: "22px",
                fontSize: "12px",
                color: "#92400E",
              }}
            >
              ⚠️ This will remove them from all future newsletters and broadcast campaigns. This action cannot be undone.
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                disabled={isDeleting}
                style={{
                  backgroundColor: "#F1F5F9",
                  color: "#475569",
                  border: "none",
                  padding: "10px 18px",
                  borderRadius: "6px",
                  fontSize: "13px",
                  fontWeight: 500,
                  cursor: isDeleting ? "not-allowed" : "pointer",
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                style={{
                  backgroundColor: "#DC2626",
                  color: "#ffffff",
                  border: "none",
                  padding: "10px 22px",
                  borderRadius: "6px",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: isDeleting ? "not-allowed" : "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  boxShadow: "0 4px 12px rgba(220, 38, 38, 0.25)",
                }}
              >
                <FiTrash2 size={14} />
                <span>{isDeleting ? "Deleting..." : "Yes, Delete Subscriber"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

