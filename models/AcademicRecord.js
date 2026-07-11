const mongoose = require("mongoose");

const academicRecordSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StudentProfile",
      required: true,
    },
    semester: {type: Number, required: true},
    performance: [
      {
        subject: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Subject",
          required: true,
        },
        attendance: {
          totalClasses: {type: Number, default: 0},
          classesAttended: {type: Number, default: 0},
          percentage: {type: Number, default: 0},
        },
        marks: {
          midterms: {type: Number, default: 0},
          finals: {type: Number, default: 0},
          total: {type: Number, default: 0},
          grade: {type: String, default: "NA"},
        },
      },
    ],
  },
  {timestamps: true},
);

// --- SMART DATABASE TRICK (Modern Synchronous Version) ---
academicRecordSchema.pre("save", function () {
  if (this.performance && this.performance.length > 0) {
    this.performance.forEach((item) => {
      if (item.attendance && item.attendance.totalClasses > 0) {
        item.attendance.percentage = (
          (item.attendance.classesAttended / item.attendance.totalClasses) *
          100
        ).toFixed(2);
      }
      if (item.marks) {
        item.marks.total =
          (item.marks.midterms || 0) + (item.marks.finals || 0);

        if (item.marks.total >= 90) item.marks.grade = "O";
        else if (item.marks.total >= 80) item.marks.grade = "A+";
        else if (item.marks.total >= 70) item.marks.grade = "A";
        else if (item.marks.total >= 60) item.marks.grade = "B+";
        else if (item.marks.total >= 50) item.marks.grade = "B";
        else item.marks.grade = item.marks.total > 0 ? "F" : "NA";
      }
    });
  }
  // No next() needed!
});

module.exports = mongoose.model("AcademicRecord", academicRecordSchema);
