"use client";
import React, { useEffect, useRef, useState } from "react";

// Split headline into individual words for staggered animation
const HEADLINE = "Re-ordering Identity";
const words = HEADLINE.split(" ");

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);
  const [mounted, setMounted] = useState(false);

  // Trigger staggered text entrance after mount
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  // Animated film grain — redraws every frame for cinematic effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = () => {
      const W = (canvas.width = canvas.offsetWidth || canvas.parentElement?.offsetWidth || 1);
      const H = (canvas.height = canvas.offsetHeight || canvas.parentElement?.offsetHeight || 1);

      if (W <= 0 || H <= 0) {
        animFrameRef.current = requestAnimationFrame(draw);
        return;
      }

      const imageData = ctx.createImageData(W, H);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        const value = Math.random() * 255;
        data[i]     = value * 1.05; // R — warm
        data[i + 1] = value * 0.95; // G
        data[i + 2] = value * 0.85; // B — amber
        data[i + 3] = 14;           // Alpha — very light
      }

      ctx.putImageData(imageData, 0, 0);
      animFrameRef.current = requestAnimationFrame(draw);
    };

    animFrameRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, []);

  return (
    <section className="hero" id="top" style={{
      backgroundColor: "var(--ivory)",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Animated Film Grain */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 0, left: 0,
          width: "100%", height: "100%",
          zIndex: 1,
          pointerEvents: "none",
          mixBlendMode: "multiply",
        }}
      />

      {/* Two-column layout: text left | motif right */}
      <div
        className="wrap"
        style={{
          position: "relative",
          zIndex: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "60px",
          width: "100%",
        }}
      >
        {/* Left: Text Content */}
        <div style={{ flex: "1 1 0", maxWidth: "55%" }}>

          <div className="tag" style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 0.75s ease, transform 0.75s ease",
              willChange: "opacity, transform",
          }}>
             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" style={{ width: "14px", height: "14px", fill: "currentColor" }}>
               <path d="M152 24c0-13.3-10.7-24-24-24s-24 10.7-24 24V64H64C28.7 64 0 92.7 0 128v16 48V448c0 35.3 28.7 64 64 64H384c35.3 64 64-28.7 64-64V192 144 128c0-35.3-28.7-64-64-64H344V24c0-13.3-10.7-24-24-24s-24 10.7-24 24V64H152V24zM48 192h80v56H48V192zm0 104h80v56H48V296zm128 0h96v56H176V296zm192 0h-48v56h48V296zm-48-104h48v56h-48V192zm-48 0v56H176V192h96z"/>
             </svg> Thursday 12th - Saturday 14th November 2026
          </div>

          {/* Staggered word-by-word headline */}
          <h1
            style={{
              fontFamily: "Gilgongo, serif",
              fontSize: "clamp(2rem, 4vw, 3rem)",
              color: "var(--brown)",
              lineHeight: 1.15,
              display: "flex",
              flexWrap: "wrap",
              gap: "0.28em",
            }}
          >
            {words.map((word, i) => (
              <span
                key={i}
                style={{
                  display: "inline-block",
                  opacity: mounted ? 1 : 0,
                  transform: mounted ? "translateY(0)" : "translateY(28px)",
                  transition: `opacity 0.75s ease ${i * 0.13}s, transform 0.75s ease ${i * 0.13}s`,
                  willChange: "opacity, transform",
                }}
              >
                {word}
              </span>
            ))}
          </h1>

          {/* Sub-text — fades in after headline */}
          <p
            className="sub"
            style={{
              fontFamily: "Work Sans, sans-serif",
              margin: "26px 0 0",
              fontSize: "1.2rem",
              color: "var(--neutral)",
              lineHeight: 1.7,
              opacity: mounted ? 1 : 0,
              transform: mounted ? "translateY(0)" : "translateY(18px)",
              transition: `opacity 0.8s ease ${words.length * 0.13 + 0.2}s, transform 0.8s ease ${words.length * 0.13 + 0.2}s`,
              willChange: "opacity, transform",
            }}
          >
            Literature. Visual art. Ancient craft. One city. One festival. Benin's culture, fully alive.
          </p>

          {/* Registration CTA Button */}
          <div style={{
            marginTop: '38px',
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(18px)",
            transition: `opacity 0.8s ease ${words.length * 0.13 + 0.4}s, transform 0.8s ease ${words.length * 0.13 + 0.4}s`,
            willChange: "opacity, transform",
          }}>
            <a href="https://bit.ly/471rmhn" target="_blank" rel="noopener noreferrer" style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'var(--orange-text)',
              color: 'var(--ivory)',
              padding: '16px 38px',
              borderRadius: '8px',
              fontFamily: 'Work Sans, sans-serif',
              fontWeight: 600,
              fontSize: '1.05rem',
              letterSpacing: '0.02em',
              textDecoration: 'none',
              boxShadow: '0 8px 24px rgba(168, 71, 31, 0.25)',
              transition: 'transform 0.3s ease, background-color 0.3s ease',
            }}
            onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.backgroundColor = 'var(--brown)'; }}
            onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.backgroundColor = 'var(--orange-text)'; }}
            >
              Register Now
            </a>
          </div>
        </div>

        {/* Right: Motif Watermark */}
        <div
          style={{
            flex: "0 0 38%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            opacity: 0.75,
            pointerEvents: "none",
            maxHeight: "70vh",
            overflow: "hidden",
          }}
        >
          <img
            src="/motif.png"
            alt="Benin Motif Watermark"
            style={{
              width: "100%",
              height: "auto",
              objectFit: "contain",
              filter: "brightness(0.35) contrast(1.2)",
            }}
          />
        </div>
      </div>
    </section>
  );
}
