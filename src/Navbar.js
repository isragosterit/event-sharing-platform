import { Link } from "react-router-dom";
import logo from "./pics/m-logo.PNG";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { useAuthValue } from "./AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "./firebase";

function Navbar() {
  const { currentUser } = useAuthValue();
  const navigate = useNavigate();
  const [active, setActive] = useState(false);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        navigate("/login");
      })
      .catch((error) => {
        console.error("Error signing out: ", error);
      });
  };

  const toggleMenu = () => {
    setActive(!active);
  };

  return (
    <div className="navbar-container">
      <nav className="navbar" role="navigation" aria-label="main navigation">
        <div className="navbar-brand">
          <Link to="/home" className="navbar-item">
            <img src={logo} alt="Logo" />
          </Link>
          <a
            role="button"
            className={`navbar-burger ${active ? "is-active" : ""}`}
            aria-label="menu"
            aria-expanded={active ? "true" : "false"}
            data-target="navbarBasicExample"
            onClick={toggleMenu}
          >
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </a>
        </div>

        <div
          id="navbarBasicExample"
          className={`navbar-menu ${active ? "is-active" : ""}`}
        >
          <div className="navbar-start">
            <Link to="/home" className="navbar-item">
              Home
            </Link>
            <Link to="/About" className="navbar-item">
              About
            </Link>
            <Link to="/MainPage" className="navbar-item">
              Events
            </Link>

            <div className="navbar-item has-dropdown is-hoverable">
              <a className="navbar-link">More</a>

              <div className="navbar-dropdown">
                <Link to="/Contact" className="navbar-item">
                  Contact
                </Link>

                <hr className="navbar-divider" />

                <Link to="/ReportIssue" className="navbar-item">
                  Report an issue
                </Link>
              </div>
            </div>
          </div>

          <div className="navbar-end">
            {!currentUser ? (
              <>
                <Link to="/register" className="navbar-item">
                  <strong>Sign Up</strong>
                </Link>
                <Link to="/login" className="navbar-item">
                  Log In
                </Link>
              </>
            ) : (
              <div className="navbar-item">
                <Link to="/BrowseEvents" className="navbar-item">
                  BrowseEvents
                </Link>
                <button onClick={handleLogout} className="log-out-button">
                  Log Out
                </button>
              </div>
            )}
            <Link to="/MyEvents" className="navbar-item">
              MyEvents
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
