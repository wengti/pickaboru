import "./css/yourpaddles.css"
import { useEffect, useState, useRef } from 'react'
import { NavLink } from 'react-router'
import { supabase } from '../supabase/supabase-client'
import Loading from '../Utils/Loading'
import Error from '../Utils/Error'
import AdminProtectedRoute from '../Auth/AdminProtectedRoute'
import { FaEye } from "react-icons/fa"
import handleImgError from '../misc/handleImgError'

export default function Admin() {

    // State
    const [paddlesData, setPaddlesData] = useState(undefined)
    const [error, setError] = useState(null)

    // Ref
    const textareaRef = useRef({})
    const errorMsgRef = useRef({})

    // Function
    async function fetchPaddlesData() {
        try {
            setPaddlesData(undefined)
            const { data, error } = await supabase
                .from('items')
                .select(`*, users(name)`)
                .eq('status', 'submitted')
            if (error) {
                throw error
            }
            console.log(data)

            setError(null)
            setPaddlesData(data)
        }
        catch (error) {
            setError(error)
        }
    }

    async function handleReview(action, paddleId){
        
        try{
            let feedbackVal = textareaRef.current[paddleId].value
            if (feedbackVal === "" && action === 'reject'){
                errorMsgRef.current[paddleId].textContent = 'There must be feedbacks on rejection.'
                return
            }

            let updatedStatus = ""
            if(action ==='list') updatedStatus = 'listed'
            else if(action === 'reject') updatedStatus = 'rejected'

            const {error} = await supabase
                .from('items')
                .update({status: updatedStatus, feedback: feedbackVal})
                .eq('id', paddleId)
            
            if(error){
                throw error
            }

            fetchPaddlesData()

        }
        catch(error){
            errorMsgRef.current[paddleId].textContent = `${error.name}: ${error.message}`
            setError(null) // This is an exception so that we can see the error under the textarea
        }

    }


    // Effect
    useEffect(() => {
        window.scrollTo(0,0)
        fetchPaddlesData()
    }, [])

    // Element
    let displayedElement = ""
    if (paddlesData) {

        function showPaddles() {
            const paddles = paddlesData

            let paddleCard = (
                paddles.map((paddle) => {
                    const dateObj = new Date(paddle.created_at)

                    let eyeIcon = (
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


                    return (
                        <div key={paddle.id} className='admin-inner-div'>
                            <div className={'paddle-overview-card submitted'}>
                                <div className='paddle-overview-img-div' >
                                    <img src={paddle.img} onError={(event) => { handleImgError(event) }} />
                                </div >
                                <div className='paddle-overview-desc-div'>
                                    <span className='paddle-overview-title'>
                                        {paddle.name}
                                    </span>
                                    <span className='paddle-overview-time'>
                                        Created by {paddle.users.name} <br /> at {dateObj.toLocaleString()}
                                    </span>
                                </div>
                                <div className='icon-div'>
                                    {eyeIcon}
                                </div>
                            </div>
                            <div className='feedback-form'>
                                <label className='feedback-title'>Feedback to the owner: </label>
                                <div className='feedback-div'>
                                    <textarea
                                        maxLength="100"
                                        placeholder="i.e. Please provide a proper image link"
                                        ref={
                                            (node) => {
                                                textareaRef.current[paddle.id] = node
                                                return () => {delete textareaRef.current[paddle.id]}
                                            }
                                        }
                                    >
                                    </textarea>
                                    <div className='feedback-btn-div'>
                                        <button className='feedback-list-btn' onClick={()=>{handleReview('list', paddle.id)}}>List</button>
                                        <button className='feedback-reject-btn' onClick={()=>{handleReview('reject', paddle.id)}}>Reject</button>
                                    </div>
                                </div>
                                
                                <span 
                                    className='feedback-error' 
                                    ref = {(node) => {
                                        errorMsgRef.current[paddle.id] = node
                                        return () => {delete errorMsgRef.current[paddle.id]}
                                    }}>
                                </span>
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
                    <span className='sub-div-title'>Paddles to be reviewed</span>
                    {paddlesEl}
                </div>
            )
        }




        displayedElement = (
            <section className="user-child-sec your-paddles-sec">
                {showPaddles()}
            </section>
        )
    }

    return (

        <AdminProtectedRoute>
            {
                error ?
                    <Error error={error} isUserChild={true} /> :
                    paddlesData === undefined ?
                        <Loading isUserChild={true} /> :
                        displayedElement
            }
        </AdminProtectedRoute>
    )
}