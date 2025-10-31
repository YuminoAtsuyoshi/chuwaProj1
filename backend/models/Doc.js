const mongoose = require("mongoose");

const docSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^https?:\/\//.test(v);
      },
      message: "Valid URL is required",
    },
  },
  fileType: {
    type: String,
    required: true,
  },
});

const Doc = mongoose.model("Doc", docSchema);

module.exports = Doc;
