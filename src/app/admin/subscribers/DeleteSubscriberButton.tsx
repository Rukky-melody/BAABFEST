"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FiTrash2 } from "react-icons/fi";

export default function DeleteSubscriberButton({
  subscriberId,
  email,
}: {
  subscriberId: string;
  email: string;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to remove "${email}" from the subscriber list?`
    );
    if (!confirmed) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/admin/subscribers/${subscriberId}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (res.ok) {
        router.refresh();
      } else {
        alert(data.error || "Failed to delete subscriber.");
      }
    } catch (err: any) {
      alert(err?.message || "An error occurred while deleting subscriber.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={loading}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "4px",
        padding: "6px 11px",
        backgroundColor: "#FEF2F2",
        color: "#DC2626",
        border: "1px solid #FECACA",
        borderRadius: "4px",
        cursor: loading ? "not-allowed" : "pointer",
        fontWeight: 600,
        fontSize: "0.82rem",
        transition: "all 0.15s ease",
      }}
      title={`Delete ${email}`}
    >
      <FiTrash2 size={13} />
      <span>{loading ? "Deleting..." : "Delete"}</span>
    </button>
  );
}

