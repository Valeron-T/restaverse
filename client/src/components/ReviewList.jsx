import React, { useEffect, useState } from 'react'
import { getTopReviews } from '../services/API'
import ReviewCard from './ReviewCard'
import DetailedReviewCard from './DetailedReviewCard'

function ReviewList({ isDetailed, selectedlocation }) {
    const [reviews, setreviews] = useState()

    useEffect(() => {
        // console.log(selectedlocation)
        if (selectedlocation != "all") {
            getTopReviews().then(review => review['locationReviews'].filter(review => review['name'] == selectedlocation)).then(v => setreviews(v))
        } else {
            getTopReviews().then(review => review['locationReviews']).then(v => setreviews(v))
        }
        
    }, [selectedlocation])


    return (
        <div>
            {/* <p>{reviews?.map(item => item.review.name)}</p> */}
            {reviews?.map((review, index) => (
                <div key={index}>
                    {isDetailed ? <DetailedReviewCard currentReplyDate={review.review.reviewReply?.updateTime} currentReply={review.review.reviewReply?.comment} rid={review.review.name} name={review.review.reviewer.displayName} comment={review.review.comment} rating={review.review.starRating} modifiedDate={review.review.updateTime} createdDate={review.review.createTime} />
                        : <ReviewCard rid={review.review.name} name={review.review.reviewer.displayName} comment={review.review.comment} rating={review.review.starRating} date={review.review.updateTime} />
                    }
                </div>

            ))}
        </div>
    )
}

export default ReviewList