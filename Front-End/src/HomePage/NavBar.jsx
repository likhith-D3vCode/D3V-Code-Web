import "bootstrap/dist/css/bootstrap.min.css";

function NavBar() {
  return (
    <>
      <header className="p-3 text-bg-dark">
        <div className="container">
          <nav className="navbar navbar-expand-lg navbar-dark">
            <a className="navbar-brand" >D3VCode</a>
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
              <ul className="navbar-nav me-auto navlinks"> {/* Align the links to the left */}
                <li className="nav-item">
                  <a className="nav-link" href="#">Study</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">Labs</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">Events</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">Discussion</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">Assessments</a>
                </li>
              </ul>

              {/* Align buttons to the right in a collapsible section */}
              <div className="ms-auto d-lg-none"> {/* Show buttons only on smaller screens */}
                <button type="button" className="btn btn-outline-light me-2">Login</button>
                <button type="button" className="btn btn-warning">Sign Up</button>
              </div>
            </div>

            {/* Always show buttons on larger screens */}
            <div className="d-none d-lg-flex ms-auto"> {/* Show buttons only on larger screens */}
              <button type="button" className="btn btn-outline-light me-2">Login</button>
              <button type="button" className="btn btn-warning">Sign Up</button>
            </div>
          </nav>
        </div>
      </header>
    </>
  );
}

export default NavBar;
