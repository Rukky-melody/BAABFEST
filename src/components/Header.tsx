"use client";
import React, { useState, useEffect, useCallback } from "react";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [archiveOpen, setArchiveOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenuOpen]);

  // Close menu on resize above breakpoint
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 880) {
        setMobileMenuOpen(false);
        setAboutOpen(false);
        setArchiveOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const closeMenu = useCallback(() => {
    setMobileMenuOpen(false);
    setAboutOpen(false);
    setArchiveOpen(false);
  }, []);

  return (
    <>
      {/* Backdrop overlay */}
      <div
        className={`mobile-backdrop ${mobileMenuOpen ? "active" : ""}`}
        onClick={closeMenu}
        aria-hidden="true"
      />

      <header className={scrolled ? "scrolled" : ""}>
        <div className="nav">
          <a href="#top" className="logo" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "10px" }}>
            <img
              src="/BAABFEST_LOGO-removebg-preview.png"
              alt="BAABFEST Logo"
              style={{ height: "48px", width: "auto", display: "block" }}
            />
            <span style={{ fontFamily: "Playfair Display, serif", fontWeight: 700, fontSize: "1.25rem", color: "var(--brown)", letterSpacing: "0.04em" }}>
              BAABFEST
            </span>
          </a>
          
          <nav className={`navlinks ${mobileMenuOpen ? 'mobile-open' : ''}`}>
            <a href="/" onClick={closeMenu}>Home</a>
            <div className={`dropdown-container ${aboutOpen ? 'open' : ''}`}>
              <button
                type="button"
                className="dropdown-toggle"
                onClick={() => setAboutOpen((prev) => !prev)}
                aria-expanded={aboutOpen}
              >
                <span>About</span>
                <svg className={`chevron ${aboutOpen ? 'rotate' : ''}`} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              <div className={`dropdown ${aboutOpen ? 'open' : ''}`}>
                <a href="/#essence" onClick={closeMenu}>About Us</a>
                <a href="/#team" onClick={closeMenu}>Team</a>
                <a href="/#volunteer" onClick={closeMenu}>Become a Volunteer</a>
              </div>
            </div>
            <div className={`dropdown-container ${archiveOpen ? 'open' : ''}`}>
              <button
                type="button"
                className="dropdown-toggle"
                onClick={() => setArchiveOpen((prev) => !prev)}
                aria-expanded={archiveOpen}
              >
                <span>Festival Archive</span>
                <svg className={`chevron ${archiveOpen ? 'rotate' : ''}`} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              <div className={`dropdown ${archiveOpen ? 'open' : ''}`}>
                <a href="/#gallery" onClick={closeMenu}>Baabfest 2022</a>
                <a href="/#gallery" onClick={closeMenu}>Baabfest 2023</a>
                <a href="/#gallery" onClick={closeMenu}>Baabfest 2024</a>
                <a href="/#gallery" onClick={closeMenu}>Baabfest 2025</a>
              </div>
            </div>
            <a href="/#volunteer" onClick={closeMenu}>Volunteer</a>
            <a href="https://bit.ly/471rmhn" target="_blank" rel="noopener noreferrer" className="register-btn" onClick={closeMenu} style={{
              backgroundColor: "var(--orange-text)",
              color: "var(--ivory)",
              padding: "8px 16px",
              borderRadius: "4px",
              fontWeight: 600,
              transition: "background-color 0.3s ease",
            }}>Register</a>
          </nav>
          
          <button 
            className={`navtoggle ${mobileMenuOpen ? 'is-open' : ''}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              /* Clean Close 'X' Icon */
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              /* Clean 3-bar Hamburger Icon */
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </header>
    </>
  );
}

