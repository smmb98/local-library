let list_bookinstances = [
  {
    _id: 454645,
    book: {
      _id: 454645,
      title: "Test Book 1",
    },
    imprint: "New York Tom Doherty Associates, 2016.",
    status: "Available",
    __v: 0,
  },
  {
    _id: 454645,
    book: {
      _id: 454645,
      title: "The Name of the Wind (The Kingkiller Chronicle, #1)",
    },
    imprint: "London Gollancz, 2014.",
    status: "Available",
    __v: 0,
  },
  {
    _id: 454645,
    book: {
      _id: 454645,
      title: "The Wise Man's Fear (The Kingkiller Chronicle, #2)",
    },
    imprint: " Gollancz, 2011.",
    status: "Loaned",
    __v: 0,
  },

  {
    _id: 454645,
    book: {
      _id: 454645,
      title: "Test Book 1",
    },
    imprint: "New York Tom Doherty Associates, 2016.",
    status: "Available",
    __v: 0,
  },
  {
    _id: 454645,
    book: {
      _id: 454645,
      title: "Death Wave",
    },
    imprint: "New York, NY Tom Doherty Associates, LLC, 2015.",
    status: "Maintenance",
    __v: 0,
  },
  {
    _id: 454645,
    book: {
      _id: 454645,
      title: "Death Wave",
    },
    imprint: "New York, NY Tom Doherty Associates, LLC, 2015.",
    status: "Loaned",
    __v: 0,
  },
  {
    _id: 454645,
    book: {
      _id: 454645,
      title: "The Wise Man's Fear (The Kingkiller Chronicle, #2)",
    },
    imprint: "Imprint XXX3",
    status: "Maintenance",
    __v: 0,
  },
  {
    _id: 454645,
    book: {
      _id: 454645,
      title: "The Name of the Wind (The Kingkiller Chronicle, #1)",
    },
    imprint: "Imprint XXX2",
    status: "Maintenance",
    __v: 0,
  },
  {
    _id: 454645,
    book: null,
    imprint: "Test",
    status: "Maintenance",
    __v: 0,
  },
  {
    _id: 454645,
    book: null,
    imprint: "Test",
    status: "Maintenance",
    __v: 0,
  },
  {
    _id: 454645,
    book: { _id: 454645, title: "Test" },
    imprint: "Test",
    status: "Maintenance",
    __v: 0,
  },
  {
    _id: 454645,
    book: { _id: 454645, title: "Test" },
    imprint: "Test",
    status: "Loaned",
    __v: 0,
  },
  {
    _id: 454645,
    book: { _id: 454645, title: "Test" },
    imprint: "Test",
    status: "Available",
    __v: 0,
  },
  {
    _id: 454645,
    book: { _id: 454645, title: "Test" },
    imprint: "Test",
    status: "Reserved",
    __v: 0,
  },
];

list_bookinstances.forEach((instance) => {
  console.log(instance.book.title);
});
