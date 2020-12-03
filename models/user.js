const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  // username: { type: String, required: true, index: { unique: true } },
  username: { type: String, required: true },
  password: { type: String, required: true },
  isMember: { type: Boolean, default: false },
  // when they go to their page, they can see all the messages they posted
  messages: [{ type: [Object] }],
  joinedDate: { type: String },
});

// this returns the absolute URL required to get a particular instance of the model
// so we can get id when clicking a particular item
userSchema.virtual("url").get(function () {
  return `/user/${this._id}`;
});

module.exports = mongoose.model("user", userSchema);
