import { useState } from "react";

const questionsData = [
  { id: 1, title: 'Build a simple personal profile page', difficulty: 'Beginner' },
  { id: 2, title: 'Create a responsive navigation bar', difficulty: 'Beginner' },
  { id: 3, title: 'Implement a responsive grid layout', difficulty: 'Beginner' },
  { id: 4, title: 'Design a pricing table with CSS', difficulty: 'Beginner' },
  { id: 5, title: 'Create a simple to-do list with localStorage', difficulty: 'Beginner' },
  { id: 6, title: 'Build a landing page with hero section', difficulty: 'Beginner' },
  { id: 7, title: 'Create a contact form with validation', difficulty: 'Beginner' },
  { id: 8, title: 'Design a calculator interface with JavaScript', difficulty: 'Beginner' },
  { id: 9, title: 'Build a custom dropdown menu', difficulty: 'Beginner' },
  { id: 10, title: 'Create a responsive image gallery', difficulty: 'Beginner' },
  { id: 11, title: 'Build a responsive portfolio website', difficulty: 'Intermediate' },
  { id: 12, title: 'Design a weather app with API', difficulty: 'Intermediate' },
  { id: 13, title: 'Build a Rock, Paper, Scissors game', difficulty: 'Intermediate' },
  { id: 14, title: 'Create a light/dark mode switch', difficulty: 'Intermediate' },
  { id: 15, title: 'Implement infinite scroll on blog page', difficulty: 'Intermediate' },
  { id: 16, title: 'Create a responsive dashboard with charts', difficulty: 'Intermediate' },
  { id: 17, title: 'Build a shopping cart using localStorage', difficulty: 'Intermediate' },
  { id: 18, title: 'Design a custom tab component', difficulty: 'Intermediate' },
  { id: 19, title: 'Build a single-page application (SPA)', difficulty: 'Hard' },
  { id: 20, title: 'Create a progressive web app (PWA)', difficulty: 'Hard' },
];

function Questions() {
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");

  const handleDifficultyChange = (e) => {
    setSelectedDifficulty(e.target.value);
  };

  // Filter questions based on selected difficulty
  const filteredQuestions = questionsData.filter(
    (question) => selectedDifficulty === "All" || question.difficulty === selectedDifficulty
  );

  return (
    <>
      <div className="container mt-4">
        {/* Heading and Difficulty Level Filter */}
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

        {/* Questions List */}
        <ul className="list-group">
          {filteredQuestions.map((question) => (
            <li key={question.id} className="list-group-item">
              <span className="fw-bold">{question.title}</span> <br />
              <small className="text-muted">Difficulty: {question.difficulty}</small>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default Questions;
