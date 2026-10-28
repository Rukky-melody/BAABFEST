"use client";

import React, { useState, useEffect } from "react";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiX,
  FiUser,
} from "react-icons/fi";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string | null;
  imageUrl: string | null;
  order: number;
}

export default function TeamAdminPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    role: "",
    bio: "",
    imageUrl: "",
    order: 0,
  });

  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/team");
      const data = await res.json();
      if (Array.isArray(data)) {
        setMembers(data);
      }
    } catch (err) {
      console.error("Error loading team members:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const openAddModal = () => {
    setEditingMember(null);
    setFormData({
      name: "",
      role: "",
      bio: "",
      imageUrl: "",
      order: members.length,
    });
    setErrorMessage("");
    setIsModalOpen(true);
  };

  const openEditModal = (member: TeamMember) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      role: member.role,
      bio: member.bio || "",
      imageUrl: member.imageUrl || "",
      order: member.order,
    });
    setErrorMessage("");
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSaving(true);

    try {
      const url = editingMember
        ? `/api/admin/team/${editingMember.id}`
        : "/api/admin/team";
      const method = editingMember ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          role: formData.role,
          bio: formData.bio,
          imageUrl: formData.imageUrl,
          order: Number(formData.order),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setIsModalOpen(false);
        fetchMembers();
      } else {
        setErrorMessage(data.error || "Failed to save team member.");
      }
    } catch {
      setErrorMessage("An unexpected network error occurred.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to remove ${name} from the team?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/team/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchMembers();
      } else {
        alert("Failed to delete team member.");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Error deleting team member.");
    }
  };

  return (
    <div style={{ maxWidth: "1100px" }}>
      {/* Top Header with Add Action */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "32px",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div>
          <h2
            style={{
              margin: "0 0 6px",
              fontFamily: "Georgia, serif",
              fontSize: "26px",
              color: "#1F2A44",
            }}
          >
            Meet the Team Management
          </h2>
          <p style={{ margin: 0, fontSize: "14px", color: "#64748B" }}>
            Add, update member photos, roles, and bio write-ups displayed on the homepage.
          </p>
        </div>

        <button
          onClick={openAddModal}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            backgroundColor: "#841014",
            color: "#ffffff",
            padding: "12px 20px",
            borderRadius: "8px",
            border: "none",
            fontSize: "14px",
            fontWeight: 600,
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(132, 16, 20, 0.2)",
          }}
        >
          <FiPlus size={16} />
          <span>Add Team Member</span>
        </button>
      </div>

      {/* Member Cards Grid */}
      {loading ? (
        <div style={{ padding: "60px 0", textAlign: "center", color: "#64748B" }}>
          Loading team members...
        </div>
      ) : members.length === 0 ? (
        <div
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "12px",
            padding: "48px 24px",
            textAlign: "center",
            border: "1px dashed #CBD5E1",
          }}
        >
          <p style={{ margin: "0 0 16px", color: "#64748B" }}>No team members found yet.</p>
          <button
            onClick={openAddModal}
            style={{
              backgroundColor: "#1F2A44",
              color: "#ffffff",
              padding: "10px 18px",
              borderRadius: "6px",
              border: "none",
              fontSize: "14px",
              cursor: "pointer",
            }}
          >
            Add Your First Team Member
          </button>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: "24px",
          }}
        >
          {members.map((member) => (
            <div
              key={member.id}
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "12px",
                border: "1px solid rgba(43,43,43,0.12)",
                overflow: "hidden",
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                display: "flex",
                flexDirection: "column",
                transition: "transform 0.15s ease, box-shadow 0.15s ease",
              }}
            >
              {/* Photo & Top Bar */}
              <div
                style={{
                  height: "200px",
                  backgroundColor: "#E2E8F0",
                  position: "relative",
                  backgroundImage: member.imageUrl ? `url(${member.imageUrl})` : undefined,
                  backgroundSize: "cover",
                  backgroundPosition: "center top",
                }}
              >
                {!member.imageUrl && (
                  <div
                    style={{
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#94A3B8",
                    }}
                  >
                    <FiUser size={48} />
                  </div>
                )}
                {/* Order Badge */}
                <div
                  style={{
                    position: "absolute",
                    top: "12px",
                    left: "12px",
                    backgroundColor: "rgba(31, 42, 68, 0.85)",
                    color: "#F0C823",
                    padding: "4px 10px",
                    borderRadius: "12px",
                    fontSize: "11px",
                    fontWeight: 700,
                    backdropFilter: "blur(4px)",
                  }}
                >
                  #{member.order + 1}
                </div>
              </div>

              {/* Content Details */}
              <div style={{ padding: "20px", flex: 1, display: "flex", flexDirection: "column" }}>
                <h3
                  style={{
                    margin: "0 0 4px",
                    fontFamily: "Georgia, serif",
                    fontSize: "19px",
                    color: "#1F2A44",
                  }}
                >
                  {member.name}
                </h3>
                <span
                  style={{
                    display: "inline-block",
                    fontSize: "12px",
                    fontWeight: 700,
                    color: "#A8471F",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    marginBottom: "12px",
                  }}
                >
                  {member.role}
                </span>

                <p
                  style={{
                    margin: "0 0 20px",
                    fontSize: "13px",
                    lineHeight: 1.6,
                    color: "#475569",
                    flex: 1,
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {member.bio || "No write-up provided yet."}
                </p>

                {/* Actions Footer */}
                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    paddingTop: "16px",
                    borderTop: "1px solid #F1F5F9",
                  }}
                >
                  <button
                    onClick={() => openEditModal(member)}
                    style={{
                      flex: 1,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px",
                      padding: "9px 12px",
                      backgroundColor: "#F1F5F9",
                      color: "#1E293B",
                      border: "1px solid #CBD5E1",
                      borderRadius: "6px",
                      fontSize: "13px",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    <FiEdit2 size={13} />
                    <span>Edit Member</span>
                  </button>

                  <button
                    onClick={() => handleDelete(member.id, member.name)}
                    style={{
                      padding: "9px 12px",
                      backgroundColor: "#FEF2F2",
                      color: "#DC2626",
                      border: "1px solid #FECACA",
                      borderRadius: "6px",
                      fontSize: "13px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    title="Delete member"
                  >
                    <FiTrash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ─── ADD / EDIT MODAL ────────────────────────────────────────── */}
      {isModalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(15, 23, 42, 0.65)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "20px",
          }}
        >
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "14px",
              width: "100%",
              maxWidth: "580px",
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "20px 24px",
                borderBottom: "1px solid #E2E8F0",
              }}
            >
              <h3
                style={{
                  margin: 0,
                  fontFamily: "Georgia, serif",
                  fontSize: "18px",
                  color: "#1F2A44",
                }}
              >
                {editingMember ? `Edit Team Member: ${editingMember.name}` : "Add New Team Member"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: "#64748B",
                  padding: "4px",
                }}
              >
                <FiX size={20} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} style={{ padding: "24px" }}>
              {errorMessage && (
                <div
                  style={{
                    backgroundColor: "#FEF2F2",
                    color: "#991B1B",
                    padding: "12px",
                    borderRadius: "8px",
                    fontSize: "13px",
                    marginBottom: "16px",
                  }}
                >
                  {errorMessage}
                </div>
              )}

              {/* Name */}
              <div style={{ marginBottom: "16px" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "11px",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    color: "#64748B",
                    textTransform: "uppercase",
                    marginBottom: "6px",
                  }}
                >
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Eki Eboigbe"
                  required
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "6px",
                    border: "1px solid #CBD5E1",
                    fontSize: "14px",
                    backgroundColor: "#F8FAFC",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              {/* Role */}
              <div style={{ marginBottom: "16px" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "11px",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    color: "#64748B",
                    textTransform: "uppercase",
                    marginBottom: "6px",
                  }}
                >
                  Role / Title *
                </label>
                <input
                  type="text"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  placeholder="e.g. Festival Curator"
                  required
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "6px",
                    border: "1px solid #CBD5E1",
                    fontSize: "14px",
                    backgroundColor: "#F8FAFC",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              {/* Bio / Writeup */}
              <div style={{ marginBottom: "16px" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "11px",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    color: "#64748B",
                    textTransform: "uppercase",
                    marginBottom: "6px",
                  }}
                >
                  Bio / Writeup *
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Write a brief profile about their role and background in the festival..."
                  rows={4}
                  required
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "6px",
                    border: "1px solid #CBD5E1",
                    fontSize: "14px",
                    backgroundColor: "#F8FAFC",
                    boxSizing: "border-box",
                    lineHeight: 1.5,
                  }}
                />
              </div>

              {/* Photo URL */}
              <div style={{ marginBottom: "16px" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "11px",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    color: "#64748B",
                    textTransform: "uppercase",
                    marginBottom: "6px",
                  }}
                >
                  Photo Image URL
                </label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/photo-..."
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "6px",
                    border: "1px solid #CBD5E1",
                    fontSize: "14px",
                    backgroundColor: "#F8FAFC",
                    boxSizing: "border-box",
                  }}
                />
                {/* Photo Live Preview */}
                {formData.imageUrl && (
                  <div style={{ marginTop: "10px", display: "flex", alignItems: "center", gap: "12px" }}>
                    <div
                      style={{
                        width: "60px",
                        height: "60px",
                        borderRadius: "8px",
                        backgroundImage: `url(${formData.imageUrl})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        border: "1px solid #CBD5E1",
                        flexShrink: 0,
                      }}
                    />
                    <span style={{ fontSize: "12px", color: "#64748B" }}>
                      Previewing live photo URL
                    </span>
                  </div>
                )}
              </div>

              {/* Order */}
              <div style={{ marginBottom: "24px" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "11px",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    color: "#64748B",
                    textTransform: "uppercase",
                    marginBottom: "6px",
                  }}
                >
                  Display Order
                </label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value, 10) || 0 })}
                  style={{
                    width: "120px",
                    padding: "10px 14px",
                    borderRadius: "6px",
                    border: "1px solid #CBD5E1",
                    fontSize: "14px",
                    backgroundColor: "#F8FAFC",
                  }}
                />
                <span style={{ marginLeft: "12px", fontSize: "12px", color: "#94A3B8" }}>
                  Lower numbers appear first (0, 1, 2...)
                </span>
              </div>

              {/* Modal Footer */}
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{
                    padding: "10px 18px",
                    borderRadius: "6px",
                    border: "1px solid #CBD5E1",
                    backgroundColor: "#ffffff",
                    color: "#475569",
                    fontSize: "14px",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  style={{
                    padding: "10px 22px",
                    borderRadius: "6px",
                    border: "none",
                    backgroundColor: "#841014",
                    color: "#ffffff",
                    fontSize: "14px",
                    fontWeight: 600,
                    cursor: saving ? "not-allowed" : "pointer",
                    opacity: saving ? 0.7 : 1,
                  }}
                >
                  {saving ? "Saving..." : editingMember ? "Save Changes" : "Create Member"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

