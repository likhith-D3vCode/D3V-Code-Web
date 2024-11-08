import"bootstrap/dist/css/bootstrap.min.css"
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import "./App.css"
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from "./HomePage/NavBar"
import FactsPage from "./HomePage/FactsPage"
import CompilerFrame from "./Frame-Work-Compiler/CompilerFrameWork";
import PracticePage from "./Labs/PracticePage";
// import Category from "./Labs/Category"
 import Questions from "./Labs/Questions"
// import PracticePage from "./Labs/PracticePage"
import ProtectedRoute from "./Components/ProtectedRouter";
import Course1 from "./CoursesCards/Course1"
import PostQuestionsAndTestCases from "./AdminPage/PostQuestionsAndTestCases"
import SignupPage from "./SignUpAndLogin/SignUpPage"
import LoginPage from "./SignUpAndLogin/SignUpPage"

function App() {
 

  return (
    <>
    {/* <NavBar/>
    <FactsPage/> */}

    {/* <NavBar/> for comment the code ctrl+a then ctrl+/
    <StartText/>
    <CourseCard/> */}
    {/* <Category/>
    <Questions/> */} 
    {/* <PracticePage/> */}

    <Router>
    <Routes>
      <Route path="/" element={<NavBar/>}/>
      <Route path="/SignUp" element={<SignupPage/>}/>
      <Route path="/Admin" element={<PostQuestionsAndTestCases/>}/>
      <Route path="/StaticLogin" element={<LoginPage/>}/>
      <Route path="/Study" element={<Course1/>}/>
      <Route path="/questions" element={<ProtectedRoute element={<Questions />} />} />
      <Route path="/question/:id" element={<ProtectedRoute element={<PracticePage />} />} />
    </Routes>
  </Router>

    </>
       
  
  )
}

export default App
