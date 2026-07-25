const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StudentAuth",
      required: true,
    },

    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },

    rollNo: {
      type: String,
      required: true,
      uppercase: true,
    },

    date: {
      type: Date,
      required: true,
    },

    semester: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["Present", "Absent"],
      default: "Present",
    },

    markedBy: {
      type: String,
      default: "Faculty",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Attendance", attendanceSchema);
