import React from "react";
import SendWelcomeButton from "./SendWelcomeButton";
import DeleteSubscriberButton from "./DeleteSubscriberButton";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function SubscribersPage() {
  const subscribers = await prisma.subscriber.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div style={{ maxWidth: "1100px" }}>
      <div style={{ marginBottom: "28px" }}>
        <h2
          style={{
            margin: "0 0 6px",
            fontFamily: "Georgia, serif",
            fontSize: "26px",
            color: "#1F2A44",
          }}
        >
          Newsletter Subscribers
        </h2>
        <p style={{ margin: 0, fontSize: "14px", color: "#64748B" }}>
          Review audience sign-ups, manually trigger welcome emails, or manage subscriber list.
        </p>
      </div>

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
                  No subscribers yet.
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
                      <SendWelcomeButton subscriberId={sub.id} currentStatus={sub.status} />
                      <DeleteSubscriberButton subscriberId={sub.id} email={sub.email} />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
