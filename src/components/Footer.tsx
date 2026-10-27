"use client";
import React, { useState } from "react";

export default function Footer() {

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      
      if (res.ok) {
        setStatus("success");
        setMessage(data.message || "Thank you for subscribing to BAABFEST updates!");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error || "Failed to subscribe.");
      }
    } catch (err) {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  };

  return (
    <footer>
      <div className="wrap">
        <div className="foot-grid">
          <div>
            <h4>Venue Location</h4>
            <p className="venue-name">Victor Uwaifo Creative Hub</p>
            <p className="venue-loc">Benin City, Edo State</p>
            <div className="map-box">
              <iframe
                src="https://maps.google.com/maps?q=Victor%20Uwaifo%20Creative%20Hub,%20Benin%20City&t=&z=15&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Victor Uwaifo Creative Hub Map"
              ></iframe>
            </div>
          </div>
          <div>
            <h4>Stay Informed</h4>
            <p className="newsletter-copy">Be first to receive full program drops and schedule releases.</p>
            <form className="nl-form" onSubmit={handleSubscribe}>
              <input 
                type="email" 
                placeholder="Email address" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
                disabled={status === "loading"}
              />
              <button type="submit" disabled={status === "loading"}>
                {status === "loading" ? "..." : "Join"}
              </button>
            </form>
            {message && (
              <p
                style={{
                  color: status === "success" ? "var(--gold)" : "#ff8080",
                  fontSize: "0.85rem",
                  marginTop: "-30px",
                  marginBottom: "20px",
                  lineHeight: 1.4,
                }}
              >
                {message}
              </p>
            )}
            <p className="connect-label">CONNECT</p>
            <div className="socials">
              <a href="#" aria-label="Instagram"><svg viewBox="0 0 24 24" fill="none" stroke="#F1E7D3" strokeWidth="1.6"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1"/></svg></a>
              <a href="#" aria-label="X / Twitter"><svg viewBox="0 0 24 24" fill="none" stroke="#F1E7D3" strokeWidth="1.6"><path d="M4 4l16 16M20 4L4 20"/></svg></a>
              <a href="#" aria-label="Facebook"><svg viewBox="0 0 24 24" fill="none" stroke="#F1E7D3" strokeWidth="1.6"><path d="M14 9h3V6h-3c-2 0-3.5 1.5-3.5 3.5V11H8v3h2.5v6h3v-6H16l.5-3h-3V9.5c0-.3.2-.5.5-.5Z"/></svg></a>
            </div>
          </div>
          <div className="foot-qr-col">
            <h4>Register</h4>
            <p className="newsletter-copy">Scan the code below to secure your tickets for BAABFEST 2026.</p>
            <div className="qr-wrap" style={{ display: 'flex', justifyContent: 'center', width: '100%', marginTop: '16px' }}>
              <div style={{ backgroundColor: 'var(--ivory)', padding: '14px', borderRadius: '10px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }}>
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://bit.ly/471rmhn&color=1F2A44&bgcolor=F4EFE8" alt="Registration QR Code" style={{ width: '120px', height: '120px', mixBlendMode: 'multiply' }} />
              </div>
            </div>
          </div>
        </div>
        <div className="bottom-bar" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <img
              src="/BAABFEST_LOGO-removebg-preview.png"
              alt="BAABFEST Logo"
              style={{ height: "32px", width: "auto", filter: "brightness(0) invert(1)", opacity: 0.7 }}
            />
            <span style={{ fontFamily: "Fraunces, serif", fontWeight: 700, fontSize: "1rem", letterSpacing: "0.04em", opacity: 0.85 }}>BAABFEST</span>
          </div>
          <span>© 2026 Benin Arts and Books Festival. All Rights Reserved.</span>
        </div>
      </div>
    </footer>
  );
}
