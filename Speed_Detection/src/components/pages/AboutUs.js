import React from "react";
import "../../App.css";

function AboutUs() {
  return (
    <div>
      <div className="hero-container">
        <video src="/videos/video-1.mp4" autoPlay loop muted />
        <h1>About Us Page</h1>
        <p>Some text about who we are and what we do.</p>
        <p>
          Resize the browser window to see that this page is responsive by the
          way.
        </p>
      </div>
    </div>
  );
}

export default AboutUs;
