const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/studentController");

// --- STATIC PAGES ---
router.get("/about", (req, res) => res.render("about"));

// --- AUTHENTICATION ---
router.get("/student-register", (req, res) => res.render("studentRegister"));
router.post("/student-register", ctrl.registerStudent);

router.get("/student-login", (req, res) => res.render("studentLogin"));
router.post("/student-login", ctrl.loginStudent);
router.get("/student-logout", (req, res) => res.redirect("/student-login"));

// --- DASHBOARD & ACADEMICS ---
router.get("/dashboard/:rollNo", ctrl.getDashboard);
router.get("/attendance/:rollNo", (req, res) =>
  res.render("attendance", {rollNo: req.params.rollNo}),
);

// --- FINANCIAL ---
router.get("/fees/:rollNo", ctrl.getFees);
router.get("/checkout/:rollNo", ctrl.getCheckout);
router.post("/process-payment/:rollNo", ctrl.processPayment);

// --- CAMPUS LIFE ---
router.get("/events/:rollNo", ctrl.getEvents);
router.get("/clubs/:rollNo", ctrl.getClubs);

// --- SETTINGS ---
router.get("/account/:rollNo", ctrl.getAccount);
router.post("/update-account/:rollNo", ctrl.updateAccount);

module.exports = router;
