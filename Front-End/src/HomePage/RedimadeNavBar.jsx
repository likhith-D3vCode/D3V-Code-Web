import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./RedimadeNavBar.css"
function RedimadeNavBar() {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const [profile, setProfile] = useState();
  const [showDropdown, setShowDropdown] = useState(false);

  // Fetch user data from the API
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(
          "http://localhost:9000/getOneUsername/oneuser/api",
          {
            method: "GET",
            credentials: "include", // To include cookies in the request
          }
        );
        const data = await response.json();

        if (data.msg === "User data") {
          setUserData(data.userdata);
          setProfile(data.userdata.profileImg);
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
      const response = await fetch("http://localhost:9000/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        navigate("/");
      } else {
        console.error("Error logging out");
      }
    } catch (error) {
      console.error("Logout request failed", error);
    }
  };

  const imageUrl = `/UserImages/${profile}`;

  return (
    <>
      <header className="p-3 text-bg-dark">
        <div className="container">
          <nav className="navbar navbar-expand-lg navbar-dark">
            <a
              className="navbar-brand"
              onClick={(e) => {
                e.preventDefault();
                navigate("/");
              }}
              style={{ cursor: "pointer" }}
            >
              D3VCode
            </a>
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
                  <a
                    className="nav-link"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate("/Study");
                    }}
                    style={{ cursor: "pointer" }}
                  >
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
                  <a
                    className="nav-link"
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate("/discuss");
                    }}
                  >
                    Discussion
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">
                    Assessments
                  </a>
                </li>
              </ul>

              {userData ? (
                <div className="ms-auto d-flex align-items-center position-relative profileBox-container">
                  <img
                    src={imageUrl}
                    alt={`${userData.username}'s Profile`}
                    className="rounded-circle"
                    style={{
                      width: "40px",
                      height: "40px",
                      cursor: "pointer",
                    }}
                    onClick={() => setShowDropdown((prev) => !prev)}
                  />
                  {showDropdown && (
                    <div
                      className="profileBox"
                     
                    >
                      <div
                        className="dropdown-item imageOfprofile"
                        onClick={() => {
                          navigate("/UserProfile");
                          setShowDropdown(false);
                        }}
                      >
                        <img
                    src={imageUrl}
                    alt={`${userData.username}'s Profile`}
                    className="rounded-circle"
                    style={{
                      width: "40px",
                      height: "40px",
                      cursor: "pointer",
                    }}
                  />  <strong style={{
                     
                      cursor: "pointer",
                    }}  > 
                  {userData.username}</strong>
                      </div>
                      <div
                        className="dropdown-item"
                        onClick={() => {
                          navigate("/settings");
                          setShowDropdown(false);
                        }}
                      >
                        Settings
                      </div>
                      <div
                        className="dropdown-item text-danger"
                        onClick={() => {
                          handleLogout();
                          setShowDropdown(false);
                        }}

                        style={{
                     
                          cursor: "pointer",
                        }}
                      ><i className="bi bi-box-arrow-right"></i>
                        Logout
                      </div>
                    </div>
                  )}
                </div>
              ) : (
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
