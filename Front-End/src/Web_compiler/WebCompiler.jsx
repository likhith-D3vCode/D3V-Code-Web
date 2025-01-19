import { useState,useEffect,useRef } from "react";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-html";
import "ace-builds/src-noconflict/mode-css";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-github";
import "../App.css";
import "./WebCompiler.css"
import MonacoEditor from "@monaco-editor/react";
import PropTypes from "prop-types";
import ace from 'ace-builds/src-noconflict/ace';
import axios from "axios"
ace.config.set('basePath', '/node_modules/ace-builds/src-noconflict');



const WebCompiler = ({ TestCases ,questionId,questionDescription,questionCriteria,questionRequirement}) => {
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

const outputRef = useRef(null);

const [showTestCases, setShowTestCases] = useState(false);
  const [showTestResults, setShowTestResults] = useState(false);
  const [showOutputInterface, setshowOutputInterface] = useState(true);
  const [chatgptapi,setChatgptApi]=useState();
 const [runcheck,setruncheck]=useState(false)
const API_KEY = chatgptapi;
// const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`;
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;



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



  useEffect(() => {
    const getchatgptapi = async () => {
      try {
        const response = await axios.get('http://localhost:9000/getChatgptApi', { withCredentials: true });
                setChatgptApi(response.data.apiUrl)
      } catch (error) {
        console.error("Error fetching solved status:", error);
      }
    };
    getchatgptapi();
  }, []);

 
  const runCode = async() => {
    
    // console.log("inside run code",value)
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
    scrollToOutput();
    const acceptanceCriteriaString = questionCriteria
  .map(criteria => criteria.Criteria1)
  .join(", ");
    
    // setValue("Analyze the following code:"+htmlCode+cssCode+jsCode+"    questionsDetails:"+ questionDescription+"  "+ acceptanceCriteriaString+"Task1: check the given code based on the question details if the logic is correct based on the question details the give me the output as public testcases passed if not tell me it failed give me only these words wheather passed or not.")
    executeCode();
    validateSyntax();
    
    ValidateCss(htmlCode, cssCode, jsCode);
   
    // sendMessageToServer("Analyze the following code:"+htmlCode+cssCode+jsCode+"    questionsDetails:"+ questionDescription+"  "+ acceptanceCriteriaString+"Task1: check the given code based on the question details if the logic is correct based on the question details the give me the output as public testcases passed if not tell me it failed give me only these words wheather passed or not..");
    generateApiResponse();    
  };




 

  

  const scrollToOutput = () => {
    if (outputRef.current) {
      console.log("clicked")
      outputRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };


  
 
  const generateApiResponse = async () => {
    const acceptanceCriteriaString = questionCriteria
  .map(criteria => criteria.Criteria1)
  .join(", "); // You can use any separator, such as ", ", "\n", etc.

  const RequirementsString = questionRequirement
  .map(rquss => rquss.sectionContent)
  .join(", "); // You can use any separator, such as ", ", "\n", etc.
  // check the given code based on the question details if the logic is correct based on the question details the give me the output as public testcases passed if not tell me it failed give me only these words wheather passed or not.

    setValue("Analyze the following code:"+htmlCode+cssCode+jsCode+"    questionsDetails:"+ questionDescription+"  "+ acceptanceCriteriaString+"Task1: check the given code based on the question details if the logic is correct based on the question details the give me the output as public testcases passed if not tell me it failed give me only these words wheather passed or not.This response should remain consistent across repeated evaluations, regardless of any changes in context or conversational history.")

    // setValue("Analyze the following code:"+htmlCode+cssCode+jsCode+" Your task:1.Check if the code contains any syntax errors check line by line whearther the tags are correct or not there corresponding tages are there are not check striclty . 2Check if the code has runtime errors that occur during execution. 3.If there are no errors, confirm that the code is correct.Provide only one response based on your analysis:  Syntax Error: If the code contains syntax issues.    RuntimeError: If the code has execution issues.     Success: If the code is fully correct with no errors(Note:Do not give success answer even a small syntax error appear in the code check the code line by line).Do not provide any explanations or additional information just if it is syntax error or runtime error give me one line sentance why it is error, only respond with one of these:Syntax Error, Runtime Error, or Success. if it is syntax error or runtime error give me one line sentance why it is error")

  //  console.log("inside api",value)
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
      // console.log("response",data)
      if (!response.ok) throw new Error(data.error.message);

      const apiResponse = data?.candidates[0]?.content.parts[0]?.text.replace(
        /\*\*(.*?)\*\*/g,
        "$1"
      );

      // console.log("ans",apiResponse)

      if(apiResponse!="Passed"||apiResponse!="passed"){
        setshowOutputInterface(false)
        setShowTestResults(true);
      }
      
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
    setruncheck(false);

  };













  const executeCode = async () => {
    try {
      const response = await axios.post('http://localhost:9000/jsvalidator/execute', 
        { jsCode },
        { withCredentials: true } // Sends cookies with the request (for token)
      );
      
       // Show Test Cases on success
       setshowOutputInterface(true)
      setShowTestResults(false);
      setShowTestCases(false);
      setjsoutput(response.data.result.run.output.split("\n")); 
      console.log(response.data.result.run.output.split("\n"))
     
    } catch (error) {
       // Show Test Results on error
       setShowTestResults(true);
       setshowOutputInterface(false)
      setShowTestCases(false);
      console.error("Error executing code:", error);
      setjsoutput("Error executing code. Please try again.");
    }
  };




  // async function sendMessageToServer(message) {
  //   try {
  //     const response = await fetch("http://localhost:9000/chatgpt/api/chat", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ message }),
  //     });
  
  //     const data = await response.json();
  //     console.log("Response from OpenAI:", data);
  //   } catch (error) {
  //     console.error("Error sending message:", error);
  //   }
  // }
  
  




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
        if (syntaxErrors.length > 0) {
          setSyntaxErrors(syntaxErrors);
          setShowTestResults(true); // Show Test Results on error
          setShowTestCases(false);
          setshowOutputInterface(false)
        } else {
          setSyntaxErrors([]);
          setshowOutputInterface(true)
          setShowTestCases(false); // Show Test Cases on success
          setShowTestResults(false);
        }
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
      console.log("validatefghjkl")
      setIsValid(result.success);
      setShowTestCases(true)
      setTestResults(false);
      setshowOutputInterface(false)
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
    
    var chackoutput="Passed"
    // console.log(chatgptoutput.includes(chackoutput))
     if(chatgptoutput.includes(chackoutput)){
      validateCode(htmlCode, cssCode, jsCode);

     }
    scrollToOutput();
  };

  const handleTextareaChange = (value) => {

    setruncheck(true)
    setTextareaValue(value);

   
    if (language === "html")
    {
      setHtmlCode(value);
    }
      else if (language === "css") setCssCode(value);
    else setJsCode(value);
     
    const acceptanceCriteriaString = questionCriteria
  .map(criteria => criteria.Criteria1)
  .join(", ");
    setValue("Analyze the following code:"+htmlCode+cssCode+jsCode+"    questionsDetails:"+ questionDescription+"  "+ acceptanceCriteriaString+"Task1: check the given code based on the question details if the logic is correct based on the question details the give me the output as public testcases passed if not tell me it failed give me only these words wheather passed or not.This response should remain consistent across repeated evaluations, regardless of any changes in context or conversational history. just give me it is passed or failed .")
    // console.log("inside on change",value)
     
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

        {isSolved && <span className="solved-symbol"><i className="bi bi-check2-square"><div>Solved</div></i></span>} {/* Solved symbol */}

        <div className="compilerButtons">
        <button onClick={() => {runCode();
    scrollToOutput();
  }}  className="RunButton run"><i onClick={() => {
    
  }} className="bi bi-play-btn"></i>Run</button>
        <button onClick={handleSubmit} className="RunButton1 submit" ><i className="bi bi-check-circle-fill"></i>Submit</button>
        </div>
      </div>

      <div className=""> 
        {/* className="editor-container" */}


      <div className="editor-contai">
        <MonacoEditor
          height="500px"
          className="monaco-editor"
          value={textareaValue}
          onChange={(value) => handleTextareaChange(value)}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            scrollBeyondLastLine: false,
            automaticLayout: true,
          }}
        />
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

     
      <div className="toggle-buttons">
        <button className="testCasebtn" onClick={() => {setShowTestCases(true),setShowTestResults(false),setshowOutputInterface(false)}}>
        <i className="bi bi-card-checklist"></i> <div className="TextCasesText">Test cases</div>
        </button>
        <button className="bugsbutton" onClick={() => {setShowTestResults(true),setShowTestCases(false),setshowOutputInterface(false)}}>
        <i className="bi bi-bug"></i>
        </button>
        <button className="liveoutputbtn" onClick={() => {setshowOutputInterface(true),setShowTestCases(false),setShowTestResults(false)}}>
        <i className="bi bi-broadcast"></i>
        </button>
      </div>


      {/* Test Results Section */}
      {showTestCases && (
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
)}


{showOutputInterface && <div className="preview-container"
   ref={outputRef}
>
        <iframe
          title="Live Preview"
          srcDoc={output}
          sandbox="allow-scripts allow-same-origin"
          className="output-iframe"
          style={{ border: "none" }}
          width="100%"
          height="300px"
          
        ></iframe>
</div>}




     
    {/* Syntax Errors Section */}
    {showTestResults && (
    <div className="compiler-error-box">
    <h2>Compiler Errors</h2>
    <div className="error-section">
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
      <div className="divider"></div>
      <div className="error-section">
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
<div className="divider"></div>
<div className="error-section">
<h3>RunTimeCheck::{chatgptoutput}</h3>
<p>check the code and Try to run again if run time check fail</p>
</div>

</div>
    )}

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
  questionId:PropTypes.string.isRequired,
  questionDescription:PropTypes.string.isRequired,
  questionCriteria:PropTypes.array.isRequired,
  questionRequirement:PropTypes.array.isRequired,

};

export default WebCompiler;





