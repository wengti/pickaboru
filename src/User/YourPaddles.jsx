import "./css/yourpaddles.css"
import { useState, useEffect } from 'react'
import { useAuth } from '../Auth/AuthProvider'
import Loading from '../Utils/Loading'
import { supabase } from '../supabase/supabase-client'
import { NavLink } from 'react-router'
import handleImgError from '../misc/handleImgError'
import { FaEye } from "react-icons/fa"
import { FaEdit } from "react-icons/fa"
import { AiFillDelete } from "react-icons/ai"
import { IoAddCircle } from "react-icons/io5"
import { IoRemoveCircle } from "react-icons/io5"

export default function YourPaddles() {

    // State
    const [paddlesData, setPaddlesData] = useState(undefined)
    const [error, setError] = useState(null)

    // useAuth
    const { session } = useAuth()

    // Functions

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

    async function updateStatus(paddleId, status) {
        try {
            const { error } = await supabase
                .from('items')
                .update({ status })
                .eq('id', paddleId)
            if (error) {
                throw error
            }
            await fetchPaddlesData()
        }
        catch (error) {
            setError(error)
        }
    }

    // Effect
    useEffect(() => {
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
                ({ status, user_id }) => status === enquiry && user_id === session?.user?.id // Ensuring that only fetch your own data
            )

            let paddleCard = (
                paddles.map((paddle) => {
                    const dateObj = new Date(paddle.created_at)

                    let eyeIcon = ""
                    if (paddle.status === 'listed') {
                        eyeIcon = (
                            <div className='icon-inner-div view'>
                                <NavLink
                                    to={`/paddles/${paddle.id}`}
                                    className='paddle-card-icon'
                                >
                                    <FaEye />
                                </NavLink>
                                <div className='paddle-hint-div view-hint'>View</div>
                            </div>
                        )
                    }

                    let minusIcon = ""
                    if (paddle.status === 'listed') {
                        minusIcon = (
                            <div className='icon-inner-div unlist'>
                                <IoRemoveCircle
                                    className='paddle-card-icon'
                                    onClick={() => { updateStatus(paddle.id, 'submitted') }}
                                />
                                <div className='paddle-hint-div unlist-hint'>Unllist</div>
                            </div>
                        )
                    }

                    let addIcon = ""
                    if (paddle.status === 'unlisted') {
                        addIcon = (
                            <div className='icon-inner-div submit'>
                                <IoAddCircle
                                    className='paddle-card-icon'
                                    onClick={() => { updateStatus(paddle.id, 'submitted') }}
                                />
                                <div className='paddle-hint-div submit-hint'>Submit</div>
                            </div>
                        )
                    }

                    let editIcon = ""
                    if (paddle.status !== 'submitted') {
                        editIcon = (
                            <div className='icon-inner-div edit'>
                                <NavLink
                                    to={`/`}
                                    className='paddle-card-icon'
                                >
                                    <FaEdit />
                                </NavLink>
                                <div className='paddle-hint-div edit-hint'>Edit</div>
                            </div>
                        )
                    }

                    let delIcon = ""
                    if (paddle.status === 'rejected') {
                        delIcon = (
                            <div className='icon-inner-div del'>
                                <AiFillDelete
                                    className='paddle-card-icon'
                                />
                                <div className='paddle-hint-div del-hint'>Delete</div>
                            </div>
                        )
                    }

                    return (
                        <div className={'paddle-overview-card ' + enquiry} key={paddle.id}>
                            <div className='paddle-overview-img-div' >
                                <img src={paddle.img} onError={(event) => { handleImgError(event) }} />
                            </div >
                            <div className='paddle-overview-desc-div'>
                                <span className='paddle-overview-title'>
                                    {paddle.name}
                                </span>
                                <span className='paddle-overview-time'>
                                    Created at {dateObj.toLocaleString()}
                                </span>
                            </div>
                            <div className='icon-div'>

                                {paddle.status !== 'submitted' && editIcon}
                                {paddle.status === 'listed' && minusIcon}
                                {paddle.status === 'listed' && eyeIcon}
                                {paddle.status === 'unlisted' && addIcon}
                                {paddle.status === 'rejected' && delIcon}
                            </div>
                        </div>
                    )
                })
            )


            const paddlesEl = (
                paddles.length > 0 ?
                    paddleCard :
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
                {showPaddles('unlisted')}
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