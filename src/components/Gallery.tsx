"use client";

import React, { useState, useEffect } from "react";

interface Archive {
  id: string;
  year: string;
  theme: string;
  images: string[];
  driveLink: string | null;
}

export default function Gallery() {
  const [archives, setArchives] = useState<Archive[]>([]);
  const [selectedYearIndex, setSelectedYearIndex] = useState(0);

  useEffect(() => {
    fetch("/api/archives")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setArchives(data);
        }
      })
      .catch((err) => console.log("Using static gallery:", err));
  }, []);

  const activeArchive = archives[selectedYearIndex];
  const hasDynamicImages = activeArchive && activeArchive.images.length > 0;

  return (
    <section className="gallery" id="gallery">
      <div className="wrap">
        <div className="sec-head">
          <h2>The Archive &amp; Moments</h2>
          <p>
            {activeArchive
              ? `${activeArchive.year} Edition: "${activeArchive.theme}"`
              : "Capturing dialogue, raw bronze, book readings, and community across Benin."}
          </p>

          {/* Year selector pills if multiple archives exist */}
          {archives.length > 1 && (
            <div
              style={{
                display: "flex",
                gap: "10px",
                justifyContent: "center",
                marginTop: "16px",
                flexWrap: "wrap",
              }}
            >
              {archives.map((arch, idx) => (
                <button
                  key={arch.id}
                  onClick={() => setSelectedYearIndex(idx)}
                  style={{
                    padding: "6px 16px",
                    borderRadius: "20px",
                    border: "1px solid",
                    borderColor: idx === selectedYearIndex ? "var(--gold)" : "rgba(240, 200, 35, 0.3)",
                    backgroundColor: idx === selectedYearIndex ? "var(--gold)" : "transparent",
                    color: idx === selectedYearIndex ? "#1F2A44" : "var(--ivory)",
                    fontWeight: 600,
                    fontSize: "0.85rem",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                >
                  {arch.year} Edition
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Dynamic Gallery if archives are populated in CMS */}
        {hasDynamicImages ? (
          <div>
            <div className="masonry">
              {activeArchive.images[0] && (
                <div className="m-tile m-wide">
                  <img src={activeArchive.images[0]} alt={`${activeArchive.year} Photo 1`} />
                  <span className="m-cap">{activeArchive.theme}</span>
                </div>
              )}
              {activeArchive.images[1] && (
                <div className="m-tile m-tall">
                  <img src={activeArchive.images[1]} alt={`${activeArchive.year} Photo 2`} />
                  <span className="m-cap">{activeArchive.year} Highlights</span>
                </div>
              )}
              <div className="m-pair">
                {activeArchive.images[2] && (
                  <div className="m-tile m-square">
                    <img src={activeArchive.images[2]} alt={`${activeArchive.year} Photo 3`} />
                    <span className="m-cap">Festival Moments</span>
                  </div>
                )}
                {activeArchive.images[3] && (
                  <div className="m-tile m-square">
                    <img src={activeArchive.images[3]} alt={`${activeArchive.year} Photo 4`} />
                    <span className="m-cap">Exhibition &amp; Craft</span>
                  </div>
                )}
              </div>
            </div>

            {/* Google Drive Link if provided in CMS */}
            {activeArchive.driveLink && (
              <div style={{ textAlign: "center", marginTop: "32px" }}>
                <a
                  href={activeArchive.driveLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "12px 24px",
                    backgroundColor: "rgba(240, 200, 35, 0.12)",
                    border: "1px solid var(--gold)",
                    borderRadius: "8px",
                    color: "var(--gold)",
                    fontSize: "0.95rem",
                    fontWeight: 600,
                    textDecoration: "none",
                  }}
                >
                  <span>Explore Complete {activeArchive.year} Drive Archive</span>
                  <span>→</span>
                </a>
              </div>
            )}
          </div>
        ) : (
          /* Default Fallback Gallery */
          <div className="masonry">
            <div className="m-tile m-wide">
              <img src="/crowd.jpg" alt="Festival Hall & Attendees" />
              <span className="m-cap">Festival Hall &amp; Attendees</span>
            </div>
            <div className="m-tile m-tall">
              <img src="/reading.jpg" alt="Author Reading Excerpt" />
              <span className="m-cap">Author Reading Excerpt</span>
            </div>
            <div className="m-pair">
              <div className="m-tile m-square">
                <img src="/gallery.jpg" alt="Art Piece" />
                <span className="m-cap">Contemporary Exhibition</span>
              </div>
              <div className="m-tile m-square">
                <img src="/bronze.jpg" alt="Bronze Casting" />
                <span className="m-cap">Live Bronze Casting</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
