import React, {useState} from 'react';
import {NavLink, useNavigate} from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { LogOut, reset } from "../features/authSlice";
import LogoutConfirmation from "./LogoutConfirmation";
import {IoPerson, IoHome, IoBook, IoDocumentAttach,IoBookmark} from "react-icons/io5";
import logo from "../assets/img/logo-BP.png";

const Navbar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {user} = useSelector((state => state.auth));
    
    const [modalState, setModalState] = useState(false);
    const [isActive, setisActive] = React.useState(false);
    const toggleModal = () => {
        setModalState(!modalState);
    };
    const logout = () => {
        dispatch(LogOut());
        dispatch(reset());
        navigate("/");
        setModalState(false);
    };
  return (
    <div>
        <nav className="navbar is-fixed-top has-shadow" role="navigation" aria-label="main navigation">
          <div className="navbar-brand">
            <NavLink to="/dashboard" className="navbar-item">
              <img src={logo} width="" height="50" alt='Logo Balai Pustaka' />
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
            <div className='navbar-start is-hidden-tablet'>  
              <div className='navbar-item'>
                <NavLink to={"/dashboard"}> <IoHome/> Dashboard</NavLink>
              </div>
              <div className='navbar-item '>
                <NavLink to={"/collection"}> <IoBook/> Data Koleksi</NavLink>
              </div>
              <div className='navbar-item'>
                <NavLink to={"/digital-data"}> <IoDocumentAttach/> Data Digital</NavLink>
              </div>
              <hr />
              {user && user.role === "super-admin" && (
                <div>
                  <div className='navbar-item'>
                    <NavLink to={"/users"}> <IoPerson/> Data User</NavLink>
                  </div>
                  <hr />
                </div>
              )}
              
              {user && (user.role === "super-admin" || user.role === "pustakawan") && (
                <div>
                  <div className='navbar-item'>
                    <NavLink to={"/categories"}> <IoBookmark/> Kategori</NavLink>
                  </div>
                  <div className='navbar-item'>
                    <NavLink to={"/story-types"}> <IoBookmark/> Jenis Cerita</NavLink>
                  </div>
                  <div className='navbar-item'>
                    <NavLink to={"/languages"}> <IoBookmark/> Bahasa</NavLink>
                  </div>
                  <div className='navbar-item'>
                    <NavLink to={"/digital-format"}> <IoBookmark/> Format Digital</NavLink>
                  </div>
                  <hr />
                </div>
              )}
            </div>
            <div className="navbar-end">
              <div className="navbar-item">
                <div className="buttons">
                  <button onClick={() => toggleModal() } className="button is-danger">
                    Logout
                  </button>
                  <LogoutConfirmation confirmModal={logout} hideModal={toggleModal} modalState={modalState}  />
                </div>
              </div>
            </div>
          </div>
        </nav>
    </div>
  );
};

export default Navbar;