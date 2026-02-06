
import "../index.css"
import "./css/paddledetail.css"
import Loading from '../Utils/Loading'
import Error from '../Utils/Error'
import NotFound from '../Utils/NotFound'
import { useState, useEffect } from 'react'
import { useParams, NavLink, useNavigate, useLocation } from 'react-router'
import { supabase } from '../supabase/supabase-client'
import { translation } from '../misc/translation'
import { IoMdArrowRoundBack } from "react-icons/io"
import handleImgError from '../misc/handleImgError'
import { useCurrentUser } from '../Auth/CurrentUserProvider'
import { useAuth } from '../Auth/AuthProvider'
import starDisplay from '../misc/starDisplay'
import PaddleReview from './PaddleReview'
import PaddleDescription from './PaddleDescription'

export default function PaddleDetail() {

    // State
    const [paddle, setPaddle] = useState(undefined)
    const [isFetchAttempted, setIsFetchAttempted] = useState(false)
    const [error, setError] = useState(null)

    // useCurrentUser
    const { currentUser } = useCurrentUser()
    const { session } = useAuth()

    // Params
    const { id } = useParams()

    // Navigate
    const navigate = useNavigate()

    // Location / query string
    const location = useLocation()
    const backQueryArr = location.state
    let backQueryStr = ""
    if (backQueryArr && backQueryArr.length > 0) {
        backQueryStr = "..?" + new URLSearchParams(backQueryArr).toString()
    }

    // Effect
    useEffect(() => {

        async function fetchData() {
            try {
                const { data, error } = await supabase
                    .from('items')
                    .select('id, name, type, brand, price, img, condition, description, users(name, location), orders(date_range)')
                    .eq('id', id)
                if (error) {
                    throw error
                }
                setError(null)
                setIsFetchAttempted(true)
                setPaddle(data)
            }
            catch (err) {
                setError(err)
            }
        }
        window.scrollTo(0,0)
        fetchData()

    }, [])


    // Derived flag form state
    let hasError = false
    let isLoading = false
    let noData = false
    let hasData = false

    if (error) {
        hasError = true
    }
    else if (paddle === undefined) {
        isLoading = true
    }
    else if (
        paddle.length === 0 ||  // No data is found
        (
            (paddle[0]?.status !== 'listed') && (currentUser.role !== 'admin') && (session?.user?.id !== paddle[0]?.user_id)
        ) // If the item is not listed and you are not admin nor you are the owner, you cannot see it
    ) {
        // Navigate to Not Found if no data using the effect below
        isLoading = true
        noData = true
    }
    else if (paddle.length > 0) {
        hasData = true
    }

    useEffect(() => {

        if (noData) {
            navigate('/notfound')
        }
    }, [noData])



    // Back Element
    const backElement = (
        <NavLink
            className='back-div-link'
            to={backQueryStr ? backQueryStr : ".."}
            relative="path"
        >
            <div className='back-div'>
                <IoMdArrowRoundBack className='back-arrow' />
                <span className='back-text'>
                    {backQueryStr ? "Back to filtered paddles" : "Back to all paddles"}
                </span>
            </div>
        </NavLink>
    )

    // The element to be displayed once hasData = true
    let displayedElement = ''
    if (hasData) {

        displayedElement = (
            <>
                <PaddleDescription paddleItem={paddle[0]}/>
                <PaddleReview paddleId={id}/>
            </>
        )
    }

    // Decide what to return
    return (
        <section className='paddle-detail-sec'>
            {backElement}
            {hasError && <Error error={error} isFlexChild={true} />}
            {isLoading && <Loading />}
            {hasData && displayedElement}
        </section>
    )

}

