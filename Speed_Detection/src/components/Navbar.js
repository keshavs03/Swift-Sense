import React, { useState, useEffect } from "react";
import { Button } from "./Button";
import { Link } from "react-router-dom";
import "./Navbar.css";
import DashBoard from "./pages/DashBoard";
const { useRef, useLayoutEffect } = React;

function Navbar() {
  const [token, settoken] = useState();
  const [click, setClick] = useState(false);
  const [button, setButton] = useState(true);

  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);

  const firstUpdate = useRef(true);
  useLayoutEffect(() => {
    console.log("hello ");
    showButton();
    settoken(localStorage.getItem("user_email"));
    console.log("token print ", token);
  });

  const showButton = () => {
    if (!token) {
      if (window.innerWidth <= 960) {
        setButton(false);
      } else {
        setButton(true);
      }
    }
  };
  // const navupdate = () => {
  //   console.log("hello ");
  //   settoken(localStorage.getItem("user_email"));
  //   console.log("token print ", token);
  // };
  // componentDidMount() {
  //   settoken(localStorage.getItem("user_email"));
  // }

  useEffect(() => {
    console.log("useeffetc");
    // showButton();
    settoken(localStorage.getItem("user_email"));
    console.log("token print ", token);
    // navupdate();
  }, [token]);

  window.addEventListener("resize", showButton);

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
            Group-3
            {/* <i class="fab fa-typo3" /> */}
            <img src="/images/logo.png" alt="logo" id="logo" />
          </Link>
          <div className="menu-icon" onClick={handleClick}>
            <i className={click ? "fas fa-times" : "fas fa-bars"} />
          </div>
          <ul className={click ? "nav-menu active" : "nav-menu"}>
            <li className="nav-item">
              <Link to="/" className="nav-links" onClick={closeMobileMenu}>
                Home
              </Link>
            </li>
            {token && (
              <li className="nav-item">
                <Link
                  to="http://127.0.0.1:3606/"
                  className="nav-links"
                  onClick={closeMobileMenu}
                >
                  Upload
                </Link>
              </li>
            )}
            <li className="nav-item">
              <Link
                to="/AboutUs"
                className="nav-links"
                onClick={closeMobileMenu}
              >
                About Us
              </Link>
            </li>

            {!token ? (
              <li>
                <Link
                  to="/sign-up"
                  className="nav-links-mobile"
                  onClick={closeMobileMenu}
                >
                  Sign Up
                </Link>
              </li>
            ) : (
              <li>
                <Link
                  to="/dashBoard"
                  className="nav-links"
                  onClick={closeMobileMenu}
                >
                  DashBoard
                </Link>
              </li>
            )}
          </ul>
          {!token && button && (
            <Button buttonStyle="btn--outline">SIGN UP</Button>
          )}
        </div>
      </nav>
    </>
  );
}

export default Navbar;
