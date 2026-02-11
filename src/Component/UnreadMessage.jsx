import "./css/unreadmessage.css"
import { useState, useEffect, useRef } from 'react'
import { supabase } from '../supabase/supabase-client'
import { useAuth } from '../Auth/AuthProvider'
import { useCurrentUser } from '../Auth/CurrentUserProvider'

export default function UnreadMessage({ order = null }) {

    // state
    const [numOfUnread, setNumOfUnread] = useState(0)
    const [error, setError] = useState(null)
    

    // ref
    const channel = useRef(null)

    // currentUser
    const { session } = useAuth()
    const { currentUser } = useCurrentUser()

    // function - fetch number of unread message
    async function fetchNumOfUnread() {

        try {
            if (order) {

                const { data, error } = await supabase
                    .from('messages')
                    .select()
                    .eq('order_id', order.id)
                    .eq('receiver_id', currentUser.id)
                    .eq('is_read', false)
                if (error) {
                    throw error
                }
                setNumOfUnread(data.length)
            }
            else {
                const { data, error } = await supabase
                    .from('messages')
                    .select()
                    .eq('receiver_id', session.user.id)
                    .eq('is_read', false)
                
                if (error) {
                    throw error
                }
                setNumOfUnread(data.length)
            }

        }
        catch (error) {
            setError(error)
        }
    }

    // effect
    useEffect(() => {
        fetchNumOfUnread()
    }, [])

    // Effect - subscribe to the database
    useEffect(() => {

        async function subscribeToUnreadMessages() {
            await supabase.realtime.setAuth()

            const channelName = order ? `sidebar:${order.id}` : `overall-message`

            channel.current = supabase
                .channel(
                    channelName,
                    {
                        config: { private: true }
                    }
                )
                .on(
                    'broadcast',
                    { event: '*' },
                    (payload) => fetchNumOfUnread()
                )
                .subscribe((status) => {
                    if(order){
                        console.log(`[Sidebar] Status of Channel ${order.id}: `, status)
                    }
                    else {
                        console.log(`[Overall] Status of Channel: `, status)
                    }
                })
        }

        subscribeToUnreadMessages()


        return () => {

            if (channel.current) {
                channel.current.unsubscribe()
                channel.current = null
            }
        }
    }, [])

    const displayedElement = (
        <div className={order ? 'red-circle' : 'red-circle header-circle'}>
            {error ?
                `!` :
                numOfUnread > 9 ?
                    `9+` :
                    numOfUnread
            }
        </div>
    )

    return (
        (numOfUnread > 0 || error) ?
            displayedElement :
            null
    )
}