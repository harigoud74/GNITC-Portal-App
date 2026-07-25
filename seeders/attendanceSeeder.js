const mongoose = require("mongoose");
require("dotenv").config();

const StudentAuth = require("../models/StudentAuth");
const StudentProfile = require("../models/studentProfile");
const Subject = require("../models/Subject");
const Attendance = require("../models/Attendance");

async function seedAttendance() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ MongoDB Connected");

    const students = await StudentAuth.find();
    const subjects = await Subject.find();

    if (students.length === 0) {
      console.log("❌ No students found.");
      return await mongoose.disconnect();
    }

    if (subjects.length === 0) {
      console.log("❌ No subjects found.");
      return await mongoose.disconnect();
    }

    let totalRecords = 0;

    for (const student of students) {
      const profile = await StudentProfile.findOne({
        rollNo: student.rollNo,
      });

      if (!profile) continue;

      // Subjects only for student's semester
      const semesterSubjects = subjects.filter(
        (sub) => sub.semester === profile.academic.semester,
      );

      // Create attendance for last 30 days
      for (const subject of semesterSubjects) {
        for (let i = 1; i <= 30; i++) {
          const attendanceDate = new Date();
          attendanceDate.setDate(attendanceDate.getDate() - i);

          // Prevent duplicate attendance
          const alreadyExists = await Attendance.findOne({
            student: student._id,
            subject: subject._id,
            date: attendanceDate,
          });

          if (alreadyExists) continue;

          // 90% Present, 10% Absent
          const status = Math.random() < 0.9 ? "Present" : "Absent";

          await Attendance.create({
            student: student._id,
            rollNo: student.rollNo,
            subject: subject._id,
            semester: profile.academic.semester,
            date: attendanceDate,
            status,
            markedBy: subject.facultyAssigned || "Faculty",
          });

          totalRecords++;
        }
      }
    }

    console.log(`✅ ${totalRecords} attendance records created successfully.`);

    await mongoose.disconnect();
    console.log("✅ Database disconnected.");
  } catch (err) {
    console.error("❌ Seeder Error:", err);
    await mongoose.disconnect();
  }
}

seedAttendance();
