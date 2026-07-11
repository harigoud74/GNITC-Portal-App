const mongoose = require("mongoose");

const studentProfileSchema = new mongoose.Schema(
  {
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
    fees: {
      totalFees: {type: Number, default: 0},
      amountPaid: {type: Number, default: 0},
      dueAmount: {type: Number, default: 0},
      dueDate: {type: Date},
    },
    digitalId: {
      isValid: {type: Boolean, default: false},
      issuedDate: {type: Date, default: Date.now},
      validUntil: {type: Date},
    },
    academicRecords: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "AcademicRecord",
      },
    ],
    joinedClubs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Club",
      },
    ],
    registeredEvents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
      },
    ],
    attendance: {
      totalClasses: {type: Number, default: 0},
      classesAttended: {type: Number, default: 0},
      percentage: {type: Number, default: 0},
    },
  },
  {timestamps: true},
);

// --- SMART DATABASE TRICK (Modern Synchronous Version) ---
studentProfileSchema.pre("save", function () {
  // Calculate Legacy Attendance %
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
  // No next() needed!
});

module.exports = mongoose.model("StudentProfile", studentProfileSchema);
