const express = require("express");
const router = express.Router();

// --- DATABASE MODELS ---
const StudentAuth = require("../models/StudentAuth");
const StudentProfile = require("../models/StudentProfile");
const Faculty = require("../models/Faculty"); // <--- New Faculty Model!

// ==========================================
// STUDENT ROUTES
// ==========================================

// 1. THIS SHOWS THE REGISTRATION FORM
router.get("/student-register", (req, res) => {
  res.render("studentRegister");
});

// 2. THIS PROCESSES THE REGISTRATION FORM
router.post("/student-register", async (req, res) => {
  try {
    const {name, rollNo, email, password} = req.body;

    const existingStudent = await StudentAuth.findOne({rollNo: rollNo});
    if (existingStudent) {
      return res.send(
        "A student with this Roll Number already exists. Please log in.",
      );
    }

    const newStudent = new StudentAuth({name, rollNo, email, password});
    await newStudent.save();

    const newProfile = new StudentProfile({
      studentAccountId: newStudent._id,
      rollNo: newStudent.rollNo,
      attendance: {totalClasses: 0, classesAttended: 0},
      fees: {totalFees: 0, amountPaid: 0},
      exams: [],
      activities: [],
    });
    await newProfile.save();

    res.redirect("/student-login");
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error during registration");
  }
});

// 3. THIS SHOWS THE LOGIN FORM
router.get("/student-login", (req, res) => {
  res.render("studentLogin");
});

// 4. THIS PROCESSES THE LOGIN FORM & LOADS DASHBOARD
router.post("/student-login", async (req, res) => {
  try {
    let {rollNo, password} = req.body;
    const student = await StudentAuth.findOne({rollNo: rollNo});

    if (!student) return res.send("Not found");
    if (student.password !== password)
      return res.send("Invalid rollNo or password.");

    let profileData = await StudentProfile.findOne({rollNo: rollNo});
    if (!profileData) {
      profileData = {
        attendance: {percentage: 0, totalClasses: 0, classesAttended: 0},
        fees: {dueAmount: 0, totalFees: 0, amountPaid: 0},
        exams: [],
        activities: [],
      };
    }

    res.render("studentProfile", {student: student, profile: profileData});
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

// 5. THIS HANDLES THE LOGOUT REQUEST
router.get("/student-logout", (req, res) => {
  res.redirect("/student-login");
});

// ==========================================
// STUDENT FEATURE ROUTES
// ==========================================

// --- FEE DETAILS PAGE ---
router.get("/fees/:rollNo", async (req, res) => {
  try {
    const targetRollNo = req.params.rollNo.toUpperCase();
    const student = await StudentAuth.findOne({rollNo: targetRollNo});
    const profile = await StudentProfile.findOne({rollNo: targetRollNo});

    if (!student || !profile) return res.send("Profile data not found.");
    res.render("feeDetails", {student, profile});
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

// --- SECURE CHECKOUT PAGE ---
router.get("/checkout/:rollNo", async (req, res) => {
  try {
    const targetRollNo = req.params.rollNo.toUpperCase();
    const student = await StudentAuth.findOne({rollNo: targetRollNo});
    const profile = await StudentProfile.findOne({rollNo: targetRollNo});

    if (!student || !profile) return res.send("Profile data not found.");
    if (profile.fees.dueAmount === 0)
      return res.redirect(`/fees/${targetRollNo}`);

    res.render("checkout", {student, profile});
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

// --- PROCESS STUDENT PAYMENT ---
router.post("/process-payment/:rollNo", async (req, res) => {
  try {
    const targetRollNo = req.params.rollNo.toUpperCase();
    const paymentAmount = Number(req.body.paymentAmount);
    const student = await StudentProfile.findOne({rollNo: targetRollNo});

    const newAmountPaid = student.fees.amountPaid + paymentAmount;
    const newDueAmount = student.fees.totalFees - newAmountPaid;

    await StudentProfile.findOneAndUpdate(
      {rollNo: targetRollNo},
      {
        $set: {
          "fees.amountPaid": newAmountPaid,
          "fees.dueAmount": newDueAmount,
        },
      },
    );
    res.redirect(`/fees/${targetRollNo}`);
  } catch (error) {
    console.error(error);
    res.status(500).send("Payment Processing Failed");
  }
});

// --- ACCOUNT SETTINGS PAGE ---
router.get("/account/:rollNo", async (req, res) => {
  try {
    const targetRollNo = req.params.rollNo.toUpperCase();
    const student = await StudentAuth.findOne({rollNo: targetRollNo});
    const profile = await StudentProfile.findOne({rollNo: targetRollNo});

    if (!student || !profile) return res.send("Profile data not found.");
    res.render("accountSettings", {student, profile, query: req.query});
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

// --- UPDATE ACCOUNT SETTINGS ---
router.post("/update-account/:rollNo", async (req, res) => {
  try {
    const targetRollNo = req.params.rollNo.toUpperCase();
    const {phone, address, newPassword} = req.body;

    if (newPassword && newPassword.trim() !== "") {
      await StudentAuth.findOneAndUpdate(
        {rollNo: targetRollNo},
        {$set: {password: newPassword}},
      );
    }
    await StudentProfile.findOneAndUpdate(
      {rollNo: targetRollNo},
      {$set: {phone, address}},
    );
    res.redirect(`/account/${targetRollNo}?success=true`);
  } catch (error) {
    console.error(error);
    res.status(500).send("Update Failed");
  }
});

// --- EVENTS PAGE ---
router.get("/events/:rollNo", async (req, res) => {
  try {
    const profile = await StudentProfile.findOne({
      rollNo: req.params.rollNo.toUpperCase(),
    });
    if (!profile) return res.send("Profile not found");
    const events = profile.activities.filter((act) => act.type === "Event");
    res.render("activities", {
      rollNo: profile.rollNo,
      activities: events,
      pageTitle: "My Events",
      icon: "bi-calendar-event",
      color: "primary",
    });
  } catch (error) {
    res.status(500).send("Server Error");
  }
});

// --- CLUBS PAGE ---
router.get("/clubs/:rollNo", async (req, res) => {
  try {
    const profile = await StudentProfile.findOne({
      rollNo: req.params.rollNo.toUpperCase(),
    });
    if (!profile) return res.send("Profile not found");
    const clubs = profile.activities.filter((act) => act.type === "Club");
    res.render("activities", {
      rollNo: profile.rollNo,
      activities: clubs,
      pageTitle: "My Clubs",
      icon: "bi-people",
      color: "warning",
    });
  } catch (error) {
    res.status(500).send("Server Error");
  }
});

// --- ABOUT PAGE ---
router.get("/about", (req, res) => {
  res.render("about");
});

// ==========================================
// FACULTY ROUTES
// ==========================================

// --- GET FACULTY REGISTER PAGE ---
// --- GET FACULTY REGISTER PAGE ---
router.get("/faculty-login", (req, res) => {
  res.render("facultyRegister"); // <-- Change this to "facultyregister"
});

// --- PROCESS FACULTY REGISTRATION ---
router.post("/faculty-register", async (req, res) => {
  try {
    const {name, email, facultyId, department, password} = req.body;
    const newFaculty = new Faculty({
      name,
      email,
      facultyId,
      department,
      password,
    });
    await newFaculty.save();
    res.redirect("/faculty-login");
  } catch (error) {
    console.error(error);
    res.send(
      "Error registering faculty. Make sure Email and Faculty ID are unique.",
    );
  }
});

// --- GET FACULTY LOGIN PAGE ---
router.get("/faculty-login", (req, res) => {
  res.render("facultyLogin", {error: null});
});

// --- PROCESS FACULTY LOGIN ---
router.post("/faculty-login", async (req, res) => {
  try {
    const {email, password} = req.body;

    // Admin bypass for testing
    if (email === "admin@gnitc.edu" && password === "admin123") {
      return res.redirect("/faculty-dashboard");
    }

    const facultyUser = await Faculty.findOne({email: email});
    if (facultyUser && facultyUser.password === password) {
      res.redirect("/faculty-dashboard");
    } else {
      res.render("facultyLogin", {error: "Invalid Email or Password"});
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

// --- GET FACULTY DASHBOARD ---
router.get("/faculty-dashboard", async (req, res) => {
  try {
    const allAuths = await StudentAuth.find({});
    const allProfiles = await StudentProfile.find({});
    res.render("facultyDashboard", {auths: allAuths, profiles: allProfiles});
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error loading Faculty Dashboard");
  }
});

module.exports = router;
