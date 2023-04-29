import React from "react";
import { Button } from "./Button";
import { useState } from "react";
import "./Services.css";
function Services() {
  const [fileList, setFileList] = useState(null);

  const handleFileChange = (e) => {
    setFileList(e.target.files);
  };

  const handleUploadClick = async (e) => {
    // console.log("entered");
    e.preventDefault();
    if (!fileList) {
      return;
    }

    const data = new FormData();
    // console.log("fileList length", fileList.length);
    // console.log("fileList", fileList);
    // console.log("files", files);
    // console.log("data created", data);
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      data.append(`file-${i}`, file, file.name);
    }
    // console.log("appended data", data);

    // console.log(data);
    const response = await fetch("https://httpbin.org/post", {
      method: "POST",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => console.log(data))
      .catch((err) => console.error(err));
  };
  const files = fileList ? [...fileList] : [];

  return (
    <div>
      <form className="upload-form">
        <input type="file" onChange={handleFileChange} multiple />

        <ul>
          {files.map((file, i) => (
            <li key={i}>
              {file.name} - {file.type}
            </li>
          ))}
        </ul>
        <p>Drag your files here or click in this area.</p>
        <button type="submit" onClick={handleUploadClick}>
          Upload
        </button>
      </form>
    </div>
  );
}

export default Services;
