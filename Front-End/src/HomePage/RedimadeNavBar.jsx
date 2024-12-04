import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function RedimadeNavBar() {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  // Fetch user data from the API
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("http://localhost:9000/getOneUsername/oneuser/api", {
          method: "GET",
          credentials: "include", // To include cookies in the request
        });
        const data = await response.json();

        if (data.msg === "User data") {
          setUserData(data.userdata);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  // Logout function to clear token from the cookie and redirect to login
  const handleLogout = async () => {
    try {
      // Send a request to the backend to clear the cookie
      const response =   await fetch("http://localhost:9000/logout", {
        method: "POST",
        credentials: "include", // To include cookies in the request
      });
    
  
      if (response.ok) {
        // If the response is OK, navigate to the login page
        navigate("/StaticLogin");
      } else {
        console.error("Error logging out");
      }
    } catch (error) {
      console.error("Logout request failed", error);
    }
  };

  return (
    <>
      <header className="p-3 text-bg-dark">
        <div className="container">
          <nav className="navbar navbar-expand-lg navbar-dark">
            <a className="navbar-brand">D3VCode</a>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav me-auto navlinks">
                <li className="nav-item">
                  <a className="nav-link" onClick={() => navigate("/Study")}>
                    Study
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/questions">
                    Labs
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">
                    Events
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">
                    Discussion
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">
                    Assessments
                  </a>
                </li>
              </ul>

              {/* Display the profile icon and username when user is logged in */}
              {userData ? (
                <div className="ms-auto d-flex align-items-center">
                  <img
                    src="https://via.placeholder.com/40"
                    alt="Profile"
                    className="rounded-circle"
                    style={{ width: "40px", height: "40px" }}
                  />
               <button onClick={()=>navigate("/UserProfile")}>  <span className="ms-2">{userData.username}</span></button> 
                  <button
                    type="button"
                    className="btn btn-outline-light ms-2"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              ) : (
                // Show login and signup buttons if user is not logged in
                <div className="ms-auto d-flex">
                  <button
                    type="button"
                    className="btn btn-outline-light me-2"
                    onClick={() => navigate("/StaticLogin")}
                  >
                    Login
                  </button>
                  <button
                    type="button"
                    className="btn btn-warning"
                    onClick={() => navigate("/signUp")}
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>
          </nav>
        </div>
      </header>
     
    </>
  );
}

export default RedimadeNavBar;
