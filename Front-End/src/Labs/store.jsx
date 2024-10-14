import { useState } from 'react';
import { Controlled as CodeMirror } from 'react-codemirror2';

// Import the styles for the editor
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript.js';
import 'codemirror/mode/htmlmixed/htmlmixed.js';
import 'codemirror/mode/css/css.js';

// Sample Questions Data
const questionsData = [
  {
    id: 1,
    title: 'Create a Responsive Navbar',
    description: 'Build a responsive navbar with HTML and CSS.',
    solution: '<nav> ... </nav>',
    testCases: [
      { id: 1, description: 'Should contain a <nav> element', test: (code) => code.includes('<nav>') },
      { id: 2, description: 'Should contain a <ul> inside <nav>', test: (code) => code.includes('<ul>') },
    ],
  },
  {
    id: 2,
    title: 'Build a Simple Todo List',
    description: 'Create a simple todo list app using JavaScript.',
    solution: '<script>const todos = [];</script>',
    testCases: [
      { id: 1, description: 'Should have a <script> tag', test: (code) => code.includes('<script>') },
      { id: 2, description: 'Should define a "todos" array', test: (code) => code.includes('const todos') },
    ],
  },
  // Add more questions as needed
];

function QuestionsPage() {
  const [selectedQuestion, setSelectedQuestion] = useState(null); // Track selected question
  const [code, setCode] = useState(''); // Code written by the user
  const [showSolution, setShowSolution] = useState(false); // Toggle solution view
  const [discussion, setDiscussion] = useState([]); // Mock discussion data
  const [testResults, setTestResults] = useState([]); // Store the test case results
  const [showLive, setShowLive] = useState(false); // Toggle live view

  // Function to handle question selection
  const handleQuestionSelect = (question) => {
    setSelectedQuestion(question);
    setShowSolution(false); // Hide solution when a new question is selected
    setCode(''); // Reset code editor
    setTestResults([]); // Reset test case results
    setShowLive(false); // Hide live view
  };

  // Function to execute the code and show output in an iframe
  const handleSubmitCode = () => {
    const iframe = document.getElementById('output-iframe');
    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
    iframeDoc.open();
    iframeDoc.write(code);
    iframeDoc.close();
    runTestCases();
  };

  // Function to show live preview of the code
  const handleShowLive = () => {
    setShowLive(true); // Show live iframe when button is clicked
  };

  // Function to validate code against test cases
  const runTestCases = () => {
    if (!selectedQuestion) return;

    const results = selectedQuestion.testCases.map((testCase) => ({
      ...testCase,
      passed: testCase.test(code),
    }));

    setTestResults(results);
  };

  // Function to submit discussion comments (mock function)
  const handleDiscussionSubmit = (comment) => {
    setDiscussion([...discussion, comment]);
  };

  return (
    <div className="d-flex flex-column align-items-stretch flex-shrink-0 bg-body-tertiary">
      <div className="list-group list-group-flush border-bottom scrollarea" style={{ width: '380px' }}>
        {questionsData.map((question) => (
          <a
            key={question.id}
            href="#"
            className="list-group-item list-group-item-action py-3 lh-sm"
            onClick={() => handleQuestionSelect(question)}
          >
            <div className="d-flex w-100 align-items-center justify-content-between">
              <strong className="mb-1">{question.title}</strong>
            </div>
            <div className="col-10 mb-1 small">{question.description}</div>
          </a>
        ))}
      </div>

      {selectedQuestion && (
        <div className="code-editor-section mt-3">
          <h5>{selectedQuestion.title}</h5>
          <p>{selectedQuestion.description}</p>

          {/* Code Editor */}
          <div className="code-editor">
            <CodeMirror
              value={code}
              options={{
                mode: 'htmlmixed', // Supports HTML, CSS, and JS
                lineNumbers: true,
              }}
              onBeforeChange={(editor, data, value) => {
                setCode(value); // Update code when edited
              }}
            />
          </div>

          {/* Buttons for submission and solution */}
          <div className="d-flex justify-content-between mt-3">
            <button className="btn btn-primary" onClick={handleSubmitCode}>
              Submit Code
            </button>
            <button className="btn btn-secondary" onClick={() => setShowSolution(!showSolution)}>
              {showSolution ? 'Hide Solution' : 'Show Solution'}
            </button>
            <button className="btn btn-success" onClick={handleShowLive}>
              Show Live
            </button>
          </div>

          {/* Code Output */}
          <div className="output-section mt-3">
            <h6>Output:</h6>
            <iframe id="output-iframe" style={{ width: '100%', height: '200px', border: '1px solid #ccc' }}></iframe>
          </div>

          {/* Live View Section */}
          {showLive && (
            <div className="live-view-section mt-3">
              <h6>Live View:</h6>
              <iframe
                style={{ width: '100%', height: '400px', border: '1px solid #ccc' }}
                srcDoc={code}
                title="Live Preview"
              ></iframe>
            </div>
          )}

          {/* Test Results */}
          <div className="test-results mt-3">
            <h6>Test Results:</h6>
            <ul>
              {testResults.map((result) => (
                <li key={result.id} style={{ color: result.passed ? 'green' : 'red' }}>
                  {result.description}: {result.passed ? 'Passed' : 'Failed'}
                </li>
              ))}
            </ul>
          </div>

          {/* Solution Section */}
          {showSolution && (
            <div className="solution-section mt-3">
              <h6>Solution:</h6>
              <pre>{selectedQuestion.solution}</pre>
            </div>
          )}

          {/* Discussion Section */}
          <div className="discussion-section mt-4">
            <h6>Discussion</h6>
            <ul>
              {discussion.map((comment, index) => (
                <li key={index}>{comment}</li>
              ))}
            </ul>
            <input
              type="text"
              className="form-control"
              placeholder="Add a comment"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleDiscussionSubmit(e.target.value);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default QuestionsPage;
