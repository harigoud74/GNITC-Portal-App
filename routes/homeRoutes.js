const express = require("express");
const router = express.Router();

// Home Route
router.get("/", (req, res) => {
  res.render("homeheader");
});

// Don't forget to import the model at the top of homeRoutes.js if you haven't!
const StudentProfile = require("../models/StudentProfile");

// The ":rollNo" part acts as a variable wildcard in the URL
router.get("/attendance/:rollNo", async (req, res) => {
  try {
    // 1. Grab the roll number from the URL
    const studentRollNo = req.params.rollNo;

    // 2. Find their profile in the database
    const profile = await StudentProfile.findOne({rollNo: studentRollNo});

    if (!profile) {
      return res.send("Profile data not found for this student.");
    }

    // 3. Send the real data to the EJS file
    res.render("attendance", {profile: profile});
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
