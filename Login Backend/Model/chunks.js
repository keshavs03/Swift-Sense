const mongoose = require("mongoose");

const userschema = new mongoose.Schema({
  files_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "fs.files",
    field: "_id",
  },
  n: {
    type: Number,
    required: true,
  },
  data: {
    type: Buffer,
    required: true,
  },
});

const Output = mongoose.model("fs.chunk", userschema);

module.exports = Output;
