const mongoose = require("mongoose");

const studentProfileSchema = new mongoose.Schema(
  {
    // ==========================
    // Student Authentication Link
    // ==========================
    studentAccountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StudentAuth",
      required: true,
    },
    photo: {
      type: String,
      default: "/uploads/default-avatar.png",
    },

    rollNo: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },

    // ==========================
    // Personal Information
    // ==========================
    personal: {
      profileImage: {
        type: String,
        default: "/images/default-avatar.png",
      },

      dateOfBirth: {
        type: Date,
      },

      gender: {
        type: String,
        enum: ["Male", "Female", "Other"],
      },

      bloodGroup: {
        type: String,
        enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
      },
    },

    // ==========================
    // Academic Information
    // ==========================
    academic: {
      department: {
        type: String,
        enum: [
          "CSE",
          "CSE (AI & ML)",
          "CSE (Data Science)",
          "IT",
          "ECE",
          "EEE",
          "Mechanical",
          "Civil",
        ],
        default: "CSE",
      },

      program: {
        type: String,
        default: "B.Tech",
      },

      semester: {
        type: Number,
        min: 1,
        max: 8,
        default: 1,
      },

      section: {
        type: String,
        enum: ["A", "B", "C", "D", "E"],
        default: "A",
      },

      admissionYear: {
        type: Number,
        default: new Date().getFullYear(),
      },

      batch: {
        type: String,
        default: "",
      },

      cgpa: {
        type: Number,
        default: 0,
        min: 0,
        max: 10,
      },

      creditsEarned: {
        type: Number,
        default: 0,
      },
    },

    // ==========================
    // Contact Information
    // ==========================
    contact: {
      phone: {
        type: String,
        default: "",
      },

      email: {
        type: String,
        default: "",
      },

      address: {
        type: String,
        default: "",
      },

      city: {
        type: String,
        default: "",
      },

      state: {
        type: String,
        default: "",
      },

      pincode: {
        type: String,
        default: "",
      },
    },

    // ==========================
    // Parent Information
    // ==========================
    parent: {
      fatherName: {
        type: String,
        default: "",
      },

      motherName: {
        type: String,
        default: "",
      },

      guardianName: {
        type: String,
        default: "",
      },

      guardianPhone: {
        type: String,
        default: "",
      },
    },

    // ==========================
    // Fee Details
    // ==========================
    fees: {
      totalFees: {
        type: Number,
        default: 100000,
      },

      amountPaid: {
        type: Number,
        default: 0,
      },

      dueAmount: {
        type: Number,
        default: 100000,
      },

      transactions: [
        {
          amount: Number,

          date: {
            type: Date,
            default: Date.now,
          },

          paymentMethod: String,

          transactionId: String,
        },
      ],
    },

    // ==========================
    // Digital ID
    // ==========================
    digitalId: {
      isValid: {
        type: Boolean,
        default: false,
      },

      issuedDate: {
        type: Date,
        default: Date.now,
      },

      validUntil: Date,
    },

    // ==========================
    // Attendance
    // ==========================
    attendance: {
      totalClasses: {
        type: Number,
        default: 0,
      },

      classesAttended: {
        type: Number,
        default: 0,
      },

      percentage: {
        type: Number,
        default: 0,
      },
    },

    // ==========================
    // Academic Records
    // ==========================
    academicRecords: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "AcademicRecord",
      },
    ],

    // ==========================
    // Clubs
    // ==========================
    joinedClubs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Club",
      },
    ],

    // ==========================
    // Events
    // ==========================
    registeredEvents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
      },
    ],

    // ==========================
    // Account Status
    // ==========================
    account: {
      status: {
        type: String,
        enum: ["Active", "Inactive", "Graduated"],
        default: "Active",
      },

      lastLogin: Date,
    },
  },
  {
    timestamps: true,
  },
);

// ======================================
// Automatically Calculate Attendance & Fees
// ======================================

studentProfileSchema.pre("save", function () {
  // Attendance Percentage
  if (this.attendance.totalClasses > 0) {
    this.attendance.percentage = Number(
      (
        (this.attendance.classesAttended / this.attendance.totalClasses) *
        100
      ).toFixed(2),
    );
  }

  // Fee Due
  this.fees.dueAmount = this.fees.totalFees - this.fees.amountPaid;

  // Auto Batch
  if (this.academic.admissionYear && !this.academic.batch) {
    this.academic.batch = `${this.academic.admissionYear}-${
      this.academic.admissionYear + 4
    }`;
  }
});

module.exports = mongoose.model("StudentProfile", studentProfileSchema);
