import "./css/dashboard.css"
import { supabase } from '../supabase/supabase-client'
import { useEffect, useState } from 'react'
import { useAuth } from '../Auth/AuthProvider'
import Error from '../Utils/Error'
import Loading from '../Utils/Loading'


export default function Dashboard() {


    // State
    const [error, setError] = useState(null)
    const [userData, setUserData] = useState(undefined)

    // Auth
    const { session } = useAuth()

    // effect
    useEffect(() => {
        async function fetchUserData() {
            try {
                const { data, error } = await supabase
                    .from('users')
                    .select()
                    .eq('id', session?.user?.id)
                if (error) {
                    throw error
                }
                setUserData(data[0])
            }
            catch (error) {
                setError(error)
            }
        }
        
        window.scrollTo(0,0) // Scroll to top on first render
        fetchUserData()
    }, [])

    // Derived flag from state
    let isLoading = true
    if(userData !== undefined){
        isLoading = false
    }

    // Element
    let displayedElement = ""
    if(!error && !isLoading){
        displayedElement = (
            <section className='user-child-sec'>
                <h1> Welcome back, {userData.name}</h1>
            </section>
        )
    }

    return (
        error ?
        <Error error={error} isUserChild={true}/> :
        isLoading ?
        <Loading isUserChild={true}/> :
        displayedElement

    )
}

