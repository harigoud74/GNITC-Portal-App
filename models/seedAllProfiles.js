const mongoose = require("mongoose");
const StudentAuth = require("./StudentAuth"); // Adjust path if your model is elsewhere
const StudentProfile = require("./StudentProfile"); // Adjust path if your model is elsewhere

// Connect to the exact database you used in your previous script
mongoose
  .connect("mongodb://127.0.0.1:27017/StudentAndFaculityDashboard")
  .then(async () => {
    console.log("Connected to MongoDB");

    try {
      // 1. Clear out any old profiles to prevent duplicates
      await StudentProfile.deleteMany({});
      console.log("Cleared existing profiles");

      // 2. Fetch the students you just created in the Auth collection
      const students = await StudentAuth.find();

      if (students.length === 0) {
        console.log(
          "⚠️ No students found! Run your StudentAuth seed script first.",
        );
        return;
      }

      // 3. Loop through each student and generate unique data for them
      for (let student of students) {
        let profileData = {
          studentAccountId: student._id, // This links the two collections!
          rollNo: student.rollNo,
          attendance: {},
          fees: {},
          exams: [],
          activities: [],
        };

        // Give them varied data based on their Roll Number
        if (student.rollNo === "24CS001") {
          // Aarav - Great student, paid in full
          profileData.attendance = {totalClasses: 100, classesAttended: 95};
          profileData.fees = {
            totalFees: 120000,
            amountPaid: 120000,
            dueDate: new Date("2026-12-31"),
          };
          profileData.exams = [
            {
              examName: "Midterm",
              subject: "Data Structures",
              marksObtained: 85,
              totalMarks: 100,
              grade: "A",
            },
          ];
          profileData.activities = [
            {activityName: "Coding Club", type: "Club"},
          ];
        } else if (student.rollNo === "24CS002") {
          // Priya - Moderate attendance, partial fees
          profileData.attendance = {totalClasses: 100, classesAttended: 75};
          profileData.fees = {
            totalFees: 120000,
            amountPaid: 60000,
            dueDate: new Date("2026-12-31"),
          };
          profileData.exams = [
            {
              examName: "Midterm",
              subject: "Algorithms",
              marksObtained: 70,
              totalMarks: 100,
              grade: "B",
            },
          ];
        } else if (student.rollNo === "24EC015") {
          // Rohan - Low attendance, zero fees paid
          profileData.attendance = {totalClasses: 120, classesAttended: 50};
          profileData.fees = {
            totalFees: 110000,
            amountPaid: 0,
            dueDate: new Date("2026-12-31"),
          };
          profileData.activities = [
            {activityName: "Tech Fest 2026", type: "Event"},
          ];
        } else if (student.rollNo === "24ME042") {
          // Ananya - Our test student, good attendance
          profileData.attendance = {totalClasses: 120, classesAttended: 105};
          profileData.fees = {
            totalFees: 100000,
            amountPaid: 75000,
            dueDate: new Date("2026-12-31"),
          };
          profileData.exams = [
            {
              examName: "Finals",
              subject: "Thermodynamics",
              marksObtained: 92,
              totalMarks: 100,
              grade: "A+",
            },
          ];
        } else {
          // Karan (or anyone else) - Default stats
          profileData.attendance = {totalClasses: 90, classesAttended: 90};
          profileData.fees = {
            totalFees: 95000,
            amountPaid: 45000,
            dueDate: new Date("2026-12-31"),
          };
        }

        // 4. Save the profile (We MUST use .save() instead of insertMany so the math middleware runs!)
        const newProfile = new StudentProfile(profileData);
        await newProfile.save();
        console.log(
          `✅ Profile created for ${student.name} (${student.rollNo})`,
        );
      }

      console.log("🎉 Successfully seeded all Student Profiles!");
    } catch (err) {
      console.error("Error inserting profile data: ", err);
    } finally {
      mongoose.connection.close();
    }
  })
  .catch((err) => console.error("Database connection error: ", err));
