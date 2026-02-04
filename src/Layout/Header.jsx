import "../index.css"
import "./css/layout.css"
import { NavLink } from 'react-router'
import { useAuth } from '../Auth/AuthProvider'
import { FaRegUserCircle } from "react-icons/fa";

export default function Header() {

    // useAuth
    const { session } = useAuth()


    // Elements
    const signInEl = (
        <NavLink
            to="/signin"
            end
            className={({ isActive }) => isActive ? "nav-btn active-nav-btn" : "nav-btn"}
        >
            Signin
        </NavLink>
    )


    return (
        <header>
            <NavLink
                className='logo-div'
                to="/"
            >
                <img className='logo-img' src="/images/mod-logo.png" />
                <span className='logo-text'>PICKABORU</span>
            </NavLink>

            <nav className='header-nav'>
                <NavLink
                    to="/about"
                    end
                    className={({ isActive }) => isActive ? "nav-btn active-nav-btn" : "nav-btn"}
                >
                    About
                </NavLink>

                <NavLink
                    to="/paddles"
                    className={({ isActive }) => isActive ? "nav-btn active-nav-btn" : "nav-btn"}
                >
                    Paddles
                </NavLink>

                {session ?
                    <NavLink
                        to ="/user"
                        className = {({ isActive }) => isActive ? "user-icon active-nav-btn" : "user-icon"}
                    >
                        <FaRegUserCircle />
                    </NavLink> :
                    signInEl 
                }

            </nav>
        </header>
    )
}