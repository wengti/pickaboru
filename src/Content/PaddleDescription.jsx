
import "./css/paddledescription.css"
import starDisplay from '../misc/starDisplay'
import handleImgError from '../misc/handleImgError'
import { translation } from '../misc/translation'
import { NavLink, useNavigate } from 'react-router'
import { supabase } from '../supabase/supabase-client'
import DatePicker from './DatePicker'
import { useState } from 'react'
import { getDateRangeForSupabase } from '../misc/handleDate'
import { useCurrentUser } from '../Auth/CurrentUserProvider'

// check if its a user


export default function PaddleDescription({ paddleItem }) {

    // state
    let tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)

    const [dateValue, setDateValue] = useState([tomorrow, tomorrow])
    const [error, setError] = useState(null)

    // session
    const { currentUser } = useCurrentUser()

    // navigate
    const navigate = useNavigate()

    async function handleRent() {
        try {

            if (currentUser === null){
                throw {name: "Invalid credentials", message: "Please sign in first."}
            }
            
            const rentEntry = {
                paddle_id: paddleItem.id,
                buyer_id: currentUser.id,
                seller_id: paddleItem.user_id,
                date_range: getDateRangeForSupabase(dateValue),
                is_reviewed: false
            }
            
            const {error} = await supabase
                .from('orders')
                .insert(rentEntry)

            if(error){
                console.log(error)
                throw error
            }
            navigate('/user/orders')

        }
        catch (error) {
            console.log(error)
            setError(error)
        }
    }

    const paddleTypeClass = `paddle-type ${paddleItem.type[0].toLowerCase() + paddleItem.type.slice(1)}`
    const paddleTypeJp = translation(paddleItem.type)

    return (
        <div className='paddle-div'>
            <div className='paddle-img-div'>
                <img src={paddleItem.img} onError={(event) => { handleImgError(event) }} />
            </div>
            <div className='paddle-detail-div'>
                <div className='tag-div'>
                    <span className='paddle-brand'>{paddleItem.brand}</span>
                    <span className={paddleTypeClass}>{paddleItem.type} / {paddleTypeJp}</span>
                </div>
                <span className='paddle-name'>{paddleItem.name}</span>
                <span className='paddle-owner'>{paddleItem.users.name}, {paddleItem.users.location}</span>
                <div className='paddle-condition'>
                    <span className='condition-text'>Condition: </span>
                    <div className='condition-star'>{starDisplay(paddleItem.condition)}</div>
                </div>
                <span className='paddle-price'>MYR{paddleItem.price} per day</span>
                <span className='paddle-desc'>{paddleItem.description}</span>

                <DatePicker dateState={{ dateValue, setDateValue }} paddleItem={paddleItem} />
                {paddleItem.status === 'listed' ?
                    <button className='btn rent-btn' onClick={() => { handleRent() }}>
                        Rent this paddle
                    </button> :
                    <button className='btn rent-btn not-available-btn' disabled>
                        Currently Not Available
                    </button> 
                }
                {
                    error &&
                    <span className='rent-error'>{error.name || error.details}: {error.message}</span>
                }
            </div>
        </div>
    )
}