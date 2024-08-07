import { useState, useEffect } from "react";
import { Link, Outlet } from "react-router-dom";
import { Navigate } from "react-router-dom";
import InnQuestLogo from "../assets/Inn.png";
import Auth from "../utils/auth";


const Header = () => {
const [query, setQuery] = useState('');

const [queryResults, setQueryResults] = useState([]);

const handleQueryChange = (e) => { 
    setQuery(e.target.value);
};


 const handleSubmit = (e) => {
  e.preventDefault();
  if (!query) return;

  window.location.replace(`/search/${query}`);
}

  return (
    <div className="navbar navbar-expand-lg navbar-light bg-light w-100">
      <div className="container">
        <a className="navbar-brand" href="/">
          <span className="text-primary">
            <img src={InnQuestLogo} alt="FMI logo" className="logo mb-2" />
          </span>
          Quest
        </a>
        <div className="nav-links">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <a className="nav-link" href="/">
                Home
              </a>
            </li>
            {Auth.loggedIn() ? (
              <li className="nav-item">
                <a className="nav-link" href="/" onClick={() => Auth.logout()}>
                  Logout
                </a>
              </li>
            ) : (
              <>
                <li className="nav-item">
                  <a className="nav-link" href="/login">
                    Sign In
                  </a>
                </li>
              </>
            )}
            <li className="nav-item">
              <a className="nav-link" href="/">
                About
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/reservations">
                Reservations
              </a>
            </li>
          </ul>
        </div>
    </div>
    </div>
  );
};

export default Header;
