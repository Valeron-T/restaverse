import React from 'react'
import ReviewList from '../components/ReviewList';

function Reviews({ isLoggedin }) {
  return (
    <div className='flex flex-1 flex-col font-poppins'>

      {/* Display message to log in if not logged in */}
      {!isLoggedin ? <div className="flex flex-col m-4 sm:p-6 p-4 rounded-2xl bg-white">
        <h1 className='md:text-5xl sm:text-4xl text-3xl'>Please log in to access this page</h1>
      </div>:null}

      {/* Render reviews if logged in */}
      {isLoggedin && <div className="flex flex-col m-4 sm:p-6 p-4 rounded-2xl bg-white">
        <h1 className='md:text-4xl sm:text-3xl text-2xl pb-2'>Reviews</h1>
        <ReviewList isDetailed={true} />
      </div>}
      
    </div>
  )
}

export default Reviews