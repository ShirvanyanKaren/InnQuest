import { useState, useEffect } from "react";
import InnQuestLogo from "../assets/Inn.png";


const Header = () => {

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
                <li className="nav-item">
                  <a className="nav-link" href="/login">
                    Sign In
                  </a>
                </li>
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
