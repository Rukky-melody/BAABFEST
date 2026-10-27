import React from "react";

export default function Essence() {
  return (
    <section className="essence" id="essence">
      <div className="wrap essence-grid">
        <div className="animate-fade-in">
          <p className="eyebrow">Our Essence</p>
          <h2>Rooted in antiquity, shaping modern discourse.</h2>
          <blockquote>
            Benin has held the world's imagination for centuries through visual narrative and historical craftsmanship. 
            BAABFEST exists to bring modern writers, painters, and thinkers into that same sacred circle.
          </blockquote>
          <a className="arrow-link" href="/about">Our Mission and Our Vision →</a>
        </div>
        <div className="frame" style={{ 
          padding: 0, 
          overflow: 'hidden', 
          border: 'none', 
          background: 'transparent', 
          WebkitMaskImage: 'radial-gradient(ellipse 90% 90% at 50% 50%, black 50%, transparent 100%)',
          maskImage: 'radial-gradient(ellipse 90% 90% at 50% 50%, black 50%, transparent 100%)'
        }}>
          <img src="/benin-bronze.jpg" alt="Benin Bronze Curatorial Portrait" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      </div>
    </section>
  );
}
