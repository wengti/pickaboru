import "./css/userlayout.css"
import { Outlet, useNavigate, NavLink } from 'react-router'
import { useEffect, useState } from 'react'
import { supabase } from '../supabase/supabase-client'
import { useAuth } from '../Auth/AuthProvider'
import { ImExit } from "react-icons/im";
import ProtectedRoute from '../Auth/ProtectedRoute'
import Loading from '../Utils/Loading'
import { useCurrentUser } from '../Auth/CurrentUserProvider'

export default function UserLayout() {

    // State
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    // Navigate
    const navigate = useNavigate()

    // useAuth
    const { session } = useAuth()
    const { currentUser } = useCurrentUser()

    // Effect
    useEffect(() => {
        if (error) {
            setError(null)
            navigate('/error')
        }
    }, [error])



    //Function
    async function handleLogout() {
        try {

            // Only allow to logout if there's a logged in session
            if (session) {
                setIsLoading(true)

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

    // Element
    const displayedElement = (
        <ProtectedRoute redirectPath='/signin'>
            <section className='user-sec'>
                <nav className='user-nav'>

                    {
                        currentUser?.role === 'admin'
                        &&
                        <NavLink
                            to="admin"
                            end
                            className={({ isActive }) => isActive ? "active-user-nav-btn user-nav-btn" : "user-nav-btn"}
                        >
                            Admin
                        </NavLink>
                    }

                    <NavLink
                        to=""
                        end
                        className={({ isActive }) => isActive ? "active-user-nav-btn user-nav-btn" : "user-nav-btn"}
                    >
                        Dashboard
                    </NavLink>

                    <NavLink
                        to="paddles"
                        className={({ isActive }) => isActive ? "active-user-nav-btn user-nav-btn" : "user-nav-btn"}
                    >
                        Your Paddles
                    </NavLink>

                    <NavLink
                        to="orders"
                        className={({ isActive }) => isActive ? "active-user-nav-btn user-nav-btn" : "user-nav-btn"}
                    >
                        Your Orders
                    </NavLink>

                    <NavLink
                        to="add"
                        className={({ isActive }) => isActive ? "active-user-nav-btn user-nav-btn" : "user-nav-btn"}
                    >
                        Add A Paddle
                    </NavLink>

                    <div
                        className='logout-div'
                        onClick={() => { handleLogout() }}
                    >
                        <ImExit />
                        Logout
                    </div>
                </nav>

                <Outlet />
            </section>

        </ProtectedRoute>
    )

    return (
        isLoading ?
            <Loading /> :
            displayedElement
    )
}