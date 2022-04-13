const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const Schema = mongoose.Schema;

const AuthorSchema = new Schema({
  first_name: { type: String, required: true, maxlength: 100 },
  family_name: { type: String, required: true, maxlength: 100 },
  date_of_birth: { type: Date },
  date_of_death: { type: Date },
});

// Virtual for author's full name
AuthorSchema.virtual("name").get(function () {
  // To avoid errors in cases where an author does not have either a family name or first name
  // We want to make sure we handle the exception by returning an empty string for that case
  let fullname = "";

  // If we recieve first_name and family_name data
  if (this.first_name && this.family_name) {
    fullname = this.family_name + ", " + this.first_name;
  }

  if (!this.first_name || !this.family_name) {
    fullname = "";
  }

  return fullname;
});

// Virtual for author's lifespan
// AuthorSchema.virtual("lifespan").get(function () {
//   let lifetime_string = "";

//   if (this.date_of_birth) {
//     lifetime_string = this.date_of_birth.getYear().toString();
//   }

//   lifetime_string += " - ";

//   if (this.date_of_death) {
//     lifetime_string = this.date_of_death.getYear();
//   }

//   return lifetime_string;
// });

// Virtual for author's lifespan
AuthorSchema.virtual("lifespan").get(function () {
  let birth_date = "";
  let death_date = "";

  if (this.date_of_birth) {
    birth_date = DateTime.fromJSDate(this.date_of_birth).toLocaleString(
      DateTime.DATE_MED
    );
  } else {
    birth_date = "";
  }

  if (this.date_of_death) {
    death_date = DateTime.fromJSDate(this.date_of_death).toLocaleString(
      DateTime.DATE_MED
    );
  } else {
    death_date = "";
  }

  return `${birth_date} - ${death_date}`;
});

// Virtual for author's URL
AuthorSchema.virtual("url").get(function () {
  return "/catalog/author/" + this.id;
});

// Virtual for date_of_death's Date for update form
AuthorSchema.virtual("date_of_death_yyyy_mm_dd").get(function () {
  return DateTime.fromJSDate(this.date_of_death).toISODate();
});

// Virtual for date_of_death's Date for update form
AuthorSchema.virtual("date_of_birth_yyyy_mm_dd").get(function () {
  return DateTime.fromJSDate(this.date_of_birth).toISODate();
});
// mongoose.Types.ObjectId;

//Export model
module.exports = mongoose.model("Author", AuthorSchema);
