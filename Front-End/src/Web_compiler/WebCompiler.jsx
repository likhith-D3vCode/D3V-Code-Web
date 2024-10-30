import { useState } from "react";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-html";
import "ace-builds/src-noconflict/mode-css";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-github";
import "../App.css";
import PropTypes from "prop-types";
import ace from 'ace-builds/src-noconflict/ace';
ace.config.set('basePath', '/node_modules/ace-builds/src-noconflict');

const WebCompiler = ({ TestCases }) => {
  const [language, setLanguage] = useState("html");
  const [htmlCode, setHtmlCode] = useState("<h1>Hello World</h1>");
  const [cssCode, setCssCode] = useState("h1 { color: red; }");
  const [jsCode, setJsCode] = useState("document.querySelector('h1').style.fontSize = '40px';");
  const [output, setOutput] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [testResults, setTestResults] = useState([]); // New state for test results

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
      setTestResults(result.results);// Set test results here
      // alert(result.message); // Show overall message
    } catch (error) {
      console.error("Validation error:", error);
    }
  };

  const handleSubmit = () => {
    validateCode(htmlCode, cssCode, jsCode);
  };

  return (
    <div className="container">
      <div className="editor-header">
        <select onChange={(e) => setLanguage(e.target.value)} value={language}>
          <option value="html">HTML</option>
          <option value="css">CSS</option>
          <option value="javascript">JavaScript</option>
        </select>
        <button onClick={runCode}>Run</button>
        <button onClick={handleSubmit}>Submit</button>
      </div>

      <div className="editor-container">
        <AceEditor
          mode={language}
          theme="github"
          value={language === "html" ? htmlCode : language === "css" ? cssCode : jsCode}
          onChange={(value) => {
            if (language === "html") setHtmlCode(value);
            else if (language === "css") setCssCode(value);
            else setJsCode(value);
          }}
          name={`${language}Editor`}
          editorProps={{ $blockScrolling: true }}
          width="100%"
          height="400px"
          fontSize={16}
        />
      </div>

      <div className="preview-container">
        <iframe
          title="Live Preview"
          srcDoc={output}
          sandbox="allow-scripts"
          frameBorder="0"
          width="100%"
          height="300px"
        ></iframe>
      </div>

      {/* Test Results Section */}
      <div className="test-results">
        <h3>Test Results:</h3>
        <ul>
          {testResults.map((result, index) => (
            <li key={index} style={{ color: result.success ? 'green' : 'red' }}>
              {result.description}: {result.success ? 'Passed' : 'Failed'}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

WebCompiler.propTypes = {
  
  TestCases:PropTypes.array.isRequired
};

export default WebCompiler;
