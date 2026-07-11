const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: {type: String, required: true},
  type: {
    type: String,
    enum: ["Technical", "Cultural", "Sports", "Workshop"],
    required: true,
  },
  date: {type: Date, required: true},
  location: {type: String, required: true},
  description: {type: String},
  // Automatically track how many students register
  registeredStudents: [
    {type: mongoose.Schema.Types.ObjectId, ref: "StudentProfile"},
  ],
});

module.exports = mongoose.model("Event", eventSchema);
