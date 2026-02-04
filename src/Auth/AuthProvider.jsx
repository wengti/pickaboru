
import "../Layout/css/layout.css"
import "./css/authprovider.css"
import { createContext, useState, useEffect, useContext } from 'react'
import { supabase } from '../supabase/supabase-client'
import Error from '../Utils/Error'


const AuthContext = createContext()

export function useAuth(){
    return useContext(AuthContext)
}

export default function AuthProvider({ children }) {

    const [error, setError] = useState(null)
    const [session, setSession] = useState(undefined)
    const [isFetchSessionAttempted, setIsFetchSessionAttempted] = useState(false)

    // Retrive a session
    useEffect( () => {

        async function fetchSession() {
            setIsFetchSessionAttempted(true)
            try{
                const {data, error} = await supabase.auth.getSession()
                if(error){
                    throw error
                }
                setError(null)
                setSession(data.session)
            }
            catch(err){
                setError(err)
            }
        }

        fetchSession()
    }, [])
    
    // Listen for auth event change
    useEffect( () => {
        const {data} = supabase.auth.onAuthStateChange( (_event, session) => {
            setSession(session)
        })

        return () => {data.subscription.unsubscribe()}
    }, [])

    // Displayed Element On Error
    const displayedElementOnError = (
        <div className='error-div'>
            <div className="error-div-top-row">
                <img className='logo-img-in-error' src="/images/mod-logo.png" />
                <span className='logo-text'>PICKABORU</span>
            </div>
            <h1>There's a problem in connecting to the application. Please contact the maintainer at wengti@hotmail.com</h1>
        </div>
    )

    return (
        error ?
        displayedElementOnError :
        <AuthContext value={ {session, isFetchSessionAttempted} }>
            {children}
        </AuthContext>
    )
}