const Book = require("../models/book");
const Author = require("../models/author");
const Genre = require("../models/genre");
const BookInstance = require("../models/bookinstance");
const { body, validationResult } = require("express-validator");

const async = require("async");
const book = require("../models/book");

exports.index = function (req, res, next) {
  // res.send("NOT IMPLEMENTED: Site Home Page");
  async.parallel(
    {
      book_count: function (callback) {
        Book.countDocuments({}, callback);
        // Pass an empty object as match condition to find all documents of this collection
      },
      book_instance_count: function (callback) {
        BookInstance.countDocuments({}, callback);
      },
      book_instance_available_count: function (callback) {
        BookInstance.countDocuments({ status: "Available" }, callback);
      },
      author_count: function (callback) {
        Author.countDocuments({}, callback);
      },
      genre_count: function (callback) {
        Genre.countDocuments({}, callback);
      },
    },
    function (err, results) {
      res.render("index", {
        title: "Local Library Home",
        error: err,
        data: results,
      });
    }
  );
};

// Display list of all books.
exports.book_list = function (req, res, next) {
  // res.send("NOT IMPLEMENTED: Book list");
  Book.find({}, "title author") //find() function returns all Book objects, selecting to return only the title and author as we don't need the other fields (it will also return the _id and virtual fields)
    .sort({ title: 1 }) //sort() method, sorts the results by the title alphabetically
    .populate("author") // Here we also call populate() on Book, specifying the author field—this will replace the stored book author id with the full author details.
    .exec(function (err, list_books) {
      //Executes all the previous queries, list_books is the result obtained using queries
      if (err) {
        return next(err);
      } //Successful, so render
      res.render("books/book_list", {
        title: "Book List",
        book_list: list_books,
      });
    });
};

// Display detail page for a specific book.
exports.book_detail = function (req, res) {
  // res.send("NOT IMPLEMENTED: Book detail: " + req.params.id);

  async.parallel(
    {
      book: function (callback) {
        Book.findById(req.params.id)
          .populate("author")
          .populate("genre")
          .exec(callback);
      },
      book_instance: function (callback) {
        BookInstance.find({ book: req.params.id }).exec(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      if (results.book == null) {
        // No results.
        var err = new Error("Book not found");
        err.status = 404;
        return next(err);
      }
      // Successful, so render.
      res.render("books/book_detail", {
        title: results.book.title,
        book: results.book,
        book_instances: results.book_instance,
      });
    }
  );
};

// Display book create form on GET.
exports.book_create_get = function (req, res, next) {
  // Get all authors and genres, which we can use for adding to our book.
  async.parallel(
    {
      authors: function (callback) {
        Author.find(callback);
      },
      genres: function (callback) {
        Genre.find(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      res.render("books/book_form", {
        title: "Create Book",
        authors: results.authors,
        // author: authors[0]._id.toString(),
        genres: results.genres,
      });
    }
  );
};

// Handle book create on POST.
exports.book_create_post = [
  // Convert the genre to an array.
  (req, res, next) => {
    if (!(req.body.genre instanceof Array)) {
      if (typeof req.body.genre === "undefined") req.body.genre = [];
      else req.body.genre = new Array(req.body.genre);
    }
    next();
  },

  // Validate and sanitize fields.
  body("title", "Title must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("author", "Author must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("summary", "Summary must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("isbn", "ISBN must not be empty").trim().isLength({ min: 1 }).escape(),
  body("genre.*").escape(),
  // We use a wildcard (*) in the sanitizer to individually validate each of the genre array entries. The code above shows how - this translates to "sanitize every item below key genre".

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a Book object with escaped and trimmed data.
    var book = new Book({
      title: req.body.title,
      author: req.body.author,
      summary: req.body.summary,
      isbn: req.body.isbn,
      genre: req.body.genre,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.

      // Get all authors and genres for form.
      async.parallel(
        {
          authors: function (callback) {
            Author.find(callback);
          },
          genres: function (callback) {
            Genre.find(callback);
          },
        },
        function (err, results) {
          if (err) {
            return next(err);
          }

          // Mark our selected genres as checked.
          for (let i = 0; i < results.genres.length; i++) {
            if (book.genre.indexOf(results.genres[i]._id) > -1) {
              // Current genre is selected. Set "checked" flag.
              results.genres[i].checked = "true";
            }
          }

          res.render("books/book_form", {
            title: "Create Book",
            authors: results.authors,
            genres: results.genres,
            book: book,
            errors: errors.array(),
          });
        }
      );
      return;
    } else {
      // Data from form is valid. Save book.
      book.save(function (err) {
        if (err) {
          return next(err);
        }
        //successful - redirect to new book record.
        res.redirect(book.url);
      });
    }
  },
];

// Display book delete form on GET.
exports.book_delete_get = function (req, res) {
  async.parallel(
    {
      book: function (callback) {
        Book.findById(req.params.id).exec(callback);
      },
      book_author: function (callback) {
        Book.findById(req.params.id)
          .populate("author") //populate("author", "first_name", "family_name") for specific fields only
          .exec(callback);
      },
      book_bookinstance: function (callback) {
        BookInstance.find({ book: req.params.id }).exec(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      if (results.book == null) {
        // No results.
        res.redirect("/catalog/books");
      }
      // Successful, so render.
      // console.log(results.book_author.author.lifespan);
      res.render("books/book_delete", {
        title: "Delete Book",
        book: results.book,
        book_author: results.book_author.author,
        book_bookinstance: results.book_bookinstance,
      });
    }
  );
};

// Handle book delete on POST.
exports.book_delete_post = function (req, res) {
  async.parallel(
    {
      book: function (callback) {
        Book.findById(req.body.bookid).exec(callback);
      },
      book_author: function (callback) {
        Book.findById(req.body.bookid).populate("author").exec(callback);
      },
      book_bookinstance: function (callback) {
        BookInstance.find({ book: req.body.bookid }).exec(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      // Success
      if (results.book_bookinstance.length > 0) {
        // Author has books. Render in same way as for GET route.
        res.render("books/book_delete", {
          title: "Delete Book",
          book: results.book,
          book_author: results.book_author.author,
          book_bookinstance: results.book_bookinstance,
        });
        return;
      } else {
        // Author has no books. Delete object and redirect to the list of authors.
        Book.findByIdAndRemove(req.body.bookid, function deleteAuthor(err) {
          if (err) {
            return next(err);
          }
          // Success - go to author list
          res.redirect("/catalog/books");
        });
      }
    }
  );
};

// Display book update form on GET.
exports.book_update_get = function (req, res) {
  res.send("NOT IMPLEMENTED: Book update GET");
};

// Handle book update on POST.
exports.book_update_post = function (req, res) {
  res.send("NOT IMPLEMENTED: Book update POST");
};
