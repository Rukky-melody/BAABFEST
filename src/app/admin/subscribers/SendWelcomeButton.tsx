"use client";
import React, { useState } from "react";

export default function SendWelcomeButton({ subscriberId, currentStatus }: { subscriberId: string, currentStatus: string }) {
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/send-welcome", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: subscriberId }),
      });
      const data = await res.json();
      
      if (res.ok) {
        setStatus("WELCOMED");
        alert("Welcome email sent successfully!");
      } else {
        alert(data.error || "Failed to send email");
      }
    } catch {
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleSend} 
      disabled={loading || status === "WELCOMED"}
      style={{
        padding: "6px 12px",
        backgroundColor: status === "WELCOMED" ? "#ccc" : "#841014",
        color: "white",
        border: "none",
        borderRadius: "4px",
        cursor: status === "WELCOMED" ? "not-allowed" : "pointer",
        fontWeight: "bold",
        fontSize: "0.85rem"
      }}
    >
      {loading ? "Sending..." : status === "WELCOMED" ? "Already Sent" : "Send Welcome"}
    </button>
  );
}

