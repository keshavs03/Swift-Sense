import React from "react";
import logo from "./logo.svg";
import "./App.css";
import Navbar from "./components/Navbar";
import {
  BrowserRouter as Router,
  Navigate,
  Routes,
  Route,
} from "react-router-dom";
import Home from "./components/pages/Home";
import Services from "./components/Services";
// import Products from "./components/pages/Products";
import SignUp from "./components/pages/SignUp";
import AboutUs from "./components/pages/AboutUs";
import Upload from "./components/pages/Upload";
import DashBoard from "./components/pages/DashBoard";
// const BrowserRouter = require("react-router-dom").BrowserRouter;

// const Route = require("react-router-dom").Route;

// const Link = require("react-router-dom").Link;
function App() {
  // localStorage.clear();
  // localStorage.setItem("user_email", "--");
  const isLogin = () => {
    const token = localStorage.getItem("user_email");
    console.log("isLogin", token);
    return false;
  };
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" exact element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/DashBoard" element={<DashBoard />} />
          {/* <Route path="/products" element={<Products />} /> */}
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/AboutUs" element={<AboutUs />} />
          {/* <Route path="/Upload" element={<Upload />} /> */}
          {/* <Route
            path="/Upload"
            render={isLogin ? <Upload /> : <Navigate to="/sign-up" />}
          /> */}
        </Routes>
      </Router>
    </>
  );
}

export default App;
