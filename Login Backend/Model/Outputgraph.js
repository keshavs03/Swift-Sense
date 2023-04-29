const mongoose = require("mongoose");

const userschema = new mongoose.Schema({
  filename: {
    type: String,
    required: true,
    // unique: true,
  },
  userEmail: {
    type: String,
    required: true,
  },
  chunksize: {
    type: Number,
    required: true,
  },
  length: {
    type: Number,
    required: true,
  },
  uploadDate: {
    type: Date,
    required: true,
  },
});

const Chunk = mongoose.model("fs.file", userschema);

module.exports = Chunk;
