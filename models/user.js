const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  brand: { type: String, required: true },
  genre: [{ type: Schema.Types.ObjectId, ref: "Genre" }], // right
  stock: { type: Number, required: true },
  price: { type: Number, required: true },
  desc: { type: String, default: "" },
  imgUrl: { type: String, default: "" },
});

// this returns the absolute URL required to get a particular instance of the model
// so we can get id when clicking a particular item
// itemSchema.virtual("url").get(function () {
//   return `/catalog/item/${this._id}`;
// });

module.exports = mongoose.model("user", userSchema);
