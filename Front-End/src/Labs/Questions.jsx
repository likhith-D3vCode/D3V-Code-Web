import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Questions.css"
import RedimadeNavBar from '../HomePage/RedimadeNavBar';

function Questions() {
  const [htmlcount,setHtmlCount]=useState(0);
const [csscount,setCssCount]=useState(0);

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
        const response = await axios.get("http://localhost:9000/display/get/api");
        
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
        {filteredQuestionss && filteredQuestionss.length > 0 ? (
          filteredQuestionss.map((question, index) => (
            <li key={question._id || question.id || index} className="list-group-item">
              <Link
                to={`/question/${question.id}`}
                state={{
                  title: question.title,
                  description: question.description,
                  Requirements: question.Requirements,
                  AcceptanceCriteria: question.AcceptanceCriteria,
                  TestCases: question.TestCases,
                  _id:question._id
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
      
    </div>
    </>
  );
}

export default Questions;  