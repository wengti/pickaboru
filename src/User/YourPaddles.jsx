import "./css/yourpaddles.css"
import { useState, useEffect } from 'react'
import { useAuth } from '../Auth/AuthProvider'
import Loading from '../Utils/Loading'
import { supabase } from '../supabase/supabase-client'
import { NavLink } from 'react-router'

export default function YourPaddles() {

    // State
    const [paddlesData, setPaddlesData] = useState(undefined)
    const [error, setError] = useState(null)

    // useAuth
    const { session } = useAuth()

    // Effect
    useEffect(() => {
        async function fetchPaddlesData() {
            try {
                const { data, error } = await supabase
                    .from('items')
                    .select()
                    .eq('user_id', session?.user?.id)
                if (error) {
                    throw error
                }
                setError(null)
                setPaddlesData(data)
            }
            catch (error) {
                setError(error)
            }
        }
        fetchPaddlesData()
    }, [])

    // Derived flag from state
    let isLoading = false
    if (paddlesData === undefined) {
        isLoading = true
    }

    let displayedElement = ""
    if (paddlesData) {

        function showPaddles(enquiry) {
            const paddles = paddlesData.filter(
                ({ status, user_id }) => status === enquiry && user_id === session?.user?.id
            )

            const paddlesEl = (
                paddles.length > 0
                    ?
                    paddles.map((paddle) => {
                        const dateObj = new Date(paddle.created_at)
                        return (
                            <div className={'paddle-overview-card ' + enquiry } key={paddle.id}>
                                <div className='paddle-overview-img-div' >
                                    <img src={paddle.img} />
                                </div >
                                <div className='paddle-overview-desc-div'>
                                    <span className='paddle-overview-title'>
                                        {paddle.name}
                                    </span>
                                    <span className='paddle-overview-time'>
                                        Created at {dateObj.toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        )
                    })
                    :
                    <NavLink
                        className="list-paddle-btn"
                        to="../add"
                        relative='path'
                    >
                        List a paddle now
                    </NavLink>
            )

            return (
                <div className='your-paddles-sub-div'>
                    <span className='sub-div-title'>Your {enquiry[0].toUpperCase() + enquiry.slice(1)} Paddles</span>
                    {paddlesEl}
                </div>
            )
        }




        displayedElement = (
            <section className="user-child-sec your-paddles-sec">
                {showPaddles('listed')}
                {showPaddles('submitted')}
                {showPaddles('rejected')}
            </section>
        )
    }

    return (
        error ?
            <Error error={error} isUserChild={true} /> :
            isLoading ?
                <Loading isUserChild={true} /> :
                displayedElement
    )
}