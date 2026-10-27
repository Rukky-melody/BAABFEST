import React from "react";

export default function Gallery() {
  return (
    <section className="gallery" id="gallery">
      <div className="wrap">
        <div className="sec-head">
          <h2>The Archive & Moments</h2>
          <p>Capturing dialogue, raw bronze, book readings, and community across Benin.</p>
        </div>
        <div className="masonry">
          <div className="m-tile m-wide">
            <img src="/crowd.jpg" alt="Festival Hall & Attendees" />
            <span className="m-cap">Festival Hall & Attendees</span>
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
      </div>
    </section>
  );
}
