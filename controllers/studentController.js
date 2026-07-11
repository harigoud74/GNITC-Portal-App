// Import your Mongoose models
const StudentAuth = require("../models/StudentAuth");
const StudentProfile = require("../models/StudentProfile");
const Event = require("../models/Event");
const Club = require("../models/Club");
const AcademicRecord = require("../models/AcademicRecord");

// ==========================================
// --- 1. AUTHENTICATION & REGISTRATION ---
// ==========================================

exports.registerStudent = async (req, res) => {
  try {
    const {name, rollNo, email, password} = req.body;

    // Check if student already exists
    if (await StudentAuth.findOne({rollNo})) {
      return res.send("Already exists.");
    }

    // Create the Auth account
    const student = await StudentAuth.create({name, rollNo, email, password});

    // Create the Profile with safe default values to prevent dashboard crashes!
    await StudentProfile.create({
      studentAccountId: student._id,
      rollNo: student.rollNo,
      fees: {totalFees: 100000, amountPaid: 0}, // Gives them a default fee structure
    });

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

    // Create the 'acts' variable for the EJS view
    const acts = [
      ...profile.joinedClubs.map((c) => ({...c.toObject(), type: "Club"})),
      ...profile.registeredEvents.map((e) => ({
        ...e.toObject(),
        type: "Event",
      })),
    ];

    res.render("studentProfile", {student, profile, acts}); // Pass 'acts' here!
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
    const profile = await StudentProfile.findOne({rollNo: req.params.rollNo});

    // Safely calculate new amounts
    const currentPaid = profile.fees?.amountPaid || 0;
    const totalFees = profile.fees?.totalFees || 100000;

    const newAmountPaid = currentPaid + paymentAmount;
    const newDueAmount = Math.max(0, totalFees - newAmountPaid);

    await StudentProfile.findOneAndUpdate(
      {rollNo: req.params.rollNo},
      {
        $set: {
          "fees.amountPaid": newAmountPaid,
          "fees.dueAmount": newDueAmount,
        },
      },
    );

    res.redirect(`/fees/${req.params.rollNo}`);
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
    res.render("accountSettings", {student, profile, query: req.query});
  } catch (error) {
    console.error("🚨 ACCOUNT SETTINGS CRASH:", error);
    res.status(500).send("Server Error");
  }
};

exports.updateAccount = async (req, res) => {
  try {
    const {phone, address, newPassword} = req.body;

    if (newPassword && newPassword.trim() !== "") {
      await StudentAuth.findOneAndUpdate(
        {rollNo: req.params.rollNo},
        {$set: {password: newPassword}},
      );
    }

    await StudentProfile.findOneAndUpdate(
      {rollNo: req.params.rollNo},
      {$set: {phone, address}},
    );

    res.redirect(`/account/${req.params.rollNo}?success=true`);
  } catch (error) {
    console.error("🚨 ACCOUNT UPDATE CRASH:", error);
    res.status(500).send("Update Failed");
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
