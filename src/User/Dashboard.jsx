import "./css/dashboard.css"
import { supabase } from '../supabase/supabase-client'
import { useEffect, useState } from 'react'
import { useAuth } from '../Auth/AuthProvider'
import { useCurrentUser } from '../Auth/CurrentUserProvider'
import Error from '../Utils/Error'
import Loading from '../Utils/Loading'
import { Navigate } from 'react-router'


export default function Dashboard() {


    // State
    const [error, setError] = useState(null)

    // Auth
    const { session } = useAuth()

    // currentUser
    const { currentUser } = useCurrentUser() // initialized as undefined, if not authenticated, become null
    console.log(currentUser)

    // effect
    useEffect(() => {
        window.scrollTo(0, 0) // Scroll to top on first render
        }
        , []
    )

    // Derived flag from state
    let isLoading = false

    if (currentUser === undefined) {
        isLoading = true
    }

    // Element
    let displayedElement = ""
    if (currentUser) {
        displayedElement = (
            <section className='user-child-sec'>
                <h1> Welcome back, {currentUser.name}</h1>
            </section>
        )
    }

    return (
        error ?
            <Error error={error} isUserChild={true} /> :
            isLoading ?
                <Loading isUserChild={true} /> :
                currentUser ?
                    displayedElement :
                    <Navigate to="/signin" />

    )
}

