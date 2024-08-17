import { useEffect, useState } from "react";
import Auth from "../utils/auth"
import { login, register } from "../services/user";
import axios from "axios";
import {jwtDecode} from "jwt-decode";
import googleLogo from '../assets/google-icon-logo.svg'
import xLogo from '../assets/X_icon.svg'
import xWhiteLogo from '../assets/x-white-icon.png'

const Login = () => {
  const [adminPage, setAdminPage] = useState(false);
  useEffect(() => {
    const location = window.location.pathname.split('/')[1];
    if (location === 'admin') setAdminPage(true);
    if (location === 'login') {
      setJustifyActive('login');
    } else if (location === 'signup') {
      setJustifyActive('signup');
    }
  }, []);


    const [formState, setFormState] = useState({
        email: "",
        first_name: "",
        last_name: "",
        password: "",
        error: "",
      });
    
      const [justifyActive, setJustifyActive] = useState("login");
    
      const handleChange = (e) => {
        setFormState({
          ...formState,
          [e.target.name]: e.target.value,
        });
      };
    
      const handleJustifyClick = (justify) => {
        setJustifyActive(justify);
      };
    
      const handleFormSubmit = async (e) => {
        e.preventDefault();
        if (justifyActive === "login") {
          try {
            const response = await login({ username: formState.email, password: formState.password });
            if (response.status === 200) {
              console.log(response);
              Auth.login(response.data.access);
            } else {
              let error
              if (response.response.status === 401) error = "Invalid username or password";
              console.log(response);
              console.log(error);
              setFormState({
                ...formState,
                error: error
              });
            }
          } catch (error) {
            console.error(error);
          }
        } else {
            try {
                const response = await register(formState);
                if (response.status === 200) {
                    Auth.login(response.data.access);
                } else {
                  let error
                  if (response.response.status === 409) error = "User already exists";
                setFormState({
                    ...formState,
                    error: error
                });
                }
            } catch (error) {
                console.error(error);
            }
          
        }
      };


    
    return (
        <div className="container mt-5 w-50">
          <div className="card p-4">
            <ul className="nav nav-pills mb-3 justify-content-center" id="pills-tab" role="tablist">
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link ${justifyActive === "login" ? "active" : ""}`}
                  id="pills-login-tab"
                  onClick={() => handleJustifyClick("login")}
                >
                  {adminPage ? "Admin Login" : "Login"}
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link ${justifyActive === "signup" ? "active" : ""} ${adminPage ? "d-none" : ""}`}
                  id="pills-register-tab"
                  onClick={() => handleJustifyClick("signup")}
                >
                  Register
                </button>
              </li>
            </ul>
    
            <div className="tab-content" id="pills-tabContent">
              <div
                id="pills-login"
              >
                <form onSubmit={handleFormSubmit}>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      Email
                    </label>
                    <input
                      type={`${adminPage ? "text" : "email"}`}
                      className="form-control"
                      id="email"
                      name="email"
                      value={formState.email}
                      onChange={handleChange}
                    />
                  </div>
                  { justifyActive === "login" ? null : (
                    <>
                    <div className="mb-3">
                      <label htmlFor="first_name" className="form-label">
                        First Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="first_name"
                        name="first_name"
                        value={formState.first_name}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="last_name" className="form-label">
                        Last Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="last_name"
                        name="last_name"
                        value={formState.last_name}
                        onChange={handleChange}
                      />
                    </div>
                    </>
                  )}
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                      Password
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      name="password"
                      value={formState.password}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="d-flex justify-content-between mb-3">
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" id="rememberMe" />
                      <label className="form-check-label" htmlFor="rememberMe">
                        Remember me
                      </label>
                    </div>
                  </div>
                  <button type="submit" className="btn btn-primary w-100">
                    { justifyActive === "login" ? "Login" : "Register" }
                  </button>
                </form>
                <button type="submit" 
                className={`btn btn-dark w-100 mt-3 ${adminPage ? "d-none" : ""}`}
                >
                <span className=''>
                   <img 
                    className="google-logo"
                    src={googleLogo} alt='google logo' /></span>
                    { justifyActive === "login" ? "Login with Google" : "Register with Google" } 
    
                </button>
                <button type="submit"
                className={`btn btn-dark w-100 mt-3 ${adminPage ? "d-none" : ""}`}
                >
                    { justifyActive === "login" ? "Login with" : "Register with" }
                    <span className=''>
                   <img 
                    className="x-logo"
                    src={xWhiteLogo} alt='x logo' /></span>
                </button>
              </div>
            
    
            </div>
            {formState.error && (
              <div className="alert alert-danger mt-3" role="alert">
                {formState.error}
              </div>
            )}
          </div>
        </div>
      );
    };
    


export default Login;