
import "./css/chatroom.css"
import { useParams, Navigate } from 'react-router'
import { useEffect, useState, useRef } from 'react'
import { supabase } from '../supabase/supabase-client'
import Error from '../Utils/Error'
import Loading from '../Utils/Loading'
import { useCurrentUser } from '../Auth/CurrentUserProvider'
import { IoSend } from "react-icons/io5";

export default function ChatRoom() {

    // state
    const [chatData, setChatData] = useState(undefined)
    const [orderData, setOrderData] = useState(undefined)
    const [error, setError] = useState(null)

    // Params
    const { orderId } = useParams()

    // currentUser
    const { currentUser } = useCurrentUser()


    // useRef
    const channel = useRef(null)
    const chatBox = useRef(null)

    // function
    async function fetchChatData() {
        try {
            const { data, error } = await supabase
                .from('messages')
                .select()
                .eq('order_id', orderId)
                .order('created_at', { ascending: true })

            if (error) {
                throw error
            }

            setChatData(data)
        }
        catch (error) {
            setError(error)
        }
    }

    async function fetchOrderData() {
        try {
            const { data, error } = await supabase
                .from('orders')
                .select(`
                    has_chatroom,
                    seller: users!orders_seller_id_fkey(name, id),
                    buyer: users!orders_buyer_id_fkey(name, id)
                `)
                .eq('id', orderId)

            if (error) {
                throw error
            }

            setOrderData(data)
        }
        catch (error) {
            setError(error)
        }
    }

    async function sendMessage(formData) {
        try {

            if(formData.get('chat-message') === ''){
                return
            }
            
            const { error } = await supabase
                .from('messages')
                .insert({
                    order_id: orderId,
                    sender_id: currentUser.id,
                    receiver_id: currentUser.id !== orderData[0].seller.id ? orderData[0].seller.id : orderData[0].buyer.id,
                    is_read: false,
                    message: formData.get('chat-message')
                })
        }
        catch (error) {
            setError(error)
        }
    }

    async function readMessage() {
        try {
            const { error } = await supabase
                .from('messages')
                .update({ is_read: true })
                .eq('order_id', orderId)
                .eq('is_read', false)
                .eq('receiver_id', currentUser.id)

            if (error) {
                throw error
            }
        }
        catch (error) {
            setError(error)
        }
    }

    //Effect - fetch initial chat data
    useEffect(() => {
        fetchOrderData()
        fetchChatData()
    }, [orderId])

    // Effect - subscribe to the database
    useEffect(() => {

        async function subscribeToMessages() {
            await supabase.realtime.setAuth()

            channel.current = supabase
                .channel(
                    `topic:${orderId}`,
                    {
                        config: { private: true }
                    }
                )
                .on(
                    'broadcast',
                    { event: '*' },
                    (payload) => fetchChatData()
                )
                .subscribe((status) => {
                    console.log(`[ChatRoom] Status of Channel ${orderId}: `, status)
                })
        }

        subscribeToMessages()


        return () => {

            if (channel.current) {
                channel.current.unsubscribe()
                channel.current = null
            }
        }

    }, [orderId])

    useEffect(() => {

        if (chatBox.current) {
            chatBox.current.scrollTop = chatBox.current.scrollHeight // scroll To the bottom 
            readMessage() // and set messages to be read
        }
    }, [chatData])

    // isLoading
    let isLoading = false
    if (chatData === undefined || orderData === undefined) {
        isLoading = true
    }



    // Displayed Element
    let displayedElement = ""
    if (currentUser && chatData && orderData) {

        if (currentUser.id !== orderData[0].seller.id && currentUser.id !== orderData[0].buyer.id) {
            return <Navigate to="/user/orders" />
        } else if (!orderData[0].has_chatroom) {
            return <Navigate to="/user/orders" />
        }

        const messages = chatData.map(data => {

            let messageSentBy = ''
            let messageAlign = ''
            if (data.sender_id === currentUser.id) {
                messageSentBy = 'sender'
                messageAlign = 'right'
            } else if (data.receiver_id === currentUser.id) {
                messageSentBy = 'receiver'
                messageAlign = 'left'
            }

            

            return (
                <div className={'message-box ' + messageSentBy} key={data.id}>
                    <span>{data.message}</span>
                    <span className={'message-date ' + messageAlign}>
                        {new Date(data.created_at).toISOString().split("T")[0]} {new Date(data.created_at).toLocaleTimeString()}
                        {
                            messageSentBy === 'sender' &&
                            <i className={"fa-solid fa-check-double " + (data.is_read && "is_read")}></i>
                        }
                    </span>
                    {
                        messageSentBy === 'sender' ?
                            <div className='arrow arrow-right'></div> :
                            <div className='arrow arrow-left'></div>
                    }

                </div>
            )
        })

        displayedElement = (
            <div className='chat-container'>

                <div className='chat-top-banner'>
                    Chatting with {
                        currentUser.id === orderData[0].buyer.id ?
                            orderData[0].seller.name :
                            orderData[0].buyer.name
                    }
                </div>

                <div className='chat-box' ref={chatBox}>
                    {messages}
                </div>

                <form className='chat-form' action={sendMessage}>
                    <div className='chat-entry'>
                        <textarea
                            name="chat-message"
                            id='chat-message'
                            className='message-area'
                        >
                        </textarea>
                        <button className='send-btn' type='submit'>
                            <IoSend className='send-icon' />
                        </button>
                    </div>
                </form>
            </div>
        )
    }




    return (
        <div className='chatbox-outer-div'>
            {
                error ?
                    <Error error={error} isFlexChild={true} /> :
                    isLoading ?
                        <Loading isUserChild={true} /> :
                        displayedElement
            }
        </div>
    )
}