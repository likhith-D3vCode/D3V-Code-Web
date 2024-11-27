const express = require("express");
const axios = require("axios");
const jsvalidationChecker = express.Router();

// Create an instance of axios
const API = axios.create({
  baseURL: "https://emkc.org/api/v2/piston", // Set the base URL for the API
});

// Define the post route for executing the code
jsvalidationChecker.post("/execute", async (req, res) => {
  // Check if the token is present in the cookies

    const { jsCode } = req.body; 

    try {
      // Sending the request to the API for executing the code
      const response = await API.post("/execute", {
        language: "js", // Language to execute
        version: "18.15.0", // Version of the language
        files: [
          {
            content: jsCode, // The code to execute
          },
        ],
      });

      // Return the response from the API to the client
      res.json({
        result: response.data, // Send the result from the execution API
      });
    } catch (error) {
      // Handle errors if the API call fails
      res.status(500).json({  error: "Execution failed", details: error.message });
    }
  
});

module.exports = jsvalidationChecker;
