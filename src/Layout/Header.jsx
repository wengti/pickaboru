import "../index.css"
import "./css/layout.css"
import {NavLink} from 'react-router'

export default function Header(){
    return (
        <header>
            <NavLink 
                className='logo-div'
                to="/"
            >
                <img className='logo-img' src="/images/mod-logo.png"/>
                <span className='logo-text'>PICKABORU</span>
            </NavLink>

            <nav className='header-nav'>
                <NavLink
                    to="/about"
                    end
                    className={({isActive}) => isActive ? "nav-btn active-nav-btn" : "nav-btn"}
                >
                    About
                </NavLink>

                <NavLink
                    to="/paddles"
                    className={({isActive}) => isActive ? "nav-btn active-nav-btn" : "nav-btn"}
                >
                    Paddles
                </NavLink>

                <NavLink
                    to="/signin"
                    end
                    className={({isActive}) => isActive ? "nav-btn active-nav-btn" : "nav-btn"}
                >
                    Signin
                </NavLink>
            </nav>
        </header>
    )
}