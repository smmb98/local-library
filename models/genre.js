const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const GenreSchema = new Schema({
  name: { type: String, maxlength: 100, minlength: 3, required: true },
});

// Virtual for genre's URL
GenreSchema.virtual("url").get(function () {
  return "/catalog/genre/" + this._id;
});

//Export model
module.exports = mongoose.model("Genre", GenreSchema);

