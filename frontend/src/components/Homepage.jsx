import React, {useState, useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import { LoginUser, reset, getMe } from "../features/authSlice";
import slide1 from "../assets/img/1.png";
import slide2 from "../assets/img/2.png";
import slide3 from "../assets/img/3.png";
import slide4 from "../assets/img/4.png";
import slide5 from "../assets/img/5.png";
import logo from "../assets/img/logo-BP.png";
import { Slide, Fade } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css';

const Homepage = () => {
  const [isActive, setisActive] = React.useState(false);
  return (
    <div>
        <nav className="navbar has-shadow" role="navigation" aria-label="main navigation" style={{minHeight: "5rem"}}>
            <div className="navbar-brand">
            <NavLink to="/" className="navbar-item">
                <img src={logo} style={{minHeight: "3.5rem"}} alt='Logo Balai Pustaka' />
                <p style={{fontSize: "1.2rem"}}>Balai Pustaka Archiving System</p>
            </NavLink>
        
            <a 
                onClick={() => {
                setisActive(!isActive);
                }}
                role="button"
                className={`navbar-burger burger ${isActive ? "is-active" : ""}`}
                aria-label="menu" 
                aria-expanded="false" 
                data-target="navbarBasicExample">
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
            </a>
            </div>
        
            <div id="navbarBasicExample" className={`navbar-menu ${isActive ? "is-active" : ""}`}>
            <div className="navbar-end">
                <div className="navbar-item">
                <div className="buttons">
                    <NavLink to="/login" className="navbar-item">
                        <button className="button is-success">
                        Login
                        </button>
                    </NavLink>
                    <NavLink to="/registration" className="navbar-item">
                        <button className="button is-primary">
                        Sign Up
                        </button>
                    </NavLink>            
                </div>
                </div>
            </div>
            </div>
        </nav>
        <Fade duration={3000} indicators={true}>
            <div className="each-slide">
            <div>
                <img src={slide2} />
            </div>
            </div>
            <div className="each-slide">
            <div>
                <img src={slide3} />
            </div>
            </div>
            <div className="each-slide">
            <div>
                <img src={slide4} />
            </div>
            </div>
            <div className="each-slide">
            <div>
                <img src={slide5} />
            </div>
            </div>
        </Fade>
    </div>
  )
}

export default Homepage