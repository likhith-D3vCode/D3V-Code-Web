import 'bootstrap-icons/font/bootstrap-icons.css';
import CompilerFrame from '../Frame-Work-Compiler/CompilerFrameWork';
import { useState } from "react";
import WebCompiler from '../Web_compiler/WebCompiler';
function PracticePage(){
    const [activeComponent, setActiveComponent] = useState("framework");
    return <>
    <div className="container TopContainer">
        <div className="Topcls">
            <h4></h4>
              <p>Submitions<button className="number">200</button></p>
              
             <p>Likes<button className="number">161</button></p>
             <p><i className="bi bi-chat-text-fill"></i><button className="number">1k</button></p>
        </div>
    </div>
    <div className="TotalContainer">
    <div className="discription">
     <h5>Build a simple personal profile page </h5>
     <p>Description</p>
     <p>You are tasked with creating a personal profile page using HTML and CSS. 
        This page will serve as a simple digital representation of the user, 
        showcasing personal details, skills, and projects in a visually appealing manner.
         Your solution should ensure a clean, modern, and responsive design.</p>

         <h6>Requirements</h6>
         <div>
            <div>
            <p>1.Profile Section:</p>
            <p>Display a profile picture in a circular frame (use a placeholder image).</p>
            <p>DInclude the user name as a heading.</p>
            <p>Add a short bio under the name, briefly describing the user.</p>
            </div>
            <div>
            <p>1.Profile Section:</p>
            <p>Display a profile picture in a circular frame (use a placeholder image).</p>
            <p>DInclude the user name as a heading.</p>
            <p>Add a short bio under the name, briefly describing the user.</p>
            </div>
            <div>
            <p>1.Profile Section:</p>
            <p>Display a profile picture in a circular frame (use a placeholder image).</p>
            <p>DInclude the user name as a heading.</p>
            <p>Add a short bio under the name, briefly describing the user.</p>
            </div>
         </div>
         <div>
            <h6>Acceptance Criteria:</h6>
            <div>
            <p>The profile page should be visually appealing and well-structured.</p>
            <p>The page must be responsive to different screen sizes (desktop and mobile).</p>
            <p>All links should be functional, and the design should be consistent throughout the page.</p>
            </div>
         </div>
    </div>
    <div className="rightSideE">
      {/* Buttons to switch between components */}
      <div className="button-container">
        <button onClick={() => setActiveComponent("framework")}>
          Framework
        </button>
        <button onClick={() => setActiveComponent("html/css/js")}>
          HTML/CSS/JS
        </button>
      </div>

      {/* Conditionally render the components based on activeComponent */}
      {activeComponent === "framework" && <CompilerFrame />}
      {activeComponent === "html/css/js" && <WebCompiler/>}
    </div>
    
 
    </div>
    <div className="SubTest"><h5>Test Cases</h5><button className="btn btn-primary" >Submit</button></div>
    </>

}

export default PracticePage;