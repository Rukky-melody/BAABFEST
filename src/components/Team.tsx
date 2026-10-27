"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import styles from "./Team.module.css";

const TEAM_MEMBERS = [
  { 
    id: 1, 
    name: "Eki Eboigbe", 
    role: "Festival Curator", 
    bio: "Eki brings over a decade of experience in curating contemporary African art, bridging the gap between ancestral heritage and modern expression.",
    imageUrl: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=800&q=80" 
  },
  { 
    id: 2, 
    name: "Osasere Igbinovia", 
    role: "Head of Exhibitions", 
    bio: "With a keen eye for spatial design, Osasere transforms ordinary venues into immersive cultural landscapes that tell the story of Benin.",
    imageUrl: "https://images.unsplash.com/photo-1542596594-649edbc13630?w=800&q=80" 
  },
  { 
    id: 3, 
    name: "Adesuwa Omoregie", 
    role: "Literary Director", 
    bio: "Adesuwa curates the voices of BAABFEST, championing emerging and established African authors to foster thought-provoking dialogue.",
    imageUrl: "https://images.unsplash.com/photo-1589156280159-27698a70f29e?w=800&q=80" 
  },
  { 
    id: 4, 
    name: "Nosa Igbinedion", 
    role: "Operations Lead", 
    bio: "The backbone of the festival, Nosa ensures seamless execution across all events, blending logistical precision with a passion for the arts.",
    imageUrl: "https://images.unsplash.com/photo-1506803682981-6e718a9def30?w=800&q=80" 
  },
];

export default function Team() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 968);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % TEAM_MEMBERS.length);
    setHasInteracted(true);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + TEAM_MEMBERS.length) % TEAM_MEMBERS.length);
    setHasInteracted(true);
  };

  const activeMember = TEAM_MEMBERS[activeIndex];

  return (
    <section className={styles.teamSection} id="team">
      <div className={styles.container}>
        
        {/* Header Area */}
        <div className={styles.headerArea}>
          <div className={styles.heading}>Meet the Team</div>
        </div>

        {/* Gallery Area */}
        <div className={styles.gallery}>
          <AnimatePresence>
            {!hasInteracted && isMobile && (
              <motion.div 
                className={styles.swipeHint}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                Swipe to explore <span>→</span>
              </motion.div>
            )}
          </AnimatePresence>

          {TEAM_MEMBERS.map((member, index) => {
            const isActive = index === activeIndex;
            const isNext = index === (activeIndex + 1) % TEAM_MEMBERS.length;
            const isPrev = index === (activeIndex - 1 + TEAM_MEMBERS.length) % TEAM_MEMBERS.length;
            
            let zIndex = 0;
            let x = "100%";
            let scale = 0.8;
            let opacity = 0;

            if (isActive) {
              zIndex = 10;
              x = "0%";
              scale = 1;
              opacity = 1;
            } else if (isNext) {
              zIndex = 5;
              x = isMobile ? "12%" : "12%"; 
              scale = 0.9;
              opacity = 0.7;
            } else if (isPrev) {
              zIndex = 1;
              x = "-20%";
              scale = 0.8;
              opacity = 0;
            }

            return (
              <motion.div
                key={member.id}
                initial={false}
                animate={{ x, scale, opacity, zIndex }}
                transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
                className={styles.imageWrapper}
                style={{ pointerEvents: isActive ? 'auto' : 'none' }}
                drag={isActive ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={(e, { offset, velocity }) => {
                  if (offset.x < -50 || velocity.x < -200) {
                    handleNext();
                  } else if (offset.x > 50 || velocity.x > 200) {
                    handlePrev();
                  }
                  setHasInteracted(true);
                }}
              >
                <img  
                  src={member.imageUrl} 
                  alt={member.name} 
                  className={styles.image}
                />
                {isActive && <div className={styles.overlay} />}
              </motion.div>
            );
          })}
        </div>

        {/* Info & Controls Area */}
        <div className={styles.infoArea}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className={styles.roleContainer}>
                <span className={styles.number}>0{activeIndex + 1}</span>
                <div className={styles.line} />
                <span className={styles.role}>{activeMember.role}</span>
              </div>
              
              <h3 className={styles.name}>{activeMember.name}</h3>
              
              <p className={styles.bio}>{activeMember.bio}</p>
            </motion.div>
          </AnimatePresence>

          <div className={styles.controlsDesktop}>
            <button onClick={handlePrev} className={`${styles.btn} ${styles.btnPrev}`} aria-label="Previous member">
              <ChevronLeft size={24} strokeWidth={1.5} />
            </button>
            <button onClick={handleNext} className={`${styles.btn} ${styles.btnNext}`} aria-label="Next member">
              <ChevronRight size={24} strokeWidth={1.5} />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
