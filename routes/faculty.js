const express = require("express");
const router = express.Router();
// Adjust this path if your models folder is somewhere else!
const StudentProfile = require("../models/StudentProfile");

// --- 1. UPDATE ATTENDANCE ROUTE ---
router.post("/update-attendance/:rollNo", async (req, res) => {
  try {
    const targetRollNo = req.params.rollNo.toUpperCase();
    const newPercentage = req.body.attendance; // The new number the teacher typed in

    // Find the student and update their attendance
    await StudentProfile.findOneAndUpdate(
      {rollNo: targetRollNo},
      {$set: {"attendance.percentage": newPercentage}},
    );

    // Send the teacher back to the dashboard after a successful update
    res.redirect("/faculty-dashboard");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating attendance");
  }
});

// --- 2. UPDATE FEES ROUTE ---
router.post("/update-fees/:rollNo", async (req, res) => {
  try {
    const targetRollNo = req.params.rollNo.toUpperCase();
    const paymentAmount = Number(req.body.payment); // How much the student just paid

    // Find the student first to calculate the new math
    const student = await StudentProfile.findOne({rollNo: targetRollNo});

    const newAmountPaid = student.fees.amountPaid + paymentAmount;
    const newDueAmount = student.fees.totalFees - newAmountPaid;

    // Save the new math to the database
    await StudentProfile.findOneAndUpdate(
      {rollNo: targetRollNo},
      {
        $set: {
          "fees.amountPaid": newAmountPaid,
          "fees.dueAmount": newDueAmount,
        },
      },
    );

    res.redirect("/faculty-dashboard");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating fees");
  }
});

module.exports = router;
