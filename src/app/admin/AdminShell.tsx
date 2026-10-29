"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FiUsers,
  FiArchive,
  FiFileText,
  FiMail,
  FiSettings,
  FiLogOut,
  FiHome,
  FiExternalLink,
} from "react-icons/fi";

const NAV_ITEMS = [
  { label: "Overview", href: "/admin", icon: FiHome },
  { label: "Our Team", href: "/admin/team", icon: FiUsers },
  { label: "Festival Archives", href: "/admin/archives", icon: FiArchive },
  { label: "Applications", href: "/admin/applications", icon: FiFileText },
  { label: "Subscribers", href: "/admin/subscribers", icon: FiMail },
  { label: "Settings", href: "/admin/settings", icon: FiSettings },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [adminEmail, setAdminEmail] = useState<string>("admin@baabfest.com");
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (isLoginPage) {
      setIsCheckingAuth(false);
      return;
    }

    // Check auth status
    fetch("/api/admin/auth/me")
      .then((res) => {
        if (!res.ok) {
          router.push("/admin/login");
        } else {
          return res.json();
        }
      })
      .then((data) => {
        if (data?.user?.email) {
          setAdminEmail(data.user.email);
        }
        setIsCheckingAuth(false);
      })
      .catch(() => {
        router.push("/admin/login");
      });
  }, [pathname, isLoginPage, router]);

  const handleSignOut = async () => {
    try {
      await fetch("/api/admin/auth/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch (err) {
      console.error("Sign out error:", err);
      router.push("/admin/login");
    }
  };

  // If on login page, render children without sidebar
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Prevent flash of protected content while verifying session
  if (isCheckingAuth) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#F4EFE8",
          color: "#841014",
          fontFamily: "Georgia, serif",
          fontSize: "18px",
        }}
      >
        Loading BAABFEST CMS...
      </div>
    );
  }

  // Determine current page title for top bar
  const currentNav = NAV_ITEMS.find(
    (item) => item.href === pathname || (item.href !== "/admin" && pathname.startsWith(item.href))
  );
  const pageTitle = currentNav?.label || "Content Management";

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "#F8F6F2",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      {/* ─── SIDEBAR (Matching Rongo CMS Style) ──────────────────────── */}
      <aside
        style={{
          width: "260px",
          backgroundColor: "#1F2A44",
          color: "#F4EFE8",
          display: "flex",
          flexDirection: "column",
          flexShrink: 0,
          borderRight: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {/* Brand Header */}
        <div style={{ padding: "30px 24px 24px" }}>
          <h2
            style={{
              margin: 0,
              fontFamily: "Georgia, serif",
              fontSize: "20px",
              fontWeight: 700,
              color: "#F4EFE8",
              letterSpacing: "0.02em",
            }}
          >
            BAABFEST
          </h2>
          <p
            style={{
              margin: "6px 0 0",
              fontSize: "10px",
              color: "#8B9DAF",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              fontWeight: 600,
            }}
          >
            Content Management
          </p>
        </div>

        {/* Navigation Links */}
        <nav
          style={{
            flex: 1,
            padding: "10px 16px",
            display: "flex",
            flexDirection: "column",
            gap: "4px",
          }}
        >
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === pathname ||
              (item.href !== "/admin" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "11px 14px",
                  borderRadius: "8px",
                  textDecoration: "none",
                  fontSize: "14px",
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? "#F0C823" : "#CBD5E1",
                  backgroundColor: isActive ? "rgba(255, 255, 255, 0.08)" : "transparent",
                  transition: "all 0.15s ease",
                }}
              >
                <Icon size={18} style={{ color: isActive ? "#F0C823" : "#94A3B8" }} />
                <span>{item.label}</span>
              </Link>
            );
          })}

          {/* View Live Site button in sidebar */}
          <div style={{ marginTop: "auto", paddingTop: "12px" }}>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "10px 14px",
                borderRadius: "8px",
                textDecoration: "none",
                fontSize: "13px",
                color: "#94A3B8",
                backgroundColor: "rgba(255, 255, 255, 0.04)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                transition: "all 0.2s ease",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#F0C823";
                e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "#94A3B8";
                e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.04)";
              }}
            >
              <FiExternalLink size={16} />
              <span>View Live Site</span>
            </a>
          </div>
        </nav>

        {/* Sidebar Footer (Signed in as + Sign out) */}
        <div
          style={{
            padding: "20px",
            borderTop: "1px solid rgba(255, 255, 255, 0.08)",
            backgroundColor: "rgba(0,0,0,0.15)",
          }}
        >
          <div style={{ marginBottom: "12px" }}>
            <span
              style={{
                display: "block",
                fontSize: "11px",
                color: "#8B9DAF",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              Signed in as
            </span>
            <span
              style={{
                display: "block",
                fontSize: "12px",
                color: "#E2E8F0",
                fontWeight: 500,
                marginTop: "2px",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {adminEmail}
            </span>
          </div>

          <button
            onClick={handleSignOut}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              padding: "10px",
              backgroundColor: "rgba(132, 16, 20, 0.25)",
              color: "#FCA5A5",
              border: "1px solid rgba(132, 16, 20, 0.4)",
              borderRadius: "6px",
              fontSize: "13px",
              fontWeight: 500,
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
          >
            <FiLogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ─── MAIN CONTENT AREA ───────────────────────────────────────── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {/* Top Header Bar */}
        <header
          style={{
            height: "70px",
            backgroundColor: "#ffffff",
            borderBottom: "1px solid rgba(43,43,43,0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 36px",
            flexShrink: 0,
            position: "relative",
            zIndex: 40,
          }}
        >
          <h1
            style={{
              margin: 0,
              fontFamily: "Georgia, serif",
              fontSize: "22px",
              fontWeight: 600,
              color: "#1F2A44",
            }}
          >
            {pageTitle}
          </h1>

          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            {/* CMS Active status pill matching mock */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "6px 14px",
                borderRadius: "20px",
                backgroundColor: "#ECFDF5",
                border: "1px solid #A7F3D0",
                fontSize: "12px",
                fontWeight: 600,
                color: "#065F46",
              }}
            >
              <span
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  backgroundColor: "#10B981",
                  display: "inline-block",
                }}
              />
              <span>CMS Active</span>
            </div>
          </div>
        </header>

        {/* Main Body */}
        <main style={{ flex: 1, padding: "36px", overflowY: "auto" }}>
          {children}
        </main>
      </div>
    </div>
  );
}

