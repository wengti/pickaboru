import "../index.css"
import "./css/layout.css"
import { NavLink, useNavigate } from 'react-router'
import { useEffect, useState } from 'react'
import { supabase } from '../supabase/supabase-client'
import { useAuth } from '../Auth/AuthProvider'

export default function Header() {

    // State
    const [error, setError] = useState(null)

    // useAuth
    const { session, isFetchSessionAttempted } = useAuth()

    // Navigate
    const navigate = useNavigate()

    // Effect
    useEffect(() => {
        if (error) {
            setError(null)
            navigate('/error')
        }
    }, [error, session, isFetchSessionAttempted])


    //Function
    async function handleLogout() {
        try {

            // Only allow to logout if there's a logged in session
            if (session) {
                const { error } = await supabase.auth.signOut()
                if (error) {
                    throw error
                }
                navigate('/signin')
            }
        }
        catch (err) {
            setError(err)
        }
    }

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

    const logOutEl = (
        <span onClick={() => { handleLogout() }} className='nav-btn logout-btn'>
            Logout
        </span>
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

                { session ? logOutEl : signInEl }

            </nav>
        </header>
    )
}