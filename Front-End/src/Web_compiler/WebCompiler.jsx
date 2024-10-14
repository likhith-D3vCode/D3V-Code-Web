import { useState } from "react";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-html";
import "ace-builds/src-noconflict/mode-css";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-github";
import "../App.css";

const WebCompiler = () => {
  const [language, setLanguage] = useState("html");
  const [htmlCode, setHtmlCode] = useState("<h1>Hello World</h1>");
  const [cssCode, setCssCode] = useState("h1 { color: red; }");
  const [jsCode, setJsCode] = useState("document.querySelector('h1').style.fontSize = '40px';");
  const [output, setOutput] = useState("");

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

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

  return (
    <div className="container">
      <div className="editor-header">
        <select className="language-selector" onChange={handleLanguageChange} value={language}>
          <option value="html">HTML</option>
          <option value="css">CSS</option>
          <option value="javascript">JavaScript</option>
        </select>
        <button className="run-button" onClick={runCode}>Run</button>
      </div>

      <div className="editor-container">
        {language === "html" && (
          <AceEditor
            mode="html"
            theme="github"
            value={htmlCode}
            onChange={setHtmlCode}
            name="htmlEditor"
            editorProps={{ $blockScrolling: true }}
            width="100%"
            height="300px"
            fontSize={16}
          />
        )}

        {language === "css" && (
          <AceEditor
            mode="css"
            theme="github"
            value={cssCode}
            onChange={setCssCode}
            name="cssEditor"
            editorProps={{ $blockScrolling: true }}
            width="100%"
            height="300px"
            fontSize={16}
          />
        )}

        {language === "javascript" && (
          <AceEditor
            mode="javascript"
            theme="github"
            value={jsCode}
            onChange={setJsCode}
            name="jsEditor"
            editorProps={{ $blockScrolling: true }}
            width="100%"
            height="300px"
            fontSize={16}
          />
        )}
      </div>

      <div className="preview-container">
        <iframe
          className="live-preview"
          title="Live Preview"
          srcDoc={output}
          sandbox="allow-scripts"
          frameBorder="0"
          width="100%"
          height="400px"
        ></iframe>
      </div>
    </div>
  );
};

export default WebCompiler;
