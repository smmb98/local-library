const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const BookSchema = new Schema({
  title: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: "Author", required: true },
  summary: { type: String, required: true },
  isbn: { type: String, required: true },
  genre: [{ type: Schema.Types.ObjectId, ref: "Genre" }],
});

// Virtual for book's URL
BookSchema.virtual("url").get(function () {
  return "/catalog/book/" + this.id;
});

//Export model
module.exports = mongoose.model("Book", BookSchema);

// The main difference here is that we've created two references to other models:

// author is a reference to a single Author model object, and is required.
// genre is a reference to an array of Genre model objects.
