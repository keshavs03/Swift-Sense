// import React from "react";
// import { useState, useEffect } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router";
// // import "./HistoryPage.css";
// import Card from "@mui/material/Card";
// import CardContent from "@mui/material/CardContent";
// import CardMedia from "@mui/material/CardMedia";
// import Typography from "@mui/material/Typography";
// import { Button, CardActionArea, CardActions } from "@mui/material";
// // import gimage from "../../public/images/logo.png";
// function HistoryPage() {
//   const [history, setHistory] = useState([]);
//   const token = localStorage.getItem("user_email");
//   const navigate = useNavigate();
//   if (!token) navigate("/sign-up");
//   // useEffect(async () => {
//   //   // axios
//   //   //   .post("/history", {
//   //   //     userEmail:token,
//   //   //   })
//   //   //   .then(function (res) {
//   //   //     // const data = res.json();
//   //   //     // console.log("history message",data.message);
//   //   //     setHistory(res);
//   //   //     console.log(res);
//   //   //   })
//   //   //   .catch(function (error) {
//   //   //     console.log(error);
//   //   //   });
//   //   const res = await fetch("/login", {
//   //     method: "POST",
//   //     headers: {
//   //       "Content-Type": "application/json",
//   //     },
//   //     body: ({
//   //       email,
//   //       password,
//   //     }),
//   //   });
//   // }, []);

//   const [userEmail, setEmail] = useState("");
//   // const [historyData, setHistoryData] = useState([]);

//   useEffect(() => {
//     setEmail(token);
//     console.log("email jo bhej raha hun", userEmail);
//     const fetchHistoryData = async () => {
//       try {
//         const { data } = await axios.post("/history", { userEmail });
//         setHistory(data);
//         console.log("history ka data", data);
//       } catch (error) {
//         console.log(error);
//       }
//     };
//     fetchHistoryData();
//   }, []);

//   // const handleSubmit = (event) => {
//   //   event.preventDefault();
//   //   fetchHistoryData();
//   // };
//   return (
//     <div className="history">
//       <h1>History</h1>
//       <Card sx={{ maxWidth: 345 }}>
//         <CardActionArea>
//           <CardMedia component="img" height="140" image="" alt="graph" />
//           <CardContent>
//             <Typography gutterBottom variant="h5" component="div">
//               Video_1
//             </Typography>
//             <Typography
//               sx={{ fontSize: 14 }}
//               color="text.secondary"
//               gutterBottom
//             >
//               12/09/2021
//             </Typography>
//             <Typography variant="body2" color="text.secondary">
//               Avg. Speed: 21km/hr
//             </Typography>
//           </CardContent>
//         </CardActionArea>
//         {/* <CardActions>
//         <Button size="small" color="primary">
//           Share
//         </Button>
//       </CardActions> */}
//       </Card>
//       {history.length > 0 &&
//         history.map((item) => (
//           <Card
//             // key={item.id}
//             sx={{ maxWidth: 345 }}
//           >
//             <CardActionArea>
//               {/* <CardMedia
//                 component="img"
//                 height="140"
//                 image={item.filename}
//                 alt="graph"
//               /> */}
//               <img src={`data:image/png;base64,${item}`} alt="Image" />
//               <CardContent>
//                 {/* <Typography gutterBottom variant="h4" component="div">
//                   {item.userEmail}
//                 </Typography> */}
//                 <Typography
//                   sx={{ fontSize: 14 }}
//                   color="text.secondary"
//                   gutterBottom
//                 >
//                   {item.uploadDate}
//                 </Typography>
//                 {/* <Typography variant="body2" color="text.secondary">
//           Avg. Speed: {item.speed}
//         </Typography> */}
//               </CardContent>
//             </CardActionArea>
//             {/* <CardActions>
//       <Button size="small" color="primary">
//         Share
//       </Button>
//     </CardActions> */}
//           </Card>
//         ))}
//     </div>
//   );
// }
// export default HistoryPage;

import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import "./HistoryPage.css";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Grow from "@mui/material/Grow";
import { Button, CardActionArea, CardActions } from "@mui/material";
// import gimage from "../../public/images/logo.png";
import { render } from "@testing-library/react";
function HistoryPage() {
  const [history, setHistory] = useState([]);
  // const token = localStorage.getItem("user_email");
  const [token , setToken] = useState(localStorage.getItem("user_email") || null);
  const navigate = useNavigate();
  if (!token) navigate("/sign-up");
  const [userEmail, setEmail] = useState("");

  const [data2, setdata2] = useState([]);
  let data1 = [];
  useEffect(() => {
    setEmail(token);
    console.log("email jo bhej raha hun", userEmail);
    fetchHistoryData();
    // window.location.reload();
  }, [token]);

  const fetchHistoryData = async () => {
    try {
      const { data } = await axios.post("/history", { userEmail });
      // setHistory(data);
      console.log("history ka data", data);
      for (let i = 0; i < data[0].length; i++) {
        // console.log("for loop chaL raha hai");
        let final = {
          _id: data[0][i]._id,
          filename: data[0][i].filename,
          uploadDate: data[0][i].uploadDate,
          data: data[1][i],
          user_email: data[0][i].user_email,
          chunkSize: data[0][i].chunkSize,
        };
        // window.location.reload();
        // console.log("set data ke upar");
        // setdata1([...data1, final]);
        console.log("final", final.user_email);
        // console.log("userEmail", userEmail);
        if(token==final.user_email) data1.push(final);
        // console.log(final.filename);
      }
      setdata2(data1);
      console.log("data1", data1);
    } catch (error) {
      console.log(error);
    }
  };

  const downloadImage = (imageUrl) => {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = "download.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const [expanded, setExpanded] = useState(null);

  const handleExpand = (index) => {
    setExpanded(expanded === index ? null : index);
  };

  return (
    <div className="history">
      <h1>History</h1>
      {data2.length > 0 ? (
        data2.map((item, index) => (
          <Grow in={true} key={index}>
            <Card
              sx={{ maxWidth: 345, marginBottom: 2 }}
              onClick={() => handleExpand(index)}
              elevation={expanded === index ? 8 : 1}
            >
              <CardActionArea>
                <CardMedia
                  component="img"
                  height="250"
                  image={`data:image/png;base64,${item.data}`}
                  alt="graph"
                />
                {/* <img src={`data:image/png;base64,${item.data}`} alt="Image" />; */}
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {item.filename}
                  </Typography>
                  <Typography
                    sx={{ fontSize: 14 }}
                    color="text.secondary"
                    gutterBottom
                  >
                    {item.uploadDate}
                  </Typography>
                </CardContent>
              </CardActionArea>
              {/* <CardActions className="download-btn">
                <Button
                  size="small"
                  color="primary"
                  onClick={() => downloadImage()}
                >
                  Download
                </Button>
              </CardActions> */}
            </Card>
          </Grow>
        ))
      ) : (
        <Card>No Submissions Yet</Card>
      )}
    </div>
  );
}

export default HistoryPage;

// {/* //   <Grow in={true} key={0}>
// //     <Card
// //       sx={{ maxWidth: 345, marginBottom: 2 }}
// //       onClick={() => handleExpand(0)}
// //       elevation={expanded === 0 ? 8 : 1}
// //     >
// //       <CardActionArea>
// //         <CardMedia
// //           component="img"
// //           height="140"
// //           image="../../public/images/img-1.jpg"
// //           alt="graph"
// //         />
// //         <CardContent>
// //           <Typography gutterBottom variant="h5" component="div">
// //             {/* {item.userEmail} */} Video_1
// //           </Typography>
// //           <Typography
// //             sx={{ fontSize: 14 }}
// //             color="text.secondary"
// //             gutterBottom
// //           >
// //             {/* {item.uploadDate} */} 12/03/2004
// //           </Typography>
// //         </CardContent>
// //       </CardActionArea>
// //       <CardActions className="download-btn">
// //         <Button
// //           size="small"
// //           color="primary"
// //           onClick={() => downloadImage("../../public/images/img-1.jpg")}
//       >
//         Download
//       </Button>
//     </CardActions>
//   </Card>
// </Grow> */}
