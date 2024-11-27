import { useState,useEffect } from "react";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-html";
import "ace-builds/src-noconflict/mode-css";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-github";
import "../App.css";
import "./WebCompiler.css"
import PropTypes from "prop-types";
import ace from 'ace-builds/src-noconflict/ace';
import axios from "axios"
ace.config.set('basePath', '/node_modules/ace-builds/src-noconflict');


const WebCompiler = ({ TestCases ,questionId}) => {
  const [language, setLanguage] = useState("html");
  const [htmlCode, setHtmlCode] = useState("<h1>Hello World</h1>");
  const [cssCode, setCssCode] = useState("h1 { color: red; }");
  const [jsCode, setJsCode] = useState("document.querySelector('h1').style.fontSize = '40px';");
  const [output, setOutput] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [testResults, setTestResults] = useState([]); // New state for test results
  const [isSolved, setIsSolved] = useState(false); // New state for solved status
  const [textareaValue, setTextareaValue] = useState(htmlCode); // Sync with the text area
  const [syntaxErrors, setSyntaxErrors] = useState([]);
  const [chatgptoutput,setchatgptoutput]=useState("");
  
  const [cssValidation, setCssValidation] = useState({
    errors: [],
    warnings: [],
    jserrors:[],
    success: true,
  });
const [jsoutput,setjsoutput]=useState([]);


const API_KEY = "AIzaSyABIaJ6PoEYmInMAvQ_4j-Zl5Juva--P8c";
const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`;

const [isResponseGenerating, setIsResponseGenerating] = useState(false);
const [value, setValue] = useState("");
const [messages, setMessages] = useState([]);




  
  

  useEffect(() => {
    // Sync textarea value with selected language
    if (language === "html") setTextareaValue(htmlCode);
    else if (language === "css") setTextareaValue(cssCode);
    else setTextareaValue(jsCode);
  }, [language, htmlCode, cssCode, jsCode]);


  useEffect(() => {
    const checkIfSolved = async () => {
      try {
        const response = await axios.get(`http://localhost:9000/getOneSolvedQn/getOneQnapi?questionId=${questionId}`, { withCredentials: true });
        setIsSolved(response.data.solved); // Assume API response has 'solved' as a boolean
      } catch (error) {
        console.error("Error fetching solved status:", error);
      }
    };
    checkIfSolved();
  }, [questionId]);

 
  const runCode = () => {
    const completeCode = `
      <html>
        <head>
          <style>${cssCode}</style>
        </head>
        <body>
          ${htmlCode}
          <script>${jsCode}</script>
        </body>
      </html>
    `;
    setOutput(completeCode);

    executeCode();
    validateSyntax();
    
    ValidateCss(htmlCode, cssCode, jsCode);
     setValue("Analyze the following code:"+htmlCode+cssCode+jsCode+" Your task:1.Check if the code contains any syntax errors. 2Check if the code has runtime errors that occur during execution. 3.If there are no errors, confirm that the code is correct.Provide only one response based on your analysis:  Syntax Error: If the code contains syntax issues.    Runtime        Error: If the code has execution issues.     Success: If the code is fully correct with no errors.Do not provide any explanations or additional information, only respond with one of these:Syntax Error, Runtime Error, or Success.")
   
    generateApiResponse()
  

    
  };





  const generateApiResponse = async () => {
    
   console.log("inside api",value)
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: value }],
            },
          ],
        }),
      });

      const data = await response.json();
      console.log("response",data)
      if (!response.ok) throw new Error(data.error.message);

      const apiResponse = data?.candidates[0]?.content.parts[0]?.text.replace(
        /\*\*(.*?)\*\*/g,
        "$1"
      );

      console.log("ans",apiResponse)
      
      setchatgptoutput(apiResponse);
      
      const newMessage = {
        type: "incoming",
        content: apiResponse,
        isLoading: false,
      };

      setMessages((prev) => {
        const updatedMessages = [...prev];
        updatedMessages.pop(); // Remove the loading message
        return [...updatedMessages, newMessage];
      });
    } catch (error) {
      const errorMessage = {
        type: "incoming",
        content: `Error: ${error.message}`,
        isLoading: false,
      };
      setMessages((prev) => {
        const updatedMessages = [...prev];
        updatedMessages.pop(); // Remove the loading message
        return [...updatedMessages, errorMessage];
      });
    } finally {
      setIsResponseGenerating(false);
    }
  };













  const executeCode = async () => {
    try {
      const response = await axios.post('http://localhost:9000/jsvalidator/execute', 
        { jsCode },
        { withCredentials: true } // Sends cookies with the request (for token)
      );
      
     
      setjsoutput(response.data.result.run.output.split("\n")); 
      console.log(response.data.result.run.output.split("\n"))
     
    } catch (error) {
      console.error("Error executing code:", error);
      setjsoutput("Error executing code. Please try again.");
    }
  };



  const validateSyntax = async () => {
    try {
      if (language === "html") {
        const response = await fetch("https://validator.nu/?out=json", {
          method: "POST",
          headers: { "Content-Type": "text/html; charset=utf-8" },
          body: htmlCode,
        });
        const result = await response.json();
        setSyntaxErrors(result.messages.map((msg) => msg.message));
      }else if (language === "javascript") {
        // JavaScript Syntax Validation
        try {
          new Function(jsCode); // Will throw a SyntaxError if code is invalid
          setSyntaxErrors([]); // Clear errors if the syntax is valid

        } catch (error) {
          setSyntaxErrors([error.message]); // Add syntax error message
        }
      } else {
        setSyntaxErrors([]); // Clear errors for unsupported languages
      }
    } catch (error) {
      console.error("Validation error:", error);
    }
    
    
  };




  const ValidateCss = async (html, css, js) => {
    try {
      const response = await fetch('http://localhost:9000/api/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ html, css, js,TestCases }),
      });
      const result = await response.json();
     
      setCssValidation({
        errors: result.errors || [],
        warnings: result.warnings || [],
        success: result.success,
      });

    } catch (error) {
      console.error("Validation error:", error);
    }
  };




  const validateCode = async (html, css, js) => {
    try {
      const response = await fetch('http://localhost:9000/api/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ html, css, js,TestCases }),
      });
      const result = await response.json();
      setIsValid(result.success);
      setCssValidation({
        errors: result.errors || [],
        warnings: result.warnings || [],
        success: result.success,
      });
      setTestResults(result.results||[]);// Set test results here
      // alert(result.message); // Show overall message
    
      const allPassed = result.results.every(test => test.success);
      if (allPassed) {
        // Submit solved question
        await markQuestionAsSolved();
      }
   

    } catch (error) {
      console.error("Validation error:", error);
    }
  };

  

  const handleSubmit = () => {
    validateCode(htmlCode, cssCode, jsCode);
  };

  const handleTextareaChange = (value) => {
    setTextareaValue(value);
    if (language === "html") setHtmlCode(value);
    else if (language === "css") setCssCode(value);
    else setJsCode(value);

    setValue( "Analyze the following code:"+htmlCode+cssCode+jsCode+"Your task:1.Check if the code contains any syntax errors. 2Check if the code has runtime errors that occur during execution. 3.If there are no errors, confirm that the code is correct.Provide only one response based on your analysis:  Syntax Error: If the code contains syntax issues.    Runtime        Error: If the code has execution issues.     Success: If the code is fully correct with no errors.Do not provide any explanations or additional information, only respond with one of these:Syntax Error, Runtime Error, or Success.")
     console.log(value)
  };
  

  const markQuestionAsSolved = async () => {
    try {
      const response = await axios.post('http://localhost:9000/solvedquestionsByuser/api',{Question:questionId},{ withCredentials: true });
    
      console.log(response); // Log message for feedback
      setIsSolved(true); // Update solved status

    } catch (error) {
      console.error("Error marking question as solved:", error);
    }
  };



  return (
    <div className="container">
      <div className="editor-header">
        <select onChange={(e) => setLanguage(e.target.value)} value={language}>
          <option value="html">HTML</option>
          <option value="css">CSS</option>
          <option value="javascript">JavaScript</option>
        </select>

        {isSolved && <span className="solved-symbol">✔️</span>} {/* Solved symbol */}


        <button onClick={runCode}>Run</button>
        <button onClick={handleSubmit}>Submit</button>
      </div>

      <div className="editor-container">
      <div className="textarea-container">
        
          <textarea
            className="textarea"
            value={textareaValue}
            onChange={(e) => handleTextareaChange(e.target.value)}
            style={{
              width: "100%",
              height: "500px",
              resize: "none",
              padding: "10px",
              fontSize: "14px",
              fontFamily: "monospace",
              overflow: "auto",
            }}
            placeholder={`Write your ${language.toUpperCase()} code here...`}
          ></textarea>
        </div>
        <AceEditor
          mode={language}
          theme="github"
          value={language === "html" ? htmlCode : language === "css" ? cssCode : jsCode}
          onChange={(value) => handleTextareaChange(value)}

          name={`${language}Editor`}
          editorProps={{ $blockScrolling: true }}
          width="0px"
          height="0px"
          
          setOptions={{
            display: "none",
          }}
          className="hidden-editor"
        />
      </div>

      <div className="preview-container">
        <iframe
          title="Live Preview"
          srcDoc={output}
          sandbox="allow-scripts"
          style={{ border: "none" }}
          width="100%"
          height="300px"
        ></iframe>
      </div>

      {/* Test Results Section */}
      <div className="test-results">
  <h3>
    Test Results: 
    <span className="passed-count">
      {testResults.filter(result => result.success).length} Passed
    </span>
  </h3>
  <ul>
    {testResults
      .filter(result => !result.success) // Show only failed test cases
      .map((result, index) => (
        <li key={index} className="test-result failed">
          {result.description}: Failed
        </li>
      ))}
  </ul>
</div>
     
    {/* Syntax Errors Section */}
    <div className="syntax-errors">
        <h3>Syntax Errors:</h3>
        {syntaxErrors.length > 0 ? (
          <ul>
            {syntaxErrors.map((error, index) => (
              <li key={index} className="error">
                {error}
              </li>
            ))}
          </ul>
        ) : (
          <p>No syntax errors found!</p>
        )}
      </div>
      <div className="css-validation">
  <h3>CSS Validation Results:</h3>
  {cssValidation.success ? (
    <p className="success-message">CSS is valid!</p>
  ) : (
    <>
      <h4>Errors:</h4>
      <ul>
        {cssValidation.errors.map((error, index) => (
          <li key={index} className="error">
            {error}
          </li>
        ))}
      </ul>
      <h4>Warnings:</h4>
      <ul>
        {cssValidation.warnings.map((warning, index) => (
          <li key={index} className="warning">
            {warning}
          </li>
        ))}
      </ul>
    </>
  )}
</div>
<h3>RunTimeCheck::{chatgptoutput}</h3>
{/* <h3>jsOutput:</h3>
{
  jsoutput ? (
    jsoutput.map((line, i) => <div key={i}>{line}</div>)
  ) : (
    'Click "Run Code" to see the output here'
  )
} */}


    </div>
  );
};

WebCompiler.propTypes = {
  
  TestCases:PropTypes.array.isRequired,
  questionId:PropTypes.string.isRequired
};

export default WebCompiler;
