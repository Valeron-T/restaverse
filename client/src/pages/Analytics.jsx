import React from 'react'

function Analytics({ isLoggedin }) {
  return (
    <div className='flex flex-1 flex-col font-poppins'>

      {/* Display message to log in if not logged in */}
      {!isLoggedin ? <div className="flex flex-col m-4 sm:p-6 p-4 rounded-2xl dark:bg-[#03212f] dark:text-white bg-white">
        <h1 className='md:text-5xl sm:text-4xl text-3xl'>Please log in to access this page</h1>
      </div>:null}

      {/* Render reviews if logged in */}
      {isLoggedin && <div className="flex flex-col m-4 sm:p-6 p-4 rounded-2xl dark:bg-[#03212f] dark:text-white bg-white">
        <h1 className='md:text-4xl sm:text-3xl text-2xl pb-2'>Coming soon...</h1>
      </div>}
      
    </div>
  )
}

export default Analytics