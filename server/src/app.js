const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());

// Test route
app.get("/", (req, res) => {
  res.json({
    message: "E-commerce API is running",
  });
});

module.exports = app;
