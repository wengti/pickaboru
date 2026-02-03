
import "../index.css"
import "./css/paddledetail.css"
import Loading from '../Utils/Loading'
import Error from '../Utils/Error'
import NotFound from '../Utils/NotFound'
import { useState, useEffect } from 'react'
import { useParams, NavLink, useNavigate, useSearchParams } from 'react-router'
import { supabase } from '../supabase/supabase-client'
import { translation } from '../misc/translation'
import { IoMdArrowRoundBack } from "react-icons/io"

export default function PaddleDetail() {

    // State
    const [paddle, setPaddle] = useState(null)
    const [error, setError] = useState(null)

    // Params
    const { id } = useParams()

    // Navigate
    const navigate = useNavigate()

    // Effect
    useEffect(() => {

        async function fetchData() {
            try {
                const { data, error } = await supabase.from('items').select().eq('id', id)
                if (error) {
                    throw error
                }
                setError(null)
                setPaddle(data[0])
            }
            catch (err) {
                setError(err)
            }
        }
        fetchData()

    }, [])

    // Derived flag form state
    let hasError = false
    let isLoading = false
    let hasData = false

    if(error){
        hasError = true
    }
    else if (paddle === null) {
        isLoading = true
    }
    else if(!paddle){
        // Navigate to Not Found if no data
        hasData = false
        navigate('/notfound')

    }
    else if (Object.keys(paddle).length > 0) {
        hasData = true
    }

    

    // Back Element
    const backElement = (
        <NavLink
            to=".."
            relative="path"
        >
            <div className='back-div'>
                <IoMdArrowRoundBack className='back-arrow' />
                <span className='back-text'>
                    Back to all paddles
                </span>
            </div>
        </NavLink>
    )

    // The element to be displayed once hasData = true
    let displayedElement = ''
    if (hasData) {

        const paddleTypeClass = `paddle-type ${paddle.type[0].toLowerCase() + paddle.type.slice(1)}` 
        const paddleTypeJp = translation(paddle.type)

        displayedElement = (
            <div className='paddle-div'>
                <div className='paddle-img-div'>
                    <img src={paddle.img} />
                </div>
                <div className='paddle-detail-div'>
                    <div className='tag-div'>
                        <span className={paddleTypeClass}>{paddle.type} / {paddleTypeJp}</span>
                        <span className='paddle-brand'>{paddle.brand}</span>
                    </div>
                    <span className='paddle-name'>{paddle.name}</span>
                    <span className='paddle-owner'>Provided by: {paddle.owner}</span>
                    <span className='paddle-price'>MYR{paddle.price} per day</span>
                    <span className='paddle-desc'>{paddle.description}</span>
                    <NavLink className='btn'>
                        Rent this paddle
                    </NavLink>
                </div>
            </div>
        )
    }

    // Decide what to return
    return (
        <section className='paddle-detail-sec'>
            {backElement}
            {hasError && <Error error={error} isFlexChild={true}/>}
            {isLoading && <Loading />}
            {hasData && displayedElement}
        </section>
    )

}


// 