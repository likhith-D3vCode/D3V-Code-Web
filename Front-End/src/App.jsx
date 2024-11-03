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
import SignUpPage from "./SignUpAndLogin/SignUpPage";
import LoginPage from "./SignUpAndLogin/loginPage";
// import PracticePage from "./Labs/PracticePage"
import ProtectedRoute from "./Components/ProtectedRouter";

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
      <Route path="/SignUp" element={<SignUpPage/>}/>
      <Route path="/StaticLogin" element={<LoginPage/>}/>
      <Route path="/questions" element={<ProtectedRoute element={<Questions />} />} />
      <Route path="/question/:id" element={<ProtectedRoute element={<PracticePage />} />} />
    </Routes>
  </Router>

    </>
       
  
  )
}

export default App
