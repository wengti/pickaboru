import { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthProvider';
import { supabase } from '../supabase/supabase-client';
import Loading from '../Utils/Loading';

const CurrentUserContext = createContext()

export default function CurrentUserProvider({ children }) {

    // state
    const [currentUser, setCurrentUser] = useState(undefined)
    const [error, setError] = useState(null)

    // useAuth
    const { session } = useAuth()

    // useEffect
    useEffect(() => {
        async function fetchCurrentUser() {

            try {
                // When this component is loaded, it indicates that
                // session fetch has been attempted
                // Therefore if there's session it proceeds to grab the user's info
                // If there's no session, then proceeds to declare as null with no user
                // Therefore user no longer undefined, stop being in loading state
                if(session){
                    const { data, error } = await supabase
                        .from('users')
                        .select()
                        .eq('id', session?.user?.id)
    
                    if (error) {
                        throw error
                    }
                    setCurrentUser(data[0])
                } 
                else {
                    setCurrentUser(null)
                }
            }
            catch (error) {
                setError(error)
            }
        }
        fetchCurrentUser()

    }, [session])

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
            currentUser === undefined ?
                <Loading isAuthLevel={true} /> :
                <CurrentUserContext value={{ currentUser }}>
                    {children}
                </CurrentUserContext>
    )
}

export function useCurrentUser() {
    return useContext(CurrentUserContext)
}