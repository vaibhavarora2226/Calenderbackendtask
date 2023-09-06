// server.js
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
const port = 5000;

// Connect to your MongoDB database
mongoose.connect(
  "mongodb+srv://vaibhav:vaibhav1234@cluster0.xfaokel.mongodb.net/",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);
mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
});

// Define the Attendance schema and model (using Mongoose)
const attendanceSchema = new mongoose.Schema({
  date: Date,
  status: String, // 'Present' or 'Absent'
});

const Attendance = mongoose.model("Attendance", attendanceSchema);

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  next();
});

app.use(bodyParser.json());

// API to mark attendance
app.post("/api/mark-attendance", async (req, res) => {
  try {
    const { date, status } = req.body;

    try {
      const newAttendance = new Attendance({ date, status });
      await newAttendance.save();
      return res
        .status(201)
        .json({
          message: "Attendance marked successfully",
          data: newAttendance,
        });
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error  1" });
  }
});

// API to fetch attendance data
app.get("/api/fetch-attendance", async (req, res) => {
  try {
    try {
      const attendanceData = await Attendance.find();
      return res.status(200).json(attendanceData);
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error 2" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
