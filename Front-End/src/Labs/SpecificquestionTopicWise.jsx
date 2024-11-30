import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import "./Questions.css";

function SpecificquestionsTopicWise() {
  const location = useLocation();
  const [questions, setQuestions] = useState([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");

  useEffect(() => {
    // Get questions data from navigation state and convert it to an array
    if (location.state && location.state.questions) {
      const questionsArray = Array.isArray(location.state.questions)
        ? location.state.questions
        : Object.values(location.state.questions); // Convert object to array if necessary
      setQuestions(questionsArray);
    }
  }, [location.state]);

  // Handle difficulty filter change
  const handleDifficultyChange = (e) => {
    setSelectedDifficulty(e.target.value);
  };

  // Filter questions based on selected difficulty
  const filteredQuestions = questions.filter(
    (question) => selectedDifficulty === "All" || question.difficulty === selectedDifficulty
  );

  if (!questions || questions.length === 0) return <p>No questions available.</p>;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
       
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
          filteredQuestions.map((question, index) => (
            <li key={question._id || question.id || index} className="list-group-item">
              <Link
                to={`/question/${question.id}`}
                state={{
                  title: question.title,
                  description: question.description,
                  Requirements: question.Requirements,
                  AcceptanceCriteria: question.AcceptanceCriteria,
                  TestCases: question.TestCases,
                  _id: question._id,
                }}
                style={{ textDecoration: "none", color: "inherit" }}
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

export default SpecificquestionsTopicWise;
