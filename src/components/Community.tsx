"use client";
import React, { useState } from "react";

export default function Community() {
  return (
    <section className="community" id="community">
      <div className="wrap comm-grid">
        <div className="comm-card comm-1">
          <div>
            <h3>Become part of the crew</h3>
            <p>Help shape the festival experience. Join our guest services, media, and staging teams on the ground in Benin City.</p>
          </div>
          <button className="comm-link" style={{ color: "var(--gold)", borderColor: "var(--gold)" }} onClick={() => alert("Volunteer modal would open here!")}>
            Fill volunteer form →
          </button>
        </div>
        <div className="comm-card comm-2">
          <div>
            <h3>Showcase your books</h3>
            <p>Open intake for independent authors, presses, and literature outlets to secure display slots during the week.</p>
          </div>
          <button className="comm-link" style={{ color: "var(--orange-text)", borderColor: "var(--orange-text)" }} onClick={() => alert("Vendor modal would open here!")}>
            Apply for vendor space →
          </button>
        </div>
      </div>
    </section>
  );
}
