import "./css/auth-form.css"
import { NavLink } from 'react-router'
import { useActionState, useEffect } from 'react'
import { supabase } from '../supabase/supabase-client'
import Error from '../Utils/Error'
import ProtectedRoute from './ProtectedRoute'

export default function Signin() {

    // Define form action
    const [error, formAction, isPending] = useActionState(
        async (prevError, formData) => {
            try {

                const email = formData.get('email')
                const password = formData.get('password')
                
                const { data, error } = await supabase.auth.signInWithPassword({ email, password })
                if (error) {
                    return error
                }
                return null
            }
            catch (error) {
                return error
            }

        },
        null
    )

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

                    {
                        error &&
                        <span className='error-msg'>
                            {error.name}
                        </span>
                    }


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
        <ProtectedRoute
            redirectWithSession={true}
            redirectPath={"/paddles"}
        >
            {displayedElement}
        </ProtectedRoute>
    )
}