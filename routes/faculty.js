const express = require("express");
const router = express.Router();

// Import the controller ONCE
const facultyController = require("../controllers/faculty");

// Public Routes (Login/Register)
router.get("/login", facultyController.renderLogin);
router.post("/login", facultyController.processLogin);

// Protected Dashboard Routes
// THIS is our newly updated overview route!
router.get("/overview", facultyController.getOverview);

router.get("/students", facultyController.renderDirectory);
router.post("/attendance/update", facultyController.updateAttendance);
router.post("/fees/pay", facultyController.processFeePayment);

// Make sure to export the router
module.exports = router;
