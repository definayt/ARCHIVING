import React, {useState} from 'react';
import {NavLink, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { LogOut, reset } from "../features/authSlice";
import {IoPerson, IoHome, IoLogOut, IoBook, IoDocumentAttach,IoBookmark} from "react-icons/io5";
import LogoutConfirmation from './LogoutConfirmation';

const Sidebar = () => {
    //assigning location variable
    const location = useLocation();

    //destructuring pathname from location
    const { pathname } = location;

    //Javascript split method to get the name of the path in array
    const splitLocation = pathname.split("/");

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {user} = useSelector((state => state.auth));
    
    const [modalState, setModalState] = useState(false);
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
        <aside className="menu pl-2 mt-4 has-shadow is-narrow-mobile is-fullheight is-hidden-mobile">
            <p className="menu-label">
                General
            </p>
            <ul className="menu-list">
                <li><NavLink className={splitLocation[1] === "dashboard" ? "is-active" : ""} to={"/dashboard"}> <IoHome/> Dashboard</NavLink></li>
                <li><NavLink className={splitLocation[1] === "collection" || splitLocation[1] === "collections" ? "is-active" : ""} to={"/collection"}> <IoBook/> Data Koleksi</NavLink></li>
                <li><NavLink className={splitLocation[1] === "digital-data" ? "is-active" : ""} to={"/digital-data"}> <IoDocumentAttach/> Data Digital</NavLink></li>
            </ul>
            {user && user.role === "super-admin" && (
                <div>
                    <p className="menu-label mt-4">
                        Super Admin
                    </p>
                    <ul className="menu-list">
                        <li><NavLink className={splitLocation[1] === "users" ? "is-active" : ""} to={"/users"}> <IoPerson/> Data User</NavLink></li>
                        
                    </ul>
                </div>
            )}
            {user && (user.role === "super-admin" || user.role === "pustakawan") && (
                <div>
                    <p className="menu-label mt-4">
                        Data Dukungan
                    </p>
                    <ul className="menu-list">
                        <li><NavLink className={splitLocation[1] === "categories" ? "is-active" : ""} to={"/categories"}> <IoBookmark/> Kategori</NavLink></li>
                        <li><NavLink className={splitLocation[1] === "story-types" ? "is-active" : ""} to={"/story-types"}> <IoBookmark/> Jenis Cerita</NavLink></li>
                        <li><NavLink className={splitLocation[1] === "languages" ? "is-active" : ""} to={"/languages"}> <IoBookmark/> Bahasa</NavLink></li>
                        <li><NavLink className={splitLocation[1] === "digital-format" ? "is-active" : ""} to={"/digital-format"}> <IoBookmark/> Format Digital</NavLink></li>
                    </ul>
                </div>
            )}
            <p className="menu-label">
                Pengaturan
            </p>
            <ul className="menu-list">
                <li><button onClick={() => toggleModal() } className="button is-white"> <IoLogOut/> Logout</button></li>
                <LogoutConfirmation confirmModal={logout} hideModal={toggleModal} modalState={modalState}  />
            </ul>
            </aside>
    </div>
  );
};

export default Sidebar;