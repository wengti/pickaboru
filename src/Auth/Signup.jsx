import "./css/auth-form.css"
import { NavLink } from 'react-router'

export default function Signup() {

    const locationOptions = [
        "Johor", "Kedah", "Kelantan", "Kuala Lumpur", 
        "Labuan", "Melaka", "Negeri Sembilan", "Pahang", "Perak", 
        "Perlis", "Pulau Pinang", "Putrajaya", "Sabah", "Sarawak", 
        "Selangor", "Terengganu"
    ]
    const locationOptionsEl = locationOptions.map( option => {
        return(
            <option value={option} key={option} selected={option === 'Kuala Lumpur' && true}>
                {option}
            </option>
        )
    })

    return (
        <div className='auth-sec'>
            <div className='auth-inner-sec'>

                <div className='img-div'>
                    <img src='/images/auth-bg-2.jpg' />
                </div>

                <form className='auth-form'>
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
                            required
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
}