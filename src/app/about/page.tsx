import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import styles from "./About.module.css";

export default function AboutPage() {
  return (
    <main className={styles.aboutPage}>
      <Header />
      
      <div className={styles.hero}>
        <h1 className={styles.title}>About BAABFEST</h1>
        <p className={styles.subtitle}>
          The Benin Arts and Books Festival is an annual multidisciplinary cultural event dedicated to promoting literature, visual arts, heritage preservation, creativity, and intellectual engagement in Benin City, Edo State and beyond. Through readings, exhibitions, performances, conversations, and educational programming, the festival creates opportunities for learning, artistic development, and community engagement.
        </p>
      </div>

      <div className={styles.contentWrap}>
        <div className={styles.missionBlock}>
          <h2>Aims of the Benin Art and Books Festival</h2>
          <p style={{ textAlign: "center", fontSize: "1.1rem", color: "var(--neutral)", maxWidth: "800px", margin: "0 auto 40px" }}>
            The festival’s mission is anchored in five core objectives, encapsulated by the acronym CAVE:
          </p>

          <div className={styles.caveGrid}>
            <div className={styles.pillarCard}>
              <div className={styles.letter}>C</div>
              <h3 className={styles.pillarTitle}>Connectivity</h3>
              <p className={styles.pillarDesc}>
                To create a collaborative platform where emerging and established writers forge meaningful connections, fostering mentor-mentee relationships that nurture the growth of Edo’s literary ecosystem.
              </p>
            </div>

            <div className={styles.pillarCard}>
              <div className={styles.letter}>A</div>
              <h3 className={styles.pillarTitle}>Accessibility</h3>
              <p className={styles.pillarDesc}>
                To cultivate a tightly knit local literary society where artists and writers gain equitable access to resources, workshops, and artistic content that inspire creativity and skill development.
              </p>
            </div>

            <div className={styles.pillarCard}>
              <div className={styles.letter}>V</div>
              <h3 className={styles.pillarTitle}>Visibility</h3>
              <p className={styles.pillarDesc}>
                To spotlight hidden talent by showcasing artistic brilliance through exhibitions, readings, and performances, ensuring rare creative voices are amplified and celebrated.
              </p>
            </div>

            <div className={styles.pillarCard}>
              <div className={styles.letter}>E</div>
              <h3 className={styles.pillarTitle}>Enlightenment</h3>
              <p className={styles.pillarDesc}>
                To revive the fading appreciation for literature and the arts by reigniting curiosity, sparking intellectual discourse, and reawakening a love for reading among youths.
              </p>
            </div>
          </div>

          <div className={styles.conclusion}>
            Through these pillars, the festival seeks to empower young artists, preserve cultural narratives, and position Edo State as a hub of literary and artistic innovation.
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
