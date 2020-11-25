const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: { type: String, required: true, index: { unique: true } },
  password: { type: String, required: true },
});

// this returns the absolute URL required to get a particular instance of the model
// so we can get id when clicking a particular item
// itemSchema.virtual("url").get(function () {
//   return `/catalog/item/${this._id}`;
// });

module.exports = mongoose.model("user", userSchema);
