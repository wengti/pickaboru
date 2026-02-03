import "../index.css"
import "./css/paddles.css"
import { supabase } from '../supabase/supabase-client'
import { translation } from '../misc/translation'
import { NavLink, useSearchParams } from 'react-router'
import { useState, useEffect } from 'react'
import Loading from '../Utils/Loading'
import Error from '../Utils/Error'
import NotFound from '../Utils/NotFound'
import PaddleFilter from '../Component/PaddleFilter'
import { useAuth } from '../Auth/AuthProvider'


export default function Paddles() {
    
    // State
    const [data, setData] = useState(null)
    const [error, setError] = useState(null)

    // Search Params
    const [searchParams, setSearchParams] = useSearchParams()

    // useContext
    const {session} = useAuth()

    // Effect
    useEffect(() => {

        async function fetchData() {
            try {
                const { data: fetchedData, error } = await supabase
                    .from('items')
                    .select('id, name, owner, type, brand, price, img')
                    .order('id', { ascending: false })
                if (error) {
                    throw error
                }
                setError(null)
                setData(fetchedData)
            }
            catch (err) {
                setError(err)
            }
        }

        fetchData()

    }, [])

    // Derived variable from state
    let displayedData = data
    let filteredData = data
    let sortedData = []

    // Derived flag from state
    let isLoading = false
    let hasError = false
    let hasData = false
    let hasNoResult = false

    if (error) {
        hasError = true
    }
    else if (data === null) {
        isLoading = true
    }
    else if (data?.length > 0) {
        hasData = true

        // Apply filter
        if (searchParams.get('type')) {
            filteredData = filteredData.filter((item) => item.type === searchParams.get('type'))
        }

        if (searchParams.get('search')) {
            const searchTerm = searchParams.get('search').toLowerCase()
            filteredData = filteredData.filter((item) => {
                return (
                    item.name.toLowerCase().includes(searchTerm) ||
                    item.owner.toLowerCase().includes(searchTerm) ||
                    item.type.toLowerCase().includes(searchTerm) ||
                    item.brand.toLowerCase().includes(searchTerm)
                )
            })
        }

        if (filteredData.length === 0) {
            hasNoResult = true
        }

        displayedData = filteredData

        // Apply sort - only if there's result in the filtered data
        if (!hasNoResult) {

            sortedData = [...filteredData]

            if (searchParams.get('sortName')) {
                const sortNameVal = searchParams.get('sortName')
                if (sortNameVal === 'true') {
                    sortedData.sort((a, b) => a.name.localeCompare(b.name))
                }
                else if (sortNameVal === 'false') {
                    sortedData.sort((a, b) => b.name.localeCompare(a.name))
                }
            }

            if (searchParams.get('sortPrice')) {
                const sortPriceVal = searchParams.get('sortPrice')
                if (sortPriceVal === 'true') {
                    sortedData.sort((a, b) => a.price - b.price)
                }
                else if (sortPriceVal === 'false') {
                    sortedData.sort((a, b) => b.price - a.price)
                }
            }

            displayedData = sortedData
        }
    }


    // Form the grid if there's data
    let paddlesItems = ""
    let displayedElement = ""
    if (hasData) {

        // Unique paddle types to be passed to <PaddleFilter />
        const paddleTypes = [...new Set(data.map((item) => item.type))]

        // Create card for each item
        paddlesItems = displayedData.map((item) => {

            const paddleTypeClass = `paddle-type ${item.type[0].toLowerCase() + item.type.slice(1)}`
            const paddleTypeJp = translation(item.type)

            return (
                <NavLink
                    to={`/paddles/${item.id}`}
                    key={item.id}
                    state={[...searchParams.entries()]}
                >

                    <div className='paddle-card'>
                        <div className='paddle-img-container'>
                            <img src={item.img} />
                        </div>

                        <div className='paddle-description-container'>
                            <div className='paddle-row-one'>
                                <span className="paddle-name">{item.name}</span>
                                <span className='paddle-owner'>Provided by: {item.owner}</span>
                            </div>
                            <div className='paddle-row-two'>
                                <span className='paddle-price'>MYR {item.price} / day</span>
                            </div>
                            <span className={paddleTypeClass}>{item.type} / {paddleTypeJp}</span>
                            <span className='paddle-brand'>{item.brand}</span>
                        </div>
                    </div>
                </NavLink>
            )
        })

        // Configure the overall grid to be displayed
        displayedElement = (
            <section className='paddles-sec'>
                <span className='paddles-sec-title'>Explore the options!</span>
                <PaddleFilter
                    types={paddleTypes}
                    searchParams={searchParams}
                    setSearchParams={setSearchParams}
                />
                {
                    hasNoResult ?
                        <NotFound isFlexChild={true} /> :
                        <div className='paddles-grid'>
                            {paddlesItems}
                        </div>
                }

            </section>
        )
    }

    // Decide what to be displayed
    return (
        <>
            {isLoading && <Loading />}
            {hasError && <Error error={error} isFlexChild={false} />}
            {hasData && displayedElement}
        </>
    )

}
