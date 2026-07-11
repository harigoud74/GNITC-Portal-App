// Import your Mongoose models
const Faculty = require("../models/Faculty");
const StudentAuth = require("../models/StudentAuth");
const StudentProfile = require("../models/StudentProfile");

// ==========================================
// --- 1. AUTHENTICATION ---
// ==========================================

exports.renderLogin = (req, res) => {
  res.render("faculty/login", {error: null});
};

exports.processLogin = async (req, res) => {
  try {
    const {email, password} = req.body;

    // Admin Bypass (Super handy for emergency testing!)
    if (email === "admin@gnitc.edu" && password === "admin123") {
      return res.redirect("/faculty/overview");
    }

    // Look up the faculty member in the database
    const facultyUser = await Faculty.findOne({email: email});

    // Verify they exist AND the password matches
    if (facultyUser && facultyUser.password === password) {
      return res.redirect("/faculty/overview");
    } else {
      return res.render("faculty/login", {
        error: "Invalid Email or Password. Please try again.",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error during login");
  }
};

// ==========================================
// --- 2. DASHBOARD OVERVIEW ---
// ==========================================

exports.getOverview = async (req, res) => {
  try {
    const allStudents =
      await StudentProfile.find().populate("studentAccountId");

    res.render("faculty/layout", {
      body: "overview",
      students: allStudents,
      title: "Dashboard Overview",
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Server Error");
  }
};

// ==========================================
// --- 3. DIRECTORY & ACTIONS ---
// ==========================================

exports.renderDirectory = async (req, res) => {
  try {
    // Fetch all students and populate their profiles
    const students = await StudentProfile.find().populate("studentAccountId");

    res.render("faculty/layout", {
      body: "directory",
      title: "Student Directory",
      students,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

exports.updateAttendance = async (req, res) => {
  try {
    const {rollNo, totalClasses, classesAttended} = req.body;

    const total = parseInt(totalClasses, 10);
    const attended = parseInt(classesAttended, 10);

    let percentage = 0;
    if (total > 0) {
      percentage = Math.round((attended / total) * 100);
    }

    await StudentProfile.findOneAndUpdate(
      {rollNo: rollNo},
      {
        $set: {
          "attendance.totalClasses": total,
          "attendance.classesAttended": attended,
          "attendance.percentage": percentage,
        },
      },
    );

    res.redirect("/faculty/students");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating attendance");
  }
};

exports.processFeePayment = async (req, res) => {
  try {
    const {rollNo, paymentAmount} = req.body;
    const payment = Number(paymentAmount);

    const student = await StudentProfile.findOne({rollNo: rollNo});

    if (!student) {
      return res.status(404).send("Student not found");
    }

    const newAmountPaid = student.fees.amountPaid + payment;
    const newDueAmount = Math.max(0, student.fees.totalFees - newAmountPaid);

    await StudentProfile.findOneAndUpdate(
      {rollNo: rollNo},
      {
        $set: {
          "fees.amountPaid": newAmountPaid,
          "fees.dueAmount": newDueAmount,
        },
      },
    );

    res.redirect("/faculty/students");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error processing fee payment");
  }
};
