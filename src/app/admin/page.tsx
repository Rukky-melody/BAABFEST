import React from "react";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { FiUsers, FiArchive, FiMail, FiFileText, FiArrowRight, FiShield } from "react-icons/fi";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [teamCount, archiveCount, subscriberCount, applicationCount] = await Promise.all([
    prisma.teamMember.count(),
    prisma.festivalArchive.count(),
    prisma.subscriber.count(),
    prisma.application.count(),
  ]);

  const cards = [
    {
      label: "Our Team",
      count: teamCount,
      desc: "Active team members and curators",
      href: "/admin/team",
      icon: FiUsers,
      color: "#841014",
    },
    {
      label: "Festival Archives",
      count: archiveCount,
      desc: "Archived festival editions and galleries",
      href: "/admin/archives",
      icon: FiArchive,
      color: "#A8471F",
    },
    {
      label: "Subscribers",
      count: subscriberCount,
      desc: "Newsletter audience and welcomed attendees",
      href: "/admin/subscribers",
      icon: FiMail,
      color: "#1F2A44",
    },
    {
      label: "Applications",
      count: applicationCount,
      desc: "Volunteer and vendor requests",
      href: "/admin/applications",
      icon: FiFileText,
      color: "#64748B",
    },
  ];

  return (
    <div style={{ maxWidth: "1100px" }}>
      {/* Header */}
      <div style={{ marginBottom: "32px" }}>
        <h2
          style={{
            margin: "0 0 6px",
            fontFamily: "Georgia, serif",
            fontSize: "26px",
            color: "#1F2A44",
          }}
        >
          CMS Overview
        </h2>
        <p style={{ margin: 0, fontSize: "14px", color: "#64748B" }}>
          Welcome back to the Benin Arts &amp; Books Festival management portal.
        </p>
      </div>

      {/* Metric Cards Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: "20px",
          marginBottom: "36px",
        }}
      >
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.label}
              href={card.href}
              style={{
                textDecoration: "none",
                backgroundColor: "#ffffff",
                borderRadius: "12px",
                border: "1px solid rgba(43,43,43,0.12)",
                padding: "24px",
                boxShadow: "0 2px 6px rgba(0,0,0,0.03)",
                display: "flex",
                flexDirection: "column",
                transition: "transform 0.15s ease, box-shadow 0.15s ease",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "16px",
                }}
              >
                <div
                  style={{
                    width: "42px",
                    height: "42px",
                    borderRadius: "8px",
                    backgroundColor: `${card.color}15`,
                    color: card.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon size={20} />
                </div>
                <FiArrowRight size={16} style={{ color: "#CBD5E1" }} />
              </div>

              <div
                style={{
                  fontSize: "32px",
                  fontWeight: 700,
                  color: "#1F2A44",
                  fontFamily: "Georgia, serif",
                  lineHeight: 1,
                  marginBottom: "6px",
                }}
              >
                {card.count}
              </div>

              <div style={{ fontSize: "14px", fontWeight: 600, color: "#1E293B", marginBottom: "4px" }}>
                {card.label}
              </div>

              <div style={{ fontSize: "12px", color: "#64748B", lineHeight: 1.4 }}>
                {card.desc}
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions Card */}
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          border: "1px solid rgba(43,43,43,0.12)",
          padding: "28px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.03)",
        }}
      >
        <h3
          style={{
            margin: "0 0 16px",
            fontFamily: "Georgia, serif",
            fontSize: "18px",
            color: "#1F2A44",
          }}
        >
          Quick Shortcuts
        </h3>

        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <Link
            href="/admin/team"
            style={{
              padding: "10px 18px",
              backgroundColor: "#1F2A44",
              color: "#ffffff",
              borderRadius: "6px",
              fontSize: "13px",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Update Team Members →
          </Link>

          <Link
            href="/admin/archives"
            style={{
              padding: "10px 18px",
              backgroundColor: "#A8471F",
              color: "#ffffff",
              borderRadius: "6px",
              fontSize: "13px",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Manage Festival Archives →
          </Link>

          <Link
            href="/admin/settings"
            style={{
              padding: "10px 18px",
              backgroundColor: "#F1F5F9",
              color: "#1E293B",
              border: "1px solid #CBD5E1",
              borderRadius: "6px",
              fontSize: "13px",
              fontWeight: 600,
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <FiShield size={14} />
            <span>Change Admin Password</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
