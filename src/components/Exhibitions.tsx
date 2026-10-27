import React from 'react';
import { ArrowRight } from 'lucide-react';
import styles from './Exhibitions.module.css';

export default function Exhibitions() {
  return (
    <section className={styles.section} id="exhibitions">
      <div className={styles.container}>
        
        {/* Left Visual Area */}
        <div className={styles.visualColumn}>
           <div className={styles.imageFrame}>
              <img 
                src="https://images.unsplash.com/photo-1544928147-79a2dbc1f389?q=80&w=800" 
                alt="Bronze Casting and African Art" 
                className={styles.image} 
              />
              <div className={styles.imageOverlay}></div>
           </div>
           <div className={styles.floatingBadge}>
              <div className={styles.badgeDot}></div>
              <span>Igun Street Heritage</span>
           </div>
        </div>

        {/* Right Content Area */}
        <div className={styles.contentColumn}>
          <p className={styles.eyebrow}>The Living Heritage</p>
          <h2 className={styles.heading}>
            Art Is No Longer Confined <span className={styles.headingMuted}>To The Past.</span>
          </h2>
          
          <div className={styles.textBlock}>
            <p className={styles.paragraph}>
              BAABFEST bridges the ancient master-craft of Igun Street with the vibrant pulse of contemporary African visual arts. 
            </p>
            <p className={styles.paragraph}>
              Today's collectors and enthusiasts seek more than just viewing—they seek stories, cultural significance, and the raw energy of creation. We empower artisans to present masterpieces that redefine how heritage is celebrated.
            </p>
          </div>

          <div className={styles.statsGrid}>
            
            <div className={styles.statCard}>
              <h3 className={styles.statNumber}>100+</h3>
              <p className={styles.statLabel}>Original Artworks</p>
              <div className={styles.statLine}></div>
            </div>

            <div className={styles.statCard}>
              <h3 className={styles.statNumber}>7</h3>
              <p className={styles.statLabel}>Master Casters</p>
              <div className={styles.statLine}></div>
            </div>

            <div className={styles.statCard}>
              <h3 className={styles.statNumber}>3</h3>
              <p className={styles.statLabel}>Immersive Galleries</p>
              <div className={styles.statLine}></div>
            </div>

          </div>

          <button className={styles.ctaButton}>
            <span>Explore Collections</span>
            <ArrowRight size={16} className={styles.ctaIcon} />
          </button>

        </div>
      </div>
    </section>
  );
}
