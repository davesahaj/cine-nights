const express = require("express");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());

//Routes
const roomRoute = require("./routes/roomRoute");
app.use("/", roomRoute);

module.exports = app;
