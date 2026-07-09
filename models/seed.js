const mockStudents = [
  {
    name: "Aarav Sharma",
    rollNo: "24CS001",
    email: "aarav.sharma@example.com",
    password: "password123",
  },
  {
    name: "Priya Patel",
    rollNo: "24CS002",
    email: "priya.p@example.com",
    password: "password123",
  },
  {
    name: "Rohan Gupta",
    rollNo: "24EC015",
    email: "rohan.gupta@example.com",
    password: "password123",
  },
  {
    name: "Ananya Desai",
    rollNo: "24ME042",
    email: "ananya.d@example.com",
    password: "password123",
  },
  {
    name: "Karan Singh",
    rollNo: "24EE007",
    email: "karan.singh@example.com",
    password: "password123",
  },
];

const mongoose = require("mongoose");
const StudentAuth = require("./StudentAuth");

mongoose
  .connect("mongodb://127.0.0.1:27017/StudentAndFaculityDashboard")
  .then(async () => {
    console.log("Connected to MongoDB");

    try {
      await StudentAuth.deleteMany({});
      console.log("Cleared existing students");

      await StudentAuth.insertMany(mockStudents);
      console.log("Successfully inserted mock students!");
    } catch (err) {
      console.error("Error inserting data: ", err);
    } finally {
      mongoose.connection.close();
    }
  })
  .catch((err) => console.error("Database connection error: ", err));
