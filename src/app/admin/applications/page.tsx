import React from "react";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function ApplicationsPage() {
  const applications = await prisma.application.findMany({
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
          Festival Applications
        </h2>
        <p style={{ margin: 0, fontSize: "14px", color: "#64748B" }}>
          Review submissions from festival volunteers, vendors, and community applicants.
        </p>
      </div>

      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          border: "1px solid rgba(43,43,43,0.12)",
          overflow: "hidden",
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
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
              <th style={{ padding: "16px 20px" }}>Applicant Name</th>
              <th style={{ padding: "16px 20px" }}>Type</th>
              <th style={{ padding: "16px 20px" }}>Email</th>
              <th style={{ padding: "16px 20px" }}>Message / Statement</th>
              <th style={{ padding: "16px 20px" }}>Date</th>
              <th style={{ padding: "16px 20px" }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {applications.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  style={{
                    padding: "48px 24px",
                    textAlign: "center",
                    color: "#94A3B8",
                    fontSize: "14px",
                  }}
                >
                  No applications received yet.
                </td>
              </tr>
            ) : (
              applications.map((app) => (
                <tr
                  key={app.id}
                  style={{
                    borderBottom: "1px solid #F1F5F9",
                    fontSize: "14px",
                  }}
                >
                  <td style={{ padding: "16px 20px", fontWeight: 600, color: "#1E293B" }}>
                    {app.name}
                  </td>
                  <td style={{ padding: "16px 20px" }}>
                    <span
                      style={{
                        padding: "3px 10px",
                        borderRadius: "12px",
                        fontSize: "11px",
                        fontWeight: 700,
                        backgroundColor: app.type === "VENDOR" ? "#FEF3C7" : "#E0F2FE",
                        color: app.type === "VENDOR" ? "#92400E" : "#0369A1",
                      }}
                    >
                      {app.type}
                    </span>
                  </td>
                  <td style={{ padding: "16px 20px", color: "#475569" }}>
                    {app.email}
                  </td>
                  <td style={{ padding: "16px 20px", color: "#334155", maxWidth: "300px" }}>
                    {app.message}
                  </td>
                  <td style={{ padding: "16px 20px", color: "#64748B", fontSize: "13px" }}>
                    {new Date(app.createdAt).toLocaleDateString()}
                  </td>
                  <td style={{ padding: "16px 20px" }}>
                    <span
                      style={{
                        padding: "4px 10px",
                        borderRadius: "12px",
                        fontSize: "11px",
                        fontWeight: 700,
                        backgroundColor:
                          app.status === "APPROVED"
                            ? "#DCFCE7"
                            : app.status === "REJECTED"
                            ? "#FEE2E2"
                            : "#FEF9C3",
                        color:
                          app.status === "APPROVED"
                            ? "#15803D"
                            : app.status === "REJECTED"
                            ? "#B91C1C"
                            : "#854D0E",
                      }}
                    >
                      {app.status}
                    </span>
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
