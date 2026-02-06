import RatingSummary from '@keyvaluesystems/react-star-rating-summary';
import { FaHeart } from "react-icons/fa";

export default function PaddleReviewSummary({ratingValues}) {

    const ratingColor = {
        5: '#7e3f8f',
        4: '#7e3f8f',
        3: '#7e3f8f',
        2: '#7e3f8f',
        1: '#7e3f8f'
    }

    function getRatingIcon(ratingId) {
        return (
            <div className='rating-icon'>
                <FaHeart />
                <span>{ratingId}</span>
            </div>
        )
    }


    return (
        <RatingSummary
            ratings={ratingValues}
            renderLabel={(ratingId) => getRatingIcon(ratingId)}
            styles={{
                Bar: (ratingId) => {
                    if (ratingValues[ratingId] !== 0) return { backgroundColor: '#7e3f8f' }
                    else return { backgroundColor: '#ffffff' }
                },
                AverageIconsWrapper: { display: 'none' },
                Average: { color: '#7e3f8f' },
                AverageSubTextContainer: { margin: '-10px', color: '#7e3f8f' },
                Count: (id) => ({ color: '#7e3f8f', fontSize: '0.7rem', fontWeight: '600' })
            }}
        />
    )
}