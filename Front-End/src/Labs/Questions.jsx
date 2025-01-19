import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Questions.css"
import RedimadeNavBar from '../HomePage/RedimadeNavBar';
import BACKEND_URL from '../config';

function Questions() {
  const [htmlcount,setHtmlCount]=useState(0);
const [csscount,setCssCount]=useState(0);

 // Pagination state
 const [currentPage, setCurrentPage] = useState(1);
 const itemsPerPage = 9; // Number of items per page





const [jscount,setJsCount]=useState(0);
  const [questions, setQuestions] = useState([
    { 
      _id:2386,
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
  
  const [filteredQuestionss, setFilteredQuestionss] = useState([]);
  

  // Fetch data from the API on component mount
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/display/get/api`);
        
        const questionsArray = Array.isArray(response.data) ? response.data : Object.values(response.data);
        console.log(questionsArray)
        setQuestions(questionsArray);
        setFilteredQuestionss(questionsArray[0])
      } catch (error) {
        console.error("Error fetching questions:", error);
        setError("Failed to load questions. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

   // Filter questions based on selected language
   const getLangBasedQuestions = (lang) => {
    
    const langFilteredQuestions = questions[0].filter((q) => q.language.toLowerCase() === lang.toLowerCase());
    setFilteredQuestionss(langFilteredQuestions);
  };




  useEffect(()=>{

    const getcount=()=>{
      const htmllang='html';
      const csslang='css';
      const jslang='js'
      const htmlFilteredQuestions = filteredQuestionss.filter((q) => q.language.toLowerCase() === htmllang.toLowerCase());
      const cssFilteredQuestions = filteredQuestionss.filter((q) => q.language.toLowerCase() === csslang.toLowerCase());

      const jsFilteredQuestions = filteredQuestionss.filter((q) => q.language.toLowerCase() === jslang.toLowerCase());

      console.log("length of html",htmlFilteredQuestions.length)
      setHtmlCount(htmlFilteredQuestions.length);
      setCssCount(cssFilteredQuestions.length);
      setJsCount(jsFilteredQuestions.length);
    }

    getcount(); 

  },[filteredQuestionss])


 // Handle difficulty filter change
 const handleDifficultyChange = (e) => {
  const difficulty = e.target.value;
  setSelectedDifficulty(difficulty);

  const difficultyFilteredQuestions = questions[0].filter(
    (question) =>
      difficulty === "All" || question.difficulty.toLowerCase() === difficulty.toLowerCase()
  );
  setFilteredQuestionss(difficultyFilteredQuestions);
};
  
  if (loading) return <p>Loading questions...</p>;
  if (error) return <p>{error}</p>;
  if (!questions || questions.length === 0) return <p>No questions available.</p>;


   // Calculate total pages
  const totalPages = Math.ceil((filteredQuestionss?.length || 0) / itemsPerPage);

  // Paginated questions
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedQuestions = filteredQuestionss?.slice(startIndex, startIndex + itemsPerPage) || [];

  // Change page
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Generate pagination buttons
  const generatePageButtons = () => {
    const maxButtons = 5; // Maximum number of buttons to show
    const buttons = [];

    if (totalPages <= maxButtons) {
      // Show all buttons if total pages are less than or equal to maxButtons
      for (let i = 1; i <= totalPages; i++) {
        buttons.push(i);
      }
    } else {
      // Handle pagination with ellipsis
      const start = Math.max(1, currentPage - Math.floor(maxButtons / 2));
      const end = Math.min(totalPages, currentPage + Math.floor(maxButtons / 2));

      if (start > 1) buttons.push(1); // First page button
      if (start > 2) buttons.push("..."); // Ellipsis

      for (let i = start; i <= end; i++) {
        buttons.push(i);
      }

      if (end < totalPages - 1) buttons.push("..."); // Ellipsis
      if (end < totalPages) buttons.push(totalPages); // Last page button
    }

    return buttons;
  };


   
  return (
    <>
     <RedimadeNavBar/>
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="TagClass">
        <div className="tag">
          HTML <span className="count" onClick={() => getLangBasedQuestions("html")}>{htmlcount}</span>
        </div>
        <div className="tag">
          CSS <span className="count" onClick={() => getLangBasedQuestions("css")}>{csscount}</span>
        </div>
        <div className="tag">
          JS <span className="count" onClick={() => getLangBasedQuestions("js")}>{jscount}</span>
        </div>
        </div>
      
        <div className="difficultyCss">
          <label htmlFor="difficulty" >Difficulty Level: </label>
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
      <div className="QuestionsList">
      <ul className="list-group">
        {paginatedQuestions.length > 0 ? (
          paginatedQuestions.map((question, index) => (
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

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="pagination mt-3">
          <button
            className="btn btn-secondary me-2"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          {generatePageButtons().map((button, index) =>
            button === "..." ? (
              <span key={index} className="mx-1">...</span>
            ) : (
              <button
                key={index}
                className={`btn ${currentPage === button ? "btn-primary" : "btn-outline-primary"} mx-1`}
                onClick={() => handlePageChange(button)}
              >
                {button}
              </button>
            )
          )}
          <button
            className="btn btn-secondary ms-2"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
    </div>
    </>
  );
}

export default Questions;  