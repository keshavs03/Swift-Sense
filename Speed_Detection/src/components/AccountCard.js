// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import "./AccountCard.css";

// const AccountCard = () => {
//   const [email, setEmail] = useState("");
//   const [totalSubmissions, setTotalSubmissions] = useState(0);

//   useEffect(() => {
//     // fetch user's email and total submissions from Node server
//     axios
//       .get("/api/user")
//       .then((res) => {
//         setEmail(res.data.email);
//         setTotalSubmissions(res.data.totalSubmissions);
//       })
//       .catch((err) => {
//         console.error(err);
//       });
//   }, []);

//   const handleLogout = () => {
//     // logout logic
//   };

//   return (
//     <>
//       <div className="account-card">
//         <h2>Account Info</h2>
//         <p>Email: Keshav</p>
//         <p>Total Submissions: 25</p>
//         <button onClick={handleLogout}>Logout</button>
//       </div>
//       <div className="account-card">
//         <h2>Account Info</h2>
//         <p>Email: {email}</p>
//         <p>Total Submissions: {totalSubmissions}</p>
//         <button onClick={handleLogout}>Logout</button>
//       </div>
//     </>
//   );
// };
// export default AccountCard;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
//
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

const AccountCard = () => {
  // const [email, setemail] = useState("");
  // const [user_name, setName] = useState("username");
  // const token = localStorage.getItem("user_email");
  const [token, settoken] = useState("");
  // console.log(token);
  // setemail(token);
  // const email = localStorage.getItem("user-email");
  const [totalSubmissions, setTotalSubmissions] = useState(0);
  // let email = "user-email",
  //   user_name = "username",
  //   totalSubmissions = 0;
  const navigate = useNavigate();
  // axios
  //   .post("/user-data", {
  //     email,
  //   })
  //   .then(function(response) {
  //     console.log(response);
  //   })
  //   .catch(function(error) {
  //     console.log(error);
  //   });

  const handleLogOut = () => {
    // logout logic
    localStorage.removeItem("user_email");
    navigate("/");
    window.location.reload(false);
  };
  useEffect(() => {
    settoken(localStorage.getItem("user_email"));
  }, []);

  return (
    <>
      <Card sx={{ maxWidth: 345 }}>
        <CardMedia
          sx={{ height: 80 }}
          image="/static/images/cards/contemplative-reptile.jpg"
          title="green iguana"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {token}
          </Typography>
          {/* <Typography gutterBottom variant="h5" component="div">
            {user_name}
          </Typography> */}
          {/* <Typography variant="body2" color="text.secondary">
            {" "}
            Total Submissions: {totalSubmissions}{" "}
          </Typography> */}
        </CardContent>
        <CardActions>
          {/* <Button size="small">Share</Button> */}
          <Button size="small" onClick={handleLogOut}>
            Log Out
          </Button>
        </CardActions>
      </Card>
    </>
  );
};
export default AccountCard;
