const express = require("express");
require("dotenv").config();
const path = require("path");

// 1. Database Connection
const connectDB = require("./models/db");

// 2. Route Imports
const homeRoutes = require("./routes/homeRoutes");
const authRoutes = require("./routes/authentication");
const facultyRoutes = require("./routes/faculty"); // Our new modular router

// 3. Initialize App
const app = express();
const port = 3000;

// 4. Connect to Database
connectDB();

// 5. App Configuration (Settings)
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// 6. Global Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

// 7. Mount Routes
app.use("/", homeRoutes);
app.use("/", authRoutes);
app.use("/faculty", facultyRoutes);

app.get("/AboutInstitution", (req, res) => {
  res.render("AboutInstitution");
});
// 8. Start the Server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
