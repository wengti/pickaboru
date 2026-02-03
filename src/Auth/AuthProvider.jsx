
import { createContext, useState, useEffect, useContext } from 'react'
import { supabase } from '../supabase/supabase-client'

const AuthContext = createContext()

export function useAuth(){
    return useContext(AuthContext)
}

export default function AuthProvider({ children }) {

    const [error, setError] = useState(null)
    const [session, setSession] = useState(null)
    const [isFetchSessionAttempted, setIsFetchSessionAttempted] = useState(false)
    console.log('The session object is: ', session)

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

    return (
        <AuthContext value={ {session, isFetchSessionAttempted} }>
            {children}
        </AuthContext>
    )
}