import "./css/dashboard.css"
import { supabase } from '../supabase/supabase-client'
import { useEffect, useState } from 'react'
import { useAuth } from '../Auth/AuthProvider'
import { useCurrentUser } from '../Auth/CurrentUserProvider'
import Error from '../Utils/Error'
import Loading from '../Utils/Loading'
import { data, Navigate } from 'react-router'
import Chart from './Chart'
import DashboardSummaryBox from './DashboardSummaryBox'
import DashboardCommentBox from './DashboardCommentBox'
import { IoIosHeartEmpty, IoMdHeart } from "react-icons/io";

export default function Dashboard() {


    // State
    const [error, setError] = useState(null)
    const [ordersData, setOrdersData] = useState(undefined)
    const [itemsData, setItemsData] = useState(undefined)

    // Auth
    const { session } = useAuth()

    // currentUser
    const { currentUser } = useCurrentUser() // initialized as undefined, if not authenticated, become null

    // function 
    async function fetchOrdersData() {
        try {
            const { data, error } = await supabase
                .from('orders')
                .select('*, reviews(*), buyer_data: users!orders_buyer_id_fkey(name), items(*)')
                .or(`buyer_id.eq.${currentUser?.id}, seller_id.eq.${currentUser?.id}`)
            if (error) {
                throw error
            }

            setOrdersData(data)

        }
        catch (error) {
            setError(error)
        }
    }

    async function fetchItemsData() {
        try {
            const { data, error } = await supabase
                .from('items')
                .select()
                .eq('user_id', currentUser?.id)
                .eq('status', 'listed')

            if (error) {
                throw error
            }

            setItemsData(data)

        }
        catch (error) {
            setError(error)
        }
    }

    // effect
    useEffect(() => {
        window.scrollTo(0, 0) // Scroll to top on first render
        fetchOrdersData()
        fetchItemsData()
    }, []
    )

    // Derived flag from state
    let isLoading = false

    if (currentUser === undefined || ordersData === undefined || itemsData === undefined) {
        isLoading = true
    }

    // Element
    let displayedElement = ""
    if (currentUser && ordersData && itemsData) {

        const numOfListedPaddles = itemsData.length

        const yourSalesData = ordersData.filter((data) => data.seller_id === currentUser.id)
        const yourOrdersData = ordersData.filter((data) => data.buyer_id === currentUser.id)

        const numOfSales = yourSalesData.length
        const numOfOrders = yourOrdersData.length

        const yourReviewsData = yourSalesData.filter((data) => data.is_reviewed)
        const numOfReviews = yourReviewsData.length
        const averageRating = ((yourReviewsData.reduce((accumulator, data) => accumulator + data.reviews[0]?.rating, 0)) / (numOfReviews > 0 ? numOfReviews : 1)).toFixed(2)

        const latestReview = yourReviewsData.at(-1)
        const bestReview = yourReviewsData.toSorted((a, b) => b.reviews[0].rating - a.reviews[0].rating)[0]

        displayedElement = (
            <section className='user-child-sec'>
                <h1 className='dashboard-welcome'> Welcome back, {currentUser.name}</h1>
                <div className='charts-rows'>
                    <div className='chart-row'>
                        <span className='chart-row-title'>Summary</span>
                        <div className='chart-inner-row'>
                            <DashboardSummaryBox title="Paddles"> {numOfListedPaddles} </DashboardSummaryBox>
                            <DashboardSummaryBox title="Sales"> {numOfSales} </DashboardSummaryBox>
                            <DashboardSummaryBox title="Orders"> {numOfOrders} </DashboardSummaryBox>
                            <DashboardSummaryBox title="Reviews"> {numOfReviews} </DashboardSummaryBox>
                            <DashboardSummaryBox title="Rating"> <IoMdHeart /> {averageRating ? averageRating : 0} </DashboardSummaryBox>
                        </div>
                    </div>

                    <div className='chart-row'>
                        <span className='chart-row-title'>Reviews</span>
                        <div className='chart-inner-row'>
                            {
                                numOfReviews > 0 
                                    ?
                                    <>
                                        <DashboardCommentBox reviewObj={bestReview} title="Best Review"></DashboardCommentBox>
                                        <DashboardCommentBox reviewObj={latestReview} title="Latest Review"></DashboardCommentBox>
                                    </> 
                                    :
                                    <span>You have not recevied any review.</span>
                            }

                        </div>
                    </div>

                    <Chart ordersData={ordersData} title="Transactions over last 6 months" />
                </div>
            </section>
        )
    }

    return (
        error ?
            <Error error={error} isUserChild={true} /> :
            isLoading ?
                <Loading isUserChild={true} /> :
                currentUser ?
                    displayedElement :
                    <Navigate to="/signin" />

    )
}

