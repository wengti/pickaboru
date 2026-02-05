
import "../index.css"
import "./css/paddledetail.css"
import Loading from '../Utils/Loading'
import Error from '../Utils/Error'
import NotFound from '../Utils/NotFound'
import { useState, useEffect} from 'react'
import { useParams, NavLink, useNavigate, useLocation} from 'react-router'
import { supabase } from '../supabase/supabase-client'
import { translation } from '../misc/translation'
import { IoMdArrowRoundBack } from "react-icons/io"
import handleImgError from '../misc/handleImgError'

export default function PaddleDetail() {

    // State
    const [paddle, setPaddle] = useState(undefined)
    const [isFetchAttempted, setIsFetchAttempted] =useState(false)
    const [error, setError] = useState(null)


    // Params
    const { id } = useParams()

    // Navigate
    const navigate = useNavigate()

    // Location / query string
    const location = useLocation()
    const backQueryArr = location.state
    let backQueryStr = ""
    if (backQueryArr && backQueryArr.length > 0){
        backQueryStr = "..?" + new URLSearchParams(backQueryArr).toString()
    }

    // Effect
    useEffect(() => {

        async function fetchData() {
            try {
                const { data, error } = await supabase.from('items').select().eq('id', id)
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
        fetchData()

    }, [])


    // Derived flag form state
    let hasError = false
    let isLoading = false
    let noData = false
    let hasData = false

    if(error){
        hasError = true
    }
    else if (paddle === undefined) {
        isLoading = true
    }
    else if(paddle.length === 0 || paddle[0].status !== 'listed'){
        // Navigate to Not Found if no data using the effect below
        noData = true
    }
    else if (paddle.length > 0) {
        hasData = true
    }

    useEffect( () => {

        if(noData){
            navigate('/notfound')
        }
    }, [noData])

    

    // Back Element
    const backElement = (
        <NavLink
            className='back-div-link'
            to={ backQueryStr ? backQueryStr : ".."}
            relative="path"
        >
            <div className='back-div'>
                <IoMdArrowRoundBack className='back-arrow' />
                <span className='back-text'>
                    { backQueryStr ? "Back to filtered paddles" : "Back to all paddles"}
                </span>
            </div>
        </NavLink>
    )

    // The element to be displayed once hasData = true
    let displayedElement = ''
    if (hasData) {

        let paddleItem = paddle[0]

        const paddleTypeClass = `paddle-type ${paddleItem.type[0].toLowerCase() + paddleItem.type.slice(1)}` 
        const paddleTypeJp = translation(paddleItem.type)

        displayedElement = (
            <div className='paddle-div'>
                <div className='paddle-img-div'>
                    <img src={paddleItem.img} onError={(event) => {handleImgError(event)}} />
                </div>
                <div className='paddle-detail-div'>
                    <div className='tag-div'>
                        <span className={paddleTypeClass}>{paddleItem.type} / {paddleTypeJp}</span>
                        <span className='paddle-brand'>{paddleItem.brand}</span>
                    </div>
                    <span className='paddle-name'>{paddleItem.name}</span>
                    <span className='paddle-owner'>Provided by: {paddleItem.owner}</span>
                    <span className='paddle-price'>MYR{paddleItem.price} per day</span>
                    <span className='paddle-desc'>{paddleItem.description}</span>
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

