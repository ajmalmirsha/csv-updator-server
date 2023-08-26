const express = require("express");
const Route = require("./Routes");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: [process.env.CLIENT_URL,"*"],
    methods: ["GET", "POST", "DELETE"],
  })
);

const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

mongoose.connect(process.env.MONGO_URL, mongooseOptions).then(() => {
  console.log("database connected");
});

app.use("/", Route);

// server started ...
app.listen(3000, () => {
  console.log("server started");
});
