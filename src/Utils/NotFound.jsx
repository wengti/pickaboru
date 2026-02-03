import "../index.css"
import "./css/notfound.css"
import { NavLink } from 'react-router'

export default function NotFound({ isFlexChild = false }) {

    let displayClass = 'notFlexChild'
    if (isFlexChild) {
        displayClass = 'isFlexChild'
    }

    return (
        <div className={`not-found-div ${displayClass}`}>
            <span className='not-found-text'>
                Sorry, the page you were looking for was not found.
            </span>
            <NavLink
                to="/"
                className='btn not-found-btn'
            >
                Return to Home
            </NavLink>
        </div>
    )
}