import "./css/auth-form.css"
import { NavLink } from 'react-router'
import { useActionState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { supabase } from '../supabase/supabase-client'
import { useAuth } from './AuthProvider'
import Error from '../Utils/Error'
import Loading from '../Utils/Loading'
import { FaLinesLeaning } from 'react-icons/fa6'

export default function Signin() {

    // Define form action
    const [status, formAction, isPending] = useActionState(
        async (prevStatus, formData) => {
            try {

                const email = formData.get('email')
                const password = formData.get('password')
        
                const { data, error } = await supabase.auth.signInWithPassword({ email, password })
                if (error) {
                    return {error, submitted: false}
                }
                return {error: null, submitted: true}
            }
            catch (error) {
                return {error, submitted: false}
            }

        },
        {error: null, submitted: false}
    )

    // Navigate
    const navigate = useNavigate()

    // useAuth
    const {session, isFetchSessionAttempted} = useAuth()

    // Effect
    useEffect( () => {
        if((!status.error && status.submitted) || session){
            navigate("/paddles")
        }
    }, [status, session])

    // Derived flag from state
    let hasSessionAfterFetch = null // Pending state - Show Loading to wait for session to be fetched
    if(isFetchSessionAttempted && session) hasSessionAfterFetch = true // Redirect - Show Loading so useEffect can redirect afterwards
    else if(isFetchSessionAttempted && !session) hasSessionAfterFetch = false // Display this page - Confirm that there's no session currently

    //Defining elements
    const displayedElement = (
        <div className='auth-sec'>
            <div className='auth-inner-sec'>

                <div className='img-div'>
                    <img src='/images/auth-bg.jpg' />
                </div>

                <form className='auth-form' action={formAction}>
                    <span className='auth-form-title'>Sign in to your account</span>

                    <div className='form-input-div'>
                        <label
                            htmlFor='email'
                        >
                            Email:
                        </label>

                        <input
                            type='email'
                            id='email'
                            name='email'
                            className='form-input'
                            required
                            disabled={isPending}
                        />
                    </div>

                    <div className='form-input-div'>
                        <label
                            htmlFor='password'
                        >
                            Password:
                        </label>

                        <input
                            type='password'
                            id='password'
                            name='password'
                            className='form-input'
                            required
                            disabled={isPending}
                        />
                    </div>

                    <button
                        type='submit'
                        className='btn auth-form-btn'
                        disabled={isPending}
                    >
                        Sign in
                    </button>

                    <div className='hint'>
                        <span>Dont have an account yet? </span>
                        <NavLink
                            className='redirect'
                            to="/signup"
                        >
                            Sign up now
                        </NavLink>
                    </div>
                </form>
            </div>

        </div>
    )


    return (
        status.error ?
        <Error error={status.error}/> :
        (hasSessionAfterFetch === null || hasSessionAfterFetch) ?
        <Loading /> :
        displayedElement
    )
}