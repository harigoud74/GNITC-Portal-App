const express = require("express");
const router = express.Router();

const ctrl = require("../controllers/studentController");
const upload = require("../config/multer");

// ==========================================
// STATIC PAGES
// ==========================================

router.get("/about", (req, res) => res.render("about"));

// ==========================================
// AUTHENTICATION
// ==========================================

router.get("/student-register", (req, res) => res.render("studentRegister"));

router.post("/register", upload.single("photo"), ctrl.registerStudent);

router.get("/student-login", (req, res) => res.render("studentLogin"));

router.post("/student-login", ctrl.loginStudent);

router.get("/student-logout", (req, res) => res.redirect("/student-login"));

// ==========================================
// DASHBOARD
// ==========================================

router.get("/dashboard/:rollNo", ctrl.getDashboard);

// ==========================================
// ATTENDANCE
// ==========================================

router.get("/attendance/:rollNo", ctrl.getAttendance);

// ==========================================
// FEES
// ==========================================

router.get("/fees/:rollNo", ctrl.getFees);

router.get("/checkout/:rollNo", ctrl.getCheckout);

router.post("/process-payment/:rollNo", ctrl.processPayment);

// ==========================================
// EVENTS & CLUBS
// ==========================================

router.get("/events/:rollNo", ctrl.getEvents);

router.get("/clubs/:rollNo", ctrl.getClubs);

// ==========================================
// ACCOUNT SETTINGS
// ==========================================

router.get("/account/:rollNo", ctrl.getAccount);

// Update Contact Information
router.post("/account/contact/:rollNo", ctrl.updateContactInfo);

// Update Password
router.post("/account/password/:rollNo", ctrl.updatePassword);

// ID Card
router.get("/digital-id/:rollNo", ctrl.getDigitalId);
router.get("/verify/:rollNo", ctrl.verifyStudent);
router.get("/digital-id/pdf/:rollNo", ctrl.downloadDigitalId);

module.exports = router;
