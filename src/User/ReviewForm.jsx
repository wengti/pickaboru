import "./css/yourpaddles.css"
import { useRef, useState } from 'react'
import { styled } from '@mui/material/styles';
import Rating from '@mui/material/Rating';
import Box from '@mui/material/Box';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { supabase } from '../supabase/supabase-client';
import { useCurrentUser } from '../Auth/CurrentUserProvider';

export default function ReviewForm({ paddle, order }) {

    // state
    const [error, setError] = useState(null)
    const [reviewText, setReviewText] = useState("")
    const [reviewVal, setReviewVal] = useState(0)
    const [isFormSubmitted, setIsFormSubmitted] = useState(false)

    // currentUser
    const {currentUser} = useCurrentUser()

    // Color for rating group
    const StyledRating = styled(Rating)({
        '& .MuiRating-iconFilled': {
            color: '#7e3f8f',
        },
        '& .MuiRating-iconHover': {
            color: '#7e3f8f',
        },
    });

    const boxStyles = {
        width: 'content-fit',
        display: 'flex',
        alignItems: 'center',
        marginTop: '0.1em'
    }

    // function
    async function handleReview() {

        // Handle error
        if (reviewText === "") {
            setError({ name: 'No review', message: 'Please provide a review before submitting.' })
            return
        }
        else if (reviewVal === 0) {
            setError({ name: 'No rating', message: 'Please provide a rating before submitting.' })
            return
        }

        const {error} = await supabase
            .from('reviews')
            .insert({
                paddle_id: paddle.id,
                reviewer_id: currentUser?.id,
                comment: reviewText,
                rating: reviewVal,
                order_id: order.id
            })
        
        if(error){
            throw error
        }

        setIsFormSubmitted(true)


    }

    return (
        isFormSubmitted ?
        <span>Review submitted! Thank you / ありがとうございます!</span>:
        <div className='feedback-form'>
            <div style={{ display: 'flex', gap: '0.5em' }}>
                <label className='feedback-title'>
                    Rate & Review:
                    <Box sx={boxStyles}>
                        <StyledRating
                            name="hover-feedback"
                            value={reviewVal}
                            onChange={(_event, newValue) => {
                                setReviewVal(newValue);
                            }}
                            icon={<FavoriteIcon fontSize="inherit" />}
                            emptyIcon={<FavoriteBorderIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                        />
                    </Box>
                </label>

            </div>
            <div className='feedback-div'>
                <textarea
                    maxLength="100"
                    placeholder="i.e. I love the experience..."
                    onChange={(event) => { setReviewText(event.target.value) }}
                >
                    {reviewText}
                </textarea>
                <div className='feedback-btn-div'>
                    <button className='feedback-list-btn expanded' onClick={() => { handleReview() }}>Add</button>
                </div>
            </div>

            {
                error &&
                <span className='feedback-error'>
                    {error.name}: {error.message}
                </span>
            }
        </div>
    )
}