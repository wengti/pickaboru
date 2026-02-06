
import "./css/paddledescription.css"
import starDisplay from '../misc/starDisplay'
import handleImgError from '../misc/handleImgError'
import { translation } from '../misc/translation'
import { NavLink } from 'react-router'
import { supabase } from '../supabase/supabase-client'
import DatePicker from './DatePicker'
import { useState } from 'react'
import getDateAtMidnight from '../misc/handleDate'



export default function PaddleDescription({ paddleItem }) {

    // state
    let tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)

    const [dateValue, setDateValue] = useState([tomorrow, tomorrow])
    const [error, setError] = useState([null])

    async function handleRent() {
        try {
            
        }
        catch (error) {
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
                <button className='btn rent-btn' onClick={() => { handleRent() }}>
                    Rent this paddle
                </button>
            </div>
        </div>
    )
}