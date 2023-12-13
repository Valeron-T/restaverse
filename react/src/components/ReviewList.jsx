import React, { useEffect, useState } from 'react'
import { getTopReviews } from '../services/API'
import ReviewCard from './ReviewCard'

function ReviewList() {
    const [reviews, setreviews] = useState({})

    useEffect(() => {
        var reviewsJSON = getTopReviews().then((v) => setreviews(v))
    }, [])


    return (
        <div>
            {reviews['locationReviews']?.map((review, index) => (
                <div key={index}>
                    <ReviewCard name={review.review.reviewer.displayName} comment={review.review.comment} rating={review.review.starRating} date={review.review.updateTime}/>
                </div>
                
            ))}
        </div>
    )
}

export default ReviewList