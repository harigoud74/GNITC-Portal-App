const mongoose = require("mongoose");
require("dotenv").config();

const Subject = require("../models/Subject");

async function seedSubjects() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    await Subject.deleteMany();

    await Subject.insertMany([
      {
        name: "Data Structures",
        code: "CS201",
        semester: 3,
        credits: 4,
        facultyAssigned: "Dr. Ramesh",
      },
      {
        name: "Database Management Systems",
        code: "CS202",
        semester: 3,
        credits: 4,
        facultyAssigned: "Dr. Priya",
      },
      {
        name: "Operating Systems",
        code: "CS203",
        semester: 3,
        credits: 3,
        facultyAssigned: "Dr. Kiran",
      },
      {
        name: "Computer Networks",
        code: "CS204",
        semester: 3,
        credits: 3,
        facultyAssigned: "Dr. Suresh",
      },
      {
        name: "Java Programming",
        code: "CS205",
        semester: 3,
        credits: 3,
        facultyAssigned: "Dr. Anitha",
      },
      {
        name: "Software Engineering",
        code: "CS206",
        semester: 3,
        credits: 3,
        facultyAssigned: "Dr. Ravi",
      },
    ]);

    console.log("✅ Subjects seeded successfully.");

    await mongoose.disconnect();
  } catch (err) {
    console.error(err);
    await mongoose.disconnect();
  }
}

seedSubjects();
