import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import "./SignUp.css";
import "../../App.css";

function SignUp() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ email: "", password: "" });
  const [errorMsg, setErrorMsg] = useState("");
  let value, id;

  //Form Data
  const handleInput = (e) => {
    // console.log(e.target.value);
    // console.log(e);
    value = e.target.value;
    id = e.target.id;
    setUser({ ...user, [id]: value });
    console.log(user);
  };

  const validateEmail = () => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i;
    if (!emailRegex.test(user.email)) {
      setErrorMsg("Please enter a valid email address.");
      return false;
    } else if (user.email.length < 7 || user.email.length > 25) {
      setErrorMsg("Email address should be between 7 to 25 characters.");
      return false;
    }
    setErrorMsg("");
    return true;
  };

  const validatePassword = () => {
    if (user.password.length < 8 || user.password.length > 12) {
      setErrorMsg("Password should be between 8 to 12 characters.");
      return false;
    }
    setErrorMsg("");
    return true;
  };

  //Login
  const handleLogin = async (e) => {
    e.preventDefault();
    if (validateEmail() && validatePassword()) {
      console.log("Valid form");
      const { email, password } = user;
      const res = await fetch("/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });
      const data = await res.json();
      console.log("data", data);
      if (data.status === 400 || !data) {
        window.alert("Invalid login");
        console.log("invalid login", data);
      } else {
        window.alert(data.message);
        if (data.message === "Login successful" && data.user != "--") {
          console.log("Success login", data.message, data.user);
          localStorage.setItem("user_email", data.user.email);
          // console.log(localStorage);
          const token = localStorage.getItem("user_email");
          console.log(token);
          const fl_post = await sendtoflask();
          console.log("fl_post", fl_post);
          window.location.href = "http://127.0.0.1:3606/";

          // navigate("http://localhost:3606/video_upload_new");
          // window.location.reload(false);
        }
      }
    }
  };
  const sendtoflask = async () => {
    const user_email = localStorage.getItem("user_email");
    const res = await axios.post("http://localhost:3606/user_email", {
      user_email,
    });
    const data = res.data; // Use res.data instead of res.json()
    console.log("data", data);
    return data.result;
  };

  //SignUp
  const handleSignUp = async (e) => {
    e.preventDefault();
    if (validateEmail() && validatePassword()) {
      console.log("Valid form");
      const { email, password } = user;
      const res = await fetch("/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });
      console.log("res", res);
      const data = await res.json();
      console.log("data", data);
      if (data.status === 422 || !data) {
        window.alert("Invalid Register");
        console.log("invalid register", data);
      } else {
        window.alert("Success");
        console.log("Success", data.message, data.user);
        setActiveForm("login");
      }
    }
  };

  const [activeForm, setActiveForm] = useState("login");

  const handleToggleForm = () => {
    setActiveForm(activeForm === "login" ? "signup" : "login");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // TODO: Handle form submission
  };

  const renderLoginForm = () => (
    <div className="login-wrap active">
      <div className="title">
        <h1>Login</h1>
      </div>

      <form method="POST" className="register-form" onSubmit={handleSubmit}>
        <div className="input-area">
          <input
            type="email"
            id="email"
            onChange={handleInput}
            autoComplete="off"
            required
          />
          <label htmlFor="email">Email</label>
        </div>

        <div className="input-area">
          <input
            type="password"
            id="password"
            onChange={handleInput}
            required
          />
          <label htmlFor="password">Password</label>
        </div>

        <div className="forgot-pass">
          <a href="#">Forgot password?</a>
        </div>
        {errorMsg && <p className="error">{errorMsg}</p>}
        <div className="button-area">
          <button type="submit" className="login-btn" onClick={handleLogin}>
            Login
          </button>
        </div>
      </form>

      <div className="form-toggle-area">
        <p>
          Not a member?{" "}
          <span
            id="toggle-signup"
            style={{ cursor: "pointer" }}
            onClick={handleToggleForm}
          >
            Signup now
          </span>
        </p>
      </div>
    </div>
  );

  const renderSignupForm = () => (
    <div className="signup-wrap">
      <div className="title">
        <h1>Signup</h1>
      </div>

      <form method="POST" className="register-form" onSubmit={handleSubmit}>
        {/* <div className="input-area">
          <input type="text" id="name" autoComplete="off" required />
          <label htmlFor="name">Name</label>
        </div> */}

        <div className="input-area">
          <input
            type="email"
            id="email"
            onChange={handleInput}
            autoComplete="off"
            required
          />
          <label htmlFor="email">Email</label>
        </div>

        <div className="input-area">
          <input
            type="password"
            id="password"
            onChange={handleInput}
            required
          />
          <label htmlFor="password">Password</label>
        </div>
        {errorMsg && <p className="error">{errorMsg}</p>}
        <div className="button-area">
          <button type="submit" className="signup-btn" onClick={handleSignUp}>
            Signup
          </button>
        </div>
      </form>

      <div className="form-toggle-area">
        <p>
          Have an account?{" "}
          <span id="toggle-login" onClick={handleToggleForm}>
            Login now
          </span>
        </p>
      </div>
    </div>
  );

  return (
    <>
      <video src="/videos/video-1.mp4" autoPlay loop muted />
      <div className="par_div" id="par_div">
        <div className="container">
          {activeForm === "login" ? renderLoginForm() : renderSignupForm()}
        </div>
      </div>
    </>
  );
}

export default SignUp;
