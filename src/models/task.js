const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema(
  {
    owner: String,
    task: {
      type: String,
      required: true
    },
    priority: {
      type: String,
      default: "normal",
      enum: ["low", "normal", "high"]
    },
    status: {
      type: String,
      default: "new",
      enum: ["new", "in work", "done"]
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Task", TaskSchema);
