import "./css/auth-form.css"
import { NavLink } from 'react-router'

export default function Signin() {
    return (

        <div className='auth-sec'>
            <div className='auth-inner-sec'>

                <div className='img-div'>
                    <img src='/images/auth-bg.jpg' />
                </div>

                <form className='auth-form'>
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
                        />
                    </div>

                    <button
                        type='submit'
                        className='btn auth-form-btn'
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
}