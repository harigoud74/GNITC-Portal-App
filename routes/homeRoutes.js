const express = require("express");
const router = express.Router();
const StudentAuth = require("../models/StudentAuth");
const StudentProfile = require("../models/StudentProfile");

// Home Route
router.get("/", (req, res) => {
  res.render("homeheader");
});

// Don't forget to import the model at the top of homeRoutes.js if you haven't!

// The ":rollNo" part recentActivities as a variable wildcard in the URL
router.get("/attendance/:rollNo", async (req, res) => {
  try {
    // 1. Fetch the data and populate the subjects
    const student = await StudentAuth.findOne({rollNo: req.params.rollNo});
    const profile = await StudentProfile.findOne({
      rollNo: req.params.rollNo,
    }).populate("academicRecords");

    if (!student || !profile) return res.send("Profile data not found.");

    // 2. Calculate the dynamic attendance
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

    // 3. Render the page WITH the new dynamicAttendance variable
    res.render("attendance", {
      student,
      profile,
      dynamicAttendance: overallAttendance, // <-- This stops the crash!
    });
  } catch (error) {
    console.error("🚨 DETAILED ATTENDANCE CRASH:", error);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
