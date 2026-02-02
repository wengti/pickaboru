import "../index.css"
import "./css/about.css"
import { NavLink } from 'react-router'

export default function About(){
    return (
        <section className='about-sec'>
            <div className='about-banner'>
                <img src="/images/about-banner.jpg"/>
            </div>

            <div className='about-text-div'>
                <span className='about-title'>
                    No More Blind Buys
                </span>
                <span className='about-text'>
                    Pickaboru is a community-driven platform that makes it easy to rent pickleball paddles from other players. 
                    Instead of committing to a paddle based on reviews alone, Pickaboru lets you try different paddles in real gameplay, 
                    helping you make better, more confident purchasing decisions.
                </span>
                <span className='about-text'>
                    Whether you’re new to pickleball or experimenting with different play styles, Pickaboru connects players who want to share gear with those looking to test before buying. 
                    By enabling simple, peer-to-peer paddle rentals, 
                    Pickaboru helps players save money, reduce waste, and get more out of the game.
                </span>
            </div>

            <div className='about-explore-div'>
                <span className='about-explore-text'>
                    Rent. <span className='about-highlight-text'>Play. </span>Decide.
                </span>
                <span className='about-explore-text'>
                    Your paddle is ready for rental.
                </span>
                
                <NavLink
                    to="/paddles"
                    className="btn about-explore-btn"
                >
                    Explore our paddles now
                </NavLink>
            </div>

        </section>
    )
}