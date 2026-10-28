"use client";

import React, { useState, useEffect } from "react";
import {
  FiPlus,
  FiTrash2,
  FiEdit2,
  FiImage,
  FiLink,
  FiX,
  FiFolder,
} from "react-icons/fi";

interface Archive {
  id: string;
  year: string;
  theme: string;
  images: string[];
  driveLink: string | null;
  createdAt: string;
}

export default function ArchivesAdmin() {
  const [archives, setArchives] = useState<Archive[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArchive, setEditingArchive] = useState<Archive | null>(null);

  const [formData, setFormData] = useState({
    year: "",
    theme: "",
    images: [] as string[],
    driveLink: "",
  });

  const [newImageUrl, setNewImageUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchArchives = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/admin/archives");
      const data = await response.json();
      if (Array.isArray(data)) {
        setArchives(data);
      }
    } catch (error) {
      console.error("Failed to fetch archives:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchArchives();
  }, []);

  const handleAddImage = () => {
    if (newImageUrl.trim() && formData.images.length < 12) {
      setFormData({
        ...formData,
        images: [...formData.images, newImageUrl.trim()],
      });
      setNewImageUrl("");
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSaving(true);

    try {
      const url = editingArchive
        ? `/api/admin/archives/${editingArchive.id}`
        : "/api/admin/archives";
      const method = editingArchive ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsModalOpen(false);
        setEditingArchive(null);
        setFormData({ year: "", theme: "", images: [], driveLink: "" });
        fetchArchives();
      } else {
        const error = await response.json();
        setErrorMessage(error.error || "Something went wrong saving the archive.");
      }
    } catch (error) {
      console.error("Failed to save archive:", error);
      setErrorMessage("Network error saving archive.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, year: string) => {
    if (window.confirm(`Are you sure you want to delete the archive for ${year}?`)) {
      try {
        await fetch(`/api/admin/archives/${id}`, { method: "DELETE" });
        fetchArchives();
      } catch (error) {
        console.error("Failed to delete archive:", error);
      }
    }
  };

  const openEditModal = (archive: Archive) => {
    setEditingArchive(archive);
    setFormData({
      year: archive.year,
      theme: archive.theme,
      images: archive.images || [],
      driveLink: archive.driveLink || "",
    });
    setErrorMessage("");
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setEditingArchive(null);
    setFormData({ year: "", theme: "", images: [], driveLink: "" });
    setErrorMessage("");
    setIsModalOpen(true);
  };

  return (
    <div style={{ maxWidth: "1100px" }}>
      {/* Top Header */}
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
            Festival Archives
          </h2>
          <p style={{ margin: 0, fontSize: "14px", color: "#64748B" }}>
            Manage past festival editions, official themes, gallery photos, and Google Drive archive links.
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
          <span>Add Archive Edition</span>
        </button>
      </div>

      {/* Archives Grid */}
      {isLoading ? (
        <div style={{ padding: "60px 0", textAlign: "center", color: "#64748B" }}>
          Loading festival archives...
        </div>
      ) : archives.length === 0 ? (
        <div
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "12px",
            padding: "48px 24px",
            textAlign: "center",
            border: "1px dashed #CBD5E1",
          }}
        >
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "50%",
              backgroundColor: "#F1F5F9",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
              color: "#64748B",
            }}
          >
            <FiFolder size={26} />
          </div>
          <h3 style={{ margin: "0 0 6px", fontFamily: "Georgia, serif", color: "#1F2A44" }}>
            No Festival Archives Added
          </h3>
          <p style={{ margin: "0 0 20px", color: "#64748B", fontSize: "14px" }}>
            Create an archive edition to preserve festival photos and themes for attendees to browse.
          </p>
          <button
            onClick={openAddModal}
            style={{
              backgroundColor: "#1F2A44",
              color: "#ffffff",
              padding: "11px 20px",
              borderRadius: "6px",
              border: "none",
              fontSize: "14px",
              cursor: "pointer",
            }}
          >
            Add First Edition (e.g. 2024 / 2025)
          </button>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
            gap: "24px",
          }}
        >
          {archives.map((archive) => (
            <div
              key={archive.id}
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "12px",
                border: "1px solid rgba(43,43,43,0.12)",
                overflow: "hidden",
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* Cover Photo */}
              <div
                style={{
                  height: "190px",
                  backgroundColor: "#E2E8F0",
                  position: "relative",
                  backgroundImage: archive.images.length > 0 ? `url(${archive.images[0]})` : undefined,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                {archive.images.length === 0 && (
                  <div
                    style={{
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#94A3B8",
                    }}
                  >
                    <FiImage size={40} />
                  </div>
                )}
                {/* Year Pill */}
                <div
                  style={{
                    position: "absolute",
                    top: "12px",
                    left: "12px",
                    backgroundColor: "#1F2A44",
                    color: "#F0C823",
                    padding: "4px 12px",
                    borderRadius: "14px",
                    fontSize: "12px",
                    fontWeight: 700,
                    letterSpacing: "0.04em",
                  }}
                >
                  {archive.year} Edition
                </div>

                {/* Photo Count */}
                <div
                  style={{
                    position: "absolute",
                    bottom: "12px",
                    right: "12px",
                    backgroundColor: "rgba(0,0,0,0.65)",
                    color: "#ffffff",
                    padding: "3px 10px",
                    borderRadius: "10px",
                    fontSize: "11px",
                    backdropFilter: "blur(4px)",
                  }}
                >
                  📷 {archive.images.length} Photos
                </div>
              </div>

              {/* Body Details */}
              <div style={{ padding: "22px", flex: 1, display: "flex", flexDirection: "column" }}>
                <h3
                  style={{
                    margin: "0 0 10px",
                    fontFamily: "Georgia, serif",
                    fontSize: "19px",
                    color: "#1F2A44",
                    lineHeight: 1.35,
                  }}
                >
                  {archive.theme}
                </h3>

                {archive.driveLink && (
                  <a
                    href={archive.driveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      fontSize: "12px",
                      color: "#A8471F",
                      fontWeight: 600,
                      textDecoration: "none",
                      marginBottom: "16px",
                    }}
                  >
                    <FiLink size={13} />
                    <span>Open Full Google Drive Archive ↗</span>
                  </a>
                )}

                {/* Thumbnails preview */}
                {archive.images.length > 1 && (
                  <div style={{ display: "flex", gap: "6px", marginBottom: "18px" }}>
                    {archive.images.slice(1, 5).map((img, i) => (
                      <div
                        key={i}
                        style={{
                          width: "44px",
                          height: "44px",
                          borderRadius: "6px",
                          backgroundImage: `url(${img})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                          border: "1px solid #E2E8F0",
                        }}
                      />
                    ))}
                    {archive.images.length > 5 && (
                      <div
                        style={{
                          width: "44px",
                          height: "44px",
                          borderRadius: "6px",
                          backgroundColor: "#F1F5F9",
                          color: "#64748B",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "11px",
                          fontWeight: 700,
                        }}
                      >
                        +{archive.images.length - 5}
                      </div>
                    )}
                  </div>
                )}

                {/* Actions Footer */}
                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    marginTop: "auto",
                    paddingTop: "16px",
                    borderTop: "1px solid #F1F5F9",
                  }}
                >
                  <button
                    onClick={() => openEditModal(archive)}
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
                    <span>Edit Edition</span>
                  </button>

                  <button
                    onClick={() => handleDelete(archive.id, archive.year)}
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
                    title="Delete edition"
                  >
                    <FiTrash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ─── ADD / EDIT ARCHIVE MODAL ─────────────────────────────────── */}
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
              maxWidth: "640px",
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
                {editingArchive ? `Edit Archive Edition: ${editingArchive.year}` : "Add New Festival Archive"}
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

              {/* Year & Theme Row */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "140px 1fr",
                  gap: "16px",
                  marginBottom: "16px",
                }}
              >
                <div>
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
                    Festival Year *
                  </label>
                  <input
                    type="text"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    placeholder="2025"
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

                <div>
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
                    Festival Theme *
                  </label>
                  <input
                    type="text"
                    value={formData.theme}
                    onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
                    placeholder="e.g. Voices Across Time: Ancestral Echoes"
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
              </div>

              {/* Google Drive Link */}
              <div style={{ marginBottom: "20px" }}>
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
                  Google Drive Folder Link (Optional)
                </label>
                <input
                  type="url"
                  value={formData.driveLink}
                  onChange={(e) => setFormData({ ...formData, driveLink: e.target.value })}
                  placeholder="https://drive.google.com/drive/folders/..."
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

              {/* Photo URLs List (Matching Rongo Foundation CMS Style) */}
              <div style={{ marginBottom: "24px" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "11px",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    color: "#64748B",
                    textTransform: "uppercase",
                    marginBottom: "8px",
                  }}
                >
                  Gallery Photos ({formData.images.length}/12)
                </label>

                {/* Input row */}
                <div style={{ display: "flex", gap: "8px", marginBottom: "14px" }}>
                  <input
                    type="url"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    placeholder="Paste image URL (https://...)"
                    disabled={formData.images.length >= 12}
                    style={{
                      flex: 1,
                      padding: "10px 14px",
                      borderRadius: "6px",
                      border: "1px solid #CBD5E1",
                      fontSize: "14px",
                      backgroundColor: "#F8FAFC",
                      boxSizing: "border-box",
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddImage}
                    disabled={!newImageUrl.trim() || formData.images.length >= 12}
                    style={{
                      padding: "10px 18px",
                      backgroundColor: "#1F2A44",
                      color: "#ffffff",
                      borderRadius: "6px",
                      border: "none",
                      fontSize: "13px",
                      fontWeight: 600,
                      cursor: !newImageUrl.trim() ? "not-allowed" : "pointer",
                      opacity: !newImageUrl.trim() ? 0.6 : 1,
                      whiteSpace: "nowrap",
                    }}
                  >
                    Add Photo
                  </button>
                </div>

                {/* Image List Items with Red Trash Bins (matching mock screenshot) */}
                {formData.images.length > 0 ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {formData.images.map((url, index) => (
                      <div
                        key={index}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                          padding: "8px 12px",
                          backgroundColor: "#F8FAFC",
                          border: "1px solid #E2E8F0",
                          borderRadius: "8px",
                        }}
                      >
                        <div
                          style={{
                            width: "48px",
                            height: "48px",
                            borderRadius: "6px",
                            backgroundImage: `url(${url})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            border: "1px solid #CBD5E1",
                            flexShrink: 0,
                          }}
                        />
                        <span
                          style={{
                            flex: 1,
                            fontSize: "13px",
                            color: "#334155",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {url}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          style={{
                            width: "34px",
                            height: "34px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: "#FEE2E2",
                            border: "1px solid #FCA5A5",
                            borderRadius: "6px",
                            color: "#DC2626",
                            cursor: "pointer",
                            flexShrink: 0,
                          }}
                          title="Remove photo"
                        >
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ margin: 0, fontSize: "12px", color: "#94A3B8", fontStyle: "italic" }}>
                    No photos added yet. Paste image URLs above to populate this edition's gallery.
                  </p>
                )}
              </div>

              {/* Modal Footer */}
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", paddingTop: "12px", borderTop: "1px solid #E2E8F0" }}>
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
                  {saving ? "Saving..." : editingArchive ? "Save Changes" : "Create Archive"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
