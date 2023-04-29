import React, { useEffect } from "react";
import { useState } from "react";
import Services from "../Services";
import { NavLink, useNavigate } from "react-router-dom";
import SignUp from "./SignUp";
function Upload() {
  const navigate = useNavigate();
  const token = localStorage.getItem("user_email");
  console.log(token);
  useEffect(() => {
    if (!token) navigate("/sign-up");
  }, []);
  return (
    <>
      <video src="/videos/video-1.mp4" autoPlay loop muted />
      <Services />
      {/* <HeroSection /> */}
      {/* <Cards /> */}
      {/* <Footer /> */}
    </>
  );
}
export default Upload;
