const mongoose = require("mongoose");

// Import all 7 Models
const Faculty = require("./models/faculty");
const Subject = require("./models/Subject");
const Event = require("./models/Event");
const Club = require("./models/Club");
const StudentAuth = require("./models/StudentAuth");
const StudentProfile = require("./models/studentProfile");
const AcademicRecord = require("./models/AcademicRecord");

// Connect to MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/StudentAndFacultyDashboard")
  .then(() => console.log("🟢 Connected to MongoDB"))
  .catch((err) => console.error("🔴 Connection Error:", err));

async function runTest() {
  try {
    console.log("🧹 Wiping old test data...");
    await Promise.all([
      Faculty.deleteMany({}),
      Subject.deleteMany({}),
      Event.deleteMany({}),
      Club.deleteMany({}),
      StudentAuth.deleteMany({}),
      StudentProfile.deleteMany({}),
      AcademicRecord.deleteMany({}),
    ]);

    console.log("🛠️ Building new relational data...");

    // 1. Create Faculty
    const admin = await Faculty.create({
      facultyId: "FAC-001",
      name: "Dr. Smith",
      email: "admin@gnitc.edu",
      password: "password123",
      department: "Admin",
      role: "Admin",
    });

    // 2. Create Global Campus Data (Subject, Event, Club)
    const subject = await Subject.create({
      name: "Database Systems",
      code: "CS303",
      semester: 3,
    });
    const hackathon = await Event.create({
      title: "HackWeb 2026",
      type: "Technical",
      date: new Date(),
      location: "Main Lab",
    });
    const codingClub = await Club.create({
      name: "Code Ninjas",
      category: "Tech",
      description: "Learn to code.",
    });

    // 3. Create a Student
    const auth = await StudentAuth.create({
      name: "Hari Prasad",
      rollNo: "24CS076",
      email: "hari@gnitc.edu",
      password: "pass",
    });

    // 4. Create the Profile (Linking to Auth, Event, and Club)
    const profile = await StudentProfile.create({
      studentAccountId: auth._id,
      rollNo: auth.rollNo,
      fees: {totalFees: 100000, amountPaid: 25000}, // Pre-save should calculate 75,000 due!
      registeredEvents: [hackathon._id],
      joinedClubs: [codingClub._id],
    });

    // 5. Create Academic Record (Linking to Profile and Subject)
    const record = await AcademicRecord.create({
      student: profile._id,
      semester: 3,
      performance: [
        {
          subject: subject._id,
          attendance: {totalClasses: 40, classesAttended: 30}, // Pre-save should calculate 75%
          marks: {midterms: 25, finals: 60}, // Pre-save should calculate Total 85 and Grade A+
        },
      ],
    });

    // 6. Link the record back to the profile
    profile.academicRecords.push(record._id);
    await profile.save();

    console.log("\n✅ ALL MODELS WORKING PERFECTLY!");
    console.log(`- Created Student: ${auth.name}`);
    console.log(`- Fee Due Amount Calculated: ₹${profile.fees.dueAmount}`);
    console.log(
      `- Connected to Event: ${profile.registeredEvents.length} event(s)`,
    );
    console.log(
      `- Math Triggered! Subject Total: ${record.performance[0].marks.total}, Grade: ${record.performance[0].marks.grade}`,
    );

    process.exit(0);
  } catch (error) {
    console.error("\n❌ MODEL TEST FAILED:");
    console.error(error.stack); // This prints the exact file and line number!
    process.exit(1);
  }
}

runTest();
