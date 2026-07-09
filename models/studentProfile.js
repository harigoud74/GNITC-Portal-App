const mongoose = require("mongoose");

const studentProfileSchema = new mongoose.Schema(
  {
    // 1. The Link to your existing StudentAuth model
    studentAccountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StudentAuth",
      required: true,
    },
    rollNo: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },

    // 2. Attendance Data
    attendance: {
      totalClasses: {type: Number, default: 0},
      classesAttended: {type: Number, default: 0},
      percentage: {type: Number, default: 0},
    },

    // 3. Fee Data
    fees: {
      totalFees: {type: Number, default: 0},
      amountPaid: {type: Number, default: 0},
      dueAmount: {type: Number, default: 0},
      dueDate: {type: Date},
    },

    // 4. Exam & Grade Data
    exams: [
      {
        examName: {type: String, required: true},
        subject: {type: String, required: true},
        marksObtained: {type: Number, required: true},
        totalMarks: {type: Number, required: true},
        grade: {type: String},
      },
    ],

    // 5. Clubs & Events
    activities: [
      {
        activityName: {type: String, required: true},
        type: {type: String, enum: ["Event", "Club"], required: true},
        joinedAt: {type: Date, default: Date.now},
      },
    ],
  },
  {timestamps: true},
);

// --- SMART DATABASE TRICK (Pre-Save Middleware) ---
// Note: We completely removed the 'next' parameter here!
studentProfileSchema.pre("save", function () {
  // Calculate Attendance %
  if (this.attendance && this.attendance.totalClasses > 0) {
    this.attendance.percentage = (
      (this.attendance.classesAttended / this.attendance.totalClasses) *
      100
    ).toFixed(2);
  }

  // Calculate Fee Dues
  if (this.fees) {
    this.fees.dueAmount = this.fees.totalFees - this.fees.amountPaid;
  }
});

const StudentProfile = mongoose.model("StudentProfile", studentProfileSchema);
module.exports = StudentProfile;
