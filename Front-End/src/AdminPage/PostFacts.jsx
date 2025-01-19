import { useState } from "react";
import axios from "axios";
import BACKEND_URL from '../config';

const FactsForm = () => {
  const [fact, setFact] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const tokenauth = localStorage.getItem('authToken');

    try {
      const response = await axios.post('http://d3vcode-loadbalancer-625613918.eu-north-1.elb.amazonaws.com/facts/api', { facts: fact },{ headers: {
        Authorization: `Bearer ${tokenauth}`, // Include the token in the Authorization header
      },withCredentials:true});
      if (response.status === 200) {
        setMessage("Fact added successfully!");
        setFact(""); // Clear the input field
      } else {
        setMessage("Failed to add fact.");
      }
    } catch (error) {
      console.error("Error while adding fact:", error);
      setMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto", padding: "20px" }}>
      <h2>Add a Fact</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="fact" style={{ display: "block", marginBottom: "5px" }}>Fact:</label>
          <textarea
            id="fact"
            value={fact}
            onChange={(e) => setFact(e.target.value)}
            placeholder="Enter a fact"
            style={{ width: "100%", padding: "10px", fontSize: "14px" }}
            rows="4"
            required
          />
        </div>
        <button
          type="submit"
          style={{
            backgroundColor: "#007BFF",
            color: "#fff",
            border: "none",
            padding: "10px 15px",
            cursor: "pointer",
          }}
        >
          Submit
        </button>
      </form>
      {message && <p style={{ marginTop: "20px", color: message.includes("success") ? "green" : "red" }}>{message}</p>}
    </div>
  );
};

export default FactsForm;
