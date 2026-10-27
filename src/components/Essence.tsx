"use client";
import React from "react";
import { motion } from "framer-motion";

export default function Essence() {
  return (
    <section className="essence" id="essence" style={{ overflow: "hidden" }}>
      <div className="wrap essence-grid">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="eyebrow">Our Essence</p>
          <h2>Rooted in antiquity, shaping modern discourse.</h2>
          <blockquote>
            Benin has held the world's imagination for centuries through visual narrative and historical craftsmanship. 
            BAABFEST exists to bring modern writers, painters, and thinkers into that same sacred circle.
          </blockquote>
          <a className="arrow-link" href="/about">Our Mission and Our Vision →</a>
        </motion.div>
        
        <motion.div 
          className="frame" 
          initial={{ opacity: 0, y: 70, scale: 0.96 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 1.1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          style={{ 
            padding: 0, 
            overflow: 'hidden', 
            border: 'none', 
            background: 'transparent', 
            WebkitMaskImage: 'radial-gradient(ellipse 90% 90% at 50% 50%, black 50%, transparent 100%)',
            maskImage: 'radial-gradient(ellipse 90% 90% at 50% 50%, black 50%, transparent 100%)'
          }}
        >
          <img src="/benin-bronze.jpg" alt="Benin Bronze Curatorial Portrait" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </motion.div>
      </div>
    </section>
  );
}

