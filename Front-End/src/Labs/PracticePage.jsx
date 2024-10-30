import { useLocation } from "react-router-dom";
import { useState } from "react";
import CompilerFrame from '../Frame-Work-Compiler/CompilerFrameWork';
import WebCompiler from '../Web_compiler/WebCompiler';

function PracticePage() {
  const location = useLocation();  // Get the state passed from the Link
  const { title, description,Requirements,AcceptanceCriteria ,TestCases} = location.state || {};  // Destructure title and description
  const [activeComponent, setActiveComponent] = useState("framework");

  return (
    <>
      <div className="container TopContainer">
        <div className="Topcls">
          <h4>{title}</h4> {/* Display the question title */}
          <p>Submissions<button className="number">200</button></p>
          <p>Likes<button className="number">161</button></p>
          <p><i className="bi bi-chat-text-fill"></i><button className="number">1k</button></p>
        </div>
      </div>
      <div className="TotalContainer">
        <div className="discription">
          <h5>{title}</h5>  {/* Use the title from the Link */}
          <p>Description</p>
          <p>{description}</p>  {/* Use the description from the Link */}
          <h6>Requirements</h6>
          {Requirements.map((req, index) => (
            <div key={index}>
              <h6>{req.sectionTitle}</h6>
              <p>{req.sectionContent}</p>
            </div>
          ))}
          <h6>Acceptance Criteria:</h6>
          {AcceptanceCriteria.map((criteria, index) => (
            <p key={index}>{criteria.Criteria1}</p>
          ))}
        </div>
        <div className="rightSideE">
          {/* Buttons to switch between components */}
          <div className="button-container">
            <button onClick={() => setActiveComponent("framework")}>Framework</button>
            <button onClick={() => setActiveComponent("html/css/js")}>HTML/CSS/JS</button>
          </div>

          {/* Conditionally render the components based on activeComponent */}
          {activeComponent === "framework" && <CompilerFrame />}
          {activeComponent === "html/css/js" && <WebCompiler TestCases={TestCases} />}
        </div>
      </div>
      {/* <div className="SubTest"><h5>Test Cases</h5><button className="btn btn-primary">Submit</button></div> */}
    </>
  );
}

export default PracticePage;
