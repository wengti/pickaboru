import "./css/auth-form.css"
import { NavLink } from 'react-router'
import ProtectedRoute from './ProtectedRoute'
import { useActionState } from 'react'
import { supabase } from '../supabase/supabase-client'
import { signupRedirect } from '../global'

export default function Signup() {

    // Form Action State
    const [status, formAction, isPending] = useActionState(

        async (prevStatus, formData) => {
            try {
                const name = formData.get('name')
                const email = formData.get('email')
                const password = formData.get('password')
                const location = formData.get('location')

                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        emailRedirectTo: signupRedirect,
                        data: {
                            name,
                            location
                        }

                    }
                })
                console.log(error)

                return { data, error }

            }
            catch (error) {
                return { data: null, error }
            }

        },
        { data: null, error: null }
    )

    // Elements
    const locationOptions = [
        "Johor", "Kedah", "Kelantan", "Kuala Lumpur",
        "Labuan", "Melaka", "Negeri Sembilan", "Pahang", "Perak",
        "Perlis", "Pulau Pinang", "Putrajaya", "Sabah", "Sarawak",
        "Selangor", "Terengganu"
    ]
    const locationOptionsEl = locationOptions.map(option => {
        return (
            <option value={option} key={option}>
                {option}
            </option>
        )
    })

    const displayedElement = (
        <div className='auth-sec'>
            <div className='auth-inner-sec'>
                <div className='img-div'>
                    <img src='/images/auth-bg-2.jpg' />
                </div>

                <form className='auth-form' action={formAction}>
                    <span className='auth-form-title'>Sign up to join us today!</span>

                    <div className='form-input-div'>
                        <label
                            htmlFor='name'
                        >
                            Name:
                        </label>

                        <input
                            type='text'
                            id='name'
                            name='name'
                            className='form-input'
                            required
                            disabled={isPending}
                        />
                    </div>

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

                    <div className='form-input-div'>
                        <label
                            htmlFor='location'
                        >
                            Based in:
                        </label>

                        <select
                            id='location'
                            name='location'
                            className='form-input'
                            defaultValue={'Kuala Lumpur'}
                            required
                            disabled={isPending}
                        >
                            {locationOptionsEl}
                        </select>
                    </div>

                    <button
                        type='submit'
                        className='btn auth-form-btn'
                    >
                        Sign up
                    </button>

                    {
                        status.error &&
                        <span className='error-msg'>
                            {status.error.name}
                        </span>
                    }

                    <div className='hint'>
                        <span>Already have an account? </span>
                        <NavLink
                            className='redirect'
                            to="/signin"
                        >
                            Sign in now
                        </NavLink>
                    </div>
                </form>
            </div>
        </div>
    )

    // After sign up before confirming via email
    // a user is returned, but the session remains null
    // Confirmation email is limited to 2-4 request per hrs, hence this feature is currently disabled
    // To enable: https://supabase.com/docs/reference/javascript/auth-signup
    // Need to specifically mention the redirect email in the signup function too
    const displayedElementAfterSignUp = (
        <div className='auth-sec'>
            <div className='signup-msg-div'>
                <span>
                    Please check your email (including junk) to verify your identity.
                </span>
                <NavLink
                    className='btn redirect-btn'
                    to="/signin"
                >
                    Proceed to sign in
                </NavLink>
            </div>
        </div>
    )

    return (
        <ProtectedRoute
            redirectWithSession={true}
            redirectPath={"/paddles"}
        >
            {
                status?.data?.user && status?.data?.session === null ?
                    displayedElementAfterSignUp :
                    displayedElement
            }
        </ProtectedRoute>
    )
}

