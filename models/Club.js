const mongoose = require("mongoose");

const clubSchema = new mongoose.Schema({
  name: {type: String, required: true},
  category: {
    type: String,
    enum: ["Tech", "Hardware", "Cultural", "Literature"],
    required: true,
  },
  description: {type: String, required: true},
  icon: {type: String, default: "bi-people"}, // Bootstrap icon class
  members: [{type: mongoose.Schema.Types.ObjectId, ref: "StudentProfile"}],
});

module.exports = mongoose.model("Club", clubSchema);
