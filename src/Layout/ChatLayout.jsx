
import './css/chatlayout.css'
import { useState, useEffect, useParams } from 'react'
import { useCurrentUser } from '../Auth/CurrentUserProvider'
import Loading from '../Utils/Loading'
import Error from '../Utils/Error'
import { Navigate, Outlet, NavLink } from 'react-router'
import { supabase } from '../supabase/supabase-client'
import { parseDateRangeAtMidnight } from '../misc/handleDate'
import UnreadMessage from '../Component/UnreadMessage'
import handleImgError from '../misc/handleImgError'

export default function ChatLayout() {

    // state
    const [orderData, setOrderData] = useState(undefined)
    const [error, setError] = useState(null)

    // currentUser
    const { currentUser } = useCurrentUser()

    // isLoading
    let isLoading = false
    if (currentUser === undefined || orderData === undefined) {
        isLoading = true
    }


    // function
    async function fetchOrderData() {
        try {
            const { data, error } = await supabase
                .from('orders')
                .select(`
                    *,
                    paddle: items(*),
                    seller: users!orders_seller_id_fkey(name),
                    buyer: users!orders_buyer_id_fkey(name)
                    )
                `)
                .eq('has_chatroom', true)
                .or(`seller_id.eq.${currentUser?.id}, buyer_id.eq.${currentUser?.id}`)
                .order('latest_chat', {ascending: false})
            if (error) {
                throw error
            }

            setOrderData(data)
        }
        catch (error) {
            setError(error)
        }
    }

    // Effect
    useEffect(() => {
        if(currentUser){
            fetchOrderData()
        } else {
            setOrderData(null)
        }
    }, [])


    // Main code after the data has been fetched
    let displayedElement = ""
    if (currentUser && orderData) {

        let chatSidebarEl = ""
        if (orderData.length > 0) {

            chatSidebarEl = orderData.map((data) => {

                let chatRoomType = ""
                let personName = ""

                if (data.buyer_id === currentUser.id) {
                    chatRoomType = "Rented by"
                    personName = data.seller.name
                }
                else if (data.seller_id === currentUser.id) {
                    chatRoomType = "Rent to"
                    personName = data.buyer.name
                }

                const paddleName = data.paddle.name
                const [rentStartDateObj, rentEndDateObj] = parseDateRangeAtMidnight(data.date_range)
                const rentStartDate = new Date(rentStartDateObj.setHours(8)).toISOString().split('T')[0]
                const rentEndDate = new Date(rentEndDateObj.setHours(8)).toISOString().split('T')[0]


                return (
                    <NavLink
                        to={`./${data.id}`}
                        key={data.id}
                        className={({ isActive }) => isActive ? 'active-chat chat-sidebar-child' : 'chat-sidebar-child'}
                    >
                        <div className='chat-sidebar-img-div'>
                            <img src={data.paddle.img} onError={(event) => handleImgError(event)}/>
                            <UnreadMessage order={data} />
                        </div>
                        <div className='chat-sidebar-child-right'>
                            <span className='chat-sidebar-child-seller'>{chatRoomType}</span>
                            <span className='chat-sidebar-child-seller'>{personName}</span>
                            <span>{paddleName}</span>
                            <span>{rentStartDate} to {rentEndDate}</span>
                        </div>
                    </NavLink>
                )
            })
        }
        else if (orderData.length === 0) {
            chatSidebarEl = (
                <NavLink className="redirect-to-paddles" to="/user/orders">
                    Start chatting now.
                </NavLink>
            )
        }

        displayedElement = (
            <section className='chat-layout chat-sec'>
                <div className='chat-sidebar'>
                    {chatSidebarEl}
                </div>
                <Outlet />
            </section>
        )
    }

    return (
        error ?
            <Error error={error} isUserChild={true} /> :
            isLoading ?
                <Loading isUserChild={true} /> :
                !currentUser ?
                    <Navigate to="/signin" /> :
                    displayedElement

    )
}

