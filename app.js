const express = require("express");
const path = require("path");

const connectDB = require("./models/db");
const StudentAuth = require("./models/StudentAuth");
const homeRoutes = require("./routes/homeRoutes");
const authRoutes = require("./routes/authentication");
const facultyRoutes = require("./routes/faculty");

// 2. Initialize App
const app = express();
const port = 3000;

// 3. Connect to Database
connectDB();

// 4. App Configuration (Settings)
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// 5. Global Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

// 6. Routes
app.use("/", homeRoutes);
app.use("/", authRoutes);
app.use("/faculty", facultyRoutes);

// (Optional) Standalone Route
app.get("/students", async (req, res) => {
  try {
    const students = await StudentAuth.find();
    res.render("allStudents", {students});
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching students");
  }
});

// 7. Start the Server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
