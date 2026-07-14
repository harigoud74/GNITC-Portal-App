// Import your Mongoose models
const StudentAuth = require("../models/StudentAuth");
const StudentProfile = require("../models/StudentProfile");
const Event = require("../models/Event");
const Club = require("../models/Club");
const AcademicRecord = require("../models/AcademicRecord");
const QRCode = require("qrcode");
const crypto = require("crypto");

// ==========================================
// --- 1. AUTHENTICATION & REGISTRATION ---
// ==========================================

exports.registerStudent = async (req, res) => {
  try {
    console.log("========== REGISTER ==========");
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    const {name, rollNo, email, password} = req.body;

    const photo = req.file
      ? "/uploads/" + req.file.filename
      : "/uploads/default-avatar.png";

    console.log("PHOTO PATH:", photo);

    // Check if student already exists
    if (await StudentAuth.findOne({rollNo})) {
      return res.send("Already exists.");
    }

    // Create authentication account
    const student = await StudentAuth.create({
      name,
      rollNo,
      email,
      password,
    });

    // Create student profile
    await StudentProfile.create({
      studentAccountId: student._id,
      rollNo: student.rollNo,

      personal: {
        profileImage: photo,
      },

      academic: {
        department: "CSE",
        program: "B.Tech",
        semester: 1,
        section: "A",
        admissionYear: new Date().getFullYear(),
      },

      contact: {
        email: student.email,
        phone: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
      },

      parent: {
        fatherName: "",
        motherName: "",
        guardianName: "",
        guardianPhone: "",
      },

      fees: {
        totalFees: 100000,
        amountPaid: 0,
      },
    });

    // Redirect to login
    res.redirect("/student-login");
  } catch (error) {
    console.error("🚨 REGISTRATION CRASH:", error);
    res.status(500).send("Registration Error");
  }
};

exports.loginStudent = async (req, res) => {
  try {
    const {rollNo, password} = req.body;
    const student = await StudentAuth.findOne({rollNo});

    if (!student || student.password !== password) {
      return res.send("Invalid credentials.");
    }

    res.redirect(`/dashboard/${rollNo}`);
  } catch (error) {
    console.error("🚨 LOGIN CRASH:", error);
    res.status(500).send("Login Error");
  }
};

// ==========================================
// --- 2. MAIN DASHBOARD ---
// ==========================================

exports.getDashboard = async (req, res) => {
  try {
    const student = await StudentAuth.findOne({rollNo: req.params.rollNo});
    const profile = await StudentProfile.findOne({rollNo: req.params.rollNo})
      .populate("joinedClubs")
      .populate("registeredEvents")
      .populate("academicRecords");

    if (!student || !profile) return res.send("Profile not found.");

    // --- MANUAL OVERRIDE SYNC LOGIC ---
    let totalClasses = profile.attendance?.totalClasses || 0;
    let classesAttended = profile.attendance?.classesAttended || 0;
    let overallAttendance = profile.attendance?.percentage || 0;

    // Fall back to dynamic subject math ONLY if manual override is 0
    if (
      totalClasses === 0 &&
      profile.academicRecords &&
      profile.academicRecords.length > 0
    ) {
      profile.academicRecords.forEach((record) => {
        totalClasses += record.total || 0;
        classesAttended += record.attended || 0;
      });

      if (totalClasses > 0) {
        overallAttendance = Math.round((classesAttended / totalClasses) * 100);
      }
    }

    const recentActivities = [
      ...profile.joinedClubs.map((c) => ({...c.toObject(), type: "Club"})),
      ...profile.registeredEvents.map((e) => ({
        ...e.toObject(),
        type: "Event",
      })),
    ];

    res.render("studentProfile", {
      student,
      profile,
      recentActivities,
      dynamicAttendance: overallAttendance,
    });
  } catch (error) {
    console.error("🚨 DASHBOARD CRASH MAP:", error);
    res.status(500).send("Dashboard Error");
  }
};
// ==========================================
// --- 3. FEE & PAYMENT LOGIC ---
// ==========================================

exports.getFees = async (req, res) => {
  try {
    const [student, profile] = await Promise.all([
      StudentAuth.findOne({rollNo: req.params.rollNo}),
      StudentProfile.findOne({rollNo: req.params.rollNo}),
    ]);

    if (!student || !profile) return res.send("Profile data not found.");

    res.render("feeDetails", {student, profile});
  } catch (error) {
    console.error("🚨 FEES PAGE CRASH:", error);
    res.status(500).send("Server Error");
  }
};

exports.getCheckout = async (req, res) => {
  try {
    const [student, profile] = await Promise.all([
      StudentAuth.findOne({rollNo: req.params.rollNo}),
      StudentProfile.findOne({rollNo: req.params.rollNo}),
    ]);

    // Safety check: if fees object is missing or amount is 0
    if (!profile.fees || profile.fees.dueAmount === 0) {
      return res.redirect(`/fees/${req.params.rollNo}`);
    }

    res.render("checkout", {student, profile});
  } catch (error) {
    console.error("🚨 CHECKOUT PAGE CRASH:", error);
    res.status(500).send("Server Error");
  }
};

exports.processPayment = async (req, res) => {
  try {
    const paymentAmount = Number(req.body.paymentAmount) || 0;
    const paymentMethod = req.body.paymentMethod || "Net Banking";
    const profile = await StudentProfile.findOne({rollNo: req.params.rollNo});

    // Safely calculate new amounts
    const currentPaid = profile.fees?.amountPaid || 0;
    const totalFees = profile.fees?.totalFees || 100000;

    const newAmountPaid = currentPaid + paymentAmount;
    const newDueAmount = Math.max(0, totalFees - newAmountPaid);

    // Generate a mock Bank Transaction ID (e.g., TXN849302)
    const mockTxnId = "TXN" + Math.floor(100000 + Math.random() * 900000);

    // Update the balances AND push the new receipt to the history log
    await StudentProfile.findOneAndUpdate(
      {rollNo: req.params.rollNo},
      {
        $set: {
          "fees.amountPaid": newAmountPaid,
          "fees.dueAmount": newDueAmount,
        },
        $push: {
          "fees.transactions": {
            amount: paymentAmount,
            paymentMethod: paymentMethod,
            transactionId: mockTxnId,
          },
        },
      },
    );

    // Redirect back to fees with a success flag
    res.redirect(`/fees/${req.params.rollNo}?payment=success`);
  } catch (error) {
    console.error("🚨 PAYMENT PROCESS CRASH:", error);
    res.status(500).send("Payment Processing Failed");
  }
};

// ==========================================
// --- 4. ACCOUNT SETTINGS ---
// ==========================================

exports.getAccount = async (req, res) => {
  try {
    const [student, profile] = await Promise.all([
      StudentAuth.findOne({rollNo: req.params.rollNo}),
      StudentProfile.findOne({rollNo: req.params.rollNo}),
    ]);

    if (!student || !profile) {
      return res.send("Student not found.");
    }

    // -------- Profile Completion --------

    let completed = 0;
    let total = 12;

    if (student.name) completed++;
    if (student.email) completed++;

    if (profile.contact?.phone) completed++;
    if (profile.contact?.address) completed++;
    if (profile.contact?.city) completed++;
    if (profile.contact?.state) completed++;
    if (profile.contact?.pincode) completed++;

    if (profile.academic?.department) completed++;
    if (profile.academic?.program) completed++;
    if (profile.academic?.semester) completed++;
    if (profile.academic?.section) completed++;
    if (profile.academic?.admissionYear) completed++;

    const profileCompletion = Math.round((completed / total) * 100);

    res.render("accountSettings", {
      student,
      profile,
      profileCompletion,
      query: req.query,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
};

// ==========================================
// --- UPDATE ACCOUNT SETTINGS ---
// ==========================================

// ==========================================
// UPDATE CONTACT INFORMATION
// ==========================================

exports.updateContactInfo = async (req, res) => {
  try {
    const {phone, address, city, state, pincode} = req.body;

    await StudentProfile.findOneAndUpdate(
      {rollNo: req.params.rollNo},
      {
        $set: {
          "contact.phone": phone,
          "contact.address": address,
          "contact.city": city,
          "contact.state": state,
          "contact.pincode": pincode,
        },
      },
    );

    res.redirect(`/account/${req.params.rollNo}?contact=success`);
  } catch (error) {
    console.error("🚨 CONTACT UPDATE ERROR:", error);
    res.status(500).send("Failed to update contact information.");
  }
};

// ==========================================
// UPDATE PASSWORD
// ==========================================

exports.updatePassword = async (req, res) => {
  try {
    const {newPassword, confirmPassword} = req.body;

    if (!newPassword || newPassword.trim() === "") {
      return res.send("Password cannot be empty.");
    }

    if (newPassword !== confirmPassword) {
      return res.send("Passwords do not match.");
    }

    await StudentAuth.findOneAndUpdate(
      {rollNo: req.params.rollNo},
      {
        $set: {
          password: newPassword,
        },
      },
    );

    res.redirect(`/account/${req.params.rollNo}?password=success`);
  } catch (error) {
    console.error("🚨 PASSWORD UPDATE ERROR:", error);
    res.status(500).send("Failed to update password.");
  }
};

// ==========================================
// --- 5. EVENTS & CLUBS ---
// ==========================================

exports.getEvents = async (req, res) => {
  try {
    const profile = await StudentProfile.findOne({
      rollNo: req.params.rollNo,
    }).populate("registeredEvents");
    const allEvents = await Event.find({date: {$gte: new Date()}}).sort({
      date: 1,
    });

    res.render("events", {
      student: {rollNo: profile.rollNo},
      profile,
      allEvents,
      registeredEventIds: profile.registeredEvents.map((e) => e._id.toString()),
    });
  } catch (error) {
    console.error("🚨 EVENTS PAGE CRASH:", error);
    res.status(500).send("Server Error");
  }
};

exports.getClubs = async (req, res) => {
  try {
    const profile = await StudentProfile.findOne({
      rollNo: req.params.rollNo,
    }).populate("joinedClubs");
    const allClubs = await Club.find();

    res.render("clubs", {
      student: {rollNo: profile.rollNo},
      profile,
      allClubs,
      joinedClubIds: profile.joinedClubs.map((c) => c._id.toString()),
    });
  } catch (error) {
    console.error("🚨 CLUBS PAGE CRASH:", error);
    res.status(500).send("Server Error");
  }
};

// --- DETAILED ATTENDANCE PAGE ---
exports.getAttendance = async (req, res) => {
  try {
    const student = await StudentAuth.findOne({rollNo: req.params.rollNo});
    const profile = await StudentProfile.findOne({
      rollNo: req.params.rollNo,
    }).populate("academicRecords");

    if (!student || !profile) return res.send("Profile data not found.");

    // Dynamic Math Logic
    let totalClasses = profile.attendance?.totalClasses || 0;
    let classesAttended = profile.attendance?.classesAttended || 0;
    let overallAttendance = profile.attendance?.percentage || 0;

    if (
      totalClasses === 0 &&
      profile.academicRecords &&
      profile.academicRecords.length > 0
    ) {
      profile.academicRecords.forEach((record) => {
        totalClasses += record.total || 0;
        classesAttended += record.attended || 0;
      });
      if (totalClasses > 0) {
        overallAttendance = Math.round((classesAttended / totalClasses) * 100);
      }
    }

    res.render("attendance", {
      student,
      profile,
      dynamicAttendance: overallAttendance,
    });
  } catch (error) {
    console.error("🚨 DETAILED ATTENDANCE CRASH:", error);
    res.status(500).send("Server Error");
  }
};

exports.getDigitalId = async (req, res) => {
  try {
    const student = await StudentAuth.findOne({
      rollNo: req.params.rollNo,
    });

    const profile = await StudentProfile.findOne({
      rollNo: req.params.rollNo,
    });

    if (!student || !profile) {
      return res.status(404).send("Student not found");
    }
    // Generate a secure verification token
    const token = crypto
      .createHmac("sha256", process.env.VERIFY_SECRET)
      .update(student.rollNo)
      .digest("hex");

    // URL that will open after scanning the QR code
    const verifyUrl = `${process.env.APP_URL}/verify/${student.rollNo}?token=${token}`;

    // Generate QR Code as Base64 image
    const qrCode = await QRCode.toDataURL(verifyUrl);

    res.render("digitalId", {
      student,
      profile,
      qrCode,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

exports.verifyStudent = async (req, res) => {
  try {
    const {rollNo} = req.params;
    const {token} = req.query;

    if (!token) {
      return res.status(403).send("Verification Failed");
    }

    // Generate the expected token
    const expectedToken = crypto
      .createHmac("sha256", process.env.VERIFY_SECRET)
      .update(rollNo)
      .digest("hex");

    // Compare securely
    if (token !== expectedToken) {
      return res.status(403).send("Invalid QR Code");
    }

    const student = await StudentAuth.findOne({rollNo});

    const profile = await StudentProfile.findOne({rollNo});

    if (!student || !profile) {
      return res.status(404).send("Student Not Found");
    }

    res.render("verifyStudent", {
      student,
      profile,
      verifiedAt: new Date(),
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};
