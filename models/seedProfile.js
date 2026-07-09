const mongoose = require("mongoose");
const connectDB = require("./db");
const StudentAuth = require("./StudentAuth");
const StudentProfile = require("./StudentProfile");

async function seedData() {
  await connectDB();
  const targetRollNo = "24ME042";

  try {
    // 1. Check if the login account exists
    let student = await StudentAuth.findOne({rollNo: targetRollNo});

    // 2. IF NOT: Create a fake login account for them automatically!
    if (!student) {
      console.log(`⚠️ Login account not found. Creating a new one...`);
      student = new StudentAuth({
        name: "Test Student", // You can change this name!
        rollNo: targetRollNo,
        password: "password123",
      });
      await student.save();
    }

    // 3. Clear any broken old profiles
    await StudentProfile.deleteOne({rollNo: targetRollNo});

    // 4. Create the Dashboard Profile
    const newProfile = new StudentProfile({
      studentAccountId: student._id,
      rollNo: student.rollNo,
      attendance: {
        totalClasses: 120,
        classesAttended: 105,
      },
      fees: {
        totalFees: 100000,
        amountPaid: 75000,
      },
    });

    await newProfile.save();
    console.log(`✅ SUCCESS! Complete profile generated for ${targetRollNo}`);
    console.log(`You can now refresh your browser!`);
  } catch (error) {
    console.error("Database error:", error);
  } finally {
    mongoose.connection.close();
  }
}

seedData();
