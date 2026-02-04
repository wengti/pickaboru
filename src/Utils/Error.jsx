import "../index.css"
import "./css/error.css"
import { NavLink } from 'react-router'

export default function Error({error={name:'Unknown', message:'Unknown'}, isFlexChild=false ,isUserChild=false}) {
    return (
        <div className={'error-div ' + (isFlexChild ? 'isFlexChild ' : 'isNotFlexChild ') + (isUserChild ? "isUserChild" : "") }>
            <span className='error-text'> There's an error with your request. </span>
            <span className='error-text'>{error.name && `${error.name}:`} {error.message}</span>
            <NavLink
                to="/"
                className='btn error-btn'
            >
                Return to Home
            </NavLink>
        </div>
    )
}