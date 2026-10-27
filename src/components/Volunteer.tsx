"use client";
import React from "react";
import styles from "./Volunteer.module.css";

export default function Volunteer() {
  return (
    <section className={styles.volunteerSection} id="volunteer">
      <div className={styles.header}>
        <div className={styles.eyebrow}>JOIN THE CREW</div>
        <h2 className={styles.title}>Become a Volunteer</h2>
        <p className={styles.intro}>
          We're inviting people with the following skills to join us, whether for a few weeks or for the full run of the festival.
        </p>
      </div>

      <div className={styles.grid}>
        <div className={styles.roles}>
          <h3>We're specifically looking for:</h3>
          
          <div className={styles.roleCard}>
            <div className={styles.roleTitle}>Content creators</div>
            <p className={styles.roleDesc}>
              People experienced in writing and producing short-form and long-form content (social media copy, articles, video scripts, newsletters).
            </p>
          </div>

          <div className={styles.roleCard}>
            <div className={styles.roleTitle}>Program managers</div>
            <p className={styles.roleDesc}>
              People who can help coordinate schedules, logistics, and moving parts across multiple festival tracks.
            </p>
          </div>

          <div className={styles.roleCard}>
            <div className={styles.roleTitle}>Administrative personnel</div>
            <p className={styles.roleDesc}>
              People who can support day-to-day operations, correspondence, and record-keeping.
            </p>
          </div>

          <div className={styles.roleCard}>
            <div className={styles.roleTitle}>Early career researchers</div>
            <p className={styles.roleDesc}>
              People with an interest in archival, curatorial, or cultural research, looking to build experience in the field.
            </p>
          </div>
        </div>

        <div className={styles.works}>
          <h3>How it works:</h3>
          <ul className={styles.workList}>
            <li className={styles.workItem}>
              <svg className={styles.workIcon} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              <span>Volunteers will be matched to roles based on their skills and availability.</span>
            </li>
            <li className={styles.workItem}>
              <svg className={styles.workIcon} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              <span>Time commitment varies by role; some positions are short-term (a few weeks), others run through the full festival period.</span>
            </li>
            <li className={styles.workItem}>
              <svg className={styles.workIcon} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              <span>This is an opportunity to work closely with the BAABFEST team and gain real experience in festival production and cultural programming.</span>
            </li>
            <li className={styles.workItem}>
              <svg className={styles.workIcon} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>
              <span>Every volunteer will be acknowledged as part of the BAABFEST team.</span>
            </li>
          </ul>

          <div className={styles.ctaBox}>
            <p className={styles.ctaText}>
              If you are willing to volunteer with us before 7th October 2026, kindly fill the link below.
            </p>
            <a href="https://bit.ly/4Au0OCF" target="_blank" rel="noopener noreferrer" className={styles.ctaBtn}>
              Fill Volunteer Form
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
