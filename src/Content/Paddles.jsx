import "../index.css"
import "./css/paddles.css"
import { supabase } from '../supabase/supabase-client'
import { NavLink } from 'react-router'
import { useState, useEffect } from 'react'
import Loading from '../Utils/Loading'
import Error from '../Utils/Error'


export default function Paddles() {

    // State
    const [data, setData] = useState(null)
    const [error, setError] = useState(null)

    // Effect
    useEffect( () => {
        
        async function fetchData(){
            try{
                const {data: fetchedData, error} = await supabase.from('items').select()
                if(error){
                    throw error
                }
                setError(null)
                setData(fetchedData)
            }
            catch(err){
                setError(err)
            }
        }

        fetchData()
        
    }, [])

    // Derived flag from state
    let isLoading = false
    let hasError = false
    let hasData = false

    if(error){
        hasError = true
    }
    else if (data === null) {
        isLoading = true
    }
    else if (data?.length > 0) {
        hasData = true
    }


    // Form the grid if there's data
    let paddlesItems = ""
    let displayedElement = ""
    if (hasData) {
        paddlesItems = data.map((item) => {

            let paddleTypeClass = `paddle-type `
            let paddleTypeJp = ''

            if (item.type === 'Power') {
                paddleTypeClass += 'power'
                paddleTypeJp = 'パワー'
            }
            else if (item.type === 'Control') {
                paddleTypeClass += 'control'
                paddleTypeJp = 'コントロール'
            }
            else if (item.type === 'Balanced') {
                paddleTypeClass += 'balanced'
                    paddleTypeJp = 'バランス'
            }
            
            return (
                <NavLink
                    to={`/paddles/${item.id}`}
                    key={item.id}
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

        displayedElement = (
            <section className='paddles-sec'>
                <span className='paddles-sec-title'>Explore the options!</span>
                <div className='paddles-grid'>
                    {paddlesItems}
                </div>
            </section>
        )
    }

    // Decide what to be displayed
    return(
        <>
            {isLoading && <Loading />}
            {hasError && <Error error={error} isFlexChild={false}/>}
            {hasData && displayedElement}
        </>
    )

}
