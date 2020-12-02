const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messageSchema = new Schema({
  // username: { type: String, required: true, index: { unique: true } },
  title: { type: String, required: true },
  message: { type: String, required: true },
  date: { type: String, required: true },
  userName: { type: String, required: true },
  // when they go to their page, they can see all the messages they posted
});

module.exports = mongoose.model("message", messageSchema);
