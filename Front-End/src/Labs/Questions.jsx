import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Questions() {
  const [questions, setQuestions] = useState([
    {
      id: 1,
      title: "Create a Basic Calculator",
      difficulty: "Beginner",
      description: "Build a simple calculator that can perform basic arithmetic operations: addition, subtraction, multiplication, and division.",
      Requirements: [
        {
          sectionTitle: "User Interface",
          sectionContent: "The calculator should have buttons for numbers (0-9) and operators (+, -, *, /) and display the result of calculations."
        },
        {
          sectionTitle: "Functionality",
          sectionContent: "Users should be able to perform consecutive operations, and the calculator should support clear (C) and equals (=) buttons."
        }
      ],
      AcceptanceCriteria: [
        { Criteria1: "The calculator should perform operations correctly for integer values." },
        { Criteria1: "The calculator should support clear and reset functions." }
      ],
      TestCases: [
        { description: "Addition Test", includes: "Add two numbers", includestype: "functionality" },
        { description: "Subtraction Test", includes: "Subtract two numbers", includestype: "functionality" },
        { description: "Clear Test", includes: "Reset calculator display", includestype: "UI" }
      ],
      language: "JavaScript"
    }
  ]);

  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from the API on component mount
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get("http://localhost:9000/display/get/api");
        const questionsArray = Array.isArray(response.data) ? response.data : Object.values(response.data);
        setQuestions(questionsArray);
      } catch (error) {
        console.error("Error fetching questions:", error);
        setError("Failed to load questions. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  // Handle difficulty filter change
  const handleDifficultyChange = (e) => {
    setSelectedDifficulty(e.target.value);
  };

  // Filter questions based on selected difficulty
  const filteredQuestions = questions.filter(
    (question) => selectedDifficulty === "All" || question[0].difficulty === selectedDifficulty
  );
  
  if (loading) return <p>Loading questions...</p>;
  if (error) return <p>{error}</p>;
  if (!questions || questions.length === 0) return <p>No questions available.</p>;
   
  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1>Frontend & Backend Tasks</h1>
        <div>
          <label htmlFor="difficulty">Difficulty Level: </label>
          <select
            id="difficulty"
            className="form-select"
            value={selectedDifficulty}
            onChange={handleDifficultyChange}
            style={{ width: "200px", display: "inline-block" }}
          >
            <option value="All">All</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Hard">Hard</option>
          </select>
        </div>
      </div>
  
      <h2>Questions List</h2>
      
      <ul className="list-group">
        {filteredQuestions && filteredQuestions.length > 0 ? (
          filteredQuestions[0].map((question, index) => (
            <li key={question._id || question.id || index} className="list-group-item">
              <Link
                to={`/question/${question.id}`}
                state={{
                  title: question.title,
                  description: question.description,
                  Requirements: question.Requirements,
                  AcceptanceCriteria: question.AcceptanceCriteria,
                  TestCases: question.TestCases,
                }}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <h3 className="fw-bold">{question.title}</h3>
                <small className="text-muted">Difficulty: {question.difficulty}</small>
              </Link>
            </li>
          ))
        ) : (
          <p>No questions available</p>
        )}
      </ul>
    </div>
  );
}

export default Questions;
