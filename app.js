const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const compression = require("compression");
const helmet = require("helmet");

// Set up mongoose connection
const dev_db_url =
  "mongodb+srv://mohib:kyrim1g5@cluster0.zenpm.mongodb.net/local_library?retryWrites=true";
const mongodb = process.env.MONGODB_URI || dev_db_url;

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const catalogRouter = require("./routes/catalog"); //Import routes for "catalog" area of site

const app = express();

//It set appropriate HTTP headers that help protect your app from well-known web vulnerabilities
app.use(helmet());

//Compress all routes
app.use(compression());

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/catalog", catalogRouter); // Add catalog routes to middleware chain.

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error", { title: "Page Not Found" });
});

mongoose
  .connect(mongodb, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => {
    console.log("Connected!!!");
  });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

module.exports = app;
