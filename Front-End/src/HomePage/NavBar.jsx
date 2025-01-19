import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import FactsPage from "./FactsPage";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import BACKEND_URL from "../config";

function NavBar() {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const [profile, setProfile] = useState();
  const [showDropdown, setShowDropdown] = useState(false);
  const [Firstlatter, setFirstlatter] = useState();
  const [imageError, setImageError] = useState(false); // Track image loading errors

  // Fetch user data from the API
  useEffect(() => {
    const fetchUserData = async () => {
      const tokenauth = localStorage.getItem("authToken");

      try {
        const response = await fetch(
          `${BACKEND_URL}/getOneUsername/oneuser/api`,
          {
            headers: {
              Authorization: `Bearer ${tokenauth}`,
            },
            method: "GET",
            credentials: "include", // To include cookies in the request
          }
        );
        const data = await response.json();

        if (data.msg === "User data") {
          setUserData(data.userdata);
          setProfile(data.userdata.profileImg);

          const firstLetter =
            data?.userdata?.username?.[0]?.toUpperCase() || ""; // Safely get the first letter of the username
          setFirstlatter(firstLetter);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    // Clear the token from localStorage
    localStorage.removeItem("authToken");

    // Optionally, clear other user-related data (e.g., profile information)
    // Redirect the user to the login page
    window.location.href = "/StaticLogin"; // Replace with your login route
  };

  // Logout function to clear token from the cookie and redirect to login
  // const handleLogout = async () => {
  //   const tokenauth = localStorage.getItem('authToken');

  //   try {
  //     // Send a request to the backend to clear the cookie
  //     const response =   await fetch(`${BACKEND_URL}/logout`, {
  //       headers: {
  //         Authorization: `Bearer ${tokenauth}`,
  //       },
  //       method: "POST",
  //       credentials: "include", // To include cookies in the request
  //     });

  //     if (response.ok) {
  //       // If the response is OK, navigate to the login page
  //       navigate("/StaticLogin");
  //     } else {
  //       console.error("Error logging out");
  //     }
  //   } catch (error) {
  //     console.error("Logout request failed", error);
  //   }
  // };
  const imageUrl = `/UserImages/${profile}`;
  const shouldDisplayFallback = !imageUrl || imageError;

  return (
    <>
      <header className="p-3 text-bg-dark .navbar-container">
        <div className="container">
          <nav className="navbar navbar-expand-lg navbar-dark">
            <a
              className="navbar-brand"
              onClick={(e) => {
                e.preventDefault(); // Prevent the default anchor behavior
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
                      e.preventDefault(); // Prevent the default anchor behavior
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
                    onClick={(e) => {
                      e.preventDefault(); // Prevent the default anchor behavior
                      navigate("/discuss");
                    }}
                    style={{ cursor: "pointer" }}
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

              {/* Display the profile icon and username when user is logged in */}
              {userData ? (
                <div className="ms-auto d-flex align-items-center position-relative profileBox-container">
                  {shouldDisplayFallback ? (
                    <img
                      onClick={() => setShowDropdown((prev) => !prev)}
                      src={imageUrl}
                      alt={`${userData.username}'s Profile`}
                      className="rounded-circle"
                      style={{
                        width: "40px",
                        height: "40px",
                        cursor: "pointer",
                        objectFit: "cover",
                      }}
                      onError={() => setImageError(true)} // Set error state if image fails to load
                    />
                  ) : (
                    <div
                      onClick={() => setShowDropdown((prev) => !prev)}
                      className="rounded-circle d-flex justify-content-center align-items-center"
                      style={{
                        width: "40px",
                        height: "40px",
                        cursor: "pointer",
                        backgroundColor: "#ddd", // Fallback background color
                        color: "#555", // Fallback text color
                        fontWeight: "bold",
                        fontSize: "16px",
                      }}
                    >
                      {Firstlatter}
                    </div>
                  )}
                  {showDropdown && (
                    <div className="profileBox">
                      <div
                        className="dropdown-item imageOfprofile"
                        onClick={() => {
                          navigate("/UserProfile");
                          setShowDropdown(false);
                        }}
                      >
                        {shouldDisplayFallback ? (
                          <img
                            onClick={() => setShowDropdown((prev) => !prev)}
                            src={imageUrl}
                            alt={`${userData.username}'s Profile`}
                            className="rounded-circle"
                            style={{
                              width: "40px",
                              height: "40px",
                              cursor: "pointer",
                              objectFit: "cover",
                            }}
                            onError={() => setImageError(true)} // Set error state if image fails to load
                          />
                        ) : (
                          <div
                            onClick={() => setShowDropdown((prev) => !prev)}
                            className="round-circle d-flex justify-content-center align-items-center"
                            style={{
                              width: "50px",
                              height: "20px",
                              cursor: "pointer",
                              backgroundColor: "#ddd", // Fallback background color
                              color: "#555", // Fallback text color
                              fontWeight: "bold",
                              fontSize: "16px",
                            }}
                          >
                            {Firstlatter}
                          </div>
                        )}{" "}
                        <strong
                          style={{
                            cursor: "pointer",
                          }}
                        >
                          {userData.username}
                        </strong>
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
                      >
                        <i className="bi bi-box-arrow-right"></i>
                        Logout
                      </div>
                    </div>
                  )}
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
      <FactsPage />
    </>
  );
}

export default NavBar;
