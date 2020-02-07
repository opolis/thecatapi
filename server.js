const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 5000;

const env = process.env.NODE_ENV || "development";

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// dotenv
if (env === "development") {
  require("dotenv").config();
}

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "client/build")));

app.get("/api/hello", (req, res) => {
  return res.status(200).json({
    message: "Hey from Express land"
  })
});

app.post("/api/world", (req, res) => {
  console.log(req.body);
  return res.status(200).json(`Received a POST request. Info: ${req.body.post}`);
});

if (env === "production") {
  // Serve any static files
  app.use(express.static(path.join(__dirname, "client/build")));
  // Handle React routing, return all requests to React app
  app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "client/build", "index.html"));
  });
} else {
  // The "catchall" handler: for any request that doesn't
  // match one above, send back React's index.html file.
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname + "/client/public/index.html"));
  });
}

app.listen(port, () => console.log(`Listening on port ${port}`));
