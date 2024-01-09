const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    image: { type: String },
    active: { type: Boolean, default: true },
    parent: {
      type: mongoose.Schema.ObjectId,
      ref: "category",
    },
    isDeleted: { type: Boolean, default: false },
    default: [],
  },
  { timestamps: true }
);
module.exports = mongoose.model("category", categorySchema);
