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
            {reviews && reviews['locationReviews'].map((review, index) => (
                <div key={index}>
                    <h3>Review {index + 1}</h3>
                    <p>Star Rating: {review.review.starRating}</p>
                    <ReviewCard name={review.review.reviewer.displayName??""} comment={review.review.comment}/>
                </div>
                
            ))}
        </div>
    )
}

export default ReviewList