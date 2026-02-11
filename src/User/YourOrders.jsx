
import "./css/yourpaddles.css"
import { useEffect, useState, useRef } from 'react'
import { useCurrentUser } from '../Auth/CurrentUserProvider'
import { supabase } from '../supabase/supabase-client'
import { getDateAtMidnight, parseDateRangeAtMidnight } from '../misc/handleDate'
import { NavLink, useNavigate } from 'react-router'
import Loading from '../Utils/Loading'
import Error from '../Utils/Error'
import { FaEye } from "react-icons/fa"
import { IoChatboxEllipses } from "react-icons/io5";
import ReviewForm from './ReviewForm'
import handleImgError from '../misc/handleImgError'

export default function YourOrders() {

    //state
    const [ordersData, setOrdersData] = useState(undefined)
    const [error, setError] = useState(null)

    // current user
    const { currentUser } = useCurrentUser()

    // navigate
    const navigate = useNavigate()

    // Function
    async function fetchOrdersData() {
        try {
            setOrdersData(undefined)
            const { data, error } = await supabase
                .from('orders')
                .select(`
                    *,
                    paddle_data: items(*), 
                    seller_data: users!orders_seller_id_fkey(name)
                    `
                ) // paddle and seller are both an object
                .eq('buyer_id', currentUser?.id)
                .order('date_range', { ascending: false })
            if (error) {
                throw error
            }


            setError(null)
            setOrdersData(data)
        }
        catch (error) {
            setError(error)
        }
    }

    async function handleChat(order) {
        try {
            if (!order.has_chatroom) {
                const { error } = await supabase
                    .from('orders')
                    .update({ has_chatroom: true })
                    .eq('id', order.id)
    
                if (error) {
                    throw (error)
                }
            }

            navigate(`/chat/${order.id}`)
        }
        catch (error) {
            setError(error)
        }
    }


    // Effect
    useEffect(() => {
        window.scrollTo(0, 0)
        fetchOrdersData()
    }, [])

    // Element
    let displayedElement = ""
    if (ordersData) {

        // Separate filter based on date
        const today = getDateAtMidnight(new Date())
        const ongoingOrders = []
        const pastOrders = []
        const futureOrders = []
        ordersData.forEach((order, idx) => {
            const [orderStartDate, orderEndDate] = parseDateRangeAtMidnight(order?.date_range)
            if (today >= orderStartDate && today <= orderEndDate) { ongoingOrders.push(order) }
            else if (today > orderEndDate) { pastOrders.push(order) }
            else if (today < orderStartDate) { futureOrders.push(order) }
        })


        // Function to show a whole section
        function showPaddles(orders, title, isCompleted = false) {

            let orderCard = (
                orders.map((order) => {
                    const { paddle_data: paddle, seller_data: seller } = order

                    const [startDate, endDate] = parseDateRangeAtMidnight(order.date_range)
                    const formattedStartDate = startDate.toLocaleString('en-GB', { dateStyle: 'medium' })
                    const formattedEndDate = endDate.toLocaleString('en-GB', { dateStyle: 'medium' })

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

                    let chatIcon = (
                        <div className='icon-inner-div view'>
                            <div
                                onClick={() => { handleChat(order) }}
                                className='paddle-card-icon'
                            >
                                <IoChatboxEllipses />
                            </div>
                            <div className='paddle-hint-div view-hint'>Chat</div>
                        </div>
                    )

                    return (
                        <div key={order.id} className='admin-inner-div'>
                            <div className={'paddle-overview-card submitted'}>
                                <div className='paddle-overview-img-div' >
                                    <img src={paddle.img} onError={(event) => { handleImgError(event) }} />
                                </div >
                                <div className='paddle-overview-desc-div'>
                                    <span className='paddle-overview-title'>
                                        {paddle.brand} {paddle.name}
                                    </span>
                                    <span className='sales-made'>
                                        Spend: MYR {order.values}
                                    </span>
                                    <span className='paddle-overview-time'>
                                        Owned by {seller.name} <br /> Rented from {formattedStartDate} to {formattedEndDate}
                                    </span>
                                </div>
                                <div className='icon-div'>
                                    {chatIcon}
                                    {eyeIcon}
                                </div>
                            </div>

                            {(isCompleted && order.is_reviewed === false) && <ReviewForm paddle={paddle} order={order} />}

                        </div>
                    )
                })
            )


            const paddlesEl = (
                orders.length > 0 ?
                    orderCard :
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
                    <span className='sub-div-title'>{title}</span>
                    {paddlesEl}
                </div>
            )
        }




        displayedElement = (
            <section className="user-child-sec your-paddles-sec">
                {showPaddles(futureOrders, "Orders to be fulfilled")}
                {showPaddles(pastOrders, "Completed order", true)}
                {showPaddles(ongoingOrders, "Ongoing orders")}
            </section>
        )
    }

    return (
        error ?
            <Error error={error} isUserChild={true} /> :
            ordersData === undefined ?
                <Loading isUserChild={true} /> :
                displayedElement
    )

}