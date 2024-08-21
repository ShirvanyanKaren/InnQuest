import { useState, useEffect } from "react";
import { Link, Outlet } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import InnQuestLogo from "../assets/Inn.png";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { ClickAwayListener } from "@mui/material";
import Auth from "../utils/auth";


const Header = () => {
const [query, setQuery] = useState('');
const [queryResults, setQueryResults] = useState([]);
const location = useLocation();
const [hamburger, setHamburger] = useState(false);
const [clickedAway, setClickedAway] = useState(false);

const handleQueryChange = (e) => { 
    setQuery(e.target.value);
};


 const handleSubmit = (e) => {
  e.preventDefault();
  if (!query) return;

  window.location.replace(`/search/${query}`);
}

const handleHamburger = () => {
  setHamburger(!hamburger);
}


const handleClickAway = () => {
  setTimeout(() => {
  setHamburger(false);
  }, 50);
}





  return (

    <div className={`navbar navbar-expand-lg navbar-light bg-light w-100`}>
      <div className="container">
        <a className="navbar-brand" href="/">
          <span className="text-dark">
            <img src={InnQuestLogo} alt="FMI logo" className="logo mb-2" />
          </span>
          Quest&nbsp;{location.pathname === "/admin" ? "Hotel Management" : "Inn"}
        </a>

        <div className={`nav-links ${hamburger ? "show" : ""}`}>
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <a className="nav-link" href="/">
                Home
              </a>
            </li>
            {Auth.loggedIn() ? (
              <>
              <li className="nav-item">
                <a className="nav-link" href="/" onClick={() => Auth.logout()}>
                  Logout
                </a>
              </li>
                <li className={`nav-item ${location.pathname === "/admin" ? "d-none" : ""}`}>
                <a className="nav-link" href="/reservations">
                  Reservations
                </a>
              </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <a className="nav-link" href="/login">
                    Sign In
                  </a>
                </li>
              </>
            )}
            <li className={`nav-item ${location.pathname === "/admin" ? "d-none" : ""}`}>
              <a className="nav-link" href="/">
                About
              </a>
            </li>
          </ul>
        </div>
        <ClickAwayListener onClickAway={handleClickAway}>
        <div className="hamburger" onClick={handleHamburger}>
          <FontAwesomeIcon icon={faBars} 
          size="3x"
          />
        </div>
        </ClickAwayListener>
    </div>
    </div>
  );
};

export default Header;