import { NavLink } from 'react-router'
import { GoStar, GoStarFill } from "react-icons/go";
import "./css/dashboardcommentbox.css"
import { heartDisplay } from '../misc/starDisplay';

export default function DashboardCommentBox({ reviewObj, title }) {
    console.log(reviewObj)
    const { items: paddle, reviews, buyer_data } = reviewObj
    const review = reviews[0]
    return (
        <NavLink to={`/paddles/${paddle.id}`} className='summary-comment-box'>
            <span className='summary-comment-title'>{title}</span>
            <div className='summary-comment-content'>
                <div className='summary-comment-img'>
                    <img src={paddle.img} />
                </div>
                <div className='summary-comment-main'>
                    <div className='summary-comment-rating'>
                        {heartDisplay(review.rating)}
                    </div>
                    <div className="summary-comment-quotation">
                        <div className="summary-comment-open-quotation">“</div>
                        <div className="summary-comment-quotation-text">
                            {review.comment}
                        </div>
                        <div className="summary-comment-close-quotation">”</div>
                    </div>
                    <div className="summary-comment-quotation-reviewer">
                        <span>By {buyer_data.name} </span>
                        <span>on your {paddle.name}</span>
                    </div>
                </div>
            </div>
        </NavLink>
    )
}