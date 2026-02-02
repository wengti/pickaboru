import "../index.css"
import "./css/home.css"
import {NavLink} from 'react-router'

export default function Home(){
    return (
        <section className='home-sec'>
            <span className='large-text-grp'>
                <span className='large-text'>RENT</span>
                <span className='highlight-text'>PLAY</span>
                <span className='large-text'>DECIDE</span>
            </span>
            <span className='small-text'>Rent pickleball paddles from the community and play with confidence before committing.</span>
            <NavLink 
                className='btn home-btn'
                to="/paddles">
                Get started!
            </NavLink>
        </section>
    )
}