
import "./css/paddledescription.css"
import starDisplay from '../misc/starDisplay'
import handleImgError from '../misc/handleImgError'
import { translation } from '../misc/translation'
import { NavLink } from 'react-router'

export default function PaddleDescription({paddleItem}) {

    const paddleTypeClass = `paddle-type ${paddleItem.type[0].toLowerCase() + paddleItem.type.slice(1)}`
    const paddleTypeJp = translation(paddleItem.type)

    return (
        <div className='paddle-div'>
            <div className='paddle-img-div'>
                <img src={paddleItem.img} onError={(event) => { handleImgError(event) }} />
            </div>
            <div className='paddle-detail-div'>
                <div className='tag-div'>
                    <span className={paddleTypeClass}>{paddleItem.type} / {paddleTypeJp}</span>
                    <span className='paddle-brand'>{paddleItem.brand}</span>
                </div>
                <span className='paddle-name'>{paddleItem.name}</span>
                <span className='paddle-owner'>{paddleItem.users.name}, {paddleItem.users.location}</span>
                <div className='paddle-condition'>
                    <span className='condition-text'>Condition: </span>
                    <div className='condition-star'>{starDisplay(paddleItem.condition)}</div>
                </div>
                <span className='paddle-price'>MYR{paddleItem.price} per day</span>
                <span className='paddle-desc'>{paddleItem.description}</span>
                <NavLink className='btn'>
                    Rent this paddle
                </NavLink>
            </div>
        </div>
    )
}