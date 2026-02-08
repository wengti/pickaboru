
import "./css/yourpaddles.css"
import { useEffect, useState, useRef } from 'react'
import { useCurrentUser } from '../Auth/CurrentUserProvider'
import { supabase } from '../supabase/supabase-client'
import { getDateAtMidnight, parseDateRangeAtMidnight } from '../misc/handleDate'
import { NavLink } from 'react-router'
import Loading from '../Utils/Loading'
import Error from '../Utils/Error'
import { FaEye } from "react-icons/fa"
import ReviewForm from './ReviewForm'
import { SdCardAlertOutlined } from '@mui/icons-material'

export default function YourSales() {
    //state
    const [salesData, setSalesData] = useState(undefined)
    const [error, setError] = useState(null)

    // current user
    const { currentUser } = useCurrentUser()

    // Function
    async function fetchSalesData() {
        try {
            setSalesData(undefined)
            const { data, error } = await supabase
                .from('orders')
                .select(`
                        *,
                        paddle_data: items(*), 
                        buyer_data: users!orders_buyer_id_fkey(name)
                        `
                ) // paddle and buyer are both an object
                .eq('seller_id', currentUser?.id)
                .order('date_range', { ascending: false })
            if (error) {
                throw error
            }


            setError(null)
            setSalesData(data)
        }
        catch (error) {
            setError(error)
        }
    }


    // Effect
    useEffect(() => {
        window.scrollTo(0, 0)
        fetchSalesData()
    }, [])

    // Element
    let displayedElement = ""
    if (salesData) {

        // Separate filter based on date
        const today = getDateAtMidnight(new Date())
        const ongoingSales = []
        const pastSales = []
        const futureSales = []
        salesData.forEach((sale, idx) => {
            const [saleStartDate, saleEndDate] = parseDateRangeAtMidnight(sale?.date_range)
            if (today >= saleStartDate && today <= saleEndDate) { ongoingSales.push(sale) }
            else if (today > saleEndDate) { pastSales.push(sale) }
            else if (today < saleStartDate) { futureSales.push(sale) }
        })


        // Function to show a whole section
        function showPaddles(sales, title, isCompleted = false) {

            let saleCard = (
                sales.map((sale) => {
                    const { paddle_data: paddle, buyer_data: buyer} = sale

                    const [startDate, endDate] = parseDateRangeAtMidnight(sale.date_range)
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

                    return (
                        <div key={sale.id} className='admin-inner-div'>
                            <div className={'paddle-overview-card submitted'}>
                                <div className='paddle-overview-img-div' >
                                    <img src={paddle.img} onError={(event) => { handleImgError(event) }} />
                                </div >
                                <div className='paddle-overview-desc-div'>
                                    <span className='paddle-overview-title'>
                                        {paddle.brand} {paddle.name}
                                    </span>
                                    <span className='sales-made'>
                                        Sales made: MYR {sale.values}
                                    </span>
                                    <span className='paddle-overview-time'>
                                        Booked by {buyer.name} <br /> Rented from {formattedStartDate} to {formattedEndDate}
                                    </span>
                                </div>
                                <div className='icon-div'>
                                    {eyeIcon}
                                </div>
                            </div>

                        </div>
                    )
                })
            )


            const paddlesEl = (
                sales.length > 0 ?
                    saleCard :
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
                {showPaddles(futureSales, "Sales to be completed")}
                {showPaddles(pastSales, "Completed sales")}
                {showPaddles(ongoingSales, "Ongoing sales")}
            </section>
        )
    }

    return (
        error ?
            <Error error={error} isUserChild={true} /> :
            salesData === undefined ?
                <Loading isUserChild={true} /> :
                displayedElement
    )
}