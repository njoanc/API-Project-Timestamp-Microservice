const bodyParser = require("body-parser");
const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");

//Initialize our express app
const app = express();

app.use(bodyParser.json());
app.use(helmet());

//enabling CORD for all request
app.use(cors());
app.use(morgan("combined"));
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/api/timestamp/", (req, res) => {
  res.json({ unix: Date.now(), utc: Date() });
});

app.get("/api/timestamp/:date_string", (req, res) => {
  let dateString = req.params.date_string;

  //A 4 digit number is a valid ISO-8601 for the beginning of that year
  //5 digits or more must be a unix time, until we reach a year 10,000 problem
  if (/\d{5,}/.test(dateString)) {
    dateInt = parseInt(dateString);
    //Date regards numbers as unix timestamps, strings are processed differently
    res.json({ unix: dateString, utc: new Date(dateInt).toUTCString() });
  }

  let dateObject = new Date(dateString);

  if (dateObject.toString() === "Invalid Date") {
    res.json({ error: "Invaid Date" });
  } else {
    res.json({ unix: dateObject.valueOf(), utc: dateObject.toUTCString() });
  }
});
let port = 3000;
app.listen(port, () => {
  console.log("Server is running on" + " " + port);
});
