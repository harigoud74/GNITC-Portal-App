const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema(
  {
    name: {type: String, required: true},
    code: {type: String, required: true, unique: true, uppercase: true},
    semester: {type: Number, required: true},
    credits: {type: Number, default: 3},
    facultyAssigned: {type: String},
  },
  {timestamps: true},
);

module.exports = mongoose.model("Subject", subjectSchema);
