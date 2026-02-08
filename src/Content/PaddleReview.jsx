import "./css/paddlereview.css"
import { heartDisplay } from '../misc/starDisplay';
import { useState, useEffect } from 'react';
import { supabase } from '../supabase/supabase-client';
import PaddleReviewSummary from './PaddleReviewSummary';


export default function PaddleReview({ paddleId }) {

    // state
    const [reviewData, setReviewData] = useState(undefined)
    const [error, setError] = useState(null)

    // derived flag from state
    let isLoading = false
    if (reviewData === undefined) isLoading = true

    // effect
    useEffect(() => {
        async function fetchReviewData() {
            try {
                const { data, error } = await supabase
                    .from('reviews')
                    .select('*, users(name)')
                    .eq('paddle_id', paddleId)
                    .order('created_at', {ascending: false})

                
                if (error) {
                    throw error
                }
                setReviewData(data)
            }
            catch (error) {
                setError(error)
            }
        }

        window.scrollTo(0, 0)
        fetchReviewData()

    }, [])

    
    const ratingValues = {
        5: 0,
        4: 0,
        3: 0,
        2: 0,
        1: 0
    };

    let reviewCard = ""
    if(reviewData && reviewData.length > 0){
        reviewCard = reviewData.map((data) => {
            ratingValues[data.rating] += 1
    
            const dateObj = new Date(data.created_at)
            return (
                <div className='review-comments' key={data?.id}>
                    <div className='reviewer-name'>{data?.users?.name}</div>
                    <div className='reviewer-time'>{dateObj.toLocaleString()}</div>
                    <div className='reviewer-rating'>{heartDisplay(data?.rating)}</div>
                    <div className='reviewer-content'>{data?.comment}</div>
                </div>
            )
        })
    }

    const displayedElement = (
        <div className='review-div'>
            <div className='review-summary'>
                <PaddleReviewSummary ratingValues={ratingValues}/>
            </div>
            <div className='review-area'>
                <div className='review-comments-title'>Reviews from the community / コミュニティのレビュー</div>
                {
                    error ?
                    <div className='review-issue-hint'>{error.name}: {error.message}</div> :
                        isLoading ?
                        <div className='review-issue-hint'>Loading... </div>:
                        reviewData.length > 0 ?
                            reviewCard :
                            <div className="none-review-hint" onClick={(() => { window.scrollTo(0, 0) })}>
                                Try this paddle today!
                            </div>
                }
            </div>
        </div>
    )


    return displayedElement
}
