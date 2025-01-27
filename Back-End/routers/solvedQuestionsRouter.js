const express = require("express");
const solvedquestionsByUser = express.Router();
const solved = require("../models/solvedquestions");
const mongoose = require("mongoose");

// Create a solved question
solvedquestionsByUser.post("/api", async (req, res) => {
  const { Question } = req.body; // Extract Question ID from request body
  const createdBy = req.user._id; // Extract user ID from authenticated user data

  // Validate the Question ID
  if (!mongoose.Types.ObjectId.isValid(Question)) {
    return res.status(400).json({ error: "Invalid Question ID" });
  }

  try {
    // Check if the question is already solved by the user
    const existingSolved = await solved.findOne({ Question, createdBy });
    if (existingSolved) {
      return res.status(200).json({ message: "Question already solved" });
    }

    // Create a new solved question entry
    await solved.create({ Question, createdBy });
    return res.status(200).json({ msg: "User solved the problem" });
  } catch (err) {
    console.error("Error creating solved question:", err);
    if (err.code === 11000) {
      return res.status(400).json({ error: "Duplicate entry for solved question" });
    }
    return res.status(500).json({ msg: "Server error" });
  }
});

// Get all solved questions
solvedquestionsByUser.get("/getapi", async (req, res) => {
  try {
    const data = await solved.find({}).populate("Question", "title description");
    if (!data.length) {
      return res.status(404).json({ msg: "No solved questions found" });
    }
    return res.status(200).json({ msg: "User solved questions data", data });
  } catch (err) {
    console.error("Error fetching solved questions:", err);
    return res.status(500).json({ msg: "Unable to get the data" });
  }
});

// Check if a specific question is solved by the user
solvedquestionsByUser.get("/getOneQnapi", async (req, res) => {
  const { questionId } = req.query; // Extract questionId from query parameters
  const userId = req.user._id; // Extract user ID from authenticated user data

  // Validate the question ID
  if (!mongoose.Types.ObjectId.isValid(questionId)) {
    return res.status(400).json({ error: "Invalid Question ID" });
  }

  try {
    const solvedQuestion = await solved.findOne({ Question: questionId, createdBy: userId });
    return res.status(200).json({ solved: !!solvedQuestion });
  } catch (err) {
    console.error("Error fetching solved status:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Get all solved questions by a specific user
solvedquestionsByUser.get("/users/solved-questions", async (req, res) => {
  const userId = req.user._id; // Extract user ID from authenticated user data
  console.log(userId)
  try {
    const solvedQuestions = await solved
      .find({ createdBy: userId })
      .populate("Question", "title description difficulty") // Populate question details
      .populate("createdBy", "username email") // Populate user details
      .sort({ solvedAt: -1 }); // Sort by the solved date
     console.log("solvedqns",solvedQuestions)
    if (!solvedQuestions.length) {
      return res.status(404).json({ message: "No solved questions found for this user." });
    }

    res.status(200).json({ success: true, solvedQuestions });
  } catch (err) {
    console.error("Error fetching user solved questions:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = solvedquestionsByUser;
