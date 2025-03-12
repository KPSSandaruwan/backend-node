require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");  
const mongoose = require("mongoose");
const cors = require("cors");


app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB", err);
  });


// Routes
app.get("/", (req, res) => {
  res.send("Welcome to the API");
});

const v1 = require("./api/routes");
app.use("/api", v1.router);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});