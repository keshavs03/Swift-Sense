import React from "react";
import "../App.css";
import { Button } from "./Button";
import "./HeroSection.css";

function HeroSection() {
  return (
    <div className="hero-container">
      <video src="/videos/video-1.mp4" autoPlay loop muted />
      <h1>Speed Detection</h1>
      {/* <p>
        The optical flow method is a method that can be used to detect the
        motion of an object. It works by analyzing the movement of pixels
        between two consecutive frames of a video. The background subtraction
        method is a method that can be used to detect the motion of an object by
        subtracting the background from the current frame.
      </p> */}
      {/* <div className="hero-btns">
        <Button
          className="btns"
          buttonStyle="btn--outline"
          buttonSize="btn--large"
        >
          GET STARTED
        </Button>
        <Button
          className="btns"
          buttonStyle="btn--primary"
          buttonSize="btn--large"
          onClick={console.log("hey")}
        >
          WATCH TRAILER <i className="far fa-play-circle" />
        </Button> */}
      {/* </div> */}
    </div>
  );
}

export default HeroSection;
