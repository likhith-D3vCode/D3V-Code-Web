import { useLocation } from "react-router-dom";
import {  useEffect, useState } from "react";
import CompilerFrame from '../Frame-Work-Compiler/CompilerFrameWork';
import WebCompiler from '../Web_compiler/WebCompiler';
import "./PracticePage.css"
import axios from "axios";

function PracticePage() {
  const location = useLocation();  // Get the state passed from the Link
  const { title, description,Requirements,AcceptanceCriteria ,TestCases,_id} = location.state || {};  // Destructure title and description
  const [activeComponent, setActiveComponent] = useState("framework");
  const [showComments, setshowComments]=useState(false);

  const [usercomments,setUserComments]=useState({
    comments:""
  })

  const [getuserdata,setGetuserdata]=useState([]);

  
  const handleOnClick=()=>{
    // e.preventDefault();
    if(showComments===false){
      setshowComments(true);
    }else{
      setshowComments(false);
    }
      
  }



  const handleChange=(e)=>{
    setUserComments({
      ...usercomments,
      [e.target.name]:e.target.value
    });
  }

  const getusercomments=async()=>{
    try{
        console.log("dfjkghj",_id)
      const userdata=await axios.get(`http://localhost:9000/getQuestionsComments/getApi/${_id}`);
       const userdataArray=Array.isArray(userdata.data) ? userdata.data :Object.values(userdata.data);
       
       setGetuserdata(userdataArray)

    }catch(err){

      console.log(err);

    }

  }




  const handleSubmit=async(e)=>{
    e.preventDefault();
     
    try {
      console.log("data", usercomments);
      await axios.post(
        `http://localhost:9000/QuestionsComments/api/${_id}`,
        usercomments,
        { withCredentials: true }
      );

      setUserComments({
        comments:""
      })

    } catch (error) {
      console.log(error);
    }

      getusercomments();

  }
  useEffect(() => {
      getusercomments();
    
  },[]);

  
 

 



  return (
    <>
      <div className="container TopContainer">
        
      </div>
      <div className="TotalContainer">
        <div className="discription">
          <div>
            
            <div className="Topcls">
          {/* <h4>{title}</h4> Display the question title */}
          <p>Submissions<button className="number">200</button></p>
          <p>Likes<button className="number">161</button></p>
          <p><i className="bi bi-chat-text-fill"></i><button className="number" onClick={()=>handleOnClick()} >{getuserdata.length}</button></p>
        </div>
            <h5>{title}</h5>
          </div>
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
         {showComments&&
           <div>
           <h1>Comments</h1>
           
           <input type="text" name="comments" value={usercomments.comments}  placeholder="Enter the comments" onChange={handleChange} required/>
           <button onClick={(e)=>handleSubmit(e)}>Send</button>

           <div className="mt-3 comment-container">
                          {getuserdata.length > 0 ? (
                            getuserdata.map((comment) => (
                              <div key={comment._id} className="comment">
                                <p>
                                  <strong></strong>{" "}
                                  {comment.comments}
                                </p>
                              </div>
                            ))
                          ) : (
                            <p>No comments </p>
                          )}
                        </div>

          </div>
         }
        

        </div>
        <div className="rightSideE">
          {/* Buttons to switch between components */}
          <div className="button-container">
            <button onClick={() => setActiveComponent("framework")}>Framework</button>
            <button onClick={() => setActiveComponent("html/css/js")}>HTML/CSS/JS</button>
          </div>

          {/* Conditionally render the components based on activeComponent */}
          {activeComponent === "framework" && <CompilerFrame />}
          {activeComponent === "html/css/js" && <WebCompiler TestCases={TestCases} questionId={_id} />}
        </div>
      </div>
      {/* <div className="SubTest"><h5>Test Cases</h5><button className="btn btn-primary">Submit</button></div> */}
    </>
  );
}

export default PracticePage;
