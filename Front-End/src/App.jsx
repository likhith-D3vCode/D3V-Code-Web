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
      <Route path="/" element={<Questions />} />
      <Route path="/question/:id" element={<PracticePage />} />
    </Routes>
  </Router>

    </>
       
  
  )
}

export default App
